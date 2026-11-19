/* 補足 Vue：三項演算子と矢印関数（x-vue-arrow）
   1) a > b ? 1 : 2 の読み方  2) if 文だと、こんなに長い（K.vs.versus）  3) テンプレートでの使いどころ
   4) () => 123 の読み方  5) Vue で => が出てくる場所  6) よくある落とし穴 */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.W || !K.vs || !K.tsAnatBuild) return;
  const { h, code, style } = K.W;
  const reg = (o) => K.reg(Object.assign({ track: 'extra' }, o));
  const COLS = ['#ff6b9d', '#5b9dff', '#ffb454', '#2fd4a4', '#a98bff', '#ff8a5b'];
  const BAD = 'var(--bad)', OK = 'var(--ok)', VUE = 'var(--vue)';

  style('vxA', `
  .vxA{display:grid;gap:14px;min-width:0}
  .vxA-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:stretch}
  .vxA-bar .btn{height:44px;padding:0 1.1em;font-size:.9rem}
  .vxA-say{flex:1;min-width:240px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-height:44px;padding:6px 16px;border-radius:12px;border:2px solid var(--line);background:var(--card);font:800 1rem/1.55 var(--font);transition:.25s}
  .vxA-say.bad{border-color:var(--bad);color:var(--bad)}.vxA-say.ok{border-color:var(--ok)}
  .vxA-say code,.vxA-why code,.vxA-ex code{font:800 .92rem var(--mono);color:var(--vue)}
  .vxA-box>.vxA-say{flex:none}
  .vxA-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:stretch}
  @media(max-width:980px){.vxA-two{grid-template-columns:1fr}}
  .vxA-box{border:2px solid var(--line);border-radius:14px;background:var(--card);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}
  .vxA-tt{font:900 1rem var(--font);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .vxA-stage{position:relative;border-radius:12px;background:#f4f6fb;color:#1f2a44;padding:14px;min-width:0;flex:1;display:flex;flex-direction:column;gap:12px;justify-content:center}
  .vxA-stage small{font:800 .85rem var(--font);color:#5b6788}
  .vxA-code{min-width:0;display:flex;flex-direction:column}.vxA-code>pre.code{flex:1;margin:0;font-size:.92rem}
  .vxA-pkt{position:absolute;left:0;top:0;z-index:9;padding:.2em .85em;border-radius:99px;color:#06101f;font:900 .9rem var(--mono);box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap}
  .vxA .an-sec{margin:0}.vxA .an-split{align-items:stretch}.vxA .an-split .an-box{display:flex;align-items:center;font-size:1.35rem}
  .vxA-bump{animation:vxAb .7s}@keyframes vxAb{30%{transform:scale(1.07);box-shadow:0 0 0 6px color-mix(in srgb,var(--ok) 45%,transparent)}}
  .vxA [data-k]{cursor:default;border-radius:10px;transition:outline-color .15s,background .15s}
  .vxA [data-k].vxA-hot{outline:2px solid var(--c,#2f7bff);outline-offset:2px;box-shadow:0 0 0 5px color-mix(in srgb,var(--c,#2f7bff) 22%,transparent)}
  .vxA-why{font:800 .95rem/1.6 var(--font);padding:.5em .9em;border-radius:10px;background:color-mix(in srgb,var(--team) 12%,var(--card));border-left:5px solid var(--team)}
  .vxA-why.bad{background:color-mix(in srgb,var(--bad) 12%,var(--card));border-left-color:var(--bad)}.vxA-why.ok{background:color-mix(in srgb,var(--ok) 12%,var(--card));border-left-color:var(--ok)}
  /* シーン1：ステッパー・ベルト */
  .vxA-ctl{display:flex;gap:14px;flex-wrap:wrap;align-items:center}
  .vxA-stp{display:flex;align-items:center;gap:8px;padding:.3em .7em;border-radius:12px;background:#fff;border:2px solid #b9c4e2}
  .vxA-stp .nm{font:900 1.1rem var(--mono);color:#2f6df0;min-width:1em}
  .vxA-nv{font:900 1.5rem var(--mono);min-width:1.2em;text-align:center}
  .vxA-pm{all:unset;cursor:pointer;width:2em;height:2em;border-radius:50%;display:grid;place-items:center;background:#e4e9f7;font:900 1rem var(--font);color:#1f2a44;transition:.15s}
  .vxA-pm:hover{background:#2f6df0;color:#fff}
  .vxA-expr{font:900 1.35rem/1.6 var(--mono);display:flex;gap:.45em;flex-wrap:wrap;align-items:center;padding:.4em .8em;border-radius:12px;background:#fff;border:2px solid #b9c4e2;width:fit-content;max-width:100%}
  .vxA-expr .p{padding:.02em .3em;border-radius:8px;transition:.3s}
  .vxA-expr .op{color:#9a6a00}.vxA-expr .skip{opacity:.28;text-decoration:line-through}.vxA-expr .take{background:#dff7ec;color:#127a5c;box-shadow:0 0 0 2px #5fcfae}
  .vxA-belt{display:grid;grid-template-columns:minmax(110px,1fr) 44px minmax(120px,1.1fr) 44px minmax(100px,.9fr);grid-template-rows:1fr 1fr;gap:10px 0;align-items:center}
  @media(max-width:620px){.vxA-belt{grid-template-columns:minmax(80px,1fr) 22px minmax(90px,1fr) 22px minmax(70px,.8fr)}}
  .vxA-judge,.vxA-resv{grid-row:1/3;align-self:stretch;display:grid;align-content:center;justify-items:center;gap:4px;padding:10px;border-radius:12px;border:3px solid #b9c4e2;background:#fff;text-align:center;font:900 1rem var(--mono)}
  .vxA-judge b{font:900 .95rem var(--font);padding:.1em .7em;border-radius:99px;background:#e4e9f7;transition:.3s}
  .vxA-judge b.t{background:#2fd4a4;color:#06101f}.vxA-judge b.f{background:#ff8a96;color:#06101f}
  .vxA-resv{border-color:#2f6df0;grid-column:5}.vxA-resv .big{font:900 2.1rem var(--mono);color:#2f6df0}
  .vxA-trk{height:6px;border-radius:3px;background:#d4daee;position:relative;transition:.3s}
  .vxA-trk::after{content:'';position:absolute;right:-3px;top:-6px;border:9px solid transparent;border-left:13px solid #d4daee;border-right:0;transition:.3s}
  .vxA-lane{display:grid;grid-template-columns:44px minmax(120px,1.1fr) 44px;grid-column:2/5;align-items:center;transition:opacity .3s;position:relative}
  .vxA-lane.on .vxA-trk{background:repeating-linear-gradient(90deg,var(--lc) 0 10px,transparent 10px 18px);animation:vxAm .6s linear infinite}
  .vxA-lane.on .vxA-trk::after{border-left-color:var(--lc)}.vxA-lane:not(.on){opacity:.4}
  @keyframes vxAm{to{background-position:18px 0}}
  .vxA-chip{display:grid;gap:2px;justify-items:center;padding:.4em .6em;border-radius:12px;border:3px solid #b9c4e2;background:#fff;font:900 1.5rem var(--mono)}
  .vxA-chip small{font:800 .85rem var(--font)}.vxA-lane.on .vxA-chip{border-color:var(--lc);background:color-mix(in srgb,var(--lc) 14%,#fff)}
  /* シーン2 */
  .vxA-slot{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:.6em .9em;border-radius:12px;border:3px solid #b9c4e2;background:#fff;font:800 1rem var(--font);transition:.3s}
  .vxA-slot.is-urgent{border-color:#ff6b7a;background:#fff0f2}.vxA-slot.is-full{border-color:#8892b8;background:#eceef6}
  .vxA-slot .lab{padding:.1em .8em;border-radius:99px;background:#2fd4a4;color:#06101f;font:900 .9rem var(--font);transition:.3s}
  .vxA-slot.is-urgent .lab{background:#ff6b7a}.vxA-slot.is-full .lab{background:#8892b8;color:#fff}
  .vxA-slot b{font:900 1.2rem var(--mono);color:#2f6df0}
  .vxA-b{all:unset;cursor:pointer;padding:.45em 1.2em;border-radius:99px;background:linear-gradient(135deg,#ffb454,#ff8a5b);color:#06101f;font:900 .95rem var(--font);box-shadow:0 4px 12px -4px #ff8a5b;width:fit-content;transition:.2s}
  .vxA-b:hover{transform:translateY(-1px)}.vxA-b[disabled]{opacity:.4;pointer-events:none;filter:grayscale(1)}
  .vxA-dom{font:800 .85rem var(--mono);color:#5b6788}
  /* シーン3 */
  .vxA-tabs{display:flex;gap:8px;flex-wrap:wrap}
  .vxA-tab{all:unset;cursor:pointer;padding:.45em 1em;border-radius:99px;border:2px solid var(--line);background:var(--card2);font:800 .9rem var(--font);transition:.2s}
  .vxA-tab:hover{border-color:var(--vue)}.vxA-tab.on{background:var(--vue);border-color:var(--vue);color:#06101f}
  .vxA-tab.x.on{background:var(--bad);border-color:var(--bad)}.vxA-tab.o.on{background:var(--ok);border-color:var(--ok)}
  .vxA-res{color:#1f2a44;padding:.7em .9em;border-radius:12px;background:#fff;border:2px solid #cfd4e2;font:800 1rem/1.6 var(--font);display:grid;gap:8px;min-height:5em;align-content:center}
  .vxA-res .pill{width:fit-content;padding:.2em .9em;border-radius:99px;background:#e4e9f7;font:900 1rem var(--font);transition:.3s}
  .vxA-res .pill.is-urgent{background:#ff6b7a;color:#fff}
  .vxA-res form{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .vxA-res input{font:800 .95rem var(--font);padding:.35em .7em;border:2px solid #b9c4e2;border-radius:8px;width:9em}
  .vxA-tog{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
  .vxA-tog .vxA-tab{background:#fff;color:#1f2a44}.vxA-tog .vxA-tab.on{color:#06101f}
  /* シーン4 */
  .vxA-morph{padding:20px 14px;border-radius:12px;background:var(--code);overflow:auto;font:700 1.3rem/1.9 var(--mono);color:#d8dcff;white-space:pre;min-height:4.4em;display:flex;align-items:center}
  .vxA-morph .tk{display:inline-block;overflow:hidden;white-space:pre;vertical-align:bottom;max-width:14em;opacity:1;transition:max-width .55s ease,opacity .45s ease}
  .vxA-morph .tk.gone{max-width:0;opacity:0}
  .vxA-morph .kw{color:#ffb454}.vxA-morph .ar{color:#ff6b9d}.vxA-morph .nu{color:#2fd4a4}.vxA-morph .pa{color:#5b9dff}
  .vxA-morph .tk.new{animation:vxAn .9s}@keyframes vxAn{0%,100%{background:transparent}30%{background:rgba(255,107,157,.45)}}
  .vxA-steps{display:flex;gap:8px;flex-wrap:wrap}
  .vxA-sb{all:unset;cursor:pointer;box-sizing:border-box;padding:6px 12px;border:2px solid var(--line);border-radius:12px;background:var(--card);display:flex;gap:8px;align-items:center;font:800 .9rem/1.35 var(--font);transition:.2s}
  .vxA-sb i{font-style:normal;flex:none;width:1.7em;height:1.7em;border-radius:50%;display:grid;place-items:center;background:var(--line);font:900 .85rem var(--font)}
  .vxA-sb.past{border-color:color-mix(in srgb,var(--ok) 55%,var(--line))}.vxA-sb.past i{background:var(--ok);color:#06101f}
  .vxA-sb.on{border-color:var(--vue);background:color-mix(in srgb,var(--vue) 16%,var(--card));transform:translateY(-2px)}.vxA-sb.on i{background:var(--vue);color:#06101f}
  .vxA-fn{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
  .vxA-fnbox{padding:.5em .9em;border-radius:12px;border:3px solid #2f6df0;background:#fff;font:900 1.1rem var(--mono);transition:.3s}
  .vxA-io{padding:.4em .8em;border-radius:12px;border:2px solid #b9c4e2;background:#fff;font:900 1.2rem var(--mono);min-width:4em;text-align:center}
  .vxA-arw{font:900 1.3rem var(--mono);color:#7b86aa}
  /* シーン5 */
  .vxA-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:stretch}
  .vxA-grid .span2{grid-column:span 2}
  @media(max-width:1100px){.vxA-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.vxA-grid .span2{grid-column:span 2}}
  @media(max-width:700px){.vxA-grid{grid-template-columns:1fr}.vxA-grid .span2{grid-column:auto}}
  .vxA-ex{border:2px solid var(--line);border-radius:14px;background:var(--card);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0;cursor:pointer;transition:.2s}
  .vxA-ex:hover{border-color:var(--vue);transform:translateY(-2px)}
  .vxA-ex .tt{font:900 1rem var(--font);display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .vxA-ex .soon{font:900 .8rem var(--font);padding:.15em .7em;border-radius:99px;background:#ffb454;color:#06101f}
  .vxA-ex pre.code{margin:0;font-size:.9rem;flex:1}
  .vxA-ex .fx{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:.5em .7em;border-radius:10px;background:#f4f6fb;color:#1f2a44;font:800 .95rem var(--font);min-height:3.4em}
  .vxA-ex .fx .it{padding:.1em .7em;border-radius:99px;background:#2f6df0;color:#fff;font:800 .9rem var(--font)}
  .vxA-ex .fx .it.off{background:#c8cfe4;color:#6b7699;text-decoration:line-through}
  .vxA-ex .fx .mono{font:900 1rem var(--mono);color:#127a5c}
  .vxA-ex .fx .vb{all:unset;cursor:pointer;padding:.25em .9em;border-radius:99px;background:linear-gradient(135deg,#ffb454,#ff8a5b);color:#06101f;font:900 .9rem var(--font)}
  .vxA-ex .say1{font:800 .9rem/1.5 var(--font);color:var(--mute)}
  .vxA-ex .pv{display:grid;gap:6px;width:100%}.vxA-ex .pv div{display:flex;gap:8px;align-items:center;padding:.2em .5em;border-radius:8px}.vxA-ex .pv b{font:900 .9rem var(--mono);color:#2f6df0;min-width:6.4em}
  /* シーン6 */
  .vxA-pit{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:stretch}
  @media(max-width:980px){.vxA-pit{grid-template-columns:1fr}}
  .vxA-side{border:2px solid var(--line);border-radius:14px;background:var(--card);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}
  .vxA-side.no{border-color:color-mix(in srgb,var(--bad) 55%,var(--line))}.vxA-side.yes{border-color:color-mix(in srgb,var(--ok) 55%,var(--line))}
  .vxA-side.no>.vxA-tt{color:var(--bad)}.vxA-side.yes>.vxA-tt{color:var(--ok)}
  .vxA-side pre.code{margin:0;font-size:.92rem;flex:1}
  .vxA-out{background:#0b1020;color:#cfe;border-radius:10px;padding:10px 12px;font:700 .95rem/1.7 var(--mono);min-height:5.4em;display:grid;gap:2px;align-content:start}
  .vxA-out .mute{color:#8892b8}.vxA-out .e{color:#ff8a96}.vxA-out .g{color:#2fd4a4}
  `);

  /* ---------- 共通の道具 ---------- */
  const lnOf = (pre, toks) => { const o = []; pre.lines.forEach((l, i) => { if ((toks || []).some((t) => l.textContent.includes(t))) o.push(i + 1); }); return o; };
  const bump = (el) => { if (!el) return; el.classList.remove('vxA-bump'); void el.offsetWidth; el.classList.add('vxA-bump'); };
  async function fly(host, from, to, text, col) {
    if (!from || !to || !host.isConnected) return;
    const hr = host.getBoundingClientRect(), a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    const el = h('span', { class: 'vxA-pkt', style: { background: col || '#2fd4a4' } }, text); host.append(el);
    const w = el.offsetWidth, hh = el.offsetHeight, pt = (r) => ({ x: r.left - hr.left + r.width / 2 - w / 2, y: r.top - hr.top + r.height / 2 - hh / 2 });
    const A = pt(a), B = pt(b);
    try { await el.animate([{ transform: `translate(${A.x}px,${A.y}px) scale(.6)`, opacity: 0 }, { transform: `translate(${A.x}px,${A.y}px)`, opacity: 1, offset: .15 }, { transform: `translate(${B.x}px,${B.y}px)`, opacity: 1, offset: .85 }, { transform: `translate(${B.x}px,${B.y}px) scale(.6)`, opacity: 0 }], { duration: 800, easing: 'ease-in-out' }).finished; } catch (e) { /* 途中で消えてもよい */ }
    el.remove();
  }
  /* root 内の [data-k] 部品 ⇄ 複数のコード（pres）の行。map = { key: [pre0 のトークン, pre1 のトークン…] } */
  function link(root, pres, map, rest) {
    const keys = Object.keys(map);
    const set = (k) => pres.forEach((pre, pi) => pre.setHi(k ? lnOf(pre, (map[k] || [])[pi]) : ((rest ? rest() : [])[pi] || []), 'on'));
    const on = (k) => { set(k); root.querySelectorAll('[data-k]').forEach((n) => n.classList.toggle('vxA-hot', n.getAttribute('data-k') === k)); };
    const off = () => { set(null); root.querySelectorAll('.vxA-hot').forEach((n) => n.classList.remove('vxA-hot')); };
    keys.forEach((k, i) => root.querySelectorAll('[data-k="' + k + '"]').forEach((n) => { if (n.__vxl) return; n.__vxl = 1; n.style.setProperty('--c', COLS[i % COLS.length]); n.addEventListener('mouseenter', () => on(k)); n.addEventListener('mouseleave', off); }));
    pres.forEach((pre, pi) => pre.lines.forEach((ln) => {
      ln.addEventListener('mouseenter', () => { const k = keys.find((kk) => ((map[kk] || [])[pi] || []).some((t) => ln.textContent.includes(t))); if (k) on(k); });
      ln.addEventListener('mouseleave', off);
    }));
    if (rest) set(null);
  }
  const mkPre = (lines, lang, file, color, dim) => code([].concat(lines).join('\n'), lang, { color: color || VUE, file, dim: !!dim, edit: false });
  const btn = (label, onclick, cls) => h('button', { class: 'btn' + (cls ? ' ' + cls : ''), type: 'button', style: cls === 'primary' ? { '--c': VUE } : {}, onclick }, label);
  const yen = (n) => n.toLocaleString('ja-JP') + ' 円';

  /* ================= 1. a > b ? 1 : 2 の読み方 ================= */
  function scene1(el) {
    const PARTS = (c, t, f) => ({
      cond: ['条件', '#5b9dff', c],
      q: ['?', '#ffb454', '「もし本当なら」と読む。ここから右が、答えの候補。'],
      t: ['真のときの値', '#2fd4a4', t],
      c: [':', '#ff6b9d', '「そうでなければ」と読む。'],
      f: ['偽のときの値', '#a98bff', f],
    });
    const spec = (tab, a, b, c, parts) => ({ tab, split: true, lang: 'ts', title: '🔍 部品の名前（カーソルを乗せる）', tokens: [[a, ['cond']], [' ? ', ['q']], [b, ['t']], [' : ', ['c']], [c, ['f']]], parts });
    const anat = K.tsAnatBuild(Object.assign(
      spec('a > b ? 1 : 2', 'a > b', '1', '2', PARTS('a > b：本当（true）か、ウソ（false）か。', '条件が本当のとき、答えになる値。', '条件がウソのとき、答えになる値。')),
      { more: [spec('予約枠の例', 'slots === 0', "'満席'", "'受付中'", PARTS('slots === 0：残りが 0 か？', '0 枠のとき → 満席', 'それ以外のとき → 受付中'))] }));

    const st = { a: 5, b: 3 };
    let tok = 0;
    const aV = h('b', { class: 'vxA-nv' }), bV = h('b', { class: 'vxA-nv' });
    const stp = (nm, k, V) => h('div', { class: 'vxA-stp' }, h('span', { class: 'nm' }, nm), h('button', { class: 'vxA-pm', type: 'button', onclick: () => chg(k, -1) }, '−'), V, h('button', { class: 'vxA-pm', type: 'button', onclick: () => chg(k, 1) }, '＋'));
    const eA = h('span', { class: 'p' }), eB = h('span', { class: 'p' }), eT = h('span', { class: 'p', 'data-k': 't' }, '1'), eF = h('span', { class: 'p', 'data-k': 'f' }, '2');
    const expr = h('div', { class: 'vxA-expr' },
      h('span', { 'data-k': 'cond' }, eA, ' ', h('span', { class: 'op' }, '>'), ' ', eB), h('span', { class: 'op', 'data-k': 'q' }, '?'), eT, h('span', { class: 'op', 'data-k': 'c' }, ':'), eF);
    const jv = h('span'), jr = h('b'), judge = h('div', { class: 'vxA-judge', 'data-k': 'cond' }, h('small', { style: { font: '800 .85rem var(--font)', color: '#5b6788' } }, '① 条件を調べる'), jv, jr);
    const chipT = h('div', { class: 'vxA-chip', 'data-k': 't' }, h('small', '真なら'), '1'), chipF = h('div', { class: 'vxA-chip', 'data-k': 'f' }, h('small', '偽なら'), '2');
    const laneT = h('div', { class: 'vxA-lane', style: { gridRow: '1', '--lc': '#2fd4a4' } }, h('div', { class: 'vxA-trk', 'data-k': 'q' }), chipT, h('div', { class: 'vxA-trk' }));
    const laneF = h('div', { class: 'vxA-lane', style: { gridRow: '2', '--lc': '#a98bff' } }, h('div', { class: 'vxA-trk', 'data-k': 'c' }), chipF, h('div', { class: 'vxA-trk' }));
    const rv = h('div', { class: 'big' }), resv = h('div', { class: 'vxA-resv' }, h('small', { style: { font: '800 .85rem var(--font)', color: '#5b6788' } }, '② 選ばれた値'), rv);
    const belt = h('div', { class: 'vxA-belt' }, judge, laneT, laneF, resv);
    const live = h('div', { class: 'vxA-say' });
    const render = () => {
      const c = st.a > st.b;
      aV.textContent = st.a; bV.textContent = st.b; eA.textContent = st.a; eB.textContent = st.b;
      jv.textContent = st.a + ' > ' + st.b; jr.textContent = c ? '本当（true）' : 'ウソ（false）'; jr.className = c ? 't' : 'f';
      laneT.classList.toggle('on', c); laneF.classList.toggle('on', !c);
      eT.className = 'p ' + (c ? 'take' : 'skip'); eF.className = 'p ' + (c ? 'skip' : 'take');
      rv.textContent = c ? '1' : '2';
      live.innerHTML = '今：<code>' + st.a + ' &gt; ' + st.b + '</code> は <b>' + (c ? '本当' : 'ウソ') + '</b> → <b>' + (c ? '1' : '2') + '</b>';
      live.className = 'vxA-say ' + (c ? 'ok' : '');
    };
    const go = async () => {
      render(); const my = ++tok, c = st.a > st.b;
      await fly(belt, judge, c ? chipT : chipF, c ? '1' : '2', c ? '#2fd4a4' : '#a98bff');
      if (my !== tok) return;
      await fly(belt, c ? chipT : chipF, resv, c ? '1' : '2', c ? '#2fd4a4' : '#a98bff');
      if (my === tok) bump(resv);
    };
    const chg = (k, d) => { st[k] = Math.max(0, Math.min(9, st[k] + d)); go(); };
    const preset = (a, b) => () => { st.a = a; st.b = b; go(); };
    render();
    const stage = h('div', { class: 'vxA-stage' }, h('div', { class: 'vxA-ctl' }, stp('a', 'a', aV), stp('b', 'b', bV), expr), belt);
    link(stage, [], { cond: [], q: [], t: [], c: [], f: [] });
    const root = h('div', { class: 'vxA' },
      h('div', { class: 'vxA-say', style: { flex: 'none' } }, '📖 読み方：', h('b', 'a が b より大きければ 1、そうでなければ 2')),
      anat,
      h('div', { class: 'vxA-bar' }, btn('▶ a を大きく（7 と 3）', preset(7, 3), 'primary'), btn('a を小さく（2 と 6）', preset(2, 6)), btn('同じ（4 と 4）→ ?', preset(4, 4)), live),
      stage);
    el.append(root);
  }

  /* ================= 2. if 文だと、こんなに長い ================= */
  const S2_NO = [
    '<script setup lang="ts">',
    "import { ref } from 'vue'",
    '',
    'const slots = ref<number>(3)',
    '</script>',
    '',
    '<template>',
    '  <div v-if="slots <= 1" class="slot is-urgent">',
    '    <span v-if="slots === 0">満席</span>',
    '    <span v-else>受付中</span>',
    '  </div>',
    '  <div v-else class="slot">',
    '    <span>受付中</span>',
    '  </div>',
    '  <button :disabled="slots === 0" @click="slots--">予約する</button>',
    '</template>',
  ].join('\n');
  const S2_YES = [
    '<script setup lang="ts">',
    "import { ref } from 'vue'",
    '',
    'const slots = ref<number>(3)',
    '</script>',
    '',
    '<template>',
    '  <div class="slot" :class="slots <= 1 ? \'is-urgent\' : \'\'">',
    "    {{ slots === 0 ? '満席' : '受付中' }}",
    '  </div>',
    '  <button :disabled="slots === 0" @click="slots--">予約する</button>',
    '</template>',
  ].join('\n');

  const s2UI = (yes) => (ctx) => {
    let slots = 3;
    const num = h('b', '3'), lab = h('span', { class: 'lab', 'data-k': 'label' }), dom = h('div', { class: 'vxA-dom' });
    const card = h('div', { class: 'vxA-slot', 'data-k': 'cls' }, '残り ', num, ' 枠', lab);
    const b = h('button', { class: 'vxA-b', type: 'button', 'data-k': 'btn', onclick: () => press() }, '予約する');
    const render = () => {
      num.textContent = slots; lab.textContent = slots === 0 ? '満席' : '受付中';
      card.classList.toggle('is-urgent', slots <= 1 && slots > 0); card.classList.toggle('is-full', slots === 0);
      b.disabled = slots === 0;
      dom.textContent = yes ? 'DOM：div は 1 つだけ（class と文字が中で変わる）' : 'DOM：' + (slots <= 1 ? 'v-if 側の div' : 'v-else 側の div') + ' が作られている（もう片方は無い）';
    };
    const press = () => { if (slots === 0) return; slots--; render(); ctx.bump(card); ctx.banner(slots === 0 ? '満席：ラベルも class も、ボタンの disabled も変わった ✓' : '残り ' + slots + ' 枠：' + (slots <= 1 ? '赤い「残りわずか」に' : 'まだ余裕'), slots <= 1 ? 'warn' : 'ok'); };
    render();
    return { el: h('div', { style: { display: 'grid', gap: '10px' } }, card, b, dom), press, set(n) { slots = n; render(); ctx.bump(card); }, reset() { slots = 3; render(); } };
  };

  function scene2(el) {
    el.append(K.vs.versus({
      banner: '同じ見た目なのに、左は 7 行、右は 2 行。',
      bar: [
        { label: '▶ 予約する（両方）', primary: true, onclick: (ctx) => { ctx.ui.without.press(); ctx.ui.with.press(); } },
        { label: '残り 1 枠にする', onclick: (ctx) => { ctx.ui.without.set(1); ctx.ui.with.set(1); ctx.banner('1 枠：赤い表示に切り替わる。左は div ごと作り直し、右は class だけ', 'warn'); } },
        { label: '⟲ 最初から', onclick: (ctx) => ctx.reset() },
      ],
      without: { title: 'ない場合：v-if / v-else で書き分ける', file: 'SlotStatus.vue', lang: 'vue', src: S2_NO, ui: s2UI(false), keys: { label: ['満席', '受付中'], cls: ['is-urgent', 'slots <= 1', 'v-else class'], btn: [':disabled'] }, show: ['<div v-if', '<span', ':disabled'] },
      with: { title: 'ある場合：三項演算子 ? : で1行', file: 'SlotStatus.vue', lang: 'vue', src: S2_YES, ui: s2UI(true), keys: { label: ["'満席'"], cls: [':class'], btn: [':disabled'] }, show: [':class', '{{', ':disabled'] },
    }));
  }

  /* ================= 3. テンプレートでの使いどころ ================= */
  function scene3(el) {
    const st = { slots: 3, vip: false };
    const status = () => (st.slots === 0 ? '満席' : st.vip ? '優先受付' : '受付中');
    const CH = [
      { id: 'text', tab: '文字を切り替える', kind: 'o', rule: '短い「文字」の切替 → 三項で十分',
        lang: 'vue', file: 'SlotStatus.vue', src: ['<p>', "  {{ slots === 0 ? '満席' : '受付中' }}", '</p>'], keys: { val: ["{{ slots"] },
        view: () => [h('p', { 'data-k': 'val', style: { margin: 0 } }, '状態：', h('b', st.slots === 0 ? '満席' : '受付中'))] },
      { id: 'class', tab: 'class を切り替える', kind: 'o', rule: 'class の切替も、三項 1 行で足りる',
        lang: 'vue', file: 'SlotStatus.vue', src: ['<p :class="slots <= 1 ? \'is-urgent\' : \'\'">', '  残り {{ slots }} 枠', '</p>'], keys: { cls: [':class'] },
        view: () => [h('span', { class: 'pill' + (st.slots <= 1 ? ' is-urgent' : ''), 'data-k': 'cls' }, '残り ' + st.slots + ' 枠' + (st.slots <= 1 ? '（赤）' : ''))] },
      { id: 'dis', tab: ':disabled は条件だけ', kind: 'o', rule: '条件そのものが true / false。? : は要らない',
        lang: 'vue', file: 'SlotStatus.vue', src: ['<!-- ✖ 遠回り -->', '<button :disabled="slots === 0 ? true : false">予約</button>', '<!-- ✓ そのまま -->', '<button :disabled="slots === 0">予約</button>'], keys: { no: ['? true : false'], yes: ['<button :disabled="slots === 0">'] },
        view: () => [h('button', { class: 'vxA-b', type: 'button', 'data-k': 'yes', disabled: st.slots === 0 }, '予約'), h('small', { 'data-k': 'no', style: { color: '#c2253a' } }, '✖ ? true : false は、書かなくても同じ')] },
      { id: 'if', tab: 'ブロックごと：v-if', kind: 'o', rule: '要素ごと変わる → v-if / v-else。三項に詰め込まない',
        lang: 'vue', file: 'SlotStatus.vue', src: ['<form v-if="slots > 0">', '  <input placeholder="お名前">', '  <button>予約する</button>', '</form>', '<p v-else>満席です。キャンセル待ちはこちら</p>'], keys: { form: ['<form', '<input', '<button'], full: ['v-else'] },
        view: () => [st.slots > 0 ? h('form', { 'data-k': 'form', onsubmit: (e) => e.preventDefault() }, h('input', { placeholder: 'お名前' }), h('button', { class: 'vxA-b', type: 'button' }, '予約する')) : h('p', { 'data-k': 'full', style: { margin: 0 } }, '満席です。キャンセル待ちはこちら')] },
      { id: 'nest', tab: '入れ子の三項', kind: 'x', rule: '✖ どの ? と どの : が対か、すぐ読めない',
        lang: 'vue', file: 'SlotStatus.vue', src: ['<p>', "  {{ vip ? slots === 0 ? '満席' : '優先受付'", "         : slots === 0 ? '満席' : '受付中' }}", '</p>'], keys: { nest: ['{{ vip', ': slots === 0'] },
        view: () => [h('p', { 'data-k': 'nest', style: { margin: 0 } }, '状態：', h('b', status()))], why: '✖ 動くけれど、3 日後の自分が読めない。' },
      { id: 'fn', tab: '関数に分ける', kind: 'o', rule: '✓ 名前を付けて分ける（computed でも書ける：あとで習う）',
        lang: 'vue', file: 'SlotStatus.vue', src: ['<script setup lang="ts">', '// slots と vip は ref（上と同じ）', 'const statusLabel = (): string => {', "  if (slots.value === 0) return '満席'", "  return vip.value ? '優先受付' : '受付中'", '}', '</script>', '', '<template>', '  <p>{{ statusLabel() }}</p>', '</template>'], keys: { def: ['const statusLabel', 'if (slots', 'return'], use: ['{{ statusLabel()'] },
        view: () => [h('p', { 'data-k': 'use', style: { margin: 0 } }, '状態：', h('b', status())), h('small', { 'data-k': 'def', style: { color: '#5b6788' } }, 'statusLabel() が「満席 / 優先受付 / 受付中」を返す')] },
    ];
    let cur = 0;
    const tabs = h('div', { class: 'vxA-tabs' }), left = h('div', { class: 'vxA-box' }), right = h('div', { class: 'vxA-box' });
    const slotV = h('b', { class: 'vxA-nv' });
    const ctl = h('div', { class: 'vxA-tog' }, h('span', { style: { font: '900 .9rem var(--font)' } }, '残り枠'),
      h('button', { class: 'vxA-pm', type: 'button', onclick: () => { st.slots = Math.max(0, st.slots - 1); draw(false); } }, '−'), slotV,
      h('button', { class: 'vxA-pm', type: 'button', onclick: () => { st.slots = Math.min(5, st.slots + 1); draw(false); } }, '＋'),
      h('button', { class: 'vxA-tab', type: 'button', onclick: () => { st.vip = !st.vip; draw(false); } }));
    CH.forEach((c, i) => tabs.append(h('button', { class: 'vxA-tab ' + c.kind + (i === 0 ? ' on' : ''), type: 'button', onclick: () => { cur = i; draw(true); } }, (c.kind === 'x' ? '✖ ' : '') + c.tab)));
    function draw(full) {
      const c = CH[cur];
      [...tabs.children].forEach((b, i) => b.classList.toggle('on', i === cur));
      slotV.textContent = st.slots;
      const vb = ctl.lastChild; vb.textContent = 'VIP：' + (st.vip ? 'あり' : 'なし'); vb.classList.toggle('on', st.vip);
      const pre = mkPre(c.src, c.lang, c.file, c.kind === 'x' ? BAD : OK, false);
      const res = h('div', { class: 'vxA-res' }, ...c.view());
      left.replaceChildren(h('div', { class: 'vxA-tt', style: { color: c.kind === 'x' ? BAD : OK } }, (c.kind === 'x' ? '✖ ' : '✓ ') + c.tab), h('div', { class: 'vxA-code' }, pre));
      right.replaceChildren(h('div', { class: 'vxA-tt' }, '画面（残り枠を変えて試す）'), ctl, res, h('div', { class: 'vxA-why ' + (c.kind === 'x' ? 'bad' : 'ok') }, c.rule));
      const map = {}; Object.keys(c.keys).forEach((k) => { map[k] = [c.keys[k]]; });
      link(right, [pre], map);
      if (full) { bump(res); }
    }
    el.append(h('div', { class: 'vxA' }, tabs, h('div', { class: 'vxA-two' }, left, right)));
    draw(true);
  }

  /* ================= 4. () => 123 の読み方 ================= */
  function scene4(el) {
    const PARTS = (name, args, ret) => ({
      name: ['名前', '#ffb454', name],
      args: ['( )', '#5b9dff', args],
      arrow: ['=>', '#ff6b9d', '「〜を返す」と読む（矢印・アロー）。左が入口、右が出口。'],
      ret: ['戻り値', '#2fd4a4', ret],
    });
    const spec = (tab, nm, a, r, parts) => ({ tab, split: true, lang: 'ts', title: '🔍 部品の名前（カーソルを乗せる）', tokens: [[nm, ['name']], [' = ', []], [a, ['args']], [' => ', ['arrow']], [r, ['ret']]], parts });
    const anat = K.tsAnatBuild(Object.assign(
      spec('() => 123', 'const f', '()', '123', PARTS('関数を入れる変数。f() と呼ぶと中身が動く。', '引数の受け皿。ここでは何も受け取らない。', 'f() を呼ぶと出てくる値。ここでは 123。')),
      { more: [spec('(n) => n * 5500', 'const fee', '(n)', 'n * 5500', PARTS('fee(2) のように呼ぶ。', 'n を 1 つ受け取る。呼ぶときの数字が n に入る。', 'n * 5500。fee(2) なら 11000。'))] }));

    /* 変形（function → => → 式だけ）。vis = 見えている段 */
    const MORPH = {
      a: { tab: '引数なし', say: ['昔の書き方：function と return が要る。', 'function を消して、( ) のあとに => を置く。', '{ return … } を消す。式が 1 つなら、その値がそのまま戻り値。'],
        toks: [['function ', 'kw', [0]], ['()', 'pa', [0, 1, 2]], [' ', '', [0, 1, 2]], ['=> ', 'ar', [1, 2]], ['{ return ', 'kw', [0, 1]], ['123', 'nu', [0, 1, 2]], [' }', '', [0, 1]]],
        read: ['引数なしで、123 を返す関数', '引数なしで、123 を返す', '引数なし ⇒ 123'] },
      b: { tab: '引数あり', say: ['昔の書き方：引数は ( ) の中に。', 'function を消して、=> を置く。', '{ return … } を消す。式がそのまま戻り値。', '引数が 1 つなら ( ) も消せる（Vue では ( ) を付ける人が多い）。'],
        toks: [['function ', 'kw', [0]], ['(', 'pa', [0, 1, 2]], ['n', 'pa', [0, 1, 2, 3]], [')', 'pa', [0, 1, 2]], [' ', '', [0, 1, 2, 3]], ['=> ', 'ar', [1, 2, 3]], ['{ return ', 'kw', [0, 1]], ['n * 5500', 'nu', [0, 1, 2, 3]], [' }', '', [0, 1]]],
        read: ['n を受け取って、n × 5500 を返す関数', 'n を受け取って、n × 5500 を返す', 'n ⇒ n × 5500', 'n ⇒ n × 5500（同じ意味）'] },
    };
    let mk = 'a', step = 0;
    const tabs = h('div', { class: 'vxA-tabs' }), steps = h('div', { class: 'vxA-steps' }), morph = h('div', { class: 'vxA-morph' }), say = h('div', { class: 'vxA-say' }), readEl = h('div', { class: 'vxA-why' });
    Object.keys(MORPH).forEach((k) => tabs.append(h('button', { class: 'vxA-tab' + (k === mk ? ' on' : ''), type: 'button', 'data-m': k, onclick: () => { mk = k; step = 0; build(); } }, MORPH[k].tab)));
    let tkEls = [];
    function build() {
      const M = MORPH[mk];
      [...tabs.children].forEach((b) => b.classList.toggle('on', b.dataset.m === mk));
      tkEls = M.toks.map(([t, cls]) => h('span', { class: 'tk ' + cls }, t));
      morph.replaceChildren(...tkEls);
      steps.replaceChildren(...M.say.map((_, i) => h('button', { class: 'vxA-sb', type: 'button', onclick: () => go(i) }, h('i', String(i + 1)), ['function', '=> にする', 'return を消す', '( ) も消す'][i])));
      go(0, true);
    }
    function go(i, quiet) {
      const M = MORPH[mk]; step = Math.max(0, Math.min(M.say.length - 1, i));
      M.toks.forEach(([, , vis], k) => { const on = vis.includes(step), was = tkEls[k].classList.contains('gone') === false; tkEls[k].classList.toggle('gone', !on); if (on && !was && !quiet) { tkEls[k].classList.remove('new'); void tkEls[k].offsetWidth; tkEls[k].classList.add('new'); } });
      [...steps.children].forEach((b, k) => { b.classList.toggle('on', k === step); b.classList.toggle('past', k < step); });
      say.textContent = M.say[step]; say.className = 'vxA-say' + (step === M.say.length - 1 ? ' ok' : '');
      readEl.innerHTML = '📖 読み方：<b>' + M.read[step] + '</b>';
    }
    /* ミニデモ：数字を入れると、関数の中を通って結果が出る */
    let n = 2, tok = 0;
    const nV = h('b', { class: 'vxA-nv' }), inEl = h('div', { class: 'vxA-io', 'data-k': 'in' }), fnEl = h('div', { class: 'vxA-fnbox', 'data-k': 'fn' }, '(n) => n * 5500'), outEl = h('div', { class: 'vxA-io', 'data-k': 'out' });
    const dpre = mkPre(['const fee = (n: number): number => n * 5500', '', 'fee(2)  // → 11000'], 'ts', 'fee.ts', VUE, false);
    const stage = h('div', { class: 'vxA-stage' },
      h('div', { class: 'vxA-ctl' }, h('div', { class: 'vxA-stp' }, h('span', { class: 'nm' }, 'n'), h('button', { class: 'vxA-pm', type: 'button', onclick: () => chg(-1) }, '−'), nV, h('button', { class: 'vxA-pm', type: 'button', onclick: () => chg(1) }, '＋')), h('small', '相談の回数')),
      h('div', { class: 'vxA-fn' }, inEl, h('span', { class: 'vxA-arw' }, '▶'), fnEl, h('span', { class: 'vxA-arw' }, '▶'), outEl),
      h('small', 'n が入口（引数）から入り、n * 5500 が出口（戻り値）から出る。'));
    const dsay = h('div', { class: 'vxA-why' });
    const run = async () => {
      nV.textContent = n; inEl.textContent = 'n = ' + n; outEl.textContent = yen(n * 5500).replace(' 円', '');
      dsay.innerHTML = '<code>fee(' + n + ')</code> → <b>' + yen(n * 5500) + '</b>';
      dpre.lines[2].innerHTML = '<span style="color:#8892b8">fee(' + n + ')  // → ' + n * 5500 + '</span>';
      const my = ++tok;
      await fly(stage, inEl, fnEl, String(n), '#ffb454'); if (my !== tok) return;
      await fly(stage, fnEl, outEl, String(n * 5500), '#2fd4a4'); if (my === tok) bump(outEl);
    };
    const chg = (d) => { n = Math.max(1, Math.min(9, n + d)); run(); };
    link(stage, [dpre], { in: [['fee(']], fn: [['=>']], out: [['// →']] });
    const left = h('div', { class: 'vxA-box' }, h('div', { class: 'vxA-tt' }, '段階で見る：function → =>'), tabs, morph, steps, say, readEl);
    const right = h('div', { class: 'vxA-box' }, h('div', { class: 'vxA-tt' }, '数字を入れると、関数が値を返す'), stage, h('div', { class: 'vxA-code' }, dpre), dsay);
    el.append(h('div', { class: 'vxA' }, anat, h('div', { class: 'vxA-bar' }, btn('◀ 戻る', () => go(step - 1)), btn('次へ ▶', () => go(step + 1), 'primary'), btn('⟲ 最初から', () => go(0))), h('div', { class: 'vxA-two' }, left, right)));
    build(); run();
  }

  /* ================= 5. Vue で => が出てくる場所 ================= */
  function scene5(el) {
    const mkCard = (o) => {
      const pre = mkPre(o.src, o.lang || 'ts', o.file, o.preview ? '#ffb454' : VUE, true);
      const fx = h('div', { class: 'fx' });
      const card = h('div', { class: 'vxA-ex' + (o.cls ? ' ' + o.cls : '') }, h('div', { class: 'tt' }, o.n + ' ' + o.title, o.preview ? h('span', { class: 'soon' }, '🔒 この先の回で習う') : null), pre, fx, h('div', { class: 'say1', html: o.say }));
      const act = (a) => { o.run(fx, a, card); };
      card.addEventListener('click', (e) => { const t = e.target.closest('[data-act]'); act(t ? t.dataset.act : null); });
      o.draw(fx);
      const map = {}; Object.keys(o.keys).forEach((k) => { map[k] = [o.keys[k]]; });
      link(card, [pre], map, () => [lnOf(pre, o.base)]);
      pre.setHi(lnOf(pre, o.base), 'on');
      card.addEventListener('mouseenter', () => { if (!card.querySelector('.vxA-hot')) pre.setHi(lnOf(pre, o.base), 'on'); });
      return card;
    };
    /* 1 イベント */
    let count = 0;
    const c1 = mkCard({ n: '①', title: 'クリックされたら', file: 'ConsultButton.vue', lang: 'vue',
      src: ['<button @click="() => count++">', '  受付', '</button>', '<p>受付 {{ count }} 件</p>'],
      keys: { btn: ['@click'], num: ['{{ count }}'] }, base: ['@click'],
      say: '<code>() =&gt; count++</code>：押されたら、count を 1 増やす。',
      draw: (fx) => fx.replaceChildren(h('button', { class: 'vb', type: 'button', 'data-k': 'btn', 'data-act': 'go' }, '受付'), h('span', { 'data-k': 'num' }, '受付 ', h('b', { class: 'mono' }, String(count)), ' 件')),
      run: (fx) => { count++; c1.querySelector('.mono').textContent = String(count); bump(fx); } });
    /* 2 配列メソッド */
    const CASES = [{ title: '離婚の相談', done: false }, { title: '相続の相談', done: true }, { title: '労働の相談', done: false }];
    const c2 = mkCard({ n: '②', title: '配列を絞る・変える', file: 'CaseList.vue', lang: 'ts',
      src: ['const open = cases.filter((c) => !c.done)', 'const titles = open.map((c) => c.title)'],
      keys: { all: ['cases.filter'], titles: ['open.map'] }, base: ['filter'],
      say: '<code>(c) =&gt; !c.done</code>：1 件ずつ「c が未完了なら残す」。',
      draw: (fx) => {
        const open = CASES.filter((c) => !c.done);
        fx.replaceChildren(h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap', width: '100%' }, 'data-k': 'all' }, ...CASES.map((c, i) => h('span', { class: 'it' + (c.done ? ' off' : ''), 'data-act': String(i), style: { cursor: 'pointer' } }, c.title))),
          h('div', { 'data-k': 'titles', style: { width: '100%', font: '800 .9rem var(--mono)', color: '#127a5c' } }, '→ [' + open.map((c) => "'" + c.title + "'").join(', ') + ']'));
      },
      run: (fx, a) => { if (a != null) CASES[+a].done = !CASES[+a].done; else CASES[0].done = !CASES[0].done; c2.__redraw(); } });
    c2.__redraw = () => { const fx = c2.querySelector('.fx'); const f = c2; void f; const open = CASES.filter((c) => !c.done); fx.children[0].replaceChildren(...CASES.map((c, i) => h('span', { class: 'it' + (c.done ? ' off' : ''), 'data-act': String(i), style: { cursor: 'pointer' } }, c.title))); fx.children[1].textContent = '→ [' + open.map((c) => "'" + c.title + "'").join(', ') + ']'; bump(fx); };
    /* 3 あとで実行 */
    let saveT = 0;
    const c3 = mkCard({ n: '③', title: 'あとで実行する', file: 'SaveButton.vue', lang: 'ts',
      src: ['const save = (): void => {', '  saved.value = false', '  setTimeout(() => {', '    saved.value = true', '  }, 300)', '}'],
      keys: { st: ['saved.value = false'], later: ['setTimeout', 'saved.value = true', '}, 300)'] }, base: ['setTimeout', '}, 300)'],
      say: '<code>() =&gt; { … }</code>：300ms 後に、この中身を実行して。',
      draw: (fx) => fx.replaceChildren(h('button', { class: 'vb', type: 'button', 'data-act': 'go' }, '保存'), h('span', { 'data-k': 'later', class: 'msg' }, '（押すと 300ms 後に…）')),
      run: (fx) => { const m = fx.querySelector('.msg'); clearTimeout(saveT); m.textContent = '保存中…'; m.setAttribute('data-k', 'st'); saveT = setTimeout(() => { m.textContent = '保存しました ✓'; m.setAttribute('data-k', 'later'); bump(fx); }, 300); } });
    /* 4 この先の回で習う */
    const c4 = mkCard({ n: '④', title: '見かけるけれど、まだ先', file: 'preview.ts', lang: 'ts', preview: true,
      src: ['watch(() => state.q, search)', 'const total = computed(() => a.value + b.value)', 'onMounted(() => load())'],
      keys: { w: ['watch('], cm: ['computed('], om: ['onMounted('] }, base: [],
      say: '今は「<code>() =&gt;</code> がまた出てきた」と読めれば十分。',
      draw: (fx) => fx.replaceChildren(h('div', { class: 'pv' },
        h('div', { 'data-k': 'w' }, h('b', 'watch'), '値が変わったら実行'), h('div', { 'data-k': 'cm' }, h('b', 'computed'), '計算結果を返す'), h('div', { 'data-k': 'om' }, h('b', 'onMounted'), '画面が出た直後に実行'))),
      run: (fx) => bump(fx) });
    /* 5 関数を返す（工場） */
    const mkCounter = () => { let n = 0; return () => ++n; };
    const winA = mkCounter(), winB = mkCounter();
    const c5 = mkCard({ n: '⑤', title: '関数を返す（番号札マシン）', file: 'ticket.ts', lang: 'ts', cls: 'span2',
      src: ['const makeCounter = () => {', '  let n = 0', '  return () => ++n', '}', '', 'const windowA = makeCounter()', 'const windowB = makeCounter()'],
      keys: { mk: ['const makeCounter', 'let n = 0', 'return () => ++n'], a: ['windowA'], b: ['windowB'] }, base: ['return () => ++n'],
      say: '<code>return () =&gt; …</code>：関数が関数を返す。返された関数は、<b>自分専用の n</b> を覚えている。',
      draw: (fx) => fx.replaceChildren(h('button', { class: 'vb', type: 'button', 'data-k': 'a', 'data-act': 'a' }, '窓口A：番号札'), h('b', { class: 'mono ta', 'data-k': 'a' }, '-'), h('button', { class: 'vb', type: 'button', 'data-k': 'b', 'data-act': 'b' }, '窓口B：番号札'), h('b', { class: 'mono tb', 'data-k': 'b' }, '-')),
      run: (fx, a) => { const w = a === 'b' ? 'b' : 'a'; const v = (w === 'a' ? winA : winB)(); const t = fx.querySelector('.t' + w); t.textContent = v + ' 番'; bump(t); } });
    el.append(h('div', { class: 'vxA' }, h('div', { class: 'vxA-say' }, '🖱 カードにカーソル → コードの行が光る。押す → その場で動く。'), h('div', { class: 'vxA-grid' }, c1, c2, c3, c4, c5)));
  }

  /* ================= 6. よくある落とし穴 ================= */
  const runJS = (body, args) => { try { return { v: new Function(...Object.keys(args || {}), body)(...Object.values(args || {})) }; } catch (e) { return { err: e }; } };
  const show = (v) => (v === undefined ? 'undefined' : typeof v === 'string' ? JSON.stringify(v) : JSON.stringify(v));
  function scene6(el) {
    const P = [
      { tab: '{ } に return が無い', say: '{ } を付けたら、return も付ける。式 1 つなら { } ごと消す。',
        bad: ['const fee = () => { 5500 }', 'fee()'], good: ['const fee = () => 5500', 'fee()'],
        run: (src) => runJS(src.replace(/\nfee\(\)$/, '') + '\nreturn fee()'), fmt: (r) => [['fee()  →  ' + show(r.v), r.v === undefined ? 'e' : 'g'], r.v === undefined ? ['{ } の中は「文」。値を返していない', 'mute'] : ['式がそのまま戻り値', 'mute']] },
      { tab: 'オブジェクトを返す', say: 'オブジェクトを返すなら、( ) で包む。包まないと { } は「ブロック」になる。',
        bad: ['const makeCase = () => { id: 1 }', 'makeCase()'], good: ['const makeCase = () => ({ id: 1 })', 'makeCase()'],
        run: (src) => runJS(src.replace(/\nmakeCase\(\)$/, '') + '\nreturn makeCase()'), fmt: (r) => [['makeCase()  →  ' + show(r.v), r.v === undefined ? 'e' : 'g'], r.v === undefined ? ['id: は「ラベル」扱い。オブジェクトにならない', 'mute'] : ['( ) で包んだので、オブジェクトが返る', 'mute']] },
      { tab: '? に : が無い', say: '? には、必ず : がセット。「そうでなければ」を省略できない。',
        bad: ["const label = slots === 0 ? '満席'"], good: ["const label = slots === 0 ? '満席' : '受付中'"],
        run: (src) => runJS('const slots = 3\n' + src.trim() + ';\nreturn label'), fmt: (r) => r.err ? [['SyntaxError：' + r.err.message, 'e'], ['Vue のテンプレートでも、コンパイルエラーになる', 'mute']] : [['label  →  ' + show(r.v), 'g'], ['slots が 3 なので「そうでなければ」側', 'mute']] },
      { tab: '関数を呼んでしまう', say: 'あとで実行したいなら「関数」を渡す。save() と書くと、今すぐ呼んだ結果を渡してしまう。',
        bad: ['setTimeout(save(), 300)'], good: ['setTimeout(() => save(), 300)'], timed: true },
    ];
    let cur = 0, tok = 0;
    const tabs = h('div', { class: 'vxA-tabs' }), say = h('div', { class: 'vxA-why' }), grid = h('div', { class: 'vxA-pit' });
    P.forEach((p, i) => tabs.append(h('button', { class: 'vxA-tab', type: 'button', onclick: () => { cur = i; draw(); } }, p.tab)));
    const outBox = (k) => h('div', { class: 'vxA-out', 'data-k': k }, h('span', { class: 'mute' }, '▶ 実行を押すと、結果が出る'));
    const put = (box, rows) => { box.replaceChildren(...rows.map(([t, c]) => h('div', { class: c || '' }, t))); bump(box); };
    function draw() {
      const p = P[cur]; tok++;
      [...tabs.children].forEach((b, i) => b.classList.toggle('on', i === cur));
      const preB = mkPre(p.bad, 'ts', '✖ ' + p.tab, BAD, false), preG = mkPre(p.good, 'ts', '✓ 直した', OK, false);
      const oB = outBox('bad'), oG = outBox('good');
      const sideB = h('div', { class: 'vxA-side no' }, h('div', { class: 'vxA-tt' }, '✖ こう書くと'), preB, oB), sideG = h('div', { class: 'vxA-side yes' }, h('div', { class: 'vxA-tt' }, '✓ こう直す'), preG, oG);
      grid.replaceChildren(sideB, sideG);
      say.textContent = p.say; say.className = 'vxA-why';
      link(grid, [preB, preG], { bad: [[p.bad[0]], []], good: [[], [p.good[0]]] });
      const exec = () => {
        const my = ++tok;
        if (p.timed) {
          const log = (box, t0, t, c) => { if (my !== tok) return; box.append(h('div', { class: c || '' }, '[' + String(Date.now() - t0).padStart(3, ' ') + 'ms] ' + t)); };
          /* 本物の setTimeout で動かす（関数でないものが渡されたときは、何も予約しない） */
          const trial = (box, src) => {
            box.replaceChildren(); const t0 = Date.now();
            const save = () => { log(box, t0, '保存した', 'g'); };
            const later = (fn, wait) => { if (typeof fn === 'function') window.setTimeout(fn, wait); else { log(box, t0, 'あとで実行するものが無い（渡ったのは ' + String(fn) + '）', 'e'); window.setTimeout(() => log(box, t0, '300ms 後：何も起きない', 'mute'), wait + 30); } };
            new Function('save', 'setTimeout', src)(save, later);
          };
          trial(oB, p.bad.join('\n')); trial(oG, p.good.join('\n'));
          return;
        }
        const rb = p.run(p.bad.join('\n')), rg = p.run(p.good.join('\n'));
        put(oB, p.fmt(rb)); put(oG, p.fmt(rg));
      };
      const bar = h('div', { class: 'vxA-bar' }, btn('▶ 実行して比べる', exec, 'primary'), say);
      wrap.replaceChildren(tabs, bar, grid);
    }
    const wrap = h('div', { class: 'vxA' });
    el.append(wrap);
    draw();
  }

  reg({
    id: 'x-vue-arrow', title: '三項演算子と矢印関数', sub: '? : と => の読み方', emoji: '➡️',
    meta: { cat: 'vue', day: '4日目', when: 'JS の基本・データを変えるだけ のあと。{{ a ? b : c }} や () => が読めないとき', mins: 15, order: 28, level: '基礎', after: 'vue-basics', why: 'テンプレートでも script でも毎日出てくるのに、1行で書くので読みにくい' },
    scenes: [
      { t: 'a > b ? 1 : 2 の読み方', tag: 'TERNARY', lead: '<b>a &gt; b ? 1 : 2</b> は、<b>条件</b>で 2 つの値のどちらかを選ぶ 1 行。', render: scene1 },
      { t: 'if 文だと、こんなに長い', tag: 'IF vs ? :', lead: '<b>三項演算子</b>は、if / else を<b>1 行の式</b>にしたもの。', render: scene2 },
      { t: 'テンプレートでの使いどころ', tag: 'IN TEMPLATE', lead: '<b>短い値の切替</b>は三項、<b>ブロックごと</b>の切替は v-if。', render: scene3 },
      { t: '() => 123 の読み方', tag: 'ARROW FUNCTION', lead: '<b>=&gt;</b> は「<b>〜を返す</b>」と読む、関数の短い書き方。', render: scene4 },
      { t: 'Vue で => が出てくる場所', tag: 'WHERE', lead: '<b>あとで呼ぶ関数</b>を渡す場面で、<b>=&gt;</b> が出てくる。', render: scene5 },
      { t: 'よくある落とし穴', tag: 'PITFALLS', lead: '<b>{ } には return</b>、<b>? には :</b>。この 2 つで、つまずきの大半を防げる。', render: scene6 },
    ],
  });
})();
