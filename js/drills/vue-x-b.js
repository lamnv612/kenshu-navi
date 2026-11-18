/* Vue 基礎（イベント処理 〜 リアクティブの仕組み）の練習。1つの .vue ファイル（型つき）で出す。
   子コンポーネント・props・emit・defineModel・computed・watch は後のレッスン（vue-comp / vue-life）で学ぶので、ここでは使わない。
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

const slots = ref<number>(10)
const message = ref<string>('')

// ② reserve(n: number): void を作り、n 枠ぶん slots.value を減らす

// ③ reset(): void を作り、slots.value を 10 に戻す

// ④ reserve を直す: 0 枠より下には減らさない（Math.max(0, …)）

// ⑤ reserve の中で、message.value に「3 枠を予約しました」の形で文字を入れる（n を使う）

// ⑥ cancel(n: number): void を作り、n 枠ぶん slots.value を戻す。ただし 10 枠は超えない（Math.min(10, …)）
</script>

<template>
  <section class="reserve">
    <h2>法律相談の予約枠</h2>
    <p>残り枠: {{ slots }}</p>
    <!-- ⑤ message を {{ message }} で出す -->
    <p class="message"></p>
    <div class="actions">
      <!-- ① @click で slots を 1 減らす -->
      <button>1枠予約</button>
      <!-- ② @click="reserve(3)" -->
      <button>3枠まとめて予約</button>
      <!-- ③ @click で reset を呼ぶ -->
      <button>リセット</button>
      <!-- ⑥ @click="cancel(2)" -->
      <button>2枠取消</button>
    </div>
  </section>
</template>

<style scoped>
.actions { display: flex; gap: 8px; }
</style>
`,
  }, {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'

const slots = ref<number>(10)
const message = ref<string>('')

function reserve(n: number): void {
  slots.value = Math.max(0, slots.value - n)
  message.value = n + ' 枠を予約しました'
}

function reset(): void {
  slots.value = 10
}

function cancel(n: number): void {
  slots.value = Math.min(10, slots.value + n)
}
</script>

<template>
  <section class="reserve">
    <h2>法律相談の予約枠</h2>
    <p>残り枠: {{ slots }}</p>
    <p class="message">{{ message }}</p>
    <div class="actions">
      <button @click="slots--">1枠予約</button>
      <button @click="reserve(3)">3枠まとめて予約</button>
      <button @click="reset">リセット</button>
      <button @click="cancel(2)">2枠取消</button>
    </div>
  </section>
</template>

<style scoped>
.actions { display: flex; gap: 8px; }
</style>
`,
  }, (v, c) => {
    const p = nc(v[A]);
    const rsv = (p.match(/function\s+reserve\s*\([^)]*\)[^{]*\{([\s\S]*?)\n\}/) || p.match(/const\s+reserve\s*=\s*\([^)]*\)[^=]*=>\s*\{?([\s\S]*?)\n\}?/) || [])[1] || '';
    const cnl = (p.match(/function\s+cancel\s*\([^)]*\)[^{]*\{([\s\S]*?)\n\}/) || [])[1] || '';
    return [
      T('ReserveButtons.vue で、「1枠予約」ボタンの @click で slots を 1 減らす', 1, /<button[^>]*@click\s*=\s*"[^"]*(slots\s*--|slots\s*-=\s*1|slots\s*=\s*slots\s*-\s*1|reserve\(\s*1\s*\))[^"]*"[^>]*>\s*1枠予約/.test(p), ['ボタンに @click を付けて、その場で slots を減らす。', C('<button @click="slots--">1枠予約</button>')], at(A, ['<!-- ① '])),
      T('ReserveButtons.vue で、reserve(n: number): void を作り、「3枠まとめて」ボタンから reserve(3) を呼ぶ', 1, /(function\s+reserve\s*\(\s*n\s*:\s*number\s*\)\s*:\s*void|const\s+reserve\s*=\s*\(\s*n\s*:\s*number\s*\)\s*:\s*void\s*=>)/.test(p) && /slots\.value\s*(-=|=)/.test(rsv) && /<button[^>]*@click\s*=\s*"reserve\(\s*3\s*\)"[^>]*>\s*3枠/.test(p), ['引数の n に number 型を付ける。script の中では slots.value。', C("function reserve(n: number): void {\n  slots.value -= n\n}\n\n<button @click=\"reserve(3)\">3枠まとめて予約</button>")], at(A, ['// ② ', '<!-- ② '])),
      T('ReserveButtons.vue で、reset(): void を作り、「リセット」ボタンの @click で呼んで slots を 10 に戻す', 1, /function\s+reset\s*\(\s*\)|const\s+reset\s*=/.test(p) && /slots\.value\s*=\s*10/.test(p) && /<button[^>]*@click\s*=\s*"reset(\(\))?"[^>]*>\s*リセット/.test(p), ['関数を作って、@click に関数名を渡す（括弧は付けても付けなくてもよい）。', C('function reset(): void {\n  slots.value = 10\n}\n\n<button @click="reset">リセット</button>')], at(A, ['// ③ ', '<!-- ③ '])),
      T('ReserveButtons.vue で、reserve を直し、slots が 0 より下に減らないようにする（Math.max など）', 2, /Math\.max\s*\(|if\s*\([^)]*slots\.value/.test(rsv), ['引き算の結果が 0 より小さくならないようにする。', C('slots.value = Math.max(0, slots.value - n)', 'ts')], at(A, ['// ④ '])),
      T('ReserveButtons.vue で、reserve の中で message に「◯ 枠を予約しました」を入れ、p に {{ message }} で表示する', 2, /message\.value\s*=\s*[^\n]*n/.test(rsv) && /\{\{\s*message\s*\}\}/.test(p) && /予約しました/.test(rsv), ['関数が呼ばれるたびに ref を書き換えると、画面の文字も変わる。文字をつなぐには + を使う。', C("function reserve(n: number): void {\n  slots.value = Math.max(0, slots.value - n)\n  message.value = n + ' 枠を予約しました'\n}\n\n<p class=\"message\">{{ message }}</p>")], at(A, ['// ⑤ ', '<!-- ⑤ '])),
      T('ReserveButtons.vue で、cancel(n: number): void を作り、10 枠を超えないように戻す。「2枠取消」ボタンから呼ぶ', 3, /function\s+cancel\s*\(\s*n\s*:\s*number\s*\)\s*:\s*void|const\s+cancel\s*=\s*\(\s*n\s*:\s*number\s*\)\s*:\s*void\s*=>/.test(p) && /Math\.min\s*\(\s*10|if\s*\([^)]*slots\.value/.test(cnl) && /<button[^>]*@click\s*=\s*"cancel\(\s*2\s*\)"/.test(p), ['戻すときの上限は 10。Math.min(10, …) なら、10 を超えない。', C('function cancel(n: number): void {\n  slots.value = Math.min(10, slots.value + n)\n}\n\n<button @click="cancel(2)">2枠取消</button>')], at(A, ['// ⑥ ', '<!-- ⑥ '])),
    ];
  }, RB, { [A]: 'src/pages/ReserveButtons.vue' },
  { [A]: '予約ページ。ボタンの @click で関数を呼ぶ' });

  /* ============================================================
     イベントの種類 ― 相談フォーム
     ============================================================ */
  set('イベントの種類', {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'

const subject = ref<string>('')
const category = ref<string>('労働問題')
const sentCount = ref<number>(0)
const last = ref<string>('')
const focused = ref<boolean>(false)
const hint = ref<string>('')

// ① 入力のたびに subject を更新する関数 onInput(e: Event): void
//    （(e.target as HTMLInputElement).value を subject.value に入れる）

// ② 種別が変わったときの関数 onChange(e: Event): void（category.value を更新）

// ③ send(): void を作り、sentCount を 1 増やし、last に「種別：件名」を入れて、subject を空にする
</script>

<template>
  <div class="page">
    <h2>相談フォーム</h2>
    <!-- ③ <form> に @submit.prevent="send" を付ける（ページを再読込させない） -->
    <form>
      <!-- ① @input="onInput" -->
      <!-- ④ Esc キーで件名を消す: @keydown.esc="subject = ''" を input に足す -->
      <!-- ⑤ カーソルが入ったら focused を true、外れたら false: @focus と @blur を input に足す -->
      <input :value="subject" placeholder="件名" />
      <!-- ② @change="onChange" -->
      <select :value="category">
        <option>労働問題</option>
        <option>離婚・男女問題</option>
        <option>相続</option>
      </select>
      <!-- ⑥ マウスが乗ったら hint に「件名が空だと送れません」、離れたら空に: @mouseenter と @mouseleave -->
      <button type="submit">送信</button>
    </form>
    <p>入力中: {{ category }}／{{ subject }}</p>
    <!-- ⑤ 状態を {{ focused ? '入力中…' : '待機中' }} で出す -->
    <p class="state">状態：（未設定）</p>
    <p class="hint">{{ hint }}</p>
    <p class="sent">送信済み：{{ sentCount }} 件（最後：{{ last }}）</p>
  </div>
</template>
`,
  }, {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'

const subject = ref<string>('')
const category = ref<string>('労働問題')
const sentCount = ref<number>(0)
const last = ref<string>('')
const focused = ref<boolean>(false)
const hint = ref<string>('')

function onInput(e: Event): void {
  subject.value = (e.target as HTMLInputElement).value
}

function onChange(e: Event): void {
  category.value = (e.target as HTMLSelectElement).value
}

function send(): void {
  if (!subject.value) return
  sentCount.value++
  last.value = category.value + '：' + subject.value
  subject.value = ''
}
</script>

<template>
  <div class="page">
    <h2>相談フォーム</h2>
    <form @submit.prevent="send">
      <input
        :value="subject"
        placeholder="件名"
        @input="onInput"
        @keydown.esc="subject = ''"
        @focus="focused = true"
        @blur="focused = false"
      />
      <select :value="category" @change="onChange">
        <option>労働問題</option>
        <option>離婚・男女問題</option>
        <option>相続</option>
      </select>
      <button
        type="submit"
        @mouseenter="hint = '件名が空だと送れません'"
        @mouseleave="hint = ''"
      >送信</button>
    </form>
    <p>入力中: {{ category }}／{{ subject }}</p>
    <p class="state">状態：{{ focused ? '入力中…' : '待機中' }}</p>
    <p class="hint">{{ hint }}</p>
    <p class="sent">送信済み：{{ sentCount }} 件（最後：{{ last }}）</p>
  </div>
</template>
`,
  }, (v, c) => {
    const p = nc(v[A]);
    const snd = (p.match(/function\s+send\s*\([^)]*\)[^{]*\{([\s\S]*?)\n\}/) || [])[1] || '';
    return [
      T('InquiryForm.vue で、件名の input に @input を付け、onInput(e: Event) で subject を更新する', 1, /<input[^>]*@input\s*=\s*"onInput"/.test(p) && /onInput\s*\(\s*e\s*:\s*Event\s*\)/.test(p) && /e\.target\s+as\s+HTMLInputElement/.test(p) && /subject\.value\s*=/.test(p), ['イベントオブジェクト e の e.target が入力欄。型は HTMLInputElement と教える。', C('function onInput(e: Event): void {\n  subject.value = (e.target as HTMLInputElement).value\n}', 'ts')], at(A, ['// ① ', '<!-- ① '])),
      T('InquiryForm.vue で、種別の select に @change を付け、選んだ値を category に入れる', 1, /<select[^>]*@change\s*=\s*"onChange"/.test(p) && /onChange\s*\(\s*e\s*:\s*Event\s*\)/.test(p) && /category\.value\s*=\s*\(?\s*e\.target\s+as\s+HTMLSelectElement/.test(p), ['select は change イベント。型は HTMLSelectElement。', C('category.value = (e.target as HTMLSelectElement).value', 'ts')], at(A, ['// ② ', '<!-- ② '])),
      T('InquiryForm.vue で、<form> に @submit.prevent="send" を付け、send() で sentCount を増やし last に「種別：件名」を入れて subject を空にする', 1, /<form[^>]*@submit\.prevent\s*=\s*"send"/.test(p) && /sentCount\.value\s*(\+\+|\+=\s*1)/.test(snd) && /last\.value\s*=/.test(snd) && /subject\.value\s*=\s*['"]{2}/.test(snd), ['.prevent を付けると、ページの再読込（フォーム本来の動き）を止められる。', C("function send(): void {\n  sentCount.value++\n  last.value = category.value + '：' + subject.value\n  subject.value = ''\n}", 'ts')], at(A, ['// ③ ', '<!-- ③ '])),
      T('InquiryForm.vue で、input に @keydown.esc を付け、Esc キーで件名を空にする', 2, /<input[^>]*@keydown\.esc\s*=\s*"[^"]*(subject\s*=\s*(''|"")|\w+)[^"]*"/.test(p), ['.esc のようなキー修飾子で、特定のキーだけに反応できる。', C(`<input ... @keydown.esc="subject = ''" />`)], at(A, ['<!-- ④ '])),
      T('InquiryForm.vue で、input の @focus / @blur で focused を切り替え、「状態：入力中…／待機中」を表示する（画面：状態：待機中）', 2, /<input[^>]*@focus\s*=\s*"focused\s*=\s*true"/.test(p) && /<input[^>]*@blur\s*=\s*"focused\s*=\s*false"/.test(p) && /\{\{\s*focused\s*\?[^}]*\}\}/.test(p) && /状態：\s*待機中/.test(appText(c)), ['focus は「カーソルが入った」、blur は「外れた」。focused を書き換えるだけで、表示が変わる。', C(`<input @focus="focused = true" @blur="focused = false" />\n<p>状態：{{ focused ? '入力中…' : '待機中' }}</p>`)], at(A, ['<!-- ⑤ '])),
      T('InquiryForm.vue で、送信ボタンに @mouseenter / @mouseleave を付け、マウスが乗ったときだけ hint に「件名が空だと送れません」を入れる', 3, /<button[^>]*@mouseenter\s*=\s*"hint\s*=\s*['"][^'"]+['"]"/.test(p) && /<button[^>]*@mouseleave\s*=\s*"hint\s*=\s*(''|&quot;&quot;)"/.test(p), ['mouseenter は「乗った」、mouseleave は「離れた」。離れたときに空に戻すのを忘れずに。', C(`<button type="submit" @mouseenter="hint = '件名が空だと送れません'" @mouseleave="hint = ''">送信</button>`)], at(A, ['<!-- ⑥ '])),
    ];
  }, 'InquiryForm.vue', { [A]: 'src/pages/InquiryForm.vue' },
  { [A]: '相談フォーム。入力・選択・送信・キー・フォーカス・マウスのイベント' });

  /* ============================================================
     v-if と v-show ― 管理画面（権限と料金タブ）
     ============================================================ */
  set('v-if と v-show', {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'

type Role = 'admin' | 'staff' | 'guest'

const role = ref<Role>('staff')
const showPrice = ref<boolean>(false)
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
    <!-- ⑥ guest のときはボタンを出さず、代わりに「料金表はスタッフ以上が見られます」を出す（ボタンに v-if、p に v-else） -->
    <button>料金表を見る</button>

    <!-- ③ 切替の多いタブは v-show（DOM は残して display だけ変える） -->
    <div class="tab">
      <h3>料金表</h3>
      <table>
        <thead>
          <tr>
            <th>プラン</th>
            <th>料金</th>
            <!-- ⑤ 「内部メモ」の列は管理者だけ（th と td のすべてに v-if="role === 'admin'"） -->
            <th>内部メモ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>初回相談（30分）</td>
            <td>0 円</td>
            <td>集客用</td>
          </tr>
          <tr>
            <td>継続相談（60分）</td>
            <td>11000 円</td>
            <td>標準</td>
          </tr>
          <tr>
            <td>書面作成</td>
            <td>33000 円</td>
            <td>要見積</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
`,
  }, {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'

type Role = 'admin' | 'staff' | 'guest'

const role = ref<Role>('staff')
const showPrice = ref<boolean>(false)
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

    <button v-if="role !== 'guest'" @click="showPrice = !showPrice">{{ showPrice ? '料金表を隠す' : '料金表を見る' }}</button>
    <p v-else>料金表はスタッフ以上が見られます</p>

    <div v-show="showPrice" class="tab">
      <h3>料金表</h3>
      <table>
        <thead>
          <tr>
            <th>プラン</th>
            <th>料金</th>
            <th v-if="role === 'admin'">内部メモ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>初回相談（30分）</td>
            <td>0 円</td>
            <td v-if="role === 'admin'">集客用</td>
          </tr>
          <tr>
            <td>継続相談（60分）</td>
            <td>11000 円</td>
            <td v-if="role === 'admin'">標準</td>
          </tr>
          <tr>
            <td>書面作成</td>
            <td>33000 円</td>
            <td v-if="role === 'admin'">要見積</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
`,
  }, (v, c) => {
    const p = nc(v[A]);
    const txt = appText(c);
    const pr = $all(c, '#app div').find((d) => /(^|\s)tab(\s|$)/.test(d.className));
    const ADM = "role\\s*===?\\s*['\"]admin['\"]";
    return [
      T('AdminDashboard.vue で、「管理メニュー」に v-if="role === \'admin\'" を付ける（staff のときは DOM から消える）', 1, /<p[^>]*v-if\s*=\s*"role\s*===?\s*['']admin['']"[^>]*>\s*管理メニュー/.test(p) && !txt.includes('管理メニュー'), ['v-if が false だと、要素そのものが DOM から消える。', C(`<p v-if="role === 'admin'">管理メニュー（ユーザー管理・売上）</p>`)], at(A, ['<!-- ① '])),
      T('AdminDashboard.vue で、v-else-if と v-else を使い、staff には「スタッフメニュー」、それ以外には「ゲストは閲覧のみ」を表示する', 1, /v-else-if\s*=\s*"role\s*===?\s*['']staff['']"/.test(p) && /<p[^>]*v-else[\s>]/.test(p) && txt.includes('スタッフメニュー') && !txt.includes('ゲストは閲覧のみ'), ['v-if の直後の要素に v-else-if、その次に v-else（間に別の要素を挟まない）。', C(`<p v-else-if="role === 'staff'">スタッフメニュー</p>\n<p v-else>ゲストは閲覧のみです</p>`)], at(A, ['<!-- ② '])),
      T('AdminDashboard.vue で、料金タブの div に v-show="showPrice" を付ける（最初は隠れるが DOM には残る）', 1, /<div[^>]*v-show\s*=\s*"showPrice"[^>]*class\s*=\s*"tab"|<div[^>]*class\s*=\s*"tab"[^>]*v-show\s*=\s*"showPrice"/.test(p) && !!pr && pr.ownerDocument.defaultView.getComputedStyle(pr).display === 'none', ['v-show は display: none を切り替えるだけ。何度も開閉するタブ向き。', C('<div v-show="showPrice" class="tab">')], at(A, ['<!-- ③ '])),
      T('AdminDashboard.vue で、ボタンの @click で showPrice を反転し、文字も「料金表を見る／隠す」に切り替える', 2, /<button[^>]*@click\s*=\s*"[^"]*showPrice\s*=\s*!\s*showPrice[^"]*"[^>]*>[\s\S]*?\{\{\s*showPrice\s*\?[^}]*\}\}/.test(p), ['反転は showPrice = !showPrice。文字は三項演算子。', C(`<button @click="showPrice = !showPrice">\n  {{ showPrice ? '料金表を隠す' : '料金表を見る' }}\n</button>`)], at(A, ['<!-- ④ '])),
      T('AdminDashboard.vue で、「内部メモ」の列（th と td 3 つ）に v-if="role === \'admin\'" を付け、管理者だけに見せる', 2, new RegExp('<th[^>]*v-if\\s*=\\s*"' + ADM + '"[^>]*>\\s*内部メモ').test(p) && (p.match(new RegExp('<td[^>]*v-if\\s*=\\s*"' + ADM + '"', 'g')) || []).length >= 3 && !txt.includes('内部メモ') && !txt.includes('集客用'), ['列の見出し(th)と、各行のセル(td)の両方に付ける。1つでも忘れると、列がずれる。', C(`<th v-if="role === 'admin'">内部メモ</th>\n<td v-if="role === 'admin'">集客用</td>`)], at(A, ['<!-- ⑤ '])),
      T('AdminDashboard.vue で、guest のときは料金ボタンを出さず、v-else で「料金表はスタッフ以上が見られます」を出す', 3, /<button[^>]*v-if\s*=\s*"role\s*(!==?\s*['']guest['']|===?\s*['']admin['']\s*\|\|\s*role\s*===?\s*['']staff[''])"/.test(p) && /<p[^>]*v-else[^>]*>\s*料金表はスタッフ以上が見られます/.test(p) && !txt.includes('料金表はスタッフ以上') && /料金表を見る/.test(txt), ['v-if のボタンの直後の p に v-else。guest 以外のときだけボタンが DOM に入る。', C(`<button v-if="role !== 'guest'" @click="showPrice = !showPrice">…</button>\n<p v-else>料金表はスタッフ以上が見られます</p>`)], at(A, ['<!-- ⑥ '])),
    ];
  }, 'AdminDashboard.vue', { [A]: 'src/pages/AdminDashboard.vue' },
  { [A]: '管理画面。権限によって、出す・隠す・消す' });

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
import { ref } from 'vue'
import type { Case, Status } from './types'

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

// ⑤ 状態の日本語 LABEL: Record<Status, string> = { open: '未対応', doing: '対応中', done: '完了' } を作る

// ⑥ filter に合う案件だけを返す関数 visible(): Case[] を作る
//    （'all' のときは全部。それ以外は status が一致するもの）
</script>

<template>
  <div class="page">
    <h2>案件一覧</h2>

    <div class="filters">
      <!-- ④ filters を v-for で並べ、選択中のボタンに on クラス（:class）。@click で filter を変える -->
      <button>すべて</button>
    </div>

    <ul class="list">
      <!-- ① li を v-for + :key で並べる（{{ c.title }} を出す）。⑥ で cases → visible() に変える -->
      <!-- ② 緊急（urgent）の li に urgent クラスを付ける（:class="{ urgent: … }"） -->
      <!-- ③ バッジは class を配列で: :class="['badge', c.status]"。⑤ で中の文字を {{ LABEL[c.status] }} にする -->
      <li class="case-row">
        <span>（案件）</span>
        <span class="badge">状態</span>
      </li>
    </ul>
    <p v-if="false">該当する案件はありません</p>
  </div>
</template>

<style scoped>
.filters { display: flex; gap: 6px; margin-bottom: 8px; }
.filters .on { background: #2a6df4; color: #fff; }
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
import { ref } from 'vue'
import type { Case, Status } from './types'

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

const LABEL: Record<Status, string> = { open: '未対応', doing: '対応中', done: '完了' }

function visible(): Case[] {
  return filter.value === 'all' ? cases.value : cases.value.filter((c) => c.status === filter.value)
}
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
      <li v-for="c in visible()" :key="c.id" class="case-row" :class="{ urgent: c.urgent }">
        <span>{{ c.title }}</span>
        <span :class="['badge', c.status]">{{ LABEL[c.status] }}</span>
      </li>
    </ul>
    <p v-if="visible().length === 0">該当する案件はありません</p>
  </div>
</template>

<style scoped>
.filters { display: flex; gap: 6px; margin-bottom: 8px; }
.filters .on { background: #2a6df4; color: #fff; }
.case-row { display: flex; gap: 8px; padding: 6px; border-bottom: 1px solid #ddd; }
.urgent { border-left: 4px solid #d33; }
.badge { padding: 0 8px; border-radius: 99px; background: #aab; color: #fff; }
.badge.doing { background: #e90; }
.badge.done { background: #2a7; }
</style>
`,
    'types.ts': CASE_TYPES,
  }, (v, c) => {
    const p = nc(v[A]);
    const rows = $all(c, '#app .case-row');
    const b0 = $all(c, '#app .badge')[0];
    return [
      T('CaseListPage.vue で、li を v-for と :key（案件の id）で並べる（画面：4 行）', 1, /<li[^>]*v-for\s*=\s*"\s*\w+\s+in\s+(cases|visible\(\))\s*"[^>]*:key\s*=\s*"\s*\w+\.id\s*"|<li[^>]*:key\s*=\s*"\s*\w+\.id\s*"[^>]*v-for\s*=\s*"\s*\w+\s+in\s+(cases|visible\(\))\s*"/.test(p) && rows.length === 4 && /離婚の財産分与/.test(appText(c)), ['v-for には必ず :key。中身が入れ替わっても行を見失わないための目印。', C('<li v-for="c in cases" :key="c.id" class="case-row">\n  <span>{{ c.title }}</span>\n</li>')], at(A, ['<!-- ① '])),
      T('CaseListPage.vue で、緊急の案件の li に :class="{ urgent: … }" で urgent クラスを付ける（画面：2 行）', 1, /:class\s*=\s*"\{\s*urgent\s*:\s*\w+\.urgent\s*\}"/.test(p) && $all(c, '#app .case-row.urgent').length === 2, ['オブジェクト形式: { クラス名: 条件 }。条件が true のときだけクラスが付く。', C('<li class="case-row" :class="{ urgent: c.urgent }">')], at(A, ['<!-- ② '])),
      T('CaseListPage.vue で、状態のバッジに :class="[\'badge\', c.status]" を付け、状態名のクラスも足す', 1, /:class\s*=\s*"\[\s*['']badge['']\s*,\s*\w+\.status\s*\]"/.test(p) && $all(c, '#app .badge.doing').length === 2 && $all(c, '#app .badge.done').length === 1, ['配列形式は「いつも付けるクラス」と「変わるクラス」を並べるときに便利。', C(`<span :class="['badge', c.status]">状態</span>`)], at(A, ['<!-- ③ '])),
      T('CaseListPage.vue で、絞り込みボタンを filters の v-for で並べ、選択中だけ on クラスを付け、@click で filter を変える', 2, /<button[^>]*v-for\s*=\s*"\s*\w+\s+in\s+filters\s*"/.test(p) && /:class\s*=\s*"\{\s*on\s*:\s*filter\s*===?\s*\w+\.value\s*\}"/.test(p) && /@click\s*=\s*"filter\s*=\s*\w+\.value"/.test(p) && $all(c, '#app .filters button').length === 4 && $all(c, '#app .filters button.on').length === 1, ['選択中かどうかは filter === f.value で判定する。', C('<button v-for="f in filters" :key="f.value" :class="{ on: filter === f.value }" @click="filter = f.value">{{ f.label }}</button>')], at(A, ['<!-- ④ '])),
      T('CaseListPage.vue で、LABEL（Record<Status, string>）を作り、バッジの文字を {{ LABEL[c.status] }} にする（画面：未対応・対応中・完了）', 2, /LABEL\s*:\s*Record\s*<\s*Status\s*,\s*string\s*>/.test(p) && /\{\{\s*LABEL\[\s*\w+\.status\s*\]\s*\}\}/.test(p) && !!b0 && b0.textContent.trim() === '未対応', ['Record<Status, string> なら、ラベルの書き忘れも型エラーで気づける。', C("const LABEL: Record<Status, string> = { open: '未対応', doing: '対応中', done: '完了' }\n\n<span :class=\"['badge', c.status]\">{{ LABEL[c.status] }}</span>")], at(A, ['// ⑤ '])),
      T('CaseListPage.vue で、visible(): Case[] を作り、v-for の対象を cases から visible() に変える（0 件のときは v-if で「該当なし」）', 3, /function\s+visible\s*\(\s*\)\s*:\s*Case\s*\[\s*\]|const\s+visible\s*=\s*\(\s*\)\s*:\s*Case\s*\[\s*\]\s*=>/.test(p) && /\.filter\s*\(/.test(p) && /<li[^>]*v-for\s*=\s*"\s*\w+\s+in\s+visible\(\)\s*"/.test(p) && /v-if\s*=\s*"visible\(\)\.length\s*===?\s*0"/.test(p), ['filter が変わるたびに画面が描き直されるので、関数は「今の filter に合うもの」を返すだけでよい。', C("function visible(): Case[] {\n  return filter.value === 'all' ? cases.value : cases.value.filter((c) => c.status === filter.value)\n}\n\n<li v-for=\"c in visible()\" :key=\"c.id\">…</li>\n<p v-if=\"visible().length === 0\">該当する案件はありません</p>", 'ts')], at(A, ['// ⑥ '])),
    ];
  }, 'CaseListPage.vue', { [A]: 'src/pages/CaseListPage.vue', 'types.ts': 'src/types.ts' },
  { [A]: '案件一覧ページ。v-for で並べて :class で見た目を変える', 'types.ts': '案件の型' });

  /* ============================================================
     v-model：双方向 ― 相談フォーム
     ============================================================ */
  set('v-model：双方向', {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'

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

    <!-- ⑥ textarea に v-model="message" をつなぎ、180 文字を超えたら文字数の p に warn クラス（:class） -->
    <textarea class="message" rows="4" maxlength="200" placeholder="ご相談の内容"></textarea>
    <p>{{ message.length }} / 200 文字</p>

    <!-- ③ チェックボックスに v-model="agree"。同意するまでボタンを :disabled にする -->
    <label><input type="checkbox" /> 個人情報の取扱いに同意する</label>
    <button type="submit">申し込む</button>
  </form>
</template>

<style scoped>
.warn { color: #d33; font-weight: bold; }
</style>
`,
  }, {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'

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

    <textarea v-model="message" class="message" rows="4" maxlength="200" placeholder="ご相談の内容"></textarea>
    <p :class="{ warn: message.length > 180 }">{{ message.length }} / 200 文字</p>

    <label><input v-model="agree" type="checkbox" /> 個人情報の取扱いに同意する</label>
    <button type="submit" :disabled="!agree">申し込む</button>
  </form>
</template>

<style scoped>
.warn { color: #d33; font-weight: bold; }
</style>
`,
  }, (v, c) => {
    const p = nc(v[A]);
    const nameIn = $q(c, 'input[placeholder^="例"]'), sel = $q(c, 'select'), btn = $q(c, 'button[type="submit"]');
    return [
      T('ConsultForm.vue で、名前の input に v-model="name" を付ける（最初から「山田 太郎」が入る）', 1, /<input[^>]*v-model(\.\w+)*\s*=\s*"name"/.test(p) && !!nameIn && nameIn.value === '山田 太郎', ['v-model は「入力欄 ⇄ ref」を双方向につなぐ。', C('<input v-model="name" />')], at(A, ['<!-- ① '])),
      T('ConsultForm.vue で、種類の select に v-model="category" を付ける（最初から「労働問題」が選ばれる）', 1, /<select[^>]*v-model\s*=\s*"category"/.test(p) && !!sel && sel.value === '労働問題', ['select にも v-model。選んだ option の中身が ref に入る。', C('<select v-model="category">')], at(A, ['<!-- ② '])),
      T('ConsultForm.vue で、同意のチェックボックスに v-model="agree" を付け、同意するまで申し込みボタンを :disabled にする', 1, /<input[^>]*type\s*=\s*"checkbox"[^>]*v-model\s*=\s*"agree"|<input[^>]*v-model\s*=\s*"agree"[^>]*type\s*=\s*"checkbox"/.test(p) && /<button[^>]*:disabled\s*=\s*"!\s*agree"/.test(p) && !!btn && btn.disabled === true, ['チェックボックスの v-model は true / false。ボタンは :disabled="!agree"。', C('<input type="checkbox" v-model="agree" />\n<button :disabled="!agree">申し込む</button>')], at(A, ['<!-- ③ '])),
      T('ConsultForm.vue で、v-model の修飾子を付ける（名前は .trim、人数は .number）', 2, /v-model\.trim\s*=\s*"name"/.test(p) && /<input[^>]*v-model\.number\s*=\s*"people"/.test(p), ['.trim は前後の空白を除き、.number は文字を数値に変える。', C('<input v-model.trim="name" />\n<input v-model.number="people" type="number" />')], at(A, ['<!-- ④ '])),
      T('ConsultForm.vue で、連絡方法のラジオ 2 つに v-model="contact" と value（mail / tel）を付ける', 2, (p.match(/<input[^>]*type\s*=\s*"radio"[^>]*>/g) || []).filter((x) => /v-model\s*=\s*"contact"/.test(x) && /value\s*=\s*"(mail|tel)"/.test(x)).length === 2, ['同じ ref に v-model をつなぐと、選んだ 1 つの value が入る。', C('<input type="radio" v-model="contact" value="mail" /> メール\n<input type="radio" v-model="contact" value="tel" /> 電話')], at(A, ['<!-- ⑤ '])),
      T('ConsultForm.vue で、textarea に v-model="message" をつなぎ、180 文字を超えたら文字数の p に :class で warn を付ける', 3, /<textarea[^>]*v-model\s*=\s*"message"/.test(p) && /<p[^>]*:class\s*=\s*"\{\s*warn\s*:\s*message\.length\s*>\s*\d+\s*\}"/.test(p), ['textarea にも v-model。文字数は message.length。:class の条件に使うと、超えたときだけ色が変わる。', C('<textarea v-model="message" />\n<p :class="{ warn: message.length > 180 }">{{ message.length }} / 200 文字</p>')], at(A, ['<!-- ⑥ '])),
    ];
  }, 'ConsultForm.vue', { [A]: 'src/pages/ConsultForm.vue' },
  { [A]: '相談フォーム。入力欄とデータを v-model でつなぐ' });

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
import { ref } from 'vue'
import type { Notice } from './types'

const notices = ref<Notice[]>([
  { id: 1, text: '山田様から新着メッセージ', read: false },
  { id: 2, text: '面談の日程が確定しました', read: false },
  { id: 3, text: '契約書の確認が完了しました', read: true },
])

// ② 未読の件数を返す関数 unreadCount(): number を作る（read が false のものを filter して length）

// ⑤ open(id: number): void を作り、その id の通知の read を true にする

// ⑥ receive(): void を作り、新着を先頭に追加する（unshift。id は notices.value.length + 1 など。read: false）
</script>

<template>
  <div class="bell-box">
    <header>
      <b>相談ナビ</b>
      <span class="bell">
        🔔
        <!-- ② バッジに {{ unreadCount() }} を出す -->
        <!-- ③ 未読が 0 のときは出さない（v-if="unreadCount() > 0"） -->
        <span class="badge">0</span>
      </span>
    </header>

    <ul>
      <!-- ① li を v-for + :key で並べる（{{ n.text }} を出す） -->
      <!-- ④ 未読の li だけ unread クラス（:class="{ unread: !n.read }"） -->
      <!-- ⑤ li に @click="open(n.id)" -->
      <li class="notice">（通知）</li>
    </ul>

    <!-- ⑥ @click="receive" -->
    <button>新着を受信</button>
  </div>
</template>

<style scoped>
.bell { position: relative; font-size: 1.4rem; }
.badge { background: #e33; color: #fff; font-size: .75rem; border-radius: 99px; padding: 0 6px; }
.notice { padding: 6px 8px; border: 2px solid #d6dbe8; border-radius: 8px; margin-bottom: 4px; cursor: pointer; }
.unread { border-color: #2a6df4; background: #eaf1ff; font-weight: bold; }
</style>
`,
    'types.ts': NOTICE_TYPES,
  }, {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'
import type { Notice } from './types'

const notices = ref<Notice[]>([
  { id: 1, text: '山田様から新着メッセージ', read: false },
  { id: 2, text: '面談の日程が確定しました', read: false },
  { id: 3, text: '契約書の確認が完了しました', read: true },
])

function unreadCount(): number {
  return notices.value.filter((n) => !n.read).length
}

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
        <span v-if="unreadCount() > 0" class="badge">{{ unreadCount() }}</span>
      </span>
    </header>

    <ul>
      <li
        v-for="n in notices"
        :key="n.id"
        class="notice"
        :class="{ unread: !n.read }"
        @click="open(n.id)"
      >{{ n.text }}</li>
    </ul>

    <button @click="receive">新着を受信</button>
  </div>
</template>

<style scoped>
.bell { position: relative; font-size: 1.4rem; }
.badge { background: #e33; color: #fff; font-size: .75rem; border-radius: 99px; padding: 0 6px; }
.notice { padding: 6px 8px; border: 2px solid #d6dbe8; border-radius: 8px; margin-bottom: 4px; cursor: pointer; }
.unread { border-color: #2a6df4; background: #eaf1ff; font-weight: bold; }
</style>
`,
    'types.ts': NOTICE_TYPES,
  }, (v, c) => {
    const p = nc(v[A]);
    const opn = (p.match(/function\s+open\s*\([^)]*\)[^{]*\{([\s\S]*?)\n\}/) || [])[1] || '';
    return [
      T('NoticeBell.vue で、li を v-for と :key（id）で並べ、通知の文を表示する（画面：通知 3 件）', 1, /<li[^>]*v-for\s*=\s*"\s*\w+\s+in\s+notices\s*"/.test(p) && /<li[^>]*:key\s*=\s*"\s*\w+\.id\s*"/.test(p) && /\{\{\s*\w+\.text\s*\}\}/.test(p) && $all(c, '#app .notice').length === 3, ['配列 notices の 1 件ずつを、li に並べる。', C('<li v-for="n in notices" :key="n.id" class="notice">{{ n.text }}</li>')], at(A, ['<!-- ① '])),
      T('NoticeBell.vue で、unreadCount(): number を作り（read が false の件数）、バッジに {{ unreadCount() }} を表示する（画面：2）', 1, /function\s+unreadCount\s*\(\s*\)\s*:\s*number|const\s+unreadCount\s*=\s*\(\s*\)\s*:\s*number\s*=>/.test(p) && /\.filter\s*\(.*!\s*\w+\.read.*\)\s*\.length/.test(p) && /\{\{\s*unreadCount\(\)\s*\}\}/.test(p) && ($q(c, '#app .badge') || { textContent: '' }).textContent.trim() === '2', ['未読 = read が false のものを filter して length。template の {{ }} から、関数を呼ぶ。', C('function unreadCount(): number {\n  return notices.value.filter((n) => !n.read).length\n}', 'ts')], at(A, ['// ② ', '<!-- ② '])),
      T('NoticeBell.vue で、未読があるときだけバッジを表示する（v-if="unreadCount() > 0"）', 1, /<span[^>]*v-if\s*=\s*"unreadCount\(\)\s*(>\s*0|!==?\s*0)"[^>]*class\s*=\s*"badge"|<span[^>]*class\s*=\s*"badge"[^>]*v-if\s*=\s*"unreadCount\(\)\s*(>\s*0|!==?\s*0)"/.test(p) && $all(c, '#app .badge').length === 1, ['0 件のバッジは出さない。v-if が false なら、バッジの DOM ごと消える。', C('<span v-if="unreadCount() > 0" class="badge">{{ unreadCount() }}</span>')], at(A, ['<!-- ③ '])),
      T('NoticeBell.vue で、未読の li にだけ :class="{ unread: !n.read }" を付ける（画面：2 行）', 2, /:class\s*=\s*"\{\s*unread\s*:\s*!\s*\w+\.read\s*\}"/.test(p) && $all(c, '#app .notice.unread').length === 2, ['read が false の間だけ unread クラス。', C('<li class="notice" :class="{ unread: !n.read }">')], at(A, ['<!-- ④ '])),
      T('NoticeBell.vue で、li の @click="open(n.id)" と open(id: number): void で、その通知を既読にする', 2, /<li[^>]*@click\s*=\s*"open\(\s*\w+\.id\s*\)"/.test(p) && /function\s+open\s*\(\s*id\s*:\s*number\s*\)\s*:\s*void|const\s+open\s*=\s*\(\s*id\s*:\s*number\s*\)\s*:\s*void\s*=>/.test(p) && /\.read\s*=\s*true/.test(opn), ['@click の中で、引数に n.id を渡す。配列から id で探して read を書き換える。', C("function open(id: number): void {\n  const target = notices.value.find((n) => n.id === id)\n  if (target) target.read = true\n}")], at(A, ['// ⑤ ', '<!-- ⑤ '])),
      T('NoticeBell.vue で、「新着を受信」ボタンから receive() を呼び、未読の通知を先頭に追加する（バッジの数も増える）', 3, /function\s+receive\s*\(\s*\)\s*:\s*void|const\s+receive\s*=/.test(p) && /notices\.value\.unshift\s*\(\s*\{[^}]*read\s*:\s*false/.test(p) && /<button[^>]*@click\s*=\s*"receive(\(\))?"/.test(p), ['配列の先頭に足すのは unshift。ref の配列は .value を付けて変更する。', C("function receive(): void {\n  notices.value.unshift({ id: notices.value.length + 1, text: '新しい相談が1件あります', read: false })\n}", 'ts')], at(A, ['// ⑥ ', '<!-- ⑥ '])),
    ];
  }, 'NoticeBell.vue', { [A]: 'src/components/NoticeBell.vue', 'types.ts': 'src/types.ts' },
  { [A]: '通知ベル。未読バッジ・既読・新着受信', 'types.ts': '通知の型' });

  /* ============================================================
     実例：画面の変化を見張れ ― 案件カード
     ============================================================ */
  const STATUS_TYPES = `export type Status = 'new' | 'doing' | 'done'
`;
  set('実例：画面の変化を見張れ', {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'
import type { Status } from './types'

const name = ref<string>('山田 太郎')
const unread = ref<number>(3)
const status = ref<Status>('new')
const memo = ref<string>('折り返し希望')
const editing = ref<boolean>(false)

// ③ readAll(): void を作り、unread.value を 0 にする
// ④ start(): void を作り、status.value を 'doing' にする
// ⑤ LABEL: Record<Status, string> = { new: '新規', doing: '対応中', done: '完了' } を作る
</script>

<template>
  <article class="case-card">
    <header>
      <!-- ① 名前を {{ name }} で出す -->
      <h3></h3>
      <!-- ② 未読があるときだけバッジ（v-if="unread > 0"）に {{ unread }} -->
      <span class="badge">0</span>
    </header>

    <!-- ⑤ 状態の表示：文字は {{ LABEL[status] }}、クラスは :class="['tag', status]" -->
    <span class="tag">状態</span>

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
.tag { padding: 0 10px; border-radius: 99px; background: #8895b3; color: #fff; width: fit-content; }
.tag.doing { background: #e90; }
.tag.done { background: #2a7; }
</style>
`,
    'types.ts': STATUS_TYPES,
  }, {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'
import type { Status } from './types'

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

const LABEL: Record<Status, string> = { new: '新規', doing: '対応中', done: '完了' }
</script>

<template>
  <article class="case-card">
    <header>
      <h3>{{ name }}</h3>
      <span v-if="unread > 0" class="badge">{{ unread }}</span>
    </header>

    <span :class="['tag', status]">{{ LABEL[status] }}</span>

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
.tag { padding: 0 10px; border-radius: 99px; background: #8895b3; color: #fff; width: fit-content; }
.tag.doing { background: #e90; }
.tag.done { background: #2a7; }
</style>
`,
    'types.ts': STATUS_TYPES,
  }, (v, c) => {
    const p = nc(v[A]);
    return [
      T('CaseStatusCard.vue で、name を {{ name }} で表示する（name を変えると画面も変わる）', 1, /<h3[^>]*>\s*\{\{\s*name\s*\}\}\s*<\/h3>/.test(p) && /山田 太郎/.test(appText(c)), ['template で使っている ref だけが、変わったときに再描画される。', C('<h3>{{ name }}</h3>')], at(A, ['<!-- ① '])),
      T('CaseStatusCard.vue で、未読バッジに {{ unread }} を表示し、未読が 0 のときは v-if で消す', 1, /<span[^>]*v-if\s*=\s*"unread\s*(>\s*0|!==?\s*0)"[^>]*>\s*\{\{\s*unread\s*\}\}|<span[^>]*class\s*=\s*"badge"[^>]*v-if\s*=\s*"unread\s*(>\s*0|!==?\s*0)"[^>]*>\s*\{\{\s*unread\s*\}\}/.test(p) && ($q(c, '#app .badge') || { textContent: '' }).textContent.trim() === '3', ['ref の値が 0 になった瞬間にバッジの DOM ごと消える。', C('<span v-if="unread > 0" class="badge">{{ unread }}</span>')], at(A, ['<!-- ② '])),
      T('CaseStatusCard.vue で、「既読にする」ボタンから readAll() を呼び、unread.value を 0 にする', 1, /function\s+readAll\s*\(\s*\)|const\s+readAll\s*=/.test(p) && /unread\.value\s*=\s*0/.test(p) && /<button[^>]*@click\s*=\s*"readAll(\(\))?"/.test(p), ['script の中では .value を付けて代入する。', C('function readAll(): void {\n  unread.value = 0\n}', 'ts')], at(A, ['// ③ ', '<!-- ③ '])),
      T('CaseStatusCard.vue で、「対応開始」ボタンから start() を呼び、status.value を \'doing\' にする', 2, /function\s+start\s*\(\s*\)|const\s+start\s*=/.test(p) && /status\.value\s*=\s*['"]doing['"]/.test(p) && /<button[^>]*@click\s*=\s*"start(\(\))?"/.test(p), ['status は Status 型なので、決まった文字（\'new\' / \'doing\' / \'done\'）しか入れられない。', C("function start(): void {\n  status.value = 'doing'\n}", 'ts')], at(A, ['// ④ '])),
      T('CaseStatusCard.vue で、LABEL（Record<Status, string>）で日本語を表示し、:class も付ける（画面：新規）', 2, /LABEL\s*:\s*Record\s*<\s*Status\s*,\s*string\s*>/.test(p) && /\{\{\s*LABEL\[\s*status\s*\]\s*\}\}/.test(p) && /:class\s*=\s*"\[\s*['']tag['']\s*,\s*status\s*\]"/.test(p) && ($q(c, '#app .tag.new') || { textContent: '' }).textContent.trim() === '新規', ['Record<Status, string> なら、ラベルの書き忘れも型エラーで気づける。', C("const LABEL: Record<Status, string> = { new: '新規', doing: '対応中', done: '完了' }\n\n<span :class=\"['tag', status]\">{{ LABEL[status] }}</span>")], at(A, ['// ⑤ ', '<!-- ⑤ '])),
      T('CaseStatusCard.vue で、editing が true なら textarea（v-model="memo"）、false なら <p> を表示し、「編集／完了」ボタンで editing を反転する', 3, /<textarea[^>]*v-if\s*=\s*"editing"[^>]*v-model\s*=\s*"memo"|<textarea[^>]*v-model\s*=\s*"memo"[^>]*v-if\s*=\s*"editing"/.test(p) && /<p[^>]*v-else[^>]*>[^<]*\{\{\s*memo\s*\}\}/.test(p) && /<button[^>]*@click\s*=\s*"editing\s*=\s*!\s*editing"/.test(p) && /折り返し希望/.test(appText(c)), ['v-if / v-else で入力欄と表示を入れ替える。ボタンは editing = !editing。', C(`<textarea v-if="editing" v-model="memo"></textarea>\n<p v-else>メモ: {{ memo }}</p>\n<button @click="editing = !editing">{{ editing ? '完了' : '編集' }}</button>`)], at(A, ['<!-- ⑥ '])),
    ];
  }, 'CaseStatusCard.vue', { [A]: 'src/components/CaseStatusCard.vue', 'types.ts': 'src/types.ts' },
  { [A]: '案件カード。ref を書き換えると、使っている場所だけ変わる', 'types.ts': '状態の型' });

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
import { ref } from 'vue'
import type { Todo } from './types'

const todos = ref<Todo[]>([
  { id: 1, text: '山田様へ初回面談の連絡', done: true },
  { id: 2, text: '委任契約書のドラフト作成', done: false },
])
const draft = ref<string>('')
let nextId = 3

// ② add(): void を作る。draft が空なら何もしない。todos.value.push({ id: nextId++, text: draft.value, done: false }) のあと draft を空にする

// ⑤ 残り件数を返す関数 remaining(): number を作る（done が false の数）

// ⑥ remove(id: number): void を作り、その id の Todo を消す（filter で作り直す）
</script>

<template>
  <div class="todo">
    <h2>相談対応ToDo</h2>

    <!-- ② <form> に @submit.prevent="add" を付ける（追加ボタンの submit で add が呼ばれる） -->
    <form>
      <!-- ① 入力欄に v-model="draft" -->
      <input placeholder="やることを入力" />
      <button type="submit">追加</button>
    </form>

    <ul>
      <!-- ③ li を v-for + :key で並べる（{{ t.text }} を出す） -->
      <!-- ④ チェックボックスに v-model="t.done"。完了の li には :class="{ done: t.done }" -->
      <!-- ⑥ 削除ボタンの @click="remove(t.id)" -->
      <li class="todo-item">
        <input type="checkbox" />
        <span>（ToDo）</span>
        <button>削除</button>
      </li>
    </ul>

    <!-- ⑤ 残り {{ remaining() }} 件 -->
    <p>残り 0 件</p>
  </div>
</template>

<style scoped>
.done span { text-decoration: line-through; color: #889; }
</style>
`,
    'types.ts': TODO_TYPES,
  }, {
    [A]: `<script setup lang="ts">
import { ref } from 'vue'
import type { Todo } from './types'

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

function remaining(): number {
  return todos.value.filter((t) => !t.done).length
}

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
      <li v-for="t in todos" :key="t.id" class="todo-item" :class="{ done: t.done }">
        <input v-model="t.done" type="checkbox" />
        <span>{{ t.text }}</span>
        <button @click="remove(t.id)">削除</button>
      </li>
    </ul>

    <p>残り {{ remaining() }} 件</p>
  </div>
</template>

<style scoped>
.done span { text-decoration: line-through; color: #889; }
</style>
`,
    'types.ts': TODO_TYPES,
  }, (v, c) => {
    const p = nc(v[A]);
    return [
      T('ConsultTodoPage.vue で、入力欄に v-model="draft" を付ける', 1, /<input[^>]*v-model(\.\w+)*\s*=\s*"draft"/.test(p), ['入力した文字がそのまま draft に入る。', C('<input v-model="draft" placeholder="やることを入力" />')], at(A, ['<!-- ① '])),
      T('ConsultTodoPage.vue で、add() を作り、form の @submit.prevent で呼んで、draft を Todo として todos に push して draft を空にする（空なら追加しない）', 1, /<form[^>]*@submit\.prevent\s*=\s*"add"/.test(p) && /function\s+add\s*\(\s*\)|const\s+add\s*=/.test(p) && /todos\.value\.push\s*\(\s*\{[^}]*done\s*:\s*false/.test(p) && /draft\.value\s*=\s*['"]{2}/.test(p) && /if\s*\(\s*!\s*(draft\.value|text)(\.trim\(\))?\s*\)\s*return|if\s*\([^)]*(draft\.value|text)[^)]*\)/.test(p), ['id は nextId++ で増やす。空文字は追加しない。', C("function add(): void {\n  const text = draft.value.trim()\n  if (!text) return\n  todos.value.push({ id: nextId++, text, done: false })\n  draft.value = ''\n}", 'ts')], at(A, ['// ② ', '<!-- ② '])),
      T('ConsultTodoPage.vue で、li を v-for と :key で並べる（画面：最初の 2 件）', 1, /<li[^>]*v-for\s*=\s*"\s*\w+\s+in\s+todos\s*"/.test(p) && /<li[^>]*:key\s*=\s*"\s*\w+\.id\s*"/.test(p) && /\{\{\s*\w+\.text\s*\}\}/.test(p) && $all(c, '#app .todo-item').length === 2, ['配列 todos の 1 件ずつを li に並べる。', C('<li v-for="t in todos" :key="t.id" class="todo-item">…</li>')], at(A, ['<!-- ③ '])),
      T('ConsultTodoPage.vue で、チェックボックスに v-model="t.done" を付け、完了の li に :class="{ done: t.done }" を付ける（画面：完了 1 件）', 2, /<input[^>]*type\s*=\s*"checkbox"[^>]*v-model\s*=\s*"\w+\.done"|<input[^>]*v-model\s*=\s*"\w+\.done"[^>]*type\s*=\s*"checkbox"/.test(p) && /:class\s*=\s*"\{\s*done\s*:\s*\w+\.done\s*\}"/.test(p) && $all(c, '#app .todo-item.done').length === 1, ['v-for の 1 件（t）の done に、チェックを直接つなげる。done の行だけ取り消し線が付く。', C('<li v-for="t in todos" :key="t.id" class="todo-item" :class="{ done: t.done }">\n  <input v-model="t.done" type="checkbox" />')], at(A, ['<!-- ④ '])),
      T('ConsultTodoPage.vue で、remaining(): number で未完了の数を数え、「残り N 件」と表示する（最初は 1 件）', 2, /function\s+remaining\s*\(\s*\)\s*:\s*number|const\s+remaining\s*=\s*\(\s*\)\s*:\s*number\s*=>/.test(p) && /\.filter\s*\(.*!\s*\w+\.done.*\)\s*\.length/.test(p) && /\{\{\s*remaining\(\)\s*\}\}/.test(p) && /残り\s*1\s*件/.test(appText(c)), ['未完了 = done が false。チェックを付けると、画面の数も自動で変わる。', C('function remaining(): number {\n  return todos.value.filter((t) => !t.done).length\n}\n\n<p>残り {{ remaining() }} 件</p>', 'ts')], at(A, ['// ⑤ ', '<!-- ⑤ '])),
      T('ConsultTodoPage.vue で、削除ボタンの @click="remove(t.id)" と remove(id: number): void で、filter して Todo を取り除く', 3, /<button[^>]*@click\s*=\s*"remove\(\s*\w+\.id\s*\)"/.test(p) && /function\s+remove\s*\(\s*id\s*:\s*number\s*\)[\s\S]*todos\.value\s*=\s*todos\.value\.filter/.test(p), ['消すというより「その id 以外で作り直す」。', C("function remove(id: number): void {\n  todos.value = todos.value.filter((t) => t.id !== id)\n}", 'ts')], at(A, ['// ⑥ ', '<!-- ⑥ '])),
    ];
  }, 'ConsultTodoPage.vue', { [A]: 'src/pages/ConsultTodoPage.vue', 'types.ts': 'src/types.ts' },
  { [A]: 'ToDo ページ。追加・チェック・削除・残り件数', 'types.ts': 'ToDo の型' });

  /* ============================================================
     リアクティブの仕組み ― 未読バッジと受信箱
     ============================================================ */
  set('リアクティブの仕組み', {
    [A]: `<script setup lang="ts">
import { reactive, ref } from 'vue'

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

// ⑤ 未読メールの数を返す関数 unreadMails(): number を作る（inbox.mails の read が false）

// ⑥ 分割代入 const { owner } = inbox は、リアクティブが切れる → 消して、template で {{ inbox.owner }} と書く
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

    <!-- ③ お知らせのバッジ：{{ unread }} を出し、0 のときは v-if で消す -->
    <p>お知らせ <span class="badge">0</span></p>
    <button @click="readAll">お知らせを既読にする</button>

    <!-- ⑤ 「0 件」を {{ unreadMails() }} に -->
    <p>未読メール: {{ inbox.mails.length }} 件中 0 件</p>
    <ul>
      <li v-for="m in inbox.mails" :key="m.id">{{ m.from }}</li>
    </ul>
    <button @click="addMail">メールを受信</button>
    <button @click="rename">担当を変更</button>
  </div>
</template>

<style scoped>
.badge { background: #e33; color: #fff; border-radius: 99px; padding: 0 8px; }
</style>
`,
  }, {
    [A]: `<script setup lang="ts">
import { reactive, ref } from 'vue'

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

function unreadMails(): number {
  return inbox.mails.filter((m) => !m.read).length
}

function addMail(): void {
  inbox.mails.push({ id: inbox.mails.length + 1, from: '高橋様', read: false })
}

function rename(): void {
  inbox.owner = '田中 弁護士'
}
</script>

<template>
  <div class="inbox">
    <h2>{{ inbox.owner }} の受信箱</h2>

    <p>お知らせ <span v-if="unread > 0" class="badge">{{ unread }}</span></p>
    <button @click="readAll">お知らせを既読にする</button>

    <p>未読メール: {{ inbox.mails.length }} 件中 {{ unreadMails() }} 件</p>
    <ul>
      <li v-for="m in inbox.mails" :key="m.id">{{ m.from }}</li>
    </ul>
    <button @click="addMail">メールを受信</button>
    <button @click="rename">担当を変更</button>
  </div>
</template>

<style scoped>
.badge { background: #e33; color: #fff; border-radius: 99px; padding: 0 8px; }
</style>
`,
  }, (v, c) => {
    const p = nc(v[A]);
    const fn = (re) => (p.match(re) || [])[1] || '';
    return [
      T('InboxPage.vue で、unread を ref<number>(3) にして、値が変わったら画面も変わるようにする', 1, /const\s+unread\s*=\s*ref\s*(<\s*number\s*>)?\s*\(\s*3\s*\)/.test(p), ['let の普通の変数は、変わっても Vue は気づけない。ref で包む。', C('const unread = ref<number>(3)')], at(A, ['// ① '])),
      T('InboxPage.vue で、readAll() を書き、unread.value を 0 にする（script では .value を付ける）', 1, /unread\.value\s*=\s*0/.test(fn(/function\s+readAll\s*\(\s*\)[^{]*\{([\s\S]*?)\n\}/)), ['ref の中身を書き換えるのは .value。template では .value は付けない。', C('function readAll(): void {\n  unread.value = 0\n}', 'ts')], at(A, ['// ② '])),
      T('InboxPage.vue で、お知らせのバッジに {{ unread }} を出し、0 のときは v-if で消す（画面：3）', 1, /<span[^>]*v-if\s*=\s*"unread\s*(>\s*0|!==?\s*0)?"[^>]*class\s*=\s*"badge"[^>]*>\s*\{\{\s*unread\s*\}\}|<span[^>]*class\s*=\s*"badge"[^>]*v-if\s*=\s*"unread\s*(>\s*0|!==?\s*0)?"[^>]*>\s*\{\{\s*unread\s*\}\}/.test(p) && ($q(c, '#app .badge') || { textContent: '' }).textContent.trim() === '3', ['ref が変わると、template の {{ }} も v-if も追従する。', C('<span v-if="unread > 0" class="badge">{{ unread }}</span>')], at(A, ['<!-- ③ '])),
      T('InboxPage.vue で、inbox を reactive<Inbox>({ … }) で作る（オブジェクトは .value なしで書き換えられる）', 2, /const\s+inbox\s*=\s*reactive\s*<\s*Inbox\s*>\s*\(/.test(p), ['ref は 1 つの値、reactive はオブジェクトまるごと。', C("const inbox = reactive<Inbox>({\n  owner: '佐藤 弁護士',\n  mails: [ … ],\n})")], at(A, ['// ④ '])),
      T('InboxPage.vue で、unreadMails(): number を作り（read が false の数）、「未読メール: 2 件中 1 件」と表示する', 2, /function\s+unreadMails\s*\(\s*\)\s*:\s*number|const\s+unreadMails\s*=\s*\(\s*\)\s*:\s*number\s*=>/.test(p) && /inbox\.mails\.filter\s*\(.*!\s*\w+\.read/.test(p) && /\{\{\s*unreadMails\(\)\s*\}\}/.test(p) && /未読メール:\s*2\s*件中\s*1\s*件/.test(appText(c)), ['元のデータ（inbox.mails）が変われば、画面が描き直されるときに数え直される。', C('function unreadMails(): number {\n  return inbox.mails.filter((m) => !m.read).length\n}', 'ts')], at(A, ['// ⑤ ', '<!-- ⑤ '])),
      T('InboxPage.vue で、const { owner } = inbox をやめ、template で {{ inbox.owner }} と書く（「担当を変更」で見出しが変わる）', 3, !/const\s*\{\s*owner\s*\}\s*=\s*inbox/.test(p) && /\{\{\s*inbox\.owner\s*\}\}/.test(p) && /inbox\.owner\s*=/.test(p) && /佐藤 弁護士/.test(appText(c)), ['reactive から分割代入すると、ただの文字列になってつながりが切れる。inbox.owner のまま使えば、変更が画面に届く。', C('<h2>{{ inbox.owner }} の受信箱</h2>')], at(A, ['// ⑥ '])),
    ];
  }, 'InboxPage.vue', { [A]: 'src/pages/InboxPage.vue' },
  { [A]: '受信箱ページ。ref と reactive の違い' });
})();
