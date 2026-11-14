/* この回の練習：TypeScript 系（シーンごとに2〜3問）。KENSHU.drills[レッスンID][シーン名] */
(function () {
  const D = (window.KENSHU.drills = window.KENSHU.drills || {});
  const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  const mk = (code, solution, tasks, height) => ({
    mode: 'ts', height: height || 250,
    files: [{ name: 'main.ts', lang: 'ts', code }],
    solution,
    tasks: (v, c) => tasks(strip(v['main.ts'] || ''), c || { errors: [], logs: [] }, v['main.ts'] || ''),
  });
  const clean = (c) => c.errors.length === 0;
  const errAt = (raw, c, re) => c.errors.some((e) => re.test(raw.split('\n')[e.line - 1] || ''));
  const count = (s, re) => (s.match(re) || []).length;

  // テスト用の小さな道具（ブラウザ内の簡易 describe / it / expect）
  const HELP = `function describe(name: string, fn: () => void): void { console.log(name); fn(); }
function it(name: string, fn: () => void): void { fn(); console.log("OK: " + name); }
function expect(v: unknown) {
  return {
    toBe(x: unknown): void { if (v !== x) throw new Error("期待: " + String(x) + " 実際: " + String(v)); },
    toEqual(x: unknown): void { if (JSON.stringify(v) !== JSON.stringify(x)) throw new Error("一致しません"); },
  };
}
`;

  /* ================= ts-intro ================= */
  D['ts-intro'] = {
    'そのバグ、どこで見つかる？': mk(
`function add(a: number, b: number): number {
  return a + b;
}

console.log(add("1", 2)); // 赤線：書いた瞬間に分かる
`,
`function add(a: number, b: number): number {
  return a + b;
}

console.log(add(1, 2));

function double(n: number): number {
  return n * 2;
}
console.log(double(4));
`,
      (s, c) => [
        { level: 1, label: '赤線を消す（add に数字を2つ渡す）', ok: /add\(\s*1\s*,\s*2\s*\)/.test(s) && !/add\(\s*["']1["']/.test(s) && clean(c), hint: ['"1" は文字列。数字の 1 に直そう。'] },
        { level: 2, label: '関数 double(n: number): number を作り、double(4) を呼ぶ（赤線なし）', ok: /function\s+double\s*\(\s*n\s*:\s*number\s*\)\s*:\s*number/.test(s) && /double\(\s*\d+\s*\)/.test(s.replace(/function\s+double\s*\([^)]*\)/, '')) && clean(c), hint: ['n * 2 を return する。'] },
      ]),
    'TS は JS に変換される': mk(
`const price: number = 100;
function tax(p: number): number {
  return p * 1.1;
}
console.log(tax(price));

// tsc が出す JS（型を消したもの）を、下の文字列に書いてみよう
const js = \`\`;
`,
`const price: number = 100;
function tax(p: number): number {
  return p * 1.1;
}
console.log(tax(price));

const js = \`const price = 100;
function tax(p) {
  return p * 1.1;
}
console.log(tax(price));\`;
`,
      (s, c) => {
        const m = s.match(/const\s+js\s*=\s*`([\s\S]*?)`/);
        const t = m ? m[1] : '';
        return [
          { level: 1, label: 'js に、型を消した tax 関数を書く（function tax(p) …、": number" は無し）', ok: /function\s+tax\s*\(\s*p\s*\)/.test(t) && !/:\s*number/.test(t) && clean(c), hint: ['型の部分（: number）をぜんぶ消す。'] },
          { level: 2, label: 'js に const price = 100 も書く（型なし）', ok: /const\s+price\s*=\s*100/.test(t) && !/:\s*number/.test(t) && /function\s+tax\s*\(\s*p\s*\)/.test(t), hint: ['const price: number = 100 から ": number" を消す。'] },
        ];
      }),
  };

  /* ================= ts-basic ================= */
  D['ts-basic'] = {
    '型アノテーションの読み方': mk(
`// 申込フォームの値。3つとも「変数名: 型」の形に書き足そう
let age = 20;
let name = "田中";
let agree = true;

console.log(name + "さんは来年 " + (age + 1) + " 歳");
`,
`let age: number = 20;
let name: string = "田中";
let agree: boolean = true;
let tags: string[] = ["相談", "予約"];

console.log(name + "さんは来年 " + (age + 1) + " 歳");
`,
      (s, c) => [
        { level: 1, label: 'age に number、name に string の型を付ける', ok: /let\s+age\s*:\s*number/.test(s) && /let\s+name\s*:\s*string/.test(s) && clean(c), hint: ['let age: number = 20;', '「変数名: 型」の順番。'] },
        { level: 2, label: 'agree に boolean を付け、文字列の配列 tags: string[] も作る', ok: /let\s+agree\s*:\s*boolean/.test(s) && /let\s+tags\s*:\s*string\s*\[\s*\]\s*=\s*\[/.test(s) && clean(c), hint: ['string[] は「文字列の配列」。tags は相談の分類を入れる想定。'] },
      ], 220),
    '型の箱に値を入れよう': mk(
`// フォームから届いた値は、いつも「文字」
const peopleText: string = "3";
const people: number = peopleText;   // 赤線：文字は number の箱に入らない
const agree: boolean = "true";       // 赤線：boolean は true / false だけ

console.log(people + 2, agree);
`,
`const peopleText: string = "3";
const people: number = Number(peopleText);
const agree: boolean = true;

console.log(people + 2, agree);
`,
      (s, c, raw) => [
        { level: 1, label: 'people の赤線を直す（文字 "3" を数字にして number の箱へ：Number(…)）', ok: /const\s+people\s*:\s*number\s*=\s*Number\s*\(\s*peopleText\s*\)/.test(s) && !errAt(raw, c, /const\s+people\b/), hint: ['Number("3") は数字の 3 になる。', 'const people: number = Number(peopleText);'] },
        { level: 2, label: 'agree の赤線を直す（boolean の箱には true / false）', ok: /const\s+agree\s*:\s*boolean\s*=\s*(true|false)\b/.test(s) && clean(c), hint: ['"true" の引用符を外すと、文字ではなく真偽値になる。'] },
      ], 220),
    'const / let と型推論': mk(
`const TAX_RATE = 0.1;                 // 消費税率：ずっと同じ
let total = 0;                        // カートの合計：足していく
const prices = [1200, 800, 2500];

TAX_RATE = 0.08;                      // 赤線：const は入れ直せない

console.log(total, TAX_RATE);
`,
`const TAX_RATE = 0.1;
let total = 0;
const prices = [1200, 800, 2500];

for (let i = 0; i < prices.length; i++) {
  total += prices[i];
}

const cart: { items: string[] } = { items: [] };
cart.items.push("相談 30分");

console.log(Math.round(total * (1 + TAX_RATE)), cart.items);
`,
      (s, c) => [
        { level: 1, label: 'TAX_RATE の赤線を消す（const のまま、入れ直す行をやめる）', ok: /const\s+TAX_RATE\b/.test(s) && !/(^|\n)\s*TAX_RATE\s*=[^=]/.test(s) && clean(c), hint: ['変わらない値は const。入れ直す行を消せば赤線も消える。'] },
        { level: 2, label: 'for で prices をぜんぶ total に足す（total += …、total は let のまま）', ok: /let\s+total\b/.test(s) && /\bfor\s*\(/.test(s) && /total\s*\+=/.test(s) && clean(c), hint: ['足していく値だから let。for (let i = 0; i < prices.length; i++) { total += prices[i]; }'] },
        { level: 3, label: 'const cart = { items: [] } を作り、cart.items.push(…) で足す（const でも中身は変えられる）', ok: /const\s+cart\b/.test(s) && /cart\.items\.push\s*\(/.test(s) && !/(^|\n)\s*cart\s*=[^=]/.test(s) && clean(c), hint: ['const が守るのは箱そのもの。中身を足すのは OK。', 'const cart: { items: string[] } = { items: [] };'] },
      ], 260),
    '型推論：どこまで書く？': mk(
`// 請求書の小計。引数の型が無い（赤線）、中の変数は書きすぎ
function subtotal(price, qty) {
  const sum: number = price * qty;
  return sum;
}

console.log(subtotal(1000, 3));
`,
`function subtotal(price: number, qty: number): number {
  const sum = price * qty;
  return sum;
}

console.log(subtotal(1000, 3));
`,
      (s, c) => [
        { level: 1, label: '引数に型を書く（price: number, qty: number）', ok: /function\s+subtotal\s*\(\s*price\s*:\s*number\s*,\s*qty\s*:\s*number\s*\)/.test(s) && clean(c), hint: ['引数は外から来る値。TS は推論できないので、必ず書く。'] },
        { level: 2, label: '戻り値に : number を書き、中の sum には型を書かない（推論に任せる）', ok: /function\s+subtotal\s*\([^)]*\)\s*:\s*number/.test(s) && /const\s+sum\s*=/.test(s) && clean(c), hint: ['const sum = price * qty; だけで number と分かる。'] },
      ], 220),
    '配列・タプル・オブジェクト': mk(
`const lawyers: string[] = ["田中", "山本"];
const row: [string, number, boolean] = ["離婚相談", 3000, true];

interface Consultation {
  title: string;
  fee: number;
}
const c: Consultation = { title: "相続の相談" };   // 赤線：fee が無い

console.log(lawyers, row, c);
`,
`const lawyers: string[] = ["田中", "山本"];
lawyers.push("鈴木");
const row: [string, number, boolean] = ["離婚相談", 3000, true];
const range: [number, number] = [1000, 5000];

interface Consultation {
  title: string;
  fee: number;
}
const c: Consultation = { title: "相続の相談", fee: 3000 };

console.log(lawyers, row, range, c);
`,
      (s, c) => [
        { level: 1, label: 'c の赤線を直す（fee も入れる）', ok: /const\s+c\s*:\s*Consultation\s*=\s*\{[^}]*title\s*:\s*["'][^"']*["'][^}]*fee\s*:\s*\d+[^}]*\}|const\s+c\s*:\s*Consultation\s*=\s*\{[^}]*fee\s*:\s*\d+[^}]*title\s*:/.test(s) && clean(c), hint: ['{ title: "相続の相談", fee: 3000 }'] },
        { level: 2, label: 'lawyers に push で名前を足し、料金の下限・上限 range: [number, number] も作る', ok: /lawyers\.push\s*\(\s*["']/.test(s) && /const\s+range\s*:\s*\[\s*number\s*,\s*number\s*\]\s*=\s*\[/.test(s) && clean(c), hint: ['タプルは「個数と順番と型」まで決まる。[1000, 5000] のように。'] },
      ], 260),
    'any と unknown': mk(
`// 外部 API の返事。何が来るか分からないので unknown で受けている
const res: unknown = JSON.parse('"田中"');
console.log(res.toUpperCase());   // 赤線：確かめる前は使えない

// 古いコードは any のまま（赤線が出ないので、間違いに気づけない）
const code: any = JSON.parse('"A-1"');
console.log(code.toLowerCase());
`,
`const res: unknown = JSON.parse('"田中"');
if (typeof res === "string") {
  console.log(res.toUpperCase());
}

const code: unknown = JSON.parse('"A-1"');
if (typeof code === "string") {
  console.log(code.toLowerCase());
}
`,
      (s, c) => [
        { level: 1, label: 'res の赤線を直す（typeof res === "string" で確かめてから使う）', ok: /typeof\s+res\s*===\s*["']string["']/.test(s) && clean(c), hint: ['if (typeof res === "string") { … } の中なら string として使える。'] },
        { level: 2, label: 'code も any をやめて unknown にし、typeof で確かめてから使う', ok: !/code\s*:\s*any/.test(s) && /code\s*:\s*unknown/.test(s) && /typeof\s+code\s*===\s*["']string["']/.test(s) && clean(c), hint: ['any は何でも通すので、確かめ忘れても赤線が出ない。unknown なら出る。'] },
      ], 260),
    '値がない型：void / undefined / null': mk(
`function findName(id: number): string | null {
  return id === 1 ? "田中" : null;   // 見つからなければ null
}
const n = findName(2);
console.log(n.length);               // 赤線：null かもしれない

interface Profile {
  name: string;
  nickname?: string;                 // あだ名は無いかも
}
const p: Profile = { name: "田中" };
console.log(p.nickname.length);      // 赤線：undefined かもしれない
`,
`function findName(id: number): string | null {
  return id === 1 ? "田中" : null;
}
const n = findName(2);
if (n !== null) {
  console.log(n.length);
}

interface Profile {
  name: string;
  nickname?: string;
}
const p: Profile = { name: "田中" };
if (p.nickname !== undefined) {
  console.log(p.nickname.length);
}
`,
      (s, c) => [
        { level: 1, label: 'n の赤線を直す（null でないときだけ n.length を使う）', ok: /(n\s*!==?\s*null|null\s*!==?\s*n)/.test(s) && clean(c) || (/(n\s*!==?\s*null)/.test(s) && !errAt(s, c, /n\.length/)), hint: ['if (n !== null) { console.log(n.length); }'] },
        { level: 2, label: 'p.nickname の赤線を直す（undefined でないときだけ使う）', ok: /p\.nickname\s*!==?\s*undefined|undefined\s*!==?\s*p\.nickname|\bif\s*\(\s*p\.nickname\s*\)/.test(s) && clean(c), hint: ['? が付いた項目は undefined かもしれない。if で確かめてから使う。'] },
      ], 300),
  };

  /* ================= ts-types ================= */
  D['ts-types'] = {
    'Union：どれか1つ': mk(
`type Id = string | number;
let id: Id = 1;
id = true; // 赤線：boolean は Id に入らない

function show(x: Id) {
  return x.toUpperCase(); // 赤線：number には無い
}
console.log(id, show("a"));
`,
`type Id = string | number;
let id: Id = 1;
id = "A-1";

function show(x: Id): string {
  if (typeof x === "string") {
    return x.toUpperCase();
  }
  return String(x);
}
console.log(id, show("a"));
`,
      (s, c) => [
        { level: 1, label: 'id への代入を直す（Id に入る値にする）', ok: !/id\s*=\s*true/.test(s) && /id\s*=\s*(["'`][^"'`]*["'`]|\d+)/.test(s), hint: ['Id は string か number。'] },
        { level: 2, label: 'show を直す（typeof x === "string" で分けてから toUpperCase）', ok: /typeof\s+x\s*===\s*["']string["']/.test(s) && clean(c), hint: ['if の中では x は string に絞り込まれる。'] },
      ]),
    'Enum：名前の付いた定数': mk(
`function setStatus(status: number) {
  console.log(status);
}
setStatus(2); // 2 って対応中？ 完了？
`,
`enum Status {
  Received,
  Reviewing,
  Done,
}
function setStatus(status: Status) {
  console.log(status);
}
setStatus(Status.Reviewing);
`,
      (s, c) => [
        { level: 1, label: '案件の状態 enum Status を作る（Received, Reviewing, Done）', ok: /enum\s+Status\s*\{[^}]*Received[^}]*Reviewing[^}]*Done[^}]*\}/.test(s) && clean(c), hint: ['enum Status { Received, Reviewing, Done }'] },
        { level: 2, label: 'setStatus の引数を Status 型にして、setStatus(Status.Reviewing) のように名前で呼ぶ', ok: /function\s+setStatus\s*\(\s*status\s*:\s*Status\b/.test(s) && /setStatus\(\s*Status\.\w+\s*\)/.test(s) && !/setStatus\(\s*\d+\s*\)/.test(s) && clean(c), hint: ['数字ではなく Status.Reviewing と書けば、読んで意味が分かる。'] },
      ], 230),
    'interface：形チェッカー': mk(
`interface Consultation {
  title: string;
  fee?: number;
}
const a: Consultation = { title: "相続の相談", fee: "3000" }; // 赤線
const b: Consultation = { fee: 500 };                          // 赤線
console.log(a, b);
`,
`interface Consultation {
  title: string;
  fee?: number;
}
const a: Consultation = { title: "相続の相談", fee: 3000 };
const b: Consultation = { title: "離婚の相談", fee: 500 };
console.log(a, b);
`,
      (s, c, raw) => [
        { level: 1, label: 'a の赤線を直す（fee は number）', ok: !/fee\s*:\s*["']/.test(s) && /const\s+a\s*:\s*Consultation/.test(s) && !errAt(raw, c, /const\s+a\b/), hint: ['"3000" ではなく 3000。? 付きなので fee は消してもよい。'] },
        { level: 2, label: 'b の赤線を直す（必須の title を足す）', ok: /const\s+b\s*:\s*Consultation\s*=\s*\{[^}]*title\s*:/.test(s) && clean(c), hint: ['title は ? が無いので必須。'] },
      ]),
    'extends と merge': mk(
`interface Consultation {
  id: number;
}
// ① Booking を、Consultation を extends して time: string を足して作る
// ② Consultation に title: string を後から足す（同じ名前をもう1つ書く）
const b: Booking = { id: 1, time: "10:00", title: "相続の相談" };
console.log(b);
`,
`interface Consultation {
  id: number;
}
interface Consultation {
  title: string;
}
interface Booking extends Consultation {
  time: string;
}
const b: Booking = { id: 1, time: "10:00", title: "相続の相談" };
console.log(b);
`,
      (s, c) => [
        { level: 1, label: 'interface Booking extends Consultation を作り、time: string を足す', ok: /interface\s+Booking\s+extends\s+Consultation\s*\{[^}]*time\s*:\s*string/.test(s), hint: ['interface Booking extends Consultation { time: string }'] },
        { level: 2, label: 'interface Consultation をもう1つ書いて title: string を足す（赤線なし）', ok: count(s, /interface\s+Consultation\b/g) >= 2 && /interface\s+Consultation\s*\{[^}]*title\s*:\s*string/.test(s.replace(/interface\s+Consultation\s*\{[^}]*id\s*:\s*number\s*;?\s*\}/, '')) && clean(c), hint: ['同じ名前の interface は自動で合体する。'] },
      ]),
    'interface vs type': mk(
`const u: User = { id: 1, role: "admin" };
console.log(u);
// オブジェクトの形は interface、「どれか」は type
`,
`type Role = "admin" | "member";
interface User {
  id: number;
  role: Role;
}
const u: User = { id: 1, role: "admin" };
console.log(u);
`,
      (s, c) => [
        { level: 1, label: 'オブジェクトの形 User を interface で作る（id: number, role）', ok: /interface\s+User\s*\{[^}]*id\s*:\s*number[^}]*role\s*:/.test(s), hint: ['interface User { id: number; role: ... }'] },
        { level: 2, label: '「"admin" か "member"」を type Role で作って、User の role に使う（赤線なし）', ok: /type\s+Role\s*=\s*["'][^"']+["']\s*\|\s*["'][^"']+["']/.test(s) && /role\s*:\s*Role\b/.test(s) && clean(c), hint: ['type Role = "admin" | "member"'] },
      ], 230),
  };

  /* ================= ts-class ================= */
  D['ts-class'] = {
    'クラス = 設計図、new = スタンプ': mk(
`// Booking クラス（name と people）を作って、new で2つ作ろう
console.log(a, b);
`,
`class Booking {
  constructor(public name: string, public people: number) {}
}
const a = new Booking("田中", 2);
const b = new Booking("佐藤", 3);
console.log(a, b);
`,
      (s, c) => [
        { level: 1, label: 'class Booking を作る（constructor で name: string, people: number を受け取る）', ok: /class\s+Booking\b/.test(s) && /constructor\s*\([^)]*name\s*:\s*string[^)]*people\s*:\s*number[^)]*\)/.test(s), hint: ['constructor(public name: string, public people: number) {}'] },
        { level: 2, label: 'new Booking(...) で a と b を作る（赤線なし）', ok: count(s, /new\s+Booking\s*\(/g) >= 2 && /const\s+a\b/.test(s) && /const\s+b\b/.test(s) && clean(c), hint: ['const a = new Booking("田中", 2);'] },
      ], 200),
    'アクセス修飾子：誰が触れる？': mk(
`class Account {
  public owner = "太郎";
  private balance = 100;
}
const acc = new Account();
console.log(acc.owner);
console.log(acc.balance); // 赤線：private は外から見えない
`,
`class Account {
  public owner = "太郎";
  private balance = 100;
  protected rank = 1;
  getBalance(): number {
    return this.balance;
  }
}
const acc = new Account();
console.log(acc.owner);
console.log(acc.getBalance());
`,
      (s, c) => [
        { level: 1, label: '赤線を直す（getBalance() を作り、acc.getBalance() で読む）', ok: /getBalance\s*\(\s*\)\s*(:\s*number\s*)?\{[^}]*this\.balance/.test(s) && /acc\.getBalance\s*\(\s*\)/.test(s) && !/acc\.balance/.test(s) && clean(c), hint: ['private は、同じクラスの中のメソッドからは触れる。'] },
        { level: 2, label: 'protected のメンバーを1つ足す（赤線なし）', ok: /protected\s+\w+/.test(s) && clean(c), hint: ['protected rank = 1;'] },
      ], 270),
    'readonly：書き換え禁止': mk(
`class User {
  constructor(readonly id: number, public name: string) {}
}
const u = new User(1, "太郎");
u.name = "次郎";
u.id = 2; // 赤線：readonly は書き換えられない
console.log(u);
`,
`class User {
  readonly createdBy: string;
  constructor(readonly id: number, public name: string) {
    this.createdBy = "admin";
  }
}
const u = new User(1, "太郎");
u.name = "次郎";
console.log(u);
`,
      (s, c) => [
        { level: 1, label: 'u.id = 2 の行を消して、赤線をなくす', ok: !/u\.id\s*=[^=]/.test(s) && /u\.name\s*=/.test(s) && clean(c), hint: ['id は readonly。name は書き換えてよい。'] },
        { level: 2, label: 'readonly の項目 createdBy を足し、constructor の中で1回だけ代入する', ok: count(s, /readonly\s+\w+/g) >= 2 && /readonly\s+createdBy/.test(s) && /this\.createdBy\s*=/.test(s) && clean(c), hint: ['readonly は constructor の中でだけ代入できる。'] },
      ], 250),
    'getter / setter：門番を置く': mk(
`class Temp {
  private _c = 0;
  // ① get celsius() で _c を返す
  // ② set celsius(v) で、-273 より小さい値は throw new Error する
}
const t = new Temp();
t.celsius = 25;
console.log(t.celsius);
`,
`class Temp {
  private _c = 0;
  get celsius(): number {
    return this._c;
  }
  set celsius(v: number) {
    if (v < -273) {
      throw new Error("低すぎます");
    }
    this._c = v;
  }
}
const t = new Temp();
t.celsius = 25;
console.log(t.celsius);
`,
      (s, c) => [
        { level: 1, label: 'get celsius() を作って _c を返す', ok: /get\s+celsius\s*\(\s*\)/.test(s) && /return\s+this\._c/.test(s), hint: ['get celsius(): number { return this._c; }'] },
        { level: 2, label: 'set celsius(v) を作り、-273 未満なら Error を投げてから _c に入れる（赤線なし）', ok: /set\s+celsius\s*\(\s*\w+\s*(:\s*number)?\s*\)\s*\{[\s\S]*?<[\s\S]*?throw[\s\S]*?this\._c\s*=/.test(s) && clean(c), hint: ['検査 → OK なら代入、の順。'] },
      ], 300),
    '継承：親から子へ': mk(
`class Booking {
  constructor(public name: string) {}
  describe(): string {
    return this.name + " さんの予約";
  }
}
// SeminarBooking を Booking の子にして、describe を上書きしよう
const s1 = new SeminarBooking("田中");
console.log(s1.describe());
`,
`class Booking {
  constructor(public name: string) {}
  describe(): string {
    return this.name + " さんの予約";
  }
}
class SeminarBooking extends Booking {
  describe(): string {
    return this.name + " さんのセミナー予約";
  }
}
const s1 = new SeminarBooking("田中");
console.log(s1.describe());
`,
      (s, c) => [
        { level: 1, label: 'class SeminarBooking extends Booking を作る', ok: /class\s+SeminarBooking\s+extends\s+Booking/.test(s), hint: ['class SeminarBooking extends Booking { }'] },
        { level: 2, label: 'SeminarBooking の中で describe() を書いて上書きする（赤線なし）', ok: count(s, /describe\s*\(\s*\)\s*(:\s*string\s*)?\{/g) >= 2 && clean(c), hint: ['親と同じ名前のメソッドを書けば、子のほうが使われる。'] },
      ], 280),
    'super()：親を呼ぶ': mk(
`class Booking {
  constructor(public name: string) {}
}
class SeminarBooking extends Booking {
  constructor(name: string, public seats: number) {
    // ここに super を書く（赤線）
  }
}
`,
`class Booking {
  constructor(public name: string) {}
}
class SeminarBooking extends Booking {
  constructor(name: string, public seats: number) {
    super(name);
  }
}
const s1 = new SeminarBooking("田中", 10);
console.log(s1.name, s1.seats);
`,
      (s, c) => [
        { level: 1, label: 'constructor の最初の行に super(name) を書く（赤線を消す）', ok: /constructor\s*\([^)]*\)\s*\{\s*super\s*\(\s*name\s*\)/.test(s) && clean(c), hint: ['子の constructor では、super() が最初。'] },
        { level: 2, label: 'new SeminarBooking("田中", 10) を作り、name と seats を console.log する', ok: /new\s+SeminarBooking\s*\(\s*["'][^"']+["']\s*,\s*\d+\s*\)/.test(s) && /console\.log\([^)]*\.name[^)]*\.seats|console\.log\([^)]*\.seats[^)]*\.name/.test(s) && clean(c), hint: ['console.log(s1.name, s1.seats);'] },
      ], 250),
  };

  /* ================= ts-generics ================= */
  D['ts-generics'] = {
    'Box<T> マシン': mk(
`class Box {
  constructor(public value: any) {}
}
// ① Box を Box<T> にして、value の型を T にする
// ② new Box<number>(5) で作り、value を number 型の変数に入れる
`,
`class Box<T> {
  constructor(public value: T) {}
}
const b = new Box<number>(5);
const n: number = b.value;
console.log(n);
`,
      (s, c) => [
        { level: 1, label: 'class Box<T> にして、value の型を T にする', ok: /class\s+Box\s*<\s*T\s*>/.test(s) && /value\s*:\s*T\b/.test(s) && clean(c), hint: ['any の代わりに T を書く。'] },
        { level: 2, label: 'new Box<number>(5) を作り、b.value を number 型の n に入れる（赤線なし）', ok: /new\s+Box\s*<\s*number\s*>\s*\(\s*\d+\s*\)/.test(s) && /const\s+n\s*:\s*number\s*=\s*\w+\.value/.test(s) && /class\s+Box\s*<\s*T\s*>/.test(s) && clean(c), hint: ['Box<number> なら value は number。'] },
      ], 220),
    'identity<T>：入れた型が出てくる': mk(
`function identity(x: any): any {
  return x;
}
const s = identity("TS");
console.log(s.length); // any なので型の助けが無い
`,
`function identity<T>(x: T): T {
  return x;
}
const s = identity("TS");
const n: number = identity(42);
console.log(s.length, n);
`,
      (s, c) => [
        { level: 1, label: 'identity を identity<T>(x: T): T に書き換える', ok: /function\s+identity\s*<\s*T\s*>\s*\(\s*x\s*:\s*T\s*\)\s*:\s*T/.test(s) && clean(c), hint: ['any を T に置き換える。'] },
        { level: 2, label: 'const n: number = identity(42) を書く（赤線なし）', ok: /const\s+\w+\s*:\s*number\s*=\s*identity\s*(<\s*number\s*>)?\s*\(\s*\d+\s*\)/.test(s) && /identity\s*<\s*T\s*>/.test(s) && clean(c), hint: ['入れた型（number）がそのまま出てくる。'] },
      ], 230),
    'Array<T> と制約 extends': mk(
`function longest(a, b) {
  return a.length >= b.length ? a : b; // 赤線：型が無い
}
`,
`function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}
console.log(longest("abc", "de"));
console.log(longest([1, 2], [3]));
`,
      (s, c) => [
        { level: 1, label: 'longest<T extends { length: number }>(a: T, b: T): T にする（赤線なし）', ok: /function\s+longest\s*<\s*T\s+extends\s*\{\s*length\s*:\s*number\s*;?\s*\}\s*>\s*\(\s*a\s*:\s*T\s*,\s*b\s*:\s*T\s*\)\s*:\s*T/.test(s) && clean(c), hint: ['T extends { length: number } で「length を持つ型だけ」。'] },
        { level: 2, label: '文字列どうし・配列どうしの2通りで longest を呼ぶ', ok: count(s, /longest\s*\(\s*(["'`\[])/g) >= 2 && clean(c) && /extends/.test(s), hint: ['longest("abc", "de") と longest([1, 2], [3])'] },
      ], 220),
  };

  /* ================= ts-test ================= */
  D['ts-test'] = {
    'なぜテストを書くの？': mk(
`function add(a: number, b: number): number {
  return a - b; // バグ
}
// 手で確かめる代わりに、テストを書こう：
// 期待どおりでなければ throw new Error する if 文
`,
`function add(a: number, b: number): number {
  return a + b;
}
if (add(2, 3) !== 5) {
  throw new Error("add が間違っています");
}
console.log("OK");
`,
      (s, c) => [
        { level: 1, label: 'add のバグを直す（足し算にする）', ok: /return\s+a\s*\+\s*b/.test(s) && !/return\s+a\s*-\s*b/.test(s), hint: ['a - b ではなく a + b。'] },
        { level: 2, label: 'add(2, 3) が 5 でなければ throw new Error する if 文を書く', ok: /if\s*\(\s*add\s*\(\s*\d+\s*,\s*\d+\s*\)\s*!==?\s*\d+\s*\)\s*\{?\s*throw\s+new\s+Error/.test(s) && clean(c), hint: ['if (add(2, 3) !== 5) { throw new Error("…"); }'] },
      ]),
    'テストの種類': mk(
`// 速い順（安い順）に、テストの種類を並べよう
// "unit" / "integration" / "e2e"
const fastToSlow: string[] = [];
// 数がいちばん多い（ピラミッドの底）のはどれ？
const mostTests = "";
`,
`const fastToSlow: string[] = ["unit", "integration", "e2e"];
const mostTests = "unit";
console.log(fastToSlow, mostTests);
`,
      (s, c) => [
        { level: 1, label: 'fastToSlow を、速い順 "unit" → "integration" → "e2e" にする', ok: /fastToSlow\s*:\s*string\s*\[\s*\]\s*=\s*\[\s*["']unit["']\s*,\s*["']integration["']\s*,\s*["']e2e["']\s*\]/.test(s) && clean(c), hint: ['関数1つを確かめる unit がいちばん速い。'] },
        { level: 2, label: 'mostTests に、いちばん数が多い種類を入れる', ok: /mostTests\s*(:\s*string)?\s*=\s*["']unit["']/.test(s), hint: ['小さくて速いテストを、たくさん書く。'] },
      ], 200),
    'ユニットテストの流れ': mk(
`function isAdult(age: number): boolean {
  return age > 20; // 仕様：20歳以上は大人
}
console.log(isAdult(20)); // 期待は true
`,
`function isAdult(age: number): boolean {
  return age >= 20;
}
console.log(isAdult(20));
console.log(isAdult(19));
console.log(isAdult(30));
`,
      (s, c) => [
        { level: 1, label: '20歳が大人になるように直す（> を >= に）', ok: /age\s*>=\s*20/.test(s) && !/age\s*>\s*20/.test(s), hint: ['境目の値（20）を確かめたら見つかる。'] },
        { level: 2, label: '境目のテストを増やす（isAdult(19) など、合計3つ以上の呼び出し）', ok: count(s, /isAdult\s*\(\s*\d+\s*\)/g) >= 3 && clean(c), hint: ['19・20・30 のように、境目の前後を確かめる。'] },
      ], 220),
    'Vitest をセットアップ': mk(
HELP + `function double(n: number): number {
  return n * 2;
}
// ① describe("double", ...) を書く
// ② 中に it(...) を書いて、expect(double(2)).toBe(4) で確かめる
`,
HELP + `function double(n: number): number {
  return n * 2;
}
describe("double", () => {
  it("2 を 4 にする", () => {
    expect(double(2)).toBe(4);
  });
});
`,
      (s, c) => [
        { level: 1, label: 'describe("名前", () => { ... }) を書く', ok: /describe\s*\(\s*["'`][^"'`]*["'`]\s*,\s*\(\s*\)\s*=>/.test(s.replace(/function\s+describe[^\n]*\n/, '')), hint: ['describe はテストのグループ。'] },
        { level: 2, label: '中に it(...) を書き、expect(double(2)).toBe(4) で確かめる（赤線なし）', ok: /\bit\s*\(\s*["'`][^"'`]*["'`]\s*,[\s\S]*expect\s*\(\s*double\s*\(\s*\d+\s*\)\s*\)\s*\.toBe\s*\(\s*\d+\s*\)/.test(s.replace(/function\s+it[^\n]*\n/, '')) && clean(c), hint: ['expect(結果).toBe(期待) の形。'] },
      ], 330),
    'TDD：赤 → 緑 → 赤 → 緑': mk(
HELP + `function square(n: number): number {
  return 0; // まだ実装していない
}
// 赤：先にテストを書く → 緑：実装する
`,
HELP + `function square(n: number): number {
  return n * n;
}
expect(square(3)).toBe(9);
console.log("OK");
`,
      (s, c) => [
        { level: 1, label: '赤：expect(square(3)).toBe(9) のテストを先に書く', ok: /expect\s*\(\s*square\s*\(\s*\d+\s*\)\s*\)\s*\.toBe\s*\(\s*\d+\s*\)/.test(s), hint: ['実装はまだ return 0。▶ 実行 すると失敗（赤）になる。'] },
        { level: 2, label: '緑：square を実装する（n * n を返す）', ok: /return\s+(n\s*\*\s*n|n\s*\*\*\s*2)/.test(s) && clean(c), hint: ['n * n を return する。'] },
      ], 300),
    'テストの型：Arrange → Act → Assert': mk(
HELP + `function add(a: number, b: number): number {
  return a + b;
}
it("2 + 3 は 5", () => {
  expect(add(2, 3)).toBe(5);
});
// 中身を Arrange（準備）/ Act（実行）/ Assert（確認）の3ステップに分けよう
`,
HELP + `function add(a: number, b: number): number {
  return a + b;
}
it("2 + 3 は 5", () => {
  const a = 2;
  const b = 3;
  const result = add(a, b);
  expect(result).toBe(5);
});
`,
      (s, c) => {
        const body = s.replace(/function\s+(describe|it|expect)[\s\S]*?\n\}\n/g, '');
        return [
          { level: 1, label: 'Act：add を呼んだ結果を const result に入れる', ok: /const\s+\w+\s*=\s*add\s*\(/.test(body), hint: ['const result = add(a, b);'] },
          { level: 2, label: 'Assert：expect(result).toBe(5) のように、結果の変数を確かめる（赤線なし）', ok: /expect\s*\(\s*\w+\s*\)\s*\.toBe\s*\(\s*5\s*\)/.test(body) && /const\s+\w+\s*=\s*add\s*\(/.test(body) && clean(c), hint: ['expect の中は、関数の呼び出しではなく変数。'] },
        ];
      }, 330),
    'ミニテストランナー': mk(
HELP + `function isAdult(age: number): boolean {
  return age > 18; // バグ（18歳ちょうどが未成年になる）
}
it("20歳は成人", () => {
  expect(isAdult(20)).toBe(true);
});
`,
HELP + `function isAdult(age: number): boolean {
  return age >= 18;
}
it("20歳は成人", () => {
  expect(isAdult(20)).toBe(true);
});
it("17歳は未成年", () => {
  expect(isAdult(17)).toBe(false);
});
it("18歳ちょうどは成人", () => {
  expect(isAdult(18)).toBe(true);
});
`,
      (s, c) => [
        { level: 1, label: 'isAdult のバグを直す（18歳以上が成人。18 を含める）', ok: />=\s*18/.test(s) && !/>\s*18\b/.test(s.replace(/>=\s*18/g, '')), hint: ['age >= 18'] },
        { level: 2, label: 'it を もう1つ足して、18歳ちょうどのケースも確かめる（赤線なし）', ok: count(s.replace(/function\s+it\b/, ''), /\bit\s*\(\s*["'`]/g) >= 2 && /isAdult\s*\(\s*18\s*\)/.test(s) && clean(c), hint: ['expect(isAdult(18)).toBe(true);'] },
      ], 340),
    'describe / it / expect 早見表': mk(
HELP + `const user = { name: "花子", age: 20 };
// ① toBe で age が 20 だと確かめる
// ② toEqual で user 全体が { name: "花子", age: 20 } だと確かめる
`,
HELP + `const user = { name: "花子", age: 20 };
it("age", () => {
  expect(user.age).toBe(20);
});
it("user 全体", () => {
  expect(user).toEqual({ name: "花子", age: 20 });
});
`,
      (s, c) => [
        { level: 1, label: 'expect(user.age).toBe(20) を書く', ok: /expect\s*\(\s*user\.age\s*\)\s*\.toBe\s*\(\s*20\s*\)/.test(s), hint: ['数字や文字列の比較は toBe。'] },
        { level: 2, label: 'expect(user).toEqual({ ... }) を書く（赤線なし）', ok: /expect\s*\(\s*user\s*\)\s*\.toEqual\s*\(\s*\{/.test(s) && clean(c), hint: ['オブジェクトの中身を比べるときは toEqual。'] },
      ], 340),
  };

  /* ================= x-js-basics ================= */
  D['x-js-basics'] = {
    'const / let とアロー関数': mk(
`var total = 0;
function add(a: number, b: number) {
  return a + b;
}
total = add(1, 2);
console.log(total);
`,
`let total = 0;
const add = (a: number, b: number) => a + b;
total = add(1, 2);
console.log(total);
`,
      (s, c) => [
        { level: 1, label: 'var をやめて、let か const にする', ok: !/\bvar\b/.test(s) && /\b(let|const)\s+total\b/.test(s) && clean(c), hint: ['あとで変える total は let。'] },
        { level: 2, label: 'add をアロー関数 const add = (a, b) => … にする（赤線なし）', ok: /const\s+add\s*=\s*\(\s*a\s*:\s*number\s*,\s*b\s*:\s*number\s*\)\s*(:\s*number\s*)?=>/.test(s) && clean(c), hint: ['const add = (a: number, b: number) => a + b;'] },
      ], 200),
    'テンプレート・分割代入・スプレッド': mk(
`const user = { name: "太郎", age: 20 };
const nums = [1, 2];
const msg = "名前は" + user.name + "、" + user.age + "歳";
const all = [nums[0], nums[1], 3];
console.log(msg, all);
`,
`const user = { name: "太郎", age: 20 };
const nums = [1, 2];
const { name, age } = user;
const msg = \`名前は\${name}、\${age}歳\`;
const all = [...nums, 3];
console.log(msg, all);
`,
      (s, c) => [
        { level: 1, label: 'msg をテンプレートリテラル（バッククォートと ${ }）で書く', ok: /const\s+msg\s*=\s*`[^`]*\$\{[^}]+\}/.test(s) && clean(c), hint: ['`名前は${user.name}、${user.age}歳`'] },
        { level: 2, label: '分割代入 const { name, age } = user; を使う', ok: /const\s*\{\s*(name\s*,\s*age|age\s*,\s*name)\s*\}\s*=\s*user/.test(s) && clean(c), hint: ['user.name と user.age を、1行で取り出す。'] },
        { level: 3, label: 'スプレッド [...nums, 3] で all を作る', ok: /const\s+all\s*=\s*\[\s*\.\.\.nums\s*,\s*3\s*\]/.test(s) && clean(c), hint: ['... は配列の中身をその場に広げる。'] },
      ], 230),
    'map / filter / reduce': mk(
`const nums = [1, 2, 3, 4];
const doubled: number[] = [];
nums.forEach((n) => doubled.push(n * 2));
console.log(doubled);
// ① doubled を map で作る ② 偶数だけ evens（filter） ③ 合計 sum（reduce）
`,
`const nums = [1, 2, 3, 4];
const doubled = nums.map((n) => n * 2);
const evens = nums.filter((n) => n % 2 === 0);
const sum = nums.reduce((a, n) => a + n, 0);
console.log(doubled, evens, sum);
`,
      (s, c) => [
        { level: 1, label: 'doubled を nums.map(...) で作る', ok: /const\s+doubled\s*(:\s*number\s*\[\s*\])?\s*=\s*nums\.map\s*\(/.test(s) && clean(c), hint: ['map は、全部に同じ変換をかけて新しい配列を作る。'] },
        { level: 2, label: '偶数だけの evens を filter で作る', ok: /const\s+evens\s*(:[^=]+)?=\s*nums\.filter\s*\(/.test(s) && clean(c), hint: ['filter は、条件に合うものだけ残す。'] },
        { level: 3, label: '合計 sum を reduce で作る', ok: /const\s+sum\s*(:[^=]+)?=\s*nums\.reduce\s*\(/.test(s) && clean(c), hint: ['nums.reduce((a, n) => a + n, 0)'] },
      ], 230),
    'import / export': mk(
`// math.ts に書く内容
function add(a: number, b: number): number {
  return a + b;
}
const PI = 3.14;
// ① add と PI を export する
// ② 別のファイルから add を使うときの import を、下の文字列に書く
const usage = "";
`,
`// math.ts に書く内容
export function add(a: number, b: number): number {
  return a + b;
}
export const PI = 3.14;
const usage = 'import { add } from "./math";';
`,
      (s, c) => {
        const m = s.match(/const\s+usage\s*=\s*(["'`])([\s\S]*?)\1/);
        const u = m ? m[2] : '';
        return [
          { level: 1, label: 'add と PI の両方を export する', ok: (/export\s+function\s+add/.test(s) && /export\s+const\s+PI/.test(s)) || (/export\s*\{[^}]*\badd\b[^}]*\}/.test(s) && /export\s*\{[^}]*\bPI\b[^}]*\}/.test(s)), hint: ['export function add … / export const PI …'] },
          { level: 2, label: 'usage に import { add } from "./math" を書く', ok: /import\s*\{\s*[^}]*\badd\b[^}]*\}\s*from\s*["']\.\/math(\.ts)?["']/.test(u), hint: ['{ } の中が、取り出す名前。'] },
        ];
      }, 260),
  };

  /* ================= x-ts-narrow ================= */
  D['x-ts-narrow'] = {
    'どの型に何が入る？': mk(
`let a: any = 1;
let u: unknown = 1;
const n: number = u; // 赤線：unknown はそのまま入れられない
console.log(a, n);
`,
`let a: any = 1;
let u: unknown = 1;
if (typeof u === "number") {
  const n: number = u;
  console.log(n);
}
const m: number = a;
console.log(m);
`,
      (s, c) => [
        { level: 1, label: 'unknown の赤線を直す（typeof u === "number" で確かめてから入れる）', ok: /typeof\s+u\s*===\s*["']number["']/.test(s) && clean(c), hint: ['確かめた if の中なら number として扱える。'] },
        { level: 2, label: 'any の a は、そのまま const m: number = a; と入れられる（確かめ不要の危うさを体験）', ok: /const\s+m\s*:\s*number\s*=\s*a\b/.test(s) && clean(c), hint: ['any はチェックを外す。便利だが危ない。'] },
      ], 220),
    '絞り込み（narrowing）': mk(
`function len(x: string | number) {
  return x.length; // 赤線：number には length が無い
}
console.log(len("abc"), len(12));
`,
`function len(x: string | number): number {
  if (typeof x === "string") {
    return x.length;
  }
  return x.toFixed(1).length;
}
console.log(len("abc"), len(12));
`,
      (s, c) => [
        { level: 1, label: 'typeof x === "string" で分けて、string のときだけ x.length を使う', ok: /typeof\s+x\s*===\s*["']string["']/.test(s) && /x\.length/.test(s) && clean(c), hint: ['if の中では x は string に絞られる。'] },
        { level: 2, label: 'number のときは x.toFixed(1).length を返す（赤線なし）', ok: /x\.toFixed\s*\(/.test(s) && clean(c), hint: ['if のあとでは x は number に絞られる。'] },
      ], 220),
    '?. と ??': mk(
`interface User {
  name: string;
  address?: { city: string };
}
const u: User = { name: "太郎" };
const city = u.address.city; // 赤線：address は無いかも
const count: number | null = 0;
const shown = count || 10;   // 0 のときも 10 になってしまう
console.log(city, shown);
`,
`interface User {
  name: string;
  address?: { city: string };
}
const u: User = { name: "太郎" };
const city = u.address?.city;
const count: number | null = 0;
const shown = count ?? 10;
console.log(city, shown);
`,
      (s, c) => [
        { level: 1, label: 'u.address?.city にして、赤線を消す', ok: /u\.address\?\.city/.test(s) && clean(c), hint: ['?. は「無ければ undefined で止まる」。'] },
        { level: 2, label: '|| を ?? に変えて、0 を 0 のまま使う', ok: /count\s*\?\?\s*10/.test(s) && !/count\s*\|\|\s*10/.test(s) && clean(c), hint: ['?? は null / undefined のときだけ右を使う。'] },
      ], 260),
  };

  /* ================= x-ts-utility ================= */
  D['x-ts-utility'] = {
    'as const：値をそのまま型に': mk(
`const COLORS = ["red", "green"];
type Color = typeof COLORS[number]; // string になってしまう
const c: Color = "blue";            // 通ってしまう
console.log(c);
`,
`const COLORS = ["red", "green"] as const;
type Color = typeof COLORS[number];
const c: Color = "red";
console.log(c);
`,
      (s, c) => [
        { level: 1, label: 'COLORS の最後に as const を付ける', ok: /\]\s*as\s+const/.test(s), hint: ['const COLORS = [...] as const;'] },
        { level: 2, label: 'Color が "red" | "green" になる。c を "red" か "green" にして赤線なし', ok: /\]\s*as\s+const/.test(s) && /const\s+c\s*:\s*Color\s*=\s*["'](red|green)["']/.test(s) && clean(c), hint: ['"blue" は Color に入らなくなる（typo を防げる）。'] },
      ], 200),
    'ユーティリティ型': mk(
`interface User {
  id: number;
  name: string;
  email: string;
}
// ① Partial で、全部省略できる型 UserPatch
// ② Pick で、id と name だけの型 UserLabel
// ③ Omit で、email を除いた型 PublicUser
`,
`interface User {
  id: number;
  name: string;
  email: string;
}
type UserPatch = Partial<User>;
type UserLabel = Pick<User, "id" | "name">;
type PublicUser = Omit<User, "email">;
`,
      (s, c) => [
        { level: 1, label: 'type UserPatch = Partial<User>', ok: /type\s+UserPatch\s*=\s*Partial\s*<\s*User\s*>/.test(s) && clean(c), hint: ['Partial は、全部のプロパティを ? 付きにする。'] },
        { level: 2, label: 'type UserLabel = Pick<User, "id" | "name">', ok: /type\s+UserLabel\s*=\s*Pick\s*<\s*User\s*,\s*["'](id|name)["']\s*\|\s*["'](id|name)["']\s*>/.test(s) && clean(c), hint: ['Pick は、選んだキーだけ残す。'] },
        { level: 3, label: 'type PublicUser = Omit<User, "email">', ok: /type\s+PublicUser\s*=\s*Omit\s*<\s*User\s*,\s*["']email["']\s*>/.test(s) && clean(c), hint: ['Omit は、選んだキーを除く。'] },
      ], 230),
    '組み合わせ：権限チェック': mk(
`type Role = "admin" | "editor" | "viewer";
// ① Role ごとに boolean を持つ Record<Role, boolean> の CAN_EDIT を作る
// ② canEdit(role: Role) で CAN_EDIT[role] を返す
`,
`type Role = "admin" | "editor" | "viewer";
const CAN_EDIT: Record<Role, boolean> = {
  admin: true,
  editor: true,
  viewer: false,
};
function canEdit(role: Role): boolean {
  return CAN_EDIT[role];
}
console.log(canEdit("viewer"));
`,
      (s, c) => [
        { level: 1, label: 'CAN_EDIT: Record<Role, boolean> を作り、3つの Role すべてを書く（赤線なし）', ok: /const\s+CAN_EDIT\s*:\s*Record\s*<\s*Role\s*,\s*boolean\s*>\s*=\s*\{/.test(s) && /admin\s*:/.test(s) && /editor\s*:/.test(s) && /viewer\s*:/.test(s) && clean(c), hint: ['1つ書き忘れると、赤線で教えてくれる。'] },
        { level: 2, label: 'canEdit(role: Role) が CAN_EDIT[role] を返す（赤線なし）', ok: /function\s+canEdit\s*\(\s*role\s*:\s*Role\s*\)[^{]*\{\s*return\s+CAN_EDIT\s*\[\s*role\s*\]/.test(s) && /Record\s*<\s*Role/.test(s) && clean(c), hint: ['return CAN_EDIT[role];'] },
      ], 260),
  };

  /* ================= x-ts-naming ================= */
  D['x-ts-naming'] = {
    '4つの書き方': mk(
`const user_name = "太郎";            // 変数 → camelCase
class user_account {}              // クラス → PascalCase
const maxRetryCount = 3;           // 定数 → UPPER_SNAKE_CASE
const fileName = "UserAccount.ts"; // ファイル名 → kebab-case
console.log(user_name, new user_account(), maxRetryCount, fileName);
`,
`const userName = "太郎";
class UserAccount {}
const MAX_RETRY_COUNT = 3;
const fileName = "user-account.ts";
console.log(userName, new UserAccount(), MAX_RETRY_COUNT, fileName);
`,
      (s, c) => [
        { level: 1, label: '変数 user_name を camelCase（userName）にする', ok: /const\s+userName\b/.test(s) && !/user_name/.test(s) && clean(c), hint: ['使っている所もぜんぶ直す。'] },
        { level: 2, label: 'クラス user_account を PascalCase（UserAccount）にする', ok: /class\s+UserAccount\b/.test(s) && !/user_account\b(?!\.)/.test(s.replace(/["'][^"']*["']/g, '')) && clean(c), hint: ['クラス名は、頭も大文字。'] },
        { level: 3, label: '定数を MAX_RETRY_COUNT に、ファイル名を "user-account.ts" にする', ok: /const\s+MAX_RETRY_COUNT\s*=\s*3/.test(s) && /["']user-account\.ts["']/.test(s) && clean(c), hint: ['定数は大文字とアンダースコア、ファイルはハイフン。'] },
      ], 230),
    '名前をつけよう': mk(
`const d = [1, 2, 3];
function f(x: number): boolean {
  return x > 20;
}
const flag = true;
console.log(d, f(25), flag);
`,
`const scores = [1, 2, 3];
function isAdult(age: number): boolean {
  return age > 20;
}
const isActive = true;
console.log(scores, isAdult(25), isActive);
`,
      (s, c) => [
        { level: 1, label: '配列 d を、複数形の分かる名前（scores など）にする', ok: /const\s+(?!d\b)([a-z]\w{3,})\s*=\s*\[\s*1\s*,\s*2\s*,\s*3\s*\]/.test(s) && (/const\s+\w+(s|List|Items)\s*=\s*\[\s*1/.test(s)) && clean(c), hint: ['複数入っているなら、複数形（〜s）か 〜List。'] },
        { level: 2, label: '関数 f を isAdult など、is / has / can で始まる名前にする', ok: /function\s+(is|has|can)[A-Z]\w*\s*\(/.test(s) && !/function\s+f\b/.test(s) && clean(c), hint: ['true / false を返す関数は、is〜 と読める名前に。'] },
        { level: 3, label: 'flag を isActive など、is / has / can で始まる名前にする', ok: /const\s+(is|has|can)[A-Z]\w*\s*=\s*true/.test(s) && !/\bflag\b/.test(s) && clean(c), hint: ['flag だと「何の？」が分からない。'] },
      ], 230),
  };

  /* ================= x-async ================= */
  D['x-async'] = {
    '待っている間、何が動く？': mk(
`console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve(0).then(() => console.log("C"));
console.log("D");

// 画面に出る順番を、配列で答えよう
const order: string[] = [];
`,
`console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve(0).then(() => console.log("C"));
console.log("D");

const order: string[] = ["A", "D", "C", "B"];

async function run() {
  await Promise.resolve(1);
  console.log("done");
}
run();
`,
      (s, c) => [
        { level: 1, label: 'order に、出力の順番を入れる（["A", …]）', ok: /const\s+order\s*:\s*string\s*\[\s*\]\s*=\s*\[\s*["']A["']\s*,\s*["']D["']\s*,\s*["']C["']\s*,\s*["']B["']\s*\]/.test(s) && clean(c), hint: ['同期の A・D → Promise の C → setTimeout の B。'] },
        { level: 2, label: 'async function run() を作り、中で await Promise.resolve(...) してから console.log し、run() を呼ぶ', ok: /async\s+function\s+run\s*\(\s*\)/.test(s) && /await\s+Promise\.resolve\s*\(/.test(s) && /\brun\s*\(\s*\)\s*;/.test(s) && clean(c), hint: ['await は async 関数の中でだけ使える。'] },
      ], 300),
    'Promise の 3 つの状態': mk(
`function wait(ms: number): Promise<string> {
  return new Promise((resolve, reject) => {
    // ここで、ms ミリ秒後に resolve("ok") を呼ぶ
  });
}
// ② async 関数 main の中で try / catch を使って await wait(100) する
`,
`function wait(ms: number): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("ok"), ms);
  });
}
async function main() {
  try {
    const r = await wait(100);
    console.log(r);
  } catch (e) {
    console.log("失敗");
  }
}
main();
`,
      (s, c) => [
        { level: 1, label: 'setTimeout の中で resolve("ok") を呼ぶ（成功に変わる）', ok: /setTimeout\s*\(\s*\(\s*\)\s*=>\s*resolve\s*\(\s*["'`]|setTimeout\s*\(\s*function\s*\(\s*\)\s*\{\s*resolve\s*\(/.test(s) && clean(c), hint: ['pending → fulfilled に変わる瞬間。'] },
        { level: 2, label: 'async function main で、try { await wait(100) } catch { … } を書く', ok: /async\s+function\s+main\s*\([^)]*\)[\s\S]*try\s*\{[\s\S]*await\s+wait\s*\([\s\S]*\}\s*catch/.test(s) && clean(c), hint: ['失敗（rejected）は catch で受け取る。'] },
      ], 300),
  };
})();
