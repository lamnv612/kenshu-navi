/* 補足 Vue：store と eventBus（x-vue-store）
   x-vue-state「誰が誰に話しかける？」の続き。あちらは「3方式の比較」、こちらは store と eventBus を 1 つずつ深く。
   1) 離れた部品どうし、どう話す？（ツリー＋パケット＋ホップ数）  2) store：みんなで共有する置き場（K.tsAnatBuild ＋ ライブデモ）
   3) store を使うときのコード（K.vs.versus）  4) eventBus：離れた部品に、合図だけ送る（連絡係の図 → 自作の型付き bus ＋ デモ。mitt は小さな注記のみ）
   5) バスの落とし穴（✖/✓ タブ）  6) store と eventBus、どっち？（仕分け） */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.W || !K.vs || !K.tsAnatBuild) return;
  const { h, code, style, sleep } = K.W;
  const reg = (o) => K.reg(Object.assign({ track: 'extra' }, o));
  const COLS = ['#ff6b9d', '#5b9dff', '#ffb454', '#2fd4a4', '#a98bff', '#ff8a5b', '#4fd1e8', '#e5d05b'];
  const BLUE = '#5b9dff', GREEN = '#2fd4a4', GOLD = '#ffb454', PINK = '#ff6b9d', VIOLET = '#a98bff', ORANGE = '#ff8a5b', TEAL = '#4fd1e8';
  const BAD = 'var(--bad)', OK = 'var(--ok)', VUE = 'var(--vue)';

  style('vxS', `
  .vxS{display:grid;gap:14px;min-width:0}
  .vxS-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:stretch}
  .vxS-bar .btn{height:42px;padding:0 1.1em;font-size:.9rem}
  .vxS-tab{all:unset;cursor:pointer;padding:.45em 1em;border-radius:99px;border:2px solid var(--line);background:var(--card2);font:800 .88rem var(--font);transition:.2s;display:inline-flex;align-items:center;gap:6px}
  .vxS-tab:hover{border-color:var(--c,var(--vue))}.vxS-tab.on{background:var(--c,var(--vue));border-color:var(--c,var(--vue));color:#06101f}
  .vxS-tab.x.on{background:var(--bad);border-color:var(--bad)}.vxS-tab[disabled]{opacity:.5;cursor:default}
  .vxS-sep{align-self:center;width:2px;height:26px;background:var(--line);border-radius:2px}
  .vxS-say{flex:1;min-width:220px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-height:42px;padding:6px 14px;border-radius:12px;border:2px solid var(--line);background:var(--card);font:800 .9rem/1.55 var(--font);transition:.25s}
  .vxS-say.bad{border-color:var(--bad);color:var(--bad)}.vxS-say.ok{border-color:var(--ok);color:var(--ok)}.vxS-say.warn{border-color:var(--team);color:var(--team)}
  .vxS code,.vxS-say code{font:800 .85rem var(--mono);color:var(--vue)}
  .vxS-two{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:14px;align-items:stretch}
  @media(max-width:980px){.vxS-two{grid-template-columns:1fr}}
  .vxS-box{border:2px solid var(--line);border-radius:14px;background:var(--card);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}
  .vxS-box.no{border-color:color-mix(in srgb,var(--bad) 55%,var(--line))}.vxS-box.yes{border-color:color-mix(in srgb,var(--ok) 55%,var(--line))}
  .vxS-tt{font:900 .95rem var(--font);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .vxS-box.no>.vxS-tt{color:var(--bad)}.vxS-box.yes>.vxS-tt{color:var(--ok)}
  .vxS-col{display:flex;flex-direction:column;gap:10px;min-width:0}
  .vxS-col>pre.code,.vxS-box>pre.code{margin:0;font-size:.85rem}
  .vxS-grow{flex:1 1 auto}
  .vxS-stage{position:relative;border-radius:12px;background:#f4f6fb;color:#1f2a44;padding:14px;min-width:0;display:flex;flex-direction:column;gap:12px}
  .vxS-box>.vxS-stage{flex:1 1 auto}
  .vxS-stage small{font:800 .8rem var(--font);color:#5b6788}
  .vxS-pkt{position:absolute;left:0;top:0;z-index:9;padding:.2em .8em;border-radius:99px;color:#06101f;font:900 .8rem var(--mono);box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap}
  .vxS-bump{animation:vxSb .7s}@keyframes vxSb{30%{transform:scale(1.12);box-shadow:0 0 0 6px color-mix(in srgb,var(--ok) 45%,transparent)}}
  .vxS-shake{animation:vxSs .5s}@keyframes vxSs{20%{transform:translateX(-5px)}50%{transform:translateX(5px)}80%{transform:translateX(-3px)}}
  .vxS [data-k]{cursor:default;border-radius:10px;transition:outline-color .15s,background .15s}
  .vxS [data-k].vxS-hot{outline:3px solid var(--c,#2f7bff);outline-offset:2px;box-shadow:0 0 0 6px color-mix(in srgb,var(--c,#2f7bff) 22%,transparent)}
  .vxS-chip{display:inline-flex;align-items:center;gap:6px;padding:.15em .75em;border-radius:99px;background:#fff;border:2px solid #b9c4e2;font:900 .8rem var(--mono);color:#1f2a44;white-space:nowrap}
  .vxS-chip.hot{background:#ffe9b8;border-color:#ffb454}
  .vxS-note{font:800 .85rem/1.6 var(--font);padding:.5em .9em;border-radius:10px;background:color-mix(in srgb,var(--team) 12%,var(--card));border-left:5px solid var(--team)}
  .vxS-note.soon{font-size:.8rem}
  .vxS-soon{display:inline-block;align-self:flex-start;font:900 .8rem var(--font);padding:.05em .7em;border-radius:99px;background:#ffb454;color:#06101f}
  .vxS-tree{border-radius:10px;background:var(--card2);border:1px solid var(--line);padding:8px 10px;display:grid;gap:2px;font:700 .8rem var(--mono);align-content:start}
  .vxS-tr{display:flex;gap:6px;align-items:center;padding:1px 6px;border-radius:6px;white-space:nowrap}
  .vxS-tr small{color:var(--mute);font:700 .8rem var(--font)}
  .vxS-tr.hit{background:color-mix(in srgb,var(--vue) 22%,transparent);outline:1px solid var(--vue)}
  /* 1 */
  .vxS-tr1{position:relative;flex:1 1 auto;min-height:430px;padding:0;overflow:hidden}
  .vxS-tr1 svg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
  .vxS-tr1 svg line{stroke:#c3cbe6;stroke-width:2;vector-effect:non-scaling-stroke}
  .vxS-tr1 svg polyline{fill:none;stroke-width:3;stroke-dasharray:7 6;vector-effect:non-scaling-stroke;opacity:.95}
  .vxS-nd{position:absolute;transform:translate(-50%,-50%);z-index:2;padding:.3em .75em;border-radius:10px;border:2px solid #b9c4e2;background:#fff;font:800 .85rem var(--mono);white-space:nowrap;transition:.25s;cursor:default;display:flex;gap:6px;align-items:center}
  .vxS-nd.hit{background:#e3f8f0;border-color:#2fd4a4;transform:translate(-50%,-50%) scale(1.1)}
  .vxS-nd.touched{border-color:#2f6df0;background:#e8f0ff}.vxS-nd.relay{border-color:#ffb454;background:#fff1d6}
  .vxS-nd.hub{border-style:dashed;border-width:3px;border-radius:14px;padding:.45em 1em}
  .vxS-nd .tg{font:900 .8rem var(--font);color:#b86a00}
  .vxS-hop{font:900 2.4rem/1 var(--mono);color:var(--vue);min-width:1.2em;text-align:center}
  .vxS-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
  .vxS-stat{border:2px solid var(--line);border-radius:12px;padding:8px 10px;background:var(--card);display:grid;gap:2px;font:800 .8rem/1.5 var(--font);transition:.2s}
  .vxS-stat b{font:900 .9rem var(--font)}.vxS-stat.on{border-color:var(--c);background:color-mix(in srgb,var(--c) 14%,var(--card))}
  .vxS-stat span em{font:900 1.05rem var(--mono);font-style:normal;color:var(--c)}
  .vxS-path{font:800 .8rem var(--mono);color:var(--mute);min-height:1.5em}
  /* 2 */
  .vxS-s2{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.5fr) minmax(0,.9fr);gap:14px;align-items:stretch}
  @media(max-width:980px){.vxS-s2{grid-template-columns:1fr}}
  .vxS-comp{border:3px solid #b9c4e2;border-radius:12px;background:#fff;padding:10px;display:flex;flex-direction:column;gap:8px;min-width:0}
  .vxS-comp>b{font:900 .85rem var(--mono);color:#2f6df0}
  .vxS-store{border:3px dashed #2fd4a4;border-radius:14px;background:#effaf6;padding:10px;display:flex;flex-direction:column;gap:8px;min-width:0}
  .vxS-store>b{font:900 .85rem var(--mono);color:#127a5c}
  .vxS-items{display:grid;gap:4px;padding:6px;border-radius:10px;background:#fff;border:2px solid #b9c4e2}
  .vxS-it{display:flex;gap:8px;align-items:center;font:800 .8rem var(--font);padding:.15em .5em;border-radius:8px;background:#f1f4fc;transition:.3s}
  .vxS-it i{font-style:normal;margin-left:auto;font:900 .8rem var(--mono);color:#e5484d}.vxS-it.read{opacity:.55}.vxS-it.read i{color:#127a5c}
  .vxS-getter{display:flex;gap:8px;align-items:center;padding:.3em .7em;border-radius:10px;background:#fff;border:2px solid #ffb454;font:800 .8rem var(--mono)}
  .vxS-getter em{font:900 1.1rem var(--mono);font-style:normal;color:#b86a00;margin-left:auto}
  .vxS-acts{display:flex;gap:6px;flex-wrap:wrap}
  .vxS-acts button{font:800 .8rem var(--mono);padding:.4em .8em;border-radius:9px;border:2px solid #2fd4a4;background:#fff;color:#0d5e47;cursor:pointer}
  .vxS-acts button:hover{background:#d3f5e8}
  .vxS-badge{display:inline-flex;align-items:center;gap:6px;width:fit-content;padding:.2em .9em;border-radius:99px;background:#e5484d;color:#fff;font:900 .9rem var(--mono);transition:.3s}
  .vxS-badge.zero{background:#9aa4c4}
  .vxS-bottom{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,3fr);gap:14px;align-items:stretch}
  @media(max-width:980px){.vxS-bottom{grid-template-columns:1fr}}
  /* 3 */
  .vxS-cmp{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px}
  @media(max-width:980px){.vxS-cmp{grid-template-columns:1fr}}
  .vxS-cc{display:flex;gap:10px;flex-wrap:wrap;align-items:center;padding:8px 12px;border-radius:12px;border:2px solid var(--line);background:var(--card);font:800 .85rem var(--font)}
  .vxS-cc.no{border-color:color-mix(in srgb,var(--bad) 55%,var(--line))}.vxS-cc.yes{border-color:color-mix(in srgb,var(--ok) 55%,var(--line))}
  .vxS-cc em{font:900 1.15rem var(--mono);font-style:normal}.vxS-cc.no em{color:var(--bad)}.vxS-cc.yes em{color:var(--ok)}
  .vxS-chain{display:flex;flex-direction:column;gap:6px;align-items:flex-start}
  .vxS-ch{padding:.25em .8em;border-radius:9px;border:2px solid #b9c4e2;background:#fff;font:800 .8rem var(--mono);transition:.25s;display:flex;gap:6px;align-items:center}
  .vxS-ch.hit{background:#e3f8f0;border-color:#2fd4a4}.vxS-ch.relay{border-color:#ffb454;background:#fff1d6}
  .vxS-ch .tg{font:900 .8rem var(--font);color:#b86a00}
  .vxS-two2{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:12px;align-items:start}
  .vxS-hops{font:900 .8rem var(--mono);color:#5b6788}
  .vxS-sr{display:grid;gap:10px}
  .vxS-srp{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:stretch}
  @media(max-width:980px){.vxS-srp{grid-template-columns:1fr}}
  .vxS-srp>div{display:flex;flex-direction:column;gap:8px;padding:10px;border-radius:12px;border:2px solid var(--line);background:var(--card)}
  .vxS-srp>div>pre.code{flex:1;margin:0;font-size:.85rem}
  .vxS-srp b{font:900 .85rem var(--font)}.vxS-srp .x b{color:var(--bad)}.vxS-srp .o b{color:var(--ok)}
  /* 4 */
  .vxS-s4{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.9fr) minmax(0,1fr);gap:18px;align-items:stretch;min-height:230px}
  @media(max-width:980px){.vxS-s4{grid-template-columns:1fr}}
  .vxS-send{display:flex;flex-direction:column;gap:10px;justify-content:center}
  .vxS-send .vxS-comp{align-items:flex-start}
  .vxS-btn{font:800 .85rem var(--font);padding:.45em 1em;border-radius:9px;border:2px solid #2f6df0;background:#eef2ff;color:#27407f;cursor:pointer}
  .vxS-btn:hover{background:#dbe5ff}.vxS-btn[disabled]{opacity:.5;cursor:default}
  .vxS-bus{display:flex;flex-direction:column;gap:8px;align-items:center;justify-content:center;border:3px dashed #ffb454;border-radius:14px;background:#fff7e6;padding:10px}
  .vxS-bus>b{font:900 .9rem var(--mono);color:#b86a00}
  .vxS-recv{min-height:2.6em;display:flex;align-items:center;padding:.4em .9em;border-radius:10px;background:#1f2a44;color:#fff;font:800 .85rem var(--font);transition:.3s}
  .vxS-recv.off{background:#e9edf8;color:#9aa4c4}
  .vxS-sw{display:inline-flex;gap:6px;align-items:center;font:800 .8rem var(--font);color:#1f2a44;cursor:pointer}
  .vxS-map{align-items:stretch;justify-content:flex-start;gap:8px}
  .vxS-mrow{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:10px;background:#fff;border:2px solid #f0d9a8;min-height:3em;transition:.3s}
  .vxS-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.vxS-chips small{font:800 .8rem var(--font);color:#9aa4c4}
  .vxS-arr{font:900 1rem var(--mono);color:#b86a00}
  .vxS-meth{border:2px solid var(--line);border-radius:12px;padding:8px 12px;background:var(--card);display:flex;gap:10px;align-items:center;flex-wrap:wrap}
  .vxS-meth code{font:900 .9rem var(--mono);color:var(--c)}.vxS-meth b{font:800 .85rem var(--font)}
  .vxS-contract{font:800 .85rem var(--font);color:var(--mute)}
  .vxS-ref{display:inline-block;font:800 .85rem var(--font);color:var(--vue);text-decoration:underline}
  .vxS-four{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-items:stretch}
  .vxS-four>pre.code{margin:0;font-size:.85rem}
  @media(max-width:980px){.vxS-four{grid-template-columns:1fr}}
  /* 5 */
  .vxS-5{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:14px;align-items:stretch}
  @media(max-width:980px){.vxS-5{grid-template-columns:1fr}}
  .vxS-nav{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .vxS-page{border:3px solid #b9c4e2;border-radius:12px;background:#fff;padding:10px;display:flex;flex-direction:column;gap:8px;min-height:7em}
  .vxS-page>b{font:900 .85rem var(--mono);color:#2f6df0}
  .vxS-logs{display:flex;flex-direction:column;gap:6px;min-height:5.2em}
  .vxS-lg{padding:.3em .8em;border-radius:9px;background:#1f2a44;color:#fff;font:800 .8rem var(--font);width:fit-content;animation:vxSin .35s}
  .vxS-lg.ghost{background:#fff;color:#e5484d;border:2px dashed #e5484d}
  @keyframes vxSin{from{opacity:0;transform:translateY(8px)}}
  .vxS-verdict{width:fit-content;padding:.2em 1em;border-radius:99px;font:900 .9rem var(--font);color:#06101f}
  .vxS-verdict.bad{background:#ff8a96}.vxS-verdict.ok{background:#2fd4a4}
  .vxS-row2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;align-items:stretch}
  .vxS-cnt{font:900 1.6rem var(--mono);color:#1f2a44}
  .vxS-err{background:#0b1020;color:#ff8a96;border-radius:10px;padding:8px 12px;font:700 .8rem/1.6 var(--mono);min-height:4.2em}
  .vxS-err.ok{color:#2fd4a4}.vxS-err .mute{color:#8892b8}
  .vxS-fl{animation:vxSf .8s}@keyframes vxSf{30%{background:#ffe9b8;border-color:#ffb454}}
  /* 6 */
  .vxS-6{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:14px;align-items:stretch}
  @media(max-width:980px){.vxS-6{grid-template-columns:1fr}}
  .vxS-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;align-content:start}
  @media(max-width:700px){.vxS-cards{grid-template-columns:1fr}}
  .vxS-card{border:2px solid var(--line);border-radius:12px;background:var(--card);padding:10px;display:flex;flex-direction:column;gap:8px;transition:.25s}
  .vxS-card.ok{border-color:var(--ok)}.vxS-card.ng{border-color:var(--bad)}
  .vxS-card>b{font:900 .9rem/1.5 var(--font)}
  .vxS-ch3{display:flex;gap:6px;flex-wrap:wrap}
  .vxS-ch3 button{all:unset;cursor:pointer;padding:.25em .7em;border-radius:99px;border:2px solid var(--line);background:var(--card2);font:800 .8rem var(--font);transition:.2s}
  .vxS-ch3 button:hover{border-color:var(--vue)}.vxS-ch3 button.ok{background:var(--ok);border-color:var(--ok);color:#06101f}.vxS-ch3 button.ng{background:var(--bad);border-color:var(--bad);color:#06101f}
  .vxS-ch3 button[disabled]{cursor:default}
  .vxS-rs{font:800 .8rem/1.55 var(--font);min-height:1.5em}.vxS-card.ok .vxS-rs{color:var(--ok)}.vxS-card.ng .vxS-rs{color:var(--bad)}
  .vxS-ladder{display:flex;flex-direction:column;gap:10px;height:100%}
  .vxS-step{border:2px solid var(--line);border-radius:12px;padding:10px 12px;background:var(--card);display:grid;gap:4px;transition:.3s;flex:1}
  .vxS-step b{font:900 .95rem var(--font)}.vxS-step small{font:800 .8rem var(--mono);color:var(--mute)}
  .vxS-step i{font-style:normal;display:inline-grid;place-items:center;width:1.6em;height:1.6em;border-radius:50%;background:var(--c);color:#06101f;font:900 .85rem var(--mono);margin-right:8px}
  .vxS-step.lit{border-color:var(--c);background:color-mix(in srgb,var(--c) 16%,var(--card))}
  .vxS-score{font:900 1rem var(--font);display:flex;gap:10px;align-items:center}.vxS-score em{font:900 1.6rem var(--mono);font-style:normal;color:var(--vue)}
  `);

  /* ---------- 共通の道具 ---------- */
  const mkPre = (lines, lang, file, color) => code(lines.join('\n'), lang || 'ts', { file, color: color || VUE, edit: false });
  const bump = (el) => { if (!el) return; el.classList.remove('vxS-bump'); void el.offsetWidth; el.classList.add('vxS-bump'); };
  const tabBtn = (label, on, fn, cls, col) => h('button', { class: 'vxS-tab' + (cls ? ' ' + cls : '') + (on ? ' on' : ''), type: 'button', style: col ? { '--c': col } : {}, onclick: fn }, label);
  const tree = (rows) => h('div', { class: 'vxS-tree' }, ...rows.map((r) => h('div', { class: 'vxS-tr' + (r.hit ? ' hit' : ''), 'data-k': r.k || null, style: { paddingLeft: (6 + r.d * 16) + 'px' } }, h('span', r.f ? '📄' : '📁'), h('span', r.n), r.note ? h('small', r.note) : null)));
  /* パケット：from → to へ飛ばす（host は position:relative）。アニメが止まっても詰まらない */
  async function fly(host, from, to, text, col, ms) {
    if (!host || !from || !to) return;
    const hr = host.getBoundingClientRect(), a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    const el = h('span', { class: 'vxS-pkt', style: { background: col || GREEN } }, text); host.append(el);
    const w = el.offsetWidth, hh = el.offsetHeight, pt = (r) => ({ x: r.left - hr.left + r.width / 2 - w / 2, y: r.top - hr.top + r.height / 2 - hh / 2 });
    const A = pt(a), B = pt(b), d = ms || 600;
    try {
      const an = el.animate([{ transform: `translate(${A.x}px,${A.y}px) scale(.6)`, opacity: 0 }, { transform: `translate(${A.x}px,${A.y}px) scale(1)`, opacity: 1, offset: .15 }, { transform: `translate(${B.x}px,${B.y}px) scale(1)`, opacity: 1, offset: .85 }, { transform: `translate(${B.x}px,${B.y}px) scale(.6)`, opacity: 0 }], { duration: d, easing: 'ease-in-out' });
      await Promise.race([an.finished, sleep(d + 250)]);
    } catch (e) { /* 途中で消えてもよい */ }
    el.remove();
  }
  /* カーソル（UI の data-k ⇄ コードの行）をつなぐ。map = { キー: [行番号…] } か { キー: [[pre0 の行], [pre1 の行]] }。set() で差し替え可 */
  function linker(root) {
    let pres = [], map = {}, keys = [];
    const colOf = (k) => COLS[Math.max(0, keys.indexOf(k)) % COLS.length];
    const on = (k) => {
      if (!map[k]) return; const c = colOf(k);
      pres.forEach((p, i) => { p.style.setProperty('--c', c); p.setHi(map[k][i] || [], 'on'); });
      root.querySelectorAll('[data-k]').forEach((n) => { const hit = n.getAttribute('data-k') === k; n.classList.toggle('vxS-hot', hit); if (hit) n.style.setProperty('--c', c); });
    };
    const off = () => { pres.forEach((p) => p.setHi([], 'on')); root.querySelectorAll('.vxS-hot').forEach((n) => n.classList.remove('vxS-hot')); };
    root.addEventListener('mouseenter', (e) => { const n = e.target && e.target.closest && e.target.closest('[data-k]'); if (n && root.contains(n)) on(n.getAttribute('data-k')); }, true);
    root.addEventListener('mouseleave', (e) => { const n = e.target && e.target.closest && e.target.closest('[data-k]'); if (n) off(); }, true);
    return {
      on, off,
      set(newPres, newMap) {
        pres = newPres; map = {}; Object.keys(newMap).forEach((k) => { const v = newMap[k]; map[k] = v.length && typeof v[0] === 'number' ? [v] : v; });
        keys = Object.keys(map);
        pres.forEach((p, pi) => p.lines.forEach((ln, li) => {
          ln.addEventListener('mouseenter', () => { const k = keys.find((kk) => (map[kk][pi] || []).includes(li + 1)); if (k) on(k); });
          ln.addEventListener('mouseleave', off);
        }));
      },
    };
  }
  /* 解剖（K.tsAnatBuild）⇄ デモ：パーツにカーソル → デモの部品が光る（逆も） */
  function bridge(anat, demo) {
    const hot = (k, col) => demo.querySelectorAll('[data-k]').forEach((n) => { const on = !!k && n.getAttribute('data-k') === k; n.classList.toggle('vxS-hot', on); if (on && col) n.style.setProperty('--c', col); });
    anat.addEventListener('mouseenter', () => setTimeout(() => { const b = anat.querySelector('.an-parts button.lit'); if (b) hot(b.dataset.k, b.style.getPropertyValue('--pc')); }, 0), true);
    anat.addEventListener('mouseleave', () => hot(null), true);
    demo.addEventListener('mouseenter', (e) => { const n = e.target && e.target.closest && e.target.closest('[data-k]'); if (!n) return; const b = anat.querySelector('.an-parts button[data-k="' + n.getAttribute('data-k') + '"]'); if (b) b.dispatchEvent(new Event('mouseenter')); }, true);
    demo.addEventListener('mouseleave', (e) => { const n = e.target && e.target.closest && e.target.closest('[data-k]'); if (!n) return; const bx = anat.querySelector('.an-box'); if (bx) bx.dispatchEvent(new Event('mouseleave')); }, true);
  }

  /* ================= 1. 離れた部品どうし、どう話す？ ================= */
  const POS = { App: [50, 9], Layout: [50, 29], Header: [16, 29], StatusBar: [83, 29], Sidebar: [34, 51], Main: [66, 51], CaseList: [66, 70], CaseCard: [66, 89], HUB: [28, 82] };
  const FILE = { App: 'src/App.vue', Layout: 'src/layouts/Layout.vue', Header: 'src/components/Header.vue', StatusBar: 'src/components/StatusBar.vue', Sidebar: 'src/components/Sidebar.vue', Main: 'src/components/Main.vue', CaseList: 'src/components/CaseList.vue', CaseCard: 'src/components/CaseCard.vue' };
  const PARENT = { Layout: 'App', Header: 'App', StatusBar: 'App', Sidebar: 'Layout', Main: 'Layout', CaseList: 'Main', CaseCard: 'CaseList' };
  const WAY = {
    props: { label: 'props / emit', col: BLUE, hub: null },
    store: { label: 'store（Pinia）', col: GREEN, hub: { n: 'Store', file: 'src/stores/notice.ts' } },
    bus: { label: 'eventBus', col: GOLD, hub: { n: 'eventBus', file: 'src/lib/eventBus.ts' } },
  };
  const pathOf = (way, t) => (way === 'props' ? ['CaseCard', 'CaseList', 'Main', 'Layout', 'App', t] : ['CaseCard', 'HUB', t]);
  const statsOf = (way, t) => { const p = pathOf(way, t); return { hops: p.length - 1, files: p.filter((n) => n !== 'HUB').length + (way === 'props' ? 0 : 1), relay: way === 'props' ? 3 : 0 }; };
  function codeOf(way, t) {
    const hd = t === 'Header';
    if (way === 'props') {
      return { lines: ['// CaseCard.vue', "emit('accepted')", '// CaseList.vue（中継）', '<CaseCard @accepted="emit(\'accepted\')" />', '// Main.vue（中継）', '<CaseList @accepted="emit(\'accepted\')" />', '// Layout.vue（中継）', '<Main @accepted="emit(\'accepted\')" />', '// App.vue', hd ? '<Layout @accepted="unread++" />' : '<Layout @accepted="done++" />', hd ? '<Header :unread="unread" />' : '<StatusBar :done="done" />', '// ' + t + '.vue', hd ? 'defineProps<{ unread: number }>()' : 'defineProps<{ done: number }>()'], map: { CaseCard: [2], CaseList: [4], Main: [6], Layout: [8], App: [10, 11], [t]: [13] } };
    }
    if (way === 'store') {
      return { lines: ['// CaseCard.vue', 'const notice = useNoticeStore()', "notice.push('承諾しました')", '// ' + t + '.vue', 'const notice = useNoticeStore()', hd ? '<span>{{ notice.unread }}</span>' : '<p>承諾 {{ notice.done }} 件</p>'], map: { CaseCard: [2, 3], [t]: [5, 6] } };
    }
    return { lines: ['// CaseCard.vue', "bus.emit('case:accepted', { id: 1 })", '// ' + t + '.vue', hd ? "bus.on('case:accepted', () => { unread.value++ })" : "bus.on('case:accepted', () => { done.value++ })"], map: { CaseCard: [2], [t]: [4] } };
  }
  function scene1(el) {
    let hubFile = '';
    const st = { way: 'props', target: 'Header', running: false, alive: true, hops: 0 };
    const stage = h('div', { class: 'vxS-stage vxS-tr1' });
    const nodes = {};
    const path = h('div', { class: 'vxS-path' });
    const svg = h('div');
    const badge = h('span', { class: 'vxS-chip' }, '通知 0');
    const done = h('span', { class: 'vxS-chip' }, '承諾 0');
    const mkNode = (n, extra) => { const e = h('div', { class: 'vxS-nd', 'data-k': n, style: { left: POS[n][0] + '%', top: POS[n][1] + '%' }, title: FILE[n] || '' }, n, extra || null); nodes[n] = e; stage.append(e); return e; };
    Object.keys(FILE).forEach((n) => mkNode(n, n === 'Header' ? badge : n === 'StatusBar' ? done : null));
    const hub = mkNode('HUB'); hub.classList.add('hub');
    const edges = Object.keys(PARENT).map((c) => `<line x1="${POS[PARENT[c]][0]}" y1="${POS[PARENT[c]][1]}" x2="${POS[c][0]}" y2="${POS[c][1]}"/>`).join('');
    const drawSvg = () => { const w = WAY[st.way], p = pathOf(st.way, st.target).map((n) => POS[n].join(',')).join(' '); svg.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><g>${edges}</g><polyline points="${p}" stroke="${w.col}"/></svg>`; stage.querySelectorAll('svg').forEach((s) => s.remove()); stage.prepend(svg.firstChild); };
    const hop = h('div', { class: 'vxS-hop' }, '0');
    const fileBar = h('span', { class: 'vxS-chip' }, '部品にカーソル → ファイルの場所');
    let pre = mkPre(['—'], 'vue', '', GREEN);
    const codeBox = h('div', { class: 'vxS-col vxS-grow' });
    const stats = h('div', { class: 'vxS-stats' });
    const L = linker(el);
    const mark = (cls) => Object.values(nodes).forEach((n) => n.classList.remove('hit', 'touched', 'relay'));
    function draw() {
      const w = WAY[st.way], cd = codeOf(st.way, st.target);
      hub.style.display = w.hub ? '' : 'none'; hub.title = w.hub ? w.hub.file : ''; hub.childNodes[0].textContent = w.hub ? w.hub.n : '';
      hub.style.borderColor = w.col; hub.style.background = st.way === 'bus' ? '#fff1d6' : '#e3f8f0';
      hubFile = w.hub ? w.hub.file : '';
      mark(); drawSvg();
      pre = mkPre(cd.lines, 'vue', st.way === 'props' ? 'どの部品を書き換える？' : (st.way === 'store' ? 'store を呼ぶだけ' : 'bus に送って聞くだけ'), w.col);
      codeBox.replaceChildren(pre); L.set([pre], cd.map);
      path.textContent = pathOf(st.way, st.target).map((n) => (n === 'HUB' ? w.hub.n : n)).join(' → ');
      stats.replaceChildren(...Object.keys(WAY).map((k) => { const s = statsOf(k, st.target); return h('div', { class: 'vxS-stat' + (k === st.way ? ' on' : ''), style: { '--c': WAY[k].col } }, h('b', WAY[k].label), h('span', h('em', s.hops), ' ホップ'), h('span', h('em', s.files), ' ファイル'), h('span', '中継 ', h('em', s.relay))); }));
      hop.textContent = '0';
    }
    async function run() {
      if (st.running) return; st.running = true; mark(); st.hops = 0; hop.textContent = '0';
      const w = WAY[st.way], p = pathOf(st.way, st.target);
      p.forEach((n, i) => { if (n === 'HUB') return; nodes[n].classList.add(st.way === 'props' && i > 0 && i < p.length - 1 && n !== 'App' ? 'relay' : 'touched'); });
      const txt = (i) => (st.way === 'props' ? (i === p.length - 1 ? 'props' : 'emit') : st.way === 'store' ? (i === 1 ? 'push()' : 'state') : (i === 1 ? 'emit' : 'on'));
      for (let i = 1; i < p.length; i++) {
        await fly(stage, nodes[p[i - 1]], nodes[p[i]], txt(i), w.col, 520);
        if (!st.alive) return;
        nodes[p[i]].classList.add('hit'); setTimeout(() => nodes[p[i]] && nodes[p[i]].classList.remove('hit'), 450);
        hop.textContent = String(++st.hops); bump(hop);
      }
      if (st.target === 'Header') { badge.textContent = '通知 ' + (++st.n1); bump(badge); } else { done.textContent = '承諾 ' + (++st.n2); bump(done); }
      st.running = false;
    }
    const wayTabs = Object.keys(WAY).map((k) => tabBtn(WAY[k].label, k === st.way, () => { if (st.running) return; st.way = k; wayTabs.forEach((b, i) => b.classList.toggle('on', Object.keys(WAY)[i] === k)); draw(); }, '', WAY[k].col));
    const tgTabs = [['Header', '🔔 Header のバッジ'], ['StatusBar', '📊 StatusBar の件数']].map(([k, l]) => tabBtn(l, k === st.target, () => { if (st.running) return; st.target = k; tgTabs.forEach((b, i) => b.classList.toggle('on', i === (k === 'Header' ? 0 : 1))); draw(); }, '', VIOLET));
    st.n1 = 0; st.n2 = 0;
    Object.keys(nodes).forEach((n) => nodes[n].addEventListener('mouseenter', () => { fileBar.textContent = '📄 ' + (n === 'HUB' ? hubFile : FILE[n]); }));
    const go = h('button', { class: 'btn primary', style: { '--c': 'var(--vue)' }, onclick: run }, '▶ CaseCard の「承諾する」を押す');
    el.append(h('div', { class: 'vxS' },
      h('div', { class: 'vxS-bar' }, ...wayTabs, h('span', { class: 'vxS-sep' }), ...tgTabs, go),
      h('div', { class: 'vxS-two' },
        h('div', { class: 'vxS-box' }, stage, h('div', { class: 'vxS-bar', style: { alignItems: 'center' } }, fileBar, path)),
        h('div', { class: 'vxS-col' }, h('div', { class: 'vxS-box', style: { flexDirection: 'row', alignItems: 'center' } }, h('b', { class: 'vxS-tt' }, 'ホップ数'), hop, h('span', { class: 'vxS-chip' }, '1 ホップ ＝ 部品を 1 つ通る')), h('div', { class: 'vxS-box vxS-grow' }, codeBox), stats))));
    draw();
    return () => { st.alive = false; };
  }

  /* ================= 2. store：みんなで共有する置き場 ================= */
  function scene2(el) {
    const T = (t, k) => [t, k ? [k] : []];
    const anat = K.tsAnatBuild({
      split: true, lang: 'ts', title: '🔍 store の部品（カーソルを乗せる）',
      tokens: [
        T("import { defineStore } from 'pinia'\nimport { ref, computed } from 'vue'", 'imp'), T('\n\nexport const '), T('useNoticeStore', 'name'), T(' = '), T('defineStore', 'def'), T('('), T("'notice'", 'id'), T(', () => {\n  '),
        T('const items = ref<Notice[]>([])', 'state'), T('\n  '),
        T('const unread = computed<number>(() =>\n    items.value.filter((n) => !n.read).length\n  )', 'getters'), T('\n\n  '),
        T('function markAllRead(): void {\n    items.value.forEach((n) => { n.read = true })\n  }', 'actions'), T('\n\n  '),
        T('return { items, unread, markAllRead }', 'ret'), T('\n})'),
      ],
      parts: {
        imp: ['import', GOLD, 'pinia の defineStore と、vue の ref / computed を取り込む。'],
        name: ['useNoticeStore', PINK, '使う側が呼ぶ名前。use○○Store と付けるのが約束。'],
        def: ['defineStore', BLUE, 'store を 1 つ作る関数。第 2 引数に「中身を作る関数」を渡す（setup store）。'],
        id: ["id：'notice'", VIOLET, 'store の名前。アプリの中で 1 つだけ。DevTools にもこの名前で出る。'],
        state: ['state（ref）', GREEN, '共有するデータ本体。どの部品から見ても同じ 1 つ。'],
        getters: ['getters（computed）', ORANGE, 'state から自動で計算する値。computed は「あとで習う」（vue-life）。'],
        actions: ['actions（function）', TEAL, 'state を書き換える関数。書き換えはここに集める。'],
        ret: ['return', '#e5d05b', '外へ見せるものを返す。返さないと、使う側から見えない。'],
      },
    });
    /* ---- ライブデモ ---- */
    const TITLES = ['期日のお知らせ', '書類の提出依頼', '面談日程の確認', '費用のお見積り', '和解案のご連絡', '次回期日の変更'];
    const S = { items: TITLES.slice(0, 3).map((t, i) => ({ id: i + 1, title: t, read: false })), next: 3, busy: false, alive: true };
    const unreadOf = () => S.items.filter((n) => !n.read).length;
    const hbadge = h('span', { class: 'vxS-badge' }, '🔔 3');
    const listEl = h('div', { class: 'vxS-items' });
    const sItems = h('div', { class: 'vxS-items' });
    const gv = h('em', '3');
    const cHead = h('div', { class: 'vxS-comp', 'data-k': 'getters' }, h('b', 'Header.vue'), hbadge, h('small', 'unread だけ読む'));
    const cList = h('div', { class: 'vxS-comp', 'data-k': 'state' }, h('b', 'NoticeList.vue'), listEl);
    const getter = h('div', { class: 'vxS-getter', 'data-k': 'getters' }, 'unread', h('span', { style: { color: '#7b86aa' } }, '← items から自動'), gv);
    const bPush = h('button', { type: 'button', 'data-k': 'actions', onclick: () => act('push') }, 'push()  届く');
    const bAll = h('button', { type: 'button', 'data-k': 'actions', onclick: () => act('all') }, 'markAllRead()');
    const bRst = h('button', { type: 'button', onclick: () => { S.items = TITLES.slice(0, 3).map((t, i) => ({ id: i + 1, title: t, read: false })); S.next = 3; paint(); } }, '⟲');
    const cStore = h('div', { class: 'vxS-store' }, h('b', 'useNoticeStore()'), h('div', { 'data-k': 'state' }, h('small', { style: { color: '#127a5c' } }, 'items（state）'), sItems), getter, h('div', { class: 'vxS-acts' }, bPush, bAll, bRst));
    const itemEl = (n) => h('div', { class: 'vxS-it' + (n.read ? ' read' : '') }, n.title, h('i', n.read ? '既読' : '未読'));
    const paint = () => {
      sItems.replaceChildren(...S.items.map(itemEl)); listEl.replaceChildren(...S.items.map(itemEl));
      const u = unreadOf(); gv.textContent = u; hbadge.textContent = '🔔 ' + u; hbadge.classList.toggle('zero', u === 0);
    };
    async function act(kind) {
      if (S.busy) return; S.busy = true;
      if (kind === 'push') { if (S.items.length >= 6) S.items = S.items.slice(0, 3); else S.items.push({ id: S.items.length + 1, title: TITLES[S.items.length], read: false }); }
      else S.items.forEach((n) => { n.read = true; });
      sItems.replaceChildren(...S.items.map(itemEl)); bump(cStore);
      await Promise.all([fly(stage, cStore, cHead, kind === 'push' ? 'unread' : 'unread 0', GOLD, 700), fly(stage, cStore, cList, 'items', GREEN, 700)]);
      if (!S.alive) return;
      paint(); bump(cHead); bump(cList); S.busy = false;
    }
    const stage = h('div', { class: 'vxS-stage vxS-s2', style: { position: 'relative' } }, cHead, cStore, cList);
    const filesTree = h('div', { class: 'vxS-col' }, h('div', { class: 'vxS-tt' }, '📂 フォルダ'), tree([
      { d: 0, n: 'src/' }, { d: 1, n: 'components/' }, { d: 2, n: 'Header.vue', f: 1, k: 'getters' }, { d: 2, n: 'NoticeList.vue', f: 1, k: 'state' }, { d: 1, n: 'stores/', hit: 1 }, { d: 2, n: 'notice.ts', f: 1, hit: 1, note: 'store はここ' },
    ]), h('small', { style: { color: 'var(--mute)', font: '800 .8rem var(--font)' } }, '2 つの部品は、互いを知らない。store だけを見ている。'));
    const demo = h('div', { class: 'vxS-bottom' }, h('div', { class: 'vxS-box' }, filesTree), h('div', { class: 'vxS-box' }, h('div', { class: 'vxS-tt' }, '▶ ボタンを押す → store が変わる → 読んでいる 2 つの部品が同時に変わる'), stage));
    paint();
    bridge(anat, demo);
    el.append(h('div', { class: 'vxS' }, anat, demo));
    return () => { S.alive = false; };
  }

  /* ================= 3. store を使うときのコード ================= */
  function scene3(el) {
    const FL = [
      { f: 'CaseCard.vue', l: ["const emit = defineEmits<{ accepted: [] }>()", '<button @click="emit(\'accepted\')">承諾する</button>'] },
      { f: 'CaseList.vue（中継）', l: ["const emit = defineEmits<{ accepted: [] }>()", '<CaseCard @accepted="emit(\'accepted\')" />'] },
      { f: 'Main.vue（中継）', l: ["const emit = defineEmits<{ accepted: [] }>()", '<CaseList @accepted="emit(\'accepted\')" />'] },
      { f: 'Layout.vue（中継）', l: ["const emit = defineEmits<{ accepted: [] }>()", '<Main @accepted="emit(\'accepted\')" />'] },
      { f: 'App.vue', l: ['const unread = ref<number>(0)', '<Layout @accepted="unread++" />', '<Header :unread="unread" />'] },
      { f: 'Header.vue', l: ['defineProps<{ unread: number }>()', '<span>{{ unread }}</span>'] },
    ];
    const FR = [
      { f: 'CaseCard.vue', l: ['const notice = useNoticeStore()', '<button @click="notice.push(\'承諾しました\')">承諾する</button>'] },
      { f: 'Header.vue', l: ['const notice = useNoticeStore()', '<span>{{ notice.unread }}</span>'] },
    ];
    const toSrc = (arr) => [].concat(...arr.map((x) => ['// ' + x.f].concat(x.l)));
    const cnt = (arr) => ({ files: arr.length, lines: arr.reduce((a, x) => a + x.l.length, 0), relay: arr.filter((x) => /中継/.test(x.f)).length });
    const cl = cnt(FL), cr = cnt(FR);
    const S = { alive: true, running: false };
    const left = { badge: null, chain: {} }, right = { badge: null, hub: null, n: 0, n2: 0 };
    const hl = h('span', { class: 'vxS-hops' }, 'ホップ 0'), hr = h('span', { class: 'vxS-hops' }, 'ホップ 0');
    const mk = (cls, k, label, extra) => h('div', { class: cls, 'data-k': k }, label, extra || null);
    const vs = K.vs.versus({
      banner: '承諾したら、ヘッダーの通知バッジを +1 したい。CaseCard と Header は遠い。',
      bar: [
        { label: '▶ 「承諾する」を押す', primary: true, onclick: (ctx) => run(ctx) },
        { label: '⟲ 最初から', onclick: (ctx) => ctx.reset() },
      ],
      without: {
        title: 'props / emit だけ：全員が中継する', file: '6 ファイル', lang: 'vue', src: toSrc(FL).join('\n'),
        show: ['<button @click', '<CaseCard @accepted', '<CaseList @accepted', '<Main @accepted', '<Layout @accepted', '<Header :unread'],
        keys: { card: ['<button @click="emit'], list: ['<CaseCard @accepted'], main: ['<CaseList @accepted'], layout: ['<Main @accepted'], app: ['<Layout @accepted', 'const unread'], header: ['<Header :unread', 'defineProps<{ unread'] },
        ui: () => {
          const bd = h('span', { class: 'vxS-badge zero' }, '🔔 0'); left.badge = bd;
          const ch = [['app', 'App', ''], ['layout', 'Layout', '中継'], ['main', 'Main', '中継'], ['list', 'CaseList', '中継'], ['card', 'CaseCard', '']];
          const col = h('div', { class: 'vxS-chain' }, ...ch.map(([k, n, tg], i) => { const e = mk('vxS-ch' + (tg ? ' relay' : ''), k, n, tg ? h('span', { class: 'tg' }, tg) : null); e.style.marginLeft = (i * 14) + 'px'; left.chain[k] = e; return e; }));
          const hd = mk('vxS-ch', 'header', 'Header', bd); left.chain.header = hd;
          return { el: h('div', { class: 'vxS-two2' }, col, h('div', { class: 'vxS-chain' }, hd, hl)), reset() { bd.textContent = '🔔 0'; bd.classList.add('zero'); hl.textContent = 'ホップ 0'; left.n = 0; } };
        },
      },
      with: {
        title: 'store：必要な 2 つだけが読む', file: '2 ファイル', lang: 'vue', src: toSrc(FR).join('\n'),
        keys: { cardR: ['<button @click="notice.push'], headerR: ['<span>{{ notice.unread'], hubR: ['const notice = useNoticeStore()'] },
        ui: () => {
          const bd = h('span', { class: 'vxS-badge zero' }, '🔔 0'); right.badge = bd;
          const c1 = mk('vxS-ch', 'cardR', 'CaseCard'), hub = mk('vxS-ch', 'hubR', 'Store（notice.ts）'), hd = mk('vxS-ch', 'headerR', 'Header', bd);
          right.card = c1; right.hub = hub; right.header = hd;
          return { el: h('div', { class: 'vxS-chain' }, c1, hub, hd, hr), reset() { bd.textContent = '🔔 0'; bd.classList.add('zero'); hr.textContent = 'ホップ 0'; right.n = 0; } };
        },
      },
    });
    async function run(ctx) {
      if (S.running) return; S.running = true; ctx.reset(); ctx.banner('同時にスタート。どっちが早く着く？', 'warn');
      const host = (e) => e.closest('.vs-ui');
      const seqL = async () => { const q = ['card', 'list', 'main', 'layout', 'app', 'header']; for (let i = 1; i < q.length; i++) { await fly(host(left.chain.card), left.chain[q[i - 1]], left.chain[q[i]], i < 5 ? 'emit' : 'props', BLUE, 340); if (!S.alive) return; left.chain[q[i]].classList.add('hit'); hl.textContent = 'ホップ ' + i; } left.badge.textContent = '🔔 1'; left.badge.classList.remove('zero'); bump(left.badge); };
      const seqR = async () => { await fly(host(right.card), right.card, right.hub, 'push()', GREEN, 340); if (!S.alive) return; right.hub.classList.add('hit'); hr.textContent = 'ホップ 1'; await fly(host(right.card), right.hub, right.header, 'state', GREEN, 340); if (!S.alive) return; right.header.classList.add('hit'); hr.textContent = 'ホップ 2'; right.badge.textContent = '🔔 1'; right.badge.classList.remove('zero'); bump(right.badge); };
      await Promise.all([seqL(), seqR()]);
      ctx.banner('props：6 ファイル・中継 3。store：2 ファイル・中継 0。', 'ok'); S.running = false;
      setTimeout(() => el.querySelectorAll('.vxS-ch.hit').forEach((n) => n.classList.remove('hit')), 900);
    }
    const stats = h('div', { class: 'vxS-cmp' },
      h('div', { class: 'vxS-cc no' }, '✖ props / emit', h('em', cl.files), 'ファイル', h('em', cl.lines), '行', h('span', '中継 ', h('em', cl.relay))),
      h('div', { class: 'vxS-cc yes' }, '✓ store', h('em', cr.files), 'ファイル', h('em', cr.lines), '行', h('span', '中継 ', h('em', cr.relay))));
    /* storeToRefs チップ */
    const pX = mkPre(['const notice = useNoticeStore()', 'const { unread } = notice'], 'ts', 'Header.vue', BAD);
    const pO = mkPre(['const notice = useNoticeStore()', 'const { unread } = storeToRefs(notice)', 'const { push } = notice'], 'ts', 'Header.vue', OK);
    pX.setHi([2], 'err'); pO.setHi([2, 3], 'on');
    const panel = h('div', { class: 'vxS-srp', style: { display: 'none' } },
      h('div', { class: 'x' }, h('b', '✖ unread が、ただのコピーになる（変わらない）'), pX),
      h('div', { class: 'o' }, h('b', '✓ state・getters は storeToRefs ／ action はそのまま'), pO));
    const chip = tabBtn('storeToRefs とは？（分割代入するときの約束）', false, () => { const open = panel.style.display === 'none'; panel.style.display = open ? '' : 'none'; chip.classList.toggle('on', open); }, '', GOLD);
    el.append(h('div', { class: 'vxS' }, stats, vs, h('div', { class: 'vxS-sr' }, h('div', { class: 'vxS-bar' }, chip), panel)));
    return () => { S.alive = false; };
  }

  /* ================= 4. eventBus：離れた部品に、合図だけ送る ================= */
  const REF_URL = 'https://v3-migration.vuejs.org/ja/breaking-changes/events-api';
  const refLink = () => h('a', { class: 'vxS-ref', href: REF_URL, target: '_blank', rel: 'noopener' }, '📖 参考：Vue 3 移行ガイド「イベント API（$on / $off / $once の削除）」 ↗');
  function scene4(el) {
    const T = (t, k) => [t, k ? [k] : []];
    /* ---- 1) 考え方の図：bus ＝ Map（イベント名 → ハンドラの名簿） ---- */
    const NAMES = ['case:saved', 'modal:closed'];
    const M = { 'case:saved': [], 'modal:closed': [] };
    const busy = { v: false }, alive = { v: true };
    const log = h('div', { class: 'vxS-err' }, h('span', { class: 'mute' }, '下のボタンを押すと、ここに結果が出る'));
    const say = (txt, ok) => { log.className = 'vxS-err' + (ok ? ' ok' : ''); log.replaceChildren(...[].concat(txt).map((x) => (typeof x === 'string' ? document.createTextNode(x) : x))); };
    const rowEls = {};
    const rows = NAMES.map((n) => { const chips = h('div', { class: 'vxS-chips' }); const r = h('div', { class: 'vxS-mrow' }, h('span', { class: 'vxS-chip hot' }, "'" + n + "'"), h('span', { class: 'vxS-arr' }, '→'), chips); rowEls[n] = { chips, row: r }; return r; });
    const chipEl = (n, f) => rowEls[n].chips.querySelector('[data-f="' + f + '"]');
    const paintRow = (n) => { const c = rowEls[n].chips; c.replaceChildren(...M[n].map((f) => h('span', { class: 'vxS-chip', 'data-f': f }, f))); if (!M[n].length) c.append(h('small', '（誰も聞いていない）')); };
    NAMES.forEach(paintRow);
    const table = h('div', { class: 'vxS-bus vxS-map', 'data-k': 'handlers' }, h('b', 'bus'), h('small', 'Map：イベント名 → ハンドラの名簿（Set）'), ...rows);
    const stageC = h('div', { class: 'vxS-stage' }, table);
    const doOn = (n, f) => { if (busy.v) return; if (!M[n].includes(f)) M[n].push(f); paintRow(n); bump(chipEl(n, f)); say(['on(', "'" + n + "', " + f + ') → 名簿に足した（聞き始め）'], true); };
    const doOff = (n, f) => { if (busy.v) return; const had = M[n].includes(f); M[n] = M[n].filter((x) => x !== f); paintRow(n); bump(rowEls[n].row); say(had ? ['off(', "'" + n + "', " + f + ') → 名簿から外した（聞くのをやめた）'] : ['名簿に ' + f + ' は無い（何も起きない）']); };
    async function doEmit(n, btn, payload) {
      if (busy.v) return; busy.v = true;
      const fs = M[n].slice(); const out = [];
      await fly(stageC, btn, rowEls[n].row, "emit('" + n + "')", PINK, 450); if (!alive.v) return;
      bump(rowEls[n].row);
      if (!fs.length) say('✖ 名簿が空：誰も呼ばれない。エラーにもならない。'); else {
        for (const f of fs) { const c = chipEl(n, f); if (!c) continue; await fly(stageC, rowEls[n].row.firstChild, c, 'call', GREEN, 350); if (!alive.v) return; bump(c); out.push(f + '(' + payload + ')'); }
        say(['送り手は誰が聞くか知らない → ', ...out.map((x, i) => h('div', { key: i }, '✓ ' + x + ' が呼ばれた'))], true);
      }
      busy.v = false;
    }
    const mb = (txt, col, fn) => { const b = tabBtn(txt, false, () => fn(b), '', col); b.style.fontFamily = 'var(--mono)'; b.style.fontSize = '.8rem'; return b; };
    const ctl = h('div', { class: 'vxS-bar' },
      mb("on('case:saved', reloadList)", GREEN, () => doOn('case:saved', 'reloadList')),
      mb("on('case:saved', updateBadge)", GREEN, () => doOn('case:saved', 'updateBadge')),
      mb("emit('case:saved', { id: 1 })", PINK, (b) => doEmit('case:saved', b, '{ id: 1 }')),
      mb("emit('modal:closed', …)", PINK, (b) => doEmit('modal:closed', b, '…')),
      mb("off('case:saved', reloadList)", ORANGE, () => doOff('case:saved', 'reloadList')),
      mb('⟲', VIOLET, () => { if (busy.v) return; NAMES.forEach((n) => { M[n] = []; paintRow(n); }); say('名簿を空にした'); }));
    const mcard = (k, sig, ja, col) => h('div', { class: 'vxS-meth', 'data-k': k, style: { '--c': col } }, h('code', sig), h('b', ja));
    const methods = h('div', { class: 'vxS-col' },
      mcard('on', 'on(name, handler)', '登録＝聞く', GREEN), mcard('off', 'off(name, handler)', '解除＝聞くのをやめる', ORANGE), mcard('emit', 'emit(name, payload)', '送る（誰が聞くかは知らない）', PINK),
      h('small', { class: 'vxS-contract' }, '約束は ', h('b', 'イベント名'), ' ＋ ', h('b', 'ペイロード'), '（運ぶ中身）だけ。'), log);
    const concept = h('div', { class: 'vxS' },
      h('div', { class: 'vxS-tt' }, '💡 考え方：bus の中は「イベント名 → ハンドラの名簿」だけ'),
      h('div', { class: 'vxS-two' }, h('div', { class: 'vxS-box' }, stageC, ctl), h('div', { class: 'vxS-box' }, methods)));
    /* ---- 2) 自作の型付き bus（解剖） ---- */
    const anat = K.tsAnatBuild({
      tab: '自作する（約 18 行）', split: true, lang: 'ts', title: '🔍 自作の bus（これが eventBus の中身）',
      tokens: [
        T("type Events = {\n  'case:saved': { id: number }\n  'modal:closed': { name: string }\n}", 'events'), T("\ntype Fn<P> = (p: P) => void\n\nfunction createBus<E extends Record<string, unknown>>() {\n  "),
        T('const map = new Map<keyof E, Set<Fn<any>>>()', 'handlers'), T('\n  return {\n    '),
        T("on<K extends keyof E>(name: K, fn: Fn<E[K]>) {\n      if (!map.has(name)) map.set(name, new Set())\n      map.get(name)!.add(fn)\n    }", 'on'), T(',\n    '),
        T('off<K extends keyof E>(name: K, fn: Fn<E[K]>) {\n      map.get(name)?.delete(fn)\n    }', 'off'), T(',\n    '),
        T('emit<K extends keyof E>(name: K, payload: E[K]) {\n      map.get(name)?.forEach((fn) => fn(payload))\n    }', 'emit'), T(',\n  }\n}\n\nexport const '), T('bus = createBus<Events>()', 'bus'),
      ],
      parts: {
        events: ['Events 型', VIOLET, '合図の名前と、運ぶ中身の型。送り手と聞き手の約束を 1 か所に書く。'],
        handlers: ['map（名簿）', BLUE, 'イベント名 → ハンドラの Set。これが bus の正体。'],
        on: ['on：聞く', GREEN, '名簿に関数を足す（登録・購読）。'],
        off: ['off：やめる', ORANGE, '名簿から同じ関数を外す（解除）。'],
        emit: ['emit：送る', PINK, '名簿の全員を、ペイロードつきで呼ぶ。'],
        bus: ['bus', GOLD, 'アプリ全体で 1 つだけ作る。全員が import して使う。'],
      },
      more: [{
        tab: 'ready-made: mitt', split: true, lang: 'ts', title: '🔍 ready-made: mitt — 同じ on / off / emit の使い方（実務ではこれを使うことが多い。Vue 3 では $on/$off が無くなったため）',
        tokens: [T("import mitt from 'mitt'", 'imp'), T('\n\nexport const '), T('bus = mitt<Events>()', 'bus'), T('\n'), T("bus.on('case:saved', reload)   // off / emit も同じ", 'on')],
        parts: { imp: ['mitt', GOLD, '既製の小さなイベントバス。Vue 3 移行ガイドも、外部ライブラリとして挙げている。'], bus: ['mitt<Events>()', BLUE, '自作の createBus<Events>() と同じ役。'], on: ['on / off / emit', GREEN, '使い方は自作と同じ。'] },
      }],
    });
    /* ---- 3) Vue 2 → Vue 3 ---- */
    const v2 = h('div', { class: 'vxS-srp' },
      h('div', { class: 'x' }, h('b', '✖ Vue 2：new Vue() を bus に（Vue 3 で削除）'), mkPre(["const eventBus = new Vue()", "eventBus.$on('case:saved', reload)", "eventBus.$emit('case:saved', { id: 1 })"], 'js', '古いコード', BAD)),
      h('div', { class: 'o' }, h('b', '✓ Vue 3：自作の bus か、mitt / tiny-emitter'), mkPre(["// $on / $off / $once は無くなった（$emit は親子の @event 用に残る）", "import { bus } from '@/lib/eventBus'", "bus.on('case:saved', reload)"], 'ts', '今のコード', OK)));
    const note = h('div', { class: 'vxS-note' }, h('b', 'Vue 2 の古いコードを読むときのために'), '　', v2, h('div', { style: { marginTop: '8px' } }, refLink()));
    /* ---- 4) デモ ---- */
    const S = { handlers: 1, reloads: 0, alive: true, busy: false };
    const cnt = h('span', { class: 'vxS-chip hot', 'data-k': 'handlers' }, '聞いている部品：1');
    const rcv = h('div', { class: 'vxS-recv off' }, '一覧 3 件 ／ 再読み込み 0 回');
    const sw = h('input', { type: 'checkbox', checked: true, onchange: () => { S.handlers = sw.checked ? 1 : 0; cnt.textContent = '聞いている部品：' + S.handlers; bump(cnt); rcv.classList.add('off'); rcv.textContent = sw.checked ? '一覧 ' + (3 + S.reloads) + ' 件 ／ 再読み込み ' + S.reloads + ' 回' : '（CaseList が無い）'; } });
    const swl = h('label', { class: 'vxS-sw', 'data-k': 'off' }, sw, 'CaseList を表示する');
    const cList = h('div', { class: 'vxS-comp', 'data-k': 'on' }, h('b', 'CaseList.vue'), rcv, swl);
    const hub = h('div', { class: 'vxS-bus', 'data-k': 'bus' }, h('b', 'bus'), cnt, h('small', "'case:saved'"));
    const mkSend = (name, label) => { const b = h('button', { class: 'vxS-btn', type: 'button', onclick: () => send(b) }, label); return h('div', { class: 'vxS-comp', 'data-k': 'emit' }, h('b', name + '.vue'), b); };
    const stage = h('div', { class: 'vxS-stage vxS-s4' }, h('div', { class: 'vxS-send' }, mkSend('CaseForm', '保存する'), mkSend('CaseEdit', '更新する')), hub, cList);
    async function send(btn) {
      if (S.busy) return; S.busy = true;
      await fly(stage, btn, hub, "emit('case:saved')", PINK, 520); if (!S.alive) return;
      bump(hub);
      if (S.handlers > 0) { await fly(stage, hub, rcv, 'on', GREEN, 520); if (!S.alive) return; S.reloads++; rcv.classList.remove('off'); rcv.textContent = '🔄 一覧 ' + (3 + S.reloads) + ' 件 ／ 再読み込み ' + S.reloads + ' 回'; bump(rcv); }
      else { const x = h('span', { class: 'vxS-pkt', style: { background: '#ff8a96' } }, '✖ 誰も聞いていない'); stage.append(x); const r = hub.getBoundingClientRect(), hr = stage.getBoundingClientRect(); x.style.transform = `translate(${r.left - hr.left}px,${r.top - hr.top - 24}px)`; await sleep(900); x.remove(); }
      S.busy = false;
    }
    const pBus = mkPre(["type Events = { 'case:saved': { id: number } }", '', '// createBus は上の実装', '', 'export const bus = createBus<Events>()'], 'ts', 'lib/eventBus.ts', GOLD);
    const pSend = mkPre(["import { bus } from '@/lib/eventBus'", '', "bus.emit('case:saved', { id: 7 })"], 'ts', 'CaseForm.vue', PINK);
    const pLis = mkPre(['function reload(): void { loadCases() }', '', "bus.on('case:saved', reload)", "onUnmounted(() => bus.off('case:saved', reload))"], 'ts', 'CaseList.vue', GREEN);
    const L = linker(el);
    L.set([pBus, pSend, pLis], { bus: [[5], [], []], emit: [[], [3], []], on: [[], [], [1, 3]], off: [[], [], [4]], handlers: [[5], [], [3]] });
    const treeBox = h('div', { class: 'vxS-col' }, h('div', { class: 'vxS-tt' }, '📂 フォルダ'), tree([{ d: 0, n: 'src/' }, { d: 1, n: 'lib/' }, { d: 2, n: 'eventBus.ts', f: 1, hit: 1, note: 'bus はここ 1 か所' }, { d: 1, n: 'components/' }, { d: 2, n: 'CaseForm.vue', f: 1 }, { d: 2, n: 'CaseEdit.vue', f: 1 }, { d: 2, n: 'CaseList.vue', f: 1 }]));
    const demo = h('div', { class: 'vxS' },
      h('div', { class: 'vxS-box' }, h('div', { class: 'vxS-tt' }, '▶ どこからでも送れる ／ 聞いている部品にだけ届く'), stage),
      h('div', { class: 'vxS-four' }, treeBox, pBus, pSend, pLis));
    bridge(anat, demo); bridge(anat, concept);
    el.append(h('div', { class: 'vxS' }, concept, anat, demo, note));
    return () => { S.alive = false; alive.v = false; };
  }

  /* ================= 5. バスの落とし穴 ================= */
  function scene5(el) {
    const PIT = [
      { k: 'leak', tab: '① 解除し忘れ' }, { k: 'state', tab: '② bus で状態を持つ' }, { k: 'magic', tab: '③ 名前が文字列' }, { k: 'many', tab: '④ 何でも global' },
    ];
    const S = { pit: 0, ok: false, alive: true };
    const mode = h('div', { class: 'vxS-bar' }), pits = h('div', { class: 'vxS-bar' }), say = h('div', { class: 'vxS-say' });
    const body = h('div');
    const L = linker(el);
    let pre = null;
    const sayIt = (a) => { say.replaceChildren(...[].concat(a).map((x) => (typeof x === 'string' ? document.createTextNode(x) : x))); };
    const soon = h('span', { class: 'vxS-soon' }, 'onUnmounted は vue-life で習う');

    /* ① 解除し忘れ */
    function drawLeak() {
      const st = { page: 'list', n: 1 };
      const cnt = h('span', { class: 'vxS-cnt', 'data-k': 'count' }, '1');
      const logs = h('div', { class: 'vxS-logs', 'data-k': 'reload' });
      const page = h('div', { class: 'vxS-page' });
      const goB = h('button', { class: 'vxS-btn', type: 'button', onclick: () => leave() }, '⚙ 設定ページへ');
      const backB = h('button', { class: 'vxS-btn', type: 'button', onclick: () => back() }, '📋 一覧へ戻る');
      const auto = h('button', { class: 'vxS-btn', type: 'button', onclick: async () => { for (let i = 0; i < 2 && S.alive; i++) { leave(); await sleep(350); back(); await sleep(350); } } }, '▶ 行って戻るを 2 回');
      const okBtn = h('button', { class: 'vxS-btn', type: 'button', onclick: () => accept() }, '保存する');
      const verdict = h('div', { class: 'vxS-verdict ok' }, '');
      const paint = () => {
        cnt.textContent = st.n;
        page.replaceChildren(h('b', st.page === 'list' ? 'CaseListPage.vue（CaseList がいる）' : 'SettingsPage.vue（CaseList は消えた）'), st.page === 'list' ? h('div', { style: { display: 'flex', gap: '8px' } }, okBtn, h('small', '保存 → 一覧を再読み込み')) : h('small', '設定ページ'), logs);
        goB.disabled = st.page !== 'list'; backB.disabled = st.page === 'list';
        verdict.className = 'vxS-verdict ' + (st.n > 1 ? 'bad' : 'ok'); verdict.textContent = st.n > 1 ? '✖ ' + st.n + ' 個のハンドラが生きている' : '✓ ハンドラは 1 個だけ';
      };
      const leave = () => { if (st.page !== 'list') return; st.page = 'settings'; if (S.ok) st.n = Math.max(0, st.n - 1); logs.replaceChildren(); paint(); };
      const back = () => { if (st.page === 'list') return; st.page = 'list'; st.n++; logs.replaceChildren(); paint(); };
      const accept = () => { logs.replaceChildren(h('div', { class: 'vxS-lg' }, '保存 1 回 → 再読み込み ' + st.n + ' 回'), ...Array.from({ length: st.n }, (_, i) => h('div', { class: 'vxS-lg' + (i > 0 ? ' ghost' : '') }, i === 0 ? '🔄 CaseList を再読み込み' : '💀 消えた部品の分も再読み込み'))); bump(logs); };
      paint();
      const stage = h('div', { class: 'vxS-stage' }, h('div', { class: 'vxS-nav' }, goB, backB, auto), page, h('div', { class: 'vxS-bar', style: { alignItems: 'center' } }, h('span', 'bus の on 登録数：'), cnt, verdict));
      pre = mkPre(S.ok ? ['function reload(): void {', '  loadCases()', '}', "onMounted(() => bus.on('case:saved', reload))", "onUnmounted(() => bus.off('case:saved', reload))"] : ['function reload(): void {', '  loadCases()', '}', "onMounted(() => bus.on('case:saved', reload))"], 'ts', 'CaseList.vue', S.ok ? OK : BAD);
      if (!S.ok) pre.setHi([4], 'err'); else pre.setHi([5], 'on');
      L.set([pre], { count: S.ok ? [5] : [4], reload: [1, 2, 3] });
      say.className = 'vxS-say ' + (S.ok ? 'ok' : 'bad'); sayIt(S.ok ? ['戻るたびに ', h('code', 'off'), ' で外すので、いつも 1 個。'] : ['一覧に戻るたびに ', h('code', 'on'), ' が増える。消えた部品の関数も、まだ動く。']);
      return [stage, pre, soon];
    }

    /* ② bus で状態を持つ */
    function drawState() {
      const st = { added: 0, open: false, cartCount: 0 };
      const hb = h('span', { class: 'vxS-badge zero', 'data-k': 'header' }, '🛒 0');
      const cp = h('div', { class: 'vxS-page', 'data-k': 'cart' });
      const verdict = h('div', { class: 'vxS-verdict ok' }, '');
      const add = h('button', { class: 'vxS-btn', type: 'button', onclick: () => { st.added++; if (st.open && !S.ok) st.cartCount++; paint(); } }, '🛒 カートに入れる');
      const open = h('button', { class: 'vxS-btn', type: 'button', onclick: () => { st.open = !st.open; if (st.open) st.cartCount = S.ok ? st.added : 0; paint(); } }, '');
      const paint = () => {
        hb.textContent = '🛒 ' + st.added; hb.classList.toggle('zero', !st.added);
        open.textContent = st.open ? '✕ カート画面を閉じる' : '📄 カート画面を開く';
        const shown = st.open ? (S.ok ? st.added : st.cartCount) : null;
        cp.replaceChildren(h('b', 'CartPage.vue'), st.open ? h('div', { class: 'vxS-cnt' }, '中身：' + shown + ' 個') : h('small', '（まだ開いていない）'));
        if (st.open) { const same = shown === st.added; verdict.className = 'vxS-verdict ' + (same ? 'ok' : 'bad'); verdict.textContent = same ? '✓ ヘッダーと同じ ' + st.added : '✖ ヘッダー ' + st.added + ' ≠ カート ' + shown + '（開く前の合図は、取りこぼし）'; } else { verdict.className = 'vxS-verdict ok'; verdict.textContent = '3 回ほど入れてから、カート画面を開こう'; }
      };
      paint();
      const stage = h('div', { class: 'vxS-stage' }, h('div', { class: 'vxS-nav' }, add, open, h('span', { class: 'vxS-chip' }, 'Header ', hb)), cp, verdict);
      pre = mkPre(S.ok ? ['const cart = useCartStore()', 'cart.add(3)', '<span>{{ cart.count }}</span>'] : ["bus.emit('cart:add', { id: 3 })", "bus.on('cart:add', () => { count.value++ })"], 'ts', S.ok ? 'CartPage.vue / Header.vue' : 'Header.vue / CartPage.vue', S.ok ? OK : BAD);
      if (!S.ok) pre.setHi([2], 'err'); else pre.setHi([1, 3], 'on');
      L.set([pre], S.ok ? { header: [3], cart: [3] } : { header: [2], cart: [2] });
      say.className = 'vxS-say ' + (S.ok ? 'ok' : 'bad'); sayIt(S.ok ? ['数・中身は「状態」。', h('b', 'store'), ' に置くと、いつ開いても同じ。'] : ['bus は合図を覚えない。', h('b', '開く前の合図'), 'は届かず、数が食い違う。']);
      return [stage, pre];
    }

    /* ③ 名前が文字列 */
    function drawMagic() {
      const out = h('div', { class: 'vxS-err' }, h('span', { class: 'mute' }, '下のボタンを押す'));
      const listEl = h('div', { class: 'vxS-recv off', 'data-k': 'listener' }, '（CaseList）');
      const mk = (name) => h('button', { class: 'vxS-btn', type: 'button', 'data-k': name === 'case:svaed' ? 'typo' : 'good', onclick: () => fire(name) }, "bus.emit('" + name + "', …)");
      const fire = (name) => {
        listEl.classList.add('off'); listEl.textContent = '（CaseList）';
        if (name === 'case:saved') { listEl.classList.remove('off'); listEl.textContent = '🔄 一覧を再読み込みした'; out.className = 'vxS-err ok'; out.textContent = '✓ 届いた'; bump(listEl); }
        else if (S.ok) { out.className = 'vxS-err'; out.innerHTML = '✖ <span>Argument of type \'"case:svaed"\' is not assignable to parameter of type \'keyof Events\'.</span><br><span class="mute">→ 実行する前に、エディタが赤線で教えてくれる</span>'; if (pre) pre.setHi([3], 'err'); }
        else { out.className = 'vxS-err'; out.innerHTML = '✖ 何も起きない（一覧が更新されない）<br><span class="mute">→ エラーも出ない。タイプミスに気づけない</span>'; bump(out); }
      };
      const stage = h('div', { class: 'vxS-stage' }, h('div', { class: 'vxS-nav' }, mk('case:saved'), mk('case:svaed')), listEl, out);
      pre = mkPre(S.ok ? ["type Events = { 'case:saved': { id: number } }", 'const bus = createBus<Events>()', "bus.emit('case:svaed', { id: 1 })"] : ['const bus = createBus<Record<string, unknown>>()', "bus.on('case:saved', reload)", "bus.emit('case:svaed', { id: 1 })"], 'ts', 'CaseForm.vue', S.ok ? OK : BAD);
      pre.setHi(S.ok ? [1, 2] : [3], S.ok ? 'on' : 'err');
      L.set([pre], S.ok ? { good: [1, 2], typo: [3] } : { good: [2], typo: [3], listener: [2] });
      say.className = 'vxS-say ' + (S.ok ? 'ok' : 'bad'); sayIt(S.ok ? ['名前と中身の型を ', h('code', 'Events'), ' に書く。タイプミスは、書いた時に分かる。'] : ['名前が ', h('b', '文字列'), 'のまま。1 文字違っても、誰も教えてくれない。']);
      return [stage, pre];
    }

    /* ④ 何でも global */
    function drawMany() {
      const COMPS = ['Header', 'SearchBox', 'CaseList', 'Sidebar', 'Footer'];
      const els = COMPS.map((n) => h('div', { class: 'vxS-comp', 'data-k': n === 'SearchBox' ? 'local' : 'others' }, h('b', n + '.vue')));
      const res = h('div', { class: 'vxS-verdict ok' }, '入力欄に打ってみよう');
      const inp = h('input', { placeholder: '相談の件名', style: { padding: '.4em .7em', borderRadius: '8px', border: '2px solid #b9c4e2', font: '700 .85rem var(--font)', width: '100%' }, oninput: () => { const hit = S.ok ? [1] : [0, 1, 2, 3, 4]; els.forEach((e, i) => { e.classList.remove('vxS-fl'); if (hit.includes(i)) { void e.offsetWidth; e.classList.add('vxS-fl'); } }); res.className = 'vxS-verdict ' + (S.ok ? 'ok' : 'bad'); res.textContent = (S.ok ? '✓ ' : '✖ ') + hit.length + ' 個の部品が反応'; } });
      els[1].append(inp);
      const stage = h('div', { class: 'vxS-stage' }, h('div', { class: 'vxS-row2', style: { gridTemplateColumns: 'repeat(2,minmax(0,1fr))' } }, ...els), res,
        tree(S.ok ? [{ d: 0, n: 'stores/' }, { d: 1, n: 'user.ts', f: 1, note: 'ログイン情報（全体で使う）' }, { d: 1, n: 'notice.ts', f: 1, note: '未読（複数の画面で使う）' }] : [{ d: 0, n: 'stores/' }, { d: 1, n: 'user.ts', f: 1 }, { d: 1, n: 'notice.ts', f: 1 }, { d: 1, n: 'draft.ts', f: 1, note: '入力途中？' }, { d: 1, n: 'modal.ts', f: 1, note: '開閉？' }, { d: 1, n: 'hover.ts', f: 1, note: '？？' }]));
      pre = mkPre(S.ok ? ["const subject = ref<string>('')"] : ['const draft = useDraftStore()', 'const modal = useModalStore()', 'const hover = useHoverStore()'], 'ts', 'SearchBox.vue', S.ok ? OK : BAD);
      pre.setHi(S.ok ? [1] : [1, 2, 3], S.ok ? 'on' : 'err');
      L.set([pre], S.ok ? { local: [1] } : { local: [1, 2, 3], others: [1] });
      say.className = 'vxS-say ' + (S.ok ? 'ok' : 'bad'); sayIt(S.ok ? ['その部品の中だけで使う値は、', h('b', 'ローカルの ref'), '。store に入れない。'] : ['何でも store に入れると、', h('b', '誰が書き換えたか'), '追えなくなる。']);
      return [stage, pre];
    }

    const DRAW = [drawLeak, drawState, drawMagic, drawMany];
    function draw() {
      pits.querySelectorAll('button').forEach((b, i) => b.classList.toggle('on', i === S.pit));
      mode.querySelectorAll('button').forEach((b, i) => b.classList.toggle('on', (i === 1) === S.ok));
      const [stage, code2, extra] = DRAW[S.pit]();
      body.replaceChildren(h('div', { class: 'vxS-5' }, h('div', { class: 'vxS-box ' + (S.ok ? 'yes' : 'no') }, h('div', { class: 'vxS-tt' }, S.ok ? '✓ こう直す' : '✖ こう書くと'), stage), h('div', { class: 'vxS-box ' + (S.ok ? 'yes' : 'no') }, h('div', { class: 'vxS-tt' }, 'コード'), h('div', { class: 'vxS-grow vxS-col' }, code2), extra || null)));
    }
    PIT.forEach((p, i) => pits.append(tabBtn(p.tab, i === 0, () => { S.pit = i; draw(); }, '', COLS[i])));
    mode.append(tabBtn('✖ こう書くと', true, () => { S.ok = false; draw(); }, 'x'), tabBtn('✓ こう直す', false, () => { S.ok = true; draw(); }));
    el.append(h('div', { class: 'vxS' }, h('div', { class: 'vxS-bar' }, pits, h('span', { class: 'vxS-sep' }), mode), say, body, h('div', null, refLink())));
    draw();
    return () => { S.alive = false; };
  }

  /* ================= 6. store と eventBus、どっち？ ================= */
  function scene6(el) {
    const WAYS = [['props', 'props / emit', BLUE], ['store', 'store', GREEN], ['bus', 'eventBus', GOLD]];
    const Q = [
      { q: 'ログイン中のユーザー情報', a: 'store', r: '多くの部品がずっと読む「状態」。store に置く。' },
      { q: '未読件数（ヘッダーと一覧が見る）', a: 'store', r: '離れた部品が同じ値を読む。computed で作って store に。' },
      { q: '保存が終わったので、離れた一覧を更新して', a: 'bus', r: '「保存したよ」という一度きりの合図。（一覧が store を持つなら、その action でも可）' },
      { q: '絞り込み条件（サイドバーと一覧で共有）', a: 'store', r: '離れた 2 か所が同じ値を使う。store が素直。' },
      { q: 'モーダルが閉じたと、離れた部品に知らせたい', a: 'bus', r: '「閉じたよ」という一度きりの合図。あとに残す状態はない。' },
      { q: 'カートの中身', a: 'store', r: 'いつ開いても同じでないと困る「状態」。' },
      { q: '親子の 1 つの入力欄', a: 'props', r: '近い親子は props / emit（defineModel）で十分。' },
      { q: 'フォームの入力途中の値', a: 'props', r: 'その画面の中だけ。部品の ref と props / emit で。store には入れない。' },
    ];
    const S = { done: 0, ok: 0, picked: {} };
    const score = h('div', { class: 'vxS-score' }, '正解 ', h('em', '0'), ' / ' + Q.length);
    const steps = WAYS.map(([k, n, c], i) => h('div', { class: 'vxS-step', 'data-w': k, style: { '--c': c } }, h('b', h('i', i + 1), ['まず props / emit', '共有が必要なら store（provide / inject も手段）', '一度きりの合図だけ eventBus（最後の手段）'][i]), h('small', ["emit('accepted')", 'useNoticeStore()', "bus.emit('case:saved', …)"][i])));
    const cards = Q.map((x, qi) => {
      const rs = h('div', { class: 'vxS-rs' });
      const btns = WAYS.map(([k, n, c]) => h('button', { type: 'button', onclick: () => pick(qi, k, btns, rs, card) }, n));
      const card = h('div', { class: 'vxS-card' }, h('b', x.q), h('div', { class: 'vxS-ch3' }, ...btns), rs);
      return card;
    });
    function pick(qi, k, btns, rs, card) {
      if (S.picked[qi]) return; S.picked[qi] = k; const x = Q[qi], good = k === x.a; S.done++; if (good) S.ok++;
      btns.forEach((b, i) => { const key = WAYS[i][0]; b.disabled = true; if (key === k) b.classList.add(good ? 'ok' : 'ng'); else if (key === x.a && !good) b.classList.add('ok'); });
      card.classList.add(good ? 'ok' : 'ng'); rs.textContent = (good ? '✓ ' : '✖ 正解は ' + WAYS.find((w) => w[0] === x.a)[1] + '。') + x.r; bump(card);
      score.querySelector('em').textContent = S.ok;
      steps.forEach((s) => s.classList.toggle('lit', s.getAttribute('data-w') === x.a));
    }
    const reset = h('button', { class: 'btn ghost', onclick: () => { S.done = 0; S.ok = 0; S.picked = {}; score.querySelector('em').textContent = '0'; cards.forEach((c, qi) => { c.className = 'vxS-card'; c.querySelector('.vxS-rs').textContent = ''; c.querySelectorAll('button').forEach((b) => { b.disabled = false; b.className = ''; }); }); steps.forEach((s) => s.classList.remove('lit')); } }, '⟲ もう一度');
    el.append(h('div', { class: 'vxS' }, h('div', { class: 'vxS-bar', style: { alignItems: 'center' } }, score, reset),
      h('div', { class: 'vxS-6' }, h('div', { class: 'vxS-cards' }, ...cards), h('div', { class: 'vxS-ladder' }, ...steps))));
  }

  reg({
    id: 'x-vue-store', title: 'store と eventBus', sub: '離れた部品どうしで、データと合図をやりとりする', emoji: '🗄️',
    meta: { cat: 'vue', day: '5日目', when: 'props のバケツリレーがつらくなったとき。x-vue-state の次に', mins: 18, order: 35, level: '応用', after: 'vue-comp', why: 'データ共有は store、起きた合図は eventBus、と役割が違う。混ぜると追えなくなる' },
    scenes: [
      { t: '離れた部品どうし、どう話す？', tag: 'ROUTES', lead: '遠い部品に届ける道は 3 つ。<b>props / emit</b> は全員が中継、<b>store</b> と <b>eventBus</b> は真ん中を通すだけ。', render: scene1 },
      { t: 'store：みんなで共有する置き場', tag: 'PINIA', lead: '<b>store</b> は、離れた部品が<b>同じデータ</b>を読み書きする共有の置き場（Pinia）。', render: scene2 },
      { t: 'store を使うときのコード', tag: 'USE STORE', lead: '部品は <b>useNoticeStore()</b> を呼ぶだけ。<b>中継する部品</b>が要らなくなる。', render: scene3 },
      { t: 'eventBus：離れた部品に、合図だけ送る', tag: 'EVENT BUS', lead: '<b>eventBus</b> ＝ <b>共有の連絡係</b>。<b>on</b>（聞く）・<b>off</b>（やめる）・<b>emit</b>（送る）の 3 つだけ。', render: scene4 },
      { t: 'バスの落とし穴：解除し忘れ', tag: 'PITFALLS', lead: 'bus は便利だが、<b>off し忘れ</b>・<b>状態を持たせる</b>・<b>文字列の名前</b>で、すぐ追えなくなる。', render: scene5 },
      { t: 'store と eventBus、どっち？', tag: 'CHOOSE', lead: '<b>まず props / emit</b> → 共有が必要なら <b>store</b> → 一度きりの合図だけ <b>eventBus</b>（最後の手段）。', render: scene6 },
    ],
  });
})();
