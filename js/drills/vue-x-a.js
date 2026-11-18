/* 練習（vue-intro / vue-env / vue-basics 冒頭）: .vue ＋ 型（interface・defineProps）の複数ファイル版。
   drills/vue.js の後に読み込み、同じシーン名の練習を上書きする。 */
(function () {
  const K = window.KENSHU;
  const D = K.drills;
  const { multi, text, T, appText, $q, $all, lines } = K.vueDrillTools;

  /* コードを読みやすく書くための小道具。§ はバッククォート、¤ はドル記号 */
  const F = (s) => s.replace(/^\n/, '').replace(/§/g, '`').replace(/¤/g, '$');
  const C = (code, lang) => ({ code: F(code), lang: lang || 'ts' });
  const A = (file, ...find) => ({ file, find });
  /* コメントを除いた中身（TODO コメントに答えが書いてあっても、正解扱いにならないように） */
  const nc = (s) => String(s || '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const tpl = (s) => { const m = nc(s).match(/<template>([\s\S]*)<\/template>/); return m ? m[1] : ''; };
  const set = (lesson, title, drill) => { (D[lesson] = D[lesson] || {})[title] = drill; };
  const vue = (files, sol, tasks, o) => {
    const fs = {}; Object.keys(files).forEach((k) => { fs[k] = F(files[k]); });
    const ss = {}; Object.keys(sol).forEach((k) => { ss[k] = F(sol[k]); });
    return multi(fs, ss, tasks, Object.assign({ height: 320 }, o || {}));
  };

  /* ===================== vue-intro ===================== */

  set('vue-intro', 'フロントエンドって何？', vue({
    'reservation.ts': `
export interface Slot {
  id: number
  time: string
  booked: boolean
}
`,
    'SlotRow.vue': `
<script setup lang="ts">
// ① 親から time と booked を受け取る（props）。型も書く
//    defineProps<{ time: string; booked: boolean }>()

// ④ 「予約する」が押されたことを親に知らせる（emit）。名前は reserve
//    const emit = defineEmits<{ reserve: [] }>()
</script>

<template>
  <li class="slot">
    <!-- ② 時間 {{ time }} を出し、空いているときだけ「予約する」ボタン、埋まっていれば「予約済み」を出す（v-if / v-else） -->
    <!-- ④ ボタンを押したら emit('reserve') -->
  </li>
</template>
`,
    'App.vue': `
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Slot } from './reservation'
import SlotRow from './SlotRow.vue'

const slots = ref<Slot[]>([
  { id: 1, time: '10:00', booked: false },
  { id: 2, time: '11:00', booked: true },
  { id: 3, time: '14:00', booked: false },
])
const message = ref<string>('')

// ⑤ 子から reserve が届いたら、その枠を booked: true にして、message に「10:00 を予約しました」と入れる関数 reserve(id)

// ⑥ 空いている枠の数を computed で数える（remaining）
</script>

<template>
  <h2>初回相談の予約</h2>
  <ul>
    <!-- ③ slots を v-for で SlotRow に並べる（:key、:time、:booked、@reserve="reserve(s.id)"） -->
  </ul>
  <p>{{ message }}</p>
  <p>残り {{ remaining }} 枠</p>
</template>
`,
  }, {
    'reservation.ts': `
export interface Slot {
  id: number
  time: string
  booked: boolean
}
`,
    'SlotRow.vue': `
<script setup lang="ts">
defineProps<{ time: string; booked: boolean }>()
const emit = defineEmits<{ reserve: [] }>()
</script>

<template>
  <li class="slot">
    <span>{{ time }}</span>
    <button v-if="!booked" @click="emit('reserve')">予約する</button>
    <span v-else>予約済み</span>
  </li>
</template>
`,
    'App.vue': `
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Slot } from './reservation'
import SlotRow from './SlotRow.vue'

const slots = ref<Slot[]>([
  { id: 1, time: '10:00', booked: false },
  { id: 2, time: '11:00', booked: true },
  { id: 3, time: '14:00', booked: false },
])
const message = ref<string>('')

function reserve(id: number): void {
  const target = slots.value.find((s) => s.id === id)
  if (!target) return
  target.booked = true
  message.value = target.time + ' を予約しました'
}

const remaining = computed<number>(() => slots.value.filter((s) => !s.booked).length)
</script>

<template>
  <h2>初回相談の予約</h2>
  <ul>
    <SlotRow v-for="s in slots" :key="s.id" :time="s.time" :booked="s.booked" @reserve="reserve(s.id)" />
  </ul>
  <p>{{ message }}</p>
  <p>残り {{ remaining }} 枠</p>
</template>
`,
  }, (v, c) => {
    const row = nc(v['SlotRow.vue']), page = nc(v['App.vue']);
    return [
      T('SlotRow.vue：time と booked を props（型つき）で受け取る', 1, /defineProps\s*<\s*\{[^}]*time\s*:\s*string[^}]*booked\s*:\s*boolean/.test(row), ['親から受け取る値は defineProps で宣言する。型も一緒に書く。', C('defineProps<{ time: string; booked: boolean }>()')], A('SlotRow.vue', '① 親から')),
      T('SlotRow.vue：時間を出し、空きなら「予約する」、埋まりなら「予約済み」を出す', 1, /\{\{\s*time\s*\}\}/.test(tpl(row)) && /v-if\s*=\s*["']!?booked["']/.test(row) && /v-else/.test(row) && /予約する/.test(tpl(row)) && /予約済み/.test(tpl(row)), ['v-if と v-else はセット。booked の true / false で切り替える。', C("<span>{{ time }}</span>\n<button v-if=\"!booked\">予約する</button>\n<span v-else>予約済み</span>", 'vue')], A('SlotRow.vue', '② 時間')),
      T('予約ページ：slots を v-for で SlotRow に並べる（3行出る）', 1, /<SlotRow[^>]*v-for/.test(page) && /:key\s*=/.test(page) && /:time\s*=/.test(page) && /:booked\s*=/.test(page) && $all(c, 'li.slot').length === 3, ['配列の1件ごとに、子を1つ出す。:key を忘れずに。', C('<SlotRow v-for="s in slots" :key="s.id" :time="s.time" :booked="s.booked" />', 'vue')], A('App.vue', '③ slots を')),
      T('SlotRow.vue：ボタンで emit(\'reserve\') を送る（defineEmits で型つき）', 2, /defineEmits\s*<\s*\{\s*reserve\s*:\s*\[\s*\]/.test(row) && /emit\s*\(\s*['"]reserve['"]\s*\)/.test(row), ['子は自分でデータを変えず、「押されたよ」と親に知らせる。', C("const emit = defineEmits<{ reserve: [] }>()\n// <button @click=\"emit('reserve')\">")], A('SlotRow.vue', '④ 「予約する」', '④ ボタン')),
      T('予約ページ：@reserve を受けて reserve(id) で booked を true にし、message を更新する', 2, /@reserve\s*=\s*["']reserve\(\s*\w+\.id\s*\)["']/.test(page) && /(function\s+reserve|const\s+reserve\s*=)/.test(page) && /booked\s*=\s*true/.test(page) && /message\.value\s*=/.test(page), ['配列の中の1件を find で探して、booked を true に。', C("function reserve(id: number): void {\n  const target = slots.value.find((s) => s.id === id)\n  if (!target) return\n  target.booked = true\n  message.value = target.time + ' を予約しました'\n}")], A('App.vue', '⑤ 子から')),
      T('予約ページ：空き枠の数を computed で数え、「残り 2 枠」と出す', 3, /computed\s*(<[^>]*>)?\s*\(/.test(page) && /\.filter\s*\(.*booked/.test(page) && /残り\s*2\s*枠/.test(appText(c)), ['空いている枠だけ filter で絞り、その length を数える。', C('const remaining = computed<number>(() => slots.value.filter((s) => !s.booked).length)')], A('App.vue', '⑥ 空いている')),
    ];
  }, {
    alias: { 'App.vue': 'ReservationPage.vue' },
    paths: { 'App.vue': 'src/pages/ReservationPage.vue', 'SlotRow.vue': 'src/components/SlotRow.vue', 'reservation.ts': 'src/types/reservation.ts' },
    fileNotes: { 'App.vue': '画面（予約ページ）', 'SlotRow.vue': '1行ぶんの部品', 'reservation.ts': 'データの形（型）' },
  }));

  set('vue-intro', 'HTML・CSS・JavaScript', vue({
    'consult.ts': `
export interface Consult {
  id: number
  title: string
  fee: number
}
`,
    'ConsultCard.vue': `
<script setup lang="ts">
import { ref } from 'vue'

// ③ JavaScript：親から title と fee を受け取る（props）。型も書く
//    defineProps<{ title: string; fee: number }>()

// ④ JavaScript：詳細を開いているかを ref<boolean>(false) で持つ（opened）
</script>

<template>
  <div class="card">
    <!-- ① HTML：タイトルを <h3> に、料金を「◯円」の形で <p> に出す -->
    <!-- ④ ボタンを押すたびに opened を切り替え、opened のときだけ詳細の <p> を出す（v-if） -->
    <!-- ⑤ 無料（fee が 0）のときだけ free クラスを付ける（:class） -->
  </div>
</template>

<style scoped>
/* ② CSS：.card に border と padding を付ける */

/* ⑤ CSS：.free の color を決める */
</style>
`,
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'
import type { Consult } from './consult'
import ConsultCard from './ConsultCard.vue'

// ⑥ 3枚のカードのデータを配列にまとめる
//    const consults = ref<Consult[]>([ { id: 1, title: '初回相談（30分）', fee: 0 }, ... ])
</script>

<template>
  <h2>相談メニュー</h2>
  <!-- ⑥ 同じ <ConsultCard> を3回書いている。v-for で1行にまとめる -->
  <ConsultCard title="初回相談（30分）" :fee="0" />
  <ConsultCard title="継続相談（60分）" :fee="11000" />
  <ConsultCard title="書面チェック" :fee="5500" />
</template>
`,
  }, {
    'consult.ts': `
export interface Consult {
  id: number
  title: string
  fee: number
}
`,
    'ConsultCard.vue': `
<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ title: string; fee: number }>()

const opened = ref<boolean>(false)
</script>

<template>
  <div class="card" :class="{ free: fee === 0 }">
    <h3>{{ title }}</h3>
    <p>{{ fee }}円</p>
    <button @click="opened = !opened">詳細</button>
    <p v-if="opened">弁護士が1対1でお話をうかがいます。</p>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  padding: 12px;
}

.free {
  color: seagreen;
}
</style>
`,
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'
import type { Consult } from './consult'
import ConsultCard from './ConsultCard.vue'

const consults = ref<Consult[]>([
  { id: 1, title: '初回相談（30分）', fee: 0 },
  { id: 2, title: '継続相談（60分）', fee: 11000 },
  { id: 3, title: '書面チェック', fee: 5500 },
])
</script>

<template>
  <h2>相談メニュー</h2>
  <ConsultCard v-for="c in consults" :key="c.id" :title="c.title" :fee="c.fee" />
</template>
`,
  }, (v, c) => {
    const card = nc(v['ConsultCard.vue']), page = nc(v['App.vue']);
    return [
      T('ConsultCard.vue（HTML）：タイトルを h3 に、料金を「◯円」で出す', 1, /<h3[^>]*>\s*\{\{\s*title\s*\}\}\s*<\/h3>/.test(tpl(card)) && /\{\{\s*fee\s*\}\}\s*円/.test(tpl(card)), ['HTML は「何を載せるか」。見出しは h3、文は p。', C('<h3>{{ title }}</h3>\n<p>{{ fee }}円</p>', 'vue')], A('ConsultCard.vue', '① HTML')),
      T('ConsultCard.vue（CSS）：<style scoped> で .card に border を付ける', 1, /<style[^>]*scoped[^>]*>[\s\S]*\.card\s*\{[^}]*border\s*:[^}]*\}/.test(card), ['CSS は「どう見せるか」。scoped にすると、この部品の中だけに効く。', C('.card {\n  border: 1px solid #ccc;\n  padding: 12px;\n}', 'css')], A('ConsultCard.vue', '② CSS：.card')),
      T('ConsultCard.vue（JS）：title と fee を props（型つき）で受け取る', 1, /defineProps\s*<\s*\{\s*title\s*:\s*string\s*;?\s*,?\s*fee\s*:\s*number\s*;?\s*\}\s*>\s*\(\s*\)/.test(card), ['JavaScript は「どう動くか」。受け取る値の名前と型を書く。', C('defineProps<{ title: string; fee: number }>()')], A('ConsultCard.vue', '③ JavaScript：親')),
      T('ConsultCard.vue：ボタンで opened を切り替え、true のときだけ詳細を出す', 2, /ref\s*<\s*boolean\s*>\s*\(\s*false\s*\)/.test(card) && /<button[^>]*@click\s*=\s*["']opened\s*=\s*!\s*opened["']/.test(tpl(card)) && /v-if\s*=\s*["']opened["']/.test(tpl(card)), ['押すたびに true と false を入れ替える。', C('const opened = ref<boolean>(false)\n// <button @click="opened = !opened">詳細</button>\n// <p v-if="opened">…</p>')], A('ConsultCard.vue', '④ JavaScript：詳細', '④ ボタン')),
      T('ConsultCard.vue：fee が 0 のとき free クラスを付け、CSS で色を決める', 2, /:class\s*=\s*["']\{\s*free\s*:\s*fee\s*===?\s*0\s*\}["']/.test(tpl(card)) && /\.free\s*\{[^}]*color\s*:/.test(card), ['HTML・JS・CSS がつながる場面。:class でクラス名を付け、CSS で見た目を決める。', C('<div class="card" :class="{ free: fee === 0 }">', 'vue')], A('ConsultCard.vue', '⑤ 無料', '⑤ CSS')),
      T('相談メニュー：3枚のコピペを、型つきの配列 ref<Consult[]> と v-for にまとめる', 3, /ref\s*<\s*Consult\s*\[\s*\]\s*>\s*\(/.test(page) && /<ConsultCard[^>]*v-for/.test(page) && /:key\s*=/.test(page) && (tpl(page).match(/<ConsultCard\b/g) || []).length === 1 && $all(c, '.card').length === 3, ['3回書いたものは、配列にして v-for で1回にまとめる。', C("const consults = ref<Consult[]>([\n  { id: 1, title: '初回相談（30分）', fee: 0 },\n  { id: 2, title: '継続相談（60分）', fee: 11000 },\n  { id: 3, title: '書面チェック', fee: 5500 },\n])\n// <ConsultCard v-for=\"c in consults\" :key=\"c.id\" :title=\"c.title\" :fee=\"c.fee\" />")], A('App.vue', '⑥ 3枚', '⑥ 同じ')),
    ];
  }, {
    alias: { 'App.vue': 'ConsultMenuPage.vue' },
    paths: { 'App.vue': 'src/pages/ConsultMenuPage.vue', 'ConsultCard.vue': 'src/components/ConsultCard.vue', 'consult.ts': 'src/types/consult.ts' },
    fileNotes: { 'App.vue': '画面（相談メニュー）', 'ConsultCard.vue': 'HTML・CSS・JS が1つに入った部品', 'consult.ts': 'データの形（型）' },
  }));

  set('vue-intro', 'フレームワークって？', vue({
    'plan.ts': `
// ① 料金プランの形を interface Plan で決める（name: string / hourly: number）
//    export を付けると、他のファイルから import できる
`,
    'PriceRow.vue': `
<script setup lang="ts">
// ④ 親から label（文字）と amount（数）を受け取る（props）。型も書く
</script>

<template>
  <p>{{ label }}：{{ amount }} 円</p>
</template>
`,
    'App.vue': `
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Plan } from './plan'
import PriceRow from './PriceRow.vue'

const plans = ref<Plan[]>([
  { name: '相談プラン', hourly: 11000 },
  { name: '顧問プラン', hourly: 8800 },
])

// ② 時間数 hours を ref<number>(1) で作る

// ③ 選んだプラン名 selected を ref<string>('相談プラン') で作る

// ⑤ 選んだプランの時給 × hours を computed で計算する（total）

// ⑥ 消費税 tax（total の 10%。小数は Math.floor で切り捨て）と、税込合計 totalWithTax
</script>

<template>
  <h2>弁護士費用シミュレーター</h2>
  <!-- ② 時間数の入力欄に v-model.number="hours" -->
  <label>時間数 <input type="number" min="1"></label>
  <!-- ③ select に v-model="selected"、option を v-for で plans から出す -->
  <select></select>
  <PriceRow label="合計" :amount="total" />
  <!-- ⑥ 「消費税」と「税込合計」の PriceRow を足す -->
</template>
`,
  }, {
    'plan.ts': `
export interface Plan {
  name: string
  hourly: number
}
`,
    'PriceRow.vue': `
<script setup lang="ts">
defineProps<{ label: string; amount: number }>()
</script>

<template>
  <p>{{ label }}：{{ amount }} 円</p>
</template>
`,
    'App.vue': `
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Plan } from './plan'
import PriceRow from './PriceRow.vue'

const plans = ref<Plan[]>([
  { name: '相談プラン', hourly: 11000 },
  { name: '顧問プラン', hourly: 8800 },
])

const hours = ref<number>(1)
const selected = ref<string>('相談プラン')

const total = computed<number>(() => {
  const plan = plans.value.find((p) => p.name === selected.value)
  return (plan ? plan.hourly : 0) * hours.value
})

const tax = computed<number>(() => Math.floor(total.value * 0.1))
const totalWithTax = computed<number>(() => total.value + tax.value)
</script>

<template>
  <h2>弁護士費用シミュレーター</h2>
  <label>時間数 <input type="number" min="1" v-model.number="hours"></label>
  <select v-model="selected">
    <option v-for="p in plans" :key="p.name" :value="p.name">{{ p.name }}</option>
  </select>
  <PriceRow label="合計" :amount="total" />
  <PriceRow label="消費税" :amount="tax" />
  <PriceRow label="税込合計" :amount="totalWithTax" />
</template>
`,
  }, (v, c) => {
    const plan = nc(v['plan.ts']), row = nc(v['PriceRow.vue']), page = nc(v['App.vue']);
    return [
      T('plan.ts：interface Plan で、プランの形（name・hourly とその型）を決める', 1, /export\s+interface\s+Plan\s*\{[\s\S]*name\s*:\s*string[\s\S]*hourly\s*:\s*number[\s\S]*\}/.test(plan), ['フレームワークは「決まった置き場」がある。データの形は types のファイルに。', C('export interface Plan {\n  name: string\n  hourly: number\n}')], A('plan.ts', '① 料金プラン')),
      T('時間数 hours を ref<number>(1) で作り、入力欄に v-model.number でつなぐ', 1, /ref\s*<\s*number\s*>\s*\(\s*1\s*\)/.test(page) && /v-model\.number\s*=\s*["']hours["']/.test(page), ['データを変えれば画面が直る。入力欄とデータを v-model でつなぐ。', C('const hours = ref<number>(1)\n// <input type="number" v-model.number="hours">')], A('App.vue', '② 時間数')),
      T('selected を ref<string> で作り、select に v-model、option を v-for で出す', 1, /ref\s*<\s*string\s*>\s*\(\s*['"]相談プラン['"]\s*\)/.test(page) && /v-model\s*=\s*["']selected["']/.test(page) && /<option[^>]*v-for/.test(page) && $all(c, 'select option').length === 2, ['選択肢は配列から v-for で作る。手で書かない。', C('<select v-model="selected">\n  <option v-for="p in plans" :key="p.name" :value="p.name">{{ p.name }}</option>\n</select>', 'vue')], A('App.vue', '③ 選んだ', '③ select')),
      T('PriceRow.vue：label と amount を props（型つき）で受け取る', 2, /defineProps\s*<\s*\{[^}]*label\s*:\s*string[^}]*amount\s*:\s*number/.test(row), ['同じ「ラベル：金額」の行を、部品にして使い回す。', C('defineProps<{ label: string; amount: number }>()')], A('PriceRow.vue', '④ 親から')),
      T('total を computed で計算する（選んだプランの時給 × hours）。「合計：11000 円」と出る', 2, /computed\s*(<[^>]*>)?\s*\(/.test(page) && /hourly/.test(page) && /hours\.value/.test(page) && /合計：\s*11000\s*円/.test(appText(c)), ['hours や selected が変わると、total も自動で計算し直される（computed）。', C("const total = computed<number>(() => {\n  const plan = plans.value.find((p) => p.name === selected.value)\n  return (plan ? plan.hourly : 0) * hours.value\n})")], A('App.vue', '⑤ 選んだプラン')),
      T('消費税と税込合計も computed で作り、PriceRow で出す（1100 円と 12100 円）', 3, /tax\s*=\s*computed/.test(page) && /Math\.floor/.test(page) && /totalWithTax\s*=\s*computed/.test(page) && /消費税：\s*1100\s*円/.test(appText(c)) && /税込合計：\s*12100\s*円/.test(appText(c)), ['computed の中で別の computed を使ってもよい。', C('const tax = computed<number>(() => Math.floor(total.value * 0.1))\nconst totalWithTax = computed<number>(() => total.value + tax.value)\n// <PriceRow label="消費税" :amount="tax" />', 'ts')], A('App.vue', '⑥ 消費税', '⑥ 「消費税」')),
    ];
  }, {
    alias: { 'App.vue': 'FeeSimulatorPage.vue' },
    paths: { 'App.vue': 'src/pages/FeeSimulatorPage.vue', 'PriceRow.vue': 'src/components/PriceRow.vue', 'plan.ts': 'src/types/plan.ts' },
    fileNotes: { 'App.vue': '画面（費用シミュレーター）', 'PriceRow.vue': '金額の1行', 'plan.ts': 'データの形（型）' },
  }));

  set('vue-intro', '実例：検索サイトを層に分ける', vue({
    'lawyer.ts': `
// ① 弁護士の形を interface Lawyer で決める（id: number / name: string / field: string）
//    export を付けて、他のファイルから使えるようにする
`,
    'LawyerCard.vue': `
<script setup lang="ts">
import type { Lawyer } from './lawyer'

// ② 親から lawyer を受け取る（props）。型は Lawyer
//    defineProps<{ lawyer: Lawyer }>()
</script>

<template>
  <li class="lawyer">
    <strong>{{ lawyer.name }}</strong>（{{ lawyer.field }}）
  </li>
</template>
`,
    'App.vue': `
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Lawyer } from './lawyer'
import LawyerCard from './LawyerCard.vue'

const lawyers = ref<Lawyer[]>([
  { id: 1, name: '佐藤 花子', field: '離婚・男女問題' },
  { id: 2, name: '鈴木 一郎', field: '労働問題' },
  { id: 3, name: '高橋 美咲', field: '相続・遺言' },
  { id: 4, name: '田中 健', field: '労働問題' },
])

// ④ 検索ワード keyword を ref<string>('') で作る

// ⑤ keyword を field に含む弁護士だけを computed で作る（shown）。includes を使う
</script>

<template>
  <h2>弁護士を探す</h2>
  <!-- ④ 検索欄に v-model="keyword" をつなぐ -->
  <input placeholder="分野で検索（例：労働）">
  <ul>
    <!-- ③ lawyers を v-for で LawyerCard に並べる（:key と :lawyer）。⑤ のあとは shown に変える -->
  </ul>
  <!-- ⑥ 「◯ 件」と、0件のときだけ「該当する弁護士がいません」を v-if で出す -->
</template>
`,
  }, {
    'lawyer.ts': `
export interface Lawyer {
  id: number
  name: string
  field: string
}
`,
    'LawyerCard.vue': `
<script setup lang="ts">
import type { Lawyer } from './lawyer'

defineProps<{ lawyer: Lawyer }>()
</script>

<template>
  <li class="lawyer">
    <strong>{{ lawyer.name }}</strong>（{{ lawyer.field }}）
  </li>
</template>
`,
    'App.vue': `
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Lawyer } from './lawyer'
import LawyerCard from './LawyerCard.vue'

const lawyers = ref<Lawyer[]>([
  { id: 1, name: '佐藤 花子', field: '離婚・男女問題' },
  { id: 2, name: '鈴木 一郎', field: '労働問題' },
  { id: 3, name: '高橋 美咲', field: '相続・遺言' },
  { id: 4, name: '田中 健', field: '労働問題' },
])

const keyword = ref<string>('')

const shown = computed<Lawyer[]>(() => lawyers.value.filter((l) => l.field.includes(keyword.value)))
</script>

<template>
  <h2>弁護士を探す</h2>
  <input v-model="keyword" placeholder="分野で検索（例：労働）">
  <ul>
    <LawyerCard v-for="l in shown" :key="l.id" :lawyer="l" />
  </ul>
  <p>{{ shown.length }} 件</p>
  <p v-if="shown.length === 0">該当する弁護士がいません</p>
</template>
`,
  }, (v, c) => {
    const ty = nc(v['lawyer.ts']), card = nc(v['LawyerCard.vue']), page = nc(v['App.vue']);
    return [
      T('lawyer.ts：interface Lawyer で、弁護士の形を決める（データの層）', 1, /export\s+interface\s+Lawyer\s*\{[\s\S]*id\s*:\s*number[\s\S]*name\s*:\s*string[\s\S]*field\s*:\s*string[\s\S]*\}/.test(ty), ['データの形は、画面とは別のファイルに分ける。', C('export interface Lawyer {\n  id: number\n  name: string\n  field: string\n}')], A('lawyer.ts', '① 弁護士')),
      T('LawyerCard.vue：lawyer を props（型 Lawyer）で受け取る（部品の層）', 1, /defineProps\s*<\s*\{\s*lawyer\s*:\s*Lawyer\s*;?\s*\}\s*>\s*\(\s*\)/.test(card), ['1人ぶんの表示は部品に任せ、受け取るデータだけ宣言する。', C('defineProps<{ lawyer: Lawyer }>()')], A('LawyerCard.vue', '② 親から')),
      T('検索ページ：v-for で LawyerCard を並べる（4枚出る）', 1, /<LawyerCard[^>]*v-for/.test(page) && /:key\s*=/.test(page) && /:lawyer\s*=/.test(page) && $all(c, 'li.lawyer').length === 4, ['ページの層は「並べる」だけ。1人ぶんの中身は知らなくてよい。', C('<LawyerCard v-for="l in lawyers" :key="l.id" :lawyer="l" />', 'vue')], A('App.vue', '③ lawyers')),
      T('検索欄に v-model でつなぐ keyword（ref<string>）を作る', 2, /ref\s*<\s*string\s*>\s*\(\s*['"]['"]\s*\)/.test(page) && /<input[^>]*v-model\s*=\s*["']keyword["']/.test(page), ['入力した文字が keyword に入る。', C("const keyword = ref<string>('')\n// <input v-model=\"keyword\">")], A('App.vue', '④ 検索ワード', '④ 検索欄')),
      T('keyword を含む分野の弁護士だけを computed（shown）で絞り、v-for も shown にする', 2, /shown\s*=\s*computed/.test(page) && /\.filter\s*\(/.test(page) && /\.includes\s*\(\s*keyword\.value\s*\)/.test(page) && /v-for\s*=\s*["']\w+\s+in\s+shown["']/.test(page), ['入力が変わると、絞り込み結果も自動で変わる。', C('const shown = computed<Lawyer[]>(() => lawyers.value.filter((l) => l.field.includes(keyword.value)))')], A('App.vue', '⑤ keyword を', '⑤ のあと')),
      T('件数「4 件」と、0件のときだけ出る「該当する弁護士がいません」を作る', 3, /\{\{\s*shown\.length\s*\}\}\s*件/.test(tpl(page)) && /v-if\s*=\s*["']shown\.length\s*===?\s*0["']/.test(tpl(page)) && /該当する弁護士がいません/.test(tpl(page)) && /4\s*件/.test(appText(c)) && !/該当する弁護士がいません/.test(appText(c)), ['v-if の条件は shown.length === 0。', C('<p>{{ shown.length }} 件</p>\n<p v-if="shown.length === 0">該当する弁護士がいません</p>', 'vue')], A('App.vue', '⑥ 「◯ 件」')),
    ];
  }, {
    alias: { 'App.vue': 'LawyerSearchPage.vue' },
    paths: { 'App.vue': 'src/pages/LawyerSearchPage.vue', 'LawyerCard.vue': 'src/components/LawyerCard.vue', 'lawyer.ts': 'src/types/lawyer.ts' },
    fileNotes: { 'App.vue': 'ページの層（並べる・絞る）', 'LawyerCard.vue': '部品の層（1人ぶんの表示）', 'lawyer.ts': 'データの層（型）' },
  }));

  /* ===================== vue-env ===================== */

  set('vue-env', 'プロジェクトを作る', text('commands.sh', 'sh',
    F(`
# 新人の初日：相談予約アプリ「consult-app」を作って動かす
# 1行に1コマンド。# で始まる行はメモ（コマンドではない）

# ① プロジェクトを作る（Vue の雛形）

# ② できたフォルダ consult-app に入る

# ③ 必要な部品（パッケージ）を入れる

# ④ 開発サーバーを起動する

# ⑤ 型のエラーだけを調べる（package.json の type-check を npm run で動かす）

# ⑥ 公開用にまとめ（build）、できあがりを自分のパソコンで確認する（preview）
`),
    '<b>やること</b><br>作る → フォルダに入る → 部品を入れる → 起動。そのあと型チェックと公開用のビルド。<br>順番どおりに、# の下にコマンドを書く。',
    { 'commands.sh': 'npm create vue@latest\ncd consult-app\nnpm install\nnpm run dev\nnpm run type-check\nnpm run build\nnpm run preview\n' },
    (v) => {
      const L = lines(v['commands.sh']);
      const at = (re, from) => L.findIndex((x, i) => i > from && re.test(x));
      const a = at(/^npm\s+create\s+vue(@latest)?(\s|$)/, -1), b = at(/^cd\s+consult-app\/?$/, a), c = at(/^npm\s+(install|i)$/, b), d = at(/^npm\s+run\s+dev$/, c), e = at(/^npm\s+run\s+type-check$/, c), f = at(/^npm\s+run\s+build$/, d), g = at(/^npm\s+run\s+preview$/, f);
      return [
        T('Vue のプロジェクトを作る（npm create vue@latest）', 1, a >= 0, ['雛形を作るコマンド。', 'npm create vue@latest'], A('commands.sh', '① プロジェクト')),
        T('作ったフォルダに入る（cd consult-app）。作ったあとの行に書く', 1, a >= 0 && b > a, ['cd = change directory。フォルダの中へ移動する。', 'cd consult-app'], A('commands.sh', '② できた')),
        T('部品を入れる（npm install）。フォルダに入ったあとの行に書く', 1, b >= 0 && c > b, ['package.json に書かれた部品をまとめてダウンロードする。', 'npm install'], A('commands.sh', '③ 必要な')),
        T('開発サーバーを起動する（npm run dev）。install のあとに書く', 2, c >= 0 && d > c, ['dev は package.json の scripts にある開発用コマンド。', 'npm run dev'], A('commands.sh', '④ 開発')),
        T('型エラーだけ調べる（npm run type-check）', 2, c >= 0 && e > c, ['create-vue の雛形には type-check が入っている。', 'npm run type-check'], A('commands.sh', '⑤ 型の')),
        T('dev のあとに npm run build、そのあとに npm run preview の順で書く', 3, d >= 0 && f > d && g > f, ['build で dist フォルダができる。preview はそれを開いて確認する。', 'npm run build → npm run preview'], A('commands.sh', '⑥ 公開用')),
      ];
    }));

  set('vue-env', 'フォルダ探索', text('files.md', 'text',
    F(`
# consult-app の中身を、1行ずつ「ファイル名: 役割」の形で説明しよう
# （# で始まる行はメモ。説明は日本語でOK）
#
# consult-app/
# ├─ index.html
# ├─ package.json
# ├─ vite.config.ts
# └─ src/
#     ├─ main.ts
#     ├─ App.vue
#     └─ components/
#
# ① index.html の役割（例：index.html: 〜）

# ② src/main.ts の役割

# ③ package.json の役割

# ④ src/App.vue の役割

# ⑤ src/components/ の役割（フォルダでも「名前: 役割」で書く）

# ⑥ vite.config.ts の役割
`),
    '<b>やること</b><br>フォルダの中の大事なファイルを、1行ずつ説明する。<br>例：<code>index.html: 〜</code>',
    { 'files.md': 'index.html: 画面の入れ物。div id="app" があり、ここに Vue の画面が入る\nsrc/main.ts: アプリを起動して、App.vue を #app につなぐ\npackage.json: 使う部品の一覧と、npm run で動かすコマンドを書く\nsrc/App.vue: いちばん外側の親部品。画面全体の土台\nsrc/components/: 部品（.vue）を置くフォルダ。カードやボタンなど\nvite.config.ts: 開発サーバーやビルド（Vite）の設定を書く\n' },
    (v) => {
      const L = lines(v['files.md']);
      const has = (name, kw) => L.some((x) => new RegExp('^' + name + '\\s*[:：]\\s*\\S{3,}').test(x) && kw.test(x.replace(/^[^:：]*[:：]/, '')));
      return [
        T('index.html の役割を書く（画面の入れ物）', 1, has('index\\.html', /入れ物|app|画面|ページ|HTML|土台/i), ['Vue の画面が差し込まれる、最初の1枚の HTML。', 'index.html: 画面の入れ物。div id="app" がある'], A('files.md', '① index.html')),
        T('src/main.ts の役割を書く（アプリの起動）', 1, has('(src\\/)?main\\.(ts|js)', /起動|App|mount|つな|読み込|始/), ['アプリを起動して、画面の入れ物につなぐ。', 'src/main.ts: アプリを起動して、App.vue を #app につなぐ'], A('files.md', '② src/main.ts')),
        T('package.json の役割を書く（部品の一覧とコマンド）', 1, has('package\\.json', /部品|パッケージ|コマンド|npm|依存|スクリプト|一覧/), ['使う部品の名前と、npm run のコマンドが書いてある。', 'package.json: 使う部品の一覧と、npm run のコマンドを書く'], A('files.md', '③ package.json')),
        T('src/App.vue の役割を書く（いちばん外側の親部品）', 2, has('(src\\/)?App\\.vue', /親|土台|最初|全体|外側|ルート|トップ/), ['すべての部品が入る、いちばん外側の部品。', 'src/App.vue: いちばん外側の親部品。画面全体の土台'], A('files.md', '④ src/App.vue')),
        T('src/components/ の役割を書く（部品の置き場）', 2, has('(src\\/)?components\\/?', /部品|コンポーネント|置く|カード|ボタン|\.vue/), ['小さな部品の .vue を集めるフォルダ。', 'src/components/: 部品（.vue）を置くフォルダ'], A('files.md', '⑤ src/components')),
        T('vite.config.ts の役割を書く（開発サーバーとビルドの設定）', 3, has('vite\\.config\\.(ts|js)', /設定|開発|ビルド|サーバー|Vite|config/i), ['Vite は、開発サーバーとビルドを受け持つ道具。その設定ファイル。', 'vite.config.ts: 開発サーバーやビルド（Vite）の設定を書く'], A('files.md', '⑥ vite.config.ts')),
      ];
    }));

  set('vue-env', '開発サーバーと自動更新（HMR）', text('commands.sh', 'sh',
    F(`
# 開発中の流れ：サーバーを起動 → コードを保存 → 画面が自動で変わる
# 1行に1コマンド。# で始まる行はメモ。

# ① 開発サーバーを起動する

# ② ブラウザで開く URL をメモする（Vite の標準のポートは 5173。localhost:ポート番号 の形）

# ③ 自動更新の仕組みを、メモ（# で始まる行）で一言説明する。英字3文字の略称を入れる

# ④ サーバーを止めるキー操作をメモする

# ⑤ 公開用にまとめる

# ⑥ まとめた結果の確認コマンドと、できるフォルダ名をメモする
`),
    '<b>HMR</b>＝保存すると、リロードなしで画面が変わる。<br>開発中は <code>dev</code>、公開前は <code>build</code>。',
    { 'commands.sh': 'npm run dev\n# 開く URL: http://localhost:5173\n# HMR: 保存するだけで、リロードなしで画面が変わる\n# 止めるとき: Ctrl+C\nnpm run build\nnpm run preview\n# build すると dist フォルダに公開用ファイルができる\n' },
    (v) => {
      const raw = v['commands.sh'], L = lines(raw);
      const d = L.findIndex((x) => /^npm\s+run\s+dev$/.test(x));
      const f = L.findIndex((x, i) => /^npm\s+run\s+build$/.test(x));
      const g = L.findIndex((x, i) => i > f && /^npm\s+run\s+preview$/.test(x));
      return [
        T('開発サーバーを起動する（npm run dev）', 1, d >= 0, ['開発中に使うコマンド。', 'npm run dev'], A('commands.sh', '① 開発')),
        T('開く URL を # のメモに書く（localhost:5173）', 1, /^#.*localhost:5173/m.test(raw), ['http://localhost:5173 をブラウザで開く。', '# 開く URL: http://localhost:5173'], A('commands.sh', '② ブラウザ')),
        T('HMR を # のメモで説明する（リロードなしで更新される）', 1, /^#.*HMR.*(リロード|再読み込み|更新|変わ)/m.test(raw), ['HMR は「保存した瞬間に、画面だけ入れ替わる」仕組み。', '# HMR: 保存するだけで、リロードなしで画面が変わる'], A('commands.sh', '③ 自動更新')),
        T('サーバーの止め方（Ctrl+C）をメモに書く', 2, /^#.*Ctrl\s*\+\s*C/im.test(raw), ['ターミナルで Ctrl キーを押しながら C。', '# 止めるとき: Ctrl+C'], A('commands.sh', '④ サーバー')),
        T('公開用にまとめる（npm run build）。dev より後ろに書く', 2, d >= 0 && f > d, ['build は公開用のファイルを作る。', 'npm run build'], A('commands.sh', '⑤ 公開用')),
        T('build のあとに npm run preview を書き、できるフォルダ dist をメモする', 3, f >= 0 && g > f && /^#.*dist/m.test(raw), ['preview は dist の中身を、パソコン上で開いて確認する。', 'npm run preview\n# build すると dist フォルダに公開用ファイルができる'], A('commands.sh', '⑥ まとめた')),
      ];
    }));

  set('vue-env', '実例：初日にやる 4 コマンド', vue({
    'WelcomeBanner.vue': `
<script setup lang="ts">
// ② 親から name を受け取る（props）。型も書く
//    defineProps<{ name: string }>()
</script>

<template>
  <h2>ようこそ、{{ name }} さん</h2>
</template>
`,
    'App.vue': `
<script setup lang="ts">
import { ref, computed } from 'vue'
import WelcomeBanner from './WelcomeBanner.vue'

// ① 自分の名前に書き換えて保存する（保存した瞬間に画面が変わる = HMR）
const staffName = ref<string>('新人')
const visits = ref<number>(0)

// ⑤ 「相談受付」ボタンで visits を 1 増やす関数 accept

// ⑥ 20 件以上で「混雑中」になる isBusy を computed で作る
</script>

<template>
  <!-- ③ WelcomeBanner に :name="staffName" を渡す -->
  <WelcomeBanner />
  <!-- ④ 営業時間の <p> を足す（「受付 9:00〜18:00」） -->
  <p>本日の受付：{{ visits }} 件</p>
  <!-- ⑤ ボタンに @click="accept"。⑥ isBusy のときは :disabled にして、「混雑中」を v-if で出す -->
  <button>相談受付</button>
</template>
`,
  }, {
    'WelcomeBanner.vue': `
<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<template>
  <h2>ようこそ、{{ name }} さん</h2>
</template>
`,
    'App.vue': `
<script setup lang="ts">
import { ref, computed } from 'vue'
import WelcomeBanner from './WelcomeBanner.vue'

const staffName = ref<string>('山田')
const visits = ref<number>(0)

function accept(): void {
  visits.value++
}

const isBusy = computed<boolean>(() => visits.value >= 20)
</script>

<template>
  <WelcomeBanner :name="staffName" />
  <p>受付 9:00〜18:00</p>
  <p>本日の受付：{{ visits }} 件</p>
  <button :disabled="isBusy" @click="accept">相談受付</button>
  <p v-if="isBusy">混雑中</p>
</template>
`,
  }, (v, c) => {
    const page = nc(v['App.vue']), ban = nc(v['WelcomeBanner.vue']);
    const nm = (page.match(/staffName\s*=\s*ref\s*<\s*string\s*>\s*\(\s*['"]([^'"]*)['"]/) || [])[1];
    return [
      T('staffName を、自分の名前に書き換える（「新人」以外）', 1, !!nm && nm !== '新人' && nm.trim().length > 0, ['ref の中の文字を書き換えて保存するだけ。開発サーバーが動いていれば、すぐ画面に出る。', C("const staffName = ref<string>('山田')")], A('App.vue', '① 自分')),
      T('WelcomeBanner.vue：name を props（型つき）で受け取る', 1, /defineProps\s*<\s*\{\s*name\s*:\s*string\s*;?\s*\}\s*>\s*\(\s*\)/.test(ban), ['親が渡す値の名前と型を、子で宣言する。', C('defineProps<{ name: string }>()')], A('WelcomeBanner.vue', '② 親から')),
      T('親から :name="staffName" を渡し、「ようこそ、◯◯ さん」と出す', 1, /<WelcomeBanner[^>]*:name\s*=\s*["']staffName["']/.test(page) && /ようこそ、\S+\s*さん/.test(appText(c)), ['属性の前に : を付けると、文字ではなく変数を渡せる。', C('<WelcomeBanner :name="staffName" />', 'vue')], A('App.vue', '③ WelcomeBanner')),
      T('営業時間の <p>（受付 9:00〜18:00）を足す', 1, /受付\s*9:00/.test(appText(c)), ['保存すると HMR で、リロードなしに反映される。', C('<p>受付 9:00〜18:00</p>', 'vue')], A('App.vue', '④ 営業時間')),
      T('accept 関数と @click で、ボタンを押すと visits が 1 増える', 2, /(function\s+accept|const\s+accept\s*=)[\s\S]*visits\.value\s*(\+\+|\+=\s*1)/.test(page) && /<button[^>]*@click\s*=\s*["']accept["']/.test(page), ['script の中では .value を付ける。', C('function accept(): void {\n  visits.value++\n}\n// <button @click="accept">')], A('App.vue', '⑤ 「相談受付」', '⑤ ボタン')),
      T('isBusy（computed）で、20 件以上ならボタンを無効にし「混雑中」を出す', 3, /isBusy\s*=\s*computed/.test(page) && /visits\.value\s*>=?\s*(20|19)/.test(page) && /:disabled\s*=\s*["']isBusy["']/.test(page) && /v-if\s*=\s*["']isBusy["']/.test(page) && /混雑中/.test(tpl(page)), ['数が変わると、isBusy も自動で変わる。', C('const isBusy = computed<boolean>(() => visits.value >= 20)\n// <button :disabled="isBusy">\n// <p v-if="isBusy">混雑中</p>')], A('App.vue', '⑥ 20 件', '⑥ isBusy')),
    ];
  }, {
    alias: { 'App.vue': 'ConsultHomePage.vue' },
    paths: { 'App.vue': 'src/ConsultHomePage.vue', 'WelcomeBanner.vue': 'src/components/WelcomeBanner.vue' },
    fileNotes: { 'App.vue': '初日に最初に編集する画面', 'WelcomeBanner.vue': 'あいさつの部品' },
  }));

  /* ===================== vue-basics #1–#8 ===================== */

  set('vue-basics', '.vue ファイルの解剖', vue({
    'FavoriteButton.vue': `
<script setup lang="ts">
import { ref } from 'vue'

// ① script（動き）：お気に入りの数 likes を ref<number>(0) で作る

// ④ 親から label を受け取る（props）。型も書く: defineProps<{ label: string }>()
</script>

<!-- ② template（形）：ボタンに「{{ label }} {{ likes }}」を出し、押すと likes を 1 増やす（④ の label も使う） -->
<template>
</template>

<style scoped>
/* ③ style（見た目）：button の color と background を決める */
</style>
`,
    'App.vue': `
<script setup lang="ts">
// ⑤ 子の FavoriteButton を使えるように import する（./FavoriteButton.vue）
</script>

<template>
  <h2>残業代請求の相談事例</h2>
  <p>未払い残業代について、相談の流れを紹介します。</p>
  <!-- ⑤ ここに <FavoriteButton label="お気に入り" /> を置く -->
  <!-- ⑥ もう1つ <FavoriteButton label="後で読む" /> も置く（数は別々に数えられる） -->
</template>
`,
  }, {
    'FavoriteButton.vue': `
<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ label: string }>()

const likes = ref<number>(0)
</script>

<template>
  <button @click="likes++">{{ label }} {{ likes }}</button>
</template>

<style scoped>
button {
  color: white;
  background: tomato;
}
</style>
`,
    'App.vue': `
<script setup lang="ts">
import FavoriteButton from './FavoriteButton.vue'
</script>

<template>
  <h2>残業代請求の相談事例</h2>
  <p>未払い残業代について、相談の流れを紹介します。</p>
  <FavoriteButton label="お気に入り" />
  <FavoriteButton label="後で読む" />
</template>
`,
  }, (v, c) => {
    const fb = nc(v['FavoriteButton.vue']), page = nc(v['App.vue']);
    const a = v['FavoriteButton.vue'].indexOf('<script'), b = v['FavoriteButton.vue'].indexOf('<template>'), s = v['FavoriteButton.vue'].lastIndexOf('<style');
    return [
      T('FavoriteButton.vue（script）：likes を ref<number>(0) で作る', 1, /const\s+likes\s*=\s*ref\s*<\s*number\s*>\s*\(\s*0\s*\)/.test(fb), ['script は「動き」の箱。数えるデータは ref に入れる。', C('const likes = ref<number>(0)')], A('FavoriteButton.vue', '① script')),
      T('FavoriteButton.vue（template）：ボタンに likes を出し、押すと 1 増える', 1, /<button[^>]*@click\s*=\s*["']likes(\+\+|\s*\+=\s*1|\s*=\s*likes\s*\+\s*1)["']/.test(tpl(fb)) && /\{\{\s*likes\s*\}\}/.test(tpl(fb)), ['template は「形」の箱。@click の中では .value は要らない。', C('<button @click="likes++">{{ likes }}</button>', 'vue')], A('FavoriteButton.vue', '② template')),
      T('FavoriteButton.vue（style）：<style scoped> で button の color と background を決める', 1, /<style[^>]*scoped[^>]*>[\s\S]*button\s*\{[^}]*color\s*:[^}]*\}[\s\S]*<\/style>/.test(fb) && /background\s*:/.test(fb), ['style は「見た目」の箱。scoped は、この部品の中だけに効く印。', C('<style scoped>\nbutton {\n  color: white;\n  background: tomato;\n}\n</style>', 'vue')], A('FavoriteButton.vue', '③ style')),
      T('label を props（型つき）で受け取り、ボタンの文字にも使う', 2, /defineProps\s*<\s*\{\s*label\s*:\s*string\s*;?\s*\}\s*>\s*\(\s*\)/.test(fb) && /\{\{\s*label\s*\}\}/.test(tpl(fb)), ['同じ部品で文字だけ変えたいときは props。', C('defineProps<{ label: string }>()\n// <button>{{ label }} {{ likes }}</button>')], A('FavoriteButton.vue', '④ 親から')),
      T('相談事例ページ：FavoriteButton を import して「お気に入り 0」を出す', 2, /import\s+FavoriteButton\s+from\s+['"]\.\/FavoriteButton\.vue['"]/.test(page) && /<FavoriteButton[^>]*label\s*=\s*["']お気に入り["']/.test(page) && /お気に入り\s*0/.test(appText(c)), ['使う側で import すると、<FavoriteButton /> と書ける。', C("import FavoriteButton from './FavoriteButton.vue'\n// <FavoriteButton label=\"お気に入り\" />")], A('App.vue', '⑤ 子の', '⑤ ここに')),
      T('「後で読む」ボタンも置く。3つの箱の順は script → template → style のまま', 3, /<FavoriteButton[^>]*label\s*=\s*["']後で読む["']/.test(page) && /後で読む\s*0/.test(appText(c)) && a >= 0 && b > a && s > b, ['同じ部品を2回使っても、数は別々。部品ごとに ref が作られる。', C('<FavoriteButton label="お気に入り" />\n<FavoriteButton label="後で読む" />', 'vue')], A('App.vue', '⑥ もう1つ')),
    ];
  }, {
    alias: { 'App.vue': 'CaseArticlePage.vue' },
    paths: { 'App.vue': 'src/pages/CaseArticlePage.vue', 'FavoriteButton.vue': 'src/components/FavoriteButton.vue' },
    fileNotes: { 'App.vue': '画面（相談事例）', 'FavoriteButton.vue': 'script・template・style の3つの箱' },
  }));

  set('vue-basics', 'script の lang="ts" って？', vue({
    'plan.ts': `
// ④ 料金プランの形を interface Plan で決める（name: string / hourly: number）

// ⑥ 見積の状態を、3つの文字だけに限る型にする
//    export type Status = 'draft' | 'sent' | 'accepted'
`,
    'App.vue': `
<!-- ① 下の <script setup> に lang="ts" を付けて、TypeScript で書く -->
<script setup>
import { ref } from 'vue'
import type { Plan, Status } from './plan'

// ② 型を付けて変数を作る：hours は number（3）、clientName は string（'山田 太郎'）

// ③ 費用を計算する関数 calcFee(hours, hourly)。引数にも戻り値にも number を付ける

// ④ plan を Plan 型で作る（name: '相談プラン'、hourly: 11000）

// ⑤ fee を calcFee で計算する（hours と plan.hourly を渡す）

// ⑥ status を ref<Status>('draft') で作り、日本語にする関数 statusLabel(s: Status): string
//    ヒント：Record<Status, string> のオブジェクトで 下書き / 送付済み / 承諾済み を対応づける
</script>

<template>
  <h2>{{ clientName }} 様のお見積り</h2>
  <p>{{ plan.name }}：{{ hours }} 時間</p>
  <p>費用：{{ fee }} 円</p>
  <p>状態：{{ statusLabel(status) }}</p>
</template>
`,
  }, {
    'plan.ts': `
export interface Plan {
  name: string
  hourly: number
}

export type Status = 'draft' | 'sent' | 'accepted'
`,
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'
import type { Plan, Status } from './plan'

const hours: number = 3
const clientName: string = '山田 太郎'

function calcFee(h: number, hourly: number): number {
  return h * hourly
}

const plan: Plan = { name: '相談プラン', hourly: 11000 }
const fee: number = calcFee(hours, plan.hourly)

const status = ref<Status>('draft')
const labels: Record<Status, string> = { draft: '下書き', sent: '送付済み', accepted: '承諾済み' }
function statusLabel(s: Status): string {
  return labels[s]
}
</script>

<template>
  <h2>{{ clientName }} 様のお見積り</h2>
  <p>{{ plan.name }}：{{ hours }} 時間</p>
  <p>費用：{{ fee }} 円</p>
  <p>状態：{{ statusLabel(status) }}</p>
</template>
`,
  }, (v, c) => {
    const ty = nc(v['plan.ts']), page = nc(v['App.vue']);
    return [
      T('<script setup> に lang="ts" を付ける', 1, /<script[^>]*\bsetup\b[^>]*\blang\s*=\s*["']ts["']|<script[^>]*\blang\s*=\s*["']ts["'][^>]*\bsetup\b/.test(page), ['lang="ts" を付けると、型を書けて、間違いに赤線が付く。', C('<script setup lang="ts">', 'vue')], A('App.vue', '① 下の', '<script setup>')),
      T('hours は number、clientName は string と、型を付けて作る', 1, /const\s+hours\s*:\s*number\s*=\s*3\b/.test(page) && /const\s+clientName\s*:\s*string\s*=\s*['"]山田 太郎['"]/.test(page), ['変数名の後ろに : 型 を書く。', C("const hours: number = 3\nconst clientName: string = '山田 太郎'")], A('App.vue', '② 型を付けて')),
      T('calcFee(hours, hourly) を、引数も戻り値も number で作る', 1, /(function\s+calcFee\s*\(\s*\w+\s*:\s*number\s*,\s*\w+\s*:\s*number\s*\)\s*:\s*number|const\s+calcFee\s*=\s*\(\s*\w+\s*:\s*number\s*,\s*\w+\s*:\s*number\s*\)\s*:\s*number\s*=>)/.test(page), ['( ) の中が引数の型、( ) の後ろの : が戻り値の型。', C('function calcFee(h: number, hourly: number): number {\n  return h * hourly\n}')], A('App.vue', '③ 費用')),
      T('plan.ts：interface Plan を作り、App 側で plan: Plan として使う', 2, /export\s+interface\s+Plan\s*\{[\s\S]*name\s*:\s*string[\s\S]*hourly\s*:\s*number[\s\S]*\}/.test(ty) && /const\s+plan\s*:\s*Plan\s*=\s*\{[^}]*11000/.test(page), ['オブジェクトの形は interface で決める。', C("export interface Plan {\n  name: string\n  hourly: number\n}\n// const plan: Plan = { name: '相談プラン', hourly: 11000 }")], A('plan.ts', '④ 料金プラン')),
      T('fee を calcFee で計算し、画面に「費用：33000 円」と出す', 2, /const\s+fee\s*(:\s*number)?\s*=\s*calcFee\s*\(\s*hours\s*,\s*plan\.hourly\s*\)/.test(page) && /費用：\s*33000\s*円/.test(appText(c)), ['3時間 × 11000円。', C('const fee: number = calcFee(hours, plan.hourly)')], A('App.vue', '⑤ fee')),
      T('Status を3つの文字だけの型にし、statusLabel で日本語にして「状態：下書き」と出す', 3, /export\s+type\s+Status\s*=\s*['"]draft['"]\s*\|\s*['"]sent['"]\s*\|\s*['"]accepted['"]/.test(ty) && /ref\s*<\s*Status\s*>\s*\(\s*['"]draft['"]\s*\)/.test(page) && /statusLabel\s*\(\s*\w+\s*:\s*Status\s*\)\s*:\s*string/.test(page) && /状態：\s*下書き/.test(appText(c)), ["'draft' | 'sent' | 'accepted' のように、使える文字を決めると、打ち間違いが赤線になる。", C("export type Status = 'draft' | 'sent' | 'accepted'\n\nconst status = ref<Status>('draft')\nconst labels: Record<Status, string> = { draft: '下書き', sent: '送付済み', accepted: '承諾済み' }\nfunction statusLabel(s: Status): string {\n  return labels[s]\n}")], A('plan.ts', '⑥ 見積の状態')),
    ];
  }, {
    alias: { 'App.vue': 'FeeEstimatePage.vue' },
    paths: { 'App.vue': 'src/pages/FeeEstimatePage.vue', 'plan.ts': 'src/types/plan.ts' },
    fileNotes: { 'App.vue': '画面（お見積り）', 'plan.ts': '型だけを書くファイル' },
  }));

  set('vue-basics', 'JS の基本：変数と関数', vue({
    'consult.ts': `
export interface Consult {
  id: number
  title: string
  fee: number
  done: boolean
}
`,
    'App.vue': `
<script setup lang="ts">
import type { Consult } from './consult'

const consults: Consult[] = [
  { id: 1, title: '離婚の相談', fee: 11000, done: false },
  { id: 2, title: '労働の相談', fee: 5500, done: true },
  { id: 3, title: '相続の相談', fee: 22000, done: false },
]

// ① 変えない値 officeName を const で宣言する（値は '相談ナビ法律事務所'）

// ② 税込みにする関数 withTax(price) を作る。price * 1.1 の小数は Math.floor で切り捨てる（アロー関数）

// ③ consults から、まだ終わっていない（done が false）ものだけを取り出して open に入れる（filter）

// ④ open の title だけを取り出して titles に入れる（map）

// ⑤ バッククォートで文字と変数をつなぎ、summary を「未完了 2 件」の形で作る（open.length を使う）

// ⑥ consults 全部の fee を足して total に入れる（reduce）
</script>

<template>
  <h2>{{ officeName }}</h2>
  <p>{{ summary }}</p>
  <p>未完了：{{ titles.join('、') }}</p>
  <p>10000円の税込み：{{ withTax(10000) }}円</p>
  <p>全相談の料金合計：{{ total }}円</p>
</template>
`,
  }, {
    'consult.ts': `
export interface Consult {
  id: number
  title: string
  fee: number
  done: boolean
}
`,
    'App.vue': `
<script setup lang="ts">
import type { Consult } from './consult'

const consults: Consult[] = [
  { id: 1, title: '離婚の相談', fee: 11000, done: false },
  { id: 2, title: '労働の相談', fee: 5500, done: true },
  { id: 3, title: '相続の相談', fee: 22000, done: false },
]

const officeName = '相談ナビ法律事務所'

const withTax = (price: number): number => Math.floor(price * 1.1)

const open = consults.filter((c) => !c.done)

const titles = open.map((c) => c.title)

const summary = §未完了 ¤{open.length} 件§

const total = consults.reduce((sum, c) => sum + c.fee, 0)
</script>

<template>
  <h2>{{ officeName }}</h2>
  <p>{{ summary }}</p>
  <p>未完了：{{ titles.join('、') }}</p>
  <p>10000円の税込み：{{ withTax(10000) }}円</p>
  <p>全相談の料金合計：{{ total }}円</p>
</template>
`,
  }, (v, c) => {
    const s = nc(v['App.vue']);
    return [
      T('変えない値 officeName を const で宣言する', 1, /const\s+officeName\s*(:\s*string)?\s*=\s*['"`]相談ナビ法律事務所['"`]/.test(s) && /事務所/.test(appText(c)), ['あとで変えない値は const。変える値は let。', C("const officeName = '相談ナビ法律事務所'")], A('App.vue', '① 変えない')),
      T('税込みにする関数 withTax を作る（10000 → 11000）', 1, /const\s+withTax\s*=\s*\(\s*\w+\s*(:\s*number)?\s*\)\s*(:\s*number)?\s*=>[\s\S]*Math\.floor/.test(s) && /税込み：\s*11000\s*円/.test(appText(c)), ['アロー関数：(引数) => 戻す値', C('const withTax = (price: number): number => Math.floor(price * 1.1)')], A('App.vue', '② 税込み')),
      T('filter で、まだ終わっていない相談だけを open に入れる', 1, /const\s+open\s*=\s*consults\s*\.filter\s*\(\s*\(?\s*\w+\s*\)?\s*=>\s*!\s*\w+\.done\s*\)/.test(s) || /const\s+open\s*=\s*consults\s*\.filter\s*\([^)]*done\s*===?\s*false/.test(s), ['filter は「条件に合うものだけ」の新しい配列を返す。', C('const open = consults.filter((c) => !c.done)')], A('App.vue', '③ consults')),
      T('map で、open の title だけを titles に入れる（「離婚の相談、相続の相談」と出る）', 2, /const\s+titles\s*=\s*open\s*\.map\s*\(/.test(s) && /未完了：\s*離婚の相談、相続の相談/.test(appText(c)), ['map は「1つずつ変換した」新しい配列を返す。', C('const titles = open.map((c) => c.title)')], A('App.vue', '④ open')),
      T('テンプレートリテラル（バッククォート）で summary を「未完了 2 件」の形で作る', 2, /const\s+summary\s*(:\s*string)?\s*=\s*`[^`]*\$\{\s*open\.length\s*\}[^`]*`/.test(s) && /未完了\s*2\s*件/.test(appText(c)), ['`文字 ${変数} 文字` と書くと、変数をそのまま文に入れられる。', C('const summary = §未完了 ¤{open.length} 件§')], A('App.vue', '⑤ バッククォート')),
      T('reduce で、全相談の fee を足して total（38500）にする', 3, /const\s+total\s*(:\s*number)?\s*=\s*consults\s*\.reduce\s*\(/.test(s) && /料金合計：\s*38500\s*円/.test(appText(c)), ['reduce((合計, 1件) => 合計 + 1件の値, 0)。最後の 0 は、合計の出発点。', C('const total = consults.reduce((sum, c) => sum + c.fee, 0)')], A('App.vue', '⑥ consults 全部')),
    ];
  }, {
    alias: { 'App.vue': 'ConsultSummaryPage.vue' },
    paths: { 'App.vue': 'src/pages/ConsultSummaryPage.vue', 'consult.ts': 'src/types/consult.ts' },
    fileNotes: { 'App.vue': '画面（相談の集計）', 'consult.ts': 'データの形（型）' },
  }));

  set('vue-basics', 'データを変えるだけ', vue({
    'SlotBadge.vue': `
<script setup lang="ts">
// ⑤ 親から slots を受け取る（props）。型も書く: defineProps<{ slots: number }>()
</script>

<template>
  <p v-if="slots === 0">満席</p>
  <p v-else>残り {{ slots }} 枠</p>
</template>
`,
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'
import SlotBadge from './SlotBadge.vue'

// ① 残り枠を 3 に変える（数字を書き換えるだけで、画面が変わる）
const slots = ref<number>(10)
const total = 10

// ③ 予約ボタンが押されたとき slots を 1 減らす関数 reserve（script の中では .value）

// ⑥ 予約を取り消す関数 cancel：slots を 1 増やす。ただし total を超えないようにする
</script>

<template>
  <h2>初回相談の予約枠</h2>
  <SlotBadge :slots="slots" />
  <!-- ② 「予約」ボタンを足し、@click で reserve を呼ぶ -->
  <!-- ④ 予約ボタンを、slots が 0 のとき押せなくする（:disabled） -->
  <!-- ⑥ 「取消」ボタンを足し、@click で cancel を呼ぶ -->
</template>
`,
  }, {
    'SlotBadge.vue': `
<script setup lang="ts">
defineProps<{ slots: number }>()
</script>

<template>
  <p v-if="slots === 0">満席</p>
  <p v-else>残り {{ slots }} 枠</p>
</template>
`,
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'
import SlotBadge from './SlotBadge.vue'

const slots = ref<number>(3)
const total = 10

function reserve(): void {
  slots.value--
}

function cancel(): void {
  if (slots.value < total) slots.value++
}
</script>

<template>
  <h2>初回相談の予約枠</h2>
  <SlotBadge :slots="slots" />
  <button :disabled="slots === 0" @click="reserve">予約</button>
  <button @click="cancel">取消</button>
</template>
`,
  }, (v, c) => {
    const page = nc(v['App.vue']), badge = nc(v['SlotBadge.vue']);
    return [
      T('slots を 3 にする（画面が「残り 3 枠」になる）', 1, /slots\s*=\s*ref\s*(<\s*number\s*>)?\s*\(\s*3\s*\)/.test(page) && /残り\s*3\s*枠/.test(appText(c)), ['ref の中の数字を変えるだけ。画面は自動で追いかける。', C('const slots = ref<number>(3)')], A('App.vue', '① 残り枠')),
      T('「予約」ボタンを置き、@click で reserve を呼ぶ', 1, /<button[^>]*@click\s*=\s*["']reserve["']/.test(tpl(page)), ['template にボタンを書き、押したときの関数名を @click に。', C('<button @click="reserve">予約</button>', 'vue')], A('App.vue', '② 「予約」')),
      T('reserve 関数で、slots を 1 減らす（.value を付ける）', 1, /(function\s+reserve|const\s+reserve\s*=)[\s\S]*?slots\.value\s*(--|-=\s*1|=\s*slots\.value\s*-\s*1)/.test(page), ['script の中の ref は .value を付けて書き換える。', C('function reserve(): void {\n  slots.value--\n}')], A('App.vue', '③ 予約ボタン')),
      T('slots が 0 のとき、予約ボタンを :disabled で押せなくする', 2, /<button[^>]*:disabled\s*=\s*["']slots\s*(===?|<=)\s*0["']/.test(tpl(page)), [':disabled に条件を書くと、true のときだけ押せなくなる。', C('<button :disabled="slots === 0" @click="reserve">予約</button>', 'vue')], A('App.vue', '④ 予約ボタン')),
      T('SlotBadge.vue：slots を props（型つき）で受け取り、「残り ◯ 枠」と出す', 2, /defineProps\s*<\s*\{\s*slots\s*:\s*number\s*;?\s*\}\s*>\s*\(\s*\)/.test(badge) && /残り\s*\d+\s*枠/.test(appText(c)), ['表示だけの部品に、データを渡して使う。', C('defineProps<{ slots: number }>()')], A('SlotBadge.vue', '⑤ 親から')),
      T('cancel 関数と「取消」ボタンを作る。total を超えて増えないようにする', 3, /(function\s+cancel|const\s+cancel\s*=)[\s\S]*?(slots\.value\s*<\s*total|Math\.min)[\s\S]*?slots\.value\s*(\+\+|\+=\s*1|=)/.test(page) && /<button[^>]*@click\s*=\s*["']cancel["']/.test(tpl(page)), ['増やす前に、上限（total）より小さいかを if で確かめる。', C('function cancel(): void {\n  if (slots.value < total) slots.value++\n}')], A('App.vue', '⑥ 予約を取り消す', '⑥ 「取消」')),
    ];
  }, {
    alias: { 'App.vue': 'SlotStatusPage.vue' },
    paths: { 'App.vue': 'src/pages/SlotStatusPage.vue', 'SlotBadge.vue': 'src/components/SlotBadge.vue' },
    fileNotes: { 'App.vue': '画面（予約枠）', 'SlotBadge.vue': '残り枠の表示部品' },
  }));

  set('vue-basics', 'Vue の考え方：3ステップ', vue({
    'App.vue': `
<script setup lang="ts">
import { ref, computed } from 'vue'

const maxLength = 100

// ① 【データ】相談メモ memo を ref<string> で作る（最初の文字は '初回相談：契約書の確認'）

// ④ 【データから計算】あと何文字書けるか remaining を computed で作る（maxLength - 文字数）

// ⑤ 【操作】メモを空にする関数 clear
</script>

<template>
  <h2>相談メモ</h2>
  <!-- ② 【見た目】textarea に v-model="memo" をつなぐ -->
  <textarea rows="3"></textarea>
  <!-- ③ 【見た目】「文字数：◯」を、{{ memo.length }} で出す -->
  <!-- ⑥ remaining が 0 より小さいとき、下の p に over クラスを付ける（:class と、style の .over） -->
  <p>残り {{ remaining }} 文字</p>
  <!-- ⑤ ボタンの @click で clear を呼ぶ -->
  <button>クリア</button>
</template>

<style scoped>
/* ⑥ .over の color を赤などにする */
</style>
`,
  }, {
    'App.vue': `
<script setup lang="ts">
import { ref, computed } from 'vue'

const maxLength = 100

const memo = ref<string>('初回相談：契約書の確認')

const remaining = computed<number>(() => maxLength - memo.value.length)

function clear(): void {
  memo.value = ''
}
</script>

<template>
  <h2>相談メモ</h2>
  <textarea v-model="memo" rows="3"></textarea>
  <p>文字数：{{ memo.length }}</p>
  <p :class="{ over: remaining < 0 }">残り {{ remaining }} 文字</p>
  <button @click="clear">クリア</button>
</template>

<style scoped>
.over {
  color: crimson;
}
</style>
`,
  }, (v, c) => {
    const s = nc(v['App.vue']);
    const ta = $q(c, '#app textarea');
    return [
      T('① データ：memo を ref<string> で作る（最初は「初回相談：契約書の確認」）', 1, /const\s+memo\s*=\s*ref\s*<\s*string\s*>\s*\(\s*['"]初回相談：契約書の確認['"]\s*\)/.test(s), ['Vue の1歩目は、データを ref に入れること。', C("const memo = ref<string>('初回相談：契約書の確認')")], A('App.vue', '① 【データ】')),
      T('② 見た目：textarea に v-model="memo" をつなぐ（最初から文字が入る）', 1, /<textarea[^>]*v-model\s*=\s*["']memo["']/.test(s) && !!ta && /契約書の確認/.test(ta.value), ['v-model は、入力欄とデータを両方向でつなぐ。', C('<textarea v-model="memo" rows="3"></textarea>', 'vue')], A('App.vue', '② 【見た目】textarea')),
      T('③ 見た目：「文字数：11」を {{ memo.length }} で出す', 1, /\{\{\s*memo\.length\s*\}\}/.test(tpl(s)) && /文字数：\s*11\b/.test(appText(c)), ['template の中の {{ }} は、データをそのまま表示する。', C('<p>文字数：{{ memo.length }}</p>', 'vue')], A('App.vue', '③ 【見た目】「文字数')),
      T('④ 計算：remaining を computed で作る（「残り 89 文字」）', 2, /remaining\s*=\s*computed\s*(<[^>]*>)?\s*\(/.test(s) && /maxLength\s*-\s*memo\.value\.length/.test(s) && /残り\s*89\s*文字/.test(appText(c)), ['memo が変わるたびに、remaining も自動で計算し直される。', C('const remaining = computed<number>(() => maxLength - memo.value.length)')], A('App.vue', '④ 【データから計算】')),
      T('⑤ 操作：clear 関数を作り、ボタンの @click で呼ぶ（メモが空になる）', 2, /(function\s+clear|const\s+clear\s*=)[\s\S]*?memo\.value\s*=\s*['"]['"]/.test(s) && /<button[^>]*@click\s*=\s*["']clear["']/.test(tpl(s)), ['操作 → データを変える → 画面が変わる。この順が Vue の3ステップ。', C("function clear(): void {\n  memo.value = ''\n}")], A('App.vue', '⑤ 【操作】', '⑤ ボタン')),
      T('⑥ 100 文字を超えたら、:class で over を付けて赤くする', 3, /:class\s*=\s*["']\{\s*over\s*:\s*remaining\s*<\s*0\s*\}["']/.test(tpl(s)) && /\.over\s*\{[^}]*color\s*:/.test(s), ['データ（remaining）の状態に応じて、クラスを付けたり外したりする。', C('<p :class="{ over: remaining < 0 }">残り {{ remaining }} 文字</p>\n\n.over {\n  color: crimson;\n}', 'vue')], A('App.vue', '⑥ remaining', '⑥ .over')),
    ];
  }, {
    alias: { 'App.vue': 'ConsultMemoEditor.vue' },
    paths: { 'App.vue': 'src/pages/ConsultMemoEditor.vue' },
    fileNotes: { 'App.vue': '画面（相談メモ）' },
  }));

  set('vue-basics', 'ref を1つずつ', vue({
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

// ① 来所人数 people を ref<number>(1) で作る

// ② people を 1 増やす関数 add（script では .value）

// ③ 代表者名 name を ref<string>('') で作る

// ④ people を 1 に戻す関数 reset

// ⑤ people を 1 減らす関数 remove。ただし 1 より小さくしない（if で確かめる）

// ⑥ 至急かどうか urgent を ref<boolean>(false) で作る
</script>

<template>
  <h2>来所予約</h2>
  <!-- ③ 名前の入力欄に v-model="name" をつなぐ -->
  <input placeholder="代表者名">
  <p>人数：{{ people }} 名</p>
  <button @click="add">＋1名</button>
  <button @click="remove">－1名</button>
  <!-- ④ 「リセット」ボタンを足し、@click で reset を呼ぶ -->
  <!-- ⑥ 下のチェックボックスに v-model="urgent" をつなぐ -->
  <label><input type="checkbox"> 至急</label>
  <p v-if="urgent">至急対応で承ります</p>
</template>
`,
  }, {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

const people = ref<number>(1)

function add(): void {
  people.value++
}

const name = ref<string>('')

function reset(): void {
  people.value = 1
}

function remove(): void {
  if (people.value > 1) people.value--
}

const urgent = ref<boolean>(false)
</script>

<template>
  <h2>来所予約</h2>
  <input v-model="name" placeholder="代表者名">
  <p>人数：{{ people }} 名</p>
  <button @click="add">＋1名</button>
  <button @click="remove">－1名</button>
  <button @click="reset">リセット</button>
  <label><input type="checkbox" v-model="urgent"> 至急</label>
  <p v-if="urgent">至急対応で承ります</p>
</template>
`,
  }, (v, c) => {
    const s = nc(v['App.vue']);
    return [
      T('people を ref<number>(1) で作る（「人数：1 名」と出る）', 1, /const\s+people\s*=\s*ref\s*<\s*number\s*>\s*\(\s*1\s*\)/.test(s) && /人数：\s*1\s*名/.test(appText(c)), ['ref は1つの値を入れる箱。数なら ref<number>。', C('const people = ref<number>(1)')], A('App.vue', '① 来所人数')),
      T('add 関数で people.value を 1 増やす', 1, /(function\s+add|const\s+add\s*=)[\s\S]*?people\.value\s*(\+\+|\+=\s*1)/.test(s), ['script の中では .value を付ける。', C('function add(): void {\n  people.value++\n}')], A('App.vue', '② people を')),
      T('name を ref<string>(\'\') で作り、入力欄に v-model でつなぐ', 1, /const\s+name\s*=\s*ref\s*<\s*string\s*>\s*\(\s*['"]['"]\s*\)/.test(s) && /<input[^>]*v-model\s*=\s*["']name["']/.test(s), ['文字の ref には ref<string>。', C("const name = ref<string>('')\n// <input v-model=\"name\">")], A('App.vue', '③ 代表者名', '③ 名前')),
      T('「リセット」ボタンを足し、reset 関数で people を 1 に戻す', 2, /(function\s+reset|const\s+reset\s*=)[\s\S]*?people\.value\s*=\s*1\b/.test(s) && /<button[^>]*@click\s*=\s*["']reset["']/.test(tpl(s)), ['値を入れ直すときは = を使う。', C('function reset(): void {\n  people.value = 1\n}\n// <button @click="reset">リセット</button>')], A('App.vue', '④ people を', '④ 「リセット」')),
      T('remove 関数で people を 1 減らす。ただし 1 未満にはしない', 2, /(function\s+remove|const\s+remove\s*=)[\s\S]*?if\s*\(\s*people\.value\s*(>\s*1|>=\s*2)\s*\)[\s\S]*?people\.value\s*(--|-=\s*1)/.test(s), ['減らす前に、1 より大きいかを確かめる。', C('function remove(): void {\n  if (people.value > 1) people.value--\n}')], A('App.vue', '⑤ people を 1 減らす')),
      T('urgent を ref<boolean>(false) で作り、チェックボックスに v-model でつなぐ', 3, /const\s+urgent\s*=\s*ref\s*<\s*boolean\s*>\s*\(\s*false\s*\)/.test(s) && /<input[^>]*type\s*=\s*["']checkbox["'][^>]*v-model\s*=\s*["']urgent["']|<input[^>]*v-model\s*=\s*["']urgent["'][^>]*type\s*=\s*["']checkbox["']/.test(s), ['チェックボックスは true / false。ref<boolean> と v-model が合う。', C('const urgent = ref<boolean>(false)\n// <input type="checkbox" v-model="urgent">')], A('App.vue', '⑥ 至急かどうか', '⑥ 下の')),
    ];
  }, {
    alias: { 'App.vue': 'VisitReservationForm.vue' },
    paths: { 'App.vue': 'src/pages/VisitReservationForm.vue' },
    fileNotes: { 'App.vue': '画面（来所予約フォーム）' },
  }));

  set('vue-basics', 'ref：状態と画面', vue({
    'App.vue': `
<script setup lang="ts">
import { ref, computed } from 'vue'

const maxPeople = 10
const unitPrice = 5500

// ① let を const に、数を ref<number>(1) にして、リアクティブにする
let people = 1

// ③ add の中で、people を .value で増やす。④ ただし maxPeople を超えない（if）
function add(): void {
  people++
}

// ⑤ people を 1 減らす関数 remove。1 より小さくしない

// ⑥ 参加費の合計 totalFee を computed で作る（people.value * unitPrice）
</script>

<template>
  <h2>相談会の参加受付</h2>
  <!-- ② template では .value を付けない -->
  <p>参加人数：{{ people.value }} 名（上限 {{ maxPeople }} 名）</p>
  <button @click="add">＋1名</button>
  <button @click="remove">－1名</button>
  <p>参加費：{{ totalFee }} 円</p>
</template>
`,
  }, {
    'App.vue': `
<script setup lang="ts">
import { ref, computed } from 'vue'

const maxPeople = 10
const unitPrice = 5500

const people = ref<number>(1)

function add(): void {
  if (people.value < maxPeople) people.value++
}

function remove(): void {
  if (people.value > 1) people.value--
}

const totalFee = computed<number>(() => people.value * unitPrice)
</script>

<template>
  <h2>相談会の参加受付</h2>
  <p>参加人数：{{ people }} 名（上限 {{ maxPeople }} 名）</p>
  <button @click="add">＋1名</button>
  <button @click="remove">－1名</button>
  <p>参加費：{{ totalFee }} 円</p>
</template>
`,
  }, (v, c) => {
    const s = nc(v['App.vue']);
    return [
      T('people を ref<number>(1) にする（let → const ref）', 1, /const\s+people\s*=\s*ref\s*<\s*number\s*>\s*\(\s*1\s*\)/.test(s), ['普通の変数は、変えても画面が変わらない。ref に入れると画面が追いかける。', C('const people = ref<number>(1)')], A('App.vue', '① let', 'let people')),
      T('template では .value を付けない（「参加人数：1 名」と出る）', 1, !/\.value/.test(tpl(s)) && /参加人数：\s*1\s*名/.test(appText(c)), ['script の中は .value、template の中は付けない。', C('<p>参加人数：{{ people }} 名</p>', 'vue')], A('App.vue', '② template', '{{ people.value }}')),
      T('add の中で people.value を 1 増やす', 1, /function\s+add\s*\([^)]*\)[^{]*\{[\s\S]*?people\.value\s*(\+\+|\+=\s*1)/.test(s), ['ref の中身は people.value で読み書きする。', C('people.value++')], A('App.vue', '③ add', 'people++')),
      T('add は maxPeople（10）を超えないよう、if で確かめる', 2, /function\s+add\s*\([^)]*\)[^{]*\{[\s\S]*?(people\.value\s*<\s*maxPeople|people\.value\s*<=\s*maxPeople\s*-\s*1|people\.value\s*<\s*10)/.test(s), ['増やす前に、上限より小さいかを確かめる。', C('function add(): void {\n  if (people.value < maxPeople) people.value++\n}')], A('App.vue', '④ ただし')),
      T('remove 関数を作り、1 未満にはならないようにする', 2, /function\s+remove\s*\([^)]*\)[^{]*\{[\s\S]*?people\.value\s*(>\s*1|>=\s*2)[\s\S]*?people\.value\s*(--|-=\s*1)/.test(s), ['減らす前に、1 より大きいかを確かめる。', C('function remove(): void {\n  if (people.value > 1) people.value--\n}')], A('App.vue', '⑤ people を 1 減らす')),
      T('totalFee を computed で作る（「参加費：5500 円」と出る）', 3, /totalFee\s*=\s*computed\s*(<[^>]*>)?\s*\(/.test(s) && /people\.value\s*\*\s*unitPrice/.test(s) && /参加費：\s*5500\s*円/.test(appText(c)), ['人数が変わるたびに、参加費も自動で計算し直される。', C('const totalFee = computed<number>(() => people.value * unitPrice)')], A('App.vue', '⑥ 参加費')),
    ];
  }, {
    alias: { 'App.vue': 'SeminarEntryPage.vue' },
    paths: { 'App.vue': 'src/pages/SeminarEntryPage.vue' },
    fileNotes: { 'App.vue': '画面（相談会の参加受付）' },
  }));

  set('vue-basics', 'ref と reactive・型（interface）', vue({
    'case.ts': `
// ① 案件の形を interface Case で決める（id: number / title: string / done: boolean）
//    export を付けて、他のファイルから使えるようにする

export interface Applicant {
  name: string
  email: string
}

// ⑥ Case に、担当弁護士 assignee を足す（文字。まだ決まっていないこともあるので、? を付けて省略できる形にする）
`,
    'App.vue': `
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Case, Applicant } from './case'

// ② 案件 item を ref<Case> で作る（id: 1 / title: '離婚の相談' / done: false）

// ③ item の done を true にする関数 finish（ref の中身は .value で触る）

// ④ 申込者 form を reactive<Applicant> で作る（name と email は空の文字）。reactive は .value が要らない

// ⑤ 順番待ちの配列 queue を ref<Case[]> で作る
//    { id: 2, title: '労働の相談', done: false } と { id: 3, title: '相続の相談', done: false, assignee: '佐藤' }
</script>

<template>
  <h2>案件の詳細</h2>
  <p>{{ item.title }}：{{ item.done ? '完了' : '未完了' }}</p>
  <button @click="finish">完了にする</button>
  <h3>申込者</h3>
  <input v-model="form.name" placeholder="お名前">
  <input v-model="form.email" placeholder="メール">
  <p>{{ form.name }} 様（{{ form.email }}）</p>
  <h3>順番待ち</h3>
  <ul>
    <li v-for="c in queue" :key="c.id">{{ c.title }}（{{ c.assignee ?? '未定' }}）</li>
  </ul>
</template>
`,
  }, {
    'case.ts': `
export interface Case {
  id: number
  title: string
  done: boolean
  assignee?: string
}

export interface Applicant {
  name: string
  email: string
}
`,
    'App.vue': `
<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Case, Applicant } from './case'

const item = ref<Case>({ id: 1, title: '離婚の相談', done: false })

function finish(): void {
  item.value.done = true
}

const form = reactive<Applicant>({ name: '', email: '' })

const queue = ref<Case[]>([
  { id: 2, title: '労働の相談', done: false },
  { id: 3, title: '相続の相談', done: false, assignee: '佐藤' },
])
</script>

<template>
  <h2>案件の詳細</h2>
  <p>{{ item.title }}：{{ item.done ? '完了' : '未完了' }}</p>
  <button @click="finish">完了にする</button>
  <h3>申込者</h3>
  <input v-model="form.name" placeholder="お名前">
  <input v-model="form.email" placeholder="メール">
  <p>{{ form.name }} 様（{{ form.email }}）</p>
  <h3>順番待ち</h3>
  <ul>
    <li v-for="c in queue" :key="c.id">{{ c.title }}（{{ c.assignee ?? '未定' }}）</li>
  </ul>
</template>
`,
  }, (v, c) => {
    const ty = nc(v['case.ts']), s = nc(v['App.vue']);
    return [
      T('case.ts：interface Case で、案件の形（id・title・done とその型）を決める', 1, /export\s+interface\s+Case\s*\{[\s\S]*id\s*:\s*number[\s\S]*title\s*:\s*string[\s\S]*done\s*:\s*boolean[\s\S]*\}/.test(ty), ['型はデータの「設計図」。専用のファイルに置くと、あちこちで使い回せる。', C('export interface Case {\n  id: number\n  title: string\n  done: boolean\n}')], A('case.ts', '① 案件')),
      T('item を ref<Case>(…) で作る（「離婚の相談：未完了」と出る）', 1, /const\s+item\s*=\s*ref\s*<\s*Case\s*>\s*\(/.test(s) && /離婚の相談：\s*未完了/.test(appText(c)), ['ref に型を付けるときは ref<型>(値)。', C("const item = ref<Case>({ id: 1, title: '離婚の相談', done: false })")], A('App.vue', '② 案件')),
      T('finish 関数で item.value.done を true にする', 1, /(function\s+finish|const\s+finish\s*=)[\s\S]*?item\.value\.done\s*=\s*true/.test(s), ['ref の中のオブジェクトは item.value.done のように触る。', C('function finish(): void {\n  item.value.done = true\n}')], A('App.vue', '③ item')),
      T('form を reactive<Applicant> で作る（.value なしで form.name が使える）', 2, /const\s+form\s*=\s*reactive\s*<\s*Applicant\s*>\s*\(\s*\{[^}]*name\s*:[^}]*email\s*:/.test(s) && !/form\.value/.test(s + tpl(s)), ['reactive はオブジェクト用。.value を付けずに、そのまま form.name と書ける。', C("const form = reactive<Applicant>({ name: '', email: '' })")], A('App.vue', '④ 申込者')),
      T('queue を ref<Case[]> で作り、順番待ちを v-for で出す（「労働の相談（未定）」）', 2, /const\s+queue\s*=\s*ref\s*<\s*Case\s*\[\s*\]\s*>\s*\(/.test(s) && /労働の相談（未定）/.test(appText(c)) && /相続の相談（佐藤）/.test(appText(c)), ['配列の ref は ref<型[]>。', C("const queue = ref<Case[]>([\n  { id: 2, title: '労働の相談', done: false },\n  { id: 3, title: '相続の相談', done: false, assignee: '佐藤' },\n])")], A('App.vue', '⑤ 順番待ち')),
      T('case.ts：assignee? を足して、「あってもなくてもよい」項目にする', 3, /export\s+interface\s+Case\s*\{[^}]*assignee\s*\?\s*:\s*string[^}]*\}/.test(ty), ['? を付けると省略できる。省略した値は undefined なので、?? で「未定」と置き換えている。', C('export interface Case {\n  id: number\n  title: string\n  done: boolean\n  assignee?: string\n}')], A('case.ts', '⑥ Case')),
    ];
  }, {
    alias: { 'App.vue': 'CaseDetailPage.vue' },
    paths: { 'App.vue': 'src/pages/CaseDetailPage.vue', 'case.ts': 'src/types/case.ts' },
    fileNotes: { 'App.vue': '画面（案件の詳細）', 'case.ts': 'データの形（型）' },
  }));
})();
