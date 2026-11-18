/* vue-life のテスト（初級×3・中級×1・上級×1）。K.vueTestTools.web で作る。
   お題：案件の合計・税込み・取得・絞り込み（CaseSummary.vue ＋ types.ts ＋ api.ts の3ファイル） */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueTestTools) return;
  const { web, nt, type } = K.vueTestTools;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const TYPES = [
    '// 案件1件ぶんの「形」。型だけを置くファイル',
    'export interface Case {',
    '  id: number',
    '  title: string',
    '  price: number',
    '}',
    '',
  ].join('\n');

  const API = [
    "import type { Case } from './types'",
    '',
    '// ニセの API：0.05 秒後に、4件の案件を返す（Promise<Case[]>）',
    'export function fetchCases(): Promise<Case[]> {',
    '  return new Promise((resolve) => {',
    '    setTimeout(() => {',
    '      resolve([',
    "        { id: 1, title: '離婚の相談', price: 3000 },",
    "        { id: 2, title: '相続の相談', price: 5000 },",
    "        { id: 3, title: '労働の相談', price: 2000 },",
    "        { id: 4, title: '交通事故の相談', price: 4000 },",
    '      ])',
    '    }, 50)',
    '  })',
    '}',
    '',
  ].join('\n');

  const APP = [
    '<script setup lang="ts">',
    "import { ref, computed, onMounted, watch, watchEffect } from 'vue'",
    "import type { Case } from './types'",
    "import { fetchCases } from './api'",
    '',
    'const cases = ref<Case[]>([',
    "  { id: 1, title: '離婚の相談', price: 3000 },",
    "  { id: 2, title: '相続の相談', price: 5000 },",
    "  { id: 3, title: '労働の相談', price: 2000 },",
    '])',
    "const status = ref<string>('読み込み中…')",
    'const taxRate = ref<number>(10)',
    "const keyword = ref<string>('')",
    'const changes = ref<number>(0)',
    "const shownText = ref<string>('')",
    '',
    '// ① 合計 total を作る（cases の price をぜんぶ足す）',
    '',
    "// ② 画面が出た直後に、cases を取り寄せたものに入れ替え、status を '取得完了' にする",
    '',
    '// ③ 税込みの金額 totalWithTax を作る（total × (1 + taxRate / 100) を四捨五入）',
    '',
    '// ④ taxRate が変わるたびに、changes を 1 増やす',
    '',
    '// ⑤ keyword で絞り込んだ hits を作り、「◯ 件表示中」を shownText に入れる',
    '</script>',
    '',
    '<template>',
    '  <h3>合計：{{ total }} 円</h3>',
    '  <p>税込み：{{ totalWithTax }} 円（税率 <input type="number" v-model.number="taxRate" /> %）</p>',
    '  <p>{{ status }}</p>',
    '  <input v-model="keyword" placeholder="案件名で絞り込み" />',
    '  <p>{{ shownText }}</p>',
    '  <ul>',
    '    <li v-for="c in cases" :key="c.id">{{ c.title }}：{{ c.price }}円</li>',
    '  </ul>',
    '  <p>税率の変更：{{ changes }} 回</p>',
    '</template>',
    '',
  ].join('\n');

  const rep = (line, code) => [line + '\n', code.join('\n') + '\n'];
  const L1 = '// ① 合計 total を作る（cases の price をぜんぶ足す）';
  const L2 = "// ② 画面が出た直後に、cases を取り寄せたものに入れ替え、status を '取得完了' にする";
  const L3 = '// ③ 税込みの金額 totalWithTax を作る（total × (1 + taxRate / 100) を四捨五入）';
  const L4 = '// ④ taxRate が変わるたびに、changes を 1 増やす';
  const L5 = '// ⑤ keyword で絞り込んだ hits を作り、「◯ 件表示中」を shownText に入れる';

  K.tests['vue-life'] = web({
    height: 420,
    alias: { 'App.vue': 'CaseSummary.vue' },
    fileNotes: {
      'App.vue': '画面と動き（ここを書き換える）',
      'types.ts': '型だけ（Case）',
      'api.ts': 'ニセの API（0.05秒後にデータを返す）',
    },
    starter: { 'App.vue': APP, 'types.ts': TYPES, 'api.ts': API },
    steps: [
      {
        key: 'm1', level: 1, file: 'App.vue',
        label: '「合計」が、並んでいる案件の price の合計になる（computed）',
        hint: ['材料から計算で作る値は <code>computed</code>。結果の型も付ける。', '<code>const total = computed&lt;number&gt;(() =&gt; cases.value.reduce((sum, c) =&gt; sum + c.price, 0))</code>'],
        edits: [rep(L1, ['const total = computed<number>(() =>', '  cases.value.reduce((sum, c) => sum + c.price, 0)', ')']).map((x, i) => (i === 0 ? x : x))],
      },
      {
        key: 'm2', level: 1, file: 'App.vue',
        label: '画面が出た直後に案件が4件に増え、「取得完了」と表示される（onMounted）',
        hint: ['表示された直後に1回だけ動かすのは <code>onMounted</code>。api.ts の <code>fetchCases()</code> は Promise なので <code>await</code> する。', '<code>onMounted(async () =&gt; { cases.value = await fetchCases(); status.value = \'取得完了\' })</code>'],
        edits: [rep(L2, ['onMounted(async () => {', '  cases.value = await fetchCases()', "  status.value = '取得完了'", '})'])],
      },
      {
        key: 'm3', level: 1, file: 'App.vue',
        label: '「税込み」が 合計 × 1.1 になり、税率を変えると追いかける（computed）',
        hint: ['<code>total</code> と <code>taxRate</code> から作る値なので、これも <code>computed</code>。', '<code>const totalWithTax = computed&lt;number&gt;(() =&gt; Math.round(total.value * (1 + taxRate.value / 100)))</code>'],
        edits: [rep(L3, ['const totalWithTax = computed<number>(() =>', '  Math.round(total.value * (1 + taxRate.value / 100))', ')'])],
      },
      {
        key: 'm4', level: 2, file: 'App.vue',
        label: '税率を変えるたびに「税率の変更」の回数が 1 ずつ増える（watch）',
        hint: ['ある値の変化を見張るのは <code>watch(見張る値, 動き)</code>。', '<code>watch(taxRate, () =&gt; { changes.value++ })</code>'],
        edits: [rep(L4, ['watch(taxRate, () => {', '  changes.value++', '})'])],
      },
      {
        key: 'm5', level: 3, file: 'App.vue',
        label: '検索ワードで一覧が絞り込まれ、「◯ 件表示中」も自動で変わる（computed ＋ watchEffect）',
        hint: ['絞り込んだ配列は <code>computed&lt;Case[]&gt;</code> で作り、template の <code>v-for</code> を <code>hits</code> に変える。', '「件数」は <code>watchEffect(() =&gt; { shownText.value = hits.value.length + \' 件表示中\' })</code>。中で読んだ値が変わると自動で動き直す。'],
        edits: [
          rep(L5, [
            'const hits = computed<Case[]>(() =>',
            '  cases.value.filter((c) => c.title.includes(keyword.value))',
            ')',
            '',
            'watchEffect(() => {',
            '  shownText.value = `${hits.value.length} 件表示中`',
            '})',
          ]),
          ['<li v-for="c in cases"', '<li v-for="c in hits"'],
        ],
      },
    ],
    probe: async (win, doc) => {
      const out = {};
      const num = (t) => { const m = String(t || '').replace(/,/g, '').match(/\d+/); return m ? +m[0] : -1; };
      const P = (k) => [...doc.querySelectorAll('p')].find((p) => p.textContent.includes(k));
      const h3 = () => num(doc.querySelector('h3') && doc.querySelector('h3').textContent);
      const lis = () => [...doc.querySelectorAll('li')];
      const liSum = () => lis().reduce((s, li) => s + num(String(li.textContent).split('：')[1]), 0);
      const taxIn = doc.querySelector('input[type=number]');
      const kwIn = doc.querySelector('input:not([type=number])');
      const changes = () => num(P('税率の変更') && P('税率の変更').textContent);
      /* ① 合計 = 並んでいる案件の price の合計 */
      out.m1 = lis().length > 0 && h3() > 0 && h3() === liSum();
      /* ② 取得後：4件・取得完了 */
      await wait(400); await nt(win);
      out.m2 = !!P('取得完了') && lis().length === 4;
      /* ③ 税込み = 合計 × 1.1（税率 8 にしても追いかける） */
      const tax = () => num(P('税込み') && P('税込み').textContent);
      const ok10 = h3() > 0 && tax() === Math.round(h3() * 1.1);
      let ok8 = false;
      if (taxIn) { await type(win, taxIn, '8'); ok8 = tax() === Math.round(h3() * 1.08); }
      out.m3 = ok10 && ok8;
      /* ④ 税率を2回変えると、回数が2増える */
      const c0 = changes();
      if (taxIn) { await type(win, taxIn, '12'); await type(win, taxIn, '15'); }
      out.m4 = c0 >= 0 && changes() - c0 === 2;
      /* ⑤ 絞り込み＋件数表示 */
      out.m5 = false;
      if (kwIn && P('件表示中') !== undefined) {
        const n0 = num(P('件表示中').textContent) === 4 && lis().length === 4;
        await type(win, kwIn, '相続');
        const n1 = lis().length === 1 && lis()[0].textContent.includes('相続') && num(P('件表示中').textContent) === 1;
        await type(win, kwIn, '');
        const n2 = lis().length === 4 && num(P('件表示中').textContent) === 4;
        out.m5 = n0 && n1 && n2;
      }
      return out;
    },
  });
})();
