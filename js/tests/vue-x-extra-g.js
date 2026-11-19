/* 補足 Vue「アトミックデザイン入門」（x-vue-atomic）のレッスン最終テスト。K.vueTestTools.web で作る。
   弁護士検索ページ：page（LawyerSearchPage）＋ template ＋ organism（LawyerCard）＋ molecule（SearchBox）＋ atoms（BaseButton・BaseInput）＋ types.ts
   初級×3（atoms・molecule の emit）・中級×2（organism の props と emit）・上級×1（template の slot）。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueTestTools) return;
  const { web, nt, type } = K.vueTestTools;
  const lock = (id, test) => Object.defineProperty(K.tests, id, { get: () => test, set: () => {}, configurable: true, enumerable: true });

  const TYPES = [
    '// 弁護士 1 人ぶんの「形」。各部品から import type で読み込む',
    'export interface Lawyer {',
    '  id: number',
    '  name: string',
    '  field: string',
    '}',
    '',
  ].join('\n');

  const APP = `<script setup lang="ts">
import { ref } from 'vue'
import type { Lawyer } from './types'
import SearchPageTemplate from './SearchPageTemplate.vue'
import SearchBox from './SearchBox.vue'
import LawyerCard from './LawyerCard.vue'
import BaseButton from './BaseButton.vue'

const keyword = ref<string>('離婚')
const searched = ref<string>('')
const booked = ref<number | null>(null)
const lawyers = ref<Lawyer[]>([
  { id: 1, name: '山田 太郎', field: '労働問題' },
  { id: 2, name: '佐藤 花子', field: '相続' },
])

const search = (): void => {
  searched.value = keyword.value
}

const openBooking = (id: number): void => {
  booked.value = id
}

const reset = (): void => {
  searched.value = ''
  booked.value = null
}
</script>

<template>
  <h2>弁護士をさがす</h2>
  <!-- ⑥ SearchBox と LawyerCard を、SearchPageTemplate の #search と #list に入れる -->
  <SearchBox v-model="keyword" @search="search" />
  <LawyerCard v-for="l in lawyers" :key="l.id" :lawyer="l" @consult="openBooking" />
  <p class="typing">入力中：{{ keyword }}</p>
  <p class="searched">検索：{{ searched }}</p>
  <p class="booked" v-if="booked">予約：{{ booked }}</p>
  <BaseButton class="reset" variant="danger" @click="reset">リセット</BaseButton>
</template>

<style scoped>
.card { border: 1px solid #d5d9e0; border-radius: 8px; padding: 6px 12px; margin: 6px 0; }
</style>
`;

  const BUTTON = `<script setup lang="ts">
// ① variant（'primary' か 'danger'、省略可）を props で受け取り、:class で button に付ける
</script>

<template>
  <button class="base-button"><slot /></button>
</template>

<style scoped>
.base-button { padding: 4px 12px; border-radius: 6px; border: 1px solid #aab; background: #eef2ff; }
.danger { background: #ffe3e3; border-color: #e5484d; }
</style>
`;

  const INPUT = `<script setup lang="ts">
// ② defineModel<string>() で model を作り、input の v-model につなぐ
</script>

<template>
  <input class="base-input" placeholder="地域・分野で探す" />
</template>
`;

  const SEARCH = `<script setup lang="ts">
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'

const model = defineModel<string>()
// ③ defineEmits<{ search: [] }>() を書き、検索ボタンの @click で emit('search') する
</script>

<template>
  <div class="search-box">
    <BaseInput v-model="model" />
    <BaseButton>検索</BaseButton>
  </div>
</template>
`;

  const CARD = `<script setup lang="ts">
import type { Lawyer } from './types'
import BaseButton from './BaseButton.vue'
// ④ lawyer（Lawyer 型）を props で受け取り、名前を {{ lawyer.name }} で表示する
// ⑤ 「相談する」を押したら、emit('consult', lawyer.id) で page に知らせる（defineEmits）
</script>

<template>
  <div class="card">
    <h3></h3>
    <BaseButton class="consult">相談する</BaseButton>
  </div>
</template>
`;

  const TEMPLATE = `<template>
  <div class="layout">
    <!-- ⑥ ここに <slot name="search" /> -->
    <section class="search"></section>
    <!-- ⑥ ここに <slot name="list" /> -->
    <main class="list"></main>
  </div>
</template>
`;

  lock('x-vue-atomic', web({
    height: 340,
    alias: { 'App.vue': 'LawyerSearchPage.vue' },
    paths: {
      'App.vue': 'pages/LawyerSearchPage.vue',
      'SearchPageTemplate.vue': 'components/templates/SearchPageTemplate.vue',
      'SearchBox.vue': 'components/molecules/SearchBox.vue',
      'LawyerCard.vue': 'components/organisms/LawyerCard.vue',
      'BaseButton.vue': 'components/atoms/BaseButton.vue',
      'BaseInput.vue': 'components/atoms/BaseInput.vue',
      'types.ts': 'types/lawyer.ts',
    },
    fileNotes: {
      'App.vue': 'page：データ（keyword・lawyers）を持ち、イベントを受け取る',
      'SearchPageTemplate.vue': 'template：レイアウトの枠だけ（slot）',
      'SearchBox.vue': 'molecule：BaseInput + BaseButton の組み合わせ',
      'LawyerCard.vue': 'organism：弁護士 1 人ぶんのカード',
      'BaseButton.vue': 'atom：ボタン。見た目だけ',
      'BaseInput.vue': 'atom：入力欄。v-model を受ける',
      'types.ts': '型だけを書くファイル（interface Lawyer）',
    },
    starter: { 'App.vue': APP, 'SearchPageTemplate.vue': TEMPLATE, 'SearchBox.vue': SEARCH, 'LawyerCard.vue': CARD, 'BaseButton.vue': BUTTON, 'BaseInput.vue': INPUT, 'types.ts': TYPES },
    steps: [
      {
        key: 'm1', level: 1, file: 'BaseButton.vue',
        label: "BaseButton.vue で、variant（'primary' か 'danger'）を props で受け取り、:class で button に付ける（リセットボタンが danger の色になる）",
        hint: ['atom は、見た目を props で変える。省略できる props は <code>?</code> を付ける。', "<code>defineProps&lt;{ variant?: 'primary' | 'danger' }&gt;()</code>、button に <code>:class=\"variant\"</code>。"],
        edits: [
          ["// ① variant（'primary' か 'danger'、省略可）を props で受け取り、:class で button に付ける\n", "defineProps<{ variant?: 'primary' | 'danger' }>()\n"],
          ['<button class="base-button"><slot /></button>', '<button class="base-button" :class="variant"><slot /></button>'],
        ],
      },
      {
        key: 'm2', level: 1, file: 'BaseInput.vue',
        label: 'BaseInput.vue で、const model = defineModel<string>() を書き、input に v-model="model" をつなぐ（入力すると「入力中：」が変わる）',
        hint: ['親の v-model を受けるのは defineModel 1 行。', '<code>const model = defineModel&lt;string&gt;()</code>、input は <code>v-model="model"</code>。'],
        edits: [
          ["// ② defineModel<string>() で model を作り、input の v-model につなぐ\n", 'const model = defineModel<string>()\n'],
          ['<input class="base-input" placeholder="地域・分野で探す" />', '<input class="base-input" v-model="model" placeholder="地域・分野で探す" />'],
        ],
      },
      {
        key: 'm3', level: 1, file: 'SearchBox.vue',
        label: "SearchBox.vue で、defineEmits に search を書き、検索ボタンの @click で emit('search') する（押すと「検索：」が変わる）",
        hint: ['molecule は検索そのものをしない。「押された」と上に知らせるだけ。', "<code>const emit = defineEmits&lt;{ search: [] }&gt;()</code>、<code>&lt;BaseButton @click=\"emit('search')\"&gt;</code>"],
        edits: [
          ["// ③ defineEmits<{ search: [] }>() を書き、検索ボタンの @click で emit('search') する\n", 'const emit = defineEmits<{ search: [] }>()\n'],
          ['<BaseButton>検索</BaseButton>', '<BaseButton @click="emit(\'search\')">検索</BaseButton>'],
        ],
      },
      {
        key: 'm4', level: 2, file: 'LawyerCard.vue',
        label: 'LawyerCard.vue で、defineProps<{ lawyer: Lawyer }>() を書き、{{ lawyer.name }} で名前を表示する（山田 太郎・佐藤 花子）',
        hint: ['organism は、1 人ぶんの lawyer をまとめて受け取る。', '<code>defineProps&lt;{ lawyer: Lawyer }&gt;()</code>、<code>&lt;h3&gt;{{ lawyer.name }}&lt;/h3&gt;</code>'],
        edits: [
          ["// ④ lawyer（Lawyer 型）を props で受け取り、名前を {{ lawyer.name }} で表示する\n", 'defineProps<{ lawyer: Lawyer }>()\n'],
          ['<h3></h3>', '<h3>{{ lawyer.name }}</h3>'],
        ],
      },
      {
        key: 'm5', level: 2, file: 'LawyerCard.vue',
        label: "LawyerCard.vue で、defineEmits に consult を書き、「相談する」の @click で emit('consult', lawyer.id) する（押すと「予約：1」が出る）",
        hint: ['カードは予約をしない。「押された」と id を上に知らせるだけ。受け取るのは page。', "<code>const emit = defineEmits&lt;{ consult: [id: number] }&gt;()</code>、<code>@click=\"emit('consult', lawyer.id)\"</code>"],
        edits: [
          ["// ⑤ 「相談する」を押したら、emit('consult', lawyer.id) で page に知らせる（defineEmits）\n", 'const emit = defineEmits<{ consult: [id: number] }>()\n'],
          ['<BaseButton class="consult">相談する</BaseButton>', '<BaseButton class="consult" @click="emit(\'consult\', lawyer.id)">相談する</BaseButton>'],
        ],
      },
      {
        key: 'm6', level: 3, file: 'SearchPageTemplate.vue',
        label: 'SearchPageTemplate.vue に slot を作り、LawyerSearchPage.vue で SearchBox と LawyerCard を #search と #list に入れる（枠の中に収まる）',
        hint: ['template は場所を決めるだけ。<code>&lt;slot name="search" /&gt;</code> と <code>&lt;slot name="list" /&gt;</code> を置く。', 'page 側は <code>&lt;SearchPageTemplate&gt;</code> の中に <code>&lt;template #search&gt;</code> と <code>&lt;template #list&gt;</code> を書き、部品をそこへ入れる。'],
        edits: [
          ['    <!-- ⑥ ここに <slot name="search" /> -->\n    <section class="search"></section>\n    <!-- ⑥ ここに <slot name="list" /> -->\n    <main class="list"></main>', '    <section class="search"><slot name="search" /></section>\n    <main class="list"><slot name="list" /></main>'],
        ],
        also: [
          ['App.vue', '  <!-- ⑥ SearchBox と LawyerCard を、SearchPageTemplate の #search と #list に入れる -->\n  <SearchBox v-model="keyword" @search="search" />\n  <LawyerCard v-for="l in lawyers" :key="l.id" :lawyer="l" @consult="openBooking" />\n',
            '  <SearchPageTemplate>\n    <template #search>\n      <SearchBox v-model="keyword" @search="search" />\n    </template>\n    <template #list>\n      <LawyerCard v-for="l in lawyers" :key="l.id" :lawyer="l" @consult="openBooking" />\n    </template>\n  </SearchPageTemplate>\n'],
        ],
      },
    ],
    /* 順番：最初の見た目 → 入力 → 検索 → 相談する の順（状態が積み上がるので） */
    probe: async (win, doc) => {
      const out = {};
      const $ = (s) => doc.querySelector(s);
      const txt = (s) => (($(s) || {}).textContent || '').replace(/\s+/g, ' ').trim();
      const click = async (el, ms) => { if (el) { el.click(); await nt(win, ms); } };
      await nt(win);
      /* m1：リセットボタンが danger */
      out.m1 = !!$('.reset') && $('.reset').classList.contains('danger');
      /* m4：名前が出る */
      const names = [...doc.querySelectorAll('.card h3')].map((x) => x.textContent.trim());
      out.m4 = names.join('|') === '山田 太郎|佐藤 花子';
      /* m6：template の枠の中に入っている */
      out.m6 = !!$('.layout > .search input') && !!$('.layout > .search button') && doc.querySelectorAll('.layout > .list .card').length === 2;
      /* m2：入力すると「入力中：」が変わる */
      const inp = $('input');
      if (inp) { await type(win, inp, '相続'); out.m2 = txt('.typing') === '入力中：相続'; } else out.m2 = false;
      /* m3：検索を押すと「検索：」が変わる */
      const before = txt('.searched');
      await click($('.search-box button'));
      out.m3 = before === '検索：' && /^検索：\S+/.test(txt('.searched'));
      /* m5：相談するを押すと「予約：1」 */
      const pre = !$('.booked');
      await click($('.consult'));
      out.m5 = pre && txt('.booked') === '予約：1';
      return out;
    },
  }));
})();
