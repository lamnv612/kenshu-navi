/* 上級ミッションの検証:  node js/drills/verify-adv.js
   各 K.drillAdv について
     ・最初のコード（starter + 上級の足場）→ 上級は「未達成」になる
     ・答え（solution + 上級の答え）→ 上級は「達成」になる   （エラー0・console.log あり として評価）
   を確かめる。ブラウザの TS チェックは動かせないので、errors は空として扱う。 */
const fs = require('fs'), path = require('path');
global.window = { KENSHU: {} };
const K = window.KENSHU;
const dir = __dirname;
const run = (f) => (0, eval)(fs.readFileSync(path.join(dir, f), 'utf8'));
['ts.js'].forEach(run);
// 追加前の元の状態を控える
const orig = {};
Object.entries(K.drills).forEach(([l, m]) => Object.entries(m).forEach(([t, d]) => { orig[l + '|' + t] = { code: d.files[0].code, solution: d.solution }; }));
run('ts-adv-core.js');
const files = fs.readdirSync(dir).filter((f) => /^ts-adv-[a-z0-9]+\.js$/.test(f) && f !== 'ts-adv-core.js').sort();
files.forEach(run);
let bad = 0, n = 0, missing = 0;
const lv3 = {};
Object.entries(K.drills).forEach(([l, m]) => Object.entries(m).forEach(([t, d]) => {
  if (!d.__adv) return;
  n++;
  const o = orig[l + '|' + t];
  const mk = (code) => ({ 'main.ts': code });
  const ok0 = d.tasks(mk(d.files[0].code), { errors: [], logs: [] }).filter((x) => x.level === 3)[0];
  const ok1 = d.tasks(mk(d.solution), { errors: [], logs: [{ k: 'l', t: 'x' }] });
  const t1 = ok1.filter((x) => x.level === 3)[0];
  const all = ok1.every((x) => x.ok);
  if (!ok0 || ok0.ok) { bad++; console.log('✖ 最初から達成になっている:', l, t); }
  if (!t1 || !t1.ok) { bad++; console.log('✖ 答えでも未達成:', l, t); }
  if (!all) { console.log('△ 答えで他のミッションが未達成（元の仕様の可能性）:', l, t, ok1.filter((x) => !x.ok).map((x) => x.level).join(',')); }
  lv3[t] = 1;
}));
const want = [];
Object.entries(K.drills).forEach(([l, m]) => Object.entries(m).forEach(([t, d]) => {
  const lv = d.tasks(mk0(d.files[0].code), { errors: [], logs: [] }).map((x) => x.level);
  if (!lv.includes(3)) want.push(l + ' | ' + t);
}));
function mk0(c) { return { 'main.ts': c }; }
console.log('--- 上級を足したシーン:', n, '/ 検証NG:', bad);
if (want.length) { console.log('--- まだ上級が無いシーン:'); want.forEach((w) => console.log('  ' + w)); }
process.exit(bad ? 1 : 0);
