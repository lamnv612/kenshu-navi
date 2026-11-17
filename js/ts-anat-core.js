/* 「構文の解剖」パーツ：1行のコードを部品に分けて、ホバー（または押す）で名前と意味を出す。
   K.tsAnat('シーン名', {
     tokens: [ ['const', ['kw']], [' price', ['name']], [': number', ['colon', 'type']], ... ],   // [文字, [所属するパーツのキー…]]（改行は \n）
     parts:  { kw: ['宣言', 'var(--basic)', '説明（1文）'], ... },                              // 表示順 = 並び順
     title?: '見出し（省略可）'
   })
   登録だけ行い、各シーンの先頭へ差し込むのは ts-anat-apply.js（最後に読み込む）。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.W) return;
  const { h, style } = K.W;
  const SPECS = {};
  K.tsAnat = (title, spec) => { SPECS[title] = spec; };
  K.tsAnatSpecs = SPECS;

  function buildOne(spec) {
    style('tsan', `
    .an-tabs{display:flex;gap:8px;margin-bottom:10px}.an-tabs button{all:unset;cursor:pointer;padding:.45em 1.2em;border-radius:10px;border:1px solid var(--line);background:var(--card);font-weight:800;font-size:.88rem}.an-tabs button.on{border-color:var(--ts);background:color-mix(in srgb,var(--ts) 18%,var(--card))}
    .an-sec{margin-bottom:22px}
    .an-sec>h4{font:900 1.05rem var(--font);margin-bottom:10px}
    .an-box{padding:26px 16px;border-radius:14px;background:var(--code);overflow:auto;text-align:center;white-space:pre;font:700 1.45rem/1.9 var(--mono);color:#d8dcff;transition:.3s}
    @media(max-width:700px){.an-box{font-size:1.05rem;text-align:left}}
    .an-box .tk{border-radius:8px;padding:.05em .08em;transition:.25s;cursor:default;border-bottom:2px dotted transparent}
    .an-box.dim .tk{opacity:.28}.an-box .tk.lit{opacity:1;background:color-mix(in srgb,var(--pc) 28%,transparent);border-bottom-color:var(--pc);color:#fff;box-shadow:0 0 0 2px color-mix(in srgb,var(--pc) 55%,transparent)}
    .an-parts{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:14px 0 10px}
    .an-parts button{all:unset;cursor:pointer;padding:.4em 1em;border-radius:10px;border:2px solid var(--pc);background:transparent;font-weight:800;font-size:.9rem;color:var(--pc);transition:.2s}
    .an-parts button:hover,.an-parts button.lit{background:color-mix(in srgb,var(--pc) 22%,transparent);transform:translateY(-2px)}
    .an-info{padding:.8em 1em;border-radius:10px;background:color-mix(in srgb,var(--ts) 10%,var(--card));border:1px solid color-mix(in srgb,var(--ts) 35%,var(--line));font-weight:700;line-height:1.7;min-height:3.2em}
    .an-info b{color:var(--pc,var(--ts))}
    .an-split{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:14px;align-items:start}
    @media(max-width:900px){.an-split{grid-template-columns:1fr}}
    .an-split .an-box{text-align:left;font-size:.95rem;line-height:1.75;padding:16px 18px}
    .an-split .an-parts{flex-direction:column;align-items:stretch;justify-content:flex-start;margin:0 0 10px;gap:6px}
    .an-split .an-parts button{text-align:left;padding:.45em .9em}
    .an-split .an-info{min-height:5em}
    .an-flow{margin-top:10px;padding:12px;border-radius:12px;border:1px solid var(--line);background:var(--card);display:grid;gap:4px}
    .an-fh{font:900 .8rem var(--font);color:var(--mute);margin-bottom:4px}
    .an-fn{display:flex;gap:10px;align-items:center;padding:8px 10px;border-radius:10px;border:2px solid var(--line);cursor:pointer;transition:.2s}
    .an-fn i{font-style:normal;font-size:1.5rem}.an-fn small{display:block;color:var(--mute);font-weight:700;font-size:.7rem}
    .an-fn.on{border-color:var(--pc);background:color-mix(in srgb,var(--pc) 18%,var(--card));transform:translateX(4px)}
    .an-fe{margin-left:18px;padding:2px 0;font:800 .7rem var(--font);color:var(--team)}
    .an-fo{margin-top:6px;padding:8px 10px;border-radius:8px;background:var(--card2);font:800 .76rem var(--font);color:var(--mute)}`);
    const box = h('div', { class: 'an-box' }), inner = h('div', { style: { display: 'inline-block', textAlign: 'left' } });
    // 前後の空白・改行は光らせない（中身の文字だけ光る）。全文を先に色付けしてから、各パーツの範囲を <span class="tk"> で包む
    const full = spec.tokens.map(([t]) => t).join('');
    const lang = spec.lang || (/<template|<script|<style/.test(full) ? 'vue' : /^\s*\$|npm |^#/.test(full) ? 'sh' : 'ts');
    let toks;
    if (K.W && K.W.hl) {
      inner.innerHTML = full.split('\n').map((l) => K.W.hl(l, lang)).join('\n');
      const list = () => { const out = [], w = document.createTreeWalker(inner, NodeFilter.SHOW_TEXT); let off = 0; while (w.nextNode()) { const n = w.currentNode; out.push({ n, s: off, e: off + n.nodeValue.length }); off += n.nodeValue.length; } return out; };
      let pos = 0; const rg = spec.tokens.map(([t]) => { const m = t.match(/^(\s*)([\s\S]*?)(\s*)$/); const s0 = pos + m[1].length, e0 = s0 + m[2].length; pos += t.length; return [s0, e0]; });
      [...new Set(rg.flat())].sort((a, b) => b - a).forEach((c) => { const x = list().find((o) => o.s < c && c < o.e); if (x) x.n.splitText(c - x.s); });
      list().forEach((o) => { const ti = rg.findIndex(([a, b]) => b > a && o.s >= a && o.e <= b); if (ti >= 0 && o.e > o.s) { const sp = document.createElement('span'); sp.className = 'tk'; sp.dataset.ti = ti; o.n.replaceWith(sp); sp.append(o.n); } });
      toks = spec.tokens.map((_, i) => [...inner.querySelectorAll('.tk[data-ti="' + i + '"]')]);
    } else {
      toks = spec.tokens.map(([t]) => { const m = t.match(/^(\s*)([\s\S]*?)(\s*)$/); const core = h('span', { class: 'tk' }, m[2]); inner.append(document.createTextNode(m[1]), core, document.createTextNode(m[3])); return [core]; });
    }
    try { inner.contentEditable = 'plaintext-only'; if (inner.contentEditable !== 'plaintext-only') inner.contentEditable = 'true'; } catch (e) { /* 編集できない環境 */ }
    inner.spellcheck = false;
    box.append(inner);
    const info = h('div', { class: 'an-info' }, '👆 パーツにカーソルを乗せてね（名前と役割が出る）');
    const bar = h('div', { class: 'an-parts' });
    let flowEl = null;
    if (spec.flow) {
      flowEl = h('div', { class: 'an-flow' }, h('div', { class: 'an-fh' }, spec.flow.title || '部品どうしのつながり'));
      spec.flow.nodes.forEach(([k, ic, lb, sub], i) => {
        const pc = spec.parts[k] ? spec.parts[k][1] : 'var(--ts)';
        flowEl.append(h('div', { class: 'an-fn', 'data-k': k, style: { '--pc': pc }, onmouseenter: () => lit(k), onclick: () => lit(k) }, h('i', ic), h('span', null, h('b', lb), h('small', sub))));
        if (spec.flow.edges && spec.flow.edges[i]) flowEl.append(h('div', { class: 'an-fe' }, '▼ ' + spec.flow.edges[i]));
      });
      if (spec.flow.order) flowEl.append(h('div', { class: 'an-fo' }, spec.flow.order));
    }
    const lit = (key) => {
      const p = key ? spec.parts[key] : null;
      box.classList.toggle('dim', !!key);
      toks.forEach((tk, i) => { const on = !!key && spec.tokens[i][1].includes(key); tk.forEach((el) => { el.classList.toggle('lit', on); el.style.setProperty('--pc', p ? p[1] : 'var(--ts)'); }); });
      bar.querySelectorAll('button').forEach((b) => b.classList.toggle('lit', b.dataset.k === key));
      info.style.setProperty('--pc', p ? p[1] : 'var(--ts)');
      const esc2 = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      info.innerHTML = p ? `<b>${esc2(p[0])}</b>：${esc2(p[2])}` : '👆 パーツにカーソルを乗せてね（名前と役割が出る）';
      if (flowEl) flowEl.querySelectorAll('.an-fn').forEach((n) => n.classList.toggle('on', n.dataset.k === key));
    };
    Object.entries(spec.parts).forEach(([k, p]) => bar.append(h('button', { 'data-k': k, style: { '--pc': p[1] }, onmouseenter: () => lit(k), onfocus: () => lit(k), onclick: () => lit(k) }, p[0])));
    toks.forEach((tk, i) => { const ks = spec.tokens[i][1]; if (ks.length) tk.forEach((el) => { el.addEventListener('mouseenter', () => lit(ks[0])); el.style.cursor = 'pointer'; el.addEventListener('click', () => lit(ks[0])); }); });
    box.addEventListener('mouseleave', () => lit(null));
    if (spec.split) return h('div', { class: 'an-sec' }, h('h4', spec.title || '🔍 構文の解剖：パーツの名前を覚えよう'), h('div', { class: 'an-split' }, box, h('div', null, bar, info, flowEl)));
    return h('div', { class: 'an-sec' }, h('h4', spec.title || '🔍 構文の解剖：パーツの名前を覚えよう'), box, bar, info);
  }
  /* spec.more（別のスペック配列）があれば、タブで切り替えられる */
  K.tsAnatBuild = function (spec) {
    const list = [spec].concat(spec.more || []);
    if (list.length === 1) return buildOne(spec);
    const wrap = h('div'), tabs = h('div', { class: 'an-tabs' }), body = h('div');
    const show = (i) => { tabs.querySelectorAll('button').forEach((b, k) => b.classList.toggle('on', k === i)); body.replaceChildren(buildOne(list[i])); };
    list.forEach((sp, i) => tabs.append(h('button', { onclick: () => show(i) }, sp.tab || ('例' + (i + 1)))));
    wrap.append(tabs, body); show(0);
    return wrap;
  };
})();
