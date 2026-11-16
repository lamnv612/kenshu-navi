/* TypeScript の各シーンの下に「実際のコードでは、いつ使う？」ガイドを足す（場面を選ぶ → おすすめ + コード） */
(function () {
  const K = window.KENSHU;
  if (!K || !K.W) return;
  const { h, code, style } = K.W;
  const O = 'var(--ok)', B = 'var(--bad)', T = 'var(--team)', S = 'var(--basic)', P = 'var(--ts)';

  style('whw', `
  .wh-sec{margin-top:22px;padding-top:16px;border-top:1px dashed var(--line)}
  .wh-sec>h4{font:900 1.05rem var(--font);margin-bottom:4px}
  .wh-sub{font-weight:700;color:var(--mute);font-size:.84rem;margin:0 0 10px}
  .wh-pick{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin-bottom:12px}
  .wh-pick button{all:unset;cursor:pointer;box-sizing:border-box;padding:.55em .8em;border-radius:8px;border:1px solid var(--line);background:var(--card);font-weight:800;font-size:.84rem;line-height:1.5;transition:.2s}
  .wh-pick button:hover{transform:translateY(-2px)}.wh-pick button.on{border-color:var(--ts);background:color-mix(in srgb,var(--ts) 16%,var(--card))}
  .wh-ans{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:14px;align-items:start;animation:tvpop .35s both}@media(max-width:820px){.wh-ans{grid-template-columns:1fr}}
  .wh-v{padding:14px;border-radius:12px;border:2px solid var(--c);background:color-mix(in srgb,var(--c) 12%,var(--card))}
  .wh-v>b{display:block;font:900 1.25rem var(--mono);color:var(--c);margin-bottom:6px}.wh-v p{font-weight:700;font-size:.875rem;line-height:1.7}
  .wh-v em{display:block;margin-top:8px;font-style:normal;font-size:.8rem;font-weight:700;color:var(--mute)}
  .wh-rule{margin-top:12px;display:flex;gap:10px;flex-wrap:wrap}.wh-rule div{flex:1 1 200px;padding:.6em 1em;border-radius:8px;background:var(--card2);border:1px solid var(--line);font-size:.84rem;font-weight:700;line-height:1.7}`);

  // [ボタン名, おすすめ, 色, 説明(html), 補足, コード]
  const G = {};

  G['基礎文法の公式'] = { cases: [
    ['税率・サイト名（変わらない）', 'const', O, '一度決めたら変えない値は <code>const</code>。うっかり書き換えると<b>赤線で止めてくれる</b>。', '現場のコードは、ほとんどが const。', 'const TAX_RATE: number = 0.1;\n\nTAX_RATE = 0.2; // ✖ 再代入できない（赤線）'],
    ['カウンタ・入力中の文字', 'let', T, '後で<b>書き換える</b>値だけ <code>let</code>。', 'let が多いコードは「どこで変わる？」を追うのが大変。', 'let count: number = 0;\n\ncount = count + 1; // OK（let は書き換えOK）'],
    ['どっちか迷う', 'まず const', O, 'まず <code>const</code> で書く。<b>書き換えが必要になったら</b> let に変える。', '赤線が出たら、そのとき let にすればOK。', 'const name: string = "田中";\n// 変えたくなったら let に直す'],
    ['昔のコードに var がある', 'var は使わない', B, '古い書き方。範囲（スコープ）が分かりにくく、バグの元。', '新しく書くときは const / let だけ。', '// ✖ 古い書き方\nvar name = "田中";\n\n// ✓ こう書く\nconst name2 = "田中";'],
    ['関数の宣言', '引数と戻り値に型', S, '<code>function 名前(引数: 型): 戻り値の型</code>。関数の入口と出口は<b>必ず型を書く</b>。', '呼ぶ側が、型を見るだけで使い方が分かる。', 'function total(price: number, qty: number): number {\n  return price * qty;\n}'],
  ], rules: ['<b>const</b> ＝ 書き換え禁止（基本これ）', '<b>let</b> ＝ 書き換えOK（必要な時だけ）', '<b>覚え方</b>：まず const、赤線が出たら let'] };

  G['型アノテーションの読み方'] = { cases: [
    ['関数の引数', '必ず書く', S, '引数は呼ぶ側から何でも入ってくる入口。<b>型を書かないと any になる</b>（検査なし）。', '書き忘れ = 一番多い事故。', 'function fee(price: number, qty: number) {\n  return price * qty;\n}'],
    ['関数の戻り値', '書くと安心', S, '「この関数は何を返す？」を宣言しておくと、<b>中身を間違えた時に赤線</b>が出る。', '短い関数は省略も可（チームの決まりに合わせる）。', 'function label(n: number): string {\n  return n;   // ✖ number は string ではない\n}'],
    ['初期値がある変数', '書かない', O, '右辺から<b>自動で型が決まる</b>（推論）。同じことを2回書かない。', '書いても間違いではないが、ノイズになる。', 'const price = 3000;        // number と自動で決まる\nconst title = "相続の相談"; // string'],
    ['空の配列で始める', '書く', S, '<code>[]</code> だけでは何の配列か分からない。<b>中身の型</b>を書く。', '書かないと never[] になって、追加できない。', 'const names: string[] = [];\nnames.push("田中");'],
    ['宣言だけして、あとで入れる', '書く', S, '初期値がないので TS は型を決められない。<b>型だけ先に書く</b>。', '最初は null かもしれないなら string | null。', 'let name: string;\nname = "田中";'],
  ], rules: ['<b>入口（引数）</b>は必ず書く', '<b>右辺で分かる</b>なら書かない', '<b>覚え方</b>：分からない所にだけ書く'] };

  G['型の箱に値を入れよう'] = { cases: [
    ['名前・メール・住所', 'string', S, '文字で表すものは <code>string</code>。', '', 'const name: string = "田中";\nconst mail: string = "a@example.com";'],
    ['料金・人数・年齢', 'number', P, '<b>計算する</b>数字は <code>number</code>。', '整数も小数も同じ number。', 'const fee: number = 3000;\nconst total: number = fee * 2;'],
    ['電話番号・郵便番号', 'string（number ではない）', B, '計算しない数字は<b>文字として持つ</b>。number だと先頭の 0 が消える。', '見た目は数字でも、足し算しないなら string。', 'const tel: string = "090-1234-5678";\nconst zip: string = "0123456";\n// number にすると 123456（先頭の 0 が消える）'],
    ['同意した？ ログイン中？', 'boolean', T, '「はい / いいえ」の2択は <code>boolean</code>。名前は <code>is〜</code> / <code>has〜</code> にすると読みやすい。', '', 'const isLoggedIn: boolean = true;\nconst hasAgreed: boolean = false;'],
    ['お金の小数計算', 'number（誤差に注意）', B, 'number でお金を扱える。ただし<b>小数の足し算は誤差</b>が出る。', '円なら整数で持つ。小数が必要なら最後に丸める。', 'console.log(0.1 + 0.2); // 0.30000000000000004\n\nconst yen: number = 1980; // 整数で持つ'],
  ], rules: ['<b>文字</b> → string', '<b>計算する数字</b> → number', '<b>覚え方</b>：足し算しない数字は string'] };

  G['const / let と型推論'] = { cases: [
    ['変わらない文字を選択肢に', 'const（型が狭くなる）', O, '<code>const</code> だと型は<b>その文字そのもの</b>（"todo"）。let だと string に広がる。', '決まった文字だけ許したい時に効く。', 'const status = "todo";   // 型は "todo"\nlet status2 = "todo";    // 型は string'],
    ['最初は空、あとで入る', 'let ＋ 型を書く', T, '値が変わるので <code>let</code>。最初が null なら<b>型を明示</b>する。', '書かないと null 型になって代入できない。', 'let selected: string | null = null;\n\nselected = "相続";   // OK'],
    ['配列・オブジェクトに足す', 'const でOK', O, 'const は<b>入れ物</b>を固定するだけ。中身は変えられる。', '「中身を変える」と「入れ物を取り替える」は別。', 'const list: string[] = [];\nlist.push("相続");   // OK\n\nlist = [];            // ✖ 入れ物は替えられない'],
    ['ループのカウンタ', 'let', T, '数が増えていくので <code>let</code>。', 'for…of / map を使えばカウンタ自体いらない。', 'for (let i = 0; i < 3; i++) {\n  console.log(i);\n}'],
  ], rules: ['<b>const</b> ＝ 型が狭く決まる', '<b>let</b> ＝ 広い型（string など）', '<b>覚え方</b>：迷ったら const'] };

  G['型推論：どこまで書く？'] = { cases: [
    ['関数の引数', '書く', S, '入口は TS が推測できない。<b>必ず書く</b>。', '', 'function fee(price: number) {\n  return price * 1.1;\n}'],
    ['関数の中の変数', '書かない', O, '右辺から決まる。書くとノイズ。', '書きすぎるとコードが読みにくい。', 'function fee(price: number) {\n  const tax = price * 0.1;   // number と自動で決まる\n  return price + tax;\n}'],
    ['map / filter の引数', '書かない', O, '配列の型から<b>自動で分かる</b>。', '', 'const prices = [100, 200];\nprices.map((p) => p * 2);   // p は number'],
    ['公開する関数の戻り値', '書く', S, '他のファイルから使う関数は、<b>戻り値を約束</b>として書いておく。', '中身を変えても、呼ぶ側が壊れにくい。', 'export function load(): string[] {\n  return [];\n}'],
    ['空の配列 / null で始める', '書く', S, '初期値から型が決まらない。<b>型を書く</b>。', '', 'const rows: string[] = [];\nlet cur: string | null = null;'],
    ['API から来る値', '型を書く', P, '外から来る値は TS には分からない。<b>どんな形か</b>を型で書いておく。', 'そのまま信じず、必要なら確認（unknown）。型に名前を付ける方法は、あとの interface で。', 'const data: { id: number; title: string }[] = await load();'],
  ], rules: ['<b>入口（引数）</b>は書く', '<b>中の変数</b>は書かない', '<b>覚え方</b>：入口と出口に書く、中は任せる'] };

  G['配列・タプル・オブジェクト'] = { cases: [
    ['相談の一覧（同じ種類がたくさん）', '配列 T[]', S, '同じ形のデータが<b>いくつも並ぶ</b>なら配列。', '一覧・検索結果・履歴など。', 'const list: { id: number; title: string }[] = [\n  { id: 1, title: "相続" },\n  { id: 2, title: "離婚" },\n];'],
    ['緯度と経度（2つだけ、順番に意味）', 'タプル [A, B]', P, '<b>個数と順番が決まっている</b>少数のセット。', '3つ以上や意味が分かりにくい時は、オブジェクトにする。', 'const pos: [number, number] = [35.68, 139.76];\n// [緯度, 経度] の順'],
    ['相談1件（項目に名前がある）', 'オブジェクト { }', T, '項目ごとに<b>名前</b>が付くので読みやすい。', '現場では一番よく使う形。型に名前を付ける方法は、次のレッスン（interface）で。', 'const c: { id: number; title: string } = {\n  id: 1,\n  title: "相続",\n};'],
    ['名前 → 点数（キーが自由）', 'Record<string, T>', O, 'キーが決まっていない<b>辞書</b>。', 'キーが決まっているなら、普通のオブジェクト型のほうが安全。', 'const score: Record<string, number> = {\n  田中: 80,\n  山本: 92,\n};'],
  ], rules: ['<b>同じ種類</b>がたくさん → 配列', '<b>名前付きの項目</b> → オブジェクト', '<b>覚え方</b>：迷ったらオブジェクト'] };

  G['値がない型：void / undefined / null'] = { cases: [
    ['何も返さない関数', 'void', T, 'ログを出す・保存する・画面を更新する関数は<b>返す値がない</b>。', '返り値を使おうとすると赤線。', 'function save(title: string): void {\n  console.log("保存しました");\n}'],
    ['探したけど見つからない', 'T | undefined', P, '配列の <code>find</code> は<b>無いときがある</b>。型にもそう出る。', '使う前に「あるか」を確認する。', 'const nums = [1, 2, 3];\nconst n = nums.find((x) => x > 5);\n// n は number | undefined\n\nconsole.log(n ?? "見つかりません");'],
    ['まだ選んでいない', 'T | null', S, '「<b>わざと空</b>」にしたい時は null。初期状態でよく使う。', 'undefined は「まだ無い」、null は「空にした」。', 'let selected: string | null = null;\n\nselected = "相続";'],
    ['なくてもいい項目', '項目名?: 型', O, '<code>?</code> を付けると<b>省略OK</b>（undefined も入る）。', 'フォームの任意入力欄など。', 'const c: { title: string; memo?: string } = {\n  title: "相続",   // memo は書かなくてもOK\n};'],
    ['値があるか分からない時の読み方', '?. と ??', T, '<code>?.</code> は「あれば読む」、<code>??</code> は「なければこれ」。', 'null / undefined で落ちるのを防ぐ定番。', 'const user: { name?: string } = {};\n\nconsole.log(user.name?.length ?? 0);   // 0'],
  ], rules: ['<b>void</b> ＝ 返す値がない関数', '<b>undefined / null</b> ＝ 値がない状態', '<b>覚え方</b>：あるか確認してから使う'] };

  G['Union：どれか1つ'] = { cases: [
    ['ステータス（決まった文字だけ）', '文字の Union', O, '<code>"todo" | "doing" | "done"</code> のように<b>選べる値を限定</b>。打ち間違いが赤線になる。', '一番よく使う Union。', 'type Status = "todo" | "doing" | "done";\n\nconst s: Status = "finished"; // ✖ 赤線'],
    ['ID が数字か文字', 'number | string', P, '<b>どちらも来る</b>データに。', '使う時は typeof で絞り込む。', 'type Id = number | string;\n\nfunction show(id: Id) {\n  if (typeof id === "string") {\n    return id.toUpperCase();\n  }\n  return id.toFixed(0);\n}'],
    ['値がないかもしれない', 'string | null', S, '空の可能性を<b>型で表す</b>。', '使う前に null チェックが必要になる。', 'let name: string | null = null;\n\nif (name !== null) {\n  console.log(name.length);\n}'],
    ['成功 or 失敗の結果', 'オブジェクトの Union', T, '<code>ok</code> で<b>どちらか判別</b>できる形にする。', 'API の結果でよく使う。', 'type Result =\n  | { ok: true; data: string }\n  | { ok: false; error: string };\n\nfunction show(r: Result) {\n  if (r.ok) console.log(r.data);\n  else console.log(r.error);\n}'],
  ], rules: ['<b>A | B</b> ＝ どれか1つ', '<b>使う前</b>に絞り込む（if）', '<b>覚え方</b>：選択肢は文字の Union で'] };

  G['Enum：名前の付いた定数'] = { cases: [
    ['新しく書く（選択肢）', 'まず Union', O, '今は<b>文字の Union が主流</b>。Enum は JS に余計なコードが出る。', 'チームのルールがあればそれを優先。', 'type Role = "admin" | "user";\n\nconst r: Role = "admin";'],
    ['サーバーが数字コードで返す', 'Enum（数値）', P, '0 / 1 / 2 のような<b>数字コードに名前</b>を付けたい時。', '自動で 0, 1, 2… と番号が付く。', 'enum Status {\n  Todo,   // 0\n  Doing,  // 1\n  Done,   // 2\n}\nconsole.log(Status.Doing); // 1'],
    ['すでに Enum で書かれている', 'そのコードに合わせる', T, '既存のコードが Enum なら、<b>書き方を揃える</b>。', '混ぜると読みにくい。', 'enum Direction {\n  Up = 1,\n  Down,   // 2\n}'],
    ['コードを読みやすくしたい', '名前を付ける', S, '<code>1</code> だけだと意味が分からない。<b>名前</b>で読める。', '', 'if (dir === Direction.Up) {\n  // 1 より意味が分かる\n}'],
  ], rules: ['<b>新規</b> → Union で十分', '<b>数字コード</b> → Enum', '<b>覚え方</b>：迷ったら Union'] };

  G['interface：形チェッカー'] = { cases: [
    ['API・DB から来るデータ', 'interface', P, '項目名と型を<b>1か所に定義</b>。項目名の間違いが赤線になる。', '一番よく使う場面。', 'interface Consultation {\n  id: number;\n  title: string;\n}\n\nconst c: Consultation = { id: 1, tilte: "相続" }; // ✖ tilte'],
    ['画面に渡す値（Props）', 'interface', P, 'Vue・React の<b>コンポーネントが受け取る値</b>の形に。', '使う側が足りない項目に気づける。', 'interface Props {\n  title: string;\n  fee: number;\n}'],
    ['クラスが守る約束', 'implements', T, '「このクラスは<b>この形を必ず持つ</b>」と約束する。', '', 'interface Payable { pay(): void }\n\nclass Card implements Payable {\n  pay() {}\n}'],
    ['書き換えさせたくない項目', 'readonly', S, '作ったら<b>変えられない</b>項目に。', 'id など。', 'interface Consultation {\n  readonly id: number;\n  title: string;\n}'],
  ], rules: ['<b>オブジェクトの形</b> → interface', '<b>省略OK</b> → <code>?</code>', '<b>覚え方</b>：データの設計図'] };

  G['extends と merge'] = { cases: [
    ['共通の項目を引き継ぐ', 'extends', P, '<b>基本の型</b>に項目を足して、別の型を作る。', '共通部分を1か所で直せる。', 'interface Consultation { id: number; title: string }\n\ninterface Booking extends Consultation {\n  time: string;\n}'],
    ['ライブラリの型に項目を足す', 'merge（同名を2回）', T, '<b>同じ名前を書き足す</b>と合体する。外部の型を拡張する時に使う。', 'Express の Request、window など。', 'interface Window {\n  myApp: string;   // window に項目を足す\n}'],
    ['うっかり同じ名前を書いた', '要注意', B, '同名の interface は<b>勝手に合体</b>する。別物のつもりでも混ざる。', 'ファイルが多いと気づきにくい。', '// a.ts\ninterface User { id: number }\n// b.ts（別の人が同名）\ninterface User { name: string }\n// → id と name の両方が必要になる'],
    ['何段も extends したい', '浅く保つ', O, '3段以上は<b>どこに何があるか</b>が追えなくなる。', '2段まで。複雑なら別の型に分ける。', 'interface A { a: number }\ninterface B extends A { b: number }\n// C, D … と続けない'],
  ], rules: ['<b>extends</b> ＝ 引き継いで足す', '<b>merge</b> ＝ 同名で合体（主に外部の型）', '<b>覚え方</b>：自分の型は extends'] };

  G['interface vs type'] = { cases: [
    ['オブジェクトの形', 'interface（または規約どおり）', P, 'どちらでも書ける。<b>チームの決まり</b>に合わせる。', '決まりがなければ interface が定番。', 'interface Consultation {\n  id: number;\n}'],
    ['A または B（Union）', 'type', O, 'Union は <b>type でしか書けない</b>。', '', 'type Id = number | string;'],
    ['タプル・関数の型', 'type', O, 'object 以外は type。', '', 'type Row = [number, string];\ntype Handler = (e: string) => void;'],
    ['ライブラリが拡張する型', 'interface', T, '<b>あとから足せる</b>（merge）のは interface だけ。', 'ライブラリ側の型は interface のことが多い。', 'interface Window {\n  myApp: string;\n}'],
    ['どちらか迷う', 'チームの規約に従う', S, '機能の差より<b>揃っていること</b>のほうが大事。', 'ルールがない時は「形は interface、それ以外は type」。', '// チームのルール例\n// ・オブジェクト → interface\n// ・Union / タプル / 関数 → type'],
  ], rules: ['<b>形</b> → interface', '<b>形以外</b> → type', '<b>覚え方</b>：迷ったらチームに合わせる'] };

  G['getter / setter：門番を置く'] = { cases: [
    ['読む時に計算したい', 'getter', P, '<b>姓 + 名</b>のように、取り出す時に組み立てる。', '外からは普通の項目に見える。', 'class Person {\n  constructor(private first: string, private last: string) {}\n  get fullName() { return this.last + this.first; }\n}'],
    ['代入時にチェックしたい', 'setter', T, '<b>マイナスの年齢</b>を拒否するなど、門番にする。', '', 'class Person {\n  private _age = 0;\n  set age(n: number) {\n    if (n < 0) throw new Error("年齢が不正");\n    this._age = n;\n  }\n}'],
    ['ただ読み書きするだけ', '普通の項目', O, 'チェックも計算もなければ<b>getter / setter は不要</b>。', '付けすぎると読みにくい。', 'class Person {\n  name = "田中";\n}'],
  ], rules: ['<b>getter</b> ＝ 読む時の加工', '<b>setter</b> ＝ 書く時の門番', '<b>覚え方</b>：ルールがある時だけ'] };

  G['継承：親から子へ'] = { cases: [
    ['A は B の一種', 'extends（継承）', P, '「弁護士は<b>人の一種</b>」のように、is-a で言えるなら継承。', '', 'class Person { name = "" }\nclass Lawyer extends Person {\n  license = "";\n}'],
    ['A は B を持っている', '継承ではなく項目で持つ', O, '「予約は相談を<b>持つ</b>」は継承ではない。項目にする。', '無理な継承は後で苦しくなる。', 'class Booking {\n  constructor(public consultation: Consultation) {}\n}'],
    ['共通処理をまとめたい', '親クラス', T, '同じ処理を<b>親に1回</b>書く。', '3段以上は深くしすぎ。', 'class Base {\n  log(msg: string) { console.log(msg); }\n}\nclass A extends Base {}\nclass B extends Base {}'],
    ['親の動きを変えたい', 'override', S, '子で<b>同名のメソッドを書き直す</b>。', 'override キーワードで書き間違いを防げる。', 'class A { hi() { return "A"; } }\nclass B extends A {\n  override hi() { return "B"; }\n}'],
  ], rules: ['<b>is-a</b>（〜の一種）→ 継承', '<b>has-a</b>（〜を持つ）→ 項目', '<b>覚え方</b>：迷ったら継承しない'] };

  G['Box<T> マシン'] = { cases: [
    ['入れ物は同じ、中身の型だけ違う', 'ジェネリクス <T>', P, 'Box&lt;string&gt;、Box&lt;number&gt; のように<b>型を後から決める</b>。', '同じコードを何度も書かずに済む。', 'class Box<T> {\n  constructor(public value: T) {}\n}\nconst a = new Box<string>("田中");\nconst b = new Box<number>(3000);'],
    ['型が1種類だけ', '普通の型', O, '中身がいつも同じなら<b>ジェネリクスは不要</b>。', '', 'class NameBox {\n  constructor(public value: string) {}\n}'],
    ['any で逃げたくなった', '<T> を考える', T, '「何でも入る」を any にすると型が消える。<b>T なら入れた型が残る</b>。', '', 'class Box<T> {\n  constructor(public value: T) {}\n}\nnew Box(1).value.toFixed(0); // number と分かる'],
    ['もう使っている', 'Array / Promise', S, '<code>string[]</code> は <code>Array&lt;string&gt;</code>、<code>Promise&lt;T&gt;</code> も同じ仕組み。', '自分で作るのは少しだけ。', 'const list: Array<string> = [];\nconst p: Promise<number> = Promise.resolve(1);'],
  ], rules: ['<b>同じ形・型だけ違う</b> → ジェネリクス', '<b>1種類</b> → 普通の型', '<b>覚え方</b>：any の代わりに T'] };

  G['identity<T>：入れた型が出てくる'] = { cases: [
    ['入れた型をそのまま返す関数', 'function f<T>', P, '引数と戻り値が<b>同じ型</b>。使う側で自動的に決まる。', '', 'function first<T>(arr: T[]): T {\n  return arr[0];\n}\nfirst([1, 2]);      // number\nfirst(["a", "b"]);  // string'],
    ['API を取得する関数', 'fetchJson<T>', T, '呼ぶ時に<b>戻り値の型を指定</b>できる。', '実際に正しい形かは確認が別途必要。', 'async function fetchJson<T>(url: string): Promise<T> {\n  const r = await fetch(url);\n  return r.json();\n}\nconst list = await fetchJson<Consultation[]>("/api");'],
    ['型ごとに同じ関数を書きそう', 'T にまとめる', O, 'number 用、string 用…と<b>コピーしそうな時</b>が合図。', '', '// ✖ firstNumber, firstString … と増える\n// ✓ first<T> 1つで済む'],
    ['名前の付け方', 'T / K / V', S, 'T（Type）、K（Key）、V（Value）が慣習。', '意味が分かりにくければ TItem のように書いてもよい。', 'function pair<K, V>(k: K, v: V): [K, V] {\n  return [k, v];\n}'],
  ], rules: ['<b>入れた型 = 出る型</b> → T', '<b>呼ぶ側</b>が型を決める', '<b>覚え方</b>：コピーしたくなったら T'] };

  G['Array<T> と制約 extends'] = { cases: [
    ['title を持つものだけ受けたい', 'T extends { title: string }', P, '「何でも」ではなく<b>最低限の条件</b>を付ける。', '', 'function titles<T extends { title: string }>(xs: T[]) {\n  return xs.map((x) => x.title);\n}'],
    ['キー名を指定して取り出す', 'K extends keyof T', T, '存在する<b>キーだけ</b>を許す。打ち間違いは赤線。', '', 'function pick<T, K extends keyof T>(o: T, k: K) {\n  return o[k];\n}\npick({ id: 1 }, "id");   // OK\npick({ id: 1 }, "name"); // ✖'],
    ['条件がいらない', '制約なしの T', O, '中身を<b>触らない</b>なら制約はいらない。', '', 'function wrap<T>(x: T): T[] {\n  return [x];\n}'],
    ['制約を付けすぎる', '最小限に', B, '厳しすぎると<b>使い回せなく</b>なる。', '必要な項目だけ要求する。', '// ✖ 全項目を要求\n// ✓ 使う項目（title）だけ要求'],
  ], rules: ['<b>extends</b> ＝ 最低限の条件', '<b>keyof</b> ＝ キー名だけ許す', '<b>覚え方</b>：使う項目だけ要求'] };

  G['TDD：赤 → 緑 → 赤 → 緑'] = { cases: [
    ['料金計算など、答えが決まっている', 'TDD が向く', O, '<b>入力と答え</b>がはっきりしている処理は、先にテストを書くと迷わない。', '', 'it("税込を計算する", () => {\n  expect(withTax(1000)).toBe(1100);\n});'],
    ['バグを直す前', '再現テストから', P, 'まず<b>バグを再現するテスト</b>を書く（赤）。直したら緑になる。', '再発も防げる。', 'it("0円でもエラーにならない", () => {\n  expect(withTax(0)).toBe(0);\n});'],
    ['画面の見た目・色', 'TDD は不向き', B, '見た目は<b>目で確認</b>するほうが早い。ロジックだけテストする。', '', '// 色や余白はブラウザで確認\n// 計算や判定だけテストにする'],
    ['急ぎ・作りながら考える', '後からでもOK', S, '最初から完璧に書かなくてよい。<b>大事な処理だけ</b>先にテストを書く。', '', '// まず動かす → 大事な所にテストを足す'],
  ], rules: ['<b>赤</b> ＝ 先にテストを書く（失敗）', '<b>緑</b> ＝ 通るように直す', '<b>覚え方</b>：答えが決まる所から'] };

  G['テストの型：Arrange → Act → Assert'] = { cases: [
    ['1つのテスト', '準備 → 実行 → 確認', P, '<b>3ブロックに分ける</b>と、何を試しているか一目で分かる。', '', 'it("合計を出す", () => {\n  const items = [100, 200];      // Arrange\n  const sum = total(items);      // Act\n  expect(sum).toBe(300);         // Assert\n});'],
    ['確認が何個もある', 'テストを分ける', O, '1つのテストで<b>1つのこと</b>を確認する。', '落ちた時に原因がすぐ分かる。', '// ✖ 1つに全部\n// ✓ 「空配列」「1件」「複数」で3つに分ける'],
    ['準備が長い', '共通化', S, '何度も使う準備は <code>beforeEach</code> に出す。', '', 'let items: number[];\nbeforeEach(() => {\n  items = [100, 200];\n});'],
  ], rules: ['<b>Arrange</b> 準備', '<b>Act</b> 実行 / <b>Assert</b> 確認', '<b>覚え方</b>：1テスト = 1つの確認'] };

  G['TS は JS に変換される'] = { cases: [
    ['ブラウザで動かす', 'tsc で JS に変換', P, 'ブラウザは JS しか読めない。<b>変換してから</b>配る。', '', '// hello.ts → tsc → hello.js\n// 配るのは hello.js'],
    ['Vite / Vue のプロジェクト', '自動で変換', O, 'ビルドの仕組みが<b>自動で JS にしてくれる</b>。', '型のチェックは tsc（vue-tsc）が別に担当。', '// npm run dev / build で変換される\n// 自分で tsc を打たなくてよい'],
    ['小さなスクリプトを試す', 'tsx などで直接実行', T, 'ファイルを1つ試すだけなら、<b>変換を意識せず</b>動かせるツールがある。', '', '// npx tsx hello.ts'],
    ['外から入る値', '型だけでは守れない', B, '型は<b>実行時には消える</b>。API の値などは別途確認が必要。', 'unknown で受けて、確認してから使う。', 'const data: unknown = JSON.parse(text);\nif (typeof data === "string") {\n  // ここで初めて使える\n}'],
  ], rules: ['<b>型</b> ＝ 書く時のチェック', '<b>実行</b> ＝ JS で動く', '<b>覚え方</b>：型は実行時に残らない'] };

  G['そのバグ、どこで見つかる？'] = { cases: [
    ['使い捨ての小さなスクリプト', 'JS のままでもOK', O, '数行で終わる処理は<b>型の準備のほうが重い</b>。', '', '// 一度だけ使うデータ整形など'],
    ['チームで長く育てるアプリ', 'TypeScript', P, '人が増える・時間が経つほど、<b>型が道しるべ</b>になる。', '', 'function add(a: number, b: number) {\n  return a + b;\n}'],
    ['外部からの入力が多い', 'TS ＋ 確認コード', T, '型は実行時に消える。<b>入力は確認</b>する仕組みを別に持つ。', '', 'const data: unknown = JSON.parse(text);'],
    ['すでに JS の資産がある', '少しずつ TS へ', S, '全部書き直さず、<b>新しい所から</b> TS にしていける。', 'allowJs を使うと混ぜられる。', '// tsconfig.json\n// { "compilerOptions": { "allowJs": true } }'],
  ], rules: ['<b>小さい・短い</b> → JS でもよい', '<b>長く・大人数</b> → TS', '<b>覚え方</b>：バグを早く見つけたいなら TS'] };

  G['readonly：書き換え禁止'] = { cases: [
    ['ID・番号（作ったら不変）', 'readonly', P, '予約番号・口座番号など、<b>途中で変わったら大事故</b>の値に。', '読むのは自由。代入だけ赤線になる。', 'class Booking {\n  readonly id = 1001;\n}\nconst b = new Booking();\nb.id = 2;   // ✖ 赤線（書き換え禁止）'],
    ['作成日・登録日時', 'readonly', P, '<b>履歴</b>の値が後から変わると、記録が信用できなくなる。', '', 'class Order {\n  readonly createdAt = "2025-01-10";\n}'],
    ['設定値・定数のまとまり', 'readonly', O, '税率や上限など、<b>アプリ全体で共通の設定</b>を守る。', '', 'interface Config {\n  readonly taxRate: number;\n  readonly maxItems: number;\n}\nconst cfg: Config = { taxRate: 0.1, maxItems: 10 };\ncfg.taxRate = 0.2; // ✖'],
    ['配列を書き換えさせたくない', 'readonly string[]', T, '関数に渡した配列を、<b>中で勝手に変えられない</b>ようにする。', '呼ぶ側のデータが守られる。', 'function show(names: readonly string[]) {\n  names.push("x");   // ✖ 赤線\n  return names.length;\n}'],
    ['値を変えて使いたい', '付けない', S, '更新が必要な値（カウンタ・入力中の文字）には付けない。', 'private と組み合わせてもOK。', 'class Counter {\n  count = 0;          // 増やすので readonly にしない\n  up() { this.count += 1; }\n}'],
  ], rules: ['<b>readonly</b> ＝ 代入禁止（読むのはOK）', '<b>ID・日時・設定</b> → 付ける', '<b>覚え方</b>：変わると困る値に付ける'] };

  G['super()：親を呼ぶ'] = { cases: [
    ['子の constructor を書く', 'super() が最初', P, '子クラスの constructor では、<b>先に親を準備</b>する（this より前）。', '書き忘れると赤線。', 'class Person {\n  constructor(public name: string) {}\n}\nclass Lawyer extends Person {\n  constructor(name: string, public license: string) {\n    super(name);   // 親の準備を先に\n  }\n}'],
    ['親のメソッドを残して足す', 'super.メソッド()', T, '親の処理は<b>そのまま使い</b>、子の処理を後ろに足す。', '', 'class Notice {\n  send() { console.log("送信"); }\n}\nclass MailNotice extends Notice {\n  send() {\n    super.send();           // 親の送信\n    console.log("メール履歴に保存");\n  }\n}'],
    ['親と全く違う動きにしたい', '呼ばない', O, '親の処理が<b>不要</b>なら super.xxx() は呼ばなくてよい。', '', 'class Base { hi() { return "A"; } }\nclass Child extends Base {\n  hi() { return "B"; }   // 親は呼ばない\n}'],
    ['親が引数なしの constructor', '子に constructor 不要', S, '子が何も足さないなら、<b>書かなくてよい</b>。自動で親が呼ばれる。', '', 'class A {}\nclass B extends A {}   // これで十分'],
  ], rules: ['<b>constructor</b> ＝ 最初に super()', '<b>メソッド</b> ＝ 親を残すなら super.xxx()', '<b>覚え方</b>：親を先に、子を後に'] };

  G['ミニテストランナー'] = { cases: [
    ['関数の答えを確かめる', 'expect(...).toBe(...)', P, '<b>実行結果と期待する答え</b>を並べて、合っているか判定。', '', 'it("税込を計算する", () => {\n  expect(withTax(1000)).toBe(1100);\n});'],
    ['エラーになるはずの時', 'toThrow', T, '「<b>おかしな入力は拒否する</b>」ことも、テストで確認できる。', '', 'it("0円以下は拒否", () => {\n  expect(() => deposit(-1)).toThrow();\n});'],
    ['配列・オブジェクトの中身', 'toEqual', O, '中身が<b>同じか</b>を比べる（見た目が同じならOK）。', 'toBe は「同じもの」、toEqual は「同じ中身」。', 'expect([1, 2]).toEqual([1, 2]);\nexpect({ id: 1 }).toEqual({ id: 1 });'],
    ['テストが増えてきた', 'describe でまとめる', S, '関連するテストを<b>グループ</b>にする。結果が読みやすい。', '', 'describe("deposit", () => {\n  it("増える", () => { /* ... */ });\n  it("0円以下は拒否", () => { /* ... */ });\n});'],
  ], rules: ['<b>expect</b> ＝ 結果を受け取る', '<b>toBe / toEqual</b> ＝ 期待と比べる', '<b>覚え方</b>：入力 → 期待する答え'] };

  G['describe / it / expect 早見表'] = { cases: [
    ['どのテストか名前を付ける', 'it("〜する", …)', P, '<b>日本語の文</b>で「何を確認するか」を書く。失敗した時に読みやすい。', '', 'it("合計を計算する", () => {\n  // ...\n});'],
    ['同じ種類のテストをまとめる', 'describe', T, '<b>関数やクラスごと</b>にグループにする。', '', 'describe("Cart", () => {\n  it("追加できる", () => {});\n  it("合計が出る", () => {});\n});'],
    ['答えを比べる', 'expect + マッチャー', O, '<code>toBe</code> <code>toEqual</code> <code>toContain</code> など、<b>調べたい内容で選ぶ</b>。', '', 'expect(total).toBe(300);\nexpect(list).toContain("相続");\nexpect(list).toHaveLength(2);'],
    ['毎回同じ準備が必要', 'beforeEach', S, '各テストの<b>前に自動で</b>実行される。準備のコピペが消える。', '', 'let cart: Cart;\nbeforeEach(() => {\n  cart = new Cart();\n});'],
  ], rules: ['<b>describe</b> ＝ グループ', '<b>it</b> ＝ 1つの確認', '<b>覚え方</b>：describe の中に it、it の中に expect'] };

  const build = (g) => {
    const pick = h('div', { class: 'wh-pick' }), ans = h('div');
    const show = (i) => {
      const r = g.cases[i];
      pick.querySelectorAll('button').forEach((b, k) => b.classList.toggle('on', k === i));
      ans.replaceChildren(h('div', { class: 'wh-ans' },
        h('div', { class: 'wh-v', style: { '--c': r[2] } }, h('b', r[1]), h('p', { html: r[3] }), r[4] ? h('em', r[4]) : null),
        code(r[5], 'ts')));
    };
    g.cases.forEach((r, i) => pick.append(h('button', { onclick: () => show(i) }, r[0])));
    show(0);
    return h('div', { class: 'wh-sec' },
      h('h4', '🧭 実際のコードでは、いつ使う？'),
      h('p', { class: 'wh-sub' }, '👇 場面を選ぶと、おすすめとコードが出る'),
      pick, ans,
      h('div', { class: 'wh-rule' }, g.rules.map((x) => h('div', { html: x }))));
  };

  Object.values(K.lessons).forEach((L) => {
    if (!L.scenes) return;
    L.scenes.forEach((s) => {
      const g = G[s.t];
      if (!g || s.__when || !s.render) return;
      s.__when = true;
      const orig = s.render;
      s.render = function (el, ...rest) {
        const r = orig.call(this, el, ...rest);
        el.append(build(g));
        return r;
      };
    });
  });
})();
