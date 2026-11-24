/* 練習：vue-test（メイン教材）「Vue 単体テスト：コマンドの使い方」（描く / 探す / 操作する / 確かめる / にせものを使う）。
   部品（.vue）と、テスト（.test.ts）の 2 種類のファイルで出す。テストはブラウザの中の簡易ランナー（vitest ＋ @vue/test-utils の小さな互換）で本当に動かす。
   ・ランナーは vue-x-d.js の ktShim と同じ考え方（このファイルに写して、find / get / findComponent / shallowMount / slots / global.stubs / vi.fn などを足した）。
   ・vi.mock（モジュールごとの差し替え）はブラウザでは動かせないので、「関数を props で渡す」形で vi.fn を練習する。
   ・判定は、コメントを取り除いた本文に対して行う。expect が 1 つも無いテストは失敗扱い。 */
(function () {
  const K = window.KENSHU;
  if (!K || !K.vueDrillTools) return;
  const D = (K.drills = K.drills || {});
  const { multi, T, VUE } = K.vueDrillTools;
  const ID = 'vue-test';
  D[ID] = D[ID] || {};

  /* starter の文字列に（1回だけ現れる）置換を当てて solution を作る */
  const edit = (src, pairs) => pairs.reduce((s, p) => {
    if (s.split(p[0]).length !== 2) throw new Error('drill edit: not unique -> ' + p[0].slice(0, 50));
    return s.replace(p[0], () => p[1]);
  }, src);

  /* ---------- ブラウザの中のテストランナー（vitest ＋ @vue/test-utils の小さな互換） ---------- */
  function ktShim() {
    var R = (window.__kt = { done: false, tests: [] });
    var queue = [], prefix = [], hooks = [], boxes = [], cur = null;
    var fmt = function (x) { try { return x === undefined ? 'undefined' : JSON.stringify(x); } catch (e) { return String(x); } };
    var eq = function (a, b) {
      if (Object.is(a, b)) return true;
      if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
      if (Array.isArray(a) !== Array.isArray(b)) return false;
      var ka = Object.keys(a), kb = Object.keys(b);
      return ka.length === kb.length && ka.every(function (k) { return eq(a[k], b[k]); });
    };
    var matchers = function (recv, neg) {
      var chk = function (name, pass, exp) {
        var ok = neg ? !pass : pass;
        if (cur) cur.expects.push({ m: (neg ? 'not.' : '') + name, recv: recv, exp: exp, pass: ok });
        if (!ok) throw new Error('expect(' + fmt(recv) + ').' + (neg ? 'not.' : '') + name + '(' + (exp === undefined ? '' : fmt(exp)) + ') が成り立ちません');
      };
      var calls = function () { if (!recv || !recv.mock) throw new Error('vi.fn() ではないので使えません'); return recv.mock.calls; };
      return {
        toBe: function (e) { chk('toBe', Object.is(recv, e), e); },
        toEqual: function (e) { chk('toEqual', eq(recv, e), e); },
        toStrictEqual: function (e) { chk('toEqual', eq(recv, e), e); },
        toContain: function (e) { chk('toContain', recv != null && recv.indexOf(e) >= 0, e); },
        toMatch: function (e) { chk('toMatch', typeof recv === 'string' && new RegExp(e).test(recv), String(e)); },
        toBeTruthy: function () { chk('toBeTruthy', !!recv); },
        toBeFalsy: function () { chk('toBeFalsy', !recv); },
        toBeDefined: function () { chk('toBeDefined', recv !== undefined); },
        toBeUndefined: function () { chk('toBeUndefined', recv === undefined); },
        toBeNull: function () { chk('toBeNull', recv === null); },
        toHaveLength: function (n) { chk('toHaveLength', recv != null && recv.length === n, n); },
        toBeGreaterThan: function (n) { chk('toBeGreaterThan', recv > n, n); },
        toThrow: function () { var t = false; try { recv(); } catch (e) { t = true; } chk('toThrow', t); },
        toHaveBeenCalled: function () { chk('toHaveBeenCalled', calls().length > 0); },
        toHaveBeenCalledTimes: function (n) { chk('toHaveBeenCalledTimes', calls().length === n, n); },
        toHaveBeenCalledWith: function () { var a = [].slice.call(arguments); chk('toHaveBeenCalledWith', calls().some(function (c) { return eq(c, a); }), a); },
      };
    };
    window.expect = function (r) { var m = matchers(r, false); m.not = matchers(r, true); return m; };
    window.describe = function (name, fn) { prefix.push(name); try { fn(); } finally { prefix.pop(); } };
    window.it = window.test = function (name, fn) { queue.push({ name: prefix.concat(name).join(' › '), fn: fn }); };
    window.beforeEach = function (fn) { hooks.push(fn); };
    window.flushPromises = function () { return new Promise(function (r) { setTimeout(r, 0); }).then(function () { return Vue.nextTick(); }); };
    window.vi = {
      fn: function (impl) {
        var f = function () { var a = [].slice.call(arguments); f.mock.calls.push(a); return f._impl ? f._impl.apply(this, a) : undefined; };
        f.mock = { calls: [] }; f._impl = impl;
        f.mockResolvedValue = function (v) { f._impl = function () { return Promise.resolve(v); }; return f; };
        f.mockRejectedValue = function (e) { f._impl = function () { return Promise.reject(e); }; return f; };
        f.mockReturnValue = function (v) { f._impl = function () { return v; }; return f; };
        f.mockImplementation = function (g) { f._impl = g; return f; };
        f.mockClear = function () { f.mock.calls = []; return f; };
        return f;
      },
      mocked: function (x) { return x; }, clearAllMocks: function () {},
    };
    var kebab = function (s) { return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(); };
    var walk = function (vn, f) {
      if (!vn) return;
      if (vn.component) { f(vn); walk(vn.component.subTree, f); }
      else if (Array.isArray(vn.children)) vn.children.forEach(function (c) { walk(c, f); });
    };
    var dom = function (el) {
      var need = function () { if (!el) throw new Error('要素が見つかりません（find のセレクターを確かめてください）'); };
      var self = {
        element: el,
        exists: function () { return !!el; },
        text: function () { need(); return el.textContent.trim(); },
        html: function () { need(); return el.outerHTML; },
        attributes: function (n) { need(); if (n) return el.hasAttribute(n) ? el.getAttribute(n) : undefined; var o = {}; [].forEach.call(el.attributes, function (a) { o[a.name] = a.value; }); return o; },
        classes: function (n) { need(); var l = [].slice.call(el.classList); return n ? l.indexOf(n) >= 0 : l; },
        isVisible: function () { need(); return el.isConnected && getComputedStyle(el).display !== 'none'; },
        trigger: function (type) {
          need(); if (el.disabled) return Vue.nextTick();
          var ev = /^key/.test(type) ? new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }) : /^(click|mouse)/.test(type) ? new MouseEvent(type, { bubbles: true, cancelable: true }) : new Event(type, { bubbles: true, cancelable: true });
          el.dispatchEvent(ev);
          return Vue.nextTick();
        },
        setValue: function (v) {
          need();
          if (el.type === 'checkbox') { el.checked = !!v; el.dispatchEvent(new Event('change', { bubbles: true })); }
          else { el.value = v; el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })); }
          return Vue.nextTick();
        },
        find: function (sel) { return dom(el ? el.querySelector(sel) : null); },
        findAll: function (sel) { return [].map.call(el ? el.querySelectorAll(sel) : [], dom); },
        get: function (sel) { var r = el && el.querySelector(sel); if (!r) throw new Error('Unable to get ' + sel); return dom(r); },
      };
      return self;
    };
    var stubFor = function (name, orig) { return { name: name + 'Stub', props: orig.props, __orig: orig, render: function () { return Vue.h(kebab(name) + '-stub', this.$props); } }; };
    var build = function (Comp, opts, shallow) {
      var comps = Object.assign({}, Comp.components || {}), stubs = (opts.global && opts.global.stubs) || {};
      Object.keys(comps).forEach(function (n) { if (comps[n] !== Comp && (shallow || stubs[n] === true)) comps[n] = stubFor(n, comps[n]); });
      return Object.assign({}, Comp, { components: comps });
    };
    var doMount = function (Comp, opts, shallow) {
      opts = opts || {};
      var state = Vue.reactive(Object.assign({}, opts.props || {})), emitted = {}, inst = null, handlers = {};
      (Comp.emits || []).forEach(function (ev) {
        var key = 'on' + ev.charAt(0).toUpperCase() + ev.slice(1), user = state[key];
        handlers[key] = function () { var a = [].slice.call(arguments); (emitted[ev] = emitted[ev] || []).push(a); if (typeof user === 'function') return user.apply(null, a); };
      });
      var slots = {};
      Object.keys(opts.slots || {}).forEach(function (k) { var v = opts.slots[k]; slots[k] = function () { return typeof v === 'function' ? v() : v; }; });
      var Wrapped = build(Comp, opts, shallow);
      var box = document.createElement('div'); document.body.appendChild(box);
      var app = Vue.createApp({ render: function () { return Vue.h(Wrapped, Object.assign({}, state, handlers, { ref: function (i) { inst = i; } }), slots); } });
      var prov = (opts.global && opts.global.provide) || {};
      Object.keys(prov).forEach(function (k) { app.provide(k, prov[k]); });
      ((opts.global && opts.global.plugins) || []).forEach(function (p) { app.use(p); });
      app.mount(box); boxes.push({ box: box, app: app });
      var rootEl = box.children.length === 1 ? box.firstElementChild : box;
      var w = dom(rootEl);
      var q1 = function (sel) { return rootEl.matches && rootEl.matches(sel) ? rootEl : rootEl.querySelector(sel); };
      var comp = function (vn) {
        var c = vn.component, pr = function (k) { var o = Object.assign({}, c.props); return k ? o[k] : o; };
        var d = dom(vn.el && vn.el.nodeType === 1 ? vn.el : null);
        return Object.assign(d, { props: pr, vm: c.proxy, exists: function () { return true; } });
      };
      var match = function (C) { var out = []; walk(inst.$.subTree, function (vn) { if (vn.type === C || (vn.type && vn.type.__orig === C)) out.push(vn); }); return out; };
      return Object.assign(w, {
        vm: inst, exists: function () { return true; }, html: function () { return rootEl === box ? box.innerHTML : rootEl.outerHTML; },
        find: function (sel) { return dom(q1(sel)); },
        findAll: function (sel) { var l = [].slice.call(rootEl.querySelectorAll(sel)); if (rootEl.matches && rootEl.matches(sel)) l.unshift(rootEl); return l.map(dom); },
        get: function (sel) { var r = q1(sel); if (!r) throw new Error('Unable to get ' + sel); return dom(r); },
        emitted: function (n) { return n ? emitted[n] : emitted; },
        props: function (k) { var o = Object.assign({}, state); return k ? o[k] : o; },
        setProps: function (p) { Object.assign(state, p); return Vue.nextTick(); },
        findComponent: function (C) { var m = match(C); return m.length ? comp(m[0]) : { exists: function () { return false; } }; },
        findAllComponents: function (C) { return match(C).map(comp); },
        getComponent: function (C) { var m = match(C); if (!m.length) throw new Error('Unable to get component'); return comp(m[0]); },
        unmount: function () { app.unmount(); },
      });
    };
    window.mount = function (Comp, opts) { return doMount(Comp, opts, false); };
    window.shallowMount = function (Comp, opts) { return doMount(Comp, opts, true); };
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
  const ktRes = (c) => { const d = c && c.doc && c.doc(); const w = d && d.defaultView; return w && w.__kt && w.__kt.done ? w.__kt : null; };
  const ktOk = (c, no, f) => { const k = ktRes(c); const ts = k ? k.tests.filter((x) => x.name.split(' › ').pop().indexOf(no) === 0) : []; return ts.length > 0 && ts.every((x) => x.pass) && (!f || f(ts[0], ts)); };
  const hasE = (x, f) => x.expects.some((e) => e.pass && f(e));
  const ex = (e) => String(e.exp);
  const strip = (s) => String(s || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
  /* it('① …') の中身（次の it までの文字列）を取り出す */
  const itBody = (src, no) => { const i = src.indexOf("it('" + no); if (i < 0) return ''; const j = src.indexOf('\n  it', i + 5); const k = src.indexOf('\n  })', i); return src.slice(i, j > 0 && j < (k > 0 ? k : 1e9) ? j : k > 0 ? k : src.length); };

  /* 1 つの練習を組み立てる。cfg: comp / files（部品）/ head（テストの先頭）/ its: [{ no, name, note, sol, lv, label, hint, ok }] */
  const NO = ['①', '②', '③', '④', '⑤', '⑥'];
  const make = (cfg) => {
    const tf = cfg.comp + '.test.ts';
    const starter = cfg.head + "\ndescribe('" + cfg.desc + "', () => {\n" + cfg.its.map((o, i) => "  it('" + NO[i] + ' ' + o.name + "', async () => {\n    // " + NO[i] + ' ' + o.note + '\n  })').join('\n\n') + '\n})\n';
    const files = Object.assign({ [tf]: starter }, cfg.vue);
    const pairs = cfg.its.map((o, i) => ['    // ' + NO[i] + ' ' + o.note + '\n', o.sol.split('\n').map((l) => (l ? '    ' + l : l)).join('\n') + '\n']);
    const paths = { [tf]: 'src/components/__tests__/' + tf };
    Object.keys(cfg.vue).forEach((n) => { paths[n] = 'src/components/' + n; });
    const notes = { [tf]: 'ここにテストを書く', [cfg.comp + '.vue']: 'テストされる部品（触らない）' };
    return multi(files, { [tf]: edit(starter, pairs) }, (v, c) => cfg.its.map((o, i) => {
      let ok = false;
      const body = itBody(strip(v[tf]), NO[i]);
      try { ok = !!o.ok(c, body, v); } catch (e) { ok = false; }
      const hint = [o.hint[0].replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')];
      if (o.hint[1] && o.hint[1] !== o.sol) hint.push({ code: o.hint[1], lang: 'ts' });
      hint.push({ code: o.sol, lang: 'ts' });
      return T(o.label, o.lv, ok, hint, { file: tf, find: ['// ' + NO[i] + ' '] });
    }), { libs: [VUE, KT_LIB], height: cfg.height || 460, paths, fileNotes: notes });
  };
  const IM = "import { describe, it, expect } from 'vitest'\nimport { mount } from '@vue/test-utils'\n";
  const it_ = (lv, no, name, note, sol, label, hint, ok) => ({ lv, name, note, sol, label, hint, ok });
  const E = (c, no, f) => ktOk(c, no, f);

  /* ============ 描く：mount と shallowMount ============ */
  const CARD = '<script setup lang="ts">\ndefineProps<{ title: string; urgent: boolean }>()\n</script>\n\n<template>\n  <article class="case-card">\n    <h3>{{ title }}</h3>\n    <span v-if="urgent" class="badge">急ぎ</span>\n  </article>\n</template>\n';
  const LIST = '<script setup lang="ts">\ninterface Case {\n  id: number\n  title: string\n  urgent: boolean\n}\n\ndefineProps<{ cases: Case[] }>()\n</script>\n\n<template>\n  <section class="case-list">\n    <h2>相談一覧</h2>\n    <p v-if="cases.length === 0" data-test="empty"><slot name="empty">相談はありません</slot></p>\n    <CaseCard v-for="c in cases" :key="c.id" :title="c.title" :urgent="c.urgent" />\n  </section>\n</template>\n';
  const HEAD_A = IM.replace('{ mount }', '{ mount, shallowMount }') + "import CaseList from '../CaseList.vue'\nimport CaseCard from '../CaseCard.vue'\n\nconst cases = [\n  { id: 1, title: '未払い残業代の請求', urgent: true },\n  { id: 2, title: '賃貸の敷金返還', urgent: false },\n]\n";
  D[ID]['描く：mount と shallowMount'] = make({
    comp: 'CaseList', desc: 'CaseList（相談一覧）', head: HEAD_A, vue: { 'CaseList.vue': LIST, 'CaseCard.vue': CARD }, height: 480,
    its: [
      it_(1, '①', '案件名が画面に出る', 'mount に props: { cases } を渡し、text() に「未払い残業代の請求」が含まれると確かめる',
        "const wrapper = mount(CaseList, { props: { cases } })\nexpect(wrapper.text()).toContain('未払い残業代の請求')",
        'CaseList.test.ts の ① で、props に cases を渡して mount し、案件名が出ると確かめる（text() に「未払い残業代の請求」が含まれる）',
        ['mount の 2 つ目の引数に { props: { ... } } を渡す。画面の文字は wrapper.text()。', "mount(CaseList, { props: { cases } })"],
        (c, b) => E(c, '①', (x) => hasE(x, (e) => /未払い残業代の請求/.test(ex(e)))) && /mount\s*\(\s*CaseList\s*,\s*\{[\s\S]*props/.test(b)),
      it_(1, '②', '0 件のときは「相談はありません」', 'cases を空配列にして mount し、「相談はありません」が出ると確かめる',
        "const wrapper = mount(CaseList, { props: { cases: [] } })\nexpect(wrapper.text()).toContain('相談はありません')",
        'CaseList.test.ts の ② で、cases を空配列にして mount し、空の表示を確かめる（text() に「相談はありません」が含まれる）',
        ['props: { cases: [] } のように、空の配列を渡す。'],
        (c, b) => E(c, '②', (x) => hasE(x, (e) => /相談はありません/.test(ex(e)))) && /cases\s*:\s*\[\s*\]/.test(b)),
      it_(1, '③', 'slots で、空のときの文言を差し替える', 'mount の slots: { empty: … } で文言を渡し、その文言が出ると確かめる',
        "const wrapper = mount(CaseList, {\n  props: { cases: [] },\n  slots: { empty: '現在、相談はありません' },\n})\nexpect(wrapper.text()).toContain('現在、相談はありません')",
        'CaseList.test.ts の ③ で、slots で empty の文言を渡して mount し、差し替わると確かめる（text() に「現在、相談はありません」が含まれる）',
        ['部品の <slot name="empty"> に中身を入れるのが slots。キーはスロット名。', "mount(CaseList, { props: { cases: [] }, slots: { empty: '…' } })"],
        (c, b) => E(c, '③', (x) => hasE(x, (e) => /現在、相談はありません/.test(ex(e)))) && /slots\s*:\s*\{[^}]*empty/.test(b)),
      it_(2, '④', 'shallowMount だと、子はスタブになる', 'shallowMount で mount し、html() に case-card-stub が含まれると確かめる',
        "const wrapper = shallowMount(CaseList, { props: { cases } })\nexpect(wrapper.html()).toContain('case-card-stub')",
        'CaseList.test.ts の ④ で、shallowMount で mount し、子がスタブになると確かめる（html() に case-card-stub が含まれる）',
        ['shallowMount は子をスタブ（代役）にする。スタブのタグ名は「部品名-stub」。', "shallowMount(CaseList, { props: { cases } })"],
        (c, b) => E(c, '④', (x) => hasE(x, (e) => e.m === 'toContain' && /case-card-stub/.test(ex(e)))) && /shallowMount\s*\(/.test(b)),
      it_(2, '⑤', 'stubs で、CaseCard だけスタブにする', 'mount の global.stubs で CaseCard をスタブにし、html() に case-card-stub が含まれ、「急ぎ」は含まれないと確かめる',
        "const wrapper = mount(CaseList, {\n  props: { cases },\n  global: { stubs: { CaseCard: true } },\n})\nexpect(wrapper.html()).toContain('case-card-stub')\nexpect(wrapper.text()).not.toContain('急ぎ')",
        'CaseList.test.ts の ⑤ で、global.stubs で CaseCard を代役にして mount し、子の中身が出ないと確かめる（case-card-stub は出て、「急ぎ」は出ない）',
        ['global: { stubs: { 部品名: true } } で、名前を指定した子だけスタブにできる。「ない」ことは .not.toContain。', "global: { stubs: { CaseCard: true } }"],
        (c, b) => E(c, '⑤', (x) => hasE(x, (e) => e.m === 'toContain' && /case-card-stub/.test(ex(e))) && hasE(x, (e) => e.m === 'not.toContain' && /急ぎ/.test(ex(e)))) && /stubs\s*:\s*\{\s*CaseCard\s*:\s*true/.test(b)),
      it_(3, '⑥', 'スタブでも、子に渡した props は確かめられる', 'shallowMount し、findAllComponents(CaseCard) が 2 つで、1 つ目の props(\'title\') が「未払い残業代の請求」と確かめる',
        "const wrapper = shallowMount(CaseList, { props: { cases } })\nconst cards = wrapper.findAllComponents(CaseCard)\nexpect(cards).toHaveLength(2)\nexpect(cards[0].props('title')).toBe('未払い残業代の請求')",
        'CaseList.test.ts の ⑥ で、findAllComponents で子を探し、渡した props を確かめる（2 つあり、1 つ目の title が「未払い残業代の請求」）',
        ['findAllComponents(部品) は子を配列で返す。各要素の props(\'名前\') で、親が渡した値を読める。', "const cards = wrapper.findAllComponents(CaseCard)\nexpect(cards).toHaveLength(2)"],
        (c, b) => E(c, '⑥', (x) => hasE(x, (e) => e.m === 'toHaveLength' && e.exp === 2) && hasE(x, (e) => e.m === 'toBe' && /未払い残業代の請求/.test(ex(e)))) && /findAllComponents\s*\(\s*CaseCard/.test(b) && /props\s*\(\s*['"]title/.test(b)),
    ],
  });

  /* ============ 探す・操作する：ReservePanel ============ */
  const SLOTITEM = '<script setup lang="ts">\ndefineProps<{ time: string }>()\n</script>\n\n<template>\n  <li class="slot-item" data-test="slot">{{ time }}</li>\n</template>\n';
  const PANEL = '<script setup lang="ts">\nconst props = defineProps<{ slots: number }>()\nconst emit = defineEmits<{ reserve: [remaining: number] }>()\n\nconst used = ref(0)\nconst name = ref(\'\')\nconst loaded = ref(false)\nconst times = [\'10:00\', \'11:00\', \'14:00\']\nconst remaining = computed(() => props.slots - used.value)\n\nfunction reserve(): void {\n  if (remaining.value === 0) return\n  used.value++\n  emit(\'reserve\', remaining.value)\n}\n\nonMounted(() => {\n  setTimeout(() => {\n    loaded.value = true\n  }, 0)\n})\n</script>\n\n<template>\n  <section data-test="panel">\n    <h2>相談予約</h2>\n    <p data-test="remaining">残り {{ remaining }} 枠</p>\n    <p data-test="status">{{ loaded ? \'確認済み\' : \'確認中…\' }}</p>\n    <input v-model="name" data-test="name" placeholder="氏名" @keydown.enter="reserve" />\n    <p v-if="name" data-test="greeting">{{ name }} 様</p>\n    <button data-test="reserve" :disabled="remaining === 0" @click="reserve">{{ remaining === 0 ? \'満席です\' : \'予約する\' }}</button>\n    <ul>\n      <SlotItem v-for="t in times" :key="t" :time="t" />\n    </ul>\n  </section>\n</template>\n';
  const HEAD_P = IM.replace('{ mount }', '{ mount, flushPromises }') + "import ReservePanel from '../ReservePanel.vue'\nimport SlotItem from '../SlotItem.vue'\n";

  D[ID]['探す：find と get'] = make({
    comp: 'ReservePanel', desc: 'ReservePanel（相談予約パネル）', head: HEAD_P, vue: { 'ReservePanel.vue': PANEL, 'SlotItem.vue': SLOTITEM }, height: 480,
    its: [
      it_(1, '①', '予約ボタンを find で探す', "mount し、find('[data-test=\"reserve\"]') の text() が「予約する」と確かめる",
        "const wrapper = mount(ReservePanel, { props: { slots: 3 } })\nexpect(wrapper.find('[data-test=\"reserve\"]').text()).toBe('予約する')",
        'ReservePanel.test.ts の ① で、data-test で予約ボタンを find し、文字を確かめる（text() が「予約する」と等しい）',
        ["find('セレクター') で要素を 1 つ探す。data-test なら [data-test=\"reserve\"] と書く。", "wrapper.find('[data-test=\"reserve\"]').text()"],
        (c, b) => E(c, '①', (x) => hasE(x, (e) => e.m === 'toBe' && e.exp === '予約する')) && /find\s*\(/.test(b)),
      it_(1, '②', '時間の候補を findAll で数える', "findAll('li') が 3 つあると確かめる",
        "const wrapper = mount(ReservePanel, { props: { slots: 3 } })\nexpect(wrapper.findAll('li')).toHaveLength(3)",
        'ReservePanel.test.ts の ② で、findAll で時間の候補を全部探し、数を確かめる（li が 3 つ）',
        ['findAll は一致する全部を配列で返す。数は toHaveLength で確かめる。', "expect(wrapper.findAll('li')).toHaveLength(3)"],
        (c, b) => E(c, '②', (x) => hasE(x, (e) => e.m === 'toHaveLength' && e.exp === 3)) && /findAll\s*\(/.test(b)),
      it_(1, '③', '氏名の入力欄を get で取る', "get('[data-test=\"name\"]') の attributes('placeholder') が「氏名」と確かめる",
        "const wrapper = mount(ReservePanel, { props: { slots: 3 } })\nexpect(wrapper.get('[data-test=\"name\"]').attributes('placeholder')).toBe('氏名')",
        'ReservePanel.test.ts の ③ で、あるはずの入力欄を get で取り、属性を確かめる（placeholder が「氏名」と等しい）',
        ['get は find と同じ使い方。無いと例外を投げるので、あるはずの要素に使う。属性は attributes(\'名前\')。', "wrapper.get('[data-test=\"name\"]').attributes('placeholder')"],
        (c, b) => E(c, '③', (x) => hasE(x, (e) => e.m === 'toBe' && e.exp === '氏名')) && /get\s*\(/.test(b)),
      it_(2, '④', '無い要素は exists() が false', "find('.cancel').exists() が false と確かめる",
        "const wrapper = mount(ReservePanel, { props: { slots: 3 } })\nexpect(wrapper.find('.cancel').exists()).toBe(false)",
        'ReservePanel.test.ts の ④ で、無い要素を find して、存在しないと確かめる（find(\'.cancel\').exists() が false）',
        ['find は、無くても例外を投げず、exists() が false になる。', "expect(wrapper.find('.cancel').exists()).toBe(false)"],
        (c, b) => E(c, '④', (x) => hasE(x, (e) => e.m === 'toBe' && e.exp === false)) && /find\s*\([^)]*\)\s*\.exists\s*\(\s*\)/.test(b)),
      it_(2, '⑤', '子コンポーネントを findComponent で探す', "findComponent(SlotItem) の props('time') が「10:00」と確かめる",
        "const wrapper = mount(ReservePanel, { props: { slots: 3 } })\nexpect(wrapper.findComponent(SlotItem).props('time')).toBe('10:00')",
        'ReservePanel.test.ts の ⑤ で、findComponent で最初の子を探し、渡された値を確かめる（props(\'time\') が「10:00」）',
        ['findComponent(部品) で、タグでなく部品そのものを渡して探す。先頭の 1 つが返る。', "wrapper.findComponent(SlotItem).props('time')"],
        (c, b) => E(c, '⑤', (x) => hasE(x, (e) => e.m === 'toBe' && e.exp === '10:00')) && /findComponent\s*\(\s*SlotItem/.test(b)),
      it_(3, '⑥', '無い要素を get すると、例外になる', "expect(() => wrapper.get('.cancel')).toThrow() と書く（関数で包んで渡す）",
        "const wrapper = mount(ReservePanel, { props: { slots: 3 } })\nexpect(() => wrapper.get('.cancel')).toThrow()",
        'ReservePanel.test.ts の ⑥ で、無い要素を get した結果を確かめる（get(\'.cancel\') が例外を投げる＝toThrow）',
        ['例外を確かめるときは、expect に「関数」を渡す：expect(() => 処理).toThrow()。', "expect(() => wrapper.get('.cancel')).toThrow()"],
        (c, b) => E(c, '⑥', (x) => hasE(x, (e) => e.m === 'toThrow')) && /get\s*\(\s*['"]\.cancel/.test(b)),
    ],
  });

  D[ID]['操作する：trigger と setValue'] = make({
    comp: 'ReservePanel', desc: 'ReservePanel（相談予約パネル）', head: HEAD_P, vue: { 'ReservePanel.vue': PANEL, 'SlotItem.vue': SLOTITEM }, height: 480,
    its: [
      it_(1, '①', '予約ボタンを押すと残り枠が減る', "find して trigger('click')（await を付ける）し、「残り 2 枠」と確かめる",
        "const wrapper = mount(ReservePanel, { props: { slots: 3 } })\nawait wrapper.find('[data-test=\"reserve\"]').trigger('click')\nexpect(wrapper.text()).toContain('残り 2 枠')",
        'ReservePanel.test.ts の ① で、予約ボタンを trigger(\'click\') で押し、残り枠を確かめる（await を付け、text() に「残り 2 枠」が含まれる）',
        ["trigger('click') でクリック。画面の更新を待つので await を付ける。", "await wrapper.find('[data-test=\"reserve\"]').trigger('click')"],
        (c, b) => E(c, '①', (x) => hasE(x, (e) => /残り 2 枠/.test(ex(e)))) && /await[^\n]*trigger\s*\(\s*['"]click/.test(b)),
      it_(1, '②', '氏名を入力すると「〜 様」と出る', "setValue('山田 太郎')（await）で入力し、greeting の text() が「山田 太郎 様」と確かめる",
        "const wrapper = mount(ReservePanel, { props: { slots: 3 } })\nawait wrapper.find('input').setValue('山田 太郎')\nexpect(wrapper.find('[data-test=\"greeting\"]').text()).toBe('山田 太郎 様')",
        'ReservePanel.test.ts の ② で、入力欄に setValue で打ち込み、あいさつを確かめる（greeting の text() が「山田 太郎 様」と等しい）',
        ["setValue('文字') で入力欄に打ち込む。これも await が必要。", "await wrapper.find('input').setValue('山田 太郎')"],
        (c, b) => E(c, '②', (x) => hasE(x, (e) => e.m === 'toBe' && e.exp === '山田 太郎 様')) && /await[^\n]*setValue\s*\(/.test(b)),
      it_(1, '③', '親の値が変わると表示も変わる', "await wrapper.setProps({ slots: 5 }) のあと、「残り 5 枠」と確かめる",
        "const wrapper = mount(ReservePanel, { props: { slots: 3 } })\nawait wrapper.setProps({ slots: 5 })\nexpect(wrapper.text()).toContain('残り 5 枠')",
        'ReservePanel.test.ts の ③ で、setProps で親の値を変え、表示を確かめる（await し、text() に「残り 5 枠」が含まれる）',
        ['setProps は mount したあとで props を変える。画面が変わるので await を付ける。', "await wrapper.setProps({ slots: 5 })"],
        (c, b) => E(c, '③', (x) => hasE(x, (e) => /残り 5 枠/.test(ex(e)))) && /await[^\n]*setProps\s*\(/.test(b)),
      it_(2, '④', '3 回押すと満席になる', "ボタンを 3 回 trigger し（繰り返しで書く）、disabled 属性があることと、文字が「満席です」であることを確かめる",
        "const wrapper = mount(ReservePanel, { props: { slots: 3 } })\nconst button = wrapper.find('[data-test=\"reserve\"]')\nfor (let i = 0; i < 3; i++) {\n  await button.trigger('click')\n}\nexpect(button.attributes('disabled')).toBeDefined()\nexpect(button.text()).toBe('満席です')",
        'ReservePanel.test.ts の ④ で、ボタンを 3 回押して満席にし、状態を確かめる（disabled 属性があり、text() が「満席です」と等しい）',
        ['同じ操作の繰り返しは for 文でよい。属性が「ある」ことは toBeDefined。', "for (let i = 0; i < 3; i++) {\n  await button.trigger('click')\n}"],
        (c, b) => E(c, '④', (x) => hasE(x, (e) => e.m === 'toBeDefined') && hasE(x, (e) => e.m === 'toBe' && e.exp === '満席です')) && /for\s*\(|forEach/.test(b)),
      it_(2, '⑤', '入力欄で Enter を押しても予約される', "find('input') に trigger('keydown.enter') を送り、emitted('reserve') が 1 回と確かめる",
        "const wrapper = mount(ReservePanel, { props: { slots: 3 } })\nawait wrapper.find('input').trigger('keydown.enter')\nexpect(wrapper.emitted('reserve')).toHaveLength(1)",
        'ReservePanel.test.ts の ⑤ で、入力欄に Enter キーを送り、予約の通知を確かめる（emitted(\'reserve\') が 1 回）',
        ["trigger('keydown.enter') のように、イベント名にキー名を付けられる。", "await wrapper.find('input').trigger('keydown.enter')"],
        (c, b) => E(c, '⑤', (x) => hasE(x, (e) => e.m === 'toHaveLength' && e.exp === 1)) && /trigger\s*\(\s*['"]keydown\.enter/.test(b)),
      it_(3, '⑥', 'API の返事を flushPromises で待つ', "mount 直後は「確認中…」、await flushPromises() のあとは「確認済み」と、status の text() で確かめる",
        "const wrapper = mount(ReservePanel, { props: { slots: 3 } })\nconst status = wrapper.find('[data-test=\"status\"]')\nexpect(status.text()).toBe('確認中…')\nawait flushPromises()\nexpect(status.text()).toBe('確認済み')",
        'ReservePanel.test.ts の ⑥ で、flushPromises の前と後で表示を確かめる（text() が、前は「確認中…」、後は「確認済み」）',
        ['部品の中の Promise / タイマーが終わるのを待つのが flushPromises。前後で 2 回 expect する。', "expect(status.text()).toBe('確認中…')\nawait flushPromises()\nexpect(status.text()).toBe('確認済み')"],
        (c, b) => E(c, '⑥', (x) => hasE(x, (e) => e.exp === '確認中…') && hasE(x, (e) => e.exp === '確認済み')) && /await\s+flushPromises\s*\(\s*\)/.test(b)),
    ],
  });

  /* ============ 確かめる：BookingCard ============ */
  const BCARD = '<script setup lang="ts">\ndefineProps<{ title: string; urgent: boolean }>()\nconst emit = defineEmits<{ cancel: [id: number] }>()\n</script>\n\n<template>\n  <article class="card" :class="{ \'is-urgent\': urgent }" data-status="open">\n    <h3>{{ title }}</h3>\n    <span v-if="urgent" class="badge">急ぎ</span>\n    <button data-test="cancel" @click="emit(\'cancel\', 7)">取消</button>\n  </article>\n</template>\n';
  D[ID]['確かめる：expect と matcher'] = make({
    comp: 'BookingCard', desc: 'BookingCard（予約カード）', head: IM + "import BookingCard from '../BookingCard.vue'\n", vue: { 'BookingCard.vue': BCARD }, height: 470,
    its: [
      it_(1, '①', 'タイトルが表示される', "title を渡して mount し、text() に「未払い残業代の請求」が含まれると確かめる",
        "const wrapper = mount(BookingCard, { props: { title: '未払い残業代の請求', urgent: false } })\nexpect(wrapper.text()).toContain('未払い残業代の請求')",
        'BookingCard.test.ts の ① で、text() を読み、toContain で確かめる（「未払い残業代の請求」が含まれる）',
        ['text() で画面の文字を読む。一部を含むかは toContain。', "expect(wrapper.text()).toContain('未払い残業代の請求')"],
        (c, b) => E(c, '①', (x) => hasE(x, (e) => e.m === 'toContain' && /未払い残業代の請求/.test(ex(e)))) && /text\s*\(\s*\)/.test(b)),
      it_(1, '②', '急ぎのカードには is-urgent が付く', "urgent: true で mount し、classes() に 'is-urgent' が含まれると確かめる",
        "const wrapper = mount(BookingCard, { props: { title: '交通事故の示談', urgent: true } })\nexpect(wrapper.classes()).toContain('is-urgent')",
        'BookingCard.test.ts の ② で、classes() を読み、toContain で確かめる（urgent のとき is-urgent が含まれる）',
        ['classes() は class を配列で返す。配列に含まれるかも toContain。', "expect(wrapper.classes()).toContain('is-urgent')"],
        (c, b) => E(c, '②', (x) => hasE(x, (e) => e.m === 'toContain' && e.exp === 'is-urgent')) && /classes\s*\(/.test(b)),
      it_(1, '③', 'data-status 属性は open', "attributes('data-status') が「open」と等しいと toBe で確かめる",
        "const wrapper = mount(BookingCard, { props: { title: '相続の相談', urgent: false } })\nexpect(wrapper.attributes('data-status')).toBe('open')",
        'BookingCard.test.ts の ③ で、attributes(\'名前\') を読み、toBe で確かめる（data-status が「open」と等しい）',
        ["attributes('data-status') で属性の値を読む。文字がぴったり等しいかは toBe。", "expect(wrapper.attributes('data-status')).toBe('open')"],
        (c, b) => E(c, '③', (x) => hasE(x, (e) => e.m === 'toBe' && e.exp === 'open')) && /attributes\s*\(\s*['"]data-status/.test(b)),
      it_(2, '④', '急ぎでなければバッジは無い', "urgent: false で mount し、find('.badge').exists() が false と確かめる",
        "const wrapper = mount(BookingCard, { props: { title: '賃貸の敷金返還', urgent: false } })\nexpect(wrapper.find('.badge').exists()).toBe(false)",
        'BookingCard.test.ts の ④ で、無いことを確かめる（urgent が false のとき find(\'.badge\').exists() が false）',
        ['「無いこと」は find(...).exists() を toBe(false) で確かめる。', "expect(wrapper.find('.badge').exists()).toBe(false)"],
        (c, b) => E(c, '④', (x) => hasE(x, (e) => e.m === 'toBe' && e.exp === false)) && /find\s*\(\s*['"]\.badge/.test(b)),
      it_(2, '⑤', '渡した props を、まとめて確かめる', "props() が { title: '交通事故の示談', urgent: true } と等しいと toEqual で確かめる",
        "const wrapper = mount(BookingCard, { props: { title: '交通事故の示談', urgent: true } })\nexpect(wrapper.props()).toEqual({ title: '交通事故の示談', urgent: true })",
        'BookingCard.test.ts の ⑤ で、props() を読み、オブジェクトを toEqual で確かめる（title と urgent が渡した値と等しい）',
        ['オブジェクトや配列を中身で比べるのは toEqual（toBe は「同じ物か」を見るので ✖ になる）。', "expect(wrapper.props()).toEqual({ title: '…', urgent: true })"],
        (c, b) => E(c, '⑤', (x) => hasE(x, (e) => e.m === 'toEqual' && e.exp && e.exp.urgent === true && /交通事故/.test(e.exp.title))) && /props\s*\(\s*\)/.test(b)),
      it_(3, '⑥', '取消を押すと、cancel が [7] で通知される', "取消ボタンを trigger（await）し、emitted('cancel') が 1 回で、1 回目の中身が [7] と確かめる",
        "const wrapper = mount(BookingCard, { props: { title: '相続の相談', urgent: false } })\nawait wrapper.find('[data-test=\"cancel\"]').trigger('click')\nexpect(wrapper.emitted('cancel')).toHaveLength(1)\nexpect(wrapper.emitted('cancel')?.[0]).toEqual([7])",
        'BookingCard.test.ts の ⑥ で、emitted(\'cancel\') を読み、回数と中身を確かめる（1 回で、1 回目が [7] と等しい）',
        ["emitted('名前') は、emit された回数ぶんの配列。1 回目の引数は ?.[0]（引数の配列）。", "expect(wrapper.emitted('cancel')).toHaveLength(1)\nexpect(wrapper.emitted('cancel')?.[0]).toEqual([7])"],
        (c, b) => E(c, '⑥', (x) => hasE(x, (e) => e.m === 'toHaveLength' && e.exp === 1) && hasE(x, (e) => e.m === 'toEqual' && JSON.stringify(e.exp) === '[7]')) && /await[^\n]*trigger/.test(b) && /emitted\s*\(\s*['"]cancel/.test(b)),
    ],
  });

  /* ============ にせものを使う：SlotList ============ */
  const SLOTLIST = '<script setup lang="ts">\nconst props = defineProps<{ date: string; fetchSlots: (date: string) => Promise<string[]> }>()\nconst emit = defineEmits<{ select: [time: string] }>()\n\nconst times = ref<string[]>([])\nconst loading = ref(true)\nconst failed = ref(false)\n\nonMounted(async () => {\n  try {\n    times.value = await props.fetchSlots(props.date)\n  } catch (e) {\n    failed.value = true\n  }\n  loading.value = false\n})\n</script>\n\n<template>\n  <section>\n    <p v-if="loading" data-test="status">読み込み中…</p>\n    <p v-else-if="failed" data-test="status">通信に失敗しました</p>\n    <p v-else-if="times.length === 0" data-test="status">空きはありません</p>\n    <ul v-else>\n      <li v-for="t in times" :key="t" data-test="slot" @click="emit(\'select\', t)">{{ t }}</li>\n    </ul>\n  </section>\n</template>\n';
  const HEAD_M = "import { describe, it, expect, vi } from 'vitest'\nimport { mount, flushPromises } from '@vue/test-utils'\nimport SlotList from '../SlotList.vue'\n\nconst date = '2025-04-01'\n";
  D[ID]['にせものを使う：vi.fn と vi.mock'] = make({
    comp: 'SlotList', desc: 'SlotList（空き時間の一覧）', head: HEAD_M, vue: { 'SlotList.vue': SLOTLIST }, height: 480,
    its: [
      it_(1, '①', '取得した時間が一覧に出る', "vi.fn().mockResolvedValue(['10:00', '11:00']) のにせものを props で渡し、flushPromises のあと li が 2 つと確かめる",
        "const fetchSlots = vi.fn().mockResolvedValue(['10:00', '11:00'])\nconst wrapper = mount(SlotList, { props: { date, fetchSlots } })\nawait flushPromises()\nexpect(wrapper.findAll('li')).toHaveLength(2)",
        'SlotList.test.ts の ① で、vi.fn のにせもの API を渡して mount し、一覧を確かめる（flushPromises のあと li が 2 つ）',
        ["vi.fn().mockResolvedValue(値) は「await すると値が返る」にせもの関数。props で渡し、返事を待つために flushPromises。", "const fetchSlots = vi.fn().mockResolvedValue(['10:00', '11:00'])"],
        (c, b) => E(c, '①', (x) => hasE(x, (e) => e.m === 'toHaveLength' && e.exp === 2)) && /vi\.fn\s*\([^)]*\)\s*\.mockResolvedValue/.test(b) && /await\s+flushPromises/.test(b)),
      it_(1, '②', '日付つきで呼ばれる', "mount のあと、fetchSlots が date（2025-04-01）で呼ばれたと toHaveBeenCalledWith で確かめる",
        "const fetchSlots = vi.fn().mockResolvedValue([])\nmount(SlotList, { props: { date, fetchSlots } })\nexpect(fetchSlots).toHaveBeenCalledWith('2025-04-01')",
        'SlotList.test.ts の ② で、にせもの関数の呼ばれ方を確かめる（fetchSlots が「2025-04-01」で呼ばれた）',
        ['vi.fn() は、呼ばれた引数を覚えている。toHaveBeenCalledWith(引数) で確かめる。', "expect(fetchSlots).toHaveBeenCalledWith('2025-04-01')"],
        (c, b) => E(c, '②', (x) => hasE(x, (e) => e.m === 'toHaveBeenCalledWith' && JSON.stringify(e.exp) === '["2025-04-01"]'))),
      it_(1, '③', '通信は 1 回だけ', "mount のあと、fetchSlots が 1 回だけ呼ばれたと toHaveBeenCalledTimes で確かめる",
        "const fetchSlots = vi.fn().mockResolvedValue([])\nmount(SlotList, { props: { date, fetchSlots } })\nexpect(fetchSlots).toHaveBeenCalledTimes(1)",
        'SlotList.test.ts の ③ で、にせもの関数の呼ばれた回数を確かめる（fetchSlots が 1 回）',
        ['回数は toHaveBeenCalledTimes(回数)。多すぎる通信も見つけられる。', "expect(fetchSlots).toHaveBeenCalledTimes(1)"],
        (c, b) => E(c, '③', (x) => hasE(x, (e) => e.m === 'toHaveBeenCalledTimes' && e.exp === 1))),
      it_(2, '④', '空きが無いときの表示', "mockResolvedValue([]) で mount し、flushPromises のあと status の text() が「空きはありません」と確かめる",
        "const fetchSlots = vi.fn().mockResolvedValue([])\nconst wrapper = mount(SlotList, { props: { date, fetchSlots } })\nawait flushPromises()\nexpect(wrapper.find('[data-test=\"status\"]').text()).toBe('空きはありません')",
        'SlotList.test.ts の ④ で、空の返事のときの画面を確かめる（status の text() が「空きはありません」と等しい）',
        ['返事を [] にしたにせものを渡す。返事が画面に出るまで flushPromises で待つ。', "mockResolvedValue([])"],
        (c, b) => E(c, '④', (x) => hasE(x, (e) => e.m === 'toBe' && e.exp === '空きはありません')) && /mockResolvedValue\s*\(\s*\[\s*\]\s*\)/.test(b) && /await\s+flushPromises/.test(b)),
      it_(2, '⑤', '通信が失敗したときの表示', "mockRejectedValue(new Error('timeout')) で mount し、flushPromises のあと status の text() が「通信に失敗しました」と確かめる",
        "const fetchSlots = vi.fn().mockRejectedValue(new Error('timeout'))\nconst wrapper = mount(SlotList, { props: { date, fetchSlots } })\nawait flushPromises()\nexpect(wrapper.find('[data-test=\"status\"]').text()).toBe('通信に失敗しました')",
        'SlotList.test.ts の ⑤ で、失敗する API のにせものを渡して画面を確かめる（status の text() が「通信に失敗しました」と等しい）',
        ['失敗を再現するのが mockRejectedValue(エラー)。本物の通信では、わざと失敗させにくい。', "vi.fn().mockRejectedValue(new Error('timeout'))"],
        (c, b) => E(c, '⑤', (x) => hasE(x, (e) => e.m === 'toBe' && e.exp === '通信に失敗しました')) && /mockRejectedValue\s*\(/.test(b) && /await\s+flushPromises/.test(b)),
      it_(3, '⑥', '時間を選ぶと、コールバックが呼ばれる', "onSelect = vi.fn() を props で渡し、最初の li を trigger（await）して、onSelect が「10:00」で呼ばれたと確かめる",
        "const fetchSlots = vi.fn().mockResolvedValue(['10:00', '11:00'])\nconst onSelect = vi.fn()\nconst wrapper = mount(SlotList, { props: { date, fetchSlots, onSelect } })\nawait flushPromises()\nawait wrapper.find('[data-test=\"slot\"]').trigger('click')\nexpect(onSelect).toHaveBeenCalledWith('10:00')",
        'SlotList.test.ts の ⑥ で、vi.fn を onSelect として渡し、選択の通知を確かめる（onSelect が「10:00」で呼ばれた）',
        ['emit(\'select\') は、props の onSelect で受け取れる。vi.fn() を渡せば、emit の引数が記録される。', "const onSelect = vi.fn()\nmount(SlotList, { props: { date, fetchSlots, onSelect } })"],
        (c, b) => E(c, '⑥', (x) => hasE(x, (e) => e.m === 'toHaveBeenCalledWith' && JSON.stringify(e.exp) === '["10:00"]')) && /onSelect\s*=\s*vi\.fn/.test(b) && /await[^\n]*trigger/.test(b)),
    ],
  });
})();
