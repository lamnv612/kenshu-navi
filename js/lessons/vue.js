/* Lessons: Vue.js track — vue-intro, vue-env, vue-basics, vue-comp, vue-life, vue-router, vue-test */
(function () {
  'use strict';
  const K = window.KENSHU, { h, code, stepper, playground, quiz, lbl, style, sleep } = K.W;
  const VUE = 'https://unpkg.com/vue@3.4.27/dist/vue.global.prod.js';
  const VROUTER = 'https://unpkg.com/vue-router@4.3.2/dist/vue-router.global.prod.js';
  const C = 'var(--vue)';

  style('vue-l', `
  .v-state{padding:.5em 1em;border-radius:8px;background:var(--card2);border:2px solid var(--sc,var(--vue));text-align:center;min-width:110px;position:relative}
  .v-state small{display:block;font:700 .68rem var(--mono);color:var(--mute)}
  .v-state b{font:900 1.5rem var(--mono);color:var(--sc,var(--vue))}
  .v-state.flash{animation:vflash .6s}
  @keyframes vflash{30%{transform:scale(1.15);box-shadow:0 0 30px var(--sc,var(--vue))}}
  .v-pkt{position:absolute;z-index:6;padding:.1em .7em;border-radius:6px;font:800 .75rem var(--mono);background:var(--pc);color:#06101f;box-shadow:0 6px 18px -4px var(--pc);pointer-events:none;white-space:nowrap}
  .v-host{position:relative}
  .v-col{display:grid;gap:8px;justify-items:center;align-content:start}
  .v-arrow{color:var(--mute);font-size:1.25rem}
  .v-node{padding:.4em .9em;border-radius:8px;border:2px dashed #ccd;background:#fff;color:#222;min-width:120px;text-align:center;transition:.4s}
  .v-node small{display:block;font:700 .62rem var(--mono);color:#889}.v-node b{font:800 1rem var(--mono)}
  .v-node.fresh{border-color:#3c6;background:#eafff0}.v-node.stale{border-color:#f66;background:#fff0f0;animation:shake .4s}
  .v-row{display:flex;gap:10px;align-items:center;justify-content:center;flex-wrap:wrap}
  .v-box{padding:.7em 1.1em;border-radius:8px;border:2px solid var(--bc,var(--vue));background:color-mix(in srgb,var(--bc,var(--vue)) 14%,var(--card));font-weight:800;text-align:center;transition:.35s;min-width:96px}
  .v-box small{display:block;color:var(--mute);font:600 .66rem var(--mono)}
  .v-box.lit{background:var(--bc,var(--vue));color:#06101f;transform:translateY(-4px) scale(1.06);box-shadow:0 12px 26px -10px var(--bc,var(--vue))}
  .v-box.lit small{color:#06101fcc}
  .v-term{background:var(--code);color:#cfd5ff;font:.875rem/1.75 var(--mono);border-radius:8px;padding:14px 16px;min-height:250px;border:1px solid var(--line)}
  .v-term div{animation:capin .35s both;white-space:pre-wrap}.v-term .p{color:var(--vue)}.v-term .o{color:#6d779f}.v-term .g{color:#9be58b}.v-term .y{color:#ffd37a}
  .v-bar{height:8px;border-radius:6px;background:rgba(255,255,255,.1);overflow:hidden;margin-top:6px}.v-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,var(--vue),var(--ts));transition:width 1.4s}
  .v-tree{font:.875rem/1.9 var(--mono)}
  .v-tree .it{all:unset;display:flex;align-items:center;gap:.5em;cursor:pointer;padding:0 .6em;border-radius:8px;width:calc(100% - 1.2em);transition:.2s}
  .v-tree .it:hover{background:var(--card2)}.v-tree .it.on{background:color-mix(in srgb,var(--vue) 25%,transparent);outline:1px solid var(--vue)}
  .v-tree .it.glow{animation:vflash .8s;background:color-mix(in srgb,var(--ts) 35%,transparent)}
  .v-info{min-height:230px;display:grid;gap:8px;align-content:start}
  .v-info h3{font-size:1.5rem}.v-badge{display:inline-block;padding:.1em .8em;border-radius:6px;font-weight:800;font-size:.75rem;background:var(--bg2);border:1px solid var(--line)}
  .v-insp{font:.75rem/1.7 var(--mono);background:var(--code);color:#cfd5ff;border-radius:8px;padding:10px 14px;min-height:140px}
  .v-insp .t{color:#ff8f7a}.v-insp .c{color:#6d779f}.v-insp .a{color:#ffd37a}.v-insp div{animation:capin .4s both;padding-left:var(--d,0)}
  .v-insp .gone{opacity:.35;text-decoration:line-through}
  .v-tl{display:grid;gap:12px}
  .v-ph{display:grid;grid-template-columns:70px 1fr;gap:10px;align-items:center}.v-ph>span{font-weight:900;color:var(--mute);font-size:.875rem}
  .v-log{font:.75rem/1.7 var(--mono);background:var(--code);color:#cfd5ff;border-radius:8px;padding:10px 14px;min-height:150px;max-height:200px;overflow:auto}
  .v-log div{animation:capin .3s both}.v-log .k{color:var(--vue)}.v-log .w{color:var(--team)}
  .v-meter{display:grid;grid-template-columns:90px 1fr 44px;gap:8px;align-items:center;font-weight:800;font-size:.875rem}
  .v-meter .tr{height:16px;border-radius:6px;background:var(--bg2);overflow:hidden}.v-meter .tr i{display:block;height:100%;background:var(--mc);width:0;transition:width .4s}
  .v-brow{border-radius:8px;overflow:hidden;background:#fff;color:#222;border:1px solid var(--line);box-shadow:var(--shadow)}
  .v-brow .bar{display:flex;gap:6px;align-items:center;padding:8px 12px;background:#eceef6}
  .v-brow .bar i{width:10px;height:10px;border-radius:50%;background:#ff5f57}.v-brow .bar i:nth-child(2){background:#febc2e}.v-brow .bar i:nth-child(3){background:#28c840}
  .v-brow .url{flex:1;margin-left:8px;background:#fff;border-radius:6px;padding:1px 12px;font:.75rem var(--mono);color:#555;min-height:1.6em}
  .v-brow nav{display:flex;gap:6px;padding:10px 12px;border-bottom:1px solid #e3e6f2;flex-wrap:wrap}
  .v-brow nav button{all:unset;cursor:pointer;padding:.25em .9em;border-radius:6px;font-weight:800;font-size:.875rem;background:#eef;color:#445;transition:.2s}
  .v-brow nav button:hover{background:#dde4ff}.v-brow nav button.on{background:#5b9dff;color:#fff}
  .v-brow .view{position:relative;min-height:140px;padding:16px;margin:10px;border:2px dashed #2fd4a4;border-radius:8px}
  .v-brow .view::before{content:"<RouterView />";position:absolute;top:-.75em;left:10px;background:#fff;padding:0 .5em;font:700 .68rem var(--mono);color:#2fd4a4}
  .v-brow .view h2{font-size:1.5rem}
  .v-brow .rl{font-size:.75rem;color:#889;padding:0 12px 10px}
  .v-gate{display:grid;grid-template-columns:1fr 40px 1fr 40px 1fr;gap:6px;align-items:center;text-align:center}
  .v-gate .arrow{color:var(--mute);font-size:1.5rem}
  .v-sw{all:unset;cursor:pointer;display:inline-flex;gap:.5em;align-items:center;padding:.3em .9em;border-radius:6px;border:2px solid var(--line);font-weight:800}
  .v-sw.on{border-color:var(--ok);color:var(--ok)}
  .v-todo{display:grid;gap:6px}.v-todo button{all:unset;cursor:pointer;padding:.5em .9em;border-radius:6px;background:var(--card2);border:1px solid var(--line);font-weight:700;transition:.25s}
  .v-todo button.done{background:color-mix(in srgb,var(--ok) 22%,transparent);text-decoration:line-through;color:var(--mute);transform:translateX(8px)}
  .v-stl{display:grid;gap:6px;align-content:center}.v-st{display:flex;gap:10px;align-items:center;padding:.4em .7em;border-radius:8px;font-weight:700;font-size:.875rem;color:var(--mute);border:1px solid transparent;transition:.3s}.v-st .n{width:22px;height:22px;border-radius:6px;display:grid;place-items:center;font-size:.75rem;background:var(--bg2);border:1px solid var(--line)}.v-st.done{color:var(--text)}.v-st.done .n{background:var(--ok);border-color:var(--ok);color:#052e16}.v-st.cur{color:var(--text);background:color-mix(in srgb,var(--vue) 18%,transparent);border-color:var(--vue)}.v-st.cur .n{background:var(--vue);border-color:var(--vue);color:#06101f}
  .v-in{font:inherit;padding:.5em .8em;border-radius:6px;border:1px solid var(--line);background:var(--bg2);color:var(--text);outline:none;width:100%}
  .v-in:focus{border-color:var(--vue)}
  .v-test{display:grid;gap:6px}
  .v-res{padding:.6em 1em;border-radius:8px;font:700 .875rem var(--mono);background:var(--code);color:#cfd5ff;min-height:84px}
  .v-res .ok{color:var(--ok)}.v-res .ng{color:var(--bad)}
  `);

  style('vref', ".vref{width:100%;border-collapse:collapse;font-size:.875rem}.vref th,.vref td{padding:.5em .7em;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}.vref th{color:var(--mute);font-size:.75rem;font-weight:800;letter-spacing:.06em}.vref td:first-child{font-weight:800;white-space:nowrap}.vref code{font-family:var(--mono);font-size:.85em;background:var(--card2);padding:.05em .35em;border-radius:5px}");

  /* ---------- helpers ---------- */
  const sbox = (name, val, color) => {
    const v = h('b', val);
    const e = h('div', { class: 'v-state', style: color ? { '--sc': color } : null }, h('small', name), v);
    e.set = (x, quiet) => { v.textContent = x; if (!quiet) { e.classList.remove('flash'); void e.offsetWidth; e.classList.add('flash'); } };
    return e;
  };
  async function fly(host, a, b, text, color = 'var(--ts)', ms = 700) {
    if (!host.isConnected) return;
    const H = host.getBoundingClientRect(), A = a.getBoundingClientRect(), B = b.getBoundingClientRect();
    const p = h('div', { class: 'v-pkt', style: { '--pc': color } }, text);
    host.append(p);
    if (!p.animate) { p.remove(); return; }
    const ax = A.left - H.left + A.width / 2, ay = A.top - H.top + A.height / 2;
    const dx = B.left - H.left + B.width / 2 - ax, dy = B.top - H.top + B.height / 2 - ay;
    p.style.left = ax + 'px'; p.style.top = ay + 'px';
    const tr = (k) => `translate(calc(-50% + ${dx * k}px),calc(-50% + ${dy * k}px))`;
    try {
      await p.animate([{ transform: tr(0) + ' scale(.5)', opacity: 0 }, { transform: tr(0) + ' scale(1)', opacity: 1, offset: .15 }, { transform: tr(1) + ' scale(1)', opacity: 1, offset: .85 }, { transform: tr(1) + ' scale(.5)', opacity: 0 }], { duration: ms, easing: 'ease-in-out', fill: 'forwards' }).finished;
    } catch (e) { /* cancelled */ }
    p.remove();
  }
  const vbox = (label, sub, color) => h('div', { class: 'v-box', style: { '--bc': color || C } }, label, sub ? h('small', sub) : null);
  const demo = (title, html, js, tasks) => playground({ title, mode: 'web', libs: [VUE], files: [{ name: 'index.html', lang: 'html', code: html }, { name: 'main.js', lang: 'js', code: js }], tasks });
  const pickQuiz = (el, title, qs) => el.append(h('div', { class: 'card', style: { marginTop: '16px' } }, lbl(title || '使い分けクイズ'), h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '18px 22px' } }, qs.map(([q, opts, ans, why]) => quiz({ q, options: opts, answer: ans, why })))));

  /* ---------- practice kit: missions tick from real behaviour, hints + answers per mission ---------- */
  const pLang = (n) => (n.endsWith('.html') ? 'html' : 'js');
  const applySteps = (starter, steps, upto) => {
    const f = Object.assign({}, starter);
    steps.slice(0, upto + 1).forEach((s) => { (s.edits || []).forEach(([a, b]) => { if (!f[s.file].includes(a)) throw new Error('practice step: text not found'); f[s.file] = f[s.file].replace(a, b); }); });
    return f;
  };
  function makeProbe(run, libs) {
    let last = null, res = {}, token = 0, alive = true, hid = null;
    const docFor = (v) => '<!doctype html><html><head><meta charset="utf-8">' + libs.map((u) => '<script src="' + u + '"><\/script>').join('') + '<script>window.__logs=[];console.log=function(){window.__logs.push([].slice.call(arguments).join(" "))};<\/script></head><body>' + (v['index.html'] || '') + '<script>' + (v['main.js'] || '') + '<\/script></body></html>';
    return {
      get res() { return res; },
      stop() { alive = false; token++; if (hid) hid.remove(); },
      kick(v, ifr) {
        const key = JSON.stringify(v); if (key === last) return; last = key; const my = ++token;
        setTimeout(async () => {
          if (!alive || my !== token) return;
          if (hid) hid.remove();
          const f = document.createElement('iframe');
          f.setAttribute('sandbox', 'allow-scripts allow-same-origin'); f.setAttribute('aria-hidden', 'true'); f.tabIndex = -1;
          f.style.cssText = 'position:fixed;left:-9999px;top:0;width:600px;height:400px;opacity:0;pointer-events:none;border:0';
          document.body.append(f); hid = f;
          await new Promise((r) => { f.onload = r; f.srcdoc = docFor(v); setTimeout(r, 6000); });
          let out = {};
          try { await sleep(200); out = (await run(f.contentWindow, f.contentDocument)) || {}; } catch (e) { out = {}; }
          if (hid === f) { f.remove(); hid = null; }
          if (!alive || my !== token) return;
          if (JSON.stringify(out) !== JSON.stringify(res)) { res = out; ifr.dispatchEvent(new Event('load')); }
        }, 600);
      },
    };
  }
  function practice(el, ctx, cfg) {
    const libs = cfg.libs || [VUE];
    const files = Object.keys(cfg.starter).map((n) => ({ name: n, lang: pLang(n), code: cfg.starter[n] }));
    const req = cfg.steps.filter((s) => !s.optional);
    const solution = applySteps(cfg.starter, req, req.length - 1);
    const probe = cfg.probe ? makeProbe(cfg.probe, libs) : null;
    if (probe) ctx.cleanups.push(() => probe.stop());
    el.append(playground({
      title: cfg.title || 'Vue', mode: 'web', libs, files, solution,
      tasks: (v, c) => {
        const d = c.doc && c.doc();
        const ifr = d && d.defaultView && d.defaultView.frameElement;
        if (probe && ifr) probe.kick(v, ifr);
        const R = probe ? probe.res : {};
        return cfg.steps.map((s, i) => ({ label: s.label, ok: !!s.ok(R, d, v), optional: !!s.optional, hint: s.hint, answer: { code: applySteps(cfg.starter, cfg.steps, i)[s.file], lang: pLang(s.file), mode: 'replace' } }));
      },
    }));
  }
  K.vueTools = { practice, makeProbe, applySteps, VUE };

  const tryIt = (el, title, html, js) => { el.append(h('div', { style: { marginTop: '18px' } }, lbl('✍️ 試してみよう（編集OK）'), demo(title, html, js))); };

  /* ================= vue-intro ================= */
  K.reg({
    id: 'vue-intro', track: 'vue', title: 'Vue.js 紹介', sub: 'なぜVue？', emoji: '💚',
    scenes: [
      {
        t: 'データを変えるだけ', why: {"pv": {"k": "code", "file": "main.js", "lang": "ts", "text": "count = 5\nel.textContent = count\nbadge.textContent = count // ✗", "err": [3], "keys": {"1": "data"}}, "iv": {"k": "code", "file": "App.vue", "lang": "html", "text": "<p>{{ count }}</p>\n<span>{{ count }}</span>\n<!-- 置くだけ。更新は書かない -->", "idea": [1, 2], "keys": {"1": "data"}}, "av": {"k": "code", "file": "App.vue", "lang": "ts", "text": "count.value = 5\n// 画面は Vue が全部直す", "ok": [1], "keys": {"1": "data"}}, "problem": "値が変わるたび、画面を手で直す", "idea": "<b>データ → 画面</b>のルールだけ書く", "answer": "データを変えるだけ。画面は Vue が直す", "when": [["画面が少し・1回きり", "素の JS でも十分"], ["状態が増える・変わり続ける", "Vue などのフレームワーク"]]}, tag: '自動で更新', lead: '左は<b>手で</b>画面を書き換える例、右は<b>Vue</b>。「次へ」で count を 5 に変えると、どうなるか見よう。',
        render(el) {
          const mk = (title) => {
            const st = sbox('count', 0, title.startsWith('❌') ? 'var(--bad)' : C);
            const defs = [['カウンター', (n) => n], ['バッジ', (n) => (n >= 5 ? '🔥 HOT' : 'cool')], ['バー', (n) => '█'.repeat(n) || '-']];
            const pieces = defs.map(([l, f]) => { const b = h('b', f(0)); const d = h('div', { class: 'v-node fresh' }, h('small', l), b); d.f = f; d.b = b; return d; });
            return { st, pieces, box: h('div', { class: 'card v-col' }, h('div', { class: 'label', style: { width: '100%' } }, title), st, h('div', { class: 'v-arrow' }, '⬇'), pieces) };
          };
          const L = mk('❌ 手動DOM（命令的）'), R = mk('✅ Vue（宣言的）');
          const cl = code('count = 5\ncounterEl.textContent = count\nbadgeEl.textContent = count >= 5 ? "🔥 HOT" : "cool"\nbarEl.textContent = "█".repeat(count)', 'js', { dim: true, color: 'var(--bad)' });
          const cr = code('count.value = 5\n// <p>{{ count }}</p>\n// ↑ 画面の更新コードは書かない！', 'js', { dim: true, color: C });
          const setP = (S, n, v, cls, flash) => S.pieces.forEach((p) => { p.b.textContent = p.f(v); p.className = 'v-node ' + cls; });
          el.append(stepper({
            color: C, interval: 2400,
            steps: [
              { say: 'どちらも <b>count = 0</b>。画面も 0。' },
              { say: 'データを <b>5</b> に変更！ …画面はまだ古いまま。' },
              { say: 'Vue は<b>自動で</b>画面を更新。手動側は取り残されて 😱' },
              { say: '手動側は<b>1つずつ</b>更新コードが必要。もれたらバグ！' },
            ],
            init(vis) { vis.append(h('div', { class: 'split' }, L.box, R.box), h('div', { class: 'split', style: { marginTop: '12px' } }, cl, cr)); },
            update(n) {
              [L, R].forEach((S) => S.st.set(n >= 1 ? 5 : 0, true));
              [L, R].forEach((S) => S.st.classList.remove('flash'));
              if (n >= 1) { L.st.set(5); R.st.set(5); }
              setP(L, n, n >= 3 ? 5 : 0, n === 0 ? 'fresh' : n === 3 ? 'fresh' : 'stale');
              setP(R, n, n >= 2 ? 5 : 0, n === 0 || n >= 2 ? 'fresh' : 'stale');
              cl.setHi(n === 3 ? [2, 3, 4] : n >= 1 ? [1] : []); cr.setHi(n === 2 ? [2, 3] : n === 1 ? [1] : []);
            },
          }));
        },
      },
      {
        t: 'リアクティブの仕組み', ref: [{"title": "用語メモ", "icon": "book-open", "html": "<table class=\"vref\"><thead><tr><th>用語</th><th>意味</th></tr></thead><tbody><tr><td>リアクティブ</td><td>値が変わると、自動で追いかけて画面も変わること</td></tr><tr><td>track</td><td>「誰がこの値を読んだか」を覚える</td></tr><tr><td>trigger</td><td>変わったら、覚えた人に知らせる</td></tr><tr><td>patch</td><td>変わった所だけ画面を直す</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "main.js", "lang": "ts", "text": "let count = 0\ncount = 1\n// 画面は気づかない", "err": [2, 3], "keys": {"2": "rx"}}, "iv": {"k": "code", "file": "ref の中身", "lang": "ts", "text": "get value() { track(); return v }\nset value(n) { v = n; trigger() }", "idea": [1, 2], "keys": {"2": "rx"}}, "av": {"k": "code", "file": "App.vue", "lang": "ts", "text": "const count = ref(0)\ncount.value++  // 画面も更新", "ok": [1, 2], "keys": {"2": "rx"}}, "problem": "値が変わったこと、画面は知らない", "idea": "<b>読んだ人を記録</b>、変わったら通知", "answer": "ref が見張り、必要な所だけ更新", "when": [["数値・文字・真偽", "ref"], ["オブジェクトをまとめて", "reactive（迷ったら ref）"]]}, tag: 'reactivity', lead: '<b>リアクティブ</b>＝値が変わると、画面も自動で変わること。Vue は「この値を読んだ人」をメモしておき、値が変わったらその人だけに知らせます。',
        render(el) {
          const st = sbox('count', 0), rn = vbox('テンプレート', '{{ count }}', 'var(--ts)'), dom = vbox('画面 DOM', '<p>0</p>', 'var(--basic)');
          const host = h('div', { class: 'v-host card' }, h('div', { class: 'v-row', style: { gap: '60px', padding: '20px 0' } }, st, rn, dom));
          const cd = code('const count = ref(0)\n// テンプレートが count を読む → 使っている人を記録(track)\ncount.value++\n// 変更を通知(trigger)\n// 画面を必要な所だけ更新(patch)', 'js', { dim: true, color: C });
          let v = 0;
          const run = async () => {
            v++; st.set(v);
            await fly(host, st, rn, '🔔 trigger', 'var(--team)');
            rn.classList.add('lit'); await sleep(250);
            await fly(host, rn, dom, '✏️ patch', 'var(--basic)');
            dom.firstChild.textContent = '<p>' + v + '</p>'; dom.classList.add('lit'); setTimeout(() => { rn.classList.remove('lit'); dom.classList.remove('lit'); }, 600);
          };
          el.append(stepper({
            color: C, interval: 2400,
            steps: [
              { say: '<b>ref(0)</b> で「監視される箱」を作る。' },
              { say: '画面を作るとき、テンプレートが count を読む。Vue は「この人 count を使ってる」とメモする（<b>track</b>）' },
              { say: 'ボタンなどで <b>count.value++</b>。箱の中身が変わる。' },
              { say: 'Vue がメモした相手へ<b>通知</b>（trigger）→ 再描画' },
              { say: '変わった所だけ DOM を<b>更新</b>（patch）。これが自動更新の正体！' },
            ],
            init(vis) { vis.append(host, cd); },
            update(n) {
              [st, rn, dom].forEach((x) => x.classList.remove('lit'));
              st.set(n >= 2 ? 1 : 0, true); dom.firstChild.textContent = n >= 4 ? '<p>1</p>' : '<p>0</p>';
              cd.setHi([[1], [2], [3], [4], [5]][n]);
              if (n === 0) st.classList.add('lit');
              if (n === 1) { rn.classList.add('lit'); fly(host, rn, st, '👀 read & track', 'var(--ts)'); }
              if (n === 2) st.set(1);
              if (n === 3) { rn.classList.add('lit'); fly(host, st, rn, '🔔 trigger', 'var(--team)'); }
              if (n === 4) { dom.classList.add('lit'); fly(host, rn, dom, '✏️ patch', 'var(--basic)'); }
            },
          }));
          el.append(h('div', { class: 'row', style: { marginTop: '14px' } }, h('button', { class: 'btn primary', style: { '--c': C }, onclick: run }, '🔁 通しで +1 してみる'), h('span', { style: { color: 'var(--mute)', fontSize: '.875rem' } }, 'track → trigger → patch が飛ぶのを見よう')));
        },
      },
      {
        t: '.vue ファイルの解剖', ref: [{"title": "script setup とは", "icon": "file-code", "html": "<table class=\"vref\"><thead><tr><th>ブロック</th><th>役割</th></tr></thead><tbody><tr><td><code>&lt;template&gt;</code></td><td>画面の形（HTML）</td></tr><tr><td><code>&lt;script setup&gt;</code></td><td>データと動き。書いた変数がそのまま template で使える</td></tr><tr><td><code>&lt;style scoped&gt;</code></td><td>この部品だけに効く CSS</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "フォルダ", "lang": "sh", "text": "card.html  # 形\ncard.js    # 動き\ncard.css   # 見た目", "err": [1, 2, 3], "keys": {"2": "sfc"}}, "iv": {"k": "code", "file": "Card.vue", "lang": "html", "text": "<template> 形 </template>\n<script setup> 動き </script>\n<style scoped> 見た目 </style>", "idea": [1, 2, 3], "keys": {"2": "sfc"}}, "av": {"k": "code", "file": "Card.vue", "lang": "html", "text": "<template>\n  <button>{{ n }}</button>\n</template>\n<script setup>…</script>\n<style scoped>…</style>", "ok": [1, 2, 3, 4, 5], "keys": {"2": "sfc"}}, "problem": "1つ直すのに3ファイルを開く", "idea": "<b>部品1つ = ファイル1つ</b>", "answer": "<b>.vue</b> に形・動き・見た目", "when": [["1部品だけの見た目", "<code>&lt;style scoped&gt;</code>"], ["サイト全体の共通CSS", "通常の CSS ファイル"]]}, tag: 'SFC', lead: '1つの <b>.vue</b> に「形・動き・見た目」をまとめて書く。ボタンにカーソルを乗せて、コードと右の画面の対応を見よう。',
        render(el) {
          const src = '<template>\n  <button class="btn" @click="count++">\n    {{ count }} 回\n  </button>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst count = ref(0)\n</script>\n\n<style scoped>\n.btn { color: hotpink; }\n</style>';
          const pre = code(src, 'vue', { dim: true, file: 'Counter.vue', color: C });
          let n = 0;
          const btn = h('button', { style: { font: '800 1.1rem var(--font)', padding: '.6em 1.4em', borderRadius: '8px', border: '2px solid #ccd', background: '#fff', color: '#333', cursor: 'pointer', transition: '.3s' }, onclick: () => { n++; btn.firstChild.textContent = n + ' 回'; show('script'); } }, '0 回');
          const prev = h('div', { style: { background: '#fff', borderRadius: '8px', padding: '34px', textAlign: 'center', border: '1px solid var(--line)', transition: '.3s', flex: '1', display: 'grid', placeItems: 'center', minHeight: '190px' } }, btn);
          const info = h('div', { class: 'st-cap' }, 'ボタンにカーソルを乗せよう');
          const P = { template: [[1, 2, 3, 4, 5], '🧱 <b>template</b>：HTMLで見た目の構造を書く', 'var(--basic)'], script: [[7, 8, 9, 10], '⚙️ <b>script</b>：データ(ref)と処理。クリックで増える！', 'var(--ts)'], style: [[12, 13, 14], '🎨 <b>style</b>：このコンポーネント専用のCSS（scoped）', 'var(--pink)'] };
          function show(k) {
            const [ls, say, c] = k ? P[k] : [[], 'ボタンにカーソルを乗せよう'];
            pre.setHi(ls); info.innerHTML = say;
            prev.style.outline = k === 'template' ? '3px dashed var(--basic)' : 'none';
            btn.style.color = k === 'style' ? 'hotpink' : '#333'; btn.style.borderColor = k === 'style' ? 'hotpink' : '#ccd';
            if (k === 'script') btn.animate([{ transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 250 });
          }
          const chips = h('div', { class: 'row' }, Object.entries(P).map(([k, v]) => h('button', { class: 'btn', style: { '--c': v[2] }, onmouseenter: () => show(k), onfocus: () => show(k), onmouseleave: () => show(null), onclick: () => show(k) }, k)));
          el.append(h('div', { class: 'split' }, pre, h('div', { class: 'col' }, prev, chips)), info);
          el.append(h('div', { class: 'card', style: { marginTop: '16px' } }, quiz({ q: 'ボタンを押したとき、画面の数字を更新するコードは？', options: ['document.querySelector で書き換える', '<code class="i">count.value++</code> だけ（あとはVueが更新）', 'ページをリロードする'], answer: 1, why: 'データを変える → 画面は自動。これが Vue の考え方！' })));
        },
      },
      {
        t: 'Options API と Composition API', ref: [{"title": "書き方の対応表", "icon": "arrow-right-left", "html": "<table class=\"vref\"><thead><tr><th>Options</th><th>Composition</th></tr></thead><tbody><tr><td><code>data()</code></td><td><code>ref</code> / <code>reactive</code></td></tr><tr><td><code>methods</code></td><td>ふつうの関数</td></tr><tr><td><code>computed</code></td><td><code>computed()</code></td></tr><tr><td><code>mounted</code></td><td><code>onMounted()</code></td></tr><tr><td><code>this.count</code></td><td><code>count.value</code></td></tr></tbody></table>"}], tag: '書き方', why: {"pv": {"k": "code", "file": "Counter.vue", "lang": "ts", "text": "data() { return { count: 0 } }\nmethods: { inc() {this.count++} }\ncomputed: { double() { … } }", "err": [1, 2, 3], "keys": {"1": "cnt"}}, "iv": {"k": "code", "file": "Counter.vue", "lang": "ts", "text": "// カウンター機能\nconst count = ref(0)\nconst double = computed(…)\nconst inc = () => count.value++", "idea": [2, 3, 4], "keys": {"2": "cnt"}}, "av": {"k": "code", "file": "Counter.vue", "lang": "ts", "text": "<script setup>\nconst count = ref(0)\nconst inc = () => count.value++\n</script>", "ok": [2, 3], "keys": {"2": "cnt"}}, "problem": "1つの機能が3か所に散らばる", "idea": "<b>機能ごと</b>に1か所へ集める", "answer": "<b>Composition API</b>（script setup）", "when": [["この研修・新規開発", "Composition API"], ["古いコードを読む", "Options API も読めると◎"]]}, lead: '同じ「カウンター + あいさつ」を2通りで書いた例。「次へ」で、<b>1つの機能のコード</b>が光ります。',
        render(el) {
          const opt = code("export default {\n  data() {\n    return { count: 0, name: '' }\n  },\n  computed: {\n    greeting() { return 'Hi ' + this.name }\n  },\n  methods: {\n    inc() { this.count++ }\n  }\n}", 'ts', { dim: true, color: 'var(--team)', file: 'Options API' });
          const com = code("// カウンター機能\nconst count = ref(0)\nconst inc = () => count.value++\n\n// あいさつ機能\nconst name = ref('')\nconst greeting = computed(() => 'Hi ' + name.value)", 'ts', { dim: true, color: C, file: 'Composition API（script setup）' });
          const HI = [[[], []], [[3, 9], [1, 2, 3]], [[3, 6], [5, 6, 7]], [[], [1, 2, 3, 5, 6, 7]]];
          el.append(stepper({
            color: C, interval: 2600,
            steps: [
              { say: '書き方は2通り。<b>Options API</b> は種類別（data・methods…）、<b>Composition API</b> は機能別に書く。' },
              { say: 'カウンターのコードを探すと…Options は data と methods に<b>バラバラ</b>。Composition は3行に<b>まとまる</b>。' },
              { say: 'あいさつ機能も同じ。Options は data と computed に分かれる。機能が増えると、探すのが大変になる。' },
              { say: '機能ごとにまとまっていれば、そのまま <b>useXxx()</b> に切り出して使い回せる。この研修は Composition API を使う。' },
            ],
            init(vis) { vis.append(h('div', { class: 'split' }, opt, com)); },
            update(n) { opt.setHi(HI[n][0]); com.setHi(HI[n][1]); },
          }));
          pickQuiz(el, '使い分けクイズ', [['この研修・これから作る新規コードで使うのは？', ['Composition API（<code>script setup</code>）', 'Options API', 'どちらも使えない'], 0, 'Vue 3 の標準。TypeScript とも相性がよい。'], ['既存の古いコードに <code>data()</code> / <code>methods</code> が出てきた。どうする？', ['読めるようにしておく（Options API も同じ仕組み）', '無視する', '全部書き換えるのが必須'], 0, '仕組みは同じ。読めれば十分。触るときに、少しずつ書き換えればいい。']]);
        },
      },
    ],
  });

  /* ================= vue-env ================= */
  const TREE = [
    { d: 0, n: 'my-vue-project/', k: 'root', i: '📁', t: 'プロジェクト全体', r: 'これが1つのアプリ。VS Code で丸ごと開く。', b: '', s: '' },
    { d: 1, n: 'node_modules/', k: 'nm', i: '📦', t: 'ライブラリ置き場', r: 'npm install で自動生成。数千ファイル！', b: '🚫 触らない', s: '.gitignore に入れて Git に上げない' },
    { d: 1, n: 'public/', k: 'pub', i: '🖼️', t: '公開フォルダ', r: 'ビルドせずそのまま配信される。favicon など。', b: '👀 たまに', s: '/favicon.ico で直接アクセス' },
    { d: 1, n: 'src/', k: 'src', i: '💻', t: '開発のメイン', r: 'コードは全部ここに書く。', b: '✏️ よく編集', s: 'components / views / router / assets' },
    { d: 2, n: 'App.vue', k: 'app', i: '💚', t: 'ルートコンポーネント', r: '全ページの親。ここから部品を並べる。', b: '✏️ よく編集', s: '<template>\n  <nav>…RouterLink…</nav>\n  <RouterView />\n</template>' },
    { d: 2, n: 'main.ts', k: 'main', i: '🚀', t: '起動ファイル', r: 'アプリを作って #app に取り付ける。', b: '👀 たまに', s: "createApp(App)\n  .use(router)\n  .mount('#app')" },
    { d: 1, n: 'index.html', k: 'idx', i: '🌐', t: '入口のHTML', r: '<div id="app"> がVueの取り付け先。', b: '👀 たまに', s: '<div id="app"></div>\n<script type="module"\n  src="/src/main.ts">' },
    { d: 1, n: 'package.json', k: 'pkg', i: '📋', t: '依存とスクリプト', r: '使うライブラリと npm run dev などの定義。', b: '👀 たまに', s: '"scripts": {\n  "dev": "vite",\n  "test:unit": "vitest"\n}' },
    { d: 1, n: 'vite.config.ts', k: 'vite', i: '⚙️', t: 'ビルド設定', r: '開発サーバー(Vite)の設定。プラグインやエイリアス。', b: '👀 たまに', s: 'plugins: [vue()]' },
    { d: 1, n: 'tsconfig.json', k: 'ts', i: '📘', t: 'TypeScript設定', r: '型チェックの厳しさなどを決める。', b: '🚫 ほぼ触らない', s: '"strict": true' },
  ];
  K.reg({
    id: 'vue-env', track: 'vue', title: '環境設定', sub: 'プロジェクト作成と構成', emoji: '🛠️',
    scenes: [
      {
        t: 'プロジェクトを作る', ref: [{"title": "npm コマンド早見", "icon": "terminal", "html": "<table class=\"vref\"><thead><tr><th>コマンド</th><th>やること</th></tr></thead><tbody><tr><td><code>npm install</code></td><td>ライブラリを取ってくる</td></tr><tr><td><code>npm run dev</code></td><td>開発用に起動</td></tr><tr><td><code>npm run build</code></td><td>公開用に作る</td></tr><tr><td><code>npm run test:unit</code></td><td>テストを実行</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "ターミナル", "lang": "sh", "text": "$ npm init -y\n$ npm i vue vite typescript\n$ vim vite.config.ts   # 設定…\n$ vim tsconfig.json    # まだ続く", "err": [2, 3, 4], "keys": {"4": "cli"}}, "iv": {"k": "code", "file": "ターミナル", "lang": "sh", "text": "$ npm create vue@latest\n✔ TypeScript? … Yes\n✔ Router?     … Yes\n✔ Vitest?     … Yes", "idea": [1], "keys": {"1": "cli"}}, "av": {"k": "code", "file": "ターミナル", "lang": "sh", "text": "$ npm create vue@latest\n$ cd app && npm install\n$ npm run dev", "ok": [1, 2, 3], "keys": {"1": "cli"}}, "problem": "設定ファイルだけで1日が終わる", "idea": "質問に答えて<b>ひな形</b>を作る", "answer": "<code>npm create vue@latest</code>", "when": [["学習・個人開発・社内ツール", "create vue（Vite）"], ["SEO や SSR が必要", "Nuxt（補足を参照）"]]}, tag: 'npm create vue', lead: 'コマンド3つでアプリが動く。ターミナルの流れを<b>1ステップずつ</b>再生しよう。',
        render(el) {
          const term = h('div', { class: 'v-term' });
          const prog = h('div', { class: 'v-bar' }, h('i'));
          const L = [
            [['p', '$ npm create vue@latest']],
            [['g', '✔ Project name (target directory): … my-vue-project']],
            [['g', '✔ Use TypeScript? … Yes'], ['g', '✔ Select features: Router (SPA development), Vitest (unit testing)']],
            [['o', 'Scaffolding project in ./my-vue-project ...'], ['g', 'Done.']],
            [['p', '$ cd my-vue-project && npm install'], ['o', 'added 187 packages (node_modules/ ができた)']],
            [['p', '$ npm run dev'], ['y', '  VITE v8  ready in 312 ms'], ['g', '  ➜  Local: http://localhost:5173/']],
          ];
          const side = ['📦 テンプレートの設計図を選ぶ', '✏️ プロジェクト名', '🧩 必要な機能を選ぶ', '🏗️ ファイルが自動生成', '📥 ライブラリを取得', '🚀 開発サーバー起動'];
          const list = side.map((t, i) => h('div', { class: 'v-st' }, h('span', { class: 'n' }, i + 1), t));
          el.append(stepper({
            color: C,
            steps: L.map((_, i) => ({ say: ['プロジェクト作成コマンドを実行。', '名前を決める（フォルダ名になる）。', '<b>TypeScript・Router・Vitest</b> を選ぶ（スペースキーで選択）。この研修で使うもの！', '設計図からファイルが一気に生成される。', '<b>npm install</b>：必要なライブラリを node_modules に取得。', '<b>npm run dev</b>：ブラウザで見られる状態に！'][i] })),
            init(vis) { vis.append(h('div', { class: 'split wide-l' }, term, h('div', { class: 'col' }, h('div', { class: 'card v-stl' }, list), prog))); },
            update(n) {
              term.replaceChildren(...L.slice(0, n + 1).flat().map(([c, t]) => h('div', { class: c }, t)));
              list.forEach((e, i) => { e.classList.toggle('done', i < n); e.classList.toggle('cur', i === n); });
              prog.firstChild.style.width = n >= 4 ? '100%' : '0%';
              if (n < 4) prog.firstChild.style.width = n * 8 + '%';
            },
          }));
        },
      },
      {
        t: 'フォルダ探索', why: {"pv": {"k": "code", "file": "my-app/", "lang": "sh", "text": "├─ node_modules/  # 数万ファイル\n├─ public/\n├─ src/           # どれ？\n└─ package.json", "err": [1], "keys": {"3": "src"}}, "iv": {"k": "code", "file": "役割", "lang": "sh", "text": "src/           ← 自分のコード\npublic/        ← そのまま配信\nnode_modules/  ← 触らない", "idea": [1], "keys": {"1": "src"}}, "av": {"k": "code", "file": "src/", "lang": "sh", "text": "src/\n├─ App.vue\n├─ components/\n└─ main.ts", "ok": [1, 2, 3, 4], "keys": {"1": "src"}}, "problem": "どこを触ればいい？", "idea": "ふだん触るのは <b>src/</b> だけ", "answer": "自分のコードは src/ に書く", "when": [["部品・画面を書く", "src/"], ["favicon など加工しない物", "public/"], ["ライブラリの中身", "触らない"]]}, lead: 'ファイルをクリックすると、役割が分かる。「▶ 起動の流れ」を押すと、動き出す順に光る。',
        render(el) {
          const info = h('div', { class: 'card v-info' });
          const btns = [];
          const show = (t) => {
            btns.forEach((b, i) => b.classList.toggle('on', TREE[i] === t));
            info.replaceChildren(h('h3', t.i + ' ' + t.t), h('div', null, h('span', { class: 'v-badge' }, t.b || '—')), h('p', t.r), t.s ? code(t.s, t.k === 'app' || t.k === 'idx' ? 'html' : 'ts', { color: C }) : null, h('small', { style: { color: 'var(--mute)' } }, t.n));
          };
          const tree = h('div', { class: 'card v-tree' }, TREE.map((t) => { const b = h('button', { class: 'it', style: { paddingLeft: t.d * 1.4 + .6 + 'em' }, onclick: () => show(t) }, t.i, ' ', t.n); btns.push(b); return b; }));
          const flow = async () => { for (const k of ['idx', 'main', 'app']) { const i = TREE.findIndex((t) => t.k === k); btns[i].classList.add('glow'); show(TREE[i]); await sleep(1100); btns[i].classList.remove('glow'); } };
          el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, tree, h('button', { class: 'btn primary', style: { '--c': C }, onclick: flow }, '▶ 起動の流れ（index.html → main.ts → App.vue）')), info));
          show(TREE[3]);
          el.append(h('div', { class: 'card', style: { marginTop: '16px' } }, quiz({ q: 'コンポーネントのコードを書く場所は？', options: ['node_modules/', 'public/', 'src/components/'], answer: 2, why: 'src が開発のメイン。node_modules は触らない！' })));
        },
      },
      {
        t: '開発サーバーとHMR', ref: [{"title": "HMR とリロードの違い", "icon": "refresh-cw", "html": "<table class=\"vref\"><thead><tr><th></th><th>リロード</th><th>HMR</th></tr></thead><tbody><tr><td>範囲</td><td>ページ全部</td><td>変えたファイルだけ</td></tr><tr><td>入力途中の文字</td><td>消える</td><td>残る</td></tr><tr><td>速さ</td><td>遅い</td><td>速い</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "ブラウザ", "lang": "sh", "text": "$ 保存 → 全部読み直し\n// 入力途中の文字が消える\n// count も 0 に戻る", "err": [1, 2, 3], "keys": {"1": "hmr"}}, "iv": {"k": "code", "file": "Vite", "lang": "sh", "text": "App.vue が変わった\n → その部品だけ差し替え\n → 他の状態は残る", "idea": [2], "keys": {"2": "hmr"}}, "av": {"k": "code", "file": "ターミナル", "lang": "sh", "text": "[vite] hmr update /src/App.vue\ncount: 3   ← そのまま", "ok": [1, 2], "keys": {"1": "hmr"}}, "problem": "保存のたび全部リロード", "idea": "変えた所だけ<b>その場で差し替え</b>", "answer": "<b>Vite の HMR</b>", "when": [["開発中", "<code>npm run dev</code>（HMR）"], ["公開用", "<code>npm run build</code>（最適化）"]]}, tag: 'HMR', lead: '<b>npm run dev</b> で起動 → ファイルを保存。リロードしなくても、画面が変わるよ。',
        render(el) {
          const log = h('div', { class: 'v-term', style: { minHeight: '150px' } });
          const pageTxt = h('h2', { style: { color: '#222' } }, 'Hello Vue 👋');
          const pg = h('div', { class: 'v-brow' }, h('div', { class: 'bar' }, h('i'), h('i'), h('i'), h('span', { class: 'url' }, 'localhost:5173')), h('div', { style: { padding: '28px', minHeight: '110px', textAlign: 'center', color: '#999' } }, pageTxt));
          pageTxt.style.display = 'none'; const wait = h('div', { style: { color: '#999' } }, '（サーバー停止中）'); pg.lastChild.append(wait);
          let up = false, v = 0, busy = false;
          const say = (c, t) => { log.append(h('div', { class: c }, t)); log.scrollTop = 1e5; };
          const start = h('button', { class: 'btn primary', style: { '--c': C }, onclick: async () => {
            if (up || busy) return; busy = true; start.disabled = true; say('p', '$ npm run dev'); await sleep(500); say('y', '  VITE ready in 312 ms'); await sleep(400); say('g', '  ➜ Local: http://localhost:5173/');
            wait.remove(); pageTxt.style.display = ''; pg.animate && pg.animate([{ transform: 'scale(.96)', opacity: .4 }, { transform: 'none', opacity: 1 }], { duration: 400 }); up = true; edit.disabled = false; busy = false;
          } }, '▶ npm run dev');
          const edit = h('button', { class: 'btn', disabled: true, onclick: async () => {
            v++; say('o', '✏️  App.vue を編集して保存 (⌘S)'); await sleep(350);
            pageTxt.textContent = ['Hello Vue 👋', 'Hello Vue 🚀', 'Hello Vue 🎉', 'Hello Vue 💚'][v % 4];
            pageTxt.animate && pageTxt.animate([{ transform: 'scale(1.3)', color: '#2fd4a4' }, { transform: 'none', color: '#222' }], { duration: 500 });
            say('g', '[vite] hmr update /src/App.vue  (リロードなし ⚡)');
          } }, '✏️ App.vue を編集して保存');
          el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, h('div', { class: 'row' }, start, edit), log), pg));
          el.append(h('div', { class: 'card', style: { marginTop: '16px' } }, quiz({ q: 'HMR（Hot Module Replacement）の良い点は？', options: ['ページ全体をリロードしないので、入力中の状態も保てる', 'ファイルを保存しなくていい', 'サーバーが不要になる'], answer: 0, why: '変更したモジュールだけ差し替えるので速い！' })));
        },
      },
    ],
  });

  /* ================= vue-basics ================= */
  K.reg({
    id: 'vue-basics', track: 'vue', title: 'Vue 基礎', sub: 'ref・v-if・v-model・イベント', emoji: '⚡',
    scenes: [
      {
        t: 'ref：状態と画面', ref: [{"title": ".value のルール", "icon": "book-open", "html": "<table class=\"vref\"><thead><tr><th>場所</th><th>書き方</th></tr></thead><tbody><tr><td>script</td><td><code>count.value</code></td></tr><tr><td>template</td><td><code>{{ count }}</code>（.value は書かない）</td></tr><tr><td>ref と reactive</td><td>ref = 1つの値 / reactive = オブジェクト</td></tr><tr><td>注意</td><td>template で .value が要らないのは、一番外側の ref だけ</td></tr><tr><td>注意</td><td>reactive は、分割代入（const { a } = state）すると追いかけなくなる</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "App.vue", "lang": "ts", "text": "let count = 0\ncount = 1\n// <p>{{ count }}</p> は 0 のまま", "err": [2, 3], "keys": {"1": "ref"}}, "iv": {"k": "code", "file": "Vue の中", "lang": "ts", "text": "ref(0)  →  { value: 0 }\n// Vue が見張る「箱」", "idea": [1], "keys": {"1": "ref"}}, "av": {"k": "code", "file": "App.vue", "lang": "ts", "text": "const count = ref(0)\ncount.value++\n<!-- template -->\n<p>{{ count }}</p>", "ok": [1, 2, 4], "keys": {"1": "ref"}}, "problem": "普通の変数は画面に伝わらない", "idea": "Vue が見張る<b>箱</b>に入れる", "answer": "<b>ref(0)</b>、script は .value", "when": [["数値・文字・真偽の1つの値", "ref"], ["オブジェクトをまとめて", "reactive でも可（迷ったら ref）"]]}, tag: 'ref', lead: '<b>ref</b> は「画面とつながった変数」。script では <code>.value</code> を付け、template では付けない。',
        render(el) {
          const st = sbox('count', 0), dom = h('div', { class: 'v-node fresh' }, h('small', 'template'), h('b', '0 回'));
          const wrap = h('div', { class: 'v-host card v-row', style: { gap: '70px', padding: '24px' } }, st, dom, h('button', { class: 'btn primary', style: { '--c': C }, onclick: () => { v++; st.set(v); fly(wrap, st, dom, 'v-model', C, 500).then(() => (dom.lastChild.textContent = v + ' 回')); } }, '+1'));
          let v = 0;
          const cd = code('const count = ref(0)\n\nconsole.log(count.value) // script は .value\ncount.value++\n\n<!-- template は自動で取り出す -->\n<p>{{ count }} 回</p>', 'ts', { dim: true, color: C });
          el.append(stepper({
            color: C,
            steps: [{ say: '<b>ref(0)</b> で変数を作る。' }, { say: 'script の中では <b>count.value</b> で読み書き。' }, { say: 'template では <b>{{ count }}</b> と書くだけ（.value 不要）。' }, { say: '<b>+1 を押してみて</b>：値が変わると画面が追従！' }],
            init(vis) { vis.append(h('div', { class: 'split' }, cd, wrap)); },
            update(n) { cd.setHi([[1], [3, 4], [7], [1, 4, 7]][n]); st.classList.toggle('lit', n === 0); },
          }));
          tryIt(el, 'ref', '<div id="app">\n  <p>{{ count }} 回</p>\n  <button @click="count++">+1</button>\n</div>', 'const { createApp, ref } = Vue\ncreateApp({\n  setup() {\n    const count = ref(0)\n    return { count }\n  }\n}).mount("#app")');
          pickQuiz(el, '使い分けクイズ：どれを使う？', [['入力欄の値を画面に出したい。<code>let name = ""</code> と書くと？', ['入力しても画面は変わらない（Vue が見張っていない）', '自動で更新される', 'エラーになる'], 0, '<code>ref</code> にして初めて「画面とつながった」変数になる。'], ['カウンター（数値1つ）に使うのは？', ['<code>ref(0)</code>', '<code>reactive(0)</code>', 'どちらでも同じ'], 0, 'reactive はオブジェクト用。数値などは ref。迷ったら ref。']]);
        },
      },
      {
        t: 'v-if と v-show', ref: [{"title": "v-if と v-show の比較表", "icon": "table", "html": "<table class=\"vref\"><thead><tr><th></th><th>v-if</th><th>v-show</th></tr></thead><tbody><tr><td>DOM</td><td>偽のとき消える</td><td>いつもある（display:none）</td></tr><tr><td>最初の重さ</td><td>軽い</td><td>少し重い</td></tr><tr><td>切り替えの重さ</td><td>重い</td><td>軽い</td></tr><tr><td>v-else</td><td>使える</td><td>使えない</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "DOM", "lang": "html", "text": "v-show → <p style=\"display:none\">\nv-if   → <!--v-if-->\n// 見た目は同じ。中身は別物", "err": [3], "keys": {"2": "show"}}, "iv": {"k": "code", "file": "選び方", "lang": "ts", "text": "切替が多い → v-show（隠すだけ）\n切替が少ない → v-if（作る/消す）", "idea": [1, 2], "keys": {"1": "show"}}, "av": {"k": "code", "file": "App.vue", "lang": "html", "text": "<p v-if=\"user\">ようこそ</p>\n<Modal v-show=\"open\" />", "ok": [1, 2], "keys": {"2": "show"}}, "problem": "消すと隠す、何が違う？", "idea": "<b>切り替える回数</b>で選ぶ", "answer": "v-if は作る・消す、v-show は隠す", "when": [["ほとんど切り替わらない・条件で別物", "v-if"], ["何度も切り替える（タブ・モーダル）", "v-show"], ["v-else で分岐したい", "v-if"]]}, tag: '条件表示', lead: '見た目は同じでも、DOM の中身が<b>違う</b>。右のインスペクタで確かめよう。',
        render(el) {
          const mk = (name) => ({ name, box: h('div', { class: 'v-insp' }), n: 0 });
          const A = mk('v-if'), B = mk('v-show');
          const prev = h('div', { class: 'v-row card', style: { minHeight: '60px' } });
          const pA = h('span', { class: 'chip', style: { '--c': 'var(--ts)' } }, 'v-if: 🙂'), pB = h('span', { class: 'chip', style: { '--c': 'var(--pink)' } }, 'v-show: 🙂');
          prev.append(pA, pB);
          let on = true;
          const draw = () => {
            A.box.replaceChildren(h('div', h('span', { class: 't' }, '<div id="app">')), on ? h('div', { style: { '--d': '1.2em' } }, h('span', { class: 't' }, '<span'), ' ', h('span', { class: 'a' }, 'v-if'), h('span', { class: 't' }, '>🙂</span>')) : h('div', { style: { '--d': '1.2em' }, class: 'c' }, '<!--v-if-->  ← 目印だけ'), h('div', h('span', { class: 't' }, '</div>')), h('div', { class: 'c' }, on ? '要素あり' : '要素そのものが無い'));
            B.box.replaceChildren(h('div', h('span', { class: 't' }, '<div id="app">')), h('div', { style: { '--d': '1.2em' } }, h('span', { class: 't' }, '<span'), ' ', h('span', { class: 'a' }, on ? 'style=""' : 'style="display:none"'), h('span', { class: 't' }, '>🙂</span>')), h('div', h('span', { class: 't' }, '</div>')), h('div', { class: 'c' }, on ? '要素あり' : '要素は在る（隠してるだけ）'));
            pA.style.display = on ? '' : 'none'; pB.style.opacity = on ? 1 : .15;
          };
          const tog = h('button', { class: 'btn primary', style: { '--c': C }, onclick: () => { on = !on; draw(); } }, '🔘 表示 / 非表示 切替');
          const cd = code('<button @click="show = !show">切替</button>\n<p v-if="show">v-if</p>\n<p v-show="show">v-show</p>', 'vue', { color: C, hi: [2, 3] });
          el.append(h('div', { class: 'col' }, h('div', { class: 'row' }, tog, h('span', { style: { color: 'var(--mute)', fontSize: '.875rem' } }, '↓ DOMインスペクタ')), h('div', { class: 'split' }, h('div', null, lbl('v-if'), A.box), h('div', null, lbl('v-show'), B.box)), prev, h('div', { class: 'split' }, h('div', null, cd), h('div', { class: 'st-cap', html: '<b>v-if</b>：条件が偽だと DOM から<b>消える</b>（切替コスト大 / 初期コスト小）<br><b>v-show</b>：CSS の display で<b>隠すだけ</b>（頻繁な切替向き）' }))));
          draw();
          tryIt(el, 'v-if / v-show', '<div id="app">\n  <button @click="show = !show">切替</button>\n  <p v-if="show">v-if: 🙂</p>\n  <p v-show="show">v-show: 🙂</p>\n</div>', 'Vue.createApp({\n  data: () => ({ show: true })\n}).mount("#app")');
          pickQuiz(el, '使い分けクイズ：v-if？ v-show？', [['タブの切替（何度も行き来する）に向くのは？', ['v-if', 'v-show'], 1, '切替のたびに DOM を作り直さない v-show が軽い。'], ['管理者にだけ管理メニューを出す（ほとんど切り替わらない）。', ['v-if', 'v-show'], 0, '条件に合わないなら、作らないほうが軽くて安全。']]);
        },
      },
      {
        t: 'v-model：双方向', ref: [{"title": "v-model の修飾子", "icon": "wand-sparkles", "html": "<table class=\"vref\"><thead><tr><th>書き方</th><th>意味</th></tr></thead><tbody><tr><td><code>v-model.trim</code></td><td>前後の空白を消す</td></tr><tr><td><code>v-model.number</code></td><td>数値に変える</td></tr><tr><td><code>v-model.lazy</code></td><td>入力が終わってから反映</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "Form.js", "lang": "ts", "text": "input.oninput = (e) => {\n  name = e.target.value\n}\ninput.value = name", "err": [1, 2, 3, 4], "keys": {"1": "model"}}, "iv": {"k": "code", "file": "Form.vue", "lang": "html", "text": ":value=\"name\"   // データ → 画面\n@input=\"name = …\" // 画面 → データ", "idea": [1, 2], "keys": {"1": "model"}}, "av": {"k": "code", "file": "Form.vue", "lang": "html", "text": "<input v-model=\"name\" />\n<p>{{ name }}</p>", "ok": [1], "keys": {"1": "model"}}, "problem": "入力の取り出しと代入を毎回書く", "idea": "往復を<b>1つの書き方</b>にする", "answer": "<b>v-model</b> = :value + @input", "when": [["普通のフォーム入力", "v-model"], ["入力を加工してから保存したい", "<code>:value</code> と <code>@input</code> を分けて書く"]]}, tag: 'v-model', lead: '入力すると、データと画面が変わる。データを変えると、入力欄も変わる。この<b>往復</b>が v-model。',
        render(el) {
          const st = sbox('name', '', 'var(--vue)'), inp = h('input', { class: 'v-in', placeholder: 'ここに入力…' }), view = h('div', { class: 'v-node fresh', style: { minWidth: '160px' } }, h('small', 'template'), h('b', 'こんにちは、さん'));
          const host = h('div', { class: 'v-host card' }, h('div', { class: 'v-row', style: { gap: '34px', padding: '18px 0' } }, h('div', { style: { width: '190px' } }, inp), st, view), h('div', { class: 'row', style: { justifyContent: 'center' } }, h('button', { class: 'btn', onclick: () => { const t = ['Lam', 'Vue', '研修生']; const x = t[Math.floor(Math.random() * 3)]; st.set(x); inp.value = x; fly(host, st, inp, '← 反映', C); view.lastChild.textContent = 'こんにちは、' + x + 'さん'; } }, '🎲 データ側から変更')));
          let last = '';
          inp.addEventListener('input', () => { st.set(inp.value || '""'); view.lastChild.textContent = 'こんにちは、' + inp.value + 'さん'; if (inp.value !== last) fly(host, inp, st, 'input →', 'var(--ts)', 450); last = inp.value; });
          const A = 'v-model="name"', Bc = ':value="name"\n@input="name = $event.target.value"';
          const cd = h('div');
          el.append(stepper({
            color: C,
            steps: [{ say: '<b>v-model</b> 1つで…' }, { say: '実は、<b>:value</b>（データ→画面）と <b>@input</b>（画面→データ）を<b>合体</b>させたもの！' }, { say: '下の入力欄で試そう：打つと <b>→</b>、🎲 ボタンで <b>←</b> が流れる。' }],
            init(vis) { vis.append(cd, host); },
            update(n) { cd.replaceChildren(code(n === 1 ? Bc : A, 'vue', { color: C, file: 'template', hi: n === 1 ? [1, 2] : [1] })); },
          }));
          tryIt(el, 'v-model', '<div id="app">\n  <input v-model="name" placeholder="名前">\n  <p>こんにちは、{{ name }} さん</p>\n</div>', 'Vue.createApp({\n  data: () => ({ name: "" })\n}).mount("#app")');
        },
      },
      {
        t: 'イベント処理 @click', ref: [{"title": "修飾子と引数", "icon": "wand-sparkles", "html": "<table class=\"vref\"><thead><tr><th>書き方</th><th>意味</th></tr></thead><tbody><tr><td><code>@click.prevent</code></td><td>ふだんの動き（送信など）を止める</td></tr><tr><td><code>@click.stop</code></td><td>親へのクリックを伝えない</td></tr><tr><td><code>@click.once</code></td><td>1回だけ動かす</td></tr><tr><td><code>@click=\"f(item)\"</code></td><td>データを渡す</td></tr><tr><td><code>@click=\"f($event)\"</code></td><td>イベント本体を渡す</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "index.html", "lang": "html", "text": "<button onclick=\"\n  count++; render();\n  log(); update()\">+1", "err": [1, 2, 3], "keys": {"1": "click"}}, "iv": {"k": "code", "file": "App.vue", "lang": "html", "text": "<button @click=\"addOne\">\n  +1\n</button>\n// 押したら addOne を呼ぶ", "idea": [1], "keys": {"1": "click"}}, "av": {"k": "code", "file": "App.vue", "lang": "ts", "text": "const addOne = () => {\n  count.value++\n}\n// <button @click=\"addOne\">", "ok": [1, 2, 3], "keys": {"4": "click"}}, "problem": "HTML に処理が混ざって読めない", "idea": "HTML は「押されたら○○」だけ", "answer": "<b>@click=\"関数\"</b>", "when": [["1行で済む", "<code>@click=\"count++\"</code>"], ["処理が複数・使い回しする", "<code>@click=\"関数名\"</code>"], ["引数が必要", "<code>@click=\"f(item)\"</code>"]]}, tag: '@click', lead: 'クリック1回で何が起きる？ <b>ボタンを押して</b>、処理が流れる順に光るのを見よう。',
        render(el) {
          const nodes = [['👆 クリック', '@click', 'var(--ts)'], ['⚙️ ハンドラ', 'addOne()', 'var(--team)'], ['📦 データ', 'count++', C], ['🖼️ 再描画', '{{ count }}', 'var(--basic)']];
          const boxes = nodes.map(([a, b, c]) => vbox(a, b, c));
          const out = h('b', { style: { fontSize: '2rem', fontFamily: 'var(--mono)' } }, '0');
          const host = h('div', { class: 'v-host card' }, h('div', { class: 'v-row', style: { gap: '24px', padding: '24px 0' } }, boxes.flatMap((b, i) => (i ? [h('span', { class: 'v-arrow' }, '➜'), b] : [b])), out));
          let v = 0, busy = false;
          const cd = code('const count = ref(0)\nconst addOne = () => {\n  count.value++\n}\n\n<button @click="addOne">+1</button>\n<p>{{ count }}</p>', 'vue', { dim: true, color: C });
          const lines = [[6], [2, 3], [3], [7]];
          async function play() {
            if (busy) return; busy = true;
            for (let i = 0; i < 4; i++) { boxes.forEach((b, j) => b.classList.toggle('lit', j === i)); cd.setHi(lines[i]); if (i === 2) v++; if (i === 3) { out.textContent = v; out.animate && out.animate([{ transform: 'scale(1.5)' }, { transform: 'none' }], { duration: 350 }); } if (i < 3) fly(host, boxes[i], boxes[i + 1], '▶', nodes[i][2], 450); await sleep(650); }
            boxes.forEach((b) => b.classList.remove('lit')); busy = false;
          }
          el.append(stepper({
            color: C,
            steps: [{ say: '<b>@click</b> でボタンにイベントを登録。' }, { say: 'クリックされたら<b>関数</b>が呼ばれる。' }, { say: '関数の中で<b>データ</b>を変える。' }, { say: 'データが変わった → <b>画面が自動更新</b>。' }],
            init(vis) { vis.append(host, cd); },
            update(n) { boxes.forEach((b, j) => b.classList.toggle('lit', j === n)); cd.setHi(lines[n]); },
          }));
          el.append(h('div', { class: 'row', style: { marginTop: '12px' } }, h('button', { class: 'btn primary', style: { '--c': C }, onclick: play }, '▶ クリックを実行（通し再生）')));
          tryIt(el, '@click', '<div id="app">\n  <button @click="addOne">+1</button>\n  <p>{{ count }}</p>\n</div>', 'Vue.createApp({\n  data: () => ({ count: 0 }),\n  methods: { addOne() { this.count++ } }\n}).mount("#app")');
        },
      },
      {
        t: ':class と v-for', ref: [{"title": ":key の決め方", "icon": "key-round", "html": "<table class=\"vref\"><thead><tr><th></th><th>良い key</th><th>悪い key</th></tr></thead><tbody><tr><td>例</td><td>id など、変わらない一意の値</td><td>index（並び替えでずれる）</td></tr><tr><td>理由</td><td>要素の目印として使われる</td><td>ずれると別の要素と取り違える</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "index.html", "lang": "html", "text": "<li>りんご</li>\n<li>みかん</li>\n<li>ぶどう</li>  <!-- 増えたら? -->", "err": [1, 2, 3], "keys": {"2": "for"}}, "iv": {"k": "code", "file": "App.vue", "lang": "ts", "text": "const todos = ref([\n  { id:1, text:'牛乳', done:true },\n])  // 配列1つ = <li> 1つ", "idea": [1, 2, 3], "keys": {"1": "for"}}, "av": {"k": "code", "file": "App.vue", "lang": "html", "text": "<li v-for=\"t in todos\" :key=\"t.id\"\n    :class=\"{ done: t.done }\">", "ok": [1, 2], "keys": {"1": "for"}}, "problem": "数が変わるたび HTML を書き直す", "idea": "<b>配列</b>から画面を繰り返して作る", "answer": "<b>v-for</b> と <b>:class</b>", "when": [["同じ見た目を並べる", "v-for + <code>:key</code>"], ["状態で色・装飾が変わる", "<code>:class=\"{ 名前: 条件 }\"</code>"]]}, tag: 'リスト', lead: '<b>v-for</b> で配列を並べ、<b>:class</b> で見た目を変える。クリックして、右のデータの変化を見よう。',
        render(el) {
          const items = [{ t: '🍎 りんご', done: false }, { t: '🍊 みかん', done: false }, { t: '🍇 ぶどう', done: true }];
          const json = h('pre', { class: 'code', style: { margin: 0, minHeight: '130px' } });
          const list = h('div', { class: 'v-todo' });
          const draw = () => {
            list.replaceChildren(...items.map((it, i) => h('button', { class: it.done ? 'done' : '', onclick: () => { it.done = !it.done; draw(); } }, it.t)));
            json.replaceChildren(...JSON.stringify(items, null, 1).split('\n').map((l) => h('span', { class: 'ln', html: K.W.hl(l, 'json') })));
            json.animate && json.animate([{ background: '#1a2a4a' }, { background: '' }], { duration: 400 });
          };
          const cd = code('<button\n  v-for="item in items"\n  :key="item.t"\n  :class="{ done: item.done }"\n  @click="item.done = !item.done"\n>\n  {{ item.t }}\n</button>', 'vue', { dim: true, color: C });
          el.append(stepper({
            color: C,
            steps: [{ say: '<b>v-for</b>：配列の数だけ要素を繰り返し作る。' }, { say: '<b>:class</b>：条件が true のときだけクラスを付ける。' }, { say: '<b>押してみて</b>：データ(done)が変わる → 見た目が変わる。' }],
            init(vis) { vis.append(h('div', { class: 'split' }, h('div', { class: 'col' }, cd, list), h('div', null, lbl('items（データ）'), json))); draw(); },
            update(n) { cd.setHi([[2, 3], [4], [5]][n]); },
          }));
          tryIt(el, 'v-for + :class', '<div id="app">\n  <ul>\n    <li v-for="t in todos" :key="t.id"\n        :class="{ done: t.done }"\n        @click="t.done = !t.done">\n      {{ t.text }}\n    </li>\n  </ul>\n</div>\n<style>.done{text-decoration:line-through;color:#999}li{cursor:pointer}</style>', 'Vue.createApp({\n  data: () => ({ todos: [\n    { id: 1, text: "牛乳", done: false },\n    { id: 2, text: "パン", done: true },\n  ] })\n}).mount("#app")');
          pickQuiz(el, 'クイズ：:key はなぜ必要？', [['v-for に <code>:key</code> を付ける理由は？', ['並び替え・削除のとき、Vue が要素を正しく使い回すため', '見た目を変えるため', '付けても意味はない'], 0, '見た目が同じでも、key（その要素だけの ID）で「どれがどれか」を見分ける。']]);
        },
      },
      {
        t: '実践：ミニTodo', tag: 'PRACTICE', lead: "3つのミッションを、上から順に。コードの <b>TODO コメント</b>を書き換えるだけ。困ったら 💡 でヒントが見られる。",
        render(el, ctx) {
          K.vueTools.practice(el, ctx, { title: "Vue", starter: {"index.html": "<div id=\"app\">\n  <!-- ① 入力欄と text をつなぐ（v-model） -->\n  <input placeholder=\"やること\">\n  <!-- ③ ボタンを押したら add を動かす（@click） -->\n  <button>追加</button>\n  <p>入力中：{{ text }}</p>\n  <ul>\n    <!-- ② todos を1件ずつ並べる（v-for） -->\n    <li>（ここを書き換える）</li>\n  </ul>\n</div>", "main.js": "const { createApp, ref } = Vue\n\ncreateApp({\n  setup() {\n    const text = ref('')\n    const todos = ref(['牛乳を買う'])\n    const add = () => {\n      if (!text.value) return\n      todos.value.push(text.value)\n      text.value = ''\n    }\n    return { text, todos, add }\n  },\n}).mount('#app')"}, steps: [
      Object.assign({"file": "index.html", "label": "入力した文字が「入力中：」に出る（v-model）", "hint": ["入力欄と text をつなぐのは <code>v-model</code>。", "<code>&lt;input v-model=\"text\"&gt;</code> と書く。"], "edits": [["<input placeholder=\"やること\">", "<input v-model=\"text\" placeholder=\"やること\">"]]}, { ok: (R) => R.m1 }),
      Object.assign({"file": "index.html", "label": "リストに「牛乳を買う」が出る（v-for）", "hint": ["リストを並べるのは <code>v-for</code>。<code>&lt;li&gt;</code> に書く。", "<code>&lt;li v-for=\"t in todos\" :key=\"t\"&gt;{{ t }}&lt;/li&gt;</code>"], "edits": [["<li>（ここを書き換える）</li>", "<li v-for=\"t in todos\" :key=\"t\">{{ t }}</li>"]]}, { ok: (R) => R.m2 }),
      Object.assign({"file": "index.html", "label": "「追加」を押すと、リストが1つ増える（@click）", "hint": ["クリックは <code>@click</code>。呼ぶ関数は add。", "<code>&lt;button @click=\"add\"&gt;追加&lt;/button&gt;</code>"], "edits": [["<button>追加</button>", "<button @click=\"add\">追加</button>"]]}, { ok: (R) => R.m3 }),
      Object.assign({"file": "index.html", "label": "各 Todo の横に「削除」ボタンを付け、押すとリストから消える", "hint": ["v-for は <code>(t, i) in todos</code> と書くと、番号 i も使える。", "配列から消すのは <code>todos.splice(i, 1)</code>。<code>&lt;li&gt;</code> の中にボタンを置く。"], "edits": [["<li v-for=\"t in todos\" :key=\"t\">{{ t }}</li>", "<li v-for=\"(t, i) in todos\" :key=\"t\">\n      {{ t }}\n      <button @click=\"todos.splice(i, 1)\">削除</button>\n    </li>"]], "optional": true}, { ok: (R) => R.o1 }),
    ], probe: async (win, doc) => {
      const nt = async () => { await win.Vue.nextTick(); await new Promise((r) => setTimeout(r, 40)); };
      const inp = doc.querySelector('input'), btn = doc.querySelector('button'), out = {};
      const lis = () => [...doc.querySelectorAll('li')].map((x) => x.textContent);
      out.m2 = lis().some((t) => t.includes('牛乳'));
      inp.value = 'テスト入力'; inp.dispatchEvent(new win.Event('input', { bubbles: true })); await nt();
      const p = [...doc.querySelectorAll('p')].find((x) => x.textContent.includes('入力中'));
      out.m1 = !!p && p.textContent.includes('テスト入力');
      const n0 = lis().length; btn.click(); await nt();
      out.m3 = lis().length === n0 + 1 && lis().some((t) => t.includes('テスト入力'));
      const del = doc.querySelector('li button');
      if (del) { const n1 = lis().length; del.click(); await nt(); out.o1 = lis().length === n1 - 1; }
      return out;
    } });
        },
      },
    ],
  });

  /* ================= vue-comp ================= */
  K.reg({
    id: 'vue-comp', track: 'vue', title: 'コンポーネント', sub: 'props ↓ / emit ↑', emoji: '🧬',
    scenes: [
      {
        t: 'props：親から子へ', ref: [{"title": "props の型とデフォルト値", "icon": "book-open", "html": "<table class=\"vref\"><thead><tr><th>やりたいこと</th><th>書き方</th></tr></thead><tbody><tr><td>型を付ける</td><td><code>defineProps&lt;{ title: string }&gt;()</code></td></tr><tr><td>なくてもよい</td><td><code>title?: string</code></td></tr><tr><td>初期値</td><td><code>withDefaults(defineProps&lt;…&gt;(), { title: \"無題\" })</code></td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "Page.vue", "lang": "html", "text": "<div class=\"card\">りんご</div>\n<div class=\"card\">みかん</div>\n<div class=\"card\">ぶどう</div>", "err": [1, 2, 3], "keys": {"2": "props"}}, "iv": {"k": "code", "file": "Card.vue", "lang": "ts", "text": "const props = defineProps<{\n  title: string\n}>()\n// {{ props.title }} で使う", "idea": [1, 2, 3], "keys": {"2": "props"}}, "av": {"k": "code", "file": "Page.vue", "lang": "html", "text": "<Card title=\"りんご\" />\n<Card title=\"みかん\" />\n<Card title=\"ぶどう\" />", "ok": [1, 2, 3], "keys": {"2": "props"}}, "problem": "同じ形をコピペ。直すと3か所", "idea": "違う所だけ<b>外から渡す</b>", "answer": "<b>props</b> = 親 → 子（読むだけ）", "when": [["親 → 子へ表示用データ", "props"], ["子 → 親へ知らせたい", "emit（次のシーン）"]]}, tag: 'props ↓', lead: 'データは<b>上から下</b>へ。子は受け取るだけで、書き換えてはいけません。',
        render(el) {
          const pst = sbox('title', 'レポート', 'var(--ts)'), cprop = sbox('props.title', '—', C);
          const P = vbox('👨 親 Parent', '', 'var(--ts)'), Cc = vbox('👶 子 Child', '', C);
          const lock = h('div', { style: { fontSize: '1.5rem', minHeight: '1.6em', textAlign: 'center' } });
          const host = h('div', { class: 'v-host card v-col', style: { gap: '34px' } }, h('div', { class: 'v-row' }, P, pst), h('div', { class: 'v-row' }, Cc, cprop), lock);
          const pc = code('<!-- Parent.vue -->\n<Child :title="title" />\n\nconst title = ref("レポート")', 'vue', { dim: true, color: 'var(--ts)' });
          const cc = code('<!-- Child.vue -->\nconst props = defineProps<{\n  title: string\n}>()\n\n<h3>{{ props.title }}</h3>\n\nprops.title = "x"   // ✖ 書き換え禁止', 'vue', { dim: true, color: C });
          el.append(stepper({
            color: C, interval: 2300,
            steps: [{ say: '親が <b>title</b> というデータを持っている。' }, { say: '<b>:title="title"</b> で子へ渡す（バインド）。' }, { say: '子は <b>defineProps</b> で受け取る。型も指定できる！' }, { say: '子が <b>props.title = "x"</b> と書き換えるのは禁止。親のデータを変えていいのは親だけ。' }],
            init(vis) { vis.append(host, h('div', { class: 'split', style: { marginTop: '12px' } }, pc, cc)); },
            update(n) {
              P.classList.toggle('lit', n <= 1); Cc.classList.toggle('lit', n >= 2);
              cprop.set(n >= 2 ? 'レポート' : '—', true); lock.textContent = n === 3 ? '🚫 props は読み取り専用' : '';
              pc.setHi(n === 0 ? [4] : n === 1 ? [2] : []); cc.setHi(n === 2 ? [2, 3, 4] : n === 3 ? [8] : []); cc.setHi(n === 3 ? [8] : [], 'err');
              if (n === 1) fly(host, pst, cprop, ':title', 'var(--ts)', 800);
              if (n === 3) cprop.animate && cprop.animate([{ transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'none' }], { duration: 350 });
            },
          }));
        },
      },
      {
        t: 'emit：子から親へ', ref: [{"title": "emit の書き方メモ", "icon": "book-open", "html": "<table class=\"vref\"><thead><tr><th>やりたいこと</th><th>書き方</th></tr></thead><tbody><tr><td>宣言</td><td><code>const emit = defineEmits&lt;{ add: [] }&gt;()</code></td></tr><tr><td>値を付けて送る</td><td><code>emit(\"select\", id)</code></td></tr><tr><td>親で受ける</td><td><code>@select=\"onSelect\"</code></td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "Child.vue", "lang": "ts", "text": "// 子が親のデータを直接変更\nprops.count++   // ⚠ 警告\n// 誰が変えたか分からない", "err": [2, 3], "keys": {"2": "emit"}}, "iv": {"k": "code", "file": "Child.vue", "lang": "ts", "text": "const emit = defineEmits(['add'])\nemit('add')   // お願い", "idea": [1, 2], "keys": {"2": "emit"}}, "av": {"k": "code", "file": "Parent.vue", "lang": "html", "text": "<Child @add=\"count++\" />\n// 親だけが count を変える", "ok": [1], "keys": {"1": "emit"}}, "problem": "子が親のデータを勝手に変える", "idea": "変えるのは<b>持ち主だけ</b>。子はお願い", "answer": "<b>emit</b>：子 → 親へ知らせる", "when": [["クリック・入力などの「通知」", "emit"], ["親と子で同じ値を編集", "v-model（次のシーン）"]]}, tag: 'emit ↑', lead: '子は「変えて！」とイベントで<b>お願い</b>する。親が変えると、新しい値が props で子に戻る。',
        render(el) {
          const pst = sbox('count', 0, 'var(--ts)'), cprop = sbox('props.count', 0, C);
          const P = vbox('👨 親', '@add="count++"', 'var(--ts)'), Cc = vbox('👶 子', '<button>+1</button>', C);
          const host = h('div', { class: 'v-host card v-col', style: { gap: '34px' } }, h('div', { class: 'v-row' }, P, pst), h('div', { class: 'v-row' }, Cc, cprop));
          const pc = code('<!-- Parent.vue -->\n<Child :count="count" @add="count++" />', 'vue', { dim: true, color: 'var(--ts)' });
          const cc = code('<!-- Child.vue -->\nconst emit = defineEmits<{ add: [] }>()\n\n<button @click="emit(\'add\')">+1</button>', 'vue', { dim: true, color: C });
          let v = 0;
          el.append(stepper({
            color: C, interval: 2300,
            steps: [{ say: '子のボタンがクリックされる。' }, { say: '子が <b>emit("add")</b>：「親さん、増やして！」と通知。' }, { say: '親の <b>@add</b> ハンドラが動き、<b>親のデータ</b>が変わる。' }, { say: '新しい値が props で子へ戻る。<b>ループ完成</b> ♻️' }],
            init(vis) { vis.append(host, h('div', { class: 'split', style: { marginTop: '12px' } }, pc, cc)); },
            update(n) {
              [P, Cc].forEach((b) => b.classList.remove('lit')); (n === 0 || n === 1 ? Cc : n === 2 ? P : Cc).classList.add('lit');
              pst.set(n >= 2 ? 1 : 0, true); cprop.set(n >= 3 ? 1 : 0, true);
              pc.setHi(n >= 2 ? [2] : []); cc.setHi(n === 0 ? [4] : n === 1 ? [2, 4] : []);
              if (n === 1) fly(host, Cc, P, 'emit("add")', 'var(--pink)', 900);
              if (n === 2) pst.set(1);
              if (n === 3) { fly(host, pst, cprop, ':count', 'var(--ts)', 800); setTimeout(() => cprop.set(1), 700); }
            },
          }));
          el.append(h('div', { class: 'card', style: { marginTop: '16px' } }, quiz({ q: '子コンポーネントが親のデータを変えたいとき？', options: ['props を直接書き換える', 'emit でイベントを送り、親に変えてもらう', 'グローバル変数を使う'], answer: 1, why: 'データの持ち主だけが変更する＝バグを追いやすい。' })));
        },
      },
      {
        t: 'v-model を部品に', why: {"pv": {"k": "code", "file": "Parent.vue", "lang": "html", "text": ":modelValue=\"name\"\n@update:modelValue=\"name=$event\"", "err": [1, 2], "keys": {"1": "dm"}}, "iv": {"k": "code", "file": "MyInput.vue", "lang": "ts", "text": "const model = defineModel()\n// model.value で読み書き\n// = props + emit のセット", "idea": [1], "keys": {"1": "dm"}}, "av": {"k": "code", "file": "Parent.vue", "lang": "html", "text": "<MyInput v-model=\"name\" />", "ok": [1], "keys": {"1": "dm"}}, "problem": "props と emit を毎回セットで書く", "idea": "セットを <b>defineModel</b> が代わりに", "answer": "<code>v-model</code> の1行でOK", "when": [["入力部品（1つの値を編集）", "v-model"], ["複数の種類の通知", "emit を個別に"]]}, tag: 'defineModel', lead: '<b>props + emit</b> のセットはよく使うので、<b>v-model</b> という近道がある。',
        render(el) {
          const A = '<!-- 長い書き方 -->\n<Child\n  :modelValue="name"\n  @update:modelValue="name = $event"\n/>';
          const B = '<!-- 短い書き方 -->\n<Child v-model="name" />';
          const child = 'const model = defineModel<string>()\n\n<input v-model="model" />';
          const host = h('div');
          const pc = code(A, 'vue', { color: 'var(--ts)' }), cc = code(child, 'vue', { color: C, file: 'Child.vue' });
          el.append(stepper({
            color: C,
            steps: [{ say: '親が値を <b>modelValue</b> で渡し、子が変更を <b>update:modelValue</b> で返す。' }, { say: 'これを <b>v-model</b> 1行に省略できる。' }, { say: '子は <b>defineModel</b> で、ref のように読み書きするだけ！（Vue 3.4 以上）' }],
            init(vis) { vis.append(h('div', { class: 'split' }, host, cc)); },
            update(n) { host.replaceChildren(code(n === 0 ? A : B, 'vue', { color: 'var(--ts)', hi: n === 0 ? [3, 4] : [2], dim: true })); cc.setHi(n === 2 ? [1] : []); },
          }));
        },
      },
      {
        t: '使い分け：どう渡す？', tag: '選び方', why: {"pv": {"k": "code", "file": "どれ？", "lang": "ts", "text": "// 親子？ 兄弟？ 遠い部品？\nprops? emit? v-model? ストア?\n// 毎回どれか迷う", "err": [2], "keys": {"2": "who"}}, "iv": {"k": "code", "file": "選び方", "lang": "ts", "text": "親 → 子        : props\n子 → 親        : emit\n親子で編集     : v-model\n遠い部品どうし : ストア", "idea": [1, 2, 3, 4], "keys": {"1": "who"}}, "av": {"k": "code", "file": "App.vue", "lang": "html", "text": "<Child :title=\"t\" @add=\"n++\" />\n<Input v-model=\"name\" />\nconst s = useCounter()", "ok": [1, 2, 3], "keys": {"1": "who"}}, "problem": "渡し方がいくつもあって迷う", "idea": "<b>誰のデータか</b>で選ぶ", "answer": "親子は props/emit、遠いならストア"}, lead: 'データを渡したくなったら、まず「<b>誰のデータ？ 誰が読む？</b>」を決める。場面ごとに選んでみよう。',
        render(el) {
          const rows = [['👨 → 👶', '表示用データを渡す', 'props', 'var(--ts)'], ['👶 → 👨', '「押された」を知らせる', 'emit', 'var(--pink)'], ['👨 ↔ 👶', '同じ値を一緒に編集', 'v-model', C], ['🌐 みんな', '遠い部品が同じ状態を読む', '共有ステート', 'var(--team)']];
          el.append(h('div', { class: 'split', style: { gridTemplateColumns: 'repeat(4,minmax(0,1fr))' } }, rows.map(([a, b, c, col]) => h('div', { class: 'card v-col', style: { textAlign: 'center', borderColor: col } }, h('b', { style: { fontSize: '1.25rem' } }, a), h('small', { style: { color: 'var(--mute)' } }, b), h('span', { class: 'chip', style: { '--c': col } }, c)))));
          pickQuiz(el, '場面クイズ', [['カードのタイトルを親から渡したい。', ['props', 'emit', 'v-model'], 0, '親 → 子の表示用データは props。'], ['子の「削除」ボタンで、親が持つリストを更新したい。', ['props を書き換える', 'emit で親に頼む', 'v-model'], 1, '持ち主（親）だけが変える。子はイベントでお願いする。'], ['入力部品の値を、親と子どちらからも編集したい。', ['props', 'emit だけ', 'v-model'], 2, '双方向の定番は v-model（defineModel）。'], ['10階層下の部品や別画面が、ログイン中ユーザーを読む。', ['props のバケツリレー', '共有ステート（Pinia）', 'v-model'], 1, '遠くの部品がたくさん読むデータは、ストアに置く（補足を参照）。']]);
        },
      },
      {
        t: '実践：カード部品', tag: 'PRACTICE', lead: "カードを<b>部品</b>にしよう。TODO コメントの所を書き換えるだけ。困ったら 💡 でヒント。",
        render(el, ctx) {
          K.vueTools.practice(el, ctx, { title: "Vue component", starter: {"index.html": "<div id=\"app\">\n  <h3>いいね: {{ likes }}</h3>\n  <!-- ② 子の 👍 を受け取って likes を増やす（@like） -->\n  <my-card title=\"りんご\"></my-card>\n  <my-card title=\"みかん\"></my-card>\n</div>", "main.js": "const app = Vue.createApp({\n  data: () => ({ likes: 0 })\n})\n\napp.component('my-card', {\n  // ① 親から title を受け取る（props）\n  template: `\n    <div style=\"border:1px solid #ccc;padding:8px;margin:6px 0;border-radius:8px\">\n      <b>{{ title }}</b>\n      <button @click=\"$emit('like')\">👍</button>\n    </div>`\n})\n\napp.mount('#app')"}, steps: [
      Object.assign({"file": "main.js", "label": "2枚のカードに「りんご」「みかん」と出る（props）", "hint": ["子が受け取るデータは <code>props</code> に書く。", "<code>props: ['title']</code> をコンポーネントに足す。"], "edits": [["  // ① 親から title を受け取る（props）\n", "  props: ['title'],\n"]]}, { ok: (R) => R.m1 }),
      Object.assign({"file": "index.html", "label": "1枚目の 👍 を押すと、上の「いいね」が 1 増える（@like）", "hint": ["子の <code>$emit('like')</code> を、親が <code>@like</code> で受け取る。", "<code>&lt;my-card ... @like=\"likes++\"&gt;</code>"], "edits": [["<my-card title=\"りんご\"></my-card>", "<my-card title=\"りんご\" @like=\"likes++\"></my-card>"]]}, { ok: (R) => R.m2 }),
      Object.assign({"file": "index.html", "label": "2枚目の 👍 も数えられる", "hint": ["2枚目にも、同じように書く。", "同じ <code>@like=\"likes++\"</code> を足す。"], "edits": [["<my-card title=\"みかん\"></my-card>", "<my-card title=\"みかん\" @like=\"likes++\"></my-card>"]]}, { ok: (R) => R.m3 }),
      Object.assign({"file": "main.js", "label": "カードごとに「押した回数」を、ボタンの横に出す（子が自分のデータを持つ）", "hint": ["子コンポーネントにも <code>data</code> が書ける。カードごとに別々に数えられる。", "<code>data: () => ({ n: 0 })</code> を足し、ボタンを <code>@click=\"n++; $emit('like')\"</code> にして <code>{{ n }}</code> を表示。"], "edits": [["app.component('my-card', {\n", "app.component('my-card', {\n  data: () => ({ n: 0 }),\n"], ["      <button @click=\"$emit('like')\">👍</button>", "      <button @click=\"n++; $emit('like')\">👍 {{ n }}</button>"]], "optional": true}, { ok: (R) => R.o1 }),
    ], probe: async (win, doc) => {
      const nt = async () => { await win.Vue.nextTick(); await new Promise((r) => setTimeout(r, 40)); };
      const bs = [...doc.querySelectorAll('b')].map((b) => b.textContent.trim());
      const out = { m1: bs.length >= 2 && !!bs[0] && !!bs[1] && bs[0] !== bs[1] };
      const num = () => { const m = (doc.querySelector('h3') ? doc.querySelector('h3').textContent : '').match(/\d+/); return m ? +m[0] : -1; };
      const btns = [...doc.querySelectorAll('button')];
      if (btns[0]) { btns[0].click(); await nt(); } out.m2 = num() === 1;
      if (btns[1]) { btns[1].click(); await nt(); } out.m3 = num() === 2;
      if (btns[0]) { btns[0].click(); await nt(); }
      const t0 = btns[0] ? btns[0].textContent : '', t1 = btns[1] ? btns[1].textContent : '';
      out.o1 = /2/.test(t0) && /1/.test(t1);
      return out;
    } });
        },
      },
    ],
  });

  /* ================= vue-life ================= */
  K.reg({
    id: 'vue-life', track: 'vue', title: 'Life Cycle / Computed / Watch', sub: 'いつ・何が起きる？', emoji: '⏱️',
    scenes: [
      {
        t: 'ライフサイクル', ref: [{"title": "フック一覧", "icon": "table", "html": "<table class=\"vref\"><thead><tr><th>フック</th><th>いつ？</th><th>よく使う用途</th></tr></thead><tbody><tr><td>onBeforeMount</td><td>DOM ができる前</td><td></td></tr><tr><td>onMounted</td><td>DOM ができた後</td><td>API 取得・DOM 操作</td></tr><tr><td>onBeforeUpdate</td><td>画面を更新する前</td><td></td></tr><tr><td>onUpdated</td><td>画面を更新した後</td><td></td></tr><tr><td>onBeforeUnmount</td><td>消える前</td><td>後片付け</td></tr><tr><td>onUnmounted</td><td>消えた後</td><td>後片付け</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "Chart.vue", "lang": "ts", "text": "const el = $('#chart')  // null!\nsetInterval(tick, 1000) // 残る", "err": [1, 2], "keys": {"1": "hook"}}, "iv": {"k": "code", "file": "部品の一生", "lang": "ts", "text": "setup()      // 準備\nonMounted    // DOM ができた後\nonUnmounted  // 消える前", "idea": [2, 3], "keys": {"2": "hook"}}, "av": {"k": "code", "file": "Chart.vue", "lang": "ts", "text": "onMounted(() => load())\nonUnmounted(() => stop())", "ok": [1, 2], "keys": {"1": "hook"}}, "problem": "DOM ができる前に触って null", "idea": "場面ごとの<b>フック</b>に書く", "answer": "<b>onMounted</b> / <b>onUnmounted</b>", "when": [["初回データ取得・DOM 操作", "onMounted"], ["タイマー・リスナーの後片付け", "onBeforeUnmount / onUnmounted"], ["値の変化に反応", "watch（次々のシーン）"]]}, tag: 'hooks', lead: '部品には <b>生まれる → 変わる → 消える</b> の流れがある。ボタンを押して、フックが呼ばれる順番を見よう。',
        render(el) {
          const H = [['setup', '作成', 'var(--basic)', 2, 'setup()'], ['onBeforeMount', '作成', 'var(--basic)', 3, 'DOMまだ無い'], ['onMounted', '作成', 'var(--basic)', 4, 'DOM使える!'], ['onBeforeUpdate', '更新', 'var(--ts)', 5, '更新前'], ['onUpdated', '更新', 'var(--ts)', 6, '更新後'], ['onBeforeUnmount', '消える', 'var(--pink)', 7, '片付け前'], ['onUnmounted', '消える', 'var(--pink)', 8, '破棄済']];
          const boxes = H.map(([n, , c, , s]) => vbox(n, s, c));
          const log = h('div', { class: 'v-log' });
          const cd = code("const count = ref(0)\nconsole.log('setup')\nonBeforeMount(() => log('beforeMount'))\nonMounted(() => log('mounted'))\nonBeforeUpdate(() => log('beforeUpdate'))\nonUpdated(() => log('updated'))\nonBeforeUnmount(() => log('beforeUnmount'))\nonUnmounted(() => log('unmounted'))", 'ts', { dim: true, color: C });
          const comp = h('div', { class: 'card', style: { textAlign: 'center', minHeight: '86px', display: 'grid', placeItems: 'center' } });
          let state = 'none', cnt = 0, busy = false;
          const drawC = () => { comp.replaceChildren(state === 'none' ? h('div', { style: { color: 'var(--mute)' } }, '🫥 まだ存在しない') : state === 'gone' ? h('div', { style: { color: 'var(--mute)' } }, '💨 消えた') : h('div', h('b', { style: { fontSize: '1.5rem' } }, '🧩 Counter  '), h('code', { class: 'i' }, 'count = ' + cnt))); };
          const hit = async (i) => { boxes.forEach((b, j) => b.classList.toggle('lit', j === i)); cd.setHi([H[i][3]]); log.append(h('div', h('span', { class: 'k' }, '#' + (log.children.length + 1) + ' '), H[i][0])); log.scrollTop = 1e5; await sleep(650); };
          const seq = async (is, mid) => { if (busy) return; busy = true; for (const i of is) { await hit(i); if (mid && mid[i]) mid[i](); } boxes.forEach((b) => b.classList.remove('lit')); busy = false; upd(); };
          const bm = h('button', { class: 'btn primary', style: { '--c': C }, onclick: () => state === 'none' || state === 'gone' ? seq([0, 1, 2], { 1: () => { state = 'on'; cnt = 0; drawC(); } }) : 0 }, '① マウント');
          const bu = h('button', { class: 'btn', onclick: () => state === 'on' && seq([3, 4], { 3: () => { cnt++; drawC(); } }) }, '② count++（更新）');
          const bx = h('button', { class: 'btn', onclick: () => state === 'on' && seq([5, 6], { 6: () => { state = 'gone'; drawC(); } }) }, '③ アンマウント');
          const upd = () => { bm.disabled = state === 'on'; bu.disabled = bx.disabled = state !== 'on'; };
          const grp = (name, a, b) => h('div', { class: 'v-ph' }, h('span', name), h('div', { class: 'v-row', style: { justifyContent: 'flex-start' } }, boxes.slice(a, b)));
          el.append(h('div', { class: 'split wide-l' }, h('div', { class: 'col' }, h('div', { class: 'v-tl card' }, grp('作成', 0, 3), grp('更新', 3, 5), grp('消える', 5, 7)), h('div', { class: 'row' }, bm, bu, bx), comp), h('div', { class: 'col' }, cd, log)));
          drawC(); upd();
          el.append(h('div', { class: 'card', style: { marginTop: '16px' } }, quiz({ q: 'API からデータを取得する処理を書く定番の場所は？', options: ['setup の外', '<code class="i">onMounted</code>（DOMが使える）', 'onUnmounted'], answer: 1, why: '最初の準備・API 呼び出し・DOM 操作は onMounted。後片付けは onBeforeUnmount / onUnmounted。' })));
        },
      },
      {
        t: 'computed：賢い計算', ref: [{"title": "method との違い", "icon": "table", "html": "<table class=\"vref\"><thead><tr><th></th><th>computed</th><th>method</th></tr></thead><tbody><tr><td>実行</td><td>材料が変わったときだけ</td><td>呼ぶたび毎回</td></tr><tr><td>結果</td><td>覚えておく（キャッシュ）</td><td>覚えない</td></tr><tr><td>向いている</td><td>表示用の値</td><td>クリックなどの処理</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "Cart.vue", "lang": "ts", "text": "let total = price * qty\nprice++\n// total は古いまま!", "err": [3], "keys": {"1": "cmp"}}, "iv": {"k": "code", "file": "Cart.vue", "lang": "ts", "text": "const total = computed(() => {\n  return price.value * qty.value\n})  // 材料が変わると再計算", "idea": [1, 2, 3], "keys": {"1": "cmp"}}, "av": {"k": "code", "file": "Cart.vue", "lang": "ts", "text": "const total = computed(() =>\n  price.value * qty.value)\n// {{ total }} はいつも最新", "ok": [1, 2], "keys": {"1": "cmp"}}, "problem": "他の値から作る値が古くなる", "idea": "材料が変わったら<b>自動で再計算</b>", "answer": "<b>computed</b>", "when": [["表示用に加工した値", "computed"], ["クリックなどで<b>実行</b>する処理", "method"], ["変わったら<b>ついでの処理</b>（ログ・API）", "watch"]]}, tag: 'computed', lead: '<b>method</b> は画面が更新されるたび毎回動く。<b>computed</b> は材料が変わったときだけ。関係ない操作で、回数を比べよう。',
        render(el) {
          const s = { first: '山田', last: '太郎', cnt: 0 };
          let mCalls = 0, cCalls = 0, dirty = true, cache = '';
          const names = ['太郎', '花子', '次郎', '美咲'];
          const calc = () => { cCalls++; return s.first + ' ' + s.last; };
          const render = () => { mCalls += 3; if (dirty) { cache = calc(); dirty = false; } paint(); };
          const mt = (l, c, fn) => { const bar = h('i', { style: { background: c } }), num = h('b', '0'); const r = h('div', { class: 'v-meter', style: { '--mc': c } }, h('span', l), h('div', { class: 'tr' }, bar), num); r.set = (n) => { bar.style.width = Math.min(100, n * 5) + '%'; num.textContent = n; }; return r; };
          const mm = mt('method', 'var(--pink)'), mc = mt('computed', C);
          const out = h('div', { class: 'card', style: { fontSize: '1.25rem', fontWeight: 900, textAlign: 'center' } });
          const paint = () => { out.textContent = '👤 ' + cache + '  /  カウンター ' + s.cnt; mm.set(mCalls); mc.set(cCalls); };
          const b1 = h('button', { class: 'btn primary', style: { '--c': C }, onclick: () => { s.last = names[(names.indexOf(s.last) + 1) % names.length]; dirty = true; render(); } }, '✏️ 名前を変更（材料が変わる）');
          const b2 = h('button', { class: 'btn', onclick: () => { s.cnt++; render(); } }, '➕ 無関係なカウンター +1');
          const b3 = h('button', { class: 'btn ghost', onclick: () => { mCalls = cCalls = 0; dirty = true; render(); mCalls = 3; paint(); } }, '⟲ リセット');
          const cd = code('const fullName = computed(() => {\n  return first.value + " " + last.value\n})\n// 材料(first,last)が変わった時だけ再計算\n// 結果はキャッシュされ、何回使っても1回', 'ts', { color: C });
          el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, h('div', { class: 'row' }, b1, b2, b3), out, h('div', { class: 'card col' }, mm, mc)), cd));
          render(); mCalls = 3; paint();
          el.append(h('p', { class: 'lead', style: { marginTop: '10px' }, html: '💡 <b>b2</b>を連打：method の棒だけ伸びる。computed は変わらない＝<b>無駄な計算なし</b>。' }));
        },
      },
      {
        t: 'watch / watchEffect', ref: [{"title": "watch のオプション", "icon": "settings", "html": "<table class=\"vref\"><thead><tr><th>オプション</th><th>意味</th></tr></thead><tbody><tr><td><code>immediate</code></td><td>最初に1回すぐ実行</td></tr><tr><td><code>deep</code></td><td>オブジェクトの中身まで見る</td></tr><tr><td><code>flush</code></td><td>実行するタイミング</td></tr><tr><td>戻り値の関数</td><td>呼ぶと監視をやめる</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "Cart.vue", "lang": "ts", "text": "qty.value++\n// 保存したいのに…\n// computed は値を返すだけ", "err": [2, 3], "keys": {"1": "watch"}}, "iv": {"k": "code", "file": "Cart.vue", "lang": "ts", "text": "watch(qty, (n, o) => {\n  // n = 新しい値, o = 古い値\n})", "idea": [1], "keys": {"1": "watch"}}, "av": {"k": "code", "file": "Cart.vue", "lang": "ts", "text": "watch(qty, (n) => {\n  save(n)   // 変わったら保存\n})", "ok": [1, 2, 3], "keys": {"1": "watch"}}, "problem": "変わったら保存・通信したい", "idea": "<b>変化を合図</b>に処理を動かす", "answer": "<b>watch</b>(対象, 処理)", "when": [["旧値と新値を比べたい・特定の値だけ", "watch"], ["使った値を全部自動で追いたい", "watchEffect"], ["派生した値がほしい", "computed"]]}, tag: 'watch', lead: '<b>watch</b> は「決めた値」だけ見張る。<b>watchEffect</b> は「中で使った値」を自動で見張る。a と b を変えて違いを見よう。',
        render(el) {
          const st = { a: 0, b: 0 }, la = sbox('a', 0, 'var(--ts)'), lb = sbox('b', 0, 'var(--pink)');
          const w1 = h('div', { class: 'v-log' }), w2 = h('div', { class: 'v-log' });
          const wl = (box, t, c) => { box.append(h('div', h('span', { class: c || 'k' }, '▶ '), t)); box.scrollTop = 1e5; };
          wl(w2, 'watchEffect 初回実行: a=0, b=0', 'w');
          const bump = (k) => { const o = st[k]; st[k]++; (k === 'a' ? la : lb).set(st[k]); if (k === 'a') wl(w1, `a が変わった: ${o} → ${st[k]}`); wl(w2, `実行: a=${st.a}, b=${st.b}`, 'w'); };
          const cd = code('watch(a, (newV, oldV) => {\n  log(`a: ${oldV} → ${newV}`)\n})\n\nwatchEffect(() => {\n  log(`a=${a.value}, b=${b.value}`)\n})', 'ts', { color: C });
          el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, h('div', { class: 'v-row' }, la, lb), h('div', { class: 'row', style: { justifyContent: 'center' } }, h('button', { class: 'btn primary', style: { '--c': 'var(--ts)' }, onclick: () => { bump('a'); cd.setHi([1, 2, 3, 5, 6, 7]); } }, 'a + 1'), h('button', { class: 'btn primary', style: { '--c': 'var(--pink)' }, onclick: () => { bump('b'); cd.setHi([5, 6, 7]); } }, 'b + 1')), cd), h('div', { class: 'col' }, lbl('watch(a)'), w1, lbl('watchEffect'), w2)));
          el.append(h('div', { class: 'st-cap', style: { marginTop: '12px' }, html: '<b>b + 1</b> を押すと…watch(a) は反応せず、watchEffect だけ動く。使い分け：<b>旧値と比べたい→watch</b> / <b>とにかく依存を追いたい→watchEffect</b>' }));
        },
      },
      {
        t: '使い分け：computed / method / watch / フック', tag: '選び方', why: {"pv": {"k": "code", "file": "どれ？", "lang": "ts", "text": "// 合計を出す？ ボタンで動く？\n// 変わったらログ？ 表示後に取得？\n// → どれを使えば…", "err": [3], "keys": {"3": "pick"}}, "iv": {"k": "code", "file": "選び方", "lang": "ts", "text": "値を作る      → computed\n押したら動く  → method\n変わったら    → watch\n表示後・消前  → onMounted", "idea": [1, 2, 3, 4], "keys": {"1": "pick"}}, "av": {"k": "code", "file": "Cart.vue", "lang": "ts", "text": "const total = computed(…)\nconst add = () => …\nwatch(total, save)\nonMounted(load)", "ok": [1, 2, 3, 4], "keys": {"1": "pick"}}, "problem": "似ていて、どれを使うか迷う", "idea": "<b>値・動作・反応</b>のどれかで選ぶ", "answer": "computed / method / watch / フック"}, lead: '似た道具が4つ。「何をしたいか」で選ぶ。まず表を見て、クイズで確かめよう。',
        render(el) {
          const T = [['computed', '他の値から<b>作る</b>値', '合計・フルネーム', 'キャッシュあり・値を返すだけ', C], ['method', '押されたら<b>実行</b>', '注文する・保存する', '呼ぶたび毎回実行', 'var(--pink)'], ['watch', '値が変わったら<b>ついでの処理</b>', 'API・ログ・保存', '旧値/新値が分かる', 'var(--ts)'], ['onMounted など', '部品の<b>タイミング</b>', '初回取得・後片付け', '誕生・更新・消滅', 'var(--team)']];
          el.append(h('div', { class: 'split', style: { gridTemplateColumns: 'repeat(4,minmax(0,1fr))' } }, T.map(([n, a, b, c, col]) => h('div', { class: 'card v-col', style: { borderColor: col, textAlign: 'center' } }, h('b', { style: { color: col, fontFamily: 'var(--mono)' } }, n), h('div', { html: a, style: { fontWeight: 800 } }), h('small', { style: { color: 'var(--mute)' } }, '例：' + b), h('small', { style: { color: 'var(--mute)' } }, c)))));
          pickQuiz(el, '場面クイズ', [['単価 × 数量の<b>合計金額</b>を画面に表示したい。', ['computed', 'watch', 'method'], 0, '他の値から作れる値は computed。材料が変わるときだけ計算される。'], ['数量が変わったら<b>サーバーに保存</b>したい。', ['computed', 'watch', 'onMounted'], 1, '「変わったら○○する」は watch。computed の中で保存や通信はしない。'], ['「注文する」ボタンを押したら処理を実行したい。', ['computed', 'method（関数）', 'watch'], 1, '押されたら動かすのは関数（method）。computed は値を返すだけ。'], ['画面が表示された<b>後</b>に、一覧を API から取得したい。', ['onMounted', 'computed', 'watchEffect だけ'], 0, '初回の取得は onMounted。'], ['部品を消すときに、<b>タイマーを止めたい</b>。', ['onMounted', 'onUnmounted（または onBeforeUnmount）', 'computed'], 1, '片付けは、消えるときのフックで。忘れると、動き続けてしまう。']]);
        },
      },
      {
        t: '実践：ライフサイクル+計算', tag: 'PRACTICE', lead: "合計の計算、表示直後、値の変化。3つのフックを使ってみよう。TODO コメントを書き換える。",
        render(el, ctx) {
          K.vueTools.practice(el, ctx, { title: "Vue", starter: {"index.html": "<div id=\"app\">\n  <p>単価 100円 × <input type=\"number\" v-model.number=\"qty\" style=\"width:60px\"> 個</p>\n  <h3>合計: {{ total }} 円</h3>\n</div>", "main.js": "const { createApp, ref, computed, watch, onMounted } = Vue\n\ncreateApp({\n  setup() {\n    const qty = ref(1)\n    // ① 合計を computed で作る（100円 × 数量）\n    const total = 0\n    // ② 表示された直後に、console.log('mounted!') を出す\n    // ③ 数量が変わったら、console.log('qty:', n) を出す\n    return { qty, total }\n  }\n}).mount('#app')"}, steps: [
      Object.assign({"file": "main.js", "label": "数量を 3 にすると、合計が 300 円になる（computed）", "hint": ["他の値から作る値は <code>computed</code>。", "<code>computed(() => qty.value * 100)</code>"], "edits": [["    const total = 0\n", "    const total = computed(() => qty.value * 100)\n"]]}, { ok: (R) => R.m1 }),
      Object.assign({"file": "main.js", "label": "表示された直後に「mounted!」がログに出る（onMounted）", "hint": ["表示された直後に動かすのは <code>onMounted</code>。", "<code>onMounted(() => console.log('mounted!'))</code>"], "edits": [["    // ② 表示された直後に、console.log('mounted!') を出す\n", "    onMounted(() => console.log('mounted!'))\n"]]}, { ok: (R) => R.m2 }),
      Object.assign({"file": "main.js", "label": "数量を変えると、ログが出る（watch）", "hint": ["値が変わったときに動かすのは <code>watch</code>。", "<code>watch(qty, (n) => console.log('qty:', n))</code>"], "edits": [["    // ③ 数量が変わったら、console.log('qty:', n) を出す\n", "    watch(qty, (n) => console.log('qty:', n))\n"]]}, { ok: (R) => R.m3 }),
      Object.assign({"file": "main.js", "label": "数量が 10 を超えたら、自動で 10 に戻す（watch の中で値を書き換える）", "hint": ["watch の中でも <code>qty.value = ...</code> と書き換えられる。", "<code>if (n > 10) qty.value = 10</code> を watch の中に足す。"], "edits": [["    watch(qty, (n) => console.log('qty:', n))\n", "    watch(qty, (n) => {\n      console.log('qty:', n)\n      if (n > 10) qty.value = 10\n    })\n"]], "optional": true}, { ok: (R) => R.o1 }),
    ], probe: async (win, doc) => {
      const nt = async () => { await win.Vue.nextTick(); await new Promise((r) => setTimeout(r, 40)); };
      const out = {};
      const logs0 = (win.__logs || []).slice();
      out.m2 = logs0.some((l) => l.includes('mounted!'));
      const inp = doc.querySelector('input'), h3 = () => (doc.querySelector('h3') ? doc.querySelector('h3').textContent : '');
      inp.value = '3'; inp.dispatchEvent(new win.Event('input', { bubbles: true })); await nt();
      out.m1 = h3().includes('300');
      out.m3 = (win.__logs || []).length > logs0.length;
      inp.value = '15'; inp.dispatchEvent(new win.Event('input', { bubbles: true })); await nt(); await new Promise((r) => setTimeout(r, 80));
      out.o1 = h3().includes('1000');
      return out;
    } });
        },
      },
    ],
  });

  /* ================= vue-router ================= */
  K.reg({
    id: 'vue-router', track: 'vue', title: 'Vue Router', sub: 'リロードなしのページ遷移', emoji: '🧭',
    scenes: [
      {
        t: 'URL ↔ コンポーネント', ref: [{"title": "ルート定義メモ", "icon": "book-open", "html": "<table class=\"vref\"><thead><tr><th>項目</th><th>意味</th></tr></thead><tbody><tr><td><code>name</code></td><td>名前で移動できる</td></tr><tr><td><code>redirect</code></td><td>別の URL に転送</td></tr><tr><td><code>children</code></td><td>入れ子のルート</td></tr><tr><td><code>() =&gt; import()</code></td><td>必要になったときだけ読み込む</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "App.vue", "lang": "html", "text": "<a href=\"/about\">About</a>\n<!-- クリック → ページ全部を再読み込み -->\n<About v-if=\"page === 'about'\" />\n<!-- URL は変わらない・戻るボタンも効かない -->", "err": [1, 3], "keys": {"3": "view"}}, "iv": {"k": "code", "file": "router.ts", "lang": "ts", "text": "const routes = [\n  { path: '/',      component: Home },\n  { path: '/about', component: About },\n]\n// URL → 部品、の対応表", "idea": [3], "keys": {"3": "view"}}, "av": {"k": "code", "file": "App.vue", "lang": "html", "text": "<RouterLink to=\"/about\">About</RouterLink>\n<RouterView />\n<!-- URL が変わり、ここだけ入れ替わる -->", "ok": [1, 2], "keys": {"2": "view"}}, "problem": "リンクで全部読み直し。URL も変わらない", "idea": "URL と部品の<b>対応表</b>を作る", "answer": "<b>RouterView</b> だけが入れ替わる", "when": [["ページ単位の切替（URL が変わる）", "Router"], ["タブ・モーダル（URL 不要）", "v-if / <code>:is</code>"]]}, tag: 'SPA', lead: 'ナビをクリック！ URL が変わり、<b>RouterView</b> の中だけが入れ替わる。ページ全体の再読み込みはなし。',
        render(el) {
          const R = [['/', 'Home', '🏠', 'var(--basic)'], ['/about', 'About', 'ℹ️', 'var(--ts)'], ['/contact', 'Contact', '✉️', 'var(--pink)']];
          const url = h('span', { class: 'url' }, 'localhost:5173/'), view = h('div', { class: 'view' }), reload = h('span', { class: 'rl' });
          let cnt = 0, cur = '/', busy = false;
          const cd = code("const routes = [\n  { path: '/',        component: Home },\n  { path: '/about',   component: About },\n  { path: '/contact', component: Contact },\n]\n\n<RouterLink to=\"/about\">About</RouterLink>\n<RouterView />", 'ts', { dim: true, color: C });
          const navs = R.map(([p, n], i) => h('button', { onclick: () => go(i) }, n));
          async function go(i) {
            if (busy) return; busy = true; const [p, n, e, c] = R[i];
            navs.forEach((b, j) => b.classList.toggle('on', j === i)); cd.setHi([[2], [3], [4]][i].concat([8]));
            url.textContent = 'localhost:5173'; for (const ch of p) { url.textContent += ch; await sleep(40); }
            view.animate && await view.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(-24px)' }], { duration: 180 }).finished;
            view.replaceChildren(h('h2', { style: { color: c } }, e + ' ' + n + ' ページ'), h('p', { style: { color: '#777' } }, '<' + n + ' /> コンポーネントが表示中'));
            view.animate && view.animate([{ opacity: 0, transform: 'translateX(24px)' }, { opacity: 1, transform: 'none' }], { duration: 260 });
            cur = p; busy = false;
          }
          reload.textContent = '🔄 ページ全体のリロード: 0 回（従来のリンクだと毎回 1 回）';
          el.append(h('div', { class: 'split' }, cd, h('div', { class: 'v-brow' }, h('div', { class: 'bar' }, h('i'), h('i'), h('i'), url), h('nav', navs), view, reload)));
          go(0);
          el.append(h('div', { class: 'st-cap', style: { marginTop: '12px' }, html: '<b>routes</b> の表が「URL → 表示する部品」の対応表。<b>&lt;RouterView /&gt;</b> がその表示場所。' }));
        },
      },
      {
        t: '動的ルート /users/:id', ref: [{"title": "params と query", "icon": "table", "html": "<table class=\"vref\"><thead><tr><th></th><th>params</th><th>query</th></tr></thead><tbody><tr><td>例</td><td>/users/42</td><td>/users?sort=asc</td></tr><tr><td>向いている</td><td>どれか1つを指す（必須）</td><td>絞り込み・並び替え（任意）</td></tr><tr><td>取り出し</td><td><code>route.params.id</code></td><td><code>route.query.sort</code></td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "router.ts", "lang": "ts", "text": "{ path: '/users/1', … },\n{ path: '/users/2', … },\n{ path: '/users/3', … },  // …∞", "err": [1, 2, 3], "keys": {"2": "param"}}, "iv": {"k": "code", "file": "router.ts", "lang": "ts", "text": "{ path: '/users/:id', … }\n// /users/42 → id = '42'", "idea": [1], "keys": {"1": "param"}}, "av": {"k": "code", "file": "User.vue", "lang": "ts", "text": "const route = useRoute()\nconst id = route.params.id", "ok": [1, 2], "keys": {"2": "param"}}, "problem": "人数ぶんルートを書けない", "idea": "URL の一部を<b>変数 :id</b> に", "answer": "<code>useRoute().params.id</code>", "when": [["リソースの ID（必須）", "params（/users/:id）"], ["絞り込み・並び替え（任意）", "query（?sort=asc）"]]}, tag: ':id', lead: 'URL の一部を<b>変数</b>として受け取れる。ユーザーを選んで、値が届くまでを見よう。',
        render(el) {
          const U = [['1', '🧑‍💻 Lam'], ['2', '👩‍🎤 Hana'], ['3', '🧙 Taro']];
          const url = h('span', { class: 'url' }, 'localhost:5173/users/1'), view = h('div', { class: 'view' });
          const params = sbox('route.params', '{ id: "1" }', C); params.style.minWidth = '170px';
          const host = h('div', { class: 'v-host' });
          const cd = code("{ path: '/users/:id', component: User }\n\n// User.vue\nconst route = useRoute()\nconst id = route.params.id\n\n// /users/42 のとき id は \"42\"（文字）\n// 数値がほしいときは Number(id)\n// id が変わったら画面も自動で更新", 'ts', { dim: true, color: C });
          const navs = U.map(([id], i) => h('button', { onclick: () => go(i) }, 'User ' + id));
          async function go(i) {
            const [id, nm] = U[i]; navs.forEach((b, j) => b.classList.toggle('on', j === i));
            url.textContent = 'localhost:5173/users/' + id; cd.setHi([1]);
            await fly(host, url, params, ':id = ' + id, 'var(--ts)', 700); params.set('{ id: "' + id + '" }'); cd.setHi([5]);
            view.replaceChildren(h('h2', nm), h('p', { style: { color: '#777' } }, 'id = ' + id + ' のデータを表示')); view.animate && view.animate([{ opacity: 0, transform: 'scale(.9)' }, { opacity: 1, transform: 'none' }], { duration: 300 });
          }
          host.append(h('div', { class: 'col' }, h('div', { class: 'v-brow' }, h('div', { class: 'bar' }, h('i'), h('i'), h('i'), url), h('nav', navs), view), h('div', { class: 'v-row' }, params)));
          el.append(h('div', { class: 'split' }, host, h('div', null, cd)));
          setTimeout(() => go(0), 30);
        },
      },
      {
        t: 'ナビゲーションガード', ref: [{"title": "ガードの種類", "icon": "shield-check", "html": "<table class=\"vref\"><thead><tr><th>種類</th><th>いつ動く</th></tr></thead><tbody><tr><td><code>beforeEach</code></td><td>すべての移動の前</td></tr><tr><td><code>beforeEnter</code></td><td>特定のルートに入る前</td></tr><tr><td><code>onBeforeRouteLeave</code></td><td>今のページから出る前</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "各ページ", "lang": "ts", "text": "// Admin.vue\nif (!user) go('/login')\n// Mypage.vue  ← 書き忘れ", "err": [3], "keys": {"2": "guard"}}, "iv": {"k": "code", "file": "router.ts", "lang": "ts", "text": "router.beforeEach((to, from) => {\n  // どのページに行く時も通る\n})", "idea": [1], "keys": {"1": "guard"}}, "av": {"k": "code", "file": "router.ts", "lang": "ts", "text": "router.beforeEach((to) => {\n  if (!loggedIn) return '/login'\n})", "ok": [1, 2, 3], "keys": {"1": "guard"}}, "problem": "チェックを各ページに書くと漏れる", "idea": "<b>全ページ共通の関所</b>を1つ", "answer": "<b>router.beforeEach</b>", "when": [["全ページ共通のチェック", "beforeEach"], ["特定のルートだけ", "beforeEnter / meta"]]}, tag: 'guard', lead: 'ページに入る前の<b>関所</b>。ログインしていないと /admin に入れず、/login に戻される。',
        render(el) {
          let login = false, busy = false;
          const req = vbox('🧑 /admin へ', 'router.push', 'var(--ts)'), gate = vbox('🛂 beforeEach', 'ログイン済み？', 'var(--team)'), page = vbox('📄 AdminPage', '', C);
          const login_page = vbox('🔐 LoginPage', '/login', 'var(--pink)');
          const msg = h('div', { class: 'st-cap', style: { marginTop: '12px' } }, 'スイッチを切り替えて「/admin へ」を押そう');
          const host = h('div', { class: 'v-host card' }, h('div', { class: 'v-gate' }, req, h('span', { class: 'arrow' }, '➜'), gate, h('span', { class: 'arrow' }, '➜'), h('div', { class: 'col', style: { justifyItems: 'stretch' } }, page, login_page)));
          const sw = h('button', { class: 'v-sw', onclick: () => { login = !login; sw.classList.toggle('on', login); sw.textContent = login ? '🟢 ログイン中' : '⚪ 未ログイン'; } }, '⚪ 未ログイン');
          const cd = code("router.beforeEach((to) => {\n  if (to.path === '/admin' && !loggedIn) {\n    return '/login'   // 追い返す\n  }\n})\n\nrouter.push('/admin')\n\n// return しなければそのまま通る\n// どのページへの移動でも、毎回ここを通る", 'ts', { dim: true, color: C });
          const run = async () => {
            if (busy) return; busy = true; [req, gate, page, login_page].forEach((b) => b.classList.remove('lit'));
            req.classList.add('lit'); cd.setHi([6]); await sleep(300); fly(host, req, gate, 'push', 'var(--ts)', 500); await sleep(550); req.classList.remove('lit'); gate.classList.add('lit'); cd.setHi([1, 2]); await sleep(500);
            if (login) { fly(host, gate, page, '✅ OK', 'var(--ok)', 600); await sleep(650); gate.classList.remove('lit'); page.classList.add('lit'); msg.innerHTML = '✅ 通過！ <b>/admin</b> を表示'; }
            else { cd.setHi([3]); fly(host, gate, login_page, '🚫 redirect', 'var(--bad)', 600); await sleep(650); gate.classList.remove('lit'); login_page.classList.add('lit'); msg.innerHTML = '🚫 未ログイン → <b>/login</b> へリダイレクト'; }
            busy = false;
          };
          el.append(h('div', { class: 'split' }, h('div', { class: 'col' }, h('div', { class: 'row' }, sw, h('button', { class: 'btn primary', style: { '--c': C }, onclick: run }, '▶ /admin へ移動')), host, msg), h('div', null, cd)));
        },
      },
      {
        t: '使い分け：RouterLink と push', tag: '選び方', why: {"pv": {"k": "code", "file": "App.vue", "lang": "html", "text": "<a href=\"/about\">  // 全部リロード\nlocation.href = '/about'\n// 書き方がバラバラ…", "err": [1, 2], "keys": {"2": "nav"}}, "iv": {"k": "code", "file": "選び方", "lang": "ts", "text": "人が押す       → <RouterLink>\nコードが決める → router.push()\n戻らせない     → router.replace()", "idea": [1, 2, 3], "keys": {"2": "nav"}}, "av": {"k": "code", "file": "App.vue", "lang": "ts", "text": "<RouterLink to=\"/about\">\nrouter.push('/about')\nrouter.replace('/login')", "ok": [1, 2, 3], "keys": {"2": "nav"}}, "problem": "移動の書き方がいくつもある", "idea": "<b>誰が移動を決めるか</b>で選ぶ", "answer": "RouterLink / push / replace"}, lead: 'ページ移動の道具は3つ。<b>人が押す</b>のか、<b>コードが決める</b>のかで選ぶ。',
        render(el) {
          const T = [['&lt;RouterLink&gt;', 'ユーザーが押す<b>リンク</b>', '〈a〉の代わり。右クリックで別タブも可', 'var(--ts)'], ['router.push()', 'コードが<b>判断して</b>移動', '送信成功 → トップへ。履歴に残る', C], ['router.replace()', '履歴を<b>残さず</b>移動', 'ログイン後など。戻るで戻れない', 'var(--pink)'], ['useRoute()', 'URL の<b>値を読む</b>', 'params.id / query を取り出す', 'var(--team)']];
          el.append(h('div', { class: 'split', style: { gridTemplateColumns: 'repeat(4,minmax(0,1fr))' } }, T.map(([n, a, b, col]) => h('div', { class: 'card v-col', style: { borderColor: col, textAlign: 'center' } }, h('b', { style: { color: col, fontFamily: 'var(--mono)', fontSize: '.875rem' }, html: n }), h('div', { html: a, style: { fontWeight: 800 } }), h('small', { style: { color: 'var(--mute)' } }, b)))));
          pickQuiz(el, '場面クイズ', [['ヘッダーのメニューリンク。', ['&lt;RouterLink to=...&gt;', 'router.push', 'useRoute'], 0, '人が押すリンクは RouterLink。右クリックで新しいタブも開ける。'], ['フォーム送信が成功したらトップへ移動したい。', ['RouterLink', 'router.push(\'/\')', 'useRoute'], 1, 'コードが決めて移動するときは push。'], ['ログイン後、戻るボタンでログイン画面に戻らないようにしたい。', ['push', 'replace', 'RouterLink'], 1, 'replace は履歴に残さないので、戻るボタンで戻れない。'], ['<code>/users/42</code> の 42 を取り出したい。', ['useRoute().params.id', 'router.push', 'RouterLink'], 0, 'useRoute は今の URL を読む。移動する useRouter と混ぜない。']]);
        },
      },
      {
        t: '実践：ルーターを動かす', tag: 'PRACTICE', lead: "ナビに <b>About</b> を足して、ページを行き来できるようにしよう。",
        render(el, ctx) {
          K.vueTools.practice(el, ctx, { libs: [VUE, VROUTER], title: "Vue Router", starter: {"index.html": "<div id=\"app\">\n  <nav>\n    <router-link to=\"/\">Home</router-link> |\n    <!-- ① About へのリンクを足す -->\n    <router-link to=\"/user/42\">ユーザー 42</router-link>\n  </nav>\n  <router-view></router-view>\n</div>", "main.js": "const Home = { template: '<h2>Home</h2>' }\nconst About = { template: '<h2>About</h2>' }\n\nconst routes = [\n  { path: '/', component: Home },\n  // ② /about のルートを足す\n]\n\n// このページの中で動かすので createMemoryHistory を使う\nconst router = VueRouter.createRouter({\n  history: VueRouter.createMemoryHistory(),\n  routes,\n})\n\nVue.createApp({}).use(router).mount('#app')"}, steps: [
      Object.assign({"file": "index.html", "label": "ナビに「About」のリンクが出る", "hint": ["ナビのリンクは <code>&lt;router-link to=\"…\"&gt;</code>。", "<code>&lt;router-link to=\"/about\"&gt;About&lt;/router-link&gt;</code>"], "edits": [["    <!-- ① About へのリンクを足す -->\n", "    <router-link to=\"/about\">About</router-link> |\n"]]}, { ok: (R) => R.m1 }),
      Object.assign({"file": "main.js", "label": "「About」を押すと、About の画面が出る", "hint": ["どの URL でどの部品を出すか、<code>routes</code> に1行足す。", "<code>{ path: '/about', component: About }</code>"], "edits": [["  // ② /about のルートを足す\n", "  { path: '/about', component: About },\n"]]}, { ok: (R) => R.m2 }),
      Object.assign({"file": "main.js", "label": "「Home」を押すと、Home の画面に戻る", "hint": ["Home のリンクはもうある。ルートが2つあれば、行き来できる。", "② が書けていれば、自然に戻れる。"], "edits": []}, { ok: (R) => R.m3 }),
      Object.assign({"file": "main.js", "label": "「ユーザー 42」を押すと「ユーザー 42」と出る（URL の一部を変数で受け取る）", "hint": ["URL の一部を変数にするには、path に <code>:id</code> と書く。画面では <code>$route.params.id</code> で読める。", "<code>{ path: '/user/:id', component: User }</code> と、<code>{{ $route.params.id }}</code> を出す User 部品を作る。"], "edits": [["const About = { template: '<h2>About</h2>' }\n", "const About = { template: '<h2>About</h2>' }\nconst User = { template: '<h2>ユーザー {{ $route.params.id }}</h2>' }\n"], ["  { path: '/about', component: About },\n", "  { path: '/about', component: About },\n  { path: '/user/:id', component: User },\n"]], "optional": true}, { ok: (R) => R.o1 }),
    ], probe: async (win, doc) => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const out = { m1: false, m2: false, m3: false };
      const link = (t) => [...doc.querySelectorAll('a')].find((a) => a.textContent.trim() === t);
      const h2 = () => (doc.querySelector('h2') ? doc.querySelector('h2').textContent : '');
      out.m1 = !!link('About');
      if (out.m1) { link('About').click(); await wait(200); out.m2 = h2().includes('About');
        if (out.m2 && link('Home')) { link('Home').click(); await wait(200); out.m3 = h2().includes('Home'); } }
      const u = link('ユーザー 42');
      if (u) { u.click(); await wait(250); out.o1 = h2().includes('42'); }
      return out;
    } });
        },
      },
    ],
  });

  /* ================= vue-test ================= */
  K.reg({
    id: 'vue-test', track: 'vue', title: 'Vue 単体テスト', sub: '@vue/test-utils', emoji: '🧪',
    scenes: [
      {
        t: 'mount → find → trigger → expect', ref: [{"title": "よく使う API", "icon": "book-open", "html": "<table class=\"vref\"><thead><tr><th>API</th><th>やること</th></tr></thead><tbody><tr><td><code>find / findAll</code></td><td>要素を探す</td></tr><tr><td><code>setValue</code></td><td>入力欄に入力する</td></tr><tr><td><code>trigger</code></td><td>クリックなどを起こす</td></tr><tr><td><code>emitted()</code></td><td>emit された内容を見る</td></tr><tr><td><code>props()</code></td><td>渡された props を見る</td></tr></tbody></table>"}], why: {"pv": {"k": "code", "file": "手作業", "lang": "sh", "text": "1. npm run dev\n2. ボタンを押す\n3. 画面を見る → 毎回…", "err": [1, 2, 3], "keys": {"2": "test"}}, "iv": {"k": "code", "file": "Counter.spec.ts", "lang": "ts", "text": "const w = mount(Counter)\nconst btn = w.get('button')\nawait btn.trigger('click')\nexpect(w.text()).toContain('1')", "idea": [1, 2, 3, 4], "keys": {"3": "test"}}, "av": {"k": "code", "file": "ターミナル", "lang": "sh", "text": "✓ Counter.spec.ts\n  ✓ ボタンで 1 増える  (12ms)\nTests 1 passed", "ok": [1, 2, 3], "keys": {"2": "test"}}, "problem": "手で毎回確認。壊れても気づけない", "idea": "操作を<b>コードにして自動確認</b>", "answer": "<b>mount → find → trigger → expect</b>", "when": [["部品単体の動作", "mount（子も一緒に描画）"], ["子の影響を切り離したい", "shallowMount"], ["画面全体の流れ", "E2E（別のツール）"]]}, tag: 'test-utils', lead: 'テストは、<b>人の操作をコードにしたもの</b>。1行ずつ、何が起きるか見よう。',
        render(el) {
          let wrongExpect = false;
          const src = () => `import { mount } from '@vue/test-utils'\nimport Counter from './Counter.vue'\n\ntest('ボタンで +1', async () => {\n  const w = mount(Counter)\n  const btn = w.find('button')\n  await btn.trigger('click')\n  expect(w.text()).toContain('${wrongExpect ? 2 : 1}')\n})`;
          const cd = h('div');
          const btn = h('button', { class: 'btn' }, '+1'), num = h('b', { style: { fontSize: '1.5rem' } }, '0');
          const comp = h('div', { class: 'card v-row', style: { minHeight: '90px', opacity: .2, transition: '.4s' } }, num, btn);
          const res = h('div', { class: 'v-res' });
          let n = 0;
          const tgl = h('button', { class: 'v-sw', onclick: () => { wrongExpect = !wrongExpect; tgl.classList.toggle('on', wrongExpect); tgl.textContent = wrongExpect ? '🔴 期待値を 2 に（失敗させる）' : '期待値を 2 にして失敗させる'; draw(n); } }, '期待値を 2 にして失敗させる');
          const lines = [[], [5], [6], [7], [8]];
          function draw(i) {
            n = i; cd.replaceChildren(code(src(), 'ts', { dim: true, color: C, file: 'Counter.spec.ts', hi: lines[i] }));
            comp.style.opacity = i >= 1 ? 1 : .2; num.textContent = i >= 3 ? 1 : 0; btn.style.outline = i === 2 || i === 3 ? '3px solid var(--vue)' : 'none';
            if (i === 3) btn.animate && btn.animate([{ transform: 'scale(.85)' }, { transform: 'none' }], { duration: 300 });
            res.replaceChildren(...(i < 4 ? [h('div', { style: { color: '#6d779f' } }, '… 実行中')] : wrongExpect ? [h('div', { class: 'ng' }, '✖ ボタンで +1'), h('div', { class: 'ng' }, "  Expected: '2'"), h('div', { class: 'ng' }, "  Received: '1'")] : [h('div', { class: 'ok' }, '✔ ボタンで +1'), h('div', { class: 'ok' }, 'Tests 1 passed (1)')]));
          }
          el.append(stepper({
            color: C,
            steps: [{ say: '準備：テストの先頭。まだ何も作られていない。' }, { say: '<b>mount</b>：テスト用の仮の画面（jsdom）に、部品を作る。' }, { say: '<b>find</b>：CSSセレクタで操作したい要素を探す。' }, { say: '<b>trigger</b>：クリックを実行 → count が 1 に。' }, { say: '<b>expect</b>：結果を比べる。同じなら ✔、違えば ✖。' }],
            init(vis) { vis.append(h('div', { class: 'split' }, cd, h('div', { class: 'col' }, comp, res, tgl))); },
            update(i) { draw(i); },
          }));
        },
      },
      {
        t: '確認クイズ', why: {"pv": {"k": "code", "file": "Counter.spec.ts", "lang": "ts", "text": "// 用語は分かる…でも\n// どの順で何を書く？\ntest('?', () => { ??? })", "err": [3], "keys": {"3": "quiz"}}, "iv": {"k": "code", "file": "Counter.spec.ts", "lang": "ts", "text": "test('+1', async () => {\n  // ① 作る mount\n  // ② 操作 trigger\n  // ③ 比べる expect\n})", "idea": [2, 3, 4], "keys": {"1": "quiz"}}, "av": {"k": "code", "file": "Counter.spec.ts", "lang": "ts", "text": "mount(Counter)\nawait btn.trigger('click')\nexpect(w.text()).toContain('1')", "ok": [1, 2, 3], "keys": {"1": "quiz"}}, "problem": "用語は分かるが書く順番が不明", "idea": "<b>作る → 操作 → 比べる</b>", "answer": "mount / trigger / expect", "when": [["部品1つを確かめる", "mount"], ["子を無視して親だけ", "shallowMount"]]}, lead: 'テストの基本をチェック！',
        render(el) {
          el.append(h('div', { class: 'card col' },
            quiz({ q: 'DOM のクリックをテストで再現するメソッドは？', options: ['<code class="i">mount()</code>', '<code class="i">trigger("click")</code>', '<code class="i">expect()</code>'], answer: 1, why: 'find で探して trigger で操作！' }),
            quiz({ q: '結果を「期待どおりか」確かめる関数は？', options: ['<code class="i">expect(...).toBe(...)</code>', '<code class="i">find()</code>', '<code class="i">ref()</code>'], answer: 0, why: 'expect が最後の“答え合わせ”。' }),
            quiz({ q: 'ProductList を確かめたい。中の子部品 ProductCard の影響は切り離したい。', options: ['<code class="i">mount</code>', '<code class="i">shallowMount</code>（子をダミーにする）', '<code class="i">trigger</code>'], answer: 1, why: '子の不具合に引きずられず、ProductList だけを確かめられる。' })));
        },
      },
    ],
  });
})();
