/* 環境設定（vue-env）の「フォルダ探索」「開発サーバーと HMR」を、図とコード中心に組み直す */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.lessons || !K.lessons['vue-env']) return;
  const { h, code, style, sleep, lbl } = K.W;
  const C = 'var(--vue)';
  const COL = ['#ff6b9d', '#5b9dff', '#ffb454'];

  style('ve', `
  .ve-grid{display:grid;grid-template-columns:minmax(0,.7fr) minmax(0,1.3fr);gap:14px;align-items:start}
  @media(max-width:1000px){.ve-grid{grid-template-columns:1fr}}
  .ve-tree{display:grid;gap:3px;font:700 .8rem var(--mono)}
  .ve-it{all:unset;cursor:pointer;box-sizing:border-box;display:flex;gap:6px;align-items:center;padding:5px 8px;border-radius:7px;border:1px solid transparent;transition:.2s}
  .ve-it:hover{background:var(--card2)}.ve-it.on{background:color-mix(in srgb,var(--vue) 22%,var(--card));border-color:var(--vue)}.ve-it.glow{animation:vef .9s}
  @keyframes vef{40%{box-shadow:0 0 0 3px var(--vue)}}
  .ve-it small{margin-left:auto;font:800 .62rem var(--font);color:var(--mute);white-space:nowrap}
  .ve-bd{font-size:.8rem}
  .ve-map{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
  .ve-mn{all:unset;cursor:pointer;padding:6px 10px;border-radius:8px;border:2px solid var(--line);background:var(--card);font:800 .74rem var(--mono);transition:.2s;text-align:center}
  .ve-mn.on{border-color:var(--vue);background:color-mix(in srgb,var(--vue) 24%,var(--card));transform:translateY(-2px)}
  .ve-mn small{display:block;font:700 .6rem var(--font);color:var(--mute)}
  .ve-lk{display:inline-flex;gap:.4em;align-items:center;padding:.3em .8em;border-radius:8px;border:2px solid var(--n);font:800 .76rem var(--font);cursor:pointer;background:color-mix(in srgb,var(--n) 16%,var(--card2));transition:.2s}
  .ve-lk:hover{transform:translateY(-2px)}
  .ve-bw{border:2px solid var(--line);border-radius:12px;background:#fff;color:#223;overflow:hidden;min-width:0}
  .ve-bw>.bar{background:#e8ebf2;padding:5px 10px;font:700 .7rem var(--mono);color:#556;display:flex;gap:6px;align-items:center}
  .ve-bw>.bar i{width:8px;height:8px;border-radius:50%;background:#bbb;display:inline-block}
  .ve-bw>.pg{padding:12px;display:grid;gap:8px;min-height:130px;transition:.2s}
  .ve-bw.rl>.pg.blank{background:#fff;filter:brightness(.9)}
  .ve-st{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
  .ve-sp{padding:6px 12px;border-radius:999px;border:2px solid var(--line);font:800 .76rem var(--font);transition:.25s;background:var(--card)}
  .ve-sp.on{border-color:var(--vue);background:color-mix(in srgb,var(--vue) 26%,var(--card));transform:scale(1.06)}
  `);

  /* ===================== フォルダ探索 ===================== */
  const F = {
    html: { n: 'index.html', ic: '🌐', b: '👀', d: 0, role: '入口のHTML', src: '<!DOCTYPE html>\n<html lang="ja">\n  <head>\n    <meta charset="UTF-8" />\n    <title>相談ナビ</title>\n  </head>\n  <body>\n    <div id="app"></div>\n    <script type="module" src="/src/main.ts"></script>\n  </body>\n</html>', lang: 'html', marks: [['<div id="app">'], ['src="/src/main.ts"'], []], links: [['main', 'script で読み込む', 1], ['main', 'Vue が #app に取り付く', 0]] },
    main: { n: 'main.ts', ic: '🚀', b: '👀', d: 1, role: '起動ファイル', src: "import { createApp } from 'vue'\nimport App from './App.vue'\nimport router from './router'\n\ncreateApp(App)\n  .use(router)\n  .mount('#app')", lang: 'ts', marks: [["import App"], ["import router", ".use(router)"], [".mount('#app')"]], links: [['app', '最初の画面 App.vue', 0], ['router', 'ページ切替 router', 1], ['html', '#app に取り付ける', 2]] },
    app: { n: 'App.vue', ic: '💚', b: '✏️', d: 1, role: '全ページの親', src: "<script setup lang=\"ts\">\nimport { RouterLink, RouterView } from 'vue-router'\n</script>\n\n<template>\n  <nav>\n    <RouterLink to=\"/\">ホーム</RouterLink>\n    <RouterLink to=\"/cases\">相談一覧</RouterLink>\n  </nav>\n  <RouterView />\n</template>", lang: 'vue', marks: [['<RouterLink'], ['<RouterView'], []], links: [['router', 'RouterLink の行き先は router で決まる', 0], ['list', 'RouterView に、ページが出る', 1]] },
    router: { n: 'router/index.ts', ic: '🧭', b: '✏️', d: 1, role: 'URL と画面の対応', src: "import { createRouter, createWebHistory } from 'vue-router'\nimport HomeView from '../views/HomeView.vue'\nimport CaseListView from '../views/CaseListView.vue'\n\nexport default createRouter({\n  history: createWebHistory(),\n  routes: [\n    { path: '/', component: HomeView },\n    { path: '/cases', component: CaseListView },\n  ],\n})", lang: 'ts', marks: [["import CaseListView"], ["path: '/cases'"], ["export default"]], links: [['list', '/cases で CaseListView を出す', 1], ['main', 'main.ts が use(router) で受け取る', 2]] },
    list: { n: 'views/CaseListView.vue', ic: '📄', b: '✏️', d: 2, role: 'ページ（画面）', src: "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport CaseCard from '../components/CaseCard.vue'\n\nconst cases = ref([{ id: 1, title: '離婚の相談' }])\n</script>\n\n<template>\n  <h2>相談一覧</h2>\n  <CaseCard v-for=\"c in cases\" :key=\"c.id\" :title=\"c.title\" />\n</template>", lang: 'vue', marks: [['import CaseCard'], ['<CaseCard'], ['const cases']], links: [['card', '部品として CaseCard を使う', 1]] },
    card: { n: 'components/CaseCard.vue', ic: '🧩', b: '✏️', d: 2, role: '部品（使い回す）', src: "<script setup lang=\"ts\">\ndefineProps<{ title: string }>()\n</script>\n\n<template>\n  <article class=\"card\">{{ title }}</article>\n</template>", lang: 'vue', marks: [['defineProps'], ['{{ title }}'], []], links: [['list', '親（ページ）から title をもらう', 0]] },
    pkg: { n: 'package.json', ic: '📋', b: '👀', d: 0, role: '使う道具と命令', src: '{\n  "name": "my-vue-project",\n  "scripts": {\n    "dev": "vite",\n    "build": "vue-tsc && vite build",\n    "test:unit": "vitest"\n  },\n  "dependencies": { "vue": "^3.4.0", "vue-router": "^4.3.0" },\n  "devDependencies": { "vite": "^5.0.0", "vitest": "^1.0.0", "typescript": "^5.0.0" }\n}', lang: 'json', marks: [['"dev": "vite"'], ['"dependencies"'], ['"test:unit"']], links: [['vite', 'npm run dev ＝ vite を起動', 0]] },
    vite: { n: 'vite.config.ts', ic: '⚙️', b: '👀', d: 0, role: '開発サーバーの設定', src: "import { defineConfig } from 'vite'\nimport vue from '@vitejs/plugin-vue'\n\nexport default defineConfig({\n  plugins: [vue()],\n})", lang: 'ts', marks: [['plugin-vue'], ['plugins: [vue()]'], []], links: [['html', '起動すると index.html を配る', 1]] },
    ts: { n: 'tsconfig.json', ic: '📘', b: '🚫', d: 0, role: '型チェックの設定', src: '{\n  "compilerOptions": {\n    "strict": true,\n    "target": "ES2020",\n    "module": "ESNext"\n  },\n  "include": ["src/**/*.ts", "src/**/*.vue"]\n}', lang: 'json', marks: [['"strict"'], ['"include"'], []], links: [] },
    git: { n: '.gitignore', ic: '🙈', b: '👀', d: 0, role: 'Git に上げないもの', src: 'node_modules\ndist\n.env', lang: 'text', marks: [['node_modules'], ['dist'], ['.env']], links: [] },
  };
  const TREE = [
    ['root', 0, '📁', 'my-vue-project/', '', ''], ['nm', 1, '📦', 'node_modules/', '🚫', 'ライブラリ（数万ファイル）'], ['pub', 1, '🖼️', 'public/', '👀', '画像・favicon'], ['src', 1, '💻', 'src/', '✏️', 'ここに書く'],
    ['main', 2, '', '', '', ''], ['app', 2, '', '', '', ''], ['router', 2, '', '', '', ''], ['list', 2, '', '', '', ''], ['card', 2, '', '', '', ''],
    ['html', 1, '', '', '', ''], ['pkg', 1, '', '', '', ''], ['vite', 1, '', '', '', ''], ['ts', 1, '', '', '', ''], ['git', 1, '', '', '', ''],
  ];
  const NOCODE = { root: 'プロジェクト全体。VS Code で、このフォルダごと開く。', nm: '`npm install` で自動で作られる。中身は触らない。.gitignore で Git に上げない。', pub: 'そのまま配信される置き場（favicon など）。', src: 'コードはほぼここ。main.ts / App.vue / router / views / components が入っている。' };
  const FLOW = [['pkg', 'npm run dev'], ['vite', 'Vite 起動'], ['html', 'index.html'], ['main', 'main.ts'], ['app', 'App.vue'], ['router', 'router'], ['list', 'ページ'], ['card', '部品']];
  const BADGE = { '✏️': 'よく編集', '👀': 'たまに', '🚫': '触らない' };

  function folderScene() {
    let cur = 'main', play = 0;
    const btns = {}, tree = h('div', { class: 've-tree' }), codeBox = h('div'), links = h('div', { class: 'vi-row' }), info = h('div', { class: 'vi-box' }), map = h('div', { class: 've-map' });
    const rowOf = (t) => { const f = F[t[0]]; const [k, d, ic, n, b, r] = t; return { k, d, ic: f ? f.ic : ic, n: f ? f.n.split('/').pop() : n, b: f ? f.b : b, r: f ? f.role : r }; };
    const draw = () => {
      Object.entries(btns).forEach(([k, b]) => b.classList.toggle('on', k === cur));
      const f = F[cur];
      if (!f) { codeBox.replaceChildren(h('div', { class: 'vi-scr', style: { minHeight: 0 } }, h('div', { style: { fontSize: '2rem' } }, TREE.find((t) => t[0] === cur)[2]), h('b', TREE.find((t) => t[0] === cur)[3]), h('div', NOCODE[cur]))); if (cur === 'nm') codeBox.append(code('node_modules', 'text', { color: C, file: '.gitignore' })); links.replaceChildren(); info.replaceChildren(); [...map.querySelectorAll('.ve-mn')].forEach((m) => m.classList.remove('on')); return; }
      const pre = code(f.src, f.lang, { color: C, file: f.n, dim: true });
      f.marks.forEach((m, i) => pre.setHi(src(f.src, m), 'h' + (i + 1)));
      const IMP = { './App.vue': 'app', './router': 'router', '../views/CaseListView.vue': 'list', '../components/CaseCard.vue': 'card' };
      const MAP = {}; Object.keys(IMP).forEach((k) => { MAP[k] = [F[IMP[k]].n, F[IMP[k]].src]; });
      if (K.linkFiles) K.linkFiles(pre, MAP, (k) => { cur = IMP[k]; draw(); });
      codeBox.replaceChildren(pre); const lc = K.linkChips && K.linkChips(pre, MAP, (k) => { cur = IMP[k]; draw(); }); if (lc) codeBox.append(lc);
      links.replaceChildren(h('span', { class: 'vi-lb' }, 'つながり：'), ...f.links.map(([to, lab, ci]) => h('span', { class: 've-lk', style: { '--n': COL[ci] }, onmouseenter: () => btns[to] && btns[to].classList.add('glow'), onmouseleave: () => btns[to] && btns[to].classList.remove('glow'), onclick: () => { cur = to; draw(); } }, '➜ ' + F[to].n.split('/').pop() + '　', h('small', { style: { color: 'var(--mute)', fontWeight: 700 } }, lab))));
      if (!f.links.length) links.append(h('span', { class: 'vi-lb' }, '（他のファイルから使われる側）'));
      info.replaceChildren(h('small', f.n), h('b', f.b + ' ' + BADGE[f.b] + '　／　' + f.role));
      [...map.querySelectorAll('.ve-mn')].forEach((m) => m.classList.toggle('on', m.dataset.k === cur));
    };
    const src = (text, keys) => { const o = []; text.split('\n').forEach((l, i) => { if (keys.some((k) => l.includes(k))) o.push(i + 1); }); return o; };
    TREE.forEach((t) => { const r = rowOf(t); const b = h('button', { class: 've-it', style: { paddingLeft: (r.d * 16 + 8) + 'px' }, onclick: () => { cur = t[0]; draw(); } }, r.ic + ' ' + r.n, r.b ? h('small', r.b + ' ' + (BADGE[r.b] || '')) : null); btns[t[0]] = b; tree.append(b); });
    FLOW.forEach(([k, lab], i) => { map.append(h('button', { class: 've-mn', 'data-k': k, onclick: () => { cur = k; draw(); } }, lab, h('small', F[k].n.split('/').pop())), i < FLOW.length - 1 ? h('span', { style: { color: 'var(--mute)', fontWeight: 900 } }, '➜') : null); });
    const run = async () => { const my = ++play; for (const [k] of FLOW) { if (my !== play) return; cur = k; draw(); btns[k].classList.add('glow'); await sleep(1300); btns[k].classList.remove('glow'); } };
    draw();
    return h('div', { style: { display: 'grid', gap: '12px' } },
      h('div', { class: 'vi-panel' }, h('div', { class: 'vi-row', style: { justifyContent: 'space-between' } }, lbl('起動の地図：ファイルは、この順につながって動く（押すとそのファイルへ）'), h('button', { class: 'btn primary', style: { '--c': C }, onclick: run }, '▶ 起動の流れを見る')), map),
      h('div', { class: 've-grid' },
        h('div', { class: 'vi-panel' }, lbl('フォルダ（押して選ぶ）'), tree, h('div', { class: 'vi-row' }, ...['✏️ よく編集', '👀 たまに', '🚫 触らない'].map((t) => h('span', { class: 'vi-lb' }, t)))),
        h('div', { class: 'vi-panel' }, lbl('ファイルの中身（色の付いた行が、他のファイルとつながる所）'), info, codeBox, links)));
  }

  /* ===================== 開発サーバーと HMR ===================== */
  function hmrScene() {
    const STEPS = [['💾', '保存する'], ['👀', 'Vite が変更を見つける'], ['📦', '変えたファイルだけ送る'], ['🔁', 'ブラウザが差し替える']];
    let msg = 'こんにちは', busy = false;
    const srcOf = () => `<script setup lang="ts">\nimport { ref } from 'vue'\n\nconst count = ref(0)\n</script>\n\n<template>\n  <h1>${msg}、相談ナビ</h1>\n  <input placeholder="件名を入力" />\n  <button @click="count++">+1 ({{ count }})</button>\n</template>`;
    const codeHost = h('div'), sp = h('div', { class: 've-st' });
    const mkBrowser = (ttl, cls) => { const h1 = h('h1', { style: { margin: 0, fontSize: '1.1rem' } }), inp = h('input', { placeholder: '件名を入力', style: { padding: '.4em .6em', borderRadius: '6px', border: '1px solid #99a' } }), btn = h('button', { style: { padding: '.4em .9em', borderRadius: '6px', border: '1px solid #99a', cursor: 'pointer', justifySelf: 'start' } }); let n = 0; const paint = () => { h1.textContent = msg + '、相談ナビ'; btn.textContent = '+1 (' + n + ')'; }; btn.onclick = () => { n++; paint(); }; const pg = h('div', { class: 'pg' }, h1, inp, btn); paint(); const el = h('div', { class: 've-bw ' + cls }, h('div', { class: 'bar' }, h('i'), h('i'), h('i'), ttl), pg); return { el, pg, h1, inp, btn, get n() { return n; }, set n(v) { n = v; }, paint }; };
    const A = mkBrowser('localhost:5173 ✖ ページ全体を読み込み直す', 'rl'), B = mkBrowser('localhost:5173 ✓ 変えた所だけ差し替える（HMR）', 'hm');
    const log = h('div', { class: 'vi-msg w' }, '① 両方の入力欄に何か打ち、+1 を押す　② 「保存」を押して、違いを見よう');
    const draw = () => { codeHost.replaceChildren(code(srcOf(), 'vue', { color: C, file: 'App.vue', dim: true, hi: [8] })); sp.replaceChildren(...STEPS.map(([e, t]) => h('span', { class: 've-sp' }, e + ' ' + t))); };
    draw();
    const save = async () => {
      if (busy) return; busy = true; msg = msg === 'こんにちは' ? 'ようこそ' : 'こんにちは'; draw();
      const chips = [...sp.children];
      for (let i = 0; i < chips.length; i++) { chips.forEach((c, j) => c.classList.toggle('on', j === i)); await sleep(650); }
      /* 左：全部読み込み直し（入力・カウンタは消える） */
      A.pg.classList.add('blank'); A.pg.style.opacity = '.1'; await sleep(450); A.n = 0; A.inp.value = ''; A.paint(); A.pg.style.opacity = '1'; A.pg.classList.remove('blank');
      /* 右：見出しだけ差し替え（入力・カウンタは残る） */
      B.h1.textContent = msg + '、相談ナビ'; B.h1.animate([{ background: '#cdf5e6' }, { background: 'transparent' }], { duration: 900 });
      log.className = 'vi-msg ok'; log.textContent = '左：入力もカウントも消えた（全部読み込み直し）／ 右：見出しだけ変わって、入力もカウントはそのまま ＝ HMR';
      chips.forEach((c) => c.classList.remove('on')); busy = false;
    };
    const reset = () => { msg = 'こんにちは'; [A, B].forEach((b) => { b.n = 0; b.inp.value = ''; b.paint(); }); log.className = 'vi-msg w'; log.textContent = '① 両方の入力欄に何か打ち、+1 を押す　② 「保存」を押して、違いを見よう'; draw(); };
    return h('div', { style: { display: 'grid', gap: '12px' } },
      h('div', { class: 'vi-panel' }, lbl('HMR とは？　Hot Module Replacement（ホット・モジュール・リプレースメント）'), h('div', { class: 'vi-row' }, ...[['Hot', '動いたまま', 'var(--pink)'], ['Module', '変えたファイル', 'var(--ts)'], ['Replacement', '差し替え', 'var(--team)']].map(([a, b, c]) => h('span', { class: 'vi-chip', style: { '--cc': c } }, h('b', a), '＝ ' + b))), h('div', { class: 'vi-msg w' }, '＝ ページを開いたまま、変えたファイルの所だけが入れ替わる仕組み。保存した瞬間に画面が変わる')),
      h('div', { class: 'vi-eq' },
        h('div', { class: 'vi-panel' }, lbl('① コードを書き換えて「保存」（npm run dev の間は、Vite が見張っている）'), codeHost, h('div', { class: 'vi-row' }, h('button', { class: 'btn primary', style: { '--c': C }, onclick: save }, '💾 保存する（見出しを書き換える）'), h('button', { class: 'btn', onclick: reset }, '↺ 最初から')), sp),
        h('div', { class: 'vi-panel' }, lbl('② ブラウザの画面を比べる（先に入力・＋1 をしてから保存）'), A.el, B.el)),
      log,
      h('div', { class: 'vi-eq' }, h('div', { class: 'vc-do' }, h('b', '✓ HMR があると'), h('small', '入力途中の文字・開いたメニュー・カウンタが消えない。直してすぐ確認できる')), h('div', { class: 'vc-dont' }, h('b', '✖ 毎回リロードだと'), h('small', '直すたびに入力し直し・画面を開き直し。時間がどんどん溶ける'))));
  }

  const L = K.lessons['vue-env'];
  L.scenes.forEach((s) => {
    if (s.t === 'フォルダ探索') { s.tag = 'FILES'; s.lead = '<b>起動の地図</b>でファイルのつながりを見て、<b>色付きの行</b>で「どこが他のファイルとつながるか」を確かめよう。'; s.render = (el) => { el.append(folderScene()); }; s.ref = undefined; }
    if (s.t === '開発サーバーとHMR') { s.t = '開発サーバーと自動更新（HMR）'; s.tag = 'HMR'; s.lead = '<b>保存した瞬間に、画面が変わる</b>。この仕組みが HMR。リロードとの違いを体験しよう。'; s.render = (el) => { el.append(hmrScene()); }; }
  });
})();
