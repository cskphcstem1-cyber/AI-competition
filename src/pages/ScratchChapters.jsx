import { Link } from "react-router-dom";
import { SCRATCH_CHAPTERS } from "../data/scratchChapters";
import { useLang } from "../contexts/LangContext";

export default function ScratchChapters() {
  const { lang, t } = useLang();
  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Scratch Curriculum
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {t.scratchCatalog.title}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {t.scratchCatalog.sub}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://turbowarp.org/editor"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-lab px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-ink"
            >
              <span className="font-mono text-shell-green">scratch</span>{" "}
              {t.scratchCatalog.ide}
            </a>
            <Link
              to="/technology"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-brand"
            >
              {t.scratchCatalog.back}
            </Link>
          </div>
        </header>

        <section className="mb-5">
          <h2 className="text-xl font-bold text-ink">{t.scratchCatalog.heading}</h2>
          <p className="mt-1 text-sm text-muted">
            {t.scratchCatalog.hint}
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SCRATCH_CHAPTERS.map((ch) => (
            <article
              key={ch.id}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-brand">
                  Module {ch.id}
                </p>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted">
                  {ch.level}
                </span>
              </div>
              <h3 className="mb-1 text-lg font-bold text-ink">
                {lang === "en" ? ch.titleEn : ch.title}
              </h3>
              {lang === "zh" && (
              <p className="mb-1 font-mono text-[11px] text-muted">
                {ch.titleEn}
              </p>
              )}
              <p className="mb-3 flex-1 text-sm leading-relaxed text-muted">
                {lang === "en" ? ch.descriptionEn || ch.description : ch.description}
              </p>
              <p className="mb-4 text-xs text-muted">
                {ch.categories.join(" · ")}
              </p>
              {ch.available && ch.path ? (
                <Link
                  to={ch.path}
                  className="inline-flex w-fit items-center rounded-full bg-brand px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark"
                >
                  {t.scratchCatalog.start}
                </Link>
              ) : (
                <span className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-muted">
                  {t.scratchCatalog.soon}
                </span>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
