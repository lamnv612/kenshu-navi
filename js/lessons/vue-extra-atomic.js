/* 補足 Vue：アトミックデザイン入門（x-vue-atomic）
   1) 部品を、5つの粒度で分ける  2) Atoms  3) Molecules  4) Organisms → Template → Page  5) どこに置く？ 仕分け  6) やりすぎ注意と、決めごと */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.W || !K.vs) return;
  const { h, code, style } = K.W;
  const reg = (o) => K.reg(Object.assign({ track: 'extra' }, o));
  const COLS = ['#ff6b9d', '#5b9dff', '#ffb454', '#2fd4a4', '#a98bff', '#ff8a5b'];
  const VUE = 'var(--vue)', OK = 'var(--ok)', BAD = 'var(--bad)';

  /* 5つの粒度 */
  const LV = [
    { id: 'atom', n: 'Atoms', ja: '原子', c: '#ff6b9d', dir: 'atoms', mean: 'これ以上分けない最小', ex: 'ボタン・入力欄・ラベル' },
    { id: 'mol', n: 'Molecules', ja: '分子', c: '#5b9dff', dir: 'molecules', mean: 'atoms の組み合わせ', ex: '検索ボックス' },
    { id: 'org', n: 'Organisms', ja: '有機体', c: '#ffb454', dir: 'organisms', mean: '画面のまとまり', ex: 'ヘッダー・弁護士カード一覧' },
    { id: 'tpl', n: 'Templates', ja: '骨組み', c: '#2fd4a4', dir: 'templates', mean: 'レイアウトの骨組み（データなし）', ex: '2カラムの枠' },
    { id: 'page', n: 'Pages', ja: '画面', c: '#a98bff', dir: 'pages', mean: 'template にデータを入れた本物の画面', ex: '弁護士検索ページ' },
  ];
  const LVI = Object.fromEntries(LV.map((l, i) => [l.id, i + 1]));
  const LVB = Object.fromEntries(LV.map((l) => [l.id, l]));
  const FILES = [
    ['BaseButton.vue', 'atom'], ['BaseInput.vue', 'atom'], ['BaseLabel.vue', 'atom'], ['BaseAvatar.vue', 'atom'], ['StatusBadge.vue', 'atom'],
    ['SearchBox.vue', 'mol'], ['Pagination.vue', 'mol'],
    ['AppHeader.vue', 'org'], ['LawyerCard.vue', 'org'], ['LawyerList.vue', 'org'],
    ['SearchPageTemplate.vue', 'tpl'], ['LawyerSearchPage.vue', 'page'],
  ].map(([n, lv]) => ({ n, lv, path: (lv === 'page' ? 'pages/' : 'components/' + LVB[lv].dir + '/') + n }));
  const FB = Object.fromEntries(FILES.map((f) => [f.n, f]));

  style('vxT', `
  .vxT{display:grid;gap:14px;min-width:0}
  .vxT .vs-code{max-height:none}
  .vxT-bar{display:flex;gap:10px;flex-wrap:wrap;align-items:stretch}
  .vxT-bar .btn{height:44px;padding:0 1.1em;font-size:.9rem}
  .vxT-say{flex:1;min-width:240px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-height:44px;padding:6px 16px;border-radius:12px;border:2px solid var(--line);background:var(--card);font:800 .92rem/1.55 var(--font);transition:.25s}
  .vxT-say code,.vxT-why code{font:800 .88rem var(--mono);color:var(--vue)}
  .vxT-say.bad{border-color:var(--bad);color:var(--bad)}.vxT-say.ok{border-color:var(--ok)}
  .vxT-why{font:800 .9rem/1.6 var(--font);padding:.5em .9em;border-radius:10px;background:color-mix(in srgb,var(--team) 12%,var(--card));border-left:5px solid var(--team)}
  .vxT-tab{all:unset;cursor:pointer;padding:.45em 1em;border-radius:99px;border:2px solid var(--c,var(--line));background:var(--card2);font:800 .86rem var(--font);transition:.2s;white-space:nowrap}
  .vxT-tab:hover{background:color-mix(in srgb,var(--c,var(--vue)) 22%,var(--card2))}
  .vxT-tab.on{background:var(--c,var(--vue));color:#06101f}
  .vxT-tabs{display:flex;gap:8px;flex-wrap:wrap}
  .vxT-two{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:14px;align-items:stretch}
  @media(max-width:1000px){.vxT-two{grid-template-columns:1fr}}
  .vxT-card{border:2px solid var(--line);border-radius:14px;background:var(--card);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}
  .vxT-card>.tt{font:900 .92rem var(--font);display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .vxT-stage{position:relative;border-radius:12px;background:#f4f6fb;color:#1f2a44;padding:14px;min-width:0;display:flex;flex-direction:column;gap:12px;flex:1}
  .vxT-pkt{position:absolute;left:0;top:0;z-index:9;padding:.2em .85em;border-radius:99px;color:#06101f;font:900 .85rem var(--mono);box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap}
  .vxT-bump{animation:vxTb .7s}@keyframes vxTb{30%{transform:scale(1.06);box-shadow:0 0 0 6px color-mix(in srgb,var(--ok) 45%,transparent)}}
  .vxT [data-k]{cursor:default;transition:outline-color .15s,background .15s}
  .vxT [data-k].vxT-hot{outline:2px solid var(--c,#2f7bff);outline-offset:2px;box-shadow:0 0 0 5px color-mix(in srgb,var(--c,#2f7bff) 22%,transparent)}
  /* コード */
  .vxT-cp{min-width:0;display:flex;flex-direction:column;border-radius:10px;position:relative}
  .vxT-cp>pre.code{margin:0;font-size:.88rem;flex:1 1 auto}
  .vxT-cp .tg{all:unset;cursor:pointer;position:absolute;right:8px;top:6px;z-index:2;padding:.15em .7em;border-radius:99px;border:1px solid var(--line);background:var(--card2);color:var(--mute);font:800 .8rem var(--font)}
  .vxT-cp .tg:hover{color:var(--text)}
  .vxT-fold{display:block;cursor:pointer;color:var(--mute);font-style:italic;padding:3px 0;opacity:.85;user-select:none}.vxT-fold:hover{color:var(--text);opacity:1}
  /* ボタン・入力欄（atoms の見た目） */
  .vxT-bb{font:800 .85rem var(--font);border:0;border-radius:8px;padding:.45em 1em;background:#2f6df0;color:#fff;cursor:pointer;transition:.2s;display:inline-flex;align-items:center;white-space:nowrap}
  .vxT-bb.secondary{background:#e4e9f7;color:#27407f}.vxT-bb.danger{background:#e5484d}.vxT-bb.sm{font-size:.8rem;padding:.25em .7em}.vxT-bb.md{font-size:.95rem;padding:.5em 1.2em}
  .vxT-bb:disabled{opacity:.4;cursor:not-allowed}
  .vxT-bi{font:700 .9rem var(--font);border:2px solid #b9c4e2;border-radius:8px;padding:.45em .8em;background:#fff;color:#1f2a44;min-width:0;width:100%;box-sizing:border-box}
  .vxT-bi:disabled{opacity:.45;background:#eef1f8}
  .vxT-ctl{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:4px 6px;border-radius:8px}
  .vxT-ctl>b{font:800 .8rem var(--mono);color:#5b6788;min-width:5.2em}
  .vxT-chip{all:unset;cursor:pointer;padding:.15em .75em;border-radius:99px;border:2px solid #b9c4e2;background:#fff;color:#27407f;font:800 .8rem var(--mono);transition:.15s}
  .vxT-chip:hover{border-color:#2f6df0}.vxT-chip.on{background:#2f6df0;border-color:#2f6df0;color:#fff}
  .vxT-val{font:800 .88rem var(--mono);padding:.3em .7em;border-radius:8px;background:#fff;border:2px dashed #b9c4e2;color:#1f2a44;word-break:break-all}
  .vxT-small{font:800 .8rem var(--font);color:#5b6788}
  .vxT-rules{display:flex;gap:8px;flex-wrap:wrap}
  .vxT-rules span{font:900 .86rem var(--font);padding:.3em .9em;border-radius:99px;background:color-mix(in srgb,var(--c,var(--ok)) 16%,var(--card2));border:2px solid var(--c,var(--ok));color:var(--text)}
  .vxT-rules span.x{--c:var(--bad)}
  /* フォルダツリー */
  .vxT-tree{font:700 .84rem/1.5 var(--mono);display:flex;flex-direction:column;gap:1px;min-width:0}
  .vxT-tr{display:flex;gap:6px;align-items:baseline;padding:1px 8px;border-radius:6px;border-left:4px solid transparent;transition:.15s;white-space:nowrap;cursor:default}
  .vxT-tr.f{border-left-color:var(--c,transparent)}
  .vxT-tr .nm{color:var(--text)}.vxT-tr .nt{font:800 .8rem var(--font);color:var(--mute);white-space:normal}
  .vxT-tr.d .nm{color:var(--mute)}
  .vxT-tr.dim{opacity:.38}
  .vxT-tr.hot{background:color-mix(in srgb,var(--c,var(--vue)) 24%,transparent);border-left-color:var(--c,var(--vue))}
  .vxT-tr.hot .nm{color:var(--c,var(--vue));font-weight:900}
  .vxT-tr.sec{margin-top:4px}.vxT-tr.sec .nm{font-weight:900;color:var(--c)}
  .vxT-tr.sec .bd{font:900 .8rem var(--font);padding:0 .6em;border-radius:99px;background:var(--c);color:#06101f}
  /* 1: 組み立て */
  .vxT-1{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:14px;align-items:stretch}
  @media(max-width:1000px){.vxT-1{grid-template-columns:1fr}}
  .vxT-col{display:flex;flex-direction:column;gap:10px;min-width:0}
  .vxT-path{display:flex;align-items:center;gap:8px;flex-wrap:wrap;min-height:44px;padding:6px 14px;border-radius:12px;border:2px solid var(--line);background:var(--card);font:800 .88rem/1.5 var(--font);transition:.2s}
  .vxT-path i{font-style:normal;font:900 .8rem var(--font);padding:.1em .8em;border-radius:99px;background:var(--c);color:#06101f}
  .vxT-path code{font:800 .85rem var(--mono);color:var(--text)}
  .vxT-pg{position:relative;display:flex;flex-direction:column;gap:12px;padding:16px 14px 14px;border-radius:12px;background:#f4f6fb;color:#1f2a44;flex:1;min-height:470px;justify-content:space-between;outline:3px solid transparent;outline-offset:-3px;transition:outline-color .4s}
  .vxT-pg.s5{outline-color:#a98bff}
  .vxT-pg.s4::before,.vxT-pg.s5::before{content:attr(data-t);position:absolute;top:-1px;right:12px;padding:.05em .7em;border-radius:0 0 8px 8px;font:900 .8rem var(--mono);color:#06101f;background:var(--tc);z-index:3}
  .vxT-r{position:relative;display:flex;gap:10px;align-items:center;padding:6px 8px;margin-top:6px;border-radius:10px;outline:2px solid transparent;outline-offset:1px;transition:outline-color .35s,background .35s,gap .6s}
  .vxT-r.on{outline-color:var(--lc);background:color-mix(in srgb,var(--lc) 10%,transparent)}
  .vxT-r.cur::before{content:attr(data-t);position:absolute;top:-10px;left:8px;padding:0 .6em;border-radius:6px;font:900 .8rem var(--mono);background:var(--lc);color:#06101f;white-space:nowrap}
  .vxT-ls.cur::before{left:auto;right:10px}
  .vxT-pg.s1 .vxT-r{gap:22px}
  .vxT-a{display:inline-flex;align-items:center;justify-content:center;border-radius:8px;outline:2px dashed transparent;outline-offset:2px;transition:outline-color .35s,background .4s,color .4s}
  .vxT-pg.sa .vxT-a{outline-color:#ff6b9d}
  .vxT-a.btn{background:#2f6df0;color:#fff;font:800 .85rem var(--font);padding:.4em 1em}
  .vxT-a.btn.sm{padding:.2em .7em;background:#e4e9f7;color:#27407f}
  .vxT-a.inp{flex:1;min-width:0;justify-content:flex-start;background:#fff;border:2px solid #b9c4e2;padding:.4em .8em;font:700 .88rem var(--font);color:#6b7699}
  .vxT-a.lbl{font:800 .88rem var(--font)}.vxT-a.lbl.lg{font:900 1.05rem var(--font);color:#1d2b53}.vxT-a.lbl.sub{font:700 .8rem var(--font);color:#5b6788}
  .vxT-a.av{width:2.4em;height:2.4em;border-radius:50%;background:#dfe5f7;font:900 .95rem var(--font);color:#27407f;flex:none}
  .vxT-a.bdg{padding:.1em .8em;border-radius:99px;background:#d9f5ea;color:#127a5c;font:900 .8rem var(--font);white-space:nowrap}
  .vxT-pg.s4 [data-d]{color:transparent!important;background:#cdd5ea!important;border-color:transparent!important}
  .vxT-hd{justify-content:space-between;background:#1d2b53;border-radius:10px}
  .vxT-hd .vxT-a.lbl.lg{color:#fff}
  .vxT-sb{width:100%;box-sizing:border-box}
  .vxT-cd{flex:1}.vxT-cd .info{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}
  .vxT-cd .info .vxT-a{justify-content:flex-start}
  .vxT-ls{flex-direction:column;align-items:stretch;gap:8px}
  .vxT-pgn{justify-content:center}
  .vxT-sl{position:relative;border-radius:10px;outline:2px dashed transparent;outline-offset:3px;transition:outline-color .35s}
  .vxT-pg.s4 .vxT-sl{outline-color:#2fd4a4}
  .vxT-pg.s4 .vxT-sl::after{content:attr(data-sn);position:absolute;right:6px;top:-12px;padding:0 .6em;border-radius:6px;font:900 .8rem var(--mono);background:#2fd4a4;color:#06101f;z-index:2}
  .vxT-pg [data-f].vxT-hl{outline:3px solid #1f2a44!important;outline-offset:3px}
  /* 2〜3 */
  .vxT-par{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:.4em .7em;border-radius:10px;background:#fff;border:2px dashed #b9c4e2;font:800 .85rem var(--mono)}
  .vxT-mg{display:flex;justify-content:center;padding:26px 8px 12px}
  .vxT-sbx{position:relative;display:flex;align-items:stretch;gap:80px;padding:8px;border-radius:12px;outline:3px solid transparent;transition:gap .8s cubic-bezier(.5,0,.2,1),outline-color .5s,background .5s;max-width:100%}
  .vxT-sbx>.at{position:relative;display:flex;align-items:center;outline:2px dashed #ff6b9d;outline-offset:3px;border-radius:8px;transition:outline-color .5s}
  .vxT-sbx>.at.i{flex:1;min-width:150px}
  .vxT-sbx>.at::before{content:attr(data-t);position:absolute;top:-1.55em;left:0;font:900 .8rem var(--mono);color:#d6336c;transition:opacity .4s;white-space:nowrap}
  .vxT-sbx.j{gap:8px;outline-color:#5b9dff;background:#eaf1ff}
  .vxT-sbx.j>.at{outline-color:transparent}.vxT-sbx.j>.at::before{opacity:0}
  .vxT-sbx::after{content:'SearchBox.vue';position:absolute;top:-1.7em;left:6px;font:900 .8rem var(--mono);color:#2f6df0;opacity:0;transition:opacity .5s .3s}
  .vxT-sbx.j::after{opacity:1}
  .vxT-log{font:800 .85rem/1.5 var(--font);padding:.5em .8em;border-radius:10px;background:#0b1020;color:#cfe;min-height:3.2em}
  .vxT-log .g{color:#2fd4a4}.vxT-log .m{color:#8892b8}
  .vxT-mini{display:grid;gap:8px;margin-top:6px}
  /* 4: 入れ子 */
  .vxT-nd{position:relative;display:flex;flex-direction:column;gap:7px;padding:9px 10px;border-radius:12px;border:2px solid var(--lc);background:color-mix(in srgb,var(--lc) 9%,#fff);cursor:default}
  .vxT-nd>.hd{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .vxT-nd>.hd i{font:900 .8rem var(--font);font-style:normal;padding:0 .6em;border-radius:99px;background:var(--lc);color:#06101f}
  .vxT-nd>.hd b{font:900 .88rem var(--mono)}.vxT-nd>.hd small{font:800 .8rem var(--font);color:#5b6788}
  .vxT-own{display:flex;gap:6px;flex-wrap:wrap}
  .vxT-nd .row2{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:8px;align-items:start}
  .vxT-mini-card{display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:9px;border:2px solid var(--lc);background:#fff;font:800 .85rem var(--font)}
  .vxT-mini-card .vxT-bb{margin-left:auto;font-size:.8rem;padding:.15em .7em}
  .vxT-codes{display:flex;flex-direction:column;gap:10px;min-width:0;flex:1}
  .vxT-codes .vxT-cp{flex:1}
  /* 5: 仕分け */
  .vxT-5{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:14px;align-items:stretch}
  @media(max-width:1000px){.vxT-5{grid-template-columns:1fr}}
  .vxT-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;align-content:start}
  .vxT-cc{all:unset;cursor:grab;box-sizing:border-box;padding:.55em .8em;border-radius:10px;border:2px solid var(--line);background:var(--card2);font:800 .9rem var(--font);display:flex;gap:6px;align-items:center;transition:.15s;min-width:0}
  .vxT-cc:hover{border-color:var(--vue)}.vxT-cc.sel{border-color:var(--vue);background:color-mix(in srgb,var(--vue) 22%,var(--card2));transform:translateY(-2px)}
  .vxT-cc.shake{animation:vxTs .35s;border-color:var(--bad)}
  @keyframes vxTs{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
  .vxT-bins{display:grid;gap:8px}
  .vxT-bin{all:unset;cursor:pointer;box-sizing:border-box;display:grid;grid-template-columns:minmax(0,11.5em) minmax(0,1fr);gap:4px 12px;align-items:center;padding:.5em .8em;border-radius:12px;border:2px dashed var(--c);background:color-mix(in srgb,var(--c) 8%,var(--card));transition:.15s;min-height:3.4em}
  .vxT-bin:hover,.vxT-bin.over{background:color-mix(in srgb,var(--c) 22%,var(--card));border-style:solid}
  .vxT-bin .nm{display:flex;flex-direction:column;gap:0}.vxT-bin .nm b{font:900 .9rem var(--font);color:var(--c)}.vxT-bin .nm code{font:800 .8rem var(--mono);color:var(--mute)}
  .vxT-bin .in{display:flex;gap:6px;flex-wrap:wrap;min-height:1.6em}
  .vxT-pl{font:900 .8rem var(--font);padding:.1em .7em;border-radius:99px;background:var(--c);color:#06101f;animation:vxTp .5s}
  @keyframes vxTp{from{transform:scale(.3);opacity:0}}
  .vxT-sc{display:flex;gap:12px;align-items:center;font:900 .95rem var(--font)}.vxT-sc b{font:900 1.5rem var(--font);color:var(--ok)}
  .vxT-fb{min-height:2.9em;flex:1;display:flex;align-items:center;padding:.4em 1em;border-radius:12px;border:2px solid var(--line);background:var(--card);font:800 .9rem/1.5 var(--font);transition:.2s}
  .vxT-fb.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 12%,var(--card))}.vxT-fb.ng{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 12%,var(--card))}.vxT-fb.wr{border-color:var(--team);background:color-mix(in srgb,var(--team) 12%,var(--card))}
  /* 6 */
  .vxT-stack{display:flex;flex-direction:column;gap:0;flex:1}
  .vxT-ly{all:unset;cursor:pointer;box-sizing:border-box;display:flex;align-items:center;gap:10px;padding:.55em .9em;border-radius:12px;border:2px solid var(--c);background:color-mix(in srgb,var(--c) 10%,var(--card));transition:.2s;min-height:2.8em}
  .vxT-ly:hover{background:color-mix(in srgb,var(--c) 24%,var(--card))}
  .vxT-ly.src{background:var(--c);color:#06101f}
  .vxT-ly b{font:900 .92rem var(--font)}.vxT-ly code{font:800 .8rem var(--mono);opacity:.8}
  .vxT-ly .st{margin-left:auto;font:900 .85rem var(--font);padding:.1em .8em;border-radius:99px;white-space:nowrap}
  .vxT-ly.ok{outline:3px solid var(--ok);outline-offset:1px}.vxT-ly.ok .st{background:var(--ok);color:#06101f}
  .vxT-ly.no{outline:3px solid var(--bad);outline-offset:1px;opacity:.75}.vxT-ly.no .st{background:var(--bad);color:#06101f}
  .vxT-ly.same .st{background:var(--card2);border:1px solid var(--line);color:var(--mute)}
  .vxT-arw{display:grid;place-items:center;height:1.5em;font:900 1rem var(--mono);color:var(--mute);position:relative}
  .vxT-arw::after{content:'';position:absolute;left:50%;top:0;bottom:0;border-left:3px dotted var(--line)}
  .vxT-arw span{position:relative;z-index:1;background:var(--card);padding:0 .4em;color:var(--ok);font:900 .8rem var(--font)}
  .vxT-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:stretch}
  @media(max-width:1000px){.vxT-3{grid-template-columns:1fr}}
  .vxT-it{display:flex;gap:10px;align-items:flex-start;padding:.5em .7em;border-radius:10px;background:var(--card2);font:800 .88rem/1.5 var(--font)}
  .vxT-it i{flex:none;font-style:normal;width:1.7em;height:1.7em;border-radius:50%;display:grid;place-items:center;background:var(--c,var(--vue));color:#06101f;font:900 .85rem var(--font)}
  .vxT-it small{display:block;font:700 .8rem var(--font);color:var(--mute)}
  .vxT-it code,.vxT-it small code{font:800 .8rem var(--mono);color:var(--vue)}
  `);

  /* ---------- 共通の道具 ---------- */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const bump = (el) => { if (!el) return; el.classList.remove('vxT-bump'); void el.offsetWidth; el.classList.add('vxT-bump'); };
  const btn = (label, onclick, cls) => h('button', { class: 'btn' + (cls ? ' ' + cls : ''), type: 'button', style: cls === 'primary' ? { '--c': VUE } : {}, onclick }, label);
  const tabBtn = (label, onclick, c) => h('button', { class: 'vxT-tab', type: 'button', style: c ? { '--c': c } : {}, onclick }, label);
  async function fly(host, from, to, text, col, ms) {
    if (!from || !to || !host.isConnected) return;
    const hr = host.getBoundingClientRect(), a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    const el = h('span', { class: 'vxT-pkt', style: { background: col || '#2fd4a4' } }, text); host.append(el);
    const w = el.offsetWidth, hh = el.offsetHeight, pt = (r) => ({ x: r.left - hr.left + r.width / 2 - w / 2, y: r.top - hr.top + r.height / 2 - hh / 2 });
    const A = pt(a), B = pt(b), d = ms || 800;
    try {
      const an = el.animate([{ transform: `translate(${A.x}px,${A.y}px) scale(.6)`, opacity: 0 }, { transform: `translate(${A.x}px,${A.y}px)`, opacity: 1, offset: .15 }, { transform: `translate(${B.x}px,${B.y}px)`, opacity: 1, offset: .85 }, { transform: `translate(${B.x}px,${B.y}px) scale(.6)`, opacity: 0 }], { duration: d, easing: 'ease-in-out' });
      await Promise.race([an.finished, sleep(d + 150)]);
    } catch (e) { /* 途中で消えてもよい */ }
    el.remove();
  }
  const lnOf = (pre, toks) => { const o = []; if (pre && pre.lines) pre.lines.forEach((l, i) => { if ((toks || []).some((t) => l.textContent.includes(t))) o.push(i + 1); }); return o; };
  /* root 内の [data-k] 部品 ⇄ コードの行。set(pres, map) で何度でも差し替えられる。map = { key: [pre0 のトークン, pre1 のトークン…] } */
  function linker(root) {
    const S = { pres: [], map: {} };
    const setHi = (ks) => S.pres.forEach((pre, pi) => pre.setHi(ks.length ? [...new Set([].concat(...ks.map((k) => lnOf(pre, (S.map[k] || [])[pi]))))] : [], 'on'));
    const on = (ks) => { setHi(ks); root.querySelectorAll('[data-k]').forEach((n) => n.classList.toggle('vxT-hot', ks.includes(n.getAttribute('data-k')))); };
    const off = () => { setHi([]); root.querySelectorAll('.vxT-hot').forEach((n) => n.classList.remove('vxT-hot')); };
    return {
      on, off,
      set(pres, map) {
        S.pres = pres; S.map = map; const keys = Object.keys(map);
        root.querySelectorAll('[data-k]').forEach((n) => {
          const i = keys.indexOf(n.getAttribute('data-k')); if (i >= 0) n.style.setProperty('--c', COLS[i % COLS.length]);
          if (!n.__vxt) { n.__vxt = 1; n.addEventListener('mouseenter', () => on([n.getAttribute('data-k')])); n.addEventListener('mouseleave', off); }
        });
        pres.forEach((pre, pi) => pre.lines.forEach((ln) => {
          ln.addEventListener('mouseenter', () => { const ks = keys.filter((kk) => ((map[kk] || [])[pi] || []).some((t) => ln.textContent.includes(t))); if (ks.length) on(ks); });
          ln.addEventListener('mouseleave', off);
        }));
      },
    };
  }
  /* 要点の行だけを初期表示にするコード */
  function kcode(src, file, color, show) {
    const pre = code(src, 'vue', { color: color || VUE, file, dim: false, edit: false });
    const sl = src.split('\n'), keep = new Set();
    sl.forEach((l, i) => { if ((show || []).some((t) => l.includes(t))) { keep.add(i - 1); keep.add(i); keep.add(i + 1); } });
    const hiddenN = sl.filter((_, i) => !keep.has(i)).length;
    const can = hiddenN >= 3 && keep.size > 0;
    let folded = can;
    const tg = h('button', { class: 'tg', type: 'button' });
    const apply = () => {
      pre.querySelectorAll('.vxT-fold').forEach((n) => n.remove());
      pre.lines.forEach((ln, i) => { ln.style.display = folded && !keep.has(i) ? 'none' : ''; });
      if (folded) { let i = 0; while (i < sl.length) { if (!keep.has(i)) { let j = i; while (j < sl.length && !keep.has(j)) j++; pre.lines[i].before(h('span', { class: 'ln vxT-fold', onclick: () => { folded = false; apply(); } }, '⋯ ' + (j - i) + ' 行 省略（クリックで全部）')); i = j; } else i++; } }
      tg.textContent = folded ? '全部見る' : '要点だけ';
    };
    tg.onclick = () => { folded = !folded; apply(); };
    if (can) { apply(); } else tg.style.display = 'none';
    return { pre, el: h('div', { class: 'vxT-cp' }, tg, pre) };
  }
  /* フォルダツリー。rows = [{d, n, lv, file, note, sec}] */
  function tree(rows, o) {
    o = o || {};
    const root = h('div', { class: 'vxT-tree' }), els = [];
    rows.forEach((r) => {
      const lv = r.lv && LVB[r.lv];
      const e = h('div', { class: 'vxT-tr' + (r.file ? ' f' : ' d') + (r.sec ? ' sec' : ''), style: { paddingLeft: r.d * 16 + 8 + 'px', '--c': lv ? lv.c : null }, 'data-n': r.file || '', 'data-lv': r.lv || '' },
        h('span', r.file ? '📄' : '📁'), h('span', { class: 'nm' }, r.n), r.sec && lv ? h('span', { class: 'bd' }, lv.n) : null, r.note ? h('span', { class: 'nt' }, r.note) : null);
      if (r.file && o.onhover) { e.addEventListener('mouseenter', () => o.onhover(r.file)); e.addEventListener('mouseleave', () => o.onhover(null)); }
      root.append(e); els.push(e);
    });
    root.hot = (names) => {
      const lvs = new Set();
      els.forEach((e) => { const on = !!names && names.includes(e.dataset.n); e.classList.toggle('hot', on); if (on && e.dataset.lv) lvs.add(e.dataset.lv); });
      els.forEach((e) => { if (e.classList.contains('sec')) e.classList.toggle('hot', lvs.has(e.dataset.lv)); });
    };
    root.focus = (names) => els.forEach((e) => e.classList.toggle('dim', !!names && !!e.dataset.n && !names.includes(e.dataset.n)));
    return root;
  }
  const ATOMIC_ROWS = (desc, only) => {
    const rows = [{ d: 0, n: 'src/' }, { d: 1, n: 'components/' }], fs = (id) => FILES.filter((f) => f.lv === id && (!only || only.includes(f.n)));
    ['atom', 'mol', 'org', 'tpl'].forEach((id) => {
      const l = LVB[id]; if (!fs(id).length) return;
      rows.push({ d: 2, n: l.dir + '/', lv: id, sec: true, note: desc ? '＝ ' + l.mean : '' });
      fs(id).forEach((f) => rows.push({ d: 3, n: f.n, lv: id, file: f.n }));
    });
    if (fs('page').length) { rows.push({ d: 1, n: 'pages/', lv: 'page', sec: true, note: desc ? '＝ ' + LVB.page.mean : '' }); fs('page').forEach((f) => rows.push({ d: 2, n: f.n, lv: 'page', file: f.n })); }
    return rows;
  };

  /* ================= 1. 部品を、5つの粒度で分ける ================= */
  function scene1(el) {
    let s = 0;
    const SL = (name, kid) => h('div', { class: 'vxT-sl', 'data-sn': name, 'data-lv': 'tpl', 'data-f': 'SearchPageTemplate.vue' }, kid);
    const R = (cls, f, kids) => h('div', { class: 'vxT-r ' + cls, 'data-lv': FB[f].lv, 'data-f': f, 'data-t': f, style: { '--lc': LVB[FB[f].lv].c } }, ...kids);
    const A = (f, cls, txt, d) => h('span', Object.assign({ class: 'vxT-a ' + cls, 'data-lv': 'atom', 'data-f': f }, d ? { 'data-d': '1' } : {}), txt);
    const card = (nm, fd, ini) => R('vxT-cd', 'LawyerCard.vue', [A('BaseAvatar.vue', 'av', ini, 1), h('div', { class: 'info' }, A('BaseLabel.vue', 'lbl', nm, 1), A('BaseLabel.vue', 'lbl sub', fd, 1)), A('StatusBadge.vue', 'bdg', '相談受付中', 1), A('BaseButton.vue', 'btn', '相談する')]);
    const page = h('div', { class: 'vxT-pg' },
      SL('header', R('vxT-hd', 'AppHeader.vue', [A('BaseLabel.vue', 'lbl lg', '弁護士さがし'), A('BaseButton.vue', 'btn sm', 'ログイン')])),
      SL('search', R('vxT-sb', 'SearchBox.vue', [A('BaseInput.vue', 'inp', '地域・分野で探す', 1), A('BaseButton.vue', 'btn', '検索')])),
      SL('list', R('vxT-ls', 'LawyerList.vue', [card('山田 太郎 弁護士', '労働問題・東京', '山'), card('佐藤 花子 弁護士', '相続・大阪', '佐')])),
      SL('pager', R('vxT-pgn', 'Pagination.vue', ['‹', '1', '2', '›'].map((t) => A('BaseButton.vue', 'btn sm', t)))));
    const regions = [...page.querySelectorAll('.vxT-r')], atoms = [...page.querySelectorAll('.vxT-a')];
    const path = h('div', { class: 'vxT-path' });
    const info = (n) => {
      if (!n) { const l = LV[s - 1]; path.style.removeProperty('--c'); path.replaceChildren('👆 部品にカーソルを乗せると、名前と置き場所が出る'); if (l) path.append(h('i', { style: { '--c': l.c } }, l.n)); return; }
      const f = FB[n.dataset.f], l = LVB[n.dataset.lv === 'tpl' ? 'tpl' : n.dataset.lv];
      path.style.setProperty('--c', l.c);
      path.replaceChildren(h('i', { style: { '--c': l.c } }, l.n + ' ' + l.ja), h('code', f.path), h('span', { style: { color: 'var(--mute)' } }, '＝ ' + l.mean));
    };
    const tr = tree(ATOMIC_ROWS(true), { onhover: (name) => { page.querySelectorAll('.vxT-hl').forEach((x) => x.classList.remove('vxT-hl')); if (name) { page.querySelectorAll('[data-f="' + name + '"]').forEach((x) => { if (valid(x)) x.classList.add('vxT-hl'); }); const f = FB[name]; const t = h('div', { 'data-lv': f.lv, 'data-f': name }); info(t); } else info(null); } });
    const valid = (n) => LVI[n.dataset.lv] <= s;
    page.addEventListener('mouseover', (e) => {
      let n = e.target;
      while (n && n !== page.parentNode) { if (n.dataset && n.dataset.f && valid(n)) break; n = n.parentNode; }
      if (n && n !== page.parentNode) { info(n); tr.hot([n.dataset.f]); } else { info(null); tr.hot(null); }
    });
    page.addEventListener('mouseleave', () => { info(null); tr.hot(null); });
    const fl = (els, from, o) => els.forEach((e, i) => { try { e.animate([Object.assign({ opacity: 0 }, from(i)), { opacity: 1, transform: 'none' }], Object.assign({ duration: 650, delay: i * 45, easing: 'cubic-bezier(.2,.9,.3,1.15)', fill: 'backwards' }, o || {})); } catch (x) { /* ok */ } });
    const steps = h('div', { class: 'vxT-tabs' });
    const NAMES = ['① atoms だけ', '② molecules', '③ organisms', '④ template', '⑤ page（データ入り）'];
    LV.forEach((l, i) => steps.append(tabBtn(NAMES[i], () => go(i + 1), l.c)));
    const say = h('div', { class: 'vxT-say' });
    function go(n) {
      const fwd = n > s; s = n;
      page.className = 'vxT-pg s' + n + (n <= 3 ? ' sa' : '');
      page.dataset.t = n === 4 ? 'SearchPageTemplate.vue' : 'LawyerSearchPage.vue';
      page.style.setProperty('--tc', n === 4 ? LVB.tpl.c : LVB.page.c);
      if (n >= 4) { page.dataset.f = n === 4 ? 'SearchPageTemplate.vue' : 'LawyerSearchPage.vue'; page.dataset.lv = n === 4 ? 'tpl' : 'page'; } else { delete page.dataset.f; delete page.dataset.lv; }
      regions.forEach((r) => { const ok = LVI[r.dataset.lv] <= n && n <= 3; r.classList.toggle('on', ok); r.classList.toggle('cur', ok && LVI[r.dataset.lv] === n); });
      [...steps.children].forEach((b, i) => b.classList.toggle('on', i === n - 1));
      const l = LV[n - 1];
      say.replaceChildren('⚛️ ', h('b', { style: { color: l.c } }, l.n + '（' + l.ja + '）'), '＝' + l.mean + '。例：' + l.ex);
      info(null); tr.hot(null);
      if (!fwd && n > 1) return;
      if (n === 1) fl(atoms, (i) => ({ transform: `translate(${((i % 5) - 2) * 46}px,${-70 - (i % 3) * 34}px) rotate(${i % 2 ? 24 : -24}deg) scale(.5)` }));
      if (n === 2) regions.filter((r) => r.dataset.lv === 'mol').forEach((r) => { fl([...r.querySelectorAll('.vxT-a')], (i) => ({ transform: `translateX(${i % 2 ? 46 : -46}px)` }), { duration: 700 }); fl([r], () => ({ transform: 'scale(.92)' }), { delay: 250 }); });
      if (n === 3) fl(regions.filter((r) => r.dataset.lv === 'org'), () => ({ transform: 'translateY(18px) scale(.96)' }), { delay: 0 });
      if (n === 5) fl([page], () => ({ transform: 'scale(.985)' }), { duration: 500 });
    }
    const play = async () => { for (let i = 1; i <= 5; i++) { go(i); await sleep(1500); if (!el.isConnected) return; } };
    go(1);
    el.append(h('div', { class: 'vxT' }, h('div', { class: 'vxT-bar' }, steps, btn('▶ 組み立てる', play, 'primary')), say,
      h('div', { class: 'vxT-1' },
        h('div', { class: 'vxT-col' }, page, path),
        h('div', { class: 'vxT-card' }, h('div', { class: 'tt' }, '📂 フォルダ ＝ 粒度', h('span', { class: 'vxT-small', style: { color: 'var(--mute)' } }, '（列にカーソルでも光る）')), tr))));
  }

  /* ================= 2. Atoms ================= */
  const BB = [
    '<script setup lang="ts">',
    'defineProps<{',
    "  variant?: 'primary' | 'secondary' | 'danger'",
    "  size?: 'sm' | 'md'",
    '  disabled?: boolean',
    '}>()',
    '</script>',
    '',
    '<template>',
    '  <button :class="[variant, size]" :disabled="disabled">',
    '    <slot />',
    '  </button>',
    '</template>',
  ].join('\n');
  const BI = [
    '<script setup lang="ts">',
    'const model = defineModel<string>()',
    '',
    'defineProps<{',
    '  placeholder?: string',
    '  disabled?: boolean',
    '}>()',
    '</script>',
    '',
    '<template>',
    '  <input',
    '    v-model="model"',
    '    :placeholder="placeholder"',
    '    :disabled="disabled"',
    '  />',
    '</template>',
  ].join('\n');
  function scene2(el) {
    const st = { variant: 'primary', size: 'md', bdis: false, idis: false, name: '' };
    let paintL = () => {}, paintR = () => {};
    const chips = (key, opts, get, set) => {
      const row = h('div', { class: 'vxT-ctl', 'data-k': key }, h('b', key === 'dis' ? 'disabled' : key));
      const draw = () => { row.querySelectorAll('.vxT-chip').forEach((c, i) => c.classList.toggle('on', get() === opts[i])); };
      opts.forEach((o) => row.append(h('button', { class: 'vxT-chip', type: 'button', onclick: () => { set(o); draw(); } }, String(o))));
      row.draw = draw; return row;
    };
    const uiL = () => {
      const live = h('button', { class: 'vxT-bb primary md', type: 'button' }, '相談する');
      const wrap = h('span', { 'data-k': 'btn', style: { width: 'fit-content' } }, live);
      const cv = chips('variant', ['primary', 'secondary', 'danger'], () => st.variant, (o) => { st.variant = o; paintL(); });
      const cs = chips('size', ['sm', 'md'], () => st.size, (o) => { st.size = o; paintL(); });
      const cd = chips('disabled', [false, true], () => st.bdis, (o) => { st.bdis = o; paintL(); });
      const use = h('div', { class: 'vxT-par' });
      paintL = () => { live.className = 'vxT-bb ' + st.variant + ' ' + st.size; live.disabled = st.bdis; use.textContent = '<BaseButton variant="' + st.variant + '" size="' + st.size + '"' + (st.bdis ? ' disabled' : '') + '>'; cv.draw(); cs.draw(); cd.draw(); bump(wrap); };
      paintL(); bump(wrap);
      return { el: h('div', { style: { display: 'grid', gap: '10px' } }, h('small', { class: 'vxT-small' }, '親が props を渡す'), use, wrap, cv, cs, cd), reset() { st.variant = 'primary'; st.size = 'md'; st.bdis = false; paintL(); } };
    };
    const uiR = (ctx) => {
      const inp = h('input', { class: 'vxT-bi', type: 'text', placeholder: 'お名前', oninput: async () => { const v = inp.value; await ctx.fly(inp, val, JSON.stringify(v), '#2fd4a4'); st.name = v; paintR(); } });
      const wrap = h('span', { 'data-k': 'input', style: { display: 'block' } }, inp);
      const val = h('div', { class: 'vxT-val', 'data-k': 'model' });
      const cd = chips('dis', [false, true], () => st.idis, (o) => { st.idis = o; paintR(); });
      paintR = () => { val.textContent = 'name = "' + st.name + '"'; inp.disabled = st.idis; if (document.activeElement !== inp) inp.value = st.name; cd.draw(); };
      paintR();
      return { el: h('div', { style: { display: 'grid', gap: '10px' } }, h('small', { class: 'vxT-small' }, 'v-model でつながる親の値'), val, wrap, cd), reset() { st.name = ''; st.idis = false; paintR(); } };
    };
    const MIX = [['primary', 'md', 'ログイン'], ['secondary', 'sm', 'もどる'], ['danger', 'md', '予約を取り消す']];
    const vs = K.vs.versus({
      neutral: true,
      banner: '見た目は props で変える。でも、データ（API）はどこにも出てこない。',
      bar: [
        { label: '▶ いろんな画面で使い回す', primary: true, onclick: async (ctx) => { for (const m of MIX) { st.variant = m[0]; st.size = m[1]; st.bdis = false; paintL(); ctx.banner(m[2] + ' の画面でも、同じ BaseButton', 'ok'); await ctx.sleep(1100); } } },
        { label: '⟲ 最初から', onclick: (ctx) => ctx.reset() },
      ],
      without: { title: 'BaseButton.vue', icon: '🔘', tone: 'vue', file: 'components/atoms/BaseButton.vue', lang: 'vue', src: BB, ui: uiL, keys: { variant: ['variant?:', '[variant, size]'], size: ['size?:', '[variant, size]'], disabled: ['disabled?:', ':disabled'], btn: ['<button', '<slot'] }, show: ['variant?:', 'size?:', 'disabled?:', '<button', '<slot'] },
      with: { title: 'BaseInput.vue', icon: '⌨️', tone: 'react', file: 'components/atoms/BaseInput.vue', lang: 'vue', src: BI, ui: uiR, keys: { model: ['defineModel', 'v-model="model"'], input: ['<input'], dis: ['disabled?:', ':disabled'] }, show: ['defineModel', '<input', 'v-model="model"', 'disabled?:'] },
    });
    const FETCH = ['<script setup lang="ts">', "import { ref } from 'vue'", '', 'const lawyers = ref<Lawyer[]>([])', '', 'const load = async (): Promise<void> => {', "  const res = await fetch('/api/lawyers')", '  lawyers.value = await res.json()', '}', '</script>', '', '<template>', '  <button @click="load">弁護士を読み込む</button>', '</template>'].join('\n');
    const xp = kcode(FETCH, 'LoadLawyersButton.vue', BAD, ["fetch('/api"]);
    xp.pre.setHi(lnOf(xp.pre, ["fetch('/api"]), 'on');
    const tr = tree(ATOMIC_ROWS(false, ['BaseButton.vue', 'BaseInput.vue', 'BaseLabel.vue', 'BaseAvatar.vue', 'StatusBadge.vue']));
    tr.hot(['BaseButton.vue', 'BaseInput.vue']);
    el.append(h('div', { class: 'vxT' }, vs,
      h('div', { class: 'vxT-rules' }, h('span', { style: { '--c': COLS[0] } }, '① データ（API）を知らない'), h('span', { style: { '--c': COLS[1] } }, '② 見た目と、最小の動きだけ'), h('span', { style: { '--c': COLS[3] } }, '③ どこでも使い回せる')),
      h('div', { class: 'vxT-two' },
        h('div', { class: 'vxT-card' }, h('div', { class: 'tt' }, '✖ これは atom ではない', h('span', { class: 'vxT-small', style: { color: 'var(--mute)' } }, 'fetch を知っている → ほかの画面で使い回せない')), xp.el,
          h('div', { class: 'vxT-why' }, '直す：ボタンは ', h('code', '<BaseButton @click="load">'), '。fetch は page に置く。')),
        h('div', { class: 'vxT-card' }, h('div', { class: 'tt' }, '📂 atoms/ に置く'), tr))));
  }

  /* ================= 3. Molecules ================= */
  const SBX = [
    '<script setup lang="ts">',
    "import BaseInput from '../atoms/BaseInput.vue'",
    "import BaseButton from '../atoms/BaseButton.vue'",
    '',
    'const model = defineModel<string>()',
    'const emit = defineEmits<{ search: [] }>()',
    '</script>',
    '',
    '<template>',
    '  <div class="search-box">',
    '    <BaseInput v-model="model" placeholder="地域・分野で探す" />',
    '    <BaseButton @click="emit(\'search\')">検索</BaseButton>',
    '  </div>',
    '</template>',
  ].join('\n');
  const SPG = [
    '<script setup lang="ts">',
    "import { ref } from 'vue'",
    "import type { Lawyer } from '@/types/lawyer'",
    "import { fetchLawyers } from '@/api/lawyers'",
    "import SearchBox from '@/components/molecules/SearchBox.vue'",
    '',
    "const keyword = ref<string>('')",
    'const lawyers = ref<Lawyer[]>([])',
    '',
    'const search = async (): Promise<void> => {',
    '  lawyers.value = await fetchLawyers(keyword.value)',
    '}',
    '</script>',
    '',
    '<template>',
    '  <SearchBox v-model="keyword" @search="search" />',
    '</template>',
  ].join('\n');
  function scene3(el) {
    const st = { j: false, kw: '', n: 0, busy: false };
    const inp = h('input', { class: 'vxT-bi', type: 'text', placeholder: '地域・分野で探す', style: { border: '2px solid #b9c4e2' }, oninput: () => typed(inp.value) });
    const bb = h('button', { class: 'vxT-bb primary md', type: 'button', onclick: () => clickSearch() }, '検索');
    const aIn = h('span', { class: 'at i', 'data-t': 'BaseInput', 'data-k': 'inp' }, inp), aBt = h('span', { class: 'at', 'data-t': 'BaseButton', 'data-k': 'btn' }, bb);
    const box = h('div', { class: 'vxT-sbx', 'data-k': 'box' }, aIn, aBt);
    const kw = h('div', { class: 'vxT-val', 'data-k': 'model' });
    const use = h('code', { 'data-k': 'use', style: { color: '#2f6df0' } }, '<SearchBox v-model="keyword" @search="search" />');
    const log = h('div', { class: 'vxT-log', 'data-k': 'emit' });
    const stage = h('div', { class: 'vxT-stage' }, h('div', { class: 'vxT-par' }, h('small', { class: 'vxT-small' }, '親 LawyerSearchPage'), use), kw, h('div', { class: 'vxT-mg' }, box), log);
    const paint = () => {
      box.classList.toggle('j', st.j);
      kw.textContent = 'keyword = "' + st.kw + '"';
      log.replaceChildren(...(st.n ? [h('div', { class: 'g' }, 'search() が ' + st.n + ' 回 呼ばれた'), h('div', { class: 'm' }, '→ API に問い合わせるのは親（page）の仕事')] : [h('div', { class: 'm' }, st.j ? '入力して「検索」を押してみる' : '▶ 合体させると、1つの部品になる')]));
    };
    async function join(v) { st.j = v; paint(); }
    async function typed(v) { if (!st.j) { log.replaceChildren(h('div', { class: 'm' }, 'まだ合体していない。▶ 合体させる を押す')); return; } await fly(stage, inp, kw, JSON.stringify(v), '#2fd4a4', 600); st.kw = v; paint(); bump(kw); }
    async function clickSearch() { if (!st.j) { log.replaceChildren(h('div', { class: 'm' }, 'まだ合体していない。▶ 合体させる を押す')); return; } await fly(stage, bb, use, "emit('search')", '#ffb454', 700); st.n++; paint(); bump(log); }
    const sb = kcode(SBX, 'components/molecules/SearchBox.vue', VUE, ['defineModel', 'defineEmits', 'BaseInput', 'BaseButton', 'class="search-box"']);
    const pp = kcode(SPG, 'pages/LawyerSearchPage.vue', '#a98bff', ['<SearchBox', 'const keyword', 'const search']);
    const L = linker(el);
    const tr = tree(ATOMIC_ROWS(false, ['BaseInput.vue', 'BaseButton.vue', 'SearchBox.vue', 'LawyerSearchPage.vue']));
    tr.hot(['SearchBox.vue']);
    const auto = async () => { await join(false); await sleep(500); await join(true); await sleep(1200); if (!el.isConnected) return; };
    const wrapEl = h('div', { class: 'vxT' }, h('div', { class: 'vxT-bar' }, btn('▶ 合体させる', auto, 'primary'), btn('キーワードを入れる', async () => { if (!st.j) await join(true); inp.value = '離婚'; await typed('離婚'); }), btn('検索する', () => clickSearch()), btn('⟲ 最初から', () => { st.kw = ''; st.n = 0; inp.value = ''; join(false); }, 'ghost')),
      h('div', { class: 'vxT-two' },
        h('div', { class: 'vxT-col', style: { display: 'flex', flexDirection: 'column', gap: '10px' } }, stage, h('div', { class: 'vxT-card' }, h('div', { class: 'tt' }, '📂 molecules/ に置く'), tr)),
        h('div', { class: 'vxT-codes' }, sb.el, pp.el)),
      h('div', { class: 'vxT-rules' }, h('span', { style: { '--c': COLS[0] } }, '① 1つの役目だけ'), h('span', { style: { '--c': COLS[1] } }, '② atoms だけで作る'), h('span', { style: { '--c': COLS[3] } }, '③ まだデータ取得はしない')));
    el.append(wrapEl);
    L.set([sb.pre, pp.pre], {
      inp: [['BaseInput'], []], btn: [['BaseButton'], []], box: [['class="search-box"'], ['<SearchBox', 'import SearchBox']],
      model: [['defineModel', 'v-model="model"'], ['v-model="keyword"', 'const keyword']], emit: [['defineEmits', "emit('search')"], ['@search', 'const search']], use: [[], ['<SearchBox']],
    });
    paint();
    setTimeout(auto, 500);
  }

  /* ================= 4. Organisms → Template → Page ================= */
  const CODES = {
    page: { file: 'pages/LawyerSearchPage.vue', c: '#a98bff', show: ['const lawyers', 'const booked', '<SearchPageTemplate', '<LawyerList', ':lawyers', '@consult'], src: [
      '<script setup lang="ts">',
      "import { ref } from 'vue'",
      "import type { Lawyer } from '@/types/lawyer'",
      "import SearchPageTemplate from '@/components/templates/SearchPageTemplate.vue'",
      "import SearchBox from '@/components/molecules/SearchBox.vue'",
      "import LawyerList from '@/components/organisms/LawyerList.vue'",
      '',
      "const keyword = ref<string>('')",
      'const lawyers = ref<Lawyer[]>([])',
      'const booked = ref<number | null>(null)',
      '',
      'const openBooking = (id: number): void => {',
      '  booked.value = id',
      '}',
      '</script>',
      '',
      '<template>',
      '  <SearchPageTemplate>',
      '    <template #search>',
      '      <SearchBox v-model="keyword" />',
      '    </template>',
      '    <template #list>',
      '      <LawyerList',
      '        :lawyers="lawyers"',
      '        @consult="openBooking"',
      '      />',
      '    </template>',
      '  </SearchPageTemplate>',
      '</template>',
    ].join('\n'), tok: ['const lawyers', 'const booked', 'openBooking', '<LawyerList'] },
    tpl: { file: 'components/templates/SearchPageTemplate.vue', c: '#2fd4a4', show: ['<slot'], src: [
      '<template>',
      '  <div class="layout">',
      '    <section class="search">',
      '      <slot name="search" />',
      '    </section>',
      '    <main class="list">',
      '      <slot name="list" />',
      '    </main>',
      '  </div>',
      '</template>',
    ].join('\n'), tok: ['<slot'] },
    list: { file: 'components/organisms/LawyerList.vue', c: '#ffb454', show: ['defineProps', 'defineEmits', 'v-for', '@consult'], src: [
      '<script setup lang="ts">',
      "import type { Lawyer } from '@/types/lawyer'",
      "import LawyerCard from './LawyerCard.vue'",
      '',
      'defineProps<{ lawyers: Lawyer[] }>()',
      'const emit = defineEmits<{ consult: [id: number] }>()',
      '</script>',
      '',
      '<template>',
      '  <ul class="lawyer-list">',
      '    <LawyerCard',
      '      v-for="l in lawyers"',
      '      :key="l.id"',
      '      :lawyer="l"',
      '      @consult="emit(\'consult\', $event)"',
      '    />',
      '  </ul>',
      '</template>',
    ].join('\n'), tok: ['defineProps', 'defineEmits', 'v-for', ':lawyer="l"'] },
    card: { file: 'components/organisms/LawyerCard.vue', c: '#ffb454', show: ['defineProps', 'defineEmits', "emit('consult'"], src: [
      '<script setup lang="ts">',
      "import type { Lawyer } from '@/types/lawyer'",
      "import BaseButton from '../atoms/BaseButton.vue'",
      '',
      'defineProps<{ lawyer: Lawyer }>()',
      'const emit = defineEmits<{ consult: [id: number] }>()',
      '</script>',
      '',
      '<template>',
      '  <article class="lawyer-card">',
      '    <h3>{{ lawyer.name }}</h3>',
      "    <BaseButton @click=\"emit('consult', lawyer.id)\">相談する</BaseButton>",
      '  </article>',
      '</template>',
    ].join('\n'), tok: ['defineProps', 'defineEmits', "emit('consult'"] },
  };
  function scene4(el) {
    const NAMEK = { page: 'LawyerSearchPage.vue', tpl: 'SearchPageTemplate.vue', list: 'LawyerList.vue', card: 'LawyerCard.vue' };
    let cur = 'page', pre = null, busy = false;
    const nd = (key, lv, name, small, kids, k) => h('div', { class: 'vxT-nd', 'data-k': k || key, style: { '--lc': LVB[lv].c }, onclick: (e) => { e.stopPropagation(); } },
      h('div', { class: 'hd' }, h('i', LVB[lv].n), h('b', name), small ? h('small', small) : null), ...(kids || []));
    const chipLawyers = h('span', { class: 'vxT-val', 'data-k': 'own' }, 'lawyers'), chipBooked = h('span', { class: 'vxT-val', 'data-k': 'own' }, 'booked: —');
    const consultBtn = (nm, id) => h('div', { class: 'vxT-mini-card', style: { '--lc': LVB.org.c } }, nm, h('button', { class: 'vxT-bb primary sm', type: 'button', onclick: () => sendEvent(id, nm) }, '相談する'));
    const cards = [consultBtn('山田 太郎', 1), consultBtn('佐藤 花子', 2)];
    const cardWrap = h('div', { style: { display: 'grid', gap: '6px' } }, ...cards);
    const nPage = nd('page', 'page', 'LawyerSearchPage', 'データを持つ', [h('div', { class: 'vxT-own' }, chipLawyers, chipBooked)]);
    const nSearch = nd('search', 'mol', 'SearchBox', null, null);
    const nList = nd('list', 'org', 'LawyerList', null, [cardWrap]);
    const nTpl = nd('tpl', 'tpl', 'SearchPageTemplate', 'slot で枠だけ', [h('div', { class: 'row2' }, nSearch, nList)]);
    nPage.append(nTpl);
    cards.forEach((c) => { c.setAttribute('data-k', 'card'); });
    const stage = h('div', { class: 'vxT-stage' }, nPage);
    const say = h('div', { class: 'vxT-say' }, '📖 ', h('b', 'props は下へ、イベントは上へ。'), ' データを持つのは page だけ。');
    const codeBox = h('div', { class: 'vxT-codes' });
    const tabs = h('div', { class: 'vxT-tabs' });
    const L = linker(el);
    const tr = tree(ATOMIC_ROWS(false, ['BaseButton.vue', 'SearchBox.vue', 'LawyerCard.vue', 'LawyerList.vue', 'SearchPageTemplate.vue', 'LawyerSearchPage.vue']));
    const TABS = [['page', 'page'], ['tpl', 'template'], ['list', 'LawyerList'], ['card', 'LawyerCard']];
    function show(key, hi) {
      const cd = CODES[key]; cur = key;
      [...tabs.children].forEach((b, i) => b.classList.toggle('on', TABS[i][0] === key));
      const c = kcode(cd.src, cd.file, cd.c, cd.show); pre = c.pre;
      codeBox.replaceChildren(c.el);
      pre.setHi(lnOf(pre, hi || []), 'on');
      tr.hot([NAMEK[key]]);
      L.set([pre], { page: [CODES.page.tok], list: [CODES.list.tok], card: [CODES.card.tok], tpl: [CODES.tpl.tok] });
      c.el.querySelectorAll('pre.code .ln').forEach((ln) => { ln.addEventListener('mouseenter', () => nodeHot(key)); ln.addEventListener('mouseleave', () => nodeHot(null)); });
    }
    const nodeHot = (key) => { stage.querySelectorAll('.vxT-nd').forEach((n) => n.style.boxShadow = key && n.dataset.k === key ? '0 0 0 4px color-mix(in srgb,' + n.style.getPropertyValue('--lc') + ' 40%,transparent)' : ''); };
    TABS.forEach(([k, t]) => tabs.append(tabBtn(t, () => show(k, CODES[k].tok), CODES[k].c)));
    const hoverMap = { page: 'page', own: 'page', search: 'page', tpl: 'tpl', list: 'list', card: 'card' };
    stage.querySelectorAll('[data-k]').forEach((n) => { n.addEventListener('mouseenter', () => { const k = hoverMap[n.dataset.k]; if (k && !busy && k !== cur) show(k, CODES[k].tok); }); });
    async function sendProps() {
      if (busy) return; busy = true;
      show('page', ['const lawyers']); await fly(stage, chipLawyers, nList, 'lawyers', '#5b9dff', 900); bump(nList);
      show('list', ['defineProps<{ lawyers']); await fly(stage, nList, cards[0], 'lawyer', '#5b9dff', 800); cards.forEach(bump);
      show('card', ['defineProps<{ lawyer']); busy = false;
    }
    async function sendEvent(id, nm) {
      if (busy) return; busy = true;
      const from = cards[id - 1];
      show('card', ["emit('consult'"]); await fly(stage, from, nList, 'consult(' + id + ')', '#2fd4a4', 800); bump(nList);
      show('list', ["emit('consult'", '@consult']); await fly(stage, nList, chipBooked, 'consult(' + id + ')', '#2fd4a4', 800);
      show('page', ['@consult', 'openBooking']); chipBooked.textContent = 'booked: ' + id + '（' + nm + '）'; bump(chipBooked); busy = false;
    }
    el.append(h('div', { class: 'vxT' }, h('div', { class: 'vxT-bar' }, btn('▶ props を流す（下へ）', sendProps, 'primary'), btn('「相談する」を押す（上へ）', () => sendEvent(1, '山田 太郎')), btn('⟲', () => { chipBooked.textContent = 'booked: —'; })), say,
      h('div', { class: 'vxT-two' },
        h('div', { class: 'vxT-col', style: { display: 'flex', flexDirection: 'column', gap: '10px' } }, stage, h('div', { class: 'vxT-card' }, h('div', { class: 'tt' }, '📂 フォルダ'), tr)),
        h('div', { class: 'vxT-card' }, tabs, codeBox))));
    show('page', CODES.page.tok);
  }

  /* ================= 5. どこに置く？ 仕分け ================= */
  const ITEMS = [
    { id: 'badge', t: 'ステータスバッジ', e: '🏷️', ok: ['atom'], why: '色と文字だけの最小の部品。' },
    { id: 'date', t: '日付入力欄', e: '📅', ok: ['atom'], alt: ['mol'], why: '入力欄 1 つなら atom（BaseInput の仲間）。', altWhy: 'ラベルやカレンダーボタンと組むなら molecules。チームで決める。' },
    { id: 'search', t: '検索ボックス', e: '🔎', ok: ['mol'], why: '入力欄 + ボタンの組み合わせ。' },
    { id: 'pager', t: 'ページ番号', e: '🔢', ok: ['mol'], alt: ['org'], why: 'ボタンを並べた組み合わせ。', altWhy: '機能が多ければ organisms も。チームで決める。' },
    { id: 'card', t: '弁護士カード', e: '🪪', ok: ['org'], alt: ['mol'], why: '名前・バッジ・ボタンが集まった、画面のまとまり。', altWhy: '小さいカードを molecules にする流派もある。チームで決める。' },
    { id: 'list', t: '弁護士カード一覧', e: '📋', ok: ['org'], why: 'カードを並べた、画面のまとまり。' },
    { id: 'header', t: 'ヘッダー', e: '🧭', ok: ['org'], why: 'ロゴ・メニューなどが集まった、画面のまとまり。' },
    { id: 'modal', t: '相談モーダル', e: '💬', ok: ['org'], why: '入力欄・ボタンが集まった、画面のまとまり。' },
    { id: 'layout', t: '2カラムのレイアウト', e: '🧱', ok: ['tpl'], why: '枠だけ。データは入っていない。' },
    { id: 'booking', t: '相談予約ページ', e: '📅', ok: ['page'], why: 'データを持ち、API を呼ぶ本物の画面。' },
  ];
  function scene5(el) {
    const st = { sel: null, placed: {}, miss: 0, order: ITEMS.map((x) => x.id).sort(() => Math.random() - .5) };
    const fb = h('div', { class: 'vxT-fb' }, '部品を選んで（またはドラッグして）、置き場所を選ぶ');
    const sc = h('div', { class: 'vxT-sc' });
    const cardsBox = h('div', { class: 'vxT-cards' });
    const bins = h('div', { class: 'vxT-bins' });
    const binEl = {};
    const select = (id) => { st.sel = st.sel === id ? null : id; paint(); };
    const place = (lv) => {
      const it = ITEMS.find((x) => x.id === st.sel); if (!it) { fb.className = 'vxT-fb wr'; fb.textContent = '先に、上の部品を選んで'; return; }
      const l = LVB[lv], right = it.ok.includes(lv), alt = (it.alt || []).includes(lv);
      if (right || alt) {
        st.placed[it.id] = lv; st.sel = null;
        fb.className = 'vxT-fb ' + (right ? 'ok' : 'wr');
        fb.replaceChildren(right ? '✓ ' + it.t + ' は ' : '△ ' + it.t + ' は ', h('b', { style: { color: LVB[right ? lv : it.ok[0]].c, margin: '0 .3em' } }, l.n), '。' + (right ? it.why : it.altWhy) + ' → ', h('code', (lv === 'page' ? 'pages/' : 'components/' + l.dir + '/')));
        paint(it.id);
      } else {
        st.miss++; const c = cardsBox.querySelector('[data-id="' + it.id + '"]'); if (c) { c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); }
        fb.className = 'vxT-fb ng'; fb.replaceChildren('✖ ' + it.t + ' は ' + l.n + ' ではない。' + it.why + ' → ', h('b', { style: { color: LVB[it.ok[0]].c } }, LVB[it.ok[0]].n)); paintScore();
      }
    };
    const paintScore = () => { const n = Object.keys(st.placed).length; sc.replaceChildren('できた ', h('b', n + ' / ' + ITEMS.length), h('span', { style: { color: 'var(--mute)', fontSize: '.85rem' } }, 'ミス ' + st.miss + ' 回'), ...(n === ITEMS.length ? [h('span', { style: { color: 'var(--ok)' } }, '🎉 ぜんぶ仕分けできた')] : [])); };
    function paint(newId) {
      cardsBox.replaceChildren(...st.order.filter((id) => !st.placed[id]).map((id) => { const it = ITEMS.find((x) => x.id === id); const c = h('button', { class: 'vxT-cc' + (st.sel === id ? ' sel' : ''), type: 'button', draggable: 'true', 'data-id': id, onclick: () => select(id) }, it.e + ' ' + it.t); c.addEventListener('dragstart', (e) => { st.sel = id; e.dataTransfer.setData('text/plain', id); c.classList.add('sel'); }); return c; }));
      LV.forEach((l) => { const inn = binEl[l.id].querySelector('.in'); inn.replaceChildren(...ITEMS.filter((x) => st.placed[x.id] === l.id).map((x) => h('span', { class: 'vxT-pl' }, x.t))); });
      paintScore();
    }
    LV.forEach((l) => {
      const b = h('button', { class: 'vxT-bin', type: 'button', style: { '--c': l.c }, onclick: () => place(l.id) }, h('span', { class: 'nm' }, h('b', l.n + '（' + l.ja + '）'), h('code', (l.id === 'page' ? 'pages/' : 'components/' + l.dir + '/'))), h('span', { class: 'in' }));
      b.addEventListener('dragover', (e) => { e.preventDefault(); b.classList.add('over'); }); b.addEventListener('dragleave', () => b.classList.remove('over'));
      b.addEventListener('drop', (e) => { e.preventDefault(); b.classList.remove('over'); st.sel = e.dataTransfer.getData('text/plain') || st.sel; place(l.id); });
      binEl[l.id] = b; bins.append(b);
    });
    const reset = () => { st.placed = {}; st.sel = null; st.miss = 0; st.order = ITEMS.map((x) => x.id).sort(() => Math.random() - .5); fb.className = 'vxT-fb'; fb.textContent = '部品を選んで（またはドラッグして）、置き場所を選ぶ'; paint(); };
    el.append(h('div', { class: 'vxT' }, h('div', { class: 'vxT-bar' }, fb, sc, btn('⟲ もう一度', reset, 'ghost')),
      h('div', { class: 'vxT-5' }, h('div', { class: 'vxT-card' }, h('div', { class: 'tt' }, '🧩 部品（10 個）'), cardsBox), h('div', { class: 'vxT-card' }, h('div', { class: 'tt' }, '📂 フォルダ ＝ 置き場所'), bins))));
    paint();
  }

  /* ================= 6. やりすぎ注意と、決めごと ================= */
  function scene6(el) {
    let src = 3, mode = 0;
    const stack = h('div', { class: 'vxT-stack' });
    const reason = h('div', { class: 'vxT-why' });
    const drawStack = () => {
      stack.replaceChildren();
      [5, 4, 3, 2, 1].forEach((n, i) => {
        const l = LV[n - 1];
        const cls = n === src ? ' src' : n < src ? ' ok' : n === src ? '' : ' no';
        const same = n === src;
        const b = h('button', { class: 'vxT-ly' + (same ? ' src' : n < src ? ' ok' : ' no'), type: 'button', style: { '--c': l.c }, onclick: () => { src = n; drawStack(); } },
          h('b', l.n), h('code', n === 5 ? 'pages/' : l.dir + '/'), h('span', { class: 'st' }, same ? '← ここから' : n < src ? '✓ import してよい' : '✖ 逆向きはだめ'));
        stack.append(b);
        if (i < 4) stack.append(h('div', { class: 'vxT-arw' }, h('span', '▼ 下の段を使う')));
      });
      const me = LV[src - 1], low = LV.slice(0, src - 1).map((l) => l.n), up = LV.slice(src).map((l) => l.n);
      reason.replaceChildren(h('b', me.n), ' は ' + (low.length ? low.join('・') + ' を使う。' : 'どこも import しない（いちばん下）。') + (up.length ? up.join('・') + ' は import しない。' : '') + ' 逆向きだと、部品が画面に縛られて使い回せない。');
    };
    const T2 = tree([{ d: 0, n: 'src/' }, { d: 1, n: 'components/' }, { d: 2, n: 'base/', lv: 'atom', sec: true, note: '＝ 共通の部品' }, { d: 3, n: 'BaseButton.vue', lv: 'atom', file: 'a' }, { d: 3, n: 'BaseInput.vue', lv: 'atom', file: 'b' }, { d: 2, n: 'lawyer/', lv: 'org', sec: true, note: '＝ 機能ごとの部品' }, { d: 3, n: 'LawyerCard.vue', lv: 'org', file: 'c' }, { d: 3, n: 'LawyerList.vue', lv: 'org', file: 'd' }, { d: 1, n: 'views/', lv: 'page', sec: true, note: '＝ 画面（pages/ と同じ役目）' }, { d: 2, n: 'LawyerSearchView.vue', lv: 'page', file: 'e' }]);
    T2.querySelectorAll('.sec .bd').forEach((x) => x.remove());
    const when = [['小さいプロジェクト', '部品が少ないうちは、段を分けなくてよい'], ['一度しか使わない部品', 'そのページのフォルダに置いておく'], ['迷ったら', '今のフォルダに置いて、あとで移す']];
    const team = [['命名', h('span', '', 'Base〜 を atoms に付けるか？ ', h('code', 'BaseButton'))], ['置き場所', h('span', '', 'atoms/ か base/ か。pages/ か views/ か')], ['例外のルール', h('span', '', 'どこまで厳しく守るか。迷ったときの決め方')]];
    el.append(h('div', { class: 'vxT' },
      h('div', { class: 'vxT-say' }, '📚 これは ', h('b', 'Brad Frost'), ' の考え方（アトミックデザイン）。', h('b', 'Vue の機能ではない'), '。目安として使う。'),
      h('div', { class: 'vxT-two' },
        h('div', { class: 'vxT-card' }, h('div', { class: 'tt' }, '➡️ 依存の向き：上から下だけ', h('span', { class: 'vxT-small', style: { color: 'var(--mute)' } }, '（段をクリック）')), stack, reason),
        h('div', { class: 'vxT-card' }, h('div', { class: 'tt' }, '📂 Vue でよくある簡略（base・機能別 + views）'), T2, h('div', { class: 'vxT-why' }, '段の数は決まりではない。', h('code', 'base/'), ' と機能別だけに簡略するチームも多い。'))),
      h('div', { class: 'vxT-two', style: { gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)' } },
        h('div', { class: 'vxT-card' }, h('div', { class: 'tt' }, '⚠️ 厳しく守らなくていいとき'), ...when.map(([a, b], i) => h('div', { class: 'vxT-it', style: { '--c': COLS[i] } }, h('i', String(i + 1)), h('span', h('b', a), h('small', b))))),
        h('div', { class: 'vxT-card' }, h('div', { class: 'tt' }, '🤝 チームで決める 3 つ'), ...team.map(([a, b], i) => h('div', { class: 'vxT-it', style: { '--c': COLS[3 + i] } }, h('i', String(i + 1)), h('span', h('b', a), h('small', b))))))));
    drawStack();
  }

  reg({
    id: 'x-vue-atomic', title: 'アトミックデザイン入門', sub: '部品を5つの粒度で整理する', emoji: '⚛️',
    meta: { cat: 'vue', day: '4日目', when: '部品が増えてきて、どのフォルダに何を置くか迷ったら', mins: 15, order: 37, level: '応用', after: 'vue-comp', why: '部品が増えると「どこに置く？どこまで分ける？」で迷う。粒度のルールがあるとチームで揃う' },
    scenes: [
      { t: '部品を、5つの粒度で分ける', tag: 'ATOMIC DESIGN', lead: '<b>アトミックデザイン</b>は、画面の部品を <b>atoms → molecules → organisms → templates → pages</b> の 5 段で整理する考え方。', render: scene1 },
      { t: 'Atoms：これ以上分けない最小の部品', tag: 'ATOMS', lead: '<b>atom</b> は、<b>API を知らない最小の部品</b>。props で見た目を変え、どこでも使い回す。', render: scene2 },
      { t: 'Molecules：atoms を組み合わせる', tag: 'MOLECULES', lead: '<b>molecule</b> は、<b>atoms を組み合わせた</b> 1 つの役目の部品。データ取得は、まだしない。', render: scene3 },
      { t: 'Organisms → Template → Page', tag: 'ORGANISMS / PAGE', lead: '<b>page</b> がデータを持ち、<b>props は下へ</b>、<b>イベントは上へ</b>。<b>template</b> は枠だけ。', render: scene4 },
      { t: 'どこに置く？ 仕分け', tag: 'PRACTICE', lead: '部品を見て、<b>どの粒度か</b>を選ぶ。迷うものは<b>チームで決めて</b>よい。', render: scene5 },
      { t: 'やりすぎ注意と、決めごと', tag: 'GUIDELINE', lead: '<b>依存は上から下だけ</b>。厳しく守りすぎず、<b>チームで決めごと</b>を持つ。', render: scene6 },
    ],
  });
})();
