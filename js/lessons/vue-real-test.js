/* vue-test 実例：バグ物語 green → red → green ／ 何をテストする？ */
(function () {
  'use strict';
  const K = window.KENSHU;
  const wait = (n) => { if (!K || !K.lessons || !K.lessons['vue-test']) { if (n > 0) setTimeout(() => wait(n - 1), 100); return; } init(); };
  wait(100);

  function init() {
    const { h, code, style, sleep } = K.W;
    const L = K.lessons['vue-test'];
    if (L.scenes.some((s) => s.t === '実例：リファクタでテストが赤くなる')) return;

    style('vslHot', '[data-k].vs-hot{outline:2px solid var(--c,#2f7bff)!important;outline-offset:2px;background-color:color-mix(in srgb,var(--c,#2f7bff) 14%,transparent)}');
    style('vrT', `
    .vrT-eq{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;align-items:start;position:relative}
    @media(max-width:980px){.vrT-eq{grid-template-columns:1fr}.vrT-arrow{display:none}}
    .vrT-col{display:grid;gap:12px;min-width:0}
    .vrT-card{border:2px solid var(--line);background:var(--card);border-radius:14px;padding:12px;display:grid;gap:8px;min-width:0;transition:border-color .3s}
    .vrT-card.red{border-color:var(--bad)}.vrT-card.green{border-color:var(--ok)}
    .vrT-hd{display:flex;align-items:center;gap:8px;font:900 .8rem var(--font);color:var(--mute)}
    .vrT-hd .sp{flex:1}
    .vrT-badge{font:900 .78rem var(--mono);padding:.2em .8em;border-radius:99px;background:var(--line);color:var(--mute);transition:.3s}
    .vrT-badge.green{background:var(--ok);color:#052e16}.vrT-badge.red{background:var(--bad);color:#fff}
    .vrT-ui{display:grid;gap:8px;padding:12px;border-radius:10px;background:var(--card2);border:1px dashed var(--line);transition:opacity .4s}
    .vrT-ui input{font:600 .95rem var(--mono);padding:.55em .8em;border-radius:8px;border:2px solid var(--line);background:var(--card);color:inherit;min-width:0}
    .vrT-ui input:focus{outline:none;border-color:var(--vue)}
    .vrT-err{color:var(--bad);font-weight:800;font-size:.82rem;min-height:1.3em}
    .vrT-btn{font:900 .95rem var(--font);padding:.6em 1em;border-radius:10px;border:0;background:var(--vue);color:#04130c!important;opacity:1;cursor:pointer;transition:background .25s;position:relative}
    .vrT-btn:disabled{background:var(--line);color:var(--mute)!important;cursor:not-allowed}
    .vrT-pulse{outline:3px solid var(--vue);outline-offset:2px;animation:vrT-p .7s ease-out}
    @keyframes vrT-p{0%{outline-offset:8px;outline-color:transparent}100%{outline-offset:2px}}
    .vrT-leak{font:800 .8rem var(--font);color:var(--bad);min-height:1.2em}
    .vrT-test{display:flex;align-items:center;gap:8px;font:700 .85rem var(--mono);padding:.35em .5em;border-radius:8px}
    .vrT-test i{font-style:normal;width:1.2em;text-align:center;font-weight:900}
    .vrT-test.ok i{color:var(--ok)}.vrT-test.ng{background:color-mix(in srgb,var(--bad) 14%,transparent)}.vrT-test.ng i{color:var(--bad)}
    .vrT-test.run i{color:var(--team);animation:vrT-s 1s linear infinite;display:inline-block}
    @keyframes vrT-s{to{transform:rotate(360deg)}}
    .vrT-out{font:600 .78rem/1.6 var(--mono);background:var(--code);color:#d8dcff;border-radius:8px;padding:.6em .9em;border-left:3px solid var(--bad);white-space:pre-wrap;animation:vrT-in .4s}
    .vrT-out .ex{color:var(--ok)}.vrT-out .rc{color:#ff8f9a}.vrT-out .hd{color:#ff8f9a;font-weight:900}
    @keyframes vrT-in{from{opacity:0;transform:translateY(-6px)}}
    pre.code .ln.cur::before{content:"▶";position:absolute;margin-left:-1.05em;color:var(--vue);animation:vrT-b .6s infinite alternate}
    @keyframes vrT-b{to{opacity:.3}}
    pre.code .ln{position:relative}
    pre.code .ln.add{background:color-mix(in srgb,var(--ok) 22%,transparent);border-left-color:var(--ok);opacity:1}
    pre.code.dim .ln.err{opacity:1}
    .vrT-card pre.code{max-width:100%;box-sizing:border-box;overflow-x:auto;margin:0}
    .vrT-ctl{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .vrT-ctl .btn{min-height:44px;padding:0 1.2em}
    .vrT-dots{display:flex;gap:6px;margin-left:auto;flex-wrap:wrap}
    .vrT-dot{font:900 .8rem var(--font);min-height:36px;display:inline-flex;align-items:center;padding:0 .9em;border-radius:99px;border:2px solid var(--line);color:var(--mute);background:var(--card);cursor:pointer}
    .vrT-dot.on{border-color:var(--vue);color:var(--vue)}.vrT-dot.red.on{border-color:var(--bad);color:var(--bad)}
    .vrT-arrow{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;z-index:5}
    .vrT-arrow path{fill:none;stroke:var(--bad);stroke-width:3;stroke-dasharray:600;stroke-dashoffset:600;animation:vrT-d .8s ease forwards;filter:drop-shadow(0 0 5px var(--bad))}
    @keyframes vrT-d{to{stroke-dashoffset:0}}
    .vrT-lbl{font:900 .8rem var(--font);padding:.15em .8em;border-radius:99px;width:max-content}
    .vrT-lbl.d{background:var(--bad);color:#fff}.vrT-lbl.a{background:var(--ok);color:#052e16}
    /* scene 2 */
    .vrT-g{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px 16px;align-items:stretch}
    @media(max-width:980px){.vrT-g{grid-template-columns:1fr}}
    .vrT-cell{border:2px solid var(--line);border-radius:12px;padding:10px;display:grid;gap:6px;background:var(--card);min-width:0;align-content:start;transition:border-color .3s}
    .vrT-cell.bad{border-color:color-mix(in srgb,var(--bad) 55%,var(--line))}.vrT-cell.good{border-color:color-mix(in srgb,var(--ok) 55%,var(--line))}
    .vrT-cell.bad.red{border-color:var(--bad)}
    .vrT-st{font:900 .82rem var(--mono);display:flex;gap:6px;align-items:center;min-height:1.4em}
    .vrT-st.ok{color:var(--ok)}.vrT-st.ng{color:var(--bad)}
    .vrT-why{font:800 .8rem var(--font);color:var(--mute)}
    .vrT-cell pre.code{margin:0;font-size:.74rem;overflow-x:auto}
    `);

    const C = 'var(--vue)';
    const RE = /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/;

    const TEST = `import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SubmitButton from './SubmitButton.vue'

describe('SubmitButton', () => {
  it('メールが不正なら送信ボタンは押せない', async () => {
    const wrapper = mount(SubmitButton)
    const input = wrapper.find('input[type="email"]')
    await input.setValue('tanaka@')
    const button = wrapper.find('button')
    expect(button.element.disabled).toBe(true)
  })
})`;
    const L_MOUNT = 7, L_INPUT = 8, L_SET = 9, L_BTN = 10, L_EXP = 11;

    const SRC_HEAD = `<script setup lang="ts">
const email = ref('')
const isValid = computed(() => EMAIL_RE.test(email.value))
</script>

<template>
  <input v-model="email" type="email" />
  <p v-if="email && !isValid">形式が正しくありません</p>`;
    const BTN_OK = `  <button :disabled="!isValid">相談を申し込む</button>`;
    const BTN_NG = `  <button :disabled="!email">相談を申し込む</button>`;
    const SRC_TAIL = `</template>`;
    // 状態ごとの [テキスト, ハイライト行, クラス]
    const SRC = {
      orig: [`${SRC_HEAD}\n${BTN_OK}\n${SRC_TAIL}`, [], 'on'],
      diff: [`${SRC_HEAD}\n- ${BTN_OK.slice(2)}\n+ ${BTN_NG.slice(2)}\n${SRC_TAIL}`, [], ''],
      bad: [`${SRC_HEAD}\n${BTN_NG}\n${SRC_TAIL}`, [9], 'err'],
      fixed: [`${SRC_HEAD}\n${BTN_OK}\n${SRC_TAIL}`, [9], 'add'],
    };

    /* ================= ① バグ物語 ================= */
    function story() {
      let buggy = false, token = 0, step = 0, srcState = 'orig', verdict = null;

      /* 左：ミニUI + ソース */
      const inp = h('input', { 'data-k': 'email', type: 'email', placeholder: 'tanaka@example.com', 'aria-label': 'メールアドレス' });
      const err = h('div', { class: 'vrT-err', 'data-k': 'err' });
      const btn = h('button', { class: 'vrT-btn', 'data-k': 'btn' }, '相談を申し込む');
      const leak = h('div', { class: 'vrT-leak', 'data-k': 'btn' });
      const ui = h('div', { class: 'vrT-ui' }, inp, err, btn, leak);
      function paintUI() {
        const v = inp.value, valid = RE.test(v);
        err.textContent = v && !valid ? '⚠ 形式が正しくありません' : '';
        btn.disabled = buggy ? !v : !valid;
        leak.textContent = buggy && v && !valid ? '← 不正なメールでも押せてしまう！' : '';
      }
      inp.addEventListener('input', paintUI);
      btn.addEventListener('click', () => { if (!btn.disabled) { btn.textContent = '送信しました ✓'; setTimeout(() => { btn.textContent = '相談を申し込む'; }, 900); } });
      const uiHd = h('div', { class: 'vrT-hd' }, '🖥 SubmitButton.vue の実際の動き', h('span', { class: 'sp' }), h('span', { class: 'vrT-lbl', style: { display: 'none' } }));
      const uiCard = h('div', { class: 'vrT-card' }, uiHd, ui);
      const srcBox = h('div');
      const srcCard = h('div', { class: 'vrT-card' }, h('div', { class: 'vrT-hd' }, '📄 SubmitButton.vue'), srcBox);
      let srcPre, testPre, curLine = 0, curCls = '';
      const sp = { get lines() { return srcPre.lines; }, setHi(a, c) { srcPre.setHi(a, c); } };
      const tp = { get lines() { return testPre.lines; }, setHi(a, c) { testPre.setHi(a, c); } };
      const MAPS = { email: ['const email', 'v-model="email"'], err: ['v-if="email', 'const isValid'], btn: [':disabled'] };
      const MAPT = { case: ["it('メールが不正なら"], res: ['expect(button.element'] };
      function paintSrc() {
        const [t, hi, cls] = SRC[srcState];
        srcPre = code(t, 'vue', { edit: false, dim: srcState === 'diff', color: 'var(--ok)', file: null });
        if (srcState === 'diff') {
          srcPre.setHi([9], 'err'); srcPre.setHi([10], 'add');
          srcPre.dim = true;
        } else if (cls) srcPre.setHi(hi, cls);
        srcBox.replaceChildren(srcPre);
        K.vs.link(uiCard, sp, MAPS);
      }

      /* 右：テストファイル + CI */
      const testBox = h('div');
      function paintTest(line, cls) {
        curLine = line; curCls = cls;
        testPre = code(TEST, 'ts', { edit: false, dim: true, color: C, file: 'SubmitButton.test.ts' });
        if (line) { testPre.setHi([line], cls === 'err' ? 'err' : 'on'); if (cls !== 'err') testPre.setHi([line], 'cur'); }
        testBox.replaceChildren(testPre);
        K.vs.link(stage, tp, MAPT, { rest: () => (curLine && curCls !== 'err' ? [curLine] : []) });
      }
      const names = ['メールが正しければ送信ボタンを押せる', 'メールが不正なら送信ボタンは押せない', '送信すると submit が emit される'];
      const rows = names.map((n, i) => h('div', Object.assign({ class: 'vrT-test' }, i === 1 ? { 'data-k': 'case' } : {}), h('i'), n));
      const outBox = h('div');
      const badge = h('span', { class: 'vrT-badge', 'data-k': 'res' }, '待機中');
      const ciCard = h('div', { class: 'vrT-card' }, h('div', { class: 'vrT-hd' }, '🧪 vitest', h('span', { class: 'sp' }), badge), ...rows, outBox);
      function paintCI(states) { // 'ok' | 'ng' | 'run' | ''
        rows.forEach((r, i) => { const s = states[i] || ''; r.className = 'vrT-test ' + s; r.firstChild.textContent = s === 'ok' ? '✓' : s === 'ng' ? '✖' : s === 'run' ? '◌' : '○'; });
        const bad = states.includes('ng'), run = states.includes('run') || !states.length, good = states.length && states.every((s) => s === 'ok');
        badge.className = 'vrT-badge ' + (bad ? 'red' : good ? 'green' : '');
        badge.textContent = bad ? 'RED  2 passed / 1 failed' : good ? 'GREEN  3 passed' : run && states.length ? '実行中…' : '待機中';
        ciCard.className = 'vrT-card ' + (bad ? 'red' : good ? 'green' : '');
      }
      function showOut(on) {
        outBox.replaceChildren(...(on ? [h('div', { class: 'vrT-out', 'data-k': 'res', html: `<span class="hd">FAIL</span>  SubmitButton.test.ts:11\nAssertionError: expected false to be true\n<span class="ex">- Expected:  true</span>\n<span class="rc">+ Received: false</span>\n ❯ expect(button.element.disabled).toBe(true)` })] : []));
      }

      const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      arrow.setAttribute('class', 'vrT-arrow');
      const stage = h('div', { class: 'vrT-eq' }, h('div', { class: 'vrT-col' }, uiCard, srcCard), h('div', { class: 'vrT-col' }, testBox, ciCard), arrow);
      function drawArrow(on) {
        arrow.replaceChildren();
        if (!on) return;
        requestAnimationFrame(() => {
          const sr = stage.getBoundingClientRect(), a = testPre.lines[L_EXP - 1].getBoundingClientRect(), b = srcPre.lines[8].getBoundingClientRect();
          const x1 = a.left - sr.left + 4, y1 = a.top - sr.top + a.height / 2, x2 = b.left - sr.left + 240, y2 = b.top - sr.top + b.height / 2;
          const NS = 'http://www.w3.org/2000/svg';
          const mk = (t, at) => { const e = document.createElementNS(NS, t); for (const k in at) e.setAttribute(k, at[k]); return e; };
          const defs = mk('defs', {}), mr = mk('marker', { id: 'vrTm', markerUnits: 'userSpaceOnUse', markerWidth: 14, markerHeight: 14, refX: 12, refY: 7, orient: 'auto' });
          mr.append(mk('path', { d: 'M0,1 L13,7 L0,13 z', style: 'fill:var(--bad);stroke:none;animation:none;filter:none;stroke-dasharray:0' }));
          defs.append(mr);
          const path = mk('path', { d: `M${x1},${y1} C${x1 - 70},${y1} ${x2 + 70},${y2} ${x2 + 6},${y2}`, 'marker-end': 'url(#vrTm)' });
          arrow.append(defs, path);
        });
      }

      async function runTest(tk) {
        const live = () => tk === token;
        const mark = async (l) => { if (!live()) return false; paintTest(l); await sleep(620); return live(); };
        inp.value = ''; paintUI(); ui.style.opacity = '.25'; paintTest(0);
        paintCI(['run', 'run', 'run']);
        if (!(await mark(L_MOUNT))) return; ui.style.opacity = '1';
        if (!(await mark(L_INPUT))) return; inp.classList.remove('vrT-pulse'); void inp.offsetWidth; inp.classList.add('vrT-pulse');
        if (!(await mark(L_SET))) return;
        for (const ch of 'tanaka@') { inp.value += ch; paintUI(); await sleep(90); if (!live()) return; }
        if (!(await mark(L_BTN))) return; btn.classList.remove('vrT-pulse'); void btn.offsetWidth; btn.classList.add('vrT-pulse');
        await sleep(300); if (!live()) return;
        paintTest(L_EXP); await sleep(700); if (!live()) return;
        const pass = btn.disabled === true;
        paintTest(L_EXP, pass ? 'on' : 'err');
        if (!pass) { testPre.setHi([L_EXP], 'err'); }
        paintCI(['ok', pass ? 'ok' : 'ng', 'ok']);
        showOut(!pass);
        drawArrow(!pass);
        if (pass) testPre.setHi([L_EXP], 'add');
      }

      function reset() { token++; verdict = null; showOut(false); drawArrow(false); }
      function go(i) {
        step = i; reset(); const tk = token;
        dots.forEach((d, k) => d.classList.toggle('on', k === i));
        next.textContent = i >= 3 ? '最初から ↺' : '次へ ▶';
        if (i === 0) { buggy = false; srcState = 'orig'; paintSrc(); runTest(tk); }
        if (i === 1) { srcState = 'diff'; paintSrc(); paintTest(0); paintCI(['ok', 'ok', 'ok']); ui.style.opacity = '1'; }
        if (i === 2) { buggy = true; srcState = 'bad'; paintSrc(); runTest(tk); }
        if (i === 3) { buggy = false; srcState = 'fixed'; paintSrc(); runTest(tk); }
      }
      const labels = ['① green', '② リファクタ', '③ red', '④ 直して green'];
      const dots = labels.map((l, i) => h('button', { class: 'vrT-dot' + (i === 2 ? ' red' : ''), onclick: () => go(i) }, l));
      const next = h('button', { class: 'btn', onclick: () => go(step >= 3 ? 0 : step + 1) }, '次へ ▶');
      const replay = h('button', { class: 'btn ghost', onclick: () => go(step) }, '↻ もう一度流す');
      const ctl = h('div', { class: 'vrT-ctl' }, next, replay, h('div', { class: 'vrT-dots' }, ...dots));
      paintSrc(); paintTest(0); paintCI([]);
      const root = h('div', { class: 'col', style: { gap: '12px' } }, ctl, stage);
      setTimeout(() => go(0), 100);
      return root;
    }

    /* ================= ② 何をテストする？ ================= */
    function whatToTest() {
      const pairs = [
        { bad: `it('送信ボタンがある', () => {\n  expect(wrapper.find('.btn.btn-primary.mt-4').exists()).toBe(true)\n})`, good: `it('送信ボタンがある', () => {\n  expect(wrapper.find('[data-test="submit"]').exists()).toBe(true)\n})`, why: ['class 名に依存', '役割（data-test）で探す'] },
        { bad: `it('メールが不正だと無効', async () => {\n  await input.setValue('tanaka@')\n  expect(wrapper.vm.isValid).toBe(false)\n})`, good: `it('メールが不正だと無効', async () => {\n  await input.setValue('tanaka@')\n  expect(button.element.disabled).toBe(true)\n})`, why: ['内部の変数を見ている', '利用者に見える結果を見る'] },
        { bad: `it('エラーが出る', async () => {\n  await input.setValue('tanaka@')\n  expect(wrapper.find('p').text()).toBe('形式が正しくありません')\n})`, good: `it('エラーが出る', async () => {\n  await input.setValue('tanaka@')\n  expect(wrapper.find('[data-test="email-error"]').exists()).toBe(true)\n})`, why: ['文言を丸ごと固定', '出ている事実だけ確認'] },
      ];
      let changed = false;
      const cells = [];
      const grid = h('div', { class: 'vrT-g' },
        h('div', { class: 'vrT-lbl d' }, '✖ 壊れやすいテスト'), h('div', { class: 'vrT-lbl a' }, '✓ 良いテスト'));
      pairs.forEach((p, pi) => {
        const mkc = (kind, src, why) => {
          const pre = code(src, 'ts', { edit: false, dim: true, color: kind === 'bad' ? 'var(--team)' : 'var(--ok)' });
          const st = h('div', { class: 'vrT-st ok' }, '✓ passed');
          const c = h('div', { class: 'vrT-cell ' + kind }, pre, h('div', { class: 'vrT-why' }, why), st);
          const lines = src.split('\n'), ln = lines.length - 1;
          const whyTok = [['.btn.btn-primary', 'data-test="submit"'], ['wrapper.vm.isValid', 'button.element.disabled'], ["toBe('形式", 'email-error']][pi][kind === 'bad' ? 0 : 1];
          st.setAttribute('data-k', 'st'); c.querySelector('.vrT-why').setAttribute('data-k', 'why');
          cells.push({ kind, c, pre, st, line: ln });
          K.vs.link(c, pre, { why: [whyTok], st: ["it('", 'expect('] }, { rest: () => (changed && kind === 'bad' ? [] : [ln]) });
          return c;
        };
        grid.append(mkc('bad', p.bad, p.why[0]), mkc('good', p.good, p.why[1]));
      });
      function paint() {
        cells.forEach((o) => {
          const ng = changed && o.kind === 'bad';
          o.pre.setHi([o.line], ng ? 'err' : 'on');
          o.pre.setHi(ng ? [] : [], ng ? 'on' : 'err');
          o.c.classList.toggle('red', ng);
          o.st.className = 'vrT-st ' + (ng ? 'ng' : 'ok');
          o.st.textContent = ng ? '✖ failed（動作は同じなのに）' : '✓ passed';
        });
        sw.textContent = changed ? '↺ 元に戻す' : '🎨 デザインを変える（class 名・文言・内部実装）';
      }
      const sw = h('button', { class: 'btn', onclick: () => { changed = !changed; paint(); } });
      paint();
      return h('div', { class: 'col', style: { gap: '12px' } }, h('div', { class: 'vrT-ctl' }, sw), grid);
    }

    L.scenes.push(
      { t: '実例：リファクタでテストが赤くなる', tag: '実例', lead: '「ちょっと整理」で壊れた挙動を、<b>テストが見つけてくれる</b>。', render(el) { el.append(story()); } },
      { t: '実例：何をテストする？', tag: '実例', lead: '見た目の作りでなく、<b>利用者に見える結果</b>を確かめる。', render(el) { el.append(whatToTest()); } }
    );
  }
})();
