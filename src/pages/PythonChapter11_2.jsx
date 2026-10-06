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
  { id: "intro", label: "比較運算簡介", labelEn: "Compare intro" },
  { id: "eq", label: "等於 ==", labelEn: "Equal ==" },
  { id: "ne", label: "不等於 !=", labelEn: "Not equal !=" },
  { id: "gt", label: "大於 >", labelEn: "Greater >" },
  { id: "lt", label: "小於 <", labelEn: "Less <" },
  { id: "ge", label: "大於等於 >=", labelEn: "Greater or equal >=" },
  { id: "le", label: "小於等於 <=", labelEn: "Less or equal <=" },
];

const OP_SHORTCUTS = [
  { id: "eq", symbol: "==", zh: "等於", en: "equal" },
  { id: "ne", symbol: "!=", zh: "不等於", en: "not equal" },
  { id: "gt", symbol: ">", zh: "大於", en: "greater" },
  { id: "lt", symbol: "<", zh: "小於", en: "less" },
  { id: "ge", symbol: ">=", zh: "大於等於", en: "greater or equal" },
  { id: "le", symbol: "<=", zh: "小於等於", en: "less or equal" },
];

function OpMark({ children }) {
  return (
    <code className="rounded bg-rose-50 px-1.5 py-0.5 font-mono text-sm font-bold text-coral">
      {children}
    </code>
  );
}

function BoolMark({ children }) {
  return (
    <code className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-sm font-bold text-emerald-700">
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

export default function PythonChapter11_2() {
  return (
    <IdeProvider
      initialCode={`print(3 == 3)
print(3 != 5)
print(5 > 3)
print(3 < 5)
print(5 >= 5)
print(3 <= 3)
`}
    >
      <ChapterLayout />
    </IdeProvider>
  );
}

function ChapterLayout() {
  const { mobileOpen, setMobileOpen } = useIde();
  const { tx } = useLang();
  const ui = pythonChrome(tx, "11.2");
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
                {tx("第 11.2 章 · 比較運算符", "Chapter 11.2 · Compare operators")}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {tx("等於、不等於、大於、小於與布林結果", "Equal, not equal, greater, less, and boolean results")}
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
  const ui = pythonChrome(tx, "11.2");

  return (
    <article className="lesson-prose">
      <section id="intro" className="scroll-mt-24">
        <h2 className="!text-2xl">{tx("比較運算符", "Compare operators")}</h2>
        <p>
          {tx("比較運算（Comparison Operators）是程式語言中用來", "Compare operators")}{" "}
          <strong className="text-ink">{tx("比較兩個值", "compare two values")}</strong>
          {tx("之間關係的運算符。這些運算的結果通常是", ". The result is a")}{" "}
          <strong className="text-ink">{tx("布林值（Boolean）", "boolean")}</strong>{tx("，即", ", either")}{" "}
          <BoolMark>True</BoolMark>{tx("（真）或", " (true) or")} <BoolMark>False</BoolMark>
          {tx("（假）。Python 裡的比較運算符有以下幾種：", " (false). Python has these compare operators:")}
        </p>
        <div className="my-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
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

      <section id="eq" className="mt-10 scroll-mt-24">
        <h2>
          1. {tx("等於（", "Equal (")} <OpMark>==</OpMark> {tx("）", ")")}
        </h2>
        <p>
          {tx("檢查兩個值是否相等。如果相等，結果為", "Are the two values the same? If yes, the result is")} <BoolMark>True</BoolMark>
          {tx("，否則為", ". If no, it is")} <BoolMark>False</BoolMark>。
        </p>
        <CodeBlock label="eq.py">{`print(3 == 3)  # True
print(3 == 5)  # False
print("a" == "a")  # True
print(False == True)  # False
print("A" == "a")  # False`}</CodeBlock>
      </section>

      <section id="ne" className="mt-10 scroll-mt-24">
        <h2>
          2. {tx("不等於（", "Not equal (")} <OpMark>!=</OpMark> {tx("）", ")")}
        </h2>
        <p>
          {tx("檢查兩個值是否不相等。如果不相等，結果為", "Are the two values different? If yes, the result is")} <BoolMark>True</BoolMark>
          {tx("，否則為", ". If no, it is")} <BoolMark>False</BoolMark>。
        </p>
        <CodeBlock label="ne.py">{`print(3 != 5)  # True
print(3 != 3)  # False`}</CodeBlock>
      </section>

      <section id="gt" className="mt-10 scroll-mt-24">
        <h2>
          3. {tx("大於（", "Greater than (")} <OpMark>&gt;</OpMark> {tx("）", ")")}
        </h2>
        <p>{tx("檢查左邊的值是否大於右邊的值。", "Is the left value bigger than the right value?")}</p>
        <CodeBlock label="gt.py">{`print(5 > 3)  # True
print(3 > 5)  # False
print("ba" > "aa")  # True 按字母順序`}</CodeBlock>
      </section>

      <section id="lt" className="mt-10 scroll-mt-24">
        <h2>
          4. {tx("小於（", "Less than (")} <OpMark>&lt;</OpMark> {tx("）", ")")}
        </h2>
        <p>{tx("檢查左邊的值是否小於右邊的值。", "Is the left value smaller than the right value?")}</p>
        <CodeBlock label="lt.py">{`print(3 < 5)  # True
print(5 < 3)  # False
print("a" < "b")  # True 按字母順序`}</CodeBlock>
      </section>

      <section id="ge" className="mt-10 scroll-mt-24">
        <h2>
          5. {tx("大於或等於（", "Greater or equal (")} <OpMark>&gt;=</OpMark> {tx("）", ")")}
        </h2>
        <p>{tx("檢查左邊的值是否大於或等於右邊的值。", "Is the left value bigger than, or the same as, the right value?")}</p>
        <CodeBlock label="ge.py">{`print(5 >= 5)  # True
print(5 >= 3)  # True`}</CodeBlock>
      </section>

      <section id="le" className="mt-10 scroll-mt-24">
        <h2>
          6. {tx("小於或等於（", "Less or equal (")} <OpMark>&lt;=</OpMark> {tx("）", ")")}
        </h2>
        <p>{tx("檢查左邊的值是否小於或等於右邊的值。", "Is the left value smaller than, or the same as, the right value?")}</p>
        <CodeBlock label="le.py">{`print(3 <= 3)  # True
print(5 <= 3)  # False`}</CodeBlock>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter11_2"
            practiceLabel={ui.doneChapter("11.2")}
            subject="python"
          />
          <Link
            to="/python/quiz/11-2"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="11-2" />

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
