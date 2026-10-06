import { Link } from "react-router-dom";
import ChapterNextLink from "../components/ChapterNextLink";
import ChapterCompleteButton from "../components/ChapterCompleteButton";
import { useEffect, useState } from "react";
import CodeBlock from "../components/CodeBlock";
import Tip from "../components/Tip";
import PythonIDE from "../components/PythonIDE";
import { IdeProvider, useIde } from "../contexts/IdeContext";
import { useLang } from "../contexts/LangContext";
import { pythonChrome } from "../i18n/pythonChrome";

const TOC = [
  { id: "intro", label: "運算符簡介", labelEn: "Operators intro" },
  { id: "add", label: "加法 +", labelEn: "Add +" },
  { id: "sub", label: "減法 -", labelEn: "Subtract -" },
  { id: "mul", label: "乘法 *", labelEn: "Multiply *" },
  { id: "div", label: "除法 /", labelEn: "Divide /" },
  { id: "floordiv", label: "整數除法 //", labelEn: "Integer divide //" },
  { id: "mod", label: "取餘 %", labelEn: "Remainder %" },
  { id: "pow", label: "指數 **", labelEn: "Power **" },
  { id: "neg", label: "負號 -", labelEn: "Minus -" },
  { id: "precedence", label: "運算優先級", labelEn: "Order of ops" },
  { id: "result-types", label: "結果的數據類型", labelEn: "Result types" },
];

const OP_SHORTCUTS = [
  { id: "add", symbol: "+", zh: "加法", en: "add" },
  { id: "sub", symbol: "-", zh: "減法", en: "subtract" },
  { id: "mul", symbol: "*", zh: "乘法", en: "multiply" },
  { id: "div", symbol: "/", zh: "除法", en: "divide" },
  { id: "floordiv", symbol: "//", zh: "整除", en: "int divide" },
  { id: "mod", symbol: "%", zh: "取餘", en: "remainder" },
  { id: "pow", symbol: "**", zh: "指數", en: "power" },
  { id: "neg", symbol: "-", zh: "負號", en: "minus" },
];


function OpMark({ children }) {
  return (
    <code className="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-sm font-bold text-coral">
      {children}
    </code>
  );
}

function MobileIdeToggle() {
  const { mobileOpen, setMobileOpen } = useIde();
  if (mobileOpen) return null;
  return (
    <button
      type="button"
      onClick={() => setMobileOpen(true)}
      className="fixed bottom-5 right-5 z-40 rounded-full bg-lab px-5 py-3 font-bold text-white shadow-lg ring-2 ring-brand/40 lg:hidden"
    >
      Python IDE
    </button>
  );
}

export default function PythonChapter9() {
  return (
    <IdeProvider
      initialCode={`print(5 + 3)
print(5 - 3)
print(5 * 3)
print(5 / 2)
print(5 // 2)
print(5 % 2)
print(5 ** 2)
`}
    >
      <ChapterLayout />
    </IdeProvider>
  );
}

function ChapterLayout() {
  const { mobileOpen, setMobileOpen } = useIde();
  const { tx } = useLang();
  const ui = pythonChrome(tx, 9);
  const [active, setActive] = useState("intro");

  useEffect(() => {
    const sectionIds = TOC.map((item) => item.id);
    const pickActive = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 120;
      if (nearBottom) {
        setActive(sectionIds[sectionIds.length - 1]);
        return;
      }
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          current = id;
        }
      }
      setActive(current);
    };
    pickActive();
    window.addEventListener("scroll", pickActive, { passive: true });
    window.addEventListener("resize", pickActive);
    return () => {
      window.removeEventListener("scroll", pickActive);
      window.removeEventListener("resize", pickActive);
    };
  }, []);

  return (
    <div className="blueprint-bg lesson-with-ide">
      <div className="mx-auto max-w-5xl px-3 py-4 lg:px-5 lg:py-5">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
              <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {tx("第 9 章 · 數學運算符（Math Operators）", "Chapter 9 · Math operators")}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {tx("加減乘除、整除、取餘、指數與優先級", "Add, subtract, multiply, divide, remainder, power, and order")}
              </p>
          </div>
        </header>

        <div className="flex gap-4">
          <nav
            className="hidden w-full shrink-0 md:block md:w-44"
          >
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm backdrop-blur">
              <p className="mb-3 text-sm font-bold text-ink">{ui.chapterContents}</p>
              <ul className="space-y-1">
                {TOC.map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                                            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition ${
                        active === item.id
                          ? "bg-brand-soft font-semibold text-brand-dark"
                          : "text-muted hover:bg-slate-50 hover:text-ink"
                      }`}
                    >
                      <span className="font-mono text-[10px] text-brand/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {tx(item.label, item.labelEn)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <main className="min-w-0 flex-1">
            <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur sm:p-7">
              <LessonContent />
            </div>
            <div className="h-40 md:h-52" aria-hidden="true" />
          </main>
        </div>
      </div>

      <aside className="ide-rail" aria-label="Python IDE">
        <PythonIDE className="h-full min-h-0 flex-1" />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-lab/50 p-3 backdrop-blur-sm lg:hidden">
          <PythonIDE
            className="min-h-0 flex-1"
            onClose={() => setMobileOpen(false)}
          />
        </div>
      )}

      <MobileIdeToggle />
    </div>
  );
}

function LessonContent() {
  const { tx } = useLang();
  const ui = pythonChrome(tx, 9);

  return (
    <article className="lesson-prose">
      <section id="intro" className="scroll-mt-24">
        <h2 className="!text-2xl">{tx("數學運算符（Math Operators）", "Math operators")}</h2>
        <p>
          {tx(
            "在 Python 中，數學運算符（Math Operators）用來執行各種數學運算，如加法、減法、乘法等。以下是 Python 中常見的數學運算符及其對應的解釋：",
            "Math operators do add, subtract, multiply, and more. Here are the common ones:",
          )}
        </p>
        <div className="my-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {OP_SHORTCUTS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2 text-center shadow-sm transition hover:border-coral hover:shadow-md"
            >
              <span className="font-mono text-lg font-bold leading-none text-coral">
                {item.symbol}
              </span>
              <span className="text-xs font-bold leading-none text-ink">
                {tx(item.zh, item.en)}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section id="add" className="mt-10 scroll-mt-24">
        <h2>
          1. {tx("加法（", "Add (")} <OpMark>+</OpMark> {tx("）", ")")}
        </h2>
        <p>{tx("用來對兩個數進行相加運算。", "Add two numbers.")}</p>
        <CodeBlock label="add.py">{`x = 5 + 3  # 結果為 8
print(x)`}</CodeBlock>
      </section>

      <section id="sub" className="mt-10 scroll-mt-24">
        <h2>
          2. {tx("減法（", "Subtract (")} <OpMark>-</OpMark> {tx("）", ")")}
        </h2>
        <p>{tx("用來對兩個數進行相減運算。", "Subtract two numbers.")}</p>
        <CodeBlock label="sub.py">{`x = 5 - 3  # 結果為 2
print(x)`}</CodeBlock>
      </section>

      <section id="mul" className="mt-10 scroll-mt-24">
        <h2>
          3. {tx("乘法（", "Multiply (")} <OpMark>*</OpMark> {tx("）", ")")}
        </h2>
        <p>{tx("用來對兩個數進行相乘運算。", "Multiply two numbers.")}</p>
        <CodeBlock label="mul.py">{`x = 5 * 3  # 結果為 15
print(x)`}</CodeBlock>
      </section>

      <section id="div" className="mt-10 scroll-mt-24">
        <h2>
          4. {tx("除法（", "Divide (")} <OpMark>/</OpMark> {tx("）", ")")}
        </h2>
        <p>
          {tx(
            "用來對兩個數進行除法運算，結果為浮點數（即使結果剛好是整數）。",
            "Divide two numbers. The answer is always a float, even if it looks like a whole number.",
          )}
        </p>
        <CodeBlock label="div.py">{`x = 5 / 2  # 結果為 2.5
print(x)`}</CodeBlock>
        <CodeBlock label="div_float.py">{`a = 4
b = 2
result = 4 / 2  # result 是 2.0 (float)
print(result)
print(type(result))`}</CodeBlock>
      </section>

      <section id="floordiv" className="mt-10 scroll-mt-24">
        <h2>
          5. {tx("整數除法（", "Integer divide (")} <OpMark>//</OpMark> {tx("）", ")")}
        </h2>
        <p>{tx("用來對兩個數進行整數除法，結果為不帶小數的整數（向下取整）。", "Divide and drop the extra part after the decimal (round down).")}</p>
        <CodeBlock label="floordiv.py">{`x = 5 // 2  # 結果為 2
print(x)`}</CodeBlock>
      </section>

      <section id="mod" className="mt-10 scroll-mt-24">
        <h2>
          6. {tx("取餘運算（", "Remainder (")} <OpMark>%</OpMark> {tx("）", ")")}
        </h2>
        <p>{tx("返回兩個數相除後的餘數。", "Gives what is left after dividing.")}</p>
        <CodeBlock label="mod.py">{`x = 5 % 2  # 結果為 1
print(x)`}</CodeBlock>
      </section>

      <section id="pow" className="mt-10 scroll-mt-24">
        <h2>
          7. {tx("指數運算（", "Power (")} <OpMark>**</OpMark> {tx("）", ")")}
        </h2>
        <p>{tx("用來計算一個數的冪次方。", "Raise a number to a power.")}</p>
        <CodeBlock label="pow.py">{`x = 5 ** 2  # 結果為 25 (5 的平方)
print(x)`}</CodeBlock>
      </section>

      <section id="neg" className="mt-10 scroll-mt-24">
        <h2>
          8. {tx("負號運算符（", "Minus sign (")} <OpMark>-</OpMark> {tx("）", ")")}
        </h2>
        <p>{tx("用來將正數轉為負數或相反。", "Makes a number negative, or flips the sign.")}</p>
        <CodeBlock label="neg.py">{`x = -5  # 結果為 -5
print(x)`}</CodeBlock>
      </section>

      <section id="precedence" className="mt-10 scroll-mt-24">
        <h2>{tx("運算符優先級（從高到低）", "Order of operations (high to low)")}</h2>
        <p>
          {tx(
            "當一個表達式中有多個運算符時，Python 會根據運算符的優先級來決定運算的順序。你可以使用",
            "If there are many operators, Python follows this order. You can use",
          )}{" "}
          <strong className="text-ink">{tx("括號", "brackets")}</strong>{" "}
          {tx("來改變運算順序，使得表達式按你希望的順序執行。", "to change the order.")}
        </p>
        <ol className="my-4 space-y-2">
          <li>
            {tx("括號", "Brackets")}{" "}
            <OpMark>()</OpMark>
          </li>
          <li>
            <OpMark>**</OpMark> {tx("（指數運算）", " (power)")}
          </li>
          <li>
            <OpMark>*</OpMark> <OpMark>/</OpMark> <OpMark>//</OpMark>{" "}
            <OpMark>%</OpMark> {tx("（乘法、除法、整數除法、取餘）", " (multiply, divide, integer divide, remainder)")}
          </li>
          <li>
            <OpMark>+</OpMark> <OpMark>-</OpMark> {tx("（加法、減法）", " (add, subtract)")}
          </li>
        </ol>
        <h3>{tx("範例", "Example")}</h3>
        <CodeBlock label="precedence.py">{`x = 5 + 3 * 2  # 乘法先於加法，結果為 11
y = (5 + 3) * 2  # 使用括號改變運算順序，結果為 16
print(x)
print(y)`}</CodeBlock>
      </section>

      <section id="result-types" className="mt-10 scroll-mt-24">
        <h2>{tx("運算結果的數據類型", "Type of the result")}</h2>
        <h3>
          1. {tx("加法、減法、乘法、整數除法、取餘數、指數運算（除非指數是負數）", "Add, subtract, multiply, integer divide, remainder, power (unless the power is negative)")}
        </h3>
        <p>
          {tx("運算符：", "Operators: ")}{" "}
          <OpMark>+</OpMark> <OpMark>-</OpMark> <OpMark>*</OpMark>{" "}
          <OpMark>//</OpMark> <OpMark>%</OpMark> <OpMark>**</OpMark>
          <span className="text-sm text-muted">{tx("（可以理解為除了除法 /）", " (all of these except divide /)")}</span>
        </p>
        <Tip label={ui.tip}>
          <p>
            {tx("如果兩個操作數都是", "If both numbers are")}{" "}
            <strong className="text-coral">{tx("整數（int）", "integers (int)")}</strong>
            {tx("，結果也將是", ", the result is also an")}{" "}
            <strong className="text-coral">{tx("整數（int）", "integer (int)")}</strong>。
          </p>
        </Tip>
        <CodeBlock label="int_ops.py">{`a = 5
b = 2
result = a + b   # result 是 7 (int)
result = a - b   # result 是 3 (int)
result = a * b   # result 是 10 (int)
result = a // b  # result 是 2 (int)
result = a % b   # result 是 1 (int)
result = a ** b  # result 是 25 (int)
print(a + b, type(a + b))
print(a // b, type(a // b))
print(a ** b, type(a ** b))`}</CodeBlock>
        <h3 className="!mt-8">
          2. {tx("除法", "Divide")} <OpMark>/</OpMark> {tx("永遠是浮點數", "is always a float")}
        </h3>
        <Tip label={ui.tip}>
          <p>
            {tx("除法一定會得到", "Divide always gives a")}{" "}
            <strong className="text-coral">{tx("浮點數（float）", "float")}</strong>。
          </p>
        </Tip>
        <CodeBlock label="div_always_float.py">{`a = 4
b = 2
result = 4 / 2  # result 是 2.0 (float)
print(result, type(result))`}</CodeBlock>
        <h3 className="!mt-8">3. {tx("有浮點數參與的運算", "If a float is in the math")}</h3>
        <Tip label={ui.tip}>
          <p>
            {tx("如果其中一個操作數是", "If one number is a")}{" "}
            <strong className="text-coral">{tx("浮點數（float）", "float")}</strong>
            {tx("，結果將是", ", the result is a")}{" "}
            <strong className="text-coral">{tx("浮點數（float）", "float")}</strong>。
          </p>
        </Tip>
        <CodeBlock label="float_ops.py">{`a = 5.0
b = 2
result = a + b   # result 是 7.0 (float)
result = a - b   # result 是 3.0 (float)
result = a * b   # result 是 10.0 (float)
result = a // b  # result 是 2.0 (float)
result = a % b   # result 是 1.0 (float)
result = a ** b  # result 是 25.0 (float)
print(a + b, type(a + b))
print(a // b, type(a // b))
print(a ** b, type(a ** b))`}</CodeBlock>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter9"
            practiceLabel={ui.doneChapter(9)}
            subject="python"
          />
          <Link
            to="/python/quiz/9"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="9" />

          <Link
            to="/python/chapters"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-ink shadow-sm hover:border-brand"
          >
            {ui.backCatalog}
          </Link>
        </div>
      </footer>
    </article>
  );
}
