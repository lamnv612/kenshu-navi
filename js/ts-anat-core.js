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

  function build(spec) {
    style('tsan', `
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
    .an-parts rt,.an-info rt{font-size:.5em;font-weight:700}
    .an-info b{color:var(--pc,var(--ts))}`);
    const box = h('div', { class: 'an-box' }), inner = h('div', { style: { display: 'inline-block', textAlign: 'left' } });
    // 前後の空白・改行は光らせない（中身の文字だけ光る）
    const toks = spec.tokens.map(([t]) => {
      const m = t.match(/^(\s*)([\s\S]*?)(\s*)$/);
      const core = h('span', { class: 'tk' }, m[2]);
      inner.append(document.createTextNode(m[1]), core, document.createTextNode(m[3]));
      return core;
    });
    box.append(inner);
    const info = h('div', { class: 'an-info' }, '👆 パーツにカーソルを乗せてね（名前と役割が出る）');
    const bar = h('div', { class: 'an-parts' });
    const lit = (key) => {
      const p = key ? spec.parts[key] : null;
      box.classList.toggle('dim', !!key);
      toks.forEach((tk, i) => { const on = !!key && spec.tokens[i][1].includes(key); tk.classList.toggle('lit', on); tk.style.setProperty('--pc', p ? p[1] : 'var(--ts)'); });
      bar.querySelectorAll('button').forEach((b) => b.classList.toggle('lit', b.dataset.k === key));
      info.style.setProperty('--pc', p ? p[1] : 'var(--ts)');
      info.innerHTML = p ? `<b>${K.ruby ? K.ruby(p[0]) : p[0]}</b>：${K.ruby ? K.ruby(p[2]) : p[2]}` : '👆 パーツにカーソルを乗せてね（名前と役割が出る）';
    };
    Object.entries(spec.parts).forEach(([k, p]) => bar.append(h('button', { 'data-k': k, style: { '--pc': p[1] }, onmouseenter: () => lit(k), onfocus: () => lit(k), onclick: () => lit(k) }, h('span', { html: K.ruby ? K.ruby(p[0]) : p[0] }))));
    toks.forEach((tk, i) => { const ks = spec.tokens[i][1]; if (ks.length) { tk.addEventListener('mouseenter', () => lit(ks[0])); tk.style.cursor = 'pointer'; tk.addEventListener('click', () => lit(ks[0])); } });
    box.addEventListener('mouseleave', () => lit(null));
    return h('div', { class: 'an-sec' }, h('h4', spec.title || '🔍 構文の解剖：パーツの名前を覚えよう'), box, bar, info);
  }
  K.tsAnatBuild = build;
})();
