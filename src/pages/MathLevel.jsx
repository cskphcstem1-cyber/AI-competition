import { Link, Navigate, useParams } from "react-router-dom";
import { getMathLevelById } from "../data/mathLevels";
import { useLang } from "../contexts/LangContext";

function pick(lang, zh, en) {
  return lang === "en" ? en ?? zh : zh;
}

export default function MathLevel() {
  const { lang, tx } = useLang();
  const { levelId } = useParams();
  const level = getMathLevelById(levelId);

  if (!level) {
    return <Navigate to="/math" replace />;
  }

  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <header className="mb-6 flex items-center gap-3">
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${level.color} font-mono text-2xl font-bold text-white shadow-md`}
          >
            {level.level}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Level {level.level}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-ink">
              {pick(lang, level.title, level.titleEn)}
            </h1>
            {level.overview && (
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                {pick(lang, level.overview, level.overviewEn)}
              </p>
            )}
          </div>
        </header>

        <p className="mb-4 text-sm font-semibold text-muted">
          {tx(
            "點選下方單元卡片進入詳細教學（與 Python 章節頁相同風格）",
            "Tap a topic card to open the lesson (same style as Python chapters).",
          )}
        </p>

        <div className="space-y-4">
          {level.topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/math/level/${level.level}/topic/${topic.id}`}
              className="block rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-brand/50 hover:shadow-md sm:p-6"
            >
              <h2 className="mb-2 text-center text-lg font-bold text-ink">
                {pick(lang, topic.name, topic.nameEn)}
              </h2>
              {topic.summary && (
                <p className="mb-3 text-center text-sm text-muted">
                  {pick(lang, topic.summary, topic.summaryEn)}
                </p>
              )}
              <ul className="space-y-2">
                {(pick(lang, topic.points, topic.pointsEn) || topic.points).slice(0, 4).map((point) => (
                  <li
                    key={point}
                    className="flex gap-2 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    <span>{point}</span>
                  </li>
                ))}
                {topic.points.length > 4 && (
                  <li className="text-center text-xs font-bold text-brand">
                    {tx(
                      `還有 ${topic.points.length - 4} 項 · 點擊查看完整內容 →`,
                      `${topic.points.length - 4} more · tap to see all →`,
                    )}
                  </li>
                )}
              </ul>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            to={`/math/quiz/${level.level}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 px-6 py-3 font-bold text-white shadow-md shadow-sky-500/20 transition hover:brightness-105"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-sm">
              ?
            </span>
            {tx("開始知識測驗", "Start quiz")}
          </Link>
          {level.level < 7 ? (
            <Link
              to={`/math/level/${level.level + 1}`}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white shadow-md hover:bg-emerald-600"
            >
              {tx("下一章 →", "Next chapter →")}
            </Link>
          ) : (
            <Link
              to="/math"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white shadow-md hover:bg-emerald-600"
            >
              {tx("完成 · 回目錄 →", "Done · back to menu →")}
            </Link>
          )}
          <Link
            to="/math"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-ink shadow-sm hover:border-brand"
          >
            {tx("← 數學目錄", "← Math menu")}
          </Link>
          {level.level > 1 && (
            <Link
              to={`/math/level/${level.level - 1}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-ink shadow-sm hover:border-brand"
            >
              ← Level {level.level - 1}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
