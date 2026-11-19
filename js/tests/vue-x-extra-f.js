/* 補足 Vue「defineProps と defineModel の書き方」（x-vue-props）のレッスン最終テスト。
   初級×3・中級×2・上級×1（必須 6 ミッション）。
   ファイル：ConsultPage.vue（親）＋ CaseCard.vue / ReplyBox.vue / SeatsInput.vue（子）。
   ランナーは Vue 3.4 のため、分割代入の props・withDefaults・名前つき defineModel は動かせない。→ 書き方を正規表現で自動チェック（コメントは除いて判定）。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueDrillTools) return;
  const { T } = K.vueDrillTools;
  K.tests = K.tests || {};
  const lock = (id, test) => Object.defineProperty(K.tests, id, { get: () => test, set: () => {}, configurable: true, enumerable: true });

  const F = (s) => s.replace(/^\n/, '');
  const C = (code, lang) => ({ code: F(code), lang: lang || 'ts' });
  const nc = (s) => String(s || '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const re = (r, s) => r.test(s || '');
  const tpl = (s) => { const m = nc(s).match(/<template>([\s\S]*)<\/template>/); return m ? m[1] : ''; };

  const CARD_S = F(`
<script setup lang="ts">
import { watch } from 'vue'

type Size = 'sm' | 'md'

// ① title（string）と urgent（boolean）を、分割代入で受け取る
// ② size（Size 型、省略できる）も受け取り、省略したら 'md' にする
// ④ title が変わったら log(title) を呼ぶ（watch。title は getter にして渡す）
const log = (t: string): void => console.log(t)
</script>

<template>
  <div class="card" :class="size">{{ title }} <b v-if="urgent">急ぎ</b></div>
</template>
`);
  const CARD_A = F(`
<script setup lang="ts">
import { watch } from 'vue'

type Size = 'sm' | 'md'

const { title, urgent, size = 'md' } = defineProps<{ title: string; urgent: boolean; size?: Size }>()

watch(() => title, (t) => log(t))
const log = (t: string): void => console.log(t)
</script>

<template>
  <div class="card" :class="size">{{ title }} <b v-if="urgent">急ぎ</b></div>
</template>
`);
  const REPLY_S = F(`
<script setup lang="ts">
// ③ defineModel で model を作る（string）。textarea と v-model でつなぐ
</script>

<template>
  <!-- ③ <textarea> を書く -->
</template>
`);
  const REPLY_A = F(`
<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <textarea v-model="model"></textarea>
</template>
`);
  const SEATS_S = F(`
<script setup lang="ts">
// ⑥ 'seats' という名前つきの defineModel（number）を作る
</script>

<template>
  <button @click="seats--">−</button>
  <b>{{ seats }}</b>
  <button @click="seats++">＋</button>
</template>
`);
  const SEATS_A = F(`
<script setup lang="ts">
const seats = defineModel<number>('seats')
</script>

<template>
  <button @click="seats--">−</button>
  <b>{{ seats }}</b>
  <button @click="seats++">＋</button>
</template>
`);
  const PAGE_S = F(`
<script setup lang="ts">
import { ref } from 'vue'

const reply = ref<string>('')
const people = ref<number>(2)

// ⑤ ReplyBox を v-model="reply" でつなぎ、CaseCard に title と :urgent を渡す
// ⑥ SeatsInput を v-model:seats="people" でつなぐ
</script>

<template>
  <CaseCard />
  <ReplyBox />
  <SeatsInput />
  <p>返信：{{ reply }}／{{ people }} 名</p>
</template>
`);
  const PAGE_A = F(`
<script setup lang="ts">
import { ref } from 'vue'

const reply = ref<string>('')
const people = ref<number>(2)
</script>

<template>
  <CaseCard title="離婚の相談" :urgent="true" />
  <ReplyBox v-model="reply" />
  <SeatsInput v-model:seats="people" />
  <p>返信：{{ reply }}／{{ people }} 名</p>
</template>
`);

  const FILES = { 'App.vue': PAGE_S, 'CaseCard.vue': CARD_S, 'ReplyBox.vue': REPLY_S, 'SeatsInput.vue': SEATS_S };
  const SOL = { 'App.vue': PAGE_A, 'CaseCard.vue': CARD_A, 'ReplyBox.vue': REPLY_A, 'SeatsInput.vue': SEATS_A };
  const A = (file, find) => ({ file, find: [find] });

  const test = {
    mode: 'text', sfc: true, height: 400,
    alias: { 'App.vue': 'ConsultPage.vue' },
    files: Object.keys(FILES).map((n) => ({ name: n, lang: 'vue', code: FILES[n] })),
    paths: { 'App.vue': 'src/pages/ConsultPage.vue', 'CaseCard.vue': 'src/components/CaseCard.vue', 'ReplyBox.vue': 'src/components/ReplyBox.vue', 'SeatsInput.vue': 'src/components/SeatsInput.vue' },
    fileNotes: { 'App.vue': '親：子を並べて v-model でつなぐ', 'CaseCard.vue': '子：props を分割代入で受け取る', 'ReplyBox.vue': '子：defineModel（返信の文章）', 'SeatsInput.vue': '子：名前つき defineModel（人数）' },
    note: '<b>最終チャレンジ</b>：<code>defineProps</code> は<b>分割代入</b>で受け取り、親子で値を行き来させるところは <b>defineModel</b> で書く。<br>（Vue 3.5 以上の書き方。ランナーは書き方を自動チェックします）',
    solution: SOL,
    tasks: (v) => {
      const CD = nc(v['CaseCard.vue']), RB = nc(v['ReplyBox.vue']), SI = nc(v['SeatsInput.vue']), P = nc(v['App.vue']), tr = tpl(v['ReplyBox.vue']);
      return [
        T('① CaseCard.vue で、title（string）と urgent（boolean）を、const { title, urgent } = defineProps<…>() で受け取る', 1,
          re(/const\s*\{[^}]*\btitle\b[^}]*\burgent\b[^}]*\}\s*=\s*defineProps\s*<\s*\{[^}]*\btitle\s*:\s*string[^}]*\burgent\s*:\s*boolean/, CD) || re(/const\s*\{[^}]*\burgent\b[^}]*\btitle\b[^}]*\}\s*=\s*defineProps\s*<\s*\{[^}]*\btitle\s*:\s*string[^}]*\burgent\s*:\s*boolean/, CD),
          ['{ } で使う名前だけ取り出し、= の右に defineProps<{ … }>()。', C('const { title, urgent } = defineProps<{ title: string; urgent: boolean }>()')], A('CaseCard.vue', '// ① ')),
        T('② CaseCard.vue で、省略できる size?: Size を足し、分割代入の = で既定値を \'md\' にする', 1,
          re(/const\s*\{[^}]*\bsize\s*=\s*['"]md['"][^}]*\}\s*=\s*defineProps\s*<\s*\{[^}]*\bsize\s*\?\s*:\s*Size\b/, CD),
          ['型には ? を付け、取り出す側に = \'md\'。', C("const { title, urgent, size = 'md' } = defineProps<{ title: string; urgent: boolean; size?: Size }>()")], A('CaseCard.vue', '// ② ')),
        T('③ ReplyBox.vue で、const model = defineModel<string>() と書き、<textarea v-model="model"> につなぐ', 1,
          re(/const\s+model\s*=\s*defineModel\s*<\s*string\s*>\s*\(\s*\)/, RB) && re(/<textarea\b[^>]*\bv-model\s*=\s*["']model["']/, tr),
          ['props と emit を書かなくても、defineModel の 1 行で済む。', C('const model = defineModel<string>()\n\n<textarea v-model="model"></textarea>', 'vue')], A('ReplyBox.vue', '// ③ ')),
        T('④ CaseCard.vue で、watch の第 1 引数を getter（() => title）にして、title の変化を見張る', 2,
          re(/watch\s*\(\s*\(\s*\)\s*=>\s*title\s*,/, CD) && !re(/watch\s*\(\s*title\b/, CD),
          ['分割代入した title をそのまま渡すと「値」を渡しただけ。変化を追うなら、関数にして渡す。', C('watch(() => title, (t) => log(t))')], A('CaseCard.vue', '// ④ ')),
        T('⑤ ConsultPage.vue で、ReplyBox を v-model="reply" でつなぎ、CaseCard に title と :urgent を渡す', 2,
          re(/<ReplyBox\b[^>]*\bv-model\s*=\s*["']reply["']/, P) && re(/<CaseCard\b[^>]*\btitle\s*=\s*["'][^"']+["']/, P) && re(/<CaseCard\b[^>]*\s:urgent\s*=\s*["'](?:true|false)["']/, P),
          ['v-model は子の defineModel と対。true / false は : を付けて渡す。', C('<CaseCard title="離婚の相談" :urgent="true" />\n<ReplyBox v-model="reply" />', 'vue')], A('App.vue', '// ⑤ ')),
        T('⑥ SeatsInput.vue で defineModel<number>(\'seats\') を書き、ConsultPage.vue から v-model:seats="people" でつなぐ（人数が行き来する）', 3,
          re(/const\s+seats\s*=\s*defineModel\s*<\s*number\s*>\s*\(\s*['"]seats['"]\s*\)/, SI) && re(/<SeatsInput\b[^>]*\bv-model:seats\s*=\s*["']people["']/, P),
          ['名前つき v-model は、子が defineModel(\'名前\')、親が v-model:名前 のペア。', C("const seats = defineModel<number>('seats')\n\n<SeatsInput v-model:seats=\"people\" />", 'vue')], A('SeatsInput.vue', '// ⑥ ')),
      ];
    },
  };
  lock('x-vue-props', test);
})();
