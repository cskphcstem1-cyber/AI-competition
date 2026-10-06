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
  { id: "intro", label: "保留字簡介", labelEn: "Keywords intro" },
  { id: "builtins", label: "內建函數", labelEn: "Built-in functions" },
  { id: "keywords", label: "常見保留字", labelEn: "Common keywords" },
];

const KEYWORDS = [
  { word: "False", meaning: "布爾值，表示假。", meaningEn: "Boolean false." },
  { word: "True", meaning: "布爾值，表示真。", meaningEn: "Boolean true." },
  { word: "None", meaning: "表示空值或無，類似於其他語言中的 null。", meaningEn: "Means empty or nothing, like null in other languages." },
  { word: "and", meaning: "邏輯與運算符，兩個條件都為真時結果為真。", meaningEn: "And: both sides must be true." },
  { word: "or", meaning: "邏輯或運算符，兩個條件中有一個為真時結果為真。", meaningEn: "Or: true if at least one side is true." },
  { word: "not", meaning: "邏輯非運算符，將布爾值取反。", meaningEn: "Not: flips true and false." },
  { word: "if", meaning: "條件語句，判斷某個條件是否為真，進行相應的操作。", meaningEn: "If: run code when a condition is true." },
  { word: "else", meaning: "與 if 結合使用，當 if 條件不成立時執行的代碼。", meaningEn: "Else: run this when the if is false." },
  { word: "elif", meaning: "else if 的縮寫，用來在多條件判斷中進行額外的判斷。", meaningEn: "Elif: extra check after if." },
  { word: "for", meaning: "用於循環，遍歷序列（如列表、字串等）。", meaningEn: "For: loop through a list or string." },
  { word: "while", meaning: "當條件為真時，反覆執行某段代碼。", meaningEn: "While: keep looping while a condition is true." },
  { word: "break", meaning: "在循環中，立即終止循環。", meaningEn: "Break: stop the loop now." },
  { word: "continue", meaning: "在循環中，跳過當前迭代，繼續下一次迭代。", meaningEn: "Continue: skip this round and go to the next." },
  { word: "def", meaning: "用來定義函數。", meaningEn: "Def: make a function." },
  { word: "return", meaning: "從函數返回結果。", meaningEn: "Return: send a result out of a function." },
  { word: "class", meaning: "用來定義類。", meaningEn: "Class: make a class." },
  { word: "try", meaning: "用來捕獲異常，搭配 except 處理潛在的錯誤。", meaningEn: "Try: watch for errors." },
  { word: "except", meaning: "用來處理在 try 區塊中引發的異常。", meaningEn: "Except: handle an error from try." },
  { word: "finally", meaning: "無論是否有異常，都會執行的代碼塊，通常用於清理操作。", meaningEn: "Finally: always run this, even after an error." },
  { word: "import", meaning: "用來導入模塊或包。", meaningEn: "Import: bring in a module." },
  { word: "from", meaning: "與 import 結合，用於從模塊中導入特定函數或變量。", meaningEn: "From: import one part of a module." },
  { word: "global", meaning: "聲明全局變量，允許在函數內修改全局變量的值。", meaningEn: "Global: change a variable from outside the function." },
  { word: "nonlocal", meaning: "用來在嵌套函數中，聲明使用外層函數中的變量。", meaningEn: "Nonlocal: use a variable from the outer function." },
  { word: "lambda", meaning: "用來創建匿名函數。", meaningEn: "Lambda: a tiny function with no name." },
  { word: "yield", meaning: "用來在生成器函數中返回值，允許函數保留狀態並在多次調用中返回值。", meaningEn: "Yield: give a value from a generator and keep going later." },
  { word: "assert", meaning: "斷言，用來進行條件檢查，如果條件為假，則拋出異常。", meaningEn: "Assert: check that something is true, or raise an error." },
  { word: "pass", meaning: "表示空操作，通常用在需要語法上有代碼但實際不做任何事情的地方。", meaningEn: "Pass: do nothing. Use it as a placeholder." },
  { word: "with", meaning: "用來簡化某些資源管理，如文件操作，保證資源在使用後正確釋放。", meaningEn: "With: open something (like a file) and close it safely." },
  { word: "async", meaning: "用於定義異步函數。", meaningEn: "Async: make an async function." },
  { word: "await", meaning: "用於操作異步函數。", meaningEn: "Await: wait for an async function." },
  { word: "del", meaning: "用來刪除變量或數據結構中的元素。", meaningEn: "Del: delete a variable or an item." },
  { word: "is", meaning: "用來判斷兩個變量是否引用同一個對象。", meaningEn: "Is: check if two names point to the same object." },
  { word: "in", meaning: "用來檢查某個元素是否在某個容器（如列表、字典）中。", meaningEn: "In: check if something is inside a list or dict." },
];

function InlineFn({ children }) {
  const text = String(children).trim();
  const match = text.match(/^(.*?)(\(\))$/);
  if (!match) {
    return (
      <code className="rounded bg-white px-1 font-mono text-xs">{children}</code>
    );
  }
  return (
    <code className="rounded bg-white px-1 font-mono text-xs font-semibold">
      {match[1]}
      <span className="font-normal tracking-[0.12em]">{match[2]}</span>
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

export default function PythonChapter5() {
  return (
    <IdeProvider
      initialCode={`import keyword
print(keyword.kwlist)
`}
    >
      <ChapterLayout />
    </IdeProvider>
  );
}

function ChapterLayout() {
  const { mobileOpen, setMobileOpen } = useIde();
  const { tx } = useLang();
  const ui = pythonChrome(tx, 5);
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
                {tx("第 5 章 · 保留字（Keywords）", "Chapter 5 · Keywords")}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {tx("Python 保留字不能當變量名使用", "Python keywords cannot be used as variable names")}
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
  const ui = pythonChrome(tx, 5);

  return (
    <article className="lesson-prose">
      <section id="intro" className="scroll-mt-24">
        <h2 className="!text-2xl">{tx("保留字（Keywords）", "Keywords")}</h2>
        <p>
          {tx("Python 的", "Python")} <strong className="text-ink">{tx("保留字", "keywords")}</strong>
          {tx(
            "（keywords）是編程語言中具有特殊意義的詞彙，這些詞是 Python 語言保留並具有特定功能的，",
            " are special words. Python keeps them for itself, ",
          )}
          <strong className="text-coral">
            {tx("不能用作變量名、函數名或其他標識符", "so you cannot use them as variable names, function names, or other names")}
          </strong>
          {tx(
            "。這些保留字通常用來構建程式的控制結構、邏輯運算、定義數據結構等。下面是一些常見的 Python 保留字的解釋：",
            ". They help with if/for logic and other parts of a program. Here are common keywords:",
          )}
        </p>
        <p>{tx("可以在右側 IDE 執行下面程式，列出 Python 全部保留字：", "Run this in the IDE on the right to list all Python keywords:")}</p>
        <CodeBlock label="keywords.py">{`import keyword
print(keyword.kwlist)`}</CodeBlock>
      </section>

      <section id="builtins" className="mt-10 scroll-mt-24">
        <h2>{tx("內建函數不是保留字", "Built-in functions are not keywords")}</h2>
        <Tip label={ui.tip}>
          <p>
            {tx("內建函數（Built-in Functions）並不是保留字，如", "Built-in functions are not keywords, like")}{" "}
            <InlineFn>print()</InlineFn>、<InlineFn>int()</InlineFn>、
            <InlineFn>len()</InlineFn>
            {tx("。後面帶有括號的。", ". They have brackets after the name.")}
          </p>
        </Tip>
      </section>

      <section id="keywords" className="mt-10 scroll-mt-24">
        <h2>{tx("常見 Python 保留字（關鍵詞）及解釋", "Common Python keywords")}</h2>
        <ol className="my-5 space-y-2.5 !pl-0">
          {KEYWORDS.map((item, i) => (
            <li
              key={item.word}
              className="flex gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
            >
              <span className="w-6 shrink-0 font-mono text-xs font-bold text-brand/70">
                {i + 1}.
              </span>
              <p className="!mb-0 leading-relaxed text-muted">
                <code className="mr-1.5 rounded bg-rose-50 px-1.5 py-0.5 font-mono text-sm font-bold text-coral">
                  {item.word}
                </code>
                {tx(item.meaning, item.meaningEn)}
              </p>
            </li>
          ))}
        </ol>
        <Tip label={ui.tip}>
          <p>
            {tx("記住：保留字有特殊用途，不要拿來當變量名。例如不要寫", "Remember: keywords have a special job. Do not use them as names. Do not write")}{" "}
            <code className="rounded bg-white px-1 font-mono text-xs text-coral">
              for = 1
            </code>{" "}
            {tx("或", "or")}{" "}
            <code className="rounded bg-white px-1 font-mono text-xs text-coral">
              class = &quot;A&quot;
            </code>
            。
          </p>
        </Tip>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter5"
            practiceLabel={ui.doneChapter(5)}
            subject="python"
          />
          <Link
            to="/python/quiz/5"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="5" />

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
