import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getMathTopic, MATH_LEVEL_COUNT } from "../data/mathLevels";
import Tip from "../components/Tip";
import { useLang } from "../contexts/LangContext";

function pick(lang, zh, en) {
  return lang === "en" ? en ?? zh : zh;
}

export default function MathTopic() {
  const { lang, tx } = useLang();
  const { levelId, topicId } = useParams();
  const data = getMathTopic(levelId, topicId);
  const [active, setActive] = useState("intro");

  const lessons = data?.topic?.lessons ?? [];
  const toc = [
    { id: "goals", label: tx("學習目標", "Learning goals") },
    ...lessons.map((l) => ({
      id: l.id,
      label: pick(lang, l.title, l.titleEn),
    })),
  ];

  useEffect(() => {
    if (!data) return;
    const ids = toc.map((t) => t.id);
    const pick = () => {
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.35) {
          current = id;
        }
      }
      setActive(current);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [data, topicId, levelId]);

  if (!data) {
    return <Navigate to="/math" replace />;
  }

  const { level, topic, prevTopic, nextTopic } = data;

  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-3 py-4 lg:px-5 lg:py-5">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${level.color} font-mono text-xl font-bold text-white shadow-md`}
            >
              {level.level}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
                {pick(lang, level.title, level.titleEn)}
              </p>
              <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {pick(lang, topic.name, topic.nameEn)}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {pick(lang, topic.summary, topic.summaryEn)}
              </p>
            </div>
          </div>
          <Link
            to={`/math/level/${level.level}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-brand"
          >
            {tx("← 本關目錄", "← Level menu")}
          </Link>
        </header>

        <div className="flex gap-4">
          <nav className="hidden w-44 shrink-0 md:block">
            <div className="sticky top-20 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm backdrop-blur">
              <p className="mb-3 text-sm font-bold text-ink">{tx("本單元目錄", "This lesson")}</p>
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
                      <span className="truncate">{item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <main className="min-w-0 flex-1">
            <article className="rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-sm backdrop-blur sm:p-7">
              <section id="goals" className="scroll-mt-24">
                <h2 className="mb-3 text-xl font-bold text-ink sm:text-2xl">
                  {tx("學習目標", "Learning goals")}
                </h2>
                <ul className="space-y-2">
                  {(pick(lang, topic.points, topic.pointsEn) || topic.points).map((point) => (
                    <li
                      key={point}
                      className="flex gap-2 text-sm leading-relaxed text-muted"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {lessons.map((lesson) => (
                <section
                  key={lesson.id}
                  id={lesson.id}
                  className="mt-10 scroll-mt-24 border-t border-slate-100 pt-8"
                >
                  <h2 className="mb-3 text-xl font-bold text-ink sm:text-2xl">
                    {pick(lang, lesson.title, lesson.titleEn)}
                  </h2>
                  {(pick(lang, lesson.paragraphs, lesson.paragraphsEn) || lesson.paragraphs)?.map((p) => (
                    <p
                      key={p}
                      className="mb-3 text-sm leading-relaxed text-muted sm:text-base"
                    >
                      {p}
                    </p>
                  ))}
                  {lesson.tip && (
                    <div className="my-4">
                      <Tip centerLabel label={tx("提示", "Tip")}>
                        {pick(lang, lesson.tip, lesson.tipEn)}
                      </Tip>
                    </div>
                  )}
                  {lesson.example && (
                    <div className="my-4 rounded-xl border border-sky-200 bg-sky-50/80 p-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-sky-700">
                        {tx("例題", "Example")}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-ink">
                        {pick(lang, lesson.example.q, lesson.example.qEn)}
                      </p>
                      <p className="mt-2 text-sm text-sky-900">
                        <span className="font-bold">{tx("解答：", "Answer: ")}</span>
                        {pick(lang, lesson.example.a, lesson.example.aEn)}
                      </p>
                    </div>
                  )}
                </section>
              ))}

              <footer className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:flex-wrap">
                <Link
                  to={`/math/quiz/${level.level}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-5 py-3 text-sm font-bold text-white shadow-md shadow-sky-500/20 hover:brightness-105"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
                    ?
                  </span>
                  {tx("本關知識測驗", "Level quiz")}
                </Link>
                {prevTopic && (
                  <Link
                    to={`/math/level/${level.level}/topic/${prevTopic.id}`}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-ink shadow-sm hover:border-brand"
                  >
                    ← {pick(lang, prevTopic.name, prevTopic.nameEn)}
                  </Link>
                )}
                {nextTopic ? (
                  <Link
                    to={`/math/level/${level.level}/topic/${nextTopic.id}`}
                    className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-600"
                  >
                    {tx("下一單元 →", "Next topic →")}
                  </Link>
                ) : level.level < MATH_LEVEL_COUNT ? (
                  <Link
                    to={`/math/level/${level.level + 1}`}
                    className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-600"
                  >
                    {tx(`下一關 Level ${level.level + 1} →`, `Next · Level ${level.level + 1} →`)}
                  </Link>
                ) : (
                  <Link
                    to="/math"
                    className="rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-600"
                  >
                    {tx("完成 · 回數學目錄 →", "Done · back to math →")}
                  </Link>
                )}
                <Link
                  to={`/math/level/${level.level}`}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-ink shadow-sm hover:border-brand"
                >
                  {tx("本關所有單元", "All topics in this level")}
                </Link>
              </footer>
            </article>
            <div className="h-24" aria-hidden="true" />
          </main>
        </div>
      </div>
    </div>
  );
}
