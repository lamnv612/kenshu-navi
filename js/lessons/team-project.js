/* 実践プロジェクト：企画 → 仕様設計 → 詳細設計 → WBS・工数 → タスク → 設計書
   ① pj-design（仕様・詳細設計）  ② pj-plan（WBS・工数・タスク・設計書）
   入力した内容は store に保存され、次のシーン（成果物）に自動でつながる。 */
(function () {
  'use strict';
  const K = window.KENSHU, { h, code, lbl, style, store } = K.W;
  const TEAM = 'var(--team)';
  const get = (k, d) => { try { return store.get(k, d); } catch (e) { return d; } };
  const put = (k, v) => { try { store.set(k, v); } catch (e) {} };
  const uid = () => Math.random().toString(36).slice(2, 8);

  style('pj', `
  .pj-eq{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:start}
  @media(max-width:980px){.pj-eq{grid-template-columns:1fr}}
  .pj-panel{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:14px;display:grid;gap:10px;align-content:start;min-width:0}
  .pj-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
  .pj-in{font:inherit;padding:.45em .7em;border-radius:6px;border:1px solid var(--line);background:var(--bg2);color:var(--text);outline:none;min-width:0;width:100%;box-sizing:border-box}
  .pj-in:focus{border-color:var(--team)}
  textarea.pj-in{resize:vertical;line-height:1.5}
  .pj-lb{font:800 .75rem var(--font);color:var(--mute);letter-spacing:.04em}
  .pj-chip{display:inline-flex;align-items:center;gap:.4em;padding:.28em .8em;border-radius:8px;font:800 .8rem var(--font);border:2px solid var(--cc,var(--line));background:color-mix(in srgb,var(--cc,var(--line)) 14%,var(--card2));cursor:pointer;transition:.2s;user-select:none}
  .pj-chip.off{opacity:.45;border-style:dashed}
  .pj-flow{display:flex;flex-wrap:wrap;gap:6px;align-items:stretch}
  .pj-node{all:unset;cursor:pointer;box-sizing:border-box;padding:10px 12px;border-radius:10px;border:2px solid var(--line);background:var(--card);display:grid;gap:2px;justify-items:center;text-align:center;font-weight:800;font-size:.82rem;min-width:98px;transition:.25s}
  .pj-node b{font-size:1.4rem}.pj-node.on{border-color:var(--team);background:color-mix(in srgb,var(--team) 18%,var(--card));transform:translateY(-3px)}
  .pj-node.dim{opacity:.35}
  .pj-ar{align-self:center;color:var(--mute);font-weight:900}
  .pj-box{padding:10px 12px;border-radius:8px;border:1px solid var(--line);background:var(--card2);display:grid;gap:3px;font-size:.85rem}
  .pj-box small{color:var(--mute);font-weight:800;font-size:.72rem}
  .pj-three{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:8px;align-items:stretch}
  @media(max-width:820px){.pj-three{grid-template-columns:1fr}.pj-three .pj-ar{transform:rotate(90deg);justify-self:center}}
  .pj-tbl{width:100%;border-collapse:collapse;font-size:.8rem}
  .pj-tbl th{font:800 .7rem var(--font);color:var(--mute);text-align:left;padding:4px 4px}
  .pj-tbl td{padding:2px 3px;vertical-align:middle}
  .pj-tbl .pj-in{padding:.3em .45em;font-size:.8rem}
  .pj-tbl tr.big td:nth-child(2) .pj-in{border-color:var(--bad)}
  .pj-gantt{display:grid;gap:3px}
  .pj-gr{display:grid;grid-template-columns:120px 1fr;gap:6px;align-items:center;font-size:.75rem}
  .pj-gr>span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:700}
  .pj-gt{position:relative;height:14px;border-radius:4px;background:var(--bg2)}
  .pj-gt i{position:absolute;top:0;bottom:0;border-radius:4px;background:var(--team);opacity:.9;transition:.3s}
  .pj-bar{height:16px;border-radius:8px;background:var(--bg2);overflow:hidden;position:relative}
  .pj-bar i{display:block;height:100%;border-radius:8px;background:var(--ok);transition:width .4s,background .3s}
  .pj-msg{padding:.5em .8em;border-radius:8px;font-weight:800;font-size:.84rem;background:var(--card2);border:1px solid var(--line)}
  .pj-msg.ok{color:var(--ok)}.pj-msg.ng{color:var(--bad)}.pj-msg.w{color:var(--team)}
  .pj-hl{outline:3px solid var(--team);outline-offset:1px;background:color-mix(in srgb,var(--team) 22%,var(--card2))!important}
  .pj-wf{display:grid;gap:6px;padding:10px;border-radius:10px;border:2px solid var(--line);background:var(--bg2)}
  .pj-wf>div{padding:8px;border-radius:6px;border:1px dashed var(--mute);font-weight:800;font-size:.8rem;cursor:pointer;transition:.2s;background:var(--card)}
  .pj-tree{font:700 .82rem var(--mono);display:grid;gap:4px}
  .pj-tree div{padding:5px 8px;border-radius:6px;border:1px solid var(--line);background:var(--card);cursor:pointer;transition:.2s}
  .pj-tk{padding:10px 12px;border-radius:8px;border:1px solid var(--line);background:var(--card2);display:grid;gap:4px}
  .pj-tk label{display:flex;gap:8px;align-items:center;font-weight:800;cursor:pointer}
  `);

  /* ---------- 共通部品 ---------- */
  const copyText = async (t, btn) => {
    try { await navigator.clipboard.writeText(t); } catch (e) { const ta = h('textarea', { style: { position: 'fixed', opacity: 0 } }); ta.value = t; document.body.append(ta); ta.select(); try { document.execCommand('copy'); } catch (e2) {} ta.remove(); }
    if (btn) { const o = btn.dataset.o || btn.textContent; btn.dataset.o = o; btn.textContent = '✓ コピーした'; setTimeout(() => { btn.textContent = o; }, 1300); }
  };
  const download = (name, text, type) => {
    const a = h('a', { href: URL.createObjectURL(new Blob(['﻿' + text], { type: (type || 'text/markdown') + ';charset=utf-8' })), download: name });
    document.body.append(a); a.click(); a.remove();
  };
  const actions = (getText, fname, extra) => {
    const c = h('button', { class: 'btn', onclick: () => copyText(getText(), c) }, '📋 コピー');
    const d = h('button', { class: 'btn', onclick: () => download(fname, getText()) }, '⬇ ' + fname);
    return h('div', { class: 'pj-row' }, c, d, ...(extra || []));
  };
  const inp = (v, on, ph) => h('input', { class: 'pj-in', value: v == null ? '' : v, placeholder: ph || '', oninput: (e) => on(e.target.value) });
  const ta = (v, on, rows, ph) => h('textarea', { class: 'pj-in', rows: rows || 3, placeholder: ph || '', oninput: (e) => on(e.target.value) }, v || '');
  const field = (label, node) => h('div', { style: { display: 'grid', gap: '3px' } }, h('span', { class: 'pj-lb' }, label), node);
  const lines = (s) => String(s || '').split('\n').map((x) => x.trim()).filter(Boolean);
  const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : 0; };
  const r1 = (n) => Math.round(n * 10) / 10;

  /* ---------- 既定データ（お題：弁護士に相談しやすく） ---------- */
  const SPEC0 = {
    name: '相談ナビ（弁護士への相談予約アプリ）',
    problem: '初めて弁護士に相談したい人が、電話が苦手で予約まで進めない',
    users: '初めて相談する一般の人（20〜50代）',
    features: [{ t: '相談したい分野を選ぶ', p: 'Must' }, { t: '空いている日時から予約する', p: 'Must' }, { t: '予約の確認・キャンセル', p: 'Should' }, { t: '料金の目安を見る', p: 'Could' }],
    notDo: 'オンライン決済／弁護士側の管理画面',
    screens: '相談分野の選択\n日時の選択・予約\n予約の確認',
    accept: '分野と日時を選んで「予約する」を押すと、確認画面に内容が出る\n過去の日時は選べない\n分野が未選択だと「予約する」は押せない',
  };
  const DET0 = {
    '日時の選択・予約': { goal: '相談したい日時を選んで、予約を確定する', parts: '相談日｜カレンダー｜必須｜今日以降\n時間｜ボタン（1つ選ぶ）｜必須｜空き枠のみ\n予約する｜ボタン｜－｜日と時間を選ぶまで押せない', state: '日を選ぶ → 空き時間を取得して表示\n「予約する」を押す → 予約を登録\n登録できたら → 確認画面へ移動', trans: '予約の確認（登録成功時）／分野の選択（戻る）', check: '過去の日は選べない\n時間を選ぶまで「予約する」は押せない', api: 'GET /slots?date= で空き時間を取得\nPOST /reservations で予約を作る', error: '空きがない日は「この日は満席です」と表示\n通信に失敗したらもう一度ボタンを出す' },
  };
  const WBS0 = [
    { id: '1.1', t: '仕様書を書く', who: 'PM', d: 0.5, s: 0, e: 0.5, dep: '' },
    { id: '1.2', t: '詳細設計（画面ごとの項目・処理）', who: '全員', d: 0.5, s: 0.5, e: 1, dep: '1.1' },
    { id: '2.1', t: '分野選択の画面を作る', who: 'A', d: 1, s: 1, e: 2, dep: '1.2' },
    { id: '2.2', t: '日時選択の画面を作る', who: 'B', d: 1.5, s: 1, e: 2.5, dep: '1.2' },
    { id: '2.3', t: '予約確認の画面を作る', who: 'A', d: 1, s: 2, e: 3, dep: '2.1' },
    { id: '3.1', t: '画面をつなぐ（Router）', who: 'B', d: 0.5, s: 2.5, e: 3, dep: '2.2' },
    { id: '3.2', t: 'テストを書く（入力チェック）', who: 'A', d: 0.5, s: 3, e: 3.5, dep: '2.3' },
    { id: '4.1', t: '発表資料・デモ練習', who: '全員', d: 0.5, s: 3.5, e: 4, dep: '3.2' },
  ];
  const loadSpec = () => { const sv = get('pj.spec', null); if (sv) return sv; const d = JSON.parse(JSON.stringify(SPEC0)), pr = get('pj.problem', ''); if (pr) { const [a, b, c, e] = pr.split('|'); d.problem = `${a}は、${b}、${c}。その結果、${e}。`; d.users = a; } return d; };
  const loadWbs = () => get('pj.wbs', null) || JSON.parse(JSON.stringify(WBS0));
  const loadDet = () => get('pj.detail', null) || JSON.parse(JSON.stringify(DET0));

  /* ---------- Markdown 生成 ---------- */
  const specMd = (S) => `# 仕様書：${S.name}

## 1. 解決したい課題
${S.problem}

## 2. 対象ユーザー
${S.users}

## 3. 機能一覧（Must = 必ず / Should = できれば / Could = 余裕があれば）
| 優先度 | 機能 |
|---|---|
${S.features.map((f) => `| ${f.p} | ${f.t} |`).join('\n')}

## 4. やらないこと（スコープ外）
${lines(S.notDo).map((x) => '- ' + x).join('\n') || '- （なし）'}

## 5. 画面一覧
${lines(S.screens).map((x, i) => `${i + 1}. ${x}`).join('\n')}

## 6. 受け入れ条件（これが満たされたら「完成」）
${lines(S.accept).map((x) => '- [ ] ' + x).join('\n')}
`;
  const detMd = (D) => Object.keys(D).map((k) => { const x = D[k]; const L = (s) => lines(s).map((y) => '- ' + y).join('\n') || '- （未記入）'; return `## 画面：${k}
- **目的**：${x.goal || '（未記入）'}

### 画面項目（項目名｜種類｜必須｜入力ルール）
${L(x.parts)}

### 操作と処理（押す → 何が起きる）
${L(x.state)}

### 画面遷移
${L(x.trans)}

### 入力チェック
${L(x.check)}

### API・データの取得
${L(x.api)}

### エラーのとき
${L(x.error)}
`; }).join('\n');
  const wbsTsv = (W) => ['ID\t作業\t担当\t工数(人日)\t開始(日)\t終了(日)\t先行'].concat(W.map((r) => [r.id, r.t, r.who, r.d, r.s, r.e, r.dep].join('\t'))).join('\n');
  const wbsMd = (W) => '| ID | 作業 | 担当 | 工数(人日) | 開始 | 終了 | 先行 |\n|---|---|---|---|---|---|---|\n' + W.map((r) => `| ${r.id} | ${r.t} | ${r.who} | ${r.d} | ${r.s} | ${r.e} | ${r.dep || '-'} |`).join('\n');

  /* =================================================================
     ① 仕様・詳細設計
     ================================================================= */
  const ROLES = [['pm', 'PM・リーダー', '🧭', '進行と優先順位を決める'], ['design', 'デザイナー', '🎨', '画面の見た目と使いやすさを考える'], ['eng', 'エンジニア', '💻', '作る・テストする'], ['review', 'レビュアー', '🔎', 'コードや設計をチェックする'], ['user', 'お客さん・ユーザー', '🙋', '使う人。困りごとの持ち主']];
  const PH = [
    { k: 'idea', n: 'アイデア・企画', e: '💡', who: ['pm', 'user'], goal: '誰のどんな困りごとを解決するか決める', in: 'お題・困りごと', out: '企画カード（課題文＋解決案）', tpl: 'アイデアキャンバス（前の回）' },
    { k: 'spec', n: '仕様設計', e: '📋', who: ['pm', 'design', 'user'], goal: '「何を作るか」を決める。作るもの／作らないものの線を引く', in: '企画カード', out: '仕様書（機能・画面一覧・受け入れ条件）', tpl: '仕様書テンプレ' },
    { k: 'detail', n: '詳細設計', e: '📐', who: ['eng', 'design'], goal: '「どう作るか」を決める。画面・部品・データの形', in: '仕様書', out: '詳細設計シート（画面ごと）', tpl: '詳細設計シート' },
    { k: 'plan', n: '計画', e: '🗓️', who: ['pm', 'eng'], goal: '作業を分解して、工数を見積もり、終わる日を出す', in: '詳細設計シート', out: 'WBS ＋ 工数見積', tpl: 'WBS・工数表' },
    { k: 'task', n: 'タスク化', e: '🎫', who: ['pm', 'eng'], goal: '1人が1日以内で終わるチケットにして、担当を決める', in: 'WBS', out: 'チケット（Issue）・カンバン', tpl: 'チケットテンプレ' },
    { k: 'build', n: '実装・テスト', e: '💻', who: ['eng', 'review'], goal: 'ブランチを切って作り、PR でレビューを受ける', in: 'チケット ＋ 設計', out: '動くアプリ ＋ テスト', tpl: '（開発の回）' },
    { k: 'doc', n: '設計書・発表', e: '🏆', who: ['pm', 'eng', 'user'], goal: '作ったものを1ページで説明できる形にまとめる', in: 'これまでの全部', out: '設計書（README）＋ デモ', tpl: '設計書（1ページ）' },
  ];

  const PJ_TOOLS = {};
  const openTool = (emoji, name, fn) => K.W.modal({ title: emoji + ' ' + name, wide: true, content: () => { const box = h('div', { style: { minWidth: 0 } }); fn(box); return box; } });

  function overview() {
    style('pjmap', `
    .pm-grid{display:grid;grid-template-columns:132px repeat(7,minmax(0,1fr));gap:8px 14px;align-items:stretch;min-width:980px}
    .pm-wrap{overflow-x:auto;padding:10px 6px 6px}
    .pm-hd{all:unset;cursor:pointer;box-sizing:border-box;padding:10px 4px;border-radius:12px;border:2px solid var(--line);background:var(--card);display:grid;gap:2px;justify-items:center;text-align:center;font-weight:900;font-size:.8rem;transition:.25s}
    .pm-hd b{font-size:1.5rem}.pm-hd small{color:var(--mute);font-weight:800;font-size:.64rem}
    .pm-hd.on{border-color:var(--team);background:color-mix(in srgb,var(--team) 22%,var(--card));transform:translateY(-3px);box-shadow:0 10px 22px -12px var(--team)}
    .pm-hd.dim,.pm-ar.dim,.pm-ln.dim{opacity:.4}
    .pm-doc{position:relative;padding:6px 4px;border-radius:8px;border:2px dashed var(--line);background:var(--bg2);text-align:center;font-weight:800;font-size:.7rem;transition:.25s;display:grid;place-items:center;min-height:42px;cursor:pointer}
    .pm-doc::after{content:'➜';position:absolute;right:-12px;top:50%;transform:translateY(-50%);color:var(--mute);font-size:.8rem;z-index:2}
    .pm-doc.last::after{display:none}
    .pm-doc.in{border-color:var(--ok);border-style:solid;background:color-mix(in srgb,var(--ok) 16%,var(--bg2))}
    .pm-doc.out{border-color:var(--team);border-style:solid;background:color-mix(in srgb,var(--team) 22%,var(--bg2));animation:pmpulse 1.4s ease-in-out infinite}
    .pm-doc.out::after{color:var(--team);animation:pmnudge .9s ease-in-out infinite}
    @keyframes pmpulse{50%{box-shadow:0 0 18px -4px var(--team)}}
    @keyframes pmnudge{50%{transform:translate(5px,-50%)}}
    .pm-ln{font-weight:900;font-size:.76rem;padding:6px 10px;border-radius:10px;border:2px solid var(--line);background:var(--card);display:flex;gap:6px;align-items:center;cursor:pointer;transition:.25s;white-space:nowrap;min-width:0;overflow:hidden}
    .pm-ln.on{border-color:var(--team);background:color-mix(in srgb,var(--team) 18%,var(--card))}
    .pm-cell{border-radius:8px;min-height:40px;display:grid;place-items:center;text-align:center;font-size:.68rem;font-weight:800;padding:3px;transition:.25s;border:2px solid transparent;background:color-mix(in srgb,var(--line) 25%,transparent)}
    .pm-cell.has{background:color-mix(in srgb,var(--team) 16%,var(--card2));border-color:color-mix(in srgb,var(--team) 40%,var(--line))}
    .pm-cell.has.on{background:var(--team);color:#1b1b2f;border-color:var(--team);transform:scale(1.04);box-shadow:0 8px 18px -8px var(--team)}
    .pm-cell.dim{opacity:.35}
    .pm-cap{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:8px;align-items:center}
    @media(max-width:820px){.pm-cap{grid-template-columns:1fr}}
    `);
    const ACT = [['pm', '🧭', 'PM'], ['design', '🎨', 'デザイナー'], ['eng', '💻', 'エンジニア'], ['review', '🔎', 'レビュアー'], ['user', '🙋', 'お客さん']];
    const V = { idea: { pm: '課題を決める', user: '困りごとを話す' }, spec: { pm: '機能を決める', design: '画面を考える', user: '確認する' }, detail: { eng: '処理・API を決める', design: 'レイアウトを渡す' }, plan: { pm: '期限を決める', eng: '見積もる' }, task: { pm: '担当を決める', eng: '引き受ける' }, build: { eng: '作る・テスト', review: 'PR を見る' }, doc: { pm: 'まとめる', eng: '説明する', user: 'デモを見る' } };
    const DOC = ['企画カード', '仕様書', '詳細設計シート', 'WBS・工数', 'チケット', '動くアプリ', '設計書＋デモ'];
    const LINK = [null, '#/lesson/pj-design/1', '#/lesson/pj-design/2', '#/lesson/pj-plan/0', '#/lesson/pj-plan/2', null, '#/lesson/pj-plan/3'];
    let cur = 1, role = null, timer = 0;
    const grid = h('div', { class: 'pm-grid' }), cap = h('div'), tpl = h('div', { class: 'pj-row' });
    const draw = () => {
      const P = PH[cur], inv = (k, i) => !!V[PH[i].k][k];
      const hd = PH.map((p, i) => h('button', { class: 'pm-hd' + (i === cur ? ' on' : ' dim'), onclick: () => { cur = i; role = null; draw(); } }, h('b', p.e), p.n, h('small', (i + 1) + '／7')));
      const docs = DOC.map((d, i) => h('div', { class: 'pm-doc' + (i === DOC.length - 1 ? ' last' : '') + (i === cur ? ' out' : i === cur - 1 ? ' in' : ''), onclick: () => { cur = Math.min(i + 1, PH.length - 1); draw(); }, title: i === cur - 1 ? '入力' : i === cur ? '成果物' : '' }, '📄 ' + d));
      const lanes = ACT.flatMap(([k, e, n]) => {
        const here = inv(k, cur) && !role || role === k;
        return [h('div', { class: 'pm-ln' + (inv(k, cur) || role === k ? ' on' : ' dim'), onclick: () => { role = role === k ? null : k; draw(); } }, e, n),
          ...PH.map((p, i) => { const t = V[p.k][k]; const hl = role ? role === k && !!t : i === cur && !!t; return h('div', { class: 'pm-cell' + (t ? ' has' : '') + (hl ? ' on' : '') + ((role ? (role !== k) : i !== cur) && t ? ' dim' : '') }, t || ''); })];
      });
      grid.replaceChildren(h('div'), ...hd, h('div', { class: 'pm-ln', style: { background: 'transparent', border: '0', fontSize: '.7rem', color: 'var(--mute)' } }, '📄 成果物'), ...docs, ...lanes);
      cap.replaceChildren(h('div', { class: 'pm-cap' },
        h('div', { class: 'pj-box' }, h('small', '入力'), h('b', cur ? DOC[cur - 1] : 'お題・困りごと')), h('span', { class: 'pj-ar' }, '➜'),
        h('div', { class: 'pj-box', style: { borderColor: TEAM } }, h('small', P.n), h('b', P.goal)), h('span', { class: 'pj-ar' }, '➜'),
        h('div', { class: 'pj-box' }, h('small', '成果物'), h('b', DOC[cur]))));
      tpl.replaceChildren(h('span', { class: 'pj-lb' }, 'この工程のテンプレ・ツール（押すと開く）：'), ...((PJ_TOOLS[P.k] || []).length ? PJ_TOOLS[P.k].map(([e, n, fn]) => h('button', { class: 'btn primary', style: { '--c': TEAM }, onclick: () => openTool(e, n, fn) }, e + ' ' + n)) : [h('span', { class: 'pj-chip off', style: { '--cc': 'var(--ts)' } }, 'この工程は開発の回で')]));
    };
    const play = h('button', { class: 'btn primary', style: { '--c': TEAM }, onclick: () => { clearInterval(timer); cur = 0; role = null; draw(); timer = setInterval(() => { cur++; if (cur >= PH.length) { clearInterval(timer); cur = PH.length - 1; } draw(); }, 1300); } }, '▶ 流れを見る');
    draw();
    return h('div', { style: { display: 'grid', gap: '12px' } },
      h('div', { class: 'pj-panel' }, h('div', { class: 'pj-row', style: { justifyContent: 'space-between' } }, lbl('現場の流れ全体マップ（工程・役割を押す）'), play), h('div', { class: 'pm-wrap' }, grid)),
      h('div', { class: 'pj-panel' }, cap, tpl));
  }

  function specScene() {
    const S = loadSpec();
    const save = () => { put('pj.spec', S); draw(); };
    const prev = h('div'), tools = h('div');
    const feats = h('div', { style: { display: 'grid', gap: '6px' } });
    const drawFeats = () => {
      feats.replaceChildren(...S.features.map((f, i) => {
        const sel = h('select', { class: 'pj-in', style: { width: '110px' }, onchange: (e) => { f.p = e.target.value; save(); } }, ...['Must', 'Should', 'Could'].map((p) => h('option', { value: p }, p)));
        sel.value = f.p;
        return h('div', { class: 'pj-row', style: { flexWrap: 'nowrap' } }, inp(f.t, (v) => { f.t = v; save(); }, '〜できる'), sel, h('button', { class: 'btn', onclick: () => { S.features.splice(i, 1); drawFeats(); save(); } }, '✕'));
      }), h('button', { class: 'btn', onclick: () => { S.features.push({ t: '', p: 'Should' }); drawFeats(); save(); } }, '＋ 機能を足す'));
    };
    const draw = () => { prev.replaceChildren(code(specMd(S), 'md', { color: TEAM, file: 'spec.md' })); };
    drawFeats(); draw();
    tools.append(actions(() => specMd(S), 'spec.md', [h('button', { class: 'btn', onclick: () => { if (confirm('例（相談ナビ）に戻しますか？')) { put('pj.spec', null); location.reload(); } } }, '↺ 例に戻す')]));
    const cmp = h('div', { class: 'pj-eq' },
      h('div', { class: 'pj-box' }, h('small', { style: { color: 'var(--bad)' } }, '✖ あいまいな仕様'), '「予約ができる」', h('small', '→ 誰が・どこまで？ 完成の線が人によって違う')),
      h('div', { class: 'pj-box' }, h('small', { style: { color: 'var(--ok)' } }, '✓ 受け入れ条件つき'), '「分野と日時を選んで押すと確認画面に出る。過去日は選べない」', h('small', '→ そのままテストに書ける')));
    const left = h('div', { class: 'pj-panel' }, lbl('仕様書をつくる（入力すると右が変わる）'),
      field('① プロダクト名', inp(S.name, (v) => { S.name = v; save(); })), field('② 解決したい課題（誰が・何に困る）', ta(S.problem, (v) => { S.problem = v; save(); }, 2)), field('③ 対象ユーザー', inp(S.users, (v) => { S.users = v; save(); })),
      h('div', { class: 'pj-lb' }, '④ 機能一覧と優先度'), feats,
      field('⑤ やらないこと（1行1つ）', ta(S.notDo, (v) => { S.notDo = v; save(); }, 2)), field('⑥ 画面一覧（1行1画面）→ 次の「詳細設計」で使う', ta(S.screens, (v) => { S.screens = v; save(); }, 3)), field('⑦ 受け入れ条件（1行1つ）', ta(S.accept, (v) => { S.accept = v; save(); }, 3)));
    return h('div', { style: { display: 'grid', gap: '12px' } }, cmp, h('div', { class: 'pj-eq' }, left, h('div', { class: 'pj-panel' }, lbl('できあがり（仕様書テンプレ）'), prev, tools)),
      h('div', { class: 'pj-msg w' }, '💡 優先度の考え方：Must だけで「動くもの」になる状態を先に作る。時間が余ったら Should → Could。足りなければ Could から外す（スコープ調整）。'));
  }

  function detailScene() {
    const SP = loadSpec(), D = loadDet();
    const screens = lines(SP.screens);
    if (!screens.length) screens.push('日時の選択・予約');
    screens.forEach((s) => { if (!D[s]) D[s] = { goal: '', parts: '', state: '', trans: '', check: '', api: '', error: '' }; });
    let cur = D['日時の選択・予約'] && screens.includes('日時の選択・予約') ? '日時の選択・予約' : screens[0];
    const tabs = h('div', { class: 'pj-row' }), form = h('div', { class: 'pj-panel' }), prev = h('div');
    const save = () => { put('pj.detail', D); prev.replaceChildren(code(detMd(Object.fromEntries(screens.map((s) => [s, D[s]]))), 'md', { color: TEAM, file: 'detail-design.md' })); };
    const drawTabs = () => tabs.replaceChildren(h('span', { class: 'pj-lb' }, '仕様書の画面一覧：'), ...screens.map((s) => h('span', { class: 'pj-chip' + (s === cur ? '' : ' off'), style: { '--cc': TEAM }, onclick: () => { cur = s; drawTabs(); drawForm(); } }, s)));
    const drawForm = () => {
      const x = D[cur], f = (k, lab, rows, ph) => field(lab, ta(x[k], (v) => { x[k] = v; save(); }, rows, ph));
      form.replaceChildren(lbl('詳細設計シート：' + cur), f('goal', '目的（1文）', 2, '何のための画面？'), f('parts', '画面項目（項目名｜種類｜必須｜ルール）1行1つ', 4, '相談日｜カレンダー｜必須｜今日以降'), f('state', '操作と処理（押す → 何が起きる）', 3, '「予約する」を押す → 予約を登録'), f('trans', '画面遷移（どこへ移る？）', 2, '成功 → 予約の確認'), f('check', '入力チェック', 3), f('api', '使うデータ・API', 3), f('error', 'エラー・空のとき', 3));
    };
    /* 画面 ↔ 項目 ↔ 処理 の対応デモ */
    const L = { c: ['📅 相談日（カレンダー）', '必須・今日以降', '日を選ぶ → GET /slots で空き時間を取得'], s: ['🕙 時間（ボタン）', '必須・空き枠のみ', '時間を選ぶ → 「予約する」を押せるようにする'], b: ['［ 予約する ］', '日と時間が揃うまで押せない', '押す → POST /reservations → 確認画面へ'] };
    const els = { w: {}, c: {}, d: {} };
    const hl = (k, on) => ['w', 'c', 'd'].forEach((g) => els[g][k] && els[g][k].classList.toggle('pj-hl', on));
    const wire = (g, k, txt, extra) => { const e = h('div', Object.assign({ onmouseenter: () => hl(k, true), onmouseleave: () => hl(k, false), onclick: () => { hl(k, true); setTimeout(() => hl(k, false), 1200); } }, extra || {}), txt); els[g][k] = e; return e; };
    const demo = h('div', { class: 'pj-three' },
      h('div', { class: 'pj-panel' }, h('div', { class: 'pj-lb' }, '① 画面（ワイヤー）'), h('div', { class: 'pj-wf' }, ...['c', 's', 'b'].map((k) => wire('w', k, L[k][0])))), h('span', { class: 'pj-ar' }, '⇄'),
      h('div', { class: 'pj-panel' }, h('div', { class: 'pj-lb' }, '② 画面項目のルール'), h('div', { class: 'pj-tree' }, ...['c', 's', 'b'].map((k) => wire('c', k, L[k][1])))), h('span', { class: 'pj-ar' }, '⇄'),
      h('div', { class: 'pj-panel' }, h('div', { class: 'pj-lb' }, '③ 操作したときの処理'), h('div', { class: 'pj-tree' }, ...['c', 's', 'b'].map((k) => wire('d', k, L[k][2])))));
    drawTabs(); drawForm(); save();
    return h('div', { style: { display: 'grid', gap: '12px' } },
      h('div', { class: 'pj-panel' }, lbl('「画面 → 項目のルール → 操作したときの処理」を1画面ずつ決める（マウスを乗せて確認）'), demo, h('div', { class: 'pj-msg w' }, '💡 詳細設計 ＝ 画面1つずつ「何を表示し、何を入力でき、押したら何が起きるか」を決めること。ファイル分割（部品）は、作るときに考える。')),
      tabs, h('div', { class: 'pj-eq' }, form, h('div', { class: 'pj-panel' }, lbl('できあがり（詳細設計シート）'), prev, actions(() => detMd(Object.fromEntries(screens.map((s) => [s, D[s]]))), 'detail-design.md'))));
  }

  /* =================================================================
     ② 計画・タスク・設計書
     ================================================================= */
  function wbsScene() {
    const W = loadWbs();
    const body = h('tbody'), tot = h('div', { class: 'pj-msg' }), gantt = h('div', { class: 'pj-gantt' });
    const save = () => { put('pj.wbs', W); sum(); };
    const sum = () => {
      const t = r1(W.reduce((a, r) => a + num(r.d), 0)), end = Math.max(1, ...W.map((r) => num(r.e)));
      tot.className = 'pj-msg'; tot.textContent = `合計 ${t} 人日／全体の長さ ${end} 日　　（1つの作業が 1.0 を超えると赤＝分割しよう）`;
      body.querySelectorAll('tr').forEach((tr, i) => tr.classList.toggle('big', num(W[i].d) > 1));
      gantt.replaceChildren(...W.map((r) => h('div', { class: 'pj-gr' }, h('span', r.id + ' ' + r.t), h('div', { class: 'pj-gt' }, h('i', { style: { left: (num(r.s) / end * 100) + '%', width: Math.max(1, (num(r.e) - num(r.s)) / end * 100) + '%' } })))));
    };
    const cell = (r, k, w, type) => { const i = inp(r[k], (v) => { r[k] = type === 'n' ? num(v) : v; save(); }); if (w) i.style.width = w; return h('td', i); };
    const drawRows = () => {
      body.replaceChildren(...W.map((r, i) => h('tr', cell(r, 'id', '46px'), cell(r, 't'), cell(r, 'who', '66px'), cell(r, 'd', '56px', 'n'), cell(r, 's', '52px', 'n'), cell(r, 'e', '52px', 'n'), cell(r, 'dep', '52px'), h('td', h('button', { class: 'btn', onclick: () => { W.splice(i, 1); drawRows(); save(); } }, '✕')))));
      sum();
    };
    /* 分解のアニメーション */
    let lv = 0; const tree = h('div', { class: 'pj-tree' });
    const T = [['📦 予約アプリ（成果物）', 0], ['　├ 📋 設計', 1], ['　├ 🖥 画面（分野／日時／確認）', 1], ['　└ 🔗 つなぐ・テスト・発表', 1], ['　　　├ 仕様書を書く（0.5日）', 2], ['　　　├ 日時選択の画面を作る（1.5日）', 2], ['　　　└ テストを書く（0.5日）', 2]];
    const drawTree = () => tree.replaceChildren(...T.filter((x) => x[1] <= lv).map((x) => h('div', { style: { borderColor: x[1] === 2 ? 'var(--ok)' : 'var(--line)' } }, x[0])));
    drawTree();
    const lvBtn = h('button', { class: 'btn primary', style: { '--c': TEAM }, onclick: () => { lv = (lv + 1) % 3; drawTree(); lvBtn.textContent = lv === 2 ? '↺ 最初から' : '▶ もっと分解する'; msgT.textContent = ['まず「成果物」から始める。作業ではなく、できあがるものを書く。', '成果物を大きな塊に分ける。足すと元の成果物と同じ（抜け・ダブりなし）。', '「0.5〜1日で終わる」粒度まで分ける。これが作業＝タスクになる。'][lv]; } }, '▶ 分解してみる');
    const msgT = h('div', { class: 'pj-msg w' }, '「成果物 → 塊 → 作業」と、上から分けていく。ボタンで1段ずつ。');
    drawRows();
    return h('div', { style: { display: 'grid', gap: '12px' } },
      h('div', { class: 'pj-eq' }, h('div', { class: 'pj-panel' }, lbl('WBS ＝ 作業の分解表'), tree, lvBtn, msgT),
        h('div', { class: 'pj-panel' }, lbl('ガントチャート（表を直すと動く）'), gantt, tot)),
      h('div', { class: 'pj-panel' }, lbl('WBS テンプレ（そのまま書き換えて使う）'),
        h('div', { style: { overflowX: 'auto' } }, h('table', { class: 'pj-tbl' }, h('thead', h('tr', ...['ID', '作業（動詞で）', '担当', '工数(人日)', '開始(日)', '終了(日)', '先行', ''].map((x) => h('th', x)))), body)),
        h('div', { class: 'pj-row' }, h('button', { class: 'btn', onclick: () => { W.push({ id: '', t: '', who: '', d: 0.5, s: 0, e: 0.5, dep: '' }); drawRows(); save(); } }, '＋ 行を足す'),
          (() => { const b = h('button', { class: 'btn', onclick: () => copyText(wbsTsv(W), b) }, '📋 Excel / スプレッドシートに貼る'); return b; })(),
          (() => { const b = h('button', { class: 'btn', onclick: () => copyText(wbsMd(W), b) }, '📋 Markdown 表'); return b; })(),
          h('button', { class: 'btn', onclick: () => download('wbs.csv', wbsTsv(W).replace(/\t/g, ','), 'text/csv') }, '⬇ wbs.csv'))));
  }

  function estimateScene() {
    const W = loadWbs();
    const S = Object.assign({ m: 3, days: 4, rate: 60, buf: 20, o: 1, mm: 1.5, p: 3, row: 0 }, get('pj.est', {}));
    const saveS = () => put('pj.est', S);
    const out = h('div', { style: { display: 'grid', gap: '10px' } }), three = h('div', { style: { display: 'grid', gap: '8px' } });
    const slider = (lab, k, min, max, step, unit) => { const v = h('b', S[k] + unit); const i = h('input', { type: 'range', min, max, step, value: S[k], oninput: (e) => { S[k] = num(e.target.value); v.textContent = S[k] + unit; saveS(); draw(); } }); return h('div', { style: { display: 'grid', gap: '2px' } }, h('div', { class: 'pj-row', style: { justifyContent: 'space-between' } }, h('span', { class: 'pj-lb' }, lab), v), i); };
    const draw = () => {
      const demand = W.reduce((a, r) => a + num(r.d), 0) * (1 + S.buf / 100), cap = S.m * S.days * S.rate / 100, ratio = demand / cap;
      const per = {}; W.forEach((r) => { if (r.who && r.who !== '全員') per[r.who] = (per[r.who] || 0) + num(r.d); });
      const perCap = S.days * S.rate / 100;
      out.replaceChildren(
        h('div', { class: 'pj-box' }, h('small', '必要な量（WBS の合計 ＋ バッファ' + S.buf + '%）'), h('b', r1(demand) + ' 人日')),
        h('div', { class: 'pj-box' }, h('small', '使える量（人数 × 日数 × 稼働率）'), h('b', `${S.m} × ${S.days} × ${S.rate}% ＝ ${r1(cap)} 人日`)),
        h('div', { class: 'pj-bar' }, h('i', { style: { width: Math.min(100, ratio * 100) + '%', background: ratio > 1 ? 'var(--bad)' : ratio > .85 ? 'var(--team)' : 'var(--ok)' } })),
        h('div', { class: 'pj-msg ' + (ratio > 1 ? 'ng' : ratio > .85 ? 'w' : 'ok') }, ratio > 1 ? `✖ ${r1(demand - cap)} 人日たりない。Could の機能を外す／人を増やす／見積りを見直す、の順に考える。` : ratio > .85 ? '△ ギリギリ。1つ遅れると全部ずれる。Could は最初から外しておこう。' : '✓ 余裕あり。余った分は、テストと発表の準備に回せる。'),
        h('div', { class: 'pj-lb' }, '担当ごとの負荷（上限 ' + r1(perCap) + ' 人日）'),
        ...Object.keys(per).map((n) => h('div', { class: 'pj-gr' }, h('span', n), h('div', { class: 'pj-bar' }, h('i', { style: { width: Math.min(100, per[n] / perCap * 100) + '%', background: per[n] > perCap ? 'var(--bad)' : 'var(--ok)' } })))));
    };
    const E = () => (S.o + 4 * S.mm + S.p) / 6;
    const sel = h('select', { class: 'pj-in', onchange: (e) => { S.row = +e.target.value; drawThree(); } }, ...W.map((r, i) => h('option', { value: i }, r.id + ' ' + r.t)));
    sel.value = Math.min(S.row, W.length - 1);
    const drawThree = () => {
      const e = E();
      three.replaceChildren(field('見積もる作業（WBS から）', sel), slider('😀 うまくいく時 (O)', 'o', 0.25, 5, 0.25, '日'), slider('😐 ふつう (M)', 'mm', 0.25, 5, 0.25, '日'), slider('😱 トラブル込み (P)', 'p', 0.25, 8, 0.25, '日'),
        h('div', { class: 'pj-box' }, h('small', '3点見積り ＝ (O ＋ 4×M ＋ P) ÷ 6'), h('b', '期待値 ' + r1(e) + ' 日')),
        h('button', { class: 'btn primary', style: { '--c': TEAM }, onclick: () => { const r = W[S.row]; r.d = Math.round(E() * 4) / 4; put('pj.wbs', W); saveS(); draw(); msg.textContent = `✓ WBS の「${r.t}」を ${r.d} 人日にした（WBS の表にも反映）`; } }, '↓ この値を WBS に反映'));
    };
    const msg = h('div', { class: 'pj-msg w' }, '悲観(P)を考えるのがコツ。「全部うまくいけば」で見積もると、必ず遅れる。');
    drawThree(); draw();
    return h('div', { class: 'pj-eq' },
      h('div', { class: 'pj-panel' }, lbl('① 作業ごとの見積り（3点見積り）'), three, msg),
      h('div', { class: 'pj-panel' }, lbl('② チームに収まる？'), slider('👥 人数', 'm', 1, 8, 1, '人'), slider('📆 開発できる日数', 'days', 1, 10, 0.5, '日'), slider('⚡ 稼働率（会議・質問・手戻りを引く）', 'rate', 30, 100, 5, '%'), slider('🛟 バッファ', 'buf', 0, 50, 5, '%'), out));
  }

  function ticketScene() {
    const W = loadWbs(), SP = loadSpec();
    const picked = new Set(W.map((r) => r.id)), msg = h('div', { class: 'pj-msg w' }, 'WBS の行がチケットになる。チェックを付けた分だけ、コピー・カンバンに送れる。'), list = h('div', { style: { display: 'grid', gap: '8px' } }), prev = h('div');
    const feat = (r) => { const f = SP.features.find((x) => r.t.includes(x.t.slice(0, 3))) || SP.features[0]; return f ? `「${f.t}」(${f.p})` : '（仕様書の機能）'; };
    const tk = (r) => `## [${r.id}] ${r.t}
- **背景**：仕様書 ${feat(r)} のため
- **やること**：${r.t}
- **完了条件（DoD）**：
  - [ ] 受け入れ条件の動きを手で確認した
  - [ ] テスト（または確認手順）を書いた
  - [ ] PR を出して、レビューを1人から受けた
- **見積り**：${r.d} 人日 ／ **担当**：${r.who || '未定'} ／ **期限**：${r.e} 日目 ／ **先行**：${r.dep || 'なし'}
`;
    const all = () => W.filter((r) => picked.has(r.id)).map(tk).join('\n');
    const draw = () => prev.replaceChildren(code(all() || '（チェックを付けると表示）', 'md', { color: TEAM, file: 'issues.md' }));
    list.replaceChildren(...W.map((r) => { const c = h('input', { type: 'checkbox', checked: true, onchange: (e) => { e.target.checked ? picked.add(r.id) : picked.delete(r.id); draw(); } }); return h('div', { class: 'pj-tk' }, h('label', c, h('span', `[${r.id}] ${r.t}`)), h('small', { style: { color: 'var(--mute)' } }, `${r.who || '担当未定'} ／ ${r.d} 人日 ／ 〜${r.e} 日目${r.d > 1 ? ' ⚠大きい→分割' : ''}`)); }));
    draw();
    const toBoard = h('button', { class: 'btn primary', style: { '--c': TEAM }, onclick: () => { const cur = get('tt.dev.tasks', []) || []; const add = W.filter((r) => picked.has(r.id)).map((r) => ({ id: uid(), t: `[${r.id}] ${r.t}（${r.who || '未定'}）`, s: 'todo' })); put('tt.dev.tasks', cur.concat(add)); msg.innerHTML = `✓ ${add.length} 件を「開発」のカンバン（Todo）に追加した → <a href="#/lesson/dev/0" style="color:var(--team);text-decoration:underline">カンバンを開く</a>`; } }, '🗂 カンバンに送る');
    const cmp = h('div', { class: 'pj-eq' },
      h('div', { class: 'pj-box' }, h('small', { style: { color: 'var(--bad)' } }, '✖ 悪いチケット'), h('b', '「ログイン」'), h('small', 'いつ終わり？ 何ができたら完成？ 誰が？ → 分からない')),
      h('div', { class: 'pj-box' }, h('small', { style: { color: 'var(--ok)' } }, '✓ 良いチケット'), h('b', '「[2.2] 日時選択の画面を作る」'), h('small', '背景・完了条件・見積り・担当・期限が揃っている。1日以内で終わる大きさ')));
    return h('div', { style: { display: 'grid', gap: '12px' } }, cmp,
      h('div', { class: 'pj-eq' }, h('div', { class: 'pj-panel' }, lbl('WBS からチケットを作る'), list, h('div', { class: 'pj-row' }, toBoard)), h('div', { class: 'pj-panel' }, lbl('チケットテンプレ（GitHub Issue にそのまま貼れる）'), prev, actions(all, 'issues.md'))), msg);
  }

  function docScene() {
    const SP = loadSpec(), W = loadWbs(), D = loadDet(), E = get('pj.est', null);
    const screens = lines(SP.screens);
    const doc = () => `# ${SP.name}

> ${SP.problem}

## 1. 概要
- 対象ユーザー：${SP.users}
- 機能：${SP.features.filter((f) => f.p === 'Must').map((f) => f.t).join('／')}（Must）
- やらないこと：${lines(SP.notDo).join('／') || 'なし'}

## 2. 画面と流れ
${screens.map((s, i) => `${i + 1}. ${s}${D[s] && D[s].goal ? ' — ' + D[s].goal : ''}`).join('\n')}

## 3. 画面ごとの設計
${screens.map((s) => D[s] && (D[s].parts || D[s].state) ? `### ${s}\n- 画面項目：${lines(D[s].parts).map((x) => x.split('｜')[0]).join('、') || '-'}\n- 操作と処理：${lines(D[s].state).join(' ／ ') || '-'}` : '').filter(Boolean).join('\n\n') || '（詳細設計シートを書くと入る）'}

## 4. 計画
- 合計工数：${r1(W.reduce((a, r) => a + num(r.d), 0))} 人日${E ? `（${E.m}人 × ${E.days}日 × 稼働率${E.rate}%）` : ''}
${wbsMd(W)}

## 5. 受け入れ条件（テスト観点）
${lines(SP.accept).map((x) => '- [ ] ' + x).join('\n')}

## 6. 動かし方
\`\`\`sh
npm install
npm run dev
npm run test
\`\`\`
`;
    const checks = [['仕様書（課題・機能・受け入れ条件）', SP.problem && SP.features.length && SP.accept], ['画面一覧', screens.length], ['詳細設計シート（1画面以上）', screens.some((s) => D[s] && D[s].parts)], ['WBS（作業が分解されている）', W.length >= 3], ['1つが1日以内の作業になっている', W.every((r) => num(r.d) <= 1)], ['工数見積りをした', !!E]];
    const chk = h('div', { style: { display: 'grid', gap: '6px' } }, ...checks.map(([t, ok]) => h('div', { class: 'pj-msg ' + (ok ? 'ok' : 'w') }, (ok ? '✓ ' : '△ ') + t)));
    const REV = ['課題が1文で言える？', '受け入れ条件が、テストにできる文になっている？', 'Must だけで「動くもの」になる？', '1タスクが1日以内？ 担当が決まっている？', 'Plan B（動かない時の代わり）がある？'];
    const map = h('div', { class: 'pj-flow' }, ...[['企画カード', '💡'], ['仕様書', '📋'], ['詳細設計', '📐'], ['WBS・工数', '🗓️'], ['チケット', '🎫'], ['設計書', '🏆']].flatMap(([n, e], i, a) => [h('span', { class: 'pj-chip', style: { '--cc': TEAM } }, e + ' ' + n), i < a.length - 1 ? h('span', { class: 'pj-ar' }, '➜') : null].filter(Boolean)));
    return h('div', { style: { display: 'grid', gap: '12px' } },
      h('div', { class: 'pj-panel' }, lbl('ここまでの成果物は、1枚につながる'), map, h('div', { style: { fontSize: '.85rem', color: 'var(--mute)' } }, '前のシーンで書いた内容が自動で入る。足りない所は、そのシーンに戻って書き足そう。')),
      h('div', { class: 'pj-eq' }, h('div', { class: 'pj-panel' }, lbl('設計書（README）'), code(doc(), 'md', { color: TEAM, file: 'README.md' }), actions(doc, 'README.md')),
        h('div', { class: 'pj-panel' }, lbl('抜けチェック'), chk, lbl('レビューで聞かれること'), ...REV.map((x) => h('label', { class: 'pj-msg', style: { display: 'flex', gap: '8px', cursor: 'pointer' } }, h('input', { type: 'checkbox' }), x)))));
  }


  /* =================================================================
     「アイデア発想 → 発表」を、現場の流れから始まる並びに組み直す
     ================================================================= */
  style('pj2', `
  .pj-sl{display:grid;gap:8px;align-content:start;min-width:0}
  .pj-sh{display:flex;align-items:center;gap:8px;font-weight:900;padding:8px 10px;border-radius:10px;background:color-mix(in srgb,var(--sc) 16%,var(--card));border:2px solid var(--sc)}
  .pj-sh b{font-size:1.4rem}.pj-sh span.st{margin-left:auto;font:800 .72rem var(--font)}
  .pj-oc{all:unset;cursor:pointer;box-sizing:border-box;display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:center;padding:9px 11px;border-radius:10px;border:2px solid var(--line);background:var(--card);font-weight:800;font-size:.84rem;transition:.2s}
  .pj-oc i{font-style:normal;font-size:1.6rem}.pj-oc:hover{transform:translateY(-2px)}
  .pj-oc.on{border-color:var(--sc);background:color-mix(in srgb,var(--sc) 20%,var(--card))}
  .pj-oc small{grid-column:2;font-weight:700;color:var(--mute);font-size:.7rem}
  .pj-sent{padding:18px 20px;border-radius:14px;background:var(--card);border:2px solid var(--line);font-weight:900;font-size:1.15rem;line-height:2.1}
  .pj-sent span{padding:.05em .5em;border-radius:8px;background:color-mix(in srgb,var(--sc) 20%,transparent);border-bottom:3px solid var(--sc)}
  .pj-sent span.ph{opacity:.5;border-bottom-style:dashed}
  .pj-lk{display:grid;gap:4px;padding:12px;border-radius:12px;border:2px solid var(--line);background:var(--card);text-decoration:none;color:inherit;transition:.2s;text-align:center;justify-items:center}
  .pj-lk:hover{transform:translateY(-3px);border-color:var(--team)}.pj-lk b{font-size:1.8rem}.pj-lk small{color:var(--mute);font-weight:700}
  `);

  function problemBuilder() {
    const SL = [
      { k: 'who', ic: '👤', lb: '誰が', c: 'var(--pink)', o: [['👩‍💼', '初めて法律相談をする人', 1], ['👴', '外出がむずかしい高齢の人', 1], ['👥', 'みんな', 0, '顔が浮かばない']] },
      { k: 'when', ic: '🕒', lb: 'いつ', c: 'var(--ts)', o: [['🌙', '夜に困りごとを思いついたとき', 1], ['🏢', '平日の昼、仕事中に', 1], ['⏰', 'いつでも', 0, '場面が分からない']] },
      { k: 'pain', ic: '⚡', lb: '起きたこと', c: 'var(--team)', o: [['📞', '予約の電話がつながらず', 1], ['💸', '費用がいくらか分からず', 1], ['😟', '相談しにくくて', 0, '気持ちだけ']] },
      { k: 'cost', ic: '💥', lb: 'その結果', c: 'var(--bad)', o: [['🚪', '相談をあきらめてしまう', 1], ['🕳️', 'ひとりで抱え込んでしまう', 1], ['📱', 'アプリがあるといい', 0, '解決策が入っている']] },
    ];
    const BAN = { who: /^(みんな|ユーザー|お客さん|誰でも|全員)$/, when: /^(いつでも|いつも|常に)$/, pain: /(しにくい|使いにくい|不便|嫌な|いやな)/, cost: /(アプリ|システム|機能|AI|を作|作りたい|導入)/ };
    const st = Object.assign({ who: null, when: null, pain: null, cost: null }, get('tt.idea.problem2', {}));
    const sent = h('div', { class: 'pj-sent' }), slots = h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '12px' } }), sum = h('div', { class: 'pj-msg w' });
    const val = (S) => { const v = st[S.k]; if (v == null || v === '') return null; const o = S.o.find((x) => x[1] === v); if (o) return { ok: !!o[2], why: o[3] || '' }; return { ok: v.length >= 6 && !BAN[S.k].test(v.trim()), why: '具体的に、起きたことで' }; };
    const draw = () => {
      const t = (S) => st[S.k] ? h('span', { style: { '--sc': S.c } }, st[S.k]) : h('span', { class: 'ph', style: { '--sc': S.c } }, '＿＿＿');
      sent.replaceChildren(t(SL[0]), 'は、', t(SL[1]), '、', t(SL[2]), '。その結果、', t(SL[3]), '。');
      slots.replaceChildren(...SL.map((S) => {
        const v = val(S);
        const inp = h('input', { class: 'pj-in', placeholder: '✎ 自分で書く', value: S.o.some((x) => x[1] === st[S.k]) ? '' : (st[S.k] || ''), oninput: (e) => { st[S.k] = e.target.value; put('tt.idea.problem2', st); upd(); } });
        return h('div', { class: 'pj-sl' },
          h('div', { class: 'pj-sh', style: { '--sc': S.c } }, h('b', S.ic), S.lb, h('span', { class: 'st', style: { color: v ? (v.ok ? 'var(--ok)' : 'var(--bad)') : 'var(--mute)' } }, v ? (v.ok ? '✓ OK' : '✖ ' + v.why) : '選ぶ')),
          ...S.o.map((o) => h('button', { class: 'pj-oc' + (st[S.k] === o[1] ? ' on' : ''), style: { '--sc': S.c }, onclick: () => { st[S.k] = o[1]; put('tt.idea.problem2', st); draw(); } }, h('i', o[0]), o[1], o[2] ? null : h('small', '△ ' + o[3]))), inp);
      }));
      upd(true);
    };
    const upd = (skip) => {
      const n = SL.filter((S) => { const v = val(S); return v && v.ok; }).length;
      sum.className = 'pj-msg ' + (n === 4 ? 'ok' : 'w'); sum.textContent = n === 4 ? '🎉 いい課題文！ これが企画の出発点（次の仕様書に自動で入る）' : `できている ${n} / 4　（△ の付いた選択肢は、あいまいな例）`;
      if (n === 4) put('pj.problem', SL.map((S, i) => st[S.k]).join('|'));
      if (!skip) { sent.replaceChildren(...(() => { const t = (S) => st[S.k] ? h('span', { style: { '--sc': S.c } }, st[S.k]) : h('span', { class: 'ph', style: { '--sc': S.c } }, '＿＿＿'); return [t(SL[0]), 'は、', t(SL[1]), '、', t(SL[2]), '。その結果、', t(SL[3]), '。']; })()); }
    };
    draw();
    return h('div', { style: { display: 'grid', gap: '14px' } }, sent, slots, sum);
  }

  function bridge() {
    const L = [['🗂️', '企画カード', 'さっきのキャンバス', '#/lesson/idea/3'], ['📋', '仕様書', '何を作る？', '#/lesson/pj-design/1'], ['📐', '詳細設計', 'どう作る？', '#/lesson/pj-design/2'], ['🗓️', 'WBS・工数', 'いつ終わる？', '#/lesson/pj-plan/0'], ['🎫', 'タスク', '1人1日で', '#/lesson/pj-plan/2']];
    return h('div', { style: { display: 'grid', gap: '14px' } },
      h('div', { class: 'pj-flow' }, ...L.flatMap(([e, n, d, hr], i) => [h('a', { class: 'pj-lk', href: hr, style: { flex: '1 1 130px' } }, h('b', e), n, h('small', d), h('small', { style: { color: 'var(--team)' } }, i ? '📄 テンプレあり' : '')), i < L.length - 1 ? h('span', { class: 'pj-ar' }, '➜') : null].filter(Boolean))),
      h('div', { class: 'pj-msg w' }, '企画カードができたら、「実践プロジェクト ① ②」でそのまま仕様書 → WBS → タスクまで進める。書いた内容は次の画面に引き継がれる。'));
  }

  /* ---- 1工程 = 1シーン（やること ➜ テンプレ ➜ 結果の例） ---- */
  style('pjstep', `
  .ps-top{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
  .ps-chip{all:unset;cursor:pointer;padding:.3em .8em;border-radius:999px;border:2px solid var(--line);background:var(--card);font:800 .76rem var(--font);transition:.2s;display:inline-flex;gap:.4em;align-items:center}
  .ps-chip.on{border-color:var(--team);background:color-mix(in srgb,var(--team) 22%,var(--card))}.ps-chip:hover{transform:translateY(-2px)}
  .ps-grid{display:grid;grid-template-columns:minmax(0,.85fr) auto minmax(0,1fr) auto minmax(0,1.15fr);gap:12px;align-items:stretch}
  @media(max-width:1100px){.ps-grid{grid-template-columns:1fr}.ps-grid>.ps-ar{transform:rotate(90deg);justify-self:center}}
  .ps-ar{align-self:center;font-size:1.6rem;font-weight:900;color:var(--team);animation:psn 1.1s ease-in-out infinite}
  @keyframes psn{50%{transform:translateX(5px)}}
  .ps-col{border-radius:14px;border:1px solid var(--line);background:var(--card);padding:12px;display:flex;flex-direction:column;gap:10px;min-width:0}
  .ps-col>.ps-doc{flex:1}
  .ps-tasks{display:grid;grid-auto-rows:1fr;gap:16px;flex:1}
  .ps-doc.blank{align-content:space-between}
  .ps-dl{display:flex;gap:8px;flex-wrap:wrap}
  .ps-dl a{text-decoration:none;color:inherit}
  .ps-col>h4{font:900 .86rem var(--font);color:var(--team)}
  .ps-task{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;padding:8px 10px;border-radius:10px;background:var(--card2);border:1px solid var(--line);font-weight:800;font-size:.86rem;position:relative}
  .ps-task i{font-style:normal;font-size:1.5rem;width:40px;height:40px;display:grid;place-items:center;border-radius:50%;background:color-mix(in srgb,var(--team) 20%,transparent)}
  .ps-task small{display:block;color:var(--mute);font-weight:700;font-size:.66rem}
  .ps-task:not(:last-child)::after{content:'▼';position:absolute;left:24px;bottom:-12px;font-size:.7rem;color:var(--team);z-index:1}
  .ps-doc{border-radius:10px;background:#fff;color:#223;padding:12px;display:grid;gap:8px;box-shadow:0 10px 24px -14px #000;min-height:200px;align-content:start}
  .ps-doc h5{font:900 .9rem var(--font);border-bottom:3px solid var(--team);padding-bottom:4px;display:flex;justify-content:space-between}
  .ps-doc .sec{display:grid;gap:3px}.ps-doc .sec b{font:900 .7rem var(--font);color:#667}
  .ps-doc .ln{height:9px;border-radius:5px;background:#e3e6ee}.ps-doc .ln.s{width:60%}
  .ps-doc.sample .ln{display:none}
  .ps-doc .v{font:700 .78rem/1.5 var(--font)}
  .ps-doc table{border-collapse:collapse;width:100%;font-size:.7rem}.ps-doc td,.ps-doc th{border:1px solid #cfd4e2;padding:3px 5px;text-align:left}.ps-doc th{background:#eef1f8}
  .ps-tag{display:inline-block;padding:0 .5em;border-radius:6px;font-weight:900;font-size:.66rem}
  .ps-must{background:#ffc7ce;color:#9c0006}.ps-should{background:#ffeb9c;color:#7a5b00}.ps-could{background:#c6efce;color:#006100}
  .ps-bar{height:10px;border-radius:5px;background:var(--team);opacity:.9}
  `);
  const ROLE_E = { pm: '🧭', design: '🎨', eng: '💻', review: '🔎', user: '🙋', all: '👥' };
  const ROLE_N = { pm: 'PM', design: 'デザイナー', eng: 'エンジニア', review: 'レビュアー', user: 'お客さん', all: '全員' };
  const STEPS = {
    idea: { tasks: [['user', '困りごとを話す'], ['all', 'ブレストで案を出す'], ['pm', '課題文に1文でまとめる'], ['pm', '企画カードに整理']], doc: '企画カード', secs: ['Who（誰の）', 'Problem（課題文）', 'Solution（解決）', 'Features（機能）'], ex: [['Who', '初めて法律相談をする人'], ['Problem', '夜に電話がつながらず、相談をあきらめる'], ['Solution', '24時間いつでも予約できるアプリ'], ['Features', '分野を選ぶ／日時で予約／予約の確認']] },
    spec: { tasks: [['pm', '機能を洗い出す'], ['design', '画面案を描く'], ['user', '優先度を確認'], ['pm', '仕様書に合意']], doc: '仕様書', secs: ['課題・対象ユーザー', '機能一覧（Must / Should / Could）', 'やらないこと', '画面一覧', '受け入れ条件'], ex: 'spec' },
    detail: { tasks: [['design', '画面レイアウトを描く'], ['eng', '項目と入力ルールを決める'], ['eng', '操作 → 処理・API を決める'], ['all', 'エラー時・遷移を確認']], doc: '詳細設計シート', secs: ['目的', '画面項目', '操作と処理', '画面遷移', '入力チェック', 'API・エラー'], ex: [['画面', '日時の選択・予約'], ['画面項目', '相談日（カレンダー・必須）／時間（ボタン・必須）'], ['操作と処理', '「予約する」を押す → 予約を登録 → 確認画面へ'], ['入力チェック', '過去の日は選べない'], ['API', 'GET /slots ／ POST /reservations'], ['エラー時', '満席なら「満席です」を表示']] },
    plan: { tasks: [['pm', '成果物 → 作業に分解'], ['eng', '3点見積り'], ['pm', '担当・期限・先行を決める'], ['all', '収まるか判定 → 調整']], doc: 'WBS・工数表', secs: ['ID／作業', '担当／工数', '開始〜終了', '先行', '進捗'], ex: 'wbs' },
    task: { tasks: [['pm', 'WBS の行をチケットに'], ['eng', '完了条件（DoD）を書く'], ['pm', '担当を割り当て'], ['all', 'カンバンに並べる']], doc: 'チケット', secs: ['タイトル', '背景', 'やること', '完了条件', '見積り・担当・期限'], ex: 'ticket' },
    build: { tasks: [['eng', 'ブランチを切る'], ['eng', '作る ＋ テストを書く'], ['review', 'PR を見て指摘'], ['eng', '直して統合']], doc: 'プルリクエスト', secs: ['変更の内容', '確認の方法', '画面のキャプチャ', 'チェックリスト'], ex: 'pr' },
    doc: { tasks: [['pm', 'README にまとめる'], ['eng', '動かし方を書く'], ['all', 'リハーサル'], ['user', 'デモを見て感想']], doc: '設計書（README）', secs: ['概要', '画面と流れ', '部品とデータ', '計画', '動かし方'], ex: 'readme' },
  };
  const exampleDoc = (k, st) => {
    const sp = loadSpec(), W = loadWbs();
    const head = (t, c) => h('h5', h('span', t), h('span', { class: 'ps-tag', style: { background: '#e6f4ef', color: '#0a6' } }, c || '記入例'));
    if (st.ex === 'spec') return h('div', { class: 'ps-doc sample' }, head('仕様書：' + sp.name.split('（')[0]), h('div', { class: 'sec' }, h('b', '課題'), h('div', { class: 'v' }, sp.problem)), h('table', h('tr', h('th', '機能'), h('th', '優先度')), ...sp.features.map((f) => h('tr', h('td', f.t), h('td', h('span', { class: 'ps-tag ps-' + f.p.toLowerCase() }, f.p))))), h('div', { class: 'sec' }, h('b', 'やらないこと'), h('div', { class: 'v' }, sp.notDo)), h('div', { class: 'sec' }, h('b', '受け入れ条件'), h('div', { class: 'v' }, '✓ ' + lines(sp.accept).join('\n✓ '))));
    if (st.ex === 'wbs') { const end = Math.max(1, ...W.map((r) => num(r.e))); return h('div', { class: 'ps-doc sample' }, head('WBS（' + W.length + '作業／' + r1(W.reduce((a, r) => a + num(r.d), 0)) + '人日）'), h('table', h('tr', h('th', 'ID'), h('th', '作業'), h('th', '担当'), h('th', '人日'), h('th', { style: { width: '34%' } }, '期間')), ...W.slice(0, 6).map((r) => h('tr', h('td', r.id), h('td', r.t), h('td', r.who), h('td', String(r.d)), h('td', h('div', { style: { position: 'relative', height: '10px', background: '#eef1f8', borderRadius: '5px' } }, h('div', { class: 'ps-bar', style: { position: 'absolute', left: (num(r.s) / end * 100) + '%', width: Math.max(4, (num(r.e) - num(r.s)) / end * 100) + '%' } })))))), h('div', { class: 'v' }, '合計 ' + r1(W.reduce((a, r) => a + num(r.d), 0)) + ' 人日 ／ ' + end + ' 日'));}
    if (st.ex === 'ticket') { const r = W[4] || W[0]; return h('div', { class: 'ps-doc sample' }, head('[' + r.id + '] ' + r.t, 'チケット'), h('div', { class: 'sec' }, h('b', '背景'), h('div', { class: 'v' }, '仕様書 F-2「空いている日時から予約する」(Must)')), h('div', { class: 'sec' }, h('b', '完了条件（DoD）'), h('div', { class: 'v' }, '☑ 受け入れ条件の動きを手で確認\n☐ テストを書いた\n☐ PR のレビューを1人から受けた')), h('table', h('tr', h('th', '見積り'), h('th', '担当'), h('th', '期限'), h('th', '状態')), h('tr', h('td', r.d + ' 人日'), h('td', r.who), h('td', num(r.e) + ' 日目'), h('td', '進行中')))); }
    if (st.ex === 'pr') return h('div', { class: 'ps-doc sample' }, head('feat: 日時選択の画面を追加 (#12)', 'PR'), h('div', { class: 'sec' }, h('b', '変更の内容'), h('div', { class: 'v' }, '・DateSelect / TimeSlots を追加\n・過去日を選べないようにした')), h('div', { class: 'sec' }, h('b', '確認の方法'), h('div', { class: 'v' }, 'npm run dev → 日時を選んで予約 → 確認画面に出る')), h('div', { class: 'sec' }, h('b', 'チェックリスト'), h('div', { class: 'v' }, '☑ テスト通過\n☑ 自分で動作確認\n☐ レビュー1人（依頼中）')));
    if (st.ex === 'readme') return h('div', { class: 'ps-doc sample' }, head('README.md', '設計書'), h('div', { class: 'v', style: { fontWeight: 900, fontSize: '.95rem' } }, '# ' + sp.name), h('div', { class: 'v' }, '> ' + sp.problem), h('div', { class: 'v' }, '## 画面と流れ\n' + lines(sp.screens).map((x, i) => (i + 1) + '. ' + x).join('\n')), h('div', { class: 'v' }, '## 計画\n合計 ' + r1(W.reduce((a, r) => a + num(r.d), 0)) + ' 人日'), h('div', { class: 'v', style: { fontFamily: 'var(--mono)', background: '#f1f3f9', padding: '4px 6px', borderRadius: '6px' } }, 'npm install\nnpm run dev\nnpm run test'));
    return h('div', { class: 'ps-doc sample' }, head(st.doc), ...st.ex.map(([a, b]) => h('div', { class: 'sec' }, h('b', a), h('div', { class: 'v' }, b))));
  };
  const blankDoc = (st) => st.ex === 'wbs'
    ? h('div', { class: 'ps-doc blank' }, h('h5', h('span', st.doc), h('span', { class: 'ps-tag', style: { background: '#fff4d6', color: '#a60' } }, '空のテンプレ')), h('table', h('tr', ...['ID', '作業', '担当', '人日', '期間'].map((x) => h('th', x))), ...Array.from({ length: 6 }, () => h('tr', ...Array.from({ length: 5 }, () => h('td', { style: { height: '22px' } }, ''))))), h('div', { class: 'v', style: { color: '#889' } }, '合計 ＿ 人日 ／ ＿ 日'))
    : h('div', { class: 'ps-doc blank' }, h('h5', h('span', st.doc), h('span', { class: 'ps-tag', style: { background: '#fff4d6', color: '#a60' } }, '空のテンプレ')), ...st.secs.map((x) => h('div', { class: 'sec' }, h('b', x), h('div', { class: 'ln' }), h('div', { class: 'ln s' }))));
  const DL = { idea: [['企画カード', '01_企画カード.xlsx']], spec: [['仕様書', '02_仕様書.xlsx']], detail: [['詳細設計シート', '03_詳細設計シート.xlsx']], plan: [['WBS', '04_WBS.xlsx'], ['工数見積', '04_工数見積.xlsx']], task: [['チケット一覧', '05_チケット一覧.xlsx']], doc: [['設計書', '07_設計書.xlsx']] };

  function stepScene(idx) {
    const P = PH[idx], st = STEPS[P.k], tools = PJ_TOOLS[P.k] || [];
    const top = h('div', { class: 'ps-top' }, ...PH.map((p, i) => h('a', { class: 'ps-chip' + (i === idx ? ' on' : ''), href: '#/lesson/idea/' + (i + 1), style: { textDecoration: 'none', color: 'inherit' } }, p.e + ' ' + (i + 1))));
    const tasks = h('div', { class: 'ps-col' }, h('h4', '① やること（誰が？）'), h('div', { class: 'ps-tasks' }, ...st.tasks.map(([r, t]) => h('div', { class: 'ps-task' }, h('i', ROLE_E[r]), h('span', t, h('small', ROLE_N[r]))))));
    const tpl = h('div', { class: 'ps-col' }, h('h4', '② テンプレ'), blankDoc(st), (DL[P.k] || []).length ? h('div', { class: 'ps-dl' }, ...DL[P.k].map(([n, f]) => h('a', { class: 'btn primary', style: { '--c': TEAM }, href: 'templates/' + f, download: f, title: '1シートだけの Excel（記入例つき）' }, '📥 ' + n + '（Excel）'))) : null);
    const res = h('div', { class: 'ps-col' }, h('h4', '③ 結果の例（実際はこう書く）'), exampleDoc(P.k, st));
    const btns = h('div', { class: 'pj-row' }, ...tools.map(([e, n, fn]) => h('button', { class: 'btn primary', style: { '--c': TEAM }, onclick: () => openTool(e, n, fn) }, e + ' ' + n + ' をブラウザで試す')));
    const nav = h('div', { class: 'pj-row', style: { color: 'var(--mute)', fontWeight: 800, fontSize: '.8rem' } }, '入力：' + (idx ? STEPS[PH[idx - 1].k].doc : 'お題・困りごと'), ' ➜ ', P.e + ' ' + P.n, ' ➜ ', '成果物：' + st.doc);
    return h('div', { style: { display: 'grid', gap: '12px' } }, top, h('div', { class: 'ps-grid' }, tasks, h('span', { class: 'ps-ar' }, '➜'), tpl, h('span', { class: 'ps-ar' }, '➜'), res), btns, nav);
  }

  const IDEA = K.lessons['idea'];
  if (IDEA) {
    const by = {}; IDEA.scenes.forEach((x) => { by[x.t] = x; });
    const fromScene = (sc) => (box) => { try { sc.render(box, { cleanups: [] }); } catch (e) { box.append(h('div', { class: 'pj-msg ng' }, '読み込めませんでした')); } };
    const dev = K.lessons['dev'] && K.lessons['dev'].scenes.find((x) => x.t === 'カンバンボード');
    PJ_TOOLS.idea = [['🧠', 'ブレスト・ウォール', fromScene(by['ブレスト・ウォール'])], ['🎯', '課題文をつくる', (box) => box.append(problemBuilder())], ['🗂️', 'アイデアキャンバス', fromScene(by['アイデアキャンバス'])]];
    PJ_TOOLS.spec = [['📋', '仕様書テンプレ', (box) => box.append(specScene())]];
    PJ_TOOLS.detail = [['📐', '詳細設計シート', (box) => box.append(detailScene())]];
    PJ_TOOLS.plan = [['🗓️', 'WBS・ガントチャート', (box) => box.append(wbsScene())], ['⚖️', '工数見積', (box) => box.append(estimateScene())]];
    PJ_TOOLS.task = [['🎫', 'チケット', (box) => box.append(ticketScene())]];
    PJ_TOOLS.build = dev ? [['🗂️', 'カンバンボード', fromScene(dev)]] : [];
    PJ_TOOLS.doc = [['🏆', '設計書（README）', (box) => box.append(docScene())]];
    const flowScene = { t: '現場の流れと登場人物', tag: 'FLOW', lead: '<b>工程</b>か<b>役割</b>を押すと、関わる所が光る。次のページから、<b>1工程ずつ</b>やることを見ていく。', render(el) { el.append(overview()); } };
    const TITLES = ['STEP 1：企画', 'STEP 2：仕様設計', 'STEP 3：詳細設計', 'STEP 4：計画（WBS・工数）', 'STEP 5：タスク化', 'STEP 6：実装・テスト', 'STEP 7：設計書・発表'];
    const LEADS = ['<b>誰の何の困りごと</b>を、1枚の企画カードにする。', '<b>何を作るか</b>を決める。作るもの／作らないものの線を引く。', '<b>どう作るか</b>。画面を部品とデータに分ける。', '作業に分解して、<b>いつ終わるか</b>を数字で出す。', 'WBS の行を<b>チケット</b>にして、担当を決める。', 'ブランチで作り、<b>PR</b>でレビューを受ける。', 'ここまでを<b>1枚の設計書</b>にして、デモで見せる。'];
    const stepScenes = PH.map((p, i) => ({ t: TITLES[i], tag: 'STEP ' + (i + 1), lead: LEADS[i], render(el) { el.append(stepScene(i)); } }));
    K.sceneTerms = K.sceneTerms || {};
    const T = K.sceneTerms, cat = (...ks) => [].concat(...ks.map((k) => T[k] || []));
    T[TITLES[0]] = cat('ブレスト・ウォール', 'あいまいな願いを課題文にする', 'アイデアキャンバス');
    T[TITLES[1]] = cat('仕様設計：何を作る？'); T[TITLES[2]] = cat('詳細設計：どう作る？'); T[TITLES[3]] = cat('WBS：作業を分解する', '工数見積：収まる？'); T[TITLES[4]] = cat('タスクをつくる');
    T[TITLES[5]] = [{ k: 'ブランチ', y: 'ぶらんち', m: 'mainを触らずに作業するための枝。', r: 'feature/日時選択 のように名前を付ける。' }, { k: 'プルリクエスト', y: 'ぷるりくえすと', m: '「この変更を取り込んでください」とチームに頼む仕組み（PR）。', r: '小さく出して、早くレビューをもらう。' }, { k: 'レビュー', y: 'れびゅー', m: '別の人が変更を見てチェックすること。', r: '1人以上の承認がないと main に入れない、が定番。' }, { k: 'マージ', y: 'まーじ', m: 'ブランチの変更を main に取り込むこと。', r: 'マージ前に、テストが通っているか確認する。' }];
    T[TITLES[6]] = cat('設計書にまとめる', '30秒ピッチ');
    IDEA.scenes = [flowScene].concat(stepScenes, [by['30秒ピッチ']]).filter(Boolean);
  }

  /* ---------- 登録 ---------- */
  K.reg({
    id: 'pj-design', track: 'team', title: '実践プロジェクト ①', sub: '企画 → 仕様設計 → 詳細設計', emoji: '📋',
    meta: { day: '5日目', when: 'アイデア発想のあと（アイデアが決まったら）', mins: 60, order: 1, level: '実践', after: 'idea', why: '作る前に「何を・どう作るか」を決めておくと、手戻りと待ち時間が減る。現場の流れとテンプレを体験する' },
    scenes: [
      { t: '現場の流れと登場人物', tag: 'FLOW', lead: '実際の開発は<b>7つの工程</b>。前の<b>成果物</b>が次の<b>入力</b>になる。工程を押して、<b>誰が何を作るか</b>を見よう。', render(el) { el.append(overview()); } },
      { t: '仕様設計：何を作る？', tag: 'SPEC', lead: '<b>「何を作るか」</b>を決める。入力すると右に<b>仕様書</b>ができる。完成したらコピーして使おう。', render(el) { el.append(specScene()); } },
      { t: '詳細設計：どう作る？', tag: 'DESIGN', lead: '仕様書の画面を、<b>部品とデータ</b>に分ける。画面ごとに設計シートを埋めよう。', render(el) { el.append(detailScene()); } },
    ],
  });
  K.reg({
    id: 'pj-plan', track: 'team', title: '実践プロジェクト ②', sub: 'WBS → 工数見積 → タスク → 設計書', emoji: '🗓️',
    meta: { day: '5日目', when: '実践プロジェクト ① のあと（開発に入る前）', mins: 60, order: 2, level: '実践', after: 'idea', why: '「いつ終わるか」を数字で出し、1人1日のタスクに分けて、設計書1枚にまとめる' },
    scenes: [
      { t: 'WBS：作業を分解する', tag: 'WBS', lead: '成果物を<b>0.5〜1日の作業</b>まで分ける。表を直すと<b>ガントチャート</b>が動く。', render(el) { el.append(wbsScene()); } },
      { t: '工数見積：収まる？', tag: 'ESTIMATE', lead: '作業ごとに<b>3点見積り</b>。人数・日数・稼働率で、<b>チームに収まるか</b>を判定する。', render(el) { el.append(estimateScene()); } },
      { t: 'タスクをつくる', tag: 'TICKET', lead: 'WBS の行が<b>チケット</b>になる。<b>カンバンに送る</b>と、開発の回のボードに並ぶ。', render(el) { el.append(ticketScene()); } },
      { t: '設計書にまとめる', tag: 'DOC', lead: '仕様・設計・WBS・工数が<b>1枚の設計書</b>に集まる。抜けをチェックして、コピーしよう。', render(el) { el.append(docScene()); } },
    ],
  });
})();
