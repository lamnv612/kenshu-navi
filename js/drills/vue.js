/* 各シーンの練習（Vue 系）: KENSHU.drills[lessonId][シーン名] = { mode, files, libs, tasks, solution } */
(function () {
  const K = window.KENSHU;
  const D = (K.drills = K.drills || {});
  const VUE = 'https://unpkg.com/vue@3.4.27/dist/vue.global.prod.js';
  const VROUTER = 'https://unpkg.com/vue-router@4.3.2/dist/vue-router.global.prod.js';

  const appText = (c) => { const d = c.doc && c.doc(); const a = d && d.querySelector('#app'); return a ? a.textContent.replace(/\s+/g, ' ').trim() : ''; };
  const $q = (c, s) => { const d = c.doc && c.doc(); return d ? d.querySelector(s) : null; };
  const $all = (c, s) => { const d = c.doc && c.doc(); return d ? [...d.querySelectorAll(s)] : []; };
  const web = (html, js, sol, tasks, o) => Object.assign({ mode: 'web', libs: [VUE], height: 260,
    files: [{ name: 'index.html', lang: 'html', code: html }, { name: 'main.js', lang: 'js', code: js }], solution: sol, tasks }, o || {});
  const text = (name, lang, code, note, sol, tasks) => ({ mode: 'text', height: 240, files: [{ name, lang, code }], note, solution: sol, tasks });
  const lines = (s) => s.split('\n').map((x) => x.trim()).filter((x) => x && !x.startsWith('#'));
  const T = (label, level, ok, hint) => ({ level, label, ok: !!ok, hint });
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
      "<script setup>\nimport { ref } from 'vue'\nconst likes = ref(0)\n</script>\n\n",
      '<b>.vue は 3つの箱</b><br>script（動き）／ template（形）／ style（見た目）。<br>足りない箱を書き足そう。（お気に入りボタン部品）',
      "<script setup>\nimport { ref } from 'vue'\nconst likes = ref(0)\n</script>\n\n<template>\n  <button>お気に入り {{ likes }}</button>\n</template>\n\n<style scoped>\nbutton { color: tomato; }\n</style>\n",
      (v) => { const s = v['FavoriteButton.vue']; return [
        T('template を書き、{{ likes }} を表示する', 1, /<template>[\s\S]*\{\{\s*likes\s*\}\}[\s\S]*<\/template>/.test(s), ['<template><button>お気に入り {{ likes }}</button></template>']),
        T('style scoped を書き、button の色を決める', 2, /<style[^>]*scoped[^>]*>[\s\S]*button\s*\{[^}]*color\s*:[^}]+\}[\s\S]*<\/style>/.test(s), ['<style scoped>\nbutton { color: tomato; }\n</style>']),
        T('3つの箱の順番は script → template → style（上から）', 3, (() => { const a = s.indexOf('<script'), b = s.indexOf('<template'), c = s.indexOf('<style'); return a >= 0 && b > a && c > b; })(), ['script / template / style の順に並べる']),
      ]; }),
    'Options API と Composition API': web(
      '<div id="app">\n  <p>{{ title }}</p>\n  <p>お気に入り: {{ likes }}</p>\n  <button @click="likes++">お気に入り</button>\n</div>',
      "const { createApp, ref } = Vue;\n// Options API で書かれている。Composition API（setup）に書き直そう\ncreateApp({\n  data() { return { likes: 0, title: '相談予約' }; }\n}).mount('#app');",
      { 'index.html': '<div id="app">\n  <p>{{ title }}</p>\n  <p>お気に入り: {{ likes }}</p>\n  <button @click="addLike">お気に入り</button>\n</div>', 'main.js': "const { createApp, ref } = Vue;\ncreateApp({\n  setup() {\n    const likes = ref(0);\n    const title = ref('相談予約');\n    const addLike = () => { likes.value++; };\n    return { likes, title, addLike };\n  }\n}).mount('#app');" },
      (v, c) => [
        T('data() をやめて setup() + ref で書き直す（画面は同じまま）', 1, /setup\s*\(/.test(v['main.js']) && /ref\s*\(/.test(v['main.js']) && !/\bdata\s*\(/.test(v['main.js']) && /お気に入り:\s*0/.test(appText(c)) && /相談予約/.test(appText(c)), ["createApp({ setup() { const likes = ref(0); const title = ref('相談予約'); return { likes, title }; } })"]),
        T('addLike 関数を作り、ボタンの @click から呼ぶ（.value を使う）', 2, /@click\s*=\s*["']addLike(\(\))?["']/.test(v['index.html']) && /addLike[\s\S]{0,40}likes\.value/.test(v['main.js']), ['const addLike = () => { likes.value++; };']),
      ]),
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
      HEAD + "createApp({ setup() {\n  const slots = ref(10);\n  // ① 1枠減らす  ② 数字を受け取って減らす関数\n  return { slots };" + MOUNT,
      { 'index.html': '<div id="app">\n  <p>残り枠: {{ slots }}</p>\n  <button @click="slots--">1枠予約</button>\n  <button @click="reserve(3)">3枠まとめて予約</button>\n</div>', 'main.js': HEAD + "createApp({ setup() {\n  const slots = ref(10);\n  const reserve = (n) => { slots.value -= n; };\n  return { slots, reserve };" + MOUNT },
      (v) => [
        T('「1枠予約」ボタンを @click で動かし、slots を 1 減らす', 1, /<button[^>]*@click\s*=\s*["'][^"']*(slots\s*--|slots\s*-=\s*1|reserve\w*\(\s*1\s*\)|\w+(\(\))?)["']/.test(v['index.html']) && /(--|-=)/.test(v['index.html'] + v['main.js']), ['<button @click="slots--">1枠予約</button>']),
        T('「3枠まとめて」は、数字を引数で渡す（@click="reserve(3)"）', 2, /@click\s*=\s*["']\w+\(\s*3\s*\)["']/.test(v['index.html']) && /\.value\s*-=\s*\w+/.test(v['main.js']), ['@click="reserve(3)"', 'const reserve = (n) => { slots.value -= n; };']),
      ]),
    ':class と v-for': web(
      '<div id="app">\n  <ul>\n    <li>{{ items[0] }}</li>\n  </ul>\n</div>\n<style>.on { color: tomato; font-weight: bold; }</style>',
      HEAD + "createApp({ setup() {\n  const items = ref(['労働問題', '契約トラブル', '交通事故']);\n  const selected = ref('契約トラブル');\n  return { items, selected };" + MOUNT,
      { 'index.html': '<div id="app">\n  <ul>\n    <li v-for="item in items" :key="item" :class="{ on: item === selected }" @click="selected = item">{{ item }}</li>\n  </ul>\n</div>\n<style>.on { color: tomato; font-weight: bold; }</style>', 'main.js': HEAD + "createApp({ setup() {\n  const items = ref(['労働問題', '契約トラブル', '交通事故']);\n  const selected = ref('契約トラブル');\n  return { items, selected };" + MOUNT },
      (v, c) => [
        T('v-for と :key で、3つの案件を並べる', 1, /v-for\s*=/.test(v['index.html']) && /:key\s*=/.test(v['index.html']) && $all(c, '#app li').length === 3, ['<li v-for="item in items" :key="item">{{ item }}</li>']),
        T(':class で、選ばれている（selected）案件に on クラスを付ける', 2, /:class\s*=\s*["'][^"']*on[^"']*["']/.test(v['index.html']) && $all(c, '#app li.on').length === 1 && ($q(c, '#app li.on') || { textContent: '' }).textContent.trim() === '契約トラブル', [':class="{ on: item === selected }"']),
      ]),
  };

  /* ===================== vue-comp ===================== */
  const CHILD_HEAD = HEAD;
  D['vue-comp'] = {
    'props：親から子へ': web(
      '<div id="app">\n  <case-card></case-card>\n</div>',
      CHILD_HEAD + "const CaseCard = {\n  template: '<p>相談案件: {{ title }}</p>'\n};\ncreateApp({ components: { CaseCard }, setup() {\n  const caseTitle = ref('労働問題');\n  return { caseTitle };" + MOUNT,
      { 'index.html': '<div id="app">\n  <case-card :title="caseTitle"></case-card>\n</div>', 'main.js': CHILD_HEAD + "const CaseCard = {\n  props: ['title'],\n  template: '<p>相談案件: {{ title }}</p>'\n};\ncreateApp({ components: { CaseCard }, setup() {\n  const caseTitle = ref('労働問題');\n  return { caseTitle };" + MOUNT },
      (v, c) => [
        T('子に props: [\'title\'] を宣言し、親から title を渡して「相談案件: ◯◯」と出す', 1, /props\s*:/.test(v['main.js']) && /相談案件:\s*\S+/.test(appText(c)), ["props: ['title']", '<case-card title="契約トラブル"></case-card>']),
        T('親のデータ caseTitle を :title で渡す（v-bind）', 2, /<case-card[^>]*(:title|v-bind:title)\s*=\s*["']caseTitle["']/.test(v['index.html']) && /相談案件:\s*労働問題/.test(appText(c)), ['<case-card :title="caseTitle"></case-card>']),
      ]),
    'emit：子から親へ': web(
      '<div id="app">\n  <p>案件数: {{ count }}</p>\n  <case-row></case-row>\n</div>',
      CHILD_HEAD + "const CaseRow = {\n  template: '<button>削除</button>'\n};\ncreateApp({ components: { CaseRow }, setup() {\n  const count = ref(3);\n  return { count };" + MOUNT,
      { 'index.html': '<div id="app">\n  <p>案件数: {{ count }}</p>\n  <case-row @remove="count--"></case-row>\n</div>', 'main.js': CHILD_HEAD + "const CaseRow = {\n  emits: ['remove'],\n  template: '<button @click=\"$emit(\\'remove\\')\">削除</button>'\n};\ncreateApp({ components: { CaseRow }, setup() {\n  const count = ref(3);\n  return { count };" + MOUNT },
      (v) => [
        T('子の削除ボタンを押すと、$emit(\'remove\') でイベントを出す', 1, /\$?emit\(\s*(\\)?['"]remove(\\)?['"]/.test(v['main.js']) && /@click|v-on:click/.test(v['main.js']), ["<button @click=\"$emit('remove')\">削除</button>"]),
        T('親で @remove を受け取り、count を減らす（消すのは親）', 2, /<case-row[^>]*@remove\s*=\s*["'][^"']*count[^"']*["']/.test(v['index.html']), ['<case-row @remove="count--"></case-row>']),
      ]),
    'v-model を部品に': web(
      '<div id="app">\n  <name-input></name-input>\n  <p>お名前: {{ name }}</p>\n</div>',
      CHILD_HEAD + "const NameInput = {\n  // ① modelValue を受け取る  ② 入力で update:modelValue を出す\n  template: '<input placeholder=\"お名前\">'\n};\ncreateApp({ components: { NameInput }, setup() {\n  const name = ref('');\n  return { name };" + MOUNT,
      { 'index.html': '<div id="app">\n  <name-input v-model="name"></name-input>\n  <p>お名前: {{ name }}</p>\n</div>', 'main.js': CHILD_HEAD + "const NameInput = {\n  props: ['modelValue'],\n  emits: ['update:modelValue'],\n  template: '<input placeholder=\"お名前\" :value=\"modelValue\" @input=\"$emit(\\'update:modelValue\\', $event.target.value)\">'\n};\ncreateApp({ components: { NameInput }, setup() {\n  const name = ref('');\n  return { name };" + MOUNT },
      (v) => [
        T('子で props: [\'modelValue\'] を受け取り、入力で update:modelValue を emit する', 1, /props\s*:\s*\[\s*['"]modelValue['"]/.test(v['main.js']) && /update:modelValue/.test(v['main.js']) && /\$?emit\(/.test(v['main.js']), ["props: ['modelValue']", "$emit('update:modelValue', $event.target.value)"]),
        T('親では、部品に v-model="name" を付ける', 2, /<name-input[^>]*v-model\s*=\s*["']name["']/.test(v['index.html']), ['<name-input v-model="name"></name-input>']),
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
      LHEAD + "createApp({ setup() {\n  const price = ref(1000);\n  const qty = ref(2);\n  // ① total = computed で price × qty\n  // ② withTax = computed で total の 1.1 倍（四捨五入）\n  return { price, qty };" + MOUNT,
      { 'index.html': '<div id="app">\n  <p>小計: {{ total }}</p>\n  <p>税込: {{ withTax }}</p>\n</div>', 'main.js': LHEAD + "createApp({ setup() {\n  const price = ref(1000);\n  const qty = ref(2);\n  const total = computed(() => price.value * qty.value);\n  const withTax = computed(() => Math.round(total.value * 1.1));\n  return { price, qty, total, withTax };" + MOUNT },
      (v, c) => [
        T('total を computed で作り、{{ total }} で小計 2000 を出す', 1, /total\s*=\s*computed\s*\(/.test(v['main.js']) && /\{\{\s*total\s*\}\}/.test(v['index.html']) && /小計:\s*2000/.test(appText(c)), ['const total = computed(() => price.value * qty.value);']),
        T('withTax も computed（total を使って 1.1 倍）にして、税込 2200 を出す', 2, (v['main.js'].match(/computed\s*\(/g) || []).length >= 2 && /withTax[\s\S]{0,80}total\.value/.test(v['main.js']) && /税込:\s*2200/.test(appText(c)), ['const withTax = computed(() => Math.round(total.value * 1.1));']),
      ]),
    'watch / watchEffect': web(
      '<div id="app">\n  <input v-model="keyword" placeholder="検索キーワード">\n  <p>{{ log }}</p>\n  <p>表示中: {{ shown }}</p>\n</div>',
      LHEAD + "createApp({ setup() {\n  const keyword = ref('');\n  const log = ref('');\n  const shown = ref('');\n  // ① watch で keyword の変化に反応して log を書く\n  // ② watchEffect で shown = '検索: ' + keyword を自動で作る\n  return { keyword, log, shown };" + MOUNT,
      { 'index.html': '<div id="app">\n  <input v-model="keyword" placeholder="検索キーワード">\n  <p>{{ log }}</p>\n  <p>表示中: {{ shown }}</p>\n</div>', 'main.js': LHEAD + "createApp({ setup() {\n  const keyword = ref('');\n  const log = ref('');\n  const shown = ref('');\n  watch(keyword, (n) => { log.value = '検索 API を呼ぶ: ' + n; });\n  watchEffect(() => { shown.value = '検索: ' + keyword.value; });\n  return { keyword, log, shown };" + MOUNT },
      (v, c) => [
        T('watch(keyword, ...) で、keyword が変わったときだけ log を書き換える', 1, /watch\s*\(\s*(keyword\b|\(\s*\)\s*=>\s*keyword\.value)/.test(v['main.js']) && /log\.value\s*=/.test(v['main.js']), ["watch(keyword, (n) => { log.value = '検索 API を呼ぶ: ' + n; });"]),
        T('watchEffect で shown を「検索: ＋ keyword」にする（最初から「表示中: 検索: 」）', 2, /watchEffect\s*\(/.test(v['main.js']) && /表示中:\s*検索:/.test(appText(c)), ["watchEffect(() => { shown.value = '検索: ' + keyword.value; });"]),
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
  const rweb = (html, js, sol, tasks) => web(html, js, sol, tasks, { libs: [VUE, VROUTER], height: 280 });
  D['vue-router'] = {
    'URL ↔ コンポーネント': rweb(
      '<div id="app">\n  <nav>\n    <router-link to="/">ホーム</router-link>\n    <!-- ② 案件一覧へのリンクを足す -->\n  </nav>\n  <router-view></router-view>\n</div>',
      RHEAD + "const Home = { template: '<h3>ホーム</h3>' };\nconst CaseList = { template: '<h3>相談案件の一覧</h3>' };\nconst router = createRouter({\n  history: createMemoryHistory(),\n  routes: [\n    { path: '/', component: Home },\n    // ① /cases のルートを足す\n  ]\n});\ncreateApp({}).use(router).mount('#app');",
      { 'index.html': '<div id="app">\n  <nav>\n    <router-link to="/">ホーム</router-link>\n    <router-link to="/cases">案件一覧</router-link>\n  </nav>\n  <router-view></router-view>\n</div>', 'main.js': RHEAD + "const Home = { template: '<h3>ホーム</h3>' };\nconst CaseList = { template: '<h3>相談案件の一覧</h3>' };\nconst router = createRouter({\n  history: createMemoryHistory(),\n  routes: [\n    { path: '/', component: Home },\n    { path: '/cases', component: CaseList },\n  ]\n});\ncreateApp({}).use(router).mount('#app');" },
      (v, c) => [
        T('routes に、/cases と CaseList 部品を結ぶルートを足す', 1, /path\s*:\s*['"]\/cases['"][^}]*component\s*:\s*CaseList/.test(v['main.js']), ["{ path: '/cases', component: CaseList }"]),
        T('router-link で /cases へのリンクを作る', 2, /<router-link[^>]*to\s*=\s*["']\/cases["']/.test(v['index.html']) && !!$q(c, '#app a[href*="/cases"]'), ['<router-link to="/cases">案件一覧</router-link>']),
      ]),
    '動的ルート /users/:id': rweb(
      '<div id="app">\n  <nav>\n    <router-link to="/">ホーム</router-link>\n    <router-link to="/cases/42">案件 42</router-link>\n  </nav>\n  <router-view></router-view>\n</div>',
      RHEAD + "const Home = { template: '<h3>ホーム</h3>' };\n// ② id を表示する（$route.params.id）\nconst CaseDetail = { template: '<p>案件番号: </p>' };\nconst router = createRouter({\n  history: createMemoryHistory(),\n  routes: [\n    { path: '/', component: Home },\n    // ① /cases/:id のルートを足す\n  ]\n});\ncreateApp({}).use(router).mount('#app');",
      { 'index.html': '<div id="app">\n  <nav>\n    <router-link to="/">ホーム</router-link>\n    <router-link to="/cases/42">案件 42</router-link>\n  </nav>\n  <router-view></router-view>\n</div>', 'main.js': RHEAD + "const Home = { template: '<h3>ホーム</h3>' };\nconst CaseDetail = { template: '<p>案件番号: {{ $route.params.id }}</p>' };\nconst router = createRouter({\n  history: createMemoryHistory(),\n  routes: [\n    { path: '/', component: Home },\n    { path: '/cases/:id', component: CaseDetail },\n  ]\n});\ncreateApp({}).use(router).mount('#app');" },
      (v) => [
        T('/cases/:id のルートを足す（URL の一部を変数にする）', 1, /path\s*:\s*['"]\/cases\/:id['"][^}]*component\s*:\s*CaseDetail/.test(v['main.js']), ["{ path: '/cases/:id', component: CaseDetail }"]),
        T('CaseDetail 部品で $route.params.id を使い、届いた案件番号を表示する', 2, /\{\{\s*\$route\.params\.id\s*\}\}/.test(v['main.js']), ['{{ $route.params.id }}']),
      ]),
    'ナビゲーションガード': rweb(
      '<div id="app">\n  <nav>\n    <router-link to="/">ホーム</router-link>\n    <router-link to="/admin">管理画面</router-link>\n  </nav>\n  <router-view></router-view>\n</div>',
      RHEAD + "const Home = { template: '<h3>ホーム</h3>' };\nconst Admin = { template: '<h3>管理画面</h3>' };\nconst Login = { template: '<h3>ログインしてください</h3>' };\nconst isLoggedIn = false;\nconst router = createRouter({\n  history: createMemoryHistory(),\n  routes: [\n    { path: '/', component: Home },\n    { path: '/admin', component: Admin },\n    { path: '/login', component: Login },\n  ]\n});\n// ここに「関所」を書く\ncreateApp({}).use(router).mount('#app');",
      { 'index.html': '<div id="app">\n  <nav>\n    <router-link to="/">ホーム</router-link>\n    <router-link to="/admin">管理画面</router-link>\n  </nav>\n  <router-view></router-view>\n</div>', 'main.js': RHEAD + "const Home = { template: '<h3>ホーム</h3>' };\nconst Admin = { template: '<h3>管理画面</h3>' };\nconst Login = { template: '<h3>ログインしてください</h3>' };\nconst isLoggedIn = false;\nconst router = createRouter({\n  history: createMemoryHistory(),\n  routes: [\n    { path: '/', component: Home },\n    { path: '/admin', component: Admin },\n    { path: '/login', component: Login },\n  ]\n});\nrouter.beforeEach((to) => {\n  if (to.path === '/admin' && !isLoggedIn) return '/login';\n});\ncreateApp({}).use(router).mount('#app');" },
      (v) => { const js = v['main.js']; const i = js.indexOf('router.beforeEach'); const rest = i >= 0 ? js.slice(i) : ''; return [
        T('router.beforeEach で、移動前の「関所」を作る', 1, i >= 0 && /router\.beforeEach\s*\(\s*(\(?\s*\w*\s*(,\s*\w+\s*)*\)?\s*=>|function)/.test(rest), ['router.beforeEach((to) => { ... });']),
        T('ログインしていない（isLoggedIn が false）なら /login へ戻す', 2, i >= 0 && /isLoggedIn/.test(rest) && /['"]\/login['"]/.test(rest) && /return\s*['"]\/login['"]|next\(\s*['"]\/login['"]|path\s*:\s*['"]\/login['"]/.test(rest), ["if (!isLoggedIn) return '/login';"]),
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
})();
