/* 練習：補足 x-vue-atomic「アトミックデザイン入門」（シーン 2・3・4・5）。
   ・シーン2〜4 …… 複数の .vue（atoms / molecules / organisms / page）を、ブラウザの中で本当に動かして確かめる。
     ランナー（core.js の sfcBuild）の制約：defineProps / defineEmits は型リテラル直書き、defineModel は
     `const model = defineModel<T>()` の形だけ。import は 1 行で ./X.vue 形式（実行時は全部品が登録される）。
   ・シーン5 …… 置き場所の仕分け（text モード）。
   判定は、コメントを取り除いた本文に対して行う（TODO コメントの文言で通らないように）。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueDrillTools) return;
  const D = (K.drills = K.drills || {});
  const { multi, text, T, appText, $q, $all, lines } = K.vueDrillTools;
  const ID = 'x-vue-atomic';
  D[ID] = D[ID] || {};

  const F = (s) => s.replace(/^\n/, '');
  const C = (code, lang) => ({ code: F(code), lang: lang || 'vue' });
  const A = (file, ...find) => ({ file, find });
  const nc = (s) => String(s || '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const re = (r, s) => r.test(s || '');
  const count = (r, s) => (String(s || '').match(r) || []).length;
  const cleanAll = (v) => { const w = {}; Object.keys(v).forEach((n) => { w[n] = nc(v[n]); }); return w; };

  /* 共通の見た目（全部品に効く） */
  const ST = `
<style scoped>
button { margin: 4px 6px 4px 0; border-radius: 6px; border: 1px solid #aab; padding: 4px 12px; background: #eef2ff; }
.primary { background: #2f6df0; border-color: #2f6df0; color: #fff; }
.danger { background: #e5484d; border-color: #e5484d; color: #fff; }
.sm { font-size: 12px; padding: 2px 8px; }
.card, .row { border: 1px solid #d5d9e0; border-radius: 8px; padding: 6px 12px; margin: 6px 0; }
input { border: 1px solid #b9c4e4; border-radius: 6px; padding: 4px 8px; }
.layout { display: grid; gap: 8px; }
</style>
`;
  const V = (script, tpl, style) => (script === null ? '' : '<script setup lang="ts">\n' + script + '</script>\n\n') + '<template>\n' + tpl + '</template>\n' + (style === false ? '' : ST);

  const BASE_BUTTON = V("defineProps<{ variant?: 'primary' | 'danger'; size?: 'sm' | 'md'; disabled?: boolean }>()\n", '  <button :class="[variant, size]" :disabled="disabled"><slot /></button>\n');
  const BASE_INPUT = V('const model = defineModel<string>()\n', '  <input v-model="model" placeholder="地域・分野で探す" />\n');
  const LAWYER_TYPE = 'export interface Lawyer {\n  id: number\n  name: string\n  field: string\n}\n';

  /* ============ 2. Atoms：これ以上分けない最小の部品 ============ */
  {
    const page = (script, tpl) => V("import { ref } from 'vue'\n" + script, tpl);
    const startPage = page(F(`
// ③ BaseButton を import する（'@/components/atoms/BaseButton.vue'）
// ⑤ BaseInput を import する（'@/components/atoms/BaseInput.vue'）

const name = ref<string>('山田')
`), F(`
  <h3>相談の予約</h3>
  <!-- ⑤ お名前の入力欄を、name と v-model でつなぐ -->
  <p>お名前：{{ name }}</p>
  <!-- ③ 下の button 2 つを BaseButton に置き換える（キャンセルは variant="danger"） -->
  <button class="primary">予約する</button>
  <button class="danger">キャンセル</button>
`));
    const solPage = page(F(`
import BaseButton from '@/components/atoms/BaseButton.vue'
import BaseInput from '@/components/atoms/BaseInput.vue'

const name = ref<string>('山田')
`), F(`
  <h3>相談の予約</h3>
  <BaseInput v-model="name" />
  <p>お名前：{{ name }}</p>
  <BaseButton variant="primary">予約する</BaseButton>
  <BaseButton variant="danger" size="sm">キャンセル</BaseButton>
`));
    const startBtn = V(F(`
// ① variant（'primary' か 'danger'、省略可）と disabled（boolean、省略可）を props で受け取る
// ⑥ size（'sm' か 'md'、省略可）も受け取り、class に足す
`), F(`
  <!-- ② button に :class と :disabled を付け、ラベルは slot で受ける -->
  <button>ボタン</button>
`));
    const startInp = V(F(`
// ④ defineModel<string>() で model を作り、input の v-model につなぐ
`), F(`
  <input placeholder="お名前" />
`));
    D[ID]['Atoms：これ以上分けない最小の部品'] = multi({ 'App.vue': startPage, 'BaseButton.vue': startBtn, 'BaseInput.vue': startInp },
      { 'App.vue': solPage, 'BaseButton.vue': BASE_BUTTON, 'BaseInput.vue': V('const model = defineModel<string>()\n', '  <input v-model="model" placeholder="お名前" />\n') },
      (v, c) => {
        const w = cleanAll(v), P = w['App.vue'], B = w['BaseButton.vue'], I = w['BaseInput.vue'];
        const btns = $all(c, 'button');
        return [
          T("① BaseButton.vue で、defineProps に variant（'primary' か 'danger'）と disabled（boolean）を、省略できる形で書く", 1,
            re(/defineProps\s*<\s*\{[^}]*\bvariant\s*\?\s*:\s*['"]primary['"]\s*\|\s*['"]danger['"]/, B) && re(/defineProps\s*<\s*\{[^}]*\bdisabled\s*\?\s*:\s*boolean/, B),
            ['atom は、見た目を props で変える。省略できる props は ? を付ける。', C("defineProps<{ variant?: 'primary' | 'danger'; disabled?: boolean }>()", 'ts')], A('BaseButton.vue', '① ')),
          T('② BaseButton.vue で、button に :class="variant" と :disabled="disabled" を付け、ラベルは <slot /> で受ける', 1,
            re(/<button[^>]*:class\s*=\s*["'][^"']*variant/, B) && re(/<button[^>]*:disabled\s*=\s*["']disabled["']/, B) && re(/<slot\s*\/?>/, B) && !/ボタン/.test(B),
            ['ラベルを書き込まず slot にすると、どの画面でも使い回せる。', C('<button :class="variant" :disabled="disabled"><slot /></button>')], A('BaseButton.vue', '② ')),
          T('③ ConsultButtonsPage.vue で、BaseButton を import し、2 つの button を <BaseButton> に置き換える（予約する・キャンセル。キャンセルは variant="danger"）', 1,
            re(/import\s+BaseButton\s+from\s+['"][^'"]*BaseButton\.vue['"]/, P) && count(/<BaseButton\b/g, P) >= 2 && !re(/<button\b/, P) && re(/<BaseButton[^>]*variant\s*=\s*["']danger["'][^>]*>\s*キャンセル/, P) && /予約する/.test(appText(c)) && /キャンセル/.test(appText(c)),
            ['生の <button> を、atom の BaseButton に置き換える。', C('<BaseButton variant="danger">キャンセル</BaseButton>')], A('App.vue', '③ ')),
          T('④ BaseInput.vue で、const model = defineModel<string>() を書き、input に v-model="model" をつなぐ', 2,
            re(/const\s+model\s*=\s*defineModel\s*<\s*string\s*>\s*\(\s*\)/, I) && re(/<input[^>]*v-model\s*=\s*["']model["']/, I),
            ['atom の入力欄は defineModel 1 行で、親の v-model を受けられる。', C('const model = defineModel<string>()\n\n<input v-model="model" />')], A('BaseInput.vue', '④ ')),
          T('⑤ ConsultButtonsPage.vue で、BaseInput を import し、<BaseInput v-model="name" /> を置く（画面に入力欄が出る）', 2,
            re(/import\s+BaseInput\s+from\s+['"][^'"]*BaseInput\.vue['"]/, P) && re(/<BaseInput[^>]*v-model\s*=\s*["']name["']/, P) && !!$q(c, 'input'),
            ['親は v-model で、自分の値と atom をつなぐ。', C('<BaseInput v-model="name" />')], A('App.vue', '⑤ ')),
          T('⑥ BaseButton.vue で、size（\'sm\' か \'md\'）を足して :class="[variant, size]" にし、ConsultButtonsPage.vue でキャンセルに size="sm" を渡す', 3,
            re(/defineProps\s*<\s*\{[^}]*\bsize\s*\?\s*:\s*['"]sm['"]\s*\|\s*['"]md['"]/, B) && re(/<button[^>]*:class\s*=\s*["']\[\s*variant\s*,\s*size\s*\]["']/, B) && re(/<BaseButton[^>]*size\s*=\s*["']sm["']/, P) && btns.some((b) => b.classList.contains('sm')),
            ['class を 2 つ付けるときは、配列で書く。', C("defineProps<{ size?: 'sm' | 'md' }>()\n\n<button :class=\"[variant, size]\">")], A('BaseButton.vue', '⑥ ')),
        ];
      },
      { height: 320, alias: { 'App.vue': 'ConsultButtonsPage.vue' }, paths: { 'App.vue': 'pages/ConsultButtonsPage.vue', 'BaseButton.vue': 'components/atoms/BaseButton.vue', 'BaseInput.vue': 'components/atoms/BaseInput.vue' },
        fileNotes: { 'App.vue': 'page：ボタンと入力欄を並べる（atoms を使う側）', 'BaseButton.vue': 'atom：見た目と最小の動きだけ。API を知らない', 'BaseInput.vue': 'atom：入力欄。v-model を受ける' } });
  }

  /* ============ 3. Molecules：atoms を組み合わせる ============ */
  {
    const startBox = V(F(`
// ① BaseInput と BaseButton を import する（'../atoms/…'）
// ② defineModel<string>() で model を作り、<BaseInput> に v-model でつなぐ
// ④ defineEmits<{ search: [] }>() を書き、検索ボタンの @click で emit('search') する
`), F(`
  <div class="row">
    <!-- ② ここに BaseInput -->
    <!-- ③ ここに「検索」ボタン（BaseButton） -->
  </div>
`));
    const solBox = V(F(`
import BaseInput from '../atoms/BaseInput.vue'
import BaseButton from '../atoms/BaseButton.vue'

const model = defineModel<string>()
const emit = defineEmits<{ search: [] }>()
`), F(`
  <div class="row">
    <BaseInput v-model="model" />
    <BaseButton variant="primary" @click="emit('search')">検索</BaseButton>
  </div>
`));
    const startPage = V(F(`
import { ref } from 'vue'
import SearchBox from '@/components/molecules/SearchBox.vue'

const keyword = ref<string>('離婚')
const searched = ref<string>('')
// ⑥ search 関数を作り、searched に keyword を入れる（SearchBox の @search で呼ぶ）
`), F(`
  <h3>弁護士をさがす</h3>
  <!-- ⑤ SearchBox を keyword と v-model でつなぐ -->
  <SearchBox />
  <p>検索したキーワード：{{ searched }}</p>
`));
    const solPage = V(F(`
import { ref } from 'vue'
import SearchBox from '@/components/molecules/SearchBox.vue'

const keyword = ref<string>('離婚')
const searched = ref<string>('')

const search = (): void => {
  searched.value = keyword.value
}
`), F(`
  <h3>弁護士をさがす</h3>
  <SearchBox v-model="keyword" @search="search" />
  <p>検索したキーワード：{{ searched }}</p>
`));
    D[ID]['Molecules：atoms を組み合わせる'] = multi({ 'App.vue': startPage, 'SearchBox.vue': startBox, 'BaseInput.vue': BASE_INPUT, 'BaseButton.vue': BASE_BUTTON },
      { 'App.vue': solPage, 'SearchBox.vue': solBox, 'BaseInput.vue': BASE_INPUT, 'BaseButton.vue': BASE_BUTTON },
      (v, c) => {
        const w = cleanAll(v), P = w['App.vue'], B = w['SearchBox.vue'];
        return [
          T('① SearchBox.vue で、BaseInput と BaseButton を import する', 1,
            re(/import\s+BaseInput\s+from\s+['"][^'"]*BaseInput\.vue['"]/, B) && re(/import\s+BaseButton\s+from\s+['"][^'"]*BaseButton\.vue['"]/, B),
            ['molecule は atoms を import して組み合わせる。', C("import BaseInput from '../atoms/BaseInput.vue'\nimport BaseButton from '../atoms/BaseButton.vue'", 'ts')], A('SearchBox.vue', '① ')),
          T('② SearchBox.vue で、const model = defineModel<string>() を書き、<BaseInput v-model="model" /> を置く（画面に入力欄が出る）', 1,
            re(/const\s+model\s*=\s*defineModel\s*<\s*string\s*>\s*\(\s*\)/, B) && re(/<BaseInput[^>]*v-model\s*=\s*["']model["']/, B) && !!$q(c, 'input'),
            ['親の v-model を、そのまま atom に流す。', C('const model = defineModel<string>()\n\n<BaseInput v-model="model" />')], A('SearchBox.vue', '② ')),
          T('③ SearchBox.vue で、<BaseButton> に「検索」というラベルを書く（画面に「検索」ボタン）', 1,
            re(/<BaseButton\b[^>]*>\s*検索\s*<\/BaseButton>/, B) && $all(c, 'button').some((b) => /検索/.test(b.textContent)),
            ['ラベルは BaseButton の slot に書く。', C('<BaseButton>検索</BaseButton>')], A('SearchBox.vue', '③ ')),
          T("④ SearchBox.vue で、defineEmits に search を書き、BaseButton の @click で emit('search') する", 2,
            re(/defineEmits\s*<\s*\{\s*search\s*:\s*\[\s*\]\s*\}\s*>/, B) && re(/<BaseButton[^>]*@click\s*=\s*["']emit\(\s*['"]search['"]\s*\)["']/, B),
            ['molecule は検索そのものをしない。「検索が押された」と、上に知らせるだけ。', C("const emit = defineEmits<{ search: [] }>()\n\n<BaseButton @click=\"emit('search')\">検索</BaseButton>")], A('SearchBox.vue', '④ ')),
          T('⑤ LawyerSearchPage.vue で、<SearchBox> に v-model="keyword" を付ける（keyword の値を子に渡す）', 2,
            re(/<SearchBox[^>]*v-model\s*=\s*["']keyword["']/, P),
            ['値を持つのは親（page）。molecule とは v-model でつなぐ。', C('<SearchBox v-model="keyword" />')], A('App.vue', '⑤ ')),
          T('⑥ LawyerSearchPage.vue で、search 関数を作って searched に keyword を入れ、<SearchBox> の @search で呼ぶ', 3,
            re(/(function\s+search\b|const\s+search\s*=)/, P) && re(/searched\.value\s*=\s*keyword\.value/, P) && re(/<SearchBox[^>]*@search\s*=\s*["']search(\(\))?["']/, P),
            ['検索の中身（API を呼ぶなど）は page の仕事。', C('const search = (): void => {\n  searched.value = keyword.value\n}\n\n<SearchBox v-model="keyword" @search="search" />')], A('App.vue', '⑥ ')),
        ];
      },
      { height: 320, alias: { 'App.vue': 'LawyerSearchPage.vue' }, paths: { 'App.vue': 'pages/LawyerSearchPage.vue', 'SearchBox.vue': 'components/molecules/SearchBox.vue', 'BaseInput.vue': 'components/atoms/BaseInput.vue', 'BaseButton.vue': 'components/atoms/BaseButton.vue' },
        fileNotes: { 'App.vue': 'page：keyword を持ち、検索を実行する', 'SearchBox.vue': 'molecule：BaseInput + BaseButton の組み合わせ', 'BaseInput.vue': 'atom：入力欄（完成済み）', 'BaseButton.vue': 'atom：ボタン（完成済み）' } });
  }

  /* ============ 4. Organisms → Template → Page ============ */
  {
    const startPage = V(F(`
import { ref } from 'vue'
import type { Lawyer } from '@/types/lawyer'
import SearchPageTemplate from '@/components/templates/SearchPageTemplate.vue'
import LawyerList from '@/components/organisms/LawyerList.vue'

const lawyers = ref<Lawyer[]>([
  { id: 1, name: '山田 太郎', field: '労働問題' },
  { id: 2, name: '佐藤 花子', field: '相続' },
])
const booked = ref<number | null>(null)
`), F(`
  <!-- ⑤ SearchPageTemplate の <template #list> に LawyerList を置き、:lawyers を渡す -->
  <SearchPageTemplate />
  <p v-if="booked">相談する弁護士 ID：{{ booked }}</p>
`));
    const solPage = V(F(`
import { ref } from 'vue'
import type { Lawyer } from '@/types/lawyer'
import SearchPageTemplate from '@/components/templates/SearchPageTemplate.vue'
import LawyerList from '@/components/organisms/LawyerList.vue'

const lawyers = ref<Lawyer[]>([
  { id: 1, name: '山田 太郎', field: '労働問題' },
  { id: 2, name: '佐藤 花子', field: '相続' },
])
const booked = ref<number | null>(null)

const openBooking = (id: number): void => {
  booked.value = id
}
`), F(`
  <SearchPageTemplate>
    <template #list>
      <LawyerList :lawyers="lawyers" @consult="openBooking" />
    </template>
  </SearchPageTemplate>
  <p v-if="booked">相談する弁護士 ID：{{ booked }}</p>
`));
    const startTpl = V(null, F(`
  <!-- ③ 枠だけを作る。データは持たず、<slot name="list" /> を置く -->
  <div class="layout"></div>
`));
    const solTpl = V(null, F(`
  <div class="layout">
    <slot name="list" />
  </div>
`));
    const startList = V(F(`
import type { Lawyer } from '@/types/lawyer'
import LawyerCard from './LawyerCard.vue'
// ④ lawyers（Lawyer[]）を props で受け取り、v-for で LawyerCard を並べる（:lawyer で渡す）
// ⑥ LawyerCard の consult を、そのまま上（page）へ emit し直す（中継）
`), F(`
  <div class="list">
    <!-- ④ ここに LawyerCard -->
  </div>
`));
    const solList = V(F(`
import type { Lawyer } from '@/types/lawyer'
import LawyerCard from './LawyerCard.vue'

defineProps<{ lawyers: Lawyer[] }>()
const emit = defineEmits<{ consult: [id: number] }>()
`), F(`
  <div class="list">
    <LawyerCard v-for="l in lawyers" :key="l.id" :lawyer="l" @consult="emit('consult', $event)" />
  </div>
`));
    const startCard = V(F(`
import type { Lawyer } from '@/types/lawyer'
// ① 親から lawyer（Lawyer 型）を受け取り、名前を表示する
// ② 「相談する」を押したら、emit('consult', lawyer.id) で上に知らせる（defineEmits）
`), F(`
  <div class="card">
    <!-- ① 名前を表示する -->
    <button>相談する</button>
  </div>
`));
    const solCard = V(F(`
import type { Lawyer } from '@/types/lawyer'

defineProps<{ lawyer: Lawyer }>()
const emit = defineEmits<{ consult: [id: number] }>()
`), F(`
  <div class="card">
    <b>{{ lawyer.name }}</b>（{{ lawyer.field }}）
    <button @click="emit('consult', lawyer.id)">相談する</button>
  </div>
`));
    D[ID]['Organisms → Template → Page'] = multi({ 'App.vue': startPage, 'SearchPageTemplate.vue': startTpl, 'LawyerList.vue': startList, 'LawyerCard.vue': startCard, 'types.ts': LAWYER_TYPE },
      { 'App.vue': solPage, 'SearchPageTemplate.vue': solTpl, 'LawyerList.vue': solList, 'LawyerCard.vue': solCard, 'types.ts': LAWYER_TYPE },
      (v, c) => {
        const w = cleanAll(v), P = w['App.vue'], Tp = w['SearchPageTemplate.vue'], L = w['LawyerList.vue'], Cd = w['LawyerCard.vue'];
        return [
          T('① LawyerCard.vue で、defineProps<{ lawyer: Lawyer }>() を書き、{{ lawyer.name }} で名前を表示する', 1,
            re(/defineProps\s*<\s*\{\s*lawyer\s*:\s*Lawyer\s*\}\s*>/, Cd) && re(/\{\{\s*lawyer\.name\s*\}\}/, Cd),
            ['organism は、1 人ぶんの lawyer をまとめて受け取る。', C('defineProps<{ lawyer: Lawyer }>()\n\n<b>{{ lawyer.name }}</b>')], A('LawyerCard.vue', '① ')),
          T("② LawyerCard.vue で、defineEmits に consult（id: number）を書き、「相談する」の @click で emit('consult', lawyer.id) する", 1,
            re(/defineEmits\s*<\s*\{\s*consult\s*:\s*\[\s*id\s*:\s*number\s*\]\s*\}\s*>/, Cd) && re(/<button[^>]*@click\s*=\s*["']emit\(\s*['"]consult['"]\s*,\s*lawyer\.id\s*\)["']/, Cd),
            ['カードは相談の予約をしない。「押された」と上に知らせるだけ。', C("const emit = defineEmits<{ consult: [id: number] }>()\n\n<button @click=\"emit('consult', lawyer.id)\">相談する</button>")], A('LawyerCard.vue', '② ')),
          T('③ SearchPageTemplate.vue で、<slot name="list" /> を置く（データは持たない。枠だけ）', 1,
            re(/<slot\s+name\s*=\s*["']list["']\s*\/?>/, Tp) && !re(/defineProps|ref\s*\(|fetch/, Tp),
            ['template は場所を決めるだけ。中身は page から slot で入る。', C('<div class="layout">\n  <slot name="list" />\n</div>')], A('SearchPageTemplate.vue', '③ ')),
          T('④ LawyerList.vue で、lawyers（Lawyer[]）を props で受け取り、v-for で <LawyerCard> を並べる（:lawyer で渡す）', 2,
            re(/defineProps\s*<\s*\{\s*lawyers\s*:\s*Lawyer\[\]\s*\}\s*>/, L) && re(/<LawyerCard[^>]*v-for\s*=\s*["'][^"']*\bin\s+lawyers["']/, L) && re(/<LawyerCard[^>]*:lawyer\s*=\s*["']\w+["']/, L),
            ['一覧は、配列を受け取って 1 件ずつカードに渡す。', C('defineProps<{ lawyers: Lawyer[] }>()\n\n<LawyerCard v-for="l in lawyers" :key="l.id" :lawyer="l" />')], A('LawyerList.vue', '④ ')),
          T('⑤ LawyerSearchPage.vue で、<SearchPageTemplate> の <template #list> に <LawyerList :lawyers="lawyers" /> を置く（page が slot にデータを入れる）', 2,
            re(/<SearchPageTemplate[^>]*>[\s\S]*<template\s+#list>[\s\S]*<LawyerList[^>]*:lawyers\s*=\s*["']lawyers["'][\s\S]*<\/SearchPageTemplate>/, P) ,
            ['データ（lawyers）を持つ page が、template の slot に organism を入れる。', C('<SearchPageTemplate>\n  <template #list>\n    <LawyerList :lawyers="lawyers" />\n  </template>\n</SearchPageTemplate>')], A('App.vue', '⑤ ')),
          T("⑥ LawyerList.vue で consult を emit し直し、LawyerSearchPage.vue の @consult で booked に id を入れる（イベントが上へ流れる）", 3,
            re(/defineEmits\s*<\s*\{\s*consult\s*:\s*\[\s*id\s*:\s*number\s*\]\s*\}\s*>/, L) && re(/<LawyerCard[^>]*@consult\s*=\s*["'][^"']*emit\(\s*['"]consult['"]/, L) && re(/<LawyerList[^>]*@consult\s*=\s*["']openBooking["']/, P) && re(/booked\.value\s*=\s*id/, P),
            ['一覧は、カードのイベントを上へ中継する。受け取って実際に動くのは page。', C("const emit = defineEmits<{ consult: [id: number] }>()\n\n<LawyerCard … @consult=\"emit('consult', $event)\" />")], A('LawyerList.vue', '⑥ ')),
        ];
      },
      { height: 340, alias: { 'App.vue': 'LawyerSearchPage.vue' }, paths: { 'App.vue': 'pages/LawyerSearchPage.vue', 'SearchPageTemplate.vue': 'components/templates/SearchPageTemplate.vue', 'LawyerList.vue': 'components/organisms/LawyerList.vue', 'LawyerCard.vue': 'components/organisms/LawyerCard.vue', 'types.ts': 'types/lawyer.ts' },
        fileNotes: { 'App.vue': 'page：データ（lawyers）を持ち、イベントを受け取る', 'SearchPageTemplate.vue': 'template：レイアウトの枠だけ（slot）', 'LawyerList.vue': 'organism：カードの一覧', 'LawyerCard.vue': 'organism：弁護士 1 人ぶんのカード', 'types.ts': '型：Lawyer' } });
  }

  /* ============ 5. どこに置く？ 仕分け（text） ============ */
  {
    const start = F(`
# ⑥ 10 個の部品を、1 回ずつ、正しいフォルダに書く
# 書き方は「フォルダ: 部品名, 部品名」。1 行に 1 フォルダ。
#   StatusBadge ・ DateInput ・ SearchBox ・ Pagination ・ LawyerCard
#   LawyerList ・ AppHeader ・ ConsultModal ・ TwoColumnLayout ・ ConsultBookingPage

# ① 最小の部品（これ以上分けない）
atoms:

# ② atoms の組み合わせ
molecules:

# ③ ④ 画面のまとまり
organisms:

# ⑤ レイアウトの骨組み、本物の画面
templates:
pages:
`);
    const sol = 'atoms: StatusBadge, DateInput\nmolecules: SearchBox, Pagination\norganisms: LawyerCard, LawyerList, AppHeader, ConsultModal\ntemplates: TwoColumnLayout\npages: ConsultBookingPage';
    const parse = (s) => {
      const m = {};
      lines(s).forEach((l) => { const x = /^(atoms|molecules|organisms|templates|pages)\s*[:：]\s*(.*)$/.exec(l); if (x) m[x[1]] = (m[x[1]] || []).concat(x[2].split(/[,、，]/).map((t) => t.trim()).filter(Boolean)); });
      return m;
    };
    const ALL = { atoms: ['StatusBadge', 'DateInput'], molecules: ['SearchBox', 'Pagination'], organisms: ['LawyerCard', 'LawyerList', 'AppHeader', 'ConsultModal'], templates: ['TwoColumnLayout'], pages: ['ConsultBookingPage'] };
    const has = (m, k, names) => names.every((n) => (m[k] || []).includes(n));
    D[ID]['どこに置く？ 仕分け'] = text('folders.md', 'text', start,
      '<b>やること</b><br>部品を、置く場所（フォルダ）ごとに書き分ける。<br>迷うものは、この練習では<b>下の答え</b>に合わせる（現場では<b>チームで決める</b>）。',
      sol,
      (v) => {
        const m = parse(v['folders.md']);
        const flat = [].concat(...Object.values(m));
        const exact = Object.keys(ALL).every((k) => has(m, k, ALL[k]) && (m[k] || []).length === ALL[k].length) && flat.length === 10 && new Set(flat).size === 10;
        return [
          T('folders.md で、atoms: の行に StatusBadge を書く（色と文字だけの最小の部品）', 1, has(m, 'atoms', ['StatusBadge']), ['これ以上分けない、最小の部品は atoms。', C('atoms: StatusBadge', 'text')], A('folders.md', '① ')),
          T('folders.md で、molecules: の行に SearchBox を書く（入力欄 + ボタンの組み合わせ）', 1, has(m, 'molecules', ['SearchBox']), ['atoms を組み合わせた、1 つの役目の部品は molecules。', C('molecules: SearchBox', 'text')], A('folders.md', '② ')),
          T('folders.md で、organisms: の行に LawyerCard と LawyerList を書く（画面のまとまり）', 1, has(m, 'organisms', ['LawyerCard', 'LawyerList']), ['カードや一覧のような、画面の「まとまり」は organisms。', C('organisms: LawyerCard, LawyerList', 'text')], A('folders.md', '③ ')),
          T('folders.md で、organisms: の行に AppHeader と ConsultModal も書き足す（ヘッダーとモーダルも画面のまとまり）', 2, has(m, 'organisms', ['LawyerCard', 'LawyerList', 'AppHeader', 'ConsultModal']), ['ヘッダー（ロゴ + メニュー）やモーダル（入力欄 + ボタン）も、まとまりなので organisms。', C('organisms: LawyerCard, LawyerList, AppHeader, ConsultModal', 'text')], A('folders.md', '④ ')),
          T('folders.md で、templates: に TwoColumnLayout、pages: に ConsultBookingPage を書く（枠だけ・本物の画面）', 2, has(m, 'templates', ['TwoColumnLayout']) && has(m, 'pages', ['ConsultBookingPage']), ['データの無い枠は templates。データを持つ本物の画面は pages。', C('templates: TwoColumnLayout\npages: ConsultBookingPage', 'text')], A('folders.md', '⑤ ')),
          T('folders.md で、10 個の部品を、1 回ずつ、正しいフォルダに書き分ける（DateInput は atoms、Pagination は molecules）', 3, exact, ['DateInput は入力欄 1 つなので atoms。Pagination は、ボタンを並べた組み合わせなので molecules。', C(sol, 'text')], A('folders.md', '⑥ ')),
        ];
      });
  }
})();
