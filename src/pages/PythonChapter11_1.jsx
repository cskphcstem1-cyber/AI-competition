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
  { id: "intro", label: "布林值簡介", labelEn: "Boolean intro" },
  { id: "uses", label: "布林值的用途", labelEn: "What booleans do" },
  { id: "convert", label: "布林值轉換", labelEn: "Convert to boolean" },
];


function InlineFn({ children }) {
  const text = String(children).trim();
  const match = text.match(/^(.*?)(\(\))$/);
  if (!match) {
    return (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    );
  }
  return (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm font-semibold">
      {match[1]}
      <span className="font-normal tracking-[0.12em]">{match[2]}</span>
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

export default function PythonChapter11_1() {
  return (
    <IdeProvider
      initialCode={`print(bool(0))
print(bool(42))
print(bool(""))
print(bool("Hello"))
print(True)
print(False)
`}
    >
      <ChapterLayout />
    </IdeProvider>
  );
}

function ChapterLayout() {
  const { mobileOpen, setMobileOpen } = useIde();
  const { tx } = useLang();
  const ui = pythonChrome(tx, "11.1");
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
                {tx("第 11.1 章 · 布林值（資料類型）", "Chapter 11.1 · Boolean (data type)")}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {tx("真與假、用途與布林值轉換", "True and false, uses, and converting to boolean")}
              </p>
          </div>
        </header>

        <div className="flex gap-4">
          <nav
            className="hidden w-full shrink-0 md:block md:w-44"
          >
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
  const ui = pythonChrome(tx, "11.1");

  return (
    <article className="lesson-prose">
      <section id="intro" className="scroll-mt-24">
        <h2 className="!text-2xl">{tx("布林值 Boolean（Datatype）", "Boolean (data type)")}</h2>
        <p>
          {tx("布林值（Boolean Value）是 Python 中的一種資料類型（Datatype），表示邏輯上的", "A boolean is a Python data type. It means")}{" "}
          <strong className="text-ink">{tx("真（True）", "true (True)")}</strong> {tx("或", "or")}{" "}
          <strong className="text-ink">{tx("假（False）", "false (False)")}</strong>
          {tx("。布林值只有", ". A boolean has only")}{" "}
          <strong className="text-ink">{tx("兩個可能的取值", "two possible values")}</strong>：
        </p>
        <div className="my-5 grid grid-cols-2 gap-3">
          <div className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl border border-emerald-300 bg-emerald-50 px-2 text-center shadow-sm">
            <span className="font-mono text-xl font-bold leading-none text-emerald-800">
              True
            </span>
            <span className="text-xs font-bold leading-none text-ink">{tx("真", "true")}</span>
          </div>
          <div className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl border border-rose-300 bg-rose-50 px-2 text-center shadow-sm">
            <span className="font-mono text-xl font-bold leading-none text-rose-800">
              False
            </span>
            <span className="text-xs font-bold leading-none text-ink">{tx("假", "false")}</span>
          </div>
        </div>
        <Tip label={ui.tip}>
          <p>{tx("注意第一個字母必須大寫。", "The first letter must be a capital.")}</p>
        </Tip>
        <p>
          {tx(
            "在程式語言中，布林值通常用來表示條件判斷的結果，像是「這個陳述是否為真？」。布林值的名字來自於數學家喬治·布爾（George Boole），他是布爾代數的創始人。",
            "In code, a boolean answers a yes/no question, like “is this true?” The name comes from the mathematician George Boole.",
          )}
        </p>
        <CodeBlock label="bool_values.py">{`print(True)
print(False)
print(type(True))
print(type(False))`}</CodeBlock>
      </section>

      <section id="uses" className="mt-10 scroll-mt-24">
        <h2>{tx("布林值的用途", "What booleans do")}</h2>
        <p>
          {tx("布林值主要用在", "Booleans are used in")}{" "}
          <strong className="text-ink">{tx("條件判斷、迴圈和邏輯運算", "if checks, loops, and logic")}</strong>
          {tx("中。例如，在 Python 中，布林值常與", ". In Python they often work with")}{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
            if
          </code>{" "}
          {tx("條件語句配合使用，用來控制程式的執行流程。", "to decide which code runs next.")}
        </p>
        <CodeBlock label="bool_if.py">{`is_sunny = True
if is_sunny:
    print("Go outside!")
else:
    print("Stay inside.")`}</CodeBlock>
      </section>

      <section id="convert" className="mt-10 scroll-mt-24">
        <h2>{tx("布林值轉換", "Convert to boolean")}</h2>
        <p>
          {tx("任何物件都可以被轉換為布林值。大多數物件會被認為是", "Any value can become a boolean. Most values count as")}{" "}
          <BoolMark>True</BoolMark>{tx("，但以下例外情況會被認為是", ", but these count as")}{" "}
          <BoolMark>False</BoolMark>：
        </p>
        <ul>
          <li>
            {tx("數字", "The number")}{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-xs">
              0
            </code>
          </li>
          <li>
            {tx("空字串", "An empty string")}{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-xs">
              &apos;&apos;
            </code>
          </li>
          <li>
            <code className="rounded bg-rose-50 px-1 font-mono text-xs font-bold text-coral">
              None
            </code>
            {tx("（空值）", " (empty value)")}
          </li>
          <li>{tx("空的容器類型（例如空列表、空元組、空字典）", "Empty containers (empty list, tuple, or dict)")}</li>
        </ul>
        <p>
          {tx("可以用", "Use")} <InlineFn>bool()</InlineFn> {tx("把值轉換成布林值：", " to turn a value into a boolean:")}
        </p>
        <CodeBlock label="bool_convert.py">{`print(bool(0))        # False
print(bool(42))       # True
print(bool(""))       # False
print(bool("Hello"))  # True`}</CodeBlock>
        <Tip label={ui.tip}>
          <p>
            {tx("記住：", "Remember: ")}<BoolMark>0</BoolMark>
            {tx("、空字串、", ", empty strings, ")}
            <code className="rounded bg-white px-1 font-mono text-xs text-coral">
              None
            </code>
            {tx("、空容器會變成", ", and empty containers become")} <BoolMark>False</BoolMark>
            {tx("；其他大多數值是", "; most other values are")}{" "}
            <BoolMark>True</BoolMark>。
          </p>
        </Tip>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter11_1"
            practiceLabel={ui.doneChapter("11.1")}
            subject="python"
          />
          <Link
            to="/python/quiz/11-1"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="11-1" />

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
