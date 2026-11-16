(function () {
  const K = window.KENSHU;
  const good = (c) => c.errors.length === 0 && c.logs.length > 0;

  K.drillAdv('Union：どれか1つ', {
    label: 'kind で見分ける Union の Reply 型と、返事の文を作る関数を書く',
    hint: [
      'type Reply = { kind: "ok"; fee: number } | { kind: "ng"; reason: string }',
      '関数の中で r.kind === "ok" と調べると、fee が使えるようになる。',
      'console.log(replyText({ kind: "ok", fee: 3000 }), replyText({ kind: "ng", reason: "満席" }));'
    ],
    starter: '\n// ③ 上級：kind で見分ける Union\n// type Reply = ...（ok なら fee、ng なら reason）\n// function replyText(r: Reply): string { ... }\n',
    solution: '\ntype Reply = { kind: "ok"; fee: number } | { kind: "ng"; reason: string };\nfunction replyText(r: Reply): string {\n  if (r.kind === "ok") {\n    return r.fee + "円です";\n  }\n  return r.reason;\n}\nconsole.log(replyText({ kind: "ok", fee: 3000 }), replyText({ kind: "ng", reason: "満席" }));\n',
    ok: (s, c) =>
      /type\s+Reply\s*=\s*\{[^}]*kind\s*:\s*["'][^"']+["'][^}]*\}\s*\|\s*\{[^}]*kind\s*:\s*["'][^"']+["'][^}]*\}/.test(s) &&
      /function\s+replyText\s*\(\s*r\s*:\s*Reply\s*\)/.test(s) && /\.kind\s*===/.test(s) && good(c)
  });

  K.drillAdv('Enum：名前の付いた定数', {
    label: 'switch で Status ごとの表示文を返す statusLabel 関数を書く',
    hint: [
      'function statusLabel(s: Status): string { switch (s) { ... } }',
      'case Status.Received: return "受付済み"; を3つ並べる。',
      'console.log(statusLabel(Status.Done)); で動かす。'
    ],
    starter: '\n// ③ 上級：Status を日本語にする\n// function statusLabel(s: Status): string { switch (s) { ... } }\n',
    solution: '\nfunction statusLabel(s: Status): string {\n  switch (s) {\n    case Status.Received:\n      return "受付済み";\n    case Status.Reviewing:\n      return "対応中";\n    case Status.Done:\n      return "完了";\n  }\n}\nconsole.log(statusLabel(Status.Done));\n',
    ok: (s, c) =>
      /function\s+statusLabel\s*\(\s*\w+\s*:\s*Status\s*\)\s*:\s*string/.test(s) && /switch\s*\(/.test(s) &&
      (s.match(/case\s+Status\.\w+\s*:/g) || []).length >= 3 && /console\.log\([^)]*statusLabel\s*\(/.test(s) && good(c)
  });

  K.drillAdv('interface：形チェッカー', {
    label: 'interface Lawyer と、それを中に持つ Appointment を作って使う',
    hint: [
      'interface Lawyer { name: string; fields: string[] } を作る。',
      'interface Appointment { lawyer: Lawyer; time: string; memo?: string } と、interface の中で interface を使う。',
      'Appointment 型の値を作って console.log する。'
    ],
    starter: '\n// ③ 上級：入れ子の interface\n// interface Lawyer { ... }\n// interface Appointment { ... }  ← lawyer: Lawyer を持つ。memo は省略可\n',
    solution: '\ninterface Lawyer {\n  name: string;\n  fields: string[];\n}\ninterface Appointment {\n  lawyer: Lawyer;\n  time: string;\n  memo?: string;\n}\nconst ap: Appointment = { lawyer: { name: "山田", fields: ["相続", "離婚"] }, time: "10:00" };\nconsole.log(ap.lawyer.name, ap.time);\n',
    ok: (s, c) =>
      /interface\s+Lawyer\s*\{[^}]*name\s*:\s*string[^}]*fields\s*:\s*string\[\]/.test(s) &&
      /interface\s+Appointment\s*\{[^}]*lawyer\s*:\s*Lawyer[^}]*time\s*:\s*string/.test(s) &&
      /interface\s+Appointment\s*\{[^}]*memo\s*\?\s*:/.test(s) &&
      /:\s*Appointment\s*=\s*\{/.test(s) && good(c)
  });

  K.drillAdv('extends と merge', {
    label: '2つの interface を同時に extends した PaidBooking を作る',
    hint: [
      'interface Paid { amount: number } を作る。',
      'interface PaidBooking extends Booking, Paid {} と、カンマで2つ並べられる。',
      'const p: PaidBooking = { id, title, time, amount } を作って console.log。'
    ],
    starter: '\n// ③ 上級：2つを extends\n// interface Paid { amount: number }\n// interface PaidBooking extends Booking, Paid { }\n',
    solution: '\ninterface Paid {\n  amount: number;\n}\ninterface PaidBooking extends Booking, Paid {}\nconst p: PaidBooking = { id: 2, title: "離婚の相談", time: "11:00", amount: 5000 };\nconsole.log(p);\n',
    ok: (s, c) =>
      /interface\s+Paid\s*\{[^}]*amount\s*:\s*number/.test(s) &&
      /interface\s+PaidBooking\s+extends\s+\w+\s*,\s*\w+/.test(s) &&
      /const\s+p\s*:\s*PaidBooking\s*=\s*\{[^}]*amount\s*:/.test(s) && good(c)
  });

  K.drillAdv('interface vs type', {
    label: 'type と & で、User に permissions を足した Admin 型を作る',
    hint: [
      'type Admin = User & { permissions: string[] }',
      '& は「両方の形を満たす」という意味（交差型）。',
      'const ad: Admin = { id: 2, role: "admin", permissions: ["read"] } を作って console.log。'
    ],
    starter: '\n// ③ 上級：type で形を合体\n// type Admin = User & { ... }\n',
    solution: '\ntype Admin = User & { permissions: string[] };\nconst ad: Admin = { id: 2, role: "admin", permissions: ["read", "write"] };\nconsole.log(ad);\n',
    ok: (s, c) =>
      /type\s+Admin\s*=\s*User\s*&\s*\{[^}]*permissions\s*:\s*string\[\]/.test(s) &&
      /const\s+ad\s*:\s*Admin\s*=/.test(s) && good(c)
  });

  K.drillAdv('クラス = 設計図、new = スタンプ', {
    label: 'Booking を溜める class Room を作り、合計人数を出す',
    hint: [
      'class Room { private list: Booking[] = []; ... }',
      'add(b: Booking): void で this.list.push(b)、totalPeople(): number で合計する。',
      'new Room() に a と b を add して console.log(room.totalPeople())。'
    ],
    starter: '\n// ③ 上級：Booking を溜めるクラス\n// class Room { private list: Booking[] = []; add(...) {...} totalPeople() {...} }\n',
    solution: '\nclass Room {\n  private list: Booking[] = [];\n  add(b: Booking): void {\n    this.list.push(b);\n  }\n  totalPeople(): number {\n    let n = 0;\n    for (const b of this.list) {\n      n += b.people;\n    }\n    return n;\n  }\n}\nconst room = new Room();\nroom.add(a);\nroom.add(b);\nconsole.log(room.totalPeople());\n',
    ok: (s, c) =>
      /class\s+Room\s*\{[\s\S]*Booking\[\]/.test(s) && /this\.\w+\.push\s*\(/.test(s) &&
      /totalPeople\s*\(\s*\)\s*:\s*number/.test(s) && /new\s+Room\s*\(\s*\)/.test(s) &&
      /\.add\s*\(/.test(s) && /console\.log\([^)]*totalPeople\s*\(/.test(s) && good(c)
  });

  K.drillAdv('アクセス修飾子：誰が触れる？', {
    label: 'Account を継ぐ Premium で、protected の rank を使う describe を書く',
    hint: [
      'class Premium extends Account { ... }',
      'protected は子クラスの中なら this.rank で読める。',
      'describe(): string で this.owner と this.rank をつなげ、new Premium() で呼ぶ。'
    ],
    starter: '\n// ③ 上級：子クラスから protected を使う\n// class Premium extends Account { describe(): string { ... } }\n',
    solution: '\nclass Premium extends Account {\n  describe(): string {\n    return this.owner + " のランクは " + this.rank;\n  }\n}\nconst pm = new Premium();\nconsole.log(pm.describe());\n',
    ok: (s, c) =>
      /class\s+Premium\s+extends\s+Account\s*\{[\s\S]*this\.rank/.test(s) &&
      /describe\s*\(\s*\)\s*(:\s*string\s*)?\{/.test(s) &&
      /new\s+Premium\s*\(\s*\)/.test(s) && /\.describe\s*\(\s*\)/.test(s) && good(c)
  });

  K.drillAdv('readonly：書き換え禁止', {
    label: 'readonly の配列も持つ class Receipt を作って new する',
    hint: [
      'class Receipt { constructor(readonly no: number, readonly items: readonly string[]) {} }',
      'readonly string[] は、中身の追加（push）も禁止する配列型。',
      'new Receipt(1, ["相談料"]) を作って console.log。'
    ],
    starter: '\n// ③ 上級：中身も書き換え禁止\n// class Receipt { constructor(readonly no: number, readonly items: ...) {} }\n',
    solution: '\nclass Receipt {\n  constructor(readonly no: number, readonly items: readonly string[]) {}\n}\nconst rc = new Receipt(1, ["相談料", "印紙代"]);\nconsole.log(rc.no, rc.items);\n',
    ok: (s, c) =>
      /class\s+Receipt\s*\{[^}]*readonly\s+no\s*:\s*number[^}]*readonly\s+items\s*:\s*readonly\s+string\[\]/.test(s) &&
      /new\s+Receipt\s*\(\s*\d+\s*,\s*\[/.test(s) && good(c)
  });

  K.drillAdv('getter / setter：門番を置く', {
    label: 'Price クラスに yen の get/set と、税込を返す get withTax を作る',
    hint: [
      'class Price { private _yen = 0; get yen() ...; set yen(v) ... }',
      'set yen では、0 未満なら throw new Error してから this._yen に代入。',
      'get withTax(): number { return Math.floor(this._yen * 1.1); } を足して console.log。'
    ],
    starter: '\n// ③ 上級：税込みを返す getter\n// class Price { private _yen = 0; get yen... set yen... get withTax... }\n',
    solution: '\nclass Price {\n  private _yen = 0;\n  get yen(): number {\n    return this._yen;\n  }\n  set yen(v: number) {\n    if (v < 0) {\n      throw new Error("マイナスは不可");\n    }\n    this._yen = v;\n  }\n  get withTax(): number {\n    return Math.floor(this._yen * 1.1);\n  }\n}\nconst price = new Price();\nprice.yen = 1000;\nconsole.log(price.yen, price.withTax);\n',
    ok: (s, c) =>
      /class\s+Price\s*\{/.test(s) && /get\s+yen\s*\(\s*\)/.test(s) &&
      /set\s+yen\s*\(\s*\w+\s*(:\s*number)?\s*\)\s*\{[\s\S]*?throw[\s\S]*?this\._yen\s*=/.test(s) &&
      /get\s+withTax\s*\(\s*\)[^{]*\{[^}]*this\._yen/.test(s) && /\.withTax/.test(s) && good(c)
  });

  K.drillAdv('継承：親から子へ', {
    label: 'Booking[] に親と子を混ぜて入れ、for 文で describe を呼ぶ',
    hint: [
      'const list: Booking[] = [new Booking("田中"), new SeminarBooking("佐藤")]',
      '子クラスも Booking 型として入れられる。',
      'for (const x of list) { console.log(x.describe()); }'
    ],
    starter: '\n// ③ 上級：親と子を同じ配列に\n// const list: Booking[] = [ ... ];\n// for (const x of list) { ... }\n',
    solution: '\nconst list: Booking[] = [new Booking("田中"), new SeminarBooking("佐藤")];\nfor (const x of list) {\n  console.log(x.describe());\n}\n',
    ok: (s, c) =>
      /:\s*Booking\[\]\s*=\s*\[[^\]]*new\s+Booking\s*\([^\]]*new\s+SeminarBooking\s*\(/.test(s) &&
      /for\s*\(\s*const\s+\w+\s+of\s+list\s*\)/.test(s) && /\.describe\s*\(\s*\)/.test(s.replace(/s1\.describe\s*\(\s*\)/, '')) && good(c)
  });

  K.drillAdv('super()：親を呼ぶ', {
    label: 'SeminarBooking を継ぐ PaidSeminar を作り、合計金額を出す',
    hint: [
      'class PaidSeminar extends SeminarBooking { constructor(name: string, seats: number, public fee: number) { super(name, seats); } }',
      'total(): number { return this.seats * this.fee; } を足す。',
      'new PaidSeminar("鈴木", 5, 1000) の total() を console.log。'
    ],
    starter: '\n// ③ 上級：2段階の継承\n// class PaidSeminar extends SeminarBooking { constructor(...) { super(...); } total() {...} }\n',
    solution: '\nclass PaidSeminar extends SeminarBooking {\n  constructor(name: string, seats: number, public fee: number) {\n    super(name, seats);\n  }\n  total(): number {\n    return this.seats * this.fee;\n  }\n}\nconst ps = new PaidSeminar("鈴木", 5, 1000);\nconsole.log(ps.total());\n',
    ok: (s, c) =>
      /class\s+PaidSeminar\s+extends\s+SeminarBooking\s*\{/.test(s) &&
      /constructor\s*\([^)]*fee\s*:\s*number[^)]*\)\s*\{\s*super\s*\(\s*name\s*,\s*seats\s*\)/.test(s) &&
      /total\s*\(\s*\)\s*(:\s*number\s*)?\{[^}]*this\.seats\s*\*\s*this\.fee/.test(s) &&
      /new\s+PaidSeminar\s*\(/.test(s) && /console\.log\([^)]*\.total\s*\(/.test(s) && good(c)
  });
})();
