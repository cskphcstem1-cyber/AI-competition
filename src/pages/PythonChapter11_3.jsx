import { Link } from "react-router-dom";
import ChapterNextLink from "../components/ChapterNextLink";
import ChapterCompleteButton from "../components/ChapterCompleteButton";
import { useEffect, useState } from "react";
import CodeBlock from "../components/CodeBlock";
import PythonIDE from "../components/PythonIDE";
import { IdeProvider, useIde } from "../contexts/IdeContext";
import { useLang } from "../contexts/LangContext";
import { pythonChrome } from "../i18n/pythonChrome";

const TOC = [
  { id: "intro", label: "布林運算簡介", labelEn: "Boolean logic intro" },
  { id: "and", label: "and 與", labelEn: "and" },
  { id: "or", label: "or 或", labelEn: "or" },
  { id: "not", label: "not 非", labelEn: "not" },
  { id: "examples", label: "運算例子", labelEn: "Examples" },
  { id: "priority", label: "優先順序", labelEn: "Order" },
];

function BoolMark({ children }) {
  return (
    <code className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-sm font-bold text-emerald-700">
      {children}
    </code>
  );
}

function KwMark({ children }) {
  return (
    <code className="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-sm font-bold text-coral">
      {children}
    </code>
  );
}

function TruthTable({ headers, rows }) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[280px] text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="border-b border-slate-200 px-3 py-2 font-mono font-bold text-ink"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="odd:bg-white even:bg-slate-50/60">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`border-b border-slate-100 px-3 py-2 font-mono font-semibold ${
                    cell === "True" ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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

export default function PythonChapter11_3() {
  return (
    <IdeProvider
      initialCode={`print(True and True)
print(True and False)
print(True or False)
print(False or False)
print(not True)
print(not False)

result = False or True and False
print(result)
`}
    >
      <ChapterLayout />
    </IdeProvider>
  );
}

function ChapterLayout() {
  const { mobileOpen, setMobileOpen } = useIde();
  const { tx } = useLang();
  const ui = pythonChrome(tx, "11.3");
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
                {tx("第 11.3 章 · 布林邏輯運算", "Chapter 11.3 · Boolean logic")}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {tx("且、或、非與優先順序", "And, or, not, and order")}
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
  const ui = pythonChrome(tx, "11.3");

  return (
    <article className="lesson-prose">
      <section id="intro" className="scroll-mt-24">
        <h2 className="!text-2xl">{tx("布林運算 Boolean Logic", "Boolean logic")}</h2>
        <p>
          {tx("布林運算（Boolean Logic）主要涉及兩個布林值：", "Boolean logic uses two values:")}
          <BoolMark>True</BoolMark> {tx("和", "and")} <BoolMark>False</BoolMark>
          {tx(
            "。這些運算在計算機科學中非常重要，尤其是在條件判斷和控制結構中。",
            ". They matter a lot in if checks and program flow.",
          )}
        </p>
        <div className="my-5 grid grid-cols-3 gap-2">
          {[
            { id: "and", label: "and", zh: "與", en: "and" },
            { id: "or", label: "or", zh: "或", en: "or" },
            { id: "not", label: "not", zh: "非", en: "not" },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2 text-center shadow-sm transition hover:border-emerald-400 hover:shadow-md"
            >
              <span className="font-mono text-lg font-bold leading-none text-emerald-800">
                {item.label}
              </span>
              <span className="text-xs font-bold leading-none text-ink">
                {tx(item.zh, item.en)}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section id="and" className="mt-10 scroll-mt-24">
        <h2>
          <KwMark>and</KwMark>{tx("（與）運算", " (and)")}
        </h2>
        <p>
          <strong className="text-ink">{tx("規則：", "Rule: ")}</strong>
          {tx("只有當所有條件都是", "The result is")} <BoolMark>True</BoolMark>{" "}
          {tx("時，結果才是", " only if every part is")} <BoolMark>True</BoolMark>
          {tx("。只要有一個條件是", ". If any part is")}{" "}
          <BoolMark>False</BoolMark>{tx("，結果就是", ", the result is")} <BoolMark>False</BoolMark>。
        </p>
        <h3>{tx("and（與）運算真值表", "and truth table")}</h3>
        <TruthTable
          headers={["A", "B", "A and B"]}
          rows={[
            ["True", "True", "True"],
            ["True", "False", "False"],
            ["False", "True", "False"],
            ["False", "False", "False"],
          ]}
        />
      </section>

      <section id="or" className="mt-10 scroll-mt-24">
        <h2>
          <KwMark>or</KwMark>{tx("（或）運算", " (or)")}
        </h2>
        <p>
          <strong className="text-ink">{tx("規則：", "Rule: ")}</strong>
          {tx("只要其中一個條件是", "The result is")} <BoolMark>True</BoolMark>
          {tx("，結果就會是", " if any part is")} <BoolMark>True</BoolMark>
          {tx("。只有當所有條件都是", ". The result is")} <BoolMark>False</BoolMark> {tx("時，結果才是", " only if every part is")}{" "}
          <BoolMark>False</BoolMark>。
        </p>
        <h3>{tx("or（或）運算真值表", "or truth table")}</h3>
        <TruthTable
          headers={["A", "B", "A or B"]}
          rows={[
            ["True", "True", "True"],
            ["True", "False", "True"],
            ["False", "True", "True"],
            ["False", "False", "False"],
          ]}
        />
      </section>

      <section id="not" className="mt-10 scroll-mt-24">
        <h2>
          <KwMark>not</KwMark>{tx("（非）運算", " (not)")}
        </h2>
        <p>
          <strong className="text-ink">{tx("規則：", "Rule: ")}</strong>
          {tx("將布林值取反，即", "Flip the value:")} <BoolMark>True</BoolMark> {tx("變為", "becomes")}{" "}
          <BoolMark>False</BoolMark>，<BoolMark>False</BoolMark> {tx("變為", "becomes")}{" "}
          <BoolMark>True</BoolMark>。
        </p>
        <h3>{tx("not（非）運算真值表", "not truth table")}</h3>
        <TruthTable
          headers={["A", "not A"]}
          rows={[
            ["True", "False"],
            ["False", "True"],
          ]}
        />
      </section>

      <section id="examples" className="mt-10 scroll-mt-24">
        <h2>{tx("布林運算的例子", "Boolean logic examples")}</h2>
        <h3>1. AND{tx("（與）運算", " (and)")}</h3>
        <CodeBlock label="and_examples.py">{`result = True and True
print(result)  # 輸出: True

result = True and False
print(result)  # 輸出: False

result = False and True
print(result)  # 輸出: False

result = False and False
print(result)  # 輸出: False`}</CodeBlock>

        <h3>2. OR{tx("（或）運算", " (or)")}</h3>
        <CodeBlock label="or_examples.py">{`result = True or True
print(result)  # 輸出: True

result = True or False
print(result)  # 輸出: True

result = False or True
print(result)  # 輸出: True

result = False or False
print(result)  # 輸出: False`}</CodeBlock>

        <h3>3. NOT{tx("（非）運算", " (not)")}</h3>
        <CodeBlock label="not_examples.py">{`result = not True
print(result)  # 輸出: False

result1 = not False
print(result1)  # 輸出: True`}</CodeBlock>
      </section>

      <section id="priority" className="mt-10 scroll-mt-24">
        <h2>{tx("優先順序（priority）", "Order (priority)")}</h2>
        <p>
          {tx(
            "在布林運算中，運算符的優先順序（priority）決定了在複雜表達式中運算的順序。以下是布林運算中主要運算符的優先順序（從高到低）：",
            "When there are many operators, Python follows this order (high to low):",
          )}
        </p>
        <ol className="my-4 space-y-2">
          <li>
            {tx("括號", "Brackets")} <KwMark>()</KwMark>
          </li>
          <li>
            NOT{tx("（非）運算", " (not)")} <KwMark>not</KwMark>
          </li>
          <li>
            AND{tx("（與）運算", " (and)")} <KwMark>and</KwMark>
          </li>
          <li>
            OR{tx("（或）運算", " (or)")} <KwMark>or</KwMark>
          </li>
        </ol>

        <h3>{tx("示例", "Example")}</h3>
        <CodeBlock label="priority.py">{`result = False or True and False
# 由於 AND 運算優先於 OR 運算，所以 True and False 會先被計算
# True and False 的結果是 False，因此結果是 False or False，即 False
print(result)  # 輸出: False`}</CodeBlock>

        <h3>
          {tx("結合", "Mix")} <KwMark>NOT</KwMark>、<KwMark>AND</KwMark> {tx("和", "and")}{" "}
          <KwMark>OR</KwMark>
        </h3>
        <CodeBlock label="combine.py">{`result = not (False or False) and True
print(result)  # 輸出: True`}</CodeBlock>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter11_3"
            practiceLabel={ui.doneChapter("11.3")}
            subject="python"
          />
          <Link
            to="/python/quiz/11-3"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="11-3" />

          <Link
            to="/python/chapter-11"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-ink shadow-sm hover:border-brand"
          >
            {tx("返回小節", "Back to sections")}
          </Link>
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
