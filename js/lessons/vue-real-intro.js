/* vue-intro 実例：弁護士検索サイトの画面を HTML / CSS / JS / Vue部品 の層に分けて見る。 */
(function () {
  'use strict';
  const K = window.KENSHU;
  if (!K || !K.lessons || !K.lessons['vue-intro'] || !K.W) return;
  const L = K.lessons['vue-intro'];
  if (L.scenes.some((s) => s.t === '実例：検索サイトを層に分ける')) return;
  const { h, code, style } = K.W;

  style('vrI', `
  .vrI-lay{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}
  .vrI-lay .vi-chip{--cc:var(--vue)}
  .vrI-lay .vi-chip.cur{background:var(--cc);color:#06101f}
  .vrI-win{border:2px solid var(--line);border-radius:12px;overflow:hidden;background:var(--card);min-width:0}
  .vrI-bar{display:flex;align-items:center;gap:6px;padding:7px 10px;background:var(--card2);border-bottom:1px solid var(--line)}
  .vrI-bar i{width:10px;height:10px;border-radius:50%;background:var(--line)}
  .vrI-url{flex:1;margin-left:8px;padding:.15em .8em;border-radius:99px;background:var(--card);font:700 .72rem var(--mono);color:var(--mute);overflow:hidden;white-space:nowrap}
  .vrI-pg{background:#f5f7fb;color:#1c2333;font-family:var(--font);font-size:.82rem;padding:0 0 12px;position:relative}
  .vrI-pg [data-part]{cursor:pointer;position:relative}
  .vrI-hd{display:flex;justify-content:space-between;align-items:center;background:#12306b;color:#fff;padding:10px 16px}
  .vrI-hd h1{margin:0;font-size:1.05rem;letter-spacing:.04em}
  .vrI-hd nav{display:flex;gap:14px;font-size:.74rem;opacity:.9}
  .vrI-hd .u{background:#ffffff26;padding:.2em .8em;border-radius:99px;font-size:.72rem}
  .vrI-sb{background:#fff;margin:12px 14px 0;padding:12px;border-radius:12px;box-shadow:0 2px 10px #1c23331a;display:grid;gap:8px}
  .vrI-sb input{padding:.55em .8em;border:1.5px solid #cfd6e6;border-radius:8px;font:inherit;color:#1c2333;background:#fff;width:100%;box-sizing:border-box}
  .vrI-fl{display:flex;gap:6px;flex-wrap:wrap}
  .vrI-fl button{padding:.28em .9em;border-radius:99px;border:1.5px solid #cfd6e6;background:#fff;color:#1c2333;font:700 .74rem var(--font);cursor:pointer}
  .vrI-fl button.on{background:#1a5fd0;border-color:#1a5fd0;color:#fff}
  .vrI-cnt{margin:12px 16px 6px;font-weight:800;font-size:.78rem;color:#55607a}
  .vrI-ls{display:grid;gap:10px;margin:0 14px;position:relative}
  .vrI-cd{background:#fff;border:1px solid #dfe3ee;border-radius:12px;padding:12px 14px;display:grid;grid-template-columns:44px 1fr auto;gap:2px 12px;align-items:center}
  .vrI-cd .av{grid-row:span 2;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:900;font-size:1.05rem}
  .vrI-cd h3{margin:0;font-size:.92rem}.vrI-cd p{margin:0;color:#667;font-size:.72rem}
  .vrI-cd .tg{grid-column:2;display:flex;gap:5px;margin-top:4px}
  .vrI-cd .tg span{background:#e8f0ff;color:#1a5fd0;border-radius:6px;padding:.05em .6em;font-size:.66rem;font-weight:800}
  .vrI-cd .tg .fr{background:#e4f6ec;color:#15803d}
  .vrI-cd button{grid-column:3;grid-row:1 / span 2;padding:.55em 1em;border:0;border-radius:8px;background:#1a5fd0;color:#fff;font:800 .76rem var(--font);cursor:pointer}
  .vrI-cd button:disabled{background:#9aa5bd;cursor:default}
  .vrI-empty{padding:18px;text-align:center;color:#667;font-weight:700}
  .vrI-toast{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);background:#1c2333;color:#fff;padding:.5em 1.1em;border-radius:8px;font-weight:800;font-size:.76rem;opacity:0;transition:.3s;pointer-events:none;white-space:nowrap;z-index:5}
  .vrI-toast.on{opacity:1}
  /* 層 */
  .vrI-pg.raw{background:#fff;font-family:Georgia,'Times New Roman',serif;font-size:14px;padding:8px 12px 12px}
  .vrI-pg.raw *{all:revert}
  .vrI-pg.raw [data-part]{cursor:pointer}
  .vrI-pg.raw .vrI-nojs,.vrI-pg.raw .vrI-toast{display:none}
  .vrI-pg.raw .vrI-cd{margin:8px 0}
  .vrI-pg.raw .av{display:none}
  .vrI-pg.hot [data-part].hot{outline:3px solid var(--vue);outline-offset:-3px;background-image:linear-gradient(#42b88326,#42b88326)}
  .vrI-pg.vue [data-comp]{outline:2px dashed #42b883;outline-offset:2px;margin-top:6px}
  .vrI-pg.vue [data-comp]::before{content:attr(data-comp);position:absolute;top:-9px;left:6px;z-index:3;background:#42b883;color:#06101f;font:800 .62rem var(--mono);padding:.05em .6em;border-radius:5px}
  .vrI-pg.vue .vrI-ls{margin-top:14px}
  .vrI-pg.vue .vrI-ls::before{left:auto;right:6px;top:-12px}
  .vrI-pg.vue .vrI-cd[data-comp]{position:relative}
  .vrI-nojs{display:none;margin:8px 14px 0;padding:.4em .8em;border-radius:8px;background:#fff3d6;color:#8a5a00;font-weight:800;font-size:.72rem}
  .vrI-pg.nojs .vrI-nojs{display:block}
  .vrI-side{display:grid;gap:10px;min-width:0}
  .vrI-ttl{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
  .vrI-ttl b{font:900 .95rem var(--mono);color:var(--vue)}
  .vrI-kinds{display:flex;gap:6px;flex-wrap:wrap}
  .vrI-kinds .vi-chip.cur{background:var(--cc);color:#06101f}
  .vrI-side pre.code{margin:0;max-width:100%;overflow-x:auto}
  .vrI-hint{font:700 .76rem var(--font);color:var(--mute)}
  `);

  const LAWYERS = [
    { id: 1, name: '田村 結衣', office: '麹町ひかり法律事務所', area: '東京都千代田区', fields: ['離婚', '相続'], free: true, color: '#d9534f' },
    { id: 2, name: '中島 健太', office: '中島・青木法律事務所', area: '大阪府大阪市', fields: ['債務整理', '交通事故'], free: true, color: '#2f7fd1' },
    { id: 3, name: '森田 あかり', office: '博多みらい法律事務所', area: '福岡県福岡市', fields: ['相続', '交通事故'], free: false, color: '#8e5bd4' },
    { id: 4, name: '川上 誠', office: '札幌中央法律事務所', area: '北海道札幌市', fields: ['離婚', '債務整理'], free: true, color: '#1f9d77' },
  ];
  const FIELDS = ['離婚', '相続', '債務整理', '交通事故'];

  const SRC = {
    header: "<script setup lang=\"ts\">\ndefineProps<{ userName: string }>()\n</script>\n\n<template>\n  <header class=\"app-header\">\n    <h1>弁護士ナビ</h1>\n    <nav>\n      <a href=\"/search\">弁護士を探す</a>\n      <a href=\"/column\">法律コラム</a>\n    </nav>\n    <span class=\"user\">{{ userName }} さん</span>\n  </header>\n</template>\n\n<style scoped>\n.app-header {\n  display: flex;\n  justify-content: space-between;\n  background: #12306b;\n  color: #fff;\n}\n</style>",
    search: "<script setup lang=\"ts\">\nimport type { Field } from '@/types/lawyer'\n\nconst keyword = defineModel<string>('keyword', { required: true })\nconst field = defineModel<Field | null>('field', { required: true })\nconst fields: Field[] = ['離婚', '相続', '債務整理', '交通事故']\n\nfunction toggle(f: Field) {\n  field.value = field.value === f ? null : f\n}\n</script>\n\n<template>\n  <section class=\"search-bar\">\n    <input v-model=\"keyword\" placeholder=\"地域・事務所名で検索\" />\n    <div class=\"fields\">\n      <button\n        v-for=\"f in fields\"\n        :key=\"f\"\n        :class=\"{ on: field === f }\"\n        @click=\"toggle(f)\"\n      >\n        {{ f }}\n      </button>\n    </div>\n  </section>\n</template>\n\n<style scoped>\n.search-bar {\n  background: #fff;\n  border-radius: 12px;\n  padding: 12px;\n}\n.fields button.on {\n  background: #1a5fd0;\n  color: #fff;\n}\n</style>",
    card: "<script setup lang=\"ts\">\nimport type { Lawyer } from '@/types/lawyer'\n\ndefineProps<{ lawyer: Lawyer; reserved: boolean }>()\nconst emit = defineEmits<{ reserve: [id: number] }>()\n</script>\n\n<template>\n  <article class=\"lawyer-card\">\n    <h3>{{ lawyer.name }}</h3>\n    <p>{{ lawyer.office }}・{{ lawyer.area }}</p>\n    <span v-if=\"lawyer.free\">初回相談無料</span>\n    <button :disabled=\"reserved\" @click=\"emit('reserve', lawyer.id)\">\n      {{ reserved ? '予約済み ✓' : '相談を予約' }}\n    </button>\n  </article>\n</template>\n\n<style scoped>\n.lawyer-card {\n  background: #fff;\n  border: 1px solid #dfe3ee;\n  border-radius: 12px;\n  padding: 12px 14px;\n}\n.lawyer-card button {\n  background: #1a5fd0;\n  color: #fff;\n  border-radius: 8px;\n}\n</style>",
  };
  /* 種類ごとの行番号（template / script / style の中身） */
  const kindLines = (src) => {
    const ls = src.split('\n'), out = { html: [], css: [], js: [] };
    let cur = null;
    ls.forEach((l, i) => {
      if (/^<script/.test(l)) { cur = 'js'; return; }
      if (/^<template/.test(l)) { cur = 'html'; return; }
      if (/^<style/.test(l)) { cur = 'css'; return; }
      if (/^<\/(script|template|style)>/.test(l)) { cur = null; return; }
      if (cur && l.trim() && !/^import /.test(l)) out[cur].push(i + 1);
    });
    return out;
  };
  const PARTS = {
    header: { name: 'AppHeader.vue', src: SRC.header, file: 'components/AppHeader.vue' },
    search: { name: 'SearchBar.vue', src: SRC.search, file: 'components/SearchBar.vue' },
    card: { name: 'LawyerCard.vue', src: SRC.card, file: 'components/LawyerCard.vue' },
  };
  const KINDS = [['html', 'HTML 構造', 'var(--ts)'], ['css', 'CSS 見た目', 'var(--team)'], ['js', 'JS 動き', 'var(--vue)']];
  const LAYERS = ['① HTML だけ', '② ＋ CSS', '③ ＋ JavaScript', '④ Vue の部品に分ける'];

  function scene(el) {
    let level = 3, part = 'card', kind = 'js', pinned = false;
    const st = { kw: '', field: null, reserved: new Set() };
    const jsOn = () => level >= 2;

    const toast = h('div', { class: 'vrI-toast' });
    const list = h('div', { class: 'vrI-ls', 'data-comp': 'LawyerList' });
    const cnt = h('div', { class: 'vrI-cnt' });
    const input = h('input', { placeholder: '地域・事務所名で検索', value: '' });
    const flBox = h('div', { class: 'vrI-fl' });
    const pg = h('div', { class: 'vrI-pg hot' },
      h('header', { 'data-part': 'header', 'data-comp': 'AppHeader', class: 'vrI-hd' }, h('h1', '弁護士ナビ'), h('nav', h('a', { href: '#' }, '弁護士を探す'), h('a', { href: '#' }, '法律コラム')), h('span', { class: 'u' }, '佐藤 さん')),
      h('div', { class: 'vrI-nojs' }, 'JavaScript なし：入力もボタンも反応しない'),
      h('section', { 'data-part': 'search', 'data-comp': 'SearchBar', class: 'vrI-sb' }, input, flBox),
      cnt, list, toast);

    const say = (t) => { toast.textContent = t; toast.classList.add('on'); clearTimeout(say.t); say.t = setTimeout(() => toast.classList.remove('on'), 1600); };
    const blocked = () => { if (jsOn()) return false; say('JavaScript がないので動かない'); return true; };

    const paint = () => {
      flBox.replaceChildren(...FIELDS.map((f) => h('button', { class: st.field === f ? 'on' : '', onclick: (e) => { if (blocked()) return; st.field = st.field === f ? null : f; paint(); } }, f)));
      const rows = LAWYERS.filter((l) => (!st.field || l.fields.includes(st.field)) && (!st.kw || (l.office + l.area + l.name).includes(st.kw)));
      cnt.textContent = rows.length + '件の弁護士が見つかりました';
      list.replaceChildren(...(rows.length ? rows.map((l) => {
        const done = st.reserved.has(l.id);
        const b = h('button', { disabled: done, onclick: () => { if (blocked()) return; st.reserved.add(l.id); paint(); say(l.name + ' 弁護士に相談予約を送信しました'); } }, done ? '予約済み ✓' : '相談を予約');
        return h('article', { 'data-part': 'card', 'data-comp': 'LawyerCard', class: 'vrI-cd' },
          h('div', { class: 'av', style: { background: l.color } }, l.name[0]), h('h3', l.name), h('p', l.office + '・' + l.area),
          h('div', { class: 'tg' }, ...l.fields.map((f) => h('span', f)), l.free ? h('span', { class: 'fr' }, '初回相談無料') : null), b);
      }) : [h('div', { class: 'vrI-empty' }, '条件に合う弁護士がいません')]));
      list.querySelectorAll('.vrI-cd').forEach((c, i) => { if (i === 0) c.dataset.first = '1'; });
    };
    input.addEventListener('input', () => { if (!jsOn()) { input.value = ''; blocked(); return; } st.kw = input.value; paint(); });

    /* 右：コード */
    const ttl = h('div', { class: 'vrI-ttl' });
    const kinds = h('div', { class: 'vrI-kinds' });
    const side = h('div', { class: 'vrI-side' }, ttl, kinds);
    let pre = null;
    const showCode = () => {
      const P = PARTS[part];
      const ln = kindLines(P.src);
      ttl.replaceChildren(h('span', { class: 'vi-lb' }, 'いま見ている部品'), h('b', P.name));
      kinds.replaceChildren(...KINDS.map(([k, t, c]) => h('span', { class: 'vi-chip' + (k === kind ? ' cur' : ' off'), style: { '--cc': c }, onclick: () => { kind = k; showCode(); } }, t + ' ' + ln[k].length + '行')));
      const np = code(P.src, 'vue', { color: 'var(--vue)', file: P.file, dim: true });
      if (pre) pre.replaceWith(np); else side.append(np);
      pre = np; pre.style.setProperty('--c', (KINDS.find((x) => x[0] === kind) || KINDS[0])[2]); pre.setHi(ln[kind]);
    };
    const setHot = (p) => pg.querySelectorAll('[data-part]').forEach((n) => n.classList.toggle('hot', !!p && n === p));
    const pick = (node, pin) => {
      if (!node) return;
      part = node.dataset.part; showCode(); setHot(node);
    };
    pg.addEventListener('mouseover', (e) => { if (pinned) return; const n = e.target.closest('[data-part]'); if (n) pick(n); });
    pg.addEventListener('mouseleave', () => { if (!pinned) setHot(null); });
    pg.addEventListener('click', (e) => { const n = e.target.closest('[data-part]'); if (!n) return; pinned = true; pick(n); });
    pg.addEventListener('dblclick', () => { pinned = false; });

    const apply = () => {
      pg.classList.toggle('raw', level === 0);
      pg.classList.toggle('nojs', level === 1);
      pg.classList.toggle('vue', level === 3);
      cur.forEach((c, i) => c.classList.toggle('cur', i === level));
      if (level <= 2) { kind = ['html', 'css', 'js'][level]; showCode(); }
    };
    const cur = LAYERS.map((t, i) => h('span', { class: 'vi-chip' + (i === level ? ' cur' : ''), onclick: () => { level = i; apply(); } }, t));
    const lay = h('div', { class: 'vrI-lay' }, h('span', { class: 'vi-lb' }, 'ページの層'), ...cur);
    const win = h('div', { class: 'vrI-win' },
      h('div', { class: 'vrI-bar' }, h('i'), h('i'), h('i'), h('span', { class: 'vrI-url' }, 'https://bengoshi-navi.example/search')),
      pg);
    paint(); showCode(); apply();
    el.append(h('div', { class: 'vi-eq' }, h('div', { style: { minWidth: 0 } }, lay, win, h('div', { class: 'vrI-hint', style: { marginTop: '8px' } }, '画面の部品にマウスを乗せる／クリックで固定（ダブルクリックで解除）')), side));
    apply();
  }

  const sc = { t: '実例：検索サイトを層に分ける', tag: '実例', lead: '弁護士検索サイトの画面を、<b>層</b>と<b>Vue の部品</b>に分けて見よう。', render: scene };
  const i = L.scenes.length - 1;
  L.scenes.splice(Math.max(i, 0), 0, sc);
})();
