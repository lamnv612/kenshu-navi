/* 補足：TypeScript × Vue（型を Vue の中でどう使う？ 1ファイル ⇄ ファイル分割・API まで） */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.reg) return;
  const { h, code, lbl, style, sleep } = K.W;
  const C = 'var(--vue)';
  const CLS = ['h1', 'h2', 'h3', 'hd'], CLR = ['#ff6b9d', '#5b9dff', '#ffb454', '#2fd4a4'];

  style('vts', `
  .vt-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:start}
  @media(max-width:980px){.vt-grid{grid-template-columns:1fr}}
  @media(min-width:981px){.vt-grid>:nth-child(2){position:sticky;top:12px}}
  .vt-stage{display:grid;gap:8px;background:#fff;color:#223;border-radius:12px;padding:14px;border:1px solid var(--line);min-height:120px;align-content:start}
  .vt-tree{display:grid;gap:3px;font:700 .8rem var(--mono)}
  .vt-it{all:unset;cursor:pointer;box-sizing:border-box;display:flex;gap:6px;align-items:center;padding:6px 8px;border-radius:7px;border:1px solid transparent;transition:.2s}
  .vt-it:hover{background:var(--card2)}.vt-it.on{background:color-mix(in srgb,var(--vue) 22%,var(--card));border-color:var(--vue)}.vt-it.glow{animation:vtg .9s}
  @keyframes vtg{40%{box-shadow:0 0 0 3px var(--vue)}}
  .vt-it small{margin-left:auto;font:800 .62rem var(--font);color:var(--mute);white-space:nowrap}
  .vt-chain{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
  .vt-nd{all:unset;cursor:pointer;padding:6px 10px;border-radius:8px;border:2px solid var(--line);background:var(--card);font:800 .74rem var(--mono);transition:.2s;text-align:center}
  .vt-nd.on{border-color:var(--vue);background:color-mix(in srgb,var(--vue) 24%,var(--card));transform:translateY(-2px)}
  .vt-nd small{display:block;font:700 .6rem var(--font);color:var(--mute)}
  .vt-lk{display:inline-flex;gap:.4em;align-items:center;padding:.3em .8em;border-radius:8px;border:2px solid var(--n);font:800 .76rem var(--font);cursor:pointer;background:color-mix(in srgb,var(--n) 16%,var(--card2));transition:.2s}
  .vt-lk:hover{transform:translateY(-2px)}
  .vt-err{padding:8px 12px;border-radius:8px;background:#ffe3e3;color:#a11;font:700 .78rem var(--mono);border-left:5px solid #e33}
  .vt-ok{padding:8px 12px;border-radius:8px;background:#dff7e6;color:#165;font:700 .8rem var(--font);border-left:5px solid #0a7}
  `);

  const note = (t, c) => h('div', { class: 'vi-msg ' + (c || 'w') }, t);
  const dd = (ok, ng) => h('div', { class: 'vi-eq' }, h('div', { class: 'vc-do' }, h('b', '✓ こうすると読みやすい'), ...ok.map((t) => h('small', t))), h('div', { class: 'vc-dont' }, h('b', '✖ こうなりがち'), ...ng.map((t) => h('small', t))));
  /* 行の選び方：['部分文字列', …] か { a: '開始の文字', b: '終了の文字' }（その間をぜんぶ） */
  const lines = (src, spec) => {
    const L = src.split('\n'), out = [];
    if (Array.isArray(spec)) { L.forEach((l, i) => { if (spec.some((k) => l.includes(k))) out.push(i + 1); }); return out; }
    const a = L.findIndex((l) => l.includes(spec.a)); if (a < 0) return out;
    let b = a; if (spec.b) { const k = L.findIndex((l, i) => i >= a && l.includes(spec.b)); b = k < 0 ? a : k; }
    for (let i = a; i <= b; i++) out.push(i + 1); return out;
  };
  /* 部分（チップ）にカーソルを乗せる → 対応する行が色付きで光る。pres: [[pre, src, key?]]、parts: [[名前, {src側のキー: spec} or spec]] */
  const chips = (pres, parts) => {
    const set = (i) => pres.forEach(([pre, src, key]) => { CLS.forEach((c) => pre.setHi([], c)); if (i == null) return; const sp = parts[i][1], mine = key != null && !Array.isArray(sp) && !('a' in sp) ? sp[key] : sp; if (mine) pre.setHi(lines(src, mine), CLS[i % 4]); });
    return h('div', { class: 'vi-row' }, h('span', { class: 'vi-lb' }, '👆 部分にカーソルを乗せる：'), ...parts.map((x, i) => h('span', { class: 'vi-chip', style: { '--cc': CLR[i % 4] }, onmouseenter: () => set(i), onmouseleave: () => set(null), onclick: () => set(i) }, x[0])));
  };
  const tabs = (list, cur, on) => h('div', { class: 'vi-row' }, ...list.map((t, i) => h('span', { class: 'vi-chip' + (i === cur ? '' : ' off'), style: { '--cc': C }, onclick: () => on(i) }, t)));

  /* ============ ① 1ファイルに全部 ============ */
  function oneFile() {
    const SRC = `<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// ① 型：データの形（interface）
interface Case {
  id: number
  title: string
  status: Status
  note?: string
}

// ② 候補を並べる型（union）
type Status = '未着手' | '進行中' | '完了'

// ③ 状態（ref に型を付ける）
const cases = ref<Case[]>([])
const filter = ref<Status | 'すべて'>('すべて')
const loading = ref(true)

// ④ 計算（型は自動で決まる）
const shown = computed(() =>
  filter.value === 'すべて'
    ? cases.value
    : cases.value.filter((c) => c.status === filter.value)
)

// ⑤ API から取得
async function load(): Promise<void> {
  const res = await fetch('/api/cases')
  cases.value = (await res.json()) as Case[]
  loading.value = false
}
onMounted(load)
</script>

<template>
  <select v-model="filter">
    <option>すべて</option>
    <option>未着手</option>
    <option>進行中</option>
    <option>完了</option>
  </select>
  <p v-if="loading">読み込み中…</p>
  <ul v-else>
    <li v-for="c in shown" :key="c.id">{{ c.title }}（{{ c.status }}）</li>
  </ul>
</template>`;
    const pre = code(SRC, 'vue', { color: C, file: 'CaseListView.vue（全部この1ファイル）', dim: true });
    const P = [['① interface（形）', { a: '// ① 型', b: '  note?: string' }], ['② union（候補）', { a: '// ② 候補', b: "type Status" }], ['③ ref<型>（状態）', { a: '// ③ 状態', b: 'const loading' }], ['④ computed（計算）', { a: '// ④ 計算', b: '    : cases.value.filter' }], ['⑤ API（取得）', { a: '// ⑤ API', b: 'onMounted(load)' }], ['⑥ 画面（template）', { a: '<template>', b: '</template>' }]];
    const stage = h('div', { class: 'vt-stage' }, h('div', { style: { color: '#889', fontWeight: 700 } }, '（ボタンを押すと、エラーが出る様子がここに表示される）')), msg = note('👆 上のボタンで、型のおかげで何が分かるかを見よう', 'w');
    const ERR = [
      ['status に "完成" と書くと…', "Type '\"完成\"' is not assignable to type 'Status'", 'union があるので、打ち間違いはその場で赤線。', ['status: Status', "type Status"]],
      ['cases.value に数を入れると…', "Type 'number' is not assignable to type 'Case[]'", 'ref<Case[]> と書いたので、違う型は入らない。', ['const cases']],
      ['c.titel と書き間違えると…', "Property 'titel' does not exist on type 'Case'", 'interface があるので、項目名の打ち間違いも赤線。補完も効く。', ['{{ c.title }}', 'interface Case']],
    ];
    const show = (e) => { stage.replaceChildren(h('div', { class: 'vt-err' }, e[1]), h('div', { class: 'vt-ok' }, '✓ ' + e[2])); pre.setHi(lines(SRC, e[3]), 'h3'); msg.textContent = e[0]; };
    return h('div', { style: { display: 'grid', gap: '12px' } },
      h('div', { class: 'vt-grid' },
        h('div', { class: 'vi-panel' }, lbl('1つの .vue に、型・状態・計算・API・画面ぜんぶ'), pre),
        h('div', { class: 'vi-panel' }, lbl('① 部分を選ぶ → 左のコードが光る'), chips([[pre, SRC]], P), lbl('② 型があると、何が助かる？（間違いを入れてみる）'), h('div', { class: 'vi-row' }, ...ERR.map((e) => h('button', { class: 'btn', onclick: () => show(e) }, '🐛 ' + e[0].replace('…', '')))), msg, stage,
          h('div', { class: 'vi-box' }, h('small', 'このファイルの問題点'), h('b', '全部入りで 50 行をこえた。型を他の画面でも使いたくなったら、分けどき（次のシーン〜）')))),
      dd(['小さい画面・試作は、1ファイルで十分', '型は script の一番上にまとめる（読む人が先に形を知れる）', '候補が決まっている値は union（Status）にする'], ['型が同じなのに、画面ごとにコピペする', '何でも string や any にして、型の恩恵を捨てる']));
  }

  /* ============ ② 型の道具箱 ============ */
  function toolbox() {
    const SRC = `<script setup lang="ts">
import { ref, computed } from 'vue'

// interface：オブジェクトの形
interface User {
  id: number
  name: string
  email?: string        // ? ＝ なくてもよい
}

// union：候補から選ぶ
type Role = 'admin' | 'member' | 'guest'

// 組み合わせ：形 ＋ 候補
interface Member extends User {
  role: Role
}

// 派生：今ある型から作る
type UserForm = Omit<Member, 'id'>   // id 以外
type UserPatch = Partial<UserForm>   // ぜんぶ「なくてもよい」

const form = ref<UserForm>({ name: '', role: 'member' })
const isAdmin = computed(() => form.value.role === 'admin')

function update(patch: UserPatch): void {
  form.value = { ...form.value, ...patch }
}
</script>

<template>
  <input v-model="form.name" placeholder="名前" />
  <select v-model="form.role">
    <option value="admin">admin</option>
    <option value="member">member</option>
    <option value="guest">guest</option>
  </select>
  <p v-if="isAdmin">管理者です</p>
</template>`;
    const pre = code(SRC, 'vue', { color: C, file: 'MemberForm.vue', dim: true });
    const P = [['interface（形）', { a: '// interface', b: '  email?' }], ['? 任意', ['email?']], ['union（候補）', { a: '// union', b: 'type Role' }], ['extends（足す）', { a: '// 組み合わせ', b: '  role: Role' }], ['Omit / Partial（派生）', { a: '// 派生', b: 'type UserPatch' }], ['ref<UserForm>（使う）', ['const form', 'const isAdmin', 'function update']]];
    const USES = [['interface', '同じ形のデータが複数あるとき', 'User { id, name }', 'ユーザー・案件・商品など、一覧に出るデータ'], ['union', '候補が決まっているとき', "'admin' | 'member' | 'guest'", 'ステータス・権限・ボタンの種類'], ['?（任意）', 'なくてもよい項目', 'email?: string', '入力が任意のフォーム項目'], ['Omit', 'ある項目だけ除いた型', "Omit<Member, 'id'>", '新規作成フォーム（id はまだ無い）'], ['Partial', 'ぜんぶ任意にした型', 'Partial<UserForm>', '一部だけ更新するとき（PATCH）']];
    const info = h('div', { class: 'vi-box' });
    const showU = (u) => info.replaceChildren(h('small', '使う場面'), h('b', u[1]), h('span', { style: { fontFamily: 'var(--mono)', fontSize: '.8rem', color: 'var(--ts)' } }, u[2]), h('small', '例：' + u[3]));
    showU(USES[0]);
    const bad = h('div'), tryB = h('button', { class: 'btn', onclick: () => { pre.setHi(lines(SRC, ['type Role']), 'h3'); bad.replaceChildren(h('div', { class: 'vt-err' }, "form.value.role = 'boss'  →  Type '\"boss\"' is not assignable to type 'Role'"), h('div', { class: 'vt-ok' }, '✓ union のおかげで、候補にない値は入らない（select の value の打ち間違いも気づける）')); } }, "🐛 role に 'boss' を入れてみる");
    return h('div', { style: { display: 'grid', gap: '12px' } },
      h('div', { class: 'vt-grid' },
        h('div', { class: 'vi-panel' }, lbl('型の道具箱：1つのファイルで全部使う'), pre),
        h('div', { class: 'vi-panel' }, lbl('① 部分を選ぶ → 左のコードが光る'), chips([[pre, SRC]], P), lbl('② どの道具を、いつ使う？（押して選ぶ）'), h('div', { class: 'vi-row' }, ...USES.map((u) => h('span', { class: 'vi-chip', style: { '--cc': C }, onclick: () => showU(u) }, u[0]))), info, tryB, bad)),
      dd(['フォームは「全項目の型」から Omit / Partial で作る（型を2回書かない）', 'ステータスは union にして、select の候補とそろえる', '? を付けた項目は、使うとき undefined を考える'], ['type と interface を混ぜて悩む（Vue では interface で形、type で候補、と覚える）', 'any で逃げる（型チェックが全部止まる）']));
  }

  /* ============ ③ props / emit に型 ============ */
  function propsEmit() {
    const CH = `<script setup lang="ts">
type Variant = 'primary' | 'danger'

const props = withDefaults(
  defineProps<{
    label: string
    variant?: Variant
    disabled?: boolean
  }>(),
  { variant: 'primary', disabled: false }
)

const emit = defineEmits<{
  press: [id: number]
}>()
</script>

<template>
  <button :class="props.variant" :disabled="props.disabled" @click="emit('press', 1)">
    {{ props.label }}
  </button>
</template>`;
    const PA = `<script setup lang="ts">
import AppButton from '@/components/AppButton.vue'

function remove(id: number): void {
  console.log('削除', id)
}
</script>

<template>
  <AppButton label="保存" />
  <AppButton label="削除" variant="danger" @press="remove" />
</template>`;
    const pc = code(CH, 'vue', { color: C, file: 'AppButton.vue（子）', dim: true }), pp = code(PA, 'vue', { color: 'var(--ts)', file: 'ConfirmView.vue（親）', dim: true });
    const P = [['props の型', { child: { a: '  defineProps', b: '  }>(),' }, parent: ['<AppButton'] }], ['? 任意', { child: ['variant?', 'disabled?'], parent: ['label="保存"'] }], ['既定値', { child: ["{ variant: 'primary'"], parent: ['label="保存"'] }], ['union（候補）', { child: { a: 'type Variant', b: 'type Variant' }, parent: ['variant="danger"'] }], ['emit の型', { child: { a: 'const emit', b: '}>()' }, parent: ['@press'] }]];
    const set = (i) => { [[pc, CH, 'child'], [pp, PA, 'parent']].forEach(([pre, src, k]) => { CLS.forEach((c) => pre.setHi([], c)); if (i != null) pre.setHi(lines(src, P[i][1][k]), CLS[i % 4]); }); };
    const chipRow = h('div', { class: 'vi-row' }, h('span', { class: 'vi-lb' }, '👆 部分にカーソルを乗せる（親と子が同時に光る）：'), ...P.map((x, i) => h('span', { class: 'vi-chip', style: { '--cc': CLR[i % 4] }, onmouseenter: () => set(i), onmouseleave: () => set(null), onclick: () => set(i) }, x[0])));
    const out = h('div');
    const tryErr = (txt, ok, hi) => { out.replaceChildren(ok ? h('div', { class: 'vt-ok' }, txt) : h('div', { class: 'vt-err' }, txt)); set(null); pp.setHi(lines(PA, hi), 'h3'); };
    return h('div', { style: { display: 'grid', gap: '12px' } }, chipRow,
      h('div', { class: 'vt-grid' }, h('div', { class: 'vi-panel' }, lbl('👶 子：型で「受け取る値」を宣言'), pc), h('div', { class: 'vi-panel' }, lbl('👨 親：使う側（型に合わない値は赤線）'), pp,
        h('div', { class: 'vi-row' }, h('button', { class: 'btn', onclick: () => tryErr("variant=\"denger\"  →  Type '\"denger\"' is not assignable to type 'Variant'", false, ['variant="danger"']) }, '🐛 variant を打ち間違える'), h('button', { class: 'btn', onclick: () => tryErr("<AppButton />  →  Property 'label' is missing（必須の props がない）", false, ['<AppButton label="保存" />']) }, '🐛 label を忘れる'), h('button', { class: 'btn', onclick: () => tryErr('✓ variant を書かなくても OK（既定値 primary が入る）', true, ['label="保存"']) }, '✓ variant を省略する')), out)),
      dd(['props は defineProps<{ … }>() で型を付ける（実行前に間違いが分かる）', '候補が決まっている props は union（Variant）にする', '任意の props は ? を付け、withDefaults で既定値を決める'], ['props の型を省略して、親の書き間違いに気づけない', 'emit 名を文字列でバラバラに書く（型を付けると、名前も引数も補完される）']));
  }

  /* ============ ④ API と3つの状態 ============ */
  function apiState() {
    const FILES = {
      '@/types/case': ['types/case.ts', "export type Status = '未着手' | '進行中' | '完了'\n\nexport interface Case {\n  id: number\n  title: string\n  status: Status\n}\n", 'ts'],
      '@/api/cases': ['api/cases.ts', "import type { Case } from '@/types/case'\n\nexport async function fetchCases(): Promise<Case[]> {\n  const res = await fetch('/api/cases')\n  if (!res.ok) throw new Error('HTTP ' + res.status)\n  return (await res.json()) as Case[]\n}\n", 'ts'],
    };
    const SRC = `<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Case } from '@/types/case'
import { fetchCases } from '@/api/cases'

// 3つの状態を、1つの型にまとめる（union）
type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Case[] }

const state = ref<State>({ status: 'loading' })

onMounted(async () => {
  try {
    state.value = { status: 'success', data: await fetchCases() }
  } catch (e) {
    state.value = { status: 'error', message: '取得に失敗しました' }
  }
})
</script>

<template>
  <p v-if="state.status === 'loading'">読み込み中…</p>
  <p v-else-if="state.status === 'error'">{{ state.message }}</p>
  <ul v-else>
    <li v-for="c in state.data" :key="c.id">{{ c.title }}</li>
  </ul>
</template>`;
    const pre = code(SRC, 'vue', { color: C, file: 'CaseListView.vue', dim: true });
    K.linkFiles && K.linkFiles(pre, FILES);
    const lc = K.linkChips && K.linkChips(pre, FILES);
    const BR = {
      loading: { c: '#5b9dff', keys: ["{ status: 'loading' }", "state.status === 'loading'"], tip: 'state が loading の間だけ。この間は state.data は存在しない', ui: () => [h('div', { class: 'vi-row', style: { gap: '10px' } }, h('span', { class: 'xt-spin', style: { width: '20px', height: '20px', border: '3px solid #ccd', borderTopColor: '#5b9dff', borderRadius: '50%', display: 'inline-block', animation: 'spin .8s linear infinite' } }), h('span', '読み込み中…'))] },
      error: { c: '#ff6b9d', keys: ["{ status: 'error'", "state.status === 'error'", 'state.message', "status: 'error', message"], tip: 'error のときだけ message がある。success の data は使えない', ui: () => [h('div', { style: { color: '#c22', fontWeight: 800 } }, '⚠ 取得に失敗しました'), h('small', { style: { color: '#889' } }, '再読み込みボタンを置くとよい')] },
      success: { c: '#2fd4a4', keys: ["{ status: 'success'", 'state.data', "status: 'success', data"], tip: 'success のときだけ data（Case[]）がある。ここで初めて一覧が使える', ui: () => [h('ul', { style: { margin: 0, paddingLeft: '1.2em' } }, ...['離婚の相談', '相続の相談'].map((t) => h('li', t)))] },
    };
    const stage = h('div', { class: 'vt-stage' }), tip = note('👆 3つの状態を切り替えてみよう', 'w');
    let cur = null;
    const set = (k) => { cur = k; const b = BR[k]; CLS.forEach((c) => pre.setHi([], c)); pre.setHi(lines(SRC, b.keys), 'h' + ({ loading: 2, error: 1, success: 4 }[k] || 1).toString().replace('4', 'd')); stage.replaceChildren(...b.ui()); tip.textContent = '▶ ' + b.tip; };
    const P = [['① 状態の型（union）', { a: '// 3つの状態', b: "  | { status: 'success'" }], ['② 状態を持つ ref', ['const state']], ['③ 取得して切り替える', { a: 'onMounted(async', b: '})' }], ['④ 画面で出し分け', { a: '<p v-if', b: '  </ul>' }], ['⑤ import（クリックで中身）', ["import type", 'import { fetchCases']]];
    return h('div', { style: { display: 'grid', gap: '12px' } },
      h('div', { class: 'vt-grid' },
        h('div', { class: 'vi-panel' }, lbl('通信の3つの状態を、型で1つにまとめる'), pre, lc, note('import の行（または下のボタン）を押すと、そのファイルの中身が開く', 'w')),
        h('div', { class: 'vi-panel' }, lbl('① 部分を選ぶ → 左のコードが光る'), chips([[pre, SRC]], P), lbl('② 状態を切り替える（コードの対応行が光る）'), h('div', { class: 'vi-row' }, ...[['loading', '⏳ 通信中'], ['error', '⚠ 失敗'], ['success', '✅ 成功']].map(([k, t]) => h('button', { class: 'btn primary', style: { '--c': BR[k].c }, onclick: () => set(k) }, t))), stage, tip,
          h('div', { class: 'vi-box' }, h('small', '型のうれしさ'), h('b', "state.status === 'success' の分岐の中でだけ、state.data が使える（TypeScript が自動で絞り込む）")))),
      dd(["通信の状態は union（loading / error / success）で1つにまとめる", 'fetch の結果は as Case[] ではなく、型を付けた api 関数に包んで返す', '型は types/、通信は api/ に出して、画面は呼ぶだけにする'], ['loading・error・data を別々の ref にして、同時に true になる矛盾を作る', 'res.json() の結果を any のまま使う']));
  }

  /* ============ ⑤ ファイル分割の全体像 ============ */
  function project() {
    const S = {
      types: ['src/types/case.ts', '📘', '型（形と候補）', "export type Status = '未着手' | '進行中' | '完了'\n\nexport interface Case {\n  id: number\n  title: string\n  status: Status\n  note?: string\n}\n\nexport type NewCase = Omit<Case, 'id'>\n", 'ts', [['export type', 'export interface'], ['NewCase']], []],
      api: ['src/api/cases.ts', '🌐', 'API（通信だけ）', "import type { Case, NewCase } from '@/types/case'\n\nconst BASE = '/api/cases'\n\nexport async function fetchCases(): Promise<Case[]> {\n  const res = await fetch(BASE)\n  if (!res.ok) throw new Error('HTTP ' + res.status)\n  return (await res.json()) as Case[]\n}\n\nexport async function createCase(body: NewCase): Promise<Case> {\n  const res = await fetch(BASE, { method: 'POST', body: JSON.stringify(body) })\n  return (await res.json()) as Case\n}\n", 'ts', [['import type'], ['fetchCases', 'createCase'], ['Promise<Case']], ['types']],
      comp: ['src/composables/useCases.ts', '🧰', '状態ロジック（ref ＋ 取得）', "import { ref } from 'vue'\nimport type { Case } from '@/types/case'\nimport { fetchCases } from '@/api/cases'\n\nexport function useCases() {\n  const cases = ref<Case[]>([])\n  const loading = ref(false)\n  const error = ref<string | null>(null)\n\n  async function load(): Promise<void> {\n    loading.value = true\n    try {\n      cases.value = await fetchCases()\n    } catch (e) {\n      error.value = '取得に失敗しました'\n    } finally {\n      loading.value = false\n    }\n  }\n\n  return { cases, loading, error, load }\n}\n", 'ts', [['import type', 'import { fetchCases }'], ['const cases', 'const loading', 'const error'], ['return {']], ['types', 'api']],
      card: ['src/components/CaseCard.vue', '🧩', '部品（見せるだけ）', "<script setup lang=\"ts\">\nimport type { Case } from '@/types/case'\n\ndefineProps<{ item: Case }>()\nconst emit = defineEmits<{ select: [id: number] }>()\n</script>\n\n<template>\n  <article @click=\"emit('select', item.id)\">\n    <h3>{{ item.title }}</h3>\n    <span>{{ item.status }}</span>\n  </article>\n</template>", 'vue', [['import type'], ['defineProps'], ['defineEmits', "emit('select'"]], ['types']],
      view: ['src/views/CaseListView.vue', '📄', '画面（部品をつなぐ）', "<script setup lang=\"ts\">\nimport { onMounted } from 'vue'\nimport { useCases } from '@/composables/useCases'\nimport CaseCard from '@/components/CaseCard.vue'\n\nconst { cases, loading, error, load } = useCases()\nonMounted(load)\n\nfunction open(id: number): void {\n  console.log('詳細へ', id)\n}\n</script>\n\n<template>\n  <p v-if=\"loading\">読み込み中…</p>\n  <p v-else-if=\"error\">{{ error }}</p>\n  <CaseCard v-for=\"c in cases\" :key=\"c.id\" :item=\"c\" @select=\"open\" />\n</template>", 'vue', [['import { useCases }', 'useCases()'], ['import CaseCard', '<CaseCard'], ['onMounted(load)']], ['comp', 'card']],
    };
    const IMP = { '@/types/case': 'types', '@/api/cases': 'api', '@/composables/useCases': 'comp', '@/components/CaseCard.vue': 'card' };
    const ORDER = ['types', 'api', 'comp', 'card', 'view'];
    const LBL = { types: '① 型を決める', api: '② 通信を書く', comp: '③ 状態をまとめる', card: '④ 部品を作る', view: '⑤ 画面でつなぐ' };
    const MARKLBL = { types: ['型の宣言', '派生（Omit）'], api: ['型を借りる', '通信関数', '返り値の型'], comp: ['借りる', '状態（ref）', 'まとめて返す'], card: ['型を借りる', 'props（受け取る）', 'emit（知らせる）'], view: ['composable を使う', '部品を使う', '読み込み開始'] };
    let cur = 'view';
    const tree = h('div', { class: 'vt-tree' }), codeBox = h('div'), links = h('div', { class: 'vi-row' }), info = h('div', { class: 'vi-box' }), chain = h('div', { class: 'vt-chain' }), marks = h('div', { class: 'vi-row' });
    const btn = {};
    const draw = () => {
      Object.entries(btn).forEach(([k, b]) => b.classList.toggle('on', k === cur));
      chain.querySelectorAll('.vt-nd').forEach((n) => n.classList.toggle('on', n.dataset.k === cur));
      const f = S[cur];
      const pre = code(f[3], f[4], { color: C, file: f[0], dim: true });
      const MAP = {}; Object.keys(IMP).forEach((k) => { const t = S[IMP[k]]; MAP[k] = [t[0], t[3], t[4]]; });
      const go = (k) => { cur = IMP[k]; draw(); };
      K.linkFiles && K.linkFiles(pre, MAP, go);
      codeBox.replaceChildren(pre); const lc = K.linkChips && K.linkChips(pre, MAP, go); if (lc) codeBox.append(lc);
      marks.replaceChildren(h('span', { class: 'vi-lb' }, '👆 部分にカーソルを乗せる：'), ...f[5].map((keys, i) => h('span', { class: 'vi-chip', style: { '--cc': CLR[i % 4] }, onmouseenter: () => { CLS.forEach((c) => pre.setHi([], c)); pre.setHi(lines(f[3], keys), CLS[i % 4]); }, onmouseleave: () => CLS.forEach((c) => pre.setHi([], c)) }, MARKLBL[cur][i] || '部分')));
      links.replaceChildren(h('span', { class: 'vi-lb' }, 'このファイルが使うもの：'), ...(f[6].length ? f[6].map((t, i) => h('span', { class: 'vt-lk', style: { '--n': CLR[i % 4] }, onmouseenter: () => btn[t] && btn[t].classList.add('glow'), onmouseleave: () => btn[t] && btn[t].classList.remove('glow'), onclick: () => { cur = t; draw(); } }, '➜ ' + S[t][0].split('/').pop())) : [h('span', { class: 'vi-lb' }, '（なし：他のファイルから使われる側）')]));
      info.replaceChildren(h('small', f[0]), h('b', f[1] + ' ' + f[2]));
    };
    ORDER.forEach((k) => { const b = h('button', { class: 'vt-it', onclick: () => { cur = k; draw(); } }, S[k][1] + ' ' + S[k][0].replace('src/', ''), h('small', S[k][2].split('（')[0])); btn[k] = b; tree.append(b); });
    ORDER.forEach((k, i) => { chain.append(h('button', { class: 'vt-nd', 'data-k': k, onclick: () => { cur = k; draw(); } }, LBL[k], h('small', S[k][0].split('/').pop()))); if (i < ORDER.length - 1) chain.append(h('span', { style: { color: 'var(--mute)', fontWeight: 900 } }, '➜')); });
    let play = 0;
    const run = async () => { const my = ++play; for (const k of ORDER) { if (my !== play) return; cur = k; draw(); btn[k].classList.add('glow'); await sleep(1500); btn[k].classList.remove('glow'); } };
    draw();
    return h('div', { style: { display: 'grid', gap: '12px' } },
      h('div', { class: 'vi-panel' }, h('div', { class: 'vi-row', style: { justifyContent: 'space-between' } }, lbl('作る順番＝依存の順番（押して選ぶ）'), h('button', { class: 'btn primary', style: { '--c': C }, onclick: run }, '▶ 順に見る')), chain),
      h('div', { class: 've-grid vt-split' }, h('div', { class: 'vi-panel' }, lbl('ファイル（役割ごとに分ける）'), tree), h('div', { class: 'vi-panel' }, lbl('中身（import の行を押すと、そのファイルへ）'), info, marks, codeBox, links)),
      dd(['型 → api → composable → 部品 → 画面、と下から積む（上のファイルは下を知らない）', '画面は「つなぐだけ」。通信は api、状態は composable に任せる', 'import type で型だけ借りる（実行には影響しない）'], ['画面ファイルに fetch も型も全部書く（長くなって読めない）', 'api が画面や ref を import する（逆向きの依存は、直しにくい）']));
  }

  K.reg({
    id: 'x-vue-ts', track: 'extra', title: 'TypeScript × Vue まとめ', sub: '型・API・ファイル分割をどう組み合わせる？', emoji: '🧬',
    meta: { cat: 'vue', day: '4日目', when: 'コンポーネント（props / emit）の後、または API 呼び出しの前に', mins: 20, order: 35, level: '応用', after: 'vue-comp', why: '現場の Vue は、型・API・ファイル分割がセット。1ファイルで書く形と、分けた形の両方を知っておく' },
    scenes: [
      { t: '1ファイルに全部書く', tag: 'SINGLE', lead: '型・状態・計算・API・画面が<b>1つの .vue</b> に。どの部分が何をしているか、<b>カーソルを乗せて</b>確認しよう。', render(el) { el.append(oneFile()); } },
      { t: '型の道具箱', tag: 'interface / union', lead: '<b>interface</b>（形）・<b>union</b>（候補）・<b>?</b>（任意）・<b>Omit / Partial</b>（派生）。Vue のどこで使う？', render(el) { el.append(toolbox()); } },
      { t: 'props / emit に型を付ける', tag: 'props / emit', lead: '子の<b>型</b>が、親の<b>書き間違い</b>を教えてくれる。親と子が同時に光る。', render(el) { el.append(propsEmit()); } },
      { t: 'API と3つの状態', tag: 'API', lead: '通信中・失敗・成功を<b>1つの型</b>で。状態を切り替えて、コードのどこが動くかを見よう。', render(el) { el.append(apiState()); } },
      { t: 'ファイルを分けると？', tag: 'STRUCTURE', lead: '<b>型 → API → 状態 → 部品 → 画面</b>。ファイルの役割と、<b>import のつながり</b>を追おう。', render(el) { el.append(project()); } },
    ],
  });

  /* 用語（右のパネル） */
  K.sceneTerms = K.sceneTerms || {};
  const T = (arr) => arr.map((x) => ({ k: x[0], y: x[1], m: x[2], r: x[3] }));
  K.sceneTerms['1ファイルに全部書く'] = T([['interface', 'インターフェース', 'オブジェクトの形（項目名と型）を決める設計図。', '一覧に出るデータの形に使う。'], ['union', 'ユニオン', '「AかBかC」と候補を並べる型（|）。', "type Status = '未着手' | '完了'"], ['ref<型>', 'レフ', 'ref に型を付ける書き方。', '空の配列は ref<Case[]>([]) と書く。'], ['computed', 'コンピューテッド', '材料から自動で計算する値。', '型は自動で決まる。']]);
  K.sceneTerms['型の道具箱'] = T([['extends', 'エクステンズ', '既にある型に、項目を足す。', 'interface Member extends User'], ['Omit', 'オミット', 'ある項目だけ除いた型を作る。', "新規作成フォーム: Omit<Member, 'id'>"], ['Partial', 'パーシャル', 'ぜんぶの項目を「なくてもよい」にした型。', '一部だけ更新するとき。'], ['任意（?）', 'にんい', 'なくてもよい項目。型の後ろに ? を付ける。', '使うときは undefined も考える。']]);
  K.sceneTerms['props / emit に型を付ける'] = T([['defineProps', 'ディファインプロップス', '受け取る値と、その型を宣言する。', '<{ item: Case }>() のように型を渡す。'], ['defineEmits', 'ディファインエミッツ', '親へ知らせるイベントと、渡す値の型を宣言する。', '<{ select: [id: number] }>()'], ['withDefaults', 'ウィズデフォルツ', 'props の既定値を決める。', '任意（?）の props とセットで使う。']]);
  K.sceneTerms['API と3つの状態'] = T([['fetch', 'フェッチ', 'サーバーからデータを取ってくる関数。', 'async / await と一緒に使う。'], ['Promise', 'プロミス', '「あとで結果が出る」ことを表す型。', 'Promise<Case[]> ＝ あとで Case の配列が返る。'], ['絞り込み', 'しぼりこみ', 'if や === で分岐すると、型が自動で絞られる。', "status === 'success' の中でだけ data が使える。"], ['import type', 'インポート タイプ', '型だけを借りる書き方。', '実行時には消える。']]);
  K.sceneTerms['ファイルを分けると？'] = T([['composable', 'コンポーザブル', '状態と処理をまとめた関数（useXxx）。', '複数の画面で使い回せる。'], ['api', 'エーピーアイ', '通信だけを書く層。', '画面は呼ぶだけにする。'], ['依存', 'いぞん', 'あるファイルが、別のファイルを import して使うこと。', '下から積む。逆向きは作らない。'], ['@/', 'アットスラッシュ', 'src フォルダを指す近道（パスの別名）。', "import … from '@/types/case'"]]);
})();
