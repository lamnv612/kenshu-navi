/* Vue 基礎（イベント処理 〜 ミニTodo）の練習。.vue ファイル（型つき・親子に分割）で出す。
   各ミッションの at.find は、スターター内の ①②③… のコメントに合わせている（UI がその行を光らせる）。 */
(function () {
  const K = window.KENSHU;
  const D = K.drills;
  const { multi, T, appText, $q, $all } = K.vueDrillTools;
  D['vue-basics'] = D['vue-basics'] || {};

  /* コメントを除いた本文（TODO コメントだけで「できた」と判定されないように） */
  const nc = (s) => String(s || '').replace(/<!--[\s\S]*?-->/g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const C = (code, lang) => ({ code, lang: lang || 'vue' });
  const at = (file, find) => ({ file, find });
  const A = 'App.vue';
  const set = (title, files, sol, tasks, alias, paths, notes) => {
    D['vue-basics'][title] = multi(files, sol, tasks, { height: 320, alias: { [A]: alias }, paths, fileNotes: notes });
  };

  /* ============================================================
     イベント処理 @click ― 相談枠の予約ボタン
     ============================================================ */
  const RB = 'ReserveButtons.vue';
  set('イベント処理 @click', {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'
import SlotNotice from './SlotNotice.vue'
import ConfirmButton from './ConfirmButton.vue'

const slots = ref<number>(10)

// ② reserve(n: number): void を作り、n 枠ぶん slots.value を減らす

// ③ reset(): void を作り、slots.value を 10 に戻す

// ④ reserve を直す: 0 枠より下には減らさない（Math.max(0, …)）
</script>

<template>
  <section class="reserve">
    <h2>法律相談の予約枠</h2>
    <p>残り枠: {{ slots }}</p>
    <!-- ⑤ 子に :slots="slots" を渡す（子の props は SlotNotice.vue 側で受ける） -->
    <SlotNotice />
    <div class="actions">
      <!-- ① @click で slots を 1 減らす -->
      <button>1枠予約</button>
      <!-- ② @click="reserve(3)" -->
      <button>3枠まとめて予約</button>
      <!-- ③ @click で reset を呼ぶ -->
      <button>リセット</button>
      <!-- ⑥ 子が送る confirm を @confirm="reserve" で受ける -->
      <ConfirmButton :count="2" />
    </div>
  </section>
</template>

<style scoped>
.actions { display: flex; gap: 8px; }
</style>
`,
    'SlotNotice.vue': `<script setup lang="ts">
// ⑤ 親から slots（number）を受け取る: defineProps<{ slots: number }>()
</script>

<template>
  <!-- ⑤ 残り 3 枠以下のときだけ見せる（v-if） -->
  <p class="notice">残りわずかです。お早めにご予約ください。</p>
</template>

<style scoped>
.notice { color: #d33; font-weight: bold; }
</style>
`,
    'ConfirmButton.vue': `<script setup lang="ts">
const props = defineProps<{ count: number }>()

// ⑥ defineEmits<{ (e: 'confirm', count: number): void }>() で emit を作る
// ⑥ onConfirm() の中で emit('confirm', props.count) を呼ぶ
</script>

<template>
  <!-- ⑥ ボタンの @click で onConfirm を呼ぶ -->
  <button class="confirm">{{ count }}枠を確定</button>
</template>
`,
  }, {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'
import SlotNotice from './SlotNotice.vue'
import ConfirmButton from './ConfirmButton.vue'

const slots = ref<number>(10)

function reserve(n: number): void {
  slots.value = Math.max(0, slots.value - n)
}

function reset(): void {
  slots.value = 10
}
</script>

<template>
  <section class="reserve">
    <h2>法律相談の予約枠</h2>
    <p>残り枠: {{ slots }}</p>
    <SlotNotice :slots="slots" />
    <div class="actions">
      <button @click="slots--">1枠予約</button>
      <button @click="reserve(3)">3枠まとめて予約</button>
      <button @click="reset">リセット</button>
      <ConfirmButton :count="2" @confirm="reserve" />
    </div>
  </section>
</template>

<style scoped>
.actions { display: flex; gap: 8px; }
</style>
`,
    'SlotNotice.vue': `<script setup lang="ts">
defineProps<{ slots: number }>()
</script>

<template>
  <p v-if="slots <= 3" class="notice">残りわずかです。お早めにご予約ください。</p>
</template>

<style scoped>
.notice { color: #d33; font-weight: bold; }
</style>
`,
    'ConfirmButton.vue': `<script setup lang="ts">
const props = defineProps<{ count: number }>()

const emit = defineEmits<{ (e: 'confirm', count: number): void }>()

function onConfirm(): void {
  emit('confirm', props.count)
}
</script>

<template>
  <button class="confirm" @click="onConfirm">{{ count }}枠を確定</button>
</template>
`,
  }, (v, c) => {
    const p = nc(v[A]), s = nc(v['SlotNotice.vue']), k = nc(v['ConfirmButton.vue']);
    const rsv = (p.match(/function\s+reserve\s*\([^)]*\)[^{]*\{([\s\S]*?)\n\}/) || p.match(/const\s+reserve\s*=\s*\([^)]*\)[^=]*=>\s*\{?([\s\S]*?)\n\}?/) || [])[1] || '';
    return [
      T('「1枠予約」ボタンを @click で動かし、slots を 1 減らす', 1, /<button[^>]*@click\s*=\s*"[^"]*(slots\s*--|slots\s*-=\s*1|slots\s*=\s*slots\s*-\s*1|reserve\(\s*1\s*\))[^"]*"[^>]*>\s*1枠予約/.test(p), ['ボタンに @click を付けて、その場で slots を減らす。', C('<button @click="slots--">1枠予約</button>')], at(A, ['<!-- ① '])),
      T('reserve(n: number): void を作り、「3枠まとめて」から reserve(3) で呼ぶ', 1, /(function\s+reserve\s*\(\s*n\s*:\s*number\s*\)\s*:\s*void|const\s+reserve\s*=\s*\(\s*n\s*:\s*number\s*\)\s*:\s*void\s*=>)/.test(p) && /slots\.value\s*(-=|=)/.test(rsv) && /<button[^>]*@click\s*=\s*"reserve\(\s*3\s*\)"[^>]*>\s*3枠/.test(p), ['引数の n に number 型を付ける。script の中では slots.value。', C("function reserve(n: number): void {\n  slots.value -= n\n}\n\n<button @click=\"reserve(3)\">3枠まとめて予約</button>")], at(A, ['// ② ', '<!-- ② '])),
      T('「リセット」ボタンで reset() を呼び、slots を 10 に戻す', 1, /function\s+reset\s*\(\s*\)|const\s+reset\s*=/.test(p) && /slots\.value\s*=\s*10/.test(p) && /<button[^>]*@click\s*=\s*"reset(\(\))?"[^>]*>\s*リセット/.test(p), ['関数を作って、@click に関数名を渡す（括弧は付けても付けなくてもよい）。', C('function reset(): void {\n  slots.value = 10\n}\n\n<button @click="reset">リセット</button>')], at(A, ['// ③ ', '<!-- ③ '])),
      T('reserve を直し、0 枠より下には減らない（Math.max など）ようにする', 2, /Math\.max\s*\(|if\s*\([^)]*slots\.value/.test(rsv), ['引き算の結果が 0 より小さくならないようにする。', C('slots.value = Math.max(0, slots.value - n)', 'ts')], at(A, ['// ④ '])),
      T('SlotNotice に slots を props（defineProps<{ slots: number }>()）で渡し、残り 3 枠以下のときだけ「残りわずか」を出す', 2, /defineProps\s*<\s*\{\s*slots\s*:\s*number\s*\}\s*>\s*\(\s*\)/.test(s) && /v-if\s*=\s*"[^"]*slots[^"]*"/.test(s) && /<SlotNotice[^>]*:slots\s*=\s*"slots"/.test(p) && !appText(c).includes('残りわずか'), ['親: <SlotNotice :slots="slots" />、子: defineProps で受けて v-if で出し分ける。', C('// SlotNotice.vue\ndefineProps<{ slots: number }>()\n\n<p v-if="slots <= 3" class="notice">…</p>')], at('SlotNotice.vue', ['// ⑤ ', '<!-- ⑤ '])),
      T('ConfirmButton が defineEmits で confirm（枠数）を親へ送り、親が @confirm="reserve" で受ける', 3, /defineEmits\s*<[\s\S]*['"]confirm['"][\s\S]*number[\s\S]*>\s*\(\s*\)/.test(k) && /emit\(\s*['"]confirm['"]\s*,[^)]+\)/.test(k) && /<button[^>]*@click\s*=/.test(k) && /<ConfirmButton[^>]*@confirm\s*=\s*"reserve"/.test(p), ['子は「何が起きたか」を emit で伝えるだけ。減らす処理は親の reserve が持つ。', C("// ConfirmButton.vue\nconst emit = defineEmits<{ (e: 'confirm', count: number): void }>()\nfunction onConfirm(): void {\n  emit('confirm', props.count)\n}\n\n// 親\n<ConfirmButton :count=\"2\" @confirm=\"reserve\" />")], at('ConfirmButton.vue', ['// ⑥ ', '<!-- ⑥ '])),
    ];
  }, RB, { [A]: 'src/pages/ReserveButtons.vue', 'SlotNotice.vue': 'src/components/SlotNotice.vue', 'ConfirmButton.vue': 'src/components/ConfirmButton.vue' },
  { [A]: '予約ページ（親）', 'SlotNotice.vue': '残り枠の注意（子・props）', 'ConfirmButton.vue': '確定ボタン（子・emit）' });

  /* ============================================================
     イベントの種類 ― 相談フォーム
     ============================================================ */
  set('イベントの種類', {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'
import SubmitLog from './SubmitLog.vue'

const subject = ref<string>('')
const category = ref<string>('労働問題')
const history = ref<string[]>([])

// ① 入力のたびに subject を更新する関数 onInput(e: Event): void
//    （e.target as HTMLInputElement).value を subject.value に入れる）

// ② 種別が変わったときの関数 onChange(e: Event): void（category.value を更新）

// ③ send(): void を作り、history に「種別：件名」を追加して、subject を空にする
</script>

<template>
  <div class="page">
    <h2>相談フォーム</h2>
    <!-- ③ <form> に @submit.prevent="send" を付ける（ページを再読込させない） -->
    <form>
      <!-- ① @input="onInput" -->
      <input :value="subject" placeholder="件名" />
      <!-- ② @change="onChange" -->
      <select :value="category">
        <option>労働問題</option>
        <option>離婚・男女問題</option>
        <option>相続</option>
      </select>
      <button type="submit">送信</button>
    </form>
    <p>入力中: {{ category }}／{{ subject }}</p>
    <!-- ④ Esc キーで件名を消す: @keydown.esc="subject = ''" を input に足す（上の input に書く） -->
    <!-- ⑤ 履歴を子に渡す: :items="history"（子は props で受ける） -->
    <SubmitLog />
  </div>
</template>
`,
    'SubmitLog.vue': `<script setup lang="ts">
// ⑤ 親から items（string[]）を受け取る: defineProps<{ items: string[] }>()

// ⑥ defineEmits<{ (e: 'cancel', index: number): void }>() を作る
</script>

<template>
  <ul class="log">
    <!-- ⑤ v-for で items を並べる（:key も） -->
    <li>（送信履歴）</li>
    <!-- ⑥ 各行に「取消」ボタン。@click で emit('cancel', i) -->
  </ul>
</template>
`,
  }, {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'
import SubmitLog from './SubmitLog.vue'

const subject = ref<string>('')
const category = ref<string>('労働問題')
const history = ref<string[]>([])

function onInput(e: Event): void {
  subject.value = (e.target as HTMLInputElement).value
}

function onChange(e: Event): void {
  category.value = (e.target as HTMLSelectElement).value
}

function send(): void {
  if (!subject.value) return
  history.value.push(category.value + '：' + subject.value)
  subject.value = ''
}

function cancel(index: number): void {
  history.value.splice(index, 1)
}
</script>

<template>
  <div class="page">
    <h2>相談フォーム</h2>
    <form @submit.prevent="send">
      <input :value="subject" placeholder="件名" @input="onInput" @keydown.esc="subject = ''" />
      <select :value="category" @change="onChange">
        <option>労働問題</option>
        <option>離婚・男女問題</option>
        <option>相続</option>
      </select>
      <button type="submit">送信</button>
    </form>
    <p>入力中: {{ category }}／{{ subject }}</p>
    <SubmitLog :items="history" @cancel="cancel" />
  </div>
</template>
`,
    'SubmitLog.vue': `<script setup lang="ts">
defineProps<{ items: string[] }>()

const emit = defineEmits<{ (e: 'cancel', index: number): void }>()
</script>

<template>
  <ul class="log">
    <li v-for="(item, i) in items" :key="i">
      {{ item }}
      <button @click="emit('cancel', i)">取消</button>
    </li>
  </ul>
</template>
`,
  }, (v) => {
    const p = nc(v[A]), s = nc(v['SubmitLog.vue']);
    return [
      T('件名の input に @input を付け、入力のたびに subject を更新する（onInput(e: Event)）', 1, /<input[^>]*@input\s*=\s*"onInput"/.test(p) && /onInput\s*\(\s*e\s*:\s*Event\s*\)/.test(p) && /e\.target\s+as\s+HTMLInputElement/.test(p) && /subject\.value\s*=/.test(p), ['イベントオブジェクト e の e.target が入力欄。型は HTMLInputElement と教える。', C('function onInput(e: Event): void {\n  subject.value = (e.target as HTMLInputElement).value\n}', 'ts')], at(A, ['// ① ', '<!-- ① '])),
      T('種別の select に @change を付け、選んだ値を category に入れる', 1, /<select[^>]*@change\s*=\s*"onChange"/.test(p) && /onChange\s*\(\s*e\s*:\s*Event\s*\)/.test(p) && /category\.value\s*=\s*\(?\s*e\.target\s+as\s+HTMLSelectElement/.test(p), ['select は change イベント。型は HTMLSelectElement。', C('category.value = (e.target as HTMLSelectElement).value', 'ts')], at(A, ['// ② ', '<!-- ② '])),
      T('<form> に @submit.prevent="send" を付け、send() で history に追加して subject を空にする', 1, /<form[^>]*@submit\.prevent\s*=\s*"send"/.test(p) && /history\.value\.push\(/.test(p) && /subject\.value\s*=\s*['"]{2}/.test(p), ['.prevent を付けると、ページの再読込（フォーム本来の動き）を止められる。', C("function send(): void {\n  history.value.push(category.value + '：' + subject.value)\n  subject.value = ''\n}", 'ts')], at(A, ['// ③ ', '<!-- ③ '])),
      T('input に @keydown.esc を付け、Esc キーで件名を空にする', 2, /<input[^>]*@keydown\.esc\s*=\s*"[^"]*(subject\s*=\s*(''|"")|\w+)[^"]*"/.test(p), ['.esc のようなキー修飾子で、特定のキーだけに反応できる。', C(`<input ... @keydown.esc="subject = ''" />`)], at(A, ['<!-- ④ '])),
      T('履歴を SubmitLog に props（items: string[]）で渡し、v-for で並べる', 2, /defineProps\s*<\s*\{\s*items\s*:\s*string\[\]\s*\}\s*>/.test(s) && /<li[^>]*v-for\s*=[^>]*:key\s*=|<li[^>]*:key\s*=[^>]*v-for\s*=/.test(s) && /<SubmitLog[^>]*:items\s*=\s*"history"/.test(p), ['親: <SubmitLog :items="history" />、子: defineProps で受けて v-for。', C('<li v-for="(item, i) in items" :key="i">{{ item }}</li>')], at('SubmitLog.vue', ['// ⑤ ', '<!-- ⑤ '])),
      T('各行の「取消」ボタンで emit(\'cancel\', i) し、親が cancel(index) で履歴から消す', 3, /defineEmits\s*<[\s\S]*['"]cancel['"][\s\S]*number/.test(s) && /<button[^>]*@click\s*=\s*"[^"]*emit\(\s*['"]cancel['"]\s*,\s*\w+\s*\)/.test(s) && /<SubmitLog[^>]*@cancel\s*=\s*"cancel"/.test(p) && /function\s+cancel\s*\(\s*index\s*:\s*number\s*\)[^{]*\{[\s\S]*splice\(/.test(p), ['子は番号を emit するだけ。消すのは配列を持つ親（splice）。', C("// 子\n<button @click=\"emit('cancel', i)\">取消</button>\n\n// 親\nfunction cancel(index: number): void {\n  history.value.splice(index, 1)\n}")], at('SubmitLog.vue', ['// ⑥ ', '<!-- ⑥ '])),
    ];
  }, 'InquiryForm.vue', { [A]: 'src/pages/InquiryForm.vue', 'SubmitLog.vue': 'src/components/SubmitLog.vue' },
  { [A]: '相談フォーム（親）', 'SubmitLog.vue': '送信履歴（子）' });

  /* ============================================================
     v-if と v-show ― 管理画面（権限と料金タブ）
     ============================================================ */
  set('v-if と v-show', {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'
import PriceTab from './PriceTab.vue'

type Role = 'admin' | 'staff' | 'guest'

interface Plan {
  id: number
  name: string
  fee: number
  memo: string
}

const role = ref<Role>('staff')
const showPrice = ref<boolean>(false)
const plans = ref<Plan[]>([
  { id: 1, name: '初回相談（30分）', fee: 0, memo: '集客用' },
  { id: 2, name: '継続相談（60分）', fee: 11000, memo: '標準' },
  { id: 3, name: '書面作成', fee: 33000, memo: '要見積' },
])
</script>

<template>
  <div class="admin">
    <h2>事務所の管理画面</h2>
    <label>
      権限:
      <select v-model="role">
        <option value="admin">admin</option>
        <option value="staff">staff</option>
        <option value="guest">guest</option>
      </select>
    </label>

    <!-- ① admin のときだけ「管理メニュー」を出す（v-if="role === 'admin'"） -->
    <p>管理メニュー（ユーザー管理・売上）</p>
    <!-- ② staff なら「スタッフメニュー」、それ以外は「ゲストは閲覧のみ」（v-else-if / v-else） -->

    <!-- ④ ボタンで showPrice を切り替える。文字は「料金表を見る／隠す」で変える -->
    <button>料金表を見る</button>

    <!-- ③ 切替の多いタブは v-show（DOM は残して display だけ変える） -->
    <div class="tab">
      <!-- ⑤ ⑥ は PriceTab.vue 側。:plans と :is-admin を渡す -->
      <PriceTab />
    </div>
  </div>
</template>
`,
    'PriceTab.vue': `<script setup lang="ts">
// ⑤ 親から plans を受け取る: defineProps<{ plans: Plan[] }>()（Plan の interface もここに書く）
// ⑥ isAdmin: boolean も受け取る
</script>

<template>
  <section>
    <h3>料金表</h3>
    <table>
      <thead>
        <tr>
          <th>プラン</th>
          <th>料金</th>
          <!-- ⑥ 「内部メモ」列は管理者だけ（v-if="isAdmin"） -->
          <th>内部メモ</th>
        </tr>
      </thead>
      <tbody>
        <!-- ⑤ v-for で plans を並べる（:key も）。料金は {{ p.fee }} 円 -->
        <tr>
          <td>（プラン）</td>
          <td>0 円</td>
          <td>（メモ）</td>
        </tr>
      </tbody>
    </table>
    <!-- ⑥ plans が空のときは、表の代わりに「プランは未登録です」を出す（v-if / v-else） -->
  </section>
</template>
`,
  }, {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'
import PriceTab from './PriceTab.vue'

type Role = 'admin' | 'staff' | 'guest'

interface Plan {
  id: number
  name: string
  fee: number
  memo: string
}

const role = ref<Role>('staff')
const showPrice = ref<boolean>(false)
const plans = ref<Plan[]>([
  { id: 1, name: '初回相談（30分）', fee: 0, memo: '集客用' },
  { id: 2, name: '継続相談（60分）', fee: 11000, memo: '標準' },
  { id: 3, name: '書面作成', fee: 33000, memo: '要見積' },
])
</script>

<template>
  <div class="admin">
    <h2>事務所の管理画面</h2>
    <label>
      権限:
      <select v-model="role">
        <option value="admin">admin</option>
        <option value="staff">staff</option>
        <option value="guest">guest</option>
      </select>
    </label>

    <p v-if="role === 'admin'">管理メニュー（ユーザー管理・売上）</p>
    <p v-else-if="role === 'staff'">スタッフメニュー（相談の受付）</p>
    <p v-else>ゲストは閲覧のみです</p>

    <button @click="showPrice = !showPrice">{{ showPrice ? '料金表を隠す' : '料金表を見る' }}</button>

    <div v-show="showPrice" class="tab">
      <PriceTab :plans="plans" :is-admin="role === 'admin'" />
    </div>
  </div>
</template>
`,
    'PriceTab.vue': `<script setup lang="ts">
interface Plan {
  id: number
  name: string
  fee: number
  memo: string
}

defineProps<{ plans: Plan[]; isAdmin: boolean }>()
</script>

<template>
  <section>
    <h3>料金表</h3>
    <table v-if="plans.length > 0">
      <thead>
        <tr>
          <th>プラン</th>
          <th>料金</th>
          <th v-if="isAdmin">内部メモ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in plans" :key="p.id">
          <td>{{ p.name }}</td>
          <td>{{ p.fee }} 円</td>
          <td v-if="isAdmin">{{ p.memo }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>プランは未登録です</p>
  </section>
</template>
`,
  }, (v, c) => {
    const p = nc(v[A]), s = nc(v['PriceTab.vue']);
    const txt = appText(c);
    const pr = $all(c, '#app div').find((d) => /(^|\s)tab(\s|$)/.test(d.className));
    const rows = $all(c, '#app tbody tr').length;
    return [
      T('「管理メニュー」に v-if="role === \'admin\'" を付ける（staff のときは DOM から消える）', 1, /<p[^>]*v-if\s*=\s*"role\s*===?\s*['']admin['']"[^>]*>\s*管理メニュー/.test(p) && !txt.includes('管理メニュー'), ['v-if が false だと、要素そのものが DOM から消える。', C(`<p v-if="role === 'admin'">管理メニュー（ユーザー管理・売上）</p>`)], at(A, ['<!-- ① '])),
      T('v-else-if / v-else で、staff は「スタッフメニュー」、それ以外は「ゲストは閲覧のみ」を出す', 1, /v-else-if\s*=\s*"role\s*===?\s*['']staff['']"/.test(p) && /<p[^>]*v-else[\s>]/.test(p) && txt.includes('スタッフメニュー') && !txt.includes('ゲストは閲覧のみ'), ['v-if の直後の要素に v-else-if、その次に v-else（間に別の要素を挟まない）。', C(`<p v-else-if="role === 'staff'">スタッフメニュー</p>\n<p v-else>ゲストは閲覧のみです</p>`)], at(A, ['<!-- ② '])),
      T('料金タブの div に v-show="showPrice" を付ける（最初は隠れ、DOM には残る）', 1, /<div[^>]*v-show\s*=\s*"showPrice"[^>]*class\s*=\s*"tab"|<div[^>]*class\s*=\s*"tab"[^>]*v-show\s*=\s*"showPrice"/.test(p) && !!pr && pr.ownerDocument.defaultView.getComputedStyle(pr).display === 'none', ['v-show は display: none を切り替えるだけ。何度も開閉するタブ向き。', C('<div v-show="showPrice" class="tab">')], at(A, ['<!-- ③ '])),
      T('ボタンの @click で showPrice を反転し、文字も「料金表を見る／隠す」で変える', 2, /<button[^>]*@click\s*=\s*"[^"]*showPrice\s*=\s*!\s*showPrice[^"]*"[^>]*>[\s\S]*?\{\{\s*showPrice\s*\?[^}]*\}\}/.test(p), ['反転は showPrice = !showPrice。文字は三項演算子。', C(`<button @click="showPrice = !showPrice">\n  {{ showPrice ? '料金表を隠す' : '料金表を見る' }}\n</button>`)], at(A, ['<!-- ④ '])),
      T('PriceTab が plans を props（Plan[]）で受け取り、v-for で3行を並べる', 2, /defineProps\s*<\s*\{[^}]*plans\s*:\s*Plan\[\][^}]*\}\s*>/.test(s) && /<tr[^>]*v-for\s*=[^>]*:key|<tr[^>]*:key[^>]*v-for/.test(s) && /<PriceTab[^>]*:plans\s*=\s*"plans"/.test(p) && rows === 3, ['親: <PriceTab :plans="plans" />、子: defineProps で受けて <tr v-for>。', C('defineProps<{ plans: Plan[]; isAdmin: boolean }>()\n\n<tr v-for="p in plans" :key="p.id">…</tr>')], at('PriceTab.vue', ['// ⑤ ', '<!-- ⑤ '])),
      T('isAdmin（boolean）を渡し「内部メモ」列を管理者だけに。plans が空なら v-else で「未登録です」', 3, /isAdmin\s*:\s*boolean/.test(s) && (s.match(/v-if\s*=\s*"isAdmin"/g) || []).length >= 2 && /v-if\s*=\s*"plans\.length[^"]*"/.test(s) && /v-else[\s>][^<]*>?[^<]*プランは未登録/.test(s.replace(/\n/g, ' ')) && /<PriceTab[^>]*:(is-admin|isAdmin)\s*=\s*"role\s*===?\s*['']admin['']"/.test(p) && !txt.includes('内部メモ'), ['列見出し(th)とセル(td)の両方に v-if="isAdmin"。親は :is-admin="role === \'admin\'" を渡す。', C(`<th v-if="isAdmin">内部メモ</th>\n<td v-if="isAdmin">{{ p.memo }}</td>\n\n<table v-if="plans.length > 0">…</table>\n<p v-else>プランは未登録です</p>`)], at('PriceTab.vue', ['// ⑥ ', '<!-- ⑥ '])),
    ];
  }, 'AdminDashboard.vue', { [A]: 'src/pages/AdminDashboard.vue', 'PriceTab.vue': 'src/components/PriceTab.vue' },
  { [A]: '管理画面（親）', 'PriceTab.vue': '料金表タブ（子）' });

  /* ============================================================
     :class と v-for ― 案件一覧
     ============================================================ */
  const CASE_TYPES = `export type Status = 'open' | 'doing' | 'done'

export interface Case {
  id: number
  title: string
  status: Status
  urgent: boolean
}
`;
  set(':class と v-for', {
    [A]: `<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Case, Status } from './types'
import CaseRow from './CaseRow.vue'

type Filter = 'all' | Status

const cases = ref<Case[]>([
  { id: 1, title: '離婚の財産分与', status: 'open', urgent: true },
  { id: 2, title: '未払い残業代の請求', status: 'doing', urgent: false },
  { id: 3, title: '相続の遺産分割', status: 'doing', urgent: true },
  { id: 4, title: '賃貸の原状回復', status: 'done', urgent: false },
])
const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'open', label: '未対応' },
  { value: 'doing', label: '対応中' },
  { value: 'done', label: '完了' },
]
const filter = ref<Filter>('all')

// ⑥ filter に合う案件だけを返す computed を作る: visible
//    （'all' のときは全部。それ以外は status が一致するもの）
</script>

<template>
  <div class="page">
    <h2>案件一覧</h2>

    <div class="filters">
      <!-- ⑤ filters を v-for で並べ、選択中のボタンに on クラス（:class）。@click で filter を変える -->
      <button>すべて</button>
    </div>

    <ul class="list">
      <!-- ① CaseRow を v-for + :key で並べる（:item="c" を渡す）。⑥ で cases → visible に変える -->
    </ul>
    <p v-if="false">該当する案件はありません</p>
  </div>
</template>

<style scoped>
.filters { display: flex; gap: 6px; margin-bottom: 8px; }
.filters .on { background: #2a6df4; color: #fff; }
</style>
`,
    'CaseRow.vue': `<script setup lang="ts">
import type { Case } from './types'

// ② 親から item（Case 型）を受け取る: defineProps<{ item: Case }>()
</script>

<template>
  <!-- ③ 緊急（urgent）の行に urgent クラスを付ける（:class="{ urgent: … }"） -->
  <li class="case-row">
    <!-- ② ここに item.title を表示 -->
    <span></span>
    <!-- ④ バッジは class を配列で: :class="['badge', item.status]" -->
    <span>状態</span>
  </li>
</template>

<style scoped>
.case-row { display: flex; gap: 8px; padding: 6px; border-bottom: 1px solid #ddd; }
.urgent { border-left: 4px solid #d33; }
.badge { padding: 0 8px; border-radius: 99px; background: #aab; color: #fff; }
.badge.doing { background: #e90; }
.badge.done { background: #2a7; }
</style>
`,
    'types.ts': CASE_TYPES,
  }, {
    [A]: `<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Case, Status } from './types'
import CaseRow from './CaseRow.vue'

type Filter = 'all' | Status

const cases = ref<Case[]>([
  { id: 1, title: '離婚の財産分与', status: 'open', urgent: true },
  { id: 2, title: '未払い残業代の請求', status: 'doing', urgent: false },
  { id: 3, title: '相続の遺産分割', status: 'doing', urgent: true },
  { id: 4, title: '賃貸の原状回復', status: 'done', urgent: false },
])
const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'open', label: '未対応' },
  { value: 'doing', label: '対応中' },
  { value: 'done', label: '完了' },
]
const filter = ref<Filter>('all')

const visible = computed<Case[]>(() =>
  filter.value === 'all' ? cases.value : cases.value.filter((c) => c.status === filter.value),
)
</script>

<template>
  <div class="page">
    <h2>案件一覧</h2>

    <div class="filters">
      <button
        v-for="f in filters"
        :key="f.value"
        :class="{ on: filter === f.value }"
        @click="filter = f.value"
      >
        {{ f.label }}
      </button>
    </div>

    <ul class="list">
      <CaseRow v-for="c in visible" :key="c.id" :item="c" />
    </ul>
    <p v-if="visible.length === 0">該当する案件はありません</p>
  </div>
</template>

<style scoped>
.filters { display: flex; gap: 6px; margin-bottom: 8px; }
.filters .on { background: #2a6df4; color: #fff; }
</style>
`,
    'CaseRow.vue': `<script setup lang="ts">
import type { Case } from './types'

defineProps<{ item: Case }>()
</script>

<template>
  <li class="case-row" :class="{ urgent: item.urgent }">
    <span>{{ item.title }}</span>
    <span :class="['badge', item.status]">状態</span>
  </li>
</template>

<style scoped>
.case-row { display: flex; gap: 8px; padding: 6px; border-bottom: 1px solid #ddd; }
.urgent { border-left: 4px solid #d33; }
.badge { padding: 0 8px; border-radius: 99px; background: #aab; color: #fff; }
.badge.doing { background: #e90; }
.badge.done { background: #2a7; }
</style>
`,
    'types.ts': CASE_TYPES,
  }, (v, c) => {
    const p = nc(v[A]), r = nc(v['CaseRow.vue']);
    const rows = $all(c, '#app .case-row');
    return [
      T('親で CaseRow を v-for と :key（案件の id）で並べる（4 行出る）', 1, /<CaseRow[^>]*v-for\s*=\s*"\s*\w+\s+in\s+(cases|visible)\s*"[^>]*:key\s*=\s*"\s*\w+\.id\s*"|<CaseRow[^>]*:key\s*=\s*"\s*\w+\.id\s*"[^>]*v-for\s*=\s*"\s*\w+\s+in\s+(cases|visible)\s*"/.test(p) && rows.length === 4, ['v-for には必ず :key。中身が入れ替わっても行を見失わないための目印。', C('<CaseRow v-for="c in cases" :key="c.id" :item="c" />')], at(A, ['<!-- ① '])),
      T('CaseRow が item を props（Case 型）で受け取り、案件名を表示する', 1, /defineProps\s*<\s*\{\s*item\s*:\s*Case\s*\}\s*>\s*\(\s*\)/.test(r) && /\{\{\s*item\.title\s*\}\}/.test(r) && /離婚の財産分与/.test(appText(c)), ['interface の Case をそのまま props の型に使える。', C('defineProps<{ item: Case }>()\n\n<span>{{ item.title }}</span>')], at('CaseRow.vue', ['// ② ', '<!-- ② '])),
      T('緊急の案件の行に :class="{ urgent: … }" で urgent クラスを付ける（2 行）', 1, /:class\s*=\s*"\{\s*urgent\s*:\s*item\.urgent\s*\}"/.test(r) && $all(c, '#app .case-row.urgent').length === 2, ['オブジェクト形式: { クラス名: 条件 }。条件が true のときだけクラスが付く。', C('<li class="case-row" :class="{ urgent: item.urgent }">')], at('CaseRow.vue', ['<!-- ③ '])),
      T('状態のバッジに :class="[\'badge\', item.status]"（配列）で、状態名のクラスも付ける', 2, /:class\s*=\s*"\[\s*['']badge['']\s*,\s*item\.status\s*\]"/.test(r) && $all(c, '#app .badge.doing').length === 2 && $all(c, '#app .badge.done').length === 1, ['配列形式は「いつも付けるクラス」と「変わるクラス」を並べるときに便利。', C(`<span :class="['badge', item.status]">状態</span>`)], at('CaseRow.vue', ['<!-- ④ '])),
      T('絞り込みボタンを filters の v-for で並べ、選択中だけ on クラス。@click で filter を変える', 2, /<button[^>]*v-for\s*=\s*"\s*\w+\s+in\s+filters\s*"/.test(p) && /:class\s*=\s*"\{\s*on\s*:\s*filter\s*===?\s*\w+\.value\s*\}"/.test(p) && /@click\s*=\s*"filter\s*=\s*\w+\.value"/.test(p) && $all(c, '#app .filters button').length === 4 && $all(c, '#app .filters button.on').length === 1, ['選択中かどうかは filter === f.value で判定する。', C('<button v-for="f in filters" :key="f.value" :class="{ on: filter === f.value }" @click="filter = f.value">{{ f.label }}</button>')], at(A, ['<!-- ⑤ '])),
      T('visible（computed）で filter に合う案件だけを返し、v-for のもとを cases から visible に変える', 3, /const\s+visible\s*=\s*computed\s*(<[^>]*>)?\s*\(/.test(p) && /\.filter\s*\(/.test(p) && /<CaseRow[^>]*v-for\s*=\s*"\s*\w+\s+in\s+visible\s*"/.test(p), ['computed は filter や cases が変わると自動で再計算される。', C("const visible = computed<Case[]>(() =>\n  filter.value === 'all' ? cases.value : cases.value.filter((c) => c.status === filter.value),\n)", 'ts')], at(A, ['// ⑥ '])),
    ];
  }, 'CaseListPage.vue', { [A]: 'src/pages/CaseListPage.vue', 'CaseRow.vue': 'src/components/CaseRow.vue', 'types.ts': 'src/types.ts' },
  { [A]: '案件一覧ページ（親）', 'CaseRow.vue': '案件1行（子）', 'types.ts': '案件の型' });

  /* ============================================================
     v-model：双方向 ― 相談フォーム
     ============================================================ */
  set('v-model：双方向', {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'
import MessageField from './MessageField.vue'

type Contact = 'mail' | 'tel'

const name = ref<string>('山田 太郎')
const category = ref<string>('労働問題')
const agree = ref<boolean>(false)
const people = ref<number>(1)
const contact = ref<Contact>('mail')
const message = ref<string>('')
</script>

<template>
  <form class="consult" @submit.prevent>
    <h2>無料相談のお申し込み</h2>

    <!-- ① 名前の input に v-model="name" -->
    <label>お名前 <input placeholder="例）山田 太郎" /></label>

    <!-- ② 相談の種類の select に v-model="category" -->
    <label>
      種類
      <select>
        <option>労働問題</option>
        <option>離婚・男女問題</option>
        <option>相続</option>
      </select>
    </label>

    <!-- ④ 人数は v-model.number、名前は v-model.trim にする（前後の空白を除く） -->
    <label>人数 <input type="number" min="1" /></label>

    <!-- ⑤ 連絡方法のラジオボタンに v-model="contact"（value は mail / tel） -->
    <fieldset>
      <label><input type="radio" name="contact" /> メール</label>
      <label><input type="radio" name="contact" /> 電話</label>
    </fieldset>
    <p>連絡方法: {{ contact === 'mail' ? 'メール' : '電話' }}</p>

    <!-- ⑥ 子の MessageField に v-model="message" を渡す（子は defineModel で受ける） -->
    <MessageField />
    <p>{{ message.length }} / 200 文字</p>

    <!-- ③ チェックボックスに v-model="agree"。同意するまでボタンを :disabled にする -->
    <label><input type="checkbox" /> 個人情報の取扱いに同意する</label>
    <button type="submit">申し込む</button>
  </form>
</template>
`,
    'MessageField.vue': `<script setup lang="ts">
// ⑥ const model = defineModel<string>() で、親の v-model と値をつなぐ
</script>

<template>
  <!-- ⑥ textarea に v-model="model" -->
  <textarea class="message" rows="4" maxlength="200" placeholder="ご相談の内容"></textarea>
</template>
`,
  }, {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'
import MessageField from './MessageField.vue'

type Contact = 'mail' | 'tel'

const name = ref<string>('山田 太郎')
const category = ref<string>('労働問題')
const agree = ref<boolean>(false)
const people = ref<number>(1)
const contact = ref<Contact>('mail')
const message = ref<string>('')
</script>

<template>
  <form class="consult" @submit.prevent>
    <h2>無料相談のお申し込み</h2>

    <label>お名前 <input v-model.trim="name" placeholder="例）山田 太郎" /></label>

    <label>
      種類
      <select v-model="category">
        <option>労働問題</option>
        <option>離婚・男女問題</option>
        <option>相続</option>
      </select>
    </label>

    <label>人数 <input v-model.number="people" type="number" min="1" /></label>

    <fieldset>
      <label><input v-model="contact" type="radio" name="contact" value="mail" /> メール</label>
      <label><input v-model="contact" type="radio" name="contact" value="tel" /> 電話</label>
    </fieldset>
    <p>連絡方法: {{ contact === 'mail' ? 'メール' : '電話' }}</p>

    <MessageField v-model="message" />
    <p>{{ message.length }} / 200 文字</p>

    <label><input v-model="agree" type="checkbox" /> 個人情報の取扱いに同意する</label>
    <button type="submit" :disabled="!agree">申し込む</button>
  </form>
</template>
`,
    'MessageField.vue': `<script setup lang="ts">
const model = defineModel<string>()
</script>

<template>
  <textarea v-model="model" class="message" rows="4" maxlength="200" placeholder="ご相談の内容"></textarea>
</template>
`,
  }, (v, c) => {
    const p = nc(v[A]), m = nc(v['MessageField.vue']);
    const nameIn = $q(c, 'input[placeholder^="例"]'), sel = $q(c, 'select'), btn = $q(c, 'button[type="submit"]');
    return [
      T('名前の input に v-model="name" を付ける（最初から「山田 太郎」が入る）', 1, /<input[^>]*v-model(\.\w+)*\s*=\s*"name"/.test(p) && !!nameIn && nameIn.value === '山田 太郎', ['v-model は「入力欄 ⇄ ref」を双方向につなぐ。', C('<input v-model="name" />')], at(A, ['<!-- ① '])),
      T('種類の select に v-model="category" を付ける（最初から「労働問題」が選ばれる）', 1, /<select[^>]*v-model\s*=\s*"category"/.test(p) && !!sel && sel.value === '労働問題', ['select にも v-model。選んだ option の中身が ref に入る。', C('<select v-model="category">')], at(A, ['<!-- ② '])),
      T('同意のチェックボックスに v-model="agree"、申し込みボタンは同意するまで :disabled', 1, /<input[^>]*type\s*=\s*"checkbox"[^>]*v-model\s*=\s*"agree"|<input[^>]*v-model\s*=\s*"agree"[^>]*type\s*=\s*"checkbox"/.test(p) && /<button[^>]*:disabled\s*=\s*"!\s*agree"/.test(p) && !!btn && btn.disabled === true, ['チェックボックスの v-model は true / false。ボタンは :disabled="!agree"。', C('<input type="checkbox" v-model="agree" />\n<button :disabled="!agree">申し込む</button>')], at(A, ['<!-- ③ '])),
      T('v-model の修飾子: 名前は .trim、人数は .number（ref<number> に数値で入る）', 2, /v-model\.trim\s*=\s*"name"/.test(p) && /<input[^>]*v-model\.number\s*=\s*"people"/.test(p), ['.trim は前後の空白を除き、.number は文字を数値に変える。', C('<input v-model.trim="name" />\n<input v-model.number="people" type="number" />')], at(A, ['<!-- ④ '])),
      T('連絡方法のラジオ 2 つに v-model="contact" と value（mail / tel）を付ける', 2, (p.match(/<input[^>]*type\s*=\s*"radio"[^>]*>/g) || []).filter((x) => /v-model\s*=\s*"contact"/.test(x) && /value\s*=\s*"(mail|tel)"/.test(x)).length === 2, ['同じ ref に v-model をつなぐと、選んだ 1 つの value が入る。', C('<input type="radio" v-model="contact" value="mail" /> メール\n<input type="radio" v-model="contact" value="tel" /> 電話')], at(A, ['<!-- ⑤ '])),
      T('MessageField を defineModel<string>() で作り、親から v-model="message" で受ける（文字数が親で数えられる）', 3, /const\s+model\s*=\s*defineModel\s*<\s*string\s*>\s*\(\s*\)/.test(m) && /<textarea[^>]*v-model\s*=\s*"model"/.test(m) && /<MessageField[^>]*v-model\s*=\s*"message"/.test(p), ['子の v-model は defineModel() 1 つで受けられる（親の ref と同期する）。', C('// MessageField.vue\nconst model = defineModel<string>()\n<textarea v-model="model" />\n\n// 親\n<MessageField v-model="message" />')], at('MessageField.vue', ['// ⑥ ', '<!-- ⑥ '])),
    ];
  }, 'ConsultForm.vue', { [A]: 'src/pages/ConsultForm.vue', 'MessageField.vue': 'src/components/MessageField.vue' },
  { [A]: '相談フォーム（親）', 'MessageField.vue': '相談内容の入力欄（子・defineModel）' });

  /* ============================================================
     実例：動くウィジェット3つ ― 通知ベル
     ============================================================ */
  const NOTICE_TYPES = `export interface Notice {
  id: number
  text: string
  read: boolean
}
`;
  set('実例：動くウィジェット3つ', {
    [A]: `<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Notice } from './types'
import NoticeItem from './NoticeItem.vue'

const notices = ref<Notice[]>([
  { id: 1, text: '山田様から新着メッセージ', read: false },
  { id: 2, text: '面談の日程が確定しました', read: false },
  { id: 3, text: '契約書の確認が完了しました', read: true },
])

// ② 未読の件数 unread を computed で作る（read が false のものを数える）

// ⑥ receive(): void を作り、新着を先頭に追加する（id は notices.value.length + 1 など。read: false）
</script>

<template>
  <div class="bell-box">
    <header>
      <b>相談ナビ</b>
      <span class="bell">
        🔔
        <!-- ② バッジに {{ unread }} を出す -->
        <!-- ③ 未読が 0 のときは出さない（v-if="unread > 0"） -->
        <span class="badge">0</span>
      </span>
    </header>

    <ul>
      <!-- ① NoticeItem を v-for + :key で並べる（:notice="n"）。⑤ @open="open" も付ける -->
    </ul>

    <!-- ⑥ @click="receive" -->
    <button>新着を受信</button>
  </div>
</template>

<style scoped>
.bell { position: relative; font-size: 1.4rem; }
.badge { background: #e33; color: #fff; font-size: .75rem; border-radius: 99px; padding: 0 6px; }
</style>
`,
    'NoticeItem.vue': `<script setup lang="ts">
import type { Notice } from './types'

defineProps<{ notice: Notice }>()

// ⑤ defineEmits<{ (e: 'open', id: number): void }>() を作り、クリックで emit('open', notice.id)
</script>

<template>
  <!-- ④ 未読の行だけ unread クラス（:class="{ unread: !notice.read }"） -->
  <!-- ⑤ @click で open を知らせる -->
  <li class="notice">{{ notice.text }}</li>
</template>

<style scoped>
.notice { padding: 6px 8px; border: 2px solid #d6dbe8; border-radius: 8px; margin-bottom: 4px; cursor: pointer; }
.unread { border-color: #2a6df4; background: #eaf1ff; font-weight: bold; }
</style>
`,
    'types.ts': NOTICE_TYPES,
  }, {
    [A]: `<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Notice } from './types'
import NoticeItem from './NoticeItem.vue'

const notices = ref<Notice[]>([
  { id: 1, text: '山田様から新着メッセージ', read: false },
  { id: 2, text: '面談の日程が確定しました', read: false },
  { id: 3, text: '契約書の確認が完了しました', read: true },
])

const unread = computed<number>(() => notices.value.filter((n) => !n.read).length)

function open(id: number): void {
  const target = notices.value.find((n) => n.id === id)
  if (target) target.read = true
}

function receive(): void {
  notices.value.unshift({ id: notices.value.length + 1, text: '新しい相談が1件あります', read: false })
}
</script>

<template>
  <div class="bell-box">
    <header>
      <b>相談ナビ</b>
      <span class="bell">
        🔔
        <span v-if="unread > 0" class="badge">{{ unread }}</span>
      </span>
    </header>

    <ul>
      <NoticeItem v-for="n in notices" :key="n.id" :notice="n" @open="open" />
    </ul>

    <button @click="receive">新着を受信</button>
  </div>
</template>

<style scoped>
.bell { position: relative; font-size: 1.4rem; }
.badge { background: #e33; color: #fff; font-size: .75rem; border-radius: 99px; padding: 0 6px; }
</style>
`,
    'NoticeItem.vue': `<script setup lang="ts">
import type { Notice } from './types'

const props = defineProps<{ notice: Notice }>()

const emit = defineEmits<{ (e: 'open', id: number): void }>()
</script>

<template>
  <li class="notice" :class="{ unread: !notice.read }" @click="emit('open', props.notice.id)">{{ notice.text }}</li>
</template>

<style scoped>
.notice { padding: 6px 8px; border: 2px solid #d6dbe8; border-radius: 8px; margin-bottom: 4px; cursor: pointer; }
.unread { border-color: #2a6df4; background: #eaf1ff; font-weight: bold; }
</style>
`,
    'types.ts': NOTICE_TYPES,
  }, (v, c) => {
    const p = nc(v[A]), n = nc(v['NoticeItem.vue']);
    return [
      T('NoticeItem を v-for と :key（id）で並べ、通知 3 件を表示する', 1, /<NoticeItem[^>]*v-for\s*=\s*"\s*\w+\s+in\s+notices\s*"/.test(p) && /<NoticeItem[^>]*:key\s*=\s*"\s*\w+\.id\s*"/.test(p) && /<NoticeItem[^>]*:notice\s*=\s*"\s*\w+\s*"/.test(p) && $all(c, '#app .notice').length === 3, ['配列 notices の 1 件ずつを :notice で子に渡す。', C('<NoticeItem v-for="n in notices" :key="n.id" :notice="n" />')], at(A, ['<!-- ① '])),
      T('unread を computed で作り（read が false の件数）、バッジに {{ unread }} と出す', 1, /const\s+unread\s*=\s*computed\s*(<[^>]*>)?\s*\(/.test(p) && /\.filter\s*\(.*!\s*\w+\.read.*\)\s*\.length/.test(p) && /\{\{\s*unread\s*\}\}/.test(p) && ($q(c, '#app .badge') || { textContent: '' }).textContent.trim() === '2', ['未読 = read が false のものを filter して length。', C('const unread = computed<number>(() => notices.value.filter((n) => !n.read).length)', 'ts')], at(A, ['// ② ', '<!-- ② '])),
      T('バッジは未読があるときだけ見せる（v-if="unread > 0"）', 1, /<span[^>]*v-if\s*=\s*"unread\s*(>\s*0|!==?\s*0)"[^>]*class\s*=\s*"badge"|<span[^>]*class\s*=\s*"badge"[^>]*v-if\s*=\s*"unread\s*(>\s*0|!==?\s*0)"/.test(p) && $all(c, '#app .badge').length === 1, ['0 件のバッジは出さない。「0 は false」を使って v-if="unread" でも動くが、> 0 の方が意図が伝わる。', C('<span v-if="unread > 0" class="badge">{{ unread }}</span>')], at(A, ['<!-- ③ '])),
      T('未読の行にだけ :class="{ unread: !notice.read }" を付ける（2 行）', 2, /:class\s*=\s*"\{\s*unread\s*:\s*!\s*notice\.read\s*\}"/.test(n) && $all(c, '#app .notice.unread').length === 2, ['read が false の間だけ unread クラス。', C('<li class="notice" :class="{ unread: !notice.read }">')], at('NoticeItem.vue', ['<!-- ④ '])),
      T('行のクリックで emit(\'open\', id) し、親の open(id) でその通知を既読にする', 2, /defineEmits\s*<[\s\S]*['"]open['"][\s\S]*number/.test(n) && /@click\s*=\s*"[^"]*emit\(\s*['"]open['"]/.test(n) && /<NoticeItem[^>]*@open\s*=\s*"open"/.test(p) && /function\s+open\s*\(\s*id\s*:\s*number\s*\)[\s\S]*\.read\s*=\s*true/.test(p), ['子は id を伝えるだけ。既読にするのは配列を持つ親。', C("// 子\n@click=\"emit('open', notice.id)\"\n\n// 親\nfunction open(id: number): void {\n  const target = notices.value.find((n) => n.id === id)\n  if (target) target.read = true\n}")], at('NoticeItem.vue', ['// ⑤ ', '<!-- ⑤ '])),
      T('「新着を受信」で receive() を呼び、未読の通知を先頭に足す（バッジの数も増える）', 3, /function\s+receive\s*\(\s*\)\s*:\s*void|const\s+receive\s*=/.test(p) && /notices\.value\.unshift\s*\(\s*\{[^}]*read\s*:\s*false/.test(p) && /<button[^>]*@click\s*=\s*"receive(\(\))?"/.test(p), ['配列の先頭に足すのは unshift。ref の配列は .value を付けて変更する。', C("function receive(): void {\n  notices.value.unshift({ id: notices.value.length + 1, text: '新しい相談が1件あります', read: false })\n}", 'ts')], at(A, ['// ⑥ ', '<!-- ⑥ '])),
    ];
  }, 'NoticeBell.vue', { [A]: 'src/components/NoticeBell.vue', 'NoticeItem.vue': 'src/components/NoticeItem.vue', 'types.ts': 'src/types.ts' },
  { [A]: '通知ベル（親）', 'NoticeItem.vue': '通知1件（子）', 'types.ts': '通知の型' });

  /* ============================================================
     実例：画面の変化を見張れ ― 案件カード
     ============================================================ */
  const STATUS_TYPES = `export type Status = 'new' | 'doing' | 'done'
`;
  set('実例：画面の変化を見張れ', {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'
import type { Status } from './types'
import StatusTag from './StatusTag.vue'

const name = ref<string>('山田 太郎')
const unread = ref<number>(3)
const status = ref<Status>('new')
const memo = ref<string>('折り返し希望')
const editing = ref<boolean>(false)

// ③ readAll(): void を作り、unread.value を 0 にする
// ④ start(): void を作り、status.value を 'doing' にする
</script>

<template>
  <article class="case-card">
    <header>
      <!-- ① 名前を {{ name }} で出す -->
      <h3></h3>
      <!-- ② 未読があるときだけバッジ（v-if="unread > 0"）に {{ unread }} -->
      <span class="badge">0</span>
    </header>

    <!-- ⑤ 状態の表示は子 StatusTag に任せる（:status="status" を渡す） -->
    <StatusTag />

    <div class="actions">
      <!-- ③ @click で readAll -->
      <button>既読にする</button>
      <!-- ④ @click で start -->
      <button>対応開始</button>
    </div>

    <!-- ⑥ メモ: editing が true なら textarea（v-model="memo"）、false なら <p>{{ memo }}</p>。「編集／完了」ボタンで editing を切り替え -->
    <p>メモ: （ここに表示）</p>
  </article>
</template>

<style scoped>
.case-card { border: 1px solid #ccd; border-radius: 10px; padding: 10px; display: grid; gap: 8px; }
.badge { background: #e33; color: #fff; border-radius: 99px; padding: 0 8px; }
</style>
`,
    'StatusTag.vue': `<script setup lang="ts">
import type { Status } from './types'

// ⑤ 親から status（Status 型）を受け取る: defineProps<{ status: Status }>()
// ⑤ LABEL: Record<Status, string> = { new: '新規', doing: '対応中', done: '完了' } を作る
</script>

<template>
  <!-- ⑤ 文字は {{ LABEL[status] }}、クラスは :class="['tag', status]" -->
  <span class="tag">状態</span>
</template>

<style scoped>
.tag { padding: 0 10px; border-radius: 99px; background: #8895b3; color: #fff; }
.tag.doing { background: #e90; }
.tag.done { background: #2a7; }
</style>
`,
    'types.ts': STATUS_TYPES,
  }, {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'
import type { Status } from './types'
import StatusTag from './StatusTag.vue'

const name = ref<string>('山田 太郎')
const unread = ref<number>(3)
const status = ref<Status>('new')
const memo = ref<string>('折り返し希望')
const editing = ref<boolean>(false)

function readAll(): void {
  unread.value = 0
}

function start(): void {
  status.value = 'doing'
}
</script>

<template>
  <article class="case-card">
    <header>
      <h3>{{ name }}</h3>
      <span v-if="unread > 0" class="badge">{{ unread }}</span>
    </header>

    <StatusTag :status="status" />

    <div class="actions">
      <button @click="readAll">既読にする</button>
      <button @click="start">対応開始</button>
    </div>

    <textarea v-if="editing" v-model="memo"></textarea>
    <p v-else>メモ: {{ memo }}</p>
    <button @click="editing = !editing">{{ editing ? '完了' : '編集' }}</button>
  </article>
</template>

<style scoped>
.case-card { border: 1px solid #ccd; border-radius: 10px; padding: 10px; display: grid; gap: 8px; }
.badge { background: #e33; color: #fff; border-radius: 99px; padding: 0 8px; }
</style>
`,
    'StatusTag.vue': `<script setup lang="ts">
import type { Status } from './types'

defineProps<{ status: Status }>()

const LABEL: Record<Status, string> = { new: '新規', doing: '対応中', done: '完了' }
</script>

<template>
  <span :class="['tag', status]">{{ LABEL[status] }}</span>
</template>

<style scoped>
.tag { padding: 0 10px; border-radius: 99px; background: #8895b3; color: #fff; }
.tag.doing { background: #e90; }
.tag.done { background: #2a7; }
</style>
`,
    'types.ts': STATUS_TYPES,
  }, (v, c) => {
    const p = nc(v[A]), s = nc(v['StatusTag.vue']);
    return [
      T('名前を {{ name }} で画面に出す（name を変えると画面も変わる）', 1, /<h3[^>]*>\s*\{\{\s*name\s*\}\}\s*<\/h3>/.test(p) && /山田 太郎/.test(appText(c)), ['template で使っている ref だけが、変わったときに再描画される。', C('<h3>{{ name }}</h3>')], at(A, ['<!-- ① '])),
      T('未読バッジに {{ unread }} を出し、未読が 0 のときは v-if で消す', 1, /<span[^>]*v-if\s*=\s*"unread\s*(>\s*0|!==?\s*0)"[^>]*>\s*\{\{\s*unread\s*\}\}|<span[^>]*class\s*=\s*"badge"[^>]*v-if\s*=\s*"unread\s*(>\s*0|!==?\s*0)"[^>]*>\s*\{\{\s*unread\s*\}\}/.test(p) && ($q(c, '#app .badge') || { textContent: '' }).textContent.trim() === '3', ['ref の値が 0 になった瞬間にバッジの DOM ごと消える。', C('<span v-if="unread > 0" class="badge">{{ unread }}</span>')], at(A, ['<!-- ② '])),
      T('「既読にする」で readAll() を呼び、unread.value を 0 にする', 1, /function\s+readAll\s*\(\s*\)|const\s+readAll\s*=/.test(p) && /unread\.value\s*=\s*0/.test(p) && /<button[^>]*@click\s*=\s*"readAll(\(\))?"/.test(p), ['script の中では .value を付けて代入する。', C('function readAll(): void {\n  unread.value = 0\n}', 'ts')], at(A, ['// ③ ', '<!-- ③ '])),
      T('「対応開始」で start() を呼び、status.value を \'doing\' にする', 2, /function\s+start\s*\(\s*\)|const\s+start\s*=/.test(p) && /status\.value\s*=\s*['"]doing['"]/.test(p) && /<button[^>]*@click\s*=\s*"start(\(\))?"/.test(p), ['status は Status 型なので、決まった文字（\'new\' / \'doing\' / \'done\'）しか入れられない。', C("function start(): void {\n  status.value = 'doing'\n}", 'ts')], at(A, ['// ④ '])),
      T('StatusTag が status を props（Status 型）で受け取り、LABEL で日本語表示と :class を付ける', 2, /defineProps\s*<\s*\{\s*status\s*:\s*Status\s*\}\s*>/.test(s) && /LABEL\s*:\s*Record\s*<\s*Status\s*,\s*string\s*>/.test(s) && /\{\{\s*LABEL\[\s*status\s*\]\s*\}\}/.test(s) && /:class\s*=\s*"\[\s*['']tag['']\s*,\s*status\s*\]"/.test(s) && /<StatusTag[^>]*:status\s*=\s*"status"/.test(p) && ($q(c, '#app .tag.new') || { textContent: '' }).textContent.trim() === '新規', ['Record<Status, string> なら、ラベルの書き忘れも型エラーで気づける。', C("const LABEL: Record<Status, string> = { new: '新規', doing: '対応中', done: '完了' }\n\n<span :class=\"['tag', status]\">{{ LABEL[status] }}</span>")], at('StatusTag.vue', ['// ⑤ ', '<!-- ⑤ '])),
      T('メモを editing で切替: true なら textarea（v-model="memo"）、false なら <p>。「編集／完了」ボタンで editing を反転', 3, /<textarea[^>]*v-if\s*=\s*"editing"[^>]*v-model\s*=\s*"memo"|<textarea[^>]*v-model\s*=\s*"memo"[^>]*v-if\s*=\s*"editing"/.test(p) && /<p[^>]*v-else[^>]*>[^<]*\{\{\s*memo\s*\}\}/.test(p) && /<button[^>]*@click\s*=\s*"editing\s*=\s*!\s*editing"/.test(p) && /折り返し希望/.test(appText(c)), ['v-if / v-else で入力欄と表示を入れ替える。ボタンは editing = !editing。', C(`<textarea v-if="editing" v-model="memo"></textarea>\n<p v-else>メモ: {{ memo }}</p>\n<button @click="editing = !editing">{{ editing ? '完了' : '編集' }}</button>`)], at(A, ['<!-- ⑥ '])),
    ];
  }, 'CaseStatusCard.vue', { [A]: 'src/components/CaseStatusCard.vue', 'StatusTag.vue': 'src/components/StatusTag.vue', 'types.ts': 'src/types.ts' },
  { [A]: '案件カード（親）', 'StatusTag.vue': '状態タグ（子）', 'types.ts': '状態の型' });

  /* ============================================================
     実践：ミニTodo ― 相談対応のToDo
     ============================================================ */
  const TODO_TYPES = `export interface Todo {
  id: number
  text: string
  done: boolean
}
`;
  set('実践：ミニTodo', {
    [A]: `<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Todo } from './types'
import TodoItem from './TodoItem.vue'

const todos = ref<Todo[]>([
  { id: 1, text: '山田様へ初回面談の連絡', done: true },
  { id: 2, text: '委任契約書のドラフト作成', done: false },
])
const draft = ref<string>('')
let nextId = 3

// ② add(): void を作る。draft が空なら何もしない。todos.value.push({ id: nextId++, text: draft.value, done: false }) のあと draft を空にする

// ④ toggle(id: number): void を作り、その id の done を反転する（子から届く）

// ⑤ 残り件数 remaining を computed で作る（done が false の数）

// ⑥ remove(id: number): void を作り、その id の Todo を消す（filter で作り直す）
</script>

<template>
  <div class="todo">
    <h2>相談対応ToDo</h2>

    <form @submit.prevent="add">
      <!-- ① 入力欄に v-model="draft" -->
      <input placeholder="やることを入力" />
      <!-- ② ボタンは submit。クリックで add が呼ばれる -->
      <button type="submit">追加</button>
    </form>

    <ul>
      <!-- ③ TodoItem を v-for + :key で並べる（:todo="t"）。④ @toggle="toggle"、⑥ @remove="remove" -->
    </ul>

    <!-- ⑤ 残り {{ remaining }} 件 -->
    <p>残り 0 件</p>
  </div>
</template>
`,
    'TodoItem.vue': `<script setup lang="ts">
import type { Todo } from './types'

defineProps<{ todo: Todo }>()

// ④ defineEmits<{ (e: 'toggle', id: number): void; (e: 'remove', id: number): void }>() を作る
</script>

<template>
  <li class="todo-item">
    <!-- ④ チェックの @change で emit('toggle', todo.id)。完了の行には :class="{ done: todo.done }" -->
    <input type="checkbox" :checked="todo.done" />
    <span>{{ todo.text }}</span>
    <!-- ⑥ @click で emit('remove', todo.id) -->
    <button>削除</button>
  </li>
</template>

<style scoped>
.done span { text-decoration: line-through; color: #889; }
</style>
`,
    'types.ts': TODO_TYPES,
  }, {
    [A]: `<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Todo } from './types'
import TodoItem from './TodoItem.vue'

const todos = ref<Todo[]>([
  { id: 1, text: '山田様へ初回面談の連絡', done: true },
  { id: 2, text: '委任契約書のドラフト作成', done: false },
])
const draft = ref<string>('')
let nextId = 3

function add(): void {
  const text = draft.value.trim()
  if (!text) return
  todos.value.push({ id: nextId++, text, done: false })
  draft.value = ''
}

function toggle(id: number): void {
  const target = todos.value.find((t) => t.id === id)
  if (target) target.done = !target.done
}

const remaining = computed<number>(() => todos.value.filter((t) => !t.done).length)

function remove(id: number): void {
  todos.value = todos.value.filter((t) => t.id !== id)
}
</script>

<template>
  <div class="todo">
    <h2>相談対応ToDo</h2>

    <form @submit.prevent="add">
      <input v-model="draft" placeholder="やることを入力" />
      <button type="submit">追加</button>
    </form>

    <ul>
      <TodoItem v-for="t in todos" :key="t.id" :todo="t" @toggle="toggle" @remove="remove" />
    </ul>

    <p>残り {{ remaining }} 件</p>
  </div>
</template>
`,
    'TodoItem.vue': `<script setup lang="ts">
import type { Todo } from './types'

defineProps<{ todo: Todo }>()

const emit = defineEmits<{
  (e: 'toggle', id: number): void
  (e: 'remove', id: number): void
}>()
</script>

<template>
  <li class="todo-item" :class="{ done: todo.done }">
    <input type="checkbox" :checked="todo.done" @change="emit('toggle', todo.id)" />
    <span>{{ todo.text }}</span>
    <button @click="emit('remove', todo.id)">削除</button>
  </li>
</template>

<style scoped>
.done span { text-decoration: line-through; color: #889; }
</style>
`,
    'types.ts': TODO_TYPES,
  }, (v, c) => {
    const p = nc(v[A]), t = nc(v['TodoItem.vue']);
    return [
      T('入力欄に v-model="draft" を付ける', 1, /<input[^>]*v-model(\.\w+)*\s*=\s*"draft"/.test(p), ['入力した文字がそのまま draft に入る。', C('<input v-model="draft" placeholder="やることを入力" />')], at(A, ['<!-- ① '])),
      T('add() で draft を Todo として todos に push し、draft を空にする（空なら追加しない）', 1, /function\s+add\s*\(\s*\)|const\s+add\s*=/.test(p) && /todos\.value\.push\s*\(\s*\{[^}]*done\s*:\s*false/.test(p) && /draft\.value\s*=\s*['"]{2}/.test(p) && /if\s*\(\s*!\s*(draft\.value|text)(\.trim\(\))?\s*\)\s*return|if\s*\([^)]*(draft\.value|text)[^)]*\)/.test(p), ['id は nextId++ で増やす。空文字は追加しない。', C("function add(): void {\n  const text = draft.value.trim()\n  if (!text) return\n  todos.value.push({ id: nextId++, text, done: false })\n  draft.value = ''\n}", 'ts')], at(A, ['// ② ', '<!-- ② '])),
      T('TodoItem を v-for と :key で並べ、最初の 2 件を表示する', 1, /<TodoItem[^>]*v-for\s*=\s*"\s*\w+\s+in\s+todos\s*"/.test(p) && /<TodoItem[^>]*:key\s*=\s*"\s*\w+\.id\s*"/.test(p) && /<TodoItem[^>]*:todo\s*=\s*"\s*\w+\s*"/.test(p) && $all(c, '#app .todo-item').length === 2, ['子には :todo で 1 件ずつ渡す。', C('<TodoItem v-for="t in todos" :key="t.id" :todo="t" />')], at(A, ['<!-- ③ '])),
      T('チェックで emit(\'toggle\', id)、親の toggle(id) が done を反転。完了の行には done クラス', 2, /defineEmits\s*<[\s\S]*['"]toggle['"][\s\S]*number/.test(t) && /<input[^>]*@change\s*=\s*"[^"]*emit\(\s*['"]toggle['"]/.test(t) && /:class\s*=\s*"\{\s*done\s*:\s*todo\.done\s*\}"/.test(t) && /<TodoItem[^>]*@toggle\s*=\s*"toggle"/.test(p) && /function\s+toggle\s*\(\s*id\s*:\s*number\s*\)[\s\S]*\.done\s*=\s*!/.test(p) && $all(c, '#app .todo-item.done').length === 1, ['子は emit、反転は親。done の行だけ取り消し線が付く。', C("// 子\n<input type=\"checkbox\" :checked=\"todo.done\" @change=\"emit('toggle', todo.id)\" />\n\n// 親\nfunction toggle(id: number): void {\n  const target = todos.value.find((t) => t.id === id)\n  if (target) target.done = !target.done\n}")], at('TodoItem.vue', ['// ④ ', '<!-- ④ '])),
      T('remaining（computed）で未完了の数を数え、「残り N 件」と表示する（最初は 1 件）', 2, /const\s+remaining\s*=\s*computed\s*(<[^>]*>)?\s*\(/.test(p) && /\.filter\s*\(.*!\s*\w+\.done.*\)\s*\.length/.test(p) && /\{\{\s*remaining\s*\}\}/.test(p) && /残り\s*1\s*件/.test(appText(c)), ['未完了 = done が false。computed なので追加・チェックのたびに自動で変わる。', C('const remaining = computed<number>(() => todos.value.filter((t) => !t.done).length)', 'ts')], at(A, ['// ⑤ '])),
      T('削除ボタンで emit(\'remove\', id) し、親の remove(id) が filter で Todo を取り除く', 3, /defineEmits\s*<[\s\S]*['"]remove['"][\s\S]*number/.test(t) && /<button[^>]*@click\s*=\s*"[^"]*emit\(\s*['"]remove['"]/.test(t) && /<TodoItem[^>]*@remove\s*=\s*"remove"/.test(p) && /function\s+remove\s*\(\s*id\s*:\s*number\s*\)[\s\S]*todos\.value\s*=\s*todos\.value\.filter/.test(p), ['消すというより「その id 以外で作り直す」。', C("function remove(id: number): void {\n  todos.value = todos.value.filter((t) => t.id !== id)\n}", 'ts')], at('TodoItem.vue', ['<!-- ⑥ '])),
    ];
  }, 'ConsultTodoPage.vue', { [A]: 'src/pages/ConsultTodoPage.vue', 'TodoItem.vue': 'src/components/TodoItem.vue', 'types.ts': 'src/types.ts' },
  { [A]: 'ToDoページ（親）', 'TodoItem.vue': 'ToDo1件（子）', 'types.ts': 'ToDo の型' });

  /* ============================================================
     リアクティブの仕組み ― 未読バッジと受信箱
     ============================================================ */
  set('リアクティブの仕組み', {
    [A]: `<script setup lang="ts">
import { computed, reactive, ref, toRefs } from 'vue'
import UnreadBadge from './UnreadBadge.vue'

interface Mail {
  id: number
  from: string
  read: boolean
}

interface Inbox {
  owner: string
  mails: Mail[]
}

// ① お知らせの件数。let のままだと変わっても画面は変わらない → ref<number>(3) にする
let unread = 3

// ② readAll(): void で件数を 0 にする（ref の中身は .value で書き換える）
function readAll(): void {
  // ここに書く
}

// ④ 受信箱を reactive<Inbox>({ … }) にする（オブジェクトには .value は要らない）
const inbox: Inbox = {
  owner: '佐藤 弁護士',
  mails: [
    { id: 1, from: '山田様', read: false },
    { id: 2, from: '鈴木様', read: true },
  ],
}

// ⑤ 未読メールの数 unreadMails を computed で作る（inbox.mails の read が false）

// ⑥ 分割代入 const { owner } = inbox は、リアクティブが切れる → toRefs(inbox) から取り出す
const { owner } = inbox

function addMail(): void {
  inbox.mails.push({ id: inbox.mails.length + 1, from: '高橋様', read: false })
}

function rename(): void {
  inbox.owner = '田中 弁護士'
}
</script>

<template>
  <div class="inbox">
    <h2>{{ owner }} の受信箱</h2>

    <!-- ③ 子 UnreadBadge に :count="unread" を渡す（子は defineProps<{ count: number }>() で受ける） -->
    <p>お知らせ <UnreadBadge /></p>
    <button @click="readAll">お知らせを既読にする</button>

    <p>未読メール: {{ inbox.mails.length }} 件中 0 件</p>
    <ul>
      <li v-for="m in inbox.mails" :key="m.id">{{ m.from }}</li>
    </ul>
    <button @click="addMail">メールを受信</button>
    <button @click="rename">担当を変更</button>
  </div>
</template>
`,
    'UnreadBadge.vue': `<script setup lang="ts">
// ③ 親から count（number）を受け取る: defineProps<{ count: number }>()
</script>

<template>
  <!-- ③ {{ count }} を出し、0 のときは v-if で消す -->
  <span class="badge">0</span>
</template>

<style scoped>
.badge { background: #e33; color: #fff; border-radius: 99px; padding: 0 8px; }
</style>
`,
  }, {
    [A]: `<script setup lang="ts">
import { computed, reactive, ref, toRefs } from 'vue'
import UnreadBadge from './UnreadBadge.vue'

interface Mail {
  id: number
  from: string
  read: boolean
}

interface Inbox {
  owner: string
  mails: Mail[]
}

const unread = ref<number>(3)

function readAll(): void {
  unread.value = 0
}

const inbox = reactive<Inbox>({
  owner: '佐藤 弁護士',
  mails: [
    { id: 1, from: '山田様', read: false },
    { id: 2, from: '鈴木様', read: true },
  ],
})

const unreadMails = computed<number>(() => inbox.mails.filter((m) => !m.read).length)

const { owner } = toRefs(inbox)

function addMail(): void {
  inbox.mails.push({ id: inbox.mails.length + 1, from: '高橋様', read: false })
}

function rename(): void {
  inbox.owner = '田中 弁護士'
}
</script>

<template>
  <div class="inbox">
    <h2>{{ owner }} の受信箱</h2>

    <p>お知らせ <UnreadBadge :count="unread" /></p>
    <button @click="readAll">お知らせを既読にする</button>

    <p>未読メール: {{ inbox.mails.length }} 件中 {{ unreadMails }} 件</p>
    <ul>
      <li v-for="m in inbox.mails" :key="m.id">{{ m.from }}</li>
    </ul>
    <button @click="addMail">メールを受信</button>
    <button @click="rename">担当を変更</button>
  </div>
</template>
`,
    'UnreadBadge.vue': `<script setup lang="ts">
defineProps<{ count: number }>()
</script>

<template>
  <span v-if="count > 0" class="badge">{{ count }}</span>
</template>

<style scoped>
.badge { background: #e33; color: #fff; border-radius: 99px; padding: 0 8px; }
</style>
`,
  }, (v, c) => {
    const p = nc(v[A]), b = nc(v['UnreadBadge.vue']);
    const fn = (re) => (p.match(re) || [])[1] || '';
    return [
      T('unread を ref<number>(3) にして、値が変わったら画面も変わるようにする', 1, /const\s+unread\s*=\s*ref\s*(<\s*number\s*>)?\s*\(\s*3\s*\)/.test(p), ['let の普通の変数は、変わっても Vue は気づけない。ref で包む。', C('const unread = ref<number>(3)')], at(A, ['// ① '])),
      T('readAll() で unread.value を 0 にする（script では .value を付ける）', 1, /unread\.value\s*=\s*0/.test(fn(/function\s+readAll\s*\(\s*\)[^{]*\{([\s\S]*?)\n\}/)), ['ref の中身を書き換えるのは .value。template では .value は付けない。', C('function readAll(): void {\n  unread.value = 0\n}', 'ts')], at(A, ['// ② '])),
      T('UnreadBadge が count を props（number）で受け取り、親から :count="unread" を渡す（0 のときは v-if で消す）', 1, /defineProps\s*<\s*\{\s*count\s*:\s*number\s*\}\s*>/.test(b) && /v-if\s*=\s*"count\s*(>\s*0|!==?\s*0)?"/.test(b) && /\{\{\s*count\s*\}\}/.test(b) && /<UnreadBadge[^>]*:count\s*=\s*"unread"/.test(p) && ($q(c, '#app .badge') || { textContent: '' }).textContent.trim() === '3', ['親の ref が変わると、渡した先の子の表示も追従する。', C('// UnreadBadge.vue\ndefineProps<{ count: number }>()\n<span v-if="count > 0" class="badge">{{ count }}</span>\n\n// 親\n<UnreadBadge :count="unread" />')], at('UnreadBadge.vue', ['// ③ ', '<!-- ③ '])),
      T('inbox を reactive<Inbox>({ … }) にする（オブジェクトは .value なしで書き換えられる）', 2, /const\s+inbox\s*=\s*reactive\s*<\s*Inbox\s*>\s*\(/.test(p), ['ref は 1 つの値、reactive はオブジェクトまるごと。', C("const inbox = reactive<Inbox>({\n  owner: '佐藤 弁護士',\n  mails: [ … ],\n})")], at(A, ['// ④ '])),
      T('unreadMails を computed で作り（read が false の数）、「未読メール: 2 件中 N 件」と表示する', 2, /const\s+unreadMails\s*=\s*computed\s*(<[^>]*>)?\s*\(/.test(p) && /inbox\.mails\.filter\s*\(.*!\s*\w+\.read/.test(p) && /\{\{\s*unreadMails\s*\}\}/.test(p) && /未読メール:\s*2\s*件中\s*1\s*件/.test(appText(c)), ['元のデータ（inbox.mails）が変われば、自動で数え直される。', C('const unreadMails = computed<number>(() => inbox.mails.filter((m) => !m.read).length)', 'ts')], at(A, ['// ⑤ '])),
      T('const { owner } = toRefs(inbox) に直し、「担当を変更」で見出しが変わるようにする', 3, /const\s*\{\s*owner\s*\}\s*=\s*toRefs\s*\(\s*inbox\s*\)/.test(p) && /inbox\.owner\s*=/.test(p), ['reactive から普通に分割代入すると、ただの文字列になってつながりが切れる。toRefs なら ref として取り出せる。', C('const { owner } = toRefs(inbox)', 'ts')], at(A, ['// ⑥ '])),
    ];
  }, 'InboxPage.vue', { [A]: 'src/pages/InboxPage.vue', 'UnreadBadge.vue': 'src/components/UnreadBadge.vue' },
  { [A]: '受信箱ページ（親）', 'UnreadBadge.vue': '未読バッジ（子・props）' });
})();
