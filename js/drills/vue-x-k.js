/* 練習：補足 x-vue-store「store と eventBus」（シーン 2・3・4・5）。
   ・本物の Pinia はプレビューに入っていない（mitt も使わない）。そこで、同じ使い方の「手書き版」を .ts で用意して、本当に動かす。
     store/noticeStore.ts … 関数の外に置いた ref / reactive を返す useNoticeStore()（Pinia の使い方と同じ）
     lib/eventBus.ts      … Map と Set で作った on / off / emit（共有の連絡係。mitt も同じ使い方）
   ・ランナー（core.js の sfcBuild）の制約：.ts は import / export を消して 1 つにつなげる（単純な宣言だけ）／
     defineProps は型リテラル直書き／import は 1 行。
   ・シーン 2〜4 は、画面の文字（appText）と、コードの形で判定する。シーン 5（解除し忘れ・型・store・ローカル）は、コードの形で判定する。
   ・判定は、コメントを取り除いた本文に対して行う（TODO コメントの文言で通らないように）。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueDrillTools) return;
  const D = (K.drills = K.drills || {});
  const { web, multi, text, plain, T, appText, $q, $all, lines, VUE } = K.vueDrillTools;
  const ID = 'x-vue-store';
  D[ID] = D[ID] || {};

  const F = (s) => s.replace(/^\n/, '');
  const C = (code, lang) => ({ code: F(code), lang: lang || 'vue' });
  const A = (file, ...find) => ({ file, find });
  const nc = (s) => String(s || '').replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const re = (r, s) => r.test(s || '');
  const count = (r, s) => (String(s || '').match(r) || []).length;
  const cleanAll = (v) => { const w = {}; Object.keys(v).forEach((n) => { w[n] = nc(v[n]); }); return w; };

  const ST = `
<style scoped>
.badge { background: #ffe0e0; color: #b3261e; border-radius: 10px; padding: 0 10px; font-size: 13px; }
.card { border: 1px solid #d5d9e0; border-radius: 8px; padding: 6px 12px; margin: 6px 0; }
.read { opacity: 0.5; }
.reloads { background: #eef2ff; color: #1f2a44; border-radius: 8px; padding: 4px 12px; min-height: 1.6em; }
button { margin-left: 6px; }
ul { margin: 6px 0; }
</style>
`;
  const V = (script, tpl, style) => '<script setup lang="ts">\n' + script + '</script>\n\n<template>\n' + tpl + '</template>\n' + (style === false ? '' : ST);

  const TYPES = F(`
export interface Notice {
  id: number
  title: string
  read: boolean
}
`);

  /* ---------- 手書きの eventBus（on / off / emit の 3 つだけ） ---------- */
  const BUS = (events) => F(`
type Events = {
${events}
}

type Handler<K extends keyof Events> = (payload: Events[K]) => void

const handlers = new Map<keyof Events, Set<Handler<never>>>()

export const bus = {
  on<K extends keyof Events>(type: K, fn: Handler<K>): void {
    const set = handlers.get(type) ?? new Set<Handler<never>>()
    set.add(fn as Handler<never>)
    handlers.set(type, set)
  },
  off<K extends keyof Events>(type: K, fn: Handler<K>): void {
    handlers.get(type)?.delete(fn as Handler<never>)
  },
  emit<K extends keyof Events>(type: K, payload: Events[K]): void {
    handlers.get(type)?.forEach((fn) => (fn as Handler<K>)(payload))
  },
}
`);

  /* alias: ページの表示名。files の先頭（App.vue）がページ */
  const mk = (alias, files, sol, paths, notes, tasks, height) => multi(files, sol, (v, c) => tasks(cleanAll(v), c, v), { alias: { 'App.vue': alias }, paths, fileNotes: notes, height: height || 320 });

  /* ============ 2. store：みんなで共有する置き場 ============ */
  {
    const items3 = F(`
const items = ref<Notice[]>([
  { id: 1, title: '期日のお知らせ', read: false },
  { id: 2, title: '書類の提出依頼', read: false },
  { id: 3, title: '面談日程の確認', read: false },
])
`);
    const storeStart = F(`
import { ref, computed } from 'vue'
import type { Notice } from './types'

// ① items を ref<Notice[]> で作り、お知らせを 3 件入れる（期日のお知らせ / 書類の提出依頼 / 面談日程の確認。read は false）
const items = ref([])

const unread = computed<number>(() => items.value.filter((n) => !n.read).length)

// ④ markAllRead 関数を作る（全部の read を true にする）
// ⑥ addNotice(title: string) 関数を作る（read: false の新しいお知らせを items に足す）

export function useNoticeStore() {
  // ② items と unread、そして ④ ⑥ で作った関数を return する
  return {}
}
`);
    const storeSol = F(`
import { ref, computed } from 'vue'
import type { Notice } from './types'

` + items3 + `
const unread = computed<number>(() => items.value.filter((n) => !n.read).length)

function markAllRead(): void {
  items.value.forEach((n) => {
    n.read = true
  })
}

function addNotice(title: string): void {
  items.value.push({ id: items.value.length + 1, title, read: false })
}

export function useNoticeStore() {
  return { items, unread, markAllRead, addNotice }
}
`);
    const page = V(F(`
import NoticeBadge from '@/components/NoticeBadge.vue'
import NoticeList from '@/components/NoticeList.vue'
`), F(`
  <h3>お知らせセンター</h3>
  <NoticeBadge />
  <NoticeList />
`));
    const badgeStart = V(F(`
import { useNoticeStore } from '@/stores/noticeStore'

// ③ useNoticeStore() から unread を取り出す
`), F(`
  <span class="badge">未読 {{ unread }} 件</span>
`));
    const badgeSol = V(F(`
import { useNoticeStore } from '@/stores/noticeStore'

const { unread } = useNoticeStore()
`), F(`
  <span class="badge">未読 {{ unread }} 件</span>
`));
    const LI = '    <li v-for="n in items" :key="n.id" :class="{ read: n.read }">\n      {{ n.title }}<small v-if="n.read">（既読）</small>\n    </li>\n';
    const listStart = V(F(`
import { useNoticeStore } from '@/stores/noticeStore'

const { items } = useNoticeStore()
// ⑤ markAllRead も取り出して、「すべて既読」ボタンにつなぐ
// ⑥ addNotice も取り出して、「追加」ボタンにつなぐ
`), '  <ul>\n' + LI + '  </ul>\n  <!-- ⑤ ここに「すべて既読」ボタン -->\n  <!-- ⑥ ここに「追加」ボタン（addNotice(\'次回期日の変更\') を呼ぶ） -->\n');
    const listSol = V(F(`
import { useNoticeStore } from '@/stores/noticeStore'

const { items, markAllRead, addNotice } = useNoticeStore()
`), '  <ul>\n' + LI + '  </ul>\n  <button @click="markAllRead">すべて既読</button>\n  <button @click="addNotice(\'次回期日の変更\')">追加</button>\n');
    D[ID]['store：みんなで共有する置き場'] = mk('NoticePage.vue',
      { 'App.vue': page, 'NoticeBadge.vue': badgeStart, 'NoticeList.vue': listStart, 'noticeStore.ts': storeStart, 'types.ts': TYPES },
      { 'App.vue': page, 'NoticeBadge.vue': badgeSol, 'NoticeList.vue': listSol, 'noticeStore.ts': storeSol, 'types.ts': TYPES },
      { 'App.vue': 'src/pages/NoticePage.vue', 'NoticeBadge.vue': 'src/components/NoticeBadge.vue', 'NoticeList.vue': 'src/components/NoticeList.vue', 'noticeStore.ts': 'src/stores/noticeStore.ts', 'types.ts': 'src/types.ts' },
      { 'App.vue': 'ページ：2 つの部品を並べるだけ（データは渡さない）', 'NoticeBadge.vue': '部品：未読件数（store を読む）', 'NoticeList.vue': '部品：お知らせ一覧（store を読み書き）', 'noticeStore.ts': 'store：置き場。Pinia の defineStore と同じ形の手書き版', 'types.ts': '型：Notice' },
      (w, c) => {
        const S = w['noticeStore.ts'], B = w['NoticeBadge.vue'], L = w['NoticeList.vue'];
        const ret = (name) => re(new RegExp('return\\s*\\{[^}]*\\b' + name + '\\b[^}]*\\}'), S);
        return [
          T('① noticeStore.ts で、items を ref<Notice[]> で作り、お知らせを 3 件入れる（state）', 1,
            re(/const\s+items\s*=\s*ref\s*<\s*Notice\[\]\s*>\s*\(\s*\[/, S) && count(/title\s*:/g, S) >= 3 && count(/read\s*:\s*false/g, S) >= 3,
            ['共有するデータ本体（state）は ref で作る。型は Notice の配列。', C("const items = ref<Notice[]>([\n  { id: 1, title: '期日のお知らせ', read: false },\n  …\n])", 'ts')], A('noticeStore.ts', '① ')),
          T('② noticeStore.ts で、useNoticeStore が items と unread を return する（画面：3 件の一覧が出る）', 1,
            ret('items') && ret('unread') && /期日のお知らせ/.test(appText(c)) && /面談日程の確認/.test(appText(c)),
            ['return しないと、使う側（部品）から見えない。', C('return { items, unread }', 'ts')], A('noticeStore.ts', '② ')),
          T('③ NoticeBadge.vue で、useNoticeStore() から unread を取り出す（画面：未読 3 件）', 1,
            re(/const\s*\{\s*unread\s*\}\s*=\s*useNoticeStore\s*\(\s*\)/, B) && /未読\s*3\s*件/.test(appText(c)),
            ['部品は、props を受け取らず、store から直接取り出す。', C('const { unread } = useNoticeStore()', 'ts'), '画面に出るには、② で unread を return しておく必要がある。'], A('NoticeBadge.vue', '③ ')),
          T('④ noticeStore.ts で、markAllRead 関数（全部の read を true にする）を作って return する（actions）', 2,
            re(/function\s+markAllRead\s*\(\s*\)\s*(:\s*void\s*)?\{[\s\S]*?\.read\s*=\s*true/, S) && ret('markAllRead'),
            ['書き換えは、store の中の関数（actions）に集める。', C('function markAllRead(): void {\n  items.value.forEach((n) => {\n    n.read = true\n  })\n}', 'ts'), 'script の中なので items.value。作ったら return { …, markAllRead } にも足す。'], A('noticeStore.ts', '④ ')),
          T('⑤ NoticeList.vue で、markAllRead を取り出して、「すべて既読」ボタンにつなぐ（画面：押すと未読 0 件）', 2,
            re(/const\s*\{[^}]*\bmarkAllRead\b[^}]*\}\s*=\s*useNoticeStore\s*\(\s*\)/, L) && re(/<button[^>]*@click\s*=\s*["']markAllRead(\(\s*\))?["']/, L),
            ['一覧の部品が action を呼ぶと、バッジ（別の部品）も一緒に変わる。', C('const { items, markAllRead } = useNoticeStore()\n\n<button @click="markAllRead">すべて既読</button>')], A('NoticeList.vue', '⑤ ')),
          T('⑥ noticeStore.ts と NoticeList.vue で、addNotice(title) を作り、「追加」ボタンから呼ぶ（画面：押すと 4 件、未読 4 件）', 3,
            re(/function\s+addNotice\s*\(\s*title\s*:\s*string\s*\)[\s\S]*?items\.value\.push\([^)]*read\s*:\s*false/, S) && ret('addNotice') && re(/const\s*\{[^}]*\baddNotice\b[^}]*\}\s*=\s*useNoticeStore\s*\(\s*\)/, L) && re(/<button[^>]*@click\s*=\s*["']addNotice\(\s*['"][^'"]+['"]\s*\)["']/, L),
            ['store に、新しいお知らせを足す関数を作る。', C("function addNotice(title: string): void {\n  items.value.push({ id: items.value.length + 1, title, read: false })\n}", 'ts'), "return に addNotice を足し、一覧の部品で取り出して <button @click=\"addNotice('次回期日の変更')\">追加</button>。"], A('noticeStore.ts', '⑥ ')),
        ];
      }, 330);
  }

  /* ============ 3. store を使うときのコード ============ */
  {
    const STORE = F(`
import { ref, computed, reactive, toRefs } from 'vue'

const messages = ref<string[]>([])

const unread = computed<number>(() => messages.value.length)

function push(message: string): void {
  messages.value.push(message)
}

const store = reactive({ messages, unread, push })

export function useNoticeStore() {
  return store
}

export function storeToRefs<T extends object>(source: T) {
  return toRefs(source)
}
`);
    const page = V(F(`
import NoticeBadge from '@/components/NoticeBadge.vue'
import CaseList from '@/components/CaseList.vue'
`), F(`
  <h3>案件ボード</h3>
  <NoticeBadge />
  <CaseList />
`));
    const list = V(F(`
import { ref } from 'vue'
import CaseCard from '@/components/CaseCard.vue'

const titles = ref<string[]>(['離婚の相談', '相続の相談', '労働の相談'])
`), F(`
  <CaseCard v-for="t in titles" :key="t" :title="t" />
`));
    const cardStart = V(F(`
import { useNoticeStore } from '@/stores/noticeStore'

defineProps<{ title: string }>()

// ① useNoticeStore() を呼んで、notice に入れる
// ② ボタンの @click で、通知を 1 件足す（push を呼ぶ）
// ⑤ ① を分割代入に書き換える（push は action なので、そのまま取り出してよい）
// ⑥ push に渡すメッセージに、案件の title を入れる（「◯◯を承諾しました」）
`), F(`
  <div class="card">
    <b>{{ title }}</b>
    <button>承諾する</button>
  </div>
`));
    const cardSol = V(F(`
import { useNoticeStore } from '@/stores/noticeStore'

defineProps<{ title: string }>()

const { push } = useNoticeStore()
`), F(`
  <div class="card">
    <b>{{ title }}</b>
    <button @click="push(\`\${title}を承諾しました\`)">承諾する</button>
  </div>
`));
    const badgeStart = V(F(`
import { useNoticeStore } from '@/stores/noticeStore'
import { storeToRefs } from '@/stores/noticeStore'

// ③ useNoticeStore() を呼んで、notice に入れる（template は notice.unread にする）
// ④ ③ を書き換えて、unread を storeToRefs で取り出す（template は {{ unread }}）
`), F(`
  <span class="badge">通知 {{ unread }} 件</span>
`));
    const badgeSol = V(F(`
import { useNoticeStore } from '@/stores/noticeStore'
import { storeToRefs } from '@/stores/noticeStore'

const { unread } = storeToRefs(useNoticeStore())
`), F(`
  <span class="badge">通知 {{ unread }} 件</span>
`));
    D[ID]['store を使うときのコード'] = mk('CaseBoardPage.vue',
      { 'App.vue': page, 'NoticeBadge.vue': badgeStart, 'CaseList.vue': list, 'CaseCard.vue': cardStart, 'noticeStore.ts': STORE },
      { 'App.vue': page, 'NoticeBadge.vue': badgeSol, 'CaseList.vue': list, 'CaseCard.vue': cardSol, 'noticeStore.ts': STORE },
      { 'App.vue': 'src/pages/CaseBoardPage.vue', 'NoticeBadge.vue': 'src/components/NoticeBadge.vue', 'CaseList.vue': 'src/components/CaseList.vue', 'CaseCard.vue': 'src/components/CaseCard.vue', 'noticeStore.ts': 'src/stores/noticeStore.ts' },
      { 'App.vue': 'ページ：バッジと案件一覧を並べるだけ', 'NoticeBadge.vue': '部品：ヘッダーの通知バッジ（遠い）', 'CaseList.vue': '部品：中継なし。CaseCard を並べるだけ', 'CaseCard.vue': '部品：「承諾する」で通知を足す', 'noticeStore.ts': 'store：手書き版。reactive で返すので notice.unread と書ける' },
      (w, c) => {
        const B = w['NoticeBadge.vue'], Cd = w['CaseCard.vue'];
        return [
          T('① CaseCard.vue で、useNoticeStore() を呼んで notice に入れる', 1,
            re(/const\s+notice\s*=\s*useNoticeStore\s*\(\s*\)/, Cd) || re(/const\s*\{[^}]*\}\s*=\s*useNoticeStore\s*\(\s*\)/, Cd),
            ['store を使う部品は、まず useNoticeStore() を呼ぶ。', C('const notice = useNoticeStore()', 'ts')], A('CaseCard.vue', '① ')),
          T('② CaseCard.vue で、ボタンの @click から push を呼ぶ（承諾すると通知が増える）', 1,
            re(/<button[^>]*@click\s*=\s*["'][^"']*\bpush\s*\(/, Cd),
            ['親にも中継の部品にも頼まず、store の push を直接呼ぶ。', C("<button @click=\"notice.push('承諾しました')\">承諾する</button>")], A('CaseCard.vue', '② ')),
          T('③ NoticeBadge.vue で、useNoticeStore() を呼び、notice.unread を表示する（画面：通知 0 件）', 1,
            re(/useNoticeStore\s*\(\s*\)/, B) && /通知\s*0\s*件/.test(appText(c)),
            ['離れた部品でも、同じ store を呼べば同じ値が見える。', C('const notice = useNoticeStore()\n\n<span class="badge">通知 {{ notice.unread }} 件</span>')], A('NoticeBadge.vue', '③ ')),
          T('④ NoticeBadge.vue で、unread を storeToRefs で取り出して表示する（{{ unread }}）', 2,
            re(/const\s*\{\s*unread\s*\}\s*=\s*storeToRefs\s*\(\s*(useNoticeStore\s*\(\s*\)|notice)\s*\)/, B) && re(/\{\{\s*unread\s*\}\}/, B) && /通知\s*0\s*件/.test(appText(c)),
            ['const { unread } = notice と書くと、ただのコピー。変わらなくなる。', 'state と getters を分割代入するときは、storeToRefs で包む。', C('const { unread } = storeToRefs(useNoticeStore())', 'ts')], A('NoticeBadge.vue', '④ ')),
          T('⑤ CaseCard.vue で、push を分割代入で取り出す（const { push } = useNoticeStore()）', 2,
            re(/const\s*\{\s*push\s*\}\s*=\s*useNoticeStore\s*\(\s*\)/, Cd) && re(/<button[^>]*@click\s*=\s*["'][^"']*\bpush\s*\(/, Cd) && !re(/notice\.push/, Cd),
            ['action（関数）は、storeToRefs を使わず、そのまま分割代入してよい。', C('const { push } = useNoticeStore()\n\n<button @click="push(\'承諾しました\')">承諾する</button>')], A('CaseCard.vue', '⑤ ')),
          T('⑥ CaseCard.vue で、push に渡すメッセージに title を入れる（「◯◯を承諾しました」）', 3,
            re(/@click\s*=\s*"[^"]*\bpush\s*\(\s*(`[^`]*\$\{\s*title\s*\}|title\s*\+|[^)]*\+\s*title)/, Cd),
            ['title は props。template の中でも、そのまま使える。', C('<button @click="push(`${title}を承諾しました`)">承諾する</button>')], A('CaseCard.vue', '⑥ ')),
        ];
      }, 330);
  }

  /* ============ 4. eventBus：離れた部品に、合図だけ送る ============ */
  {
    const EVT1 = "  'case:saved': { id: number }";
    const EVT2 = "  'case:saved': { id: number }\n  'modal:closed': { name: string }";
    const busStart = BUS(EVT1).replace('type Events = {', "// ④ 'modal:closed': { name: string } を Events に足す\ntype Events = {");
    const busSol = BUS(EVT2);
    const page = V(F(`
import CaseForm from '@/components/CaseForm.vue'
import CaseEdit from '@/components/CaseEdit.vue'
import SavedBadge from '@/components/SavedBadge.vue'
import CaseList from '@/components/CaseList.vue'
`), F(`
  <h3>案件ボード</h3>
  <SavedBadge />
  <CaseForm />
  <CaseEdit />
  <CaseList />
`));
    const formStart = V(F(`
import { bus } from '@/lib/eventBus'

// ① 「保存する」を押したら、bus.emit('case:saved', { id: 7 }) で合図を送る
`), F(`
  <div class="card">
    <b>案件の新規登録</b>
    <button>保存する</button>
  </div>
`));
    const formSol = V(F(`
import { bus } from '@/lib/eventBus'

function save(): void {
  bus.emit('case:saved', { id: 7 })
}
`), F(`
  <div class="card">
    <b>案件の新規登録</b>
    <button @click="save">保存する</button>
  </div>
`));
    const editStart = V(F(`
import { bus } from '@/lib/eventBus'

function close(): void {
  bus.emit('modal:closed', { name: 'edit' })
}

// ③ 「更新する」を押したら、bus.emit('case:saved', { id: 7 }) を送る
`), F(`
  <div class="card">
    <b>案件の編集ダイアログ</b>
    <button>更新する</button>
    <button @click="close">閉じる</button>
  </div>
`));
    const editSol = V(F(`
import { bus } from '@/lib/eventBus'

function close(): void {
  bus.emit('modal:closed', { name: 'edit' })
}

function update(): void {
  bus.emit('case:saved', { id: 7 })
}
`), F(`
  <div class="card">
    <b>案件の編集ダイアログ</b>
    <button @click="update">更新する</button>
    <button @click="close">閉じる</button>
  </div>
`));
    const listStart = V(F(`
import { ref } from 'vue'
import { bus } from '@/lib/eventBus'

const reloads = ref<number>(0)
const lastClosed = ref<string>('（なし）')

// ② bus.on('case:saved', reload) で聞いて、reload の中で reloads を 1 増やす
// ⑤ bus.on('modal:closed', …) でも聞いて、lastClosed を e.name にする
`), F(`
  <p class="reloads">案件一覧：再読み込み {{ reloads }} 回 ／ 最後に閉じた：{{ lastClosed }}</p>
`));
    const listSol = V(F(`
import { ref } from 'vue'
import { bus } from '@/lib/eventBus'

const reloads = ref<number>(0)
const lastClosed = ref<string>('（なし）')

function reload(): void {
  reloads.value++
}

bus.on('case:saved', reload)
bus.on('modal:closed', (e) => {
  lastClosed.value = e.name
})
`), F(`
  <p class="reloads">案件一覧：再読み込み {{ reloads }} 回 ／ 最後に閉じた：{{ lastClosed }}</p>
`));
    const badgeStart = V(F(`
import { ref } from 'vue'
import { bus } from '@/lib/eventBus'

const count = ref<number>(0)

// ⑥ bus.on('case:saved', …) で聞いて、count を 1 増やす（聞く部品は何個あってもよい）
`), F(`
  <span class="badge">保存 {{ count }} 件</span>
`));
    const badgeSol = V(F(`
import { ref } from 'vue'
import { bus } from '@/lib/eventBus'

const count = ref<number>(0)

bus.on('case:saved', () => {
  count.value++
})
`), F(`
  <span class="badge">保存 {{ count }} 件</span>
`));
    D[ID]['eventBus：離れた部品に、合図だけ送る'] = mk('CaseBoardPage.vue',
      { 'App.vue': page, 'CaseForm.vue': formStart, 'CaseEdit.vue': editStart, 'CaseList.vue': listStart, 'SavedBadge.vue': badgeStart, 'eventBus.ts': busStart },
      { 'App.vue': page, 'CaseForm.vue': formSol, 'CaseEdit.vue': editSol, 'CaseList.vue': listSol, 'SavedBadge.vue': badgeSol, 'eventBus.ts': busSol },
      { 'App.vue': 'src/pages/CaseBoardPage.vue', 'CaseForm.vue': 'src/components/CaseForm.vue', 'CaseEdit.vue': 'src/components/CaseEdit.vue', 'CaseList.vue': 'src/components/CaseList.vue', 'SavedBadge.vue': 'src/components/SavedBadge.vue', 'eventBus.ts': 'src/lib/eventBus.ts' },
      { 'App.vue': 'ページ：部品を並べるだけ（互いを知らない）', 'CaseForm.vue': '送る側：保存したら case:saved の合図', 'CaseEdit.vue': '送る側：閉じたら modal:closed、更新したら case:saved', 'CaseList.vue': '聞く側：合図が来たら再読み込み', 'SavedBadge.vue': '聞く側：case:saved を数える', 'eventBus.ts': 'bus：共有の連絡係（on / off / emit の手書き版）' },
      (w, c) => {
        const Fm = w['CaseForm.vue'], Ed = w['CaseEdit.vue'], Ls = w['CaseList.vue'], Nb = w['SavedBadge.vue'], Bs = w['eventBus.ts'];
        return [
          T("① CaseForm.vue で、「保存する」を押したら bus.emit('case:saved', { id: 7 }) を送る", 1,
            re(/bus\.emit\s*\(\s*['"]case:saved['"]\s*,\s*\{\s*id\s*:\s*7\s*\}\s*\)/, Fm) && re(/<button[^>]*@click\s*=/, Fm),
            ['送る側は、誰が聞いているかを知らなくてよい。', C("function save(): void {\n  bus.emit('case:saved', { id: 7 })\n}", 'ts'), 'ボタンに @click="save" をつなぐ。'], A('CaseForm.vue', '① ')),
          T("② CaseList.vue で、bus.on('case:saved', reload) で聞いて、reload の中で reloads を 1 増やす", 1,
            re(/bus\.on\s*\(\s*['"]case:saved['"]\s*,\s*reload\s*\)/, Ls) && re(/function\s+reload\s*\(\s*\)[^{]*\{[^}]*reloads\.value\s*(\+\+|\+=\s*1)/, Ls),
            ['聞く側は、合図が来たときに動く関数を on で登録する。', C("function reload(): void {\n  reloads.value++\n}\n\nbus.on('case:saved', reload)", 'ts')], A('CaseList.vue', '② ')),
          T("③ CaseEdit.vue で、「更新する」を押したら bus.emit('case:saved', { id: 7 }) を送る", 1,
            re(/bus\.emit\s*\(\s*['"]case:saved['"]\s*,\s*\{\s*id\s*:\s*7\s*\}\s*\)/, Ed) && re(/<button[^>]*@click\s*=\s*["'](?!close)[^"']+["'][^>]*>\s*更新する/, Ed),
            ['送る側は何個あってもよい。CaseList は、どこからの合図かを気にしない。', C("function update(): void {\n  bus.emit('case:saved', { id: 7 })\n}", 'ts'), '「更新する」のボタンに @click="update"。'], A('CaseEdit.vue', '③ ')),
          T("④ eventBus.ts で、Events 型に 'modal:closed': { name: string } を足す（合図の名前と中身の型）", 2,
            re(/type\s+Events\s*=\s*\{[^}]*['"]case:saved['"]\s*:\s*\{\s*id\s*:\s*number\s*\}[^}]*['"]modal:closed['"]\s*:\s*\{\s*name\s*:\s*string\s*\}/, Bs),
            ['Events 型に書いた名前だけが、emit / on で使える。名前のタイプミスを防ぐ。', C("type Events = {\n  'case:saved': { id: number }\n  'modal:closed': { name: string }\n}", 'ts')], A('eventBus.ts', '④ ')),
          T("⑤ CaseList.vue で、bus.on('modal:closed', …) でも聞いて、lastClosed を e.name にする", 2,
            re(/bus\.on\s*\(\s*['"]modal:closed['"]\s*,[\s\S]*?lastClosed\.value\s*=\s*\w+\.name/, Ls),
            ['合図ごとに、聞く関数を分ける。中身（payload）の name が使える。', C("bus.on('modal:closed', (e) => {\n  lastClosed.value = e.name\n})", 'ts')], A('CaseList.vue', '⑤ ')),
          T("⑥ SavedBadge.vue で、bus.on('case:saved', …) で聞いて、count を 1 増やす（画面の保存 0 件が、保存で増える）", 3,
            re(/bus\.on\s*\(\s*['"]case:saved['"]\s*,[\s\S]*?count\.value\s*(\+\+|\+=\s*1)/, Nb),
            ['同じ合図を、別の部品も聞ける（送る側は何も変えなくてよい）。', C("bus.on('case:saved', () => {\n  count.value++\n})", 'ts')], A('SavedBadge.vue', '⑥ ')),
        ];
      }, 340);
  }

  /* ============ 5. バスの落とし穴：解除し忘れ ============ */
  {
    const BUS5 = BUS("  'case:saved': { id: number }");
    const CART = F(`
import { ref, computed, reactive } from 'vue'

const items = ref<number[]>([101, 102])

const count = computed<number>(() => items.value.length)

function add(id: number): void {
  items.value.push(id)
}

const store = reactive({ items, count, add })

export function useCartStore() {
  return store
}
`);
    const SEARCH = F(`
import { ref } from 'vue'

const keyword = ref<string>('')

export function useSearchStore() {
  return { keyword }
}
`);
    const pageStart = V(F(`
import { ref } from 'vue'
import { bus } from '@/lib/eventBus'
import { useCartStore } from '@/stores/cartStore'
import CaseList from '@/components/CaseList.vue'
import CartBadge from '@/components/CartBadge.vue'
import SearchBox from '@/components/SearchBox.vue'

const showList = ref<boolean>(true)

function save(): void {
  bus.emit('case:svaed', { id: 7 })
}

function addToCart(): void {
  bus.emit('cart:add', { id: 103 })
}

// ③ 上の save の bus.emit の名前を、Events にある 'case:saved' に直す
// ⑤ useCartStore() を呼んで cart に入れ、addToCart では bus ではなく cart.add(103) を呼ぶ
`), F(`
  <h3>案件ページ</h3>
  <CartBadge />
  <SearchBox />
  <button @click="save">保存する</button>
  <button @click="addToCart">カートに入れる</button>
  <label><input v-model="showList" type="checkbox" /> 案件一覧を表示</label>
  <CaseList v-if="showList" />
`));
    const pageSol = V(F(`
import { ref } from 'vue'
import { bus } from '@/lib/eventBus'
import { useCartStore } from '@/stores/cartStore'
import CaseList from '@/components/CaseList.vue'
import CartBadge from '@/components/CartBadge.vue'
import SearchBox from '@/components/SearchBox.vue'

const showList = ref<boolean>(true)
const cart = useCartStore()

function save(): void {
  bus.emit('case:saved', { id: 7 })
}

function addToCart(): void {
  cart.add(103)
}
`), F(`
  <h3>案件ページ</h3>
  <CartBadge />
  <SearchBox />
  <button @click="save">保存する</button>
  <button @click="addToCart">カートに入れる</button>
  <label><input v-model="showList" type="checkbox" /> 案件一覧を表示</label>
  <CaseList v-if="showList" />
`));
    const listStart5 = V(F(`
import { ref } from 'vue'
import { bus } from '@/lib/eventBus'

const reloads = ref<number>(0)

function reload(): void {
  reloads.value++
}

bus.on('case:saved', reload)

// ① bus.on を onMounted の中に入れる（表示されたときに登録する）
// ② onUnmounted の中で bus.off('case:saved', reload) を呼ぶ（消えるときに解除する）
`), F(`
  <p class="reloads">案件一覧：再読み込み {{ reloads }} 回</p>
`));
    const listSol5 = V(F(`
import { ref, onMounted, onUnmounted } from 'vue'
import { bus } from '@/lib/eventBus'

const reloads = ref<number>(0)

function reload(): void {
  reloads.value++
}

onMounted(() => {
  bus.on('case:saved', reload)
})

onUnmounted(() => {
  bus.off('case:saved', reload)
})
`), F(`
  <p class="reloads">案件一覧：再読み込み {{ reloads }} 回</p>
`));
    const cartStart = V(F(`
import { ref } from 'vue'

const count = ref<number>(0)

// ④ bus で数えるのをやめて、useCartStore() の count を表示する（cart.count）
`), F(`
  <span class="badge">カート {{ count }} 個</span>
`));
    const cartSol = V(F(`
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()
`), F(`
  <span class="badge">カート {{ cart.count }} 個</span>
`));
    const searchStart = V(F(`
import { useSearchStore } from '@/stores/searchStore'

const search = useSearchStore()

// ⑥ 入力途中の文字は、この部品の中だけで使う。store をやめて、ローカルの ref<string>('') にする
`), F(`
  <input v-model="search.keyword" placeholder="相談の件名" />
`));
    const searchSol = V(F(`
import { ref } from 'vue'

const keyword = ref<string>('')
`), F(`
  <input v-model="keyword" placeholder="相談の件名" />
`));
    D[ID]['バスの落とし穴：解除し忘れ'] = mk('CaseListPage.vue',
      { 'App.vue': pageStart, 'CaseList.vue': listStart5, 'CartBadge.vue': cartStart, 'SearchBox.vue': searchStart, 'eventBus.ts': BUS5, 'cartStore.ts': CART, 'searchStore.ts': SEARCH },
      { 'App.vue': pageSol, 'CaseList.vue': listSol5, 'CartBadge.vue': cartSol, 'SearchBox.vue': searchSol, 'eventBus.ts': BUS5, 'cartStore.ts': CART, 'searchStore.ts': SEARCH },
      { 'App.vue': 'src/pages/CaseListPage.vue', 'CaseList.vue': 'src/components/CaseList.vue', 'CartBadge.vue': 'src/components/CartBadge.vue', 'SearchBox.vue': 'src/components/SearchBox.vue', 'eventBus.ts': 'src/lib/eventBus.ts', 'cartStore.ts': 'src/stores/cartStore.ts', 'searchStore.ts': 'src/stores/searchStore.ts' },
      { 'App.vue': 'ページ：チェックを外すと CaseList が消える', 'CaseList.vue': '聞く側：消えるときに解除する', 'CartBadge.vue': 'カート数：状態なので store から読む', 'SearchBox.vue': '入力欄：その部品の中だけの値', 'eventBus.ts': 'bus：on / off / emit（手書き版）', 'cartStore.ts': 'store：カート（状態の置き場）', 'searchStore.ts': 'store：入れすぎの例（あとで使わなくなる）' },
      (w, c, raw) => {
        const P = w['App.vue'], Ts = w['CaseList.vue'], Cb = w['CartBadge.vue'], Sb = w['SearchBox.vue'];
        return [
          T("① CaseList.vue で、bus.on('case:saved', reload) を onMounted の中に入れる（表示されたときに登録）", 1,
            re(/onMounted\s*\(\s*\(\s*\)\s*=>\s*\{?[^}]*bus\.on\s*\(\s*['"]case:saved['"]\s*,\s*reload\s*\)/, Ts),
            ['登録する時と消える時を、ペアで考える。表示されたときは onMounted（vue-life で習う）。', C("onMounted(() => {\n  bus.on('case:saved', reload)\n})", 'ts')], A('CaseList.vue', '① ')),
          T("② CaseList.vue で、onUnmounted の中で bus.off('case:saved', reload) を呼ぶ（消えるときに解除）", 1,
            re(/onUnmounted\s*\(\s*\(\s*\)\s*=>\s*\{?[^}]*bus\.off\s*\(\s*['"]case:saved['"]\s*,\s*reload\s*\)/, Ts) && re(/bus\.on\s*\(\s*['"]case:saved['"]\s*,\s*reload\s*\)/, Ts),
            ['解除しないと、画面から消えた後も、ハンドラが残る。戻るたびに増えて、一覧が何回も再読み込みされる。', 'off には、on と同じ関数（reload）を渡す。', C("onUnmounted(() => {\n  bus.off('case:saved', reload)\n})", 'ts')], A('CaseList.vue', '② ')),
          T("③ CaseListPage.vue で、bus.emit('case:svaed', …) の名前を、Events にある 'case:saved' に直す", 1,
            re(/bus\.emit\s*\(\s*['"]case:saved['"]\s*,/, P) && !re(/['"]case:svaed['"]/, P),
            ['名前が文字列のままだと、1 文字違っても気づけない。Events 型に書いた名前だけを使う。', C("bus.emit('case:saved', { id: 7 })", 'ts')], A('App.vue', '③ ')),
          T('④ CartBadge.vue で、bus ではなく useCartStore() の cart.count を表示する（画面：カート 2 個）', 2,
            re(/const\s+cart\s*=\s*useCartStore\s*\(\s*\)/, Cb) && re(/\{\{\s*cart\.count\s*\}\}/, Cb) && /カート\s*2\s*個/.test(appText(c)),
            ['カートの数は「状態」。bus は合図を覚えないので、開く前の合図は取りこぼす。', C('const cart = useCartStore()\n\n<span class="badge">カート {{ cart.count }} 個</span>')], A('CartBadge.vue', '④ ')),
          T('⑤ CaseListPage.vue で、addToCart が bus ではなく cart.add(103) を呼ぶ（状態を変えるのは store の action）', 2,
            re(/const\s+cart\s*=\s*useCartStore\s*\(\s*\)/, P) && re(/function\s+addToCart\s*\(\s*\)[^{]*\{[^}]*cart\.add\s*\(\s*103\s*\)/, P) && !re(/cart:add/, P),
            ['store を呼んで、action を直接呼ぶ。cart:add のような文字列の合図は、もう要らない。', C('const cart = useCartStore()\n\nfunction addToCart(): void {\n  cart.add(103)\n}', 'ts')], A('App.vue', '⑤ ')),
          T("⑥ SearchBox.vue で、入力途中の文字を store ではなく、ローカルの ref<string>('') にする（v-model も keyword に）", 3,
            re(/const\s+keyword\s*=\s*ref\s*<\s*string\s*>\s*\(\s*(''|"")\s*\)/, Sb) && re(/v-model\s*=\s*["']keyword["']/, Sb) && !re(/useSearchStore\s*\(/, Sb),
            ['その部品の中だけで使う値は、ローカルの ref で十分。store に入れると、誰が書き換えたか追えなくなる。', C("const keyword = ref<string>('')\n\n<input v-model=\"keyword\" />")], A('SearchBox.vue', '⑥ ')),
        ];
      }, 340);
  }
})();
