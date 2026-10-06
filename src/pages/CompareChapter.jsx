import { Link } from "react-router-dom";
import Tip from "../components/Tip";
import { useLang } from "../contexts/LangContext";

const TOC_IDS = [
  "intro",
  "less",
  "greater",
  "le",
  "ge",
  "equal",
  "ne",
  "ops",
  "practice",
];

const SYMBOL_CARDS = [
  {
    href: "#less",
    sign: "<",
    box: "bg-slate-50 hover:border-slate-300",
    nameKey: "cardLtName",
    descKey: "cardLtDesc",
  },
  {
    href: "#greater",
    sign: ">",
    box: "bg-slate-50 hover:border-slate-300",
    nameKey: "cardGtName",
    descKey: "cardGtDesc",
  },
  {
    href: "#le",
    sign: "≤",
    box: "bg-violet-50 hover:border-violet-200",
    nameKey: "cardLeName",
    descKey: "cardLeDesc",
  },
  {
    href: "#ge",
    sign: "≥",
    box: "bg-violet-50 hover:border-violet-200",
    nameKey: "cardGeName",
    descKey: "cardGeDesc",
  },
  {
    href: "#equal",
    sign: "=",
    box: "bg-indigo-50 hover:border-indigo-200",
    nameKey: "cardEqName",
    descKey: "cardEqDesc",
  },
  {
    href: "#ne",
    sign: "≠",
    box: "bg-rose-50 hover:border-rose-200",
    nameKey: "cardNeName",
    descKey: "cardNeDesc",
  },
];

const PRACTICE = [
  { left: 3, right: 8, sign: "<" },
  { left: 9, right: 2, sign: ">" },
  { left: 4, right: 7, sign: "≤" },
  { left: 4, right: 4, sign: "≤" },
  { left: 10, right: 10, sign: "≥" },
  { left: 12, right: 6, sign: "≥" },
  { left: 5, right: 5, sign: "=" },
  { left: 7, right: 1, sign: "≠" },
];

const COPY = {
  zh: {
    title: "比較",
    subtitle:
      "用數學符號比較兩個數：小於、大於、小於或等於、大於或等於、等於、不等於。",
    back: "← 數學",
    langBtn: "English",
    tipLabel: "提示",
    toc: {
      intro: "六個符號",
      less: "小於 <",
      greater: "大於 >",
      le: "小於或等於 ≤",
      ge: "大於或等於 ≥",
      equal: "等於 =",
      ne: "不等於 ≠",
      ops: "加減乘除",
      practice: "練習",
    },
    introBody: "比較時，先看左邊的數，再看右邊的數。符號放在中間，說出它們的關係。",
    introTip: "大口朝向較大的數。兩邊一樣時，同一條也可以寫 ≤ 或 ≥。",
    cardLtName: "小於",
    cardLtDesc: "左邊比較小",
    cardGtName: "大於",
    cardGtDesc: "左邊比較大",
    cardLeName: "小於或等於",
    cardLeDesc: "比較小，或一樣大",
    cardGeName: "大於或等於",
    cardGeDesc: "比較大，或一樣大",
    cardEqName: "等於",
    cardEqDesc: "兩邊一樣大",
    cardNeName: "不等於",
    cardNeDesc: "兩邊不一樣大",
    lessTitle: "小於 <",
    lessBody: "左邊的數比右邊小，就用 <。",
    lessRead: "讀作「三小於八」",
    greaterTitle: "大於 >",
    greaterBody: "左邊的數比右邊大，就用 >。",
    greaterRead: "讀作「九大於二」",
    leTitle: "小於或等於 ≤",
    leBody: "≤ 讀作「小於或等於」。它其實是兩個意思合在一起：",
    leLi1: "左邊比右邊小，像 4 和 7。",
    leLi2: "左邊和右邊一樣大，像 4 和 4。這時同一條也可以寫成等於。",
    leMore: "符號下面多一條橫線，就是提醒你：「等於」也算進去。所以只要左邊沒有比右邊大，寫 ≤ 就對。",
    leEx1: "四比七小，用了「小於」這一半",
    leEx2: "兩邊一樣，用了「等於」這一半",
    geTitle: "大於或等於 ≥",
    geBody: "≥ 讀作「大於或等於」。它也是兩個意思合在一起：",
    geLi1: "左邊比右邊大，像 12 和 6。",
    geLi2: "左邊和右邊一樣大，像 10 和 10。這時同一條也可以寫成等於。",
    geMore: "橫線同樣表示「等於也算」。所以只要左邊沒有比右邊小，寫 ≥ 就對。這是數學寫法，不是程式裡的 >=。",
    geEx1: "十二比六大，用了「大於」這一半",
    geEx2: "兩邊一樣，用了「等於」這一半",
    eqTitle: "等於 =",
    eqBody: "兩邊的數一樣大，就用 =。兩邊都不是比較大，所以沒有開口。",
    eqRead: "讀作「五等於五」",
    neTitle: "不等於 ≠",
    neBody: "≠ 是數學裡的「不等於」。兩邊不一樣大，就寫 ≠。斜線劃過等號，表示不是等於，不是程式裡的 !=。",
    neRead: "讀作「七不等於一」",
    opsTitle: "加減乘除",
    opsBody:
      "不等式兩邊可以同時加、減、乘、除同一個數。數學寫 ＋ － × ÷，程式常寫 + - * /。先算完兩邊，再比較。",
    add: "加法 +",
    sub: "減法 -",
    mul: "乘法 ×  *",
    div: "除法 ÷  /",
    bothAdd: "兩邊都 + 2",
    bothSub: "兩邊都 - 1",
    bothMul: "兩邊都 × 2",
    bothDiv: "兩邊都 ÷ 2",
    signSame: "符號不變",
    mulPos: "乘正數，符號不變",
    divPos: "除正數，符號不變",
    bothMulNeg: "兩邊都 × (-1)",
    bothDivNeg: "兩邊都 ÷ (-2)",
    flipLt: "< 要改成 >",
    flipGt: "> 要改成 <",
    opsTip:
      "乘 * 或除 / 的時候要小心：乘或除的是正數，符號不變；乘或除的是負數，符號要反過來。加 + 和減 - 永遠不用改符號。",
    practiceTitle: "練習",
    practiceBody: "看答案裡的符號：<、>、≤、≥、=、≠。",
    practiceQuiz: "開始練習 · 賺代幣",
  },
  en: {
    title: "Compare",
    subtitle:
      "Use math signs to compare two numbers: less than, greater than, less than or equal, greater than or equal, equal, and not equal.",
    back: "← Math",
    langBtn: "中文",
    tipLabel: "Tip",
    toc: {
      intro: "Six signs",
      less: "Less than <",
      greater: "Greater than >",
      le: "Less or equal ≤",
      ge: "Greater or equal ≥",
      equal: "Equal =",
      ne: "Not equal ≠",
      ops: "+ − × ÷",
      practice: "Practice",
    },
    introBody:
      "Look at the left number first, then the right number. Put the sign in the middle to tell how they compare.",
    introTip:
      "The open side points to the bigger number. When both sides are the same, you can also write ≤ or ≥.",
    cardLtName: "Less than",
    cardLtDesc: "The left is smaller",
    cardGtName: "Greater than",
    cardGtDesc: "The left is bigger",
    cardLeName: "Less or equal",
    cardLeDesc: "Smaller, or the same",
    cardGeName: "Greater or equal",
    cardGeDesc: "Bigger, or the same",
    cardEqName: "Equal",
    cardEqDesc: "Both sides are the same",
    cardNeName: "Not equal",
    cardNeDesc: "The two sides are not the same",
    lessTitle: "Less than <",
    lessBody: "If the left number is smaller than the right, use <.",
    lessRead: "Read: “three is less than eight”",
    greaterTitle: "Greater than >",
    greaterBody: "If the left number is bigger than the right, use >.",
    greaterRead: "Read: “nine is greater than two”",
    leTitle: "Less than or equal ≤",
    leBody: "≤ is read “less than or equal to”. It means two things together:",
    leLi1: "The left is smaller than the right, like 4 and 7.",
    leLi2: "The left and right are the same, like 4 and 4. That line can also be written with =.",
    leMore:
      "The extra line under the sign reminds you that equal also counts. So if the left is not bigger than the right, ≤ is correct.",
    leEx1: "4 is smaller than 7, so this uses the “less than” half",
    leEx2: "Both sides are the same, so this uses the “equal” half",
    geTitle: "Greater than or equal ≥",
    geBody: "≥ is read “greater than or equal to”. It also means two things together:",
    geLi1: "The left is bigger than the right, like 12 and 6.",
    geLi2: "The left and right are the same, like 10 and 10. That line can also be written with =.",
    geMore:
      "The extra line also means “equal counts”. So if the left is not smaller than the right, ≥ is correct. This is math writing, not the code sign >=.",
    geEx1: "12 is bigger than 6, so this uses the “greater than” half",
    geEx2: "Both sides are the same, so this uses the “equal” half",
    eqTitle: "Equal =",
    eqBody: "If both numbers are the same size, use =. Neither side is bigger, so there is no open mouth.",
    eqRead: "Read: “five equals five”",
    neTitle: "Not equal ≠",
    neBody:
      "≠ is the math sign for “not equal”. If the two sides are not the same size, write ≠. A slash through the equal sign means it is not equal. This is math writing, not != in code.",
    neRead: "Read: “seven is not equal to one”",
    opsTitle: "Add, subtract, multiply, divide",
    opsBody:
      "You can add, subtract, multiply, or divide both sides of an inequality by the same number. Math uses ＋ － × ÷. Code often uses + - * /. Work out both sides, then compare.",
    add: "Add +",
    sub: "Subtract -",
    mul: "Multiply ×  *",
    div: "Divide ÷  /",
    bothAdd: "Add 2 to both sides",
    bothSub: "Subtract 1 from both sides",
    bothMul: "Multiply both sides by 2",
    bothDiv: "Divide both sides by 2",
    signSame: "The sign stays the same",
    mulPos: "Times a positive: sign stays",
    divPos: "Divide by a positive: sign stays",
    bothMulNeg: "Multiply both sides by −1",
    bothDivNeg: "Divide both sides by −2",
    flipLt: "< must become >",
    flipGt: "> must become <",
    opsTip:
      "Be careful with * and /: a positive number keeps the sign; a negative number flips it. + and - never flip the sign.",
    practiceTitle: "Practice",
    practiceBody: "Look at the signs in the answers: <, >, ≤, ≥, =, ≠.",
    practiceQuiz: "Start practice · earn tokens",
  },
};

export default function CompareChapter() {
  const { lang } = useLang();
  const t = COPY[lang];

  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Mathematics · Topic 2
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {t.title}
            </h1>
            <p className="mt-2 text-sm text-muted">{t.subtitle}</p>
          </div>
          <Link
            to="/math"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-brand"
          >
            {t.back}
          </Link>
        </header>

        <nav className="mb-8 flex flex-wrap gap-2">
          {TOC_IDS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-ink hover:border-brand hover:text-brand-dark"
            >
              {t.toc[id]}
            </a>
          ))}
        </nav>

        <section
          id="intro"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">{t.toc.intro}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t.introBody}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SYMBOL_CARDS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-xl border border-transparent p-4 transition ${item.box}`}
              >
                <p className="font-mono text-3xl font-bold text-ink">{item.sign}</p>
                <p className="mt-2 text-sm font-bold text-ink">{t[item.nameKey]}</p>
                <p className="mt-1 text-sm text-muted">{t[item.descKey]}</p>
              </a>
            ))}
          </div>
          <Tip centerLabel oneLine label={t.tipLabel}>
            {t.introTip}
          </Tip>
        </section>

        <section
          id="less"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">{t.lessTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t.lessBody}</p>
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-4 text-center">
            <span className="block font-mono text-lg font-bold text-ink">3 &lt; 8</span>
            <span className="mt-1 block text-sm text-muted">{t.lessRead}</span>
          </p>
        </section>

        <section
          id="greater"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">{t.greaterTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t.greaterBody}</p>
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-4 text-center">
            <span className="block font-mono text-lg font-bold text-ink">9 &gt; 2</span>
            <span className="mt-1 block text-sm text-muted">{t.greaterRead}</span>
          </p>
        </section>

        <section
          id="le"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">{t.leTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t.leBody}</p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-muted">
            <li>{t.leLi1}</li>
            <li>{t.leLi2}</li>
          </ol>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t.leMore}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 px-4 py-4 text-center">
              <p className="font-mono text-lg font-bold text-ink">4 ≤ 7</p>
              <p className="mt-1 text-sm text-muted">{t.leEx1}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-4 text-center">
              <p className="font-mono text-lg font-bold text-ink">4 ≤ 4</p>
              <p className="mt-1 font-mono text-lg font-bold text-ink">4 = 4</p>
              <p className="mt-1 text-sm text-muted">{t.leEx2}</p>
            </div>
          </div>
        </section>

        <section
          id="ge"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">{t.geTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t.geBody}</p>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-muted">
            <li>{t.geLi1}</li>
            <li>{t.geLi2}</li>
          </ol>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t.geMore}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 px-4 py-4 text-center">
              <p className="font-mono text-lg font-bold text-ink">12 ≥ 6</p>
              <p className="mt-1 text-sm text-muted">{t.geEx1}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-4 text-center">
              <p className="font-mono text-lg font-bold text-ink">10 ≥ 10</p>
              <p className="mt-1 font-mono text-lg font-bold text-ink">10 = 10</p>
              <p className="mt-1 text-sm text-muted">{t.geEx2}</p>
            </div>
          </div>
        </section>

        <section
          id="equal"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">{t.eqTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t.eqBody}</p>
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-4 text-center">
            <span className="block font-mono text-lg font-bold text-ink">5 = 5</span>
            <span className="mt-1 block text-sm text-muted">{t.eqRead}</span>
          </p>
        </section>

        <section
          id="ne"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">{t.neTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t.neBody}</p>
          <p className="mt-4 rounded-xl bg-slate-50 px-4 py-4 text-center">
            <span className="block font-mono text-lg font-bold text-ink">7 ≠ 1</span>
            <span className="mt-1 block text-sm text-muted">{t.neRead}</span>
          </p>
        </section>

        <section
          id="ops"
          className="mb-8 scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">{t.opsTitle}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{t.opsBody}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 px-4 py-4 text-center">
              <p className="text-xs font-bold text-muted">{t.add}</p>
              <p className="mt-2 font-mono text-lg font-bold text-ink">3 &lt; 8</p>
              <p className="mt-1 font-mono text-sm text-muted">{t.bothAdd}</p>
              <p className="mt-1 font-mono text-lg font-bold text-ink">5 &lt; 10</p>
              <p className="mt-1 text-sm text-muted">{t.signSame}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-4 text-center">
              <p className="text-xs font-bold text-muted">{t.sub}</p>
              <p className="mt-2 font-mono text-lg font-bold text-ink">9 &gt; 2</p>
              <p className="mt-1 font-mono text-sm text-muted">{t.bothSub}</p>
              <p className="mt-1 font-mono text-lg font-bold text-ink">8 &gt; 1</p>
              <p className="mt-1 text-sm text-muted">{t.signSame}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-4 text-center">
              <p className="text-xs font-bold text-muted">{t.mul}</p>
              <p className="mt-2 font-mono text-lg font-bold text-ink">3 &lt; 8</p>
              <p className="mt-1 font-mono text-sm text-muted">{t.bothMul}</p>
              <p className="mt-1 font-mono text-lg font-bold text-ink">6 &lt; 16</p>
              <p className="mt-1 text-sm text-muted">{t.mulPos}</p>
            </div>
            <div className="rounded-xl bg-slate-50 px-4 py-4 text-center">
              <p className="text-xs font-bold text-muted">{t.div}</p>
              <p className="mt-2 font-mono text-lg font-bold text-ink">10 &gt; 4</p>
              <p className="mt-1 font-mono text-sm text-muted">{t.bothDiv}</p>
              <p className="mt-1 font-mono text-lg font-bold text-ink">5 &gt; 2</p>
              <p className="mt-1 text-sm text-muted">{t.divPos}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-rose-50 px-4 py-4 text-center">
              <p className="text-xs font-bold text-rose-800">{t.bothMulNeg}</p>
              <p className="mt-2 font-mono text-lg font-bold text-ink">3 &lt; 8</p>
              <p className="mt-1 font-mono text-lg font-bold text-ink">-3 &gt; -8</p>
              <p className="mt-1 text-sm text-muted">{t.flipLt}</p>
            </div>
            <div className="rounded-xl bg-rose-50 px-4 py-4 text-center">
              <p className="text-xs font-bold text-rose-800">{t.bothDivNeg}</p>
              <p className="mt-2 font-mono text-lg font-bold text-ink">10 &gt; 4</p>
              <p className="mt-1 font-mono text-lg font-bold text-ink">-5 &lt; -2</p>
              <p className="mt-1 text-sm text-muted">{t.flipGt}</p>
            </div>
          </div>
          <Tip label={t.tipLabel}>{t.opsTip}</Tip>
        </section>

        <section
          id="practice"
          className="scroll-mt-24 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-xl font-bold text-ink">{t.practiceTitle}</h2>
          <p className="mt-3 text-sm text-muted">{t.practiceBody}</p>
          <ul className="mt-4 space-y-3 text-sm text-ink">
            {PRACTICE.map((item) => (
              <li
                key={`${item.left}-${item.right}-${item.sign}`}
                className="flex items-center justify-center rounded-xl bg-slate-50 px-4 py-4"
              >
                <span className="font-mono text-lg font-bold text-ink">
                  {item.left} {item.sign} {item.right}
                </span>
              </li>
            ))}
          </ul>
          <Link
            to="/math/compare/quiz"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 hover:brightness-105"
          >
            {t.practiceQuiz}
          </Link>
        </section>
      </div>
    </div>
  );
}
