/* 実例：新人の初日 — 端末のコマンドに合わせてフォルダが育ち、保存すると画面が変わる */
(function () {
  'use strict';
  const K = window.KENSHU;
  const wait = (n) => { if (K && K.lessons && K.lessons['vue-env']) return init(); if (n > 100) return; setTimeout(() => wait(n + 1), 100); };
  wait(0);

  function init() {
    const L = K.lessons['vue-env'];
    if (L.scenes.some((s) => s.t && s.t.indexOf('実例') === 0)) return;
    const { h, code, style, sleep } = K.W;

    style('vrE', `
    .vrE-term{background:#0b1020;border:1px solid var(--line);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;min-width:0}
    .vrE-bar{display:flex;gap:6px;align-items:center;padding:7px 12px;background:#161c33;color:#8b94b8;font:700 .72rem var(--mono)}
    .vrE-bar i{width:10px;height:10px;border-radius:50%;background:#ff5f56}.vrE-bar i:nth-child(2){background:#ffbd2e}.vrE-bar i:nth-child(3){background:#27c93f}
    .vrE-body{padding:10px 14px;height:348px;overflow:auto;font:600 .78rem/1.55 var(--mono);color:#cfd6f5;white-space:pre-wrap;word-break:break-all}
    .vrE-body .ps{color:#6ee7a8}.vrE-body .cmd{color:#fff;font-weight:800}.vrE-body .q{color:#7cc4ff}.vrE-body .a{color:#ffd166}.vrE-body .ok{color:#6ee7a8}.vrE-body .dm{color:#7d86ad}.vrE-body .url{color:#7cc4ff;text-decoration:underline}
    .vrE-cur{display:inline-block;width:.55em;height:1em;background:#cfd6f5;vertical-align:text-bottom;animation:vrEb 1s steps(1) infinite}
    @keyframes vrEb{50%{opacity:0}}
    .vrE-tree{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 14px;font:700 .8rem/1.7 var(--mono);height:376px;overflow:auto;min-width:0}
    .vrE-tree .r{display:flex;gap:6px;align-items:center;white-space:nowrap;animation:vrEin .5s}
    .vrE-tree .r.new{color:var(--vue);font-weight:900}.vrE-tree .r.cur{background:color-mix(in srgb,var(--vue) 22%,transparent);border-radius:5px}
    .vrE-tree .r.nm{color:var(--mute)}
    @keyframes vrEin{from{opacity:0;transform:translateX(-10px)}}
    .vrE-steps{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
    .vrE-st{padding:.35em .8em;border-radius:999px;border:2px solid var(--line);background:var(--card);font:800 .76rem var(--font);cursor:pointer;color:var(--mute);transition:.2s}
    .vrE-st.on{border-color:var(--vue);color:var(--vue);background:color-mix(in srgb,var(--vue) 16%,var(--card))}.vrE-st.done{color:var(--ok);border-color:var(--ok)}
    .vrE-br{border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#fff;color:#223;min-width:0}
    .vrE-url{display:flex;align-items:center;gap:8px;padding:7px 12px;background:#e9ecf5;font:700 .74rem var(--mono);color:#556}
    .vrE-url span{flex:1;background:#fff;border-radius:999px;padding:.2em .9em}
    .vrE-page{padding:16px;min-height:262px;display:grid;gap:10px;align-content:start}
    .vrE-page h1{margin:0;font-size:1.25rem}.vrE-page .hd{font-weight:900;color:#42b883;font-size:.8rem}
    .vrE-page .it{padding:8px 12px;border:1px solid #d5d9e8;border-radius:8px;font-weight:700;font-size:.85rem;display:flex;justify-content:space-between}
    .vrE-page button{justify-self:start;padding:.4em 1em;border-radius:6px;border:1px solid #99a;background:#f4f6fb;cursor:pointer;font-weight:800}
    .vrE-page .err{text-align:center;color:#778;padding:50px 0;font-weight:800}
    .vrE-page.flash{animation:vrEf .9s}@keyframes vrEf{30%{background:#e3fbef}}
    .vrE-badge{justify-self:end;font:800 .7rem var(--mono);color:#fff;background:#42b883;border-radius:999px;padding:.15em .7em;opacity:0;transition:.3s}.vrE-badge.on{opacity:1}
    .vrE-cap{font:900 .78rem var(--font);color:var(--mute);margin:0 0 6px}
    `);

    const PKG = '{\n  "name": "soudan-navi",\n  "scripts": {\n    "dev": "vite",\n    "build": "vue-tsc -b && vite build"\n  },\n  "dependencies": {\n    "vue": "^3.5.13",\n    "vue-router": "^4.5.0",\n    "pinia": "^3.0.0"\n  }\n}';
    const HOME = (title) => "<script setup lang=\"ts\">\nimport { ref } from 'vue'\n\nconst count = ref(0)\n</script>\n\n<template>\n  <h1>" + title + "</h1>\n  <button @click=\"count++\">受付件数 {{ count }}</button>\n</template>";
    const lines = (src, k) => src.split('\n').map((l, i) => l.includes(k) ? i + 1 : 0).filter(Boolean);

    /* フォルダ：[深さ, 名前, 出現ステップ, 説明?, 淡色?] */
    const TREE = [
      [0, '📁 soudan-navi/', 0], [1, '📄 package.json', 0], [1, '📄 index.html', 0], [1, '📄 vite.config.ts', 0], [1, '📄 tsconfig.json', 0],
      [1, '📁 src/', 0], [2, '📄 main.ts', 0], [2, '📄 App.vue', 0], [2, '📁 router/', 0], [2, '📁 stores/', 0], [2, '📁 views/', 0], [3, '📄 HomeView.vue', 0],
      [1, '📄 package-lock.json', 1], [1, '📁 node_modules/  （214 パッケージ）', 1, 1],
    ];
    const STEPS = [
      { b: '① 作る', cmd: 'npm create vue@latest', file: ['package.json', PKG, 'json'], hi: lines(PKG, '"name"'), focus: 'package.json',
        out: [['q', '◇  Project name:'], ['a', '│  soudan-navi'], ['q', '◇  Add TypeScript?  │ Yes'], ['q', '◇  Add Vue Router?  │ Yes'], ['q', '◇  Add Pinia?       │ Yes'], ['q', '◇  Add Vitest?      │ No'], ['q', '◇  Add ESLint?      │ Yes'], ['ok', '└  Scaffolding project in ./soudan-navi... Done.']] },
      { b: '② 入れる', cmd: 'cd soudan-navi && npm install', file: ['package.json', PKG, 'json'], hi: lines(PKG, '"vue":'), focus: 'node_modules',
        out: [['dm', 'npm warn deprecated glob@7.2.3'], ['ok', 'added 214 packages, and audited 215 packages in 12s'], ['dm', 'found 0 vulnerabilities']] },
      { b: '③ 動かす', cmd: 'npm run dev', file: ['package.json', PKG, 'json'], hi: lines(PKG, '"dev"'), focus: '',
        out: [['dm', '> soudan-navi@0.0.0 dev'], ['dm', '> vite'], ['ok', '  VITE v7.0.4  ready in 412 ms'], ['', '  ➜  Local:   <u class="url">http://localhost:5173/</u>']] },
      { b: '④ 書き換える', file: ['src/views/HomeView.vue　● 未保存', HOME('相談一覧（今月）'), 'vue'], hi: lines(HOME('相談一覧（今月）'), '<h1>'), focus: 'HomeView.vue', edit: true, out: [] },
      { b: '⑤ 保存→自動更新', file: ['src/views/HomeView.vue', HOME('相談一覧（今月）'), 'vue'], hi: lines(HOME('相談一覧（今月）'), '<h1>'), focus: 'HomeView.vue', save: true,
        out: [['dm', '10:42:07 [vite] <span class="ok">hmr update</span> /src/views/HomeView.vue']] },
    ];

    function scene() {
      let cur = -1, tok = 0, title = '相談一覧', count = 0;
      const body = h('div', { class: 'vrE-body' });
      const term = h('div', { class: 'vrE-term' }, h('div', { class: 'vrE-bar' }, h('i'), h('i'), h('i'), h('span', { style: { marginLeft: '8px' } }, 'ターミナル')), body);
      const tree = h('div', { class: 'vrE-tree' });
      const fileHost = h('div'); const capF = h('div', { class: 'vrE-cap' });
      const pageEl = h('div', { class: 'vrE-page' }); const urlEl = h('span', 'localhost:5173');
      const badge = h('span', { class: 'vrE-badge' }, '⚡ 入力した件数はそのまま');
      const br = h('div', { class: 'vrE-br' }, h('div', { class: 'vrE-url' }, '←  →  ⟳', urlEl), pageEl);
      const stepsEl = h('div', { class: 'vrE-steps' });
      let pre = null, rootEl = null;
      /* UI ⇄ コード：画面・フォルダ・URL の部品 ⇄ エディタの行（再描画のたびにつなぎ直す） */
      const KMAP = { name: ['"name"'], deps: ['"dependencies"', '"vue":', '"vue-router"', '"pinia"'], dev: ['"dev"'], title: ['<h1>'], count: ['const count', '<button', '{{ count }}'] };
      const px = { get lines() { return pre ? pre.lines : []; }, setHi: (a, c) => { if (pre) pre.setHi(a, c); } };
      const relink = () => { if (rootEl && K.vs && K.vs.link) K.vs.link(rootEl, px, KMAP, { rest: () => (cur >= 0 && STEPS[cur] ? STEPS[cur].hi : []) }); };
      urlEl.setAttribute('data-k', 'dev');

      const ps = (cwd) => '<span class="ps">' + cwd + ' $</span> ';
      const cwdAt = (i) => i >= 1 ? '~/work/soudan-navi' : '~/work';

      const drawTree = (n, animateNew) => {
        const f = STEPS[n] && STEPS[n].focus;
        tree.replaceChildren(...TREE.filter((t) => t[2] <= n).map((t) => {
          const nw = animateNew && t[2] === n;
          const row = h('div', { class: 'r' + (nw ? ' new' : '') + (f && t[1].includes(f) ? ' cur' : '') + (t[3] ? ' nm' : ''), style: { paddingLeft: t[0] * 18 + 'px' } }, t[1]);
          if (t[1].includes('📄 package.json')) row.setAttribute('data-k', 'name'); else if (t[1].includes('node_modules')) row.setAttribute('data-k', 'deps');
          return row;
        }));
        relink();
      };
      const drawFile = (n) => {
        const s = STEPS[n < 0 ? 0 : n];
        const [name, src, lang] = s.file;
        pre = code(src, lang, { color: 'var(--vue)', file: name, dim: true, edit: false });
        if (n >= 0) pre.setHi(s.hi, 'on');
        
        fileHost.replaceChildren(pre);
        if (n < 0) pre.setHi([]);
        relink();
      };
      const drawPage = (n, flash) => {
        const up = n >= 2;
        urlEl.textContent = up ? 'localhost:5173' : 'localhost:5173  — 接続できません';
        if (!up) { pageEl.replaceChildren(h('div', { class: 'err' }, '🔌 このサイトにアクセスできません')); badge.classList.remove('on'); return; }
        const t = n >= 4 ? '相談一覧（今月）' : '相談一覧';
        const btn = h('button', { onclick: () => { count++; btn.textContent = '受付件数 ' + count; } }, '受付件数 ' + count);
        btn.setAttribute('data-k', 'count');
        pageEl.replaceChildren(h('div', { class: 'hd' }, 'ソウダンナビ'), h('h1', { 'data-k': 'title' }, t), btn, h('div', { class: 'it' }, h('span', '離婚の相談'), h('span', '対応中')), h('div', { class: 'it' }, h('span', '相続の相談'), h('span', '完了')), badge);
        if (flash) { pageEl.classList.remove('flash'); void pageEl.offsetWidth; pageEl.classList.add('flash'); }
        badge.classList.toggle('on', !!flash && count > 0);
        relink();
      };
      const drawSteps = () => stepsEl.replaceChildren(...STEPS.map((s, i) => h('span', { class: 'vrE-st' + (i === cur ? ' on' : i < cur ? ' done' : ''), onclick: () => go(i) }, s.b)),
        h('button', { class: 'btn primary', style: { '--c': 'var(--vue)', marginLeft: 'auto' }, onclick: () => auto() }, '▶ 自動再生'),
        h('button', { class: 'btn', onclick: () => go(Math.min(cur + 1, STEPS.length - 1)) }, '次へ ➜'));

      /* 端末の履歴（i までを一瞬で描く）。最後だけアニメーション */
      const history = (n, animate) => {
        const my = ++tok;
        body.replaceChildren();
        const add = (html) => { const d = h('div', { html }); body.append(d); body.scrollTop = body.scrollHeight; return d; };
        const instant = (i) => { const s = STEPS[i]; if (s.cmd) add(ps(cwdAt(i === 1 ? 0 : i)) + '<span class="cmd">' + s.cmd + '</span>'); s.out.forEach(([c, t]) => add('<span class="' + c + '">' + t + '</span>')); };
        const upto = animate ? n - 1 : n;
        for (let i = 0; i <= upto; i++) if (STEPS[i].cmd || STEPS[i].out.length) instant(i);
        if (!animate) { if (n >= 0 && STEPS[n].cmd == null && STEPS[n].out.length === 0) add(ps(cwdAt(2)) + '<span class="dm"># エディタで HomeView.vue を開いて、見出しを書き換え中…</span>'); return Promise.resolve(); }
        return (async () => {
          const s = STEPS[n]; const alive = () => my === tok && body.isConnected;
          if (s.cmd) {
            const d = add(ps(cwdAt(n === 1 ? 0 : n)) + '<span class="cmd"></span><span class="vrE-cur"></span>'); const c = d.querySelector('.cmd');
            for (const ch of s.cmd) { if (!alive()) return; c.textContent += ch; await sleep(35); }
            d.querySelector('.vrE-cur').remove(); await sleep(250);
          } else if (s.edit) add(ps(cwdAt(2)) + '<span class="dm"># エディタで HomeView.vue を開いて、見出しを書き換え中…</span>');
          for (const [c, t] of s.out) { if (!alive()) return; add('<span class="' + c + '">' + t + '</span>'); await sleep(n === 0 ? 420 : 330); }
        })();
      };

      const go = async (n) => {
        if (n === cur) return;
        const animate = n === cur + 1;
        cur = n; drawSteps(); drawTree(n, true); drawFile(n); drawPage(n < 4 ? Math.min(n, 2) : 2, false);
        if (n === 3) pre.setHi(STEPS[3].hi, 'on');
        const done = history(n, animate);
        if (n === 4) { await done; if (!body.isConnected || cur !== 4) return; pre.setHi(STEPS[4].hi, 'on'); drawPage(4, true); }
        return done;
      };
      let autoTok = 0;
      const auto = async () => { const my = ++autoTok; cur = -1; for (let i = 0; i < STEPS.length; i++) { if (my !== autoTok || !body.isConnected) return; await go(i); await sleep(1100); } };
      const goUser = (n) => { autoTok++; return go(n); };

      drawTree(-1, false); drawFile(-1); drawPage(-1, false); drawSteps();
      body.append(h('div', { html: ps('~/work') + '<span class="vrE-cur"></span>' }));
      /* ボタンの操作で自動再生を止める */
      stepsEl.addEventListener('click', () => { autoTok++; }, true);

      rootEl = h('div', { style: { display: 'grid', gap: '12px' } }, stepsEl,
        h('div', { class: 'vi-eq' }, term, h('div', null, h('div', { class: 'vrE-cap' }, '📁 フォルダ（コマンドごとに増える）'), tree)),
        h('div', { class: 'vi-eq' }, h('div', null, h('div', { class: 'vrE-cap' }, '✏️ エディタ'), fileHost), h('div', null, h('div', { class: 'vrE-cap' }, '🌐 ブラウザ'), br)));
      relink();
      return rootEl;
    }

    const sc = { t: '実例：初日にやる 4 コマンド', tag: '実例', lead: '<b>コマンドを順に実行</b>すると、フォルダが育ち、保存した瞬間に画面が変わる。', render(el) { el.append(scene()); } };
    L.scenes.splice(Math.max(L.scenes.length - 1, 0), 0, sc);
  }
})();
