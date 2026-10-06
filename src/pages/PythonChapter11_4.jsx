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
  { id: "intro", label: "邏輯運算符", labelEn: "Logic operators" },
  { id: "truthy", label: "真假範圍", labelEn: "True/false range" },
  { id: "rules", label: "運算規則", labelEn: "Rules" },
  { id: "and", label: "and 範例", labelEn: "and examples" },
  { id: "or", label: "or 範例", labelEn: "or examples" },
  { id: "not", label: "not 範例", labelEn: "not examples" },
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

export default function PythonChapter11_4() {
  return (
    <IdeProvider
      initialCode={`print(1 and 2)
print(0 and 2)
print(1 or 2)
print(0 or 2)
print(not 1)
print(not 0)
print("hello" and "")
print("" or "hello")
`}
    >
      <ChapterLayout />
    </IdeProvider>
  );
}

function ChapterLayout() {
  const { mobileOpen, setMobileOpen } = useIde();
  const { tx } = useLang();
  const ui = pythonChrome(tx, "11.4");
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
                {tx("第 11.4 章 · 布林邏輯運算（進階）", "Chapter 11.4 · Boolean logic (extra)")}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {tx("真假範圍與且／或／非回傳值", "True/false range and what and / or / not give back")}
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
  const ui = pythonChrome(tx, "11.4");

  return (
    <article className="lesson-prose">
      <section id="intro" className="scroll-mt-24">
        <h2 className="!text-2xl">{tx("邏輯運算符", "Logic operators")}</h2>
        <p>
          {tx("Python 的邏輯運算符用於結合或操作布林值（", "Logic operators combine boolean values (")}
          <BoolMark>True</BoolMark> {tx("或", "or")} <BoolMark>False</BoolMark>
          {tx(
            "），並根據條件返回結果。這些運算符不僅適用於布林值，還能處理其他 Python 物件，因為 Python 會根據物件的「真假範圍」進行評估。",
            "). They also work on other values, because Python checks if a value counts as true or false.",
          )}
        </p>
      </section>

      <section id="truthy" className="mt-10 scroll-mt-24">
        <h2>{tx("真假範圍", "True / false range")}</h2>
        <div className="my-4 grid gap-3 sm:grid-cols-2">
          <div className="content-box border-emerald-200 bg-emerald-50/50">
            <h3 className="!mt-0 !mb-2 text-base font-bold text-emerald-800">
              {tx("True 的範圍", "Counts as True")}
            </h3>
            <ul className="!mb-0 space-y-1 text-sm">
              <li>
                <BoolMark>True</BoolMark>
              </li>
              <li>{tx("非 0 數字（例如 1, -1, 3.14）", "Numbers that are not 0 (like 1, -1, 3.14)")}</li>
              <li>
                {tx("非空字串（", "A string that is not empty (")}
                <code className="rounded bg-white px-1 font-mono text-xs">
                  &quot;hello&quot;
                </code>
                ）
              </li>
              <li>
                {tx("非空集合（", "A container that is not empty (")}
                <code className="rounded bg-white px-1 font-mono text-xs">
                  [1, 2]
                </code>
                、
                <code className="rounded bg-white px-1 font-mono text-xs">
                  {"{1: \"a\"}"}
                </code>
                、
                <code className="rounded bg-white px-1 font-mono text-xs">
                  (1,)
                </code>
                、
                <code className="rounded bg-white px-1 font-mono text-xs">
                  {"{1}"}
                </code>
                ）
              </li>
            </ul>
          </div>
          <div className="content-box border-rose-200 bg-rose-50/50">
            <h3 className="!mt-0 !mb-2 text-base font-bold text-rose-800">
              {tx("False 的範圍", "Counts as False")}
            </h3>
            <ul className="!mb-0 space-y-1 text-sm">
              <li>
                <BoolMark>False</BoolMark>
              </li>
              <li>{tx("數字 0", "The number 0")}</li>
              <li>
                {tx("空字串（", "An empty string (")}
                <code className="rounded bg-white px-1 font-mono text-xs">
                  &quot;&quot;
                </code>
                ）
              </li>
              <li>
                {tx("空列表", "Empty list")}{" "}
                <code className="rounded bg-white px-1 font-mono text-xs">
                  []
                </code>
                {tx("、空字典", ", empty dict")}{" "}
                <code className="rounded bg-white px-1 font-mono text-xs">
                  {"{}"}
                </code>
                {tx("、空元組", ", empty tuple")}{" "}
                <code className="rounded bg-white px-1 font-mono text-xs">
                  ()
                </code>
                {tx("、空集合", ", empty set")}{" "}
                <code className="rounded bg-white px-1 font-mono text-xs">
                  set()
                </code>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="rules" className="mt-10 scroll-mt-24">
        <h2>{tx("邏輯運算符規則", "Logic operator rules")}</h2>
        <ol className="space-y-3">
          <li>
            <KwMark>and</KwMark>{tx("（與）：如果第一個運算元為 True 範圍，則返回第二個運算元的結果；如果第一個運算元為 False 範圍，則返回第一個運算元。", " (and): if the first value counts as True, give back the second value. If the first counts as False, give back the first.")}
          </li>
          <li>
            <KwMark>or</KwMark>{tx("（或）：如果第一個運算元為 True 範圍，則返回第一個運算元；如果第一個運算元為 False 範圍，則返回第二個運算元的結果。", " (or): if the first value counts as True, give it back. If it counts as False, give back the second value.")}
          </li>
          <li>
            <KwMark>not</KwMark>{tx("（非）：將結果反轉，True 變 False，False 變 True。", " (not): flip the result. True becomes False, False becomes True.")}
          </li>
        </ol>
        <Tip label={ui.tip}>
          <p>
            <KwMark>and</KwMark> / <KwMark>or</KwMark>{" "}
            {tx(
              "不一定回傳 True 或 False，有時會直接回傳其中一個運算元的值。",
              "do not always give True or False. Sometimes they give back one of the original values.",
            )}
          </p>
        </Tip>
      </section>

      <section id="and" className="mt-10 scroll-mt-24">
        <h2>
          1. <KwMark>and</KwMark> {tx("運算符", "operator")}
        </h2>
        <p>
          <KwMark>and</KwMark> {tx("會檢查第一個運算元是否為 True 範圍：", " checks if the first value counts as True:")}
        </p>
        <ul>
          <li>{tx("如果是，則返回第二個運算元的值。", "If yes, give back the second value.")}</li>
          <li>{tx("如果不是，則返回第一個運算元的值（不評估第二個運算元）。", "If no, give back the first value (and skip the second).")}</li>
        </ul>
        <CodeBlock label="and_values.py">{`print(False and True)   # 輸出: False
print(False and False)  # 輸出: False
print(1 and 2)          # 輸出: 2 （1 是 True 範圍，返回第二個運算元）
print(0 and 2)          # 輸出: 0 （0 是 False 範圍，返回第一個運算元）
print("hello" and "")   # 輸出: "" （"hello" 是 True 範圍，返回第二個運算元）
print([] and "world")   # 輸出: [] （[] 是 False 範圍，返回第一個運算元）`}</CodeBlock>
      </section>

      <section id="or" className="mt-10 scroll-mt-24">
        <h2>
          2. <KwMark>or</KwMark> {tx("運算符", "operator")}
        </h2>
        <p>
          <KwMark>or</KwMark> {tx("會檢查第一個運算元是否為 True 範圍：", " checks if the first value counts as True:")}
        </p>
        <ul>
          <li>{tx("如果是，則返回第一個運算元的值（不評估第二個運算元）。", "If yes, give back the first value (and skip the second).")}</li>
          <li>{tx("如果不是，則返回第二個運算元的值。", "If no, give back the second value.")}</li>
        </ul>
        <CodeBlock label="or_values.py">{`print(False or True)    # 輸出: True
print(False or False)   # 輸出: False
print(1 or 2)           # 輸出: 1 （1 是 True 範圍，返回第一個運算元）
print(0 or 2)           # 輸出: 2 （0 是 False 範圍，返回第二個運算元）
print("" or "hello")    # 輸出: "hello" （"" 是 False 範圍，返回第二個運算元）
print("world" or [])    # 輸出: "world" （"world" 是 True 範圍，返回第一個運算元）`}</CodeBlock>
      </section>

      <section id="not" className="mt-10 scroll-mt-24">
        <h2>
          3. <KwMark>not</KwMark> {tx("運算符", "operator")}
        </h2>
        <p>
          <KwMark>not</KwMark> {tx("將運算元的真假值反轉，返回", " flips true/false and gives back")}{" "}
          <BoolMark>True</BoolMark> {tx("或", "or")} <BoolMark>False</BoolMark>。
        </p>
        <CodeBlock label="not_values.py">{`print(not False)        # 輸出: True
print(not 1)            # 輸出: False （1 是 True 範圍，not 反轉為 False）
print(not 0)            # 輸出: True （0 是 False 範圍，not 反轉為 True）
print(not "hello")      # 輸出: False （"hello" 是 True 範圍，not 反轉為 False）
print(not "")           # 輸出: True （"" 是 False 範圍，not 反轉為 True）`}</CodeBlock>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter11_4"
            practiceLabel={ui.doneChapter("11.4")}
            subject="python"
          />
          <Link
            to="/python/quiz/11-4"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="11-4" />

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
