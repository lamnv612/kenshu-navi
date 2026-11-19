/* 補足 Vue「import と export（{ } の有る無し）」（x-vue-import）各シーンの練習。
   ランナーは .vue の「名前付き import」と「<script> + <script setup> の 2 つ組」を動かせないので、
   すべてテキスト型（mode: 'text'）。書いたコードを、コメントを取り除いたうえで正規表現で判定する。
   初級×3・中級×2・上級×1。全ミッション必須。 */
(function () {
  const K = window.KENSHU;
  const D = (K.drills = K.drills || {});
  if (!K.vueDrillTools) return;
  const { T } = K.vueDrillTools;
  D['x-vue-import'] = D['x-vue-import'] || {};

  /* コメント（// ・ /* * / ・ <!-- -->）を取り除く。TODO コメントの文言で通らないように */
  const clean = (s) => String(s || '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/([;)\s])\/\/ .*$/gm, '$1');
  const re = (r, s) => r.test(s || '');
  const count = (r, s) => (String(s || '').match(r) || []).length;
  const C = (code, lang) => ({ code, lang: lang || 'ts' });
  const J = (a) => a.join('\n');
  const langOf = (n) => (/\.vue$/.test(n) ? 'vue' : 'ts');
  /* 普通の <script>（setup なし）と <script setup> の中身 */
  const normalBlock = (s) => { const m = String(s || '').match(/<script(?![^>]*\bsetup\b)[^>]*>([\s\S]*?)<\/script>/); return m ? m[1] : ''; };
  const setupBlock = (s) => { const m = String(s || '').match(/<script[^>]*\bsetup\b[^>]*>([\s\S]*?)<\/script>/); return m ? m[1] : ''; };
  /* import 文の { } の中身（from の先が rx に合うもの） */
  const braces = (s, head, from) => { const m = String(s || '').match(new RegExp('import\\s+' + head + '\\{([^}]*)\\}\\s*from\\s*[\'"][^\'"]*' + from + '[\'"]')); return m ? m[1] : null; };

  const importsOf = (s, from) => [...String(s || '').matchAll(/import\s*\{([^}]*)\}\s*from\s*['"]([^'"]*)['"]/g)].filter((m) => m[2].indexOf(from) >= 0).map((m) => m[1]);
  const mk = (files, sol, paths, notes, note, tasksFn, height) => ({
    mode: 'text', sfc: true, height: height || 380,
    files: Object.keys(files).map((n) => ({ name: n, lang: langOf(n), code: files[n] })),
    paths, fileNotes: notes, note, solution: sol,
    tasks: (v) => { const w = {}; Object.keys(v).forEach((n) => { w[n] = clean(v[n]); }); return tasksFn(w, v); },
  });
  const A = (file, mark) => ({ file, find: [mark] });
  const set = (title, o) => { D['x-vue-import'][title] = o; };

  const CASE_CARD = J(['<script setup lang="ts">', 'defineProps<{ title: string }>()', '</script>', '', '<template>', '  <p>{{ title }}</p>', '</template>', '']);
  const CASE_API = J([
    "export const API_URL = '/api/cases'",
    '',
    'export async function fetchCases(): Promise<Case[]> {',
    '  const res = await fetch(API_URL)',
    '  return res.json()',
    '}',
    '',
    'export type Case = { id: number; title: string }',
    '',
    'const caseApi = { fetchCases }',
    'export default caseApi',
    '',
  ]);

  /* ============ 1. { } がある import と、ない import ============ */
  {
    const page = (body, tail) => J(['<script setup lang="ts">', "import { ref } from 'vue'", body, '', 'const cases = ref<number[]>([])', '', 'async function load(): Promise<void> {', tail, '}', '</script>', '', '<template>', '  <ul>', '    <li v-for="id in cases" :key="id">{{ id }}</li>', '  </ul>', '</template>', '']);
    const starter = page(J([
      '// ① CaseCard.vue から、部品 CaseCard を import する',
      '// ② case-api.ts から、named export の fetchCases を import する',
      '// ③ case-api.ts から、default export を caseApi という名前で import する',
      '// ④ case-api.ts から、型 Case を import type で取り込む',
      '// ⑤ fetchCases を loadCases という別名で import する（②の fetchCases は残す）',
      '// ⑥ case-api.ts を * as api でまとめて取り込み、下の load() で api.fetchCases() を呼ぶ',
    ]), '  // ⑥ ここで api.fetchCases() を呼ぶ');
    const sol = page(J([
      "import CaseCard from './CaseCard.vue'",
      "import { fetchCases } from './case-api'",
      "import caseApi from './case-api'",
      "import type { Case } from './case-api'",
      "import { fetchCases as loadCases } from './case-api'",
      "import * as api from './case-api'",
    ]), '  await api.fetchCases()');
    set('{ } がある import と、ない import', mk({ 'CaseListPage.vue': starter, 'CaseCard.vue': CASE_CARD, 'case-api.ts': CASE_API }, { 'CaseListPage.vue': sol, 'CaseCard.vue': CASE_CARD, 'case-api.ts': CASE_API },
      { 'CaseListPage.vue': 'src/pages/CaseListPage.vue', 'CaseCard.vue': 'src/components/CaseCard.vue', 'case-api.ts': 'src/api/case-api.ts' },
      { 'CaseListPage.vue': '取り込む側（ここに import を書く）', 'CaseCard.vue': '部品（export default：触らない）', 'case-api.ts': '棚：default が 1 つ、named が 3 つ（触らない）' },
      '<b>export の種類で、import の書き方が決まる</b><br>・<code>CaseCard.vue</code> の部品と <code>case-api.ts</code> の <code>export default</code> → <b>{ } なし</b><br>・<code>export const / function / type</code>（named）→ <b>{ } あり</b><br>右の <code>case-api.ts</code> の棚を見ながら、import を書こう。',
      (v) => { const P = v['CaseListPage.vue']; return [
        T('① CaseListPage.vue で、CaseCard.vue から部品 CaseCard を import する（{ } なし）', 1, re(/import\s+CaseCard\s+from\s+['"][^'"]*CaseCard\.vue['"]/, P), ['部品は default export。{ } は付けない。', C("import CaseCard from './CaseCard.vue'")], A('CaseListPage.vue', '// ① ')),
        T('② CaseListPage.vue で、case-api.ts から named export の fetchCases を import する（{ } あり）', 1, importsOf(P, 'case-api').some((b) => /(^|,)\s*fetchCases\s*(,|$)/.test(b)), ['export const / function は named。名前を { } の中に正確に書く。', C("import { fetchCases } from './case-api'")], A('CaseListPage.vue', '// ② ')),
        T('③ CaseListPage.vue で、case-api.ts の default export を caseApi という名前で import する（{ } なし）', 1, re(/import\s+caseApi\s+from\s+['"][^'"]*case-api['"]/, P), ['export default は { } なし。名前は自由（ここでは caseApi）。', C("import caseApi from './case-api'")], A('CaseListPage.vue', '// ③ ')),
        T('④ CaseListPage.vue で、case-api.ts の型 Case を import type で取り込む（実行時には消える）', 2, re(/import\s+type\s*\{[^}]*\bCase\b[^}]*\}\s*from\s*['"][^'"]*case-api['"]/, P), ['型だけを取るときは import type。型も named なので { } は付く。', C("import type { Case } from './case-api'")], A('CaseListPage.vue', '// ④ ')),
        T('⑤ CaseListPage.vue で、fetchCases を loadCases という別名で import する（as）', 2, re(/import\s*\{[^}]*\bfetchCases\s+as\s+loadCases\b[^}]*\}\s*from\s*['"][^'"]*case-api['"]/, P), ['as は「〜として」。{ } の中で、こちら側の名前を付け替える。', C("import { fetchCases as loadCases } from './case-api'")], A('CaseListPage.vue', '// ⑤ ')),
        T('⑥ CaseListPage.vue で、case-api.ts を * as api でまとめて取り込み、load() の中で api.fetchCases() を呼ぶ', 3, re(/import\s*\*\s*as\s+api\s+from\s+['"][^'"]*case-api['"]/, P) && re(/\bapi\.fetchCases\s*\(/, P), ['* as api は「全部を api という箱に入れる」。named は api.名前 で呼ぶ。', C("import * as api from './case-api'"), C('async function load(): Promise<void> {\n  await api.fetchCases()\n}')], A('CaseListPage.vue', '// ⑥ ')),
      ]; }));
  }

  /* ============ 3. 部品の中から、ほかのものも import したい ============ */
  {
    const CARD_STARTER = J([
      "<!-- ① このファイルの先頭に、普通の <script lang=\"ts\"> を書く（script setup の外。lang をそろえる） -->",
      "<!-- ② その中で、型 CaseStatus を export する（'受付' | '対応中' | '完了'） -->",
      "<!-- ③ その中で、定数 STATUS_LABEL を export する（Record<CaseStatus, string>） -->",
      '<script setup lang="ts">',
      'defineProps<{ title: string; status: CaseStatus }>()',
      '</script>',
      '',
      '<template>',
      '  <p>{{ title }}：{{ STATUS_LABEL[status] }}</p>',
      '</template>',
      '',
    ]);
    const CARD_SOL = J([
      '<script lang="ts">',
      "export type CaseStatus = '受付' | '対応中' | '完了'",
      '',
      'export const STATUS_LABEL: Record<CaseStatus, string> = {',
      "  受付: '受付済み',",
      "  対応中: '弁護士が対応中',",
      "  完了: '完了',",
      '}',
      '</script>',
      '',
      '<script setup lang="ts">',
      'defineProps<{ title: string; status: CaseStatus }>()',
      '</script>',
      '',
      '<template>',
      '  <p>{{ title }}：{{ STATUS_LABEL[status] }}</p>',
      '</template>',
      '',
    ]);
    const PAGE_STARTER = J([
      '<script setup lang="ts">',
      "import { ref } from 'vue'",
      "import CaseCard from './CaseCard.vue'",
      '// ④ CaseCard.vue から、定数 STATUS_LABEL を { } で import する（上の CaseCard の import に , で足す）',
      '// ⑤ 同じ import に、型 CaseStatus も type を付けて足す',
      '// ⑥ status を ref<CaseStatus> にして、label を STATUS_LABEL[status.value] で作る',
      '</script>',
      '',
      '<template>',
      '  <CaseCard title="離婚の相談" status="受付" />',
      '</template>',
      '',
    ]);
    const PAGE_SOL = J([
      '<script setup lang="ts">',
      "import { ref } from 'vue'",
      'import CaseCard, {',
      '  type CaseStatus,',
      '  STATUS_LABEL,',
      "} from './CaseCard.vue'",
      '',
      "const status = ref<CaseStatus>('受付')",
      'const label = STATUS_LABEL[status.value]',
      '</script>',
      '',
      '<template>',
      '  <CaseCard title="離婚の相談" :status="status" />',
      '  <p>{{ label }}</p>',
      '</template>',
      '',
    ]);
    set('部品の中から、ほかのものも import したい', mk({ 'CaseCard.vue': CARD_STARTER, 'CaseListPage.vue': PAGE_STARTER }, { 'CaseCard.vue': CARD_SOL, 'CaseListPage.vue': PAGE_SOL },
      { 'CaseCard.vue': 'src/components/CaseCard.vue', 'CaseListPage.vue': 'src/pages/CaseListPage.vue' },
      { 'CaseCard.vue': '部品（export する側：普通の script を足す）', 'CaseListPage.vue': '取り込む側（import を足す）' },
      '<b>&lt;script setup&gt; の中には export を書けない</b><br>型や定数を出したいときは、<b>普通の &lt;script lang="ts"&gt;</b> を <b>setup の外</b>に足して、そこで <code>export</code>。<br>取り込む側は、部品の import に <code>, { … }</code> を足す。<br>※ <code>&lt;script&gt;</code> と <code>&lt;script setup&gt;</code> は、lang を同じにする。',
      (v) => { const Cd = v['CaseCard.vue'], P = v['CaseListPage.vue']; const N = normalBlock(Cd), S = setupBlock(Cd); const imp = braces(P, 'CaseCard\\s*,\\s*', 'CaseCard\\.vue'); return [
        T('① CaseCard.vue で、script setup の外に、普通の <script lang="ts"> ブロックを書く', 1, re(/<script\s+lang=["']ts["']\s*>/, Cd) && Cd.search(/<script\s+lang=["']ts["']\s*>/) < Cd.search(/<script\s+setup/), ['setup が付かない <script> が、普通のブロック。ファイルの先頭に置く。', C('<script lang="ts">\n  …\n</script>\n\n<script setup lang="ts">\n  …\n</script>', 'vue')], A('CaseCard.vue', '<!-- ① ')),
        T('② CaseCard.vue の普通の <script> に、型 CaseStatus を export する（受付・対応中・完了）', 1, re(/export\s+type\s+CaseStatus\s*=\s*['"]受付['"]\s*\|\s*['"]対応中['"]\s*\|\s*['"]完了['"]/, N), ['型を出すのは export type。script setup ではなく、普通の script の中に書く。', C("export type CaseStatus = '受付' | '対応中' | '完了'")], A('CaseCard.vue', '<!-- ② ')),
        T('③ CaseCard.vue の普通の <script> に、定数 STATUS_LABEL を export する（Record<CaseStatus, string>）', 1, re(/export\s+const\s+STATUS_LABEL\s*:\s*Record\s*<\s*CaseStatus\s*,\s*string\s*>\s*=\s*\{/, N) && !re(/\bexport\b/, S), ['値の export は、script setup の中ではエラー。普通の script に書く。', C("export const STATUS_LABEL: Record<CaseStatus, string> = {\n  受付: '受付済み',\n  対応中: '弁護士が対応中',\n  完了: '完了',\n}")], A('CaseCard.vue', '<!-- ③ ')),
        T('④ CaseListPage.vue で、CaseCard.vue から定数 STATUS_LABEL を { } で import する（部品の import に足す）', 2, imp !== null && /\bSTATUS_LABEL\b/.test(imp), ['部品は default、定数は named。1 行で書くなら import 部品, { 名前 } from …。', C("import CaseCard, { STATUS_LABEL } from './CaseCard.vue'")], A('CaseListPage.vue', '// ④ ')),
        T('⑤ CaseListPage.vue で、同じ import に型 CaseStatus を type 付きで足す', 2, imp !== null && /\btype\s+CaseStatus\b/.test(imp) && /\bSTATUS_LABEL\b/.test(imp), ['型は { } の中で type を付けると、型だけだと分かる。', C("import CaseCard, { type CaseStatus, STATUS_LABEL } from './CaseCard.vue'")], A('CaseListPage.vue', '// ⑤ ')),
        T('⑥ CaseListPage.vue で、status を ref<CaseStatus> にして、STATUS_LABEL[status.value] で label を作る', 3, re(/ref\s*<\s*CaseStatus\s*>\s*\(/, P) && re(/const\s+label\s*=\s*STATUS_LABEL\s*\[\s*status\.value\s*\]/, P), ['import した型は <> の中で、定数は [ ] の中身を決める辞書として使う。', C("const status = ref<CaseStatus>('受付')\nconst label = STATUS_LABEL[status.value]")], A('CaseListPage.vue', '// ⑥ ')),
      ]; }, 420));
  }

  /* ============ 4. export default と export const の見分け ============ */
  {
    const API_STARTER = J([
      '// ① API_URL を named export にする',
      "const API_URL = '/api/cases'",
      '',
      '// ② 型 Case を named export にする',
      'type Case = { id: number; title: string }',
      '',
      '// ③ fetchCases を named export の関数にする',
      'async function fetchCases(): Promise<Case[]> {',
      '  const res = await fetch(API_URL)',
      '  return res.json()',
      '}',
      '',
      '// ④ MAX_RETRY と TIMEOUT_MS を、export { } でまとめて export する',
      'const MAX_RETRY = 3',
      'const TIMEOUT_MS = 5000',
      '',
      '// ⑤ caseApi を default export にする（1 ファイルに 1 つだけ）',
      'const caseApi = { fetchCases }',
      '',
    ]);
    const API_SOL = J([
      "export const API_URL = '/api/cases'",
      '',
      'export type Case = { id: number; title: string }',
      '',
      'export async function fetchCases(): Promise<Case[]> {',
      '  const res = await fetch(API_URL)',
      '  return res.json()',
      '}',
      '',
      'const MAX_RETRY = 3',
      'const TIMEOUT_MS = 5000',
      'export { MAX_RETRY, TIMEOUT_MS }',
      '',
      'const caseApi = { fetchCases }',
      'export default caseApi',
      '',
    ]);
    const PAGE_STARTER = J([
      '<script setup lang="ts">',
      "import { ref } from 'vue'",
      "// ⑥ case-api.ts から、default の caseApi・named の fetchCases・型 Case を、1 つの import 行で取り込む（型は { } の中で type を付ける）",
      '',
      'const cases = ref<number[]>([])',
      '</script>',
      '',
      '<template>',
      '  <p>案件 {{ cases.length }} 件</p>',
      '</template>',
      '',
    ]);
    const PAGE_SOL = J([
      '<script setup lang="ts">',
      "import { ref } from 'vue'",
      "import caseApi, { fetchCases, type Case } from '@/api/case-api'",
      '',
      'const cases = ref<number[]>([])',
      '</script>',
      '',
      '<template>',
      '  <p>案件 {{ cases.length }} 件</p>',
      '</template>',
      '',
    ]);
    set('export default と export const の見分け', mk({ 'case-api.ts': API_STARTER, 'CaseListPage.vue': PAGE_STARTER }, { 'case-api.ts': API_SOL, 'CaseListPage.vue': PAGE_SOL },
      { 'case-api.ts': 'src/api/case-api.ts', 'CaseListPage.vue': 'src/pages/CaseListPage.vue' },
      { 'case-api.ts': '棚：ここに export を足す', 'CaseListPage.vue': '取り込む側（最後に import を書く）' },
      '<b>export の書き方 ⇒ import の書き方</b><br>・<code>export const / function / type</code> → import は <b>{ } あり</b><br>・<code>export { a, b }</code> → <b>{ a, b }</b> で取る<br>・<code>export default</code> → <b>{ } なし</b>（1 ファイルに 1 つ）<br>まず棚（<code>case-api.ts</code>）に export を足してから、取り込む側を書こう。',
      (v) => { const Ap = v['case-api.ts'], P = v['CaseListPage.vue']; const imp = braces(P, 'caseApi\\s*,\\s*', 'case-api'); return [
        T('① case-api.ts で、API_URL を named export にする（export const）', 1, re(/export\s+const\s+API_URL\b/, Ap), ['named export は、宣言の頭に export を付ける。', C("export const API_URL = '/api/cases'")], A('case-api.ts', '// ① ')),
        T('② case-api.ts で、型 Case を named export にする（export type）', 1, re(/export\s+(type|interface)\s+Case\b/, Ap), ['型にも export が付く。取る側は import type で取り込める。', C('export type Case = { id: number; title: string }')], A('case-api.ts', '// ② ')),
        T('③ case-api.ts で、fetchCases を named export の関数にする（export function）', 1, re(/export\s+(async\s+)?function\s+fetchCases\s*\(/, Ap), ['関数も、宣言の頭に export を付ける。async の前に置く。', C('export async function fetchCases(): Promise<Case[]> {\n  …\n}')], A('case-api.ts', '// ③ ')),
        T('④ case-api.ts で、MAX_RETRY と TIMEOUT_MS を export { } でまとめて export する', 2, re(/export\s*\{[^}]*\bMAX_RETRY\b[^}]*\bTIMEOUT_MS\b[^}]*\}/, Ap) && !re(/export\s+const\s+(MAX_RETRY|TIMEOUT_MS)\b/, Ap), ['宣言はそのまま。あとから、export { 名前, 名前 } で一度に出せる。', C('const MAX_RETRY = 3\nconst TIMEOUT_MS = 5000\nexport { MAX_RETRY, TIMEOUT_MS }')], A('case-api.ts', '// ④ ')),
        T('⑤ case-api.ts で、caseApi を default export にする（export default は 1 つだけ）', 2, re(/export\s+default\s+caseApi\b/, Ap) && count(/\bexport\s+default\b/g, Ap) === 1, ['default export は export default 名前。1 ファイルに 1 つだけ。', C('const caseApi = { fetchCases }\nexport default caseApi')], A('case-api.ts', '// ⑤ ')),
        T('⑥ CaseListPage.vue で、default の caseApi・named の fetchCases・型 Case を 1 つの import 行で取り込む', 3, imp !== null && /\bfetchCases\b/.test(imp) && /\btype\s+Case\b/.test(imp), ['default は { } の外（先頭）、named は { } の中。', C("import caseApi, { fetchCases, type Case } from '@/api/case-api'")], A('CaseListPage.vue', '// ⑥ ')),
      ]; }, 420));
  }

  /* ============ 5. よくあるエラー ============ */
  {
    const TYPES_TS = J(['export type Case = { id: number; title: string }', '']);
    const API_STARTER = J([
      "import type { Case } from '@/types/case'",
      '',
      'export async function cancelCase(id: number): Promise<void> {',
      '  await fetch(`/api/cases/${id}`, { method: \'DELETE\' })',
      '}',
      '',
      '// ⑤ export default が 2 つある。fetchCases の方を named export に直す（default は caseApi だけ）',
      'export default async function fetchCases(): Promise<Case[]> {',
      "  const res = await fetch('/api/cases')",
      '  return res.json()',
      '}',
      '',
      'const caseApi = { fetchCases, cancelCase }',
      'export default caseApi',
      '',
    ]);
    const API_SOL = API_STARTER.replace(/\/\/ ⑤ [^\n]*\n/, '').replace('export default async function fetchCases', 'export async function fetchCases');
    const PAGE_STARTER = J([
      '<script setup lang="ts">',
      "// ② default の部品に { } を付けている。外す",
      "import { CaseCard } from './CaseCard.vue'",
      "// ① named の fetchCases に { } が無い。付ける",
      "import fetchCases from '@/api/cases'",
      "// ④ cancelCase の名前が 1 文字違う。直す",
      "import { cancelCasee } from '@/api/cases'",
      "// ③ 型 Case は import type で取り込む",
      "import { Case } from '@/types/case'",
      "// ⑥ default の caseApi も取り込み、caseApi.cancelCase(1) を呼ぶ（{ } なし）",
      '',
      'async function remove(): Promise<void> {',
      '  await cancelCasee(1)',
      '}',
      '</script>',
      '',
      '<template>',
      '  <CaseCard title="離婚の相談" />',
      '</template>',
      '',
    ]);
    const PAGE_SOL = J([
      '<script setup lang="ts">',
      "import CaseCard from './CaseCard.vue'",
      "import { fetchCases } from '@/api/cases'",
      "import { cancelCase } from '@/api/cases'",
      "import type { Case } from '@/types/case'",
      "import caseApi from '@/api/cases'",
      '',
      'async function remove(): Promise<void> {',
      '  await cancelCase(1)',
      '  await caseApi.cancelCase(1)',
      '}',
      '</script>',
      '',
      '<template>',
      '  <CaseCard title="離婚の相談" />',
      '</template>',
      '',
    ]);
    set('よくあるエラー', mk({ 'CaseListPage.vue': PAGE_STARTER, 'cases.ts': API_STARTER, 'CaseCard.vue': CASE_CARD, 'case.ts': TYPES_TS }, { 'CaseListPage.vue': PAGE_SOL, 'cases.ts': API_SOL, 'CaseCard.vue': CASE_CARD, 'case.ts': TYPES_TS },
      { 'CaseListPage.vue': 'src/pages/CaseListPage.vue', 'cases.ts': 'src/api/cases.ts', 'CaseCard.vue': 'src/components/CaseCard.vue', 'case.ts': 'src/types/case.ts' },
      { 'CaseListPage.vue': '取り込む側（エラーが出ている）', 'cases.ts': '棚：default が 2 つある（直す）', 'CaseCard.vue': '部品（触らない）', 'case.ts': '型だけのファイル（触らない）' },
      '<b>エラーの文を読んで、直す</b><br>・<code>has no default export</code> → <b>{ } を付ける</b><br>・<code>does not provide an export named “CaseCard”</code> → <b>{ } を外す</b>（default）<br>・<code>must be imported using a type-only import</code> → <b>import type</b><br>・<code>Did you mean “cancelCase”?</code> → <b>名前を直す</b><br>・<code>multiple default exports</code> → <b>片方を named に</b>',
      (v) => { const P = v['CaseListPage.vue'], Ap = v['cases.ts']; return [
        T('① CaseListPage.vue で、fetchCases の import に { } を付ける（named export）', 1, re(/import\s*\{[^}]*\bfetchCases\b[^}]*\}\s*from\s*['"]@\/api\/cases['"]/, P) && !re(/import\s+fetchCases\b/, P), ['fetchCases は named export。default ではないので { } が要る。', C("import { fetchCases } from '@/api/cases'")], A('CaseListPage.vue', '// ① ')),
        T('② CaseListPage.vue で、部品 CaseCard の import から { } を外す（default export）', 1, re(/import\s+CaseCard\s+from\s+['"][^'"]*CaseCard\.vue['"]/, P) && !re(/import\s*\{[^}]*\bCaseCard\b/, P), ['部品は default export。{ } で探すと「CaseCard という export は無い」と言われる。', C("import CaseCard from './CaseCard.vue'")], A('CaseListPage.vue', '// ② ')),
        T('③ CaseListPage.vue で、型 Case を import type で取り込む', 1, re(/import\s+type\s*\{[^}]*\bCase\b[^}]*\}\s*from\s*['"]@\/types\/case['"]/, P) || re(/import\s*\{[^}]*\btype\s+Case\b[^}]*\}\s*from\s*['"]@\/types\/case['"]/, P), ['型は実行時には無い。type を付けて「型だけ」と伝える。', C("import type { Case } from '@/types/case'")], A('CaseListPage.vue', '// ③ ')),
        T('④ CaseListPage.vue で、打ち間違いの cancelCasee を cancelCase に直す（import と呼び出し）', 2, re(/import\s*\{[^}]*\bcancelCase\b[^}]*\}\s*from\s*['"]@\/api\/cases['"]/, P) && !re(/cancelCasee/, P) && re(/\bcancelCase\s*\(\s*1\s*\)/, P), ['エラーの Did you mean（もしかして）に出る名前が正解。import と呼び出しの両方を直す。', C("import { cancelCase } from '@/api/cases'\n\nawait cancelCase(1)")], A('CaseListPage.vue', '// ④ ')),
        T('⑤ cases.ts で、export default を 1 つにする（fetchCases は named export、default は caseApi だけ）', 2, count(/\bexport\s+default\b/g, Ap) === 1 && re(/export\s+(async\s+)?function\s+fetchCases\s*\(/, Ap) && re(/export\s+default\s+caseApi\b/, Ap), ['default は 1 ファイルに 1 つだけ。fetchCases の export default を export に変える。', C('export async function fetchCases(): Promise<Case[]> {\n  …\n}\n\nexport default caseApi')], A('cases.ts', '// ⑤ ')),
        T('⑥ CaseListPage.vue で、default の caseApi を { } なしで import し、caseApi.cancelCase(1) を呼ぶ', 3, re(/import\s+caseApi\s+from\s+['"]@\/api\/cases['"]/, P) && re(/\bcaseApi\.cancelCase\s*\(\s*1\s*\)/, P), ['default は { } なしで、好きな名前。named（cancelCase）は caseApi の中のメソッドとしても呼べる。', C("import caseApi from '@/api/cases'\n\nawait caseApi.cancelCase(1)")], A('CaseListPage.vue', '// ⑥ ')),
      ]; }, 440));
  }
})();
