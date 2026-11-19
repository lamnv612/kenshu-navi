/* 練習：補足 x-vue-arrow「三項演算子と矢印関数」（シーン 2・3・4・6）。
   1 つの .vue だけ。ref / {{ }} / @click / :class / :disabled / v-if / 三項演算子 / 矢印関数 / 配列の filter・map だけを使う。
   子コンポーネント・props・emit・computed・watch・onMounted は使わない。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueDrillTools) return;
  const D = (K.drills = K.drills || {});
  const { multi, T, appText, $q } = K.vueDrillTools;

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
    (D['x-vue-arrow'] = D['x-vue-arrow'] || {})[title] = multi(fs, ss, tasks, Object.assign({ height: 340 }, o || {}));
  };

  /* ---------- 式を、本当に動かして確かめる道具（書き方が違っても、結果が合えば正解） ---------- */
  const BAD = {};
  const strip = (s) => s
    .replace(/\)\s*:\s*(?:number|string|boolean|void|any|Case\[\]|Case|number\[\]|string\[\])\s*=>/g, ') =>')
    .replace(/(\b\w+)\s*:\s*(?:number|string|boolean|void|any|Case\[\]|Case|number\[\]|string\[\])(?=\s*[,)])/g, '$1');
  const ev = (expr, scope) => {
    try { const k = Object.keys(scope || {}); return new Function(...k, 'return (' + strip(String(expr)) + ')')(...k.map((x) => scope[x])); } catch (e) { return BAD; }
  };
  /* script の中の「const name = …」の右辺（改行をまたぐ { } ( ) も、閉じるところまで） */
  const rhs = (s, name) => {
    const t = scr(s), m = new RegExp('(?:const|let)\\s+' + name + '\\s*(?::[^=\\n]+)?=\\s*').exec(t);
    if (!m) return null;
    let i = m.index + m[0].length, d = 0, out = '', q = '';
    for (; i < t.length; i++) {
      const ch = t[i];
      if (q) { out += ch; if (ch === q && t[i - 1] !== '\\') q = ''; continue; }
      if (ch === '"' || ch === "'" || ch === '`') { q = ch; out += ch; continue; }
      if ('([{'.includes(ch)) d++; else if (')]}'.includes(ch)) d--;
      if (d === 0 && (ch === '\n' || ch === ';') && out.trim()) break;
      out += ch;
    }
    return out.trim();
  };
  const fn = (s, name, scope) => { const r = rhs(s, name); if (r == null) return null; const f = ev(r, scope); return typeof f === 'function' ? f : null; };
  const val = (s, name, scope) => { const r = rhs(s, name); return r == null ? BAD : ev(r, scope); };
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  /* template のタグ・式を取り出す */
  const TAG = '<(?:"[^"]*"|\'[^\']*\'|[^>"\'])*>';
  const tagOf = (s, re) => { const m = new RegExp('<\\w+(?=[\\s>])(?:"[^"]*"|\'[^\']*\'|[^>"\'])*' + re + '(?:"[^"]*"|\'[^\']*\'|[^>"\'])*>').exec(tpl(s)); return m ? m[0] : ''; };
  const attrOf = (tag, name) => { const m = new RegExp('(?:^|\\s)' + name.replace(/[:@]/g, '\\$&') + '\\s*=\\s*"([^"]*)"').exec(tag); return m ? m[1] : null; };
  const inner = (s, re) => { const m = new RegExp('(<(\\w+)(?=[\\s>])(?:"[^"]*"|\'[^\']*\'|[^>"\'])*' + re + '(?:"[^"]*"|\'[^\']*\'|[^>"\'])*>)([\\s\\S]*?)<\\/\\2>').exec(tpl(s)); return m ? m[3] : ''; };
  const mustaches = (html) => [...String(html).matchAll(/\{\{([\s\S]*?)\}\}/g)].map((m) => m[1].trim());
  void TAG;
  const bodyOf = (s, name) => { const r = rhs(s, name); return r || ''; };

  /* ===================================================================
     2. if 文だと、こんなに長い（SlotStatus.vue）
     =================================================================== */
  const SLOT_STYLE = `
<style>
.slot { padding: 8px 12px; border: 2px solid #ccc; border-radius: 8px; margin: 8px 0; }
.is-urgent { border-color: #e5484d; background: #fff0f0; }
.is-full { border-color: #888; background: #eee; color: #666; }
</style>
`;
  set('if 文だと、こんなに長い', {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

const slots = ref<number>(1)

// ⑤ 予約する関数 reserve を、矢印関数で作る（slots が 0 より大きいときだけ 1 減らす。.value を付ける）
</script>

<template>
  <h2>初回相談の予約枠</h2>

  <!-- ① 状態の文字を、三項演算子の 1 行にする（0 枠なら「満席」、それ以外は「受付中」）。今は v-if / v-else の 2 行 -->
  <p class="status">
    <span v-if="slots === 0">満席</span>
    <span v-else>受付中</span>
  </p>

  <!-- ② 残りが 1 枠以下のとき、class に is-urgent が付くようにする（:class と三項演算子） -->
  <div class="slot">残り {{ slots }} 枠</div>

  <!-- ③ 0 枠のとき、ボタンを押せなくする（:disabled。条件だけ書く） -->
  <!-- ④ ボタンの文字を、0 枠なら「満席」、それ以外は「予約する」にする（{{ }} と三項演算子） -->
  <!-- ⑤ ボタンを押すと reserve が動くようにする（@click） -->
  <!-- ⑥ ②の class を 3 段階にする（0 枠なら is-full、1 枠なら is-urgent、それ以外は空） -->
  <button class="reserve">予約する</button>
</template>
${SLOT_STYLE}`,
  }, {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

const slots = ref<number>(1)

const reserve = (): void => {
  if (slots.value > 0) {
    slots.value--
  }
}
</script>

<template>
  <h2>初回相談の予約枠</h2>

  <p class="status">{{ slots === 0 ? '満席' : '受付中' }}</p>

  <div class="slot" :class="slots === 0 ? 'is-full' : slots <= 1 ? 'is-urgent' : ''">残り {{ slots }} 枠</div>

  <button class="reserve" :disabled="slots === 0" @click="reserve">
    {{ slots === 0 ? '満席' : '予約する' }}
  </button>
</template>
${SLOT_STYLE}`,
  }, (v, c) => {
    const f = v['App.vue'], t = tpl(f);
    const status = inner(f, 'class="status"'), slotTag = tagOf(f, 'class="slot"'), btn = tagOf(f, 'class="reserve"'), btnIn = inner(f, 'class="reserve"');
    const clsExpr = attrOf(slotTag, ':class');
    const cls = (n) => (clsExpr == null ? BAD : String(ev(clsExpr, { slots: n })));
    const stOk = mustaches(status).some((e) => /\?/.test(e) && ev(e, { slots: 0 }) === '満席' && ev(e, { slots: 3 }) === '受付中');
    const disExpr = attrOf(btn, ':disabled');
    const reserve = bodyOf(f, 'reserve');
    return [
      T('SlotStatus.vue の template で、状態の文字を三項演算子の 1 行で書く（0 枠なら「満席」、それ以外は「受付中」。画面：受付中）', 1,
        stOk && !/v-else/.test(t) && /受付中/.test(($q(c, '.status') || { textContent: '' }).textContent),
        ['三項演算子は「条件 ? 本当のとき : ウソのとき」。{{ }} の中に書ける。', '「slots が 0 ？ 満席 : 受付中」と読む。v-if / v-else の 2 行は要らなくなる。', C("{{ slots === 0 ? '満席' : '受付中' }}", 'vue')], A('App.vue', '① 状態の文字')),
      T('SlotStatus.vue の template で、残りが 1 枠以下のとき class に is-urgent が付くようにする（:class と三項演算子。画面：赤い枠）', 1,
        clsExpr != null && /\?/.test(clsExpr) && /is-urgent/.test(cls(1)) && !/is-urgent/.test(cls(3)) && !!$q(c, '.slot.is-urgent'),
        ['class の切り替えも、三項演算子 1 行で書ける。属性の前に : を付けると、中に式が書ける。', ':class="条件 ? \'付けたい class\' : \'\'"　（付けないときは空の文字 \'\'）', C(`<div class="slot" :class="slots <= 1 ? 'is-urgent' : ''">`, 'vue')], A('App.vue', '② 残りが 1 枠以下')),
      T('SlotStatus.vue の template で、0 枠のときボタンを押せなくする（:disabled に条件だけ書く。? true : false は要らない）', 1,
        disExpr != null && !/\?/.test(disExpr) && ev(disExpr, { slots: 0 }) === true && ev(disExpr, { slots: 1 }) === false,
        [':disabled には true / false が入る。条件そのものが true / false なので、三項演算子は要らない。', C('<button class="reserve" :disabled="slots === 0">', 'vue')], A('App.vue', '③ 0 枠のとき')),
      T('SlotStatus.vue の template で、ボタンの文字を三項演算子で書く（0 枠なら「満席」、それ以外は「予約する」。画面：予約する）', 2,
        mustaches(btnIn).some((e) => /\?/.test(e) && ev(e, { slots: 0 }) === '満席' && ev(e, { slots: 3 }) === '予約する') && /予約する/.test(($q(c, '.reserve') || { textContent: '' }).textContent),
        ['ボタンの中の文字も、{{ }} と三項演算子で切り替えられる。', C("<button class=\"reserve\">\n  {{ slots === 0 ? '満席' : '予約する' }}\n</button>", 'vue')], A('App.vue', '④ ボタンの文字')),
      T('SlotStatus.vue の script で、reserve を矢印関数で作り、ボタンの @click につなぐ（0 より大きいときだけ 1 減らす）', 2,
        /const\s+reserve\s*=\s*\(\s*\)\s*(:\s*void\s*)?=>/.test(scr(f)) && /slots\.value\s*(--|-=\s*1)/.test(reserve) && /slots\.value\s*(>\s*0|!==?\s*0|>=\s*1)/.test(reserve) && /@click\s*=\s*["']reserve(\(\))?["']/.test(btn),
        ['矢印関数：const 名前 = (): void => { … }。「（受け取りなし）→ これをする」と読む。', '減らす前に、0 より大きいかを if で確かめる。ref は script では .value。', C('const reserve = (): void => {\n  if (slots.value > 0) {\n    slots.value--\n  }\n}'), C('<button class="reserve" @click="reserve">', 'vue')], A('App.vue', '⑤ 予約する関数', '⑤ ボタンを押すと')),
      T('SlotStatus.vue の template で、class を 3 段階にする（0 枠なら is-full、1 枠なら is-urgent、それ以外は空。三項演算子をつなぐ）', 3,
        clsExpr != null && cls(0).includes('is-full') && cls(1).includes('is-urgent') && !cls(1).includes('is-full') && !/is-/.test(cls(3)),
        ['三項演算子は「そうでなければ」の側に、もう 1 つ三項演算子を続けて書ける（else if のイメージ）。', '「0 枠なら is-full、そうでなくて 1 枠以下なら is-urgent、それ以外は空」。', C(`:class="slots === 0 ? 'is-full' : slots <= 1 ? 'is-urgent' : ''"`, 'vue')], A('App.vue', '⑥ ②の class')),
    ];
  }, {
    alias: { 'App.vue': 'SlotStatus.vue' },
    paths: { 'App.vue': 'src/components/SlotStatus.vue' },
    fileNotes: { 'App.vue': '予約枠の表示。if / else を、三項演算子 1 行にする' },
  });

  /* ===================================================================
     3. テンプレートでの使いどころ（BookingPanel.vue）
     =================================================================== */
  set('テンプレートでの使いどころ', {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

const online = ref<boolean>(true)
const slots = ref<number>(2)
const vip = ref<boolean>(false)

// ⑤ 状態の文字を返す関数 statusLabel を、矢印関数で作る（満席 / 優先受付 / 受付中）
// ⑥ 相談方法を切り替える関数 toggleMode を、矢印関数で作る（online.value を反転する）
</script>

<template>
  <h2>初回相談の予約</h2>

  <!-- ① 相談方法の文字を、{{ }} と三項演算子で出す（online なら「オンライン」、違えば「来所」） -->
  <!-- ② その p の class も、三項演算子で切り替える（online なら is-online、違えば is-office） -->
  <p class="mode">相談方法：</p>

  <!-- ③ 空きがあるとき（slots > 0）だけフォームを出し、満席のときだけ下の文を出す（v-if / v-else。ブロックごとの出し分け） -->
  <form class="reserve">
    <input placeholder="お名前">
    <button type="button" class="send">予約する</button>
  </form>
  <p class="full">満席です。キャンセル待ちはこちら</p>

  <!-- ④ キャンセル待ちは「空きがあるとき押せない」。? true : false をやめて、条件だけにする -->
  <button type="button" class="wait" :disabled="slots > 0 ? true : false">キャンセル待ちに登録</button>

  <!-- ⑤ 状態の文字：入れ子の三項演算子をやめて、statusLabel() を呼ぶ形にする -->
  <p class="state">状態：{{ vip ? slots === 0 ? '満席' : '優先受付' : slots === 0 ? '満席' : '受付中' }}</p>

  <!-- ⑥ 「切り替え」ボタンを置き、押すと toggleMode が動くようにする（@click） -->
</template>

<style>
.is-online { color: #0a7d5a; }
.is-office { color: #b45309; }
</style>
`,
  }, {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

const online = ref<boolean>(true)
const slots = ref<number>(2)
const vip = ref<boolean>(false)

const statusLabel = (): string => {
  if (slots.value === 0) return '満席'
  return vip.value ? '優先受付' : '受付中'
}

const toggleMode = (): void => {
  online.value = !online.value
}
</script>

<template>
  <h2>初回相談の予約</h2>

  <p class="mode" :class="online ? 'is-online' : 'is-office'">相談方法：{{ online ? 'オンライン' : '来所' }}</p>

  <form class="reserve" v-if="slots > 0">
    <input placeholder="お名前">
    <button type="button" class="send">予約する</button>
  </form>
  <p class="full" v-else>満席です。キャンセル待ちはこちら</p>

  <button type="button" class="wait" :disabled="slots > 0">キャンセル待ちに登録</button>

  <p class="state">状態：{{ statusLabel() }}</p>

  <button type="button" class="toggle" @click="toggleMode">切り替え</button>
</template>

<style>
.is-online { color: #0a7d5a; }
.is-office { color: #b45309; }
</style>
`,
  }, (v, c) => {
    const f = v['App.vue'], t = tpl(f);
    const mode = tagOf(f, 'class="mode"'), modeIn = inner(f, 'class="mode"');
    const clsE = attrOf(mode, ':class');
    const formTag = tagOf(f, 'class="reserve"'), fullTag = tagOf(f, 'class="full"'), waitTag = tagOf(f, 'class="wait"');
    const vifE = attrOf(formTag, 'v-if'), dis = attrOf(waitTag, ':disabled');
    const stateIn = inner(f, 'class="state"');
    const sl = fn(f, 'statusLabel', { slots: { value: 0 }, vip: { value: false } });
    const lab = (s, p) => { try { return fn(f, 'statusLabel', { slots: { value: s }, vip: { value: p } })(); } catch (e) { return BAD; } };
    const tog = fn(f, 'toggleMode', { online: { value: true } });
    const toggleBody = bodyOf(f, 'toggleMode');
    return [
      T('BookingPanel.vue の template で、相談方法の文字を三項演算子で出す（online なら「オンライン」、違えば「来所」。画面：相談方法：オンライン）', 1,
        mustaches(modeIn).some((e) => /\?/.test(e) && ev(e, { online: true }) === 'オンライン' && ev(e, { online: false }) === '来所') && /オンライン/.test(($q(c, '.mode') || { textContent: '' }).textContent),
        ['短い「文字」の切り替えは、三項演算子で十分。{{ }} の中に書ける。', C("相談方法：{{ online ? 'オンライン' : '来所' }}", 'vue')], A('App.vue', '① 相談方法の文字')),
      T('BookingPanel.vue の template で、相談方法の p に :class を付ける（online なら is-online、違えば is-office。三項演算子。画面：緑の文字）', 1,
        clsE != null && /is-online/.test(String(ev(clsE, { online: true }))) && /is-office/.test(String(ev(clsE, { online: false }))) && !!$q(c, '.mode.is-online'),
        ['class の切り替えも三項演算子 1 行。:class の中に書く。', C(`<p class="mode" :class="online ? 'is-online' : 'is-office'">`, 'vue')], A('App.vue', '② その p の class')),
      T('BookingPanel.vue の template で、フォームに v-if、満席の文に v-else を付ける（slots > 0 のときだけフォーム。ブロックごとの出し分け）', 1,
        vifE != null && ev(vifE, { slots: 2 }) === true && ev(vifE, { slots: 0 }) === false && /(^|\s)v-else(\s|=|>|$)/.test(fullTag) && !!$q(c, '.reserve') && !$q(c, '.full'),
        ['入力欄とボタンのように「要素ごと」出し入れするときは、三項演算子ではなく v-if / v-else。', 'v-else は、v-if の要素の すぐ後ろ に置く。', C('<form class="reserve" v-if="slots > 0">\n  …\n</form>\n<p class="full" v-else>満席です…</p>', 'vue')], A('App.vue', '③ 空きがあるとき')),
      T('BookingPanel.vue の template で、キャンセル待ちボタンの :disabled を条件だけにする（slots > 0。? true : false をやめる）', 2,
        dis != null && !/\?/.test(dis) && ev(dis, { slots: 2 }) === true && ev(dis, { slots: 0 }) === false,
        ['条件そのものが true / false なので、? true : false は要らない。', C('<button class="wait" :disabled="slots > 0">', 'vue')], A('App.vue', '④ キャンセル待ち')),
      T('BookingPanel.vue の script で、statusLabel を矢印関数で作り、template の入れ子の三項演算子を {{ statusLabel() }} にする', 2,
        !!sl && lab(0, true) === '満席' && lab(2, true) === '優先受付' && lab(2, false) === '受付中' && /statusLabel\s*\(\s*\)/.test(stateIn) && !/\?/.test(stateIn),
        ['入れ子の三項演算子は読みにくい。名前の付いた関数に分けると、template は 1 行で読める。', '満席なら「満席」を返し、そうでなければ vip で分ける。ref は script では .value。', C("const statusLabel = (): string => {\n  if (slots.value === 0) return '満席'\n  return vip.value ? '優先受付' : '受付中'\n}"), C('<p class="state">状態：{{ statusLabel() }}</p>', 'vue')], A('App.vue', '⑤ 状態の文字を返す', '⑤ 状態の文字：')),
      T('BookingPanel.vue の script で toggleMode（online を反転）を矢印関数で作り、「切り替え」ボタンの @click につなぐ（押すと文字と色が変わる）', 3,
        /const\s+toggleMode\s*=\s*\(\s*\)\s*(:\s*void\s*)?=>/.test(scr(f)) && !!tog && /online\.value\s*=\s*!\s*online\.value/.test(toggleBody) && /<button[^>]*@click\s*=\s*["']toggleMode(\(\))?["'][^>]*>/.test(t),
        ['切り替え = 今の値の反対を入れる。ref は script では .value。', 'true ⇄ false の反転は ! を付ける。', C('const toggleMode = (): void => {\n  online.value = !online.value\n}'), C('<button type="button" class="toggle" @click="toggleMode">切り替え</button>', 'vue')], A('App.vue', '⑥ 相談方法を切り替える', '⑥ 「切り替え」')),
    ];
  }, {
    alias: { 'App.vue': 'BookingPanel.vue' },
    paths: { 'App.vue': 'src/components/BookingPanel.vue' },
    fileNotes: { 'App.vue': '予約画面。短い値は三項演算子、ブロックごとは v-if' },
  });

  /* ===================================================================
     4. () => 123 の読み方（FeeCalculator.vue）
     =================================================================== */
  const FEE_TPL_HEAD = `
  <h2>相談料の計算</h2>
  <p>相談 <b>{{ count }}</b> 回</p>
  <button class="plus" @click="count++">＋1回</button>
  <p class="base">1 回：{{ baseFee() }} 円</p>
  <p class="price">合計：{{ price(count) }} 円</p>`;
  set('() => 123 の読み方', {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

interface Case {
  id: number
  title: string
  minutes: number
}

const count = ref<number>(2)

const cases: Case[] = [
  { id: 1, title: '離婚の相談', minutes: 30 },
  { id: 2, title: '相続の相談', minutes: 60 },
  { id: 3, title: '労働の相談', minutes: 90 },
]

// ① 1 回の相談料を返す関数 baseFee を、矢印関数（式だけ）に書き直す（5500 を返す）
const baseFee = function (): number {
  return 5500
}

// ② 回数 n の合計を返す関数 price を、矢印関数（式だけ）に書き直す（n * 5500）
const price = function (n: number): number {
  return n * 5500
}

// ③ 税込（1.1 倍。小数は Math.round で四捨五入）を返す矢印関数 withTax を作る（p を受け取る）

// ④ 60 分以上の案件だけを、filter と矢印関数で取り出す（今は全部）
const longCases: Case[] = cases

// ⑤ longCases の title だけを並べた配列を、map と矢印関数で作る
const titles: string[] = []

// ⑥ 関数を返す関数 makeFee を作り（unit を受け取り、n を受け取って n * unit を返す関数を返す）、hourly = makeFee(11000) を作る
</script>

<template>${FEE_TPL_HEAD}
  <!-- ③ 税込を <p class="tax"> に出す：{{ withTax(price(count)) }} 円 -->
  <p class="long">60 分以上：{{ longCases.length }} 件</p>
  <p class="titles">{{ titles.join('、') }}</p>
  <!-- ⑥ 1 時間制の料金を <p class="hourly"> に出す：{{ hourly(count) }} 円 -->
</template>
`,
  }, {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

interface Case {
  id: number
  title: string
  minutes: number
}

const count = ref<number>(2)

const cases: Case[] = [
  { id: 1, title: '離婚の相談', minutes: 30 },
  { id: 2, title: '相続の相談', minutes: 60 },
  { id: 3, title: '労働の相談', minutes: 90 },
]

const baseFee = (): number => 5500

const price = (n: number): number => n * 5500

const withTax = (p: number): number => Math.round(p * 1.1)

const longCases: Case[] = cases.filter((c) => c.minutes >= 60)

const titles: string[] = longCases.map((c) => c.title)

const makeFee = (unit: number) => (n: number): number => n * unit
const hourly = makeFee(11000)
</script>

<template>${FEE_TPL_HEAD}
  <p class="tax">税込：{{ withTax(price(count)) }} 円</p>
  <p class="long">60 分以上：{{ longCases.length }} 件</p>
  <p class="titles">{{ titles.join('、') }}</p>
  <p class="hourly">1 時間制：{{ hourly(count) }} 円</p>
</template>
`,
  }, (v, c) => {
    const f = v['App.vue'], t = tpl(f);
    const CASES = [{ id: 1, title: '離婚の相談', minutes: 30 }, { id: 2, title: '相続の相談', minutes: 60 }, { id: 3, title: '労働の相談', minutes: 90 }];
    const arrow = (name) => { const r = rhs(f, name); return r != null && /=>/.test(r) && !/^function\b/.test(r) && !/\breturn\b/.test(r); };
    const bf = fn(f, 'baseFee'), pr = fn(f, 'price'), wt = fn(f, 'withTax'), mf = fn(f, 'makeFee');
    const long = val(f, 'longCases', { cases: CASES }), tit = val(f, 'titles', { longCases: CASES.slice(1) });
    const txt = (s) => (($q(c, s) || { textContent: '' }).textContent || '').replace(/\s+/g, '');
    const mkOk = (() => { try { return mf(11000)(2) === 22000 && mf(100)(3) === 300; } catch (e) { return false; } })();
    return [
      T('FeeCalculator.vue の script で、baseFee を「5500 を返す矢印関数（式だけ）」に書き直す（() => 5500。画面：1 回：5500 円）', 1,
        arrow('baseFee') && !!bf && bf() === 5500 && !/\{/.test(rhs(f, 'baseFee') || '{') && /5500/.test(txt('.base')),
        ['function と return を消して、( ) のあとに => を置く。式が 1 つなら { } も要らない。', '「引数なしで、5500 を返す」と読む。', C('const baseFee = (): number => 5500')], A('App.vue', '① 1 回の相談料')),
      T('FeeCalculator.vue の script で、price を「n を受け取って n * 5500 を返す矢印関数（式だけ）」に書き直す（画面：合計：11000 円）', 1,
        arrow('price') && !!pr && pr(2) === 11000 && pr(3) === 16500 && !/\{/.test(rhs(f, 'price') || '{') && /11000/.test(txt('.price')),
        ['引数は ( ) の中に残す。function と return を消して => にする。', '「n を受け取って、n × 5500 を返す」と読む。', C('const price = (n: number): number => n * 5500')], A('App.vue', '② 回数 n の合計')),
      T('FeeCalculator.vue の script で、withTax を矢印関数で作り（p * 1.1 を四捨五入）、template の tax に出す（画面：税込：12100 円）', 1,
        arrow('withTax') && !!wt && wt(11000) === 12100 && wt(5500) === 6050 && /withTax\s*\(/.test(t) && /12100/.test(txt('.tax')),
        ['引数 p を受け取って、p に 1.1 を掛けて、Math.round で丸める。', '作ったら、template に {{ withTax(price(count)) }} を書く（コメントを外して使ってよい）。', C('const withTax = (p: number): number => Math.round(p * 1.1)'), C('<p class="tax">税込：{{ withTax(price(count)) }} 円</p>', 'vue')], A('App.vue', '③ 税込')),
      T('FeeCalculator.vue の script で、longCases を filter と矢印関数で作り、60 分以上の案件だけにする（画面：60 分以上：2 件）', 2,
        /\.filter\s*\(/.test(rhs(f, 'longCases') || '') && /=>/.test(rhs(f, 'longCases') || '') && same(long, CASES.slice(1)) && /2件/.test(txt('.long')),
        ['filter は、配列の 1 件ずつに「残すか？」を聞く。矢印関数が、その質問。', '「c の minutes が 60 以上なら残す」と読む。', C('const longCases: Case[] = cases.filter((c) => c.minutes >= 60)')], A('App.vue', '④ 60 分以上')),
      T('FeeCalculator.vue の script で、titles を map と矢印関数で作り、longCases の title だけの配列にする', 2,
        /\.map\s*\(/.test(rhs(f, 'titles') || '') && /=>/.test(rhs(f, 'titles') || '') && same(tit, ['相続の相談', '労働の相談']),
        ['map は、配列の 1 件ずつを「別の値」に変えて、新しい配列にする。', '「c を受け取って、c.title を返す」と読む。', C('const titles: string[] = longCases.map((c) => c.title)')], A('App.vue', '⑤ longCases')),
      T('FeeCalculator.vue の script で、makeFee（unit を受け取り、関数を返す）と hourly = makeFee(11000) を作り、template に出す（画面：1 時間制：22000 円）', 3,
        mkOk && /^makeFee\s*\(\s*11000\s*\)$/.test(rhs(f, 'hourly') || '') && /hourly\s*\(\s*count\s*\)/.test(t) && /22000/.test(txt('.hourly')),
        ['「関数を返す関数」は、矢印を 2 つ並べる：(unit) => (n) => …', '外側が unit を覚え、返ってきた内側の関数が n を受け取る。', C('const makeFee = (unit: number) => (n: number): number => n * unit\nconst hourly = makeFee(11000)'), C('<p class="hourly">1 時間制：{{ hourly(count) }} 円</p>', 'vue')], A('App.vue', '⑥ 関数を返す関数', '⑥ 1 時間制')),
    ];
  }, {
    alias: { 'App.vue': 'FeeCalculator.vue' },
    paths: { 'App.vue': 'src/components/FeeCalculator.vue' },
    fileNotes: { 'App.vue': '相談料の計算。function を => に書き換える' },
  });

  /* ===================================================================
     6. よくある落とし穴（QuoteBuilder.vue）
     =================================================================== */
  set('よくある落とし穴', {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

interface Case {
  id: number
  title: string
}

const cases: Case[] = [
  { id: 1, title: '離婚の相談' },
  { id: 2, title: '相続の相談' },
]

const slots = ref<number>(3)
const saved = ref<boolean>(false)
const ticketA = ref<number>(0)
const ticketB = ref<number>(0)

// ① fee を直す：呼ぶと 5500 を返すようにする（{ } を付けたら return が要る。式だけなら { } は要らない）
const fee = () => { 5500 }

// ② makeCase を直す：{ id: 1 } のオブジェクトを返すようにする（オブジェクトは ( ) で包む）
const makeCase = () => { id: 1 }

// ⑤ titles を直す：案件の title を並べた配列になるようにする（今は中身が空っぽ）
const titles = cases.map((c) => { c.title })

// ④ 保存ボタンを押して 300ms 後に saved が true になるように直す（setTimeout に渡すのは「関数」）
const save = (): void => {
  saved.value = true
}
const reserve = (): void => {
  saved.value = false
  setTimeout(save(), 300)
}

// ⑥ makeCounter を直し（return が足りない）、windowA と windowB を、それぞれ makeCounter() で作る
const makeCounter = () => {
  let n = 0
  const next = () => ++n
}
</script>

<template>
  <h2>相談料の見積</h2>
  <p class="fee">1 回：{{ fee() }} 円</p>
  <pre class="case">案件：{{ makeCase() }}</pre>
  <!-- ③ 状態を三項演算子に直す：0 枠なら「満席」、それ以外は「受付中」（今は && なので false と出る） -->
  <p class="state">状態：{{ slots === 0 && '満席' }}</p>
  <p class="titles">{{ titles.join('、') }}</p>
  <button class="save" @click="reserve">保存</button>
  <p class="saved" v-if="saved">保存しました</p>
  <p class="win">窓口A：{{ ticketA }} 番 ／ 窓口B：{{ ticketB }} 番</p>
  <!-- ⑥ 「窓口A」「窓口B」ボタンを置き、押すと ticketA = windowA() のように番号札を受け取る（@click） -->
</template>
`,
  }, {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

interface Case {
  id: number
  title: string
}

const cases: Case[] = [
  { id: 1, title: '離婚の相談' },
  { id: 2, title: '相続の相談' },
]

const slots = ref<number>(3)
const saved = ref<boolean>(false)
const ticketA = ref<number>(0)
const ticketB = ref<number>(0)

const fee = () => 5500

const makeCase = () => ({ id: 1 })

const titles = cases.map((c) => c.title)

const save = (): void => {
  saved.value = true
}
const reserve = (): void => {
  saved.value = false
  setTimeout(() => save(), 300)
}

const makeCounter = () => {
  let n = 0
  const next = () => ++n
  return next
}
const windowA = makeCounter()
const windowB = makeCounter()
</script>

<template>
  <h2>相談料の見積</h2>
  <p class="fee">1 回：{{ fee() }} 円</p>
  <pre class="case">案件：{{ makeCase() }}</pre>
  <p class="state">状態：{{ slots === 0 ? '満席' : '受付中' }}</p>
  <p class="titles">{{ titles.join('、') }}</p>
  <button class="save" @click="reserve">保存</button>
  <p class="saved" v-if="saved">保存しました</p>
  <p class="win">窓口A：{{ ticketA }} 番 ／ 窓口B：{{ ticketB }} 番</p>
  <button class="callA" @click="ticketA = windowA()">窓口A</button>
  <button class="callB" @click="ticketB = windowB()">窓口B</button>
</template>
`,
  }, (v, c) => {
    const f = v['App.vue'], t = tpl(f), s = scr(f);
    const CASES = [{ id: 1, title: '離婚の相談' }, { id: 2, title: '相続の相談' }];
    const fe = fn(f, 'fee'), mc = fn(f, 'makeCase');
    const stIn = inner(f, 'class="state"');
    const txt = (sel) => (($q(c, sel) || { textContent: '' }).textContent || '').replace(/\s+/g, '');
    const reserve = bodyOf(f, 'reserve');
    const mk = fn(f, 'makeCounter');
    const mkOk = (() => { try { const a = mk(), b = mk(); return a() === 1 && a() === 2 && b() === 1; } catch (e) { return false; } })();
    const mcv = (() => { try { return mc(); } catch (e) { return null; } })();
    return [
      T('QuoteBuilder.vue の script で、fee を直し、呼ぶと 5500 を返すようにする（{ } を外して式だけに。画面：1 回：5500 円）', 1,
        !!fe && fe() === 5500 && /5500/.test(txt('.fee')),
        ['{ } を付けた矢印関数は、return が無いと undefined を返す。', '式 1 つなら { } ごと消す（or { return 5500 }）。', C('const fee = () => 5500')], A('App.vue', '① fee を直す')),
      T('QuoteBuilder.vue の script で、makeCase を直し、{ id: 1 } のオブジェクトを返すようにする（( ) で包む。画面：案件に id が出る）', 1,
        !!mc && !!mcv && mcv.id === 1 && /"?id"?\s*:\s*1/.test(($q(c, '.case') || { textContent: '' }).textContent),
        ['=> のあとの { } は「ブロック」と読まれる。オブジェクトのつもりなら、( ) で包む。', C('const makeCase = () => ({ id: 1 })')], A('App.vue', '② makeCase を直す')),
      T('QuoteBuilder.vue の template で、状態を三項演算子に直す（0 枠なら「満席」、それ以外は「受付中」。画面：状態：受付中）', 1,
        mustaches(stIn).some((e) => /\?/.test(e) && String(ev(e, { slots: 0 })).includes('満席') && ev(e, { slots: 3 }) === '受付中') && /状態：受付中/.test(txt('.state')),
        ['「条件 && 値」は、条件がウソだと false そのものが出てしまう。', '「どちらを出すか」を決めるときは、? : で両方を書く。', C("状態：{{ slots === 0 ? '満席' : '受付中' }}", 'vue')], A('App.vue', '③ 状態を三項演算子')),
      T('QuoteBuilder.vue の script で、setTimeout に「関数」を渡すように reserve を直す（save() ではなく () => save()。300ms 後に保存）', 2,
        !/setTimeout\s*\(\s*save\s*\(\s*\)/.test(reserve) && /setTimeout\s*\(\s*(\(\s*\)\s*=>|save\s*,)/.test(reserve) && /300/.test(reserve),
        ['setTimeout(save(), 300) は、save() を今すぐ呼んで、その結果（undefined）を渡している。', '「あとで呼ぶ関数」を渡すなら、() => save() か、名前だけの save。', C('setTimeout(() => save(), 300)')], A('App.vue', '④ 保存ボタン')),
      T('QuoteBuilder.vue の script で、titles を直し、案件の title を並べた配列にする（c.title を返す。画面：離婚の相談、相続の相談）', 2,
        /\.map\s*\(/.test(rhs(f, 'titles') || '') && same(val(f, 'titles', { cases: CASES }), ['離婚の相談', '相続の相談']) && /離婚の相談、相続の相談/.test(txt('.titles')),
        ['map の矢印関数が { } を付けているのに return が無いので、中身が undefined になっている。', C('const titles = cases.map((c) => c.title)')], A('App.vue', '⑤ titles を直す')),
      T('QuoteBuilder.vue の script で、makeCounter に return を足し、windowA・windowB を作り、2 つのボタンの @click で番号札を受け取る（それぞれ自分の番号を数える）', 3,
        mkOk && /^makeCounter\s*\(\s*\)$/.test(rhs(f, 'windowA') || '') && /^makeCounter\s*\(\s*\)$/.test(rhs(f, 'windowB') || '') && /@click\s*=\s*"[^"]*windowA\s*\(\s*\)/.test(t) && /@click\s*=\s*"[^"]*windowB\s*\(\s*\)/.test(t),
        ['作った next を返さないと、makeCounter() は undefined を返す。関数を返すには return。', 'windowA と windowB は、それぞれ makeCounter() で作る。別々の n を覚える。', C('const makeCounter = () => {\n  let n = 0\n  const next = () => ++n\n  return next\n}\nconst windowA = makeCounter()\nconst windowB = makeCounter()'), C('<button class="callA" @click="ticketA = windowA()">窓口A</button>\n<button class="callB" @click="ticketB = windowB()">窓口B</button>', 'vue')], A('App.vue', '⑥ makeCounter を直し', '⑥ 「窓口A」')),
    ];
  }, {
    alias: { 'App.vue': 'QuoteBuilder.vue' },
    paths: { 'App.vue': 'src/components/QuoteBuilder.vue' },
    fileNotes: { 'App.vue': '見積画面。矢印関数のつまずきを 1 つずつ直す' },
  });

  void appText;
})();
