/* 補足 Vue：ref と .value のひみつ（x-vue-ref）
   1) ふつうの変数だと、なぜダメ？（K.vs.versus）  2) ref の正体（RefImpl を1段ずつ作る）  3) なぜ .value？（門と虫眼鏡 + makeRef）
   4) template で .value が要らない理由 + つまずき3つ  5) 使いこなす目安 */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.W || !K.vs) return;
  const { h, code, style } = K.W;
  const reg = (o) => K.reg(Object.assign({ track: 'extra' }, o));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const COLS = ['#ff6b9d', '#5b9dff', '#ffb454', '#2fd4a4', '#a98bff', '#ff8a5b'];
  const BAD = 'var(--bad)', OK = 'var(--ok)', VUE = 'var(--vue)';

  style('vxF', `
  .vxF{display:grid;gap:14px;min-width:0}
  .vxF-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:stretch}
  .vxF-bar .btn{height:44px;padding:0 1.2em}
  .vxF-say{flex:1;min-width:240px;display:flex;align-items:center;min-height:44px;padding:6px 16px;border-radius:12px;border:2px solid var(--line);background:var(--card);font:800 1rem/1.55 var(--font);transition:.25s}
  .vxF-say.bad{border-color:var(--bad);color:var(--bad)}.vxF-say.ok{border-color:var(--ok)}
  .vxF-steps{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
  @media(max-width:900px){.vxF-steps{grid-template-columns:repeat(2,minmax(0,1fr))}}
  .vxF-sb{all:unset;cursor:pointer;box-sizing:border-box;padding:8px 10px;border:2px solid var(--line);border-radius:12px;background:var(--card);display:flex;gap:8px;align-items:center;font:800 .88rem/1.35 var(--font);min-width:0;transition:.2s}
  .vxF-sb i{font-style:normal;flex:none;width:1.7em;height:1.7em;border-radius:50%;display:grid;place-items:center;background:var(--line);font:900 .8rem var(--font)}
  .vxF-sb.past{border-color:color-mix(in srgb,var(--ok) 55%,var(--line))}.vxF-sb.past i{background:var(--ok);color:#06101f}
  .vxF-sb.on{border-color:var(--vue);background:color-mix(in srgb,var(--vue) 16%,var(--card));transform:translateY(-2px)}.vxF-sb.on i{background:var(--vue);color:#06101f}
  .vxF-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:stretch}
  @media(max-width:980px){.vxF-two{grid-template-columns:1fr}}
  .vxF-box{border:2px solid var(--line);border-radius:14px;background:var(--card);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}
  .vxF-box.no{border-color:color-mix(in srgb,var(--bad) 55%,var(--line))}.vxF-box.yes{border-color:color-mix(in srgb,var(--ok) 55%,var(--line))}
  .vxF-tt{font:900 1rem var(--font);display:flex;align-items:center;gap:8px}
  .vxF-box.no>.vxF-tt{color:var(--bad)}.vxF-box.yes>.vxF-tt{color:var(--ok)}
  .vxF-stage{position:relative;border-radius:12px;background:#f4f6fb;color:#1f2a44;padding:16px;min-width:0;flex:1;display:flex;flex-direction:column;gap:12px;justify-content:center}
  .vxF-stage small{font:800 .8rem var(--font);color:#5b6788}
  .vxF-code{min-width:0;display:flex;flex-direction:column}.vxF-code>pre.code{flex:1;margin:0;font-size:.92rem}
  .vxF-code pre.code .ln.err{background:color-mix(in srgb,var(--bad) 22%,transparent);box-shadow:inset 3px 0 var(--bad)}
  .vxF-pkt{position:absolute;left:0;top:0;z-index:9;padding:.2em .85em;border-radius:99px;color:#06101f;font:900 .85rem var(--mono);box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap}
  .vxF-bump{animation:vxFb .7s}@keyframes vxFb{30%{transform:scale(1.07);box-shadow:0 0 0 6px color-mix(in srgb,var(--ok) 45%,transparent)}}
  .vxF [data-k]{cursor:default;border-radius:10px}
  .vxF .btn[disabled]{opacity:.45;pointer-events:none}
  /* 共通の小さな部品 */
  .vxF-var{display:grid;gap:2px;padding:.55em .9em;border-radius:12px;border:2px solid #b9c4e2;background:#fff;width:fit-content;min-width:120px}
  .vxF-var b{font:900 1.05rem var(--mono)}
  .vxF-n{font:900 1.5rem var(--mono);color:#2f6df0}
  .vxF-eye{font:800 .9rem/1.5 var(--font);padding:.45em .8em;border-radius:10px;background:#fff;border:1px dashed #b9c4e2;min-height:2.6em;display:flex;align-items:center}
  .vxF-eye.bad{color:#c2253a;border-color:#e58a96;background:#fff1f3}.vxF-eye.ok{color:#127a5c;border-color:#5fcfae;background:#ecfbf5}
  .vxF-scr{border:2px solid #cfd4e2;border-radius:12px;background:#fff;overflow:hidden;transition:.3s}
  .vxF-scr>div:first-child{background:#1d2b53;color:#fff;font:900 .85rem var(--font);padding:5px 12px}
  .vxF-scr>div:last-child{padding:10px 14px;font:800 1rem var(--font)}
  .vxF-scr b{font:900 1.2rem var(--mono);color:#2f6df0}
  .vxF-btn{all:unset;cursor:pointer;padding:.4em 1.1em;border-radius:99px;background:linear-gradient(135deg,#ffb454,#ff8a5b);color:#06101f;font:900 .9rem var(--font);box-shadow:0 4px 12px -4px #ff8a5b;width:fit-content}
  .vxF-btn:hover{transform:translateY(-1px)}
  /* シーン2：RefImpl の図 */
  .vxF-sg{display:grid;grid-template-columns:120px minmax(0,1fr);grid-template-rows:auto auto;column-gap:40px;row-gap:14px;align-items:start}
  @media(max-width:560px){.vxF-sg{grid-template-columns:110px minmax(0,1fr);column-gap:30px}}
  .vxF-lc{display:grid;gap:10px;justify-items:start}
  .vxF-seed{padding:.2em .9em;border-radius:99px;border:2px solid #b9c4e2;background:#fff;font:900 .95rem var(--mono);transition:.4s}
  .vxF-slot{position:relative}
  .vxF-ghost{position:absolute;inset:0;border:2px dashed #aab4d4;border-radius:14px;display:grid;place-items:center;text-align:center;padding:8px;color:#7b86aa;font:800 .9rem/1.5 var(--font);transition:.3s}
  .vxF-card{border:3px solid #2f6df0;border-radius:14px;background:#fff;padding:10px 12px;display:grid;gap:7px;opacity:0;transform:scale(.9);transition:.4s}
  .st-card .vxF-card{opacity:1;transform:none}.st-card .vxF-ghost{opacity:0}
  .vxF-card .hd{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap}.vxF-card .hd b{font:900 1.05rem var(--mono);color:#2f6df0}
  .vxF-card .rw{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:.3em .55em;border-radius:8px;background:#f1f4fb;border:1px solid #dde3f3;font:800 .88rem var(--mono);min-height:2.3em}
  .vxF-card .rw em{font-style:normal;color:#5b6788;min-width:5em}
  .vxF-card .rw .v{font:900 1.15rem var(--mono);color:#127a5c}
  .vxF-gs{padding:.2em .7em;border-radius:99px;border:2px solid #9aa8d8;background:#fff;font:900 .85rem var(--mono)}
  .vxF-eff{padding:.15em .7em;border-radius:99px;background:#ffb454;color:#06101f;font:900 .85rem var(--font)}
  @keyframes vxFp{from{transform:scale(.4);opacity:0}}
  .vxF-arr{position:absolute;left:-40px;top:30px;width:40px;height:4px;background:var(--vue);border-radius:2px;opacity:0;transition:.4s}
  .vxF-arr::after{content:'';position:absolute;right:-2px;top:-6px;border:8px solid transparent;border-left:12px solid var(--vue);border-right:0}
  .st-arrow .vxF-arr{opacity:1}
  .vxF-sg .vxF-scr{grid-column:2;opacity:.28;transition:.4s}.st-screen .vxF-sg .vxF-scr{opacity:1}
  .st-seed-off .vxF-seed{opacity:0}
  .vxF-parts{display:flex;flex-direction:column;gap:8px}
  .vxF-pt{flex:1;display:grid;grid-template-columns:1fr;gap:4px;align-content:center;padding:8px 14px;border:2px solid var(--line);border-radius:12px;background:var(--card)}
  .vxF-pt b{font:900 1.05rem var(--mono);color:var(--c)}.vxF-pt span{font:700 .9rem/1.5 var(--font)}
  .vxF-note{font:800 .85rem/1.5 var(--font);color:var(--mute);padding:6px 4px 0}
  /* シーン3 */
  .vxF-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
  .vxF-lens{display:flex;gap:8px;align-items:center;padding:.3em .8em;border-radius:99px;background:#fff;border:2px solid #b9c4e2;font:900 .9rem var(--font);width:fit-content}
  .vxF-lens.shake{animation:vxFs .5s}@keyframes vxFs{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
  .vxF-gate{padding:.5em .9em;border-radius:10px;border:3px dashed #9aa8d8;background:#fff;font:900 .9rem/1.4 var(--font);text-align:center;transition:.3s}
  .vxF-gate.on{border-style:solid;border-color:#2fd4a4;background:#e9fbf4}
  .vxF-obj{padding:.55em .9em;border-radius:12px;border:3px solid #2f6df0;background:#fff;font:900 1.05rem var(--mono);width:fit-content}
  .vxF-obj b{color:#127a5c}
  .vxF-flowr{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
  .vxF-demo{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:14px;align-items:stretch}
  @media(max-width:980px){.vxF-demo{grid-template-columns:1fr}}
  .vxF-log{background:#0b1020;color:#cfe;border-radius:10px;padding:10px 12px;font:700 .9rem/1.7 var(--mono);min-height:130px;flex:1}
  .vxF-log div{}.vxF-log .mute{color:#8892b8}
  .vxF-chips{display:flex;gap:8px;flex-wrap:wrap}
  .vxF-chip{padding:.3em .8em;border-radius:99px;border:2px solid var(--line);background:var(--card2);font:800 .88rem var(--mono)}
  /* シーン4・5 */
  .vxF-flow4{display:grid;gap:10px;align-content:center;flex:1}
  .vxF-mid{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
  .vxF-un{padding:.35em .9em;border-radius:99px;border:2px dashed #2fd4a4;color:#127a5c;background:#e9fbf4;font:900 .88rem var(--font)}
  .vxF-tabs{display:flex;gap:8px;flex-wrap:wrap}
  .vxF-tab{all:unset;cursor:pointer;padding:.45em 1em;border-radius:99px;border:2px solid var(--line);background:var(--card2);font:800 .9rem var(--font);transition:.2s}
  .vxF-tab:hover{border-color:var(--vue)}.vxF-tab.on{background:var(--vue);border-color:var(--vue);color:#06101f}
  .vxF-vs{display:grid;grid-template-columns:1fr;gap:10px}
  .vxF-vs pre.code{margin:0;font-size:.9rem}
  .vxF-vs .lb{font:900 .9rem var(--font);margin-bottom:4px}.vxF-vs .lb.x{color:var(--bad)}.vxF-vs .lb.o{color:var(--ok)}
  .vxF-why{font:800 .95rem/1.6 var(--font);padding:.5em .9em;border-radius:10px;background:color-mix(in srgb,var(--team) 12%,var(--card));border-left:5px solid var(--team)}
  .vxF-rule{display:flex;gap:12px;flex-wrap:wrap;align-items:stretch}
  .vxF-rule>div{flex:1;min-width:220px;padding:.7em 1em;border-radius:12px;border:2px solid var(--c);background:color-mix(in srgb,var(--c) 12%,var(--card));font:900 1rem/1.5 var(--font)}
  .vxF-rule code{font:800 .95rem var(--mono)}
  .vxF-dec{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.5fr);gap:14px;align-items:stretch}
  @media(max-width:900px){.vxF-dec{grid-template-columns:1fr}}
  .vxF-pick{display:flex;flex-direction:column;gap:8px}
  .vxF-pick .vxF-tab{flex:1;display:flex;align-items:center;border-radius:12px;padding:.5em 1em}
  .vxF-out{display:flex;flex-direction:column;gap:8px;min-width:0}
  .vxF-out .r{display:grid;grid-template-columns:5.6em minmax(0,1fr);gap:10px;align-items:center;flex:1}
  .vxF-out .r>small{font:900 .88rem var(--font);color:var(--mute)}
  .vxF-out pre.code{margin:0;font-size:.92rem}
  .vxF-three{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;align-items:stretch}
  @media(max-width:1100px){.vxF-three{grid-template-columns:1fr}}
  .vxF-ex{border:2px solid var(--line);border-radius:14px;background:var(--card);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}
  .vxF-ex .tt{font:900 1rem var(--font);display:flex;gap:8px;align-items:center;flex-wrap:wrap}.vxF-ex .tt code{font:800 .85rem var(--mono);color:var(--vue)}
  .vxF-ex pre.code{margin:0;font-size:.82rem;flex:1}
  .vxF-ex .res{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:.5em .7em;border-radius:10px;background:#f4f6fb;color:#1f2a44;font:800 .9rem var(--mono);min-height:3em}
  .vxF-ex .res .it{padding:.1em .6em;border-radius:99px;background:#2f6df0;color:#fff;font:800 .85rem var(--font)}
  `);

  /* ---------- 共通の道具 ---------- */
  const lnOf = (pre, toks) => { const o = []; pre.lines.forEach((l, i) => { if ((toks || []).some((t) => l.textContent.includes(t))) o.push(i + 1); }); return o; };
  const bump = (el) => { if (!el) return; el.classList.remove('vxF-bump'); void el.offsetWidth; el.classList.add('vxF-bump'); };
  async function fly(host, from, to, text, col) {
    if (!from || !to || !host.isConnected) return;
    const hr = host.getBoundingClientRect(), a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    const el = h('span', { class: 'vxF-pkt', style: { background: col || '#2fd4a4' } }, text); host.append(el);
    const w = el.offsetWidth, hh = el.offsetHeight, pt = (r) => ({ x: r.left - hr.left + r.width / 2 - w / 2, y: r.top - hr.top + r.height / 2 - hh / 2 });
    const A = pt(a), B = pt(b);
    try { await el.animate([{ transform: `translate(${A.x}px,${A.y}px) scale(.6)`, opacity: 0 }, { transform: `translate(${A.x}px,${A.y}px)`, opacity: 1, offset: .15 }, { transform: `translate(${B.x}px,${B.y}px)`, opacity: 1, offset: .85 }, { transform: `translate(${B.x}px,${B.y}px) scale(.6)`, opacity: 0 }], { duration: 900, easing: 'ease-in-out' }).finished; } catch (e) { /* 途中で消えてもよい */ }
    el.remove();
  }
  /* root 内の [data-k] 部品 ⇄ 複数のコード（pres）の行。map = { key: [pre0 のトークン, pre1 のトークン…] } */
  function link(root, pres, map, rest) {
    const keys = Object.keys(map);
    const set = (k) => pres.forEach((pre, pi) => pre.setHi(k ? lnOf(pre, (map[k] || [])[pi]) : ((rest ? rest() : [])[pi] || []), 'on'));
    const on = (k) => { set(k); root.querySelectorAll('[data-k]').forEach((n) => n.classList.toggle('vs-hot', n.getAttribute('data-k') === k)); };
    const off = () => { set(null); root.querySelectorAll('.vs-hot').forEach((n) => n.classList.remove('vs-hot')); };
    keys.forEach((k, i) => root.querySelectorAll('[data-k="' + k + '"]').forEach((n) => { if (n.__vxl) return; n.__vxl = 1; n.style.setProperty('--c', COLS[i % COLS.length]); n.addEventListener('mouseenter', () => on(k)); n.addEventListener('mouseleave', off); }));
    pres.forEach((pre, pi) => pre.lines.forEach((ln) => {
      ln.addEventListener('mouseenter', () => { const k = keys.find((kk) => ((map[kk] || [])[pi] || []).some((t) => ln.textContent.includes(t))); if (k) on(k); });
      ln.addEventListener('mouseleave', off);
    }));
    if (rest) set(null);
  }
  const mkPre = (lines, lang, file, color) => code(lines.join('\n'), lang, { color: color || VUE, file, dim: true, edit: false });
  const btn = (label, onclick, cls) => h('button', { class: 'btn' + (cls ? ' ' + cls : ''), style: cls === 'primary' ? { '--c': VUE } : {}, onclick }, label);

  /* ================= 1. ふつうの変数だと、なぜダメ？ ================= */
  const S1_NO = [
    '<script setup lang="ts">',
    'let count: number = 0',
    '',
    'const addCase = (): void => {',
    '  count++',
    '}',
    '</script>',
    '',
    '<template>',
    '  <p>本日の相談 {{ count }} 件</p>',
    '  <button @click="addCase">受付</button>',
    '</template>',
  ].join('\n');
  const S1_YES = [
    '<script setup lang="ts">',
    "import { ref } from 'vue'",
    '',
    'const count = ref<number>(0)',
    '',
    'const addCase = (): void => {',
    '  count.value++',
    '}',
    '</script>',
    '',
    '<template>',
    '  <p>本日の相談 {{ count }} 件</p>',
    '  <button @click="addCase">受付</button>',
    '</template>',
  ].join('\n');

  const s1UI = (yes) => (ctx) => {
    let n = 0, shown = 0, busy = false;
    const vNum = h('span', { class: 'vxF-n' }, '0'), sNum = h('b', '0');
    const varBox = h('div', { class: 'vxF-var', 'data-k': 'var' }, h('small', yes ? 'ref の箱（count）' : '変数 count'), h('div', yes ? 'value: ' : '= ', vNum));
    const scr = h('div', { class: 'vxF-scr', 'data-k': 'screen' }, h('div', 'ブラウザの画面'), h('div', '本日の相談 ', sNum, ' 件'));
    const eye = h('div', { class: 'vxF-eye', 'data-k': 'change' }, '👀 Vue：見張り中…');
    const press = async () => {
      if (busy) return; busy = true; n++;
      await ctx.fly(b, varBox, yes ? 'count.value++' : 'count++', '#ffb454');
      vNum.textContent = String(n); ctx.bump(varBox);
      if (yes) {
        eye.className = 'vxF-eye ok'; eye.textContent = '👀 Vue：変わったと気づいた！';
        await ctx.fly(varBox, scr, '再描画', '#2fd4a4');
        shown = n; sNum.textContent = String(n); ctx.bump(scr);
        ctx.banner('画面も ' + n + ' 件になった ✓', 'ok');
      } else {
        eye.className = 'vxF-eye bad'; eye.textContent = '👀 Vue：…何も知らされていない';
        ctx.banner('count は ' + n + ' なのに、画面は ' + shown + ' 件のまま…', 'bad');
      }
      busy = false;
    };
    const b = h('button', { class: 'vxF-btn', 'data-k': 'btn', onclick: press }, '受付');
    return { el: h('div', { style: { display: 'grid', gap: '10px' } }, varBox, scr, eye, b), press, reset() { n = 0; shown = 0; busy = false; vNum.textContent = '0'; sNum.textContent = '0'; eye.className = 'vxF-eye'; eye.textContent = '👀 Vue：見張り中…'; } };
  };

  reg({
    id: 'x-vue-ref', title: 'ref と .value のひみつ', sub: 'なぜ .value？ ref の中身は？', emoji: '🧩',
    meta: { cat: 'vue', day: '4日目', when: 'ref を学んだ直後。「なぜ .value を付けるの？」と思ったとき', mins: 15, order: 29, level: '応用', after: 'vue-basics', why: '.value の付け忘れは、初心者がいちばんハマるバグ。仕組みを知れば、書き方の理由が一度で分かる' },
    scenes: [
      {
        t: 'ふつうの変数だと、なぜダメ？', tag: 'WHY REF',
        lead: '変数を変えても、<b>Vue は気づけない</b>。だから画面が変わらない。',
        render(el) {
          el.append(K.vs.versus({
            banner: '変数を変えたのに、画面が変わらない…。',
            bar: [
              { label: '▶ 「受付」を押す（両方）', primary: true, onclick: (ctx) => { Promise.all([ctx.ui.without.press(), ctx.ui.with.press()]).then(() => ctx.banner('左：count は増えたのに画面は 0 のまま ✖　右：画面も増えた ✓', 'warn')); } },
              { label: '⟲ 最初から', onclick: (ctx) => ctx.reset() },
            ],
            without: { title: 'ふつうの変数（let）', file: 'CaseCounter.vue', lang: 'vue', src: S1_NO, ui: s1UI(false), keys: { var: ['let count'], change: ['count++'], screen: ['{{ count }}'], btn: ['@click'] } },
            with: { title: 'ref を使う', file: 'CaseCounter.vue', lang: 'vue', src: S1_YES, ui: s1UI(true), keys: { var: ['ref<number>'], change: ['count.value++'], screen: ['{{ count }}'], btn: ['@click'] } },
          }));
        },
      },
      { t: 'ref を書くと、何ができる？', tag: 'REF OBJECT', lead: '<b>ref(0)</b> は、0 を<b>オブジェクトの箱</b>に入れて返す。', render: scene2 },
      { t: 'なぜ .value が必要？', tag: 'GETTER / SETTER', lead: '変数の書き換えは見えない。<b>オブジェクトの出入口（.value）</b>なら、Vue が見張れる。', render: scene3 },
      { t: 'template では .value が要らないのはなぜ？', tag: 'AUTO UNWRAP', lead: 'script は <b>.value</b>、template は<b>自動で外してくれる</b>。つまずきも3つ。', render: scene4 },
      { t: 'ref を使いこなす目安', tag: 'RULE OF THUMB', lead: '迷ったら <b>ref</b>。script では <b>.value</b>、template では不要。', render: scene5 },
    ],
  });

  /* ================= 2. ref の正体 ================= */
  function scene2(el) {
    const U = [
      '<script setup lang="ts">',
      "import { ref } from 'vue'",
      '',
      'const count = ref<number>(0)',
      '',
      'const addCase = (): void => {',
      '  count.value++',
      '}',
      '</script>',
      '',
      '<template>',
      '  <p>本日の相談 {{ count }} 件</p>',
      '</template>',
    ];
    const I = [
      'class RefImpl<T> {',
      '  private _value: T',
      '  private _rawValue: T',
      '  public dep?: Dep',
      '  public readonly __v_isRef = true',
      '',
      '  constructor(value: T) {',
      '    this._rawValue = toRaw(value)',
      '    this._value = toReactive(value)',
      '  }',
      '  get value(): T {',
      '    trackRefValue(this)',
      '    return this._value',
      '  }',
      '  set value(newVal: T) {',
      '    if (hasChanged(newVal, this._rawValue)) {',
      '      this._rawValue = toRaw(newVal)',
      '      this._value = toReactive(newVal)',
      '      triggerRefValue(this)',
      '    }',
      '  }',
      '}',
      '',
      'function ref<T>(value: T) {',
      '  return new RefImpl(value)',
      '}',
    ];
    const preU = mkPre(U, 'vue', 'CaseCounter.vue（あなたが書く）'), preI = mkPre(I, 'ts', 'RefImpl（Vue の中身・かんたん版）', 'var(--ts)');
    const STEPS = [
      { n: '書く', say: 'この1行で、<b>箱を作る → count が箱を指す</b>、の2つが起きる。', u: ['const count'], i: ['function ref', 'return new RefImpl'] },
      { n: '箱ができる', say: '<b>ref(0)</b> は 0 を<b>オブジェクト（RefImpl）</b>に包む。', u: ['const count'], i: ['constructor', 'this._rawValue = toRaw(value)', 'this._value = toReactive(value)'] },
      { n: '変数が指す', say: '<b>count</b> は数字ではなく、<b>箱を指す矢印</b>。', u: ['const count'], i: ['return new RefImpl'] },
      { n: '読む＝track', say: '読むと <b>getter</b> が「だれが読んだか」を <b>dep</b> に記録する（track）。', u: ['{{ count }}'], i: ['get value()', 'trackRefValue'] },
      { n: '書く＝trigger', say: '書くと <b>setter</b> が dep の全員に通知（trigger）→ 画面が描き直される。', u: ['count.value++'], i: ['set value(', 'hasChanged', 'triggerRefValue'] },
    ];
    const F = [
      { card: 0, arrow: 0, screen: 0, dep: 0, val: 0, seed: 1 }, { card: 1, arrow: 0, screen: 0, dep: 0, val: 0, seed: 0 },
      { card: 1, arrow: 1, screen: 0, dep: 0, val: 0, seed: 0 }, { card: 1, arrow: 1, screen: 1, dep: 1, val: 0, seed: 0 }, { card: 1, arrow: 1, screen: 1, dep: 1, val: 1, seed: 0 },
    ];
    const seed = h('div', { class: 'vxF-seed' }, 'ふつうの 0');
    const varBox = h('div', { class: 'vxF-var', 'data-k': 'var' }, h('b', 'count'), h('small', '変数'));
    const valEl = h('span', { class: 'v' }, '0'), depList = h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } });
    const getC = h('span', { class: 'vxF-gs', 'data-k': 'get' }, 'get value()'), setC = h('span', { class: 'vxF-gs', 'data-k': 'set' }, 'set value()');
    const card = h('div', { class: 'vxF-card' },
      h('div', { class: 'hd' }, h('b', 'RefImpl'), h('small', '（ref の正体）')),
      h('div', { class: 'rw', 'data-k': 'isref' }, h('em', '__v_isRef'), 'true'),
      h('div', { class: 'rw', 'data-k': 'value' }, h('em', '_value'), valEl),
      h('div', { class: 'rw' }, h('em', 'value'), getC, setC),
      h('div', { class: 'rw', 'data-k': 'dep' }, h('em', 'dep'), depList));
    const ghost = h('div', { class: 'vxF-ghost' }, 'ここに ref(0) の結果ができる');
    const slot = h('div', { class: 'vxF-slot' }, ghost, card, h('div', { class: 'vxF-arr' }));
    const scrNum = h('b', '0');
    const scr = h('div', { class: 'vxF-scr', 'data-k': 'screen' }, h('div', '画面（render 関数）'), h('div', '本日の相談 ', scrNum, ' 件'));
    const stage = h('div', { class: 'vxF-stage' }, h('div', { class: 'vxF-sg' }, h('div', { class: 'vxF-lc' }, varBox, seed), slot, h('span'), scr));
    const effChip = () => h('span', { class: 'vxF-eff' }, '画面の描画');
    const apply = (s) => {
      ['card', 'arrow', 'screen', 'seed'].forEach((k) => stage.classList.toggle(k === 'seed' ? 'st-seed-off' : 'st-' + k, k === 'seed' ? !s.seed : !!s[k]));
      valEl.textContent = String(s.val); scrNum.textContent = String(s.val);
      depList.replaceChildren(...(s.dep ? [effChip()] : [h('small', { style: { color: '#7b86aa' } }, '（まだ空）')]));
    };
    const parts = [
      ['value', '_value', '入れた値そのもの。配列・オブジェクトなら reactive（Proxy）で包む'],
      ['get', 'get value()', '読まれたとき、読んだ人を dep に記録する（track）'],
      ['set', 'set value()', '書き換えられたとき、dep の全員に知らせる（trigger）'],
      ['dep', 'dep', '知らせる相手のリスト（画面の描画など）'],
      ['isref', '__v_isRef: true', '「これは ref」という目印。template の自動 .value 外しが見分けに使う'],
    ];
    const partsEl = h('div', { class: 'vxF-parts' }, ...parts.map(([k, name, mean]) => h('div', { class: 'vxF-pt', 'data-k': k }, h('b', name), h('span', mean))));
    const say = h('div', { class: 'vxF-say' }), sbs = STEPS.map((s, i) => h('button', { class: 'vxF-sb', type: 'button', onclick: () => go(i) }, h('i', String(i + 1)), s.n));
    let cur = 0, busy = 0;
    const MAP = {
      var: [['const count'], ['function ref', 'return new RefImpl']], get: [['{{ count }}'], ['get value()', 'trackRefValue']], screen: [['{{ count }}'], ['get value()', 'trackRefValue']],
      set: [['count.value++'], ['set value(', 'hasChanged', 'triggerRefValue']], value: [[], ['private _value', 'private _rawValue', 'this._value = toReactive(value)']],
      dep: [[], ['public dep']], isref: [[], ['__v_isRef']],
    };
    const root = h('div', { class: 'vxF' },
      h('div', { class: 'vxF-bar' }, btn('◀ 戻る', () => go(Math.max(0, cur - 1))), btn('次へ ▶', () => go(Math.min(4, cur + 1)), 'primary'), btn('⟲ もう一度', () => go(cur)), say),
      h('div', { class: 'vxF-steps' }, ...sbs),
      h('div', { class: 'vxF-two' }, stage, h('div', { class: 'vxF-code' }, preU)),
      h('div', { class: 'vxF-two' }, partsEl, h('div', { class: 'vxF-code' }, preI, h('div', { class: 'vxF-note' }, '※ 実際の Vue はもう少し複雑。ここは考え方（Vue 3.4 をかんたんにした版）。'))));
    const rest = () => [lnOf(preU, STEPS[cur].u), lnOf(preI, STEPS[cur].i)];
    async function go(i) {
      cur = i; const my = ++busy, ok = () => my === busy && root.isConnected;
      sbs.forEach((b, j) => { b.classList.toggle('on', j === i); b.classList.toggle('past', j < i); });
      say.innerHTML = STEPS[i].say;
      apply(i ? F[i - 1] : F[0]);
      preU.setHi(rest()[0]); preI.setHi(rest()[1]);
      await sleep(250); if (!ok()) return;
      if (i === 1) { await fly(stage, seed, slot, '0', '#2fd4a4'); if (!ok()) return; apply(F[1]); bump(card); }
      else if (i === 2) { apply(F[2]); await fly(stage, varBox, card, '参照', '#ff6b9d'); if (!ok()) return; bump(varBox); }
      else if (i === 3) {
        stage.classList.add('st-screen');
        await fly(stage, scr, getC, 'count を読む', '#5b9dff'); if (!ok()) return;
        bump(getC); depList.replaceChildren(effChip()); bump(depList.parentNode);
        await sleep(300); await fly(stage, valEl, scr, '0', '#2fd4a4'); if (!ok()) return; bump(scr);
      } else if (i === 4) {
        await fly(stage, varBox, setC, 'count.value++', '#ffb454'); if (!ok()) return;
        bump(setC); valEl.textContent = '1'; bump(valEl.parentNode);
        await sleep(300); await fly(stage, depList, scr, '再描画！', '#ff6b9d'); if (!ok()) return;
        scrNum.textContent = '1'; bump(scr);
      }
      if (ok()) apply(F[i]);
    }
    el.append(root);
    link(root, [preU, preI], MAP, rest);
    go(0);
  }

  /* ================= 3. なぜ .value が必要？ ================= */
  function scene3(el) {
    /* 上：左右の図 */
    const L = mkPre(['let count: number = 0', '', 'count = 1'], 'ts', 'ふつうの変数', 'var(--bad)');
    const R = mkPre(['const count = ref<number>(0)', '', 'count.value = 1'], 'ts', 'ref（オブジェクト）', 'var(--ok)');
    let lv = 0, rv = 0, lock = false, lock2 = false;
    const lNum = h('span', { class: 'vxF-n' }, '0'), lBox = h('div', { class: 'vxF-var', 'data-k': 'var' }, h('small', 'メモリの中の変数 count'), h('div', '= ', lNum));
    const lens = h('div', { class: 'vxF-lens', 'data-k': 'lens' }, '🔍 Vue の虫眼鏡'), lEye = h('div', { class: 'vxF-eye' }, '変数の中は、外から見えない');
    const lGo = h('button', { class: 'vxF-btn', 'data-k': 'write', onclick: async () => { if (lock) return; lock = true; await fly(lStage, lGo, lBox, 'count = 1', '#ffb454'); lv = 1; lNum.textContent = '1'; bump(lBox); lens.classList.remove('shake'); void lens.offsetWidth; lens.classList.add('shake'); lEye.className = 'vxF-eye bad'; lEye.textContent = '？ 書き換えに気づけない（画面は古いまま）'; lock = false; } }, 'count = 1 を実行');
    const lScr = h('div', { class: 'vxF-scr' }, h('div', '画面'), h('div', 'count ', h('b', '0'))); const lStage = h('div', { class: 'vxF-stage' }, h('div', { class: 'vxF-flowr' }, lens, lBox), lEye, lScr, lGo);
    const rNum = h('b', '0'), rBox = h('div', { class: 'vxF-obj', 'data-k': 'obj' }, '{ value: ', rNum, ' }');
    const gate = h('div', { class: 'vxF-gate', 'data-k': 'gate' }, '🚪 setter の門', h('br'), h('small', 'ここを通る → Vue が見える')), vEye = h('div', { class: 'vxF-eye' }, '👀 Vue：門の前で見張り中');
    const rScr = h('div', { class: 'vxF-scr' }, h('div', '画面'), h('div', 'count ', h('b', { class: 'rs' }, '0')));
    const rGo = h('button', { class: 'vxF-btn', 'data-k': 'write', onclick: async () => {
      if (lock2) return; lock2 = true;
      await fly(rStage, rGo, gate, 'count.value = 1', '#ffb454'); gate.classList.add('on'); bump(gate);
      vEye.className = 'vxF-eye ok'; vEye.textContent = '👀 Vue：書き込みを検知！';
      await fly(rStage, gate, rBox, '1', '#2fd4a4'); rv = 1; rNum.textContent = '1'; bump(rBox);
      await fly(rStage, gate, rScr, '再描画', '#ff6b9d'); rScr.querySelector('.rs').textContent = '1'; bump(rScr); lock2 = false;
    } }, 'count.value = 1 を実行');
    const rStage = h('div', { class: 'vxF-stage' }, h('div', { class: 'vxF-flowr' }, gate, rBox), vEye, rScr, rGo);
    const reset = () => { lv = rv = 0; lock = false; lock2 = false; lNum.textContent = '0'; rNum.textContent = '0'; rScr.querySelector('.rs').textContent = '0'; lEye.className = 'vxF-eye'; lEye.textContent = '変数の中は、外から見えない'; vEye.className = 'vxF-eye'; vEye.textContent = '👀 Vue：門の前で見張り中'; gate.classList.remove('on'); };
    const left = h('div', { class: 'vxF-box no' }, h('div', { class: 'vxF-tt' }, '✖ ふつうの変数：代入は見えない'), lStage, h('div', { class: 'vxF-code' }, L));
    const right = h('div', { class: 'vxF-box yes' }, h('div', { class: 'vxF-tt' }, '✓ オブジェクト＋ .value：出入口を見張れる'), rStage, h('div', { class: 'vxF-code' }, R));
    link(left, [L], { var: [['let count']], lens: [['count = 1']], write: [['count = 1']] });
    link(right, [R], { obj: [['ref<number>']], gate: [['count.value = 1']], write: [['count.value = 1']] });

    /* 下：ミニ実験 makeRef */
    const M = [
      'type Effect = () => void',
      '',
      'let activeEffect: Effect | null = null',
      '',
      'function watchEffect(fn: Effect): void {',
      '  activeEffect = fn',
      '  fn()',
      '  activeEffect = null',
      '}',
      '',
      'function makeRef<T>(initial: T) {',
      '  let current: T = initial',
      '  const subscribers = new Set<Effect>()',
      '',
      '  return {',
      '    get value(): T {',
      '      if (activeEffect) subscribers.add(activeEffect)',
      '      return current',
      '    },',
      '    set value(next: T) {',
      '      current = next',
      '      subscribers.forEach((fn) => fn())',
      '    },',
      '  }',
      '}',
      '',
      'const count = makeRef<number>(0)',
      '',
      'watchEffect(() => {',
      '  console.log(`相談 ${count.value} 件`)',
      '})',
      '',
      'count.value++',
    ];
    const preM = mkPre(M, 'ts', 'makeRef.ts（本物の ref の考え方を、ぎゅっと小さく）');
    let activeEffect = null; const subs = new Set();
    let cur = 0;
    const logBox = h('div', { class: 'vxF-log' }, h('div', { class: 'mute' }, '▶ ボタンを順番に押してみよう'));
    const log = (t, cls) => { logBox.append(h('div', { class: cls || null }, t)); logBox.scrollTop = 9999; };
    const vC = h('span', { class: 'vxF-chip', 'data-k': 'cur' }, 'count.value = ', h('b', '0')), sC = h('span', { class: 'vxF-chip', 'data-k': 'subs' }, 'subscribers = ', h('b', '0'));
    const sync = () => { vC.lastChild.textContent = String(cur); sC.lastChild.textContent = String(subs.size); bump(vC); bump(sC); };
    const effect = () => { log('相談 ' + cur + ' 件'); };
    const hi = (toks) => preM.setHi(lnOf(preM, toks));
    let busy = false;
    const bRegister = btn('① watchEffect で画面を登録', async () => {
      if (busy) return; busy = true;
      hi(['activeEffect = fn']); await sleep(550); hi(['  fn()']); await sleep(450);
      hi(['if (activeEffect) subscribers.add']); activeEffect = effect; subs.add(effect); effect(); activeEffect = null; sync(); await sleep(650);
      hi(['activeEffect = null']); await sleep(450); hi([]); log('→ 読んだ人（画面）が subscribers に入った', 'mute'); busy = false;
    }, 'primary');
    const bInc = btn('② count.value++ （書く）', async () => {
      if (busy) return; busy = true;
      hi(['count.value++']); await sleep(450); hi(['current = next']); cur++; sync(); await sleep(550);
      hi(['subscribers.forEach']); await sleep(450);
      if (subs.size) subs.forEach((f) => f()); else log('（まだだれも登録していない → 通知なし）', 'mute');
      await sleep(400); hi([]); busy = false;
    });
    const bReset = btn('⟲ 最初から', () => { busy = false; subs.clear(); cur = 0; activeEffect = null; logBox.replaceChildren(h('div', { class: 'mute' }, '▶ ボタンを順番に押してみよう')); sync(); hi([]); });
    const panel = h('div', { class: 'vxF-box' }, h('div', { class: 'vxF-tt' }, '🧪 ミニ実験：自分で作った ref（動く！）'), h('div', { class: 'vxF-row' }, bRegister, bInc, bReset), h('div', { class: 'vxF-chips' }, vC, sC), logBox);
    const demo = h('div', { class: 'vxF-demo' }, h('div', { class: 'vxF-code' }, preM), panel);
    link(demo, [preM], { cur: [['let current', 'return current']], subs: [['const subscribers', 'subscribers.add', 'subscribers.forEach']] });
    const root = h('div', { class: 'vxF' }, h('div', { class: 'vxF-bar' }, btn('⟲ 上の図を最初から', reset), h('div', { class: 'vxF-say' }, '変数への代入は見えない。count.value への代入は「門」を通るので見える。')), h('div', { class: 'vxF-two' }, left, right), demo);
    el.append(root);
  }

  /* ================= 4. template の自動アンラップ ================= */
  function scene4(el) {
    const C = [
      '<script setup lang="ts">',
      "import { ref } from 'vue'",
      '',
      'const waiting = ref<number>(3)',
      '',
      'const callNext = (): void => {',
      '  waiting.value--',
      '}',
      '</script>',
      '',
      '<template>',
      '  <p>待ち {{ waiting }} 件</p>',
      '  <button @click="callNext">次の方をお呼びする</button>',
      '</template>',
    ];
    const pre = mkPre(C, 'vue', 'WaitingBoard.vue');
    let n = 3, lock = false;
    const sN = h('b', '3'), tN = h('b', '3'), cN = h('b', '3');
    const scriptBox = h('div', { class: 'vxF-var', 'data-k': 'script', style: { borderColor: '#ffb454' } }, h('small', 'script（JavaScript）'), h('div', { style: { font: '900 1rem var(--mono)' } }, 'waiting.value → ', sN));
    const refBox = h('div', { class: 'vxF-obj', 'data-k': 'ref' }, 'Ref { value: ', cN, ' }');
    const gate = h('span', { class: 'vxF-un', 'data-k': 'tpl' }, '🔓 自動で .value を外す');
    const tplBox = h('div', { class: 'vxF-scr', 'data-k': 'tpl' }, h('div', 'template（画面）'), h('div', '待ち ', tN, ' 件　', h('small', '← {{ waiting }}')));
    const stage = h('div', { class: 'vxF-stage' }, h('div', { class: 'vxF-flow4' }, scriptBox, h('div', { class: 'vxF-mid' }, refBox, h('small', '← ref の箱（同じ箱を2か所が見る）')), h('div', { class: 'vxF-mid' }, gate), tplBox));
    const read = async () => {
      if (lock) return; lock = true;
      await fly(stage, refBox, scriptBox, '.value で取り出す', '#ffb454'); bump(scriptBox);
      await fly(stage, refBox, tplBox, '自動で取り出す', '#2fd4a4'); bump(tplBox); lock = false;
    };
    const write = async () => {
      if (lock || n <= 0) return; lock = true; n--;
      await fly(stage, scriptBox, refBox, 'waiting.value--', '#ffb454'); cN.textContent = String(n); bump(refBox);
      sN.textContent = String(n); bump(scriptBox);
      await fly(stage, refBox, tplBox, '再描画', '#ff6b9d'); tN.textContent = String(n); bump(tplBox); lock = false;
    };
    const resetA = () => { n = 3; lock = false; [sN, tN, cN].forEach((x) => { x.textContent = '3'; }); };
    link(stage, [pre], { script: [['waiting.value--']], ref: [['ref<number>']], tpl: [['{{ waiting }}']] });
    const top = h('div', { class: 'vxF-two' }, h('div', { class: 'vxF-box' }, h('div', { class: 'vxF-tt' }, '同じ ref を、2か所で見る'), stage), h('div', { class: 'vxF-code' }, pre));
    link(top, [pre], { script: [['waiting.value--']], ref: [['ref<number>']], tpl: [['{{ waiting }}']] });

    /* つまずき3つ */
    const PIT = [
      { k: '① script で .value を忘れる', bad: ['const waiting = ref<number>(3)', 'const next = waiting + 1'], bi: [2], br: '→ "[object Object]1"（数字にならない）', good: ['const waiting = ref<number>(3)', 'const next = waiting.value + 1'], gi: [2], gr: '→ 4', why: 'script の waiting は<b>箱そのもの</b>。数字がほしいときは <b>.value</b>。' },
      { k: '② 取り出すと、つながりが切れる', bad: ['let now = waiting.value', 'now--'], bi: [1, 2], br: '→ now は数字のコピー。画面は変わらない', good: ['waiting.value--'], gi: [1], gr: '→ 画面も変わる', why: '<b>.value で取り出した数字は、ただのコピー</b>。変えるときは箱（waiting.value）に直接書く。' },
      { k: '③ ふつうの object の中の ref', bad: ['const state = { waiting: ref<number>(3) }', '<p>{{ state.waiting + 1 }}</p>'], bi: [2], br: '→ "[object Object]1"', good: ['const state = { waiting: ref<number>(3) }', '<p>{{ state.waiting.value + 1 }}</p>'], gi: [2], gr: '→ 4', why: '自動で外れるのは、<b>script setup の一番外側の ref だけ</b>。object の中は .value が要る。' },
    ];
    let pi = 0;
    const tabs = h('div', { class: 'vxF-tabs' }), body = h('div', { style: { display: 'grid', gap: '10px' } });
    PIT.forEach((p, i) => tabs.append(h('button', { class: 'vxF-tab' + (i === 0 ? ' on' : ''), type: 'button', onclick: (e) => { pi = i; [...tabs.children].forEach((b, j) => b.classList.toggle('on', j === i)); draw(); } }, p.k)));
    function draw() {
      const p = PIT[pi], b = code(p.bad.join('\n'), 'ts', { color: BAD, dim: true, edit: false }), g = code(p.good.join('\n'), 'ts', { color: OK, dim: true, edit: false });
      b.setHi(p.bi, 'err'); g.setHi(p.gi, 'on');
      const why = h('div', { class: 'vxF-why' }); why.innerHTML = p.why;
      body.replaceChildren(h('div', { class: 'vxF-vs' }, h('div', h('div', { class: 'lb x' }, '✖ こう書くと　' + p.br), b), h('div', h('div', { class: 'lb o' }, '✓ こう書く　' + p.gr), g)), why);
    }
    draw();
    const rx = [
      'interface Form {',
      '  name: string',
      '  phone: string',
      '}',
      '',
      "const form = reactive<Form>({ name: '', phone: '' })",
      "form.name = '山田 太郎'",
      '',
      "form = { name: '', phone: '' }",
      'const { name } = form',
    ];
    const rpre = code(rx.join('\n'), 'ts', { color: VUE, dim: true, edit: false }); rpre.setHi([7], 'on'); rpre.setHi([9, 10], 'err');
    const eb = h('div', { class: 'vxF-box' }, h('div', { class: 'vxF-tt' }, '参考：reactive は .value なし。でも…'), h('div', { class: 'vxF-code' }, rpre), h('div', { class: 'vxF-why' }, '✓ 書き換えは form.name で OK。✖ 丸ごと差し替え・取り出し（分解）は、つながりが切れる。'));
    const pit = h('div', { class: 'vxF-two' }, h('div', { class: 'vxF-box' }, h('div', { class: 'vxF-tt' }, '⚠ つまずき3つ（押して見る）'), tabs, body), eb);
    const root = h('div', { class: 'vxF' }, h('div', { class: 'vxF-bar' }, btn('▶ 読んでみる', read, 'primary'), btn('waiting.value-- （書く）', write), btn('⟲ 最初から', resetA), h('div', { class: 'vxF-say' }, 'script では箱を開ける（.value）。template では Vue が開けてくれる。')), top, pit);
    el.append(root);
  }

  /* ================= 5. 使いこなす目安 ================= */
  function scene5(el) {
    const DEC = [
      { k: '数字・文字・真偽値', d: "const slots = ref<number>(3)", s: 'slots.value--', t: '<p>残り {{ slots }} 枠</p>', n: 'いちばん基本。迷ったら ref。' },
      { k: '配列', d: 'const areas = ref<string[]>([])', s: "areas.value.push('相続')", t: '<li v-for="a in areas" :key="a">{{ a }}</li>', n: '中身は push してよい。丸ごと入れ替えるなら areas.value = [...]。' },
      { k: 'object（まだ無いかも）', d: 'const selected = ref<Case | null>(null)', s: 'selected.value = found', t: '<p>{{ selected?.title }}</p>', n: '「まだ無い」は null で表す。型に | null を付ける。' },
      { k: 'フォーム一式（reactive）', d: "const form = reactive<Form>({ name: '', phone: '' })", s: "form.name = '山田 太郎'", t: '<input v-model="form.name">', n: '.value は不要。ただし丸ごと差し替え・分解はできない。' },
    ];
    let di = 0;
    const pick = h('div', { class: 'vxF-pick' });
    const out = h('div', { class: 'vxF-out' });
    DEC.forEach((d, i) => pick.append(h('button', { class: 'vxF-tab' + (i === 0 ? ' on' : ''), type: 'button', onclick: () => { di = i; [...pick.children].forEach((b, j) => b.classList.toggle('on', j === i)); draw(); } }, d.k)));
    function draw() {
      const d = DEC[di], mk = (t, lang, c) => code(t, lang, { color: c, dim: true, edit: false });
      const why = h('div', { class: 'vxF-why' }, d.n);
      const rw = (lb, pre) => h('div', { class: 'r' }, h('small', lb), pre);
      out.replaceChildren(rw('宣言', mk(d.d, 'ts', VUE)), rw('script', mk(d.s, 'ts', 'var(--team)')), rw('template', mk(d.t, 'vue', OK)), why);
      bump(out);
    }
    draw();
    const decBox = h('div', { class: 'vxF-dec' }, pick, out);
    const rule = h('div', { class: 'vxF-rule' }, h('div', { style: { '--c': '#ffb454' } }, 'script では ', h('code', '.value'), ' を付ける'), h('div', { style: { '--c': '#2fd4a4' } }, 'template では ', h('code', '.value'), ' は要らない'));

    /* 実例3つ */
    const ex = (title, tcode, src, run, key) => {
      const pre = code(src, 'ts', { color: VUE, dim: true, edit: false });
      const res = h('div', { class: 'res', 'data-k': 'out' });
      const card = h('div', { class: 'vxF-ex' }, h('div', { class: 'tt' }, title, h('code', tcode)), pre, res, btn('▶ 実行', () => { run(res); bump(res); }, 'primary'));
      link(card, [pre], { out: [[key]] });
      return card;
    };
    let slots = 3;
    const e1 = ex('空き枠', 'ref<number>', ['const slots = ref<number>(3)', '', 'const reserve = (): void => {', '  slots.value--', '}'].join('\n'), (r) => { slots = slots > 0 ? slots - 1 : 3; r.replaceChildren('slots.value = ', h('b', String(slots))); }, 'slots.value--');
    e1.querySelector('.res').textContent = 'slots.value = 3';
    const AREAS = ['離婚', '相続', '労働'];
    let ai = 0; const areas = [];
    const e2 = ex('選んだ相談分野', 'ref<string[]>', ['const areas = ref<string[]>([])', '', 'const pick = (name: string): void => {', '  areas.value.push(name)', '}'].join('\n'), (r) => { if (ai >= AREAS.length) { ai = 0; areas.length = 0; } areas.push(AREAS[ai++]); r.replaceChildren(...areas.map((a) => h('span', { class: 'it' }, a))); }, 'areas.value.push');
    e2.querySelector('.res').textContent = 'areas.value = []';
    const CASES = [{ id: 1, title: '離婚の相談' }, { id: 2, title: '相続の相談' }]; let ci = -1;
    const e3 = ex('選んだ案件', 'ref<Case | null>', ['interface Case {', '  id: number', '  title: string', '}', '', 'const selected = ref<Case | null>(null)', '', 'const choose = (c: Case | null): void => {', '  selected.value = c', '}'].join('\n'), (r) => { ci = ci + 1 > CASES.length - 1 ? -1 : ci + 1; r.replaceChildren('selected.value = ', h('b', ci < 0 ? 'null' : '{ id: ' + CASES[ci].id + ', title: "' + CASES[ci].title + '" }')); }, 'selected.value = c');
    e3.querySelector('.res').textContent = 'selected.value = null';
    el.append(h('div', { class: 'vxF' }, rule, decBox, h('div', { class: 'vxF-three' }, e1, e2, e3)));
  }
})();
