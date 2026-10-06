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
  { id: "intro", label: "編程簡介", labelEn: "What is coding" },
  { id: "features", label: "Python 特點", labelEn: "Python features" },
  { id: "versions", label: "Python 版本", labelEn: "Python versions" },
  { id: "interactive", label: "交互模式", labelEn: "Interactive mode" },
  { id: "env", label: "編程環境", labelEn: "Coding tools" },
  { id: "idle", label: "IDLE 環境", labelEn: "IDLE" },
  { id: "ipo", label: "輸入處理輸出", labelEn: "Input process output" },
  { id: "output", label: "輸出指令", labelEn: "Print output" },
  { id: "format", label: "簡單格式", labelEn: "Simple format" },
  { id: "encoding", label: "編碼聲明", labelEn: "Encoding" },
];

function Practice({ children }) {
  const { tx } = useLang();
  return (
    <div className="practice-box">
      <p className="practice-box-label mb-1 text-sm font-bold text-sky-800">
        {tx("練習", "Practice")}
      </p>
      <div className="practice-box-body text-sm font-medium text-sky-900/80">
        {children}
      </div>
    </div>
  );
}

function Pill({ children }) {
  return <span className="pill-tag">{children}</span>;
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

export default function PythonChapter1() {
  return (
    <IdeProvider>
      <ChapterLayout />
    </IdeProvider>
  );
}

function ChapterLayout() {
  const { mobileOpen, setMobileOpen } = useIde();
  const { tx } = useLang();
  const ui = pythonChrome(tx, 1);
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
        const top = el.getBoundingClientRect().top;
        if (top <= window.innerHeight * 0.35) {
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
              {tx(
                "第 1 章 · 編程入門與 Python 基礎",
                "Chapter 1 · Intro to coding and Python basics",
              )}
            </h1>
            <p className="mt-0.5 text-sm text-muted">
              {tx(
                "認識編程與 Python · 科學思維 × 運算邏輯",
                "Learn coding and Python · science thinking × computer logic",
              )}
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
  const ui = pythonChrome(tx, 1);

  return (
    <article className="lesson-prose">
      <section id="intro" className="scroll-mt-24">
        <h2 className="!text-2xl">{tx("簡單介紹編程", "A simple intro to coding")}</h2>
        <p>
          {tx(
            "編程（或程式設計）是創建計算機軟件、應用程序和系統的過程。通過編寫程式碼，開發者能夠指示計算機如何執行特定的任務和操作。以下是編程的基本概念和過程的簡單講解：",
            "Coding is how we make computer software, apps, and systems. By writing code, we tell the computer what to do. Here are the basic ideas:",
          )}
        </p>

        <div className="mt-5 space-y-4">
          <div className="content-box">
            <h3 className="!mt-0 !mb-2 text-base font-bold text-ink">
              {tx("1. 什麼是編程？", "1. What is coding?")}
            </h3>
            <p className="!mb-0">
              {tx(
                "編程是使用一種或多種編程語言來創建一組指令，這些指令能夠告訴計算機如何執行任務。這些任務可以簡單如計算數字，也可以複雜如運行一個網站或遊戲。",
                "Coding uses a programming language to write instructions for the computer. The job can be simple, like adding numbers, or bigger, like running a website or a game.",
              )}
            </p>
          </div>

          <div className="content-box">
            <h3 className="!mt-0 !mb-2 text-base font-bold text-ink">
              {tx("2. 編程語言", "2. Programming languages")}
            </h3>
            <p className="!mb-3">
              {tx(
                "編程語言是用來編寫程式碼的工具，不同的語言適用於不同的任務和應用程序。常見的編程語言包括：",
                "A programming language is the tool we use to write code. Different languages fit different jobs. Common languages include:",
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {["Python", "JavaScript", "Java", "C++", "Ruby"].map((langName) => (
                <Pill key={langName}>{langName}</Pill>
              ))}
            </div>
          </div>

          <div className="content-box">
            <h3 className="!mt-0 !mb-2 text-base font-bold text-ink">
              {tx("3. 編程的應用", "3. What coding is used for")}
            </h3>
            <p className="!mb-3">
              {tx("編程應用於各個領域，包括但不限於：", "Coding is used in many areas, such as:")}
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                [tx("網頁開發", "Websites")],
                [tx("軟件開發", "Software")],
                [tx("數據分析", "Data analysis")],
                [tx("人工智慧", "AI")],
                [tx("機器學習", "Machine learning")],
                [tx("遊戲開發", "Games")],
                [tx("嵌入式系統", "Tiny computers in devices")],
              ].map(([item]) => (
                <Pill key={item}>{item}</Pill>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mt-10 scroll-mt-24">
        <h2>{tx("Python 語言特點", "Python language features")}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            {
              title: tx("易讀易寫", "Easy to read and write"),
              desc: tx(
                "Python 語法簡潔明瞭，類似於自然語言，容易學習和使用。",
                "Python syntax is short and clear, a bit like everyday language, so it is easier to learn.",
              ),
            },
            {
              title: tx("跨平台", "Works on many computers"),
              desc: tx(
                "Python 可以在多種操作系統上運行，包括 Windows、macOS 和 Linux。",
                "Python can run on many systems, including Windows, macOS, and Linux.",
              ),
            },
            {
              title: tx("廣泛的應用範圍", "Used in many jobs"),
              desc: tx(
                "適用於網頁開發、數據分析、人工智慧、機器學習、科學計算等。",
                "Use it for websites, data, AI, machine learning, and science math.",
              ),
            },
            {
              title: tx("龐大的標準庫", "A big standard library"),
              desc: tx(
                "附帶豐富的標準庫，涵蓋網路協定、操作系統接口、字串操作等。",
                "It comes with many built-in tools for the internet, files, and text.",
              ),
            },
          ].map((f) => (
            <div key={f.title} className="content-box">
              <h3 className="!mt-0 !mb-1 text-base font-bold text-brand-dark">
                {f.title}
              </h3>
              <p className="!mb-0 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="versions" className="mt-10 scroll-mt-24">
        <h2>{tx("了解 Python 的版本號", "Python version numbers")}</h2>
        <p>
          {tx(
            "Python 的版本號主要分為兩個大的系列：Python 2.x 和 Python 3.x。Python 2.x 系列已經停止更新。Python 3.x 系列是當前和未來的開發重點。",
            "Python has two big version families: Python 2.x and Python 3.x. Python 2.x is no longer updated. Python 3.x is the one we use now and in the future.",
          )}
        </p>
        <div className="my-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="!mt-0 text-base font-bold text-slate-500">
              Python 2.x
            </h3>
            <p className="mb-1 text-sm font-bold text-coral">
              {tx("已停止更新", "No longer updated")}
            </p>
            <p className="!mb-0 text-sm whitespace-nowrap">
              {tx(
                "最新版本：Python 2.7.x（2020-01-01 停止支持）",
                "Latest: Python 2.7.x (support ended 2020-01-01)",
              )}
            </p>
          </div>
          <div className="rounded-2xl border border-brand/20 bg-brand-soft p-4">
            <h3 className="!mt-0 text-base font-bold text-brand-dark">
              Python 3.x
            </h3>
            <p className="mb-1 text-sm font-bold text-brand">
              {tx("現行標準", "Current standard")}
            </p>
            <p className="!mb-0 text-sm whitespace-nowrap">
              {tx(
                "最新版本：Python 3.14.7（2026-08-05 發佈）",
                "Latest: Python 3.14.7 (released 2026-08-05)",
              )}
            </p>
          </div>
        </div>
        <Tip label={ui.tip}>
          <p className="mb-2">
            {tx(
              "在命令窗口 (cmd) 查看 Python 版本：",
              "In Command Prompt (cmd), check the Python version:",
            )}
          </p>
          <CodeBlock label="Command Prompt" language="bash">{`C:\\Users\\Student>
python -V
Python 3.14.7`}</CodeBlock>
        </Tip>
      </section>

      <section id="interactive" className="mt-10 scroll-mt-24">
        <h2>{tx("交互模式", "Interactive mode")}</h2>
        <p>
          {tx(
            "在命令窗口使用以下命令進入交互模式：",
            "In the command window, use this to enter interactive mode:",
          )}
        </p>
        <CodeBlock
          label="Python Interactive Shell"
          language="python"
        >{`>>> print("Hello")
Hello
>>> 2 + 3
5`}</CodeBlock>
        <h3>{tx("IDLE 的交互模式", "IDLE interactive mode")}</h3>
        <CodeBlock label="IDLE Shell 3.14.7" language="python">{`>>> print("Hello World!")
Hello World!`}</CodeBlock>
      </section>

      <section id="env" className="mt-10 scroll-mt-24">
        <h2>{tx("編程環境", "Coding tools")}</h2>
        <p>
          {tx(
            "IDE 代表整合開發環境（Integrated Development Environment）。它為開發者提供編寫、測試和除錯程式碼的綜合工具。",
            "IDE means Integrated Development Environment. It is a toolkit for writing, testing, and fixing code.",
          )}
        </p>
        <Tip label={ui.tip}>
          <p>
            {tx(
              "Python 常見環境：IDLE、Visual Studio Code、Jupyter Notebook",
              "Common Python tools: IDLE, Visual Studio Code, Jupyter Notebook",
            )}
          </p>
        </Tip>
        <div className="my-4 grid gap-3 sm:grid-cols-3">
          {[
            {
              name: "IDLE",
              desc: tx("Python 官方附帶，適合初學者", "Comes with Python. Good for beginners."),
            },
            {
              name: "VS Code",
              desc: tx("功能強大，插件豐富", "Powerful, with many add-ons"),
            },
            {
              name: "Jupyter",
              desc: tx("適合數據分析與教學", "Good for data and teaching"),
            },
          ].map((env) => (
            <div key={env.name} className="content-box text-center">
              <h3 className="!mt-0 !mb-1 font-bold text-ink">{env.name}</h3>
              <p className="!mb-0 text-sm">{env.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="idle" className="mt-10 scroll-mt-24">
        <h2>{tx("了解 Python 自帶的編程環境 IDLE", "IDLE, the tool that comes with Python")}</h2>
        <h3>{tx("1. 什麼是 IDLE？", "1. What is IDLE?")}</h3>
        <p>
          {tx(
            "IDLE（Integrated Development and Learning Environment）是 Python 官方提供的開發環境，隨安裝包一起分發，適合初學者編寫與運行程式。",
            "IDLE (Integrated Development and Learning Environment) is the official Python tool. It is installed with Python and is good for beginners.",
          )}
        </p>
        <h3>
          {tx(
            "2. 啟動 IDLE — 新建文件、保存文件",
            "2. Start IDLE — new file and save",
          )}
        </h3>
        <div className="my-4 overflow-hidden rounded-xl border border-slate-200">
          <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-muted">
            {["File", "Edit", "Format", "Run", "Options", "Window", "Help"].map(
              (m) => (
                <span key={m} className="rounded px-2 py-1">
                  {m}
                </span>
              ),
            )}
          </div>
          <CodeBlock label="untitled.py" embedded>
            {`print("Hello World!")`}
          </CodeBlock>
        </div>
      </section>

      <section id="ipo" className="mt-10 scroll-mt-24">
        <h2>{tx("理解輸入、處理、輸出", "Input, process, output")}</h2>
        <div className="my-4 grid gap-3 sm:grid-cols-3">
          {[
            {
              n: "1",
              title: tx("輸入 Input", "1. Input"),
              desc: tx(
                "從鍵盤、文件、網路等獲取數據。",
                "Get data from the keyboard, a file, or the internet.",
              ),
            },
            {
              n: "2",
              title: tx("處理 Process", "2. Process"),
              desc: tx(
                "對數據進行計算、邏輯運算或變換。",
                "Do math, logic, or change the data.",
              ),
            },
            {
              n: "3",
              title: tx("輸出 Output", "3. Output"),
              desc: tx(
                "把結果顯示在螢幕或寫入文件。",
                "Show the result on the screen or save it to a file.",
              ),
            },
          ].map((step) => (
            <div key={step.n} className="content-box">
              <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                {step.n}
              </span>
              <h3 className="!mt-0 !mb-1 text-base font-bold">{step.title}</h3>
              <p className="!mb-0 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="output" className="mt-10 scroll-mt-24">
        <h2>{tx("輸出指令（Output）", "Output with print")}</h2>
        <h3>{tx("第一個 Python 程式", "Your first Python program")}</h3>
        <CodeBlock label="hello.py">{`print("Hello World!")`}</CodeBlock>
        <Practice>
          <p className="mb-2">
            {tx(
              "嘗試輸出自己的名字、班級、學號：",
              "Try printing your name, class, and student number:",
            )}
          </p>
          <CodeBlock label="my_info.py">{`print("Eric")
print("F2A")
print("1")`}</CodeBlock>
        </Practice>
      </section>

      <section id="format" className="mt-10 scroll-mt-24">
        <h2>{tx("簡單格式", "Simple format")}</h2>
        <p>{tx("按照每行順序執行。", "Python runs the lines from top to bottom.")}</p>
        <p>
          <strong className="text-ink">
            {tx("縮進（Indentation）：", "Indentation: ")}
          </strong>
          {tx(
            "在 if、for、while 或函數定義等語句後，接下來的代碼需要縮進來表示這些語句的主體。",
            "After if, for, while, or a function, the next lines must be indented to show they belong together.",
          )}
        </p>
        <h3>{tx("縮進示例", "Indentation example")}</h3>
        <CodeBlock label="score.py">{`score = 85

if score >= 60:
    print("及格")
else:
    print("不及格")`}</CodeBlock>
        <p className="text-sm text-muted">
          {tx(
            "上面程式裡的「及格／不及格」是給同學看的輸出文字，不是 Python 指令。",
            'In the sample, the words "及格 / 不及格" are output text for students, not Python commands.',
          )}
        </p>
      </section>

      <section id="encoding" className="mt-10 scroll-mt-24">
        <h2>{tx("解釋器、編碼格式聲明", "The interpreter and encoding")}</h2>
        <p>
          {tx(
            "Python 解釋器負責逐行讀取並執行程式碼。在 Python 3 中，原始碼預設使用 UTF-8 編碼；若需聲明其他編碼，可在文件第一行加入：",
            "The Python interpreter reads and runs code line by line. In Python 3, files use UTF-8 by default. To set another encoding, put this on the first line:",
          )}
        </p>
        <CodeBlock label="encoding.py">{`# -*- coding: utf-8 -*-`}</CodeBlock>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter1"
            practiceLabel={ui.doneChapter(1)}
            subject="python"
          />
          <Link
            to="/python/quiz/1"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {ui.quiz}
          </Link>
          <ChapterNextLink chapterId="1" />
        </div>
      </footer>
    </article>
  );
}
