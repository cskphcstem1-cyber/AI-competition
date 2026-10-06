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
  { id: "color", label: "color()", labelEn: "color()" },
  { id: "pensize", label: "pensize()", labelEn: "pensize()" },
  {
    id: "penup",
    labels: ["penup()", "pendown()"],
    matchIds: ["penup", "pendown"],
  },
  { id: "clear", label: "clear()", labelEn: "clear()" },
  { id: "pencolor", label: "pencolor()", labelEn: "pencolor()" },
  { id: "fillcolor", label: "fillcolor()", labelEn: "fillcolor()" },
  {
    id: "begin-fill",
    labels: ["begin_fill()", "end_fill()"],
    matchIds: ["begin-fill", "end-fill"],
  },
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

export default function PythonChapter12_2() {
  return (
    <IdeProvider
      initialCode={`# 建議在 IDLE / 本機 Python 執行
import turtle
t = turtle.Turtle()
t.color("purple", "yellow")
t.pensize(3)
t.begin_fill()
t.circle(50)
t.end_fill()
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
  const ui = pythonChrome(tx, "12.2");
  const [active, setActive] = useState("color");

  useEffect(() => {
    const sectionIds = TOC.flatMap((item) => item.matchIds ?? [item.id]);
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
                {tx("第 12.2 章 · 畫筆與顏色", "Chapter 12.2 · Pen and color")}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {tx("設定顏色、筆觸粗細、提筆落筆、清除畫面與圖形填色", "Set color, pen size, pen up/down, clear, and fill")}
              </p>
          </div>
        </header>

        <div className="flex gap-4">
          <nav className="hidden w-full shrink-0 md:block md:w-52">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm backdrop-blur">
              <p className="mb-3 text-sm font-bold text-ink">{ui.chapterContents}</p>
              <ul className="space-y-1">
                {TOC.map((item, i) => {
                  const isActive = item.matchIds
                    ? item.matchIds.includes(active)
                    : active === item.id;
                  const lines = item.labels ?? [item.label];
                  return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className={`flex items-start gap-2 rounded-lg px-2.5 py-1.5 text-sm transition ${
                        isActive
                          ? "bg-brand-soft font-semibold text-brand-dark"
                          : "text-muted hover:bg-slate-50 hover:text-ink"
                      }`}
                    >
                      <span className="font-mono text-[10px] text-brand/60">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex flex-col gap-0.5 leading-tight">
                        {lines.map((line) => (
                          <TocFn key={line}>{line}</TocFn>
                        ))}
                      </span>
                    </a>
                  </li>
                  );
                })}
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
  const ui = pythonChrome(tx, "12.2");

  return (
    <article className="lesson-prose">
      <section id="color" className="scroll-mt-24">
        <h2>
          {tx("設定顏色 ·", "Set color ·")} <CodeName>color()</CodeName>
        </h2>
        <p>
          {tx("命令：", "Command:")} <InlineFn>t.color(pencolor, fillcolor=None)</InlineFn>
        </p>
        <ul>
          <li>
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">pencolor</code>
            {tx("（字符串）— 例如", " (a string) — for example")}{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;red&quot;</code>
            、{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;blue&quot;</code>
            {tx("或 RGB（例如", " or RGB (for example")}{" "}
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;#RRGGBB&quot;</code>
            ）。
          </li>
          <li>
            <code className="rounded bg-slate-100 px-1 font-mono text-sm">fillcolor</code>
            {tx("：填充顏色（可選）。", ": fill color (optional).")}
          </li>
        </ul>
        <CodeBlock label="color.py">{`import turtle
t = turtle.Turtle()
t.color("blue")            # 畫筆與填充皆為藍色
t.color("blue", "black")   # 畫筆藍色，填充黑色
t.forward(100)
turtle.done()`}</CodeBlock>
      </section>

      <section id="pensize" className="mt-10 scroll-mt-24">
        <h2>
          {tx("畫筆粗細 ·", "Pen size ·")} <CodeName>pensize()</CodeName>
        </h2>
        <p>
          {tx("命令：", "Command:")} <InlineFn>t.pensize(size)</InlineFn>
        </p>
        <ul>
          <li>
            {tx("參數：", "Argument:")} <code className="rounded bg-slate-100 px-1 font-mono text-sm">size</code>
            {tx("（數字）— 畫筆的粗細。", " (a number) — how thick the pen is.")}
          </li>
        </ul>
        <CodeBlock label="pensize.py">{`import turtle
t = turtle.Turtle()
t.pensize(15)  # 設定畫筆粗細為 15
t.forward(100)
turtle.done()`}</CodeBlock>
      </section>

      <section id="penup" className="mt-10 scroll-mt-24">
        <h2>
          {tx("提筆 ·", "Pen up ·")} <CodeName>penup()</CodeName>
        </h2>
        <p>
          {tx("命令：", "Command:")} <InlineFn>t.penup()</InlineFn>{tx("（移動但不畫線）", " (move without drawing)")}
        </p>
        <CodeBlock label="penup.py">{`import turtle
t = turtle.Turtle()
t.penup()       # 提筆，不繪圖
t.forward(100)  # 向前移動（不畫線）
turtle.done()`}</CodeBlock>
      </section>

      <section id="pendown" className="mt-10 scroll-mt-24">
        <h2>
          {tx("落筆 ·", "Pen down ·")} <CodeName>pendown()</CodeName>
        </h2>
        <p>
          {tx("命令：", "Command:")} <InlineFn>t.pendown()</InlineFn>{tx("（開始繪圖）", " (start drawing)")}
        </p>
        <CodeBlock label="pendown.py">{`import turtle
t = turtle.Turtle()
t.penup()
t.forward(100)
t.pendown()     # 落筆，開始繪圖
t.forward(50)
turtle.done()`}</CodeBlock>
      </section>

      <section id="clear" className="mt-10 scroll-mt-24">
        <h2>
          {tx("清除畫面 ·", "Clear the drawing ·")} <CodeName>clear()</CodeName>
        </h2>
        <p>
          <InlineFn>t.clear()</InlineFn>{" "}
          {tx("清除畫布上的所有圖形，但不移動海龜位置。", "erases the drawing, but the turtle stays where it is.")}
        </p>
        <CodeBlock label="clear.py">{`import turtle
t = turtle.Turtle()
t.forward(100)
t.clear()  # 清除畫布
turtle.done()`}</CodeBlock>
      </section>

      <section id="pencolor" className="mt-10 scroll-mt-24">
        <h2>
          {tx("畫筆顏色 ·", "Pen color ·")} <CodeName>pencolor()</CodeName>
        </h2>
        <p>
          {tx("只改變畫筆顏色。參數可以是字串（如", "Change only the pen color. Use a string (like")}{" "}
          <code className="rounded bg-slate-100 px-1 font-mono text-sm">&quot;red&quot;</code>
          {tx("）或 RGB 值。", ") or an RGB value.")}
        </p>
        <CodeBlock label="pencolor.py">{`import turtle
t = turtle.Turtle()
t.pencolor("blue")  # 設定畫筆顏色為藍色
t.forward(100)
turtle.done()`}</CodeBlock>
      </section>

      <section id="fillcolor" className="mt-10 scroll-mt-24">
        <h2>
          {tx("填充顏色 ·", "Fill color ·")} <CodeName>fillcolor()</CodeName>
        </h2>
        <p>{tx("單獨設定填充顏色。", "Set only the fill color.")}</p>
        <CodeBlock label="fillcolor.py">{`import turtle
t = turtle.Turtle()
t.fillcolor("green")  # 填充顏色為綠色
turtle.done()`}</CodeBlock>
      </section>

      <section id="begin-fill" className="mt-10 scroll-mt-24">
        <h2>
          {tx("開始填色 ·", "Start fill ·")} <CodeName>begin_fill()</CodeName>
        </h2>
        <p>
          {tx("命令：", "Command:")} <InlineFn>t.begin_fill()</InlineFn>{" "}
          {tx("標記填色開始；之後繪製的封閉圖形會在結束填色時被填充。", "marks the start. Shapes you draw after this get filled when you end fill.")}
        </p>
        <CodeBlock label="begin_fill.py">{`import turtle
t = turtle.Turtle()
t.color("purple", "yellow")
t.begin_fill()  # 開始填色
t.circle(50)
t.end_fill()
turtle.done()`}</CodeBlock>
      </section>

      <section id="end-fill" className="mt-10 scroll-mt-24">
        <h2>
          {tx("結束填色 ·", "End fill ·")} <CodeName>end_fill()</CodeName>
        </h2>
        <p>
          {tx("命令：", "Command:")} <InlineFn>t.end_fill()</InlineFn>{" "}
          {tx("結束填色，並填充", "ends fill and colors the area drawn after")}{" "}
          <InlineFn>begin_fill()</InlineFn> {tx("之後繪製的區域。", ".")}
        </p>
        <CodeBlock label="end_fill.py">{`import turtle
t = turtle.Turtle()
t.color("purple", "yellow")
t.begin_fill()
t.circle(50)    # 繪製一個圓
t.end_fill()    # 結束填色並填充
turtle.done()`}</CodeBlock>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter12_2"
            practiceLabel={ui.doneChapter("12.2")}
            subject="python"
          />
          <Link
            to="/python/quiz/12-2"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="12-2" />

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
