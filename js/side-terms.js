/* 画面が広いとき、TypeScript のシーンの右側に「用語・読み方・現場のヒント」パネルを出す。
   用語は、そのシーンに実際に出てくるもの（用語ツールチップが付いた語）から自動で集める。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.W) return;
  const { h, style } = K.W;
  style('side', `
  @media(min-width:1700px){
    .main.wide,.main:has(>.scene.hasside){max-width:none;position:relative}
    .scene.hasside{padding-right:408px}
    .scene.hasside.closed{padding-right:0}
    .scene.hasside>aside.side{display:grid}
  }
  aside.side{display:none;position:absolute;top:0;right:clamp(18px,3vw,40px);width:312px;gap:12px;align-content:start;z-index:2}
  .scene.hasside.closed>aside.side{width:auto}.scene.hasside.closed>aside.side>.sd-card{display:none}
  .sd-tg{all:unset;cursor:pointer;display:flex;align-items:center;gap:.4em;justify-self:end;padding:.35em .8em;border-radius:999px;border:1px solid var(--line);background:var(--card);font:800 .78rem var(--font);color:var(--mute);transition:.2s}
  .sd-tg:hover{color:var(--text);border-color:var(--ts)}.sd-tg .ic{width:15px;height:15px}
  .sd-card{border-radius:12px;background:var(--card);border:1px solid var(--line);overflow:hidden}
  .sd-card>h5{padding:.55em .9em;font:900 .84rem var(--font);background:color-mix(in srgb,var(--c) 14%,var(--card2));color:var(--c);border-bottom:1px solid var(--line)}
  .sd-term{padding:.55em .9em;border-top:1px solid var(--line);cursor:default}.sd-term:first-of-type{border-top:0}
  .sd-term:hover{background:color-mix(in srgb,var(--c) 8%,transparent)}
  .sd-term b.gl{color:var(--team);border-bottom:1px dotted var(--team);cursor:help}
  .sd-hd{display:flex;align-items:baseline;justify-content:space-between;gap:10px}.sd-term b{font:800 .9rem var(--mono);color:var(--team)}.sd-term i{font-style:normal;font:800 .95rem var(--font);color:var(--c);text-align:right;white-space:nowrap}
  .sd-term p{margin-top:2px;font:700 .78rem/1.55 var(--font);color:var(--mute)}
  .sd-tip{padding:.6em .9em;border-top:1px solid var(--line);font:700 .8rem/1.65 var(--font)}.sd-tip:first-of-type{border-top:0}.sd-tip b{font-family:var(--mono)}
  .sd-note{padding:.65em .9em;font:700 .78rem/1.6 var(--font);color:var(--mute)}`);

  const isTs = (L) => L && (L.track === 'ts' || /^x-ts|^x-js|^x-async/.test(L.id));
  /* 描画の前に、右の余白をあらかじめ空けておく（図の幅の測り直しを防ぐ） */
  K.sidePre = function (el, L) {
    if (!isTs(L) || !window.matchMedia('(min-width:1700px)').matches) return;
    let open = true; try { open = localStorage.getItem('kenshu.side') !== '0'; } catch (e) {}
    el.classList.add('hasside'); el.classList.toggle('closed', !open);
    if (el.parentElement) el.parentElement.classList.add('wide');
  };
  K.sideTerms = function (el, body, L, S) {
    el.__title = S && S.t;
    if (!isTs(L)) return;
    const mainEl = el.parentElement;
    const build = () => {
      const old = el.querySelector(':scope > aside.side'); if (old) old.remove();
      const seen = new Map();
      body.querySelectorAll('[data-gk][data-gt="word"]').forEach((n) => {
        const k = n.getAttribute('data-gk'); if (seen.has(k)) return;
        const e = K.glossEntry && K.glossEntry(k, 'word'); if (e) seen.set(k, e);
      });
      // 1) この図解（解剖図）のパーツ  2) シーンに出てくる用語
      const sp = K.tsAnatSpecs && K.tsAnatSpecs[el.__title];
      const terms = [];
      if (sp) Object.values(sp.parts).forEach(([nm, , desc]) => {
        const kw = (nm.match(/[（(]([^）)]+)[）)]/) || [])[1] || nm;
        terms.push({ k: kw.replace(/[()（）]/g, ''), m: desc, shown: nm });
      });
      seen.forEach((e) => { if (!terms.some((t) => t.k === e.k)) terms.push(e); });
      terms.splice(8);
      if (terms.length < 2) { el.classList.remove('hasside'); return; }
      const reading = (e) => { const y = K.yomiOf ? K.yomiOf(e.k) : ''; return y ? y.split('｜')[0] : ''; };
      const yom = (e) => { const y = K.yomiOf ? K.yomiOf(e.k) : ''; return y ? y.split('｜')[0] : ''; };
      const origin = (e) => { const y = K.yomiOf ? K.yomiOf(e.k) : ''; return y && y.split('｜')[1] ? y.split('｜')[1] : ''; };
      const nameOf = (e) => (e.shown && e.shown !== e.k ? e.shown : e.k);
      // 右端に出す読み：日本語の用語 → ひらがな / 英語のキーワード → カタカナ
      const readingOf = (e) => {
        const ja = K.kana ? K.kana(nameOf(e).replace(/[（(][^）)]*[）)]/g, '')) : '';
        const en = yom(e);
        return [ja, en].filter(Boolean).join('　');
      };
      // 用語にカーソルを乗せると、HTML/CSS の用語と同じツールチップを出す
      const nameEl = (e) => {
        const key = nameOf(e), kind = e.shown ? 'part' : (e.kind || 'word');
        if (e.shown && K.glossAdd) K.glossAdd([{ k: key, kind: 'part', m: e.m, y: readingOf(e).replace(/　/g, ' / '), t: '用語' }]);
        const b = h('b', { class: 'gl', tabindex: '0', 'data-gk': key, 'data-gt': kind }, key);
        return b;
      };
      const cards = [
        h('div', { class: 'sd-card', style: { '--c': 'var(--ts)' } }, h('h5', '📚 このシーンの用語（読み方）'),
          ...terms.map((e) => h('div', { class: 'sd-term' }, h('div', { class: 'sd-hd' }, nameEl(e), readingOf(e) ? h('i', readingOf(e)) : null), h('p', (origin(e) ? origin(e) + '　' : '') + (e.m || ''))))),
      ];
      const tips = terms.filter((e) => e.r).slice(0, 3);
      if (tips.length) cards.push(h('div', { class: 'sd-card', style: { '--c': 'var(--ok)' } }, h('h5', '💡 現場では'), ...tips.map((e) => h('div', { class: 'sd-tip' }, h('b', e.k + '：'), e.r))));
      cards.push(h('div', { class: 'sd-card', style: { '--c': 'var(--violet)' } }, h('div', { class: 'sd-note' }, '👆 コードや図の上の用語にカーソルを乗せても、同じ説明が出ます。')));
      let open = true; try { open = localStorage.getItem('kenshu.side') !== '0'; } catch (e) {}
      const tg = h('button', { class: 'sd-tg', type: 'button' });
      const paint = () => { el.classList.toggle('closed', !open); tg.replaceChildren(K.W.icon(open ? 'chevron-right' : 'chevron-left'), open ? '閉じる' : '用語パネルを開く'); tg.title = open ? 'パネルを閉じる' : 'パネルを開く'; };
      tg.addEventListener('click', () => { open = !open; try { localStorage.setItem('kenshu.side', open ? '1' : '0'); } catch (e) {} paint(); });
      el.append(h('aside', { class: 'side' }, tg, ...cards));
      el.classList.add('hasside'); if (mainEl) mainEl.classList.add('wide'); paint();
    };
    [350, 1400].forEach((t) => setTimeout(() => { if (el.isConnected) build(); }, t));
  };
})();
