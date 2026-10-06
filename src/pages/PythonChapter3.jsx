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
  { id: "intro", label: "本章簡介", labelEn: "Chapter intro" },
  { id: "comment", label: "單行註釋 #", labelEn: "Line comment #" },
  { id: "docstring", label: "文檔字符串 '''", labelEn: "Docstring '''" },
];

const SHORTCUTS = [
  {
    id: "comment",
    label: "#",
    zh: "單行註釋",
    en: "Line comment",
    box: "border-sky-300 bg-sky-100 hover:border-sky-500",
    labelColor: "text-sky-800",
  },
  {
    id: "docstring",
    label: '"""',
    zh: "文檔字符串",
    en: "Docstring",
    box: "border-amber-300 bg-amber-100 hover:border-amber-500",
    labelColor: "text-amber-800",
  },
];

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

export default function PythonChapter3() {
  return (
    <IdeProvider
      initialCode={`print(1)  # print 1
# print(2)

"""
Hi, my name is Eric Un.
I like music.
"""
print("done")
`}
    >
      <ChapterLayout />
    </IdeProvider>
  );
}

function ChapterLayout() {
  const { mobileOpen, setMobileOpen } = useIde();
  const { tx } = useLang();
  const ui = pythonChrome(tx, 3);
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
              {tx("第 3 章 · 註釋與文檔字符串", "Chapter 3 · Comments and docstrings")}
            </h1>
            <p className="mt-0.5 text-sm text-muted">
              {tx("單行註釋 # 與多行 docstring", "Line comments with # and multi-line docstrings")}
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
  const ui = pythonChrome(tx, 3);

  return (
    <article className="lesson-prose">
      <section id="intro" className="scroll-mt-24">
        <h2 className="!text-2xl">
          {tx("註釋與文檔字符串", "Comments and docstrings")}
        </h2>
        <p>
          {tx(
            "寫程式時，我們常需要留下說明給自己或別人看。Python 常用兩種方式：單行註釋",
            "When we write code, we often leave notes for ourselves or other people. Python has two common ways: a line comment",
          )}{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
            #
          </code>{" "}
          {tx("與文檔字符串（docstring）。點擊捷徑可直接跳到對應段落。", "and a docstring. Click a shortcut to jump to that section.")}
        </p>
        <div className="my-5 grid grid-cols-2 gap-3">
          {SHORTCUTS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`flex h-14 flex-col items-center justify-center gap-1.5 rounded-xl border px-4 text-center shadow-sm transition hover:shadow-md ${item.box}`}
            >
              <span
                className={`font-mono text-xl font-bold leading-none sm:text-2xl ${item.labelColor}`}
              >
                {tx(item.label)}
              </span>
              <span className="text-sm font-bold leading-none text-ink sm:text-base">
                {tx(item.zh, item.en)}
              </span>
            </a>
          ))}
        </div>
      </section>

      <section id="comment" className="mt-10 scroll-mt-24">
        <h2>
          {tx("註釋（comment）· 單行註釋", "Comment · one line")}
        </h2>
        <p>
          {tx("註釋使用", "A comment starts with")}{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
            #
          </code>{" "}
          {tx(
            "來標記，主要是用來解釋代碼的作用，幫助開發者或其他閱讀代碼的人理解代碼功能。",
            "It explains what the code does, so you or someone else can understand it.",
          )}
          <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
            #
          </code>{" "}
          {tx("後面的代碼不會被執行。", "code after that is not run.")}
        </p>
        <h3>{ui.examples}</h3>
        <CodeBlock label="comment.py">{`print(1) # print 1
# print(2)`}</CodeBlock>
        <Tip label={ui.tip}>
          <p>
            {tx("第一行會輸出", "The first line prints")}{" "}
            <code className="rounded bg-white px-1 font-mono text-xs">1</code>
            {tx(
              "；第二行整行被註解掉，所以不會執行",
              "; the second line is commented out, so Python will not run",
            )}{" "}
            <code className="rounded bg-white px-1 font-mono text-xs">
              print(2)
            </code>
            {tx("。", ".")}
          </p>
        </Tip>
      </section>

      <section id="docstring" className="mt-10 scroll-mt-24">
        <h2>
          {tx("文檔字符串（docstring）· 多行註釋", "Docstring · multi-line notes")}
        </h2>
        <p>
          {tx(
            "文檔字符串（docstring）是用來描述函數、類、模塊等的功能和用途。雖然不建議，但可以當作注釋使用。引號內的代碼不會被執行。",
            "A docstring describes what a function, class, or module does. You can also use it as a long note. Code inside the quotes is not run.",
          )}
        </p>
        <p>
          <strong className="text-ink">{tx("用途：", "Use: ")}</strong>
          {tx(
            "用於生成代碼的文檔，也能在運行時通過",
            "It can become documentation, and you can read it at run time with",
          )}{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
            __doc__
          </code>{" "}
          {tx("屬性或", "or")}{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
            help()
          </code>{" "}
          {tx("函數來查看。", ".")}
        </p>
        <h3>{ui.examples}</h3>
        <CodeBlock label="docstring.py">{`"""
Hi, my name is Eric Un.
I like music.
"""`}</CodeBlock>
        <p>
          {tx(
            "上面這段只是說明文字，不會輸出到螢幕。若要真正看到 docstring，可把它放在函數裡：",
            "That block is only a note, so nothing is printed. To really see a docstring, put it inside a function:",
          )}
        </p>
        <CodeBlock label="doc_help.py">{`def greet():
    """Say hello to the student."""
    print("Hello!")

print(greet.__doc__)
help(greet)`}</CodeBlock>
      </section>

      <section id="remember" className="mt-10 scroll-mt-24">
        <h2>{ui.remember}</h2>
        <div className="tip-box">
          <p className="tip-box-label mb-1 text-sm font-bold text-amber-800">
            {ui.remember}
          </p>
          <div className="tip-box-body text-sm font-medium text-amber-900/80">
            <p>
              {tx(
                "多行說明可用 docstring（三個引號）；單行說明用",
                "Use a docstring (three quotes) for a longer note. Use",
              )}{" "}
              <code className="rounded bg-white px-1 font-mono text-xs">#</code>
              {tx("。兩者都不會被 Python 執行。", " for a short note. Python does not run either of them.")}
            </p>
          </div>
        </div>
        <div className="my-4 grid gap-3 sm:grid-cols-2">
          <div className="content-box">
            <h3 className="!mt-0 !mb-2 text-base font-bold text-ink">
              {tx("# 單行", "# one line")}
            </h3>
            <p className="!mb-0 text-sm">
              {tx(
                "適合簡短說明，放在程式行尾或單獨一行。",
                "Best for a short note at the end of a line, or on its own line.",
              )}
            </p>
          </div>
          <div className="content-box">
            <h3 className="!mt-0 !mb-2 text-base font-bold text-ink">
              {'"""'} {tx("多行", "multi-line")}
            </h3>
            <p className="!mb-0 text-sm">
              {tx(
                "適合較長說明，常用來寫函數／模組的官方說明。",
                "Best for a longer note, often used as the official description of a function or module.",
              )}
            </p>
          </div>
        </div>
      </section>

      <section id="practice" className="mt-10 scroll-mt-24">
        <h2>{tx("動手練習", "Try it")}</h2>
        <p>
          {tx(
            "在右側 IDE 試試：先用 # 註解，再用三引號寫一段多行說明。",
            "In the IDE on the right, try a # comment, then a three-quote multi-line note.",
          )}
        </p>
        <CodeBlock label="practice.py">{`# this is a one-line comment
print("I can code!")  # this line still runs

"""
This is a multi-line note (docstring style).
It is not run.
"""
print("All done")`}</CodeBlock>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter3"
            practiceLabel={ui.doneChapter(3)}
            subject="python"
          />
          <Link
            to="/python/quiz/3"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="3" />

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
