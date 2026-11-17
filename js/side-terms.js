/* 画面が広いとき、TypeScript のシーンの右側に「用語・読み方・現場のヒント」パネルを出す。
   用語は、そのシーンに実際に出てくるもの（用語ツールチップが付いた語）から自動で集める。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.W) return;
  const { h, style } = K.W;
  style('side', `
  @media(min-width:1700px){
    .main.wide{max-width:1560px}
    .scene.hasside{position:relative;padding-right:336px}
    .scene.hasside>aside.side{display:grid}
  }
  aside.side{display:none;position:absolute;top:64px;right:0;width:312px;gap:12px;align-content:start;z-index:2}
  .sd-card{border-radius:12px;background:var(--card);border:1px solid var(--line);overflow:hidden}
  .sd-card>h5{padding:.55em .9em;font:900 .84rem var(--font);background:color-mix(in srgb,var(--c) 14%,var(--card2));color:var(--c);border-bottom:1px solid var(--line)}
  .sd-term{padding:.55em .9em;border-top:1px solid var(--line);cursor:default}.sd-term:first-of-type{border-top:0}
  .sd-term:hover{background:color-mix(in srgb,var(--c) 8%,transparent)}
  .sd-term b{font:800 .88rem var(--mono);color:var(--text)}.sd-term i{font-style:normal;margin-left:.5em;font:800 .75rem var(--font);color:var(--c)}
  .sd-term p{margin-top:2px;font:700 .78rem/1.55 var(--font);color:var(--mute)}
  .sd-tip{padding:.6em .9em;border-top:1px solid var(--line);font:700 .8rem/1.65 var(--font)}.sd-tip:first-of-type{border-top:0}.sd-tip b{font-family:var(--mono)}
  .sd-note{padding:.65em .9em;font:700 .78rem/1.6 var(--font);color:var(--mute)}`);

  K.sideTerms = function (el, body, L, S) {
    el.__title = S && S.t;
    if (!L || !(L.track === 'ts' || /^x-ts|^x-js|^x-async/.test(L.id))) return;
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
      const nameOf = (e) => e.shown && e.shown !== e.k ? e.shown : e.k;
      const origin = (e) => { const y = K.yomiOf ? K.yomiOf(e.k) : ''; return y && y.split('｜')[1] ? y.split('｜')[1] : ''; };
      const cards = [
        h('div', { class: 'sd-card', style: { '--c': 'var(--ts)' } }, h('h5', '📚 このシーンの用語（読み方）'),
          ...terms.map((e) => h('div', { class: 'sd-term' }, h('b', nameOf(e)), reading(e) ? h('i', reading(e)) : null, h('p', (origin(e) ? origin(e) + '　' : '') + (e.m || ''))))),
      ];
      const tips = terms.filter((e) => e.r).slice(0, 3);
      if (tips.length) cards.push(h('div', { class: 'sd-card', style: { '--c': 'var(--ok)' } }, h('h5', '💡 現場では'), ...tips.map((e) => h('div', { class: 'sd-tip' }, h('b', e.k + '：'), e.r))));
      cards.push(h('div', { class: 'sd-card', style: { '--c': 'var(--violet)' } }, h('div', { class: 'sd-note' }, '👆 コードや図の上の用語にカーソルを乗せても、同じ説明が出ます。')));
      el.append(h('aside', { class: 'side' }, ...cards));
      el.classList.add('hasside'); if (mainEl) mainEl.classList.add('wide');
    };
    [350, 1400].forEach((t) => setTimeout(() => { if (el.isConnected) build(); }, t));
  };
})();
