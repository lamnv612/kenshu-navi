/* Lessons: cuivim (CUI・Vim) / git / css  — track basic */
(function () {
  'use strict';
  const K = window.KENSHU, { h, code, stepper, playground, quiz, lbl, style, esc, celebrate, icon } = K.W;
  const BASIC = 'var(--basic)', TS = 'var(--ts)', PINK = 'var(--pink)', TEAM = 'var(--team)', VIO = 'var(--violet)', VUE = 'var(--vue)';

  style('cg', `
  .cg-vimov{position:absolute;inset:0;z-index:5;background:var(--code);display:flex;flex-direction:column;border-radius:8px;overflow:hidden}.cg-vimov-h{padding:6px 12px;font-size:.75rem;color:#8e97c4;border-bottom:1px solid rgba(255,255,255,.08)}.cg-vimov .cg-vim{flex:1;border-radius:0;border:0}
  .cg-vim.fl .vl.cr,.cg-vim.fl .st .md{animation:cgvfl .7s}@keyframes cgvfl{0%{background:rgba(255,200,80,.6)}100%{background:transparent}}
  .cgv-pin{position:sticky;top:64px;z-index:5;background:var(--bg);padding:6px 0 10px;margin:0 -4px;padding-left:4px;padding-right:4px;box-shadow:0 12px 18px -14px rgba(0,0,0,.7)}
  .cgv-pin .cg-vim .bd{min-height:0;max-height:120px;overflow:auto;padding:6px 0}
  .cgv-lb{font-size:.75rem;color:var(--mute);display:flex;gap:.4em;align-items:center;margin-bottom:4px}.cgv-lb .ic{width:12px;height:12px}
  @media(max-width:800px){.cgv-pin{top:56px}.cgv-pin .cg-vim .bd{max-height:75px}}
  .cg-term{position:relative;background:var(--code);border:1px solid var(--line);border-radius:8px;font:.875rem/1.6 var(--mono);color:#d8dcff;display:flex;flex-direction:column;height:330px;box-shadow:var(--shadow)}
  .cg-term .hd{display:flex;gap:6px;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,.08)}
  .cg-term .hd i{width:10px;height:10px;border-radius:50%;background:#ff5f57}.cg-term .hd i:nth-child(2){background:#febc2e}.cg-term .hd i:nth-child(3){background:#28c840}
  .cg-out{flex:1;overflow:auto;padding:10px 14px;white-space:pre-wrap;word-break:break-all}
  .cg-out .cmd{color:#9be58b}.cg-out .err{color:#ff8f9a}.cg-out .dir{color:#7fd8ff;font-weight:700}.cg-out mark{background:#ffb45466;color:#fff;border-radius:3px}
  .cg-line{display:flex;gap:8px;padding:8px 14px;border-top:1px solid rgba(255,255,255,.08)}
  .cg-line span{color:#9be58b;white-space:nowrap}.cg-line input{flex:1;background:transparent;border:0;outline:0;color:#fff;font:inherit;min-width:0}
  .cg-tree{font:.875rem/1.5 var(--mono);background:var(--card);border:1px solid var(--line);border-radius:8px;padding:12px 14px;min-height:150px}
  .cg-tree ul{list-style:none;padding-left:18px;margin:0;border-left:1px dashed var(--line)}.cg-tree>ul{border:0;padding:0}
  .cg-tree li{padding:1px 0}.cg-tree .nm{padding:0 .4em;border-radius:6px}
  .cg-tree .cwd>.nm{background:color-mix(in srgb,var(--basic) 30%,transparent);outline:1px solid var(--basic)}
  .cg-tree .nw>.nm{animation:cgflash 1.3s}
  .cg-pre{padding:4px 12px;font:600 .6875rem/1.5 var(--font);color:#8e97c4;border-bottom:1px solid rgba(255,255,255,.06)}
  .cg-tree .pre{margin-left:.5em;font:700 .625rem var(--font);color:var(--mute);border:1px solid var(--line);border-radius:6px;padding:0 .4em;vertical-align:1px}
  @keyframes cgflash{0%{background:var(--pink);transform:scale(1.4)}100%{background:transparent;transform:none}}
  .cgr-top{display:flex;align-items:center;gap:14px;margin-bottom:10px}.cgr-top .kc{display:flex;gap:6px;flex-wrap:wrap}.cgr-top .kc i{font:800 1rem var(--mono);padding:.2em .6em;border-radius:6px;background:var(--code);color:#fff;font-style:normal;border:1px solid var(--line)}.cgr-top .en{font:.875rem var(--mono);color:var(--mute)}.cgr-top .en b{color:var(--c);text-decoration:underline;text-underline-offset:3px}.cgr-top .jp{font-weight:800}
  .cgr-what{margin:6px 0 10px;line-height:1.8}.cgr-ans{margin:8px 0 0;padding:12px 14px;border-radius:8px;background:var(--code);color:#d8dcff;font:.875rem/1.7 var(--mono);white-space:pre-wrap}
  .cgr .cg-term{height:240px}.cgr .vref{width:100%}
  .cg-chip{all:unset;cursor:pointer;font:700 .75rem var(--mono);padding:.25em .8em;border-radius:6px;border:1px solid var(--line);background:var(--card);transition:.2s}
  .cg-chip:hover{background:var(--basic);color:#06101f;transform:translateY(-2px)}
  .cg-vim{position:relative;background:var(--code);border:2px solid var(--line);border-radius:8px;font:.875rem/1.7 var(--mono);color:#d8dcff;outline:0;transition:.2s;overflow:hidden}
  .cg-vim:focus{border-color:var(--ts);box-shadow:0 0 0 4px color-mix(in srgb,var(--ts) 25%,transparent)}
  .cg-vim .bd{padding:10px 0;min-height:140px}.cg-vim .vl{padding:0 14px;white-space:pre;display:flex}.cg-vim .vl b{color:#5a6390;width:2.2em;font-weight:400;flex:none}
  .cg-vim .cur{background:#fff;color:#000;animation:cgblink 1s steps(2) infinite}.cg-vim.ins .cur{background:transparent;color:inherit;box-shadow:-2px 0 0 var(--basic);animation:none}
  @keyframes cgblink{50%{opacity:.55}}
  .cg-vim .st{display:flex;gap:10px;padding:4px 14px;font-weight:700;background:#1b2147;font-size:.75rem}
  .cg-vim .st .md{padding:0 .8em;border-radius:6px;background:var(--ts);color:#fff}.cg-vim.ins .st .md{background:var(--basic);color:#06101f}.cg-vim.cmd .st .md{background:var(--team);color:#06101f}
  .cg-vim .ov{position:absolute;inset:0;display:grid;place-items:center;background:rgba(8,11,23,.7);font:700 1rem var(--font);transition:.3s;pointer-events:none}.cg-vim:focus .ov{opacity:0}
  .cg-fsm text{font:800 14px var(--mono);fill:#fff;text-anchor:middle}.cg-fsm .lb{font:700 12px var(--mono);fill:var(--mute)}
  .cg-fsm .nd rect{fill:var(--card2);stroke:var(--line);stroke-width:2;transition:.3s}.cg-fsm .nd.on rect{stroke:var(--c);fill:color-mix(in srgb,var(--c) 35%,var(--bg2));filter:drop-shadow(0 0 10px var(--c))}
  .cg-fsm .nd text{fill:var(--text)}
  .cg-fsm path{fill:none;stroke:var(--line);stroke-width:2;transition:.3s}.cg-fsm path.on{stroke:var(--pink);stroke-width:4;stroke-dasharray:8 6;animation:cgdash .5s linear infinite}
  @keyframes cgdash{to{stroke-dashoffset:-14}}
  .cg-keys{display:flex;flex-wrap:wrap;gap:6px}.cg-keys button{all:unset;cursor:pointer;font:700 .75rem var(--mono);padding:.3em .7em;border-radius:6px;background:var(--card2);border:1px solid var(--line);border-bottom-width:3px;transition:.15s}
  .cg-keys button:active,.cg-keys button.hit{background:var(--ts);color:#fff;transform:translateY(2px)}
  .cg-zones{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
  .cg-zone{border:2px dashed var(--zc);border-radius:8px;padding:8px;min-height:190px;background:color-mix(in srgb,var(--zc) 8%,transparent);display:flex;flex-direction:column;gap:6px}
  .cg-zone h4{font-size:.875rem;color:var(--zc);text-align:center}.cg-zone h4 small{display:block;color:var(--mute);font-weight:500;font-size:.68rem}
  .cg-file{font:700 .75rem var(--mono);padding:.35em .6em;border-radius:6px;background:var(--zc2,var(--ts));color:#06101f;box-shadow:0 6px 14px -8px #000;display:flex;gap:.4em;align-items:center}
  .cg-file.cm{background:var(--card2);color:var(--text);border:2px solid var(--zc2,var(--ts))}
  .cg-cmd{font:700 .875rem var(--mono);background:var(--code);color:#9be58b;border-radius:8px;padding:.6em 1em;margin-bottom:10px;min-height:2.6em}
  .cg-svgwrap{overflow:auto;background:var(--card);border:1px solid var(--line);border-radius:8px}
  .cg-svgwrap svg text{font:700 11px var(--mono);fill:#fff}
  .cg-svgwrap .pill{cursor:pointer}.cg-svgwrap .pill rect{transition:.2s}.cg-svgwrap .pill:hover rect{filter:brightness(1.3)}
  .cg-svgwrap .nw{animation:cgpop .6s both;transform-box:fill-box;transform-origin:center}
  @keyframes cgpop{from{transform:scale(0)}60%{transform:scale(1.3)}}
  .cg-svgwrap line,.cg-svgwrap path.ed{stroke:var(--mute);stroke-width:3;fill:none}
  .cg-svgwrap .pill rect{fill:var(--violet);stroke:none}.cg-svgwrap .pill.head rect{fill:var(--pink)}
  .cg-svgwrap .pill.rm rect{fill:var(--card2);stroke:var(--basic);stroke-width:1.5;stroke-dasharray:4 3}.cg-svgwrap .pill.rm text{fill:var(--text)}.cg-svgwrap .pill.rm{cursor:default}
  .cg-leg{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;font-size:.75rem;font-weight:800}
  .cg-leg .lg{padding:.15em .7em;border-radius:6px;border:1px solid var(--line);color:var(--mute)}.cg-leg .lg.loc{border-color:var(--violet);color:var(--violet)}.cg-leg .lg.rm{border-style:dashed;border-color:var(--basic);color:var(--basic)}
  .cg-leg .lg.env{border-color:var(--lc);color:var(--lc)}
  .cg-pr{display:flex;align-items:center;gap:.6em;flex-wrap:wrap;padding:.5em .9em;margin-bottom:8px;border-radius:8px;border:1px solid var(--line);background:var(--card);font-size:.875rem}
  .cg-pr .ic{width:18px;height:18px;color:var(--basic)}.cg-pr code{font:700 .8125rem var(--mono)}.cg-pr .st{margin-left:auto;font-weight:800;padding:.1em .7em;border-radius:6px;border:1px solid var(--line);color:var(--mute)}
  .cg-pr.ok .st{color:var(--ok);border-color:var(--ok)}.cg-pr.done .st{color:var(--violet);border-color:var(--violet)}.cg-pr.done .ic{color:var(--violet)}
  .cg-ghl{display:inline-flex;align-items:center;gap:.3em;font-weight:800;font-size:.875rem}.cg-ghl .ic{width:16px;height:16px}
  .cg-ctl{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:10px}
  .cg-ctl input,.cg-ctl select{font:inherit;font-size:.875rem;padding:.35em .7em;border-radius:6px;border:1px solid var(--line);background:var(--bg2);color:var(--text)}
  .cg-cf{font:.875rem/1.8 var(--mono);background:var(--code);border-radius:8px;padding:12px 0;color:#d8dcff;overflow:hidden}
  .cg-cf .r{padding:0 16px;max-height:3em;overflow:hidden;transition:max-height .6s,opacity .5s,padding .5s;white-space:pre}
  .cg-cf .r.mk{color:#8e97c4;background:rgba(255,255,255,.05)}.cg-cf .r.me{background:color-mix(in srgb,var(--basic) 22%,transparent);cursor:pointer}.cg-cf .r.th{background:color-mix(in srgb,var(--ts) 25%,transparent);cursor:pointer}
  .cg-cf .r.me:hover,.cg-cf .r.th:hover{filter:brightness(1.4)}.cg-cf .r.gone{max-height:0;opacity:0;padding:0}
  .cg-ssh{position:relative;display:grid;grid-template-columns:1fr 1fr;gap:12% ;min-height:236px}
  @media(max-width:760px){.cg-ssh{grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:6%}.cg-ssh .bx{padding:10px 6px;min-width:0}}
  .cg-ssh .bx b{display:block}.cg-ssh .bx .tag{display:flex;width:max-content;max-width:100%;margin:8px auto 0}
  .cg-ssh .bx{border:2px solid var(--line);border-radius:10px;padding:12px;background:var(--card);text-align:center;transition:.4s}
  .cg-ssh .bx.ok{border-color:var(--ok);box-shadow:0 0 30px -8px var(--ok)}.cg-ssh .bx big{font-size:2.2rem;display:block}
  .cg-ssh .bx .tag{display:inline-flex;align-items:center;gap:.4em;margin-top:10px;padding:.3em .9em;border-radius:6px;font-weight:800;font-size:.875rem;background:var(--card2);border:1px solid var(--line);transition:opacity .5s}
  .cg-ssh .k{position:absolute;top:96px;font-size:2rem;transition:left .9s cubic-bezier(.4,.1,.2,1),opacity .5s,top .5s;opacity:0}
  .cg-seq{display:flex;flex-wrap:wrap;gap:8px;min-height:46px;padding:8px;border:2px dashed var(--line);border-radius:8px;margin:8px 0}
  .cg-seq .cg-chip{background:color-mix(in srgb,var(--basic) 25%,transparent)}
  .cg-page{background:#fff;color:#222;border-radius:8px;padding:14px;font-family:var(--font);min-height:120px}
  .cg-tabs{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap}.cg-tabs button{all:unset;cursor:pointer;padding:.35em 1em;border-radius:6px;border:1px solid var(--line);font-weight:800;font-size:.875rem;transition:.2s}
  .cg-tabs button.on{background:var(--basic);color:#06101f;border-color:var(--basic)}
  .cg-meter{height:10px;border-radius:6px;background:var(--line);overflow:hidden}.cg-meter i{display:block;height:100%;background:linear-gradient(90deg,var(--pink),var(--team),var(--basic));transition:width .6s}
  .cg-pk{display:inline-block;animation:cgfly 1s ease-in-out infinite}@keyframes cgfly{50%{transform:translateX(30px)}}
  .cg-sg .page{background:#fff;color:#222;border-radius:8px;padding:16px;font-family:var(--font);line-height:1.8}
  .cg-sg .page *{transition:outline-color .2s,background .2s}
  .cg-sg .page .hit{outline:3px solid var(--pink);outline-offset:2px;background:#fff0f6;border-radius:4px}
  .cg-sg .page .pick{cursor:pointer}
  .cg-rules{display:grid;gap:6px}.cg-rule{all:unset;cursor:pointer;display:grid;grid-template-columns:auto 1fr 70px;gap:10px;align-items:center;padding:.4em .8em;border-radius:8px;border:1px solid var(--line);background:var(--card);font:700 .875rem var(--mono);transition:.2s}
  .cg-rule:hover{background:var(--card2)}.cg-rule.on{border-color:var(--pink);background:color-mix(in srgb,var(--pink) 14%,var(--card))}.cg-rule.win{box-shadow:0 0 0 2px var(--team)}
  .cg-rule .sp{height:8px;border-radius:6px;background:var(--line);overflow:hidden}.cg-rule .sp i{display:block;height:100%;background:var(--ts);transition:width .5s}
  .cg-box{display:grid;place-items:center;padding:18px;background:var(--card);border:1px solid var(--line);border-radius:8px;min-height:360px;overflow:auto}
  .cg-box .lay{position:relative;display:flow-root}
  .cg-box .lay span.tg{position:absolute;font:700 .62rem var(--mono);top:1px;left:4px;opacity:.9}
  .cg-sl{display:grid;grid-template-columns:90px 1fr 50px;gap:10px;align-items:center;font:700 .875rem var(--mono)}.cg-sl input{accent-color:var(--c)}
  .cg-seg{display:flex;flex-wrap:wrap;gap:4px}.cg-seg button{all:unset;cursor:pointer;font:700 .75rem var(--mono);padding:.25em .65em;border-radius:6px;background:var(--card);border:1px solid var(--line);transition:.15s}.cg-seg button.on{background:var(--ts);color:#fff;border-color:var(--ts)}
  .cg-fx{display:flex;min-height:240px;background:repeating-linear-gradient(45deg,var(--card),var(--card) 8px,transparent 8px,transparent 16px);border:2px dashed var(--ts);border-radius:8px;padding:8px;transition:.3s}
  .cg-fx>div{min-width:44px;min-height:44px;border-radius:8px;display:grid;place-items:center;font:900 1rem var(--mono);color:#06101f;transition:all .45s cubic-bezier(.3,1.2,.4,1)}
  .cg-pos{position:relative;background:#fff;border-radius:8px;min-height:330px;padding:18px;color:#222;overflow:hidden;border:1px solid var(--line)}
  .cg-pos .par{border:2px dashed #8a8fb4;border-radius:8px;padding:14px;min-height:230px;margin-top:14px;position:relative}
  .cg-pos .par::before{content:attr(data-l);position:absolute;top:-1.1em;left:8px;font:700 .68rem var(--mono);color:#8a8fb4;background:#fff;padding:0 .4em}
  .cg-pos .b{width:96px;height:52px;border-radius:8px;display:grid;place-items:center;font:900 1rem var(--mono);color:#fff;margin-bottom:10px;transition:all .4s}
  .cg-pos .ghost{position:absolute;border:2px dashed #ff6b9d;border-radius:8px;pointer-events:none;transition:.3s}
  `);

  const btn = (t, f, c = '') => h('button', { class: 'btn ' + c, onclick: f }, t);
  const taskBox = () => h('div', { class: 'tasks', style: { borderRadius: '8px', border: '1px solid var(--line)', marginTop: '12px' } });
  function drawTasks(box, list, state) {
    const req = list.filter((t) => !t.optional), opt = list.filter((t) => t.optional).sort((a, b) => (a.level || 1) - (b.level || 1));
    const LV = ['初級', '中級', '上級'];
    const lvChip = (t) => { const n = Math.min(3, Math.max(1, t.level || 1)); return h('span', { class: 'lv lv' + n, title: 'チャレンジ ' + LV[n - 1] }, Array.from({ length: n }, () => K.W.icon('star')), LV[n - 1]); };
    const row = (t) => h('div', { class: 'task' + (t.ok ? ' ok' : '') + (t.optional ? ' opt' : '') }, h('i', t.ok ? '✓' : ''), h('span', { class: 'task-l' }, t.optional && opt.length > 1 ? lvChip(t) : null, t.label), K.W.hintButton(t, {}));
    box.replaceChildren(...req.map(row), ...(opt.length ? [h('div', { class: 'mission-opt-head' }, h('span', { class: 'opt-badge' }, '任意'), h('b', 'チャレンジ'), h('small', 'もっと挑戦したい人だけ。やらなくても OK')), ...opt.map(row)] : []));
    if (req.length && req.every((t) => t.ok) && !state.done) { state.done = true; celebrate(); }
  }
  function slider(label, min, max, val, unit, onchange, c) {
    const out = h('span', val + unit);
    const inp = h('input', { type: 'range', min, max, value: val, oninput: (e) => { out.textContent = e.target.value + unit; onchange(+e.target.value); } });
    return h('div', { class: 'cg-sl', style: { '--c': c || TS } }, h('span', label), inp, out);
  }
  function seg(opts, val, onpick) {
    const d = h('div', { class: 'cg-seg' });
    const draw = (v) => d.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.v === v));
    opts.forEach((o) => d.append(h('button', { 'data-v': o, onclick: () => { draw(o); onpick(o); } }, o)));
    draw(val);
    return d;
  }

  function gitQ(sim) {
    sim.q = { ahead: (a, b) => [...sim.ancestors(a)].filter((x) => !sim.ancestors(b).has(x)).length, tip: sim.tip, C: sim.C, isAnc: (a, b) => sim.ancestors(b).has(a), ancestors: sim.ancestors, headTree: sim.headTree, work: sim.work, rev: sim.rev,
      changed: (id) => { const c = sim.C(id), pt = c.parents[0] ? sim.C(c.parents[0]).tree : {}; return [...new Set([...Object.keys(pt), ...Object.keys(c.tree)])].filter((p) => pt[p] !== c.tree[p]); } };
    return sim;
  }
  K.sim = { makeTerm, makeVim, makeGitSim, gitQ };

  /* ============================================================
     CUI simulator
  ============================================================ */
  /* ============================================================
     Git シミュレータ（練習用の小さな本物）：作業ディレクトリ・ステージ・コミット・枝・GitHub(origin)
     fs はターミナルと共有。コマンドは本物の git に近い出力にする
  ============================================================ */
  function makeGitSim(root) {
    const S = { commits: {}, branches: {}, head: 'main', index: {}, remote: {}, tracking: {}, upstream: {}, stash: [], tags: {}, n: 0, pr: 0, did: {}, maxStash: 0, lastPush: null, marks: {} };
    const hid = (k) => (Math.imul(k + 7, 2654435761) >>> 0).toString(16).padStart(8, '0').slice(0, 7);
    // ---- 作業ディレクトリ（fs）の読み書き ----
    const work = () => { const m = {}; const rec = (n, pre) => Object.entries(n.c).forEach(([k, v]) => { if (k === '.git') return; if (v.t === 'd') rec(v, pre + k + '/'); else m[pre + k] = v.v; }); rec(root, ''); return m; };
    const setF = (path, v) => {
      const ps = path.split('/'), name = ps.pop(); let n = root;
      for (const p of ps) { if (!n.c[p]) n.c[p] = { t: 'd', c: {} }; n = n.c[p]; }
      if (v === undefined) delete n.c[name]; else if (n.c[name] && n.c[name].t === 'f') n.c[name].v = v; else n.c[name] = { t: 'f', v };
    };
    const commitObj = (msg, parents, tree) => { const id = hid(S.n++); S.commits[id] = { id, seq: S.n, parents, msg, tree: Object.assign({}, tree) }; return id; };
    const tip = () => S.branches[S.head];
    const C = (id) => S.commits[id];
    const headTree = () => (tip() ? C(tip()).tree : {});
    const ancestors = (id) => { const s = new Set(), st = [id]; while (st.length) { const x = st.pop(); if (!x || s.has(x)) continue; s.add(x); st.push(...C(x).parents); } return s; };
    const isAnc = (a, b) => ancestors(b).has(a);
    const mergeBase = (a, b) => { const A = ancestors(a); const q = [b], seen = new Set(); while (q.length) { const x = q.shift(); if (seen.has(x)) continue; seen.add(x); if (A.has(x)) return x; q.push(...C(x).parents); } return null; };
    const mergeTrees = (base, ours, theirs) => {
      const out = {}, bad = []; new Set([...Object.keys(base), ...Object.keys(ours), ...Object.keys(theirs)]).forEach((p) => {
        const b = base[p], o = ours[p], t = theirs[p]; let v;
        if (o === t) v = o; else if (o === b) v = t; else if (t === b) v = o; else { bad.push(p); v = o; }
        if (v !== undefined) out[p] = v;
      }); return { tree: out, bad };
    };
    const rev = (s) => {
      if (!s || s === 'HEAD') return tip();
      let m = s.match(/^(.+?)(?:~(\d+)|\^)?$/); let base = m[1], n = m[2] !== undefined ? +m[2] : (s.endsWith('^') ? 1 : 0);
      let id = base === 'HEAD' ? tip() : S.branches[base] || (base.startsWith('origin/') ? S.tracking[base.slice(7)] : null) || S.tags[base] || Object.keys(S.commits).find((k) => k.startsWith(base));
      while (id && n-- > 0) id = C(id).parents[0];
      return id || null;
    };
    const ignored = (p) => {
      const g = work()['.gitignore']; if (!g) return false;
      return g.split('\n').map((x) => x.trim()).filter((x) => x && !x.startsWith('#')).some((r) => {
        if (r.endsWith('/')) return p.startsWith(r) || p.includes('/' + r);
        if (r.startsWith('*')) return p.endsWith(r.slice(1));
        return p === r || p.endsWith('/' + r);
      });
    };
    const changes = () => {
      const H = headTree(), I = S.index, W = work(); const staged = [], unstaged = [], untracked = [];
      new Set([...Object.keys(H), ...Object.keys(I)]).forEach((p) => { if (H[p] !== I[p]) staged.push([H[p] === undefined ? 'new file' : I[p] === undefined ? 'deleted' : 'modified', p]); });
      Object.keys(I).forEach((p) => { if (W[p] === undefined) unstaged.push(['deleted', p]); else if (W[p] !== I[p]) unstaged.push(['modified', p]); });
      Object.keys(W).forEach((p) => { if (I[p] === undefined && !ignored(p)) untracked.push(p); });
      return { staged: staged.sort((a, b) => a[1].localeCompare(b[1])), unstaged: unstaged.sort((a, b) => a[1].localeCompare(b[1])), untracked: untracked.sort() };
    };
    const dirty = () => { const c = changes(); return c.staged.length || c.unstaged.length; };
    const lines = (t) => (t === undefined ? [] : t.split('\n').filter((x, i, a) => !(i === a.length - 1 && x === '')));
    const diffLines = (a, b) => {
      const n = a.length, m = b.length, L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
      for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
      const o = []; let i = 0, j = 0;
      while (i < n && j < m) { if (a[i] === b[j]) { o.push('  ' + a[i]); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) o.push('- ' + a[i++]); else o.push('+ ' + b[j++]); }
      while (i < n) o.push('- ' + a[i++]); while (j < m) o.push('+ ' + b[j++]); return o;
    };
    const decor = (id) => {
      const d = []; Object.entries(S.branches).forEach(([b, x]) => { if (x === id) d.push(b === S.head ? 'HEAD -> ' + b : b); });
      Object.entries(S.tracking).forEach(([b, x]) => { if (x === id) d.push('origin/' + b); });
      Object.entries(S.tags).forEach(([t, x]) => { if (x === id) d.push('tag: ' + t); });
      d.sort((a, b) => (b.startsWith('HEAD') ? 1 : 0) - (a.startsWith('HEAD') ? 1 : 0)); return d.length ? ' (' + d.join(', ') + ')' : '';
    };
    const ahead = (a, b) => [...ancestors(a)].filter((x) => !ancestors(b).has(x)).length;
    // ---- 作業ディレクトリをツリーに合わせる（変更中のファイルは触らない） ----
    function switchTree(target, carry) {
      const H = headTree(), W = work(), I = S.index;
      const mod = (p) => W[p] !== H[p] || I[p] !== H[p];
      const clash = [...new Set([...Object.keys(H), ...Object.keys(target)])].filter((p) => mod(p) && target[p] !== H[p]);
      if (clash.length) return clash;
      new Set([...Object.keys(H), ...Object.keys(target)]).forEach((p) => { if (mod(p)) return; setF(p, target[p]); if (target[p] === undefined) delete S.index[p]; else S.index[p] = target[p]; });
      return null;
    }
    const full = (tree) => { S.index = Object.assign({}, tree); };
    const stat = (a, b) => { const k = new Set([...Object.keys(a), ...Object.keys(b)]); let n = 0; k.forEach((p) => { if (a[p] !== b[p]) n++; }); return n; };
    const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

    const api = {
      S, work, changes, tip, C, ancestors, rev, headTree, isAnc,
      seed(def) {
        // def: { files:{path:content}, commits:[{msg, files:{...}}], remoteAhead:[{msg, files}], branches... }
        (def.commits || []).forEach((c) => {
          const base = tip() ? C(tip()).tree : {}; const tree = Object.assign({}, base, c.files || {}); (c.del || []).forEach((p) => delete tree[p]);
          if (c.branch && c.branch !== S.head) { if (!S.branches[c.branch]) S.branches[c.branch] = tip(); S.head = c.branch; }
          const id = commitObj(c.msg, tip() ? [tip()] : [], tree); S.branches[S.head] = id;
          if (c.push) { S.remote[S.head] = id; S.tracking[S.head] = id; S.upstream[S.head] = true; }
        });
        S.head = def.head || 'main'; const t = headTree();
        Object.keys(work()).forEach((p) => setF(p, undefined)); Object.entries(t).forEach(([p, v]) => setF(p, v)); full(t);
        Object.entries(def.work || {}).forEach(([p, v]) => setF(p, v));
        (def.remoteOnly || []).forEach((c) => { const b = c.branch || 'main'; const base = C(S.remote[b]).tree; const id = commitObj(c.msg, [S.remote[b]], Object.assign({}, base, c.files)); S.remote[b] = id; });
      },
      // GitHub 側の操作（ボタン）
      ghMerge(src, dst) {
        if (!S.remote[src]) return { ok: false, msg: 'GitHub に「' + src + '」がまだ無い。先に git push しよう' };
        if (!S.remote[dst]) return { ok: false, msg: 'GitHub に「' + dst + '」が無い' };
        if (src === dst) return { ok: false, msg: '同じ枝どうしは Merge できない' };
        const a = S.remote[dst], b = S.remote[src];
        if (isAnc(b, a)) return { ok: false, msg: '取り込む変更がない（すでに ' + dst + ' に入っている）' };
        const base = mergeBase(a, b), r = mergeTrees(C(base).tree, C(a).tree, C(b).tree);
        if (r.bad.length) return { ok: false, msg: 'PR に衝突がある（' + r.bad.join(', ') + '）。手元で直してから' };
        const id = commitObj(`Merge pull request #${++S.pr} from team/${src}`, [a, b], r.tree); S.remote[dst] = id;
        return { ok: true, msg: `PR #${S.pr} を Merge。GitHub の ${dst} だけが進んだ（手元はまだ古い → git pull）` };
      },
      ghColleague(dst) {
        const a = S.remote[dst]; if (!a) return { ok: false, msg: '' };
        const t = Object.assign({}, C(a).tree); t['README.md'] = (t['README.md'] || '') + '同僚の追記 ' + (S.n) + '\n';
        S.remote[dst] = commitObj('同僚の変更 (README)', [a], t); return { ok: true, msg: `同僚が GitHub の ${dst} を更新した（手元はまだ知らない）` };
      },
      snapshot() {
        const c = changes(), log = [];
        let id = tip(); const seen = new Set(), q = id ? [id] : [];
        while (q.length && log.length < 9) { q.sort((x, y) => C(y).seq - C(x).seq); const x = q.shift(); if (seen.has(x)) continue; seen.add(x); log.push({ id: x, msg: C(x).msg.split('\n')[0], d: decor(x), merge: C(x).parents.length > 1 }); q.push(...C(x).parents); }
        const rem = Object.keys(S.remote).map((b) => ({ b, id: S.remote[b], msg: C(S.remote[b]).msg.split('\n')[0], behind: S.tracking[b] !== S.remote[b] }));
        return { head: S.head, c, log, rem, locals: Object.keys(S.branches), stash: S.stash.length, tags: Object.keys(S.tags) };
      },
      run(args, out, err) {
        S.did[args[0]] = true; const sub = args[0], a = args.slice(1), flag = (f) => a.includes(f), pos = a.filter((x) => !x.startsWith('-'));
        const cur = S.head, say = (t) => out(t);
        const fail = (t) => err(t);
        switch (sub) {
          case undefined: return fail('usage: git <command> [<args>]\nよく使う: status add commit log diff branch checkout merge push pull stash reset revert tag');
          case 'status': {
            const c = changes(); let o = `On branch ${cur}`;
            if (S.upstream[cur] && S.tracking[cur]) {
              const ah = ahead(tip(), S.tracking[cur]), bh = ahead(S.tracking[cur], tip());
              o += ah && bh ? `\nYour branch and 'origin/${cur}' have diverged.` : ah ? `\nYour branch is ahead of 'origin/${cur}' by ${plural(ah, 'commit')}.\n  (use "git push" to publish your local commits)` : bh ? `\nYour branch is behind 'origin/${cur}' by ${plural(bh, 'commit')}, and can be fast-forwarded.\n  (use "git pull" to update your local branch)` : `\nYour branch is up to date with 'origin/${cur}'.`;
            }
            if (c.staged.length) o += '\n\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)' + c.staged.map(([k, p]) => `\n\t${(k + ':').padEnd(12)}${p}`).join('');
            if (c.unstaged.length) o += '\n\nChanges not staged for commit:\n  (use "git add <file>..." to update what will be committed)\n  (use "git restore <file>..." to discard changes in working directory)' + c.unstaged.map(([k, p]) => `\n\t${(k + ':').padEnd(12)}${p}`).join('');
            if (c.untracked.length) o += '\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)' + c.untracked.map((p) => `\n\t${p}`).join('');
            if (!c.staged.length && !c.unstaged.length) o += c.untracked.length ? '\n\nnothing added to commit but untracked files present (use "git add" to track)' : '\n\nnothing to commit, working tree clean';
            else if (!c.staged.length) o += '\n\nno changes added to commit (use "git add" and/or "git commit -a")';
            return say(o);
          }
          case 'add': {
            if (!pos.length && !flag('-A') && !flag('.')) return fail('Nothing specified, nothing added.\nhint: Maybe you wanted to say \'git add .\'?');
            const W = work(); const all = flag('.') || flag('-A') || pos.includes('.');
            const paths = all ? new Set([...Object.keys(W).filter((x) => !ignored(x) || S.index[x] !== undefined), ...Object.keys(S.index)]) : new Set(pos.flatMap((p) => { const m = [...new Set([...Object.keys(W), ...Object.keys(S.index)])].filter((x) => x === p || x.startsWith(p.replace(/\/$/, '') + '/')); if (!m.length) fail(`fatal: pathspec '${p}' did not match any files`); return m; }));
            paths.forEach((p) => { if (W[p] === undefined) delete S.index[p]; else S.index[p] = W[p]; }); return;
          }
          case 'commit': {
            const am = flag('--amend'), mi = args.findIndex((x) => x === '-m' || x === '-am' || x === '-a'), mm = args.findIndex((x) => x === '-m' || x === '-am');
            let msg = mm >= 0 ? args[mm + 1] : null;
            if (flag('-a') || flag('-am')) { const W = work(); Object.keys(S.index).forEach((p) => { if (W[p] === undefined) delete S.index[p]; else S.index[p] = W[p]; }); }
            if (msg == null && !(am && flag('--no-edit'))) return fail('（この画面ではエディタが開けない）メッセージは -m "..." で付けよう。例: git commit -m "ログイン画面を追加"');
            const H = headTree(), c = changes();
            if (!am && !c.staged.length) { return say(`On branch ${cur}\n` + (c.unstaged.length || c.untracked.length ? (c.unstaged.length ? 'Changes not staged for commit:\n' + c.unstaged.map(([k, p]) => `\t${k}:   ${p}`).join('\n') + '\n\nno changes added to commit (use "git add" and/or "git commit -a")\n→ 先に git add で「次のコミットに入れる物」を選ぼう' : 'nothing added to commit but untracked files present (use "git add" to track)') : 'nothing to commit, working tree clean')); }
            const old = am ? C(tip()) : null;
            const id = commitObj(msg != null ? msg : old.msg, am ? old.parents : [tip()], S.index); S.branches[cur] = id;
            return say(`[${cur} ${id}] ${msg != null ? msg : old.msg}\n ${plural(stat(am && old.parents[0] ? C(old.parents[0]).tree : H, S.index), 'file')} changed${am ? '\n（直前のコミットを作り直した）' : ''}`);
          }
          case 'log': {
            const one = flag('--oneline'); let nn = 99; const ni = args.findIndex((x) => /^-n$/.test(x)); if (ni >= 0) nn = +args[ni + 1]; const m = args.find((x) => /^-\d+$/.test(x)); if (m) nn = -m;
            const res = []; const seen = new Set(), q = tip() ? [tip()] : []; const pf = args.includes('--') ? args.slice(args.indexOf('--') + 1)[0] : (args.find((x2) => /\.\w+$/.test(x2) && !x2.startsWith('-')) || null);
            const touched = (id2) => { if (!pf) return true; const c2 = C(id2), pt2 = c2.parents[0] ? C(c2.parents[0]).tree : {}; return c2.tree[pf] !== pt2[pf]; };
            while (q.length && res.length < nn) { q.sort((x, y) => C(y).seq - C(x).seq); const x = q.shift(); if (seen.has(x)) continue; seen.add(x); if (touched(x)) res.push(x); q.push(...C(x).parents); }
            if (!res.length) return fail(`fatal: your current branch '${cur}' does not have any commits yet`);
            return say(res.map((x) => one ? `${x}${decor(x)} ${C(x).msg.split('\n')[0]}` : `commit ${x}${decor(x)}\nAuthor: you <you@example.com>\n\n    ${C(x).msg.split('\n')[0]}\n`).join('\n'));
          }
          case 'diff': {
            const rr = pos.length ? (pos[0].includes('..') ? pos[0].split('..') : pos.slice(0, 2)) : []; if (rr.length === 2 && rev(rr[0]) && rev(rr[1])) {
              const A2 = C(rev(rr[0])).tree, B2 = C(rev(rr[1])).tree, o2 = [];
              [...new Set([...Object.keys(A2), ...Object.keys(B2)])].sort().forEach((p2) => { if (A2[p2] === B2[p2]) return; o2.push(`diff --git a/${p2} b/${p2}`, ...diffLines(lines(A2[p2]), lines(B2[p2])).filter((x2) => x2[0] !== ' ')); });
              return say(o2.length ? o2.join('\n') : '（差分なし）');
            }
            const st = flag('--staged') || flag('--cached'); const W = work(), H = headTree();
            const A = st ? H : S.index, B = st ? S.index : W; const o = [];
            [...new Set([...Object.keys(A), ...Object.keys(B)])].sort().forEach((p) => {
              if (A[p] === B[p]) return; if (!st && A[p] === undefined) return;
              o.push(`diff --git a/${p} b/${p}`, `--- a/${p}`, `+++ b/${p}`, ...diffLines(lines(A[p]), lines(B[p])).filter((x) => x[0] !== ' ' || false).map((x) => x));
            });
            return say(o.length ? o.join('\n') : '（差分なし）');
          }
          case 'branch': {
            if (flag('-d') || flag('-D')) {
              const b = pos[0]; if (!b) return fail('fatal: branch name required');
              if (!S.branches[b]) return fail(`error: branch '${b}' not found.`);
              if (b === cur) return fail(`error: Cannot delete branch '${b}' checked out`);
              if (flag('-d') && !isAnc(S.branches[b], tip()) && !(S.tracking[b] && isAnc(S.branches[b], S.tracking[b]))) return fail(`error: The branch '${b}' is not fully merged.\nIf you are sure you want to delete it, run 'git branch -D ${b}'.`);
              const id = S.branches[b]; delete S.branches[b]; delete S.upstream[b]; return say(`Deleted branch ${b} (was ${id}).`);
            }
            if (flag('-r') || flag('-a')) return say(Object.keys(S.tracking).map((b) => '  origin/' + b).join('\n'));
            if (!pos.length) return say(Object.keys(S.branches).sort().map((b) => (b === cur ? '* ' : '  ') + b).join('\n'));
            const nm = pos[0]; if (S.branches[nm]) return fail(`fatal: a branch named '${nm}' already exists`);
            const st = pos[1] ? rev(pos[1]) : tip(); if (!st) return fail(`fatal: not a valid object name: '${pos[1]}'`); S.branches[nm] = st; return;
          }
          case 'checkout': case 'switch': {
            if (a[0] === '--' || (a.length && flag('.') && !flag('-b')) || (pos[0] && !S.branches[pos[0]] && !S.tracking[pos[0]] && !flag('-b') && Object.keys(work()).concat(Object.keys(S.index)).some((p) => p === pos[0]))) {
              const files = a[0] === '--' ? a.slice(1) : pos; const I = S.index; let n = 0;
              files.forEach((f) => { const ps = f === '.' ? Object.keys(I) : Object.keys(I).filter((p) => p === f); if (!ps.length) { fail(`error: pathspec '${f}' did not match any file(s) known to git`); return; } ps.forEach((p) => { if (work()[p] !== I[p]) { setF(p, I[p]); n++; } }); });
              return;
            }
            if (flag('-b') || flag('-c')) {
              const nm = pos[0]; if (!nm) return fail('fatal: switch `b\' requires a value');
              if (S.branches[nm]) return fail(`fatal: a branch named '${nm}' already exists`);
              const st = pos[1] ? rev(pos[1]) : tip(); if (!st) return fail(`fatal: '${pos[1]}' is not a commit and a branch '${nm}' cannot be created from it`);
              if (st !== tip()) { const cl = switchTree(C(st).tree); if (cl) return fail(`error: Your local changes to the following files would be overwritten by checkout:\n\t${cl.join('\n\t')}\nPlease commit your changes or stash them before you switch branches.\nAborting`); }
              S.branches[nm] = st; S.head = nm; return say(`Switched to a new branch '${nm}'`);
            }
            const b = pos[0]; if (!b) return fail('error: 枝の名前を付けよう（例: git checkout main）');
            if (b === cur) return say(`Already on '${b}'`);
            let target = S.branches[b], note = '';
            if (!target && S.tracking[b]) { target = S.tracking[b]; note = `branch '${b}' set up to track 'origin/${b}'.\n`; }
            if (!target) return fail(`error: pathspec '${b}' did not match any file(s) known to git`);
            const cl = switchTree(C(target).tree);
            if (cl) return fail(`error: Your local changes to the following files would be overwritten by checkout:\n\t${cl.join('\n\t')}\nPlease commit your changes or stash them before you switch branches.\nAborting\n→ 変更を commit するか、git stash で一時的にしまってから移ろう`);
            if (note) { S.branches[b] = target; S.upstream[b] = true; }
            S.head = b; return say(note + `Switched to branch '${b}'` + (S.upstream[b] && S.tracking[b] ? `\nYour branch is up to date with 'origin/${b}'.` : ''));
          }
          case 'restore': {
            const st = flag('--staged'); if (!pos.length) return fail('fatal: you must specify path(s) to restore');
            const H = headTree(), I = S.index;
            pos.forEach((f) => { const ps = f === '.' ? [...new Set([...Object.keys(H), ...Object.keys(I)])] : [f]; ps.forEach((p) => {
              if (H[p] === undefined && I[p] === undefined && f !== '.') { fail(`error: pathspec '${f}' did not match any file(s) known to git`); return; }
              if (st) { if (H[p] === undefined) delete I[p]; else I[p] = H[p]; } else setF(p, I[p]);
            }); }); return;
          }
          case 'merge': {
            const b = pos[0]; if (!b) return fail('fatal: No commit specified and merge.defaultToUpstream not set.');
            const t = rev(b); if (!t) return fail(`merge: ${b} - not something we can merge`);
            const c = tip();
            if (isAnc(t, c)) return say('Already up to date.');
            if (isAnc(c, t)) { const cl = switchTree(C(t).tree); if (cl) return fail(`error: Your local changes to the following files would be overwritten by merge:\n\t${cl.join('\n\t')}\nAborting`); const n = stat(C(c).tree, C(t).tree); S.branches[cur] = t; return say(`Updating ${c}..${t}\nFast-forward\n ${plural(n, 'file')} changed`); }
            if (dirty()) return fail('error: 変更が残っている。先に commit か stash を');
            const base = mergeBase(c, t), r = mergeTrees(C(base).tree, C(c).tree, C(t).tree);
            if (r.bad.length) return fail(`CONFLICT (content): Merge conflict in ${r.bad[0]}\nAutomatic merge failed; fix conflicts and then commit the result.\n（練習では、衝突は「コンフリクトを解決しよう」で体験する。ここでは自動で取り消した）`);
            const id = commitObj(`Merge branch '${b}' into ${cur}`, [c, t], r.tree); const cl = switchTree(r.tree); S.branches[cur] = id; return say(`Merge made by the 'ort' strategy.\n ${plural(stat(C(c).tree, r.tree), 'file')} changed`);
          }
          case 'fetch': { let n = 0; Object.keys(S.remote).forEach((b) => { if (S.tracking[b] !== S.remote[b]) { n++; S.tracking[b] = S.remote[b]; } }); return say(n ? 'From github.com:team/app\n' + Object.keys(S.remote).map((b) => `   ${b} -> origin/${b}`).join('\n') : ''); }
          case 'pull': {
            let b = cur; if (pos[0] === 'origin' && pos[1]) b = pos[1]; else if (!S.upstream[cur] && !pos.length) return fail(`There is no tracking information for the current branch.\nPlease specify which branch you want to merge with.\n\n    git pull origin <枝の名前>\n\n（または git branch --set-upstream-to=origin/${cur} ${cur}）`);
            if (!S.remote[b]) return fail(`fatal: couldn't find remote ref ${b}`);
            const before = S.tracking[b]; Object.keys(S.remote).forEach((x) => { S.tracking[x] = S.remote[x]; });
            let o = before !== S.remote[b] ? `From github.com:team/app\n   ${before ? before + '..' : '* '}${S.remote[b]}  ${b} -> origin/${b}\n` : '';
            const t = S.remote[b], c = tip();
            if (isAnc(t, c)) return say(o + 'Already up to date.');
            if (isAnc(c, t)) { const cl = switchTree(C(t).tree); if (cl) return fail(`error: Your local changes to the following files would be overwritten by merge:\n\t${cl.join('\n\t')}\nPlease commit your changes or stash them before you merge.\nAborting`); S.branches[cur] = t; return say(o + `Updating ${c}..${t}\nFast-forward\n ${plural(stat(C(c).tree, C(t).tree), 'file')} changed`); }
            if (dirty()) return fail('error: 変更が残っている。先に commit か stash を');
            const base = mergeBase(c, t), r = mergeTrees(C(base).tree, C(c).tree, C(t).tree);
            if (r.bad.length) return fail(`CONFLICT (content): Merge conflict in ${r.bad[0]}\n（練習では衝突は扱わない）`);
            const id = commitObj(`Merge branch '${b}' of github.com:team/app into ${cur}`, [c, t], r.tree); switchTree(r.tree); S.branches[cur] = id; return say(o + `Merge made by the 'ort' strategy.`);
          }
          case 'push': {
            const setUp = flag('-u') || flag('--set-upstream'); let b = cur;
            if (pos[0] === 'origin') b = pos[1] === 'HEAD' || !pos[1] ? cur : pos[1];
            else if (pos.length) return fail(`fatal: '${pos[0]}' does not appear to be a git repository`);
            else if (!S.upstream[cur]) return fail(`fatal: The current branch ${cur} has no upstream branch.\nTo push the current branch and set the remote as upstream, use\n\n    git push --set-upstream origin ${cur}\n\n（短く: git push -u origin ${cur}）`);
            if (S.tags[b] && !S.branches[b]) { return say(`To github.com:team/app.git\n * [new tag]         ${b} -> ${b}`); }
            const l = S.branches[b]; if (!l) return fail(`error: src refspec ${b} does not match any\nerror: failed to push some refs to 'github.com:team/app.git'`);
            const r = S.remote[b];
            if (r === l) return say('Everything up-to-date');
            if (r && !isAnc(r, l) && (flag('--force') || flag('-f') || flag('--force-with-lease'))) { S.remote[b] = l; S.tracking[b] = l; S.forced = true; return say(`To github.com:team/app.git\n + ${r}...${l} ${b} -> ${b} (forced update)\n（GitHub 側の履歴を上書きした。他の人の commit が消えることがある）`); }
            if (r && !isAnc(r, l)) return fail(`To github.com:team/app.git\n ! [rejected]        ${b} -> ${b} (${S.tracking[b] !== r ? 'fetch first' : 'non-fast-forward'})\nerror: failed to push some refs to 'github.com:team/app.git'\nhint: 先に git pull で GitHub の最新を取り込もう`);
            S.remote[b] = l; S.tracking[b] = l; if (setUp) S.upstream[b] = true; if (b !== 'main' && b !== 'develop') S.lastPush = b;
            return say(`To github.com:team/app.git\n ${r ? '  ' + r + '..' + l : '* [new branch]     '} ${b} -> ${b}` + (setUp ? `\nbranch '${b}' set up to track 'origin/${b}'.` : ''));
          }
          case 'stash': {
            const op = pos[0] || 'push';
            if (op === 'list') return say(S.stash.map((s, i) => `stash@{${i}}: ${s.msg}`).join('\n'));
            if (op === 'pop' || op === 'apply') {
              const s = S.stash[0]; if (!s) return fail('No stash entries found.');
              const W = work(), H = headTree(); const bad = Object.keys(s.ch).filter((p) => W[p] !== H[p] && W[p] !== s.ch[p]);
              if (bad.length) return fail(`error: Your local changes to the following files would be overwritten by merge:\n\t${bad.join('\n\t')}\nPlease commit your changes or stash them before you merge.\nAborting`);
              Object.entries(s.ch).forEach(([p, v]) => setF(p, v)); if (op === 'pop') S.stash.shift();
              const c = changes(); return say(`On branch ${cur}\nChanges not staged for commit:\n` + c.unstaged.map(([k, p]) => `\t${k}:   ${p}`).join('\n') + (op === 'pop' ? '\n\nDropped refs/stash@{0} （stash の中身は取り出して消えた）' : ''));
            }
            if (op === 'drop') { if (!S.stash.length) return fail('No stash entries found.'); S.stash.shift(); return say('Dropped refs/stash@{0}'); }
            if (op !== 'push' && op !== 'save') return fail(`error: unknown subcommand: ${op}`);
            const c = changes(); if (!c.staged.length && !c.unstaged.length) return say('No local changes to save');
            const W = work(), H = headTree(), ch = {};
            new Set([...Object.keys(W), ...Object.keys(H), ...Object.keys(S.index)]).forEach((p) => { if ((S.index[p] !== undefined || H[p] !== undefined) && (W[p] !== H[p] || S.index[p] !== H[p])) ch[p] = W[p]; });
            const msg = `WIP on ${cur}: ${tip()} ${C(tip()).msg.split('\n')[0]}`; S.stash.unshift({ msg, ch }); S.maxStash = Math.max(S.maxStash, S.stash.length);
            Object.keys(ch).forEach((p) => setF(p, H[p])); full(H); return say(`Saved working directory and index state ${msg}`);
          }
          case 'reset': {
            const mode = flag('--hard') ? 'hard' : flag('--soft') ? 'soft' : 'mixed'; const tgt = pos[0] || 'HEAD';
            if (pos.length && !rev(tgt) && headTree()[pos[0]] === undefined) return fail(`fatal: ambiguous argument '${tgt}': unknown revision or path not in the working tree.`);
            if (pos.length && (tgt === 'HEAD' || !rev(tgt)) && pos.length > 1 || (pos.length === 1 && !rev(pos[0]))) { const H = headTree(); pos.filter((x) => x !== 'HEAD').forEach((p) => { if (H[p] === undefined) delete S.index[p]; else S.index[p] = H[p]; }); return; }
            const id = rev(tgt); if (!id) return fail(`fatal: ambiguous argument '${tgt}': unknown revision`);
            S.branches[cur] = id; const T = C(id).tree;
            if (mode !== 'soft') full(T); if (mode === 'hard') { const W = work(); new Set([...Object.keys(W), ...Object.keys(T)]).forEach((p) => { if (T[p] !== W[p]) setF(p, T[p]); }); return say(`HEAD is now at ${id} ${C(id).msg.split('\n')[0]}`); }
            return say(mode === 'mixed' ? 'Unstaged changes after reset:\n' + changes().unstaged.map(([k, p]) => `${k[0].toUpperCase()}\t${p}`).join('\n') : '');
          }
          case 'revert': {
            const t = rev(pos[0] || 'HEAD'); if (!t) return fail(`fatal: bad revision '${pos[0]}'`);
            if (dirty()) return fail('error: your local changes would be overwritten by revert.\nhint: commit your changes or stash them to proceed.\nfatal: revert failed');
            const c = C(t), p = c.parents[0] ? C(c.parents[0]).tree : {}, H = Object.assign({}, headTree());
            Object.keys(Object.assign({}, c.tree, p)).forEach((f) => { if (c.tree[f] !== p[f]) { if (p[f] === undefined) delete H[f]; else H[f] = p[f]; } });
            const first = c.msg.split('\n')[0]; const id = commitObj(`Revert "${first}"\n\nThis reverts commit ${t}.`, [tip()], H);
            const old = headTree(); S.branches[cur] = id; Object.keys(Object.assign({}, old, H)).forEach((f) => { if (old[f] !== H[f]) setF(f, H[f]); }); full(H);
            return say(`[${cur} ${id}] Revert "${first}"\n ${plural(stat(old, H), 'file')} changed\n（元の commit は消えない。「取り消す commit」が1つ増える）`);
          }
          case 'tag': {
            if (!pos.length) return say(Object.keys(S.tags).sort().join('\n'));
            const nm = pos[0]; if (S.tags[nm]) return fail(`fatal: tag '${nm}' already exists`);
            if (flag('-a') && !args.includes('-m')) return fail('（エディタが開けない）-m "メッセージ" も付けよう');
            const id = pos[1] && !args.includes('-m') ? rev(pos[1]) : (args.includes('-m') ? tip() : tip()); S.tags[nm] = id; return;
          }
          case 'blame': {
            const f = pos[0]; if (!f) return fail('usage: git blame <file>');
            const chain = []; let x = tip(); while (x) { chain.unshift(x); x = C(x).parents[0]; }
            const vers = chain.map((id) => ({ id, ls: lines(C(id).tree[f]) , has: C(id).tree[f] !== undefined })).filter((v) => v.has);
            if (!vers.length) return fail(`fatal: no such path ${f} in HEAD`);
            let own = vers[0].ls.map(() => vers[0].id), prev = vers[0].ls;
            for (let i = 1; i < vers.length; i++) {
              const cur2 = vers[i].ls, n = prev.length, m = cur2.length, L2 = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
              for (let a2 = n - 1; a2 >= 0; a2--) for (let b2 = m - 1; b2 >= 0; b2--) L2[a2][b2] = prev[a2] === cur2[b2] ? L2[a2 + 1][b2 + 1] + 1 : Math.max(L2[a2 + 1][b2], L2[a2][b2 + 1]);
              const no = new Array(m).fill(vers[i].id); let a2 = 0, b2 = 0;
              while (a2 < n && b2 < m) { if (prev[a2] === cur2[b2]) { no[b2] = own[a2]; a2++; b2++; } else if (L2[a2 + 1][b2] >= L2[a2][b2 + 1]) a2++; else b2++; }
              own = no; prev = cur2;
            }
            return say(prev.map((l, i) => `${own[i]} (you ${String(i + 1).padStart(2)}) ${l}`).join('\n'));
          }
          case 'show': {
            const id = rev(pos[0] || 'HEAD'); if (!id) return fail(`fatal: ambiguous argument '${pos[0]}': unknown revision`);
            const c = C(id), pt = c.parents[0] ? C(c.parents[0]).tree : {}; const o = [`commit ${id}${decor(id)}`, 'Author: you <you@example.com>', '', '    ' + c.msg.split('\n')[0], ''];
            [...new Set([...Object.keys(pt), ...Object.keys(c.tree)])].sort().forEach((p2) => { if (pt[p2] === c.tree[p2]) return; o.push(`diff --git a/${p2} b/${p2}`, ...diffLines(lines(pt[p2]), lines(c.tree[p2])).filter((x2) => x2[0] !== ' ')); });
            return say(o.join('\n'));
          }
          case 'rm': {
            const cached = flag('--cached'); if (!pos.length) return fail('fatal: No pathspec was given. Which files should I remove?');
            let bad = false; pos.forEach((f) => { if (S.index[f] === undefined) { bad = true; fail(`fatal: pathspec '${f}' did not match any files`); return; } delete S.index[f]; if (!cached) setF(f, undefined); say(`rm '${f}'`); }); return bad ? undefined : undefined;
          }
          case 'remote': return say(flag('-v') ? 'origin\tgit@github.com:team/app.git (fetch)\norigin\tgit@github.com:team/app.git (push)' : 'origin');
          case 'init': case 'clone': return say('（この練習用のリポジトリはすでに用意してある）');
          case 'config': return;
          default: return fail(`git: '${sub}' is not a git command. See 'git --help'.`);
        }
      },
    };
    return api;
  }

  function makeTerm(onChange, opt) {
    const fs = (opt && opt.fs) || { t: 'd', c: { logs: { t: 'd', c: { 'app.log': { t: 'f', v: 'INFO server started\nERROR E1001 DB connection failed\nerror retry 1\nINFO connected\nError E2040 timeout\n' } } }, docs: { t: 'd', c: { 'memo.txt': { t: 'f', v: '月曜 見積を確認\n火曜 リリース準備\n水曜 リリース\n' } } }, 'report.txt': { t: 'f', v: '売上 120\n経費 80\n' } } };
    let cwd = [];
    const initial = new WeakSet(), initPaths = [];
    (function walk(n, pre) { Object.entries(n.c).forEach(([k, v]) => { if (k.startsWith('.')) return; initial.add(v); if (v.t === 'd') walk(v, pre + k + '/'); else initPaths.push(pre + k); }); })(fs, '');
    const hist = [], ran = [];
    let curVim = null;
    const st = { tabs: 0, dev: 0, built: 0, installed: [], created: [], ssh: 0, registered: 0, vimLog: [], prettier: 0, eslint: 0 }, aliases = {};
    let hi = 0;
    const out = h('div', { class: 'cg-out' });
    const prompt = h('span');
    const input = h('input', { spellcheck: 'false', autocomplete: 'off', autocapitalize: 'off', placeholder: 'コマンドを入力…' });
    const el = h('div', { class: 'cg-term', onclick: () => input.focus() }, h('div', { class: 'hd' }, h('i'), h('i'), h('i')), initPaths.length ? h('div', { class: 'cg-pre' }, 'はじめからあるファイル：' + initPaths.slice(0, 8).join('、') + (initPaths.length > 8 ? ' …' : '')) : null, out, h('div', { class: 'cg-line' }, prompt, input));
    const tree = h('div', { class: 'cg-tree' });
    const fresh = new Set();
    const nodeAt = (parts) => { let n = fs; for (const p of parts) { if (!n || n.t !== 'd') return null; n = n.c[p]; } return n || null; };
    const norm = (p) => {
      const parts = p.startsWith('/') || p.startsWith('~') ? [] : cwd.slice();
      for (const s of p.replace(/^~/, '').split('/').filter(Boolean)) { if (s === '.') continue; if (s === '..') parts.pop(); else parts.push(s); }
      return parts;
    };
    const get = (p) => nodeAt(norm(p));
    const split = (p) => { const parts = norm(p); const name = parts.pop(); return { dir: nodeAt(parts), name }; };
    const path = () => '~' + (cwd.length ? '/' + cwd.join('/') : '');
    const say = (html, cls) => { out.append(h('div', { class: cls || null, html })); out.scrollTop = out.scrollHeight; };
    const GL = [['No such file or directory', 'そんなファイル／フォルダは無い'], ['File exists', 'もう同じ名前がある'], ['Is a directory', 'フォルダなので不可'], ['is a directory', 'フォルダ。消すなら -r'], ['not a directory', 'フォルダではない'], ['command not found', 'そんなコマンドは無い'], ['no such file or directory', 'そんなファイル／フォルダは無い']];
    const err = (t) => { const g = GL.find(([k]) => t.includes(k)); say(esc(t) + (g ? ' <span style="opacity:.65">← ' + g[1] + '</span>' : ''), 'err'); };
    function drawTree() {
      const rec = (n, parts) => h('ul', Object.entries(n.c).sort((a, b) => (a[1].t === b[1].t ? a[0].localeCompare(b[0]) : a[1].t === 'd' ? -1 : 1)).map(([k, v]) => {
        const cur = v.t === 'd' && parts.concat(k).join('/') === cwd.join('/');
        return h('li', { class: (cur ? 'cwd ' : '') + (fresh.has(v) ? 'nw' : '') }, h('span', { class: 'nm' }, (v.t === 'd' ? '📁 ' : '📄 ') + k), initial.has(v) ? h('small', { class: 'pre' }, 'はじめからある') : null, v.t === 'd' ? rec(v, parts.concat(k)) : null);
      }));
      tree.replaceChildren(h('div', { class: cwd.length ? '' : 'cwd' }, h('span', { class: 'nm' }, '🏠 ~ (ホーム)')), rec(fs, []));
      fresh.clear();
    }
    const pr = () => 'kenshu@pc ' + path() + (opt && opt.git ? ' (' + opt.git.S.head + ')' : '') + ' $';
    function refresh() { prompt.textContent = pr(); drawTree(); onChange && onChange(api); }

    /* ---- パイプ・リダイレクト・for ・alias ・Tab 補完 ・vim ・npm ・ssh（練習用の小さな本物） ---- */
    const unq = (x) => x.replace(/^["']|["']$/g, '');
    function splitPipe(line) {
      const o = []; let cur = '', q = null;
      for (const ch of line) { if (q) { cur += ch; if (ch === q) q = null; continue; } if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; } if (ch === '|') { o.push(cur); cur = ''; continue; } cur += ch; }
      o.push(cur); return o.map((x) => x.trim());
    }
    const hasPipe = (line) => splitPipe(line).length > 1;
    const globNames = (pat) => { const d = nodeAt(cwd); if (!d) return []; const rx = new RegExp('^' + pat.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'); return Object.entries(d.c).filter(([k, v]) => v.t === 'f' && rx.test(k)).map(([k]) => k).sort(); };
    function writeFile(path, text, append) {
      const { dir, name } = split(path);
      if (!dir || dir.t !== 'd' || !name) { err('書き込み先が不正です: ' + path); return false; }
      if (!dir.c[name]) fresh.add((dir.c[name] = { t: 'f', v: '' }));
      if (dir.c[name].t === 'd') { err(path + ': Is a directory'); return false; }
      dir.c[name].v = (append ? dir.c[name].v : '') + text; return true;
    }
    const fileLines = (n) => n.v.split('\n').filter((x, i, arr) => !(i === arr.length - 1 && x === ''));
    function textCmd(toks, input) {
      const cmd = toks[0], args = toks.slice(1), fl = args.filter((x) => /^-/.test(x)), rest = args.filter((x) => !/^-/.test(x));
      const has = (f) => fl.some((x) => x.replace(/^-+/, '').includes(f));
      const src = (files) => { if (files.length) { let o = []; for (const f of files) { const n = get(f); if (!n) return { err: `${cmd}: ${f}: No such file or directory` }; if (n.t === 'd') return { err: `${cmd}: ${f}: Is a directory` }; o = o.concat(fileLines(n)); } return { out: o }; } return input ? { out: input } : { err: `${cmd}: 入力がありません（ファイル名か、| の前の命令が要ります）` }; };
      const num = () => { const i = args.findIndex((x) => /^-n$/.test(x)); if (i >= 0 && /^\d+$/.test(args[i + 1] || '')) return +args[i + 1]; const m = args.find((x) => /^-\d+$/.test(x)); return m ? -+m : 10; };
      switch (cmd) {
        case 'cat': return src(rest);
        case 'echo': return { out: [rest.join(' ')] };
        case 'ls': { const d = rest[0] ? get(rest[0]) : nodeAt(cwd); if (!d || d.t !== 'd') return { err: `ls: ${rest[0] || ''}: No such file or directory` }; return { out: Object.keys(d.c).sort() }; }
        case 'grep': {
          const pat = rest[0]; if (pat === undefined) return { err: 'usage: grep [-i] [-n] [-v] [-c] pattern [file]' };
          const r = src(rest.slice(1)); if (r.err) return r;
          const rx = new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), has('i') ? 'i' : '');
          let hits = r.out.map((l, i) => [l, i + 1]).filter(([l]) => rx.test(l) !== has('v'));
          if (ran.length) ran[ran.length - 1].hits = hits.length;
          return has('c') ? { out: [String(hits.length)] } : { out: hits.map(([l, i]) => (has('n') ? i + ':' : '') + l) };
        }
        case 'head': case 'tail': { const r = src(rest.filter((x) => !/^\d+$/.test(x))); if (r.err) return r; const k = Math.abs(num()); return { out: cmd === 'head' ? r.out.slice(0, k) : r.out.slice(-k) }; }
        case 'wc': { const r = src(rest); if (r.err) return r; return { out: [has('l') ? String(r.out.length) + (rest[0] ? ' ' + rest[0] : '') : r.out.length + '  ' + r.out.join(' ').split(/\s+/).filter(Boolean).length + '  ' + r.out.join('\n').length] }; }
        case 'sort': { const r = src(rest); if (r.err) return r; let o = r.out.slice(); const key = (x) => (parseFloat(x.trim()) || 0); o.sort(has('n') ? (a, b) => key(a) - key(b) : (a, b) => (a < b ? -1 : a > b ? 1 : 0)); if (has('r')) o.reverse(); if (has('u')) o = o.filter((x, i) => i === 0 || x !== o[i - 1]); return { out: o }; }
        case 'uniq': { const r = src(rest); if (r.err) return r; const o = []; r.out.forEach((l) => { const last = o[o.length - 1]; if (last && last[0] === l) last[1]++; else o.push([l, 1]); }); return { out: o.map(([l, n]) => (has('c') ? String(n).padStart(4) + ' ' : '') + l) }; }
        case 'cut': {
          let d = '\t', f = 0; const files = [];
          for (let k = 0; k < args.length; k++) { const x = args[k]; if (x.startsWith('-d')) d = x.length > 2 ? x.slice(2) : (args[++k] || ''); else if (x.startsWith('-f')) f = parseInt(x.length > 2 ? x.slice(2) : args[++k], 10); else if (!x.startsWith('-')) files.push(x); }
          if (!f) return { err: 'usage: cut -d 区切り -f 番号' };
          const r = src(files); if (r.err) return r; return { out: r.out.map((l) => l.split(d)[f - 1] || '') };
        }
        default: return { err: `zsh: command not found: ${cmd}　（この練習場では、パイプで使えるのは cat grep head tail wc sort uniq cut など）` };
      }
    }
    function pipeline(line) {
      const segs = splitPipe(line);
      let redir = null; const lastM = segs[segs.length - 1].match(/^(.*?)(>>|>)\s*([^\s>]+)\s*$/);
      if (lastM) { redir = { app: lastM[2] === '>>', file: unq(lastM[3]) }; segs[segs.length - 1] = lastM[1].trim(); }
      const names = segs.map((x) => (x.split(/\s+/)[0] || ''));
      ran.push({ cmd: names[0], args: [], flags: '', line, pipe: segs.length > 1, segs: names, redir: !!redir });
      let data = null;
      for (const sg of segs) {
        const toks = (sg.match(/(?:[^\s"']|"[^"]*"|'[^']*')+/g) || []).map((x) => x.replace(/"([^"]*)"|'([^']*)'/g, '$1$2')); if (!toks.length) return err('パイプの先に命令がありません');
        const res = textCmd(toks, data); if (res.err) return err(res.err); data = res.out;
      }
      if (redir) { writeFile(redir.file, data.join('\n') + (data.length ? '\n' : ''), redir.app); return; }
      say(data.map(esc).join('\n') || '<span style="opacity:.65">（何も表示されない）</span>');
    }
    function openVim(path) {
      const { dir, name } = split(path);
      if (!dir || dir.t !== 'd' || !name) return err(`vim: ${path}: No such file or directory`);
      if (dir.c[name] && dir.c[name].t === 'd') return err(`vim: ${path} はフォルダです`);
      const text = dir.c[name] ? dir.c[name].v : '', lines0 = text ? text.replace(/\n$/, '').split('\n') : [''];
      const save = (vm) => { if (!dir.c[name]) fresh.add((dir.c[name] = { t: 'f', v: '' })); dir.c[name].v = vm.lines.join('\n') + '\n'; };
      const ov = h('div', { class: 'cg-vimov' }); let vm = null;
      const close = () => { curVim = null; ov.remove(); drawTree(); onChange && onChange(api); setTimeout(() => input.focus(), 0); };
      vm = makeVim((n) => {
        if (n === 'w') save(vm);
        else if (n === 'wq') { save(vm); st.vimLog.push({ file: path, saved: true, hist: vm.hist.slice(), lines: vm.lines }); close(); }
        else if (n === 'q' || n === 'q!') { st.vimLog.push({ file: path, saved: false, hist: vm.hist.slice(), lines: vm.lines }); close(); }
      }, { lines: lines0, file: path });
      ov.append(h('div', { class: 'cg-vimov-h' }, 'vim ' + path + '　（i で書く / Esc で戻る / :wq で保存して終了）'), vm.el);
      curVim = vm; el.append(ov); setTimeout(() => vm.el.focus(), 0);
    }
    const PKG = (n) => JSON.stringify({ name: n, version: '0.0.0', scripts: { dev: 'vite', build: 'vite build', test: 'vitest', lint: 'eslint .' }, dependencies: { vue: '^3.4.0' } }, null, 2) + '\n';
    function npm(cmd, args) {
      const dirNode = nodeAt(cwd), here = '~' + (cwd.length ? '/' + cwd.join('/') : '');
      const mk = (parent, nm, node) => { parent.c[nm] = node; fresh.add(node); return node; };
      if (cmd === 'npx') {
        const tool = args[0];
        if (tool === 'prettier') { st.prettier++; return say('index.html 12ms\nsrc/App.vue 31ms\nsrc/main.ts 5ms\n<span style="opacity:.65">（整形した）</span>'); }
        if (tool === 'eslint') { st.eslint++; return say('✔ 0 problems（エラーなし）'); }
        return say('npx: ' + esc(tool || '') + ' を実行（練習場では何も起きない）');
      }
      const sub = args[0];
      if (sub === 'create' || sub === 'init') {
        const nm = args.slice(2).find((x) => !/^-/.test(x)) || 'vue-project';
        if (dirNode.c[nm]) return err(`${nm} はもうあります`);
        const root = mk(dirNode, nm, { t: 'd', c: {} });
        mk(root, 'package.json', { t: 'f', v: PKG(nm) }); mk(root, 'index.html', { t: 'f', v: '<div id="app"></div>\n<script type="module" src="/src/main.ts"></script>\n' });
        const src = mk(root, 'src', { t: 'd', c: {} }); mk(src, 'main.ts', { t: 'f', v: "import { createApp } from 'vue'\nimport App from './App.vue'\ncreateApp(App).mount('#app')\n" }); mk(src, 'App.vue', { t: 'f', v: '<script setup lang="ts"></script>\n<template><h1>Hello Vue</h1></template>\n' });
        st.created.push(nm);
        return say(`Vue.js - The Progressive JavaScript Framework\n\n✔ Project name: … ${esc(nm)}\n✔ Add TypeScript? … Yes\n✔ Add Vue Router? … No\n\nScaffolding project in ${esc(here)}/${esc(nm)}...\n\nDone. Now run:\n\n  cd ${esc(nm)}\n  npm install\n  npm run dev`);
      }
      if (!dirNode.c['package.json']) return err(`npm error code ENOENT\nnpm error path ${here}/package.json\nnpm error enoent Could not read package.json（package.json があるフォルダ＝プロジェクトの中で実行する。cd を忘れていない？）`);
      if (['install', 'i', 'ci'].includes(sub)) {
        if (!dirNode.c.node_modules) mk(dirNode, 'node_modules', { t: 'd', c: { '.bin': { t: 'd', c: {} }, vue: { t: 'd', c: {} } } });
        st.installed.push(here); return say('added 52 packages, and audited 53 packages in 4s\n\nfound 0 vulnerabilities');
      }
      if (sub === 'run' || sub === 'test' || sub === 'start') {
        const script = sub === 'run' ? args[1] : sub === 'start' ? 'dev' : 'test';
        let pj = {}; try { pj = JSON.parse(dirNode.c['package.json'].v); } catch { /* ignore */ }
        if (!script) return say('Scripts available:\n  dev\n  build\n  test\n  lint');
        if (!pj.scripts || !pj.scripts[script]) return err(`npm error Missing script: "${esc(script)}"`);
        const nm = pj.name || 'app', head = `> ${nm}@0.0.0 ${script}\n> ${pj.scripts[script]}\n\n`;
        if (['dev', 'build'].includes(script) && !dirNode.c.node_modules) return err(head + 'sh: vite: command not found　（先に npm install で部品を入れる）');
        if (script === 'dev') { st.dev++; return say(head + '  VITE v5.4.0  ready in 312 ms\n\n  ➜  Local:   http://localhost:5173/\n  ➜  press h + enter to show help'); }
        if (script === 'build') { if (!dirNode.c.dist) { const d = mk(dirNode, 'dist', { t: 'd', c: {} }); mk(d, 'index.html', { t: 'f', v: '<!doctype html>\n' }); } st.built++; return say(head + 'vite v5.4.0 building for production...\n✓ 18 modules transformed.\ndist/index.html   0.43 kB\ndist/assets/index.js  68.20 kB\n✓ built in 1.20s'); }
        return say(head + '✓ 1 test passed');
      }
      return err('npm: ' + esc(sub || '') + ' は練習場では使えません（create / install / run dev / run build を使おう）');
    }
    const CMDS = ['pwd', 'ls', 'cd', 'mkdir', 'touch', 'cat', 'echo', 'rm', 'cp', 'mv', 'grep', 'head', 'tail', 'wc', 'sort', 'uniq', 'cut', 'clear', 'history', 'alias', 'vim', 'npm', 'git', 'ssh', 'ssh-keygen'];
    function typeTab(partial) { input.value = partial; complete(); const v = input.value.trim(); input.value = ''; run(v); }
    function complete() {
      const v = input.value, tok = (v.match(/(\S*)$/) || ['', ''])[1], first = !/\s/.test(v.trimStart());
      let cands;
      if (first) cands = CMDS.filter((c) => c.startsWith(tok));
      else {
        const i = tok.lastIndexOf('/'), dp = i >= 0 ? tok.slice(0, i + 1) : '', pre = tok.slice(i + 1), d = dp ? get(dp) : nodeAt(cwd);
        cands = d && d.t === 'd' ? Object.entries(d.c).filter(([k]) => k.startsWith(pre) && (pre || !k.startsWith('.'))).map(([k, n]) => dp + k + (n.t === 'd' ? '/' : '')) : [];
      }
      if (!cands.length) return;
      if (cands.length === 1) { input.value = v.slice(0, v.length - tok.length) + cands[0] + (/\/$/.test(cands[0]) ? '' : ' '); st.tabs++; return; }
      let cp = cands[0]; cands.forEach((c) => { while (!c.startsWith(cp)) cp = cp.slice(0, -1); });
      if (cp.length > tok.length) { input.value = v.slice(0, v.length - tok.length) + cp; st.tabs++; }
      say('<span style="opacity:.75">' + cands.map(esc).join('  ') + '</span>');
    }
    function exec(line) {
      const w0 = line.trim().split(/\s+/)[0];
      if (aliases[w0]) { const ex = aliases[w0] + line.trim().slice(w0.length), a0 = aliases[w0]; ran.push({ cmd: w0, args: [], flags: '', line, alias: true }); delete aliases[w0]; try { return exec(ex); } finally { aliases[w0] = a0; } }
      const fm = line.match(/^\s*for\s+(\w+)\s+in\s+(\S+)\s*;\s*do\s+(.+?)\s*;\s*done\s*$/);
      if (fm) { ran.push({ cmd: 'for', args: [fm[2]], flags: '', line }); const names = globNames(fm[2]); if (!names.length) return say('<span style="opacity:.65">（一致するファイルがない）</span>'); names.forEach((nm) => exec(fm[3].replace(new RegExp('\\$\\{?' + fm[1] + '\\}?', 'g'), nm))); return; }
      if (hasPipe(line) || /^\s*(sort|uniq|cut)\b/.test(line) || (/>/.test(line) && /^\s*(grep|cat|head|tail|wc|ls)\b/.test(line))) return pipeline(line);
      const raw = line.match(/"[^"]*"|'[^']*'|>>|>|[^\s>]+/g) || [];
      let redir = null, args = [];
      for (let i = 0; i < raw.length; i++) {
        if (raw[i] === '>' || raw[i] === '>>') { redir = { mode: raw[i], file: (raw[i + 1] || '').replace(/^["']|["']$/g, '') }; break; }
        args.push(raw[i].replace(/^["']|["']$/g, ''));
      }
      const cmd = args.shift();
      if (!cmd) return;
      const flags = args.filter((a) => /^-\w+/.test(a)).join('');
      const a = args.filter((x) => !/^-\w+/.test(x));
      ran.push({ cmd, args: a, flags, line });
      switch (cmd) {
        case 'pwd': return say('/Users/kenshu' + (cwd.length ? '/' + cwd.join('/') : ''));
        case 'ls': {
          const d = a[0] ? get(a[0]) : nodeAt(cwd);
          if (!d) return err(`ls: ${a[0]}: No such file or directory`);
          if (d.t === 'f') return say(esc(a[0]));
          const names = Object.entries(d.c).map(([k, v]) => (v.t === 'd' ? `<span class="dir">${esc(k)}</span>` : esc(k)));
          return say(flags.includes('l') ? Object.entries(d.c).map(([k, v]) => `${v.t === 'd' ? 'drwxr-xr-x' : '-rw-r--r--'}  ${v.t === 'd' ? '<span class="dir">' + esc(k) + '</span>' : esc(k) + '  (' + v.v.length + 'B)'}`).join('\n') || '(空)' : names.join('  ') || '(空)');
        }
        case 'cd': {
          if (!a[0]) { cwd = []; return; }
          const p = norm(a[0]), n = nodeAt(p);
          if (!n) return err(`cd: no such file or directory: ${a[0]}`);
          if (n.t !== 'd') return err(`cd: not a directory: ${a[0]}`);
          cwd = p; return;
        }
        case 'mkdir': {
          if (!a[0]) return err('usage: mkdir [-p] directory ...');
          for (const x of a) {
            if (flags.includes('p')) { let n = nodeAt(x.startsWith('/') ? [] : cwd); for (const part of x.split('/').filter(Boolean)) { if (n.c[part] === undefined) fresh.add((n.c[part] = { t: 'd', c: {} })); n = n.c[part]; if (n.t !== 'd') break; } continue; }
            const { dir, name } = split(x);
            if (!dir || dir.t !== 'd') return err(`mkdir: ${x.split('/')[0]}: No such file or directory`);
            if (dir.c[name]) { err(`mkdir: ${x}: File exists`); continue; }
            fresh.add((dir.c[name] = { t: 'd', c: {} }));
          }
          return;
        }
        case 'touch': {
          for (const x of a) { const { dir, name } = split(x); if (!dir || dir.t !== 'd') return err(`touch: ${x}: No such file or directory`); if (!dir.c[name]) fresh.add((dir.c[name] = { t: 'f', v: '' })); }
          return;
        }
        case 'cat': {
          if (!a[0]) return say('（本物は入力待ちになります。Ctrl+C で止める）', 'err');
          const n = get(a[0]);
          if (!n) return err(`cat: ${a[0]}: No such file or directory`);
          if (n.t === 'd') return err(`cat: ${a[0]}: Is a directory`);
          if (/\.pub$/.test(a[0])) { st.registered = 1; say(esc(n.v.replace(/\n$/, '')) + '\n<span style="opacity:.65">（本物では、この1行をコピーして GitHub の SSH 設定に貼り付ける。ここでは貼り付けたことにする）</span>'); return; }
          return say(esc(n.v.replace(/\n$/, '')) || '(空)');
        }
        case 'echo': {
          const text = args.join(' ');
          if (!redir) return say(esc(text));
          const { dir, name } = split(redir.file);
          if (!dir || dir.t !== 'd' || !name) return err('echo: 書き込み先が不正です');
          if (!dir.c[name]) fresh.add((dir.c[name] = { t: 'f', v: '' }));
          if (dir.c[name].t === 'd') return err('echo: ディレクトリには書けません');
          dir.c[name].v = (redir.mode === '>>' ? dir.c[name].v : '') + text + '\n';
          return;
        }
        case 'rm': {
          if (!a[0]) return err('usage: rm [-f | -i] [-dIPRrvWx] file ...');
          for (const x of a) {
            const { dir, name } = split(x);
            const n = dir && dir.c && dir.c[name];
            if (!n) { err(`rm: ${x}: No such file or directory`); continue; }
            if (n.t === 'd' && !flags.includes('r')) { err(`rm: ${x}: is a directory`); continue; }
            delete dir.c[name];
          }
          return;
        }
        case 'cp': case 'mv': {
          if (a.length < 2) return err(`usage: ${cmd} source target`);
          const s = get(a[0]); if (!s) return err(cmd === 'mv' ? `mv: rename ${a[0]} to ${a[1]}: No such file or directory` : `cp: ${a[0]}: No such file or directory`);
          if (cmd === 'cp' && s.t === 'd') return err(`cp: ${a[0]} is a directory (not copied).`);
          let { dir, name } = split(a[1]);
          const t = get(a[1]);
          if (t && t.t === 'd') { dir = t; name = norm(a[0]).pop(); }
          if (!dir || dir.t !== 'd') return err(`${cmd}: ${a[1]}: No such file or directory`);
          const copy = cmd === 'cp' ? { t: 'f', v: s.v } : s;
          if (cmd === 'mv') { const sp = split(a[0]); delete sp.dir.c[sp.name]; }
          dir.c[name] = copy; fresh.add(copy);
          if (cmd === 'mv' && !(t && t.t === 'd') && a[1] === cwd[cwd.length - 1]) say('<span style="opacity:.7">← 「' + esc(a[1]) + '」というフォルダは、いま居る場所の中には無い。だから移動ではなく<b>名前変更</b>になった（「' + esc(a[1]) + '」という名前のファイルができた）。フォルダへ移すなら <code>mv ' + esc(a[0]) + ' .</code>（. = いま居るフォルダ）</span>');
          return;
        }
        case 'grep': {
          if (a.length < 2) return err('usage: grep [-i] [-n] pattern file');
          const n = get(a[1]);
          if (!n) return err(`grep: ${a[1]}: No such file or directory`);
          if (n.t !== 'f') return err(`grep: ${a[1]}: Is a directory`);
          const ic = flags.includes('i'), rx = new RegExp(a[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), ic ? 'gi' : 'g');
          const hits = n.v.split('\n').map((l, i) => [l, i + 1]).filter(([l]) => l && (rx.lastIndex = 0, rx.test(l)));
          if (!hits.length) return say('<span style="opacity:.65">（何も表示されない ＝ 一致なし）</span>');
          ran[ran.length - 1].hits = hits.length;
          return say(hits.map(([l, i]) => (flags.includes('n') ? `<span class="dir">${i}</span>:` : '') + esc(l).replace(new RegExp(esc(a[0]).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), ic ? 'gi' : 'g'), (m) => `<mark>${m}</mark>`)).join('\n'));
        }
        case 'head': case 'tail': case 'wc': {
          const f = args.filter((x) => !/^-/.test(x) && !/^\d+$/.test(x))[0];
          if (!f) return err(`usage: ${cmd} [-n N] file`);
          const n = get(f);
          if (!n) return err(`${cmd}: ${f}: No such file or directory`);
          if (n.t === 'd') return err(`${cmd}: ${f}: Is a directory`);
          const ls = n.v.split('\n').filter((x, i, arr) => !(i === arr.length - 1 && x === ''));
          if (cmd === 'wc') return say(flags.includes('l') ? `${ls.length} ${esc(f)}` : `${ls.length}  ${n.v.split(/\s+/).filter(Boolean).length}  ${n.v.length} ${esc(f)}`);
          const m = line.match(/-n\s*(\d+)|\s-(\d+)/), k = m ? +(m[1] || m[2]) : 10;
          return say(esc((cmd === 'head' ? ls.slice(0, k) : ls.slice(-k)).join('\n')) || '(空)');
        }
        case 'alias': {
          if (!args.length) return say(Object.entries(aliases).map(([k, v]) => esc(k + "='" + v + "'")).join('\n') || '（alias はまだ無い）');
          const m = line.trim().match(/^alias\s+([\w.-]+)=(['"]?)(.*)\2$/); if (!m) return err("alias: 書き方は alias 名前='命令'");
          aliases[m[1]] = m[3]; return;
        }
        case 'vim': case 'vi': if (!a[0]) return err('usage: vim ファイル名'); return openVim(a[0]);
        case 'npm': case 'npx': return npm(cmd, args);
        case 'ssh-keygen': {
          let d = nodeAt(['.ssh']); if (!d) { d = { t: 'd', c: {} }; nodeAt([]).c['.ssh'] = d; fresh.add(d); }
          if (d.c.id_ed25519) return say('id_ed25519 already exists.（すでに鍵のペアがある）');
          d.c.id_ed25519 = { t: 'f', v: '-----BEGIN OPENSSH PRIVATE KEY-----\n（秘密鍵：絶対に人に見せない）\n-----END OPENSSH PRIVATE KEY-----\n' }; d.c['id_ed25519.pub'] = { t: 'f', v: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExample you@example.com\n' };
          fresh.add(d.c.id_ed25519); fresh.add(d.c['id_ed25519.pub']); st.keygen = 1;
          return say('Generating public/private ed25519 key pair.\nYour identification has been saved in ~/.ssh/id_ed25519\nYour public key has been saved in ~/.ssh/id_ed25519.pub');
        }
        case 'ssh': {
          if (!/-T/.test(flags) && !args.includes('-T')) return err('練習では ssh -T git@github.com だけ使えます（接続テスト）');
          const pub = get('.ssh/id_ed25519.pub');
          if (!pub) return err('git@github.com: Permission denied (publickey).　（鍵のペアがまだ無い → ssh-keygen）');
          if (!st.registered) return err('git@github.com: Permission denied (publickey).　（公開鍵を GitHub に登録していない。cat で公開鍵を表示して、GitHub の設定ページに貼り付ける）');
          st.ssh++; return say("Hi lamnv612! You've successfully authenticated, but GitHub does not provide shell access.");
        }
        case 'clear': out.replaceChildren(); return;
        case 'history': return say(hist.map((x, i) => `${i + 1}  ${esc(x)}`).join('\n'));
        case 'help': return say('pwd ls cd mkdir touch cat echo rm cp mv grep head tail wc clear history\n例: echo "hi" > a.txt / grep -i error logs/app.log');
        default:
          if (cmd === 'git' && opt && opt.git) { opt.git.run(args, (t) => { if (t) say(esc(t)); }, (t) => say(esc(t), 'err')); return; }
          return err(`zsh: command not found: ${cmd}`);
      }
    }
    function run(line) {
      say('<span class="cmd">' + esc(pr() + ' ') + '</span>' + esc(line));
      if (line.trim()) { hist.push(line); hi = hist.length; }
      try { exec(line); } catch (e) { err(String(e)); }
      refresh();
    }
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const v = input.value; input.value = ''; run(v); }
      else if (e.key === 'Tab') { e.preventDefault(); complete(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) input.value = hist[--hi]; }
      else if (e.key === 'ArrowDown') { e.preventDefault(); hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; }
    });
    const api = { el, tree, run, ran, hist, exists: (p) => get(p), cwd: () => cwd, input, say, st, aliases, vim: () => curVim, typeTab };
    say(opt && opt.git ? '練習用のリポジトリです。<span class="dir">git status</span> から始めよう。↑キーで履歴。' : 'ようこそ！ <span class="dir">help</span> でコマンド一覧。↑キーで履歴。');
    refresh();
    return api;
  }

style('cgk', `
          .cgk-wrap{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:6px}.cgk-g.full{grid-column:1/-1}.cgk-g.full .cgk-grid{grid-template-columns:repeat(var(--cols,5),minmax(0,1fr))}@media(max-width:900px){.cgk-wrap{grid-template-columns:1fr}.cgk-g.full .cgk-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
          .cgk-g{background:var(--card);border:1px solid color-mix(in srgb,var(--c) 35%,var(--line));border-radius:10px;padding:14px 14px 12px;position:relative}
          .cgk-g::before{content:"";position:absolute;left:14px;right:14px;top:0;height:3px;border-radius:0 0 4px 4px;background:var(--c)}
          .cgk-g h4{font-size:1rem;font-weight:900;display:flex;align-items:baseline;gap:.6em;margin-bottom:10px;color:var(--c)}
          .cgk-g h4 small{font:700 .68rem var(--mono);color:var(--mute);letter-spacing:.04em}
          .cgk-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
          .cgk{all:unset;box-sizing:border-box;position:relative;cursor:pointer;display:grid;gap:3px;padding:9px 10px 9px;border-radius:8px;background:var(--card2);border:1px solid var(--line);transition:transform .18s,border-color .18s,background .18s,box-shadow .18s}
          .cgk:hover{transform:translateY(-3px);border-color:var(--c);box-shadow:0 10px 22px -12px var(--c)}
          .cgk:active,.cgk.hit{transform:translateY(1px);background:color-mix(in srgb,var(--c) 24%,var(--card2));border-color:var(--c)}
          .cgk .kc{display:flex;gap:4px;align-items:center;min-height:30px}
          .cgk .kc i{font:800 1rem var(--mono);font-style:normal;min-width:28px;height:28px;padding:0 .5em;display:grid;place-items:center;border-radius:8px;background:var(--bg2);color:var(--text);border:1px solid var(--line);border-bottom-width:3px}
          .cgk .kc .ic{width:15px;height:15px;color:var(--c);margin-left:2px}
          .cgk .en{font:600 .75rem var(--mono);color:var(--mute);letter-spacing:.01em}
          .cgk .en b{color:var(--c);font-weight:900;font-size:.95em;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:2px}
          .cgk .jp{font-weight:800;font-size:.75rem;line-height:1.35}
          .cgk.dis{opacity:.45}
          .cgk-note{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:12px;padding:.7em 1em;border-radius:8px;background:color-mix(in srgb,var(--violet) 12%,transparent);border:1px dashed color-mix(in srgb,var(--violet) 40%,transparent);font-size:.875rem;font-weight:700}
          `);

  /* ============================================================
     よく使うコマンド一覧（カードをクリック → 解説 + その場で練習）
  ============================================================ */
  const TR = (() => {
    const R = (t) => t.ran;
    const has = (t, cmd, fn) => R(t).some((r) => r.cmd === cmd && (!fn || fn(r)));
    // cmd steps が、この順で実行されたか（間に別のコマンドが入ってもよい）
    const seq = (t, steps) => { let from = 0; for (const [cmd, fn] of steps) { const i = R(t).findIndex((r, k) => k >= from && r.cmd === cmd && (!fn || fn(r))); if (i < 0) return false; from = i + 1; } return true; };
    const here = (t) => t.cwd().join('/');
    const file = (t, p) => { const n = t.exists(p); return n && n.t === 'f' ? n : null; };
    const dir = (t, p) => { const n = t.exists(p); return n && n.t === 'd' ? n : null; };
    const lines = (n) => n.v.split('\n').filter(Boolean);
    const G = [
      { t: '場所を知る・動く', en: 'WHERE', c: TS, cmds: [
        { id: 'pwd', caps: ['pwd'], en: '<b>p</b>rint <b>w</b>orking <b>d</b>irectory', jp: '今いる場所を表示', tip: 'print working directory＝作業中のフォルダを表示',
          what: '「いま、どのフォルダにいるか」を表示します。迷子になったら、まずこれ。',
          rows: [['pwd', '今の場所（フルパス）を表示']],
          ms: [['pwd を実行する', (t) => has(t, 'pwd')], ['cd docs で移動してから、pwd で場所が変わったことを確かめる', (t) => seq(t, [['cd', (r) => r.args[0] === 'docs'], ['pwd']])]],
          ans: 'pwd\ncd docs\npwd' },
        { id: 'ls', caps: ['ls'], en: '<b>l</b>i<b>s</b>t', jp: 'フォルダの中身を見る', tip: 'list＝一覧。フォルダの中に何があるか表示',
          what: 'フォルダの中にあるファイルとフォルダを一覧にします。「何がある？」を知りたいときに使います。',
          rows: [['ls', '今のフォルダの中身'], ['ls docs', 'docs の中身（移動しないで見る）'], ['ls -l', '種類やサイズも付けて詳しく']],
          ms: [['ls で中身を見る', (t) => has(t, 'ls')], ['ls -l で、詳しい表示にする', (t) => has(t, 'ls', (r) => r.flags.includes('l'))]],
          ans: 'ls\nls -l' },
        { id: 'cd', caps: ['cd', 'docs'], en: '<b>c</b>hange <b>d</b>irectory', jp: 'フォルダへ移動', tip: 'change directory＝フォルダを変える（移動）',
          what: '別のフォルダへ移動します。移動したあとは、そのフォルダが「今いる場所」になります。',
          rows: [['cd docs', 'docs フォルダに入る'], ['cd docs/sub', '深いフォルダへ一気に']],
          ms: [['docs に入る', (t) => here(t) === 'docs'], ['docs の中で、cat memo.txt で中身を見る', (t) => seq(t, [['cd', (r) => r.args[0] === 'docs'], ['cat', (r) => /memo\.txt$/.test(r.args[0] || '')]])]],
          ans: 'cd docs\ncat memo.txt' },
        { id: 'cdup', caps: ['cd', '..'], en: '<b>..</b> = 1つ上のフォルダ', jp: '1つ上へ戻る', tip: '.. は「親フォルダ」を表す。cd だけならホームへ戻る',
          what: '<code>..</code> は「ひとつ上のフォルダ」。<code>cd ..</code> で戻れます。<code>cd</code> だけならホームへ一気に戻れます。',
          rows: [['cd ..', '1つ上へ'], ['cd', 'ホームへ戻る'], ['cd ../..', '2つ上へ']],
          ms: [['docs に入って、cd .. で戻る', (t) => seq(t, [['cd', (r) => r.args[0] === 'docs'], ['cd', (r) => r.args[0] === '..']]) && here(t) === ''], ['もう一度 docs に入り、cd（引数なし）でホームに戻る', (t) => { const i = R(t).map((r) => r.cmd + ' ' + (r.args[0] || '')).join('|'); return /cd docs.*\|cd ..*\|.*cd docs.*\|cd $/.test(i) || (R(t).filter((r) => r.cmd === 'cd' && r.args[0] === 'docs').length >= 2 && R(t)[R(t).length - 1].cmd === 'cd' && !R(t)[R(t).length - 1].args[0]); }]],
          ans: 'cd docs\ncd ..\ncd docs\ncd' },
      ] },
      { t: '作る', en: 'MAKE', c: PINK, cmds: [
        { id: 'mkdir', caps: ['mkdir', 'work'], en: '<b>m</b>a<b>k</b>e <b>dir</b>ectory', jp: 'フォルダを作る', tip: 'make directory＝フォルダを作る。-p で深い階層も一気に',
          what: '新しいフォルダを作ります。<code>-p</code> を付けると、途中のフォルダもまとめて作れます。',
          rows: [['mkdir work', 'work フォルダを作る'], ['mkdir -p a/b/c', 'a の中の b の中の c を一気に']],
          ms: [['work フォルダを作る', (t) => !!dir(t, 'work')], ['mkdir -p で a/b/c を一気に作る', (t) => !!dir(t, 'a/b/c')]],
          ans: 'mkdir work\nmkdir -p a/b/c' },
        { id: 'touch', caps: ['touch', 'a.txt'], en: '<b>touch</b>＝触る', jp: '空のファイルを作る', tip: 'touch＝触る。無ければ空のファイルができる',
          what: '空のファイルを作ります（すでにあれば何もしません）。新しいファイルの「箱」を用意するときに使います。',
          rows: [['touch a.txt', '空の a.txt を作る'], ['touch a.txt b.txt', '一度に2つ']],
          ms: [['memo2.txt を作る', (t) => !!file(t, 'memo2.txt')], ['work フォルダを作り、その中に a.txt を作る', (t) => !!file(t, 'work/a.txt')]],
          ans: 'touch memo2.txt\nmkdir work\ntouch work/a.txt' },
        { id: 'echo1', caps: ['echo', '>'], en: '<b>echo</b>＝言う / <b>&gt;</b> 上書き', jp: '文字をファイルに書く（上書き）', tip: 'echo＝そのまま表示。> を付けるとファイルへ。すでに中身があると上書き！',
          what: '<code>echo</code> は文字を表示するコマンド。<code>&gt;</code> を付けると、画面ではなくファイルへ書き込みます。<b>中身は上書き</b>されるので注意。',
          rows: [['echo "hello" &gt; hi.txt', 'hi.txt に hello を書く'], ['echo "bye" &gt; hi.txt', '同じファイルなら bye に上書き']],
          ms: [['hi.txt に hello を書く', (t) => !!file(t, 'hi.txt') && has(t, 'echo', (r) => /hello/.test(r.line) && r.line.includes('>'))], ['同じ hi.txt に別の文字を書いて、上書きされたことを cat で確かめる', (t) => { const f = file(t, 'hi.txt'); const w = (r) => r.cmd === 'echo' && r.line.includes('>') && !r.line.includes('>>'); return !!f && lines(f).length === 1 && !/hello/.test(f.v) && R(t).filter(w).length >= 2 && R(t).findLastIndex((r) => r.cmd === 'cat' && /hi\.txt/.test(r.args[0] || '')) > R(t).findLastIndex(w); }]],
          ans: 'echo "hello" > hi.txt\necho "bye" > hi.txt\ncat hi.txt' },
        { id: 'echo2', caps: ['echo', '>>'], en: '<b>&gt;&gt;</b> 追記', jp: '文字をファイルの末尾に足す', tip: '>> は追記。今ある中身は消えない',
          what: '<code>&gt;&gt;</code> を使うと、ファイルの<b>終わりに付け足せます</b>。ログやメモを増やしていくときに使います。',
          rows: [['echo "1行目" &gt; log.txt', 'まず書く'], ['echo "2行目" &gt;&gt; log.txt', '末尾に足す']],
          ms: [['log.txt に 1行目を書く', (t) => !!file(t, 'log.txt')], ['>> で2行目を足して、log.txt が2行になる', (t) => { const f = file(t, 'log.txt'); return !!f && lines(f).length >= 2 && has(t, 'echo', (r) => />>/.test(r.line)); }]],
          ans: 'echo "1行目" > log.txt\necho "2行目" >> log.txt\ncat log.txt' },
      ] },
      { t: '中身を見る・探す', en: 'VIEW', c: BASIC, cmds: [
        { id: 'cat', caps: ['cat', 'a.txt'], en: '<b>cat</b>enate', jp: 'ファイルの中身を表示', tip: 'concatenate＝つなげる。ファイルの中身をそのまま表示',
          what: 'ファイルの中身を、まるごと表示します。短いファイルを確認するときに便利。',
          rows: [['cat report.txt', 'report.txt の中身'], ['cat docs/memo.txt', 'cd しないで docs の中のファイルを見る']],
          ms: [['report.txt の中身を見る', (t) => has(t, 'cat', (r) => r.args[0] === 'report.txt')], ['cd せずに、docs の中の memo.txt を見る', (t) => t.cwd().length === 0 && has(t, 'cat', (r) => r.args[0] === 'docs/memo.txt')]],
          ans: 'cat report.txt\ncat docs/memo.txt' },
        { id: 'head', caps: ['head', '-n', '2'], en: '<b>head</b>＝頭', jp: '最初の数行だけ見る', tip: 'head＝頭。ファイルの最初の数行だけ表示（初期値は10行）',
          what: '数万行あるログでも、<b>最初の数行</b>だけを表示できます。<code>-n</code> で行数を指定。何のログか・いつ始まったかを確かめるときに。',
          rows: [['head logs/app.log', '最初の10行'], ['head -n 2 logs/app.log', '最初の2行だけ']],
          ms: [['head で logs/app.log の先頭を見る', (t) => has(t, 'head', (r) => /app\.log/.test(r.line))], ['-n 2 で、最初の2行だけにする', (t) => has(t, 'head', (r) => /-n\s*2|-2\b/.test(r.line) && /app\.log/.test(r.line))]],
          ans: 'head logs/app.log\nhead -n 2 logs/app.log' },
        { id: 'tail', caps: ['tail', '-n', '1'], en: '<b>tail</b>＝しっぽ', jp: '最後の数行だけ見る', tip: 'tail＝しっぽ。ファイルの最後の数行だけ表示。ログの最新部分を見るときの定番',
          what: 'ファイルの<b>最後の数行</b>を表示します。ログは下に追記されるので、<b>いま何が起きているか</b>を見るのに大活躍。',
          rows: [['tail logs/app.log', '最後の10行'], ['tail -n 1 logs/app.log', '最後の1行だけ（いちばん新しい）']],
          ms: [['tail で logs/app.log の最後を見る', (t) => has(t, 'tail', (r) => /app\.log/.test(r.line))], ['-n 1 で、最新の1行だけにする', (t) => has(t, 'tail', (r) => /-n\s*1|-1\b/.test(r.line) && /app\.log/.test(r.line))]],
          ans: 'tail logs/app.log\ntail -n 1 logs/app.log' },
        { id: 'wc', caps: ['wc', '-l'], en: '<b>w</b>ord <b>c</b>ount', jp: '行数を数える', tip: 'word count＝数える。-l を付けると「行数」',
          what: 'ファイルの行数・単語数などを数えます。<code>-l</code>（<b>l</b>ine）で行数だけ。「ログが何行あるか」「報告書が何行か」をすぐ確認できます。',
          rows: [['wc -l logs/app.log', 'ログの行数を数える']],
          ms: [['wc -l で logs/app.log の行数を数える', (t) => has(t, 'wc', (r) => r.flags.includes('l') && /app\.log/.test(r.line))], ['report.txt の行数も数える', (t) => has(t, 'wc', (r) => r.flags.includes('l') && /report\.txt/.test(r.line))]],
          ans: 'wc -l logs/app.log\nwc -l report.txt' },
        { id: 'grep', caps: ['grep', 'ERROR', 'f'], en: '<b>g</b>lobal <b>r</b>egular <b>e</b>xpression <b>p</b>rint', jp: '文字を探す', tip: 'ファイルの中から、その文字がある行だけを表示。ログからエラーを探すときの定番',
          what: '本番のログは<b>数万行</b>。目で探さず、<code>grep</code> で<b>エラーの行だけ</b>を取り出します。<code>-n</code> で行番号も出ます。',
          rows: [['grep ERROR logs/app.log', 'ERROR を含む行'], ['grep -n ERROR logs/app.log', '行番号つき']],
          ms: [['logs/app.log から ERROR を探す', (t) => has(t, 'grep', (r) => r.args[0] === 'ERROR' && /app\.log/.test(r.args[1] || ''))], ['-n を付けて、行番号つきで探す', (t) => has(t, 'grep', (r) => r.flags.includes('n') && /app\.log/.test(r.line) && r.hits)]],
          ans: 'grep ERROR logs/app.log\ngrep -n ERROR logs/app.log' },
        { id: 'grepi', caps: ['grep', '-i'], en: '<b>i</b>gnore case', jp: '大文字小文字を区別しない', tip: 'ignore case＝大文字小文字を無視。ERROR も error も Error もヒット',
          what: '<code>grep</code> はふつう大文字と小文字を区別します。ログには <code>ERROR</code> / <code>error</code> / <code>Error</code> が混ざることがあるので、<code>-i</code> で<b>取りこぼし</b>を防ぎます。',
          rows: [['grep ERROR logs/app.log', '1行だけヒット（大文字のみ）'], ['grep -i error logs/app.log', 'error・Error もヒット（3行）']],
          ms: [['grep だけで ERROR を探す（1行だけヒット）', (t) => has(t, 'grep', (r) => r.args[0] === 'ERROR' && !r.flags.includes('i') && r.hits === 1)], ['-i で、error・Error も一緒に見つける（3行）', (t) => has(t, 'grep', (r) => r.flags.includes('i') && r.hits === 3)]],
          ans: 'grep ERROR logs/app.log\ngrep -i error logs/app.log' },
        { id: 'cp', caps: ['cp', 'a', 'b'], en: '<b>c</b>o<b>p</b>y', jp: 'コピーする', tip: 'copy＝コピー。元のファイルは残る',
          what: 'ファイルをコピーします。<b>元のファイルは残ります</b>。',
          rows: [['cp report.txt copy.txt', '別名でコピー'], ['cp report.txt docs', 'docs フォルダへコピー']],
          ms: [['report.txt を copy.txt という名前でコピーする', (t) => !!file(t, 'report.txt') && !!file(t, 'copy.txt')], ['report.txt を docs フォルダにもコピーする', (t) => !!file(t, 'report.txt') && !!file(t, 'docs/report.txt')]],
          ans: 'cp report.txt copy.txt\ncp report.txt docs' },
        { id: 'mv', caps: ['mv', 'a', 'dir'], en: '<b>m</b>o<b>v</b>e', jp: '移動する', tip: 'move＝移動。元の場所からは無くなる',
          what: 'ファイルを別のフォルダへ<b>移動</b>します。元の場所からは無くなります。',
          rows: [['mv report.txt docs', 'docs フォルダへ移動']],
          ms: [['report.txt を docs へ移動する', (t) => has(t, 'mv', (r) => r.args[0] === 'report.txt' && r.args[1] === 'docs')], ['work フォルダを作り、docs/report.txt を work へ移動する', (t) => !!dir(t, 'work') && !file(t, 'docs/report.txt') && !!file(t, 'work/report.txt')]],
          ans: 'mv report.txt docs\nmkdir work\nmv docs/report.txt work' },
        { id: 'mvrename', caps: ['mv', 'old', 'new'], en: '<b>m</b>o<b>v</b>e（名前の変更）', jp: '名前を変える', tip: '同じフォルダ内で mv すると「名前の変更」になる',
          what: '<code>mv</code> は、同じフォルダの中で使うと<b>名前の変更</b>になります。専用のコマンドは無く、mv がその役目も持っています。',
          rows: [['mv report.txt note.txt', 'report.txt → note.txt']],
          ms: [['report.txt を note.txt に名前変更する', (t) => !file(t, 'report.txt') && !!file(t, 'note.txt')], ['docs/memo.txt を docs/memo-old.txt に名前変更する', (t) => !file(t, 'docs/memo.txt') && !!file(t, 'docs/memo-old.txt')]],
          ans: 'mv report.txt note.txt\nmv docs/memo.txt docs/memo-old.txt' },
        { id: 'rm', caps: ['rm', 'a.txt'], en: '<b>r</b>e<b>m</b>ove', jp: 'ファイルを消す', tip: 'remove＝削除。ゴミ箱は無く、元に戻せない！',
          what: 'ファイルを<b>完全に消します</b>。ゴミ箱は無いので、元に戻せません。打つ前に、もう一度名前を確認しよう。',
          rows: [['rm tmp.txt', 'tmp.txt を消す']],
          ms: [['tmp.txt を作ってから、rm で消す', (t) => seq(t, [['touch', (r) => r.args.includes('tmp.txt')], ['rm', (r) => r.args.includes('tmp.txt')]]) && !file(t, 'tmp.txt')], ['report.txt を消す', (t) => !file(t, 'report.txt') && has(t, 'rm', (r) => r.args.includes('report.txt'))]],
          ans: 'touch tmp.txt\nrm tmp.txt\nrm report.txt' },
        { id: 'rmr', caps: ['rm', '-r', 'dir'], en: '<b>r</b>ecursive', jp: 'フォルダごと消す', tip: 'recursive＝再帰的。中身ごと全部消す。慎重に！',
          what: 'フォルダは <code>rm</code> だけでは消せません。<code>-r</code>（<b>r</b>ecursive＝中まで全部）を付けると、<b>中身ごと</b>消えます。',
          rows: [['rm work', 'フォルダだとエラー'], ['rm -r work', 'フォルダを中身ごと消す']],
          ms: [['mkdir work して、rm work でエラーを体験する', (t) => seq(t, [['mkdir', (r) => r.args.includes('work')], ['rm', (r) => r.args.includes('work') && !r.flags.includes('r')]])], ['rm -r work で、フォルダごと消す', (t) => seq(t, [['mkdir', (r) => r.args.includes('work')], ['rm', (r) => r.args.includes('work') && r.flags.includes('r')]]) && !dir(t, 'work')]],
          ans: 'mkdir work\nrm work\nrm -r work' },
      ] },
      { t: '便利なもの', en: 'TIPS', c: VIO, cmds: [
        { id: 'clear', caps: ['clear'], en: '<b>clear</b>＝きれいにする', jp: '画面をきれいにする', tip: 'clear＝画面の文字を消す（ファイルは消えない）。Ctrl+L でも同じ',
          what: '画面に溜まった文字を消して、すっきりさせます。ファイルや履歴は消えません。',
          rows: [['clear', '画面をクリア'], ['Ctrl + L', 'キーボードでも同じ']],
          ms: [['clear を実行する', (t) => has(t, 'clear')], ['ls のあとで clear して、画面をきれいにする', (t) => seq(t, [['ls'], ['clear']])]],
          ans: 'ls\nclear' },
        { id: 'history', caps: ['history'], en: '<b>history</b>＝履歴', jp: '今までのコマンドを見る', tip: 'history＝履歴。今までに打ったコマンドの一覧',
          what: '今まで打ったコマンドの一覧を出します。長いコマンドを思い出すときに便利です。',
          rows: [['history', '履歴の一覧'], ['↑ キー', '1つ前のコマンドを呼び出す']],
          ms: [['pwd・ls・cd docs を実行する', (t) => seq(t, [['pwd'], ['ls'], ['cd', (r) => r.args[0] === 'docs']])], ['history で履歴を見る', (t) => has(t, 'history')]],
          ans: 'pwd\nls\ncd docs\nhistory' },
        { id: 'up', caps: ['↑'], en: '<b>↑</b> 履歴キー', jp: '前のコマンドを呼び出す', tip: '↑ で1つ前、↓ で次。長いコマンドを打ち直さずに済む',
          what: '入力欄で <kbd>↑</kbd> を押すと、<b>前に打ったコマンド</b>が出てきます。打ち直しが要らなくて、タイプミスも減ります。',
          rows: [['↑', '1つ前のコマンド'], ['↓', '1つ後のコマンド'], ['Tab', '（本物のターミナルで）名前の続きを補完']],
          ms: [['ls を実行する', (t) => has(t, 'ls')], ['入力欄で ↑ を押して ls をもう一度実行する（連続で ls が2回）', (t) => t.hist.some((x, i) => i > 0 && x.trim() === 'ls' && t.hist[i - 1].trim() === 'ls')]],
          ans: 'ls\n（↑ を押して Enter）' },
      ] },
    ];

    function openRef(c, g) {
      let ready = false;
      const term = makeTerm(() => { if (ready) update(); });
      const wrap = h('div', { class: 'cgr' });
      const head = h('div', { class: 'cgr-top', style: { '--c': g.c } },
        h('span', { class: 'kc' }, c.caps.map((k) => h('i', k))), h('div', null, h('div', { class: 'en', html: c.en }), h('div', { class: 'jp' }, c.jp)));
      const usage = h('table', { class: 'vref' }, h('thead', null, h('tr', null, h('th', '書き方'), h('th', 'やること'))),
        h('tbody', null, c.rows.map(([a, b]) => h('tr', null, h('td', null, h('code', { html: a })), h('td', b)))));
      const box = h('div', { class: 'tasks' });
      let fired = false;
      const ans = h('pre', { class: 'cgr-ans', style: { display: 'none' } }, c.ans);
      const hint = h('button', { class: 'btn ghost', onclick: () => { const on = ans.style.display === 'none'; ans.style.display = on ? '' : 'none'; hint.lastChild.textContent = on ? '答えをかくす' : '答えを見る'; } }, icon('key-round'), h('span', '答えを見る'));
      function update() {
        const res = c.ms.map(([l, f], i) => { let ok = false; try { ok = !!f(term); } catch { ok = false; } return { l, ok, lv: i + 1 }; });
        const n = res.filter((r) => r.ok).length;
        box.replaceChildren(h('div', { class: 'mission-head' }, icon('list-checks'), h('b', 'ミッション'), h('span', { class: 'mission-n' }, n + ' / ' + res.length),
          h('i', { class: 'mission-bar' }, h('u', { style: { width: (n / res.length) * 100 + '%' } }))),
        ...res.map((r) => h('div', { class: 'task' + (r.ok ? ' ok' : '') }, h('i', r.ok ? '✓' : ''), h('span', { class: 'task-l' }, r.l))));
        if (n === res.length && !fired) { fired = true; celebrate(); }
      }
      ready = true; update();
      wrap.append(head, h('p', { class: 'cgr-what', html: c.what }), usage,
        h('div', { style: { marginTop: '4px' } }, lbl('その場で練習（右のフォルダ木も一緒に変わる）')),
        h('div', { class: 'split' }, term.el, h('div', { class: 'col' }, term.tree)),
        box, h('div', { class: 'row', style: { marginTop: '8px' } }, hint), ans);
      K.W.modal({ title: c.caps.join(' ') + ' ・ ' + c.jp, icon: 'terminal', wide: true, content: wrap });
      setTimeout(() => term.input.focus(), 250);
    }

    function view() {
      const A = h('div', { class: 'cgk-wrap' }, G.map((g) => h('section', { class: 'cgk-g full', style: { '--c': g.c, '--cols': 4 } },
        h('h4', g.t, h('small', g.en)),
        h('div', { class: 'cgk-grid' }, g.cmds.map((c) => h('button', { class: 'cgk', 'data-tip': c.tip, onclick: () => openRef(c, g) },
          h('span', { class: 'kc' }, c.caps.map((k) => h('i', k))), h('span', { class: 'en', html: c.en }), h('span', { class: 'jp' }, c.jp)))))));
      return A;
    }
    return { view, G };
  })();

  function chipRow(term, cmds) {
    const TIPS = { pwd: 'print working directory＝今いる場所（絶対パス）を表示', ls: 'list＝フォルダの中身を一覧表示', 'cd docs': 'change directory＝docs フォルダへ移動', 'cat memo.txt': 'concatenate＝ファイルの中身を表示', 'cd ..': '.. は「1つ上のフォルダ」', 'mkdir work': 'make directory＝フォルダを作る', 'touch work/a.txt': 'touch＝空のファイルを作る（触って更新日時を変える）', 'echo \"hello\" > work/a.txt': 'echo＝文字を出力。> でファイルに上書き保存', 'cat work/a.txt': 'さっき書いた内容を確認', 'grep -i error logs/app.log': 'grep＝検索。-i は ignore case（大文字小文字を区別しない）', 'mv report.txt work': 'move＝移動（名前変更にも使う）', 'rm -r work': 'remove -r(recursive)＝フォルダごと削除。戻せないので注意！' };
    return h('div', { class: 'row' }, cmds.map((c) => h('button', { class: 'cg-chip', 'data-tip': TIPS[c] || null, onclick: () => term.run(c) }, c)));
  }

  /* ============================================================
     Vim engine
  ============================================================ */
  function makeVim(onEvent, init) {
    const FN = (init && init.file) || 'practice.md';
    let L = init && init.lines ? init.lines.slice() : ['# app.conf（本番サーバーの設定）', 'port = 8080', 'debug = true   # 本番では false にしたい'];
    const hist = [];
    let r = 0, c = 0, mode = 'NORMAL', cmd = '', msg = 'クリックしてキーを押そう', reg = null, pend = '', dirty = false;
    const body = h('div', { class: 'bd' });
    const st = h('div', { class: 'st' });
    const el = h('div', { class: 'cg-vim', tabindex: '0' }, body, st, h('div', { class: 'ov' }, '👆 クリックして操作開始（キーボード入力）'));
    const ev = (n, from, to) => { hist.push(n); onEvent && onEvent(n, from, to); };
    const maxc = () => Math.max(0, L[r].length - (mode === 'INSERT' ? 0 : 1));
    function draw() {
      el.classList.toggle('ins', mode === 'INSERT'); el.classList.toggle('cmd', mode === 'COMMAND');
      body.replaceChildren(...L.map((l, i) => {
        const line = h('div', { class: 'vl' + (i === r ? ' cr' : '') }, h('b', i + 1));
        if (i !== r) { line.append(l || ' '); return line; }
        line.append(l.slice(0, c), h('span', { class: 'cur' }, l[c] || ' '), l.slice(c + 1));
        return line;
      }));
      st.replaceChildren(h('span', { class: 'md' }, mode === 'INSERT' ? '-- INSERT --' : mode === 'COMMAND' ? 'COMMAND' : 'NORMAL'), mode === 'COMMAND' ? h('span', ':' + cmd) : h('span', { style: { opacity: .8 } }, msg), h('span', { style: { marginLeft: 'auto', opacity: .6 } }, `${r + 1}:${c + 1}`));
    }
    const to = (m, name) => { const f = mode; mode = m; ev(name, f, m); };
    function wordFwd() { const s = L[r]; let i = c; while (i < s.length && /\S/.test(s[i])) i++; while (i < s.length && /\s/.test(s[i])) i++; if (i >= s.length) { if (r < L.length - 1) { r++; c = 0; } else c = Math.max(0, s.length - 1); } else c = i; }
    function wordBack() { const s = L[r]; let i = c - 1; while (i > 0 && /\s/.test(s[i])) i--; while (i > 0 && /\S/.test(s[i - 1])) i--; if (c === 0 && r > 0) { r--; c = 0; } else c = Math.max(0, i); }
    function key(k) {
      msg = '';
      if (mode === 'INSERT') {
        if (k === 'Escape') { to('NORMAL', 'Esc'); c = Math.max(0, c - 1); }
        else if (k === 'Enter') { const s = L[r]; L.splice(r, 1, s.slice(0, c), s.slice(c)); r++; c = 0; dirty = true; }
        else if (k === 'Backspace') { if (c > 0) { L[r] = L[r].slice(0, c - 1) + L[r].slice(c); c--; dirty = true; } else if (r > 0) { c = L[r - 1].length; L[r - 1] += L[r]; L.splice(r, 1); r--; dirty = true; } }
        else if (k.length === 1) { L[r] = L[r].slice(0, c) + k + L[r].slice(c); c++; dirty = true; ev('type'); }
        else if (k === 'ArrowLeft') c = Math.max(0, c - 1); else if (k === 'ArrowRight') c = Math.min(L[r].length, c + 1);
      } else if (mode === 'COMMAND') {
        if (k === 'Escape') { cmd = ''; to('NORMAL', 'Esc'); }
        else if (k === 'Enter') {
          const x = cmd.trim(); cmd = ''; to('NORMAL', 'Enter');
          if (x === 'w') { msg = '"' + FN + '" を保存しました'; dirty = false; ev('w'); }
          else if (x === 'wq' || x === 'x') { msg = '保存して終了！ (シミュレータなので続けて遊べます)'; dirty = false; ev('wq'); }
          else if (x === 'q') { if (dirty) msg = 'E37: 最後の変更が保存されていません（:q! で破棄して終了／:wq で保存して終了）'; else { msg = '終了（変更なし）'; ev('q'); } }
          else if (x === 'q!') { msg = '保存せず強制終了（変更は捨てられた）'; dirty = false; ev('q!'); }
          else msg = 'E492: 知らないコマンド: ' + x;
        } else if (k === 'Backspace') { if (cmd) cmd = cmd.slice(0, -1); else to('NORMAL', 'Esc'); }
        else if (k.length === 1) cmd += k;
      } else {
        if (pend) {
          const p = pend; pend = '';
          if (p === 'd' && k === 'd') { reg = L[r]; L.splice(r, 1); if (!L.length) L = ['']; r = Math.min(r, L.length - 1); c = Math.min(c, maxc()); dirty = true; ev('dd'); draw(); return; }
          if (p === 'y' && k === 'y') { reg = L[r]; msg = '1行ヤンク（コピー）'; ev('yy'); draw(); return; }
          if (p === 'g' && k === 'g') { r = 0; c = 0; ev('gg'); draw(); return; }
        }
        if (k === 'd' || k === 'y' || k === 'g') { pend = k; msg = k + '…'; }
        else if (k === 'i') { to('INSERT', 'i'); }
        else if (k === 'a') { c = Math.min(L[r].length, c + 1); to('INSERT', 'i'); }
        else if (k === 'o') { L.splice(r + 1, 0, ''); r++; c = 0; dirty = true; to('INSERT', 'i'); ev('o'); }
        else if (k === ':') { cmd = ''; to('COMMAND', 'colon'); }
        else if (k === 'h' || k === 'ArrowLeft') { c = Math.max(0, c - 1); ev('h'); }
        else if (k === 'l' || k === 'ArrowRight') { c = Math.min(maxc(), c + 1); ev('l'); }
        else if (k === 'j' || k === 'ArrowDown') { r = Math.min(L.length - 1, r + 1); c = Math.min(c, maxc()); ev('j'); }
        else if (k === 'k' || k === 'ArrowUp') { r = Math.max(0, r - 1); c = Math.min(c, maxc()); ev('k'); }
        else if (k === 'w') { wordFwd(); ev('w-move'); } else if (k === 'b') { wordBack(); ev('b'); }
        else if (k === '0') { c = 0; ev('0'); } else if (k === '$') { c = maxc(); ev('$'); }
        else if (k === 'G') { r = L.length - 1; c = Math.min(c, maxc()); ev('G'); }
        else if (k === 'x') { if (L[r].length) dirty = true; L[r] = L[r].slice(0, c) + L[r].slice(c + 1); c = Math.min(c, maxc()); ev('x'); }
        else if (k === 'p') { if (reg != null) { L.splice(r + 1, 0, reg); r++; c = 0; dirty = true; ev('p'); } else msg = 'レジスタが空（dd か yy を先に）'; }
        else if (k === 'Escape') { pend = ''; }
      }
      draw();
    }
    el.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length === 1 || ['Escape', 'Enter', 'Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) { e.preventDefault(); e.stopPropagation(); key(e.key); }
    });
    draw();
    return { el, key, hist, flash() { el.classList.remove('fl'); void el.offsetWidth; el.classList.add('fl'); setTimeout(() => el.classList.remove('fl'), 700); }, get lines() { return L.slice(); }, get dirty() { return dirty; }, get cursor() { return [r, c]; }, get mode() { return mode; }, feed(seq) { el.focus(); if (seq === 'Esc') return key('Escape'); if (seq[0] === ':' && seq.length > 1) { seq.split('').forEach(key); return key('Enter'); } seq.split('').forEach(key); } };
  }

  /* ---------- cuivim lesson ---------- */
  K.reg({
    id: 'cuivim', track: 'basic', title: 'CUI・Vim', sub: 'ターミナルとエディタ', emoji: '⌨️',
    scenes: [
      {
        t: 'ターミナルを触ってみよう', tag: 'CUI', lead: '文字だけでサーバーを操作するのが <b>CUI</b>。たとえば<b>ログから ERROR の行だけ</b>を探す。下のコマンドを<b>クリック</b>、または自分で入力。右の<b>フォルダ木</b>が一緒に変わるよ。',
        render(el) {
          const term = makeTerm();
          const stage = h('div', { class: 'pin-stage' }, K.W.pinOutput(h('div', { class: 'split' }, term.el, h('div', { class: 'col' }, lbl('フォルダの様子（リアルタイム）'), term.tree)), { label: 'ターミナルとフォルダ（ここに固定。下のコマンドを押すと、ここが変わる）', height: 220, mobileHeight: 150 }));
          stage.append(h('div', { style: { marginTop: '14px' } }, lbl('これを押してみよう'), chipRow(term, ['pwd', 'ls', 'cd docs', 'cat memo.txt', 'cd ..', 'mkdir work', 'touch work/a.txt', 'echo "hello" > work/a.txt', 'cat work/a.txt', 'grep -i error logs/app.log', 'mv report.txt work', 'rm -r work'])));
          stage.append(h('div', { style: { marginTop: '18px' } }, lbl('よく使うコマンド — クリックで解説と練習 / カーソルを乗せると由来を解説'), TR.view()));
          stage.append(h('p', { class: 'lead', style: { marginTop: '12px' }, html: '💡 <code class="i">&gt;</code> は「上書き」、<code class="i">&gt;&gt;</code> は「追記」。<code class="i">cd ..</code> は 1つ上へ。' }));
          el.append(stage);
        },
      },
      {
        t: 'Vim：3つのモード', tag: 'Vim', lead: '本番サーバーの設定ファイルを直したい。画面もマウスも無いので <b>Vim</b>。モードで動きが変わるエディタ。右の図で「3つの部屋」を確認 → 左のエディタで <code>debug = true</code> を <code>false</code> に直してみよう。',
        render(el) {

          const modes = { NORMAL: ['NORMAL', 'ノーマル', TS], INSERT: ['INSERT', 'インサート', BASIC], COMMAND: ['COMMAND', 'コマンド', TEAM] };
          const NS = 'http://www.w3.org/2000/svg';
          const svg = h('div', { class: 'cg-fsm' });
          svg.innerHTML = `<svg viewBox="0 0 420 220" width="100%"><defs><marker id="cga" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#9aa3c7" stroke="none"/></marker></defs>
          <path id="e-ni" d="M140 94 Q200 40 280 34" marker-end="url(#cga)"/><path id="e-in" d="M280 52 Q220 92 140 104" marker-end="url(#cga)"/>
          <path id="e-nc" d="M140 120 Q215 176 280 168" marker-end="url(#cga)"/><path id="e-cn" d="M280 190 Q200 150 140 128" marker-end="url(#cga)"/>
          <text class="lb" x="200" y="38">i · a · o</text><text class="lb" x="232" y="100">Esc</text><text class="lb" x="204" y="176">:</text><text class="lb" x="196" y="154">Enter</text>
          <g class="nd" id="n-NORMAL" style="--c:var(--ts)"><rect x="20" y="88" width="120" height="44" rx="6"/><text x="80" y="115">NORMAL</text></g>
          <g class="nd" id="n-INSERT" style="--c:var(--basic)"><rect x="280" y="14" width="120" height="44" rx="6"/><text x="340" y="41">INSERT</text></g>
          <g class="nd" id="n-COMMAND" style="--c:var(--team)"><rect x="280" y="162" width="120" height="44" rx="6"/><text x="340" y="189">COMMAND</text></g></svg>`;
          const q = (id) => svg.querySelector('#' + id);
          const lit = (m) => Object.keys(modes).forEach((k) => q('n-' + k).classList.toggle('on', k === m));
          let eTimer;
          const flash = (id) => { const p = q(id); p.classList.add('on'); clearTimeout(eTimer); eTimer = setTimeout(() => p.classList.remove('on'), 900); };
          const done = { i: false, type: false, Esc: false, wq: false, dd: false, p: false };
          const tb = taskBox(); const stt = {};
          const draw = () => drawTasks(tb, [
            { label: 'i を押して INSERT モードに入り、何か文字を打つ', ok: done.i && done.type, hint: ['エディタをクリックして、まず <kbd>i</kbd> を押そう。表示が INSERT に変わる。', 'そのあと、好きな文字を打つ。'], answer: { code: 'i\n（好きな文字を打つ）', lang: 'text' } }, { label: 'Esc で NORMAL（ふつうの状態）に戻る', ok: done.Esc, hint: ['INSERT から戻るキーは <kbd>Esc</kbd>。'], answer: { code: 'Esc', lang: 'text' } }, { label: ':wq と Enter で保存して終了', ok: done.wq, hint: ['まず <kbd>:</kbd> を打つと、下にコマンドを書く欄が出る。', '<code>wq</code> と打って <kbd>Enter</kbd>。（w=保存、q=終了）'], answer: { code: ':wq  と Enter', lang: 'text' } }, { optional: true, label: 'dd で1行を消して、p で貼り付ける（カット＆ペースト）', ok: done.dd && done.p, hint: ['まず Esc でノーマルモードにして、<kbd>d</kbd> を2回（<kbd>dd</kbd>）。', 'そのあと <kbd>j</kbd> で下に動いて <kbd>p</kbd>。消した行が貼り付く。'], answer: { code: 'Esc\ndd\nj\np', lang: 'text' } }], stt);
          const cards = {};
          const hit = (id) => { const b = cards[id]; if (!b) return; b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 380); };
          const vim = makeVim((n, f, t) => {
            if (n === 'i') { done.i = true; flash('e-ni'); } else if (n === 'Esc') { if (f === 'INSERT') { flash('e-in'); done.Esc = done.Esc || done.i; } else flash('e-cn'); }
            else if (n === 'colon') flash('e-nc'); else if (n === 'Enter') flash('e-cn');
            else if (n === 'type') done.type = true; else if (n === 'wq') done.wq = true; else if (n === 'dd') done.dd = true; else if (n === 'p' && done.dd) done.p = true;
            lit(t || vim.mode);
            hit({ 'w-move': 'w', w: ':w', q: ':q', 'q!': ':q!' }[n] || n);
            draw();
          });
          vim.el.addEventListener('keydown', (e) => hit(e.key === 'Escape' ? 'Esc' : e.key));
          lit('NORMAL'); draw();

          // ---- key reference: [caps, english(mnemonic, <b> = the letters you type), jp, tip, feed, needsNormal]
          const A = (n) => h('span', { class: 'ar' }, icon(n));
          const G = [
            { t: 'モードを切り替える', en: 'MODE', c: TS, keys: [
              { id: 'i', caps: ['i'], en: '<b>i</b>nsert', jp: '挿入モードへ', tip: 'insert＝差し込む。カーソルの「前」から入力できる', feed: 'i' },
              { id: 'a', caps: ['a'], en: '<b>a</b>ppend', jp: 'カーソルの後ろから入力', tip: 'append＝付け足す。カーソルの「後ろ」から入力できる', feed: 'a' },
              { id: 'o', caps: ['o'], en: '<b>o</b>pen a line', jp: '下に新しい行を作る', tip: 'open＝開く。下に空の行を開いて、そのまま入力', feed: 'o' },
              { id: 'Esc', caps: ['Esc'], en: '<b>Esc</b>ape', jp: 'ノーマルに戻る', tip: 'escape＝脱出。迷ったらとにかく Esc を連打！', feed: 'Esc', always: 1 },
            ] },
            { t: '編集する（ノーマルモードで）', en: 'EDIT', c: PINK, keys: [
              { id: 'x', caps: ['x'], en: '<b>x</b> = ×で消す', jp: '1文字削除', tip: '×印で消すイメージ。カーソル位置の1文字を消す', feed: 'x' },
              { id: 'dd', caps: ['d', 'd'], en: '<b>d</b>elete (行ごと)', jp: '1行削除', tip: 'delete＝削除。d を2回で「この行」。消した行は p で貼り付けられる（カット）', feed: 'dd' },
              { id: 'yy', caps: ['y', 'y'], en: '<b>y</b>ank (ぐいっと引く)', jp: '1行コピー', tip: 'yank＝ぐいっと引っ張る＝コピー。y を2回で「この行」', feed: 'yy' },
              { id: 'p', caps: ['p'], en: '<b>p</b>aste', jp: '下に貼り付け', tip: 'paste＝貼り付け。dd / yy した行がカーソルの下に入る', feed: 'p' },
            ] },
            { t: 'カーソルを動かす', en: 'MOVE', c: BASIC, full: 5, keys: [
              { id: 'h', caps: ['h', 'icon:arrow-left'], en: '<b>h</b> = 4つの左端', jp: '← 左へ', tip: 'h j k l は右手のホームポジションに並ぶ。h はその左端で、左へ1文字', feed: 'h' },
              { id: 'j', caps: ['j', 'icon:arrow-down'], en: '<b>j</b> = 下へ曲がる字', jp: '↓ 下へ', tip: 'j の字は下に曲がっている → 下へ1行', feed: 'j' },
              { id: 'k', caps: ['k', 'icon:arrow-up'], en: '<b>k</b> = j の反対', jp: '↑ 上へ', tip: 'j の隣のキー。j が下なので k は上へ1行', feed: 'k' },
              { id: 'l', caps: ['l', 'icon:arrow-right'], en: '<b>l</b> = 4つの右端', jp: '→ 右へ', tip: 'h j k l の右端で、右へ1文字。l は Left ではなく「右」なので注意', feed: 'l' },
              { id: 'w', caps: ['w'], en: '<b>w</b>ord', jp: '次の単語の先頭へ', tip: 'word＝単語。1単語ずつ進める', feed: 'w' },
              { id: 'b', caps: ['b'], en: '<b>b</b>ack', jp: '前の単語の先頭へ', tip: 'back＝戻る。w の逆方向', feed: 'b' },
              { id: '0', caps: ['0'], en: '<b>0</b> = ゼロ番目', jp: '行頭へ', tip: '0 文字目＝行のいちばん最初', feed: '0' },
              { id: '$', caps: ['$'], en: '<b>$</b> = 末尾 (正規表現と同じ)', jp: '行末へ', tip: '$ は「終わり」を表す記号。正規表現でも同じ意味', feed: '$' },
              { id: 'gg', caps: ['g', 'g'], en: '<b>g</b>o to top', jp: 'ファイルの先頭へ', tip: 'go＝行く。g を2回で1行目へ', feed: 'gg' },
              { id: 'G', caps: ['Shift', 'G'], en: '<b>G</b>o to bottom', jp: 'ファイルの末尾へ', tip: '大文字の G（Shift+g）。gg の逆＝最後の行へ', feed: 'G' },
            ] },
            { t: '保存・終了（:コマンド）', en: 'FILE', c: TEAM, full: 4, keys: [
              { id: ':w', caps: [':', 'w'], en: ':<b>w</b>rite', jp: '保存', tip: 'write＝書き込む。Enter までが1コマンド', feed: ':w' },
              { id: ':q', caps: [':', 'q'], en: ':<b>q</b>uit', jp: '終了', tip: 'quit＝やめる。変更があると終了できない', feed: ':q' },
              { id: 'wq', caps: [':', 'w', 'q'], en: ':<b>w</b>rite + <b>q</b>uit', jp: '保存して終了', tip: 'いちばんよく使う！ 大文字の ZZ でも保存して終了できる', feed: ':wq' },
              { id: ':q!', caps: [':', 'q', '!'], en: ':<b>q</b>uit <b>!</b> (強制)', jp: '保存せず終了', tip: '! は「強制」。変更を捨てて抜ける。ミスった時の脱出口', feed: ':q!' },
            ] },
          ];
          const kb = h('div', { class: 'cgk-wrap' }, G.map((g) => h('section', { class: 'cgk-g' + (g.full ? ' full' : ''), style: { '--c': g.c, '--cols': g.full || 2 } },
            h('h4', g.t, h('small', g.en)),
            h('div', { class: 'cgk-grid' }, g.keys.map((k) => {
              const b = h('button', { class: 'cgk', 'data-tip': k.tip, onclick: () => {
                vim.el.focus();
                if (!k.always && vim.mode !== 'NORMAL') vim.feed('Esc');
                vim.feed(k.feed);
                vim.flash();
                if (matchMedia('(max-width:800px)').matches) vim.el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
              } },
              h('span', { class: 'kc' }, k.caps.map((c) => (c.startsWith('icon:') ? icon(c.slice(5)) : h('i', c)))),
              h('span', { class: 'en', html: k.en }), h('span', { class: 'jp' }, k.jp));
              cards[k.id] = b; if (k.id === ':w') cards['w-cmd'] = b;
              return b;
            })))));
          const pin = h('div', { class: 'cgv-pin' }, h('div', { class: 'cgv-lb' }, icon('pin'), 'エディタ（クリックしてキー入力）　下のキー早見表を押すと、ここが変わる'), vim.el);
          el.append(h('div', { class: 'cgv-stage' }, pin,
            h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('ミッション'), tb), h('div', { class: 'col' }, lbl('モードの移り変わり'), h('div', { class: 'card' }, svg))),
            h('div', { style: { marginTop: '18px' } }, lbl('キー早見表 — クリックで実行 / カーソルを乗せると由来を解説'), kb),
            h('div', { class: 'cgk-note' }, icon('lightbulb'), '英語の頭文字を覚えると忘れにくい。', h('span', { html: '下線の付いた文字が<b>実際に押すキー</b>。' }), icon('life-buoy'), '迷ったら ', h('kbd', 'Esc'), ' を連打！')));
        },
      },
      {
        t: '実践：ターミナルで作ってみよう', tag: 'PRACTICE', lead: '下のミッションを<b>3つ</b>✓にしよう（目安 5分）。ホームには、<b>最初から</b> report.txt・logs/app.log・docs/memo.txt があります（フォルダの木に「はじめからある」と出ます）。迷ったら右上のヒントを見てね。',
        hint: '<p>使うのは3種類だけ。</p><ul style="line-height:1.9"><li>フォルダを作る：<code>mkdir フォルダ名</code></li><li>文字を書き込む：<code>echo "文字" &gt; フォルダ名/ファイル名</code></li><li>文字を探す：<code>grep 言葉 ファイル名</code></li></ul><p style="color:var(--mute);font-size:.875rem">もっと遊ぶなら：<code>&gt;&gt;</code> で追記、<code>mv</code> で移動、<code>rm -r</code> で消す。</p>',
        render(el) {
          const tb = taskBox(), stt = {};
          const term = makeTerm((t) => {
            const f = t.exists('/work/error.txt');
            drawTasks(tb, [
              { label: 'work フォルダを作る', ok: !!(t.exists('/work') && t.exists('/work').t === 'd'), hint: ['フォルダを作るコマンドは <code>mkdir</code>（make directory）。', '<code>mkdir</code> のあとに名前を書く。'], answer: { code: 'mkdir work', lang: 'sh' } },
              { label: 'work の中に error.txt を作り、E1001 と書く（調べたエラーのメモ）', ok: !!(f && f.t === 'f' && /E1001/.test(f.v)), hint: ['文字をファイルに書き込むのは <code>echo "文字" &gt; ファイル名</code>。', 'work の中に作るので、ファイル名は <code>work/error.txt</code>。'], answer: { code: 'echo "E1001" > work/error.txt', lang: 'sh' } },
              { label: 'grep で E1001 を探して、見つける', ok: t.ran.some((r) => r.cmd === 'grep' && r.hits > 0), hint: ['探すコマンドは <code>grep</code>。<code>grep 言葉 ファイル名</code> の順に書く。', '探す言葉は E1001、ファイルは work/error.txt。'], answer: { code: 'grep E1001 work/error.txt', lang: 'sh' } },
              { optional: true, level: 1, label: 'error.txt に E2040 を追記して2行にし、<b>はじめからある</b> report.txt を work に移す（ホームなら <code>mv report.txt work</code>、work の中なら <code>mv ../report.txt .</code>）', ok: !!(f && f.t === 'f' && f.v.split('\n').filter(Boolean).length >= 2 && t.exists('/work/report.txt') && !t.exists('/report.txt')), hint: ['追記は <code>&gt;&gt;</code>（<code>&gt;</code> は上書きなので注意）。', '移動は <code>mv 元 先</code>。<b>先がフォルダでないと、mv は名前変更になる</b>（work という名前のファイルができてしまう）。', '書き方は「いま居る場所」で変わる。ホームなら <code>mv report.txt work</code>。work の中なら <code>mv ../report.txt .</code>（<code>..</code> = 1つ上、<code>.</code> = いま居るフォルダ）。'], answer: { code: 'echo "E2040" >> work/error.txt\nmv report.txt work\n# （work の中にいるときは）mv ../report.txt .', lang: 'sh' } },
              { optional: true, level: 2, label: 'logs/app.log を work にコピーして、grep -i で error（大文字・小文字をむし）を探す', ok: !!(t.exists('/work/app.log') && t.exists('/work/app.log').t === 'f' && t.exists('/logs/app.log') && t.ran.some((r) => r.cmd === 'grep' && r.flags.includes('i') && r.hits >= 3 && /app\.log/.test(r.line))), hint: ['コピーは <code>cp 元 先</code>。元の logs/app.log は残る（mv との違い）。', '大文字・小文字をむしするのは <code>grep -i</code>。<code>ERROR</code>・<code>error</code>・<code>Error</code> の3行が見つかれば OK。'], answer: { code: 'cp logs/app.log work\ngrep -i apple work/memo.txt', lang: 'sh' } },
              { optional: true, level: 3, label: 'mkdir -p で work/archive/2026 を一度に作り、error.txt をコピーして、cat で中身を確かめる', ok: !!(t.ran.some((r) => r.cmd === 'mkdir' && r.flags.includes('p')) && t.exists('/work/archive/2026') && t.exists('/work/archive/2026').t === 'd' && t.exists('/work/archive/2026/error.txt') && t.exists('/work/archive/2026/error.txt').t === 'f' && t.ran.some((r) => r.cmd === 'cat' && /error\.txt$/.test(r.args[0] || ''))), hint: ['途中のフォルダもまとめて作るのは <code>mkdir -p</code>。<code>mkdir -p work/archive/2026</code>。', 'そのあと <code>cp work/error.txt work/archive/2026</code> でコピーして、<code>cat</code> で中身を表示。'], answer: { code: 'mkdir -p work/archive/2026\ncp work/error.txt work/archive/2026\ncat work/archive/2026/error.txt', lang: 'sh' } },
            ], stt);
          });
          term.el.style.height = 'auto'; term.el.style.minHeight = '300px';
          term.tree.style.flex = '1';
          el.append(h('div', { class: 'split' }, term.el, h('div', { class: 'col' }, lbl('フォルダ'), term.tree)), tb);
        },
      },
    ],
  });

  /* ============================================================
     Git
  ============================================================ */
  /* fo1: 「出力」パネル（コマンド → 実行結果が1行ずつ出る） */
  function fo1Out(title) {
    const body = h('pre', { class: 'fo1-body' });
    const run = h('button', { class: 'btn ghost fo1-run', title: 'もう一度実行' }, icon('play'), '実行');
    const root = h('div', { class: 'fo1-out' }, h('div', { class: 'fo1-hd' }, icon('terminal'), h('b', title || '出力'), run), body);
    let tk = 0;
    root.show = (cmd, lines, instant) => {
      const id = ++tk; body.replaceChildren(h('span', { class: 'fo1-cmd' }, cmd ? '$ ' + cmd.split('\n')[0] : ''));
      if (!lines || !lines.length) return;
      const put = (i) => { if (id !== tk || i >= lines.length) return; body.append(h('span', { class: 'fo1-ln' }, lines[i])); if (instant) put(i + 1); else setTimeout(() => put(i + 1), 220); };
      put(0);
    };
    root.onRun = (f) => { run.onclick = f; };
    return root;
  }

  function gitFlow() {
    const Z = {
      work: ['作業ディレクトリ', 'Working Dir', TEAM], stage: ['ステージング', 'Staging', PINK], local: ['ローカルリポジトリ', 'Local Repo', TS], remote: ['リモート', 'GitHub', BASIC],
    };
    const zl = {};
    const zones = h('div', { class: 'cg-zones' }, Object.entries(Z).map(([k, [jp, en, c]]) => h('div', { class: 'cg-zone', style: { '--zc': c } }, h('h4', jp, h('small', en)), zl[k] = h('div', { style: { display: 'grid', gap: '6px' } }))));
    const mkF = (t, c, cm) => h('div', { class: 'cg-file' + (cm ? ' cm' : ''), style: { '--zc2': c }, hidden: true }, t);
    const E = { f1: mkF('📄 price.html', TEAM), c1: mkF('● a1b2c3 料金表を更新', TS, 1), c1r: mkF('● a1b2c3 料金表を更新', BASIC, 1), c2: mkF('● d4e5f6 (同僚の変更)', BASIC, 1), c2l: mkF('● d4e5f6 (同僚の変更)', TS, 1) };
    Object.values(E).forEach((e) => zl.work.append(e));
    const pos = [{ f1: 'work' }, { f1: 'stage' }, { c1: 'local' }, { c1: 'local', c1r: 'remote' }, { c1: 'local', c1r: 'remote', c2: 'remote' }, { c1: 'local', c1r: 'remote', c2: 'remote', c2l: 'local' }];
    const src = { c1r: 'c1', c2l: 'c2' };
    const cmds = ['# price.html を編集した！（feature/price-table の上）', 'git add price.html', 'git commit -m "feat: 相談60分の料金を追加"', 'git push -u origin feature/price-table', '# PR が Merge され、GitHub の main に同僚の変更も入った…', 'git checkout main && git pull'];
    const says = ['ファイルを<b>編集</b>。まだ「作業ディレクトリ」にいるだけで、履歴には載っていない。', '<b>git add</b>：「次のコミットに入れるよ」と<b>ステージ</b>に載せる。', '<b>git commit</b>：ステージの内容を<b>履歴（スナップショット）</b>として保存。まだ自分のPCの中だけ。', '<b>git push</b>：ローカルの履歴を<b>GitHub</b>に送る。送るのは<b>自分の作業用の枝</b>（main には直接送らない）。ここから PR を作ってレビューしてもらう。', 'PR が承認され、GitHub 上で Merge された。同僚の変更も GitHub の main に入った。<b>手元の main はまだ知らない</b>。', '<b>main に戻って git pull</b>：GitHub の最新（Merge 済みの変更）を手元に取り込む。これで全員同じ状態。'];
    const cmdBar = h('div', { class: 'cg-cmd' });
    function place(el, z, from) {
      const first = from || (el.isConnected && !el.hidden ? el.getBoundingClientRect() : null);
      const same = el.parentNode === zl[z] && !el.hidden;
      zl[z].append(el); el.hidden = false;
      if (same) return;
      if (first && first.width) {
        const l = el.getBoundingClientRect();
        el.animate([{ transform: `translate(${first.left - l.left}px,${first.top - l.top}px)` }, { transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.3,1.1,.4,1)' });
      } else el.animate([{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1.2)', opacity: 1, offset: .7 }, { transform: 'none' }], { duration: 500 });
    }
    const OUT = [
      ['On branch feature/price-table', 'Changes not staged for commit:', '  modified:   price.html'],
      ['On branch feature/price-table', 'Changes to be committed:', '  modified:   price.html'],
      ['[feature/price-table a1b2c3] feat: 相談60分の料金を追加', ' 1 file changed, 2 insertions(+)'],
      ['Enumerating objects: 3, done.', 'To github.com:team/app.git', ' * [new branch]  feature/price-table -> feature/price-table', '（GitHub に届いた。次は PR を作る）'],
      ['（まだ何も表示されない）', 'git fetch すると… origin/main が 1 つ先に進んでいる'],
      ['Switched to branch \'main\'', 'Updating 9f8e7d..d4e5f6', 'Fast-forward', ' price.html | 2 ++', '→ 手元の main も最新になった'],
    ];
    const OCMD = ['git status', 'git status', cmds[2], cmds[3], 'git status', 'git checkout main && git pull'];
    const outp = fo1Out('実行結果');
    let curN = 0;
    return stepper({
      color: TS, steps: says.map((s) => ({ say: s })),
      init(vis, api) { vis.append(cmdBar, zones, outp); outp.onRun(() => outp.show(OCMD[curN], OUT[curN])); },
      update(n) {
        curN = n; outp.show(OCMD[n], OUT[n]);
        cmdBar.textContent = '$ ' + cmds[n];
        Object.entries(E).forEach(([k, e]) => {
          const z = pos[n][k];
          if (!z) { e.hidden = true; return; }
          place(e, z, src[k] && e.hidden ? E[src[k]].getBoundingClientRect() : null);
        });
      },
    });
  }

  /* ブランチ図（ローカル + GitHub[origin] + Pull Request）。実際の開発の流れを再現する */
  function commitGraph() {
    const COL = [TS, BASIC, PINK, TEAM, VIO];
    const LY = 92, X0 = 40, DX = 60;
    let commits, local, remote, lanes, head, n, log, msg, pr, env;
    function reset() {
      commits = []; local = {}; remote = {}; lanes = { main: 0 }; head = 'main'; n = 0; msg = ''; pr = null; env = false;
      log = ['$ git clone git@github.com:team/app.git'];
      const a = mk([], 0, '初期'), b = mk([a], 0, 'README'); local.main = b; remote.main = b;
    }
    function mk(par, lane, m) { const id = 'C' + n++; commits.push({ id, par, lane, m, nw: true }); return id; }
    const byId = (id) => commits.find((c) => c.id === id);
    const isAnc = (a, b) => { const s = [b], seen = new Set(); while (s.length) { const x = s.pop(); if (x === a) return true; if (seen.has(x)) continue; seen.add(x); s.push(...byId(x).par); } return false; };
    const laneOf = (b) => { if (lanes[b] === undefined) lanes[b] = Object.keys(lanes).length; return lanes[b]; };
    const wrap = h('div'), prBox = h('div', { class: 'cg-pr', style: { display: 'none' } }), legend = h('div', { class: 'cg-leg' }),
      svgBox = h('div', { class: 'cg-svgwrap' }), ctl = h('div', { class: 'cg-ctl' }),
      logEl = h('div', { class: 'cg-cmd', style: { whiteSpace: 'pre', minHeight: '5em', marginTop: '10px' } });
    const nameIn = h('input', { value: 'feature/login', size: 14 });
    const act = {
      commit(m) { const id = mk([local[head]], laneOf(head), m); local[head] = id; log.push(`$ git commit -m "${m || 'work'}"   → ${id}`); },
      branch(name) {
        let nm = (name || nameIn.value || 'feature').replace(/[^\w/-]/g, ''), i = 1, b = nm;
        while (local[b]) b = nm + ++i;
        local[b] = local[head]; laneOf(b); head = b; log.push(`$ git checkout -b ${b}`);
      },
      checkout(b) {
        if (!local[b] && remote[b]) local[b] = remote[b];
        if (!local[b]) return;
        head = b; log.push(`$ git checkout ${b}`);
      },
      push(b) {
        b = b || head;
        if (!local[b]) return;
        const first = remote[b] === undefined;
        if (remote[b] === local[b]) { msg = 'Everything up-to-date'; log.push('$ git push   → Everything up-to-date'); return; }
        if (remote[b] && !isAnc(remote[b], local[b])) { msg = '! [rejected] リモートの方が新しい。先に git pull しよう'; log.push(`$ git push   → rejected`); return; }
        remote[b] = local[b];
        log.push(first ? `$ git push -u origin ${b}   → GitHub に届いた` : `$ git push   → origin/${b} が進んだ`);
      },
      pull() {
        const b = head, r = remote[b];
        if (!r) { msg = 'GitHub にこの枝はまだ無い（先に push）'; return; }
        if (r === local[b] || isAnc(r, local[b])) { msg = 'Already up to date.'; log.push('$ git pull   → Already up to date'); return; }
        if (isAnc(local[b], r)) { local[b] = r; msg = 'Fast-forward：GitHub の最新が手元に届いた'; log.push('$ git pull   → Fast-forward'); return; }
        const id = mk([local[b], r], laneOf(b), 'merge'); local[b] = id; msg = '手元と GitHub が別々に進んでいたので、マージコミットができた'; log.push(`$ git pull   → ${id} (merge commit)`);
      },
      merge(b) {
        const t = local[b], cu = local[head];
        if (!t) return;
        if (isAnc(t, cu)) { msg = 'Already up to date.'; log.push(`$ git merge ${b}   → Already up to date`); return; }
        if (isAnc(cu, t)) { local[head] = t; msg = 'Fast-forward（ポインタが進むだけ）'; log.push(`$ git merge ${b}   → Fast-forward`); return; }
        const id = mk([cu, t], laneOf(head), 'merge'); local[head] = id; msg = `${b} の内容を、いまの枝に取り込んだ`; log.push(`$ git merge ${b}   → ${id} (merge commit)`);
      },
      prOpen(src, dst) { pr = { src, dst, state: 'open' }; log.push(`GitHub: Pull Request を作成（${src} → ${dst}）`); },
      prReview() { if (pr) { pr.state = 'approved'; log.push('GitHub: レビュー Approve・CI 成功'); } },
      prMerge(style) {
        if (!pr) return;
        const s = remote[pr.src], d = remote[pr.dst];
        const id = style === 'squash' ? mk([d], laneOf(pr.dst), 'PR') : mk([d, s], laneOf(pr.dst), 'PR');
        remote[pr.dst] = id; pr.state = 'merged';
        log.push(`GitHub: Merge pull request（${pr.src} → ${pr.dst}）   → ${id}`);
        msg = `GitHub の ${pr.dst} だけが進んだ。手元の ${pr.dst} はまだ古い → git pull で取り込む`;
      },
      ghDelete(b) { delete remote[b]; log.push(`GitHub: ${b} を削除（Delete branch）`); },
      delLocal(b) { if (b === head) return; delete local[b]; log.push(`$ git branch -d ${b}`); },
      other(b, m) { const id = mk([remote[b]], laneOf(b), m); remote[b] = id; log.push(`（同僚が GitHub の ${b} を更新：${m}）`); },
      setup() { local.develop = remote.develop = local.main; laneOf('develop'); env = true; },
      note(t) { log.push(t); },
    };
    let top = 62;
    const pos = (c) => ({ x: X0 + commits.indexOf(c) * DX, y: top + c.lane * LY });
    function draw() {
      const L = Object.keys(lanes).length;
      const tips = {};
      Object.entries(local).forEach(([b, id]) => (tips[id] ||= []).push({ b, label: (b === head ? 'HEAD → ' : '') + b, kind: b === head ? 'head' : 'loc' }));
      Object.entries(remote).forEach(([b, id]) => (tips[id] ||= []).push({ b, label: 'origin/' + b, kind: 'rm' }));
      const pw = (t) => t.label.length * 6.6 + 16;
      // 同じ枝の先にまだコミットが続く所は上に、先端は右に置く（線と重ならない）
      const later = (c) => commits.some((d, i) => i > commits.indexOf(c) && d.lane === c.lane);
      const maxUp = Math.max(1, ...commits.filter((c) => tips[c.id] && later(c)).map((c) => tips[c.id].length));
      top = 48 + (maxUp - 1) * 22;
      let W = X0 + commits.length * DX + 20;
      commits.forEach((c) => { const p = pos(c); (tips[c.id] || []).forEach((t) => { W = Math.max(W, later(c) ? p.x + pw(t) / 2 + 10 : p.x + 24 + pw(t) + 10); }); });
      W = Math.max(520, W);
      const H = top + (L - 1) * LY + 56;
      let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`;
      commits.forEach((c) => c.par.forEach((pid) => { const P = pos(byId(pid)), C = pos(c); s += P.y === C.y ? `<line x1="${P.x}" y1="${P.y}" x2="${C.x}" y2="${C.y}"/>` : `<path class="ed" d="M${P.x} ${P.y} C${P.x + 30} ${P.y} ${C.x - 30} ${C.y} ${C.x} ${C.y}"/>`; }));
      commits.forEach((c) => { const p = pos(c); s += `<g class="${c.nw ? 'nw' : ''}"><circle cx="${p.x}" cy="${p.y}" r="14" fill="${COL[c.lane % 5]}" stroke="var(--bg)" stroke-width="3"/><text x="${p.x}" y="${p.y + 4}" text-anchor="middle">${c.id}</text>${c.m ? `<text class="mg" x="${p.x}" y="${p.y + 31}" text-anchor="middle">${esc(c.m.slice(0, 7))}</text>` : ''}</g>`; c.nw = false; });
      commits.forEach((c) => { const p = pos(c), list = tips[c.id] || [], up = later(c); list.forEach((t, k) => {
        const w = pw(t), cx = up ? p.x : p.x + 24 + w / 2, y = up ? p.y - 44 - k * 22 : p.y - (list.length * 22 - 3) / 2 + k * 22;
        s += `<g class="pill ${t.kind}" data-b="${esc(t.b)}" data-k="${t.kind}"><rect x="${cx - w / 2}" y="${y}" width="${w}" height="19" rx="6"/><text x="${cx}" y="${y + 13.5}" text-anchor="middle">${esc(t.label)}</text></g>`;
      }); });
      svgBox.innerHTML = s + '</svg>';
      svgBox.querySelectorAll('.pill:not(.rm)').forEach((p) => p.addEventListener('click', () => { act.checkout(p.dataset.b); draw(); }));
      legend.replaceChildren(h('span', { class: 'lg loc' }, 'ローカル（自分のPC）'), h('span', { class: 'lg rm' }, 'origin ＝ GitHub'),
        ...(env ? [h('span', { class: 'lg env', style: { '--lc': COL[0] } }, 'main ＝ 本番 prd'), h('span', { class: 'lg env', style: { '--lc': COL[1] } }, 'develop ＝ 開発 dev')] : []));
      if (pr) {
        const st = { open: ['レビュー待ち', 'open'], approved: ['Approve 済み・Merge できる', 'ok'], merged: ['Merged（GitHub 上で取り込み済み）', 'done'] }[pr.state];
        prBox.style.display = '';
        prBox.className = 'cg-pr ' + st[1];
        prBox.replaceChildren(icon('git-pull-request'), h('b', 'Pull Request'), h('code', `${pr.src} → ${pr.dst}`), h('span', { class: 'st' }, st[0]));
      } else prBox.style.display = 'none';
      const names = Object.keys(local), sw = h('select', names.map((b) => h('option', { value: b, selected: b === head }, b)));
      sw.onchange = () => { act.checkout(sw.value); draw(); };
      const prSrc = h('select', Object.keys(remote).filter((b) => b !== 'main' && b !== 'develop').concat(Object.keys(remote).filter((b) => b === 'main' || b === 'develop')).map((b) => h('option', { value: b }, b)));
      const prDst = h('select', ['main', 'develop'].filter((b) => remote[b]).map((b) => h('option', { value: b }, b)));
      const sty = h('select', h('option', { value: 'merge' }, 'Merge commit'), h('option', { value: 'squash' }, 'Squash'));
      const sep = () => h('span', { style: { opacity: .4 } }, '|');
      const mergeOthers = names.filter((b) => b !== head);
      const mSel = h('select', mergeOthers.map((b) => h('option', { value: b }, b)));
      ctl.replaceChildren(
        btn('➕ commit', () => { act.commit(); draw(); }, 'primary' + (commits.length >= 18 ? ' x' : '')), sep(),
        nameIn, btn('🌿 branch作成', () => { act.branch(); draw(); }), sep(),
        'checkout', sw, sep(),
        btn('push', () => { act.push(); draw(); }), btn('pull', () => { act.pull(); draw(); }), sep(),
        h('span', { class: 'cg-ghl' }, icon('git-pull-request'), 'GitHub で'), prSrc, '→', prDst, sty,
        btn('Pull Request を Merge', () => { if (!prSrc.value || !prDst.value || prSrc.value === prDst.value) { msg = 'GitHub に枝がないと Pull Request は作れない。先に push しよう'; draw(); return; } if (!pr || pr.src !== prSrc.value || pr.dst !== prDst.value) { act.prOpen(prSrc.value, prDst.value); } act.prMerge(sty.value); draw(); }), sep(),
        mergeOthers.length ? [btn('merge（手元）', () => { act.merge(mSel.value); draw(); }), mSel, '→ ' + head] : null,
        btn('⟲', () => { reset(); draw(); }, 'ghost'));
      if (commits.length >= 18) ctl.querySelector('.primary').disabled = true;
      logEl.textContent = log.slice(-6).join('\n') + (msg ? '\n# ' + msg : '');
      msg = '';
    }
    reset();
    wrap.append(legend, prBox, ctl, svgBox, logEl); draw();
    wrap.api = { act, draw, reset, ctl, setLog: (t) => { log.push(t); }, get head() { return head; }, clearNew: () => commits.forEach((c) => (c.nw = false)) };
    return wrap;
  }

  K.reg({
    id: 'git', track: 'basic', title: 'Git', sub: '履歴を残して、みんなで共有', emoji: '🌿',
    scenes: [
      { t: '4つの場所とコマンド', tag: 'add → commit → push', lead: 'Git は「ファイルが<b>どの場所</b>にあるか」を意識するのがコツ。「次へ ▶」で、ファイルが旅をする様子を追おう。', render(el) { el.append(gitFlow()); } },
      { t: 'ブランチとマージ', tag: 'branch', lead: '現場の流れそのままに、<b>シナリオ</b>を選んで「次へ」を押そう。<b>コマンドと図が一緒に動きます</b>。実線の枝が自分のPC、点線が GitHub（origin）。',
        render(el) {
          style('cgs', `.cgs-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.cgs-tab{all:unset;cursor:pointer;display:flex;align-items:center;gap:.5em;padding:.55em 1.1em;border-radius:8px;font-weight:800;font-size:.875rem;background:var(--card);border:1px solid var(--line);transition:.2s}.cgs-tab small{display:block;font-weight:600;color:var(--mute);font-size:.75rem}.cgs-tab:hover{transform:translateY(-2px)}.cgs-tab.on{background:color-mix(in srgb,var(--c) 22%,var(--card));border-color:var(--c);box-shadow:0 8px 20px -10px var(--c)}.cgs-tab .ic{color:var(--c)}.cg-svgwrap text.mg{font:700 10px var(--font);fill:var(--mute)}.cgs-goal{display:flex;gap:10px;align-items:center;padding:.6em 1em;border-radius:8px;background:color-mix(in srgb,var(--c) 12%,transparent);border:1px dashed color-mix(in srgb,var(--c) 45%,transparent);font-weight:700;font-size:.875rem;margin-bottom:12px}.cgs-goal .ic{color:var(--c);flex:none}`);
          const g = commitGraph(); const A = g.api;
          const SC = [
            { id: 'work', c: TS, ic: 'git-branch', t: '機能を作る', sub: 'ふだんの流れ', goal: '最新の main から枝を作り、GitHub の Pull Request で取り込んでもらう。最後は main を pull',
              steps: [
                { say: '朝いちばん。手元の <b>main</b> と、GitHub の <b>origin/main</b> は同じ場所にある。ここに「ログイン機能」を足したい。', run() {} },
                { say: '<b>git checkout main</b>：まず main に移動。新しい作業は<b>いつも main から</b>始める。', run() { A.act.checkout('main'); } },
                { say: '<b>git pull</b>：GitHub の最新を取り込む。同僚の変更を受け取って、「今日の出発点」をそろえる。', run() { A.act.pull(); } },
                { say: '<b>git checkout -b feature/login</b>：作業用の枝を作って移動。main は触らないので、失敗しても安全。', run() { A.act.branch('feature/login'); } },
                { say: '<b>commit</b>。コミットは<b>今いる枝</b>にだけ積まれる（HEAD の場所）。', run() { A.act.commit('フォーム'); } },
                { say: 'もう1回 commit。ここまでは<b>自分のPCの中だけ</b>。まだ誰にも見えていない。', run() { A.act.commit('検証'); } },
                { say: '<b>git push -u origin feature/login</b>：枝を GitHub に送る。<b>origin/feature/login</b> ができた。', run() { A.act.push(); } },
                { say: 'GitHub で <b>Pull Request（PR）</b>を作る。「この変更を main に入れてください」とチームにお願いする。', run() { A.act.prOpen('feature/login', 'main'); } },
                { say: '仲間が<b>レビュー</b>して Approve。自動テスト（CI）も成功。main に直接 push しないのは、ここで<b>確認する</b>ため。', run() { A.act.prReview(); } },
                { say: 'GitHub の画面で <b>Merge</b>。main が進んだのは <b>GitHub 側だけ</b>。手元の main はまだ古いままに注目。', run() { A.act.prMerge('merge'); } },
                { say: '<b>git checkout main</b>：手元の main に戻る。', run() { A.act.checkout('main'); } },
                { say: '<b>git pull</b>：GitHub で進んだ main を取り込む。やっと<b>手元の main も最新</b>になった。', run() { A.act.pull(); } },
                { say: '役目を終えた枝を消す（<b>git branch -d feature/login</b>）。GitHub 側は Merge 後に「Delete branch」。次の機能は、また最新の main から。', run() { A.act.ghDelete('feature/login'); A.act.delLocal('feature/login'); } },
              ] },
            { id: 'env', c: BASIC, ic: 'rocket', t: 'dev → prd', sub: '環境に出す順番', goal: '機能は develop（dev 環境）で確認してから、main（prd 本番）へ出す',
              init() { A.act.setup(); },
              steps: [
                { say: '現場では環境が2つ。<b>develop</b> に入れると<b>開発（dev）環境</b>、<b>main</b> に入れると<b>本番（prd）</b>に公開される。', run() {} },
                { say: '<b>git checkout develop</b>：機能の枝は <b>develop</b> から作る（main ではない）。', run() { A.act.checkout('develop'); } },
                { say: '<b>git checkout -b feature/search</b>：作業用の枝を作る。', run() { A.act.branch('feature/search'); } },
                { say: '<b>commit</b>して、<b>git push -u origin feature/search</b>。', run() { A.act.commit('検索'); A.act.push(); } },
                { say: 'PR の向き先は <b>develop</b>。レビューを受けて Merge する。', run() { A.act.prOpen('feature/search', 'develop'); A.act.prReview(); A.act.prMerge('merge'); } },
                { say: 'develop が進むと、<b>dev 環境に自動で反映</b>される（CI/CD）。ここで動作を確認する。まだ本番には出ていない。', run() { A.act.note('（dev 環境に自動デプロイ → 動作確認）'); } },
                { say: '確認OK。<b>develop → main</b> のPR（リリース PR）を作って、レビューを受ける。', run() { A.act.prOpen('develop', 'main'); A.act.prReview(); } },
                { say: '<b>main に Merge</b>。→ <b>prd（本番）に公開</b>。お客さんに届くのは、この瞬間。', run() { A.act.prMerge('merge'); } },
                { say: '最後に <b>git checkout main</b> → <b>git pull</b>。手元の main も本番と同じ状態にしておく。', run() { A.act.checkout('main'); A.act.pull(); } },
              ] },
            { id: 'hot', c: PINK, ic: 'flame', t: '不具合（hotfix）', sub: '本番で見つかったら', goal: '本番のバグは main から枝を切って直す。同じ修正を develop にも入れるのを忘れない',
              init() { A.act.setup(); A.act.other('develop', '開発中'); },
              steps: [
                { say: '<b>prd（本番）で不具合</b>が見つかった！ develop には「開発中の変更」が入っていて、まだ出せない。', run() {} },
                { say: '<b>git checkout main</b> → <b>git pull</b>：直す元は<b>本番と同じ main</b>。まず最新にする。', run() { A.act.checkout('main'); A.act.pull(); } },
                { say: '<b>git checkout -b hotfix/login-bug</b>：緊急の修正用の枝。名前に hotfix を付けると分かりやすい。', run() { A.act.branch('hotfix/login-bug'); } },
                { say: '直して <b>commit</b>。修正は<b>小さく</b>、原因だけを直す。', run() { A.act.commit('修正'); } },
                { say: '<b>git push -u origin hotfix/login-bug</b>。', run() { A.act.push(); } },
                { say: '向き先は <b>main</b> のPR。急ぎでも、レビューと CI は省かない。', run() { A.act.prOpen('hotfix/login-bug', 'main'); A.act.prReview(); } },
                { say: '<b>main に Merge</b> → すぐ <b>prd に反映</b>。本番が直った。', run() { A.act.prMerge('merge'); } },
                { say: '<b>同じ修正を develop にも入れる</b>（PR）。忘れると、次のリリースでバグが復活する！', run() { A.act.prOpen('hotfix/login-bug', 'develop'); A.act.prReview(); A.act.prMerge('merge'); } },
                { say: '<b>git checkout main</b> → <b>git pull</b>。手元の main も、本番の最新にする。', run() { A.act.checkout('main'); A.act.pull(); } },
              ] },
            { id: 'upd', c: VIO, ic: 'refresh-cw', t: '作業中に main が進んだ', sub: '衝突の予防', goal: '長く作業するなら、ときどき main の最新を自分の枝に取り込む。手元で merge を使うのは、この場面',
              init() { A.act.branch('feature/login'); A.act.commit('フォーム'); A.act.push(); A.act.prOpen('feature/login', 'main'); },
              steps: [
                { say: '<b>feature/login</b> で作業中（PR も出している）。ここまでは順調。', run() {} },
                { say: '同僚の PR が<b>先に main に入った</b>。GitHub の main が進んだが、手元の main はまだ古い。', run() { A.act.other('main', '同僚'); } },
                { say: '<b>git checkout main</b>：まず手元の main に移る。', run() { A.act.checkout('main'); } },
                { say: '<b>git pull</b>：GitHub の最新 main を取り込む。', run() { A.act.pull(); } },
                { say: '<b>git checkout feature/login</b>：自分の枝に戻る。', run() { A.act.checkout('feature/login'); } },
                { say: '<b>git merge main</b>：main の最新を、<b>自分の枝に</b>取り込む。同じ場所を変えていたら、衝突（コンフリクト）はここで見つかる。', run() { A.act.merge('main'); } },
                { say: '<b>git push</b>：枝を送り直す。PR が最新になり、<b>そのまま Merge できる</b>状態に。', run() { A.act.push(); } },
              ] },
          ];
          const wrap = h('div'); const tabs = h('div', { class: 'cgs-tabs' }); const body = h('div');
          let stp = null, mode = null;
          const sel = (k) => {
            if (stp) stp.stop && stp.stop();
            mode = k; body.replaceChildren(); A.reset(); A.draw();
            tabs.querySelectorAll('.cgs-tab').forEach((t) => t.classList.toggle('on', t.dataset.k === k));
            const col = k === 'free' ? VIO : SC.find((x) => x.id === k).c;
            wrap.style.setProperty('--c', col);
            if (k === 'free') { A.ctl.style.display = ''; body.append(h('div', { class: 'cgs-goal' }, icon('mouse-pointer-click'), '好きに試そう。push しないと GitHub には届かない。PR の Merge は GitHub 側だけが進む。'), g); return; }
            const S = SC.find((x) => x.id === k);
            A.ctl.style.display = 'none';
            const base = () => { A.reset(); S.init && S.init(); };
            base(); A.draw(); A.clearNew();
            stp = stepper({
              color: S.c, interval: 2600, steps: S.steps.map((x) => ({ say: x.say })),
              init() {},
              update(n) {
                base(); A.draw(); A.clearNew();
                for (let i = 0; i < n; i++) S.steps[i].run();
                A.draw(); A.clearNew();
                S.steps[n].run(); A.draw();
              },
            });
            body.append(h('div', { class: 'cgs-goal' }, icon('target'), S.goal), g, h('div', { style: { height: '12px' } }), stp);
          };
          SC.forEach((x) => tabs.append(h('button', { class: 'cgs-tab', 'data-k': x.id, style: { '--c': x.c }, onclick: () => sel(x.id) }, icon(x.ic), h('div', x.t, h('small', x.sub)))));
          tabs.append(h('button', { class: 'cgs-tab', 'data-k': 'free', style: { '--c': VIO }, onclick: () => sel('free') }, icon('mouse-pointer-click'), h('div', '自由に試す', h('small', 'free play'))));
          wrap.append(tabs, body); el.append(wrap);
          sel('work');
        },
      },
      { t: 'コンフリクトを解決しよう', tag: 'conflict', lead: '同じ所を<b>別々に直す</b>と、Git は自分で決められません。<b>PR に「衝突している」と出る</b> → 手元で直す → push、の流れを体験しよう。',
        render(el) {
          style('cgc', `
          .cgc-pr{border:1px solid var(--line);border-radius:10px;background:var(--card);overflow:hidden;margin-bottom:12px}
          .cgc-pr .hd{display:flex;align-items:center;gap:.6em;flex-wrap:wrap;padding:.6em .9em;border-bottom:1px solid var(--line);font-size:.875rem}
          .cgc-pr .hd .ic{width:18px;height:18px;color:var(--basic)}.cgc-pr .hd code{font:700 .8125rem var(--mono)}.cgc-pr .hd .st{margin-left:auto;font-weight:800;padding:.1em .7em;border-radius:6px;border:1px solid var(--bad);color:var(--bad)}
          .cgc-pr .bd{display:flex;align-items:center;gap:.7em;padding:.7em .9em;font-size:.875rem;line-height:1.6}.cgc-pr .bd .ic{width:20px;height:20px;flex:none;color:var(--bad)}
          .cgc-pr .bd small{display:block;color:var(--mute);font-size:.75rem}
          .cgc-pr .mg{margin:0 .9em .8em;display:flex;gap:8px;align-items:center}.cgc-pr .mg button{all:unset;padding:.45em 1em;border-radius:8px;font-weight:800;font-size:.875rem;background:var(--ok);color:#06101f;cursor:pointer}.cgc-pr .mg button:disabled{background:var(--card2);color:var(--mute);cursor:not-allowed}
          .cgc-pr.ok .hd .st{border-color:var(--ok);color:var(--ok)}.cgc-pr.ok .bd .ic{color:var(--ok)}.cgc-pr.done .hd .st{border-color:var(--violet);color:var(--violet)}.cgc-pr.done .bd .ic{color:var(--violet)}
          .cgc-ed{border:1px solid var(--line);border-radius:10px;background:var(--code);color:#d8dcff;font:.8125rem/1.8 var(--mono);overflow:hidden}
          .cgc-ed .tt{display:flex;align-items:center;gap:.6em;padding:.45em .9em;background:rgba(255,255,255,.06);font-weight:700}.cgc-ed .tt .ic{width:14px;height:14px}
          .cgc-ed .ln{display:grid;grid-template-columns:1.4em 1fr auto;gap:.8em;align-items:baseline;padding:0 .9em;min-height:1.8em}.cgc-ed .ln span:nth-child(2){white-space:pre-wrap;min-width:0}.cgc-ed .ln i{font-style:normal;color:#5a6390;width:1.4em;flex:none;text-align:right}
          .cgc-ed .ln.mk{background:rgba(255,255,255,.07);color:#aab2de}.cgc-ed .ln.me{background:color-mix(in srgb,var(--basic) 24%,transparent)}.cgc-ed .ln.th{background:color-mix(in srgb,var(--ts) 28%,transparent)}
          .cgc-ed .ln .tg{font:800 .6875rem var(--font);padding:.05em .6em;border-radius:6px;border:1px solid currentColor;white-space:nowrap}
          .cgc-ed .ln.me .tg,.cgc-ed .ln.mk.a .tg{color:var(--basic)}.cgc-ed .ln.th .tg,.cgc-ed .ln.mk.c .tg{color:var(--ts)}
          .cgc-lens{display:flex;flex-wrap:wrap;gap:6px;padding:.4em .9em;background:rgba(255,255,255,.04);font-family:var(--font)}
          .cgc-lens button{all:unset;cursor:pointer;font:800 .75rem var(--font);padding:.2em .7em;border-radius:6px;border:1px solid var(--line);color:#d8dcff;transition:.2s}.cgc-lens button:hover{background:rgba(255,255,255,.12)}
          .cgc-lens button.me{color:var(--basic);border-color:var(--basic)}.cgc-lens button.th{color:var(--ts);border-color:var(--ts)}
          .cgc-ed textarea{display:block;width:100%;min-height:9em;box-sizing:border-box;background:transparent;border:0;outline:0;color:#fff;font:inherit;padding:.5em .9em;resize:vertical}
          .cgc-ed .off{padding:1.2em .9em;color:#8e97c4;font-family:var(--font)}
          .cgc-note{display:flex;gap:.6em;align-items:flex-start;margin-top:10px;padding:.6em .9em;border-radius:8px;border:1px dashed var(--line);font-size:.875rem;line-height:1.7}.cgc-note .ic{width:18px;height:18px;flex:none;margin-top:3px;color:var(--c,var(--pink))}
          .cgc-next{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 0 12px;font-size:.875rem}.cgc-next small{color:var(--mute);font-weight:700}
          .cgc-warn{color:#ffd37a}
          `);
          const BASE = '<h1>\n<<<<<<< HEAD\n  ようこそ、研修ナビへ\n=======\n  こんにちは、研修ナビ\n>>>>>>> main\n</h1>\n';
          const CLEAN = '<h1>\n  こんにちは、研修ナビ\n</h1>\n';
          let st, text;
          const fresh = () => { st = { branch: 'feature/title', pulled: false, conflict: false, added: false, committed: false, pushed: false, merged: false, edit: false }; text = CLEAN; };
          fresh();
          const hasMk = () => /^(<{7}|={7}|>{7})/m.test(text);

          /* ---- PR card ---- */
          const prEl = h('div', { class: 'cgc-pr' });
          const drawPR = () => {
            const k = st.merged ? 'done' : st.pushed ? 'ok' : '';
            prEl.className = 'cgc-pr ' + k;
            const mg = h('button', { disabled: !st.pushed || st.merged, onclick: () => { st.merged = true; celebrate(); drawPR(); } }, st.merged ? 'Merged' : 'Merge pull request');
            prEl.replaceChildren(
              h('div', { class: 'hd' }, icon('git-pull-request'), h('b', 'Pull Request #12'), h('code', 'feature/title → main'),
                h('span', { class: 'st' }, st.merged ? 'Merged' : st.pushed ? 'Open' : 'Open')),
              h('div', { class: 'bd' }, icon(st.pushed ? 'circle-check' : 'triangle-alert'),
                h('div', st.merged ? h('b', 'Pull request successfully merged') : st.pushed ? h('b', 'No conflicts with base branch') : h('b', 'This branch has conflicts that must be resolved'),
                  h('small', st.merged ? 'main に取り込まれた。あとは git checkout main → git pull' : st.pushed ? '衝突が無くなった。Merge できます' : 'Conflicting files: index.html　← 衝突している。Merge ボタンは押せない'))),
              h('div', { class: 'mg' }, mg));
          };

          /* ---- editor ---- */
          const edEl = h('div', { class: 'cgc-ed' });
          const lensBtn = (cls, label, f) => h('button', { class: cls, onclick: f }, label);
          const resolveWith = (w) => {
            const L = text.split('\n'), a = L.findIndex((x) => /^<{7}/.test(x)), m = L.findIndex((x) => /^={7}/.test(x)), z = L.findIndex((x) => /^>{7}/.test(x));
            if (a < 0 || m < 0 || z < 0) return;
            const me = L.slice(a + 1, m), th = L.slice(m + 1, z);
            text = [...L.slice(0, a), ...(w === 'me' ? me : w === 'th' ? th : [...me, ...th]), ...L.slice(z + 1)].join('\n');
            drawED(); drawGuide();
          };
          const drawED = () => {
            const kids = [h('div', { class: 'tt' }, icon('file-code'), 'index.html', h('span', { style: { marginLeft: 'auto', fontWeight: 600, color: '#8e97c4' } }, !st.conflict ? '（まだ衝突していない）' : hasMk() ? '衝突中' : '印は消えた'))];
            if (!st.conflict) { kids.push(h('div', { class: 'off' }, 'ここは、手元で <code>git merge main</code> をすると衝突して、印が現れます。', h('br'), '左のターミナルを上から順に進めよう。')); edEl.replaceChildren(...kids); return; }
            if (hasMk() && !st.edit) kids.push(h('div', { class: 'cgc-lens' },
              lensBtn('me', '自分の変更を残す（feature/title）', () => resolveWith('me')), lensBtn('th', 'main の変更を残す（同僚）', () => resolveWith('th')), lensBtn('', '両方残す', () => resolveWith('both'))));
            if (st.edit) {
              const ta = h('textarea', { spellcheck: 'false', oninput: () => { text = ta.value; drawGuide(); } }); ta.value = text; kids.push(ta);
            } else {
              let zone = '';
              text.replace(/\n$/, '').split('\n').forEach((l, i) => {
                let c = '', tag = null;
                if (/^<{7}/.test(l)) { c = 'mk a'; zone = 'me'; tag = '↓ ここから「自分の変更（feature/title）」'; }
                else if (/^={7}/.test(l)) { c = 'mk'; zone = 'th'; tag = '区切り'; }
                else if (/^>{7}/.test(l)) { c = 'mk c'; zone = ''; tag = '↑ ここまで「main の変更（同僚）」'; }
                else if (zone) c = zone;
                const ln = h('div', { class: 'ln ' + c }, h('i', String(i + 1)), h('span', l || ' '));
                if (tag) ln.append(h('span', { class: 'tg' }, tag)); else if (c === 'me') ln.append(h('span', { class: 'tg' }, '自分の変更')); else if (c === 'th') ln.append(h('span', { class: 'tg' }, 'main の変更'));
                kids.push(ln);
              });
            }
            kids.push(h('div', { class: 'cgc-lens' }, lensBtn('', st.edit ? '編集をおわる' : 'エディタで直接直す', () => { st.edit = !st.edit; drawED(); }), h('span', { style: { color: '#8e97c4', fontSize: '.75rem', alignSelf: 'center' } }, st.edit ? '印の行（<<<<<<< ======= >>>>>>>）も自分で消す' : '')));
            edEl.replaceChildren(...kids);
          };

          /* ---- terminal ---- */
          const out = h('div', { class: 'cg-out' });
          const prompt = h('span');
          const input = h('input', { spellcheck: 'false', autocomplete: 'off', autocapitalize: 'off', placeholder: 'コマンドを入力…' });
          const term = h('div', { class: 'cg-term', onclick: () => input.focus() }, h('div', { class: 'hd' }, h('i'), h('i'), h('i')), out, h('div', { class: 'cg-line' }, prompt, input));
          const say = (t, cls) => { out.append(h('div', { class: cls || null, html: t })); out.scrollTop = out.scrollHeight; };
          const nextBox = h('div', { class: 'cgc-next' });
          const next = () => {
            if (st.pushed) return null;
            if (st.committed) return 'git push';
            if (st.added) return 'git commit';
            if (st.conflict) return hasMk() ? null : 'git add index.html';
            if (st.branch !== 'main' && !st.pulled) return 'git checkout main';
            if (st.branch === 'main' && !st.pulled) return 'git pull';
            if (st.branch === 'main') return 'git checkout feature/title';
            return 'git merge main';
          };
          function drawGuide() {
            prompt.textContent = `kenshu@pc ~/app (${st.branch}) $`;
            const n = next();
            nextBox.replaceChildren(...(n ? [h('small', '次のコマンド'), h('button', { class: 'cg-chip', onclick: () => run(n) }, n)]
              : st.pushed ? [h('small', '衝突が解決できた。右上の PR を見てみよう')] : [h('small', '右のエディタで、印を消して直そう（ボタンで選ぶか、直接編集）')]),
            h('button', { class: 'btn ghost', style: { marginLeft: 'auto' }, onclick: () => { fresh(); out.replaceChildren(); say('feature/title で作業中。PR に衝突の表示が出た！'); drawPR(); drawED(); drawGuide(); } }, icon('rotate-ccw'), 'はじめから'));
          }
          function run(line) {
            line = line.trim().replace(/\s+/g, ' ');
            say('<span class="cmd">' + esc(`kenshu@pc ~/app (${st.branch}) $ `) + '</span>' + esc(line));
            const e = (t) => say(esc(t), 'err'), w = (t) => say(esc(t));
            if (!line) return drawGuide();
            if (line === 'git status') {
              if (st.conflict && !st.added) { say(`On branch ${esc(st.branch)}<br>You have unmerged paths.<br>  (fix conflicts and run "git commit")<br>Unmerged paths:<br>        <span class="err">both modified:   index.html</span>`); say('<span style="opacity:.7">← both modified ＝ 自分も main も、同じファイルを変えた</span>'); }
              else if (st.conflict && st.added && !st.committed) say(`On branch ${esc(st.branch)}<br>All conflicts fixed but you are still merging.<br>  (use "git commit" to conclude merge)`);
              else w(`On branch ${st.branch}\nnothing to commit, working tree clean`);
            } else if (line === 'git checkout main' || line === 'git checkout feature/title') {
              const b = line.split(' ')[2];
              if (st.conflict && !st.committed) { e('error: you need to resolve your current index first'); say('<span class="cgc-warn">まず衝突を直して、commit まで終わらせよう</span>'); return drawGuide(); }
              st.branch = b; w(`Switched to branch '${b}'`);
            } else if (line === 'git pull' || line === 'git pull origin main') {
              if (st.branch !== 'main') { say('<span class="cgc-warn">いま main ではない。pull は「いまの枝」を最新にする。まず git checkout main</span>'); return drawGuide(); }
              if (st.pulled) w('Already up to date.'); else { st.pulled = true; w('Updating 8c1d4e2..e41b7d0\nFast-forward\n index.html | 2 +-\n（同僚の変更が、手元の main に届いた）'); }
            } else if (line === 'git merge main') {
              if (st.branch !== 'feature/title') { say('<span class="cgc-warn">main の上で merge main しても意味がない。feature/title に移ってから</span>'); return drawGuide(); }
              if (!st.pulled) { w('Already up to date.'); say('<span class="cgc-warn">手元の main が古いままなので、取り込むものが無い。先に main で git pull しよう</span>'); return drawGuide(); }
              if (st.conflict) { w('Already up to date.'); return drawGuide(); }
              st.conflict = true; text = BASE; st.edit = false;
              say('Auto-merging index.html'); e('CONFLICT (content): Merge conflict in index.html'); e('Automatic merge failed; fix conflicts and then commit the result.');
              say('<span class="cgc-warn">衝突！ index.html に印が入った。右のエディタで直そう（git status で状況も見られる）</span>'); drawED();
            } else if (line === 'git add index.html' || line === 'git add .' || line === 'git add -A') {
              if (!st.conflict) { w('（追加する変更はありません）'); return drawGuide(); }
              if (hasMk()) { say('<span class="cgc-warn">まだ印（&lt;&lt;&lt;&lt;&lt;&lt;&lt; ======= &gt;&gt;&gt;&gt;&gt;&gt;&gt;）が残っている！消してから add しよう。印が残ったまま commit すると、壊れたコードが main に入る</span>'); return drawGuide(); }
              st.added = true; w('（index.html を add した。衝突は解決済みの扱いになった）');
            } else if (/^git commit( --no-edit| -m ".+")?$/.test(line)) {
              if (!st.conflict) { w('nothing to commit, working tree clean'); return drawGuide(); }
              if (!st.added) { e('error: Committing is not possible because you have unmerged files.'); e("hint: Fix them up in the work tree, and then use 'git add/rm <file>'"); say('<span class="cgc-warn">先に印を消して git add index.html</span>'); return drawGuide(); }
              st.committed = true; w("[feature/title 3f2a1b9] Merge branch 'main' into feature/title\n（メッセージは自動で付くので、そのままで OK）");
            } else if (line === 'git push' || line === 'git push origin feature/title') {
              if (!st.committed) { w('Everything up-to-date'); say('<span class="cgc-warn">まだ commit していない。送るものがない</span>'); return drawGuide(); }
              st.pushed = true; w('To github.com:team/app.git\n   a1b2c3d..3f2a1b9  feature/title -> feature/title\n（PR が更新された）'); drawPR(); celebrate();
            } else say(esc('zsh: このデモで使えるのは git status / checkout / pull / merge / add / commit / push だけ'), 'err');
            drawGuide(); drawED();
          }
          input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { const v = input.value; input.value = ''; run(v); } });
          say('feature/title で作業中。PR に衝突の表示が出た！ 下の「次のコマンド」を押すか、自分で入力しよう。');
          drawPR(); drawED(); drawGuide();

          el.append(h('div', { class: 'split' },
            h('div', { class: 'col' }, lbl('① GitHub の Pull Request'), prEl, lbl('② 手元のターミナル'), term, nextBox),
            h('div', { class: 'col' }, lbl('③ 手元のエディタ（index.html）'), edEl,
              h('div', { class: 'cgc-note' }, icon('user-check'), h('span', { html: '<b>どちらが正しいかは、人が決める。</b>迷ったら、変更した同僚に聞こう。<b>HEAD ＝ いま自分の枝にある内容</b>、下側 ＝ main から来た内容。' })))));
          el.append(h('div', { class: 'cgc-note', style: { '--c': 'var(--ts)' } }, icon('shield-check'), h('span', { html: '<b>ふだんの予防</b>：PR は<b>小さく</b>保つ ／ <code>git pull</code> で main を<b>こまめに</b>取り込む ／ 同じファイルを触るときは<b>先に声をかける</b>。衝突は、減らせる。' })));
        },
      },
      { t: 'GitHub と SSH でつなぐ', tag: 'SSH', lead: 'パスワードの代わりに<b>鍵のペア</b>で本人確認。<b>秘密鍵</b>はPCから出さず、<b>公開鍵</b>だけGitHubに渡します。',
        render(el) {
          const ssh = h('div', { class: 'cg-ssh' });
          const pc = h('div', { class: 'bx' }, h('big', '💻'), h('b', 'あなたのPC'), h('div', { class: 'tag', style: { opacity: 0 } }, '🔒 秘密鍵'));
          const gh = h('div', { class: 'bx' }, h('big', '🐙'), h('b', 'GitHub'), h('div', { class: 'tag', style: { opacity: 0 } }, '🗝️ 登録済み'));
          const pk = h('div', { class: 'k' }, '🗝️'), dice = h('div', { class: 'k', style: { top: '40px' } }, '🎲');
          ssh.append(pc, gh, pk, dice);
          const cmds = ['ssh-keygen -t ed25519 -C "you@example.com"', 'eval "$(ssh-agent -s)"\nssh-add --apple-use-keychain ~/.ssh/id_ed25519', 'pbcopy < ~/.ssh/id_ed25519.pub', 'GitHub → Settings → SSH and GPG keys → New SSH key → 貼り付け', 'ssh -T git@github.com'];
          const cb = h('div');
          const OUT = [
            ['Generating public/private ed25519 key pair.', 'Your identification has been saved in ~/.ssh/id_ed25519', 'Your public key has been saved in ~/.ssh/id_ed25519.pub'],
            ['Agent pid 4821', 'Identity added: ~/.ssh/id_ed25519 (you@example.com)'],
            ['（何も表示されない）', '→ 公開鍵がクリップボードに入った。貼り付け先は次の手順'],
            ['✓ 新しい SSH key が登録された', '  Title: my-mac   Type: Authentication Key'],
            ['Hi your-name! You\'ve successfully authenticated,', 'but GitHub does not provide shell access.', '→ 本人確認 OK！'],
          ];
          const OCMD = ['ssh-keygen -t ed25519', 'ssh-add ~/.ssh/id_ed25519', 'pbcopy < ~/.ssh/id_ed25519.pub', 'GitHub に公開鍵を貼り付け', 'ssh -T git@github.com'];
          const sshOut = fo1Out('実行結果'); let sshCur = 0;
          sshOut.onRun(() => sshOut.show(OCMD[sshCur], OUT[sshCur]));
          el.append(stepper({
            color: BASIC, steps: [
              { say: '① 鍵のペアを<b>つくる</b>。PCに <b>秘密鍵 🔒</b> と 公開鍵 🗝️ ができる。' }, { say: '② <b>ssh-agent</b> に秘密鍵を預ける。Mac はキーチェーンにも保存できるので、毎回パスフレーズを打たなくて済む。' }, { say: '③ <b>公開鍵</b>をクリップボードにコピー。（秘密鍵は絶対に共有しない！）' },
              { say: '④ 公開鍵を <b>GitHub に登録</b>。鍵が旅立つ 🗝️→🐙' }, { say: '⑤ 接続テスト：GitHub が「本当に鍵の持ち主？」と確かめる。秘密鍵がある人だけが通れて、<b>本人確認OK</b>！' }],
            init(vis) { vis.append(ssh, cb); },
            update(i) {
              pc.lastChild.style.opacity = i >= 0 ? 1 : 0; pk.style.opacity = i >= 0 ? 1 : 0;
              pk.style.left = i >= 3 ? '62%' : i >= 2 ? '30%' : '12%'; pk.style.top = '176px';
              gh.lastChild.style.opacity = i >= 3 ? 1 : 0; gh.classList.toggle('ok', i >= 4);
              dice.style.opacity = i >= 4 ? 1 : 0; dice.style.left = i >= 4 ? '38%' : '60%';
              cb.replaceChildren(h('div', { style: { marginTop: '10px' } }, code(cmds[i], 'sh', { color: BASIC }), sshOut));
              sshCur = i; sshOut.show(OCMD[i], OUT[i]);
              if (i === 4) { pc.classList.add('ok'); } else pc.classList.remove('ok');
            },
          }));
        },
      },
      { t: '実践：コマンドを組み立てよう', tag: 'PRACTICE', lead: '本物の Git に近い<b>練習場</b>です。コマンドを<b>自分で打って</b>、現場でよくある場面をこなそう。状態で自動チェックされます。',
        render(el) {
          style('cgp', `
          .cgp-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
          .cgp-tab{all:unset;cursor:pointer;display:flex;align-items:center;gap:.5em;padding:.5em 1em;border-radius:8px;font-weight:800;font-size:.875rem;background:var(--card);border:1px solid var(--line);transition:.2s}
          .cgp-tab small{display:block;font-weight:600;color:var(--mute);font-size:.75rem}.cgp-tab .ic{color:var(--c)}.cgp-tab:hover{transform:translateY(-2px)}
          .cgp-tab.on{background:color-mix(in srgb,var(--c) 22%,var(--card));border-color:var(--c)}
          .cgp-story{display:flex;gap:.7em;align-items:flex-start;padding:.7em 1em;border-radius:10px;border:1px dashed var(--c);background:color-mix(in srgb,var(--c) 10%,transparent);font-size:.875rem;line-height:1.8;margin-bottom:12px}
          .cgp-story .ic{width:20px;height:20px;flex:none;margin-top:3px;color:var(--c)}
          .cgp-gh{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px;font-size:.875rem}.cgp-gh b{display:inline-flex;align-items:center;gap:.3em}.cgp-gh .ic{width:16px;height:16px}
          .cgp-msg{min-height:1.6em;font-size:.875rem;color:var(--mute);margin-top:6px;line-height:1.6}
          .cgp-repo{border:1px solid var(--line);border-radius:10px;background:var(--card);padding:12px 14px;font-size:.8125rem;display:grid;gap:10px}
          .cgp-repo h5{font-size:.75rem;letter-spacing:.06em;color:var(--mute);margin:0 0 4px;font-weight:800;display:flex;align-items:center;gap:.4em}.cgp-repo h5 .ic{width:14px;height:14px}
          .cgp-repo .br{display:inline-flex;gap:.4em;align-items:center;padding:.1em .7em;border-radius:6px;background:var(--pink);color:#fff;font:700 .8125rem var(--mono)}
          .cgp-repo ul{list-style:none;margin:0;padding:0;font:.8125rem/1.7 var(--mono)}.cgp-repo li{display:flex;gap:.6em;flex-wrap:wrap}.cgp-repo li code{color:var(--mute)}
          .cgp-repo .dc{color:var(--violet);font-weight:700}.cgp-repo .st-n{color:var(--ok)}.cgp-repo .st-m{color:#ffb454}.cgp-repo .st-u{color:var(--bad)}.cgp-repo .none{color:var(--mute)}
          .cgp-repo .rb{display:flex;gap:.6em;flex-wrap:wrap;align-items:center}.cgp-repo .rb .tag{padding:.05em .6em;border-radius:6px;border:1px dashed var(--basic);color:var(--basic);font:700 .75rem var(--mono)}.cgp-repo .rb .tag.old{border-color:#ffb454;color:#ffb454}
          .cgp-ms .task .task-l{flex-wrap:wrap}.cgp-ms .hn{margin:2px 0 8px 2.4em;font-size:.8125rem;color:var(--mute);line-height:1.7}.cgp-ms .hn code{background:var(--code);color:#d8dcff;padding:.05em .4em;border-radius:5px}
          .cgp-ms .acts{display:flex;gap:6px;margin-left:auto}
          `);
          const FILES = { 'index.html': '<h1>研修ナビ</h1>\n', 'README.md': '# app\n', 'style.css': 'h1 { color: #333; }\n' };
          const SC = [
            { id: 'feat', c: TS, ic: 'git-branch', t: '新機能をチームに出す', sub: '初級〜上級',
              story: 'あなたは「ログイン画面」の担当になった。出社したら、GitHub の main には同僚の変更が入っているらしい。<b>最新の main から枝を作って、PR で取り込んでもらおう</b>。',
              gh: ['merge:main', 'colleague:main'],
              seed(sim) { sim.seed({ commits: [{ msg: 'first commit', files: FILES, push: true }, { msg: 'README を整える', files: { 'README.md': '# app\nログインは未実装\n' }, push: true }], remoteOnly: [{ msg: '同僚: フッターを追加', files: { 'footer.html': '<footer>team</footer>\n' } }] }); },
              ms: [
                { lv: 1, l: 'GitHub の最新を取り込んで、手元の main を最新にする', ok: (s) => s.S.branches.main === s.S.remote.main, hint: '同僚の変更は GitHub の main にある。それを手元に取り込むコマンドは？', ans: 'git pull' },
                { lv: 1, l: 'feature/ で始まる名前の枝を作って、そこに移る', ok: (s) => s.S.head.startsWith('feature/'), hint: '枝を作って移動する 1 つのコマンドは <code>git checkout -b 名前</code>', ans: 'git checkout -b feature/login' },
                { lv: 2, l: 'その枝で、ファイルを変えて <b>2 回</b> commit する', ok: (s) => s.S.head.startsWith('feature/') && s.q.ahead(s.q.tip(), s.S.branches.main) >= 2, hint: '変更は <code>echo "..." &gt;&gt; index.html</code>（&gt;&gt; は追記）。そのあと add → commit を 2 回', ans: 'echo "<form></form>" >> index.html\ngit add index.html\ngit commit -m "ログインフォームを追加"\necho "<button>送信</button>" >> index.html\ngit add index.html\ngit commit -m "送信ボタンを追加"' },
                { lv: 2, l: 'GitHub に送る（次から git push だけで済むよう <code>-u</code> も付ける）', ok: (s) => s.S.head.startsWith('feature/') && s.S.remote[s.S.head] === s.q.tip() && s.S.upstream[s.S.head], hint: '<code>git push -u origin 枝の名前</code>', ans: 'git push -u origin feature/login' },
                { lv: 3, l: '上の「GitHub」ボタンで PR を Merge したあと、手元の main を最新にして、変更を手に入れる', ok: (s) => { const f = s.S.lastPush; return !!f && s.S.branches[f] && s.q.isAnc(s.S.branches[f], s.S.remote.main) && s.S.branches.main === s.S.remote.main && s.q.isAnc(s.S.branches[f], s.S.branches.main); }, hint: 'GitHub で Merge しても、手元の main は古いまま。<code>git checkout main</code> → <code>git pull</code>', ans: '# 上の「PR を Merge」ボタンを押したあと\ngit checkout main\ngit pull' },
              ] },
            { id: 'hot', c: PINK, ic: 'flame', t: '本番の不具合（hotfix）', sub: '初級〜上級',
              story: '本番で「ログイイン画面」と<b>誤字</b>が出ていると連絡が来た。develop には開発中の変更が入っていて、まだ出せない。<b>main から枝を作って直し、develop にも同じ修正を入れよう</b>。',
              gh: ['merge:main', 'merge:develop'],
              seed(sim) { sim.seed({ commits: [{ msg: 'first commit', files: { 'index.html': '<h1>ログイイン画面</h1>\n', 'README.md': '# app\n' }, push: true }, { msg: 'dev: 検索機能（開発中）', files: { 'search.html': '<input>\n' }, branch: 'develop', push: true }], head: 'main' }); },
              ms: [
                { lv: 1, l: '<b>main から</b> hotfix/ で始まる枝を作って、そこに移る', ok: (s) => s.S.head.startsWith('hotfix/') && s.q.isAnc(s.S.branches.main, s.q.tip()) && !s.q.isAnc(s.S.branches.develop, s.q.tip()), hint: 'いまは main にいる。そのまま <code>git checkout -b hotfix/名前</code>（develop の開発中の変更は含めない）', ans: 'git checkout -b hotfix/login-typo' },
                { lv: 1, l: '誤字（ログイイン）を直して commit する', ok: (s) => { const h = s.S.head.startsWith('hotfix/') && s.q.ahead(s.q.tip(), s.S.branches.main) >= 1; const t = s.q.headTree()['index.html'] || ''; return h && /ログイン/.test(t) && !/ログイイン/.test(t); }, hint: '<code>echo "<h1>…</h1>" &gt; index.html</code> で書き換え（&gt; は上書き）→ add → commit', ans: 'echo "<h1>ログイン画面</h1>" > index.html\ngit add index.html\ngit commit -m "fix: ログインの誤字を修正"' },
                { lv: 2, l: '修正を GitHub に送る', ok: (s) => s.S.head.startsWith('hotfix/') && s.S.remote[s.S.head] === s.q.tip(), hint: '新しい枝の最初の push は <code>-u origin 枝名</code>', ans: 'git push -u origin hotfix/login-typo' },
                { lv: 2, l: '「GitHub」ボタンで PR を <b>main</b> に Merge →（本番に反映）→ 手元の main も最新にする', ok: (s) => { const f = s.S.lastPush; return !!f && s.q.isAnc(s.S.branches[f] || '', s.S.remote.main) && s.S.branches.main === s.S.remote.main && /ログイン画面/.test((s.q.C(s.S.branches.main).tree['index.html']) || ''); }, hint: 'ボタンを押す → <code>git checkout main</code> → <code>git pull</code>', ans: '# 「PR を Merge（→ main）」を押したあと\ngit checkout main\ngit pull' },
                { lv: 3, l: '<b>同じ修正を develop にも</b>入れる（「PR を Merge（→ develop）」ボタン）', ok: (s) => { const f = s.S.lastPush; return !!f && s.q.isAnc(s.S.branches[f] || '', s.S.remote.develop); }, hint: '忘れると、次のリリースで誤字が復活する。develop にも PR を Merge しよう', ans: '# GitHub の「PR を Merge（→ develop）」ボタン' },
              ] },
            { id: 'oops', c: VIO, ic: 'undo-2', t: '間違えた（まだ push 前）', sub: 'amend / reset',
              story: 'ログイン画面を commit したあとで、<b>メッセージに誤字（typoo）</b>と<b>デバッグ用の console.log</b>に気づいた。まだ push していないので、<b>履歴を作り直して</b>OK。',
              gh: [],
              seed(sim) { sim.seed({ commits: [{ msg: 'first commit', files: { 'index.html': '<h1>研修ナビ</h1>\n', 'README.md': '# app\n' }, push: true }, { msg: 'ログイン画面をつくる（typoo）', files: { 'login.html': '<form></form>\nconsole.log("debug")\n' }, branch: 'feature/login' }], head: 'feature/login' }); sim.S.marks = { base: sim.S.branches.main }; },
              ms: [
                { lv: 1, l: '直前の commit の<b>メッセージ</b>の誤字を直す（commit の数は増やさない）', ok: (s) => { const c = s.q.C(s.q.tip()); return c.parents[0] === s.S.marks.base && /ログイン画面/.test(c.msg) && !/typoo/.test(c.msg); }, hint: '直前の commit を作り直す: <code>git commit --amend -m "新しいメッセージ"</code>', ans: 'git commit --amend -m "ログイン画面をつくる"' },
                { lv: 2, l: '直前の commit を<b>取り消して</b>、変更は<b>ステージに残す</b>', ok: (s) => s.q.tip() === s.S.marks.base && s.S.index['login.html'] !== undefined, hint: '<code>git reset --soft HEAD~1</code>（HEAD~1 ＝ ひとつ前）。soft は変更を残す', ans: 'git reset --soft HEAD~1' },
                { lv: 3, l: 'console.log を<b>消して</b>、正しいメッセージで commit し直す', ok: (s) => { const c = s.q.C(s.q.tip()); const f = c.tree['login.html'] || ''; return c.parents[0] === s.S.marks.base && f.length > 0 && !/console\.log/.test(f) && !/typoo/.test(c.msg); }, hint: 'reset --soft で戻す → <code>echo "…" &gt; login.html</code> で書き直す → add → commit', ans: 'git reset --soft HEAD~1\necho "<form></form>" > login.html\ngit add login.html\ngit commit -m "ログイン画面をつくる"' },
              ] },
            { id: 'revert', c: BASIC, ic: 'rotate-ccw', t: '間違えた（push 済み）', sub: 'revert',
              story: '<b>デバッグを有効にした commit</b>を、もう GitHub に push してしまった。他の人もそれを pull しているかもしれない。<b>履歴を書き換えず</b>に取り消そう。',
              gh: [],
              seed(sim) { sim.seed({ commits: [{ msg: 'first commit', files: { 'index.html': '<h1>研修ナビ</h1>\n', 'config.js': 'DEBUG=false\n' }, push: true }, { msg: 'デバッグを有効にした', files: { 'config.js': 'DEBUG=true\n' }, push: true }, { msg: '見出しを変更', files: { 'index.html': '<h1>研修ナビ 2</h1>\n' }, push: true }] }); sim.S.marks = { bad: sim.q.rev('HEAD~1') }; },
              ms: [
                { lv: 1, l: 'git log で履歴を見て、問題の commit（デバッグを有効にした）を探す', ok: (s) => !!s.S.did.log, hint: '<code>git log --oneline</code> が短くて見やすい', ans: 'git log --oneline' },
                { lv: 2, l: '問題の commit を <b>revert</b> で取り消す（元の commit は残る）', ok: (s) => /DEBUG=false/.test(s.q.headTree()['config.js'] || '') && s.q.isAnc(s.S.marks.bad, s.q.tip()) && [...s.q.ancestors(s.q.tip())].some((x) => /^Revert/.test(s.q.C(x).msg)), hint: '<code>git revert 問題のハッシュ</code>。履歴は消さず、取り消す commit が 1 つ増える', ans: (s) => 'git log --oneline\ngit revert ' + s.S.marks.bad },
                { lv: 3, l: '取り消した結果を GitHub に送る', ok: (s) => s.S.remote.main === s.q.tip() && [...s.q.ancestors(s.q.tip())].some((x) => /^Revert/.test(s.q.C(x).msg)), hint: '<code>git push</code>。push 済みの履歴は reset ではなく revert で直す（他の人の履歴を壊さない）', ans: 'git push' },
              ] },
          ];
          const wrap = h('div'), tabs = h('div', { class: 'cgp-tabs' }), body = h('div');
          let cur = null;
          const open = (id) => {
            const S0 = SC.find((x) => x.id === id);
            tabs.querySelectorAll('.cgp-tab').forEach((t) => t.classList.toggle('on', t.dataset.k === id));
            const root = { t: 'd', c: {} };
            const sim = makeGitSim(root); sim.q = { ahead: (a, b) => [...sim.ancestors(a)].filter((x) => !sim.ancestors(b).has(x)).length, tip: sim.tip, C: sim.C, isAnc: (a, b) => sim.ancestors(b).has(a), ancestors: sim.ancestors, headTree: sim.headTree, work: sim.work, rev: sim.rev };
            S0.seed(sim); sim.S.did = {}; sim.S.maxStash = 0;
            const done = S0.ms.map(() => false); let fired = false;
            const repo = h('div', { class: 'cgp-repo' }), msEl = h('div', { class: 'tasks cgp-ms' }), ghMsg = h('div', { class: 'cgp-msg' });
            let ready = false;
            const term = makeTerm(() => { if (ready) update(); }, { fs: root, git: sim });
            const lvChip = (n) => h('span', { class: 'lv lv' + n }, Array.from({ length: n }, () => icon('star')), ['初級', '中級', '上級'][n - 1]);
            const hintOpen = {};
            function update() {
              const sn = sim.snapshot(); const c = sn.c;
              S0.ms.forEach((m, i) => { if (!done[i]) { try { done[i] = !!m.ok(sim); } catch { done[i] = false; } } });
              const li = (arr, cls) => arr.length ? h('ul', arr.map(([k, p]) => h('li', h('span', { class: cls }, k), h('span', p)))) : h('div', { class: 'none' }, 'なし');
              repo.replaceChildren(
                h('div', null, h('h5', icon('git-branch'), 'いまの枝'), h('span', { class: 'br' }, 'HEAD → ' + sn.head)),
                h('div', null, h('h5', icon('file-diff'), 'ファイルの状態'),
                  c.staged.length || c.unstaged.length || c.untracked.length ? h('ul', [...c.staged.map(([k, p]) => h('li', h('span', { class: 'st-n' }, 'ステージ済み'), h('span', k + '：' + p))), ...c.unstaged.map(([k, p]) => h('li', h('span', { class: 'st-m' }, '変更あり（未 add）'), h('span', k + '：' + p))), ...c.untracked.map((p) => h('li', h('span', { class: 'st-u' }, '未追跡'), h('span', p)))]) : h('div', { class: 'none' }, 'きれい（変更なし）')),
                h('div', null, h('h5', icon('history'), '履歴（新しい順）'), h('ul', sn.log.map((x) => h('li', h('code', x.id), h('span', x.msg), x.d ? h('span', { class: 'dc' }, x.d.trim()) : null)))),
                h('div', null, h('h5', icon('github-mark'), 'GitHub（origin）の枝'), h('div', { class: 'rb' }, sn.rem.map((r) => h('span', { class: 'tag' + (r.behind ? ' old' : ''), 'data-tip': r.behind ? '手元はまだ知らない更新がある（git pull で取り込む）' : null }, r.b + ' ' + r.id)))));
              msEl.replaceChildren(h('div', { class: 'mission-head' }, icon('list-checks'), h('b', 'ミッション'), h('span', { class: 'mission-n' }, done.filter(Boolean).length + ' / ' + done.length), h('i', { class: 'mission-bar' }, h('u', { style: { width: (done.filter(Boolean).length / done.length) * 100 + '%' } }))),
                ...S0.ms.map((m, i) => h('div', null,
                  h('div', { class: 'task' + (done[i] ? ' ok' : '') }, h('i', done[i] ? '✓' : ''), h('span', { class: 'task-l' }, lvChip(m.lv), h('span', { html: m.l })),
                    h('span', { class: 'acts' },
                      h('button', { class: 'btn ghost', style: { padding: '.2em .7em' }, onclick: () => { hintOpen[i] = !hintOpen[i]; update(); } }, icon('lightbulb'), 'ヒント'),
                      h('button', { class: 'btn ghost', style: { padding: '.2em .7em' }, onclick: () => K.W.modal({ title: '答え', icon: 'key-round', content: () => h('div', null, h('p', { style: { color: 'var(--mute)', fontSize: '.875rem', marginBottom: '.8em' } }, '答えは1つとは限りません。まず自分で試してから見よう。'), code(typeof m.ans === 'function' ? m.ans(sim) : m.ans, 'sh', { file: 'terminal' })) }) }, icon('key-round'), '答え'))))));
              if (done.every(Boolean) && !fired) { fired = true; celebrate(); }
            }
            const ghBar = h('div', { class: 'cgp-gh' });
            if (S0.gh.length) {
              ghBar.append(h('b', icon('github-mark'), 'GitHub の操作'));
              S0.gh.forEach((g) => { const [k, dst] = g.split(':');
                ghBar.append(k === 'merge'
                  ? h('button', { class: 'btn', onclick: () => { const src = sim.S.lastPush; const r = src ? sim.ghMerge(src, dst) : { ok: false, msg: 'まず枝を push して GitHub に送ろう' }; ghMsg.textContent = r.msg; term.say ? 0 : 0; update(); } }, icon('git-pull-request'), 'PR を Merge（→ ' + dst + '）')
                  : h('button', { class: 'btn', onclick: () => { const r = sim.ghColleague(dst); ghMsg.textContent = r.msg; update(); } }, icon('user'), '同僚が ' + dst + ' を更新'));
              });
            }
            body.replaceChildren(h('div', { class: 'cgp-story', style: { '--c': S0.c } }, icon('user'), h('div', { html: '<b>場面</b>：' + S0.story })),
              h('div', { class: 'split' },
                h('div', { class: 'col' }, lbl('ターミナル（本物のように打とう）'), term.el, ghBar, ghMsg),
                h('div', { class: 'col' }, lbl('リポジトリの様子（リアルタイム）'), repo)),
              h('div', { style: { height: '10px' } }), msEl,
              h('div', { class: 'row', style: { marginTop: '8px' } }, btn('⟲ この場面をはじめから', () => open(id), 'ghost')));
            wrap.style.setProperty('--c', S0.c); ready = true; update();
          };
          SC.forEach((x) => tabs.append(h('button', { class: 'cgp-tab', 'data-k': x.id, style: { '--c': x.c }, onclick: () => open(x.id) }, icon(x.ic), h('div', x.t, h('small', x.sub)))));
          wrap.append(tabs, body); el.append(wrap); open('feat');
        },
      },
    ],
  });

  /* ============================================================
     CSS
  ============================================================ */
  /* ============================================================
     CSS: 現場の症状 → 直すと見た目がどう変わるか（ライブページ）
  ============================================================ */
  const SYM = (() => {
    style('cgz', `
    .cgz{border:1px solid var(--line);border-radius:10px;background:var(--card);padding:14px;margin-bottom:16px;display:grid;gap:10px}
    .cgz .sym{display:flex;gap:.7em;align-items:flex-start;font-size:.875rem;line-height:1.8}.cgz .sym .ic{width:20px;height:20px;flex:none;margin-top:3px;color:var(--bad)}.cgz.fixed .sym .ic{color:var(--ok)}
    .cgz .cols{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:12px;align-items:start}@media(max-width:820px){.cgz .cols{grid-template-columns:1fr}}
    .cgz iframe{width:100%;border:1px solid var(--line);border-radius:8px;background:#fff;display:block}
    .cgz pre{margin:0;padding:10px 12px;border-radius:8px;background:var(--code);color:#d8dcff;font:.8125rem/1.7 var(--mono);white-space:pre-wrap;overflow:auto}
    .cgz pre .add{background:rgba(111,220,124,.2);display:block;border-left:3px solid var(--ok);margin-left:-12px;padding-left:9px}
    .cgz pre .bd{background:rgba(255,107,157,.16);display:block;border-left:3px solid var(--bad);margin-left:-12px;padding-left:9px}
    .cgz .bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.cgz .cap{font-size:.8125rem;color:var(--mute);line-height:1.7}
    `);
    const BASE = 'body{margin:0;padding:14px;font:14px/1.7 system-ui,"Hiragino Sans",sans-serif;color:#1f2937;background:#fff}h2,h3{margin:0 0 .4em}p{margin:0 0 .6em}';
    const lines = (t, cls) => t.split('\n').map((l) => (l.trim().startsWith('/*+') || /\/\*\+\*\/\s*$/.test(l) ? h('span', { class: 'add' }, l.replace(/\s*\/\*\+\*\/\s*$/, '')) : /\/\*-\*\/\s*$/.test(l) ? h('span', { class: 'bd' }, l.replace(/\s*\/\*-\*\/\s*$/, '')) : l + '\n'));
    /* o: { sym, ok, html, bad, good, h, btn:[直す, 戻す], cap, act:{label, fn(doc)} } */
    function make(o) {
      let fixed = false;
      const root = h('div', { class: 'cgz' }), sym = h('div', { class: 'sym' }), frame = h('iframe', { sandbox: 'allow-same-origin', title: 'ライブページ', style: { height: (o.h || 200) + 'px' } }), pre = h('pre'), cap = h('div', { class: 'cap' });
      const toggle = h('button', { class: 'btn primary', onclick: () => { fixed = !fixed; draw(); } });
      const act = o.act ? h('button', { class: 'btn', onclick: () => { try { o.act.fn(frame.contentDocument); } catch (e) { /* ignore */ } } }, icon('mouse-pointer-click'), o.act.label) : null;
      function draw() {
        root.classList.toggle('fixed', fixed);
        const css = fixed ? o.good : o.bad, clean = css.replace(/\/\*[+-]\*\//g, '');
        const live = frame.contentDocument && frame.contentDocument.getElementById('u');
        if (live && frame.dataset.ready === '1') {
          /* 同じページのまま CSS だけ差し替えて、動いた要素を滑らせる（FLIP）。変化が目で追える */
          const d = frame.contentDocument, els = [...d.body.querySelectorAll('*')], before = els.map((e) => e.getBoundingClientRect());
          live.textContent = clean;
          els.forEach((e, i) => { const a = before[i], b = e.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top; if (Math.abs(dx) + Math.abs(dy) > 0.5 && e.animate) e.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.3,1.1,.4,1)' }); });
        } else {
          frame.onload = () => { frame.dataset.ready = '1'; };
          frame.srcdoc = '<!doctype html><meta charset="utf-8"><style>' + BASE + '*{transition:background-color .45s,color .45s,border-color .45s,box-shadow .45s,opacity .45s}</style><style id="u">' + clean + '</style>' + o.html;
        }
        pre.replaceChildren(...lines(css));
        sym.replaceChildren(icon(fixed ? 'circle-check' : 'circle-alert'), h('div', { html: fixed ? o.ok : o.sym }));
        toggle.replaceChildren(icon(fixed ? 'rotate-ccw' : 'wrench'), fixed ? '元に戻す' : '直してみる');
        cap.innerHTML = fixed ? (o.cap || '') : '';
      }
      draw();
      root.append(sym, h('div', { class: 'cols' }, h('div', null, lbl('ライブページ（本物の CSS で表示）'), frame), h('div', null, lbl('style.css'), htmlToggle(o.html), pre)), h('div', { class: 'bar' }, toggle, act), cap);
      return root;
    }
    const D = {
      attach: () => {
        const mk = (inline) => h('div', { style: { flex: 1, minWidth: 0 } }, lbl(inline ? 'style 属性で書いた3ページ' : 'style.css 1つで書いた3ページ'));
        const root = h('div', { class: 'cgz' }), sym = h('div', { class: 'sym' }), cap = h('div', { class: 'cap' });
        let changed = false;
        const pages = ['相談フォーム', '料金表', '案件一覧'];
        const btnOf = (c) => h('span', { style: { display: 'inline-block', background: c, color: '#fff', borderRadius: '8px', padding: '.45em 1.1em', fontWeight: 700, fontSize: '.8125rem' } }, '申込む');
        const col = (inline) => { const box = mk(inline); const g = h('div', { style: { display: 'grid', gap: '8px' } }); box.append(g); return { box, g, inline }; };
        const A = col(true), B = col(false);
        const draw = () => {
          [A, B].forEach((X) => X.g.replaceChildren(...pages.map((t, i) => h('div', { style: { background: '#fff', color: '#1f2937', borderRadius: '8px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '.8125rem', fontWeight: 700 } }, t, btnOf(changed && (!X.inline || i === 0) ? '#2563eb' : '#ef4444')))));
          sym.replaceChildren(icon(changed ? 'circle-alert' : 'circle-help'), h('div', { html: changed ? '左は<b>1か所直しただけ</b>。残り2ページは<b>赤のまま</b>（直し忘れ）。右は style.css の1行を変えただけで<b>全ページ</b>が変わった。' : 'ブランドカラーを<b>赤 → 青</b>に変えることになった。ボタンは3ページにある。さあ、どちらが楽？' }));
          cap.innerHTML = changed ? '実際のサイトは数十ページ。<b>「1か所を直せば全部変わる」</b>のが、外部 CSS（<code>&lt;link&gt;</code>）の価値。' : '';
        };
        const go = h('button', { class: 'btn primary', onclick: () => { changed = !changed; go.replaceChildren(icon(changed ? 'rotate-ccw' : 'palette'), changed ? '元に戻す' : 'ブランドカラーを青に変える'); draw(); } }, icon('palette'), 'ブランドカラーを青に変える');
        root.append(sym, h('div', { style: { display: 'flex', gap: '12px', flexWrap: 'wrap' } }, A.box, B.box), h('div', { class: 'bar' }, go), cap); draw();
        return root;
      },
      font: () => make({
        h: 190, sym: '料金の説明文が<b>ぎっしり・薄い・小さい</b>。どこが大事か分からず、<b>誰も読まない</b>。', ok: '<b>読みやすくなった。</b>大きさ・行間・色の3つを直しただけ。',
        html: '<h2>相談料金のご案内</h2><p>初回のご相談は30分まで無料です。以降は30分ごとに5,000円（税込）です。書面の作成が必要な場合は別途お見積りとなります。お支払いはクレジットカードまたは銀行振込をご利用いただけます。</p>',
        bad: 'h2 { font-size: 13px; }       /*-*/\np  { font-size: 11px;        /*-*/\n     line-height: 1.1;       /*-*/\n     color: #b0b0b0; }       /*-*/',
        good: 'h2 { font-size: 22px; }       /*+*/\np  { font-size: 15px;        /*+*/\n     line-height: 1.8;       /*+*/\n     color: #374151; }       /*+*/',
        cap: '見出しは大きく、本文は <code>line-height: 1.7〜1.8</code>、文字色は<b>背景と差をつける</b>。これだけで読みやすさが大きく変わる。',
      }),
      box: () => make({
        h: 150, sym: '料金プラン <b>3枚を横一列</b>（幅 33.3% × 3）にしたのに、padding と border を付けたら、<b>3枚目が下に落ちた</b>。', ok: '<b>3枚が1列に収まった。</b>1行足しただけ。',
        html: '<div class="plans"><div class="plan"><b>ライト</b><br>5,000円</div><div class="plan"><b>スタンダード</b><br>12,000円</div><div class="plan"><b>プレミアム</b><br>30,000円</div></div>',
        bad: '.plan {\n  float: left;\n  width: 33.33%;\n  padding: 16px;     /*-*/\n  border: 2px solid #94a3b8;  /*-*/\n  background: #f1f5f9;\n}',
        good: '.plan {\n  box-sizing: border-box;  /*+*/\n  float: left;\n  width: 33.33%;\n  padding: 16px;\n  border: 2px solid #94a3b8;\n  background: #f1f5f9;\n}',
        cap: '初期値（content-box）は <b>width ＋ padding ＋ border</b> が実際の幅。<code>box-sizing: border-box</code> なら <b>width の中に padding と border を含める</b>ので、計算が合う。現場ではほぼ全サイトで指定する。',
      }),
      display: () => make({
        h: 190, sym: 'ナビのリンクに <code>padding</code> を付けたのに、<b>上下が上の文章に重なって</b>、押せる範囲もずれる。', ok: '<b>リンクが箱になった。</b>上下の余白が正しく効き、押しやすい範囲も広がった。',
        html: '<p>無料相談はこちらから（この文章が重なると困る）</p><nav><a href="#">案件</a><a href="#">相談</a><a href="#">料金</a></nav><p style="margin-top:8px">ナビの下の文章</p>',
        bad: 'nav a {\n  padding: 14px 18px;\n  background: #dbeafe;\n  margin-right: 6px;\n  /* a は inline → 上下の padding は\n     まわりの行を押しのけない */  /*-*/\n}',
        good: 'nav a {\n  display: inline-block;  /*+*/\n  padding: 14px 18px;\n  background: #dbeafe;\n  margin-right: 6px;\n}',
        cap: 'a や span は初期値が <code>inline</code>。<b>縦の余白や幅・高さを効かせたい</b>ときは <code>inline-block</code>（横に並べたい）か <code>block</code>（1行使う）にする。',
      }),
      flex: () => make({
        h: 150, sym: 'ヘッダーで、<b>ロゴは左・ログインは右</b>、<b>全部を縦の中央</b>にしたい。でも<b>全部が左に固まって</b>、高さもばらばら。', ok: '<b>きれいに並んだ。</b>親に3行書いただけ。',
        html: '<header><span class="logo">案件管理</span><nav><a>案件</a><a>相談</a><a>料金</a></nav><button>ログイン</button></header>',
        bad: 'header {\n  background: #1e293b; color: #fff; padding: 10px 14px;\n  /* 並べ方を決めていない */  /*-*/\n}\n.logo { font-weight: 700; }\nnav { display: inline-block; margin-left: 20px; }\nnav a { margin-right: 12px; }\nbutton { padding: 12px 14px; }',
        good: 'header {\n  display: flex;  /*+*/\n  justify-content: space-between;  /*+*/\n  align-items: center;  /*+*/\n  background: #1e293b; color: #fff; padding: 10px 14px;\n}\n.logo { font-weight: 700; }\nnav a { margin-right: 12px; }\nbutton { padding: 12px 14px; }',
        cap: '並べ方は<b>親に書く</b>。<code>justify-content</code>＝横（主軸）の配置、<code>align-items</code>＝縦（交差軸）の揃え。margin や float で頑張らない。',
      }),
      position: () => make({
        h: 130, sym: '通知アイコンの<b>右上に未読の赤い数字</b>を重ねたい。でも、<b>文字の横に並んでしまう</b>。', ok: '<b>右上に重なった。</b>親を基準にして、ずらしただけ。',
        html: '<div style="padding:18px 24px"><div class="bell">通知<span class="badge">3</span></div></div>',
        bad: '.bell {\n  display: inline-block;\n  padding: 10px 18px;\n  background: #e2e8f0;\n  border-radius: 8px;\n}\n.badge {\n  background: #ef4444; color: #fff;\n  border-radius: 999px; padding: 0 7px;\n  font-size: 12px;\n}',
        good: '.bell {\n  position: relative;  /*+*/\n  display: inline-block;\n  padding: 10px 18px;\n  background: #e2e8f0;\n  border-radius: 8px;\n}\n.badge {\n  position: absolute;  /*+*/\n  top: -8px; right: -8px;  /*+*/\n  background: #ef4444; color: #fff;\n  border-radius: 999px; padding: 0 7px;\n  font-size: 12px;\n}',
        cap: '<b>親に relative（基準）、子に absolute（位置）</b>の2点セット。親に relative を付け忘れると、画面の端が基準になってしまう。',
      }),
      sticky: () => make({
        h: 220, sym: '固定ヘッダーを付けたら、目次の<b>「料金」リンクで飛んだ見出しが、ヘッダーの下に隠れた</b>。', ok: '<b>見出しが見えた。</b>ヘッダーの高さぶん、止まる位置をずらした。',
        html: '<header class="hd">案件管理（固定ヘッダー）</header><div style="height:90px"></div><h3 id="intro">はじめに</h3><p>説明の文章…</p><div style="height:120px"></div><h3 id="price" class="t">料金</h3><p>ここが「料金」の本文です。</p><div style="height:160px"></div>',
        bad: '.hd {\n  position: fixed;\n  top: 0; left: 0; right: 0;\n  background: #1e293b; color: #fff;\n  padding: 12px 14px;\n}',
        good: '.hd {\n  position: fixed;\n  top: 0; left: 0; right: 0;\n  background: #1e293b; color: #fff;\n  padding: 12px 14px;\n}\n.t {\n  scroll-margin-top: 56px;  /*+*/\n}',
        cap: '固定ヘッダーの高さぶん、見出しに <code>scroll-margin-top</code> を付ける。アンカーリンクで飛んだとき、<b>見出しが隠れない</b>。',
        act: { label: '「料金」へジャンプ', fn: (d) => d.getElementById('price').scrollIntoView() },
      }),
      z: () => make({
        h: 190, sym: '「送信しました」の<b>モーダルを出したのに、固定ヘッダーの下に隠れた</b>。', ok: '<b>モーダルが手前に出た。</b>z-index の数字を、ヘッダーより大きくした。',
        html: '<header class="hd">案件管理（固定ヘッダー）</header><div style="padding:60px 14px 0"><p>本文の内容…</p><p>本文の内容…</p></div><div class="modal">送信しました</div>',
        bad: '.hd {\n  position: fixed; top: 0; left: 0; right: 0;\n  background: #1e293b; color: #fff; padding: 12px 14px;\n  z-index: 100;\n}\n.modal {\n  position: fixed; top: 6px; left: 30%;\n  background: #16a34a; color: #fff; padding: 10px 20px; border-radius: 8px;\n  z-index: 10;  /*-*/\n}',
        good: '.hd {\n  position: fixed; top: 0; left: 0; right: 0;\n  background: #1e293b; color: #fff; padding: 12px 14px;\n  z-index: 100;\n}\n.modal {\n  position: fixed; top: 6px; left: 30%;\n  background: #16a34a; color: #fff; padding: 10px 20px; border-radius: 8px;\n  z-index: 200;  /*+*/\n}',
        cap: 'z-index が<b>大きい方が手前</b>。現場では「ヘッダー 100・モーダル 200」のように<b>1か所に決めて</b>おくと、数字の取り合いにならない。',
      }),
    };
    D.make = make;
    return D;
  })();

  /* ============================================================
     CSS の各シーン：よく使う場面を「タブ」で見せる（1タブ = 1つの困りごと + ライブページ）
  ============================================================ */
  style('cgt', `
  .cgt-bar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
  .cgt-tab{all:unset;cursor:pointer;padding:.45em .95em;border-radius:8px;font-weight:800;font-size:.8125rem;background:var(--card);border:1px solid var(--line);transition:.2s;line-height:1.5}
  .cgt-tab:hover{transform:translateY(-2px)}
  .cgt-tab.on{background:color-mix(in srgb,var(--ts) 22%,var(--card));border-color:var(--ts);box-shadow:0 8px 20px -12px var(--ts)}
  .cgt-tab .n{display:inline-grid;place-items:center;width:1.5em;height:1.5em;margin-right:.45em;border-radius:50%;background:var(--card2);font-size:.75rem}
  .cgt-tab.on .n{background:var(--ts);color:#06101f}
  .cgt-more{margin-top:0}
  `);
  const IMG = (w, h, t) => 'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27' + w + '%27 height=%27' + h + '%27%3E%3Crect width=%27' + w + '%27 height=%27' + h + '%27 fill=%27%23bfdbfe%27/%3E%3Ctext x=%2712%27 y=%27' + Math.round(h / 2 + 5) + '%27 font-size=%2716%27 fill=%27%231e3a8a%27%3E' + encodeURIComponent(t) + '%3C/text%3E%3C/svg%3E';
  function caseTabs(list) {
    const root = h('div', { class: 'cgt' }), bar = h('div', { class: 'cgt-bar' }), body = h('div');
    const cache = {};
    const show = (i) => {
      bar.querySelectorAll('button').forEach((b, k) => b.classList.toggle('on', k === i));
      if (!cache[i]) { const it = list[i]; if (it.o) cache[i] = SYM.make(it.o); else if (it.el) cache[i] = it.el(); else { const c = h('div', { class: 'cgt-more' }); it.render(c); cache[i] = c; } }
      body.replaceChildren(cache[i]);
    };
    list.forEach((it, i) => bar.append(h('button', { class: 'cgt-tab', onclick: () => show(i) }, h('span', { class: 'n' }, i + 1), it.n)));
    root.append(bar, body);
    show(0);
    return root;
  }
  const CASES = {
    /* ---------- 文字のスタイル ---------- */
    font: () => [
      { n: '読みやすさ', el: () => SYM.font() },
      { n: '見出しと本文の強弱', o: {
        h: 190, sym: '見出しも本文も注意書きも、<b>同じ大きさ・同じ太さ</b>。どこから読めばいいか分からない。', ok: '<b>目が自然に流れる。</b>大きさ・太さ・色で「大事な順」をつけた。',
        html: '<h2>料金プラン</h2><p>初回30分は無料です。2回目以降は5,500円（税込）。</p><p class="note">※ キャンセルは前日まで無料です</p>',
        bad: 'h2 { font-size: 14px; font-weight: 400; }  /*-*/\np  { font-size: 14px; }\n.note { font-size: 14px; }                 /*-*/',
        good: 'h2 { font-size: 22px; font-weight: 700; }  /*+*/\np  { font-size: 14px; }\n.note { font-size: 12px; color: #64748b; } /*+*/',
        cap: '強弱は <code>font-size</code>（大きさ）と <code>font-weight</code>（太さ）と色の3つ。<b>大事なものほど大きく・太く、補足は小さく薄く</b>。' } },
      { n: 'リンクの見た目', o: {
        h: 150, sym: 'ナビのリンクが<b>青い下線だらけ</b>で、うるさい。メニューだと分かりにくい。', ok: '<b>すっきりした。</b>下線を消して、太字にした。マウスを乗せると下線が出る。',
        html: '<nav><a href="#">案件</a><a href="#">相談</a><a href="#">料金</a><a href="#">お問い合わせ</a></nav><p>本文の中のリンクは、<a href="#">こういう下線付き</a>のままがよい。</p>',
        bad: 'nav a { margin-right: 14px; }   /* 初期値のまま：青＋下線 */  /*-*/',
        good: 'nav a {\n  color: #1e293b;\n  text-decoration: none;   /*+*/\n  font-weight: 700;        /*+*/\n  margin-right: 18px;\n}\nnav a:hover { text-decoration: underline; }  /*+*/',
        cap: '<code>text-decoration: none</code> で下線を消す。ただし<b>本文中のリンクは下線を残す</b>（リンクだと分かるように）。' } },
      { n: '長い文字を省略', o: {
        h: 220, sym: '案件タイトルが長くて<b>2行に折り返し</b>、行の高さがバラバラ。一覧が見づらい。', ok: '<b>1行にそろった。</b>はみ出した分は「…」で省略される。',
        html: '<ul class="list"><li>労働問題：未払いの残業代を請求したいが、何から始めればよいか分からない</li><li>交通事故：示談金の金額が妥当か確認したい</li><li>相続：遺言書の書き方を教えてほしい</li></ul>',
        bad: '.list { width: 280px; padding: 0; list-style: none; }\n.list li { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; }  /*-*/',
        good: '.list { width: 280px; padding: 0; list-style: none; }\n.list li {\n  padding: 6px 8px; border-bottom: 1px solid #e2e8f0;\n  white-space: nowrap;      /*+*/\n  overflow: hidden;         /*+*/\n  text-overflow: ellipsis;  /*+*/\n}',
        cap: '省略は <b>3点セット</b>：<code>white-space: nowrap</code>（折り返さない）＋ <code>overflow: hidden</code>（はみ出しを隠す）＋ <code>text-overflow: ellipsis</code>（…を付ける）。' } },
      { n: '文字の揃え', o: {
        h: 180, sym: '料金の数字が<b>左揃え</b>で、桁がそろっていない。金額を見比べにくい。', ok: '<b>右にそろって</b>、桁が見比べやすくなった。',
        html: '<table><tr><td>初回相談</td><td class="p">0円</td></tr><tr><td>継続相談（30分）</td><td class="p">5,500円</td></tr><tr><td>書面の作成</td><td class="p">33,000円</td></tr></table>',
        bad: 'table { width: 100%; border-collapse: collapse; }\ntd { padding: 8px; border-bottom: 1px solid #e2e8f0; }\n.p { }   /* 揃えの指定なし */  /*-*/',
        good: 'table { width: 100%; border-collapse: collapse; }\ntd { padding: 8px; border-bottom: 1px solid #e2e8f0; }\n.p { text-align: right; }  /*+*/',
        cap: '数字（金額・件数）は<b>右揃え</b>、見出しやカードのタイトルは<b>中央または左</b>。<code>text-align</code> で決める。' } },
      { n: '色のコントラスト', o: {
        h: 150, sym: '薄いグレーの文字が<b>背景に溶けて</b>、読めない（スマホを屋外で見ると特に）。', ok: '<b>くっきり読める。</b>文字の色を濃くしただけ。',
        html: '<p class="a">営業時間：平日 10:00〜18:00</p><p class="b">※ 土日祝はお休みです</p>',
        bad: '.a { color: #cbd5e1; }   /*-*/\n.b { color: #94a3b8; }   /*-*/',
        good: '.a { color: #1e293b; }   /*+*/\n.b { color: #475569; }   /*+*/',
        cap: '文字と背景の明るさの差（<b>コントラスト比</b>）は <b>4.5 : 1 以上</b>が目安。薄い色は、おしゃれでも読めなければ意味がない。' } },
      { n: '図で確かめる', render: (c) => fontScene(c) },
    ],
    /* ---------- ボックスモデル ---------- */
    box: () => [
      { n: '余白の使い分け', o: {
        h: 330, sym: 'ボタンが<b>小さくて押しにくい</b>。しかも<b>カードどうしがくっついて</b>、文字も枠にぴったり。', ok: '<b>読みやすく、押しやすくなった。</b>padding（内側）と margin（外側）を足した。',
        html: '<div class="card"><h3>無料相談</h3><p>初回30分・オンライン</p><button>申込む</button></div><div class="card"><h3>電話相談</h3><p>平日 10〜18時</p><button>申込む</button></div>',
        bad: '.card {\n  background: #f1f5f9;\n  border: 1px solid #cbd5e1;\n  border-radius: 8px;\n  /* padding も margin も無い */  /*-*/\n}\nbutton {\n  background: #2563eb; color: #fff;\n  border: 0; border-radius: 6px;\n}',
        good: '.card {\n  background: #f1f5f9;\n  border: 1px solid #cbd5e1;\n  border-radius: 8px;\n  padding: 14px;        /*+*/\n  margin-bottom: 12px;  /*+*/\n}\nbutton {\n  background: #2563eb; color: #fff;\n  border: 0; border-radius: 6px;\n  padding: 10px 22px;   /*+*/\n}',
        cap: '<b>padding ＝ 枠の内側</b>（読みやすさ・押せる範囲）。<b>margin ＝ 枠の外側</b>（他の要素との距離）。迷ったら「枠の中なら padding、枠の外なら margin」。' } },
      { n: '幅が思った通りにならない', el: () => SYM.box() },
      { n: '中央に置く', o: {
        h: 200, sym: '記事の幅が<b>画面いっぱい</b>に広がって、1行が長すぎて読みにくい。しかも<b>中央に置きたい</b>。', ok: '<b>読みやすい幅になり、中央に収まった。</b>',
        html: '<article class="post"><h3>相談の流れ</h3><p>① フォームで申込　② 担当者から連絡　③ オンラインで相談。初回は30分無料です。文章が長くなるほど、横に広がりすぎると目で追いにくくなります。</p></article>',
        bad: '.post {\n  background: #f8fafc;\n  padding: 12px 16px;\n  border-radius: 8px;\n  /* 幅の上限も、中央寄せも無い */  /*-*/\n}',
        good: '.post {\n  background: #f8fafc;\n  padding: 12px 16px;\n  border-radius: 8px;\n  max-width: 320px;  /*+*/\n  margin: 0 auto;    /*+*/\n}',
        cap: '<code>max-width</code> で「これ以上広げない」、<code>margin: 0 auto</code> で「左右の余白を自動＝中央」。<b>幅が決まった block 要素</b>で効く（inline のままだと効かない）。' } },
      { n: '間隔と margin の落とし穴', o: {
        h: 230, sym: '各項目に <code>margin-bottom</code> を付けたら、<b>最後の項目の下にも余白</b>ができて、枠の下だけ間延びした。', ok: '<b>項目の「間」だけ</b>に余白が入った。',
        html: '<div class="box"><div class="item">案件A：契約書の確認</div><div class="item">案件B：内容証明の作成</div><div class="item">案件C：期日の調整</div></div>',
        bad: '.box { background: #eef2ff; padding: 12px; border-radius: 8px; }\n.item {\n  background: #fff; padding: 8px 12px; border-radius: 6px;\n  margin-bottom: 14px;  /*-*/\n}',
        good: '.box {\n  display: flex;           /*+*/\n  flex-direction: column;  /*+*/\n  gap: 14px;               /*+*/\n  background: #eef2ff; padding: 12px; border-radius: 8px;\n}\n.item { background: #fff; padding: 8px 12px; border-radius: 6px; }',
        cap: '<code>gap</code> は「間だけ」に余白を作る。margin を全項目に付けると最後にも付く（<code>:last-child { margin-bottom: 0 }</code> でも直せる）。縦の margin は<b>重なって大きいほうだけ</b>になる（上 24px と下 16px → 24px）。' } },
      { n: '枠線・角丸・影', o: {
        h: 190, sym: '3つのプランが<b>ベタ塗りで平らに見える</b>。どれが選ばれているかも、押せるのかも分からない。', ok: '<b>カードらしくなった。</b>枠・角丸・影で、選択中のプランも一目で分かる。',
        html: '<div class="plans"><div class="plan">ライト<br><b>5,500円</b></div><div class="plan sel">スタンダード<br><b>12,000円</b></div><div class="plan">プレミアム<br><b>30,000円</b></div></div>',
        bad: '.plans { display: flex; gap: 8px; }\n.plan {\n  flex: 1; padding: 14px 6px; text-align: center;\n  background: #f1f5f9;\n  /* 枠も角丸も影も無い */  /*-*/\n}',
        good: '.plans { display: flex; gap: 8px; }\n.plan {\n  flex: 1; padding: 14px 6px; text-align: center;\n  background: #fff;\n  border: 2px solid #cbd5e1;                  /*+*/\n  border-radius: 10px;                        /*+*/\n  box-shadow: 0 2px 8px rgba(0,0,0,.12);      /*+*/\n}\n.sel { border-color: #2563eb; }               /*+*/',
        cap: '<code>border</code>＝枠、<code>border-radius</code>＝角丸（大きいほど丸い）、<code>box-shadow</code>＝影（浮いて見える＝押せそう）。<b>選択中は枠の色を変える</b>のが定番。' } },
      { n: 'はみ出し', o: {
        h: 230, sym: '長い相談番号と、大きな画像が<b>カードの枠からはみ出して</b>、横スクロールが出る。', ok: '<b>枠に収まった。</b>画像は枠の幅まで縮み、長い文字は折り返す。',
        html: '<div class="card"><p class="t">相談番号：consult-20240512-unpaid-overtime-labor-0001</p><img src="' + IMG(600, 60, '600px の画像') + '"></div>',
        bad: '.card {\n  width: 260px; padding: 10px;\n  border: 1px solid #cbd5e1; border-radius: 8px;\n}\n/* 長い文字も、大きな画像もそのまま */  /*-*/',
        good: '.card {\n  width: 260px; padding: 10px;\n  border: 1px solid #cbd5e1; border-radius: 8px;\n}\nimg { max-width: 100%; height: auto; }  /*+*/\n.t { overflow-wrap: anywhere; }         /*+*/',
        cap: '画像は <code>max-width: 100%</code> で枠より大きくしない。長い英数字は <code>overflow-wrap: anywhere</code> で折り返す（1行で省略したいなら <code>text-overflow</code>）。' } },
      { n: '図で確かめる', render: (c) => boxScene(c) },
    ],
    /* ---------- display ---------- */
    display: () => [
      { n: 'inline に余白', el: () => SYM.display() },
      { n: 'メニューを横に並べる', o: {
        h: 150, sym: 'メニューを横に並べたいのに、<b>縦に積まれて</b>点（●）も付いている。', ok: '<b>横に並んだ。</b>点を消して、li を横に並べた。',
        html: '<ul class="menu"><li>案件</li><li>相談</li><li>料金</li></ul>',
        bad: '.menu li {\n  padding: 8px 16px;\n  background: #dbeafe;\n  /* li は初期値が list-item → 縦に積まれる */  /*-*/\n}',
        good: '.menu { list-style: none; padding: 0; }    /*+*/\n.menu li {\n  display: inline-block;   /*+*/\n  padding: 8px 16px;\n  background: #dbeafe;\n  margin-right: 6px;\n}',
        cap: 'li の初期値は <code>list-item</code>（縦に積む）。横に並べるなら <code>inline-block</code>。今は <code>display: flex</code> で並べるのが主流（次の Flexbox で）。' } },
      { n: '消す・隠す', o: {
        h: 200, sym: 'エラー文を非表示にしたのに、<b>空白だけ残って</b>フォームが間延びしている。', ok: '<b>詰まった。</b>場所ごと消えた。',
        html: '<p>お名前</p><div class="err">お名前が未入力です</div><p>メールアドレス</p>',
        bad: '.err {\n  color: #dc2626;\n  visibility: hidden;   /*-*/\n}',
        good: '.err {\n  color: #dc2626;\n  display: none;        /*+*/\n}',
        cap: '<code>display: none</code> は<b>場所ごと消える</b>。<code>visibility: hidden</code> は<b>見えないだけで場所は残る</b>。エラー表示の出し入れは、ふつう display で切り替える。' } },
      { n: '画像の下の隙間', o: {
        h: 160, sym: '画像の下に<b>謎の隙間</b>。枠にぴったり収めたいのに、数 px の余白ができる。', ok: '<b>ぴったり収まった。</b>img を block にした。',
        html: '<div class="thumb"><img src="' + IMG(160, 60, '画像') + '"></div>',
        bad: '.thumb { background: #f97316; width: 160px; }\n/* img は inline → 文字と同じ扱いで下に隙間 */  /*-*/',
        good: '.thumb { background: #f97316; width: 160px; }\nimg { display: block; }   /*+*/',
        cap: '画像は初期値が <code>inline</code>（文字の仲間）なので、<b>文字の下の余白</b>が付く。<code>display: block</code> にすると消える。現場でとてもよく出る。' } },
      { n: 'カード全体をリンクに', o: {
        h: 190, sym: 'カード全体をリンクにしたいのに、<b>枠がずれて</b>、押せる範囲も文字の上だけ。', ok: '<b>カード全体が押せる。</b>a を block にした。',
        html: '<a class="card" href="#"><h3>無料相談</h3><p>初回30分・オンライン</p></a>',
        bad: '.card {\n  border: 1px solid #cbd5e1; border-radius: 8px;\n  padding: 12px; color: inherit; text-decoration: none;\n  /* a は inline のまま */  /*-*/\n}',
        good: '.card {\n  display: block;   /*+*/\n  border: 1px solid #cbd5e1; border-radius: 8px;\n  padding: 12px; color: inherit; text-decoration: none;\n}',
        cap: 'a は初期値が inline。<b>箱全体を押せるようにする</b>なら <code>display: block</code>。' } },
      { n: '図で確かめる', render: (c) => displayScene(c) },
    ],
    /* ---------- Flexbox ---------- */
    flex: () => [
      { n: 'ヘッダー', el: () => SYM.flex() },
      { n: '真ん中に置く', o: {
        h: 190, sym: '「申込完了」を<b>真ん中</b>に置きたいのに、左上に張り付いている。', ok: '<b>縦も横も真ん中。</b>親に3行書いただけ。',
        html: '<div class="stage"><div class="done">申込完了</div></div>',
        bad: '.stage { height: 150px; background: #eef2ff; border-radius: 8px; }\n.done { background: #16a34a; color: #fff; padding: 10px 20px; border-radius: 8px; }\n/* 親に並べ方の指定が無い */  /*-*/',
        good: '.stage {\n  display: flex;            /*+*/\n  justify-content: center;  /*+*/\n  align-items: center;      /*+*/\n  height: 150px; background: #eef2ff; border-radius: 8px;\n}\n.done { background: #16a34a; color: #fff; padding: 10px 20px; border-radius: 8px; }',
        cap: '真ん中置きの定番：親に <code>display: flex</code> ＋ <code>justify-content: center</code>（横）＋ <code>align-items: center</code>（縦）。' } },
      { n: 'カードを並べて折り返す', o: {
        h: 250, sym: '案件カードを<b>横に並べて</b>、入りきらなければ<b>次の行へ</b>送りたい。いまは1列に積まれるだけ。', ok: '<b>横に並び、あふれたら次の行へ。</b>すき間も gap で一定。',
        html: '<div class="cards"><div class="c">労働</div><div class="c">交通事故</div><div class="c">相続</div><div class="c">離婚</div><div class="c">借金</div><div class="c">契約</div></div>',
        bad: '.c { width: 110px; padding: 14px 0; text-align: center; background: #dbeafe; border-radius: 8px; margin-bottom: 8px; }',
        good: '.cards {\n  display: flex;      /*+*/\n  flex-wrap: wrap;    /*+*/\n  gap: 8px;           /*+*/\n}\n.c { width: 110px; padding: 14px 0; text-align: center; background: #dbeafe; border-radius: 8px; }',
        cap: '<code>flex-wrap: wrap</code> で入りきらないぶんを次の行へ。すき間は子に margin を付けず、親の <code>gap</code> で。' } },
      { n: '左メニュー + 本文', o: {
        h: 190, sym: '左にメニュー、右に本文を置きたい。<b>本文が余った幅を使い切って</b>ほしい。', ok: '<b>メニューは固定幅、本文は残り全部。</b>',
        html: '<div class="layout"><aside>メニュー</aside><main>本文がここに入ります。ウィンドウの幅が変わっても、本文は残りの幅をちょうど使い切ります。</main></div>',
        bad: 'aside { width: 90px; background: #dbeafe; padding: 10px; }\nmain  { background: #f1f5f9; padding: 10px; }\n/* 親が並べていない */  /*-*/',
        good: '.layout {\n  display: flex;   /*+*/\n  gap: 10px;       /*+*/\n}\naside { width: 90px; background: #dbeafe; padding: 10px; }\nmain  { flex: 1; background: #f1f5f9; padding: 10px; }  /*+*/',
        cap: '<code>flex: 1</code> は「余った幅を全部もらう」。固定幅の子と組み合わせると、サイドバー + 本文の定番レイアウトになる。' } },
      { n: '縦に積む', o: {
        h: 230, sym: 'フォームの項目を<b>縦に等間隔</b>で並べたい。margin を何度も書きたくない。', ok: '<b>縦にそろった。</b>間隔は gap の1か所だけ。',
        html: '<form class="form"><label>お名前<input></label><label>メール<input></label><button type="button">送信</button></form>',
        bad: 'label { font-size: 13px; }\ninput { padding: 6px; margin: 0 6px; }  /*-*/\nbutton { padding: 8px 18px; background: #2563eb; color: #fff; border: 0; border-radius: 6px; }',
        good: '.form {\n  display: flex;            /*+*/\n  flex-direction: column;   /*+*/\n  gap: 10px;                /*+*/\n  max-width: 220px;         /*+*/\n}\nlabel { display: grid; gap: 4px; font-size: 13px; }\ninput { padding: 6px; }\nbutton { padding: 8px 18px; background: #2563eb; color: #fff; border: 0; border-radius: 6px; }',
        cap: '<code>flex-direction: column</code> で縦並び。フォームやカードの中身の「縦積み＋等間隔」は、この形がいちばん多い。' } },
      { n: '高さがそろうカード', o: {
        h: 220, sym: '文章の長さが違うと、<b>カードの高さがバラバラ</b>で、ガタガタに見える。', ok: '<b>高さがそろった。</b>flex の子は、初期値で同じ高さになる。',
        html: '<div class="row"><div class="card"><b>無料相談</b><p>初回30分</p></div><div class="card"><b>継続相談</b><p>30分ごと5,500円。書面の作成が必要な場合は別途お見積りです。</p></div><div class="card"><b>電話相談</b><p>平日のみ</p></div></div>',
        bad: '.card {\n  display: inline-block;  /*-*/\n  width: 30%; vertical-align: top;\n  padding: 8px; background: #dbeafe; border-radius: 8px;\n}',
        good: '.row { display: flex; gap: 8px; }  /*+*/\n.card {\n  flex: 1;              /*+*/\n  padding: 8px; background: #dbeafe; border-radius: 8px;\n}',
        cap: 'flex の子は <code>align-items: stretch</code>（初期値）で、<b>いちばん高いカードに高さがそろう</b>。float や inline-block では面倒だった処理が、自動になる。' } },
      { n: '軸を触って確かめる', render: (c) => flexScene(c) },
    ],
    /* ---------- position ---------- */
    position: () => [
      { n: 'ふつうは動かない', o: {
        h: 190, sym: '<code>top: 30px; left: 40px</code> と書いたのに、<b>動かない</b>。', ok: '<b>ずれた。</b>position を決めると、top / left が効くようになる。',
        html: '<div class="row">案件 1</div><div class="row two">案件 2（top / left を書いた）</div><div class="row">案件 3</div>',
        bad: '.row { padding: 10px; margin-bottom: 8px; background: #dbeafe; border-radius: 8px; }\n.two {\n  top: 30px;    /*-*/\n  left: 40px;   /*-*/\n}',
        good: '.row { padding: 10px; margin-bottom: 8px; background: #dbeafe; border-radius: 8px; }\n.two {\n  position: relative;  /*+*/\n  top: 30px;\n  left: 40px;\n}',
        cap: 'ふつう（<code>static</code>）の要素は、上から順に並ぶだけ。<b>top・left・right・bottom は、position を決めたときだけ</b>効く。ずらしても、<b>元の場所は空いたまま</b>なのも見てほしい。この先は、本当の使い道の話。' } },
      { n: '数px の微調整', o: {
        h: 140, sym: 'アイコンが文字より<b>少し高い</b>（赤い線＝文字の真ん中）。ほんの数 px だけ下げたい。', ok: '<b>そろった。</b>元の場所を残したまま、5px だけ下げた。',
        html: '<p class="bar" style="margin:14px 0;background:linear-gradient(transparent calc(50% - .5px),#fca5a5 calc(50% - .5px),#fca5a5 calc(50% + .5px),transparent calc(50% + .5px))"><span class="ic">★</span> お気に入りに追加</p><p style="font-size:12px;color:#94a3b8;margin:0">赤い線 ＝ 文字の真ん中</p>',
        bad: '.bar { font-size: 15px; }\n.ic {\n  display: inline-block;\n  font-size: 28px; line-height: 1; color: #f59e0b;\n  /* 少し高く見える */  /*-*/\n}',
        good: '.bar { font-size: 15px; }\n.ic {\n  display: inline-block;\n  font-size: 28px; line-height: 1; color: #f59e0b;\n  position: relative;  /*+*/\n  top: 5px;            /*+*/\n}',
        cap: '<code>relative</code> だけで使う場面は<b>少ない</b>。「元の場所に置いたまま、数 px だけずらす」微調整くらい。大きく動かすのは、次の<b>親子セット</b>で。' } },
      { n: '親が「基準」になる', el: () => SYM.position() },
      { n: '親に relative を忘れると', o: {
        h: 200, sym: '赤いバッジを右上に付けたのに、<b>ブラウザ（ページ）の右上に飛んでいった</b>。', ok: '<b>ベルの角に戻った。</b>親に relative を付けただけ。',
        html: '<div style="padding:50px 60px"><div class="bell">通知</div></div>',
        bad: '.bell {\n  display: inline-block;\n  padding: 10px 18px;\n  background: #e2e8f0; border-radius: 8px;\n  /* 親に position が無い */  /*-*/\n}\n.bell::after {\n  content: "3";\n  position: absolute;\n  top: -8px; right: -8px;\n  background: #ef4444; color: #fff;\n  border-radius: 999px; padding: 0 7px; font-size: 12px;\n}',
        good: '.bell {\n  position: relative;   /*+*/\n  display: inline-block;\n  padding: 10px 18px;\n  background: #e2e8f0; border-radius: 8px;\n}\n.bell::after {\n  content: "3";\n  position: absolute;\n  top: -8px; right: -8px;\n  background: #ef4444; color: #fff;\n  border-radius: 999px; padding: 0 7px; font-size: 12px;\n}',
        cap: '<code>absolute</code> は、<b>いちばん近い「position を決めた親」</b>を基準にする。親が無いとページ全体が基準になって、飛んでいく。<b>親に relative を付け忘れない</b>。' } },
      { n: 'absolute の定番', o: {
        h: 250, sym: '「NEW」リボンも、モーダルの「×」ボタンも、<b>ただの文字として流れて</b>しまう。', ok: '<b>角に貼り付いた。</b>どちらも「親 relative ＋ 子 absolute」。',
        html: '<div class="card"><span class="new">NEW</span><h3>無料相談</h3><p>初回30分・オンライン</p></div><div class="modal"><button class="x" type="button">×</button><p>送信しました</p></div>',
        bad: '.card, .modal { background: #f1f5f9; border-radius: 8px; padding: 12px; margin: 14px 0 10px; }\n.new { background: #ef4444; color: #fff; font-size: 11px; padding: 1px 8px; border-radius: 4px; }\n.x { border: 0; background: #cbd5e1; border-radius: 50%; width: 24px; height: 24px; }\n/* 位置の指定が無い */  /*-*/',
        good: '.card, .modal { background: #f1f5f9; border-radius: 8px; padding: 12px; margin: 14px 0 10px; position: relative; }  /*+*/\n.new { position: absolute; top: -8px; left: 12px;  /*+*/\n  background: #ef4444; color: #fff; font-size: 11px; padding: 1px 8px; border-radius: 4px; }\n.x { position: absolute; top: 6px; right: 8px;     /*+*/\n  border: 0; background: #cbd5e1; border-radius: 50%; width: 24px; height: 24px; }',
        cap: '「部品の角に貼り付ける」ときは、リボン・×ボタン・吹き出しの矢印すべて同じ形：<b>親に relative、子に absolute ＋ top / right など</b>。画面に固定する <code>fixed</code> と、スクロールで止まる <code>sticky</code> は次のシーンで。' } },
    ],
    /* ---------- fixed / sticky ---------- */
    sticky: () => [
      { n: '飛んだ見出しが隠れる', el: () => SYM.sticky() },
      { n: '本文がヘッダーの下に隠れる', o: {
        h: 180, sym: '固定ヘッダーを付けたら、<b>本文の最初の行がヘッダーの下に隠れた</b>。', ok: '<b>本文が見えた。</b>ヘッダーの高さぶんの余白を本文に足した。',
        html: '<header class="hd">案件管理（固定ヘッダー）</header><h3>案件一覧</h3><p>ここが本文の最初の行です。</p>',
        bad: '.hd {\n  position: fixed; top: 0; left: 0; right: 0;\n  background: #1e293b; color: #fff; padding: 12px 14px;\n}\n/* fixed の要素は「場所を取らない」  */  /*-*/',
        good: '.hd {\n  position: fixed; top: 0; left: 0; right: 0;\n  background: #1e293b; color: #fff; padding: 12px 14px;\n}\nbody { padding-top: 56px; }  /*+*/',
        cap: '<code>fixed</code> は「ふつうの流れ」から外れる＝<b>場所を取らない</b>。だから本文側に、ヘッダーの高さぶんの余白（<code>padding-top</code>）が要る。' } },
      { n: '表の見出しを固定', o: {
        h: 230, sym: '行が多い表をスクロールすると、<b>見出し行が消えて</b>、どの列か分からなくなる。', ok: '<b>見出しが上に残った。</b>th に sticky を付けただけ。',
        html: '<div class="tbl"><table><thead><tr><th>案件</th><th>状態</th></tr></thead><tbody><tr><td>契約書の確認</td><td>対応中</td></tr><tr><td>内容証明の作成</td><td>未着手</td></tr><tr><td>期日の調整</td><td>完了</td></tr><tr><td>書面の提出</td><td>対応中</td></tr><tr><td>示談交渉</td><td>未着手</td></tr><tr><td>報告書の作成</td><td>完了</td></tr><tr><td>請求書の発行</td><td>未着手</td></tr></tbody></table></div>',
        bad: '.tbl { height: 140px; overflow: auto; border: 1px solid #cbd5e1; }\ntable { width: 100%; border-collapse: collapse; }\nth, td { padding: 6px 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }\nth { background: #e2e8f0; }   /* スクロールすると一緒に流れる */  /*-*/',
        good: '.tbl { height: 140px; overflow: auto; border: 1px solid #cbd5e1; }\ntable { width: 100%; border-collapse: collapse; }\nth, td { padding: 6px 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }\nth {\n  background: #e2e8f0;\n  position: sticky;   /*+*/\n  top: 0;             /*+*/\n}',
        cap: '<code>sticky</code> は「スクロールしている間、指定した位置で<b>止まる</b>」。<code>top: 0</code> とセットで書く（top が無いと効かない）。表の見出し・ページ内の目次によく使う。右の表を、実際にスクロールしてみよう。' } },
      { n: 'sticky が効かない', o: {
        h: 230, sym: '左メニューに <code>position: sticky</code> を付けたのに、<b>スクロールしても流れていく</b>。', ok: '<b>メニューが止まった。</b>top の値を足した。',
        html: '<div class="wrap"><aside>メニュー<br>案件<br>相談<br>料金</aside><main><p>本文 1</p><p>本文 2</p><p>本文 3</p><p>本文 4</p><p>本文 5</p><p>本文 6</p><p>本文 7</p><p>本文 8</p></main></div>',
        bad: '.wrap { display: flex; gap: 10px; align-items: flex-start; height: 150px; overflow: auto; }\naside {\n  position: sticky;   /* top を書いていない */  /*-*/\n  background: #dbeafe; padding: 8px 12px; border-radius: 8px;\n}',
        good: '.wrap { display: flex; gap: 10px; align-items: flex-start; height: 150px; overflow: auto; }\naside {\n  position: sticky;\n  top: 8px;           /*+*/\n  background: #dbeafe; padding: 8px 12px; border-radius: 8px;\n}',
        cap: 'sticky が効かない原因の<b>1番は top（または bottom）の書き忘れ</b>。「どこで止めるか」を数字で決める。右の枠をスクロールして確かめよう。' } },
      { n: 'さわって確かめる', render: (c) => stickyScene(c) },
    ],
    /* ---------- z-index ---------- */
    z: () => [
      { n: 'モーダルが隠れる', el: () => SYM.z() },
      { n: 'ドロップダウンが隠れる', o: {
        h: 230, sym: 'メニューを開いたのに、<b>下のカードの裏に隠れた</b>。', ok: '<b>メニューが手前に出た。</b>メニューを持つカードに z-index を付けた。',
        html: '<div class="card a"><button type="button">操作 ▾</button><ul class="menu"><li>編集</li><li>削除</li></ul></div><div class="card b">下のカード</div>',
        bad: '.card { position: relative; background: #f1f5f9; border-radius: 8px; padding: 12px; margin-bottom: 6px; }\n.menu {\n  position: absolute; top: 44px; left: 12px;\n  list-style: none; margin: 0; padding: 4px 0;\n  background: #fff; border: 1px solid #cbd5e1; border-radius: 6px; width: 90px;\n}\n.menu li { padding: 4px 12px; }\n/* あとに書いたカードが手前になる */  /*-*/',
        good: '.card { position: relative; background: #f1f5f9; border-radius: 8px; padding: 12px; margin-bottom: 6px; }\n.a { z-index: 2; }  /*+*/\n.menu {\n  position: absolute; top: 44px; left: 12px;\n  list-style: none; margin: 0; padding: 4px 0;\n  background: #fff; border: 1px solid #cbd5e1; border-radius: 6px; width: 90px;\n}\n.menu li { padding: 4px 12px; }',
        cap: 'position を持つ要素どうしは、<b>あとに書いたほうが手前</b>。メニューを持つ親（上のカード）に <code>z-index</code> を付けて、手前に出す。' } },
      { n: 'トーストが幕の下に', o: {
        h: 240, sym: '「保存しました」のトーストが、<b>モーダルの暗い幕の下に隠れた</b>。', ok: '<b>トーストが一番手前に出た。</b>数字の大小を決めておくのが現場の作法。',
        html: '<p>本文の内容…</p><div class="overlay"></div><div class="modal">確認しますか？</div><div class="toast">保存しました</div>',
        bad: '.overlay { position: absolute; inset: 0; background: rgba(15,23,42,.5); z-index: 200; }\n.modal { position: absolute; top: 40px; left: 30px; right: 30px; background: #fff; padding: 16px; border-radius: 8px; z-index: 210; }\n.toast {\n  position: absolute; bottom: 10px; right: 10px;\n  background: #16a34a; color: #fff; padding: 8px 14px; border-radius: 8px;\n  z-index: 100;   /*-*/\n}',
        good: '.overlay { position: absolute; inset: 0; background: rgba(15,23,42,.5); z-index: 200; }\n.modal { position: absolute; top: 40px; left: 30px; right: 30px; background: #fff; padding: 16px; border-radius: 8px; z-index: 210; }\n.toast {\n  position: absolute; bottom: 10px; right: 10px;\n  background: #16a34a; color: #fff; padding: 8px 14px; border-radius: 8px;\n  z-index: 300;   /*+*/\n}',
        cap: '現場では<b>「ヘッダー 100・モーダル 200・トースト 300」のように、1か所で決めておく</b>。バラバラに 9999 を付け合うと、数字の取り合いになる。' } },
      { n: 'z-index が効かない', o: {
        h: 190, sym: '<code>z-index: 5</code> と書いたのに、<b>重なりが変わらない</b>（下の箱が上に来ない）。', ok: '<b>手前に出た。</b>position を足した。',
        html: '<div class="stack"><div class="a">A（手前にしたい）</div><div class="b">B（上に重なっている）</div></div>',
        bad: '.stack { position: relative; height: 90px; }\n.a { background: #fb923c; padding: 18px 12px; width: 150px;\n  z-index: 5;  /* position が無いので無視される */  /*-*/\n}\n.b { background: #60a5fa; padding: 18px 12px; width: 150px; position: absolute; top: 28px; left: 50px; }',
        good: '.stack { position: relative; height: 90px; }\n.a { background: #fb923c; padding: 18px 12px; width: 150px;\n  position: relative;  /*+*/\n  z-index: 5;\n}\n.b { background: #60a5fa; padding: 18px 12px; width: 150px; position: absolute; top: 28px; left: 50px; }',
        cap: '<code>z-index</code> は、<b>position が static 以外の要素</b>にだけ効く。（flex / grid の子は例外で効く。）' } },
      { n: '数字をクリックして確かめる', render: (c) => zScene(c) },
    ],
  };


  function attachScene(el) {
    const modes = {
      inline: { n: '① style 属性', badge: '非推奨', meter: 15, html: '<p style="color: hotpink; font-weight: 900;">\n  こんにちは\n</p>\n<p style="color: hotpink; font-weight: 900;">\n  また書くの…？\n</p>', css: '', note: '要素ごとに書く＝同じ指定をコピペ地獄。' },
      tag: { n: '② <style> タグ', badge: '小規模なら', meter: 55, html: '<head>\n  <style>\n    p { color: hotpink;\n        font-weight: 900; }\n  </style>\n</head>\n<body>\n  <p>こんにちは</p>\n  <p>まとめて変わる！</p>\n</body>', css: '', note: '1ページ内でまとめて指定。他のページでは使い回せない。' },
      link: { n: '③ <link> で外部CSS', badge: '推奨 ✓', meter: 95, html: '<head>\n  <link rel="stylesheet"\n        href="style.css">\n</head>\n<body>\n  <p>こんにちは</p>\n  <p>全ページで共通！</p>\n</body>', css: 'p {\n  color: hotpink;\n  font-weight: 900;\n}', note: '役割が分かれて直しやすい。全ページで再利用できる。' },
    };
    const tabs = h('div', { class: 'cg-tabs' }), left = h('div'), right = h('div'), meter = h('i'), note = h('div', { class: 'st-cap' });
    const frame = h('iframe', { class: 'cg-page', sandbox: '', style: { width: '100%', height: '170px', border: 0 } });
    const pkt = h('div', { class: 'cg-pk', style: { fontSize: '1.5rem' } }, '📦');
    function show(k) {
      const m = modes[k];
      tabs.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.k === k));
      left.replaceChildren(...[code(m.html, 'html', { file: 'index.html', color: BASIC }), m.css ? h('div', { style: { marginTop: '10px', position: 'relative' } }, k === 'link' ? h('div', { style: { position: 'absolute', right: '10px', top: '-30px' } }, pkt) : null, code(m.css, 'css', { file: 'style.css', color: TS })) : null].filter(Boolean));
      meter.style.width = m.meter + '%';
      note.innerHTML = `<b>${m.badge}</b>　${m.note}`;
      frame.srcdoc = '<body style="font-family:sans-serif;margin:12px;line-height:1.8"><style>p{color:hotpink;font-weight:900}</style><p>こんにちは</p><p>' + (k === 'inline' ? 'また書くの…？' : k === 'tag' ? 'まとめて変わる！' : '全ページで共通！') + '</p>';
    }
    Object.entries(modes).forEach(([k, m]) => tabs.append(h('button', { 'data-k': k, onclick: () => show(k) }, m.n)));
    right.append(lbl('結果'), frame, h('div', { style: { height: '14px' } }), lbl('直しやすさ'), h('div', { class: 'cg-meter' }, meter), h('div', { style: { height: '10px' } }), note);
    el.append(tabs, h('div', { class: 'split' }, left, right));
    show('inline');
  }

  function selectorScene(el) {
    const W = K.W;
    style('cgs4', `
    .cgs4-pg{border-radius:10px;overflow:hidden;border:1px solid var(--line);background:#fff}.cgs4-pg iframe{display:block;width:100%;border:0;background:#fff}
    pre.code.cgs4-wrap .ln{white-space:normal;overflow:visible}
    .cgs4-badge{margin-left:.8em;padding:0 .6em;border-radius:6px;font:800 .6875rem/1.7 var(--font);white-space:nowrap;vertical-align:1px}
    .cgs4-badge.bad{background:rgba(255,107,122,.2);color:#ff8f9a;border:1px solid var(--bad)}
    .cgs4-badge:not(.ok):not(.bad){background:var(--card2);color:var(--mute);border:1px solid var(--line)}
    .cgs4-badge.ok{background:rgba(111,220,124,.2);color:#9be58b;border:1px solid var(--ok)}
    .cgs4-badge.mute{background:transparent;color:#8e97c4;border:1px solid #4b5688}
    .cgs4-note{display:flex;gap:.7em;align-items:flex-start;padding:.7em 1em;border-radius:10px;border:1px dashed var(--bad);background:color-mix(in srgb,var(--bad) 10%,transparent);font-size:.875rem;line-height:1.8;margin-top:12px}
    .cgs4-note .ic{width:20px;height:20px;flex:none;margin-top:3px;color:var(--bad)}.cgs4-note.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 10%,transparent)}.cgs4-note.ok .ic{color:var(--ok)}
    .cgs4-lad{display:grid;gap:8px}
    .cgs4-rung{all:unset;box-sizing:border-box;cursor:pointer;display:grid;grid-template-columns:6.5em 1fr auto;gap:12px;align-items:center;padding:.55em .9em;border-radius:10px;border:2px solid var(--line);background:var(--card);transition:.2s}
    .cgs4-rung:hover{background:var(--card2)}.cgs4-rung.sel{border-color:var(--ts);background:color-mix(in srgb,var(--ts) 12%,var(--card))}
    .cgs4-rung b{font-weight:900;font-size:.875rem}.cgs4-rung code{font:600 .8125rem/1.5 var(--mono);color:#d8dcff;white-space:pre-wrap}
    .cgs4-res{font:800 .75rem var(--font);padding:.15em .7em;border-radius:6px;white-space:nowrap}.cgs4-res.win{display:none}
    .cgs4-res.w{background:rgba(111,220,124,.2);color:#9be58b;border:1px solid var(--ok)}.cgs4-res.l{background:rgba(255,107,122,.15);color:#ff8f9a;border:1px solid var(--bad)}
    .cgs4-axis{display:flex;justify-content:space-between;font-size:.75rem;font-weight:800;color:var(--mute);padding:0 .3em}
    .cgs4-tie{margin-top:12px;padding:.7em 1em;border-radius:10px;background:var(--card);border:1px solid var(--line);font-size:.875rem;line-height:1.8}
    .cgs4-rules{display:grid;gap:6px}
    .cgs4-rule{all:unset;box-sizing:border-box;cursor:pointer;display:grid;grid-template-columns:1.6em 1fr auto;gap:8px;align-items:center;padding:.5em .8em;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:var(--code);color:#d8dcff;font:.8125rem/1.6 var(--mono);transition:.2s}
    .cgs4-rule:hover{border-color:var(--ts)}
    .cgs4-rule .ic{width:15px;height:15px;color:#8e97c4}
    .cgs4-rule .tx{white-space:pre-wrap;word-break:break-all}
    .cgs4-rule.won{border-color:var(--ok);background:rgba(111,220,124,.1)}.cgs4-rule.won .ic{color:var(--ok)}
    .cgs4-rule.lost .tx{text-decoration:line-through;color:#7d86b5}
    .cgs4-rule.off{opacity:.45;border-style:dashed}.cgs4-rule.off .tx{text-decoration:line-through}
    .cgs4-sw{display:inline-block;width:.9em;height:.9em;border-radius:3px;vertical-align:-1px;margin:0 .25em;border:1px solid rgba(255,255,255,.4)}
    .cgs4-fx{display:grid;gap:8px;margin-top:12px}
    .cgs4-fx>div{display:grid;grid-template-columns:2.2em 1fr;gap:10px;align-items:start;padding:.6em 1em;border-radius:10px;border:1px solid var(--line);background:var(--card);font-size:.875rem;line-height:1.8}
    .cgs4-fx .n{width:1.7em;height:1.7em;border-radius:50%;display:grid;place-items:center;font-weight:900;background:var(--ts);color:#06101f}
    .cgs4-fx .last .n{background:var(--mute)}
    @media(max-width:700px){.cgs4-rung{grid-template-columns:1fr;gap:4px}}
    `);

    const BASE = 'body{margin:0;font-family:system-ui,"Hiragino Sans",sans-serif}.form{background:#fff;color:#111;padding:14px 16px;display:grid;gap:8px;box-sizing:border-box}.form h4{margin:0;font-size:1rem}.form label{display:grid;gap:4px;font-size:.875rem}.form input{padding:.5em .7em;border:1px solid #cbd5e1;border-radius:6px;box-sizing:border-box;width:100%}button{padding:.7em 1.2em;border:0;border-radius:8px;font:700 .9rem system-ui;color:#fff}';
    const FORM = '<form class="form">\n  <h4>無料相談の申込</h4>\n  <label>お名前\n    <input placeholder="山田 太郎">\n  </label>\n  <button class="btn-submit" id="submit">申込む</button>\n</form>';
    const FORM_SHOW = '<form class="form">\n  <h4>無料相談の申込</h4>\n  <label>お名前 <input></label>\n  <button class="btn-submit">申込む</button>\n</form>';
    const NAME_OF = { 'rgb(128, 128, 128)': 'gray', 'rgb(255, 0, 0)': 'red', 'rgb(0, 0, 255)': 'blue', 'rgb(0, 128, 0)': 'green' };
    const JP = { gray: '灰', red: '赤', blue: '青', green: '緑' };

    /* 本物の HTML + CSS を iframe に流し込む（結果はブラウザが本当に決める） */
    function live(height) {
      const fr = h('iframe', { sandbox: 'allow-same-origin', title: 'ページ', style: { height: (height || 190) + 'px' } });
      const box = h('div', { class: 'cgs4-pg' }, fr);
      const o = { box, fr, cb: null, set(html, css) { fr.srcdoc = '<!doctype html><meta charset="utf-8"><style>' + BASE + '</style><style>' + css + '</style><body>' + html; }, color() {
        const d = fr.contentDocument, b = d && d.querySelector('button'); if (!b || !d.defaultView) return null; return NAME_OF[d.defaultView.getComputedStyle(b).backgroundColor] || null; } };
      fr.addEventListener('load', () => o.cb && o.cb());
      return o;
    }
    const note = (ok, html) => h('div', { class: 'cgs4-note' + (ok ? ' ok' : '') }, icon(ok ? 'circle-check' : 'circle-alert'), h('div', { html }));
    const badge = (cls, t) => h('span', { class: 'cgs4-badge ' + cls }, t);
    const cssFile = (src, o) => { const c = code(src, 'css', Object.assign({ file: 'style.css', color: TS }, o)); c.classList.add('cgs4-wrap'); return c; };

    /* ---------- 1) 症状：コードを見れば原因が分かる ---------- */
    const CSS1 = 'button { background: gray; }\n.form button { background: red; }\n.btn-submit { background: blue; }';
    const L1 = live(200); L1.set(FORM_SHOW, CSS1.replace(/gray/, 'gray'));
    const c1 = cssFile(CSS1);
    c1.setHi([2], 'on'); c1.setHi([3], 'err');
    const pw = (t) => { const b = badge('', t); b.style.opacity = '.85'; return b; };
    c1.lines[0].append(pw('強さ：タグ 1'));
    c1.lines[1].append(pw('強さ：クラス 1 ＋ タグ 1'), badge('ok', '赤が勝っている'));
    c1.lines[2].append(pw('強さ：クラス 1'), badge('bad', 'ここが効いていない'));
    const s1 = h('div', null,
      h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('index.html'), code(FORM_SHOW, 'html', { file: 'index.html', color: BASIC }), h('div', { style: { height: '10px' } }), lbl('style.css（上から順に書いてある）'), c1),
        h('div', { class: 'col' }, lbl('ページ（上のコードを実行した結果）'), L1.box)),
      note(false, '<b>.btn-submit { background: blue }</b> を書いたのに、ボタンは<b>赤</b>。<b>1つのボタンに3つのルール</b>が当たっていて、青は<b>負けている</b>。なぜ？<br><b>.form button</b> は「<b>.form</b>（クラス）＋ <b>button</b>（タグ）」で、id は使っていない。<b>.btn-submit</b> はクラス1つだけ。<b>同じクラス1つなら、タグを足した分だけ .form button が強い</b>。次で確かめよう。'));

    /* ---------- 2) はしご：1段ずつ、本物のコードで ---------- */
    const L2 = live(200);
    const OPP = '.form button { background: red; }';
    const RUNGS = [
      { n: '直書き', d: 'HTML の中に書く', code: '<button style="background: green;">', html: FORM_SHOW.replace('<button class="btn-submit">', '<button class="btn-submit" style="background: green;">'), css: OPP, win: true },
      { n: '#id', d: 'id で指定', code: '#submit { background: green; }', html: FORM_SHOW.replace('class="btn-submit"', 'class="btn-submit" id="submit"'), css: OPP + '\n#submit { background: green; }', win: true },
      { n: '.クラス', d: 'class が1つ', code: '.btn-submit { background: green; }', html: FORM_SHOW, css: OPP + '\n.btn-submit { background: green; }', win: false },
      { n: 'タグ', d: 'タグ名だけ', code: 'button { background: green; }', html: FORM_SHOW, css: OPP + '\nbutton { background: green; }', win: false },
    ];
    let selR = 2;
    const rungEls = RUNGS.map((r, i) => h('button', { class: 'cgs4-rung', type: 'button', onclick: () => pick(i) },
      h('div', null, h('b', r.n), h('div', { style: { fontSize: '.6875rem', color: 'var(--mute)' } }, r.d)), h('code', r.code), h('span', { class: 'cgs4-res ' + (r.win ? 'w' : 'l') }, r.win ? '勝つ → 緑' : '負ける → 赤のまま')));
    const oppCode = cssFile(OPP, { file: '前からあるルール' }); oppCode.setHi([1], 'on');
    function pick(i) {
      selR = i; rungEls.forEach((e, k) => e.classList.toggle('sel', k === i));
      const r = RUNGS[i]; L2.set(r.html, r.css);
    }
    const swapA = '.btn-a { background: blue; }\n.btn-b { background: green; }';
    const swapB = '.btn-b { background: green; }\n.btn-a { background: blue; }';
    let swapped = false;
    const L2b = live(70); const swapCode = h('div'); const swapCap = h('div', { class: 'cgs4-tie' });
    const SW_HTML = '<button class="btn-a btn-b">申込む</button>';
    function drawSwap() {
      const src = swapped ? swapB : swapA;
      swapCode.replaceChildren(code(src, 'css', { file: 'style.css', color: TS }));
      swapCode.firstChild.setHi([2], 'on');
      L2b.set(SW_HTML, src);
      swapCap.innerHTML = '<b>同じ強さ</b>（どちらもクラス1つ）なら、<b>あとに書いた行</b>が勝つ。' + (swapped ? '今は <code>.btn-a</code>（青）が下 → 青。' : '今は <code>.btn-b</code>（緑）が下 → 緑。');
    }
    const swapBtn = h('button', { class: 'btn', onclick: () => { swapped = !swapped; drawSwap(); } }, icon('arrow-up-down'), '2行の順番を入れ替える');
    L2b.fr.style.height = '70px';
    const s2 = h('div', null,
      h('div', { class: 'split' }, h('div', { class: 'col' },
        lbl('強い順（行を押すと、そのルールを足して試せる）'), h('div', { class: 'cgs4-axis' }, h('span', '強い ▲'), h('span', 'いつも「前からあるルール」と勝負')),
        h('div', { class: 'cgs4-lad', style: { margin: '6px 0 10px' } }, rungEls), h('div', { class: 'cgs4-axis' }, h('span', '弱い ▼'), h('span', '')),
        lbl('前からあるルール（相手）'), oppCode),
      h('div', { class: 'col' }, lbl('ページ'), L2.box)),
      h('div', { class: 'cgs4-tie', html: '<b>同じ段なら、数が多いほうが強い。</b><code>.form button</code>（クラス1＋タグ1）は <code>.btn-submit</code>（クラス1だけ）より強い。だから最初の赤が勝った。' }),
      h('div', { class: 'split', style: { marginTop: '12px' } }, h('div', { class: 'col' }, lbl('それも同じなら？'), swapCode, h('div', { class: 'row', style: { marginTop: '8px' } }, swapBtn)), h('div', { class: 'col' }, lbl('結果'), L2b.box, swapCap)));

    /* ---------- 3) 本物の style.css の行を消して、勝敗を確かめる ---------- */
    const L3 = live(200);
    const RULES = [
      { sel: 'button', color: 'gray', spec: [0, 0, 1] },
      { sel: '.form button', color: 'red', spec: [0, 1, 1] },
      { sel: '.btn-submit', color: 'blue', spec: [0, 1, 0] },
      { sel: '#submit', color: 'green', spec: [1, 0, 0] },
    ];
    RULES.forEach((r) => { r.on = true; r.src = r.sel + ' { background: ' + r.color + '; }'; });
    const TIER = ['ID', 'クラス', 'タグ'];
    const rows = RULES.map((r, i) => h('button', { class: 'cgs4-rule', type: 'button', onclick: () => { r.on = !r.on; draw3(); } }, icon('eye'), h('span', { class: 'tx', html: W.hl(r.src, 'css') }), h('span')));
    const why3 = h('div', { class: 'cgs4-tie' });
    function cmp(a, b) { for (let i = 0; i < 3; i++) if (a.spec[i] !== b.spec[i]) return a.spec[i] - b.spec[i]; return 0; }
    function draw3() {
      const on = RULES.filter((r) => r.on);
      L3.set(FORM, on.map((r) => r.src).join('\n'));
    }
    function judge3() {
      const col = L3.color(); const on = RULES.filter((r) => r.on);
      const win = on.find((r) => r.color === col) || null;
      rows.forEach((row, i) => {
        const r = RULES[i]; row.classList.remove('won', 'lost', 'off');
        row.firstChild.replaceWith(icon(r.on ? 'eye' : 'eye-off'));
        const bd = row.lastChild; bd.className = 'cgs4-badge'; bd.textContent = '';
        if (!r.on) { row.classList.add('off'); bd.className = 'cgs4-badge mute'; bd.textContent = '消した'; }
        else if (r === win) { row.classList.add('won'); bd.className = 'cgs4-badge ok'; bd.textContent = '効いている'; }
        else { row.classList.add('lost'); bd.className = 'cgs4-badge bad'; bd.textContent = '負け'; }
      });
      if (!win) { why3.innerHTML = '全部消したので、ボタンは<b>ブラウザの初期の色</b>に戻った。1行ずつ戻して試そう。'; return; }
      const others = on.filter((r) => r !== win).sort((a, b) => cmp(b, a));
      if (!others.length) { why3.innerHTML = '残っているルールは <code>' + esc(win.sel) + '</code> だけ。ライバルがいないので、そのまま <b>' + JP[win.color] + '</b>。'; return; }
      const sec = others[0];
      const c = cmp(win, sec);
      if (c === 0) why3.innerHTML = '強さが同じ。<b>あとに書いた <code>' + esc(win.sel) + '</code></b> が勝った。';
      else { let t = 0; while (win.spec[t] === sec.spec[t]) t++; why3.innerHTML = '勝ったのは <code>' + esc(win.sel) + '</code>。<b>' + TIER[t] + '</b>の数が多い（' + win.spec[t] + ' 対 ' + sec.spec[t] + '）から。'; }
    }
    L3.cb = judge3;
    const resetBtn = h('button', { class: 'btn ghost', onclick: () => { RULES.forEach((r) => { r.on = true; }); draw3(); } }, icon('rotate-ccw'), 'ぜんぶ戻す');
    const s3 = h('div', null, h('div', { class: 'split' },
      h('div', { class: 'col' }, lbl('style.css（行を押すと、その行を消す／戻す）'), h('div', { class: 'cgs4-rules' }, rows), h('div', { class: 'row', style: { marginTop: '10px' } }, resetBtn)),
      h('div', { class: 'col' }, lbl('ページ（残った行だけで動く）'), L3.box, why3)));
    draw3();

    /* ---------- 4) 本物のエディタで直す ---------- */
    const START = 'button { background: gray; }\n.form button { background: red; }\n\n/* ↓ あなたのルール：ボタンを青にしたい */\n.btn-submit { background: blue; }\n';
    const HTML4 = '<form class="form">\n  <h4>無料相談の申込</h4>\n  <label>お名前\n    <input placeholder="山田 太郎">\n  </label>\n  <button class="btn-submit">申込む</button>\n</form>\n';
    const strip = (s) => String(s || '').replace(/\/\*[\s\S]*?\*\//g, '');
    const isBlue = (c) => { const m = String(c).match(/\d+/g); if (!m) return false; const [r, g, b] = m.map(Number); return b > 150 && b > r + 60 && b > g + 40; };
    const isGreen = (c) => { const m = String(c).match(/\d+/g); if (!m) return false; const [r, g, b] = m.map(Number); return g > 120 && g > r + 50 && g > b + 40; };
    const bg = (d, f, withCampaign) => { // campaign クラスの有無を一時的に切り替えて、ボタンの色を調べる
      const b = d.querySelector('button'), fm = d.querySelector('.form'); if (!b || !fm) return '';
      const had = fm.classList.contains('campaign'); if (withCampaign) fm.classList.add('campaign'); else fm.classList.remove('campaign');
      const c = d.defaultView.getComputedStyle(b).backgroundColor; if (had) fm.classList.add('campaign'); else fm.classList.remove('campaign'); return c;
    };
    const pg4 = W.playground({
      title: 'HTML + CSS', mode: 'web', height: 230,
      files: [{ name: 'index.html', lang: 'html', code: HTML4 }, { name: 'style.css', lang: 'css', code: START }],
      solution: { 'index.html': HTML4.replace('<form class="form">', '<form class="form campaign">'), 'style.css': 'button { background: gray; }\n.form button { background: red; }\n\n/* 自分のルール：.form を足して、少しだけ強くする */\n.form .btn-submit { background: blue; }\n\n/* キャンペーン中だけ緑（あとに書く・同じ強さ） */\n.campaign .btn-submit { background: green; }\n' },
      tasks: (v, c) => {
        const d = c.doc && c.doc(); const css = strip(v['style.css']);
        const lab = ['ボタンを青にする（キャンペーンなしのとき）', '!important と #id を使わずに、青にする', 'form に class="campaign" を足すと、キャンペーン中だけ緑になる'];
        if (!d || !d.body || !d.defaultView || !d.querySelector('button')) return lab.map((l, i) => ({ level: i + 1, label: l, ok: false }));
        const noWar = !/!important/.test(css) && !/(^|[\s,}])#[\w-]+\s*[{,]/.test(css);
        const blue = isBlue(bg(d, v, false));
        const camp = isGreen(bg(d, v, true)) && /\.campaign/.test(css) && noWar && isBlue(bg(d, v, false));
        return [
          { level: 1, label: lab[0], ok: blue, hint: ['いまは <code>.form button</code>（クラス1＋タグ1）に負けている。自分のルールを、同じか少し強くしよう。'], answer: { code: '.form .btn-submit { background: blue; }', lang: 'css', mode: 'append' } },
          { level: 2, label: lab[1], ok: blue && noWar, hint: ['<code>.form .btn-submit</code> のように、クラスを1つ足すだけで勝てる。', '<code>!important</code> や <code>#submit</code> は使わない。'], answer: { code: '.form .btn-submit { background: blue; }', lang: 'css', mode: 'append' } },
          { level: 3, label: lab[2], ok: camp, hint: ['HTML の <code>&lt;form class="form"&gt;</code> を <code>class="form campaign"</code> にする。', 'CSS に <code>.campaign .btn-submit { background: green; }</code> を、青いルールの<b>あと</b>に書く（同じ強さなら、あとの行が勝つ）。'], answer: { code: '.campaign .btn-submit { background: green; }', lang: 'css', mode: 'append' } },
        ];
      },
    });
    const s4 = h('div', null,
      h('div', { class: 'cgs4-tie', style: { marginTop: 0, marginBottom: '10px' }, html: '<b>やること</b>：<code>.btn-submit</code> の青が、<code>.form button</code> の赤に負けている。<b>下のエディタで style.css を直して</b>、ボタンを青にしよう。<code>!important</code> と <code>#id</code> は使わない。' }),
      pg4,
      h('div', { class: 'cgs4-fx' },
        fx('1', '<b>自分のルールに、クラスを1つ足して少し強くする</b>　<code>.form .btn-submit { … }</code>（おすすめ）'),
        fx('2', '<b>書く順番を直す</b>　同じ強さなら、あとに書いた行が勝つ'),
        fx('3', '<b><code>!important</code> と <code>#id</code> は最後の手段</b>　強すぎて、あとから誰も上書きできなくなる', true)));
    function fx(n, html, last) { return h('div', { class: last ? 'last' : '' }, h('span', { class: 'n' }, n), h('div', { html })); }

    const panels = [s1, s2, s3, s4];
    const says = ['<b>症状</b>：青のルールを書いたのに、ボタンは赤い。', '<b>強さは「段」</b>：上の段ほど強い。同じ段なら、あとに書いた行。', '<b>実験</b>：style.css の行を消して、どれが効いているか見よう。', '<b>直す</b>：エディタで書き直して、青にしよう。'];
    el.append(stepper({ color: TS, steps: says.map((s) => ({ say: s })), init(vis) { panels.forEach((p) => vis.append(p)); },
      update(n) { panels.forEach((p, i) => { p.style.display = i === n ? '' : 'none'; });
        if (n === 1) { drawSwap(); pick(selR); }
        if (n === 2) setTimeout(() => L3.cb && L3.cb(), 150); } }));
    drawSwap(); pick(selR);
  }

  /* 1行にまとめた HTML 文字列を、読みやすく整形して表示する（長いときは先頭の数行だけ） */
  function htmlPretty(src, max) {
    const doc = new DOMParser().parseFromString('<body>' + src + '</body>', 'text/html'), VOID = /^(img|input|br|hr|meta|link)$/i, out = [];
    const attrs = (n) => [...n.attributes].filter((a) => !/^(style)$/.test(a.name) || true).map((a) => ' ' + a.name + (a.value === '' ? '' : '="' + a.value + '"')).join('');
    const walk = (nodes, d) => nodes.forEach((n) => {
      const pad = '  '.repeat(d);
      if (n.nodeType === 3) { const t = n.textContent.replace(/\s+/g, ' ').trim(); if (t) out.push(pad + t); return; }
      if (n.nodeType !== 1) return;
      const tg = n.tagName.toLowerCase();
      if (VOID.test(tg)) { out.push(`${pad}<${tg}${attrs(n)}>`); return; }
      const kids = [...n.childNodes];
      const textOnly = kids.length > 0 && kids.every((k) => k.nodeType === 3) && kids.map((k) => k.textContent).join('').trim().length < 28;
      if (textOnly || kids.length === 0) out.push(`${pad}<${tg}${attrs(n)}>${kids.map((k) => k.textContent.replace(/\s+/g, ' ').replace(/</g, '&lt;')).join('').trim()}</${tg}>`);
      else { out.push(`${pad}<${tg}${attrs(n)}>`); walk(kids, d + 1); out.push(`${pad}</${tg}>`); }
    });
    walk([...doc.body.childNodes], 0);
    const lim = max || 8; return out.length > lim ? out.slice(0, lim).concat(['  …']).join('\n') : out.join('\n');
  }
  style('cgh', `
  .cgh-btn{all:unset;cursor:pointer;padding:.28em .8em;border-radius:8px;font:700 .75rem var(--mono);background:var(--card);border:1px solid var(--line);transition:.2s;display:inline-flex;align-items:center;gap:.4em}
  .cgh-btn:hover{background:var(--card2)}.cgh-btn.on{background:color-mix(in srgb,var(--ts) 24%,var(--card));border-color:var(--ts)}.cgh-btn .ic{width:13px;height:13px}
  .cgh-box{margin-top:6px}.cgh-box[hidden]{display:none}.cgh-box pre.code{white-space:pre-wrap;word-break:break-word;overflow-x:hidden}
  `);
  /* HTML は「<> HTML（N行）」ボタンで開閉。折り返して、横スクロールしない */
  function htmlToggle(src, o) {
    const text = o && o.raw ? src : htmlPretty(src, 9), n = text.split('\n').length;
    const box = h('div', { class: 'cgh-box', hidden: !(o && o.open) }, code(text, 'html', { file: 'index.html', color: BASIC }));
    const btn = h('button', { class: 'cgh-btn' + (o && o.open ? ' on' : ''), type: 'button', onclick: () => { box.hidden = !box.hidden; btn.classList.toggle('on', !box.hidden); } }, icon('code'), 'HTML（' + n + '行）');
    return h('div', { style: { margin: '0 0 6px' } }, btn, box);
  }

  /* 折りたたみ（クリックで開く。中身は開いたときに作る） */
  function accordion(title, ic, build) {
    let built = null; const box = h('div', { class: 'cga' }), bd = h('div', { class: 'cga-bd' });
    box.append(h('button', { type: 'button', onclick: () => { box.classList.toggle('open'); if (!built) { built = build(); bd.append(built); } } }, icon(ic), h('span', title), icon('chevron-down')), bd);
    return box;
  }

  /* ============================================================
     position：通知ベルの赤い数字ひとつで、static / relative / absolute を動きで見る
     bellDemo = 1つの「ライブページ + CSS」。ストーリー用と「じぶんで触る」用で、別々に作る。
  ============================================================ */
  const CGP5_BASE = 'html,body{margin:0}body{font:14px/1.6 system-ui,"Hiragino Sans",sans-serif;color:#1f2937;background:#fff;padding:14px 18px;min-height:100vh;box-sizing:border-box}.page-t{margin:0 0 .5em;font-size:.75rem;color:#94a3b8}.bell{display:inline-block;padding:9px 20px;background:#e2e8f0;border-radius:10px;font-weight:700}.badge{display:inline-block;background:#ef4444;color:#fff;border-radius:999px;padding:0 .55em;font:700 .75rem/1.6 system-ui;min-width:1.4em;text-align:center;margin-left:.4em}.rf{position:absolute;pointer-events:none;border:2px dashed #2563eb;border-radius:8px;transition:left .5s,top .5s,width .5s,height .5s,opacity .3s}.rf-l{position:absolute;pointer-events:none;font:700 11px system-ui;color:#2563eb;background:#dbeafe;padding:1px 8px;border-radius:6px;transition:left .5s,top .5s,opacity .3s;white-space:nowrap}.gh{position:absolute;pointer-events:none;border:2px dashed #94a3b8;border-radius:999px;transition:all .4s}.ar{position:absolute;pointer-events:none;background:#f59e0b;transition:all .5s}.ar-l{position:absolute;pointer-events:none;font:700 11px ui-monospace,monospace;color:#b45309;background:#fef3c7;padding:0 5px;border-radius:4px;white-space:nowrap;transition:all .5s}';
  function bellDemo(height) {
    /* tA/rA = absolute 用の top/right、tR/lR = relative 用の top/left */
    const S = { pos: 'static', par: false, tA: -6, rA: -6, tR: 8, lR: 16 };
    const frame = h('iframe', { sandbox: 'allow-same-origin', title: 'ライブページ', style: { height: (height || 210) + 'px' } });
    let doc = null, first = true, loaded = false, prevLines = [], pend = null;
    const pre = h('div', { class: 'cgp5-pre' });
    const htmlBox = h('div', { class: 'cgp5-htm', hidden: true }, code('<div class="bell">\n  通知\n  <span class="badge">3</span>\n</div>', 'html', { file: 'index.html', color: BASIC }));
    const htmlBtn = h('button', { class: 'cgp5-mini', type: 'button', onclick: () => { htmlBox.hidden = !htmlBox.hidden; } }, icon('code'), 'HTML（3行）');
    const o = { S, onRefresh: null };
    const effPar = () => S.pos === 'absolute' && S.par;   // 親の relative が意味を持つのは、子が absolute のときだけ
    const vals = () => (S.pos === 'relative' ? { t: S.tR, x: S.lR, xn: 'left' } : { t: S.tA, x: S.rA, xn: 'right' });
    const cssText = () => {
      const v = vals();
      const par = effPar() ? '.bell {\n  position: relative;\n}' : '.bell {\n  /* position なし（static） */\n}';
      const kid = S.pos === 'static' ? '.badge {\n  position: static;   /* ふつう */\n}' : `.badge {\n  position: ${S.pos};\n  top: ${v.t}px;\n  ${v.xn}: ${v.x}px;\n}`;
      return par + '\n\n' + kid;
    };
    const realCss = () => { const v = vals(); return (effPar() ? '.bell{position:relative}' : '') + (S.pos === 'static' ? '.badge{position:static}' : `.badge{position:${S.pos};top:${v.t}px;${v.xn}:${v.x}px}`); };
    function drawCode() {
      const src = cssText(), lines = src.split('\n'), old = prevLines, c = code(src, 'css', { file: 'style.css', color: TS });
      pre.replaceChildren(c);
      if (!first) lines.forEach((l, i) => { if (old[i] !== l) c.lines[i].classList.add('fl'); });
      prevLines = lines;
    }
    const set = (id, st) => { const e = doc.getElementById(id); if (e) Object.assign(e.style, st); };
    function apply(animate) {
      if (!doc) return;
      const badge = doc.querySelector('.badge'), bell = doc.querySelector('.bell'); if (!badge) return;
      const before = badge.getBoundingClientRect();
      doc.getElementById('u').textContent = realCss();
      const after = badge.getBoundingClientRect();
      if (animate) {
        const dx = before.left - after.left, dy = before.top - after.top;
        if (Math.abs(dx) + Math.abs(dy) > 0.5) badge.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 650, easing: 'cubic-bezier(.3,1.1,.4,1)' });
      }
      const W = doc.documentElement.clientWidth, H = doc.documentElement.clientHeight, br = after, bl = bell.getBoundingClientRect();   // アニメ開始後の transform を拾わないよう、動かす前に測った矩形を使う
      ['rf', 'rfl', 'arv', 'arvl', 'arh', 'arhl', 'gh', 'ghl'].forEach((id) => set(id, { opacity: 0 }));
      if (S.pos === 'absolute') {
        const r = effPar() ? bl : { left: 2, top: 2, width: W - 4, height: H - 4 };
        set('rf', { opacity: 1, left: r.left + 'px', top: r.top + 'px', width: r.width - 4 + 'px', height: r.height - 4 + 'px' });
        set('rfl', { opacity: 1, left: r.left + 6 + 'px', top: (effPar() ? r.top + r.height + 6 : r.top + r.height - 24) + 'px' });
        doc.getElementById('rfl').textContent = effPar() ? '基準＝ベル → ぴったり' : '基準＝ページの角 → 迷子';
        const rr = r.left + r.width, rt = r.top;
        set('arv', { opacity: 1, left: br.left + br.width / 2 + 'px', top: Math.min(rt, br.top) + 'px', width: '2px', height: Math.abs(br.top - rt) + 'px' });
        set('arvl', { opacity: 1, left: Math.max(4, Math.min(W - 84, br.left + br.width / 2 + 6)) + 'px', top: Math.max(4, Math.min(rt, br.top) + Math.abs(br.top - rt) / 2 - 8) + 'px' }); doc.getElementById('arvl').textContent = 'top: ' + S.tA + 'px';
        set('arh', { opacity: 1, left: Math.min(br.right, rr) + 'px', top: br.top + br.height / 2 + 'px', width: Math.abs(rr - br.right) + 'px', height: '2px' });
        set('arhl', { opacity: 1, left: Math.max(4, Math.min(W - 84, Math.min(br.right, rr) + Math.abs(rr - br.right) / 2 - 24)) + 'px', top: Math.max(4, br.top + br.height / 2 + 6) + 'px' }); doc.getElementById('arhl').textContent = 'right: ' + S.rA + 'px';
      }
      if (S.pos === 'relative') {
        const gx = br.left - S.lR, gy = br.top - S.tR, lx = br.right + 14, cx = gx + br.width / 2, cy = gy + br.height / 2;
        set('gh', { opacity: 1, left: gx + 'px', top: gy + 'px', width: br.width + 'px', height: br.height + 'px' });
        set('arh', { opacity: 1, left: Math.min(cx, cx + S.lR) + 'px', top: cy + 'px', width: Math.abs(S.lR) + 'px', height: '2px' });
        set('arv', { opacity: 1, left: cx + S.lR + 'px', top: Math.min(cy, cy + S.tR) + 'px', width: '2px', height: Math.abs(S.tR) + 'px' });
        set('ghl', { opacity: 1, left: lx + 'px', top: gy - 4 + 'px' });
        set('arhl', { opacity: 1, left: lx + 'px', top: gy + 18 + 'px' }); doc.getElementById('arhl').textContent = '→ left: ' + S.lR + 'px';
        set('arvl', { opacity: 1, left: lx + 'px', top: gy + 38 + 'px' }); doc.getElementById('arvl').textContent = '↓ top: ' + S.tR + 'px';
      }
    }
    o.refresh = (animate) => { if (!loaded) { pend = !!animate; return; } apply(animate); drawCode(); first = false; o.onRefresh && o.onRefresh(); };
    o.set = (patch, animate) => { Object.assign(S, patch); o.refresh(animate); };
    frame.addEventListener('load', () => { doc = frame.contentDocument; loaded = true; first = true; o.refresh(false); });
    frame.srcdoc = '<!doctype html><meta charset="utf-8"><style>' + CGP5_BASE + '</style><style id="u"></style><body><p class="page-t">ページ全体（ブラウザの画面）</p><div class="bell">通知<span class="badge">3</span></div><div class="rf" id="rf" style="opacity:0"></div><div class="rf-l" id="rfl" style="opacity:0"></div><div class="ar" id="arv" style="opacity:0"></div><div class="ar-l" id="arvl" style="opacity:0"></div><div class="ar" id="arh" style="opacity:0"></div><div class="ar-l" id="arhl" style="opacity:0"></div><div class="gh" id="gh" style="opacity:0"></div><div class="rf-l" id="ghl" style="opacity:0;color:#64748b;background:#f1f5f9">もとの場所</div>';
    o.el = h('div', { class: 'cgp5-grid' }, h('div', { class: 'cgp5-pg' }, frame), h('div', { class: 'cgp5-side' }, h('div', { class: 'cgp5-bar' }, lbl('style.css（変わった行が光る）'), htmlBtn), pre, htmlBox));
    return o;
  }

  /* ---- 「じぶんで触る」：チップと数字で自由に ---- */
  function bellPlay() {
    const D = bellDemo(190), S = D.S;
    const num = (name, get, put) => { const i = h('input', { type: 'number', min: '-30', max: '60', value: String(get()), 'aria-label': name, disabled: S.pos === 'static' }); i.oninput = () => { const n = i.value === '' || i.value === '-' ? null : +i.value; if (n === null || isNaN(n)) return; put(Math.max(-30, Math.min(60, n))); D.refresh(true); }; i.onblur = () => { i.value = String(get()); }; return h('label', { class: 'cgp5-num' }, name, i, 'px'); };
    const nums = h('div', { class: 'cgp5-row' }), note = h('div', { class: 'cgp5-note' });
    const posChips = ['static', 'relative', 'absolute'].map((k) => h('button', { class: 'cgp5-chip', type: 'button', 'data-k': k, onclick: () => { S.pos = k; if (k === 'absolute') { S.tA = -6; S.rA = -6; } if (k === 'relative') { S.tR = 8; S.lR = 16; } D.refresh(true); } }, k));
    const parChip = h('button', { class: 'cgp5-chip', type: 'button', onclick: () => { S.par = !S.par; D.refresh(true); } }, icon('square'), ' 親 .bell が relative');
    D.onRefresh = () => {
      const pe = S.pos === 'absolute', v = S.pos === 'relative' ? { t: S.tR, x: S.lR, xn: 'left' } : { t: S.tA, x: S.rA, xn: 'right' };
      posChips.forEach((c) => c.classList.toggle('sel', c.dataset.k === S.pos));
      parChip.disabled = !pe; parChip.classList.toggle('sel', pe && S.par); parChip.firstChild.replaceWith(icon(pe && S.par ? 'square-check' : 'square'));
      note.innerHTML = S.pos === 'static' ? 'static では top / left / right は<b>効かない</b>。' : S.pos === 'relative' ? '<b>relative の子は、親に関係なく「自分のもとの場所」が基準</b>（親の relative は効かない）。' : (S.par ? '親（ベル）が relative → <b>ベルが基準</b>。' : '親に relative が無い → <b>ページの角が基準</b>。親をオンにしてみよう。');
      nums.replaceChildren(num('top', () => (S.pos === 'relative' ? S.tR : S.tA), (n) => { if (S.pos === 'relative') S.tR = n; else S.tA = n; }), num(v.xn, () => (S.pos === 'relative' ? S.lR : S.rA), (n) => { if (S.pos === 'relative') S.lR = n; else S.rA = n; }));
    };
    D.refresh(false);
    return h('div', null, h('div', { class: 'cgp5-row' }, h('b', '.badge'), ...posChips, h('b', { style: { marginLeft: '8px' } }, '親'), parChip, nums), note, D.el);
  }

  /* ---- 「よく使う形」：別の独立したデモ（before → after を動きで見る）---- */
  const CGP5_PRE = {
    ribbon: { n: 'NEW のリボン',
      html: '<div class="card">案件：未払い残業代の相談<span class="ribbon">NEW</span></div>',
      base: '.card{display:block;margin:34px 24px;padding:18px 16px;background:#f1f5f9;border-radius:10px;font-weight:700}.ribbon{background:#f59e0b;color:#fff;border-radius:6px;padding:0 .6em;font:800 .75rem/1.8 system-ui}',
      before: ['.card {\n  /* position なし */\n}', '.ribbon {\n  position: absolute;\n  top: -8px; right: -8px;\n}'], after: ['.card {\n  position: relative;\n}', '.ribbon {\n  position: absolute;\n  top: -8px; right: -8px;\n}'],
      cssB: '.ribbon{position:absolute;top:-8px;right:-8px}', cssA: '.card{position:relative}.ribbon{position:absolute;top:-8px;right:-8px}', say: 'カードに relative が無いと、リボンはページの角へ飛ぶ。足すと<b>カードの右上の角</b>に貼りつく。', mover: '.ribbon' },
    close: { n: '閉じる ×（モーダルの角）',
      html: '<div class="modal">送信しました。<br>ご連絡をお待ちください。<button class="close">×</button></div>',
      base: '.modal{margin:30px 40px;padding:26px 24px;background:#fff;border:1px solid #cbd5e1;border-radius:10px;box-shadow:0 8px 24px -12px rgba(0,0,0,.4);font-weight:700}.close{border:0;background:#e2e8f0;border-radius:50%;width:26px;height:26px;cursor:pointer;font-weight:900}',
      before: ['.modal {\n  /* position なし */\n}', '.close {\n  position: absolute;\n  top: 8px; right: 10px;\n}'], after: ['.modal {\n  position: relative;\n}', '.close {\n  position: absolute;\n  top: 8px; right: 10px;\n}'],
      cssB: '.close{position:absolute;top:8px;right:10px}', cssA: '.modal{position:relative}.close{position:absolute;top:8px;right:10px}', say: 'モーダルに relative が無いと、×はページの角へ飛ぶ。足すと<b>モーダルの右上</b>に収まる。', mover: '.close' },
    arrow: { n: '吹き出しの矢印',
      html: '<div class="tip">初回30分は無料です<span class="arrow"></span></div>',
      base: '.tip{display:inline-block;margin:44px 24px;padding:10px 16px;background:#1e293b;color:#fff;border-radius:8px;font-weight:700}.arrow{width:12px;height:12px;background:#1e293b;transform:rotate(45deg)}',
      before: ['.tip {\n  /* position なし */\n}', '.arrow {\n  position: absolute;\n  bottom: -6px; left: 20px;\n}'], after: ['.tip {\n  position: relative;\n}', '.arrow {\n  position: absolute;\n  bottom: -6px; left: 20px;\n}'],
      cssB: '.arrow{position:absolute;bottom:-6px;left:20px}', cssA: '.tip{position:relative}.arrow{position:absolute;bottom:-6px;left:20px}', say: '吹き出しに relative が無いと、矢印はページの下へ飛ぶ。足すと<b>吹き出しの下</b>に貼りつく。', mover: '.arrow' },
  };
  function presetPanel() {
    const keys = Object.keys(CGP5_PRE); let cur = 'ribbon', on = false, d = null, auto = 0, prev = [];
    const o2 = {};
    const fr = h('iframe', { sandbox: 'allow-same-origin', title: 'よく使う形', style: { height: '170px' } });
    const pre2 = h('div', { class: 'cgp5-pre' }), say2 = h('div', { class: 'cgp5-note' });
    const tabs = h('div', { class: 'cgp5-row' }, ...keys.map((k) => h('button', { class: 'cgp5-chip', type: 'button', 'data-k': k, onclick: () => open(k) }, CGP5_PRE[k].n)));
    const tog = h('button', { class: 'cgp5-mini on', type: 'button', onclick: () => { clearTimeout(auto); flip(!on, true); } });
    function drawCode(animate) {
      const P = CGP5_PRE[cur], src = (on ? P.after : P.before).join('\n\n'), lines = src.split('\n'), c = code(src, 'css', { file: 'style.css', color: TS });
      pre2.replaceChildren(c);
      if (animate) lines.forEach((l, i) => { if (prev[i] !== l) c.lines[i].classList.add('fl'); });
      prev = lines;
      tog.replaceChildren(icon(on ? 'rotate-ccw' : 'wand-sparkles'), on ? '親の relative をはずす' : '親に relative を足す');
      say2.innerHTML = (on ? '' : '<b>いま：親に relative なし。</b>') + P.say;
    }
    function flip(next, animate) {
      on = next; const P = CGP5_PRE[cur];
      if (d && d.getElementById('u')) {
        const m = d.querySelector(P.mover), before = m.getBoundingClientRect();
        d.getElementById('u').textContent = on ? P.cssA : P.cssB;
        const after = m.getBoundingClientRect();
        if (animate) { const dx = before.left - after.left, dy = before.top - after.top; if (Math.abs(dx) + Math.abs(dy) > 0.5) m.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }], { duration: 750, easing: 'cubic-bezier(.3,1.1,.4,1)' }); }
      }
      drawCode(animate);
    }
    function open(k) {
      cur = k; on = false; clearTimeout(auto); prev = [];
      if (o2.htm) o2.htm.replaceChildren(htmlToggle(CGP5_PRE[k].html));
      tabs.querySelectorAll('.cgp5-chip').forEach((b) => b.classList.toggle('sel', b.dataset.k === k));
      const P = CGP5_PRE[k];
      fr.onload = () => { d = fr.contentDocument; drawCode(false); auto = setTimeout(() => flip(true, true), 900); };
      fr.srcdoc = '<!doctype html><meta charset="utf-8"><style>html,body{margin:0}body{font:14px/1.6 system-ui,"Hiragino Sans",sans-serif;color:#1f2937;background:#fff;min-height:100vh}' + P.base + '</style><style id="u">' + P.cssB + '</style><body>' + P.html;
    }
    const htm2 = h('div');
    const root = h('div', null, tabs, h('div', { class: 'cgp5-grid', style: { marginTop: '8px' } }, h('div', null, h('div', { class: 'cgp5-pg' }, fr), h('div', { class: 'cgp5-row', style: { marginTop: '6px' } }, tog)), h('div', { class: 'cgp5-side' }, htm2, pre2)), say2);
    o2.htm = htm2;
    setTimeout(() => open('ribbon'), 0);
    return root;
  }

  function positionStory(el) {
    style('cgp5', `
    .cgp5-row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.cgp5-row>b{font-size:.75rem}
    .cgp5-chip,.cgp5-mini{all:unset;cursor:pointer;padding:.28em .8em;border-radius:8px;font:700 .75rem var(--mono);background:var(--card);border:1px solid var(--line);transition:.2s;display:inline-flex;align-items:center;gap:.4em}
    .cgp5-chip:hover,.cgp5-mini:hover{background:var(--card2)}.cgp5-chip.sel,.cgp5-mini.on{background:color-mix(in srgb,var(--ts) 24%,var(--card));border-color:var(--ts)}
    .cgp5-chip[disabled]{opacity:.4;cursor:default}.cgp5-mini .ic{width:13px;height:13px}
    .cgp5-num{display:flex;align-items:center;gap:4px;font:700 .75rem var(--mono)}.cgp5-num input{width:4em;padding:.2em .4em;border-radius:6px;border:1px solid var(--line);background:var(--bg2);color:var(--text);font:inherit}.cgp5-num input:disabled{opacity:.4}
    .cgp5-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;align-items:start}@media(max-width:760px){.cgp5-grid{grid-template-columns:1fr}}
    .cgp5-pg{border-radius:10px;overflow:hidden;border:1px solid var(--line);background:#fff}.cgp5-pg iframe{display:block;width:100%;border:0}
    .cgp5-bar{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:4px}.cgp5-bar .label{margin:0}
    .cgp5-pre pre.code{font-size:.75rem}.cgp5-pre pre.code .ln.fl{animation:cgp5fl 1.1s ease}
    @keyframes cgp5fl{0%{background:rgba(255,211,122,.55)}100%{background:transparent}}
    .cgp5-htm{margin-top:6px}.cgp5-htm[hidden]{display:none}
    .cgp5-note{margin-top:8px;padding:.45em .8em;border-radius:8px;background:var(--card);border:1px solid var(--line);font-size:.8125rem;line-height:1.7}
    .cgp5-key{display:none;margin-top:8px;padding:.5em .9em;border-radius:10px;border:2px solid var(--ok);background:color-mix(in srgb,var(--ok) 10%,transparent);font-weight:800;font-size:.875rem;line-height:1.7}.cgp5-key.on{display:block;animation:cgp5k .5s ease}
    @keyframes cgp5k{from{transform:translateY(6px);opacity:0}to{transform:none;opacity:1}}
    .cga{margin-top:10px;border:1px solid var(--line);border-radius:10px;background:var(--card)}
    .cga>button{all:unset;box-sizing:border-box;width:100%;cursor:pointer;display:flex;align-items:center;gap:.6em;padding:.6em 1em;font-weight:800;font-size:.875rem}.cga>button span{flex:1}
    .cga>button .ic:last-child{transition:transform .2s;color:var(--mute)}.cga.open>button .ic:last-child{transform:rotate(180deg)}
    .cga .cga-bd{display:none;padding:0 1em 1em}.cga.open .cga-bd{display:block}
    `);
    const D = bellDemo(215);
    const key = h('div', { class: 'cgp5-key', html: '<b>relative は、自分を動かすためではなく、子の「基準」にするために付ける。</b>' });
    const STEPS = [
      { s: { pos: 'static', par: false }, say: '<b>① static（ふつう）</b>：赤い数字は「通知」のすぐ後ろ。流れの中にいる。' },
      { s: { pos: 'absolute', par: false, tA: 6, rA: 6 }, say: '<b>② absolute だけ</b>：流れから外れて<b>ページの角へ飛んだ</b>。基準が無い → 迷子。' },
      { s: { pos: 'absolute', par: true, tA: -6, rA: -6 }, say: '<b>③ 親に relative を足す</b>：<b>ベルの角にぴったり</b>。ベルが基準。', key: true },
      { s: { pos: 'relative', par: false, tR: 8, lR: 16 }, say: '<b>④ おまけ：子に relative</b>：もとの場所（点線）から少しずれるだけ。ふつうは使わない。' },
    ];
    const goStep = (n) => { key.classList.toggle('on', !!STEPS[n].key); D.set(STEPS[n].s, true); };
    el.append(stepper({ color: TS, steps: STEPS.map((x) => ({ say: x.say })), init(vis) { vis.append(D.el, key); }, update(n) { goStep(n); } }));
    el.append(accordion('じぶんで触る（自分のページで、チップと数字で試す）', 'sliders-horizontal', bellPlay), accordion('よく使う形（別のデモ：NEW・閉じる×・吹き出し）', 'sparkles', presetPanel));
    el.append(h('div', { class: 'cgp5-note' }, 'ページに固定する ', h('code', 'fixed'), ' と、スクロールで止まる ', h('code', 'sticky'), ' は次のシーンへ。'));
  }

  /* ============================================================
     fixed と sticky：料金ページを自動でスクロールして、動くか止まるかを目で見る
  ============================================================ */
  function scrollStory(el) {
    style('cgf6', `
    .cgf6-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:0 0 8px}.cgf6-row>b{font-size:.8125rem;min-width:8.5em}
    .cgf6-chip{all:unset;cursor:pointer;padding:.35em .9em;border-radius:8px;font:700 .8125rem var(--mono);background:var(--card);border:1px solid var(--line);transition:.2s}
    .cgf6-chip:hover{background:var(--card2)}.cgf6-chip.sel{background:color-mix(in srgb,var(--ts) 24%,var(--card));border-color:var(--ts)}
    .cgf6-wrap{display:grid;grid-template-columns:minmax(0,1fr) 26px;gap:8px;align-items:stretch}
    .cgf6-pg{border-radius:10px;overflow:hidden;border:1px solid var(--line);background:#fff}.cgf6-pg iframe{display:block;width:100%;border:0}
    .cgf6-ruler{position:relative;border-radius:8px;background:var(--card);border:1px solid var(--line)}.cgf6-ruler i{position:absolute;left:3px;right:3px;border-radius:6px;background:var(--ts);transition:top .08s linear}
    .cgf6-pre pre.code .ln.fl{animation:cgf6fl 1.1s ease}@keyframes cgf6fl{0%{background:rgba(255,211,122,.55)}100%{background:transparent}}
    .cgf6-say{padding:.7em 1em;border-radius:10px;background:var(--card);border:1px solid var(--line);font-size:.9375rem;font-weight:700;line-height:1.8;margin-top:10px}
    .cgf6-say small{display:inline-block;font:800 .6875rem var(--font);padding:0 .6em;border-radius:6px;border:1px solid var(--ts);color:var(--ts);margin-right:.6em;vertical-align:1px}
    .cgf6-st-b{display:inline-block;font:800 .75rem var(--font);padding:.2em .8em;border-radius:6px;border:1px solid var(--line);background:var(--card)}.cgf6-st-b.mv{border-color:var(--team);color:var(--team)}.cgf6-st-b.stay{border-color:var(--ok);color:var(--ok)}
    .cgf6-st{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.cgf6-st span{font:800 .75rem var(--font);padding:.2em .8em;border-radius:6px;border:1px solid var(--line);background:var(--card)}
    .cgf6-st span.mv{border-color:var(--team);color:var(--team)}.cgf6-st span.stay{border-color:var(--ok);color:var(--ok)}
    .cgf6-gt{margin-top:12px;border:1px solid var(--line);border-radius:10px;background:var(--card)}
    .cgf6-gt>button{all:unset;box-sizing:border-box;width:100%;cursor:pointer;display:flex;align-items:center;gap:.6em;padding:.7em 1em;font-weight:800;font-size:.875rem}
    .cgf6-gt>button .ic:last-child{margin-left:auto;transition:transform .2s}.cgf6-gt.open>button .ic:last-child{transform:rotate(180deg)}
    .cgf6-gt .bd{display:none;padding:0 1em 1em}.cgf6-gt.open .bd{display:block}
    `);
    const BASE = 'html,body{margin:0}body{font:14px/1.6 system-ui,"Hiragino Sans",sans-serif;color:#1f2937;background:#fff}.hd{height:44px;box-sizing:border-box;background:#1e293b;color:#fff;display:flex;align-items:center;padding:0 16px;font-weight:800;z-index:10}.sec{padding:10px 16px 6px}.sec h2{margin:0;padding:8px 0;font-size:1rem;background:#fff;border-bottom:2px solid #e2e8f0;z-index:5}.row{padding:8px 10px;margin:6px 0;border-radius:8px;background:#f1f5f9}table{width:100%;border-collapse:collapse}th,td{padding:7px 10px;border-bottom:1px solid #e2e8f0;text-align:left}th{background:#eef2ff;z-index:4}.q{padding:10px;margin:6px 0;border:1px solid #e2e8f0;border-radius:8px}';
    const PAGE = '<header class="hd">案件管理</header><section class="sec" id="s1"><h2>はじめに</h2><div class="row">初回のご相談は30分まで無料です。</div><div class="row">お電話・オンラインどちらも可能です。</div><div class="row">ご予約はフォームから24時間受付。</div><div class="row">担当の弁護士が事前に内容を確認します。</div></section><section class="sec" id="s2"><h2>料金プラン</h2><table><thead><tr><th>プラン</th><th>時間</th><th>料金</th></tr></thead><tbody><tr><td>初回相談</td><td>30分</td><td>0円</td></tr><tr><td>継続相談</td><td>30分</td><td>5,500円</td></tr><tr><td>継続相談</td><td>60分</td><td>11,000円</td></tr><tr><td>書面の作成</td><td>—</td><td>33,000円</td></tr><tr><td>契約書の確認</td><td>—</td><td>22,000円</td></tr><tr><td>交渉の代理</td><td>—</td><td>55,000円</td></tr></tbody></table></section><section class="sec" id="s3"><h2>よくある質問</h2><div class="q">Q. 相談内容は秘密にされますか？</div><div class="q">Q. キャンセルはできますか？</div><div class="q">Q. 弁護士は選べますか？</div><div class="q">Q. 支払い方法は？</div><div class="q">Q. 土日も対応していますか？</div></section>';
    const S = { hd: 'static', h2: 'static' };
    const frame = h('iframe', { sandbox: 'allow-same-origin', title: 'ライブページ', style: { height: '270px' } });
    const ruler = h('div', { class: 'cgf6-ruler' }, h('i'));
    const say = h('div', { class: 'cgf6-say' }), pre = h('div', { class: 'cgf6-pre' }), st = h('div', { class: 'cgf6-st' });
    let doc = null, first = true, prevLines = [], raf = 0;
    const HDH = 44;
    const cssLines = () => {
      const hd = S.hd === 'static' ? '.hd {\n  position: static;\n}' : S.hd === 'fixed' ? '.hd {\n  position: fixed;\n  top: 0; left: 0; right: 0;\n}' : '.hd {\n  position: sticky;\n  top: 0;\n}';
      const t = S.hd === 'static' ? 0 : HDH;
      const h2 = S.h2 === 'static' ? '.sec h2 {\n  position: static;\n}' : `.sec h2 {\n  position: sticky;\n  top: ${t}px;${t ? '   /* ヘッダーの下で止まる */' : ''}\n}`;
      return hd + '\n\n' + h2;
    };
    const realCss = () => {
      const hd = S.hd === 'static' ? '.hd{position:static}' : S.hd === 'fixed' ? '.hd{position:fixed;top:0;left:0;right:0}' : '.hd{position:sticky;top:0}';
      const t = S.hd === 'static' ? 0 : HDH;
      return hd + (S.h2 === 'sticky' ? `.sec h2{position:sticky;top:${t}px}` : '.sec h2{position:static}');
    };
    function drawCode() {
      const src = cssLines(), lines = src.split('\n'), c = code(src, 'css', { file: 'style.css', color: TS }), old = prevLines;
      pre.replaceChildren(c);
      if (!first) lines.forEach((l, i) => { if (old[i] !== l) c.lines[i].classList.add('fl'); });
      prevLines = lines;
    }
    const SAYS = {
      static: ['static（初期値）', 'ふつうの要素。スクロールすると、<b>ページと一緒に上へ流れて消える</b>。'],
      fixed: ['fixed', '<b>画面に固定</b>。スクロールしても動かず、本文がその下をくぐる。ただし流れから外れるので、<b>本文の先頭がもぐり込む</b>。'],
      sticky: ['sticky', 'ふだんは流れの中。<b>画面の上に来たら止まる</b>。<code>top</code> の指定が必要で、止まるのは<b>親の中にいる間だけ</b>。'],
    };
    function status() {
      if (!doc) return;
      const hd = doc.querySelector('.hd'), hr = hd.getBoundingClientRect();
      const h2s = [...doc.querySelectorAll('.sec h2')], pinned = h2s.find((e) => { const r = e.getBoundingClientRect(); const top = S.hd === 'static' ? 0 : HDH; return S.h2 === 'sticky' && Math.abs(r.top - top) < 1.5 && doc.scrollingElement.scrollTop > 5; });
      const stay = Math.abs(hr.top) < 1;
      st.replaceChildren(h('span', { class: stay ? 'stay' : 'mv' }, 'ヘッダー：' + (stay ? '動かない（くっついている）' : 'スクロールで動く')), h('span', { class: pinned ? 'stay' : 'mv' }, '見出し：' + (S.h2 === 'static' ? 'スクロールで動く' : pinned ? '止まっている（' + pinned.textContent + '）' : 'いまは流れている')));
      const se = doc.scrollingElement, max = Math.max(1, se.scrollHeight - se.clientHeight), th = ruler.firstChild, rh = ruler.clientHeight || 270;
      const len = Math.max(24, rh * se.clientHeight / se.scrollHeight);
      th.style.height = len + 'px'; th.style.top = (se.scrollTop / max) * (rh - len) + 'px';
    }
    function refresh() {
      const k = S.hd; say.innerHTML = '<small>' + SAYS[k][0] + '</small>' + SAYS[k][1] + (S.h2 === 'sticky' ? '<br><small>見出し sticky</small>各セクションの見出しは、<b>そのセクションにいる間だけ</b>止まり、次のセクションに押されて消える。' : '');
      hdChips.forEach((c) => c.classList.toggle('sel', c.dataset.k === S.hd)); h2Chips.forEach((c) => c.classList.toggle('sel', c.dataset.k === S.h2));
      if (doc) { doc.getElementById('u').textContent = realCss(); }
      drawCode(); first = false; status();
    }
    function animScroll(d, to, ms) {
      const se = d.scrollingElement, from = se.scrollTop, t0 = performance.now(); cancelAnimationFrame(raf);
      const ease = (t) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
      const step = (now) => { const t = Math.min(1, (now - t0) / ms); se.scrollTop = from + (to - from) * ease(t); if (t < 1) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step);
    }
    const hdChips = ['static', 'fixed', 'sticky'].map((k) => h('button', { class: 'cgf6-chip', type: 'button', 'data-k': k, onclick: () => { S.hd = k; refresh(); } }, k));
    const h2Chips = ['static', 'sticky'].map((k) => h('button', { class: 'cgf6-chip', type: 'button', 'data-k': k, onclick: () => { S.h2 = k; refresh(); } }, k));
    const goDown = h('button', { class: 'btn primary', type: 'button', onclick: () => { if (doc) animScroll(doc, doc.scrollingElement.scrollHeight, 1600); } }, icon('arrow-down'), 'スクロールする');
    const goUp = h('button', { class: 'btn', type: 'button', onclick: () => { if (doc) animScroll(doc, 0, 1000); } }, icon('arrow-up'), 'もどる');
    frame.addEventListener('load', () => { doc = frame.contentDocument; doc.addEventListener('scroll', status); refresh(); });
    frame.srcdoc = '<!doctype html><meta charset="utf-8"><style>' + BASE + '</style><style id="u"></style><body>' + PAGE;

    /* ---- つまずき ① アンカーで飛ぶと、見出しがヘッダーの下に隠れる ---- */
    function gotchaAnchor() {
      const fr = h('iframe', { sandbox: 'allow-same-origin', title: 'つまずき1', style: { height: '210px' } });
      const A = { margin: false }; let d = null; const out = h('div', { class: 'cgf6-st' }); let pre1 = h('div', { class: 'cgf6-pre' });
      const html = '<header class="hd">案件管理（fixed）</header><div style="height:340px;padding:60px 16px 0">目次 → 「料金」</div><h3 id="price" class="t">料金プラン</h3><p style="padding:0 16px">初回は無料です。</p><div style="height:300px"></div>';
      const css = () => '.hd{position:fixed;top:0;left:0;right:0}.t{margin:0;padding:6px 16px;background:#fde68a;' + (A.margin ? 'scroll-margin-top:56px' : '') + '}';
      const lines = () => '.hd {\n  position: fixed;\n  top: 0;\n}\n\n.t {\n' + (A.margin ? '  scroll-margin-top: 56px;  /* ヘッダーの高さぶん */\n' : '  /* 何も指定していない */\n') + '}';
      let prev = '';
      const draw = () => { const c = code(lines(), 'css', { file: 'style.css', color: TS }); pre1.replaceChildren(c); if (prev && prev !== lines()) c.lines.forEach((l, i) => { if (!prev.split('\n').includes(lines().split('\n')[i])) l.classList.add('fl'); }); prev = lines(); if (d) d.getElementById('u').textContent = css(); chip.classList.toggle('sel', A.margin); chip.firstChild.replaceWith(icon(A.margin ? 'square-check' : 'square')); };
      const chip = h('button', { class: 'cgf6-chip', type: 'button', onclick: () => { A.margin = !A.margin; draw(); } }, icon('square'), ' scroll-margin-top: 56px を付ける');
      const jump = h('button', { class: 'btn primary', type: 'button', onclick: () => { if (!d) return; d.scrollingElement.scrollTop = 0; setTimeout(() => { d.getElementById('price').scrollIntoView({ behavior: 'smooth', block: 'start' }); setTimeout(res, 900); }, 150); } }, icon('link'), '目次の「料金」へジャンプ');
      const res = () => { if (!d) return; const r = d.getElementById('price').getBoundingClientRect(); const ok = r.top >= 43; out.replaceChildren(h('span', { class: ok ? 'stay' : 'mv' }, ok ? '見出しが見える（ヘッダーの下に止まった）' : '見出しがヘッダーの下に隠れた！')); };
      fr.addEventListener('load', () => { d = fr.contentDocument; draw(); });
      fr.srcdoc = '<!doctype html><meta charset="utf-8"><style>' + BASE + '</style><style id="u"></style><body>' + html;
      return h('div', null, h('div', { class: 'cgf6-row' }, chip, jump), h('div', { class: 'split' }, h('div', { class: 'col' }, h('div', { class: 'cgf6-pg' }, fr), out), h('div', { class: 'col' }, htmlToggle('<header class="hd">案件管理</header>\n…\n<h3 id="price" class="t">\n  料金プラン\n</h3>', { raw: true }), pre1)));
    }

    /* ---- つまずき ②  sticky が効かない（top が無い）：左右を並べて、同時にスクロールして比べる ---- */
    function gotchaSticky() {
      const rows = Array.from({ length: 14 }, (_, i) => `<tr><td>案件 ${i + 1}</td><td>相談中</td><td>${(i + 1) * 1100}円</td></tr>`).join('');
      const html = '<table><thead><tr><th>案件</th><th>状態</th><th>料金</th></tr></thead><tbody>' + rows + '</tbody></table>';
      const C = { say: '<b>sticky は「どこで止まるか」を top で決める。</b>top が無いと、止まる位置が無いので、くっつかない。<br><b>じゃあどうする？</b>　<code>top: 0</code> を書いて、止まる位置を決める。',
        L: { title: 'top: 0 なし', css: 'thead th{position:sticky}', lines: 'thead th {\n  position: sticky;\n  /* top が無い ← これが原因 */\n}', bad: 2 },
        R: { title: 'top: 0 あり', css: 'thead th{position:sticky;top:0}', lines: 'thead th {\n  position: sticky;\n  top: 0;\n}', bad: -1 } };
      const side = (spec) => {
        const fr = h('iframe', { sandbox: 'allow-same-origin', title: spec.title, style: { height: '170px' } }), badge = h('span', { class: 'cgf6-st-b' }, '（スクロールして比べよう）');
        const c = code(spec.lines, 'css', { file: 'style.css', color: TS }); if (spec.bad >= 0) c.setHi([spec.bad + 1], 'err');
        const o = { fr, badge, d: null };
        fr.addEventListener('load', () => { o.d = fr.contentDocument; o.d.addEventListener('scroll', () => o.check()); });
        o.load = () => { fr.srcdoc = '<!doctype html><meta charset="utf-8"><style>' + BASE + '</style><style>' + spec.css + '</style><body>' + html; badge.textContent = '（スクロールして比べよう）'; badge.className = 'cgf6-st-b'; };
        o.check = () => { const d = o.d; if (!d) return; const th = d.querySelector('thead th'), se = d.scrollingElement; if (se.scrollTop <= 20) return; const stuck = Math.abs(th.getBoundingClientRect().top) < 1.5; badge.textContent = stuck ? 'くっつく（画面の上で止まる）' : 'くっつかない（流れて消える）'; badge.className = 'cgf6-st-b ' + (stuck ? 'stay' : 'mv'); };
        o.el = h('div', { class: 'col' }, h('div', { style: { fontWeight: 800, fontSize: '.8125rem', margin: '0 0 4px' } }, spec.title), h('div', { class: 'cgf6-pg' }, fr), h('div', { style: { margin: '6px 0' } }, badge), c);
        return o;
      };
      const L = side(C.L), R = side(C.R); let raf2 = 0, down = false;
      const go = h('button', { class: 'btn primary', type: 'button', onclick: () => { down = !down; const to = down ? 160 : 0, t0 = performance.now(); cancelAnimationFrame(raf2); const f = [L, R].map((x) => x.d.scrollingElement.scrollTop); const stp = (now) => { const t = Math.min(1, (now - t0) / 900), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; [L, R].forEach((x, i) => { x.d.scrollingElement.scrollTop = f[i] + (to - f[i]) * e; }); if (t < 1) raf2 = requestAnimationFrame(stp); else { L.check(); R.check(); } }; raf2 = requestAnimationFrame(stp); } }, icon('arrow-down-up'), '2つ同時にスクロールして比べる');
      L.load(); R.load();
      return h('div', null,
        htmlToggle('<table>\n  <thead>\n    <tr>\n      <th>案件</th> …\n    </tr>\n  </thead>\n  <tbody> … </tbody>\n</table>', { raw: true }),
        h('div', { class: 'cgf6-row', style: { margin: '8px 0' } }, go), h('div', { class: 'split' }, L.el, R.el),
        h('div', { class: 'cgf6-say', style: { marginTop: '8px', fontSize: '.8125rem' }, html: C.say }));
    }
    const gt = (title, ic, build) => { let built = null; const box = h('div', { class: 'cgf6-gt' }); const bd = h('div', { class: 'bd' }); box.append(h('button', { type: 'button', onclick: () => { box.classList.toggle('open'); if (!built) { built = build(); bd.append(built); } } }, icon(ic), title, icon('chevron-down')), bd); return box; };

    el.append(h('div', null,
      h('div', { class: 'cgf6-row' }, h('b', 'ヘッダー .hd'), ...hdChips),
      h('div', { class: 'cgf6-row' }, h('b', 'セクションの見出し h2'), ...h2Chips),
      h('div', { class: 'split' },
        h('div', { class: 'col' }, lbl('料金ページ（自分でもスクロールできる）'), h('div', { class: 'cgf6-wrap' }, h('div', { class: 'cgf6-pg' }, frame), ruler),
          h('div', { class: 'cgf6-row', style: { marginTop: '10px' } }, goDown, goUp), st),
        h('div', { class: 'col' }, lbl('style.css（変わった行が光る）'), htmlToggle('<header class="hd">案件管理</header>\n<section>\n  <h2>はじめに</h2>\n  …\n</section>\n<section>\n  <h2>料金プラン</h2>\n  <table> … </table>\n</section>', { raw: true }), pre)),
      say,
      gt('つまずき ①　アンカーリンクで飛ぶと、見出しがヘッダーの下に隠れる', 'triangle-alert', gotchaAnchor),
      gt('つまずき ②　sticky を書いたのにくっつかない（top が無い）', 'triangle-alert', gotchaSticky)));
    new ResizeObserver(() => status()).observe(frame);
  }

  function boxScene(el) {
    const S = { w: 160, p: 24, b: 8, m: 24, bb: false };
    const stage = h('div', { class: 'cg-box' }), codeBox = h('div'), tot = h('div', { class: 'st-cap' });
    function draw() {
      const outer = h('div', { class: 'lay', style: { background: 'color-mix(in srgb,var(--team) 28%,transparent)', padding: S.m + 'px', outline: '1px dashed var(--team)' } },
        h('span', { class: 'tg', style: { color: 'var(--team)' } }, 'margin'),
        h('div', { class: 'lay', style: { border: `${S.b}px solid var(--pink)`, background: 'color-mix(in srgb,var(--basic) 30%,transparent)', padding: S.p + 'px', boxSizing: S.bb ? 'border-box' : 'content-box', width: S.w + 'px', transition: 'all .25s' } },
          h('span', { class: 'tg', style: { color: 'var(--basic)', top: '-' + Math.max(0, S.b - 0) + 'px' } }, S.b > 0 ? '' : ''),
          h('div', { style: { background: 'var(--ts)', color: '#fff', padding: '10px', borderRadius: '6px', font: '700 .85rem var(--mono)', textAlign: 'center', minHeight: '40px', display: 'grid', placeItems: 'center' } }, 'content')));
      const labels = h('div', { class: 'row', style: { marginTop: '10px', justifyContent: 'center', font: '700 .72rem var(--mono)' } }, h('span', { style: { color: 'var(--team)' } }, '■ margin'), h('span', { style: { color: 'var(--pink)' } }, '■ border'), h('span', { style: { color: 'var(--basic)' } }, '■ padding'), h('span', { style: { color: 'var(--ts)' } }, '■ content'));
      stage.replaceChildren(h('div', null, outer, labels));
      codeBox.replaceChildren(code(`.box {\n  ${S.bb ? 'box-sizing: border-box;\n  ' : ''}width: ${S.w}px;\n  padding: ${S.p}px;\n  border: ${S.b}px solid #ff6b9d;\n  margin: ${S.m}px;\n}`, 'css', { file: 'style.css', color: TS }));
      const total = S.bb ? Math.max(S.w, 2 * (S.p + S.b)) : S.w + 2 * (S.p + S.b);
      tot.innerHTML = S.bb ? `<b>border-box</b>：width ${S.w} が「枠線まで含めた幅」→ 見た目の幅 = <b>${total}px</b>` + (S.w < 2 * (S.p + S.b) ? '（padding と border だけで幅を超えるので、<b>' + total + 'px</b> より小さくならない）' : '') : `<b>content-box</b>（初期値）：見た目の幅 = ${S.w} + padding ${S.p}×2 + border ${S.b}×2 = <b>${total}px</b>`;
    }
    const sl = [['width', 'w', 80, 200, TS], ['padding', 'p', 0, 50, BASIC], ['border', 'b', 0, 20, PINK], ['margin', 'm', 0, 50, TEAM]].map(([l, k, a, b, c]) => slider(l, a, b, S[k], 'px', (v) => { S[k] = v; draw(); }, c));
    const chk = h('label', { class: 'row', style: { cursor: 'pointer', fontWeight: 800 } }, h('input', { type: 'checkbox', onchange: (e) => { S.bb = e.target.checked; draw(); } }), h('span', 'box-sizing: border-box にする'));
    stage.style.flex = '1 1 auto';
    el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('スライダーで動かす'), h('div', { class: 'card col' }, sl, chk), codeBox), h('div', { class: 'col' }, lbl('結果'), stage, tot)));
    draw();
  }

  function flexScene(el) {
    const S = { dir: 'row', jc: 'flex-start', ai: 'stretch', wrap: 'nowrap', gap: 10, n: 4 };
    const fx = h('div', { class: 'cg-fx' }), cb = h('div'), ax = h('div', { class: 'st-cap' });
    const cols = [BASIC, TS, PINK, TEAM, VIO, VUE, '#ff8a65', '#ffd54f'];
    function draw() {
      Object.assign(fx.style, { flexDirection: S.dir, justifyContent: S.jc, alignItems: S.ai, flexWrap: S.wrap, gap: S.gap + 'px' });
      const sizes = [[60, 50], [80, 90], [50, 70], [90, 60], [70, 80], [60, 60], [80, 50], [50, 90]];
      fx.replaceChildren(...Array.from({ length: S.n }, (_, i) => h('div', { style: { background: cols[i % 8], width: S.ai === 'stretch' && S.dir.startsWith('column') ? 'auto' : sizes[i][0] + 'px', height: S.ai === 'stretch' && S.dir.startsWith('row') ? 'auto' : sizes[i][1] + 'px', minHeight: S.ai === 'stretch' ? '0' : undefined } }, i + 1)));
      cb.replaceChildren(code(`.container {\n  display: flex;\n  flex-direction: ${S.dir};\n  justify-content: ${S.jc};\n  align-items: ${S.ai};\n  flex-wrap: ${S.wrap};\n  gap: ${S.gap}px;\n}`, 'css', { file: 'style.css', color: TS }));
      const row = S.dir.startsWith('row');
      ax.innerHTML = `主軸 ${row ? '➡ 横' : '⬇ 縦'}（<b>justify-content</b> が効く）／交差軸 ${row ? '⬇ 縦' : '➡ 横'}（<b>align-items</b> が効く）${S.dir.endsWith('reverse') ? '　※ reverse で順番が逆' : ''}`;
    }
    const mk = (l, opts, k) => h('div', null, h('div', { class: 'label' }, l), seg(opts, S[k], (v) => { S[k] = v; draw(); }));
    el.append(h('div', { class: 'split wide-l' }, h('div', { class: 'col' }, fx, cb),
      h('div', { class: 'col' }, h('div', { class: 'col card' }, mk('flex-direction', ['row', 'row-reverse', 'column', 'column-reverse'], 'dir'), mk('justify-content', ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'], 'jc'), mk('align-items', ['stretch', 'flex-start', 'center', 'flex-end'], 'ai'), mk('flex-wrap', ['nowrap', 'wrap'], 'wrap'),
        slider('gap', 0, 40, S.gap, 'px', (v) => { S.gap = v; draw(); }, PINK),
        h('div', { class: 'row' }, h('span', { style: { fontWeight: 800 } }, 'アイテム数'), btn('−', () => { S.n = Math.max(1, S.n - 1); draw(); }), btn('＋', () => { S.n = Math.min(8, S.n + 1); draw(); }))), ax)));
    draw();
  }

  function fontScene(el) {
    const S = { size: 22, fam: 'sans-serif', w: 400, lh: 1.6, deco: 'none', col: '#222222' };
    const prev = h('div', { class: 'gap-prev' }), codeBox = h('div');
    const draw = () => {
      prev.replaceChildren(h('p', { style: { margin: 0, fontSize: S.size + 'px', fontFamily: S.fam, fontWeight: S.w, lineHeight: S.lh, textDecoration: S.deco, color: S.col, transition: 'all .25s' } }, 'Webページの文字は CSS で自在に変わる。', h('br'), 'Hello, Font & Text!'));
      codeBox.replaceChildren(code(`p {\n  font-size: ${S.size}px;\n  font-family: ${S.fam};\n  font-weight: ${S.w};\n  line-height: ${S.lh};\n  text-decoration: ${S.deco};\n  color: ${S.col};\n}`, 'css', { file: 'style.css', color: BASIC }));
    };
    const slider = (label, key, min, max, step, unit = '') => { const o = h('output', S[key] + unit); return h('div', { class: 'gap-row' }, h('span', label), h('input', { type: 'range', min, max, step, value: S[key], oninput: (e) => { S[key] = +e.target.value; o.textContent = S[key] + unit; draw(); } }), o); };
    const chips = (label, key, vals) => { const box = h('div', { class: 'gap-chips' }); const rd = () => [...box.children].forEach((b) => b.classList.toggle('on', String(b.dataset.v) === String(S[key]))); vals.forEach(([v, t]) => box.append(h('button', { class: 'gap-chip', 'data-v': v, onclick: () => { S[key] = typeof S[key] === 'number' ? +v : v; rd(); draw(); } }, t || v))); rd(); return h('div', null, lbl(label), box); };
    const ctl = h('div', { class: 'gap-ctl' },
      slider('font-size', 'size', 12, 44, 1, 'px'), slider('line-height', 'lh', 1, 2.6, .1),
      chips('font-family', 'fam', [['sans-serif'], ['serif'], ['monospace']]), chips('font-weight', 'w', [[400, '400 normal'], [700, '700 bold'], [900, '900']]),
      chips('text-decoration', 'deco', [['none'], ['underline'], ['line-through']]), chips('color', 'col', [['#222222', 'black'], ['#e0245e', 'pink'], ['#2563eb', 'blue'], ['#15803d', 'green']]));
    Object.assign(prev.style, { flex: '1 1 auto', minHeight: '240px', display: 'grid', alignContent: 'center' });
    el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('操作パネル'), ctl, codeBox), h('div', { class: 'col' }, lbl('結果'), prev)));
    draw();
  }

  function displayScene(el) {
    const S = { d: 'inline', big: false };
    const NOTE = { inline: ['inline：文章の流れに並ぶ。<b>width / height は効かない</b>。', 'ここは文字の幅だけ'], 'inline-block': ['inline-block：並ぶのに <b>width / height が効く</b>。いいとこ取り！', ''], block: ['block：<b>1行まるごと</b>使う。幅・高さも効く。', ''] };
    const spans = ['A', 'B', 'C'].map((t) => h('span', { class: 'x' }, t));
    const box = h('div', { class: 'gap-dsp' }, 'これは文章のなかに ', spans[0], ' と ', spans[1], ' と ', spans[2], ' が入っている例です。ブラウザは基本、文字を左から右へ並べます。');
    const note = h('div', { class: 'gap-note' }), codeBox = h('div');
    const draw = () => {
      spans.forEach((s) => { s.style.display = S.d; s.classList.toggle('big', S.big); });
      note.innerHTML = NOTE[S.d][0] + (S.big && S.d === 'inline' ? ' ← 90×50 を指定しても<b>変わらない</b>！' : '');
      codeBox.replaceChildren(code(`.x {\n  display: ${S.d};` + (S.big ? '\n  width: 90px;\n  height: 50px;' : '') + '\n}', 'css', { file: 'style.css', color: BASIC }));
      btns.forEach((b) => b.classList.toggle('on', b.dataset.v === S.d));
    };
    const btns = ['inline', 'inline-block', 'block'].map((v) => h('button', { class: 'gap-chip', 'data-v': v, onclick: () => { S.d = v; draw(); } }, v));
    const sw = h('label', { class: 'row', style: { cursor: 'pointer', fontWeight: 800 } }, h('input', { type: 'checkbox', onchange: (e) => { S.big = e.target.checked; draw(); } }), 'width: 90px / height: 50px を指定');
    el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('display を選ぶ'), h('div', { class: 'gap-chips' }, btns), sw, note, codeBox), h('div', { class: 'col' }, lbl('結果（A・B・C が対象）'), box)));
    draw();
  }

  function stickyScene(el) {
    const MODES = { static: '標準：スクロールで一緒に流れて消える。', sticky: 'sticky：ふだんは流れる → <b>top:0 に来たらピタッと止まる</b>。', fixed: 'fixed：<b>画面に固定</b>。元の場所は空いて、下の内容が潜り込む。', absolute: 'absolute：親(relative)基準の位置に置かれ、親と一緒に流れる。' };
    let mode = 'static';
    const hd = h('div', { class: 'hd' }, 'ヘッダー（このバーに注目）');
    const sc = h('div', { class: 'gap-scroll' }, h('div', { class: 'banner' }, 'ロゴ領域'), hd, ...Array.from({ length: 22 }, (_, i) => h('p', `${i + 1}. スクロールしてね — 本文の行です。`)));
    const note = h('div', { class: 'gap-note' }), codeBox = h('div'), pos = h('span', { class: 'chip', style: { '--c': TEAM } }, 'scrollTop: 0');
    sc.addEventListener('scroll', () => { pos.textContent = 'scrollTop: ' + Math.round(sc.scrollTop); });
    const draw = () => {
      hd.style.position = mode; hd.style.top = mode === 'static' ? '' : '0';
      note.innerHTML = MODES[mode];
      codeBox.replaceChildren(code(`.header {\n  position: ${mode};` + (mode === 'static' ? '' : '\n  top: 0;') + '\n}', 'css', { file: 'style.css', color: BASIC }));
      btns.forEach((b) => b.classList.toggle('on', b.dataset.v === mode));
      sc.scrollTo({ top: 70, behavior: 'smooth' });
    };
    const btns = Object.keys(MODES).map((v) => h('button', { class: 'gap-chip', 'data-v': v, onclick: () => { mode = v; draw(); } }, v));
    el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('position を選ぶ → 右をスクロール'), h('div', { class: 'gap-chips' }, btns), note, codeBox, h('div', null, pos)), h('div', { class: 'col' }, lbl('スクロール領域'), sc)));
    draw();
  }

  function zScene(el) {
    const C = [{ n: 'A', c: '#6fdc7c', z: 1, pos: true, dx: 0 }, { n: 'B', c: '#5b9dff', z: 2, pos: true, dx: 60 }, { n: 'C', c: '#ff8fb7', z: 3, pos: true, dx: 120 }];
    const stack = h('div', { class: 'gap-stack' }), list = h('div', { class: 'col' }), cds = C.map((o) => h('div', { class: 'cd', onclick: () => { o.z = Math.max(...C.map((x) => x.z)) + 1; draw(); } }));
    cds.forEach((e) => stack.append(e));
    const draw = () => {
      C.forEach((o, i) => {
        const e = cds[i]; e.style.background = o.c; e.style.marginLeft = o.dx + 'px'; e.style.marginTop = i * 26 + 'px';
        e.style.position = o.pos ? 'relative' : 'static'; e.style.zIndex = o.pos ? o.z : 'auto';
        e.replaceChildren(h('div', o.n, h('small', o.pos ? 'z-index: ' + o.z : 'static → 無視')));
      });
      const ord = C.map((o, i) => ({ ...o, i })).sort((a, b) => (b.pos ? b.z : -1) - (a.pos ? a.z : -1) || b.i - a.i);
      list.replaceChildren(lbl('前 → 奥の順番'), h('div', { class: 'row' }, ord.map((o, k) => h('span', { class: 'chip', style: { '--c': o.c, fontSize: '.875rem' } }, `${k + 1}. ${o.n}`))),
        code(C.map((o) => `.${o.n.toLowerCase()} {` + (o.pos ? ` position: relative; z-index: ${o.z}; ` : ' /* position なし */ ') + '}').join('\n'), 'css', { file: 'style.css', color: BASIC }));
    };
    const tog = h('button', { class: 'gap-chip', onclick: () => { C[2].pos = !C[2].pos; tog.classList.toggle('on', !C[2].pos); draw(); } }, 'C の position を外す');
    const rst = h('button', { class: 'gap-chip', onclick: () => { C.forEach((o, i) => { o.z = i + 1; o.pos = true; }); tog.classList.remove('on'); draw(); } }, 'リセット');
    el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('カードをクリック → 最前面へ'), stack), h('div', { class: 'col' }, list, h('div', { class: 'row' }, tog, rst), h('div', { class: 'gap-note', html: '💡 z-index は <b>position を付けた要素</b>（と flex・grid の子）に効く。position を外すと効かなくなって、奥に潜るよ。' }))));
    draw();
  }

  function scssCompile(src) {
    const vars = {}, out = []; let i = 0;
    let s = src.replace(/\/\/.*$/gm, '');
    s = s.replace(/\$([\w-]+)\s*:\s*([^;]+);/g, (m, k, v) => { vars[k] = v.trim().replace(/\$([\w-]+)/g, (mm, kk) => vars[kk] ?? mm); return ''; });
    s = s.replace(/\$([\w-]+)/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
    function parse(sel) {
      const r = { sel, decl: [] }; if (sel != null) out.push(r);
      let buf = '';
      while (i < s.length) {
        const c = s[i++];
        if (c === '{') { const raw = buf.trim(); buf = ''; parse(sel == null ? raw : sel.split(',').flatMap((par) => raw.split(',').map((ch) => (ch.includes('&') ? ch.trim().replace(/&/g, par.trim()) : par.trim() + ' ' + ch.trim()))).join(', ')); }
        else if (c === ';') { if (buf.trim()) r.decl.push(buf.trim() + ';'); buf = ''; }
        else if (c === '}') { if (buf.trim()) r.decl.push(buf.trim() + ';'); return; }
        else buf += c;
      }
    }
    parse(null);
    return out.filter((r) => r.decl.length).map((r) => r.sel + ' {\n' + r.decl.map((d) => '  ' + d).join('\n') + '\n}').join('\n\n');
  }

  function sassScene(el) {
    const init = '$main: #5b9dff;\n$gap: 14px;\n\n.card {\n  padding: $gap;\n  border: 2px solid $main;\n  border-radius: 8px;\n  h3 { color: $main; }\n  &:hover { background: #eef4ff; }\n  .btn { margin-top: $gap; }\n}\n';
    const out = h('div'), frame = h('iframe', { sandbox: '', style: { width: '100%', height: '150px', border: '1px solid var(--line)', borderRadius: '8px', background: '#fff' } });
    const draw = (v) => { let c; try { c = scssCompile(v); } catch (e) { c = '/* エラー */'; } out.replaceChildren(code(c || '/* ここに CSS が出る */', 'css', { file: '出力：style.css', color: TS })); frame.srcdoc = `<style>body{font-family:sans-serif;margin:12px}${c}</style><div class="card"><h3>カード</h3><button class="btn">ボタン</button></div>`; };
    const ed = K.W.codeEditor(init, 'css', draw); ed.style.borderRadius = '8px'; ed.style.minHeight = '300px';
    out.className = 'fo1-grow';
    el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('Sass / SCSS（編集OK）'), ed, lbl('見た目（結果）'), frame),
      h('div', { class: 'col' }, lbl('コンパイル結果 = ふつうの CSS'), out, h('div', { class: 'row' }, h('span', { class: 'chip', style: { '--c': BASIC } }, '$変数：値を1か所で管理'), h('span', { class: 'chip', style: { '--c': TS } }, 'ネスト：親の中に子を書く'), h('span', { class: 'chip', style: { '--c': PINK } }, '&：親セレクタの別名')))));
    draw(init);
  }

  K.reg({
    id: 'css', track: 'basic', title: 'CSS', sub: '見た目をつくる', emoji: '🎨',
    scenes: [
      { t: 'CSS の付け方 3 通り', lead: 'ブランドカラーを変えることになった。<b>書き方しだいで、直す場所が1か所にも30か所にもなる</b>。まず体験してみよう。', render(el) { el.append(SYM.attach()); attachScene(el); } },
      { t: 'セレクタと強さ', tag: 'selector', lead: '書いたのに<b>効かない</b>。原因は、他のルールに<b>負けている</b>から。強さのルールは、たったの1つ。', render: selectorScene },
            { t: '文字のスタイル', tag: 'font · text', lead: '文字まわりで<b>よく起きる6つの困りごと</b>。タブごとに「直してみる」を押して、変わり方を見よう。', render(el) { el.append(caseTabs(CASES.font())); } },
            { t: 'ボックスモデル', tag: 'box model', lead: '箱まわりで<b>毎週ぶつかる6つの困りごと</b>。余白・幅・中央寄せ・はみ出し…タブごとに直してみよう。', render(el) { el.append(caseTabs(CASES.box())); } },
            { t: 'display：inline / block', tag: 'display', lead: 'display で起きる<b>現場の困りごと4つ</b>。「なぜか余白が効かない・隙間ができる」の正体を見よう。', render(el) { el.append(caseTabs(CASES.display())); } },
            { t: 'Flexbox で並べる', tag: 'display:flex', lead: 'Flexbox で<b>よく使う6つの並べ方</b>。ヘッダー・真ん中置き・カード並び・左メニュー…。', render(el) { el.append(caseTabs(CASES.flex())); } },
            { t: 'position：重ねる・ずらす', tag: 'position', lead: 'position の主役は「<b>親に relative、子に absolute</b>」。<b>通知ベルの赤い数字</b>で、「次へ」を押すたびに何が動くかを見よう。', render: positionStory },
            { t: 'fixed と sticky', tag: 'scroll', lead: '<b>料金ページを自動でスクロール</b>して、動く・止まる・消えるを目で見よう。ヘッダーの <code>position</code> を切り替えて試せます。', render: scrollStory },
            { t: 'z-index：重なり順', tag: 'z-index', lead: '重なりで<b>よく起きる困りごと4つ</b>。メニュー・トースト・「効かない」の直し方を見よう。', render(el) { el.append(caseTabs(CASES.z())); } },
      { t: 'Sass（プラスα）', tag: 'SCSS', lead: 'CSS をもっと書きやすくする道具。左に書くと、右に<b>ふつうのCSS</b>へ変換されます。', render: sassScene },
      {
        t: '実践：中央ぞろえカード', tag: 'PRACTICE', lead: '<b>3行</b>書き足して、カードを画面の真ん中に置こう（目安 3分）。✓が3つ付いたらクリア！',
        hint: '<p>「並べ方」は親（今回は <code>body</code>）に書きます。</p><ul style="line-height:1.9"><li><code>display: flex;</code> … 中身を並べる状態にする</li><li><code>justify-content: center;</code> … <b>横</b>の真ん中</li><li><code>align-items: center;</code> … <b>縦</b>の真ん中</li></ul><p style="color:var(--mute);font-size:.875rem">grid と <code>place-items: center</code> でも OK。</p>',
        render(el) {
          el.append(playground({
            title: 'HTML + CSS', mode: 'web',
            solution: { 'style.css': 'body {\n  margin: 0;\n  min-height: 100vh;\n  display: flex;\n  justify-content: center; /* 横の真ん中 */\n  align-items: center;     /* 縦の真ん中 */\n}\n\n.card {\n  background: #eef4ff;\n  padding: 24px 32px;\n  border-radius: 16px;\n}\n' },
            files: [
              { name: 'index.html', lang: 'html', code: '<div class="card">\n  <h2>Hello CSS</h2>\n  <p>私は画面の真ん中に行きたい！</p>\n</div>\n' },
              { name: 'style.css', lang: 'css', code: 'body {\n  margin: 0;\n  min-height: 100vh;\n  /* ここに3行書く：flex にして、横・縦の真ん中にする */\n}\n\n.card {\n  background: #eef4ff;\n  padding: 24px 32px;\n  border-radius: 16px;\n}\n' },
            ],
            tasks: (v, c) => {
              const d = c.doc && c.doc();
              const labels = ['body を flex（か grid）にする', 'カードが横の真ん中にある', 'カードが縦の真ん中にある'];
              if (!d || !d.body || !d.defaultView) return labels.map((l) => ({ label: l, ok: false }));
              const CARD = '\n.card {\n  background: #eef4ff;\n  padding: 24px 32px;\n  border-radius: 16px;\n}\n', HEAD = 'body {\n  margin: 0;\n  min-height: 100vh;\n';
              const CSS1 = HEAD + '  display: flex;\n}\n' + CARD, CSS2 = HEAD + '  display: flex;\n  justify-content: center;\n}\n' + CARD, CSS3 = HEAD + '  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n' + CARD;
              const g = (e) => d.defaultView.getComputedStyle(e), card = d.querySelector('.card');
              if (!card) return labels.map((l) => ({ label: l, ok: false }));
              const r = card.getBoundingClientRect(), W = d.documentElement.clientWidth, H = d.documentElement.clientHeight;
              return [
                { label: labels[0], ok: /flex|grid/.test(g(d.body).display), hint: ['「並べ方」は親（body）に書く。<code>display</code> に何を入れる？', '<code>display: flex;</code> と書くと、中身を並べる状態になる。'], answer: { code: CSS1, lang: 'css', mode: 'replace' } },
                { label: labels[1], ok: r.width < W - 20 && Math.abs(r.left + r.width / 2 - W / 2) <= 3, hint: ['「横」の並び方は <code>justify-content</code> で決める。', 'body に <code>justify-content: center;</code> を足そう（flex にした後で）。'], answer: { code: CSS2, lang: 'css', mode: 'replace' } },
                { label: labels[2], ok: Math.abs(r.top + r.height / 2 - H / 2) <= 3, hint: ['「縦」の並び方は <code>align-items</code> で決める。', 'body に <code>align-items: center;</code> を足そう。縦が効くのは、body に高さ（<code>min-height: 100vh</code>）があるから。'], answer: { code: CSS3, lang: 'css', mode: 'replace' } },
                { optional: true, level: 1, label: 'カードの幅を 360px までにして、文字も中央ぞろえにする', ok: r.width > 0 && r.width <= 361 && g(card).textAlign === 'center', hint: ['幅の上限は <code>max-width</code>、文字の寄せ方は <code>text-align</code>。', '<code>.card</code> に <code>max-width: 360px;</code> と <code>text-align: center;</code> を足す。'], answer: { code: CSS3.replace('  padding: 24px 32px;', '  max-width: 360px;\n  text-align: center;\n  padding: 24px 32px;'), lang: 'css', mode: 'replace' } },
                { optional: true, level: 2, label: 'カードに枠線（border）を付け、見出し h2 の文字を 28px 以上にする', ok: (() => { const h2 = card.querySelector('h2'); return parseFloat(g(card).borderTopWidth) > 0 && g(card).borderTopStyle !== 'none' && !!h2 && parseFloat(g(h2).fontSize) >= 28; })(), hint: ['枠線は <code>border: 太さ 線の種類 色;</code> の1行。例：<code>2px solid #4a7cff</code>。', '見出しは <code>.card h2 { font-size: 28px; }</code>（初期値は 24px）。'], answer: { code: CSS3.replace('  padding: 24px 32px;', '  border: 2px solid #4a7cff;\n  padding: 24px 32px;') + '\n.card h2 {\n  font-size: 28px;\n}\n', lang: 'css', mode: 'replace' } },
                { optional: true, level: 3, label: 'カードの右上に「NEW」バッジを重ねる（親は relative、バッジは absolute）', ok: (() => { if (g(card).position !== 'relative') return false; return ['::after', '::before'].some((pe) => { const ps = d.defaultView.getComputedStyle(card, pe); return ps.position === 'absolute' && !/^(none|normal)$/.test(ps.content) && ps.content.replace(/["']/g, '').trim().length > 0; }); })(), hint: ['重ねる基準は親。<code>.card</code> に <code>position: relative;</code>。', 'バッジは <code>.card::after { content: "NEW"; position: absolute; top: -10px; right: -10px; }</code>。背景色と余白（padding）も付けよう。'], answer: { code: CSS3.replace('  padding: 24px 32px;', '  position: relative;\n  padding: 24px 32px;') + '\n.card::after {\n  content: "NEW";\n  position: absolute;\n  top: -10px;\n  right: -10px;\n  padding: 2px 8px;\n  border-radius: 10px;\n  background: #ff5a5f;\n  color: #fff;\n  font-size: 12px;\n}\n', lang: 'css', mode: 'replace' } },
              ];
            },
          }));
        },
      },
    ],
  });

  /* ============================================================
     Q1: 問題 → 考え方 → 解決 (why) / 使い分け quizzes / new "why" scenes
  ============================================================ */
  style('q1', `
  .cgw-p{justify-content:flex-start!important;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:10px}
  .cgw-h{display:flex;align-items:center;gap:.5em;font-weight:900;font-size:.95rem}.cgw-h .ic{width:18px;height:18px}.cgw-h small{margin-left:auto;color:var(--mute);font-weight:700;font-size:.72rem}
  .cgw-g{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}
  .cgw-f{font:600 .68rem var(--mono);padding:.35em .15em;border-radius:5px;background:var(--card2);border:1px solid var(--line);text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;transition:.25s}
  .cgw-f.done{background:color-mix(in srgb,var(--ok) 20%,transparent);border-color:var(--ok);color:var(--ok)}
  .cgw-s{display:flex;gap:16px;align-items:baseline;font-size:.8rem;font-weight:700;color:var(--mute);flex-wrap:wrap}.cgw-s b{font:900 1.35rem var(--mono);color:var(--text)}
  .cgw-cmd{font:600 .78rem/1.6 var(--mono);background:var(--code);color:#9be58b;border-radius:8px;padding:.6em .9em;white-space:pre-wrap;word-break:break-all}
  .gw-man{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:stretch}.gw-box{justify-content:flex-start!important;background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:250px;transition:.4s}
  .gw-box.dim{opacity:.35;filter:saturate(.3)}
  .gw-file{display:flex;align-items:center;gap:.5em;font:600 .8rem var(--mono);padding:.4em .7em;border-radius:6px;background:var(--card2);border:1px solid var(--line);animation:pop .4s both}
  .gw-file .q{margin-left:auto;color:var(--bad);font-weight:900}
  .gw-warn{margin-top:auto;padding:.5em .8em;border-radius:8px;font-weight:800;font-size:.85rem;background:color-mix(in srgb,var(--bad) 14%,transparent);border:1px solid var(--bad);color:var(--bad);display:flex;gap:.5em;align-items:center}
  .gw-ok{margin-top:auto;padding:.5em .8em;border-radius:8px;font-weight:800;font-size:.85rem;background:color-mix(in srgb,var(--ok) 14%,transparent);border:1px solid var(--ok);color:var(--ok);display:flex;gap:.5em;align-items:center}
  .gw-commit{display:flex;align-items:center;gap:.6em;font-size:.82rem;font-weight:700;padding:.35em .7em;border-radius:6px;background:var(--card2);border:1px solid var(--line);animation:pop .4s both}
  .gw-commit i{width:10px;height:10px;border-radius:50%;background:var(--ts);flex:none}.gw-commit small{margin-left:auto;color:var(--mute);font-family:var(--mono);font-size:.7rem}
  .gw-ppl{display:flex;gap:10px;align-items:center;justify-content:center;font-weight:800;font-size:.85rem;margin-top:4px}
  .gw-ppl span{display:inline-flex;gap:.35em;align-items:center;padding:.2em .7em;border-radius:6px;background:var(--card2);border:1px solid var(--line)}
  .q1-mq{display:grid;gap:12px;margin-top:18px}.q1-mq .card{display:grid;gap:10px}
  @media(max-width:900px){.gw-man{grid-template-columns:1fr}}
  `);

  /* --- helper: tiny "どっちを選ぶ？" quiz card --- */
  function pickQuiz(el, title, items) {
    const wrap = h('div', { class: 'q1-mq' }, lbl(title));
    items.forEach((it) => wrap.append(h('div', { class: 'card' }, quiz(it))));
    el.append(wrap);
  }

  /* --- new scene: なぜターミナル？ (GUI vs CUI) --- */
  const sceneWhyCui = {
    t: 'なぜターミナル？', tag: 'CUI',
    lead: '写真 <b>30枚</b>のファイル名に「trip_」を付けたい。<b>マウス（GUI）</b>と<b>文字の命令（CUI）</b>で、手間がどう違うか比べてみよう。',
    why: {
      problem: '30個のファイルを1つずつ改名… <b>クリック30回</b>、間違いもしやすい',
      idea: '手順を「文字の命令」にすれば、<b>機械が何度でも正確に</b>繰り返してくれる',
      answer: '<b>CUI（ターミナル）</b>：命令を1行書いて実行',
      when: [['同じ作業を何度も／大量にある', 'CUI'], ['色・配置を目で見て決める', 'GUI'], ['サーバー・開発ツール（画面が無い）', 'CUI']],
    },
    render(el) {
      const N = 30, names = Array.from({ length: N }, (_, i) => `photo${i + 1}.jpg`);
      const mkSide = () => {
        const tiles = names.map((n) => h('span', { class: 'cgw-f' }, n));
        return { tiles, grid: h('div', { class: 'cgw-g' }, tiles) };
      };
      const G = mkSide(), C = mkSide();
      let clicks = 0;
      const gStat = h('div', { class: 'cgw-s' }), cStat = h('div', { class: 'cgw-s' });
      const showG = () => { const d = G.tiles.filter((t) => t.classList.contains('done')).length; gStat.replaceChildren(h('span', '操作 ', h('b', clicks), ' 回'), h('span', '目安 ', h('b', clicks * 5), ' 秒'), h('span', '完了 ', h('b', d + '/' + N))); };
      const showC = (cmds, ms, done) => cStat.replaceChildren(h('span', '操作 ', h('b', cmds), ' 回'), h('span', '目安 ', h('b', ms), ' 秒'), h('span', '完了 ', h('b', done + '/' + N)));
      const ren = (t) => { if (t.classList.contains('done')) return; t.classList.add('done'); t.textContent = 'trip_' + t.textContent; };
      G.tiles.forEach((t) => t.addEventListener('click', () => { if (t.classList.contains('done')) return; clicks++; ren(t); showG(); }));
      let auto = null;
      const autoBtn = h('button', { class: 'btn', onclick: () => {
        if (auto) return;
        auto = setInterval(() => { const t = G.tiles.find((x) => !x.classList.contains('done')); if (!t) { clearInterval(auto); auto = null; return; } clicks++; ren(t); showG(); }, 70);
      } }, icon('fast-forward'), '早送りで全部やる');
      const run = h('button', { class: 'btn primary', style: { '--c': 'var(--ts)' }, onclick: () => {
        C.tiles.forEach((t, i) => setTimeout(() => ren(t), i * 12)); showC(1, 0.1, N);
      } }, icon('play'), '実行 (Enter)');
      const reset = h('button', { class: 'btn ghost', onclick: () => {
        clearInterval(auto); auto = null; clicks = 0;
        [G, C].forEach((s) => s.tiles.forEach((t, i) => { t.classList.remove('done'); t.textContent = names[i]; }));
        showG(); showC(0, 0, 0);
      } }, icon('rotate-ccw'), 'リセット');
      const guiP = h('div', { class: 'cgw-p' }, h('div', { class: 'cgw-h' }, icon('mouse-pointer-click'), 'GUI：1つずつクリックして改名', h('small', '← タイルをクリック')), G.grid, gStat, h('div', { class: 'row' }, autoBtn));
      const cuiP = h('div', { class: 'cgw-p' }, h('div', { class: 'cgw-h' }, icon('terminal'), 'CUI：1行の命令', h('small', '← 実行を押す')), C.grid, cStat,
        h('div', { class: 'cgw-cmd' }, 'for f in photo*.jpg; do\n  mv "$f" "trip_$f"\ndone'), h('div', { class: 'row' }, run));
      el.append(h('div', { class: 'split' }, guiP, cuiP), h('div', { class: 'row', style: { marginTop: '12px' } }, reset));
      showG(); showC(0, 0, 0);
      el.append(h('div', { class: 'card', style: { marginTop: '14px' } }, quiz({
        q: 'ログファイル（10万行）から <code class="i">ERROR</code> を含む行だけ探したい。どうする？',
        options: ['エディタで開いて、目で探す', '<code class="i">grep ERROR app.log</code> と打つ', '1行ずつコピーして確認'], answer: 1,
        why: '大量データの検索・繰り返しは CUI の得意分野。',
      })));
      return () => clearInterval(auto);
    },
  };

  /* --- new scene: なぜ Git？ (final_v2 problem) --- */
  const sceneWhyGit = {
    t: 'なぜ Git？', tag: 'why',
    lead: 'まず<b>困りごと</b>から。「次へ」で、ファイル名で管理する世界 → Git の世界へ進みます。',
    why: {
      problem: '<code>price_最終_本当_修正.html</code> … どれが最新？ 誰が直した？ 2人で上書き事故も',
      idea: 'ファイルは<b>1つのまま</b>。「変更の履歴（誰が・いつ・なぜ）」だけを積み重ねる',
      answer: '<b>Git</b>（履歴管理）＋ <b>GitHub</b>（共有）',
      when: [['1人・使い捨てのメモ', 'ファイル名管理でも可'], ['コード／2人以上／戻したい可能性あり', 'Git'], ['チームで共有・レビュー', 'Git + GitHub']],
    },
    render(el) {
      const LN = ['price.html', 'price_v2.html', 'price_最終.html', 'price_最終_本当.html', 'price_最終_本当_修正.html'];
      const left = h('div', { class: 'gw-box' }), right = h('div', { class: 'gw-box' });
      const head = (ic, t, c) => h('div', { class: 'cgw-h', style: { color: c } }, icon(ic), t);
      el.append(stepper({
        color: 'var(--ts)', interval: 2600,
        steps: [
          { say: 'レポートを直すたびに<b>「名前を付けて保存」</b>していませんか？ まだ1つだけ。' },
          { say: '1週間後…ファイルが増殖。<b>どれが最新？</b> どこが違う？ 自分にも分からない。' },
          { say: '2人が同じファイルを編集 → <b>片方が上書き</b>。相手の変更が消えた！' },
          { say: '<b>考え方を変える</b>：ファイルは1つ。変更を<b>履歴</b>として積む。誰が・いつ・なぜ、が残る。' },
          { say: '履歴があるので<b>どの時点にも戻せる</b>。GitHub に置けば全員が同じ履歴を共有できる。これが Git。' },
        ],
        init(vis) { vis.append(h('div', { class: 'gw-man' }, left, right)); },
        update(n) {
          const files = n === 0 ? LN.slice(0, 1) : LN;
          left.className = 'gw-box' + (n >= 3 ? ' dim' : '');
          left.replaceChildren(...[head('files', 'ファイル名で管理', 'var(--team)'),
            ...files.map((f, i) => h('div', { class: 'gw-file', style: { animationDelay: i * 60 + 'ms' } }, icon('file-text'), f, n >= 1 && n < 3 ? h('span', { class: 'q' }, '?') : null)),
            n === 1 ? h('div', { class: 'gw-warn' }, icon('circle-help'), 'どれが最新？ 何が違う？') : null,
            n === 2 ? h('div', { class: 'gw-ppl' }, h('span', icon('user'), 'A さん'), icon('arrow-right'), h('span', icon('file-text'), 'price.html'), icon('arrow-left'), h('span', icon('user'), 'B さん')) : null,
            n === 2 ? h('div', { class: 'gw-warn' }, icon('triangle-alert'), '上書き事故：B さんの変更が消えた') : null].filter(Boolean));
          const C = [['見出しを追加', 'Lam · 10:02'], ['画像を差し替え', 'Mai · 11:30'], ['誤字を修正', 'Lam · 13:15']];
          right.className = 'gw-box' + (n < 3 ? ' dim' : '');
          right.replaceChildren(...[head('git-branch', 'Git で管理', 'var(--ts)'),
            n < 3 ? h('div', { style: { color: 'var(--mute)', fontWeight: 700, fontSize: '.85rem' } }, '（まだ使っていない）')
              : h('div', { class: 'gw-file' }, icon('file-text'), 'price.html', h('span', { style: { marginLeft: 'auto', color: 'var(--ok)', fontSize: '.72rem' } }, 'ずっとこの1つ')),
            ...(n >= 3 ? C.map(([m, w], i) => h('div', { class: 'gw-commit', style: { animationDelay: i * 120 + 'ms' } }, h('i'), m, h('small', w))) : []),
            n === 3 ? h('div', { class: 'gw-ok' }, icon('history'), 'いつでも好きな時点に戻れる') : null,
            n === 4 ? h('div', { class: 'gw-ok' }, icon('users'), 'GitHub で全員が同じ履歴を共有') : null].filter(Boolean));
        },
      }));
    },
  };

  /* ============================================================
     Git: 現場の場面をコマンドで追う（makeGitSim を台本どおりに動かす）
  ============================================================ */
  const GX = (() => {
    style('cgx', `
    .cgx-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
    .cgx-tab{all:unset;cursor:pointer;display:flex;align-items:center;gap:.5em;padding:.5em 1em;border-radius:8px;font-weight:800;font-size:.875rem;background:var(--card);border:1px solid var(--line);transition:.2s}
    .cgx-tab small{display:block;font-weight:600;color:var(--mute);font-size:.75rem}.cgx-tab .ic{color:var(--c)}.cgx-tab:hover{transform:translateY(-2px)}
    .cgx-tab.on{background:color-mix(in srgb,var(--c) 22%,var(--card));border-color:var(--c)}
    .cgx-story{display:flex;gap:.7em;align-items:flex-start;padding:.7em 1em;border-radius:10px;border:1px dashed var(--c,var(--ts));background:color-mix(in srgb,var(--c,var(--ts)) 10%,transparent);font-size:.875rem;line-height:1.8;margin-bottom:12px}
    .cgx-story .ic{width:20px;height:20px;flex:none;margin-top:3px;color:var(--c,var(--ts))}
    .cgx-term{margin:0;background:var(--code);border:1px solid var(--line);border-radius:8px;padding:10px 14px;font:.8125rem/1.7 var(--mono);color:#d8dcff;min-height:250px;max-height:330px;overflow:auto;white-space:pre-wrap;word-break:break-all}
    .cgx-term .cx-cmd{color:#9be58b}.cgx-term .cx-err{color:#ff8f9a}.cgx-term .cx-gh{color:#7fd8ff}.cgx-term .cx-note{color:#ffb454}.cgx-term .cx-out{color:#d8dcff}
    .cgx-term .cx-old{opacity:.55}.cgx-term .cx-nw{animation:cgxin .5s}
    @keyframes cgxin{from{background:rgba(255,255,255,.14)}to{background:transparent}}
    .cgx-repo{border:1px solid var(--line);border-radius:10px;background:var(--card);padding:12px 14px;font-size:.8125rem;display:grid;gap:10px;min-height:250px;align-content:start}
    .cgx-repo h5{font-size:.75rem;letter-spacing:.06em;color:var(--mute);margin:0 0 4px;font-weight:800;display:flex;align-items:center;gap:.4em}.cgx-repo h5 .ic{width:14px;height:14px}
    .cgx-repo .br{display:inline-flex;gap:.4em;align-items:center;padding:.1em .7em;border-radius:6px;background:var(--pink);color:#fff;font:700 .8125rem var(--mono)}
    .cgx-repo ul{list-style:none;margin:0;padding:0;font:.8125rem/1.7 var(--mono)}.cgx-repo li{display:flex;gap:.6em;flex-wrap:wrap}.cgx-repo li code{color:var(--mute)}
    .cgx-repo .dc{color:var(--violet);font-weight:700}.cgx-repo .st-n{color:var(--ok)}.cgx-repo .st-m{color:#ffb454}.cgx-repo .st-u{color:var(--bad)}.cgx-repo .none{color:var(--mute)}
    .cgx-repo .rb{display:flex;gap:.6em;flex-wrap:wrap;align-items:center}.cgx-repo .rb .tag{padding:.05em .6em;border-radius:6px;border:1px dashed var(--basic);color:var(--basic);font:700 .75rem var(--mono)}
    .cgx-pr{border:1px solid var(--line);border-radius:10px;background:var(--card);padding:12px 14px;margin-bottom:12px;display:grid;gap:8px;font-size:.875rem}
    .cgx-pr .hd{display:flex;align-items:center;gap:.6em;flex-wrap:wrap;font-weight:800}.cgx-pr .hd .ic{width:18px;height:18px}
    .cgx-pr .st{padding:.05em .7em;border-radius:999px;font-size:.75rem;font-weight:800;border:1px solid currentColor}
    .cgx-pr .st.open{color:var(--ok)}.cgx-pr .st.chg{color:#ffb454}.cgx-pr .st.ok{color:var(--basic)}.cgx-pr .st.merged{color:var(--violet)}
    .cgx-pr .cm{display:flex;gap:.6em;align-items:flex-start;padding:.5em .8em;border-radius:8px;background:var(--card2);line-height:1.7}.cgx-pr .cm .ic{width:16px;height:16px;flex:none;margin-top:4px}
    .cgx-pr .cm.new{border-left:3px solid #ffb454}.cgx-pr .meta{color:var(--mute);font-size:.8125rem}
    .cgx-env{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-bottom:12px}
    .cgx-env>div{border:1px solid var(--line);border-radius:10px;background:var(--card);padding:10px 12px;font-size:.8125rem;line-height:1.6;transition:.3s}
    .cgx-env b{display:flex;align-items:center;gap:.4em;font-size:.875rem}.cgx-env b .ic{width:16px;height:16px}.cgx-env code{font-family:var(--mono);color:var(--violet);font-weight:700}
    .cgx-env .on{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 10%,var(--card))}.cgx-env .bad{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 10%,var(--card))}
    .cgx-lint{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px}
    @media(max-width:760px){.cgx-lint,.cgx-env{grid-template-columns:1fr}}
    .cgx-lint textarea,.cgx-lint input{width:100%;background:var(--code);color:#fff;border:1px solid var(--line);border-radius:8px;padding:.6em .8em;font:.875rem/1.7 var(--mono);outline:0;box-sizing:border-box}
    .cgx-lint input:focus,.cgx-lint textarea:focus{border-color:var(--ts)}
    .cgx-chk{display:grid;gap:6px;margin:0;padding:0;list-style:none;font-size:.875rem}.cgx-chk li{display:flex;gap:.6em;align-items:flex-start;line-height:1.6}.cgx-chk .ic{width:18px;height:18px;flex:none;margin-top:2px}
    .cgx-chk .y .ic{color:var(--ok)}.cgx-chk .n .ic{color:var(--bad)}.cgx-chk small{display:block;color:var(--mute)}
    .cgx-log{background:var(--code);border-radius:8px;padding:10px 14px;font:.8125rem/1.7 var(--mono);color:#d8dcff;white-space:pre-wrap}.cgx-log .cgx-me{background:rgba(111,220,124,.18);border-radius:4px}.cgx-log .hx{color:#ffb454}
    .cgx-cmp{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}@media(max-width:760px){.cgx-cmp{grid-template-columns:1fr}}
    .cgx-cmp>div{border:1px solid var(--line);border-radius:10px;background:var(--card);padding:12px 14px;font-size:.875rem;line-height:1.8}
    .cgx-cmp .ng{border-color:color-mix(in srgb,var(--bad) 50%,var(--line))}.cgx-cmp .ok{border-color:color-mix(in srgb,var(--ok) 50%,var(--line))}
    .cgx-cmp h6{margin:0 0 6px;font-size:.875rem;display:flex;align-items:center;gap:.4em}.cgx-cmp h6 .ic{width:16px;height:16px}.cgx-cmp .ng h6{color:var(--bad)}.cgx-cmp .ok h6{color:var(--ok)}
    .cgx-cmp pre{margin:0;font:.8125rem/1.7 var(--mono);white-space:pre-wrap;color:var(--text)}
    .cgx-tbl{width:100%;border-collapse:collapse;font-size:.875rem;margin-top:12px}.cgx-tbl th,.cgx-tbl td{border-bottom:1px solid var(--line);padding:.5em .6em;text-align:left;vertical-align:top}.cgx-tbl th{color:var(--mute);font-size:.75rem}.cgx-tbl code{font-family:var(--mono);color:var(--violet)}
    `);
    const tok = (s) => (s.match(/"[^"]*"|'[^']*'|\S+/g) || []).map((x) => x.replace(/^["']|["']$/g, ''));
    const ids = (sim) => Object.values(sim.S.commits).sort((a, b) => a.seq - b.seq).map((c) => c.id);

    function replay(cfg, n) {
      const root = { t: 'd', c: {} }, sim = makeGitSim(root);
      const put = (path, v) => { const ps = path.split('/'), name = ps.pop(); let d = root; for (const p of ps) d = d.c[p] || (d.c[p] = { t: 'd', c: {} }); if (v === undefined) delete d.c[name]; else d.c[name] = { t: 'f', v }; };
      cfg.seed(sim, put); sim.S.did = {};
      const lines = [];
      for (let i = 0; i <= n; i++) {
        const st = cfg.steps[i], sub = (t) => t.replace(/\{\{c(\d+)\}\}/g, (_, k) => ids(sim)[+k] || '???'), add = (k, t) => lines.push({ k, t, i });
        if (st.sh) { add('cmd', '$ ' + sub(st.sh)); if (st.fn) st.fn(put, sim); if (st.out) add('out', st.out); }
        else if (st.git) { const c = sub(st.git); add('cmd', '$ git ' + c); sim.run(tok(c), (t) => add('out', t), (t) => add('err', t)); }
        else if (st.gh) { const r = sim.ghMerge(st.gh[0], st.gh[1]); add('gh', (r.ok ? 'GitHub: ' : 'GitHub（できない）: ') + r.msg); }
        else if (st.ghc) { const r = sim.ghColleague(st.ghc); add('gh', 'GitHub: ' + r.msg); }
        else if (st.note) add('note', '# ' + st.note);
      }
      return { sim, lines };
    }
    function repoPanel(sim) {
      const sn = sim.snapshot(), c = sn.c;
      const rows = [...c.staged.map(([k, p]) => h('li', h('span', { class: 'st-n' }, 'ステージ済み'), h('span', k + '：' + p))), ...c.unstaged.map(([k, p]) => h('li', h('span', { class: 'st-m' }, '変更あり（未 add）'), h('span', k + '：' + p))), ...c.untracked.map((p) => h('li', h('span', { class: 'st-u' }, '未追跡'), h('span', p)))];
      return [
        h('div', null, h('h5', icon('git-branch'), 'いまの枝'), h('span', { class: 'br' }, 'HEAD → ' + sn.head), sn.stash ? h('span', { class: 'dc', style: { marginLeft: '8px' } }, 'stash ' + sn.stash + ' 件') : null),
        h('div', null, h('h5', icon('file-diff'), 'ファイルの状態'), rows.length ? h('ul', rows) : h('div', { class: 'none' }, 'きれい（変更なし）')),
        h('div', null, h('h5', icon('history'), '履歴（新しい順）'), sn.log.length ? h('ul', sn.log.map((x) => h('li', h('code', x.id), h('span', x.msg), x.d ? h('span', { class: 'dc' }, x.d.trim()) : null))) : h('div', { class: 'none' }, 'まだ無い')),
        h('div', null, h('h5', icon('github-mark'), 'GitHub（origin）'), sn.rem.length ? h('div', { class: 'rb' }, sn.rem.map((r) => h('span', { class: 'tag' }, r.b + ' ' + r.id + ' ' + r.msg))) : h('div', { class: 'none' }, 'まだ何も送っていない')),
      ];
    }
    /* 1つの場面: cfg = { story, seed(sim, put), steps:[{say, git|sh|gh|ghc|note, fn, out}], extra(n, sim) } */
    function story(cfg, color) {
      const term = h('pre', { class: 'cgx-term' }), repo = h('div', { class: 'cgx-repo' }), ex = h('div');
      const root = h('div');
      root.append(h('div', { class: 'cgx-story', style: { '--c': color } }, icon('user'), h('div', { html: '<b>場面</b>：' + cfg.story })));
      const st = stepper({
        color, interval: 3200, steps: cfg.steps.map((s) => ({ say: s.say })),
        init(vis) { vis.append(ex, h('div', { class: 'split' }, h('div', { class: 'col' }, lbl('ターミナル'), term), h('div', { class: 'col' }, lbl('リポジトリの様子（リアルタイム）'), repo))); },
        update(n) {
          const { sim, lines } = replay(cfg, n);
          term.replaceChildren(...lines.map((l) => h('div', { class: 'cx-' + l.k + (l.i === n ? ' cx-nw' : ' cx-old') }, l.t)));
          term.scrollTop = term.scrollHeight;
          repo.replaceChildren(...repoPanel(sim));
          const e = cfg.extra ? cfg.extra(n, sim) : null; ex.replaceChildren(...(e ? [e] : []));
        },
      });
      root.append(st);
      return root;
    }
    /* 複数の場面をタブで切り替える */
    function tabs(list) {
      const wrap = h('div'), bar = h('div', { class: 'cgx-tabs' }), body = h('div');
      const open = (i) => { bar.querySelectorAll('.cgx-tab').forEach((t, k) => t.classList.toggle('on', k === i)); body.replaceChildren(story(list[i].cfg, list[i].c)); if (K.ctx) K.ctx.steppers.splice(0, K.ctx.steppers.length - 1); };
      list.forEach((x, i) => bar.append(h('button', { class: 'cgx-tab', style: { '--c': x.c }, onclick: () => open(i) }, icon(x.ic), h('div', x.t, h('small', x.sub)))));
      wrap.append(bar, body); open(0); return wrap;
    }
    const table = (head, rows) => h('table', { class: 'cgx-tbl' }, h('thead', null, h('tr', null, head.map((x) => h('th', x)))), h('tbody', null, rows.map((r) => h('tr', null, r.map((c, i) => h('td', null, i === 0 ? h('code', { html: c }) : h('span', { html: c })))))));
    const prCard = (o) => h('div', { class: 'cgx-pr' },
      h('div', { class: 'hd' }, icon('git-pull-request'), o.title, h('span', { class: 'st ' + o.cls }, o.state)),
      h('div', { class: 'meta' }, o.meta),
      ...(o.comments || []).map((c) => h('div', { class: 'cm' + (c.nw ? ' new' : '') }, icon(c.ic || 'message-square'), h('div', { html: c.t }))));
    return { story, tabs, table, prCard, tok, replay };
  })();

  const PRICE0 = '<h1>料金表</h1>\n<p>相談 30分 5,000円</p>\n<p>書面作成 20,000円</p>\n';
  const gx = (c) => ({ k: c });

  /* ① ミスを取り消す */
  const sceneUndo = {
    t: 'ミスを取り消す', tag: 'undo',
    lead: 'commit のあとに「あっ」と気づくのは、<b>誰でも毎日</b>あります。<b>push 前</b>か<b>push 後</b>かで、使うコマンドが変わります。',
    why: {
      problem: 'commit したあとで<b>誤字</b>・<b>余計なファイル</b>に気づいた。push 済みなら、もう他の人も見ている',
      idea: 'まだ<b>自分だけ</b>の履歴なら作り直してOK。<b>みんなが見ている</b>履歴は、書き換えずに「取り消す commit」を足す',
      answer: 'push 前：<code>--amend</code> / <code>reset --soft</code>、push 後：<code>revert</code>',
      when: [['メッセージの誤字（push 前）', 'git commit --amend'], ['余計なファイルを入れた（push 前）', 'git reset --soft HEAD~1'], ['push 済みの commit を取り消す', 'git revert'], ['保存していない変更を捨てる', 'git restore（戻せないので慎重に）'], ['共有ブランチへの push --force', 'しない']],
    },
    render(el) {
      const F0 = { 'price.html': PRICE0, 'README.md': '# app\n' };
      const base = (sim, extra) => sim.seed(Object.assign({ commits: [{ msg: 'first commit', files: F0, push: true }] }, extra));
      el.append(GX.tabs([
        { t: 'メッセージの誤字', sub: 'push 前 · amend', ic: 'pencil', c: TS, cfg: {
          story: '料金表に「相談」を追加して commit した。直後に、<b>メッセージの誤字（typoo）</b>に気づいた。まだ push していない。',
          seed: (sim) => base(sim, { commits: [{ msg: 'first commit', files: F0, push: true }, { msg: 'feat: 料金表に「相談」を追加（typoo）', branch: 'feature/price-table', files: { 'price.html': PRICE0 + '<p>相談 60分 9,000円</p>\n' } }], head: 'feature/price-table' }),
          steps: [
            { note: 'まだ push していない → 履歴を作り直してOK', say: '誤字のあるメッセージで commit してしまった。<b>まだ自分の PC の中だけ</b>。' },
            { git: 'log --oneline', say: '履歴を確認。いちばん上の commit が対象。' },
            { git: 'commit --amend -m "feat: 料金表に「相談」を追加"', say: '<b>--amend</b>：直前の commit を<b>作り直す</b>。commit の数は増えない。' },
            { git: 'log --oneline', say: 'メッセージが直った。<b>ハッシュ（左の英数字）が変わった</b>＝別の commit に作り替えた、という印。' },
            { note: 'push したあとの amend は NG（他の人の履歴とずれる）', say: '<b>push 前だけ</b>の技。push したあとは、次の「revert」を使う。' },
          ] } },
        { t: '余計なファイル', sub: 'push 前 · reset --soft', ic: 'file-minus', c: PINK, cfg: {
          story: '料金表を commit したら、<b>デバッグ用の debug.log</b> まで一緒に入ってしまった。まだ push していない。',
          seed: (sim) => base(sim, { commits: [{ msg: 'first commit', files: F0, push: true }, { msg: 'feat: 料金表を更新', branch: 'feature/price-table', files: { 'price.html': PRICE0 + '<p>相談 60分 9,000円</p>\n', 'debug.log': 'DEBUG ...\n' } }], head: 'feature/price-table' }),
          steps: [
            { git: 'show HEAD', say: 'commit の中身を見ると、<b>debug.log</b> が入っている。' },
            { git: 'reset --soft HEAD~1', say: '<b>reset --soft HEAD~1</b>：直前の commit を取り消す。<b>変更はステージに残る</b>（HEAD~1＝ひとつ前）。' },
            { git: 'restore --staged debug.log', say: '余計なファイルだけ、ステージから外す。' },
            { git: 'status', say: 'price.html はステージ済み。debug.log は「未追跡」。' },
            { git: 'commit -m "feat: 料金表を更新"', say: '正しい中身で commit し直した。' },
            { note: 'debug.log は .gitignore に書くと、次から入らない（後の「秘密情報」の場面）', say: '同じミスを防ぐには <code>.gitignore</code>。' },
          ] } },
        { t: 'push 済みの誤り', sub: 'revert', ic: 'rotate-ccw', c: BASIC, cfg: {
          story: '<b>料金を 5,000円 → 50,000円</b>に誤って変えた commit を、もう GitHub に push してしまった。他の人も pull しているかもしれない。',
          seed: (sim) => sim.seed({ commits: [{ msg: 'first commit', files: F0, push: true }, { msg: 'fix: 相談料を変更（誤り）', files: { 'price.html': '<h1>料金表</h1>\n<p>相談 30分 50,000円</p>\n<p>書面作成 20,000円</p>\n' }, push: true }, { msg: 'docs: README を更新', files: { 'README.md': '# app\n使い方\n' }, push: true }] }),
          steps: [
            { git: 'log --oneline', say: 'まず履歴を見て、<b>取り消したい commit</b>を探す。' },
            { git: 'revert {{c1}}', say: '<b>revert</b>：その commit の<b>逆の変更</b>を、新しい commit として足す。<b>元の commit は消えない</b>。' },
            { git: 'log --oneline', say: '履歴に「Revert …」が1つ増えた。誰が見ても何が起きたか分かる。' },
            { git: 'push', say: '通常の push でOK。履歴を書き換えていないので、他の人の PC と<b>ずれない</b>。' },
            { note: 'push 済みに reset --hard や push --force は使わない', say: '<b>ルール</b>：みんなが見ている履歴は、書き換えない。' },
          ] } },
        { t: '保存前の変更を捨てる', sub: 'restore', ic: 'eraser', c: TEAM, cfg: {
          story: '料金表を試しに書き換えたが、<b>やっぱり元のままでよかった</b>。まだ add も commit もしていない。',
          seed: (sim) => base(sim, { work: { 'price.html': '<h1>料金表（試し書き）</h1>\n' } }),
          steps: [
            { git: 'status', say: 'price.html が「変更あり」。' },
            { git: 'diff', say: '何が変わったかを確認してから捨てる。<b>消した変更は戻せない</b>ので、必ず見る。' },
            { git: 'restore price.html', say: '<b>restore</b>：最後の commit の状態に戻す。' },
            { git: 'status', say: 'きれいに戻った。' },
          ] } },
        { t: 'やってはいけない', sub: 'force push', ic: 'ban', c: 'var(--bad)', cfg: {
          story: '自分の枝を amend したら push が<b>拒否</b>された。ここで <code>--force</code> を付けると…？ <b>同僚が同じ枝に足した commit</b>があるとする。',
          seed: (sim) => { base(sim, { commits: [{ msg: 'first commit', files: F0, push: true }, { msg: 'feat: 料金表を追加（typoo）', branch: 'feature/price-table', files: { 'price.html': PRICE0 + '<p>相談 60分 9,000円</p>\n' }, push: true }], remoteOnly: [{ branch: 'feature/price-table', msg: '同僚: 消費税の表示を追加', files: { 'tax.html': '<p>税込</p>\n' } }], head: 'feature/price-table' }); },
          steps: [
            { git: 'commit --amend -m "feat: 料金表を追加"', say: 'push 済みの commit を amend してしまった。' },
            { git: 'push', say: '<b>拒否された</b>。GitHub には、手元にない同僚の commit がある。' },
            { git: 'push --force', say: 'ここで <b>--force</b> すると、通ってしまう…' },
            { note: 'GitHub の履歴から、同僚の commit が消えた', say: '右の GitHub を見よう。<b>同僚の commit が消えた</b>。本人は気づかないまま、作業が失われる。' },
            { note: '共有している枝では --force を使わない', say: '拒否されたら force ではなく、<b>pull して取り込む</b>。どうしても必要なら、<b>必ず相談してから</b>。' },
          ] } },
      ]));
    },
  };

  /* ② stash */
  const sceneStash = {
    t: '作業を一時退避：stash', tag: 'stash',
    lead: '作業の途中で<b>「今すぐ直して」</b>と頼まれることは、よくあります。<b>commit せずに</b>、いまの作業を横に置いておく方法です。',
    why: {
      problem: '作業の途中（まだ commit できない）で、<b>本番の誤字を急ぎで直す</b>よう頼まれた。ブランチを移ろうとすると<b>エラー</b>',
      idea: '途中の作業を<b>いったん引き出しにしまう</b>。急ぎの対応が終わったら取り出す',
      answer: '<code>git stash</code> → 対応 → <code>git stash pop</code>',
      when: [['作業途中で別の対応が入った', 'stash'], ['作業にキリがついた', 'commit'], ['試しに書いた内容を捨てる', 'restore']],
    },
    render(el) {
      const FILES = { 'price.html': '<h1>料金票</h1>\n<p>相談 30分 5,000円</p>\n', 'README.md': '# app\n' };
      el.append(GX.story({
        story: 'feature/price-table で料金表を<b>編集中</b>（まだ commit していない）。そこへ「<b>本番の見出しが「料金票」と誤字になっている。今すぐ直して</b>」と連絡が来た。',
        seed: (sim) => sim.seed({ commits: [{ msg: 'first commit', files: FILES, push: true }, { msg: 'feat: 相談の行を追加', branch: 'feature/price-table', files: { 'price.html': '<h1>料金票</h1>\n<p>相談 30分 5,000円</p>\n<p>相談 60分 9,000円</p>\n' } }], head: 'feature/price-table', work: { 'price.html': '<h1>料金票</h1>\n<p>相談 30分 5,000円</p>\n<p>相談 60分 9,000円</p>\n<p>書面作成（編集中…）</p>\n' } }),
        steps: [
          { git: 'status', say: '作業中のファイルがある（<b>modified</b>）。まだ commit したくない。' },
          { git: 'checkout main', say: 'main に移ろうとすると<b>エラー</b>。作業中の変更が消えてしまうから、Git が止めてくれた。' },
          { git: 'stash', say: '<b>git stash</b>：作業中の変更を<b>引き出しにしまう</b>。ファイルは最後の commit の状態に戻る。' },
          { git: 'checkout main', say: 'これで main に移れた。' },
          { git: 'checkout -b hotfix/price-typo', say: '本番用の修正は、<b>main から</b>新しい枝を作って行う。' },
          { sh: 'vim price.html   # 誤字を直す', fn: (put) => put('price.html', '<h1>料金表</h1>\n<p>相談 30分 5,000円</p>\n'), say: '誤字を直す。' },
          { git: 'add price.html', say: 'ステージに載せる。' },
          { git: 'commit -m "fix: 料金表の誤字を直す"', say: '直した内容だけを commit。<b>作業中の変更が混ざらない</b>のが stash のうれしさ。' },
          { git: 'push -u origin hotfix/price-typo', say: 'GitHub に送って PR を作る。' },
          { gh: ['hotfix/price-typo', 'main'], say: 'レビューのあと、GitHub で main に Merge。本番に反映される。' },
          { git: 'checkout feature/price-table', say: '急ぎの対応が終わった。<b>元の枝に戻る</b>。' },
          { git: 'stash pop', say: '<b>stash pop</b>：しまった作業を取り出す（stash からは消える）。' },
          { git: 'status', say: '作業が<b>そのまま戻ってきた</b>。続きを書こう。' },
        ],
      }, TEAM));
    },
  };

  /* ③ レビュー指摘に対応 */
  const sceneReview = {
    t: 'レビュー指摘に対応', tag: 'review',
    lead: 'PR を出すと、チームメイトが<b>コメント</b>をくれます。直して push すれば、<b>同じ PR</b>に自動で反映されます。',
    why: {
      problem: 'PR にレビューコメントが付いた。直したいが、<b>PR を出し直すべき？</b> 履歴が汚れない？',
      idea: 'PR は「ブランチ」に紐づいている。<b>同じ枝に commit を足して push</b> すれば、PR が自動で更新される',
      answer: '直す → <code>add</code> → <code>commit</code> → <code>push</code>（PR は新しく作らない）',
      when: [['レビューで指摘された', '同じ枝に commit して push'], ['PR を出し直す', '基本しない（議論が分かれる）'], ['直したら', 'レビューを再依頼する']],
    },
    render(el) {
      const SEARCH0 = '<input id="q">\n<button>検索</button>\n<script>\nsearch(q.value)\n</script>\n';
      const cm1 = { t: '<b>レビュアー</b>：<code>search.html</code> 4行目。入力が<b>空のとき</b>、全件が表示されて重くなります。', nw: true };
      el.append(GX.story({
        story: '「案件検索」の PR を出した。レビュアーから<b>コメント</b>が付いた。直して、同じ PR を更新しよう。',
        seed: (sim) => sim.seed({ commits: [{ msg: 'first commit', files: { 'README.md': '# app\n' }, push: true }, { msg: 'feat: 案件検索を追加', branch: 'feature/search', files: { 'search.html': SEARCH0 }, push: true }], head: 'feature/search' }),
        extra: (n) => GX.prCard({
          title: 'feat: 案件検索を追加', cls: n >= 10 ? 'merged' : n >= 7 ? 'ok' : n >= 1 && n < 6 ? 'chg' : 'open', state: n >= 10 ? 'Merged' : n >= 7 ? 'Approved' : n >= 1 && n < 6 ? 'Changes requested' : 'Open',
          meta: 'feature/search → main ・ commit ' + (n >= 5 ? 2 : 1) + ' 件' + (n >= 5 ? '（push で自動的に追加された）' : ''),
          comments: n >= 1 ? [cm1].concat(n >= 5 ? [{ t: '<b>あなた</b>：空のときは検索しないようにしました。確認お願いします。', ic: 'message-circle' }] : []).concat(n >= 7 ? [{ t: '<b>レビュアー</b>：LGTM（問題なし）。', ic: 'circle-check' }] : []) : [],
        }),
        steps: [
          { note: 'PR を作った。レビュー待ち', say: 'PR を出した直後。右上の状態は <b>Open</b>。' },
          { note: 'レビュアーのコメント：空のとき全件が出る（上のカード）', say: 'レビュアーが<b>コメント</b>をくれた（上のカード）。<b>直すのは自分</b>。' },
          { sh: 'vim search.html   # 空のときは検索しない', fn: (put) => put('search.html', '<input id="q">\n<button>検索</button>\n<script>\nif (q.value) search(q.value)\n</script>\n'), say: 'PR を作ったときと<b>同じ枝（feature/search）</b>のまま、ファイルを直す。' },
          { git: 'add search.html', say: 'ステージに載せる。' },
          { git: 'commit -m "fix: 空のときは検索しない"', say: '直しを<b>1つの commit</b> に。メッセージには何を直したかを書く。' },
          { git: 'push', say: '<b>-u はもう不要</b>。同じ枝へ push するだけ。PR に<b>自動で commit が追加</b>された（上のカード）。' },
          { note: 'PR は新しく作らない。コメントに「直しました」と返信してレビューを再依頼', say: '<b>PR は出し直さない</b>。コメントに返信して、再度レビューをお願いする。' },
          { note: 'レビュアーが Approve（承認）した', say: 'レビュアーが <b>Approve</b>。Merge できる状態になった。' },
          { gh: ['feature/search', 'main'], say: 'GitHub の画面で <b>Merge</b>。' },
          { git: 'checkout main', say: '手元の main に戻る。' },
          { git: 'pull', say: 'Merge された main を取り込む。' },
          { git: 'branch -d feature/search', say: '役目を終えた枝は削除してきれいにする。' },
        ],
      }, BASIC));
    },
  };

  /* ④ 履歴を調べる */
  const sceneHistory = {
    t: '履歴を調べる', tag: 'log · blame',
    lead: '「<b>いつから</b>こうなった？ <b>誰が・なぜ</b>変えた？」に答えるのが、履歴を調べるコマンドです。',
    why: {
      problem: '「<b>先週から書面作成の金額が変わっている</b>」と指摘された。いつ・誰が・なぜ変えた？',
      idea: '履歴には<b>誰が・いつ・なぜ</b>が残っている。見たい角度で取り出す',
      answer: '<code>log</code>（いつ）/ <code>blame</code>（誰が）/ <code>show</code>（なぜ・何を）',
      when: [['全体の流れを知りたい', 'git log --oneline'], ['このファイルの履歴だけ', 'git log --oneline ファイル名'], ['この行は誰が変えた？', 'git blame ファイル名'], ['その commit の中身', 'git show ハッシュ'], ['2つの時点を比べる', 'git diff A B']],
    },
    render(el) {
      const V0 = '<h1>料金表</h1>\n<p>相談 30分 5,000円</p>\n<p>書面作成 20,000円</p>\n';
      const V1 = '<h1>料金表</h1>\n<p>相談 30分 5,000円</p>\n<p>相談 60分 9,000円</p>\n<p>書面作成 20,000円</p>\n';
      const V2 = '<h1>料金表</h1>\n<p>相談 30分 5,000円</p>\n<p>相談 60分 9,000円</p>\n<p>書面作成 25,000円</p>\n';
      const V3 = V2 + '<p>※ 税込表示</p>\n';
      el.append(GX.story({
        story: '「先週から<b>書面作成の金額</b>が 20,000円 → 25,000円に変わっている。<b>誰が・いつ・なぜ</b>変えたの？」と聞かれた。履歴から調べよう。',
        seed: (sim) => sim.seed({ commits: [{ msg: 'first commit', files: { 'price.html': V0 }, push: true }, { msg: 'feat: 相談60分のプランを追加', files: { 'price.html': V1 }, push: true }, { msg: 'fix: 書面作成を 25,000 円に変更（見積ルール改定のため）', files: { 'price.html': V2 }, push: true }, { msg: 'feat: 税込表示の注記を追加', files: { 'price.html': V3 }, push: true }] }),
        extra: () => GX.table(['知りたいこと', 'コマンド'], [['いつ・流れ', '<code>git log --oneline</code>'], ['この行を変えた人', '<code>git blame ファイル</code>'], ['なぜ・何を', '<code>git show ハッシュ</code>'], ['2点の差', '<code>git diff 古い 新しい</code>']]),
        steps: [
          { git: 'log --oneline', say: 'まず<b>全体の流れ</b>。1行1commit。左がハッシュ、右がメッセージ。' },
          { git: 'log --oneline price.html', say: '<b>このファイルだけ</b>の履歴に絞る。金額を変えた commit が見つかった。' },
          { git: 'blame price.html', say: '<b>blame</b>：<b>1行ごと</b>に、最後に変えた commit を表示。「書面作成」の行は 3 つ目の commit。' },
          { git: 'show {{c2}}', say: '<b>show</b>：その commit の中身。<b>メッセージに「なぜ」</b>が書いてある（見積ルール改定のため）。だから<b>メッセージは大事</b>。' },
          { git: 'diff {{c1}} {{c3}}', say: '<b>diff A B</b>：2つの時点の差。「先週」と「いま」を比べるときに使う。' },
          { note: '原因が分かったら、本人に聞く／revert する／直す、を決める', say: '「誰が悪い」を探すのが目的ではなく、<b>理由を知って次の判断をする</b>ための道具。' },
        ],
      }, TS));
    },
  };

  /* ⑤ リリースとタグ */
  const sceneRelease = {
    t: 'リリースとタグ', tag: 'tag',
    lead: '機能は <code>develop</code>（dev 環境）で確認 → <code>main</code>（prd＝本番）へ。<b>本番に出した版に印（タグ）</b>を付けておきます。',
    why: {
      problem: '本番でバグが見つかった。<b>「いま本番に出ているのはどの版？」</b>「どこまで戻せばいい？」が分からない',
      idea: '本番に出した瞬間に<b>名前（v1.2.0）</b>を付けておく。その名前を基準に、確認・戻しができる',
      answer: '<code>git tag v1.2.0</code> → <code>git push origin v1.2.0</code>',
      when: [['本番に出した', 'タグを付ける（v主.副.修正）'], ['バグを見つけた', 'log とタグで範囲を探す'], ['戻したい', 'revert（履歴は残す）']],
    },
    render(el) {
      const F = (v) => ({ 'index.html': '<h1>案件管理 ' + v + '</h1>\n' });
      el.append(GX.story({
        story: 'develop に機能が溜まった。dev 環境の確認は済み。今日は<b>本番（main）</b>へリリース。<b>出した版には名前（タグ）</b>を付ける。',
        seed: (sim) => { sim.seed({ commits: [{ msg: 'first commit', files: F('v1.1'), push: true }] }); sim.run(['tag', 'v1.1.0'], () => {}, () => {}); sim.seed({ commits: [{ msg: 'feat: 案件検索を追加', branch: 'develop', files: { 'search.html': '<input>\n' }, push: true }, { msg: 'feat: 料金表を追加', files: { 'price.html': '<h1>料金表</h1>\n' }, push: true }], head: 'main' }); },
        extra: (n) => h('div', { class: 'cgx-env' },
          h('div', { class: n >= 2 ? '' : 'on' }, h('b', icon('flask-conical'), 'dev 環境'), h('div', null, h('code', 'develop'), ' が反映される。確認用。')),
          h('div', { class: n >= 8 ? 'bad' : n >= 2 ? 'on' : '' }, h('b', icon('server'), 'prd（本番）'), h('div', null, h('code', 'main'), ' が反映される。', n >= 5 ? h('span', null, ' 版：', h('code', n >= 11 ? 'v1.2.1' : 'v1.2.0')) : h('span', null, ' 版：', h('code', 'v1.1.0')))),
          h('div', null, h('b', icon('tag'), 'タグ'), h('div', null, n >= 8 ? 'v1.1.0 / v1.2.0' + (n >= 11 ? ' / v1.2.1' : '') : n >= 5 ? 'v1.1.0 / v1.2.0' : 'v1.1.0'))),
        steps: [
          { note: 'develop（dev 環境）で確認済み。リリース用の PR を作る', say: 'いま本番は <b>v1.1.0</b>。develop には新機能が 2 つ。' },
          { note: 'GitHub で PR を作る：develop → main（リリース PR）', say: 'リリースは <b>develop → main の PR</b>。チームで最後の確認をする。' },
          { gh: ['develop', 'main'], say: '承認されたので Merge。<b>main ＝本番に反映</b>される。' },
          { git: 'checkout main', say: '手元でも main に移って…' },
          { git: 'pull', say: 'Merge された main を取り込む。' },
          { git: 'tag v1.2.0', say: '<b>タグ</b>：この commit に「v1.2.0」という名前を付ける。' },
          { git: 'push origin v1.2.0', say: 'タグも GitHub に送る（<b>push だけではタグは送られない</b>）。' },
          { git: 'tag', say: 'タグの一覧。いつでも「v1.2.0 のとき」に戻って調べられる。' },
          { note: '本番でバグを発見！ 問題は「料金表」の追加', say: '本番で<b>バグ</b>が見つかった。原因は料金表の追加。' },
          { git: 'revert {{c2}}', say: '<b>revert</b>で、問題の commit だけを取り消す（履歴は残る）。' },
          { git: 'push', say: '取り消しを GitHub へ（実際は hotfix の PR を通す）。' },
          { git: 'tag v1.2.1', say: '直した版には<b>新しいタグ（v1.2.1）</b>。v1.2.0 は消さず、記録として残す。' },
        ],
      }, VIO));
    },
  };

  /* ⑥ 秘密情報を commit してしまった */
  const sceneSecret = {
    t: '秘密情報を commit してしまった', tag: 'security',
    lead: 'API キーやパスワードを <b>commit & push</b> してしまったら。<b>慌てて消す前に</b>、やる順番があります。',
    why: {
      problem: '<b>API キー入りの .env</b> を push してしまった。ファイルを消せば安全…？ いいえ、<b>履歴に残る</b>',
      idea: 'push した秘密は<b>漏れた前提</b>。まず「無効化」。そのうえで、二度と入らないようにする',
      answer: '① キーを無効化・再発行 → ② <code>.gitignore</code> ＋ <code>git rm --cached</code>',
      when: [['push してしまった', '先にキーを無効化（最優先）'], ['今後入らないように', '.gitignore に書く'], ['履歴から完全に消す', '最後の手段（チームに影響・要相談）']],
    },
    render(el) {
      el.append(GX.story({
        story: '通知機能の PR を出した後、<b>.env（API キー入り）</b>まで commit して push していたことに気づいた。',
        seed: (sim) => sim.seed({ commits: [{ msg: 'first commit', files: { 'README.md': '# app\n' }, push: true }, { msg: 'feat: 通知機能を追加', branch: 'feature/notify', files: { 'notify.js': 'send(process.env.API_KEY)\n', '.env': 'API_KEY=sk-live-1234567890\n' }, push: true }], head: 'feature/notify' }),
        extra: (n) => h('div', { class: 'cgx-env', style: { gridTemplateColumns: 'repeat(2,minmax(0,1fr))' } },
          h('div', { class: n >= 2 ? 'on' : 'bad' }, h('b', icon(n >= 2 ? 'shield-check' : 'shield-alert'), 'API キー'), h('div', null, n >= 2 ? '無効化して、新しいキーを発行した。履歴に残った古いキーは使えない。' : '公開されている！ 履歴を見れば誰でも使える。')),
          h('div', { class: n >= 8 ? 'on' : '' }, h('b', icon('file-lock-2'), '今後の .env'), h('div', null, n >= 8 ? 'Git の管理から外れた。もう push されない。' : 'まだ Git が追跡している。'))),
        steps: [
          { git: 'log --oneline', say: '履歴に .env を含む commit がある。<b>push 済み</b>。' },
          { sh: 'git show HEAD --stat   # .env が入っている', out: '（.env に API_KEY=sk-live-… が見えている）', say: '中身を確認。<b>キーが丸見え</b>。' },
          { note: '最優先：サービスの管理画面で、このキーを無効化 → 新しいキーを発行', say: '<b>まずキーを無効化</b>（上の表示が緑に）。ファイルを消すより先。履歴やクローンから見られるため、<b>漏れた前提</b>で動く。' },
          { sh: 'echo ".env" >> .gitignore', fn: (put, sim) => put('.gitignore', '.env\n'), say: '次に、<b>.gitignore</b> に書いて、二度と Git に入らないようにする。' },
          { git: 'rm --cached .env', say: '<b>rm --cached</b>：Git の管理から外す。<b>ファイルは手元に残る</b>（普通の rm は実ファイルも消す）。' },
          { git: 'status', say: '.env は「削除（ステージ済み）」。.gitignore は未追跡。' },
          { git: 'add .gitignore', say: '.gitignore もステージへ。' },
          { git: 'commit -m "chore: .env を Git の管理から外す"', say: 'commit。' },
          { git: 'push', say: 'GitHub へ。これで今後は入らない。' },
          { note: '古い commit にはキーが残る。履歴の書き換え（filter-repo）は最後の手段。全員に影響するので必ず相談', say: '<b>履歴には残っている</b>。だから無効化が本命。履歴の書き換えは全員の PC に影響するので、<b>最後の手段</b>。' },
        ],
      }, 'var(--bad)'));
    },
  };

  /* ⑦ コミットの書き方・PR の書き方（1画面で見渡せる・書いて見せるアニメ） */
  const sceneWriting = {
    t: 'コミットの書き方・PR の書き方', tag: 'message',
    lead: '履歴は<b>未来の自分とチーム</b>への手紙。',
    why: {
      problem: '履歴が「修正」ばかりで原因が探せない。PR は 800 行で誰もレビューできない',
      idea: 'commit は<b>種類: 何をした</b>。PR は<b>小さく・3項目</b>',
      answer: '<code>feat: 案件検索を追加</code> ／ PR は「何を・なぜ・確認方法」',
      when: [['新機能', 'feat:'], ['バグ修正', 'fix:'], ['PR の大きさ', '数百行まで・1つの目的']],
    },
    render(el) {
      style('cgw2', `
      .cgw2{display:grid;gap:12px}
      .cgw2-top{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:12px;align-items:start}@media(max-width:860px){.cgw2-top{grid-template-columns:1fr}}
      .cgw2-card{border:1px solid var(--line);border-radius:10px;background:var(--card);padding:12px 14px;display:grid;gap:10px;position:relative}
      .cgw2-card h4{margin:0;font-size:.9375rem;font-weight:900;display:flex;gap:.5em;align-items:center}.cgw2-card h4 .ic{width:18px;height:18px;color:var(--c,var(--ts))}
      .cgw2-bar{display:flex;gap:8px;align-items:center;justify-content:space-between;flex-wrap:wrap}
      .cgw2 .hw{font-family:'Klee One','Zen Kurenaido','Hiragino Maru Gothic ProN','Yu Gothic',sans-serif;font-weight:600;letter-spacing:.02em}
      .cgw2-formula{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font:800 .9375rem var(--mono)}
      .cgw2-formula .fc{padding:.25em .8em;border-radius:8px;border:1px solid var(--c);background:color-mix(in srgb,var(--c) 16%,transparent);opacity:0;transform:translateX(-14px);transition:.45s}.cgw2-formula.go .fc{opacity:1;transform:none}
      .cgw2-formula .fc:nth-child(2){transition-delay:.25s;border:0;background:none;padding:0}.cgw2-formula .fc:nth-child(3){transition-delay:.5s}
      .cgw2-kinds{display:flex;gap:6px;flex-wrap:wrap}
      .cgw2-kind{all:unset;cursor:pointer;display:inline-flex;gap:.4em;align-items:baseline;padding:.25em .7em;border-radius:8px;border:1px solid var(--line);background:var(--card2);font:700 .8125rem var(--mono);transition:.2s}
      .cgw2-kind small{font:600 .6875rem var(--font);color:var(--mute)}.cgw2-kind:hover,.cgw2-kind.on{border-color:var(--c);background:color-mix(in srgb,var(--c) 18%,var(--card2));transform:translateY(-2px)}
      .cgw2-box{min-height:2.6em;display:flex;align-items:center;gap:.4em;padding:.5em .8em;border-radius:8px;border:1px solid var(--line);background:var(--bg2);font-size:1rem;overflow:hidden}
      .cgw2-box .cm{white-space:pre-wrap;word-break:break-all}.cgw2-caret{display:inline-block;width:2px;height:1.1em;background:var(--text);animation:cgw2c 1s steps(2) infinite;vertical-align:-3px}
      @keyframes cgw2c{50%{opacity:0}}.cgw2 .nw{animation:cgw2n 1.4s}@keyframes cgw2n{0%{background:rgba(255,200,80,.7)}100%{background:transparent}}
      .cgw2 .gone{text-decoration:line-through;opacity:.6;transition:.3s}
      .cgw2-chk{display:flex;gap:10px;align-items:center}.cgw2-chk span{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:8px;border:1px solid var(--line);color:var(--mute);transition:.3s}.cgw2-chk span .ic{width:16px;height:16px}
      .cgw2-chk span.y{color:var(--ok);border-color:var(--ok);background:color-mix(in srgb,var(--ok) 14%,transparent)}.cgw2-chk span.n{color:var(--bad);border-color:var(--bad);background:color-mix(in srgb,var(--bad) 12%,transparent)}
      .cgw2-pr{border:1px solid var(--line);border-radius:8px;background:var(--bg2);padding:8px 10px;display:grid;gap:7px}
      .cgw2-pr .ttl{display:flex;gap:.5em;align-items:center;font-weight:800;font-size:.875rem}.cgw2-pr .ttl .ic{width:16px;height:16px;color:var(--ok)}
      .cgw2-f{display:grid;grid-template-columns:5.2em 1fr;gap:8px;align-items:baseline;font-size:.875rem}.cgw2-f b{font-size:.75rem;color:var(--mute);padding:.1em .5em;border-radius:6px;border:1px solid var(--line);text-align:center}
      .cgw2-f .tx{min-height:1.6em;border-bottom:1px dashed var(--line)}.cgw2-pen{display:inline-block;width:14px;height:14px;vertical-align:-2px;color:var(--pink);animation:cgw2p .5s infinite alternate}@keyframes cgw2p{to{transform:translate(2px,-2px) rotate(8deg)}}
      .cgw2-rv{display:grid;gap:7px}.cgw2-rv .row2{display:grid;grid-template-columns:7.5em 1fr 4.6em;gap:8px;align-items:center;font-size:.8125rem}
      .cgw2-rv .trk{height:10px;border-radius:6px;background:var(--line);overflow:hidden}.cgw2-rv .trk i{display:block;height:100%;width:0;border-radius:6px;transition:width 1.6s cubic-bezier(.3,.8,.3,1)}.cgw2-rv .num{font:800 .8125rem var(--mono);display:flex;gap:.3em;align-items:center}.cgw2-rv .num .ic{width:15px;height:15px}
      .cgw2-tiles{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}@media(max-width:700px){.cgw2-tiles{grid-template-columns:1fr}}
      .cgw2-tile{display:flex;gap:.7em;align-items:center;border:1px solid var(--line);border-radius:10px;background:var(--card);padding:10px 12px;font-weight:800;font-size:.875rem}.cgw2-tile .ic{width:22px;height:22px;color:var(--c)}
      @media (prefers-reduced-motion:reduce){.cgw2 .nw,.cgw2-caret,.cgw2-pen{animation:none}.cgw2-formula .fc,.cgw2-rv .trk i{transition:none}}
      `);
      const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const sleep = (ms) => new Promise((r) => setTimeout(r, RM ? 0 : ms));
      let tok = 0;
      const KINDS = [['feat', '追加', 'feat: 申込フォームに電話番号欄を追加'], ['fix', '修正', 'fix: 料金表の税込表示を直す'], ['docs', '文書', 'docs: README に起動手順を追記'], ['refactor', '整理', 'refactor: 料金計算を関数に分ける'], ['chore', '雑務', 'chore: ESLint を 9 に更新']];
      const GOOD = 'fix: 料金表の税込表示を直す';
      /* --- コミット --- */
      const formula = h('div', { class: 'cgw2-formula', style: { '--c': TS } }, h('span', { class: 'fc' }, '種類'), h('span', { class: 'fc' }, ':'), h('span', { class: 'fc' }, '何をした'));
      const cm = h('span', { class: 'cm hw' }), box = h('div', { class: 'cgw2-box' }, icon('git-commit-horizontal'), cm, h('span', { class: 'cgw2-caret' }));
      const mkChk = (ic, tip) => { const s = h('span', { 'data-tip': tip }, icon(ic)); return s; };
      const c1 = mkChk('tag', '種類で始まる'), c2 = mkChk('ruler', '50字以内'), c3 = mkChk('message-square-text', '「何を」が分かる');
      const chk = h('div', { class: 'cgw2-chk' }, c1, c2, c3);
      const set = (s, ok) => { s.className = ok === null ? '' : ok ? 'y' : 'n'; };
      const verdict = (t) => { const m = t.match(/^(feat|fix|docs|refactor|test|chore)(\([^)]*\))?:\s*(.{4,})$/); set(c1, t ? !!m : null); set(c2, t ? t.length <= 50 : null); set(c3, t ? !!m && m[3].length >= 6 : null); };
      const kindBtns = KINDS.map(([k, hint, ex]) => h('button', { class: 'cgw2-kind', style: { '--c': TS }, onclick: () => { cur(); typeCommit(ex); kindBtns.forEach((b) => b.classList.toggle('on', b.dataset.k === k)); }, 'data-k': k }, k, h('small', hint)));
      const cur = () => ++tok;
      async function typeCommit(text, keep) {
        const my = tok; cm.replaceChildren(); verdict('');
        if (RM) { cm.textContent = text; verdict(text); return; }
        let acc = '';
        for (const ch of text) { if (my !== tok) return; acc += ch; const sp = h('span', { class: 'nw' }, ch); cm.append(sp); await sleep(40); }
        verdict(acc);
      }
      async function erase(my) { const sp = [...cm.children]; for (let k = sp.length - 1; k >= 0; k--) { if (my !== tok) return false; sp[k].remove(); await sleep(28); } return true; }
      /* --- PR --- */
      const F3 = [['何を', '案件一覧に検索ボックスを追加'], ['なぜ', '件数が増えて探しにくいため'], ['確認方法', '「山田」と入力 → 該当だけ出る']];
      const prRows = F3.map(([l]) => h('div', { class: 'cgw2-f' }, h('b', l), h('div', { class: 'tx hw' })));
      const pr = h('div', { class: 'cgw2-pr' }, h('div', { class: 'ttl' }, icon('git-pull-request'), h('span', { class: 'hw' }, 'feat: 案件検索を追加')), ...prRows);
      async function fillPR(my) {
        prRows.forEach((r) => r.lastChild.replaceChildren());
        for (let i = 0; i < F3.length; i++) {
          const tx = prRows[i].lastChild, pen = h('span', { class: 'cgw2-pen' }, icon('pen-line'));
          if (RM) { tx.textContent = F3[i][1]; continue; }
          tx.append(pen);
          for (const ch of F3[i][1]) { if (my !== tok) return; pen.before(h('span', { class: 'nw' }, ch)); await sleep(36); }
          pen.remove(); await sleep(250);
        }
      }
      /* --- レビュー時間 --- */
      const mkRow = (label, c) => { const bar = h('i', { style: { background: c } }), num = h('span', { class: 'num' }, '—'); return { el: h('div', { class: 'row2' }, h('span', label), h('div', { class: 'trk' }, bar), num), bar, num }; };
      const rs = mkRow('小さな PR（+80行）', 'var(--ok)'), rb = mkRow('巨大な PR（+812行）', 'var(--bad)');
      async function review(my) {
        [rs, rb].forEach((r) => { r.bar.style.transition = 'none'; r.bar.style.width = '0'; r.num.replaceChildren('—'); });
        await sleep(60); if (my !== tok) return;
        const run = (r, to, ic, c) => { r.bar.style.transition = RM ? 'none' : ''; r.bar.style.width = (to / 60) * 100 + '%'; if (RM) { r.num.replaceChildren(icon(ic), to + '分'); r.num.style.color = c; return; }
          let n = 0; const t0 = performance.now(); const tm = setInterval(() => { if (my !== tok) { clearInterval(tm); return; } const f = Math.min(1, (performance.now() - t0) / 1600); n = Math.round(to * f); r.num.replaceChildren(n + '分'); if (f >= 1) { clearInterval(tm); r.num.replaceChildren(icon(ic), to + '分'); r.num.style.color = c; } }, 60); };
        run(rs, 5, 'smile', 'var(--ok)'); run(rb, 60, 'frown', 'var(--bad)');
      }
      /* --- 再生 --- */
      async function play() {
        const my = cur(); formula.classList.remove('go'); kindBtns.forEach((b) => b.classList.remove('on')); cm.replaceChildren(); verdict('');
        await sleep(80); formula.classList.add('go'); await sleep(900);
        // 悪い例 → 消す → 良い例
        for (const ch of 'update') { if (my !== tok) return; cm.append(h('span', { class: 'nw' }, ch)); await sleep(60); }
        verdict('update'); await sleep(900); if (my !== tok) return;
        cm.classList.add('gone'); await sleep(500); cm.classList.remove('gone'); if (!(await erase(my))) return; await sleep(250);
        for (const ch of GOOD) { if (my !== tok) return; cm.append(h('span', { class: 'nw' }, ch)); await sleep(40); }
        verdict(GOOD); kindBtns[1].classList.add('on'); await sleep(500);
        review(my); await fillPR(my);
      }
      const replay = h('button', { class: 'btn ghost', onclick: play }, icon('play'), 'もう一度');
      if (RM) { formula.classList.add('go'); cm.textContent = GOOD; verdict(GOOD); kindBtns[1].classList.add('on'); fillPR(tok); review(tok); } else setTimeout(play, 250);
      el.append(h('div', { class: 'cgw2' },
        h('div', { class: 'cgw2-top' },
          h('div', { class: 'cgw2-card', style: { '--c': TS } }, h('div', { class: 'cgw2-bar' }, h('h4', icon('git-commit-horizontal'), 'コミット'), replay), formula, h('div', { class: 'cgw2-kinds' }, kindBtns), box, chk),
          h('div', { class: 'cgw2-card', style: { '--c': PINK } }, h('h4', icon('git-pull-request'), 'PR（Pull Request）'), pr, h('div', { class: 'cgw2-rv' }, h('div', { style: { font: '700 .75rem var(--font)', color: 'var(--mute)', display: 'flex', gap: '.4em', alignItems: 'center' } }, icon('timer'), 'レビューにかかる時間'), rs.el, rb.el))),
        h('div', { class: 'cgw2-tiles' },
          ...[['scissors', TS, 'コミットは小さく'], ['target', PINK, '1つの目的'], ['book-open', BASIC, 'あとで読める']].map(([ic, c, t]) => h('div', { class: 'cgw2-tile', style: { '--c': c } }, icon(ic), t)))));
      return () => { tok++; };
    },
  };

  /* --- attach: scenes, why, extra quizzes ------------------------------------ */
  (function attach() {
    const L = K.lessons;
    const ins = (lid, scene, at) => { const a = L[lid].scenes; if (!a.some((s) => s.t === scene.t)) a.splice(at, 0, scene); };
    ins('cuivim', sceneWhyCui, 0);
    ins('git', sceneWhyGit, 0);
    const insAfter = (lid, title, scene) => { const a = L[lid].scenes; if (a.some((x) => x.t === scene.t)) return; const i = a.findIndex((x) => x.t === title); a.splice(i < 0 ? a.length : i + 1, 0, scene); };
    insAfter('git', '4つの場所とコマンド', sceneWriting);
    insAfter('git', 'コンフリクトを解決しよう', sceneReview);
    insAfter('git', sceneReview.t, sceneUndo);
    insAfter('git', sceneUndo.t, sceneStash);
    insAfter('git', sceneStash.t, sceneHistory);
    insAfter('git', sceneHistory.t, sceneRelease);
    insAfter('git', sceneRelease.t, sceneSecret);

    const F = (items, loop, cap) => ({ k: 'flow', items, loop, cap });
    const C = (text, o = {}) => Object.assign({ k: 'code', lang: 'html', text }, o);
    const VS = (a, b, cap) => ({ k: 'vs', a, b, cap });
    const ST = (items, cap) => ({ k: 'stack', items, cap });
    const CH = (items, cap) => ({ k: 'chips', items, cap });
    const BG = (i, t, cap) => ({ k: 'big', i, t, cap });
    const ME = (items, cap) => ({ k: 'meter', items, cap });
    const bad = (i, t) => ({ i, t, c: 'bad' }), warn = (i, t) => ({ i, t, c: 'warn' }), ok = (i, t) => ({ i, t, c: 'ok' });
    const WHY = {
      cuivim: {
        'ターミナルを触ってみよう': {
          problem: '「今どこ？」「何がある？」… 画面が無いと<b>迷子</b>になる',
          idea: '「今いる場所」を基準に、<b>1コマンド＝1操作</b>で動く',
          answer: '<code>pwd</code> / <code>ls</code> / <code>cd</code> / <code>mkdir</code> …',
          when: [['今どこ？何がある？', 'pwd / ls'], ['別の場所へ行く', 'cd（.. は1つ上）'], ['作る・消す・動かす', 'mkdir touch / rm / mv'], ['中身を探す', 'cat / grep']],
          pv: F([bad('circle-help', '今どこ？'), bad('folder-search', '何がある？')], null, '目印がなくて迷子'),
          iv: F(['map-pin|今の場所', 'terminal|1命令＝1操作', 'footprints|1歩ずつ進む']),
          av: C('pwd      # 今どこ\nls       # 何がある\ncd docs  # 移動', { lang: 'sh', ok: [1, 2, 3] }),
        },
        'Vim：3つのモード': {
          problem: 'サーバーにはマウスも画面も無い。それでも<b>ファイルを直したい</b>',
          idea: 'キーを「文字を書く」と「命令」で<b>切り替えて使う（モード）</b>',
          answer: '<b>Normal / Insert / Command</b> の3つの部屋',
          when: [['動く・消す・コピーする', 'Normal（迷ったら Esc）'], ['文字を書く', 'Insert（i / a / o）'], ['保存・終了', 'Command（:wq）']],
          pv: F([bad('mouse-off', 'マウスなし'), warn('file-pen', 'でも直したい')]),
          iv: F(['keyboard|同じキーでも', 'toggle-left|モードで意味が変わる']),
          av: CH(['NORMAL 動く・消す', 'INSERT 書く', 'COMMAND 保存']),
        },
      },
      git: {
        '4つの場所とコマンド': {
          problem: '保存した途端、<b>作りかけまで全部</b>記録されると困る。共有もしたい',
          idea: '<b>記録したい変更だけ選び</b>（add）、<b>まとまりごと</b>に記録（commit）、最後に共有（push）',
          answer: '作業 → ステージ → ローカル → リモート の4か所',
          when: [['どの変更を記録する？', 'git add'], ['まとまりに名前を付けて保存', 'git commit'], ['チームに共有する', 'git push'], ['みんなの最新を取り込む', 'git pull']],
          pv: F([warn('pencil', '作りかけ'), bad('git-commit-horizontal', '全部記録'), bad('users', '全員に見える')]),
          iv: F(['mouse-pointer-click|選ぶ add', 'package|まとめる commit', 'send|共有 push']),
          av: C('git add a.html\ngit commit -m "見出し"\ngit push', { lang: 'sh', ok: [1, 2, 3] }),
        },
        'ブランチとマージ': {
          problem: '全員が main を直接いじると、<b>作りかけに全員が巻き込まれる</b>。本番が壊れる',
          idea: '<b>自分用の枝</b>で作って、<b>GitHub の Pull Request</b> でレビューしてから main に入れる',
          answer: 'checkout -b → commit → push → <b>PR を Merge</b> → main を <b>pull</b>',
          when: [['新機能', 'develop から枝 → PR → dev で確認 → main へ（prd）'], ['本番の不具合', 'main から hotfix 枝 → PR → develop にも入れる'], ['作業が長引いた', 'main を pull して、自分の枝に merge']],
          pv: F([warn('users', 'みんなで main'), bad('bomb', '作りかけが本番に')]),
          iv: F(['git-branch|枝を作る', 'git-pull-request|PR でレビュー', 'download|merge 後に pull']),
          av: C('git checkout -b feature/login\ngit commit -m "…"\ngit push -u origin feature/login\n# GitHub で PR → Merge\ngit checkout main\ngit pull', { lang: 'sh', ok: [1, 2, 3, 5, 6] }),
        },
        'コンフリクトを解決しよう': {
          problem: '同じ所を自分と同僚が別々に直した。PR に <b>「衝突している」</b> と出て Merge できない',
          idea: '手元に main を取り込むと印が入る。<b>どちらを残すかは人が決めて</b>、印を消す',
          answer: '<b>checkout main → pull → checkout 自分の枝 → merge main</b> → 直す → <b>add → commit → push</b>',
          when: [['自分の変更が正しい', '自分の変更を残す'], ['main が正しい', 'main の変更を残す'], ['両方必要', '両方残して整える']],
          pv: F([warn('git-pull-request', 'PR が衝突'), bad('swords', 'Merge できない')]),
          iv: F(['git-merge|手元で main を取り込む', 'user-check|人が選ぶ', 'upload|push で PR が直る']),
          av: C('git checkout main\ngit pull\ngit checkout feature/title\ngit merge main\n# 印を消して直す\ngit add index.html\ngit commit\ngit push', { lang: 'sh', ok: [1, 2, 3, 4, 6, 7, 8] }),
        },
        'GitHub と SSH でつなぐ': {
          problem: '毎回パスワード入力＋<b>漏れたら終わり</b>。安全に本人確認したい',
          idea: '<b>鍵のペア</b>：秘密鍵は手元に置き、公開鍵だけ相手に渡す',
          answer: 'SSH キー（<code>ssh-keygen</code> → GitHub に公開鍵を登録）',
          when: [['PCから絶対に出さない', '秘密鍵 id_ed25519'], ['GitHub に登録する', '公開鍵 .pub']],
          pv: F([warn('key-round', '毎回パスワード'), bad('eye', '漏れたら…')]),
          iv: VS({ i: 'lock', t: '秘密鍵', s: '手元だけ' }, { i: 'key', t: '公開鍵', s: '渡してOK' }),
          av: C('ssh-keygen -t ed25519\ncat ~/.ssh/id_ed25519.pub', { lang: 'sh', ok: [1, 2] }),
        },
      },
      css: {
        'CSS の付け方 3 通り': {
          problem: '見出し20個の色を変えたい… <b>20か所</b>直す？',
          idea: '見た目を<b>1か所にまとめて</b>、HTML と分ける',
          answer: '外部 CSS を <code>&lt;link&gt;</code> で読み込む',
          when: [['急ぎの試し書き', 'inline style（非推奨）'], ['1ページだけ', 'style タグ'], ['サイト全体・チーム開発', '外部 CSS（推奨）']],
          pv: F([warn('copy', '20か所に書く'), bad('pencil', '直すのも20か所')]),
          iv: F(['file-code|HTML', 'link|読み込む', 'file-type|style.css']),
          av: C('<link rel="stylesheet"\n      href="style.css">', { ok: [1, 2] }),
        },
        'セレクタと強さ': {
          problem: '<code>.btn-submit { background: blue }</code> と書いたのに、<b>ボタンが赤いまま</b>（他のルールが勝っている）',
          idea: '同じ要素に複数のルールが当たると、<b>強いルールが勝つ</b>。強さは「ID ＞ クラス ＞ タグ」。同じ強さなら後に書いた方',
          answer: 'セレクタを<b>必要な分だけ</b>強くする。<code>!important</code> と <code>#id</code> は避ける',
          when: [['効かない原因を調べる', 'DevTools の Styles（取り消し線＝負けたルール）'], ['直す（おすすめ）', 'セレクタを少し強く（.form .btn-submit）'], ['どうしても', '!important（最終手段・戦争になる）'], ['避ける', '#id セレクタ（上書きできなくなる）']],
          pv: C('.form button      { background: red }\n.btn-submit       { background: blue }\n/* なのに赤い… */', { lang: 'css', err: [1, 3] }),
          iv: C('#submit      { background: green }  /* ID：強い */\n.btn-submit  { background: blue }   /* クラス */\nbutton       { background: gray }   /* タグ：弱い */', { lang: 'css', ok: [1] }),
          av: C('.form button       { background: red }    /* 0-1-1 */\n.form .btn-submit  { background: blue }   /* 0-2-0 ← 勝つ */', { lang: 'css', ok: [2] }),
        },
        '文字のスタイル': {
          problem: '文字がぎっしりで、どこが大事か分からず<b>読みにくい</b>',
          idea: 'サイズ・太さ・行間で、<b>大事さの差</b>を見た目に出す',
          answer: '<code>font-size</code> / <code>font-weight</code> / <code>line-height</code>',
          when: [['見出しと本文に差を付ける', 'size + weight'], ['長文を読みやすく', 'line-height 1.6〜1.8'], ['強調したい', 'weight か color（多用しない）']],
          pv: F([bad('align-justify', '同じ大きさでぎっしり')], null, '読む気がしない'),
          iv: F(['heading|大きさ・太さ', 'rows-3|行間', 'star|強弱をつける']),
          av: C('h1 { font-size: 2rem; }\np  { line-height: 1.7; }', { lang: 'css', ok: [1, 2] }),
        },
        'ボックスモデル': {
          problem: '余白をあけたつもりが、<b>思った所があかない</b>（中？外？）',
          idea: 'すべての要素は<b>4層の箱</b>。どの層をいじるか選ぶ',
          answer: 'content / <b>padding</b> / border / <b>margin</b>',
          when: [['箱の中の余白（背景色も広がる）', 'padding'], ['箱と箱のすき間', 'margin'], ['枠線', 'border']],
          pv: F([warn('ruler', '余白をあけたのに'), bad('circle-help', '思った所があかない')]),
          iv: CH(['content', 'padding', 'border', 'margin'], '外から: margin → border → padding → 中身'),
          av: C('padding: 24px;  /* 中の余白 */\nmargin: 24px;  /* 外のすき間 */', { lang: 'css', ok: [1, 2] }),
        },
        'display：inline / block': {
          problem: '<code>width</code> を指定したのに<b>効かない</b>／勝手に横に並ぶ',
          idea: '要素には「行の中に並ぶ」か「1行を使う」かの<b>性質</b>がある',
          answer: '<code>display</code> で性質を切り替える',
          when: [['改行して全幅を使う', 'block'], ['文の中に並ぶ（幅・高さは効かない）', 'inline'], ['横に並べて幅も指定', 'inline-block / flex']],
          pv: C('span { width: 200px; }\n/* 幅が効かない！ */', { lang: 'css', err: [1] }),
          iv: VS({ i: 'text-cursor', t: 'inline', s: '文の流れ' }, { i: 'rectangle-horizontal', t: 'block', s: '1行まるごと' }),
          av: C('span {\n  display: inline-block;\n  width: 200px;\n}', { lang: 'css', ok: [2, 3] }),
        },
        'Flexbox で並べる': {
          problem: '横並び・中央寄せが<b>margin や float でぐちゃぐちゃ</b>',
          idea: '親に「並べ方」を指示する。軸（主軸・交差軸）で考える',
          answer: '<code>display: flex</code>',
          when: [['1方向（横一列／縦一列）', 'flex'], ['行×列の格子', 'grid'], ['ただ縦に積むだけ', 'block のままで OK']],
          pv: F([warn('move-horizontal', '横に並べたい'), bad('bug', 'float でずれる')]),
          iv: F(['box|親に指示', 'arrow-right-left|主軸', 'arrow-up-down|交差軸']),
          av: C('.box {\n  display: flex;\n  justify-content: center;\n}', { lang: 'css', ok: [2, 3] }),
        },
        'position：重ねる・ずらす': {
          problem: '通知ベルの右上に、赤い未読数を<b>重ねたい</b>。でも文字の横に並んでしまう',
          idea: '<b>基準点</b>を決めてから、ずらす',
          answer: '<code>position</code> + top / left',
          when: [['少しずらす', 'relative'], ['親の中の好きな位置', '親 relative ＋ 子 absolute'], ['画面に固定', 'fixed'], ['スクロールで貼り付く', 'sticky']],
          pv: C('.badge {\n  top: -8px; right: -8px;\n}\n/* position が無いので、効かない */', { lang: 'css', err: [2, 4] }),
          iv: C('.bell  { position: relative; }   /* ① 基準を決める */\n.badge { position: absolute; }   /* ② ずらす側 */', { lang: 'css', ok: [1, 2] }),
          av: C('.bell  { position: relative; }\n.badge { position: absolute;\n         top: -8px; right: -8px; }', { lang: 'css', ok: [1, 2, 3] }),
        },
        'fixed と sticky': {
          problem: '長い料金ページをスクロールすると、<b>ヘッダーが消えて</b>メニューを探し直し',
          idea: '<b>スクロールしたときの動き</b>を指定する',
          answer: '<code>fixed</code> / <code>sticky</code>',
          when: [['常に画面の同じ位置', 'fixed'], ['ある位置まで来たら貼り付く', 'sticky'], ['ふつうに流す', 'static']],
          pv: C('.hd { position: static; }\n/* スクロールすると、ページと一緒に流れて消える */', { lang: 'css', err: [1, 2] }),
          iv: C('.hd { position: fixed; top: 0; }   /* 画面に固定 */\nth  { position: sticky; top: 0; } /* 親の中で止まる */', { lang: 'css', ok: [1, 2] }),
          av: C('.hd {\n  position: sticky;\n  top: 0;   /* これが無いと効かない */\n}', { lang: 'css', ok: [2, 3] }),
        },
        'z-index：重なり順': {
          problem: 'ポップアップを出したのに、<b>背面に隠れた</b>',
          idea: '重なりに<b>順位の数字</b>を付ける。大きいほど手前（position を付けた要素などで効く）',
          answer: '<code>z-index</code>',
          when: [['ふつうのページ', '指定しない'], ['ヘッダー・モーダル', '大きめの値を1か所で決める']],
          pv: F([warn('layers', 'ポップアップ'), bad('eye-off', '背面に隠れた')]),
          iv: F(['layers|重なりに', 'hash|数字が大きいほど手前']),
          av: C('.modal {\n  position: relative;\n  z-index: 100;\n}', { lang: 'css', ok: [2, 3] }),
        },
        'Sass（プラスα）': {
          problem: 'ブランドカラーを<b>30か所</b>に書いた。色を変えるとき地獄',
          idea: '変数・入れ子で<b>「1か所に書く」</b>。書いたら CSS に変換',
          answer: '<b>Sass / SCSS</b>（変換して CSS にする）',
          when: [['小規模', '素の CSS（--変数 でも可）'], ['大規模・チーム', 'Sass']],
          pv: C('a { color: #3b82f6 }\nb { color: #3b82f6 }\n/* …あと28か所 */', { lang: 'css', err: [1, 2] }),
          iv: F(['variable|変数にまとめる', 'file-cog|CSS に変換']),
          av: C('$brand: #3b82f6;\na { color: $brand; }\nb { color: $brand; }', { lang: 'css', ok: [1, 2, 3] }),
        },
      },
    };
    // the two new scenes carry their own why: add their illustrations
    Object.assign(sceneWhyCui.why, {
      pv: ST(['mouse-pointer-click|1枚目を改名', 'mouse-pointer-click|2枚目を改名', 'ellipsis|…30枚目まで'], '同じクリックを30回'),
      iv: F(['list|手順を言葉にする', 'terminal|命令にする', 'repeat|機械に任せる']),
      av: C('for f in photo*.jpg; do\n  mv "$f" "trip_$f"\ndone', { lang: 'sh', ok: [1, 2, 3] }),
    });
    Object.assign(sceneUndo.why, { pv: F([warn('pencil', '誤字に気づいた'), bad('upload', 'push 済み')], null, '他の人も見ている'), iv: F(['hammer|作り直す（push 前）', 'rotate-ccw|打ち消しを足す（push 後）']), av: C('git commit --amend\ngit reset --soft HEAD~1\ngit revert <hash>', { lang: 'sh', ok: [1, 2, 3] }) });
    Object.assign(sceneStash.why, { pv: F([warn('pencil-line', '作業の途中'), bad('siren', '急ぎの依頼')]), iv: F(['archive|引き出しにしまう', 'siren|急ぎを片づける', 'package-open|取り出す']), av: C('git stash\n# 急ぎの対応\ngit stash pop', { lang: 'sh', ok: [1, 3] }) });
    Object.assign(sceneReview.why, { pv: F([warn('message-square', 'コメントが付いた'), bad('git-pull-request', 'PR を出し直す？')]), iv: F(['git-branch|同じ枝で直す', 'upload|push', 'refresh-cw|PR が自動更新']), av: C('git add .\ngit commit -m "fix: ..."\ngit push', { lang: 'sh', ok: [1, 2, 3] }) });
    Object.assign(sceneHistory.why, { pv: F([warn('search', 'いつ・誰が？'), bad('circle-help', '分からない')]), iv: F(['list|log（いつ）', 'user|blame（誰が）', 'file-search|show（なぜ）']), av: C('git log --oneline\ngit blame price.html\ngit show <hash>', { lang: 'sh', ok: [1, 2, 3] }) });
    Object.assign(sceneRelease.why, { pv: F([warn('server', '本番にバグ'), bad('circle-help', 'どの版？')]), iv: F(['tag|版に名前を付ける', 'history|基準にして戻せる']), av: C('git tag v1.2.0\ngit push origin v1.2.0', { lang: 'sh', ok: [1, 2] }) });
    Object.assign(sceneSecret.why, { pv: F([bad('key-round', 'キーを push した')], null, '履歴に残る'), iv: F(['shield-check|先に無効化', 'file-lock-2|二度と入れない']), av: C('echo ".env" >> .gitignore\ngit rm --cached .env', { lang: 'sh', ok: [1, 2] }) });
    Object.assign(sceneWriting.why, { pv: C('修正\nいろいろ\n最終', { lang: 'text', err: [1, 2, 3] }), iv: F(['tag|種類', 'file-text|何を', 'target|1つの目的']), av: C('feat: 案件検索を追加\nfix: 金額の計算を直す', { lang: 'text', ok: [1, 2] }) });
    Object.assign(sceneWhyGit.why, {
      pv: ST(['file|price.html', 'file|price_v2.html', 'file|price_最終_本当.html'], 'どれが最新？'),
      iv: F(['file|ファイルは1つ', 'history|変更を履歴で積む']),
      av: CH([ok('user', '誰が'), ok('clock', 'いつ'), ok('message-square', 'なぜ'), ok('undo-2', '戻せる')]),
    });
    Object.entries(WHY).forEach(([lid, m]) => L[lid].scenes.forEach((s) => { if (m[s.t]) s.why = m[s.t]; }));

    // clarity pass: short, concrete wording (overrides the earlier text)
    const TXT = {
      cuivim: {
        'なぜターミナル？': { idea: '手順を<b>1行の命令</b>にすれば、機械が何度でも間違えずに繰り返してくれる' },
        'ターミナルを触ってみよう': { idea: '<b>「今いる場所」</b>から、1つの命令で1つのことをする' },
        'Vim：3つのモード': { idea: '同じキーでも、<b>「文字を書く」ときと「命令する」ときで役目が変わる</b>（モード）' },
      },
      git: {
        'なぜ Git？': { lead: 'まず困りごとから。「次へ」で、ファイル名で整理するやり方 → Git のやり方へ進みます。', idea: 'ファイルは<b>1つのまま</b>。<b>「誰が・いつ・なぜ変えたか」</b>を記録していく' },
        '4つの場所とコマンド': { idea: '記録したい変更だけ<b>選び</b>（add）、<b>1まとまりずつ記録</b>して（commit）、最後に<b>送る</b>（push）' },
        'コンフリクトを解決しよう': { lead: 'PR に「衝突している」と出たら、<b>手元で main を取り込んで</b>直します。上から順に進めよう。' },
      },
      css: {
        'Flexbox で並べる': { problem: '横並びや中央寄せが、<b><code>margin</code> や <code>float</code> でぐちゃぐちゃ</b>', idea: '親に<b>「どう並べるか」</b>を書く。「横」と「縦」の2つの向き（主軸・交差軸）で考える' },
        'fixed と sticky': { idea: 'スクロールしたとき、<b>どう動くか</b>を決める' },
        'z-index：重なり順': { idea: '重なりに<b>順位の数字</b>を付ける。大きいほど手前に出る（position を付けた要素で効く）' },
        'Sass（プラスα）': { idea: '変数や入れ子で<b>「1か所に書く」</b>。書いたあと、ふつうの CSS に変換する' },
      },
    };
    Object.entries(TXT).forEach(([lid, m]) => L[lid].scenes.forEach((s) => { const t = m[s.t]; if (!t) return; if (t.lead) s.lead = t.lead; ['problem', 'idea', 'answer'].forEach((k) => { if (t[k] && s.why) s.why[k] = t[k]; }); }));

    /* Q5: realistic code visuals + linked keys (same key in pv / iv / av is joined by arrows) */
    const cd = (file, lang, text, o = {}) => Object.assign({ k: 'code', file, lang, text }, o);
    const over = (lid, title, o) => { const s = L[lid].scenes.find((x) => x.t === title); if (!s) return; s.why = Object.assign(s.why || {}, o); };
    over('cuivim', 'なぜターミナル？', {
      problem: '30枚を1つずつ改名する', idea: '1行の命令で繰り返す', answer: '実行すると30枚ぜんぶ改名',
      pv: cd('terminal', 'sh', 'mv photo1.jpg trip_photo1.jpg\nmv photo2.jpg trip_photo2.jpg\n# …あと28回', { err: [1, 2, 3], keys: { 1: 'loop' } }),
      iv: cd('terminal', 'sh', 'for f in photo*.jpg; do\n  mv "$f" "trip_$f"\ndone', { idea: [1, 2], keys: { 1: 'loop' } }),
      av: cd('terminal', 'sh', '$ ls\ntrip_photo1.jpg trip_photo2.jpg\n# …30枚ぜんぶ', { ok: [2, 3], keys: { 2: 'loop' } }),
    });
    over('cuivim', 'ターミナルを触ってみよう', {
      problem: '今どこ？ 何がある？', idea: '1つの命令で1つのこと', answer: 'pwd・ls・cd',
      pv: cd('terminal', 'text', '$ ???\n（今どこ？ 何がある？）\n（どう動く？）', { err: [2, 3], keys: { 1: 'cmd' } }),
      iv: cd('terminal', 'sh', 'pwd      # いまの場所\nls       # 中身を見る\ncd docs  # 動く', { idea: [1, 2, 3], keys: { 1: 'cmd' } }),
      av: cd('terminal', 'sh', '$ pwd\n/Users/kenshu\n$ ls\nindex.html  docs', { ok: [1, 2], keys: { 1: 'cmd' } }),
    });
    over('cuivim', 'Vim：3つのモード', {
      problem: 'キーが命令になって戸惑う', idea: 'モードで役目が変わる', answer: 'i で書く・Esc で戻る・:wq',
      pv: cd('terminal', 'text', '$ vim a.html\n[Normal] hello と押す\n→ 文字が入らず消えたり動く', { err: [2, 3], keys: { 2: 'mode' } }),
      iv: cd('モード', 'text', 'Normal → (i)   → Insert\nInsert → (Esc) → Normal\nNormal → (:)   → Command', { idea: [1, 2, 3], keys: { 1: 'mode' } }),
      av: cd('vim', 'text', '-- INSERT --\nhello\n:wq  ← 保存して終了', { ok: [1, 3], keys: { 1: 'mode' } }),
    });
    over('git', 'なぜ Git？', {
      problem: 'どれが最新か分からない', idea: 'ファイルは1つ・履歴を積む', answer: '誰が・いつ・なぜ が残る',
      pv: cd('フォルダ', 'text', 'price.html\nprice_v2.html\nprice_最終_本当.html', { err: [2, 3], keys: { 3: 'log' } }),
      iv: cd('terminal', 'sh', 'git log --oneline\nc3d4e5f 誤字を修正\nb2c3d4e 画像を差し替え\na1b2c3d 見出しを追加', { idea: [2, 3, 4], keys: { 2: 'log' } }),
      av: cd('terminal', 'text', 'commit a1b2c3d\nAuthor: Lam\nDate:   Mon 10:02\n    見出しを追加', { ok: [2, 3, 4], keys: { 1: 'log' } }),
    });
    over('git', '4つの場所とコマンド', {
      problem: '作りかけまで記録されて困る', idea: '選んで(add) → 記録(commit)', answer: 'a.html だけが記録される',
      pv: cd('作業フォルダ', 'text', 'a.html   完成\nb.html   作りかけ\n→ 全部まとめて記録？', { err: [2, 3], keys: { 2: 'stage' } }),
      iv: cd('terminal', 'sh', 'git add a.html      # 選ぶ\ngit commit -m "見出し"\ngit push           # 共有', { idea: [1], keys: { 1: 'stage' } }),
      av: cd('terminal', 'text', 'Changes to be committed:\n  new file: a.html\nUntracked files:\n  b.html', { ok: [1, 2], keys: { 2: 'stage' } }),
    });
    over('git', 'ブランチとマージ', {
      problem: 'みんなで main を直接触る', idea: '自分の枝で作って、PR で取り込む', answer: 'push → PR → Merge → pull',
      pv: cd('履歴', 'text', 'main: A - B - C\n      ↑ みんなが直接コミット\n作りかけが本番に出る', { err: [2, 3], keys: { 1: 'branch' } }),
      iv: cd('terminal', 'sh', 'git checkout -b feature/login\n# 作業して commit\ngit push -u origin feature/login\n# GitHub で PR を作る → レビュー → Merge', { idea: [1, 3, 4], keys: { 1: 'branch' } }),
      av: cd('terminal', 'sh', 'git checkout main\ngit pull\n# GitHub で進んだ main が手元に届く', { ok: [1, 2], keys: { 2: 'branch' } }),
    });
    over('git', 'コンフリクトを解決しよう', {
      problem: 'PR が衝突して Merge できない', idea: '手元で main を取り込み、印の所だけ人が選ぶ', answer: '印を消して add → commit → push',
      pv: cd('GitHub', 'text', 'This branch has conflicts\nthat must be resolved\n[ Merge pull request ] ← 押せない', { err: [1, 2, 3], keys: { 1: 'mark' } }),
      iv: cd('index.html', 'text', '<<<<<<< HEAD\n  自分の変更（feature/title）\n=======\n  main の変更（同僚）\n>>>>>>> main', { idea: [1, 3, 5], keys: { 1: 'mark' } }),
      av: cd('terminal', 'sh', 'git add index.html\ngit commit\ngit push\n# PR の衝突が消える', { ok: [1, 2, 3], keys: { 1: 'mark' } }),
    });
    over('git', 'GitHub と SSH でつなぐ', {
      problem: 'パスワードを毎回入れる', idea: '鍵のペアで本人確認', answer: '公開鍵を GitHub に登録',
      pv: cd('terminal', 'text', 'git push\nPassword: ********\n# 毎回入力 / 漏れたら終わり', { err: [2, 3], keys: { 2: 'key' } }),
      iv: cd('鍵のペア', 'text', 'id_ed25519      秘密：手元だけ\nid_ed25519.pub  公開：渡してOK', { idea: [1, 2], keys: { 2: 'key' } }),
      av: cd('terminal', 'sh', 'ssh-keygen -t ed25519\ncat ~/.ssh/id_ed25519.pub\n# → GitHub に貼る', { ok: [2, 3], keys: { 2: 'key' } }),
    });

    over('css', 'CSS の付け方 3 通り', {
      problem: '20か所に同じ色を書いた', idea: '1か所にまとめて読み込む', answer: 'link で style.css を読む',
      pv: cd('index.html', 'html', '<h1 style="color:blue">A</h1>\n<h1 style="color:blue">B</h1>\n<h1 style="color:blue">C</h1>\n<!-- …あと17か所 -->', { err: [1, 2, 3], keys: { 1: 'link' } }),
      iv: cd('style.css', 'css', 'h1 {\n  color: blue;\n}', { idea: [1, 2, 3], keys: { 1: 'link' } }),
      av: cd('index.html', 'html', '<link rel="stylesheet"\n      href="style.css">', { ok: [1, 2], keys: { 1: 'link' } }),
    });
    over('css', 'セレクタと強さ', {
      problem: '同じ要素に複数ルール', idea: '細かい指定ほど強い', answer: '<code>#id</code> &gt; <code>.class</code> &gt; <code>タグ</code>',
      pv: cd('style.css', 'css', '.form button { background: red; }\n.btn-submit  { background: blue; }\n/* なのに赤い… */', { err: [2, 3], keys: { 3: 'spec' } }),
      iv: cd('強さ', 'css', '#submit      { … }  /* ID：強い */\n.btn-submit  { … }  /* クラス */\nbutton       { … }  /* タグ：弱い */', { idea: [1], keys: { 1: 'spec' } }),
      av: cd('style.css', 'css', '.form button       { background: red; }\n.form .btn-submit  { background: blue; } /* 勝つ */', { ok: [2], keys: { 2: 'spec' } }),
    });
    over('css', '文字のスタイル', {
      problem: 'どこが大事か分からない', idea: '大きさ・太さ・行間で強弱', answer: 'font-size / weight / line-height',
      pv: cd('style.css', 'css', 'p  { font-size: 14px; }\n/* 見出しも本文も同じ */\nh1 { font-size: 14px; }', { err: [1, 3], keys: { 3: 'type' } }),
      iv: cd('プロパティ', 'text', 'font-size    → 大きさ\nfont-weight  → 太さ\nline-height  → 行の高さ', { idea: [1, 2, 3], keys: { 1: 'type' } }),
      av: cd('style.css', 'css', 'h1 { font-size: 2rem;\n     font-weight: 700; }\np  { line-height: 1.7; }', { ok: [1, 2, 3], keys: { 1: 'type' } }),
    });
    over('css', 'ボックスモデル', {
      problem: '余白が思う所にあかない', idea: '4層の箱：どこをいじる？', answer: 'padding は中・margin は外',
      pv: cd('style.css', 'css', '.card {\n  margin: 24px;  /* ← ここ？ */\n}\n/* 背景が広がらない… */', { err: [2], keys: { 2: 'box' } }),
      iv: cd('4層の箱', 'text', '┌ margin ──────────┐\n│ ┌ border ───────┐ │\n│ │ padding       │ │\n│ │  [ content ]  │ │\n│ └───────────────┘ │\n└───────────────────┘', { idea: [3], keys: { 3: 'box' } }),
      av: cd('style.css', 'css', '.card {\n  padding: 24px; /* 中 */\n  margin: 24px;  /* 外 */\n}', { ok: [2, 3], keys: { 2: 'box' } }),
    });
    over('css', 'display：inline / block', {
      problem: 'width を書いたのに効かない', idea: '要素の「性質」を変える', answer: 'display で切り替える',
      pv: cd('style.css', 'css', 'span {\n  width: 200px; /* 効かない */\n}', { err: [2], keys: { 2: 'disp' } }),
      iv: cd('性質', 'text', 'inline        並ぶ・幅なし\nblock         1行・幅OK\ninline-block  並ぶ・幅OK', { idea: [3], keys: { 3: 'disp' } }),
      av: cd('style.css', 'css', 'span {\n  display: inline-block;\n  width: 200px;\n}', { ok: [2, 3], keys: { 2: 'disp' } }),
    });
    over('css', 'Flexbox で並べる', {
      problem: 'float や margin でずれる', idea: '親に並べ方を書く', answer: 'display: flex',
      pv: cd('style.css', 'css', '.box div {\n  float: left;\n  margin-left: 12px;\n}\n/* 中央にならない… */', { err: [2, 3], keys: { 2: 'flex' } }),
      iv: cd('style.css', 'css', '.box {\n  display: flex;\n  /* 主軸 = 横 → */\n  /* 交差軸 = 縦 ↓ */\n}', { idea: [2], keys: { 2: 'flex' } }),
      av: cd('style.css', 'css', '.box {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}', { ok: [2, 3, 4], keys: { 2: 'flex' } }),
    });
    over('css', 'position：重ねる・ずらす', {
      problem: 'top / right が効かない', idea: '基準点を決めてずらす', answer: '親 relative ＋ 子 absolute',
      pv: cd('style.css', 'css', '.badge {\n  top: 0;\n  right: 0;\n}\n/* 動かない… */', { err: [2, 3], keys: { 2: 'pos' } }),
      iv: cd('position', 'text', 'relative  今の位置から\nabsolute  親（基準）から\nfixed     画面から\nsticky    スクロールで貼付', { idea: [2], keys: { 2: 'pos' } }),
      av: cd('style.css', 'css', '.card  { position: relative; }\n.badge { position: absolute;\n  top: 0; right: 0; }', { ok: [1, 2, 3], keys: { 2: 'pos' } }),
    });
    over('css', 'fixed と sticky', {
      problem: 'スクロールでヘッダーが消える', idea: '動き方を決める', answer: 'position: sticky',
      pv: cd('style.css', 'css', 'header {\n  /* 何も指定なし */\n}\n/* スクロールで消える */', { err: [2, 4], keys: { 2: 'stick' } }),
      iv: cd('position', 'text', 'static   流れのまま（消える）\nfixed    画面に固定\nsticky   途中から貼り付く', { idea: [3], keys: { 3: 'stick' } }),
      av: cd('style.css', 'css', 'header {\n  position: sticky;\n  top: 0;\n}', { ok: [2, 3], keys: { 2: 'stick' } }),
    });
    over('css', 'z-index：重なり順', {
      problem: 'ポップアップが背面に隠れる', idea: '順位の数字をつける', answer: 'position + z-index',
      pv: cd('style.css', 'css', '.modal { z-index: 100; }\n/* 背面のまま！ */', { err: [1], keys: { 1: 'z' } }),
      iv: cd('style.css', 'css', '.modal {\n  position: relative;\n  z-index: 100;\n}', { idea: [2, 3], keys: { 3: 'z' } }),
      av: cd('style.css', 'css', '.header { position: sticky;\n  z-index: 10; }\n.modal  { position: fixed;\n  z-index: 100; }', { ok: [3, 4], keys: { 4: 'z' } }),
    });
    over('css', 'Sass（プラスα）', {
      problem: '同じ色を30か所に書いた', idea: '変数に1回だけ書く', answer: 'Sass で CSS に変換',
      pv: cd('style.css', 'css', 'a { color: #3b82f6 }\nb { color: #3b82f6 }\nc { color: #3b82f6 }\n/* …あと27か所 */', { err: [1, 2, 3], keys: { 1: 'var' } }),
      iv: cd('style.scss', 'css', '$brand: #3b82f6;\n\na { color: $brand; }', { idea: [1], keys: { 1: 'var' } }),
      av: cd('terminal', 'sh', 'sass style.scss style.css\n# → CSS ができる', { ok: [1], keys: { 1: 'var' } }),
    });


    // secondary content lives in header-icon modals (ref), not in the page body
    const extra = (lid, title, fn) => { const s = L[lid].scenes.find((x) => x.t === title); if (!s) return; (s.ref = s.ref || []).push({ title: 'どっちを選ぶ？ クイズ', icon: 'list-checks', node: () => { const box = h('div'); fn(box); return box.firstChild || box; } }); };
    const pull = (lid, title, find, rtitle, ric) => {
      const s = L[lid].scenes.find((x) => x.t === title); if (!s) return;
      const holder = {}; (s.ref = s.ref || []).push({ title: rtitle, icon: ric, node: () => (holder.n ? holder.n.cloneNode(true) : h('div')) });
      const o = s.render; s.render = function (el, ctx) { const r = o.call(this, el, ctx); const n = find(el); if (n) { holder.n = n; n.remove(); } return r; };
    };
    pull('cuivim', 'ターミナルを触ってみよう', (el) => [...el.querySelectorAll('p.lead')].find((p) => /上書き/.test(p.textContent)), 'メモ：> と cd ..', 'sticky-note');
    pull('cuivim', 'Vim：3つのモード', (el) => el.querySelector('.cgk-note'), 'こつ：迷ったら Esc', 'life-buoy');
    extra('css', 'ボックスモデル', (el) => pickQuiz(el, 'どっちを使う？', [
      { q: 'カードの<b>内側</b>に余白をあけたい。背景色も広げたい', options: ['margin', 'padding'], answer: 1, why: '内側の余白＝padding。背景色は padding の部分にも広がる。' },
      { q: 'ボタンと隣のボタンの<b>すき間</b>をあけたい', options: ['margin', 'padding'], answer: 0, why: '箱と箱のすき間＝margin。' },
    ]));
    extra('css', 'display：inline / block', (el) => pickQuiz(el, 'どれにする？', [
      { q: '<code class="i">&lt;span&gt;</code> に <code class="i">width:200px</code> を指定したのに効かない。どうする？', options: ['position を付ける', 'display: inline-block にする', 'margin を増やす'], answer: 1, why: 'span は inline なので幅が効かない。inline-block か block にすれば効く。' },
    ]));
    extra('css', 'Flexbox で並べる', (el) => pickQuiz(el, 'flex？ grid？', [
      { q: 'ナビゲーションのリンクを<b>横一列</b>に並べたい', options: ['flex', 'grid'], answer: 0, why: '1方向（1次元）の並びは flex が得意。' },
      { q: '写真を<b>3列×3行の格子</b>に並べたい', options: ['flex', 'grid'], answer: 1, why: '行と列の2次元は grid が得意。' },
    ]));
    extra('css', 'position：重ねる・ずらす', (el) => pickQuiz(el, '基準はどれ？', [
      { q: '親の<b>右下の角</b>にバッジを置きたい。正しい組み合わせは？', options: ['親 relative ＋ バッジ absolute', '親 absolute ＋ バッジ relative', 'どちらも static'], answer: 0, why: 'absolute は「いちばん近い position 指定のある親」が基準。親を relative にしておく。' },
    ]));
    extra('css', 'CSS の付け方 3 通り', (el) => pickQuiz(el, '迷ったら？', [
      { q: '5ページあるサイトで、ボタンの色を<b>全ページ同時に</b>変えたい', options: ['各ページに inline style', '外部 CSS ファイル', 'style タグを各ページに'], answer: 1, why: '1か所を直せば全ページに反映される＝外部 CSS。' },
    ]));
    // SSH: show the ssh-agent step visually (step 2 had no visual change)
    const setAns = (lid, title, a) => { const sc = L[lid].scenes.find((x) => x.t === title); if (sc) sc.answer = a; };
    setAns('cuivim', '実践：ターミナルで作ってみよう', { code: 'mkdir work\necho "E1001" > work/error.txt\ngrep E1001 work/error.txt', lang: 'sh', file: 'answer.sh' });
    setAns('cuivim', 'Vim：3つのモード', { code: 'i              ← 挿入モードへ\n（何か文字を打つ）\nEsc            ← ノーマルモードに戻る\n:wq と Enter   ← 保存して終了', lang: 'text', file: '手順' });
    const bm = L.git.scenes.find((s) => s.t === 'ブランチとマージ');
    if (bm) (bm.ref = bm.ref || []).push({ title: 'switch / restore（新しい書き方）', icon: 'info', html: '<p><code>git checkout</code> は「枝の移動」と「ファイルを元に戻す」の2役をもつので、新しい Git（2.23 以降）では役割が分かれました。どちらも今は使えます。</p><table class="vref"><thead><tr><th>やりたいこと</th><th>この研修</th><th>新しい書き方</th></tr></thead><tbody><tr><td>枝を移る</td><td><code>git checkout main</code></td><td><code>git switch main</code></td></tr><tr><td>枝を作って移る</td><td><code>git checkout -b feature</code></td><td><code>git switch -c feature</code></td></tr><tr><td>ファイルを元に戻す</td><td><code>git checkout -- a.txt</code></td><td><code>git restore a.txt</code></td></tr></tbody></table><p>記事やチームで <code>switch</code> を見かけたら、<b>checkout と同じ意味</b>だと思って大丈夫。</p>' });
    if (bm) (bm.ref = bm.ref || []).push({ title: 'なぜ main で merge しないの？', icon: 'circle-help', html: '<p>現場では、手元で <code>git merge feature</code> して main に <code>push</code> することは<b>ほとんどしません</b>。代わりに <b>GitHub の Pull Request</b> を使います。</p><ul><li><b>レビュー</b>：仲間が変更を読んで、間違いに気づける</li><li><b>CI</b>：自動テストが通ってから入る</li><li><b>履歴</b>：「誰が・なぜ」が PR に残る</li><li><b>main を守る</b>：直接 push を禁止して、本番が壊れにくい</li></ul>' });
    if (bm) (bm.ref = bm.ref || []).push({ title: 'なぜ pull するの？', icon: 'download', html: '<p>PR を Merge したのは <b>GitHub の上</b>。手元の main は<b>古いまま</b>です。</p><p><code>git checkout main</code> → <code>git pull</code> で、GitHub で進んだ main を手元に取り込みます。これをしないと、次の枝を<b>古い main から</b>作ってしまい、あとで衝突の原因になります。</p>' });
    if (bm) (bm.ref = bm.ref || []).push({ title: 'ゴールとチャレンジ', icon: 'target', html: '<p><b>機能を作る</b>：最新の main から枝 → commit → push → PR を Merge → main を pull。</p><p><b>dev → prd</b>：develop で確認してから main へ。</p><p><b>不具合（hotfix）</b>：main から枝を切って直し、develop にも入れる。</p><p><b>作業中に main が進んだ</b>：main を pull して、自分の枝に merge。</p><p><b>自由に試す</b>：commit → push → 「Pull Request を Merge」。GitHub の main だけが進み、<b>pull するまで手元の main は古い</b>ことを確かめよう。</p>' });
    const ssh = L.git.scenes.find((s) => s.t === 'GitHub と SSH でつなぐ');
    if (ssh) { const o = ssh.render; ssh.render = function (el, ctx) { const r = o.call(this, el, ctx); const st = ctx.steppers[ctx.steppers.length - 1]; if (st) { const pc = el.querySelector('.cg-ssh .bx'); const tag = h('div', { class: 'tag', style: { opacity: 0 } }, icon('shield'), 'ssh-agent に登録済み'); pc.append(tag); const upd = () => { tag.style.opacity = st.cur >= 1 ? 1 : 0; }; const g = st.go; st.go = (n) => { g(n); upd(); }; el.querySelectorAll('.st-bar button').forEach((b) => b.addEventListener('click', () => setTimeout(upd, 0))); upd(); } return r; }; }
  })();
})();
