/* vue-router：「使い分け：RouterLink と push」を、ミニブラウザ＋履歴スタックで動かして選ぶ版に差し替え */
(function () {
  'use strict';
  const K = window.KENSHU;
  const TITLE = '使い分け：RouterLink と push';
  let tries = 0;
  (function wait() {
    const L = K && K.lessons && K.lessons['vue-router'];
    if (L && K.W && L.scenes && L.scenes.some((s) => s.t === TITLE)) return init(L);
    if (++tries < 200) setTimeout(wait, 50);
  })();

  function init(L) {
    const { h, code, style, sleep } = K.W;
    const scene = L.scenes.find((s) => s.t === TITLE);

    const OPT = {
      link: ['<RouterLink>', '人が押すリンク', 'var(--ts)'],
      push: ['router.push', 'コードが移動', 'var(--vue)'],
      replace: ['router.replace', '履歴を書き換え', 'var(--pink)'],
      back: ['router.back', '1つ前へ', 'var(--team)'],
      a: ['<a href>', '全部読み直し', 'var(--mute)'],
    };
    const NUM = '①②③④⑤';

    /* 各場面：start＝最初の履歴、T＝行きたい先、reg＝画面上の問題の場所、L＝選択肢ごとのコード行 */
    const SC = [
      {
        who: 'ヘッダーのメニュー', q: '「相談一覧」のメニューを置きたい', reg: 'menu', start: { s: ['/', '/apply'], i: 1 }, T: '/cases', ans: 'link',
        file: 'AppHeader.vue', ind: '    ',
        pre: `<script setup lang="ts">\nimport { useRouter } from 'vue-router'\n\nconst router = useRouter()\n</script>\n\n<template>\n  <nav class="app-nav">`, post: `  </nav>\n</template>`,
        L: { link: `<RouterLink to="/cases">相談一覧</RouterLink>`, push: `<a @click="router.push('/cases')">相談一覧</a>`, replace: `<a @click="router.replace('/cases')">相談一覧</a>`, back: `<a @click="router.back()">相談一覧</a>`, a: `<a href="/cases">相談一覧</a>` },
        ng: { push: '動くけれど、〈a〉ではない。右クリックの「新しいタブで開く」が使えない。', replace: '履歴が書き換わる。戻るボタンで、元のページに帰れなくなる。', back: '「戻る」は1つ前へ行くだけ。相談一覧ではなく、トップに着いてしまう。' },
        why: '押すのは人。だから〈a〉の代わりの RouterLink。別タブも開ける。',
      },
      {
        who: '申込フォーム', q: '送信が成功したら、完了ページへ移したい', reg: 'submit', start: { s: ['/cases', '/apply'], i: 1 }, T: '/done', ans: 'push',
        file: 'ApplyForm.vue', ind: '  ',
        pre: `<script setup lang="ts">\nimport { useRouter } from 'vue-router'\nimport { postApplication } from '@/api/applications'\nimport type { ApplicationForm } from '@/types'\n\nconst router = useRouter()\n\nasync function onSubmit(form: ApplicationForm): Promise<void> {\n  await postApplication(form)`, post: `}\n</script>`,
        L: { link: `<RouterLink to="/done" />  // script には書けない`, push: `router.push('/done')`, replace: `router.replace('/done')`, back: `router.back()`, a: `location.href = '/done'` },
        ng: { link: '成功したかを判断するのはコード。押す人がいないので、リンクは置けない。', replace: '申込ページが履歴から消える。戻って内容を確認できなくなる。', back: '前のページ（一覧）に戻るだけ。完了ページへは行けない。' },
        why: 'await のあと、コードが「成功した」と決めて移動。履歴にも残る。',
      },
      {
        who: 'ログイン画面', q: 'ログインしたら一覧へ。戻るで、ログイン画面には戻らせたくない', reg: 'login', start: { s: ['/', '/login'], i: 1 }, T: '/cases', ans: 'replace', demoOk: true,
        file: 'LoginView.vue', ind: '  ',
        pre: `<script setup lang="ts">\nimport { useRouter } from 'vue-router'\nimport { login } from '@/api/auth'\nimport type { LoginForm } from '@/types'\n\nconst router = useRouter()\n\nasync function onLogin(form: LoginForm): Promise<void> {\n  await login(form)`, post: `}\n</script>`,
        L: { link: `<RouterLink to="/cases" />  // script には書けない`, push: `router.push('/cases')`, replace: `router.replace('/cases')`, back: `router.back()`, a: `location.href = '/cases'` },
        ng: { link: 'ログイン成功を判断するのはコード。押す人がいないので、リンクは置けない。', push: '履歴にログインが残る。戻るを押すと、ログイン画面に逆戻り。', back: '前のページへ戻るだけ。一覧には着かない。' },
        demo: { push: 'ログイン画面に逆戻り！' }, demoOkText: 'ログインには戻らず、トップへ',
        why: 'いまのページを一覧で置き換える。履歴に残らないので、戻るでも戻れない。',
      },
      {
        who: '詳細ページの「戻る」', q: '「戻る」ボタンで、いま来た画面に帰したい', reg: 'back', start: { s: ['/cases', '/cases/42'], i: 1 }, T: '/cases', ans: 'back',
        file: 'CaseDetail.vue', ind: '    ',
        pre: `<script setup lang="ts">\nimport { useRouter } from 'vue-router'\n\nconst router = useRouter()\n</script>\n\n<template>\n  <article class="case-detail">\n    <h2>離婚の慰謝料について</h2>`, post: `  </article>\n</template>`,
        L: { link: `<RouterLink to="/cases">戻る</RouterLink>`, push: `<button @click="router.push('/cases')">戻る</button>`, replace: `<button @click="router.replace('/cases')">戻る</button>`, back: `<button @click="router.back()">戻る</button>`, a: `<a href="/cases">戻る</a>` },
        ng: { link: '「戻る」ではなく「進む」。履歴が増え、もう一度戻ると詳細に逆戻り。', push: '履歴が1つ増えるだけ。もう一度戻ると、詳細に逆戻り。', replace: '詳細が一覧で上書きされるだけ。履歴の位置は戻っていない。' },
        demo: { link: '詳細に逆戻り！', push: '詳細に逆戻り！' },
        why: '履歴を1つ戻す。ブラウザの ◀ と同じ動き。',
      },
      {
        who: '相談一覧の1行', q: '1行をクリックして詳細へ。見た目はリンク', reg: 'row', start: { s: ['/', '/cases'], i: 1 }, T: '/cases/42', ans: 'link',
        file: 'CaseList.vue', ind: '      ',
        pre: `<script setup lang="ts">\nimport { useRouter } from 'vue-router'\nimport type { CaseSummary } from '@/types'\n\ndefineProps<{ cases: CaseSummary[] }>()\nconst router = useRouter()\n</script>\n\n<template>\n  <ul class="case-list">\n    <li v-for="c in cases" :key="c.id">`, post: `    </li>\n  </ul>\n</template>`,
        L: { link: `<RouterLink :to="{ name: 'case', params: { id: c.id } }">{{ c.title }}</RouterLink>`, push: `<span @click="router.push('/cases/' + c.id)">{{ c.title }}</span>`, replace: `<span @click="router.replace('/cases/' + c.id)">{{ c.title }}</span>`, back: `<span @click="router.back()">{{ c.title }}</span>`, a: `<a :href="'/cases/' + c.id">{{ c.title }}</a>` },
        ng: { push: '動くけれど、リンクではない。右クリックの「新しいタブで開く」が使えない。', replace: '一覧が詳細で上書きされる。戻るで一覧に帰れなくなる。', back: '詳細ではなく、1つ前（トップ）に行ってしまう。' },
        why: '押すのは人。params で :id を渡せる RouterLink が合う。別タブも開ける。',
      },
    ];

    const PAGE = { '/': 'トップ', '/login': 'ログイン', '/cases': '相談一覧', '/cases/42': '相談詳細', '/apply': '申込フォーム', '/done': '完了' };
    const HOST = 'https://soudan-navi.example';
    const solved = SC.map(() => false);
    let cur = 0, busy = false, st = { s: [], i: 0 }, timer = 0;

    const R = (key, el) => { el.setAttribute('data-r', key); el.setAttribute('data-k', 'reg'); el.classList.add('vzC-r'); return el; };
    const mkPage = (u) => {
      const f = (l, v) => h('div', { class: 'vzC-fld' }, h('small', l), h('span', v));
      const P = {
        '/': () => [h('h3', '法律相談ナビ'), h('p', '弁護士に、オンラインで相談できます。'), h('span', { class: 'vzC-cta' }, '相談一覧を見る ›')],
        '/login': () => [h('h3', 'ログイン'), f('メールアドレス', 'sample@example.com'), f('パスワード', '••••••••'), R('login', h('button', { class: 'vzC-btn' }, 'ログイン'))],
        '/cases': () => [h('h3', '相談一覧'), ...['離婚の慰謝料について', '相続の遺産分割', '未払い残業代の請求'].map((t, i) => {
          const row = h('div', { class: 'vzC-row' }, h('b', t), h('small', ['離婚', '相続', '労働'][i]), h('i', '›'));
          return i === 0 ? R('row', row) : row;
        })],
        '/cases/42': () => [h('small', { class: 'vzC-crumb' }, '相談一覧 › 42'), h('h3', '離婚の慰謝料について'), h('p', '相談者：30代・会社員。協議中です。'), h('div', { class: 'vzC-two' }, R('back', h('button', { class: 'vzC-btn ghost' }, '← 戻る')), h('button', { class: 'vzC-btn' }, '申し込む'))],
        '/apply': () => [h('h3', '申込フォーム'), f('お名前', '山田 太郎'), f('相談内容', '慰謝料について相談したい'), R('submit', h('button', { class: 'vzC-btn' }, '送信'))],
        '/done': () => [h('div', { class: 'vzC-done' }, h('b', '✓'), h('h3', '送信しました'), h('p', 'ありがとうございました。'))],
      };
      return h('div', { class: 'vzC-pgc' }, ...(P[u] || P['/'])());
    };

    /* ---- 左：ミニブラウザ ---- */
    const btnBack = h('button', { class: 'vzC-nb', 'data-k': 'hist', title: '戻る' }, '◀');
    const btnFwd = h('button', { class: 'vzC-nb', 'data-k': 'hist', title: '進む' }, '▶');
    const urlPath = h('b');
    const urlEl = h('div', { class: 'vzC-url', 'data-k': 'url' }, h('span', { class: 'lock' }, '🔒'), h('span', { class: 'host' }, HOST), urlPath);
    const nav = h('nav', { class: 'vzC-nav' }, h('b', { class: 'logo' }, '⚖ 法律相談ナビ'), h('span', null, 'トップ'), R('menu', h('span', { class: 'mi' }, '相談一覧')), h('span', null, '料金'));
    const view = h('div', { class: 'vzC-view' });
    const br = h('div', { class: 'vzC-br' },
      h('div', { class: 'vzC-tb' }, btnBack, btnFwd, urlEl),
      h('div', { class: 'vzC-site' }, nav, view));
    const hist = h('div', { class: 'vzC-hist' });

    const rr = () => [...br.querySelectorAll('[data-r]')];
    const reg = (key) => rr().find((e) => e.getAttribute('data-r') === key);
    const markReg = () => rr().forEach((e) => { e.classList.toggle('cur', !busy && e.getAttribute('data-r') === SC[cur].reg); e.classList.remove('ok'); });
    const bump = (el) => { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); };

    const drawHist = (fresh, rep) => {
      const kids = [];
      st.s.forEach((u, i) => {
        if (i) kids.push(h('span', { class: 'arr' }, '→'));
        kids.push(h('span', { class: 'chip' + (i === st.i ? ' cur' : '') + (i > st.i ? ' fwd' : '') + (i === fresh ? ' new' : '') + (i === rep ? ' rep' : '') }, h('b', u), h('small', PAGE[u] || ''), i === st.i ? h('em', 'いま') : null));
      });
      hist.replaceChildren(h('div', { class: 'vi-lb' }, '🕘 履歴スタック（◀ で1つずつ戻る）'), h('div', { class: 'vzC-hs', 'data-k': 'hist' }, ...kids));
      relink();
      btnBack.classList.toggle('off', st.i <= 0); btnFwd.classList.toggle('off', st.i >= st.s.length - 1);
    };
    const showPage = (dir) => {
      const u = st.s[st.i];
      urlPath.textContent = u; bump(urlEl);
      const pg = mkPage(u); view.replaceChildren(pg); relink();
      const from = dir === 'push' ? 'translateX(36px)' : dir === 'back' ? 'translateX(-36px)' : 'scale(.94)';
      try { pg.animate([{ opacity: 0, transform: from }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'ease-out' }); } catch (e) { /* 無くてもよい */ }
    };
    const setStart = (animDir) => {
      st = { s: SC[cur].start.s.slice(), i: SC[cur].start.i };
      view.classList.remove('blank');
      showPage(animDir || 'replace'); drawHist(-1, -1); markReg();
    };
    /* 履歴の操作。push＝先を切って追加、replace＝いまの1件を上書き、back＝位置を1つ戻す */
    const doNav = async (kind, T) => {
      let fresh = -1, rep = -1;
      if (kind === 'push') { st.s = st.s.slice(0, st.i + 1); st.s.push(T); st.i++; fresh = st.i; }
      else if (kind === 'replace') { st.s[st.i] = T; rep = st.i; }
      else if (kind === 'back') { if (st.i > 0) st.i--; }
      else if (kind === 'fwd') { if (st.i < st.s.length - 1) st.i++; }
      showPage(kind === 'fwd' ? 'push' : kind); drawHist(fresh, rep);
      await sleep(600);
    };
    const press = async (b, kind) => { b.classList.add('press'); await sleep(350); b.classList.remove('press'); await doNav(kind); };
    btnBack.onclick = () => { if (!busy && st.i > 0) { markReg(); doNav('back'); } };
    btnFwd.onclick = () => { if (!busy && st.i < st.s.length - 1) { doNav('fwd'); } };

    const fly = async (from, to, text, col) => {
      if (!from || !to) return;
      const pr = br.getBoundingClientRect(), a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
      const el = h('span', { class: 'vzC-pkt', style: { background: col } }, text); br.append(el);
      const w = el.offsetWidth, hh = el.offsetHeight;
      const pt = (r) => ({ x: r.left - pr.left + r.width / 2 - w / 2, y: r.top - pr.top + r.height / 2 - hh / 2 });
      const A = pt(a), B = pt(b);
      try { await el.animate([{ transform: `translate(${A.x}px,${A.y}px) scale(.6)`, opacity: 0 }, { transform: `translate(${A.x}px,${A.y}px) scale(1)`, opacity: 1, offset: .15 }, { transform: `translate(${B.x}px,${B.y}px) scale(1)`, opacity: 1, offset: .85 }, { transform: `translate(${B.x}px,${B.y}px) scale(.6)`, opacity: 0 }], { duration: 900, easing: 'ease-in-out' }).finished; } catch (e) { /* 途中で消えてもよい */ }
      el.remove();
    };
    const showCtx = async (target, ok) => {
      if (!target) return;
      const pr = br.getBoundingClientRect(), r = target.getBoundingClientRect();
      const m = h('div', { class: 'vzC-ctx ' + (ok ? 'ok' : 'ng'), style: { left: Math.max(8, r.left - pr.left + 24) + 'px', top: r.top - pr.top + r.height - 4 + 'px' } },
        h('div', null, '右クリック'), h('b', null, (ok ? '✓ ' : '✕ ') + '新しいタブで開く'));
      br.append(m); await sleep(1500); m.remove();
    };
    const bang = (text) => { const b = h('div', { class: 'vzC-bang' }, '⚠ ' + text); view.append(b); };

    /* ---- 右：問題・選択肢・コード ---- */
    const qBox = h('div', { class: 'vzC-q' });
    const codeHost = h('div');
    const dots = h('div', { class: 'vzC-dots' });
    let fbCls = '', fbTxt = '', tryKey = null;
    const cp = { cur: null, get lines() { return this.cur.lines; }, setHi(a, c) { this.cur.setHi(a, c); } };
    const MAPC = { reg: [], url: [], hist: ['const router = useRouter()'] };
    const leftCol = h('div', { class: 'vzC-wrap' });
    const relink = () => { if (cp.cur) K.vs.link(leftCol, cp, MAPC, { rest: () => [lineNo(SC[cur])], get cls() { return tryKey && tryKey !== SC[cur].ans ? 'err' : 'on'; } }); };
    const lineNo = (sc) => sc.pre.split('\n').length + 1;
    const drawCode = () => {
      const sc = SC[cur];
      const key = tryKey || (solved[cur] ? sc.ans : null);
      const line = key ? sc.ind + sc.L[key] : sc.ind + '// ← どれを使う？';
      const text = sc.pre + '\n' + line + '\n' + sc.post;
      const c = code(text, 'vue', { color: 'var(--vue)', file: sc.file, dim: true, edit: false });
      c.setHi([lineNo(sc)], key && key !== sc.ans ? 'err' : 'on');
      codeHost.replaceChildren(c); cp.cur = c; MAPC.reg = [line.trim()]; MAPC.url = [key ? sc.T : line.trim()];
      relink();
    };
    const draw = () => {
      const sc = SC[cur];
      qBox.replaceChildren(
        h('div', { class: 'vzC-qh' }, h('span', { class: 'n' }, NUM[cur]), h('b', sc.who)),
        h('div', { class: 'vzC-qt' }, sc.q),
        h('div', { class: 'vzC-ans' }, ...Object.keys(OPT).map((k) => {
          const b = h('button', { class: 'vzC-a' + (solved[cur] && k === sc.ans ? ' on' : '') + (tryKey === k && k !== sc.ans ? ' x' : ''), style: { '--c': OPT[k][2] } }, h('b', OPT[k][0]), h('small', OPT[k][1]));
          b.onclick = () => answer(k); return b;
        })),
        h('div', { class: 'vzC-fb ' + fbCls }, fbTxt || (solved[cur] ? '✓ ' + sc.why : '画面の ' + NUM[cur] + ' の場所を見て、使うものを選ぼう')));
      drawCode();
    };
    const paint = () => {
      dots.replaceChildren(...SC.map((_, i) => h('i', { class: (solved[i] ? 'ok ' : '') + (i === cur ? 'cur' : ''), title: SC[i].who, onclick: () => go(i) })), h('span', solved.every(Boolean) ? '🎉 全部つながった！' : solved.filter(Boolean).length + ' / ' + SC.length));
      draw();
    };
    const go = (i) => { if (busy) return; clearTimeout(timer); cur = i; tryKey = null; fbCls = ''; fbTxt = ''; setStart(); paint(); };

    const answer = async (k) => {
      if (busy) return;
      busy = true; clearTimeout(timer);
      const sc = SC[cur], ok = k === sc.ans, col = OPT[k][2];
      setStart(); // いつも最初の状態から
      tryKey = k; fbCls = ''; fbTxt = ok ? '' : '';
      rr().forEach((e) => e.classList.remove('cur'));
      draw();
      const r = reg(sc.reg);
      if (r) { r.classList.add('ok'); bump(r); }
      const kind = k === 'back' ? 'back' : k === 'replace' ? 'replace' : k === 'a' ? 'reload' : 'push';
      if ((k === 'push' || k === 'link') && (sc.reg === 'menu' || sc.reg === 'row')) await showCtx(r, k === 'link');
      await fly(r, kind === 'back' ? btnBack : urlEl, kind === 'back' ? '◀ −1' : sc.T, col);
      if (kind === 'reload') {
        view.classList.add('blank'); view.append(h('div', { class: 'vzC-flash' }, h('i'), 'ページ全体が再読み込み…'));
        await sleep(1000); view.classList.remove('blank');
        await doNav('push', sc.T);
      } else await doNav(kind, sc.T);
      const fb = qBox.querySelector('.vzC-fb');
      if (ok) {
        solved[cur] = true; tryKey = null; fbCls = 'ok'; fbTxt = '✓ ' + sc.why;
        paint();
        if (sc.demoOk) { await sleep(900); await press(btnBack, 'back'); bang(sc.demoOkText); }
      } else {
        fbCls = 'ng'; fbTxt = '✖ ' + (k === 'a' ? 'ページ全体を読み直す。入力中の内容や状態が消える。' : sc.ng[k]);
        qBox.classList.remove('shake'); void qBox.offsetWidth; qBox.classList.add('shake');
        paint();
        const dm = sc.demo && sc.demo[k];
        if (dm) { await sleep(700); await press(btnBack, 'back'); bang(dm); }
      }
      paint();
      void fb;
      busy = false;
      if (ok) { const nx = solved.findIndex((v) => !v); if (nx >= 0) timer = setTimeout(() => { if (!busy) go(nx); }, 4200); markReg(); rr().forEach((e) => e.classList.remove('cur')); }
      else {
        timer = setTimeout(() => { if (busy) return; tryKey = null; fbCls = ''; fbTxt = ''; setStart(); paint(); }, 3200);
      }
    };

    const reset = h('button', { class: 'btn ghost', onclick: () => { if (busy) return; solved.fill(false); go(0); } }, '⟲ やり直す');
    const next = h('button', { class: 'btn ghost', onclick: () => go((cur + 1) % SC.length) }, '次の場面 ▶');
    setStart('replace'); paint();

    style('vslHot', '[data-k].vs-hot{outline:2px solid var(--c,#2f7bff)!important;outline-offset:2px;background-color:color-mix(in srgb,var(--c,#2f7bff) 14%,transparent)}');
    style('vzC', `
    .vzC-wrap{display:grid;gap:10px;min-width:0}
    .vzC-bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .vzC-dots{display:flex;gap:8px;align-items:center}
    .vzC-dots i{width:14px;height:14px;border-radius:50%;background:var(--line);cursor:pointer;transition:.2s}
    .vzC-dots i.cur{background:var(--vue);transform:scale(1.3)}.vzC-dots i.ok{background:var(--ok)}
    .vzC-dots span{margin-left:8px;font:900 .9rem var(--mono);color:var(--mute)}
    .vzC-br{position:relative;border-radius:14px;border:2px solid var(--line);background:#e6e9f2;overflow:hidden;color:#223}
    .vzC-tb{display:flex;gap:8px;align-items:center;padding:9px 10px;background:#d5dae8}
    .vzC-nb{width:36px;height:34px;border-radius:9px;border:1px solid #b8bfd4;background:#fff;color:#223;font:900 .9rem var(--font);cursor:pointer;transition:.15s}
    .vzC-nb.off{opacity:.35;cursor:default}
    .vzC-nb.press{background:var(--vue);color:#06101f;transform:scale(1.2);box-shadow:0 0 0 5px color-mix(in srgb,var(--vue) 35%,transparent)}
    .vzC-url{flex:1;min-width:0;display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:99px;background:#fff;border:1px solid #b8bfd4;font:700 .9rem var(--mono);white-space:nowrap;overflow:hidden}
    .vzC-url .host{color:#778}.vzC-url b{color:#1d2b53;font-weight:900}
    .vzC-url.bump{animation:vzCu .8s}@keyframes vzCu{20%{background:#d8f7e6;box-shadow:0 0 0 4px color-mix(in srgb,var(--ok) 50%,transparent)}}
    .vzC-site{background:#f4f6fb}
    .vzC-nav{display:flex;gap:18px;align-items:center;padding:11px 16px;background:#1d2b53;color:#fff;font:800 .95rem var(--font)}
    .vzC-nav .logo{margin-right:auto;font-weight:900}
    .vzC-view{position:relative;min-height:272px;padding:16px;transition:opacity .2s}
    .vzC-view.blank>.vzC-pgc{opacity:0}
    .vzC-pgc{display:grid;gap:11px;align-content:start}
    .vzC-pgc h3{margin:0;font:900 1.2rem var(--font)}.vzC-pgc p{margin:0;font:700 .92rem var(--font);color:#556}
    .vzC-fld{display:grid;gap:3px}.vzC-fld small{font:800 .85rem var(--font);color:#667}
    .vzC-fld span{padding:9px 12px;border-radius:8px;background:#fff;border:1px solid #c7ccdd;font:700 .95rem var(--font)}
    .vzC-btn{justify-self:start;border:0;border-radius:9px;padding:.65em 1.6em;background:#2f7bff;color:#fff;font:900 .95rem var(--font)}
    .vzC-btn.ghost{background:#e3e7f3;color:#223}
    .vzC-two{display:flex;gap:10px;flex-wrap:wrap}
    .vzC-row{display:flex;gap:10px;align-items:center;padding:12px 14px;border-radius:10px;background:#fff;border:1px solid #d7dbe8;font-size:.95rem}
    .vzC-row b{flex:1;font-weight:800}.vzC-row small{padding:.1em .7em;border-radius:99px;background:#e3e9ff;color:#2f5fd0;font-weight:800;font-size:.85rem}.vzC-row i{font-style:normal;font-weight:900;color:#99a}
    .vzC-cta{justify-self:start;padding:.6em 1.4em;border-radius:99px;background:#2f7bff;color:#fff;font:900 .95rem var(--font)}
    .vzC-crumb{font:800 .85rem var(--font);color:#778}
    .vzC-done{display:grid;justify-items:center;gap:6px;padding:20px 0}.vzC-done b{width:56px;height:56px;border-radius:50%;background:#2fbf71;color:#fff;display:grid;place-items:center;font-size:1.9rem}
    .vzC-r{position:relative;border-radius:10px;outline:3px solid transparent;outline-offset:3px;transition:outline-color .2s,background .2s}
    .vzC-nav .vzC-r{padding:2px 10px;outline-offset:1px;border-radius:99px}
    .vzC-r.cur{outline-color:var(--vue);background:color-mix(in srgb,var(--vue) 16%,transparent);animation:vzCp 1.2s ease-in-out infinite}
    .vzC-r.cur::before{content:'👆';position:absolute;right:-8px;bottom:-16px;font-size:1.2rem;z-index:2}
    .vzC-r.ok{outline-color:var(--ok);background:color-mix(in srgb,var(--ok) 18%,transparent)}
    @keyframes vzCp{50%{outline-color:transparent}}
    .bump{animation:vzCb .7s}@keyframes vzCb{30%{transform:scale(1.08);box-shadow:0 0 0 5px color-mix(in srgb,var(--ok) 45%,transparent)}}
    .vzC-pkt{position:absolute;left:0;top:0;z-index:9;padding:.25em .9em;border-radius:99px;color:#06101f;font:900 .9rem var(--mono);box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap}
    .vzC-ctx{position:absolute;z-index:8;display:grid;gap:4px;padding:8px 12px;border-radius:10px;background:#fff;border:2px solid;box-shadow:0 8px 24px rgba(0,0,0,.3);font:800 .9rem var(--font);animation:vzCpop .25s}
    .vzC-ctx div{font-size:.85rem;color:#778}.vzC-ctx.ok{border-color:var(--ok);color:#12804a}.vzC-ctx.ng{border-color:var(--bad);color:#c0283a}.vzC-ctx.ng b{text-decoration:line-through}
    @keyframes vzCpop{from{opacity:0;transform:scale(.8)}}
    .vzC-flash{position:absolute;inset:0;display:grid;place-content:center;justify-items:center;gap:10px;background:rgba(255,255,255,.88);font:900 1.05rem var(--font);color:#c0283a;z-index:5}
    .vzC-flash i{width:34px;height:34px;border-radius:50%;border:4px solid #ccd;border-top-color:#c0283a;animation:vzCsp .7s linear infinite}
    @keyframes vzCsp{to{transform:rotate(360deg)}}
    .vzC-bang{position:absolute;left:12px;right:12px;bottom:12px;z-index:4;padding:.7em 1em;border-radius:10px;background:#fff0f2;border:2px solid var(--bad);color:#c0283a;font:900 1rem var(--font);text-align:center;animation:vzCpop .3s}
    .vzC-hs{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:10px 12px;border-radius:12px;background:var(--card);border:2px solid var(--line)}
    .vzC-hs .arr{color:var(--mute);font-weight:900}
    .vzC-hs .chip{display:grid;justify-items:center;gap:1px;padding:.35em .8em;border-radius:10px;border:2px solid var(--line);background:var(--card2,transparent);transition:.25s}
    .vzC-hs .chip b{font:800 .9rem var(--mono)}.vzC-hs .chip small{font:700 .85rem var(--font);color:var(--mute)}
    .vzC-hs .chip em{font:900 .85rem var(--font);font-style:normal;color:#06101f;background:var(--vue);border-radius:99px;padding:0 .7em}
    .vzC-hs .chip.cur{border-color:var(--vue);background:color-mix(in srgb,var(--vue) 16%,var(--card))}
    .vzC-hs .chip.fwd{opacity:.45;border-style:dashed}
    .vzC-hs .chip.new{animation:vzCin .6s}.vzC-hs .chip.rep{animation:vzCrep .7s}
    @keyframes vzCin{from{opacity:0;transform:translateX(-24px) scale(.7)}}
    @keyframes vzCrep{30%{transform:rotateX(90deg);background:var(--pink)}}
    .vzC-q{border:2px solid var(--vue);border-radius:14px;background:var(--card);padding:16px 18px;display:grid;gap:12px}
    .vzC-q.shake{animation:vzCs .35s}@keyframes vzCs{25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
    .vzC-qh{display:flex;gap:10px;align-items:center}.vzC-qh .n{width:30px;height:30px;border-radius:50%;background:var(--vue);color:#06101f;display:grid;place-items:center;font:900 1rem var(--font)}
    .vzC-qh b{font:900 1.05rem var(--font)}
    .vzC-qt{font:800 1.2rem/1.6 var(--font)}
    .vzC-ans{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
    .vzC-a{display:grid;gap:2px;justify-items:center;padding:.75em .4em;border-radius:12px;border:2px solid var(--c);background:transparent;color:var(--c);cursor:pointer;transition:.15s}
    .vzC-a b{font:900 1rem var(--mono)}.vzC-a small{font:700 .85rem var(--font);opacity:.9}
    .vzC-a:hover{background:color-mix(in srgb,var(--c) 16%,transparent)}
    .vzC-a.on{background:var(--c);color:#06101f}
    .vzC-a.x{opacity:.4;text-decoration:line-through}
    .vzC-fb{font:800 .95rem/1.6 var(--font);color:var(--mute);min-height:3.2em}
    .vzC-fb.ok{color:var(--ok)}.vzC-fb.ng{color:var(--bad)}
    `);

    scene.lead = '<b>人が押す</b>なら RouterLink、<b>コードが決める</b>なら push / replace。画面を見て選ぶ。';
    scene.tag = '選び方';
    delete scene.why;
    scene.render = (el) => {
      clearTimeout(timer); busy = false; tryKey = null; fbCls = ''; fbTxt = ''; setStart(); paint();
      el.append(h('div', { class: 'vzC-wrap' },
        h('div', { class: 'vzC-bar' }, dots, h('span', { style: { flex: 1 } }), next, reset),
        h('div', { class: 'vi-eq' },
          (leftCol.replaceChildren(h('div', { class: 'vi-lb' }, '👀 ミニブラウザ（' + NUM + ' が問題の場所。◀ ▶ も押せる）'), br, hist), leftCol),
          h('div', { class: 'vzC-wrap' }, qBox, codeHost))));
      relink();
    };
  }
})();
