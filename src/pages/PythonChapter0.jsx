import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ChapterNextLink from "../components/ChapterNextLink";
import ChapterCompleteButton from "../components/ChapterCompleteButton";
import CodeBlock from "../components/CodeBlock";
import Tip from "../components/Tip";
import { useLang } from "../contexts/LangContext";

const PYTHON_DOWNLOADS = "https://www.python.org/downloads/";

const TOC_IDS = ["why", "download", "windows", "macos", "check"];

export default function PythonChapter0() {
  const { tx } = useLang();
  const [active, setActive] = useState("why");
  const toc = [
    { id: "why", label: tx("為什麼要安裝", "Why install") },
    { id: "download", label: tx("官方下載", "Official download") },
    { id: "windows", label: tx("Windows 安裝", "Windows install") },
    { id: "macos", label: tx("macOS 安裝", "macOS install") },
    { id: "check", label: tx("檢查安裝", "Check install") },
  ];

  useEffect(() => {
    const pickActive = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 120;
      if (nearBottom) {
        setActive(TOC_IDS[TOC_IDS.length - 1]);
        return;
      }

      let current = TOC_IDS[0];
      for (const id of TOC_IDS) {
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
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-3 py-4 lg:px-5 lg:py-5">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {tx("第 0 章 · 下載與安裝 Python", "Chapter 0 · Download and install Python")}
            </h1>
            <p className="mt-0.5 text-sm text-muted">
              {tx(
                "先從官方網站安裝 Python 3，再開始寫第一行程式",
                "Install Python 3 from the official site, then write your first program",
              )}
            </p>
          </div>
        </header>

        <div className="flex gap-4">
          <nav className="hidden w-full shrink-0 md:block md:w-44">
            <div className="sticky top-20 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm backdrop-blur">
              <p className="mb-3 text-sm font-bold text-ink">
                {tx("第 0 章 目錄", "Chapter 0 contents")}
              </p>
              <ul className="space-y-1">
                {toc.map((item, i) => (
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
                      {item.label}
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
    </div>
  );
}

function LessonContent() {
  const { tx } = useLang();
  return (
    <article className="lesson-prose">
      <section id="why" className="scroll-mt-24">
        <h2 className="!text-2xl">
          {tx("為什麼要先安裝 Python？", "Why install Python first?")}
        </h2>
        <p>
          {tx(
            "網站裡的練習可以先試跑程式，但要在自己的電腦寫 Python，需要先安裝官方的 Python 3。安裝完成後，就可以使用 IDLE 或命令列執行程式。",
            "You can try code on this website first. To write Python on your own computer, install official Python 3. Then you can run programs in IDLE or the command line.",
          )}
        </p>
        <div className="content-box">
          <h3 className="!mt-0 !mb-2 text-base font-bold text-ink">
            {tx("記住", "Remember")}
          </h3>
          <p className="!mb-0">
            {tx(
              "請下載 ",
              "Please download ",
            )}
            <strong>Python 3</strong>
            {tx(
              "，不要下載已經停止更新的 Python 2。",
              ". Do not download Python 2, which is no longer updated.",
            )}
          </p>
        </div>
      </section>

      <section id="download" className="mt-10 scroll-mt-24">
        <h2>{tx("到官方網站下載", "Download from the official site")}</h2>
        <p>
          {tx(
            "只從 Python 官方網站下載，避免來路不明的安裝檔。開啟這個連結：",
            "Only download from the official Python website. Avoid unknown installers. Open this link:",
          )}
        </p>
        <p>
          <a
            href={PYTHON_DOWNLOADS}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark"
          >
            {tx("前往 python.org/downloads", "Go to python.org/downloads")}
            <span aria-hidden="true">↗</span>
          </a>
        </p>
        <p className="break-all font-mono text-sm text-brand-dark">
          {PYTHON_DOWNLOADS}
        </p>
        <Tip label={tx("提示", "Tip")}>
          <p>
            {tx(
              "頁面會依照你的電腦顯示黃色下載按鈕。Windows 通常是「Download Python 3.x.x」，macOS 也會顯示對應的安裝檔。",
              'The page shows a yellow download button for your computer. On Windows it is often "Download Python 3.x.x". macOS shows its own installer.',
            )}
          </p>
        </Tip>
      </section>

      <section id="windows" className="mt-10 scroll-mt-24">
        <h2>{tx("Windows 安裝步驟", "Windows install steps")}</h2>
        <ol className="list-decimal space-y-2 pl-5 text-muted">
          <li>
            {tx(
              "開啟官方下載頁，按下黃色按鈕下載安裝檔。",
              "Open the official download page and click the yellow button.",
            )}
          </li>
          <li>
            {tx("雙擊安裝檔開始安裝。", "Double-click the installer to start.")}
          </li>
          <li>
            {tx("在第一個畫面勾選", "On the first screen, tick")}{" "}
            <strong className="text-ink">Add python.exe to PATH</strong>
            {tx(
              "（加入環境變數），再按 Install Now。",
              " (add to PATH), then click Install Now.",
            )}
          </li>
          <li>
            {tx(
              "等到顯示 Setup was successful，就可以關閉視窗。",
              'When you see "Setup was successful", you can close the window.',
            )}
          </li>
        </ol>
      </section>

      <section id="macos" className="mt-10 scroll-mt-24">
        <h2>{tx("macOS 安裝步驟", "macOS install steps")}</h2>
        <ol className="list-decimal space-y-2 pl-5 text-muted">
          <li>
            {tx(
              "在官方下載頁選擇 macOS 安裝檔並下載。",
              "On the official page, choose the macOS installer and download it.",
            )}
          </li>
          <li>
            {tx("開啟", "Open the")}{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
              .pkg
            </code>{" "}
            {tx("檔，依指示按繼續。", "file and click Continue as asked.")}
          </li>
          <li>
            {tx(
              "安裝完成後，可在「應用程式」找到 Python 資料夾與 IDLE。",
              'After install, look in Applications for the Python folder and IDLE.',
            )}
          </li>
        </ol>
      </section>

      <section id="check" className="mt-10 scroll-mt-24">
        <h2>{tx("怎樣知道安裝成功？", "How do you know it worked?")}</h2>
        <Tip label={tx("提示", "Tip")}>
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
        <p>
          {tx("如果看到類似", "If you see a version like")}{" "}
          <strong className="text-ink">Python 3.14.7</strong>
          {tx(
            " 的版本號，就表示安裝成功。有些 Windows 電腦要用 ",
            ". Install worked. Some Windows computers need ",
          )}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm">
            py -V
          </code>
          {tx("。", ".")}
        </p>
      </section>

      <footer className="mt-10 border-t border-slate-100 pt-6 pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <ChapterCompleteButton
            progressField="progress.pythonChapter0"
            practiceLabel={tx("完成 · Python 第0章", "Done · Python Chapter 0")}
            subject="python"
          />
          <ChapterNextLink chapterId="0" />
          <Link
            to="/python/chapters"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-ink shadow-sm transition hover:border-brand hover:text-brand-dark"
          >
            {tx("回章節目錄", "Back to chapter list")}
          </Link>
        </div>
      </footer>
    </article>
  );
}
