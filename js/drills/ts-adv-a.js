(function () {
  const K = window.KENSHU;
  const clean = (c) => c.errors.length === 0;
  const ran = (c) => c.logs.length > 0;

  K.drillAdv('そのバグ、どこで見つかる？', {
    label: '料金 fee(base: number, people: number): number を作り、数字2つで呼ぶ',
    hint: ['引数も戻り値も number と書く。', 'return base * people; など。', 'console.log(fee(3000, 2)); で呼ぶ。'],
    starter: '\n\n// ③ 上級：1人あたりの料金 base と人数 people から、合計料金を返す関数 fee を作ろう（ここに書く）\n',
    solution: '\nfunction fee(base: number, people: number): number {\n  return people >= 3 ? base * people * 0.9 : base * people;\n}\nconsole.log(fee(3000, 2));\n',
    ok: (s, c) =>
      /function\s+fee\s*\(\s*base\s*:\s*number\s*,\s*people\s*:\s*number\s*\)\s*:\s*number\s*\{[\s\S]*return\s+[^;]*\*/.test(s) &&
      /\bfee\s*\(\s*\d+\s*,\s*\d+\s*\)/.test(s.replace(/function\s+fee\s*\([^)]*\)/, '')) && clean(c) && ran(c),
  });

  K.drillAdv('TS は JS に変換される', {
    label: 'js2 に、型を消した fee 関数（function fee(base, qty) …）を書く',
    hint: ['TS の fee から ": number" をぜんぶ消す。', '引数・戻り値の型の両方を消すのを忘れずに。'],
    starter: '\n\n// ③ 上級：次の TS を JS に変換して、js2 に書こう（ここに書く）\nfunction fee(base: number, qty: number): number {\n  return base * qty;\n}\nconsole.log(fee(100, 3));\nconst js2 = ``;\n',
    solution: '\nfunction fee(base: number, qty: number): number {\n  return base * qty;\n}\nconsole.log(fee(100, 3));\nconst js2 = `function fee(base, qty) {\n  return base * qty;\n}\nconsole.log(fee(100, 3));`;\n',
    ok: (s, c) => {
      const m = s.match(/const\s+js2\s*=\s*`([\s\S]*?)`/);
      const t = m ? m[1] : '';
      return /function\s+fee\s*\(\s*base\s*,\s*qty\s*\)\s*\{/.test(t) && /return\s+base\s*\*\s*qty/.test(t) && !/:\s*number/.test(t) && clean(c) && ran(c);
    },
  });

  K.drillAdv('型アノテーションの読み方', {
    label: '型付きの引数3つで、申込の要約文を返す関数 summary を作って呼ぶ',
    hint: ['function summary(plan: string, seats: number, paid: boolean): string', '文字列を + でつないで return する。', 'console.log(summary("相談", 2, true)); で呼ぶ。'],
    starter: '\n\n// ③ 上級：plan(string)・seats(number)・paid(boolean) を受け取り、string を返す summary 関数（ここに書く）\n',
    solution: '\nfunction summary(plan: string, seats: number, paid: boolean): string {\n  return plan + " " + seats + "名 " + (paid ? "支払い済み" : "未払い");\n}\nconsole.log(summary("相談", 2, true));\n',
    ok: (s, c) =>
      /function\s+summary\s*\(\s*\w+\s*:\s*string\s*,\s*\w+\s*:\s*number\s*,\s*\w+\s*:\s*boolean\s*\)\s*:\s*string/.test(s) &&
      /\bsummary\s*\(\s*["'`][^)]*,[^)]*,[^)]*\)/.test(s.replace(/function\s+summary\s*\([^)]*\)/, '')) && clean(c) && ran(c),
  });

  K.drillAdv('型の箱に値を入れよう', {
    label: 'feeText を Number で number の fee にし、税込 withTax を出力する',
    hint: ['const fee: number = Number(feeText);', 'const withTax: number = Math.round(fee * 1.1);', 'console.log(withTax); で出力する。'],
    starter: '\n\n// ③ 上級：フォームから届いた料金の文字を、数字に直して税込にしよう（ここに書く）\nconst feeText: string = "3000";\n',
    solution: '\nconst feeText: string = "3000";\nconst fee: number = Number(feeText);\nconst withTax: number = Math.round(fee * 1.1);\nconsole.log(withTax);\n',
    ok: (s, c) =>
      /const\s+feeText\s*:\s*string\s*=\s*["'`]\d+["'`]/.test(s) &&
      /const\s+fee\s*:\s*number\s*=\s*Number\s*\(\s*feeText\s*\)/.test(s) &&
      /const\s+withTax\s*:\s*number\s*=\s*[^;]*\bfee\b[^;]*\*/.test(s) &&
      /console\.log\s*\([^)]*withTax/.test(s) && clean(c) && ran(c),
  });

  K.drillAdv('型推論：どこまで書く？', {
    label: '割引後の料金 discounted(price, rate): number を作り、中は型を書かない',
    hint: ['引数 2つと戻り値には型を書く。', '中の const には型を書かず、推論に任せる。', 'console.log(discounted(5000, 0.2)); で呼ぶ。'],
    starter: '\n\n// ③ 上級：price と rate（割引率）から割引後の料金を返す discounted 関数。中の変数は推論に任せる（ここに書く）\n',
    solution: '\nfunction discounted(price: number, rate: number): number {\n  const off = price * rate;\n  const result = price - off;\n  return result;\n}\nconsole.log(discounted(5000, 0.2));\n',
    ok: (s, c) => {
      const m = s.match(/function\s+discounted\s*\(\s*price\s*:\s*number\s*,\s*rate\s*:\s*number\s*\)\s*:\s*number\s*\{([\s\S]*?)\n\}/);
      const body = m ? m[1] : '';
      return !!m && /\b(const|let)\s+\w+\s*=/.test(body) && !/\b(const|let)\s+\w+\s*:/.test(body) && /return\b/.test(body) &&
        /\bdiscounted\s*\(\s*[\d.]+\s*,\s*[\d.]+\s*\)/.test(s.replace(/function\s+discounted\s*\([^)]*\)/, '')) && clean(c) && ran(c);
    },
  });

  K.drillAdv('配列・タプル・オブジェクト', {
    label: '{ title; fee } の配列 menu を作り、for で fee を足して合計を出力する',
    hint: ['const menu: { title: string; fee: number }[] = [ … ];', '要素は { title: "初回相談", fee: 0 } のように2つ以上。', 'let menuTotal = 0; の後に for で menuTotal += menu[i].fee;'],
    starter: '\n\n// ③ 上級：相談メニュー（title と fee を持つオブジェクト）の配列を作り、料金の合計を求めよう（ここに書く）\n',
    solution: '\nconst menu: { title: string; fee: number }[] = [\n  { title: "初回相談", fee: 0 },\n  { title: "契約書チェック", fee: 5000 },\n];\nlet menuTotal = 0;\nfor (let i = 0; i < menu.length; i++) {\n  menuTotal += menu[i].fee;\n}\nconsole.log(menuTotal);\n',
    ok: (s, c) =>
      /const\s+menu\s*:\s*\{\s*title\s*:\s*string\s*[;,]\s*fee\s*:\s*number\s*[;,]?\s*\}\s*\[\s*\]\s*=\s*\[/.test(s) &&
      (s.match(/title\s*:\s*["'`]/g) || []).length >= 2 &&
      /\bfor\s*\(/.test(s.replace(/for\s*\(\s*let\s+i\s*=\s*0\s*;\s*i\s*<\s*(prices|lawyers)/g, '')) &&
      /\+=\s*[\w\[\]]+\.fee\b/.test(s) && /console\.log\s*\([^)]*menuTotal/.test(s) && clean(c) && ran(c),
  });

  K.drillAdv('any と unknown', {
    label: 'unknown を受け取る shout(v): string を作り、文字と数字の両方で呼ぶ',
    hint: ['function shout(v: unknown): string { … }', 'if (typeof v === "string") の中だけ v.toUpperCase() が使える。', 'shout("abc") と shout(42) を呼んで console.log する。'],
    starter: '\n\n// ③ 上級：何が来るか分からない値 v を受け取り、文字列なら大文字にして返す shout 関数（ここに書く）\n',
    solution: '\nfunction shout(v: unknown): string {\n  if (typeof v === "string") {\n    return v.toUpperCase();\n  }\n  return "(文字ではありません)";\n}\nconsole.log(shout("abc"), shout(42));\n',
    ok: (s, c) => {
      const m = s.match(/function\s+shout\s*\(\s*\w+\s*:\s*unknown\s*\)\s*:\s*string\s*\{([\s\S]*?)\n\}/);
      return !!m && /typeof\s+\w+\s*===\s*["']string["']/.test(m[1]) && /return\b/.test(m[1]) &&
        (s.match(/\bshout\s*\(/g) || []).length >= 3 && clean(c) && ran(c);
    },
  });

  K.drillAdv('値がない型：void / undefined / null', {
    label: '料金を探す lookupFee(title): number | null を作り、null を確かめて使う',
    hint: ['function lookupFee(title: string): number | null', '見つからないときは null を返す。', 'const got = lookupFee("…"); if (got !== null) { … } else { … }'],
    starter: '\n\n// ③ 上級：title から料金を探し、無ければ null を返す lookupFee 関数と、結果を安全に使う if（ここに書く）\n',
    solution: '\nfunction lookupFee(title: string): number | null {\n  return title === "初回相談" ? 0 : null;\n}\nconst got = lookupFee("契約書チェック");\nif (got !== null) {\n  console.log(got + 100);\n} else {\n  console.log("料金が見つかりません");\n}\n',
    ok: (s, c) =>
      /function\s+lookupFee\s*\(\s*\w+\s*:\s*string\s*\)\s*:\s*number\s*\|\s*null/.test(s) &&
      /return\s+[^;]*\bnull\b/.test(s.split(/function\s+lookupFee/)[1] || '') &&
      /const\s+(\w+)\s*=\s*lookupFee\s*\(/.test(s) &&
      (() => { const m = s.match(/const\s+(\w+)\s*=\s*lookupFee\s*\(/); return !!m && new RegExp('\\b' + m[1] + '\\s*!==?\\s*null|null\\s*!==?\\s*' + m[1]).test(s); })() &&
      clean(c) && ran(c),
  });

  K.drillAdv('Box<T> マシン', {
    label: '値を包んで Box<T> を返す関数 boxOf<T> を作り、文字列で使う',
    hint: ['function boxOf<T>(v: T): Box<T> { … }', '中で new Box<T>(v) を return する。', 'const nameBox = boxOf("田中"); なら nameBox.value は string。'],
    starter: '\n\n// ③ 上級：どんな値でも Box に包んで返す関数 boxOf<T> を作り、文字列を包んで中身の長さを出力しよう（ここに書く）\n',
    solution: '\nfunction boxOf<T>(v: T): Box<T> {\n  return new Box<T>(v);\n}\nconst nameBox = boxOf("田中");\nconsole.log(nameBox.value.length);\n',
    ok: (s, c) =>
      /function\s+boxOf\s*<\s*T\s*>\s*\(\s*\w+\s*:\s*T\s*\)\s*:\s*Box\s*<\s*T\s*>/.test(s) &&
      /return\s+new\s+Box\s*<\s*T\s*>\s*\(\s*\w+\s*\)/.test(s) &&
      /const\s+\w+\s*=\s*boxOf\s*\(\s*["'`]/.test(s) && /\.value\.\w+/.test(s) && clean(c) && ran(c),
  });

  K.drillAdv('identity<T>：入れた型が出てくる', {
    label: '型が2つの pair<A, B>(a, b): [A, B] を作り、結果を使う',
    hint: ['function pair<A, B>(a: A, b: B): [A, B]', '[a, b] を return する。', 'const pr = pair("相談", 3000); pr[0] は string、pr[1] は number。'],
    starter: '\n\n// ③ 上級：型パラメータを2つ持つ pair 関数を作ろう。入れた2つの型がそのまま出てくる（ここに書く）\n',
    solution: '\nfunction pair<A, B>(a: A, b: B): [A, B] {\n  return [a, b];\n}\nconst pr = pair("相談", 3000);\nconsole.log(pr[0].length, pr[1] + 1);\n',
    ok: (s, c) =>
      /function\s+pair\s*<\s*A\s*,\s*B\s*>\s*\(\s*a\s*:\s*A\s*,\s*b\s*:\s*B\s*\)\s*:\s*\[\s*A\s*,\s*B\s*\]/.test(s) &&
      /return\s*\[\s*a\s*,\s*b\s*\]/.test(s) &&
      /const\s+\w+\s*=\s*pair\s*\(\s*["'`\d][^)]*,/.test(s) && clean(c) && ran(c),
  });
})();
