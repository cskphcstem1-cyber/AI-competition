import { Link } from "react-router-dom";
import ChapterNextLink from "../components/ChapterNextLink";
import { CHAPTERS } from "../data/chapters";
import { useLang } from "../contexts/LangContext";
import { CHAPTER_EN } from "../i18n/ui";
import { pythonChrome } from "../i18n/pythonChrome";

export default function PythonChapter12() {
  const { lang, tx } = useLang();
  const ui = pythonChrome(tx, 12);
  const chapter = CHAPTERS.find((ch) => ch.id === 12);
  const sections = chapter?.sections ?? [];
  const title =
    lang === "en" && CHAPTER_EN[12] ? CHAPTER_EN[12].title : chapter?.title;

  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand">{ui.chapterN}</p>
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {title}{" "}
              <span className="font-mono font-semibold tracking-normal">
                (turtle)
              </span>
            </h1>
            <p className="mt-1 text-sm text-muted">
              {tx(
                "選擇一個小節開始學習（建議在 IDLE 本機執行）",
                "Pick a section to start (try it in IDLE on your computer)",
              )}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sections.map((sec) => (
            <article
              key={sec.id}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-brand/40 hover:shadow-md"
            >
              <p className="mb-1 text-sm font-semibold text-brand">
                {tx(`第 ${sec.id} 章`, `Section ${sec.id}`)}
              </p>
              <h2 className="mb-2 text-lg font-bold text-ink [line-break:strict]">
                {tx(sec.title, sec.titleEn || sec.title)}
              </h2>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted [line-break:strict]">
                {tx(sec.description, sec.descriptionEn || sec.description)}
              </p>
              <Link
                to={sec.path}
                className="inline-flex w-fit items-center rounded-full bg-brand px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark"
              >
                {tx("開始學習", "Start learning")}
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/python/quiz/12"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {tx("第 12 章知識測驗", "Chapter 12 knowledge quiz")}
          </Link>
          <ChapterNextLink chapterId="12" />

          <Link
            to="/python/chapters"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-ink shadow-sm hover:border-brand"
          >
            {ui.backCatalog}
          </Link>
        </div>
      </div>
    </div>
  );
}
