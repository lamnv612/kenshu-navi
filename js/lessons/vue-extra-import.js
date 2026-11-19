/* 補足 Vue：import と export（{ } の有る無し）（x-vue-import）
   1) { } がある import と、ない import（解剖 + 棚）  2) .vue ファイルは何を export している？
   3) 部品の中から、ほかのものも import したい  4) export default と export const の見分け
   5) よくあるエラー  6) Vue でよく見る import 早見 */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.W || !K.tsAnatBuild) return;
  const { h, code, style } = K.W;
  const reg = (o) => K.reg(Object.assign({ track: 'extra' }, o));
  const COLS = ['#ff6b9d', '#5b9dff', '#ffb454', '#2fd4a4', '#a98bff', '#ff8a5b'];
  const BAD = 'var(--bad)', OK = 'var(--ok)', VUE = 'var(--vue)';
  const GOLD = '#ffb454', BLUE = '#5b9dff', GREEN = '#2fd4a4', PINK = '#ff6b9d', RED = '#ff8a96';

  style('vxI', `
  .vxI{display:grid;gap:14px;min-width:0}
  .vxI-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:stretch}
  .vxI-bar .btn{height:44px;padding:0 1.1em;font-size:.9rem}
  .vxI-say{flex:1;min-width:240px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-height:44px;padding:6px 16px;border-radius:12px;border:2px solid var(--line);background:var(--card);font:800 1rem/1.55 var(--font);transition:.25s}
  .vxI-say.bad{border-color:var(--bad);color:var(--bad)}.vxI-say.ok{border-color:var(--ok)}
  .vxI code.k,.vxI-say code,.vxI-why code{font:800 .9rem var(--mono);color:var(--vue)}
  .vxI-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:stretch;position:relative}
  .vxI-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:stretch;position:relative}
  @media(max-width:1100px){.vxI-three{grid-template-columns:1fr}}
  @media(max-width:980px){.vxI-two{grid-template-columns:1fr}}
  .vxI-box{border:2px solid var(--line);border-radius:14px;background:var(--card);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}
  .vxI-box.no{border-color:color-mix(in srgb,var(--bad) 55%,var(--line))}.vxI-box.yes{border-color:color-mix(in srgb,var(--ok) 55%,var(--line))}
  .vxI-tt{font:900 1rem var(--font);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .vxI-box.no>.vxI-tt{color:var(--bad)}.vxI-box.yes>.vxI-tt{color:var(--ok)}
  .vxI-code{min-width:0;display:flex;flex-direction:column;flex:1}.vxI-code>pre.code{flex:1;margin:0;font-size:.9rem}
  .vxI-pkt{position:absolute;left:0;top:0;z-index:9;padding:.2em .85em;border-radius:99px;color:#06101f;font:900 .9rem var(--mono);box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap}
  .vxI-bump{animation:vxIb .7s}@keyframes vxIb{30%{transform:scale(1.06);box-shadow:0 0 0 6px color-mix(in srgb,var(--ok) 45%,transparent)}}
  .vxI-shake{animation:vxIs .45s}@keyframes vxIs{20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
  .vxI [data-k]{cursor:default;border-radius:10px;transition:outline-color .15s,background .15s}
  .vxI [data-k].vxI-hot{outline:2px solid var(--c,#2f7bff);outline-offset:2px;box-shadow:0 0 0 5px color-mix(in srgb,var(--c,#2f7bff) 22%,transparent)}
  .vxI-why{font:800 .95rem/1.6 var(--font);padding:.5em .9em;border-radius:10px;background:color-mix(in srgb,var(--team) 12%,var(--card));border-left:5px solid var(--team)}
  .vxI-why.bad{background:color-mix(in srgb,var(--bad) 12%,var(--card));border-left-color:var(--bad)}.vxI-why.ok{background:color-mix(in srgb,var(--ok) 12%,var(--card));border-left-color:var(--ok)}
  .vxI-tabs{display:flex;gap:8px;flex-wrap:wrap}
  .vxI-tab{all:unset;cursor:pointer;padding:.45em 1em;border-radius:99px;border:2px solid var(--line);background:var(--card2);font:800 .9rem var(--font);transition:.2s}
  .vxI-tab:hover{border-color:var(--vue)}.vxI-tab.on{background:var(--vue);border-color:var(--vue);color:#06101f}
  .vxI-tab.x.on{background:var(--bad);border-color:var(--bad)}.vxI-tab.o.on{background:var(--ok);border-color:var(--ok)}
  .vxI-rules{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px}
  @media(max-width:760px){.vxI-rules{grid-template-columns:1fr}}
  .vxI-rule{padding:.7em 1em;border-radius:12px;border:2px solid var(--c);background:color-mix(in srgb,var(--c) 10%,var(--card));font:800 .95rem/1.6 var(--font);display:grid;gap:2px}
  .vxI-rule b{font:900 1rem var(--mono);color:var(--c)}
  .vxI-rule small{font:800 .85rem var(--font);color:var(--mute)}
  /* 棚 */
  .vxI-shelf{border-radius:12px;background:#f4f6fb;color:#1f2a44;padding:12px;display:grid;gap:10px}
  .vxI-shelf .fn{font:900 .9rem var(--mono);color:#5b6788}
  .vxI-shelf .row{display:flex;gap:10px;flex-wrap:wrap;align-items:stretch}
  .vxI-slot{flex:1;min-width:0;padding:.5em .7em;border-radius:12px;border:3px solid #b9c4e2;background:#fff;display:grid;gap:2px;justify-items:center;text-align:center;transition:.3s}
  .vxI-slot small{font:800 .8rem var(--font);color:#5b6788}
  .vxI-slot b{font:900 .95rem var(--mono);overflow-wrap:anywhere}
  .vxI-slot.def{border-color:#e0a21a;background:#fff8e6}.vxI-slot.def b{color:#9a6a00}
  .vxI-slot.nam b{color:#2f6df0}.vxI-slot.nam{border-color:#9db8f0}
  .vxI-slot.typ{border-style:dashed;border-color:#b69cf0}.vxI-slot.typ b{color:#6b45c9}
  .vxI-slot.pick{background:#dff7ec;border-color:#2fd4a4;box-shadow:0 0 0 4px rgba(47,212,164,.3)}
  .vxI-slot.miss{background:#ffe6ea;border-color:#ff6b7a}
  .vxI-slot.dim{opacity:.4}
  .vxI-imps{display:grid;gap:8px}
  .vxI-imp{all:unset;cursor:pointer;box-sizing:border-box;padding:.5em .8em;border-radius:10px;border:2px solid var(--line);background:var(--code);color:#d8dcff;font:700 .9rem/1.4 var(--mono);transition:.2s;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .vxI-imp:hover{border-color:var(--vue);transform:translateX(3px)}
  .vxI-imp.on{border-color:var(--vue);background:color-mix(in srgb,var(--vue) 18%,var(--code))}
  .vxI-imp .nb{font:800 .8rem var(--font);color:var(--mute)}
  .vxI-res{color:#1f2a44;padding:.7em .9em;border-radius:12px;background:#fff;border:3px solid #cfd4e2;font:800 .95rem/1.6 var(--font);display:grid;gap:6px;min-height:6.4em;align-content:center;transition:.3s}
  .vxI-res.ok{border-color:#2fd4a4}.vxI-res.bad{border-color:#ff6b7a}.vxI-res.warn{border-color:#e0a21a}
  .vxI-res .mono{font:800 .85rem var(--mono);color:#b3203a;word-break:break-word}
  .vxI-res .mono.g{color:#127a5c}
  .vxI-out{background:#0b1020;color:#cfe;border-radius:10px;padding:10px 12px;font:700 .85rem/1.65 var(--mono);min-height:6.6em;display:grid;gap:4px;align-content:start;word-break:break-word}
  .vxI-out .mute{color:#8892b8}.vxI-out .e{color:#ff8a96}.vxI-out .g{color:#2fd4a4}
  .vxI-out .src{display:inline-block;margin-right:.6em;padding:0 .6em;border-radius:99px;background:#26304f;color:#b9c4e2;font:800 .8rem var(--font)}
  /* シーン2 */
  .vxI-stack{position:relative;display:flex;flex-direction:column;flex:1}
  .vxI-stack>.vxI-code{display:none}.vxI-stack>.vxI-code.on{display:flex;animation:vxIf .5s}
  @keyframes vxIf{from{opacity:0;transform:translateY(8px)}}
  .vxI-badge{display:inline-flex;align-items:center;gap:6px;padding:.2em .8em;border-radius:99px;background:var(--c,#ffb454);color:#06101f;font:900 .85rem var(--mono)}
  .vxI-steps{display:flex;gap:8px;flex-wrap:wrap}
  .vxI-sb{all:unset;cursor:pointer;box-sizing:border-box;padding:6px 12px;border:2px solid var(--line);border-radius:12px;background:var(--card);display:flex;gap:8px;align-items:center;font:800 .9rem/1.35 var(--font);transition:.2s}
  .vxI-sb i{font-style:normal;flex:none;width:1.7em;height:1.7em;border-radius:50%;display:grid;place-items:center;background:var(--line);font:900 .85rem var(--font)}
  .vxI-sb.past{border-color:color-mix(in srgb,var(--ok) 55%,var(--line))}.vxI-sb.past i{background:var(--ok);color:#06101f}
  .vxI-sb.on{border-color:var(--vue);background:color-mix(in srgb,var(--vue) 16%,var(--card));transform:translateY(-2px)}.vxI-sb.on i{background:var(--vue);color:#06101f}
  .vxI-tree{background:var(--code);color:#d8dcff;border-radius:10px;padding:10px 14px;font:700 .85rem/1.7 var(--mono);white-space:pre}
  .vxI-tree .hit{color:#2fd4a4}
  /* シーン4 */
  .vxI-match{position:relative;display:grid;grid-template-columns:minmax(0,1fr) 70px minmax(0,1fr);gap:0;align-items:stretch}
  @media(max-width:760px){.vxI-match{grid-template-columns:1fr;gap:10px}.vxI-match .gap{display:none}}
  .vxI-col{display:grid;gap:8px;grid-auto-rows:1fr}
  .vxI-mc{all:unset;cursor:pointer;box-sizing:border-box;padding:.5em .8em;border-radius:12px;border:2px solid var(--line);background:var(--code);color:#d8dcff;font:700 .88rem/1.45 var(--mono);display:flex;flex-direction:column;gap:2px;justify-content:center;min-height:3.6em}
  .vxI-mc small{font:800 .8rem var(--font);color:var(--mute)}
  .vxI-mc.on,.vxI-mc:hover{border-color:var(--c);background:color-mix(in srgb,var(--c) 16%,var(--code))}
  .vxI-svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}
  .vxI-svg path{fill:none;stroke-width:4;stroke-linecap:round;stroke-dasharray:10 8;animation:vxId .6s linear infinite}
  @keyframes vxId{to{stroke-dashoffset:-18}}
  .vxI-mini{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:stretch}
  @media(max-width:900px){.vxI-mini{grid-template-columns:1fr}}
  /* シーン6 */
  .vxI-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:stretch}
  @media(max-width:1100px){.vxI-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(max-width:700px){.vxI-grid{grid-template-columns:1fr}}
  .vxI-card{all:unset;box-sizing:border-box;cursor:pointer;border:2px solid var(--line);border-radius:14px;background:var(--card);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0;transition:.2s}
  .vxI-card:hover{border-color:var(--vue);transform:translateY(-2px)}
  .vxI-card.on{border-color:var(--vue);background:color-mix(in srgb,var(--vue) 10%,var(--card))}
  .vxI-card .ln{background:var(--code);border-radius:10px;padding:12px 10px;font:700 .88rem/1.8 var(--mono);color:#d8dcff;white-space:pre-wrap;overflow-wrap:anywhere}
  .vxI-card .tk{padding:.05em .15em;border-radius:5px;transition:.2s}
  .vxI-card .tk.lit{background:color-mix(in srgb,var(--tc) 40%,transparent);box-shadow:0 0 0 2px var(--tc);color:#fff}
  .vxI-card .bd{display:flex;gap:6px;flex-wrap:wrap}
  .vxI-card .bd span{padding:.15em .7em;border-radius:99px;font:900 .82rem var(--font);color:#06101f}
  .vxI-card .use{font:800 .9rem/1.5 var(--font);color:var(--mute)}
  .vxI-card .rd{overflow-wrap:anywhere;margin-top:auto;font:800 .9rem/1.5 var(--font);padding:.4em .7em;border-radius:10px;background:var(--card2);min-height:2.6em}
  .vxI-card.on .rd{background:color-mix(in srgb,var(--ok) 16%,var(--card2))}
  `);

  /* ---------- 共通の道具 ---------- */
  const lnOf = (pre, toks) => { const o = []; pre.lines.forEach((l, i) => { if ((toks || []).some((t) => l.textContent.includes(t))) o.push(i + 1); }); return o; };
  const bump = (el) => { if (!el) return; el.classList.remove('vxI-bump'); void el.offsetWidth; el.classList.add('vxI-bump'); };
  const shake = (el) => { if (!el) return; el.classList.remove('vxI-shake'); void el.offsetWidth; el.classList.add('vxI-shake'); };
  async function fly(host, from, to, text, col) {
    if (!from || !to || !host.isConnected) return;
    const hr = host.getBoundingClientRect(), a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    const el = h('span', { class: 'vxI-pkt', style: { background: col || GREEN } }, text); host.append(el);
    const w = el.offsetWidth, hh = el.offsetHeight, pt = (r) => ({ x: r.left - hr.left + r.width / 2 - w / 2, y: r.top - hr.top + r.height / 2 - hh / 2 });
    const A = pt(a), B = pt(b);
    try { await el.animate([{ transform: `translate(${A.x}px,${A.y}px) scale(.6)`, opacity: 0 }, { transform: `translate(${A.x}px,${A.y}px)`, opacity: 1, offset: .15 }, { transform: `translate(${B.x}px,${B.y}px)`, opacity: 1, offset: .85 }, { transform: `translate(${B.x}px,${B.y}px) scale(.6)`, opacity: 0 }], { duration: 800, easing: 'ease-in-out' }).finished; } catch (e) { /* 途中で消えてもよい */ }
    el.remove();
  }
  /* root 内の [data-k] 部品 ⇄ 複数コード（pres）の行。map = { key: [pre0 のトークン, pre1 のトークン…] } */
  function link(root, pres, map, rest) {
    const keys = Object.keys(map);
    const set = (k) => pres.forEach((pre, pi) => pre.setHi(k ? lnOf(pre, (map[k] || [])[pi]) : ((rest ? rest() : [])[pi] || []), 'on'));
    const on = (k) => { set(k); root.querySelectorAll('[data-k]').forEach((n) => n.classList.toggle('vxI-hot', n.getAttribute('data-k') === k)); };
    const off = () => { set(null); root.querySelectorAll('.vxI-hot').forEach((n) => n.classList.remove('vxI-hot')); };
    keys.forEach((k, i) => root.querySelectorAll('[data-k="' + k + '"]').forEach((n) => { if (n.__vxl) return; n.__vxl = 1; n.style.setProperty('--c', COLS[i % COLS.length]); n.addEventListener('mouseenter', () => on(k)); n.addEventListener('mouseleave', off); }));
    pres.forEach((pre, pi) => pre.lines.forEach((ln) => {
      ln.addEventListener('mouseenter', () => { const k = keys.find((kk) => ((map[kk] || [])[pi] || []).some((t) => ln.textContent.includes(t))); if (k) on(k); });
      ln.addEventListener('mouseleave', off);
    }));
    if (rest) set(null);
  }
  const mkPre = (lines, lang, file, color) => code([].concat(lines).join('\n'), lang, { color: color || VUE, file, dim: false, edit: false });
  const btn = (label, onclick, cls) => h('button', { class: 'btn' + (cls ? ' ' + cls : ''), type: 'button', style: cls === 'primary' ? { '--c': VUE } : {}, onclick }, label);
  const box = (title, ...kids) => h('div', { class: 'vxI-box' }, h('div', { class: 'vxI-tt' }, title), ...kids);

  /* 棚：1 つのファイルが export しているものを、スロットで見せる */
  function shelf(file, def, named, types) {
    const slots = {};
    const mk = (key, cls, label, name) => { const s = h('div', { class: 'vxI-slot ' + cls, 'data-k': key }, h('small', label), h('b', name)); slots[key] = s; return s; };
    const rows = [h('div', { class: 'row' }, mk('default', 'def', 'default（1 つだけ）', def))];
    rows.push(h('div', { class: 'row' }, ...named.map((n) => mk(n, 'nam', 'named', n))));
    if (types && types.length) rows.push(h('div', { class: 'row' }, ...types.map((n) => mk(n, 'typ', 'named の型（実行時は消える）', n))));
    const el = h('div', { class: 'vxI-shelf' }, h('div', { class: 'fn' }, '🗄 ' + file + ' の棚'), ...rows);
    return { el, slots, mark(key, cls) { Object.keys(slots).forEach((k) => { slots[k].classList.remove('pick', 'miss'); slots[k].classList.toggle('dim', !!key && k !== key && cls === 'pick'); }); if (key && slots[key]) { slots[key].classList.add(cls); } } };
  }

  /* ================= 1. { } がある import と、ない import ================= */
  const S1_FILE = [
    "export const API_URL = '/api/cases'",
    '',
    'export async function fetchCases(): Promise<Response> {',
    '  return fetch(API_URL)',
    '}',
    '',
    'const caseApi = { fetchCases }',
    'export default caseApi',
  ];
  const S1_IMPS = [
    { c: "import caseApi from './case-api'", nb: '{ } なし', slot: 'default', kind: 'ok', say: '<b>default</b> が取れる。名前は <code class="k">caseApi</code>（自由）。', tok: ['caseApi'] },
    { c: "import api from './case-api'", nb: '名前だけ変えた', slot: 'default', kind: 'ok', say: '名前は<b>自由</b>。<code class="k">api</code> でも、同じ default が取れる。', tok: ['export default'] },
    { c: "import { API_URL } from './case-api'", nb: '{ } あり', slot: 'API_URL', kind: 'ok', say: '<b>named</b> が取れる。<code class="k">{ }</code> の中は、名前を<b>正確に</b>。', tok: ['export const API_URL'] },
    { c: "import { fetchCase } from './case-api'", nb: '打ち間違い', slot: null, kind: 'bad', say: '棚に <code class="k">fetchCase</code> は無い。', msg: "SyntaxError: The requested module './case-api.ts' does not provide an export named 'fetchCase'", tok: ['export async function fetchCases'] },
    { c: "import API_URL from './case-api'", nb: '{ } を付け忘れ', slot: 'default', kind: 'warn', say: '{ } が無い → <b>default</b> が来る。<code class="k">API_URL</code> の中身は <b>caseApi</b>（別物）。', tok: ['export default'] },
    { c: "import { caseApi } from './case-api'", nb: 'default に { }', slot: null, kind: 'bad', say: 'caseApi は <b>default</b>。named には無い。', msg: "SyntaxError: The requested module './case-api.ts' does not provide an export named 'caseApi'", tok: ['export default'] },
  ];

  function scene1(el) {
    const PARTS = {
      imp: ['import', GOLD, '「取り込む」宣言。この行から、別のファイルのものが使える。'],
      name: ['取り込む名前', BLUE, ''],
      from: ['from', PINK, '「〜から」。右に、取り込み元が来る。'],
      src: ['取り込み元', GREEN, 'ファイルの場所（./ や @/）か、パッケージ名（vue）。'],
    };
    const p1 = Object.assign({}, PARTS, { name: ['取り込む名前', BLUE, 'default なので { } なし。名前は自由（部品は PascalCase にする）。'] });
    const p2 = Object.assign({}, PARTS);
    p2.imp = PARTS.imp; p2.brace = ['{ }', '#a98bff', 'named export を取るしるし。「波かっこ」と読む。'];
    p2.name = ['取り込む名前', BLUE, 'named なので、export された名前と同じに書く（ref）。'];
    const ordered = { imp: p2.imp, brace: p2.brace, name: p2.name, from: p2.from, src: p2.src };
    const anat = K.tsAnatBuild({
      tab: '{ } なし（部品）', split: true, lang: 'ts', title: '🔍 部品の名前（カーソルを乗せる）',
      tokens: [['import', ['imp']], [' CaseCard', ['name']], [' from', ['from']], [" './CaseCard.vue'", ['src']]], parts: p1,
      more: [{ tab: '{ } あり（道具）', split: true, lang: 'ts', title: '🔍 部品の名前（カーソルを乗せる）', tokens: [['import', ['imp']], [' {', ['brace']], [' ref', ['name']], [' }', ['brace']], [' from', ['from']], [" 'vue'", ['src']]], parts: ordered }],
    });
    const rules = h('div', { class: 'vxI-rules' },
      h('div', { class: 'vxI-rule', style: { '--c': GOLD } }, h('b', 'export default → { } なし'), '名前は自由。', h('small', '1 ファイルに 1 つだけ')),
      h('div', { class: 'vxI-rule', style: { '--c': BLUE } }, h('b', 'named export → { } あり'), '名前は正確に。', h('small', '何個でも')));

    const sh = shelf('case-api.ts', 'caseApi', ['API_URL', 'fetchCases']);
    const pre = mkPre(S1_FILE, 'ts', 'case-api.ts', VUE);
    const left = box('export している側', sh.el, h('div', { class: 'vxI-code' }, pre));
    const res = h('div', { class: 'vxI-res' }, h('div', '👆 右の import を押す → 棚から何が取れるか')), imps = [];
    const list = h('div', { class: 'vxI-imps' });
    let tok = 0;
    const right = box('import する側（押してみる）', list, res);
    const host = h('div', { class: 'vxI-two' }, left, right);
    const run = async (c, b) => {
      const my = ++tok; imps.forEach((x) => x.classList.toggle('on', x === b));
      sh.mark(null); res.className = 'vxI-res'; res.replaceChildren(h('div', '…'));
      const target = c.slot ? sh.slots[c.slot] : sh.el.querySelector('.fn');
      await fly(host, b, target, c.slot ? (c.slot === 'default' ? 'default' : c.slot) : '✖', c.kind === 'bad' ? RED : c.kind === 'warn' ? GOLD : GREEN);
      if (my !== tok) return;
      if (c.slot) sh.mark(c.slot, 'pick'); else { sh.el.querySelectorAll('.vxI-slot').forEach((s) => s.classList.add('miss')); shake(sh.el); }
      res.className = 'vxI-res ' + c.kind;
      res.replaceChildren(...[h('div', { html: (c.kind === 'ok' ? '✓ ' : c.kind === 'warn' ? '⚠ ' : '✖ ') + c.say }), c.msg && h('div', { class: 'mono' }, c.msg), c.kind === 'warn' && h('div', { class: 'mono g' }, 'エラーにならない → 気づきにくい')].filter(Boolean));
      pre.setHi(lnOf(pre, c.tok), 'on'); bump(res);
    };
    S1_IMPS.forEach((c) => { const b = h('button', { class: 'vxI-imp', type: 'button', onclick: () => run(c, b) }, c.c, h('span', { class: 'nb' }, c.nb)); imps.push(b); list.append(b); });
    link(host, [pre], { default: [['export default', 'const caseApi']], API_URL: [['export const API_URL']], fetchCases: [['export async function fetchCases']] }, () => [[]]);
    el.append(h('div', { class: 'vxI' }, anat, rules, host));
  }

  /* ================= 2. .vue ファイルは何を export している？ ================= */
  const S2_VISIBLE = [
    '<script setup lang="ts">',
    'defineProps<{ title: string }>()',
    '</script>',
    '',
    '<template>',
    '  <p>{{ title }}</p>',
    '</template>',
  ];
  const S2_COMPILED = [
    'export default {',
    "  __name: 'CaseCard',",
    '  props: { title: String },',
    '  setup(props) {',
    "    return () => h('p', props.title)",
    '  },',
    '}',
  ];
  function scene2(el) {
    let step = 0, choice = 0, tok = 0;
    const CH = [
      { c: "import CaseCard from './CaseCard.vue'", tag: '<CaseCard title="離婚の相談" />', ok: true, say: '<b>CaseCard</b> が部品。慣習どおりの名前。' },
      { c: "import Card from './CaseCard.vue'", tag: '<Card title="離婚の相談" />', ok: true, say: '名前は<b>自由</b>。ファイル名と違っても動く（でも、そろえる）。' },
      { c: "import { CaseCard } from './CaseCard.vue'", tag: '<CaseCard title="離婚の相談" />', ok: false, say: '部品は <b>default</b>。{ } で探しても、CaseCard という名前の export は無い。', msg: "SyntaxError: The requested module '/src/components/CaseCard.vue' does not provide an export named 'CaseCard'" },
    ];
    const preV = mkPre(S2_VISIBLE, 'vue', 'CaseCard.vue（自分が書いたもの）', VUE);
    const preC = mkPre(S2_COMPILED, 'js', 'CaseCard.vue（コンパイル後・簡略）', GOLD);
    const stV = h('div', { class: 'vxI-code on' }, preV), stC = h('div', { class: 'vxI-code' }, preC);
    const stack = h('div', { class: 'vxI-stack' }, stV, stC);
    const badge = h('span', { class: 'vxI-badge', 'data-k': 'exp' }, 'export default');
    const note = h('div', { class: 'vxI-why' });
    const left = box('部品の側：CaseCard.vue', h('div', { style: { display: 'flex' } }, badge), stack, note);
    const tabs = h('div', { class: 'vxI-tabs' }), res = h('div', { class: 'vxI-res' });
    const rightCode = h('div', { class: 'vxI-code' });
    let curPre = null;
    const drawP = () => {
      const c = CH[choice];
      curPre = mkPre([c.c, '', '<template>', '  ' + c.tag, '</template>'], 'vue', 'CaseListPage.vue', VUE);
      rightCode.replaceChildren(curPre);
      link(right, [curPre], { imp: [["import "]], use: [['<' + (choice === 1 ? 'Card' : 'CaseCard')]] }, () => [[]]);
    };
    const right = box('取り込む側：CaseListPage.vue', tabs, rightCode, res);
    CH.forEach((c, i) => tabs.append(h('button', { class: 'vxI-tab ' + (c.ok ? 'o' : 'x') + (i === 0 ? ' on' : ''), type: 'button', onclick: () => pick(i) }, (c.ok ? '✓ ' : '✖ ') + c.c.replace(" from './CaseCard.vue'", ' from …'))));
    const host = h('div', { class: 'vxI-two' }, left, right);
    const pick = async (i) => {
      choice = i; const my = ++tok; const c = CH[i];
      [...tabs.children].forEach((b, k) => b.classList.toggle('on', k === i)); drawP();
      if (step < 2) go(2, true);
      res.className = 'vxI-res'; res.replaceChildren(h('div', '…'));
      await fly(host, badge, curPre.lines[0], c.ok ? 'default' : '?', c.ok ? GOLD : RED);
      if (my !== tok) return;
      res.className = 'vxI-res ' + (c.ok ? 'ok' : 'bad');
      res.replaceChildren(...[h('div', { html: (c.ok ? '✓ ' : '✖ ') + c.say }), c.msg && h('div', { class: 'mono' }, c.msg)].filter(Boolean));
      if (!c.ok) shake(res); else bump(res);
    };
    const SAY = [
      ['見えているのは <b>&lt;script setup&gt;</b> と <b>&lt;template&gt;</b> だけ。export は書いていない。', ''],
      ['Vue が<b>コンパイル</b>して、部品オブジェクトを <b>export default</b> として公開している。', 'ok'],
      ['だから取り込む側は <b>{ } なし</b>。名前は自由（慣習は PascalCase）。', 'ok'],
    ];
    const steps = h('div', { class: 'vxI-steps' });
    ['見えているファイル', 'コンパイル後（見えない export）', '取り込む側の書き方'].forEach((t, i) => steps.append(h('button', { class: 'vxI-sb', type: 'button', onclick: () => (i === 2 ? pick(choice) : go(i)) }, h('i', String(i + 1)), t)));
    const go = (i, quiet) => {
      step = i;
      stV.classList.toggle('on', i === 0); stC.classList.toggle('on', i > 0);
      [...steps.children].forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('past', k < i); });
      note.innerHTML = SAY[i][0]; note.className = 'vxI-why ' + SAY[i][1];
      badge.style.opacity = i > 0 ? 1 : .35;
      if (!quiet && i === 1) bump(stC);
    };
    link(host, [preC], { exp: [['export default']] }, () => [[]]);
    drawP(); go(0);
    el.append(h('div', { class: 'vxI' }, h('div', { class: 'vxI-bar' }, btn('◀ 戻る', () => go(Math.max(0, step - 1))), btn('次へ ▶', () => (step >= 1 ? pick(choice) : go(step + 1)), 'primary'), btn('⟲ 最初から', () => { go(0); res.replaceChildren(); res.className = 'vxI-res'; })), steps, host));
  }

  /* ================= 3. 部品の中から、ほかのものも import したい ================= */
  const CARD_BODY = ['<template>', '  <p>{{ title }}：{{ STATUS_LABEL[status] }}</p>', '</template>'];
  const NORMAL = [
    '<script lang="ts">',
    "export type CaseStatus = '受付' | '対応中' | '完了'",
    '',
    'export const STATUS_LABEL: Record<CaseStatus, string> = {',
    "  受付: '受付済み',",
    "  対応中: '弁護士が対応中',",
    "  完了: '完了',",
    '}',
    '</script>',
  ];
  const SETUP = ['<script setup lang="ts">', 'defineProps<{ title: string; status: CaseStatus }>()', '</script>'];
  const TYPES_TS = [
    "export type CaseStatus = '受付' | '対応中' | '完了'",
    '',
    'export const STATUS_LABEL: Record<CaseStatus, string> = {',
    "  受付: '受付済み',",
    "  対応中: '弁護士が対応中',",
    "  完了: '完了',",
    '}',
  ];
  function scene3(el) {
    const T = [
      { id: 'x', tab: 'setup の中に export', kind: 'x',
        child: ['<script setup lang="ts">', "export const STATUS_LABEL = { 受付: '受付済み' }", 'defineProps<{ title: string }>()', '</script>'],
        parent: ["import CaseCard, { STATUS_LABEL } from './CaseCard.vue'", '', 'const label = STATUS_LABEL.受付'],
        keys: { lab: [['export const STATUS_LABEL'], ['STATUS_LABEL']] },
        out: [['e', '[vue/compiler-sfc] <script setup> cannot contain ES module exports.'], ['mute', 'If you are using a previous version of <script setup>, please consult the updated RFC …'], ['e', "TS2305: Module './CaseCard.vue' has no exported member 'STATUS_LABEL'."]],
        why: '✖ <b>&lt;script setup&gt;</b> の中は、export を書けない。（型だけの <code>export type</code> は書けるが、値は不可）', kind2: 'bad', fly: [['lab', 'STATUS_LABEL', RED, 0, 1]] },
      { id: 'o', tab: '普通の <script> に export', kind: 'o',
        child: NORMAL.concat([''], SETUP, [''], CARD_BODY),
        parent: ['<script setup lang="ts">', 'import CaseCard, {', '  type CaseStatus,', '  STATUS_LABEL,', "} from './CaseCard.vue'", '', "const status: CaseStatus = '受付'", '</script>', '', '<template>', `  <CaseCard title="離婚の相談" :status="status" />`, '</template>'],
        keys: { comp: [['<script setup'], ['import CaseCard,']], typ: [['export type CaseStatus'], ['  type CaseStatus']], lab: [['export const STATUS_LABEL'], ['  STATUS_LABEL,']] },
        out: [['g', '✓ コンパイル OK'], ['mute', 'CaseCard は default・CaseStatus と STATUS_LABEL は named'], ['mute', 'vue-tsc も型が通る。<script> と <script setup> は lang を揃える']],
        why: '✓ 値も型も、<b>普通の &lt;script&gt;</b> に <b>export</b> → <b>{ }</b> で import。', kind2: 'ok', fly: [['comp', 'default', GOLD, 0, 1], ['typ', 'CaseStatus', '#a98bff', 0, 1], ['lab', 'STATUS_LABEL', BLUE, 0, 1]] },
      { id: 't', tab: 'types/case.ts に出す（おすすめ）', kind: 'o',
        types: TYPES_TS,
        child: ['<script setup lang="ts">', 'import {', '  STATUS_LABEL,', '  type CaseStatus,', "} from '@/types/case'", '', 'defineProps<{ title: string; status: CaseStatus }>()', '</script>', '', ...CARD_BODY],
        parent: ['<script setup lang="ts">', "import CaseCard from '@/components/CaseCard.vue'", "import type { CaseStatus } from '@/types/case'", '', "const status: CaseStatus = '受付'", '</script>'],
        keys: { comp: [['<script setup'], ['import CaseCard'], []], typ: [['  type CaseStatus,'], ['import type { CaseStatus }'], ['export type CaseStatus']], lab: [['  STATUS_LABEL,'], [], ['export const STATUS_LABEL']] },
        out: [['g', '✓ 部品は default だけ。型と定数は .ts から import'], ['mute', '部品と型が別々なので、どこからでも読める（循環しにくい）']],
        why: '✓ 型・定数は <b>.ts</b> に集める。部品ファイルは、部品だけ。', kind2: 'ok', fly: [['comp', 'default', GOLD, 0, 1], ['typ', 'CaseStatus', '#a98bff', 2, 1], ['lab', 'STATUS_LABEL', BLUE, 2, 0]] },
    ];
    let cur = 1, tok = 0;
    const tabs = h('div', { class: 'vxI-tabs' }), view = h('div', { class: 'vxI' }), legend = h('div', { class: 'vxI-tabs' });
    T.forEach((t, i) => tabs.append(h('button', { class: 'vxI-tab ' + t.kind + (i === cur ? ' on' : ''), type: 'button', onclick: () => { cur = i; draw(); } }, (t.kind === 'x' ? '✖ ' : '✓ ') + t.tab.replace(/<\/?script>/g, (m) => m.replace('<', '＜').replace('>', '＞')))));
    function draw() {
      tok++;
      const t = T[cur];
      [...tabs.children].forEach((b, i) => b.classList.toggle('on', i === cur));
      const mkp = (src, file, col) => mkPre(src, /\.ts$/.test(file) ? 'ts' : 'vue', file, col);
      const pc = mkp(t.child, t.id === 'x' ? 'CaseCard.vue（✖）' : 'src/components/CaseCard.vue', t.kind === 'x' ? BAD : VUE);
      const pp = mkp(t.parent, 'src/pages/CaseListPage.vue（取り込む側）', VUE);
      const pres = [pc, pp];
      let pt = null;
      if (t.types) { pt = mkp(t.types, 'src/types/case.ts', GOLD); pres.push(pt); }
      const out = h('div', { class: 'vxI-out' }, ...t.out.map(([c, x]) => h('div', { class: c }, x)));
      const TREE = 'src/<br>├ components/<br>│ └ CaseCard.vue<br>├ pages/<br>│ └ CaseListPage.vue<br>└ <span class="hit">types/<br>  └ case.ts</span>';
      const cols = [];
      if (pt) cols.push(box('型と定数のファイル（export）', h('div', { class: 'vxI-code' }, pt)));
      cols.push(box('部品の側（export）', h('div', { class: 'vxI-code' }, pc)));
      cols.push(box('取り込む側（import）', h('div', { class: 'vxI-code' }, pp)));
      const grid = h('div', { class: 'vxI' }, ...(pt ? [h('div', { class: 'vxI-two' }, cols[0], h('div', { class: 'vxI-box' }, h('div', { class: 'vxI-tt' }, 'フォルダの構成'), h('div', { class: 'vxI-tree', html: TREE }))), h('div', { class: 'vxI-two' }, cols[1], cols[2])] : [h('div', { class: 'vxI-two' }, ...cols)]));
      grid.style.position = 'relative';
      const map2 = t.keys;
      legend.replaceChildren(...Object.keys(t.keys).map((k) => h('span', { class: 'vxI-tab', 'data-k': k, style: { cursor: 'default' } }, { comp: '部品（default）', typ: '型 CaseStatus', lab: '定数 STATUS_LABEL' }[k])));
      const resBox = h('div', { class: 'vxI-why ' + t.kind2, html: t.why });
      const run = async () => {
        const my = ++tok;
        for (const [k, tx, col, si, di] of t.fly) {
          if (my !== tok) return;
          const ln = (pi) => pres[pi].lines[((lnOf(pres[pi], t.keys[k][pi]))[0] || 1) - 1];
          await fly(grid, ln(si), ln(di), tx, col);
        }
        if (my === tok) { out.style.opacity = 1; if (t.kind === 'x') shake(out); else bump(out); }
      };
      view.replaceChildren(h('div', { class: 'vxI-bar' }, btn('▶ import させる', run, 'primary'), resBox), legend, grid, out);
      link(view, pres, map2, () => pres.map(() => []));
    }
    el.append(h('div', { class: 'vxI' }, tabs, view));
    draw();
  }

  /* ================= 4. export default と export const の見分け ================= */
  const S4_FILE = [
    'const MAX_RETRY = 3',
    'const TIMEOUT_MS = 5000',
    '',
    'export type Case = { id: number; title: string }',
    "export const API_URL = '/api/cases'",
    '',
    'export async function fetchCases(): Promise<Case[]> {',
    '  const res = await fetch(API_URL)',
    '  return res.json()',
    '}',
    '',
    'export { MAX_RETRY, TIMEOUT_MS }',
    '',
    'const caseApi = { fetchCases }',
    'export default caseApi',
  ];
  const S4_ROWS = [
    { k: 'r1', ex: 'export default caseApi', im: "import caseApi from './case-api'", exn: 'default', imn: '{ } なし・名前は自由', slot: 'default', find: ['export default'], rd: 'インポート ケースエーピーアイ フロム…（波かっこ なし）' },
    { k: 'r2', ex: "export const API_URL = '/api/cases'", im: "import { API_URL } from './case-api'", exn: 'named（定数）', imn: '{ } あり・名前は正確に', slot: 'API_URL', find: ['export const API_URL'] },
    { k: 'r3', ex: 'export function fetchCases()', im: "import { fetchCases } from './case-api'", exn: 'named（関数）', imn: '{ } あり', slot: 'fetchCases', find: ['export async function fetchCases'] },
    { k: 'r4', ex: 'export { MAX_RETRY, TIMEOUT_MS }', im: "import { MAX_RETRY, TIMEOUT_MS } from './case-api'", exn: 'named（まとめて）', imn: '{ } の中に , で並べる', slot: 'MAX_RETRY', find: ['export { MAX_RETRY'] },
    { k: 'r5', ex: 'export type Case = { … }', im: "import type { Case } from './case-api'", exn: 'named（型）', imn: 'import type・{ } あり', slot: 'Case', find: ['export type Case'] },
  ];
  function scene4(el) {
    const pre = mkPre(S4_FILE, 'ts', 'src/api/case-api.ts', VUE);
    const sh = shelf('case-api.ts', 'caseApi', ['API_URL', 'fetchCases', 'MAX_RETRY', 'TIMEOUT_MS'], ['Case']);
    const mkC = (r, side) => h('button', { class: 'vxI-mc', type: 'button', 'data-k': r.k, onclick: () => go(r) }, side === 'l' ? r.ex : r.im, h('small', side === 'l' ? r.exn : r.imn));
    const L = h('div', { class: 'vxI-col' }, ...S4_ROWS.map((r) => mkC(r, 'l'))), R = h('div', { class: 'vxI-col' }, ...S4_ROWS.slice().reverse().map((r) => mkC(r, 'r')));
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('class', 'vxI-svg');
    const match = h('div', { class: 'vxI-match' }, L, h('div', { class: 'gap' }), R); match.append(svg);
    const say = h('div', { class: 'vxI-why' }, '👆 左の export にカーソル → 右の import が線でつながる');
    const line = (r) => {
      svg.replaceChildren(); if (!r) return;
      const l = L.querySelector('[data-k="' + r.k + '"]'), rr = R.querySelector('[data-k="' + r.k + '"]'); if (!l || !rr) return;
      const mr = match.getBoundingClientRect(), a = l.getBoundingClientRect(), b = rr.getBoundingClientRect();
      const x1 = a.right - mr.left, y1 = a.top - mr.top + a.height / 2, x2 = b.left - mr.left, y2 = b.top - mr.top + b.height / 2, mx = (x1 + x2) / 2;
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`); p.setAttribute('stroke', COLS[S4_ROWS.indexOf(r) % COLS.length]); svg.append(p);
    };
    const host = h('div', { class: 'vxI-two' }, h('div', { style: { display: 'contents' } }));
    let sel = null;
    const show = (r) => { line(r); sh.mark(r ? r.slot : null, 'pick'); if (r) say.innerHTML = '<b>' + r.ex.replace(/[<>]/g, '') + '</b> ⇒ <b>' + r.im.split(' from')[0] + '</b>（' + r.imn + '）'; };
    const go = async (r) => { sel = r; show(r); const l = L.querySelector('[data-k="' + r.k + '"]'), rr = R.querySelector('[data-k="' + r.k + '"]'); await fly(match, l, rr, r.slot === 'default' ? 'default' : r.slot, GREEN); bump(rr); };
    S4_ROWS.forEach((r, i) => [L, R].forEach((c) => { const n = c.querySelector('[data-k="' + r.k + '"]'); n.style.setProperty('--c', COLS[i % COLS.length]); n.addEventListener('mouseenter', () => show(r)); n.addEventListener('mouseleave', () => { if (sel) show(sel); else { line(null); sh.mark(null); } }); }));
    const left = box('マッチング：export ⇒ import', match, say);
    const right = box('ファイルの棚', sh.el, h('div', { class: 'vxI-code' }, pre));
    host.replaceChildren(left, right);
    link(right, [pre], { r1: [['export default', 'const caseApi']], r2: [['export const API_URL']], r3: [['export async function fetchCases']], r4: [['export { MAX_RETRY'], ['const MAX_RETRY']], r5: [['export type Case']] }, () => [[]]);
    /* 小さなレッスン：as と * as */
    const mini = (title, lines, file, tail) => { const p = mkPre(lines, 'ts', file, VUE); return { p, el: box(title, h('div', { class: 'vxI-code' }, p), h('div', { class: 'vxI-why', html: tail })) }; };
    const m1 = mini('as：名前を付け替える', ["import { fetchCases as loadCases } from './case-api'", '', 'loadCases()'], 'CaseListPage.vue', '<b>as</b> は「<b>〜として</b>」。同じ名前が 2 つあるとき、こちら側の名前だけ変える。');
    const m2 = mini('* as：全部まとめて取る', ["import * as api from './case-api'", '', 'api.fetchCases()', 'api.default'], 'CaseListPage.vue', '<b>* as api</b> は「全部を <b>api</b> という箱に」。default は <b>api.default</b>。');
    link(m1.el, [m1.p], { as: [['as loadCases']] }, () => [[]]); link(m2.el, [m2.p], { all: [['* as api']] }, () => [[]]);
    [m1, m2].forEach((m, i) => { const k = ['as', 'all'][i]; m.el.querySelector('.vxI-tt').setAttribute('data-k', k); });
    el.append(h('div', { class: 'vxI' }, host, h('div', { class: 'vxI-mini' }, m1.el, m2.el)));
    setTimeout(() => go(S4_ROWS[1]), 50);
  }

  /* ================= 5. よくあるエラー ================= */
  const ERR = [
    { tab: '{ } の付け忘れ', say: 'named を { } なしで取ろうとした。default は無い、と言われる。',
      bad: ["import fetchCases from '@/api/cases'", '', 'fetchCases()'], good: ["import { fetchCases } from '@/api/cases'", '', 'fetchCases()'],
      msgs: [['エディタ', "TS1192: Module '\"@/api/cases\"' has no default export."], ['ブラウザ', "SyntaxError: The requested module '/src/api/cases.ts' does not provide an export named 'default'"], ['古い設定', 'undefined のまま進み → TypeError: fetchCases is not a function']],
      read: '「default という export は無い」＝ <b>{ } を付けて</b>', fix: [['import fetchCases'], ['import { fetchCases }']] },
    { tab: 'default に { } を付けた', say: '部品に { } を付けた。CaseCard という名前の export は無い、と言われる。',
      bad: ["import { CaseCard } from './CaseCard.vue'"], good: ["import CaseCard from './CaseCard.vue'"],
      msgs: [['ブラウザ', "SyntaxError: The requested module '/src/components/CaseCard.vue' does not provide an export named 'CaseCard'"], ['エディタ', "TS2614: Module './CaseCard.vue' has no exported member 'CaseCard'. Did you mean to use 'import CaseCard from \"./CaseCard.vue\"' instead?"]],
      read: '「CaseCard という名前の export は無い」＝ <b>{ } を外して</b>', fix: [['import { CaseCard }'], ['import CaseCard']] },
    { tab: 'export default が 2 つ', say: '1 ファイルに default は 1 つだけ。2 つ書くと、どちらか決められない。',
      bad: ['export default fetchCases', 'export default caseApi'], good: ['export function fetchCases() {}', 'export default caseApi'],
      msgs: [['エディタ', 'TS2528: A module cannot have multiple default exports.'], ['ビルド', 'Multiple exports with the same name "default"']],
      read: '「default が複数」＝ <b>片方を named にする</b>', fix: [['export default fetchCases'], ['export function fetchCases']] },
    { tab: '型に import type が無い', say: '型を普通に取ると、実行時に「値」を探しに行ってしまう。',
      bad: ["import { Case } from '@/types/case'"], good: ["import type { Case } from '@/types/case'"],
      msgs: [['エディタ', "TS1484: 'Case' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled."], ['ブラウザ', "SyntaxError: The requested module '/src/types/case.ts' does not provide an export named 'Case'"]],
      read: '「型は type import で」＝ <b>import type</b> を付ける', fix: [["import { Case }"], ['import type { Case }']] },
    { tab: '名前の打ち間違い', say: 'named は名前が 1 文字違うだけで取れない。',
      bad: ["import { fetchCase } from '@/api/cases'"], good: ["import { fetchCases } from '@/api/cases'"],
      msgs: [['エディタ', "TS2724: '\"@/api/cases\"' has no exported member named 'fetchCase'. Did you mean 'fetchCases'?"], ['ブラウザ', "SyntaxError: The requested module '/src/api/cases.ts' does not provide an export named 'fetchCase'"]],
      read: '「Did you mean」＝ <b>候補の名前</b>に直す', fix: [['fetchCase }'], ['fetchCases }']] },
  ];
  function scene5(el) {
    let cur = 0, tok = 0;
    const tabs = h('div', { class: 'vxI-tabs' }), wrap = h('div', { class: 'vxI' });
    ERR.forEach((e, i) => tabs.append(h('button', { class: 'vxI-tab x', type: 'button', onclick: () => { cur = i; draw(); } }, '✖ ' + e.tab)));
    function draw() {
      const e = ERR[cur]; tok++;
      [...tabs.children].forEach((b, i) => b.classList.toggle('on', i === cur));
      const pb = mkPre(e.bad, 'ts', '✖ こう書くと', BAD), pg = mkPre(e.good, 'ts', '✓ こう直す', OK);
      const ob = h('div', { class: 'vxI-out', 'data-k': 'bad' }, h('span', { class: 'mute' }, '▶ 実行を押すと、メッセージが出る'));
      const og = h('div', { class: 'vxI-out', 'data-k': 'good' }, h('span', { class: 'mute' }, '▶ 実行を押すと、結果が出る'));
      const why = h('div', { class: 'vxI-why', html: e.say });
      const two = h('div', { class: 'vxI-two' },
        h('div', { class: 'vxI-box no' }, h('div', { class: 'vxI-tt' }, '✖ こう書くと'), h('div', { class: 'vxI-code' }, pb), ob),
        h('div', { class: 'vxI-box yes' }, h('div', { class: 'vxI-tt' }, '✓ こう直す'), h('div', { class: 'vxI-code' }, pg), og));
      const run = async () => {
        const my = ++tok;
        ob.replaceChildren(); og.replaceChildren();
        for (const [src, msg] of e.msgs) { if (my !== tok) return; ob.append(h('div', { class: 'e' }, h('span', { class: 'src' }, src), msg)); await new Promise((r) => setTimeout(r, 250)); }
        og.append(h('div', { class: 'g' }, '✓ エラーなし'), h('div', { class: 'mute' }, '取れるものが取れた'));
        why.innerHTML = '📖 ' + e.read; why.className = 'vxI-why ok';
        shake(ob); bump(og);
      };
      link(two, [pb, pg], { bad: [e.fix[0], []], good: [[], e.fix[1]] }, () => [[], []]);
      wrap.replaceChildren(tabs, h('div', { class: 'vxI-bar' }, btn('▶ 実行して比べる', run, 'primary'), why), two);
    }
    el.append(wrap); draw();
  }

  /* ================= 6. Vue でよく見る import 早見 ================= */
  const S6 = [
    { toks: [['import', 'imp'], [' { ', 'brace'], ['ref, computed', 'name'], [' } ', 'brace'], ['from', 'from'], [" 'vue'", 'src']], badges: [['named', BLUE], ['{ } あり', '#a98bff'], ['ライブラリ', GREEN]], use: '<script setup> の頭。名前は vue が決めている。', rd: 'インポート レフ、コンピューテッド フロム ビュー' },
    { toks: [['import', 'imp'], [' { ', 'brace'], ['createApp', 'name'], [' } ', 'brace'], ['from', 'from'], [" 'vue'", 'src']], badges: [['named', BLUE], ['{ } あり', '#a98bff'], ['main.ts', GOLD]], use: 'main.ts：アプリを起動する関数。', rd: 'インポート クリエイトアップ フロム ビュー' },
    { toks: [['import', 'imp'], [' ', ''], ['App', 'name'], [' ', ''], ['from', 'from'], [" './App.vue'", 'src']], badges: [['default', GOLD], ['{ } なし', GREEN], ['部品', PINK]], use: '.vue は部品 = default。名前は PascalCase。', rd: 'インポート アップ フロム アップ ドットブイ' },
    { toks: [['import', 'imp'], [' ', ''], ['router', 'name'], [' ', ''], ['from', 'from'], [" './router'", 'src']], badges: [['default', GOLD], ['{ } なし', GREEN], ['.ts のファイル', BLUE]], use: 'router/index.ts が export default router している。', rd: 'インポート ルーター フロム ルーター' },
    { toks: [['import', 'imp'], [' { ', 'brace'], ['fetchCases', 'name'], [' } ', 'brace'], ['from', 'from'], [" '@/api/cases'", 'src']], badges: [['named', BLUE], ['{ } あり', '#a98bff'], ['自分の関数', GREEN]], use: '@/ は src/ の意味。名前は export と同じに。', rd: 'インポート フェッチケース フロム アットマーク api スラッシュ ケース' },
    { toks: [['import', 'imp'], [' type ', 'ty'], ['{ ', 'brace'], ['Case', 'name'], [' } ', 'brace'], ['from', 'from'], [" '@/types/case'", 'src']], badges: [['named', BLUE], ['型だけ', '#a98bff'], ['実行時は消える', GOLD]], use: '型は import type。値と見分けがつく。', rd: 'インポート タイプ ケース フロム アットマーク タイプス スラッシュ ケース' },
  ];
  const TKC = { imp: GOLD, brace: '#a98bff', name: BLUE, from: PINK, src: GREEN, ty: '#ff8a5b' };
  const TKN = { imp: 'import', brace: '{ }', name: '取り込む名前', from: 'from', src: '取り込み元', ty: 'type（型だけ）' };
  function scene6(el) {
    const say = h('div', { class: 'vxI-say' }, '🖱 カードを押す → 読み方が出る（声も出ます）');
    let sel = null;
    const info = h('div', { class: 'vxI-why' }, 'トークンにカーソル → 名前が出る');
    const cards = S6.map((c, ci) => {
      const ln = h('div', { class: 'ln' }, ...c.toks.map(([t, k]) => h('span', { class: 'tk', 'data-t': k, style: { '--tc': TKC[k] || '#fff' }, onmouseenter: (ev) => { if (k) { ev.target.classList.add('lit'); info.innerHTML = '<b>' + TKN[k] + '</b>：<code>' + t.trim() + '</code>'; } }, onmouseleave: (ev) => ev.target.classList.remove('lit') }, t)));
      const rd = h('div', { class: 'rd' }, '👂 押すと読み方');
      const card = h('button', { class: 'vxI-card', type: 'button', onclick: () => {
        sel = ci; cards.forEach((x, i) => x.classList.toggle('on', i === ci)); rd.textContent = '👂 ' + c.rd; say.innerHTML = '📖 <b>' + c.rd + '</b>'; bump(card);
        try { const u = new SpeechSynthesisUtterance(c.rd.replace(/ /g, '、')); u.lang = 'ja-JP'; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); } catch (e) { /* 音が出ない環境 */ }
      } },
      h('div', { class: 'bd' }, ...c.badges.map(([t, col]) => h('span', { style: { background: col } }, t))), ln, h('div', { class: 'use' }, c.use), rd);
      return card;
    });
    void sel;
    el.append(h('div', { class: 'vxI' }, h('div', { class: 'vxI-bar' }, say), h('div', { class: 'vxI-grid' }, ...cards), info));
  }

  reg({
    id: 'x-vue-import', title: 'import と export（{ } の有る無し）', sub: '部品は { } なし。それ以外は？', emoji: '📦',
    meta: { cat: 'vue', day: '4日目', when: 'コンポーネントを import するとき、{ } が要るか迷ったら', mins: 15, order: 35, level: '基礎', after: 'vue-comp', why: 'import { } の有る無しを間違えると undefined やエラーになる。export の種類で決まる' },
    scenes: [
      { t: '{ } がある import と、ない import', tag: 'DEFAULT vs NAMED', lead: '<b>export default</b> は <b>{ } なし</b>、<b>named export</b> は <b>{ } あり</b>。', render: scene1 },
      { t: '.vue ファイルは何を export している？', tag: '.VUE EXPORT', lead: '.vue は、見えない <b>export default</b> で<b>部品を 1 つ</b>公開している。', render: scene2 },
      { t: '部品の中から、ほかのものも import したい', tag: 'EXTRA EXPORT', lead: '型や定数は、普通の <b>&lt;script&gt;</b> で <b>export</b> して、<b>{ }</b> で import する。', render: scene3 },
      { t: 'export default と export const の見分け', tag: 'EXPORT ⇒ IMPORT', lead: 'export の書き方で、<b>import の書き方</b>（{ } の有無）が決まる。', render: scene4 },
      { t: 'よくあるエラー', tag: 'ERRORS', lead: '{ } の付け間違いは、<b>does not provide an export</b> と言われる。', render: scene5 },
      { t: 'Vue でよく見る import 早見', tag: 'CHEAT SHEET', lead: '<b>部品は { } なし</b>、<b>道具や型は { } あり</b>。', render: scene6 },
    ],
  });
})();
