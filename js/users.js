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
    } catch { return t === 'admin@123' ? ADMIN_HASH : ''; }
  }

  const U = (K.users = {
    current: () => store.user(),
    isAdmin: () => store.user() === ADMIN,
    label: () => (U.isAdmin() ? '管理者' : store.user()),
    list: () => ls.keys().filter((k) => k.startsWith(PREFIX)).map((k) => k.slice(PREFIX.length)).filter((n) => n !== ADMIN),
    async login(raw) {
      const name = (raw || '').trim();
      if (!name) return '名前を入力してください';
      if ((await sha256(name)) === ADMIN_HASH) { ls.set('kenshu.user', ADMIN); return ''; }
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

  function rows() {
    const out = {};
    U.list().forEach((n) => { out[n] = { nick: n, src: 'local', ...summaryOf(store.read(n)), data: store.read(n) }; });
    Object.entries(imported()).forEach(([n, p]) => {
      const s = summaryOf({ seen: p.s, _last: p.t });
      if (!out[n] || s.last > out[n].last) out[n] = { nick: n, src: 'import', ...s, data: { seen: p.s, _last: p.t } };
    });
    return Object.values(out).sort((a, b) => b.last - a.last);
  }

  /* ---------- 進捗コード（生徒 → 先生） ---------- */
  const enc = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o))));
  const dec = (t) => JSON.parse(decodeURIComponent(escape(atob(t.trim()))));
  function myCode() {
    const d = store.read();
    return 'KENSHU1:' + enc({ n: store.user(), t: d._last || Date.now(), s: d.seen || {} });
  }
  const copy = async (t, btn) => {
    try { await navigator.clipboard.writeText(t); btn.textContent = 'コピーしました'; } catch { btn.textContent = '選択してコピーしてください'; }
  };

  function sendModal() {
    const code = myCode();
    const ta = h('textarea', { class: 'u-code', readonly: true, rows: 4 }, code);
    const cp = h('button', { class: 'btn primary' }, icon('copy'), 'コピー');
    cp.onclick = () => copy(code, cp);
    modal({ title: '進捗を先生に送る', icon: 'send', narrow: true, content: () => h('div', { class: 'col' },
      h('p', '下のコードをコピーして、先生に Slack などで送ってください。進捗だけが入っています。'), ta, h('div', { class: 'row' }, cp)) });
  }

  /* ---------- ログイン画面 ---------- */
  function loginView(done) {
    const inp = h('input', { class: 'u-input', type: 'text', placeholder: 'ニックネーム', maxlength: 40, autocomplete: 'off', autofocus: true });
    const err = h('div', { class: 'u-err' });
    const go = async () => { const e = await U.login(inp.value); if (e) err.textContent = e; else done(); };
    inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
    const known = U.list().slice(0, 6);
    return h('div', { class: 'u-login' }, h('div', { class: 'u-card' },
      h('div', { class: 'u-logo' }, h('i', '研'), '研修ナビ'),
      h('h1', 'ニックネームを入れてください'),
      h('p', '同じニックネームで入ると、続きから学べます。進捗はこの端末の中だけに保存されます。'),
      inp, err,
      h('button', { class: 'btn primary u-go', onclick: go }, '始める', icon('arrow-right')),
      known.length ? h('div', { class: 'u-known' }, h('small', 'この端末で使われた名前'), h('div', { class: 'row' }, known.map((n) => h('button', { class: 'btn ghost', onclick: () => { inp.value = n; go(); } }, icon('user'), n)))) : null));
  }

  /* ---------- 右上のユーザーボタン ---------- */
  function chip() {
    if (!store.user()) return null;
    return h('button', { class: 'btn ghost u-chip', title: 'ユーザー', onclick: () => {
      const m = modal({ title: U.isAdmin() ? '管理者' : store.user(), icon: U.isAdmin() ? 'shield-check' : 'user', narrow: true, content: () => h('div', { class: 'col' },
        U.isAdmin() ? h('a', { class: 'btn primary', href: '#/admin', onclick: () => m.close() }, icon('layout-dashboard'), '進捗の管理画面') : h('button', { class: 'btn primary', onclick: () => { m.close(); sendModal(); } }, icon('send'), '進捗を先生に送る'),
        h('button', { class: 'btn ghost', onclick: () => { U.logout(); location.hash = '#/'; location.reload(); } }, icon('log-out'), 'ニックネームを変える（ログアウト）')) });
    } }, icon(U.isAdmin() ? 'shield-check' : 'user'), h('span', { class: 'lbl' }, ' ' + U.label()));
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
    const ta = h('textarea', { class: 'u-code', rows: 6, placeholder: 'KENSHU1:… を貼り付け（複数行OK）' });
    const msg = h('div', { class: 'u-err' });
    modal({ title: '生徒の進捗コードを取り込む', icon: 'download', narrow: true, content: () => h('div', { class: 'col' }, ta, msg,
      h('button', { class: 'btn primary', onclick: () => {
        const cur = imported(); let ok = 0, ng = 0;
        ta.value.split(/\n+/).map((x) => x.trim()).filter(Boolean).forEach((line) => {
          try { const o = dec(line.replace(/^KENSHU1:/, '')); if (!o.n || typeof o.s !== 'object') throw 0; cur[String(o.n).slice(0, 40)] = { t: o.t || Date.now(), s: o.s }; ok++; } catch { ng++; }
        });
        saveImported(cur); msg.textContent = `${ok}件 取り込みました` + (ng ? `（読めない行 ${ng}）` : ''); after();
      } }, '取り込む')) });
  }
  function confirmModal(text, yes, label) {
    const m = modal({ title: '確認', icon: 'triangle-alert', narrow: true, content: () => h('div', { class: 'col' }, h('p', text),
      h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: () => { m.close(); yes(); } }, label || 'はい'), h('button', { class: 'btn ghost', onclick: () => m.close() }, 'やめる'))) });
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
          h('button', { class: 'btn ghost', onclick: draw }, icon('refresh-cw'), '更新'),
          h('button', { class: 'btn ghost', onclick: () => importModal(draw) }, icon('download'), '進捗コードを取り込む'),
          h('button', { class: 'btn ghost', onclick: () => download('kenshu-progress.csv', '﻿' + ['ニックネーム,進捗%,完了シーン,最終操作,元'].concat(R.map((r) => `"${r.nick}",${r.pct},${r.done},${r.last ? new Date(r.last).toISOString() : ''},${r.src === 'import' ? '取込' : 'この端末'}`)).join('\n'), 'text/csv') }, icon('file-spreadsheet'), 'CSV'),
          h('button', { class: 'btn ghost', onclick: () => download('kenshu-backup.json', JSON.stringify({ users: Object.fromEntries(R.map((r) => [r.nick, r.data])) }, null, 1), 'application/json') }, icon('save'), 'JSON バックアップ'),
          h('button', { class: 'btn ghost danger', onclick: () => confirmModal('全員の進捗を消します。元に戻せません。', () => { U.list().forEach((n) => ls.del(PREFIX + n)); saveImported({}); draw(); }, '全員を消す') }, icon('trash-2'), '全員リセット')),
        R.length ? h('div', { class: 'u-table' }, R.map((r) => h('div', { class: 'u-row' },
          h('div', { class: 'u-name' }, icon('user'), h('b', r.nick), r.src === 'import' ? h('small', '取込') : null),
          h('div', { class: 'u-prog' }, h('div', { class: 'u-bar' }, h('i', { style: { width: r.pct + '%' } })), h('b', r.pct + '%')),
          h('div', { class: 'u-cells', title: '授業ごとの進み' }, r.per.map((x) => h('i', { style: { '--p': x.done / x.n }, title: `${x.title} ${x.done}/${x.n}` }))),
          h('small', { class: 'u-last' }, ago(r.last)),
          h('div', { class: 'row' },
            h('button', { class: 'btn ghost', title: '詳細', onclick: () => detailModal(r) }, icon('eye')),
            h('button', { class: 'btn ghost', title: 'この人の進捗をリセット', onclick: () => confirmModal(r.nick + ' の進捗を消します。', () => { ls.del(PREFIX + r.nick); const i = imported(); delete i[r.nick]; saveImported(i); draw(); }, '消す') }, icon('rotate-ccw'))))))
          : h('p', { class: 'u-empty' }, 'まだ誰もいません。生徒がニックネームを入れて学び始めると、ここに出ます。他の端末の人は「進捗コード」を送ってもらって取り込みます。'));
    };
    draw();
    return wrap;
  }

  K.users.views = { loginView, adminView, chip, sendModal };
})();
