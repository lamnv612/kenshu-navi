/* 実践テスト：Vue 系（各レッスン 初級 / 中級 / 上級 の3ミッション。コードを書いて、動きで自動チェック） */
(function () {
  const K = window.KENSHU, T = (K.tests = K.tests || {});
  const VUE = K.vueTools.VUE;
  const VROUTER = 'https://unpkg.com/vue-router@4.3.2/dist/vue-router.global.prod.js';
  const nt = async (win, ms) => { await win.Vue.nextTick(); await new Promise((r) => setTimeout(r, ms || 60)); };
  const type = async (win, el, v) => { el.value = v; el.dispatchEvent(new win.Event('input', { bubbles: true })); await nt(win); };
  const langOf = (n) => (n.endsWith('.html') ? 'html' : 'js');

  /* web モード：starter に steps（上級まで積み上げる編集）を当てた状態が「答え」 */
  function web(cfg) {
    const libs = cfg.libs || [VUE];
    const apply = (upto) => {
      const f = Object.assign({}, cfg.starter);
      cfg.steps.slice(0, upto + 1).forEach((s) => s.edits.forEach(([a, b]) => {
        if (!f[s.file].includes(a)) throw new Error('test step: text not found: ' + a);
        f[s.file] = f[s.file].replace(a, b);
      }));
      return f;
    };
    const probe = K.vueTools.makeProbe(cfg.probe, libs);
    return {
      mode: 'web', libs, height: cfg.height || 250,
      files: Object.keys(cfg.starter).map((n) => ({ name: n, lang: langOf(n), code: cfg.starter[n] })),
      solution: apply(cfg.steps.length - 1),
      tasks: (v, c) => {
        const d = c.doc && c.doc();
        const ifr = d && d.defaultView && d.defaultView.frameElement;
        if (ifr) probe.kick(v, ifr);
        const R = probe.res;
        return cfg.steps.map((s, i) => ({ level: s.level, label: s.label, hint: s.hint, ok: !!R[s.key], answer: { code: apply(i)[s.file], lang: langOf(s.file), mode: 'replace' } }));
      },
    };
  }

  /* ---------- vue-intro：データを変えると画面が変わる（予約枠） ---------- */
  T['vue-intro'] = web({
    starter: {
      'index.html': '<div id="app">\n  <!-- ① title を出す -->\n  <h2></h2>\n  <p>残り枠：<!-- ② slots を出す --></p>\n  <button>予約する</button>\n  <!-- ③ slots が 0 のときだけ出す -->\n  <p>満席です</p>\n</div>',
      'main.js': 'const { createApp, ref } = Vue\n\ncreateApp({\n  setup() {\n    const title = ref(\'相談予約\')\n    const slots = ref(3)\n    return { title, slots }\n  },\n}).mount(\'#app\')',
    },
    steps: [
      { key: 'm1', level: 1, file: 'index.html', label: 'h2 に title の中身（相談予約）が出る', hint: ['画面に値を出すには、二重の波かっこ <code>{{ }}</code> を使う。', '<code>&lt;h2&gt;{{ title }}&lt;/h2&gt;</code>'], edits: [['<h2></h2>', '<h2>{{ title }}</h2>']] },
      { key: 'm2', level: 2, file: 'index.html', label: '「予約する」を押すと、残り枠が 3 → 2 と減る', hint: ['残り枠は <code>{{ slots }}</code>。ボタンには <code>@click</code> を付ける。', '<code>&lt;button @click="slots--"&gt;予約する&lt;/button&gt;</code>'], edits: [['<p>残り枠：<!-- ② slots を出す --></p>', '<p>残り枠：{{ slots }}</p>'], ['<button>予約する</button>', '<button @click="slots--">予約する</button>']] },
      { key: 'm3', level: 3, file: 'index.html', label: '3回予約して残り 0 になったときだけ「満席です」が出る（それまでは出ない）', hint: ['条件で出し分けるのは <code>v-if</code>。', '<code>&lt;p v-if="slots === 0"&gt;満席です&lt;/p&gt;</code>'], edits: [['<p>満席です</p>', '<p v-if="slots === 0">満席です</p>']] },
    ],
    probe: async (win, doc) => {
      const out = {};
      const h2 = doc.querySelector('h2');
      out.m1 = !!h2 && h2.textContent.trim() === '相談予約';
      const btn = doc.querySelector('button');
      const num = () => { const q = [...doc.querySelectorAll('p')].find((x) => x.textContent.includes('残り枠')); const m = q && q.textContent.match(/\d+/); return m ? +m[0] : -1; };
      const n0 = num();
      if (btn) { btn.click(); await nt(win); }
      out.m2 = n0 === 3 && num() === 2;
      const has = () => doc.body.textContent.includes('満席です');
      const pre = !has();
      for (let i = 0; i < 2 && btn; i++) { btn.click(); await nt(win); }
      out.m3 = pre && has() && num() === 0;
      return out;
    },
  });

  /* ---------- vue-env：コマンドを書く（text） ---------- */
  T['vue-env'] = {
    mode: 'text', height: 200,
    files: [{ name: 'terminal.sh', lang: 'sh', code: '# ターミナルに打つコマンドを、1行に1つずつ書こう\n' }],
    note: '<b>やること</b><br>Vue のプロジェクトを作って、動かすまでのコマンドを<b>順番どおり</b>に書く。<br>プロジェクト名は <code>consult-app</code> でOK。',
    solution: 'npm create vue@latest consult-app\ncd consult-app\nnpm install\nnpm run dev\nnpm run build',
    tasks: (v) => {
      const L = v['terminal.sh'].split('\n').map((x) => x.trim()).filter((x) => x && !x.startsWith('#'));
      const at = (re, from) => { for (let i = (from == null ? -1 : from) + 1; i < L.length; i++) if (re.test(L[i])) return i; return -1; };
      const a = at(/^npm\s+(create|init)\s+vue(@latest)?(\s+\S+)*$/);
      const b = a < 0 ? -1 : at(/^cd\s+\S+$/, a), c = b < 0 ? -1 : at(/^npm\s+(i|install)$/, b);
      const d = c < 0 ? -1 : at(/^npm\s+run\s+dev$/, c), e = d < 0 ? -1 : at(/^npm\s+run\s+build$/, d);
      return [
        { level: 1, label: 'Vue のプロジェクトを作るコマンド', ok: a >= 0, hint: ['コマンドは npm create で始まる。作るのは vue。', '最新版を使うなら vue@latest。'], answer: { code: 'npm create vue@latest consult-app', lang: 'sh', mode: 'append' } },
        { level: 2, label: 'プロジェクトのフォルダに入って、部品（依存）をインストールする', ok: c >= 0, hint: ['フォルダに入るのは cd。そのあと npm install。', '順番：作る → cd → install。'], answer: { code: 'npm create vue@latest consult-app\ncd consult-app\nnpm install', lang: 'sh' } },
        { level: 3, label: '開発サーバーを起動し、そのあと本番用ファイルを作る（build）', ok: e >= 0, hint: ['開発サーバーは npm run dev。', '本番用ファイルは npm run build。dev のあとに書く。'], answer: { code: 'npm create vue@latest consult-app\ncd consult-app\nnpm install\nnpm run dev\nnpm run build', lang: 'sh' } },
      ];
    },
  };

  /* ---------- vue-basics：v-model / v-if / v-for + :class ---------- */
  T['vue-basics'] = web({
    height: 280,
    starter: {
      'index.html': '<div id="app">\n  <!-- ① 件名欄と title をつなぐ -->\n  <input placeholder="相談の件名">\n  <p>件名：{{ title }}</p>\n  <button @click="showTips = !showTips">入力のコツ</button>\n  <!-- ② showTips が true のときだけ見せる -->\n  <p>具体的な日付や金額を書くと、回答が早くなります</p>\n  <!-- ③ cases を並べ、urgent が true の案件に class="urgent" を付ける -->\n  <ul>\n    <li>（ここを書き換える）</li>\n  </ul>\n</div>\n<style>.urgent{color:#e11;font-weight:700}</style>',
      'main.js': 'const { createApp, ref } = Vue\n\ncreateApp({\n  setup() {\n    const title = ref(\'\')\n    const showTips = ref(false)\n    const cases = ref([\n      { id: 1, title: \'未払い残業代の相談\', urgent: true },\n      { id: 2, title: \'契約書チェックの依頼\', urgent: false },\n      { id: 3, title: \'交通事故の示談\', urgent: true },\n    ])\n    return { title, showTips, cases }\n  },\n}).mount(\'#app\')',
    },
    steps: [
      { key: 'm1', level: 1, file: 'index.html', label: '入力した件名が「件名：◯◯」に出る', hint: ['入力欄とデータをつなぐのは <code>v-model</code>。', '<code>&lt;input v-model="title" placeholder="相談の件名"&gt;</code>'], edits: [['<input placeholder="相談の件名">', '<input v-model="title" placeholder="相談の件名">']] },
      { key: 'm2', level: 2, file: 'index.html', label: '最初は入力のコツが見えず、「入力のコツ」ボタンを押すと出る', hint: ['出したり消したりは <code>v-if</code>（または v-show）。条件は showTips。', '<code>&lt;p v-if="showTips"&gt;具体的な日付や金額を…&lt;/p&gt;</code>'], edits: [['<p>具体的な日付や金額を書くと、回答が早くなります</p>', '<p v-if="showTips">具体的な日付や金額を書くと、回答が早くなります</p>']] },
      { key: 'm3', level: 3, file: 'index.html', label: '相談を3件並べ、急ぎの2件だけ赤くする（v-for + :class）', hint: ['並べるのは <code>v-for="c in cases" :key="c.id"</code>。', '赤くするのは <code>:class="{ urgent: c.urgent }"</code>。'], edits: [['<li>（ここを書き換える）</li>', '<li v-for="c in cases" :key="c.id" :class="{ urgent: c.urgent }">{{ c.title }}</li>']] },
    ],
    probe: async (win, doc) => {
      const out = {};
      const vis = (el) => !!el && win.getComputedStyle(el).display !== 'none';
      const secret = () => [...doc.querySelectorAll('p')].find((x) => x.textContent.includes('具体的な日付'));
      const pre = !vis(secret());
      const inp = doc.querySelector('input');
      if (inp) { await type(win, inp, '契約の相談'); out.m1 = doc.body.textContent.includes('件名：契約の相談'); }
      const btn = doc.querySelector('button');
      if (btn) { btn.click(); await nt(win); }
      out.m2 = pre && vis(secret());
      const lis = [...doc.querySelectorAll('li')];
      const names = lis.map((l) => l.textContent.trim());
      const red = lis.filter((l) => l.classList.contains('urgent')).map((l) => l.textContent.trim());
      out.m3 = names.join(',') === '未払い残業代の相談,契約書チェックの依頼,交通事故の示談' && red.join(',') === '未払い残業代の相談,交通事故の示談';
      return out;
    },
  });

  /* ---------- vue-comp：props / emit / v-model（案件カード。1ファイルで完結） ---------- */
  T['vue-comp'] = web({
    height: 330,
    starter: {
      'index.html': '<div id="app">\n  <p>案件数：{{ count }}</p>\n  <!-- ① title を渡す（労働問題 と 契約トラブル） -->\n  <case-card></case-card>\n  <case-card></case-card>\n  <!-- ② 削除が押されたら count を減らす（@remove） -->\n  <hr>\n  <!-- ③ v-model で name とつなぐ -->\n  <name-input></name-input>\n  <p>お名前：{{ name }}</p>\n</div>\n<script>\nconst CaseCard = {\n  props: [],   // ① title を受け取る\n  template: \'<div><span>{{ title }}</span> <button @click="$emit(\\\'remove\\\')">削除</button></div>\',\n}\nconst NameInput = {\n  props: [],   // ③ modelValue を受け取る\n  template: \'<input :value="modelValue" @input="$emit(\\\'update:modelValue\\\', $event.target.value)">\',\n}\nVue.createApp({\n  components: { CaseCard, NameInput },\n  data: () => ({ count: 2, name: \'たろう\' }),\n}).mount(\'#app\')\n</script>',
    },
    steps: [
      { key: 'm1', level: 1, file: 'index.html', label: '子の部品に title を渡して、カードに「労働問題」「契約トラブル」と出る（props）', hint: ['子は <code>props: [\'title\']</code> で受け取る。', '親は <code>&lt;case-card title="労働問題"&gt;&lt;/case-card&gt;</code> のように渡す。'], edits: [["props: [],   // ① title を受け取る", "props: ['title'],"], ['  <case-card></case-card>\n  <case-card></case-card>', '  <case-card title="労働問題"></case-card>\n  <case-card title="契約トラブル"></case-card>']] },
      { key: 'm2', level: 2, file: 'index.html', label: '「削除」を押すたびに案件数が 2 → 1 → 0 と減る（@remove）', hint: ['子は <code>$emit(\'remove\')</code> で知らせている。親は <code>@remove</code> で受け取る。', '<code>&lt;case-card title="労働問題" @remove="count--"&gt;</code>'], edits: [['<case-card title="労働問題"></case-card>\n  <case-card title="契約トラブル"></case-card>', '<case-card title="労働問題" @remove="count--"></case-card>\n  <case-card title="契約トラブル" @remove="count--"></case-card>']] },
      { key: 'm3', level: 3, file: 'index.html', label: '部品に v-model を使い、入力欄に「たろう」が入り、書き換えると名前も変わる', hint: ['子は <code>props: [\'modelValue\']</code> を受け取る（update:modelValue はもう emit している）。', '親は <code>&lt;name-input v-model="name"&gt;&lt;/name-input&gt;</code>。'], edits: [["props: [],   // ③ modelValue を受け取る", "props: ['modelValue'],"], ['<name-input></name-input>', '<name-input v-model="name"></name-input>']] },
    ],
    probe: async (win, doc) => {
      const out = {};
      const spans = [...doc.querySelectorAll('span')].map((x) => x.textContent.trim());
      out.m1 = spans.length === 2 && spans[0] === '労働問題' && spans[1] === '契約トラブル';
      const btns = [...doc.querySelectorAll('button')];
      const count = () => { const p = [...doc.querySelectorAll('p')].find((x) => x.textContent.includes('案件数')); const m = p && p.textContent.match(/\d+/); return m ? +m[0] : -1; };
      const c0 = count();
      if (btns[0]) { btns[0].click(); await nt(win); }
      const c1 = count();
      if (btns[1]) { btns[1].click(); await nt(win); }
      out.m2 = btns.length === 2 && c0 === 2 && c1 === 1 && count() === 0;
      const inp = doc.querySelector('input');
      const nameP = () => [...doc.querySelectorAll('p')].find((x) => x.textContent.includes('お名前'));
      out.m3 = false;
      if (inp && inp.value === 'たろう') { await type(win, inp, 'はなこ'); out.m3 = !!nameP() && nameP().textContent.includes('はなこ'); }
      return out;
    },
  });

  /* ---------- vue-life：computed / onMounted / watch ---------- */
  T['vue-life'] = web({
    height: 300,
    starter: {
      'index.html': '<div id="app">\n  <p>単価 <input type="number" v-model.number="price" style="width:70px"> 円 × <input type="number" v-model.number="qty" style="width:50px"> 個</p>\n  <h3>合計：{{ total }} 円</h3>\n  <p>{{ msg }}</p>\n  <p>金額の変更：{{ history }} 回</p>\n</div>',
      'main.js': 'const { createApp, ref, computed, watch, onMounted } = Vue\n\ncreateApp({\n  setup() {\n    const price = ref(100)\n    const qty = ref(1)\n    const msg = ref(\'案件を読み込み中…\')\n    const history = ref(0)\n\n    // ① 合計 total を computed で作る（price × qty）\n\n    // ② 表示された直後に、msg を \'取得完了\' にする（onMounted）\n\n    // ③ total が変わるたびに、history を 1 増やす（watch）\n\n    return { price, qty, msg, history }   // total も返す\n  },\n}).mount(\'#app\')',
    },
    steps: [
      { key: 'm1', level: 1, file: 'main.js', label: '合計が自動で計算される（100円 × 1個 = 100、個数を変えると変わる）', hint: ['材料から計算で作る値は <code>computed</code>。', '<code>const total = computed(() =&gt; price.value * qty.value)</code>。return に total を足すのを忘れずに。'], edits: [['    // ① 合計 total を computed で作る（price × qty）\n', '    const total = computed(() => price.value * qty.value)\n'], ['return { price, qty, msg, history }   // total も返す', 'return { price, qty, total, msg, history }']] },
      { key: 'm2', level: 2, file: 'main.js', label: '画面が出た直後に、メッセージが「取得完了」になる（onMounted）', hint: ['表示された直後に1回だけ動かすのは <code>onMounted</code>。', '<code>onMounted(() =&gt; { msg.value = \'取得完了\' })</code>'], edits: [["    // ② 表示された直後に、msg を '取得完了' にする（onMounted）\n", "    onMounted(() => { msg.value = '取得完了' })\n"]] },
      { key: 'm3', level: 3, file: 'main.js', label: '合計が変わるたびに「金額の変更」の回数が 1 ずつ増える（watch）', hint: ['決めた値の変化を見張るのは <code>watch(total, …)</code>。', '<code>watch(total, () =&gt; { history.value++ })</code>'], edits: [['    // ③ total が変わるたびに、history を 1 増やす（watch）\n', '    watch(total, () => { history.value++ })\n']] },
    ],
    probe: async (win, doc) => {
      const out = {};
      const h3 = () => (doc.querySelector('h3') ? doc.querySelector('h3').textContent : '');
      const ps = () => [...doc.querySelectorAll('p')];
      out.m2 = ps().some((p) => p.textContent.includes('取得完了'));
      const first = h3().includes('100');
      const inp = doc.querySelectorAll('input');
      if (inp[1]) await type(win, inp[1], '3');
      const second = h3().includes('300');
      if (inp[0]) await type(win, inp[0], '50');
      const third = h3().includes('150');
      out.m1 = first && second && third;
      const hp = ps().find((p) => p.textContent.includes('金額の変更'));
      const m = hp && hp.textContent.match(/\d+/);
      out.m3 = !!m && +m[0] === 2;
      return out;
    },
  });

  /* ---------- vue-router：ルート定義 / 動的ルート / ガード ---------- */
  T['vue-router'] = web({
    libs: [VUE, VROUTER], height: 320,
    starter: {
      'index.html': '<div id="app">\n  <nav>\n    <router-link to="/">Home</router-link> |\n    <router-link to="/cases/7">案件 7</router-link> |\n    <router-link to="/cases/42">案件 42</router-link> |\n    <router-link to="/admin">管理</router-link>\n  </nav>\n  <router-view></router-view>\n</div>',
      'main.js': 'const Home = { template: \'<h2>Home</h2>\' }\nconst Admin = { template: \'<h2>管理画面</h2>\' }\nconst CaseDetail = {\n  setup() { return { route: VueRouter.useRoute() } },\n  template: \'<h2>案件</h2>\',   // ② URL の id も出す（{{ route.params.id }}）\n}\n\nconst loggedIn = false\n\nconst routes = [\n  { path: \'/\', component: Home },\n  { path: \'/admin\', component: Admin },\n  // ① /cases/:id のルートを足す\n]\n\n// このページの中で動かすので createMemoryHistory を使う\nconst router = VueRouter.createRouter({\n  history: VueRouter.createMemoryHistory(),\n  routes,\n})\n\n// ③ ログインしていないとき、/admin に入れず / に戻す（beforeEach）\n\nVue.createApp({}).use(router).mount(\'#app\')',
    },
    steps: [
      { key: 'm1', level: 1, file: 'main.js', label: '「案件 7」を押すと、案件の画面が出る（/cases/:id）', hint: ['URL の一部を変数にするには、path に <code>:id</code> と書く。', '<code>{ path: \'/cases/:id\', component: CaseDetail }</code> を routes に足す。'], edits: [["  // ① /cases/:id のルートを足す\n", "  { path: '/cases/:id', component: CaseDetail },\n"]] },
      { key: 'm2', level: 2, file: 'main.js', label: '画面に URL の id が出る（7 を押せば 7、42 を押せば 42）', hint: ['今の URL の値は <code>route.params.id</code>。', "template を <code>'&lt;h2&gt;案件 {{ route.params.id }}&lt;/h2&gt;'</code> にする。"], edits: [["template: '<h2>案件</h2>',   // ② URL の id も出す（{{ route.params.id }}）", "template: '<h2>案件 {{ route.params.id }}</h2>',"]] },
      { key: 'm3', level: 3, file: 'main.js', label: 'ログインしていないと「管理」を押しても入れず、Home に戻る（beforeEach）', hint: ['移動の前に動くのは <code>router.beforeEach</code>。', "<code>router.beforeEach((to) =&gt; { if (to.path === '/admin' &amp;&amp; !loggedIn) return '/' })</code>"], edits: [['// ③ ログインしていないとき、/admin に入れず / に戻す（beforeEach）\n', "router.beforeEach((to) => {\n  if (to.path === '/admin' && !loggedIn) return '/'\n})\n"]] },
    ],
    probe: async (win, doc) => {
      const out = {};
      const view = () => ((doc.querySelector('h2') || {}).textContent || '').trim();
      const go = async (href) => { const a = [...doc.querySelectorAll('a')].find((x) => x.getAttribute('href') === href); if (a) { a.click(); await nt(win, 120); } };
      await nt(win, 150);
      await go('/cases/7');
      const v7 = view();
      out.m1 = /案件/.test(v7);
      await go('/cases/42');
      const v42 = view();
      out.m2 = /7/.test(v7) && /42/.test(v42) && !/7/.test(v42);
      await go('/admin');
      out.m3 = view() === 'Home';
      return out;
    },
  });

  /* ---------- vue-test：mount → find → trigger → expect（ts モード） ---------- */
  const TEST_STARTER = '// 本物の @vue/test-utils と同じ流れの、ミニ版です\nfunction mount() {\n  let count = 0\n  return {\n    text: () => `いいね: ${count}`,\n    find: (_selector: string) => ({\n      trigger: (_event: string) => { count++ },\n    }),\n  }\n}\n\nfunction expect(actual: string) {\n  return {\n    toBe(expected: string) {\n      console.log((actual === expected ? \'PASS\' : \'FAIL\') + \' \' + actual)\n    },\n  }\n}\n\n// ① mount して、最初の text が "いいね: 0" になることを確かめる\n\n// ② button を click して、"いいね: 1" になることを確かめる\n\n// ③ 新しく mount して、3回 click したあと "いいね: 3" になることを確かめる\n';
  const S1 = "const w = mount()\nexpect(w.text()).toBe('いいね: 0')\n";
  const S2 = "w.find('button').trigger('click')\nexpect(w.text()).toBe('いいね: 1')\n";
  const S3 = "const w2 = mount()\nfor (let i = 0; i < 3; i++) w2.find('button').trigger('click')\nexpect(w2.text()).toBe('いいね: 3')\n";
  const HEAD = TEST_STARTER.split('// ① ')[0];
  const runTs = (src) => {
    const ts = window.ts; if (!ts) return null;
    const logs = [];
    const con = { log: (...a) => logs.push(a.join(' ')), error: (...a) => logs.push('ERR ' + a.join(' ')) };
    try { const js = ts.transpileModule(src, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.None } }).outputText; new Function('console', js)(con); } catch (e) { logs.push('ERR ' + e); }
    return logs;
  };
  T['vue-test'] = {
    mode: 'ts', height: 330,
    files: [{ name: 'main.ts', lang: 'ts', code: TEST_STARTER }],
    solution: HEAD + S1 + '\n' + S2 + '\n' + S3,
    tasks: (v, c) => {
      const src = v['main.ts'], L = runTs(src) || [];
      const clean = !(c.errors && c.errors.length) && !L.some((l) => /^(FAIL|ERR)/.test(l));
      const has = (s) => L.includes(s);
      const usesExpect = /expect\(\s*\w+\.text\(\)\s*\)\s*\.toBe\(/.test(src);
      return [
        { level: 1, label: 'mount して、最初の text が "いいね: 0" だと expect で確かめる（PASS が出る）', ok: clean && usesExpect && /mount\(\)/.test(src.split('// ①')[1] || src) && has('PASS いいね: 0'), hint: ['まず <code>const w = mount()</code>。', "<code>expect(w.text()).toBe('いいね: 0')</code>"], answer: { code: HEAD + S1, lang: 'ts', mode: 'replace' } },
        { level: 2, label: 'button を click して、"いいね: 1" だと確かめる', ok: clean && usesExpect && /\.find\(\s*['"]button['"]\s*\)\s*\.trigger\(\s*['"]click['"]\s*\)/.test(src) && has('PASS いいね: 1'), hint: ["押す操作は <code>w.find('button').trigger('click')</code>。", "そのあと <code>expect(w.text()).toBe('いいね: 1')</code>。"], answer: { code: HEAD + S1 + '\n' + S2, lang: 'ts', mode: 'replace' } },
        { level: 3, label: '新しく mount して 3回 click し、"いいね: 3" だと確かめる', ok: clean && usesExpect && (src.match(/\.trigger\(/g) || []).length >= 2 && has('PASS いいね: 3'), hint: ['mount し直すと、count は 0 に戻る。for で3回回してもよい。', "<code>for (let i = 0; i &lt; 3; i++) w2.find('button').trigger('click')</code>"], answer: { code: HEAD + S1 + '\n' + S2 + '\n' + S3, lang: 'ts', mode: 'replace' } },
      ];
    },
  };

  /* ---------- qa：良い質問を書く（text） ---------- */
  T['qa'] = {
    mode: 'text', height: 240,
    files: [{ name: 'question.txt', lang: 'text', code: '# 悪い質問：「動きません」\n# これを、答えやすい質問に書き直そう（# で始まる行は無視されます）\n# 例：npm run dev を打ったらエラーが出た、という場面\n\n' }],
    note: '<b>3点セット</b>で書こう。<br>やったこと：何をした？<br>期待 / 実際：どうなるはずが、どうなった？<br>エラー文・試したこと：そのまま貼る。自分で試したことも。<br><small>各行は「項目：内容」の形で書く</small>',
    solution: 'やったこと：npm run dev を実行した\n期待：ブラウザで画面が開くはず\n実際：画面が開かず、ターミナルにエラーが出た\nエラー：Error: Cannot find module \'vue\'\n試したこと：npm install をもう一度やったが、同じだった',
    tasks: (v) => {
      const L = v['question.txt'].split('\n').map((x) => x.trim()).filter((x) => x && !x.startsWith('#'));
      const val = (re) => { const l = L.find((x) => re.test(x)); return l ? l.replace(re, '').trim() : ''; };
      const did = val(/^(やったこと|やったこと|操作|実行したこと)\s*[:：]/);
      const exp = val(/^(期待|期待すること|本当は)\s*[:：]/), act = val(/^(実際|実際の結果|今は)\s*[:：]/);
      const err = val(/^(エラー|エラー文|ログ)\s*[:：]/), tried = val(/^(試したこと|調べたこと|やってみたこと)\s*[:：]/);
      return [
        { level: 1, label: '「やったこと：…」を書く（何をしたか、6文字以上）', ok: did.length >= 6, hint: ['項目名のあとに「：」を付けて書く。', '例：やったこと：npm run dev を実行した'], answer: { code: 'やったこと：npm run dev を実行した', lang: 'text', mode: 'append' } },
        { level: 2, label: '「期待：…」と「実際：…」の両方を書く（どうなるはずが、どうなった）', ok: exp.length >= 4 && act.length >= 4, hint: ['期待は「本当はこうなるはず」、実際は「今はこうなった」。', '例：期待：画面が開くはず / 実際：エラーが出た'], answer: { code: '期待：ブラウザで画面が開くはず\n実際：画面が開かず、ターミナルにエラーが出た', lang: 'text', mode: 'append' } },
        { level: 3, label: '「エラー：…」にエラー文をそのまま（Error など）書き、「試したこと：…」も書く', ok: /error|cannot|not found|failed|undefined|エラー/i.test(err) && err.length >= 8 && tried.length >= 6, hint: ['エラーは自分の言葉にせず、画面に出た文をそのまま写す。', '例：エラー：Error: Cannot find module \'vue\' / 試したこと：npm install をやり直した'], answer: { code: "エラー：Error: Cannot find module 'vue'\n試したこと：npm install をもう一度やったが、同じだった", lang: 'text', mode: 'append' } },
      ];
    },
  };
})();
