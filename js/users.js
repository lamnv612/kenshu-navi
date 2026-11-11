/* 研修ナビ — ニックネーム・ユーザー別の進捗・管理画面（ブラウザ内保存のみ） */
(function () {
  'use strict';
  const K = window.KENSHU, { h, store, modal, icon } = K.W;
  const PREFIX = 'kenshu.v1.u.';
  const ADMIN = '@admin';
  const ADMIN_HASH = '7676aaafb027c825bd9abab78b234070e702752f625b752e55e55b48e607e358';
  const IMPORT_KEY = 'kenshu.imported'; // 管理者が取り込んだ他端末の進捗

  const ls = {
    get: (k) => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch {} },
    del: (k) => { try { localStorage.removeItem(k); } catch {} },
    keys: () => { try { return Object.keys(localStorage); } catch { return []; } },
  };

  async function sha256(t) {
    try {
      const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
      return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
    } catch { return ''; }
  }

  const U = (K.users = {
    current: () => store.user(),
    isAdmin: () => store.user() === ADMIN,
    label: () => (U.isAdmin() ? '管理者' : store.user()),
    list: () => ls.keys().filter((k) => k.startsWith(PREFIX)).map((k) => k.slice(PREFIX.length)).filter((n) => n !== ADMIN),
    async login(raw) {
      const name = (raw || '').trim();
      if (!name) return '名前を入力してください';
      if ((await sha256(name)) === ADMIN_HASH) { ls.set('kenshu.user', ADMIN); try { sessionStorage.setItem('kenshu.akey', name); } catch {} return ''; }
      if (/^admin/i.test(name)) return 'この名前は使えません';
      if (name.length > 20) return '20文字までです';
      if (/^[@]/.test(name)) return '先頭に @ は使えません';
      // 初めての人で、以前の保存データがあれば引き継ぐ
      const legacy = ls.get('kenshu.v1');
      if (legacy && !U.list().length && !ls.get(PREFIX + name)) ls.set(PREFIX + name, legacy);
      if (!ls.get(PREFIX + name)) store.write({ created: Date.now() }, name);
      ls.set('kenshu.user', name);
      return '';
    },
    logout() { ls.del('kenshu.user'); },
  });

  /* ---------- progress helpers ---------- */
  const lessons = () => Object.values(K.lessons).filter((l) => l.track !== 'extra').concat(Object.values(K.lessons).filter((l) => l.track === 'extra'));
  const total = () => lessons().reduce((n, l) => n + l.scenes.length, 0);
  function summaryOf(d) {
    const seen = d.seen || {};
    const per = lessons().map((l) => ({ id: l.id, title: l.title, n: l.scenes.length, done: Math.min(l.scenes.length, new Set(seen[l.id] || []).size) }));
    const done = per.reduce((n, x) => n + x.done, 0);
    return { per, done, pct: Math.round((done / (total() || 1)) * 100), last: d._last || 0 };
  }
  const ago = (t) => {
    if (!t) return '—';
    const m = Math.floor((Date.now() - t) / 60000);
    if (m < 1) return 'たった今';
    if (m < 60) return m + '分前';
    if (m < 1440) return Math.floor(m / 60) + '時間前';
    return new Date(t).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }) + ' (' + Math.floor(m / 1440) + '日前)';
  };
  const imported = () => { try { return JSON.parse(ls.get(IMPORT_KEY)) || {}; } catch { return {}; } };
  const saveImported = (o) => ls.set(IMPORT_KEY, JSON.stringify(o));

  let cloudRows = [], cloudMsg = '';
  function rows() {
    const out = {};
    cloudRows.forEach((p) => { const s = summaryOf({ seen: p.s, _last: p.t }); out[p.n] = { nick: p.n, src: 'cloud', ...s, data: { seen: p.s, _last: p.t } }; });
    U.list().forEach((n) => { out[n] = { nick: n, src: 'local', ...summaryOf(store.read(n)), data: store.read(n) }; });
    Object.entries(imported()).forEach(([n, p]) => {
      const s = summaryOf({ seen: p.s, _last: p.t });
      if (!out[n] || s.last > out[n].last) out[n] = { nick: n, src: 'import', ...s, data: { seen: p.s, _last: p.t } };
    });
    return Object.values(out).sort((a, b) => b.last - a.last);
  }

  /* ---------- 進捗コード（生徒 → 先生） ---------- */
  const enc = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const dec = (t) => { t = t.trim().replace(/-/g, '+').replace(/_/g, '/'); while (t.length % 4) t += '='; return JSON.parse(decodeURIComponent(escape(atob(t)))); };
  const CFG = window.KENSHU_CONFIG || {};
  const base = () => location.href.split('#')[0];
  function importCode(line) {
    const o = dec(String(line).replace(/^.*#\/p\//, '').replace(/^KENSHU1:/, ''));
    if (!o.n || typeof o.s !== 'object') throw new Error('bad');
    const cur = imported(); cur[String(o.n).slice(0, 40)] = { t: o.t || Date.now(), s: o.s }; saveImported(cur); return o.n;
  }
  U.consumePending = () => { let c = null; try { c = sessionStorage.getItem('kenshu.pending'); sessionStorage.removeItem('kenshu.pending'); } catch {} if (!c) return false; try { importCode(c); return true; } catch { return false; } };

  /* ---- 自動送信（Firebase Realtime Database・REST） ---- */
  const FB = CFG.firebase && CFG.firebase.databaseURL && CFG.firebase.apiKey ? CFG.firebase : null;
  const DB = FB ? FB.databaseURL.replace(/\/$/, '') : '';
  const fbKey = (n) => encodeURIComponent(n).replace(/\./g, '%2E');
  let timer = 0, lastSent = 0, tok = null;
  async function push() {
    if (!FB || !store.user() || U.isAdmin()) return false;
    const d = store.read();
    try { const r = await fetch(`${DB}/progress/${fbKey(store.user())}.json`, { method: 'PUT', keepalive: true, body: JSON.stringify({ n: store.user(), t: d._last || Date.now(), s: d.seen || {} }) }); if (r.ok) lastSent = Date.now(); return r.ok; } catch { return false; }
  }
  store.after = () => { if (!FB) return; clearTimeout(timer); timer = setTimeout(push, 2000); };
  if (FB) { // ページを開いた時・閉じる時にも送る（デバウンス待ちで取りこぼさない）
    setTimeout(() => { if (store.user() && !U.isAdmin()) push(); }, 1200);
    document.addEventListener('visibilitychange', () => { if (document.hidden && store.user() && !U.isAdmin()) push(); });
  }
  const token = () => { try { tok = tok || JSON.parse(sessionStorage.getItem('kenshu.fbtok')); } catch {} return tok && tok.exp > Date.now() ? tok.t : null; };
  async function adminSignIn(email, pass) {
    const r = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + FB.apiKey, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: pass, returnSecureToken: true }) });
    const j = await r.json(); if (!r.ok) throw new Error('auth');
    tok = { t: j.idToken, exp: Date.now() + (+j.expiresIn - 60) * 1000 }; try { sessionStorage.setItem('kenshu.fbtok', JSON.stringify(tok)); } catch {}
  }
  async function cloud() {
    if (!FB) return null;
    const t = token(); if (!t) throw new Error('login');
    const r = await fetch(`${DB}/progress.json?auth=${t}`);
    if (r.status === 401 || r.status === 403) { tok = null; throw new Error('login'); }
    const j = await r.json(); return Object.values(j || {}).filter((x) => x && x.n);
  }
  async function cloudDel(nick) { const t = token(); if (!FB || !t) return; try { await fetch(`${DB}/progress${nick ? '/' + fbKey(nick) : ''}.json?auth=${t}`, { method: 'DELETE' }); } catch {} }
  function myCode() {
    const d = store.read();
    return enc({ n: store.user(), t: d._last || Date.now(), s: d.seen || {} });
  }
  const copy = async (t, btn) => {
    try { await navigator.clipboard.writeText(t); btn.textContent = 'コピーしました'; } catch { btn.textContent = '選択してコピーしてください'; }
  };

  function sendModal() {
    if (FB) {
      const st = h('p', { class: 'u-err', style: { color: 'var(--ok)' } }, lastSent ? '送りました' : '');
      modal({ title: '進捗は自動で先生に届きます', icon: 'send', narrow: true, content: () => h('div', { class: 'col' },
        h('p', 'ページを進めると、少し後に自動で送られます。何もしなくて大丈夫です。'), st,
        h('button', { class: 'btn primary', onclick: async () => { st.textContent = (await push()) ? '送りました' : '送れませんでした'; } }, icon('send'), '今すぐ送る')) });
      return;
    }
    const link = base() + '#/p/' + myCode();
    const ta = h('textarea', { class: 'u-code', readonly: true, rows: 4 }, link);
    const cp = h('button', { class: 'btn primary' }, icon('copy'), 'リンクをコピー');
    cp.onclick = () => copy(link, cp);
    modal({ title: '進捗を先生に送る', icon: 'send', narrow: true, content: () => h('div', { class: 'col' },
      h('p', 'このリンクを先生に送ってください。先生が開くと、進捗が見えます。'), ta, h('div', { class: 'row' }, cp)) });
  }

  /* ---------- ログイン画面 ---------- */
  function loginView(done) {
    const inp = h('input', { class: 'u-input', type: 'text', placeholder: 'ニックネーム', maxlength: 40, autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', enterkeyhint: 'go', 'aria-label': 'ニックネーム' });
    const err = h('div', { class: 'u-err' });
    const go = async () => { const e = await U.login(inp.value); if (e) err.textContent = e; else done(); };
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    return h('div', { class: 'u-login' }, h('div', { class: 'u-card' },
      h('div', { class: 'u-logo' }, h('i', '研'), '研修ナビ'),
      h('h1', 'ニックネームを入れてください'),
      h('p', '同じニックネームで入ると、続きから学べます。'),
      h('div', { class: 'u-steps' }, h('span', icon('user'), '名前を入れる'), h('span', icon('book-open'), '学ぶ'), h('span', icon('trophy'), '記録がたまる')),
      inp, err,
      h('small', { class: 'u-note' }, '本名は入れないでください。ニックネームと学習の進み（見たシーン）が、先生の確認用に保存されます。'),
      h('button', { class: 'btn primary u-go', onclick: go }, '始める', icon('arrow-right')),
      null));
  }

  /* ---------- 右上のユーザーボタン ---------- */
  function chip() {
    if (!store.user()) return null;
    if (!U.isAdmin()) return h('a', { class: 'btn ghost u-chip', href: '#/me', title: 'わたしの記録' }, icon('trophy'), h('span', { class: 'lbl' }, ' ' + store.user()));
    return h('button', { class: 'btn ghost u-chip', title: '管理者', onclick: () => {
      const m = modal({ title: '管理者', icon: 'shield-check', narrow: true, content: () => h('div', { class: 'col' },
        h('a', { class: 'btn primary', href: '#/admin', onclick: () => m.close() }, icon('layout-dashboard'), '進捗の管理画面'),
        h('button', { class: 'btn ghost', onclick: () => { U.logout(); location.hash = '#/'; location.reload(); } }, icon('log-out'), 'ログアウト')) });
    } }, icon('shield-check'), h('span', { class: 'lbl' }, ' 管理者'));
  }

  /* ---------- わたしの記録（本人用） ---------- */
  const TRK = { basic: ['HTML・CUI・Git', 'var(--basic)', 'terminal'], ts: ['TypeScript', 'var(--ts)', 'braces'], vue: ['Vue.js', 'var(--vue)', 'layout-template'], team: ['チーム開発', 'var(--team)', 'users'], extra: ['プラスα', 'var(--violet)', 'sparkles'] };
  const LEVELS = [[0, 'スタート', 'sprout'], [10, '見習い', 'flame'], [30, 'ルーキー', 'rocket'], [60, 'ベテラン', 'award'], [90, 'マスター', 'crown']];
  function meView() {
    const d = store.read(), seen = d.seen || {};
    const L = Object.values(K.lessons).map((l) => ({ l, done: Math.min(l.scenes.length, new Set(seen[l.id] || []).size) }));
    const tot = L.reduce((n, x) => n + x.l.scenes.length, 0), done = L.reduce((n, x) => n + x.done, 0);
    const mainL = L.filter((x) => x.l.track !== 'extra');
    const pct = Math.round((done / (tot || 1)) * 100);
    const lv = [...LEVELS].reverse().find((x) => pct >= x[0]) || LEVELS[0];
    const full = (x) => x.done >= x.l.scenes.length;
    const lessonsDone = L.filter(full).length;
    const extraDone = L.filter((x) => x.l.track === 'extra').reduce((n, x) => n + x.done, 0);
    const trackFull = (t) => { const a = L.filter((x) => x.l.track === t); return a.length && a.every(full); };
    const BADGES = [
      ['footprints', 'はじめの一歩', done >= 1], ['book-open', '10シーン', done >= 10], ['library', '50シーン', done >= 50], ['flag', '折り返し', pct >= 50], ['trophy', '全クリア', pct >= 100],
      ['terminal', 'HTML・CUI・Git 制覇', trackFull('basic')], ['braces', 'TypeScript 制覇', trackFull('ts')], ['layout-template', 'Vue.js 制覇', trackFull('vue')], ['users', 'チーム開発 制覇', trackFull('team')],
      ['compass', '探検家', extraDone >= 3], ['sparkles', 'プラスα 10', extraDone >= 10]];
    const got = BADGES.filter((b) => b[2]).length;

    const ring = (p, big) => { const r = 52, c = 2 * Math.PI * r; const NS = 'http://www.w3.org/2000/svg', s = document.createElementNS(NS, 'svg'); s.setAttribute('viewBox', '0 0 120 120'); s.setAttribute('class', 'me-ring' + (big ? ' big' : ''));
      s.innerHTML = `<circle cx="60" cy="60" r="${r}" class="bg"/><circle cx="60" cy="60" r="${r}" class="fg" style="stroke-dasharray:${c};stroke-dashoffset:${c * (1 - p)}"/>`; return s; };

    const hero = h('section', { class: 'me-hero' },
      h('div', { class: 'me-ringbox' }, ring(pct / 100, true), h('div', { class: 'me-pct' }, h('b', pct), h('small', '%'))),
      h('div', { class: 'me-who' },
        h('div', { class: 'me-lv' }, icon(lv[2]), lv[1]),
        h('h1', store.user()),
        h('div', { class: 'me-stats' },
          h('div', null, icon('check-circle-2'), h('b', done), h('small', '/ ' + tot + ' シーン')),
          h('div', null, icon('flag'), h('b', lessonsDone), h('small', '/ ' + L.length + ' レッスン')),
          h('div', null, icon('medal'), h('b', got), h('small', '/ ' + BADGES.length + ' バッジ'))),
        h('div', { class: 'me-next' }, LEVELS.find((x) => x[0] > pct) ? [icon('arrow-up-right'), `次のレベル「${LEVELS.find((x) => x[0] > pct)[1]}」まで あと ${LEVELS.find((x) => x[0] > pct)[0] - pct}%`] : [icon('crown'), '最高レベル！'])));

    // ロードマップ（フローチャート）
    const road = h('section', { class: 'me-road' }, h('h2', icon('route'), 'ロードマップ'),
      ['basic', 'ts', 'vue', 'team', 'extra'].map((t) => {
        const A = L.filter((x) => x.l.track === t); if (!A.length) return null;
        const td = A.reduce((n, x) => n + x.done, 0), tt = A.reduce((n, x) => n + x.l.scenes.length, 0), fin = trackFull(t);
        return h('div', { class: 'rm-row' + (t === 'extra' ? ' x' : ''), style: { '--c': TRK[t][1] } },
          h('div', { class: 'rm-head' }, icon(TRK[t][2]), h('b', TRK[t][0]), h('div', { class: 'u-bar' }, h('i', { style: { width: Math.round((td / tt) * 100) + '%' } })), h('small', Math.round((td / tt) * 100) + '%')),
          h('div', { class: 'rm-flow' },
            h('span', { class: 'rm-flag' }, icon('flag')),
            A.map((x) => { const st = full(x) ? 'done' : x.done ? 'part' : 'todo';
              return h('a', { class: 'rm-node ' + st, href: '#/lesson/' + x.l.id, title: x.l.title + ' ' + x.done + '/' + x.l.scenes.length },
                h('span', { class: 'rm-c' }, st === 'done' ? icon('check') : h('span', { class: 'rm-e' }, x.l.emoji || '•'), st === 'part' ? ring(x.done / x.l.scenes.length) : null),
                h('small', x.l.title)); }),
            h('span', { class: 'rm-flag goal' + (fin ? ' on' : '') }, icon('trophy'))));
      }));

    const badges = h('section', { class: 'me-badges' }, h('h2', icon('medal'), 'バッジ'),
      h('div', { class: 'bd-grid' }, BADGES.map(([ic, name, ok]) => h('div', { class: 'bd' + (ok ? ' on' : '') }, h('span', { class: 'bd-i' }, icon(ok ? ic : 'lock')), h('small', name)))));

    return h('div', { class: 'me' }, hero, road, badges,
      h('div', { class: 'row', style: { justifyContent: 'center', marginTop: '10px' } }, h('button', { class: 'btn ghost', onclick: () => { U.logout(); location.hash = '#/'; location.reload(); } }, icon('log-out'), 'ログアウト')));
  }

  /* ---------- 管理画面 ---------- */
  function download(name, text, type) {
    const a = h('a', { href: URL.createObjectURL(new Blob([text], { type })), download: name });
    document.body.append(a); a.click(); a.remove();
  }
  function detailModal(r) {
    modal({ title: r.nick + ' の進捗', icon: 'user', content: () => h('div', { class: 'col' },
      h('p', `全体 ${r.done} / ${total()} シーン（${r.pct}%）・最終 ${ago(r.last)}`),
      h('div', { class: 'u-per' }, r.per.map((x) => h('div', { class: 'u-per-row' }, h('span', x.title), h('div', { class: 'u-bar' }, h('i', { style: { width: Math.round((x.done / x.n) * 100) + '%' } })), h('b', `${x.done}/${x.n}`))))) });
  }
  function importModal(after) {
    const ta = h('textarea', { class: 'u-code', rows: 6, placeholder: '先生に届いたリンクを貼り付け（複数OK）' });
    const msg = h('div', { class: 'u-err' });
    modal({ title: '生徒のリンクを取り込む', icon: 'download', narrow: true, content: () => h('div', { class: 'col' }, ta, msg,
      h('button', { class: 'btn primary', onclick: () => {
        let ok = 0, ng = 0;
        ta.value.split(/\s+/).map((x) => x.trim()).filter(Boolean).forEach((line) => { try { importCode(line); ok++; } catch { ng++; } });
        msg.textContent = `${ok}件 取り込みました` + (ng ? `（読めない行 ${ng}）` : ''); after();
      } }, '取り込む')) });
  }
  function confirmModal(text, yes, label) {
    const m = modal({ title: '確認', icon: 'triangle-alert', narrow: true, content: () => h('div', { class: 'col' }, h('p', text),
      h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: () => { m.close(); yes(); } }, label || 'はい'), h('button', { class: 'btn ghost', onclick: () => m.close() }, 'やめる'))) });
  }

  function loginBox(after) {
    const em = h('input', { class: 'u-input', type: 'email', placeholder: '管理者メール（Firebase）', autocomplete: 'username' });
    const pw = h('input', { class: 'u-input', type: 'password', placeholder: 'パスワード', autocomplete: 'current-password' });
    const er = h('div', { class: 'u-err' });
    const go = async () => { try { await adminSignIn(em.value.trim(), pw.value); er.textContent = ''; after(); } catch { er.textContent = 'ログインできませんでした'; } };
    pw.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    return h('div', { class: 'u-cloudlogin' }, h('b', icon('cloud'), 'クラウドの進捗を見る'), em, pw, h('button', { class: 'btn primary', onclick: go }, 'つなぐ'), er);
  }

  function adminView() {
    const wrap = h('div', { class: 'u-admin' });
    const draw = () => {
      const R = rows();
      const avg = R.length ? Math.round(R.reduce((n, r) => n + r.pct, 0) / R.length) : 0;
      const active = R.filter((r) => Date.now() - r.last < 3600e3).length;
      wrap.replaceChildren(
        h('div', { class: 'u-stats' },
          h('div', null, h('b', R.length), h('span', '人')),
          h('div', null, h('b', avg + '%'), h('span', '平均の進み')),
          h('div', null, h('b', active), h('span', '1時間以内に動いた人'))),
        h('div', { class: 'row u-tools' },
          h('button', { class: 'btn ghost', onclick: load }, icon('refresh-cw'), '更新'),
          FB ? h('span', { class: 'u-err', style: { color: cloudMsg === 'OK' ? 'var(--ok)' : 'var(--bad)', alignSelf: 'center' } }, cloudMsg === 'OK' ? '● クラウド接続OK' : cloudMsg) : null,
          h('button', { class: 'btn ghost', onclick: () => importModal(draw) }, icon('download'), 'リンクを取り込む'),
          h('button', { class: 'btn ghost', onclick: () => download('kenshu-progress.csv', '﻿' + ['ニックネーム,進捗%,完了シーン,最終操作,元'].concat(R.map((r) => `"${r.nick}",${r.pct},${r.done},${r.last ? new Date(r.last).toISOString() : ''},${r.src === 'import' ? '取込' : 'この端末'}`)).join('\n'), 'text/csv') }, icon('file-spreadsheet'), 'CSV'),
          h('button', { class: 'btn ghost', onclick: () => download('kenshu-backup.json', JSON.stringify({ users: Object.fromEntries(R.map((r) => [r.nick, r.data])) }, null, 1), 'application/json') }, icon('save'), 'JSON バックアップ'),
          h('button', { class: 'btn ghost danger', onclick: () => confirmModal('全員の進捗を消します。元に戻せません。', () => { U.list().forEach((n) => ls.del(PREFIX + n)); saveImported({}); cloudDel('').then(load); }, '全員を消す') }, icon('trash-2'), '全員リセット')),
        FB && cloudMsg !== 'OK' ? loginBox(load) : null,
        R.length ? h('div', { class: 'u-table' }, R.map((r) => h('div', { class: 'u-row' },
          h('div', { class: 'u-name' }, icon('user'), h('b', r.nick), r.src === 'import' ? h('small', '取込') : r.src === 'cloud' ? h('small', 'クラウド') : null),
          h('div', { class: 'u-prog' }, h('div', { class: 'u-bar' }, h('i', { style: { width: r.pct + '%' } })), h('b', r.pct + '%')),
          h('div', { class: 'u-cells', title: '授業ごとの進み' }, r.per.map((x) => h('i', { style: { '--p': x.done / x.n }, title: `${x.title} ${x.done}/${x.n}` }))),
          h('small', { class: 'u-last' }, ago(r.last)),
          h('div', { class: 'row' },
            h('button', { class: 'btn ghost', title: '詳細', onclick: () => detailModal(r) }, icon('eye')),
            h('button', { class: 'btn ghost', title: 'この人の進捗をリセット', onclick: () => confirmModal(r.nick + ' の進捗を消します。', () => { ls.del(PREFIX + r.nick); const i = imported(); delete i[r.nick]; saveImported(i); cloudDel(r.nick).then(load); }, '消す') }, icon('rotate-ccw'))))))
          : h('p', { class: 'u-empty' }, 'まだ誰もいません。生徒がニックネームを入れて学び始めると、ここに出ます。他の端末の人は、送られてきたリンクを開くと取り込まれます。'));
    };
    const load = async () => { if (!FB) return draw(); try { cloudRows = await cloud(); cloudMsg = 'OK'; } catch (e) { cloudMsg = e.message === 'login' ? 'クラウドにログインしてください' : '接続できません'; } draw(); };
    draw(); load();
    return wrap;
  }

  K.users.views = { loginView, adminView, chip, meView };
})();
