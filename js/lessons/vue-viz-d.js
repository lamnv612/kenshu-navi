/* vue-viz-d：vue-basics / vue-intro / vue-env の図解シーン
   （画面＋コード＋アニメーション。選択肢を押すとデータが流れ、該当部分が光る） */
(function () {
  'use strict';
  const K = window.KENSHU;
  const done = {};
  let tries = 0;
  (function wait() {
    if (K && K.lessons && K.W) {
      if (K.lessons['vue-basics'] && !done.b) { done.b = 1; basics(); }
    }
    if (!done.b && ++tries < 300) setTimeout(wait, 50);
  })();

  const CIRC = '①②③④⑤⑥';

  /* ---------- 共通部品 ---------- */
  function kit() {
    const { h, code, style } = K.W;
    style('vzD', `
    .vzD-wrap{display:grid;gap:12px}
    .vzD-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
    .vzD-col{display:grid;gap:12px;min-width:0;align-content:start}
    .vzD-lb{font:900 .9rem var(--font);color:var(--mute);letter-spacing:.04em}
    .vzD-pg{position:relative;background:#f4f6fb;color:#223;border-radius:14px;padding:14px;display:grid;gap:12px;min-width:0}
    .vzD-hd{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:10px;background:#1d2b53;color:#fff;font-weight:900;font-size:1rem}
    .vzD-hd small{font-weight:700;opacity:.8;font-size:.85rem}
    .vzD-r{position:relative;border-radius:10px;outline:2px dashed transparent;outline-offset:3px;transition:outline-color .2s,background .2s}
    .vzD-r.cur{outline-color:var(--ts);background:color-mix(in srgb,var(--ts) 10%,transparent);animation:vzDp 1.4s ease-in-out infinite}
    .vzD-r.ok{outline:2px solid var(--ok);background:color-mix(in srgb,var(--ok) 12%,transparent);animation:none}
    @keyframes vzDp{50%{outline-color:transparent}}
    .vzD-pin{position:absolute;top:-11px;right:-8px;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;background:#8a93ad;color:#fff;font:900 .9rem var(--font);cursor:pointer;z-index:2;transition:.2s}
    .vzD-pin.cur{background:var(--ts);transform:scale(1.2);box-shadow:0 0 0 4px color-mix(in srgb,var(--ts) 30%,transparent)}
    .vzD-pin.ok{background:var(--ok);transform:none;box-shadow:none}
    .vzD-pkt{position:absolute;left:0;top:0;z-index:9;padding:.25em .9em;border-radius:99px;color:#06101f;font:900 .9rem var(--mono);box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap}
    .vzD-bump{animation:vzDb .7s}@keyframes vzDb{30%{transform:scale(1.1);box-shadow:0 0 0 5px color-mix(in srgb,var(--ok) 45%,transparent)}}
    .vzD-bad{animation:vzDx .5s}@keyframes vzDx{25%{transform:translateX(-6px);box-shadow:0 0 0 4px color-mix(in srgb,var(--bad) 50%,transparent)}75%{transform:translateX(6px)}}
    .vzD-st{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:9px 12px;border-radius:10px;background:#e7efff;border:2px solid var(--ts);color:#1d2b53;font:800 .95rem var(--mono)}
    .vzD-st .who{font:900 .9rem var(--font);color:var(--ts)}
    .vzD-st b{color:#2f6df0;padding:.1em .5em;border-radius:6px;background:#fff;transition:.2s}
    .vzD-btn{border:0;border-radius:10px;padding:.65em 1.3em;background:#2f7bff;color:#fff;font:900 1rem var(--font);cursor:pointer}
    .vzD-btn:hover{filter:brightness(1.1)}
    .vzD-dots{display:flex;gap:8px;align-items:center}
    .vzD-dots i{width:14px;height:14px;border-radius:50%;background:var(--line);cursor:pointer;transition:.2s}
    .vzD-dots i.cur{background:var(--ts);transform:scale(1.3)}.vzD-dots i.ok{background:var(--ok)}
    .vzD-dots span{margin-left:8px;font:900 .95rem var(--mono);color:var(--mute)}
    .vzD-q{border:2px solid var(--ts);border-radius:14px;background:var(--card);padding:16px 18px;display:grid;gap:12px}
    .vzD-q.shake{animation:vzDs .35s}@keyframes vzDs{25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
    .vzD-qh{display:flex;gap:10px;align-items:center}.vzD-qh .n{width:30px;height:30px;border-radius:50%;background:var(--ts);color:#06101f;display:grid;place-items:center;font:900 1rem var(--font)}
    .vzD-qh b{font:900 1.05rem var(--font)}
    .vzD-qt{font:800 1.25rem/1.6 var(--font)}
    .vzD-ans{display:grid;gap:10px}
    .vzD-a{display:grid;gap:2px;justify-items:center;padding:.8em .5em;border-radius:12px;border:2px solid var(--c);background:transparent;color:var(--c);cursor:pointer;transition:.15s}
    .vzD-a b{font:900 1.1rem var(--font)}.vzD-a.mono b{font-family:var(--mono);font-size:1rem}.vzD-a small{font:700 .85rem var(--font);opacity:.85}
    .vzD-a:hover{background:color-mix(in srgb,var(--c) 16%,transparent)}
    .vzD-a.on{background:var(--c);color:#06101f}
    .vzD-a.x{opacity:.4;text-decoration:line-through}
    .vzD-fb{font:800 1rem/1.6 var(--font);color:var(--mute);min-height:1.6em}
    .vzD-fb.ok{color:var(--ok)}.vzD-fb.ng{color:var(--bad)}
    pre.code .ln.vzD-fl{background:color-mix(in srgb,var(--ok) 32%,transparent);border-left-color:var(--ok)}
    `);

    /* 問題パネル＋コード。cfg: { Q:[{who,t,opts:[{k,label,small,color,mono}],ans,fill,ph,why,ng:{k:msg}}], src, file, cols, onCorrect(i,k), onWrong(i,k), onCur(i) } */
    function quiz(cfg) {
      const Q = cfg.Q, solved = Q.map(() => false);
      let cur = 0;
      const qBox = h('div', { class: 'vzD-q' }), codeHost = h('div'), dots = h('div', { class: 'vzD-dots' });
      const api = { qBox, codeHost, dots, solved, Q, get cur() { return cur; }, pre: null };
      const SRC = () => cfg.src.replace(/⟦(\d)⟧/g, (_, i) => (solved[i] ? Q[i].fill : Q[i].ph));
      const draw = () => {
        const q = Q[cur];
        qBox.replaceChildren(
          h('div', { class: 'vzD-qh' }, h('span', { class: 'n' }, CIRC[cur]), h('b', q.who)),
          h('div', { class: 'vzD-qt' }, q.t),
          h('div', { class: 'vzD-ans', style: { gridTemplateColumns: 'repeat(' + (cfg.cols || q.opts.length) + ',minmax(0,1fr))' } }, ...q.opts.map((o) => {
            const b = h('button', { class: 'vzD-a' + (o.mono ? ' mono' : '') + (solved[cur] && o.k === q.ans ? ' on' : ''), style: { '--c': o.color } }, h('b', o.label), o.small ? h('small', o.small) : null);
            b.onclick = () => answer(o.k, b); return b;
          })),
          h('div', { class: 'vzD-fb' + (solved[cur] ? ' ok' : '') }, solved[cur] ? '✓ ' + q.why : CIRC[cur] + ' の場所を見て、選ぼう'));
        const src = SRC();
        const np = code(src, 'vue', { color: 'var(--ts)', file: cfg.file, dim: true, edit: false });
        const needle = solved[cur] ? q.fill : q.ph;
        np.setHi([src.split('\n').findIndex((l) => l.includes(needle)) + 1], 'on');
        codeHost.replaceChildren(np); api.pre = np;
      };
      const paint = () => {
        dots.replaceChildren(...Q.map((_, i) => h('i', { class: (solved[i] ? 'ok ' : '') + (i === cur ? 'cur' : ''), onclick: () => { cur = i; paint(); } })), h('span', solved.every(Boolean) ? '🎉 ぜんぶ OK' : solved.filter(Boolean).length + ' / ' + Q.length));
        cfg.onCur && cfg.onCur(cur, solved);
        draw();
      };
      const answer = (k, b) => {
        const q = Q[cur];
        if (solved[cur]) return;
        if (k === q.ans) {
          solved[cur] = true; paint(); cfg.onCorrect(cur, k);
          const nx = solved.findIndex((v) => !v);
          const at = cur; if (nx >= 0) setTimeout(() => { if (cur === at) { cur = nx; paint(); } }, 3000);
        } else {
          b.classList.add('x');
          const fb = qBox.querySelector('.vzD-fb'); fb.className = 'vzD-fb ng'; fb.textContent = '✖ ' + (q.ng[k] || 'ちがう');
          qBox.classList.remove('shake'); void qBox.offsetWidth; qBox.classList.add('shake');
          cfg.onWrong && cfg.onWrong(cur, k);
        }
      };
      api.paint = paint;
      api.setCur = (i) => { cur = i; paint(); };
      api.reset = () => { solved.fill(false); cur = 0; paint(); };
      api.flash = (needle) => {
        const src = SRC().split('\n'); const i = src.findIndex((l) => l.includes(needle));
        const el = api.pre && api.pre.lines[i]; if (!el) return;
        el.classList.add('vzD-fl'); setTimeout(() => el.classList.remove('vzD-fl'), 1300);
      };
      paint();
      return api;
    }

    const bump = (el, cls = 'vzD-bump') => { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
    /* host の中で from→to に札が飛ぶ。bounce なら行って戻る */
    async function fly(host, from, to, text, col, bounce) {
      const pr = host.getBoundingClientRect(), a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
      const el = h('span', { class: 'vzD-pkt', style: { background: col } }, text); host.append(el);
      const w = el.offsetWidth, hh = el.offsetHeight;
      const pt = (r) => ({ x: r.left - pr.left + r.width / 2 - w / 2, y: r.top - pr.top + r.height / 2 - hh / 2 });
      const A = pt(a), B = pt(b), t = (p, s) => `translate(${p.x}px,${p.y}px) scale(${s})`;
      const frames = bounce
        ? [{ transform: t(A, .6), opacity: 0 }, { transform: t(A, 1), opacity: 1, offset: .12 }, { transform: t(B, 1), opacity: 1, offset: .5 }, { transform: t(A, 1), opacity: .8, offset: .88 }, { transform: t(A, .6), opacity: 0 }]
        : [{ transform: t(A, .6), opacity: 0 }, { transform: t(A, 1), opacity: 1, offset: .15 }, { transform: t(B, 1), opacity: 1, offset: .85 }, { transform: t(B, .6), opacity: 0 }];
      try { await el.animate(frames, { duration: bounce ? 1300 : 1000, easing: 'ease-in-out' }).finished; } catch (e) { /* 途中で消えてもよい */ }
      el.remove();
    }
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    return { h, code, bump, fly, quiz, wait };
  }

  /* ============================================================ */
  function basics() {
    const L = K.lessons['vue-basics'];
    const { h, bump, fly, quiz, wait } = kit();
    const mine = new Set();
    if (K.anatFor && !K.anatFor.vzD) {
      const orig = K.anatFor;
      K.anatFor = function (t) { return mine.has(t) ? null : orig.apply(this, arguments); };
      K.anatFor.vzD = true; K.anatFor.mine = mine;
    }
    const swap = (title, patch) => {
      const sc = L.scenes.find((s) => s.t === title);
      if (!sc) return;
      if (K.anatFor && K.anatFor.mine) K.anatFor.mine.add(title);
      delete sc.why; delete sc.gate;
      Object.assign(sc, patch);
    };
    const pinMaker = (pins, regs) => {
      const reg = (i, cls, ...kids) => {
        const r = h('div', { class: 'vzD-r ' + (cls || '') }, ...kids);
        const p = h('span', { class: 'vzD-pin', onclick: () => ref.q.setCur(i) }, CIRC[i]);
        r.append(p); pins[i] = p; regs[i] = r; return r;
      };
      const ref = { q: null };
      const paint = (cur, solved) => pins.forEach((p, i) => { p.className = 'vzD-pin' + (solved[i] ? ' ok' : '') + (i === cur ? ' cur' : ''); regs[i].classList.toggle('cur', i === cur); regs[i].classList.toggle('ok', !!solved[i]); });
      return { reg, ref, paint };
    };
    const frame = (left, q, reset, lbl) => h('div', { class: 'vzD-wrap' },
      h('div', { class: 'vzD-bar' }, q.dots, h('span', { style: { flex: 1 } }), h('button', { class: 'btn ghost', onclick: reset }, '⟲ やり直す')),
      h('div', { class: 'vi-eq' }, h('div', { class: 'vzD-col' }, h('div', { class: 'vzD-lb' }, lbl), left), h('div', { class: 'vzD-col' }, q.qBox, q.codeHost)));

    /* ===== v-if と v-show ===== */
    (function () {
      const SRC = '<script setup lang="ts">\nimport { ref } from \'vue\'\n\nconst show = ref<boolean>(true)\n</script>\n\n<template>\n  <button @click="show = !show">切り替える</button>\n  <AdminMenu ⟦0⟧ />\n  <PriceTab ⟦1⟧ />\n</template>';
      swap('v-if と v-show', {
        lead: '<b>切り替える</b>を押して、画面と DOM の違いを見よう。',
        render(el) {
          const pins = [], regs = [], pm = pinMaker(pins, regs);
          let show = true;
          const chip = h('b', 'true');
          const st = h('div', { class: 'vzD-st' }, h('span', { class: 'who' }, 'AdminDashboard.vue'), 'show = ', chip);
          const tg = h('button', { class: 'vzD-btn' }, '切り替える');
          const ia = pm.reg(0, 'vzD-w a', h('div', { class: 'vzD-it' }, h('b', '🛡 管理メニュー'), h('small', 'AdminMenu')));
          const ib = pm.reg(1, 'vzD-w b', h('div', { class: 'vzD-it' }, h('b', '💴 料金タブ'), h('small', 'PriceTab')));
          const page = h('div', { class: 'vzD-pg' }, h('div', { class: 'vzD-hd' }, '管理画面', h('small', '見た目')), h('div', { class: 'vzD-row' }, st, tg), ia, ib);
          /* DOM ツリー */
          const dA = h('div', { class: 'vzD-dr' }), dB = h('div', { class: 'vzD-dr' });
          const cnt = h('b', '2');
          const dom = h('div', { class: 'vzD-dom' }, h('div', { class: 'vzD-dh' }, 'DOM（ブラウザの中身）'),
            h('div', { class: 'vzD-dr' }, '<div id="app">'), h('div', { class: 'vzD-dr i' }, '<button>切り替える</button>'), dA, dB, h('div', { class: 'vzD-dr' }, '</div>'),
            h('div', { class: 'vzD-cnt' }, '表示用ノード ', cnt, ' 個'));
          const draw = (anim) => {
            chip.textContent = String(show);
            ia.classList.toggle('off', !show); ib.classList.toggle('off', !show);
            dA.className = 'vzD-dr i' + (show ? '' : ' gone'); dB.className = 'vzD-dr i' + (show ? '' : ' hid');
            dA.textContent = show ? '<p v-if>管理メニュー</p>' : '<!--v-if-->　← 消えた（DOM に無い）';
            dB.textContent = show ? '<p v-show>料金タブ</p>' : '<p style="display:none">料金タブ</p>　← 残ってる';
            cnt.textContent = show ? '2' : '1';
            if (anim) { bump(dA, 'vzD-bump'); bump(dB, 'vzD-bump'); bump(chip); }
          };
          const flip = async (target) => {
            show = !show; draw(true);
            const rows = [dA, dB];
            const i = target == null ? null : target;
            const col = 'var(--ts)';
            if (i != null) await fly(page.parentElement, chip, rows[i], i === 0 ? '<!--v-if-->' : 'display:none', i === 0 ? 'var(--bad)' : 'var(--team)');
            else await Promise.all([fly(page.parentElement, chip, dA, 'v-if', 'var(--bad)'), fly(page.parentElement, chip, dB, 'v-show', 'var(--team)')]);
            void col;
          };
          tg.onclick = () => { q.flash('show = !show'); flip(null); };
          const q = quiz({
            file: 'AdminDashboard.vue', src: SRC,
            Q: [
              { who: '管理メニュー', t: 'ずっと同じ。条件のとき だけ作りたい', ans: 'i', ph: '【①】', fill: 'v-if="show"', why: '偽なら DOM から消える。切替が少ない所向き。',
                opts: [{ k: 'i', label: 'v-if', small: '作る・消す', color: 'var(--bad)', mono: 1 }, { k: 's', label: 'v-show', small: '隠すだけ', color: 'var(--team)', mono: 1 }], ng: { s: 'v-show は DOM に残る。消したいなら v-if。' } },
              { who: '料金タブ', t: '何度も切り替える。作り直すのは重い', ans: 's', ph: '【②】', fill: 'v-show="show"', why: 'display:none で隠すだけ。切替が多い所向き。',
                opts: [{ k: 'i', label: 'v-if', small: '作る・消す', color: 'var(--bad)', mono: 1 }, { k: 's', label: 'v-show', small: '隠すだけ', color: 'var(--team)', mono: 1 }], ng: { i: '切替のたびに作り直すと重い。隠すだけの v-show。' } },
            ],
            onCur: (i, s) => pm.paint(i, s),
            onCorrect: async (i) => { if (show) await flip(i); else { draw(true); await fly(page.parentElement, chip, [dA, dB][i], i ? 'display:none' : '<!--v-if-->', i ? 'var(--team)' : 'var(--bad)'); } },
          });
          pm.ref.q = q; draw(false);
          const left = h('div', { class: 'vzD-col', style: { position: 'relative' } }, page, dom);
          el.append(frame(left, q, () => { show = true; draw(false); q.reset(); }, '👀 見た目（上）と、その裏の DOM（下）'));
        },
      });
    })();

    /* ===== イベントの種類 ===== */
    (function () {
      const SRC = '<script setup lang="ts">\nimport { ref } from \'vue\'\n\nconst name = ref<string>(\'\')\nconst field = ref<string>(\'相続\')\n</script>\n\n<template>\n  <form ⟦2⟧>\n    <input v-model="name" ⟦0⟧ />\n    <select v-model="field" ⟦1⟧>\n      <option>相続</option>\n      <option>離婚</option>\n    </select>\n    <button type="submit">予約する</button>\n  </form>\n  <input ⟦3⟧ placeholder="弁護士を検索" />\n</template>';
      const EV = [['@input', 'var(--ts)'], ['@change', 'var(--ok)'], ['@submit', 'var(--team)'], ['@keyup.enter', 'var(--vue)']];
      const opts = () => EV.map(([l, col]) => ({ k: l, label: l, color: col, mono: 1 }));
      const ngs = (a) => { const o = {}; EV.forEach(([l]) => { if (l !== a) o[l] = l + ' は別の操作で起きる。'; }); return o; };
      swap('イベントの種類', {
        lead: '操作ごとに<b>イベント名</b>が違う。押して、打って、確かめよう。',
        render(el) {
          const pins = [], regs = [], pm = pinMaker(pins, regs);
          const log = h('div', { class: 'vzD-log' }, h('span', { class: 'vzD-ph' }, '操作すると、ここにイベントが並ぶ'));
          const pg = h('div', { class: 'vzD-pg' });
          let q;
          const fire = async (ev, from, text) => {
            const idx = EV.findIndex(([l]) => l === ev);
            if (log.querySelector('.vzD-ph')) log.replaceChildren();
            const chip = h('span', { class: 'vzD-ev', style: { '--c': EV[idx][1] } }, h('b', ev), h('small', text));
            log.prepend(chip); while (log.children.length > 4) log.lastChild.remove();
            bump(chip); q && q.flash(ev);
            await fly(pg, from, chip, ev.replace('@', ''), EV[idx][1]);
          };
          const name = h('input', { class: 'vzD-in', placeholder: '氏名を入力' });
          const sel = h('select', { class: 'vzD-in' }, h('option', '相続'), h('option', '離婚'), h('option', '労働'));
          const sub = h('button', { class: 'vzD-btn', type: 'submit' }, '予約する');
          const form = h('form', { class: 'vzD-form' }, h('label', '氏名', name), h('label', '相談分野', sel), sub);
          const srch = h('input', { class: 'vzD-in', placeholder: '弁護士を検索（Enter）' });
          name.addEventListener('input', () => fire('@input', name, '「' + name.value.slice(-6) + '」'));
          sel.addEventListener('change', () => fire('@change', sel, sel.value));
          form.addEventListener('submit', (e) => { e.preventDefault(); fire('@submit', sub, '送信'); });
          srch.addEventListener('keyup', (e) => { if (e.key === 'Enter') fire('@keyup.enter', srch, 'Enter'); });
          pg.append(h('div', { class: 'vzD-hd' }, '⚖ 相談予約', h('small', 'ほんとうに操作できる')),
            pm.reg(0, 'vzD-blk', h('div', { style: { display: 'none' } })), pm.reg(1, 'vzD-blk', h('div', { style: { display: 'none' } })), pm.reg(2, 'vzD-blk', form), pm.reg(3, 'vzD-blk', srch));
          /* ピンを該当部品の上へ移す */
          regs[0].replaceChildren(pins[0]); regs[1].replaceChildren(pins[1]); regs[0].style.display = regs[1].style.display = 'none';
          name.before(pins[0]); sel.before(pins[1]); pins[0].style.right = pins[1].style.right = '-6px';
          name.parentElement.style.position = sel.parentElement.style.position = 'relative';
          pins[0].style.top = pins[1].style.top = '-6px'; pins[2].style.top = 'auto'; pins[2].style.bottom = '-8px'; pins[2].style.right = 'auto'; pins[2].style.left = '-8px';
          const ids = [name, sel, form, srch];
          const sim = async (i) => {
            if (i === 0) { name.focus(); name.value = ''; for (const c of '山田') { name.value += c; name.dispatchEvent(new Event('input')); await wait(350); } }
            if (i === 1) { sel.value = '離婚'; sel.dispatchEvent(new Event('change')); }
            if (i === 2) { form.dispatchEvent(new Event('submit', { cancelable: true })); bump(sub); }
            if (i === 3) { srch.value = '離婚'; srch.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' })); }
          };
          q = quiz({
            file: 'ReserveForm.vue', src: SRC, cols: 2,
            Q: [
              { who: '氏名の欄', t: '1文字打つたびに 候補を絞りたい', ans: '@input', ph: '【①】', fill: '@input="filterNames"', why: '入力のたびに起きる。検索の絞り込み向き。', opts: opts(), ng: ngs('@input') },
              { who: '相談分野', t: '選び終えたら 料金を更新したい', ans: '@change', ph: '【②】', fill: '@change="updateFee"', why: '選択が確定したときに起きる。', opts: opts(), ng: ngs('@change') },
              { who: 'フォーム全体', t: '「予約する」で まとめて送信したい', ans: '@submit', ph: '【③】', fill: '@submit.prevent="book"', why: 'Enter でも ボタンでも起きる。.prevent で再読込を止める。', opts: opts(), ng: ngs('@submit') },
              { who: '検索ボックス', t: 'Enter を押したら 検索を始めたい', ans: '@keyup.enter', ph: '【④】', fill: '@keyup.enter="search"', why: 'キーを離したとき、Enter のときだけ動く。', opts: opts(), ng: ngs('@keyup.enter') },
            ],
            onCur: (i, s) => { pins.forEach((p, j) => { p.className = 'vzD-pin' + (s[j] ? ' ok' : '') + (j === i ? ' cur' : ''); }); ids.forEach((e, j) => e.classList && e.classList.toggle('vzD-cur', j === i)); },
            onCorrect: (i) => sim(i),
          });
          pm.ref.q = q;
          const left = h('div', { class: 'vzD-col' }, pg, h('div', { class: 'vzD-lb' }, '起きたイベント（新しい順）'), log);
          el.append(frame(left, q, () => { log.replaceChildren(h('span', { class: 'vzD-ph' }, '操作すると、ここにイベントが並ぶ')); q.reset(); }, '👀 本物のフォーム（打つ・選ぶ・押す）'));
        },
      });
    })();

    /* ===== :class と v-for ===== */
    (function () {
      const SRC = '<script setup lang="ts">\nimport { ref } from \'vue\'\n\ninterface Case { id: number; title: string; done: boolean }\nconst cases = ref<Case[]>([ /* 3件 */ ])\n</script>\n\n<template>\n  <ul>\n    <li\n      ⟦0⟧\n      ⟦2⟧\n      ⟦1⟧\n      @click="c.done = !c.done"\n    >{{ c.title }}</li>\n  </ul>\n</template>'.replace(' /* 3件 */ ', '…');
      const O = (a) => [{ k: 'f', label: 'v-for', small: '並べる', color: 'var(--ok)', mono: 1 }, { k: 'c', label: ':class', small: '見た目', color: 'var(--vue)', mono: 1 }, { k: 'k', label: ':key', small: '目印', color: 'var(--team)', mono: 1 }];
      const NG = (a) => { const m = { f: '行を増やすのは v-for。', c: '見た目を変えるのは :class。', k: '行を区別するのは :key。' }; const o = {}; Object.keys(m).forEach((k) => { if (k !== a) o[k] = m[k]; }); return o; };
      swap(':class と v-for', {
        lead: '配列を<b>1件増やす</b>と、画面が1行増える。クリックで完了。',
        render(el) {
          let data = [{ id: 1, title: '未払い残業代の相談', done: false }, { id: 2, title: '契約書チェックの依頼', done: false }, { id: 3, title: '交通事故の示談相談', done: true }];
          let nextId = 4, showKey = false;
          const NEW = ['相続放棄の手続き', '離婚協議書の作成', '賃貸の敷金返還'];
          const pins = [], regs = [], pm = pinMaker(pins, regs);
          const root = h('div', { class: 'vzD-col', style: { position: 'relative' } });
          const arr = h('div', { class: 'vzD-dom' }), ul = h('div', { class: 'vzD-ul' });
          const cntB = h('b', '3');
          let q;
          const drawRows = (flashId, newId) => {
            arr.replaceChildren(h('div', { class: 'vzD-dh' }, 'cases（データ） ', h('b', { style: { color: 'var(--ok)' } }, String(data.length) + ' 件')),
              ...data.map((c) => h('div', { class: 'vzD-dr i dt', 'data-id': c.id }, '{ id: ' + c.id + ', done: ', h('b', { class: c.done ? 'on' : '' }, String(c.done)), ' }')));
            ul.replaceChildren(...data.map((c) => {
              const li = h('div', { class: 'vzD-li' + (c.done ? ' done' : '') + (c.id === newId ? ' new' : ''), 'data-id': c.id, onclick: () => toggle(c.id) },
                h('span', { class: 'ck' }, c.done ? '✓' : ''), h('span', { class: 'tt' }, c.title),
                h('code', { class: 'cl' }, c.done ? 'class="done"' : 'class=""'),
                showKey ? h('code', { class: 'ky' }, 'key=' + c.id) : null);
              return li;
            }));
          };
          const toggle = async (id) => {
            const c = data.find((x) => x.id === id); c.done = !c.done; drawRows();
            q && q.flash('c.done = !c.done');
            const a = arr.querySelector('[data-id="' + id + '"] b'), li = ul.querySelector('[data-id="' + id + '"]');
            bump(a); await fly(root, a, li, c.done ? 'done: true' : 'done: false', 'var(--vue)'); bump(li);
          };
          const add = h('button', { class: 'vzD-btn', onclick: async () => { if (data.length >= 6) return; data.push({ id: nextId, title: NEW[(nextId - 4) % 3], done: false }); const id = nextId++; drawRows(null, id); q && q.flash('v-for'); const r = arr.querySelector('[data-id="' + id + '"]'); bump(r); await fly(root, r, ul.querySelector('[data-id="' + id + '"]'), '+1 行', 'var(--ok)'); } }, '＋ 案件を追加（push）');
          const pinBox = (i, node) => { const r = h('div', { class: 'vzD-r' }, node); r.append(pins[i] = h('span', { class: 'vzD-pin', onclick: () => q.setCur(i) }, CIRC[i])); regs[i] = r; return r; };
          const listBox = pinBox(0, ul);
          const pg = h('div', { class: 'vzD-pg' }, h('div', { class: 'vzD-hd' }, '案件一覧', h('small', 'クリックで完了')), listBox, h('div', { class: 'vzD-row' }, add));
          /* ② :class と ③ :key のピンは一覧の同じ箱に乗せる */
          const stub = (i) => { const p = h('span', { class: 'vzD-pin', onclick: () => q.setCur(i) }, CIRC[i]); pins[i] = p; regs[i] = listBox; return p; };
          listBox.append(stub(1), stub(2)); pins[1].style.top = '16px'; pins[2].style.top = '46px';
          root.append(arr, pg);
          q = quiz({
            file: 'CaseList.vue', src: SRC,
            Q: [
              { who: '一覧の行', t: 'cases の件数ぶん 行を並べたい', ans: 'f', ph: '【①】', fill: 'v-for="c in cases"', why: '配列を増やすだけで、行が自動で増える。', opts: O(), ng: NG('f') },
              { who: '完了の見た目', t: 'done の行だけ 取り消し線にしたい', ans: 'c', ph: '【②】', fill: ':class="{ done: c.done }"', why: 'done が true のときだけ、class が付く。', opts: O(), ng: NG('c') },
              { who: '行の目印', t: '行を区別して 並び替えでも崩れないように', ans: 'k', ph: '【③】', fill: ':key="c.id"', why: 'id を目印にして、同じ行を追跡できる。', opts: O(), ng: NG('k') },
            ],
            onCur: (i, s) => {
              pins.forEach((p, j) => { p.className = 'vzD-pin' + (s[j] ? ' ok' : '') + (j === i ? ' cur' : ''); });
              listBox.classList.toggle('cur', true); listBox.classList.toggle('ok', s.every(Boolean));
            },
            onCorrect: async (i) => {
              if (i === 0) { if (data.length < 6) add.click(); else bump(ul); }
              if (i === 1) { const t = data.find((c) => !c.done); if (t) await toggle(t.id); else { const l = data[0]; await toggle(l.id); await toggle(l.id); } }
              if (i === 2) { showKey = true; drawRows(); [...ul.children].forEach((e) => bump(e)); }
            },
          });
          drawRows();
          el.append(frame(root, q, () => { data = data.slice(0, 3); data.forEach((c, i) => { c.done = i === 2; }); nextId = 4; showKey = false; drawRows(); q.reset(); }, '👀 データ（上）→ 画面（下）'));
        },
      });
    })();

    /* ===== ref：状態と画面 ===== */
    (function () {
      const SRC = '<script setup lang="ts">\nimport { ref } from \'vue\'\n\n⟦0⟧\n\nfunction addPerson(): void {\n  ⟦1⟧\n}\n</script>\n\n<template>\n  <p>参加人数：⟦2⟧ 名</p>\n  <button @click="addPerson">＋1名</button>\n</template>';
      swap('ref：状態と画面', {
        lead: '<b>ref</b>の値が変わると、画面も自動で変わる。',
        render(el) {
          const pins = [], regs = [], pm = pinMaker(pins, regs);
          let n = 3, live = [false, false, false];
          const chip = h('b', '3');
          const stH = h('span', { class: 'who' }, 'SeminarForm.vue');
          const st = pm.reg(0, 'vzD-st0', h('div', { class: 'vzD-st' }, stH, 'people = ', chip));
          const num = h('b', { class: 'vzD-big' }, '3');
          const yen = h('b', '9,000');
          const disp = pm.reg(2, 'vzD-disp', h('span', { class: 'vzD-lbl' }, '参加人数'), num, h('span', { class: 'vzD-lbl' }, '名'));
          const btn = h('button', { class: 'vzD-btn' }, '＋1名');
          const bt = pm.reg(1, 'vzD-bt', btn);
          const pg = h('div', { class: 'vzD-pg' }, h('div', { class: 'vzD-hd' }, '⚖ セミナー申込', h('small', '相続セミナー')), st, h('div', { class: 'vzD-two' }, disp, bt), h('div', { class: 'vzD-yen' }, '参加費 ', yen, ' 円'));
          const bx = h('b', '3');
          const boxEl = h('div', { class: 'vzD-dom' }, h('div', { class: 'vzD-dh' }, 'ref の中身（箱）'), h('div', { class: 'vzD-dr i' }, 'people ＝ { value: ', bx, ' }'), h('div', { class: 'vzD-dr i' }, 'script → people.value　／　template → people'));
          const draw = (v) => { bx.textContent = String(n); chip.textContent = String(n); num.textContent = v == null ? String(n) : v; yen.textContent = (n * 3000).toLocaleString(); };
          let q;
          const inc = async () => {
            n++; q.flash('people.value++');
            await fly(pg, btn, chip, '+1', 'var(--team)'); chip.textContent = String(n); bump(chip);
            await fly(pg, chip, num, String(n), 'var(--ts)'); draw(); bump(num); bump(yen);
          };
          btn.onclick = () => { if (live[1] && live[0]) inc(); else { bump(bt, 'vzD-bad'); q.setCur(live[0] ? 1 : 0); } };
          const O3 = (a, b, c) => [{ k: 'a', label: a, mono: 1, color: 'var(--bad)' }, { k: 'b', label: b, mono: 1, color: 'var(--ok)' }, { k: 'c', label: c, mono: 1, color: 'var(--ts)' }];
          q = quiz({
            file: 'SeminarForm.vue', src: SRC, cols: 1,
            Q: [
              { who: '人数の宣言', t: '人数を「画面とつながった変数」にしたい', ans: 'b', ph: '【①】', fill: 'const people = ref<number>(3)', why: 'ref の箱に入れると、画面が変化を見張る。',
                opts: [{ k: 'a', label: 'let people = 3', mono: 1, color: 'var(--bad)' }, { k: 'b', label: 'const people = ref<number>(3)', mono: 1, color: 'var(--ok)' }, { k: 'c', label: 'const people = reactive(3)', mono: 1, color: 'var(--ts)' }],
                ng: { a: 'ただの変数。変わっても画面は気づかない。', c: 'reactive は数値には使えない（オブジェクト用）。' } },
              { who: '＋1名ボタン', t: 'script で 人数を 1 増やしたい', ans: 'b', ph: '【②】', fill: 'people.value++', why: 'script では .value で箱の中身を変える。',
                opts: [{ k: 'a', label: 'people++', mono: 1, color: 'var(--bad)' }, { k: 'b', label: 'people.value++', mono: 1, color: 'var(--ok)' }, { k: 'c', label: 'people = people + 1', mono: 1, color: 'var(--ts)' }],
                ng: { a: '箱ごと ++ はできない（型エラー）。.value を付ける。', c: 'const の箱は付け替えられない。.value を変える。' } },
              { who: '画面の表示', t: 'template に 人数を表示したい', ans: 'b', ph: '【③】', fill: '{{ people }}', why: 'template では .value は不要。自動で開いてくれる。',
                opts: [{ k: 'a', label: '{{ people.value }}', mono: 1, color: 'var(--bad)' }, { k: 'b', label: '{{ people }}', mono: 1, color: 'var(--ok)' }, { k: 'c', label: '{{ ref(people) }}', mono: 1, color: 'var(--ts)' }],
                ng: { a: 'template で .value を付けると、中身が見つからない。', c: '表示に ref() は使わない。' } },
            ],
            onCur: (i, s) => pm.paint(i, s),
            onWrong: async (i, k) => {
              if (i === 0) { bump(st, 'vzD-bad'); }
              if (i === 1) { await fly(pg, btn, chip, k === 'a' ? 'people++' : 'people = …', 'var(--bad)', true); bump(chip, 'vzD-bad'); }
              if (i === 2) { num.textContent = k === 'a' ? '（空）' : '？'; bump(disp, 'vzD-bad'); setTimeout(() => draw(), 1300); }
            },
            onCorrect: async (i) => {
              live[i] = true;
              if (i === 0) { bump(chip); await fly(pg, stH, chip, 'ref(3)', 'var(--vue)'); bump(chip); }
              if (i === 1) { await inc(); }
              if (i === 2) { await fly(pg, chip, num, String(n), 'var(--ts)'); draw(); bump(num); }
            },
          });
          pm.ref.q = q; draw();
          el.append(frame(h('div', { class: 'vzD-col' }, pg, boxEl), q, () => { n = 3; live = [false, false, false]; draw(); q.reset(); }, '👀 画面（②のボタンは、正解すると本当に動く）'));
        },
      });
    })();

    /* ---- 共通の見た目（このファイル専用） ---- */
    K.W.style('vzD2', `
    .vzD-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
    .vzD-w{display:grid;grid-template-rows:1fr;transition:grid-template-rows .5s,opacity .5s,margin .5s}
    .vzD-it{min-height:0;overflow:hidden;display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-radius:12px;background:#fff;border:1px solid #d7dbe8;font-size:1.05rem}
    .vzD-it small{color:#667;font:700 .85rem var(--mono)}
    .vzD-w.a>.vzD-it{border-left:6px solid var(--bad)}.vzD-w.b>.vzD-it{border-left:6px solid var(--team)}
    .vzD-w.off{grid-template-rows:0fr;opacity:0;margin-top:-12px;outline-color:transparent}
    .vzD-w.off>.vzD-it{padding-top:0;padding-bottom:0;border-width:0}.vzD-w.off>.vzD-pin{opacity:0}
    .vzD-dom{background:var(--code);color:#d8dcff;border:1px solid var(--line);border-radius:10px;padding:.7em 0;font:600 .95rem/1.9 var(--mono);display:grid}
    .vzD-dh{padding:0 1em .3em;color:#8e97c4;font:800 .85rem var(--font);border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:.3em}
    .vzD-dr{padding:0 1em;border-left:4px solid transparent;transition:.3s;white-space:pre-wrap}
    .vzD-dr.i{padding-left:2em}
    .vzD-dr.gone{color:#8e97c4;border-left-color:var(--bad);background:color-mix(in srgb,var(--bad) 20%,transparent);text-decoration:none}
    .vzD-dr.hid{color:#ffd9a0;border-left-color:var(--team);background:color-mix(in srgb,var(--team) 22%,transparent)}
    .vzD-dr.dt b{color:var(--mute)}.vzD-dr.dt b.on{color:var(--ok)}
    .vzD-cnt{padding:.3em 1em 0;color:#8e97c4;font:800 .9rem var(--font)}.vzD-cnt b{color:#fff;font-size:1.2rem}
    .vzD-in{width:100%;box-sizing:border-box;padding:.6em .8em;border-radius:8px;border:1px solid #bcc3d8;background:#fff;color:#223;font:700 1rem var(--font)}
    .vzD-in.vzD-cur{outline:3px solid var(--ts);animation:vzDp 1.4s infinite}
    .vzD-form{display:grid;gap:10px;position:relative}
    .vzD-form label{display:grid;gap:4px;font:800 .9rem var(--font);color:#445;position:relative}
    .vzD-blk{padding:6px}
    .vzD-log{display:grid;gap:8px;min-height:3.6em}
    .vzD-ph{color:var(--mute);font:700 .95rem var(--font);padding:.5em}
    .vzD-ev{display:flex;gap:12px;align-items:baseline;padding:.5em .9em;border-radius:10px;border:2px solid var(--c);color:var(--c);background:color-mix(in srgb,var(--c) 10%,var(--card))}
    .vzD-ev b{font:900 1.05rem var(--mono)}.vzD-ev small{font:700 .9rem var(--font);color:var(--mute)}
    .vzD-ul{display:grid;gap:8px}
    .vzD-li{display:flex;gap:10px;align-items:center;padding:11px 14px;border-radius:10px;background:#fff;border:1px solid #d7dbe8;cursor:pointer;font:800 1rem var(--font);transition:.25s}
    .vzD-li .ck{width:22px;height:22px;border-radius:6px;border:2px solid #aab;display:grid;place-items:center;font-size:.85rem;color:#fff;flex:none}
    .vzD-li.done{background:#eef8f1;color:#7a8;}.vzD-li.done .tt{text-decoration:line-through}.vzD-li.done .ck{background:var(--ok);border-color:var(--ok)}
    .vzD-li .tt{flex:1;min-width:0}
    .vzD-li code{font:700 .8rem var(--mono);color:#556;background:#eef1f8;padding:.1em .5em;border-radius:6px}
    .vzD-li code.ky{color:#7a4a00;background:#fff0d0}
    .vzD-li.new{animation:vzDin .6s}@keyframes vzDin{from{opacity:0;transform:translateY(-14px)}}
    .vzD-st0{padding:2px}
    .vzD-two{display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center}
    .vzD-disp{display:flex;align-items:baseline;gap:8px;padding:12px 16px;background:#fff;border:1px solid #d7dbe8;border-radius:12px}
    .vzD-big{font:900 2.4rem var(--font);color:#2f6df0;min-width:1.2em;text-align:center}
    .vzD-lbl{font:800 1rem var(--font);color:#445}
    .vzD-bt{padding:6px}
    .vzD-yen{font:800 1.05rem var(--font);color:#445;padding:0 4px}.vzD-yen b{font-size:1.3rem;color:#223}
    `);
  }
})();
