/* 練習（vue-intro / vue-env / vue-basics 前半）: 1つの .vue ファイルで、その時点までに習った書き方だけを使う版。
   子コンポーネント・props・emit・computed・watch は後のレッスン（vue-comp / vue-life）で学ぶので、ここでは使わない。
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

  /* ===================== vue-intro ===================== */
  /* 紹介レッスンは「考え方」だけ。1枚の .vue に、<template> の文字・{{ }}・ref だけを使う（部品・props・型ファイルは出さない） */

  set('vue-intro', 'フロントエンドって何？', vue({
    'App.vue': `
<script setup>
import { ref } from 'vue'

// ③ 予約の時間 time を ref('10:00') で作る（画面に出す「データ」）

// ⑥ 予約する人の名前 name を ref('山田 太郎') で作る
</script>

<template>
  <!-- ① HTML：h2 に「初回相談のご予約」と書く（画面の「形」） -->
  <h2>（見出し）</h2>
  <!-- ② HTML：p に「担当：佐藤 弁護士」と書く -->
  <p>（担当）</p>
  <!-- ④ 時間を画面に出す：p に「日時：{{ time }}」と書く -->
  <p>（日時）</p>
  <!-- ⑤ データを書き換えると画面も変わる：上の script で time の中身を '14:00' にする -->
  <!-- ⑥ p に「ご予約者：{{ name }} 様」と書く -->
  <p>（ご予約者）</p>
</template>
`,
  }, {
    'App.vue': `
<script setup>
import { ref } from 'vue'

const time = ref('14:00')

const name = ref('山田 太郎')
</script>

<template>
  <h2>初回相談のご予約</h2>
  <p>担当：佐藤 弁護士</p>
  <p>日時：{{ time }}</p>
  <p>ご予約者：{{ name }} 様</p>
</template>
`,
  }, (v, c) => {
    const page = nc(v['App.vue']);
    return [
      T('ReservationPage.vue で、h2 に「初回相談のご予約」と書く（画面：初回相談のご予約）', 1, /<h2>\s*初回相談のご予約\s*<\/h2>/.test(tpl(page)) && /初回相談のご予約/.test(appText(c)), ['フロントエンドは「ブラウザに映る画面」。画面の形は HTML（template）に文字を書いて作る。', C('<h2>初回相談のご予約</h2>', 'vue')], A('App.vue', '① HTML')),
      T('ReservationPage.vue で、p に「担当：佐藤 弁護士」と書く（画面：担当：佐藤 弁護士）', 1, /<p>\s*担当：佐藤 弁護士\s*<\/p>/.test(tpl(page)) && /担当：\s*佐藤 弁護士/.test(appText(c)), ['文字はそのまま p の中に書けばよい。', C('<p>担当：佐藤 弁護士</p>', 'vue')], A('App.vue', '② HTML')),
      T('ReservationPage.vue の script で、time を ref(\'10:00\') で作る', 1, /const\s+time\s*=\s*ref\(\s*['"]\d{1,2}:\d{2}['"]\s*\)/.test(page), ['画面に出す値（データ）は script の中に置く。値を入れる箱が ref。', C("const time = ref('10:00')", 'js')], A('App.vue', '③ 予約の時間')),
      T('ReservationPage.vue で、p に「日時：{{ time }}」と書く（画面：日時：10:00）', 2, /日時：\s*\{\{\s*time\s*\}\}/.test(tpl(page)) && /日時：\s*\d{1,2}:\d{2}/.test(appText(c)), ['{{ }} の中にデータの名前を書くと、その値が画面に出る。', C('<p>日時：{{ time }}</p>', 'vue')], A('App.vue', '④ 時間を')),
      T('ReservationPage.vue で、time の中身を \'14:00\' に書き換える（画面：日時：14:00）', 2, /ref\(\s*['"]14:00['"]\s*\)/.test(page) && /日時：\s*14:00/.test(appText(c)), ['template は1文字も触らず、データだけ書き換える。画面は自動でついてくる。', C("const time = ref('14:00')", 'js')], A('App.vue', '⑤ データを')),
      T('ReservationPage.vue で、name を ref で作り、p に「ご予約者：{{ name }} 様」と書く（画面：ご予約者：山田 太郎 様）', 3, /const\s+name\s*=\s*ref\(\s*['"]山田 太郎['"]\s*\)/.test(page) && /ご予約者：\s*\{\{\s*name\s*\}\}\s*様/.test(tpl(page)) && /ご予約者：\s*山田 太郎\s*様/.test(appText(c)), ['データを1つ増やして、画面に出す。ref と {{ }} の組み合わせはいつも同じ。', C("const name = ref('山田 太郎')\n// <p>ご予約者：{{ name }} 様</p>", 'js')], A('App.vue', '⑥ 予約する人', '⑥ p に')),
    ];
  }, {
    alias: { 'App.vue': 'ReservationPage.vue' },
    paths: { 'App.vue': 'src/pages/ReservationPage.vue' },
    fileNotes: { 'App.vue': '画面（予約確認）。データ（script）と形（template）が1ファイルに入る' },
  }));

  set('vue-intro', 'HTML・CSS・JavaScript', vue({
    'App.vue': `
<script setup>
import { ref } from 'vue'

// ④ JavaScript：料金 fee を ref(5500) で作る

// ⑤ JavaScript：fee の数字を 11000 に書き換える（画面も変わる）

// ⑥ JavaScript：カードの題名 title を ref('初回相談（30分）') で作る
</script>

<template>
  <div class="card">
    <!-- ① HTML：h3 に「初回相談（30分）」と書く -->
    <h3>（題名）</h3>
    <!-- ④ HTML：p に「料金：{{ fee }} 円」と書く -->
    <p>（料金）</p>
    <!-- ⑥ h3 の文字を、{{ title }} に置き換える -->
  </div>
</template>

<style>
/* ② CSS：.card に border と padding を付ける */

/* ③ CSS：h3 の color を決める */
</style>
`,
  }, {
    'App.vue': `
<script setup>
import { ref } from 'vue'

const fee = ref(11000)

const title = ref('初回相談（30分）')
</script>

<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p>料金：{{ fee }} 円</p>
  </div>
</template>

<style>
.card {
  border: 1px solid #ccc;
  padding: 12px;
}

h3 {
  color: teal;
}
</style>
`,
  }, (v, c) => {
    const page = nc(v['App.vue']);
    const h3 = $q(c, '#app .card h3');
    return [
      T('ConsultCardPage.vue の HTML で、h3 に「初回相談（30分）」と書く（画面：初回相談（30分））', 1, !!h3 && /初回相談（30分）/.test(h3.textContent), ['HTML は「何を載せるか」。見出しは h3。', C('<h3>初回相談（30分）</h3>', 'vue')], A('App.vue', '① HTML')),
      T('ConsultCardPage.vue の CSS で、.card に border と padding を付ける', 1, /<style[^>]*>[\s\S]*\.card\s*\{[^}]*border\s*:[^}]*\}/.test(page) && /\.card\s*\{[^}]*padding\s*:/.test(page), ['CSS は「どう見せるか」。クラス名の前に . を付けて、波かっこの中に見た目を書く。', C('.card {\n  border: 1px solid #ccc;\n  padding: 12px;\n}', 'css')], A('App.vue', '② CSS')),
      T('ConsultCardPage.vue の CSS で、h3 の color を決める', 1, /<style[^>]*>[\s\S]*(^|[\s,}])h3\s*\{[^}]*color\s*:/.test(page), ['タグ名だけを書くと、そのタグ全部に効く。', C('h3 {\n  color: teal;\n}', 'css')], A('App.vue', '③ CSS')),
      T('ConsultCardPage.vue の JavaScript で、fee を ref(5500) で作り、p に「料金：{{ fee }} 円」と書く（画面：料金：5500 円）', 2, /const\s+fee\s*=\s*ref\(\s*\d+\s*\)/.test(page) && /\{\{\s*fee\s*\}\}\s*円/.test(tpl(page)) && /料金：\s*\d+\s*円/.test(appText(c)), ['JavaScript は「どう動くか（データ）」。HTML の {{ }} から、データを呼び出す。', C("const fee = ref(5500)\n// <p>料金：{{ fee }} 円</p>", 'js')], A('App.vue', '④ JavaScript', '④ HTML')),
      T('ConsultCardPage.vue の JavaScript で、fee を 11000 に書き換える（画面：料金：11000 円）', 2, /const\s+fee\s*=\s*ref\(\s*11000\s*\)/.test(page) && /料金：\s*11000\s*円/.test(appText(c)), ['HTML と CSS は触らない。データを書き換えるだけで、画面の数字も変わる。', C('const fee = ref(11000)', 'js')], A('App.vue', '⑤ JavaScript')),
      T('ConsultCardPage.vue で、title を ref で作り、h3 の文字を {{ title }} に置き換える（画面：初回相談（30分））', 3, /const\s+title\s*=\s*ref\(\s*['"]初回相談（30分）['"]\s*\)/.test(page) && /<h3[^>]*>\s*\{\{\s*title\s*\}\}\s*<\/h3>/.test(tpl(page)) && !!h3 && /初回相談（30分）/.test(h3.textContent), ['HTML の固定の文字を、JavaScript のデータに置き換える。3つの層がつながる。', C("const title = ref('初回相談（30分）')\n// <h3>{{ title }}</h3>", 'js')], A('App.vue', '⑥ JavaScript', '⑥ h3')),
    ];
  }, {
    alias: { 'App.vue': 'ConsultCardPage.vue' },
    paths: { 'App.vue': 'src/pages/ConsultCardPage.vue' },
    fileNotes: { 'App.vue': 'HTML（template）・CSS（style）・JS（script）が1つに入った画面' },
  }));

  set('vue-intro', 'フレームワークって？', vue({
    'App.vue': `
<script setup>
import { ref } from 'vue'

// ① 1時間あたりの料金 hourly を ref(11000) で作る

// ② 時間数 hours を ref(1) で作る

// ⑤ hours の数字を 3 に書き換える（式は直さなくても、画面の合計が変わる）
</script>

<template>
  <h2>弁護士費用シミュレーター</h2>
  <!-- ③ p で「時給：{{ hourly }} 円」と「時間数：{{ hours }} 時間」を出す -->
  <!-- ④ 合計を {{ hourly * hours }} で計算して、p に「合計：◯ 円」と出す -->
  <!-- ⑥ 消費税10%（小数は Math.floor で切り捨て）を足した「税込合計：◯ 円」も p で出す -->
</template>
`,
  }, {
    'App.vue': `
<script setup>
import { ref } from 'vue'

const hourly = ref(11000)

const hours = ref(3)
</script>

<template>
  <h2>弁護士費用シミュレーター</h2>
  <p>時給：{{ hourly }} 円</p>
  <p>時間数：{{ hours }} 時間</p>
  <p>合計：{{ hourly * hours }} 円</p>
  <p>税込合計：{{ Math.floor(hourly * hours * 1.1) }} 円</p>
</template>
`,
  }, (v, c) => {
    const page = nc(v['App.vue']);
    const hrs = +((page.match(/const\s+hours\s*=\s*ref\(\s*(\d+)\s*\)/) || [])[1] || 0);
    const hr = +((page.match(/const\s+hourly\s*=\s*ref\(\s*(\d+)\s*\)/) || [])[1] || 0);
    const txt = appText(c);
    return [
      T('FeeSimulatorPage.vue で、hourly を ref(11000) で作る', 1, /const\s+hourly\s*=\s*ref\(\s*11000\s*\)/.test(page), ['フレームワークでも、データは ref に入れる。名前は意味が分かるものに。', C('const hourly = ref(11000)', 'js')], A('App.vue', '① 1時間')),
      T('FeeSimulatorPage.vue で、hours を ref(1) で作る', 1, /const\s+hours\s*=\s*ref\(\s*\d+\s*\)/.test(page), ['数字も ref にそのまま入れられる。', C('const hours = ref(1)', 'js')], A('App.vue', '② 時間数')),
      T('FeeSimulatorPage.vue で、{{ hourly }} と {{ hours }} を p で出す（画面：時給：11000 円）', 1, /\{\{\s*hourly\s*\}\}/.test(tpl(page)) && /\{\{\s*hours\s*\}\}/.test(tpl(page)) && /時給：\s*11000\s*円/.test(txt) && /時間数：\s*\d+\s*時間/.test(txt), ['template の {{ }} に名前を書く。script の中と違って .value は付けない。', C('<p>時給：{{ hourly }} 円</p>\n<p>時間数：{{ hours }} 時間</p>', 'vue')], A('App.vue', '③ p で')),
      T('FeeSimulatorPage.vue で、{{ hourly * hours }} で合計を計算して表示する（画面：合計：11000 円）', 2, /\{\{\s*hourly\s*\*\s*hours\s*\}\}/.test(tpl(page)) && new RegExp('(^|[^込])合計：\\s*' + (hr * hrs) + '\\s*円').test(txt) && hr * hrs > 0, ['{{ }} の中には、足し算・かけ算などの式も書ける。', C('<p>合計：{{ hourly * hours }} 円</p>', 'vue')], A('App.vue', '④ 合計')),
      T('FeeSimulatorPage.vue で、hours を 3 に書き換える（画面：合計：33000 円）', 2, /const\s+hours\s*=\s*ref\(\s*3\s*\)/.test(page) && /(^|[^込])合計：\s*33000\s*円/.test(txt), ['データを書き換えるだけ。画面の「時間数」も「合計」も、全部 Vue が直してくれる。', C('const hours = ref(3)', 'js')], A('App.vue', '⑤ hours')),
      T('FeeSimulatorPage.vue で、Math.floor を使って税込合計を表示する（画面：税込合計：36300 円）', 3, /Math\.floor\s*\(/.test(tpl(page)) && hr * hrs > 0 && new RegExp('税込合計：\\s*' + Math.floor(hr * hrs * 1.1) + '\\s*円').test(txt), ['式の中でも Math.floor が使える。1.1 をかけて 10% の税を足す。', C('<p>税込合計：{{ Math.floor(hourly * hours * 1.1) }} 円</p>', 'vue')], A('App.vue', '⑥ 消費税')),
    ];
  }, {
    alias: { 'App.vue': 'FeeSimulatorPage.vue' },
    paths: { 'App.vue': 'src/pages/FeeSimulatorPage.vue' },
    fileNotes: { 'App.vue': '画面（費用シミュレーター）。データを書くと画面が追いかける' },
  }));

  set('vue-intro', '実例：検索サイトを層に分ける', vue({
    'App.vue': `
<script setup>
import { ref } from 'vue'

// ④ JS の層：弁護士の名前 name を ref('田村 結衣')、得意分野 field を ref('離婚・相続') で作る

// ⑤ JS の層：該当件数 count を ref(4) で作る

// ⑥ JS の層だけを直す：name を '中島 健太'、field を '債務整理・交通事故' に書き換える（HTML と CSS は触らない）
</script>

<template>
  <h2>弁護士を探す</h2>
  <!-- ⑤ HTML の層：p に「該当：{{ count }} 件」と書く -->
  <p></p>
  <div class="card">
    <!-- ① HTML の層：h3 に名前、p に得意分野を書く（まずは文字で。④ のあとは {{ name }} / {{ field }} に置き換える） -->
    <h3></h3>
    <p></p>
  </div>
</template>

<style>
/* ② CSS の層：.card に border と padding を付ける */

/* ③ CSS の層：.card h3 の color を決める */
</style>
`,
  }, {
    'App.vue': `
<script setup>
import { ref } from 'vue'

const name = ref('中島 健太')
const field = ref('債務整理・交通事故')

const count = ref(4)
</script>

<template>
  <h2>弁護士を探す</h2>
  <p>該当：{{ count }} 件</p>
  <div class="card">
    <h3>{{ name }}</h3>
    <p>{{ field }}</p>
  </div>
</template>

<style>
.card {
  border: 1px solid #ccc;
  padding: 12px;
}

.card h3 {
  color: teal;
}
</style>
`,
  }, (v, c) => {
    const page = nc(v['App.vue']);
    const h3 = $q(c, '#app .card h3'), p = $q(c, '#app .card p');
    return [
      T('LawyerSearchPage.vue の HTML の層で、.card の h3 に名前、p に得意分野を書く（画面：弁護士の名前と得意分野）', 1, !!h3 && !!p && h3.textContent.trim().length >= 2 && p.textContent.trim().length >= 2, ['HTML の層は「何を載せるか」。まずは文字をそのまま書いてよい。', C('<h3>田村 結衣</h3>\n<p>離婚・相続</p>', 'vue')], A('App.vue', '① HTML')),
      T('LawyerSearchPage.vue の CSS の層で、.card に border と padding を付ける', 1, /<style[^>]*>[\s\S]*\.card\s*\{[^}]*border\s*:[^}]*\}/.test(page) && /\.card\s*\{[^}]*padding\s*:/.test(page), ['CSS の層は「どう見せるか」。HTML には何も書き足さない。', C('.card {\n  border: 1px solid #ccc;\n  padding: 12px;\n}', 'css')], A('App.vue', '② CSS')),
      T('LawyerSearchPage.vue の CSS の層で、.card h3 の color を決める', 1, /\.card\s+h3\s*\{[^}]*color\s*:/.test(page), ['「.card の中の h3」は、スペースでつなぐ。', C('.card h3 {\n  color: teal;\n}', 'css')], A('App.vue', '③ CSS')),
      T('LawyerSearchPage.vue の JS の層で、name と field を ref で作り、h3 と p を {{ }} に置き換える', 2, /const\s+name\s*=\s*ref\(\s*['"][^'"]+['"]\s*\)/.test(page) && /const\s+field\s*=\s*ref\(\s*['"][^'"]+['"]\s*\)/.test(page) && /\{\{\s*name\s*\}\}/.test(tpl(page)) && /\{\{\s*field\s*\}\}/.test(tpl(page)) && !!h3 && h3.textContent.trim().length >= 2, ['固定の文字をデータに替えると、HTML の形はそのまま、中身だけ差し替えられる。', C("const name = ref('田村 結衣')\nconst field = ref('離婚・相続')\n// <h3>{{ name }}</h3>\n// <p>{{ field }}</p>", 'js')], A('App.vue', '④ JS の層')),
      T('LawyerSearchPage.vue で、count を ref(4) で作り、p に「該当：{{ count }} 件」と書く（画面：該当：4 件）', 2, /const\s+count\s*=\s*ref\(\s*4\s*\)/.test(page) && /該当：\s*\{\{\s*count\s*\}\}\s*件/.test(tpl(page)) && /該当：\s*4\s*件/.test(appText(c)), ['件数もデータの1つ。JS の層に置いて、HTML の層から呼ぶ。', C('const count = ref(4)\n// <p>該当：{{ count }} 件</p>', 'js')], A('App.vue', '⑤ JS の層', '⑤ HTML')),
      T('LawyerSearchPage.vue の JS の層だけで、name を \'中島 健太\'、field を \'債務整理・交通事故\' に変える（画面：中島 健太）', 3, /const\s+name\s*=\s*ref\(\s*['"]中島 健太['"]\s*\)/.test(page) && /const\s+field\s*=\s*ref\(\s*['"]債務整理・交通事故['"]\s*\)/.test(page) && /\{\{\s*name\s*\}\}/.test(tpl(page)) && /中島 健太/.test(appText(c)) && /債務整理・交通事故/.test(appText(c)), ['層を分けておくと、中身が変わっても直すのは JS の層だけ。HTML と CSS はそのまま。', C("const name = ref('中島 健太')\nconst field = ref('債務整理・交通事故')", 'js')], A('App.vue', '⑥ JS の層だけ')),
    ];
  }, {
    alias: { 'App.vue': 'LawyerSearchPage.vue' },
    paths: { 'App.vue': 'src/pages/LawyerSearchPage.vue' },
    fileNotes: { 'App.vue': 'HTML・CSS・JS の3つの層が入った画面' },
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
        T('ターミナルで、Vue のプロジェクトを作るコマンドを書く（npm create vue@latest）', 1, a >= 0, ['雛形を作るコマンド。', 'npm create vue@latest'], A('commands.sh', '① プロジェクト')),
        T('ターミナルで、作ったフォルダに入るコマンドを、作成コマンドの後に書く（cd consult-app）', 1, a >= 0 && b > a, ['cd = change directory。フォルダの中へ移動する。', 'cd consult-app'], A('commands.sh', '② できた')),
        T('ターミナルで、部品を入れるコマンドを、cd の後に書く（npm install）', 1, b >= 0 && c > b, ['package.json に書かれた部品をまとめてダウンロードする。', 'npm install'], A('commands.sh', '③ 必要な')),
        T('ターミナルで、開発サーバーを起動するコマンドを、install の後に書く（npm run dev）', 2, c >= 0 && d > c, ['dev は package.json の scripts にある開発用コマンド。', 'npm run dev'], A('commands.sh', '④ 開発')),
        T('ターミナルで、型エラーだけを調べるコマンドを書く（npm run type-check）', 2, c >= 0 && e > c, ['create-vue の雛形には type-check が入っている。', 'npm run type-check'], A('commands.sh', '⑤ 型の')),
        T('ターミナルで、dev の後に npm run build、その後に npm run preview の順に書く', 3, d >= 0 && f > d && g > f, ['build で dist フォルダができる。preview はそれを開いて確認する。', 'npm run build → npm run preview'], A('commands.sh', '⑥ 公開用')),
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
        T('ターミナルで、開発サーバーを起動するコマンドを書く（npm run dev）', 1, d >= 0, ['開発中に使うコマンド。', 'npm run dev'], A('commands.sh', '① 開発')),
        T('メモ（# の行）に、ブラウザで開く URL を書く（localhost:5173）', 1, /^#.*localhost:5173/m.test(raw), ['http://localhost:5173 をブラウザで開く。', '# 開く URL: http://localhost:5173'], A('commands.sh', '② ブラウザ')),
        T('メモ（# の行）に、HMR の説明を書く（リロードなしで更新される）', 1, /^#.*HMR.*(リロード|再読み込み|更新|変わ)/m.test(raw), ['HMR は「保存した瞬間に、画面だけ入れ替わる」仕組み。', '# HMR: 保存するだけで、リロードなしで画面が変わる'], A('commands.sh', '③ 自動更新')),
        T('メモ（# の行）に、サーバーの止め方を書く（Ctrl+C）', 2, /^#.*Ctrl\s*\+\s*C/im.test(raw), ['ターミナルで Ctrl キーを押しながら C。', '# 止めるとき: Ctrl+C'], A('commands.sh', '④ サーバー')),
        T('ターミナルで、公開用にまとめるコマンドを、dev の後に書く（npm run build）', 2, d >= 0 && f > d, ['build は公開用のファイルを作る。', 'npm run build'], A('commands.sh', '⑤ 公開用')),
        T('ターミナルで、build の後に npm run preview を書き、できるフォルダ dist をメモに書く', 3, f >= 0 && g > f && /^#.*dist/m.test(raw), ['preview は dist の中身を、パソコン上で開いて確認する。', 'npm run preview\n# build すると dist フォルダに公開用ファイルができる'], A('commands.sh', '⑥ まとめた')),
      ];
    }));


  set('vue-env', '実例：初日にやる 4 コマンド', vue({
    'App.vue': `
<!-- npm run dev で開発サーバーを起動したまま、下の画面を書き換えて保存してみよう。保存した瞬間に画面が変わる（HMR） -->
<template>
  <!-- ① h1 の「新人」を、自分の名前に書き換える -->
  <h1>ようこそ、新人 さん</h1>
  <!-- ② p を足して、「受付 9:00〜18:00」と書く -->
  <!-- ③ p を足して、「電話：03-1234-5678」と書く -->
  <!-- ④ h2 を足して、「今日やること」と書く -->
  <!-- ⑤ ul の中に li を3つ。「メールを確認する」「相談枠を確認する」「日報を書く」 -->
  <!-- ⑥ p を足して、「住所：東京都千代田区丸の内1-1-1」と書く -->
</template>
`,
  }, {
    'App.vue': `
<template>
  <h1>ようこそ、山田 さん</h1>
  <p>受付 9:00〜18:00</p>
  <p>電話：03-1234-5678</p>
  <h2>今日やること</h2>
  <ul>
    <li>メールを確認する</li>
    <li>相談枠を確認する</li>
    <li>日報を書く</li>
  </ul>
  <p>住所：東京都千代田区丸の内1-1-1</p>
</template>
`,
  }, (v, c) => {
    const page = nc(v['App.vue']), t = tpl(page), txt = appText(c);
    const nm = (t.match(/<h1>\s*ようこそ、\s*(\S+?)\s*さん\s*<\/h1>/) || [])[1];
    return [
      T('ConsultHomePage.vue で、h1 の「新人」を自分の名前に書き換える（画面：ようこそ、山田 さん）', 1, !!nm && nm !== '新人', ['文字を書き換えて保存するだけ。開発サーバーが動いていれば、すぐ画面に出る（HMR）。', C('<h1>ようこそ、山田 さん</h1>', 'vue')], A('App.vue', '① h1')),
      T('ConsultHomePage.vue で、p を足して「受付 9:00〜18:00」と書く（画面：受付 9:00〜18:00）', 1, /<p>\s*受付\s*9:00〜18:00\s*<\/p>/.test(t) && /受付\s*9:00〜18:00/.test(txt), ['保存すると、リロードなしで画面に増える。', C('<p>受付 9:00〜18:00</p>', 'vue')], A('App.vue', '② p')),
      T('ConsultHomePage.vue で、p を足して「電話：03-1234-5678」と書く（画面：電話：03-1234-5678）', 1, /<p>\s*電話：03-1234-5678\s*<\/p>/.test(t) && /電話：03-1234-5678/.test(txt), ['template の中には、HTML のタグをそのまま書ける。', C('<p>電話：03-1234-5678</p>', 'vue')], A('App.vue', '③ p')),
      T('ConsultHomePage.vue で、h2 を足して「今日やること」と書く（画面：今日やること）', 2, /<h2>\s*今日やること\s*<\/h2>/.test(t) && /今日やること/.test(txt), ['見出しは h2。h1 より1つ小さい見出し。', C('<h2>今日やること</h2>', 'vue')], A('App.vue', '④ h2')),
      T('ConsultHomePage.vue で、ul の中に li を3つ書く（画面：3 項目）', 2, /<ul>[\s\S]*<\/ul>/.test(t) && $all(c, '#app ul li').length === 3, ['リストは ul の中に li を並べる。', C('<ul>\n  <li>メールを確認する</li>\n  <li>相談枠を確認する</li>\n  <li>日報を書く</li>\n</ul>', 'vue')], A('App.vue', '⑤ ul')),
      T('ConsultHomePage.vue で、住所の p を足す（画面：p が 3 つ）', 3, /<p>\s*住所：\S+[^<]*<\/p>/.test(t) && /住所：\S+/.test(txt) && $all(c, '#app p').length === 3, ['p は3つ（受付・電話・住所）になる。保存のたびに HMR で反映される。', C('<p>住所：東京都千代田区丸の内1-1-1</p>', 'vue')], A('App.vue', '⑥ p')),
    ];
  }, {
    alias: { 'App.vue': 'ConsultHomePage.vue' },
    paths: { 'App.vue': 'src/ConsultHomePage.vue' },
    fileNotes: { 'App.vue': '初日に最初に編集する画面（template だけ）' },
  }));

  /* ===================== vue-basics #1–#8 ===================== */
  /* 子コンポーネント・props・emit は vue-comp で初めて学ぶ。ここでは1つの .vue ファイルだけで練習する */

  set('vue-basics', '.vue ファイルの解剖', vue({
    'App.vue': `
<!-- ⑥ ブロックの順番は script → template → style のまま変えない -->
<script setup>
import { ref } from 'vue'

// ① script（動き）：お気に入りの数 likes を ref(0) で作る

// ⑤ script（動き）：記事のタイトル title を ref('残業代請求の相談事例') で作る

// ⑥ script（動き）：閲覧数 views を ref(128) で作る
</script>

<template>
  <!-- ⑤ h2 の文字を {{ title }} に置き換える -->
  <h2>残業代請求の相談事例</h2>
  <p>未払い残業代について、相談の流れを紹介します。</p>
  <!-- ② template（形）：p に「お気に入り：{{ likes }}」を出す -->
  <!-- ④ template（形）：class="note" の p に「※ 一般的な情報です」と書く -->
  <!-- ⑥ template（形）：p に「閲覧：{{ views }} 回」を出す -->
</template>

<style scoped>
/* ③ style（見た目）：h2 の color を決める */

/* ④ style（見た目）：.note の color と font-size を決める */
</style>
`,
  }, {
    'App.vue': `
<script setup>
import { ref } from 'vue'

const likes = ref(0)

const title = ref('残業代請求の相談事例')

const views = ref(128)
</script>

<template>
  <h2>{{ title }}</h2>
  <p>未払い残業代について、相談の流れを紹介します。</p>
  <p>お気に入り：{{ likes }}</p>
  <p class="note">※ 一般的な情報です</p>
  <p>閲覧：{{ views }} 回</p>
</template>

<style scoped>
h2 {
  color: tomato;
}

.note {
  color: gray;
  font-size: 0.9rem;
}
</style>
`,
  }, (v, c) => {
    const raw = v['App.vue'], page = nc(raw);
    const a = raw.indexOf('<script'), b = raw.indexOf('<template>'), s = raw.lastIndexOf('<style');
    const sty = (page.match(/<style[^>]*scoped[^>]*>([\s\S]*)<\/style>/) || [])[1] || '';
    return [
      T('CaseArticlePage.vue の script で、likes を ref(0) で作る', 1, /const\s+likes\s*=\s*ref\(\s*0\s*\)/.test(page), ['script は「動き（データ）」の箱。数えるデータは ref に入れる。', C('const likes = ref(0)', 'js')], A('App.vue', '① script')),
      T('CaseArticlePage.vue の template で、p に「お気に入り：{{ likes }}」を出す（画面：お気に入り：0）', 1, /お気に入り：\s*\{\{\s*likes\s*\}\}/.test(tpl(page)) && /お気に入り：\s*0/.test(appText(c)), ['template は「形」の箱。{{ }} でデータを出す。', C('<p>お気に入り：{{ likes }}</p>', 'vue')], A('App.vue', '② template')),
      T('CaseArticlePage.vue の style で、<style scoped> を使い、h2 の color を決める', 1, /<style[^>]*scoped[^>]*>[\s\S]*h2\s*\{[^}]*color\s*:[^}]*\}[\s\S]*<\/style>/.test(page), ['style は「見た目」の箱。scoped は、このファイルの中だけに効く印。', C('<style scoped>\nh2 {\n  color: tomato;\n}\n</style>', 'vue')], A('App.vue', '③ style（見た目）：h2')),
      T('CaseArticlePage.vue で、template の p に class="note" を付け、style で .note の color と font-size を決める', 2, /<p[^>]*class\s*=\s*["']note["'][^>]*>\s*※\s*一般的な情報です/.test(tpl(page)) && /\.note\s*\{[^}]*color\s*:/.test(sty) && /\.note\s*\{[^}]*font-size\s*:/.test(sty), ['template の class 名と、style の .名前 が対応する。', C('<p class="note">※ 一般的な情報です</p>\n\n.note {\n  color: gray;\n  font-size: 0.9rem;\n}', 'vue')], A('App.vue', '④ template', '④ style')),
      T('CaseArticlePage.vue で、title を ref で作り、h2 の文字を {{ title }} に置き換える（画面：残業代請求の相談事例）', 2, /const\s+title\s*=\s*ref\(\s*['"]残業代請求の相談事例['"]\s*\)/.test(page) && /<h2[^>]*>\s*\{\{\s*title\s*\}\}\s*<\/h2>/.test(tpl(page)) && /残業代請求の相談事例/.test(appText(c)), ['script のデータを、template の {{ }} から呼ぶ。2つの箱がつながる。', C("const title = ref('残業代請求の相談事例')\n// <h2>{{ title }}</h2>", 'js')], A('App.vue', '⑤ script', '⑤ h2')),
      T('CaseArticlePage.vue で、views を ref(128) で作り、p に「閲覧：{{ views }} 回」を出す（script → template → style の順は変えない）', 3, /const\s+views\s*=\s*ref\(\s*128\s*\)/.test(page) && /閲覧：\s*\{\{\s*views\s*\}\}\s*回/.test(tpl(page)) && /閲覧：\s*128\s*回/.test(appText(c)) && a >= 0 && b > a && s > b, ['3つの箱の順番は script → template → style。書き足しても、順番は変わらない。', C("const views = ref(128)\n// <p>閲覧：{{ views }} 回</p>", 'js')], A('App.vue', '⑥ script', '⑥ template')),
    ];
  }, {
    alias: { 'App.vue': 'CaseArticlePage.vue' },
    paths: { 'App.vue': 'src/pages/CaseArticlePage.vue' },
    fileNotes: { 'App.vue': 'script・template・style の3つの箱が入った画面' },
  }));

  set('vue-basics', 'script の lang="ts" って？', vue({
    'App.vue': `
<!-- ① 下の script setup に lang="ts" を付けて、TypeScript で書く -->
<script setup>
// ② 型を付けて変数を作る：hours は number（3）、clientName は string（'山田 太郎'）

// ③ 費用を計算する関数 calcFee(h, hourly)。引数にも戻り値にも number を付ける

// ④ hourly を number（11000）で作り、fee を calcFee(hours, hourly) の結果として作る（fee にも number を付ける）

// ⑤ 必要書類 documents を string[]（文字の配列）で作る：'委任契約書'、'身分証のコピー'

// ⑥ isFirst を boolean（true）で作る。割引の文字を返す関数 discountLabel(first)：引数は boolean、戻り値は string
//    first が true なら '初回割引あり'、false なら '割引なし'
</script>

<template>
  <h2>お見積り</h2>
  <p>（依頼者）</p>
  <p>（時間 × 時給）</p>
  <p>費用：0 円</p>
  <p>必要書類：（なし）</p>
  <p>割引：（なし）</p>
</template>
`,
  }, {
    'App.vue': `
<script setup lang="ts">
const hours: number = 3
const clientName: string = '山田 太郎'

function calcFee(h: number, hourly: number): number {
  return h * hourly
}

const hourly: number = 11000
const fee: number = calcFee(hours, hourly)

const documents: string[] = ['委任契約書', '身分証のコピー']

const isFirst: boolean = true
function discountLabel(first: boolean): string {
  return first ? '初回割引あり' : '割引なし'
}
</script>

<template>
  <h2>{{ clientName }} 様のお見積り</h2>
  <p>{{ hours }} 時間 × {{ hourly }} 円</p>
  <p>費用：{{ fee }} 円</p>
  <p>必要書類：{{ documents.join('、') }}</p>
  <p>割引：{{ discountLabel(isFirst) }}</p>
</template>
`,
  }, (v, c) => {
    const page = nc(v['App.vue']), t = tpl(page), txt = appText(c);
    return [
      T('FeeEstimatePage.vue で、<script setup> に lang="ts" を付ける', 1, /<script[^>]*\bsetup\b[^>]*\blang\s*=\s*["']ts["']|<script[^>]*\blang\s*=\s*["']ts["'][^>]*\bsetup\b/.test(page), ['lang="ts" を付けると、型を書けて、間違いに赤線が付く。', C('<script setup lang="ts">', 'vue')], A('App.vue', '① 下の', '<script setup>')),
      T('FeeEstimatePage.vue で、hours に number、clientName に string の型を付けて作る', 1, /const\s+hours\s*:\s*number\s*=\s*3\b/.test(page) && /const\s+clientName\s*:\s*string\s*=\s*['"]山田 太郎['"]/.test(page), ['変数名の後ろに : 型 を書く。', C("const hours: number = 3\nconst clientName: string = '山田 太郎'")], A('App.vue', '② 型を付けて')),
      T('FeeEstimatePage.vue で、calcFee(h, hourly) を、引数も戻り値も number で作る', 1, /(function\s+calcFee\s*\(\s*\w+\s*:\s*number\s*,\s*\w+\s*:\s*number\s*\)\s*:\s*number|const\s+calcFee\s*=\s*\(\s*\w+\s*:\s*number\s*,\s*\w+\s*:\s*number\s*\)\s*:\s*number\s*=>)/.test(page), ['( ) の中が引数の型、( ) の後ろの : が戻り値の型。', C('function calcFee(h: number, hourly: number): number {\n  return h * hourly\n}')], A('App.vue', '③ 費用')),
      T('FeeEstimatePage.vue で、fee を calcFee で計算し、「費用：33000 円」と表示する', 2, /const\s+hourly\s*:\s*number\s*=\s*11000/.test(page) && /const\s+fee\s*:\s*number\s*=\s*calcFee\s*\(\s*hours\s*,\s*hourly\s*\)/.test(page) && /費用：\s*33000\s*円/.test(txt), ['3時間 × 11000円。関数の戻り値は number なので、fee にも number が付けられる。', C('const hourly: number = 11000\nconst fee: number = calcFee(hours, hourly)')], A('App.vue', '④ hourly')),
      T('FeeEstimatePage.vue で、documents を string[] で作り、「必要書類：委任契約書、身分証のコピー」と表示する', 2, /const\s+documents\s*:\s*string\s*\[\s*\]\s*=\s*\[[^\]]*委任契約書/.test(page) && /必要書類：\s*委任契約書、身分証のコピー/.test(txt), ['配列の型は 型[]。文字の配列なら string[]。', C("const documents: string[] = ['委任契約書', '身分証のコピー']")], A('App.vue', '⑤ 必要書類')),
      T('FeeEstimatePage.vue で、isFirst を boolean で作り、discountLabel(first: boolean): string で「割引：初回割引あり」と表示する', 3, /const\s+isFirst\s*:\s*boolean\s*=\s*true/.test(page) && /function\s+discountLabel\s*\(\s*\w+\s*:\s*boolean\s*\)\s*:\s*string|const\s+discountLabel\s*=\s*\(\s*\w+\s*:\s*boolean\s*\)\s*:\s*string\s*=>/.test(page) && /割引：\s*初回割引あり/.test(txt), ['true / false は boolean。関数の引数が boolean なら、true か false しか渡せなくなる。', C("const isFirst: boolean = true\nfunction discountLabel(first: boolean): string {\n  return first ? '初回割引あり' : '割引なし'\n}")], A('App.vue', '⑥ isFirst')),
    ];
  }, {
    alias: { 'App.vue': 'FeeEstimatePage.vue' },
    paths: { 'App.vue': 'src/pages/FeeEstimatePage.vue' },
    fileNotes: { 'App.vue': '画面（お見積り）。script に型を付けて書く' },
  }));

  set('vue-basics', 'JS の基本：変数と関数', vue({
    'App.vue': `
<script setup lang="ts">
const consults = [
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
    'App.vue': `
<script setup lang="ts">
const consults = [
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
      T('ConsultSummaryPage.vue で、変えない値 officeName を const で宣言する', 1, /const\s+officeName\s*(:\s*string)?\s*=\s*['"`]相談ナビ法律事務所['"`]/.test(s) && /事務所/.test(appText(c)), ['あとで変えない値は const。変える値は let。', C("const officeName = '相談ナビ法律事務所'")], A('App.vue', '① 変えない')),
      T('ConsultSummaryPage.vue で、税込みにする関数 withTax を作る（10000 → 11000）', 1, /const\s+withTax\s*=\s*\(\s*\w+\s*(:\s*number)?\s*\)\s*(:\s*number)?\s*=>[\s\S]*Math\.floor/.test(s) && /税込み：\s*11000\s*円/.test(appText(c)), ['アロー関数：(引数) => 戻す値', C('const withTax = (price: number): number => Math.floor(price * 1.1)')], A('App.vue', '② 税込み')),
      T('ConsultSummaryPage.vue で、filter を使い、終わっていない相談だけを open に入れる', 1, /const\s+open\s*=\s*consults\s*\.filter\s*\(\s*\(?\s*\w+\s*\)?\s*=>\s*!\s*\w+\.done\s*\)/.test(s) || /const\s+open\s*=\s*consults\s*\.filter\s*\([^)]*done\s*===?\s*false/.test(s), ['filter は「条件に合うものだけ」の新しい配列を返す。', C('const open = consults.filter((c) => !c.done)')], A('App.vue', '③ consults')),
      T('ConsultSummaryPage.vue で、map を使い、open の title だけを titles に入れる（画面：離婚の相談、相続の相談）', 2, /const\s+titles\s*=\s*open\s*\.map\s*\(/.test(s) && /未完了：\s*離婚の相談、相続の相談/.test(appText(c)), ['map は「1つずつ変換した」新しい配列を返す。', C('const titles = open.map((c) => c.title)')], A('App.vue', '④ open')),
      T('ConsultSummaryPage.vue で、テンプレートリテラル（バッククォート）を使い、summary を「未完了 2 件」の形で作る', 2, /const\s+summary\s*(:\s*string)?\s*=\s*`[^`]*\$\{\s*open\.length\s*\}[^`]*`/.test(s) && /未完了\s*2\s*件/.test(appText(c)), ['`文字 ${変数} 文字` と書くと、変数をそのまま文に入れられる。', C('const summary = §未完了 ¤{open.length} 件§')], A('App.vue', '⑤ バッククォート')),
      T('ConsultSummaryPage.vue で、reduce を使い、全相談の fee を足して total を作る（38500）', 3, /const\s+total\s*(:\s*number)?\s*=\s*consults\s*\.reduce\s*\(/.test(s) && /料金合計：\s*38500\s*円/.test(appText(c)), ['reduce((合計, 1件) => 合計 + 1件の値, 0)。最後の 0 は、合計の出発点。', C('const total = consults.reduce((sum, c) => sum + c.fee, 0)')], A('App.vue', '⑥ consults 全部')),
    ];
  }, {
    alias: { 'App.vue': 'ConsultSummaryPage.vue' },
    paths: { 'App.vue': 'src/pages/ConsultSummaryPage.vue' },
    fileNotes: { 'App.vue': '画面（相談の集計）' },
  }));

  set('vue-basics', 'データを変えるだけ', vue({
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

// ① 残り枠 slots を ref<number>(10) で作る

const total = 10

// ③ slots の数字を 3 に書き換える（式は1文字も直さなくても、画面の何か所もが全部変わる）
</script>

<template>
  <h2>初回相談の予約枠</h2>
  <!-- ② p に「残り {{ slots }} 枠」を出す -->
  <!-- ④ p に、slots が 0 のときは「満席」、それ以外は「受付中」を {{ slots === 0 ? '満席' : '受付中' }} で出す -->
  <!-- ⑤ 予約ボタンに :disabled="slots === 0" を付ける（slots が 0 のとき押せなくなる） -->
  <button>予約</button>
  <!-- ⑥ p に、{{ total - slots }} を使って「予約済み ◯ 枠（全 10 枠）」を出す -->
</template>
`,
  }, {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

const slots = ref<number>(3)

const total = 10
</script>

<template>
  <h2>初回相談の予約枠</h2>
  <p>残り {{ slots }} 枠</p>
  <p>{{ slots === 0 ? '満席' : '受付中' }}</p>
  <button :disabled="slots === 0">予約</button>
  <p>予約済み {{ total - slots }} 枠（全 {{ total }} 枠）</p>
</template>
`,
  }, (v, c) => {
    const page = nc(v['App.vue']), t = tpl(page), txt = appText(c);
    const n = +((page.match(/slots\s*=\s*ref\s*(?:<\s*number\s*>)?\s*\(\s*(\d+)\s*\)/) || [])[1] || -1);
    return [
      T('SlotStatusPage.vue で、slots を ref<number>(10) で作る', 1, /const\s+slots\s*=\s*ref\s*<\s*number\s*>\s*\(\s*\d+\s*\)/.test(page), ['画面に出したい数は、まず ref に入れてデータにする。', C('const slots = ref<number>(10)')], A('App.vue', '① 残り枠')),
      T('SlotStatusPage.vue で、p に「残り {{ slots }} 枠」を出す（画面：残り 10 枠）', 1, /残り\s*\{\{\s*slots\s*\}\}\s*枠/.test(t) && /残り\s*\d+\s*枠/.test(txt), ['{{ }} の中にデータの名前。template では .value は付けない。', C('<p>残り {{ slots }} 枠</p>', 'vue')], A('App.vue', '② p')),
      T('SlotStatusPage.vue で、slots の数字を 3 に書き換える（画面：残り 3 枠）', 1, /slots\s*=\s*ref\s*(<\s*number\s*>)?\s*\(\s*3\s*\)/.test(page) && /残り\s*3\s*枠/.test(txt), ['ref の中の数字を変えるだけ。template はそのままで、画面が自動で追いかける。', C('const slots = ref<number>(3)')], A('App.vue', '③ slots')),
      T('SlotStatusPage.vue で、slots が 0 のときは「満席」、それ以外は「受付中」を出す（画面：受付中）', 2, /\{\{\s*slots\s*===?\s*0\s*\?\s*['"]満席['"]\s*:\s*['"]受付中['"]\s*\}\}/.test(t) && /(受付中|満席)/.test(txt), ['{{ }} の中には、条件 ? A : B の式も書ける。slots が変わると、この表示も変わる。', C("<p>{{ slots === 0 ? '満席' : '受付中' }}</p>", 'vue')], A('App.vue', '④ p')),
      T('SlotStatusPage.vue で、slots が 0 のとき予約ボタンを押せなくする（:disabled）', 2, /<button[^>]*:disabled\s*=\s*["']slots\s*(===?|<=)\s*0["']/.test(t), [':disabled に条件を書くと、true のときだけボタンが押せなくなる。データ（slots）が 0 になれば、ボタンも自動で止まる。', C('<button :disabled="slots === 0">予約</button>', 'vue')], A('App.vue', '⑤ 予約ボタン')),
      T('SlotStatusPage.vue で、{{ total - slots }} を使い、「予約済み 7 枠（全 10 枠）」と表示する', 3, /\{\{\s*total\s*-\s*slots\s*\}\}/.test(t) && n >= 0 && new RegExp('予約済み\\s*' + (10 - n) + '\\s*枠（全\\s*10\\s*枠）').test(txt), ['データから計算した値も、{{ }} の中の式で出せる。slots を変えると、これも一緒に変わる。', C('<p>予約済み {{ total - slots }} 枠（全 {{ total }} 枠）</p>', 'vue')], A('App.vue', '⑥ p')),
    ];
  }, {
    alias: { 'App.vue': 'SlotStatusPage.vue' },
    paths: { 'App.vue': 'src/pages/SlotStatusPage.vue' },
    fileNotes: { 'App.vue': '画面（予約枠）。データ（slots）を変えるだけで表示が変わる' },
  }));

  set('vue-basics', 'Vue の考え方：3ステップ', vue({
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

const maxLength = 100

// ① 【データ】相談メモ memo を ref<string> で作る（最初の文字は '初回相談：契約書の確認'）

// ⑤ 【データ】相談者名 clientName を ref<string>('') で作る

// ⑥ 【データ】至急かどうか urgent を ref<boolean>(false) で作る
</script>

<template>
  <h2>相談メモ</h2>
  <!-- ⑤ 【見た目】名前の入力欄に v-model="clientName" をつなぎ、下の p を「{{ clientName }} 様のメモ」にする -->
  <input placeholder="相談者名">
  <p>（相談者名）</p>
  <!-- ② 【見た目】textarea に v-model="memo" をつなぐ -->
  <textarea rows="3"></textarea>
  <!-- ③ 【見た目】p に「文字数：{{ memo.length }}」を出す -->
  <!-- ④ 【見た目】{{ maxLength - memo.length }} の式で、あと何文字書けるかを「残り ◯ 文字」と出す -->
  <p>残り 0 文字</p>
  <!-- ⑥ 【見た目】チェックボックスに v-model="urgent" をつなぎ、下の p を「対応：{{ urgent ? '至急' : '通常' }}」にする -->
  <label><input type="checkbox"> 至急</label>
  <p>対応：（未設定）</p>
</template>
`,
  }, {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

const maxLength = 100

const memo = ref<string>('初回相談：契約書の確認')

const clientName = ref<string>('')

const urgent = ref<boolean>(false)
</script>

<template>
  <h2>相談メモ</h2>
  <input v-model="clientName" placeholder="相談者名">
  <p>{{ clientName }} 様のメモ</p>
  <textarea v-model="memo" rows="3"></textarea>
  <p>文字数：{{ memo.length }}</p>
  <p>残り {{ maxLength - memo.length }} 文字</p>
  <label><input type="checkbox" v-model="urgent"> 至急</label>
  <p>対応：{{ urgent ? '至急' : '通常' }}</p>
</template>
`,
  }, (v, c) => {
    const s = nc(v['App.vue']), t = tpl(s);
    const ta = $q(c, '#app textarea');
    return [
      T('ConsultMemoEditor.vue で、memo を ref<string> で作る（最初の値：初回相談：契約書の確認）', 1, /const\s+memo\s*=\s*ref\s*<\s*string\s*>\s*\(\s*['"]初回相談：契約書の確認['"]\s*\)/.test(s), ['Vue の1歩目は、データを ref に入れること。', C("const memo = ref<string>('初回相談：契約書の確認')")], A('App.vue', '① 【データ】')),
      T('ConsultMemoEditor.vue で、textarea に v-model="memo" をつなぐ（最初から文字が入る）', 1, /<textarea[^>]*v-model\s*=\s*["']memo["']/.test(t) && !!ta && /契約書の確認/.test(ta.value), ['v-model は、入力欄とデータを両方向でつなぐ。', C('<textarea v-model="memo" rows="3"></textarea>', 'vue')], A('App.vue', '② 【見た目】textarea')),
      T('ConsultMemoEditor.vue で、{{ memo.length }} を使い、「文字数：11」と表示する', 1, /\{\{\s*memo\.length\s*\}\}/.test(t) && /文字数：\s*11\b/.test(appText(c)), ['template の中の {{ }} は、データをそのまま表示する。', C('<p>文字数：{{ memo.length }}</p>', 'vue')], A('App.vue', '③ 【見た目】p')),
      T('ConsultMemoEditor.vue で、{{ maxLength - memo.length }} の式で残りの文字数を出す（画面：残り 89 文字）', 2, /\{\{\s*maxLength\s*-\s*memo\.length\s*\}\}/.test(t) && /残り\s*89\s*文字/.test(appText(c)), ['memo が変わるたびに、式の結果も自動で変わる。', C('<p>残り {{ maxLength - memo.length }} 文字</p>', 'vue')], A('App.vue', '④ 【見た目】{{')),
      T('ConsultMemoEditor.vue で、clientName を ref<string>(\'\') で作り、名前の入力欄を v-model でつなぐ（画面：◯◯ 様のメモ）', 2, /const\s+clientName\s*=\s*ref\s*<\s*string\s*>\s*\(\s*['"]['"]\s*\)/.test(s) && /<input(?![^>]*checkbox)[^>]*v-model\s*=\s*["']clientName["']/.test(t) && /\{\{\s*clientName\s*\}\}\s*様のメモ/.test(t), ['データ（ref）→ 見た目（v-model・{{ }}）。入力すると、下の文字も一緒に変わる。', C("const clientName = ref<string>('')\n// <input v-model=\"clientName\">\n// <p>{{ clientName }} 様のメモ</p>")], A('App.vue', '⑤ 【データ】', '⑤ 【見た目】')),
      T('ConsultMemoEditor.vue で、urgent を ref<boolean>(false) で作り、チェックボックスを v-model でつないで「対応：通常」と表示する', 3, /const\s+urgent\s*=\s*ref\s*<\s*boolean\s*>\s*\(\s*false\s*\)/.test(s) && /<input[^>]*type\s*=\s*["']checkbox["'][^>]*v-model\s*=\s*["']urgent["']|<input[^>]*v-model\s*=\s*["']urgent["'][^>]*type\s*=\s*["']checkbox["']/.test(t) && /\{\{\s*urgent\s*\?[^}]*\}\}/.test(t) && /対応：\s*通常/.test(appText(c)), ['チェックボックスは true / false。ref<boolean> と v-model がぴったり合う。', C("const urgent = ref<boolean>(false)\n// <input type=\"checkbox\" v-model=\"urgent\">\n// <p>対応：{{ urgent ? '至急' : '通常' }}</p>")], A('App.vue', '⑥ 【データ】', '⑥ 【見た目】')),
    ];
  }, {
    alias: { 'App.vue': 'ConsultMemoEditor.vue' },
    paths: { 'App.vue': 'src/pages/ConsultMemoEditor.vue' },
    fileNotes: { 'App.vue': '画面（相談メモ）。データ → 見た目 → 入力の3ステップ' },
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
  <p>{{ urgent ? '至急対応で承ります' : '通常の受付です' }}</p>
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
  <p>{{ urgent ? '至急対応で承ります' : '通常の受付です' }}</p>
</template>
`,
  }, (v, c) => {
    const s = nc(v['App.vue']);
    return [
      T('VisitReservationForm.vue で、people を ref<number>(1) で作る（画面：人数：1 名）', 1, /const\s+people\s*=\s*ref\s*<\s*number\s*>\s*\(\s*1\s*\)/.test(s) && /人数：\s*1\s*名/.test(appText(c)), ['ref は1つの値を入れる箱。数なら ref<number>。', C('const people = ref<number>(1)')], A('App.vue', '① 来所人数')),
      T('VisitReservationForm.vue で、add 関数を作り、people.value を 1 増やす', 1, /(function\s+add|const\s+add\s*=)[\s\S]*?people\.value\s*(\+\+|\+=\s*1)/.test(s), ['script の中では .value を付ける。', C('function add(): void {\n  people.value++\n}')], A('App.vue', '② people を')),
      T('VisitReservationForm.vue で、name を ref<string>(\'\') で作り、入力欄に v-model でつなぐ', 1, /const\s+name\s*=\s*ref\s*<\s*string\s*>\s*\(\s*['"]['"]\s*\)/.test(s) && /<input[^>]*v-model\s*=\s*["']name["']/.test(s), ['文字の ref には ref<string>。', C("const name = ref<string>('')\n// <input v-model=\"name\">")], A('App.vue', '③ 代表者名', '③ 名前')),
      T('VisitReservationForm.vue に、「リセット」ボタンと reset 関数を作り、people を 1 に戻す', 2, /(function\s+reset|const\s+reset\s*=)[\s\S]*?people\.value\s*=\s*1\b/.test(s) && /<button[^>]*@click\s*=\s*["']reset["']/.test(tpl(s)), ['値を入れ直すときは = を使う。', C('function reset(): void {\n  people.value = 1\n}\n// <button @click="reset">リセット</button>')], A('App.vue', '④ people を', '④ 「リセット」')),
      T('VisitReservationForm.vue で、remove 関数を作り、people を 1 減らす（1 未満にはしない）', 2, /(function\s+remove|const\s+remove\s*=)[\s\S]*?if\s*\(\s*people\.value\s*(>\s*1|>=\s*2)\s*\)[\s\S]*?people\.value\s*(--|-=\s*1)/.test(s), ['減らす前に、1 より大きいかを確かめる。', C('function remove(): void {\n  if (people.value > 1) people.value--\n}')], A('App.vue', '⑤ people を 1 減らす')),
      T('VisitReservationForm.vue で、urgent を ref<boolean>(false) で作り、チェックボックスに v-model でつなぐ', 3, /const\s+urgent\s*=\s*ref\s*<\s*boolean\s*>\s*\(\s*false\s*\)/.test(s) && /<input[^>]*type\s*=\s*["']checkbox["'][^>]*v-model\s*=\s*["']urgent["']|<input[^>]*v-model\s*=\s*["']urgent["'][^>]*type\s*=\s*["']checkbox["']/.test(s), ['チェックボックスは true / false。ref<boolean> と v-model が合う。', C('const urgent = ref<boolean>(false)\n// <input type="checkbox" v-model="urgent">')], A('App.vue', '⑥ 至急かどうか', '⑥ 下の')),
    ];
  }, {
    alias: { 'App.vue': 'VisitReservationForm.vue' },
    paths: { 'App.vue': 'src/pages/VisitReservationForm.vue' },
    fileNotes: { 'App.vue': '画面（来所予約フォーム）' },
  }));

  set('vue-basics', 'ref：状態と画面', vue({
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

const maxPeople = 10
const unitPrice = 5500

// ① let を const に、数を ref<number>(1) にして、リアクティブにする
let people = 1

// ③ add の中で、people を .value で増やす。④ ただし maxPeople を超えない（if）
function add(): void {
  people++
}

// ⑤ people を 1 減らす関数 remove。1 より小さくしない
</script>

<template>
  <h2>相談会の参加受付</h2>
  <!-- ② template では .value を付けない -->
  <p>参加人数：{{ people.value }} 名（上限 {{ maxPeople }} 名）</p>
  <button @click="add">＋1名</button>
  <button @click="remove">－1名</button>
  <!-- ⑥ 参加費を {{ people * unitPrice }} の式で計算して、「参加費：◯ 円」と出す -->
  <p>参加費：0 円</p>
</template>
`,
  }, {
    'App.vue': `
<script setup lang="ts">
import { ref } from 'vue'

const maxPeople = 10
const unitPrice = 5500

const people = ref<number>(1)

function add(): void {
  if (people.value < maxPeople) people.value++
}

function remove(): void {
  if (people.value > 1) people.value--
}
</script>

<template>
  <h2>相談会の参加受付</h2>
  <p>参加人数：{{ people }} 名（上限 {{ maxPeople }} 名）</p>
  <button @click="add">＋1名</button>
  <button @click="remove">－1名</button>
  <p>参加費：{{ people * unitPrice }} 円</p>
</template>
`,
  }, (v, c) => {
    const s = nc(v['App.vue']);
    return [
      T('SeminarEntryPage.vue で、people を ref<number>(1) に変える（let から const ref へ）', 1, /const\s+people\s*=\s*ref\s*<\s*number\s*>\s*\(\s*1\s*\)/.test(s), ['普通の変数は、変えても画面が変わらない。ref に入れると画面が追いかける。', C('const people = ref<number>(1)')], A('App.vue', '① let', 'let people')),
      T('SeminarEntryPage.vue の template で、.value を付けずに people を表示する（画面：参加人数：1 名）', 1, !/\.value/.test(tpl(s)) && /参加人数：\s*1\s*名/.test(appText(c)), ['script の中は .value、template の中は付けない。', C('<p>参加人数：{{ people }} 名</p>', 'vue')], A('App.vue', '② template', '{{ people.value }}')),
      T('SeminarEntryPage.vue で、add 関数の中で people.value を 1 増やす', 1, /function\s+add\s*\([^)]*\)[^{]*\{[\s\S]*?people\.value\s*(\+\+|\+=\s*1)/.test(s), ['ref の中身は people.value で読み書きする。', C('people.value++')], A('App.vue', '③ add', 'people++')),
      T('SeminarEntryPage.vue で、add 関数に if を書き、maxPeople（10）を超えないようにする', 2, /function\s+add\s*\([^)]*\)[^{]*\{[\s\S]*?(people\.value\s*<\s*maxPeople|people\.value\s*<=\s*maxPeople\s*-\s*1|people\.value\s*<\s*10)/.test(s), ['増やす前に、上限より小さいかを確かめる。', C('function add(): void {\n  if (people.value < maxPeople) people.value++\n}')], A('App.vue', '④ ただし')),
      T('SeminarEntryPage.vue で、remove 関数を作り、1 未満にならないようにする', 2, /function\s+remove\s*\([^)]*\)[^{]*\{[\s\S]*?people\.value\s*(>\s*1|>=\s*2)[\s\S]*?people\.value\s*(--|-=\s*1)/.test(s), ['減らす前に、1 より大きいかを確かめる。', C('function remove(): void {\n  if (people.value > 1) people.value--\n}')], A('App.vue', '⑤ people を 1 減らす')),
      T('SeminarEntryPage.vue で、{{ people * unitPrice }} の式で参加費を表示する（画面：参加費：5500 円）', 3, /\{\{\s*people\s*\*\s*unitPrice\s*\}\}/.test(tpl(s)) && /参加費：\s*5500\s*円/.test(appText(c)), ['人数（ref）が変わるたびに、{{ }} の式も自動で計算し直される。', C('<p>参加費：{{ people * unitPrice }} 円</p>', 'vue')], A('App.vue', '⑥ 参加費')),
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
  <!-- ② p に「{{ item.title }}：{{ item.done ? '完了' : '未完了' }}」を出す -->
  <p>（案件）</p>
  <!-- ③ ボタンの @click で finish を呼ぶ -->
  <button>完了にする</button>
  <h3>申込者</h3>
  <!-- ④ 入力欄に v-model="form.name" と v-model="form.email" をつなぎ、下の p を「{{ form.name }} 様（{{ form.email }}）」にする -->
  <input placeholder="お名前">
  <input placeholder="メール">
  <p>（申込者）</p>
  <h3>順番待ち</h3>
  <!-- ⑤ queue の 2 件を li で出す：{{ queue[0].title }}（{{ queue[0].assignee ?? '未定' }}）と、queue[1] も -->
  <ul>
    <li>（順番待ち）</li>
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
    <li>{{ queue[0].title }}（{{ queue[0].assignee ?? '未定' }}）</li>
    <li>{{ queue[1].title }}（{{ queue[1].assignee ?? '未定' }}）</li>
  </ul>
</template>
`,
  }, (v, c) => {
    const ty = nc(v['case.ts']), s = nc(v['App.vue']), t = tpl(s);
    return [
      T('case.ts で、interface Case を書き、案件の形（id・title・done）を決める', 1, /export\s+interface\s+Case\s*\{[\s\S]*id\s*:\s*number[\s\S]*title\s*:\s*string[\s\S]*done\s*:\s*boolean[\s\S]*\}/.test(ty), ['型はデータの「設計図」。専用のファイルに置くと、あちこちで使い回せる。', C('export interface Case {\n  id: number\n  title: string\n  done: boolean\n}')], A('case.ts', '① 案件')),
      T('CaseDetailPage.vue で、item を ref<Case>(…) で作り、「離婚の相談：未完了」と表示する', 1, /const\s+item\s*=\s*ref\s*<\s*Case\s*>\s*\(/.test(s) && /\{\{\s*item\.title\s*\}\}/.test(t) && /離婚の相談：\s*未完了/.test(appText(c)), ['ref に型を付けるときは ref<型>(値)。', C("const item = ref<Case>({ id: 1, title: '離婚の相談', done: false })")], A('App.vue', '② 案件', '② p')),
      T('CaseDetailPage.vue で、finish 関数を作り、item.value.done を true にする（ボタンの @click で呼ぶ）', 1, /(function\s+finish|const\s+finish\s*=)[\s\S]*?item\.value\.done\s*=\s*true/.test(s) && /<button[^>]*@click\s*=\s*["']finish(\(\))?["']/.test(t), ['ref の中のオブジェクトは item.value.done のように触る。', C('function finish(): void {\n  item.value.done = true\n}')], A('App.vue', '③ item', '③ ボタン')),
      T('CaseDetailPage.vue で、form を reactive<Applicant> で作り、入力欄を v-model でつなぐ（.value なしで form.name が使える）', 2, /const\s+form\s*=\s*reactive\s*<\s*Applicant\s*>\s*\(\s*\{[^}]*name\s*:[^}]*email\s*:/.test(s) && /v-model\s*=\s*["']form\.name["']/.test(t) && /v-model\s*=\s*["']form\.email["']/.test(t) && !/form\.value/.test(s + t), ['reactive はオブジェクト用。.value を付けずに、そのまま form.name と書ける。', C("const form = reactive<Applicant>({ name: '', email: '' })\n// <input v-model=\"form.name\">")], A('App.vue', '④ 申込者', '④ 入力欄')),
      T('CaseDetailPage.vue で、queue を ref<Case[]> で作り、2 件を表示する（画面：労働の相談（未定））', 2, /const\s+queue\s*=\s*ref\s*<\s*Case\s*\[\s*\]\s*>\s*\(/.test(s) && /queue\[\s*0\s*\]/.test(t) && /queue\[\s*1\s*\]/.test(t) && /労働の相談（未定）/.test(appText(c)) && /相続の相談（佐藤）/.test(appText(c)), ['配列の ref は ref<型[]>。何番目かは queue[0]、queue[1] のように書く。', C("const queue = ref<Case[]>([\n  { id: 2, title: '労働の相談', done: false },\n  { id: 3, title: '相続の相談', done: false, assignee: '佐藤' },\n])\n// <li>{{ queue[0].title }}（{{ queue[0].assignee ?? '未定' }}）</li>")], A('App.vue', '⑤ 順番待ち')),
      T('case.ts で、assignee? を追加し、あってもなくてもよい項目にする', 3, /export\s+interface\s+Case\s*\{[^}]*assignee\s*\?\s*:\s*string[^}]*\}/.test(ty), ['? を付けると省略できる。省略した値は undefined なので、?? で「未定」と置き換えている。', C('export interface Case {\n  id: number\n  title: string\n  done: boolean\n  assignee?: string\n}')], A('case.ts', '⑥ Case')),
    ];
  }, {
    alias: { 'App.vue': 'CaseDetailPage.vue' },
    paths: { 'App.vue': 'src/pages/CaseDetailPage.vue', 'case.ts': 'src/types/case.ts' },
    fileNotes: { 'App.vue': '画面（案件の詳細）', 'case.ts': 'データの形（型）' },
  }));
})();
