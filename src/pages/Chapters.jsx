import { Link } from "react-router-dom";
import { CHAPTERS } from "../data/chapters";
import { useLang } from "../contexts/LangContext";
import { CHAPTER_EN } from "../i18n/ui";

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

const CODE_CALLS = new Set([
  "input()",
  "print()",
  "int()",
  "str()",
  "float()",
  "eval()",
  "bool()",
]);
const CODE_CALL_SPLIT_RE =
  /(input\(\)|print\(\)|int\(\)|str\(\)|float\(\)|eval\(\)|bool\(\)|\(turtle\))/g;
const LEADING_PUNCT_RE = /^[、，。！？；：,.!?;:）\])\}]+/;

function withCodeCalls(text) {
  const parts = String(text).split(CODE_CALL_SPLIT_RE);
  const nodes = [];

  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
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
    } else if (part === "(turtle)") {
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
        <span key={i} className="whitespace-nowrap font-mono font-semibold tracking-normal">
          (turtle)
          {punct}
        </span>,
      );
    } else {
      nodes.push(<span key={i}>{part}</span>);
    }
  }

  return nodes;
}

export default function Chapters() {
  const { lang, t } = useLang();
  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
                Programming Guide
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                {t.pythonCatalog.title}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {t.pythonCatalog.sub}
              </p>
          </div>
        </header>

        <section className="mb-5">
          <h2 className="text-xl font-bold text-ink">{t.pythonCatalog.heading}</h2>
          <p className="mt-1 text-sm text-muted">
            {t.pythonCatalog.hint}
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CHAPTERS.map((ch) => (
            <article
              key={ch.id}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <p className="mb-1 text-sm font-semibold text-brand">
                {t.pythonCatalog.chapter(ch.id)}
              </p>
              <h3 className="mb-2 text-lg font-bold text-ink [line-break:strict]">
                {withCodeCalls(
                  lang === "en" && CHAPTER_EN[ch.id]
                    ? CHAPTER_EN[ch.id].title
                    : ch.title,
                )}
              </h3>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-muted [line-break:strict]">
                {withCodeCalls(
                  lang === "en" && CHAPTER_EN[ch.id]
                    ? CHAPTER_EN[ch.id].description
                    : ch.description,
                )}
              </p>
              {ch.available && ch.path ? (
                <Link
                  to={ch.path}
                  className="inline-flex w-fit items-center rounded-full bg-brand px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark"
                >
                  {ch.sections ? t.pythonCatalog.sections : t.pythonCatalog.start}
                </Link>
              ) : (
                <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-muted">
                  {t.pythonCatalog.soon}
                </span>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
