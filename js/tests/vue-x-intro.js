/* vue-intro のテスト（初級×3・中級×1・上級×1）。K.vueTestTools.web で作る
   ファイル構成：ReservePage.vue（画面）／ components/SoldOut.vue（満席の表示）／ types.ts（型） */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueTestTools) return;
  const { web, nt } = K.vueTestTools;

  const APP = [
    '<script setup lang="ts">',
    "import { ref } from 'vue'",
    "import type { Course } from './types'",
    "import SoldOut from './components/SoldOut.vue'",
    '',
    "const course = ref<Course>({ title: '相談予約', slots: 3 })",
    '',
    '// ⑤ 残り枠が 0 のときは減らない関数 reserve(): void を作る（ボタンはそれを呼び、0 のときは押せなくする）',
    '</script>',
    '',
    '<template>',
    '  <!-- ① course.title を見出しに出す -->',
    '  <h2></h2>',
    '  <p>残り枠：<!-- ② course.slots を出す --></p>',
    '  <!-- ③ 押すと course.slots が 1 つ減るようにする -->',
    '  <button>予約する</button>',
    '  <!-- ④ 残り枠が 0 のときだけ出す -->',
    '  <SoldOut message="満席です" />',
    '</template>',
    '',
  ].join('\n');

  const SOLD = [
    '<script setup lang="ts">',
    'defineProps<{ message: string }>()',
    '</script>',
    '',
    '<template>',
    '  <p class="soldout">{{ message }}</p>',
    '</template>',
    '',
  ].join('\n');

  const TYPES = [
    '// 予約できる講座の形',
    'export interface Course {',
    '  title: string',
    '  slots: number   // 残り枠',
    '}',
    '',
  ].join('\n');

  const RESERVE = [
    'function reserve(): void {',
    '  if (course.value.slots > 0) {',
    '    course.value.slots--',
    '  }',
    '}',
  ].join('\n');

  K.tests['vue-intro'] = web({
    height: 330,
    alias: { 'App.vue': 'ReservePage.vue' },
    paths: { 'App.vue': 'src/App.vue', 'types.ts': 'src/types.ts', 'SoldOut.vue': 'src/components/SoldOut.vue' },
    fileNotes: {
      'App.vue': '画面。データ（course）を持ち、部品を並べる',
      'types.ts': '型。Course の形（title・slots）を決める',
      'SoldOut.vue': '部品。満席のお知らせ（message を受け取る）',
    },
    starter: { 'App.vue': APP, 'SoldOut.vue': SOLD, 'types.ts': TYPES },
    steps: [
      { key: 'm1', level: 1, file: 'App.vue', label: 'h2 に course.title の中身（相談予約）が出る', hint: ['画面に値を出すには、二重の波かっこ <code>{{ }}</code> を使う。', '<code>&lt;h2&gt;{{ course.title }}&lt;/h2&gt;</code>（script では <code>.value</code> が要るが、template では要らない）'], edits: [['  <!-- ① course.title を見出しに出す -->\n  <h2></h2>', '  <h2>{{ course.title }}</h2>']] },
      { key: 'm2', level: 1, file: 'App.vue', label: '「残り枠：3」と、course.slots の数が出る', hint: ['<code>{{ course.slots }}</code> を p の中に書く。', '<code>&lt;p&gt;残り枠：{{ course.slots }}&lt;/p&gt;</code>'], edits: [['<p>残り枠：<!-- ② course.slots を出す --></p>', '<p>残り枠：{{ course.slots }}</p>']] },
      { key: 'm3', level: 1, file: 'App.vue', label: '「予約する」を押すと、残り枠が 3 → 2 と減る', hint: ['クリックは <code>@click</code>。式をそのまま書ける。', '<code>&lt;button @click="course.slots--"&gt;予約する&lt;/button&gt;</code>'], edits: [['  <!-- ③ 押すと course.slots が 1 つ減るようにする -->\n  <button>予約する</button>', '  <button @click="course.slots--">予約する</button>']] },
      { key: 'm4', level: 2, file: 'App.vue', label: '3回予約して残り 0 になったときだけ「満席です」が出る（それまでは出ない）', hint: ['条件で出し分けるのは <code>v-if</code>。部品にも付けられる。', '<code>&lt;SoldOut v-if="course.slots === 0" message="満席です" /&gt;</code>'], edits: [['  <!-- ④ 残り枠が 0 のときだけ出す -->\n  <SoldOut message="満席です" />', '  <SoldOut v-if="course.slots === 0" message="満席です" />']] },
      { key: 'm5', level: 3, file: 'App.vue', label: '残り 0 のあとは押せず、枠が 0 未満にならない（reserve(): void を作る）', hint: ['script に、0 より大きいときだけ減らす関数を作る。戻り値の型は <code>void</code>。', '<code>function reserve(): void {\n  if (course.value.slots > 0) course.value.slots--\n}</code>', 'ボタンは <code>&lt;button :disabled="course.slots === 0" @click="reserve"&gt;</code>'], edits: [['// ⑤ 残り枠が 0 のときは減らない関数 reserve(): void を作る（ボタンはそれを呼び、0 のときは押せなくする）', RESERVE], ['<button @click="course.slots--">予約する</button>', '<button :disabled="course.slots === 0" @click="reserve">予約する</button>']] },
    ],
    probe: async (win, doc) => {
      const out = {};
      const h2 = doc.querySelector('h2');
      out.m1 = !!h2 && h2.textContent.trim() === '相談予約';
      const btn = doc.querySelector('button');
      const num = () => { const q = [...doc.querySelectorAll('p')].find((x) => x.textContent.includes('残り枠')); const m = q && q.textContent.match(/\d+/); return m ? +m[0] : -1; };
      const n0 = num();
      out.m2 = n0 === 3;
      if (btn && !btn.disabled) { btn.click(); await nt(win); }
      const n1 = num();
      out.m3 = n0 === 3 && n1 === 2;
      const has = () => doc.body.textContent.includes('満席です');
      const pre = !has() && n0 === 3;
      for (let i = 0; i < 2 && btn; i++) { btn.click(); await nt(win); }
      out.m4 = pre && n1 === 2 && has() && num() === 0;
      for (let i = 0; i < 3 && btn; i++) { btn.click(); await nt(win); }
      out.m5 = out.m4 && num() === 0 && has() && !!btn && btn.disabled === true;
      return out;
    },
  });
})();
