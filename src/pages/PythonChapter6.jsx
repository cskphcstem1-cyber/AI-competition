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
  { id: "intro", label: "print() 簡介", labelEn: "print() intro", fn: "print()" },
  { id: "basic", label: "基本用法", labelEn: "Basic use" },
  { id: "triple", label: "三引號", labelEn: "Triple quotes" },
  { id: "sep", label: "sep 分隔符", labelEn: "sep separator" },
  { id: "end", label: "end 結束符", labelEn: "end ending" },
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

function ParamMark({ children }) {
  return (
    <code className="rounded bg-sky-50 px-1.5 py-0.5 font-mono text-sm font-bold text-sky-800">
      {children}
    </code>
  );
}

function OutputSample({ children }) {
  const { tx } = useLang();
  return (
    <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
      <p className="border-b border-slate-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-muted">
        {tx("輸出結果", "Output")}
      </p>
      <pre className="whitespace-pre-wrap px-4 py-3 font-mono text-sm font-semibold text-brand-dark">
        {children}
      </pre>
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

export default function PythonChapter6() {
  return (
    <IdeProvider
      initialCode={`print("我是你們的老師")
print("你好", "世界", "早安")
print("你好", "世界", "早安", sep="!!")
print("你好", end="!!!!!")
print("我叫Eric")
`}
    >
      <ChapterLayout />
    </IdeProvider>
  );
}

function ChapterLayout() {
  const { mobileOpen, setMobileOpen } = useIde();
  const { tx } = useLang();
  const ui = pythonChrome(tx, 6);
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
                {tx("第 6 章 · 輸出指令", "Chapter 6 · Print output")} <CodeName>print()</CodeName>
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {tx("基本輸出、三引號、sep 與 end", "Basic print, triple quotes, sep, and end")}
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
  const ui = pythonChrome(tx, 6);

  return (
    <article className="lesson-prose">
      <section id="intro" className="scroll-mt-24">
        <h2 className="!text-2xl">
          {tx("輸出 ·", "Output ·")} <CodeName>print()</CodeName>
        </h2>
        <p>
          {tx("在 Python 中，", "In Python,")} <InlineFn>print()</InlineFn>{" "}
          {tx(
            "函數用於輸出訊息到螢幕。這是一個非常常用的函數，並且有一些參數可以幫助我們控制輸出格式。",
            "shows a message on the screen. It is used a lot, and extra settings can change how it looks.",
          )}
        </p>
      </section>

      <section id="basic" className="mt-10 scroll-mt-24">
        <h2>{tx("基本用法", "Basic use")}</h2>
        <p>
          <InlineFn>print()</InlineFn>{" "}
          {tx("函數的最基本用法是輸出引號內的文字，例如：", "can print the text inside quotes, for example:")}
        </p>
        <CodeBlock label="print_basic.py">{`print("我是你們的老師")`}</CodeBlock>
        <OutputSample>我是你們的老師</OutputSample>
      </section>

      <section id="triple" className="mt-10 scroll-mt-24">
        <h2>{tx("三引號（Triple Quotes）", "Triple quotes")}</h2>
        <p>{tx("另一種方法是使用三引號，允許你在字串中自由換行，並保持格式。", "You can also use three quotes. Then you can start a new line and keep the shape.")}</p>
        <h3>{tx("範例", "Example")}</h3>
        <CodeBlock label="print_triple.py">{`print("""我是你們的老師,
我很喜歡你們,
但是,
請你們不要搞搞震""")`}</CodeBlock>
        <OutputSample>{`我是你們的老師,
我很喜歡你們,
但是,
請你們不要搞搞震`}</OutputSample>
      </section>

      <section id="sep" className="mt-10 scroll-mt-24">
        <h2>
          <InlineFn>print()</InlineFn> {tx("的其他參數 ·", "extra setting ·")} <ParamMark>sep</ParamMark>
        </h2>
        <p>
          <ParamMark>sep</ParamMark>
          {tx("（分隔符）：控制多個輸出項之間的間隔符，默認是", " (separator): what to put between items. The default is a")}{" "}
          <strong className="text-ink">{tx("空格", "space")}</strong>。
        </p>
        <CodeBlock label="sep_default.py">{`print("你好", "世界", "早安")  # 默認是空格`}</CodeBlock>
        <OutputSample>你好 世界 早安</OutputSample>

        <CodeBlock label="sep_empty.py">{`print("你好", "世界", "早安", sep="")`}</CodeBlock>
        <OutputSample>你好世界早安</OutputSample>

        <CodeBlock label="sep_custom.py">{`print("你好", "世界", "早安", sep="!!")`}</CodeBlock>
        <OutputSample>你好!!世界!!早安</OutputSample>
      </section>

      <section id="end" className="mt-10 scroll-mt-24">
        <h2>
          <ParamMark>end</ParamMark> {tx("結束符", "ending")}
        </h2>
        <p>
          <ParamMark>end</ParamMark>
          {tx("（結束符）：控制輸出結束時的字符，默認是換行符", " (ending): the character after the print. The default is a new line")}{" "}
          <code className="rounded bg-slate-100 px-1 font-mono text-xs">
            \n
          </code>
          。
        </p>
        <CodeBlock label="end_default.py">{`print("你好")  # 默認是換行符 \\n
print("我叫Eric")  # 默認是換行符 \\n`}</CodeBlock>
        <OutputSample>{`你好
我叫Eric`}</OutputSample>

        <CodeBlock label="end_empty.py">{`print("你好", end="")
print("我叫Eric")`}</CodeBlock>
        <OutputSample>你好我叫Eric</OutputSample>

        <CodeBlock label="end_custom.py">{`print("你好", end="!!!!!")
print("我叫Eric")`}</CodeBlock>
        <OutputSample>你好!!!!!我叫Eric</OutputSample>

        <Tip label={ui.tip}>
          <p>
            {tx("試試在右側 IDE 改", "In the IDE, try changing")} <ParamMark>sep</ParamMark> {tx("和", "and")}{" "}
            <ParamMark>end</ParamMark>{tx("，看看輸出有什麼變化。", " and see how the output changes.")}
          </p>
        </Tip>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter6"
            practiceLabel={ui.doneChapter(6)}
            subject="python"
          />
          <Link
            to="/python/quiz/6"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="6" />

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
