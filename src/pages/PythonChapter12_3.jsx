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
  { id: "hide", label: "hideturtle()", labelEn: "hideturtle()" },
  { id: "show", label: "showturtle()", labelEn: "showturtle()" },
  { id: "speed", label: "speed()", labelEn: "speed()" },
  { id: "goto", label: "goto()", labelEn: "goto()" },
  { id: "heading", label: "setheading()", labelEn: "setheading()" },
  { id: "dot", label: "dot()", labelEn: "dot()" },
  { id: "home", label: "home()", labelEn: "home()" },
  { id: "reset", label: "reset()", labelEn: "reset()" },
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

export default function PythonChapter12_3() {
  return (
    <IdeProvider
      initialCode={`# 建議在 IDLE / 本機 Python 執行
import turtle
t = turtle.Turtle()
t.speed(0)
t.hideturtle()
t.goto(100, 100)
t.dot(40, "red")
t.home()
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
  const ui = pythonChrome(tx, "12.3");
  const [active, setActive] = useState("hide");

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
                {tx("第 12.3 章 · 海龜控制", "Chapter 12.3 · Control the turtle")}
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {tx("顯示隱藏、繪圖速度、座標移動、方向設定、圓點、歸位與重置", "Show, hide, speed, move to a point, heading, dots, home, and reset")}
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
  const ui = pythonChrome(tx, "12.3");

  return (
    <article className="lesson-prose">
      <section id="hide" className="scroll-mt-24">
        <h2>
          <CodeName>hideturtle()</CodeName>
        </h2>
        <p>{tx("隱藏烏龜圖示，只保留繪製的線條。", "Hide the turtle picture. You still see the lines it drew.")}</p>
        <CodeBlock label="hideturtle.py">{`import turtle
t = turtle.Turtle()
t.hideturtle()
t.forward(100)
turtle.done()`}</CodeBlock>
      </section>

      <section id="show" className="mt-10 scroll-mt-24">
        <h2>
          <CodeName>showturtle()</CodeName>
        </h2>
        <p>{tx("顯示海龜（若已隱藏）。", "Show the turtle again if it was hidden.")}</p>
        <CodeBlock label="showturtle.py">{`import turtle
t = turtle.Turtle()
t.hideturtle()
t.showturtle()
turtle.done()`}</CodeBlock>
      </section>

      <section id="speed" className="mt-10 scroll-mt-24">
        <h2>
          <CodeName>speed()</CodeName>
        </h2>
        <p>
          {tx("設置繪圖速度，數值範圍 0–10；", "Set drawing speed from 0 to 10. ")}
          <strong className="text-ink">0</strong>{" "}
          {tx("是最快。", "is the fastest.")}
        </p>
        <CodeBlock label="speed.py">{`import turtle
t = turtle.Turtle()
t.speed(5)  # 中等速度
t.speed(0)  # 最快
t.forward(100)
turtle.done()`}</CodeBlock>
      </section>

      <section id="goto" className="mt-10 scroll-mt-24">
        <h2>
          <CodeName>goto()</CodeName>
        </h2>
        <p>
          {tx("將海龜移動到座標", "Move the turtle to point")} <code className="rounded bg-slate-100 px-1 font-mono text-sm">(x, y)</code>
          {tx("。若畫筆落下會畫出直線。", ". If the pen is down, it draws a line.")}
        </p>
        <CodeBlock label="goto.py">{`import turtle
t = turtle.Turtle()
t.goto(100, 100)  # 移動到座標 (100, 100)
turtle.done()`}</CodeBlock>
      </section>

      <section id="heading" className="mt-10 scroll-mt-24">
        <h2>
          <CodeName>setheading()</CodeName>
        </h2>
        <p>
          {tx(
            "設置海龜朝向（單位：度）。0° 向右、90° 向上、180° 向左、270° 向下。",
            "Set which way the turtle faces (degrees). 0° right, 90° up, 180° left, 270° down.",
          )}
        </p>
        <CodeBlock label="setheading.py">{`import turtle
t = turtle.Turtle()
t.setheading(45)  # 45 度角
t.forward(100)
turtle.done()`}</CodeBlock>
      </section>

      <section id="dot" className="mt-10 scroll-mt-24">
        <h2>
          <CodeName>dot()</CodeName>
        </h2>
        <p>
          <InlineFn>t.dot(diameter, color)</InlineFn>{" "}
          {tx("在當前位置畫一個指定直徑的圓點。", "draws a colored dot at the turtle’s place.")}
        </p>
        <CodeBlock label="dot.py">{`import turtle
t = turtle.Turtle()
t.dot(40, "red")  # 直徑 40 的紅色圓點
turtle.done()`}</CodeBlock>
      </section>

      <section id="home" className="mt-10 scroll-mt-24">
        <h2>
          <CodeName>home()</CodeName>
        </h2>
        <p>
          {tx("將海龜移回原點 (0, 0)，並將方向設為 0°。", "Move the turtle back to (0, 0) and face 0°.")}
        </p>
        <CodeBlock label="home.py">{`import turtle
t = turtle.Turtle()
t.goto(80, 50)
t.home()
turtle.done()`}</CodeBlock>
      </section>

      <section id="reset" className="mt-10 scroll-mt-24">
        <h2>
          <CodeName>reset()</CodeName>
        </h2>
        <p>{tx("重置海龜與畫布（清除圖形並回到初始狀態）。", "Reset the turtle and canvas (clear the drawing and start over).")}</p>
        <CodeBlock label="reset.py">{`import turtle
t = turtle.Turtle()
t.forward(100)
t.reset()
turtle.done()`}</CodeBlock>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter12_3"
            practiceLabel={ui.doneChapter("12.3")}
            subject="python"
          />
          <Link
            to="/python/quiz/12-3"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="12-3" />

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
