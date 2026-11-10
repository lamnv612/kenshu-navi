/* Lessons: ts-intro, ts-basic, ts-types, ts-class, ts-generics, ts-test, review */
(function () {
  'use strict';
  const K = window.KENSHU, { h, code, stepper, playground, lbl, style, sleep, esc, codeEditor, celebrate, icon, hl } = K.W;


  style('tsx3', `
  .tsx3-sq{text-decoration:underline wavy #ff5470;text-decoration-thickness:1.5px;text-underline-offset:5px}
  .tsx3-attempt{display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap;padding:.7em 1em;border-radius:8px;background:var(--code);color:#d8dcff;font:700 1rem var(--mono);border:1px solid var(--bad)}
  .tsx3-attempt .bk{color:#ff9aa5;font-size:.875rem}
  .tsx3-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
  .tsx3-tab{all:unset;cursor:pointer;display:grid;gap:1px;padding:.55em 1.1em;border-radius:8px;border:1px solid var(--line);background:var(--card);transition:.2s;font-weight:800;font-size:.9rem}
  .tsx3-tab small{font-weight:600;font-size:.72rem;color:var(--mute)}
  .tsx3-tab:hover{transform:translateY(-2px)}
  .tsx3-tab.on{border-color:var(--ts);background:color-mix(in srgb,var(--ts) 18%,var(--card));box-shadow:0 8px 20px -12px var(--ts)}
  .tsx3-duo{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:stretch}
  .tsx3-col{display:flex;flex-direction:column;gap:10px;padding:14px;border-radius:10px;background:var(--card);border:1px solid var(--line)}
  .tsx3-col h4{font:900 1rem var(--mono);display:flex;align-items:center;gap:.5em}
  .tsx3-col.k-let h4{color:var(--team)}.tsx3-col.k-const h4{color:var(--basic)}
  .tsx3-col pre.code{margin:0;flex:1}
  .tsx3-meter{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:.8rem;font-weight:800;color:var(--mute)}
  .tsx3-meter b{padding:.1em .7em;border-radius:6px;background:var(--card2);border:1px solid var(--line);color:var(--text)}
  .tsx3-meter b.bad{color:#ff8f9a;border-color:var(--bad)}.tsx3-meter b.good{color:var(--ok);border-color:var(--ok)}
  .tsx3-out{min-height:3.2em;padding:.6em .9em;border-radius:8px;background:var(--code);color:#cfd5ff;font:700 .85rem/1.6 var(--mono)}
  .tsx3-out.e{color:#ff9aa5;border:1px solid var(--bad)}.tsx3-out.ok{color:#9be58b;border:1px solid var(--ok)}
  .tsx3-rule{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:16px 0 8px;padding:.7em 1em;border-radius:8px;background:color-mix(in srgb,var(--ts) 12%,transparent);border:1px dashed color-mix(in srgb,var(--ts) 45%,transparent);font-weight:800;font-size:.9rem}
  .tsx3-q{display:grid;gap:8px}
  .tsx3-qr{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;padding:.6em .9em;border-radius:8px;background:var(--card);border:1px solid var(--line);transition:.3s}
  .tsx3-qr.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 10%,var(--card))}
  .tsx3-qr small{grid-column:1/-1;color:var(--mute);font-weight:600;display:none}.tsx3-qr.ok small{display:block}
  .tsx3-qb{display:flex;gap:6px}.tsx3-qb button{all:unset;cursor:pointer;padding:.25em .9em;border-radius:6px;font:800 .85rem var(--mono);border:1px solid var(--line);background:var(--card2);transition:.2s}
  .tsx3-qb button:hover{transform:translateY(-2px)}.tsx3-qb button.bad{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 22%,transparent);animation:shake .4s}.tsx3-qb button.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 25%,transparent)}
  .tsx3-code{background:var(--code);color:#d8dcff;border-radius:8px;padding:16px 18px;font:700 1rem/2.1 var(--mono);white-space:pre-wrap}
  .tsx3-sl{cursor:pointer;display:inline-block;padding:0 .35em;margin:0 .1em;border-radius:6px;border:1.5px dashed var(--line);color:var(--mute);font-weight:700;transition:.2s}
  .tsx3-sl:hover{border-color:var(--ts);color:var(--ts)}
  .tsx3-sl.on{border-style:solid;border-color:var(--ts);color:var(--ts);background:color-mix(in srgb,var(--ts) 18%,transparent)}
  .tsx3-sl.err{border-color:var(--bad);color:#ff8f9a;background:color-mix(in srgb,var(--bad) 18%,transparent);animation:shake .4s}
  .tsx3-sl.noise{border-color:var(--team);color:var(--team);background:color-mix(in srgb,var(--team) 14%,transparent)}
  @media(max-width:900px){.tsx3-duo{grid-template-columns:1fr}}
  `);

  style('tsx', `
  .tsx-lane{display:grid;grid-template-columns:70px 1fr;align-items:center;gap:10px;margin-bottom:12px}
  .tsx-ln{font:900 1rem var(--mono)}
  .tsx-track{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:6px;padding-bottom:6px}
  .tsx-st{text-align:center;padding:.7em .2em;border-radius:8px;background:var(--card);border:1px solid var(--line);font-weight:800;font-size:.875rem;transition:.4s}
  .tsx-st.pass{background:color-mix(in srgb,var(--ok) 18%,var(--card));border-color:var(--ok)}
  .tsx-st.bad{background:color-mix(in srgb,var(--bad) 25%,var(--card));border-color:var(--bad);animation:shake .4s}
  .tsx-bomb{position:absolute;top:-16px;font-size:2rem;transition:left .8s cubic-bezier(.5,0,.3,1);transform:translateX(-50%);z-index:2}
  .tsx-msg{padding:.6em 1em;border-radius:8px;font:700 .875rem var(--mono);background:var(--code);color:#d8dcff;margin:0 0 14px 80px;min-height:2.6em;transition:.3s}
  .tsx-msg.e{color:#ff8f9a}.tsx-msg.w{color:#ffd37a}
  .tsx-pipe{display:grid;grid-template-columns:1fr 46px 120px 46px 1fr;gap:6px;align-items:center}
  .tsx-pipe>*{transition:.5s}
  .tsx-arrow{text-align:center;font-size:1.5rem;opacity:.2}.tsx-arrow.on{opacity:1;color:var(--c)}
  .tsx-gear{text-align:center;padding:1em .3em;border-radius:8px;border:2px solid var(--line);background:var(--card);font-weight:800;font-size:.875rem}
  .tsx-gear b{display:block;font-size:2rem}
  .tsx-gear.on{border-color:var(--c);background:color-mix(in srgb,var(--c) 22%,var(--card))}
  .tsx-gear.on b{animation:spin 1.6s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}
  .tsx-ghost{opacity:.12;filter:blur(1px);transform:scale(.96)}
  .tsx-line{font:700 clamp(1rem,2.4vw,1.5rem) var(--mono);background:var(--code);color:#d8dcff;padding:22px 16px;border-radius:8px;display:flex;flex-wrap:wrap;justify-content:center}
  .tsx-line .tk{padding:3px 3px;border-radius:8px;white-space:pre;transition:.3s;border-bottom:3px solid transparent}
  .tsx-line .tk.lit{background:color-mix(in srgb,var(--pc) 28%,transparent);border-color:var(--pc);transform:translateY(-5px)}
  .tsx-box{display:inline-grid;gap:4px;justify-items:center;padding:12px 16px;border-radius:8px;border:3px dashed var(--line);background:var(--card);min-width:130px;transition:.4s;position:relative}
  .tsx-box .nm{font:800 .875rem var(--mono)}
  .tsx-box .ty{font:800 .75rem var(--mono);padding:.1em .7em;border-radius:6px;background:var(--bc,var(--ts));color:#06101f;transition:.4s}
  .tsx-box .val{font:800 1.5rem var(--mono);min-height:1.8em;display:grid;place-items:center}
  .tsx-box.t-number{--bc:var(--ts)}.tsx-box.t-string{--bc:var(--basic)}.tsx-box.t-boolean{--bc:var(--team)}
  .tsx-box.over{border-color:var(--bc);background:color-mix(in srgb,var(--bc) 18%,var(--card));transform:scale(1.04)}
  .tsx-box.good{border-style:solid;border-color:var(--ok)}
  .tsx-box.no{animation:shake .4s;border-color:var(--bad)}
  .tsx-chip{display:inline-block;padding:.3em .9em;margin:4px;border-radius:8px;font:800 1rem var(--mono);background:var(--card2);border:2px solid var(--line);cursor:grab;user-select:none;transition:.2s}
  .tsx-chip:hover{transform:translateY(-3px) rotate(-2deg)}
  .tsx-chip.sel{border-color:var(--pink);box-shadow:0 0 0 4px color-mix(in srgb,var(--pink) 30%,transparent);transform:scale(1.1)}
  .tsx-chip.in{cursor:default;background:var(--bc);color:#06101f;border-color:transparent;animation:pop .4s both;margin:0}
  .tsx-seg{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap}
  .tsx-seg button{all:unset;cursor:pointer;padding:.4em 1.1em;border-radius:6px;font-weight:800;border:1px solid var(--line);background:var(--card);transition:.2s}
  .tsx-seg button.on{background:var(--c);color:#06101f;border-color:transparent;transform:translateY(-2px)}
  .tsx-res{display:inline-flex;gap:.5em;align-items:center;padding:.4em .9em;border-radius:8px;font:700 .875rem var(--mono);margin-top:8px;animation:pop .35s both}
  .tsx-res.ok{background:color-mix(in srgb,var(--ok) 20%,transparent);color:var(--ok)}
  .tsx-res.ng{background:color-mix(in srgb,var(--bad) 20%,transparent);color:#ff8f9a}
  .tsx-slots{display:flex;gap:8px;flex-wrap:wrap;min-height:60px;align-items:center}
  .tsx-slot{min-width:84px;padding:.5em .8em;border-radius:8px;border:2px dashed var(--line);text-align:center;font:800 1rem var(--mono);transition:.35s}
  .tsx-slot small{display:block;font-size:.65rem;color:var(--mute)}
  .tsx-slot.f{border-style:solid;border-color:var(--bc,var(--ts));background:color-mix(in srgb,var(--bc,var(--ts)) 20%,transparent);animation:pop .4s both}
  .tsx-slot.x{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 20%,transparent);animation:shake .4s}
  .tsx-card{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:14px;display:grid;gap:10px}
  .tsx-node{padding:.6em 1em;border-radius:8px;border:2px solid var(--line);background:var(--card);font:700 .875rem var(--mono);text-align:center;transition:.4s;opacity:.55}
  .tsx-node.lit{opacity:1;border-color:var(--c);background:color-mix(in srgb,var(--c) 22%,var(--card));transform:scale(1.05);box-shadow:0 10px 24px -12px var(--c)}
  .tsx-flow{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;align-items:center;text-align:center}
  .tsx-tbl{width:100%;border-collapse:separate;border-spacing:0 6px}
  .tsx-tbl th{font-size:.75rem;color:var(--mute);padding:.3em}
  .tsx-tbl td{padding:.6em 1em;background:var(--card);cursor:pointer;font-weight:800;text-align:center;transition:.2s}
  .tsx-tbl td:first-child{text-align:left;border-radius:12px 0 0 12px}.tsx-tbl td:last-child{border-radius:0 12px 12px 0}
  .tsx-tbl tr:hover td{background:var(--card2)}.tsx-tbl tr.on td{background:color-mix(in srgb,var(--c) 22%,var(--card))}
  .tsx-tbl .y{color:var(--ok)}.tsx-tbl .n{color:var(--bad)}.tsx-tbl .t{color:var(--team)}
  .tsx-tg{display:flex;align-items:center;gap:10px;padding:.5em .8em;border-radius:8px;background:var(--card2);border:1px solid var(--line);cursor:pointer;font:700 .875rem var(--mono);transition:.2s}
  .tsx-tg i{width:34px;height:20px;border-radius:6px;background:var(--line);position:relative;transition:.25s;flex:none}
  .tsx-tg i::after{content:"";position:absolute;left:3px;top:3px;width:14px;height:14px;border-radius:50%;background:#fff;transition:.25s}
  .tsx-tg.on i{background:var(--ok)}.tsx-tg.on i::after{left:17px}
  .tsx-obj{border:3px solid var(--line);border-radius:8px;padding:12px 14px;font:700 .875rem var(--mono);display:grid;gap:3px;transition:.4s;background:var(--code);color:#d8dcff}
  .tsx-obj.ok{border-color:var(--ok);box-shadow:0 0 28px -8px var(--ok)}.tsx-obj.ng{border-color:var(--bad)}
  .tsx-obj div{animation:pop .3s both}
  .tsx-bl{display:block;padding:.45em .9em;border-radius:6px;font:800 .875rem var(--mono);margin:4px 0;color:#06101f;animation:pop .45s both}
  .tsx-bl.inh{opacity:.45;border:2px dashed var(--line);background:transparent;color:var(--text)}
  .tsx-sec{transition:.5s}.tsx-sec.off{display:none}
  .tsx-fall{animation:tfall .7s cubic-bezier(.3,1.5,.5,1) both}
  @keyframes tfall{from{opacity:0;transform:translateY(-60px)}}
  .tsx-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:3px;width:200px;aspect-ratio:1;background:var(--card);padding:6px;border-radius:8px;position:relative}
  .tsx-grid i{background:var(--card2);border-radius:6px}
  .tsx-bot{position:absolute;width:calc(20% - 4px);aspect-ratio:1;display:grid;place-items:center;font-size:1.5rem;transition:left .35s,top .35s}
  .tsx-dpad{display:grid;grid-template-columns:repeat(3,56px);grid-template-rows:repeat(3,56px);gap:4px}
  .tsx-dpad button{all:unset;cursor:pointer;display:grid;place-items:center;border-radius:8px;background:var(--card2);border:1px solid var(--line);font-size:1.5rem;transition:.15s}
  .tsx-dpad button:hover{background:var(--c);transform:scale(1.08)}
  .tsx-fac{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;min-height:120px}
  .tsx-inst{padding:10px 12px;border-radius:8px;background:linear-gradient(160deg,color-mix(in srgb,var(--c) 22%,var(--card)),var(--card));border:1px solid var(--c);font:700 .75rem var(--mono);animation:stamp .55s cubic-bezier(.2,1.6,.4,1) both}
  .tsx-inst b{display:block;font-size:.875rem;color:var(--c)}
  @keyframes stamp{from{opacity:0;transform:translateY(-40px) scale(1.6) rotate(-8deg)}}
  .tsx-mx{display:grid;grid-template-columns:110px repeat(3,1fr);gap:6px;align-items:stretch}
  .tsx-mx .hd{font-weight:800;font-size:.75rem;color:var(--mute);display:grid;place-items:center;text-align:center}
  .tsx-mx .fl{display:grid;place-items:center;font:800 .875rem var(--mono);border-radius:8px;padding:.6em;background:var(--card2)}
  .tsx-mx button{all:unset;cursor:pointer;display:grid;place-items:center;min-height:54px;border-radius:8px;background:var(--card);border:2px dashed var(--line);font-size:1.5rem;transition:.25s;text-align:center}
  .tsx-mx button:hover{transform:scale(1.05);border-color:var(--c)}
  .tsx-mx button.y{border-style:solid;border-color:var(--ok);background:color-mix(in srgb,var(--ok) 18%,transparent)}
  .tsx-mx button.n{border-style:solid;border-color:var(--bad);background:color-mix(in srgb,var(--bad) 18%,transparent);animation:shake .4s}
  .tsx-tree{display:grid;justify-items:center;gap:30px;position:relative}
  .tsx-tree .kids{display:flex;gap:24px}
  .tsx-cls{min-width:150px;border-radius:8px;overflow:hidden;border:2px solid var(--line);background:var(--card);transition:.45s;font:700 .75rem var(--mono)}
  .tsx-cls header{padding:.4em .8em;background:var(--cc);color:#06101f;font-weight:900;display:flex;justify-content:space-between;gap:8px}
  .tsx-cls div{padding:.2em .8em;transition:.4s}
  .tsx-cls .inh{opacity:.5;font-style:italic}
  .tsx-cls.off{opacity:0;transform:scale(.7);pointer-events:none}
  .tsx-cls.x{border-color:var(--bad);animation:shake .4s}
  .tsx-gate{display:grid;grid-template-columns:1fr 70px 1fr;gap:10px;align-items:center}
  .tsx-door{height:90px;border-radius:8px;display:grid;place-items:center;font-size:2.2rem;background:var(--card);border:3px solid var(--line);transition:.4s}
  .tsx-door.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 18%,transparent)}.tsx-door.ng{border-color:var(--bad);animation:shake .4s}
  .tsx-mach{border:3px solid var(--c);border-radius:10px;padding:16px;background:linear-gradient(160deg,color-mix(in srgb,var(--c) 14%,var(--card)),var(--card));display:grid;gap:10px;justify-items:center;position:relative}
  .tsx-mach .ti{font:900 1.25rem var(--mono)}
  .tsx-mach .T{color:var(--c);padding:0 .3em;border-bottom:3px solid var(--c);transition:.3s}
  .tsx-mach .slot{min-width:150px;min-height:56px;display:grid;place-items:center;border-radius:8px;border:3px dashed var(--c);font:800 1rem var(--mono)}
  .tsx-tl{display:grid;gap:6px}
  .tsx-t{display:flex;align-items:center;gap:10px;padding:.55em .9em;border-radius:8px;background:var(--card);border:1px solid var(--line);font:700 .875rem var(--mono);transition:.35s}
  .tsx-t i{flex:none;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:.75rem;background:var(--line)}
  .tsx-t.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 12%,var(--card))}.tsx-t.ok i{background:var(--ok);color:#052e16}
  .tsx-t.ng{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 12%,var(--card))}.tsx-t.ng i{background:var(--bad);color:#fff}
  .tsx-t em{margin-left:auto;font-style:normal;font-weight:500;font-size:.75rem;color:var(--mute);text-align:right}
  .tsx-light{display:flex;align-items:center;gap:12px;padding:.6em 1em;border-radius:8px;font-weight:900;background:var(--card);border:2px solid var(--line);transition:.4s}
  .tsx-light b{font-size:2rem}
  .tsx-light.g{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 15%,var(--card))}.tsx-light.r{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 15%,var(--card))}
  .tsx-aaa{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
  .tsx-aaa div{padding:12px;border-radius:8px;border:2px solid var(--line);background:var(--card);text-align:center;transition:.4s;opacity:.5}
  .tsx-aaa div.on{opacity:1;border-color:var(--c);background:color-mix(in srgb,var(--c) 20%,var(--card));transform:translateY(-4px)}
  .tsx-aaa b{display:block;font-size:1.5rem}
  .tsx-flip{all:unset;cursor:pointer;display:block;padding:12px;border-radius:8px;background:var(--card);border:1px solid var(--line);transition:.25s;font:700 .875rem var(--mono)}
  .tsx-flip:hover{transform:translateY(-3px);border-color:var(--c)}
  .tsx-flip b{display:block;color:var(--c);font-size:1rem;margin-bottom:.2em}
  .tsx-flip small{display:block;color:var(--mute);font:500 .75rem var(--font)}
  .tsx-q{display:grid;gap:14px}
  .tsx-qh{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
  .tsx-bar{height:10px;border-radius:6px;background:var(--line);overflow:hidden;flex:1;min-width:120px}.tsx-bar i{display:block;height:100%;background:linear-gradient(90deg,var(--basic),var(--ts),var(--pink));width:0;transition:width .8s}
  .tsx-qo{all:unset;cursor:pointer;display:block;padding:.8em 1.1em;border-radius:8px;border:1px solid var(--line);background:var(--card);font-weight:700;transition:.2s}
  .tsx-qo:hover{background:var(--card2);transform:translateX(5px)}
  .tsx-qo.ok{background:color-mix(in srgb,var(--ok) 25%,transparent);border-color:var(--ok)}
  .tsx-qo.bad{background:color-mix(in srgb,var(--bad) 25%,transparent);border-color:var(--bad);animation:shake .4s}
  .tsx-tb{display:grid;grid-template-columns:90px 1fr 50px;gap:10px;align-items:center;font-weight:800;margin:6px 0}
  @media(max-width:700px){.tsx-pipe{grid-template-columns:1fr}.tsx-arrow{transform:rotate(90deg)}.tsx-flow,.tsx-gate{grid-template-columns:1fr}.tsx-mx{grid-template-columns:80px repeat(3,1fr)}}
  `);

  /* ------- helpers ------- */
  const mono = (t, c) => h('code', { class: 'i', style: c ? { color: c } : null }, t);
  const res = (ok, t) => h('div', { class: 'tsx-res ' + (ok ? 'ok' : 'ng') }, (ok ? '✓ ' : '✖ ') + t);
  // 実践用：missions(v, c, edited) が「ミッション」の一覧を返す。solution は「答えを見る」に出る模範解答。
  const nc = (v) => v['main.ts'].replace(/\/\/.*$/gm, '');
  const lineOk = (src, re, errs) => { const L = src.split('\n'); const i = L.findIndex((l) => re.test(l) && !/^\s*\/\//.test(l)); return i >= 0 && !errs.some((e) => e.line === i + 1); };
  const ranOk = (c, f) => c.errors.length === 0 && c.logs.length > 0 && !c.logs.some((l) => l.k === 'e') && (!f || f(c.logs.map((l) => l.t)));
  const applyFix = (starter, fix) => (typeof fix === 'string' ? fix : fix.reduce((t, [a, b]) => t.replace(a, b), starter));
  const tsPractice = (starter, missions, solution, title, help) => playground({
    title: title || 'TypeScript', mode: 'ts', files: [{ name: 'main.ts', lang: 'ts', code: starter }],
    solution: { 'main.ts': solution },
    tasks: (v, c) => missions(v, c, v['main.ts'] !== starter).map((t, i) => (help && help[i] ? Object.assign({}, t, { hint: help[i].hint, answer: { code: applyFix(starter, help[i].fix), lang: 'ts', mode: 'replace' } }) : t)),
  });

  /* ===== gap-fill scenes: any/unknown, void/null, readonly, super, test theory, vitest ===== */
  style('gap-ts', `
  .gap-pn{border-radius:8px;border:2px solid var(--pc);background:linear-gradient(165deg,color-mix(in srgb,var(--pc) 12%,var(--card)),var(--card));padding:14px;display:grid;gap:10px;align-content:start}
  .gap-pn h4{margin:0;display:flex;gap:.5em;align-items:center;font:900 1rem var(--mono);color:var(--pc)}
  .gap-v{display:flex;gap:6px;flex-wrap:wrap}
  .gap-v button,.gap-act{all:unset;cursor:pointer;padding:.25em .8em;border-radius:6px;border:1px solid var(--line);background:var(--card);font:700 .75rem var(--mono);transition:.2s}
  .gap-v button:hover,.gap-act:hover{transform:translateY(-2px);border-color:var(--pc,var(--ts))}
  .gap-v button.on{background:var(--ts);color:#fff;border-color:transparent}
  .gap-verd{padding:.5em .8em;border-radius:6px;font:700 .75rem var(--mono);min-height:2.6em;transition:.3s;background:var(--code);color:#d8dcff}
  .gap-verd.ok{background:color-mix(in srgb,var(--ok) 20%,var(--code))}.gap-verd.ng{background:color-mix(in srgb,var(--bad) 25%,var(--code));animation:shake .4s}
  .gap-inst{display:grid;gap:6px;border-radius:8px;border:2px solid var(--ts);background:var(--card);padding:12px;min-width:190px}
  .gap-inst .f{display:flex;justify-content:space-between;gap:10px;padding:.35em .7em;border-radius:6px;background:var(--bg2);font:800 .875rem var(--mono);transition:.4s;border:2px solid transparent}
  .gap-inst .f.lock{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 12%,var(--bg2))}
  .gap-inst .f.fill{animation:capin .5s both;border-color:var(--ok)}
  .gap-inst .f em{font-style:normal;color:var(--mute);font-weight:600}
  pre.code.dim .ln.err{opacity:1}
  .gap-3 pre.code{white-space:pre-wrap;word-break:break-all}
  .gap-3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
  .gap-why{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
  .gap-why button{all:unset;cursor:pointer;padding:10px;border-radius:8px;background:var(--card);border:1px solid var(--line);transition:.3s;font-weight:800;font-size:.875rem;display:grid;gap:4px}
  .gap-why button .ic{width:1.6em;height:1.6em;color:var(--ts)}
  .gap-why button small{color:var(--mute);font-weight:500;font-size:.75rem;max-height:0;opacity:0;overflow:hidden;transition:.4s}
  .gap-why button.on{border-color:var(--ts);background:color-mix(in srgb,var(--ts) 16%,var(--card));transform:translateY(-3px)}.gap-why button.on small{max-height:5em;opacity:1}
  .gap-chart{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;align-items:end;height:200px;padding:10px;background:var(--card);border:1px solid var(--line);border-radius:8px}
  .gap-chart .b{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:6px;height:100%;font-weight:800;font-size:.75rem;text-align:center}
  .gap-chart .b i{display:block;width:70%;border-radius:10px 10px 4px 4px;background:var(--ts);transition:height .7s cubic-bezier(.2,.9,.3,1.2),background .4s;height:8px}
  .gap-chart .b.on i{background:linear-gradient(180deg,var(--pink),var(--team))}
  .gap-pyr{display:grid;gap:6px;justify-items:center}
  .gap-pyr button{all:unset;cursor:pointer;text-align:center;padding:.8em 0;font-weight:900;border-radius:8px;transition:.35s;background:color-mix(in srgb,var(--lc) 25%,var(--card));border:2px solid var(--lc);position:relative}
  .gap-pyr button.on{background:var(--lc);color:#06101f;transform:scale(1.04);box-shadow:0 12px 28px -12px var(--lc)}
  .gap-pyr button small{display:block;font-weight:600;font-size:.75rem;opacity:.85}
  .gap-m{display:grid;grid-template-columns:70px 1fr;gap:8px;align-items:center;font-weight:800;font-size:.875rem}
  .gap-m i{display:block;height:12px;border-radius:6px;background:var(--line);position:relative;overflow:hidden}
  .gap-m i::after{content:"";position:absolute;inset:0;width:var(--w,0%);background:var(--ts);border-radius:6px;transition:width .6s}
  .gap-flow{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;position:relative;padding-bottom:34px}
  .gap-flow .nd{text-align:center;padding:12px 4px;border-radius:8px;border:2px solid var(--line);background:var(--card);font-weight:800;font-size:.875rem;transition:.4s;opacity:.55}
  .gap-flow .nd .ic{width:1.6em;height:1.6em;display:block;margin:0 auto 4px}
  .gap-flow .nd.on{opacity:1;border-color:var(--ts);background:color-mix(in srgb,var(--ts) 20%,var(--card));transform:translateY(-6px);box-shadow:0 12px 24px -12px var(--ts)}
  .gap-flow .loop{position:absolute;left:10%;right:10%;bottom:6px;height:22px;border:2px dashed var(--line);border-top:0;border-radius:0 0 18px 18px;transition:.4s}
  .gap-flow .loop.on{border-color:var(--pink)}
  .gap-flow .loop::after{content:"足りなければ戻る";position:absolute;left:50%;bottom:-.1em;transform:translateX(-50%);background:var(--bg);padding:0 .6em;font:800 .75rem var(--font);color:var(--mute)}
  .gap-race{display:grid;gap:8px}.gap-race .rr{display:grid;grid-template-columns:90px 1fr 60px;gap:10px;align-items:center;font-weight:800;font-size:.875rem}
  .gap-race .rr i{display:block;height:16px;border-radius:6px;background:var(--line);overflow:hidden;position:relative}
  .gap-race .rr i b{position:absolute;inset:0;width:0;background:var(--team);border-radius:6px}.gap-race .rr.v i b{background:var(--ok)}
  @media(max-width:900px){.gap-3,.gap-why{grid-template-columns:1fr}.gap-flow{grid-template-columns:1fr 1fr}}
  `);
  const ico = (n, o) => K.W.icon(n, o);

  function anyScene(el) {
    const VALS = [['42', 42], ['"hello"', 'hello'], ['true', true], ['null', null]];
    const ACTS = [['data.toFixed(1)', 'number', (v) => v.toFixed(1)], ['data.toUpperCase()', 'string', (v) => v.toUpperCase()]];
    let cur = 0, guard = false;
    const mk = (title, c) => { const v = h('div', { class: 'gap-v' }), verd = h('div', { class: 'gap-verd' }), run = h('div', { class: 'gap-verd' }), acts = h('div', { class: 'gap-v' }); const pn = h('div', { class: 'gap-pn', style: { '--pc': c } }, h('h4', title), h('div', { class: 'label' }, '代入する値'), v, h('div', { class: 'label' }, '使ってみる'), acts, h('div', { class: 'label' }, 'TypeScript の判定'), verd, h('div', { class: 'label' }, '実行すると'), run); return { pn, v, verd, run, acts }; };
    const A = mk('let data: any', 'var(--bad)'), U = mk('let data: unknown', 'var(--ok)');
    const g = h('label', { class: 'row', style: { cursor: 'pointer', fontWeight: 800, fontSize: '.875rem' } }, h('input', { type: 'checkbox', onchange: (e) => { guard = e.target.checked; draw(); } }), 'typeof で絞り込む（if 文で守る）');
    U.pn.insertBefore(g, U.pn.children[4]);
    const act = (P, i) => { P.act = i; draw(); };
    function draw() {
      [A, U].forEach((P) => { P.v.replaceChildren(...VALS.map(([t], i) => h('button', { class: i === cur ? 'on' : '', onclick: () => { cur = i; draw(); } }, t))); P.acts.replaceChildren(...ACTS.map(([t], i) => h('button', { class: P.act === i ? 'on' : '', onclick: () => act(P, i) }, t))); });
      const val = VALS[cur][1];
      const go = (P, kind) => {
        if (P.act == null) { P.verd.className = 'gap-verd'; P.verd.textContent = '← 操作を選んでね'; P.run.className = 'gap-verd'; P.run.textContent = ''; return; }
        const [txt, ty, fn] = ACTS[P.act];
        if (kind === 'any') { P.verd.className = 'gap-verd ok'; P.verd.textContent = '✓ エラーなし（何でも通る…）'; try { P.run.className = 'gap-verd ok'; P.run.textContent = '→ ' + fn(val); } catch (e) { P.run.className = 'gap-verd ng'; P.run.textContent = '💥 ' + e.constructor.name + ': ' + e.message; } }
        else if (!guard) { P.verd.className = 'gap-verd ng'; P.verd.textContent = "✖ 'data' is of type 'unknown'."; P.run.className = 'gap-verd'; P.run.textContent = '（赤線 → 実行前に止められる）'; }
        else { P.verd.className = 'gap-verd ok'; P.verd.textContent = `✓ if (typeof data === "${ty}") { ${txt} }`; P.run.className = 'gap-verd ok'; P.run.textContent = typeof val === ty ? '→ ' + fn(val) : '（型が違うので if に入らず、何も起きない＝安全）'; }
      };
      go(A, 'any'); go(U, 'unknown');
    }
    el.append(h('div', { class: 'split' }, A.pn, U.pn), h('div', { class: 'st-cap', style: { marginTop: '14px', animation: 'none' }, html: '<b>any</b> は型チェックを諦める＝バグが実行時まで隠れる。<b>unknown</b> は「何か分からない。使う前に確認してね」と守ってくれる。' }));
    draw();
  }

  function voidNullScene(el) {
    const mk = (name, c, src, runFn) => { const out = h('div', { class: 'gap-verd' }); const card = h('div', { class: 'gap-pn', style: { '--pc': c } }, h('h4', name), code(src, 'ts', { color: c }), h('button', { class: 'gap-act', onclick: () => { out.replaceChildren(); runFn(out); } }, '▶ 実行'), out); return card; };
    const logs = (out, arr) => arr.forEach((t, i) => setTimeout(() => out.append(h('div', t)), i * 280));
    const c1 = mk('void', 'var(--team)', 'function greet(name: string): void {\n  console.log(`Hello, ${name}`);\n}\nconst message = greet("みんな");\nconsole.log(message);', (o) => logs(o, ['› Hello, みんな', '› undefined  ← 戻り値なし']));
    const c2 = mk('undefined', 'var(--ts)', 'let score: number | undefined;\nconsole.log(score);\nscore = 80;\nconsole.log(score);', (o) => logs(o, ['› undefined  ← まだ値が入っていない', '› 80']));
    let isNull = true;
    const nOut = h('div', { class: 'gap-verd' }), nCode = h('div'), tog = h('button', { class: 'gap-act', onclick: () => { isNull = !isNull; draw(); } });
    const c3 = h('div', { class: 'gap-pn', style: { '--pc': 'var(--pink)' } }, h('h4', 'null'), nCode, tog, nOut);
    function draw() {
      tog.textContent = 'name を ' + (isNull ? '"Lam" に変える' : 'null に戻す');
      const cd = code(`let name: string | null = ${isNull ? 'null' : '"Lam"'};\nif (name === null) {\n  console.log("名前が設定されていません。");\n} else {\n  console.log("名前は " + name + " です。");\n}`, 'ts', { dim: true, color: 'var(--pink)' });
      cd.setHi(isNull ? [1, 2, 3] : [1, 4, 5]); nCode.replaceChildren(cd);
      nOut.className = 'gap-verd ok'; nOut.textContent = isNull ? '› 名前が設定されていません。' : '› 名前は Lam です。';
    }
    el.append(h('div', { class: 'gap-3' }, c1, c2, c3), h('div', { class: 'row', style: { marginTop: '14px' } }, h('span', { class: 'chip', style: { '--c': 'var(--team)' } }, 'void = return しない'), h('span', { class: 'chip', style: { '--c': 'var(--ts)' } }, 'undefined = 未定義'), h('span', { class: 'chip', style: { '--c': 'var(--pink)' } }, 'null = 「空」とはっきり書く')));
    draw();
  }

  function readonlySceneGap(el) {
    const src = 'class Person {\n  private readonly name: string;\n  age: number;\n\n  constructor(name: string, age: number) {\n    this.name = name;     // ① 最初の代入はOK\n    this.age = age;\n  }\n\n  update(): void {\n    this.name = "他人";   // ② 後から変更 → エラー\n  }\n}';
    const pre = code(src, 'ts', { dim: true, color: 'var(--ts)' }), box = h('div', { class: 'gap-inst' }), msg = h('div');
    const lk = h('span', { style: { display: 'none', color: 'var(--bad)' } }, ico('lock')), nm1 = h('span', 'name'), f1 = h('div', { class: 'f' }, h('span', nm1, ' ', lk), h('em', '?')), f2 = h('div', { class: 'f' }, 'age', h('em', '?'));
    box.append(h('div', { class: 'label' }, 'インスタンス'), f1, f2);
    const IN = [[], [2], [6], [7], [11]];
    el.append(stepper({
      color: 'var(--ts)',
      steps: [{ say: '<b>readonly</b> = 読み取り専用。<b>private</b> と組み合わせるのが定番。' }, { say: '<b>① constructor</b> の中なら代入できる（ここで最初の値を決める）。' }, { say: 'age は readonly ではないので、いつでも変更OK。' }, { say: '<b>② update()</b> で name を書き換えようとすると…？' }, { say: '✖ <b>エラー！</b> 「変わらないデータ」「外からの書き換え防止」「データの矛盾を防ぐ」のに役立つ。' }],
      init(vis) { vis.append(h('div', { class: 'split wide-l' }, pre, h('div', { class: 'col' }, box, msg))); },
      update(n) {
        pre.setHi([], 'on'); pre.setHi([], 'err'); pre.setHi([[2], [6], [7], [10, 11], [11]][n], n === 4 ? 'err' : 'on');
        lk.style.display = n >= 1 ? 'inline' : 'none'; f1.className = 'f' + (n >= 1 ? ' lock' : '') + (n === 1 ? ' fill' : ''); f1.lastChild.textContent = n >= 1 ? '"山田"' : '?';
        f2.className = 'f' + (n === 2 ? ' fill' : ''); f2.lastChild.textContent = n >= 2 ? '25' : '?';
        msg.replaceChildren(n === 4 ? res(false, "Cannot assign to 'name' because it is a read-only property.") : n === 1 ? res(true, 'constructor 内の代入は OK') : '');
        if (n === 4) f1.classList.add('shake');
      },
    }));
  }

  function superScene(el) {
    const src = 'class Employee extends Person {\n  employeeId: number;\n\n  constructor(name: string, age: number, id: number) {\n    super(name, age);   // ① 先に親を初期化\n    this.employeeId = id; // ② その後で自分の分\n  }\n\n  introduce(): void {\n    super.introduce();  // ③ 親の introduce を呼ぶ\n    console.log(`従業員ID は ${this.employeeId} です。`);\n  }\n}\nconst e = new Employee("佐藤花子", 30, 101);\ne.introduce();';
    const pre = code(src, 'ts', { dim: true, color: 'var(--ts)' }), box = h('div', { class: 'gap-inst' }), out = h('div', { class: 'gap-verd', style: { minHeight: '4.6em' } }), msg = h('div');
    const fs = ['name', 'age', 'employeeId'].map((t) => h('div', { class: 'f' }, t, h('em', '?'))); box.append(h('div', { class: 'label' }, 'Employee のインスタンス'), ...fs);
    const L = [[14], [5], [6], [10], [11], [5]];
    el.append(stepper({
      color: 'var(--ts)',
      steps: [{ say: '<code class="i">new Employee(...)</code> を呼ぶと constructor が動く。' }, { say: '<b>super(name, age)</b>：親 Person の constructor を実行 → name / age が入る。' }, { say: 'その<b>あと</b> this.employeeId を設定。親→子の順番が大事。' }, { say: '<b>super.introduce()</b>：親のメソッドを呼んでから…' }, { say: '子の処理を足して出力。親の挨拶 ＋ 子の情報！' }, { say: '❌ <b>super() より前に this</b> を使うと NG。「親が先」がルール。' }],
      init(vis) { vis.append(h('div', { class: 'split wide-l' }, pre, h('div', { class: 'col' }, box, out, msg))); },
      update(n) {
        pre.setHi([], 'on'); pre.setHi([], 'err'); pre.setHi(L[n], n === 5 ? 'err' : 'on');
        const ok = n >= 1 && n < 5; fs[0].lastChild.textContent = ok ? '"佐藤花子"' : '?'; fs[1].lastChild.textContent = ok ? '30' : '?'; fs[2].lastChild.textContent = n >= 2 && n < 5 ? '101' : '?';
        fs.forEach((f, i) => { f.className = 'f' + ((n === 1 && i < 2) || (n === 2 && i === 2) ? ' fill' : ''); });
        out.replaceChildren(...(n >= 3 && n < 5 ? [h('div', '› こんにちは、私の名前は 佐藤花子 です。年齢は 30 歳です。'), ...(n >= 4 ? [h('div', '› 従業員ID は 101 です。')] : [])] : []));
        msg.replaceChildren(n === 5 ? res(false, "'super' must be called before accessing 'this' in the constructor of a derived class.") : '');
      },
    }));
  }

  function whyTestScene(el) {
    const W = [['bug', '早期のバグ発見', '開発の初期に見つければ、修正コストが小さい。'], ['shield-check', '品質保証', '要求どおりに動くことを確認できる。'], ['rocket', '自信を持ってデプロイ', '安心して製品をリリースできる。'], ['git-pull-request', 'コード変更のサポート', '変更時のバグを早く特定できる。'], ['life-buoy', 'リスク軽減', 'リリース時のリスクを減らす。'], ['book-open', 'ドキュメント', 'テストはコードの動きを説明する資料にもなる。']];
    const grid = h('div', { class: 'gap-why' }, W.map(([ic, t, d], i) => { const b = h('button', { onclick: () => b.classList.toggle('on') }, ico(ic), t, h('small', d)); if (i === 0) setTimeout(() => b.classList.add('on'), 400); return b; }));
    const ST = [['書いた直後', 1], ['テスト工程', 10], ['リリース後', 100]];
    const bars = ST.map(([t, c]) => h('div', { class: 'b' }, h('span', '×' + c), h('i'), h('span', t)));
    const chart = h('div', { class: 'gap-chart' }, bars);
    let cur = 0; const pick = (i) => { cur = i; bars.forEach((b, k) => { b.classList.toggle('on', k === i); b.querySelector('i').style.height = (k <= i ? [14, 56, 118][k] : 8) + 'px'; }); cap.innerHTML = ['すぐ直せば<b>1</b>。', '見つかるのが遅れると約<b>10倍</b>…', '本番で見つかると<b>100倍</b>の手間とお金。（イメージ）'][i]; };
    const cap = h('div', { class: 'st-cap' }), ctl = h('div', { class: 'gap-chips', style: { display: 'flex', gap: '6px' } }, ST.map(([t], i) => h('button', { class: 'gap-chip', onclick: () => pick(i) }, 'バグを見つけるのは… ' + t)));
    el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('テストする6つの理由（クリック）'), grid), h('div', { class: 'col' }, lbl('修正コストのイメージ'), chart, ctl, cap)));
    pick(0); setTimeout(() => pick(2), 900); setTimeout(() => pick(0), 2400);
  }

  function pyramidScene(el) {
    style('tp', `
    .tp{display:grid;grid-template-columns:minmax(300px,.9fr) 1.1fr;gap:18px;align-items:stretch}
    .tp-left{display:flex;flex-direction:column;gap:12px}
    .tp-pyr{display:flex;flex-direction:column;gap:5px;align-items:center;flex:1;justify-content:center}
    .tp-layer{all:unset;box-sizing:border-box;cursor:pointer;width:100%;height:84px;display:grid;place-content:center;justify-items:center;text-align:center;color:#06101f;font-weight:900;background:var(--lc);filter:saturate(.8) brightness(.62);transition:filter .25s,transform .25s;position:relative}
    .tp-layer:hover{filter:saturate(1) brightness(.9)}
    .tp-layer:focus-visible{outline:3px solid var(--text);outline-offset:-3px}
    .tp-layer.on{filter:none;transform:scale(1.02);z-index:2}
    .tp-layer b{font-size:.95rem;line-height:1.2}.tp-layer small{font-size:.72rem;font-weight:700;opacity:.8}
    .tp-layer .ic{width:16px;height:16px;margin-bottom:2px}
    .tp-l0{clip-path:polygon(50% 0,66.67% 100%,33.33% 100%)}
    .tp-l1{clip-path:polygon(33.33% 0,66.67% 0,83.33% 100%,16.67% 100%)}
    .tp-l2{clip-path:polygon(16.67% 0,83.33% 0,100% 100%,0 100%)}
    .tp-l0 b,.tp-l0 small{margin:0 -6px}.tp-l0{padding-top:22px}
    .tp-tabs{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;align-items:center}
    .tp-tabs>span{font-size:.72rem;font-weight:800;color:var(--mute);letter-spacing:.06em}
    .tp-tab{all:unset;cursor:pointer;display:inline-flex;gap:.4em;align-items:center;padding:.3em .9em;border-radius:8px;border:1px solid var(--line);background:var(--card);font-weight:800;font-size:.8rem;transition:.2s}
    .tp-tab:hover{transform:translateY(-2px)}.tp-tab:focus-visible{outline:2px solid var(--text)}
    .tp-tab.on{background:color-mix(in srgb,var(--c) 22%,var(--card));border-color:var(--c)}.tp-tab .ic{width:14px;height:14px;color:var(--c)}
    .tp-detail{display:flex;flex-direction:column;gap:14px;padding:16px 18px;border-radius:10px;background:linear-gradient(170deg,color-mix(in srgb,var(--c) 14%,var(--card)),var(--card));border:1px solid color-mix(in srgb,var(--c) 45%,var(--line));transition:border-color .3s}
    .tp-hd{display:flex;gap:12px;align-items:center}
    .tp-ico{flex:none;width:44px;height:44px;border-radius:10px;display:grid;place-items:center;background:color-mix(in srgb,var(--c) 22%,transparent);color:var(--c)}.tp-ico .ic{width:24px;height:24px}
    .tp-hd h4{font-size:1.15rem;font-weight:900;line-height:1.2}.tp-hd p{font-size:.85rem;color:var(--mute);font-weight:600;margin-top:.15em}
    .tp-ex{display:grid;gap:4px;padding:10px 12px;border-radius:8px;background:var(--code);color:#cfd5ff;font-size:.85rem;font-weight:600}
    .tp-ex small{color:#8e97c4;font-weight:800;letter-spacing:.08em;font-size:.68rem}
    .tp-ex code{font:700 .85rem var(--mono);color:#ffb6c1}
    .tp-m{display:grid;grid-template-columns:70px 1fr 38px;gap:10px;align-items:center;font-size:.8rem;font-weight:800}
    .tp-m i{display:block;height:10px;border-radius:5px;background:var(--line);overflow:hidden}.tp-m u{display:block;height:100%;width:var(--w);background:var(--c);border-radius:5px;transition:width .7s cubic-bezier(.2,.9,.3,1)}
    .tp-m em{font-style:normal;color:var(--mute);text-align:right}
    .tp-when{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
    .tp-w{display:grid;gap:3px;justify-items:center;text-align:center;padding:8px 4px;border-radius:8px;background:var(--card);border:1px solid var(--line);font-size:.72rem;font-weight:800;color:var(--mute);transition:.3s}
    .tp-w .ic{width:18px;height:18px}.tp-w.on{background:color-mix(in srgb,var(--c) 22%,var(--card));border-color:var(--c);color:var(--text);transform:translateY(-3px)}.tp-w.on .ic{color:var(--c)}
    .tp-game{margin-top:16px;padding:14px 16px;border-radius:10px;background:var(--card);border:1px solid var(--line);display:grid;gap:10px}
    .tp-game h5{font-size:.95rem;font-weight:900;display:flex;gap:.5em;align-items:center}.tp-game h5 .ic{color:var(--ts)}
    .tp-q{font-weight:800;font-size:1rem;padding:.6em .9em;border-radius:8px;background:var(--code);color:#e6e9ff}
    .tp-opts{display:flex;gap:8px;flex-wrap:wrap}.tp-opts button{all:unset;cursor:pointer;padding:.35em 1em;border-radius:8px;border:1px solid var(--line);background:var(--card2);font-weight:800;font-size:.85rem;transition:.2s}
    .tp-opts button:hover{transform:translateY(-2px)}.tp-opts button.ok{background:color-mix(in srgb,var(--ok) 25%,transparent);border-color:var(--ok)}.tp-opts button.bad{background:color-mix(in srgb,var(--bad) 22%,transparent);border-color:var(--bad);animation:shake .4s}
    .tp-fb{min-height:1.6em;font-size:.85rem;font-weight:700;color:var(--mute)}.tp-fb.ok{color:var(--ok)}
    @media(max-width:900px){.tp{grid-template-columns:1fr}.tp-when{grid-template-columns:repeat(2,1fr)}}`);
    const T = {
      e2e: { n: 'E2E テスト', ic: 'monitor', c: 'var(--pink)', d: 'ブラウザを実際に動かして、ユーザーと同じ操作を通しで確かめる。', ex: '「ログイン → 商品を選ぶ → 購入ボタン」が最後までつながるか', m: [30, 95, 20], when: 2 },
      int: { n: '統合テスト', ic: 'boxes', c: 'var(--team)', d: '複数の部品（モジュール）をつないで、連携がうまくいくか確かめる。', ex: 'カートの合計を決済モジュールに渡したら 0 円になった', m: [55, 60, 50], when: 1 },
      unit: { n: 'ユニットテスト', ic: 'flask-conical', c: 'var(--basic)', d: 'いちばん小さい単位（関数）だけを確かめる。速くてたくさん書ける。今日の主役！', ex: '<code>isEven(0)</code> が false を返してしまう', m: [95, 15, 90], when: 0 },
      reg: { n: '回帰テスト', ic: 'rotate-ccw', c: 'var(--ts)', d: '変更したあとも、前に動いていた機能が壊れていないか確かめる。ユニットテストを全部走らせれば自動でできる。', ex: '先週直したバグが、機能を足したあと再発した', m: [80, 30, 85], when: 0 },
      uat: { n: '受け入れテスト（UAT）', ic: 'user-check', c: 'var(--violet)', d: '依頼した側が「頼んだものになっているか」を確かめる。User Acceptance Test の略。', ex: '「請求書の形式が、うちの要件と違う」', m: [25, 90, 10], when: 3 },
    };
    const WHEN = [['pencil', '書いた直後'], ['hammer', 'ビルド時'], ['rocket', '公開前'], ['handshake', '納品前']];
    const layers = {}, tabs = {};
    const pyr = h('div', { class: 'tp-pyr', role: 'group', 'aria-label': 'テストピラミッド' });
    [['e2e', 0, '少なく・遅い'], ['int', 1, 'ほどほど'], ['unit', 2, '多く・速い']].forEach(([k, i, sm]) => {
      layers[k] = h('button', { class: 'tp-layer tp-l' + i, style: { '--lc': T[k].c }, 'aria-label': T[k].n, onclick: () => pick(k), onkeydown: (e) => { const ord = ['e2e', 'int', 'unit']; const j = ord.indexOf(k); if (e.key === 'ArrowDown' && j < 2) { e.preventDefault(); layers[ord[j + 1]].focus(); pick(ord[j + 1]); } if (e.key === 'ArrowUp' && j > 0) { e.preventDefault(); layers[ord[j - 1]].focus(); pick(ord[j - 1]); } } }, icon(T[k].ic), h('b', k === 'e2e' ? 'E2E' : T[k].n), h('small', sm));
      pyr.append(layers[k]);
    });
    const tabRow = h('div', { class: 'tp-tabs' }, h('span', 'ほかの見方：'), ['reg', 'uat'].map((k) => (tabs[k] = h('button', { class: 'tp-tab', style: { '--c': T[k].c }, onclick: () => pick(k) }, icon(T[k].ic), T[k].n))));
    const detail = h('div', { class: 'tp-detail', 'aria-live': 'polite' });
    function pick(k) {
      const t = T[k];
      Object.entries(layers).forEach(([n, b]) => b.classList.toggle('on', n === k || (k === 'reg') || (k === 'uat' && n === 'e2e')));
      Object.entries(tabs).forEach(([n, b]) => b.classList.toggle('on', n === k));
      detail.style.setProperty('--c', t.c);
      const meters = [['速さ', t.m[0]], ['コスト', t.m[1]], ['数', t.m[2]]].map(([l, v]) => { const u = h('u', { style: { '--w': '0%' } }); requestAnimationFrame(() => requestAnimationFrame(() => u.style.setProperty('--w', v + '%'))); return h('div', { class: 'tp-m', style: { '--c': l === 'コスト' ? 'var(--team)' : t.c } }, l, h('i', u), h('em', v + '%')); });
      detail.replaceChildren(
        h('div', { class: 'tp-hd' }, h('div', { class: 'tp-ico' }, icon(t.ic)), h('div', h('h4', t.n), h('p', t.d))),
        h('div', { class: 'tp-ex' }, h('small', 'こんなバグを見つける'), h('span', { html: t.ex })),
        h('div', { style: { display: 'grid', gap: '8px' } }, meters),
        h('div', null, h('div', { class: 'label', style: { marginBottom: '6px' } }, 'どこで失敗が見つかる？'), h('div', { class: 'tp-when' }, WHEN.map(([ic, l], i) => h('div', { class: 'tp-w' + (i === t.when ? ' on' : '') }, icon(ic), l)))));
    }
    el.append(h('div', { class: 'tp' }, h('div', { class: 'tp-left' }, lbl('テストピラミッド（段をクリック / ↑↓キー）'), pyr, tabRow), detail));
    pick('unit');
    // ---- mini game: which test finds this bug?
    const Q = [['<code>isEven(0)</code> が false を返してしまう', 'unit', '1つの関数の中の間違い → ユニットテスト'], ['カートの合計を決済モジュールに渡すと、0 円になる', 'int', '部品と部品の「つなぎ目」の間違い → 統合テスト'], ['ログインしたあと、画面で購入ボタンが押せない', 'e2e', '画面を通した操作の流れ → E2E テスト'], ['先週直したバグが、機能を足したあとに再発した', 'reg', '前に動いていたものが壊れた → 回帰テスト'], ['依頼者が「請求書の形式が要件と違う」と言った', 'uat', '依頼したものと合っているか → 受け入れテスト']];
    let qi = 0, okN = 0;
    const qEl = h('div', { class: 'tp-q' }), fb = h('div', { class: 'tp-fb' }), opts = h('div', { class: 'tp-opts' }), score = h('span', { class: 'chip' }, '0 / ' + Q.length);
    function showQ() {
      const [q] = Q[qi]; qEl.innerHTML = q; fb.className = 'tp-fb'; fb.textContent = '';
      opts.replaceChildren(...Object.keys(T).map((k) => h('button', { onclick: (e) => answer(k, e.currentTarget) }, T[k].n.replace('（UAT）', ''))));
    }
    function answer(k, b) {
      const [, ans, why] = Q[qi];
      if (k !== ans) { b.classList.remove('bad'); void b.offsetWidth; b.classList.add('bad'); fb.textContent = 'おしい！もう一度。'; return; }
      b.classList.add('ok'); okN++; score.textContent = okN + ' / ' + Q.length; fb.className = 'tp-fb ok'; fb.textContent = '✓ ' + why;
      opts.querySelectorAll('button').forEach((x) => (x.style.pointerEvents = 'none'));
      setTimeout(() => { qi++; if (qi < Q.length) showQ(); else { qEl.textContent = '全問クリア！ どのテストが何を守るか、つかめたね。'; opts.replaceChildren(); fb.textContent = ''; celebrate(); } }, 1400);
    }
    el.append(h('div', { class: 'tp-game' }, h('h5', icon('gamepad-2'), 'ミニゲーム：このバグは、どのテストで見つかる？', score), qEl, opts, fb));
    showQ();
  }

  function flowTestScene(el) {
    const N = [['clipboard-list', 'テストケース作成'], ['play', 'テスト実行'], ['search', '結果を確かめる'], ['hammer', 'バグ修正'], ['gauge', 'カバレッジ評価']];
    const SAY = ['各ユニットが期待どおり動くか確認する<b>テストを設計</b>する。', 'テストを実行し、<b>実際の出力と期待</b>を比べる。', '<b>成功と失敗</b>を確認。失敗は原因を調べる。', '見つけたバグを直して、<b>もう一度</b>テスト。', 'カバレッジ（テストがコードをどれだけ通ったか）をもれなく確認。足りなければ<b>ケースを追加</b>して最初へ。'];
    const nodes = N.map(([ic, t]) => h('div', { class: 'nd' }, ico(ic), t)), loop = h('div', { class: 'loop' }), flow = h('div', { class: 'gap-flow' }, nodes, loop);
    const det = h('div', { style: { minHeight: '120px' } });
    const rowOf = (items) => h('div', { class: 'tsx-tl' }, items.map(([t, k, m]) => h('div', { class: 'tsx-t ' + k }, h('i', k === 'ok' ? '✓' : k === 'ng' ? '✖' : '·'), t, m ? h('em', m) : null)));
    const DET = [
      () => code('test("isEven(5) は false", () => {\n  expect(isEven(5)).toBe(false);\n});', 'ts', { file: 'isEven.test.ts', color: 'var(--ts)' }),
      () => rowOf([['isEven(4)', 'ok', '期待 true / 実際 true'], ['isEven(5)', 'ok', '期待 false / 実際 false']]),
      () => rowOf([['isEven(4)', 'ok', ''], ['isEven(5)', 'ok', ''], ['isEven(0)', 'ng', '期待 true / 実際 false']]),
      () => code('function isEven(n: number) {\n  return n % 2 === 0;   // ← 0 も偶数！ 修正して再実行\n}', 'ts', { file: 'isEven.ts', color: 'var(--basic)', hi: [2] }),
      () => h('div', { class: 'col' }, h('div', { class: 'gap-m', style: { '--w': '70%', gridTemplateColumns: '120px 1fr' } }, 'カバレッジ 70%', h('i')), rowOf([['負の数 isEven(-2)', 'wait', 'ケース追加 → 100% へ']])),
    ];
    const WHEN = [['開発段階', '機能が完成した後・スプリントの終わり・リリース前'], ['バグ修正後', '直した後、ほかの部分に影響がないか確認'], ['システム変更後', '設計やアーキテクチャを変えたとき']];
    const wn = h('div', { class: 'st-cap', style: { animation: 'none' } }, '「いつ実施する？」をクリック');
    const wh = h('div', { class: 'row' }, WHEN.map(([t, d]) => h('button', { class: 'gap-chip', onclick: (e) => { [...wh.children].forEach((b) => b.classList.remove('on')); e.currentTarget.classList.add('on'); wn.innerHTML = '<b>' + t + '</b>：' + d; } }, 'いつ？ ' + t)));
    el.append(stepper({
      color: 'var(--ts)', interval: 2300,
      steps: SAY.map((s) => ({ say: s })),
      init(vis) { vis.append(flow, det); },
      update(n) {
        nodes.forEach((x, i) => x.classList.toggle('on', i === n)); loop.classList.toggle('on', n === 4);
        det.replaceChildren(DET[n]());
      },
    }), h('div', { style: { marginTop: '16px' } }, lbl('いつ実施する？'), wh, h('div', { style: { height: '8px' } }), wn));
  }

  function vitestScene(el) {
    const FILES = [
      ['Terminal', 'sh', '$ npm install -D vitest\n\nadded 42 packages in 3s\n  vitest@latest が devDependencies に入った'],
      ['package.json', 'json', '{\n  "scripts": {\n    "dev": "vite",\n    "build": "tsc && vite build",\n    "preview": "vite preview",\n    "test": "vitest"   // ← 追加\n  }\n}'],
      ['isEven.ts ＋ isEven.test.ts', 'ts', '// src/example/isEven.ts\nexport default function isEven(n: number): boolean {\n  return n % 2 === 0;\n}\n\n// __test__/isEven.test.ts\nimport { expect, test } from "vitest";\nimport isEven from "@/example/isEven";\n\ntest("isEven", () => {\n  expect(isEven(4)).toBe(true);\n  expect(isEven(5)).toBe(false);\n});'],
      ['Terminal', 'sh', '$ npm run test\n\n ✓ __test__/isEven.test.ts (1 test)\n   ✓ isEven\n\n Test Files  1 passed (1)\n      Tests  1 passed (1)'],
    ];
    const host = h('div');
    const MS = [['toBe', 'expect(isEven(4)).toBe(true)', () => Object.is(true, true)], ['toEqual', 'expect({a:1}).toEqual({a:1})', () => true], ['toBeTruthy', 'expect("abc").toBeTruthy()', () => !!'abc'], ['toBeGreaterThan', 'expect(10).toBeGreaterThan(3)', () => 10 > 3], ['toContain', 'expect([1,2,3]).toContain(2)', () => [1, 2, 3].includes(2)], ['toThrow', 'expect(() => { throw new Error() }).toThrow()', () => { try { (() => { throw new Error(); })(); return false; } catch { return true; } }]];
    const mg = h('div', { class: 'split', style: { gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))' } }, MS.map(([n, ex, f]) => { const out = h('div'); return h('button', { class: 'tsx-flip', style: { '--c': 'var(--ts)' }, onclick: () => out.replaceChildren(res(f(), f() ? 'PASS' : 'FAIL')) }, h('b', '.' + n + '()'), ex, out); }));
    // race: 目視 vs test
    const bM = h('b'), bT = h('b'), tM = h('span', '–'), tT = h('span', '–');
    const race = h('div', { class: 'gap-race' }, h('div', { class: 'rr' }, '目視確認', h('i', bM), tM), h('div', { class: 'rr v' }, 'npm run test', h('i', bT), tT));
    let running = false;
    const go = h('button', { class: 'btn primary', style: { '--c': 'var(--ts)', justifySelf: 'start' }, onclick: async () => {
      if (running) return; running = true; bM.style.width = bT.style.width = '0'; tM.textContent = tT.textContent = '…';
      bM.animate([{ width: '0%' }, { width: '100%' }], { duration: 5000, fill: 'forwards', easing: 'linear' }); const t0 = performance.now(); const iv = setInterval(() => { tM.textContent = ((performance.now() - t0) / 1000).toFixed(1) + 's'; }, 100);
      await bT.animate([{ width: '0%' }, { width: '100%' }], { duration: 250, fill: 'forwards' }).finished; tT.textContent = '0.2s';
      await K.W.sleep(4800); clearInterval(iv); tM.textContent = '5.0s'; running = false; } }, '100ケースを確認してみる ▶');
    el.append(stepper({
      color: 'var(--ts)', start: 0,
      steps: [{ say: '<b>① インストール</b>：プロジェクト内で <code class="i">npm install -D vitest</code>（-D = 開発用）。' }, { say: '<b>② scripts に test を追加</b>：これで <code class="i">npm run test</code> が使える。' }, { say: '<b>③ 関数とテストを書く</b>：isEven が 4 → true、5 → false を確認。' }, { say: '<b>④ 実行！</b> 緑のチェックが出れば合格。変更のたびに一瞬で再確認できる。' }],
      init(vis) { vis.append(host); },
      update(n) { const [f, l, c] = FILES[n]; host.replaceChildren(code(c, l, { file: f, color: n === 3 ? 'var(--ok)' : 'var(--ts)', hi: n === 1 ? [6] : n === 3 ? [3, 4] : null })); },
    }), h('div', { class: 'split', style: { marginTop: '18px' } }, h('div', { class: 'col' }, lbl('マッチャー（クリックで判定）'), mg), h('div', { class: 'col', style: { justifyContent: 'center' } }, lbl('なぜ自動テスト？ 目視 vs テスト'), race, go)));
  }

  /* ================= ts-intro ================= */
  K.reg({
    id: 'ts-intro', track: 'ts', title: 'TypeScript 紹介', sub: 'なぜ型が必要？', emoji: '✨',
    scenes: [
      {
        t: 'そのバグ、どこで見つかる？', lead: '同じミス <code class="i">add("1", 2)</code> を、JS と TS で流してみよう。「次へ ▶」で進むよ。',
        render(el) {
          style('tsx2', `
          .tb-wrap{display:grid;grid-template-columns:1.05fr .95fr;gap:18px;align-items:stretch}
          .tb-code{display:flex;flex-direction:column;gap:10px}
          .tb-tabs{display:flex;gap:6px}.tb-tab{padding:.25em .9em;border-radius:6px;font:800 .8rem var(--mono);background:var(--card);border:1px solid var(--line);color:var(--mute);transition:.3s}
          .tb-tab.on{color:#fff;background:var(--c);border-color:var(--c)}
          .tb-code pre.code{flex:1;margin:0}
          .tsx-sq{text-decoration:underline wavy #ff5470;text-decoration-thickness:1.5px;text-underline-offset:4px}
          .tb-pipe{display:flex;flex-direction:column;gap:8px;justify-content:center}
          .tb-node{display:grid;grid-template-columns:34px 1fr;align-items:center;gap:12px;padding:10px 14px;border-radius:10px;background:var(--card);border:1px solid var(--line);transition:.4s;position:relative}
          .tb-node .ic{width:20px;height:20px;color:var(--mute)}
          .tb-node b{font-size:.95rem;display:block}.tb-node small{color:var(--mute);font-size:.75rem;font-weight:600}
          .tb-node.cur{border-color:var(--ts);background:color-mix(in srgb,var(--ts) 14%,var(--card))}.tb-node.cur .ic{color:var(--ts)}
          .tb-node.pass{border-color:color-mix(in srgb,var(--ok) 55%,var(--line))}.tb-node.pass .ic{color:var(--ok)}
          .tb-node.bad{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 16%,var(--card));animation:shake .4s}.tb-node.bad .ic{color:var(--bad)}
          .tb-node+.tb-node::before{content:"";position:absolute;left:30px;top:-9px;height:9px;width:2px;background:var(--line)}
          .tb-out{margin-top:12px;padding:.7em 1em;border-radius:10px;font:700 .85rem var(--mono);background:var(--code);color:#cfd5ff;display:flex;gap:.6em;align-items:flex-start;min-height:3.4em;transition:.3s}
          .tb-out.e{color:#ff9aa5;border:1px solid var(--bad)}.tb-out.ok{color:#9be58b;border:1px solid var(--ok)}
          @media(max-width:900px){.tb-wrap{grid-template-columns:1fr}}`);
          const L = (t) => hl(t, 'ts');
          const jsCode = [L('function add(a, b) {'), L('  return a + b;'), L('}'), L('add("1", 2);')];
          const tsErr = [L('function add(a: number, b: number) {'), L('  return a + b;'), L('}'), L('add(') + '<span class="tsx-sq">' + L('"1"') + '</span>' + L(', 2);')];
          const tsOk = [L('function add(a: number, b: number) {'), L('  return a + b;'), L('}'), L('add(1, 2);')];
          const NODES = [['pencil-line', '① 書く', 'コードを書いた瞬間'], ['monitor', '② エディタ', '保存・入力中'], ['flask-conical', '③ テスト', 'CI・手動テスト'], ['rocket', '④ 本番', 'ユーザーが使う']];
          const S = [
            { lang: 'JS', code: jsCode, st: ['cur', 'idle', 'idle', 'idle'], out: ['', '足し算の関数に、うっかり文字 "1" を渡してしまった。'],
              say: '足し算の関数 <b>add</b> に、うっかり<b>文字 "1"</b> を渡してしまった。JS はこのコードを書いても何も言わない。' },
            { lang: 'JS', code: jsCode, st: ['pass', 'cur', 'idle', 'idle'], out: ['ok', 'エディタ：赤線なし。JS は黙って通してしまう。'],
              say: '<b>エディタ</b>で確認…赤線は出ない。JS は「文字＋数字」でもエラーにしない。' },
            { lang: 'JS', code: jsCode, st: ['pass', 'pass', 'pass', 'bad'], out: ['e', '本番で add("1", 2) → "12"  （3 ではなく文字がくっついた）'],
              say: 'テストも通過 → <b>本番でユーザーが踏む</b>。結果は 3 ではなく "12"。請求額が壊れた！' },
            { lang: 'TS', code: tsErr, st: ['pass', 'bad', 'idle', 'idle'], out: ['e', "L4: 型 'string' を 'number' に渡せません (Argument of type 'string' is not assignable to parameter of type 'number')"],
              say: '同じミスを <b>TypeScript</b> で。引数に <b>型（: number）</b>を書いておくと、<b>書いた瞬間に赤線</b>で教えてくれる！' },
            { lang: 'TS', code: tsOk, st: ['pass', 'pass', 'pass', 'pass'], out: ['ok', '修正して add(1, 2) → 3。本番は平和。'],
              say: 'その場で <b>1</b> に直す。バグは<b>ユーザーに届く前</b>に消えた。これが「型」の一番の価値。' },
          ];
          const nodes = NODES.map(([ic, t, sm]) => h('div', { class: 'tb-node' }, icon(ic), h('div', h('b', t), h('small', sm))));
          const tabs = ['JS', 'TS'].map((t) => h('span', { class: 'tb-tab' }, t === 'JS' ? 'JavaScript' : 'TypeScript'));
          const pre = h('pre', { class: 'code', 'data-file': 'add.ts' });
          const out = h('div', { class: 'tb-out' });
          el.append(stepper({
            color: 'var(--ts)', interval: 2600, steps: S.map((x) => ({ say: x.say })),
            init(vis) { vis.append(h('div', { class: 'tb-wrap' }, h('div', { class: 'tb-code' }, h('div', { class: 'tb-tabs' }, tabs), pre, out), h('div', { class: 'tb-pipe' }, nodes))); },
            update(n) {
              const x = S[n];
              tabs.forEach((t, i) => { t.classList.toggle('on', (i === 0) === (x.lang === 'JS')); t.style.setProperty('--c', i === 0 ? 'var(--team)' : 'var(--ts)'); });
              pre.setAttribute('data-file', x.lang === 'JS' ? 'add.js' : 'add.ts');
              pre.replaceChildren(...x.code.map((l, i) => h('span', { class: 'ln' + (i === 3 ? ' on' : ''), html: l || '&nbsp;' })));
              nodes.forEach((nd, i) => { nd.className = 'tb-node ' + x.st[i]; });
              out.className = 'tb-out ' + x.out[0]; out.replaceChildren(icon(x.out[0] === 'e' ? 'circle-alert' : x.out[0] === 'ok' ? 'circle-check' : 'info'), x.out[1]);
            },
          }));
        },
      },
      {
        t: 'TS は JS に変換される', tag: 'tsc', lead: 'ブラウザが読めるのは JS だけ。TS は<b>「型をチェックして、型を消して JS にする」</b>道具です。',
        render(el) {
          const ts = code('function greet(name: string): string {\n  return "Hello " + name;\n}\ngreet("TS");', 'ts', { file: 'main.ts', color: 'var(--ts)' });
          const jsC = code('function greet(name) {\n  return "Hello " + name;\n}\ngreet("TS");', 'js', { file: 'main.js', color: 'var(--team)' });
          const gear = h('div', { class: 'tsx-gear' }, h('b', '⚙️'), 'tsc', h('div', { style: { fontSize: '.75rem', color: 'var(--mute)' } }, '型チェック'));
          const a1 = h('div', { class: 'tsx-arrow' }, '➜'), a2 = h('div', { class: 'tsx-arrow' }, '➜');
          const jsBox = h('div', null, jsC), br = h('div', { class: 'tsx-res ok', style: { marginTop: '10px' } }, '🌐 ブラウザで実行できる！');
          br.style.visibility = 'hidden';
          el.append(stepper({
            color: 'var(--ts)',
            steps: [{ say: '私たちが書くのは <b>.ts</b> ファイル。' }, { say: '<b>: string</b> が「型アノテーション」。JS には無い部分。' }, { say: '<b>tsc</b> が型をチェック。間違いがあれば、エラーで教えてくれる。' }, { say: '型が消えて普通の <b>.js</b> に。実行時は型は存在しない！' }],
            init(vis) { vis.append(h('div', { class: 'tsx-pipe' }, ts, a1, gear, a2, h('div', null, jsBox, br))); },
            update(n) {
              ts.setHi(n === 1 ? [1] : []); ts.classList.toggle('dim', n === 1);
              gear.classList.toggle('on', n === 2); a1.classList.toggle('on', n >= 2); a2.classList.toggle('on', n >= 3);
              jsBox.className = n >= 3 ? '' : 'tsx-ghost'; br.style.visibility = n >= 3 ? 'visible' : 'hidden';
            },
          }));
        },
      },
      {
        t: '実践：赤線を消そう', tag: 'PRACTICE', lead: 'ミッションは3つ。赤線の上にカーソルを乗せて、エラー文を読んでから直そう。',
        render(el) {
          el.append(tsPractice("function add(a: number, b: number): number {\n  return a + b;\n}\n\n// ここを直す：赤線が出ているよ\nconsole.log(add(\"1\", 2));\n", (v, c, ed) => [
            { label: '赤線（型エラー）をなくす', ok: ed && c.errors.length === 0 },
            { label: 'add に数字を渡す（"1" ではなく 1 に）', ok: ed && /add\(\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*\)/.test(nc(v)) },
            { label: '実行して 3 が出る', ok: ed && ranOk(c, (t) => t.some((x) => x.trim() === '3')) },
            { optional: true, label: '任意：文字の "1" も受け取れる addLoose(a, b) を作って、addLoose("1", 2) で 3 を出す', ok: ed && /(number\s*\|\s*string|string\s*\|\s*number)/.test(nc(v)) && /addLoose\s*\(/.test(nc(v)) && ranOk(c, (t) => t.filter((x) => x.trim() === '3').length >= 2) },
          ], "function add(a: number, b: number): number {\n  return a + b;\n}\n\nconsole.log(add(1, 2));\n\n// 任意チャレンジ\nfunction toNum(x: number | string): number {\n  return typeof x === \"string\" ? parseInt(x) : x;\n}\nfunction addLoose(a: number | string, b: number | string): number {\n  return toNum(a) + toNum(b);\n}\nconsole.log(addLoose(\"1\", 2)); // 3\n", 'TypeScript', [{"hint": ["赤線にカーソルを乗せて、エラー文を読もう。「string を number に渡せない」と言っているよ。", "add に渡している \"1\" は文字。数字にするには？"], "fix": [["add(\"1\", 2)", "add(1, 2)"]]}, {"hint": ["\"1\" と 1 の違いは「引用符（\"）」があるかどうか。", "\"1\" の引用符を外して 1 にしよう。"], "fix": [["add(\"1\", 2)", "add(1, 2)"]]}, {"hint": ["直したら右上の「▶ 実行」を押そう。", "1 + 2 の答えは 3。console に 3 と出れば OK。"], "fix": [["add(\"1\", 2)", "add(1, 2)"]]}, {"hint": ["引数の型を「文字か数字」にするには？（Union 型）", "function addLoose(a: number | string, b: number | string): number { … }。中では typeof x === \"string\" ? parseInt(x) : x のように、文字を数字に直してから足そう。"], "fix": "function add(a: number, b: number): number {\n  return a + b;\n}\n\n// ここを直す：赤線が出ているよ\nconsole.log(add(1, 2));\n\n// 任意チャレンジ\nfunction toNum(x: number | string): number {\n  return typeof x === \"string\" ? parseInt(x) : x;\n}\nfunction addLoose(a: number | string, b: number | string): number {\n  return toNum(a) + toNum(b);\n}\nconsole.log(addLoose(\"1\", 2)); // 3\n"}]));
        },
      },
    ],
  });

  /* ================= ts-basic ================= */
  K.reg({
    id: 'ts-basic', track: 'ts', title: '基礎文法・データ型', sub: '型の指定の方法', emoji: '📘',
    scenes: [
      {
        t: '型アノテーションの読み方', lead: '<code class="i">let age: number = 20;</code> を分解。「次へ」で順番に光ります。',
        render(el) {
          const parts = [['let ', 0], ['age', 1], [': number', 2], [' = ', 3], ['20', 4], [';', 5]];
          const line = h('div', { class: 'tsx-line' }, parts.map(([s]) => h('span', { class: 'tk' }, s)));
          const typeTag = h('span', { class: 'ty' }, 'number'), val = h('div', { class: 'val' }), err = h('div', { class: 'tsx-res ng', style: { visibility: 'hidden' } }, "✖ Type 'string' is not assignable to type 'number'.");
          const box = h('div', { class: 'tsx-box t-number' }, h('span', { class: 'nm' }, 'age'), typeTag, val);
          const line2 = h('div', { class: 'tsx3-attempt', style: { display: 'none' } }, h('span', null, 'age = ', h('span', { class: 'tsx3-sq' }, '"twenty"'), ';'), h('span', { class: 'bk' }, '↩ 弾かれた（age は 20 のまま）'));
          const hi = [[0], [1], [2], [3, 4], [1, 2, 4]];
          const colors = ['var(--basic)', 'var(--pink)', 'var(--ts)', 'var(--team)', 'var(--vue)'];
          el.append(stepper({
            color: 'var(--ts)',
            steps: [
              { say: '<b>let</b>：「箱を作るよ」の合図。' }, { say: '<b>age</b>：箱の名前（変数名）。' }, { say: '<b>: number</b>：コロンの後ろが<b>型</b>。「数値しか入らない箱」にする。' },
              { say: '<b>= 20</b>：中身を入れる。number なので ✓。' }, { say: '❌ あとで <b>age = "twenty"</b> と書いてみると… number の箱に string は入らない → <b>赤線で弾かれる</b>（値は 20 のまま）。' },
            ],
            init(vis) { vis.append(h('div', { class: 'col' }, line, h('div', { style: { display: 'grid', placeItems: 'center', gap: '10px' } }, box, line2, err))); },
            update(n, s, vis) {
              line.querySelectorAll('.tk').forEach((t, i) => { const on = hi[n].includes(i); t.classList.toggle('lit', on); t.style.setProperty('--pc', colors[n]); });
              box.style.opacity = n >= 1 ? 1 : .3; typeTag.style.opacity = n >= 2 ? 1 : 0;
              box.className = 'tsx-box t-number' + (n === 4 ? ' no' : n === 3 ? ' good' : '');
              val.textContent = n >= 3 ? '20' : '';
              err.style.visibility = n === 4 ? 'visible' : 'hidden';
              line2.style.display = n === 4 ? 'flex' : 'none'; if (n === 4) { line2.classList.remove('tsx-fall'); void line2.offsetWidth; line2.classList.add('tsx-fall'); }
            },
          }));
        },
      },
      {
        t: '型の箱に値を入れよう', tag: 'GAME', lead: '値を<b>ドラッグ</b>（またはクリック→箱をクリック）して、合う型の箱に入れよう。間違えると弾かれます。',
        render(el) {
          const vals = [['42', 'number'], ['"こんにちは"', 'string'], ['true', 'boolean'], ['3.14', 'number'], ['"42"', 'string'], ['false', 'boolean']];
          const msg = h('div', { style: { minHeight: '2.2em' } });
          let sel = null, placed = 0;
          const pool = h('div', { class: 'row' });
          const boxes = ['number', 'string', 'boolean'].map((t) => {
            const items = h('div', { class: 'row', style: { justifyContent: 'center' } });
            const b = h('div', { class: 'tsx-box t-' + t, style: { minHeight: '140px', alignContent: 'start' } }, h('span', { class: 'nm' }, 'x'), h('span', { class: 'ty' }, ': ' + t), items);
            const tryIn = (idx) => {
              const [lit, ty] = vals[idx]; const chip = chips[idx];
              if (!chip || chip.dataset.done) return;
              if (ty === t) {
                chip.dataset.done = 1; chip.remove(); items.append(h('span', { class: 'tsx-chip in', style: { '--bc': `var(--${{ number: 'ts', string: 'basic', boolean: 'team' }[t]})` } }, lit));
                b.classList.add('good'); msg.replaceChildren(res(true, `${lit} は ${t} だから OK`)); sel = null; placed++;
                if (placed === vals.length) { celebrate(); msg.replaceChildren(res(true, '全部入った！型の違いがバッチリ 🎉')); }
              } else {
                b.classList.remove('no'); void b.offsetWidth; b.classList.add('no');
                msg.replaceChildren(res(false, `Type '${ty}' is not assignable to type '${t}'.`));
              }
            };
            b.addEventListener('dragover', (e) => { e.preventDefault(); b.classList.add('over'); });
            b.addEventListener('dragleave', () => b.classList.remove('over'));
            b.addEventListener('drop', (e) => { e.preventDefault(); b.classList.remove('over'); tryIn(+e.dataTransfer.getData('text/plain')); });
            b.addEventListener('click', () => { if (sel != null) { tryIn(sel); chips.forEach((c) => c.classList.remove('sel')); sel = null; } });
            return b;
          });
          const chips = vals.map(([lit], i) => {
            const c = h('span', { class: 'tsx-chip', draggable: 'true' }, lit);
            c.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', i));
            c.addEventListener('click', (e) => { e.stopPropagation(); chips.forEach((x) => x.classList.remove('sel')); sel = i; c.classList.add('sel'); });
            return c;
          });
          pool.append(...chips);
          el.append(lbl('値'), pool, h('div', { class: 'split', style: { gridTemplateColumns: 'repeat(3,1fr)', margin: '14px 0' } }, boxes), msg);
        },
      },
      {
        t: 'const / let と型推論', lead: 'const と let、なぜ2つあるの？ まず<b>事故</b>を起こして体験。そのあと、どっちを使うか自分で選ぼう。',
        render(el) {
          const tabs = [['① 税率が消えた事件', 'うっかり上書き → const で守る'], ['② カウンタが動かない', '本当に変わる値 → let'], ['③ 推論も違う', 'const は 10、let は number']];
          const bar = h('div', { class: 'tsx3-tabs' });
          const body = h('div');
          const run = (cardOut, ok, msg, lines, errLine, extra) => (pre) => {
            pre.setHi([]); pre.setHi([], 'err');
            if (lines) pre.setHi(lines, 'on'); if (errLine) pre.setHi([errLine], 'err');
            cardOut.className = 'tsx3-out ' + (ok ? 'ok' : 'e'); cardOut.textContent = msg;
          };
          function col(kind, src, tail) {
            const pre = code(src, 'ts', { file: kind + '.ts', dim: true });
            const out = h('div', { class: 'tsx3-out' }, '▶ 実行を押してみよう');
            const meter = h('div', { class: 'tsx3-meter' });
            const c = h('div', { class: 'tsx3-col k-' + kind }, h('h4', icon(kind === 'const' ? 'lock' : 'pencil'), kind), pre, meter, out);
            c.pre = pre; c.out = out; c.meter = meter; c.tail = tail;
            return c;
          }
          const views = [
            () => {
              const L = (k) => `${k} tax = 0.1;\nfunction total(price: number) {\n  return price * (1 + tax);\n}\n// …（300行あと）…\ntax = 0;   // ← うっかり！\nconsole.log(total(1000));`;
              const cl = col('let', L('let')), cc = col('const', L('const'));
              cl.meter.append('犯人候補：', h('b', { class: 'bad' }, '?? 行'));
              cc.meter.append('犯人候補：', h('b', { class: 'good' }, '宣言の 1 行だけ'));
              const runBtn = (c, fn) => h('button', { class: 'btn primary', onclick: fn }, icon('play'), '実行');
              cl.append(runBtn(cl, () => {
                cl.pre.setHi([1, 3, 6], 'on'); cl.pre.setHi([], 'err');
                cl.out.className = 'tsx3-out e'; cl.out.textContent = '1000   ← 期待は 1100。税が消えて、エラーも出ないまま動いた…';
                cl.meter.replaceChildren('犯人候補：', h('b', { class: 'bad' }, 'tax を触る全部（1・3・6 行…）'), '→ 300 行を探す羽目に');
              }));
              cc.append(runBtn(cc, () => {
                cc.pre.setHi([1], 'on'); cc.pre.setHi([6], 'err');
                cc.out.className = 'tsx3-out ok'; cc.out.textContent = "L6: Cannot assign to 'tax' because it is a constant.\n→ 書いた瞬間に止まった。事故ゼロ！";
                cc.meter.replaceChildren('犯人候補：', h('b', { class: 'good' }, '0 行（エディタが教えてくれた）'));
              }));
              return h('div', null, h('div', { class: 'tsx3-duo' }, cl, cc),
                h('div', { class: 'tsx3-rule' }, icon('lightbulb'), h('span', { html: '<b>変わらない値は const</b>。「触れない」を機械に保証させると、バグの犯人探しが要らなくなる。' })));
            },
            () => {
              const L = (k) => `${k} count = 0;\n\n// ボタンが押された\ncount++;\nconsole.log(count);`;
              const cc = col('const', L('const')), cl = col('let', L('let'));
              cc.meter.append('この値は…', h('b', { class: 'bad' }, '変わるもの'));
              let n = 0; const disp = h('b', { class: 'good' }, '0');
              cl.meter.append('この値は…', h('b', { class: 'good' }, '変わるもの'), ' count = ', disp);
              cc.append(h('button', { class: 'btn primary', onclick: () => { cc.pre.setHi([4], 'err'); cc.out.className = 'tsx3-out e'; cc.out.textContent = "L4: Cannot assign to 'count' because it is a constant.\n→ 変わる値に const は不向き。let にしよう"; } }, icon('play'), '実行'));
              cl.append(h('button', { class: 'btn primary', onclick: () => { n++; disp.textContent = n; cl.pre.setHi([4, 5], 'on'); cl.out.className = 'tsx3-out ok'; cl.out.textContent = 'count = ' + n + '   ← 何回押しても更新できる'; } }, icon('mouse-pointer-click'), 'ボタンを押す（count++）'));
              return h('div', null, h('div', { class: 'tsx3-duo' }, cc, cl),
                h('div', { class: 'tsx3-rule' }, icon('lightbulb'), h('span', { html: '<b>カウンタ・合計・ループ変数のように「変わる」のが仕事の値だけ let</b>。let は「書き換えてよい」の宣言。' })));
            },
            () => {
              const S = [
                ['let a = 10;\na = 20;', true, 'a は number と推論。let なので再代入 OK', 'a: number'],
                ['const b = 10;\nb = 20;', false, "Cannot assign to 'b' because it is a constant.", 'b: 10（リテラル型）'],
                ['let c = 10;\nc = "ten";', false, "Type 'string' is not assignable to type 'number'.", 'c: number（推論）'],
                ['let d: number | string = 10;\nd = "ten";', true, 'Union 型なので OK', 'd: number | string'],
              ];
              const grid = h('div', { class: 'split' });
              S.forEach(([src, ok, m, inf]) => {
                const out = h('div', { style: { minHeight: '2.4em' } });
                grid.append(h('div', { class: 'tsx-card' }, code(src, 'ts'), h('div', { class: 'row' }, h('span', { class: 'chip' }, '推論 ' + inf), h('button', { class: 'btn', onclick: () => out.replaceChildren(res(ok, m)) }, icon('play'), '試す')), out));
              });
              return h('div', null, grid, h('div', { class: 'tsx3-rule' }, icon('lightbulb'), h('span', { html: '型を書かなくても、<b>初期値から型が決まる</b>（推論）。const は値そのもの（10）、let は「その種類」（number）として扱われる。' })));
            },
          ];
          function show(i) { bar.querySelectorAll('.tsx3-tab').forEach((t, k) => t.classList.toggle('on', k === i)); body.replaceChildren(views[i]()); }
          tabs.forEach(([t, sm], i) => bar.append(h('button', { class: 'tsx3-tab', onclick: () => show(i) }, t, h('small', sm))));
          el.append(bar, body);
          show(0);
          // ---- which would you pick?
          const Q = [
            ['消費税率 0.1（ずっと同じ）', 'const', '変えない値 → const で守る'],
            ['ループの番号 i（1回ごとに増える）', 'let', '回るたびに変わる → let'],
            ['読み込んだユーザー名（表示するだけ）', 'const', '再代入しない → const'],
            ['買い物の合計金額（商品を足していく）', 'let', '足して更新する → let'],
          ];
          let okN = 0; const score = h('span', { class: 'chip' }, '0 / ' + Q.length);
          const qbox = h('div', { class: 'tsx3-q' }, Q.map(([t, ans, why]) => {
            const row = h('div', { class: 'tsx3-qr' }, h('span', t), h('div', { class: 'tsx3-qb' }, ['const', 'let'].map((k) => h('button', { onclick: (e) => {
              if (row.classList.contains('ok')) return;
              if (k === ans) { e.currentTarget.classList.add('ok'); row.classList.add('ok'); okN++; score.textContent = okN + ' / ' + Q.length; if (okN === Q.length) celebrate(); }
              else { e.currentTarget.classList.remove('bad'); void e.currentTarget.offsetWidth; e.currentTarget.classList.add('bad'); }
            } }, k))), h('small', '✓ ' + why));
            return row;
          }));
          el.append(h('div', { style: { marginTop: '22px' } }, lbl('どっち？ 自分で選んでみよう'), h('div', { class: 'row', style: { marginBottom: '8px' } }, score, h('span', { style: { color: 'var(--mute)', fontSize: '.85rem', fontWeight: 700 } }, '迷ったら <まず const>。エラーが出たら let に変える。'.replace(/[<>]/g, ''))), qbox));
        },
      },
      {
        t: '型推論：どこまで書く？', tag: 'inference', lead: '型は「全部に書く」のも「全部省く」のもダメ。<b>点線の枠をクリック</b>して、書くべき場所を見つけよう。',
        render(el) {
          const SL = { a: ['a', ': number', 'param'], b: ['b', ': number', 'param'], ret: ['ret', ': number', 'ret'], sum: ['sum', ': number', 'local'], label: ['label', ': string', 'local'] };
          const st = { a: false, b: false, ret: false, sum: false, label: false };
          const out = h('div', { class: 'tsx3-out' });
          const meter = h('div', { class: 'tsx3-meter' });
          const slot = (k) => { const e = h('span', { class: 'tsx3-sl', 'data-k': k, onclick: () => { st[k] = !st[k]; paint(); } }, SL[k][1]); return e; };
          const sl = {}; Object.keys(SL).forEach((k) => (sl[k] = slot(k)));
          const pre = h('div', { class: 'tsx3-code' },
            'function add(a', sl.a, ', b', sl.b, ')', sl.ret, ' {\n  const sum', sl.sum, ' = a + b;\n  const label', sl.label, ' = "合計";\n  return sum;\n}');
          function paint() {
            let errs = 0, noise = 0;
            Object.entries(sl).forEach(([k, e]) => {
              e.className = 'tsx3-sl';
              if (SL[k][2] === 'param') { if (st[k]) e.classList.add('on'); else { e.classList.add('err'); errs++; } e.textContent = st[k] ? SL[k][1] : '← 書く場所'; }
              else if (SL[k][2] === 'ret') { if (st[k]) e.classList.add('on'); e.textContent = st[k] ? SL[k][1] : ''; if (!st[k]) e.textContent = ': ?'; }
              else { if (st[k]) { e.classList.add('noise'); noise++; } e.textContent = st[k] ? SL[k][1] : ''; if (!st[k]) e.textContent = ': ?'; }
            });
            meter.replaceChildren('エラー', h('b', { class: errs ? 'bad' : 'good' }, errs + ' 件'), 'ノイズ（不要な型）', h('b', { class: noise ? 'bad' : 'good' }, noise + ' 個'));
            const ok = !errs && !noise && st.ret;
            if (errs) { out.className = 'tsx3-out e'; out.textContent = "Parameter '" + (!st.a ? 'a' : 'b') + "' implicitly has an 'any' type.\n→ 引数は呼び出し側から来る値。ここは推論できないので、書く。"; }
            else if (noise) { out.className = 'tsx3-out'; out.textContent = '動くけど…sum / label は右辺(a + b, "合計")から型が分かる。書くとノイズ。'; }
            else if (!st.ret) { out.className = 'tsx3-out'; out.textContent = '引数は OK。戻り値の型も書くと「この関数は number を返す」という約束になる（任意だがおすすめ）。'; }
            else { out.className = 'tsx3-out ok'; out.textContent = '✓ 引数・戻り値（境界）には書く／中の変数は推論に任せる。これが基本ルール！'; if (!paint.done) { paint.done = 1; celebrate(); } }
          }
          el.append(h('div', { class: 'split wide-l' }, h('div', { class: 'col' }, lbl('クリックで型を書く / 消す'), pre, out), h('div', { class: 'col' }, lbl('チェック'), meter,
            h('div', { class: 'tsx3-card2' }, h('ul', { style: { paddingLeft: '1.2em', display: 'grid', gap: '.5em', fontWeight: 700, fontSize: '.9rem' } },
              h('li', { html: '<b>引数</b>：外から来る → 必ず書く' }), h('li', { html: '<b>戻り値</b>：関数の約束 → 書くのがおすすめ' }), h('li', { html: '<b>中の変数</b>：右辺で分かる → 書かない' }))))));
          paint();
        },
      },
      {
        t: '配列・タプル・オブジェクト', lead: 'データのまとまりも型で守れる。ボタンで<b>入れてみて</b>、通る/通らないを確認しよう。',
        render(el) {
          const body = h('div');
          const tabs = ['配列', 'タプル', 'Object'];
          const seg = h('div', { class: 'tsx-seg', style: { '--c': 'var(--ts)' } }, tabs.map((t, i) => h('button', { onclick: () => show(i) }, t)));
          const views = [
            () => {
              const items = ['田中', 'Join'], row = h('div', { class: 'tsx-slots' }), out = h('div');
              const draw = () => row.replaceChildren(...items.map((x) => h('div', { class: 'tsx-slot f', style: { '--bc': 'var(--basic)' } }, h('small', 'string'), '"' + x + '"')), h('div', { class: 'tsx-slot' }, '＋'));
              draw();
              return h('div', { class: 'split' }, h('div', { class: 'col' }, code('let names: string[] = ["田中", "Join"];', 'ts'), row, h('div', { class: 'row' },
                h('button', { class: 'btn', onclick: () => { items.push('佐藤'); draw(); out.replaceChildren(res(true, 'names.push("佐藤")')); } }, 'push("佐藤")'),
                h('button', { class: 'btn', onclick: () => out.replaceChildren(res(false, "Argument of type 'number' is not assignable to parameter of type 'string'.")) }, 'push(3)')), out),
                h('div', { class: 'card' }, h('b', '配列 = 同じ型が並ぶ'), h('p', { style: { color: 'var(--mute)' } }, 'string[] は「文字列だけの行列」。長さは自由。')));
            },
            () => {
              const types = ['number', 'boolean', 'string'], slots = types.map((t) => h('div', { class: 'tsx-slot' }, h('small', t), '?')), out = h('div');
              const fill = (vals, ok) => { slots.forEach((s, i) => { s.className = 'tsx-slot ' + (ok ? 'f' : (typeof vals[i] === types[i] ? 'f' : 'x')); s.style.setProperty('--bc', 'var(--ts)'); s.replaceChildren(h('small', types[i]), JSON.stringify(vals[i])); }); out.replaceChildren(ok ? res(true, '順番も型もピッタリ') : res(false, "Type 'string' is not assignable to type 'number'. （順番がズレてる）")); };
              return h('div', { class: 'split' }, h('div', { class: 'col' }, code('type Item = [number, boolean, string];\nlet item: Item = ...', 'ts'), h('div', { class: 'tsx-slots' }, slots), h('div', { class: 'row' },
                h('button', { class: 'btn', onclick: () => fill([2, true, '三歳'], true) }, '[2, true, "三歳"]'), h('button', { class: 'btn', onclick: () => fill(['三歳', 2, true], false) }, '["三歳", 2, true]')), out),
                h('div', { class: 'card' }, h('b', 'タプル = 位置ごとに型が決まる'), h('p', { style: { color: 'var(--mute)' } }, '座標 [x, y] や [id, 名前] のような「固定の組」に向いてる。')));
            },
            () => {
              const o = { name: '"Honda"', price: '1000' }, box = h('div', { class: 'tsx-obj' }), out = h('div');
              const draw = () => box.replaceChildren(h('div', '{'), ...Object.entries(o).map(([k, v]) => h('div', { style: { paddingLeft: '1.2em' } }, k + ': ', h('span', { class: 'num' }, v))), h('div', '}'));
              draw();
              return h('div', { class: 'split' }, h('div', { class: 'col' }, code('interface Car {\n  name: string;\n  price: number;\n}', 'ts'), box, h('div', { class: 'row' },
                h('button', { class: 'btn', onclick: () => { o.price = '2000'; draw(); out.replaceChildren(res(true, 'myCar.price = 2000')); } }, 'price = 2000'),
                h('button', { class: 'btn', onclick: () => out.replaceChildren(res(false, "Type 'string' is not assignable to type 'number'.")) }, 'price = "高い"'),
                h('button', { class: 'btn', onclick: () => out.replaceChildren(res(false, "Property 'color' does not exist on type 'Car'.")) }, 'myCar.color = "red"')), out),
                h('div', { class: 'card' }, h('b', 'Object = 形（interface）で守る'), h('p', { style: { color: 'var(--mute)' } }, '決めた形から外れたら、すぐ赤線。')));
            },
          ];
          function show(i) { seg.querySelectorAll('button').forEach((b, k) => b.classList.toggle('on', k === i)); body.replaceChildren(views[i]()); }
          el.append(seg, body); show(0);
        },
      },
      { t: 'any と unknown', tag: 'any', lead: '同じ値・同じ操作で <b>any</b> と <b>unknown</b> を比べよう。値を変えて、操作ボタンを押してみて。', render: anyScene },
      { t: '値がない型：void / undefined / null', tag: 'void', lead: '「値がない」にも3種類。<b>実行</b>ボタンで違いを見て、null はスイッチで分岐を確かめよう。', render: voidNullScene },
      {
        t: '実践：型エラーを全部直そう', tag: 'PRACTICE', lead: 'ミッションは3つ（1行ずつ直すだけ）。「値を直す」でも「型を広げる」でも OK。',
        render(el) {
          el.append(tsPractice("let count: number = \"5\";                    // ① ここを直す\nconst names: string[] = [\"田中\", 3];       // ② ここを直す\nconst point: [number, number] = [10, \"20\"]; // ③ ここを直す\n\nconsole.log(count, names, point);\n", (v, c, ed) => [
            { label: '① count の赤線を消す', ok: ed && !/\bany\b/.test(nc(v)) && lineOk(v['main.ts'], /^\s*let\s+count\b/, c.errors) },
            { label: '② names の赤線を消す', ok: ed && !/\bany\b/.test(nc(v)) && lineOk(v['main.ts'], /^\s*const\s+names\b/, c.errors) },
            { label: '③ point の赤線を消す', ok: ed && !/\bany\b/.test(nc(v)) && lineOk(v['main.ts'], /^\s*const\s+point\b/, c.errors) },
            { optional: true, label: '任意：文字と数字が混ざった配列 mixed を (string | number)[] で作って console.log する', ok: ed && /\(\s*(string\s*\|\s*number|number\s*\|\s*string)\s*\)\s*\[\s*\]|Array\s*<\s*(string\s*\|\s*number|number\s*\|\s*string)\s*>/.test(nc(v)) && /\bmixed\b/.test(nc(v)) && ranOk(c, (t) => t.length >= 2) },
          ], "let count: number = 5;\nconst names: string[] = [\"田中\", \"佐藤\"];\nconst point: [number, number] = [10, 20];\n\nconsole.log(count, names, point);\n\n// 任意チャレンジ\nconst mixed: (string | number)[] = [\"田中\", 20, \"佐藤\", 30];\nconsole.log(mixed);\n", 'TypeScript', [{"hint": ["count は number（数字）の箱。いま入っているのは \"5\"（文字）。", "引用符を外して 5 にしよう。"], "fix": [["= \"5\";", "= 5;"]]}, {"hint": ["names は string[]（文字の配列）。3 は数字だね。", "3 を \"佐藤\" のような文字にしよう。"], "fix": [["[\"田中\", 3]", "[\"田中\", \"佐藤\"]"]]}, {"hint": ["point は [number, number]。2つ目が \"20\"（文字）になっている。", "\"20\" の引用符を外して 20 に。"], "fix": [["[10, \"20\"]", "[10, 20]"]]}, {"hint": ["「文字か数字」の配列の型は？ かっこと [] を組み合わせるよ。", "const mixed: (string | number)[] = [\"田中\", 20]; console.log(mixed);"], "fix": "let count: number = 5;\nconst names: string[] = [\"田中\", \"佐藤\"];\nconst point: [number, number] = [10, 20];\n\nconsole.log(count, names, point);\n\n// 任意チャレンジ\nconst mixed: (string | number)[] = [\"田中\", 20, \"佐藤\", 30];\nconsole.log(mixed);\n"}]));
        },
      },
    ],
  });

  /* ================= ts-types ================= */
  K.reg({
    id: 'ts-types', track: 'ts', title: 'Type・Union・Interface', sub: '型の構文', emoji: '🔀',
    scenes: [
      {
        t: 'Union：どれか1つ', tag: 'A | B', lead: '値を選んで<b>流して</b>みよう。<code class="i">typeof</code> で分岐すると、枝の中で型が<b>絞り込まれる</b>よ。',
        render(el) {
          const n1 = h('div', { class: 'tsx-node' }, 'id: number | string'), n2 = h('div', { class: 'tsx-node' }, 'typeof id === "string" ?');
          const nS = h('div', { class: 'tsx-node' }, h('div', 'Yes → id: string'), h('div', 'id.toUpperCase()')), nN = h('div', { class: 'tsx-node' }, h('div', 'No → id: number'), h('div', 'id.toFixed(1)'));
          const out = h('div', { style: { minHeight: '2.4em' } });
          const flow = h('div', { class: 'tsx-flow' }, n1, n2, h('div', { class: 'col' }, nS, nN));
          flow.style.setProperty('--c', 'var(--ts)');
          let busy = false;
          const run = async (v) => {
            if (busy) return; busy = true;
            [n1, n2, nS, nN].forEach((n) => n.classList.remove('lit')); out.replaceChildren();
            n1.firstChild && (n1.textContent = 'id = ' + JSON.stringify(v)); n1.classList.add('lit'); await sleep(650);
            n2.classList.add('lit'); await sleep(750);
            const isS = typeof v === 'string'; (isS ? nS : nN).classList.add('lit');
            out.replaceChildren(res(true, isS ? v.toUpperCase() : v.toFixed(1)));
            await sleep(300); busy = false;
          };
          el.append(
            h('div', { class: 'card', style: { marginBottom: '14px' } }, code('type Id = number | string;\nfunction show(id: Id) {\n  if (typeof id === "string") {\n    return id.toUpperCase();\n  }\n  return id.toFixed(1);\n}', 'ts')),
            h('div', { class: 'row', style: { marginBottom: '12px' } }, h('button', { class: 'btn primary', onclick: () => run(42) }, 'show(42)'), h('button', { class: 'btn primary', onclick: () => run('abc') }, 'show("abc")')),
            flow, out);
          // type alias mini demo
          const alias = ['number | string', 'number | string | boolean'];
          let ai = 0;
          const aLine = h('div', { class: 'tsx-line', style: { fontSize: '1rem' } });
          const draw = () => { aLine.innerHTML = K.W.hl('type Age = ' + alias[ai] + ';', 'ts'); };
          draw();
          el.append(h('div', { class: 'card', style: { marginTop: '18px' } }, lbl('Type 別名：1か所直せば全部に反映'), aLine,
            h('div', { class: 'row', style: { marginTop: '10px' } }, ['myAge: Age', 'momAge: Age', 'userAge: Age'].map((t) => h('span', { class: 'chip' }, t)), h('button', { class: 'btn', onclick: () => { ai = 1 - ai; draw(); aLine.animate([{ transform: 'scale(1.05)' }, { transform: 'none' }], { duration: 300 }); } }, '🔁 Age を変更'))));
        },
      },
      {
        t: 'Enum：名前の付いた定数', lead: '<code class="i">move(3)</code> の 3 って何？ → <b>名前を付ける</b>とバグらない。十字キーを押してみて。',
        render(el) {
          const E = { Up: [1, 0, -1, '▲'], Down: [2, 0, 1, '▼'], Left: [3, -1, 0, '◀'], Right: [4, 1, 0, '▶'] };
          let x = 2, y = 2;
          const bot = h('div', { class: 'tsx-bot' }, '🤖'), grid = h('div', { class: 'tsx-grid' }, Array.from({ length: 25 }, () => h('i')), bot);
          const place = () => { bot.style.left = `calc(${x * 20}% + 6px + ${x * 0}px)`; bot.style.top = `calc(${y * 20}% + 6px)`; };
          const log = h('div', { class: 'tsx-line', style: { fontSize: '1rem', justifyContent: 'flex-start', minHeight: '3.6em' } });
          const go = (name) => { const [v, dx, dy] = E[name]; x = K.W.clamp(x + dx, 0, 4); y = K.W.clamp(y + dy, 0, 4); place(); log.innerHTML = K.W.hl(`move(Direction.${name});  // ${v}`, 'ts'); };
          const dp = h('div', { class: 'tsx-dpad', style: { '--c': 'var(--ts)' } }, h('i'), h('button', { onclick: () => go('Up') }, '▲'), h('i'), h('button', { onclick: () => go('Left') }, '◀'), h('i'), h('button', { onclick: () => go('Right') }, '▶'), h('i'), h('button', { onclick: () => go('Down') }, '▼'), h('i'));
          place();
          el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, code('enum Direction {\n  Up = 1,\n  Down = 2,\n  Left = 3,\n  Right = 4,\n}\n\nmove(Direction.Left);', 'ts'),
            h('div', { class: 'split' }, h('div', { class: 'tsx-res ng' }, 'move(3) // ？？？'), h('div', { class: 'tsx-res ok' }, 'move(Direction.Left) // 一目瞭然'))),
            h('div', { class: 'col', style: { justifyItems: 'center' } }, grid, dp)), log);
          el.querySelector('.tsx-line').innerHTML = K.W.hl('// 十字キーを押してね', 'ts');
        },
      },
      {
        t: 'interface：形チェッカー', tag: 'interface', lead: 'オブジェクトのプロパティを<b>ON/OFF</b>して、<code class="i">Car</code> の形を満たすか見てみよう。<code class="i">?</code> は省略OK。',
        render(el) {
          const st = { name: true, color: true, price: false, priceStr: false, extra: false };
          const obj = h('div', { class: 'tsx-obj' }), msgs = h('div', { class: 'col' }), badge = h('div');
          const tg = (k, label) => { const t = h('div', { class: 'tsx-tg' + (st[k] ? ' on' : ''), onclick: () => { st[k] = !st[k]; t.classList.toggle('on', st[k]); draw(); } }, h('i'), label); return t; };
          function draw() {
            const rows = [];
            if (st.name) rows.push('name: "Honda"'); if (st.color) rows.push('color: "red"');
            if (st.price) rows.push(st.priceStr ? 'price: "1000"' : 'price: 1000'); if (st.extra) rows.push('wheels: 4');
            obj.replaceChildren(h('div', '{'), ...rows.map((r, i) => h('div', { style: { paddingLeft: '1.2em' } }, r + (i < rows.length - 1 ? ',' : ''))), h('div', '}'));
            const errs = [];
            if (!st.name) errs.push("Property 'name' is missing in type '{…}' but required in type 'Car'.");
            if (!st.color) errs.push("Property 'color' is missing in type '{…}' but required in type 'Car'.");
            if (st.price && st.priceStr) errs.push("Type 'string' is not assignable to type 'number'.（price）");
            if (st.extra) errs.push("Object literal may only specify known properties, and 'wheels' does not exist in type 'Car'.");
            obj.className = 'tsx-obj ' + (errs.length ? 'ng' : 'ok');
            msgs.replaceChildren(...errs.map((e) => res(false, e)));
            badge.replaceChildren(errs.length ? h('div', { class: 'tsx-res ng' }, '✖ Car を満たしていません') : h('div', { class: 'tsx-res ok' }, '✓ Car を満たしている！'));
          }
          el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, code('interface Car {\n  name: string;\n  color: string;\n  price?: number; // 省略OK\n}', 'ts'), lbl('プロパティ ON/OFF'), tg('name', 'name'), tg('color', 'color'), tg('price', 'price（?付き）'), tg('priceStr', 'price を "文字列" にする'), tg('extra', '余計な wheels を足す')),
            h('div', { class: 'col', style: { justifyContent: 'center' } }, lbl('const myCar: Car ='), obj, badge, msgs)));
          draw();
        },
      },
      {
        t: 'extends と merge', lead: 'interface は<b>足して増やせる</b>。「次へ」で2つのやり方を見よう。',
        render(el) {
          const bl = (t, c, cls) => h('span', { class: 'tsx-bl ' + (cls || ''), style: { background: cls ? '' : c } }, t);
          const pointA = h('div', { class: 'tsx-card' }, h('b', 'interface Point'), bl('x: number', 'var(--basic)'), bl('y: number', 'var(--basic)'));
          const z = bl('z: number', 'var(--pink)'); z.classList.add('tsx-fall');
          const p3 = h('div', { class: 'tsx-card' }, h('b', 'interface Point3D extends Point'), bl('x: number', '', 'inh'), bl('y: number', '', 'inh'), z);
          const A = h('div', { class: 'tsx-sec' }, h('div', { class: 'split' }, pointA, p3));
          const m1 = h('div', { class: 'tsx-card' }, h('b', 'interface Point'), bl('x: number', 'var(--basic)'), bl('y: number', 'var(--basic)'));
          const m2 = h('div', { class: 'tsx-card' }, h('b', 'interface Point  // 同名'), bl('z: number', 'var(--pink)'));
          const mm = h('div', { class: 'tsx-card', style: { borderColor: 'var(--ok)' } }, h('b', '合体 → Point'), bl('x: number', 'var(--basic)'), bl('y: number', 'var(--basic)'), bl('z: number', 'var(--pink)'));
          const B = h('div', { class: 'tsx-sec' }, h('div', { class: 'split' }, h('div', { class: 'col' }, m1, m2), mm));
          const cd = [code('interface Point3D extends Point {\n  z: number;\n}', 'ts'), code('interface Point { x: number; y: number }\ninterface Point { z: number }  // 同名で合体', 'ts')];
          const cbox = h('div');
          el.append(stepper({
            color: 'var(--ts)',
            steps: [{ say: 'まず基本の <b>Point</b>（x, y）。' }, { say: '<b>extends</b>：Point を引き継いで、<b>z</b> だけ追加。薄い2つは「継承したもの」。' }, { say: '<b>merge</b>：同名の interface を2回書くと…' }, { say: '自動で<b>1つに合体</b>！（type ではできない）' }],
            init(vis) { vis.append(A, B, cbox); },
            update(n) {
              A.classList.toggle('off', n >= 2); B.classList.toggle('off', n < 2);
              p3.style.visibility = n >= 1 ? 'visible' : 'hidden';
              if (n === 1) { z.style.animation = 'none'; void z.offsetWidth; z.style.animation = ''; }
              mm.style.visibility = n >= 3 ? 'visible' : 'hidden'; m2.style.transform = n >= 3 ? 'translateY(-30px) scale(.9)' : ''; m2.style.opacity = n >= 3 ? .35 : 1;
              cbox.replaceChildren(cd[n >= 2 ? 1 : 0]);
            },
          }));
        },
      },
      {
        t: 'interface vs type', lead: '行を<b>クリック</b>すると例が出ます。迷ったら「オブジェクトは interface、それ以外は type」。',
        render(el) {
          const R = [
            ['オブジェクトの形', 'y', 'y', 'interface Car { name: string }\ntype Car = { name: string }'],
            ['拡張（継承）', 'y', 't', 'interface B extends A {}\ntype B = A & { z: number }  // & で合成'],
            ['同名でマージ', 'y', 'n', 'interface P { x: number }\ninterface P { y: number }  // OK\ntype P = {...}; type P = {...}  // ✖ 重複エラー'],
            ['Union（A | B）', 'n', 'y', 'type Id = number | string;\n// interface では書けない'],
            ['タプル・プリミティブの別名', 'n', 'y', 'type Axis = [number, number];\ntype Age = number;'],
          ];
          const sym = { y: ['✓', 'y'], n: ['✖', 'n'], t: ['△', 't'] };
          const cbox = h('div', { style: { marginTop: '12px' } }, code('// 行をクリック', 'ts'));
          const tb = h('table', { class: 'tsx-tbl', style: { '--c': 'var(--ts)' } }, h('tr', h('th'), h('th', 'interface'), h('th', 'type')));
          R.forEach(([n, a, b, ex]) => {
            const tr = h('tr', { onclick: () => { tb.querySelectorAll('tr').forEach((x) => x.classList.remove('on')); tr.classList.add('on'); cbox.replaceChildren(code(ex, 'ts')); } }, h('td', n), h('td', { class: sym[a][1] }, sym[a][0]), h('td', { class: sym[b][1] }, sym[b][0]));
            tb.append(tr);
          });
          el.append(tb, cbox);
        },
      },
      {
        t: '実践：型を設計しよう', tag: 'PRACTICE', lead: 'ミッションは3つ。Union 型の値ミスを直して、Task に項目を1つ足そう。',
        render(el) {
          el.append(tsPractice("type Status = \"todo\" | \"doing\" | \"done\";\n\ninterface Task {\n  id: number;\n  title: string;\n  status: Status;\n  memo?: string;\n  // ② ここに assignee?: string を足す\n}\n\n// ① status の値を直す（赤線）\nconst t: Task = { id: 1, title: \"TSを学ぶ\", status: \"finished\" };\nconsole.log(t);\n", (v, c, ed) => [
            { label: '① status の赤線を消す（"todo" / "doing" / "done" のどれかにする）', ok: ed && c.errors.length === 0 },
            { label: '② interface Task に assignee?: string を足す', ok: ed && /assignee\s*\?\s*:\s*string/.test(nc(v)) },
            { label: '③ 実行して t が表示される', ok: ed && ranOk(c) },
            { optional: true, label: '任意：Task の配列から status が "done" のものだけ返す doneOnly(tasks) を作って実行する', ok: ed && /Task\s*\[\s*\]/.test(nc(v)) && /\.filter\s*\(/.test(nc(v)) && /doneOnly\s*\(/.test(nc(v)) && ranOk(c, (t) => t.length >= 2) },
          ], "type Status = \"todo\" | \"doing\" | \"done\";\n\ninterface Task {\n  id: number;\n  title: string;\n  status: Status;\n  memo?: string;\n  assignee?: string;\n}\n\nconst t: Task = { id: 1, title: \"TSを学ぶ\", status: \"done\" };\nconsole.log(t);\n\n// 任意チャレンジ\nfunction doneOnly(tasks: Task[]): Task[] {\n  return tasks.filter((x) => x.status === \"done\");\n}\nconsole.log(doneOnly([t, { id: 2, title: \"復習\", status: \"todo\" }]));\n", 'TypeScript', [{"hint": ["Status に入る文字は \"todo\" / \"doing\" / \"done\" の3つだけ。", "\"finished\" を \"done\" に変えよう。"], "fix": [["status: \"finished\"", "status: \"done\""]]}, {"hint": ["interface Task の中に、1行足す。", "assignee?: string; を書こう（? は「なくてもOK」）。"], "fix": [["  // ② ここに assignee?: string を足す", "  assignee?: string;"]]}, {"hint": ["赤線が消えたら「▶ 実行」を押そう。", "console に { id: 1, … } が出れば OK。"], "fix": [["status: \"finished\"", "status: \"done\""], ["  // ② ここに assignee?: string を足す", "  assignee?: string;"]]}, {"hint": ["配列の「条件に合うものだけ」を取り出すメソッドは？（filter）", "function doneOnly(tasks: Task[]): Task[] { return tasks.filter((x) => x.status === \"done\"); }"], "fix": "type Status = \"todo\" | \"doing\" | \"done\";\n\ninterface Task {\n  id: number;\n  title: string;\n  status: Status;\n  memo?: string;\n  assignee?: string;\n}\n\nconst t: Task = { id: 1, title: \"TSを学ぶ\", status: \"done\" };\nconsole.log(t);\n\n// 任意チャレンジ\nfunction doneOnly(tasks: Task[]): Task[] {\n  return tasks.filter((x) => x.status === \"done\");\n}\nconsole.log(doneOnly([t, { id: 2, title: \"復習\", status: \"todo\" }]));\n"}]));
        },
      },
    ],
  });

  /* ================= ts-class ================= */
  K.reg({
    id: 'ts-class', track: 'ts', title: 'クラス', sub: '設計図とインスタンス', emoji: '🏭',
    scenes: [
      {
        t: 'クラス = 設計図、new = スタンプ', lead: '名前と値段を入れて <b>new</b> を押すと、設計図から<b>インスタンス</b>が量産されます。',
        render(el) {
          const nm = h('input', { value: 'Honda', style: { font: 'inherit', padding: '.4em .8em', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--bg2)', color: 'var(--text)', width: '120px' } });
          const pr = h('input', { type: 'number', value: '1000', style: { font: 'inherit', padding: '.4em .8em', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--bg2)', color: 'var(--text)', width: '100px' } });
          const fac = h('div', { class: 'tsx-fac', style: { '--c': 'var(--ts)' } });
          const cd = code('class Car {\n  constructor(\n    public name: string,\n    public price: number,\n  ) {}\n}\n\nconst c1 = new Car("Honda", 1000);', 'ts', { color: 'var(--ts)' });
          let n = 0;
          const make = () => {
            n++; cd.setHi([2, 3, 4, 5]);
            cd.lines[7].innerHTML = K.W.hl(`const c${n} = new Car("${nm.value}", ${pr.value || 0});`, 'ts');
            fac.append(h('div', { class: 'tsx-inst', style: { '--c': ['var(--ts)', 'var(--pink)', 'var(--basic)', 'var(--team)'][n % 4] } }, h('b', `c${n} : Car`), h('div', `name: "${nm.value}"`), h('div', `price: ${pr.value || 0}`)));
            setTimeout(() => cd.setHi([8]), 600);
          };
          el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('設計図 (class)'), cd, h('div', { class: 'row' }, 'name', nm, 'price', pr, h('button', { class: 'btn primary', onclick: make }, '🖨 new Car()'))), h('div', { class: 'col' }, lbl('インスタンス'), fac)));
          make();
        },
      },
      {
        t: 'アクセス修飾子：誰が触れる？', lead: 'マスを<b>クリック</b>して、アクセスできるか確認。（public は誰でも／protected は子まで／private は自分だけ）',
        render(el) {
          const F = [['🌐 public', 'name', [1, 1, 1]], ['🛡️ protected', 'age', [1, 1, 0]], ['🔒 private', 'pin', [1, 0, 0]]];
          const who = ['クラスの中', '子クラス', '外部'];
          const msg = h('div', { style: { minHeight: '2.4em', marginTop: '10px' } });
          const mx = h('div', { class: 'tsx-mx', style: { '--c': 'var(--ts)' } }, h('div'), who.map((w) => h('div', { class: 'hd' }, w)));
          F.forEach(([lab, f, ok]) => {
            mx.append(h('div', { class: 'fl' }, lab + '\n' + f));
            ok.forEach((o, i) => { const b = h('button', { onclick: () => { b.className = o ? 'y' : 'n'; b.textContent = o ? '🔓 OK' : '🔒 NG'; msg.replaceChildren(o ? res(true, `${who[i]}から ${f} にアクセスできる`) : res(false, `Property '${f}' is ${lab.split(' ')[1]} and only accessible within class 'User'${f === 'age' ? ' and its subclasses' : ''}.`)); } }, '？'); mx.append(b); });
          });
          el.append(code('class User {\n  public name = "Lam";\n  protected age = 20;\n  private pin = 1234;\n}', 'ts', { color: 'var(--ts)' }), h('div', { style: { height: '14px' } }), mx, msg,
            h('div', { class: 'row', style: { marginTop: '12px' } }, h('button', { class: 'btn ghost', onclick: () => mx.querySelectorAll('button').forEach((b) => b.click()) }, '全部開ける')));
        },
      },
      { t: 'readonly：書き換え禁止', tag: 'readonly', lead: '「次へ ▶」で、読み取り専用プロパティが<b>いつ代入できて、いつダメか</b>を追おう。', render: readonlySceneGap },
      {
        t: 'getter / setter：門番を置く', lead: '<code class="i">private</code> の値は直接触れない。<b>setter が検査</b>してから通します。値を送ってみよう。',
        render(el) {
          let age = 20;
          const store = h('div', { class: 'tsx-door' }, '🔐'), sv = h('div', { style: { font: '800 1.3rem var(--mono)', textAlign: 'center' } }), gate = h('div', { class: 'tsx-door' }, '🚧'), inp = h('div', { class: 'tsx-door' }, '✉️');
          const out = h('div', { style: { minHeight: '2.4em' } });
          const draw = () => { sv.textContent = '_age = ' + age; };
          const send = (v) => {
            inp.firstChild && (inp.textContent = '✉️ ' + v);
            const ok = v >= 0 && v <= 150;
            gate.className = 'tsx-door ' + (ok ? 'ok' : 'ng'); gate.textContent = ok ? '✅' : '⛔';
            if (ok) { age = v; store.className = 'tsx-door ok'; draw(); out.replaceChildren(res(true, `user.age = ${v}  →  保存された`)); }
            else { store.className = 'tsx-door'; out.replaceChildren(res(false, `user.age = ${v}  →  Error: 年齢は0〜150`)); }
          };
          draw();
          el.append(code('class User {\n  private _age = 20;\n  get age() { return this._age; }\n  set age(v: number) {\n    if (v < 0 || v > 150) throw new Error("年齢は0〜150");\n    this._age = v;\n  }\n}', 'ts', { color: 'var(--ts)' }),
            h('div', { class: 'tsx-gate', style: { margin: '16px 0' } }, inp, gate, h('div', store, sv)),
            h('div', { class: 'row' }, [25, 99, -5, 200].map((v) => h('button', { class: 'btn', onclick: () => send(v) }, 'user.age = ' + v))), out);
        },
      },
      {
        t: '継承：親から子へ', lead: '<b>extends</b> で親の機能を丸ごと受け継ぐ。最後に <b>abstract</b> も。',
        render(el) {
          const cls = (name, cc, members) => { const d = h('div', { class: 'tsx-cls', style: { '--cc': cc } }, h('header', name), members.map(([t, k]) => h('div', { class: k || '' }, t))); return d; };
          const animal = cls('Animal', 'var(--team)', [['name: string'], ['move()']]);
          const absTag = h('span', { style: { fontSize: '.75rem', opacity: 0 } }, 'abstract');
          animal.firstChild.append(absTag);
          const dog = cls('Dog extends Animal', 'var(--ts)', [['name  ↑継承', 'inh'], ['move()  ↑継承', 'inh'], ['speak() 🐶 override']]);
          const cat = cls('Cat extends Animal', 'var(--pink)', [['name  ↑継承', 'inh'], ['move()  ↑継承', 'inh'], ['speak() 🐱 override']]);
          const kids = h('div', { class: 'kids' }, dog, cat);
          const arrow = h('div', { style: { font: '900 1.6rem var(--mono)', color: 'var(--ts)', opacity: 0, transition: '.5s' } }, '⬆ extends');
          const note = h('div', { style: { minHeight: '2.4em' } });
          el.append(stepper({
            color: 'var(--ts)',
            steps: [{ say: '親クラス <b>Animal</b>：name と move() を持つ。' }, { say: '<b>Dog extends Animal</b>：親を引き継ぐ矢印を引いた。' }, { say: '子は <b>name / move() を書かなくても</b>最初から使える（薄い行）。' }, { say: '子ごとの個性は <b>override</b>。speak() の中身を自由に。' }, { say: '<b>abstract</b>：Animal を「設計だけ」にすると <code class="i">new Animal()</code> は禁止！' }],
            init(vis) { vis.append(h('div', { class: 'tsx-tree' }, animal, arrow, kids), note); },
            update(n) {
              dog.classList.toggle('off', n < 1); cat.classList.toggle('off', n < 1); arrow.style.opacity = n >= 1 ? 1 : 0;
              [dog, cat].forEach((c) => { c.children[1].style.opacity = n >= 2 ? .6 : 0; c.children[2].style.opacity = n >= 2 ? .6 : 0; c.children[3].style.opacity = n >= 3 ? 1 : 0; });
              absTag.style.opacity = n >= 4 ? 1 : 0; animal.classList.remove('x');
              note.replaceChildren();
              if (n === 4) { animal.classList.add('x'); note.append(res(false, "Cannot create an instance of an abstract class.  new Animal() ✖"), res(true, 'new Dog("ポチ") ✓')); }
            },
          }));
        },
      },
      { t: 'super()：親を呼ぶ', tag: 'super', lead: '子クラスの constructor では <b>super()</b> が先。親→子の順にインスタンスが出来上がる様子を見よう。', render: superScene },
      {
        t: '実践：private の壁を越えよう', tag: 'PRACTICE', lead: 'ミッションは3つ。子クラス Dog から親の <code class="i">name</code> が見えない。修飾子を1語変えて直そう。',
        render(el) {
          el.append(tsPractice("class Animal {\n  constructor(private name: string) {} // ここを直す\n  speak(): string {\n    return `${this.name} ...`;\n  }\n}\n\nclass Dog extends Animal {\n  speak(): string {\n    return `${this.name} ワン！`; // ← 赤線\n  }\n}\n\nconst d = new Dog(\"ポチ\");\nconsole.log(d.speak());\n", (v, c, ed) => [
            { label: '① 赤線（name が見えない）をなくす', ok: ed && c.errors.length === 0 },
            { label: '② name の private をやめる（子から見える protected がおすすめ）', ok: ed && /(protected|public)\s+name/.test(nc(v)) },
            { label: '③ 実行して「ポチ ワン！」が出る', ok: ed && ranOk(c, (t) => t.some((x) => /ポチ ワン/.test(x))) },
            { optional: true, label: '任意：Animal を abstract class にして、speak() を abstract メソッドにする（Dog が作る）', ok: ed && /abstract\s+class\s+Animal/.test(nc(v)) && /abstract\s+speak\s*\(/.test(nc(v)) && ranOk(c, (t) => t.some((x) => /ポチ ワン/.test(x))) },
          ], "// 任意チャレンジ：Animal を abstract にして、speak() は子が必ず作る\nabstract class Animal {\n  constructor(protected name: string) {}\n  abstract speak(): string;\n}\n\nclass Dog extends Animal {\n  speak(): string {\n    return `${this.name} ワン！`;\n  }\n}\n\nconst d = new Dog(\"ポチ\");\nconsole.log(d.speak());\n", 'TypeScript', [{"hint": ["Dog の中の this.name が赤線。Animal の name は private だよ。", "private は「Animal の中だけ」。子にも見せたいなら？"], "fix": [["private name", "protected name"]]}, {"hint": ["private の代わりに、子クラスまで OK になる言葉は？", "protected を使おう（public でも動くよ）。"], "fix": [["private name", "protected name"]]}, {"hint": ["直したら「▶ 実行」を押そう。", "「ポチ ワン！」と出れば OK。"], "fix": [["private name", "protected name"]]}, {"hint": ["「設計だけ」のクラスには abstract を付ける。メソッドにも付けられるよ。", "abstract class Animal { …; abstract speak(): string; } にして、Dog 側は今のまま speak() を書く。"], "fix": "// 任意チャレンジ：Animal を abstract にして、speak() は子が必ず作る\nabstract class Animal {\n  constructor(protected name: string) {}\n  abstract speak(): string;\n}\n\nclass Dog extends Animal {\n  speak(): string {\n    return `${this.name} ワン！`;\n  }\n}\n\nconst d = new Dog(\"ポチ\");\nconsole.log(d.speak());\n"}]));
        },
      },
    ],
  });

  /* ================= ts-generics ================= */
  K.reg({
    id: 'ts-generics', track: 'ts', title: 'ジェネリクス', sub: '型を引数にする', emoji: '📦',
    scenes: [
      {
        t: 'Box<T> マシン', tag: 'Generics', lead: '<b>T</b> は「あとで決める型」。ダイヤルで T を選び、値を入れてみよう。',
        render(el) {
          let T = 'number'; const lit = { number: '42', string: '"hi"', boolean: 'true' };
          const tcol = { number: 'var(--ts)', string: 'var(--basic)', boolean: 'var(--team)' };
          const mach = h('div', { class: 'tsx-mach' }), slot = h('div', { class: 'slot' }, '?'), title = h('div', { class: 'ti' }), out = h('div', { style: { minHeight: '2.4em' } });
          const cd = h('div'); let cur = lit.number;
          const draw = () => {
            mach.style.setProperty('--c', tcol[T]); title.innerHTML = 'Box&lt;<span class="T">' + T + '</span>&gt;';
            cd.replaceChildren(code('interface Box<T> {\n  value: T;\n}\n\nconst box: Box<' + T + '> = { value: ' + cur + ' };', 'ts'));
          };
          const dial = h('div', { class: 'tsx-seg', style: { '--c': 'var(--ts)' } }, ['number', 'string', 'boolean'].map((t) => h('button', { class: t === T ? 'on' : '', onclick: (e) => { T = t; cur = lit[t]; slot.textContent = '?'; out.replaceChildren(); dial.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.textContent === t)); draw(); } }, t)));
          mach.append(title, slot);
          const bin = h('div', { class: 'row' }, [['42', 'number'], ['"hi"', 'string'], ['true', 'boolean'], ['7', 'number'], ['"TS"', 'string']].map(([v, ty]) => h('span', { class: 'tsx-chip', onclick: () => {
            if (ty === T) { cur = v; slot.textContent = v; mach.animate([{ transform: 'scale(1.06)' }, { transform: 'none' }], { duration: 300 }); out.replaceChildren(res(true, `Box<${T}> に ${v} を入れた`)); draw(); }
            else { mach.classList.remove('shake'); void mach.offsetWidth; mach.classList.add('shake'); out.replaceChildren(res(false, `Type '${ty}' is not assignable to type '${T}'.`)); }
          } }, v)));
          draw();
          el.append(lbl('T を選ぶ'), dial, h('div', { class: 'split' }, h('div', { class: 'col' }, mach, lbl('入れる値（クリック）'), bin, out), cd));
        },
      },
      {
        t: 'identity<T>：入れた型が出てくる', lead: '<b>any</b> だと型情報が消える。<b>T</b> なら「入れた型＝出てくる型」。',
        render(el) {
          const inC = h('span', { class: 'tsx-chip in', style: { '--bc': 'var(--ts)' } }, '42'), outC = h('span', { class: 'tsx-chip in', style: { '--bc': 'var(--ts)' } }, '42');
          const tTag = h('span', { class: 'chip' }, 'T = ？'), fn = h('div', { class: 'tsx-card', style: { textAlign: 'center' } }, h('b', 'identity<T>(x: T): T'), tTag);
          const cdw = h('div'), note = h('div', { style: { minHeight: '2.4em' } });
          const setIO = (a, b, col) => { inC.textContent = a; outC.textContent = b; [inC, outC].forEach((c) => c.style.setProperty('--bc', col)); };
          el.append(stepper({
            color: 'var(--ts)',
            steps: [{ say: '<b>T</b> はまだ「？」。呼ばれた時に決まる穴。' }, { say: '<code class="i">identity(42)</code> → T は <b>number</b> と推論。戻り値も number。' }, { say: '<code class="i">identity("hi")</code> → T は <b>string</b>。同じ関数で別の型に対応！' }, { say: '<b>any</b> 版：出てくるのは any。<code class="i">.toUpperCase()</code> が number でも<b>赤線が出ない</b> → 実行時に爆発 💥' }],
            init(vis) { vis.append(h('div', { class: 'tsx-flow' }, h('div', inC), fn, h('div', outC)), cdw, note); },
            update(n) {
              note.replaceChildren(); fn.style.borderColor = '';
              if (n === 0) { setIO('？', '？', 'var(--mute)'); tTag.textContent = 'T = ？'; cdw.replaceChildren(code('function identity<T>(x: T): T {\n  return x;\n}', 'ts')); }
              if (n === 1) { setIO('42', '42', 'var(--ts)'); tTag.textContent = 'T = number'; cdw.replaceChildren(code('let a = identity(42);  // a: number', 'ts')); }
              if (n === 2) { setIO('"hi"', '"hi"', 'var(--basic)'); tTag.textContent = 'T = string'; cdw.replaceChildren(code('let b = identity("hi");  // b: string', 'ts')); }
              if (n === 3) { setIO('42', '42', 'var(--bad)'); tTag.textContent = 'any'; fn.style.borderColor = 'var(--bad)'; cdw.replaceChildren(code('function idAny(x: any): any { return x; }\nidAny(42).toUpperCase();  // 型エラーなし…でも実行時に落ちる', 'ts')); note.append(res(false, 'TypeError: idAny(...).toUpperCase is not a function')); }
            },
          }));
        },
      },
      {
        t: 'Array<T> と制約 extends', lead: '<code class="i">number[]</code> は <code class="i">Array&lt;number&gt;</code> のこと。<b>T extends …</b> で「T に条件」を付けられる。',
        render(el) {
          const out = h('div', { style: { minHeight: '2.4em' } });
          const door = h('div', { class: 'tsx-door' }, '🚪');
          const feed = (lab, ok) => { door.className = 'tsx-door ' + (ok ? 'ok' : 'ng'); door.textContent = ok ? '✅' : '⛔'; out.replaceChildren(ok ? res(true, `${lab} は length を持つ → OK`) : res(false, `Argument of type '${lab}' is not assignable to parameter of type '{ length: number; }'.`)); };
          el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, code('let a: Array<number> = [1, 2];\nlet b: number[] = [1, 2];  // 同じ意味\n\nfunction len<T extends { length: number }>(x: T) {\n  return x.length;\n}', 'ts')),
            h('div', { class: 'col' }, h('div', { class: 'row' }, h('button', { class: 'btn', onclick: () => feed('"abc"', true) }, 'len("abc")'), h('button', { class: 'btn', onclick: () => feed('[1,2,3]', true) }, 'len([1,2,3])'), h('button', { class: 'btn', onclick: () => feed('number', false) }, 'len(42)')), door, out)));
        },
      },
      {
        t: '実践：any を T に置き換えよう', tag: 'PRACTICE', lead: 'ミッションは3つ。<code class="i">first</code> の any を <code class="i">&lt;T&gt;</code> に置き換えよう。',
        render(el) {
          el.append(tsPractice("// any だと戻り値の型が失われる → T に置き換えよう\nfunction first(arr: any[]): any { // ここを直す\n  return arr[0];\n}\n\nconst n = first([10, 20]);\nconst s = first([\"a\", \"b\"]);\nconsole.log(n, s);\n", (v, c, ed) => [
            { label: '① first に <T> を付ける（function first<T>）', ok: ed && /function\s+first\s*<\s*\w+\s*>/.test(nc(v)) },
            { label: '② any をやめて T を使う', ok: ed && !/\bany\b/.test(nc(v)) },
            { label: '③ 赤線なしで実行して 10 と a が出る', ok: ed && ranOk(c, (t) => t.some((x) => /10/.test(x) && /\ba\b/.test(x))) },
            { optional: true, label: '任意：<T extends { length: number }> を使った longest(a, b) を作って、longest("abc", "de") を実行する', ok: ed && /<\s*T\s+extends\s*\{\s*length\s*:\s*number\s*;?\s*\}\s*>/.test(nc(v)) && /longest\s*\(/.test(nc(v)) && ranOk(c, (t) => t.some((x) => /abc/.test(x))) },
          ], "function first<T>(arr: T[]): T {\n  return arr[0];\n}\n\nconst n = first([10, 20]);   // number\nconst s = first([\"a\", \"b\"]); // string\nconsole.log(n, s);\n\n// 任意チャレンジ：長いほうを返す（length を持つものだけ）\nfunction longest<T extends { length: number }>(a: T, b: T): T {\n  return a.length >= b.length ? a : b;\n}\nconsole.log(longest(\"abc\", \"de\")); // abc\n", 'TypeScript', [{"hint": ["関数名のうしろに <T> を付ける。", "function first<T>(…) の形にしよう。"], "fix": [["function first(arr: any[]): any {", "function first<T>(arr: any[]): any {"]]}, {"hint": ["any[] を「T の配列」にすると？", "引数は T[]、戻り値は T にしよう。"], "fix": [["function first(arr: any[]): any {", "function first<T>(arr: T[]): T {"]]}, {"hint": ["直したら「▶ 実行」を押そう。", "10 と a が出れば OK。"], "fix": [["function first(arr: any[]): any {", "function first<T>(arr: T[]): T {"]]}, {"hint": ["「.length を持つ T だけ」にするには、T に条件を付ける（extends）。", "function longest<T extends { length: number }>(a: T, b: T): T { return a.length >= b.length ? a : b; }"], "fix": "function first<T>(arr: T[]): T {\n  return arr[0];\n}\n\nconst n = first([10, 20]);   // number\nconst s = first([\"a\", \"b\"]); // string\nconsole.log(n, s);\n\n// 任意チャレンジ：長いほうを返す（length を持つものだけ）\nfunction longest<T extends { length: number }>(a: T, b: T): T {\n  return a.length >= b.length ? a : b;\n}\nconsole.log(longest(\"abc\", \"de\")); // abc\n"}]));
        },
      },
    ],
  });

  /* ================= ts-test ================= */
  const equalJ = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  K.reg({
    id: 'ts-test', track: 'ts', title: '単体テスト入門', sub: 'Jest / Vitest', emoji: '🧪',
    scenes: [
      { t: 'なぜテストを書くの？', tag: 'Why', lead: '理由を<b>クリック</b>して開こう。右は「バグを見つけるタイミング」と修正コストのイメージ。', render: whyTestScene },
      { t: 'テストの種類', tag: 'Which', lead: 'ピラミッドの段や、横のボタンを<b>クリック</b>。種類ごとに「速さ・コスト・数」が違うよ。', render: pyramidScene },
      { t: 'ユニットテストの流れ', tag: 'Flow', lead: '設計 → 実行 → 確かめる → 直す → 評価。ぐるぐる回して、テストを育てる。', render: flowTestScene },
      { t: 'Vitest をセットアップ', tag: 'Vitest', lead: '4ステップで最初のテストが動く。下では<b>マッチャー</b>と「目視 vs 自動テスト」を体験しよう。', render: vitestScene },
      {
        t: 'TDD：赤 → 緑 → 赤 → 緑', lead: 'テストを<b>先に</b>書くと失敗（赤）。実装で成功（緑）。やりたいことが変わったらまた赤→緑。',
        render(el) {
          const TS = ['it("sum(2, 3) は 5", () => {\n  expect(sum(2, 3)).toBe(5);\n});', 'it("sum(2, 3) は 5", () => {\n  expect(sum(2, 3)).toBe(5);\n});', 'it("sum(2, 3) は 5", () => {\n  expect(sum(2, 3)).toBe(5);\n});\nit("マイナス合計は 0", () => {\n  expect(sum(-5, 2)).toBe(0);\n});', 'it("sum(2, 3) は 5", () => {\n  expect(sum(2, 3)).toBe(5);\n});\nit("マイナス合計は 0", () => {\n  expect(sum(-5, 2)).toBe(0);\n});'];
          const IM = ['// まだ sum が無い…', 'function sum(a: number, b: number) {\n  return a + b;\n}', 'function sum(a: number, b: number) {\n  return a + b;  // -3 になる…\n}', 'function sum(a: number, b: number) {\n  return Math.max(0, a + b);\n}'];
          const R = [[['sum(2, 3) は 5', 'ng', 'sum is not defined']], [['sum(2, 3) は 5', 'ok', '']], [['sum(2, 3) は 5', 'ok', ''], ['マイナス合計は 0', 'ng', '期待 0 / 実際 -3']], [['sum(2, 3) は 5', 'ok', ''], ['マイナス合計は 0', 'ok', '']]];
          const left = h('div', { class: 'col' }), list = h('div', { class: 'tsx-tl' }), light = h('div', { class: 'tsx-light' }), phase = h('div');
          const PH = [0, 1, 0, 1];
          el.append(stepper({
            color: 'var(--ts)',
            steps: [{ say: '🔴 <b>Red</b>：まずテストを書く。実装が無いので失敗。' }, { say: '🟢 <b>Green</b>：テストが通る最小の<b>実装</b>（＝中身のコード）を書く。' }, { say: '🔴 要望が増えた：「マイナスは 0 にして」→ テストを足すと赤。' }, { say: '🟢 実装を直して全部緑。<b>以前のテストも守られている</b>のが安心ポイント。' }],
            init(vis) { vis.append(h('div', { class: 'split' }, left, h('div', { class: 'col', style: { justifyContent: 'center' } }, lbl('いまの段階'), phase, light, list))); },
            update(n) {
              left.replaceChildren(lbl('sum.test.ts'), code(TS[n], 'ts', { color: 'var(--ts)' }), lbl('sum.ts'), code(IM[n], 'ts', { color: 'var(--basic)' }));
              list.replaceChildren(...R[n].map(([t, k, m]) => h('div', { class: 'tsx-t ' + k }, h('i', k === 'ok' ? '✓' : '✖'), t, m ? h('em', m) : null)));
              const cur = PH[n]; phase.replaceChildren(K.W.mini({ k: 'flow', items: [{ i: 'x', t: 'Red 失敗', c: cur === 0 ? 'bad' : '' }, { i: 'check', t: 'Green 成功', c: cur === 1 ? 'ok' : '' }, { i: 'sparkles', t: 'Refactor 整える', c: n === 3 ? 'hi' : '' }], loop: '要望が増えたらまた Red から' }));
              const g = R[n].every((r) => r[1] === 'ok'); light.className = 'tsx-light ' + (g ? 'g' : 'r'); light.replaceChildren(h('b', g ? '🟢' : '🔴'), g ? 'PASS' : 'FAIL');
            },
          }));
        },
      },
      {
        t: 'テストの型：Arrange → Act → Assert', tag: 'AAA', lead: 'どのテストも<b>3ステップ</b>。コードのどの行がどれか見てみよう。',
        render(el) {
          const src = 'it("商品を追加すると合計が出る", () => {\n  // Arrange（準備）\n  const cart = new Cart();\n\n  // Act（実行）\n  cart.add({ name: "PC", price: 1000 });\n\n  // Assert（確認）\n  expect(cart.total()).toBe(1000);\n});';
          const pre = code(src, 'ts', { dim: true, color: 'var(--ts)' });
          const A = ['準備', '実行', '確認'].map((t, i) => h('div', h('b', ['🧰', '▶️', '🔍'][i]), ['Arrange', 'Act', 'Assert'][i], h('div', { style: { fontSize: '.75rem', color: 'var(--mute)' } }, t)));
          const aaa = h('div', { class: 'tsx-aaa', style: { '--c': 'var(--ts)' } }, A);
          const lines = [[2, 3], [5, 6], [8, 9]];
          el.append(stepper({
            color: 'var(--ts)',
            steps: [{ say: '<b>Arrange</b>：テスト対象と材料を用意する。' }, { say: '<b>Act</b>：テストしたい操作を<b>1つだけ</b>実行。' }, { say: '<b>Assert</b>：結果が期待通りか <code class="i">expect</code> で確認。' }],
            init(vis) { vis.append(aaa, h('div', { style: { height: '12px' } }), pre); },
            update(n) { A.forEach((a, i) => a.classList.toggle('on', i === n)); pre.setHi(lines[n]); },
          }));
        },
      },
      {
        t: 'ミニテストランナー', tag: 'LIVE', lead: '左の関数を<b>書き換える</b>と、右のテストがリアルタイムで ✓ / ✖ に。全部緑にしよう！',
        render(el) {
          const init = '// 18歳以上なら成人（true）\nfunction isAdult(age) {\n  return age > 18;\n}\n';
          const T = [['20歳は成人', () => [isAdult(20), true], 'isAdult(20)'], ['18歳ちょうどは成人', () => [isAdult(18), true], 'isAdult(18)'], ['17歳は未成年', () => [isAdult(17), false], 'isAdult(17)'], ['マイナスは false', () => [isAdult(-1), false], 'isAdult(-1)']];
          let isAdult = () => undefined; const list = h('div', { class: 'tsx-tl' }), light = h('div', { class: 'tsx-light' }); let won = false;
          const run = (src) => {
            let err = null;
            try { isAdult = new Function(src + '\n;return isAdult;')(); } catch (e) { err = e; isAdult = () => undefined; }
            let pass = 0;
            list.replaceChildren(...T.map(([n, f, call]) => {
              let ok = false, m = '';
              try { const [a, b] = f(); ok = a === b; m = ok ? '' : `期待 ${b} / 実際 ${a}`; } catch (e) { m = String(e); }
              if (ok) pass++;
              return h('div', { class: 'tsx-t ' + (ok ? 'ok' : 'ng') }, h('i', ok ? '✓' : '✖'), n, h('em', h('div', 'expect(' + call + ')'), m));
            }));
            if (err) list.prepend(res(false, String(err.message || err)));
            const g = pass === T.length; light.className = 'tsx-light ' + (g ? 'g' : 'r'); light.replaceChildren(h('b', g ? '🟢' : '🔴'), `${pass} / ${T.length} PASS`);
            if (g && !won) { won = true; celebrate(); }
          };
          const ed = codeEditor(init, 'js', run); ed.style.borderRadius = '14px'; ed.style.minHeight = '230px';
          el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('isAdult.js（編集OK）'), ed, h('p', { style: { color: 'var(--mute)', fontSize: '.875rem' } }, '💡 ヒント：境界値（ちょうど18歳）に注目。')), h('div', { class: 'col' }, light, list)));
          run(init);
        },
      },
      {
        t: 'describe / it / expect 早見表', lead: 'カードを<b>クリック</b>すると、実際に評価した結果が出ます。',
        render(el) {
          el.append(code('import { describe, it, expect } from "vitest";\n\ndescribe("Cart クラス", () => {      // グループ\n  it("合計が計算できる", () => {    // 1つのテスト\n    expect(cart.total()).toBe(1000); // 確認\n  });\n});', 'ts', { color: 'var(--ts)' }));
          const M = [['toBe', 'expect(2 + 3).toBe(5)', '同じ値か（===）', () => Object.is(2 + 3, 5)], ['toEqual', 'expect({a:1}).toEqual({a:1})', '中身が同じか', () => equalJ({ a: 1 }, { a: 1 })], ['toBe ※落とし穴', 'expect({a:1}).toBe({a:1})', 'オブジェクトは別物 → 失敗', () => Object.is({ a: 1 }, { a: 1 })], ['toContain', 'expect([1,2,3]).toContain(2)', '配列に含まれるか', () => [1, 2, 3].includes(2)], ['toThrow', 'expect(() => JSON.parse("{")).toThrow()', 'エラーが出るか', () => { try { JSON.parse('{'); return false; } catch { return true; } }], ['not', 'expect(1).not.toBe(2)', '否定', () => !Object.is(1, 2)]];
          el.append(h('div', { style: { height: '14px' } }), h('div', { class: 'split', style: { gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))' } }, M.map(([n, ex, d, f]) => {
            const out = h('div');
            const b = h('button', { class: 'tsx-flip', style: { '--c': 'var(--ts)' }, onclick: () => out.replaceChildren(res(f(), f() ? 'PASS' : 'FAIL')) }, h('b', '.' + n + '()'), ex, h('small', d), out);
            return b;
          })));
        },
      },
      {
        t: '実践：テストを書こう', tag: 'PRACTICE', lead: 'ミッションは3つ。ブラウザ内の簡易 <code class="i">it / expect</code> で、バグ直し → 関数づくり → テスト追加。',
        render(el) {
          const html = '<style>.t{font:700 14px/1.6 monospace;padding:4px 8px;border-radius:6px;margin:3px 0}.ok{background:#d7f7df;color:#166534}.ng{background:#fde2e2;color:#991b1b}</style>\n<div id="out"></div>\n<script>\nconst T=[];function it(n,f){T.push([n,f])}\nfunction expect(a){return{toBe:function(b){if(!Object.is(a,b))throw Error("期待 "+JSON.stringify(b)+" / 実際 "+JSON.stringify(a))}}}\naddEventListener("load",function(){T.forEach(function(t){var ok=1,m="";try{t[1]()}catch(e){ok=0;m=e.message}out.insertAdjacentHTML("beforeend","<div class=\\"t "+(ok?"ok":"ng")+"\\">"+(ok?"✓ ":"✖ ")+t[0]+" "+m+"</div>")})});\n\n// ===== テスト =====\nit("sum(2, 3) は 5", function(){ expect(sum(2, 3)).toBe(5); });\nit("sum(0, 0) は 0", function(){ expect(sum(0, 0)).toBe(0); });\n<\/script>\n';
          const js = '// ① ここを直す：足し算なのに引き算になっている\nfunction sum(a, b) {\n  return a - b;\n}\n\n// ② ここに multiply(a, b) を作る（a × b を返す）\n';
          el.append(playground({
            title: 'Jest 風', mode: 'web', height: 300,
            files: [{ name: 'main.js', lang: 'js', code: js }, { name: 'test.html', lang: 'html', code: html }],
            solution: { 'main.js': 'function sum(a, b) {\n  return a + b;\n}\n\nfunction multiply(a, b) {\n  return a * b;\n}\n\n// 任意チャレンジ：0 で割ったら "エラー" を返す\nfunction divide(a, b) {\n  if (b === 0) return "エラー";\n  return a / b;\n}\n', 'test.html': html.replace(/<\/script>\s*$/, 'it("multiply(3, 4) は 12", function(){ expect(multiply(3, 4)).toBe(12); });\nit("divide(6, 3) は 2", function(){ expect(divide(6, 3)).toBe(2); });\nit("divide(1, 0) は エラー", function(){ expect(divide(1, 0)).toBe("エラー"); });\n<\/script>\n') },
            tasks: (v, c) => {
              const d = c.doc && c.doc(); const q = (x) => (d ? d.querySelectorAll(x).length : 0);
              const w = d && d.defaultView; const ev = (e) => { try { return w.eval(e); } catch (_) { return undefined; } };
              const tests = (v['test.html'].match(/\bit\(/g) || []).length;
              return [
                { label: '① sum のバグを直す（テストが全部 ✓ になる）', ok: q('#out .t') > 0 && q('#out .ng') === 0 && ev('sum(2, 3)') === 5, hint: ['sum は足し算のはずなのに、a - b になっているよ。', '- を + に変えよう。'], answer: { code: js.replace('a - b', 'a + b'), lang: 'js', mode: 'replace' } },
                { label: '② multiply(a, b) を作る（3 × 4 が 12 になる）', ok: ev('multiply(3, 4)') === 12, hint: ['sum と同じ形の関数をもう1つ作る。', 'function multiply(a, b) { return a * b; }'], answer: { code: js + 'function multiply(a, b) {\n  return a * b;\n}\n', lang: 'js', mode: 'replace' } },
                { label: '③ multiply のテストを test.html に1つ足す', ok: tests >= 3 && /multiply/.test(v['test.html'].split('テスト =====')[1] || '') && q('#out .ng') === 0, hint: ['test.html の一番下に、it(...) の行をもう1つ足す。', 'it("multiply(3, 4) は 12", function(){ expect(multiply(3, 4)).toBe(12); });'], answer: { code: html.replace(/<\/script>\s*$/, 'it("multiply(3, 4) は 12", function(){ expect(multiply(3, 4)).toBe(12); });\n<\/script>\n'), lang: 'html', mode: 'replace' } },
                { optional: true, label: '任意：divide(a, b) を作る（0 で割ったら "エラー" を返す）。テストも2つ足す', ok: ev('divide(6, 3)') === 2 && ev('divide(1, 0)') === 'エラー' && (v['test.html'].match(/divide\(/g) || []).length >= 2 && q('#out .ng') === 0, hint: ['「割る数が 0 のとき」を先に if で分けて、"エラー" を返す。', 'function divide(a, b) { if (b === 0) return "エラー"; return a / b; }。test.html には divide(6, 3) と divide(1, 0) のテストを足そう。'], answer: { code: js.replace('a - b', 'a + b') + 'function multiply(a, b) {\n  return a * b;\n}\n\nfunction divide(a, b) {\n  if (b === 0) return "エラー";\n  return a / b;\n}\n', lang: 'js', mode: 'replace' } },
              ];
            },
          }));
        },
      },
    ],
  });

  /* ================= review ================= */
  const QS = [
    ['HTML', '画像が表示できないときの代替テキストを指定する属性は？', ['alt', 'src', 'title', 'href'], 0, '<img alt="…"> は読み上げにも使われます。'],
    ['HTML', 'フォームの入力値をサーバーに送るために必要な属性は？', ['id', 'name', 'class', 'for'], 1, 'name がキーになって送信されます。'],
    ['HTML', '1ページに1つだけ置くのが良いとされるタグは？', ['<h1>', '<p>', '<div>', '<li>'], 0, '最も重要な見出し。'],
    ['CSS', '要素の「内側」の余白はどれ？', ['margin', 'padding', 'border', 'gap'], 1, 'padding は内側、margin は外側。'],
    ['CSS', 'id="title" の要素を選ぶセレクタは？', ['.title', '#title', 'title', '*title'], 1, '# が ID、. が class。'],
    ['CSS', 'flex で主軸方向の並びを決めるプロパティは？', ['align-items', 'justify-content', 'flex-grow', 'position'], 1, 'justify-content = 主軸、align-items = 交差軸。'],
    ['TS', '<code>let n: number = "5";</code> の結果は？', ['5 が入る', '型エラー', 'NaN になる', '実行時エラー'], 1, '文字列は number に代入できません。'],
    ['TS', '<code>number | string</code> のような型を何という？', ['Tuple', 'Enum', 'Union', 'Generics'], 2, '「どれか1つ」を表す Union 型。'],
    ['TS', '外部からは触れず、子クラスからは触れる修飾子は？', ['public', 'protected', 'private', 'readonly'], 1, 'protected = 自分＋子まで。'],
    ['TS', '<code>price?: number</code> の「?」の意味は？', ['必須', '省略可能', '読み取り専用', 'null 禁止'], 1, 'オプショナルプロパティ。'],
    ['TS', '<code>Array&lt;T&gt;</code> の T は何と呼ぶ？', ['型パラメータ', '変数名', '定数', 'クラス名'], 0, 'あとで決まる型の穴。'],
    ['TS', '<code>expect(sum(1, 2)).toBe(3)</code> は AAA のどれ？', ['Arrange', 'Act', 'Assert', 'Await'], 2, '結果の確認 = Assert。'],
    ['Vue', 'リアクティブな値を作る Composition API は？', ['ref()', 'for()', 'new()', 'get()'], 0, '値が変わると画面が自動更新されます。'],
    ['Vue', '親から子へデータを渡す仕組みは？', ['emit', 'props', 'slot', 'router'], 1, '親→子は props、子→親は emit。'],
    ['Vue', 'v-if と v-show の違いは？', ['違いはない', 'v-if は DOM ごと作る/消す、v-show は display で切替', 'v-show は DOM ごと消す', 'v-if は CSS だけ'], 1, '頻繁に切り替えるなら v-show。'],
  ];
  const TCOL = { HTML: 'var(--basic)', CSS: 'var(--pink)', TS: 'var(--ts)', Vue: 'var(--vue)' };

  K.reg({
    id: 'review', track: 'ts', title: '復習クイズ', sub: 'HTML・CSS・TS・Vue', emoji: '🔁',
    scenes: [{
      t: '復習クイズ', tag: QS.length + '問', lead: '全部で <b>' + QS.length + '問</b>。連続正解でストリーク 🔥。間違えた問題だけ再挑戦もできます。',
      render(el) {
        const root = h('div', { class: 'tsx-q' }); el.append(root);
        let pool, idx, score, streak, best, wrong, results;
        const start = (list) => { pool = list; idx = 0; score = 0; streak = 0; best = 0; wrong = []; results = {}; ask(); };
        function ask() {
          if (idx >= pool.length) return finish();
          const [tp, q, opts, a, why] = pool[idx];
          const order = opts.map((_, i) => i).sort(() => Math.random() - .5);
          let done = false;
          const note = h('div', { style: { minHeight: '2.6em' } });
          const nextBtn = h('button', { class: 'btn primary', style: { visibility: 'hidden' }, onclick: () => { idx++; ask(); } }, idx === pool.length - 1 ? '結果を見る ▶' : '次の問題 ▶');
          const optEls = order.map((oi) => h('button', { class: 'tsx-qo', html: opts[oi], onclick: () => {
            if (done) return; const ok = oi === a;
            if (!ok) { optEls.forEach((o, k) => order[k] === a && o.classList.add('ok')); }
            const me = optEls[order.indexOf(oi)]; me.classList.add(ok ? 'ok' : 'bad'); done = true;
            (results[tp] ||= [0, 0])[1]++; if (ok) { score++; streak++; best = Math.max(best, streak); results[tp][0]++; } else { streak = 0; wrong.push(pool[idx]); }
            note.replaceChildren(res(ok, (ok ? '正解！ ' : '残念… ') + why)); nextBtn.style.visibility = 'visible'; head();
          } }));
          const hd = h('div', { class: 'tsx-qh' });
          function head() { hd.replaceChildren(h('span', { class: 'chip', style: { '--c': TCOL[tp] } }, tp), h('div', { class: 'tsx-bar' }, h('i', { style: { width: (idx / pool.length) * 100 + '%' } })), h('b', `${idx + 1}/${pool.length}`), h('span', { class: 'chip', style: { '--c': 'var(--pink)' } }, '🔥 ' + streak), h('span', { class: 'chip', style: { '--c': 'var(--ts)' } }, '⭐ ' + score)); }
          head();
          root.replaceChildren(hd, h('div', { class: 'card', style: { display: 'grid', gap: '10px', animation: 'slide .4s both' } }, h('h3', { html: q }), ...optEls, note, h('div', nextBtn)));
        }
        function finish() {
          const all = score === pool.length;
          const bars = Object.entries(results).map(([t, [c, n]]) => { const b = h('i', { style: { width: '0%', background: TCOL[t] } }); setTimeout(() => (b.style.width = (c / n) * 100 + '%'), 60); return h('div', { class: 'tsx-tb' }, h('span', { style: { color: TCOL[t] } }, t), h('div', { class: 'tsx-bar', style: { background: 'var(--line)' } }, b), h('span', `${c}/${n}`)); });
          root.replaceChildren(h('div', { class: 'card', style: { textAlign: 'center', animation: 'pop .5s both' } },
            h('div', { style: { fontSize: '3rem' } }, all ? '🏆' : score / pool.length >= .7 ? '🎉' : '💪'),
            h('h2', `${score} / ${pool.length} 正解`), h('p', { style: { color: 'var(--mute)' } }, `最高連続正解 🔥 ${best}`), h('div', { style: { textAlign: 'left', margin: '14px 0' } }, lbl('分野別'), bars),
            h('div', { class: 'row', style: { justifyContent: 'center' } }, wrong.length ? h('button', { class: 'btn primary', onclick: () => start(wrong.slice()) }, `❌ 間違えた ${wrong.length} 問を再挑戦`) : null, h('button', { class: 'btn', onclick: () => start(QS.slice().sort(() => Math.random() - .5)) }, '🔁 最初から'))));
          if (all) celebrate();
        }
        start(QS.slice().sort(() => Math.random() - .5));
      },
    }],
  });

  /* ---------- 困りごと → 考え方 → 解決 (+使い分け) : shown above each concept scene ---------- */
  const WHY = {
    'ts-intro': {
      'そのバグ、どこで見つかる？': { problem: '動かしてみるまで、ミスに気づけない。気づくのは本番で…', idea: '「ここには数字だけ」と先に書いておく。間違えたら、書いた瞬間に赤線が出る', answer: 'TypeScript の<b>型</b>', when: [['使い捨ての小さなスクリプト', 'JS のままでもOK'], ['チーム開発・長く育てるアプリ', 'TypeScript が効く']] },
      'TS は JS に変換される': { problem: 'ブラウザは .ts を読めない。型はどうなるの？', idea: '型は「チェック用のメモ」。チェックしたら消して、ふつうの JS にする', answer: '<code>tsc</code>（チェックして JS を作る）', when: '型は実行時には残らない。実行中に入ってきた値の確認は、別のコードが必要。' },
    },
    'ts-basic': {
      '型アノテーションの読み方': { problem: '変数には何でも入る。<code>age</code> に文字が入っても、動かすまで気づけない', idea: '「この箱は数字だけ」と、最初に1回書いておく', answer: '<code>変数名: 型</code>（型アノテーション）', when: [['初期値から型が分かる変数', '書かなくてOK（推論）'], ['関数の引数・戻り値', '必ず書く']] },
      '型の箱に値を入れよう': { problem: '数字のつもりの変数に文字が入ると、計算がおかしくなる（<code>"5" + 3</code> は <code>"53"</code>）', idea: '数字は number、文字は string…と、入れるものごとに箱の種類を先に決めておく', answer: '<code>number</code> / <code>string</code> / <code>boolean</code>', when: [['数・計算', 'number'], ['文字・表示', 'string'], ['はい / いいえ', 'boolean']] },
      'const / let と型推論': { problem: '変数がどこかで上書きされて、値が変わってしまう。でも、変わってほしい値もある', idea: '「変わらない」か「変わる」かを最初に書く。変わらないものは機械が守ってくれる', answer: '<code>const</code>＝再代入禁止 / <code>let</code>＝再代入OK', when: [['再代入しない（ほとんどこれ）', 'const'], ['カウンタ・合計など変化する', 'let'], ['迷ったら', 'まず const']] },
      '型推論：どこまで書く？': { problem: '全部に型を書くと読みにくい。かといって省くと、any になって守れない', idea: '値が入ってくる所（引数）と出ていく所（戻り値）だけ書く。中は推論にまかせる', answer: '引数・戻り値には書く／中の変数には書かない', when: [['関数の引数', '必ず書く'], ['関数の戻り値', '書くのがおすすめ'], ['const x = 10 などローカル', '書かない（推論）']] },
      '配列・タプル・オブジェクト': { problem: 'データの形がバラバラで、何が入っているか分からない', idea: '1つ1つの値ではなく、まとまりの形に型を付ける', answer: '<code>T[]</code> / タプル / <code>interface</code>', when: [['同じ種類が並ぶ', '配列 string[]'], ['位置ごとに意味が違う固定の組', 'タプル'], ['名前付きの項目の集まり', 'オブジェクト（interface）']] },
      'any と unknown': { problem: '<code>any</code> を使うと、チェックが全部止まる。typo も通ってしまう', idea: '分からない値は「何でもOK」にしない。使う前に確かめさせる', answer: '<code>unknown</code> ＋ 型の確認', when: [["本当に何でも通す（できれば避ける）", "any"], ["外から来た値・JSON", "unknown → 確かめる"]] },
      '値がない型：void / undefined / null': { problem: '<code>Cannot read properties of undefined</code> で、実行中に落ちる', idea: '「値がないかも」を型にはっきり書く。使う前に確かめさせる', answer: '<code>string | null</code> と if チェック', when: [['戻り値がない関数', 'void'], ['まだ決まっていない', 'undefined'], ['意図的に「空」', 'null']] },
    },
    'ts-types': {
      'Union：どれか1つ': { problem: '「数字か文字」のどちらかが来る。<code>any</code> にはしたくない', idea: '来てよい型だけを並べる。使うときは if で1つに決める', answer: 'Union 型 <code>A | B</code>', when: [['選択肢が決まっている', 'Union'], ['何が来るか分からない', 'unknown（any は避ける）']] },
      'Enum：名前の付いた定数': { problem: '<code>move(3)</code> の 3 は何？ 読む人が分からない', idea: '数字に名前を付ける（<code>Direction.Left</code> など）', answer: '<code>enum</code> / 文字列 Union', when: [['関連する定数のグループ', 'enum'], ['値が少なく単純', '"up" | "down"（Union）']] },
      'interface：形チェッカー': { problem: 'オブジェクトの項目名を間違えても（<code>nmae</code>）、気づけない', idea: 'オブジェクトの形を先に書いておく。合わなければ赤線が出る', answer: '<code>interface</code>', when: [['必ずある', 'そのまま書く'], ['あってもなくても', '?（省略可）'], ['後から変えない', 'readonly']] },
      'extends と merge': { problem: '似た interface をコピペすると、直し漏れが出る', idea: '共通の部分は1か所に書く。違う所だけ足す', answer: '<code>extends</code>（引き継ぐ）/ 宣言マージ', when: [['自分で拡張したい', 'extends'], ['外部ライブラリの型を補う', '宣言マージ']] },
      'interface vs type': { problem: 'interface と type、どっちを使うか迷う', idea: 'オブジェクトの形か、それ以外かで決める', answer: '目安：オブジェクト → interface ／ それ以外 → type', when: [['オブジェクト・クラスの形', 'interface'], ['Union・タプル・関数型', 'type']] },
    },
    'ts-class': {
      'クラス = 設計図、new = スタンプ': { problem: '同じ形のデータと処理を、何度もコピペしている', idea: '設計図を1つ作って、そこから何個でも作る', answer: '<code>class</code> ＋ <code>new</code>', when: [['同じ形が何個も必要', 'class'], ['1個だけ・データだけ', 'オブジェクトリテラル']] },
      'アクセス修飾子：誰が触れる？': { problem: 'どこからでも書き換えられて、バグの犯人が見つからない', idea: '触れる人を、必要な範囲だけにする', answer: '<code>public</code> / <code>protected</code> / <code>private</code>', when: [['外に公開する窓口', 'public'], ['子クラスにだけ見せる', 'protected'], ['内部のしくみ（基本これ）', 'private']] },
      'readonly：書き換え禁止': { problem: '一度決めた ID が、あとで書き換わってしまう', idea: '変えたくないものは、型で書き換え禁止にする', answer: '<code>readonly</code>', when: [['生成時に決まって不変', 'readonly'], ['途中で変わる', '通常のプロパティ']] },
      'getter / setter：門番を置く': { problem: '<code>private</code> にすると読めない。でも直接書かせると、年齢が -5 になる', idea: '直接は触らせない。窓口（get / set）でチェックしてから通す', answer: '<code>get</code> / <code>set</code>', when: [['チェックが必要・計算で出す値', 'getter / setter'], ['検証不要の単純な値', 'public プロパティでOK']] },
      '継承：親から子へ': { problem: '似たクラスに同じコードをコピペ。直すたびに全部を修正する', idea: '共通の部分は親に、違う所だけ子に書く', answer: '<code>extends</code>（引き継ぐ）＋ <code>abstract</code>', when: [['「A は B の一種」（is-a）', 'extends'], ['「A は B を持っている」（has-a）', 'フィールドで持つ']] },
      'super()：親を呼ぶ': { problem: '子が親の準備を飛ばすと、親の項目が空のまま動く', idea: '親を先に作ってから、子の分を作る', answer: '<code>super(...)</code>', when: '子の constructor では、<code>this</code> を使う前に必ず <code>super()</code> を呼ぶ。' },
    },
    'ts-generics': {
      'Box<T> マシン': { problem: '型ごとに同じ箱を作る（NumberBox、StringBox…）。増えるたびに直す', idea: '型は「あとで決める」ことにして、箱は1つだけ作る', answer: '<code>Box&lt;T&gt;</code>', when: [['形は同じで型だけ違う', 'ジェネリクス'], ['型が1つに決まっている', '普通の型でOK']] },
      'identity<T>：入れた型が出てくる': { problem: '<code>any</code> にすると、入れた型の情報が消える', idea: '入れた型を、そのまま出てくる型にする', answer: '<code>function f&lt;T&gt;(x: T): T</code>', when: [['入れた型＝出てくる型にしたい', '&lt;T&gt;'], ['型を気にしない', 'そもそも関数を見直す']] },
      'Array<T> と制約 extends': { problem: 'T が何でもありだと、<code>.length</code> のような操作ができない', idea: 'T に最低限の条件を付けて、使える操作を決める', answer: '<code>T extends { length: number }</code>', when: [['何でもよい', 'T'], ['ある性質が必要', 'T extends …']] },
    },
    'ts-test': {
      'なぜテストを書くの？': { problem: '手で確認すると、遅いし見落とす。直すたびに別の所が壊れる', idea: '確認する作業を、コードにして自動にする', answer: '単体テスト（Unit Test）', when: [['ロジックのある関数', 'テストを書く'], ['見た目だけの小変更', '手動確認でOK']] },
      'テストの種類': { problem: '全部を画面操作のテストにすると、遅くてすぐ壊れる', idea: '速くて小さいテストをたくさん。遅くて大きいテストは少しだけ', answer: 'テストピラミッド', when: [['関数・ロジック', 'ユニット'], ['モジュールの連携', '結合'], ['ユーザー操作の通し', 'E2E']] },
      'ユニットテストの流れ': { problem: 'いつ、何を確かめればいいか分からず、テストが後回しになる', idea: '決まった順番（設計 → 実行 → 確かめる → 直す → カバレッジ）で回す', answer: 'ユニットテストの流れ', when: '機能ができたあと・バグを直したあと・設計を変えたあとに実行する。' },
      'Vitest をセットアップ': { problem: 'テストを書いても、動かす道具がない', idea: '道具を入れて、1つのコマンドで全部のテストが走るようにする', answer: '<code>npm i -D vitest</code> ＋ <code>npm run test</code>', when: '開発用の道具なので、<code>-D</code>（devDependencies）に入れる。' },
      'TDD：赤 → 緑 → 赤 → 緑': { problem: '作ったあとでテストを書くと、「何を作りたいか」があいまいなまま', idea: '先にテストを書いて「やりたいこと」を決める。そのテストが通るコードを書く', answer: 'Red → Green → Refactor', when: [['やりたいことがはっきりしている', 'TDD が向く'], ['試行錯誤の探索', '後からテストでもOK']] },
      'テストの型：Arrange → Act → Assert': { problem: 'テストごとに書き方がバラバラで、読みにくい', idea: 'どのテストも3段（準備 → 実行 → 確認）にそろえる', answer: 'Arrange（準備）→ Act（実行）→ Assert（確かめる）', when: '1つのテストでは、確認することを1つに絞る。' },
    },
  };

  /* ---------- example illustrations for the 3 why-cards: pv=困りごと / iv=考え方 / av=解決 ---------- */
  const F = (items, loop) => ({ k: 'flow', items, loop });
  const C = (text, o = {}) => Object.assign({ k: 'code', lang: 'ts', text }, o);
  const V = (a, b) => ({ k: 'vs', a, b });
  const ST = (items) => ({ k: 'stack', items });
  const CH = (items) => ({ k: 'chips', items });
  const BG = (i, t) => ({ k: 'big', i, t });
  const MT = (items) => ({ k: 'meter', items });
  const MINI = {
    'ts-intro': {
      'そのバグ、どこで見つかる？': { pv: F(['pencil|書く', 'play|実行', { i: 'bug', t: '本番で発覚', c: 'bad' }]), iv: F(['pencil|型を宣言', { i: 'eye', t: '書く時に見張る', c: 'hi' }, 'check|その場で直す']), av: C('function add(a: number, b: number) {\n  return a + b;\n}\nadd("1", 2); // ✖ 赤線', { err: [4] }) },
      'TS は JS に変換される': { pv: BG('ban', 'ブラウザは .ts を読めない'), iv: F(['shield-check|型をチェック', 'eraser|型を消す', 'file-code|JS にする']), av: F([{ i: 'file-code', t: 'main.ts' }, { i: 'settings', t: 'tsc', c: 'hi' }, { i: 'file-code', t: 'main.js', c: 'ok' }]) },
    },
    'ts-basic': {
      '型アノテーションの読み方': { pv: C('let age = 20;\nage = "twenty";\nage * 2; // NaN', { lang: 'js', err: [3] }), iv: F(['box|箱を作る', 'tag|型の札を付ける', { i: 'eye', t: '中身を見張る', c: 'hi' }]), av: C('let age: number = 20;\nage = "twenty"; // ✖', { err: [2] }) },
      '型の箱に値を入れよう': { pv: V({ i: 'calculator', t: '"5" + 3', s: '"53"（文字がくっつく）' }, { i: 'calculator', t: '5 + 3', s: '8' }), iv: CH([{ t: 'number', c: 'hi' }, { t: 'string', c: 'hi' }, { t: 'boolean', c: 'hi' }]), av: C('let n: number = 5;\nlet s: string = "5";\nlet ok: boolean = true;', { ok: [1, 2, 3] }) },
      'const / let と型推論': { pv: F([{ i: 'pencil', t: 'どこかで上書き', c: 'bad' }, { i: 'bug', t: '値が変わる', c: 'bad' }, { i: 'search', t: '犯人探し…', c: 'warn' }]), iv: F([{ i: 'lock', t: '変わらない → const', c: 'ok' }, { i: 'pencil', t: '変わる → let', c: 'warn' }]), av: C('const tax = 0.1;\ntax = 0; // ✖ 書いた瞬間に止まる\nlet count = 0;\ncount++; // OK', { err: [2] }) },
      '型推論：どこまで書く？': { pv: C('const sum: number = a + b;\nconst label: string = "合計";\nconst ok: boolean = true;', { err: [1, 2, 3] }), iv: F([{ i: 'door-open', t: '入口（引数）', c: 'hi' }, 'cpu|中は推論', { i: 'door-closed', t: '出口（戻り値）', c: 'hi' }]), av: C('function add(a: number, b: number): number {\n  const sum = a + b;\n  return sum;\n}', { ok: [1] }) },
      '配列・タプル・オブジェクト': { pv: C('const row = ["田中", 20, true];\nrow[1].toUpperCase(); // 何が来る？', { lang: 'js', err: [2] }), iv: CH(['list|同じ種類が並ぶ', 'columns-3|位置ごとに型', 'braces|名前付きの項目']), av: C('string[]            // 配列\n[number, string]   // タプル\n{ name: string }   // オブジェクト', { ok: [1, 2, 3] }) },
      'any と unknown': { pv: C('let v: any = "abc";\nv.foo.bar(); // 通ってしまう！', { err: [2] }), iv: V({ i: 'x', t: 'any', s: '何でも通る' }, { i: 'check', t: 'unknown', s: '確かめてから使う' }), av: C('let v: unknown = "abc";\nif (typeof v === "string") {\n  v.toUpperCase(); // OK\n}', { ok: [2, 3] }) },
      '値がない型：void / undefined / null': { pv: C('const u = users.find(isAdmin);\nu.name; // 実行中に落ちる', { lang: 'js', err: [2] }), iv: F(['circle-help|空かも？', 'tag|型にはっきり書く', { i: 'shield-check', t: '使う前に確認', c: 'ok' }]), av: C('let name: string | null = null;\nif (name !== null) {\n  name.length; // OK\n}', { ok: [2, 3] }) },
    },
    'ts-types': {
      'Union：どれか1つ': { pv: C('function show(id: any) {\n  id.toFixed(); // 文字だったら…？\n}', { err: [2] }), iv: CH([{ t: 'number', c: 'hi' }, { t: '|' }, { t: 'string', c: 'hi' }]), av: C('type Id = number | string;\nfunction show(id: Id) {\n  if (typeof id === "string") id.length;\n}', { ok: [3] }) },
      'Enum：名前の付いた定数': { pv: C('move(3); // 3 って何？\nmove(7); // これも通る', { lang: 'js', err: [1] }), iv: F(['hash|数字の 3', 'tag|名前を付ける', { i: 'eye', t: '読める', c: 'ok' }]), av: C('enum Dir { Up, Down, Left, Right }\nmove(Dir.Left); // 意味が分かる', { ok: [2] }) },
      'interface：形チェッカー': { pv: C('const car = { nmae: "Honda" };\ncar.name; // undefined…', { lang: 'js', err: [1] }), iv: F(['ruler|形を先に書く', { i: 'check', t: '合わなければ止める', c: 'ok' }]), av: C('interface Car { name: string }\nconst c: Car = { nmae: "x" }; // ✖', { err: [2] }) },
      'extends と merge': { pv: ST(['copy|Point (x, y)', 'copy|Point3D (x, y, z)', 'copy|Point4D (x, y, z, w)']), iv: F(['box|共通は1か所', 'plus|差分だけ足す']), av: C('interface Point3D extends Point {\n  z: number;\n}', { ok: [1] }) },
      'interface vs type': { pv: BG('circle-help', 'どっちを使う？'), iv: F(['braces|オブジェクトの形', 'split|それ以外']), av: C('interface User { name: string }\ntype Id = number | string;', { ok: [1, 2] }) },
    },
    'ts-class': {
      'クラス = 設計図、new = スタンプ': { pv: ST(['copy|{ name, price }', 'copy|{ name, price }', 'copy|{ name, price }']), iv: F(['ruler|設計図を1つ', 'copy|new で量産']), av: C('class Item {\n  constructor(public name: string) {}\n}\nnew Item("PC");', { ok: [4] }) },
      'アクセス修飾子：誰が触れる？': { pv: F([{ i: 'users', t: '誰でも触れる', c: 'bad' }, { i: 'pencil', t: 'どこでも書き換え', c: 'bad' }, { i: 'search', t: '犯人が不明', c: 'warn' }]), iv: CH([{ t: 'public 誰でも', c: 'warn' }, { t: 'protected 子まで', c: 'hi' }, { t: 'private 自分だけ', c: 'ok' }]), av: C('class Acct {\n  private balance = 0;\n}\nnew Acct().balance; // ✖', { err: [4] }) },
      'readonly：書き換え禁止': { pv: C('user.id = 999; // ID が書き換わる…', { lang: 'js', err: [1] }), iv: F(['lock|変えない物は', 'shield-check|型で禁止']), av: C('class U {\n  readonly id: number = 1;\n}\nu.id = 2; // ✖', { err: [4] }) },
      'getter / setter：門番を置く': { pv: C('acct.age = -5; // 通ってしまう', { lang: 'js', err: [1] }), iv: F(['door-closed|直接は触らせない', 'shield-check|窓口でチェック']), av: C('set age(v: number) {\n  if (v < 0) throw new Error();\n  this._age = v;\n}', { ok: [2] }) },
      '継承：親から子へ': { pv: ST(['copy|Dog: name, move', 'copy|Cat: name, move', 'copy|Bird: name, move']), iv: F(['box|共通は親へ', 'arrow-down|差分だけ子へ']), av: C('class Dog extends Animal {\n  speak() { /* 子だけの処理 */ }\n}', { ok: [1] }) },
      'super()：親を呼ぶ': { pv: C('constructor() {\n  this.id = 1; // 親より先 ✖\n  super();\n}', { err: [2] }), iv: F([{ i: 'user', t: '親が先に完成' }, { i: 'baby', t: 'そのあと子' }]), av: C('constructor(n: string) {\n  super(n);\n  this.id = 1;\n}', { ok: [2] }) },
    },
    'ts-generics': {
      'Box<T> マシン': { pv: ST(['box|NumberBox', 'box|StringBox', 'box|BooleanBox']), iv: F(['circle-help|型はあとで決める', 'box|T 1つで共通']), av: C('class Box<T> {\n  constructor(public v: T) {}\n}\nnew Box<number>(1);', { ok: [4] }) },
      'identity<T>：入れた型が出てくる': { pv: C('function id(x: any): any {\n  return x;\n}\nid(42).toUpperCase(); // 通る…', { err: [4] }), iv: F(['download|型を受け取る', 'upload|同じ型で返す']), av: C('function id<T>(x: T): T {\n  return x;\n}\nid(42).toUpperCase(); // ✖', { err: [4] }) },
      'Array<T> と制約 extends': { pv: C('function len<T>(x: T) {\n  return x.length; // ✖ 無いかも\n}', { err: [2] }), iv: F(['ruler|最低限の条件を付ける', { i: 'check', t: '使える操作が決まる', c: 'ok' }]), av: C('function len<T extends { length: number }>(x: T) {\n  return x.length;\n}', { ok: [1] }) },
    },
    'ts-test': {
      'なぜテストを書くの？': { pv: F([{ i: 'user', t: '手で確認' }, { i: 'clock', t: '遅い', c: 'warn' }, { i: 'bug', t: '見落とす', c: 'bad' }]), iv: F(['pencil|確認をコードに', 'play|自動で何度でも']), av: C('test("isEven", () => {\n  expect(isEven(4)).toBe(true);\n});', { ok: [2] }) },
      'テストの種類': { pv: F([{ i: 'monitor', t: '全部 画面操作' }, { i: 'timer', t: '遅い', c: 'warn' }, { i: 'bug', t: '壊れやすい', c: 'bad' }]), iv: MT([{ t: 'ユニット（多く）', v: .9, c: 'ok' }, { t: '統合（ほどほど）', v: .5, c: 'hi' }, { t: 'E2E（少なく）', v: .2, c: 'warn' }]), av: ST(['monitor|E2E 少し', 'boxes|統合 ほどほど', 'flask-conical|ユニット たくさん']) },
      'ユニットテストの流れ': { pv: BG('circle-help', 'いつ・何を確認する？'), iv: F(['pencil|設計', 'play|実行', 'search|確かめる', 'wrench|直す', 'gauge|カバレッジ'], '直して繰り返す'), av: F([{ i: 'flask-conical', t: 'テスト' }, { i: 'check', t: '全部 緑', c: 'ok' }, { i: 'rocket', t: '安心して公開', c: 'ok' }]) },
      'Vitest をセットアップ': { pv: BG('ban', '動かす環境が無い'), iv: F(['download|入れる', 'settings|scripts に登録', 'play|npm test']), av: C('$ npm i -D vitest\n$ npm run test', { lang: 'sh', ok: [1, 2] }) },
      'TDD：赤 → 緑 → 赤 → 緑': { pv: F([{ i: 'pencil', t: '先に作って' }, { i: 'flask-conical', t: 'あとでテスト' }, { i: 'circle-help', t: 'やりたいことが曖昧', c: 'warn' }]), iv: F([{ i: 'x', t: 'Red 失敗', c: 'bad' }, { i: 'check', t: 'Green 成功', c: 'ok' }, { i: 'sparkles', t: 'Refactor 整える', c: 'hi' }], '繰り返す'), av: C('it("sum(2,3) は 5", …); // 先に書く\nfunction sum(a, b) { … } // あとで書く', { ok: [1] }) },
      'テストの型：Arrange → Act → Assert': { pv: BG('file-text', '書き方がバラバラで読みにくい'), iv: F(['package|Arrange 準備', 'play|Act 実行', 'check|Assert 確認']), av: C('const cart = new Cart();        // 準備\ncart.add(item);                 // 実行\nexpect(cart.total()).toBe(1000); // 確認', { ok: [1, 2, 3] }) },
    },
  };
  const REF = {"ts-intro": {"そのバグ、どこで見つかる？": {"hint": "<b>エラーメッセージの読み方</b><br><code>Argument of type 'string' is not assignable to parameter of type 'number'</code><br>＝「string を number の引数には渡せません」。赤線の上にカーソルを乗せると、同じ文が読めます。"}}, "ts-basic": {"型アノテーションの読み方": {"hint": "<b>用語</b>：アノテーション＝「注釈（ここに型を書く札）」。<code>変数名: 型</code> の「: 型」の部分のことです。"}, "型の箱に値を入れよう": {"ref": [{"title": "型の一覧", "icon": "list", "html": "<table class=\"tsx-tbl\" style=\"width:100%;border-collapse:collapse\"><tr><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">型</th><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">意味</th><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">値の例</th></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>number</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">数値（整数も小数も）</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>42</code>, <code>3.14</code></td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>string</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">文字列</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>\"abc\"</code></td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>boolean</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">はい / いいえ</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>true</code>, <code>false</code></td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>any</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">何でも（チェックなし・避ける）</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">—</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>unknown</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">何か分からない（確かめてから使う）</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">—</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>void</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">戻り値が無い関数</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">—</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>null</code> / <code>undefined</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">空 / まだ無い</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">—</td></tr></table>"}]}}, "ts-class": {"アクセス修飾子：誰が触れる？": {"ref": [{"title": "修飾子まとめ", "icon": "table", "html": "<table class=\"tsx-tbl\" style=\"width:100%;border-collapse:collapse\"><tr><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">修飾子</th><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">クラスの中</th><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">子クラス</th><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">外から</th></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>public</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">○</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">○</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">○</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>protected</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">○</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">○</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">✖</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>private</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">○</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">✖</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">✖</td></tr></table>"}]}, "継承：親から子へ": {"hint": "<b>用語</b>：継承（extends）＝親クラスの機能を<b>引き継ぐ</b>こと。親＝スーパークラス、子＝サブクラスとも呼びます。"}}, "ts-generics": {"Box<T> マシン": {"hint": "<code>&lt;T&gt;</code> の T は Type の頭文字。名前は何でもよく、慣習で <code>T</code>、複数なら <code>T, U</code> や <code>K, V</code>（Key, Value）を使います。"}}, "ts-test": {"ミニテストランナー": {"ref": [{"title": "マッチャー一覧", "icon": "list-checks", "html": "<table class=\"tsx-tbl\" style=\"width:100%;border-collapse:collapse\"><tr><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">マッチャー</th><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">確かめること</th></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>toBe(x)</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">同じ値（===）</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>toEqual(x)</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">中身が同じ（オブジェクト・配列）</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>toBeTruthy()</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">真っぽい値</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>toBeGreaterThan(n)</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">n より大きい</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>toContain(x)</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">配列・文字列に含まれる</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>toThrow()</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">エラーが投げられる</td></tr></table>"}]}, "テストの型：Arrange → Act → Assert": {"hint": "<b>テスト名の付け方</b>：「何をしたら、どうなる」を日本語で書くと、失敗した時に何が壊れたか一目で分かります。例：<code>商品を追加すると合計が出る</code>"}}};
  Object.entries(REF).forEach(([id, m]) => { const L = K.lessons[id]; if (!L) return; L.scenes.forEach((sc) => { if (m[sc.t]) Object.assign(sc, m[sc.t]); }); });
  const HINT = {"ts-intro": {"実践：赤線を消そう": {"hint": "<b>ヒント</b>：エラー文は「string を number の引数には渡せません」の意味。<code>\"1\"</code> は文字、<code>1</code> は数字です。<br><b>おまけ</b>：<code>add(\"1\", 2)</code> のままにして、関数の型を <code>any</code> に変えると赤線は消えます。でも型を捨てるのはおすすめしません。"}}, "ts-basic": {"実践：型エラーを全部直そう": {"hint": "<b>ヒント</b>：赤線の理由は「型と値が合っていない」だけ。<code>\"5\"</code> は文字、<code>5</code> は数字。値を直すか、型を <code>number | string</code> のように広げます。<br><b>おまけ</b>：<code>any</code> にすれば消えますが、ミッションでは使わないでね。"}}, "ts-types": {"実践：型を設計しよう": {"hint": "<b>ヒント</b>：<code>Status</code> に入れられるのは <code>\"todo\" | \"doing\" | \"done\"</code> の3つだけ。<br><b>おまけ</b>：<code>assignee</code> を使ったタスクをもう1つ作ってみよう。"}}, "ts-class": {"実践：private の壁を越えよう": {"hint": "<b>ヒント</b>：<code>private</code> は「そのクラスの中だけ」。子クラスにも見せたいときは <code>protected</code>。外から見せたくなければ <code>protected</code> のままで OK。"}}, "ts-generics": {"実践：any を T に置き換えよう": {"hint": "<b>ヒント</b>：<code>T</code> は「あとで決まる型」。引数が <code>T[]</code>（T の配列）なら、戻り値も <code>T</code> にできます。"}}, "ts-test": {"実践：テストを書こう": {"hint": "<b>ヒント</b>：テストは <code>it(\"名前\", function(){ expect(実際の値).toBe(期待する値); });</code>。test.html のいちばん下に1行足せば OK。<br><b>おまけ</b>：<code>multiply(0, 5)</code> のテストも足してみよう。"}, "ミニテストランナー": {"answer": {"code": "// 18歳「以上」なので >= にする\nfunction isAdult(age) {\n  return age >= 18;\n}\n", "lang": "js", "file": "isAdult.js"}, "hint": "<b>ヒント</b>：「18歳以上」は 18 を<b>含みます</b>。<code>&gt;</code> と <code>&gt;=</code> の違いを見よう（境界値のテスト）。"}}};
  Object.entries(HINT).forEach(([id, m]) => { const L = K.lessons[id]; if (!L) return; L.scenes.forEach((sc) => { if (m[sc.t]) Object.assign(sc, m[sc.t]); }); });
  Object.entries(WHY).forEach(([id, m]) => { const L = K.lessons[id]; if (!L) return; L.scenes.forEach((sc) => { if (m[sc.t]) sc.why = Object.assign({}, m[sc.t], (MINI[id] || {})[sc.t] || {}); }); });
})();
