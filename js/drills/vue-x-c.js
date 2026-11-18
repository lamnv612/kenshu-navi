/* vue-comp（コンポーネント）各シーンの練習を、現場っぽい複数ファイルの題材に差し替える。
   ・親ページ（内部名 App.vue は alias で別名表示）＋ 子部品 ＋ types.ts
   ・ランナー（core.js の sfcBuild）の制約に合わせて書いてある:
     defineProps / defineEmits は「型リテラル直書き」、defineModel は defineModel<T>() の形（引数なし）だけ動く。
   ・タスクの判定はコメントを取り除いた本文に対して行う（TODO コメントの文言で通らないように）。 */
(function () {
  const K = window.KENSHU;
  const D = (K.drills = K.drills || {});
  if (!K.vueDrillTools) return;
  const { multi, T, appText } = K.vueDrillTools;
  D['vue-comp'] = D['vue-comp'] || {};

  const clean = (s) => String(s || '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/([;)\s])\/\/ .*$/gm, '$1');
  const C = (code, lang) => ({ code, lang: lang || 'vue' });
  const A = (file, ...find) => ({ file, find });
  const re = (r, s) => r.test(s || '');
  const count = (r, s) => (String(s || '').match(r) || []).length;

  /* 共通の見た目（全部品に効く） */
  const ST = `
<style scoped>
.card, .tile, .row { border: 1px solid #d5d9e0; border-radius: 8px; padding: 6px 12px; margin: 6px 0; }
.tile { display: inline-block; margin-right: 8px; }
.badge { background: #e6f4ea; border-radius: 10px; padding: 0 8px; font-size: 12px; }
.active, .on { background: #ffe8a3; }
button { margin-left: 6px; }
</style>
`;
  /* .vue を組み立てる（script / template / style） */
  const V = (script, tpl, style) => '<script setup lang="ts">\n' + script + '</script>\n\n<template>\n' + tpl + '</template>\n' + (style === false ? '' : ST);

  /* alias: 親ページの表示名。files の先頭（App.vue）が親。notes: 各ファイルの一言 */
  const mk = (alias, starter, sol, notes, tasks) => {
    const paths = {};
    Object.keys(starter).forEach((n) => { paths[n] = n === 'App.vue' ? 'src/pages/' + alias : n === 'types.ts' ? 'src/types.ts' : 'src/components/' + n; });
    return multi(starter, sol, (v, c) => {
      const w = {}; Object.keys(v).forEach((n) => { w[n] = clean(v[n]); });
      return tasks(w, c);
    }, { alias: { 'App.vue': alias }, paths, fileNotes: notes, height: 300 });
  };
  const set = (title, obj) => { D['vue-comp'][title] = obj; };

  /* ============ 1. コンポーネントって？ ============ */
  {
    const types = "export interface CaseSummary {\n  id: number\n  title: string\n  lawyer: string\n}\n";
    const cards = '  <div class="card">\n    <b>離婚の相談</b> 担当: 山田 太郎\n    <button>詳しく見る</button>\n  </div>\n  <div class="card">\n    <b>相続の相談</b> 担当: 佐藤 花子\n    <button>詳しく見る</button>\n  </div>\n  <div class="card">\n    <b>労働の相談</b> 担当: 鈴木 一郎\n    <button>詳しく見る</button>\n  </div>\n';
    const list = "const cases = ref<CaseSummary[]>([\n  { id: 1, title: '離婚の相談', lawyer: '山田 太郎' },\n  { id: 2, title: '相続の相談', lawyer: '佐藤 花子' },\n  { id: 3, title: '労働の相談', lawyer: '鈴木 一郎' },\n])\n";
    set('コンポーネントって？', mk('CaseListPage.vue', {
      'App.vue': V("import { ref } from 'vue'\n// ③ ここに CaseCard を import する（'@/components/CaseCard.vue'）\n// ⑤ 3枚ぶんのデータを cases 配列（CaseSummary 型）にして v-for にまとめる\n", '  <!-- ④ 下のコピペ3枚を <CaseCard> に置き換える -->\n' + cards),
      'CaseCard.vue': V("// ① 親から title と lawyer を受け取る（props。型も書く）\n", '  <!-- ② 1枚ぶんのカードを書く（title と lawyer を表示。ボタンも） -->\n'),
      'types.ts': types,
    }, {
      'App.vue': V("import { ref } from 'vue'\nimport CaseCard from '@/components/CaseCard.vue'\nimport type { CaseSummary } from '@/types'\n\n" + list, '  <CaseCard v-for="c in cases" :key="c.id" :title="c.title" :lawyer="c.lawyer" />\n'),
      'CaseCard.vue': V("defineProps<{ title: string; lawyer: string }>()\n", '  <div class="card">\n    <b>{{ title }}</b> 担当: {{ lawyer }}\n    <button>詳しく見る</button>\n  </div>\n'),
      'types.ts': types,
    }, { 'App.vue': '親：案件を並べるページ', 'CaseCard.vue': '子：案件1枚ぶんのカード', 'types.ts': '型：CaseSummary' },
    (v, c) => { const P = v['App.vue'], Cd = v['CaseCard.vue']; return [
      T('① CaseCard.vue で、defineProps<{ … }>() に title と lawyer（どちらも string）を宣言する', 1, re(/defineProps\s*<\s*\{[^}]*\btitle\s*:\s*string/, Cd) && re(/defineProps\s*<\s*\{[^}]*\blawyer\s*:\s*string/, Cd), ['親から受け取る値を、型付きで defineProps に書く。', C('defineProps<{ title: string; lawyer: string }>()', 'ts')], A('CaseCard.vue', '①')),
      T('② CaseCard.vue の template に、{{ title }} と {{ lawyer }} とボタンを書く', 1, re(/\{\{\s*title\s*\}\}/, Cd) && re(/\{\{\s*lawyer\s*\}\}/, Cd) && re(/<button/, Cd), ['1枚ぶんのカードを書き、変わる所は {{ }} にする。', C('<div class="card">\n  <b>{{ title }}</b> 担当: {{ lawyer }}\n  <button>詳しく見る</button>\n</div>')], A('CaseCard.vue', '②')),
      T('③ CaseListPage.vue に CaseCard を import する', 1, re(/import\s+CaseCard\s+from\s+['"][^'"]*CaseCard\.vue['"]/, P), ['使う部品は import が要る。', C("import CaseCard from '@/components/CaseCard.vue'", 'ts')], A('App.vue', '③')),
      T('④ コピペの3枚（class="card"）をやめて、<CaseCard> で3枚出す（画面は同じ）', 2, !re(/class=["']card["']/, P) && (count(/<CaseCard\b/g, P) >= 3 || re(/<CaseCard[^>]*v-for/, P)) && /離婚の相談/.test(appText(c)) && /相続の相談/.test(appText(c)) && /労働の相談/.test(appText(c)), ['違う所（title と lawyer）だけ属性で渡す。', C('<CaseCard title="離婚の相談" lawyer="山田 太郎" />')], A('App.vue', '④')),
      T('⑤ cases（ref<CaseSummary[]>）と v-for＋:key で、<CaseCard> を1行にまとめる', 3, re(/ref\s*<\s*CaseSummary\[\]\s*>\s*\(/, P) && re(/import\s+type\s*\{[^}]*CaseSummary[^}]*\}\s*from\s+['"]@\/types['"]/, P) && count(/<CaseCard\b/g, P) === 1 && re(/<CaseCard[^>]*v-for=["'][^"']*\bin\s+cases["']/, P) && re(/:key\s*=/, P) && /労働の相談/.test(appText(c)), ['データを配列にして、1つの <CaseCard> を繰り返す。', C('<CaseCard v-for="c in cases" :key="c.id" :title="c.title" :lawyer="c.lawyer" />')], A('App.vue', '⑤')),
    ]; }));
  }

  /* ============ 2. props：どんな困りごと？ ============ */
  {
    set('props：どんな困りごと？', mk('LawyerListPage.vue', {
      'App.vue': V("// ③ 3人ぶん、名前（name）と分野（field）を属性で渡す\n", '  <LawyerCard />\n  <LawyerCard />\n  <LawyerCard />\n'),
      'LawyerCard.vue': V("// ① 親から name と field（どちらも string）を受け取る\n// ④ 経験年数 years（number）も受け取り、「経験◯年」と表示する（親からは :years で渡す）\n// ⑤ years は無い弁護士もいる。years? にして、あるときだけ表示する（v-if）\n", '  <!-- ② 下の固定の文字を、受け取った値に置き換える -->\n  <div class="card">\n    <b>山田 太郎</b> 専門: 労働問題\n  </div>\n'),
    }, {
      'App.vue': V('', '  <LawyerCard name="山田 太郎" field="労働問題" :years="12" />\n  <LawyerCard name="佐藤 花子" field="相続" :years="8" />\n  <LawyerCard name="鈴木 一郎" field="交通事故" />\n'),
      'LawyerCard.vue': V("defineProps<{ name: string; field: string; years?: number }>()\n", '  <div class="card">\n    <b>{{ name }}</b> 専門: {{ field }}\n    <span v-if="years !== undefined">（経験{{ years }}年）</span>\n  </div>\n'),
    }, { 'App.vue': '親：弁護士を並べるページ', 'LawyerCard.vue': '子：弁護士1人ぶんのカード' },
    (v, c) => { const P = v['App.vue'], Cd = v['LawyerCard.vue']; return [
      T('① LawyerCard.vue で、defineProps に name と field（string）を宣言する', 1, re(/defineProps\s*<\s*\{[^}]*\bname\s*:\s*string/, Cd) && re(/defineProps\s*<\s*\{[^}]*\bfield\s*:\s*string/, Cd), ['固定の文字をやめる準備。外から受け取る名前を宣言する。', C('defineProps<{ name: string; field: string }>()', 'ts')], A('LawyerCard.vue', '①')),
      T('② LawyerCard.vue の固定の名前をやめて、{{ name }} と {{ field }} を表示する', 1, re(/\{\{\s*name\s*\}\}/, Cd) && re(/\{\{\s*field\s*\}\}/, Cd) && !re(/山田 太郎/, Cd), ['「山田 太郎」を直書きしていると、全員が同じになってしまう。', C('<b>{{ name }}</b> 専門: {{ field }}')], A('LawyerCard.vue', '②')),
      T('③ LawyerListPage.vue で、3人それぞれに name と field を渡す（画面に3人の名前が出る）', 1, count(/<LawyerCard\b[^>]*\bname\s*=/g, P) >= 3 && count(/<LawyerCard\b[^>]*\bfield\s*=/g, P) >= 3 && /山田/.test(appText(c)) && /佐藤/.test(appText(c)) && /鈴木/.test(appText(c)), ['違う所だけ、属性で渡す。', C('<LawyerCard name="山田 太郎" field="労働問題" />')], A('App.vue', '③')),
      T('④ years（number）を props に足し、「経験◯年」を出す。親からは :years="12" のように数値で渡す', 2, re(/defineProps\s*<\s*\{[^}]*\byears\s*\??\s*:\s*number/, Cd) && re(/\{\{\s*years\s*\}\}/, Cd) && re(/<LawyerCard\b[^>]*:years\s*=\s*["']\d+["']/, P) && /経験12年/.test(appText(c)), ['数値や true/false は、:（v-bind）を付けないと文字列になる。', C('<LawyerCard name="山田 太郎" field="労働問題" :years="12" />')], A('LawyerCard.vue', '④')),
      T('⑤ years を years?: number（省略可）にし、v-if であるときだけ表示。3人目は years なしでも崩れない', 3, re(/\byears\s*\?\s*:\s*number/, Cd) && re(/v-if\s*=\s*["'][^"']*years/, Cd) && count(/<LawyerCard\b/g, P) >= 3 && count(/:years\s*=/g, P) < count(/<LawyerCard\b/g, P) && !/undefined/.test(appText(c)), ['省略できる props は ? を付ける。省略されたら undefined になる。', C("defineProps<{ name: string; field: string; years?: number }>()\n\n<span v-if=\"years !== undefined\">（経験{{ years }}年）</span>")], A('LawyerCard.vue', '⑤')),
    ]; }));
  }

  /* ============ 3. props の書き方 ============ */
  {
    set('props の書き方', mk('ConsultMenuPage.vue', {
      'App.vue': V('', '  <!-- ③ 料金（:fee）とオンライン可否（:online）を、数値・真偽値として渡す -->\n  <ConsultMenuItem title="初回相談（30分）" :tags="[\'離婚\', \'男女問題\']" />\n  <ConsultMenuItem title="継続相談（60分）" :tags="[\'相続\']" />\n'),
      'ConsultMenuItem.vue': V("const props = defineProps<{ title: string }>()\n// ① fee（number）と online（boolean）を props に足す\n// ④ tags（string[]）を props に足して、v-for でタグを並べる\n// ⑤ 税込料金 feeWithTax を computed<number> で作る（fee × 1.1 を四捨五入）\n", '  <div class="card">\n    <b>{{ props.title }}</b>\n    <!-- ② 料金を「◯円」で表示し、online が true のときだけ「オンライン可」のバッジを出す -->\n  </div>\n'),
    }, {
      'App.vue': V('', '  <ConsultMenuItem title="初回相談（30分）" :fee="5500" :online="true" :tags="[\'離婚\', \'男女問題\']" />\n  <ConsultMenuItem title="継続相談（60分）" :fee="11000" :online="false" :tags="[\'相続\']" />\n'),
      'ConsultMenuItem.vue': V("const props = defineProps<{ title: string; fee: number; online: boolean; tags: string[] }>()\n\nconst feeWithTax = computed<number>(() => Math.round(props.fee * 1.1))\n", '  <div class="card">\n    <b>{{ props.title }}</b>\n    {{ fee }}円（税込 {{ feeWithTax }}円）\n    <span v-if="online" class="badge">オンライン可</span>\n    <span v-for="tag in tags" :key="tag" class="badge">{{ tag }}</span>\n  </div>\n'),
    }, { 'App.vue': '親：相談メニュー一覧', 'ConsultMenuItem.vue': '子：メニュー1件' },
    (v, c) => { const P = v['App.vue'], Cd = v['ConsultMenuItem.vue']; return [
      T('① ConsultMenuItem.vue の defineProps に、fee（number）と online（boolean）を足す', 1, re(/defineProps\s*<\s*\{[^}]*\bfee\s*:\s*number/, Cd) && re(/defineProps\s*<\s*\{[^}]*\bonline\s*:\s*boolean/, Cd), ['型は props ごとに書く: 文字は string、数は number、真偽は boolean。', C('defineProps<{ title: string; fee: number; online: boolean }>()', 'ts')], A('ConsultMenuItem.vue', '①')),
      T('② ConsultMenuItem.vue で料金を「◯円」と表示し、online が true のときだけ v-if で「オンライン可」を出す', 1, re(/\{\{\s*(props\.)?fee\s*\}\}\s*円/, Cd) && re(/v-if\s*=\s*["'](props\.)?online["']/, Cd) && /オンライン可/.test(Cd), ['真偽値の props は v-if とよく組み合わせる。', C('{{ fee }}円\n<span v-if="online" class="badge">オンライン可</span>')], A('ConsultMenuItem.vue', '②')),
      T('③ ConsultMenuPage.vue で、:fee と :online を数値・真偽値として渡す（画面に「5500円」が出る）', 1, count(/:fee\s*=\s*["']\d+["']/g, P) >= 2 && count(/:online\s*=\s*["'](true|false)["']/g, P) >= 2 && /5500円/.test(appText(c)), ['数値・真偽値は :（v-bind）を付けて渡す。付けないと文字列になる。', C('<ConsultMenuItem title="初回相談" :fee="5500" :online="true" />')], A('App.vue', '③')),
      T('④ tags（string[]）を props に足し、v-for でタグを並べる', 2, re(/defineProps\s*<\s*\{[^}]*\btags\s*:\s*string\[\]/, Cd) && re(/v-for\s*=\s*["']\s*\w+\s+in\s+(props\.)?tags["']/, Cd) && /男女問題/.test(appText(c)), ['配列の props は v-for で繰り返す。', C('<span v-for="tag in tags" :key="tag" class="badge">{{ tag }}</span>')], A('ConsultMenuItem.vue', '④')),
      T('⑤ props.fee から computed<number> で feeWithTax（税込）を作り、「税込 6050円」と表示する', 3, re(/computed\s*<\s*number\s*>\s*\(/, Cd) && re(/props\.fee/, Cd) && re(/\{\{\s*feeWithTax\s*\}\}/, Cd) && /6050/.test(appText(c)), ['script で props を読むときは props.fee。props を変数に受けておく。', C('const feeWithTax = computed<number>(() => Math.round(props.fee * 1.1))', 'ts')], A('ConsultMenuItem.vue', '⑤')),
    ]; }));
  }

  /* ============ 4. props：親から子へ ============ */
  {
    const types = "export interface Hearing {\n  id: number\n  title: string\n  court: string\n  date: string\n}\n";
    const two = "[\n  { id: 1, title: '労働審判 第1回', court: '東京地方裁判所', date: '2026-12-03' },\n  { id: 2, title: '調停 第2回', court: '東京家庭裁判所', date: '2026-12-17' },\n]";
    set('props：親から子へ', mk('HearingSchedulePage.vue', {
      'App.vue': V("import { ref } from 'vue'\nimport HearingCard from '@/components/HearingCard.vue'\nimport type { Hearing } from '@/types'\n\n// ⑤ 期日が複数ある。hearing を hearings（ref<Hearing[]>）に変えて、v-for で並べる\nconst hearing = ref<Hearing>({ id: 1, title: '労働審判 第1回', court: '東京地方裁判所', date: '2026-12-03' })\n\n// ④ 期日を変更する関数 postpone を作り、日付を 2026-12-10 にする（ボタンは下の template）\n", '  <h3>今後の期日</h3>\n  <!-- ② 子に hearing を渡す（:hearing） -->\n  <HearingCard />\n  <!-- ④ 「日程を変更」ボタンを置いて、postpone を呼ぶ -->\n'),
      'HearingCard.vue': V("import type { Hearing } from '@/types'\n\n// ① 親から hearing（Hearing 型）を受け取る\n", '  <div class="card">\n    <!-- ③ 事件名・裁判所・日付を表示する（hearing.title など） -->\n  </div>\n'),
      'types.ts': types,
    }, {
      'App.vue': V("import { ref } from 'vue'\nimport HearingCard from '@/components/HearingCard.vue'\nimport type { Hearing } from '@/types'\n\nconst hearings = ref<Hearing[]>(" + two + ")\n\nfunction postpone(): void {\n  hearings.value[0].date = '2026-12-10'\n}\n", '  <h3>今後の期日</h3>\n  <HearingCard v-for="h in hearings" :key="h.id" :hearing="h" />\n  <button @click="postpone">日程を変更</button>\n'),
      'HearingCard.vue': V("import type { Hearing } from '@/types'\n\ndefineProps<{ hearing: Hearing }>()\n", '  <div class="card">\n    <b>{{ hearing.title }}</b>\n    {{ hearing.court }} / {{ hearing.date }}\n  </div>\n'),
      'types.ts': types,
    }, { 'App.vue': '親：期日の一覧（データを持つ）', 'HearingCard.vue': '子：期日1件（受け取って表示）', 'types.ts': '型：Hearing' },
    (v, c) => { const P = v['App.vue'], Cd = v['HearingCard.vue']; return [
      T('① HearingCard.vue で、defineProps<{ hearing: Hearing }>() と書いて hearing を受け取る', 1, re(/defineProps\s*<\s*\{[^}]*\bhearing\s*:\s*Hearing\b/, Cd), ['オブジェクトも、型を付けて props にできる。', C('defineProps<{ hearing: Hearing }>()', 'ts')], A('HearingCard.vue', '①')),
      T('② HearingSchedulePage.vue で、子に :hearing=… を渡す（親のデータを下へ）', 1, re(/<HearingCard\b[^>]*:hearing\s*=\s*["'][^"']+["']/, P), ['親のデータは :（v-bind）で子へ。', C('<HearingCard :hearing="hearing" />')], A('App.vue', '②')),
      T('③ HearingCard.vue で、{{ hearing.title }}・{{ hearing.court }}・{{ hearing.date }} を表示する', 1, re(/\{\{\s*hearing\.title\s*\}\}/, Cd) && re(/\{\{\s*hearing\.court\s*\}\}/, Cd) && re(/\{\{\s*hearing\.date\s*\}\}/, Cd) && /労働審判/.test(appText(c)), ['props は template ではそのまま名前で使える。', C('<b>{{ hearing.title }}</b>\n{{ hearing.court }} / {{ hearing.date }}')], A('HearingCard.vue', '③')),
      T('④ 親に postpone() を作って日付を書き換え、「日程を変更」ボタンで呼ぶ（データを変えるのは親）', 2, re(/(function\s+postpone|const\s+postpone\s*=)/, P) && re(/\.date\s*=\s*['"]2026-12-10['"]/, P) && re(/<button[^>]*@click\s*=\s*["']postpone/, P), ['データを持っている親が書き換えると、子の表示も自動で変わる。', C("function postpone(): void {\n  hearings.value[0].date = '2026-12-10'\n}", 'ts')], A('App.vue', '④')),
      T('⑤ hearing を hearings（ref<Hearing[]>）にして、v-for + :key で複数の期日を子へ渡す', 3, re(/ref\s*<\s*Hearing\[\]\s*>\s*\(/, P) && re(/<HearingCard[^>]*v-for=["'][^"']*\bin\s+hearings["']/, P) && re(/:key\s*=/, P) && re(/<HearingCard[^>]*:hearing\s*=/, P) && /調停/.test(appText(c)), ['配列の1件ずつを、そのまま :hearing に渡す。', C('<HearingCard v-for="h in hearings" :key="h.id" :hearing="h" />')], A('App.vue', '⑤')),
    ]; }));
  }

  /* ============ 5. emit：どんな困りごと？ ============ */
  {
    const types = "export interface WaitingCase {\n  id: number\n  client: string\n  topic: string\n  done: boolean\n}\n";
    const data = "ref<WaitingCase[]>([\n  { id: 1, client: '田中様', topic: '契約トラブル', done: false },\n  { id: 2, client: '高橋様', topic: '交通事故', done: false },\n])";
    set('emit：どんな困りごと？', mk('ReceptionBoardPage.vue', {
      'App.vue': V("import { ref } from 'vue'\nimport WaitingRow from '@/components/WaitingRow.vue'\nimport type { WaitingCase } from '@/types'\n\nconst cases = " + data + "\n\n// ④ markDone(id: number): 該当の案件の done を true にする関数（変えるのは親）\n// ⑤ removeCase(id: number): cases から該当を取り除く関数（filter で作り直す）\n", '  <!-- ③ 子の done イベントを受ける（@done） -->\n  <WaitingRow v-for="c in cases" :key="c.id" :item="c" />\n'),
      'WaitingRow.vue': V("import type { WaitingCase } from '@/types'\n\ndefineProps<{ item: WaitingCase }>()\n// ① 親へ知らせるイベント done（案件の id を送る）を defineEmits で宣言する\n// ⑤ 取り下げ用のイベント remove（id を送る）も宣言する\n", '  <div class="row">\n    <span :class="{ on: item.done }">{{ item.client }}：{{ item.topic }}</span>\n    <!-- ② 子が item.done を直接書き換えているのをやめて、emit で親にお願いする -->\n    <button @click="item.done = true">対応済み</button>\n    <button>取り下げ</button>\n  </div>\n'),
      'types.ts': types,
    }, {
      'App.vue': V("import { ref } from 'vue'\nimport WaitingRow from '@/components/WaitingRow.vue'\nimport type { WaitingCase } from '@/types'\n\nconst cases = " + data + "\n\nfunction markDone(id: number): void {\n  const target = cases.value.find((c) => c.id === id)\n  if (target) target.done = true\n}\n\nfunction removeCase(id: number): void {\n  cases.value = cases.value.filter((c) => c.id !== id)\n}\n", '  <WaitingRow v-for="c in cases" :key="c.id" :item="c" @done="markDone" @remove="removeCase" />\n'),
      'WaitingRow.vue': V("import type { WaitingCase } from '@/types'\n\ndefineProps<{ item: WaitingCase }>()\nconst emit = defineEmits<{ done: [id: number]; remove: [id: number] }>()\n", '  <div class="row">\n    <span :class="{ on: item.done }">{{ item.client }}：{{ item.topic }}</span>\n    <button @click="emit(\'done\', item.id)">対応済み</button>\n    <button @click="emit(\'remove\', item.id)">取り下げ</button>\n  </div>\n'),
      'types.ts': types,
    }, { 'App.vue': '親：案件リストの持ち主', 'WaitingRow.vue': '子：1行（直接は変えない）', 'types.ts': '型：WaitingCase' },
    (v) => { const P = v['App.vue'], Cd = v['WaitingRow.vue']; return [
      T('① WaitingRow.vue で、defineEmits<{ done: [id: number] }>() のようにイベント done を宣言する', 1, re(/defineEmits\s*<\s*\{[^}]*\bdone\s*:\s*\[\s*\w+\s*:\s*number\s*\]/, Cd), ['子から親へ「お願い」するイベントは、defineEmits で宣言する。', C('const emit = defineEmits<{ done: [id: number] }>()', 'ts')], A('WaitingRow.vue', '①')),
      T('② 「対応済み」ボタンは、item.done を直接書き換えず emit(\'done\', item.id) で親に知らせる', 1, re(/emit\(\s*['"]done['"]\s*,\s*item\.id\s*\)/, Cd) && !re(/item\.done\s*=[^=]/, Cd), ['props（item）を子が書き換えるのは禁止。イベントで頼む。', C("<button @click=\"emit('done', item.id)\">対応済み</button>")], A('WaitingRow.vue', '②')),
      T('③ ReceptionBoardPage.vue で、<WaitingRow> の @done を受ける', 1, re(/<WaitingRow\b[^>]*@done\s*=\s*["'][^"']+["']/, P), ['子のイベントは @イベント名 で受ける。', C('<WaitingRow … @done="markDone" />')], A('App.vue', '③')),
      T('④ 親に markDone(id: number) を作り、該当の案件の done を true にする', 2, re(/function\s+markDone\s*\(\s*id\s*:\s*number\s*\)/, P) && re(/\.done\s*=\s*true/, P) && re(/@done\s*=\s*["']markDone/, P), ['リストを持っている親だけが、中身を変える。', C("function markDone(id: number): void {\n  const target = cases.value.find((c) => c.id === id)\n  if (target) target.done = true\n}", 'ts')], A('App.vue', '④')),
      T('⑤ remove イベントも足す。子は emit(\'remove\', item.id)、親は filter で作り直して取り除く', 3, re(/defineEmits\s*<\s*\{[^}]*\bremove\s*:\s*\[\s*\w+\s*:\s*number\s*\]/, Cd) && re(/emit\(\s*['"]remove['"]\s*,\s*item\.id\s*\)/, Cd) && re(/cases\.value\s*=\s*cases\.value\.filter\(/, P) && re(/@remove\s*=\s*["']removeCase/, P), ['イベントが2種類になっても、宣言は1か所に並べて書ける。', C("defineEmits<{ done: [id: number]; remove: [id: number] }>()\n\ncases.value = cases.value.filter((c) => c.id !== id)", 'ts')], A('WaitingRow.vue', '⑤')),
    ]; }));
  }

  /* ============ 6. emit の書き方 ============ */
  {
    const types = "export interface Lawyer {\n  id: number\n  name: string\n  field: string\n}\n";
    const data = "const lawyers: Lawyer[] = [\n  { id: 1, name: '山田 太郎', field: '労働' },\n  { id: 2, name: '佐藤 花子', field: '相続' },\n  { id: 3, name: '鈴木 一郎', field: '労働' },\n]\nconst shown = ref<Lawyer[]>(lawyers)\n";
    const list = '  <p>{{ shown.length }} 人</p>\n  <div v-for="l in shown" :key="l.id" class="card">{{ l.name }}（{{ l.field }}）</div>\n';
    set('emit の書き方', mk('LawyerSearchPage.vue', {
      'App.vue': V("import { ref } from 'vue'\nimport SearchBox from '@/components/SearchBox.vue'\nimport type { Lawyer } from '@/types'\n\n" + data + "\n// ④ onSearch(keyword: string): 名前か分野に keyword を含む人だけを shown にする（filter + includes）\n// ⑤ onClear(): shown を全員に戻す\n", '  <!-- ③ SearchBox の search イベントを受ける（@search） -->\n  <SearchBox />\n' + list),
      'SearchBox.vue': V("import { ref } from 'vue'\n\nconst keyword = ref('')\n// ① search イベント（キーワード string を送る）を defineEmits で宣言する\n// ⑤ clear イベント（値なし）も宣言する\n", '  <input v-model="keyword" placeholder="名前・分野" />\n  <!-- ② 検索ボタンで、keyword を付けて search を emit する -->\n  <button>検索</button>\n  <button>クリア</button>\n'),
      'types.ts': types,
    }, {
      'App.vue': V("import { ref } from 'vue'\nimport SearchBox from '@/components/SearchBox.vue'\nimport type { Lawyer } from '@/types'\n\n" + data + "\nfunction onSearch(keyword: string): void {\n  shown.value = lawyers.filter((l) => l.name.includes(keyword) || l.field.includes(keyword))\n}\n\nfunction onClear(): void {\n  shown.value = lawyers\n}\n", '  <SearchBox @search="onSearch" @clear="onClear" />\n' + list),
      'SearchBox.vue': V("import { ref } from 'vue'\n\nconst keyword = ref('')\nconst emit = defineEmits<{ search: [keyword: string]; clear: [] }>()\n\nfunction clear(): void {\n  keyword.value = ''\n  emit('clear')\n}\n", '  <input v-model="keyword" placeholder="名前・分野" />\n  <button @click="emit(\'search\', keyword)">検索</button>\n  <button @click="clear">クリア</button>\n'),
      'types.ts': types,
    }, { 'App.vue': '親：弁護士の一覧と絞り込み', 'SearchBox.vue': '子：検索欄（結果は持たない）', 'types.ts': '型：Lawyer' },
    (v) => { const P = v['App.vue'], Cd = v['SearchBox.vue']; return [
      T('① SearchBox.vue で、defineEmits<{ search: [keyword: string] }>() と、値の型つきでイベントを宣言する', 1, re(/defineEmits\s*<\s*\{[^}]*\bsearch\s*:\s*\[\s*\w+\s*:\s*string\s*\]/, Cd), ['イベント名: [引数名: 型] の形で書く。', C('const emit = defineEmits<{ search: [keyword: string] }>()', 'ts')], A('SearchBox.vue', '①')),
      T('② 「検索」ボタンを押すと、emit(\'search\', keyword) で入力した言葉を親へ送る', 1, re(/emit\(\s*['"]search['"]\s*,\s*keyword(\.value)?\s*\)/, Cd) && re(/@click/, Cd), ['emit の2つ目の引数が、親に届く値。', C("<button @click=\"emit('search', keyword)\">検索</button>")], A('SearchBox.vue', '②')),
      T('③ LawyerSearchPage.vue で、<SearchBox> の @search を受ける', 1, re(/<SearchBox\b[^>]*@search\s*=\s*["'][^"']+["']/, P), ['親は @search="関数名" で受け取る。受け取る値は関数の引数になる。', C('<SearchBox @search="onSearch" />')], A('App.vue', '③')),
      T('④ onSearch(keyword: string) で、名前か分野に keyword を含む弁護士だけを shown にする', 2, re(/function\s+onSearch\s*\(\s*keyword\s*:\s*string\s*\)/, P) && re(/shown\.value\s*=\s*lawyers\.filter\(/, P) && re(/\.includes\(\s*keyword\s*\)/, P), ['受け取った keyword で、親が絞り込む。子は結果を知らない。', C('function onSearch(keyword: string): void {\n  shown.value = lawyers.filter((l) => l.name.includes(keyword) || l.field.includes(keyword))\n}', 'ts')], A('App.vue', '④')),
      T('⑤ 値なしの clear イベントを足す。子は emit(\'clear\')、親は onClear で全員に戻す', 3, re(/defineEmits\s*<\s*\{[^}]*\bsearch\b[^}]*\bclear\s*:\s*\[\s*\]/, Cd) && re(/emit\(\s*['"]clear['"]\s*\)/, Cd) && re(/<SearchBox\b[^>]*@clear\s*=/, P) && re(/shown\.value\s*=\s*lawyers\s*$/m, P), ['値が要らないイベントは [] と書く。複数あるときは ; で並べる。', C("defineEmits<{ search: [keyword: string]; clear: [] }>()", 'ts')], A('SearchBox.vue', '⑤')),
    ]; }));
  }

  /* ============ 7. emit：子から親へ ============ */
  {
    const base = "const slots: string[] = ['10:00', '11:00', '14:00', '15:30']\n";
    set('emit：子から親へ', mk('ConsultBookingPage.vue', {
      'App.vue': V("import { ref } from 'vue'\nimport TimeSlotButton from '@/components/TimeSlotButton.vue'\n\n" + base + "// ④ chosen を ref<string | null>(null) にして、未選択のときは「未選択」と表示する\nconst chosen = ref('')\n", '  <p>選択中: {{ chosen }}</p>\n  <!-- ③ 子の select イベントを受けて、chosen に入れる（@select） -->\n  <!-- ⑤ 選ばれている枠だけ目立たせるため、:selected を渡す -->\n  <TimeSlotButton v-for="s in slots" :key="s" :time="s" />\n'),
      'TimeSlotButton.vue': V("defineProps<{ time: string }>()\n// ① 時刻（string）を送る select イベントを defineEmits で宣言する\n// ⑤ props に selected（boolean）を足し、true のとき active クラスを付ける\n", '  <!-- ② クリックで、time を付けて select を emit する -->\n  <button>{{ time }}</button>\n'),
    }, {
      'App.vue': V("import { ref } from 'vue'\nimport TimeSlotButton from '@/components/TimeSlotButton.vue'\n\n" + base + "const chosen = ref<string | null>(null)\n", '  <p>選択中: {{ chosen ?? \'未選択\' }}</p>\n  <TimeSlotButton v-for="s in slots" :key="s" :time="s" :selected="s === chosen" @select="chosen = $event" />\n'),
      'TimeSlotButton.vue': V("defineProps<{ time: string; selected: boolean }>()\nconst emit = defineEmits<{ select: [time: string] }>()\n", '  <button :class="{ active: selected }" @click="emit(\'select\', time)">{{ time }}</button>\n'),
    }, { 'App.vue': '親：予約枠の一覧と、選んだ時刻', 'TimeSlotButton.vue': '子：時刻ボタン1つ' },
    (v, c) => { const P = v['App.vue'], Cd = v['TimeSlotButton.vue']; return [
      T('① TimeSlotButton.vue で、時刻（string）を送るイベント select を defineEmits で宣言する', 1, re(/defineEmits\s*<\s*\{[^}]*\bselect\s*:\s*\[\s*\w+\s*:\s*string\s*\]/, Cd), ['「選ばれた」ことを親に知らせるイベントを宣言する。', C('const emit = defineEmits<{ select: [time: string] }>()', 'ts')], A('TimeSlotButton.vue', '①')),
      T('② ボタンのクリックで、emit(\'select\', time) を呼ぶ', 1, re(/@click\s*=\s*["'][^"']*emit\(\s*['"]select['"]\s*,\s*time\s*\)/, Cd), ['クリックされた時刻を、emit の第2引数で渡す。', C("<button @click=\"emit('select', time)\">{{ time }}</button>")], A('TimeSlotButton.vue', '②')),
      T('③ ConsultBookingPage.vue で、<TimeSlotButton> の @select を受けて chosen を更新する', 1, re(/<TimeSlotButton\b[^>]*@select\s*=\s*["'][^"']*chosen[^"']*["']/, P) || re(/<TimeSlotButton\b[^>]*@select\s*=\s*["']\w+["']/, P), ['@select="chosen = $event" のように、届いた値（$event）を代入できる。', C('<TimeSlotButton … @select="chosen = $event" />')], A('App.vue', '③')),
      T('④ chosen を ref<string | null>(null) にして、未選択のときは「選択中: 未選択」と出す', 2, re(/ref\s*<\s*string\s*\|\s*null\s*>\s*\(\s*null\s*\)/, P) && /選択中:\s*未選択/.test(appText(c)), ['まだ何も選んでいない状態は null で表す。', C("const chosen = ref<string | null>(null)\n\n{{ chosen ?? '未選択' }}")], A('App.vue', '④')),
      T('⑤ 子に selected（boolean）を足し、親は :selected="s === chosen" を渡して、選ばれた枠を active にする', 3, re(/defineProps\s*<\s*\{[^}]*\bselected\s*:\s*boolean/, Cd) && re(/:class\s*=\s*["'][^"']*active[^"']*selected/, Cd) && re(/<TimeSlotButton\b[^>]*:selected\s*=\s*["']\s*s\s*===\s*chosen\s*["']/, P), ['親 → 子は props、子 → 親は emit。この2つが1周すると、画面が整う。', C('<TimeSlotButton … :selected="s === chosen" @select="chosen = $event" />')], A('TimeSlotButton.vue', '⑤')),
    ]; }));
  }

  /* ============ 8. v-model：どんな困りごと？ ============ */
  {
    const types = "export interface ConsultInput {\n  name: string\n  email: string\n}\n";
    set('v-model：どんな困りごと？', mk('ConsultForm.vue', {
      'App.vue': V("import { reactive } from 'vue'\nimport TextField from '@/components/TextField.vue'\nimport type { ConsultInput } from '@/types'\n\nconst form = reactive<ConsultInput>({ name: '', email: '' })\n// ⑤ 送信ボタン用に canSend（computed<boolean>）を作る: 名前が空でなく、メールに @ を含む\n", '  <!-- ④ 2つの欄を、form.name と form.email に v-model でつなぐ -->\n  <TextField label="お名前" />\n  <TextField label="メール" />\n  <p>入力中: {{ form.name }} / {{ form.email }}</p>\n  <button>相談を送る</button>\n'),
      'TextField.vue': V("defineProps<{ label: string }>()\n// ① 親の値を受け取る props: modelValue（string）を足す\n// ② 入力されたら親へ知らせるイベント update:modelValue を宣言し、onInput 関数で emit する\n", '  <label>\n    {{ label }}\n    <!-- ③ 入力欄に :value="modelValue" と @input="onInput" をつなぐ -->\n    <input />\n  </label>\n'),
      'types.ts': types,
    }, {
      'App.vue': V("import { reactive, computed } from 'vue'\nimport TextField from '@/components/TextField.vue'\nimport type { ConsultInput } from '@/types'\n\nconst form = reactive<ConsultInput>({ name: '', email: '' })\nconst canSend = computed<boolean>(() => form.name !== '' && form.email.includes('@'))\n", '  <TextField v-model="form.name" label="お名前" />\n  <TextField v-model="form.email" label="メール" />\n  <p>入力中: {{ form.name }} / {{ form.email }}</p>\n  <button :disabled="!canSend">相談を送る</button>\n'),
      'TextField.vue': V("defineProps<{ label: string; modelValue: string }>()\nconst emit = defineEmits<{ 'update:modelValue': [value: string] }>()\n\nfunction onInput(e: Event): void {\n  emit('update:modelValue', (e.target as HTMLInputElement).value)\n}\n", '  <label>\n    {{ label }}\n    <input :value="modelValue" @input="onInput" />\n  </label>\n'),
      'types.ts': types,
    }, { 'App.vue': '親：フォーム（値を持つ）', 'TextField.vue': '子：ラベル付き入力欄', 'types.ts': '型：ConsultInput' },
    (v) => { const P = v['App.vue'], Cd = v['TextField.vue']; return [
      T('① TextField.vue の defineProps に、modelValue（string）を足す', 1, re(/defineProps\s*<\s*\{[^}]*\bmodelValue\s*:\s*string/, Cd), ['v-model で渡る値は、modelValue という名前の props になる。', C('defineProps<{ label: string; modelValue: string }>()', 'ts')], A('TextField.vue', '①')),
      T('② update:modelValue イベントを宣言し、onInput で emit(\'update:modelValue\', 入力値) を呼ぶ', 1, re(/defineEmits\s*<\s*\{[^}]*['"]update:modelValue['"]\s*:\s*\[\s*\w+\s*:\s*string\s*\]/, Cd) && re(/function\s+onInput[\s\S]*emit\(\s*['"]update:modelValue['"]\s*,/, Cd), ['値が変わったことを、update:modelValue で親に返す。', C("const emit = defineEmits<{ 'update:modelValue': [value: string] }>()\n\nfunction onInput(e: Event): void {\n  emit('update:modelValue', (e.target as HTMLInputElement).value)\n}", 'ts')], A('TextField.vue', '②')),
      T('③ <input> に :value="modelValue" と @input="onInput" をつなぐ', 1, re(/<input\b[^>]*:value\s*=\s*["']modelValue["']/, Cd) && re(/<input\b[^>]*@input\s*=\s*["']onInput["']/, Cd), ['親から来た値を表示（:value）し、入力されたら知らせる（@input）。', C('<input :value="modelValue" @input="onInput" />')], A('TextField.vue', '③')),
      T('④ ConsultForm.vue で、2つの <TextField> に v-model="form.name" / v-model="form.email" を付ける', 2, re(/<TextField\b[^>]*v-model\s*=\s*["']form\.name["']/, P) && re(/<TextField\b[^>]*v-model\s*=\s*["']form\.email["']/, P), ['子に modelValue と update:modelValue があれば、親は v-model の1語で済む。', C('<TextField v-model="form.name" label="お名前" />')], A('App.vue', '④')),
      T('⑤ canSend（computed<boolean>）で「名前が空でなく、メールに @ を含む」ときだけ送信ボタンを有効にする', 3, re(/canSend\s*=\s*computed\s*<\s*boolean\s*>\s*\(/, P) && re(/form\.name\s*!==\s*['"]{2}/, P) && re(/form\.email\.includes\(\s*['"]@['"]\s*\)/, P) && re(/<button[^>]*:disabled\s*=\s*["']\s*!\s*canSend\s*["']/, P), ['入力値は親が持っているので、親で入力チェックの computed を作れる。', C("const canSend = computed<boolean>(() => form.name !== '' && form.email.includes('@'))\n\n<button :disabled=\"!canSend\">相談を送る</button>")], A('App.vue', '⑤')),
    ]; }));
  }

  /* ============ 9. v-model の正体：2本の管 ============ */
  {
    const longName = '<LabeledInput label="お名前" :modelValue="name" @update:modelValue="name = $event" />';
    const longMail = '<LabeledInput label="メール" :modelValue="email" @update:modelValue="email = $event" />';
    set('v-model の正体：2本の管', mk('ClientProfileForm.vue', {
      'App.vue': V("import { ref } from 'vue'\nimport LabeledInput from '@/components/LabeledInput.vue'\n\nconst name = ref<string>('')\nconst email = ref<string>('')\nconst phone = ref<string>('')\n// ⑤ onPhoneInput(value: string): ハイフンを取り除いた値（value.replace(/-/g, '')）を phone に入れる\n", '  <!-- ① 2本の管（:modelValue と @update:modelValue）を、v-model 1つに書き換える -->\n  ' + longName + '\n  <!-- ② こちらも v-model に -->\n  ' + longMail + '\n  <!-- ④ 逆に、v-model を2本の管に戻す（@update:modelValue は onPhoneInput を呼ぶ） -->\n  <LabeledInput label="電話" v-model="phone" />\n  <p>{{ name }} / {{ email }} / 電話: {{ phone }}</p>\n'),
      'LabeledInput.vue': V("defineProps<{ label: string; modelValue: string }>()\n// ③ 入力で update:modelValue を送れるようにする: defineEmits で宣言し、<input> の @input で emit する\n", '  <label>\n    {{ label }}\n    <input :value="modelValue" />\n  </label>\n'),
    }, {
      'App.vue': V("import { ref } from 'vue'\nimport LabeledInput from '@/components/LabeledInput.vue'\n\nconst name = ref<string>('')\nconst email = ref<string>('')\nconst phone = ref<string>('')\n\nfunction onPhoneInput(value: string): void {\n  phone.value = value.replace(/-/g, '')\n}\n", '  <LabeledInput v-model="name" label="お名前" />\n  <LabeledInput v-model="email" label="メール" />\n  <LabeledInput label="電話" :modelValue="phone" @update:modelValue="onPhoneInput" />\n  <p>{{ name }} / {{ email }} / 電話: {{ phone }}</p>\n'),
      'LabeledInput.vue': V("defineProps<{ label: string; modelValue: string }>()\nconst emit = defineEmits<{ 'update:modelValue': [value: string] }>()\n\nfunction onInput(e: Event): void {\n  emit('update:modelValue', (e.target as HTMLInputElement).value)\n}\n", '  <label>\n    {{ label }}\n    <input :value="modelValue" @input="onInput" />\n  </label>\n'),
    }, { 'App.vue': '親：v-model と2本の管、どちらでも書ける', 'LabeledInput.vue': '子：modelValue を受け、update:modelValue を返す' },
    (v) => { const P = v['App.vue'], Cd = v['LabeledInput.vue']; return [
      T('① 「お名前」の2本の管を、v-model="name" 1つに書き換える', 1, re(/<LabeledInput\b[^>]*v-model\s*=\s*["']name["']/, P) && !re(/:modelValue\s*=\s*["']name["']/, P), ['v-model="name" は、:modelValue="name" と @update:modelValue="name = $event" の省略形。', C('<LabeledInput v-model="name" label="お名前" />')], A('App.vue', '①')),
      T('② 「メール」も v-model="email" に書き換える', 1, re(/<LabeledInput\b[^>]*v-model\s*=\s*["']email["']/, P) && !re(/:modelValue\s*=\s*["']email["']/, P), ['同じ書き換えをもう一度。', C('<LabeledInput v-model="email" label="メール" />')], A('App.vue', '②')),
      T('③ LabeledInput.vue で update:modelValue を宣言し、入力のたびに emit する（子から親へ戻る管）', 1, re(/defineEmits\s*<\s*\{[^}]*['"]update:modelValue['"]/, Cd) && re(/emit\(\s*['"]update:modelValue['"]/, Cd) && re(/@input\s*=/, Cd), ['親 → 子（modelValue）の管だけでは、入力しても親の値が変わらない。', C("const emit = defineEmits<{ 'update:modelValue': [value: string] }>()")], A('LabeledInput.vue', '③')),
      T('④ 「電話」の v-model を、:modelValue="phone" と @update:modelValue="onPhoneInput" の2本の管に戻す', 2, !re(/v-model\s*=\s*["']phone["']/, P) && re(/<LabeledInput\b[^>]*:modelValue\s*=\s*["']phone["']/, P) && re(/<LabeledInput\b[^>]*@update:modelValue\s*=\s*["']onPhoneInput(\(\s*\$event\s*\))?["']/, P), ['2本に分けると、戻ってきた値を途中で加工できる。', C('<LabeledInput label="電話" :modelValue="phone" @update:modelValue="onPhoneInput" />')], A('App.vue', '④')),
      T('⑤ onPhoneInput(value: string) で、ハイフンを取り除いた値を phone に入れる', 3, re(/function\s+onPhoneInput\s*\(\s*value\s*:\s*string\s*\)/, P) && re(/phone\.value\s*=\s*value\.replace\(\s*\/-\/g\s*,\s*['"]{2}\s*\)/, P), ['戻ってくる値（value）を加工してから、自分の ref に入れる。', C("function onPhoneInput(value: string): void {\n  phone.value = value.replace(/-/g, '')\n}", 'ts')], A('App.vue', '⑤')),
    ]; }));
  }

  /* ============ 10. v-model の書き方 ============ */
  {
    const types = "export interface ReservationDraft {\n  name: string\n  age: number\n  topic: string\n  memo: string\n  agree: boolean\n}\n";
    const head = "import { reactive, computed } from 'vue'\nimport ReservationSummary from '@/components/ReservationSummary.vue'\nimport type { ReservationDraft } from '@/types'\n\nconst form = reactive<ReservationDraft>({ name: '', age: 30, topic: '離婚', memo: '', agree: false })\n";
    set('v-model の書き方', mk('ReservationFormPage.vue', {
      'App.vue': V(head.replace(', computed', '') + "// ⑤ canSubmit（computed<boolean>）を作る: 名前が空でなく、agree が true のとき true\n", '  <!-- ① お名前: 前後の空白を取り除く v-model.trim -->\n  <input placeholder="お名前" />\n  <!-- ② 相談分野: select を form.topic につなぐ -->\n  <select>\n    <option>離婚</option>\n    <option>相続</option>\n    <option>労働</option>\n  </select>\n  <!-- ④ 年齢: 数値として受け取る v-model.number -->\n  <input type="number" />\n  <textarea v-model="form.memo" placeholder="ご相談の概要"></textarea>\n  <!-- ③ 同意チェック: form.agree につなぐ（true / false） -->\n  <label><input type="checkbox" /> 個人情報の取り扱いに同意する</label>\n  <!-- ⑤ 条件を満たすまで送信できないようにする（:disabled） -->\n  <button>予約する</button>\n  <ReservationSummary :draft="form" />\n'),
      'ReservationSummary.vue': V("import type { ReservationDraft } from '@/types'\n\ndefineProps<{ draft: ReservationDraft }>()\n", '  <p>申込内容: {{ draft.name || \'（未入力）\' }}さん（{{ draft.age }}歳）／{{ draft.topic }}／同意: {{ draft.agree ? \'済\' : \'未\' }}</p>\n'),
      'types.ts': types,
    }, {
      'App.vue': V(head + "\nconst canSubmit = computed<boolean>(() => form.name !== '' && form.agree)\n", '  <input v-model.trim="form.name" placeholder="お名前" />\n  <select v-model="form.topic">\n    <option>離婚</option>\n    <option>相続</option>\n    <option>労働</option>\n  </select>\n  <input v-model.number="form.age" type="number" />\n  <textarea v-model="form.memo" placeholder="ご相談の概要"></textarea>\n  <label><input v-model="form.agree" type="checkbox" /> 個人情報の取り扱いに同意する</label>\n  <button :disabled="!canSubmit">予約する</button>\n  <ReservationSummary :draft="form" />\n'),
      'ReservationSummary.vue': V("import type { ReservationDraft } from '@/types'\n\ndefineProps<{ draft: ReservationDraft }>()\n", '  <p>申込内容: {{ draft.name || \'（未入力）\' }}さん（{{ draft.age }}歳）／{{ draft.topic }}／同意: {{ draft.agree ? \'済\' : \'未\' }}</p>\n'),
      'types.ts': types,
    }, { 'App.vue': '親：予約フォーム（form を1つ持つ）', 'ReservationSummary.vue': '子：入力内容の確認表示', 'types.ts': '型：ReservationDraft' },
    (v) => { const P = v['App.vue']; return [
      T('① お名前の <input> に v-model.trim="form.name" を付ける', 1, re(/<input\b[^>]*v-model\.trim\s*=\s*["']form\.name["']/, P), ['.trim を付けると、前後の空白が自動で取り除かれる。', C('<input v-model.trim="form.name" placeholder="お名前" />')], A('App.vue', '①')),
      T('② <select> に v-model="form.topic" を付ける', 1, re(/<select\b[^>]*v-model\s*=\s*["']form\.topic["']/, P), ['select は、選んだ option の値が入る。', C('<select v-model="form.topic">')], A('App.vue', '②')),
      T('③ チェックボックスに v-model="form.agree" を付ける（true / false が入る）', 1, re(/<input\b[^>]*type=["']checkbox["'][^>]*v-model\s*=\s*["']form\.agree["']/, P) || re(/<input\b[^>]*v-model\s*=\s*["']form\.agree["'][^>]*type=["']checkbox["']/, P), ['チェックボックス1つなら、boolean の値につなぐ。', C('<input v-model="form.agree" type="checkbox" />')], A('App.vue', '③')),
      T('④ 年齢の <input type="number"> に v-model.number="form.age" を付ける（数値のまま受け取る）', 2, re(/<input\b[^>]*v-model\.number\s*=\s*["']form\.age["']/, P), ['v-model は何もしないと文字列。.number で数値に変換される。', C('<input v-model.number="form.age" type="number" />')], A('App.vue', '④')),
      T('⑤ canSubmit（computed<boolean>）で「名前あり・同意済み」を判定し、送信ボタンを :disabled にする', 3, re(/canSubmit\s*=\s*computed\s*<\s*boolean\s*>\s*\(/, P) && re(/form\.name\s*!==\s*['"]{2}/, P) && re(/canSubmit\s*=\s*computed[^\n]*form\.agree/, P) && re(/<button[^>]*:disabled\s*=\s*["']\s*!\s*canSubmit\s*["']/, P), ['v-model でつないだ form の値を、computed で読める。', C("const canSubmit = computed<boolean>(() => form.name !== '' && form.agree)\n\n<button :disabled=\"!canSubmit\">予約する</button>")], A('App.vue', '⑤')),
    ]; }));
  }

  /* ============ 11. v-model を部品に ============ */
  {
    const areas = "['東京都', '大阪府', '愛知県']", fields = "['労働', '相続', '離婚']";
    const view = '  <AreaSelect v-model="prefecture" :options="prefectures" />\n  <AreaSelect v-model="field" :options="fields" />\n  <p>{{ prefecture }}の{{ field }}に強い事務所を探します</p>\n';
    set('v-model を部品に', mk('OfficeSearchPage.vue', {
      'App.vue': V("import { ref } from 'vue'\nimport AreaSelect from '@/components/AreaSelect.vue'\n\nconst prefectures: string[] = " + areas + "\nconst fields: string[] = " + fields + "\n// ④ prefecture を ref<string>('東京都') にする（初期値が選ばれた状態に）\nconst prefecture = ref('')\nconst field = ref<string>('労働')\n", '  <!-- ③ 都道府県の選択に v-model="prefecture" をつなぐ（2つ目は v-model="field" と :options="fields"） -->\n  <AreaSelect />\n  <AreaSelect />\n  <p>{{ prefecture }}の{{ field }}に強い事務所を探します</p>\n'),
      'AreaSelect.vue': V("// ① defineModel<string>() で、親の v-model の値を受け取る（model という名前の ref のように使える）\n// ⑤ 選択肢を props（options: string[]）で受け取る形にする\n", '  <!-- ② select を model につなぐ（v-model="model"） -->\n  <select>\n    <option>東京都</option>\n    <option>大阪府</option>\n    <option>愛知県</option>\n  </select>\n'),
    }, {
      'App.vue': V("import { ref } from 'vue'\nimport AreaSelect from '@/components/AreaSelect.vue'\n\nconst prefectures: string[] = " + areas + "\nconst fields: string[] = " + fields + "\nconst prefecture = ref<string>('東京都')\nconst field = ref<string>('労働')\n", view),
      'AreaSelect.vue': V("defineProps<{ options: string[] }>()\nconst model = defineModel<string>()\n", '  <select v-model="model">\n    <option v-for="o in options" :key="o" :value="o">{{ o }}</option>\n  </select>\n'),
    }, { 'App.vue': '親：条件を選ぶ画面', 'AreaSelect.vue': '子：defineModel で作った選択部品' },
    (v, c) => { const P = v['App.vue'], Cd = v['AreaSelect.vue']; return [
      T('① AreaSelect.vue で、const model = defineModel<string>() を書く', 1, re(/const\s+model\s*=\s*defineModel\s*<\s*string\s*>\s*\(\s*\)/, Cd), ['props と emit のセットを、defineModel が1行で代わりにやってくれる。', C('const model = defineModel<string>()', 'ts')], A('AreaSelect.vue', '①')),
      T('② <select> に v-model="model" を付ける', 1, re(/<select\b[^>]*v-model\s*=\s*["']model["']/, Cd), ['model は ref のように読み書きできる。部品の中でも v-model が使える。', C('<select v-model="model">')], A('AreaSelect.vue', '②')),
      T('③ OfficeSearchPage.vue で、<AreaSelect> に v-model="prefecture" を付ける', 1, re(/<AreaSelect\b[^>]*v-model\s*=\s*["']prefecture["']/, P), ['使う側は、普通の入力欄と同じ v-model でつなぐだけ。', C('<AreaSelect v-model="prefecture" />')], A('App.vue', '③')),
      T('④ prefecture を ref<string>(\'東京都\') にして、最初から「東京都」が選ばれる（画面にも出る）', 2, re(/prefecture\s*=\s*ref\s*<\s*string\s*>\s*\(\s*['"]東京都['"]\s*\)/, P) && /東京都の/.test(appText(c)), ['v-model の値の初期値が、そのまま最初の選択になる。', C("const prefecture = ref<string>('東京都')", 'ts')], A('App.vue', '④')),
      T('⑤ options（string[]）を props で受けて v-for し、2つの <AreaSelect> に別々の :options を渡す', 3, re(/defineProps\s*<\s*\{[^}]*\boptions\s*:\s*string\[\]/, Cd) && re(/v-for\s*=\s*["']\s*\w+\s+in\s+options["']/, Cd) && count(/<AreaSelect\b[^>]*:options\s*=/g, P) >= 2 && re(/<AreaSelect\b[^>]*v-model\s*=\s*["']field["']/, P), ['v-model（値）と props（選択肢）は、1つの部品で一緒に使える。', C('<AreaSelect v-model="field" :options="fields" />')], A('AreaSelect.vue', '⑤')),
    ]; }));
  }

  /* ============ 12. 入力部品カタログ ============ */
  {
    set('入力部品カタログ', mk('LawyerReviewPage.vue', {
      'App.vue': V("import { ref } from 'vue'\nimport RatingStars from '@/components/RatingStars.vue'\nimport QuantityStepper from '@/components/QuantityStepper.vue'\n\nconst rating = ref<number>(3)\nconst people = ref<number>(1)\n", '  <h3>弁護士への口コミ</h3>\n  <p>満足度: <RatingStars v-model="rating" /> {{ rating }} / 5</p>\n  <p>同席人数: <QuantityStepper v-model="people" :min="1" :max="5" /></p>\n'),
      'RatingStars.vue': V("// ① 星の数（number）を受け取る: defineModel<number>()\n", '  <!-- ② 星をクリックすると、その数が model に入る。n 以下の星に on クラスを付ける -->\n  <span v-for="n in 5" :key="n">★</span>\n'),
      'QuantityStepper.vue': V("// ③ 数（number）を受け取る: defineModel<number>()\n// ⑤ props に min と max（number）を足し、下限・上限でボタンを :disabled にする\n", '  <!-- ④ 「－」で model を1減らし、「＋」で1増やす（@click） -->\n  <button>－</button>\n  <b>{{ model }}</b>\n  <button>＋</button>\n'),
    }, {
      'App.vue': V("import { ref } from 'vue'\nimport RatingStars from '@/components/RatingStars.vue'\nimport QuantityStepper from '@/components/QuantityStepper.vue'\n\nconst rating = ref<number>(3)\nconst people = ref<number>(1)\n", '  <h3>弁護士への口コミ</h3>\n  <p>満足度: <RatingStars v-model="rating" /> {{ rating }} / 5</p>\n  <p>同席人数: <QuantityStepper v-model="people" :min="1" :max="5" /></p>\n'),
      'RatingStars.vue': V("const model = defineModel<number>()\n", '  <span v-for="n in 5" :key="n" :class="{ on: n <= (model ?? 0) }" @click="model = n">★</span>\n'),
      'QuantityStepper.vue': V("defineProps<{ min: number; max: number }>()\nconst model = defineModel<number>()\n", '  <button :disabled="model <= min" @click="model = model - 1">－</button>\n  <b>{{ model }}</b>\n  <button :disabled="model >= max" @click="model = model + 1">＋</button>\n'),
    }, { 'App.vue': '親：口コミ入力画面（v-model で使うだけ）', 'RatingStars.vue': '子：星で選ぶ入力部品', 'QuantityStepper.vue': '子：＋／－で数える入力部品' },
    (v) => { const R = v['RatingStars.vue'], Q = v['QuantityStepper.vue']; return [
      T('① RatingStars.vue で、const model = defineModel<number>() を書く', 1, re(/const\s+model\s*=\s*defineModel\s*<\s*number\s*>\s*\(\s*\)/, R), ['値が number の入力部品なので、型は number。', C('const model = defineModel<number>()', 'ts')], A('RatingStars.vue', '①')),
      T('② 星をクリックすると @click="model = n"、n 以下の星に :class で on を付ける', 1, re(/@click\s*=\s*["']model\s*=\s*n["']/, R) && re(/:class\s*=\s*["'][^"']*on\s*:\s*n\s*<=/, R), ['クリックした星の番号を、そのまま model に代入すると親にも伝わる。', C('<span v-for="n in 5" :key="n" :class="{ on: n <= (model ?? 0) }" @click="model = n">★</span>')], A('RatingStars.vue', '②')),
      T('③ QuantityStepper.vue で、const model = defineModel<number>() を書く', 1, re(/const\s+model\s*=\s*defineModel\s*<\s*number\s*>\s*\(\s*\)/, Q), ['RatingStars と同じ形。部品が変わっても、defineModel の書き方は同じ。', C('const model = defineModel<number>()', 'ts')], A('QuantityStepper.vue', '③')),
      T('④ 「－」は model を1減らし、「＋」は1増やす（@click）', 2, re(/@click\s*=\s*["']model\s*(=\s*model\s*-\s*1|-=\s*1|--)["']/, Q) && re(/@click\s*=\s*["']model\s*(=\s*model\s*\+\s*1|\+=\s*1|\+\+)["']/, Q), ['model への代入が、そのまま「親の値を変える」ことになる。', C('<button @click="model = model - 1">－</button>\n<button @click="model = model + 1">＋</button>')], A('QuantityStepper.vue', '④')),
      T('⑤ props に min / max（number）を足し、下限・上限に来たら該当のボタンを :disabled にする', 3, re(/defineProps\s*<\s*\{[^}]*\bmin\s*:\s*number[^}]*\bmax\s*:\s*number/, Q) && re(/<button[^>]*:disabled\s*=\s*["']model\s*<=\s*min["']/, Q) && re(/<button[^>]*:disabled\s*=\s*["']model\s*>=\s*max["']/, Q), ['v-model（値）と props（範囲）を1つの部品で組み合わせる。', C('<button :disabled="model <= min" @click="model = model - 1">－</button>')], A('QuantityStepper.vue', '⑤')),
    ]; }));
  }

  /* ============ 13. v-model のつまずき ============ */
  {
    const data = "const name = ref<string>('山田 太郎')\nconst age = ref<number>(40)\nconst aliases = ref<string[]>(['やまだ', 'ヤマダ'])\n";
    set('v-model のつまずき', mk('LawyerEditPage.vue', {
      'App.vue': V("import { ref } from 'vue'\nimport EditableField from '@/components/EditableField.vue'\n\n" + data, '  <!-- ① 入力しても name が変わらない（1本目の管しかない）。直す -->\n  <EditableField :modelValue="name" />\n  <!-- ④ 年齢が文字列になってしまう。直す -->\n  <input v-model="age" type="number" />\n  <!-- ⑤ 別名を編集しても aliases が変わらない（v-for の変数に v-model）。直す -->\n  <EditableField v-for="a in aliases" :key="a" v-model="a" />\n  <p>{{ name }}（{{ age }}歳）別名: {{ aliases.join(\'、\') }} ／ 年齢の型: {{ typeof age }}</p>\n'),
      'EditableField.vue': V("const props = defineProps<{ modelValue: string }>()\nconst emit = defineEmits<{ 'update:modelValue': [value: string] }>()\n\nfunction onInput(e: Event): void {\n  // ② イベント名が違う。親に届かない。直す\n  emit('update:value', (e.target as HTMLInputElement).value)\n}\n", '  <span>\n    <input :value="modelValue" @input="onInput" />\n    <!-- ③ 子が props を直接書き換えている。emit に直す -->\n    <button @click="props.modelValue = \'\'">クリア</button>\n  </span>\n'),
    }, {
      'App.vue': V("import { ref } from 'vue'\nimport EditableField from '@/components/EditableField.vue'\n\n" + data, '  <EditableField v-model="name" />\n  <input v-model.number="age" type="number" />\n  <EditableField v-for="(a, i) in aliases" :key="i" v-model="aliases[i]" />\n  <p>{{ name }}（{{ age }}歳）別名: {{ aliases.join(\'、\') }} ／ 年齢の型: {{ typeof age }}</p>\n'),
      'EditableField.vue': V("const props = defineProps<{ modelValue: string }>()\nconst emit = defineEmits<{ 'update:modelValue': [value: string] }>()\n\nfunction onInput(e: Event): void {\n  emit('update:modelValue', (e.target as HTMLInputElement).value)\n}\n", '  <span>\n    <input :value="modelValue" @input="onInput" />\n    <button @click="emit(\'update:modelValue\', \'\')">クリア</button>\n  </span>\n'),
    }, { 'App.vue': '親：編集画面（バグが3つ以上ある）', 'EditableField.vue': '子：編集できる入力欄（バグあり）' },
    (v) => { const P = v['App.vue'], Cd = v['EditableField.vue']; return [
      T('① LawyerEditPage.vue：名前の部品に v-model="name" を付ける（親へ戻る管をつなぐ）', 1, re(/<EditableField\b[^>]*v-model\s*=\s*["']name["']/, P), [':modelValue だけだと、親 → 子の一方通行。入力しても親の値は変わらない。', C('<EditableField v-model="name" />')], A('App.vue', '①')),
      T('② EditableField.vue：emit のイベント名を \'update:modelValue\' に直す', 1, re(/function\s+onInput[\s\S]*?emit\(\s*['"]update:modelValue['"]\s*,/, Cd) && !re(/emit\(\s*['"]update:value['"]/, Cd), ['v-model の戻りのイベント名は update:modelValue と決まっている。1文字違うと届かない。', C("emit('update:modelValue', (e.target as HTMLInputElement).value)", 'ts')], A('EditableField.vue', '②')),
      T('③ EditableField.vue：クリアで props を直接書き換えず、emit(\'update:modelValue\', \'\') にする', 1, !re(/props\.modelValue\s*=[^=]/, Cd) && re(/emit\(\s*['"]update:modelValue['"]\s*,\s*['"]{2}\s*\)/, Cd), ['子は props を変えられない。変えたいときは、親にお願い（emit）する。', C("<button @click=\"emit('update:modelValue', '')\">クリア</button>")], A('EditableField.vue', '③')),
      T('④ 年齢の <input type="number"> に .number を付けて、数値のまま受け取る（「年齢の型: number」）', 2, re(/<input\b[^>]*v-model\.number\s*=\s*["']age["']/, P), ['.number を付けないと、入力した瞬間に文字列に変わる。', C('<input v-model.number="age" type="number" />')], A('App.vue', '④')),
      T('⑤ v-for の変数 a への v-model をやめ、v-model="aliases[i]" のように配列の要素につなぐ', 3, re(/v-for\s*=\s*["']\s*\(\s*\w+\s*,\s*i\s*\)\s+in\s+aliases["']/, P) && re(/<EditableField\b[^>]*v-model\s*=\s*["']aliases\[\s*i\s*\]["']/, P), ['v-for の変数は、書き換えても元の配列には戻らない。配列の何番目かを指して書く。', C('<EditableField v-for="(a, i) in aliases" :key="i" v-model="aliases[i]" />')], A('App.vue', '⑤')),
    ]; }));
  }

  /* ============ 14. 使い分け：どう渡す？ ============ */
  {
    const types = "export interface CaseRow {\n  id: number\n  title: string\n  lawyer: string\n  archived: boolean\n}\n";
    const data = "const cases = ref<CaseRow[]>([\n  { id: 1, title: '離婚の相談', lawyer: '山田 太郎', archived: false },\n  { id: 2, title: '相続の相談', lawyer: '佐藤 花子', archived: false },\n  { id: 3, title: '労働の相談', lawyer: '鈴木 一郎', archived: false },\n])\nconst keyword = ref<string>('')\n";
    const fnArchive = "function archive(id: number): void {\n  const target = cases.value.find((c) => c.id === id)\n  if (target) target.archived = true\n}\n";
    set('使い分け：どう渡す？', mk('CaseBoardPage.vue', {
      'App.vue': V("import { ref } from 'vue'\nimport CaseItem from '@/components/CaseItem.vue'\nimport KeywordInput from '@/components/KeywordInput.vue'\nimport type { CaseRow } from '@/types'\n\n" + data + "\n" + fnArchive + "// ⑤ 一覧に出すのは「アーカイブしていない & タイトルに keyword を含む」案件だけ: visibleCases（computed<CaseRow[]>）\n", '  <!-- ④ 検索欄は v-model、カードには値を props（:id :title :lawyer）で渡し、@archive を受ける -->\n  <KeywordInput />\n  <CaseItem v-for="c in cases" :key="c.id" />\n'),
      'CaseItem.vue': V("// ① 親から表示用の値を受け取る（props）: id（number）・title・lawyer（string）\n// ② 「アーカイブ」を押したことを親へ知らせるイベント archive（id を送る）を宣言する\n", '  <div class="card">\n    <b>{{ title }}</b> 担当: {{ lawyer }}\n    <button>アーカイブ</button>\n  </div>\n'),
      'KeywordInput.vue': V("// ③ 親と値を共有する入力部品にする: defineModel<string>()\n", '  <input placeholder="案件名で検索" />\n'),
      'types.ts': types,
    }, {
      'App.vue': V("import { ref, computed } from 'vue'\nimport CaseItem from '@/components/CaseItem.vue'\nimport KeywordInput from '@/components/KeywordInput.vue'\nimport type { CaseRow } from '@/types'\n\n" + data + "\n" + fnArchive + "\nconst visibleCases = computed<CaseRow[]>(() =>\n  cases.value.filter((c) => !c.archived && c.title.includes(keyword.value)),\n)\n", '  <KeywordInput v-model="keyword" />\n  <CaseItem v-for="c in visibleCases" :key="c.id" :id="c.id" :title="c.title" :lawyer="c.lawyer" @archive="archive" />\n'),
      'CaseItem.vue': V("defineProps<{ id: number; title: string; lawyer: string }>()\nconst emit = defineEmits<{ archive: [id: number] }>()\n", '  <div class="card">\n    <b>{{ title }}</b> 担当: {{ lawyer }}\n    <button @click="emit(\'archive\', id)">アーカイブ</button>\n  </div>\n'),
      'KeywordInput.vue': V("const model = defineModel<string>()\n", '  <input v-model="model" placeholder="案件名で検索" />\n'),
      'types.ts': types,
    }, { 'App.vue': '親：案件ボード（状態を持つ）', 'CaseItem.vue': '子：案件カード（表示＋通知）', 'KeywordInput.vue': '子：検索欄（値を共有）', 'types.ts': '型：CaseRow' },
    (v) => { const P = v['App.vue'], I = v['CaseItem.vue'], Kw = v['KeywordInput.vue']; return [
      T('① CaseItem.vue：表示用の値 id（number）・title・lawyer（string）を props で受け取る（親 → 子）', 1, re(/defineProps\s*<\s*\{[^}]*\bid\s*:\s*number/, I) && re(/defineProps\s*<\s*\{[^}]*\btitle\s*:\s*string/, I) && re(/defineProps\s*<\s*\{[^}]*\blawyer\s*:\s*string/, I), ['表示するだけのデータは props。', C('defineProps<{ id: number; title: string; lawyer: string }>()', 'ts')], A('CaseItem.vue', '①')),
      T('② CaseItem.vue：archive イベント（id を送る）を宣言し、ボタンで emit する（子 → 親）', 1, re(/defineEmits\s*<\s*\{[^}]*\barchive\s*:\s*\[\s*\w+\s*:\s*number\s*\]/, I) && re(/@click\s*=\s*["'][^"']*emit\(\s*['"]archive['"]\s*,\s*id\s*\)/, I), ['「押したよ」という通知は emit。', C("const emit = defineEmits<{ archive: [id: number] }>()\n\n<button @click=\"emit('archive', id)\">アーカイブ</button>")], A('CaseItem.vue', '②')),
      T('③ KeywordInput.vue：const model = defineModel<string>() と書き、<input v-model="model"> にする（親子で編集する値）', 1, re(/const\s+model\s*=\s*defineModel\s*<\s*string\s*>\s*\(\s*\)/, Kw) && re(/<input\b[^>]*v-model\s*=\s*["']model["']/, Kw), ['親と子で同じ値を編集するなら v-model（defineModel）。', C('const model = defineModel<string>()\n\n<input v-model="model" placeholder="案件名で検索" />')], A('KeywordInput.vue', '③')),
      T('④ CaseBoardPage.vue：検索欄に v-model="keyword"、カードに :id :title :lawyer と @archive="archive" をつなぐ', 2, re(/<KeywordInput\b[^>]*v-model\s*=\s*["']keyword["']/, P) && re(/<CaseItem\b[^>]*:title\s*=/, P) && re(/<CaseItem\b[^>]*:lawyer\s*=/, P) && re(/<CaseItem\b[^>]*:id\s*=/, P) && re(/<CaseItem\b[^>]*@archive\s*=\s*["']archive["']/, P), ['3つの渡し方を1つの画面でそろえる。', C('<KeywordInput v-model="keyword" />\n<CaseItem v-for="c in cases" :key="c.id" :id="c.id" :title="c.title" :lawyer="c.lawyer" @archive="archive" />')], A('App.vue', '④')),
      T('⑤ visibleCases（computed<CaseRow[]>）で「アーカイブ前 & タイトルに keyword を含む」案件だけにし、v-for でそれを回す', 3, re(/visibleCases\s*=\s*computed\s*<\s*CaseRow\[\]\s*>/, P) && re(/!\s*c\.archived/, P) && re(/\.includes\(\s*keyword\.value\s*\)/, P) && re(/<CaseItem\b[^>]*v-for\s*=\s*["'][^"']*\bin\s+visibleCases["']/, P), ['元の配列は変えず、表示用の配列を computed で作る。', C('const visibleCases = computed<CaseRow[]>(() =>\n  cases.value.filter((c) => !c.archived && c.title.includes(keyword.value)),\n)', 'ts')], A('App.vue', '⑤')),
    ]; }));
  }

  /* ============ 15. 実践：カード部品 ============ */
  {
    const types = "export interface Lawyer {\n  id: number\n  name: string\n  field: string\n  fee: number\n  online: boolean\n}\n";
    const data = "const lawyers = ref<Lawyer[]>([\n  { id: 1, name: '山田 太郎', field: '労働問題', fee: 5500, online: true },\n  { id: 2, name: '佐藤 花子', field: '相続', fee: 11000, online: false },\n])\n";
    set('実践：カード部品', mk('LawyerCatalogPage.vue', {
      'App.vue': V("import { ref } from 'vue'\nimport LawyerCard from '@/components/LawyerCard.vue'\nimport type { Lawyer } from '@/types'\n\n" + data + "const message = ref<string>('')\n// ⑤ 予約済みの id を reservedIds（ref<number[]>）に覚え、onReserve で追加する（同じ人は重複させない）\n\nfunction onReserve(id: number): void {\n  const l = lawyers.value.find((x) => x.id === id)\n  if (l) message.value = l.name + '弁護士の予約を受け付けました'\n}\n", '  <!-- ④ カードの reserve イベントを受ける（@reserve="onReserve"）。⑤ では :reserved も渡す -->\n  <LawyerCard v-for="l in lawyers" :key="l.id" :lawyer="l" />\n  <p>{{ message }}</p>\n'),
      'LawyerCard.vue': V("import StatusBadge from '@/components/StatusBadge.vue'\nimport type { Lawyer } from '@/types'\n\n// ② 親から lawyer（Lawyer 型）を受け取る\n// ④ 「予約する」を押したら、弁護士の id を付けて reserve イベントを出す\n// ⑤ props に reserved（boolean）を足し、予約済みならボタンを :disabled にして「予約済み」と出す\n", '  <div class="card">\n    <!-- ③ 名前・分野・料金（◯円）と、<StatusBadge :online="…" /> を表示する -->\n    <button>予約する</button>\n  </div>\n'),
      'StatusBadge.vue': V("// ① online（boolean）を受け取る\n", '  <!-- ① online が true なら「オンライン可」、false なら「対面のみ」と出す -->\n  <span class="badge"></span>\n'),
      'types.ts': types,
    }, {
      'App.vue': V("import { ref } from 'vue'\nimport LawyerCard from '@/components/LawyerCard.vue'\nimport type { Lawyer } from '@/types'\n\n" + data + "const message = ref<string>('')\nconst reservedIds = ref<number[]>([])\n\nfunction onReserve(id: number): void {\n  if (!reservedIds.value.includes(id)) reservedIds.value.push(id)\n  const l = lawyers.value.find((x) => x.id === id)\n  if (l) message.value = l.name + '弁護士の予約を受け付けました'\n}\n", '  <LawyerCard v-for="l in lawyers" :key="l.id" :lawyer="l" :reserved="reservedIds.includes(l.id)" @reserve="onReserve" />\n  <p>{{ message }}</p>\n'),
      'LawyerCard.vue': V("import StatusBadge from '@/components/StatusBadge.vue'\nimport type { Lawyer } from '@/types'\n\nconst props = defineProps<{ lawyer: Lawyer; reserved: boolean }>()\nconst emit = defineEmits<{ reserve: [id: number] }>()\n", '  <div class="card">\n    <b>{{ props.lawyer.name }}</b>（{{ props.lawyer.field }}）{{ props.lawyer.fee }}円\n    <StatusBadge :online="props.lawyer.online" />\n    <button :disabled="reserved" @click="emit(\'reserve\', props.lawyer.id)">{{ reserved ? \'予約済み\' : \'予約する\' }}</button>\n  </div>\n'),
      'StatusBadge.vue': V("defineProps<{ online: boolean }>()\n", '  <span class="badge">{{ online ? \'オンライン可\' : \'対面のみ\' }}</span>\n'),
      'types.ts': types,
    }, { 'App.vue': '親：弁護士一覧と予約の状態', 'LawyerCard.vue': '子：弁護士カード（表示＋予約通知）', 'StatusBadge.vue': '孫：オンライン可否のバッジ', 'types.ts': '型：Lawyer' },
    (v, c) => { const P = v['App.vue'], Cd = v['LawyerCard.vue'], B = v['StatusBadge.vue']; return [
      T('① StatusBadge.vue：online（boolean）を props で受け、「オンライン可」／「対面のみ」を出す', 1, re(/defineProps\s*<\s*\{[^}]*\bonline\s*:\s*boolean/, B) && /オンライン可/.test(B) && /対面のみ/.test(B), ['小さな部品は、props 1つだけでもよい。', C("defineProps<{ online: boolean }>()\n\n<span class=\"badge\">{{ online ? 'オンライン可' : '対面のみ' }}</span>")], A('StatusBadge.vue', '①')),
      T('② LawyerCard.vue：defineProps<{ lawyer: Lawyer }>() で弁護士1人ぶんを受け取る', 1, re(/defineProps\s*<\s*\{[^}]*\blawyer\s*:\s*Lawyer\b/, Cd), ['バラバラの props より、1つのオブジェクトで受けるとすっきりする。', C('defineProps<{ lawyer: Lawyer }>()', 'ts')], A('LawyerCard.vue', '②')),
      T('③ LawyerCard.vue：名前・分野・料金（◯円）を表示し、<StatusBadge :online="…" /> を使う', 1, re(/\{\{\s*(props\.)?lawyer\.name\s*\}\}/, Cd) && re(/\{\{\s*(props\.)?lawyer\.field\s*\}\}/, Cd) && re(/\{\{\s*(props\.)?lawyer\.fee\s*\}\}\s*円/, Cd) && re(/<StatusBadge\b[^>]*:online\s*=\s*["'](props\.)?lawyer\.online["']/, Cd) && /5500円/.test(appText(c)), ['部品の中で別の部品を使ってもよい。必要な値だけを渡す。', C('{{ lawyer.name }}（{{ lawyer.field }}）{{ lawyer.fee }}円\n<StatusBadge :online="lawyer.online" />')], A('LawyerCard.vue', '③')),
      T('④ 「予約する」で emit(\'reserve\', id) を出し、親は @reserve で「◯◯弁護士の予約を受け付けました」を出す', 2, re(/defineEmits\s*<\s*\{[^}]*\breserve\s*:\s*\[\s*\w+\s*:\s*number\s*\]/, Cd) && re(/emit\(\s*['"]reserve['"]\s*,\s*(props\.)?lawyer\.id\s*\)/, Cd) && re(/<LawyerCard\b[^>]*@reserve\s*=\s*["']onReserve["']/, P), ['予約を確定する（データを変える）のは親の仕事。子は通知するだけ。', C("const emit = defineEmits<{ reserve: [id: number] }>()\n\n<button @click=\"emit('reserve', lawyer.id)\">予約する</button>", 'vue')], A('LawyerCard.vue', '④')),
      T('⑤ 親の reservedIds（ref<number[]>）に予約済みを覚え、:reserved を渡して、子はそのボタンを :disabled にする', 3, re(/reservedIds\s*=\s*ref\s*<\s*number\[\]\s*>\s*\(/, P) && re(/reservedIds\.value\.(push|includes)/, P) && re(/!\s*reservedIds\.value\.includes\(\s*id\s*\)/, P) && re(/<LawyerCard\b[^>]*:reserved\s*=\s*["']reservedIds\.includes\(\s*l\.id\s*\)["']/, P) && re(/defineProps\s*<\s*\{[^}]*\breserved\s*:\s*boolean/, Cd) && re(/<button[^>]*:disabled\s*=\s*["']reserved["']/, Cd), ['親 → 子（props）と 子 → 親（emit）が、ぐるっと1周する形。', C('<LawyerCard … :reserved="reservedIds.includes(l.id)" @reserve="onReserve" />')], A('App.vue', '⑤')),
    ]; }));
  }

  /* ============ 16. 実例：画面を部品に切る ============ */
  {
    const tiles = '  <div class="tile"><span>新規</span> <b>5</b></div>\n  <div class="tile"><span>対応中</span> <b>12</b></div>\n  <div class="tile"><span>完了</span> <b>30</b></div>\n';
    const items = "const cases = ref<{ id: number; title: string }[]>([\n  { id: 1, title: '離婚の相談' },\n  { id: 2, title: '労働の相談' },\n])\n";
    set('実例：画面を部品に切る', mk('CaseDashboardPage.vue', {
      'App.vue': V("import { ref } from 'vue'\n// ③ PageHeader と SummaryTile を import する（'@/components/…'）\n// ⑤ CaseRow も import し、open イベントを受けて opened に案件名を入れる\n\n" + items + "const opened = ref<string>('')\n", '  <!-- ③ この <header> を <PageHeader title="…" /> に置き換える -->\n  <header><h1>相談案件ダッシュボード</h1></header>\n  <!-- ④ 下のコピペ3つを <SummaryTile> に置き換える -->\n' + tiles + '  <!-- ⑤ この一覧を <CaseRow> に置き換える（@open で opened を更新） -->\n  <ul>\n    <li v-for="c in cases" :key="c.id">{{ c.title }} <button>開く</button></li>\n  </ul>\n  <p>最後に開いた案件: {{ opened }}</p>\n'),
      'PageHeader.vue': V("// ① タイトル title（string）を props で受け取る\n", '  <!-- ① <header> の中に <h1>{{ title }}</h1> を書く -->\n'),
      'SummaryTile.vue': V("// ② ラベル label（string）と件数 value（number）を props で受け取る\n", '  <!-- ② タイルを書く（label と value を表示） -->\n'),
      'CaseRow.vue': V("defineProps<{ id: number; title: string }>()\n// ⑤ 「開く」で、id を付けて open を emit する（defineEmits も）\n", '  <li>\n    {{ title }}\n    <button>開く</button>\n  </li>\n'),
    }, {
      'App.vue': V("import { ref } from 'vue'\nimport PageHeader from '@/components/PageHeader.vue'\nimport SummaryTile from '@/components/SummaryTile.vue'\nimport CaseRow from '@/components/CaseRow.vue'\n\n" + items + "const opened = ref<string>('')\n\nfunction onOpen(id: number): void {\n  const c = cases.value.find((x) => x.id === id)\n  if (c) opened.value = c.title\n}\n", '  <PageHeader title="相談案件ダッシュボード" />\n  <SummaryTile label="新規" :value="5" />\n  <SummaryTile label="対応中" :value="12" />\n  <SummaryTile label="完了" :value="30" />\n  <ul>\n    <CaseRow v-for="c in cases" :key="c.id" :id="c.id" :title="c.title" @open="onOpen" />\n  </ul>\n  <p>最後に開いた案件: {{ opened }}</p>\n'),
      'PageHeader.vue': V("defineProps<{ title: string }>()\n", '  <header><h1>{{ title }}</h1></header>\n'),
      'SummaryTile.vue': V("defineProps<{ label: string; value: number }>()\n", '  <div class="tile"><span>{{ label }}</span> <b>{{ value }}</b></div>\n'),
      'CaseRow.vue': V("defineProps<{ id: number; title: string }>()\nconst emit = defineEmits<{ open: [id: number] }>()\n", '  <li>\n    {{ title }}\n    <button @click="emit(\'open\', id)">開く</button>\n  </li>\n'),
    }, { 'App.vue': '親：画面全体（部品を並べるだけ）', 'PageHeader.vue': '部品：見出し', 'SummaryTile.vue': '部品：件数タイル', 'CaseRow.vue': '部品：一覧の1行' },
    (v, c) => { const P = v['App.vue'], H = v['PageHeader.vue'], S = v['SummaryTile.vue'], R = v['CaseRow.vue']; return [
      T('① PageHeader.vue：title（string）を props で受け、<header> の中に <h1>{{ title }}</h1> を書く', 1, re(/defineProps\s*<\s*\{[^}]*\btitle\s*:\s*string/, H) && re(/<h1>\s*\{\{\s*title\s*\}\}\s*<\/h1>/, H), ['見出しは「どの画面にもある」部品の代表。', C('defineProps<{ title: string }>()\n\n<header><h1>{{ title }}</h1></header>')], A('PageHeader.vue', '①')),
      T('② SummaryTile.vue：label（string）と value（number）を props で受け、タイルに表示する', 1, re(/defineProps\s*<\s*\{[^}]*\blabel\s*:\s*string/, S) && re(/defineProps\s*<\s*\{[^}]*\bvalue\s*:\s*number/, S) && re(/\{\{\s*label\s*\}\}/, S) && re(/\{\{\s*value\s*\}\}/, S), ['同じ形が3回出るなら、部品にする合図。', C('defineProps<{ label: string; value: number }>()\n\n<div class="tile"><span>{{ label }}</span> <b>{{ value }}</b></div>')], A('SummaryTile.vue', '②')),
      T('③ CaseDashboardPage.vue：2つの部品を import し、<header> を <PageHeader title="…" /> に置き換える', 1, re(/import\s+PageHeader\s+from\s+['"][^'"]*PageHeader\.vue['"]/, P) && re(/import\s+SummaryTile\s+from\s+['"][^'"]*SummaryTile\.vue['"]/, P) && re(/<PageHeader\b[^>]*\btitle\s*=/, P) && !re(/<header/, P), ['import → 使う、の順。', C("import PageHeader from '@/components/PageHeader.vue'\n\n<PageHeader title=\"相談案件ダッシュボード\" />")], A('App.vue', '③')),
      T('④ コピペの3つのタイル（class="tile"）を、<SummaryTile label="…" :value="…" /> 3つに置き換える（画面は同じ）', 2, !re(/class=["']tile["']/, P) && count(/<SummaryTile\b/g, P) >= 3 && re(/<SummaryTile\b[^>]*:value\s*=\s*["']\d+["']/, P) && /新規\s*5/.test(appText(c)) && /完了\s*30/.test(appText(c)), ['数値は :value="5" のように :（v-bind）を付けて渡す。', C('<SummaryTile label="新規" :value="5" />')], A('App.vue', '④')),
      T('⑤ 一覧の <li> を CaseRow に切り出す。子は emit(\'open\', id)、親は @open で opened に案件名を入れる', 3, re(/import\s+CaseRow\s+from\s+['"][^'"]*CaseRow\.vue['"]/, P) && re(/<CaseRow\b[^>]*v-for/, P) && re(/<CaseRow\b[^>]*@open\s*=/, P) && !re(/<li/, P) && re(/opened\.value\s*=/, P) && re(/defineEmits\s*<\s*\{[^}]*\bopen\s*:\s*\[\s*\w+\s*:\s*number\s*\]/, R) && re(/emit\(\s*['"]open['"]\s*,\s*id\s*\)/, R), ['部品を切り出すと、表示は props、操作は emit という分担が自然にできる。', C("const emit = defineEmits<{ open: [id: number] }>()\n\n<CaseRow v-for=\"c in cases\" :key=\"c.id\" :id=\"c.id\" :title=\"c.title\" @open=\"onOpen\" />", 'vue')], A('App.vue', '⑤')),
    ]; }));
  }

  /* ============ 17. 実例：どの部品に何を渡す？ ============ */
  {
    const types = "export interface Lawyer {\n  id: number\n  name: string\n  field: string\n}\n\nexport interface Review {\n  id: number\n  comment: string\n  stars: number\n}\n";
    const head = "import { ref } from 'vue'\nimport LawyerProfile from '@/components/LawyerProfile.vue'\nimport ReviewList from '@/components/ReviewList.vue'\nimport SlotPicker from '@/components/SlotPicker.vue'\nimport type { Lawyer, Review } from '@/types'\n\nconst lawyer = ref<Lawyer>({ id: 1, name: '山田 太郎', field: '労働問題' })\nconst reviews = ref<Review[]>([\n  { id: 1, comment: '丁寧に説明してくれた', stars: 5 },\n  { id: 2, comment: '連絡が早かった', stars: 4 },\n])\nconst slots = ref<string[]>(['10:00', '14:00', '16:30'])\n";
    const kids = {
      'LawyerProfile.vue': V("import type { Lawyer } from '@/types'\n\ndefineProps<{ lawyer: Lawyer }>()\n", '  <div v-if="lawyer" class="card"><b>{{ lawyer.name }}</b>（{{ lawyer.field }}）</div>\n'),
      'ReviewList.vue': V("import type { Review } from '@/types'\n\ndefineProps<{ reviews: Review[] }>()\n", '  <ul>\n    <li v-for="r in reviews" :key="r.id">★{{ r.stars }} {{ r.comment }}</li>\n  </ul>\n'),
      'SlotPicker.vue': V("defineProps<{ lawyerName: string; slots: string[]; selected: string | null }>()\nconst emit = defineEmits<{ pick: [slot: string] }>()\n", '  <div>\n    <p>{{ lawyerName }}の空き時間</p>\n    <button v-for="s in slots" :key="s" :class="{ active: s === selected }" @click="emit(\'pick\', s)">{{ s }}</button>\n  </div>\n'),
    };
    const notes = { 'App.vue': '親：データを全部持つ。誰に何を渡すか決める', 'LawyerProfile.vue': '子：弁護士の紹介（lawyer が要る）', 'ReviewList.vue': '子：口コミ一覧（reviews が要る）', 'SlotPicker.vue': '子：時間を選ぶ（slots・名前・選択中が要る）', 'types.ts': '型：Lawyer / Review' };
    set('実例：どの部品に何を渡す？', mk('LawyerDetailPage.vue', Object.assign({
      'App.vue': V(head + "const picked = ref<string | null>(null)\n// ④ onPick(slot: string): 子の pick イベントで届いた時刻を picked に入れる関数\n// ⑤ picked があるときだけ「予約確認: ◯◯弁護士 ◯時」を出すため、confirmText（computed<string>）を作る\n", '  <!-- ① LawyerProfile へ lawyer を渡す -->\n  <LawyerProfile />\n  <!-- ② ReviewList へ reviews を渡す -->\n  <ReviewList />\n  <!-- ③ SlotPicker へ slots と、名前だけ（:lawyer-name="lawyer.name"）を渡す。④ @pick を受ける。⑤ :selected も渡す -->\n  <SlotPicker />\n  <!-- ⑤ ここに confirmText を出す（picked があるときだけ） -->\n'),
    }, kids, { 'types.ts': types }), Object.assign({
      'App.vue': V(head.replace("import { ref }", "import { ref, computed }") + "const picked = ref<string | null>(null)\n\nfunction onPick(slot: string): void {\n  picked.value = slot\n}\n\nconst confirmText = computed<string>(() => (picked.value ? '予約確認: ' + lawyer.value.name + '弁護士 ' + picked.value : ''))\n", '  <LawyerProfile :lawyer="lawyer" />\n  <ReviewList :reviews="reviews" />\n  <SlotPicker :lawyer-name="lawyer.name" :slots="slots" :selected="picked" @pick="onPick" />\n  <p v-if="picked">{{ confirmText }}</p>\n'),
    }, kids, { 'types.ts': types }), notes,
    (v) => { const P = v['App.vue']; return [
      T('① LawyerProfile へ、弁護士のデータ :lawyer="lawyer" を渡す', 1, re(/<LawyerProfile\b[^>]*:lawyer\s*=\s*["']lawyer["']/, P), ['部品が必要としているものを渡す。紹介に要るのは弁護士そのもの。', C('<LawyerProfile :lawyer="lawyer" />')], A('App.vue', '①')),
      T('② ReviewList へ、口コミの配列 :reviews="reviews" を渡す', 1, re(/<ReviewList\b[^>]*:reviews\s*=\s*["']reviews["']/, P), ['口コミ一覧に要るのは reviews（配列）。弁護士は要らない。', C('<ReviewList :reviews="reviews" />')], A('App.vue', '②')),
      T('③ SlotPicker へ、:slots="slots" と、名前だけ :lawyer-name="lawyer.name" を渡す（弁護士まるごとは渡さない）', 1, re(/<SlotPicker\b[^>]*:slots\s*=\s*["']slots["']/, P) && re(/<SlotPicker\b[^>]*:(lawyer-name|lawyerName)\s*=\s*["']lawyer\.name["']/, P) && !re(/<SlotPicker\b[^>]*:lawyer\s*=/, P), ['必要な分だけ渡すと、部品が独立して使い回しやすくなる。', C('<SlotPicker :lawyer-name="lawyer.name" :slots="slots" />')], A('App.vue', '③')),
      T('④ 子の pick を @pick で受け、onPick(slot: string) で picked に入れる', 2, re(/<SlotPicker\b[^>]*@pick\s*=\s*["']onPick["']/, P) && re(/function\s+onPick\s*\(\s*slot\s*:\s*string\s*\)/, P) && re(/picked\.value\s*=\s*slot/, P), ['子 → 親は emit。受けた値を親の ref に入れる。', C('function onPick(slot: string): void {\n  picked.value = slot\n}', 'ts')], A('App.vue', '④')),
      T('⑤ :selected="picked" を渡し、picked があるときだけ confirmText（computed<string>）で「予約確認: …」を出す', 3, re(/<SlotPicker\b[^>]*:selected\s*=\s*["']picked["']/, P) && re(/confirmText\s*=\s*computed\s*<\s*string\s*>\s*\(/, P) && re(/confirmText\s*=\s*computed[^\n]*picked\.value/, P) && re(/v-if\s*=\s*["']picked["']/, P) && re(/\{\{\s*confirmText\s*\}\}/, P), ['親が持つ「選んだ時刻」を、下の子へ戻して強調し、確認文にも使う。', C("const confirmText = computed<string>(() => (picked.value ? '予約確認: ' + lawyer.value.name + '弁護士 ' + picked.value : ''))\n\n<p v-if=\"picked\">{{ confirmText }}</p>")], A('App.vue', '⑤')),
    ]; }));
  }
})();
