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
  { id: "intro", label: "轉換簡介", labelEn: "Convert intro" },
  { id: "int", label: "int()", labelEn: "int()", mono: "int()" },
  { id: "str", label: "str()", labelEn: "str()", mono: "str()" },
  { id: "float", label: "float()", labelEn: "float()", mono: "float()" },
  { id: "eval", label: "eval()", labelEn: "eval()", mono: "eval()" },
];

const FN_SHORTCUTS = [
  { id: "int", symbol: "int()", zh: "整數", en: "integer" },
  { id: "str", symbol: "str()", zh: "字符串", en: "string" },
  { id: "float", symbol: "float()", zh: "浮點數", en: "float" },
  { id: "eval", symbol: "eval()", zh: "求值", en: "evaluate" },
];

function CodeName({ children }) {
  const text = String(children);
  const match = text.match(/^(.*?)(\(\))$/);
  if (!match) {
    return (
      <span className="font-mono font-semibold tracking-normal">{children}</span>
    );
  }
  return (
    <span className="font-mono font-semibold tracking-normal">
      {match[1]}
      <span className="inline-block translate-y-px font-normal tracking-[0.12em]">
        {match[2]}
      </span>
    </span>
  );
}

function InlineFn({ children, size = "sm" }) {
  const text = String(children).trim();
  const match = text.match(/^(.*?)(\(\))$/);
  const sizeClass = size === "xs" ? "text-xs px-1" : "text-sm px-1.5 py-0.5";
  if (!match) {
    return (
      <code className={`rounded bg-slate-100 font-mono ${sizeClass}`}>
        {children}
      </code>
    );
  }
  return (
    <code
      className={`rounded bg-slate-100 font-mono font-semibold ${sizeClass}`}
    >
      {match[1]}
      <span className="font-normal tracking-[0.12em]">{match[2]}</span>
    </code>
  );
}


function Warn({ children }) {
  const { tx } = useLang();
  return (
    <div className="my-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
      <p className="mb-1 text-sm font-bold text-rose-800">{tx("注意 · 會出錯", "Watch out · this can error")}</p>
      <div className="text-sm font-medium text-rose-900/80">{children}</div>
    </div>
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

export default function PythonChapter8() {
  return (
    <IdeProvider
      initialCode={`num1 = int("123")
print(num1)

str_num = str(123)
print(str_num)

float_num = float("123.456")
print(float_num)

print(eval("2 + 3 * 4"))
`}
    >
      <ChapterLayout />
    </IdeProvider>
  );
}

function ChapterLayout() {
  const { mobileOpen, setMobileOpen } = useIde();
  const { tx } = useLang();
  const ui = pythonChrome(tx, 8);
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
                {tx("第 8 章 · 數據類型轉換", "Chapter 8 · Convert types")}
              </h1>
              <p className="mt-0.5 text-sm text-muted [line-break:strict]">
                <span className="whitespace-nowrap">
                  <CodeName>int()</CodeName>、
                </span>
                <span className="whitespace-nowrap">
                  <CodeName>str()</CodeName>、
                </span>
                <CodeName>float()</CodeName> {tx("與", "and")} <CodeName>eval()</CodeName>
              </p>
          </div>
        </header>

        <div className="flex gap-4">
          <nav className="hidden w-full shrink-0 md:block md:w-44">
            <div className="sticky top-20 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm backdrop-blur">
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
                      {item.mono ? <CodeName>{item.mono}</CodeName> : tx(item.label, item.labelEn)}
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
        <div className="fixed inset-0 z-50 flex flex-col bg-ink/40 lg:hidden">
          <button
            type="button"
            className="h-12 shrink-0 bg-transparent"
            aria-label={tx("關閉 IDE", "Close IDE")}
            onClick={() => setMobileOpen(false)}
          />
          <div className="flex min-h-0 flex-1 flex-col rounded-t-2xl bg-white p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-sm font-bold text-ink">Python IDE</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-muted hover:bg-slate-100"
              >
                {tx("關閉", "Close")}
              </button>
            </div>
            <PythonIDE className="min-h-0 flex-1" />
          </div>
        </div>
      )}

      <MobileIdeToggle />
    </div>
  );
}

function LessonContent() {
  const { tx } = useLang();
  const ui = pythonChrome(tx, 8);

  return (
    <article className="lesson-prose">
      <section id="intro" className="scroll-mt-24">
        <h2 className="!text-2xl">{tx("數據類型轉換", "Convert types")}</h2>
        <p>
          {tx(
            "在 Python 中，數據類型轉換是處理不同類型數據時非常重要的一個概念。以下是一些常用的數據類型轉換函數，尤其是",
            "Sometimes you need to change a value from one type to another. These functions help:",
          )}{" "}
          <InlineFn>int()</InlineFn>、<InlineFn>str()</InlineFn>、
          <InlineFn>float()</InlineFn> {tx("和", "and")} <InlineFn>eval()</InlineFn>。
        </p>
        <div className="my-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FN_SHORTCUTS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl border border-sky-200 bg-sky-50 px-2 text-center shadow-sm transition hover:border-brand hover:shadow-md"
            >
              <span className="font-mono text-sm font-bold leading-none text-brand-dark">
                <CodeName>{item.symbol}</CodeName>
              </span>
              <span className="text-xs font-bold leading-none text-ink">
                {tx(item.zh, item.en)}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section id="int" className="mt-10 scroll-mt-24">
        <h2>
          1. <CodeName>int()</CodeName>
        </h2>
        <p>
          <strong className="text-ink">{tx("功能：", "Job: ")}</strong>
          {tx("將數據轉換為整數。", "Change a value into an integer. ")}
          <InlineFn>int()</InlineFn>{" "}
          {tx("可以將字符串或浮點數轉換為整數，還可以指定進制。", "can turn a string or a float into an int. You can also set the number base.")}
        </p>
        <CodeBlock label="int_convert.py">{`# 將字符串轉換為整數
num1 = int("123")  # 123
print(num1)

# 將浮點數轉換為整數（僅保留整數部分）
num2 = int(123.456)  # 123
print(num2)

# 使用不同的進制
num3 = int("1010", 2)  # 10（二進制的 1010 轉換為十進制）
print(num3)`}</CodeBlock>
        <Warn>
          <p>
            {tx("含小數點的字符串不能直接用", "A string with a decimal point cannot go straight into")} <InlineFn>int()</InlineFn>{" "}
            {tx("轉換，會出現錯誤：", ". That causes an error:")}
          </p>
          <CodeBlock label="int_error.py">{`num4 = int("123.124")  # error`}</CodeBlock>
          <p className="!mb-0">
            {tx("若要處理，可先", "To fix it, use")} <InlineFn>float()</InlineFn> {tx("再", "then")}{" "}
            <InlineFn>int()</InlineFn>{tx("，例如", ", for example")}{" "}
            <code className="rounded bg-white/80 px-1 font-mono text-xs">
              int(float(&quot;123.124&quot;))
            </code>
            。
          </p>
        </Warn>
      </section>

      <section id="str" className="mt-10 scroll-mt-24">
        <h2>
          2. <CodeName>str()</CodeName>
        </h2>
        <p>
          <strong className="text-ink">{tx("功能：", "Job: ")}</strong>
          {tx("將數據轉換為字符串。", "Change a value into a string.")}
        </p>
        <CodeBlock label="str_convert.py">{`# 將整數轉換為字符串
str_num = str(123)  # "123"
print(str_num)

# 將浮點數轉換為字符串
str_float = str(123.456)  # "123.456"
print(str_float)`}</CodeBlock>
        <Warn>
          <p>
            <InlineFn>str()</InlineFn>{" "}
            {tx("的參數必須是已定義的值。下面這行會出錯，因為", "needs a real value. This line errors because")}{" "}
            <code className="rounded bg-white/80 px-1 font-mono text-xs">
              abc
            </code>{" "}
            {tx("不是字符串字面量，也不是已存在的變量：", "is not quoted text, and it is not a variable you made:")}
          </p>
          <CodeBlock label="str_error.py">{`s = str(abc)  # error`}</CodeBlock>
          <p className="!mb-0">
            {tx("若要得到字串", "To get the string")}{" "}
            <code className="rounded bg-white/80 px-1 font-mono text-xs">
              &quot;abc&quot;
            </code>
            {tx("，請寫", ", write")}{" "}
            <code className="rounded bg-white/80 px-1 font-mono text-xs">
              str(&quot;abc&quot;)
            </code>{" "}
            {tx("或直接用", "or just use")}{" "}
            <code className="rounded bg-white/80 px-1 font-mono text-xs">
              &quot;abc&quot;
            </code>
            。
          </p>
        </Warn>
      </section>

      <section id="float" className="mt-10 scroll-mt-24">
        <h2>
          3. <CodeName>float()</CodeName>
        </h2>
        <p>
          <strong className="text-ink">{tx("功能：", "Job: ")}</strong>
          {tx("將數據轉換為浮點數。", "Change a value into a float.")}
        </p>
        <CodeBlock label="float_convert.py">{`# 將字符串轉換為浮點數
float_num = float("123.456")  # 123.456
print(float_num)

# 將整數轉換為浮點數
float_num2 = float(123)  # 123.0
print(float_num2)`}</CodeBlock>
        <Tip label={ui.tip}>
          <p>
            <InlineFn>input()</InlineFn>{" "}
            {tx("讀進來的永遠是字符串。若要做數學計算，記得先用", "always gives you a string. For math, first convert with")}{" "}
            <InlineFn>int()</InlineFn> {tx("或", "or")} <InlineFn>float()</InlineFn>
            。
          </p>
        </Tip>
      </section>

      <section id="eval" className="mt-10 scroll-mt-24">
        <h2>
          4. <CodeName>eval()</CodeName>
        </h2>
        <p>
          <strong className="text-ink">{tx("功能：", "Job: ")}</strong>
          {tx(
            "將字符串作為 Python 表達式來評估，並返回結果。用於執行字符串中的 Python 代碼。",
            "Run a string as Python math or code, then give back the result.",
          )}
        </p>
        <CodeBlock label="eval_demo.py">{`# 評估數字
num1 = eval("123") + 1  # 124
print(num1)

# 評估數學表達式
result = eval("2 + 3 * 4")  # 14
print(result)

# 評估包含變數的表達式
x = 10
result2 = eval("x + 5")  # 15
print(result2)`}</CodeBlock>
        <Tip label={ui.tip}>
          <p>
            <InlineFn>eval()</InlineFn>{" "}
            {tx(
              "很方便，但不要對不明來源的字符串使用它（可能執行不安全的代碼）。學習階段用來算表達式即可。",
              "is handy, but do not use it on text you do not trust. In class, just use it for simple math.",
            )}
          </p>
        </Tip>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter8"
            practiceLabel={ui.doneChapter(8)}
            subject="python"
          />
          <Link
            to="/python/quiz/8"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="8" />

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
