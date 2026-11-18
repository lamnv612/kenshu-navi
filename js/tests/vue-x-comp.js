/* vue-comp のテスト（初級×3・中級×1・上級×1）。K.vueTestTools.web で作る
   ファイル構成：CaseListPage.vue（親）＋ CaseCard.vue / NameInput.vue（子）＋ types.ts（型）。すべて <script setup lang="ts"> */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueTestTools) return;
  const { web, nt, type } = K.vueTestTools;

  const TYPES = [
    '// 案件 1 件ぶんの「形」。CaseListPage.vue から import type で読み込む',
    'export interface Case {',
    '  id: number',
    '  title: string',
    '  urgent: boolean',
    '}',
    '',
  ].join('\n');

  const APP = [
    '<script setup lang="ts">',
    "import { ref } from 'vue'",
    "import CaseCard from './CaseCard.vue'",
    "import NameInput from './NameInput.vue'",
    '',
    'const count = ref(2)',
    "const name = ref('たろう')",
    '// ④（中級）案件を Case[] にして v-for で並べる。count をやめて cases.length を出す',
    '</script>',
    '',
    '<template>',
    '  <p>案件数：{{ count }}</p>',
    '  <!-- ① 子に title を渡す（労働問題 と 契約トラブル） -->',
    '  <CaseCard />',
    '  <CaseCard />',
    '  <!-- ② 削除が押されたら count を減らす（@remove） -->',
    '  <hr />',
    '  <!-- ③ v-model で name とつなぐ -->',
    '  <NameInput />',
    '  <p>お名前：{{ name }}</p>',
    '</template>',
    '',
  ].join('\n');

  const CARD = [
    '<script setup lang="ts">',
    '// ① title を受け取る（props）。型も書く',
    "const emit = defineEmits<{ remove: [] }>()",
    '// ⑤（上級）任意の props urgent?: boolean を足す。既定値は withDefaults で false',
    '</script>',
    '',
    '<template>',
    '  <div class="card">',
    '    <span>{{ title }}</span>',
    '    <!-- ⑤ urgent のときだけ <b class="badge">急ぎ</b> を出す（v-if） -->',
    "    <button @click=\"emit('remove')\">削除</button>",
    '  </div>',
    '</template>',
    '',
  ].join('\n');

  const INPUT = [
    '<script setup lang="ts">',
    '// ③ defineModel<string>() で、親の v-model の値を受け取る',
    '</script>',
    '',
    '<template>',
    '  <input placeholder="お名前" />',
    '</template>',
    '',
  ].join('\n');

  const CASES = [
    'const cases = ref<Case[]>([',
    "  { id: 1, title: '労働問題', urgent: true },",
    "  { id: 2, title: '契約トラブル', urgent: false },",
    "  { id: 3, title: '離婚相談', urgent: true },",
    '])',
    "const name = ref('たろう')",
    '',
    'function remove(id: number): void {',
    '  cases.value = cases.value.filter((c) => c.id !== id)',
    '}',
  ].join('\n');

  K.tests['vue-comp'] = web({
    height: 340,
    alias: { 'App.vue': 'CaseListPage.vue' },
    fileNotes: {
      'App.vue': '親：ページ全体。部品を並べて、データを渡す',
      'CaseCard.vue': '子：案件カード 1 枚（props を受け取り、emit で知らせる）',
      'NameInput.vue': '子：お名前の入力欄（v-model を受け取る）',
      'types.ts': '型だけを書くファイル（interface Case）',
    },
    starter: { 'App.vue': APP, 'CaseCard.vue': CARD, 'NameInput.vue': INPUT, 'types.ts': TYPES },
    steps: [
      {
        key: 'm1', level: 1, file: 'App.vue',
        label: '① 親から子へ title を props で渡す（画面：労働問題、契約トラブル）',
        hint: ['子（CaseCard.vue）は <code>defineProps&lt;{ title: string }&gt;()</code> で受け取る（型も書く）。', '親（CaseListPage.vue）は <code>&lt;CaseCard title="労働問題" /&gt;</code> のように渡す。'],
        edits: [['  <CaseCard />\n  <CaseCard />', '  <CaseCard title="労働問題" />\n  <CaseCard title="契約トラブル" />']],
        also: [['CaseCard.vue', '// ① title を受け取る（props）。型も書く\n', 'defineProps<{ title: string }>()\n']],
      },
      {
        key: 'm2', level: 1, file: 'App.vue',
        label: '② 子で削除を emit し、親の @remove で案件数を 1 減らす',
        hint: ['子は <code>emit(\'remove\')</code> で知らせている。親は <code>@remove</code> で受け取る。', '<code>&lt;CaseCard title="労働問題" @remove="count--" /&gt;</code>（script の中では <code>count.value--</code>、template では <code>count--</code>）'],
        edits: [['<CaseCard title="労働問題" />\n  <CaseCard title="契約トラブル" />', '<CaseCard title="労働問題" @remove="count--" />\n  <CaseCard title="契約トラブル" @remove="count--" />']],
      },
      {
        key: 'm3', level: 1, file: 'App.vue',
        label: '③ 親の v-model と子の defineModel をつなぐ（画面：たろう）',
        hint: ['子（NameInput.vue）は <code>const model = defineModel&lt;string&gt;()</code>、input は <code>v-model="model"</code>。', '親（CaseListPage.vue）は <code>&lt;NameInput v-model="name" /&gt;</code>。'],
        edits: [['<NameInput />', '<NameInput v-model="name" />']],
        also: [
          ['NameInput.vue', '// ③ defineModel<string>() で、親の v-model の値を受け取る\n', 'const model = defineModel<string>()\n'],
          ['NameInput.vue', '<input placeholder="お名前" />', '<input v-model="model" placeholder="お名前" />'],
        ],
      },
      {
        key: 'm4', level: 2, file: 'App.vue',
        label: '④ 案件を Case 型の配列にして v-for で並べ、削除したカードを消す',
        hint: ['<code>import type { Case } from \'./types\'</code> で型を読み込み、<code>ref&lt;Case[]&gt;([…3 件…])</code>。', '並べるのは <code>&lt;CaseCard v-for="c in cases" :key="c.id" :title="c.title" @remove="remove(c.id)" /&gt;</code>。', '消すのは <code>cases.value = cases.value.filter((c) =&gt; c.id !== id)</code>。案件数は <code>{{ cases.length }}</code>。'],
        edits: [
          ["import CaseCard from './CaseCard.vue'", "import type { Case } from './types'\nimport CaseCard from './CaseCard.vue'"],
          ["const count = ref(2)\nconst name = ref('たろう')\n// ④（中級）案件を Case[] にして v-for で並べる。count をやめて cases.length を出す", CASES],
          ['案件数：{{ count }}', '案件数：{{ cases.length }}'],
          ['  <CaseCard title="労働問題" @remove="count--" />\n  <CaseCard title="契約トラブル" @remove="count--" />', '  <CaseCard v-for="c in cases" :key="c.id" :title="c.title" @remove="remove(c.id)" />'],
          ['  <!-- ② 削除が押されたら count を減らす（@remove） -->\n', ''],
          ['  <!-- ① 子に title を渡す（労働問題 と 契約トラブル） -->\n', ''],
        ],
      },
      {
        key: 'm5', level: 3, file: 'App.vue',
        label: '⑤ 任意の props urgent を withDefaults で false にし、急ぎ 2 件にバッジを付ける',
        hint: ['子：<code>withDefaults(defineProps&lt;{ title: string; urgent?: boolean }&gt;(), { urgent: false })</code>。<code>?</code> が付くと「渡さなくてもよい」props になる。', '子の template：<code>&lt;b v-if="urgent" class="badge"&gt;急ぎ&lt;/b&gt;</code>。親は <code>:urgent="c.urgent"</code> を足す。'],
        edits: [[':title="c.title" @remove="remove(c.id)"', ':title="c.title" :urgent="c.urgent" @remove="remove(c.id)"']],
        also: [
          ['CaseCard.vue', 'defineProps<{ title: string }>()\n', 'withDefaults(defineProps<{ title: string; urgent?: boolean }>(), { urgent: false })\n'],
          ['CaseCard.vue', '// ⑤（上級）任意の props urgent?: boolean を足す。既定値は withDefaults で false\n', ''],
          ['CaseCard.vue', '    <!-- ⑤ urgent のときだけ <b class="badge">急ぎ</b> を出す（v-if） -->\n', '    <b v-if="urgent" class="badge">急ぎ</b>\n'],
        ],
      },
    ],
    /* 順番に注意：最初の見た目を読む → 入力 → 削除（カードが変わる）の順 */
    probe: async (win, doc) => {
      const out = {};
      const cards = () => [...doc.querySelectorAll('.card')];
      const titles = () => cards().map((c) => (c.querySelector('span') || {}).textContent || '').map((x) => x.trim());
      const count = () => { const p = [...doc.querySelectorAll('p')].find((x) => x.textContent.includes('案件数')); const m = p && p.textContent.match(/\d+/); return m ? +m[0] : -1; };
      const first = () => doc.querySelector('.card button');

      const t0 = titles(), c0 = count();
      out.m1 = t0.length >= 2 && t0[0] === '労働問題' && t0[1] === '契約トラブル';

      const badges = cards().filter((c) => c.querySelector('.badge'));
      out.m5 = t0.length >= 2 && badges.length === 2 && badges.every((c) => /急ぎ/.test(c.querySelector('.badge').textContent)) && !!badges[0].textContent.includes('労働問題');

      const inp = doc.querySelector('input');
      const nameP = () => [...doc.querySelectorAll('p')].find((x) => x.textContent.includes('お名前'));
      out.m3 = false;
      if (inp && inp.value === 'たろう') { await type(win, inp, 'はなこ'); out.m3 = !!nameP() && nameP().textContent.includes('はなこ'); }

      let c1 = -1, c2 = -1, t1 = [];
      if (first()) { first().click(); await nt(win); c1 = count(); t1 = titles(); }
      if (first()) { first().click(); await nt(win); c2 = count(); }
      out.m2 = c0 >= 2 && c1 === c0 - 1 && c2 === c0 - 2;
      out.m4 = t0.length === 3 && t1.length === 2 && !t1.includes('労働問題') && c1 === t1.length;
      return out;
    },
  });
})();
