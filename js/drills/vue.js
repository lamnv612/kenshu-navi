/* 各シーンの練習（Vue 系）: KENSHU.drills[lessonId][シーン名] = { mode, files, libs, tasks, solution } */
(function () {
  const K = window.KENSHU;
  const D = (K.drills = K.drills || {});
  const VUE = 'https://unpkg.com/vue@3.4.27/dist/vue.global.prod.js';
  const VROUTER = 'https://unpkg.com/vue-router@4.3.2/dist/vue-router.global.prod.js';

  const appText = (c) => { const d = c.doc && c.doc(); const a = d && d.querySelector('#app'); return a ? a.textContent.replace(/\s+/g, ' ').trim() : ''; };
  const $q = (c, s) => { const d = c.doc && c.doc(); return d ? d.querySelector(s) : null; };
  const $all = (c, s) => { const d = c.doc && c.doc(); return d ? [...d.querySelectorAll(s)] : []; };
  /* 旧形式の書き方（index.html ＋ main.js）を、出題は .vue ファイルに直して出す */
  const VT = K.vueTools;
  const web = (html, js, sol, tasks, o) => Object.assign({ mode: 'web', sfc: true, libs: [VUE], height: 260,
    files: [{ name: 'App.vue', lang: 'vue', code: VT.toSfc({ 'index.html': html, 'main.js': js }) }],
    solution: { 'App.vue': VT.toSfc(sol) }, tasks: (v, c) => tasks(VT.shim(v), c) }, o || {});
  /* Vue を使わない練習（HTML / JavaScript だけ） */
  const plain = (html, js, sol, tasks, o) => Object.assign({ mode: 'web', libs: [], height: 260,
    files: [{ name: 'index.html', lang: 'html', code: html }, { name: 'main.js', lang: 'js', code: js }], solution: sol, tasks }, o || {});
  /* 複数の .vue（親・子）や router.ts で出す練習。files = { ファイル名: 中身 } */
  const multi = (files, sol, tasks, o) => Object.assign({ mode: 'web', sfc: true, libs: [VUE], height: 280,
    files: Object.keys(files).map((n) => ({ name: n, lang: /\.vue$/.test(n) ? 'vue' : 'ts', code: files[n] })), solution: sol, tasks }, o || {});
  const text = (name, lang, code, note, sol, tasks) => ({ mode: 'text', height: 240, files: [{ name, lang, code }], note, solution: sol, tasks });
  const lines = (s) => s.split('\n').map((x) => x.trim()).filter((x) => x && !x.startsWith('#'));
  /* ヒントに <button> のようなタグが入っていても、そのまま見えるように（<code> などの装飾が無い文字は escape して code 表示） */
  const fixHint = (t) => (typeof t !== 'string' || /<(code|b|br|small|i|kbd)\b/.test(t) ? t : (/^[\x20-\x7E\n]+$/.test(t) && /[<>@=(){}.;]/.test(t) ? { code: t, lang: /<|@|v-/.test(t) ? 'vue' : 'ts' } : t));
  const T = (label, level, ok, hint, at) => ({ level, label, ok: !!ok, hint: [].concat(hint || []).map(fixHint), at: at || null });
  const lastIdx = (ls, re) => { for (let i = ls.length - 1; i >= 0; i--) if (re.test(ls[i])) return i; return -1; };

  const HEAD = "const { createApp, ref } = Vue;\n";
  const MOUNT = "\n} }).mount('#app');";

  /* ===================== vue-intro ===================== */
  D['vue-intro'] = {
    'データを変えるだけ': web(
      '<div id="app">\n  <p>残り {{ slots }} 枠</p>\n  <!-- ② ここに「予約」ボタンを足す -->\n</div>',
      HEAD + "createApp({ setup() {\n  const slots = ref(10); // ① 3 に変える（残り 3 枠）\n  return { slots };" + MOUNT,
      { 'index.html': '<div id="app">\n  <p>残り {{ slots }} 枠</p>\n  <button @click="slots--" :disabled="slots === 0">予約</button>\n</div>', 'main.js': HEAD + "createApp({ setup() {\n  const slots = ref(3);\n  return { slots };" + MOUNT },
      (v, c) => [
        T('slots を 3 にして、画面を「残り 3 枠」にする', 1, /残り\s*3\s*枠/.test(appText(c)), ['データ（ref の中の数字）を変えるだけ。画面は自動で変わります。']),
        T('「予約」ボタンを作り、押すと slots が 1 減る（@click）', 2, $q(c, '#app button') && /@click|v-on:click/.test(v['index.html']) && /(slots\s*--|slots\s*-=\s*1|slots\s*=\s*slots\s*-\s*1)/.test(v['index.html'] + v['main.js']), ['<button @click="slots--">予約</button>']),
      ]),
    'リアクティブの仕組み': web(
      '<div id="app">\n  <p>未読 {{ unread }} 件</p>\n  <!-- ② 「すべて既読」ボタンを足して、unread を 0 にしよう -->\n</div>',
      HEAD + "createApp({ setup() {\n  let unread = 3; // ① ref にしないと、値が変わっても画面は変わらない\n  return { unread };" + MOUNT,
      { 'index.html': '<div id="app">\n  <p>未読 {{ unread }} 件</p>\n  <button @click="readAll">すべて既読</button>\n</div>', 'main.js': HEAD + "createApp({ setup() {\n  const unread = ref(3);\n  const readAll = () => { unread.value = 0; };\n  return { unread, readAll };" + MOUNT },
      (v) => [
        T('unread を ref にする（リアクティブな値にする）', 1, /unread\s*=\s*ref\s*\(/.test(v['main.js']), ['const unread = ref(3)']),
        T('ボタンを押すと unread が 0 になる（script では .value を付けて代入）', 2, /@click|v-on:click/.test(v['index.html']) && /unread\.value\s*=/.test(v['main.js']), ['unread.value = 0']),
      ]),
    '.vue ファイルの解剖': text('FavoriteButton.vue', 'html',
      "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nconst likes = ref(0)\n</script>\n\n",
      '<b>.vue は 3つの箱</b><br>script（動き）／ template（形）／ style（見た目）。<br>足りない箱を書き足そう。（お気に入りボタン部品）',
      "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nconst likes = ref(0)\n</script>\n\n<template>\n  <button>お気に入り {{ likes }}</button>\n</template>\n\n<style scoped>\nbutton { color: tomato; }\n</style>\n",
      (v) => { const s = v['FavoriteButton.vue']; return [
        T('template を書き、{{ likes }} を表示する', 1, /<template>[\s\S]*\{\{\s*likes\s*\}\}[\s\S]*<\/template>/.test(s), ['<template><button>お気に入り {{ likes }}</button></template>']),
        T('style scoped を書き、button の色を決める', 2, /<style[^>]*scoped[^>]*>[\s\S]*button\s*\{[^}]*color\s*:[^}]+\}[\s\S]*<\/style>/.test(s), ['<style scoped>\nbutton { color: tomato; }\n</style>']),
        T('3つの箱の順番は script → template → style（上から）', 3, (() => { const a = s.indexOf('<script'), b = s.indexOf('<template'), c = s.indexOf('<style'); return a >= 0 && b > a && c > b; })(), ['script / template / style の順に並べる']),
      ]; }),
    'Options API と Composition API': multi({ 'App.vue': "<script lang=\"ts\">\n// Options API で書かれている。<script setup>（Composition API）に書き直そう\nexport default {\n  data() {\n    return { likes: 0, title: '相談予約' }\n  },\n}\n</script>\n\n<template>\n  <p>{{ title }}</p>\n  <p>お気に入り: {{ likes }}</p>\n  <button @click=\"likes++\">お気に入り</button>\n</template>\n" },
      { 'App.vue': "<script setup lang=\"ts\">\nimport { ref } from 'vue'\n\nconst likes = ref(0)\nconst title = ref('相談予約')\nconst addLike = (): void => {\n  likes.value++\n}\n</script>\n\n<template>\n  <p>{{ title }}</p>\n  <p>お気に入り: {{ likes }}</p>\n  <button @click=\"addLike\">お気に入り</button>\n</template>\n" },
      (v, c) => { const f = v['App.vue']; return [
        T('data() をやめて <script setup> + ref で書き直す（画面は同じまま）', 1, /<script[^>]*\bsetup\b/.test(f) && /ref\s*\(/.test(f) && !/\bdata\s*\(/.test(f) && !/export\s+default/.test(f) && /お気に入り:\s*0/.test(appText(c)) && /相談予約/.test(appText(c)), ["<script setup lang=\"ts\">\nimport { ref } from 'vue'\nconst likes = ref(0)\nconst title = ref('相談予約')\n</script>"]),
        T('addLike 関数を作り、ボタンの @click から呼ぶ（.value を使う）', 2, /@click\s*=\s*["']addLike(\(\))?["']/.test(f) && /addLike[\s\S]{0,60}likes\.value/.test(f), ['const addLike = () => { likes.value++ }', '<button @click="addLike">']),
      ]; }),
  };

  /* ===================== vue-env ===================== */
  D['vue-env'] = {
    'プロジェクトを作る': text('commands.sh', 'sh', '# 1行に1コマンド。プロジェクト名は consult-app にしよう\n',
      '<b>やること</b><br>作る → フォルダに入る → 部品を入れる → 起動。<br>順番どおりに書く。',
      'npm create vue@latest\ncd consult-app\nnpm install\nnpm run dev',
      (v) => { const L = lines(v['commands.sh']); const a = L.findIndex((x) => /^npm\s+create\s+vue(@latest)?(\s|$)/.test(x)); const b = L.findIndex((x, i) => i > a && /^cd\s+\S+/.test(x)); const c = L.findIndex((x, i) => i > b && /^npm\s+(install|i)$/.test(x)); const d = L.findIndex((x, i) => i > c && /^npm\s+run\s+dev$/.test(x)); return [
        T('Vue のプロジェクトを作る（npm create vue@latest）', 1, a >= 0, ['npm create vue@latest']),
        T('cd でフォルダに入り、npm install のあと npm run dev で起動する（この順）', 2, a >= 0 && b > a && c > b && d > c, ['cd consult-app → npm install → npm run dev']),
      ]; }),
    'フォルダ探索': text('files.md', 'text', '# 「ファイル名: 役割」の形で1行ずつ書こう\n',
      '<b>やること</b><br>フォルダの中の大事なファイルを、1行ずつ説明する。<br>例：<code>main.ts: 〜</code>',
      'src/main.ts: アプリを起動して #app につなぐ\nindex.html: 画面の入れ物（div id="app"）\npackage.json: 使う部品と npm run のコマンドを書く',
      (v) => { const L = lines(v['files.md']); const has = (re) => L.some((x) => re.test(x)); return [
        T('main.ts の役割を書く', 1, has(/^(src\/)?main\.(ts|js)\s*[:：]\s*\S{3,}/), ['main.ts: アプリを起動する']),
        T('index.html の役割を書く', 2, has(/^index\.html\s*[:：]\s*\S{3,}/), ['index.html: 画面の入れ物']),
        T('package.json の役割を書く', 3, has(/^package\.json\s*[:：]\s*\S{3,}/), ['package.json: 部品とコマンドの一覧']),
      ]; }),
    '開発サーバーとHMR': text('commands.sh', 'sh', '# 1行に1コマンド\n# HMR のメモも # で書いてOK\n',
      '<b>HMR</b>＝保存すると、リロードなしで画面が変わる。<br>開発中は <code>dev</code>、公開前は <code>build</code>。',
      '# HMR: 保存するだけで、リロードなしで画面が変わる\nnpm run dev\nnpm run build',
      (v) => { const raw = v['commands.sh']; const L = lines(raw); return [
        T('開発サーバーを起動する（npm run dev）', 1, L.some((x) => /^npm\s+run\s+dev$/.test(x)), ['npm run dev']),
        T('# のコメントで HMR を説明し、本番用に npm run build も書く', 2, /^#.*HMR.*(リロード|再読み込み|更新)/m.test(raw) && L.some((x) => /^npm\s+run\s+build$/.test(x)), ['# HMR: 保存するだけで、リロードなしで画面が変わる', 'npm run build']),
      ]; }),
  };

  /* ===================== vue-basics ===================== */
  D['vue-basics'] = {
    'ref：状態と画面': web(
      '<div id="app">\n  <p>人数: {{ people.value }}名</p>\n  <button @click="add">1名追加</button>\n</div>',
      "const { createApp, ref } = Vue;\ncreateApp({ setup() {\n  let people = 1; // ① ref にする\n  const add = () => { people++; }; // ② .value を付ける\n  return { people, add };" + MOUNT,
      { 'index.html': '<div id="app">\n  <p>人数: {{ people }}名</p>\n  <button @click="add">1名追加</button>\n</div>', 'main.js': "const { createApp, ref } = Vue;\ncreateApp({ setup() {\n  const people = ref(1);\n  const add = () => { people.value++; };\n  return { people, add };" + MOUNT },
      (v, c) => [
        T('people を ref にして、script では people.value で増やす', 1, /people\s*=\s*ref\s*\(/.test(v['main.js']) && /people\.value\s*(\+\+|\+=|=)/.test(v['main.js']), ['const people = ref(1);', 'people.value++']),
        T('template では .value を付けない（画面に「人数: 1名」と出す）', 2, !/\.value/.test(v['index.html']) && /人数:\s*1\s*名/.test(appText(c)), ['{{ people }}']),
      ]),
    'v-if と v-show': web(
      '<div id="app">\n  <button @click="isAdmin = !isAdmin">管理者に切替</button>\n  <button @click="showPrice = !showPrice">料金タブ</button>\n  <p>管理メニュー</p>\n  <p>料金表</p>\n</div>',
      HEAD + "createApp({ setup() {\n  const isAdmin = ref(false);\n  const showPrice = ref(false);\n  return { isAdmin, showPrice };" + MOUNT,
      { 'index.html': '<div id="app">\n  <button @click="isAdmin = !isAdmin">管理者に切替</button>\n  <button @click="showPrice = !showPrice">料金タブ</button>\n  <p v-if="isAdmin">管理メニュー</p>\n  <p v-show="showPrice">料金表</p>\n</div>', 'main.js': HEAD + "createApp({ setup() {\n  const isAdmin = ref(false);\n  const showPrice = ref(false);\n  return { isAdmin, showPrice };" + MOUNT },
      (v, c) => { const hid = $all(c, '#app p').find((p) => p.textContent.includes('料金表')); return [
        T('「管理メニュー」に v-if="isAdmin" を付ける（管理者でないときは DOM から消える）', 1, /v-if\s*=\s*["']isAdmin["']/.test(v['index.html']) && !appText(c).includes('管理メニュー'), ['<p v-if="isAdmin">管理メニュー</p>']),
        T('「料金表」に v-show="showPrice" を付ける（切替が多いタブ。DOM には残り、見えないだけ）', 2, /v-show\s*=\s*["']showPrice["']/.test(v['index.html']) && !!hid && hid.ownerDocument.defaultView.getComputedStyle(hid).display === 'none', ['<p v-show="showPrice">料金表</p>']),
      ]; }),
    'v-model：双方向': web(
      '<div id="app">\n  <input placeholder="件名">\n  <p>{{ title.length }} / 50 文字</p>\n  <!-- ② 同意のチェックボックスを足す -->\n</div>',
      HEAD + "createApp({ setup() {\n  const title = ref('契約書の確認');\n  const agree = ref(false);\n  return { title, agree };" + MOUNT,
      { 'index.html': '<div id="app">\n  <input v-model="title" placeholder="件名">\n  <p>{{ title.length }} / 50 文字</p>\n  <label><input type="checkbox" v-model="agree"> 個人情報の取扱いに同意する</label>\n  <p v-if="agree">送信できます</p>\n</div>', 'main.js': HEAD + "createApp({ setup() {\n  const title = ref('契約書の確認');\n  const agree = ref(false);\n  return { title, agree };" + MOUNT },
      (v, c) => { const inp = $q(c, '#app input'); return [
        T('入力欄に v-model="title" を付ける（最初から「契約書の確認」が入る）', 1, /v-model\s*=\s*["']title["']/.test(v['index.html']) && !!inp && inp.value === '契約書の確認', ['<input v-model="title">']),
        T('チェックボックスに v-model="agree" を付け、同意したら「送信できます」を出す', 2, /<input[^>]*type\s*=\s*["']checkbox["'][^>]*v-model\s*=\s*["']agree["']|<input[^>]*v-model\s*=\s*["']agree["'][^>]*type\s*=\s*["']checkbox["']/.test(v['index.html']) && /v-if\s*=\s*["']agree["']/.test(v['index.html']), ['<input type="checkbox" v-model="agree">', '<p v-if="agree">送信できます</p>']),
      ]; }),
    'イベント処理 @click': web(
      '<div id="app">\n  <p>残り枠: {{ slots }}</p>\n  <button>1枠予約</button>\n  <button>3枠まとめて予約</button>\n</div>',
      HEAD + "createApp({ setup() {\n  const slots = ref(10);\n  // ① 1枠減らす  ② 数字を受け取って減らす関数（引数 n には number 型を付ける）\n  return { slots };" + MOUNT,
      { 'index.html': '<div id="app">\n  <p>残り枠: {{ slots }}</p>\n  <button @click="slots--">1枠予約</button>\n  <button @click="reserve(3)">3枠まとめて予約</button>\n</div>', 'main.js': HEAD + "createApp({ setup() {\n  const slots = ref(10);\n  const reserve = (n: number): void => { slots.value -= n; };\n  return { slots, reserve };" + MOUNT },
      (v) => [
        T('「1枠予約」ボタンを @click で動かし、slots を 1 減らす', 1, /<button[^>]*@click\s*=\s*["'][^"']*(slots\s*--|slots\s*-=\s*1|reserve\w*\(\s*1\s*\)|\w+(\(\))?)["']/.test(v['index.html']) && /(--|-=)/.test(v['index.html'] + v['main.js']), ['<button @click="slots--">1枠予約</button>']),
        T('「3枠まとめて」は、数字を引数で渡す（@click="reserve(3)"）', 2, /@click\s*=\s*["']\w+\(\s*3\s*\)["']/.test(v['index.html']) && /\.value\s*-=\s*\w+/.test(v['main.js']), ['@click="reserve(3)"', 'const reserve = (n) => { slots.value -= n; };']),
        T('引数 n に number 型を付ける（n: number）。型があると、reserve("3") のような間違いが赤線になる', 3, /reserve\s*=\s*\(\s*n\s*:\s*number\s*\)|function\s+reserve\s*\(\s*n\s*:\s*number\s*\)/.test(v['main.js']), ['const reserve = (n: number): void => { slots.value -= n }']),
      ]),
    ':class と v-for': web(
      '<div id="app">\n  <ul>\n    <li>{{ items[0] }}</li>\n  </ul>\n</div>\n<style>.on { color: tomato; font-weight: bold; }</style>',
      HEAD + "createApp({ setup() {\n  // ※ 配列の ref には、中身の型も書く（文字の配列）\n  const items = ref(['労働問題', '契約トラブル', '交通事故']);\n  const selected = ref('契約トラブル');\n  return { items, selected };" + MOUNT,
      { 'index.html': '<div id="app">\n  <ul>\n    <li v-for="item in items" :key="item" :class="{ on: item === selected }" @click="selected = item">{{ item }}</li>\n  </ul>\n</div>\n<style>.on { color: tomato; font-weight: bold; }</style>', 'main.js': HEAD + "createApp({ setup() {\n  const items = ref<string[]>(['労働問題', '契約トラブル', '交通事故']);\n  const selected = ref('契約トラブル');\n  return { items, selected };" + MOUNT },
      (v, c) => [
        T('v-for と :key で、3つの案件を並べる', 1, /v-for\s*=/.test(v['index.html']) && /:key\s*=/.test(v['index.html']) && $all(c, '#app li').length === 3, ['<li v-for="item in items" :key="item">{{ item }}</li>']),
        T(':class で、選ばれている（selected）案件に on クラスを付ける', 2, /:class\s*=\s*["'][^"']*on[^"']*["']/.test(v['index.html']) && $all(c, '#app li.on').length === 1 && ($q(c, '#app li.on') || { textContent: '' }).textContent.trim() === '契約トラブル', [':class="{ on: item === selected }"']),
        T('items に型を付ける（ref<string[]>）。文字の配列だと TypeScript に教える', 3, /ref\s*<\s*string\s*\[\s*\]\s*>\s*\(/.test(v['main.js']), ["const items = ref<string[]>(['労働問題', '契約トラブル', '交通事故'])"]),
      ]),
  };

  /* ===================== vue-comp ===================== */
  const CHILD_HEAD = HEAD;
  D['vue-comp'] = {
    'props：親から子へ': multi({
      'App.vue': "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport CaseCard from './CaseCard.vue'\n\nconst caseTitle = ref('労働問題')\n</script>\n\n<template>\n  <CaseCard />\n</template>\n",
      'CaseCard.vue': "<script setup lang=\"ts\">\n// ① 親から title を受け取る（props）。型も書く: defineProps<{ title: string }>()\n</script>\n\n<template>\n  <p>相談案件: {{ title }}</p>\n</template>\n" },
      { 'App.vue': "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport CaseCard from './CaseCard.vue'\n\nconst caseTitle = ref('労働問題')\n</script>\n\n<template>\n  <CaseCard :title=\"caseTitle\" />\n</template>\n", 'CaseCard.vue': "<script setup lang=\"ts\">\ndefineProps<{ title: string }>()\n</script>\n\n<template>\n  <p>相談案件: {{ title }}</p>\n</template>\n" },
      (v, c) => [
        T('子（CaseCard.vue）に defineProps<{ title: string }>() で title を宣言し（型も書く）、親から渡して「相談案件: ◯◯」と出す', 1, /defineProps\s*<\s*\{[^}]*title\s*:\s*string/.test(v['CaseCard.vue']) && /相談案件:\s*\S+/.test(appText(c)), ['defineProps<{ title: string }>()', '<CaseCard title="契約トラブル" />']),
        T('親のデータ caseTitle を :title で渡す（v-bind）', 2, /<CaseCard[^>]*(:title|v-bind:title)\s*=\s*["']caseTitle["']/.test(v['App.vue']) && /相談案件:\s*労働問題/.test(appText(c)), ['<CaseCard :title="caseTitle" />']),
      ]),
    'emit：子から親へ': multi({
      'App.vue': "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport CaseRow from './CaseRow.vue'\n\nconst count = ref(3)\n</script>\n\n<template>\n  <p>案件数: {{ count }}</p>\n  <CaseRow />\n</template>\n",
      'CaseRow.vue': "<script setup lang=\"ts\">\n// ① 削除が押されたことを、親に知らせる（emit）。型も書く: defineEmits<{ remove: [] }>()\n</script>\n\n<template>\n  <button>削除</button>\n</template>\n" },
      { 'App.vue': "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport CaseRow from './CaseRow.vue'\n\nconst count = ref(3)\n</script>\n\n<template>\n  <p>案件数: {{ count }}</p>\n  <CaseRow @remove=\"count--\" />\n</template>\n", 'CaseRow.vue': "<script setup lang=\"ts\">\nconst emit = defineEmits<{ remove: [] }>()\n</script>\n\n<template>\n  <button @click=\"emit('remove')\">削除</button>\n</template>\n" },
      (v) => [
        T('子（CaseRow.vue）で defineEmits<{ remove: [] }>() と型を書き、削除ボタンを押すと emit(\'remove\') でイベントを出す', 1, /emit\(\s*['"]remove['"]/.test(v['CaseRow.vue']) && /@click|v-on:click/.test(v['CaseRow.vue']) && /defineEmits\s*<[\s\S]*remove/.test(v['CaseRow.vue']), ["const emit = defineEmits<{ remove: [] }>()", "<button @click=\"emit('remove')\">削除</button>"]),
        T('親（App.vue）で @remove を受け取り、count を減らす（消すのは親）', 2, /<CaseRow[^>]*@remove\s*=\s*["'][^"']*count[^"']*["']/.test(v['App.vue']), ['<CaseRow @remove="count--" />']),
      ]),
    'v-model を部品に': multi({
      'App.vue': "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport NameInput from './NameInput.vue'\n\nconst name = ref('')\n</script>\n\n<template>\n  <NameInput />\n  <p>お名前: {{ name }}</p>\n</template>\n",
      'NameInput.vue': "<script setup lang=\"ts\">\n// ① modelValue（string）を受け取る  ② 入力で update:modelValue を出す（どちらも型を書く）\n</script>\n\n<template>\n  <input placeholder=\"お名前\" />\n</template>\n" },
      { 'App.vue': "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport NameInput from './NameInput.vue'\n\nconst name = ref('')\n</script>\n\n<template>\n  <NameInput v-model=\"name\" />\n  <p>お名前: {{ name }}</p>\n</template>\n", 'NameInput.vue': "<script setup lang=\"ts\">\ndefineProps<{ modelValue: string }>()\nconst emit = defineEmits<{ 'update:modelValue': [value: string] }>()\n</script>\n\n<template>\n  <input placeholder=\"お名前\" :value=\"modelValue\" @input=\"emit('update:modelValue', $event.target.value)\" />\n</template>\n" },
      (v) => [
        T('子（NameInput.vue）で modelValue（string）を defineProps<…>() で受け取り、defineEmits<…>() 経由で update:modelValue を emit する', 1, /defineProps\s*<\s*\{[^}]*modelValue\s*:\s*string/.test(v['NameInput.vue']) && /defineEmits\s*</.test(v['NameInput.vue']) && /update:modelValue/.test(v['NameInput.vue']) && /emit\(/.test(v['NameInput.vue']), ['defineProps<{ modelValue: string }>()', "emit('update:modelValue', $event.target.value)"]),
        T('親（App.vue）では、部品に v-model="name" を付ける', 2, /<NameInput[^>]*v-model\s*=\s*["']name["']/.test(v['App.vue']), ['<NameInput v-model="name" />']),
      ]),
    '使い分け：どう渡す？': text('choose.md', 'text',
      '# 場面ごとに props / emit / v-model のどれかを書こう\n案件名を、親から案件カードへ渡す:\nカードの「削除」を、親の案件リストに知らせる:\n氏名の入力欄の値を、親と子で共有する:\n',
      '<b>選び方</b><br>親→子 ＝ props／子→親 ＝ emit／入力欄の共有 ＝ v-model',
      '# 場面ごとに props / emit / v-model のどれかを書こう\n案件名を、親から案件カードへ渡す: props\nカードの「削除」を、親の案件リストに知らせる: emit\n氏名の入力欄の値を、親と子で共有する: v-model\n',
      (v) => { const L = lines(v['choose.md']); const ans = (head) => { const l = L.find((x) => x.startsWith(head)); return l ? l.slice(head.length) : ''; }; return [
        T('案件名を親から子へ渡す → props', 1, /props/i.test(ans('案件名を、親から案件カードへ渡す:')), ['親→子 は props']),
        T('カードの削除を親に知らせる → emit', 2, /emit/i.test(ans('カードの「削除」を、親の案件リストに知らせる:')), ['子→親 は emit']),
        T('氏名の入力欄を共有する → v-model', 3, /v-model/i.test(ans('氏名の入力欄の値を、親と子で共有する:')), ['props + emit のセットを省略できるのが v-model']),
      ]; }),
  };

  /* ===================== vue-life ===================== */
  const LHEAD = "const { createApp, ref, computed, watch, watchEffect, onMounted, onUpdated } = Vue;\n";
  D['vue-life'] = {
    'ライフサイクル': web(
      '<div id="app">\n  <p>{{ msg }}</p>\n  <button @click="n++">再読み込み {{ n }}</button>\n  <p>画面が更新された回数: {{ updates }}</p>\n</div>',
      LHEAD + "createApp({ setup() {\n  const msg = ref('読み込み中');\n  const n = ref(0);\n  const updates = ref(0);\n  // ① onMounted で msg を「取得完了」にする（案件一覧を読み込み終えた）\n  // ② onUpdated で updates を数える\n  return { msg, n, updates };" + MOUNT,
      { 'index.html': '<div id="app">\n  <p>{{ msg }}</p>\n  <button @click="n++">再読み込み {{ n }}</button>\n  <p>画面が更新された回数: {{ updates }}</p>\n</div>', 'main.js': LHEAD + "createApp({ setup() {\n  const msg = ref('読み込み中');\n  const n = ref(0);\n  const updates = ref(0);\n  onMounted(() => { msg.value = '取得完了'; });\n  onUpdated(() => { /* 画面が更新された直後 */ });\n  return { msg, n, updates };" + MOUNT },
      (v, c) => [
        T('onMounted の中で msg を「取得完了」にする（表示された直後に1回）', 1, /onMounted\s*\(/.test(v['main.js']) && /取得完了/.test(appText(c)), ['onMounted(() => { msg.value = \'取得完了\'; });']),
        T('onUpdated を使う（画面が更新された直後に呼ばれる）', 2, /onUpdated\s*\(\s*(\(\s*\)|async\s*\(\s*\)|function\s*\(\s*\))\s*(=>)?\s*\{/.test(v['main.js']), ['onUpdated(() => { ... });']),
      ]),
    'computed：賢い計算': web(
      '<div id="app">\n  <p>小計: {{ price * qty }}</p>\n  <p>税込: {{ price * qty * 1.1 }}</p>\n</div>',
      LHEAD + "createApp({ setup() {\n  const price = ref(1000);\n  const qty = ref(2);\n  // ① total = computed で price × qty\n  // ② withTax = computed で total の 1.1 倍（四捨五入）\n  // ③ computed に、結果の型（数）を付ける\n  return { price, qty };" + MOUNT,
      { 'index.html': '<div id="app">\n  <p>小計: {{ total }}</p>\n  <p>税込: {{ withTax }}</p>\n</div>', 'main.js': LHEAD + "createApp({ setup() {\n  const price = ref(1000);\n  const qty = ref(2);\n  const total = computed<number>(() => price.value * qty.value);\n  const withTax = computed<number>(() => Math.round(total.value * 1.1));\n  return { price, qty, total, withTax };" + MOUNT },
      (v, c) => [
        T('total を computed で作り、{{ total }} で小計 2000 を出す', 1, /total\s*=\s*computed\s*(<[^>]*>)?\s*\(/.test(v['main.js']) && /\{\{\s*total\s*\}\}/.test(v['index.html']) && /小計:\s*2000/.test(appText(c)), ['const total = computed(() => price.value * qty.value);']),
        T('withTax も computed（total を使って 1.1 倍）にして、税込 2200 を出す', 2, (v['main.js'].match(/computed\s*(<[^>]*>)?\s*\(/g) || []).length >= 2 && /withTax[\s\S]{0,80}total\.value/.test(v['main.js']) && /税込:\s*2200/.test(appText(c)), ['const withTax = computed(() => Math.round(total.value * 1.1));']),
        T('computed に結果の型を付ける（computed<number>）。数のはずが文字になると赤線で気づける', 3, /computed\s*<\s*number\s*>\s*\(/.test(v['main.js']), ['const total = computed<number>(() => price.value * qty.value)']),
      ]),
    'watch / watchEffect': web(
      '<div id="app">\n  <input v-model="keyword" placeholder="検索キーワード">\n  <p>{{ log }}</p>\n  <p>表示中: {{ shown }}</p>\n</div>',
      LHEAD + "createApp({ setup() {\n  const keyword = ref('');\n  const log = ref('');\n  const shown = ref('');\n  // ① watch で keyword の変化に反応して log を書く\n  // ② watchEffect で shown = '検索: ' + keyword を自動で作る\n  return { keyword, log, shown };" + MOUNT,
      { 'index.html': '<div id="app">\n  <input v-model="keyword" placeholder="検索キーワード">\n  <p>{{ log }}</p>\n  <p>表示中: {{ shown }}</p>\n</div>', 'main.js': LHEAD + "createApp({ setup() {\n  const keyword = ref('');\n  const log = ref('');\n  const shown = ref('');\n  watch(keyword, (n: string) => { log.value = '検索 API を呼ぶ: ' + n; });\n  watchEffect(() => { shown.value = '検索: ' + keyword.value; });\n  return { keyword, log, shown };" + MOUNT },
      (v, c) => [
        T('watch(keyword, ...) で、keyword が変わったときだけ log を書き換える', 1, /watch\s*\(\s*(keyword\b|\(\s*\)\s*=>\s*keyword\.value)/.test(v['main.js']) && /log\.value\s*=/.test(v['main.js']), ["watch(keyword, (n) => { log.value = '検索 API を呼ぶ: ' + n; });"]),
        T('watchEffect で shown を「検索: ＋ keyword」にする（最初から「表示中: 検索: 」）', 2, /watchEffect\s*\(/.test(v['main.js']) && /表示中:\s*検索:/.test(appText(c)), ["watchEffect(() => { shown.value = '検索: ' + keyword.value; });"]),
        T('watch の引数（新しい値 n）に string 型を付ける（n: string）', 3, /watch\s*\(\s*keyword\s*,\s*\(\s*\w+\s*:\s*string\s*[,)]/.test(v['main.js']), ["watch(keyword, (n: string) => { log.value = '検索 API を呼ぶ: ' + n })"]),
      ]),
    '使い分け：computed / method / watch / フック': text('choose.md', 'text',
      '# computed / method / watch / onMounted のどれかを書こう\n値から計算して表示する（材料が変わった時だけ）:\nボタンを押したときに処理する:\n値が変わったら API を呼ぶなどの副作用:\n画面が表示された直後に1回だけ、初期データを読む:\n',
      '<b>選び方</b><br>計算結果 ＝ computed／操作 ＝ method／変化への反応 ＝ watch／表示直後 ＝ onMounted',
      '# computed / method / watch / onMounted のどれかを書こう\n値から計算して表示する（材料が変わった時だけ）: computed\nボタンを押したときに処理する: method\n値が変わったら API を呼ぶなどの副作用: watch\n画面が表示された直後に1回だけ、初期データを読む: onMounted\n',
      (v) => { const L = lines(v['choose.md']); const ans = (head) => { const l = L.find((x) => x.startsWith(head)); return l ? l.slice(head.length) : ''; }; return [
        T('「計算して表示」は computed、「ボタン処理」は method', 1, /computed/i.test(ans('値から計算して表示する（材料が変わった時だけ）:')) && /method|メソッド|関数/i.test(ans('ボタンを押したときに処理する:')), ['計算結果 → computed', '操作 → method（ふつうの関数）']),
        T('「値の変化で副作用」は watch、「表示直後に1回」は onMounted', 2, /watch/i.test(ans('値が変わったら API を呼ぶなどの副作用:')) && /onMounted|mounted/i.test(ans('画面が表示された直後に1回だけ、初期データを読む:')), ['変化への反応 → watch', '表示直後 → onMounted']),
      ]; }),
  };

  /* ===================== vue-router ===================== */
  const RHEAD = "const { createApp } = Vue;\nconst { createRouter, createMemoryHistory } = VueRouter;\n";
  const rmulti = (files, sol, tasks) => multi(files, sol, tasks, { libs: [VUE, VROUTER], height: 280 });
  const VIEW = (h2) => '<script setup lang="ts">\n</script>\n\n<template>\n  <h3>' + h2 + '</h3>\n</template>\n';
  D['vue-router'] = {
    'URL ↔ コンポーネント': rmulti({
      'router.ts': "import { createRouter, createMemoryHistory } from 'vue-router'\nimport HomeView from './HomeView.vue'\nimport CaseList from './CaseList.vue'\n\nconst router = createRouter({\n  history: createMemoryHistory(),\n  routes: [\n    { path: '/', component: HomeView },\n    // ① /cases のルートを足す\n  ],\n})\n\nexport default router\n",
      'App.vue': "<script setup lang=\"ts\">\n</script>\n\n<template>\n  <nav>\n    <RouterLink to=\"/\">ホーム</RouterLink>\n    <!-- ② 案件一覧へのリンクを足す -->\n  </nav>\n  <RouterView />\n</template>\n",
      'HomeView.vue': VIEW('ホーム'), 'CaseList.vue': VIEW('相談案件の一覧') },
      { 'router.ts': "import { createRouter, createMemoryHistory } from 'vue-router'\nimport HomeView from './HomeView.vue'\nimport CaseList from './CaseList.vue'\n\nconst router = createRouter({\n  history: createMemoryHistory(),\n  routes: [\n    { path: '/', component: HomeView },\n    { path: '/cases', component: CaseList },\n  ],\n})\n\nexport default router\n", 'App.vue': "<script setup lang=\"ts\">\n</script>\n\n<template>\n  <nav>\n    <RouterLink to=\"/\">ホーム</RouterLink>\n    <RouterLink to=\"/cases\">案件一覧</RouterLink>\n  </nav>\n  <RouterView />\n</template>\n" },
      (v, c) => [
        T('router.ts の routes に、/cases と CaseList 部品を結ぶルートを足す', 1, /path\s*:\s*['"]\/cases['"][^}]*component\s*:\s*CaseList/.test(v['router.ts']), ["{ path: '/cases', component: CaseList }"]),
        T('App.vue に、RouterLink で /cases へのリンクを作る', 2, /<RouterLink[^>]*to\s*=\s*["']\/cases["']/.test(v['App.vue']) && !!$q(c, '#app a[href*="/cases"]'), ['<RouterLink to="/cases">案件一覧</RouterLink>']),
      ]),
    '動的ルート /users/:id': rmulti({
      'router.ts': "import { createRouter, createMemoryHistory } from 'vue-router'\nimport HomeView from './HomeView.vue'\nimport CaseDetail from './CaseDetail.vue'\n\nconst router = createRouter({\n  history: createMemoryHistory(),\n  routes: [\n    { path: '/', component: HomeView },\n    // ① /cases/:id のルートを足す\n  ],\n})\n\nexport default router\n",
      'App.vue': "<script setup lang=\"ts\">\n</script>\n\n<template>\n  <nav>\n    <RouterLink to=\"/\">ホーム</RouterLink>\n    <RouterLink to=\"/cases/42\">案件 42</RouterLink>\n  </nav>\n  <RouterView />\n</template>\n",
      'HomeView.vue': VIEW('ホーム'),
      'CaseDetail.vue': "<script setup lang=\"ts\">\nimport { useRoute } from 'vue-router'\n\nconst route = useRoute()\n</script>\n\n<template>\n  <!-- ② id を表示する（route.params.id） -->\n  <p>案件番号: </p>\n</template>\n" },
      { 'router.ts': "import { createRouter, createMemoryHistory } from 'vue-router'\nimport HomeView from './HomeView.vue'\nimport CaseDetail from './CaseDetail.vue'\n\nconst router = createRouter({\n  history: createMemoryHistory(),\n  routes: [\n    { path: '/', component: HomeView },\n    { path: '/cases/:id', component: CaseDetail },\n  ],\n})\n\nexport default router\n", 'CaseDetail.vue': "<script setup lang=\"ts\">\nimport { useRoute } from 'vue-router'\n\nconst route = useRoute()\n</script>\n\n<template>\n  <p>案件番号: {{ route.params.id }}</p>\n</template>\n" },
      (v) => [
        T('router.ts に、/cases/:id のルートを足す（URL の一部を変数にする）', 1, /path\s*:\s*['"]\/cases\/:id['"][^}]*component\s*:\s*CaseDetail/.test(v['router.ts']), ["{ path: '/cases/:id', component: CaseDetail }"]),
        T('CaseDetail.vue で route.params.id を使い、届いた案件番号を表示する', 2, /\{\{\s*(\$route|route)\.params\.id\s*\}\}/.test(v['CaseDetail.vue']), ['{{ route.params.id }}']),
      ]),
    'ナビゲーションガード': rmulti({
      'router.ts': "import { createRouter, createMemoryHistory } from 'vue-router'\nimport HomeView from './HomeView.vue'\nimport AdminView from './AdminView.vue'\nimport LoginView from './LoginView.vue'\n\nconst isLoggedIn = false\n\nconst router = createRouter({\n  history: createMemoryHistory(),\n  routes: [\n    { path: '/', component: HomeView },\n    { path: '/admin', component: AdminView },\n    { path: '/login', component: LoginView },\n  ],\n})\n\n// ここに「関所」を書く\n\nexport default router\n",
      'App.vue': "<script setup lang=\"ts\">\n</script>\n\n<template>\n  <nav>\n    <RouterLink to=\"/\">ホーム</RouterLink>\n    <RouterLink to=\"/admin\">管理画面</RouterLink>\n  </nav>\n  <RouterView />\n</template>\n",
      'HomeView.vue': VIEW('ホーム'), 'AdminView.vue': VIEW('管理画面'), 'LoginView.vue': VIEW('ログインしてください') },
      { 'router.ts': "import { createRouter, createMemoryHistory } from 'vue-router'\nimport HomeView from './HomeView.vue'\nimport AdminView from './AdminView.vue'\nimport LoginView from './LoginView.vue'\n\nconst isLoggedIn = false\n\nconst router = createRouter({\n  history: createMemoryHistory(),\n  routes: [\n    { path: '/', component: HomeView },\n    { path: '/admin', component: AdminView },\n    { path: '/login', component: LoginView },\n  ],\n})\n\nrouter.beforeEach((to) => {\n  if (to.path === '/admin' && !isLoggedIn) return '/login'\n})\n\nexport default router\n" },
      (v) => { const js = v['router.ts']; const i = js.indexOf('router.beforeEach'); const rest = i >= 0 ? js.slice(i) : ''; return [
        T('router.beforeEach で、移動前の「関所」を作る', 1, i >= 0 && /router\.beforeEach\s*\(\s*(\(?\s*\w*\s*(,\s*\w+\s*)*\)?\s*=>|function)/.test(rest), ['router.beforeEach((to) => { ... })']),
        T('ログインしていない（isLoggedIn が false）なら /login へ戻す', 2, i >= 0 && /isLoggedIn/.test(rest) && /['"]\/login['"]/.test(rest) && /return\s*['"]\/login['"]|next\(\s*['"]\/login['"]|path\s*:\s*['"]\/login['"]/.test(rest), ["if (!isLoggedIn) return '/login'"]),
      ]; }),
    '使い分け：RouterLink と push': text('choose.md', 'text',
      '# RouterLink / router.push / router.back のどれかを書こう\n人がクリックして移動するメニューのリンク:\n保存が終わったら、コードで一覧ページへ移動する:\n「戻る」ボタンで1つ前のページへ:\n',
      '<b>選び方</b><br>人が押す ＝ RouterLink／コードが決める ＝ router.push／戻る ＝ router.back',
      '# RouterLink / router.push / router.back のどれかを書こう\n人がクリックして移動するメニューのリンク: RouterLink\n保存が終わったら、コードで一覧ページへ移動する: router.push\n「戻る」ボタンで1つ前のページへ: router.back\n',
      (v) => { const L = lines(v['choose.md']); const ans = (head) => { const l = L.find((x) => x.startsWith(head)); return l ? l.slice(head.length) : ''; }; return [
        T('人が押すメニュー → RouterLink（router-link）', 1, /router-?link/i.test(ans('人がクリックして移動するメニューのリンク:')), ['人が押す → RouterLink']),
        T('コードで移動する → router.push', 2, /push/i.test(ans('保存が終わったら、コードで一覧ページへ移動する:')), ['コードが決める → router.push']),
        T('1つ前のページへ戻る → router.back（または go(-1)）', 3, /back|go\(\s*-1\s*\)/i.test(ans('「戻る」ボタンで1つ前のページへ:')), ['router.back()']),
      ]; }),
  };

  /* ===================== vue-test ===================== */
  D['vue-test'] = {
    'mount → find → trigger → expect': text('LikeButton.test.js', 'js',
      "import { mount } from '@vue/test-utils'\nimport LikeButton from './LikeButton.vue'\n\n// 「いいねボタンを押すと、画面が 1 になる」テストの中身を書こう\nconst wrapper = mount(LikeButton)\n",
      '<b>4つの動き</b><br>mount（作る）→ find（探す）→ trigger（操作）→ expect（確かめる）',
      "import { mount } from '@vue/test-utils'\nimport LikeButton from './LikeButton.vue'\n\nconst wrapper = mount(LikeButton)\nawait wrapper.find('button').trigger('click')\nexpect(wrapper.text()).toContain('1')\n",
      (v) => { const L = lines(v['LikeButton.test.js']); const f = L.findIndex((x) => /wrapper\.find\(\s*['"][^'"]+['"]\s*\)\.trigger\(\s*['"]click['"]\s*\)/.test(x) || /\.find\(.*\)/.test(x)); const t = L.findIndex((x, i) => /\.trigger\(\s*['"]click['"]\s*\)/.test(x)); const e = L.findIndex((x, i) => i > t && /expect\(\s*wrapper\.text\(\)\s*\)\.(toContain|toBe|toEqual)\(/.test(x)); return [
        T('find でボタンを探し、trigger(\'click\') で押す', 1, f >= 0 && t >= 0, ["await wrapper.find('button').trigger('click')"]),
        T('押したあとに expect(wrapper.text()).toContain(\'1\') で確かめる（trigger より後ろ）', 2, t >= 0 && e > t && /await/.test(L[t]), ["expect(wrapper.text()).toContain('1')"]),
      ]; }),
    '確認クイズ': text('LikeButton.test.js', 'js',
      "import { mount } from '@vue/test-utils'\nimport { describe, it, expect } from 'vitest'\nimport LikeButton from './LikeButton.vue'\n\n// it( ... ) の中に、テストをまとめよう\nconst wrapper = mount(LikeButton)\nawait wrapper.find('button').trigger('click')\nexpect(wrapper.text()).toContain('1')\n",
      '<b>テストの形</b><br>describe（グループ）の中に it（1つのテスト）。<br>it の第1引数は「何を確かめるか」の説明。',
      "import { mount } from '@vue/test-utils'\nimport { describe, it, expect } from 'vitest'\nimport LikeButton from './LikeButton.vue'\n\ndescribe('LikeButton', () => {\n  it('押すと いいね が 1 になる', async () => {\n    const wrapper = mount(LikeButton)\n    await wrapper.find('button').trigger('click')\n    expect(wrapper.text()).toContain('1')\n  })\n})\n",
      (v) => { const s = v['LikeButton.test.js']; const m = s.match(/\bit\(\s*['"]([^'"]{3,})['"]\s*,\s*(async\s*)?\(\s*\)\s*=>\s*\{([\s\S]*)\}\s*\)/); return [
        T('it(\'説明\', async () => { ... }) で、テストを1つにまとめる', 1, !!m, ["it('押すと いいね が 1 になる', async () => { ... })"]),
        T('it の中に mount・trigger・expect の3つが入っている（外に出さない）', 2, !!m && /mount\(/.test(m[3]) && /trigger\(/.test(m[3]) && /expect\(/.test(m[3]), ['mount / trigger / expect を { } の中へ移す']),
        T('describe(\'LikeButton\', () => { ... }) で、it をグループにまとめる', 3, !!m && /describe\(\s*['"][^'"]+['"]\s*,\s*\(\s*\)\s*=>\s*\{[\s\S]*\bit\(/.test(s), ["describe('LikeButton', () => { it(...) })"]),
      ]; }),
  };

  /* ===================== qa ===================== */
  D['qa'] = {
    '質問ボード': text('board.md', 'text',
      'Q1 ref と reactive はどう使い分けますか？  +3\nQ2 interface と type の違いは？  +2\n',
      '<b>質問ボード</b><br>同じ質問はもう投稿しない。<b>+1</b> で「私も知りたい」を伝える。<br>新しい質問は Q3 として足す。',
      'Q1 ref と reactive はどう使い分けますか？  +4\nQ2 interface と type の違いは？  +2\nQ3 v-for の key には何を入れればいいですか？\n',
      (v) => { const L = lines(v['board.md']); return [
        T('すでにある Q1 と同じ疑問 → 新規投稿せず、+3 を +4 にする（私も）', 1, L.some((x) => /^Q1\b.*\+4\s*$/.test(x)) && !L.some((x) => /^Q\d+\b.*ref.*reactive/.test(x) && !/^Q1\b/.test(x)), ['Q1 の行の最後を +4 にする']),
        T('自分の新しい質問を Q3 として足す（8文字以上、？で終わる）', 2, L.some((x) => /^Q3\s+\S.{6,}[？?]\s*(\+\d+)?$/.test(x)), ['Q3 v-for の key には何を入れればいいですか？']),
      ]; }),
    'よくある質問': text('FAQ.md', 'text',
      "Q. Cannot find module 'vue'\nA. \n",
      '<b>FAQ の書き方</b><br>Q.（困りごと）と A.（直し方）を1組ずつ。<br>答えは短く、コマンドも書く。',
      "Q. Cannot find module 'vue'\nA. npm install を忘れている。npm install を実行する\nQ. ポートが使用中で起動できない\nA. 別のターミナルで動いている dev サーバーを Ctrl+C で止める\n",
      (v) => { const L = lines(v['FAQ.md']); const a1 = L.find((x) => /^A\.\s*\S/.test(x)); const q2 = L.findIndex((x, i) => i >= 2 && /^Q\.\s*.*(ポート|port)/i.test(x)); return [
        T('「Cannot find module \'vue\'」の答え（A.）に npm install を書く', 1, L.some((x, i) => /^A\./.test(x) && /npm\s+install/.test(x) && i > 0 && /Cannot find module/.test(L[i - 1])), ['A. npm install を実行する']),
        T('「ポートが使用中」の Q. と A. をもう1組足す（A. は4文字以上）', 2, q2 >= 0 && /^A\.\s*\S.{3,}/.test(L[q2 + 1] || ''), ['Q. ポートが使用中', 'A. 別のターミナルを閉じる']),
      ]; }),
    '質問の仕方': text('question.md', 'text',
      '【やったこと】\n\n【期待】\n\n【実際】\n\n',
      '<b>3点セット</b><br>やったこと／期待／実際。<br>「動きません」だけは NG。見出しの下に、1〜2文で書く。',
      '【やったこと】\nnpm run dev を実行して、ブラウザで localhost を開いた\n【期待】\nカウンターの +1 ボタンで数字が増える\n【実際】\nボタンを押しても 0 のまま。Console に Error が出ている\n',
      (v) => { const L = lines(v['question.md']); const sec = (h) => { const i = L.findIndex((x) => x.startsWith(h)); if (i < 0) return ''; const same = L[i].slice(h.length).trim(); if (same) return same; const nx = L[i + 1]; return nx && !/^【/.test(nx) ? nx : ''; }; const a = sec('【やったこと】'), b = sec('【期待】'), c = sec('【実際】'); return [
        T('3つの見出しに、それぞれ4文字以上で書く', 1, a.length >= 4 && b.length >= 4 && c.length >= 4, ['見出しのすぐ下の行に書く']),
        T('【実際】に、起きたことの事実（エラー・表示・数字など）を書く', 2, c.length >= 4 && /Error|エラー|undefined|null|表示|0|動かな|変わらな|出ない|出て/.test(c), ['例: ボタンを押しても 0 のまま。Console に Error が出ている']),
      ]; }),
  };
  /* ===================== 紹介・基礎の冒頭（新シーン）===================== */
  D['vue-intro']['フロントエンドって何？'] = text('flow.txt', 'txt',
    '# 「予約する」を押したときの流れを、正しい順に並べ替えよう（上から順に）\n画面に「予約しました」と表示（フロントエンド）\nデータベースに保存\n「この日時で予約して」とサーバーにお願い（API）\n予約ボタンが押される（フロントエンド）\n「保存できたよ」とサーバーが返事\n',
    '行を上下に入れ替えて、順番を直そう。',
    { 'flow.txt': '予約ボタンが押される（フロントエンド）\n「この日時で予約して」とサーバーにお願い（API）\nデータベースに保存\n「保存できたよ」とサーバーが返事\n画面に「予約しました」と表示（フロントエンド）\n' },
    (v) => { const L = lines(v['flow.txt']); const at = (re) => L.findIndex((x) => re.test(x)); const a = at(/押される/), b = at(/お願い/), c = at(/データベース/), d = at(/返事/), e = at(/表示/); return [
      T('最初は「予約ボタンが押される」', 1, a === 0, ['すべての始まりは、ユーザーの操作（フロントエンド）。']),
      T('「サーバーにお願い」→「データベースに保存」の順', 2, b >= 0 && c > b, ['フロントはデータベースに直接さわらず、サーバー（API）経由で頼む。']),
      T('最後は「返事」→「画面に表示」で終わる', 3, d > c && e > d && e === L.length - 1, ['保存できたと分かってから、画面を更新する。']),
    ]; });
  D['vue-intro']['HTML・CSS・JavaScript'] = plain(
    '<h3>弁護士に相談</h3>\n<button id="btn">予約する</button>\n<!-- ② ここに <style> を書いて、h3 の色を変える -->\n<!-- ③ ここに <p> で説明文を足す -->',
    "// ① ボタンを押したら、文字を「予約しました ✓」に変える\nconst btn = document.getElementById('btn')\n",
    { 'index.html': '<style>h3 { color: teal }</style>\n<h3>弁護士に相談</h3>\n<button id="btn">予約する</button>\n<p>初回は30分無料です。</p>', 'main.js': "const btn = document.getElementById('btn')\nbtn.onclick = () => {\n  btn.textContent = '予約しました ✓'\n}\n" },
    (v, c) => [
      T('① ボタンを押すと「予約しました」に変わる（JavaScript）', 1, (() => { const b = $q(c, '#btn'); if (!b) return false; try { b.click(); } catch (e) { return false; } return /予約しました/.test(b.textContent); })(), ['btn.onclick = () => { btn.textContent = "予約しました ✓" }']),
      T('② <style> で h3 の色を変える（CSS）', 2, /<style[^>]*>[\s\S]*h3[\s\S]*color[\s\S]*<\/style>/.test(v['index.html']), ['<style>h3 { color: teal }</style>']),
      T('③ <p> で説明文を足す（HTML）', 3, !!$q(c, 'p') && $q(c, 'p').textContent.trim().length >= 4, ['<p>初回は30分無料です。</p>']),
    ]);
  D['vue-intro']['フレームワークって？'] = text('choice.md', 'md',
    '# 次の4つは、素の JS と Vue のどちらで作る？（? を「素の JS」か「Vue」に直す）\n会社紹介の1ページ（文字と画像だけ）: ?\nお問い合わせフォーム1つ: ?\n予約の管理画面（一覧・詳細・編集）: ?\n社内ダッシュボード（更新が多く、部品も多い）: ?\n',
    '? を「素の JS」か「Vue」に書き換えよう。',
    { 'choice.md': '会社紹介の1ページ（文字と画像だけ）: 素の JS\nお問い合わせフォーム1つ: 素の JS\n予約の管理画面（一覧・詳細・編集）: Vue\n社内ダッシュボード（更新が多く、部品も多い）: Vue\n' },
    (v) => { const L = lines(v['choice.md']).filter((x) => /:/.test(x)); const ans = (i) => (L[i] || '').split(':').pop(); return [
      T('動きのほとんど無い「会社紹介の1ページ」は、素の JS で十分', 1, /素/.test(ans(0)), ['画面が1つで変化も少ないなら、準備の重い Vue は大げさ。']),
      T('画面が多く、データが何か所にも出る「予約の管理画面」は Vue', 2, /Vue/i.test(ans(2)), ['同じデータが複数の場所に出ると、手で直し忘れが起きる。']),
      T('更新が多く部品も多い「社内ダッシュボード」も Vue', 3, /Vue/i.test(ans(3)), ['自動更新と部品化が効く場面。']),
    ]; });
  D['vue-basics']['Vue の考え方：3ステップ'] = web(
    '<div id="app">\n  <input v-model="name" />\n  <p>こんにちは、{{ name }} さん</p>\n</div>',
    HEAD + "createApp({ setup() {\n  const name = ref('Lam'); // ① 自分の名前に変える\n  return { name };" + MOUNT,
    { 'index.html': '<div id="app">\n  <input v-model="name" />\n  <p>こんにちは、{{ name }} さん</p>\n  <p>文字数：{{ name.length }}</p>\n</div>', 'main.js': HEAD + "createApp({ setup() {\n  const name = ref('田中');\n  return { name };" + MOUNT },
    (v, c) => [
      T('① name の初期値を、自分の名前に変える（データ）', 1, /ref\(\s*['"][^'"]+['"]\s*\)/.test(v['main.js']) && !/ref\(\s*['"]Lam['"]\s*\)/.test(v['main.js']) && /こんにちは、\S+\s*さん/.test(appText(c)), ['ref("Lam") の Lam を書き換える。画面の名前も変わる。']),
      T('② 文字数を表示する <p> を足す（{{ name.length }}）', 2, /\{\{\s*name\.length\s*\}\}/.test(v['index.html']), ['<p>文字数：{{ name.length }}</p>']),
      T('③ 入力欄に打つと、画面の名前も変わる（v-model）', 3, /v-model\s*=\s*["']name["']/.test(v['index.html']), ['<input v-model="name" /> が付いているか確認。']),
    ]);
  D['vue-basics']['ref を1つずつ'] = web(
    '<div id="app">\n  <p>カウント：{{ count }}</p>\n  <button @click="add">+1</button>\n</div>',
    HEAD + "createApp({ setup() {\n  let count = 0;   // ① ref にする\n  function add() {\n    count++;       // ② .value を付ける\n  }\n  return { count, add };" + MOUNT,
    { 'index.html': '<div id="app">\n  <p>カウント：{{ count }}</p>\n  <button @click="add">+1</button>\n  <button @click="reset">リセット</button>\n</div>', 'main.js': HEAD + "createApp({ setup() {\n  const count = ref(0);\n  function add() {\n    count.value++;\n  }\n  function reset() {\n    count.value = 0;\n  }\n  return { count, add, reset };" + MOUNT },
    (v, c) => [
      T('① count を ref(0) にする', 1, /count\s*=\s*ref\s*\(\s*0\s*\)/.test(v['main.js']), ['let count = 0 を const count = ref(0) に。']),
      T('② add の中で count.value++ にして、押すと画面の数が増える', 2, /count\.value\s*(\+\+|\+=\s*1)/.test(v['main.js']), ['script の中は .value を付ける。']),
      T('③ 「リセット」ボタンを足し、count.value = 0 に戻す', 3, /@click\s*=\s*["']reset["']/.test(v['index.html']) && /count\.value\s*=\s*0/.test(v['main.js']), ['function reset() { count.value = 0 } を作り、@click="reset" で呼ぶ。']),
    ]);
  D['vue-basics']['部品に分ける'] = text('parts.md', 'md',
    '# 画面を部品に分けよう（予約一覧ページ）\n# ① 次の画面を、<部品名 /> の形で3つ以上書き出す: ヘッダー / 検索欄 / 相談カード（3枚）/ フッター\n# ② 同じ部品を繰り返すものに ★ を付ける\n',
    '部品名は PascalCase（AppHeader のように大文字始まり）で書く。',
    { 'parts.md': '<AppHeader />\n<SearchBox />\n<CaseCard />  ★ 3枚ぶん使い回す\n<AppFooter />\n' },
    (v) => { const L = lines(v['parts.md']); const comps = L.filter((x) => /<[A-Z][A-Za-z]+\s*\/>/.test(x)); return [
      T('部品を3つ以上、<部品名 /> の形で書く', 1, comps.length >= 3, ['<AppHeader /> のように書く。']),
      T('部品名は大文字で始める（PascalCase）', 2, comps.length >= 3 && comps.every((x) => /<[A-Z]/.test(x)), ['小文字始まり（<header />）は HTML のタグと区別がつかない。']),
      T('繰り返し使う部品に ★ を付ける', 3, L.some((x) => /<[A-Z][A-Za-z]+\s*\/>.*★/.test(x)), ['カードのように何度も出るものが部品向き。']),
    ]; });

  D['vue-comp'] = D['vue-comp'] || {};
  D['vue-comp']['コンポーネントって？'] = multi({
      'App.vue': "<script setup lang=\"ts\">\n// 同じカードを3回コピペしている。デザインを変えるたびに3か所を直すことになる…\n</script>\n\n<template>\n  <div class=\"card\">\n    <h3>離婚の相談</h3>\n    <button>相談する</button>\n  </div>\n  <div class=\"card\">\n    <h3>相続の相談</h3>\n    <button>相談する</button>\n  </div>\n  <div class=\"card\">\n    <h3>労働の相談</h3>\n    <button>相談する</button>\n  </div>\n</template>\n",
      'CaseCard.vue': "<script setup lang=\"ts\">\n// ① 親から title を受け取る（props）。型も書く: defineProps<{ title: string }>()\n</script>\n\n<template>\n  <!-- ② 1枚ぶんのカードを書く（title を表示。ボタンも） -->\n</template>\n" },
      { 'App.vue': "<script setup lang=\"ts\">\nimport { ref } from 'vue'\nimport CaseCard from './CaseCard.vue'\n\nconst titles = ref<string[]>(['離婚の相談', '相続の相談', '労働の相談'])\n</script>\n\n<template>\n  <CaseCard v-for=\"t in titles\" :key=\"t\" :title=\"t\" />\n</template>\n", 'CaseCard.vue': "<script setup lang=\"ts\">\ndefineProps<{ title: string }>()\n</script>\n\n<template>\n  <div class=\"card\">\n    <h3>{{ title }}</h3>\n    <button>相談する</button>\n  </div>\n</template>\n" },
      (v, c) => { const A = v['App.vue'], Cd = v['CaseCard.vue']; return [
        T('① CaseCard.vue に、1枚ぶんのカード（{{ title }} とボタン）を書き、defineProps<{ title: string }>() で title を受け取る', 1, /defineProps\s*<\s*\{[^}]*title\s*:\s*string/.test(Cd) && /\{\{\s*title\s*\}\}/.test(Cd) && /<button/.test(Cd), ['defineProps<{ title: string }>()', '<h3>{{ title }}</h3> と <button> を入れる。']),
        T('② App.vue のコピペ3枚を <CaseCard title="…" /> に置き換える（画面は同じ）', 2, /import\s+CaseCard\s+from\s+['"]\.\/CaseCard\.vue['"]/.test(A) && ((A.match(/<CaseCard\b/g) || []).length >= 3 || /<CaseCard[^>]*v-for/.test(A)) && !/class=["']card["']/.test(A) && /離婚の相談/.test(appText(c)) && /労働の相談/.test(appText(c)), ['import CaseCard from \'./CaseCard.vue\'', '<CaseCard title="離婚の相談" />']),
        T('③ さらに v-for で1行にまとめる（titles: ref<string[]>）', 3, /ref\s*<\s*string\[\]\s*>\s*\(/.test(A) && /<CaseCard[^>]*v-for/.test(A) && /:key\s*=/.test(A) && (A.match(/<CaseCard\b/g) || []).length === 1 && /相続の相談/.test(appText(c)), ['<CaseCard v-for="t in titles" :key="t" :title="t" />']),
      ]; });

  D['vue-basics']['JS の基本：変数と関数'] = text('Basics.vue', 'vue',
    "<script setup lang=\"ts\">\n// ① 変えない値 title を const で宣言（値は '相談ナビ'）\n\n// ② 2倍にする関数 double(n) を作る（アロー関数でも function でもOK）\n\n// ③ cases から、未完了(done が false)だけを取り出して open に入れる\nconst cases = [\n  { title: '離婚の相談', done: false },\n  { title: '労働の相談', done: true },\n]\n</script>\n\n<template>\n  <h1>{{ title }}</h1>\n  <p>21 の2倍は {{ double(21) }}</p>\n  <p>未完了は {{ open.length }} 件</p>\n</template>\n",
    '3つとも、書き方を見ながら埋めてみよう。（template はもう書いてある。script の名前がそのまま使われる）',
    { 'Basics.vue': "<script setup lang=\"ts\">\nconst title = '相談ナビ'\n\nconst double = (n: number): number => n * 2\n\nconst cases = [\n  { title: '離婚の相談', done: false },\n  { title: '労働の相談', done: true },\n]\nconst open = cases.filter((c) => !c.done)\n</script>\n\n<template>\n  <h1>{{ title }}</h1>\n  <p>21 の2倍は {{ double(21) }}</p>\n  <p>未完了は {{ open.length }} 件</p>\n</template>\n" },
    (v) => { const s0 = v['Basics.vue']; return [
      T('① const title = \'相談ナビ\' と書く', 1, /const\s+title\s*=\s*['"`]相談ナビ['"`]/.test(s0), ['変えない値は const。', "const title = '相談ナビ'"]),
      T('② 数を2倍にして返す関数 double を作る', 2, /(function\s+double\s*\(\s*\w+(\s*:\s*\w+)?\s*\)[^{]*\{[\s\S]*return[\s\S]*\*\s*2|const\s+double\s*=\s*\(?\s*\w+(\s*:\s*\w+)?\s*\)?\s*(:\s*\w+\s*)?=>[\s\S]*\*\s*2)/.test(s0), ['const double = (n: number): number => n * 2']),
      T('③ cases.filter で未完了だけ取り出して open に入れる', 3, /const\s+open\s*=\s*cases\s*\.filter\s*\(/.test(s0) && /!\s*\w+\.done|\.done\s*===?\s*false/.test(s0), ['const open = cases.filter((c) => !c.done)']),
    ]; });

  D['vue-basics']['ref と reactive・型（interface）'] = multi({
    'App.vue': "<script setup lang=\"ts\">\nimport { ref } from 'vue'\n\n// ① 案件の形を interface で決める（id: number / title: string / done: boolean）\n\n// ② item を ref<Case> で作る\nconst item = ref({ id: 1, title: '離婚の相談', done: false })\n\n// ③ item の done を true にする関数 finish を作る\n</script>\n\n<template>\n  <p>{{ item.title }}：{{ item.done ? '完了' : '未完了' }}</p>\n  <button @click=\"finish\">完了にする</button>\n</template>\n" },
    { 'App.vue': "<script setup lang=\"ts\">\nimport { ref } from 'vue'\n\ninterface Case {\n  id: number\n  title: string\n  done: boolean\n}\n\nconst item = ref<Case>({ id: 1, title: '離婚の相談', done: false })\n\nfunction finish(): void {\n  item.value.done = true\n}\n</script>\n\n<template>\n  <p>{{ item.title }}：{{ item.done ? '完了' : '未完了' }}</p>\n  <button @click=\"finish\">完了にする</button>\n</template>\n" },
    (v, c) => { const f = v['App.vue']; return [
      T('interface Case で、案件の形（id・title・done とその型）を決める', 1, /interface\s+Case\s*\{[\s\S]*id\s*:\s*number[\s\S]*title\s*:\s*string[\s\S]*done\s*:\s*boolean[\s\S]*\}/.test(f), ['interface Case {\n  id: number\n  title: string\n  done: boolean\n}']),
      T('item を ref<Case>(…) で作る（型を付けた ref）', 2, /ref\s*<\s*Case\s*>\s*\(/.test(f) && /離婚の相談/.test(appText(c)), ["const item = ref<Case>({ id: 1, title: '離婚の相談', done: false })"]),
      T('完了にする関数 finish を作り、item.value.done を true にする（script では .value）', 3, /(function\s+finish|const\s+finish\s*=)[\s\S]*item\.value\.done\s*=\s*true/.test(f), ['function finish(): void {\n  item.value.done = true\n}']),
    ]; }, { height: 300 });

  const AL = {"データを変えるだけ": "SlotCounter.vue", "リアクティブの仕組み": "UnreadBadge.vue", "ref：状態と画面": "PeopleCounter.vue", "v-if と v-show": "AdminMenu.vue", "v-model：双方向": "ConsultForm.vue", "イベント処理 @click": "ReserveButtons.vue", ":class と v-for": "CaseList.vue", "ライフサイクル": "CaseLoader.vue", "computed：賢い計算": "CartTotal.vue", "watch / watchEffect": "KeywordSearch.vue"};
  Object.keys(D).forEach((l) => Object.keys(D[l]).forEach((t) => { const c = D[l][t]; if (AL[t] && c && c.files && c.files.length === 1 && c.files[0].name === 'App.vue') c.alias = { 'App.vue': AL[t] }; }));
  /* 紹介 → 基礎の冒頭へ移したシーンの練習 */
  ['データを変えるだけ', 'リアクティブの仕組み', '.vue ファイルの解剖'].forEach((t) => { if (D['vue-intro'] && D['vue-intro'][t]) { (D['vue-basics'] = D['vue-basics'] || {})[t] = D['vue-intro'][t]; delete D['vue-intro'][t]; } });
  /* HMR の題名を変えたぶん */
  if (D['vue-env'] && D['vue-env']['開発サーバーとHMR']) D['vue-env']['開発サーバーと自動更新（HMR）'] = D['vue-env']['開発サーバーとHMR'];
  /* 追加ファイル（drills/vue-x-*.js）が使う道具 */
  K.vueDrillTools = { web, multi, text, plain, T, appText, $q, $all, lines, VUE, VROUTER, HEAD, MOUNT };
})();
