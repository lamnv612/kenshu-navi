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

  // columns: day1→2 … day4→5, (sep 6), day5→7, day6→8
  const DAYS = [
    { d: 1, col: 2 }, { d: 2, col: 3 }, { d: 3, col: 4 },
    { d: 4, col: 5 }, { d: 5, col: 7 }, { d: 6, col: 8 },
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
  const GH = ((window.KENSHU_CONFIG || {}).practiceRepo || '').replace(/\/?$/, '/').replace(/^\/$/, '');  // 空なら GitHub リンクは出さない
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
    return GH ? raw.map(([label, path]) => ({ label, url: ghUrl(path) })) : [];
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
    const cur = document.documentElement.dataset.theme || 'dark';
    const NEXT = { dark: 'light', light: 'spec', spec: 'dark' }, ICO = { dark: 'moon', light: 'sun', spec: 'ruler' }, NAME = { dark: 'ダーク', light: 'ライト', spec: '設計図' };
    return h('header', { class: 'top' },
      h('a', { class: 'logo', href: '#/' }, h('i', '研'), '研修ナビ'),
      crumb || null, h('div', { class: 'sp' }), K.users.views.chip(),
      h('button', { class: 'btn ghost', 'aria-label': 'テーマ切替', title: 'テーマ切替：ダーク／ライト／設計図（いま：' + NAME[cur] + '）', onclick: () => {
        const t = NEXT[document.documentElement.dataset.theme] || 'dark';
        document.documentElement.dataset.theme = t; store.set('theme', t); render();
      } }, K.W.icon(ICO[cur]), h('span', { class: 'lbl' }, ' ' + NAME[cur])));
  }


  function extrasSection() {
    const ex = Object.values(K.lessons).filter((l) => l.track === 'extra').sort((a, b) => ((a.meta || {}).order || 99) - ((b.meta || {}).order || 99));
    if (!ex.length) return null;
    const CATS = [['basic', '1日目', 'HTML/CSS · CUI · Git', 'var(--basic)'], ['ts', '2–3日目', 'TypeScript', 'var(--ts)'], ['vue', '4日目 以降', 'Vue.js', 'var(--vue)'], ['common', 'いつでも', '共通・チーム開発', 'var(--team)']];
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
        h('div', { class: 'am-theme', style: { '--c': TRACKS[tr].color } }, h('b', THEME_NAME[tr]), h('small', `${d.d}日目`)),
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
      chips.append(h('button', { class: 'am-chip' + (i === todayIdx ? ' today' : ''), 'data-i': i, onclick: () => { cur = i; draw(); } }, h('b', d.d), h('small', '日目')));
    });
    wrap.append(chips, list); draw();
    return wrap;
  }

  /* ---------- home / scheduler ---------- */
  function home(onlyExtras) {
    const todayIdx = -1;

    const g = h('div', { class: 'sched' });
    g.append(h('div', { class: 'sh time', style: { gridColumn: 1, gridRow: 1 } }, '時間'));
    DAYS.forEach((d, i) => g.append(h('div', { class: 'sh' + (i === todayIdx ? ' today' : ''), style: { gridColumn: d.col, gridRow: 1 } }, h('div', d.d + '日目'))));
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

    if (onlyExtras) return h('div', null, topbar(h('div', { class: 'crumb' }, h('a', { href: '#/', class: 'btn ghost' }, K.W.icon('arrow-left'), h('span', { class: 'lbl' }, '時間割')), h('b', { class: 'crumb-t' }, '補足トピック'))),
      h('main', { class: 'home' }, extrasSection()));
    return h('div', null, topbar(),
      h('main', { class: 'home' },
        h('section', { class: 'hero' },
          h('div', null,
            h('h1', null, '手を動かして学ぶ、', h('br'), h('em', '新入社員プログラミング研修')),
            h('p', null, '下の時間割からテーマをクリック。図とアニメーションで「なぜそうなるか」を一歩ずつ確かめながら、その場でコードを書いて試せます。')),
          h('div', { class: 'countdown' },
            [h('b', Math.round(seen / Math.max(1, totalScenes) * 100) + '%'), h('span', 'PROGRESS')],
            h('div', { style: { marginTop: '.6em', fontSize: '.75rem', color: 'var(--mute)' } }, `学習進捗 ${seen}/${totalScenes} シーン`))),
        h('div', { class: 'legend' }, Object.entries(TRACKS).map(([k, t]) => h('span', { class: 'chip', style: { '--c': t.color } }, '● ' + t.name))),
        g, agendaView(todayIdx),
        h('div', { class: 'hint' }, h('span', '👆 マスをクリックで学習ページへ'), h('span', '⌨️ ← → キーで次のステップ'), h('span', '✍️ 各ページの最後に「実践」あり'), h('button', { class: 'hint-reset', title: '進捗を消して、各ページの「困りごと→考え方→解決」を最初から表示します', onclick: () => {
        const m = K.W.modal({ title: '進捗をリセット', icon: 'rotate-ccw', narrow: true, content: () => h('div', { class: 'col' },
          h('p', '学習の進み具合（チェック・バー）を消して、最初の状態に戻します。'),
          h('div', { class: 'row' }, h('button', { class: 'btn primary', onclick: () => { store.set('seen', {}); location.reload(); } }, 'リセットする'), h('button', { class: 'btn ghost', onclick: () => m.close() }, 'やめる'))) });
      } }, K.W.icon('rotate-ccw'), '進捗リセット'), h('a', { href: '#/extras', class: 'hint-link' }, '✨ スライド外の補足へ'))));
  }

  /* ---------- lesson view ---------- */

  /* ---------- 困りごと → 考え方 → 解決 をつなぐ手描き風の矢印 ---------- */
  function linker(flow, cards) {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'why-svg');
    const layer = h('div', { class: 'why-links' }, svg);
    const defs = [['l1', 'なぜ？'], ['l1b', ''], ['l2', 'だから'], ['l2b', ''], ['l3', 'こう直る']];
    const paths = {}, notes = {};
    defs.forEach(([k, t]) => {
      const g = document.createElementNS(NS, 'g'); g.setAttribute('class', 'lk ' + k.replace('b', ''));
      [0, 1].forEach((j) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('pathLength', '1'); p.setAttribute('class', j ? 'sk' : 'pm'); g.append(p); (paths[k] ||= []).push(p); });
      svg.append(g);
      if (t) { notes[k] = h('span', { class: 'why-note ' + k }, t); layer.append(notes[k]); }
    });
    flow.append(layer);
    const pos = (el) => { let x = 0, y = 0, n = el; while (n && n !== flow) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return { x, y, w: el.offsetWidth, h: el.offsetHeight }; };
    const midY = (el, card) => { const q = pos(el), c = pos(card); return Math.max(c.y + 36, Math.min(c.y + c.h - 20, q.y + q.h / 2)); };
    const fallbackY = (card, sel) => { const t = card.querySelector(sel) || card.querySelector('.why-v'); return t && t.offsetHeight ? midY(t, card) : pos(card).y + pos(card).h / 2; };
    const j = (n, a) => Math.sin(n * 12.9898) * a;
    const f = (n) => Math.round(n * 10) / 10;
    const keysOf = (card) => { const m = {}; card.querySelectorAll('[data-key]').forEach((e) => { (m[e.dataset.key] ||= e); }); return m; };
    function curve(k, x1, y1, x2, y2, vertical, seed) {
      const d = (a, b, c, e, g, hh, i, l) => `M${f(a)},${f(b)} C${f(c)},${f(e)} ${f(g)},${f(hh)} ${f(i)},${f(l)}`;
      const head = vertical
        ? (jx) => ` M${f(x2 - 8 + jx)},${f(y2 - 12)} L${f(x2)},${f(y2)} L${f(x2 + 8 + jx)},${f(y2 - 11)}`
        : (jx) => ` M${f(x2 - 15)},${f(y2 - 10 + jx)} L${f(x2)},${f(y2)} L${f(x2 - 14)},${f(y2 + 10 + jx)}`;
      [0, 1].forEach((i) => {
        const w = i ? 1 : 0, a = 5 + w * 4;
        let dd;
        if (vertical) { const dy = (y2 - y1) * 0.55; dd = d(x1 + j(seed + w, 3), y1, x1 + j(seed + 1 + w, a), y1 + dy, x2 + j(seed + 2 + w, a), y2 - dy, x2, y2); }
        else { const dx = (x2 - x1) * 0.55; dd = d(x1, y1 + j(seed + w, 3), x1 + dx, y1 + j(seed + 1 + w, a), x2 - dx, y2 + j(seed + 2 + w, a), x2, y2); }
        paths[k][i].setAttribute('d', dd + head(j(seed + 3 + w, 2)));
      });
    }
    const clear = (k) => paths[k].forEach((p) => p.setAttribute('d', ''));
    function draw() {
      if (cards.length < 2 || !cards[0].offsetWidth) return;
      svg.setAttribute('width', flow.offsetWidth); svg.setAttribute('height', flow.offsetHeight);
      const A = pos(cards[0]), B = pos(cards[1]), C = cards[2] ? pos(cards[2]) : null;
      const horiz = B.x > A.x + A.w - 4;
      layer.classList.toggle('vert', !horiz);
      const place = (k, x, y) => { if (notes[k]) { notes[k].style.left = f(x) + 'px'; notes[k].style.top = f(y) + 'px'; } };
      const ka = keysOf(cards[0]), kb = keysOf(cards[1]), kc = cards[2] ? keysOf(cards[2]) : {};
      const ab = Object.keys(ka).filter((k) => kb[k]).slice(0, 2), bc = Object.keys(kb).filter((k) => kc[k]).slice(0, 2);
      const hasKeys = ab.length || bc.length;
      ['l1', 'l1b', 'l2', 'l2b', 'l3'].forEach(clear);
      const pair = (names, from, to, F, T, fc, tc, slot, seed) => {
        names.forEach((k, n) => {
          const e1 = from[k], e2 = to[k], key = slot + (n ? 'b' : '');
          if (horiz) {
            const q1 = pos(e1), q2 = pos(e2), y1 = q1.y + q1.h / 2, y2 = q2.y + q2.h / 2, x1 = q1.x + q1.w + 3, x2 = q2.x - 5;
            curve(key, x1, y1, x2, y2, false, seed + n * 3);
            if (!n) place(slot, (F.x + F.w + T.x) / 2, (y1 + y2) / 2 - 20);
          } else {
            const x1 = pos(e1).x + pos(e1).w / 2, x2 = pos(e2).x + pos(e2).w / 2;
            curve(key, Math.min(F.x + F.w - 14, Math.max(F.x + 14, x1)), F.y + F.h + 1, Math.min(T.x + T.w - 14, Math.max(T.x + 14, x2)), T.y - 3, true, seed + n * 3);
            if (!n) place(slot, (x1 + x2) / 2 + 30, (F.y + F.h + T.y) / 2 - 10);
          }
        });
      };
      if (hasKeys) {
        pair(ab, ka, kb, A, B, cards[0], cards[1], 'l1', 1);
        if (C) pair(bc, kb, kc, B, C, cards[1], cards[2], 'l2', 4);
      }
      if (!ab.length) { // fallback anchors
        if (horiz) { const ya = fallbackY(cards[0], '.ln.err'), yb = fallbackY(cards[1], '.why-v'); curve('l1', A.x + A.w + 2, ya, B.x - 3, yb, false, 1); place('l1', (A.x + A.w + B.x) / 2, (ya + yb) / 2 - 18); }
        else { const x1 = A.x + A.w * 0.5; curve('l1', x1, A.y + A.h + 1, B.x + B.w * 0.5, B.y - 3, true, 1); place('l1', x1 + 30, (A.y + A.h + B.y) / 2 - 10); }
      }
      if (C && !bc.length) {
        if (horiz) { const yb = fallbackY(cards[1], '.why-v'), yc = fallbackY(cards[2], '.ln.on'); curve('l2', B.x + B.w + 2, yb, C.x - 3, yc, false, 4); place('l2', (B.x + B.w + C.x) / 2, (yb + yc) / 2 - 18); }
        else { curve('l2', B.x + B.w * 0.5, B.y + B.h + 1, C.x + C.w * 0.5, C.y - 3, true, 4); place('l2', B.x + B.w * 0.5 + 30, (B.y + B.h + C.y) / 2 - 10); }
      }
      if (horiz && C) {
        const top = A.y, x1 = A.x + A.w * 0.5, x2 = C.x + C.w * 0.5, up = top - 46;
        const dd = (w) => `M${f(x1)},${f(top - 2)} C${f(x1 + j(7 + w, 8))},${f(up)} ${f(x2 + j(8 + w, 8))},${f(up + j(9 + w, 4))} ${f(x2)},${f(top - 3)} M${f(x2 - 8)},${f(top - 14)} L${f(x2)},${f(top - 3)} L${f(x2 + 8 + j(5 + w, 2))},${f(top - 13)}`;
        paths.l3[0].setAttribute('d', dd(0)); paths.l3[1].setAttribute('d', dd(1)); place('l3', (x1 + x2) / 2, up + 4);
      }
    }
    let t = 0; const redraw = () => { cancelAnimationFrame(t); t = requestAnimationFrame(draw); };
    if (window.ResizeObserver) new ResizeObserver(redraw).observe(flow);
    window.addEventListener('resize', redraw);
    return { draw: redraw, set(on, anim) { layer.classList.toggle('instant', !anim); layer.classList.toggle('on', !!on); flow.classList.toggle('linked', !!on); redraw(); setTimeout(redraw, 700); } };
  }

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
      GH && (gl.length || practiceFor(id, '').lesson.length) ? h('div', { class: 'rail-box' }, h('div', { class: 'label' }, 'GitHub'), practiceFor(id, '').lesson.map((x) => ghChip({ label: (x.label || x.path), url: ghUrl(x.path) })), gl.map(ghChip)) : null,
      ex.length ? (() => {
        const list = h('div', { class: 'rail-xl', hidden: true }, ex.map((x) => h('a', { class: 'rail-x', href: '#/lesson/' + x.id }, K.W.icon('sparkles'), h('span', x.title), h('small', ((x.meta || {}).mins || 5) + '分'))));
        const fold = h('button', { class: 'rail-fold', 'aria-expanded': 'false', onclick: () => { const on = list.hidden; list.hidden = !on; fold.setAttribute('aria-expanded', String(on)); fold.classList.toggle('on', on); } },
          K.W.icon('sparkles'), h('span', '補足トピック'), h('em', String(ex.length)), K.W.icon('chevron-down'));
        return h('div', { class: 'rail-box' }, fold, list);
      })() : null);

    { const fb = K.testButton && K.testButton(id, 'rail-final'); if (fb) { fb.append(h('span', '最終チャレンジ')); fb.removeAttribute('data-tip'); rail.append(fb); } }
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
      const flow = h('div', { class: 'why-flow' });
      cards.forEach((c) => flow.append(c));
      const links = linker(flow, cards);
      return { cards, flow, links };
    };
    const whenRows = () => { const rows = Array.isArray(W_.when) ? W_.when : [[null, W_.when]]; return h('div', { class: 'when-list' }, rows.map(([c, u], i) => h('div', { class: 'when-row' + (c ? '' : ' solo'), style: { '--i': i } }, c ? h('div', { class: 'when-if' }, h('small', 'こんなとき'), h('span', { html: c })) : null, c ? h('span', { class: 'when-ar' }, I('arrow-right')) : null, h('div', { class: 'when-use' }, h('small', c ? 'こっち' : 'ポイント'), h('span', { html: u }))))); };

    if (GH && prScene) tools.append(h('a', { class: 'tool-ico', href: ghUrl(prScene.path), target: '_blank', rel: 'noopener', 'data-tip': 'GitHub で「' + (prScene.label || '実践コード') + '」を開く' }, K.W.icon('github-mark')));
    if (S.answer) tools.append(toolBtn('key-round', '答えを見る（まず自分で試そう）', () => K.W.modal({ title: '答え', icon: 'key-round', content: () => { const A = S.answer; if (A.node) return A.node(); if (A.code) return h('div', null, h('p', { style: { color: 'var(--mute)', fontSize: '.875rem', marginBottom: '.8em' } }, '答えは1つとは限りません。自分のやり方と見比べてみよう。'), K.W.code(A.code, A.lang || 'ts', { file: A.file })); return A.html || ''; } })));
    const refs = [].concat(S.ref || [], S.hint ? [{ title: 'ヒント', icon: 'lightbulb', html: S.hint }] : []);
    refs.forEach((r) => tools.append(toolBtn(r.icon || 'book-open', r.title || '参考', () => K.W.modal({ title: r.title || '参考', icon: r.icon || 'book-open', content: r.node ? r.node() : r.html }))));
    if (W_ && W_.when) tools.append(toolBtn('split', '使い分けガイド', () => K.W.modal({ title: '使い分けガイド', icon: 'split', narrow: true, content: () => h('div', null, h('p', { style: { color: 'var(--mute)', fontSize: '.875rem', marginBottom: '.8em' } }, '迷ったら、条件に当てはまるほうを選ぶ。'), whenRows()) })));
    if (W_) tools.append(toolBtn('circle-help', 'なぜ？ 困りごと → 考え方 → 解決 を見直す', () => K.W.modal({ title: S.t + ' — なぜ必要？', icon: 'circle-help', content: () => { const b = buildCards(); b.links.set(true, true); return b.flow; } })));

    { const db = K.drillButton && K.drillButton(id, S.t); if (db) tools.append(db); const tb = idx === L.scenes.length - 1 && K.testButton && K.testButton(id); if (tb) tools.append(tb); }
    const body = h('div', { class: 'body-wrap' });
    if (W_) {
      const { cards, flow, links } = buildCards();
      const whyEl = h('div', { class: 'why' }, flow);
      const last = cards.length > 1 ? 1 : 0;
      story.max = last + 1;                                   // last+1 = collapsed + demo shown
      story.stage = window.KENSHU_SKIP_STORY ? story.max : 0;   // always start with なぜ必要？ (skip flag is for automated checks only)
      const sumEl = h('div', { class: 'why-sum' }, I('circle-check'), h('span', { html: '<b>解決</b>：' + (W_.answer || '') }),
        h('button', { onclick: () => { story.reset(); } }, I('rotate-ccw'), 'なぜ？を最初から見る'));
      const labels = story.labels = last ? ['考え方を見る', 'デモで確かめる'] : ['デモで確かめる'];
      const nextTop = h('button', { class: 'btn primary story-next', onclick: () => story.next() });
      story.sync = (anim) => {
        const n = story.stage, done = n > last;
        cards.forEach((c, i) => { const show = i === 0 || n >= 1; const was = !c.classList.contains('hid'); c.classList.toggle('hid', !show); c.style.animationDelay = i === 1 ? '.2s' : i === 2 ? '.7s' : ''; if (show && !was && anim) { c.classList.remove('in'); void c.offsetWidth; c.classList.add('in'); } });
        links.set(n >= 1 && !done, anim);
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
    if (GH && prScene && S.tag === 'PRACTICE' && pr.scene.length > 1) el.append(h('div', { class: 'row', style: { margin: '0 0 1em' } }, pr.scene.map((x) => ghChip({ label: x.label || x.path, url: ghUrl(x.path) }))));
    if (GH && S.gh) el.append(h('div', { class: 'row', style: { margin: '0 0 1em' } }, [].concat(S.gh).map((g) => ghChip({ label: g.label || g[0], url: ghUrl(g.path || g[1]) }))));
    el.append(body);
    const ctx = { steppers: [], cleanups: [], lesson: L, idx, story };
    K.ctx = ctx;
    const clean = S.render(body, ctx);
    K.ctx = null;
    K.stripChoiceQuiz && K.stripChoiceQuiz(body);
    K.glossify && K.glossify(body);
    K.glossWatch && (ctx.cleanups.push(() => {}), K.ctx = ctx, K.glossWatch(body), K.ctx = null);
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
      const labelFor = () => story.labels[Math.min(story.stage, story.labels.length - 1)];
      navNext.addEventListener('click', (e) => { if (mq.matches && story.stage < story.max) { e.preventDefault(); e.stopImmediatePropagation(); story.next(); const c = document.querySelectorAll('.scene > .why .why-c:not(.hid)'); const t = c[1] || c[0]; t && t.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } }, true);
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
      const pm = location.hash.match(/^#\/p\/(.+)/);
      if (pm) { try { sessionStorage.setItem('kenshu.pending', pm[1]); } catch {} location.hash = '#/'; return; }
      if (K.users.isAdmin() && K.users.consumePending()) { location.hash = '#/admin'; return; }
      if (!K.users.current()) { current = K.users.views.loginView(() => { location.hash = '#/'; render(); }); app.append(current); document.title = 'ニックネーム | 研修ナビ'; return; }
      const toAdmin = location.hash === '#/admin', toMe = location.hash === '#/me';
      if (toAdmin && !K.users.isAdmin()) { location.hash = '#/'; return; }
      current = toMe ? h('div', null, topbar(h('div', { class: 'crumb' }, h('a', { href: '#/', class: 'btn ghost' }, K.W.icon('arrow-left'), h('span', { class: 'lbl' }, '時間割')), h('b', { class: 'crumb-t' }, 'わたしの記録'))), h('main', { class: 'home' }, K.users.views.meView()))
        : toAdmin ? h('div', null, topbar(h('div', { class: 'crumb' }, h('a', { href: '#/', class: 'btn ghost' }, K.W.icon('arrow-left'), h('span', { class: 'lbl' }, '時間割')), h('b', { class: 'crumb-t' }, '進捗の管理画面'))), h('main', { class: 'home' }, K.users.views.adminView()))
        : m ? lessonView(m[1], m[2] || 0) : home(toExtras);
      app.append(current);
      const LL = m && K.lessons[m[1]];
      document.title = toMe ? 'わたしの記録 | 研修ナビ' : toAdmin ? '管理画面 | 研修ナビ' : LL ? ((LL.scenes[+(m[2] || 0)] || {}).t ? LL.scenes[+(m[2] || 0)].t + ' ・ ' : '') + LL.title + ' | 研修ナビ' : toExtras ? '補足トピック | 研修ナビ' : '研修ナビ — プログラミング研修';
      window.scrollTo(0, 0);
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
