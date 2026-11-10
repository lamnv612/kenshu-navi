/* 研修ナビ — schedule view, lesson shell, router */
(function () {
  'use strict';
  const K = window.KENSHU, { h, store } = K.W;

  const TRACKS = {
    basic: { name: 'HTML/CSS · CUI · Git', color: 'var(--basic)' },
    ts: { name: 'TypeScript', color: 'var(--ts)' },
    vue: { name: 'Vue.js', color: 'var(--vue)' },
    team: { name: 'チーム開発', color: 'var(--team)' },
    extra: { name: '補足（スライド外）', color: 'var(--violet)' },
  };
  K.TRACKS = TRACKS;

  // columns: 16→2, 17→3, 18→4, 19→5, (sep 6), 24→7, 25→8
  const DAYS = [
    { d: 16, w: '月', col: 2, date: '2026-11-16' }, { d: 17, w: '火', col: 3, date: '2026-11-17' },
    { d: 18, w: '水', col: 4, date: '2026-11-18' }, { d: 19, w: '木', col: 5, date: '2026-11-19' },
    { d: 24, w: '火', col: 7, date: '2026-11-24' }, { d: 25, w: '水', col: 8, date: '2026-11-25' },
  ];
  // [dayIdx, fromHour, toHour, label, sub, lessonId, track, emoji]
  const CELLS = [
    [0, 10, 10, 'コース紹介', '', 'intro', 'basic', '🚀'],
    [0, 11, 11, 'CUI ・ Vim', 'ターミナル', 'cuivim', 'basic', '⌨️'],
    [0, 13, 13, 'Git', 'バージョン管理', 'git', 'basic', '🌿'],
    [0, 14, 16, 'HTML', '構造をつくる', 'html', 'basic', '🧱'],
    [0, 17, 18, 'CSS', '見た目をつくる', 'css', 'basic', '🎨'],
    [1, 10, 10, '紹介', 'TypeScriptとは', 'ts-intro', 'ts', '✨'],
    [1, 11, 11, '基礎文法', '', 'ts-basic', 'ts', '📘'],
    [1, 13, 14, '基礎文法', '型の指定', 'ts-basic', 'ts', '📘'],
    [1, 15, 16, 'データ型', '配列・タプル・Object', 'ts-basic', 'ts', '🧩'],
    [1, 17, 17, '型の構文', 'Union / Enum', 'ts-types', 'ts', '🔀'],
    [1, 18, 18, 'クラス', 'Class', 'ts-class', 'ts', '🏭'],
    [2, 10, 10, 'インタフェース', 'interface', 'ts-types', 'ts', '📐'],
    [2, 11, 11, 'Type', '型エイリアス', 'ts-types', 'ts', '🏷️'],
    [2, 13, 13, 'ジェネリクス', 'Generics', 'ts-generics', 'ts', '📦'],
    [2, 14, 17, 'TypeScript\n単体テスト入門 (Jest)', 'テストを書こう', 'ts-test', 'ts', '🧪'],
    [2, 18, 18, '復習', 'クイズ', 'review', 'ts', '🔁'],
    [3, 10, 10, '紹介', 'Vue.jsとは', 'vue-intro', 'vue', '💚'],
    [3, 11, 11, '環境設定', 'プロジェクト作成', 'vue-env', 'vue', '🛠️'],
    [3, 13, 16, '基礎', 'ref・v-if・v-model・イベント', 'vue-basics', 'vue', '⚡'],
    [3, 17, 18, 'コンポーネント', 'props / emit', 'vue-comp', 'vue', '🧬'],
    [4, 10, 10, '復習', 'クイズ', 'review', 'vue', '🔁'],
    [4, 11, 11, 'アイデア発想', '', 'idea', 'team', '💡'],
    [4, 13, 13, 'Life Cycle、Computed、\nWatcher …他', '', 'vue-life', 'vue', '⏱️'],
    [4, 14, 14, 'Vue Router', 'ページ遷移', 'vue-router', 'vue', '🧭'],
    [4, 15, 17, '単体テスト\n入門 (Jest)', '', 'ts-test', 'vue', '🧪'],
    [4, 18, 18, 'Q&A', '', 'qa', 'vue', '🙋'],
    [5, 10, 11, 'アイデア発想 → 発表', 'ブレスト', 'idea', 'team', '🎯'],
    [5, 13, 14, '開発', 'チーム開発', 'dev', 'team', '💻'],
    [5, 15, 16, '準備', '発表の準備', 'prep', 'team', '📝'],
    [5, 17, 18, '成果発表', 'Demo Day', 'demo', 'team', '🏆'],
  ];
  K.CELLS = CELLS;


  /* ---------- GitHub links ---------- */
  const GH = 'https://github.com/tpa-bengo4-2026/git_practice_repo/';
  const ghUrl = (path) => GH + (/\.[A-Za-z0-9]+$/.test(path) ? 'blob/' : 'tree/') + (window.KENSHU_GH_REF || 'main') + '/' + encodeURI(path);
  K.ghUrl = ghUrl;
  const GH_MAP = {
    cuivim: [['cli/ — コマンド集', 'cli'], ['vim/ — 練習ガイド', 'vim']],
    git: [['git/ — SSH・補足', 'git']],
    html: [['html/ — サンプル一式', 'html'], ['01_main_page.html', 'html/01_main_page.html']],
    css: [['box-model', 'html/02.2_box_model'], ['display / flex', 'html/03_display'], ['position', 'html/04_position'], ['CSS適用方法', 'html/02.2_適用方法'], ['命名規則 (BEM)', 'html/05_css_naming_conversation']],
    'ts-intro': [['typescript/ — サンプル', 'typescript']],
    'ts-basic': [['01_basic_types.ts', 'typescript/01_basic_types.ts'], ['03_array_tuple.ts', 'typescript/03_array_tuple.ts'], ['10_any_type.ts', 'typescript/10_any_type.ts'], ['11_undefined_null.ts', 'typescript/11_undefined_null.ts']],
    'ts-types': [['02_type_alias', 'typescript/02_type_alias.ts'], ['04_interface', 'typescript/04_interface.ts'], ['05_interface_vs_type.md', 'typescript/05_interface_vs_type.md'], ['08_union_type', 'typescript/08_union_type.ts'], ['09_enum', 'typescript/09_enum.ts']],
    'ts-class': [['12_class/', 'typescript/12_class']],
    'ts-generics': [['07_generics.md', 'typescript/12_class/07_generics.md']],
    'ts-test': [['13_unit_test/', 'typescript/13_unit_test']],
    'vue-intro': [['vuejs/', 'vuejs']],
    'vue-env': [['01_init_project/', 'vuejs/01_init_project']],
    'vue-basics': [['02_components', 'vuejs/02_components'], ['05_v-if / v-show', 'vuejs/05_v-if_v-else_v-show'], ['06_event-handling', 'vuejs/06_event-handling'], ['07_css-binding', 'vuejs/07_css-binding']],
    'vue-comp': [['03_props', 'vuejs/03_props'], ['04_model', 'vuejs/04_model']],
    'vue-life': [['08_lifecycle-hooks', 'vuejs/08_lifecycle-hooks'], ['09_computed', 'vuejs/09_computed'], ['10_watcher', 'vuejs/10_watcher']],
    'vue-router': [['12_router', 'vuejs/12_router']],
    'vue-test': [['13_unit-test', 'vuejs/13_unit-test']],
  };
  function ghLinks(L) {
    const raw = L.gh ? L.gh.map((g) => (Array.isArray(g) ? g : [g.label, g.path])) : GH_MAP[L.id] || [];
    return raw.map(([label, path]) => ({ label, url: ghUrl(path) }));
  }
  const PRACTICE = window.KENSHU_PRACTICE || [];
  const practiceFor = (id, title) => {
    const all = PRACTICE.filter((x) => x.lesson === id);
    return { scene: all.filter((x) => x.scene && x.scene === title), lesson: all.filter((x) => !x.scene) };
  };
  const extrasOf = (id) => Object.values(K.lessons).filter((l) => l.track === 'extra' && l.meta && l.meta.after === id);
  const ghChip = (g) => h('a', { class: 'gh', href: g.url, target: '_blank', rel: 'noopener' }, K.W.icon('github-mark'), h('span', { class: 'gl' }, g.label), K.W.icon('external-link'));

  const app = document.getElementById('app');
  K.W.watchIcons(app);
  const row = (hr) => hr - 7; // 10→3 ... 18→11

  function progressOf(id) {
    const l = K.lessons[id];
    if (!l) return 0;
    return Math.min(1, store.getSeen(id).length / l.scenes.length);
  }

  /* ---------- top bar ---------- */
  function topbar(crumb) {
    const theme = document.documentElement.dataset.theme === 'light';
    return h('header', { class: 'top' },
      h('a', { class: 'logo', href: '#/' }, h('i', '研'), '研修ナビ'),
      crumb || null, h('div', { class: 'sp' }),
      h('button', { class: 'btn ghost', 'aria-label': 'テーマ切替', title: 'テーマ切替（プロジェクター用）', onclick: () => {
        const t = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        document.documentElement.dataset.theme = t; store.set('theme', t);
      } }, theme ? '🌙' : '☀️', h('span', { class: 'lbl' }, ' テーマ')));
  }


  function extrasSection() {
    const ex = Object.values(K.lessons).filter((l) => l.track === 'extra').sort((a, b) => ((a.meta || {}).order || 99) - ((b.meta || {}).order || 99));
    if (!ex.length) return null;
    const CATS = [['basic', '16日(月)', 'HTML/CSS · CUI · Git', 'var(--basic)'], ['ts', '17–18日', 'TypeScript', 'var(--ts)'], ['vue', '19日 以降', 'Vue.js', 'var(--vue)'], ['common', 'いつでも', '共通・チーム開発', 'var(--team)']];
    const totalMin = ex.reduce((n, l) => n + ((l.meta || {}).mins || 0), 0);
    const wrap = h('section', { class: 'extras', id: 'extras' },
      h('div', { class: 'ex-head' },
        h('div', null, h('span', { class: 'chip', style: { '--c': 'var(--violet)' } }, K.W.icon('sparkles'), 'EXTRA'), h('h2', null, 'スライド外の補足トピック'),
          h('p', null, 'スライドに無い、でも知っておくと一気に楽になる内容。時間が余ったときや区切りのタイミングで、1つずつ紹介していくための一覧です。各カードに「いつ紹介するか」「所要時間」「GitHub の元資料」を付けています。')),
        h('div', { class: 'ex-stat' }, h('b', ex.length), h('span', 'topics'), h('b', totalMin), h('span', 'min total'))));
    CATS.forEach(([cat, day, name, color]) => {
      const list = ex.filter((l) => ((l.meta || {}).cat || 'common') === cat);
      if (!list.length) return;
      wrap.append(h('div', { class: 'ex-phase', style: { '--c': color } },
        h('div', { class: 'ex-day' }, h('b', day), h('span', name)),
        h('div', { class: 'ex-list' }, list.map((l, i) => {
          const m = l.meta || {}, p = progressOf(l.id), gl = ghLinks(l);
          return h('article', { class: 'ex-card' + (p >= 1 ? ' done' : ''), style: { '--i': i } },
            h('a', { class: 'ex-main', href: '#/lesson/' + l.id },
              h('span', { class: 'ex-ico' }, l.emoji || '✨'),
              h('div', null,
                h('h3', l.title),
                h('div', { class: 'ex-meta' }, h('span', K.W.icon('timer'), (m.mins || 5) + '分'), m.level ? h('span', K.W.icon('signal'), m.level) : null, m.after && K.lessons[m.after] ? h('span', K.W.icon('corner-down-right'), K.lessons[m.after].title + ' の後') : null),
                m.when ? h('p', { class: 'ex-when' }, K.W.icon('clock-3'), m.when) : null,
                m.why ? h('p', { class: 'ex-why' }, m.why) : null)),
            h('div', { class: 'ex-foot' }, gl.slice(0, 3).map(ghChip), h('span', { class: 'ex-go' }, '開く', K.W.icon('arrow-right'))),
            h('span', { class: 'bar', style: { '--p': p } }));
        }))));
    });
    return wrap;
  }


  /* ---------- phone: day-by-day agenda instead of the wide grid ---------- */
  function agendaView(todayIdx) {
    const wrap = h('div', { class: 'sched-m' });
    const THEME = ['basic', 'ts', 'ts', 'vue', 'vue', 'vue'];
    const THEME_NAME = { basic: 'HTML/CSS · CUI · Git', ts: 'TypeScript', vue: 'Vue.js' };
    let cur = todayIdx >= 0 ? todayIdx : 0;
    const chips = h('div', { class: 'am-days' });
    const list = h('div', { class: 'am-list' });
    const hh = (n) => String(n).padStart(2, '0') + ':00';
    function draw() {
      chips.querySelectorAll('.am-chip').forEach((c) => c.classList.toggle('on', +c.dataset.i === cur));
      const d = DAYS[cur], tr = THEME[cur];
      const items = CELLS.filter((c) => c[0] === cur).sort((a, b) => a[1] - b[1]);
      list.replaceChildren(
        h('div', { class: 'am-theme', style: { '--c': TRACKS[tr].color } }, h('b', THEME_NAME[tr]), h('small', `${d.d}日（${d.w}）`)),
        ...items.flatMap((c, i) => {
          const [, a, b, label, sub, id, track, em] = c;
          const p = progressOf(id), nx = items[i + 1];
          const row = h('a', { class: 'am-item', href: '#/lesson/' + id, style: { '--c': TRACKS[track].color, '--i': i } },
            h('span', { class: 'am-t' }, hh(a), h('small', ((b - a + 1) * 60) + '分')),
            h('span', { class: 'am-b' }, h('b', label.replace(/\n/g, ' ')), sub ? h('small', sub) : null,
              extrasOf(id).length && CELLS.findIndex((x) => x[5] === id) === CELLS.indexOf(c) ? h('span', { class: 'xtra' }, K.W.icon('sparkles'), '補足 +' + extrasOf(id).length) : null),
            h('span', { class: 'am-em' }, em), h('span', { class: 'bar', style: { '--p': p } }));
          const out = [row];
          if (nx && b <= 11 && nx[1] >= 13) out.push(h('div', { class: 'am-lunch' }, '昼休み 12:00'));
          return out;
        }));
    }
    DAYS.forEach((d, i) => {
      if (i === 4) chips.append(h('span', { class: 'am-gap' }, '1週間後'));
      chips.append(h('button', { class: 'am-chip' + (i === todayIdx ? ' today' : ''), 'data-i': i, onclick: () => { cur = i; draw(); } }, h('b', d.d), h('small', d.w)));
    });
    wrap.append(chips, list); draw();
    return wrap;
  }

  /* ---------- home / scheduler ---------- */
  function home() {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const first = new Date(DAYS[0].date + 'T00:00:00');
    const diff = Math.ceil((first - new Date(todayStr + 'T00:00:00')) / 864e5);
    const todayIdx = DAYS.findIndex((d) => d.date === todayStr);

    const g = h('div', { class: 'sched' });
    g.append(h('div', { class: 'sh time', style: { gridColumn: 1, gridRow: 1 } }, '時間'));
    DAYS.forEach((d, i) => g.append(h('div', { class: 'sh' + (i === todayIdx ? ' today' : ''), style: { gridColumn: d.col, gridRow: 1 } }, h('div', d.d + '日', h('small', d.w + '曜日')))));
    g.append(h('div', { class: 'sep', style: { gridColumn: 6, gridRow: '1 / 12' } }, '1週間後'));
    g.append(h('div', { class: 'sh time', style: { gridColumn: 1, gridRow: 2, fontFamily: 'var(--font)' } }, 'テーマ'));
    [['basic', 2, 2], ['ts', 3, 4], ['vue', 5, 8]].forEach(([t, a, b]) => {
      g.append(h('div', { class: 'theme', style: { gridColumn: `${a} / ${b + 1}`, gridRow: 2, '--c': TRACKS[t].color } },
        { basic: 'HTML/CSS · CUI · Git', ts: 'TypeScript', vue: 'Vue.js' }[t]));
    });
    for (let hr = 10; hr <= 18; hr++) g.append(h('div', { class: 'sh time', style: { gridColumn: 1, gridRow: row(hr) } }, hr));
    g.append(h('div', { class: 'lunch', style: { gridRow: 5 } }, '昼　休　み'));
    CELLS.forEach(([di, a, b, label, sub, id, track, em], i) => {
      const d = DAYS[di], p = progressOf(id);
      g.append(h('a', {
        class: 'cell' + (p >= 1 ? ' done' : ''), href: '#/lesson/' + id,
        style: { gridColumn: d.col, gridRow: `${row(a)} / ${row(b) + 1}`, '--c': TRACKS[track].color, '--i': i, '--p': p },
        title: label.replace('\n', ' '),
      }, h('b', { html: label.replace('\n', '<br>') }), sub ? h('small', sub) : null, h('span', { class: 'em' }, em), extrasOf(id).length && i === CELLS.findIndex((c) => c[5] === id) ? h('span', { class: 'xtra', title: '補足トピックあり' }, K.W.icon('sparkles'), '+' + extrasOf(id).length) : null, h('span', { class: 'bar' })));
    });

    const totalScenes = Object.values(K.lessons).reduce((n, l) => n + l.scenes.length, 0);
    const seen = Object.values(K.lessons).reduce((n, l) => n + store.getSeen(l.id).length, 0);

    return h('div', null, topbar(),
      h('main', { class: 'home' },
        h('section', { class: 'hero' },
          h('div', null,
            h('h1', null, '手を動かして学ぶ、', h('br'), h('em', '新入社員プログラミング研修')),
            h('p', null, '下の時間割からテーマをクリック。図とアニメーションで「なぜそうなるか」を一歩ずつ確かめながら、その場でコードを書いて試せます。')),
          h('div', { class: 'countdown' },
            diff > 0 ? [h('b', diff), h('span', 'DAYS UNTIL 11/16 START')] : todayIdx >= 0 ? [h('b', '🔥'), h('span', '今日は研修日！')] : [h('b', '✓'), h('span', 'お疲れさま')],
            h('div', { style: { marginTop: '.6em', fontSize: '.75rem', color: 'var(--mute)' } }, `学習進捗 ${seen}/${totalScenes} シーン`))),
        h('div', { class: 'legend' }, Object.entries(TRACKS).map(([k, t]) => h('span', { class: 'chip', style: { '--c': t.color } }, '● ' + t.name))),
        g, agendaView(todayIdx),
        h('div', { class: 'hint' }, h('span', '👆 マスをクリックで学習ページへ'), h('span', '⌨️ ← → キーで次のステップ'), h('span', '✍️ 各ページの最後に「実践」あり'), h('button', { class: 'hint-reset', title: '進捗を消して、各ページの「困りごと→考え方→解決」を最初から表示します', onclick: () => {
        const m = K.W.modal({ title: '進捗をリセット', icon: 'rotate-ccw', narrow: true, content: () => h('div', { class: 'col' },
          h('p', '学習の進み具合（チェック・バー）を消して、最初の状態に戻します。'),
          h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: () => { store.set('seen', {}); location.reload(); } }, 'リセットする'), h('button', { class: 'btn ghost', onclick: () => m.close() }, 'やめる'))) });
      } }, K.W.icon('rotate-ccw'), '進捗リセット'), h('a', { href: '#/extras', class: 'hint-link' }, '✨ スライド外の補足へ ↓')),
        extrasSection()));
  }

  /* ---------- lesson view ---------- */
  function lessonView(id, idx) {
    const L = K.lessons[id];
    if (!L) {
      return h('div', null, topbar(), h('main', { class: 'home' },
        h('h1', '🚧 準備中'), h('p', { style: { color: 'var(--mute)', margin: '1em 0' } }, 'このレッスンはまだありません: ' + id), h('a', { class: 'btn primary', href: '#/' }, '← 時間割へ')));
    }
    const color = TRACKS[L.track].color;
    idx = Math.max(0, Math.min(L.scenes.length - 1, idx | 0));
    const root = h('div', { style: { '--c': color } });
    const railItems = L.scenes.map((s, i) => h('li', { class: (i === idx ? 'on ' : '') + (store.getSeen(id).includes(i) ? 'seen' : '') },
      h('button', { onclick: () => (location.hash = `#/lesson/${id}/${i}`) }, h('span', { class: 'n' }, i + 1), h('span', { class: 't' }, s.t))));
    const gl = ghLinks(L), ex = extrasOf(id);
    const rail = h('aside', { class: 'rail' }, h('h3', null, L.emoji + ' ' + L.title), h('div', { class: 'sub' }, L.sub || ''), h('ol', null, railItems),
      L.meta && L.meta.mins ? h('div', { class: 'rail-meta' }, h('span', K.W.icon('timer'), L.meta.mins + '分'), L.meta.when ? h('p', L.meta.when) : null) : null,
      (gl.length || practiceFor(id, '').lesson.length) ? h('div', { class: 'rail-box' }, h('div', { class: 'label' }, 'GitHub'), practiceFor(id, '').lesson.map((x) => ghChip({ label: (x.label || x.path), url: ghUrl(x.path) })), gl.map(ghChip)) : null,
      ex.length ? h('div', { class: 'rail-box' }, h('div', { class: 'label' }, '補足トピック'), ex.map((x) => h('a', { class: 'rail-x', href: '#/lesson/' + x.id }, K.W.icon('sparkles'), h('span', x.title), h('small', ((x.meta || {}).mins || 5) + '分')))) : null);

    rail.append(h('button', { class: 'rail-toggle', onclick: (e) => { rail.classList.toggle('more'); e.currentTarget.classList.toggle('on'); } }, K.W.icon('chevron-down'), '関連リンク・補足'));
    const S = L.scenes[idx];
    const el = h('section', { class: 'scene' });
    const I = K.W.icon;
    const seenBefore = store.getSeen(id).includes(idx);
    const W_ = S.why;
    const story = { stage: 99, max: 0, sync() {}, next() {}, prev() {} };
    const pr = practiceFor(id, S.t), prScene = pr.scene[0] || (S.tag === 'PRACTICE' ? pr.lesson[0] : null);

    /* ---- header: title + icon tools (GitHub / 使い分け / ヒント・参考 / なぜ？) ---- */
    const tools = h('div', { class: 'scene-tools' });
    const toolBtn = (ic, tip, fn) => h('button', { class: 'tool-ico', 'data-tip': tip, onclick: fn }, I(ic));
    el.append(h('div', { class: 'scene-head' }, h('h2', null, S.t, S.tag ? h('span', { class: 'chip' }, S.tag) : null), tools));
    if (S.lead) el.append(h('p', { class: 'lead', html: S.lead }));

    // story cards (reusable for the replay modal)
    const buildCards = () => {
      const col = (cls, ic, label, text, vis) => text ? h('div', { class: 'why-c ' + cls }, h('div', { class: 'why-l' }, I(ic), label), vis ? h('div', { class: 'why-v' }, K.W.mini(vis)) : null, h('p', { html: text })) : null;
      const cards = [col('p', 'triangle-alert', '困りごと', W_.problem, W_.pv), col('i', 'lightbulb', '考え方', W_.idea, W_.iv), col('a', 'circle-check', '解決 = これ', W_.answer, W_.av)].filter(Boolean);
      const flow = h('div', { class: 'why-flow' }), ars = [];
      cards.forEach((c, i) => { if (i) { const ar = h('span', { class: 'why-ar' }, I('chevron-right')); ars.push(ar); flow.append(ar); } flow.append(c); });
      return { cards, ars, flow };
    };
    const whenRows = () => { const rows = Array.isArray(W_.when) ? W_.when : [[null, W_.when]]; return h('div', { class: 'when-list' }, rows.map(([c, u], i) => h('div', { class: 'when-row' + (c ? '' : ' solo'), style: { '--i': i } }, c ? h('div', { class: 'when-if' }, h('small', 'こんなとき'), h('span', { html: c })) : null, c ? h('span', { class: 'when-ar' }, I('arrow-right')) : null, h('div', { class: 'when-use' }, h('small', c ? 'こっち' : 'ポイント'), h('span', { html: u }))))); };

    if (prScene) tools.append(h('a', { class: 'tool-ico', href: ghUrl(prScene.path), target: '_blank', rel: 'noopener', 'data-tip': 'GitHub で「' + (prScene.label || '実践コード') + '」を開く' }, K.W.icon('github-mark')));
    if (S.answer) tools.append(toolBtn('key-round', '答えを見る（まず自分で試そう）', () => K.W.modal({ title: '答え', icon: 'key-round', content: () => { const A = S.answer; if (A.node) return A.node(); if (A.code) return h('div', null, h('p', { style: { color: 'var(--mute)', fontSize: '.875rem', marginBottom: '.8em' } }, '答えは1つとは限りません。自分のやり方と見比べてみよう。'), K.W.code(A.code, A.lang || 'ts', { file: A.file })); return A.html || ''; } })));
    const refs = [].concat(S.ref || [], S.hint ? [{ title: 'ヒント', icon: 'lightbulb', html: S.hint }] : []);
    refs.forEach((r) => tools.append(toolBtn(r.icon || 'book-open', r.title || '参考', () => K.W.modal({ title: r.title || '参考', icon: r.icon || 'book-open', content: r.node ? r.node() : r.html }))));
    if (W_ && W_.when) tools.append(toolBtn('split', '使い分けガイド', () => K.W.modal({ title: '使い分けガイド', icon: 'split', narrow: true, content: () => h('div', null, h('p', { style: { color: 'var(--mute)', fontSize: '.875rem', marginBottom: '.8em' } }, '迷ったら、条件に当てはまるほうを選ぶ。'), whenRows()) })));
    if (W_) tools.append(toolBtn('circle-help', 'なぜ？ 困りごと → 考え方 → 解決 を見直す', () => K.W.modal({ title: S.t + ' — なぜ必要？', icon: 'circle-help', content: () => buildCards().flow })));

    const body = h('div', { class: 'body-wrap' });
    if (W_) {
      const { cards, ars, flow } = buildCards();
      const whyEl = h('div', { class: 'why' }, flow);
      const last = cards.length - 1;
      story.max = last + 1;                                   // last+1 = collapsed + demo shown
      story.stage = window.KENSHU_SKIP_STORY ? story.max : 0;   // always start with なぜ必要？ (skip flag is for automated checks only)
      const sumEl = h('div', { class: 'why-sum' }, I('circle-check'), h('span', { html: '<b>解決</b>：' + (W_.answer || '') }),
        h('button', { onclick: () => { story.reset(); } }, I('rotate-ccw'), 'なぜ？を最初から見る'));
      const labels = ['考え方を見る', '解決を見る', 'デモで確かめる'];
      const nextTop = h('button', { class: 'btn primary story-next', onclick: () => story.next() });
      story.sync = (anim) => {
        const n = story.stage, done = n > last;
        cards.forEach((c, i) => { const show = i <= Math.min(n, last); const was = !c.classList.contains('hid'); c.classList.toggle('hid', !show); if (show && !was && anim) { c.classList.remove('in'); void c.offsetWidth; c.classList.add('in'); } });
        ars.forEach((a, i) => a.classList.toggle('hid', i + 1 > Math.min(n, last)));
        whyEl.style.display = done ? 'none' : ''; sumEl.style.display = done ? '' : 'none';
        const wasOn = !body.classList.contains('collapsed');
        body.classList.toggle('collapsed', !done);
        if (done && !wasOn) { if (anim) { body.classList.remove('in'); void body.offsetWidth; body.classList.add('in'); } requestAnimationFrame(() => balance(el)); }
        nextTop.style.display = done ? 'none' : ''; if (story.skipBtn) story.skipBtn.style.display = done ? 'none' : '';
        nextTop.replaceChildren(labels[Math.min(n, labels.length - 1)], I('chevron-right'));
        if (story.hook) story.hook();
      };
      story.next = () => { if (story.stage < story.max) { story.stage++; story.sync(true); } };
      story.prev = () => { if (story.stage > 0) { story.stage--; story.sync(false); } };
      story.reset = () => { story.stage = 0; story.sync(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
      story.skip = () => { story.stage = story.max; story.sync(true); };
      const skipBtn = h('button', { class: 'story-skip', onclick: () => story.skip() }, 'デモへ進む', I('chevrons-right'));
      story.syncOrig = story.sync;
      el.append(whyEl, sumEl, h('div', { class: 'story-bar' }, nextTop, skipBtn));
      story.skipBtn = skipBtn;
    }
    if (prScene && S.tag === 'PRACTICE' && pr.scene.length > 1) el.append(h('div', { class: 'row', style: { margin: '0 0 1em' } }, pr.scene.map((x) => ghChip({ label: x.label || x.path, url: ghUrl(x.path) }))));
    if (S.gh) el.append(h('div', { class: 'row', style: { margin: '0 0 1em' } }, [].concat(S.gh).map((g) => ghChip({ label: g.label || g[0], url: ghUrl(g.path || g[1]) }))));
    el.append(body);
    const ctx = { steppers: [], cleanups: [], lesson: L, idx, story };
    K.ctx = ctx;
    const clean = S.render(body, ctx);
    K.ctx = null;
    if (typeof clean === 'function') ctx.cleanups.push(clean);
    if (W_) story.sync(false);
    store.seen(id, idx);
    requestAnimationFrame(() => balance(el));

    const go = (i) => (location.hash = `#/lesson/${id}/${i}`);
    const navNext = idx < L.scenes.length - 1 ? h('button', { class: 'btn primary', onclick: () => go(idx + 1) }, '次のシーン →') : h('a', { class: 'btn primary', href: '#/' }, '🎉 時間割へ戻る');
    el.append(h('div', { class: 'nav' },
      h('button', { class: 'btn', disabled: idx === 0, onclick: () => go(idx - 1) }, '← 前へ'),
      h('span', { class: 'hint2' }, `${idx + 1} / ${L.scenes.length}　（← → キーで操作）`),
      navNext));
    // phone: while the story is running, the bottom-right button IS the story button (it never moves)
    if (W_) {
      const mq = matchMedia('(max-width:760px)');
      const original = [...navNext.childNodes].map((n) => n.cloneNode(true));
      const labelFor = () => ['考え方を見る', '解決を見る', 'デモで確かめる'][Math.min(story.stage, 2)];
      navNext.addEventListener('click', (e) => { if (mq.matches && story.stage < story.max) { e.preventDefault(); e.stopImmediatePropagation(); story.next(); const c = document.querySelectorAll('.scene > .why .why-c:not(.hid)'); const t = c[c.length - 1]; t && t.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } }, true);
      story.hook = () => {
        if (mq.matches && story.stage < story.max) { navNext.replaceChildren(labelFor(), I('chevron-right')); navNext.classList.add('story-mode'); }
        else { navNext.replaceChildren(...original.map((n) => n.cloneNode(true))); navNext.classList.remove('story-mode'); }
      };
      story.hook();
    }

    root.append(topbar(h('div', { class: 'crumb' }, h('a', { href: '#/', class: 'btn ghost' }, K.W.icon('arrow-left'), h('span', { class: 'lbl' }, '時間割')), h('b', { class: 'crumb-t' }, L.title))),
      h('div', { class: 'lesson' }, rail, h('main', { class: 'main' }, el)));
    root.cleanup = () => ctx.cleanups.forEach((f) => { try { f(); } catch {} });
    root.keys = (e) => {
      if (/input|textarea/i.test(e.target.tagName) || document.querySelector('.modal-back')) return;
      const steps = ctx.steppers;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (W_ && story.stage < story.max) return story.next();      // story first: 困りごと → 考え方 → 解決 → デモ
        const st = steps.find((x) => !x.atEnd);
        if (st) st.go(st.cur + 1);
        else if (idx < L.scenes.length - 1) go(idx + 1);
      } else if (e.key === 'ArrowLeft') {
        const st = [...steps].reverse().find((x) => !x.atStart);
        if (st) st.go(st.cur - 1);
        else if (W_ && story.stage > 0) story.prev();
        else if (idx > 0) go(idx - 1);
      }
    };
    return root;
  }


  /* even out two-column layouts: vertically centre the shorter side */
  function balance(root) {
    root.querySelectorAll('.split').forEach((sp) => {
      [...sp.children].forEach((c) => {
        if (c.tagName === 'PRE' || c.classList.contains('col')) return;
        const cs = getComputedStyle(c);
        if (cs.display === 'flex') { if (cs.flexDirection.startsWith('row')) c.style.alignItems = 'center'; else c.style.justifyContent = 'center'; }
        else if (cs.display === 'grid') c.style.alignContent = 'center';
        else if (cs.display === 'block') { c.style.display = 'flex'; c.style.flexDirection = 'column'; c.style.justifyContent = 'center'; }
      });
      // card-like children inside a column that still have slack: centre their content
      sp.querySelectorAll(':scope > .col > *').forEach((c) => {
        const cs = getComputedStyle(c), r = c.getBoundingClientRect();
        const card = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.borderTopWidth !== '0px';
        if (!card || r.height < 200 || /PRE|IFRAME/.test(c.tagName) || c.classList.contains('ed')) return;
        let low = r.top; c.querySelectorAll('*').forEach((e) => { const b = e.getBoundingClientRect(); if (b.height && b.bottom > low && b.bottom <= r.bottom + 2) low = b.bottom; });
        if (r.bottom - low > 90) { if (cs.display === 'grid') c.style.alignContent = 'center'; else if (cs.display === 'flex' && cs.flexDirection === 'column') c.style.justifyContent = 'center'; else if (cs.display === 'block') { c.style.display = 'flex'; c.style.flexDirection = 'column'; c.style.justifyContent = 'center'; } }
      });
    });
  }

  /* ---------- router ---------- */
  let current = null;
  function render() {
    const m = location.hash.match(/^#\/lesson\/([\w-]+)(?:\/(\d+))?/);
    const toExtras = location.hash === '#/extras';
    const swap = () => {
      current && current.cleanup && current.cleanup();
      app.replaceChildren();
      current = m ? lessonView(m[1], m[2] || 0) : home();
      app.append(current);
      if (toExtras) { const x = document.getElementById('extras'); x && x.scrollIntoView({ behavior: 'smooth' }); } else window.scrollTo(0, 0);
    };
    if (current && !document.hidden && document.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(swap);
    else swap();
  }
  window.addEventListener('hashchange', render);
  window.addEventListener('keydown', (e) => current && current.keys && current.keys(e));
  document.documentElement.dataset.theme = store.get('theme', 'dark');
  window.addEventListener('DOMContentLoaded', render);
  if (document.readyState !== 'loading') render();
})();
