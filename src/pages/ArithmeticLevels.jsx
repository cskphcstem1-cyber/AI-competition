import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { MATH_LEVEL_COUNT, MATH_LEVELS } from "../data/mathLevels";
import { MATH_LEVEL_KEY } from "../data/arithmeticQuiz";
import { useLang } from "../contexts/LangContext";
import { MATH_LEVEL_EN } from "../i18n/ui";

export default function ArithmeticLevels() {
  const { lang, t } = useLang();
  const [savedLevel, setSavedLevel] = useState(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(MATH_LEVEL_KEY);
      const n = Number(raw);
      if (Number.isInteger(n) && n >= 1 && n <= MATH_LEVEL_COUNT) {
        setSavedLevel(n);
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Mathematics · Arithmetic
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              {t.arithmetic.title}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {t.arithmetic.sub(MATH_LEVEL_COUNT)}
            </p>
          </div>
          <Link
            to="/math"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-brand"
          >
            {t.math.back}
          </Link>
        </header>

        <article className="mb-4 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
              Pre-test
            </p>
            <h2 className="text-xl font-bold text-ink">{t.arithmetic.pretestTitle}</h2>
            <p className="mt-1 text-sm text-muted">
              {savedLevel
                ? t.arithmetic.pretestSaved(savedLevel)
                : t.arithmetic.pretestNew}
            </p>
          </div>
          <Link
            to="/math/arithmetic"
            className="group inline-flex w-fit shrink-0 items-center gap-2 rounded-xl bg-lab px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-ink"
          >
            <span className="font-mono text-shell-green">test</span>
            {savedLevel ? t.arithmetic.retest : t.arithmetic.startTest}
            <span className="transition group-hover:translate-x-0.5">→</span>
          </Link>
        </article>

        <section className="mb-5">
          <h2 className="text-xl font-bold text-ink">{t.arithmetic.levels}</h2>
          <p className="mt-1 text-sm text-muted">
            {t.arithmetic.levelsHint}
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MATH_LEVELS.map((item) => {
            const isCurrent = savedLevel === item.level;
            return (
              <article
                key={item.level}
                className={`flex flex-col rounded-2xl border bg-white p-5 shadow-sm ${
                  isCurrent
                    ? "border-brand/50 ring-1 ring-brand/20"
                    : "border-slate-200/80"
                }`}
              >
                <p className="mb-1 text-sm font-semibold text-brand">
                  Level {item.level}
                  {isCurrent ? t.arithmetic.yourLevel : ""}
                </p>
                <h3 className="mb-2 text-lg font-bold text-ink">
                  {lang === "en" && MATH_LEVEL_EN[item.level]
                    ? MATH_LEVEL_EN[item.level].title
                    : item.title}
                </h3>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-muted">
                  {lang === "en" && MATH_LEVEL_EN[item.level]
                    ? MATH_LEVEL_EN[item.level].overview
                    : item.overview}
                </p>
                <Link
                  to={`/math/level/${item.level}`}
                  className="inline-flex w-fit items-center rounded-full bg-brand px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark"
                >
                  {t.arithmetic.start}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
