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
  { id: "intro", label: "import turtle", labelEn: "import turtle" },
  { id: "forward", label: "forward()", labelEn: "forward()" },
  { id: "backward", label: "backward()", labelEn: "backward()" },
  { id: "left", label: "left()", labelEn: "left()" },
  { id: "right", label: "right()", labelEn: "right()" },
  { id: "circle", label: "circle()", labelEn: "circle()" },
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

export default function PythonChapter12_1() {
  const { tx } = useLang();
  return (
    <IdeProvider
      initialCode={`# ${tx("建議在 IDLE / 本機 Python 執行 turtle", "Try this in IDLE or local Python (turtle)")}
import turtle
t = turtle.Turtle()
t.forward(100)
t.left(90)
t.forward(100)
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
  const ui = pythonChrome(tx, "12.1");
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
                {tx("第 12.1 章 · 導入與基本運動", "Chapter 12.1 · Import and move")}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {tx("模組導入、前進後退、左右旋轉與繪製圓形", "Import the module, move, turn, and draw a circle")}
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
  const ui = pythonChrome(tx, "12.1");

  return (
    <article className="lesson-prose">
      <section id="intro" className="scroll-mt-24">
        <h2 className="!text-2xl">{tx("導入 Turtle 模組並創建海龜實例", "Import Turtle and make a turtle")}</h2>
        <p>
          {tx(
            "Turtle（海龜繪圖）是 Python 內建的繪圖模組，用「海龜」在畫布上移動來畫線。請先導入模組並建立一隻海龜：",
            "Turtle is a Python drawing tool. A “turtle” moves on the canvas and draws lines. First import the module and make a turtle:",
          )}
        </p>
        <CodeBlock label="import_turtle.py">{`import turtle as t`}</CodeBlock>
        <p>{tx("也可以分開寫成：", "You can also write it like this:")}</p>
        <CodeBlock label="turtle_instance.py">{`import turtle
t = turtle.Turtle()`}</CodeBlock>
        <Tip label={ui.tip}>
          <p>
            {tx("瀏覽器內建 IDE 通常", "The in-browser IDE usually")}
            <strong className="text-ink">{tx("無法", " cannot")}</strong>
            {tx("開出 Turtle 視窗。本章範例請複製到", " open a Turtle window. Copy these samples into")}{" "}
            <strong className="text-ink">IDLE</strong>
            {tx("或本機 Python 執行；最後記得加", " or local Python. At the end, add")}{" "}
            <InlineFn>turtle.done()</InlineFn>{" "}
            {tx("讓視窗保持開啟。", " so the window stays open.")}
          </p>
        </Tip>
      </section>

      <section id="forward" className="mt-10 scroll-mt-24">
        <h2>
          {tx("向前移動 ·", "Move forward ·")} <CodeName>forward()</CodeName> /{" "}
          <CodeName>fd()</CodeName>
        </h2>
        <p>
          {tx("命令：", "Command:")} <InlineFn>t.forward(distance)</InlineFn> {tx("或", "or")}{" "}
          <InlineFn>t.fd(distance)</InlineFn>
        </p>
        <ul>
          <li>
            {tx("參數：", "Argument:")} <code className="rounded bg-slate-100 px-1 font-mono text-sm">distance</code>
            {tx("（數字）— 要向前移動的距離。", " (a number) — how far to go forward.")}
          </li>
        </ul>
        <CodeBlock label="forward.py">{`import turtle
t = turtle.Turtle()
t.forward(100)  # ${tx("向前移動 100 單位", "move forward 100")}
turtle.done()`}</CodeBlock>
      </section>

      <section id="backward" className="mt-10 scroll-mt-24">
        <h2>
          {tx("向後移動 ·", "Move back ·")} <CodeName>backward()</CodeName> /{" "}
          <CodeName>bk()</CodeName>
        </h2>
        <p>
          {tx("命令：", "Command:")} <InlineFn>t.backward(distance)</InlineFn> {tx("或", "or")}{" "}
          <InlineFn>t.bk(distance)</InlineFn>
        </p>
        <ul>
          <li>
            {tx("參數：", "Argument:")} <code className="rounded bg-slate-100 px-1 font-mono text-sm">distance</code>
            {tx("（數字）— 要向後移動的距離。", " (a number) — how far to go back.")}
          </li>
        </ul>
        <CodeBlock label="backward.py">{`import turtle
t = turtle.Turtle()
t.backward(50)  # ${tx("向後移動 50 單位", "move back 50")}
turtle.done()`}</CodeBlock>
      </section>

      <section id="left" className="mt-10 scroll-mt-24">
        <h2>
          {tx("左轉 ·", "Turn left ·")} <CodeName>left()</CodeName>
        </h2>
        <p>
          {tx("命令：", "Command:")} <InlineFn>t.left(angle)</InlineFn>
        </p>
        <ul>
          <li>
            {tx("參數：", "Argument:")} <code className="rounded bg-slate-100 px-1 font-mono text-sm">angle</code>
            {tx("（數字）— 要左轉的角度（以度為單位）。", " (a number) — how many degrees to turn left.")}
          </li>
        </ul>
        <CodeBlock label="left.py">{`import turtle
t = turtle.Turtle()
t.left(90)  # ${tx("左轉 90 度", "turn left 90 degrees")}
turtle.done()`}</CodeBlock>
      </section>

      <section id="right" className="mt-10 scroll-mt-24">
        <h2>
          {tx("右轉 ·", "Turn right ·")} <CodeName>right()</CodeName>
        </h2>
        <p>
          {tx("命令：", "Command:")} <InlineFn>t.right(angle)</InlineFn>
        </p>
        <ul>
          <li>
            {tx("參數：", "Argument:")} <code className="rounded bg-slate-100 px-1 font-mono text-sm">angle</code>
            {tx("（數字）— 要右轉的角度（以度為單位）。", " (a number) — how many degrees to turn right.")}
          </li>
        </ul>
        <CodeBlock label="right.py">{`import turtle
t = turtle.Turtle()
t.right(45)  # ${tx("右轉 45 度", "turn right 45 degrees")}
turtle.done()`}</CodeBlock>
      </section>

      <section id="circle" className="mt-10 scroll-mt-24">
        <h2>
          {tx("繪製圓形 ·", "Draw a circle ·")} <CodeName>circle()</CodeName>
        </h2>
        <p>
          <InlineFn>t.circle(radius, extent=None, steps=None)</InlineFn>{" "}
          {tx("用來畫圓或圓弧。", "draws a circle or an arc.")}
        </p>
        <ul>
          <li>
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">radius</code>
            {tx("：圓的半徑（正值為逆時針，負值為順時針，依方向而定）。", ": the radius (plus goes one way, minus goes the other).")}
          </li>
          <li>
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">extent</code>
            {tx("（可選）：圓弧角度（預設 360°，即完整圓）。", " (optional): arc size in degrees (default 360, a full circle).")}
          </li>
          <li>
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">steps</code>
            {tx("（可選）：用幾邊形近似圓。", " (optional): draw the circle as a many-sided shape.")}
          </li>
        </ul>
        <CodeBlock label="circle.py">{`import turtle
t = turtle.Turtle()
t.circle(50)        # ${tx("畫半徑為 50 的圓", "draw a circle with radius 50")}
t.circle(100, 180)  # ${tx("畫半徑為 100 的半圓", "draw a semicircle with radius 100")}
turtle.done()`}</CodeBlock>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter12_1"
            practiceLabel={ui.doneChapter("12.1")}
            subject="python"
          />
          <Link
            to="/python/quiz/12-1"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="12-1" />

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
