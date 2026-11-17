/* コードの中の import 行をクリックすると、そのファイルの中身を開く。
   K.linkFiles(pre, map, onOpen)
     map   : { 'importに書かれたパスの一部': ['表示するファイル名', 'ファイルの中身', 'lang'] }
     onOpen: (key) => … を渡すと、モーダルの代わりに自分で開く（フォルダ探索など） */
(function () {
  const K = window.KENSHU;
  if (!K || !K.W) return;
  const { h, code, style, modal } = K.W;
  style('flk', `
  pre.code .ln.fl{cursor:pointer}pre.code .ln.fl:hover{background:color-mix(in srgb,var(--team) 22%,transparent)}
  pre.code .ln.fl::after{content:' ↗ 開く';font:800 .66rem var(--font);color:var(--team);opacity:.0;margin-left:.8em;transition:.2s}
  pre.code .ln.fl:hover::after{opacity:1}
  .fl-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-top:6px}
  .fl-chips>span{font:800 .72rem var(--font);color:var(--mute)}
  .fl-chip{all:unset;cursor:pointer;padding:.25em .8em;border-radius:8px;border:2px solid var(--team);background:color-mix(in srgb,var(--team) 12%,var(--card2));font:800 .76rem var(--mono);transition:.2s}
  .fl-chip:hover{transform:translateY(-2px);background:color-mix(in srgb,var(--team) 28%,var(--card2))}`);
  const find = (text, map) => Object.keys(map).find((k) => /\bfrom\s+['"]/.test(text) && text.includes(k + "'") || text.includes(k + '"'));
  const open = (k, map, onOpen) => {
    if (onOpen) { onOpen(k); return; }
    const [name, src, lang] = map[k];
    modal({ title: '📄 ' + name, wide: true, content: () => { const box = h('div', { style: { display: 'grid', gap: '8px', minWidth: 0 } }, code(src, lang || (/\.ts$/.test(name) ? 'ts' : 'vue'), { color: 'var(--team)', file: name })); box.append(h('div', { class: 'vi-msg w' }, '👆 import している先のファイルの中身。コードは書き換えて試せる')); return box; } });
  };
  K.linkFiles = function (pre, map, onOpen) {
    const keys = Object.keys(map);
    const used = [];
    pre.querySelectorAll('.ln').forEach((ln) => { const t = ln.textContent; const k = keys.find((x) => /^\s*import\b/.test(t) && (t.includes(x + "'") || t.includes(x + '"'))); if (k) { ln.classList.add('fl'); ln.dataset.fk = k; ln.title = 'クリックで ' + map[k][0] + ' の中身を見る'; if (!used.includes(k)) used.push(k); } });
    pre.addEventListener('click', (e) => { const ln = e.target.closest && e.target.closest('.ln.fl'); if (ln && window.getSelection().toString() === '') open(ln.dataset.fk, map, onOpen); });
    pre.linkedKeys = used;
    return used;
  };
  /* コードの下に「import しているファイル」のチップを並べる */
  K.linkChips = function (pre, map, onOpen) {
    const used = pre.linkedKeys || [];
    if (!used.length) return null;
    return h('div', { class: 'fl-chips' }, h('span', '📎 このコードが import しているファイル（押すと中身が開く）：'), ...used.map((k) => h('button', { class: 'fl-chip', onclick: () => open(k, map, onOpen) }, map[k][0])));
  };
})();
