/* 上級ミッション（ts-test / x-ts-narrow / x-ts-utility の13シーン） */
(function () {
  const K = window.KENSHU;
  const count = (s, re) => (s.match(re) || []).length;
  // エラー0・何か実行されて・失敗した expect / throw（k === 'e'）が無い
  const good = (c) => c.errors.length === 0 && c.logs.length > 0 && !c.logs.some((l) => l.k === 'e');

  K.drillAdv('なぜテストを書くの？', {
    label: '割引後の価格を返す applyDiscount を書き、if + throw で確かめる',
    hint: ['applyDiscount(price: number, rate: number): number。1000 を 20% 引くと 800。', 'Math.round(price * (1 - rate)) を返す。', 'if (applyDiscount(1000, 0.2) !== 800) { throw new Error("…"); }'],
    starter: '\n\n// ③ 上級：料金計算 applyDiscount(price, rate) を書き、テストで確かめる（ここに書く）\n',
    solution: '\nfunction applyDiscount(price: number, rate: number): number {\n  return Math.round(price * (1 - rate));\n}\nif (applyDiscount(1000, 0.2) !== 800) {\n  throw new Error("applyDiscount が間違っています");\n}\nconsole.log("割引 OK");\n',
    ok: (s, c) => /function\s+applyDiscount\s*\(\s*price\s*:\s*number\s*,\s*rate\s*:\s*number\s*\)\s*:\s*number/.test(s) && /if\s*\(\s*applyDiscount\s*\([^)]*\)\s*!==?\s*\d+\s*\)\s*\{?\s*throw\s+new\s+Error/.test(s) && good(c),
  });

  K.drillAdv('テストの種類', {
    label: 'type TestKind と Record<TestKind, number> で、種類ごとのコストを表す',
    hint: ['type TestKind = "unit" | "integration" | "e2e";', 'const COST: Record<TestKind, number> = { ... } に3つとも書く。', 'unit は小さく、e2e は大きい数にして console.log で比べる。'],
    starter: '\n\n// ③ 上級：種類ごとの「実行コスト」を型で表す（ここに書く）\n',
    solution: '\ntype TestKind = "unit" | "integration" | "e2e";\nconst COST: Record<TestKind, number> = {\n  unit: 1,\n  integration: 10,\n  e2e: 100,\n};\nconsole.log(COST.unit < COST.e2e);\n',
    ok: (s, c) => /type\s+TestKind\s*=\s*["']\w+["']\s*\|\s*["']\w+["']\s*\|\s*["']\w+["']/.test(s) && /const\s+COST\s*:\s*Record\s*<\s*TestKind\s*,\s*number\s*>\s*=\s*\{[^}]*unit\s*:\s*\d+[^}]*integration\s*:\s*\d+[^}]*e2e\s*:\s*\d+/.test(s) && good(c),
  });

  K.drillAdv('ユニットテストの流れ', {
    label: '[年齢, 期待値] の表を作り、for...of で isAdult を一括テストする',
    hint: ['const cases: [number, boolean][] = [[19, false], [20, true], ...];', 'for (const [age, expected] of cases) { ... }', '結果が expected と違えば throw new Error(...)'],
    starter: '\n\n// ③ 上級：テストケースを表にして、ループでまとめて確かめる（ここに書く）\n',
    solution: '\nconst cases: [number, boolean][] = [[19, false], [20, true], [30, true]];\nfor (const [age, expected] of cases) {\n  if (isAdult(age) !== expected) {\n    throw new Error("isAdult(" + age + ") が期待と違います");\n  }\n}\nconsole.log("全ケース OK");\n',
    ok: (s, c) => /const\s+cases\s*:\s*\[\s*number\s*,\s*boolean\s*\]\s*\[\s*\]\s*=\s*\[/.test(s) && /for\s*\(\s*const\s*\[[^\]]+\]\s+of\s+cases\s*\)/.test(s) && /isAdult\s*\(\s*\w+\s*\)\s*!==?\s*\w+/.test(s) && /throw\s+new\s+Error/.test(s) && good(c),
  });

  K.drillAdv('Vitest をセットアップ', {
    label: '境界値用に describe を足し、0 と負の数の it を2つ書く',
    hint: ['describe("double の境界値", () => { ... }) を足す。', '中に it を2つ。expect(double(0)).toBe(0)', 'もう1つは負の数：expect(double(-3)).toBe(-6)'],
    starter: '\n\n// ③ 上級：境界値（0 と負の数）を確かめる describe を足す（ここに書く）\n',
    solution: '\ndescribe("double の境界値", () => {\n  it("0 は 0", () => {\n    expect(double(0)).toBe(0);\n  });\n  it("負の数も2倍", () => {\n    expect(double(-3)).toBe(-6);\n  });\n});\n',
    ok: (s, c) => count(s, /\bdescribe\s*\(\s*["'`]/g) >= 2 && count(s, /\bit\s*\(\s*["'`]/g) >= 3 && /expect\s*\(\s*double\s*\(\s*0\s*\)\s*\)\s*\.toBe\s*\(\s*-?0\s*\)/.test(s) && /expect\s*\(\s*double\s*\(\s*-\d+\s*\)\s*\)\s*\.toBe\s*\(\s*-\d+\s*\)/.test(s) && good(c),
  });

  K.drillAdv('TDD：赤 → 緑 → 赤 → 緑', {
    label: '次のサイクル：cube のテスト（2 と -2）を先に書いてから実装する',
    hint: ['まず expect(cube(2)).toBe(8) と expect(cube(-2)).toBe(-8) を書く。', 'function cube(n: number): number を用意（最初は return 0 で赤）。', '最後に return n * n * n; で緑にする。'],
    starter: '\n\n// ③ 上級：もう1周。cube(n)（3乗）を、テスト → 実装の順で作る（ここに書く）\n',
    solution: '\nexpect(cube(2)).toBe(8);\nexpect(cube(-2)).toBe(-8);\nfunction cube(n: number): number {\n  return n * n * n;\n}\nconsole.log("cube OK");\n',
    ok: (s, c) => /function\s+cube\s*\(\s*n\s*:\s*number\s*\)\s*:\s*number\s*\{\s*return\s+(n\s*\*\s*n\s*\*\s*n|n\s*\*\*\s*3)/.test(s) && /expect\s*\(\s*cube\s*\(\s*2\s*\)\s*\)\s*\.toBe\s*\(\s*8\s*\)/.test(s) && /expect\s*\(\s*cube\s*\(\s*-2\s*\)\s*\)\s*\.toBe\s*\(\s*-8\s*\)/.test(s) && good(c),
  });

  K.drillAdv('テストの型：Arrange → Act → Assert', {
    label: '税込合計 calcTotal を作り、AAA の3ステップで it を書く',
    hint: ['calcTotal(price, qty, taxRate): number は Math.round(price * qty * (1 + taxRate))。', 'it の中で Arrange：price=1000, qty=3, taxRate=0.1 を const に。', 'Act：const total = calcTotal(...)、Assert：expect(total).toBe(3300)'],
    starter: '\n\n// ③ 上級：calcTotal を作り、Arrange / Act / Assert に分けたテストを書く（ここに書く）\n',
    solution: '\nfunction calcTotal(price: number, qty: number, taxRate: number): number {\n  return Math.round(price * qty * (1 + taxRate));\n}\nit("1000円を3個で税込3300円", () => {\n  const price = 1000;\n  const qty = 3;\n  const taxRate = 0.1;\n  const total = calcTotal(price, qty, taxRate);\n  expect(total).toBe(3300);\n});\n',
    ok: (s, c) => /function\s+calcTotal\s*\(\s*price\s*:\s*number\s*,\s*qty\s*:\s*number\s*,\s*taxRate\s*:\s*number\s*\)\s*:\s*number/.test(s) && /\bit\s*\(\s*["'`][^"'`]*["'`]\s*,[^]*?const\s+\w+\s*=\s*[\d.]+\s*;[^]*?const\s+\w+\s*=\s*[\d.]+\s*;[^]*?const\s+\w+\s*=\s*calcTotal\s*\([^]*?expect\s*\(\s*\w+\s*\)\s*\.toBe\s*\(\s*3300\s*\)/.test(s.slice(s.indexOf('function calcTotal') >= 0 ? s.indexOf('function calcTotal') : 0)) && good(c),
  });

  K.drillAdv('ミニテストランナー', {
    label: 'clampAge（0〜120に収める）を書き、it を3つで確かめる',
    hint: ['clampAge(age: number): number は Math.min(Math.max(age, 0), 120)。', '下限・ふつう・上限：-5 → 0、30 → 30、200 → 120。', 'it を3つ書き、それぞれ expect(clampAge(...)).toBe(...)'],
    starter: '\n\n// ③ 上級：clampAge を作り、境界を3つの it で確かめる（ここに書く）\n',
    solution: '\nfunction clampAge(age: number): number {\n  return Math.min(Math.max(age, 0), 120);\n}\nit("負の数は 0", () => {\n  expect(clampAge(-5)).toBe(0);\n});\nit("ふつうの値はそのまま", () => {\n  expect(clampAge(30)).toBe(30);\n});\nit("大きすぎる値は 120", () => {\n  expect(clampAge(200)).toBe(120);\n});\n',
    ok: (s, c) => /function\s+clampAge\s*\(\s*age\s*:\s*number\s*\)\s*:\s*number/.test(s) && /Math\.(min|max)/.test(s) && count(s, /expect\s*\(\s*clampAge\s*\(/g) >= 3 && count(s, /\bit\s*\(\s*["'`]/g) >= 6 && good(c),
  });

  K.drillAdv('describe / it / expect 早見表', {
    label: '合計 total を作り、toBe と toEqual（配列）の両方で確かめる',
    hint: ['const cart = [{ name: "本", price: 1200 }, { name: "ペン", price: 150 }];', 'total(items: { price: number }[]): number は reduce で足す。', 'expect(total(cart)).toBe(1350) と expect(cart.map(...)).toEqual([...])'],
    starter: '\n\n// ③ 上級：カートの合計を計算する関数と、2種類の expect を書く（ここに書く）\n',
    solution: '\nconst cart = [\n  { name: "本", price: 1200 },\n  { name: "ペン", price: 150 },\n];\nfunction total(items: { price: number }[]): number {\n  return items.reduce((sum, i) => sum + i.price, 0);\n}\nit("合計", () => {\n  expect(total(cart)).toBe(1350);\n});\nit("名前の一覧", () => {\n  expect(cart.map((i) => i.name)).toEqual(["本", "ペン"]);\n});\n',
    ok: (s, c) => /function\s+total\s*\(\s*items\s*:\s*[^)]*\)\s*:\s*number/.test(s) && /\.reduce\s*\(/.test(s) && /expect\s*\(\s*total\s*\(\s*cart\s*\)\s*\)\s*\.toBe\s*\(\s*1350\s*\)/.test(s) && /\.toEqual\s*\(\s*\[/.test(s) && good(c),
  });

  K.drillAdv('どの型に何が入る？', {
    label: 'unknown を受けて number を返す parseAge を typeof で書く',
    hint: ['function parseAge(input: unknown): number { ... }', 'typeof input === "number" ならそのまま返す。', 'typeof input === "string" なら Number(input)。ダメなら -1 を返す。'],
    starter: '\n\n// ③ 上級：unknown を安全に number にする関数 parseAge を書く（ここに書く）\n',
    solution: '\nfunction parseAge(input: unknown): number {\n  if (typeof input === "number") {\n    return input;\n  }\n  if (typeof input === "string") {\n    const v = Number(input);\n    if (!isNaN(v)) {\n      return v;\n    }\n  }\n  return -1;\n}\nconsole.log(parseAge("20"), parseAge(true));\n',
    ok: (s, c) => /function\s+parseAge\s*\(\s*input\s*:\s*unknown\s*\)\s*:\s*number/.test(s) && /typeof\s+input\s*===\s*["']number["']/.test(s) && /typeof\s+input\s*===\s*["']string["']/.test(s) && count(s, /parseAge\s*\(/g) >= 2 && good(c),
  });

  K.drillAdv('絞り込み（narrowing）', {
    label: 'kind で分かれる Shape 型と、絞り込んで面積を返す area を書く',
    hint: ['type Shape = { kind: "circle"; r: number } | { kind: "rect"; w: number; h: number };', 'function area(s: Shape): number で if (s.kind === "circle") と分ける。', 'circle は Math.round(Math.PI * s.r * s.r)、rect は s.w * s.h'],
    starter: '\n\n// ③ 上級：kind で分かれる型を、絞り込んで使う（ここに書く）\n',
    solution: '\ntype Shape = { kind: "circle"; r: number } | { kind: "rect"; w: number; h: number };\nfunction area(s: Shape): number {\n  if (s.kind === "circle") {\n    return Math.round(Math.PI * s.r * s.r);\n  }\n  return s.w * s.h;\n}\nconsole.log(area({ kind: "rect", w: 2, h: 3 }), area({ kind: "circle", r: 1 }));\n',
    ok: (s, c) => /type\s+Shape\s*=\s*\{\s*kind\s*:\s*["']circle["']/.test(s) && /\|\s*\{\s*kind\s*:\s*["']rect["']/.test(s) && /function\s+area\s*\(\s*s\s*:\s*Shape\s*\)\s*:\s*number/.test(s) && /s\.kind\s*===\s*["'](circle|rect)["']|case\s+["'](circle|rect)["']/.test(s) && /s\.(w|r)\b/.test(s) && good(c),
  });

  K.drillAdv('?. と ??', {
    label: 'cityOf(user: User) を書き、?. と ?? で「未登録」を返す',
    hint: ['function cityOf(user: User): string { ... }', 'user.address?.city で安全に取り出す。', '無いときの代わりは ?? "未登録"'],
    starter: '\n\n// ③ 上級：住所が無くても落ちない cityOf を書く（ここに書く）\n',
    solution: '\nfunction cityOf(user: User): string {\n  return user.address?.city ?? "未登録";\n}\nconsole.log(cityOf(u), cityOf({ name: "花子", address: { city: "東京" } }));\n',
    ok: (s, c) => /function\s+cityOf\s*\(\s*user\s*:\s*User\s*\)\s*:\s*string/.test(s) && /user\.address\?\.city\s*\?\?\s*["'][^"']+["']/.test(s) && count(s, /cityOf\s*\(/g) >= 2 && good(c),
  });

  K.drillAdv('as const：値をそのまま型に', {
    label: 'PLANS を as const にし、keyof typeof で Plan 型と price 関数を作る',
    hint: ['const PLANS = { free: 0, pro: 980 } as const;', 'type Plan = keyof typeof PLANS;', 'function price(plan: Plan): number { return PLANS[plan]; }'],
    starter: '\n\n// ③ 上級：料金表から、プラン名の型を取り出す（ここに書く）\n',
    solution: '\nconst PLANS = { free: 0, pro: 980 } as const;\ntype Plan = keyof typeof PLANS;\nfunction price(plan: Plan): number {\n  return PLANS[plan];\n}\nconsole.log(price("pro"));\n',
    ok: (s, c) => /const\s+PLANS\s*=\s*\{[^}]*\}\s*as\s+const/.test(s) && /type\s+Plan\s*=\s*keyof\s+typeof\s+PLANS/.test(s) && /function\s+price\s*\(\s*plan\s*:\s*Plan\s*\)\s*:\s*number\s*\{\s*return\s+PLANS\s*\[\s*plan\s*\]/.test(s) && good(c),
  });

  K.drillAdv('組み合わせ：権限チェック', {
    label: 'Record<Role, Action[]> の PERMS と、can(role, action) を書く',
    hint: ['type Action = "read" | "write" | "delete";', 'const PERMS: Record<Role, Action[]> = { admin: [...], editor: [...], viewer: [...] };', 'function can(role: Role, action: Action): boolean { return PERMS[role].indexOf(action) >= 0; }'],
    starter: '\n\n// ③ 上級：ロールごとに「できる操作」の一覧を持たせる（ここに書く）\n',
    solution: '\ntype Action = "read" | "write" | "delete";\nconst PERMS: Record<Role, Action[]> = {\n  admin: ["read", "write", "delete"],\n  editor: ["read", "write"],\n  viewer: ["read"],\n};\nfunction can(role: Role, action: Action): boolean {\n  return PERMS[role].indexOf(action) >= 0;\n}\nconsole.log(can("viewer", "delete"), can("editor", "write"));\n',
    ok: (s, c) => /type\s+Action\s*=\s*["']\w+["']\s*\|\s*["']\w+["']/.test(s) && /const\s+PERMS\s*:\s*Record\s*<\s*Role\s*,\s*Action\s*\[\s*\]\s*>\s*=\s*\{/.test(s) && /function\s+can\s*\(\s*role\s*:\s*Role\s*,\s*action\s*:\s*Action\s*\)\s*:\s*boolean\s*\{[^}]*PERMS\s*\[\s*role\s*\]\s*\.(includes|indexOf)\s*\(\s*action\s*\)/.test(s) && good(c),
  });
})();
