/* 「なし / あり」の書き比べを、各 TypeScript シーンの先頭に足す（typescript.js の cmpSection を使う） */
(function () {
  const K = window.KENSHU;
  if (!K || !K.cmpSection) return;
  const C = {};
  C['Union：どれか1つ'] = ['Union', [
    { n: '🚦 ステータス', pain: '打ち間違い <b>"finished"</b> でも赤線が出ない', gain: '選べる文字を決めると、<b>打ち間違いが赤線</b>に',
      a: 'let status: string = "todo";\n\nstatus = "finished";   // 打ち間違い…赤線なし',
      b: 'type Status = "todo" | "doing" | "done";\n\nlet status: Status = "todo";\nstatus = "finished";   // ✖ 赤線' },
    { n: '🆔 ID が数字か文字', pain: '<code>any</code> だと、数字が来た時に<b>実行して初めて</b>エラー', gain: '<code>number | string</code> と書き、<b>両方に対応</b>させられる',
      a: 'function show(id: any) {\n  return id.toUpperCase();   // 数字が来たら実行時エラー\n}',
      b: 'function show(id: number | string) {\n  if (typeof id === "string") {\n    return id.toUpperCase();\n  }\n  return id.toFixed(0);\n}' },
    { n: '🕳️ 値がないかも', pain: 'null が来る可能性に<b>気づけない</b>', gain: '<code>string | null</code> と書くと、<b>null チェックが必須</b>に',
      a: 'function len(s: string) {\n  return s.length;\n}\nlen(null as any);   // 実行時エラー',
      b: 'function len(s: string | null) {\n  if (s === null) return 0;   // 確認しないと赤線\n  return s.length;\n}' },
    { n: '✅ 成功か失敗か', pain: '使わない項目（error など）も<b>毎回</b>必要になる', gain: 'ok で<b>どちらか判別</b>。必要な項目だけ持てる',
      a: 'const res = {\n  ok: true,\n  data: "結果",\n  error: "",   // 成功なのに必要…\n};',
      b: 'type Result =\n  | { ok: true; data: string }\n  | { ok: false; error: string };' },
  ]];
  C['Enum：名前の付いた定数'] = ['Enum', [
    { n: '🔢 数字コード', pain: '<code>1</code> が<b>何を意味するか</b>分からない', gain: '<code>Status.Doing</code> と<b>名前で読める</b>',
      a: 'if (status === 1) {\n  // 1 って何？\n}',
      b: 'enum Status {\n  Todo,    // 0\n  Doing,   // 1\n  Done,    // 2\n}\nif (status === Status.Doing) {}' },
    { n: '✏️ 打ち間違い', pain: '文字の打ち間違いに<b>気づけない</b>', gain: '存在しない名前は<b>赤線</b>',
      a: 'const dir = "Upp";   // 打ち間違い…赤線なし',
      b: 'enum Direction {\n  Up,\n  Down,\n}\nconst d = Direction.Upp;   // ✖ 赤線' },
    { n: '⌨️ 候補の補完', pain: '使える値を<b>覚えて</b>打つしかない', gain: '<code>Role.</code> と打つと<b>候補が出る</b>',
      a: 'const role = "admin";   // 他に何がある？',
      b: 'enum Role {\n  Admin,\n  User,\n}\nconst r = Role.   // ← Admin / User が候補に出る' },
  ]];
  C['getter / setter：門番を置く'] = ['getter / setter', [
    { n: '🎂 年齢チェック', pain: '<code>age = -5</code> が<b>そのまま通る</b>', gain: 'setter が<b>チェックしてから</b>保存',
      a: 'class User {\n  age = 20;\n}\nconst u = new User();\nu.age = -5;   // 通ってしまう',
      b: 'class User {\n  private _age = 20;\n  set age(v: number) {\n    if (v < 0) throw new Error("年齢が不正");\n    this._age = v;\n  }\n}' },
    { n: '🧮 読む時に計算', pain: '姓や名を変えても<b>フルネームが古いまま</b>', gain: 'getter なら<b>読むたびに</b>組み立てる',
      a: 'class Person {\n  first = "太郎";\n  last = "田中";\n  fullName = "田中太郎";   // 名前を変えても更新されない\n}',
      b: 'class Person {\n  first = "太郎";\n  last = "田中";\n  get fullName() {\n    return this.last + this.first;   // いつも最新\n  }\n}' },
    { n: '🔒 読むだけにする', pain: '外から<b>書き換えられて</b>しまう', gain: 'getter だけ書くと、<b>代入は赤線</b>',
      a: 'class Order {\n  total = 5000;\n}\nnew Order().total = 0;   // 通ってしまう',
      b: 'class Order {\n  private _total = 5000;\n  get total() { return this._total; }\n}\nnew Order().total = 0;   // ✖ 赤線' },
  ]];
  C['Box<T> マシン'] = ['ジェネリクス', [
    { n: '📦 型ごとに箱を作る', pain: '型が増えるたび<b>クラスをコピー</b>', gain: '<code>Box&lt;T&gt;</code> <b>1つ</b>で何の型にも使える',
      a: 'class StringBox { value = ""; }\nclass NumberBox { value = 0; }\nclass BoolBox { value = false; }\n// … 型が増えるたびに作る',
      b: 'class Box<T> {\n  constructor(public value: T) {}\n}\nconst a = new Box<string>("田中");\nconst b = new Box<number>(3000);' },
    { n: '🕶️ any で受ける', pain: '<code>any</code> だと<b>型が消えて</b>、間違った操作も通る', gain: '<code>T</code> なら<b>入れた型が残る</b>',
      a: 'class Box {\n  value: any = "田中";\n}\nnew Box().value.toFixed(0);   // 文字なのに赤線なし',
      b: 'const b = new Box<string>("田中");\nb.value.toFixed(0);   // ✖ 赤線：string に toFixed は無い' },
    { n: '📚 配列の先頭', pain: '<b>型ごとに</b>同じ関数を書く', gain: '<code>first&lt;T&gt;</code> <b>1つ</b>で全部',
      a: 'function firstNum(a: number[]): number { return a[0]; }\nfunction firstStr(a: string[]): string { return a[0]; }',
      b: 'function first<T>(a: T[]): T {\n  return a[0];\n}' },
  ]];
  C['identity<T>：入れた型が出てくる'] = ['ジェネリクス', [
    { n: '🔍 any だと型が消える', pain: '戻り値が <b>any</b>。間違った操作も通る', gain: '<code>T</code> は<b>入れた型のまま</b>返る',
      a: 'function id(x: any): any {\n  return x;\n}\nconst n = id(1);       // any（型が消えた）\nn.toUpperCase();       // 赤線なし→実行時エラー',
      b: 'function id<T>(x: T): T {\n  return x;\n}\nconst n = id(1);       // number\nn.toUpperCase();       // ✖ 赤線' },
    { n: '📋 同じ関数のコピー', pain: '型ごとに<b>同じ中身の関数</b>が増える', gain: '<b>T で1つ</b>にまとまる',
      a: 'function lastNum(a: number[]): number { return a[a.length - 1]; }\nfunction lastStr(a: string[]): string { return a[a.length - 1]; }',
      b: 'function last<T>(a: T[]): T {\n  return a[a.length - 1];\n}' },
    { n: '🌐 API の取得', pain: '戻り値が <code>any</code>。<b>何が来るか</b>分からない', gain: '<code>fetchJson&lt;型&gt;</code> で<b>型を指定</b>できる',
      a: 'async function fetchJson(url: string): Promise<any> {\n  const r = await fetch(url);\n  return r.json();\n}\nconst list = await fetchJson("/api");   // any',
      b: 'async function fetchJson<T>(url: string): Promise<T> {\n  const r = await fetch(url);\n  return r.json();\n}\nconst list = await fetchJson<{ id: number }[]>("/api");' },
  ]];
  C['値がない型：void / undefined / null'] = ['void / undefined / null', [
    { n: '📤 戻り値がない関数', pain: '何を返すか<b>はっきりしない</b>（any）', gain: '<code>void</code> と書けば「<b>返す値は無い</b>」と分かる',
      a: 'function save(): any {\n  console.log("保存しました");\n}\nconst r = save();   // r は any',
      b: 'function save(): void {\n  console.log("保存しました");\n}\nconst r = save();   // 返り値は無い（使うと赤線）' },
    { n: '🔎 見つからない', pain: '<b>undefined</b> に気づけず、実行時エラー', gain: '<code>number | undefined</code> と出て、<b>確認が必要</b>と分かる',
      a: 'const n = [1, 2, 3].find((x) => x > 5);\nconsole.log(n.toFixed(0));   // 実行時エラー',
      b: 'const n = [1, 2, 3].find((x) => x > 5);\n// n は number | undefined\nconsole.log(n?.toFixed(0) ?? "なし");' },
    { n: '📝 任意の項目', pain: '書かなくていい項目も<b>必須</b>になる', gain: '<code>?</code> を付けると<b>省略OK</b>',
      a: 'type User = { name: string; nickname: string };\nconst u: User = { name: "田中" };   // ✖ nickname が足りない',
      b: 'type User = { name: string; nickname?: string };\nconst u: User = { name: "田中" };   // ✓ OK' },
  ]];
  Object.values(K.lessons).forEach((L) => {
    (L.scenes || []).forEach((sc) => {
      const c = C[sc.t]; if (!c || sc.__cmp || !sc.render) return;
      sc.__cmp = true;
      const orig = sc.render;
      sc.render = function (el, ...rest) {
        const r = orig.call(this, el, ...rest);
        el.prepend(K.cmpSection('🆚 ' + c[0] + ' を使わない時 / 使う時', c[1], '❌ ' + c[0] + ' なし', '✅ ' + c[0] + ' あり'));
        return r;
      };
    });
  });
})();
