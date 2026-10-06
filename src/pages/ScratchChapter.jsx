import { Link, Navigate, useParams } from "react-router-dom";
import ScratchIDE from "../components/ScratchIDE";
import {
  ScratchIdeProvider,
  useScratchIde,
} from "../contexts/ScratchIdeContext";
import {
  getScratchChapterById,
  SCRATCH_CHAPTERS,
} from "../data/scratchChapters";
import { useLang } from "../contexts/LangContext";

function pick(lang, zh, en) {
  return lang === "en" ? en ?? zh : zh;
}

function MobileScratchToggle() {
  const { setMobileOpen } = useScratchIde();
  const { tx } = useLang();
  return (
    <button
      type="button"
      onClick={() => setMobileOpen(true)}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-lab px-4 py-3 text-sm font-bold text-white shadow-lg ring-2 ring-shell-green/40 lg:hidden"
    >
      <span className="font-mono text-shell-green">scratch</span>
      {tx("開啟 IDE", "Open IDE")}
    </button>
  );
}

function ChapterBody({ chapter, prev, next }) {
  const { mobileOpen, setMobileOpen, expanded, setExpanded } = useScratchIde();
  const { lang, tx } = useLang();

  return (
    <div
      className={`blueprint-bg lesson-with-scratch-ide ${
        expanded ? "is-ide-expanded" : ""
      }`}
    >
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <header className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
            Module {chapter.id} · {chapter.level}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink">
            {lang === "en" ? chapter.titleEn : chapter.title}
          </h1>
          {lang !== "en" && (
            <p className="mt-1 font-mono text-sm text-muted">{chapter.titleEn}</p>
          )}
          <p className="mt-3 text-sm text-muted">
            {(pick(lang, chapter.categories, chapter.categoriesEn) || chapter.categories).join(" · ")}
          </p>
        </header>

        <div className="space-y-4">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-2 text-center text-lg font-bold text-ink">
              {tx("課程概要", "Overview")}
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              {pick(lang, chapter.overview, chapter.overviewEn)}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-3 text-center text-lg font-bold text-ink">
              {tx("核心概念", "Key ideas")}
            </h2>
            <ul className="space-y-2">
              {(pick(lang, chapter.concepts, chapter.conceptsEn) || chapter.concepts).map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-relaxed text-muted"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-3 text-center text-lg font-bold text-ink">
              {tx("關鍵積木", "Key blocks")}
            </h2>
            <ul className="space-y-2">
              {(pick(lang, chapter.blocks, chapter.blocksEn) || chapter.blocks).map((item) => (
                <li
                  key={item}
                  className="flex gap-2 font-mono text-sm leading-relaxed text-ink"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {chapter.starter && (
            <section className="rounded-2xl border border-sky-200/80 bg-sky-50/50 p-5 shadow-sm sm:p-6">
              <h2 className="mb-3 text-center text-lg font-bold text-ink">
                {pick(lang, chapter.starter.title, chapter.starter.titleEn)}
              </h2>
              <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
                {(pick(lang, chapter.starter.steps, chapter.starter.stepsEn) || chapter.starter.steps).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              {chapter.starter.blockGuide && (
                <ul className="space-y-2 border-t border-sky-100 pt-4">
                  {chapter.starter.blockGuide.map((item) => (
                    <li
                      key={item.name}
                      className="flex flex-col gap-0.5 text-sm sm:flex-row sm:gap-2"
                    >
                      <span className="shrink-0 rounded-md bg-sky-500 px-2 py-0.5 font-mono text-xs font-bold text-white">
                        {pick(lang, item.name, item.nameEn)}
                      </span>
                      <span className="text-muted">{pick(lang, item.tip, item.tipEn)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-2 text-center text-lg font-bold text-ink">
              {tx("動手專案", "Make a project")}
            </h2>
            <p className="text-center text-base font-semibold text-ink">
              {pick(lang, chapter.activity.name, chapter.activity.nameEn)}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {pick(lang, chapter.activity.detail, chapter.activity.detailEn)}
            </p>
            <p className="mt-3 text-center text-xs font-semibold text-brand">
              {tx(
                "按 IDE 上「放大工作區」才有空間拖積木 · 手機按「開啟 IDE」",
                "Tap “Bigger workspace” on the IDE to drag blocks · on a phone tap “Open IDE”",
              )}
            </p>
          </section>

          {chapter.flowchart && (
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-3 text-center text-lg font-bold text-ink">
                {tx("流程提示", "Flowchart tips")}
              </h2>
              <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
                {(pick(lang, chapter.flowchart, chapter.flowchartEn) || chapter.flowchart).map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          )}

          {chapter.compare && (
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="mb-3 text-center text-lg font-bold text-ink">
                {tx("模組化對照", "With vs without My Blocks")}
              </h2>
              <ul className="space-y-2">
                {(pick(lang, chapter.compare, chapter.compareEn) || chapter.compare).map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-3 text-center text-lg font-bold text-ink">
              {tx("學習成果", "What you will learn")}
            </h2>
            <ul className="space-y-2">
              {(pick(lang, chapter.outcomes, chapter.outcomesEn) || chapter.outcomes).map((item) => (
                <li
                  key={item}
                  className="flex gap-2 text-sm leading-relaxed text-muted"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            to={`/scratch/quiz/${chapter.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {tx("開始知識測驗", "Start quiz")}
          </Link>
          {next ? (
            <Link
              to={next.path}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-600"
            >
              {tx("下一章 →", "Next chapter →")}
            </Link>
          ) : (
            <Link
              to="/scratch/chapters"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-600"
            >
              {tx("完成 · 回目錄 →", "Done · back to menu →")}
            </Link>
          )}
          <Link
            to="/scratch/chapters"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-ink shadow-sm hover:border-brand"
          >
            {tx("模組目錄", "Module list")}
          </Link>
          {prev && (
            <Link
              to={prev.path}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-ink shadow-sm hover:border-brand"
            >
              {tx("← 上一章", "← Previous chapter")}
            </Link>
          )}
        </div>
      </div>

      <aside
        className={`scratch-ide-rail ${expanded ? "is-expanded" : ""}`}
        aria-label="Scratch IDE"
      >
        <ScratchIDE
          className="h-full min-h-0 flex-1"
          expanded={expanded}
          onToggleExpand={() => setExpanded((v) => !v)}
        />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-lab/50 p-3 backdrop-blur-sm lg:hidden">
          <ScratchIDE
            className="min-h-0 flex-1"
            expanded
            onClose={() => setMobileOpen(false)}
          />
        </div>
      )}

      <MobileScratchToggle />
    </div>
  );
}

export default function ScratchChapter() {
  const { chapterId } = useParams();
  const chapter = getScratchChapterById(chapterId);

  if (!chapter) {
    return <Navigate to="/scratch/chapters" replace />;
  }

  const prev = SCRATCH_CHAPTERS.find((ch) => ch.id === chapter.id - 1);
  const next = SCRATCH_CHAPTERS.find((ch) => ch.id === chapter.id + 1);

  return (
    <ScratchIdeProvider>
      <ChapterBody chapter={chapter} prev={prev} next={next} />
    </ScratchIdeProvider>
  );
}
