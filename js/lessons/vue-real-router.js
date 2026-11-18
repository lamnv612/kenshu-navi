/* vue-router：実例シーン（ミニブラウザ＋URLバー）。vue-router のシーンの「実践」の直前に差し込む。 */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.W) return;
  const { h, code, style, sleep } = K.W;

  style('vslHot', '[data-k].vs-hot{outline:2px solid var(--c,#2f7bff)!important;outline-offset:2px;background-color:color-mix(in srgb,var(--c,#2f7bff) 14%,transparent)}');
  style('vrR', `
  .vrR-win{border:2px solid var(--line);border-radius:12px;overflow:hidden;background:var(--card);min-width:0}
  .vrR-bar{display:flex;gap:6px;align-items:center;padding:8px 10px;background:var(--card2);border-bottom:1px solid var(--line)}
  .vrR-nb{width:30px;height:30px;border-radius:8px;border:1px solid var(--line);background:var(--card);color:inherit;font-weight:900;cursor:pointer;font-size:1rem}
  .vrR-nb:disabled{opacity:.3;cursor:default}
  .vrR-url{flex:1;min-width:0;display:flex;align-items:center;gap:4px;padding:0 10px;height:30px;border-radius:15px;border:1.5px solid var(--line);background:var(--card);font:700 .8rem var(--mono);transition:.25s}
  .vrR-url input{flex:1;min-width:0;border:0;background:transparent;color:inherit;font:inherit;outline:0}
  .vrR-url.pend{border-color:var(--bad);box-shadow:0 0 0 3px color-mix(in srgb,var(--bad) 25%,transparent)}
  .vrR-url.flash{border-color:var(--team);box-shadow:0 0 0 3px color-mix(in srgb,var(--team) 30%,transparent)}
  .vrR-url.ok{border-color:var(--ok)}
  .vrR-page{position:relative;background:#f4f6fb;color:#223;padding:14px;min-height:250px;display:grid;gap:10px;align-content:start}
  .vrR-nav{display:flex;gap:14px;font-weight:800;font-size:.9rem;border-bottom:1px solid #d6dbe8;padding-bottom:8px;flex-wrap:wrap}
  .vrR-nav a,.vrR-a{color:#2563c9;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
  .vrR-nav a.on{color:#223;text-decoration:none;border-bottom:3px solid var(--vue)}
  .vrR-tag{justify-self:end;font:800 .7rem var(--mono);padding:.2em .7em;border-radius:6px;border:1.5px dashed var(--vue);color:#0a7a52;background:#fff}
  .vrR-row{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:9px 12px;border-radius:9px;background:#fff;border:1.5px solid #d6dbe8;font-weight:700;font-size:.88rem}
  .vrR-row:hover{border-color:var(--vue)}
  .vrR-page h3{margin:0;font-size:1rem}
  .vrR-kv{display:grid;grid-template-columns:5em 1fr;gap:6px;font-size:.86rem;background:#fff;padding:10px 12px;border-radius:9px;border:1.5px solid #d6dbe8}
  .vrR-btn{padding:.5em 1.1em;border-radius:8px;border:0;background:var(--vue);color:#06101f;font:900 .86rem var(--font);cursor:pointer;justify-self:start}
  .vrR-in{padding:.45em .7em;border:1.5px solid #cfd4e2;border-radius:7px;background:#fff;color:#888;font-size:.84rem}
  .vrR-st{display:flex;gap:8px}.vrR-st b{flex:1;background:#fff;border:1.5px solid #d6dbe8;border-radius:9px;padding:10px;text-align:center;font-size:.8rem}.vrR-st b i{display:block;font:900 1.5rem var(--font);font-style:normal;color:#e0475b}
  .vrR-page.swap{animation:vrRs .35s}
  @keyframes vrRs{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:none}}
  .vrR-rd{display:flex;gap:8px;align-items:center;flex-wrap:wrap;min-height:44px;padding:8px 12px;border-radius:10px;background:var(--card);border:1px solid var(--line);font:800 .85rem var(--mono)}
  .vrR-rd b{color:var(--vue)}.vrR-rd .k{color:var(--mute);font-weight:700}
  .vrR-id{padding:.15em .7em;border-radius:6px;background:color-mix(in srgb,var(--ts) 22%,var(--card2));color:var(--ts);transition:.2s}
  .vrR-id.bump{animation:vrRb .5s}
  @keyframes vrRb{40%{transform:scale(1.25);background:var(--ts);color:#06101f}}
  .vrR-trace{display:flex;gap:6px;align-items:center;flex-wrap:wrap;min-height:44px;padding:8px 12px;border-radius:10px;background:var(--card2);border:1px solid var(--line);font:800 .85rem var(--mono)}
  .vrR-n{padding:.25em .7em;border-radius:7px;border:2px solid var(--line);background:var(--card);animation:vrRp .4s}
  .vrR-n.ng{border-color:var(--bad);color:var(--bad);text-decoration:line-through}
  .vrR-n.ok{border-color:var(--ok);color:var(--ok)}
  .vrR-n.rd{border-color:var(--team);color:var(--team)}
  .vrR-ar{color:var(--mute);animation:vrRp .4s}.vrR-ar.g{color:var(--team)}
  @keyframes vrRp{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}
  .vrR-sw{display:flex;border-radius:10px;overflow:hidden;border:2px solid var(--line);width:max-content}
  .vrR-sw>span{white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;gap:.4em;min-height:40px;padding:0 1.2em;font:800 .9rem var(--font);cursor:pointer;background:var(--card2);color:var(--mute)}
  .vrR-sw>span.on{background:var(--ok);color:#06101f}.vrR-sw>span.on.out{background:var(--bad);flex-direction:row;border-left:0;color:#06101f}
  .vrR-col{display:grid;gap:10px;min-width:0;align-content:start}
  .vrR-col pre.code{margin:0;max-width:100%;overflow-x:auto}
  `);

  const CASES = { 101: ['離婚の相談', '家事', '佐藤 弁護士'], 205: ['相続の相談', '相続', '鈴木 弁護士'], 318: ['労働問題の相談', '労働', '高橋 弁護士'] };
  const ROUTES_SRC = "import type { RouteRecordRaw } from 'vue-router'\nimport CaseList from '@/views/CaseList.vue'\nimport CaseDetail from '@/views/CaseDetail.vue'\nimport LoginView from '@/views/LoginView.vue'\nimport AdminView from '@/views/AdminView.vue'\n\nexport const routes: RouteRecordRaw[] = [\n  {\n    path: '/',\n    component: CaseList,\n  },\n  {\n    path: '/cases/:id',\n    component: CaseDetail,\n  },\n  {\n    path: '/login',\n    component: LoginView,\n  },\n  {\n    path: '/admin',\n    component: AdminView,\n    meta: { requiresAuth: true },\n  },\n]";
  const RECS = [['/', 'CaseList'], ['/cases/:id', 'CaseDetail'], ['/login', 'LoginView'], ['/admin', 'AdminView']];
  const lineOf = (src, s, from) => src.split('\n').findIndex((l, i) => i >= (from || 0) && l.includes(s)) + 1;
  const recLines = (i) => { const p = lineOf(ROUTES_SRC, "path: '" + RECS[i][0] + "'"); const r = [p, p + 1]; if (i === 3) r.push(p + 2); return r; };

  /* ミニブラウザ。route 表・認証・履歴を内部で持つ（SPA の location.hash は触らない） */
  function browser(o) {
    const st = { hist: ['/'], idx: 0, auth: false, busy: false };
    const url = h('input', { spellcheck: false });
    const urlBox = h('div', { class: 'vrR-url', 'data-k': 'url' }, '🔒', url);
    const back = h('button', { class: 'vrR-nb', title: '戻る' }, '←'), fwd = h('button', { class: 'vrR-nb', title: '進む' }, '→');
    const page = h('div', { class: 'vrR-page' });
    const win = h('div', { class: 'vrR-win' }, h('div', { class: 'vrR-bar' }, back, fwd, urlBox), page);
    const parse = (full) => {
      const [path, qs] = full.split('?'); const q = {}; (qs || '').split('&').filter(Boolean).forEach((p) => { const [k, v] = p.split('='); q[k] = v; });
      let rec = -1, params = {}; const m = path.match(/^\/cases\/([^/]+)$/);
      if (path === '/') rec = 0; else if (m) { rec = 1; params.id = m[1]; } else if (path === '/login') rec = 2; else if (path === '/admin') rec = 3;
      return { full, path, query: q, rec, params };
    };
    const cur = () => parse(st.hist[st.idx]);
    const link = (to, text, cls) => h('a', { class: cls || 'vrR-a', 'data-k': (() => { const q = parse(to); return q.rec >= 0 ? 'r' + q.rec : null; })(), onclick: (e) => { e.preventDefault(); go(to, 'push', true); } }, text);
    const draw = (r) => {
      const nav = h('div', { class: 'vrR-nav' }, ...o.nav.map(([to, t]) => { const a = link(to, t, ''); if ((to === '/' && r.path === '/') || (to !== '/' && r.path.startsWith(to))) a.classList.add('on'); return a; }), h('span', { 'data-k': 'who', style: { marginLeft: 'auto', color: st.auth ? '#0a7a52' : '#888', fontWeight: 700 } }, st.auth ? '👤 佐藤 さん' : '未ログイン'));
      let body;
      if (r.rec === 0) body = [h('h3', '相談一覧'), ...Object.keys(CASES).map((id) => h('div', { class: 'vrR-row' }, '#' + id + '　' + CASES[id][0], link('/cases/' + id, '詳細 →')))];
      else if (r.rec === 1) { const c = CASES[r.params.id]; body = [h('h3', '相談 #' + r.params.id + (c ? '　' + c[0] : '')), c ? h('div', { class: 'vrR-kv' }, h('b', '分野'), h('span', c[1]), h('b', '担当'), h('span', c[2]), h('b', '状態'), h('span', '対応中')) : h('div', { class: 'vrR-row' }, 'この番号の相談は見つかりません'), link('/', '← 一覧へ')]; }
      else if (r.rec === 2) body = [h('h3', 'ログイン'), h('div', { class: 'vrR-in' }, 'sato@example.jp'), h('div', { class: 'vrR-in' }, '••••••••'), h('button', { class: 'vrR-btn', 'data-k': 'btn', onclick: () => login() }, 'ログイン')];
      else if (r.rec === 3) body = [h('h3', '管理画面'), h('div', { class: 'vrR-st' }, h('b', '未対応', h('i', '12')), h('b', '対応中', h('i', '5')), h('b', '今月完了', h('i', '31')))];
      else body = [h('h3', '404'), h('div', { class: 'vrR-row' }, '一致するルートがありません')];
      page.replaceChildren(nav, r.rec >= 0 ? h('span', { class: 'vrR-tag', 'data-k': 'tag' }, '<RouterView /> → ' + RECS[r.rec][1] + '.vue') : null, ...body);
      page.classList.remove('swap'); void page.offsetWidth; page.classList.add('swap');
    };
    const show = () => { const r = cur(); url.value = r.full; back.disabled = st.idx === 0; fwd.disabled = st.idx >= st.hist.length - 1; draw(r); o.onRoute && o.onRoute(r, st); };
    const guard = (to) => to.rec === 3 && !st.auth ? '/login?redirect=' + to.path : null;
    async function go(full, mode, fresh) {
      if (st.busy) return; st.busy = true;
      const to = parse(full), red = guard(to);
      o.onNav && o.onNav({ to, red, fresh });
      if (red) {
        urlBox.classList.add('pend'); url.value = full;
        o.onGuard && o.onGuard('check', to);
        await sleep(650);
        urlBox.classList.remove('pend'); urlBox.classList.add('flash');
        o.onGuard && o.onGuard('redirect', to);
        full = red; await sleep(250);
        setTimeout(() => urlBox.classList.remove('flash'), 700);
        mode = 'replace';
      } else if (o.onGuard) o.onGuard('pass', to);
      if (mode === 'push') { st.hist = st.hist.slice(0, st.idx + 1); st.hist.push(full); st.idx++; } else if (mode === 'replace') st.hist[st.idx] = full;
      show(); st.busy = false; o.onDone && o.onDone(parse(full), !!red);
    }
    async function login() { st.auth = true; o.onLogin && o.onLogin(); const n = cur().query.redirect; await go(n || '/', 'push'); }
    back.onclick = () => { if (st.idx > 0 && !st.busy) { st.idx--; show(); } };
    fwd.onclick = () => { if (st.idx < st.hist.length - 1 && !st.busy) { st.idx++; show(); } };
    url.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') go(url.value.trim().replace(/^https?:\/\/[^/]+/, '') || '/', 'push', true); });
    return {
      el: win, st, go, show, cur, urlBox,
      setAuth(v) { st.auth = v; if (cur().rec === 3 && !v) go('/admin', 'replace', true); else show(); },
    };
  }

  const bumpEl = (e) => { e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump'); };

  /* ============ A：URL ⇄ ルート表 ============ */
  function sceneA(el) {
    const routes = code(ROUTES_SRC, 'ts', { color: 'var(--vue)', file: 'router/routes.ts', dim: true, edit: false });
    const DET = "const route = useRoute()\nconst id = computed(() => Number(route.params.id))";
    const det = code(DET, 'ts', { color: 'var(--ts)', file: 'CaseDetail.vue', dim: true, edit: false });
    const comp = h('b', '—'), path = h('span', { 'data-k': 'route' }, '/'), pid = h('span', { class: 'vrR-id', 'data-k': 'id' }, '—');
    const rd = h('div', { class: 'vrR-rd' }, h('span', { class: 'k' }, 'route.path'), path, h('span', { class: 'k' }, 'params.id'), pid, h('span', { class: 'k' }, '→'), comp);
    let lastId, curHi = [], detHi = [];
    const RT = (i) => { const p = lineOf(ROUTES_SRC, "path: '" + RECS[i][0] + "'"); return ["path: '" + RECS[i][0] + "'", 'component: ' + RECS[i][1] + ',', ...(i === 3 ? ['meta: {'] : [])]; };
    const MAPA = { r0: RT(0), r1: RT(1), r2: RT(2), r3: RT(3), url: [], tag: [] };
    let left = null;
    const relink = () => { if (left) K.vs.link(left, routes, MAPA, { rest: () => curHi }); };
    const B = browser({
      nav: [['/', '相談一覧'], ['/cases/205', '相談詳細'], ['/login', 'ログイン']],
      onRoute(r) {
        path.textContent = r.path;
        curHi = r.rec >= 0 ? recLines(r.rec) : []; routes.setHi(curHi);
        MAPA.url = MAPA.tag = r.rec >= 0 ? RT(r.rec) : [];
        comp.textContent = r.rec >= 0 ? RECS[r.rec][1] + '.vue' : '（一致なし）';
        const id = r.params.id; pid.textContent = id ? "'" + id + "'" : '—';
        detHi = r.rec === 1 ? [2] : []; det.setHi(detHi); if (id !== lastId && id) bumpEl(pid); lastId = id;
        relink();
      },
    });
    B.show();
    const chips = h('div', { class: 'vi-row' }, ...[101, 205, 318, 999].map((id) => h('span', { class: 'vi-chip', style: { '--cc': 'var(--ts)' }, onclick: () => B.go('/cases/' + id, 'push', true) }, '/cases/' + id)));
    left = h('div', { class: 'vrR-col' }, B.el, rd, chips, det);
    el.append(h('div', { class: 'vi-eq' }, left, h('div', { class: 'vrR-col' }, routes)));
    relink();
    K.vs.link(rd, det, { id: ['route.params.id', 'const id'], route: ['useRoute()'] }, { rest: () => detHi });
  }

  /* ============ B：ガードのリダイレクト ============ */
  function sceneB(el) {
    const GUARD = "router.beforeEach((to) => {\n  const auth = useAuthStore()\n  if (to.meta.requiresAuth && !auth.loggedIn) {\n    return {\n      path: '/login',\n      query: { redirect: to.fullPath },\n    }\n  }\n})";
    const LOGIN = "async function login() {\n  await auth.login(id.value, password.value)\n  const next = route.query.redirect as string | undefined\n  await router.push(next ?? '/')\n}";
    const g = code(GUARD, 'ts', { color: 'var(--team)', file: 'router/guard.ts', dim: true, edit: false });
    const l = code(LOGIN, 'ts', { color: 'var(--ok)', file: 'LoginView.vue', dim: true, edit: false });
    const trace = h('div', { class: 'vrR-trace', 'data-k': 'redir' }, h('span', { style: { color: 'var(--mute)' } }, '経路：リンクを押してみよう'));
    const add = (t, c, g2) => { if (trace.firstChild && trace.firstChild.tagName === 'SPAN' && !trace.firstChild.className) trace.replaceChildren(); if (trace.children.length) trace.append(h('span', { class: 'vrR-ar' + (g2 ? ' g' : '') }, g2 ? '⤷' : '→')); trace.append(h('span', { class: 'vrR-n ' + (c || '') }, t)); };
    const sw = h('div', { class: 'vrR-sw' });
    let gHi = [], lHi = [], left = null;
    const hg = (a) => { gHi = a; g.setHi(a); }, hl = (a) => { lHi = a; l.setHi(a); };
    const gn = GUARD.split('\n').length;
    const pp = { get lines() { return g.lines.concat(l.lines); }, setHi(a, c) { g.setHi(a.filter((n) => n <= gn), c); l.setHi(a.filter((n) => n > gn).map((n) => n - gn), c); } };
    const MAPB = { auth: ['useAuthStore', 'auth.loggedIn'], btn: ['async function login', 'await auth.login'], r3: ['to.meta.requiresAuth'], url: ['router.beforeEach'], redir: ["path: '/login'", 'redirect: to.fullPath', 'route.query.redirect'] };
    const relink = () => { if (left) K.vs.link(left, pp, MAPB, { rest: () => gHi.concat(lHi.map((n) => n + gn)) }); };
    const B = browser({
      nav: [['/', '相談一覧'], ['/admin', '管理画面'], ['/login', 'ログイン']],
      onNav({ to, fresh }) { if (fresh) { trace.replaceChildren(); hg([]); hl([]); } },
      onGuard(k, to) {
        if (k === 'check') { hg([lineOf(GUARD, 'if (')]); add(to.full, 'ng'); }
        else if (k === 'redirect') { { const r0 = lineOf(GUARD, 'return {'); hg([r0, r0 + 1, r0 + 2, r0 + 3]); }; add('/login?redirect=' + to.path, 'rd', true); }
        else if (k === 'pass' && to.rec === 3) { hg([lineOf(GUARD, 'if (')]); add(to.full, 'ok'); }
        else if (k === 'pass' && trace.children.length === 0 && to.rec >= 0) add(to.full, to.rec === 2 ? '' : 'ok');
      },
      onLogin() { hl([lineOf(LOGIN, 'const next'), lineOf(LOGIN, 'router.push')]); hg([]); },
      onRoute(r, s) { sync(s.auth); relink(); },
    });
    const sync = (a) => { sw.replaceChildren(h('span', { 'data-k': 'auth', class: !a ? 'on out' : '', onclick: () => B.setAuth(false) }, '🔒 未ログイン'), h('span', { 'data-k': 'auth', class: a ? 'on' : '', onclick: () => B.setAuth(true) }, '✓ ログイン済み')); };
    B.show();
    const origLogin = B.st; void origLogin;
    left = h('div', { class: 'vrR-col' }, sw, B.el, trace);
    el.append(h('div', { class: 'vi-eq' }, left, h('div', { class: 'vrR-col' }, g, l)));
    relink();
  }

  function install() {
    const L = K.lessons && K.lessons['vue-router'];
    if (!L) return false;
    if (L.scenes.some((s) => s.t === '実例：URLとルート表')) return true;
    const A = { t: '実例：URLとルート表', tag: '実例', lead: 'URL を変えると、<b>一致した1件</b>だけが光って画面が入れ替わる。', render: sceneA };
    const Bs = { t: '実例：ガードで /login へ', tag: '実例', lead: '未ログインで <b>/admin</b> を開くと、<b>beforeEach</b> が /login へ飛ばす。', render: sceneB };
    let i = L.scenes.findIndex((s) => s.t === '実践：ルーターを動かす'); if (i < 0) i = L.scenes.length;
    L.scenes.splice(i, 0, A, Bs);
    return true;
  }
  let n = 0; (function wait() { if (!install() && n++ < 100) setTimeout(wait, 50); })();
})();
