/* 練習：補足 x-vue-props「defineProps と defineModel の書き方」（シーン 1・2・3・5）。
   ランナー（core.js の sfcBuild）は Vue 3.4.27 相当：
   ・シーン1 …… 分割代入（オブジェクト・配列・関数の引数）を、本当に動かして確かめる（.vue 1 つ）。
   ・シーン2 …… 親＋子 2 つ。書き方を正規表現で確かめる（プレビューは動作の証明に使わない）。
   ・シーン3・5 …… プレビューなしの text モード（withDefaults の既定値・名前つき defineModel はランナーでは動かないため）。
   判定は、コメントを取り除いた本文に対して行う（TODO コメントの文言で通らないように）。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueDrillTools) return;
  const D = (K.drills = K.drills || {});
  const { multi, T, appText } = K.vueDrillTools;
  const ID = 'x-vue-props';
  D[ID] = D[ID] || {};

  const F = (s) => s.replace(/^\n/, '');
  const C = (code, lang) => ({ code: F(code), lang: lang || 'ts' });
  const A = (file, ...find) => ({ file, find });
  const nc = (s) => String(s || '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const re = (r, s) => r.test(s || '');
  const tpl = (s) => { const m = nc(s).match(/<template>([\s\S]*)<\/template>/); return m ? m[1] : ''; };
  const langOf = (n) => (/\.vue$/.test(n) ? 'vue' : 'ts');
  const norm = (o) => { const r = {}; Object.keys(o).forEach((k) => { r[k] = F(o[k]); }); return r; };

  /* プレビューなしの複数ファイル（text モード） */
  const textMulti = (files, sol, tasks, o) => Object.assign({
    mode: 'text', sfc: true, height: 340,
    files: Object.keys(files).map((n) => ({ name: n, lang: langOf(n), code: files[n] })),
    solution: sol, tasks,
  }, o || {});

  /* ============ 1. 分割代入：必要なキーだけ取り出す（動かして確かめる） ============ */
  {
    const HEAD = F(`
interface Lawyer {
  name: string
  field: string
  city: string
  fee?: number
}

const lawyer: Lawyer = { name: '山田 太郎', field: '労働問題', city: '東京', fee: 5500 }
const office: { name: string; tel?: string } = { name: '山田法律事務所' }
const list = ['離婚', '相続', '労働']
`);
    const TPL = F(`
<template>
  <div class="card">
    <h3>{{ name }}</h3>
    <p>相談料：{{ fee }} 円</p>
    <p>分野：{{ areaName }}</p>
    <p>電話：{{ tel }}</p>
    <p>所在地：{{ city }}</p>
    <p v-if="label">{{ label(lawyer) }}</p>
  </div>
</template>
`);
    const start = '<script setup lang="ts">\n' + HEAD + F(`
// ① lawyer から、name と fee だけを取り出す
// ② lawyer の field を、areaName という名前に付け替えて取り出す
// ③ office の tel を取り出す。無いときは '未登録' にする
// ④ lawyer の city を取り出し、残りは others にまとめる
// ⑤ list の先頭 2 つを、first と second に取り出す
// ⑥ 引数で { name, field } を取り出す関数 label を作る（「名前（分野）」を返す）
`) + '</script>\n\n' + TPL;
    const sol = '<script setup lang="ts">\n' + HEAD + F(`
const { name, fee } = lawyer
const { field: areaName } = lawyer
const { tel = '未登録' } = office
const { city, ...others } = lawyer
const [first, second] = list
const label = ({ name, field }: Lawyer): string => \`\${name}（\${field}）\`
`) + '</script>\n\n' + TPL;
    D[ID]['分割代入：必要なキーだけ取り出す'] = multi({ 'App.vue': start }, { 'App.vue': sol }, (v, c) => {
      const s = nc(v['App.vue']), t = appText(c);
      return [
        T('① LawyerCard.vue で、lawyer から name と fee を分割代入で取り出す（名前と「相談料：5500 円」が出る）', 1,
          re(/const\s*\{\s*(?:name\s*,\s*fee|fee\s*,\s*name)\s*\}\s*=\s*lawyer\b/, s) && /山田 太郎/.test(t) && /相談料：5500 円/.test(t),
          ['{ } に取り出したい名前を並べて、= の右に元のオブジェクト。', C('const { name, fee } = lawyer')], A('App.vue', '① ')),
        T('② LawyerCard.vue で、field を areaName という名前に付け替えて取り出す（「分野：労働問題」が出る）', 1,
          re(/const\s*\{\s*field\s*:\s*areaName\s*\}\s*=\s*lawyer\b/, s) && /分野：労働問題/.test(t),
          ['「元の名前: 新しい名前」と書く。この : は型ではなく、付け替え。', C('const { field: areaName } = lawyer')], A('App.vue', '② ')),
        T('③ LawyerCard.vue で、office の tel を、無いときは \'未登録\' にして取り出す（「電話：未登録」が出る）', 1,
          re(/const\s*\{\s*tel\s*=\s*['"]未登録['"]\s*\}\s*=\s*office\b/, s) && /電話：未登録/.test(t),
          ['取り出す名前のあとに = 初期値。値が無い（undefined）ときだけ使われる。', C("const { tel = '未登録' } = office")], A('App.vue', '③ ')),
        T('④ LawyerCard.vue で、city を取り出し、残りは ...others にまとめる（「所在地：東京」が出る）', 2,
          re(/const\s*\{\s*city\s*,\s*\.\.\.\s*others\s*\}\s*=\s*lawyer\b/, s) && /所在地：東京/.test(t),
          ['... は「残り全部」。必ず { } の最後に置く。', C('const { city, ...others } = lawyer')], A('App.vue', '④ ')),
        T('⑤ LawyerCard.vue で、list の先頭 2 つを [first, second] で取り出す（配列は { } ではなく [ ]）', 2,
          re(/const\s*\[\s*first\s*,\s*second\s*\]\s*=\s*list\b/, s),
          ['配列は、名前ではなく順番で取り出す。', C('const [first, second] = list')], A('App.vue', '⑤ ')),
        T('⑥ LawyerCard.vue で、引数 ({ name, field }: Lawyer) で取り出す関数 label を作る（「山田 太郎（労働問題）」が出る）', 3,
          re(/const\s+label\s*=\s*\(\s*\{\s*(?:name\s*,\s*field|field\s*,\s*name)\s*\}\s*(?::\s*Lawyer)?\s*\)[^=]*=>/, s) && /山田 太郎（労働問題）/.test(t),
          ['関数の引数の中でも、同じ { } で取り出せる。', C('const label = ({ name, field }: Lawyer): string => `${name}（${field}）`')], A('App.vue', '⑥ ')),
      ];
    }, { height: 320, alias: { 'App.vue': 'LawyerCard.vue' }, paths: { 'App.vue': 'src/components/LawyerCard.vue' }, fileNotes: { 'App.vue': '弁護士 1 人ぶんのカード（lawyer の中身から、必要なものを取り出す）' } });
  }

  /* ============ 2. defineProps の2通りの書き方 ============ */
  {
    const bcS = F(`
<script setup lang="ts">
// ① 親から title（string）と done（boolean）を受け取る。const props = に入れる
// ② props.done を読んで、'完了' か '未完了' を返す関数 mark を作る
</script>

<template>
  <div class="card">
    <!-- ③ title と mark() の結果を表示する（template では props. を付けない） -->
  </div>
</template>
`);
    const bcA = F(`
<script setup lang="ts">
const props = defineProps<{ title: string; done: boolean }>()

const mark = (): string => (props.done ? '完了' : '未完了')
</script>

<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <span>{{ mark() }}</span>
  </div>
</template>
`);
    const ctS = F(`
<script setup lang="ts">
// ④ 分割代入で、label（string）と urgent（boolean）を受け取る
// ⑤ urgent が true なら '急ぎ'、false なら '通常' を返す関数 level を作る（props. は使わない）
</script>

<template>
  <span class="badge">{{ label }} <b v-if="level">{{ level() }}</b></span>
</template>
`);
    const ctA = F(`
<script setup lang="ts">
const { label, urgent } = defineProps<{ label: string; urgent: boolean }>()

const level = (): string => (urgent ? '急ぎ' : '通常')
</script>

<template>
  <span class="badge">{{ label }} <b v-if="level">{{ level() }}</b></span>
</template>
`);
    const apS = F(`
<script setup lang="ts">
// ⑥ BookingCard に title と :done、ConsultTag に label と :urgent を渡す
</script>

<template>
  <BookingCard />
  <ConsultTag />
</template>
`);
    const apA = F(`
<script setup lang="ts">
</script>

<template>
  <BookingCard title="初回相談の予約" :done="false" />
  <ConsultTag label="離婚" :urgent="true" />
</template>
`);
    D[ID]['defineProps の2通りの書き方'] = multi(
      { 'App.vue': apS, 'BookingCard.vue': bcS, 'ConsultTag.vue': ctS },
      { 'App.vue': apA, 'BookingCard.vue': bcA, 'ConsultTag.vue': ctA },
      (v) => {
        const BC = nc(v['BookingCard.vue']), CT = nc(v['ConsultTag.vue']), P = nc(v['App.vue']), tb = tpl(v['BookingCard.vue']);
        return [
          T('① BookingCard.vue で、const props = defineProps<{ title: string; done: boolean }>() と書く（props. を付ける書き方）', 1,
            re(/const\s+props\s*=\s*defineProps\s*<\s*\{[^}]*\btitle\s*:\s*string[^}]*\bdone\s*:\s*boolean[^}]*\}\s*>\s*\(\s*\)/, BC),
            ['型リテラルで title と done を書き、結果を props に入れる。', C('const props = defineProps<{ title: string; done: boolean }>()')], A('BookingCard.vue', '① ')),
          T('② BookingCard.vue で、props.done を読んで \'完了\' か \'未完了\' を返す関数 mark を作る', 1,
            re(/(?:const\s+mark\s*=|function\s+mark\s*\()[\s\S]*?\bprops\.done\b/, BC) && /完了/.test(BC) && /未完了/.test(BC),
            ['script の中では、props.done と props. を付けて読む。', C("const mark = (): string => (props.done ? '完了' : '未完了')")], A('BookingCard.vue', '② ')),
          T('③ BookingCard.vue の template に、{{ title }} と {{ mark() }} を書く（template には props. を付けない）', 1,
            re(/\{\{\s*title\s*\}\}/, tb) && re(/\{\{\s*mark\s*\(\s*\)\s*\}\}/, tb) && !/props\./.test(tb),
            ['template では、props. なしで名前だけ。', C('<h3>{{ title }}</h3>\n<span>{{ mark() }}</span>', 'vue')], A('BookingCard.vue', '③ ')),
          T('④ ConsultTag.vue で、分割代入 const { label, urgent } = defineProps<…>() で受け取る（Vue 3.5 以上の書き方）', 2,
            re(/const\s*\{\s*(?:label\s*,\s*urgent|urgent\s*,\s*label)\s*\}\s*=\s*defineProps\s*<\s*\{[^}]*\blabel\s*:\s*string[^}]*\burgent\s*:\s*boolean/, CT),
            ['const props の代わりに { } で、使う名前だけ取り出す。', C('const { label, urgent } = defineProps<{ label: string; urgent: boolean }>()')], A('ConsultTag.vue', '④ ')),
          T('⑤ ConsultTag.vue で、urgent を props. なしで読んで \'急ぎ\' / \'通常\' を返す関数 level を作る', 2,
            re(/(?:const\s+level\s*=|function\s+level\s*\()[\s\S]*?\burgent\s*\?[\s\S]*?急ぎ[\s\S]*?通常/, CT) && !/props\./.test(CT),
            ['分割代入したので、script でも urgent だけで読める。', C("const level = (): string => (urgent ? '急ぎ' : '通常')")], A('ConsultTag.vue', '⑤ ')),
          T('⑥ ConsultListPage.vue で、BookingCard に title と :done、ConsultTag に label と :urgent を渡す', 3,
            re(/<BookingCard\b[^>]*\btitle\s*=\s*["'][^"']+["']/, P) && re(/<BookingCard\b[^>]*\s:done\s*=\s*["'](?:true|false)["']/, P) && re(/<ConsultTag\b[^>]*\blabel\s*=\s*["'][^"']+["']/, P) && re(/<ConsultTag\b[^>]*\s:urgent\s*=\s*["'](?:true|false)["']/, P),
            ['文字はそのまま、true / false は : を付けて渡す（付けないと文字列になる）。', C('<BookingCard title="初回相談の予約" :done="false" />\n<ConsultTag label="離婚" :urgent="true" />', 'vue')], A('App.vue', '⑥ ')),
        ];
      },
      { height: 360, alias: { 'App.vue': 'ConsultListPage.vue' }, paths: { 'App.vue': 'src/pages/ConsultListPage.vue', 'BookingCard.vue': 'src/components/BookingCard.vue', 'ConsultTag.vue': 'src/components/ConsultTag.vue' }, fileNotes: { 'App.vue': '親：部品を並べるページ', 'BookingCard.vue': '子：props. を付ける書き方', 'ConsultTag.vue': '子：分割代入の書き方' } });
  }

  /* ============ 3. デフォルト値と省略できる props（text モード） ============ */
  {
    const sbS = F(`
<script setup lang="ts">
type Size = 'sm' | 'md'

// ① size を「省略できる」props として受け取る（型は Size）
// ② withDefaults で、size を渡さないときは 'md' にする
</script>

<template>
  <!-- ③ class に size を付け、「相談中」と表示する（:class="size"） -->
</template>
`);
    const sbA = F(`
<script setup lang="ts">
type Size = 'sm' | 'md'

const props = withDefaults(
  defineProps<{ size?: Size }>(),
  { size: 'md' },
)
</script>

<template>
  <span class="badge" :class="size">相談中</span>
</template>
`);
    const plS = F(`
<script setup lang="ts">
type Plan = 'basic' | 'premium'

// ④ 分割代入で plan を受け取り、省略したら 'basic' にする（plan?: Plan）
// ⑤ fee（number、省略できる）も受け取り、省略したら 5500 にする
</script>

<template>
  <span class="plan">{{ plan }}：{{ fee }} 円</span>
</template>
`);
    const plA = F(`
<script setup lang="ts">
type Plan = 'basic' | 'premium'

const { plan = 'basic', fee = 5500 } = defineProps<{ plan?: Plan; fee?: number }>()
</script>

<template>
  <span class="plan">{{ plan }}：{{ fee }} 円</span>
</template>
`);
    const apS = F(`
<script setup lang="ts">
// ⑥ StatusBadge は size を渡さず（既定値の 'md' にする）、PlanLabel は plan="premium" だけを渡す
</script>

<template>
  <StatusBadge />
  <PlanLabel />
</template>
`);
    const apA = F(`
<script setup lang="ts">
</script>

<template>
  <StatusBadge />
  <PlanLabel plan="premium" />
</template>
`);
    D[ID]['デフォルト値と省略できる props'] = textMulti(
      { 'App.vue': apS, 'StatusBadge.vue': sbS, 'PlanLabel.vue': plS },
      { 'App.vue': apA, 'StatusBadge.vue': sbA, 'PlanLabel.vue': plA },
      (v) => {
        const SB = nc(v['StatusBadge.vue']), PL = nc(v['PlanLabel.vue']), P = nc(v['App.vue']), ts = tpl(v['StatusBadge.vue']);
        return [
          T('① StatusBadge.vue で、defineProps<{ size?: Size }>() と、省略できる size（?）を書く', 1,
            re(/defineProps\s*<\s*\{[^}]*\bsize\s*\?\s*:\s*Size\b/, SB),
            ['省略できる props は、名前のあとに ? を付ける。', C('defineProps<{ size?: Size }>()')], A('StatusBadge.vue', '① ')),
          T('② StatusBadge.vue で、withDefaults を使って、size の既定値を \'md\' にする', 1,
            re(/withDefaults\s*\(\s*defineProps\s*<[\s\S]*?>\s*\(\s*\)\s*,\s*\{[^}]*\bsize\s*:\s*['"]md['"]/, SB),
            ['withDefaults(defineProps<…>(), { 名前: 既定値 }) の形。', C("const props = withDefaults(\n  defineProps<{ size?: Size }>(),\n  { size: 'md' },\n)")], A('StatusBadge.vue', '② ')),
          T('③ StatusBadge.vue の template で、<span> に :class="size" を付け、「相談中」と表示する', 1,
            re(/<span\b[^>]*:class\s*=\s*["']size["']/, ts) && /相談中/.test(ts),
            ['template では props. なしで、size だけ。', C('<span class="badge" :class="size">相談中</span>', 'vue')], A('StatusBadge.vue', '③ ')),
          T('④ PlanLabel.vue で、分割代入の = で plan の既定値を \'basic\' にする（plan?: Plan）', 2,
            re(/const\s*\{[^}]*\bplan\s*=\s*['"]basic['"][^}]*\}\s*=\s*defineProps\s*<\s*\{[^}]*\bplan\s*\?\s*:\s*Plan/, PL),
            ['取り出す名前のあとに = 既定値。型には ? を付ける。', C("const { plan = 'basic' } = defineProps<{ plan?: Plan }>()")], A('PlanLabel.vue', '④ ')),
          T('⑤ PlanLabel.vue で、同じ分割代入に fee（fee?: number）も足し、既定値を 5500 にする', 2,
            re(/const\s*\{[^}]*\bfee\s*=\s*5500\b[^}]*\}\s*=\s*defineProps\s*<\s*\{[^}]*\bfee\s*\?\s*:\s*number/, PL) && re(/\bplan\s*=\s*['"]basic['"]/, PL),
            ['{ } の中に、カンマで並べる。', C("const { plan = 'basic', fee = 5500 } = defineProps<{ plan?: Plan; fee?: number }>()")], A('PlanLabel.vue', '⑤ ')),
          T('⑥ ConsultListPage.vue で、StatusBadge には size を渡さず、PlanLabel には plan="premium" だけを渡す', 3,
            re(/<StatusBadge\b(?![^>]*\bsize\b)[^>]*\/?>/, P) && re(/<PlanLabel\b[^>]*\bplan\s*=\s*["']premium["']/, P) && !re(/<PlanLabel\b[^>]*\bfee\b/, P),
            ['渡さなければ、子の既定値が使われる（size は \'md\'、fee は 5500）。', C('<StatusBadge />\n<PlanLabel plan="premium" />', 'vue')], A('App.vue', '⑥ ')),
        ];
      },
      { height: 360, note: '<b>省略できる props には、既定値を決める</b><br>・<code>withDefaults</code>：Vue 3.4 以下でも使える<br>・分割代入の <code>=</code>：Vue 3.5 以上。短い<br>（このランナーは Vue 3.4 のため、書き方を自動チェックします）', alias: { 'App.vue': 'ConsultListPage.vue' }, paths: { 'App.vue': 'src/pages/ConsultListPage.vue', 'StatusBadge.vue': 'src/components/StatusBadge.vue', 'PlanLabel.vue': 'src/components/PlanLabel.vue' }, fileNotes: { 'App.vue': '親：部品を並べるページ', 'StatusBadge.vue': '子：withDefaults で既定値', 'PlanLabel.vue': '子：分割代入の = で既定値' } });
  }

  /* ============ 5. defineModel の書き方（text モード） ============ */
  {
    const niS = F(`
<script setup lang="ts">
// ① defineModel で model を作る（string）
</script>

<template>
  <!-- ② <input> を、v-model="model" でつなぐ -->
</template>
`);
    const niA = F(`
<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <input v-model="model" />
</template>
`);
    const psS = F(`
<script setup lang="ts">
// ④ 名前つき v-model：'count' という名前の defineModel（number）を作る
</script>

<template>
  <button @click="count--">−</button>
  <b>{{ count }}</b>
  <button @click="count++">＋</button>
</template>
`);
    const psA = F(`
<script setup lang="ts">
const count = defineModel<number>('count')
</script>

<template>
  <button @click="count--">−</button>
  <b>{{ count }}</b>
  <button @click="count++">＋</button>
</template>
`);
    const tiS = F(`
<script setup lang="ts">
// ⑥ defineModel<string>() の返り値を [model, modifiers] で受け取る
</script>

<template>
  <input v-model="model" />
  <small><!-- ⑥ modifiers.trim が true のときだけ「前後の空白は消えます」を出す（v-if） --></small>
</template>
`);
    const tiA = F(`
<script setup lang="ts">
const [model, modifiers] = defineModel<string>()
</script>

<template>
  <input v-model="model" />
  <small v-if="modifiers.trim">前後の空白は消えます</small>
</template>
`);
    const apS = F(`
<script setup lang="ts">
import { ref } from 'vue'

const name = ref<string>('山田 太郎')
const people = ref<number>(2)

// ③ NameInput を、v-model で name とつなぐ
// ⑤ PeopleStepper を、v-model:count で people とつなぐ
</script>

<template>
  <NameInput />
  <PeopleStepper />
  <TrimInput v-model.trim="name" />
  <p>{{ name }}（{{ people }} 名）</p>
</template>
`);
    const apA = F(`
<script setup lang="ts">
import { ref } from 'vue'

const name = ref<string>('山田 太郎')
const people = ref<number>(2)
</script>

<template>
  <NameInput v-model="name" />
  <PeopleStepper v-model:count="people" />
  <TrimInput v-model.trim="name" />
  <p>{{ name }}（{{ people }} 名）</p>
</template>
`);
    D[ID]['defineModel の書き方'] = textMulti(
      { 'App.vue': apS, 'NameInput.vue': niS, 'PeopleStepper.vue': psS, 'TrimInput.vue': tiS },
      { 'App.vue': apA, 'NameInput.vue': niA, 'PeopleStepper.vue': psA, 'TrimInput.vue': tiA },
      (v) => {
        const NI = nc(v['NameInput.vue']), PS = nc(v['PeopleStepper.vue']), TI = nc(v['TrimInput.vue']), P = nc(v['App.vue']), tn = tpl(v['NameInput.vue']), tt = tpl(v['TrimInput.vue']);
        return [
          T('① NameInput.vue で、const model = defineModel<string>() と書く（props と emit の代わりの 1 行）', 1,
            re(/const\s+model\s*=\s*defineModel\s*<\s*string\s*>\s*\(\s*\)/, NI),
            ['defineModel<型>() の結果を、model に入れる。', C('const model = defineModel<string>()')], A('NameInput.vue', '① ')),
          T('② NameInput.vue の template で、<input> を v-model="model" でつなぐ', 1,
            re(/<input\b[^>]*\bv-model\s*=\s*["']model["']/, tn),
            ['model は、そのまま v-model に渡せる。', C('<input v-model="model" />', 'vue')], A('NameInput.vue', '② ')),
          T('③ ConsultFormPage.vue で、<NameInput> を v-model="name" で name とつなぐ', 1,
            re(/<NameInput\b[^>]*\bv-model\s*=\s*["']name["']/, P),
            ['親は、ふつうの入力欄と同じ v-model。', C('<NameInput v-model="name" />', 'vue')], A('App.vue', '③ ')),
          T('④ PeopleStepper.vue で、名前つきの defineModel<number>(\'count\') を count に入れる', 2,
            re(/const\s+count\s*=\s*defineModel\s*<\s*number\s*>\s*\(\s*['"]count['"]\s*\)/, PS),
            ['defineModel の引数に、名前を文字列で書く。', C("const count = defineModel<number>('count')")], A('PeopleStepper.vue', '④ ')),
          T('⑤ ConsultFormPage.vue で、<PeopleStepper> を v-model:count="people" で people とつなぐ', 2,
            re(/<PeopleStepper\b[^>]*\bv-model:count\s*=\s*["']people["']/, P),
            ['名前つきは、v-model:名前="親の変数"。', C('<PeopleStepper v-model:count="people" />', 'vue')], A('App.vue', '⑤ ')),
          T('⑥ TrimInput.vue で、[model, modifiers] を defineModel<string>() から受け取り、v-if="modifiers.trim" で注意書きを出す', 3,
            re(/const\s*\[\s*model\s*,\s*modifiers\s*\]\s*=\s*defineModel\s*<\s*string\s*>\s*\(/, TI) && re(/v-if\s*=\s*["']modifiers\.trim["']/, tt),
            ['返り値は [値, 修飾子] の配列。親が .trim を付けると、modifiers.trim が true になる。', C('const [model, modifiers] = defineModel<string>()\n\n<small v-if="modifiers.trim">前後の空白は消えます</small>', 'vue')], A('TrimInput.vue', '⑥ ')),
        ];
      },
      { height: 380, note: '<b>defineModel</b>：子の <code>v-model</code> の受け口を 1 行で書く。<br>親は <code>v-model</code>（名前つきは <code>v-model:count</code>）。<br>（このランナーは Vue 3.4 のため、書き方を自動チェックします）', alias: { 'App.vue': 'ConsultFormPage.vue' }, paths: { 'App.vue': 'src/pages/ConsultFormPage.vue', 'NameInput.vue': 'src/components/NameInput.vue', 'PeopleStepper.vue': 'src/components/PeopleStepper.vue', 'TrimInput.vue': 'src/components/TrimInput.vue' }, fileNotes: { 'App.vue': '親：v-model でつなぐページ', 'NameInput.vue': '子：基本の defineModel', 'PeopleStepper.vue': '子：名前つきの defineModel', 'TrimInput.vue': '子：修飾子を読む' } });
  }
})();
