/* 最終チャレンジの作り直し（A）：vue-env / vue-test / x-vue-render / x-vue-workflow
   すべて 初級3・中級2・上級1（必須 6 ミッション）。
   ・vue-test：ReservationCard.vue ＋ ReservationCard.test.ts ＋ types.ts（型つき・ブラウザの中でテストが動く）
   ・x-vue-render：nuxt.config.ts ＋ pages の .vue 3 つ ＋ types（Nuxt は動かせないので、書き方を自動チェック）
   ・vue-env / x-vue-workflow：本物そっくりのターミナル（状態で判定）
   ※ このファイルは tests/teamx.js・drills/sim.js より先に読み込まれ、あとから上書きされるため、
     DOMContentLoaded / load でもう一度登録し直している。 */
(function () {
  const K = window.KENSHU;
  if (!K) return;

  /* ブラウザの中でテストを動かす簡易ランナー（vue-x-d.js のものと同じ作り。コピーして使う） */
  function ktShim() {
    var R = (window.__kt = { done: false, tests: [] });
    var queue = [], prefix = [], hooks = [], boxes = [], cur = null;
    var fmt = function (x) { try { return x === undefined ? 'undefined' : JSON.stringify(x); } catch (e) { return String(x); } };
    var matchers = function (recv, neg) {
      var chk = function (name, pass, exp) {
        var ok = neg ? !pass : pass;
        if (cur) cur.expects.push({ m: (neg ? 'not.' : '') + name, recv: recv, exp: exp, pass: ok });
        if (!ok) throw new Error('expect(' + fmt(recv) + ').' + (neg ? 'not.' : '') + name + '(' + (exp === undefined ? '' : fmt(exp)) + ') が成り立ちません');
      };
      return {
        toBe: function (e) { chk('toBe', Object.is(recv, e), e); },
        toEqual: function (e) { chk('toEqual', fmt(recv) === fmt(e), e); },
        toContain: function (e) { chk('toContain', recv != null && recv.indexOf(e) >= 0, e); },
        toMatch: function (e) { chk('toMatch', typeof recv === 'string' && new RegExp(e).test(recv), String(e)); },
        toBeTruthy: function () { chk('toBeTruthy', !!recv); },
        toBeFalsy: function () { chk('toBeFalsy', !recv); },
        toBeDefined: function () { chk('toBeDefined', recv !== undefined); },
        toBeUndefined: function () { chk('toBeUndefined', recv === undefined); },
        toBeNull: function () { chk('toBeNull', recv === null); },
        toHaveLength: function (n) { chk('toHaveLength', recv != null && recv.length === n, n); },
        toBeGreaterThan: function (n) { chk('toBeGreaterThan', recv > n, n); },
      };
    };
    window.expect = function (r) { var m = matchers(r, false); m.not = matchers(r, true); return m; };
    window.describe = function (name, fn) { prefix.push(name); try { fn(); } finally { prefix.pop(); } };
    window.it = window.test = function (name, fn) { queue.push({ name: prefix.concat(name).join(' › '), fn: fn }); };
    window.it.each = function (cases) {
      return function (name, fn) {
        cases.forEach(function (c) {
          var args = [].concat(c), k = 0;
          var nm = String(name).replace(/%[sdj]/g, function () { return String(args[k++]); });
          window.it(nm, function () { return fn.apply(null, args); });
        });
      };
    };
    window.beforeEach = function (fn) { hooks.push(fn); };
    window.flushPromises = function () { return new Promise(function (r) { setTimeout(r, 0); }).then(function () { return Vue.nextTick(); }); };
    var dom = function (el) {
      var need = function () { if (!el) throw new Error('要素が見つかりません（find のセレクターを確かめてください）'); };
      return {
        element: el,
        exists: function () { return !!el; },
        text: function () { need(); return el.textContent.trim(); },
        html: function () { need(); return el.outerHTML; },
        attributes: function (n) { need(); if (n) return el.hasAttribute(n) ? el.getAttribute(n) : undefined; var o = {}; [].forEach.call(el.attributes, function (a) { o[a.name] = a.value; }); return o; },
        classes: function (n) { need(); var l = [].slice.call(el.classList); return n ? l.indexOf(n) >= 0 : l; },
        trigger: function (type) {
          need(); if (el.disabled) return Vue.nextTick();
          el.dispatchEvent(/^(click|mouse)/.test(type) ? new MouseEvent(type, { bubbles: true, cancelable: true }) : new Event(type, { bubbles: true, cancelable: true }));
          return Vue.nextTick();
        },
        setValue: function (v) {
          need();
          if (el.type === 'checkbox') { el.checked = !!v; el.dispatchEvent(new Event('change', { bubbles: true })); }
          else { el.value = v; el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })); }
          return Vue.nextTick();
        },
      };
    };
    window.mount = function (Comp, opts) {
      opts = opts || {};
      var state = Vue.reactive(Object.assign({}, opts.props || {})), emitted = {}, inst = null, handlers = {};
      (Comp.emits || []).forEach(function (ev) {
        handlers['on' + ev.charAt(0).toUpperCase() + ev.slice(1)] = function () { (emitted[ev] = emitted[ev] || []).push([].slice.call(arguments)); };
      });
      var box = document.createElement('div'); document.body.appendChild(box);
      var app = Vue.createApp({ render: function () { return Vue.h(Comp, Object.assign({}, state, handlers, { ref: function (i) { inst = i; } })); } });
      app.mount(box); boxes.push({ box: box, app: app });
      var w = dom(box);
      return {
        vm: inst, element: box,
        text: w.text, html: function () { return box.innerHTML; }, exists: function () { return true; },
        find: function (sel) { return dom(box.querySelector(sel)); },
        findAll: function (sel) { return [].map.call(box.querySelectorAll(sel), dom); },
        emitted: function (n) { return n ? emitted[n] : emitted; },
        props: function () { return Object.assign({}, state); },
        setProps: function (p) { Object.assign(state, p); return Vue.nextTick(); },
        unmount: function () { app.unmount(); },
      };
    };
    var finish = function () {
      var ok = R.tests.filter(function (t) { return t.pass; }).length;
      var out = document.createElement('div'); out.id = 'kt-out';
      out.style.cssText = 'font:13px/1.7 system-ui,"Hiragino Sans",sans-serif;border:1px solid #c9cfe0;border-radius:10px;padding:8px 12px;background:#fff;color:#223';
      var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
      out.innerHTML = '<b>テスト結果　' + ok + ' / ' + R.tests.length + ' 件 成功</b>' + (R.tests.length ? '' : '<div style="color:#778">テストがまだありません</div>') +
        R.tests.map(function (t) { return '<div style="color:' + (t.pass ? '#1a8f4a' : '#c0392b') + '">' + (t.pass ? '✓ ' : '✗ ') + esc(t.name) + (t.pass ? '' : '<div style="margin-left:1.4em;color:#778;font-size:12px">' + esc(t.error) + '</div>') + '</div>'; }).join('');
      document.body.insertBefore(out, document.body.firstChild);
      R.done = true;
      try { if (window.frameElement) window.frameElement.dispatchEvent(new Event('load')); } catch (e) { /* ignore */ }
    };
    var run = function () {
      var i = 0;
      var next = function () {
        if (i >= queue.length) return finish();
        var q = queue[i++], rec = { name: q.name, pass: false, error: '', expects: [] };
        cur = rec; R.tests.push(rec);
        Promise.race([
          Promise.resolve().then(function () { hooks.forEach(function (h) { h(); }); return q.fn(); }),
          new Promise(function (_, rej) { setTimeout(function () { rej(new Error('時間切れ（await の付け忘れなど）')); }, 1500); }),
        ]).then(function () {
          if (!rec.expects.length) throw new Error('expect が 1 つもありません（確かめていないテストは成功にしません）');
          rec.pass = true;
        }).catch(function (e) { rec.error = String((e && e.message) || e); })
          .then(function () { cur = null; boxes.splice(0).forEach(function (b) { try { b.app.unmount(); } catch (e) { /* ignore */ } b.box.remove(); }); next(); });
      };
      next();
    };
    window.addEventListener('load', function () { setTimeout(run, 0); });
  }
  const KT_LIB = 'data:text/javascript;charset=utf-8,' + encodeURIComponent('(' + ktShim.toString() + ')()');

  /* ---------- 共通の小道具 ---------- */
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const J = (a) => a.join('\n');
  const strip = (s) => String(s || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');
  /* 置換を（1回だけ現れる前提で）当てて solution を作る */
  function applyEdits(files, edits) {
    const f = Object.assign({}, files);
    edits.forEach(([n, a, b]) => {
      if (f[n].split(a).length !== 2) throw new Error('vue-x-extra-a: edit not unique -> ' + a.slice(0, 60));
      f[n] = f[n].replace(a, () => b);
    });
    return f;
  }
  const langOf = (n) => (/\.vue$/.test(n) ? 'vue' : /\.ts$/.test(n) ? 'ts' : 'text');
  /* ヒント：説明 → 部分のコード → 答え の順に、少しずつ見せる */
  const mkHint = (text, part, ans, lang) => {
    const h = [text];
    if (part && part !== ans) h.push({ code: part, lang });
    h.push({ code: ans, lang });
    return h;
  };

  /* ================================================================
     vue-test：ReservationCard.vue のテストを書く
     ================================================================ */
  const VT_TYPES = J([
    '// 予約プラン 1 件ぶんの「形」。部品とテストの両方から import type で読み込む',
    'export interface Plan {',
    '  name: string',
    '  fee: number',
    '}',
    '',
  ]);
  const VT_VUE = J([
    '<script setup lang="ts">',
    "import { computed, ref } from 'vue'",
    "import type { Plan } from './types'",
    '',
    'const props = defineProps<{ plan: Plan; maxSeats?: number }>()',
    'const emit = defineEmits<{ reserve: [seats: number] }>()',
    '',
    'const seats = ref<number>(1)',
    'const limit = computed<number>(() => props.maxSeats ?? 3)',
    'const total = computed<number>(() => props.plan.fee * seats.value)',
    '',
    'function add(): void {',
    '  if (seats.value < limit.value) seats.value++',
    '}',
    '</script>',
    '',
    '<template>',
    '  <section>',
    '    <h3 data-testid="plan-name">{{ plan.name }}</h3>',
    '    <p data-testid="seats">{{ seats }} 名</p>',
    '    <p data-testid="total">合計 {{ total }} 円</p>',
    '    <button data-testid="add" @click="add">人数を増やす</button>',
    "    <button data-testid=\"submit\" @click=\"emit('reserve', seats)\">予約する</button>",
    '    <p v-if="seats >= limit" data-testid="limit">これ以上は増やせません</p>',
    '  </section>',
    '</template>',
    '',
  ]);
  const VT_TEST = J([
    "import { describe, it, expect } from 'vitest'",
    "import { mount } from '@vue/test-utils'",
    "import ReservationCard from './ReservationCard.vue'",
    "import type { Plan } from './types'",
    '',
    "const plan: Plan = { name: '初回相談（30分）', fee: 5500 }",
    '',
    "describe('ReservationCard（相談の予約カード）', () => {",
    "  it('① 最初は 1 名で、合計は「合計 5500 円」と表示される', () => {",
    "    // ① mount(ReservationCard, { props: { plan } }) して、data-testid=\"total\" の text() が '合計 5500 円' と等しいことを確かめる",
    '  })',
    '',
    "  it('② 「人数を増やす」を押すと、2 名・合計 11000 円になる', async () => {",
    '    const wrapper = mount(ReservationCard, { props: { plan } })',
    "    // ② data-testid=\"add\" を trigger('click')（await を付ける）して、seats が '2 名'、total が '合計 11000 円' になることを確かめる",
    '  })',
    '',
    "  it('③ 「予約する」を押すと、reserve が 1 回 emit され、人数 [1] が付いてくる', async () => {",
    '    const wrapper = mount(ReservationCard, { props: { plan } })',
    "    // ③ data-testid=\"submit\" を押して、wrapper.emitted('reserve') が 1 回で、中身が [1] であることを確かめる",
    '  })',
    '',
    '  // ④ it.each で「人数 → 合計」の表を 3 行まとめて確かめる（人数ぶん add を押して、合計を比べる）',
    "  it.each<[number, number]>([",
    '    [1, 5500],',
    '    [2, 11000],',
    '    [3, 16500],',
    "  ])('④ %d 名のとき、合計は %d 円', async (seats: number, total: number) => {",
    '    const wrapper = mount(ReservationCard, { props: { plan } })',
    '  })',
    '',
    "  it('⑤ maxSeats を 2 にすると、2 名で止まり「これ以上は増やせません」が出る', async () => {",
    "    // ⑤ props に maxSeats: 2 を渡して mount。最初は limit が無い（exists() が false）→ add を 2 回押す → '2 名' で limit が出る（exists() が true）",
    '  })',
    '',
    "  it('⑥ setProps でプランを替えると、プラン名と合計が更新される', async () => {",
    '    const wrapper = mount(ReservationCard, { props: { plan } })',
    "    // ⑥ 電話相談（15分）・3300 円の Plan を作り、await wrapper.setProps({ plan: ... }) してから、plan-name と total を確かめる",
    '  })',
    '})',
    '',
  ]);
  const Q = '[data-testid="'; // セレクターの前半
  const VT_EDITS = [
    ['ReservationCard.test.ts',
      "    // ① mount(ReservationCard, { props: { plan } }) して、data-testid=\"total\" の text() が '合計 5500 円' と等しいことを確かめる\n",
      J(['    const wrapper = mount(ReservationCard, { props: { plan } })', "    expect(wrapper.find('" + Q + "total\"]').text()).toBe('合計 5500 円')", ''])],
    ['ReservationCard.test.ts',
      "    // ② data-testid=\"add\" を trigger('click')（await を付ける）して、seats が '2 名'、total が '合計 11000 円' になることを確かめる\n",
      J(["    await wrapper.find('" + Q + "add\"]').trigger('click')", "    expect(wrapper.find('" + Q + "seats\"]').text()).toBe('2 名')", "    expect(wrapper.find('" + Q + "total\"]').text()).toBe('合計 11000 円')", ''])],
    ['ReservationCard.test.ts',
      "    // ③ data-testid=\"submit\" を押して、wrapper.emitted('reserve') が 1 回で、中身が [1] であることを確かめる\n",
      J(["    await wrapper.find('" + Q + "submit\"]').trigger('click')", "    expect(wrapper.emitted('reserve')).toHaveLength(1)", "    expect(wrapper.emitted('reserve')?.[0]).toEqual([1])", ''])],
    ['ReservationCard.test.ts',
      "  // ④ it.each で「人数 → 合計」の表を 3 行まとめて確かめる（人数ぶん add を押して、合計を比べる）\n",
      ''],
    ['ReservationCard.test.ts',
      "  ])('④ %d 名のとき、合計は %d 円', async (seats: number, total: number) => {\n    const wrapper = mount(ReservationCard, { props: { plan } })\n  })",
      J(["  ])('④ %d 名のとき、合計は %d 円', async (seats: number, total: number) => {", '    const wrapper = mount(ReservationCard, { props: { plan } })', '    for (let i = 1; i < seats; i++) {', "      await wrapper.find('" + Q + "add\"]').trigger('click')", '    }', "    expect(wrapper.find('" + Q + "total\"]').text()).toBe(`合計 ${total} 円`)", '  })'])],
    ['ReservationCard.test.ts',
      "    // ⑤ props に maxSeats: 2 を渡して mount。最初は limit が無い（exists() が false）→ add を 2 回押す → '2 名' で limit が出る（exists() が true）\n",
      J(['    const wrapper = mount(ReservationCard, { props: { plan, maxSeats: 2 } })', "    expect(wrapper.find('" + Q + "limit\"]').exists()).toBe(false)", "    await wrapper.find('" + Q + "add\"]').trigger('click')", "    await wrapper.find('" + Q + "add\"]').trigger('click')", "    expect(wrapper.find('" + Q + "seats\"]').text()).toBe('2 名')", "    expect(wrapper.find('" + Q + "limit\"]').exists()).toBe(true)", ''])],
    ['ReservationCard.test.ts',
      "    // ⑥ 電話相談（15分）・3300 円の Plan を作り、await wrapper.setProps({ plan: ... }) してから、plan-name と total を確かめる\n",
      J(["    const phone: Plan = { name: '電話相談（15分）', fee: 3300 }", '    await wrapper.setProps({ plan: phone })', "    expect(wrapper.find('" + Q + "plan-name\"]').text()).toBe('電話相談（15分）')", "    expect(wrapper.find('" + Q + "total\"]').text()).toBe('合計 3300 円')", ''])],
  ];

  const ktRes = (c) => { const d = c && c.doc && c.doc(); const w = d && d.defaultView; return w && w.__kt && w.__kt.done ? w.__kt : null; };
  const ktTests = (c, no) => { const k = ktRes(c); return k ? k.tests.filter((x) => x.name.split(' › ').pop().indexOf(no) === 0) : []; };
  const ktOk = (c, no, f, n) => { const ts = ktTests(c, no); return ts.length > 0 && (!n || ts.length === n) && ts.every((x) => x.pass) && (!f || f(ts[0], ts)); };
  const hasE = (x, f) => x.expects.some((e) => e.pass && f(e));
  const ex = (e) => String(e.exp);
  const itBody = (src, no) => { const i = src.indexOf("'" + no); if (i < 0) return ''; const j = src.indexOf('\n  it', i + 5); return src.slice(i, j > 0 ? j : src.length); };

  function makeVueTest() {
    const D = K.vueDrillTools;
    if (!D) return null;
    const NAME = 'ReservationCard';
    const files = { 'ReservationCard.test.ts': VT_TEST, 'ReservationCard.vue': VT_VUE, 'types.ts': VT_TYPES };
    const sol = applyEdits(files, VT_EDITS);
    const TS = 'ReservationCard.test.ts';
    const sel = (id) => Q + id + '"]';
    const task = (lv, label, hint, ans, find, ok) => {
      let okv = false;
      return { lv, label, hint, ans, find, ok };
    };
    const defs = [
      task(1, '① mount して、最初の合計が「合計 5500 円」と表示されると確かめる',
        mkHint('mount(部品, { props }) で部品を作る。data-testid で要素を探し、text() の文字を toBe で確かめる。', "mount(ReservationCard, { props: { plan } })", "const wrapper = mount(ReservationCard, { props: { plan } })\nexpect(wrapper.find('" + sel('total') + "').text()).toBe('合計 5500 円')", 'ts'),
        null, '// ① ',
        (v, c) => ktOk(c, '①', (x) => hasE(x, (e) => e.m === 'toBe' && e.exp === '合計 5500 円')) && /mount\s*\(\s*ReservationCard[\s\S]*plan/.test(itBody(v[TS], '①'))),
      task(1, '② 「人数を増やす」を trigger(\'click\') で押して、2 名・合計 11000 円になると確かめる',
        mkHint("押す操作は find(...).trigger('click')。押した後の画面を見るので await を付ける。", "await wrapper.find('" + sel('add') + "').trigger('click')", "await wrapper.find('" + sel('add') + "').trigger('click')\nexpect(wrapper.find('" + sel('seats') + "').text()).toBe('2 名')\nexpect(wrapper.find('" + sel('total') + "').text()).toBe('合計 11000 円')", 'ts'),
        null, '// ② ',
        (v, c) => ktOk(c, '②', (x) => hasE(x, (e) => e.exp === '2 名') && hasE(x, (e) => e.exp === '合計 11000 円')) && /await[^\n]*trigger\s*\(\s*['"]click['"]/.test(itBody(v[TS], '②'))),
      task(1, '③ 「予約する」を押すと reserve が 1 回 emit され、中身が [1] であると emitted() で確かめる',
        mkHint("wrapper.emitted('reserve') は、emit された回数ぶんの配列。1 回目の引数は ?.[0]。", "expect(wrapper.emitted('reserve')).toHaveLength(1)", "await wrapper.find('" + sel('submit') + "').trigger('click')\nexpect(wrapper.emitted('reserve')).toHaveLength(1)\nexpect(wrapper.emitted('reserve')?.[0]).toEqual([1])", 'ts'),
        null, '// ③ ',
        (v, c) => ktOk(c, '③', (x) => hasE(x, (e) => e.m === 'toHaveLength' && e.exp === 1) && hasE(x, (e) => JSON.stringify(e.exp) === '[1]')) && /emitted\s*\(\s*['"]reserve['"]/.test(itBody(v[TS], '③'))),
      task(2, '④ it.each の表 3 行（1 名・2 名・3 名）を、人数ぶん押して合計と比べる',
        mkHint('人数ぶん（人数 − 1 回）add を押してから、合計を比べる。表の値は it.each の引数（seats, total）で受け取る。', "for (let i = 1; i < seats; i++) {\n  await wrapper.find('" + sel('add') + "').trigger('click')\n}", "for (let i = 1; i < seats; i++) {\n  await wrapper.find('" + sel('add') + "').trigger('click')\n}\nexpect(wrapper.find('" + sel('total') + "').text()).toBe(`合計 ${total} 円`)", 'ts'),
        null, '// ④ ',
        (v, c) => ktOk(c, '④', (x, ts) => ts.every((t) => hasE(t, (e) => /合計 (5500|11000|16500) 円/.test(ex(e)))), 3) && /trigger\s*\(/.test(itBody(v[TS], '④')) && /seats/.test(itBody(v[TS], '④'))),
      task(2, '⑤ maxSeats を 2 にして、2 名で止まり「これ以上は増やせません」が出ると確かめる（exists）',
        mkHint('mount の props に maxSeats: 2 を渡す。要素があるかは exists() で確かめる（無ければ false、あれば true）。', "mount(ReservationCard, { props: { plan, maxSeats: 2 } })", "const wrapper = mount(ReservationCard, { props: { plan, maxSeats: 2 } })\nexpect(wrapper.find('" + sel('limit') + "').exists()).toBe(false)\nawait wrapper.find('" + sel('add') + "').trigger('click')\nawait wrapper.find('" + sel('add') + "').trigger('click')\nexpect(wrapper.find('" + sel('seats') + "').text()).toBe('2 名')\nexpect(wrapper.find('" + sel('limit') + "').exists()).toBe(true)", 'ts'),
        null, '// ⑤ ',
        (v, c) => ktOk(c, '⑤', (x) => hasE(x, (e) => e.m === 'toBe' && e.exp === true) && hasE(x, (e) => e.m === 'toBe' && e.exp === false) && hasE(x, (e) => e.exp === '2 名')) && /maxSeats\s*:\s*2/.test(itBody(v[TS], '⑤')) && /exists\s*\(/.test(itBody(v[TS], '⑤'))),
      task(3, '⑥ setProps でプランを替え、プラン名と合計が新しいプランに更新されると確かめる',
        mkHint('props を後から変えるのは wrapper.setProps({ ... })。画面が書き換わるのを待つので await を付ける。', "await wrapper.setProps({ plan: phone })", "const phone: Plan = { name: '電話相談（15分）', fee: 3300 }\nawait wrapper.setProps({ plan: phone })\nexpect(wrapper.find('" + sel('plan-name') + "').text()).toBe('電話相談（15分）')\nexpect(wrapper.find('" + sel('total') + "').text()).toBe('合計 3300 円')", 'ts'),
        null, '// ⑥ ',
        (v, c) => ktOk(c, '⑥', (x) => hasE(x, (e) => e.exp === '電話相談（15分）') && hasE(x, (e) => e.exp === '合計 3300 円')) && /await\s+wrapper\.setProps\s*\(/.test(itBody(v[TS], '⑥'))),
    ];
    const T = D.multi(files, sol, (v, c) => {
      return defs.map((d) => {
        let ok = false;
        try { ok = !!d.ok(v, c); } catch (e) { ok = false; }
        return D.T(d.label, d.lv, ok, d.hint, { file: TS, find: [d.find] });
      });
    }, {
      libs: [K.vueTestTools ? K.vueTestTools.VUE : 'https://unpkg.com/vue@3.4.27/dist/vue.global.prod.js', KT_LIB],
      height: 480,
      alias: { 'App.vue': 'ReservationCard.vue' },
      paths: { 'ReservationCard.vue': 'src/components/ReservationCard.vue', 'ReservationCard.test.ts': 'src/components/__tests__/ReservationCard.test.ts', 'types.ts': 'src/components/types.ts' },
      fileNotes: { 'ReservationCard.test.ts': 'ここにテストを書く', 'ReservationCard.vue': 'テストされる部品（触らない）', 'types.ts': '型だけのファイル（interface Plan。触らない）' },
    });
    return T;
  }

  /* ================================================================
     x-vue-render：描画方式を選ぶ（Nuxt）。動かせないので、書き方を見て判定する
     ================================================================ */
  const XR_CONFIG = J([
    '// 法律相談サービスの「ページごとの描画方式」を決めるファイル',
    'export default defineNuxtConfig({',
    '  routeRules: {',
    '    // ① 管理画面 /admin/** は SEO が要らない → ブラウザで描く SPA にする（ssr: false）',
    '    // ② トップ / はほとんど変わらない → ビルドのときに作っておく SSG にする（prerender: true）',
    '    // ③ 弁護士コラム /blog/** は 60 秒ごとに作り直す ISR にする（isr: 60）',
    '  },',
    '})',
    '',
  ]);
  const XR_POST_TYPE = J([
    '// コラム記事 1 件ぶんの「形」。BlogPost.vue から import type で読み込む',
    'export interface Post {',
    '  slug: string',
    '  title: string',
    '  summary: string',
    '}',
    '',
  ]);
  const XR_TOP = J([
    '<script setup lang="ts">',
    "// ⑤ localStorage はブラウザにしか無い。サーバーでも動くこの位置に書くとエラーになる → onMounted の中へ移す",
    "const visits = Number(localStorage.getItem('visits') ?? 0)",
    '</script>',
    '',
    '<template>',
    '  <main>',
    '    <h1>リーガル相談ナビ</h1>',
    '    <p>ご利用 {{ visits }} 回目</p>',
    '  </main>',
    '</template>',
    '',
  ]);
  const XR_BLOG = J([
    '<script setup lang="ts">',
    "import type { Post } from '~/types/post'",
    '',
    'const route = useRoute()',
    '',
    '// ④ サーバーで記事を取ってから HTML にする。useFetch<Post>() を使う（URL は /api/posts/スラッグ）',
    'const post = ref<Post | null>(null)',
    '',
    '// ⑥ 検索結果に出るタイトルと説明を、記事の中身から決める（useSeoMeta）',
    '</script>',
    '',
    '<template>',
    '  <article>',
    '    <h1>{{ post?.title }}</h1>',
    '    <p>{{ post?.summary }}</p>',
    '  </article>',
    '</template>',
    '',
  ]);
  const XR_ADMIN = J([
    '<script setup lang="ts">',
    "definePageMeta({ layout: 'admin' })",
    '',
    'const staff: string[] = ["受付", "弁護士", "事務"]',
    '</script>',
    '',
    '<template>',
    '  <section>',
    '    <h1>管理画面</h1>',
    '    <ul>',
    '      <li v-for="s in staff" :key="s">{{ s }}の画面</li>',
    '    </ul>',
    '  </section>',
    '</template>',
    '',
  ]);
  const XR_FILES = { 'nuxt.config.ts': XR_CONFIG, 'TopPage.vue': XR_TOP, 'BlogPost.vue': XR_BLOG, 'AdminDashboard.vue': XR_ADMIN, 'post.ts': XR_POST_TYPE };
  const XR_EDITS = [
    ['nuxt.config.ts', "    // ① 管理画面 /admin/** は SEO が要らない → ブラウザで描く SPA にする（ssr: false）\n", "    '/admin/**': { ssr: false },\n"],
    ['nuxt.config.ts', "    // ② トップ / はほとんど変わらない → ビルドのときに作っておく SSG にする（prerender: true）\n", "    '/': { prerender: true },\n"],
    ['nuxt.config.ts', "    // ③ 弁護士コラム /blog/** は 60 秒ごとに作り直す ISR にする（isr: 60）\n", "    '/blog/**': { isr: 60 },\n"],
    ['TopPage.vue', "// ⑤ localStorage はブラウザにしか無い。サーバーでも動くこの位置に書くとエラーになる → onMounted の中へ移す\nconst visits = Number(localStorage.getItem('visits') ?? 0)\n",
      J(["import { onMounted, ref } from 'vue'", '', 'const visits = ref<number>(0)', '', 'onMounted(() => {', "  visits.value = Number(localStorage.getItem('visits') ?? 0) + 1", "  localStorage.setItem('visits', String(visits.value))", '})', ''])],
    ['BlogPost.vue', "// ④ サーバーで記事を取ってから HTML にする。useFetch<Post>() を使う（URL は /api/posts/スラッグ）\nconst post = ref<Post | null>(null)\n",
      'const { data: post } = await useFetch<Post>(`/api/posts/${route.params.slug}`)\n'],
    ['BlogPost.vue', "// ⑥ 検索結果に出るタイトルと説明を、記事の中身から決める（useSeoMeta）\n",
      J(['useSeoMeta({', '  title: () => post.value?.title,', '  description: () => post.value?.summary,', '})', ''])],
  ];
  const rule = (cfg, path) => { const m = strip(cfg).match(new RegExp('[\'"`]' + path.replace(/[*/]/g, '\\$&') + '[\'"`]\\s*:\\s*\\{([^}]*)\\}')); return m ? m[1] : ''; };

  function makeRender() {
    const sol = applyEdits(XR_FILES, XR_EDITS);
    const defs = [
      { lv: 1, at: ['nuxt.config.ts', '// ① '], label: '① nuxt.config.ts で、/admin/** を SPA にする（ssr: false）',
        hint: mkHint('SPA は、ブラウザで画面を作る方式。routeRules に、パスごとの設定を書く。', "'/admin/**': { ssr: false }", "routeRules: {\n  '/admin/**': { ssr: false },\n}", 'ts'),
        ok: (v) => /ssr\s*:\s*false/.test(rule(v['nuxt.config.ts'], '/admin/**')) },
      { lv: 1, at: ['nuxt.config.ts', '// ② '], label: '② nuxt.config.ts で、/ を SSG にする（prerender: true）',
        hint: mkHint('SSG は、ビルドのときに HTML を作っておく方式。ほぼ変わらないページ向き。', "'/': { prerender: true }", "routeRules: {\n  '/': { prerender: true },\n}", 'ts'),
        ok: (v) => /prerender\s*:\s*true/.test(rule(v['nuxt.config.ts'], '/')) },
      { lv: 1, at: ['nuxt.config.ts', '// ③ '], label: '③ nuxt.config.ts で、/blog/** を 60 秒ごとに作り直す（isr: 60）',
        hint: mkHint('ISR は、一定時間ごとに作り直す方式。秒数を数字で書く。', "'/blog/**': { isr: 60 }", "routeRules: {\n  '/blog/**': { isr: 60 },\n}", 'ts'),
        ok: (v) => /isr\s*:\s*60\b/.test(rule(v['nuxt.config.ts'], '/blog/**')) },
      { lv: 2, at: ['BlogPost.vue', '// ④ '], label: '④ BlogPost.vue で、記事を useFetch<Post>() で取得する',
        hint: mkHint('SSR のページでは、データ取得に useFetch（または useAsyncData）を使う。型は <Post>。URL は /api/posts/ にスラッグを付ける。', 'useFetch<Post>(`/api/posts/${route.params.slug}`)', 'const { data: post } = await useFetch<Post>(`/api/posts/${route.params.slug}`)', 'ts'),
        ok: (v) => /await\s+(useFetch|useAsyncData)\s*<\s*Post\s*>\s*\(/.test(strip(v['BlogPost.vue'])) && /\/api\/posts\//.test(strip(v['BlogPost.vue'])) && !/ref<Post/.test(strip(v['BlogPost.vue'])) },
      { lv: 2, at: ['TopPage.vue', '// ⑤ '], label: '⑤ TopPage.vue で、localStorage を onMounted の中だけで使う',
        hint: mkHint('サーバーには localStorage が無い。ブラウザで画面が出たあとに動く onMounted の中へ移す。', "onMounted(() => {\n  visits.value = Number(localStorage.getItem('visits') ?? 0) + 1\n})", "const visits = ref<number>(0)\n\nonMounted(() => {\n  visits.value = Number(localStorage.getItem('visits') ?? 0) + 1\n  localStorage.setItem('visits', String(visits.value))\n})", 'ts'),
        ok: (v) => { const s = strip(v['TopPage.vue']); const i = s.indexOf('onMounted('); const j = s.indexOf('localStorage'); return i >= 0 && j > i && /ref\s*(<[^>]*>)?\s*\(/.test(s) && /\{\{\s*visits\s*\}\}/.test(s); } },
      { lv: 3, at: ['BlogPost.vue', '// ⑥ '], label: '⑥ BlogPost.vue で、記事の中身から useSeoMeta のタイトルと説明を決める',
        hint: mkHint('SSR の良さは、検索エンジンが中身を読めること。useSeoMeta に、記事の title と summary を渡す。', 'useSeoMeta({\n  title: () => post.value?.title,\n})', "useSeoMeta({\n  title: () => post.value?.title,\n  description: () => post.value?.summary,\n})", 'ts'),
        ok: (v) => /useSeoMeta\s*\(\s*\{[\s\S]*?title\s*:[\s\S]*?post[\s\S]*?description\s*:[\s\S]*?post[\s\S]*?\}\s*\)/.test(strip(v['BlogPost.vue'])) },
    ];
    return {
      mode: 'text', sfc: true, height: 380,
      alias: { 'App.vue': 'TopPage.vue' },
      files: Object.keys(XR_FILES).map((n) => ({ name: n, lang: langOf(n), code: XR_FILES[n] })),
      paths: { 'nuxt.config.ts': 'nuxt.config.ts', 'TopPage.vue': 'pages/index.vue', 'BlogPost.vue': 'pages/blog/[slug].vue', 'AdminDashboard.vue': 'pages/admin/index.vue', 'post.ts': 'types/post.ts' },
      fileNotes: { 'nuxt.config.ts': '設定：ページごとの描画方式（routeRules）', 'TopPage.vue': 'トップページ（/）', 'BlogPost.vue': '弁護士コラムの記事ページ（/blog/スラッグ）', 'AdminDashboard.vue': '管理画面（触らない）', 'post.ts': '型だけのファイル（interface Post。触らない）' },
      note: '<b>ページごとに、描画方式を選ぶ</b><br>・<code>/admin/**</code> 管理画面：SEO 不要 → <b>SPA</b>（<code>ssr: false</code>）<br>・<code>/</code> トップ：ほぼ変わらない → <b>SSG</b>（<code>prerender: true</code>）<br>・<code>/blog/**</code> コラム：60 秒ごとに更新 → <b>ISR</b>（<code>isr: 60</code>）<br>そのうえで、<b>サーバーで動くコード</b>の書き方（useFetch / onMounted / useSeoMeta）も直そう。',
      solution: sol,
      tasks: (v) => defs.map((d) => {
        let ok = false;
        try { ok = !!d.ok(v); } catch (e) { ok = false; }
        return { level: d.lv, label: d.label, ok, hint: d.hint, at: { file: d.at[0], find: [d.at[1]] } };
      }),
    };
  }

  /* ================================================================
     ターミナル型（vue-env / x-vue-workflow）：drills/sim.js と同じ形（kind: 'term' | 'git'）
     ================================================================ */
  const NOTE = (t) => '<b>やること</b><br>' + t + '<br>下のミッションが、<b>実際の操作の結果</b>で ✓ になります。';
  const m = (level, label, ok, hint, ans) => ({ level, label, ok: !!ok, hint: [].concat(hint || []), answer: ans ? { code: ans, lang: 'sh' } : undefined });
  const hasRan = (S, re) => S.ran.some((r) => re.test(r.line));
  const seqRan = (S, res) => { let f = 0; for (const re of res) { const i = S.ran.findIndex((r, k) => k >= f && re.test(r.line)); if (i < 0) return false; f = i + 1; } return true; };
  const newCommits = (S, base) => [...S.q.ancestors(S.q.tip())].filter((x) => !S.q.ancestors(base).has(x));

  const RE_CREATE = /^npm\s+(create|init)\s+vue(@latest)?(\s+\S+)*$/;
  const RE_CD = /^cd\s+consult-app\/?$/;
  const RE_INSTALL = /^npm\s+(install|i)$/;
  const envSpec = () => ({
    kind: 'term', files: { 'README.md': '# 作業フォルダ\n' },
    note: NOTE('相談受付アプリ <code>consult-app</code> を、<b>作る → 中に入る → 部品を入れる → 動かす → 公開用に build</b> まで一通りやる。'),
    solution: 'npm create vue@latest consult-app\ncd consult-app\nls\nnpm install\ncat package.json\nnpm run dev\nnpm run build\nls dist',
    tasks: (S) => [
      m(1, 'Vue のプロジェクト consult-app を作る（npm create vue@latest）', S.st.created.length > 0 && !!S.exists('/consult-app/package.json'), ['コマンドは <code>npm create</code> で始まる。作るのは vue（最新版なら <code>vue@latest</code>）。', '最後にプロジェクト名 <code>consult-app</code> を付ける。'], 'npm create vue@latest consult-app'),
      m(1, 'consult-app に cd で入って、ls で中身（package.json など）を見る', seqRan(S, [RE_CREATE, RE_CD, /^ls\b/]) && S.cwd().join('/') === 'consult-app', ['フォルダに入るのは <code>cd フォルダ名</code>。中身を見るのは <code>ls</code>。', '<code>cd consult-app</code> のあとに <code>ls</code>。'], 'cd consult-app\nls'),
      m(1, 'プロジェクトの中で、部品（依存）を入れる（npm install）', seqRan(S, [RE_CREATE, RE_CD, RE_INSTALL]) && !!S.exists('/consult-app/node_modules'), ['<code>npm install</code> は、package.json があるフォルダの中で打つ。', '外で打つと「package.json が無い」エラーになる。'], 'npm install'),
      m(2, 'cat で package.json を開いて、scripts（dev / build など）を確かめる', seqRan(S, [RE_CREATE, /^cat\s+(\S+\/)?package\.json$/]) && S.cwd().join('/') === 'consult-app', ['ファイルの中身を見るのは <code>cat ファイル名</code>。', '<code>cat package.json</code>（consult-app の中で）。'], 'cat package.json'),
      m(2, '部品を入れたあとに、開発サーバーを起動する（npm run dev）', seqRan(S, [RE_INSTALL, /^npm\s+run\s+dev$/]) && S.st.dev > 0, ['開発用に動かすのは <code>npm run dev</code>。先に <code>npm install</code> が要る。', '起動すると <code>http://localhost:5173/</code> が出る。'], 'npm run dev'),
      m(3, '公開用に build し（npm run build）、できた dist フォルダの中を ls で見る', seqRan(S, [/^npm\s+run\s+dev$/, /^npm\s+run\s+build$/, /^ls\s+dist\/?$/]) && S.st.built > 0 && !!S.exists('/consult-app/dist'), ['公開用のファイルは <code>npm run build</code> で作る。できたものは <code>dist/</code> に入る。', 'build のあとに <code>ls dist</code>。'], 'npm run build\nls dist'),
    ],
  });

  const WF_SEED = (sim) => {
    sim.seed({
      commits: [{ msg: 'first commit', files: { 'BookingForm.vue': '<template><form></form></template>\n', 'README.md': '# booking\n' }, push: true }],
      work: { 'BookingForm.vue': '<template><form><input type="date"></form></template>\n' },
    });
  };
  const RE_BRANCH = /^git\s+(checkout\s+-b|switch\s+-c)\s+(feat|fix)\/[a-z0-9]+(-[a-z0-9]+)*$/;
  const RE_PRETTIER = /^npx\s+prettier\s+(--write|-w)\b/;
  const RE_ESLINT = /^npx\s+eslint\b/;
  const wfSpec = () => ({
    kind: 'git', seed: WF_SEED,
    note: NOTE('予約フォームの機能を 1 つ作って、<b>GitHub に送るまで</b>。ブランチ名は <code>feat/名前</code>、コミットの頭は <code>feat:</code>、送る前に <b>Prettier</b>（整形）→ <b>ESLint</b>（チェック）。'),
    solution: 'git checkout -b feat/booking-date\nnpx prettier --write .\nnpx eslint .\ngit add .\ngit commit -m "feat: 予約フォームに日付の選択を追加 (#12)"\ngit push -u origin feat/booking-date',
    tasks: (S) => { const ids = newCommits(S, S.S.remote.main); const onBranch = /^(feat|fix)\//.test(S.S.head); return [
      m(1, '作業用ブランチを feat/○○ の名前で作る（半角英数とハイフン）', /^(feat|fix)\/[a-z0-9]+(-[a-z0-9]+)*$/.test(S.S.head), ['<code>git checkout -b feat/名前</code>（または <code>git switch -c</code>）。', 'feat/ か fix/ で始めて、あとは小文字の英数字とハイフン。例：<code>feat/booking-date</code>'], 'git checkout -b feat/booking-date'),
      m(1, 'Prettier でコードを整える（npx prettier --write .）', hasRan(S, RE_PRETTIER), ['Prettier は、書き方（字下げ・改行・引用符）をそろえる道具。', '<code>npx prettier --write .</code>（. は「全部」）'], 'npx prettier --write .'),
      m(1, 'ESLint でコードをチェックする（npx eslint .）', hasRan(S, RE_ESLINT), ['ESLint は、バグになりやすい書き方を見つける道具。', '<code>npx eslint .</code>'], 'npx eslint .'),
      m(2, 'ブランチの上で add → commit する。メッセージの頭に feat: を付ける', onBranch && ids.some((id) => /^(feat|fix|docs|refactor|test|chore):\s*\S.{2,}/.test(S.q.C(id).msg)), ['<code>git add .</code> のあとに <code>git commit -m "feat: …"</code>。', '頭は「feat:」＋ 半角スペース ＋ 内容。'], 'git add .\ngit commit -m "feat: 予約フォームに日付の選択を追加"'),
      m(2, '作ったブランチを、-u を付けて GitHub に push する', onBranch && S.S.remote[S.S.head] === S.q.tip() && !!S.S.upstream[S.S.head] && ids.length > 0, ['最初の push は <code>git push -u origin ブランチ名</code>。', '<code>-u</code> を付けると、次からは <code>git push</code> だけで済む。'], 'git push -u origin feat/booking-date'),
      m(3, '通しで：ブランチ → Prettier → ESLint → add → commit（末尾に Issue 番号 (#12) を付ける）→ push の順に行う', seqRan(S, [RE_BRANCH, RE_PRETTIER, RE_ESLINT, /^git\s+add\b/, /^git\s+commit\b/, /^git\s+push\b/]) && ids.some((id) => /^(feat|fix):\s*\S.*#\d+/.test(S.q.C(id).msg)) && S.S.remote[S.S.head] === S.q.tip(), ['送る前に整形とチェック（Prettier → ESLint）。そのあと add → commit → push。', 'メッセージの末尾に Issue 番号：<code>git commit -m "feat: 予約フォームに日付の選択を追加 (#12)"</code>'], 'git checkout -b feat/booking-date\nnpx prettier --write .\nnpx eslint .\ngit add .\ngit commit -m "feat: 予約フォームに日付の選択を追加 (#12)"\ngit push -u origin feat/booking-date'),
    ]; },
  });

  /* ---------- 登録（あとから読み込まれるファイルに上書きされないよう、何度か登録する） ---------- */
  let cache = null;
  function install() {
    try {
      const T = (K.tests = K.tests || {});
      if (!cache) {
        cache = { 'vue-env': envSpec(), 'x-vue-workflow': wfSpec(), 'x-vue-render': makeRender() };
        const vt = makeVueTest();
        if (vt) cache['vue-test'] = vt;
      }
      Object.keys(cache).forEach((id) => { T[id] = cache[id]; });
    } catch (e) { if (window.console) console.error('vue-x-extra-a', e); }
  }
  install();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install);
  window.addEventListener('load', install);
  setTimeout(install, 0);
})();
