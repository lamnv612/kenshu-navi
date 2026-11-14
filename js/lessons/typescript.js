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
  const tsPractice = (starter, missions, solution, title, help, extra) => playground({
    title: title || 'TypeScript', mode: 'ts', files: [{ name: 'main.ts', lang: 'ts', code: starter }],
    solution: { 'main.ts': solution + (extra || []).map((e) => e.sol || '').join('') },
    tasks: (v, c) => {
      const ed = v['main.ts'] !== starter;
      const base = missions(v, c, ed).map((t, i) => (help && help[i] ? Object.assign({}, t, { hint: help[i].hint, answer: { code: applyFix(starter, help[i].fix), lang: 'ts', mode: 'replace' } }) : t));
      const more = (extra || []).map((e) => ({ optional: true, level: e.level, label: e.label, hint: e.hint, ok: ed && !!e.ok(v, c), answer: { code: e.code, lang: 'ts', mode: 'replace' } }));
      return base.map((t) => (t.optional ? Object.assign({ level: 1 }, t, { label: String(t.label).replace(/^任意：/, '') }) : t)).concat(more);
    },
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

  function readonlySceneGap(el) {
    const src = 'class Person {\n  private readonly name: string;\n  age: number;\n\n  constructor(name: string, age: number) {\n    this.name = name;     // ① 最初の代入はOK\n    this.age = age;\n  }\n\n  update(): void {\n    this.name = "他人";   // ② 後から変更 → エラー\n  }\n}';
    const pre = code(src, 'ts', { dim: true, color: 'var(--ts)' }), box = h('div', { class: 'gap-inst' }), msg = h('div');
    const lk = h('span', { style: { display: 'none', color: 'var(--bad)' } }, ico('lock')), nm1 = h('span', 'name'), f1 = h('div', { class: 'f' }, h('span', nm1, ' ', lk), h('em', '?')), f2 = h('div', { class: 'f' }, 'age', h('em', '?'));
    box.append(h('div', { class: 'label' }, 'インスタンス'), f1, f2);
    const IN = [[], [2], [6], [7], [11]];
    el.append(stepper({
      color: 'var(--ts)',
      steps: [{ say: '<b>readonly</b> = 読み取り専用。<b>private</b> と組み合わせるのが定番。' }, { say: '<b>① constructor</b> の中なら代入できる（ここで最初の値を決める）。' }, { say: 'age は readonly ではないので、いつでも変更OK。' }, { say: '<b>② update()</b> で name を書き換えようとすると…？' }, { say: '✖ <b>エラー！</b> 「変わらないデータ」「外からの書き換え防止」「データの矛盾を防ぐ」のに役立つ。' }],
      init(vis) { vis.append(h('div', { class: 'split wide-l' }, pre, h('div', { class: 'col r2b-fillcol' }, box, msg))); },
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
      init(vis) { vis.append(h('div', { class: 'split wide-l' }, pre, h('div', { class: 'col r2b-fillcol' }, box, out, msg))); },
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
      unit: { n: 'ユニットテスト', ic: 'flask-conical', c: 'var(--basic)', d: 'いちばん小さい単位（関数）だけを確かめる。速くてたくさん書ける。今日の主役！', ex: '<code>isAdult(18)</code> が false を返してしまう（18歳は成人のはず）', m: [95, 15, 90], when: 0 },
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
    const Q = [['<code>isAdult(18)</code> が false を返してしまう（18歳は成人のはず）', 'unit', '1つの関数の中の間違い → ユニットテスト'], ['カートの合計を決済モジュールに渡すと、0 円になる', 'int', '部品と部品の「つなぎ目」の間違い → 統合テスト'], ['ログインしたあと、画面で購入ボタンが押せない', 'e2e', '画面を通した操作の流れ → E2E テスト'], ['先週直したバグが、機能を足したあとに再発した', 'reg', '前に動いていたものが壊れた → 回帰テスト'], ['依頼者が「請求書の形式が要件と違う」と言った', 'uat', '依頼したものと合っているか → 受け入れテスト']];
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
  }

  function flowTestScene(el) {
    const N = [['clipboard-list', 'テストケース作成'], ['play', 'テスト実行'], ['search', '結果を確かめる'], ['hammer', 'バグ修正'], ['gauge', 'カバレッジ評価']];
    const SAY = ['各ユニットが期待どおり動くか確認する<b>テストを設計</b>する。', 'テストを実行し、<b>実際の出力と期待</b>を比べる。', '<b>成功と失敗</b>を確認。失敗は原因を調べる。', '見つけたバグを直して、<b>もう一度</b>テスト。', 'カバレッジ（テストがコードをどれだけ通ったか）をもれなく確認。足りなければ<b>ケースを追加</b>して最初へ。'];
    const nodes = N.map(([ic, t]) => h('div', { class: 'nd' }, ico(ic), t)), loop = h('div', { class: 'loop' }), flow = h('div', { class: 'gap-flow' }, nodes, loop);
    const det = h('div', { style: { minHeight: '120px' } });
    const rowOf = (items) => h('div', { class: 'tsx-tl' }, items.map(([t, k, m]) => h('div', { class: 'tsx-t ' + k }, h('i', k === 'ok' ? '✓' : k === 'ng' ? '✖' : '·'), t, m ? h('em', m) : null)));
    const DET = [
      () => code('test("20歳は成人", () => {\n  expect(isAdult(20)).toBe(true);\n});\ntest("17歳は未成年", () => {\n  expect(isAdult(17)).toBe(false);\n});\ntest("18歳ちょうどは成人", () => {\n  expect(isAdult(18)).toBe(true);   // 境界の値\n});', 'ts', { file: 'isAdult.test.ts', color: 'var(--ts)' }),
      () => rowOf([['isAdult(20)', 'ok', '期待 true / 実際 true'], ['isAdult(17)', 'ok', '期待 false / 実際 false']]),
      () => h('div', { class: 'col' }, rowOf([['isAdult(20)', 'ok', ''], ['isAdult(17)', 'ok', ''], ['isAdult(18)', 'ng', '期待 true / 実際 false']]), code('function isAdult(age: number) {\n  return age > 18;   // ← 18 のとき false になる（バグ）\n}', 'ts', { file: 'isAdult.ts（今の実装）', color: 'var(--bad)', hi: [2] })),
      () => h('div', { class: 'col' }, code('function isAdult(age: number) {\n  return age >= 18;   // ← 18歳も成人！ > を >= に直す\n}', 'ts', { file: 'isAdult.ts（直した後）', color: 'var(--basic)', hi: [2] }), rowOf([['isAdult(20)', 'ok', ''], ['isAdult(17)', 'ok', ''], ['isAdult(18)', 'ok', '期待 true / 実際 true']])),
      () => h('div', { class: 'col' }, h('div', { class: 'gap-m', style: { '--w': '70%', gridTemplateColumns: '120px 1fr' } }, 'カバレッジ 70%', h('i')), rowOf([['異常な値 isAdult(-1)', 'wait', 'ケース追加 → 100% へ']])),
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
      ['isAdult.ts ＋ isAdult.test.ts', 'ts', '// src/example/isAdult.ts\nexport default function isAdult(age: number): boolean {\n  return age >= 18;\n}\n\n// __test__/isAdult.test.ts\nimport { expect, test } from "vitest";\nimport isAdult from "@/example/isAdult";\n\ntest("isAdult", () => {\n  expect(isAdult(20)).toBe(true);\n  expect(isAdult(17)).toBe(false);\n});'],
      ['Terminal', 'sh', '$ npm run test\n\n ✓ __test__/isAdult.test.ts (1 test)\n   ✓ isAdult\n\n Test Files  1 passed (1)\n      Tests  1 passed (1)'],
    ];
    const host = h('div');
    const MS = [['toBe', 'expect(isAdult(20)).toBe(true)', () => Object.is(true, true)], ['toEqual', 'expect({a:1}).toEqual({a:1})', () => true], ['toBeTruthy', 'expect("abc").toBeTruthy()', () => !!'abc'], ['toBeGreaterThan', 'expect(10).toBeGreaterThan(3)', () => 10 > 3], ['toContain', 'expect([1,2,3]).toContain(2)', () => [1, 2, 3].includes(2)], ['toThrow', 'expect(() => { throw new Error() }).toThrow()', () => { try { (() => { throw new Error(); })(); return false; } catch { return true; } }]];
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
      steps: [{ say: '<b>① インストール</b>：プロジェクト内で <code class="i">npm install -D vitest</code>（-D = 開発用）。' }, { say: '<b>② scripts に test を追加</b>：これで <code class="i">npm run test</code> が使える。' }, { say: '<b>③ 関数とテストを書く</b>：isAdult が 20 → true、17 → false を確認。' }, { say: '<b>④ 実行！</b> 緑のチェックが出れば合格。変更のたびに一瞬で再確認できる。' }],
      init(vis) { vis.append(host); },
      update(n) { const [f, l, c] = FILES[n]; host.replaceChildren(code(c, l, { file: f, color: n === 3 ? 'var(--ok)' : 'var(--ts)', hi: n === 1 ? [6] : n === 3 ? [3, 4] : null })); },
    }), h('div', { class: 'split r2b-top', style: { marginTop: '18px' } }, h('div', { class: 'col' }, lbl('マッチャー（クリックで判定）'), mg), h('div', { class: 'col' }, lbl('なぜ自動テスト？ 目視 vs テスト'), race, go)));
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
          const st = { name: 'TS', bad: false }; let ts, jsC, curN = 0, API = null, busy = false;
          const tsHost = h('div'), jsHost = h('div');
          const build = () => {
            const a = st.bad ? '123' : JSON.stringify(st.name || '');
            ts = code(`function greet(name: string): string {\n  return "Hello " + name;\n}\ngreet(${a});`, 'ts', { file: 'main.ts', color: 'var(--ts)' });
            jsC = code(`function greet(name) {\n  return "Hello " + name;\n}\ngreet(${a});`, 'js', { file: 'main.js', color: 'var(--team)' });
            tsHost.replaceChildren(ts); jsHost.replaceChildren(jsC);
          };
          const gear = h('div', { class: 'tsx-gear' }, h('b', icon('settings')), 'tsc', h('div', { style: { fontSize: '.75rem', color: 'var(--mute)' } }, '型チェック'));
          const a1 = h('div', { class: 'tsx-arrow' }, icon('arrow-right')), a2 = h('div', { class: 'tsx-arrow' }, icon('arrow-right'));
          const out = h('div', { class: 'fo2-out' });
          const apply = (n) => {
            curN = n; build();
            const bad = st.bad;
            ts.setHi(n === 1 ? [1] : n === 2 ? [4] : [], bad && n === 2 ? 'err' : 'on'); ts.classList.toggle('dim', n === 1 || n === 2);
            gear.classList.toggle('on', n === 2); a1.classList.toggle('on', n >= 2); a2.classList.toggle('on', n >= 3 && !bad);
            jsHost.className = n >= 3 && !bad ? '' : 'tsx-ghost';
            if (n === 3 && !bad) { jsC.setHi([4]); jsC.classList.add('dim'); }
            const L = (t, c) => h('div', { class: c || '' }, t);
            const rows = [];
            if (n >= 2) { rows.push(L('$ tsc main.ts', 'mu')); rows.push(bad ? L("error TS2345: Argument of type 'number' is not assignable to parameter of type 'string'.", 'er') : L('エラーなし → main.js ができた')); }
            if (n >= 3) { rows.push(L('$ node main.js', 'mu')); rows.push(bad ? L('（型エラーで止まった。JS は作られず、実行もされない）', 'er') : L('Hello ' + st.name)); }
            out.className = 'fo2-out' + (n >= 3 ? (bad ? ' e' : ' ok') : '');
            out.replaceChildren(...(rows.length ? rows : [h('span', { class: 'mu' }, '▶ 「次へ」か「実行」で、tsc → node の順に進む')]));
          };
          const nameIn = h('input', { class: 'fo2-in', value: st.name, maxlength: 12, 'aria-label': 'greet に渡す名前', oninput: () => { st.name = nameIn.value; apply(curN); } });
          const badBtn = h('button', { class: 'btn', 'aria-pressed': 'false', onclick: () => { st.bad = !st.bad; badBtn.classList.toggle('primary', st.bad); badBtn.setAttribute('aria-pressed', st.bad); nameIn.disabled = st.bad; apply(curN); } }, icon('triangle-alert'), '型ミス greet(123)');
          const play = h('button', { class: 'btn primary', style: { '--c': 'var(--ts)' }, onclick: async () => { if (busy || !API) return; busy = true; for (let i = 0; i < 4; i++) { API.go(i); await sleep(1100); } busy = false; } }, icon('play'), '実行（通し）');
          el.append(h('div', { class: 'fo2-ctl' }, h('span', { class: 'fo2-k' }, 'greet('), nameIn, h('span', { class: 'fo2-k' }, ')'), badBtn, play));
          el.append(stepper({
            color: 'var(--ts)',
            steps: [{ say: '私たちが書くのは <b>.ts</b> ファイル。' }, { say: '<b>: string</b> が「型アノテーション」。JS には無い部分。' }, { say: '<b>tsc</b> が呼び出しを型チェック。間違いがあれば、ここでエラー。' }, { say: '型が消えて普通の <b>.js</b> に。実行時は型は存在しない！（型ミスだとここまで来られない）' }],
            init(vis, api) { API = api; vis.append(h('div', { class: 'tsx-pipe' }, tsHost, a1, gear, a2, jsHost), h('div', { style: { marginTop: '12px' } }, lbl('ターミナルの出力'), out)); },
            update(n) { apply(n); },
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
          ], "function add(a: number, b: number): number {\n  return a + b;\n}\n\nconsole.log(add(1, 2));\n\n// 任意チャレンジ\nfunction toNum(x: number | string): number {\n  return typeof x === \"string\" ? parseInt(x) : x;\n}\nfunction addLoose(a: number | string, b: number | string): number {\n  return toNum(a) + toNum(b);\n}\nconsole.log(addLoose(\"1\", 2)); // 3\n", 'TypeScript', [{"hint": ["赤線にカーソルを乗せて、エラー文を読もう。「string を number に渡せない」と言っているよ。", "add に渡している \"1\" は文字。数字にするには？"], "fix": [["add(\"1\", 2)", "add(1, 2)"]]}, {"hint": ["\"1\" と 1 の違いは「引用符（\"）」があるかどうか。", "\"1\" の引用符を外して 1 にしよう。"], "fix": [["add(\"1\", 2)", "add(1, 2)"]]}, {"hint": ["直したら右上の「▶ 実行」を押そう。", "1 + 2 の答えは 3。console に 3 と出れば OK。"], "fix": [["add(\"1\", 2)", "add(1, 2)"]]}, {"hint": ["引数の型を「文字か数字」にするには？（Union 型）", "function addLoose(a: number | string, b: number | string): number { … }。中では typeof x === \"string\" ? parseInt(x) : x のように、文字を数字に直してから足そう。"], "fix": "function add(a: number, b: number): number {\n  return a + b;\n}\n\n// ここを直す：赤線が出ているよ\nconsole.log(add(1, 2));\n\n// 任意チャレンジ\nfunction toNum(x: number | string): number {\n  return typeof x === \"string\" ? parseInt(x) : x;\n}\nfunction addLoose(a: number | string, b: number | string): number {\n  return toNum(a) + toNum(b);\n}\nconsole.log(addLoose(\"1\", 2)); // 3\n"}], [{ level: 2, label: "数字の配列を受け取る sum(nums) を作って、sum([1, 2, 3]) で 6 を出す", hint: ["配列の型は「型[]」と書く。number の配列は？", "function sum(nums: number[]): number { … }。合計は reduce か for ループで。"], ok: (v, c) => /\bsum\s*\(/.test(nc(v)) && /number\s*\[\s*\]|Array\s*<\s*number\s*>/.test(nc(v)) && ranOk(c, (t) => t.some((x) => x.trim() === '6')), code: "function add(a: number, b: number): number {\n  return a + b;\n}\n\nconsole.log(add(1, 2));\n\nfunction sum(nums: number[]): number {\n  return nums.reduce((acc, n) => acc + n, 0);\n}\nconsole.log(sum([1, 2, 3])); // 6\n", sol: "\n// 中級チャレンジ：配列を受け取る\nfunction sum(nums: number[]): number {\n  return nums.reduce((acc, n) => acc + n, 0);\n}\nconsole.log(sum([1, 2, 3])); // 6\n" }, { level: 3, label: "関数の型 type BinaryOp を作り、const mul: BinaryOp で掛け算して mul(3, 4) = 12 を出す", hint: ["関数そのものにも型が付く。(a: number, b: number) => number が「2つの数字から1つの数字」。", "type BinaryOp = (a: number, b: number) => number; のあと const mul: BinaryOp = (a, b) => a * b;"], ok: (v, c) => /type\s+BinaryOp\s*=\s*\(\s*\w+\s*:\s*number\s*,\s*\w+\s*:\s*number\s*\)\s*=>\s*number/.test(nc(v)) && /\bmul\s*:\s*BinaryOp/.test(nc(v)) && ranOk(c, (t) => t.some((x) => x.trim() === '12')), code: "function add(a: number, b: number): number {\n  return a + b;\n}\n\nconsole.log(add(1, 2));\n\ntype BinaryOp = (a: number, b: number) => number;\nconst mul: BinaryOp = (a, b) => a * b;\nconsole.log(mul(3, 4)); // 12\n", sol: "\n// 上級チャレンジ：関数の型\ntype BinaryOp = (a: number, b: number) => number;\nconst mul: BinaryOp = (a, b) => a * b;\nconsole.log(mul(3, 4)); // 12\n" }]));
        },
      },
    ],
  });

  /* ================= ts-basic: ライブコードラボ（読む・書き換える・結果が出る） ================= */
  style('tslab', `
  .tslab{display:grid;gap:10px}
  .tslab-story,.tslab-try{display:flex;gap:10px;align-items:flex-start;padding:.65em 1em;border-radius:8px;font-size:.875rem;line-height:1.75}
  .tslab-story{background:color-mix(in srgb,var(--bad) 10%,var(--card));border:1px dashed color-mix(in srgb,var(--bad) 55%,transparent);font-weight:700}
  .tslab-try{background:color-mix(in srgb,var(--ts) 10%,var(--card));border:1px solid color-mix(in srgb,var(--ts) 40%,var(--line))}
  .tslab-story .ic,.tslab-try .ic{flex:none;margin-top:.3em;width:16px;height:16px}.tslab-story .ic{color:var(--bad)}.tslab-try .ic{color:var(--ts)}
  .tslab-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:12px;align-items:start}
  @media(max-width:900px){.tslab-grid{grid-template-columns:1fr}}
  .tslab-ed{border:1px solid var(--line);border-radius:8px;overflow:hidden;background:var(--code)}
  .tslab-ed .ed{min-height:180px}
  .tslab-ed .ed pre .ln.tslab-cur{background:color-mix(in srgb,var(--ts) 28%,transparent);box-shadow:inset 3px 0 0 var(--ts)}
  .tslab-bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;padding:8px 10px;background:var(--card);border-top:1px solid var(--line)}
  .tslab-bar .sp{flex:1}
  .tslab-bar .btn{padding:.35em .9em;font-size:.8125rem}
  .tslab-side{display:grid;gap:10px;min-width:0}
  .tslab-box{border:1px solid var(--line);border-radius:8px;background:var(--card);overflow:hidden}
  .tslab-box>h5{margin:0;padding:.35em .8em;font:800 .75rem var(--font);letter-spacing:.06em;color:var(--mute);background:var(--bg2);border-bottom:1px solid var(--line);display:flex;gap:.5em;align-items:center}
  .tslab-box>h5 .ic{width:14px;height:14px}.tslab-box>h5 em{margin-left:auto;font-style:normal;font-weight:700;color:var(--mute)}
  .tslab-box .bd2{padding:.55em .8em;font:700 .8125rem/1.7 var(--mono);display:grid;gap:5px;min-height:2.4em}
  .tslab-ok{color:var(--ok)}
  .tslab-err{display:grid;gap:2px;padding:.4em .6em;border-radius:6px;background:color-mix(in srgb,var(--bad) 14%,var(--code));border-left:3px solid var(--bad);color:#ffd5da;word-break:break-word}
  .tslab-err small{color:var(--text);opacity:.8;font:700 .75rem var(--font)}
  .tslab-tip{padding:.4em .6em;border-radius:6px;background:color-mix(in srgb,var(--team) 14%,var(--code));border-left:3px solid var(--team);color:var(--text);font:700 .75rem/1.7 var(--font)}
  .tslab-chips{display:flex;gap:6px;flex-wrap:wrap}
  .tslab-chip{display:inline-flex;gap:.45em;align-items:center;padding:.1em .6em;border-radius:6px;border:1px solid var(--line);background:var(--bg2);font:700 .8125rem var(--mono)}
  .tslab-chip i{font-style:normal;color:var(--mute);font:600 .6875rem var(--font)}
  .tslab-chip b{color:var(--ts)}.tslab-chip.w{border-color:var(--ts)}.tslab-chip.inf{border-style:dashed}
  .tslab-vars{display:grid;grid-template-columns:auto 1fr;gap:2px 12px}
  .tslab-vars .k{color:var(--ts)}.tslab-vars .v{color:var(--text);word-break:break-all}.tslab-vars .v.ch{color:var(--team);text-shadow:0 0 12px color-mix(in srgb,var(--team) 60%,transparent)}
  .tslab-log{padding:.4em .6em;border-radius:6px;background:var(--code);color:#cfd5ff;white-space:pre-wrap;word-break:break-word}
  .tslab-rerr{padding:.4em .6em;border-radius:6px;background:color-mix(in srgb,var(--bad) 22%,var(--code));color:#ffd5da;word-break:break-word}
  .tslab-rerr small{display:block;font:700 .75rem var(--font);opacity:.85}
  .tslab-stale{opacity:.5}
  .tslab-note{font:700 .75rem var(--font);color:var(--mute)}
  .tslab-legend{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
  .tslab-legend>div{padding:.55em .8em;border-radius:8px;background:var(--card);border:1px solid var(--line);border-top:3px solid var(--lc);display:grid;gap:2px}
  .tslab-legend code{font:800 .9375rem var(--mono);color:var(--lc)}.tslab-legend small{color:var(--mute);font-weight:700;font-size:.75rem}
  @media(max-width:700px){.tslab-legend{grid-template-columns:1fr 1fr}}
  `);

  const INFER_LIB = 'interface Array<T>{length:number;push(...i:T[]):number;map<U>(f:(v:T)=>U):U[];forEach(f:(v:T,i:number)=>void):void} interface ReadonlyArray<T>{readonly length:number} interface Boolean{} interface Function{} interface CallableFunction extends Function{} interface NewableFunction extends Function{} interface IArguments{} interface RegExp{} interface Number{toFixed(n?:number):string} interface Object{} interface String{length:number;toUpperCase():string} interface TemplateStringsArray extends ReadonlyArray<string>{} declare const console:{log(...a:any[]):void}; declare const JSON:{parse(s:string):any;stringify(v:any):string}; declare const Math:{round(n:number):number}; declare function Number(v:any):number; declare function String(v:any):string;';
  const GLOSS = [
    [/Cannot assign to '(.+?)' because it is a constant/, (m) => `const の ${m[1]} は、あとから入れ直せない`],
    [/Argument of type '(.+?)' is not assignable to parameter of type '(.+?)'/, (m) => `${m[1]} は、${m[2]} の引数には渡せない`],
    [/Type '(.+?)' is not assignable to type '(.+?)'/, (m) => `${m[1]} の値は、${m[2]} の箱には入れられない`],
    [/Parameter '(.+?)' implicitly has an 'any' type/, (m) => `${m[1]} の型が決まらない（any になる）。ここは型を書く`],
    [/'(.+?)' is possibly '(null|undefined)'/, (m) => `${m[1]} は ${m[2]} かもしれない。確かめてから使う`],
    [/'(.+?)' is of type 'unknown'/, (m) => `${m[1]} は unknown。typeof などで確かめるまで使えない`],
    [/Property '(.+?)' does not exist on type '(.+?)'/, (m) => `${m[2]} に「${m[1]}」という項目は無い`],
  ];
  const gloss = (msg) => { for (const [re, f] of GLOSS) { const m = msg.match(re); if (m) return f(m); } return ''; };
  const RGLOSS = [
    [/Assignment to constant variable/, () => 'const に入れ直そうとして落ちた（TS は書いた瞬間に教えてくれていた）'],
    [/Cannot read properties of (undefined|null) \(reading '(.+?)'\)/, (m) => `${m[1]} の中の「${m[2]}」を読もうとして落ちた（値が無い）`],
    [/ループが長すぎます/, () => 'ずっと終わらないので止めた'],
  ];
  const fmtVal = (v) => { if (v === undefined) return 'undefined'; if (typeof v === 'string') return JSON.stringify(v); if (typeof v === 'number' || typeof v === 'boolean') return String(v); if (typeof v === 'function') return 'ƒ'; try { return JSON.stringify(v); } catch (e) { return String(v); } };

  /* 宣言した型（書いた / 推論）を取り出す */
  function inferTypes(ts, src) {
    try {
      const files = { '/lib.d.ts': INFER_LIB, '/main.ts': src };
      const opts = { strict: true, target: ts.ScriptTarget.ES2020, noLib: true, types: [], module: ts.ModuleKind.ESNext, noEmit: true };
      const host = {
        getSourceFile: (f, l) => (files[f] != null ? ts.createSourceFile(f, files[f], l, true) : undefined),
        getDefaultLibFileName: () => '/lib.d.ts', writeFile() {}, getCurrentDirectory: () => '/', getDirectories: () => [],
        fileExists: (f) => files[f] != null, readFile: (f) => files[f], getCanonicalFileName: (f) => f, useCaseSensitiveFileNames: () => true, getNewLine: () => '\n',
      };
      const p = ts.createProgram(['/lib.d.ts', '/main.ts'], opts, host), sf = p.getSourceFile('/main.ts'), ck = p.getTypeChecker();
      const out = [];
      const ln = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
      const visit = (n) => {
        if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name)) out.push({ line: ln(n), name: n.name.text, type: ck.typeToString(ck.getTypeAtLocation(n.name)), written: !!n.type });
        else if (ts.isParameter(n) && ts.isIdentifier(n.name)) out.push({ line: ln(n), name: n.name.text, type: ck.typeToString(ck.getTypeAtLocation(n.name)), written: !!n.type });
        else if (ts.isFunctionDeclaration(n) && n.name) { const sig = ck.getSignatureFromDeclaration(n); if (sig) out.push({ line: ln(n), name: n.name.text + '()', type: ck.typeToString(ck.getReturnTypeOfSignature(sig)), written: !!n.type }); }
        ts.forEachChild(n, visit);
      };
      visit(sf);
      return out;
    } catch (e) { return []; }
  }

  /* 1行ごとの変数の中身を記録して実行する */
  function instrument(ts, src) {
    const sf = ts.createSourceFile('/m.ts', src, ts.ScriptTarget.ES2020, true);
    const ins = [], names = [];
    const line = (pos) => sf.getLineAndCharacterOfPosition(pos).line + 1;
    const snap = (ln, extra) => '__s(' + ln + ',{' + names.concat(extra || []).map((n) => JSON.stringify(n) + ':' + n).join(',') + '});';
    const declNames = (list) => list.declarations.filter((d) => ts.isIdentifier(d.name)).map((d) => d.name.text);
    const isLoop = (n) => ts.isForStatement(n) || ts.isWhileStatement(n) || ts.isDoStatement(n) || ts.isForInStatement(n) || ts.isForOfStatement(n);
    sf.statements.forEach((st) => {
      if (isLoop(st) && ts.isBlock(st.statement)) {
        const extra = ts.isForStatement(st) && st.initializer && ts.isVariableDeclarationList(st.initializer) ? declNames(st.initializer) : [];
        ins.push({ pos: st.statement.end - 1, text: '\n;if(++__n>3000)throw new Error("ループが長すぎます");' + snap(line(st.getStart(sf)), extra) + '\n' });
      }
      if (ts.isVariableStatement(st)) names.push(...declNames(st.declarationList));
      if (ts.isFunctionDeclaration(st) || ts.isInterfaceDeclaration(st) || ts.isTypeAliasDeclaration(st)) return;
      ins.push({ pos: st.end, text: '\n;' + snap(line(st.getStart(sf))) });
    });
    let out = src;
    ins.sort((a, b) => b.pos - a.pos).forEach((i) => { out = out.slice(0, i.pos) + i.text + out.slice(i.pos); });
    return out;
  }
  function execute(ts, src) {
    const snaps = [], logs = []; let err = null, code2 = src;
    try { code2 = instrument(ts, src); } catch (e) { code2 = src; }
    const js = ts.transpileModule(code2, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.None } }).outputText;
    const fmt = (a) => a.map((x) => (typeof x === 'string' ? x : fmtVal(x))).join(' ');
    const con = { log: (...a) => logs.push(fmt(a)), error: (...a) => logs.push(fmt(a)) };
    const sn = (ln, vars) => { const c = {}; Object.keys(vars).forEach((k) => (c[k] = fmtVal(vars[k]))); snaps.push({ line: ln, vars: c, logs: logs.length }); };
    try { new Function('console', '__s', 'let __n=0;' + js)(con, sn); } catch (e) { err = String(e && e.message || e); }
    return { snaps, logs, err };
  }

  /* o: { src, coach?(src)=>[tip], actions:[{label, icon, apply(src)}] , height } */
  function lab(o) {
    const root = h('div', { class: 'tslab-grid' });
    let ts = null, rr = null, step = -1, stale = false, timer = 0, token = 0;
    const ed = codeEditor(o.src, 'ts', () => { stale = true; paintOut(); clearTimeout(timer); timer = setTimeout(check, 350); });
    { const nl = o.src.split('\n').length; ed.style.minHeight = (o.height || Math.min(430, 34 + nl * 24)) + 'px'; ed.style.maxHeight = '430px'; }
    const chk = h('div', { class: 'bd2' }), inf = h('div', { class: 'bd2' }), out = h('div', { class: 'bd2' });
    const lbl2 = h('em', ''), stepLbl = h('span', { class: 'tslab-note' });
    const curLine = (n) => ed.querySelectorAll('pre .ln').forEach((x, i) => x.classList.toggle('tslab-cur', i === n - 1));
    const prev = h('button', { class: 'btn ghost', title: '1つ前の行へ', onclick: () => go(step - 1) }, icon('chevron-left'));
    const next = h('button', { class: 'btn ghost', title: '次の行へ', onclick: () => go(step + 1) }, icon('chevron-right'));
    const runBtn = h('button', { class: 'btn primary', onclick: () => run() }, icon('play'), '実行');
    const bar = h('div', { class: 'tslab-bar' }, runBtn, prev, next, stepLbl, h('span', { class: 'sp' }),
      ...(o.actions || []).map((a) => h('button', { class: 'btn', onclick: () => { ed.set(a.apply(ed.get())); stale = true; check().then(run); } }, icon(a.icon || 'zap'), a.label)),
      h('button', { class: 'btn ghost', title: 'はじめの状態に戻す', onclick: () => { ed.set(o.src); check().then(run); } }, icon('rotate-ccw'), 'もどす'));
    function go(i) { if (!rr || !rr.snaps.length) return; step = Math.max(0, Math.min(rr.snaps.length - 1, i)); stale = false; paintOut(); }
    function paintOut() {
      out.replaceChildren(); out.classList.toggle('tslab-stale', stale && !!rr);
      if (!rr) { out.append(h('div', { class: 'tslab-note' }, '「実行」を押すと、変数の中身と出力がここに出ます')); stepLbl.textContent = ''; curLine(0); return; }
      const sn = rr.snaps[step] || null, last = !rr.snaps.length || step === rr.snaps.length - 1;
      if (sn) {
        const pv = step > 0 ? rr.snaps[step - 1].vars : {};
        const grid = h('div', { class: 'tslab-vars' });
        Object.keys(sn.vars).forEach((k) => grid.append(h('span', { class: 'k' }, k), h('span', { class: 'v' + (pv[k] !== sn.vars[k] ? ' ch' : '') }, sn.vars[k])));
        out.append(grid);
      }
      const lg = sn && !last ? rr.logs.slice(0, sn.logs) : rr.logs;
      if (lg.length) out.append(h('div', { class: 'tslab-log' }, lg.map((t) => '› ' + t).join('\n')));
      if (rr.err && last) { const g = RGLOSS.map(([re, f]) => { const m = rr.err.match(re); return m ? f(m) : ''; }).find(Boolean) || ''; out.append(h('div', { class: 'tslab-rerr' }, '実行エラー: ' + rr.err, g ? h('small', g) : null)); }
      if (!sn && !lg.length && !rr.err) out.append(h('div', { class: 'tslab-note' }, '（出力なし）'));
      if (stale) out.append(h('div', { class: 'tslab-note' }, 'コードを変えました。「実行」で結果を更新'));
      stepLbl.textContent = rr.snaps.length ? (step + 1) + ' / ' + rr.snaps.length + ' 行目まで実行' : '';
      curLine(stale || (rr.err && last) ? 0 : (sn ? sn.line : 0));
      prev.disabled = !rr.snaps.length || step <= 0; next.disabled = !rr.snaps.length || step >= rr.snaps.length - 1;
    }
    async function check() {
      const my = ++token;
      try { ts = ts || await K.W.loadTS(); } catch (e) { chk.replaceChildren(h('div', { class: 'tslab-note' }, 'TypeScript を読み込めません（オフライン？）')); return; }
      if (my !== token) return;
      const src = ed.get(), errs = K.W.tsCheck(ts, src);
      ed.mark(errs.map((e) => e.line)); curLine(!stale && rr && rr.snaps[step] ? rr.snaps[step].line : 0);
      lbl2.textContent = errs.length ? errs.length + ' 件' : '';
      chk.replaceChildren(...(errs.length ? errs.map((e) => h('div', { class: 'tslab-err' }, 'L' + e.line + ': ' + e.msg, gloss(e.msg) ? h('small', gloss(e.msg)) : null)) : [h('div', { class: 'tslab-ok' }, '✓ 型エラーなし')]),
        ...((o.coach ? o.coach(src) : []).map((t) => h('div', { class: 'tslab-tip', html: t }))));
      const it = inferTypes(ts, src);
      inf.replaceChildren(it.length ? h('div', { class: 'tslab-chips' }, it.map((x) => h('span', { class: 'tslab-chip ' + (x.written ? 'w' : 'inf'), title: 'L' + x.line }, x.name, ': ', h('b', x.type), h('i', x.written ? '書いた' : '推論')))) : h('div', { class: 'tslab-note' }, '（変数がありません）'));
    }
    async function run() {
      try { ts = ts || await K.W.loadTS(); } catch (e) { return; }
      rr = execute(ts, ed.get()); stale = false; step = rr.snaps.length - 1; paintOut();
    }
    root.append(
      h('div', { class: 'tslab-ed' }, ed, bar),
      h('div', { class: 'tslab-side' },
        h('div', { class: 'tslab-box' }, h('h5', icon('shield-check'), '型チェック（書いた瞬間に判定）', lbl2), chk),
        h('div', { class: 'tslab-box' }, h('h5', icon('tag'), 'TS が決めた型', h('em', '点線＝推論')), inf),
        h('div', { class: 'tslab-box' }, h('h5', icon('terminal'), '実行結果（変数の中身）'), out)));
    paintOut();
    check().then(run);
    root.ed = ed;
    return root;
  }

  /* 「事故 → 直す」を1つずつ。tabs: [{ name, sub, story, tryIt, src, actions, coach }] */
  function labTabs(el, tabs) {
    const bar = h('div', { class: 'tsx3-tabs' }), body = h('div', { class: 'tslab' });
    const show = (i) => {
      bar.querySelectorAll('.tsx3-tab').forEach((t, k) => t.classList.toggle('on', k === i));
      const t = tabs[i];
      body.replaceChildren(
        h('div', { class: 'tslab-story' }, icon('triangle-alert'), h('div', { html: t.story })),
        lab(t),
        t.tryIt ? h('div', { class: 'tslab-try' }, icon('lightbulb'), h('div', { html: t.tryIt })) : null);
    };
    tabs.forEach((t, i) => bar.append(h('button', { class: 'tsx3-tab', onclick: () => show(i) }, t.name, t.sub ? h('small', t.sub) : null)));
    if (tabs.length > 1) el.append(bar);
    el.append(body);
    show(0);
  }
  const uncomment = (needle) => (s) => s.split('\n').map((l) => (l.indexOf(needle) >= 0 ? l.replace(/^(\s*)\/\/ ?/, '$1') : l)).join('\n');

  /* ================= ts-basic ================= */
  K.reg({
    id: 'ts-basic', track: 'ts', title: '基礎文法・データ型', sub: '型の指定の方法', emoji: '📘',
    scenes: [
      {
        t: '型アノテーションの読み方', lead: '<code class="i">let age: number = 20;</code> は4つの部品でできています。読み方を覚えたら、下の<b>本物のコード</b>を書き換えて試そう。',
        render(el) {
          const L = [['let', '箱を作る合図', 'var(--basic)'], ['age', '箱の名前（変数名）', 'var(--pink)'], [': number', '型。数字だけ入る箱にする', 'var(--ts)'], ['= 20', '最初の中身', 'var(--team)']];
          el.append(h('div', { class: 'tslab-legend' }, L.map(([c, s, col]) => h('div', { style: { '--lc': col } }, h('code', c), h('small', s)))), h('div', { style: { height: '12px' } }));
          labTabs(el, [{
            name: '申込フォームの値',
            story: '申込フォームの「年齢」に、うっかり文字が入った。画面には <b>「二十1 歳」</b> と出る。動かすまで誰も気づけない。',
            src: `// 申込フォームの値。「変数名: 型」で、入る種類を決める
let age: number = 20;
let name: string = "田中";
let agree: boolean = true;

// 文字が入ったら？ 「事故を起こす」で有効になる
// age = "二十";

console.log(name + "さんは来年 " + (age + 1) + " 歳");
`,
            actions: [{ label: '事故を起こす', icon: 'bug', apply: uncomment('age = "二十"') }],
            tryIt: '<b>やってみよう</b>　① そのまま「実行」→ 「田中さんは来年 21 歳」。② 「事故を起こす」→ <b>実行する前に赤線</b>が出る（実行すると「二十1 歳」になってしまう）。③ 直す：<code>age = 21;</code> に書き換える。',
          }]);
        },
      },
      {
        t: '型の箱に値を入れよう', tag: 'string · number', lead: '入力欄から届く値は<b>いつも文字</b>。数字と思って足すと、人数も料金も狂う。本物のコードで確かめよう。',
        render(el) {
          labTabs(el, [
            {
              name: '人数 "3" + 2', sub: 'string と number',
              story: '参加人数 <code>"3"</code> に 2 人を足したら、画面に <b>「32人」</b>。赤線は出ない。文字と数字の足し算は、つなぐだけになる。',
              src: `// フォームの入力欄から届く値は、いつも「文字」
const peopleText: string = "3";
const extra: number = 2;

const total = peopleText + extra;
console.log(total + "人");

// 直す：文字を数字に変えて、number の箱に入れる
// const people: number = peopleText;
`,
              actions: [{ label: '赤線を出す', icon: 'bug', apply: uncomment('const people: number = peopleText') }],
              tryIt: '<b>やってみよう</b>　① 「実行」→ 32人（赤線なし）。② 「赤線を出す」→ <code>string</code> は <code>number</code> の箱に入らない。③ 直す：<code>const people: number = Number(peopleText);</code> にして、<code>people + extra</code> を出力する → 5人。',
            },
            {
              name: '料金 3500 と "3500"', sub: 'number',
              story: '料金 <code>"3500"</code> に手数料 500 を足したら <b>「3500500」円</b>。引用符が付くと文字になる。',
              src: `const priceText: string = "3500";   // 文字
const priceNum: number = 3500;      // 数字
const fee: number = 500;

console.log(priceText + fee);   // 文字 + 数字
console.log(priceNum + fee);    // 数字 + 数字
`,
              tryIt: '<b>やってみよう</b>　① 「実行」で、2つの出力を見比べる。② <code>priceNum</code> の行を <code>"3500"</code>（引用符付き）に変えると、赤線が出る。',
            },
            {
              name: '同意チェック "false"', sub: 'boolean',
              story: 'チェックボックスの値を文字で持ったら、<code>"false"</code>（外したはず）なのに <b>「同意あり」</b> と判定された。文字は空でなければ true 扱い。',
              src: `// 文字で持つと、"false" でも if を通ってしまう
const agreeText: string = "false";
if (agreeText) {
  console.log("同意あり（のはずが…）");
}

// boolean なら true / false だけ
const agree: boolean = false;
if (agree) {
  console.log("同意あり");
} else {
  console.log("同意なし");
}
`,
              tryIt: '<b>やってみよう</b>　① 「実行」→ 上の if は通ってしまう。② <code>const agree: boolean = false;</code> を <code>"false"</code> に変えると、赤線で止まる。',
            },
          ]);
        },
      },
      {
        t: 'const / let と型推論', lead: 'まず<b>const</b>で書く。あとから値を変える必要が出て<b>赤線</b>が出たら<b>let</b>に変える。本物のコードで、その理由を見よう。',
        render(el) {
          labTabs(el, [
            {
              name: 'const：変わらない値', sub: '税率',
              story: '消費税率がどこかで書き換わり、請求書の税額が<b>0円</b>に。原因は200行先の1行。探すだけで半日かかった。',
              src: `const TAX_RATE = 0.1;   // 消費税率：ずっと同じ

function withTax(price: number): number {
  return Math.round(price * (1 + TAX_RATE));
}

// …（300行あと）…
// TAX_RATE = 0;   // ← うっかり！

console.log(withTax(1000));
`,
              actions: [{ label: '事故を起こす', icon: 'bug', apply: uncomment('TAX_RATE = 0;') }],
              tryIt: '<b>やってみよう</b>　① 「実行」→ 1100。② 「事故を起こす」→ <b>書いた瞬間に赤線</b>。③ <code>const</code> を <code>let</code> に変えて実行してみよう → 赤線は消えるが、出力は <b>1000</b>（税が 0 円になった）。変わらない値は const で守る。',
            },
            {
              name: 'let：変わる値', sub: '合計',
              story: 'カートの合計金額は、商品を足すたびに変わる。<code>const</code> で作ると、足し算した瞬間に止まる。',
              src: `const prices = [1200, 800, 2500];   // カートの商品
let total = 0;                      // 足していくので let

for (let i = 0; i < prices.length; i++) {
  total += prices[i];
}

console.log("合計", total);
`,
              tryIt: '<b>やってみよう</b>　① 「実行」のあと、<b>◀ ▶</b> で1行ずつ進める → <code>total</code> が 0 → 1200 → 2000 → 4500 と変わる。② <code>let total</code> を <code>const total</code> に変える → <code>total += …</code> に赤線。赤線が出たら let に直す。',
            },
            {
              name: 'const でも中身は変えられる', sub: 'カート',
              story: '「const なのに push できた！」と混乱する人が多い。<b>const が守るのは「箱そのもの」</b>で、箱の中身ではない。',
              src: `const cart = { items: ["相談 30分"], count: 1 };

cart.items.push("書類確認");   // OK：中身を足す
cart.count = 2;                // OK：項目を書き換える

// cart = { items: [], count: 0 };   // 箱ごと入れ替えは NG
console.log(cart.items, cart.count);
`,
              actions: [{ label: '箱ごと入れ替える', icon: 'bug', apply: uncomment('cart = { items: [], count: 0 };') }],
              tryIt: '<b>やってみよう</b>　① 「実行」→ 中身が増える（const でも OK）。② 「箱ごと入れ替える」→ <code>Cannot assign to \'cart\'</code> の赤線。<code>cart</code> という名前に別のものを入れ直すのが禁止。',
            },
            {
              name: '型は書かなくても決まる', sub: '型推論',
              story: '<code>let status = "open"</code> のあとで <code>status = 5</code> と書いても、赤線で止まる。<b>初期値から TS が型を決めている</b>から。',
              src: `const tax = 0.1;        // const は値そのものが型（0.1）
let price = 1000;       // let は「数字」という種類（number）
const status = "open";  // 値そのもの（"open"）
let label = "受付中";   // 文字という種類（string）

// 違う種類を入れると赤線。↓ 「事故を起こす」で有効になる
// price = "千円";
// label = 5;

console.log(tax, price, status, label);
`,
              actions: [{ label: '事故を起こす', icon: 'bug', apply: (s) => uncomment('price = "千円"')(uncomment('label = 5;')(s)) }],
              tryIt: '<b>見るところ</b>　右の「TS が決めた型」：<code>tax</code> は <code>0.1</code>、<code>price</code> は <code>number</code>。点線＝書いていないのに TS が推論した型。「事故を起こす」で、推論された型に反する代入が赤線になる。',
            },
          ]);
          el.append(h('div', { class: 'tsx3-rule' }, icon('lightbulb'), h('span', { html: '<b>まず const</b>。値を変える必要が出て赤線（<code>Cannot assign to …</code>）が出たら、そこで<b>let</b>に変える。迷ったら const でよい。' })));
        },
      },
      {
        t: '型推論：どこまで書く？', tag: 'inference', lead: '型は「全部に書く」のも「全部省く」のもダメ。<b>入口（引数）と出口（戻り値）</b>には書き、中の変数は推論に任せる。本物のコードで確かめよう。',
        render(el) {
          const noise = (src) => {
            const tips = [];
            src.split('\n').forEach((l, i) => { const m = l.match(/^\s{2,}(?:const|let)\s+(\w+)\s*:\s*(\w+)\s*=\s*\S/); if (m) tips.push('L' + (i + 1) + ': <code>' + m[1] + '</code> は右辺から <code>' + m[2] + '</code> と分かる。<b>書かなくてよい</b>（ノイズ）'); });
            return tips;
          };
          labTabs(el, [
            {
              name: '引数に書かないと any', sub: '入口',
              story: '請求書の小計。引数の型を省いたら <code>any</code> になり、<code>subtotal(1000, "3個")</code> が通って画面に <b>NaN</b> と出た。',
              src: `// 引数の型を書いていない
function subtotal(price, qty) {
  return price * qty;
}

console.log(subtotal(1000, "3個"));   // 文字でも通る
`,
              tryIt: '<b>やってみよう</b>　① 「実行」→ NaN（赤線は引数の宣言に出ている）。② <code>price: number, qty: number</code> と書く → 今度は<b>呼び出し側</b>に赤線が出て、バグが実行前に分かる。③ 呼び出しを <code>subtotal(1000, 3)</code> にして直す。',
            },
            {
              name: '中の変数は書かない', sub: '出口と中身',
              story: 'レビューで「型だらけで読めない」と指摘された。<b>右辺を見れば分かる型</b>まで書くと、ノイズになる。',
              src: `function subtotal(price: number, qty: number): number {
  const sum: number = price * qty;
  const label: string = "小計";
  return sum;
}

console.log(subtotal(1000, 3));
`,
              coach: noise,
              tryIt: '<b>やってみよう</b>　上の2つの変数から <code>: number</code> / <code>: string</code> を消す。右の「TS が決めた型」は変わらない（点線＝推論）。<b>引数と戻り値の型は残す</b>のがルール。',
            },
          ]);
        },
      },
      {
        t: '配列・タプル・オブジェクト', lead: 'データのまとまりも型で守れる。API から届く形を、本物のコードで試そう。',
        render(el) {
          labTabs(el, [
            {
              name: '配列', sub: '同じ型が並ぶ',
              story: '担当弁護士の一覧に、うっかり数字を push した。画面の1行だけ <b>名前が数字</b>になっていた。',
              src: `const lawyers: string[] = ["田中", "山本"];

lawyers.push("鈴木");   // OK
// lawyers.push(3);     // ← 数字は入らない

console.log(lawyers.length, lawyers);
`,
              actions: [{ label: '数字を入れてみる', icon: 'bug', apply: uncomment('lawyers.push(3)') }],
              tryIt: '<b>やってみよう</b>　① 「実行」→ 3人。② 「数字を入れてみる」→ <code>string[]</code> に数字は入らない（赤線）。',
            },
            {
              name: 'タプル', sub: '位置ごとに型',
              story: 'API が返す相談の1行 <code>["離婚相談", 3000, true]</code>。<code>row[1]</code> が料金か件数か分からず、画面が落ちた。',
              src: `// 相談の1行：[題名, 料金, 公開中か]
const row: [string, number, boolean] = ["離婚相談", 3000, true];

console.log(row[1] * 2);   // 料金を2倍

// row[1] = "無料";        // ← 2番目は number
// const bad: [string, number, boolean] = [3000, "離婚相談", true];
`,
              actions: [
                { label: '料金に文字', icon: 'bug', apply: uncomment('row[1] = "無料"') },
                { label: '順番を入れ替え', icon: 'shuffle', apply: uncomment('const bad') },
              ],
              tryIt: '<b>やってみよう</b>　「料金に文字」「順番を入れ替え」を押して、赤線の文を読む。タプルは<b>個数・順番・型</b>まで決まっているので、row[1] がいつも料金だと保証される。',
            },
            {
              name: 'オブジェクト', sub: '形を決める',
              story: '相談データの項目名を変えたのに、直し忘れた画面が1つ。何も言われず、<b>料金が空</b>で表示された。',
              src: `interface Consultation {
  title: string;
  fee: number;
}

const c: Consultation = { title: "相続の相談", fee: 3000 };
c.fee = 5000;   // OK

// c.fee = "無料";      // ← 料金は number
// c.priority = 1;      // ← そんな項目は無い
console.log(c);
`,
              actions: [
                { label: '料金に文字', icon: 'bug', apply: uncomment('c.fee = "無料"') },
                { label: '存在しない項目', icon: 'bug', apply: uncomment('c.priority = 1') },
              ],
              tryIt: '<b>やってみよう</b>　2つのボタンで赤線を出して、メッセージを読む。<code>interface</code> は「このオブジェクトはこの形」という約束。外れるとすぐ赤線。',
            },
          ]);
        },
      },
      {
        t: 'any と unknown', tag: 'any', lead: '外から来る値（API の返事）を <b>any</b> で受けるか、<b>unknown</b> で受けるか。本物のコードで、落ちるのと守られるのを見比べよう。',
        render(el) {
          labTabs(el, [
            {
              name: 'any で受ける', sub: '落ちる',
              story: '外部 API の JSON を <code>any</code> で受けた。相手が項目名を <code>name</code> → <code>fullName</code> に変えたのに赤線は出ず、<b>本番で画面が真っ白</b>に。',
              src: `// 外部 API の返事。相手が項目名を変えた（name → fullName）
const res: any = JSON.parse('{"fullName":"田中"}');

console.log(res.name.toUpperCase());   // 赤線なし
`,
              tryIt: '<b>やってみよう</b>　「実行」→ <b>実行エラー</b>。<code>any</code> は型チェックを諦めるので、赤線が1本も出ない。誰も事前に気づけない。',
            },
            {
              name: 'unknown で受ける', sub: '守られる',
              story: '同じ API を <code>unknown</code> で受けると、使う前に赤線で止められる。<b>確かめてから使う</b>ようになる。',
              src: `// 何が来るか分からない → unknown で受ける
const res: unknown = JSON.parse('"tanaka"');   // 今回は文字が来た

console.log(res.toUpperCase());   // 赤線：確かめる前は使えない

// 直す：typeof で確かめてから使う
// if (typeof res === "string") {
//   console.log(res.toUpperCase());
// }
`,
              actions: [{ label: '確かめてから使う', icon: 'shield-check', apply: () => '// 何が来るか分からない → unknown で受ける\nconst res: unknown = JSON.parse(\'"tanaka"\');   // 今回は文字が来た\n\n// 確かめてから使う：typeof で string と分かった枝の中だけ OK\nif (typeof res === "string") {\n  console.log(res.toUpperCase());\n}\n' }],
              tryIt: '<b>やってみよう</b>　① 「実行」前に赤線（<code>\'res\' is of type \'unknown\'</code>）。② 「確かめてから使う」→ <code>typeof</code> で string と分かった枝の中だけ使える → 赤線が消える。',
            },
          ]);
        },
      },
      {
        t: '値がない型：void / undefined / null', tag: 'void', lead: '「値がない」にも3種類ある。ログイン前の画面で落ちる、よくある事故を本物のコードで見よう。',
        render(el) {
          labTabs(el, [
            {
              name: 'void', sub: '戻り値がない',
              story: '記録するだけの関数の結果を、変数に入れて使おうとした。<b>戻り値は無い</b>（undefined）。',
              src: `function logOrder(id: number): void {
  console.log("注文 " + id + " を記録しました");
}

const r = logOrder(1);   // void：返す値は無い
console.log(r);
`,
              tryIt: '<b>見るところ</b>　右の「TS が決めた型」：<code>logOrder()</code> は <code>void</code>、<code>r</code> も <code>void</code>。出力の2行目は <code>undefined</code>。「何かを返す関数」ではない目印。',
            },
            {
              name: 'undefined', sub: 'まだ入っていない',
              story: 'あだ名は<b>入力しなくてよい</b>項目。未入力の人の <code>nickname.length</code> を読んで画面が落ちた。',
              src: `interface Profile {
  name: string;
  nickname?: string;   // あだ名は無いかも
}

const p: Profile = { name: "田中" };
console.log(p.nickname);           // undefined

// console.log(p.nickname.length);  // ← 赤線になる
`,
              actions: [{ label: 'そのまま使う', icon: 'bug', apply: uncomment('console.log(p.nickname.length)') }],
              tryIt: '<b>やってみよう</b>　① 「実行」→ undefined。② 「そのまま使う」→ 実行前に赤線（<code>possibly \'undefined\'</code>）。直す：<code>if (p.nickname !== undefined) { … }</code>',
            },
            {
              name: 'null', sub: '「ない」を自分で示す',
              story: 'ログインしていない人の名前を表示しようとして <b>Cannot read properties of null</b>。見つからなかったら <code>null</code> を返す関数だった。',
              src: `function findName(id: number): string | null {
  return id === 1 ? "田中" : null;   // 見つからなければ null
}

const n = findName(2);
console.log(n.length);   // 赤線：n は null かもしれない

// 直す：null でないときだけ使う
// if (n !== null) {
//   console.log(n.length);
// }
`,
              tryIt: '<b>やってみよう</b>　① 「実行」→ 実行エラー（赤線のまま動かすと落ちる）。② 直す：<code>console.log(n.length);</code> を消して、下のコメントを外す → 赤線が消えて、<code>n</code> は <code>string</code> として使える。',
            },
          ]);
        },
      },
      {
        t: '実践：型エラーを全部直そう', tag: 'PRACTICE', lead: 'ミッションは3つ（1行ずつ直すだけ）。「値を直す」でも「型を広げる」でも OK。',
        render(el) {
          el.append(tsPractice("let count: number = \"5\";                    // ① ここを直す\nconst names: string[] = [\"田中\", 3];       // ② ここを直す\nconst point: [number, number] = [10, \"20\"]; // ③ ここを直す\n\nconsole.log(count, names, point);\n", (v, c, ed) => [
            { label: '① count の赤線を消す', ok: ed && !/\bany\b/.test(nc(v)) && lineOk(v['main.ts'], /^\s*let\s+count\b/, c.errors) },
            { label: '② names の赤線を消す', ok: ed && !/\bany\b/.test(nc(v)) && lineOk(v['main.ts'], /^\s*const\s+names\b/, c.errors) },
            { label: '③ point の赤線を消す', ok: ed && !/\bany\b/.test(nc(v)) && lineOk(v['main.ts'], /^\s*const\s+point\b/, c.errors) },
            { optional: true, label: '任意：文字と数字が混ざった配列 mixed を (string | number)[] で作って console.log する', ok: ed && /\(\s*(string\s*\|\s*number|number\s*\|\s*string)\s*\)\s*\[\s*\]|Array\s*<\s*(string\s*\|\s*number|number\s*\|\s*string)\s*>/.test(nc(v)) && /\bmixed\b/.test(nc(v)) && ranOk(c, (t) => t.length >= 2) },
          ], "let count: number = 5;\nconst names: string[] = [\"田中\", \"佐藤\"];\nconst point: [number, number] = [10, 20];\n\nconsole.log(count, names, point);\n\n// 任意チャレンジ\nconst mixed: (string | number)[] = [\"田中\", 20, \"佐藤\", 30];\nconsole.log(mixed);\n", 'TypeScript', [{"hint": ["count は number（数字）の箱。いま入っているのは \"5\"（文字）。", "引用符を外して 5 にしよう。"], "fix": [["= \"5\";", "= 5;"]]}, {"hint": ["names は string[]（文字の配列）。3 は数字だね。", "3 を \"佐藤\" のような文字にしよう。"], "fix": [["[\"田中\", 3]", "[\"田中\", \"佐藤\"]"]]}, {"hint": ["point は [number, number]。2つ目が \"20\"（文字）になっている。", "\"20\" の引用符を外して 20 に。"], "fix": [["[10, \"20\"]", "[10, 20]"]]}, {"hint": ["「文字か数字」の配列の型は？ かっこと [] を組み合わせるよ。", "const mixed: (string | number)[] = [\"田中\", 20]; console.log(mixed);"], "fix": "let count: number = 5;\nconst names: string[] = [\"田中\", \"佐藤\"];\nconst point: [number, number] = [10, 20];\n\nconsole.log(count, names, point);\n\n// 任意チャレンジ\nconst mixed: (string | number)[] = [\"田中\", 20, \"佐藤\", 30];\nconsole.log(mixed);\n"}], [{ level: 2, label: "[string, number] のタプル user を作り、名前 user[0] と年齢 user[1] を console.log する", hint: ["タプルは「位置ごとに型が決まる」配列。[string, number] と書く。", "const user: [string, number] = [\"Lam\", 25]; console.log(user[0], user[1]);"], ok: (v, c) => /\[\s*string\s*,\s*number\s*\]/.test(nc(v)) && /\buser\s*\[\s*0\s*\]/.test(nc(v)) && /\buser\s*\[\s*1\s*\]/.test(nc(v)) && ranOk(c, (t) => t.length >= 2), code: "let count: number = 5;\nconst names: string[] = [\"田中\", \"佐藤\"];\nconst point: [number, number] = [10, 20];\n\nconsole.log(count, names, point);\n\nconst user: [string, number] = [\"Lam\", 25];\nconsole.log(user[0], user[1]);\n", sol: "\n// 中級チャレンジ：タプル\nconst user: [string, number] = [\"Lam\", 25];\nconsole.log(user[0], user[1]);\n" }, { level: 3, label: "type Point = [number, number] を作り、座標の合計を返す sumPoint(p: Point) で 30 を出す", hint: ["同じ [number, number] を何度も書くなら、type で名前を付けよう。", "type Point = [number, number]; function sumPoint(p: Point): number { return p[0] + p[1]; }"], ok: (v, c) => /type\s+Point\s*=\s*\[\s*number\s*,\s*number\s*\]/.test(nc(v)) && /sumPoint\s*\(/.test(nc(v)) && ranOk(c, (t) => t.some((x) => x.trim() === '30')), code: "let count: number = 5;\nconst names: string[] = [\"田中\", \"佐藤\"];\nconst point: [number, number] = [10, 20];\n\nconsole.log(count, names, point);\n\ntype Point = [number, number];\nfunction sumPoint(p: Point): number {\n  return p[0] + p[1];\n}\nconsole.log(sumPoint(point)); // 30\n", sol: "\n// 上級チャレンジ：タプルに名前を付ける\ntype Point = [number, number];\nfunction sumPoint(p: Point): number {\n  return p[0] + p[1];\n}\nconsole.log(sumPoint(point)); // 30\n" }]));
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
        t: 'Enum：名前の付いた定数', lead: '案件の状態を <code class="i">setStatus(2)</code> と数字で書くと、2 が何か読めない。<b>名前を付ける</b>と意味が伝わる。ボタンで案件の状態を変えてみて。',
        render(el) {
          style('tsr-enum', `.tsr-st{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.tsr-st>div{display:grid;gap:2px;text-align:center;padding:8px 4px;border-radius:8px;border:1px solid var(--line);background:var(--card2);opacity:.55;transition:.25s}.tsr-st>div small{font:600 .72rem var(--mono);color:var(--mute)}.tsr-st>div.on{opacity:1;border-color:var(--c);background:color-mix(in srgb,var(--c) 18%,var(--card));transform:translateY(-2px)}.tsr-st>div.done{opacity:.9;border-color:var(--c)}
          .tsr-card{display:grid;gap:8px;padding:12px 14px;border-radius:10px;border:1px solid var(--line);background:var(--card)}.tsr-card .row1{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap}.tsr-card .badge{padding:.2em .8em;border-radius:6px;font-weight:800;font-size:.875rem;background:color-mix(in srgb,var(--c) 22%,transparent);border:1px solid var(--c);transition:.25s}.tsr-card .badge.unk{--c:var(--bad)}.tsr-card .note{font-size:.8125rem;color:var(--mute);min-height:1.4em}
          .tsr-btns{display:flex;gap:6px;flex-wrap:wrap}`);
          const E = { Received: [1, '受付', 'var(--basic)', 2, '依頼を受け付けた。担当者を決める'], Reviewing: [2, '対応中', 'var(--ts)', 3, '担当の弁護士が対応している。依頼者に「対応中」と表示'], Done: [3, '完了', 'var(--ok)', 4, '対応が終わった。依頼者にお知らせメールが届く'], Canceled: [4, '取消', 'var(--pink)', 5, '依頼がキャンセルされた。請求は止まる'] };
          const keys = Object.keys(E); let cur = 'Received', busy = false;
          const cd = code('enum Status {\n  Received = 1,\n  Reviewing = 2,\n  Done = 3,\n  Canceled = 4,\n}\n\nsetStatus(Status.Received);', 'ts', { dim: true, color: 'var(--ts)' });
          const callLn = cd.querySelectorAll('.ln')[7];
          const out = h('div', { class: 'fo2-out' }, h('span', { class: 'mu' }, '▶ ボタンを押すと、ここに結果が出る'));
          const steps = h('div', { class: 'tsr-st' }, keys.map((k) => h('div', { style: { '--c': E[k][2] } }, h('b', E[k][1]), h('small', k + ' = ' + E[k][0]))));
          const badge = h('span', { class: 'badge' }), note = h('div', { class: 'note' });
          const card = h('div', { class: 'tsr-card' }, h('div', { class: 'row1' }, h('b', '相続の相談（案件）'), badge), note);
          const paint = (k) => { const [v, jp, c] = E[k]; badge.className = 'badge'; badge.style.setProperty('--c', c); badge.textContent = jp; [...steps.children].forEach((d, i) => { d.classList.toggle('on', keys[i] === k); d.classList.toggle('done', keys.indexOf(k) > i && k !== 'Canceled'); }); };
          const go = (k) => {
            cur = k; paint(k); const [v, , , ln, msg] = E[k];
            callLn.innerHTML = K.W.hl('setStatus(Status.' + k + ');', 'ts'); cd.setHi([ln, 8]);
            note.textContent = msg;
            out.replaceChildren(h('div', { html: K.W.hl('setStatus(Status.' + k + ')  // ' + k + ' = ' + v, 'ts') }), h('div', null, '→ 画面のバッジは「' + E[k][1] + '」。コードを読むだけで意味が分かる'));
          };
          const bad = () => {
            badge.className = 'badge unk'; badge.textContent = '？ 不明'; [...steps.children].forEach((d) => d.classList.remove('on', 'done'));
            note.textContent = '数字のままだと、決めていない 9 も通る。画面は「不明」になり、原因探しが始まる';
            out.replaceChildren(h('div', { html: K.W.hl('setStatus(9)  // 9 って何？ 誰も気づかない', 'ts') }), h('div', null, '→ 本番で「不明」のバッジが出て、問い合わせが来る'));
          };
          const btn = (k) => h('button', { class: 'btn', onclick: () => go(k) }, 'Status.' + k);
          const demo = h('button', { class: 'btn primary', style: { '--c': 'var(--ts)' }, onclick: async () => { if (busy) return; busy = true; for (const k of ['Received', 'Reviewing', 'Done']) { go(k); await K.W.sleep(900); } busy = false; } }, icon('play'), '受付から完了まで流す');
          paint('Received'); note.textContent = E.Received[4];
          el.append(h('div', { class: 'fo2-enum' },
            h('div', { class: 'p' }, lbl('コード'), cd, h('div', { class: 'fo2-cmp' }, h('div', { class: 'tsx-res ng' }, 'setStatus(2) // 2 は何？'), h('div', { class: 'tsx-res ok' }, 'setStatus(Status.Reviewing) // 一目瞭然'))),
            h('div', { class: 'p' }, lbl('案件カード'), card, steps, h('div', { class: 'tsr-btns' }, keys.map(btn), h('button', { class: 'btn', onclick: bad }, 'setStatus(9)（数字のまま）')), demo)),
            h('div', { style: { marginTop: '12px' } }, lbl('出力'), out));
        },
      },
      {
        t: 'interface：形チェッカー', tag: 'interface', lead: 'オブジェクトのプロパティを<b>ON/OFF</b>して、<code class="i">Consultation</code>（相談）の形を満たすか見てみよう。<code class="i">?</code> は省略OK。',
        render(el) {
          const st = { name: true, color: true, price: false, priceStr: false, extra: false };
          const obj = h('div', { class: 'tsx-obj' }), msgs = h('div', { class: 'col' }), badge = h('div');
          const tgs = {};
          // price を "文字列" にするのは price があるときだけ意味がある → 連動させる
          const sync = () => Object.keys(tgs).forEach((k) => tgs[k].classList.toggle('on', !!st[k]));
          const tg = (k, label) => { const t = h('div', { class: 'tsx-tg' + (st[k] ? ' on' : ''), onclick: () => {
            st[k] = !st[k];
            if (k === 'priceStr' && st.priceStr) st.price = true;       // 文字列にするなら price は存在する
            if (k === 'price' && !st.price) st.priceStr = false;         // price を消したら「文字列」も外す
            sync(); draw();
          } }, h('i'), label); tgs[k] = t; return t; };
          function draw() {
            const rows = [];
            if (st.name) rows.push('title: "相続の相談"'); if (st.color) rows.push('category: "家族"');
            if (st.price) rows.push(st.priceStr ? 'fee: "3000"' : 'fee: 3000'); if (st.extra) rows.push('priority: 1');
            obj.replaceChildren(h('div', '{'), ...rows.map((r, i) => h('div', { style: { paddingLeft: '1.2em' } }, r + (i < rows.length - 1 ? ',' : ''))), h('div', '}'));
            const errs = [];
            const miss = [['name', 'title'], ['color', 'category']].filter(([k]) => !st[k]).map(([, d]) => d);
            if (miss.length === 1) errs.push("Property '" + miss[0] + "' is missing in type '{…}' but required in type 'Consultation'.");
            if (miss.length === 2) errs.push("Type '{…}' is missing the following properties from type 'Consultation': title, category");
            if (st.price && st.priceStr) errs.push("Type 'string' is not assignable to type 'number'.（fee に文字列は入らない）");
            if (st.extra) errs.push("Object literal may only specify known properties, and 'priority' does not exist in type 'Consultation'.");
            obj.className = 'tsx-obj ' + (errs.length ? 'ng' : 'ok');
            msgs.replaceChildren(...errs.map((e) => res(false, e)));
            badge.replaceChildren(errs.length ? h('div', { class: 'tsx-res ng' }, '✖ Consultation を満たしていません') : h('div', { class: 'tsx-res ok' }, '✓ Consultation を満たしている！'));
          }
          el.append(h('div', { class: 'split r2b-top' }, h('div', { class: 'col' }, code('interface Consultation {\n  title: string;\n  category: string;\n  fee?: number; // 省略OK\n}', 'ts')),
            h('div', { class: 'col' }, lbl('const c: Consultation ='), obj, badge, msgs)),
            h('div', { style: { height: '10px' } }), lbl('プロパティ ON/OFF'), h('div', { class: 'r2b-tgs' }, tg('name', 'title'), tg('color', 'category'), tg('price', 'fee（?付き）'), tg('priceStr', 'fee を "文字列" にする'), tg('extra', '余計な priority を足す')));
          draw();
        },
      },
      {
        t: 'extends と merge', lead: 'interface は<b>足して増やせる</b>。「次へ」で2つのやり方を見よう。',
        render(el) {
          const bl = (t, c, cls) => h('span', { class: 'tsx-bl ' + (cls || ''), style: { background: cls ? '' : c } }, t);
          const pointA = h('div', { class: 'tsx-card' }, h('b', 'interface Consultation'), bl('id: number', 'var(--basic)'), bl('title: string', 'var(--basic)'));
          const z = bl('time: string', 'var(--pink)'); z.classList.add('tsx-fall');
          const p3 = h('div', { class: 'tsx-card' }, h('b', 'interface Booking extends Consultation'), bl('id: number', '', 'inh'), bl('title: string', '', 'inh'), z);
          const A = h('div', { class: 'tsx-sec' }, h('div', { class: 'split' }, pointA, p3));
          const m1 = h('div', { class: 'tsx-card' }, h('b', 'interface Consultation'), bl('id: number', 'var(--basic)'), bl('title: string', 'var(--basic)'));
          const m2 = h('div', { class: 'tsx-card' }, h('b', 'interface Consultation  // 同名'), bl('note: string', 'var(--pink)'));
          const mm = h('div', { class: 'tsx-card', style: { borderColor: 'var(--ok)' } }, h('b', '合体 → Consultation'), bl('id: number', 'var(--basic)'), bl('title: string', 'var(--basic)'), bl('note: string', 'var(--pink)'));
          const B = h('div', { class: 'tsx-sec' }, h('div', { class: 'split' }, h('div', { class: 'col' }, m1, m2), mm));
          const cd = [code('interface Booking extends Consultation {\n  time: string; // 予約の時間だけ足す\n}', 'ts'), code('interface Consultation { id: number; title: string }\ninterface Consultation { note: string }  // 同名で合体', 'ts')];
          const cbox = h('div');
          el.append(stepper({
            color: 'var(--ts)',
            steps: [{ say: 'まず基本の <b>Consultation</b>（id, title）。' }, { say: '<b>extends</b>：予約 Booking は Consultation を引き継いで、<b>time</b> だけ追加。薄い2つは「継承したもの」。' }, { say: '<b>merge</b>：同名の interface を2回書くと…' }, { say: '自動で<b>1つに合体</b>！（type ではできない）' }],
            init(vis) { vis.append(A, B, cbox); },
            update(n) {
              A.classList.toggle('off', n >= 2); B.classList.toggle('off', n < 2);
              p3.style.opacity = n >= 1 ? 1 : .3; p3.style.borderStyle = n >= 1 ? 'solid' : 'dashed';
              if (n === 1) { z.style.animation = 'none'; void z.offsetWidth; z.style.animation = ''; }
              mm.style.opacity = n >= 3 ? 1 : .3; mm.style.borderStyle = n >= 3 ? 'solid' : 'dashed'; m2.style.transform = n >= 3 ? 'translateY(-30px) scale(.9)' : ''; m2.style.opacity = n >= 3 ? .35 : 1;
              cbox.replaceChildren(cd[n >= 2 ? 1 : 0]);
            },
          }));
          // 実際に型チェックしてみる（出力が変わる）
          const MODES = [['Consultation', ['x', 'y'], 'そのまま'], ['Booking', ['x', 'y', 'z'], 'extends'], ['Consultation', ['x', 'y', 'z'], 'merge 後']];
          const DN = (k) => (k === 'x' ? 'id' : k === 'y' ? 'title' : mi === 2 ? 'note' : 'time'), DV = (k) => (k === 'x' ? '1' : k === 'y' ? '"相続"' : mi === 2 ? '"急ぎ"' : '"10:00"'), DT = (k) => (k === 'x' ? 'number' : 'string');
          let mi = 0; const on = { x: true, y: true, z: true };
          const segs = MODES.map(([t, , lb], i) => h('button', { class: 'btn', onclick: () => { mi = i; draw(); } }, h('b', t), ' ', h('small', lb)));
          const tg = ['x', 'y', 'z'].map((k) => h('button', { class: 'btn', onclick: () => { on[k] = !on[k]; draw(); } }, DN(k)));
          const cv = h('div'), ov = h('div', { class: 'fo2-out' });
          function draw() {
            const [T, need] = MODES[mi]; const given = ['x', 'y', 'z'].filter((k) => on[k]);
            segs.forEach((b, i) => b.classList.toggle('primary', i === mi)); tg.forEach((b, i) => { b.textContent = DN('xyz'[i]); b.classList.toggle('primary', on['xyz'[i]]); b.setAttribute('aria-pressed', on['xyz'[i]]); });
            const c = code(`const c: ${T} = { ${given.map((k) => DN(k) + ': ' + DV(k)).join(', ')} };`, 'ts', { file: 'main.ts', color: 'var(--ts)' });
            const missing = need.filter((k) => !on[k]).map(DN), extra = given.filter((k) => !need.includes(k)).map(DN);
            const bad = missing.length || extra.length;
            c.setHi([1], bad ? 'err' : 'on'); cv.replaceChildren(c);
            ov.className = 'fo2-out ' + (bad ? 'e' : 'ok');
            ov.replaceChildren(h('div', { class: bad ? 'er' : '' }, bad ? (missing.length ? (missing.length === 1 ? `Property '${missing[0]}' is missing in type '{ ${given.map((k) => DN(k) + ': ' + DT(k)).join('; ')} }' but required in type '${T}'.` : `Type '{ ${given.map((k) => DN(k) + ': ' + DT(k)).join('; ')} }' is missing the following properties from type '${T}': ${missing.join(', ')}`) : `Object literal may only specify known properties, and '${extra[0]}' does not exist in type '${T}'.`) : `OK：${T} の形（${need.map(DN).join(', ')}）にぴったり`));
          }
          draw();
          el.append(h('div', { class: 'fo2-panel' }, lbl('試してみよう：どの型に、どの値を入れる？'), h('div', { class: 'fo2-ctl', style: { margin: 0 } }, segs), h('div', { class: 'fo2-ctl', style: { margin: 0 } }, h('span', { class: 'fo2-k' }, '入れる値：'), tg), h('div', { class: 'fo2-2' }, cv, ov)));
        },
      },
      {
        t: 'interface vs type', lead: '行を<b>クリック</b>すると例が出ます。迷ったら「オブジェクトは interface、それ以外は type」。',
        render(el) {
          const R = [
            ['オブジェクトの形', 'y', 'y', 'interface Consultation { title: string }\ntype Consultation = { title: string }'],
            ['拡張（継承）', 'y', 't', 'interface Booking extends Consultation {}\ntype Booking = Consultation & { time: string }  // & で合成'],
            ['同名でマージ', 'y', 'n', 'interface Consultation { id: number }\ninterface Consultation { note: string }  // OK\ntype Consultation = {...}; type Consultation = {...}  // ✖ 重複エラー'],
            ['Union（A | B）', 'n', 'y', 'type Id = number | string;\n// interface では書けない'],
            ['タプル・プリミティブの別名', 'n', 'y', 'type Row = [number, string];\ntype Fee = number;'],
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
          ], "type Status = \"todo\" | \"doing\" | \"done\";\n\ninterface Task {\n  id: number;\n  title: string;\n  status: Status;\n  memo?: string;\n  assignee?: string;\n}\n\nconst t: Task = { id: 1, title: \"TSを学ぶ\", status: \"done\" };\nconsole.log(t);\n\n// 任意チャレンジ\nfunction doneOnly(tasks: Task[]): Task[] {\n  return tasks.filter((x) => x.status === \"done\");\n}\nconsole.log(doneOnly([t, { id: 2, title: \"復習\", status: \"todo\" }]));\n", 'TypeScript', [{"hint": ["Status に入る文字は \"todo\" / \"doing\" / \"done\" の3つだけ。", "\"finished\" を \"done\" に変えよう。"], "fix": [["status: \"finished\"", "status: \"done\""]]}, {"hint": ["interface Task の中に、1行足す。", "assignee?: string; を書こう（? は「なくてもOK」）。"], "fix": [["  // ② ここに assignee?: string を足す", "  assignee?: string;"]]}, {"hint": ["赤線が消えたら「▶ 実行」を押そう。", "console に { id: 1, … } が出れば OK。"], "fix": [["status: \"finished\"", "status: \"done\""], ["  // ② ここに assignee?: string を足す", "  assignee?: string;"]]}, {"hint": ["配列の「条件に合うものだけ」を取り出すメソッドは？（filter）", "function doneOnly(tasks: Task[]): Task[] { return tasks.filter((x) => x.status === \"done\"); }"], "fix": "type Status = \"todo\" | \"doing\" | \"done\";\n\ninterface Task {\n  id: number;\n  title: string;\n  status: Status;\n  memo?: string;\n  assignee?: string;\n}\n\nconst t: Task = { id: 1, title: \"TSを学ぶ\", status: \"done\" };\nconsole.log(t);\n\n// 任意チャレンジ\nfunction doneOnly(tasks: Task[]): Task[] {\n  return tasks.filter((x) => x.status === \"done\");\n}\nconsole.log(doneOnly([t, { id: 2, title: \"復習\", status: \"todo\" }]));\n"}], [{ level: 2, label: "Record<Status, number> を使って、status ごとの個数を返す countByStatus(tasks) を作って実行する", hint: ["Record<キーの型, 値の型> は「辞書」の型。キーが3つ全部いる。", "const r: Record<Status, number> = { todo: 0, doing: 0, done: 0 }; のあと、tasks を回して r[x.status] を +1。"], ok: (v, c) => /Record\s*<\s*Status\s*,\s*number\s*>/.test(nc(v)) && /countByStatus\s*\(/.test(nc(v)) && ranOk(c, (t) => t.length >= 2), code: "type Status = \"todo\" | \"doing\" | \"done\";\n\ninterface Task {\n  id: number;\n  title: string;\n  status: Status;\n  memo?: string;\n  assignee?: string;\n}\n\nconst t: Task = { id: 1, title: \"TSを学ぶ\", status: \"done\" };\nconsole.log(t);\n\nfunction countByStatus(tasks: Task[]): Record<Status, number> {\n  const r: Record<Status, number> = { todo: 0, doing: 0, done: 0 };\n  tasks.forEach((x) => {\n    r[x.status] += 1;\n  });\n  return r;\n}\nconsole.log(countByStatus([t, { id: 2, title: \"復習\", status: \"todo\" }]));\n", sol: "\n// 中級チャレンジ：Record で集計\nfunction countByStatus(tasks: Task[]): Record<Status, number> {\n  const r: Record<Status, number> = { todo: 0, doing: 0, done: 0 };\n  tasks.forEach((x) => {\n    r[x.status] += 1;\n  });\n  return r;\n}\nconsole.log(countByStatus([t, { id: 2, title: \"復習\", status: \"todo\" }]));\n" }, { level: 3, label: "pluck<K extends keyof Task>(tasks, key) を作り、pluck(tasks, \"title\") で title だけの配列を出す", hint: ["「Task のキーのどれか」を表す型は keyof Task。K extends keyof Task で制約できる。", "function pluck<K extends keyof Task>(tasks: Task[], key: K): Task[K][] { return tasks.map((x) => x[key]); }"], ok: (v, c) => /extends\s+keyof\s+Task/.test(nc(v)) && /Task\s*\[\s*K\s*\]/.test(nc(v)) && /pluck\s*\(/.test(nc(v)) && ranOk(c, (t) => t.length >= 2), code: "type Status = \"todo\" | \"doing\" | \"done\";\n\ninterface Task {\n  id: number;\n  title: string;\n  status: Status;\n  memo?: string;\n  assignee?: string;\n}\n\nconst t: Task = { id: 1, title: \"TSを学ぶ\", status: \"done\" };\nconsole.log(t);\n\nfunction pluck<K extends keyof Task>(tasks: Task[], key: K): Task[K][] {\n  return tasks.map((x) => x[key]);\n}\nconsole.log(pluck([t], \"title\")); // [\"TSを学ぶ\"]\n", sol: "\n// 上級チャレンジ：keyof で安全に取り出す\nfunction pluck<K extends keyof Task>(tasks: Task[], key: K): Task[K][] {\n  return tasks.map((x) => x[key]);\n}\nconsole.log(pluck([t], \"title\")); // [\"TSを学ぶ\"]\n" }]));
        },
      },
    ],
  });

  /* ================= ts-class ================= */
  K.reg({
    id: 'ts-class', track: 'ts', title: 'クラス', sub: '設計図とインスタンス', emoji: '🏭',
    scenes: [
      {
        t: 'クラス = 設計図、new = スタンプ', lead: '予約者の名前と人数を入れて <b>new</b> を押すと、設計図から予約（<b>インスタンス</b>）が量産されます。',
        render(el) {
          const nm = h('input', { value: '田中', style: { font: 'inherit', padding: '.4em .8em', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--bg2)', color: 'var(--text)', width: '120px' } });
          const pr = h('input', { type: 'number', value: '2', style: { font: 'inherit', padding: '.4em .8em', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--bg2)', color: 'var(--text)', width: '100px' } });
          const fac = h('div', { class: 'tsx-fac', style: { '--c': 'var(--ts)' } });
          const cd = code('class Booking {\n  constructor(\n    public name: string,\n    public people: number,\n  ) {}\n}\n\nconst b1 = new Booking("田中", 2);', 'ts', { color: 'var(--ts)' });
          let n = 0;
          const make = () => {
            n++; cd.setHi([2, 3, 4, 5]);
            cd.lines[7].innerHTML = K.W.hl(`const b${n} = new Booking("${nm.value}", ${pr.value || 0});`, 'ts');
            fac.append(h('div', { class: 'tsx-inst', style: { '--c': ['var(--ts)', 'var(--pink)', 'var(--basic)', 'var(--team)'][n % 4] } }, h('b', `b${n} : Booking`), h('div', `name: "${nm.value}"`), h('div', `people: ${pr.value || 0}`)));
            setTimeout(() => cd.setHi([8]), 600);
          };
          el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('設計図 (class)'), cd, h('div', { class: 'row' }, 'name', nm, 'people', pr, h('button', { class: 'btn primary', onclick: make }, '🖨 new Booking()'))), h('div', { class: 'col' }, lbl('インスタンス'), fac)));
          make();
        },
      },
      {
        t: 'アクセス修飾子：誰が触れる？', lead: 'マスを<b>クリック</b>して、アクセスできるか確認。（public は誰でも／protected は子まで／private は自分だけ）',
        render(el) {
          const F = [['🌐 public', 'name', [1, 1, 1]], ['🛡️ protected', 'email', [1, 1, 0]], ['🔒 private', 'password', [1, 0, 0]]];
          const who = ['クラスの中', '子クラス', '外部'];
          const msg = h('div', { style: { minHeight: '2.4em', marginTop: '10px' } });
          const mx = h('div', { class: 'tsx-mx', style: { '--c': 'var(--ts)' } }, h('div'), who.map((w) => h('div', { class: 'hd' }, w)));
          F.forEach(([lab, f, ok]) => {
            mx.append(h('div', { class: 'fl' }, lab + '\n' + f));
            ok.forEach((o, i) => { const b = h('button', { onclick: () => { b.className = o ? 'y' : 'n'; b.textContent = o ? '🔓 OK' : '🔒 NG'; msg.replaceChildren(o ? res(true, `${who[i]}から ${f} にアクセスできる`) : res(false, `Property '${f}' is ${lab.split(' ')[1]} and only accessible within class 'User'${f === 'email' ? ' and its subclasses' : ''}.`)); } }, '？'); mx.append(b); });
          });
          el.append(code('class User {\n  public name = "田中";          // 画面に出してよい\n  protected email = "a@b.c";     // 子クラスまで\n  private password = "****";     // クラスの中だけ\n}', 'ts', { color: 'var(--ts)' }), h('div', { style: { height: '14px' } }), mx, msg,
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
          const animal = cls('Booking', 'var(--team)', [['name: string'], ['issueNo()']]);
          const absTag = h('span', { style: { fontSize: '.75rem', opacity: 0 } }, 'abstract');
          animal.firstChild.append(absTag);
          const dog = cls('SeminarBooking extends Booking', 'var(--ts)', [['name  ↑継承', 'inh'], ['issueNo()  ↑継承', 'inh'], ['describe() override']]);
          const cat = cls('ConsultBooking extends Booking', 'var(--pink)', [['name  ↑継承', 'inh'], ['issueNo()  ↑継承', 'inh'], ['describe() override']]);
          const kids = h('div', { class: 'kids' }, dog, cat);
          const arrow = h('div', { style: { font: '900 1.6rem var(--mono)', color: 'var(--ts)', opacity: 0, transition: '.5s' } }, '⬆ extends');
          const note = h('div', { style: { minHeight: '2.4em' } });
          el.append(stepper({
            color: 'var(--ts)',
            steps: [{ say: '親クラス <b>Booking</b>：name と issueNo() を持つ。' }, { say: '<b>SeminarBooking extends Booking</b>：親を引き継ぐ矢印を引いた。' }, { say: '子は <b>name / issueNo() を書かなくても</b>最初から使える（薄い行）。' }, { say: '子ごとの個性は <b>override</b>。describe() の中身を自由に。' }, { say: '<b>abstract</b>：Booking を「設計だけ」にすると <code class="i">new Booking()</code> は禁止！' }],
            init(vis) { vis.append(h('div', { class: 'tsx-tree' }, animal, arrow, kids), note); },
            update(n) {
              dog.classList.toggle('off', n < 1); cat.classList.toggle('off', n < 1); arrow.style.opacity = n >= 1 ? 1 : 0;
              [dog, cat].forEach((c) => { c.children[1].style.opacity = n >= 2 ? .6 : 0; c.children[2].style.opacity = n >= 2 ? .6 : 0; c.children[3].style.opacity = n >= 3 ? 1 : 0; });
              absTag.style.opacity = n >= 4 ? 1 : 0; animal.classList.remove('x');
              note.replaceChildren();
              if (n === 4) { animal.classList.add('x'); note.append(res(false, "Cannot create an instance of an abstract class.  new Booking() ✖"), res(true, 'new SeminarBooking("田中") ✓')); }
            },
          }));
          // 実際に動かしてみる
          const csrc = 'abstract class Booking {\n  constructor(public name: string) {}\n  issueNo() { console.log(this.name + " の受付番号を発行"); }\n  abstract describe(): void;\n}\nclass SeminarBooking extends Booking {\n  describe() { console.log("セミナーの予約です"); }\n}\nclass ConsultBooking extends Booking {\n  describe() { console.log("相談の予約です"); }\n}';
          const ccd = code(csrc, 'ts', { file: 'booking.ts', dim: true, color: 'var(--ts)' });
          const cout = h('div', { class: 'fo2-out' }, h('span', { class: 'mu' }, '▶ ボタンを押すと、動いた行が光って結果が出る'));
          const RUN = [
            ['new SeminarBooking("田中").issueNo()', [3], false, '田中 の受付番号を発行', 'SeminarBooking は issueNo() を書いていないのに使える（親から継承）'],
            ['new SeminarBooking("田中").describe()', [7], false, 'セミナーの予約です', 'SeminarBooking の describe()（override）が動く'],
            ['new ConsultBooking("佐藤").describe()', [10], false, '相談の予約です', '同じ describe() でも ConsultBooking は別の中身'],
            ['new Booking("x")', [1], true, "error TS2511: Cannot create an instance of an abstract class.", 'abstract は「設計だけ」。直接 new はできない'],
          ];
          const runI = (i) => { const [lab, ln, bad, o, why] = RUN[i]; ccd.setHi([], 'on'); ccd.setHi([], 'err'); ccd.setHi(ln, bad ? 'err' : 'on'); cout.className = 'fo2-out ' + (bad ? 'e' : 'ok'); cout.replaceChildren(h('div', { class: 'mu' }, '> ' + lab), h('div', { class: bad ? 'er' : '' }, o), h('div', { class: 'mu' }, why)); };
          const cbtns = RUN.map(([lab], i) => h('button', { class: 'btn', onclick: () => runI(i) }, icon('play'), lab));
          let cbusy = false;
          const call = h('button', { class: 'btn primary', style: { '--c': 'var(--ts)' }, onclick: async () => { if (cbusy) return; cbusy = true; for (let i = 0; i < RUN.length; i++) { runI(i); await sleep(1200); } cbusy = false; } }, icon('play'), '順に実行');
          el.append(h('div', { class: 'fo2-panel' }, lbl('動かしてみよう：継承した機能は、ちゃんと動く？'), h('div', { class: 'fo2-2' }, ccd, h('div', { class: 'col' }, h('div', { class: 'fo2-ctl', style: { margin: 0 } }, cbtns, call), cout))));
        },
      },
      { t: 'super()：親を呼ぶ', tag: 'super', lead: '子クラスの constructor では <b>super()</b> が先。親→子の順にインスタンスが出来上がる様子を見よう。', render: superScene },
      {
        t: '実践：private の壁を越えよう', tag: 'PRACTICE', lead: 'ミッションは3つ。子クラス SeminarBooking から親の <code class="i">name</code> が見えない。修飾子を1語変えて直そう。',
        render(el) {
          el.append(tsPractice("class Booking {\n  constructor(private name: string) {} // ここを直す\n  describe(): string {\n    return `${this.name} さんの予約`;\n  }\n}\n\nclass SeminarBooking extends Booking {\n  describe(): string {\n    return `${this.name} さんのセミナー予約`; // ← 赤線\n  }\n}\n\nconst d = new SeminarBooking(\"田中\");\nconsole.log(d.describe());\n", (v, c, ed) => [
            { label: '① 赤線（name が見えない）をなくす', ok: ed && c.errors.length === 0 },
            { label: '② name の private をやめる（子から見える protected がおすすめ）', ok: ed && /(protected|public)\s+name/.test(nc(v)) },
            { label: '③ 実行して「田中 さんのセミナー予約」が出る', ok: ed && ranOk(c, (t) => t.some((x) => /田中 さんのセミナー予約/.test(x))) },
            { optional: true, label: '任意：Booking を abstract class にして、describe() を abstract メソッドにする（SeminarBooking が作る）', ok: ed && /abstract\s+class\s+Booking/.test(nc(v)) && /abstract\s+describe\s*\(/.test(nc(v)) && ranOk(c, (t) => t.some((x) => /田中 さんのセミナー予約/.test(x))) },
          ], "// 任意チャレンジ：Booking を abstract にして、describe() は子が必ず作る\nabstract class Booking {\n  constructor(protected name: string) {}\n  abstract describe(): string;\n}\n\nclass SeminarBooking extends Booking {\n  describe(): string {\n    return `${this.name} さんのセミナー予約`;\n  }\n}\n\nconst d = new SeminarBooking(\"田中\");\nconsole.log(d.describe());\n", 'TypeScript', [{"hint": ["SeminarBooking の中の this.name が赤線。Booking の name は private だよ。", "private は「Booking の中だけ」。子にも見せたいなら？"], "fix": [["private name", "protected name"]]}, {"hint": ["private の代わりに、子クラスまで OK になる言葉は？", "protected を使おう（public でも動くよ）。"], "fix": [["private name", "protected name"]]}, {"hint": ["直したら「▶ 実行」を押そう。", "「田中 さんのセミナー予約」と出れば OK。"], "fix": [["private name", "protected name"]]}, {"hint": ["「設計だけ」のクラスには abstract を付ける。メソッドにも付けられるよ。", "abstract class Booking { …; abstract describe(): string; } にして、SeminarBooking 側は今のまま describe() を書く。"], "fix": "// 任意チャレンジ：Booking を abstract にして、describe() は子が必ず作る\nabstract class Booking {\n  constructor(protected name: string) {}\n  abstract describe(): string;\n}\n\nclass SeminarBooking extends Booking {\n  describe(): string {\n    return `${this.name} さんのセミナー予約`;\n  }\n}\n\nconst d = new SeminarBooking(\"田中\");\nconsole.log(d.describe());\n"}], [{ level: 2, label: "ConsultBooking（Booking を継承）を作り、SeminarBooking と ConsultBooking を bookings 配列に入れて forEach で全員 describe() を出す", hint: ["SeminarBooking と同じ形で class ConsultBooking extends Booking を作る。describe() で「佐藤 相談予約」を返そう。", "const bookings: Booking[] = [new SeminarBooking(\"田中\"), new ConsultBooking(\"佐藤\")]; bookings.forEach((b) => console.log(b.describe()));"], ok: (v, c) => /class\s+ConsultBooking\s+extends\s+Booking/.test(nc(v)) && /Booking\s*\[\s*\]/.test(nc(v)) && /forEach\s*\(/.test(nc(v)) && ranOk(c, (t) => t.some((x) => /田中 さんのセミナー予約/.test(x)) && t.some((x) => /相談予約/.test(x))), code: "class Booking {\n  constructor(protected name: string) {}\n  describe(): string {\n    return `${this.name} さんの予約`;\n  }\n}\n\nclass SeminarBooking extends Booking {\n  describe(): string {\n    return `${this.name} さんのセミナー予約`;\n  }\n}\n\nconst d = new SeminarBooking(\"田中\");\nconsole.log(d.describe());\n\nclass ConsultBooking extends Booking {\n  describe(): string {\n    return `${this.name} さんの相談予約`;\n  }\n}\nconst bookings: Booking[] = [new SeminarBooking(\"田中\"), new ConsultBooking(\"佐藤\")];\nbookings.forEach((b) => console.log(b.describe()));\n", sol: "\n// 中級チャレンジ：親の型で子をまとめて扱う\nclass ConsultBooking extends Booking {\n  describe(): string {\n    return `${this.name} さんの相談予約`;\n  }\n}\nconst bookings: Booking[] = [new SeminarBooking(\"田中\"), new ConsultBooking(\"佐藤\")];\nbookings.forEach((b) => console.log(b.describe()));\n" }, { level: 3, label: "interface Describable を Booking に implements し、static count で作った数を数えて Booking.count = 2 を出す", hint: ["interface Describable { describe(): string } を作り、class Booking implements Describable にする。", "static count = 0; を Booking に置き、constructor の中で Booking.count++。new を2回してから console.log(Booking.count)。"], ok: (v, c) => /interface\s+Describable/.test(nc(v)) && /implements\s+Describable/.test(nc(v)) && /static\s+count/.test(nc(v)) && ranOk(c, (t) => t.some((x) => x.trim() === '2')), code: "interface Describable {\n  describe(): string;\n}\n\nclass Booking implements Describable {\n  static count = 0;\n  constructor(protected name: string) {\n    Booking.count++;\n  }\n  describe(): string {\n    return `${this.name} さんの予約`;\n  }\n}\n\nclass SeminarBooking extends Booking {\n  describe(): string {\n    return `${this.name} さんのセミナー予約`;\n  }\n}\n\nconst d = new SeminarBooking(\"田中\");\nconst d2 = new SeminarBooking(\"鈴木\");\nconsole.log(d.describe(), d2.describe());\nconsole.log(Booking.count); // 2\n", sol: "\n// 上級チャレンジ：implements と static\ninterface Describable {\n  describe(): string;\n}\nclass Counted implements Describable {\n  static count = 0;\n  constructor(protected name: string) {\n    Counted.count++;\n  }\n  describe(): string {\n    return `${this.name} さんの予約`;\n  }\n}\nnew Counted(\"A\");\nnew Counted(\"B\");\nconsole.log(Counted.count); // 2\n" }]));
        },
      },
    ],
  });

  /* ================= ts-generics ================= */
  K.reg({
    id: 'ts-generics', track: 'ts', title: 'ジェネリクス', sub: '型を引数にする', emoji: '📦',
    scenes: [
      {
        t: 'Box<T> マシン', tag: 'Generics', lead: 'API の結果を入れる <b>ApiResult&lt;T&gt;</b>。<b>T</b> は「何の結果か」をあとで決める型。ダイヤルで T を選び、データを入れてみよう。',
        render(el) {
          let T = 'Consultation'; const lit = { Consultation: '{ title: "相続" }', Lawyer: '{ name: "田中" }', Fee: '3000' };
          const tcol = { Consultation: 'var(--ts)', Lawyer: 'var(--basic)', Fee: 'var(--team)' };
          const mach = h('div', { class: 'tsx-mach' }), slot = h('div', { class: 'slot' }, '?'), title = h('div', { class: 'ti' }), out = h('div', { style: { minHeight: '2.4em' } });
          const cd = h('div'); let cur = lit.Consultation;
          const draw = () => {
            mach.style.setProperty('--c', tcol[T]); title.innerHTML = 'ApiResult&lt;<span class="T">' + T + '</span>&gt;';
            cd.replaceChildren(code('interface ApiResult<T> {\n  data: T;\n  error?: string;\n}\n\nconst res: ApiResult<' + T + '> = { data: ' + cur + ' };', 'ts'));
          };
          const dial = h('div', { class: 'tsx-seg', style: { '--c': 'var(--ts)' } }, ['Consultation', 'Lawyer', 'Fee'].map((t) => h('button', { class: t === T ? 'on' : '', onclick: (e) => { T = t; cur = lit[t]; slot.textContent = '?'; out.replaceChildren(); dial.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.textContent === t)); draw(); } }, t)));
          mach.append(title, slot);
          const bin = h('div', { class: 'row' }, [['{ title: "相続" }', 'Consultation'], ['{ name: "田中" }', 'Lawyer'], ['3000', 'Fee'], ['{ title: "離婚" }', 'Consultation'], ['{ name: "山本" }', 'Lawyer']].map(([v, ty]) => h('span', { class: 'tsx-chip', onclick: () => {
            if (ty === T) { cur = v; slot.textContent = v; mach.animate([{ transform: 'scale(1.06)' }, { transform: 'none' }], { duration: 300 }); out.replaceChildren(res(true, `ApiResult<${T}> に ${v} を入れた`)); draw(); }
            else { mach.classList.remove('shake'); void mach.offsetWidth; mach.classList.add('shake'); out.replaceChildren(res(false, `Type '${ty}' is not assignable to type '${T}'.`)); }
          } }, v)));
          draw();
          el.append(lbl('T を選ぶ'), dial, h('div', { class: 'split' }, h('div', { class: 'col' }, mach, lbl('入れるデータ（クリック）'), bin, out), cd));
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
          // 実際に値を入れてみる
          const VAL = [['42', 'number'], ['"hi"', 'string'], ['true', 'boolean']];
          let vi = 0, anyMode = false, dbusy = false;
          const vb = VAL.map(([v], i) => h('button', { class: 'btn', onclick: () => { vi = i; run(); } }, v));
          const mb = [['identity<T>', false], ['idAny（any）', true]].map(([t, m]) => h('button', { class: 'btn', onclick: () => { anyMode = m; run(); } }, t));
          const nIn = h('div', { class: 'fo2-node' }, h('b', '入力'), h('small', '')), nFn = h('div', { class: 'fo2-node' }, h('b', ''), h('small', '')), nOut = h('div', { class: 'fo2-node' }, h('b', '戻り値 r'), h('small', ''));
          const fl = h('div', { class: 'fo2-flow' }, nIn, h('span', { class: 'fo2-arrow' }, icon('arrow-right')), nFn, h('span', { class: 'fo2-arrow' }, icon('arrow-right')), nOut);
          const dcode = h('div'), dout = h('div', { class: 'fo2-out' });
          async function run() {
            const [v, ty] = VAL[vi]; const my = (run.t = (run.t || 0) + 1);
            vb.forEach((b, i) => b.classList.toggle('primary', i === vi)); mb.forEach((b, i) => b.classList.toggle('primary', (i === 1) === anyMode));
            const sig = anyMode ? 'function idAny(x: any): any {' : 'function identity<T>(x: T): T {';
            const call = anyMode ? 'idAny' : 'identity';
            const c = code(`${sig}\n  return x;\n}\nlet r = ${call}(${v});\nr.toUpperCase();`, 'ts', { file: 'id.ts', dim: true, color: 'var(--ts)' }); dcode.replaceChildren(c);
            const rt = anyMode ? 'any' : ty, ok = rt === 'string' || rt === 'any';
            const compileErr = !anyMode && ty !== 'string';
            const runErr = anyMode && ty !== 'string';
            nIn.className = nFn.className = nOut.className = 'fo2-node'; nIn.lastChild.textContent = v; nFn.firstChild.textContent = anyMode ? 'idAny' : 'identity<T>'; nFn.lastChild.textContent = anyMode ? 'x: any' : 'T = ' + ty; nOut.lastChild.textContent = ': ' + rt;
            dout.className = 'fo2-out'; dout.replaceChildren(h('span', { class: 'mu' }, '…'));
            const seq = [[nIn, [4]], [nFn, [1, 2, 3]], [nOut, [4]]];
            for (const [n, ln] of seq) { n.classList.add('on'); c.setHi(ln); await sleep(450); if (my !== run.t) return; }
            [nIn, nFn, nOut].forEach((n) => n.classList.remove('on')); c.setHi([5], compileErr ? 'err' : 'on'); nOut.classList.add(compileErr || runErr ? 'bad' : 'ok');
            const lines = [h('div', { class: 'mu' }, `r の型：${rt}`)];
            if (compileErr) lines.push(h('div', { class: 'er' }, `error TS2339: Property 'toUpperCase' does not exist on type '${rt}'.（実行前に赤線で気づける）`));
            else if (runErr) lines.push(h('div', { class: 'er' }, 'TypeError: r.toUpperCase is not a function（型エラーは出ない → 実行して初めて落ちる）'));
            else lines.push(h('div', null, '› "HI"'));
            dout.className = 'fo2-out ' + (compileErr ? 'e' : runErr ? 'e' : 'ok'); dout.replaceChildren(...lines);
          }
          run();
          el.append(h('div', { class: 'fo2-panel' }, lbl('試してみよう：値を入れて、戻り値の型を見る'), h('div', { class: 'fo2-ctl', style: { margin: 0 } }, h('span', { class: 'fo2-k' }, '入れる値：'), vb, h('span', { class: 'fo2-k' }, '関数：'), mb), fl, h('div', { class: 'fo2-2' }, dcode, dout)));
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
          ], "function first<T>(arr: T[]): T {\n  return arr[0];\n}\n\nconst n = first([10, 20]);   // number\nconst s = first([\"a\", \"b\"]); // string\nconsole.log(n, s);\n\n// 任意チャレンジ：長いほうを返す（length を持つものだけ）\nfunction longest<T extends { length: number }>(a: T, b: T): T {\n  return a.length >= b.length ? a : b;\n}\nconsole.log(longest(\"abc\", \"de\")); // abc\n", 'TypeScript', [{"hint": ["関数名のうしろに <T> を付ける。", "function first<T>(…) の形にしよう。"], "fix": [["function first(arr: any[]): any {", "function first<T>(arr: any[]): any {"]]}, {"hint": ["any[] を「T の配列」にすると？", "引数は T[]、戻り値は T にしよう。"], "fix": [["function first(arr: any[]): any {", "function first<T>(arr: T[]): T {"]]}, {"hint": ["直したら「▶ 実行」を押そう。", "10 と a が出れば OK。"], "fix": [["function first(arr: any[]): any {", "function first<T>(arr: T[]): T {"]]}, {"hint": ["「.length を持つ T だけ」にするには、T に条件を付ける（extends）。", "function longest<T extends { length: number }>(a: T, b: T): T { return a.length >= b.length ? a : b; }"], "fix": "function first<T>(arr: T[]): T {\n  return arr[0];\n}\n\nconst n = first([10, 20]);   // number\nconst s = first([\"a\", \"b\"]); // string\nconsole.log(n, s);\n\n// 任意チャレンジ：長いほうを返す（length を持つものだけ）\nfunction longest<T extends { length: number }>(a: T, b: T): T {\n  return a.length >= b.length ? a : b;\n}\nconsole.log(longest(\"abc\", \"de\")); // abc\n"}], [{ level: 2, label: "interface Box<T> { value: T } を作り、unbox<T>(b: Box<T>): T で 42 と \"hi\" を取り出す", hint: ["Box<T> は「T が入った箱」。value: T を持つ interface にする。", "function unbox<T>(b: Box<T>): T { return b.value; } を unbox({ value: 42 }) と unbox({ value: \"hi\" }) で呼ぶ。"], ok: (v, c) => /interface\s+Box\s*<\s*T\s*>/.test(nc(v)) && /unbox\s*<\s*T\s*>/.test(nc(v)) && ranOk(c, (t) => t.some((x) => x.trim() === '42') && t.some((x) => x.trim() === 'hi')), code: "function first<T>(arr: T[]): T {\n  return arr[0];\n}\n\nconst n = first([10, 20]);\nconst s = first([\"a\", \"b\"]);\nconsole.log(n, s);\n\ninterface Box<T> {\n  value: T;\n}\nfunction unbox<T>(b: Box<T>): T {\n  return b.value;\n}\nconsole.log(unbox({ value: 42 }));   // 42\nconsole.log(unbox({ value: \"hi\" })); // hi\n", sol: "\n// 中級チャレンジ：ジェネリックな interface\ninterface Box<T> {\n  value: T;\n}\nfunction unbox<T>(b: Box<T>): T {\n  return b.value;\n}\nconsole.log(unbox({ value: 42 }));   // 42\nconsole.log(unbox({ value: \"hi\" })); // hi\n" }, { level: 3, label: "pluck<T, K extends keyof T>(obj, key) を作り、pluck({ name: \"Lam\", age: 20 }, \"name\") と \"age\" を出す", hint: ["戻り値の型を「T のキー K の値の型」にするには T[K]。K は keyof T に制限する。", "function pluck<T, K extends keyof T>(obj: T, key: K): T[K] { return obj[key]; }"], ok: (v, c) => /K\s+extends\s+keyof\s+T/.test(nc(v)) && /T\s*\[\s*K\s*\]/.test(nc(v)) && ranOk(c, (t) => t.some((x) => x.trim() === 'Lam') && t.some((x) => x.trim() === '20')), code: "function first<T>(arr: T[]): T {\n  return arr[0];\n}\n\nconst n = first([10, 20]);\nconst s = first([\"a\", \"b\"]);\nconsole.log(n, s);\n\nfunction pluck<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\nconst user = { name: \"Lam\", age: 20 };\nconsole.log(pluck(user, \"name\")); // Lam\nconsole.log(pluck(user, \"age\"));  // 20\n", sol: "\n// 上級チャレンジ：keyof で安全なプロパティ取得\nfunction pluck<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}\nconst user = { name: \"Lam\", age: 20 };\nconsole.log(pluck(user, \"name\")); // Lam\nconsole.log(pluck(user, \"age\"));  // 20\n" }]));
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
          let API = null, tk = 0;
          const setLight = (g) => { light.className = 'tsx-light ' + (g ? 'g' : 'r'); light.replaceChildren(h('b', g ? '🟢' : '🔴'), g ? 'PASS' : 'FAIL'); };
          const showList = async (n, anim) => {
            const my = ++tk; const g = R[n].every((r) => r[1] === 'ok');
            const rows = R[n].map(([t, k, m]) => h('div', { class: 'tsx-t ' + k }, h('i', k === 'ok' ? '✓' : '✖'), t, m ? h('em', m) : null));
            if (!anim) { list.replaceChildren(...rows); setLight(g); return; }
            list.replaceChildren(); light.className = 'tsx-light'; light.replaceChildren(h('b', '…'), 'RUN');
            for (const r of rows) { await sleep(550); if (my !== tk) return; list.append(r); }
            await sleep(350); if (my !== tk) return; setLight(g);
          };
          const runBtn = h('button', { class: 'btn primary', style: { '--c': 'var(--ts)', justifySelf: 'start' }, onclick: () => API && showList(API.cur, true) }, icon('play'), 'テストを実行');
          el.append(stepper({
            color: 'var(--ts)',
            steps: [{ say: '🔴 <b>Red</b>：まずテストを書く。実装が無いので失敗。' }, { say: '🟢 <b>Green</b>：テストが通る最小の<b>実装</b>（＝中身のコード）を書く。' }, { say: '🔴 要望が増えた：「マイナスは 0 にして」→ テストを足すと赤。' }, { say: '🟢 実装を直して全部緑。<b>以前のテストも守られている</b>のが安心ポイント。' }],
            init(vis, api) { API = api; vis.append(h('div', { class: 'split r2b-top' }, left, h('div', { class: 'col' }, lbl('いまの段階'), phase, light, list, runBtn))); },
            update(n) {
              const tc = code(TS[n], 'ts', { color: 'var(--ts)' }), ic = code(IM[n], 'ts', { color: 'var(--basic)' });
              tc.setHi(n === 0 ? [1, 2, 3] : n === 2 ? [5, 6, 7] : []); ic.setHi(n === 1 ? [1, 2, 3] : n === 3 ? [2] : []);
              left.replaceChildren(lbl('sum.test.ts'), tc, lbl('sum.ts'), ic);
              showList(n, false);
              const cur = PH[n]; phase.replaceChildren(K.W.mini({ k: 'flow', items: [{ i: 'x', t: 'Red 失敗', c: cur === 0 ? 'bad' : '' }, { i: 'check', t: 'Green 成功', c: cur === 1 ? 'ok' : '' }, { i: 'sparkles', t: 'Refactor 整える', c: n === 3 ? 'hi' : '' }], loop: '要望が増えたらまた Red から' }));
            },
          }));
        },
      },
      {
        t: 'テストの型：Arrange → Act → Assert', tag: 'AAA', lead: 'どのテストも<b>3ステップ</b>。コードのどの行がどれか見てみよう。',
        render(el) {
          let exp = 1000, curA = 0, API = null, abusy = false, pre;
          const preHost = h('div');
          const build = () => {
            pre = code(`it("商品を追加すると合計が出る", () => {\n  // Arrange（準備）\n  const cart = new Cart();\n\n  // Act（実行）\n  cart.add({ name: "PC", price: 1000 });\n\n  // Assert（確認）\n  expect(cart.total()).toBe(${exp});\n});`, 'ts', { dim: true, color: 'var(--ts)' });
            preHost.replaceChildren(pre);
          };
          const A = ['準備', '実行', '確認'].map((t, i) => h('div', h('b', icon(['wrench', 'play', 'search'][i])), ['Arrange', 'Act', 'Assert'][i], h('small', { style: { display: 'block', fontSize: '.75rem', color: 'var(--mute)' } }, t)));
          const aaa = h('div', { class: 'tsx-aaa', style: { '--c': 'var(--ts)' } }, A);
          const lines = [[2, 3], [5, 6], [8, 9]];
          const itemsEl = h('div', { class: 'fo2-k' }), totalEl = h('b'), verdict = h('div', { class: 'fo2-out' });
          const cartBox = h('div', { class: 'fo2-node', style: { textAlign: 'left' } }, h('b', 'cart（カート）'), itemsEl, h('div', { class: 'fo2-k' }, 'total() ＝ ', totalEl));
          const L = (t, c) => h('div', { class: c || '' }, t);
          const apply = (n) => {
            curA = n; build(); pre.setHi(lines[n]);
            A.forEach((a, i) => a.classList.toggle('on', i === n));
            itemsEl.textContent = n === 0 ? 'items: [ ]（空）' : 'items: [ PC ¥1000 ]'; totalEl.textContent = n === 0 ? '0' : '1000';
            if (n === 0) { verdict.className = 'fo2-out'; verdict.replaceChildren(L('const cart = new Cart()', 'mu'), L('→ 空のカートができた')); }
            if (n === 1) { verdict.className = 'fo2-out'; verdict.replaceChildren(L('cart.add({ name: "PC", price: 1000 })', 'mu'), L('→ カートに PC が入り、total() は 1000')); }
            if (n === 2) { const ok = exp === 1000; verdict.className = 'fo2-out ' + (ok ? 'ok' : 'e'); if (!ok) pre.setHi([9], 'err');
              verdict.replaceChildren(L(`expect(1000).toBe(${exp})`, 'mu'), ok ? L('✓ PASS（期待どおり）') : L(`✖ FAIL  期待 ${exp} / 実際 1000`, 'er')); }
          };
          const expIn = h('input', { class: 'fo2-in', type: 'number', value: exp, 'aria-label': '期待する合計', style: { width: '6em' }, oninput: () => { exp = +expIn.value || 0; apply(curA); } });
          const play = h('button', { class: 'btn primary', style: { '--c': 'var(--ts)' }, onclick: async () => { if (abusy || !API) return; abusy = true; for (let i = 0; i < 3; i++) { API.go(i); await sleep(1100); } abusy = false; } }, icon('play'), 'テストを実行');
          el.append(h('div', { class: 'fo2-ctl' }, h('span', { class: 'fo2-k' }, '期待する合計 toBe('), expIn, h('span', { class: 'fo2-k' }, ')'), play));
          el.append(stepper({
            color: 'var(--ts)',
            steps: [{ say: '<b>Arrange</b>：テスト対象と材料を用意する。' }, { say: '<b>Act</b>：テストしたい操作を<b>1つだけ</b>実行。' }, { say: '<b>Assert</b>：結果が期待通りか <code class="i">expect</code> で確認。期待の数字を変えて、FAIL も見てみよう。' }],
            init(vis, api) { API = api; vis.append(aaa, h('div', { style: { height: '12px' } }), h('div', { class: 'fo2-2' }, preHost, h('div', { class: 'col' }, cartBox, verdict))); },
            update(n) { apply(n); },
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
          const html = '<style>.t{font:700 14px/1.6 monospace;padding:4px 8px;border-radius:6px;margin:3px 0}.ok{background:#d7f7df;color:#166534}.ng{background:#fde2e2;color:#991b1b}</style>\n<div id="out"></div>\n<script>\nconst T=[];function it(n,f){T.push([n,f])}\nfunction expect(a){return{toBe:function(b){if(!Object.is(a,b))throw Error("期待 "+JSON.stringify(b)+" / 実際 "+JSON.stringify(a))}}}\naddEventListener("load",function(){T.forEach(function(t){var ok=1,m="";try{t[1]()}catch(e){ok=0;m=e.message}out.insertAdjacentHTML("beforeend","<div class=\\"t "+(ok?"ok":"ng")+"\\">"+(ok?"✓ ":"✖ ")+t[0]+" "+m+"</div>")})});\n\n// ===== テスト =====\nit("calcTotal(1000, 100) は 1100", function(){ expect(calcTotal(1000, 100)).toBe(1100); });\nit("calcTotal(0, 0) は 0", function(){ expect(calcTotal(0, 0)).toBe(0); });\n<\/script>\n';
          const js = '// ① ここを直す：「金額 + 税」のはずが引き算になっている\nfunction calcTotal(price, tax) {\n  return price - tax;\n}\n\n// ② ここに calcSubtotal(price, qty) を作る（単価 × 数量を返す）\n';
          el.append(playground({
            title: 'Jest 風', mode: 'web', height: 300,
            files: [{ name: 'main.js', lang: 'js', code: js }, { name: 'test.html', lang: 'html', code: html }],
            solution: { 'main.js': 'function calcTotal(price, tax) {\n  return price + tax;\n}\n\nfunction calcSubtotal(price, qty) {\n  return price * qty;\n}\n\n// 任意チャレンジ：0人なら "エラー" を返す（割り勘）\nfunction splitFee(total, people) {\n  if (people === 0) return "エラー";\n  return total / people;\n}\n\n// 中級チャレンジ：成人かどうか（18歳以上）\nfunction isAdult(age) {\n  return age >= 18;\n}\n\n// 上級チャレンジ：料金の平均（空の配列は 0）\nfunction average(arr) {\n  if (arr.length === 0) return 0;\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) total += arr[i];\n  return total / arr.length;\n}\n', 'test.html': html.replace(/<\/script>\s*$/, 'it("calcSubtotal(500, 3) は 1500", function(){ expect(calcSubtotal(500, 3)).toBe(1500); });\nit("splitFee(6000, 3) は 2000", function(){ expect(splitFee(6000, 3)).toBe(2000); });\nit("splitFee(1000, 0) は エラー", function(){ expect(splitFee(1000, 0)).toBe("エラー"); });\n<\/script>\n') },
            tasks: (v, c) => {
              const d = c.doc && c.doc(); const q = (x) => (d ? d.querySelectorAll(x).length : 0);
              const w = d && d.defaultView; const ev = (e) => { try { return w.eval(e); } catch (_) { return undefined; } };
              const tests = (v['test.html'].match(/\bit\(/g) || []).length;
              return [
                { label: '① calcTotal のバグを直す（テストが全部 ✓ になる）', ok: q('#out .t') > 0 && q('#out .ng') === 0 && ev('calcTotal(1000, 100)') === 1100, hint: ['calcTotal は「金額 + 税」のはずなのに、price - tax になっているよ。', '- を + に変えよう。'], answer: { code: js.replace('price - tax', 'price + tax'), lang: 'js', mode: 'replace' } },
                { label: '② calcSubtotal(price, qty) を作る（500円 × 3個 が 1500 になる）', ok: ev('calcSubtotal(500, 3)') === 1500, hint: ['calcTotal と同じ形の関数をもう1つ作る。', 'function calcSubtotal(price, qty) { return price * qty; }'], answer: { code: js + 'function calcSubtotal(price, qty) {\n  return price * qty;\n}\n', lang: 'js', mode: 'replace' } },
                { label: '③ calcSubtotal のテストを test.html に1つ足す', ok: tests >= 3 && /calcSubtotal/.test(v['test.html'].split('テスト =====')[1] || '') && q('#out .ng') === 0, hint: ['test.html の一番下に、it(...) の行をもう1つ足す。', 'it("calcSubtotal(500, 3) は 1500", function(){ expect(calcSubtotal(500, 3)).toBe(1500); });'], answer: { code: html.replace(/<\/script>\s*$/, 'it("calcSubtotal(500, 3) は 1500", function(){ expect(calcSubtotal(500, 3)).toBe(1500); });\n<\/script>\n'), lang: 'html', mode: 'replace' } },
                { optional: true, level: 1, label: 'splitFee(total, people) を作る（割り勘。0人なら "エラー" を返す）', ok: ev('splitFee(6000, 3)') === 2000 && ev('splitFee(1000, 0)') === 'エラー', hint: ['「人数が 0 のとき」を先に if で分けて、"エラー" を返す。', 'function splitFee(total, people) { if (people === 0) return "エラー"; return total / people; }。できたら test.html にも splitFee のテストを足してみよう。'], answer: { code: js.replace('price - tax', 'price + tax') + 'function calcSubtotal(price, qty) {\n  return price * qty;\n}\n\n' + 'function splitFee(total, people) {\n  if (people === 0) return "エラー";\n  return total / people;\n}\n', lang: 'js', mode: 'replace' } },
                { optional: true, level: 2, label: 'isAdult(age) を作る（18歳以上なら true。ちょうど18歳も含む！）', ok: ev('isAdult(20)') === true && ev('isAdult(17)') === false && ev('isAdult(18)') === true, hint: ['「18歳以上」は 18 を含む。比べる記号は >= 。', 'function isAdult(age) { return age >= 18; }。ちょうど18歳が true になるか確かめよう。'], answer: { code: js.replace('price - tax', 'price + tax') + 'function calcSubtotal(price, qty) {\n  return price * qty;\n}\n\n' + 'function isAdult(age) {\n  return age >= 18;\n}\n', lang: 'js', mode: 'replace' } },
                { optional: true, level: 3, label: 'average(arr) を作る（配列の平均。空の配列 [] のときは 0）', ok: ev('average([2, 4, 6])') === 4 && ev('average([1, 2])') === 1.5 && ev('average([])') === 0, hint: ['平均 ＝ 合計 ÷ 個数。でも空の配列は「0 で割る」ことになってしまう。', 'if (arr.length === 0) return 0; を先に書き、for で合計を出して arr.length で割る。'], answer: { code: js.replace('price - tax', 'price + tax') + 'function calcSubtotal(price, qty) {\n  return price * qty;\n}\n\n' + 'function average(arr) {\n  if (arr.length === 0) return 0;\n  let total = 0;\n  for (let i = 0; i < arr.length; i++) total += arr[i];\n  return total / arr.length;\n}\n', lang: 'js', mode: 'replace' } },
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
      'そのバグ、どこで見つかる？': { problem: '料金の計算に、フォームの「5000」が<b>文字のまま</b>渡った。画面には「請求額 5000500円」。気づいたのは、お客さまからの問い合わせ（本番）', idea: '「ここは数字だけ」と先に書いておく。間違えた<b>その瞬間</b>に、エディタが赤線で教えてくれる', answer: 'TypeScript の<b>型</b>', when: [['使い捨ての小さなスクリプト', 'JS のままでもOK'], ['チーム開発・長く育てるアプリ', 'TypeScript が効く']] },
      'TS は JS に変換される': { problem: 'ブラウザは .ts を読めない。型を書いたコードを、そのまま本番に置くと動かない', idea: '型は「チェック用のメモ」。チェックしたら消して、ふつうの JS にしてから公開する', answer: '<code>tsc</code>（チェックして JS を作る）', when: '型は実行時には残らない。実行中に入ってきた値の確認は、別のコードが必要。' },
    },
    'ts-basic': {
      '型アノテーションの読み方': { problem: '申込フォームの「年齢」に文字が入った。計算は <code>NaN</code> になり、画面に「NaN歳」。動かすまで、誰も気づけない', idea: '「この箱は数字だけ」と、最初に1回書いておく', answer: '<code>変数名: 型</code>（型アノテーション）', when: [['初期値から型が分かる変数', '書かなくてOK（推論）'], ['関数の引数・戻り値', '必ず書く']] },
      '型の箱に値を入れよう': { problem: 'フォームの値はぜんぶ<b>文字</b>。参加人数 <code>"3"</code> に 2 を足したら <code>"32"</code>（32人！）になり、料金が10倍以上に', idea: '数字は number、文字は string…と、入れる物ごとに箱の種類を先に決めておく', answer: '<code>number</code> / <code>string</code> / <code>boolean</code>', when: [['数・計算', 'number'], ['文字・表示', 'string'], ['はい / いいえ', 'boolean']] },
      'const / let と型推論': { problem: '消費税率がどこかで書き換わり、請求書の税額が <b>0円</b>に。原因は200行先の1行。探すだけで半日かかった', idea: '「変わらない」か「変わる」かを最初に書く。変わらない物は、機械が守ってくれる', answer: '<code>const</code>＝再代入禁止 / <code>let</code>＝再代入OK', when: [['再代入しない（ほとんどこれ）', 'const'], ['カウンタ・合計など変化する', 'let'], ['迷ったら', 'まず const']] },
      '型推論：どこまで書く？': { problem: 'レビューで「型だらけで読めない」と指摘された。逆に、引数の型を省いたら <code>any</code> になり、間違った呼び出しが通ってしまった', idea: '値が入ってくる所（引数）と出ていく所（戻り値）だけ書く。中は推論にまかせる', answer: '引数・戻り値には書く／中の変数には書かない', when: [['関数の引数', '必ず書く'], ['関数の戻り値', '書くのがおすすめ'], ['const x = 10 などローカル', '書かない（推論）']] },
      '配列・タプル・オブジェクト': { problem: 'API が返す相談の行データ <code>["離婚相談", 3000, true]</code>。<code>row[1]</code> が料金か件数か分からず、数字に <code>toUpperCase()</code> を呼んで画面が落ちた', idea: '1つ1つの値ではなく、まとまりの形に型を付ける', answer: '<code>T[]</code> / タプル / <code>interface</code>', when: [['同じ種類が並ぶ', '配列 string[]'], ['位置ごとに意味が違う固定の組', 'タプル'], ['名前付きの項目の集まり', 'オブジェクト（interface）']] },
      'any と unknown': { problem: '外部 API の JSON を <code>any</code> で受けた。相手が項目名を変えたのに赤線は出ず、<b>本番で画面が真っ白</b>に', idea: '分からない値は「何でもOK」にしない。使う前に確かめさせる', answer: '<code>unknown</code> ＋ 型の確認', when: [["本当に何でも通す（できれば避ける）", "any"], ["外から来た値・JSON", "unknown → 確かめる"]] },
      '値がない型：void / undefined / null': { problem: 'ログインしていない人の名前を表示しようとして <code>Cannot read properties of undefined</code>。ログイン前の画面が<b>真っ白</b>になった', idea: '「値がないかも」を型にはっきり書く。使う前に確かめさせる', answer: '<code>string | null</code> と if チェック', when: [['戻り値がない関数', 'void'], ['まだ決まっていない', 'undefined'], ['意図的に「空」', 'null']] },
    },
    'ts-types': {
      'Union：どれか1つ': { problem: '相談IDが、古いデータは数字（<code>101</code>）、新しいデータは文字（<code>"C-101"</code>）。<code>any</code> にしたら、文字に <code>toFixed()</code> を呼んで本番でエラー', idea: '来てよい型だけを並べる。使うときは if で1つに決める', answer: 'Union 型 <code>A | B</code>', when: [['選択肢が決まっている', 'Union'], ['何が来るか分からない', 'unknown（any は避ける）']] },
      'Enum：名前の付いた定数': { problem: 'コードに <code>setStatus(2)</code> と書いてある。2 は「対応中」？「完了」？ 読む人が分からず、<code>9</code> を入れても通ってしまう', idea: '数字に名前を付ける（<code>Status.Reviewing</code> など）', answer: '<code>enum</code> / 文字列 Union', when: [['関連する定数のグループ', 'enum'], ['値が少なく単純', '"up" | "down"（Union）']] },
      'interface：形チェッカー': { problem: 'API の項目名は <code>title</code> なのに <code>tilte</code> と typo。画面の見出しが <b>undefined</b> のまま公開された', idea: 'オブジェクトの形を先に書いておく。合わなければ赤線が出る', answer: '<code>interface</code>', when: [['必ずある', 'そのまま書く'], ['あってもなくても', '?（省略可）'], ['後から変えない', 'readonly']] },
      'extends と merge': { problem: '「相談」と「予約」に同じ項目（id・title）をコピペ。片方だけ直したら、画面で値がズレた', idea: '共通の部分は1か所に書く。違う所だけ足す', answer: '<code>extends</code>（引き継ぐ）/ 宣言マージ', when: [['自分で拡張したい', 'extends'], ['外部ライブラリの型を補う', '宣言マージ']] },
      'interface vs type': { problem: '同僚は <code>type</code>、自分は <code>interface</code>。どちらでも動くので、レビューのたびに議論になる', idea: 'オブジェクトの形か、それ以外かで決める', answer: '目安：オブジェクト → interface ／ それ以外 → type', when: [['オブジェクト・クラスの形', 'interface'], ['Union・タプル・関数型', 'type']] },
    },
    'ts-class': {
      'クラス = 設計図、new = スタンプ': { problem: '予約のデータと「キャンセルする」処理を、画面ごとにコピペ。ルールが変わるたびに、全部の画面を探して回る', idea: '設計図を1つ作って、そこから何個でも作る', answer: '<code>class</code> ＋ <code>new</code>', when: [['同じ形が何個も必要', 'class'], ['1個だけ・データだけ', 'オブジェクトリテラル']] },
      'アクセス修飾子：誰が触れる？': { problem: '請求の <code>fee</code> がどこからでも書き換えられる。誰かが <code>fee = 0</code> にして、<b>請求が0円</b>に。犯人が見つからない', idea: '触れる人を、必要な範囲だけにする', answer: '<code>public</code> / <code>protected</code> / <code>private</code>', when: [['外に公開する窓口', 'public'], ['子クラスにだけ見せる', 'protected'], ['内部のしくみ（基本これ）', 'private']] },
      'readonly：書き換え禁止': { problem: '処理の途中で相談 ID が書き換わり、<b>別の人の相談</b>に履歴が付いてしまった', idea: '変えたくない物は、型で書き換え禁止にする', answer: '<code>readonly</code>', when: [['生成時に決まって不変', 'readonly'], ['途中で変わる', '通常のプロパティ']] },
      'getter / setter：門番を置く': { problem: '予約人数に <code>-5</code> が入り、料金が<b>マイナス請求</b>に。<code>private</code> にすると今度は読めない', idea: '直接は触らせない。窓口（get / set）でチェックしてから通す', answer: '<code>get</code> / <code>set</code>', when: [['チェックが必要・計算で出す値', 'getter / setter'], ['検証不要の単純な値', 'public プロパティでOK']] },
      '継承：親から子へ': { problem: '相談予約とセミナー予約に、同じ「受付番号を作る」処理をコピペ。ルール変更で片方の直し忘れが出た', idea: '共通の部分は親に、違う所だけ子に書く', answer: '<code>extends</code>（引き継ぐ）＋ <code>abstract</code>', when: [['「A は B の一種」（is-a）', 'extends'], ['「A は B を持っている」（has-a）', 'フィールドで持つ']] },
      'super()：親を呼ぶ': { problem: '子クラスで親より先に <code>this</code> を使い、親の項目（受付番号）が<b>空のまま</b>保存された', idea: '親を先に作ってから、子の分を作る', answer: '<code>super(...)</code>', when: '子の constructor では、<code>this</code> を使う前に必ず <code>super()</code> を呼ぶ。' },
    },
    'ts-generics': {
      'Box<T> マシン': { problem: 'API の結果を入れる入れ物を、型ごとに複製（相談用・弁護士用・料金用…）。項目を1つ足すたび、全部を直して回る', idea: '型は「あとで決める」ことにして、入れ物は1つだけ作る', answer: '<code>Box&lt;T&gt;</code>', when: [['形は同じで型だけ違う', 'ジェネリクス'], ['型が1つに決まっている', '普通の型でOK']] },
      'identity<T>：入れた型が出てくる': { problem: '共通の関数を <code>any</code> で作ったら、戻り値の型が消えた。<code>lawyer.nmae</code> の typo も、赤線が出ずに本番へ', idea: '入れた型を、そのまま出てくる型にする', answer: '<code>function f&lt;T&gt;(x: T): T</code>', when: [['入れた型＝出てくる型にしたい', '&lt;T&gt;'], ['型を気にしない', 'そもそも関数を見直す']] },
      'Array<T> と制約 extends': { problem: '「入力が空なら弾く」共通チェックを作りたい。<code>T</code> のままだと <code>.length</code> が赤線になる', idea: 'T に最低限の条件を付けて、使える操作を決める', answer: '<code>T extends { length: number }</code>', when: [['何でもよい', 'T'], ['ある性質が必要', 'T extends …']] },
    },
    'ts-test': {
      'なぜテストを書くの？': { problem: '消費税の計算を直したら、<b>別の画面の請求額</b>がズレた。全画面を手で確かめるのは無理で、お客さまに指摘されて気づいた', idea: '確認する作業を、コードにして自動にする', answer: '単体テスト（Unit Test）', when: [['ロジックのある関数', 'テストを書く'], ['見た目だけの小変更', '手動確認でOK']] },
      'テストの種類': { problem: '全部を画面操作のテストにしたら、1回に30分かかり、画面を少し変えるだけで毎回壊れる', idea: '速くて小さいテストをたくさん。遅くて大きいテストは少しだけ', answer: 'テストピラミッド', when: [['関数・ロジック', 'ユニット'], ['モジュールの連携', '結合'], ['ユーザー操作の通し', 'E2E']] },
      'ユニットテストの流れ': { problem: '割引を足したいが、既存の請求計算にテストが無く、<b>直すのが怖い</b>。結局、誰も触れなくなった', idea: '書く → 実行 → 確かめる → 直す、を1つずつ回す', answer: 'ユニットテストの流れ', when: '機能ができたあと・バグを直したあと・設計を変えたあとに実行する。' },
      'Vitest をセットアップ': { problem: 'テストを書いたのに、<code>npm run test</code> すると「<code>Missing script: "test"</code>」。チームの誰も動かせず、CI も止まった', idea: '道具を入れて、<code>test</code> コマンドを登録する。1つのコマンドで全部のテストが走るようにする', answer: '<code>npm i -D vitest</code> ＋ <code>npm run test</code>', when: '開発用の道具なので、<code>-D</code>（devDependencies）に入れる。' },
      'TDD：赤 → 緑 → 赤 → 緑': { problem: '「会員は10%引き」と聞いて作ったあと、「1万円以上のときだけ」と分かった。<b>作ってから仕様の食い違い</b>に気づいた', idea: '先にテストを書いて「やりたいこと」を決める。そのテストが通るコードを書く', answer: 'Red → Green → Refactor', when: [['やりたいことがはっきりしている', 'TDD が向く'], ['試行錯誤の探索', '後からテストでもOK']] },
      'テストの型：Arrange → Act → Assert': { problem: 'テストの書き方がバラバラ。失敗しても「何を確かめるテストか」が読めず、原因探しに時間がかかった', idea: 'どのテストも3段（準備 → 実行 → 確認）にそろえる', answer: 'Arrange（準備）→ Act（実行）→ Assert（確かめる）', when: '1つのテストでは、確認することを1つに絞る。' },
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
  const T = (file, text, o = {}) => Object.assign({ k: 'code', lang: 'ts', file, text }, o);
  const MINI = {
    'ts-intro': {
      'そのバグ、どこで見つかる？': { problem: '請求額が「5000500円」。気づいたのは本番', idea: '先に「数字だけ」と書いておく', answer: '書いた瞬間に <b>赤線</b>',
        pv: T('total.js', 'function calcTotal(price, tax) {\n  return price + tax;\n}\ncalcTotal("5000", 500); // "5000500"', { lang: 'js', err: [4], keys: { 4: 'bug' } }),
        iv: T('total.ts', 'function calcTotal(price: number,\n                  tax: number) {\n  return price + tax;\n}\n// 型で「数字だけ」と宣言', { idea: [1, 2], keys: { 1: 'bug' } }),
        av: T('total.ts', 'calcTotal("5000", 500);\n// 書いた瞬間に赤線が出る\n// 本番に出る前に直せる', { ok: [1], keys: { 1: 'bug' } }) },
      'TS は JS に変換される': { problem: '.ts をそのまま置くと本番で動かない', idea: '型を消して、ふつうの JS にする', answer: '<code>tsc</code> が JS に変換',
        pv: T('index.html', '<script src="main.ts"></script>\n<!-- ✖ ブラウザは .ts を読めない -->', { lang: 'html', err: [1], keys: { 1: 'tsc' } }),
        iv: T('main.ts', 'let fee: number = 5000;\n//  ↓ tsc が型を消す\nlet fee = 5000;', { idea: [2, 3], keys: { 2: 'tsc' } }),
        av: T('terminal', '$ npm run build   # 中で tsc が動く\n# → main.js ができる\n$ 公開するのはこの main.js', { lang: 'sh', ok: [1], keys: { 1: 'tsc' } }) },
    },
    'ts-basic': {
      '型アノテーションの読み方': { problem: '画面に「NaN歳」が出る', idea: '「この箱は数字だけ」と札を付ける', answer: '<code>変数名: 型</code>',
        pv: T('age.js', 'let age = 20;\nage = "二十歳"; // フォームの入力\nage * 2; // NaN → 画面に NaN歳', { lang: 'js', err: [3], keys: { 3: 'ann' } }),
        iv: T('age.ts', 'let age: number = 20;\n//     ^^^^^^^^ 数字だけの札', { idea: [1], keys: { 1: 'ann' } }),
        av: T('age.ts', 'let age: number = 20;\nage = "二十歳"; // ✖ 赤線', { err: [2], ok: [1], keys: { 1: 'ann' } }) },
      '型の箱に値を入れよう': { problem: '人数 "3" + 2 が "32" 人になる', idea: '数字は number、文字は string と決める', answer: '<code>number</code> / <code>string</code> / <code>boolean</code>',
        pv: T('people.js', 'const people = form.people; // "3"（文字）\nconst extra = 2;\npeople + extra; // "32"（くっつく）', { lang: 'js', err: [3], keys: { 3: 'kind' } }),
        iv: T('people.ts', 'let people: string = "3";\nlet extra: number = 2;\n// 入れる物ごとに箱を決める', { idea: [1, 2], keys: { 1: 'kind' } }),
        av: T('people.ts', 'const people: number = Number(form.people);\nconst extra: number = 2;\npeople + extra; // 5', { ok: [1, 2], keys: { 1: 'kind' } }) },
      'const / let と型推論': { problem: '税額が0円に。原因は200行先', idea: '変わる物は let、変わらない物は const', answer: '<code>const</code> は再代入すると止まる',
        pv: T('tax.js', 'let tax = 0.1;\n// …200行あと…\ntax = 0; // いつの間にか 税額0円', { lang: 'js', err: [3], keys: { 3: 'const' } }),
        iv: T('tax.ts', 'const tax = 0.1; // 変わらない\nlet count = 0;   // 変わる\ncount++;', { idea: [1], keys: { 1: 'const' } }),
        av: T('tax.ts', 'const tax = 0.1;\ntax = 0; // ✖ 書いた瞬間に止まる\nlet count = 0; count++; // OK', { err: [2], ok: [3], keys: { 2: 'const' } }) },
      '型推論：どこまで書く？': { problem: '型だらけで読めない。でも省くと any', idea: '入口と出口に書く。中は推論', answer: '引数・戻り値だけ書く',
        pv: T('fee.ts', 'const fee: number = price * qty;\nconst label: string = "合計";\nconst ok: boolean = true;', { err: [1, 2, 3], keys: { 1: 'infer' } }),
        iv: T('fee.ts', 'function calcFee(price: number, qty: number)\n  : number {\n  const fee = price * qty; // 推論', { idea: [1, 2, 3], keys: { 3: 'infer' } }),
        av: T('fee.ts', 'function calcFee(\n  price: number, qty: number\n): number {\n  const fee = price * qty;\n  return fee;\n}', { ok: [2, 3], keys: { 4: 'infer' } }) },
      '配列・タプル・オブジェクト': { problem: 'row[1] が何か分からず画面が落ちた', idea: '値ではなく、まとまりの形に型を付ける', answer: '<code>T[]</code> / タプル / <code>{ }</code>',
        pv: T('row.js', 'const row = ["離婚相談", 3000, true];\nrow[1].toUpperCase(); // 数字に文字の操作', { lang: 'js', err: [2], keys: { 2: 'shape' } }),
        iv: T('row.ts', 'string[]           // 同じ種類が並ぶ\n[string, number]   // 位置ごとに型\n{ title: string }  // 名前付き', { idea: [2], keys: { 2: 'shape' } }),
        av: T('row.ts', 'type Row = [string, number];\nconst r: Row = ["離婚相談", 3000];\nr[1].toFixed(); // number と分かる', { ok: [3], keys: { 3: 'shape' } }) },
      'any と unknown': { problem: '項目名が変わっても赤線が出ず、本番で真っ白', idea: '分からない値は <b>unknown</b> に入れる', answer: '確かめてから使う',
        pv: T('res.ts', 'let res: any = await getJson();\nres.data.title.trim(); // 変わっても通ってしまう', { err: [2], keys: { 1: 'unk' } }),
        iv: T('res.ts', 'let res: unknown = await getJson();\nres.data; // ✖ まだ使えない', { err: [2], idea: [1], keys: { 1: 'unk' } }),
        av: T('res.ts', 'if (typeof res === "string") {\n  res.trim(); // OK\n}', { ok: [1, 2], keys: { 1: 'unk' } }) },
      '値がない型：void / undefined / null': { problem: 'ログイン前の画面が真っ白になった', idea: '「ないかも」を型に書く', answer: '<code>User | undefined</code> ＋ if',
        pv: T('find.ts', 'const u = users.find(isLoggedIn);\nu.name; // 誰もいないと画面が落ちる', { err: [2], keys: { 1: 'null' } }),
        iv: T('find.ts', 'let u: User | undefined;\n//     ^^^^^^^^^^^^^^ ないかも', { idea: [1], keys: { 1: 'null' } }),
        av: T('find.ts', 'if (u) {\n  u.name; // OK\n}', { ok: [1, 2], keys: { 1: 'null' } }) },
    },
    'ts-types': {
      'Union：どれか1つ': { problem: 'ID が数字か文字か。any だと本番でエラー', idea: '来てよい型だけを並べる', answer: 'Union 型 <code>A | B</code>',
        pv: T('show.ts', 'function show(id: any) {\n  id.toFixed(); // "C-101" だったら…\n}', { err: [2], keys: { 1: 'union' } }),
        iv: T('id.ts', 'type Id = number | string;\nid.toFixed(); // ✖ string かも', { err: [2], idea: [1], keys: { 1: 'union' } }),
        av: T('show.ts', 'function show(id: Id) {\n  if (typeof id === "string")\n    id.length; // OK\n}', { ok: [2, 3], keys: { 2: 'union' } }) },
      'Enum：名前の付いた定数': { problem: 'setStatus(2) の 2 って何？', idea: '数字に名前を付ける', answer: '<code>enum</code>',
        pv: T('status.js', 'setStatus(2); // 2 って対応中？完了？\nsetStatus(9); // 9 も通る', { lang: 'js', err: [1], keys: { 1: 'enum' } }),
        iv: T('status.ts', 'enum Status {\n  Received, Reviewing, Done\n}\n// 0 1 2 に名前が付く', { idea: [1, 2], keys: { 1: 'enum' } }),
        av: T('status.ts', 'setStatus(Status.Reviewing); // 意味が分かる\nsetStatus(Status.Done);      // 完了にする', { ok: [1], keys: { 1: 'enum' } }) },
      'interface：形チェッカー': { problem: '項目名の typo で見出しが undefined', idea: '形を先に書く。合わなければ赤線', answer: '<code>interface</code>',
        pv: T('item.js', 'const c = { tilte: "相続の相談" };\nc.title; // undefined…', { lang: 'js', err: [1], keys: { 1: 'iface' } }),
        iv: T('item.ts', 'interface Consultation {\n  title: string;\n}', { idea: [1, 2], keys: { 1: 'iface' } }),
        av: T('item.ts', 'const c: Consultation = { tilte: "x" };\n// ✖ \'tilte\' は Consultation にない\nconst d: Consultation = { title: "x" };', { err: [1], ok: [3], keys: { 1: 'iface' } }) },
      'extends と merge': { problem: 'コピペした片方だけ直して、値がズレた', idea: '共通は1か所。違う所だけ足す', answer: '<code>extends</code>',
        pv: T('booking.ts', 'interface Consultation { id: number }\ninterface Booking {\n  id: number; // コピペ\n  time: string;\n}', { err: [3], keys: { 3: 'ext' } }),
        iv: T('booking.ts', 'interface Booking extends Consultation {\n  time: string; // 足すだけ\n}\n// id は Consultation から引き継ぐ', { idea: [1], keys: { 1: 'ext' } }),
        av: T('booking.ts', 'const b: Booking = { id: 1, time: "10:00" };\n// Consultation を直せば Booking も変わる', { ok: [1], keys: { 1: 'ext' } }) },
      'interface vs type': { problem: 'どちらでも動くので毎回議論になる', idea: '形なら interface。それ以外は type', answer: '形 → interface ／ 他 → type',
        pv: T('id.ts', 'interface Id = number | string;\n// ✖ interface では書けない', { err: [1], keys: { 1: 'pick' } }),
        iv: T('pick.ts', 'interface Consultation { title: string }\ntype Id = number | string;\n// 形 → interface / 他 → type', { idea: [1, 2], keys: { 2: 'pick' } }),
        av: T('pick.ts', 'type Id = number | string;\ninterface Consultation { title: string }', { ok: [1, 2], keys: { 1: 'pick' } }) },
    },
    'ts-class': {
      'クラス = 設計図、new = スタンプ': { problem: '予約の処理を画面ごとにコピペ', idea: '設計図を1つ作り、何個でも作る', answer: '<code>class</code> ＋ <code>new</code>',
        pv: T('bookings.ts', 'const a = { name: "田中", cancel() {} };\nconst b = { name: "佐藤", cancel() {} };\nconst c = { name: "鈴木", cancel() {} };\n// 同じ処理を何度も…', { err: [1, 2, 3], keys: { 1: 'cls' } }),
        iv: T('booking.ts', 'class Booking {\n  constructor(\n    public name: string\n  ) {}\n  cancel() {}\n}', { idea: [1], keys: { 1: 'cls' } }),
        av: T('bookings.ts', 'const a = new Booking("田中");\nconst b = new Booking("佐藤");', { ok: [1, 2], keys: { 1: 'cls' } }) },
      'アクセス修飾子：誰が触れる？': { problem: 'fee が誰でも書き換えられて請求が0円に', idea: '触れる人を必要な範囲だけにする', answer: '<code>private</code> は中だけ',
        pv: T('invoice.ts', 'class Invoice { fee = 5000 }\ninvoice.fee = 0; // 誰でも書き換え', { err: [2], keys: { 2: 'priv' } }),
        iv: T('invoice.ts', 'class Invoice {\n  private fee = 5000;\n  // 外からは触れない\n}', { idea: [2], keys: { 2: 'priv' } }),
        av: T('main.ts', 'new Invoice().fee;\n// ✖ private なので外から読めない', { err: [1], keys: { 1: 'priv' } }) },
      'readonly：書き換え禁止': { problem: '相談 ID が途中で書き換わった', idea: '変えたくない物は読み取り専用に', answer: '<code>readonly</code>',
        pv: T('consult.js', 'const c = { id: 1 };\nc.id = 999; // 他人の相談に…', { lang: 'js', err: [2], keys: { 2: 'ro' } }),
        iv: T('consult.ts', 'class Consultation {\n  readonly id = 1;\n}', { idea: [2], keys: { 2: 'ro' } }),
        av: T('main.ts', 'c.id = 2;\n// ✖ id は読み取り専用', { err: [1], keys: { 1: 'ro' } }) },
      'getter / setter：門番を置く': { problem: '予約人数が -5 になり、マイナス請求に', idea: '窓口（set）でチェックして通す', answer: '<code>get</code> / <code>set</code>',
        pv: T('booking.ts', 'class Booking { people = 1 }\nb.people = -5; // 請求がマイナスに', { err: [2], keys: { 2: 'set' } }),
        iv: T('booking.ts', 'set people(v: number) {\n  if (v < 1) throw new Error();\n  this._people = v;\n}', { idea: [2], keys: { 2: 'set' } }),
        av: T('main.ts', 'b.people = 2; // OK\nb.people = -5; // Error で止まる', { err: [2], ok: [1], keys: { 2: 'set' } }) },
      '継承：親から子へ': { problem: '受付番号の処理をコピペして直し忘れ', idea: '共通は親に、違う所だけ子に書く', answer: '<code>extends</code>',
        pv: T('bookings.ts', 'class ConsultBooking { issueNo() {} }\nclass SeminarBooking { issueNo() {} }\nclass EventBooking { issueNo() {} }\n// 同じ処理を3回…', { err: [1, 2, 3], keys: { 1: 'inh' } }),
        iv: T('bookings.ts', 'class Booking {\n  issueNo() {}\n}\nclass SeminarBooking extends Booking {}', { idea: [4], keys: { 4: 'inh' } }),
        av: T('bookings.ts', 'class SeminarBooking extends Booking {\n  seats() { /* 子だけ */ }\n}\nnew SeminarBooking().issueNo(); // 親から', { ok: [1], keys: { 1: 'inh' } }) },
      'super()：親を呼ぶ': { problem: '親より先に動いて、受付番号が空のまま', idea: '親を先に作ってから、子の分', answer: '<code>super(...)</code> が先',
        pv: T('seminar.ts', 'class SeminarBooking extends Booking {\n  constructor() {\n    this.seats = 10; // ✖ 親より先\n    super();\n  }\n}', { err: [3], keys: { 3: 'sup' } }),
        iv: T('seminar.ts', 'constructor(no: string) {\n  super(no); // ① 親を先に\n  this.seats = 10; // ② 子の分\n}', { idea: [2], keys: { 2: 'sup' } }),
        av: T('main.ts', 'const s = new SeminarBooking("A-1");\ns.no; // 親の分も入っている', { ok: [1], keys: { 1: 'sup' } }) },
    },
    'ts-generics': {
      'Box<T> マシン': { problem: '結果の入れ物を型ごとに複製している', idea: '型は「あとで決める」。入れ物は1つ', answer: '<code>Box&lt;T&gt;</code>',
        pv: T('results.ts', 'class ConsultResult { data: Consultation }\nclass LawyerResult { data: Lawyer }\nclass FeeResult { data: Fee }', { err: [1, 2, 3], keys: { 1: 'T' } }),
        iv: T('result.ts', 'class ApiResult<T> {\n  constructor(public data: T) {}\n}', { idea: [1], keys: { 1: 'T' } }),
        av: T('main.ts', 'new ApiResult<Consultation>(c);\nnew ApiResult<Lawyer>(l);', { ok: [1, 2], keys: { 1: 'T' } }) },
      'identity<T>：入れた型が出てくる': { problem: 'any だと戻り値の型が消えて typo が通る', idea: '入れた型を、そのまま返す型にする', answer: '<code>function f&lt;T&gt;(x: T): T</code>',
        pv: T('id.ts', 'function id(x: any): any {\n  return x;\n}\nid(lawyer).nmae; // 通る…', { err: [4], keys: { 1: 'T' } }),
        iv: T('id.ts', 'function id<T>(x: T): T {\n  return x;\n}\n// id(lawyer) → T は Lawyer', { idea: [1], keys: { 1: 'T' } }),
        av: T('main.ts', 'id(lawyer).nmae;\n// ✖ Lawyer に nmae はない', { err: [1], keys: { 1: 'T' } }) },
      'Array<T> と制約 extends': { problem: '共通チェックで .length が赤線になる', idea: 'T に最低限の条件を付ける', answer: '<code>T extends { length: number }</code>',
        pv: T('empty.ts', 'function isEmpty<T>(x: T) {\n  return x.length === 0; // ✖ 無いかも\n}', { err: [2], keys: { 2: 'ext' } }),
        iv: T('empty.ts', 'function isEmpty<T extends {\n  length: number\n}>(x: T) {', { idea: [1, 2], keys: { 1: 'ext' } }),
        av: T('main.ts', 'isEmpty("");    // OK\nisEmpty([]);    // OK\nisEmpty(42);    // ✖ length がない', { err: [3], ok: [1, 2], keys: { 3: 'ext' } }) },
    },
    'ts-test': {
      'なぜテストを書くの？': { problem: '税計算を直したら別画面の請求額がズレた', idea: '確認をコードにして、自動にする', answer: '<code>test</code> ＋ <code>expect</code>',
        pv: T('tax.js', 'function calcTax(price) {\n  return price * 0.8; // バグ（0.08 のつもり）\n}\n// 手で全画面を確認…', { lang: 'js', err: [2], keys: { 2: 'test' } }),
        iv: T('tax.test.ts', 'test("1000円の税は80円", () => {\n  expect(calcTax(1000)).toBe(80);\n});', { idea: [2], keys: { 2: 'test' } }),
        av: T('terminal', '$ npm run test\n✖ calcTax: 80 のはずが 800\n// 本番に出る前に気づけた', { lang: 'sh', err: [2], keys: { 2: 'test' } }) },
      'テストの種類': { problem: '画面操作のテストだけで遅く、すぐ壊れる', idea: '速い小さなテストを多く、大きいのは少し', answer: 'ユニットを土台にする',
        pv: T('e2e.ts', '// すべて画面の操作テスト\nclick("ログイン"); // 遅い\ntype("email", "a@b.c"); // 壊れやすい', { err: [2, 3], keys: { 1: 'pyr' } }),
        iv: T('pyramid.txt', 'ユニット ████████ 多く（速い）\n結合     ████     ほどほど\nE2E      ██       少し（遅い）', { lang: 'sh', idea: [1], keys: { 1: 'pyr' } }),
        av: T('tests', 'unit/         120 件  1秒\nintegration/   30 件\ne2e/            5 件  遅い', { lang: 'sh', ok: [1], keys: { 1: 'pyr' } }) },
      'ユニットテストの流れ': { problem: 'テストが無く、請求計算を直すのが怖い', idea: '書く → 実行 → 確かめる → 直す', answer: '<code>it</code> を1つずつ増やす',
        pv: T('calcTotal.ts', 'function calcTotal(price, qty) { return price * qty }\n// テストが無い。割引を足して大丈夫？', { err: [2], keys: { 2: 'flow' } }),
        iv: T('flow.txt', '// 設計 → 実行 → 確かめる\n// → 直す → カバレッジ\n// これを繰り返す', { lang: 'sh', idea: [1], keys: { 1: 'flow' } }),
        av: T('calcTotal.test.ts', 'it("2000円を3個で6000円", () => {\n  expect(calcTotal(2000, 3)).toBe(6000);\n});', { ok: [2], keys: { 2: 'flow' } }) },
      'Vitest をセットアップ': { problem: 'テストを動かす道具がない', idea: '入れて、<code>test</code> コマンドを登録する', answer: '<code>npm run test</code> で全部走る',
        pv: T('terminal', '$ npm run test\nnpm error Missing script: "test"', { lang: 'sh', err: [2], keys: { 2: 'vt' } }),
        iv: T('package.json', '{\n  "scripts": {\n    "test": "vitest"\n  }\n}', { lang: 'js', idea: [3], keys: { 3: 'vt' } }),
        av: T('terminal', '$ npm i -D vitest\n$ npm run test\n ✓ 3 passed', { lang: 'sh', ok: [1, 2], keys: { 2: 'vt' } }) },
      'TDD：赤 → 緑 → 赤 → 緑': { problem: '後から書くと、仕様があいまい', idea: '先にテスト（赤）→ 通す（緑）→ 整える', answer: 'Red → Green → Refactor',
        pv: T('discount.ts', 'function discount(p) {\n  // 何%引き？ 決めずに作った\n}', { err: [2], keys: { 2: 'tdd' } }),
        iv: T('tdd.txt', '// 1. Red      先にテスト（失敗）\n// 2. Green    通るコードを書く\n// 3. Refactor 整える', { lang: 'sh', idea: [1], keys: { 1: 'tdd' } }),
        av: T('discount.test.ts', 'it("10% 引き", () => {\n  expect(discount(1000)).toBe(900);\n}); // 先に書く', { ok: [2], keys: { 2: 'tdd' } }) },
      'テストの型：Arrange → Act → Assert': { problem: '書き方がバラバラで読めない', idea: '3段にそろえる（準備・実行・確認）', answer: 'Arrange → Act → Assert',
        pv: T('cart.test.ts', 'it("x", () => {\n  expect(new Cart().add(i)).toBe(1);\n}); // 何を確認？', { err: [2], keys: { 2: 'aaa' } }),
        iv: T('aaa.txt', '// Arrange  準備\n// Act      実行\n// Assert   確認', { lang: 'sh', idea: [1, 2, 3], keys: { 2: 'aaa' } }),
        av: T('cart.test.ts', 'const cart = new Cart(); // 準備\ncart.add(item);          // 実行\nexpect(cart.total()).toBe(1000);', { ok: [1, 2, 3], keys: { 2: 'aaa' } }) },
    },
  };
  const REF = {"ts-intro": {"そのバグ、どこで見つかる？": {"hint": "<b>エラーメッセージの読み方</b><br><code>Argument of type 'string' is not assignable to parameter of type 'number'</code><br>＝「string を number の引数には渡せません」。赤線の上にカーソルを乗せると、同じ文が読めます。"}}, "ts-basic": {"型アノテーションの読み方": {"hint": "<b>用語</b>：アノテーション＝「注釈（ここに型を書く札）」。<code>変数名: 型</code> の「: 型」の部分のことです。"}, "型の箱に値を入れよう": {"ref": [{"title": "型の一覧", "icon": "list", "html": "<table class=\"tsx-tbl\" style=\"width:100%;border-collapse:collapse\"><tr><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">型</th><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">意味</th><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">値の例</th></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>number</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">数値（整数も小数も）</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>42</code>, <code>3.14</code></td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>string</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">文字列</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>\"abc\"</code></td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>boolean</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">はい / いいえ</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>true</code>, <code>false</code></td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>any</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">何でも（チェックなし・避ける）</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">—</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>unknown</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">何か分からない（確かめてから使う）</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">—</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>void</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">戻り値が無い関数</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">—</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>null</code> / <code>undefined</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">空 / まだ無い</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">—</td></tr></table>"}]}}, "ts-class": {"アクセス修飾子：誰が触れる？": {"ref": [{"title": "修飾子まとめ", "icon": "table", "html": "<table class=\"tsx-tbl\" style=\"width:100%;border-collapse:collapse\"><tr><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">修飾子</th><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">クラスの中</th><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">子クラス</th><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">外から</th></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>public</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">○</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">○</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">○</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>protected</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">○</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">○</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">✖</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>private</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">○</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">✖</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">✖</td></tr></table>"}]}, "継承：親から子へ": {"hint": "<b>用語</b>：継承（extends）＝親クラスの機能を<b>引き継ぐ</b>こと。親＝スーパークラス、子＝サブクラスとも呼びます。"}}, "ts-generics": {"Box<T> マシン": {"hint": "<code>&lt;T&gt;</code> の T は Type の頭文字。名前は何でもよく、慣習で <code>T</code>、複数なら <code>T, U</code> や <code>K, V</code>（Key, Value）を使います。"}}, "ts-test": {"ミニテストランナー": {"ref": [{"title": "マッチャー一覧", "icon": "list-checks", "html": "<table class=\"tsx-tbl\" style=\"width:100%;border-collapse:collapse\"><tr><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">マッチャー</th><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">確かめること</th></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>toBe(x)</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">同じ値（===）</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>toEqual(x)</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">中身が同じ（オブジェクト・配列）</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>toBeTruthy()</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">真っぽい値</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>toBeGreaterThan(n)</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">n より大きい</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>toContain(x)</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">配列・文字列に含まれる</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>toThrow()</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">エラーが投げられる</td></tr></table>"}]}, "テストの型：Arrange → Act → Assert": {"hint": "<b>テスト名の付け方</b>：「何をしたら、どうなる」を日本語で書くと、失敗した時に何が壊れたか一目で分かります。例：<code>商品を追加すると合計が出る</code>"}}};
  Object.entries(REF).forEach(([id, m]) => { const L = K.lessons[id]; if (!L) return; L.scenes.forEach((sc) => { if (m[sc.t]) Object.assign(sc, m[sc.t]); }); });
  const HINT = {"ts-intro": {"実践：赤線を消そう": {"hint": "<b>ヒント</b>：エラー文は「string を number の引数には渡せません」の意味。<code>\"1\"</code> は文字、<code>1</code> は数字です。<br><b>おまけ</b>：<code>add(\"1\", 2)</code> のままにして、関数の型を <code>any</code> に変えると赤線は消えます。でも型を捨てるのはおすすめしません。"}}, "ts-basic": {"実践：型エラーを全部直そう": {"hint": "<b>ヒント</b>：赤線の理由は「型と値が合っていない」だけ。<code>\"5\"</code> は文字、<code>5</code> は数字。値を直すか、型を <code>number | string</code> のように広げます。<br><b>おまけ</b>：<code>any</code> にすれば消えますが、ミッションでは使わないでね。"}}, "ts-types": {"実践：型を設計しよう": {"hint": "<b>ヒント</b>：<code>Status</code> に入れられるのは <code>\"todo\" | \"doing\" | \"done\"</code> の3つだけ。<br><b>おまけ</b>：<code>assignee</code> を使ったタスクをもう1つ作ってみよう。"}}, "ts-class": {"実践：private の壁を越えよう": {"hint": "<b>ヒント</b>：<code>private</code> は「そのクラスの中だけ」。子クラスにも見せたいときは <code>protected</code>。外から見せたくなければ <code>protected</code> のままで OK。"}}, "ts-generics": {"実践：any を T に置き換えよう": {"hint": "<b>ヒント</b>：<code>T</code> は「あとで決まる型」。引数が <code>T[]</code>（T の配列）なら、戻り値も <code>T</code> にできます。"}}, "ts-test": {"実践：テストを書こう": {"hint": "<b>ヒント</b>：テストは <code>it(\"名前\", function(){ expect(実際の値).toBe(期待する値); });</code>。test.html のいちばん下に1行足せば OK。<br><b>おまけ</b>：<code>multiply(0, 5)</code> のテストも足してみよう。"}, "ミニテストランナー": {"answer": {"code": "// 18歳「以上」なので >= にする\nfunction isAdult(age) {\n  return age >= 18;\n}\n", "lang": "js", "file": "isAdult.js"}, "hint": "<b>ヒント</b>：「18歳以上」は 18 を<b>含みます</b>。<code>&gt;</code> と <code>&gt;=</code> の違いを見よう（境界値のテスト）。"}}};
  Object.entries(HINT).forEach(([id, m]) => { const L = K.lessons[id]; if (!L) return; L.scenes.forEach((sc) => { if (m[sc.t]) Object.assign(sc, m[sc.t]); }); });
  Object.entries(WHY).forEach(([id, m]) => { const L = K.lessons[id]; if (!L) return; L.scenes.forEach((sc) => { if (m[sc.t]) sc.why = Object.assign({}, m[sc.t], (MINI[id] || {})[sc.t] || {}); }); });
})();
