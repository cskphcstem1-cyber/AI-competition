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
  { id: "intro", label: "字串運算簡介", labelEn: "String ops intro" },
  { id: "concat", label: "字串相加 +", labelEn: "Join strings +" },
  { id: "repeat", label: "字串相乘 *", labelEn: "Repeat string *" },
  { id: "precedence", label: "運算優先級", labelEn: "Order of ops" },
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

export default function PythonChapter10() {
  return (
    <IdeProvider
      initialCode={`str1 = "Hello"
str2 = "World"
result = str1 + " " + str2
print(result)

print("Ha" * 3)
`}
    >
      <ChapterLayout />
    </IdeProvider>
  );
}

function ChapterLayout() {
  const { mobileOpen, setMobileOpen } = useIde();
  const { tx } = useLang();
  const ui = pythonChrome(tx, 10);
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
                {tx("第 10 章 · 字符串運算（String Operations）", "Chapter 10 · String operations")}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {tx("字串相加、相乘與運算優先級", "Join strings, repeat strings, and order")}
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
  const ui = pythonChrome(tx, 10);

  return (
    <article className="lesson-prose">
      <section id="intro" className="scroll-mt-24">
        <h2 className="!text-2xl">{tx("字符串運算（String Operations）", "String operations")}</h2>
        <p>
          {tx("在 Python 中，字串（", "In Python, a string (")}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
            string
          </code>
          {tx(
            "）可以像數字一樣進行一些基本的運算。主要有以下兩種字串運算方式：",
            ") can use some simple math-like operations. There are two main ones:",
          )}
        </p>
        <div className="my-5 grid grid-cols-2 gap-3">
          <a
            href="#concat"
            className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-2 text-center shadow-sm transition hover:border-amber-400 hover:shadow-md"
          >
            <span className="font-mono text-xl font-bold leading-none text-amber-800">
              +
            </span>
            <span className="text-xs font-bold leading-none text-ink">
              {tx("字串相加", "join strings")}
            </span>
          </a>
          <a
            href="#repeat"
            className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl border border-teal-200 bg-teal-50 px-2 text-center shadow-sm transition hover:border-teal-400 hover:shadow-md"
          >
            <span className="font-mono text-xl font-bold leading-none text-teal-800">
              *
            </span>
            <span className="text-xs font-bold leading-none text-ink">
              {tx("字串相乘", "repeat string")}
            </span>
          </a>
        </div>
      </section>

      <section id="concat" className="mt-10 scroll-mt-24">
        <h2>
          1. {tx("字串相加（串接）（", "Join strings (")} <OpMark>+</OpMark> {tx("）", ")")}
        </h2>
        <p>
          {tx("字串之間可以用加號（", "Use plus (")} <OpMark>+</OpMark>{" "}
          {tx("）來進行串接，將兩個或多個字串連接起來。", ") to stick two or more strings together.")}
        </p>
        <CodeBlock label="concat.py">{`str1 = "Hello"
str2 = "World"
result = str1 + " " + str2  # Hello World
print(result)`}</CodeBlock>
      </section>

      <section id="repeat" className="mt-10 scroll-mt-24">
        <h2>
          2. {tx("字串相乘（重複）（", "Repeat a string (")} <OpMark>*</OpMark> {tx("）", ")")}
        </h2>
        <p>
          {tx("字串可以用乘號（", "Use times (")} <OpMark>*</OpMark>{" "}
          {tx("）來進行重複，重複幾次就乘以幾。", ") to repeat the string. Multiply by how many times you want it.")}
        </p>
        <CodeBlock label="repeat.py">{`str1 = "Ha"
result = str1 * 3  # HaHaHa
print(result)`}</CodeBlock>
      </section>

      <section id="precedence" className="mt-10 scroll-mt-24">
        <h2>{tx("運算符優先級（從高到低）", "Order of operations (high to low)")}</h2>
        <ol className="my-4 space-y-2">
          <li>
            {tx("括號", "Brackets")} <OpMark>()</OpMark>
          </li>
          <li>
            <OpMark>*</OpMark> {tx("（乘法／重複）", " (repeat)")}
          </li>
          <li>
            <OpMark>+</OpMark> {tx("（加法／串接）", " (join)")}
          </li>
        </ol>
        <p>
          {tx(
            "當一個表達式中有多個運算符時，Python 會根據運算符的優先級來決定運算的順序。你可以使用",
            "If there are many operators, Python follows this order. You can use",
          )}{" "}
          <strong className="text-ink">{tx("括號", "brackets")}</strong>{" "}
          {tx("來改變運算順序，使得表達式按你希望的順序執行。", "to change the order.")}
        </p>
        <CodeBlock label="str_precedence.py">{`print("Ha" * 2 + "!")       # HaHa!
print(("Hi" + " ") * 3)     # Hi Hi Hi`}</CodeBlock>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter10"
            practiceLabel={ui.doneChapter(10)}
            subject="python"
          />
          <Link
            to="/python/quiz/10"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="10" />

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
