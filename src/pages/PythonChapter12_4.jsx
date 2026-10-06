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
  { id: "setup", label: "setup()", labelEn: "setup()" },
  { id: "screensize", label: "screensize()", labelEn: "screensize()" },
  { id: "bgcolor", label: "bgcolor()", labelEn: "bgcolor()" },
  { id: "mainloop", label: "mainloop()", labelEn: "mainloop()" },
  { id: "done", label: "done()", labelEn: "done()" },
  { id: "shape", label: "shape()", labelEn: "shape()" },
  { id: "write", label: "write()", labelEn: "write()" },
  { id: "stamp", label: "stamp()", labelEn: "stamp()" },
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

function TocFn({ children }) {
  const text = String(children);
  const match = text.match(/^(.*?)(\(\))$/);
  if (!match) {
    return <span className="font-mono tracking-normal">{children}</span>;
  }
  return (
    <span className="inline-flex whitespace-nowrap font-mono tracking-normal">
      {match[1]}
      <span className="translate-y-px tracking-[0.18em]">()</span>
    </span>
  );
}

function InlineFn({ children }) {
  const text = String(children).trim();
  const match = text.match(/^(.*?)(\(.*\))$/);
  if (!match) {
    return (
      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm font-semibold">
        {children}
      </code>
    );
  }
  return (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm font-semibold">
      {match[1]}
      <span className="font-normal tracking-tight">{match[2]}</span>
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

export default function PythonChapter12_4() {
  return (
    <IdeProvider
      initialCode={`# 建議在 IDLE / 本機 Python 執行
import turtle
turtle.setup(700, 400, 0, 0)
turtle.bgcolor("lightblue")
t = turtle.Turtle()
t.shape("turtle")
t.write("Hello!", align="center", font=("Arial", 16, "bold"))
t.stamp()
turtle.done()
`}
    >
      <ChapterLayout />
    </IdeProvider>
  );
}

function ChapterLayout() {
  const { mobileOpen, setMobileOpen } = useIde();
  const { tx } = useLang();
  const ui = pythonChrome(tx, "12.4");
  const [active, setActive] = useState("setup");

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
                {tx("第 12.4 章 · 畫布、形狀與文字", "Chapter 12.4 · Canvas, shape, and text")}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {tx("視窗設定、背景顏色、海龜外形、文字輸出與蓋章", "Window size, background color, turtle shape, write text, and stamp")}
              </p>
          </div>
        </header>

        <div className="flex gap-4">
          <nav className="hidden w-full shrink-0 md:block md:w-52">
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
                      <TocFn>{tx(item.label, item.labelEn)}</TocFn>
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
  const ui = pythonChrome(tx, "12.4");

  return (
    <article className="lesson-prose">
      <section id="setup" className="scroll-mt-24">
        <h2>
          <CodeName>turtle.setup()</CodeName>
        </h2>
        <p>
          <InlineFn>turtle.setup(width, height, startx, starty)</InlineFn>{" "}
          {tx("設定畫布寬度、高度，以及視窗的起始座標。", "sets the window width, height, and where it appears.")}
        </p>
        <CodeBlock label="setup.py">{`import turtle
turtle.setup(700, 400, 0, 0)  # width=700, height=400, startx=0, starty=0
turtle.done()`}</CodeBlock>
        <Tip label={ui.tip}>
          <p>{tx("會建立一個寬 700 像素、高 400 像素的視窗。", "This makes a window 700 pixels wide and 400 pixels tall.")}</p>
        </Tip>
      </section>

      <section id="screensize" className="mt-10 scroll-mt-24">
        <h2>
          <CodeName>turtle.screensize()</CodeName>
        </h2>
        <p>
          <InlineFn>turtle.screensize(width, height, color)</InlineFn>{" "}
          {tx("設置畫布內部繪圖區域大小，並可設定背景顏色。", "sets the inner drawing size, and you can set a background color.")}
        </p>
        <CodeBlock label="screensize.py">{`import turtle
turtle.screensize(500, 500, "red")
turtle.done()`}</CodeBlock>
      </section>

      <section id="bgcolor" className="mt-10 scroll-mt-24">
        <h2>
          <CodeName>turtle.bgcolor()</CodeName>
        </h2>
        <p>{tx("設置畫布背景顏色。", "Set the background color.")}</p>
        <CodeBlock label="bgcolor.py">{`import turtle
turtle.bgcolor("lightblue")
turtle.done()`}</CodeBlock>
      </section>

      <section id="mainloop" className="mt-10 scroll-mt-24">
        <h2>
          <CodeName>turtle.mainloop()</CodeName>
        </h2>
        <p>{tx("保持視窗開啟（通常與", "Keep the window open (similar to")} <InlineFn>done()</InlineFn> {tx("功能類似）。", ").")}</p>
        <CodeBlock label="mainloop.py">{`import turtle
turtle.mainloop()`}</CodeBlock>
      </section>

      <section id="done" className="mt-10 scroll-mt-24">
        <h2>
          <CodeName>turtle.done()</CodeName>
        </h2>
        <p>{tx("結束程式並保持視窗開啟（通常放在最後一行）。", "Finish the program but keep the window open (usually the last line).")}</p>
        <CodeBlock label="done.py">{`import turtle
t = turtle.Turtle()
t.forward(50)
turtle.done()`}</CodeBlock>
      </section>

      <section id="shape" className="mt-10 scroll-mt-24">
        <h2>
          <CodeName>shape()</CodeName>
        </h2>
        <p>{tx("改變海龜外觀形狀。可選值：", "Change how the turtle looks. You can use:")}</p>
        <ul>
          <li>
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;arrow&quot;</code>
            、{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;turtle&quot;</code>
            、{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;circle&quot;</code>
          </li>
          <li>
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;square&quot;</code>
            、{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;triangle&quot;</code>
            、{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;classic&quot;</code>
          </li>
        </ul>
        <CodeBlock label="shape.py">{`import turtle
t = turtle.Turtle()
t.shape("turtle")  # 改為海龜形狀
turtle.done()`}</CodeBlock>
      </section>

      <section id="write" className="mt-10 scroll-mt-24">
        <h2>
          <CodeName>write()</CodeName>
        </h2>
        <p>
          {tx("在畫布上寫字。常用寫法：", "Write text on the canvas. Common form:")}
        </p>
        <CodeBlock label="write_sig.py">{`t.write(arg, move=False, align="left", font=("Arial", 8, "normal"))`}</CodeBlock>
        <p>{tx("參數說明：", "Arguments:")}</p>
        <ul>
          <li>
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">arg</code>
            {tx("：要寫的文字", ": the text to write")}
          </li>
          <li>
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">move</code>
            {tx("：若為", ": if")}{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">True</code>
            {tx("，海龜會移到文字結尾", ", the turtle moves to the end of the text")}
          </li>
          <li>
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">align</code>
            ：{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;left&quot;</code>
            /{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;center&quot;</code>
            /{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;right&quot;</code>
          </li>
          <li>
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">font</code>
            ：
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">
              {tx("(字體名稱, 大小, 樣式)", "(font name, size, style)")}
            </code>
            {tx("，樣式可為", ". Style can be")}{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;normal&quot;</code>
            /{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;bold&quot;</code>
            /{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;italic&quot;</code>
          </li>
        </ul>
        <CodeBlock label="write.py">{`import turtle
t = turtle.Turtle()
t.write("Hello!", align="center", font=("Arial", 16, "bold"))
turtle.done()`}</CodeBlock>
      </section>

      <section id="stamp" className="mt-10 scroll-mt-24">
        <h2>
          <CodeName>stamp()</CodeName>
        </h2>
        <p>{tx("海龜蓋章：在當前位置複製目前的海龜形狀。", "Stamp: copy the turtle’s shape at the current place.")}</p>
        <CodeBlock label="stamp.py">{`import turtle
t = turtle.Turtle()
t.shape("turtle")
t.stamp()
t.forward(60)
t.stamp()
turtle.done()`}</CodeBlock>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter12_4"
            practiceLabel={ui.doneChapter("12.4")}
            subject="python"
          />
          <Link
            to="/python/quiz/12-4"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="12-4" />

          <Link
            to="/python/chapter-12"
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
