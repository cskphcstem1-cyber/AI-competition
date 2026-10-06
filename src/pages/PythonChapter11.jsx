import { Link } from "react-router-dom";
import ChapterNextLink from "../components/ChapterNextLink";
import { CHAPTERS } from "../data/chapters";
import { useLang } from "../contexts/LangContext";
import { CHAPTER_EN } from "../i18n/ui";
import { pythonChrome } from "../i18n/pythonChrome";

function CodeCall({ name }) {
  return (
    <span className="font-mono text-[0.95em] font-semibold tracking-normal">
      {name}
      <span className="inline-block translate-y-px font-normal tracking-[0.12em]">
        ()
      </span>
    </span>
  );
}

const CODE_CALLS = new Set(["input()", "print()", "bool()"]);
const CODE_CALL_SPLIT_RE = /(input\(\)|print\(\)|bool\(\))/g;
const LEADING_PUNCT_RE = /^[、，。！？；：,.!?;:）\])\}]+/;

function withCodeCalls(text) {
  const parts = String(text).split(CODE_CALL_SPLIT_RE);
  const nodes = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part) continue;

    if (CODE_CALLS.has(part)) {
      let punct = "";
      const next = parts[i + 1];
      if (typeof next === "string") {
        const m = next.match(LEADING_PUNCT_RE);
        if (m) {
          punct = m[0];
          parts[i + 1] = next.slice(punct.length);
        }
      }
      nodes.push(
        <span key={i} className="whitespace-nowrap">
          <CodeCall name={part.slice(0, -2)} />
          {punct}
        </span>,
      );
    } else {
      nodes.push(<span key={i}>{part}</span>);
    }
  }

  return nodes;
}

export default function PythonChapter11() {
  const { lang, tx } = useLang();
  const ui = pythonChrome(tx, 11);
  const chapter = CHAPTERS.find((ch) => ch.id === 11);
  const sections = chapter?.sections ?? [];
  const title =
    lang === "en" && CHAPTER_EN[11] ? CHAPTER_EN[11].title : chapter?.title;

  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand">{ui.chapterN}</p>
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {tx("選擇一個小節開始學習", "Pick a section to start learning")}
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
                {withCodeCalls(tx(sec.description, sec.descriptionEn || sec.description))}
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
            to="/python/quiz/11"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {tx("第 11 章知識測驗", "Chapter 11 knowledge quiz")}
          </Link>
          <ChapterNextLink chapterId="11" />

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
