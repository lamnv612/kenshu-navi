/* 実践テスト：TypeScript 系（各レッスン 初級 / 中級 / 上級 の3問。コードを書いて自動チェック） */
(function () {
  const K = window.KENSHU, T = (K.tests = K.tests || {});

  const nc = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  const noop = { log() {}, error() {} };
  // コードを実行して、指定した名前の値を取り出す（失敗したら null）
  const vars = (src, names) => {
    try {
      const ts = window.ts; if (!ts) return null;
      const js = ts.transpileModule(src, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.None } }).outputText;
      return new Function('console', js + ';return {' + names.map((n) => n + ':typeof ' + n + '==="undefined"?undefined:' + n).join(',') + '}')(noop);
    } catch (e) { return null; }
  };
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  // def: { starter, solution, tasks:[[level, label, (src, ctx)=>bool, hint[]]] }
  const mk = (def) => ({
    mode: 'ts',
    files: [{ name: 'main.ts', lang: 'ts', code: def.starter }],
    solution: def.solution,
    tasks: (v, c) => {
      const raw = v['main.ts'], src = nc(raw), ed = raw !== def.starter;
      return def.tasks.map(([level, label, fn, hint]) => {
        let ok = false;
        try { ok = ed && !!fn(src, c, raw); } catch (e) { ok = false; }
        return { level, label, ok, hint };
      });
    },
  });
  const noErr = (c) => c.errors.length === 0;

  /* ---------- ts-intro ---------- */
  T['ts-intro'] = mk({
    starter: 'function add(a: number, b: number): number {\n  return a + b;\n}\n\nconst price: number = "100"; // 赤線を直す\nconsole.log(add("1", 2));    // 赤線を直す\n\n// greet 関数をここに作る\n',
    solution: 'function add(a: number, b: number): number {\n  return a + b;\n}\n\nconst price: number = 100;\nconsole.log(add(1, 2));\n\nfunction greet(name: string): string {\n  return `こんにちは、${name}さん`;\n}\n\nconst msg: string = greet("ミナ");\nconsole.log(msg);\n',
    tasks: [
      [1, '赤線（型エラー）を全部なくす', (s, c) => noErr(c), ['赤線にカーソルを乗せて、エラー文を読もう。', '"100" は文字、100 が数字。add に渡す "1" も同じ。']],
      [2, 'greet(name: string): string を作る（文字を受け取って、文字を返す）', (s) => /function\s+greet\s*\(\s*name\s*:\s*string\s*\)\s*:\s*string/.test(s) || /const\s+greet\s*=\s*\(\s*name\s*:\s*string\s*\)\s*:\s*string\s*=>/.test(s), ['引数にも戻り値にも型を書く。', 'function greet(name: string): string { ... }']],
      [3, 'greet("…") の結果を、型付きの const msg: string に入れる（赤線なし）', (s, c) => noErr(c) && /const\s+msg\s*:\s*string\s*=\s*greet\(\s*["'`]/.test(s), ['const msg: string = greet("名前");', '最後に console.log(msg) もしてみよう。']],
    ],
  });

  /* ---------- ts-basic ---------- */
  T['ts-basic'] = mk({
    starter: 'let count: number = "5";\nconst names: string[] = ["田中", 3];\nconst point: [number, number] = [10, "20"];\n\nlet value: unknown = "text";\n// value は unknown。文字のときだけ length を使えるようにする\n\n// user を作る：name は文字、age は数字\n',
    solution: 'let count: number = 5;\nconst names: string[] = ["田中", "鈴木"];\nconst point: [number, number] = [10, 20];\n\nlet value: unknown = "text";\nif (typeof value === "string") {\n  console.log(value.length);\n}\n\nconst user: { name: string; age: number } = { name: "ミナ", age: 20 };\nconsole.log(count, names, point, user);\n',
    tasks: [
      [1, 'count / names / point の3つの赤線を直す', (s, c) => noErr(c) && /count\s*:\s*number\s*=\s*-?\d/.test(s), ['値の型を、書いた型に合わせる。', 'count は数字、names は文字だけ、point は [数字, 数字]。']],
      [2, 'const user に { name: string; age: number } の型を付けて値を入れる', (s, c) => noErr(c) && /const\s+user\s*:\s*\{[^}]*\bname\s*:\s*string[^}]*\bage\s*:\s*number[^}]*\}\s*=\s*\{/.test(s.replace(/\s+/g, ' ')) || noErr(c) && /const\s+user\s*:\s*\{[^}]*\bage\s*:\s*number[^}]*\bname\s*:\s*string[^}]*\}\s*=\s*\{/.test(s.replace(/\s+/g, ' ')), ['オブジェクトの型は { name: string; age: number }。', 'const user: { ... } = { name: "...", age: 20 };']],
      [3, 'unknown の value を typeof で絞り込んで、value.length を使う（赤線なし）', (s, c) => noErr(c) && /typeof\s+value\s*===?\s*["'`]string["'`]/.test(s) && /value\.length/.test(s), ['unknown のままでは .length は使えない。', 'if (typeof value === "string") { ... } の中なら使える。']],
    ],
  });

  /* ---------- ts-types ---------- */
  T['ts-types'] = mk({
    starter: 'type Status = "todo" | "doing" | "done";\n\ninterface Task {\n  id: number;\n  title: string;\n  status: Status;\n}\n\nconst t: Task = { id: 1, title: "TSを学ぶ", status: "finished" }; // 赤線を直す\n\n// Task に memo?: string（なくてもよい）を足す\n// interface Admin extends Task { role: "admin" } を作って、Admin 型の const a を作る\n',
    solution: 'type Status = "todo" | "doing" | "done";\n\ninterface Task {\n  id: number;\n  title: string;\n  status: Status;\n  memo?: string;\n}\n\nconst t: Task = { id: 1, title: "TSを学ぶ", status: "doing" };\nconst t2: Task = { id: 2, title: "メモ付き", status: "todo", memo: "あとで" };\n\ninterface Admin extends Task {\n  role: "admin";\n}\n\nconst a: Admin = { id: 3, title: "管理", status: "done", role: "admin" };\nconsole.log(t, t2, a);\n',
    tasks: [
      [1, 'status の赤線を直す（Status に入る値だけ使う）', (s, c) => noErr(c) && /status\s*:\s*["'`](todo|doing|done)["'`]/.test(s), ['Status は "todo" | "doing" | "done" のどれか。', '"finished" は仲間に入っていない。']],
      [2, 'Task に memo?: string を足す（? でなくてもよい項目）', (s, c) => noErr(c) && /interface\s+Task\s*\{[^}]*\bmemo\s*\?\s*:\s*string/.test(s), ['項目名のうしろに ? を付けると省略できる。', 'memo?: string;']],
      [3, 'interface Admin extends Task { role: "admin" } を作り、const a: Admin を作る', (s, c) => noErr(c) && /interface\s+Admin\s+extends\s+Task\s*\{[^}]*\brole\s*:/.test(s) && /const\s+a\s*:\s*Admin\s*=\s*\{/.test(s), ['extends で Task の項目を引き継ぐ。', 'a には id / title / status / role をぜんぶ書く。']],
    ],
  });

  /* ---------- ts-class ---------- */
  T['ts-class'] = mk({
    starter: 'class Account {\n  balance: number = 0; // 外から触れないようにしたい\n  constructor(public owner: string) {}\n  deposit(n: number): void {\n    this.balance += n;\n  }\n}\n\nconst a = new Account("ミナ");\na.balance = 999999; // ズルができてしまう\n\n// Account を extends した Savings クラスを作る（super を呼ぶ）\n',
    solution: 'class Account {\n  private balance: number = 0;\n  constructor(public owner: string) {}\n  deposit(n: number): void {\n    this.balance += n;\n  }\n  get amount(): number {\n    return this.balance;\n  }\n}\n\nconst a = new Account("ミナ");\na.deposit(1000);\nconsole.log(a.amount);\n\nclass Savings extends Account {\n  constructor(owner: string, public rate: number) {\n    super(owner);\n  }\n}\n\nconst s = new Savings("ケン", 0.01);\nconsole.log(s.owner, s.rate);\n',
    tasks: [
      [1, 'balance を private にして、外からの代入（a.balance = …）を消す。赤線もなし', (s, c) => noErr(c) && /private\s+(readonly\s+)?balance\b/.test(s) && !/\ba\.balance\s*=/.test(s), ['private を付けると、クラスの外から触ると赤線になる。', '外から書き換える行は消して、deposit を使おう。']],
      [2, 'getter を作って、残高を外から読めるようにする（get 名前(): number）', (s, c) => noErr(c) && /\bget\s+\w+\s*\(\s*\)\s*:\s*number/.test(s), ['get を付けた関数は、プロパティのように読める。', 'get amount(): number { return this.balance; }']],
      [3, 'class Savings extends Account を作り、constructor で super(owner) を呼ぶ', (s, c) => noErr(c) && /class\s+Savings\s+extends\s+Account/.test(s) && /super\s*\(\s*owner\s*\)/.test(s), ['子クラスの constructor では、最初に super(…) で親を呼ぶ。', 'constructor(owner: string, public rate: number) { super(owner); }']],
    ],
  });

  /* ---------- ts-generics ---------- */
  T['ts-generics'] = mk({
    starter: 'function first(arr: any[]): any {\n  return arr[0];\n}\n\nconst n = first([1, 2, 3]); // any になってしまう\n\n// interface Box<T> { value: T } を作って、Box<string> の値を作る\n// longest<T extends { length: number }>(a: T, b: T) を作る\n',
    solution: 'function first<T>(arr: T[]): T {\n  return arr[0];\n}\n\nconst n = first([1, 2, 3]);\nconsole.log(n);\n\ninterface Box<T> {\n  value: T;\n}\n\nconst b: Box<string> = { value: "りんご" };\n\nfunction longest<T extends { length: number }>(a: T, b: T): T {\n  return a.length >= b.length ? a : b;\n}\n\nconsole.log(b.value, longest("ab", "abc"));\n',
    tasks: [
      [1, 'first を any ではなく <T> で書き直す（引数 T[]、戻り値 T）', (s, c) => noErr(c) && (/function\s+first\s*<\s*T\s*>\s*\(\s*arr\s*:\s*(T\[\]|Array<T>)\s*\)\s*:\s*T\b/.test(s) || /const\s+first\s*=\s*<\s*T\s*>\s*\(\s*arr\s*:\s*(T\[\]|Array<T>)\s*\)\s*:\s*T\b/.test(s)) && !/\bany\b/.test(s), ['関数名のうしろに <T> を付ける。', 'function first<T>(arr: T[]): T']],
      [2, 'interface Box<T> { value: T } を作り、const b: Box<string> に値を入れる', (s, c) => noErr(c) && /interface\s+Box\s*<\s*T\s*>\s*\{\s*value\s*:\s*T\s*;?\s*\}/.test(s.replace(/\s+/g, ' ')) && /:\s*Box<\s*string\s*>\s*=\s*\{/.test(s), ['型の中の T は、使うときに決まる。', 'Box<string> なら value は文字。']],
      [3, 'longest<T extends { length: number }>(a: T, b: T): T を作って、"ab" と "abc" で呼ぶ', (s, c) => noErr(c) && /longest\s*<\s*T\s+extends\s+\{\s*length\s*:\s*number\s*;?\s*\}\s*>\s*\(\s*a\s*:\s*T\s*,\s*b\s*:\s*T\s*\)\s*:\s*T/.test(s) && /longest\(\s*["'`]\w+["'`]\s*,\s*["'`]\w+["'`]\s*\)/.test(s), ['extends で「length を持つ型だけ」に絞る。', 'return a.length >= b.length ? a : b;']],
    ],
  });

  /* ---------- ts-test ---------- */
  T['ts-test'] = mk({
    starter: 'function isAdult(age: number): boolean {\n  return age > 18; // バグあり（18歳ちょうどが未成年になる）\n}\n\nfunction expectEqual(actual: unknown, expected: unknown, name: string): void {\n  console.log((actual === expected ? "PASS " : "FAIL ") + name);\n}\n\n// テストを書く（▶ 実行 で PASS / FAIL が出る）\n// expectEqual(isAdult(20), true, "20歳は成人");\n',
    solution: 'function isAdult(age: number): boolean {\n  return age >= 18;\n}\n\nfunction expectEqual(actual: unknown, expected: unknown, name: string): void {\n  console.log((actual === expected ? "PASS " : "FAIL ") + name);\n}\n\nexpectEqual(isAdult(20), true, "20歳は成人");\nexpectEqual(isAdult(17), false, "17歳は未成年");\nexpectEqual(isAdult(18), true, "18歳ちょうどは成人");\nexpectEqual(isAdult(-1), false, "マイナスは false");\n',
    tasks: [
      [1, 'isAdult のバグを直す（18歳以上が成人。18 を含める）', (s) => { const r = vars(s + '\n;const __f = isAdult;', ['__f']); const f = r && r.__f; return typeof f === 'function' && f(20) === true && f(17) === false && f(18) === true && f(-1) === false; }, ['「18歳以上」は 18 を含む。', 'age >= 18']],
      [2, 'expectEqual(isAdult(…), …, "…") のテストを2つ以上書く', (s, c) => noErr(c) && (s.match(/expectEqual\(\s*isAdult\(/g) || []).length >= 2, ['成人の例と未成年の例を1つずつ。', 'expectEqual(isAdult(17), false, "17歳は未成年");']],
      [3, '境界のテストも書く：isAdult(18) と isAdult(-1)、そして直した isAdult で通る', (s, c) => noErr(c) && /expectEqual\(\s*isAdult\(\s*18\s*\)/.test(s) && /expectEqual\(\s*isAdult\(\s*-1\s*\)/.test(s) && />=\s*18/.test(s), ['18 ちょうどと、ありえない値（マイナス）は、バグが隠れやすい場所。', 'マイナスの年齢は false になる。']],
    ],
  });

  /* ---------- x-js-basics ---------- */
  T['x-js-basics'] = mk({
    starter: 'const nums = [1, 2, 3, 4, 5];\n\n// 1) doubled：nums を2倍にした配列（map）\n// 2) evens：偶数だけの配列（filter）\n// 3) sum：合計（reduce）\n',
    solution: 'const nums = [1, 2, 3, 4, 5];\n\nconst doubled = nums.map((n) => n * 2);\nconst evens = nums.filter((n) => n % 2 === 0);\nconst sum = nums.reduce((a, n) => a + n, 0);\n\nconsole.log(`合計は ${sum}`, doubled, evens);\n',
    tasks: [
      [1, 'const doubled = nums.map(…) で、[2, 4, 6, 8, 10] を作る', (s, c) => { const r = vars(s, ['doubled']); return noErr(c) && /nums\.map\(/.test(s) && !!r && same(r.doubled, [2, 4, 6, 8, 10]); }, ['map は、1つずつ変えた新しい配列を返す。', 'nums.map((n) => n * 2)']],
      [2, 'const evens = nums.filter(…) で、偶数だけ [2, 4] を作る', (s, c) => { const r = vars(s, ['evens']); return noErr(c) && /nums\.filter\(/.test(s) && !!r && same(r.evens, [2, 4]); }, ['filter は、条件に合うものだけ残す。', 'n % 2 === 0 が偶数の条件。']],
      [3, 'const sum = nums.reduce(…) で合計 15 を作り、テンプレート文字列（`…${sum}`）で表示する', (s, c) => { const r = vars(s, ['sum']); return noErr(c) && /nums\.reduce\(/.test(s) && !!r && r.sum === 15 && /`[^`]*\$\{\s*sum\s*\}[^`]*`/.test(s); }, ['reduce((たまった値, 今の値) => …, 最初の値)', 'nums.reduce((a, n) => a + n, 0)']],
    ],
  });

  /* ---------- x-ts-narrow ---------- */
  T['x-ts-narrow'] = mk({
    starter: 'function len(x: string | null): number {\n  return x.length; // 赤線：null かもしれない\n}\n\nconst user: { name: string; address?: { city: string } } = { name: "ミナ" };\n\n// city：user.address?.city で安全に取り出す\n// そのうえで、city が無いときは "不明" にする（??）\n',
    solution: 'function len(x: string | null): number {\n  if (x === null) return 0;\n  return x.length;\n}\n\nconst user: { name: string; address?: { city: string } } = { name: "ミナ" };\n\nconst city = user.address?.city ?? "不明";\nconsole.log(len("abc"), len(null), city);\n',
    tasks: [
      [1, 'len の赤線を、null チェックで直す（len("abc") は 3、len(null) は 0）', (s, c) => { const r = vars(s + '\n;const __f = len;', ['__f']); const f = r && r.__f; return noErr(c) && typeof f === 'function' && f('abc') === 3 && f(null) === 0; }, ['x は null かもしれない。先に調べよう。', 'if (x === null) return 0;']],
      [2, 'user.address?.city で city を取り出す（赤線なし）', (s, c) => noErr(c) && /user\.address\?\.city/.test(s) && /const\s+city\b/.test(s), ['?. は、途中が無ければ undefined で止まる。', 'const city = user.address?.city;']],
      [3, '?? で city が無いとき "不明" になる（city の値が "不明"）', (s, c) => { const r = vars(s, ['city']); return noErr(c) && /user\.address\?\.city\s*\?\?\s*["'`]不明["'`]/.test(s) && !!r && r.city === '不明'; }, ['?? は、左が null / undefined のときだけ右を使う。', 'user.address?.city ?? "不明"']],
    ],
  });

  /* ---------- x-ts-utility ---------- */
  T['x-ts-utility'] = mk({
    starter: 'const ROLES = ["admin", "user"];\n// ROLES に as const を付けて、type Role = typeof ROLES[number]; を作る\n\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\n// updateUser(id: number, patch: Partial<User>) を作る\n// type Summary = Pick<User, "id" | "name"> を作って、値を1つ作る\n',
    solution: 'const ROLES = ["admin", "user"] as const;\ntype Role = typeof ROLES[number];\nconst r: Role = "admin";\n\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\nfunction updateUser(id: number, patch: Partial<User>): void {\n  console.log(id, patch);\n}\nupdateUser(1, { name: "ケン" });\n\ntype Summary = Pick<User, "id" | "name">;\nconst s: Summary = { id: 1, name: "ミナ" };\nconsole.log(r, s);\n',
    tasks: [
      [1, 'ROLES に as const を付けて、type Role = typeof ROLES[number] を作る', (s, c) => noErr(c) && /\]\s*as\s+const/.test(s) && /type\s+Role\s*=\s*\(?\s*typeof\s+ROLES\s*\)?\s*\[\s*number\s*\]/.test(s), ['as const を付けると、値がそのまま型になる。', 'const ROLES = ["admin", "user"] as const;']],
      [2, 'updateUser(id: number, patch: Partial<User>) を作り、{ name: "…" } だけで呼ぶ', (s, c) => noErr(c) && /function\s+updateUser\s*\(\s*id\s*:\s*number\s*,\s*patch\s*:\s*Partial<\s*User\s*>/.test(s) && /updateUser\(\s*\d+\s*,\s*\{\s*name\s*:/.test(s), ['Partial は、全部の項目を「なくてもよい」にする。', 'patch には変えたい項目だけ渡す。']],
      [3, 'type Summary = Pick<User, "id" | "name"> を作り、const s: Summary に値を入れる', (s, c) => noErr(c) && /type\s+Summary\s*=\s*Pick<\s*User\s*,\s*["'`]id["'`]\s*\|\s*["'`]name["'`]\s*>/.test(s) && /const\s+s\s*:\s*Summary\s*=\s*\{/.test(s), ['Pick は、必要な項目だけ取り出す。', 'email は入れなくてよい。']],
    ],
  });

  /* ---------- x-ts-naming ---------- */
  T['x-ts-naming'] = mk({
    starter: 'const User_name = "田中";\nfunction GetData() {}\nclass user_account {}\nconst flag = true;\n\n// 名前を直す：\n// 1) 変数 → camelCase\n// 2) 関数 → 動詞 + 名詞の camelCase（例 getUser）\n// 3) クラス → PascalCase、真偽値 → is / has で始める\n',
    solution: 'const userName = "田中";\nfunction getUser() {}\nclass UserAccount {}\nconst isActive = true;\n',
    tasks: [
      [1, '変数 User_name を camelCase（userName）にする', (s, c) => noErr(c) && /\bconst\s+userName\b/.test(s) && !/User_name/.test(s), ['最初は小文字、単語の切れ目だけ大文字。', 'const userName = "田中";']],
      [2, '関数 GetData を「動詞 + 名詞」の camelCase（getUser など）にする', (s, c) => noErr(c) && /function\s+(get|fetch|load|find|create|update|delete)[A-Z]\w*\s*\(/.test(s) && !/GetData/.test(s), ['関数は「何をするか」が分かる動詞から始める。', 'function getUser() {}']],
      [3, 'クラスを PascalCase（UserAccount）にし、真偽値 flag を is / has で始める名前にする', (s, c) => noErr(c) && /class\s+UserAccount\b/.test(s) && !/\bflag\b/.test(s) && /\bconst\s+(is|has|can)[A-Z]\w*\s*(:\s*boolean\s*)?=\s*(true|false)/.test(s), ['クラスは頭も大文字。', 'true / false の変数は isActive のように is で始める。']],
    ],
  });

  /* ---------- x-async ---------- */
  T['x-async'] = mk({
    starter: 'function wait(ms: number): Promise<string> {\n  return new Promise((resolve) => setTimeout(() => resolve("done"), ms));\n}\n\n// async function run() を作る：\n//   await wait(100) の結果を const result に入れて console.log する\n// 失敗に備えて try / catch で囲む\n// 戻り値の型を Promise<string> にして、run().then(…) で受け取る\n',
    solution: 'function wait(ms: number): Promise<string> {\n  return new Promise((resolve) => setTimeout(() => resolve("done"), ms));\n}\n\nasync function run(): Promise<string> {\n  try {\n    const result = await wait(100);\n    console.log(result);\n    return result;\n  } catch (e) {\n    console.error("失敗");\n    return "error";\n  }\n}\n\nrun().then((v) => console.log(v));\n',
    tasks: [
      [1, 'async function run() を作り、const result = await wait(…) を書く', (s, c) => noErr(c) && /async\s+function\s+run\s*\(\s*\)/.test(s) && /const\s+result\s*=\s*await\s+wait\s*\(/.test(s), ['await は async 関数の中でだけ使える。', 'const result = await wait(100);']],
      [2, 'await の部分を try { … } catch (…) { … } で囲む', (s, c) => noErr(c) && /try\s*\{[\s\S]*await\s+wait[\s\S]*\}\s*catch\s*\(/.test(s), ['失敗したら catch に来る。', 'try { const result = await wait(100); } catch (e) { … }']],
      [3, 'run の戻り値を Promise<string> にして、run().then(…) で結果を受け取る', (s, c) => noErr(c) && /async\s+function\s+run\s*\(\s*\)\s*:\s*Promise<\s*string\s*>/.test(s) && /\brun\(\s*\)\s*\.then\s*\(/.test(s), ['async 関数は、必ず Promise を返す。', 'try でも catch でも string を return しよう。']],
    ],
  });
})();
