/* 補足 Vue：Vue DevTools（Chrome 拡張）（x-vue-devtools）
   1) ふつうの DevTools だけだと困る  2) 入れ方と開き方  3) Components タブ  4) Timeline
   5) Pinia と Router タブ  6) 困ったときの使い方
   画面はすべて「それらしく描いたモック」（公式の画像やロゴは使わない）。 */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.W) return;
  const { h, code, style } = K.W;
  const reg = (o) => K.reg(Object.assign({ track: 'extra' }, o));
  const VUE = 'var(--vue)', GREEN = '#42b883', GOLD = '#ffb454', BLUE = '#5b9dff', PINK = '#ff6b9d', RED = '#ff8a96';

  style('vxD', `
  .vxD{display:grid;gap:14px;min-width:0}
  .vxD-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:stretch}
  .vxD-bar .btn{height:44px;padding:0 1.1em;font-size:.9rem}
  .vxD-say{flex:1;min-width:240px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-height:44px;padding:6px 16px;border-radius:12px;border:2px solid var(--line);background:var(--card);font:800 .95rem/1.55 var(--font);transition:.25s}
  .vxD-say.bad{border-color:var(--bad);color:var(--bad)}.vxD-say.ok{border-color:var(--ok)}
  .vxD code.k,.vxD-say code,.vxD-why code{font:800 .88rem var(--mono);color:var(--vue)}
  .vxD-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:stretch;position:relative}
  @media(max-width:980px){.vxD-two{grid-template-columns:1fr}}
  .vxD-box{border:2px solid var(--line);border-radius:14px;background:var(--card);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}
  .vxD-tt{font:900 1rem var(--font);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .vxD-code{min-width:0;display:flex;flex-direction:column;flex:1}.vxD-code>pre.code{flex:1;margin:0;font-size:.88rem}
  .vxD-why{font:800 .92rem/1.6 var(--font);padding:.5em .9em;border-radius:10px;background:color-mix(in srgb,var(--vue) 12%,var(--card));border-left:5px solid var(--vue)}
  .vxD-why.bad{background:color-mix(in srgb,var(--bad) 12%,var(--card));border-left-color:var(--bad)}
  .vxD-tabs{display:flex;gap:8px;flex-wrap:wrap}
  .vxD-tab{all:unset;cursor:pointer;padding:.45em 1em;border-radius:99px;border:2px solid var(--line);background:var(--card2);font:800 .9rem var(--font);transition:.2s}
  .vxD-tab:hover{border-color:var(--vue)}.vxD-tab.on{background:var(--vue);border-color:var(--vue);color:#06101f}.vxD-tab.x.on{background:var(--bad);border-color:var(--bad)}
  .vxD-pkt{position:absolute;left:0;top:0;z-index:20;padding:.2em .85em;border-radius:99px;color:#06101f;font:900 .85rem var(--mono);box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap}
  .vxD-bump{animation:vxDb .7s}@keyframes vxDb{30%{transform:scale(1.05);box-shadow:0 0 0 6px color-mix(in srgb,var(--ok) 45%,transparent)}}
  .vxD-shake{animation:vxDs .45s}@keyframes vxDs{20%,60%{transform:translateX(-5px)}40%,80%{transform:translateX(5px)}}
  .vxD [data-k].vxD-hot{outline:2px solid var(--vue);outline-offset:1px;box-shadow:0 0 0 4px color-mix(in srgb,var(--vue) 28%,transparent)}
  .vxD-ic{display:inline-flex;vertical-align:middle;flex:none}.vxD-ic svg{display:block}
  /* ブラウザ窓 */
  .vxD-win{border:2px solid var(--line);border-radius:12px;background:#fff;overflow:hidden;display:flex;flex-direction:column;min-width:0}
  .vxD-wbar{background:#dfe3ee;padding:7px 10px;display:flex;gap:8px;align-items:center;color:#2a3350;min-height:40px}
  .vxD-dots{display:flex;gap:5px}.vxD-dots i{width:10px;height:10px;border-radius:50%;background:#b4bbd0;display:block}
  .vxD-wtab{background:#f4f6fb;border-radius:8px 8px 0 0;padding:3px 10px;font:800 .8rem var(--font);white-space:nowrap;max-width:9em;overflow:hidden;text-overflow:ellipsis}
  .vxD-addr{flex:1;min-width:0;background:#fff;border-radius:99px;padding:3px 12px;font:700 .82rem var(--mono);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border:2px solid transparent;transition:.2s}
  .vxD-addr.hot{border-color:#e0a21a;background:#fff7e0}
  .vxD-exts{display:flex;gap:6px;align-items:center}
  .vxD-extv{display:none;width:22px;height:22px;border-radius:6px;background:#42b883;color:#fff;align-items:center;justify-content:center}
  .vxD-extv.on{display:inline-flex;animation:vxDp .6s}@keyframes vxDp{from{transform:scale(0)}60%{transform:scale(1.3)}}
  .vxD-wbody{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);flex:1;min-height:0}
  .vxD-wbody.col{grid-template-columns:1fr;grid-template-rows:auto 1fr}
  @media(max-width:760px){.vxD-wbody{grid-template-columns:1fr}}
  .vxD-view{background:#f4f6fb;color:#1f2a44;padding:12px;display:flex;flex-direction:column;gap:8px;min-width:0;position:relative}
  /* 画面モック */
  .vxD-pg{position:relative;padding:24px 8px 8px;display:grid;gap:8px;align-content:start;flex:1}
  .vxD-pg h3{font:900 1rem var(--font);margin:0}
  .vxD-list{display:grid;gap:8px;position:relative;padding:22px 0 0}
  .vxD-card{position:relative;background:#fff;border:1px solid #d5d9e0;border-radius:8px;padding:8px 10px;display:grid;gap:3px;font:700 .9rem/1.4 var(--font);transition:.3s}
  .vxD-card h4{margin:0;font:900 .95rem var(--font);display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .vxD-badge{padding:0 .6em;border-radius:99px;background:#ffe8b8;color:#7a5200;font:900 .8rem var(--font)}.vxD-badge.done{background:#cdf5e3;color:#0f6a49}
  .vxD-mb{all:unset;cursor:pointer;justify-self:start;padding:.2em .8em;border-radius:7px;border:1px solid #aab;background:#eef2ff;font:800 .85rem var(--font);color:#1f2a44}.vxD-mb:hover{background:#dfe6ff}
  .vxD-mb.del{background:#ffe3e3;border-color:#e5484d;color:#8a1c22}
  .vxD-pg [data-n]{cursor:pointer}
  .vxD-pg .hov{outline:2px dashed #4a90e2;outline-offset:1px}
  .vxD-pg .sel{outline:2px solid #4a90e2;outline-offset:1px;background-image:linear-gradient(rgba(74,144,226,.14),rgba(74,144,226,.14))}
  .vxD-pg .sel::after{content:attr(data-lab);position:absolute;left:-2px;top:-22px;background:#4a90e2;color:#fff;font:800 .8rem var(--mono);padding:1px 8px;border-radius:6px;z-index:3;white-space:nowrap}
  .vxD-pick{cursor:pointer;border-radius:6px;transition:.2s}.vxD-pick:hover{background:#e3ecff}
  .vxD-pick.sel{outline:2px solid #4a90e2;background:rgba(74,144,226,.16)}
  /* DevTools パネル */
  .vxD-dock{background:#1f2125;color:#d7dae0;display:flex;flex-direction:column;min-width:0;min-height:0;font:700 .84rem/1.45 var(--mono)}
  .vxD-strip{display:flex;background:#2a2d33;border-bottom:1px solid #3a3d44;overflow:hidden;white-space:nowrap}
  .vxD-ct{padding:.45em .85em;font:700 .8rem var(--font);color:#aab0be;display:inline-flex;gap:5px;align-items:center;border-bottom:2px solid transparent}
  .vxD-ct.vue{color:#42b883}.vxD-ct.on{border-bottom-color:#42b883;color:#42b883}
  .vxD-ct.pulse{animation:vxDq 1s infinite}@keyframes vxDq{50%{background:rgba(66,184,131,.35);color:#fff}}
  .vxD-ct.hide{display:none}
  .vxD-sub{display:flex;gap:2px;padding:4px 6px;background:#25272c;border-bottom:1px solid #3a3d44;flex-wrap:wrap}
  .vxD-st{all:unset;cursor:pointer;display:inline-flex;gap:5px;align-items:center;padding:.3em .7em;border-radius:6px;font:800 .8rem var(--font);color:#aab0be;transition:.15s}
  .vxD-st:hover{background:#33363d;color:#fff}.vxD-st.on{background:rgba(66,184,131,.22);color:#42b883}.vxD-st.dim{opacity:.5;cursor:default}
  .vxD-st.pulse{animation:vxDq 1s infinite}
  .vxD-body{flex:1;min-height:0;display:flex;min-width:0}
  .vxD-tree{flex:0 0 46%;min-width:0;border-right:1px solid #3a3d44;padding:6px 0;overflow:hidden;display:flex;flex-direction:column;gap:1px}
  .vxD-tn{padding:.25em .5em;white-space:nowrap;cursor:pointer;display:flex;gap:4px;align-items:center;border-left:3px solid transparent}
  .vxD-tn:hover,.vxD-tn.hov{background:#2f3239}.vxD-tn.sel{background:rgba(66,184,131,.28);border-left-color:#42b883;color:#fff}
  .vxD-tn .lt{color:#8f96a8}.vxD-tn .nm{color:#42b883}.vxD-tn.sel .nm{color:#9af0c6}.vxD-tn .arr{color:#8f96a8;width:1em}
  .vxD-insp{flex:1;min-width:0;padding:8px 10px;display:flex;flex-direction:column;gap:6px;overflow:hidden}
  .vxD-ih{font:900 .9rem var(--mono);color:#42b883;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .vxD-ih small{font:800 .8rem var(--font);color:#9aa3c0;background:#2f3239;padding:0 .6em;border-radius:99px}
  .vxD-sec{font:900 .8rem var(--font);color:#9aa3c0;letter-spacing:.05em;border-bottom:1px solid #3a3d44;padding-bottom:2px;margin-top:2px;border-radius:0}
  .vxD-ir{display:grid;grid-template-columns:minmax(4.2em,auto) minmax(0,1fr) auto;gap:6px;align-items:center;padding:2px 4px;border-radius:6px}
  .vxD-ir .k{color:#e8a4d3}.vxD-ir .v{color:#9cdcfe;min-width:0;overflow-wrap:anywhere}
  .vxD-ir .sv{display:flex;align-items:center;gap:2px}.vxD-ir .tg{font:800 .8rem var(--font);color:#8f96a8;background:#2f3239;padding:0 .5em;border-radius:99px}
  .vxD-ir input[type=text],.vxD-ir input[type=number]{background:#15171a;color:#ffd479;border:1px solid #4a4e58;border-radius:5px;padding:2px 6px;font:700 .84rem var(--mono);width:100%;min-width:0;box-sizing:border-box}
  .vxD-ir input:focus{outline:2px solid #42b883}
  .vxD-ir input[type=checkbox]{accent-color:#42b883;width:16px;height:16px}
  .vxD-none{color:#7c8294;font:700 .84rem var(--font);padding:2px 4px}
  .vxD-empty{padding:16px;color:#9aa3c0;font:700 .9rem/1.6 var(--font)}
  .vxD-ro .v{color:#b8bdca}
  .vxD-dom{padding:8px 6px;display:flex;flex-direction:column;gap:1px;font:700 .84rem/1.5 var(--mono);flex:1}
  .vxD-dl{padding:.1em .5em;border-radius:4px;white-space:pre;color:#9aa3c0;border-left:3px solid transparent}
  .vxD-dl .t{color:#e8a4d3}.vxD-dl .a{color:#ffd479}.vxD-dl .s{color:#9cdcfe}
  .vxD-dl.sel{background:rgba(74,144,226,.35);color:#fff;border-left-color:#4a90e2}
  .vxD-note{padding:6px 10px;border-top:1px solid #3a3d44;color:#9aa3c0;font:700 .8rem/1.5 var(--font)}
  .vxD-note b{color:#ffb454}
  /* Timeline */
  .vxD-tlw{flex:1;min-width:0;display:flex;flex-direction:column}
  .vxD-tlt{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid #3a3d44;font:800 .8rem var(--font);color:#aab0be}
  .vxD-rec{width:12px;height:12px;border-radius:50%;background:#ff5a5f;display:inline-block;animation:vxDq 1.2s infinite}
  .vxD-lane{display:grid;grid-template-columns:7.6em minmax(0,1fr);border-bottom:1px solid #33363d;min-height:42px}
  .vxD-lane .ln{padding:8px 10px;font:800 .8rem var(--font);color:#aab0be;border-right:1px solid #33363d;display:flex;align-items:center;gap:6px}
  .vxD-trk{position:relative;overflow:hidden;background:repeating-linear-gradient(90deg,transparent 0 75px,rgba(255,255,255,.05) 75px 76px)}
  .vxD-ev{all:unset;position:absolute;top:7px;cursor:pointer;padding:.15em .7em;border-radius:6px;font:800 .8rem var(--mono);color:#06101f;transition:.2s;animation:vxDe .4s}
  @keyframes vxDe{from{transform:scale(.3);opacity:0}}
  .vxD-ev.sel{outline:2px solid #fff;outline-offset:2px}
  .vxD-det{padding:8px 10px;display:grid;gap:3px;font:700 .84rem/1.5 var(--mono);min-height:7.5em;align-content:start}
  /* 窓の下の補助 */
  .vxD-tree2{background:var(--code);color:#d8dcff;border-radius:10px;padding:10px 14px;font:700 .85rem/1.75 var(--mono);white-space:pre;overflow:auto}
  .vxD-tree2 .f{display:inline-block;padding:0 .4em;border-radius:5px;transition:.2s}.vxD-tree2 .f.on{background:rgba(66,184,131,.35);color:#fff;box-shadow:0 0 0 2px #42b883}
  /* 入れ方 */
  .vxD-steps{display:flex;gap:8px;flex-wrap:wrap}
  .vxD-sb{all:unset;cursor:pointer;box-sizing:border-box;padding:6px 12px;border:2px solid var(--line);border-radius:12px;background:var(--card);display:flex;gap:8px;align-items:center;font:800 .88rem/1.35 var(--font);transition:.2s}
  .vxD-sb i{font-style:normal;flex:none;width:1.7em;height:1.7em;border-radius:50%;display:grid;place-items:center;background:var(--line);font:900 .85rem var(--font)}
  .vxD-sb.past{border-color:color-mix(in srgb,var(--ok) 55%,var(--line))}.vxD-sb.past i{background:var(--ok);color:#06101f}
  .vxD-sb.on{border-color:var(--vue);background:color-mix(in srgb,var(--vue) 16%,var(--card));transform:translateY(-2px)}.vxD-sb.on i{background:var(--vue);color:#06101f}
  .vxD-store{background:#fff;color:#1f2a44;padding:14px;display:grid;gap:10px;align-content:start;min-height:250px;flex:1}
  .vxD-sbox{display:flex;gap:8px;align-items:center;border:2px solid #b9c4e2;border-radius:99px;padding:5px 14px;font:700 .9rem var(--font);min-height:2em}
  .vxD-sbox.t:after{content:"|";animation:vxDq 1s infinite}
  .vxD-res{display:flex;gap:12px;align-items:center;border:1px solid #d5d9e0;border-radius:12px;padding:10px 12px}
  .vxD-res .big{width:44px;height:44px;border-radius:10px;background:#42b883;color:#fff;display:grid;place-items:center;flex:none}
  .vxD-res b{font:900 .95rem var(--font)}.vxD-res small{display:block;font:700 .8rem var(--font);color:#5b6788}
  .vxD-add{all:unset;cursor:pointer;margin-left:auto;padding:.4em 1em;border-radius:99px;background:#2f7bff;color:#fff;font:800 .85rem var(--font);white-space:nowrap}
  .vxD-add.press{transform:scale(.92);background:#1b57c8}.vxD-add.done{background:#2fa56b}
  .vxD-toast{position:absolute;right:12px;top:8px;background:#1f2a44;color:#fff;padding:.4em .9em;border-radius:10px;font:800 .82rem var(--font);display:none;z-index:6}.vxD-toast.on{display:block;animation:vxDp .4s}
  .vxD-keys{position:absolute;right:10px;top:10px;display:none;gap:6px;align-items:center;z-index:6;font:800 .8rem var(--font);color:#1f2a44;background:#fff7e0;border:2px solid #e0a21a;border-radius:10px;padding:4px 10px}.vxD-keys.on{display:flex;animation:vxDp .4s}
  .vxD-keys kbd{background:#fff;border:1px solid #aab;border-bottom-width:3px;border-radius:6px;padding:0 .5em;font:800 .8rem var(--mono)}
  .vxD-floatv{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);display:none;align-items:center;gap:6px;background:#1f2125;color:#42b883;border-radius:99px;padding:4px 14px;font:800 .8rem var(--font);box-shadow:0 6px 18px rgba(0,0,0,.35);z-index:5}.vxD-floatv.on{display:inline-flex}
  .vxD-chips{display:grid;gap:8px}
  .vxD-chip{all:unset;box-sizing:border-box;cursor:default;display:grid;grid-template-columns:auto 1fr;gap:2px 10px;align-items:center;padding:.5em .9em;border-radius:12px;border:2px solid var(--c);background:color-mix(in srgb,var(--c) 10%,var(--card));font:800 .9rem/1.45 var(--font);transition:.2s}
  .vxD-chip small{grid-column:2;font:700 .82rem var(--font);color:var(--mute)}
  .vxD-chip i{font-style:normal;font-size:1rem;grid-row:1/3}
  .vxD-chip:hover,.vxD-chip.on{box-shadow:0 0 0 4px color-mix(in srgb,var(--c) 25%,transparent)}
  button.vxD-chip{cursor:pointer}
  .vxD-links{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px}
  .vxD-link{display:grid;gap:3px;padding:.6em .9em;border-radius:12px;border:2px solid var(--line);background:var(--card);text-decoration:none;color:var(--text);transition:.2s}
  .vxD-link:hover{border-color:var(--vue);transform:translateY(-2px)}
  .vxD-link b{font:900 .9rem/1.4 var(--font)}.vxD-link small{font:700 .82rem/1.45 var(--font);color:var(--mute)}.vxD-link span{font:700 .78rem var(--mono);color:var(--vue);overflow-wrap:anywhere}
  /* 症状 */
  .vxD-sy{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
  @media(max-width:900px){.vxD-sy{grid-template-columns:repeat(2,minmax(0,1fr))}}
  .vxD-sc{all:unset;box-sizing:border-box;cursor:pointer;border:2px solid var(--line);border-radius:12px;background:var(--card);padding:.6em .9em;font:800 .9rem/1.45 var(--font);display:flex;gap:8px;align-items:center;transition:.2s;min-height:3.6em}
  .vxD-sc:hover{border-color:var(--vue);transform:translateY(-2px)}.vxD-sc.on{border-color:var(--vue);background:color-mix(in srgb,var(--vue) 14%,var(--card))}
  .vxD-sc i{font-style:normal;width:1.6em;height:1.6em;border-radius:50%;background:var(--card2);display:grid;place-items:center;flex:none;font:900 .8rem var(--font)}
  .vxD-rows{padding:8px 10px;display:grid;gap:3px;flex:1;align-content:start}
  .vxD-rr{display:flex;gap:10px;align-items:center;padding:3px 8px;border-radius:6px;opacity:0;transform:translateX(-8px);transition:.35s;border:1px solid transparent}
  .vxD-rr.in{opacity:1;transform:none}.vxD-rr.hot{background:rgba(255,107,122,.2);border-color:#ff6b7a}.vxD-rr .k{color:#e8a4d3}.vxD-rr .v{color:#9cdcfe;overflow-wrap:anywhere}.vxD-rr .tg{margin-left:auto;font:800 .8rem var(--font);color:#8f96a8}
  .vxD-info{display:grid;gap:8px;align-content:start}
  .vxD-info .row{padding:.5em .8em;border-radius:10px;background:var(--card2);font:800 .9rem/1.55 var(--font);opacity:0;transition:.4s}.vxD-info .row.in{opacity:1}
  .vxD-info .row b{color:var(--vue)}
  .vxD-ck{display:flex;gap:8px;align-items:flex-start;font:800 .9rem/1.5 var(--font);opacity:.45;transition:.3s}.vxD-ck.in{opacity:1}.vxD-ck i{font-style:normal;width:1.4em;height:1.4em;border-radius:6px;border:2px solid var(--line);display:grid;place-items:center;flex:none;font-size:.85rem;color:transparent}.vxD-ck.in i{background:var(--ok);border-color:var(--ok);color:#06101f}
  .vxD-rule{padding:.7em 1.1em;border-radius:12px;border:2px solid var(--vue);background:color-mix(in srgb,var(--vue) 14%,var(--card));font:900 1.05rem/1.5 var(--font);text-align:center}
  `);

  /* ---------- 共通の道具 ---------- */
  const ICONS = {
    vue: '<path d="M2 3l6 10 6-10" stroke-width="2.4"/>',
    comp: '<rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="5.5" y="9" width="5" height="5" rx="1"/>',
    tl: '<path d="M2 4h6M5 8h8M3 12h7"/>',
    store: '<ellipse cx="8" cy="4" rx="5" ry="2"/><path d="M3 4v8c0 1.1 2.2 2 5 2s5-.9 5-2V4M3 8c0 1.1 2.2 2 5 2s5-.9 5-2"/>',
    route: '<path d="M3 2.5h8l2 2-2 2H3zM13 9.5H5l-2 2 2 2h8z"/>',
    puzzle: '<path d="M3 6h3V4.5a1.5 1.5 0 013 0V6h3v3h-1.5a1.5 1.5 0 000 3H12v2H3z"/>',
    more: '<circle cx="3.5" cy="8" r=".8"/><circle cx="8" cy="8" r=".8"/><circle cx="12.5" cy="8" r=".8"/>',
    search: '<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/>',
  };
  const ic = (n) => h('span', { class: 'vxD-ic', html: '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + ICONS[n] + '</svg>' });
  const bump = (el) => { if (!el) return; el.classList.remove('vxD-bump'); void el.offsetWidth; el.classList.add('vxD-bump'); };
  const shake = (el) => { if (!el) return; el.classList.remove('vxD-shake'); void el.offsetWidth; el.classList.add('vxD-shake'); };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const btn = (label, onclick, cls) => h('button', { class: 'btn' + (cls ? ' ' + cls : ''), type: 'button', style: cls === 'primary' ? { '--c': VUE } : {}, onclick }, label);
  const box = (title, ...kids) => h('div', { class: 'vxD-box' }, h('div', { class: 'vxD-tt' }, title), ...kids);
  const mkPre = (src, lang, file, color) => code([].concat(src).join('\n'), lang, { color: color || VUE, file, dim: false, edit: false });
  async function fly(host, from, to, text, col) {
    if (!from || !to || !host.isConnected) return;
    const hr = host.getBoundingClientRect(), a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    const el = h('span', { class: 'vxD-pkt', style: { background: col || GREEN } }, text); host.append(el);
    const w = el.offsetWidth, hh = el.offsetHeight, pt = (r) => ({ x: r.left - hr.left + r.width / 2 - w / 2, y: r.top - hr.top + r.height / 2 - hh / 2 });
    const A = pt(a), B = pt(b);
    try { await el.animate([{ transform: `translate(${A.x}px,${A.y}px) scale(.6)`, opacity: 0 }, { transform: `translate(${A.x}px,${A.y}px)`, opacity: 1, offset: .15 }, { transform: `translate(${B.x}px,${B.y}px)`, opacity: 1, offset: .85 }, { transform: `translate(${B.x}px,${B.y}px) scale(.6)`, opacity: 0 }], { duration: 800, easing: 'ease-in-out' }).finished; } catch (e) { /* 途中で消えてもよい */ }
    el.remove();
  }
  /* 行の検索：トークンを含む行の番号（1 始まり） */
  const lnOf = (pre, toks) => { const o = []; pre.lines.forEach((l, i) => { if ((toks || []).some((t) => l.textContent.includes(t))) o.push(i + 1); }); return o; };
  /* インスペクターの行（data-k）⇄ コードの行。pre と map は set() で差し替えられる */
  function linker(root) {
    let pre = null, map = {};
    const on = (k) => { if (pre) pre.setHi(lnOf(pre, map[k]), 'on'); root.querySelectorAll('[data-k]').forEach((n) => n.classList.toggle('vxD-hot', n.getAttribute('data-k') === k)); };
    const off = () => { if (pre) pre.setHi([], 'on'); root.querySelectorAll('.vxD-hot').forEach((n) => n.classList.remove('vxD-hot')); };
    root.addEventListener('mouseover', (e) => { const n = e.target.closest && e.target.closest('[data-k]'); if (n && map[n.getAttribute('data-k')]) on(n.getAttribute('data-k')); });
    root.addEventListener('mouseout', (e) => { const n = e.target.closest && e.target.closest('[data-k]'); if (n) off(); });
    return {
      set(p, m) {
        pre = p; map = m || {}; off();
        p.lines.forEach((ln) => { ln.addEventListener('mouseenter', () => { const k = Object.keys(map).find((kk) => map[kk].some((t) => ln.textContent.includes(t))); if (k) on(k); }); ln.addEventListener('mouseleave', off); });
      },
    };
  }
  /* DevTools の枠（Chrome のタブ列 ＋ Vue DevTools のサブタブ） */
  const SUBS = [['comp', 'Components', 'comp'], ['pinia', 'Pinia', 'store'], ['router', 'Router', 'route'], ['tl', 'Timeline', 'tl']];
  function dock(active, onTab) {
    const strip = h('div', { class: 'vxD-strip' }, ...['Elements', 'Console', 'Sources', 'Network'].map((t) => h('span', { class: 'vxD-ct', 'data-ct': t }, t)), h('span', { class: 'vxD-ct vue on' }, ic('vue'), 'Vue'));
    const sub = h('div', { class: 'vxD-sub' });
    const body = h('div', { class: 'vxD-body' });
    const btns = {};
    SUBS.forEach(([k, l, i]) => { const b = h('button', { class: 'vxD-st' + (k === active ? ' on' : '') + (onTab ? '' : (k === active ? '' : ' dim')), type: 'button', title: onTab || k === active ? '' : 'このシーンでは使わない', onclick: () => onTab && onTab(k) }, ic(i), l); btns[k] = b; sub.append(b); });
    sub.append(h('span', { class: 'vxD-st dim', title: 'Assets・Graph・Settings など' }, ic('more')));
    const el = h('div', { class: 'vxD-dock' }, strip, sub, body);
    return { el, body, strip, sub, btns, set(k) { Object.keys(btns).forEach((x) => btns[x].classList.toggle('on', x === k)); } };
  }
  /* ブラウザの窓。body に中身を入れる */
  function win(addr, tabTitle, ...kids) {
    const ext = h('span', { class: 'vxD-extv' }, ic('vue'));
    const a = h('div', { class: 'vxD-addr' }, addr);
    const bar = h('div', { class: 'vxD-wbar' }, h('div', { class: 'vxD-dots' }, h('i'), h('i'), h('i')), h('span', { class: 'vxD-wtab' }, tabTitle), a, h('div', { class: 'vxD-exts' }, ext, ic('puzzle')));
    const body = h('div', { class: 'vxD-wbody' }, ...kids);
    return { el: h('div', { class: 'vxD-win' }, bar, body), body, addr: a, ext, tabTitle: bar.querySelector('.vxD-wtab') };
  }
  /* インスペクター。spec = { name, file, sections:[{ t, rows:[{ k, v, type:'string'|'number'|'boolean'|'ro', tag, key, on }] }] } */
  function inspector(spec) {
    const el = h('div', { class: 'vxD-insp' });
    el.append(h('div', { class: 'vxD-ih' }, '<' + spec.name + ' />', h('small', spec.file)));
    spec.sections.forEach((s) => {
      el.append(h('div', { class: 'vxD-sec', 'data-k': s.key || null }, s.t));
      if (!s.rows.length) el.append(h('div', { class: 'vxD-none' }, '（なし）'));
      s.rows.forEach((r) => {
        let v;
        if (r.type === 'string') { v = h('span', { class: 'v sv' }, '"', h('input', { type: 'text', value: r.v, 'aria-label': r.k, oninput: (e) => r.on(e.target.value) }), '"'); }
        else if (r.type === 'number') { v = h('input', { type: 'number', value: r.v, 'aria-label': r.k, oninput: (e) => r.on(Number(e.target.value) || 0) }); }
        else if (r.type === 'boolean') { const c = h('input', { type: 'checkbox', 'aria-label': r.k, onchange: (e) => { r.on(e.target.checked); t.textContent = String(e.target.checked); } }); c.checked = !!r.v; const t = h('span', { class: 'v' }, String(!!r.v)); v = h('span', { style: { display: 'flex', gap: '8px', alignItems: 'center' } }, c, t); }
        else v = h('span', { class: 'v', 'data-live': r.live || null }, r.v);
        el.append(h('div', { class: 'vxD-ir' + (r.type === 'ro' ? ' vxD-ro' : ''), 'data-k': r.key || null }, h('span', { class: 'k' }, r.k + ':'), v, h('span', { class: 'tg' }, r.tag || '')));
      });
    });
    return el;
  }
  const LINKS = [
    ['Vue DevTools 公式ドキュメント', 'https://devtools.vuejs.org/', '最初に開くページ。何ができるかが分かる'],
    ['インストール', 'https://devtools.vuejs.org/getting-started/installation', 'Vite プラグインと Chrome 拡張の入れ方'],
    ['機能一覧', 'https://devtools.vuejs.org/getting-started/features', 'Components・Timeline・Router・Pinia ほか'],
    ['Vue 公式ガイド「ブラウザ DevTools」', 'https://vuejs.org/guide/scaling-up/tooling.html#browser-devtools', 'Vue 本体のガイドでの紹介'],
    ['Chrome ウェブストア『Vue.js devtools』', 'https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd', '拡張機能の入手ページ'],
  ];
  const linkRow = () => h('div', { class: 'vxD-box' }, h('div', { class: 'vxD-tt' }, '📎 参考リンク（公式）'), h('div', { class: 'vxD-links' }, ...LINKS.map(([t, u, d]) => h('a', { class: 'vxD-link', href: u, target: '_blank', rel: 'noopener' }, h('b', t), h('small', d), h('span', u.replace(/^https:\/\//, ''))))));
  const REF = [{ title: '公式の参考リンク', icon: 'book-open', html: '<div style="display:grid;gap:8px">' + LINKS.map(([t, u, d]) => '<a href="' + u + '" target="_blank" rel="noopener"><b>' + t + '</b></a><span style="font-size:.85rem;opacity:.8">' + d + '</span>').join('') + '</div>' }];

  /* ================= 1. ふつうの DevTools だけだと、困る ================= */
  const DOM_SRC = [
    '<div class="card">',
    '  <h3>山田 太郎</h3>',
    '  <p class="field">労働問題</p>',
    '  <span class="price">3,300円</span>',
    '  <button class="btn">予約する</button>',
    '</div>',
  ].join('\n');
  const CARD1_SRC = [
    '<script setup lang="ts">',
    "import { computed } from 'vue'",
    '',
    'const props = defineProps<{',
    '  name: string',
    '  field: string',
    '  fee: number',
    '}>()',
    '',
    'const priceLabel = computed<string>(',
    "  () => props.fee.toLocaleString() + '円',",
    ')',
    '</script>',
    '',
    '<template>',
    '  <div class="card">',
    '    <h3>{{ name }}</h3>',
    '    <p class="field">{{ field }}</p>',
    '    <span class="price">{{ priceLabel }}</span>',
    '    <button class="btn">予約する</button>',
    '  </div>',
    '</template>',
  ].join('\n');
  function scene1(el) {
    const S = { fee: 3300, picked: null };
    const priceTxt = () => S.fee.toLocaleString() + '円';
    const mkPage = (ctx, side) => {
      const name = h('h4', { class: 'vxD-pick', 'data-k': 'name', 'data-p': 'name', style: { margin: 0, font: '900 1rem var(--font)', justifySelf: 'start' } }, '山田 太郎');
      const price = h('span', { class: 'vxD-pick', 'data-k': 'price', 'data-p': 'price', style: { font: '900 1.1rem var(--font)', color: '#c0392b', justifySelf: 'start', padding: '0 .4em' } }, priceTxt());
      const card = h('div', { class: 'vxD-card', style: { gap: '4px' } }, name, h('div', { style: { color: '#5b6788' } }, '労働問題'), price, h('span', { class: 'vxD-mb', style: { pointerEvents: 'none' } }, '予約する'));
      return { card, name, price };
    };
    const both = (id) => { const u = ctxRef.ui; u.without.pick(id); u.with.pick(id); ctxRef.banner(id === 'price' ? '右なら一発：<LawyerCard> の props.fee（3300）から、priceLabel が作られている' : '右なら一発：<LawyerCard> の props.name', 'ok'); if (id === 'price') ctxRef.fly(u.with.pg.price, u.with.rowFee, '3300', GREEN); };
    let ctxRef = null;
    const leftUi = (ctx) => {
      ctxRef = ctx;
      const pg = mkPage(ctx, 'l');
      const lines = [['<div class="card">', 'div'], ['  <h3>山田 太郎</h3>', 'name'], ['  <p class="field">労働問題</p>', 'f'], ['  <span class="price">3,300円</span>', 'price'], ['  <button class="btn">予約する</button>', 'b'], ['</div>', 'div']];
      const rows = {};
      const dom = h('div', { class: 'vxD-dom' }, ...lines.map(([t, k]) => { const r = h('div', { class: 'vxD-dl', 'data-k': k === 'name' || k === 'price' ? k : null }, t); rows[k] = r; return r; }));
      const note = h('div', { class: 'vxD-note' }, 'Styles：', h('b', '.price { color: #c0392b }'), ' …色や余白は分かる。部品名・変数名は出ない。');
      const d = h('div', { class: 'vxD-dock', style: { borderRadius: '10px', overflow: 'hidden' } }, h('div', { class: 'vxD-strip' }, h('span', { class: 'vxD-ct on', style: { color: '#9cdcfe' } }, 'Elements'), h('span', { class: 'vxD-ct' }, 'Console'), h('span', { class: 'vxD-ct' }, 'Sources'), h('span', { class: 'vxD-ct' }, 'Network')), dom, note);
      const root = h('div', { style: { display: 'grid', gap: '8px' } }, pg.card, d);
      root.addEventListener('click', (e) => { const p = e.target.closest('[data-p]'); if (p) both(p.getAttribute('data-p')); });
      return { el: root, pg, pick(id) { Object.values(rows).forEach((r) => r.classList.remove('sel')); pg.name.classList.toggle('sel', id === 'name'); pg.price.classList.toggle('sel', id === 'price'); rows[id].classList.add('sel'); bump(rows[id]); }, reset() { Object.values(rows).forEach((r) => r.classList.remove('sel')); pg.name.classList.remove('sel'); pg.price.classList.remove('sel'); } };
    };
    const rightUi = (ctx) => {
      const pg = mkPage(ctx, 'r');
      const tree = h('div', { class: 'vxD-tree' });
      const nodes = [['App', 0, 'app'], ['LawyerSearchPage', 1, 'page'], ['LawyerCard', 2, 'card']];
      const trs = nodes.map(([n, d, id]) => { const r = h('div', { class: 'vxD-tn', style: { paddingLeft: 8 + d * 14 + 'px' }, 'data-id': id }, h('span', { class: 'arr' }, d < 2 ? '▾' : ''), h('span', { class: 'lt' }, '<'), h('span', { class: 'nm' }, n), h('span', { class: 'lt' }, ' />')); tree.append(r); return r; });
      const inspBox = h('div', { class: 'vxD-insp', style: { overflow: 'hidden' } }, h('div', { class: 'vxD-empty' }, '👆 画面の数字を押す → ここに、持ち主の部品が出る'));
      let rowFee = null;
      const d = dock('comp'); d.body.append(tree, inspBox);
      const render = () => {
        const insp = inspector({ name: 'LawyerCard', file: 'LawyerCard.vue', sections: [
          { t: 'props', key: 'props', rows: [{ k: 'name', v: '山田 太郎', type: 'ro', tag: 'props', key: 'name' }, { k: 'field', v: '労働問題', type: 'ro', tag: 'props' }, { k: 'fee', v: S.fee, type: 'number', tag: 'props', key: 'price', on: (v) => { S.fee = v; pg.price.textContent = priceTxt(); const lv = insp.querySelector('[data-live]'); if (lv) lv.textContent = '"' + priceTxt() + '"'; bump(pg.price); } }] },
          { t: 'setup', key: 'setup', rows: [{ k: 'priceLabel', v: '"' + priceTxt() + '"', type: 'ro', tag: 'computed', live: 1, key: 'priceLabel' }] },
        ] });
        inspBox.replaceWith(insp); inspBox.className = insp.className; Object.assign(ctxRef, {}); api.insp = insp; api.rowFee = insp.querySelectorAll('.vxD-ir')[2]; u.rowFee = api.rowFee;
        return insp;
      };
      const api = { insp: null }; const u = { el: h('div', { style: { display: 'grid', gap: '8px' } }, pg.card, d.el), pg, rowFee: null };
      let inspCur = inspBox;
      u.pick = (id) => {
        pg.name.classList.toggle('sel', id === 'name'); pg.price.classList.toggle('sel', id === 'price');
        trs.forEach((t) => t.classList.toggle('sel', t.getAttribute('data-id') === 'card'));
        const insp = inspector({ name: 'LawyerCard', file: 'LawyerCard.vue', sections: [
          { t: 'props', key: 'props', rows: [{ k: 'name', v: '山田 太郎', type: 'ro', tag: 'props', key: 'name' }, { k: 'field', v: '労働問題', type: 'ro', tag: 'props' }, { k: 'fee', v: S.fee, type: 'number', tag: 'props', key: 'price', on: (v) => { S.fee = v; pg.price.textContent = priceTxt(); const lv = insp.querySelector('[data-live]'); if (lv) lv.textContent = '"' + priceTxt() + '"'; bump(pg.price); } }] },
          { t: 'setup', key: 'setup', rows: [{ k: 'priceLabel', v: '"' + priceTxt() + '"', type: 'ro', tag: 'computed', live: 1, key: 'priceLabel' }] },
        ] });
        inspCur.replaceWith(insp); inspCur = insp; u.rowFee = insp.querySelectorAll('.vxD-ir')[2];
        const key = id === 'price' ? u.rowFee : insp.querySelectorAll('.vxD-ir')[0]; bump(key);
      };
      u.reset = () => { S.fee = 3300; pg.price.textContent = priceTxt(); pg.name.classList.remove('sel'); pg.price.classList.remove('sel'); trs.forEach((t) => t.classList.remove('sel')); const e2 = h('div', { class: 'vxD-insp' }, h('div', { class: 'vxD-empty' }, '👆 画面の数字を押す → ここに、持ち主の部品が出る')); inspCur.replaceWith(e2); inspCur = e2; };
      void render;
      u.el.addEventListener('click', (e) => { const p = e.target.closest('[data-p]'); if (p) both(p.getAttribute('data-p')); });
      return u;
    };
    el.append(K.vs.versus({
      banner: '『この数字、どの部品の、どの変数？』',
      bar: [
        { label: '▶ 「3,300円」を調べる', primary: true, onclick: () => both('price') },
        { label: '▶ 「山田 太郎」を調べる', onclick: () => both('name') },
        { label: '⟲ 最初から', onclick: (c) => c.reset() },
      ],
      without: { title: 'ふつうの DevTools（Elements）', file: 'Elements に見える DOM', lang: 'html', src: DOM_SRC, ui: leftUi, keys: { name: ['<h3>'], price: ['class="price"'] }, fold: false },
      with: { title: 'Vue DevTools（Components）', file: 'LawyerCard.vue', lang: 'vue', src: CARD1_SRC, ui: rightUi, keys: { name: ['{{ name }}', '  name: string'], price: ['priceLabel', '  fee: number'], priceLabel: ['priceLabel'] }, fold: false },
    }));
  }

  /* ================= 2. 入れ方と開き方 ================= */
  const VITE_SRC = [
    "import { defineConfig } from 'vite'",
    "import vue from '@vitejs/plugin-vue'",
    "import VueDevTools from 'vite-plugin-vue-devtools'",
    '',
    'export default defineConfig({',
    '  plugins: [vue(), VueDevTools()],',
    '})',
  ];
  function scene2(el) {
    let step = 0, tok = 0, viteOn = false;
    const store = h('div', { class: 'vxD-store' });
    const sbox = h('div', { class: 'vxD-sbox t' }, ic('search'), h('span', { class: 'q' }, ''));
    const add = h('button', { class: 'vxD-add', type: 'button' }, 'Chrome に追加');
    const result = h('div', { class: 'vxD-res', style: { opacity: 0, transition: '.4s' } }, h('div', { class: 'big' }, ic('vue')), h('div', h('b', 'Vue.js devtools'), h('small', '拡張機能'), h('small', 'Vue のページの中身を見るツール')), add);
    const toast = h('div', { class: 'vxD-toast' }, '✓ 拡張機能を追加しました');
    store.append(h('div', { style: { font: '900 .95rem var(--font)', color: '#5b6788' } }, 'Chrome ウェブストア ＞ 拡張機能'), sbox, result);
    /* 画面（開発サーバー） */
    const pgCards = [['離婚の相談', '対応中'], ['相続の相談', '完了']].map(([t, b]) => h('div', { class: 'vxD-card' }, h('h4', t, h('span', { class: 'vxD-badge' + (b === '完了' ? ' done' : '') }, b))));
    const keys = h('div', { class: 'vxD-keys' }, h('kbd', 'F12'), '／Mac は', h('kbd', '⌘'), h('kbd', '⌥'), h('kbd', 'I'));
    const floatV = h('div', { class: 'vxD-floatv' }, ic('vue'), 'Vue（画面の中の DevTools）');
    const app = h('div', { class: 'vxD-view', style: { display: 'none', minHeight: '250px' } }, h('div', { style: { font: '900 1rem var(--font)' } }, '相談ケース一覧'), ...pgCards, keys, floatV);
    const dk = dock('comp'); dk.el.style.display = 'none'; dk.strip.querySelector('.vue').style.display = 'none';
    const tree = ['<App />', '  <CaseListPage />', '    <CaseCard />'].map((t, i) => h('div', { class: 'vxD-tn' + (i === 2 ? ' sel' : ''), style: { paddingLeft: 8 + i * 14 + 'px' } }, t));
    dk.body.append(h('div', { class: 'vxD-tree' }, ...tree), h('div', { class: 'vxD-empty' }, 'props・state がここに出る →（次のシーン）'));
    const w = win('chromewebstore.google.com', 'Chrome ウェブストア', h('div', { style: { display: 'grid', minWidth: 0 } }, store, app), dk.el);
    w.body.className = 'vxD-wbody col'; w.body.style.gridTemplateRows = '1fr auto';
    const SAY = [
      '① <b>Chrome ウェブストア</b>で「<b>Vue.js devtools</b>」を探す。',
      '② 「<b>Chrome に追加</b>」→ 右上にアイコンが増える。',
      '③ 開発サーバーのページで <b>F12</b>（Mac は <b>⌘⌥I</b>）。',
      '④ DevTools に <b>「Vue」タブ</b>が出る。ここから使う。',
    ];
    const why = h('div', { class: 'vxD-why' });
    const typeQ = async (my) => { const q = sbox.querySelector('.q'); q.textContent = ''; for (const c of 'Vue.js devtools') { if (my !== tok) return; q.textContent += c; await sleep(70); } if (my === tok) { result.style.opacity = 1; } };
    const go = async (i) => {
      const my = ++tok; step = i; why.innerHTML = SAY[i];
      [...steps.children].forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('past', k < i); });
      const inStore = i < 2;
      store.style.display = inStore ? '' : 'none'; app.style.display = inStore ? 'none' : '';
      w.addr.textContent = inStore ? 'chromewebstore.google.com' : 'localhost:5173'; w.tabTitle.textContent = inStore ? 'Chrome ウェブストア' : '相談ナビ';
      w.ext.classList.toggle('on', i >= 1);
      dk.el.style.display = i >= 2 ? '' : 'none'; keys.classList.toggle('on', i === 2);
      dk.strip.querySelector('.vue').style.display = i >= 3 ? '' : 'none'; dk.strip.querySelector('.vue').classList.toggle('pulse', i === 3);
      add.className = 'vxD-add' + (i >= 1 ? ' press' : ''); toast.classList.remove('on');
      if (i === 0) { result.style.opacity = 0; typeQ(my); }
      if (i === 1) { result.style.opacity = 1; sbox.querySelector('.q').textContent = 'Vue.js devtools'; await sleep(450); if (my !== tok) return; add.className = 'vxD-add done'; add.textContent = 'Chrome に追加済み'; store.append(toast); toast.classList.add('on'); }
      if (i === 0) add.textContent = 'Chrome に追加';
    };
    const steps = h('div', { class: 'vxD-steps' });
    ['ストアで探す', '「Chrome に追加」', 'F12 で DevTools', '「Vue」タブが出る'].forEach((t, i) => steps.append(h('button', { class: 'vxD-sb', type: 'button', onclick: () => go(i) }, h('i', String(i + 1)), t)));
    const vitePre = mkPre(VITE_SRC, 'ts', 'vite.config.ts', VUE);
    const viteBox = h('div', { class: 'vxD-code', style: { display: 'none' } }, vitePre);
    const addrChip = h('div', { class: 'vxD-chip', style: { '--c': GREEN }, onmouseenter: () => w.addr.classList.add('hot'), onmouseleave: () => w.addr.classList.remove('hot') }, h('i', '✓'), 'ローカルの開発サーバー（npm run dev）で動かしている', h('small', 'localhost:5173 のようなアドレスのとき'));
    const viteChip = h('button', { class: 'vxD-chip', type: 'button', style: { '--c': '#a98bff' }, onclick: () => { viteOn = !viteOn; viteChip.classList.toggle('on', viteOn); viteBox.style.display = viteOn ? '' : 'none'; floatV.classList.toggle('on', viteOn && step >= 2); if (viteOn && step < 2) go(2); floatV.classList.toggle('on', viteOn); } }, h('i', '🧩'), '別の入れ方：Vite プラグイン', h('small', 'vite-plugin-vue-devtools。拡張機能なしで、画面の中に出す（押すと設定）'));
    const chips = h('div', { class: 'vxD-chips' },
      addrChip,
      h('div', { class: 'vxD-chip', style: { '--c': GREEN } }, h('i', '✓'), 'Vue 3 のページ', h('small', '最新の DevTools（v7）は Vue 3 向け。Vue 2 は旧版'))
      , h('div', { class: 'vxD-chip', style: { '--c': '#ff6b7a' } }, h('i', '✖'), '本番ビルドでは出ない（既定）', h('small', '開発用の道具。公開した画面では見えない')),
      viteChip);
    const right = box('入れる前の確認', chips, viteBox, h('div', { class: 'vxD-why' }, 'Vite プラグイン版と Chrome 拡張が、公式の入れ方。ほかのブラウザ向けもある（公式の案内を確認）。'));
    const left = h('div', { class: 'vxD-box' }, h('div', { class: 'vxD-tt' }, 'ブラウザの画面（モック）'), w.el);
    const host = h('div', { class: 'vxD-two' }, left, right);
    el.append(h('div', { class: 'vxD' }, h('div', { class: 'vxD-bar' }, btn('◀ 戻る', () => go(Math.max(0, step - 1))), btn('次へ ▶', () => go(Math.min(3, step + 1)), 'primary'), btn('⟲ 最初から', () => go(0)), why), steps, host, linkRow()));
    go(0);
  }

  /* ================= 3. Components タブ ================= */
  const SRC3 = {
    app: { file: 'src/App.vue', lang: 'vue', map: { cases: ['const cases', '<CaseListPage'] }, src: [
      '<script setup lang="ts">', "import { ref } from 'vue'", "import CaseListPage from './pages/CaseListPage.vue'", '',
      'const cases = ref([', "  { id: 1, title: '離婚の相談', done: false },", "  { id: 2, title: '相続の相談', done: true },", "  { id: 3, title: '残業代の請求', done: false },", '])', '</script>', '',
      '<template>', '  <CaseListPage :cases="cases" />', '</template>'] },
    page: { file: 'src/pages/CaseListPage.vue', lang: 'vue', map: { cases: ['defineProps', 'cases.length', 'v-for'], doneCount: ['doneCount'] }, src: [
      '<script setup lang="ts">', "import { computed } from 'vue'", "import CaseCard from '../components/CaseCard.vue'", '',
      'type Case = { id: number; title: string; done: boolean }', 'const props = defineProps<{ cases: Case[] }>()', '',
      'const doneCount = computed<number>(', '  () => props.cases.filter((c) => c.done).length,', ')', '</script>', '',
      '<template>', '  <CaseCard', '    v-for="c in cases"', '    :key="c.id"', '    :title="c.title"', '    :done="c.done"', '  />', '  <p>完了 {{ doneCount }} / {{ cases.length }} 件</p>', '</template>'] },
    card: { file: 'src/components/CaseCard.vue', lang: 'vue', map: { title: ['  title: string', '{{ title }}'], done: ['  done: boolean', 'props.done'], props: ['const props = defineProps', '}>()'], count: ['const count = ref', '{{ count }}', 'count++'], status: ['const status', '{{ status }}'], setup: ["import { ref"] }, src: [
      '<script setup lang="ts">', "import { ref, computed } from 'vue'", '', 'const props = defineProps<{', '  title: string', '  done: boolean', '}>()', '',
      'const count = ref<number>(0)', 'const status = computed<string>(', "  () => (props.done ? '完了' : '対応中'),", ')', '</script>', '',
      '<template>', '  <div class="card">', '    <h4>{{ title }} <span>{{ status }}</span></h4>', '    <p>相談 {{ count }} 件</p>', '    <button @click="count++">＋ 相談を記録</button>', '  </div>', '</template>'] },
  };
  function scene3(el) {
    const M = { sel: 'c1', cases: [{ id: 1, title: '離婚の相談', done: false, count: 0 }, { id: 2, title: '相続の相談', done: true, count: 2 }, { id: 3, title: '残業代の請求', done: false, count: 1 }] };
    const cardEls = [], pg = {};
    const doneN = () => M.cases.filter((c) => c.done).length;
    const paint = () => {
      M.cases.forEach((c, i) => { const e = cardEls[i]; e.t.textContent = c.title; e.b.textContent = c.done ? '完了' : '対応中'; e.b.className = 'vxD-badge' + (c.done ? ' done' : ''); e.n.textContent = '相談 ' + c.count + ' 件'; });
      pg.foot.textContent = '完了 ' + doneN() + ' / 3 件';
    };
    const list = h('div', { class: 'vxD-list', 'data-n': 'page', 'data-lab': 'CaseListPage' });
    M.cases.forEach((c, i) => {
      const t = h('span'), b = h('span'), n = h('p', { style: { margin: 0, color: '#5b6788' } });
      const plus = h('button', { class: 'vxD-mb', type: 'button', onclick: () => { c.count++; paint(); bump(card); if (M.sel === 'c' + (i + 1)) select(M.sel); } }, '＋ 相談を記録');
      const card = h('div', { class: 'vxD-card', 'data-n': 'c' + (i + 1), 'data-lab': 'CaseCard' }, h('h4', t, b), n, plus);
      cardEls.push({ t, b, n, card }); list.append(card);
    });
    pg.foot = h('p', { style: { margin: 0, font: '800 .85rem var(--font)', color: '#5b6788' } });
    list.append(pg.foot);
    const page = h('div', { class: 'vxD-pg', 'data-n': 'app', 'data-lab': 'App' }, h('h3', '相談ケース一覧'), list);
    const view = h('div', { class: 'vxD-view' }, page);
    /* ツリー */
    const NODES = [['App', 0, 'app'], ['CaseListPage', 1, 'page'], ['CaseCard', 2, 'c1'], ['CaseCard', 2, 'c2'], ['CaseCard', 2, 'c3']];
    const tree = h('div', { class: 'vxD-tree' });
    const trs = {};
    NODES.forEach(([n, d, id]) => { const r = h('div', { class: 'vxD-tn', style: { paddingLeft: 8 + d * 14 + 'px' }, 'data-id': id }, h('span', { class: 'arr' }, d < 2 ? '▾' : ''), h('span', { class: 'lt' }, '<'), h('span', { class: 'nm' }, n), h('span', { class: 'lt' }, ' />')); trs[id] = r; tree.append(r); });
    const inspHost = h('div', { style: { display: 'flex', flex: 1, minWidth: 0 } });
    const d = dock('comp'); d.body.append(tree, inspHost);
    const w = win('localhost:5173', '相談ナビ', view, d.el);
    /* コード＋フォルダ */
    const codeHost = h('div', { class: 'vxD-code' });
    const FT = [['app', 'src/'], ['', '├ components/'], ['card', '│ └ CaseCard.vue'], ['', '├ pages/'], ['page', '│ └ CaseListPage.vue'], ['app', '└ App.vue']];
    const ftree = h('div', { class: 'vxD-tree2' });
    const ftEls = FT.map(([id, t]) => { const row = h('div'); const f = h('span', { class: 'f' }, t); row.append(f); ftree.append(row); return { id, f }; });
    const rootBox = h('div', { class: 'vxD' });
    const lk = linker(rootBox);
    const kindOf = (id) => (id[0] === 'c' ? 'card' : id);
    function select(id) {
      M.sel = id; const kind = kindOf(id), idx = kind === 'card' ? Number(id.slice(1)) - 1 : -1, c = M.cases[idx];
      Object.keys(trs).forEach((k) => trs[k].classList.toggle('sel', k === id));
      page.classList.toggle('sel', id === 'app'); list.classList.toggle('sel', id === 'page'); cardEls.forEach((e, i) => e.card.classList.toggle('sel', id === 'c' + (i + 1)));
      let spec;
      if (kind === 'app') spec = { name: 'App', file: 'App.vue', sections: [{ t: 'props', rows: [] }, { t: 'setup', key: 'setup', rows: [{ k: 'cases', v: 'Array[3]（ref）', type: 'ro', tag: 'ref', key: 'cases' }] }] };
      else if (kind === 'page') spec = { name: 'CaseListPage', file: 'CaseListPage.vue', sections: [{ t: 'props', key: 'props', rows: [{ k: 'cases', v: 'Array[3]', type: 'ro', tag: 'props', key: 'cases' }] }, { t: 'setup', key: 'setup', rows: [{ k: 'doneCount', v: String(doneN()), type: 'ro', tag: 'computed', key: 'doneCount', live: 'dc' }] }] };
      else spec = { name: 'CaseCard', file: 'CaseCard.vue', sections: [
        { t: 'props', key: 'props', rows: [
          { k: 'title', v: c.title, type: 'string', tag: 'props', key: 'title', on: (v) => { c.title = v; paint(); bump(cardEls[idx].card); } },
          { k: 'done', v: c.done, type: 'boolean', tag: 'props', key: 'done', on: (v) => { c.done = v; paint(); bump(cardEls[idx].card); const st = insp.querySelector('[data-live="st"]'); if (st) st.textContent = '"' + (v ? '完了' : '対応中') + '"'; } }] },
        { t: 'setup', key: 'setup', rows: [
          { k: 'count', v: c.count, type: 'number', tag: 'ref', key: 'count', on: (v) => { c.count = v; paint(); bump(cardEls[idx].card); } },
          { k: 'status', v: '"' + (c.done ? '完了' : '対応中') + '"', type: 'ro', tag: 'computed', key: 'status', live: 'st' }] }] };
      const insp = inspector(spec); inspHost.replaceChildren(insp);
      const S = SRC3[kind]; const pre = mkPre(S.src, 'vue', S.file, VUE); codeHost.replaceChildren(pre); lk.set(pre, S.map);
      ftEls.forEach((x) => x.f.classList.toggle('on', x.id === kind));
      codeTitle.textContent = S.file + '（行にカーソル → 右の値が光る）';
    }
    const codeTitle = h('span');
    page.addEventListener('click', (e) => { const n = e.target.closest('[data-n]'); if (n) select(n.getAttribute('data-n')); });
    const setHov = (id, on) => { const t = trs[id]; if (t) t.classList.toggle('hov', on); const pe = id === 'app' ? page : id === 'page' ? list : cardEls[Number(id.slice(1)) - 1].card; if (pe && !pe.classList.contains('sel')) pe.classList.toggle('hov', on); };
    page.addEventListener('mouseover', (e) => { const n = e.target.closest('[data-n]'); page.querySelectorAll('.hov').forEach((x) => x.classList.remove('hov')); Object.values(trs).forEach((t) => t.classList.remove('hov')); if (n) setHov(n.getAttribute('data-n'), true); });
    page.addEventListener('mouseleave', () => { page.querySelectorAll('.hov').forEach((x) => x.classList.remove('hov')); Object.values(trs).forEach((t) => t.classList.remove('hov')); });
    Object.keys(trs).forEach((id) => { trs[id].addEventListener('click', () => select(id)); trs[id].addEventListener('mouseenter', () => setHov(id, true)); trs[id].addEventListener('mouseleave', () => { trs[id].classList.remove('hov'); const pe = id === 'app' ? page : id === 'page' ? list : cardEls[Number(id.slice(1)) - 1].card; pe.classList.remove('hov'); }); });
    const say = h('div', { class: 'vxD-say' }, '👆 ツリーの部品か、左の画面の部品を押す → 枠が付く。右の値を書き換えると、画面が変わる');
    rootBox.append(h('div', { class: 'vxD-bar' }, say, btn('⟲ 最初から', () => { M.cases = [{ id: 1, title: '離婚の相談', done: false, count: 0 }, { id: 2, title: '相続の相談', done: true, count: 2 }, { id: 3, title: '残業代の請求', done: false, count: 1 }]; paint(); select('c1'); })),
      h('div', { class: 'vxD-box' }, h('div', { class: 'vxD-tt' }, 'ブラウザ ＋ Vue DevTools（Components タブ）'), w.el),
      h('div', { class: 'vxD-two' }, box(codeTitle, codeHost), box('フォルダ（選んだ部品のファイル）', ftree, h('div', { class: 'vxD-why' }, 'ref の中身も、.value なしでそのまま見える（→ ref のレッスン x-vue-ref）。'))));
    paint(); select('c1');
    el.append(rootBox);
  }

  /* ================= 4. Timeline ================= */
  const CHILD4 = [
    '<script setup lang="ts">', 'defineProps<{ id: number; title: string }>()', 'const emit = defineEmits<{ remove: [id: number] }>()', '</script>', '',
    '<template>', '  <div class="card">', '    <h4>{{ title }}</h4>', "    <button @click=\"emit('remove', id)\">削除</button>", '  </div>', '</template>'];
  const PARENT4 = (bug) => [
    '<script setup lang="ts">', "import { ref } from 'vue'", "import CaseCard from './CaseCard.vue'", '',
    'const cases = ref([', "  { id: 1, title: '離婚の相談' },", "  { id: 2, title: '相続の相談' },", "  { id: 3, title: '残業代の請求' },", '])', '',
    'const deleteCase = (id: number): void => {', '  cases.value = cases.value.filter((c) => c.id !== id)', '}', '</script>', '',
    '<template>', '  <CaseCard', '    v-for="c in cases"', '    :key="c.id"', '    :id="c.id"', '    :title="c.title"', bug ? '    @delete="deleteCase"' : '    @remove="deleteCase"', '  />', '</template>'];
  function scene4(el) {
    let mode = 0, evs = [], click = 0, selEv = null, list = [1, 2, 3];
    const TITLES = { 1: '離婚の相談', 2: '相続の相談', 3: '残業代の請求' };
    const cards = h('div', { class: 'vxD-pg' }, h('h3', '相談ケース一覧'));
    const wrap = h('div', { class: 'vxD-list', style: { padding: 0 } }); cards.append(wrap);
    const delBtns = {};
    const drawCards = () => {
      wrap.replaceChildren(...(list.length ? list.map((id) => { const b = h('button', { class: 'vxD-mb del', type: 'button', onclick: () => handle(id, b) }, '削除'); delBtns[id] = b; return h('div', { class: 'vxD-card', 'data-id': id }, h('h4', TITLES[id]), b); }) : [h('div', { style: { color: '#5b6788', font: '800 .9rem var(--font)' } }, '（0 件）')]));
    };
    const view = h('div', { class: 'vxD-view' }, cards);
    const mkLane = (name, ico, col) => { const trk = h('div', { class: 'vxD-trk' }); return { el: h('div', { class: 'vxD-lane' }, h('div', { class: 'ln' }, ico, name), trk), trk, col }; };
    const lanes = { mouse: mkLane('Mouse', h('span', '🖱'), '#ffb454'), key: mkLane('Keyboard', h('span', '⌨'), '#a98bff'), comp: mkLane('Component events', h('span', '◆'), '#42b883') };
    lanes.key.trk.append(h('span', { style: { position: 'absolute', left: '10px', top: '10px', color: '#6c7388', font: '700 .8rem var(--font)' } }, '（キー入力なし）'));
    const det = h('div', { class: 'vxD-det' }, h('span', { style: { color: '#9aa3c0', font: '700 .85rem var(--font)' } }, '👆 バーを押すと、詳しい内容が出る'));
    const tl = h('div', { class: 'vxD-tlw' }, h('div', { class: 'vxD-tlt' }, h('span', { class: 'vxD-rec' }), '記録中', h('span', { style: { marginLeft: 'auto' } }, '横軸＝時間')), lanes.mouse.el, lanes.key.el, lanes.comp.el, det);
    const d = dock('tl'); d.body.append(tl);
    const w = win('localhost:5173/cases', '相談ナビ', view, d.el);
    const preC = mkPre(CHILD4, 'vue', 'CaseCard.vue（子）', VUE); const parHost = h('div', { class: 'vxD-code' });
    let preP = mkPre(PARENT4(false), 'vue', 'CaseListPage.vue（親）', VUE); parHost.append(preP);
    const say = h('div', { class: 'vxD-say' }, '👆 左の「削除」を押す → Timeline に、イベントが 1 本ずつ足される');
    const draw = () => {
      const keep = evs.slice(-10);
      Object.values(lanes).forEach((l) => [...l.trk.querySelectorAll('.vxD-ev')].forEach((x) => x.remove()));
      keep.forEach((e) => { const l = lanes[e.lane]; const b = h('button', { class: 'vxD-ev' + (e === selEv ? ' sel' : ''), type: 'button', style: { left: 8 + e.slot * 82 + (e.lane === 'comp' ? 12 : 0) + 'px', background: l.col }, onclick: () => choose(e) }, e.name); l.trk.append(b); });
    };
    const choose = (e) => {
      selEv = e; draw();
      if (e.lane === 'mouse') { det.replaceChildren(h('div', 'イベント：click（マウス）'), h('div', { style: { color: '#9aa3c0' } }, '押した場所は、画面の「削除」ボタン')); preC.setHi([]); preP.setHi([]); return; }
      det.replaceChildren(h('div', { style: { color: '#42b883' } }, 'イベント：remove（emit）'), h('div', '部品：<CaseCard />'), h('div', '引数：[ ' + e.arg + ' ]　← emit(\'remove\', id) の id'), h('div', { style: { color: mode ? '#ff8a96' : '#9aa3c0', font: '700 .84rem var(--font)' } }, mode ? '親（コードで確認）：@delete を聞いている → remove は誰にも届かない' : '親（コードで確認）：@remove="deleteCase" が受け取る'));
      preC.setHi(lnOf(preC, ["emit('remove'", 'defineEmits']), 'on'); preP.setHi(lnOf(preP, [mode ? '@delete' : '@remove']), mode ? 'err' : 'on');
    };
    const handle = async (id, b) => {
      const slot = click % 5; click++; if (slot === 0) evs = [];
      const m = { lane: 'mouse', name: 'click', slot }; evs.push(m); draw();
      await sleep(250);
      const e = { lane: 'comp', name: 'remove', slot, arg: id }; evs.push(e); draw();
      await fly(w.el, b, lanes.comp.trk, 'emit', GREEN);
      choose(e);
      preP.setHi(lnOf(preP, [mode ? '@delete' : '@remove']), mode ? 'err' : 'on');
      if (!mode) { list = list.filter((x) => x !== id); drawCards(); say.className = 'vxD-say ok'; say.textContent = '✓ remove が emit され、親が受け取って一覧から消えた'; }
      else { const card = b.closest('.vxD-card'); shake(card); say.className = 'vxD-say bad'; say.textContent = '✖ Timeline には remove が出ている → 子は emit 済み。親の @名前 を見る（delete ≠ remove）'; }
    };
    const reset = () => { evs = []; click = 0; selEv = null; list = [1, 2, 3]; drawCards(); draw(); det.replaceChildren(h('span', { style: { color: '#9aa3c0', font: '700 .85rem var(--font)' } }, '👆 バーを押すと、詳しい内容が出る')); preC.setHi([]); preP.setHi([]); say.className = 'vxD-say'; say.textContent = mode ? '『emit したのに、親が動かない…』→ 削除を押して、Timeline を見る' : '👆 左の「削除」を押す → Timeline に、イベントが 1 本ずつ足される'; };
    const tabs = h('div', { class: 'vxD-tabs' });
    ['① 親が @remove で受けている', '② 親が @delete と書いている（名前ちがい）'].forEach((t, i) => tabs.append(h('button', { class: 'vxD-tab ' + (i ? 'x' : '') + (i === 0 ? ' on' : ''), type: 'button', onclick: () => { mode = i; [...tabs.children].forEach((b, k) => b.classList.toggle('on', k === i)); preP = mkPre(PARENT4(!!i), 'vue', 'CaseListPage.vue（親）', VUE); parHost.replaceChildren(preP); reset(); } }, t)));
    drawCards();
    el.append(h('div', { class: 'vxD' }, tabs, h('div', { class: 'vxD-bar' }, say, btn('⟲ 最初から', reset)), h('div', { class: 'vxD-box' }, h('div', { class: 'vxD-tt' }, 'ブラウザ ＋ Vue DevTools（Timeline タブ）'), w.el), h('div', { class: 'vxD-two' }, box('子：emit する側', h('div', { class: 'vxD-code' }, preC)), box('親：受け取る側', parHost)), h('div', { class: 'vxD-why' }, 'Timeline は、レイヤー（Mouse・Keyboard・Component events など）ごとに、イベントを時間順に並べる。')));
  }

  /* ================= 5. Pinia と Router ================= */
  const ROUTES = [
    { path: '/', name: 'home', title: 'トップ', meta: {} },
    { path: '/cases', name: 'cases', title: '相談一覧', meta: {} },
    { path: '/cases/:id', name: 'case-detail', title: '案件の詳細', meta: { requiresAuth: true } },
    { path: '/booking', name: 'booking', title: '予約', meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', name: 'not-found', title: 'ページが見つかりません', meta: {} },
  ];
  const NAV = [
    { label: 'トップ', full: '/', r: 0, params: {}, query: {} },
    { label: '相談一覧', full: '/cases', r: 1, params: {}, query: {} },
    { label: '山田さんの案件', full: '/cases/2?tab=memo', r: 2, params: { id: '2' }, query: { tab: 'memo' } },
    { label: '予約', full: '/booking', r: 3, params: {}, query: {} },
    { label: '存在しない URL', full: '/foo', r: 4, params: { pathMatch: 'foo' }, query: {} },
  ];
  function scene5(el) {
    const ST = { unread: 3, items: ['期日のお知らせ', '予約の確認', '資料の依頼'] };
    let tab = 'pinia', cur = 2, storeSel = 'notice';
    const fmt = (o) => { const k = Object.keys(o); return k.length ? '{ ' + k.map((x) => x + ': ' + JSON.stringify(o[x])).join(', ') + ' }' : '{ }'; };
    const badge = h('span', { class: 'vxD-badge', 'data-k': 'bell', style: { background: '#ff6b7a', color: '#fff' } });
    const links = NAV.map((n, i) => h('button', { class: 'vxD-mb', type: 'button', 'data-i': i }, n.label));
    const nav = h('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } }, ...links);
    const head = h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between' } }, h('b', { style: { font: '900 .95rem var(--font)' } }, '相談ナビ'), h('span', { style: { font: '800 .9rem var(--font)' } }, '🔔 通知 ', badge));
    const rv = h('div', { class: 'vxD-card', style: { gap: '4px' } });
    const view = h('div', { class: 'vxD-view' }, head, nav, rv);
    const paintBadge = () => { badge.textContent = ST.unread; badge.style.display = ST.unread > 0 ? '' : 'none'; };
    const paintView = () => { const n = NAV[cur], r = ROUTES[n.r]; rv.replaceChildren(h('h4', r.title), h('div', { style: { font: '700 .85rem var(--mono)', color: '#5b6788' } }, n.full)); links.forEach((b, i) => { b.style.outline = i === cur ? '2px solid #4a90e2' : ''; }); };
    const d = dock('pinia', (k) => { if (k === 'pinia' || k === 'router') { tab = k; draw(); } });
    const w = win('localhost:5173' + NAV[cur].full, '相談ナビ', view, d.el);
    const draw = () => { d.set(tab); if (tab === 'pinia') drawPinia(); else drawRouter(); w.addr.textContent = 'localhost:5173' + NAV[cur].full; };
    function drawPinia() {
      const list = h('div', { class: 'vxD-tree', style: { flex: '0 0 34%' } }, h('div', { class: 'vxD-sec', style: { margin: '0 8px' } }, 'stores'), ...['notice', 'user'].map((s) => h('div', { class: 'vxD-tn' + (s === storeSel ? ' sel' : ''), onclick: () => { storeSel = s; drawPinia(); } }, ic('store'), s)));
      let insp;
      if (storeSel === 'notice') {
        const gh = h('span', { class: 'v' }, ''), gl = h('span', { class: 'v' }, '');
        const upd = () => { gh.textContent = String(ST.unread > 0); gl.textContent = '"' + (ST.unread > 0 ? ST.unread + ' 件' : '未読なし') + '"'; };
        insp = h('div', { class: 'vxD-insp' }, h('div', { class: 'vxD-ih' }, 'notice', h('small', 'stores/notice.ts')), h('div', { class: 'vxD-sec' }, 'state'),
          h('div', { class: 'vxD-ir', 'data-k': 'unread' }, h('span', { class: 'k' }, 'unread:'), h('input', { type: 'number', min: '0', value: ST.unread, 'aria-label': 'unread', oninput: (e) => { ST.unread = Math.max(0, Number(e.target.value) || 0); paintBadge(); upd(); bump(badge); } }), h('span', { class: 'tg' }, 'ref')),
          h('div', { class: 'vxD-ir vxD-ro' }, h('span', { class: 'k' }, 'items:'), h('span', { class: 'v' }, 'Array[3]'), h('span', { class: 'tg' }, 'ref')),
          h('div', { class: 'vxD-sec' }, 'getters'),
          h('div', { class: 'vxD-ir vxD-ro' }, h('span', { class: 'k' }, 'hasUnread:'), gh, h('span', { class: 'tg' }, 'computed')),
          h('div', { class: 'vxD-ir vxD-ro' }, h('span', { class: 'k' }, 'label:'), gl, h('span', { class: 'tg' }, 'computed')));
        upd();
      } else insp = h('div', { class: 'vxD-insp' }, h('div', { class: 'vxD-ih' }, 'user', h('small', 'stores/user.ts')), h('div', { class: 'vxD-sec' }, 'state'), h('div', { class: 'vxD-ir vxD-ro' }, h('span', { class: 'k' }, 'name:'), h('span', { class: 'v' }, '"佐藤 花子"'), h('span', { class: 'tg' }, 'ref')), h('div', { class: 'vxD-ir vxD-ro' }, h('span', { class: 'k' }, 'role:'), h('span', { class: 'v' }, '"staff"'), h('span', { class: 'tg' }, 'ref')));
      d.body.replaceChildren(list, insp);
    }
    function drawRouter() {
      const n = NAV[cur], r = ROUTES[n.r];
      const list = h('div', { class: 'vxD-tree', style: { flex: '0 0 50%' } }, h('div', { class: 'vxD-sec', style: { margin: '0 8px' } }, 'routes'), ...ROUTES.map((x, i) => h('div', { class: 'vxD-tn' + (i === n.r ? ' sel' : ''), style: { flexWrap: 'wrap' } }, h('span', { class: 'nm' }, x.path.length > 14 ? '/:pathMatch(.*)*' : x.path), h('span', { class: 'tg', style: { font: '800 .8rem var(--font)', color: '#8f96a8' } }, x.name), i === n.r ? h('span', { style: { font: '800 .8rem var(--font)', background: '#42b883', color: '#06101f', padding: '0 .5em', borderRadius: '99px' } }, 'active') : null)));
      const row = (k, v, key) => h('div', { class: 'vxD-ir vxD-ro', 'data-k': key || null }, h('span', { class: 'k' }, k + ':'), h('span', { class: 'v' }, v), h('span', { class: 'tg' }, ''));
      const insp = h('div', { class: 'vxD-insp' }, h('div', { class: 'vxD-ih' }, 'Current Route'), row('fullPath', '"' + n.full + '"'), row('name', '"' + r.name + '"', 'name'), row('params', fmt(n.params)), row('query', fmt(n.query)), row('meta', fmt(r.meta)));
      d.body.replaceChildren(list, insp); bump(insp);
    }
    const nav2 = (i) => { cur = i; paintView(); if (tab === 'router') drawRouter(); w.addr.textContent = 'localhost:5173' + NAV[cur].full; };
    links.forEach((b, i) => { b.addEventListener('click', () => { nav2(i); if (tab !== 'router') say.textContent = '画面は切り替わった。Router タブを開くと、今のルートの中身が見える'; else say.textContent = '👆 リンクを押す → Router タブの Current Route と active が変わる'; }); });
    void nav;
    const say = h('div', { class: 'vxD-say' }, '👆 Pinia：unread を書き換える → 左上の通知バッジが変わる。Router：左のリンクを押す');
    paintBadge(); paintView(); drawPinia();
    el.append(h('div', { class: 'vxD' }, h('div', { class: 'vxD-bar' }, say, btn('Pinia タブ', () => { tab = 'pinia'; draw(); }), btn('Router タブ', () => { tab = 'router'; draw(); })),
      h('div', { class: 'vxD-box' }, h('div', { class: 'vxD-tt' }, 'ブラウザ ＋ Vue DevTools（Pinia / Router）'), w.el),
      h('div', { class: 'vxD-why' }, 'Pinia・Router のタブは、アプリにそのライブラリが入っているときに出る。')));
  }

  /* ================= 6. 困ったときの使い方 ================= */
  const SY = [
    { t: '画面の数字が変わらない', tab: 'comp', rows: [['count', '0', 'ref'], ['status', '"対応中"', 'computed']], hot: 0, look: 'Components → その部品の <b>setup</b>（count の値）', cause: '値が変わっていない → 更新の処理が動いていない。値は変わるのに画面が同じ → <b>ref</b> になっているか確認', ck: ['Components で、その数字の部品を選ぶ', 'setup の値を見る（ボタンで変わる？）', '値を手で書き換えて、画面が変わるか見る'] },
    { t: 'props が子に届かない', tab: 'comp', rows: [['title', '"c.title"', 'props'], ['done', 'undefined', 'props']], hot: 0, look: 'Components → <b>子</b>の部品の <b>props</b>', cause: '<b>:</b> の付け忘れ（"c.title" が文字のまま届く）／名前の綴り違い', ck: ['子の部品を選ぶ', 'props の値と型を見る', '親のテンプレートの :title と見比べる'] },
    { t: 'emit したのに親が反応しない', tab: 'tl', rows: [['click', 'Mouse', ''], ['remove', 'Component events', 'emit']], hot: 1, look: 'Timeline → <b>Component events</b> に emit が出るか', cause: '出る → 親の <b>@名前</b> が違う。出ない → 子で emit が呼ばれていない', ck: ['Timeline を開いて、ボタンを押す', 'emit のバーが出るか見る', '名前と引数を、親の @ と見比べる'] },
    { t: 'ストアの値がおかしい', tab: 'pinia', rows: [['unread', '-1', 'state'], ['hasUnread', 'true', 'getter']], hot: 0, look: 'Pinia → ストアの <b>state</b> と getters', cause: 'state が想定外 → 書き換えた処理を探す。画面側は、分割代入でコピーを見ていないか（storeToRefs）', ck: ['Pinia タブで、該当のストアを選ぶ', 'state の値を見る・書き換えてみる', '画面が変わるか見る'] },
    { t: 'URL と画面が合わない', tab: 'router', rows: [['fullPath', '"/cases/2"', ''], ['name', '"not-found"', ''], ['params', '{ pathMatch: "cases/2" }', '']], hot: 1, look: 'Router → <b>Current Route</b> と、active のルート', cause: '意図しないルート（not-found など）に一致している → path・params 名の食い違いを直す', ck: ['Router タブを開く', 'path・name・params を見る', 'ルート一覧で、active が想定どおりか見る'] },
    { t: '本番だけ動かない', tab: 'chrome', rows: [['Vue', '本番モードのため、DevTools では見えない', ''], ['対策', 'npm run build → npm run preview', '']], hot: 1, look: '<b>Console</b> のエラー／<b>Network</b> のリクエスト', cause: 'DevTools は開発ビルド向け（既定）。ローカルで本番ビルドを動かして再現する', ck: ['npm run build で本番用を作る', 'npm run preview で動かして再現', 'Console と Network を見る'] },
  ];
  function scene6(el) {
    const cards = SY.map((s, i) => h('button', { class: 'vxD-sc', type: 'button', onclick: () => run(i) }, h('i', String(i + 1)), s.t));
    const d = dock('comp'); d.strip.parentElement.style.borderRadius = '10px'; d.el.style.borderRadius = '10px'; d.el.style.minHeight = '230px';
    const rowsBox = h('div', { class: 'vxD-rows' }); d.body.append(rowsBox);
    const info = h('div', { class: 'vxD-info' }), ckBox = h('div', { style: { display: 'grid', gap: '6px' } });
    let tok = 0;
    const clear = () => { d.strip.querySelectorAll('.pulse').forEach((x) => x.classList.remove('pulse')); Object.values(d.btns).forEach((b) => b.classList.remove('pulse')); };
    const run = async (i) => {
      const s = SY[i], my = ++tok; cards.forEach((c, k) => c.classList.toggle('on', k === i)); clear();
      rowsBox.replaceChildren(); info.replaceChildren(); ckBox.replaceChildren();
      d.strip.querySelector('.vue').classList.toggle('on', s.tab !== 'chrome'); ['Console', 'Network'].forEach((n) => d.strip.querySelector('[data-ct="' + n + '"]').classList.toggle('on', s.tab === 'chrome'));
      if (s.tab === 'chrome') { ['Console', 'Network'].forEach((n) => d.strip.querySelector('[data-ct="' + n + '"]').classList.add('pulse')); d.set(null); } else { d.set(s.tab); d.btns[s.tab].classList.add('pulse'); }
      await sleep(350); if (my !== tok) return;
      const rr = s.rows.map(([k, v, t], idx) => { const r = h('div', { class: 'vxD-rr' }, h('span', { class: 'k' }, k + ':'), h('span', { class: 'v' }, v), h('span', { class: 'tg' }, t)); rowsBox.append(r); return r; });
      for (const r of rr) { await sleep(220); if (my !== tok) return; r.classList.add('in'); }
      await sleep(250); if (my !== tok) return; rr[s.hot].classList.add('hot');
      const l = h('div', { class: 'row', html: '<b>見る場所</b>：' + s.look }), c = h('div', { class: 'row', html: '<b>ありがちな原因</b>：' + s.cause }); info.append(l, c);
      await sleep(60); l.classList.add('in'); await sleep(350); if (my !== tok) return; c.classList.add('in');
      const cks = s.ck.map((t) => { const x = h('div', { class: 'vxD-ck' }, h('i', '✓'), t); ckBox.append(x); return x; });
      for (const x of cks) { await sleep(400); if (my !== tok) return; x.classList.add('in'); }
    };
    const rule = h('div', { class: 'vxD-rule' }, '『console.log を足す前に、まず DevTools』');
    el.append(h('div', { class: 'vxD' }, h('div', { class: 'vxD-sy' }, ...cards),
      h('div', { class: 'vxD-two' }, box('パネルの動き（モック）', d.el), box('どう調べる？', info, ckBox)),
      h('div', { class: 'vxD-why' }, 'Vite プラグイン版なら、画面の要素から持ち主の部品を探す Inspector や、依存を見る Graph もある（機能一覧を参照）。'),
      rule, linkRow()));
    run(0);
  }

  reg({
    id: 'x-vue-devtools', title: 'Vue DevTools（Chrome 拡張）', sub: '画面の中の部品・props・state を見るツール', emoji: '🔧',
    meta: { cat: 'vue', day: '4日目', when: 'ref や props の値が分からなくなったとき。console.log を増やす前に', mins: 15, order: 38, level: '基礎', after: 'vue-basics', why: '画面が更新されない・props が届かない原因を、コードを足さずに目で確かめられる' },
    scenes: [
      { t: 'ふつうの DevTools だけだと、困る', tag: 'WHY DEVTOOLS', lead: '<b>Vue DevTools</b> は、画面の部品を <b>props と state</b> つきで見せてくれる道具。', render: scene1 },
      { t: '入れ方と開き方', tag: 'INSTALL', lead: '<b>拡張機能</b>を入れて <b>F12</b> を開くと、<b>Vue タブ</b>が出る（開発サーバーのとき）。', render: scene2, ref: REF },
      { t: 'Components タブ：部品ツリーと中身', tag: 'COMPONENTS', lead: '<b>Components タブ</b>は、<b>部品のツリー</b>と、選んだ部品の <b>props・state</b> を見せて、その場で書き換えられる。', render: scene3 },
      { t: 'Timeline：イベントを追う', tag: 'TIMELINE', lead: '<b>Timeline</b> は、<b>emit などのイベント</b>を時間順に並べて見せる。', render: scene4 },
      { t: 'Pinia と Router タブ', tag: 'PINIA / ROUTER', lead: '<b>Pinia</b> タブはストアの state、<b>Router</b> タブは今のルートを見せる。', render: scene5 },
      { t: '困ったときの使い方', tag: 'DEBUG GUIDE', lead: '症状から<b>開くタブ</b>を決める。<b>console.log はそのあと</b>。', render: scene6, ref: REF },
    ],
  });
})();
