/* 解剖図の検証:  node js/verify-anat.js
   ・parts のキーがすべて tokens のどこかで使われている / tokens が使うキーはすべて parts にある
   ・シーン名が実在する（typescript.js / extra-ts.js の t: '…'）
   ・説明は1文（60文字以内）、parts は 3〜8 個 */
const fs = require('fs'), path = require('path');
global.window = { KENSHU: { W: { h: () => ({}), style: () => {} } } };
const K = window.KENSHU;
const dir = __dirname;
(0, eval)(fs.readFileSync(path.join(dir, 'ts-anat-core.js'), 'utf8'));
const files = fs.readdirSync(dir).filter((f) => /^ts-anat-[a-z0-9]+\.js$/.test(f) && !/core|apply/.test(f)).sort();
files.forEach((f) => (0, eval)(fs.readFileSync(path.join(dir, f), 'utf8')));
const src = ['lessons/typescript.js', 'lessons/extra-ts.js', 'ts-split.js'].map((f) => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
let bad = 0, n = 0;
Object.entries(K.tsAnatSpecs).forEach(([t, s]) => {
  n++;
  const err = (m) => { bad++; console.log('✖', t, '—', m); };
  if (!src.includes("t: '" + t + "'") && !src.includes("'" + t + "'")) err('シーン名が見つからない');
  const keys = Object.keys(s.parts);
  const used = new Set(); s.tokens.forEach(([, ks]) => ks.forEach((k) => used.add(k)));
  keys.forEach((k) => { if (!used.has(k)) err('parts のキー ' + k + ' が tokens で使われていない'); });
  used.forEach((k) => { if (!s.parts[k]) err('tokens のキー ' + k + ' が parts に無い'); });
  if (keys.length < 3 || keys.length > 8) err('parts は 3〜8 個（今 ' + keys.length + '）');
  keys.forEach((k) => { const d = s.parts[k]; if (d.length !== 3) err(k + ': [名前, 色, 説明] の3つ'); else if (d[2].length > 60) err(k + ': 説明が長い（' + d[2].length + '字）'); });
  const text = s.tokens.map((x) => x[0]).join('');
  if (text.length > 170) err('コードが長すぎる（' + text.length + '字）');
});
console.log('--- 解剖図:', n, '件 / NG:', bad);
process.exit(bad ? 1 : 0);
