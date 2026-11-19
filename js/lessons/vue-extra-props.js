/* 補足 Vue：defineProps と defineModel の書き方（x-vue-props）
   1) 分割代入：必要なキーだけ取り出す（JS）  2) defineProps の2通りの書き方（K.vs.versus）  3) デフォルト値と省略できる props（K.vs.versus）
   4) 落とし穴：分割代入とリアクティブ  5) defineModel の書き方  6) まとめ：どれを使う？ */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.W || !K.vs) return;
  const { h, code, style } = K.W;
  const reg = (o) => K.reg(Object.assign({ track: 'extra' }, o));
  const COLS = ['#ff6b9d', '#5b9dff', '#ffb454', '#2fd4a4', '#a98bff', '#ff8a5b'];
  const BAD = 'var(--bad)', OK = 'var(--ok)', VUE = 'var(--vue)';

  style('vxP', `
  .vxP{display:grid;gap:14px;min-width:0}
  .vxP-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:stretch}
  .vxP-bar .btn{height:44px;padding:0 1.1em;font-size:.9rem}
  .vxP-say{flex:1;min-width:240px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-height:44px;padding:6px 16px;border-radius:12px;border:2px solid var(--line);background:var(--card);font:800 .95rem/1.55 var(--font);transition:.25s}
  .vxP-say.bad{border-color:var(--bad);color:var(--bad)}.vxP-say.ok{border-color:var(--ok)}
  .vxP-say code,.vxP-why code{font:800 .9rem var(--mono);color:var(--vue)}
  .vxP-why{font:800 .9rem/1.6 var(--font);padding:.5em .9em;border-radius:10px;background:color-mix(in srgb,var(--team) 12%,var(--card));border-left:5px solid var(--team)}
  .vxP-tabs{display:flex;gap:8px;flex-wrap:wrap}
  .vxP-tab{all:unset;cursor:pointer;padding:.45em 1em;border-radius:99px;border:2px solid var(--line);background:var(--card2);font:800 .88rem var(--font);transition:.2s}
  .vxP-tab:hover{border-color:var(--vue)}.vxP-tab.on{background:var(--vue);border-color:var(--vue);color:#06101f}
  .vxP-tab.x.on{background:var(--bad);border-color:var(--bad)}
  .vxP-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:stretch}
  @media(max-width:980px){.vxP-two{grid-template-columns:1fr}}
  .vxP-box{border:2px solid var(--line);border-radius:14px;background:var(--card);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}
  .vxP-box.no{border-color:color-mix(in srgb,var(--bad) 55%,var(--line))}.vxP-box.yes{border-color:color-mix(in srgb,var(--ok) 55%,var(--line))}
  .vxP-tt{font:900 .95rem var(--font);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .vxP-box.no>.vxP-tt{color:var(--bad)}.vxP-box.yes>.vxP-tt{color:var(--ok)}
  .vxP-code{min-width:0;display:flex;flex-direction:column;gap:10px}.vxP-code>pre.code,.vxP-box>pre.code{margin:0;font-size:.88rem;flex:0 0 auto}.vxP-code>pre.code:last-child{flex:1 0 auto}
  .vxP-stage{position:relative;border-radius:12px;background:#f4f6fb;color:#1f2a44;padding:14px;min-width:0;display:flex;flex-direction:column;gap:12px;justify-content:center}
  .vxP-stage small{font:800 .8rem var(--font);color:#5b6788}
  .vxP-pkt{position:absolute;left:0;top:0;z-index:9;padding:.2em .85em;border-radius:99px;color:#06101f;font:900 .85rem var(--mono);box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap}
  .vxP-bump{animation:vxPb .7s}@keyframes vxPb{30%{transform:scale(1.07);box-shadow:0 0 0 6px color-mix(in srgb,var(--ok) 45%,transparent)}}
  .vxP [data-k]{cursor:default;border-radius:10px;transition:outline-color .15s,background .15s}
  .vxP [data-k].vxP-hot{outline:2px solid var(--c,#2f7bff);outline-offset:2px;box-shadow:0 0 0 5px color-mix(in srgb,var(--c,#2f7bff) 22%,transparent)}
  /* 1: 分割代入 */
  .vxP-1{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.15fr);gap:14px;align-items:stretch}
  @media(max-width:980px){.vxP-1{grid-template-columns:1fr}}
  .vxP-flow{display:grid;grid-template-columns:minmax(0,1fr) 30px minmax(0,1fr);gap:0;align-items:stretch}
  .vxP-src,.vxP-vars{display:flex;flex-direction:column;gap:7px;padding:10px;border-radius:12px;background:#fff;border:2px solid #b9c4e2}
  .vxP-src>b,.vxP-vars>b{font:900 .85rem var(--mono);color:#2f6df0}
  .vxP-chip{white-space:nowrap;display:flex;gap:8px;align-items:center;padding:.3em .7em;border-radius:10px;background:#eef2fb;border:2px solid #d3dbf0;font:800 .88rem var(--mono);transition:.3s}
  .vxP-chip i{font-style:normal;color:#7b86aa}.vxP-chip em{font-style:normal;margin-left:auto;font:900 .8rem var(--font);color:#127a5c;opacity:0;transition:.3s}
  .vxP-chip.picked{border-color:#2fd4a4;background:#e3f8f0}.vxP-chip.picked em{opacity:1}
  .vxP-chip.ghost{border-style:dashed;color:#9aa4c4;background:#fff}
  .vxP-arw{display:grid;place-items:center;font:900 1.4rem var(--mono);color:#9aa4c4}
  .vxP-var{display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:.4em .7em;border-radius:10px;border:2px solid #b9c4e2;background:#f7f9ff;font:800 .88rem var(--mono);min-height:2.6em}
  .vxP-var code{color:#7b3fd1}.vxP-var .v{font:900 .95rem var(--mono);color:#1f2a44}.vxP-var .tag{font:900 .8rem var(--font);padding:.1em .6em;border-radius:99px;background:#ffb454;color:#06101f}
  .vxP-var.full{border-color:#2fd4a4;background:#e3f8f0}
  .vxP-note{font:800 .8rem/1.5 var(--font);color:#5b6788}
  /* 2,3: 子のプレビュー */
  .vxP-par{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:.4em .7em;border-radius:10px;background:#fff;border:2px dashed #b9c4e2;font:800 .85rem var(--mono)}
  .vxP-par small{font:800 .8rem var(--font);color:#5b6788}
  .vxP-chd{display:grid;gap:6px;padding:12px;border-radius:12px;background:#fff;border:3px solid #2f6df0;min-height:6.5em;align-content:center}
  .vxP-chd h3{margin:0;font:900 1.15rem var(--font)}
  .vxP-pill{width:fit-content;padding:.1em .8em;border-radius:99px;background:#e4e9f7;font:900 .88rem var(--font);transition:.3s}.vxP-pill.d{background:#2fd4a4;color:#06101f}
  .vxP-badge{width:fit-content;border-radius:99px;background:#2f6df0;color:#fff;font:900 .8rem var(--font);padding:.2em .8em;transition:.3s}
  .vxP-badge.md{font-size:1.15rem;padding:.35em 1.2em}
  .vxP-dflt{font:800 .8rem var(--font);padding:.1em .7em;border-radius:99px;background:#ffb454;color:#06101f;width:fit-content}
  .vxP-ver{display:flex;gap:10px;flex-wrap:wrap;align-items:stretch}
  .vxP-ver>div{flex:1;min-width:230px;padding:8px 14px;border-radius:12px;border:2px solid var(--line);background:var(--card);font:800 .9rem/1.5 var(--font)}
  .vxP-ver .ok{border-color:var(--ok)}.vxP-ver .bad{border-color:var(--bad)}
  .vxP-ver b{display:block}.vxP-ver .ok b{color:var(--ok)}.vxP-ver .bad b{color:var(--bad)}.vxP-ver code{font:800 .85rem var(--mono);color:var(--vue)}
  /* 4: 落とし穴 */
  .vxP-out{background:#0b1020;color:#cfe;border-radius:10px;padding:10px 12px;font:700 .88rem/1.7 var(--mono);min-height:6.4em;display:grid;gap:2px;align-content:start}
  .vxP-out .mute{color:#8892b8}.vxP-out .e{color:#ff8a96}.vxP-out .g{color:#2fd4a4}
  .vxP-verdict{width:fit-content;padding:.2em 1em;border-radius:99px;font:900 .95rem var(--font);color:#06101f}
  .vxP-verdict.bad{background:#ff8a96}.vxP-verdict.ok{background:#2fd4a4}
  .vxP-tagrow{display:flex;gap:8px;flex-wrap:wrap}
  .vxP-tagrow span{font:900 .8rem var(--font);padding:.1em .7em;border-radius:99px;background:var(--card2);border:1px solid var(--line);color:var(--mute)}
  .vxP-tagrow span.soon{background:#ffb454;color:#06101f;border-color:#ffb454}
  /* 5: defineModel */
  .vxP-5{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.05fr);gap:14px;align-items:stretch}
  @media(max-width:980px){.vxP-5{grid-template-columns:1fr}}
  .vxP-demo{display:grid;grid-template-columns:minmax(0,1fr) 70px minmax(0,1fr);align-items:stretch}
  .vxP-node{display:flex;flex-direction:column;gap:8px;padding:10px;border-radius:12px;background:#fff;border:3px solid #b9c4e2}
  .vxP-node.child{border-color:#2f6df0}
  .vxP-node>b{font:900 .85rem var(--mono);color:#2f6df0}
  .vxP-val{font:900 1.05rem var(--mono);padding:.3em .6em;border-radius:10px;background:#eef2fb;min-height:2.2em;word-break:break-all}
  .vxP-node input[type=text]{font:800 .95rem var(--font);padding:.4em .6em;border:2px solid #b9c4e2;border-radius:8px;width:100%;box-sizing:border-box}
  .vxP-node button.mini{all:unset;cursor:pointer;padding:.3em .8em;border-radius:99px;background:#e4e9f7;color:#1f2a44;font:800 .8rem var(--font);width:fit-content;transition:.15s}
  .vxP-node button.mini:hover{background:#2f6df0;color:#fff}
  .vxP-lanes{display:grid;grid-template-rows:1fr 1fr;align-items:center;justify-items:center;font:900 .8rem var(--mono);color:#7b86aa;text-align:center}
  .vxP-lanes span{padding:.1em .3em;border-radius:6px;font-size:1.5rem}
  .vxP-lanes small{display:block;font:800 .8rem var(--font)}
  .vxP-mini{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
  .vxP-warn{font:800 .8rem/1.4 var(--font);padding:.2em .7em;border-radius:8px;width:fit-content}.vxP-warn.bad{background:#ffe3e7;color:#b3243a}.vxP-warn.ok{background:#e3f8f0;color:#127a5c}
  .vxP-stp{display:flex;gap:8px;align-items:center}
  .vxP-stp button{all:unset;cursor:pointer;width:2em;height:2em;border-radius:50%;display:grid;place-items:center;background:#e4e9f7;font:900 1rem var(--font);color:#1f2a44}.vxP-stp button:hover{background:#2f6df0;color:#fff}
  .vxP-stp b{font:900 1.3rem var(--mono);min-width:1.5em;text-align:center}
  /* 6: まとめ */
  .vxP-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;align-items:stretch}
  @media(max-width:900px){.vxP-grid{grid-template-columns:1fr}}
  .vxP-card{border:2px solid var(--line);border-radius:14px;background:var(--card);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0;transition:.2s}
  .vxP-card:hover{border-color:var(--vue);transform:translateY(-2px)}
  .vxP-card .q{font:900 1rem/1.4 var(--font);display:flex;gap:8px;align-items:center}
  .vxP-card .q i{font-style:normal;flex:none;width:1.8em;height:1.8em;border-radius:50%;display:grid;place-items:center;background:var(--vue);color:#06101f;font:900 .9rem var(--font)}
  .vxP-card pre.code{margin:0;font-size:.88rem;flex:1}
  .vxP-card .n{font:800 .85rem/1.5 var(--font);color:var(--mute)}
  .vxP-card .n code{font:800 .85rem var(--mono);color:var(--vue)}
  `);

  /* ---------- 共通の道具 ---------- */
  const lnOf = (pre, toks) => { const o = []; if (pre && pre.lines) pre.lines.forEach((l, i) => { if ((toks || []).some((t) => l.textContent.includes(t))) o.push(i + 1); }); return o; };
  const bump = (el) => { if (!el) return; el.classList.remove('vxP-bump'); void el.offsetWidth; el.classList.add('vxP-bump'); };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  async function fly(host, from, to, text, col, ms) {
    if (!from || !to || !host.isConnected) return;
    const hr = host.getBoundingClientRect(), a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    const el = h('span', { class: 'vxP-pkt', style: { background: col || '#2fd4a4' } }, text); host.append(el);
    const w = el.offsetWidth, hh = el.offsetHeight, pt = (r) => ({ x: r.left - hr.left + r.width / 2 - w / 2, y: r.top - hr.top + r.height / 2 - hh / 2 });
    const A = pt(a), B = pt(b), d = ms || 800;
    try {
      const an = el.animate([{ transform: `translate(${A.x}px,${A.y}px) scale(.6)`, opacity: 0 }, { transform: `translate(${A.x}px,${A.y}px)`, opacity: 1, offset: .15 }, { transform: `translate(${B.x}px,${B.y}px)`, opacity: 1, offset: .85 }, { transform: `translate(${B.x}px,${B.y}px) scale(.6)`, opacity: 0 }], { duration: d, easing: 'ease-in-out' });
      await Promise.race([an.finished, sleep(d + 150)]);
    } catch (e) { /* 途中で消えてもよい */ }
    el.remove();
  }
  /* root 内の [data-k] 部品 ⇄ コードの行。map = { key: [pre0 のトークン, pre1 のトークン…] }。コードの行に乗せると、その行に関わる key を全部光らせる */
  function link(root, pres, map) {
    const keys = Object.keys(map);
    const set = (ks) => pres.forEach((pre, pi) => pre.setHi(ks.length ? [...new Set([].concat(...ks.map((k) => lnOf(pre, (map[k] || [])[pi]))))] : [], 'on'));
    const on = (ks) => { set(ks); root.querySelectorAll('[data-k]').forEach((n) => n.classList.toggle('vxP-hot', ks.includes(n.getAttribute('data-k')))); };
    const off = () => { set([]); root.querySelectorAll('.vxP-hot').forEach((n) => n.classList.remove('vxP-hot')); };
    keys.forEach((k, i) => root.querySelectorAll('[data-k="' + k + '"]').forEach((n) => { if (n.__vxp) return; n.__vxp = 1; n.style.setProperty('--c', COLS[i % COLS.length]); n.addEventListener('mouseenter', () => on([k])); n.addEventListener('mouseleave', off); }));
    pres.forEach((pre, pi) => pre.lines.forEach((ln) => {
      ln.addEventListener('mouseenter', () => { const ks = keys.filter((kk) => ((map[kk] || [])[pi] || []).some((t) => ln.textContent.includes(t))); if (ks.length) on(ks); });
      ln.addEventListener('mouseleave', off);
    }));
  }
  const mkPre = (lines, lang, file, color, dim) => code([].concat(lines).join('\n'), lang, { color: color || VUE, file, dim: !!dim, edit: false });
  const btn = (label, onclick, cls) => h('button', { class: 'btn' + (cls ? ' ' + cls : ''), type: 'button', style: cls === 'primary' ? { '--c': VUE } : {}, onclick }, label);
  const tabBtn = (label, onclick, cls) => h('button', { class: 'vxP-tab' + (cls ? ' ' + cls : ''), type: 'button', onclick }, label);

  /* ================= 1. 分割代入：必要なキーだけ取り出す ================= */
  function scene1(el) {
    const OBJ = (extra) => ['const lawyer = {', "  name: '山田 太郎',", "  field: '労働問題',", "  city: '東京',"].concat(extra || [], ['}', '']);
    const IT = (k, val, ghost) => ({ k, label: k + ':', val, ghost });
    const N = "'山田 太郎'", F = "'労働問題'", C = "'東京'";
    const four = () => [IT('name', N), IT('field', F), IT('city', C), IT('fee', '5500')];
    const AR = ['const list = [', "  '離婚',", "  '相続',", "  '労働',", ']'];
    const ARI = [{ k: 'i0', label: '[0]', val: "'離婚'" }, { k: 'i1', label: '[1]', val: "'相続'" }, { k: 'i2', label: '[2]', val: "'労働'" }];
    const TABS = [
      { tab: '基本', mk: () => ({ obj: 'lawyer', src: OBJ(['  fee: 5500,']).concat(['const { name, fee } = lawyer']), items: four(), outs: [{ v: 'name', from: 'name', val: N }, { v: 'fee', from: 'fee', val: '5500' }], keys: { name: ["name: '山田", '{ name, fee }'], fee: ['fee: 5500', '{ name, fee }'], field: ['field:'], city: ['city:'] }, say: 'lawyer から name と fee だけ。field と city は使わない。' }) },
      { tab: '名前を変える', mk: () => ({ obj: 'lawyer', src: OBJ(['  fee: 5500,']).concat(['const { name: lawyerName, fee } = lawyer']), items: four(), outs: [{ v: 'lawyerName', from: 'name', val: N }, { v: 'fee', from: 'fee', val: '5500' }], keys: { name: ["name: '山田", 'name: lawyerName'], fee: ['fee: 5500', 'lawyerName, fee }'], field: ['field:'], city: ['city:'] }, say: '「元の名前: 新しい名前」。この : は型ではなく、名前の付け替え。' }) },
      { tab: '初期値 =', toggle: true, mk: (st) => ({ obj: 'lawyer', src: OBJ(st.fee ? ['  fee: 6600,'] : []).concat(['const { name, fee = 5500 } = lawyer']), items: [IT('name', N), IT('field', F), IT('city', C), st.fee ? IT('fee', '6600') : IT('fee', '（無い）', true)], outs: [{ v: 'name', from: 'name', val: N }, st.fee ? { v: 'fee', from: 'fee', val: '6600' } : { v: 'fee', from: 'fee', val: '5500', tag: '初期値' }], keys: { name: ["name: '山田", '{ name, fee'], fee: [st.fee ? 'fee: 6600' : 'XX', 'fee = 5500'], field: ['field:'], city: ['city:'] }, say: st.fee ? 'fee があれば、その値。= 5500 は使われない。' : 'fee が無い（undefined）ときだけ、= の初期値が入る。' }) },
      { tab: '残り ...', mk: () => ({ obj: 'lawyer', src: OBJ(['  fee: 5500,']).concat(['const { name, ...others } = lawyer']), items: four(), outs: [{ v: 'name', from: 'name', val: N }], rest: { v: 'others', from: ['field', 'city', 'fee'] }, keys: { name: ["name: '山田", '{ name,'], field: ['field:', '...others'], city: ['city:', '...others'], fee: ['fee:', '...others'], rest: ['...others'] }, say: '... は「残り全部」。others に、field・city・fee がまとまる。' }) },
      { tab: '配列 [ ]', mk: () => ({ obj: 'list', src: AR.concat(['', 'const [first, second] = list']), items: ARI, outs: [{ v: 'first', from: 'i0', val: "'離婚'" }, { v: 'second', from: 'i1', val: "'相続'" }], keys: { i0: ["'離婚'", '[first'], i1: ["'相続'", 'second]'], i2: ["'労働'"] }, say: '配列は { } ではなく [ ]。名前ではなく、順番で取り出す。' }) },
      { tab: 'Vue：defineProps', mk: () => ({ obj: 'props', src: ['const { title, done } = defineProps<{', '  title: string', '  done: boolean', '  lawyer: string', '}>()'], items: [IT('title', "'初回相談'"), IT('done', 'false'), IT('lawyer', N)], outs: [{ v: 'title', from: 'title', val: "'初回相談'" }, { v: 'done', from: 'done', val: 'false' }], keys: { title: ['title: string', '{ title, done }'], done: ['done: boolean', '{ title, done }'], lawyer: ['lawyer: string'] }, say: 'Vue でも同じ。親から来た props から、使うものだけ取り出せる（次のシーン）。' }) },
      { tab: 'Vue：defineModel', mk: () => ({ obj: 'defineModel()', src: ['const [model, modifiers] = defineModel<string>()'], items: [{ k: 'i0', label: '[0]', val: '値（ref）' }, { k: 'i1', label: '[1]', val: '修飾子 { trim: true }' }], outs: [{ v: 'model', from: 'i0', val: '値（ref）' }, { v: 'modifiers', from: 'i1', val: '{ trim: true }' }], keys: { i0: ['[model'], i1: ['modifiers]'] }, say: '返り値が 2 つ入りの配列なので、[ ] で受け取る（シーン5で使う）。' }) },
    ];
    const st = { fee: false };
    let cur = 0, tok = 0;
    const tabs = h('div', { class: 'vxP-tabs' }), say = h('div', { class: 'vxP-say' }), body = h('div', { class: 'vxP-1' });
    TABS.forEach((t, i) => tabs.append(tabBtn(t.tab, () => { cur = i; draw(); })));
    const toggleBtn = btn('', () => { st.fee = !st.fee; draw(); });
    let curSpec = null;

    async function run() {
      const sp = curSpec, my = ++tok, stage = body.querySelector('.vxP-flow');
      if (!stage) return;
      stage.querySelectorAll('.vxP-chip').forEach((c) => c.classList.remove('picked'));
      stage.querySelectorAll('.vxP-var .v').forEach((v) => { v.textContent = '？'; });
      stage.querySelectorAll('.vxP-var').forEach((v) => v.classList.remove('full'));
      const rb = stage.querySelector('.vxP-var.rest'); if (rb) rb.querySelector('.v').textContent = '？';
      const jobs = [];
      sp.outs.forEach((o, i) => jobs.push((async () => {
        await sleep(i * 220);
        const chip = stage.querySelector('.vxP-chip[data-k="' + o.from + '"]'), box = stage.querySelector('.vxP-var[data-v="' + o.v + '"]');
        await fly(stage, chip, box, o.val, COLS[Object.keys(sp.keys).indexOf(o.from) % 6]);
        if (my !== tok) return;
        box.querySelector('.v').textContent = o.val; box.classList.add('full'); bump(box); chip.classList.add('picked');
      })()));
      if (sp.rest) jobs.push((async () => {
        await sleep(sp.outs.length * 220);
        const box = stage.querySelector('.vxP-var[data-v="' + sp.rest.v + '"]');
        await Promise.all(sp.rest.from.map((k, i) => (async () => { await sleep(i * 160); const chip = stage.querySelector('.vxP-chip[data-k="' + k + '"]'); await fly(stage, chip, box, k, COLS[(Object.keys(sp.keys).indexOf(k)) % 6]); if (my === tok) chip.classList.add('picked'); })()));
        if (my !== tok) return;
        box.querySelector('.v').textContent = '{ ' + sp.rest.from.join(', ') + ' }'; box.classList.add('full'); bump(box);
      })());
      await Promise.all(jobs);
    }
    function draw() {
      const t = TABS[cur], sp = t.mk(st); curSpec = sp; tok++;
      [...tabs.children].forEach((b, i) => b.classList.toggle('on', i === cur));
      say.replaceChildren('📖 ', h('b', sp.say));
      const pre = mkPre(sp.src, 'ts', sp.obj === 'props' ? 'BookingCard.vue' : sp.obj === 'defineModel()' ? 'NameInput.vue' : 'lawyer.ts', VUE, false);
      const src = h('div', { class: 'vxP-src' }, h('b', sp.obj), ...sp.items.map((it) => h('div', { class: 'vxP-chip' + (it.ghost ? ' ghost' : ''), 'data-k': it.k }, h('i', it.label), it.val, h('em', '✓'))), h('div', { class: 'vxP-note' }, '元は変わらない（コピーを取り出す）'));
      const vars = h('div', { class: 'vxP-vars' }, h('b', '新しい変数'),
        ...sp.outs.map((o) => h('div', { class: 'vxP-var', 'data-k': o.from, 'data-v': o.v }, h('code', 'const ' + o.v), '=', h('span', { class: 'v' }, '？'), o.tag ? h('span', { class: 'tag' }, o.tag) : null)),
        sp.rest ? h('div', { class: 'vxP-var rest', 'data-k': 'rest', 'data-v': sp.rest.v }, h('code', 'const ' + sp.rest.v), '=', h('span', { class: 'v' }, '？')) : null);
      const stage = h('div', { class: 'vxP-stage' }, h('div', { class: 'vxP-flow' }, src, h('div', { class: 'vxP-arw' }, '→'), vars));
      body.replaceChildren(h('div', { class: 'vxP-code' }, pre), stage);
      link(body, [pre], Object.fromEntries(Object.entries(sp.keys).map(([k, v]) => [k, [v]])));
      toggleBtn.style.display = t.toggle ? '' : 'none';
      toggleBtn.textContent = st.fee ? 'lawyer から fee を消す' : 'lawyer に fee を持たせる';
      setTimeout(run, 250);
    }
    draw();
    el.append(h('div', { class: 'vxP' }, tabs, h('div', { class: 'vxP-bar' }, btn('▶ もう一度取り出す', () => run(), 'primary'), toggleBtn, say), body));
  }

  /* ================= 2. defineProps の2通りの書き方 ================= */
  const TITLES = ['初回相談の予約', '離婚相談の予約', '相続相談の予約'];
  const S2 = (dst) => [
    '<script setup lang="ts">',
    dst ? 'const { title, done } = defineProps<{' : 'const props = defineProps<{',
    '  title: string',
    '  done: boolean',
    '}>()',
    '',
    dst ? "const mark = () => (done ? '完了' : '未完了')" : "const mark = () => (props.done ? '完了' : '未完了')",
    '</script>',
    '',
    '<template>',
    '  <h3>{{ title }}</h3>',
    '  <span>{{ mark() }}</span>',
    '</template>',
  ].join('\n');
  const s2State = { i: 0, done: false };
  const s2UI = (dst) => (ctx) => {
    const attr = h('code', { 'data-k': 'decl' });
    const parent = h('div', { class: 'vxP-par' }, h('small', '親'), attr);
    const tt = h('h3', { 'data-k': 'tpl' }), mk = h('span', { class: 'vxP-pill', 'data-k': 'use' });
    const card = h('div', { class: 'vxP-chd' }, h('small', { style: { font: '800 .8rem var(--font)', color: '#5b6788' } }, '子 BookingCard'), tt, mk);
    const paint = (title, done) => { tt.textContent = title; mk.textContent = done ? '完了' : '未完了'; mk.classList.toggle('d', done); };
    const render = () => { attr.textContent = '<BookingCard title="' + TITLES[s2State.i] + '" :done="' + s2State.done + '" />'; };
    paint(TITLES[0], false); render();
    const el = h('div', { style: { display: 'grid', gap: '10px' } }, parent, card);
    return {
      el, reset() { render(); paint(TITLES[s2State.i], s2State.done); },
      async push(txt) { render(); await ctx.fly(attr, card, txt, '#5b9dff'); paint(TITLES[s2State.i], s2State.done); ctx.bump(card); },
    };
  };
  function scene2(el) {
    const wrap = h('div', { class: 'vxP' });
    const both = async (ctx, txt, msg) => { await Promise.all([ctx.ui.without.push(txt), ctx.ui.with.push(txt)]); ctx.banner(msg, 'ok'); };
    const vs = K.vs.versus({
      neutral: true,
      banner: '親が値を変えたら、左も右も同じように更新される。違うのは script だけ。',
      bar: [
        { label: '▶ 親が title を変える', primary: true, onclick: (ctx) => { s2State.i = (s2State.i + 1) % TITLES.length; both(ctx, TITLES[s2State.i], '親が title を変えた → 両方とも、画面が更新された ✓'); } },
        { label: '親が done を切り替える', onclick: (ctx) => { s2State.done = !s2State.done; both(ctx, s2State.done ? '完了' : '未完了', 'done を変えた → script の done も props.done も、最新の値'); } },
        { label: '⟲ 最初から', onclick: (ctx) => { s2State.i = 0; s2State.done = false; ctx.reset(); } },
      ],
      without: { title: 'props. を付ける書き方', icon: '📦', tone: 'vue', file: 'BookingCard.vue', lang: 'vue', src: S2(false), ui: s2UI(false), keys: { decl: ['defineProps'], tpl: ['{{ title }}'], use: ['props.done'] }, show: ['defineProps', '{{ title }}', 'props.done'] },
      with: { title: '分割代入で受け取る書き方', icon: '✂️', tone: 'react', file: 'BookingCard.vue', lang: 'vue', src: S2(true), ui: s2UI(true), keys: { decl: ['defineProps'], tpl: ['{{ title }}'], use: ['(done ?'] }, show: ['defineProps', '{{ title }}', '(done ?'] },
    });
    const ver = h('div', { class: 'vxP-ver' },
      h('div', { class: 'ok' }, h('b', '✓ Vue 3.5 以上'), '分割代入しても、そのまま更新される（標準で有効）'),
      h('div', { class: 'bad' }, h('b', '✖ Vue 3.4 以下'), '実験的機能（既定ではオフ）。', h('code', 'props.'), ' を付ける書き方で'),
      h('div', {}, h('b', { style: { color: 'var(--vue)' } }, '🔍 まず確認'), 'package.json の ', h('code', '"vue": "^3.5.0"')));
    wrap.append(vs, h('div', { class: 'vxP-why' }, 'template は、どちらも ', h('code', '{{ title }}'), ' のまま。', h('code', 'props.'), ' が要るのは script の中だけ。'), ver);
    el.append(wrap);
  }

  /* ================= 3. デフォルト値と省略できる props ================= */
  const S3 = (dst) => [
    '<script setup lang="ts">',
    "type Size = 'sm' | 'md'",
    '',
    ...(dst ? ["const { size = 'md' } = defineProps<{ size?: Size }>()"] : ['const props = withDefaults(', '  defineProps<{ size?: Size }>(),', "  { size: 'md' },", ')']),
    '</script>',
    '',
    '<template>',
    '  <span class="badge" :class="size">相談中</span>',
    '</template>',
  ].join('\n');
  const s3State = { size: 'sm' };
  const s3UI = (dst) => (ctx) => {
    const attr = h('code', { 'data-k': 'opt' });
    const parent = h('div', { class: 'vxP-par' }, h('small', '親'), attr);
    const badge = h('span', { class: 'vxP-badge', 'data-k': 'tpl' }, '相談中'), df = h('span', { class: 'vxP-dflt', 'data-k': 'dflt' });
    const card = h('div', { class: 'vxP-chd' }, h('small', { style: { font: '800 .8rem var(--font)', color: '#5b6788' } }, '子 SizeBadge'), badge, df);
    const paint = () => { const s = s3State.size || 'md'; badge.className = 'vxP-badge ' + s; badge.textContent = '相談中（' + s + '）'; df.style.display = s3State.size ? 'none' : ''; df.textContent = '渡されていない → 既定値 \'md\''; };
    const render = () => { attr.textContent = s3State.size ? '<SizeBadge size="' + s3State.size + '" />' : '<SizeBadge />'; };
    render(); paint();
    return { el: h('div', { style: { display: 'grid', gap: '10px' } }, parent, card), reset() { render(); paint(); }, async push() { render(); await ctx.fly(attr, card, s3State.size || '（なし）', s3State.size ? '#5b9dff' : '#ffb454'); paint(); ctx.bump(card); } };
  };
  function scene3(el) {
    const go = async (ctx, size, msg, kind) => { s3State.size = size; await Promise.all([ctx.ui.without.push(), ctx.ui.with.push()]); ctx.banner(msg, kind); };
    const vs = K.vs.versus({
      neutral: true,
      banner: 'size を渡さなくても、既定値 \'md\' で表示される。書き方は 2 通り。',
      bar: [
        { label: 'size="sm" を渡す', primary: true, onclick: (ctx) => go(ctx, 'sm', 'size="sm" を渡した → sm で表示（既定値は使われない）', 'ok') },
        { label: 'size="md" を渡す', onclick: (ctx) => go(ctx, 'md', 'size="md" を渡した → md で表示', 'ok') },
        { label: '渡さない', onclick: (ctx) => go(ctx, null, '渡していない（undefined）→ 既定値の \'md\' が使われた ✓', 'warn') },
        { label: '⟲ 最初から', onclick: (ctx) => { s3State.size = 'sm'; ctx.reset(); } },
      ],
      without: { title: 'withDefaults で既定値', icon: '📦', tone: 'vue', file: 'SizeBadge.vue', lang: 'vue', src: S3(false), ui: s3UI(false), keys: { opt: ['size?: Size'], dflt: ["{ size: 'md' }"], tpl: [':class="size"'] }, show: ['size?: Size', "{ size: 'md' }", ':class="size"'] },
      with: { title: '分割代入の = で既定値', icon: '✂️', tone: 'react', file: 'SizeBadge.vue', lang: 'vue', src: S3(true), ui: s3UI(true), keys: { opt: ['size?: Size'], dflt: ["size = 'md'"], tpl: [':class="size"'] }, show: ["size = 'md'", ':class="size"'] },
    });
    el.append(h('div', { class: 'vxP' }, vs,
      h('div', { class: 'vxP-why' }, h('code', 'size?: Size'), ' の ', h('code', '?'), ' は「省略してよい」。省略すると ', h('code', 'undefined'), ' になるので、既定値を決めておく。'),
      h('div', { class: 'vxP-ver' },
        h('div', { class: 'ok' }, h('b', '✓ 分割代入の ='), 'Vue 3.5 以上。短い。'),
        h('div', {}, h('b', { style: { color: 'var(--vue)' } }, '📦 withDefaults'), 'Vue 3.4 以下でも使える。分割代入と、一緒には使わない。'))));
  }

  /* ================= 4. 落とし穴：分割代入とリアクティブ ================= */
  const runJS = (fn, args) => { try { return { v: fn(...args) }; } catch (e) { return { err: e }; } };
  const show = (v) => (typeof v === 'string' ? "'" + v + "'" : String(v));
  function scene4(el) {
    const P = [
      { tab: '① コピーされる', ver: ['JavaScript の基本'], soon: [],
        say: '分割代入は、そのときの値を取り出す（コピー）。あとで元が変わっても、取り出した値は変わらない。',
        bad: { file: '✖ 取り出して使う', src: ['const lawyer = { fee: 5500 }', 'const { fee } = lawyer', 'lawyer.fee = 6600'] },
        good: { file: '✓ そのつど読む', src: ['const lawyer = { fee: 5500 }', 'lawyer.fee = 6600', 'lawyer.fee'] },
        keys: { bad: ['const { fee }'], good: ['lawyer.fee'] },
        runBad: () => { const lawyer = { fee: 5500 }; const { fee } = lawyer; lawyer.fee = 6600; return { rows: [['fee  →  ' + fee, 'e'], ['lawyer.fee は ' + lawyer.fee + ' に変わったのに…', 'mute']], ok: false }; },
        runGood: () => { const lawyer = { fee: 5500 }; lawyer.fee = 6600; return { rows: [['lawyer.fee  →  ' + lawyer.fee, 'g'], ['読む時点の値が出る', 'mute']], ok: true }; },
        vb: '古いまま', vg: 'ちゃんと更新される' },
      { tab: '② props から取り出す', ver: ['Vue 3.4 以前の書き方'], soon: ['toRefs'],
        say: 'const { title } = props は、ただのコピー。props のまま読むか、toRefs で「つながった ref」にする。',
        bad: { file: '✖ 3.4 の書き方', src: ['const props = defineProps<{ title: string }>()', 'const { title } = props'] },
        good: { file: '✓ toRefs でつなぐ', src: ['const props = defineProps<{ title: string }>()', 'const { title } = toRefs(props)'] },
        keys: { bad: ['const { title } = props'], good: ['toRefs(props)'] },
        runBad: () => { const props = { title: '初回相談' }; const { title } = props; props.title = '離婚相談'; return { rows: [['title  →  ' + show(title), 'e'], ['親は ' + show(props.title) + ' に変えた', 'mute']], ok: false }; },
        runGood: () => { const props = { title: '初回相談' }; const toRefs = (o) => Object.fromEntries(Object.keys(o).map((k) => [k, { get value() { return o[k]; } }])); const { title } = toRefs(props); props.title = '離婚相談'; return { rows: [['title.value  →  ' + show(title.value), 'g'], ['.value で、最新の props につながっている', 'mute']], ok: true }; },
        vb: '古いまま', vg: 'ちゃんと更新される' },
      { tab: '③ watch に渡す', ver: ['Vue 3.5 以上'], soon: ['watch'],
        say: '分割代入した title を watch(title) に渡すと、「値」を渡しただけ。変化を追う側には、() => title（getter）を渡す。関数に渡すときも同じ。',
        bad: { file: '✖ 値を渡す', src: ['const { title } = defineProps<{ title: string }>()', 'watch(title, (v) => search(v))'] },
        good: { file: '✓ getter を渡す', src: ['const { title } = defineProps<{ title: string }>()', 'watch(() => title, (v) => search(v))'] },
        keys: { bad: ['watch(title'], good: ['watch(() => title'] },
        runBad: () => { try { const props = { title: '初回相談' }; const watch = (src) => { if (typeof src !== 'function') throw new Error('title は props の「値」。watch には () => title を渡す'); }; watch(props.title); return { rows: [], ok: true }; } catch (e) { return { rows: [['エラー：' + e.message, 'e'], ['変化を追えないので、止められる', 'mute']], ok: false }; } },
        runGood: () => { const props = { title: '初回相談' }; const calls = []; const watchMock = (src, cb) => { let old = src(); return () => { const n = src(); if (n !== old) { cb(n); old = n; } }; }; const tick = watchMock(() => props.title, (v) => calls.push(v)); props.title = '離婚相談'; tick(); return { rows: [['search(' + show(calls[0]) + ') が呼ばれた', 'g'], ['title の変化を追えている', 'mute']], ok: true }; },
        vb: 'エラー', vg: 'ちゃんと更新される' },
      { tab: '④ 書き換える', ver: ['Vue 3.5 以上'], soon: [],
        say: 'props は読み取り専用。子が書き換えるのではなく、emit で親にお願いする。',
        bad: { file: '✖ 子が書き換える', src: ['const { title } = defineProps<{ title: string }>()', "const rename = () => { title = '別の相談' }"] },
        good: { file: '✓ 親にお願いする', src: ['const { title } = defineProps<{ title: string }>()', 'const emit = defineEmits<{ rename: [title: string] }>()', "const rename = () => emit('rename', '別の相談')"] },
        keys: { bad: ["title = '別の相談'"], good: ["emit('rename'"] },
        runBad: () => ({ rows: [['エラー：title は props。読み取り専用で、書き換えられない', 'e'], ['（Vue 3.5 では、書いた時点でビルドエラー）', 'mute']], ok: false }),
        runGood: () => ({ rows: [["親へ：rename('別の相談')", 'g'], ['親が自分の title を変える → 子に届く', 'mute']], ok: true }),
        vb: '書き換えられない', vg: '親が更新する' },
    ];
    let cur = 0;
    const tabs = h('div', { class: 'vxP-tabs' }), say = h('div', { class: 'vxP-why' }), meta = h('div', { class: 'vxP-tagrow' }), grid = h('div', { class: 'vxP-two' });
    P.forEach((p, i) => tabs.append(tabBtn(p.tab, () => { cur = i; draw(); })));
    function draw() {
      const p = P[cur];
      [...tabs.children].forEach((b, i) => b.classList.toggle('on', i === cur));
      say.textContent = p.say;
      meta.replaceChildren(...p.ver.map((v) => h('span', v)), ...p.soon.map((s) => h('span', { class: 'soon' }, s + '：あとで習う')));
      const preB = mkPre(p.bad.src, 'ts', p.bad.file, BAD, false), preG = mkPre(p.good.src, 'ts', p.good.file, OK, false);
      const oB = h('div', { class: 'vxP-out', 'data-k': 'bad' }), oG = h('div', { class: 'vxP-out', 'data-k': 'good' });
      const vB = h('div', { class: 'vxP-verdict bad' }), vG = h('div', { class: 'vxP-verdict ok' });
      const put = (box, vd, r, txt) => { box.replaceChildren(...r.rows.map(([t, c]) => h('div', { class: c || '' }, t))); vd.textContent = txt; bump(box); };
      const exec1 = () => { put(oB, vB, p.runBad(), '✖ ' + p.vb); put(oG, vG, p.runGood(), '✓ ' + p.vg); };
      grid.replaceChildren(h('div', { class: 'vxP-box no' }, h('div', { class: 'vxP-tt' }, '✖ こう書くと'), preB, oB, vB), h('div', { class: 'vxP-box yes' }, h('div', { class: 'vxP-tt' }, '✓ こう直す'), preG, oG, vG));
      link(grid, [preB, preG], { bad: [p.keys.bad, []], good: [[], p.keys.good] });
      exec1();
      bar.replaceChildren(btn('▶ もう一度、親が値を変える', exec1, 'primary'), say);
    }
    const bar = h('div', { class: 'vxP-bar' });
    el.append(h('div', { class: 'vxP' }, tabs, meta, bar, grid));
    draw();
  }

  /* ================= 5. defineModel の書き方 ================= */
  function scene5(el) {
    const st = { name: '山田 太郎', people: 2, trim: true, bound: true, opt: 'required', raw: '' };
    const TABS = [
      { id: 'basic', tab: '基本' }, { id: 'opt', tab: 'required / default' }, { id: 'named', tab: '名前つき' }, { id: 'mod', tab: '修飾子 .trim' }, { id: 'long', tab: '長い書き方と比べる' },
    ];
    const CHILD = {
      basic: ['const model = defineModel<string>()', '', '<input v-model="model" />'],
      required: ['const model = defineModel<string>({ required: true })', '', '<input v-model="model" />'],
      default: ["const model = defineModel<string>({ default: '' })", '', '<input v-model="model" />'],
      named: ["const count = defineModel<number>('count')", '', '<button @click="count--">−</button>', '<b>{{ count }}</b>', '<button @click="count++">＋</button>'],
      mod: ['const [model, modifiers] = defineModel<string>({', '  set(v) {', '    return modifiers.trim ? v.trim() : v', '  },', '})', '', '<input v-model="model" />'],
      short: ['const model = defineModel<string>()', '', '<input v-model="model" />'],
      long: ['const props = defineProps<{ modelValue: string }>()', 'const emit = defineEmits<{', "  'update:modelValue': [value: string]", '}>()', '', 'const onInput = (e: Event): void => {', "  emit('update:modelValue', (e.target as HTMLInputElement).value)", '}', '', '<input :value="props.modelValue" @input="onInput" />'],
    };
    const PARENT = (id) => id === 'named' ? ['const people = ref<number>(2)', '', '<PeopleInput v-model:count="people" />'] : id === 'mod' ? ["const name = ref<string>('山田 太郎')", '', '<NameInput v-model.trim="name" />'] : ["const name = ref<string>('山田 太郎')", '', '<NameInput v-model="name" />'];
    let cur = 'basic', tok = 0;
    const tabs = h('div', { class: 'vxP-tabs' }), body = h('div', { class: 'vxP-5' }); const say = h('div', { class: 'vxP-say' });
    TABS.forEach((t) => tabs.append(tabBtn(t.tab, () => { cur = t.id; draw(); })));
    const SAY = { basic: '子は defineModel 1 行。親は v-model だけ。', opt: '必須にするか、親が渡さないときの初期値を決める。', named: '名前をつけると、1 つの部品に v-model が複数つく（v-model:count）。', mod: '親が付けた .trim などは、modifiers から読める。', long: '同じ動きを props + emit で書くと、こんなに長い。' };

    function draw() {
      tok++;
      const id = cur, isNum = id === 'named', isLong = id === 'long';
      [...tabs.children].forEach((b, i) => b.classList.toggle('on', TABS[i].id === id));
      say.replaceChildren('📖 ', h('b', SAY[id]));
      const childKey = id === 'opt' ? st.opt : isLong ? 'long' : id;
      const pPre = mkPre(PARENT(id), 'vue', '親：ConsultPage.vue', '#5b9dff', false);
      const cPre = mkPre(CHILD[childKey], 'vue', isNum ? '子：PeopleInput.vue' : '子：NameInput.vue', VUE, false);
      const shortPre = isLong ? mkPre(CHILD.short, 'vue', '子：defineModel だと', OK, false) : null;
      /* デモ */
      const pv = h('div', { class: 'vxP-val', 'data-k': 'val' });
      const pbtn = h('button', { class: 'mini', type: 'button', onclick: () => parentSet() }, isNum ? '親が 5 人にする' : '親が「佐藤 花子」にする');
      const bindTag = h('code', { 'data-k': 'bind', style: { font: '800 .8rem var(--mono)', color: '#7b3fd1' } });
      const warn = h('div', { class: 'vxP-warn', style: { display: 'none' } });
      const parentNode = h('div', { class: 'vxP-node' }, h('b', 'ParentPage'), h('small', isNum ? 'people' : 'name'), pv, bindTag, pbtn);
      const input = h('input', { type: 'text', 'data-k': 'model', oninput: () => childSet(input.value) });
      const num = h('b'), stp = h('div', { class: 'vxP-stp', 'data-k': 'model' }, h('button', { type: 'button', onclick: () => childSet(Math.max(0, st.people - 1)) }, '−'), num, h('button', { type: 'button', onclick: () => childSet(st.people + 1) }, '＋'));
      const spaces = h('button', { class: 'mini', type: 'button', onclick: () => { input.value = '  山田 太郎  '; childSet(input.value); } }, '空白つきで入力する');
      const modBadge = h('div', { class: 'vxP-warn ok', 'data-k': 'mods' });
      const childNode = h('div', { class: 'vxP-node child' }, h('b', isNum ? 'PeopleInput' : 'NameInput'), isNum ? stp : input, id === 'mod' ? [spaces, modBadge] : null, warn);
      const lane1 = h('span', { 'data-k': 'prop' }, '↓'), lane2 = h('span', { 'data-k': 'emit' }, '↑');
      const lanes = h('div', { class: 'vxP-lanes' }, h('div', { class: 'l1' }, lane1, h('small', isLong ? 'props' : '値')), h('div', { class: 'l2' }, lane2, h('small', isLong ? 'emit' : '更新')));
      lane1.textContent = '→'; lane2.textContent = '←';
      const demo = h('div', { class: 'vxP-demo' }, parentNode, lanes, childNode);
      const extra = h('div', { class: 'vxP-mini' });
      if (id === 'opt') { extra.append(tabBtn('required: true', () => { st.opt = 'required'; draw(); }, st.opt === 'required' ? 'on' : ''), tabBtn("default: ''", () => { st.opt = 'default'; draw(); }, st.opt === 'default' ? 'on' : ''), tabBtn(st.bound ? '親が v-model を付けている' : '親が v-model を付けていない', () => { st.bound = !st.bound; draw(); }, st.bound ? '' : 'x on')); }
      if (id === 'mod') extra.append(tabBtn(st.trim ? '親が .trim を付けている' : '親が .trim を付けていない', () => { st.trim = !st.trim; draw(); }, st.trim ? 'on' : 'x on'));
      const stage = h('div', { class: 'vxP-stage' }, demo, extra);
      const left = h('div', { class: 'vxP-code' }, isLong ? [cPre, shortPre] : [pPre, cPre]);
      body.replaceChildren(left, stage);
      const bound = id !== 'opt' || st.bound;
      const paint = () => {
        const bq = (s) => '"' + s + '"';
        pv.textContent = isNum ? String(st.people) : (id === 'mod' ? bq(st.name) : st.name);
        num.textContent = st.people; if (document.activeElement !== input) input.value = st.name;
        bindTag.textContent = isNum ? 'v-model:count="people"' : !bound ? '（v-model なし）' : id === 'mod' && st.trim ? 'v-model.trim="name"' : 'v-model="name"';
        if (id === 'mod') modBadge.textContent = 'modifiers.trim = ' + (st.trim ? 'true' : 'false');
        if (id === 'opt') { warn.style.display = bound ? 'none' : ''; warn.className = 'vxP-warn ' + (st.opt === 'required' ? 'bad' : 'ok'); warn.textContent = st.opt === 'required' ? "⚠ 必須なのに、親が渡していない（警告）" : "default: '' で動く（親には届かない）"; }
      };
      paint();
      const trim = id === 'mod' && st.trim;
      async function childSet(v) {
        if (isNum) { if (!bound) return; const my = tok; await fly(stage, childNode, parentNode, String(v), '#2fd4a4'); if (my !== tok) return; st.people = v; paint(); bump(pv); return; }
        const sent = trim ? String(v).trim() : v;
        if (!bound) return;
        const my = tok; await fly(stage, input, parentNode, JSON.stringify(sent), '#2fd4a4'); if (my !== tok) return;
        st.name = sent; paint(); bump(pv);
      }
      async function parentSet() {
        const my = tok, v = isNum ? 5 : '佐藤 花子';
        if (!bound) { bump(pv); return; }
        await fly(stage, parentNode, childNode, String(v), '#5b9dff'); if (my !== tok) return;
        if (isNum) st.people = v; else st.name = v; paint(); bump(childNode);
      }
      const map = isLong
        ? { val: [['modelValue'], ['defineModel']], prop: [['defineProps', 'props.modelValue'], ['defineModel']], emit: [['defineEmits', "emit('update:modelValue'", 'onInput'], ['defineModel']], model: [['<input'], ['<input']], bind: [[], []], mods: [[], []] }
        : { val: [['const name', 'const people'], []], bind: [['v-model'], []], model: [[], ['defineModel', '<input', '<button', '<b>']], prop: [[], ['defineModel']], emit: [[], ['defineModel']], mods: [[], ['modifiers']] };
      link(body, isLong ? [cPre, shortPre] : [pPre, cPre], map);
    }
    el.append(h('div', { class: 'vxP' }, tabs, h('div', { class: 'vxP-bar' }, say), body));
    draw();
  }

  /* ================= 6. まとめ：どれを使う？ ================= */
  function scene6(el) {
    let v35 = true;
    const CARDS = [
      { q: 'props を、読むだけ', n: (v) => v ? ['Vue 3.5 以上：', h('code', 'props.'), ' なしで読める'] : ['Vue 3.4 以下：script では ', h('code', 'props.title'), ' と書く'],
        src: (v) => v ? ['const { title, done } = defineProps<{', '  title: string', '  done: boolean', '}>()'] : ['const props = defineProps<{', '  title: string', '  done: boolean', '}>()'] },
      { q: '省略できる props に、既定値', n: (v) => v ? ['分割代入の ', h('code', '='), ' が短い'] : [h('code', 'withDefaults'), ' で既定値を決める'],
        src: (v) => v ? ["const { size = 'md' } = defineProps<{ size?: Size }>()"] : ['const props = withDefaults(', '  defineProps<{ size?: Size }>(),', "  { size: 'md' },", ')'] },
      { q: '親と子で、値を行き来させる（双方向）', n: () => ['props + emit の代わりに、これ 1 行（Vue 3.4 以上）'],
        src: () => ['const model = defineModel<string>()', '', '<NameInput v-model="name" />'] },
      { q: '迷ったら', n: () => ['どの版でも動く。', h('code', 'watch'), ' や関数に渡すなら ', h('code', '() => props.title')],
        src: () => ['const props = defineProps<{ title: string }>()', '', 'watch(() => props.title, (v) => search(v))'] },
    ];
    const grid = h('div', { class: 'vxP-grid' }), tg = h('div', { class: 'vxP-tabs' });
    const draw = () => {
      [...tg.children].forEach((b, i) => b.classList.toggle('on', (i === 0) === v35));
      grid.replaceChildren(...CARDS.map((c, i) => h('div', { class: 'vxP-card' }, h('div', { class: 'q' }, h('i', String(i + 1)), c.q), mkPre(c.src(v35), 'ts', i === 2 ? 'NameInput.vue' : i === 3 ? 'BookingCard.vue' : 'BookingCard.vue', i === 2 ? OK : VUE, false), h('div', { class: 'n' }, ...c.n(v35)))));
    };
    tg.append(tabBtn('自分のプロジェクトは Vue 3.5 以上', () => { v35 = true; draw(); }), tabBtn('Vue 3.4 以下', () => { v35 = false; draw(); }));
    el.append(h('div', { class: 'vxP' }, h('div', { class: 'vxP-bar' }, tg, h('div', { class: 'vxP-say' }, '🔍 まず ', h('code', 'package.json'), ' の vue の版を見る')), grid));
    draw();
  }

  reg({
    id: 'x-vue-props', title: 'defineProps と defineModel の書き方', sub: '分割代入で必要なものだけ取り出す', emoji: '🎛️',
    meta: { cat: 'vue', day: '4日目', when: 'props を受け取るとき、const props = と const { … } = の違いが気になったら', mins: 15, order: 36, level: '基礎', after: 'vue-comp', why: 'props や v-model を、短く安全に書くための基礎。分割代入を知らないと読めない' },
    scenes: [
      { t: '分割代入：必要なキーだけ取り出す', tag: 'DESTRUCTURING', lead: '<b>分割代入</b>（デストラクチャリング）は、オブジェクトや配列から<b>必要なものだけ</b>を変数に取り出す書き方。', render: scene1 },
      { t: 'defineProps の2通りの書き方', tag: 'defineProps', lead: '<b>props を受け取る</b>書き方は 2 通り。<b>分割代入</b>は Vue 3.5 以上で、<b>props.</b> が要らなくなる。', render: scene2 },
      { t: 'デフォルト値と省略できる props', tag: 'DEFAULT', lead: '<b>省略できる props</b>（<b>?</b>）には、<b>既定値</b>を決めておく。', render: scene3 },
      { t: '落とし穴：分割代入とリアクティブ', tag: 'PITFALLS', lead: '分割代入は<b>値のコピー</b>。<b>watch</b> や関数に渡すときは、<b>getter</b>（() =&gt; …）を渡す。', render: scene4 },
      { t: 'defineModel の書き方', tag: 'defineModel', lead: '<b>defineModel</b> は、<b>v-model</b> を受ける部品の<b>値の出し入れ</b>を 1 行で書く。', render: scene5 },
      { t: 'まとめ：どれを使う？', tag: 'SUMMARY', lead: '<b>読むだけ</b>は分割代入、<b>双方向</b>は defineModel。<b>迷ったら props.</b> を付ける。', render: scene6 },
    ],
  });
})();
