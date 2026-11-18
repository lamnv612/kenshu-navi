/* vue-comp：実例「本物の画面を部品に切る」＋「どの部品に何を渡す？」 */
(function () {
  'use strict';
  const K = window.KENSHU;
  let tries = 0;
  (function wait() {
    if (K && K.lessons && K.lessons['vue-comp'] && K.W) return init();
    if (++tries < 200) setTimeout(wait, 50);
  })();

  function init() {
    const L = K.lessons['vue-comp'];
    const { h, code, style } = K.W;

    style('vrC', `
    .vrC-wrap{display:grid;gap:10px}
    .vrC-bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
    .vrC-sw{display:inline-flex;gap:.5em;align-items:center;min-height:40px;padding:0 1.2em;border-radius:999px;border:2px solid var(--line);background:var(--card2);font:800 .84rem var(--font);cursor:pointer;color:inherit}
    .vrC-sw.on{border-color:var(--vue);background:color-mix(in srgb,var(--vue) 20%,var(--card2))}
    .vrC-sw i{width:2.2em;height:1.2em;border-radius:99px;background:var(--line);position:relative;transition:.25s}
    .vrC-sw i:after{content:'';position:absolute;top:2px;left:2px;width:calc(1.2em - 4px);height:calc(1.2em - 4px);border-radius:50%;background:#fff;transition:.25s}
    .vrC-sw.on i{background:var(--vue)}.vrC-sw.on i:after{left:calc(100% - 1.2em + 2px)}
    .vrC-hint{font-size:.85rem;color:var(--mute);font-weight:700}
    .vrC-page{background:#f4f6fb;color:#223;border-radius:12px;padding:12px;display:grid;gap:12px;min-width:0;position:relative}
    .vrC-r{position:relative;border-radius:8px;outline:2px solid transparent;outline-offset:1px;transition:outline-color .15s,background .15s}
    .vrC-r.hot{outline-color:var(--vue);background:color-mix(in srgb,var(--vue) 12%,transparent)}
    .vrC-p{border-radius:6px;transition:.15s;outline:2px solid transparent}
    .vrC-p.hot{outline-color:var(--ts);background:color-mix(in srgb,var(--ts) 16%,transparent)}
    .vrC-p.hot.e{outline-color:var(--team)}.vrC-p.hot.e:not(.vrC-bt):not(.go){background:color-mix(in srgb,var(--team) 20%,transparent)}.vrC-bt.vrC-p.hot,.go.vrC-p.hot{background:#2f7bff;box-shadow:0 0 0 3px var(--team)}
    .vrC-split .vrC-r{outline:2px dashed #8a93ad;outline-offset:3px;margin:3px}
    .vrC-split .vrC-r.hot{outline:2px solid var(--vue)}
    .vrC-tg{display:none;position:absolute;top:-9px;left:8px;z-index:2;font:900 .64rem var(--mono);padding:.05em .5em;border-radius:5px;background:#5b6585;color:#fff;pointer-events:none}
    .vrC-split .vrC-tg{display:block}.vrC-r.hot>.vrC-tg{background:var(--vue);color:#06101f}
    .vrC-hd{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:#1d2b53;color:#fff;font-weight:900}
    .vrC-hd small{font-weight:700;opacity:.85}
    .vrC-in{display:flex;align-items:center;gap:8px;padding:7px 12px;background:#fff;border:1px solid #cdd3e3;font-weight:700;color:#556}
    .vrC-chips{display:flex;gap:6px;flex-wrap:wrap;padding:4px}
    .vrC-chip{padding:.2em .8em;border-radius:99px;border:1.5px solid #b9c0d6;background:#fff;font:800 .76rem var(--font);cursor:pointer;color:#445}
    .vrC-chip.on{background:#2f7bff;border-color:#2f7bff;color:#fff}
    .vrC-list{display:grid;gap:7px}
    .vrC-card{display:flex;gap:10px;align-items:center;background:#fff;border:1px solid #d7dbe8;padding:12px 12px}
    .vrC-av{width:36px;height:36px;border-radius:50%;background:#dfe5f7;display:grid;place-items:center;font-size:1.1rem;flex:none}
    .vrC-nm{flex:1;min-width:0;display:grid;gap:0;font-size:.82rem}
    .vrC-nm b{font-size:.92rem}.vrC-nm small{color:#667}
    .vrC-bt{border:0;border-radius:7px;padding:.4em .9em;background:#2f7bff;color:#fff;font:900 .78rem var(--font);cursor:pointer}
    .vrC-pg{display:flex;gap:5px;justify-content:center;padding:4px}
    .vrC-pg span{min-width:1.9em;text-align:center;padding:.15em .3em;border-radius:6px;border:1px solid #b9c0d6;background:#fff;font:800 .78rem var(--font);cursor:pointer}
    .vrC-pg span.on{background:#2f7bff;color:#fff;border-color:#2f7bff}
    .vrC-modal{position:absolute;inset:0;z-index:5;background:rgba(10,16,34,.5);border-radius:12px;display:none;place-items:center}
    .vrC-modal.open{display:grid}
    .vrC-mb{background:#fff;border-radius:10px;padding:14px;width:min(86%,300px);display:grid;gap:8px;position:relative;font-weight:700}
    .vrC-mb .row{display:flex;gap:6px;justify-content:flex-end}
    .vrC-mb .row span{padding:.3em .8em;border-radius:7px;font:800 .78rem var(--font);border:1.5px solid #b9c0d6;cursor:pointer}
    .vrC-mb .row span.go{background:#2f7bff;color:#fff;border-color:#2f7bff}
    .vrC-side{display:grid;gap:10px;min-width:0}
    .vrC-name{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font:900 1.02rem var(--mono);color:var(--vue)}
    .vrC-name small{font:800 .7rem var(--font);padding:.15em .6em;border-radius:6px}
    .vrC-name small.p{background:color-mix(in srgb,var(--ts) 22%,var(--card2));color:var(--ts)}
    .vrC-name small.e{background:color-mix(in srgb,var(--team) 22%,var(--card2));color:var(--team)}
    .vrC-name small.m{background:color-mix(in srgb,var(--vue) 22%,var(--card2));color:var(--vue)}
    .vrC-side pre.code{margin:0;max-width:100%;overflow-x:auto}
    .vrC-tree{font:700 .8rem/1.7 var(--mono);padding:10px 14px;border-radius:10px;background:var(--code);border:1px solid var(--line)}
    .vrC-tree div{padding:0 .5em;border-radius:5px;border-left:3px solid transparent;transition:.15s;white-space:nowrap}
    .vrC-tree div.hot{background:color-mix(in srgb,var(--vue) 22%,transparent);border-left-color:var(--vue);color:var(--vue)}
    .vrC-tree .d{color:var(--mute)}
    /* exercise */
    .vrC-qs{display:grid;gap:8px;min-width:0}
    .vrC-q{display:grid;gap:6px;padding:9px 12px;border-radius:10px;border:2px solid var(--line);background:var(--card);transition:.2s}
    .vrC-q.ok{border-color:var(--ok)}.vrC-q.ng{border-color:var(--bad);animation:vrCs .35s}
    @keyframes vrCs{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
    .vrC-q .t{display:flex;gap:8px;align-items:center;font-weight:800;font-size:.88rem}
    .vrC-q .n{width:1.6em;height:1.6em;border-radius:50%;background:var(--vue);color:#06101f;display:grid;place-items:center;font-weight:900;font-size:.8rem;flex:none}
    .vrC-q .t span{flex:1;min-width:0}.vrC-q .t em{font-style:normal;font-size:1.2rem}
    .vrC-ans{display:flex;gap:6px;flex-wrap:wrap}
    .vrC-a{padding:.3em .8em;border-radius:8px;border:2px solid var(--c);background:color-mix(in srgb,var(--c) 12%,var(--card2));font:800 .8rem var(--font);cursor:pointer;color:inherit;transition:.15s}
    .vrC-a:hover{transform:translateY(-1px)}.vrC-a.x{opacity:.35;text-decoration:line-through}
    .vrC-q.ok .vrC-a:not(.right){opacity:.3;pointer-events:none}
    .vrC-q.ok .vrC-a.right{background:var(--c);color:#06101f}
    .vrC-sc{display:flex;gap:8px;align-items:center;font-weight:900}
    .vrC-sc b{font:900 1.5rem var(--font);color:var(--ok)}
    `);

    const TYPES = "import type { Lawyer } from '@/types/lawyer'\n";
    /* 部品の定義：コード（script のみ）と、各パーツに対応する行の目印 */
    const COMP = {
      AppHeader: {
        file: 'components/AppHeader.vue', badge: [['p', 'props 1']],
        src: "<script setup lang=\"ts\">\ndefineProps<{\n  title: string\n  userName: string\n}>()\n</script>",
        k: { props: ['title: string', 'userName: string'], emit: [], model: [] }, use: '<AppHeader'
      },
      SearchBox: {
        file: 'components/SearchBox.vue', badge: [['m', 'v-model']],
        src: "<script setup lang=\"ts\">\nconst keyword = defineModel<string>({\n  required: true,\n})\n</script>",
        k: { props: [], emit: [], model: ['defineModel<string>', 'required: true', '})'] }, use: '<SearchBox'
      },
      FilterChips: {
        file: 'components/FilterChips.vue', badge: [['p', 'props'], ['m', 'v-model']],
        src: "<script setup lang=\"ts\">\ndefineProps<{\n  options: string[]\n}>()\nconst selected = defineModel<string[]>({\n  default: () => [],\n})\n</script>",
        k: { props: ['options: string[]'], emit: [], model: ['defineModel<string[]>', 'default: () => []', '})'] }, use: '<FilterChips'
      },
      LawyerCard: {
        file: 'components/LawyerCard.vue', badge: [['p', 'props'], ['e', 'emit']],
        src: "<script setup lang=\"ts\">\n" + TYPES + "\ndefineProps<{\n  lawyer: Lawyer\n}>()\nconst emit = defineEmits<{\n  consult: [id: number]\n}>()\n</script>",
        k: { props: ['lawyer: Lawyer'], emit: ['consult: [id: number]'], model: [] }, use: '<LawyerCard'
      },
      Pagination: {
        file: 'components/Pagination.vue', badge: [['p', 'props'], ['m', 'v-model']],
        src: "<script setup lang=\"ts\">\ndefineProps<{\n  total: number\n  perPage: number\n}>()\nconst page = defineModel<number>({\n  default: 1,\n})\n</script>",
        k: { props: ['total: number', 'perPage: number'], emit: [], model: ['defineModel<number>', 'default: 1', '})'] }, use: '<Pagination'
      },
      ConsultModal: {
        file: 'components/ConsultModal.vue', badge: [['p', 'props'], ['e', 'emit']],
        src: "<script setup lang=\"ts\">\n" + TYPES + "\ndefineProps<{\n  lawyer: Lawyer\n}>()\nconst emit = defineEmits<{\n  close: []\n  submit: [message: string]\n}>()\n</script>",
        k: { props: ['lawyer: Lawyer'], emit: ['close: []', 'submit: [message: string]'], model: [] }, use: '<ConsultModal'
      },
    };
    const PARENT = "<template>\n  <AppHeader title=\"弁護士ナビ\" :user-name=\"me.name\" />\n  <SearchBox v-model=\"keyword\" />\n  <FilterChips :options=\"fields\" v-model=\"picked\" />\n  <LawyerCard\n    v-for=\"l in pageItems\" :key=\"l.id\"\n    :lawyer=\"l\" @consult=\"target = l\"\n  />\n  <Pagination :total=\"hits.length\" :per-page=\"10\"\n    v-model=\"page\" />\n  <ConsultModal\n    v-if=\"target\" :lawyer=\"target\"\n    @close=\"target = null\"\n  />\n</template>";
    /* 親のコードの行：[全体, props, emit, model] */
    const PLN = { AppHeader: [[2], [2], [], []], SearchBox: [[3], [], [], [3]], FilterChips: [[4], [4], [], [4]], LawyerCard: [[5, 6, 7, 8], [7], [7], []], Pagination: [[9, 10], [9], [], [10]], ConsultModal: [[11, 12, 13, 14], [12], [13], []] };
    const lineNos = (src, keys) => { const o = []; src.split('\n').forEach((l, i) => { if (keys.some((k) => l.includes(k))) o.push(i + 1); }); return o; };

    /* ============ 実例①：画面を部品に切る ============ */
    function cutScene() {
      let split = false, cur = null, openCard = null;
      const mkTg = (n) => h('span', { class: 'vrC-tg' }, n + '.vue');
      const reg = (name, el, ...kids) => { const r = h('div', { class: 'vrC-r', 'data-c': name }, mkTg(name), el, ...kids); return r; };

      const lawyers = [['田中 美咲', '離婚・男女問題', '東京'], ['佐藤 健一', '相続・遺言', '大阪'], ['鈴木 陽子', '労働問題', '名古屋']];
      const cards = lawyers.map(([n, f, c], i) => {
        const bt = h('button', { class: 'vrC-bt vrC-p e', 'data-part': 'emit', onclick: () => open(i) }, '相談する');
        return h('div', { class: 'vrC-r', 'data-c': 'LawyerCard' }, mkTg('LawyerCard'),
          h('div', { class: 'vrC-card' },
            h('div', { class: 'vrC-p', 'data-part': 'props', style: { display: 'flex', gap: '10px', alignItems: 'center', flex: 1, minWidth: 0 } },
              h('div', { class: 'vrC-av' }, '👤'), h('div', { class: 'vrC-nm' }, h('b', n + ' 弁護士'), h('small', f + '／' + c))), bt));
      });
      const mName = h('b'), modal = h('div', { class: 'vrC-modal' });
      const open = (i) => { openCard = i; mName.textContent = lawyers[i][0] + ' 弁護士に相談'; modal.classList.add('open'); };
      const close = () => { modal.classList.remove('open'); };
      const mbox = h('div', { class: 'vrC-r vrC-mb', 'data-c': 'ConsultModal' }, mkTg('ConsultModal'),
        h('div', { class: 'vrC-p', 'data-part': 'props' }, mName), h('div', { style: { color: '#778', fontSize: '.78rem' } }, '相談内容（任意）'),
        h('div', { class: 'row' }, h('span', { class: 'vrC-p e', 'data-part': 'emit', onclick: close }, '閉じる'), h('span', { class: 'go vrC-p e', 'data-part': 'emit', onclick: close }, '送信')));
      mbox.style.setProperty('--x', '1');
      modal.append(mbox);

      const chip = (t, on) => { const c = h('span', { class: 'vrC-chip' + (on ? ' on' : ''), onclick: () => c.classList.toggle('on') }, t); return c; };
      const pg = [1, 2, 3, 4].map((n) => { const s = h('span', { class: n === 1 ? 'on' : '', onclick: () => pg.forEach((x, j) => x.classList.toggle('on', j === n - 1)) }, String(n)); return s; });

      const page = h('div', { class: 'vrC-page' },
        reg('AppHeader', h('div', { class: 'vrC-hd' }, h('span', { class: 'vrC-p', 'data-part': 'props' }, '⚖ 弁護士ナビ'), h('small', { class: 'vrC-p', 'data-part': 'props' }, '山本さん'))),
        reg('SearchBox', h('div', { class: 'vrC-in vrC-p', 'data-part': 'model' }, '🔍', h('span', '分野・地域・氏名で検索'))),
        reg('FilterChips', h('div', { class: 'vrC-chips' }, chip('離婚', true), chip('相続'), chip('労働'), chip('交通事故'), chip('債務整理'))),
        h('div', { class: 'vrC-list' }, ...cards),
        reg('Pagination', h('div', { class: 'vrC-pg' }, h('span', { class: 'vrC-p', 'data-part': 'props' }, '‹'), ...pg, h('span', '›'))),
        modal);

      /* パネル */
      const nameEl = h('div', { class: 'vrC-name' });
      const treeLines = [['d', 'src/'], ['d', '├ pages/'], ['', '│  └ LawyerSearchPage.vue', 'PAGE'], ['d', '└ components/'], ...Object.keys(COMP).map((k, i, a) => ['', (i === a.length - 1 ? '   └ ' : '   ├ ') + k + '.vue', k])];
      const treeEl = h('div', { class: 'vrC-tree' }, ...treeLines.map(([c, t, k]) => h('div', { class: c, 'data-k': k || '' }, t)));
      const parentPre = code(PARENT, 'vue', { color: 'var(--ts)', file: 'pages/LawyerSearchPage.vue（親）', dim: true, edit: false });
      const compPre = { el: null };
      const side = h('div', { class: 'vrC-side' });
      const hint = h('div', { class: 'vrC-hint' }, '← 画面の上にカーソルを乗せてみよう');
      const draw = (name, part) => {
        [...page.querySelectorAll('.hot')].forEach((e) => e.classList.remove('hot'));
        [...treeEl.children].forEach((e) => e.classList.toggle('hot', !!name && e.dataset.k === name));
        if (!name) { nameEl.replaceChildren(h('span', { style: { color: 'var(--mute)' } }, '部品を選んでね')); parentPre.setHi([]); if (compPre.el) compPre.el.replaceWith(compPre.ph); compPre.el = null; return; }
        const c = COMP[name];
        nameEl.replaceChildren('<' + name + ' />', ...c.badge.map(([t, x]) => h('small', { class: t }, x)));
        const pre = code(c.src, 'vue', { color: 'var(--vue)', file: c.file, dim: true, edit: false });
        const keys = part ? (part === 'props' ? c.k.props : part === 'emit' ? c.k.emit : c.k.model) : [].concat(c.k.props, c.k.emit, c.k.model);
        pre.setHi(lineNos(c.src, keys));
        const old = side.querySelector('.vrC-comp'); pre.classList.add('vrC-comp');
        if (old) old.replaceWith(pre); else nameEl.after(pre);
        parentPre.setHi(PLN[name][part ? { props: 1, emit: 2, model: 3 }[part] : 0]);
      };
      compPre.ph = document.createComment('x');
      /* ホバー */
      let sel = null;
      page.addEventListener('mouseover', (e) => {
        const r = e.target.closest('[data-c]'); if (!r) return;
        const p = e.target.closest('[data-part]');
        const part = p && r.contains(p) ? p.dataset.part : null;
        draw(r.dataset.c, part);
        r.classList.add('hot'); if (p && r.contains(p)) p.classList.add('hot');
        hint.style.visibility = 'hidden'; sel = r.dataset.c;
      });
      page.addEventListener('mouseleave', () => { draw(null); hint.style.visibility = ''; });
      treeEl.addEventListener('mouseover', (e) => { const d = e.target.closest('[data-k]'); if (d && COMP[d.dataset.k]) { draw(d.dataset.k); const t = page.querySelector('[data-c="' + d.dataset.k + '"]'); if (t) t.classList.add('hot'); } });
      treeEl.addEventListener('mouseleave', () => draw(null));
      draw(null);
      /* 親コードの行にカーソル → 画面の部品が光る（逆向き） */
      parentPre.lines.forEach((ln, i) => {
        ln.addEventListener('mouseenter', () => { const nm = Object.keys(PLN).find((k) => PLN[k][0].includes(i + 1)); if (!nm) return; draw(nm); page.querySelectorAll('[data-c="' + nm + '"]').forEach((t) => t.classList.add('hot')); hint.style.visibility = 'hidden'; });
        ln.addEventListener('mouseleave', () => { draw(null); hint.style.visibility = ''; });
      });

      const sw = h('button', { class: 'vrC-sw', onclick: () => { split = !split; sw.classList.toggle('on', split); page.classList.toggle('vrC-split', split); } }, h('i'), '部品に分ける');
      side.append(nameEl, parentPre, treeEl);
      return h('div', { class: 'vrC-wrap' },
        h('div', { class: 'vrC-bar' }, sw, hint),
        h('div', { class: 'vi-eq' }, h('div', { class: 'vrC-wrap', style: { position: 'sticky', top: '10px' } }, h('div', { class: 'vi-lb' }, '👀 弁護士検索ページ（カード・ボタン・ページ番号は押せる）'), page), side));
    }

    /* ============ 実例②：どの部品に何を渡す？ ============ */
    function wireScene() {
      const Q = [
        { who: '親 → SearchBox', t: '入力した検索ワードを、親と共有したい', ans: 'm', fill: 'v-model="keyword"', ph: '【①】', pk: '相続', st: 'keyword', data: 'keyword ＝ "相続"', why: '打った文字は親へ、親が変えれば入力欄へ。両方向だから v-model。' },
        { who: '親 → LawyerCard', t: '表示する弁護士のデータを渡したい', ans: 'p', fill: ':lawyer="l"', ph: '【②】', pk: 'lawyer', st: '', data: 'lawyer ＝ { name: "山田 太郎", field: "相続" }', why: 'カードは見せるだけ。親から子への一方通行だから props。' },
        { who: 'LawyerCard → 親', t: '「相談する」が押されたと知らせたい', ans: 'e', fill: '@consult="target = l"', ph: '【③】', pk: 'consult', st: 'target', val: '山田 太郎', data: "emit('consult', lawyer)", why: '押されたことを知らせるだけ。モーダルを開くのは親だから emit。' },
        { who: '親 → Pagination', t: '今のページ番号を、親と共有したい', ans: 'm', fill: 'v-model="page"', ph: '【④】', pk: '2', st: 'page', data: 'page ＝ 2', why: '子が押して変え、親も表示に使う。両方向だから v-model。' },
        { who: '親 → ConsultModal', t: '相談する弁護士のデータを渡したい', ans: 'p', fill: ':lawyer="target"', ph: '【⑤】', pk: 'lawyer', st: '', data: 'lawyer ＝ target（選ばれた弁護士）', why: 'モーダルは受け取って表示するだけ。だから props。' },
        { who: 'ConsultModal → 親', t: '「閉じる」が押されたと知らせたい', ans: 'e', fill: '@close="target = null"', ph: '【⑥】', pk: 'close', st: 'target', val: '—', data: "emit('close')", why: '閉じるかどうかは親が決める。子は「閉じたい」と知らせるだけ → emit。' },
      ];
      const OPT = { p: ['props ⬇', 'var(--ts)', '親 → 子'], e: ['emit ⬆', 'var(--team)', '子 → 親'], m: ['v-model ⇅', 'var(--vue)', '両方向'] };
      const NG = { pe: 'この部品は「知らせる」側ではない。データをもらって見せるだけ。', pm: '子が値を書き換える必要はない。両方向は大げさ。', ep: '向きが逆。ここは子から親へ「知らせたい」。', em: '値を共有したいわけではない。知らせるだけでよい。', mp: '⬇だけでは足りない。子が入力した値を親に返す必要がある。', me: '⬆だけでは足りない。親からも値を渡す必要がある（⇅）。' };
      const SRC = (s) => {
        const f = (i) => s[i] ? Q[i].fill : Q[i].ph;
        return "<template>\n  <SearchBox " + f(0) + " />\n  <LawyerCard\n    v-for=\"l in pageItems\" :key=\"l.id\"\n    " + f(1) + "\n    " + f(2) + "\n  />\n  <Pagination :total=\"hits.length\" " + f(3) + " />\n  <ConsultModal\n    v-if=\"target\"\n    " + f(4) + "\n    " + f(5) + "\n  />\n</template>";
      };
      const LN = [2, 5, 6, 8, 11, 12];
      const solved = Q.map(() => false);
      let cur = 0;
      /* ---- 左：本物っぽい画面。①〜⑥ のピンが、問題の場所 ---- */
      const pins = [];
      const pin = (i) => { const p = h('span', { class: 'vrC2-pin', 'data-k': 'q' + i, onclick: () => { cur = i; paint(); } }, '①②③④⑤⑥'[i]); pins[i] = p; return p; };
      const reg = (i, cls, ...kids) => { const r = h('div', { class: 'vrC2-r ' + (cls || ''), 'data-k': 'q' + i }, ...kids, pin(i)); regs[i] = r; return r; };
      const regs = [];
      const stEl = {};
      const stChip = (k, v) => { const c = h('b', v); stEl[k] = c; return h('span', { class: 'vrC2-st', 'data-k': { keyword: 'q0', page: 'q3', target: 'q2' }[k] }, k + ' = ', c); };
      const par = h('div', { class: 'vrC2-par' }, h('span', { class: 'who' }, '👨 親  LawyerSearchPage.vue'), stChip('keyword', '"相続"'), stChip('page', '2'), stChip('target', '—'));
      const pg = h('div', { class: 'vrC2-pg' },
        h('div', { class: 'vrC2-hd' }, '⚖ 弁護士ナビ', h('small', '相続の弁護士を探す')),
        par,
        reg(0, 'in', h('span', null, '🔎 '), h('b', '相続'), h('span', { class: 'ph' }, '　分野・地域で検索')),
        h('div', { class: 'vrC2-cd' }, h('span', { class: 'vrC2-av' }, '👨‍⚖️'),
          reg(1, 'nm', h('b', '山田 太郎 弁護士'), h('small', '相続・遺言 ／ 東京')),
          reg(2, 'bt', h('button', { class: 'vrC2-bt' }, '相談する'))),
        h('div', { class: 'vrC2-cd dim' }, h('span', { class: 'vrC2-av' }, '👩‍⚖️'), h('div', { class: 'nm' }, h('b', '佐藤 花子 弁護士'), h('small', '離婚・親権 ／ 大阪')), h('button', { class: 'vrC2-bt' }, '相談する')),
        reg(3, 'pgn', h('span', null, '‹'), h('span', null, '1'), h('b', '2'), h('span', null, '3'), h('span', null, '›')),
        h('div', { class: 'vrC2-md' },
          h('div', { class: 'vrC2-mh' }, h('b', '相談する'), reg(5, 'x', h('span', null, '✕ 閉じる'))),
          reg(4, 'mb', h('span', null, '👨‍⚖️ 山田 太郎 弁護士 に相談')),
          h('div', { class: 'vrC2-note' }, '↑ モーダル（相談するを押すと開く）')));
      /* ---- 右：いまの問題 ---- */
      const qBox = h('div', { class: 'vrC2-q' });
      const codeHost = h('div');
      const dots = h('div', { class: 'vrC2-dots' });
      const draw = () => {
        const q = Q[cur];
        qBox.replaceChildren(
          h('div', { class: 'vrC2-qh', 'data-k': 'cur' }, h('span', { class: 'n' }, '①②③④⑤⑥'[cur]), h('b', q.who)),
          h('div', { class: 'vrC2-qt', 'data-k': 'cur' }, q.t),
          h('div', { class: 'vrC2-ans' }, ...Object.keys(OPT).map((k) => {
            const b = h('button', { class: 'vrC2-a' + (solved[cur] && k === q.ans ? ' on' : ''), style: { '--c': OPT[k][1] } }, h('b', OPT[k][0]), h('small', OPT[k][2]));
            b.onclick = () => answer(k, b); return b;
          })),
          h('div', { class: 'vrC2-fb' + (solved[cur] ? ' ok' : '') }, solved[cur] ? '✓ ' + q.why : '押す場所のピン ' + '①②③④⑤⑥'[cur] + ' を見て、矢印の向きを選ぼう'),
          ...(solved[cur] ? [h('div', { class: 'vrC2-data' }, h('small', '実際に流れるデータ'), h('code', q.data))] : []));
        const np = code(SRC(solved), 'vue', { color: 'var(--ts)', file: 'LawyerSearchPage.vue（親のテンプレート）', dim: true, edit: false });
        np.setHi([LN[cur]], 'on'); codeHost.replaceChildren(np);
        curPre = np; relink();
      };
      let root = null, curPre = null;
      const relink = () => {
        if (!root || !curPre) return;
        root.querySelectorAll('[data-k]').forEach((n) => { n.__vsl = 0; });
        const m = { cur: [Q[cur].ph, Q[cur].fill] }; Q.forEach((q, i) => { m['q' + i] = [q.ph, q.fill]; });
        const c = cur; K.vs.link(root, curPre, m, { rest: () => [LN[c]] });
      };
      const paint = () => {
        pins.forEach((p, i) => { p.className = 'vrC2-pin' + (solved[i] ? ' ok' : '') + (i === cur ? ' cur' : ''); regs[i].classList.toggle('cur', i === cur); regs[i].classList.toggle('ok', solved[i]); });
        dots.replaceChildren(...Q.map((_, i) => h('i', { class: (solved[i] ? 'ok ' : '') + (i === cur ? 'cur' : ''), onclick: () => { cur = i; paint(); } })), h('span', solved.every(Boolean) ? '🎉 全部つながった！' : solved.filter(Boolean).length + ' / ' + Q.length));
        draw();
      };
      const fly = async (from, to, text, col) => {
        const pr = pg.getBoundingClientRect(), a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
        const el = h('span', { class: 'vrC2-pkt', style: { background: col } }, text); pg.append(el);
        const w = el.offsetWidth, hh = el.offsetHeight;
        const pt = (r) => ({ x: r.left - pr.left + r.width / 2 - w / 2, y: r.top - pr.top + r.height / 2 - hh / 2 });
        const A = pt(a), B = pt(b);
        try { await el.animate([{ transform: `translate(${A.x}px,${A.y}px) scale(.6)`, opacity: 0 }, { transform: `translate(${A.x}px,${A.y}px) scale(1)`, opacity: 1, offset: .15 }, { transform: `translate(${B.x}px,${B.y}px) scale(1)`, opacity: 1, offset: .85 }, { transform: `translate(${B.x}px,${B.y}px) scale(.6)`, opacity: 0 }], { duration: 1100, easing: 'ease-in-out' }).finished; } catch (e) { /* 途中で消えてもよい */ }
        el.remove();
      };
      const bump = (el) => { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); };
      const play = async (k, i) => {
        const q = Q[i], r = regs[i], col = OPT[k][1];
        const parEl = par.querySelector('.who');
        if (k === 'p') { await fly(parEl, r, q.pk, col); bump(r); }
        else if (k === 'e') { bump(r); await fly(r, parEl, "emit('" + q.pk + "')", col); }
        else { await fly(parEl, r, q.pk, 'var(--ts)'); bump(r); await fly(r, parEl, q.pk, 'var(--team)'); }
        if (q.st) { if (q.val) stEl[q.st].textContent = q.val; bump(stEl[q.st]); }
      };
      const answer = (k, b) => {
        const q = Q[cur];
        if (solved[cur]) return;
        if (k === q.ans) {
          solved[cur] = true;
          const r = regs[cur]; r.dataset.arrow = k === 'p' ? '⬇ props' : k === 'e' ? '⬆ emit' : '⇅ v-model'; r.classList.add('flow'); setTimeout(() => r.classList.remove('flow'), 1400);
          paint(); play(k, cur);
          const nx = solved.findIndex((v) => !v); if (nx >= 0) setTimeout(() => { if (solved[cur]) { cur = nx; paint(); } }, 2800);
        } else {
          b.classList.add('x'); const fb = qBox.querySelector('.vrC2-fb'); fb.className = 'vrC2-fb ng'; fb.textContent = '✖ ' + NG[q.ans + k]; qBox.classList.remove('shake'); void qBox.offsetWidth; qBox.classList.add('shake');
        }
      };
      const reset = h('button', { class: 'btn ghost', onclick: () => { solved.fill(false); cur = 0; stEl.target.textContent = '—'; paint(); } }, '⟲ やり直す');
      paint();
      root = h('div', { class: 'vrC-wrap' }, h('div', { class: 'vrC-bar' }, dots, h('span', { style: { flex: 1 } }), reset),
        h('div', { class: 'vi-eq' }, h('div', { class: 'vrC-wrap' }, h('div', { class: 'vi-lb' }, '👀 弁護士検索の画面（ピン ①〜⑥ が問題の場所）'), pg),
          h('div', { class: 'vrC-wrap' }, qBox, codeHost)));
      relink(); return root;
    }
    style('vrC2', `
    .vrC2-pg{background:#f4f6fb;color:#223;border-radius:14px;padding:14px;display:grid;gap:12px;min-width:0}
    .vrC2-hd{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-radius:10px;background:#1d2b53;color:#fff;font-weight:900;font-size:1rem}
    .vrC2-hd small{font-weight:700;opacity:.8}
    .vrC2-r{position:relative;border-radius:10px;outline:2px dashed transparent;outline-offset:3px;transition:outline-color .2s,background .2s}
    .vrC2-r.cur{outline-color:var(--ts);background:color-mix(in srgb,var(--ts) 10%,transparent);animation:vrC2p 1.4s ease-in-out infinite}
    .vrC2-r.ok{outline:2px solid var(--ok);background:color-mix(in srgb,var(--ok) 12%,transparent);animation:none}
    @keyframes vrC2p{50%{outline-color:transparent}}
    .vrC2-r.in{display:flex;align-items:center;gap:6px;padding:11px 14px;background:#fff;border:1px solid #cdd3e3;font-size:1rem;font-weight:700}
    .vrC2-r .ph{color:#99a;font-weight:600;font-size:.88rem}
    .vrC2-cd{display:flex;gap:12px;align-items:center;background:#fff;border:1px solid #d7dbe8;border-radius:12px;padding:12px 14px}
    .vrC2-cd.dim{opacity:.55}
    .vrC2-av{width:42px;height:42px;border-radius:50%;background:#dfe5f7;display:grid;place-items:center;font-size:1.3rem;flex:none}
    .vrC2-cd .nm,.vrC2-r.nm{flex:1;min-width:0;display:grid;font-size:.9rem;padding:4px 6px}
    .vrC2-cd small{color:#667}
    .vrC2-bt{border:0;border-radius:8px;padding:.5em 1.1em;background:#2f7bff;color:#fff;font:900 .9rem var(--font)}
    .vrC2-r.bt{padding:3px}
    .vrC2-r.pgn{display:flex;gap:6px;justify-content:center;padding:8px;font-weight:800;font-size:1rem}
    .vrC2-r.pgn span,.vrC2-r.pgn b{min-width:2em;text-align:center;padding:.25em .4em;border-radius:7px;background:#fff;border:1px solid #cdd3e3}
    .vrC2-r.pgn b{background:#2f7bff;color:#fff;border-color:#2f7bff}
    .vrC2-md{border:2px dashed #aab;border-radius:14px;padding:12px;display:grid;gap:10px;background:#fff}
    .vrC2-mh{display:flex;justify-content:space-between;align-items:center}
    .vrC2-r.x{padding:5px 10px;font-weight:800;font-size:.85rem;color:#556;background:#eef1f8}
    .vrC2-r.mb{padding:11px 12px;font-weight:800;background:#f7f8fc;border:1px solid #dde}
    .vrC2-note{font-size:.72rem;color:#99a;font-weight:700}
    .vrC2-pin{position:absolute;top:-11px;right:-8px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#8a93ad;color:#fff;font:900 .8rem var(--font);cursor:pointer;z-index:2;transition:.2s}
    .vrC2-pin.cur{background:var(--ts);transform:scale(1.2);box-shadow:0 0 0 4px color-mix(in srgb,var(--ts) 30%,transparent)}
    .vrC2-pin.ok{background:var(--ok);transform:none;box-shadow:none}
    .vrC2-r.flow::after{content:attr(data-arrow);position:absolute;left:50%;top:-30px;transform:translateX(-50%);padding:.15em .8em;border-radius:99px;background:var(--ok);color:#06101f;font:900 .82rem var(--font);white-space:nowrap;animation:vrC2f 1.4s both;z-index:3}
    @keyframes vrC2f{0%{opacity:0;top:-6px}25%{opacity:1;top:-30px}80%{opacity:1}100%{opacity:0}}
    .vrC2-par{display:flex;gap:8px 12px;align-items:center;flex-wrap:wrap;padding:9px 12px;border-radius:10px;background:#e7efff;border:2px solid var(--ts);color:#1d2b53;font:800 .82rem var(--mono)}
    .vrC2-par .who{font:900 .85rem var(--font);color:var(--ts)}
    .vrC2-st{padding:.15em .6em;border-radius:7px;background:#fff;border:1px solid #c7d4f5}
    .vrC2-st b{color:#2f6df0}
    .vrC2-pkt{position:absolute;left:0;top:0;z-index:9;padding:.25em .9em;border-radius:99px;color:#06101f;font:900 .85rem var(--mono);box-shadow:0 6px 18px rgba(0,0,0,.35);pointer-events:none;white-space:nowrap}
    .vrC2-pg{position:relative}
    .bump{animation:vrC2b .7s}@keyframes vrC2b{30%{transform:scale(1.12);box-shadow:0 0 0 5px color-mix(in srgb,var(--ok) 45%,transparent)}}
    .vrC2-dots{display:flex;gap:8px;align-items:center}
    .vrC2-dots i{width:14px;height:14px;border-radius:50%;background:var(--line);cursor:pointer;transition:.2s}
    .vrC2-dots i.cur{background:var(--ts);transform:scale(1.3)}.vrC2-dots i.ok{background:var(--ok)}
    .vrC2-dots span{margin-left:8px;font:900 .9rem var(--mono);color:var(--mute)}
    .vrC2-q{border:2px solid var(--ts);border-radius:14px;background:var(--card);padding:16px 18px;display:grid;gap:12px}
    .vrC2-q.shake{animation:vrC2s .35s}@keyframes vrC2s{25%{transform:translateX(-7px)}75%{transform:translateX(7px)}}
    .vrC2-qh{display:flex;gap:10px;align-items:center}.vrC2-qh .n{width:30px;height:30px;border-radius:50%;background:var(--ts);color:#06101f;display:grid;place-items:center;font:900 1rem var(--font)}
    .vrC2-qh b{font:900 1.05rem var(--font)}
    .vrC2-qt{font:800 1.2rem/1.6 var(--font)}
    .vrC2-ans{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
    .vrC2-a{display:grid;gap:2px;justify-items:center;padding:.8em .4em;border-radius:12px;border:2px solid var(--c);background:transparent;color:var(--c);cursor:pointer;transition:.15s}
    .vrC2-a b{font:900 1.05rem var(--font)}.vrC2-a small{font:700 .75rem var(--font);opacity:.85}
    .vrC2-a:hover{background:color-mix(in srgb,var(--c) 16%,transparent)}
    .vrC2-a.on{background:var(--c);color:#06101f}
    .vrC2-a.x{opacity:.35;text-decoration:line-through}
    .vrC2-fb{font:800 .95rem/1.6 var(--font);color:var(--mute);min-height:1.6em}
    .vrC2-fb.ok{color:var(--ok)}.vrC2-fb.ng{color:var(--bad)}
    .vrC2-data{display:grid;gap:4px}.vrC2-data small{font:800 .75rem var(--font);color:var(--mute)}
    .vrC2-data code{padding:.5em .8em;border-radius:8px;background:var(--code);color:#d8dcff;font:700 .95rem var(--mono)}
    `);

    const mine = [
      { t: '実例：画面を部品に切る', tag: '実例', lead: '弁護士検索ページは、<b>6つの部品</b>でできている。', render(el) { el.append(cutScene()); } },
      { t: '実例：どの部品に何を渡す？', tag: '実例', lead: '矢印の向きで、<b>props ⬇・emit ⬆・v-model ⇅</b> を選ぶ。', render(el) { el.append(wireScene()); } },
    ];
    const at = L.scenes.findIndex((s) => s.t === '使い分け：どう渡す？');
    L.scenes.splice(at < 0 ? L.scenes.length : at, 0, ...mine);
  }
})();
