/* 補足 Vue のレッスン最終テスト（x-vue-api / slots / dynamic / composables / state）。K.vueTestTools.web で作る
   どれも .vue ＋ types.ts / 道具の .ts に分けた複数ファイル。すべて <script setup lang="ts">（初級×3・中級×1〜2・上級×1） */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueTestTools) return;
  const { web, nt, type } = K.vueTestTools;
  /* teamx.js（このファイルより後に読み込まれる）が、古い 3 ミッションの版で上書きしてしまうので、
     上書きできないように固定する（後からの代入は無視される） */
  const lock = (id, test) => Object.defineProperty(K.tests, id, { get: () => test, set: () => {}, configurable: true, enumerable: true });
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  /* f() が true になるまで待つ（最大 ms）。なったら true、ならなければ false */
  const until = async (f, ms) => {
    const t0 = Date.now();
    while (Date.now() - t0 < ms) { if (f()) return true; await wait(30); }
    return false;
  };

  /* =====================================================================
     x-vue-api：fetch の 3 状態（loading / error / data）
     ファイル：CaseFetchPage.vue（親）＋ CaseList.vue / ErrorBox.vue（子）＋ api.ts（ニセ API）＋ types.ts
     ===================================================================== */
  {
    const TYPES = `// 相談案件 1 件の「形」
export interface Case {
  id: number
  title: string
  lawyer: string
}
`;

    const API = `import type { Case } from './types'

// 本物の API のかわりに、150ms 待ってから案件を返すニセの関数
// fail が true のときは、サーバーの失敗（HTTP 500）のふりをする
export function fakeFetchCases(fail: boolean): Promise<Case[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (fail) {
        reject(new Error('HTTP 500'))
        return
      }
      resolve([
        { id: 1, title: '未払い残業代の相談', lawyer: '田中 弁護士' },
        { id: 2, title: '契約書チェックの依頼', lawyer: '佐藤 弁護士' },
        { id: 3, title: '交通事故の示談', lawyer: '鈴木 弁護士' },
      ])
    }, 150)
  })
}
`;

    const LIST = `<script setup lang="ts">
import type { Case } from './types'

defineProps<{ cases: Case[] }>()
</script>

<template>
  <p v-if="cases.length === 0" class="empty">案件はまだありません</p>
  <ul v-else class="case-list">
    <li v-for="c in cases" :key="c.id">{{ c.title }}（{{ c.lawyer }}）</li>
  </ul>
</template>
`;

    const ERR = `<script setup lang="ts">
// ④ message を受け取る（props）。型は string
// ⑤ retry を親に知らせる emit を作る
</script>

<template>
  <div class="error-box">
    <p>エラー：{{ message }}</p>
    <button>もう一度</button>
  </div>
</template>
`;

    const APP = `<script setup lang="ts">
import { ref } from 'vue'
import type { Case } from './types'
import { fakeFetchCases } from './api'
import CaseList from './CaseList.vue'
import ErrorBox from './ErrorBox.vue'

const cases = ref<Case[]>([])
const loading = ref<boolean>(false)
const error = ref<string | null>(null)

async function load(fail: boolean): Promise<void> {
  // ① fakeFetchCases(fail) を await して、結果を cases に入れる
  // ② 取得の前に loading を true、あとで false にする
  // ③ try / catch / finally で包む（失敗したら error にメッセージを入れる。loading は finally で false）
}

// ⑥ 開いた直後に、自動で load(false) する（onMounted）
</script>

<template>
  <section>
    <h2>相談案件の取得</h2>
    <button @click="load(false)">取得</button>
    <button @click="load(true)">わざと失敗</button>
    <p v-if="loading" class="state">読み込み中…</p>
    <!-- ④ error があるときは ErrorBox を出す（v-else-if）。message に error を渡す -->
    <!-- ⑤ ErrorBox の retry を受け取って、もう一度 load(false) する -->
    <CaseList v-else :cases="cases" />
  </section>
</template>
`;

    const LOAD_BODY = `async function load(fail: boolean): Promise<void> {
  loading.value = true
  error.value = null
  try {
    cases.value = await fakeFetchCases(fail)
  } catch (e) {
    error.value = e instanceof Error ? e.message : '通信に失敗しました'
  } finally {
    loading.value = false
  }
}`;

    lock('x-vue-api', web({
      height: 340,
      alias: { 'App.vue': 'CaseFetchPage.vue' },
      paths: {
        'App.vue': 'src/views/CaseFetchPage.vue',
        'CaseList.vue': 'src/components/CaseList.vue',
        'ErrorBox.vue': 'src/components/ErrorBox.vue',
        'api.ts': 'src/api.ts',
        'types.ts': 'src/types.ts',
      },
      fileNotes: {
        'App.vue': '親：画面。loading / error / cases の 3 状態を持ち、API を呼ぶ',
        'CaseList.vue': '子：案件の一覧（cases を props で受け取る）',
        'ErrorBox.vue': '子：エラー表示と「もう一度」ボタン（message を受け取り、retry を知らせる）',
        'api.ts': 'ニセの API（150ms 待って返す。fail で失敗する）。本物なら fetch',
        'types.ts': '型だけを書くファイル（interface Case）',
      },
      starter: { 'App.vue': APP, 'CaseList.vue': LIST, 'ErrorBox.vue': ERR, 'api.ts': API, 'types.ts': TYPES },
      steps: [
        {
          key: 'm1', level: 1, file: 'App.vue',
          label: '「取得」を押すと、相談案件が 3 件並ぶ（await）',
          hint: ['通信は時間がかかるので、結果は <code>await</code> で待ってから受け取る。待つ関数は <code>async</code> が必要（もう付いている）。', '<code>cases.value = await fakeFetchCases(fail)</code> を load の中に書く。'],
          edits: [['  // ① fakeFetchCases(fail) を await して、結果を cases に入れる\n', '  cases.value = await fakeFetchCases(fail)\n']],
        },
        {
          key: 'm2', level: 1, file: 'App.vue',
          label: '取得中は「読み込み中…」が出て、終わると消える（loading）',
          hint: ['通信の前に <code>loading.value = true</code>、終わったら <code>false</code>。template の <code>v-if="loading"</code> が表示を切り替える。', '<code>loading.value = true</code> → <code>cases.value = await …</code> → <code>loading.value = false</code> の順。'],
          edits: [['  cases.value = await fakeFetchCases(fail)\n  // ② 取得の前に loading を true、あとで false にする\n', '  loading.value = true\n  cases.value = await fakeFetchCases(fail)\n  loading.value = false\n']],
        },
        {
          key: 'm3', level: 1, file: 'App.vue',
          label: '「わざと失敗」を押しても、読み込み中のまま止まらない（try / catch / finally）',
          hint: ['失敗すると await の行で止まり、その下の <code>loading.value = false</code> が動かない。<code>try / catch / finally</code> で包む。', '<code>catch (e)</code> で <code>error.value = …</code>、<code>finally { loading.value = false }</code> は成功しても失敗しても必ず動く。', '全体：<pre>' + LOAD_BODY.replace(/</g, '&lt;') + '</pre>'],
          edits: [['  loading.value = true\n  cases.value = await fakeFetchCases(fail)\n  loading.value = false\n  // ③ try / catch / finally で包む（失敗したら error にメッセージを入れる。loading は finally で false）\n', '  loading.value = true\n  error.value = null\n  try {\n    cases.value = await fakeFetchCases(fail)\n  } catch (e) {\n    error.value = e instanceof Error ? e.message : \'通信に失敗しました\'\n  } finally {\n    loading.value = false\n  }\n']],
        },
        {
          key: 'm4', level: 2, file: 'App.vue',
          label: '失敗したら、ErrorBox に「エラー：HTTP 500」と出る（props）',
          hint: ['親：error があるときは <code>v-else-if="error"</code> で ErrorBox を出し、<code>:message="error"</code> で渡す。', '子（ErrorBox.vue）：<code>defineProps&lt;{ message: string }&gt;()</code>。', '親：<code>&lt;ErrorBox v-else-if="error" :message="error" /&gt;</code>（v-if → v-else-if → v-else の順に並べる）。'],
          edits: [['    <!-- ④ error があるときは ErrorBox を出す（v-else-if）。message に error を渡す -->\n', '    <ErrorBox v-else-if="error" :message="error" />\n']],
          also: [['ErrorBox.vue', '// ④ message を受け取る（props）。型は string\n', 'defineProps<{ message: string }>()\n']],
        },
        {
          key: 'm5', level: 2, file: 'App.vue',
          label: '「もう一度」を押すと取得し直せて、成功したらエラー表示が消える（emit）',
          hint: ['子は <code>defineEmits&lt;{ retry: [] }&gt;()</code> で、ボタンを押したときに <code>emit(\'retry\')</code>。', '親は <code>@retry="load(false)"</code> で受け取って、もう一度取得する。', '子：<code>const emit = defineEmits&lt;{ retry: [] }&gt;()</code> と <code>&lt;button @click="emit(\'retry\')"&gt;</code>。親：<code>&lt;ErrorBox … @retry="load(false)" /&gt;</code>。'],
          edits: [
            ['    <ErrorBox v-else-if="error" :message="error" />\n    <!-- ⑤ ErrorBox の retry を受け取って、もう一度 load(false) する -->\n', '    <ErrorBox v-else-if="error" :message="error" @retry="load(false)" />\n'],
          ],
          also: [
            ['ErrorBox.vue', '// ⑤ retry を親に知らせる emit を作る\n', 'const emit = defineEmits<{ retry: [] }>()\n'],
            ['ErrorBox.vue', '<button>もう一度</button>', '<button @click="emit(\'retry\')">もう一度</button>'],
          ],
        },
        {
          key: 'm6', level: 3, file: 'App.vue',
          label: '開いた直後に自動で一覧が出て、取得中はボタンが押せない（onMounted / :disabled）',
          hint: ['開いた直後に 1 回だけ動かすのは <code>onMounted</code>（vue から import する）。', '押せなくするのは <code>:disabled="loading"</code>。2 つのボタンどちらにも付ける。', '<code>onMounted(() =&gt; load(false))</code> と <code>&lt;button :disabled="loading" @click="load(false)"&gt;取得&lt;/button&gt;</code>。'],
          edits: [
            ["import { ref } from 'vue'", "import { onMounted, ref } from 'vue'"],
            ['// ⑥ 開いた直後に、自動で load(false) する（onMounted）\n', 'onMounted(() => load(false))\n'],
            ['    <button @click="load(false)">取得</button>\n    <button @click="load(true)">わざと失敗</button>', '    <button :disabled="loading" @click="load(false)">取得</button>\n    <button :disabled="loading" @click="load(true)">わざと失敗</button>'],
          ],
        },
      ],
      /* 順番：自動取得 → 取得（成功）→ わざと失敗 → もう一度 */
      probe: async (win, doc) => {
        const out = {};
        const lis = () => doc.querySelectorAll('.case-list li').length;
        const text = () => doc.body.textContent;
        const btn = (t) => [...doc.querySelectorAll('button')].find((b) => b.textContent.trim() === t);

        const auto = await until(() => lis() === 3, 900);
        const ok = btn('取得'), ng = btn('わざと失敗');
        let disabledDuring = false;
        if (ok && !ok.disabled) {
          ok.click(); await wait(40);
          const during = text().includes('読み込み中');
          disabledDuring = ok.disabled === true;
          const got = await until(() => lis() === 3, 1500);
          const settled = await until(() => !text().includes('読み込み中'), 1500);
          out.m1 = got;
          out.m2 = during && settled && lis() === 3;
        }
        out.m6 = auto && disabledDuring;
        if (ng && !ng.disabled) {
          ng.click(); await wait(40);
          const saw = text().includes('読み込み中');
          const settled = await until(() => !text().includes('読み込み中'), 1500);
          await wait(60);
          out.m3 = saw && settled;
          const eb = doc.querySelector('.error-box');
          out.m4 = !!eb && eb.textContent.includes('HTTP 500');
          const rb = doc.querySelector('.error-box button');
          if (rb) { rb.click(); await wait(40); out.m5 = await until(() => lis() === 3 && !doc.querySelector('.error-box'), 1500); }
        }
        return out;
      },
    }));
  }

  /* =====================================================================
     x-vue-slots：スロット（既定 / 名前付き / 初期表示 / スコープ付き）
     ファイル：ConsultPage.vue（親）＋ ConsultCard.vue / LawyerList.vue（子）＋ types.ts
     ===================================================================== */
  {
    const TYPES = `// 弁護士 1 人ぶんの「形」
export interface Lawyer {
  id: number
  name: string
  field: string
}
`;

    const APP = `<script setup lang="ts">
import { ref } from 'vue'
import type { Lawyer } from './types'
import ConsultCard from './ConsultCard.vue'
import LawyerList from './LawyerList.vue'

const reserved = ref<number>(0)
const lawyers = ref<Lawyer[]>([
  { id: 1, name: '田中 一郎', field: '労働問題' },
  { id: 2, name: '佐藤 花子', field: '契約トラブル' },
  { id: 3, name: '鈴木 健太', field: '交通事故' },
])
</script>

<template>
  <ConsultCard>
    <!-- ① 本文の穴には、そのまま書く：<p>未払い残業代について、弁護士に相談できます。</p> -->
    <!-- ② 見出しの穴に入れる：<template #header> の中に <h3>労働問題の相談</h3> -->
    <!-- ③ フッターの穴に入れる：<template #footer> の中に「予約する」ボタンと「予約数：0」 -->
  </ConsultCard>
  <ConsultCard>
    <p>契約書のチェックを依頼できます。</p>
  </ConsultCard>
  <!-- ⑥ 親が lawyer を受け取って、「名前（分野）」の形で並べる（#default="{ lawyer }"） -->
  <LawyerList :lawyers="lawyers" />
</template>
`;

    const CARD = `<script setup lang="ts">
</script>

<template>
  <div class="card">
    <header>
      <!-- ④ 見出しが渡されなかったときの初期表示「無題の相談」を、slot の中に書く -->
      <slot name="header" />
    </header>
    <section>
      <slot />
    </section>
    <!-- ⑤ footer が渡されなかったら、footer ごと出さない（v-if と $slots.footer） -->
    <footer>
      <slot name="footer" />
    </footer>
  </div>
</template>
`;

    const LIST = `<script setup lang="ts">
import type { Lawyer } from './types'

defineProps<{ lawyers: Lawyer[] }>()
</script>

<template>
  <ul class="lawyer-list">
    <li v-for="l in lawyers" :key="l.id">
      <!-- ⑥ slot に lawyer を渡す（:lawyer="l"）。見た目は親が決める -->
    </li>
  </ul>
</template>
`;

    lock('x-vue-slots', web({
      height: 340,
      alias: { 'App.vue': 'ConsultPage.vue' },
      paths: {
        'App.vue': 'src/views/ConsultPage.vue',
        'ConsultCard.vue': 'src/components/ConsultCard.vue',
        'LawyerList.vue': 'src/components/LawyerList.vue',
        'types.ts': 'src/types.ts',
      },
      fileNotes: {
        'App.vue': '親：画面。カードの「穴」に、見出し・本文・フッターを差し込む',
        'ConsultCard.vue': '子：穴あきのカード（header / 既定 / footer の 3 つの slot）',
        'LawyerList.vue': '子：弁護士の一覧。1 人ぶんの見た目は、親に任せる（スコープ付き slot）',
        'types.ts': '型だけを書くファイル（interface Lawyer）',
      },
      starter: { 'App.vue': APP, 'ConsultCard.vue': CARD, 'LawyerList.vue': LIST, 'types.ts': TYPES },
      steps: [
        {
          key: 'm1', level: 1, file: 'App.vue',
          label: 'カードの本文に「未払い残業代について…」と出る（既定の slot）',
          hint: ['子には <code>&lt;slot /&gt;</code> という「穴」がある。親がタグの間に書いたものが、そこに入る。', '<code>&lt;ConsultCard&gt;</code> の間に <code>&lt;p&gt;未払い残業代について、弁護士に相談できます。&lt;/p&gt;</code> を書く。'],
          edits: [['    <!-- ① 本文の穴には、そのまま書く：<p>未払い残業代について、弁護士に相談できます。</p> -->\n', '    <p>未払い残業代について、弁護士に相談できます。</p>\n']],
        },
        {
          key: 'm2', level: 1, file: 'App.vue',
          label: 'カードの見出しに「労働問題の相談」と出る（名前付き slot）',
          hint: ['子の <code>&lt;slot name="header" /&gt;</code> に入れるには、親で <code>&lt;template #header&gt;</code> を使う。', '<code>&lt;template #header&gt;&lt;h3&gt;労働問題の相談&lt;/h3&gt;&lt;/template&gt;</code>'],
          edits: [['    <!-- ② 見出しの穴に入れる：<template #header> の中に <h3>労働問題の相談</h3> -->\n', '    <template #header>\n      <h3>労働問題の相談</h3>\n    </template>\n']],
        },
        {
          key: 'm3', level: 1, file: 'App.vue',
          label: 'フッターに「予約する」ボタンが出て、押すと「予約数：1」になる',
          hint: ['フッターの穴は <code>&lt;template #footer&gt;</code>。中には普通の HTML が書ける。', 'ボタンは親の <code>reserved</code> を使う：<code>&lt;button @click="reserved++"&gt;予約する&lt;/button&gt;</code> と <code>&lt;span&gt;予約数：{{ reserved }}&lt;/span&gt;</code>。', 'slot の中身は「親のデータ」を使える。子は何も知らなくてよい。'],
          edits: [['    <!-- ③ フッターの穴に入れる：<template #footer> の中に「予約する」ボタンと「予約数：0」 -->\n', '    <template #footer>\n      <button @click="reserved++">予約する</button>\n      <span>予約数：{{ reserved }}</span>\n    </template>\n']],
        },
        {
          key: 'm4', level: 2, file: 'App.vue',
          label: '見出しを渡さない 2 枚目のカードに、初期表示「無題の相談」が出る（slot の初期表示）',
          hint: ['<code>&lt;slot&gt;</code> の中に書いたものは、親が何も渡さなかったときだけ出る。', '子（ConsultCard.vue）の <code>&lt;slot name="header" /&gt;</code> を、閉じタグ付きに変える。', '<code>&lt;slot name="header"&gt;無題の相談&lt;/slot&gt;</code>'],
          edits: [],
          also: [['ConsultCard.vue', '      <!-- ④ 見出しが渡されなかったときの初期表示「無題の相談」を、slot の中に書く -->\n      <slot name="header" />', '      <slot name="header">無題の相談</slot>']],
        },
        {
          key: 'm5', level: 2, file: 'App.vue',
          label: 'フッターを渡さない 2 枚目のカードには、footer 自体が出ない（$slots）',
          hint: ['渡された slot は、template では <code>$slots</code> で調べられる。', '<code>&lt;footer v-if="$slots.footer"&gt;</code> と書くと、footer が渡されたときだけ出る。'],
          edits: [],
          also: [['ConsultCard.vue', '    <!-- ⑤ footer が渡されなかったら、footer ごと出さない（v-if と $slots.footer） -->\n    <footer>', '    <footer v-if="$slots.footer">']],
        },
        {
          key: 'm6', level: 3, file: 'App.vue',
          label: '弁護士一覧の見た目を親が決め、「田中 一郎（労働問題）」の形で 3 人並ぶ（スコープ付き slot）',
          hint: ['子は <code>&lt;slot :lawyer="l" /&gt;</code> のように、slot にデータを渡せる（スコープ付き slot）。', '親は <code>&lt;template #default="{ lawyer }"&gt;</code> で受け取って、好きな見た目にする。', '親：<code>&lt;LawyerList :lawyers="lawyers"&gt;&lt;template #default="{ lawyer }"&gt;{{ lawyer.name }}（{{ lawyer.field }}）&lt;/template&gt;&lt;/LawyerList&gt;</code>。子：<code>&lt;slot :lawyer="l" /&gt;</code>。'],
          edits: [['  <!-- ⑥ 親が lawyer を受け取って、「名前（分野）」の形で並べる（#default="{ lawyer }"） -->\n  <LawyerList :lawyers="lawyers" />', '  <LawyerList :lawyers="lawyers">\n    <template #default="{ lawyer }">{{ lawyer.name }}（{{ lawyer.field }}）</template>\n  </LawyerList>']],
          also: [['LawyerList.vue', '      <!-- ⑥ slot に lawyer を渡す（:lawyer="l"）。見た目は親が決める -->\n', '      <slot :lawyer="l" />\n']],
        },
      ],
      probe: async (win, doc) => {
        const out = {};
        const cards = () => [...doc.querySelectorAll('.card')];
        const c0 = cards()[0], c1 = cards()[1];
        const tx = (el, sel) => { const e = el && el.querySelector(sel); return e ? e.textContent.trim() : ''; };
        out.m1 = !!c0 && tx(c0, 'section').includes('未払い残業代');
        out.m2 = !!c0 && tx(c0, 'header h3') === '労働問題の相談';
        const b = c0 && c0.querySelector('footer button');
        if (b && b.textContent.includes('予約する')) { b.click(); await nt(win); }
        out.m3 = !!b && tx(c0, 'footer').includes('予約数：1');
        out.m4 = !!c1 && tx(c1, 'header') === '無題の相談';
        out.m5 = !!c0 && !!c1 && !!c0.querySelector('footer') && !c1.querySelector('footer');
        const names = [...doc.querySelectorAll('.lawyer-list li')].map((l) => l.textContent.trim());
        out.m6 = names.join(',') === '田中 一郎（労働問題）,佐藤 花子（契約トラブル）,鈴木 健太（交通事故）';
        return out;
      },
    }));
  }

  /* =====================================================================
     x-vue-dynamic：<component :is> / :class / :style / v-bind / KeepAlive
     ファイル：LawyerTabsPage.vue（親）＋ ProfileTab / ReserveTab / ReviewTab / StatusBadge ＋ types.ts
     ===================================================================== */
  {
    const TYPES = `// タブの名前（この 3 つ以外は書けない）
export type TabKey = 'profile' | 'reserve' | 'review'

// 相談のステータス
export type Status = 'open' | 'pending' | 'closed'

export interface Lawyer {
  name: string
  field: string
}

export interface Consult {
  id: number
  title: string
  status: Status
}
`;

    const APP = `<script setup lang="ts">
import { ref } from 'vue'
import type { Component } from 'vue'
import type { TabKey, Lawyer, Consult } from './types'
import ProfileTab from './ProfileTab.vue'
import ReserveTab from './ReserveTab.vue'
import ReviewTab from './ReviewTab.vue'
import StatusBadge from './StatusBadge.vue'

const keys: TabKey[] = ['profile', 'reserve', 'review']
const labels: Record<TabKey, string> = {
  profile: 'プロフィール',
  reserve: '予約',
  review: '口コミ',
}
const tabs: Record<TabKey, Component> = {
  profile: ProfileTab,
  reserve: ReserveTab,
  review: ReviewTab,
}
const current = ref<TabKey>('profile')
const progress = ref<number>(40)
const lawyer: Lawyer = { name: '田中 一郎', field: '労働問題' }
const consults = ref<Consult[]>([
  { id: 1, title: '未払い残業代の相談', status: 'open' },
  { id: 2, title: '契約書チェックの依頼', status: 'pending' },
  { id: 3, title: '交通事故の示談', status: 'closed' },
])
</script>

<template>
  <nav class="tabs">
    <!-- ② 今のタブのボタンだけ class="active" にする（:class のオブジェクト構文） -->
    <button v-for="key in keys" :key="key" @click="current = key">{{ labels[key] }}</button>
  </nav>
  <main>
    <!-- ① <component :is> で、今のタブの部品を出す（部品は tabs[current]） -->
    <!-- ⑤（中級）<KeepAlive> で包んで、タブを切り替えても入力を残す -->
    <!-- ⑥（上級）v-bind="lawyer" で、name と field をまとめて渡す（ProfileTab 側は props で受け取る） -->
  </main>
  <h4>相談の進み具合</h4>
  <div class="track">
    <!-- ③ バーの幅を progress % にする（:style） -->
    <div class="bar"></div>
  </div>
  <button @click="progress += 20">進める</button>
  <ul>
    <li v-for="c in consults" :key="c.id">
      {{ c.title }}
      <StatusBadge :status="c.status" />
    </li>
  </ul>
</template>

<style scoped>
.tabs button { padding: 0.3em 1em; }
.tabs button.active { background: #2fd4a4; font-weight: 700; }
.track { height: 10px; background: #e5e8f4; border-radius: 5px; }
.bar { height: 10px; background: #5b9dff; border-radius: 5px; }
.badge { padding: 0.1em 0.6em; border-radius: 8px; background: #e5e8f4; }
.badge-open { background: #cde8ff; }
.badge-pending { background: #ffe9b0; }
.badge-closed { background: #d6f5d9; }
</style>
`;

    const PROFILE = `<script setup lang="ts">
// ⑥ 親から v-bind で渡される name と field を、props で受け取る（どちらも string）
</script>

<template>
  <div>
    <h3>弁護士プロフィール</h3>
    <p class="who">{{ name }}（{{ field }}）</p>
  </div>
</template>
`;

    const RESERVE = `<script setup lang="ts">
</script>

<template>
  <div>
    <h3>予約フォーム</h3>
    <input placeholder="ご要望メモ" />
  </div>
</template>
`;

    const REVIEW = `<script setup lang="ts">
</script>

<template>
  <div>
    <h3>口コミ</h3>
    <p>丁寧に対応してもらえました。</p>
  </div>
</template>
`;

    const BADGE = `<script setup lang="ts">
import type { Status } from './types'

// ④ status を props で受け取る（型は Status）
const labels: Record<Status, string> = {
  open: '受付中',
  pending: '対応中',
  closed: '完了',
}
</script>

<template>
  <!-- ④ status ごとに class を変える（badge-open / badge-pending / badge-closed）。:class を使う -->
  <span class="badge">{{ labels[status] }}</span>
</template>
`;

    lock('x-vue-dynamic', web({
      height: 340,
      alias: { 'App.vue': 'LawyerTabsPage.vue' },
      paths: {
        'App.vue': 'src/views/LawyerTabsPage.vue',
        'ProfileTab.vue': 'src/components/tabs/ProfileTab.vue',
        'ReserveTab.vue': 'src/components/tabs/ReserveTab.vue',
        'ReviewTab.vue': 'src/components/tabs/ReviewTab.vue',
        'StatusBadge.vue': 'src/components/StatusBadge.vue',
        'types.ts': 'src/types.ts',
      },
      fileNotes: {
        'App.vue': '親：タブの切り替え・進み具合のバー・案件の一覧',
        'ProfileTab.vue': 'タブ 1：弁護士のプロフィール（name / field を受け取る）',
        'ReserveTab.vue': 'タブ 2：予約フォーム（入力欄あり）',
        'ReviewTab.vue': 'タブ 3：口コミ',
        'StatusBadge.vue': '子：ステータスのバッジ（status で色が変わる）',
        'types.ts': '型：TabKey / Status / Lawyer / Consult',
      },
      starter: { 'App.vue': APP, 'ProfileTab.vue': PROFILE, 'ReserveTab.vue': RESERVE, 'ReviewTab.vue': REVIEW, 'StatusBadge.vue': BADGE, 'types.ts': TYPES },
      steps: [
        {
          key: 'm1', level: 1, file: 'App.vue',
          label: 'タブのボタンを押すと、その画面（プロフィール・予約・口コミ）に切り替わる（:is）',
          hint: ['部品を切り替えて出すには <code>&lt;component&gt;</code> に <code>:is</code> で部品を渡す。', '部品は <code>tabs[current]</code>。ボタンを押すと current が変わる。', '<code>&lt;component :is="tabs[current]" /&gt;</code>'],
          edits: [['    <!-- ① <component :is> で、今のタブの部品を出す（部品は tabs[current]） -->\n', '    <component :is="tabs[current]" />\n']],
        },
        {
          key: 'm2', level: 1, file: 'App.vue',
          label: '今のタブのボタンだけに class「active」が付く（:class）',
          hint: ['class を条件で付けるのは <code>:class="{ クラス名: 条件 }"</code>。', '<code>:class="{ active: current === key }"</code> をボタンに足す。'],
          edits: [['    <!-- ② 今のタブのボタンだけ class="active" にする（:class のオブジェクト構文） -->\n    <button v-for="key in keys" :key="key" @click="current = key">', '    <button v-for="key in keys" :key="key" :class="{ active: current === key }" @click="current = key">']],
        },
        {
          key: 'm3', level: 1, file: 'App.vue',
          label: '進み具合のバーが 40% の幅で出て、「進める」を押すと 60% になる（:style）',
          hint: ['数に応じて CSS を変えるのは <code>:style</code>。オブジェクトで書く。', '<code>:style="{ width: progress + \'%\' }"</code> を、bar の div に付ける。'],
          edits: [['    <!-- ③ バーの幅を progress % にする（:style） -->\n    <div class="bar"></div>', '    <div class="bar" :style="{ width: progress + \'%\' }"></div>']],
        },
        {
          key: 'm4', level: 2, file: 'App.vue',
          label: '案件のバッジに「受付中」「対応中」「完了」と出て、ステータスごとに class が変わる',
          hint: ['子（StatusBadge.vue）は <code>defineProps&lt;{ status: Status }&gt;()</code> で status を受け取る。', '<code>:class</code> に文字列をつなげると、class 名を作れる：<code>:class="\'badge-\' + status"</code>。', 'span は <code>&lt;span class="badge" :class="\'badge-\' + status"&gt;</code>（普通の class と :class は一緒に書ける）。'],
          edits: [],
          also: [
            ['StatusBadge.vue', '// ④ status を props で受け取る（型は Status）\n', 'defineProps<{ status: Status }>()\n\n'],
            ['StatusBadge.vue', '  <!-- ④ status ごとに class を変える（badge-open / badge-pending / badge-closed）。:class を使う -->\n  <span class="badge">', '  <span class="badge" :class="\'badge-\' + status">'],
          ],
        },
        {
          key: 'm5', level: 2, file: 'App.vue',
          label: '予約タブに書いた文字が、他のタブに行って戻っても消えない（KeepAlive）',
          hint: ['切り替えると部品は作り直されるので、入力が消える。<code>&lt;KeepAlive&gt;</code> で包むと、状態を残したまま隠せる。', '<code>&lt;KeepAlive&gt;&lt;component :is="tabs[current]" /&gt;&lt;/KeepAlive&gt;</code>'],
          edits: [['    <component :is="tabs[current]" />\n    <!-- ⑤（中級）<KeepAlive> で包んで、タブを切り替えても入力を残す -->\n', '    <KeepAlive>\n      <component :is="tabs[current]" />\n    </KeepAlive>\n']],
        },
        {
          key: 'm6', level: 3, file: 'App.vue',
          label: 'プロフィールのタブに「田中 一郎（労働問題）」と出る（v-bind でオブジェクトをまとめて渡す）',
          hint: ['<code>v-bind="オブジェクト"</code> と書くと、キーが 1 つずつ props になって渡る。', '親：<code>&lt;component :is="tabs[current]" v-bind="lawyer" /&gt;</code>。', '子（ProfileTab.vue）：<code>defineProps&lt;{ name: string; field: string }&gt;()</code>。'],
          edits: [
            ['      <component :is="tabs[current]" />\n    </KeepAlive>\n    <!-- ⑥（上級）v-bind="lawyer" で、name と field をまとめて渡す（ProfileTab 側は props で受け取る） -->\n', '      <component :is="tabs[current]" v-bind="lawyer" />\n    </KeepAlive>\n'],
          ],
          also: [['ProfileTab.vue', '// ⑥ 親から v-bind で渡される name と field を、props で受け取る（どちらも string）\n', 'defineProps<{ name: string; field: string }>()\n']],
        },
      ],
      probe: async (win, doc) => {
        const out = {};
        const h3 = () => ((doc.querySelector('main h3') || {}).textContent || '').trim();
        const nav = () => [...doc.querySelectorAll('nav button')];
        const click = async (i) => { const b = nav()[i]; if (b) { b.click(); await nt(win); } };
        const who = doc.querySelector('main .who');
        out.m6 = !!who && /田中 一郎/.test(who.textContent) && /労働問題/.test(who.textContent);
        const first = h3();
        await click(1); const second = h3();
        const act1 = nav().map((b) => b.classList.contains('active')).join(',');
        await click(2); const third = h3();
        const act2 = nav().map((b) => b.classList.contains('active')).join(',');
        out.m1 = first === '弁護士プロフィール' && second === '予約フォーム' && third === '口コミ';
        out.m2 = act1 === 'false,true,false' && act2 === 'false,false,true';
        const bar = doc.querySelector('.bar');
        const w0 = bar ? bar.style.width : '';
        const go = [...doc.querySelectorAll('button')].find((b) => b.textContent.trim() === '進める');
        if (go) { go.click(); await nt(win); }
        out.m3 = w0 === '40%' && !!bar && bar.style.width === '60%';
        const badges = [...doc.querySelectorAll('.badge')];
        out.m4 = badges.length === 3
          && badges.map((b) => b.textContent.trim()).join(',') === '受付中,対応中,完了'
          && ['badge-open', 'badge-pending', 'badge-closed'].every((c, i) => badges[i].classList.contains(c));
        await click(1);
        const inp = doc.querySelector('main input');
        if (inp) { await type(win, inp, 'ご要望'); await click(0); await click(1); }
        const again = doc.querySelector('main input');
        out.m5 = !!again && again.value === 'ご要望';
        return out;
      },
    }));
  }

  /* =====================================================================
     x-vue-composables：useCounter / useToggle / useFetch<T>
     ファイル：SeatRegisterPage.vue ＋ useCounter.ts / useToggle.ts / useFetch.ts ＋ api.ts / types.ts
     ===================================================================== */
  {
    const TYPES = `// 相談案件 1 件の「形」
export interface Case {
  id: number
  title: string
}
`;

    const API = `import type { Case } from './types'

// 本物の API のかわりに、150ms 待ってから案件を返すニセの関数
export function fetchCases(): Promise<Case[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: '未払い残業代の相談' },
        { id: 2, title: '契約書チェックの依頼' },
        { id: 3, title: '交通事故の示談' },
      ])
    }, 150)
  })
}
`;

    const COUNTER = `import { ref } from 'vue'

// 数を数える部品（composable）。人数のカウンターなど、何度でも使い回せる
export function useCounter(initial: number = 0) {
  // ① count を ref<number> で作る（最初の値は initial）

  // ② increment(): void を作る（count を 1 増やす）

  // ④ decrement(): void を作る（1 減らす。ただし 0 より小さくしない）

  // 作ったものは return で、使う側に返す
  return {}
}
`;

    const TOGGLE = `import { ref } from 'vue'

// 開く / 閉じるを切り替える部品（composable）
export function useToggle(initial: boolean = false) {
  const isOpen = ref<boolean>(initial)

  function toggle(): void {
    isOpen.value = !isOpen.value
  }

  return { isOpen, toggle }
}
`;

    const FETCH = `import { ref } from 'vue'

// どんな型のデータでも取ってこられる部品（T は、取ってくるデータの型）
export function useFetch<T>(fetcher: () => Promise<T>) {
  const data = ref<T | null>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  async function load(): Promise<void> {
    // ⑥ loading を true にして、await fetcher() の結果を data に入れる
    //    失敗したら error にメッセージを入れ、最後は必ず loading を false にする（try / catch / finally）
  }

  return { data, loading, error, load }
}
`;

    const APP = `<script setup lang="ts">
import type { Case } from './types'
import { useCounter } from './useCounter'
import { useToggle } from './useToggle'
import { useFetch } from './useFetch'
import { fetchCases } from './api'

// 同じ useCounter を使って、大人の人数を数える
const { count: adults, increment: addAdult, decrement: removeAdult } = useCounter(1)
// ⑤ 子どもの人数も useCounter で数える（大人とは別々に増減する）。count: kids / increment: addKid / decrement: removeKid
// ③ useToggle() から isOpen と toggle を取り出す
const { data: cases, loading, load } = useFetch<Case[]>(fetchCases)
</script>

<template>
  <section>
    <h2>同席者の登録</h2>
    <p class="adults">大人：{{ adults }} 名</p>
    <button @click="removeAdult">大人 −</button>
    <button @click="addAdult">大人 ＋</button>
    <!-- ⑤ 子ども用の行を足す：<p class="kids">子ども：… 名</p> と「子ども −」「子ども ＋」ボタン -->
    <hr />
    <button @click="toggle">詳細</button>
    <p v-if="isOpen" class="detail">同席できるのは、ご本人と親族の方までです。</p>
    <hr />
    <button @click="load">案件を読み込む</button>
    <p v-if="loading" class="state">読み込み中…</p>
    <ul v-else>
      <li v-for="c in (cases || [])" :key="c.id">{{ c.title }}</li>
    </ul>
  </section>
</template>
`;

    lock('x-vue-composables', web({
      height: 340,
      alias: { 'App.vue': 'SeatRegisterPage.vue' },
      paths: {
        'App.vue': 'src/views/SeatRegisterPage.vue',
        'useCounter.ts': 'src/composables/useCounter.ts',
        'useToggle.ts': 'src/composables/useToggle.ts',
        'useFetch.ts': 'src/composables/useFetch.ts',
        'api.ts': 'src/api.ts',
        'types.ts': 'src/types.ts',
      },
      fileNotes: {
        'App.vue': '親：画面。composable を呼んで、取り出したものを template で使う',
        'useCounter.ts': 'composable：数を数える（count / increment / decrement）',
        'useToggle.ts': 'composable：開閉の切り替え（できあがっている）',
        'useFetch.ts': 'composable：どんな型でも取得できる useFetch<T>（loading / error / data）',
        'api.ts': 'ニセの API（150ms 待って返す）',
        'types.ts': '型だけを書くファイル（interface Case）',
      },
      starter: { 'App.vue': APP, 'useCounter.ts': COUNTER, 'useToggle.ts': TOGGLE, 'useFetch.ts': FETCH, 'api.ts': API, 'types.ts': TYPES },
      steps: [
        {
          key: 'm1', level: 1, file: 'useCounter.ts',
          label: '画面に「大人：1 名」と、最初の人数が出る（ref を作って return する）',
          hint: ['composable の中で <code>ref</code> を作り、<code>return</code> で使う側に返す。', '<code>const count = ref&lt;number&gt;(initial)</code> と <code>return { count }</code>。'],
          edits: [
            ['  // ① count を ref<number> で作る（最初の値は initial）\n\n', '  const count = ref<number>(initial)\n\n'],
            ['  return {}', '  return { count }'],
          ],
        },
        {
          key: 'm2', level: 1, file: 'useCounter.ts',
          label: '「大人 ＋」を押すと、人数が 1 ずつ増える（increment）',
          hint: ['count を 1 増やす関数を作って、return に足す。ref は <code>.value</code> で書き換える。', '<code>function increment(): void { count.value++ }</code> と <code>return { count, increment }</code>。'],
          edits: [
            ['  // ② increment(): void を作る（count を 1 増やす）\n\n', '  function increment(): void {\n    count.value++\n  }\n\n'],
            ['  return { count }', '  return { count, increment }'],
          ],
        },
        {
          key: 'm3', level: 1, file: 'App.vue',
          label: '「詳細」を押すと説明が出て、もう一度押すと消える（useToggle を使う）',
          hint: ['useToggle はできあがっている。呼んで、返ってきたものを取り出せばよい。', '<code>const { isOpen, toggle } = useToggle()</code>'],
          edits: [['// ③ useToggle() から isOpen と toggle を取り出す\n', 'const { isOpen, toggle } = useToggle()\n']],
        },
        {
          key: 'm4', level: 2, file: 'useCounter.ts',
          label: '「大人 −」で人数が減るが、0 より小さくはならない（decrement）',
          hint: ['count が 0 より大きいときだけ減らす。', '<code>function decrement(): void { if (count.value &gt; 0) count.value-- }</code> を作り、return に足す。'],
          edits: [
            ['  // ④ decrement(): void を作る（1 減らす。ただし 0 より小さくしない）\n\n', '  function decrement(): void {\n    if (count.value > 0) {\n      count.value--\n    }\n  }\n\n'],
            ['  return { count, increment }', '  return { count, increment, decrement }'],
          ],
        },
        {
          key: 'm5', level: 2, file: 'App.vue',
          label: '「子ども：0 名」の行を足し、大人の人数とは別々に増える（同じ composable を 2 回呼ぶ）',
          hint: ['composable は、呼ぶたびに新しい状態ができる。もう 1 回 <code>useCounter(0)</code> を呼べば、別の数え方になる。', '名前がぶつからないよう、取り出すときに <code>count: kids</code> のように別名を付ける。', '<code>const { count: kids, increment: addKid, decrement: removeKid } = useCounter(0)</code> と、template の <code>&lt;p class="kids"&gt;子ども：{{ kids }} 名&lt;/p&gt;</code> ＋ボタン 2 つ。'],
          edits: [
            ['// ⑤ 子どもの人数も useCounter で数える（大人とは別々に増減する）。count: kids / increment: addKid / decrement: removeKid\n', 'const { count: kids, increment: addKid, decrement: removeKid } = useCounter(0)\n'],
            ['    <!-- ⑤ 子ども用の行を足す：<p class="kids">子ども：… 名</p> と「子ども −」「子ども ＋」ボタン -->\n', '    <p class="kids">子ども：{{ kids }} 名</p>\n    <button @click="removeKid">子ども −</button>\n    <button @click="addKid">子ども ＋</button>\n'],
          ],
        },
        {
          key: 'm6', level: 3, file: 'useFetch.ts',
          label: '「案件を読み込む」で読み込み中が出たあと 3 件並び、失敗しても止まらない型付き useFetch<T> を完成させる',
          hint: ['load の中を <code>try / catch / finally</code> にする。取得結果は <code>data.value = await fetcher()</code>。', 'loading は先頭で true、<code>finally</code> で false。失敗は <code>error.value</code> に入れる。', '<code>loading.value = true</code> → <code>try { data.value = await fetcher() } catch (e) { error.value = … } finally { loading.value = false }</code>'],
          edits: [['    // ⑥ loading を true にして、await fetcher() の結果を data に入れる\n    //    失敗したら error にメッセージを入れ、最後は必ず loading を false にする（try / catch / finally）\n', '    loading.value = true\n    error.value = null\n    try {\n      data.value = await fetcher()\n    } catch (e) {\n      error.value = e instanceof Error ? e.message : \'通信に失敗しました\'\n    } finally {\n      loading.value = false\n    }\n']],
        },
      ],
      probe: async (win, doc) => {
        const out = {};
        const num = (sel) => { const p = doc.querySelector(sel); const m = p && p.textContent.match(/\d+/); return m ? +m[0] : -1; };
        const btn = (t) => [...doc.querySelectorAll('button')].find((b) => b.textContent.trim() === t);
        const click = async (t) => { const b = btn(t); if (b) { b.click(); await nt(win); } };
        const a0 = num('.adults');
        await click('大人 ＋'); const a1 = num('.adults');
        await click('大人 −'); const a2 = num('.adults');
        await click('大人 −'); const a3 = num('.adults');
        await click('大人 −'); const a4 = num('.adults');
        out.m1 = a0 === 1;
        out.m2 = a0 === 1 && a1 === 2;
        out.m4 = a2 === 1 && a3 === 0 && a4 === 0;
        const k0 = num('.kids');
        await click('子ども ＋'); const k1 = num('.kids');
        out.m5 = k0 === 0 && k1 === 1 && num('.adults') === a4;
        const d0 = !!doc.querySelector('.detail');
        await click('詳細'); const d1 = !!doc.querySelector('.detail');
        await click('詳細'); const d2 = !!doc.querySelector('.detail');
        out.m3 = !d0 && d1 && !d2;
        const lb = btn('案件を読み込む');
        if (lb) {
          lb.click(); await wait(40);
          const saw = doc.body.textContent.includes('読み込み中');
          const got = await until(() => doc.querySelectorAll('section li').length === 3, 1500);
          out.m6 = saw && got;
        }
        return out;
      },
    }));
  }

  /* =====================================================================
     x-vue-state：共有ステート（Pinia 風の store）と Event Bus
     ファイル：NoticeCenterPage.vue ＋ NoticeHeader / NoticeList / NoticeItem / ToastArea ＋ noticeStore.ts / eventBus.ts / types.ts
     ===================================================================== */
  {
    const TYPES = `// お知らせ 1 件の「形」
export interface Notice {
  id: number
  title: string
  read: boolean
}
`;

    const BUS = `// 部品どうしを直接つながずに知らせる「掲示板」（Event Bus の最小版）
type NoticeReadHandler = (title: string) => void

const noticeReadHandlers: NoticeReadHandler[] = []

// 「既読になった」を聞きたい部品が、登録する
export function onNoticeRead(handler: NoticeReadHandler): void {
  noticeReadHandlers.push(handler)
}

// 聞かなくなったら、外す（外し忘れると、消えた部品にも届き続ける）
export function offNoticeRead(handler: NoticeReadHandler): void {
  const i = noticeReadHandlers.indexOf(handler)
  if (i >= 0) {
    noticeReadHandlers.splice(i, 1)
  }
}

// 既読になったことを、登録した全員に知らせる
export function emitNoticeRead(title: string): void {
  noticeReadHandlers.forEach((handler) => handler(title))
}
`;

    const STORE = `import { ref, computed } from 'vue'
import type { Notice } from './types'
import { emitNoticeRead } from './eventBus'

// 関数の外に置くので、どの部品から呼んでも「同じ 1 つ」を使う（これが共有ステート）
const notices = ref<Notice[]>([
  { id: 1, title: '期日のお知らせ', read: false },
  { id: 2, title: '書類の提出依頼', read: false },
  { id: 3, title: '面談日程の確認', read: false },
])

const unread = computed<number>(() => notices.value.filter((n) => !n.read).length)

function markRead(id: number): void {
  const target = notices.value.find((n) => n.id === id)
  if (target) {
    target.read = true
    emitNoticeRead(target.title)
  }
}

function markAllRead(): void {
  // ④ すべてのお知らせの read を true にする
}

// 部品は、これを呼んで必要なものを取り出す（Pinia の useXxxStore と同じ使い方）
export function useNoticeStore() {
  return { notices, unread, markRead, markAllRead }
}
`;

    const APP = `<script setup lang="ts">
import { ref } from 'vue'
import NoticeHeader from './NoticeHeader.vue'
import NoticeList from './NoticeList.vue'
import ToastArea from './ToastArea.vue'

// props を 1 つも渡していない：3 つの部品は、それぞれ store から直接読み書きする
const showToast = ref<boolean>(true)
</script>

<template>
  <NoticeHeader />
  <NoticeList />
  <label class="toast-switch">
    <input v-model="showToast" type="checkbox" />
    トースト表示
  </label>
  <ToastArea v-if="showToast" />
</template>
`;

    const HEADER = `<script setup lang="ts">
import { useNoticeStore } from './noticeStore'

// ③ useNoticeStore() から unread を取り出す
// ④ markAllRead も取り出して、「すべて既読」ボタンにつなぐ
</script>

<template>
  <header class="notice-header">
    <h2>お知らせ</h2>
    <span class="badge">未読 {{ unread }} 件</span>
    <button>すべて既読</button>
  </header>
</template>
`;

    const LIST = `<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Notice } from './types'
import { useNoticeStore } from './noticeStore'
import NoticeItem from './NoticeItem.vue'

// ① useNoticeStore() から notices を取り出す
// ⑤ onlyUnread（ref<boolean>）と、それで絞った visible（computed）を作る
</script>

<template>
  <div class="notice-list">
    <!-- ⑤ チェックボックスを onlyUnread につなぎ、一覧は visible を並べる -->
    <ul>
      <NoticeItem v-for="n in notices" :key="n.id" :notice="n" />
    </ul>
  </div>
</template>
`;

    const ITEM = `<script setup lang="ts">
import type { Notice } from './types'
import { useNoticeStore } from './noticeStore'

defineProps<{ notice: Notice }>()
// ② useNoticeStore() から markRead を取り出す
</script>

<template>
  <li class="notice" :class="{ read: notice.read }">
    <span>{{ notice.title }}</span>
    <small v-if="notice.read">既読</small>
    <button @click="markRead(notice.id)">既読にする</button>
  </li>
</template>
`;

    const TOAST = `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { onNoticeRead, offNoticeRead } from './eventBus'

const message = ref<string>('')

// ⑥ 既読になったら message を「◯◯を既読にしました」にする
//    表示されたときに onNoticeRead で登録し、消えるときに offNoticeRead で外す（onMounted / onUnmounted）
</script>

<template>
  <p class="toast">{{ message }}</p>
</template>
`;

    lock('x-vue-state', web({
      height: 340,
      alias: { 'App.vue': 'NoticeCenterPage.vue' },
      paths: {
        'App.vue': 'src/views/NoticeCenterPage.vue',
        'NoticeHeader.vue': 'src/components/NoticeHeader.vue',
        'NoticeList.vue': 'src/components/NoticeList.vue',
        'NoticeItem.vue': 'src/components/NoticeItem.vue',
        'ToastArea.vue': 'src/components/ToastArea.vue',
        'noticeStore.ts': 'src/stores/noticeStore.ts',
        'eventBus.ts': 'src/utils/eventBus.ts',
        'types.ts': 'src/types.ts',
      },
      fileNotes: {
        'App.vue': '親：3 つの部品を並べるだけ（データは渡さない）',
        'NoticeHeader.vue': '部品：未読の件数と「すべて既読」（store を読む）',
        'NoticeList.vue': '部品：お知らせの一覧（store を読む）',
        'NoticeItem.vue': '部品：1 件ぶん。「既読にする」で store を書き換える',
        'ToastArea.vue': '部品：既読になったことを Event Bus で聞いて、メッセージを出す',
        'noticeStore.ts': '共有ステート：お知らせの置き場と、読み書きの関数（Pinia 風）',
        'eventBus.ts': 'Event Bus：「既読になった」を知らせる掲示板',
        'types.ts': '型だけを書くファイル（interface Notice）',
      },
      starter: {
        'App.vue': APP, 'NoticeHeader.vue': HEADER, 'NoticeList.vue': LIST, 'NoticeItem.vue': ITEM, 'ToastArea.vue': TOAST,
        'noticeStore.ts': STORE, 'eventBus.ts': BUS, 'types.ts': TYPES,
      },
      steps: [
        {
          key: 'm1', level: 1, file: 'NoticeList.vue',
          label: '一覧にお知らせが 3 件並ぶ（store から notices を取り出す）',
          hint: ['データは親から props で受け取らず、store（<code>useNoticeStore()</code>）から直接取り出す。', '<code>const { notices } = useNoticeStore()</code>'],
          edits: [['// ① useNoticeStore() から notices を取り出す\n', 'const { notices } = useNoticeStore()\n']],
        },
        {
          key: 'm2', level: 1, file: 'NoticeItem.vue',
          label: '「既読にする」を押すと、そのお知らせが「既読」の表示になる（store の markRead）',
          hint: ['store が持つ <code>markRead</code> を取り出して、ボタンから呼ぶ（ボタンは書いてある）。', '<code>const { markRead } = useNoticeStore()</code>。書き換えるのは store の中身なので、一覧も自動で変わる。'],
          edits: [['// ② useNoticeStore() から markRead を取り出す\n', 'const { markRead } = useNoticeStore()\n']],
        },
        {
          key: 'm3', level: 1, file: 'NoticeHeader.vue',
          label: 'ヘッダーに「未読 3 件」と出て、既読にすると「未読 2 件」に減る（props なしで共有）',
          hint: ['ヘッダーと一覧は親子ではないが、同じ store を見ているので数が合う。', '<code>const { unread } = useNoticeStore()</code>'],
          edits: [['// ③ useNoticeStore() から unread を取り出す\n', 'const { unread } = useNoticeStore()\n']],
        },
        {
          key: 'm4', level: 2, file: 'NoticeHeader.vue',
          label: '「すべて既読」を押すと、全部が既読になり「未読 0 件」になる',
          hint: ['store の <code>markAllRead</code> の中身を書く（全件の read を true に）。', 'ヘッダーでは <code>markAllRead</code> を取り出して、ボタンに <code>@click="markAllRead"</code>。', 'store：<code>notices.value.forEach((n) =&gt; { n.read = true })</code>。ヘッダー：<code>const { unread, markAllRead } = useNoticeStore()</code>。'],
          edits: [
            ['const { unread } = useNoticeStore()\n// ④ markAllRead も取り出して、「すべて既読」ボタンにつなぐ\n', 'const { unread, markAllRead } = useNoticeStore()\n'],
            ['<button>すべて既読</button>', '<button @click="markAllRead">すべて既読</button>'],
          ],
          also: [['noticeStore.ts', '  // ④ すべてのお知らせの read を true にする\n', '  notices.value.forEach((n) => {\n    n.read = true\n  })\n']],
        },
        {
          key: 'm5', level: 2, file: 'NoticeList.vue',
          label: '「未読だけ表示」にチェックすると、未読のお知らせだけが並ぶ（computed で絞る）',
          hint: ['チェックの状態を <code>ref&lt;boolean&gt;</code> で持ち、<code>computed</code> で絞った一覧を作る。', 'ref は script では <code>.value</code>：<code>onlyUnread.value ? notices.value.filter((n) =&gt; !n.read) : notices.value</code>。', 'template：<code>&lt;input v-model="onlyUnread" type="checkbox" /&gt;</code> と、<code>v-for="n in visible"</code>。'],
          edits: [
            ['// ⑤ onlyUnread（ref<boolean>）と、それで絞った visible（computed）を作る\n', 'const onlyUnread = ref<boolean>(false)\nconst visible = computed<Notice[]>(() =>\n  onlyUnread.value ? notices.value.filter((n) => !n.read) : notices.value\n)\n'],
            ['    <!-- ⑤ チェックボックスを onlyUnread につなぎ、一覧は visible を並べる -->\n    <ul>\n      <NoticeItem v-for="n in notices"', '    <label class="only-unread">\n      <input v-model="onlyUnread" type="checkbox" />\n      未読だけ表示\n    </label>\n    <ul>\n      <NoticeItem v-for="n in visible"'],
          ],
        },
        {
          key: 'm6', level: 3, file: 'ToastArea.vue',
          label: '既読にすると「◯◯を既読にしました」と出て、トーストを消したら登録も外れる（Event Bus ＋ onUnmounted）',
          hint: ['表示されたとき（<code>onMounted</code>）に <code>onNoticeRead(関数)</code> で登録し、消えるとき（<code>onUnmounted</code>）に <code>offNoticeRead(同じ関数)</code> で外す。', '登録と解除には、同じ関数（名前を付けたもの）を渡す。外し忘れると、消えた部品にも通知が届き続ける。', '<code>function show(title: string): void { message.value = title + \'を既読にしました\' }</code> を作り、<code>onMounted(() =&gt; { onNoticeRead(show) })</code> と <code>onUnmounted(() =&gt; { offNoticeRead(show) })</code>。'],
          edits: [['// ⑥ 既読になったら message を「◯◯を既読にしました」にする\n//    表示されたときに onNoticeRead で登録し、消えるときに offNoticeRead で外す（onMounted / onUnmounted）\n', 'function show(title: string): void {\n  message.value = title + \'を既読にしました\'\n}\n\nonMounted(() => {\n  onNoticeRead(show)\n})\n\nonUnmounted(() => {\n  offNoticeRead(show)\n})\n']],
        },
      ],
      /* 順番：一覧 → 1 件既読 → 絞り込み → 2 件目を既読（トースト）→ トースト消し → すべて既読 */
      probe: async (win, doc) => {
        const out = {};
        const items = () => [...doc.querySelectorAll('.notice')];
        const unread = () => { const b = doc.querySelector('.notice-header .badge'); const m = b && b.textContent.match(/\d+/); return m ? +m[0] : -1; };
        out.m1 = items().map((n) => n.querySelector('span').textContent.trim()).join(',') === '期日のお知らせ,書類の提出依頼,面談日程の確認';
        const u0 = unread();
        const b0 = items()[0] && items()[0].querySelector('button');
        if (b0) { b0.click(); await nt(win); }
        out.m2 = !!items()[0] && items()[0].classList.contains('read') && /既読/.test(items()[0].textContent);
        out.m3 = u0 === 3 && unread() === 2;
        const cb = doc.querySelector('.only-unread input');
        if (cb) {
          cb.click(); await nt(win); const n1 = items().length;
          cb.click(); await nt(win); const n2 = items().length;
          out.m5 = n1 === 2 && n2 === 3;
        }
        const b1 = items()[1] && items()[1].querySelector('button');
        if (b1) { b1.click(); await nt(win); }
        const toast = doc.querySelector('.toast');
        const shown = !!toast && toast.textContent.includes('書類の提出依頼を既読にしました');
        const sw = doc.querySelector('.toast-switch input');
        if (sw) { sw.click(); await nt(win); }
        let handlers = -1;
        try { handlers = win.eval('noticeReadHandlers.length'); } catch (e) { handlers = -1; }
        out.m6 = shown && !doc.querySelector('.toast') && handlers === 0;
        const all = [...doc.querySelectorAll('.notice-header button')].find((b) => b.textContent.includes('すべて既読'));
        if (all) { all.click(); await nt(win); }
        out.m4 = !!all && items().length > 0 && items().every((n) => n.classList.contains('read')) && unread() === 0;
        return out;
      },
    }));
  }
})();
