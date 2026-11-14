/* Supplement lessons (補足) — TS / JS extras beyond the 4 slides.
   ids: x-js-basics, x-ts-narrow, x-ts-utility, x-ts-naming, x-async */
(function () {
  'use strict';
  const K = window.KENSHU, { h, code, stepper, playground, lbl, style, sleep, celebrate } = K.W;
  const VI = 'var(--violet)';

  style('xt', `
  .xt-eq{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:stretch}
  .xt-eq>*{min-width:0}
  .xt-eq3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:stretch}
  .xt-panel{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:14px;display:grid;gap:10px;align-content:start}
  .xt-panel>pre.code{margin:0}
  .xt-seg{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
  .xt-seg button{all:unset;cursor:pointer;padding:.4em 1.1em;border-radius:6px;font-weight:800;font-size:.875rem;border:1px solid var(--line);background:var(--card);transition:.2s}
  .xt-seg button:hover{transform:translateY(-2px)}
  .xt-seg button.on{background:var(--c,var(--violet));color:#06101f;border-color:transparent;box-shadow:0 6px 16px -8px var(--c,var(--violet))}
  .xt-c{display:inline-flex;align-items:center;gap:.4em;padding:.28em .8em;border-radius:8px;font:800 .875rem var(--mono);background:color-mix(in srgb,var(--cc,var(--line)) 16%,var(--card2));border:2px solid var(--cc,var(--line));transition:all .45s cubic-bezier(.3,.9,.3,1.3);white-space:nowrap;animation:pop .4s both}
  .xt-c.out{opacity:0;transform:scale(.3);max-width:0;padding:0;margin:0;border-width:0}
  .xt-c.cur{transform:translateY(-8px) scale(1.12);box-shadow:0 10px 20px -8px var(--cc,var(--violet))}
  .xt-c.rej{opacity:.25;transform:translateY(6px) rotate(10deg) scale(.85)}
  .xt-c.done{opacity:.4}
  .xt-c.btn2{cursor:pointer;user-select:none}.xt-c.btn2:hover{transform:translateY(-3px)}
  .xt-c.btn2.off{opacity:.4;border-style:dashed;filter:grayscale(.6)}
  .xt-c small{font-size:.7em;opacity:.75;font-weight:700}
  .xt-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;min-height:52px;padding-bottom:4px}
  .xt-msg{font:700 .875rem var(--mono);min-height:1.7em;padding:.35em .8em;border-radius:6px;background:var(--code);color:#cfd5ff;transition:.3s}
  .xt-msg.e{color:#ff8f9a;animation:shake .4s}.xt-msg.ok{color:var(--ok)}.xt-msg.w{color:#ffd37a}
  .xt-val{font:900 1.5rem var(--mono);color:var(--c,var(--violet))}
  .xt-bar{height:10px;border-radius:6px;background:var(--line);overflow:hidden}
  .xt-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--ts),var(--vue));border-radius:6px;transition:width .6s cubic-bezier(.3,.9,.3,1)}
  .xt-in{font:inherit;padding:.45em .8em;border-radius:6px;border:1px solid var(--line);background:var(--bg2);color:var(--text);outline:none;min-width:0;width:100%}
  .xt-in:focus{border-color:var(--c,var(--violet));box-shadow:0 0 0 3px color-mix(in srgb,var(--c,var(--violet)) 28%,transparent)}
  .xt-big{font:800 clamp(.95rem,2vw,1.25rem) var(--mono);background:var(--code);color:#d8dcff;padding:14px 16px;border-radius:8px;line-height:1.9;overflow:auto}
  .xt-big .v{padding:.05em .45em;border-radius:8px;background:color-mix(in srgb,var(--vue) 30%,transparent);color:#9bf5d8;border-bottom:2px solid var(--vue);transition:.3s}
  .xt-big .s{color:#9be58b}.xt-big .k{color:#ff9ac1}.xt-big .m{color:#8e97c4}
  .xt-flow{display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:minmax(54px,auto);gap:10px 26px;align-items:center}
  .xt-nd{padding:.55em .8em;border-radius:8px;border:2px solid var(--line);background:var(--card);font:700 .875rem var(--mono);text-align:center;transition:all .4s;opacity:.55;position:relative}
  .xt-nd b{display:block;font-size:.75rem;color:var(--mute);font-weight:700}
  .xt-nd.lit{opacity:1;border-color:var(--vc,var(--violet));background:color-mix(in srgb,var(--vc,var(--violet)) 20%,var(--card));transform:scale(1.04);box-shadow:0 10px 22px -12px var(--vc,var(--violet))}
  .xt-nd.bad{border-color:var(--bad)}
  .xt-nd .lab{position:absolute;left:-22px;top:50%;transform:translateY(-50%);font-size:.75rem;color:var(--mute)}
  .xt-tbl{width:100%;border-collapse:separate;border-spacing:0 5px;font-size:.875rem}
  .xt-tbl th{font:800 .75rem var(--mono);color:var(--mute);padding:.2em .3em}
  .xt-tbl td{padding:.5em .6em;background:var(--card);text-align:center;font-weight:900;transition:.25s}
  .xt-tbl td:first-child{text-align:left;font:800 .875rem var(--mono);border-radius:12px 0 0 12px}
  .xt-tbl td:last-child{border-radius:0 12px 12px 0}
  .xt-tbl tr{cursor:pointer}.xt-tbl tr:hover td{background:var(--card2)}
  .xt-tbl tr.on td{background:color-mix(in srgb,var(--violet) 24%,var(--card))}
  .xt-tbl .y{color:var(--ok)}.xt-tbl .n{color:var(--bad);opacity:.7}
  .xt-lane{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:10px;min-height:128px;display:grid;gap:6px;align-content:start;position:relative}
  .xt-lane>b{font-size:.75rem;letter-spacing:.06em;color:var(--mute)}
  .xt-lane .xt-c{justify-self:start;font-size:.75rem}
  .xt-lane.pulse{animation:none;outline:2px solid var(--vc);outline-offset:2px}
  .xt-out{display:flex;gap:6px;flex-wrap:wrap;min-height:2.4em;font:800 1.25rem var(--mono)}
  .xt-q{font:800 1rem var(--mono);background:var(--code);color:#d8dcff;padding:16px;border-radius:8px;line-height:1.8}
  .xt-q .blank{padding:.05em .8em;border-radius:8px;border:2px dashed var(--violet);color:var(--violet)}
  .xt-q .got{padding:.05em .5em;border-radius:8px;background:color-mix(in srgb,var(--ok) 25%,transparent);color:#9bf5b6}
  .xt-opt{all:unset;cursor:pointer;display:block;padding:.65em 1em;border-radius:8px;border:2px solid var(--line);background:var(--card);font:800 1rem var(--mono);transition:.25s}
  .xt-opt:hover{transform:translateX(5px);background:var(--card2)}
  .xt-opt.ok{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 22%,transparent)}
  .xt-opt.bad{border-color:var(--bad);background:color-mix(in srgb,var(--bad) 20%,transparent);animation:shake .4s}
  .xt-opt.dis{pointer-events:none}
  .xt-pk{position:absolute;top:50%;left:0;transform:translate(-50%,-50%);transition:left 1s cubic-bezier(.5,0,.3,1);z-index:2}
  .xt-lanex{position:relative;display:grid;place-items:center;min-width:60px;min-height:100px}
  .xt-lanex:before{content:"";position:absolute;left:0;right:0;top:50%;border-top:3px dotted var(--line)}
  .xt-spin{width:22px;height:22px;border-radius:50%;border:3px solid var(--line);border-top-color:var(--team);animation:spin 0.8s linear infinite;display:inline-block;vertical-align:middle}
  @keyframes spin{to{transform:rotate(360deg)}}
  .xt-st{display:inline-flex;align-items:center;gap:.5em;padding:.35em 1em;border-radius:6px;font:800 .875rem var(--mono);transition:.4s;border:2px solid var(--line)}
  .xt-st.pending{border-color:var(--team);color:var(--team)}
  .xt-st.fulfilled{border-color:var(--ok);color:var(--ok);background:color-mix(in srgb,var(--ok) 15%,transparent)}
  .xt-st.rejected{border-color:var(--bad);color:var(--bad);background:color-mix(in srgb,var(--bad) 15%,transparent)}
  .xt-bounce{width:16px;height:16px;border-radius:50%;background:var(--pink);animation:xtb 1s ease-in-out infinite alternate}
  @keyframes xtb{to{transform:translateX(120px)}}
  .xt-ui{border:1px dashed var(--line);border-radius:8px;padding:10px 14px;min-height:56px;display:flex;align-items:center;gap:10px;font-weight:800;transition:.3s}
  .xt-score{display:grid;place-items:center;width:130px;height:130px;border-radius:50%;margin:0 auto;font:900 2rem var(--mono);background:conic-gradient(var(--violet) calc(var(--p)*1%),var(--line) 0);position:relative}
  .xt-score:before{content:"";position:absolute;inset:10px;border-radius:50%;background:var(--bg2)}.xt-score span{position:relative}
  .xt-case{padding:12px 14px;border-radius:8px;border:2px solid var(--line);background:var(--card);display:grid;gap:4px;transition:.3s;cursor:default}
  .xt-case.hit{border-color:var(--cc);background:color-mix(in srgb,var(--cc) 18%,var(--card));transform:translateY(-3px) scale(1.02);box-shadow:0 12px 24px -14px var(--cc)}
  .xt-case b{font:900 1.25rem var(--mono);word-break:break-all}
  .xt-case small{color:var(--mute);font-weight:700}
  .xt-stretch{display:flex;flex-direction:column}.xt-stretch>pre.code{flex:1}
  .xt-meter{display:flex;gap:5px}.xt-meter i{flex:1;height:10px;border-radius:6px;background:var(--line);transition:.4s}.xt-meter i.on{background:var(--mc,var(--ok))}
  .xt-log{display:grid;gap:3px;font:700 .75rem var(--mono);color:var(--mute);max-height:150px;overflow:auto}.xt-log div{animation:pop .3s both}.xt-log b{color:var(--violet)}
  @media(max-width:900px){.xt-eq,.xt-eq3{grid-template-columns:1fr}.xt-flow{grid-template-columns:1fr}}
  `);

  /* ---------- helpers ---------- */
  function seg(opts, init, on, color) {
    const box = h('div', { class: 'xt-seg', style: color ? { '--c': color } : null });
    const bs = opts.map(([k, t]) => h('button', { 'data-k': k, class: k === init ? 'on' : '', onclick: () => { bs.forEach((b) => b.classList.toggle('on', b.dataset.k === k)); on(k); } }, t));
    box.append(...bs);
    return box;
  }
  const chip = (t, c, extra) => h('span', { class: 'xt-c' + (extra ? ' ' + extra : ''), style: { '--cc': c || 'var(--violet)' } }, t);
  const msg = () => h('div', { class: 'xt-msg' });
  const setMsg = (m, t, cls) => { m.className = 'xt-msg ' + (cls || ''); m.textContent = t; if (cls === 'e') { m.style.animation = 'none'; void m.offsetWidth; m.style.animation = ''; } };
  const meta = (o) => Object.assign({ cat: 'ts' }, o);
  const nc = (v) => v['main.ts'].replace(/\/\/.*$/gm, '');
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

  /* =====================================================================
     x-js-basics
     ===================================================================== */
  function constLetCards() {
    const mk = (kw) => {
      let x = 1;
      const col = kw === 'const' ? 'var(--pink)' : 'var(--basic)';
      const val = h('b', { class: 'xt-val', style: { '--c': col } }, '1');
      const m = msg(); setMsg(m, 'ボタンを押してみよう', 'w');
      const pre = code(`${kw} x = 1;\nx = x + 1;`, 'js', { color: col });
      const btn = h('button', { class: 'btn', onclick: () => {
        pre.setHi([2]);
        if (kw === 'const') { setMsg(m, '✖ TypeError: Assignment to constant variable.', 'e'); val.animate([{ transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], { duration: 300 }); }
        else { x++; val.textContent = x; val.animate([{ transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 300 }); setMsg(m, '✓ 再代入できた', 'ok'); }
      } }, '▶ x = x + 1 を実行');
      return h('div', { class: 'xt-panel' }, h('div', { class: 'row' }, h('span', { class: 'chip', style: { '--c': col } }, kw), h('span', { style: { color: 'var(--mute)', fontSize: '.875rem', fontWeight: 700 } }, kw === 'const' ? '再代入できない（基本はこちら）' : '再代入できる')), pre, h('div', { class: 'row' }, h('span', { style: { fontWeight: 800 } }, 'x ='), val, h('span', { style: { flex: 1 } }), btn), m);
    };
    return h('div', { class: 'xt-eq' }, mk('const'), mk('let'));
  }

  function arrowStepper() {
    const codes = [
      'function add(a, b) {\n  return a + b;\n}',
      'const add = function (a, b) {\n  return a + b;\n};',
      'const add = (a, b) => {\n  return a + b;\n};',
      'const add = (a, b) => a + b;',
    ];
    const says = [
      '昔ながらの <b>function</b> 宣言。',
      '関数も「値」。<b>変数に入れられる</b>。',
      '<b>function</b> を消して <b>=&gt;</b>（アロー）に。',
      '中身が1行なら <b>{ } と return も省略</b>できる。',
    ];
    const host = h('div', { style: { display: 'grid', gap: '10px', alignContent: 'start' } }), len = h('i'), cnt = h('b', { class: 'xt-val' });
    const res = h('div', { class: 'xt-panel' },
      h('div', { class: 'label' }, '呼び出し結果（どれも同じ）'), h('div', { class: 'xt-big' }, h('span', { class: 'k' }, 'add'), '(2, 3) ', h('span', { class: 'm' }, '→'), ' ', h('span', { class: 'v' }, '5')),
      h('div', { class: 'label' }, 'コードの長さ'), h('div', { class: 'xt-bar' }, len), h('div', { class: 'row' }, cnt, h('span', { style: { color: 'var(--mute)', fontWeight: 700 } }, '文字')),
      h('div', { class: 'xt-msg' }, '例: [1, 2, 3].map(n => n * 2)  → [2, 4, 6]'));
    const max = codes[0].length;
    return stepper({
      color: VI, steps: says.map((say) => ({ say })),
      init(vis) { vis.append(h('div', { class: 'xt-eq' }, host, res)); },
      update(n) {
        host.replaceChildren(code(codes[n], 'js', { file: 'add.js', color: VI, hi: n === 0 ? null : [1] }), code('console.log(add(2, 3)); // 5', 'js', { file: '使う側', color: 'var(--basic)' }));
        len.style.width = Math.round((codes[n].length / max) * 100) + '%'; cnt.textContent = codes[n].length;
      },
    });
  }

  function templateDemo() {
    const nm = h('input', { class: 'xt-in', value: 'Lam' }), ag = h('input', { class: 'xt-in', value: '25', type: 'number' });
    const codeBox = h('div', { class: 'xt-big' }), outBox = h('div', { class: 'xt-big' });
    const draw = () => {
      codeBox.replaceChildren(h('span', { class: 's' }, '`こんにちは、'), h('span', { class: 'v' }, '${name}'), h('span', { class: 's' }, 'さん（'), h('span', { class: 'v' }, '${age}'), h('span', { class: 's' }, '歳）`'));
      outBox.replaceChildren(`こんにちは、`, h('span', { class: 'v' }, nm.value || '…'), 'さん（', h('span', { class: 'v' }, ag.value || '…'), '歳）');
    };
    nm.oninput = ag.oninput = draw; draw();
    return h('div', { class: 'xt-eq' },
      h('div', { class: 'xt-panel' }, h('div', { class: 'label' }, '変数に入れる'), h('div', { class: 'xt-eq' }, h('label', 'name', nm), h('label', 'age', ag)), h('div', { class: 'xt-msg w' }, 'バッククォート ` ` で囲むと ${ } に変数を埋め込める')),
      h('div', { class: 'xt-panel' }, h('div', { class: 'label' }, 'コード'), codeBox, h('div', { class: 'label' }, '結果'), outBox));
  }

  function destructDemo() {
    const user = { name: 'Lam', age: 25, city: 'Tokyo' };
    const colors = { name: 'var(--ts)', age: 'var(--team)', city: 'var(--pink)' };
    const sel = new Set(['name']);
    const src = h('div', { class: 'xt-row' }), codeBox = h('div', { class: 'xt-big' }), vars = h('div', { class: 'xt-row' });
    const draw = () => {
      src.replaceChildren(...Object.entries(user).map(([k, v]) => { const c = chip(`${k}: ${JSON.stringify(v)}`, colors[k], 'btn2' + (sel.has(k) ? '' : ' off')); c.onclick = () => { sel.has(k) ? sel.delete(k) : sel.add(k); draw(); }; return c; }));
      const keys = Object.keys(user).filter((k) => sel.has(k));
      codeBox.replaceChildren(h('span', { class: 'k' }, 'const '), '{ ', ...keys.flatMap((k, i) => [i ? ', ' : '', h('span', { class: 'v' }, k)]), ' } = user;');
      vars.replaceChildren(...(keys.length ? keys.map((k) => chip(`${k} = ${JSON.stringify(user[k])}`, colors[k])) : [h('span', { style: { color: 'var(--mute)' } }, '← プロパティをクリックして選ぶ')]));
    };
    draw();
    return h('div', { class: 'xt-eq' },
      h('div', { class: 'xt-panel' }, h('div', { class: 'label' }, 'user = { … }（クリックで取り出す）'), src, h('div', { class: 'xt-msg w' }, '必要なプロパティだけを、同じ名前の変数に一括で取り出す')),
      h('div', { class: 'xt-panel' }, h('div', { class: 'label' }, 'コード'), codeBox, h('div', { class: 'label' }, '手に入った変数'), vars));
  }

  function spreadDemo() {
    const A = [1, 2], B = [3, 4];
    const on = { a: true, n: true, b: true, u: true, o: true, c: false };
    const arrRes = h('div', { class: 'xt-row' }), arrCode = h('div', { class: 'xt-big' });
    const objRes = h('div', { class: 'xt-row' }), objCode = h('div', { class: 'xt-big' });
    const tog = (k, label, c) => { const e = chip(label, c, 'btn2'); e.onclick = () => { on[k] = !on[k]; e.classList.toggle('off', !on[k]); draw(); }; if (!on[k]) e.classList.add('off'); return e; };
    const draw = () => {
      const parts = []; const vals = [];
      if (on.a) { parts.push('...a'); vals.push(...A); } if (on.n) { parts.push('99'); vals.push(99); } if (on.b) { parts.push('...b'); vals.push(...B); }
      arrCode.replaceChildren(h('span', { class: 'k' }, 'const '), 'r = [', h('span', { class: 'v' }, parts.join(', ')), '];');
      arrRes.replaceChildren(...vals.map((v) => chip(String(v), 'var(--ts)')));
      const op = []; const o = {};
      if (on.u) { op.push('...user'); o.name = 'Lam'; o.age = 25; } if (on.o) { op.push('age: 30'); o.age = 30; } if (on.c) { op.push('city: "Tokyo"'); o.city = 'Tokyo'; }
      objCode.replaceChildren(h('span', { class: 'k' }, 'const '), 'r = { ', h('span', { class: 'v' }, op.join(', ')), ' };');
      objRes.replaceChildren(...Object.entries(o).map(([k, v]) => chip(`${k}: ${JSON.stringify(v)}`, k === 'age' && on.o ? 'var(--pink)' : 'var(--basic)')));
    };
    draw();
    return h('div', { class: 'xt-eq' },
      h('div', { class: 'xt-panel' }, h('div', { class: 'label' }, '配列 a=[1,2]  b=[3,4]'), h('div', { class: 'xt-row' }, tog('a', '...a', 'var(--ts)'), tog('n', '99', 'var(--team)'), tog('b', '...b', 'var(--ts)')), arrCode, arrRes),
      h('div', { class: 'xt-panel' }, h('div', { class: 'label' }, 'オブジェクト user={name,age:25}'), h('div', { class: 'xt-row' }, tog('u', '...user', 'var(--basic)'), tog('o', 'age: 30', 'var(--pink)'), tog('c', 'city', 'var(--team)')), objCode, objRes, h('div', { class: 'xt-msg w' }, '後ろに書いたものが前を上書き（age: 25 → 30）')));
  }

  function pipeline(color) {
    let items = [1, 2, 3, 4, 5, 6], mode = 'map', run = 0;
    const M = {
      map: { code: 'const out = nums.map(x => x * 2);', fn: 'x => x * 2', say: '全員を変換 → 同じ個数' },
      filter: { code: 'const out = nums.filter(x => x % 2 === 0);', fn: 'x => x % 2 === 0', say: '条件に合うものだけ残す' },
      reduce: { code: 'const out = nums.reduce((acc, x) => acc + x, 0);', fn: '(acc, x) => acc + x', say: '1つにまとめる（合計）' },
    };
    const inRow = h('div', { class: 'xt-row' }), outRow = h('div', { class: 'xt-out' }), machine = h('div', { class: 'xt-nd lit', style: { '--vc': color, fontSize: '1rem', padding: '.8em 1em' } });
    const codeHost = h('div'), say = h('div', { class: 'xt-msg w' });
    const drawIn = () => { inRow.replaceChildren(...items.map((n, i) => { const c = chip(String(n), 'var(--ts)'); c.dataset.i = i; return c; })); };
    const reset = () => {
      run++; drawIn(); outRow.replaceChildren(); const m = M[mode];
      machine.replaceChildren(h('b', 'ここで1つずつ処理'), m.fn); codeHost.replaceChildren(code(m.code, 'js', { hi: [1], color: VI })); say.textContent = m.say;
    };
    async function go() {
      reset(); const my = run; const acc = chip('acc = 0', 'var(--team)'); let sum = 0;
      if (mode === 'reduce') outRow.append(acc);
      for (let i = 0; i < items.length; i++) {
        if (my !== run) return; const x = items[i]; const c = inRow.children[i]; c.classList.add('cur');
        if (mode === 'map') machine.replaceChildren(h('b', `x = ${x}`), `${x} * 2 = ${x * 2}`);
        if (mode === 'filter') machine.replaceChildren(h('b', `x = ${x}`), `${x} % 2 === 0 → ${x % 2 === 0}`);
        if (mode === 'reduce') machine.replaceChildren(h('b', `acc = ${sum}, x = ${x}`), `${sum} + ${x} = ${sum + x}`);
        await sleep(520); if (my !== run) return; c.classList.remove('cur');
        if (mode === 'map') { outRow.append(chip(String(x * 2), 'var(--basic)')); c.classList.add('done'); }
        if (mode === 'filter') { if (x % 2 === 0) { outRow.append(chip(String(x), 'var(--basic)')); c.classList.add('done'); } else c.classList.add('rej'); }
        if (mode === 'reduce') { sum += x; acc.textContent = `acc = ${sum}`; acc.animate([{ transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 300 }); c.classList.add('done'); }
        await sleep(260);
      }
      if (my === run) say.innerHTML = '✓ 完了： <b>' + (mode === 'reduce' ? sum : '[' + (mode === 'map' ? items.map((x) => x * 2) : items.filter((x) => x % 2 === 0)).join(', ') + ']') + '</b>';
    }
    const root = h('div', { class: 'xt-panel' },
      h('div', { class: 'row' }, seg([['map', 'map'], ['filter', 'filter'], ['reduce', 'reduce']], 'map', (k) => { mode = k; reset(); }, color), h('span', { style: { flex: 1 } }),
        h('button', { class: 'btn', onclick: () => { items = Array.from({ length: 6 }, () => 1 + Math.floor(Math.random() * 9)); reset(); } }, '🎲 数字を変える'), h('button', { class: 'btn primary', style: { '--c': color }, onclick: go }, '▶ 流す')),
      h('div', { class: 'label' }, '入力 nums'), inRow, h('div', { class: 'label' }, '関数'), machine, h('div', { class: 'label' }, '出力 out'), outRow, codeHost, say);
    reset();
    root.stop = () => { run++; };
    return root;
  }

  function modulesStepper() {
    const S = [
      { say: 'ファイルを分けると部品として使い回せる。でも今は <b>main から add が見えない</b>。', m: 'const add = (a, b) => a + b;\nconst PI = 3.14;', mh: [], n: 'console.log(add(1, 2));\n// ✖ add is not defined', nh: [], e: true, pk: false },
      { say: '外に見せたいものに <b>export</b> を付ける。PI は付けない＝<b>外に見せない</b>。', m: 'export const add = (a, b) => a + b;\nconst PI = 3.14; // 外に見せない', mh: [1], n: 'console.log(add(1, 2));', nh: [], e: true, pk: false },
      { say: '使う側で <b>import { add } from</b>。公開された add が届く！', m: 'export const add = (a, b) => a + b;\nconst PI = 3.14; // 外に見せない', mh: [1], n: 'import { add } from "./math";\nconsole.log(add(1, 2)); // 3', nh: [1], e: false, pk: true },
      { say: '<b>export default</b> は 1ファイル1つ。受け取る側は <b>{ } なし</b>で好きな名前で。', m: 'const add = (a, b) => a + b;\nexport default add;', mh: [2], n: 'import add from "./math";\nconsole.log(add(1, 2)); // 3', nh: [1], e: false, pk: true },
    ];
    const mh = h('div'), nh = h('div'), lane = h('div', { class: 'xt-lanex', style: { alignSelf: 'center' } }), pk = h('span', { class: 'xt-c xt-pk', style: { '--cc': 'var(--basic)' } }, 'add'); lane.append(pk);
    const err = msg(), con = h('div', { class: 'fo2-out' });
    let API = null, busy = false;
    const st = stepper({
      color: VI, steps: S.map((s) => ({ say: s.say })),
      init(vis, api) { API = api; vis.append(h('div', { class: 'fo2-mod' }, h('div', null, h('div', { class: 'label' }, 'math.ts'), mh), lane, h('div', null, h('div', { class: 'label' }, 'main.ts'), nh, err, h('div', { class: 'label', style: { marginTop: '8px' } }, 'コンソール'), con))); },
      update(n) {
        const s = S[n];
        mh.replaceChildren(code(s.m, 'ts', { color: 'var(--basic)', hi: s.mh })); nh.replaceChildren(code(s.n, 'ts', { color: 'var(--ts)', hi: s.nh }));
        err.className = 'xt-msg ' + (s.e ? 'e' : 'ok'); err.textContent = s.e ? '✖ main.ts から add が使えない' : '✓ import できた';
        con.className = 'fo2-out ' + (s.e ? 'e' : 'ok'); con.replaceChildren(s.e ? h('div', { class: 'er' }, 'ReferenceError: add is not defined') : h('div', null, '› 3'));
        pk.style.transition = 'none'; pk.style.left = '0%'; pk.style.opacity = s.pk ? 1 : 0; void pk.offsetWidth;
        if (s.pk) { pk.style.transition = ''; pk.style.left = '82%'; }
      },
    });
    const play = h('button', { class: 'btn primary', style: { '--c': VI }, onclick: async () => { if (busy || !API) return; busy = true; for (let i = 0; i < S.length; i++) { API.go(i); await sleep(1500); } busy = false; } }, K.W.icon('play'), '実行（通し）');
    return h('div', null, st, h('div', { style: { marginTop: '10px' } }, play));
  }

  K.reg({
    id: 'x-js-basics', track: 'extra', title: 'JS の前提知識', sub: 'TS を読むための土台', emoji: '🧱',
    gh: [{ label: 'typescript/ のサンプル', path: 'typescript' }],
    meta: meta({ day: '2日目', when: 'TypeScript 紹介の直後（JS が初めての人向けに）', mins: 10, order: 20, level: '入門', after: 'ts-intro', why: 'TS は JS の上に成り立つ。アロー関数・分割代入・map/filter が読めないと後の例が追えない' }),
    scenes: [
      { t: 'const / let とアロー関数', tag: 'JS', lead: '変数は基本 <b>const</b>。関数は <b>=&gt;</b> でスッキリ書ける。ボタンと「次へ」で確かめよう。',
        render(el) { el.append(constLetCards(), h('div', { style: { height: '16px' } }), arrowStepper()); } },
      { t: 'テンプレート・分割代入・スプレッド', tag: 'JS', lead: 'どれも「書く量を減らす」ための道具。<b>クリック / 入力</b>して結果の変化を見よう。',
        render(el) {
          const holder = h('div'); const tabs = { t: templateDemo, d: destructDemo, s: spreadDemo };
          const show = (k) => holder.replaceChildren(tabs[k]());
          el.append(seg([['t', 'テンプレート ` `'], ['d', '分割代入 { }'], ['s', 'スプレッド ...']], 't', show, VI), holder); show('t');
        } },
      { t: 'map / filter / reduce', tag: 'JS', lead: '配列を<b>1つずつ関数に通す</b>と考えるとわかりやすい。種類を選んで「流す」を押そう。',
        render(el) { const p = pipeline(VI); el.append(p); return p.stop; } },
      { t: 'import / export', tag: 'JS', lead: 'ファイル間で部品を受け渡す仕組み。TypeScript・Vue では毎日使う。', render(el) { el.append(modulesStepper()); } },
    ],
  });

  /* =====================================================================
     x-ts-narrow
     ===================================================================== */
  function matrixScene() {
    const vals = [['42', 'number'], ['"hi"', 'string'], ['true', 'boolean'], ['null', 'null'], ['undefined', 'undefined']];
    const rows = [
      { lv: 5, t: 'number', ok: (k) => k === 'number', note: '数値だけ。', ex: 'let a: number = 42;', r: [true, '✓ 数値OK'] },
      { lv: 3, t: 'string | null', ok: (k) => k === 'string' || k === 'null', note: '文字列か null。使う前に null チェックが必要。', ex: 'let s: string | null = null;\ns.length;', r: [false, "✖ 's' is possibly 'null'"] },
      { lv: 1, t: 'any', ok: () => true, note: '何でも入る＝型チェックがオフ。極力使わない。', ex: 'let v: any = 42;\nv.toUpperCase();', r: [true, '✓ コンパイルは通る → 実行時に落ちる危険！', 'w'] },
      { lv: 4, t: 'unknown', ok: () => true, note: '何でも入る。でも使う前に絞り込み必須（any より安全）。', ex: 'let v: unknown = 42;\nv.toUpperCase();', r: [false, "✖ 'v' is of type 'unknown'"] },
      { lv: 5, t: 'void', ok: (k) => k === 'undefined', note: '「戻り値なし」の関数の型。', ex: 'function log(): void {\n  console.log("hi");\n}', r: [true, '✓ return しない関数に使う'] },
      { lv: 5, t: 'undefined', ok: (k) => k === 'undefined', note: '値がまだ決まっていない。', ex: 'let u: undefined = undefined;', r: [true, '✓ undefined だけ入る'] },
      { lv: 5, t: 'null', ok: (k) => k === 'null', note: '「値がない」を意図的に表す。', ex: 'let n: null = null;', r: [true, '✓ null だけ入る'] },
    ];
    let cur = 2;
    const tb = h('table', { class: 'xt-tbl' }), detail = h('div', { class: 'xt-panel' });
    const draw = () => {
      tb.replaceChildren(h('tr', h('th', '型 ＼ 値'), ...vals.map(([v]) => h('th', v))),
        ...rows.map((r, i) => h('tr', { class: i === cur ? 'on' : '', onclick: () => { cur = i; draw(); } }, h('td', r.t), ...vals.map(([, k]) => h('td', { class: r.ok(k) ? 'y' : 'n' }, r.ok(k) ? '✓' : '✖')))));
      const r = rows[cur];
      detail.replaceChildren(h('div', { class: 'row' }, h('span', { class: 'chip', style: { '--c': VI } }, r.t), h('span', { style: { fontWeight: 700 } }, r.note)), code(r.ex, 'ts', { color: VI }), h('div', { class: 'label' }, '型の安全度'), h('div', { class: 'xt-meter', style: { '--mc': r.lv >= 4 ? 'var(--ok)' : r.lv >= 3 ? 'var(--team)' : 'var(--bad)' } }, ...[1, 2, 3, 4, 5].map((n) => h('i', { class: n <= r.lv ? 'on' : '' }))), h('div', { class: 'xt-msg ' + (r.r[2] || (r.r[0] ? 'ok' : 'e')) }, r.r[1]));
    };
    draw();
    return h('div', { class: 'xt-eq' }, h('div', { class: 'xt-panel' }, h('div', { class: 'label' }, '代入できる？（strict）— 行をクリック'), tb), detail);
  }

  function narrowScene() {
    const src = 'function show(x: string | number | null) {\n  if (x === null) {\n    return "なし";\n  } else if (typeof x === "string") {\n    return x.toUpperCase();\n  } else {\n    return x.toFixed(1);\n  }\n}';
    const pre = code(src, 'ts', { color: VI });
    const N = {};
    const mkN = (key, title, body, c, extra) => (N[key] = h('div', { class: 'xt-nd', style: { '--vc': c } }, h('b', title), body, extra || null));
    const flow = h('div', { class: 'xt-flow' },
      mkN('start', '引数', 'x : string | number | null', VI), h('div'),
      mkN('c1', 'x === null ?', 'if (x === null)', 'var(--ts)'), mkN('r1', 'はい → x : null', '"なし"', 'var(--pink)'),
      mkN('c2', 'いいえ → x : string | number', 'typeof x === "string" ?', 'var(--ts)'), mkN('r2', 'はい → x : string', 'x.toUpperCase()', 'var(--basic)'),
      h('div'), mkN('r3', 'いいえ → x : number', 'x.toFixed(1)', 'var(--team)'));
    const out = msg(); setMsg(out, '値を選ぶと、道筋と x の型が光る', 'w');
    let tk = 0;
    const clear = () => { Object.values(N).forEach((n) => n.classList.remove('lit')); pre.setHi([]); };
    async function run(label, kind) {
      const my = ++tk; clear();
      const steps = kind === 'null' ? [['start', [1]], ['c1', [2]], ['r1', [3]]] : kind === 'string' ? [['start', [1]], ['c1', [2]], ['c2', [4]], ['r2', [5]]] : [['start', [1]], ['c1', [2]], ['c2', [4]], ['r3', [7]]];
      for (const [k, l] of steps) { if (my !== tk) return; N[k].classList.add('lit'); pre.setHi(l); await sleep(620); }
      if (my !== tk) return;
      const result = kind === 'null' ? '"なし"' : kind === 'string' ? '"HELLO"' : '"42.0"';
      setMsg(out, `show(${label}) → ${result}`, 'ok');
    }
    const picks = h('div', { class: 'xt-row' }, h('span', { style: { fontWeight: 800 } }, 'show('), chip('"hello"', 'var(--basic)', 'btn2'), chip('42', 'var(--team)', 'btn2'), chip('null', 'var(--pink)', 'btn2'), h('span', { style: { fontWeight: 800 } }, ')'));
    const ch = picks.querySelectorAll('.xt-c');
    ch[0].onclick = () => run('"hello"', 'string'); ch[1].onclick = () => run('42', 'number'); ch[2].onclick = () => run('null', 'null');
    return h('div', null, h('div', { class: 'xt-eq' }, h('div', { class: 'xt-panel' }, pre, picks, out), h('div', { class: 'xt-panel' }, flow)));
  }

  function optChainScene() {
    const st = { addr: true, city: true };
    const L = {
      a: h('div', { class: 'xt-msg' }), b: h('div', { class: 'xt-msg' }), c: h('div', { class: 'xt-msg' }),
    };
    const obj = h('div', { class: 'xt-big' });
    const tog = (k, label) => { const e = chip(label, 'var(--ts)', 'btn2'); e.onclick = () => { st[k] = !st[k]; if (k === 'addr' && !st.addr) st.city = st.city; e.classList.toggle('off', !st[k]); draw(); }; return e; };
    const row = (expr, m) => h('div', null, h('div', { class: 'xt-big', style: { padding: '8px 12px' } }, expr), m);
    const draw = () => {
      const city = st.addr && st.city ? '"Tokyo"' : undefined;
      obj.replaceChildren('user = { name: "Lam"', st.addr ? h('span', null, ', address: ', h('span', { class: 'v' }, st.city ? '{ city: "Tokyo" }' : '{ }')) : h('span', { class: 'm' }, '  // address なし'), ' }');
      if (!st.addr) setMsg(L.a, "✖ TypeError: Cannot read properties of undefined (reading 'city')", 'e'); else setMsg(L.a, '✓ ' + (st.city ? '"Tokyo"' : 'undefined'), 'ok');
      setMsg(L.b, '✓ ' + (city || 'undefined') + '（落ちない！）', 'ok');
      setMsg(L.c, '✓ ' + (city || '"不明"') + '（undefined のとき既定値）', 'ok');
    };
    draw();
    const vals = [['0', 0], ['""', ''], ['null', null], ['"x"', 'x']];
    let vi = 0; const o1 = msg(), o2 = msg(), codeV = h('div', { class: 'xt-big' });
    const pickRow = h('div', { class: 'xt-row' }, ...vals.map(([t], i) => { const c = chip(t, 'var(--team)', 'btn2' + (i ? ' off' : '')); c.onclick = () => { vi = i; pickRow.querySelectorAll('.xt-c').forEach((x, j) => x.classList.toggle('off', j !== i)); drawV(); }; return c; }));
    const drawV = () => {
      const v = vals[vi]; const t = v[0];
      codeV.replaceChildren(h('span', { class: 'k' }, 'const '), 'v = ', h('span', { class: 'v' }, t), ';');
      const or = v[1] || 'default', nn = v[1] ?? 'default';
      setMsg(o1, `v || "default"  →  ${JSON.stringify(or)}${v[1] === 0 || v[1] === '' ? '  ← 0 や "" も消える！' : ''}`, v[1] === 0 || v[1] === '' ? 'w' : 'ok');
      setMsg(o2, `v ?? "default"  →  ${JSON.stringify(nn)}${v[1] === 0 || v[1] === '' ? '  ← 本物の値を守る' : ''}`, 'ok');
    };
    drawV();
    return h('div', { class: 'xt-eq' },
      h('div', { class: 'xt-panel' }, h('div', { class: 'label' }, '?.  オプショナルチェーン'), obj, h('div', { class: 'xt-row' }, tog('addr', 'address あり'), tog('city', 'city あり')),
        row('user.address.city', L.a), row('user.address?.city', L.b), row('user.address?.city ?? "不明"', L.c)),
      h('div', { class: 'xt-panel' }, h('div', { class: 'label' }, '??  vs  ||（値を選ぶ）'), pickRow, codeV, o1, o2, h('div', { class: 'xt-msg w' }, '?? は null / undefined のときだけ既定値。0 や "" を残したいときは ??')));
  }

  K.reg({
    id: 'x-ts-narrow', track: 'extra', title: 'any / unknown / null と絞り込み', sub: '型を安全に絞る', emoji: '🛡️',
    gh: [{ label: 'any の型', path: 'typescript/10_any_type.ts' }, { label: 'undefined / null', path: 'typescript/11_undefined_null.ts' }],
    meta: meta({ day: '2日目', when: 'データ型の説明の後（スライド p19-21 の補足）', mins: 10, order: 21, level: '入門', after: 'ts-basic', why: 'null / undefined のエラーは現場で最も多い。型ガードで安全に扱う考え方を先に知っておく' }),
    scenes: [
      { t: 'どの型に何が入る？', tag: 'any / unknown', lead: '行を<b>クリック</b>して、型ごとの違いを比べよう。<b>any と unknown</b> の差に注目。', render(el) { el.append(matrixScene()); } },
      { t: '絞り込み（narrowing）', tag: 'typeof', lead: '<b>if で分岐するたびに x の型が絞られる</b>。値を選んで、道筋をたどろう。', render(el) { el.append(narrowScene()); } },
      { t: '?. と ??', tag: '安全に書く', lead: '「無いかも」を<b>1行で</b>安全に扱う書き方。トグルで状況を変えてみよう。', render(el) { el.append(optChainScene()); } },
      { t: '実践：null を安全に扱う', tag: 'PRACTICE', lead: 'ミッションは3つ。<code class="i">x.toString()</code> の赤線を、<b>if で null を先に分けて</b>消そう。',
        render(el) {
          el.append(tsPractice("function describe(x: string | number | null): string {\n  // ここを直す：null → \"なし\" / 文字 → そのまま / 数字 → 文字にして返す\n  return x.toString();\n}\n\nconsole.log(describe(\"hi\"));\nconsole.log(describe(42));\nconsole.log(describe(null));\n", (v, c, ed) => [
            { label: '① 赤線（x.toString() のエラー）をなくす', ok: ed && c.errors.length === 0 },
            { label: '② null のとき「なし」を返す', ok: ed && ranOk(c, (t) => t[2] === 'なし') },
            { label: '③ 実行して hi / 42 / なし の順に出る', ok: ed && ranOk(c, (t) => t.length >= 3 && t[0] === 'hi' && t[1] === '42' && t[2] === 'なし') },
            { optional: true, label: '任意：describe が boolean も受け取り、true なら「はい」、false なら「いいえ」を返す（実行して確かめる）', ok: ed && /boolean/.test(nc(v)) && ranOk(c, (t) => t.includes('はい') && t.includes('いいえ')) },
          ], "// 任意チャレンジ：boolean も受け取る（true は \"はい\"、false は \"いいえ\"）\nfunction describe(x: string | number | boolean | null): string {\n  if (x === null) return \"なし\";\n  if (typeof x === \"boolean\") return x ? \"はい\" : \"いいえ\";\n  return x.toString();\n}\n\nconsole.log(describe(\"hi\"));\nconsole.log(describe(42));\nconsole.log(describe(null));\nconsole.log(describe(true));\nconsole.log(describe(false));\n", 'TypeScript', [{"hint": ["x は null かもしれない（string | number | null）。このままでは toString() を呼べないよ。", "先に if (x === null) で null を分けると、あとは安全。"], "fix": [["  return x.toString();", "  if (x === null) return \"なし\";\n  return x.toString();"]]}, {"hint": ["null のとき返す文字は「なし」。", "関数の最初に if (x === null) return \"なし\"; を書こう。"], "fix": [["  return x.toString();", "  if (x === null) return \"なし\";\n  return x.toString();"]]}, {"hint": ["直したら「▶ 実行」を押そう。", "hi / 42 / なし の順に3行出れば OK。"], "fix": [["  return x.toString();", "  if (x === null) return \"なし\";\n  return x.toString();"]]}, {"hint": ["引数の型に boolean を足す。typeof x === \"boolean\" で分けられるよ。", "if (typeof x === \"boolean\") return x ? \"はい\" : \"いいえ\"; を null の分岐のあとに。describe(true) も console.log しよう。"], "fix": "// 任意チャレンジ：boolean も受け取る（true は \"はい\"、false は \"いいえ\"）\nfunction describe(x: string | number | boolean | null): string {\n  if (x === null) return \"なし\";\n  if (typeof x === \"boolean\") return x ? \"はい\" : \"いいえ\";\n  return x.toString();\n}\n\nconsole.log(describe(\"hi\"));\nconsole.log(describe(42));\nconsole.log(describe(null));\nconsole.log(describe(true));\nconsole.log(describe(false));\n"}], [{ level: 2, label: "undefined も受け取り、undefined のとき「未設定」を返す（実行して確かめる）", hint: ["引数の型に undefined を足す。null と undefined は別物。", "if (x === undefined) return \"未設定\"; を null の分岐のあとに足し、describe(undefined) も console.log しよう。"], ok: (v, c) => /undefined/.test(nc(v)) && ranOk(c, (t) => t.includes('未設定')), code: "function describe(x: string | number | null): string {\n  if (x === null) return \"なし\";\n  return x.toString();\n}\n\nconsole.log(describe(\"hi\"));\nconsole.log(describe(42));\nconsole.log(describe(null));\n\nfunction describe2(x: string | number | null | undefined): string {\n  if (x === null) return \"なし\";\n  if (x === undefined) return \"未設定\";\n  return x.toString();\n}\nconsole.log(describe2(undefined)); // 未設定\n", sol: "\n// 中級チャレンジ：undefined も安全に\nfunction describe2(x: string | number | null | undefined): string {\n  if (x === null) return \"なし\";\n  if (x === undefined) return \"未設定\";\n  return x.toString();\n}\nconsole.log(describe2(undefined)); // 未設定\n" }, { level: 3, label: "{ name: string } のオブジェクトも受け取り、typeof x === \"object\" で絞り込んで「名前:○○」を返す", hint: ["typeof x === \"object\" で、オブジェクトだけを選べる（null は先に除いておく）。", "if (typeof x === \"object\") return \"名前:\" + x.name; を x.toString() の前に。describe({ name: \"Lam\" }) も実行しよう。"], ok: (v, c) => /typeof\s+x\s*===?\s*[\"']object[\"']/.test(nc(v)) && /\.name\b/.test(nc(v)) && ranOk(c, (t) => t.some((x) => x.includes('名前:'))), code: "function describe(x: string | number | null): string {\n  if (x === null) return \"なし\";\n  return x.toString();\n}\n\nconsole.log(describe(\"hi\"));\nconsole.log(describe(42));\nconsole.log(describe(null));\n\nfunction describe3(x: string | number | null | { name: string }): string {\n  if (x === null) return \"なし\";\n  if (typeof x === \"object\") return \"名前:\" + x.name;\n  return x.toString();\n}\nconsole.log(describe3({ name: \"Lam\" })); // 名前:Lam\n", sol: "\n// 上級チャレンジ：オブジェクトも絞り込む\nfunction describe3(x: string | number | null | { name: string }): string {\n  if (x === null) return \"なし\";\n  if (typeof x === \"object\") return \"名前:\" + x.name;\n  return x.toString();\n}\nconsole.log(describe3({ name: \"Lam\" })); // 名前:Lam\n" }]));
        } },
    ],
  });

  /* =====================================================================
     x-ts-utility
     ===================================================================== */
  function asConstStepper() {
    const S = [
      { say: '普通の配列は <b>string[]</b>。なんでも入るので typo が通ってしまう。', code: 'const roles = ["admin", "user", "guest"];\nfunction canEdit(role: string) {\n  return role === "admin";\n}\ncanEdit("superadmin"); // ← 通ってしまう', hi: [5], t1: ['string[]'], t2: null, calls: [['canEdit("admin")', 1], ['canEdit("superadmin")', 2]], hl: 'warn' },
      { say: '<b>as const</b> を付けると「この値そのもの」が型になる（変更不可のタプル）。', code: 'const roles = ["admin", "user", "guest"] as const;\nfunction canEdit(role: string) {\n  return role === "admin";\n}\ncanEdit("superadmin");', hi: [1], t1: ['readonly', '["admin", "user", "guest"]'], t2: null, calls: [['canEdit("admin")', 1], ['canEdit("superadmin")', 2]] },
      { say: '<b>typeof roles[number]</b> で、要素の型だけをユニオンとして取り出す。', code: 'const roles = ["admin", "user", "guest"] as const;\ntype Role = typeof roles[number];\nfunction canEdit(role: string) {\n  return role === "admin";\n}', hi: [2], t1: ['readonly', '["admin", "user", "guest"]'], t2: ['"admin"', '"user"', '"guest"'], calls: [['canEdit("admin")', 1], ['canEdit("superadmin")', 2]] },
      { say: '引数を <b>Role</b> にすれば、<b>"superadmin" は型エラー</b>。typo を事前に防げた！', code: 'const roles = ["admin", "user", "guest"] as const;\ntype Role = typeof roles[number];\nfunction canEdit(role: Role) {\n  return role === "admin";\n}\ncanEdit("superadmin"); // ✖', hi: [3, 6], t1: ['readonly', '["admin", "user", "guest"]'], t2: ['"admin"', '"user"', '"guest"'], calls: [['canEdit("admin")', 1], ['canEdit("superadmin")', 0]] },
    ];
    const codeHost = h('div', { class: 'xt-stretch' }), t1 = h('div', { class: 'xt-row' }), t2 = h('div', { class: 'xt-row' }), calls = h('div', { class: 'xt-col', style: { display: 'grid', gap: '6px' } }), t2box = h('div');
    t2box.append(h('div', { class: 'label' }, 'Role の型'), t2);
    return stepper({
      color: VI, steps: S.map((s) => ({ say: s.say })),
      init(vis) { vis.append(h('div', { class: 'xt-eq' }, codeHost, h('div', { class: 'xt-panel' }, h('div', { class: 'label' }, 'roles の型'), t1, t2box, h('div', { class: 'label' }, '呼び出し'), calls))); },
      update(n) {
        const s = S[n];
        codeHost.replaceChildren(code(s.code, 'ts', { color: VI, hi: s.hi, dim: n === 3 }));
        t1.replaceChildren(...s.t1.map((t) => chip(t, 'var(--ts)'))); t2.replaceChildren(...(s.t2 || []).map((t) => chip(t, 'var(--basic)'))); t2box.style.display = s.t2 ? '' : 'none';
        calls.replaceChildren(...s.calls.map(([c, ok]) => h('div', { class: 'xt-msg ' + (ok === 1 ? 'ok' : ok === 2 ? 'w' : 'e') }, (ok === 1 ? '✓ ' : ok === 2 ? '⚠ 通ってしまう ' : '✖ 型エラー ') + c)));
      },
    });
  }

  function utilityScene() {
    const SRC = [{ k: 'id', t: 'number' }, { k: 'name', t: 'string' }, { k: 'email', t: 'string' }, { k: 'age', t: 'number', opt: true }];
    const ROLE = [{ k: 'admin', t: 'Permission' }, { k: 'user', t: 'Permission' }, { k: 'guest', t: 'Permission' }];
    const COL = { id: 'var(--ts)', name: 'var(--basic)', email: 'var(--team)', age: 'var(--pink)', admin: 'var(--ts)', user: 'var(--basic)', guest: 'var(--team)' };
    let kind = 'Partial'; const keys = new Set(['id', 'name']);
    const resBox = h('div', { class: 'xt-row', style: { flexDirection: 'column', alignItems: 'stretch' } }), srcBox = h('div', { class: 'xt-row', style: { flexDirection: 'column', alignItems: 'stretch' } });
    const codeBox = h('div', { class: 'xt-big' }), note = h('div', { class: 'xt-msg w' });
    const label = (r) => `${r.ro ? 'readonly ' : ''}${r.k}${r.opt ? '?' : ''}: ${r.t}`;
    const nodes = new Map();
    const compute = () => {
      if (kind === 'Record') return ROLE.map((r) => ({ ...r }));
      let l = SRC.map((r) => ({ ...r }));
      if (kind === 'Partial') l.forEach((r) => (r.opt = true));
      if (kind === 'Required') l.forEach((r) => (r.opt = false));
      if (kind === 'Readonly') l.forEach((r) => (r.ro = true));
      if (kind === 'Pick') l = l.filter((r) => keys.has(r.k));
      if (kind === 'Omit') l = l.filter((r) => !keys.has(r.k));
      return l;
    };
    const NOTE = { Partial: '全部 ? になる → 「一部だけ更新」に便利', Required: '全部 ? が外れる（必須になる）', Readonly: '全部 readonly → 変更しようとするとエラー', Pick: '選んだキーだけ取り出す（クリックで選択）', Omit: '選んだキーだけ除く（クリックで選択）', Record: 'キーの集合 → 値の型 の辞書を作る（キーが1つでも欠けるとエラー）' };
    const draw = () => {
      const list = compute();
      srcBox.replaceChildren(...(kind === 'Record' ? ['admin', 'user', 'guest'].map((k) => chip(`"${k}"`, COL[k])) : SRC.map((r) => { const c = chip(label(r), COL[r.k], (kind === 'Pick' || kind === 'Omit') ? 'btn2' + (keys.has(r.k) ? '' : ' off') : ''); if (kind === 'Pick' || kind === 'Omit') c.onclick = () => { keys.has(r.k) ? keys.delete(r.k) : keys.add(r.k); draw(); }; return c; })));
      const want = new Set(list.map((r) => r.k));
      [...nodes].forEach(([k, el]) => { if (!want.has(k)) { el.classList.add('out'); setTimeout(() => { el.remove(); }, 380); nodes.delete(k); } });
      list.forEach((r) => {
        let el = nodes.get(r.k);
        if (!el) { el = chip('', COL[r.k]); el.style.alignSelf = 'flex-start'; nodes.set(r.k, el); }
        el.textContent = label(r); el.classList.remove('out'); resBox.append(el);
      });
      const arg = kind === 'Pick' || kind === 'Omit' ? `User, ${[...keys].map((k) => `"${k}"`).join(' | ') || 'never'}` : kind === 'Record' ? 'Role, Permission' : 'User';
      codeBox.replaceChildren(h('span', { class: 'k' }, 'type '), 'Result = ', h('span', { class: 'v' }, `${kind}<${arg}>`), ';');
      note.textContent = NOTE[kind];
    };
    const sg = seg(['Partial', 'Required', 'Readonly', 'Pick', 'Omit', 'Record'].map((k) => [k, k]), 'Partial', (k) => { kind = k; draw(); }, VI);
    draw();
    return h('div', null, sg, h('div', { class: 'xt-eq' },
      h('div', { class: 'xt-panel' }, h('div', { class: 'label' }, kind === 'Record' ? 'type Role（キー）' : 'interface User'), srcBox),
      h('div', { class: 'xt-panel' }, h('div', { class: 'label' }, '結果'), resBox)), h('div', { class: 'xt-panel', style: { marginTop: '14px' } }, codeBox, note));
  }

  function permScene() {
    const st = { guest: true, typo: false };
    const pre = h('div'), msgs = h('div', { style: { display: 'grid', gap: '6px' } });
    const mk = () => {
      const lines = ['const roles = ["admin", "user", "guest"] as const;', 'type Role = typeof roles[number];', '', 'interface Permission { canEdit: boolean; canDelete: boolean }', '', 'const rolePermissions: Record<Role, Permission> = {', '  admin: { canEdit: true,  canDelete: true  },', '  user:  { canEdit: true,  canDelete: false },'];
      if (st.guest) lines.push('  guest: { canEdit: false, canDelete: false },');
      lines.push('};', '', 'function hasDeletePermission(role: Role) {', '  return rolePermissions[role].canDelete;', '}', '', st.typo ? 'hasDeletePermission("superadmin");' : 'hasDeletePermission("admin");');
      return lines;
    };
    const draw = () => {
      const lines = mk(); const p = code(lines.join('\n'), 'ts', { file: 'permissions.ts', color: VI });
      const errs = []; const errLines = [];
      if (!st.guest) { errs.push("Property 'guest' is missing in type … but required in type 'Record<Role, Permission>'"); errLines.push(6); }
      if (st.typo) { errs.push("Argument of type '\"superadmin\"' is not assignable to parameter of type 'Role'"); errLines.push(lines.length); }
      p.setHi(errLines, 'err'); pre.replaceChildren(p);
      msgs.replaceChildren(...(errs.length ? errs.map((e) => h('div', { class: 'xt-msg e' }, '✖ ' + e)) : [h('div', { class: 'xt-msg ok' }, '✓ 型エラーなし。権限の設定漏れも typo も安全！')]));
    };
    const t1 = chip('guest の行を消す', 'var(--pink)', 'btn2 off'), t2 = chip('"superadmin" を渡す', 'var(--pink)', 'btn2 off');
    t1.onclick = () => { st.guest = !st.guest; t1.classList.toggle('off', st.guest); draw(); };
    t2.onclick = () => { st.typo = !st.typo; t2.classList.toggle('off', !st.typo); draw(); };
    draw();
    return h('div', { class: 'xt-eq' }, pre, h('div', { class: 'xt-panel' }, h('div', { class: 'label' }, 'わざと壊してみよう'), h('div', { class: 'xt-row' }, t1, t2), msgs, h('div', { class: 'label' }, '型が守ってくれるもの'), h('div', { class: 'xt-msg' }, '① Record<Role, …> … キーの書き忘れ'), h('div', { class: 'xt-msg' }, '② Role … "superadmin" のような typo'), h('div', { class: 'xt-msg' }, '③ as const … 配列の書き換え（readonly）'), h('div', { class: 'xt-msg w' }, 'as const + Record + Pick/Omit … 実務の設定管理・権限管理の定番セット')));
  }

  K.reg({
    id: 'x-ts-utility', track: 'extra', title: 'as const とユーティリティ型', sub: '実務で頻出の型テク', emoji: '🧰',
    gh: [{ label: '実務向け解説 (99_bonus.md)', path: 'typescript/12_class/99_bonus.md' }],
    meta: meta({ day: '3日目', when: 'インタフェース / Type の後、または復習の前の余り時間', mins: 10, order: 22, level: '応用', after: 'ts-types', why: '固定値管理・更新処理・権限チェックなど、現場でよく使う型の道具を先取りする' }),
    scenes: [
      { t: 'as const：値をそのまま型に', tag: 'as const', lead: '「次へ」で、<b>typo が型エラーになる</b>までの流れを追おう。', render(el) { el.append(asConstStepper()); } },
      { t: 'ユーティリティ型', tag: 'Partial / Pick / Omit …', lead: '型を選ぶと、<b>元の型がどう変形するか</b>が動いて見える。Pick / Omit はキーをクリック。', render(el) { el.append(utilityScene()); } },
      { t: '組み合わせ：権限チェック', tag: '実務例', lead: 'わざと壊すと<b>型がどこで守ってくれるか</b>が分かる。', render(el) { el.append(permScene()); } },
      { t: '実践：演習問題', tag: 'PRACTICE', lead: 'ミッションは3つ。<b>as const</b> と <b>Pick</b> を1回ずつ使ってみよう。',
        render(el) {
          el.append(tsPractice("interface Product {\n  id: number;\n  name: string;\n  price: number;\n  stock: number;\n}\n\n// ① colors を as const にして、Color を \"red\" | \"green\" | \"blue\" にする\nconst colors = [\"red\", \"green\", \"blue\"];\ntype Color = string; // ← typeof colors[number] にする\nfunction setColor(color: Color) {\n  console.log(`color set to ${color}`);\n}\nsetColor(\"red\");\n\n// ② 価格と在庫だけの型 ProductInfo を Pick で作る\ntype ProductInfo = Product; // ← Pick<Product, ...> にする\nconst info: ProductInfo = { price: 1000, stock: 50 };\nconsole.log(info.price);\n", (v, c, ed) => [
            { label: '① colors に as const を付けて、Color を typeof colors[number] にする', ok: ed && /\bas const\b/.test(nc(v)) && /typeof\s+colors\s*\[\s*number\s*\]|\(\s*typeof\s+colors\s*\)\s*\[\s*number\s*\]/.test(nc(v)) },
            { label: '② ProductInfo を Pick<Product, …> で作る', ok: ed && /Pick\s*<\s*Product\s*,/.test(nc(v)) },
            { label: '③ 赤線なしで実行できる', ok: ed && ranOk(c) },
            { optional: true, label: '任意：Partial<Product> を使った updateProduct(p, patch) を作り、price だけ変えて実行する', ok: ed && /Partial\s*<\s*Product\s*>/.test(nc(v)) && /updateProduct\s*\(/.test(nc(v)) && ranOk(c, (t) => t.some((x) => /800/.test(x))) },
          ], "interface Product {\n  id: number;\n  name: string;\n  price: number;\n  stock: number;\n}\n\nconst colors = [\"red\", \"green\", \"blue\"] as const;\ntype Color = typeof colors[number]; // \"red\" | \"green\" | \"blue\"\nfunction setColor(color: Color) {\n  console.log(`color set to ${color}`);\n}\nsetColor(\"red\");\n\ntype ProductInfo = Pick<Product, \"price\" | \"stock\">;\nconst info: ProductInfo = { price: 1000, stock: 50 };\nconsole.log(info.price);\n\n// 任意チャレンジ：一部だけ更新できる関数\nfunction updateProduct(p: Product, patch: Partial<Product>): Product {\n  return { ...p, ...patch };\n}\nconst sample: Product = { id: 1, name: \"マウス\", price: 1200, stock: 10 };\nconsole.log(updateProduct(sample, { price: 800 }).price); // 800\n", 'TypeScript', [{"hint": ["配列のうしろに as const を付けると、値そのものが型になる。", "type Color = typeof colors[number]; に書き換えよう。"], "fix": [["const colors = [\"red\", \"green\", \"blue\"];", "const colors = [\"red\", \"green\", \"blue\"] as const;"], ["type Color = string; // ← typeof colors[number] にする", "type Color = typeof colors[number];"]]}, {"hint": ["Pick<元の型, \"取り出す項目\"> の形。", "type ProductInfo = Pick<Product, \"price\" | \"stock\">;"], "fix": [["type ProductInfo = Product; // ← Pick<Product, ...> にする", "type ProductInfo = Pick<Product, \"price\" | \"stock\">;"]]}, {"hint": ["2つ直したら「▶ 実行」を押そう。", "color set to red（と 1000）が出れば OK。"], "fix": [["const colors = [\"red\", \"green\", \"blue\"];", "const colors = [\"red\", \"green\", \"blue\"] as const;"], ["type Color = string; // ← typeof colors[number] にする", "type Color = typeof colors[number];"], ["type ProductInfo = Product; // ← Pick<Product, ...> にする", "type ProductInfo = Pick<Product, \"price\" | \"stock\">;"]]}, {"hint": ["「一部の項目だけ渡す」型は Partial<元の型>。", "function updateProduct(p: Product, patch: Partial<Product>): Product { return { ...p, ...patch }; }"], "fix": "interface Product {\n  id: number;\n  name: string;\n  price: number;\n  stock: number;\n}\n\nconst colors = [\"red\", \"green\", \"blue\"] as const;\ntype Color = typeof colors[number]; // \"red\" | \"green\" | \"blue\"\nfunction setColor(color: Color) {\n  console.log(`color set to ${color}`);\n}\nsetColor(\"red\");\n\ntype ProductInfo = Pick<Product, \"price\" | \"stock\">;\nconst info: ProductInfo = { price: 1000, stock: 50 };\nconsole.log(info.price);\n\n// 任意チャレンジ：一部だけ更新できる関数\nfunction updateProduct(p: Product, patch: Partial<Product>): Product {\n  return { ...p, ...patch };\n}\nconst sample: Product = { id: 1, name: \"マウス\", price: 1200, stock: 10 };\nconsole.log(updateProduct(sample, { price: 800 }).price); // 800\n"}], [{ level: 2, label: "Omit<Product, \"id\"> で NewProduct を作り、id を付けて Product にする createProduct(data) を実行する", hint: ["Omit<元の型, \"除く項目\"> で、id だけ抜いた型が作れる。", "type NewProduct = Omit<Product, \"id\">; function createProduct(data: NewProduct): Product { return { id: 1, ...data }; }"], ok: (v, c) => /Omit\s*<\s*Product\s*,\s*[\"']id[\"']\s*>/.test(nc(v)) && /createProduct\s*\(/.test(nc(v)) && ranOk(c, (t) => t.length >= 3), code: "interface Product {\n  id: number;\n  name: string;\n  price: number;\n  stock: number;\n}\n\nconst colors = [\"red\", \"green\", \"blue\"] as const;\ntype Color = typeof colors[number];\nfunction setColor(color: Color) {\n  console.log(`color set to ${color}`);\n}\nsetColor(\"red\");\n\ntype ProductInfo = Pick<Product, \"price\" | \"stock\">;\nconst info: ProductInfo = { price: 1000, stock: 50 };\nconsole.log(info.price);\n\ntype NewProduct = Omit<Product, \"id\">;\nfunction createProduct(data: NewProduct): Product {\n  return { id: 1, ...data };\n}\nconsole.log(createProduct({ name: \"キーボード\", price: 3000, stock: 5 }));\n", sol: "\n// 中級チャレンジ：Omit で「作る前」の型\ntype NewProduct = Omit<Product, \"id\">;\nfunction createProduct(data: NewProduct): Product {\n  return { id: 1, ...data };\n}\nconsole.log(createProduct({ name: \"キーボード\", price: 3000, stock: 5 }));\n" }, { level: 3, label: "Record<Color, number> で色ごとの在庫 stockByColor を作り（3色すべて）、stockByColor.red を出す", hint: ["Record<キー, 値> は「キーが全部そろった辞書」。キーに Color を使うと red / green / blue の3つが必須。", "const stockByColor: Record<Color, number> = { red: 5, green: 3, blue: 0 }; console.log(stockByColor.red);"], ok: (v, c) => /Record\s*<\s*Color\s*,\s*number\s*>/.test(nc(v)) && /stockByColor/.test(nc(v)) && /as const/.test(nc(v)) && ranOk(c, (t) => t.length >= 3), code: "interface Product {\n  id: number;\n  name: string;\n  price: number;\n  stock: number;\n}\n\nconst colors = [\"red\", \"green\", \"blue\"] as const;\ntype Color = typeof colors[number];\nfunction setColor(color: Color) {\n  console.log(`color set to ${color}`);\n}\nsetColor(\"red\");\n\ntype ProductInfo = Pick<Product, \"price\" | \"stock\">;\nconst info: ProductInfo = { price: 1000, stock: 50 };\nconsole.log(info.price);\n\nconst stockByColor: Record<Color, number> = { red: 5, green: 3, blue: 0 };\nconsole.log(stockByColor.red); // 5\n", sol: "\n// 上級チャレンジ：as const と Record を組み合わせる\nconst stockByColor: Record<Color, number> = { red: 5, green: 3, blue: 0 };\nconsole.log(stockByColor.red); // 5\n" }]));
        } },
    ],
  });

  /* =====================================================================
     x-ts-naming
     ===================================================================== */
  function caseScene() {
    const input = h('input', { class: 'xt-in', value: 'user profile name', placeholder: '単語を入力（例: user profile name）' });
    const defs = [
      { k: 'camel', n: 'camelCase', use: '変数・関数・プロパティ', c: 'var(--ts)', f: (w) => w[0] + w.slice(1).map(cap).join(''), ex: 'let userName / function getUser()' },
      { k: 'pascal', n: 'PascalCase', use: 'クラス・interface・type・enum', c: 'var(--pink)', f: (w) => w.map(cap).join(''), ex: 'class UserAccount / type UserID' },
      { k: 'snake', n: 'UPPER_SNAKE_CASE', use: '定数', c: 'var(--team)', f: (w) => w.join('_').toUpperCase(), ex: 'const MAX_RETRIES = 5' },
      { k: 'kebab', n: 'kebab-case', use: 'ファイル・フォルダ名', c: 'var(--basic)', f: (w) => w.join('-'), ex: 'user-profile.ts' },
    ];
    const cap = (s) => s[0].toUpperCase() + s.slice(1);
    const words = (s) => s.replace(/([a-z])([A-Z])/g, '$1 $2').split(/[^A-Za-z0-9]+/).filter(Boolean).map((x) => x.toLowerCase());
    const detect = (s) => /^[a-z][a-zA-Z0-9]*$/.test(s) && /[A-Z]/.test(s) ? 'camel' : /^[A-Z][a-zA-Z0-9]*$/.test(s) && /[a-z]/.test(s) ? 'pascal' : /^[A-Z0-9]+(_[A-Z0-9]+)+$/.test(s) ? 'snake' : /^[a-z0-9]+(-[a-z0-9]+)+(\.\w+)?$/.test(s) ? 'kebab' : '';
    const grid = h('div', { class: 'xt-eq' }), det = msg();
    const draw = () => {
      const s = input.value.trim(); const w = words(s); const hit = detect(s);
      grid.replaceChildren(...defs.map((d) => h('div', { class: 'xt-case' + (hit === d.k ? ' hit' : ''), style: { '--cc': d.c } }, h('small', d.n + ' — ' + d.use), h('b', { style: { color: d.c } }, w.length ? d.f(w) : '…'), h('small', d.ex))));
      const d = defs.find((x) => x.k === hit); setMsg(det, d ? `入力は ${d.n} です → ${d.use} 向き` : '単語を入れると4つの書き方に変換。camelCase などを直接入れると判定します', d ? 'ok' : 'w');
    };
    input.oninput = draw; draw();
    return h('div', { class: 'col' }, h('div', { class: 'xt-panel' }, input, det), grid);
  }

  function namingGame() {
    /* 選択式ではなく、実際のレビューで直す名前を「前 → 後」で見比べる */
    const BEFORE = 'function get(d) {\n  const flag = d.filter(x => x.s === 1);\n  const n = flag.length;\n  return n;\n}\n\nconst ok = check(user);\nlet User_name = "田中";';
    const AFTER = 'function countTodoConsultations(consultations) {\n  const todoList = consultations.filter(c => c.status === STATUS_TODO);\n  const todoCount = todoList.length;\n  return todoCount;\n}\n\nconst isLoggedIn = checkLogin(user);\nlet userName = "田中";';
    const ROWS = [
      ['get', 'countTodoConsultations', '何を取る？ 動詞 + 対象で、処理内容が伝わる名前に', 1],
      ['d', 'consultations', '1文字は検索できない。中身が分かる複数形に', 1],
      ['flag', 'todoList', '何の flag？ 入っている物をそのまま名前にする', 2],
      ['x.s === 1', 'c.status === STATUS_TODO', '1 は何？ 意味のある名前の定数にする', 2],
      ['n', 'todoCount', '件数だと分かる名前に', 3],
      ['ok', 'isLoggedIn', '真偽値は is / has / can から始める', 7],
      ['User_name', 'userName', '変数は camelCase（_ は使わない）', 8],
    ];
    let after = false;
    const cbox = h('div'), tbl = h('div', { class: 'xt-panel' });
    const seg = h('div', { class: 'xt-seg', style: { '--c': VI, alignSelf: 'start', marginBottom: '2px' } }, [['レビュー前', false], ['直したあと', true]].map(([t, v]) => h('button', { class: v === after ? 'on' : '', onclick: () => { after = v; draw(); } }, t)));
    function draw() {
      [...seg.children].forEach((b, i) => b.classList.toggle('on', (i === 1) === after));
      cbox.replaceChildren(code(after ? AFTER : BEFORE, 'ts', { file: 'consultation.ts', color: VI, ...(after ? {} : { }) }));
      const c = cbox.firstChild; if (c && c.setHi) c.setHi(ROWS.map((r) => r[3]), after ? 'on' : 'err');
      tbl.replaceChildren(h('div', { style: { fontWeight: 800, marginBottom: '2px' } }, 'レビューでよく指される名前'), ...ROWS.map(([bad, good, why]) => h('div', { style: { display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto minmax(0,1.3fr)', gap: '8px', alignItems: 'baseline', fontSize: '.875rem' } },
        h('code', { style: { color: 'var(--bad)' } }, bad), h('span', { style: { color: 'var(--mute)' } }, '→'), h('div', null, h('code', { style: { color: 'var(--ok)' } }, good), h('div', { style: { color: 'var(--mute)', fontSize: '.8125rem' } }, why)))));
    }
    draw();
    return h('div', { class: 'xt-eq' }, h('div', { style: { display: 'grid', gap: '10px', alignContent: 'start' } }, seg, cbox), tbl);
  }

  K.reg({
    id: 'x-ts-naming', track: 'extra', title: '命名規則', sub: '読みやすい名前の付け方', emoji: '🏷️',
    gh: [{ label: '命名規則 (03_naming.md)', path: 'typescript/bonus/03_naming.md' }, { label: '良い例・悪い例 (03.1)', path: 'typescript/bonus/03.1_naming_sample.md' }],
    meta: meta({ day: '2日目', when: 'クラスの前、または実践の前の5分', mins: 5, order: 23, level: '入門', after: 'ts-class', why: '名前が揃うとチーム開発でコードが読みやすい。レビューで一番よく指摘される点' }),
    scenes: [
      { t: '4つの書き方', tag: 'case', lead: '単語を入れると、<b>4つのケース</b>に変換。何に使うかも一緒に覚えよう。', render(el) { el.append(caseScene()); } },
      { t: '名前をつけよう', tag: 'review', lead: '実際のレビューで直される名前を、前と後で見比べよう。ボタンで切り替え。名前を考える練習は右上の「練習」アイコンから。', render(el) { el.append(namingGame()); } },
    ],
  });

  /* =====================================================================
     x-async
     ===================================================================== */
  function loopStepper() {
    const CODE = 'console.log("A");\nsetTimeout(() => console.log("B"), 0);\nPromise.resolve().then(() => console.log("C"));\nconsole.log("D");';
    const LBL = { logA: 'log("A")', timer: 'setTimeout', cbB: 'cb → B', then: 'then', cbC: 'cb → C', logD: 'log("D")', logC: 'log("C")', logB: 'log("B")' };
    const COLV = { logA: 'var(--ts)', timer: 'var(--team)', cbB: 'var(--team)', then: 'var(--basic)', cbC: 'var(--basic)', logD: 'var(--ts)', logC: 'var(--basic)', logB: 'var(--team)' };
    const S = [
      { say: 'コードは<b>上から1行ずつ</b>。出力の順番を予想してみよう → 「次へ」', hi: [], stack: [], web: [], micro: [], task: [], out: [] },
      { say: '<b>log("A")</b> がスタックで実行され、すぐ出力。', hi: [1], stack: ['logA'], web: [], micro: [], task: [], out: ['A'] },
      { say: '<b>setTimeout</b> は待たずにブラウザ（Web API）にタイマーを預ける。', hi: [2], stack: ['timer'], web: ['cbB'], micro: [], task: [], out: ['A'] },
      { say: '<b>Promise.then</b> のコールバックは<b>マイクロタスク</b>の列へ。', hi: [3], stack: ['then'], web: ['cbB'], micro: ['cbC'], task: [], out: ['A'] },
      { say: '<b>log("D")</b>。同期のコードは、待ち行列より先に全部終わる。', hi: [4], stack: ['logD'], web: ['cbB'], micro: ['cbC'], task: [], out: ['A', 'D'] },
      { say: 'スタックが空。タイマーが終わり B は<b>タスクキュー</b>へ。でも先に動くのは…', hi: [], stack: [], web: [], micro: ['cbC'], task: ['cbB'], out: ['A', 'D'] },
      { say: '<b>マイクロタスク（Promise）が優先</b>。C を実行！', hi: [3], stack: ['logC'], web: [], micro: [], task: ['cbB'], out: ['A', 'D', 'C'] },
      { say: '最後に<b>タスクキュー</b>から B。', hi: [2], stack: ['logB'], web: [], micro: [], task: [], out: ['A', 'D', 'C', 'B'] },
      { say: '結果は <b>A → D → C → B</b>。Promise は setTimeout(0) より先！', hi: [], stack: [], web: [], micro: [], task: [], out: ['A', 'D', 'C', 'B'] },
    ];
    const lanes = {}; const els = {};
    const mkLane = (k, t, c) => (lanes[k] = h('div', { class: 'xt-lane', style: { '--vc': c } }, h('b', t)));
    const outBox = h('div', { class: 'xt-out' }); const codeHost = h('div', { class: 'xt-stretch' });
    const moveTo = (lane, key) => { let e = els[key]; if (!e) { e = chip(LBL[key], COLV[key]); els[key] = e; } if (e.parentNode !== lane) { lane.append(e); e.style.animation = 'none'; void e.offsetWidth; e.style.animation = ''; } return e; };
    return stepper({
      color: VI, interval: 2300, steps: S.map((s) => ({ say: s.say })),
      init(vis) {
        vis.append(h('div', { class: 'xt-eq' }, codeHost, h('div', { class: 'xt-panel' }, h('div', { class: 'label' }, 'console 出力'), outBox)),
          h('div', { class: 'xt-eq3', style: { marginTop: '12px', gridTemplateColumns: 'repeat(4,minmax(0,1fr))' } }, mkLane('stack', 'コールスタック', 'var(--ts)'), mkLane('web', 'Web API（待機中）', 'var(--team)'), mkLane('micro', 'マイクロタスク', 'var(--basic)'), mkLane('task', 'タスクキュー', 'var(--pink)')));
      },
      update(n) {
        const s = S[n];
        codeHost.replaceChildren(code(CODE, 'js', { color: VI, hi: s.hi, dim: n > 0 }));
        const wanted = new Set([...s.stack, ...s.web, ...s.micro, ...s.task]);
        Object.keys(els).forEach((k) => { if (!wanted.has(k)) { els[k].remove(); delete els[k]; } });
        ['stack', 'web', 'micro', 'task'].forEach((ln) => s[ln].forEach((k) => moveTo(lanes[ln], k)));
        Object.entries(lanes).forEach(([k, el]) => el.style.outline = s[k].length ? '2px solid ' + el.style.getPropertyValue('--vc') : 'none');
        outBox.replaceChildren(...s.out.map((t) => chip(t, 'var(--ok)')));
      },
    });
  }

  function promiseScene() {
    let mode = 'ok', delay = 2, tk = 0;
    const L1 = ['async function load() {', '  setLoading(true);', '  try {', '    const user = await fetchUser(1);', '    show(user.name);', '  } catch (e) {', '    showError(e.message);', '  } finally {', '    setLoading(false);', '  }', '}'];
    const pre = code(L1.join('\n'), 'js', { color: VI, dim: true, file: 'async / await' });
    const pre2 = code('fetchUser(1)\n  .then((user) => show(user.name))\n  .catch((e) => showError(e.message))\n  .finally(() => setLoading(false));', 'js', { color: 'var(--basic)', file: '同じことを .then() で' });
    const logBox = h('div', { class: 'xt-log' }); let t0g = 0; const log = (t) => { const d = h('div', h('b', ((performance.now() - t0g) / 1000).toFixed(1) + 's '), t); logBox.append(d); logBox.scrollTop = 1e6; };
    const st = h('span', { class: 'xt-st' }), bar = h('div', { class: 'xt-bar' }, h('i')), time = h('b', { class: 'xt-val' }, '0.0s'), ui = h('div', { class: 'xt-ui' }, '待機中'), btn = h('button', { class: 'btn primary', style: { '--c': VI } }, '▶ fetchUser(1) を実行');
    const setSt = (s) => { st.className = 'xt-st ' + s; st.innerHTML = s === 'pending' ? '<span class="xt-spin"></span> pending（待ち）' : s === 'fulfilled' ? '✓ fulfilled（成功）' : s === 'rejected' ? '✖ rejected（失敗）' : 'まだ呼んでいない'; };
    setSt('idle');
    const fill = bar.firstChild;
    async function run() {
      const my = ++tk; const ms = delay * 1000; btn.disabled = true; t0g = performance.now(); logBox.replaceChildren(); log('load() 開始 → setLoading(true)');
      pre.setHi([1, 2]); setSt('pending'); ui.innerHTML = '<span class="xt-spin"></span> 読み込み中…'; fill.style.transition = 'none'; fill.style.width = '0'; void fill.offsetWidth;
      await sleep(350); if (my !== tk) return; log('await fetchUser(1) … ここで待つ（pending）'); pre.setHi([3, 4]); fill.style.transition = `width ${ms}ms linear`; fill.style.width = '100%';
      const t0 = performance.now(); const iv = setInterval(() => { time.textContent = ((performance.now() - t0) / 1000).toFixed(1) + 's'; }, 100);
      await sleep(ms); clearInterval(iv); if (my !== tk) return; time.textContent = (ms / 1000).toFixed(1) + 's';
      if (mode === 'ok') { log('fulfilled → show(user.name)'); setSt('fulfilled'); pre.setHi([5]); ui.textContent = '✓ ようこそ、Lam さん'; ui.style.borderColor = 'var(--ok)'; }
      else { log('rejected → catch → showError()'); setSt('rejected'); pre.setHi([6, 7]); ui.textContent = '✖ ユーザーが見つかりません'; ui.style.borderColor = 'var(--bad)'; }
      await sleep(900); if (my !== tk) return; log('finally → setLoading(false)'); pre.setHi([8, 9]); await sleep(900); if (my !== tk) return;
      pre.setHi([]); btn.disabled = false; ui.style.borderColor = '';
    }
    btn.onclick = run;
    const dl = h('span', { class: 'xt-val', style: { fontSize: '1rem' } }, '2.0s');
    const rg = h('input', { type: 'range', min: 0.5, max: 4, step: 0.5, value: 2, style: { flex: 1, accentColor: 'var(--violet)' }, oninput: (e) => { delay = +e.target.value; dl.textContent = delay.toFixed(1) + 's'; } });
    const ctl = h('div', { class: 'row' }, seg([['ok', '成功する'], ['ng', '失敗する']], 'ok', (k) => (mode = k), VI), h('span', { style: { fontWeight: 800 } }, 'サーバー応答'), rg, dl, btn);
    const right = h('div', { class: 'xt-panel' }, h('div', { class: 'label' }, 'Promise の状態'), h('div', { class: 'row' }, st, h('span', { style: { flex: 1 } }), time), bar, h('div', { class: 'label' }, '画面（UI）'), ui,
      h('div', { class: 'label' }, '待っている間もUIは止まらない'), h('div', { class: 'row', style: { minHeight: '30px' } }, h('span', { class: 'xt-bounce' })), h('div', { class: 'label' }, '実行ログ'), logBox);
    const root = h('div', null, ctl, h('div', { class: 'xt-eq', style: { marginTop: '12px' } }, h('div', { class: 'col' }, pre, pre2), right));
    root.stop = () => { tk++; };
    return root;
  }

  K.reg({
    id: 'x-async', track: 'extra', title: '非同期処理', sub: 'Promise と async / await', emoji: '⏱️',
    gh: [{ label: '非同期 (Async.md)', path: 'vuejs/99_bonus/Async.md' }, { label: 'API 連携 (11_api)', path: 'vuejs/11_api' }],
    meta: meta({ day: '3日目', when: 'ジェネリクスの後の余り時間、または Vue の API 連携の前', mins: 15, order: 24, level: '応用', after: 'ts-generics', why: 'API 通信・タイマー・ファイル読み込みはすべて非同期。Vue の演習で必ず使う' }),
    scenes: [
      { t: '待っている間、何が動く？', tag: 'イベントループ', lead: '同じ 4 行でも出力は <b>A D C B</b>。「次へ」で、<b>どの箱を通るか</b>を追おう。', render(el) { el.append(loopStepper()); } },
      { t: 'Promise の 3 つの状態', tag: 'async / await', lead: '応答時間をいじって<b>実行</b>。pending → fulfilled / rejected と、コードの<b>どの行が動いているか</b>を見よう。',
        render(el) { const p = promiseScene(); el.append(p); return p.stop; } },
      { t: '実践：順番を読み解く', tag: 'PRACTICE', lead: 'ミッションは3つ。<code class="i">await</code> と <code class="i">try / catch</code> で、成功と失敗の両方を書こう。',
        render(el) {
          const starter = `const wait = (ms) => new Promise((r) => setTimeout(r, ms));\n\nasync function fetchUser(id) {\n  await wait(500);\n  if (id < 0) throw new Error("not found");\n  return { id, name: "Lam" };\n}\n\nconsole.log("1: 開始");\n\n// TODO: async 関数 main() を作り、\n//  fetchUser(1) の name を表示\n//  fetchUser(-1) の失敗を try / catch で捕まえて表示\n// 作ったら main() を呼ぶのを忘れずに\n\nconsole.log("3: 終了");\n`;
          el.append(playground({
            title: 'JavaScript', mode: 'web', files: [{ name: 'main.js', lang: 'js', code: starter }],
            solution: { 'main.js': 'const wait = (ms) => new Promise((r) => setTimeout(r, ms));\n\nasync function fetchUser(id) {\n  await wait(500);\n  if (id < 0) throw new Error("not found");\n  return { id, name: "Lam" };\n}\n\nconsole.log("1: 開始");\n\nasync function main() {\n  try {\n    const user = await fetchUser(1);\n    console.log("2:", user.name);\n    // 任意チャレンジ：2人を同時に待つ\n    const [a, b] = await Promise.all([fetchUser(1), fetchUser(2)]);\n    console.log("同時:", a.name, b.name);\n    await fetchUser(-1); // ここで失敗する\n  } catch (e) {\n    console.log("エラー:", e.message);\n  }\n}\nmain();\n\nconsole.log("3: 終了");\n\n// 中級チャレンジ：失敗しても止まらない\nasync function safeFetch(id) {\n  try {\n    return await fetchUser(id);\n  } catch (e) {\n    return null;\n  }\n}\nsafeFetch(-1).then((r) => console.log("safeFetch(-1):", r));\n\n// 上級チャレンジ：時間切れにする\nfunction withTimeout(promise, ms) {\n  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("タイムアウト")), ms));\n  return Promise.race([promise, timeout]);\n}\nwithTimeout(fetchUser(1), 300).catch((e) => console.log("withTimeout:", e.message));\n' },
            tasks: (v) => { const s = v['main.js'].replace(/\/\/.*$/gm, ''); const edited = v['main.js'] !== starter; return [
              { hint: ['async function main() { … } を作って、中で await fetchUser(1) を使う。', 'const user = await fetchUser(1); console.log("2:", user.name);'], answer: { code: starter.replace('\nconsole.log("3: 終了");', '\nasync function main() {\n  const user = await fetchUser(1);\n  console.log("2:", user.name);\n}\nmain();\n\nconsole.log("3: 終了");'), lang: 'js', mode: 'replace' }, label: '① async 関数 main を作り、中で await fetchUser(1) を使う', ok: edited && /async\s+function\s+main[\s\S]*await\s+fetchUser\(\s*1\s*\)|const\s+main\s*=\s*async[\s\S]*await\s+fetchUser\(\s*1\s*\)/.test(s) },
              { hint: ['失敗しそうな呼び出しは try { … } で囲み、catch (e) で受ける。', 'try { await fetchUser(-1); } catch (e) { console.log("エラー:", e.message); }'], answer: { code: starter.replace('\nconsole.log("3: 終了");', '\nasync function main() {\n  try {\n    const user = await fetchUser(1);\n    console.log("2:", user.name);\n    await fetchUser(-1);\n  } catch (e) {\n    console.log("エラー:", e.message);\n  }\n}\nmain();\n\nconsole.log("3: 終了");'), lang: 'js', mode: 'replace' }, label: '② fetchUser(-1) の失敗を try / catch で捕まえる', ok: edited && /try\s*{[\s\S]*fetchUser\(\s*-1\s*\)[\s\S]*}\s*catch/.test(s) },
              { hint: ['最後に main(); と書いて呼ばないと動かないよ。', '「1 → 3 → 2」の順に出れば OK（await の続きはあとから）。'], answer: { code: starter.replace('\nconsole.log("3: 終了");', '\nasync function main() {\n  try {\n    const user = await fetchUser(1);\n    console.log("2:", user.name);\n    await fetchUser(-1);\n  } catch (e) {\n    console.log("エラー:", e.message);\n  }\n}\nmain();\n\nconsole.log("3: 終了");'), lang: 'js', mode: 'replace' }, label: '③ main() を呼び出す（「1 → 3」が先に出る）', ok: edited && /(^|[^\w.])main\s*\(\s*\)\s*;?/.test(s.replace(/async\s+function\s+main\s*\(/, '')) },
              { optional: true, level: 1, hint: ['2人分を「同時に」待つ道具は Promise.all。配列で渡すよ。', 'const [a, b] = await Promise.all([fetchUser(1), fetchUser(2)]);'], answer: { code: starter.replace('\nconsole.log("3: 終了");', '\nasync function main() {\n  const [a, b] = await Promise.all([fetchUser(1), fetchUser(2)]);\n  console.log(a.name, b.name);\n}\nmain();\n\nconsole.log("3: 終了");'), lang: 'js', mode: 'replace' }, label: 'Promise.all で fetchUser(1) と fetchUser(2) を同時に待つ', ok: edited && /await\s+Promise\.all\s*\(\s*\[[\s\S]*fetchUser\(\s*1\s*\)[\s\S]*fetchUser\(\s*2\s*\)[\s\S]*\]\s*\)/.test(s) },
              { optional: true, level: 2, hint: ['失敗しても止まらない関数にするには、中で try / catch して「失敗したら null」を返す。', 'async function safeFetch(id) { try { return await fetchUser(id); } catch (e) { return null; } }'], answer: { code: starter.replace('\nconsole.log("3: 終了");', '\nasync function safeFetch(id) {\n  try {\n    return await fetchUser(id);\n  } catch (e) {\n    return null;\n  }\n}\nasync function main() {\n  console.log("2:", await safeFetch(1));\n  console.log("失敗:", await safeFetch(-1)); // null\n}\nmain();\n\nconsole.log("3: 終了");'), lang: 'js', mode: 'replace' }, label: 'safeFetch(id) を作る（失敗しても止まらず、失敗したら null を返す）', ok: edited && /(async\s+function\s+safeFetch|const\s+safeFetch\s*=\s*async)[\s\S]*catch[\s\S]*return\s+null/.test(s) && /safeFetch\s*\(\s*-1\s*\)/.test(s) },
              { optional: true, level: 3, hint: ['「先に終わったほう」を採用する道具は Promise.race。時間切れ用に、ms 後に reject する Promise を作って並べる。', 'const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("タイムアウト")), ms)); return Promise.race([promise, timeout]);'], answer: { code: starter.replace('\nconsole.log("3: 終了");', '\nfunction withTimeout(promise, ms) {\n  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("タイムアウト")), ms));\n  return Promise.race([promise, timeout]);\n}\nasync function main() {\n  try {\n    const user = await withTimeout(fetchUser(1), 300); // 500ms かかるので間に合わない\n    console.log(user.name);\n  } catch (e) {\n    console.log("エラー:", e.message);\n  }\n}\nmain();\n\nconsole.log("3: 終了");'), lang: 'js', mode: 'replace' }, label: 'withTimeout(promise, ms) を作る（Promise.race で、時間切れなら「タイムアウト」で失敗させる）', ok: edited && /function\s+withTimeout|const\s+withTimeout\s*=/.test(s) && /Promise\.race\s*\(/.test(s) && /reject|throw/.test(s) && /withTimeout\s*\(\s*fetchUser/.test(s) },
            ]; },
          }));
          el.append(h('p', { class: 'lead', style: { marginTop: '12px' }, html: '💡 console を見よう：<b>「1 → 3」が先</b>に出て、<b>await の結果は後</b>から届く。これが非同期！' }));
        } },
    ],
  });

  /* ---------- 困りごと → 考え方 → 解決 (+使い分け) ---------- */
  const WHY = {
    'x-js-basics': {
      'const / let とアロー関数': { problem: 'チームのコードに <code>=&gt;</code> がたくさん出てくる。読めないままレビューを通し、<b>バグを見逃した</b>', idea: '昔の書き方を、短く安全に書けるようにした JS の標準。意味が分かれば、読むのも速くなる', answer: '<code>const</code> / <code>let</code> / アロー関数 <code>(x) =&gt; x * 2</code>', when: [['普通の関数', 'function'], ['短い処理・コールバック', 'アロー関数']] },
      'テンプレート・分割代入・スプレッド': { problem: '通知メッセージを <code>+</code> でつないでいて、1か所つなぎ忘れ。画面に「受付番号 undefined を受け付けました」と出た', idea: '「組み立てる・取り出す・広げる」を、1行で書く記法がある', answer: '<code>`${x}`</code> / <code>{a, b} = obj</code> / <code>...arr</code>', when: [['文字を組み立てる', 'テンプレートリテラル'], ['必要な項目だけ取り出す', '分割代入'], ['コピーして一部だけ変える', 'スプレッド']] },
      'map / filter / reduce': { problem: '相談一覧から「未対応だけ」を取り出したい。<code>for</code> 文を毎回書くと長く、<code>&lt;=</code> と <code>&lt;</code> を間違えて<b>1件多く</b>読んで落ちた', idea: '「どう加工するか」だけ関数で渡す。繰り返しは JS におまかせ', answer: '<code>map</code> / <code>filter</code> / <code>reduce</code>', when: [['全部を変換', 'map'], ['条件で絞る', 'filter'], ['1つにまとめる', 'reduce']] },
      'import / export': { problem: '全部を1ファイルに書いて2000行に。別の人が作った同名の <code>format</code> がぶつかり、<b>金額の表示が壊れた</b>', idea: 'ファイルを分ける。見せたいものだけ export して、使う所で import', answer: '<code>export</code> / <code>import</code>', when: [['1ファイル1つの主役', 'export default'], ['複数の部品', '名前付き export']] },
    },
    'x-ts-narrow': {
      'どの型に何が入る？': { problem: 'API から来た値を <code>any</code> で扱った。数字が来たときに <code>toUpperCase()</code> が走り、<b>本番でエラー</b>になった', idea: '分からない値は <b>unknown</b> に入れる。使う前に確かめさせる', answer: '<code>unknown</code>（any の安全版）', when: [['確認せず何でも通す', 'any（避ける）'], ['外から来た値', 'unknown']] },
      '絞り込み（narrowing）': { problem: '検索ボックスの値は、文字（名前検索）か数字（ID 検索）。<code>string | number</code> のままだと、文字用の操作が赤線になる', idea: 'if で確かめた枝の中では、型が1つに決まる', answer: '<code>typeof</code> / <code>in</code> / <code>instanceof</code>', when: [['プリミティブ型の判定', 'typeof'], ['プロパティの有無', 'in'], ['クラスのインスタンス', 'instanceof']] },
      '?. と ??': { problem: 'プロフィール未入力のユーザーで <code>user.address.city</code> が落ち、<b>一覧画面が全員分</b>表示されなくなった', idea: '「ないかも」の所で安全に止める。なければ代わりの値を使う', answer: '<code>?.</code>（オプショナルチェーン）と <code>??</code>', when: [['無いかもしれない参照', '?.'], ['null / undefined のときだけ既定値', '??'], ['0 や "" も既定値にしたい', '||']] },
    },
    'x-ts-utility': {
      'as const：値をそのまま型に': { problem: '権限の配列が <code>string[]</code> になり、存在しない <code>"superadmin"</code> も通ってしまう。画面では「権限なし」になるだけで、<b>原因が分かりにくい</b>', idea: '値そのものを型にする。そこから型を作る', answer: '<code>as const</code> ＋ <code>typeof x[number]</code>', when: [['固定の選択肢リスト', 'as const'], ['実行中に変わる配列', '普通の配列']] },
      'ユーティリティ型': { problem: 'ユーザー更新フォーム用の型を、コピペで作った。ユーザーに項目を足したのに、<b>更新用だけ直し忘れ</b>て、保存されない項目が出た', idea: '元の型を変形して作る。元を直せば、全部に反映される', answer: '<code>Partial</code> / <code>Pick</code> / <code>Omit</code> / <code>Record</code>…', when: [['全項目を省略可', 'Partial'], ['一部だけ使う', 'Pick'], ['一部を除く', 'Omit'], ['キー→値の辞書', 'Record']] },
      '組み合わせ：権限チェック': { problem: '管理画面の権限チェックで <code>"admn"</code> と typo。誰も気づかず、<b>管理者だけ操作できない</b>状態で公開された', idea: '1か所で決めて、型も判定もそこから作る', answer: '<code>as const</code> ＋ <code>Record</code>', when: '値を足したら、型エラーで「対応漏れ」の場所が全部分かる。' },
    },
    'x-ts-naming': {
      '4つの書き方': { problem: 'メンバーによって <code>user_name</code> と <code>userName</code> が混在。検索しても見つからず、<b>同じ処理が2つ</b>できてしまった', idea: '「何の名前か」で、書き方を決めておく', answer: 'camelCase / PascalCase / UPPER_SNAKE / kebab-case', when: [['変数・関数', 'camelCase'], ['クラス・型', 'PascalCase'], ['定数', 'UPPER_SNAKE'], ['ファイル・CSS', 'kebab-case']] },
      '名前をつけよう': { problem: '<code>data</code> や <code>flag</code> では中身が分からず、レビューのたびに「これ何？」と聞かれる。直すのに半日かかった', idea: '名前を見れば役割が分かるようにする（isXxx、動詞で始める）', answer: '<code>isXxx</code> / <code>hasXxx</code> / 動詞で始まる関数名', when: [['真偽値', 'is / has / can'], ['関数', '動詞（get / fetch / create）'], ['配列', '複数形']] },
    },
    'x-async': {
      '待っている間、何が動く？': { problem: '検索の通信を待つ間、画面が固まった。ユーザーが「壊れた？」と連打して、<b>申し込みが二重に</b>送られた', idea: '待つ処理は先に預けておく。その間、ほかの処理を進める', answer: '非同期（イベントループ）', when: [['すぐ終わる計算', '同期でOK'], ['通信・タイマー・ファイル', '非同期']] },
      'Promise の 3 つの状態': { problem: '「予約 → 支払い → 通知」を順に呼ぶコードが、コールバックの入れ子になった。1か所の失敗処理を書き忘れ、<b>支払い失敗に気づけなかった</b>', idea: '結果の引換券（Promise）をもらう。結果が出たら続きを実行する', answer: '<code>Promise</code> / <code>async</code> / <code>await</code>', when: [['成功時の続き', '.then / await'], ['失敗時の処理', '.catch / try-catch']] },
    },
  };

  const F = (items, loop) => ({ k: 'flow', items, loop });
  const C = (text, o = {}) => Object.assign({ k: 'code', lang: 'ts', text }, o);
  const ST = (items) => ({ k: 'stack', items });
  const CH = (items) => ({ k: 'chips', items });
  const BG = (i, t) => ({ k: 'big', i, t });
  const T = (file, text, o = {}) => Object.assign({ k: 'code', lang: 'ts', file, text }, o);
  const MINI = {
    'x-js-basics': {
      'const / let とアロー関数': { problem: '<code>=&gt;</code> が読めず、レビューで見逃した', idea: '<code>function</code> をもっと短く書ける', answer: '<code>(n) =&gt; n * 2</code>',
        pv: T('app.js', 'fees.map(f => f * 1.1)\n// => って何？', { lang: 'js', err: [1], keys: { 1: 'arw' } }),
        iv: T('app.js', 'function (f) { return f * 1.1 }\n//   ↓ 短くする\n(f) => f * 1.1', { lang: 'js', idea: [3], keys: { 3: 'arw' } }),
        av: T('app.js', 'const addTax = (f) => f * 1.1;\naddTax(1000); // 1100', { lang: 'js', ok: [1], keys: { 1: 'arw' } }) },
      'テンプレート・分割代入・スプレッド': { problem: '+ でつなぐ通知文が、つなぎ忘れで undefined', idea: '文は <code>${ }</code> で埋め込む', answer: '`…${x}…` / <code>{ a, b }</code> / <code>...</code>',
        pv: T('app.js', '"受付番号 " + no + " を受け付けました"\nconst name = user.name;\nconst email = user.email;', { lang: 'js', err: [1, 2, 3], keys: { 1: 'tpl' } }),
        iv: T('app.js', '`受付番号 ${no} を受け付けました`\n//        ^^^^^ 値が入る', { lang: 'js', idea: [1], keys: { 1: 'tpl' } }),
        av: T('app.js', 'const msg = `${name}さん`;\nconst { name, email } = user;\nconst u2 = { ...user, email: "new@example.com" };', { lang: 'js', ok: [1, 2, 3], keys: { 1: 'tpl' } }) },
      'map / filter / reduce': { problem: 'for 文の条件ミスで、存在しない1件を読んで落ちた', idea: 'やり方だけ渡す。繰り返しは JS が', answer: '<code>map</code> / <code>filter</code> / <code>reduce</code>',
        pv: T('app.js', 'const todo = [];\nfor (let i = 0; i <= n; i++) {\n  if (list[i].status === "todo")\n    todo.push(list[i]);\n}', { lang: 'js', err: [2], keys: { 2: 'map' } }),
        iv: T('app.js', 'list.filter(c => c.status === "todo")\n// 未対応だけが残る\n// 繰り返しは JS におまかせ', { lang: 'js', idea: [1], keys: { 1: 'map' } }),
        av: T('app.js', 'list.map(c => c.title)       // 題名だけ\nlist.filter(c => c.fee > 0)  // 有料だけ\nlist.reduce((s, c) => s + c.fee, 0) // 売上合計', { lang: 'js', ok: [1, 2, 3], keys: { 1: 'map' } }) },
      'import / export': { problem: '同名の format がぶつかって金額表示が壊れた', idea: '分けて、見せる物だけ export', answer: '<code>export</code> / <code>import</code>',
        pv: T('app.js', 'function format() {}\n// 別の人の format が…\nfunction format() {} // ✖ ぶつかる', { lang: 'js', err: [3], keys: { 3: 'exp' } }),
        iv: T('money.ts', '// money.ts\nexport const formatYen = (n) => `${n}円`;\n// 見せたい物だけ export', { idea: [2], keys: { 2: 'exp' } }),
        av: T('main.ts', '// main.ts\nimport { formatYen } from "./money";', { ok: [2], keys: { 2: 'exp' } }) },
    },
    'x-ts-narrow': {
      'どの型に何が入る？': { problem: '数字が来て toUpperCase が本番で落ちた', idea: '分からない値は <b>unknown</b> に入れる', answer: '確かめてから使う',
        pv: T('v.ts', 'let v: any = getValue();\nv.toUpperCase(); // 数字でも通る', { err: [2], keys: { 1: 'unk' } }),
        iv: T('v.ts', 'let v: unknown = getValue();\nv.toUpperCase(); // ✖ まず確認', { err: [2], idea: [1], keys: { 1: 'unk' } }),
        av: T('v.ts', 'if (typeof v === "string") {\n  v.toUpperCase(); // OK\n}', { ok: [1, 2], keys: { 1: 'unk' } }) },
      '絞り込み（narrowing）': { problem: '<code>string | number</code> だと文字の操作ができない', idea: 'if で確かめた中は、型が1つ', answer: '<code>typeof</code> / <code>in</code> / <code>instanceof</code>',
        pv: T('f.ts', 'function f(x: string | number) {\n  x.toUpperCase(); // ✖ number かも\n}', { err: [2], keys: { 1: 'nar' } }),
        iv: T('f.ts', 'if (typeof x === "string") {\n  // ここでは x: string\n}\n// else 側は x: number', { idea: [1], keys: { 1: 'nar' } }),
        av: T('f.ts', 'if (typeof x === "string") {\n  x.toUpperCase(); // OK\n}', { ok: [2], keys: { 1: 'nar' } }) },
      '?. と ??': { problem: '住所が無いユーザーで一覧が落ちた', idea: '無いかもは安全に止める', answer: '<code>?.</code> と <code>??</code>',
        pv: T('user.ts', 'user.address.city;\n// address が無いと TypeError', { err: [1], keys: { 1: 'opt' } }),
        iv: T('user.ts', 'user.address?.city\n// address が無ければ undefined', { idea: [1], keys: { 1: 'opt' } }),
        av: T('user.ts', 'user.address?.city ?? "未入力"\n// 無ければ "未入力"', { ok: [1], keys: { 1: 'opt' } }) },
    },
    'x-ts-utility': {
      'as const：値をそのまま型に': { problem: '<code>"superadmin"</code> も通ってしまう', idea: '値を固定して、そこから型を作る', answer: '<code>as const</code> ＋ <code>typeof</code>',
        pv: T('roles.ts', 'const roles = ["admin", "user"];\n// 型は string[]\ncanEdit("superadmin"); // 通る', { err: [3], keys: { 1: 'asc' } }),
        iv: T('roles.ts', 'const roles = [\n  "admin", "user"\n] as const;', { idea: [3], keys: { 3: 'asc' } }),
        av: T('roles.ts', 'type Role = typeof roles[number];\n// "admin" | "user"', { ok: [1], keys: { 1: 'asc' } }) },
      'ユーティリティ型': { problem: '更新用の型だけ直し忘れた', idea: '元の型を変形して作る', answer: '<code>Partial</code> / <code>Pick</code> / <code>Omit</code>',
        pv: T('user.ts', 'interface UserUpdate {\n  name?: string; // コピペ\n  email?: string; // 項目を足し忘れる\n}', { err: [1, 2, 3], keys: { 1: 'util' } }),
        iv: T('user.ts', 'type UserUpdate = Partial<User>;\n// 全部 ? にした型を自動で作る', { idea: [1], keys: { 1: 'util' } }),
        av: T('user.ts', 'Pick<User, "id">   // 一部だけ\nOmit<User, "password"> // 一部除く', { ok: [1, 2], keys: { 1: 'util' } }) },
      '組み合わせ：権限チェック': { problem: '"admn" の typo で管理者が操作できない', idea: '1か所で決めて、型もそこから', answer: '<code>as const</code> ＋ <code>Record</code>',
        pv: T('auth.ts', 'if (role === "admn") {} // typo\n// 文字列があちこちに', { err: [1], keys: { 1: 'perm' } }),
        iv: T('auth.ts', 'const PERM: Record<\n  Role, boolean\n> = { admin: true, … };', { idea: [1, 2], keys: { 1: 'perm' } }),
        av: T('auth.ts', 'PERM["admn"];\n// ✖ \'admn\' は Role にない', { err: [1], keys: { 1: 'perm' } }) },
    },
    'x-ts-naming': {
      '4つの書き方': { problem: 'user_name と userName が混在して二重実装', idea: '「何の名前か」で書き方を決める', answer: 'camel / Pascal / UPPER_SNAKE / kebab',
        pv: T('app.ts', 'let user_name; let UserName;\nlet username; // どれが正解？', { err: [1, 2], keys: { 1: 'case' } }),
        iv: T('rules.ts', 'userName   // 変数・関数\nUserCard   // クラス・型\nMAX_COUNT  // 定数\nuser-card  // ファイル', { idea: [1, 2, 3, 4], keys: { 1: 'case' } }),
        av: T('app.ts', 'let userName;\nclass UserCard {}\nconst MAX_COUNT = 5;', { ok: [1, 2, 3], keys: { 1: 'case' } }) },
      '名前をつけよう': { problem: 'data / flag で中身が分からない', idea: '名前で役割が分かるようにする', answer: '<code>isXxx</code> / 動詞 / 複数形',
        pv: T('app.ts', 'const d = get();\nconst flag = true; // 何の flag？', { err: [1, 2], keys: { 1: 'name' } }),
        iv: T('rules.ts', 'isLoggedIn   // 真偽値は is / has\nfetchUsers() // 関数は動詞\nusers        // 配列は複数形', { idea: [1], keys: { 1: 'name' } }),
        av: T('app.ts', 'const users = fetchUsers();\nconst isLoggedIn = true;', { ok: [1, 2], keys: { 1: 'name' } }) },
    },
    'x-async': {
      '待っている間、何が動く？': { problem: '通信中に画面が固まって二重送信', idea: '待つ処理は預けて、先へ進む', answer: '非同期（イベントループ）',
        pv: T('app.js', 'const res = syncFetch(url);\n// ↑ 終わるまで画面が固まる', { lang: 'js', err: [1], keys: { 1: 'async' } }),
        iv: T('app.js', 'console.log("A");\nsetTimeout(() => log("B"), 0);\nconsole.log("D");', { lang: 'js', idea: [2], keys: { 2: 'async' } }),
        av: T('app.js', '// 実行順: A → D → B\n// 待つ間も D が動く', { lang: 'js', ok: [1], keys: { 1: 'async' } }) },
      'Promise の 3 つの状態': { problem: '予約→支払い→通知が入れ子で、失敗に気づけない', idea: '結果の引換券（Promise）をもらう', answer: '<code>async</code> / <code>await</code>',
        pv: T('app.js', 'reserve(id, (r) => {\n  pay(r, (p) => { notify(p); });\n});', { lang: 'js', err: [1, 2], keys: { 1: 'prom' } }),
        iv: T('app.js', 'const r = reserve(id);\n// r = 引換券（Promise）\n// pending → fulfilled / rejected', { lang: 'js', idea: [1], keys: { 1: 'prom' } }),
        av: T('app.js', 'const r = await reserve(id);\nconst p = await pay(r);\nawait notify(p);', { lang: 'js', ok: [1, 2], keys: { 1: 'prom' } }) },
    },
  };
  const REF = {"x-ts-utility": {"ユーティリティ型": {"ref": [{"title": "早見表", "icon": "table", "html": "<table class=\"tsx-tbl\" style=\"width:100%;border-collapse:collapse\"><tr><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">型</th><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">できること</th></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>Partial&lt;T&gt;</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">全項目を省略可にする</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>Required&lt;T&gt;</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">全項目を必須にする</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>Readonly&lt;T&gt;</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">全項目を書き換え禁止に</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>Pick&lt;T, K&gt;</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">一部の項目だけ取り出す</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>Omit&lt;T, K&gt;</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">一部の項目を除く</td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>Record&lt;K, V&gt;</code></td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">キー → 値の辞書</td></tr></table>"}]}}, "x-ts-naming": {"4つの書き方": {"ref": [{"title": "命名の早見表", "icon": "table", "html": "<table class=\"tsx-tbl\" style=\"width:100%;border-collapse:collapse\"><tr><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">対象</th><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">書き方</th><th style=\"text-align:left;padding:.4em .6em;color:var(--mute);font-size:.75rem\">例</th></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">変数・関数</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">camelCase</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>userName</code></td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">クラス・型</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">PascalCase</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>UserCard</code></td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">定数</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">UPPER_SNAKE</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>MAX_COUNT</code></td></tr><tr><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">ファイル・CSS</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\">kebab-case</td><td style=\"padding:.45em .6em;border-top:1px solid var(--line)\"><code>user-card.css</code></td></tr></table>"}]}}, "x-async": {"Promise の 3 つの状態": {"hint": "<b>書き方の対応</b><br><code>promise.then(f)</code> ＝ 成功したら f を実行<br><code>await promise</code> ＝ 終わるまで待って、結果を受け取る（<code>async</code> 関数の中だけ）<br><code>try / catch</code> ＝ 失敗したときの受け皿"}}, "x-ts-narrow": {"絞り込み（narrowing）": {"hint": "<b>絞り込みの道具</b>：<code>typeof x === \"string\"</code>（基本の型）／<code>\"a\" in obj</code>（項目の有無）／<code>x instanceof Date</code>（クラス）。if の<b>中だけ</b>型が絞られます。"}}};
  Object.entries(REF).forEach(([id, m]) => { const L = K.lessons[id]; if (!L) return; L.scenes.forEach((sc) => { if (m[sc.t]) Object.assign(sc, m[sc.t]); }); });
  const HINT = {"x-ts-narrow": {"実践：null を安全に扱う": {"hint": "<b>ヒント</b>：<code>if (x === null) return \"なし\";</code> を先に書くと、そのあとの <code>x</code> は <code>string | number</code> に絞られます。<code>toString()</code> が使えるようになります。"}}, "x-ts-utility": {"実践：演習問題": {"hint": "<b>ヒント</b>：<code>as const</code> は配列の<b>後ろ</b>に付けます。<code>Pick&lt;Product, \"price\" | \"stock\"&gt;</code> は「price と stock だけ取り出す」型。<br><b>おまけ</b>：<code>setColor(\"pink\")</code> を書くと赤線が出ることも確かめよう。"}}, "x-async": {"実践：順番を読み解く": {"hint": "<b>ヒント</b>：<code>async function main() { try { … } catch (e) { … } }</code> の形。最後に <code>main();</code> を呼ぶのを忘れずに。<code>await</code> の続きは、同期のコード（「3: 終了」）より<b>あとに</b>動きます。"}}};
  Object.entries(HINT).forEach(([id, m]) => { const L = K.lessons[id]; if (!L) return; L.scenes.forEach((sc) => { if (m[sc.t]) Object.assign(sc, m[sc.t]); }); });
  Object.entries(WHY).forEach(([id, m]) => { const L = K.lessons[id]; if (!L) return; L.scenes.forEach((sc) => { if (m[sc.t]) sc.why = Object.assign({}, m[sc.t], (MINI[id] || {})[sc.t] || {}); }); });
})();
