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
  { id: "intro", label: "input() 簡介", labelEn: "input() intro", mono: "input()" },
  { id: "prompt", label: "提示文字", labelEn: "Prompt text" },
  { id: "store-print", label: "存入變量並輸出", labelEn: "Save and print" },
  { id: "multi-input", label: "連續輸入", labelEn: "Ask more than once" },
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

function InlineFn({ children, size = "sm" }) {
  const text = String(children).trim();
  const match = text.match(/^(.*?)(\(\))$/);
  const sizeClass = size === "xs" ? "text-xs px-1" : "text-sm px-1.5 py-0.5";
  if (!match) {
    return (
      <code
        className={`rounded bg-slate-100 font-mono ${sizeClass}`}
      >
        {children}
      </code>
    );
  }
  return (
    <code
      className={`rounded bg-slate-100 font-mono font-semibold ${sizeClass}`}
    >
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

export default function PythonChapter7() {
  return (
    <IdeProvider
      initialCode={`name = input("What is your name? ")
print("Hello,", name)
`}
    >
      <ChapterLayout />
    </IdeProvider>
  );
}

function ChapterLayout() {
  const { mobileOpen, setMobileOpen } = useIde();
  const { tx } = useLang();
  const ui = pythonChrome(tx, 7);
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
                {tx("第 7 章 · 輸入指令", "Chapter 7 · Input")} <CodeName>input()</CodeName>
              </h1>
              <p className="mt-0.5 text-sm text-muted">
                {tx("從鍵盤讀取文字、存入變量", "Read text from the keyboard and save it")}
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
  const ui = pythonChrome(tx, 7);

  return (
    <article className="lesson-prose">
      <section id="intro" className="scroll-mt-24">
        <h2 className="!text-2xl">
          <CodeName>input()</CodeName> {tx("簡介", "intro")}
        </h2>
        <p>
          <InlineFn>input()</InlineFn>{" "}
          {tx(
            "讓程式停下來，等使用者從鍵盤輸入一行文字。按下 Enter 之後，程式才繼續。",
            "pauses the program and waits for you to type a line. After you press Enter, the program goes on.",
          )}
        </p>
        <p>
          {tx("讀到的內容要存進變量，之後才能再用。右邊的 IDE 執行到", "Save what you typed in a variable so you can use it later. When the IDE on the right reaches")}{" "}
          <InlineFn>input()</InlineFn> {tx("時，會在下方出現輸入框。", ", a box appears at the bottom.")}
        </p>
        <CodeBlock label="input_basic.py">{`name = input()
print(name)`}</CodeBlock>
      </section>

      <section id="prompt" className="mt-10 scroll-mt-24">
        <h2>{tx("提示文字", "Prompt text")}</h2>
        <p>
          {tx(
            "括號裡可以放一段提示，告訴使用者要輸入什麼。提示是字符串，要用引號包起來。",
            "Inside the brackets you can put a question, so the user knows what to type. The prompt is a string, so use quotes.",
          )}
        </p>
        <CodeBlock label="input_prompt.py">{`name = input("What is your name? ")
print(name)`}</CodeBlock>
        <Tip label={ui.tip}>
          <p>{tx("提示後面留一個空格，使用者輸入的字就不會黏在問句後面。", "Put a space after the question so the answer is not stuck to the words.")}</p>
        </Tip>
      </section>

      <section id="store-print" className="mt-10 scroll-mt-24">
        <h2>{tx("存入變量並輸出", "Save and print")}</h2>
        <p>
          <InlineFn>input()</InlineFn>{" "}
          {tx("讀到的是使用者輸入的文字。先存進變量，再用", "gives you the text the user typed. Save it, then")}{" "}
          <InlineFn>print()</InlineFn> {tx("輸出。", "print it.")}
        </p>
        <CodeBlock label="store_print.py">{`city = input("Which city do you live in? ")
print("You live in", city)`}</CodeBlock>
        <Tip label={ui.tip}>
          <p>
            {tx(
              "本章只學習讀取文字和輸出。輸入的內容先照原樣使用，暫時不用改成其他類型。",
              "This chapter only reads text and prints it. Use the input as it is. Do not change the type yet.",
            )}
          </p>
        </Tip>
      </section>

      <section id="multi-input" className="mt-10 scroll-mt-24">
        <h2>{tx("連續輸入", "Ask more than once")}</h2>
        <p>
          {tx("可以連續使用多次", "You can use")} <InlineFn>input()</InlineFn>
          {tx("，每次問一件事，各自存進不同變量。", " more than once. Ask one thing each time, and save each answer in its own variable.")}
        </p>
        <CodeBlock label="multi_input.py">{`first_name = input("First name: ")
last_name = input("Last name: ")
print("Hello,", first_name, last_name)`}</CodeBlock>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter7"
            practiceLabel={ui.doneChapter(7)}
            subject="python"
          />
          <Link
            to="/python/quiz/7"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="7" />

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
