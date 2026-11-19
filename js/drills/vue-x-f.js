/* 練習：補足 x-vue-ref「ref と .value のひみつ」（シーン 1・3・4）。
   1 つの .vue だけ。vue-basics で習った ref / @click / v-if / v-model（ふつうの input）だけを使う。
   子コンポーネント・props・emit・computed・watch は使わない。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueDrillTools) return;
  const D = (K.drills = K.drills || {});
  const { multi, T, appText, $q, $all } = K.vueDrillTools;

  const F = (s) => s.replace(/^\n/, '');
  const C = (code, lang) => ({ code: F(code), lang: lang || 'ts' });
  const A = (file, ...find) => ({ file, find });
  /* コメントを除いた中身（TODO コメントに答えが書いてあっても、正解扱いにならないように） */
  const nc = (s) => String(s || '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const tpl = (s) => { const m = nc(s).match(/<template>([\s\S]*)<\/template>/); return m ? m[1] : ''; };
  const scr = (s) => { const m = nc(s).match(/<script[^>]*>([\s\S]*?)<\/script>/); return m ? m[1] : ''; };
  const set = (title, files, sol, tasks, o) => {
    const fs = {}, ss = {};
    Object.keys(files).forEach((k) => { fs[k] = F(files[k]); });
    Object.keys(sol).forEach((k) => { ss[k] = F(sol[k]); });
    (D['x-vue-ref'] = D['x-vue-ref'] || {})[title] = multi(fs, ss, tasks, Object.assign({ height: 340 }, o || {}));
  };
  /* script 内の「関数 name の中身（{ } の中）」を取り出す */
  const body = (s, name) => { const m = scr(s).match(new RegExp('(?:const|let)\\s+' + name + '\\s*=\\s*(?:\\([^)]*\\)|\\w+)\\s*(?::\\s*[\\w<>\\[\\]| ]+)?\\s*=>\\s*\\{([\\s\\S]*?)\\n\\}') ) || scr(s).match(new RegExp('function\\s+' + name + '\\s*\\([^)]*\\)\\s*(?::\\s*[\\w<>\\[\\]| ]+)?\\s*\\{([\\s\\S]*?)\\n\\}')); return m ? m[1] : ''; };
  const btnClick = (s, fn) => new RegExp('<button[^>]*@click\\s*=\\s*["\']' + fn + '(\\(\\))?["\']').test(tpl(s));

  /* ===================== 1. ふつうの変数だと、なぜダメ？ ===================== */
  set('ふつうの変数だと、なぜダメ？', {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

// ① 残り枠 slots を、ref<number>(5) にする（今は ふつうの変数 なので、画面が変わらない）
let slots: number = 5

// ② 予約を受ける関数 reserve を作り、slots を 1 減らす（ref は script では .value を付ける）

// ④ 満席かどうか full を ref<boolean>(false) で作り、reserve の中で slots が 0 になったら true にする

// ⑥ 予約を取り消す関数 cancel を作る（slots を 1 増やし、full を false に戻す。最大 5 枠まで）
</script>

<template>
  <h2>初回相談の予約枠</h2>
  <p>残り {{ slots }} 枠</p>
  <!-- ③ 「予約」ボタンを置き、@click で reserve を呼ぶ -->
  <!-- ⑤ full が true のときだけ「満席です」を出す（v-if。template では .value を付けない） -->
  <!-- ⑥ 「取り消し」ボタンを置き、@click で cancel を呼ぶ -->
</template>
`,
  }, {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

const slots = ref<number>(5)
const full = ref<boolean>(false)

const reserve = (): void => {
  slots.value--
  if (slots.value === 0) {
    full.value = true
  }
}

const cancel = (): void => {
  if (slots.value < 5) {
    slots.value++
    full.value = false
  }
}
</script>

<template>
  <h2>初回相談の予約枠</h2>
  <p>残り {{ slots }} 枠</p>
  <button @click="reserve">予約</button>
  <p v-if="full">満席です</p>
  <button @click="cancel">取り消し</button>
</template>
`,
  }, (v, c) => {
    const f = v['App.vue'], t = tpl(f), s = scr(f);
    const reserve = body(f, 'reserve'), cancel = body(f, 'cancel');
    return [
      T('SlotCounter.vue の script で、slots を ref<number>(5) にする（画面：残り 5 枠）', 1,
        /const\s+slots\s*=\s*ref\s*(<\s*number\s*>)?\s*\(\s*5\s*\)/.test(s) && /残り\s*5\s*枠/.test(appText(c)),
        ['ふつうの変数（let）は、書き換えても Vue に伝わらない。ref の箱に入れると、Vue が見張れる。', C('const slots = ref<number>(5)')], A('App.vue', '① 残り枠')),
      T('SlotCounter.vue の script で、reserve 関数を作り、slots を 1 減らす（.value を付ける）', 1,
        /slots\.value\s*(--|-=\s*1|=\s*slots\.value\s*-\s*1)/.test(reserve) && !/(^|[^.\w])slots\s*(--|-=)/.test(reserve),
        ['script の中で ref の数字を変えるときは、必ず .value を付ける。', C('const reserve = (): void => {\n  slots.value--\n}')], A('App.vue', '② 予約を受ける')),
      T('SlotCounter.vue の template で、「予約」ボタンを @click で reserve につなぐ（画面：予約ボタンが出る）', 1,
        btnClick(f, 'reserve') && !!$q(c, '#app button'),
        ['ボタンのクリックは @click。関数の名前だけ書けば呼ばれる。', C('<button @click="reserve">予約</button>', 'vue')], A('App.vue', '③ 「予約」ボタン')),
      T('SlotCounter.vue の script で、full を ref<boolean>(false) にし、slots が 0 になったら true にする', 2,
        /const\s+full\s*=\s*ref\s*(<\s*boolean\s*>)?\s*\(\s*false\s*\)/.test(s) && /slots\.value\s*(===|<=|==)\s*0/.test(reserve) && /full\.value\s*=\s*true/.test(reserve),
        ['まず full を ref<boolean>(false) で用意する（最初は満席ではない）。', 'reserve の最後で、残りが 0 かどうかを調べる。0 なら full.value を true に。', C('if (slots.value === 0) {\n  full.value = true\n}')], A('App.vue', '④ 満席かどうか')),
      T('SlotCounter.vue の template で、full が true のときだけ「満席です」を出す（v-if。.value は付けない）', 2,
        /<p[^>]*v-if\s*=\s*["']full["'][^>]*>\s*満席です/.test(t) && !/\.value/.test(t),
        ['出し分けは v-if。template では ref の .value を Vue が自動で外してくれる。', C('<p v-if="full">満席です</p>', 'vue')], A('App.vue', '⑤ full が true')),
      T('SlotCounter.vue の script で、cancel 関数を作り、5 枠未満のとき slots を 1 増やして full を false に戻す（取り消しボタンにつなぐ）', 3,
        /slots\.value\s*<\s*5/.test(cancel) && /slots\.value\s*(\+\+|\+=\s*1)/.test(cancel) && /full\.value\s*=\s*false/.test(cancel) && btnClick(f, 'cancel'),
        ['増やす前に、5 枠を超えないかを if で確かめる。', 'ref を書き換えるのは全部 .value。full も同じ。', C('const cancel = (): void => {\n  if (slots.value < 5) {\n    slots.value++\n    full.value = false\n  }\n}'), C('<button @click="cancel">取り消し</button>', 'vue')], A('App.vue', '⑥ 予約を取り消す', '⑥ 「取り消し」')),
    ];
  }, {
    alias: { 'App.vue': 'SlotCounter.vue' },
    paths: { 'App.vue': 'src/components/SlotCounter.vue' },
    fileNotes: { 'App.vue': '予約枠の画面。変数を ref にしないと、画面が変わらない' },
  });

  /* ===================== 3. なぜ .value が必要？ ===================== */
  set('なぜ .value が必要？', {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

// ① 相談メモ memo を ref<string>('') にする（今は ふつうの変数。入力しても画面は変わらない）
let memo: string = ''

// ③ memo を空にする関数 clear を作る（script では memo.value = ''）

// ⑤ 文字数を返す関数 count(): number を作る（memo.value.length を返す）

// ⑥ あいさつを足す関数 addGreeting を作る（今の memo.value のあとに「お世話になっております。」を足す）
</script>

<template>
  <h2>相談メモ</h2>
  <!-- ② textarea を memo とつなぐ（v-model="memo"。template では .value を付けない） -->
  <textarea rows="3" placeholder="相談内容を入力"></textarea>
  <!-- ⑤ 「{{ count() }} 文字」と表示する -->
  <p>（文字数）</p>
  <!-- ④ 「クリア」ボタンを置き、@click で clear を呼ぶ -->
  <!-- ⑥ 「あいさつを入れる」ボタンを置き、@click で addGreeting を呼ぶ -->
</template>
`,
  }, {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

const memo = ref<string>('')

const clear = (): void => {
  memo.value = ''
}

const count = (): number => {
  return memo.value.length
}

const addGreeting = (): void => {
  memo.value = memo.value + 'お世話になっております。'
}
</script>

<template>
  <h2>相談メモ</h2>
  <textarea v-model="memo" rows="3" placeholder="相談内容を入力"></textarea>
  <p>{{ count() }} 文字</p>
  <button @click="clear">クリア</button>
  <button @click="addGreeting">あいさつを入れる</button>
</template>
`,
  }, (v, c) => {
    const f = v['App.vue'], t = tpl(f), s = scr(f);
    const clear = body(f, 'clear'), count = body(f, 'count'), greet = body(f, 'addGreeting');
    const ta = $q(c, '#app textarea');
    return [
      T('ConsultMemo.vue の script で、memo を ref<string>(\'\') にする', 1,
        /const\s+memo\s*=\s*ref\s*(<\s*string\s*>)?\s*\(\s*(''|"")\s*\)/.test(s),
        ['ふつうの変数は、入力されても Vue に伝わらない。ref の箱（オブジェクト）にしておくと、.value の出入口で変化を見張れる。', C("const memo = ref<string>('')")], A('App.vue', '① 相談メモ')),
      T('ConsultMemo.vue の template で、textarea を v-model="memo" でつなぐ（.value は付けない）', 1,
        /<textarea[^>]*v-model\s*=\s*["']memo["']/.test(t) && !/memo\.value/.test(t) && !!ta,
        ['入力欄と変数をつなぐのは v-model。template では ref の名前だけ書く。', C('<textarea v-model="memo" rows="3"></textarea>', 'vue')], A('App.vue', '② textarea')),
      T('ConsultMemo.vue の script で、clear 関数を作り、memo を空にする（memo.value に代入）', 1,
        /memo\.value\s*=\s*(''|"")/.test(clear),
        ['ref に代入するときも .value。ここが「箱の中身を入れ替える」場所（setter の門）。', C("const clear = (): void => {\n  memo.value = ''\n}")], A('App.vue', '③ memo を空に')),
      T('ConsultMemo.vue の template で、「クリア」ボタンを @click で clear につなぐ（画面：クリアボタンが出る）', 2,
        btnClick(f, 'clear') && /クリア/.test(appText(c)),
        ['@click に関数の名前を書く。', C('<button @click="clear">クリア</button>', 'vue')], A('App.vue', '④ 「クリア」')),
      T('ConsultMemo.vue で、count 関数が memo.value.length を返し、template に「{{ count() }} 文字」と出す（画面：0 文字）', 2,
        /memo\.value\.length/.test(count) && /\{\{\s*count\(\s*\)\s*\}\}\s*文字/.test(t) && /0\s*文字/.test(appText(c)),
        ['script で値を読むときも .value（getter の門）。文字数は length。', C('const count = (): number => {\n  return memo.value.length\n}'), C('<p>{{ count() }} 文字</p>', 'vue')], A('App.vue', '⑤ 文字数を返す', '⑤ 「{{ count() }}')),
      T('ConsultMemo.vue で、addGreeting 関数が今の memo.value のあとに「お世話になっております。」を足す（ボタンにつなぐ）', 3,
        /memo\.value\s*(\+=|=\s*memo\.value\s*\+)\s*['"]お世話になっております。['"]/.test(greet) && btnClick(f, 'addGreeting'),
        ['読んで（getter）、足して、書く（setter）。両方 .value。', C("memo.value = memo.value + 'お世話になっております。'"), C('<button @click="addGreeting">あいさつを入れる</button>', 'vue')], A('App.vue', '⑥ あいさつを足す', '⑥ 「あいさつを入れる」')),
    ];
  }, {
    alias: { 'App.vue': 'ConsultMemo.vue' },
    paths: { 'App.vue': 'src/components/ConsultMemo.vue' },
    fileNotes: { 'App.vue': '相談メモ欄。script では memo.value、template では memo' },
  });

  /* ===================== 4. template では .value が要らないのはなぜ？ ===================== */
  set('template では .value が要らないのはなぜ？', {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

const waiting = ref<number>(3)
const message = ref<string>('お待ちください')
const board = { waiting }

// ⑥ 呼び出し済みの番号を入れる called を ref<number[]>([]) で作る

const callNext = (): void => {
  waiting--
  // ④ waiting.value が 0 になったら、message.value を '本日の受付は終了しました' にする
  // ⑥ 減らす前に、called.value.push(waiting.value) で番号を記録する
}
</script>

<template>
  <h2>来所の待ち状況</h2>
  <p>待ち {{ waiting.value }} 件</p>
  <p>{{ message }}</p>
  <p>次の番号：{{ board.waiting + 1 }}</p>
  <!-- ③ 「次の方をお呼びする」ボタンを置き、@click で callNext を呼ぶ -->
  <!-- ⑥ called を v-for で並べる（li に「◯番」。template では .value を付けない） -->
</template>
`,
  }, {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

const waiting = ref<number>(3)
const message = ref<string>('お待ちください')
const board = { waiting }
const called = ref<number[]>([])

const callNext = (): void => {
  called.value.push(waiting.value)
  waiting.value--
  if (waiting.value === 0) {
    message.value = '本日の受付は終了しました'
  }
}
</script>

<template>
  <h2>来所の待ち状況</h2>
  <p>待ち {{ waiting }} 件</p>
  <p>{{ message }}</p>
  <p>次の番号：{{ board.waiting.value + 1 }}</p>
  <button @click="callNext">次の方をお呼びする</button>
  <ul>
    <li v-for="n in called" :key="n">{{ n }}番</li>
  </ul>
</template>
`,
  }, (v, c) => {
    const f = v['App.vue'], t = tpl(f), s = scr(f);
    const next = body(f, 'callNext');
    return [
      T('WaitingBoard.vue の template で、{{ waiting.value }} を {{ waiting }} に直す（画面：待ち 3 件）', 1,
        /\{\{\s*waiting\s*\}\}/.test(t) && !/\{\{\s*waiting\.value\s*\}\}/.test(t) && /待ち\s*3\s*件/.test(appText(c)),
        ['template では、トップレベルの ref を Vue が自動で .value に直してくれる。だから .value は要らない。', C('<p>待ち {{ waiting }} 件</p>', 'vue')], A('App.vue', '{{ waiting.value }}')),
      T('WaitingBoard.vue の script で、callNext の waiting-- を waiting.value-- に直す', 1,
        /waiting\.value\s*(--|-=\s*1|=\s*waiting\.value\s*-\s*1)/.test(next) && !/(^|[^.\w])waiting\s*(--|-=)/.test(next),
        ['script では自動で外れない。箱（ref）を開けて、中身を変える。', C('waiting.value--')], A('App.vue', 'waiting--')),
      T('WaitingBoard.vue の template で、「次の方をお呼びする」ボタンを @click で callNext につなぐ（画面：ボタンが出る）', 1,
        btnClick(f, 'callNext') && /次の方をお呼びする/.test(appText(c)),
        ['@click に関数の名前を書く。', C('<button @click="callNext">次の方をお呼びする</button>', 'vue')], A('App.vue', '③ 「次の方')),
      T('WaitingBoard.vue の callNext で、waiting.value が 0 になったら message.value を「本日の受付は終了しました」にする', 2,
        /if\s*\(\s*waiting\.value\s*(===|==|<=)\s*0\s*\)/.test(next) && /message\.value\s*=\s*['"]本日の受付は終了しました['"]/.test(next),
        ['減らしたあとの waiting.value を if で調べる。', C("if (waiting.value === 0) {\n  message.value = '本日の受付は終了しました'\n}")], A('App.vue', '④ waiting.value が 0')),
      T('WaitingBoard.vue の template で、board.waiting + 1 を board.waiting.value + 1 に直す（画面：次の番号：4）', 2,
        /board\.waiting\.value\s*\+\s*1/.test(t) && /次の番号：\s*4/.test(appText(c)),
        ['自動で外れるのは、script setup の一番外側の ref だけ。ふつうの object（board）の中の ref は、そのまま箱。', C('<p>次の番号：{{ board.waiting.value + 1 }}</p>', 'vue')], A('App.vue', 'board.waiting + 1')),
      T('WaitingBoard.vue で、called を ref<number[]>([]) で作り、callNext で番号を push して、template の v-for で「◯番」と並べる', 3,
        /const\s+called\s*=\s*ref\s*(<\s*number\s*\[\s*\]\s*>)?\s*\(\s*\[\s*\]\s*\)/.test(s) && /called\.value\.push\(\s*waiting\.value\s*\)/.test(next) && /v-for\s*=\s*["']\s*\w+\s+in\s+called\s*["']/.test(t) && !/called\.value/.test(t),
        ['script では called.value.push(…)、template では called だけ。', 'push する番号は、減らす前の waiting.value。', C('called.value.push(waiting.value)\nwaiting.value--'), C('<li v-for="n in called" :key="n">{{ n }}番</li>', 'vue')], A('App.vue', '⑥ 呼び出し済み', '⑥ 減らす前に', '⑥ called を v-for')),
    ];
  }, {
    alias: { 'App.vue': 'WaitingBoard.vue' },
    paths: { 'App.vue': 'src/components/WaitingBoard.vue' },
    fileNotes: { 'App.vue': '来所の待ち状況。script は .value、template は .value なし' },
  });
})();
