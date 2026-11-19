/* vue-vs-e：x-vue-composables の「いちばん最初」に、導入シーン「なぜ composable が必要？」を差し込む。
   困りごと：1つのコンポーネントに機能が全部混ざる → 別の画面で使うにはコピーするしかない。
   左＝ない場合（1ファイルに3機能） / 右＝ある場合（composables/ に切り出し、部品は呼ぶだけ）。
   既存シーンの title は変えない（drill / test / 用語は title がキー）。 */
(function () {
  'use strict';
  const K = window.KENSHU;
  const TITLE = 'なぜ composable が必要？';
  let tries = 0, done = false;
  (function wait() {
    if (!done && K && K.lessons && K.lessons['x-vue-composables'] && K.W && K.vs) { done = true; install(); }
    if (!done && ++tries < 400) setTimeout(wait, 50);
  })();

  function install() {
    const { h, style } = K.W;
    const FC = { mouse: '#ff6b9d', search: '#5b9dff', fav: '#ffb454' };
    const FN = { mouse: 'マウス位置', search: '検索（API）', fav: 'お気に入り' };
    const KEYS = ['mouse', 'search', 'fav'];
    const J = (...a) => a.join('\n');

    style('vxW', `
    .vxW-top{display:flex;align-items:center;gap:8px;font:800 .8rem var(--mono);color:#5b6788;flex-wrap:wrap}
    .vxW-fold{border:2px solid #d5dcef;border-radius:10px;background:#fff;padding:8px;display:grid;gap:8px;min-width:0}
    .vxW-fold>.vxW-top{padding:0 2px}
    .vxW-file{border:2px solid #9aa8cc;border-radius:10px;background:#f9fbff;padding:8px;display:grid;gap:6px;min-width:0}
    .vxW-fh{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font:900 .85rem var(--mono);color:#1d2b53}
    .vxW-badge{margin-left:auto;padding:.1em .65em;border-radius:99px;font:900 .8rem var(--font);background:#fdecec;color:#c0262d;transition:.3s}
    .vxW-badge.ok{background:#e3f6ee;color:#13805f}
    .vxW-row{border-left:6px solid var(--fc);border-radius:8px;background:color-mix(in srgb,var(--fc) 12%,#fff);padding:6px 10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;min-height:44px;min-width:0;transition:.35s}
    .vxW-tag{font:900 .8rem var(--font);color:#1f2a44;white-space:nowrap}
    .vxW-tag i{font-style:normal;font-family:var(--mono);color:#5b6788;margin-left:.4em}
    .vxW-mini{font:700 .8rem var(--mono);color:#1f2a44;background:#fff;border:1.5px solid #cdd6ee;border-radius:6px;padding:.2em .6em;min-width:0}
    .vxW-in{font:700 .85rem var(--font);padding:.3em .6em;border-radius:6px;border:1.5px solid #b8c4e4;background:#fff;color:#1f2a44;width:9.5em;min-width:0;box-sizing:border-box}
    .vxW-star{all:unset;cursor:pointer;font:800 .8rem var(--font);padding:.2em .6em;border-radius:99px;border:1.5px solid #cdd6ee;background:#fff;color:#1f2a44}
    .vxW-star.on{background:#ffb454;border-color:#ffb454}
    .vxW-call{font:800 .8rem var(--mono);color:#1f2a44;display:none}
    .vxW-split .vxW-body{display:none}.vxW-split .vxW-call{display:block}
    .vxW-split .vxW-row{min-height:34px;padding:4px 10px}
    .vxW-files{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
    @media(max-width:700px){.vxW-files{grid-template-columns:1fr}}
    .vxW-fl{border:2px dashed var(--fc);border-radius:8px;padding:6px 8px;background:color-mix(in srgb,var(--fc) 10%,#fff);display:grid;gap:2px;min-width:0;transition:.4s;opacity:1}
    .vxW-fl b{font:900 .8rem var(--mono);color:#1f2a44;word-break:break-all}
    .vxW-fl span{font:700 .8rem var(--font);color:#5b6788}
    .vxW-fl.off{opacity:.3;border-style:dotted}
    .vxW-slot{border:2px dashed #b8c4e4;border-radius:10px;padding:8px;display:grid;gap:6px;min-height:84px;align-content:start;color:#5b6788;font:700 .8rem var(--font);min-width:0;transition:.3s}
    .vxW-slot.has{border-style:solid;border-color:#9aa8cc;background:#f9fbff;color:#1f2a44}
    .vxW-cp{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
    .vxW-cp span{font:800 .8rem var(--font);padding:.15em .6em;border-radius:6px;border-left:5px solid var(--fc);background:color-mix(in srgb,var(--fc) 14%,#fff)}
    .vxW-cp span.x{opacity:.55;text-decoration:line-through}
    .vxW-line{font:800 .8rem var(--mono);color:#1f2a44;background:color-mix(in srgb,#5b9dff 14%,#fff);border-left:5px solid #5b9dff;border-radius:6px;padding:.3em .6em;word-break:break-all}
    .vxW-merits{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
    @media(max-width:900px){.vxW-merits{grid-template-columns:1fr}}
    .vxW-m{border:2px solid var(--line);border-radius:12px;background:var(--card);padding:10px 12px;display:grid;gap:6px;align-content:start;cursor:default;transition:.2s;min-width:0}
    .vxW-m:hover{border-color:var(--ok);transform:translateY(-2px)}
    .vxW-m>b{font:900 .95rem var(--font)}
    .vxW-m div{display:flex;gap:8px;align-items:baseline;font:700 .85rem/1.4 var(--font);flex-wrap:wrap}
    .vxW-m em{font-style:normal;font:900 .8rem var(--font);padding:.05em .6em;border-radius:99px;background:color-mix(in srgb,var(--bad) 16%,transparent);color:var(--bad)}
    .vxW-m em.ok{background:color-mix(in srgb,var(--ok) 16%,transparent);color:var(--ok)}
    .vxW-m strong{font:900 1.05rem var(--mono)}
    .vxW-m .t{all:unset;cursor:pointer;font:800 .8rem var(--font);padding:.15em .8em;border-radius:99px;border:1.5px solid var(--ok);color:var(--ok)}
    .vxW-m .t:hover{background:var(--ok);color:#06101f}
    .vxW-res{font:800 .8rem var(--mono);color:var(--ok)}
    `);

    /* ---------- コードの材料（行ごとに「どの機能の行か」を持たせる） ---------- */
    const seg = (f, ...lines) => lines.map((l) => [l, f]);
    const build = (rows) => ({ src: rows.map((r) => r[0]).join('\n'), tag: rows.map((r) => r[1]), n: (f) => rows.filter((r) => r[1] === f).length });

    const mouseBody = ['  const x = ref<number>(0)', '  const y = ref<number>(0)', '  const onMove = (e: MouseEvent): void => {', '    x.value = e.pageX', '    y.value = e.pageY', '  }', "  onMounted(() => window.addEventListener('mousemove', onMove))", "  onUnmounted(() => window.removeEventListener('mousemove', onMove))"];
    const searchBody = ["  const keyword = ref<string>('')", '  const results = ref<Lawyer[]>([])', '  const loading = ref<boolean>(false)', '  watch(keyword, async (kw: string) => {', '    loading.value = true', '    const res = await fetch(`/api/lawyers?q=${encodeURIComponent(kw)}`)', '    results.value = await res.json()', '    loading.value = false', '  })'];
    const favBody = ['  const favorites = ref<number[]>([])', '  const favCount = computed<number>(() => favorites.value.length)', '  const toggleFav = (id: number): void => {', '    favorites.value = favorites.value.includes(id)', '      ? favorites.value.filter((v) => v !== id)', '      : [...favorites.value, id]', '  }'];
    const un = (a) => a.map((l) => l.replace(/^ {2}/, ''));

    const L = build([
      ...seg(null, '<script setup lang="ts">', "import { ref, computed, watch, onMounted, onUnmounted } from 'vue'", '', 'type Lawyer = { id: number; name: string; field: string }', ''),
      ...seg('mouse', '// マウス位置', ...un(mouseBody), ''),
      ...seg('search', '// 検索ワードと API 呼び出し', ...un(searchBody), ''),
      ...seg('fav', '// お気に入り', ...un(favBody)),
      ...seg(null, '</script>'),
    ]);
    const mk = (name, imp, body, ret) => [...seg(name.f, '// composables/' + name.file, imp, '', 'export const ' + name.fn + ' = () => {', ...body, ret, '}', '')];
    const R = build([
      ...seg(null, '// pages/LawyerSearchPage.vue', '<script setup lang="ts">'),
      ...seg('mouse', "import { useMouse } from '@/composables/useMouse'"),
      ...seg('search', "import { useLawyerSearch } from '@/composables/useLawyerSearch'"),
      ...seg('fav', "import { useFavorites } from '@/composables/useFavorites'"),
      ...seg(null, ''),
      ...seg('mouse', 'const { x, y } = useMouse()'),
      ...seg('search', 'const { keyword, results, loading } = useLawyerSearch()'),
      ...seg('fav', 'const { favorites, favCount, toggleFav } = useFavorites()'),
      ...seg(null, '</script>', ''),
      ...mk({ f: 'mouse', file: 'useMouse.ts', fn: 'useMouse' }, "import { ref, onMounted, onUnmounted } from 'vue'", mouseBody, '  return { x, y }'),
      ...mk({ f: 'search', file: 'useLawyerSearch.ts', fn: 'useLawyerSearch' }, "import { ref, watch } from 'vue'", ["  type Lawyer = { id: number; name: string; field: string }", ...searchBody], '  return { keyword, results, loading }'),
      ...mk({ f: 'fav', file: 'useFavorites.ts', fn: 'useFavorites' }, "import { ref, computed } from 'vue'", favBody, '  return { favorites, favCount, toggleFav }').slice(0, -1),
    ]);
    const compLines = 2 + 3 + 1 + 3 + 1; /* コンポーネントの行数（コメント行を含む表示どおり） */
    const nFile = { mouse: R.n('mouse'), search: R.n('search'), fav: R.n('fav') };
    const leftN = L.src.split('\n').length;
    const copyN = leftN;

    const TOK = {
      mouse: ['useMouse', 'const x =', 'const y =', 'onMove', 'x.value', 'y.value'],
      search: ['useLawyerSearch', 'keyword', 'results', 'loading', 'fetch('],
      fav: ['useFavorites', 'favorites', 'favCount', 'toggleFav'],
    };
    const allTok = [].concat(...KEYS.map((k) => TOK[k]));
    const keysCfg = { mouse: TOK.mouse, search: TOK.search, fav: TOK.fav };

    let C = null; /* versus の ctx */
    const st = { copied: 0, tested: false };
    const meritEls = {};

    const LAW = [{ id: 1, name: '佐藤 健', f: '労働' }, { id: 2, name: '田中 美咲', f: '離婚' }, { id: 3, name: '鈴木 一郎', f: '相続' }, { id: 4, name: '高橋 愛', f: '労働' }];

    /* ---------- 左：1ファイルに3機能 ---------- */
    const leftUi = (ctx) => {
      C = ctx;
      const xy = h('span', { class: 'vxW-mini' }, 'x: 0  y: 0');
      const rMouse = h('div', { class: 'vxW-row', 'data-k': 'mouse', style: { '--fc': FC.mouse } }, h('span', { class: 'vxW-tag' }, FN.mouse, h('i', L.n('mouse') + '行')), xy);
      const kw = h('input', { class: 'vxW-in', placeholder: '例：労働', 'aria-label': '検索ワード' });
      const res = h('span', { class: 'vxW-mini' }, '4 件');
      kw.oninput = () => { const n = LAW.filter((l) => l.f.includes(kw.value) || l.name.includes(kw.value)).length; res.textContent = n + ' 件'; };
      const rSearch = h('div', { class: 'vxW-row', 'data-k': 'search', style: { '--fc': FC.search } }, h('span', { class: 'vxW-tag' }, FN.search, h('i', L.n('search') + '行')), kw, res);
      const fav = new Set(); const cnt = h('span', { class: 'vxW-mini' }, '♥ 0');
      const stars = LAW.slice(0, 3).map((l) => h('button', { class: 'vxW-star', type: 'button', onclick: (e) => { fav.has(l.id) ? fav.delete(l.id) : fav.add(l.id); e.currentTarget.classList.toggle('on', fav.has(l.id)); cnt.textContent = '♥ ' + fav.size; } }, '★ ' + l.name.split(' ')[0]));
      const rFav = h('div', { class: 'vxW-row', 'data-k': 'fav', style: { '--fc': FC.fav } }, h('span', { class: 'vxW-tag' }, FN.fav, h('i', L.n('fav') + '行')), ...stars, cnt);
      const badge = h('span', { class: 'vxW-badge' }, leftN + ' 行・3 機能が混在');
      const comp = h('div', { class: 'vxW-file' }, h('div', { class: 'vxW-fh' }, 'LawyerSearchPage.vue', badge), rMouse, rSearch, rFav);
      comp.addEventListener('mousemove', (e) => { if (!rMouse.contains(e.target)) return; xy.textContent = 'x: ' + Math.round(e.clientX) + '  y: ' + Math.round(e.clientY); });
      const slot = h('div', { class: 'vxW-slot' }, '別の画面（ここでも検索を使いたい）');
      const el = h('div', { style: { display: 'grid', gap: '8px', width: '100%' } },
        h('div', { class: 'vxW-fold' }, h('div', { class: 'vxW-top' }, '📁 src/pages/'), comp, slot));
      const reset = () => { slot.className = 'vxW-slot'; slot.replaceChildren('別の画面（ここでも検索を使いたい）'); st.copied = 0; upd(); };
      const copy = async () => {
        reset();
        await ctx.fly(comp, slot, 'ファイル全部をコピー', '#ff6b9d');
        slot.className = 'vxW-slot has';
        slot.replaceChildren(h('div', { class: 'vxW-fh' }, 'LawyerListPage.vue（コピー）', h('span', { class: 'vxW-badge' }, copyN + ' 行')),
          h('div', { class: 'vxW-cp' }, ...KEYS.map((k) => h('span', { class: k === 'search' ? '' : 'x', style: { '--fc': FC[k] } }, FN[k] + (k === 'search' ? ' ← ほしいのはこれだけ' : ' ← いらない')))));
        st.copied = copyN; upd(); ctx.bump(slot);
      };
      return { el, reset, copy };
    };

    /* ---------- 右：composables/ に切り出し ---------- */
    const rightUi = (ctx) => {
      const rows = {}, fls = {};
      const callTxt = { mouse: 'const { x, y } = useMouse()', search: 'const { keyword, results } = useLawyerSearch()', fav: 'const { favorites, toggleFav } = useFavorites()' };
      const fileName = { mouse: 'useMouse.ts', search: 'useLawyerSearch.ts', fav: 'useFavorites.ts' };
      const desc = { mouse: 'x, y を返す', search: 'keyword, results を返す', fav: 'favorites, toggleFav を返す' };
      KEYS.forEach((k) => {
        rows[k] = h('div', { class: 'vxW-row', 'data-k': k, style: { '--fc': FC[k] } },
          h('div', { class: 'vxW-body vxW-tag' }, FN[k], h('i', L.n(k) + '行')),
          h('div', { class: 'vxW-call' }, callTxt[k]));
        fls[k] = h('div', { class: 'vxW-fl', 'data-k': k, style: { '--fc': FC[k] } }, h('b', fileName[k]), h('span', nFile[k] + '行 · ' + desc[k]));
      });
      const badge = h('span', { class: 'vxW-badge ok' }, compLines + ' 行・呼ぶだけ');
      const comp = h('div', { class: 'vxW-file vxW-split' }, h('div', { class: 'vxW-fh' }, 'LawyerSearchPage.vue', badge), ...KEYS.map((k) => rows[k]));
      const slot = h('div', { class: 'vxW-slot' }, '別の画面（ここでも検索を使いたい）');
      const el = h('div', { style: { display: 'grid', gap: '8px', width: '100%' } },
        h('div', { class: 'vxW-fold' }, h('div', { class: 'vxW-top' }, '📁 src/pages/'), comp, slot),
        h('div', { class: 'vxW-fold' }, h('div', { class: 'vxW-top' }, '📁 src/composables/'), h('div', { class: 'vxW-files' }, ...KEYS.map((k) => fls[k]))));
      const clearSlot = () => { slot.className = 'vxW-slot'; slot.replaceChildren('別の画面（ここでも検索を使いたい）'); };
      const reset = () => { clearSlot(); comp.classList.add('vxW-split'); badge.textContent = compLines + ' 行・呼ぶだけ'; badge.className = 'vxW-badge ok'; KEYS.forEach((k) => fls[k].classList.remove('off')); };
      const extract = async () => {
        clearSlot();
        comp.classList.remove('vxW-split'); badge.textContent = leftN + ' 行・3 機能が混在'; badge.className = 'vxW-badge';
        KEYS.forEach((k) => fls[k].classList.add('off'));
        ctx.banner('機能ごとに、部品の外へ持ち出す', 'warn');
        await ctx.sleep(500);
        for (const k of KEYS) {
          const fly = ctx.fly(rows[k], fls[k], fileName[k], FC[k]);
          await ctx.sleep(500);
          rows[k].classList.add('vxW-flip'); fls[k].classList.remove('off'); ctx.bump(fls[k]);
          await fly;
        }
        comp.classList.add('vxW-split'); badge.textContent = compLines + ' 行・呼ぶだけ'; badge.className = 'vxW-badge ok'; ctx.bump(comp);
        ctx.banner('部品に残るのは「呼ぶ」行だけ。中身は composables/ へ', 'ok');
      };
      const reuse = async () => {
        reset();
        await ctx.fly(fls.search, slot, 'import 1 行', '#2fd4a4');
        slot.className = 'vxW-slot has';
        slot.replaceChildren(h('div', { class: 'vxW-fh' }, 'CaseSearchPage.vue（別の画面）', h('span', { class: 'vxW-badge ok' }, '1 行')), h('div', { class: 'vxW-line' }, 'const { keyword, results } = useLawyerSearch()'));
        ctx.bump(slot);
      };
      return { el, reset, extract, reuse };
    };

    /* ---------- メリット 3 つ（ライブの数字つき） ---------- */
    const merits = () => {
      const tokMerit = {
        read: { l: allTok, r: ['const { x, y }', 'const { keyword', 'const { favorites'] },
        reuse: { l: allTok, r: TOK.search },
        test: { l: TOK.search, r: ['export const use'] },
      };
      const box = (key, title, ...kids) => {
        const d = h('div', { class: 'vxW-m' }, h('b', title), ...kids);
        d.addEventListener('mouseenter', () => { if (!C) return; C.hi('without', tokMerit[key].l); C.hi('with', tokMerit[key].r); });
        d.addEventListener('mouseleave', () => { if (!C) return; C.hi('without', null); C.hi('with', null); });
        return d;
      };
      meritEls.copyL = h('strong', '0'); meritEls.fixL = h('strong', '—');
      meritEls.testOut = h('span', { class: 'vxW-res' });
      const tbtn = h('button', { class: 't', type: 'button', onclick: () => {
        const toggle = (list, id) => (list.includes(id) ? list.filter((v) => v !== id) : [...list, id]);
        const a = toggle([], 3), b = toggle(a, 3);
        meritEls.testOut.textContent = '✓ toggleFav(3) → ' + JSON.stringify(a) + ' → ' + JSON.stringify(b);
      } }, '▶ 関数だけで試す');
      return h('div', { class: 'vxW-merits' },
        box('read', '① 読みやすい',
          h('div', h('em', '左'), h('strong', leftN + ' 行'), '・3 機能が 1 ファイル'),
          h('div', h('em', { class: 'ok' }, '右'), h('strong', Math.max(...KEYS.map((k) => nFile[k] - 2)) + ' 行まで'), '・1 ファイル 1 機能')),
        box('reuse', '② 再利用（コピー 0）',
          h('div', h('em', '左'), '別画面にコピー ', meritEls.copyL, ' 行・直す所 ', meritEls.fixL),
          h('div', h('em', { class: 'ok' }, '右'), 'コピー ', h('strong', '0'), ' 行・直す所 ', h('strong', '1 か所'))),
        box('test', '③ テストしやすい',
          h('div', h('em', '左'), '画面ごと動かさないと試せない'),
          h('div', h('em', { class: 'ok' }, '右'), '関数だけで試せる ', tbtn), meritEls.testOut));
    };
    function upd() {
      if (!meritEls.copyL) return;
      meritEls.copyL.textContent = st.copied;
      meritEls.fixL.textContent = st.copied ? '2 か所' : '—';
    }

    const REF = [{ title: '公式：コンポーザブル', icon: 'book-open', html: '<div style="display:grid;gap:8px"><a href="https://ja.vuejs.org/guide/reusability/composables.html" target="_blank" rel="noopener"><b>コンポーザブル（Vue.js 公式ガイド）</b></a><span style="font-size:.85rem;opacity:.8">状態を持つロジックを関数にして再利用する、その書き方と決まり。</span></div>' }];

    const scene = {
      t: TITLE, tag: 'WHY', ref: REF,
      lead: 'Composition ＝ 機能ごとに組み立てる。<b>composable</b>（<code>useXxx</code>）に切り出すと、<b>再利用</b>できる。',
      render(el) {
        C = null; st.copied = 0;
        const cfg = {
          banner: '1つのコンポーネントに、機能が全部混ざる。別の画面でも使いたいけど、コピーするしかない…',
          neutral: false,
          bar: [
            { label: '▶ 別の画面でも検索を使いたい', primary: true, onclick: async (ctx) => {
              ctx.banner('別の画面にも検索がほしい…', 'warn');
              await Promise.all([ctx.ui.without.copy(), ctx.ui.with.reuse()]);
              ctx.banner('左：不要な 2 機能もついてくる／直すとき 2 か所。右：1 行 import するだけ', 'ok');
            } },
            { label: '機能を切り出すところを見る', onclick: (ctx) => ctx.ui.with.extract() },
            { label: '⟲ 最初から', ghost: true, onclick: (ctx) => { ctx.reset(); } },
          ],
          without: { title: 'ない場合：1 ファイルに 3 機能', file: 'LawyerSearchPage.vue', lang: 'vue', src: L.src, ui: leftUi, keys: keysCfg, fold: false },
          with: {
            title: 'ある場合：機能ごとに composable へ', file: 'LawyerSearchPage.vue ＋ composables/', lang: 'ts', src: R.src, ui: rightUi, keys: keysCfg,
            show: ['useMouse', 'useLawyerSearch', 'useFavorites', 'return {'],
          },
        };
        const root = K.vs.versus(cfg);
        /* コードの左端に、機能ごとの色の帯をつける */
        const pres = root.querySelectorAll('pre.code');
        [[pres[0], L.tag], [pres[1], R.tag]].forEach(([pre, tags]) => {
          if (!pre || !pre.lines) return;
          pre.lines.forEach((ln, i) => { const f = tags[i]; if (f) { ln.style.boxShadow = 'inset 4px 0 0 ' + FC[f]; ln.style.paddingLeft = '8px'; } });
        });
        /* ホバーで光った行が見えない位置にあれば、コード欄をそこまでスクロールする */
        root.addEventListener('mouseover', () => setTimeout(() => {
          [pres[0], pres[1]].forEach((pre) => {
            const box = pre && pre.closest('.vs-code'), ln = pre && pre.lines && pre.lines.find((l) => l.classList.contains('on'));
            if (box && ln && (ln.offsetTop < box.scrollTop || ln.offsetTop > box.scrollTop + box.clientHeight - 40)) box.scrollTop = Math.max(0, ln.offsetTop - 60);
          });
        }, 0));
        const wrap = h('div', { style: { display: 'grid', gap: '14px' } }, root, merits());
        upd();
        el.append(wrap);
      },
    };

    /* ---------- 先頭に差し込む（二重に入れない） ---------- */
    let n = 0;
    (function go() {
      const les = K.lessons['x-vue-composables'];
      if (les && les.scenes && !les.scenes.some((s) => s.t === TITLE)) les.scenes.unshift(scene);
      if (++n < 120) setTimeout(go, 100);
    })();

    /* ---------- 用語 ---------- */
    K.sceneTerms = K.sceneTerms || {};
    const T = [
      ['composable', 'コンポーザブル', '状態を持つロジックを関数にして、部品の外へ切り出したもの。', '「この処理、composable に切り出しませんか？」'],
      ['Composition API', 'コンポジション・エーピーアイ', '機能ごとにロジックを組み立てる Vue の書き方（script setup はこれ）。', '「コンポジション API で書いています」'],
      ['関心の分離', 'かんしんのぶんり', '機能（関心ごと）ごとにコードを分けて、混ぜない考え方。', '「関心の分離ができていないので、読みにくい」'],
      ['再利用', 'さいりよう', '同じ処理を、コピーせずに別の画面でも使うこと。', '「検索ロジックは再利用できる形にしましょう」'],
      ['ロジック', 'ロジック', '画面の見た目ではなく、データを扱う処理のこと。', '「見た目とロジックを分けたい」'],
      ['useXxx 命名', 'ユーズ〜めいめい', 'composable の名前は use で始める決まり（useMouse など）。', '「ユーズ マウス」「命名は use から始めて」'],
      ['状態を持つ関数 vs ただの関数', 'じょうたいをもつかんすう', 'composable は ref などの状態を持って返す。ただの関数は入力→出力だけ。', '「それは composable？ただのユーティリティ関数？」'],
      ['肥大化したコンポーネント', 'ひだいか〜', '機能が増えて、1ファイルが長く複雑になった状態。', '「このコンポーネント、肥大化してますね」'],
      ['テストしやすさ', 'テストしやすさ', '画面を開かず、関数だけで動作を確認できること。', '「composable にすればテストしやすい」'],
    ];
    K.sceneTerms[TITLE] = T.map((x) => ({ k: x[0], y: x[1], m: x[2], r: x[3] }));
    let gt = 0;
    (function addGloss() {
      if (K.glossAdd && K.glossEntry) {
        const add = T.filter((x) => !K.glossEntry(x[0], 'word')).map((x) => ({ k: x[0], kind: 'word', m: x[2], r: x[3], y: x[1], t: '用語' }));
        if (add.length) K.glossAdd(add);
      } else if (++gt < 100) setTimeout(addGloss, 100);
    })();
  }
})();
