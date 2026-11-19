/* 練習（補足：Vue と React の違い）: 短い React のコードを「Vue ならこう書く」に直す。
   drills/vue.js の後に読み込み、K.drills['x-vue-react'][シーン名] に登録する。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.drills || !K.vueDrillTools) return;
  const D = K.drills;
  const { text, T, lines } = K.vueDrillTools;
  void lines;

  const C = (code, lang) => ({ code, lang: lang || 'vue' });
  const A = (file, ...find) => ({ file, find });
  /* コメントを除いた中身（TODO や React 版の参考コードが正解扱いにならないように） */
  const nc = (s) => String(s || '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const tpl = (s) => { const m = nc(s).match(/<template>([\s\S]*)<\/template>/); return m ? m[1] : ''; };
  const scr = (s) => { const m = nc(s).match(/<script[^>]*>([\s\S]*?)<\/script>/); return m ? m[1] : ''; };
  const set = (title, drill) => { (D['x-vue-react'] = D['x-vue-react'] || {})[title] = drill; };
  const NOTE = '<b>React → Vue</b><br>上の React 版（コメント）と同じ画面を、Vue で書く。<br>番号 ① 〜 の TODO を、上から順に直そう。';

  /* ---------- ① 全体像：同じカウンター ---------- */
  const F1 = 'Counter.vue';
  set('全体像：同じカウンター', text(F1, 'vue',
`<!-- React 版（これと同じ画面を Vue で書く）
const [count, setCount] = useState(0)
<button onClick={() => setCount(count + 1)}>予約する</button>
<p>予約 {count} 件</p>
-->

<script setup lang="ts">
// ① ref を import する
// ② count を ref(0) で作る（useState に当たる）
</script>

<template>
  <!-- ③ 「予約 〇 件」と count を表示する -->
  <!-- ④ 「予約する」ボタンを置き、押すと count を 1 増やす -->
  <!-- ⑤ count が 10 以上になったら、ボタンを押せなくする -->
</template>
`, NOTE,
`<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <p>予約 {{ count }} 件</p>
  <button :disabled="count >= 10" @click="count++">予約する</button>
</template>
`,
  (v) => { const s = v[F1], sc = scr(s), tp = tpl(s); return [
    T('Counter.vue の script で、ref を vue から import する（React の useState に当たる部品）', 1, /import\s*\{[^}]*\bref\b[^}]*\}\s*from\s*['"]vue['"]/.test(sc),
      ['React の useState に当たるのが ref。vue から import して使う。', C("import { ref } from 'vue'", 'ts')], A(F1, '① ')),
    T('Counter.vue の script で、count を ref(0) にする（初期値 0）', 1, /(const|let)\s+count\s*(:\s*[^=]+)?=\s*ref\s*(<[^>]*>)?\s*\(\s*0\s*\)/.test(sc),
      ['const count = ref(…) の形。React の useState(0) の 0 が、ref(0) の 0。', C('const count = ref(0)', 'ts')], A(F1, '② ')),
    T('Counter.vue の template で、count を表示する（予約 0 件）', 1, /予約\s*\{\{\s*count\s*\}\}\s*件/.test(tp),
      ['React の {count} は、Vue では {{ count }}。波かっこが 2 つ。', C('<p>予約 {{ count }} 件</p>')], A(F1, '③ ')),
    T('Counter.vue の template で、ボタンを押すと count が 1 増えるようにする（@click）', 2, /<button(?:[^>"']|"[^"]*"|'[^']*')*@click\s*=\s*["'][^"']*count(\.value)?\s*(\+\+|\+=\s*1|=\s*count(\.value)?\s*\+\s*1)/.test(tp),
      ['React の onClick は、Vue では @click。', 'template の中では ref に .value を付けない。count++ と書ける。', C('<button @click="count++">予約する</button>')], A(F1, '④ ')),
    T('Counter.vue の template で、count が 10 以上のとき、ボタンを押せなくする（:disabled）', 3, /<button(?:[^>"']|"[^"]*"|'[^']*')*:disabled\s*=\s*["']\s*count\s*>=\s*10\s*["']/.test(tp),
      ['React の disabled={…} は、Vue では :disabled="…"。属性に式を渡すときは : を付ける。', C('<button :disabled="count >= 10" @click="count++">')], A(F1, '⑤ ')),
  ]; }));

  /* ---------- ② 状態を変える ---------- */
  const F2 = 'ReservationSlots.vue';
  set('状態を変える', text(F2, 'vue',
`<!-- React 版（これと同じ画面を Vue で書く）
const [slots, setSlots] = useState<number>(10)
function reserve(): void { setSlots(slots - 1) }
function reset(): void { setSlots(10) }
<p>残り {slots} 枠</p>
<button onClick={reserve} disabled={slots === 0}>予約</button>
<button onClick={reset}>リセット</button>
-->

<script setup lang="ts">
import { ref } from 'vue'

// ① slots を ref<number>(10) で作る
// ② reserve 関数を作り、slots を 1 減らす（setSlots の代わりに .value を書き換える）
// ③ reset 関数を作り、slots を 10 に戻す
</script>

<template>
  <!-- ④ 「残り 〇 枠」と slots を表示する（template では .value を付けない） -->
  <!-- ⑤ 「予約」ボタンの @click で reserve を呼ぶ -->
  <!-- ⑥ slots が 0 のとき、「予約」ボタンを :disabled にする -->
</template>
`, NOTE,
`<script setup lang="ts">
import { ref } from 'vue'

const slots = ref<number>(10)
function reserve(): void {
  slots.value--
}
function reset(): void {
  slots.value = 10
}
</script>

<template>
  <p>残り {{ slots }} 枠</p>
  <button :disabled="slots === 0" @click="reserve">予約</button>
  <button @click="reset">リセット</button>
</template>
`,
  (v) => { const s = v[F2], sc = scr(s), tp = tpl(s); return [
    T('ReservationSlots.vue の script で、slots を ref<number>(10) にする（型は < > に書く）', 1, /(const|let)\s+slots\s*=\s*ref\s*<\s*number\s*>\s*\(\s*10\s*\)/.test(sc),
      ['ref の < > の中に、入れる値の型を書く。', C('const slots = ref<number>(10)', 'ts')], A(F2, '① ')),
    T('ReservationSlots.vue の script で、reserve 関数を作り、slots.value を 1 減らす（書き換える）', 1, /(function\s+reserve\s*\([^)]*\)[^{]*\{[^}]*slots\.value\s*(--|-=\s*1|=\s*slots\.value\s*-\s*1)|reserve\s*=\s*\([^)]*\)[^=]*=>\s*\{?[^}]*slots\.value\s*(--|-=\s*1|=\s*slots\.value\s*-\s*1))/.test(sc),
      ['React は setSlots(新しい値) を呼ぶ。Vue は ref の中身を直接 書き換える。', 'script の中では、ref に .value を付ける。', C('function reserve(): void {\n  slots.value--\n}', 'ts')], A(F2, '② ')),
    T('ReservationSlots.vue の script で、reset 関数を作り、slots.value を 10 に戻す', 1, /function\s+reset\s*\([^)]*\)[^{]*\{[^}]*slots\.value\s*=\s*10\b|reset\s*=\s*\([^)]*\)[^=]*=>\s*\{?[^}]*slots\.value\s*=\s*10\b/.test(sc),
      ['React の setSlots(10) は、Vue では 代入。', C('function reset(): void {\n  slots.value = 10\n}', 'ts')], A(F2, '③ ')),
    T('ReservationSlots.vue の template で、slots を表示する（残り 10 枠。.value は付けない）', 2, /残り\s*\{\{\s*slots\s*\}\}\s*枠/.test(tp) && !/\.value/.test(tp),
      ['template の中では、ref を自動で開けてくれる。.value は要らない。', C('<p>残り {{ slots }} 枠</p>')], A(F2, '④ ')),
    T('ReservationSlots.vue の template で、「予約」ボタンの @click から reserve を呼ぶ', 2, /<button(?:[^>"']|"[^"]*"|'[^']*')*@click\s*=\s*["']reserve(\(\))?["']/.test(tp),
      ['@click に、関数の名前を渡す。', C('<button @click="reserve">予約</button>')], A(F2, '⑤ ')),
    T('ReservationSlots.vue の template で、slots が 0 のとき「予約」ボタンを :disabled にする', 3, /<button(?:[^>"']|"[^"]*"|'[^']*')*:disabled\s*=\s*["']\s*slots\s*(===|==|<=)\s*0\s*["']/.test(tp),
      ['React の disabled={slots === 0} は、Vue では :disabled。', C('<button :disabled="slots === 0" @click="reserve">予約</button>')], A(F2, '⑥ ')),
  ]; }));

  /* ---------- ③ 画面の書き方 ---------- */
  const F3 = 'ConsultList.vue';
  set('画面の書き方', text(F3, 'vue',
`<!-- React 版（これと同じ画面を Vue で書く）
{items.length === 0 && <p>相談はありません</p>}
<ul>
  {items.map((c) => (
    <li key={c.id}>{c.title}</li>
  ))}
</ul>
-->

<script setup lang="ts">
import { ref } from 'vue'

type Consult = { id: number; title: string; open: boolean }
const items = ref<Consult[]>([
  { id: 1, title: '離婚の相談', open: true },
  { id: 2, title: '相続の相談', open: false },
])
// ⑥ 受付中（open）だけの openItems を、computed で作る（v-for と v-if を同じ要素に書かないため）
</script>

<template>
  <!-- ① items を v-for で繰り返して、li を並べる（.map の代わり） -->
  <!-- ② li に :key を付ける（c.id） -->
  <!-- ③ li の中に、c.title を表示する -->
  <!-- ④ items が 0 件のとき、「相談はありません」を v-if で出す -->
  <!-- ⑤ ④ の p と ul を v-if / v-else でつなぐ（&& の代わり） -->
</template>
`, NOTE,
`<script setup lang="ts">
import { ref, computed } from 'vue'

type Consult = { id: number; title: string; open: boolean }
const items = ref<Consult[]>([
  { id: 1, title: '離婚の相談', open: true },
  { id: 2, title: '相続の相談', open: false },
])
const openItems = computed(() => items.value.filter((c) => c.open))
</script>

<template>
  <p v-if="items.length === 0">相談はありません</p>
  <ul v-else>
    <li v-for="c in openItems" :key="c.id">{{ c.title }}</li>
  </ul>
</template>
`,
  (v) => { const s = v[F3], sc = scr(s), tp = tpl(s); return [
    T('ConsultList.vue の template で、li を v-for で繰り返す（React の .map に当たる）', 1, /<li(?:[^>"']|"[^"]*"|'[^']*')*v-for\s*=\s*["']\s*\(?\s*c\s*(,\s*\w+\s*)?\)?\s+in\s+(items|openItems)\s*["']/.test(tp),
      ['React の items.map((c) => <li>…) は、Vue では li に v-for を付ける。', C('<li v-for="c in items">')], A(F3, '① ')),
    T('ConsultList.vue の template で、li に :key="c.id" を付ける（React の key={c.id}）', 1, /<li(?:[^>"']|"[^"]*"|'[^']*')*:key\s*=\s*["']c\.id["']/.test(tp),
      ['React の key={c.id} は、Vue では :key="c.id"。', C('<li v-for="c in items" :key="c.id">')], A(F3, '② ')),
    T('ConsultList.vue の template で、li の中に c.title を表示する（{{ }}）', 1, /<li(?:[^>"']|"[^"]*"|'[^']*')*>[^<]*\{\{\s*c\.title\s*\}\}[^<]*<\/li>/.test(tp),
      ['React の {c.title} は、Vue では {{ c.title }}。', C('<li …>{{ c.title }}</li>')], A(F3, '③ ')),
    T('ConsultList.vue の template で、items が 0 件のとき「相談はありません」を v-if で出す（React の &&）', 2, /<p(?:[^>"']|"[^"]*"|'[^']*')*v-if\s*=\s*["']\s*items\.length\s*(===|==)\s*0\s*["'][^>]*>\s*相談はありません\s*<\/p>/.test(tp),
      ['React の {cond && <p>…</p>} は、Vue では p に v-if="cond"。', C('<p v-if="items.length === 0">相談はありません</p>')], A(F3, '④ ')),
    T('ConsultList.vue の template で、ul に v-else を付ける（p と ul のどちらか一方だけ出す）', 2, /<p(?:[^>"']|"[^"]*"|'[^']*')*v-if[^>]*>[\s\S]*?<\/p>\s*<ul(?:[^>"']|"[^"]*"|'[^']*')*v-else[^>]*>/.test(tp),
      ['v-if の「すぐ次の要素」に v-else を書くと、「そうでなければ」になる。', C('<p v-if="…">…</p>\n<ul v-else>…</ul>')], A(F3, '⑤ ')),
    T('ConsultList.vue の script で、open が true のものだけの openItems を computed で作り、v-for をそれに変える', 3, /import\s*\{[^}]*\bcomputed\b[^}]*\}\s*from\s*['"]vue['"]/.test(sc) && /openItems\s*=\s*computed\s*\(\s*\(\s*\)\s*=>[^)]*items\.value\.filter\s*\(\s*\(?\s*c\s*\)?\s*=>\s*c\.open\s*\)/.test(sc) && /v-for\s*=\s*["']\s*c\s+in\s+openItems\s*["']/.test(tp),
      ['React は render の中で filter するだけ。Vue では、計算してできる値は computed に書く。', 'import に computed を足し、script で openItems を作る。v-for は openItems を使う。',
        C("const openItems = computed(() => items.value.filter((c) => c.open))", 'ts')], A(F3, '⑥ ')),
  ]; }));

  /* ---------- ④ 親と子 ---------- */
  const F4 = 'ConsultCard.vue';
  set('親と子', text(F4, 'vue',
`<!-- React 版（子の部品。これと同じものを Vue で書く）
type Props = { id: number; title: string; done: boolean; onToggle: (id: number) => void }
export function ConsultCard({ id, title, done, onToggle }: Props) {
  return (
    <>
      <h3>{title}{done && '済'}</h3>
      <button onClick={() => onToggle(id)}>切り替え</button>
    </>
  )
}
-->

<script setup lang="ts">
// ① 親から受け取る title（文字）と done（真偽）を、defineProps で宣言する
// ② 親に知らせる toggle を、defineEmits で宣言する（emit に入れる）
</script>

<template>
  <!-- ③ h3 に title を表示する -->
  <!-- ④ 「切り替え」ボタンを押すと、emit で toggle を親に知らせる -->
  <!-- ⑤ done が true のときだけ、span で「済」を出す（v-if） -->
  <!-- ⑥ id（数字）も props に足し、toggle と一緒に親へ渡す -->
</template>
`, NOTE,
`<script setup lang="ts">
defineProps<{ id: number; title: string; done: boolean }>()
const emit = defineEmits<{ toggle: [id: number] }>()
</script>

<template>
  <h3>{{ title }}<span v-if="done">済</span></h3>
  <button @click="emit('toggle', id)">切り替え</button>
</template>
`,
  (v) => { const s = v[F4], sc = scr(s), tp = tpl(s); return [
    T('ConsultCard.vue の script で、title と done を defineProps で宣言する（React の Props 型に当たる）', 1, /defineProps\s*<\s*\{[^}]*\btitle\s*:\s*string[^}]*\}\s*>\s*\(\s*\)/.test(sc) && /defineProps\s*<\s*\{[^}]*\bdone\s*:\s*boolean[^}]*\}\s*>\s*\(\s*\)/.test(sc),
      ['React は関数の引数で受け取る。Vue は defineProps<{ … }>() で宣言する。', C('defineProps<{ title: string; done: boolean }>()', 'ts')], A(F4, '① ')),
    T('ConsultCard.vue の script で、toggle を defineEmits で宣言する（React の onToggle に当たる）', 1, /(const|let)\s+emit\s*=\s*defineEmits\s*<\s*\{[^}]*\btoggle\s*:\s*\[[^\]]*\][^}]*\}\s*>\s*\(\s*\)/.test(sc),
      ['React は「関数」を props で受け取る。Vue は「知らせる名前」を defineEmits で宣言する。', C('const emit = defineEmits<{ toggle: [] }>()', 'ts')], A(F4, '② ')),
    T('ConsultCard.vue の template で、h3 に title を表示する（{{ title }}）', 1, /<h3(?:[^>"']|"[^"]*"|'[^']*')*>[^]*?\{\{\s*title\s*\}\}[^]*?<\/h3>/.test(tp),
      ['React の {title} は、Vue では {{ title }}。', C('<h3>{{ title }}</h3>')], A(F4, '③ ')),
    T('ConsultCard.vue の template で、ボタンを押すと emit で toggle を親に知らせる（@click）', 2, /<button(?:[^>"']|"[^"]*"|'[^']*')*@click\s*=\s*["']\s*emit\s*\(\s*['"]toggle['"]/.test(tp),
      ['React の onClick={onToggle} は、親の関数を呼ぶ。Vue は emit(\'名前\') で親に知らせる。', C('<button @click="emit(\'toggle\')">切り替え</button>')], A(F4, '④ ')),
    T('ConsultCard.vue の template で、done が true のときだけ、span で「済」を出す（v-if）', 2, /<span(?:[^>"']|"[^"]*"|'[^']*')*v-if\s*=\s*["']\s*done\s*["'][^>]*>\s*済\s*<\/span>/.test(tp),
      ['React の {done && \'済\'} は、Vue では v-if。', C('<span v-if="done">済</span>')], A(F4, '⑤ ')),
    T('ConsultCard.vue の script で、id: number を props に足し、emit(\'toggle\', id) で親へ渡す（React の onToggle(id)）', 3, /defineProps\s*<\s*\{[^}]*\bid\s*:\s*number/.test(sc) && /defineEmits\s*<\s*\{[^}]*\btoggle\s*:\s*\[\s*\w+\s*:\s*number\s*\]/.test(sc) && /<button(?:[^>"']|"[^"]*"|'[^']*')*@click\s*=\s*["']\s*emit\s*\(\s*['"]toggle['"]\s*,\s*(props\.)?id\s*\)/.test(tp),
      ['emit の型は toggle: [id: number]。呼ぶときは emit(\'toggle\', id)。', 'props の id は、template ではそのまま id と書ける。', C("defineProps<{ id: number; title: string; done: boolean }>()\nconst emit = defineEmits<{ toggle: [id: number] }>()\n// <button @click=\"emit('toggle', id)\">", 'ts')], A(F4, '⑥ ')),
  ]; }));

  /* ---------- ⑤ 計算と副作用 ---------- */
  const F5 = 'CaseSummary.vue';
  set('計算と副作用', text(F5, 'vue',
`<!-- React 版（これと同じ画面を Vue で書く）
const [cases, setCases] = useState<Case[]>([])
const [loading, setLoading] = useState(true)
const openCount = cases.filter((c) => c.open).length
useEffect(() => {
  fetchCases().then((r) => { setCases(r); setLoading(false) })
}, [])
{loading && <p>読み込み中…</p>}
<p>受付中 {openCount} 件</p>
-->

<script setup lang="ts">
import { fetchCases, type Case } from './api'
// ① ref・computed・onMounted を vue から import する
// ② cases を ref<Case[]>([]) で作る
// ④ openCount を computed で作る（open が true の件数）
// ⑤ 画面が出た直後に、onMounted で fetchCases の結果を cases に入れる
// ⑥ loading を ref(true) で作り、取得できたら false にする
</script>

<template>
  <!-- ③ 「受付中 〇 件」と openCount を表示する -->
  <!-- ⑥ loading が true のあいだだけ、「読み込み中…」を v-if で出す -->
</template>
`, NOTE,
`<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchCases, type Case } from './api'

const cases = ref<Case[]>([])
const loading = ref(true)
const openCount = computed(() => cases.value.filter((c) => c.open).length)

onMounted(async () => {
  cases.value = await fetchCases()
  loading.value = false
})
</script>

<template>
  <p v-if="loading">読み込み中…</p>
  <p>受付中 {{ openCount }} 件</p>
</template>
`,
  (v) => { const s = v[F5], sc = scr(s), tp = tpl(s); const imp = (sc.match(/import\s*\{([^}]*)\}\s*from\s*['"]vue['"]/) || [, ''])[1]; return [
    T('CaseSummary.vue の script で、ref・computed・onMounted を vue から import する', 1, ['ref', 'computed', 'onMounted'].every((n) => new RegExp('\\b' + n + '\\b').test(imp)),
      ['React の useState / useEffect に当たる部品を、vue から import する。', C("import { ref, computed, onMounted } from 'vue'", 'ts')], A(F5, '① ')),
    T('CaseSummary.vue の script で、cases を ref<Case[]>([]) にする（useState<Case[]>([]) に当たる）', 1, /(const|let)\s+cases\s*=\s*ref\s*<\s*Case\s*\[\s*\]\s*>\s*\(\s*\[\s*\]\s*\)/.test(sc),
      ['最初は空の配列。型は < > に書く。', C('const cases = ref<Case[]>([])', 'ts')], A(F5, '② ')),
    T('CaseSummary.vue の template で、openCount を表示する（受付中 〇 件）', 1, /受付中\s*\{\{\s*openCount\s*\}\}\s*件/.test(tp),
      ['React の {openCount} は、Vue では {{ openCount }}。', C('<p>受付中 {{ openCount }} 件</p>')], A(F5, '③ ')),
    T('CaseSummary.vue の script で、open が true の件数を openCount に入れる（computed）', 2, /openCount\s*=\s*computed\s*\(\s*\(\s*\)\s*=>[^)]*cases\.value\.filter\s*\(\s*\(?\s*c\s*\)?\s*=>\s*c\.open\s*\)\s*\.length/.test(sc),
      ['React は render のたびに ふつうの式で計算する。Vue は computed に包む（元の値が変わったときだけ 計算し直す）。', 'script の中では cases.value と書く。', C('const openCount = computed(() => cases.value.filter((c) => c.open).length)', 'ts')], A(F5, '④ ')),
    T('CaseSummary.vue の script で、画面が出た直後に onMounted で fetchCases の結果を cases.value に入れる（useEffect の [] に当たる）', 2, /onMounted\s*\(\s*async\s*\(\s*\)\s*=>\s*\{[\s\S]*cases\.value\s*=\s*await\s+fetchCases\s*\(\s*\)/.test(sc),
      ['React の useEffect(() => {…}, []) は、Vue では onMounted(() => {…})。依存配列は要らない。', C('onMounted(async () => {\n  cases.value = await fetchCases()\n})', 'ts')], A(F5, '⑤ ')),
    T('CaseSummary.vue で、loading を ref(true) で作り、取得後に false にして、true のあいだだけ「読み込み中…」を出す', 3, /(const|let)\s+loading\s*=\s*ref\s*(<\s*boolean\s*>)?\s*\(\s*true\s*\)/.test(sc) && /onMounted[\s\S]*loading\.value\s*=\s*false/.test(sc) && /<p(?:[^>"']|"[^"]*"|'[^']*')*v-if\s*=\s*["']\s*loading\s*["'][^>]*>\s*読み込み中…?\s*<\/p>/.test(tp),
      ['① script：const loading = ref(true)　② onMounted の最後：loading.value = false　③ template：v-if="loading"', C('const loading = ref(true)\n// onMounted の中の最後\nloading.value = false\n\n<p v-if="loading">読み込み中…</p>', 'vue')], A(F5, '⑥ ')),
  ]; }));

  /* ---------- ⑥ まとめ：どう選ぶ？ ---------- */
  const F6 = 'BookingForm.vue';
  set('まとめ：どう選ぶ？', text(F6, 'vue',
`<!-- React 版（これと同じ画面を Vue で書く）
const [name, setName] = useState('')
const remaining = 20 - name.length
const canSend = name.length > 0 && remaining >= 0
<input value={name} onChange={(e) => setName(e.target.value)} />
<p>あと {remaining} 文字</p>
{remaining < 0 && <p>長すぎます</p>}
<button disabled={!canSend}>予約を送る</button>
-->

<script setup lang="ts">
import { ref } from 'vue'
// ① name を ref('') で作る
// ④ remaining（20 − 文字数）を computed で作る
// ⑥ canSend（1 文字以上、20 文字以内）を computed で作る
</script>

<template>
  <!-- ② 入力欄を v-model="name" でつなぐ（value と onChange の代わり） -->
  <!-- ③ 「あと 〇 文字」と remaining を表示する -->
  <!-- ⑤ remaining が 0 より小さいとき、「長すぎます」を v-if で出す -->
  <!-- ⑥ 「予約を送る」ボタンを、canSend でないとき :disabled にする -->
</template>
`, NOTE,
`<script setup lang="ts">
import { ref, computed } from 'vue'

const name = ref('')
const remaining = computed(() => 20 - name.value.length)
const canSend = computed(() => name.value.length > 0 && remaining.value >= 0)
</script>

<template>
  <input v-model="name" />
  <p>あと {{ remaining }} 文字</p>
  <p v-if="remaining < 0">長すぎます</p>
  <button :disabled="!canSend">予約を送る</button>
</template>
`,
  (v) => { const s = v[F6], sc = scr(s), tp = tpl(s); return [
    T('BookingForm.vue の script で、name を ref(\'\') にする（空の文字で始める）', 1, /(const|let)\s+name\s*=\s*ref\s*(<\s*string\s*>)?\s*\(\s*(''|"")\s*\)/.test(sc),
      ['React の useState(\'\') は、Vue では ref(\'\')。', C("const name = ref('')", 'ts')], A(F6, '① ')),
    T('BookingForm.vue の template で、入力欄を v-model="name" でつなぐ（React の value と onChange をまとめて）', 1, /<input(?:[^>"']|"[^"]*"|'[^']*')*v-model\s*=\s*["']name["']/.test(tp),
      ['React は value と onChange の 2 つが要る。Vue は v-model の 1 つで足りる。', C('<input v-model="name" />')], A(F6, '② ')),
    T('BookingForm.vue の template で、remaining を表示する（あと 〇 文字）', 1, /あと\s*\{\{\s*remaining\s*\}\}\s*文字/.test(tp),
      ['{{ remaining }} と書く。', C('<p>あと {{ remaining }} 文字</p>')], A(F6, '③ ')),
    T('BookingForm.vue の script で、remaining（20 から文字数を引いた数）を computed で作る', 2, /remaining\s*=\s*computed\s*\(\s*\(\s*\)\s*=>\s*20\s*-\s*name\.value\.length\s*\)/.test(sc) && /import\s*\{[^}]*\bcomputed\b[^}]*\}\s*from\s*['"]vue['"]/.test(sc),
      ['React は const remaining = 20 - name.length と書くだけ。Vue は computed で包む。import も忘れずに。', C('const remaining = computed(() => 20 - name.value.length)', 'ts')], A(F6, '④ ')),
    T('BookingForm.vue の template で、remaining が 0 より小さいとき「長すぎます」を v-if で出す', 2, /<p(?:[^>"']|"[^"]*"|'[^']*')*v-if\s*=\s*["']\s*remaining\s*<\s*0\s*["'][^>]*>\s*長すぎます\s*<\/p>/.test(tp),
      ['React の {remaining < 0 && <p>…</p>} は、Vue では v-if。', C('<p v-if="remaining < 0">長すぎます</p>')], A(F6, '⑤ ')),
    T('BookingForm.vue で、canSend を computed（1 文字以上かつ remaining が 0 以上）で作り、ボタンを :disabled="!canSend" にする', 3, /canSend\s*=\s*computed\s*\(\s*\(\s*\)\s*=>[^)]*name\.value\.length\s*>\s*0[^)]*remaining\.value\s*>=\s*0/.test(sc) && /<button(?:[^>"']|"[^"]*"|'[^']*')*:disabled\s*=\s*["']\s*!\s*canSend\s*["']/.test(tp),
      ['computed の中では、他の computed も .value を付けて使う。', C('const canSend = computed(() => name.value.length > 0 && remaining.value >= 0)\n// <button :disabled="!canSend">', 'ts')], A(F6, '⑥ ')),
  ]; }));
})();
