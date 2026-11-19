/* 補足 Vue「import と export（{ } の有る無し）」（x-vue-import）のレッスン最終テスト。
   ランナーは .vue の名前付き import や <script> + <script setup> を動かせないので、テキスト型。
   書いたコードを（コメントを取り除いて）正規表現で判定する。初級×3・中級×2・上級×1。 */
(function () {
  const K = window.KENSHU;
  if (!K) return;
  const lock = (id, test) => Object.defineProperty(K.tests = K.tests || {}, id, { get: () => test, set: () => {}, configurable: true, enumerable: true });
  const J = (a) => a.join('\n');
  const strip = (s) => String(s || '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const re = (r, s) => r.test(s || '');
  const normalBlock = (s) => { const m = String(s || '').match(/<script(?![^>]*\bsetup\b)[^>]*>([\s\S]*?)<\/script>/); return m ? m[1] : ''; };
  const braces = (s, head, from) => { const m = String(s || '').match(new RegExp('import\\s+' + head + '\\{([^}]*)\\}\\s*from\\s*[\'"][^\'"]*' + from + '[\'"]')); return m ? m[1] : null; };
  const mkHint = (text, ans, lang) => [text, { code: ans, lang: lang || 'ts' }];

  const API = J([
    "export const API_URL = '/api/cases'",
    '',
    '// ① fetchCases を named export の関数にする',
    'async function fetchCases(): Promise<Response> {',
    '  return fetch(API_URL)',
    '}',
    '',
    '// ② caseApi を default export にする（1 ファイルに 1 つだけ）',
    'const caseApi = { fetchCases }',
    '',
  ]);
  const API_SOL = J([
    "export const API_URL = '/api/cases'",
    '',
    'export async function fetchCases(): Promise<Response> {',
    '  return fetch(API_URL)',
    '}',
    '',
    'const caseApi = { fetchCases }',
    'export default caseApi',
    '',
  ]);
  const CARD = J([
    "<!-- ④ 型 CaseStatus を export したい。setup の外に、普通の <script lang=\"ts\"> を足して、そこで export type する（'受付' | '対応中' | '完了'） -->",
    '<script setup lang="ts">',
    'defineProps<{ title: string }>()',
    '</script>',
    '',
    '<template>',
    '  <p>{{ title }}</p>',
    '</template>',
    '',
  ]);
  const CARD_SOL = J([
    '<script lang="ts">',
    "export type CaseStatus = '受付' | '対応中' | '完了'",
    '</script>',
    '',
    '<script setup lang="ts">',
    'defineProps<{ title: string }>()',
    '</script>',
    '',
    '<template>',
    '  <p>{{ title }}</p>',
    '</template>',
    '',
  ]);
  const PAGE = J([
    '<script setup lang="ts">',
    "import { ref } from 'vue'",
    '// ③ CaseCard.vue から、部品 CaseCard を import する（{ } なし）',
    '// ⑤ ④で export した型 CaseStatus を、CaseCard の import に type 付きで足す',
    '// ⑥ case-api.ts から、default の caseApi と named の API_URL を、1 つの import 行で取り込む',
    '',
    "const status = ref('受付')",
    '</script>',
    '',
    '<template>',
    '  <CaseCard title="離婚の相談" />',
    '</template>',
    '',
  ]);
  const PAGE_SOL = J([
    '<script setup lang="ts">',
    "import { ref } from 'vue'",
    "import CaseCard, { type CaseStatus } from './CaseCard.vue'",
    "import caseApi, { API_URL } from '@/api/case-api'",
    '',
    "const status = ref<CaseStatus>('受付')",
    '</script>',
    '',
    '<template>',
    '  <CaseCard title="離婚の相談" />',
    '</template>',
    '',
  ]);
  const FILES = { 'CaseListPage.vue': PAGE, 'CaseCard.vue': CARD, 'case-api.ts': API };
  const SOL = { 'CaseListPage.vue': PAGE_SOL, 'CaseCard.vue': CARD_SOL, 'case-api.ts': API_SOL };
  const langOf = (n) => (/\.vue$/.test(n) ? 'vue' : 'ts');

  const defs = [
    { lv: 1, at: ['case-api.ts', '// ① '], label: '① case-api.ts で、fetchCases を named export の関数にする（export function）',
      hint: mkHint('named export は、宣言の頭に export を付ける。', 'export async function fetchCases(): Promise<Response> {\n  …\n}'),
      ok: (v) => re(/export\s+(async\s+)?function\s+fetchCases\s*\(/, strip(v['case-api.ts'])) },
    { lv: 1, at: ['case-api.ts', '// ② '], label: '② case-api.ts で、caseApi を default export にする（export default は 1 つだけ）',
      hint: mkHint('default export は export default 名前。1 ファイルに 1 つだけ。', 'const caseApi = { fetchCases }\nexport default caseApi'),
      ok: (v) => { const s = strip(v['case-api.ts']); return re(/export\s+default\s+caseApi\b/, s) && (s.match(/\bexport\s+default\b/g) || []).length === 1; } },
    { lv: 1, at: ['CaseListPage.vue', '// ③ '], label: '③ CaseListPage.vue で、CaseCard.vue から部品 CaseCard を import する（{ } なし）',
      hint: mkHint('部品は default export。{ } は付けない。名前は自由（慣習は PascalCase）。', "import CaseCard from './CaseCard.vue'"),
      ok: (v) => { const s = strip(v['CaseListPage.vue']); return re(/import\s+CaseCard\s*(,\s*\{[^}]*\}\s*)?from\s+['"][^'"]*CaseCard\.vue['"]/, s) && !re(/import\s*\{[^}]*\bCaseCard\b/, s); } },
    { lv: 2, at: ['CaseCard.vue', '<!-- ④ '], label: '④ CaseCard.vue で、setup の外の普通の <script lang="ts"> に、型 CaseStatus を export する（受付・対応中・完了）',
      hint: mkHint('<script setup> の外に、setup の付かない <script lang="ts"> を足し、その中に export type を書く。', "<script lang=\"ts\">\nexport type CaseStatus = '受付' | '対応中' | '完了'\n</script>", 'vue'),
      ok: (v) => { const c = strip(v['CaseCard.vue']); return re(/export\s+type\s+CaseStatus\s*=\s*['"]受付['"]\s*\|\s*['"]対応中['"]\s*\|\s*['"]完了['"]/, normalBlock(c)) && !re(/<script\s+setup[^>]*>[\s\S]*\bexport\s+type[\s\S]*<\/script>[\s\S]*<script/, c); } },
    { lv: 2, at: ['CaseListPage.vue', '// ⑤ '], label: '⑤ CaseListPage.vue で、CaseCard.vue から型 CaseStatus を type 付きで import する（部品と同じ 1 行）',
      hint: mkHint('部品は default、型は named。{ } の中で type を付けると、型だけだと分かる。', "import CaseCard, { type CaseStatus } from './CaseCard.vue'"),
      ok: (v) => { const b = braces(strip(v['CaseListPage.vue']), 'CaseCard\\s*,\\s*', 'CaseCard\\.vue'); return b !== null && /\btype\s+CaseStatus\b/.test(b); } },
    { lv: 3, at: ['CaseListPage.vue', '// ⑥ '], label: '⑥ CaseListPage.vue で、case-api.ts の default の caseApi と named の API_URL を、1 つの import 行で取り込む',
      hint: mkHint('default は { } の外（先頭）、named は { } の中。', "import caseApi, { API_URL } from '@/api/case-api'"),
      ok: (v) => { const b = braces(strip(v['CaseListPage.vue']), 'caseApi\\s*,\\s*', 'case-api'); return b !== null && /\bAPI_URL\b/.test(b); } },
  ];
  const spec = {
    mode: 'text', sfc: true, height: 400,
    files: Object.keys(FILES).map((n) => ({ name: n, lang: langOf(n), code: FILES[n] })),
    paths: { 'CaseListPage.vue': 'src/pages/CaseListPage.vue', 'CaseCard.vue': 'src/components/CaseCard.vue', 'case-api.ts': 'src/api/case-api.ts' },
    fileNotes: { 'CaseListPage.vue': '取り込む側（import を書く）', 'CaseCard.vue': '部品（型を export する）', 'case-api.ts': '棚：export を足す' },
    note: '<b>export の種類で、import の書き方が決まる</b><br>・<b>default</b>（部品・export default）→ <b>{ } なし</b>、名前は自由<br>・<b>named</b>（export const / function / type）→ <b>{ } あり</b>、名前は正確に<br>・<b>.vue から型を出す</b>には、setup の外の普通の <code>&lt;script lang="ts"&gt;</code> に export<br>まず export する側（<code>case-api.ts</code>・<code>CaseCard.vue</code>）、次に import する側を書こう。',
    solution: SOL,
    tasks: (v) => defs.map((d) => {
      let ok = false;
      try { ok = !!d.ok(v); } catch (e) { ok = false; }
      return { level: d.lv, label: d.label, ok, hint: d.hint, at: { file: d.at[0], find: [d.at[1]] } };
    }),
  };
  lock('x-vue-import', spec);
})();
