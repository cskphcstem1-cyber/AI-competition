import { useEffect, useMemo, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { getMathQuiz } from "../data/mathQuizzes";
import { MATH_LEVEL_COUNT } from "../data/mathLevels";
import { useAuth } from "../contexts/AuthContext";
import { useShop } from "../contexts/ShopContext";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { dateKey } from "../lib/practiceLog";
import PracticeReport from "../components/PracticeReport";
import { useLang } from "../contexts/LangContext";

const LETTERS = ["A", "B", "C", "D"];

export default function MathLevelQuiz() {
  const { lang, tx } = useLang();
  const { levelId } = useParams();
  const quiz = useMemo(() => getMathQuiz(levelId), [levelId]);
  const { user } = useAuth();
  const { awardTokens } = useShop();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [answers, setAnswers] = useState([]);
  const lockedRef = useRef(false);
  const timerRef = useRef(null);
  const answersRef = useRef([]);

  useEffect(() => {
    return () => {
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
    };
  }, []);

  if (!quiz) {
    return <Navigate to="/math" replace />;
  }

  const questions = quiz.questions;
  const total = questions.length;
  const current = questions[index];
  const progress = finished ? 100 : Math.min(100, (index / total) * 100);
  const levelNum = Number(levelId);
  const hasNext = levelNum < MATH_LEVEL_COUNT;

  const choose = (optionIndex) => {
    if (lockedRef.current || finished || !current) return;
    lockedRef.current = true;
    setSelected(optionIndex);
    setLocked(true);

    const correct = optionIndex === current.answer;
    const nextScore = score + (correct ? 1 : 0);
    if (correct) setScore(nextScore);
    void awardTokens(correct);
    const qText =
      lang === "en" && current.questionEn ? current.questionEn : current.question;
    const opts =
      (lang === "en" && current.optionsEn ? current.optionsEn : current.options) ||
      current.options ||
      [];
    const nextAnswers = [
      ...answersRef.current,
      {
        id: current.id,
        correct,
        question: qText,
        chosen: opts[optionIndex],
        expected: opts[current.answer],
      },
    ];
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);

    if (timerRef.current != null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const nextIndex = index + 1;
      if (nextIndex >= total) {
        setFinished(true);
        setLocked(false);
        lockedRef.current = false;
        if (user) {
          updateDoc(doc(db, "users", user.uid), {
            [`progress.mathLevel${levelId}Quiz`]: nextScore,
            [`progress.mathLevel${levelId}QuizTotal`]: total,
            [`practiceLog.${dateKey()}`]: arrayUnion({
              subject: "math",
              label: lang === "en"
                ? `Math quiz · ${quiz.titleEn || quiz.title}`
                : `數學測驗 · ${quiz.title}`,
              detail: lang === "en"
                ? `Level ${levelId} · report ${nextScore}/${total}`
                : `Level ${levelId} · 報告 ${nextScore}/${total}`,
              score: nextScore,
              total,
              at: Date.now(),
            }),
          })
            .then(() => setSaved(true))
            .catch(() => setSaved(false));
        }
      } else {
        setIndex(nextIndex);
        setSelected(null);
        setLocked(false);
        lockedRef.current = false;
      }
    }, 650);
  };

  const restart = () => {
    if (timerRef.current != null) window.clearTimeout(timerRef.current);
    lockedRef.current = false;
    answersRef.current = [];
    setIndex(0);
    setScore(0);
    setSelected(null);
    setLocked(false);
    setFinished(false);
    setSaved(false);
    setAnswers([]);
  };

  const optionClass = (i) => {
    const base =
      "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition";
    if (!locked || selected === null || !current) {
      return `${base} border-slate-200 bg-white hover:border-brand hover:bg-brand-soft`;
    }
    if (i === current.answer) return `${base} border-emerald-400 bg-emerald-50`;
    if (i === selected) return `${base} border-rose-300 bg-rose-50`;
    return `${base} border-slate-200 bg-white opacity-60`;
  };

  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-2xl font-bold text-white shadow-md">
              ?
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
                Math · Knowledge Check
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-ink">
                {tx("數學知識測驗", "Math knowledge quiz")}
              </h1>
              <p className="mt-1 text-sm text-muted">
                Level {levelId} · {lang === "en" ? quiz.titleEn || quiz.title : quiz.title}
              </p>
            </div>
          </div>
          <Link
            to={quiz.levelPath}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-brand"
          >
            {tx("返回關卡", "Back to level")}
          </Link>
        </header>

        <div className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-ink">
            <span>
              {finished
                ? tx(`完成 ${total} / ${total} 題`, `Finished ${total} / ${total}`)
                : tx(`第 ${Math.min(index + 1, total)} / ${total} 題`, `Question ${Math.min(index + 1, total)} / ${total}`)}
            </span>
            <span>{tx("得分：", "Score: ")}{score}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          {finished ? (
            <PracticeReport
              subject="math"
              title={lang === "en" ? `Math · ${quiz.titleEn || quiz.title}` : `數學 · ${quiz.title}`}
              subtitle={tx(`Level ${levelId} 知識測驗`, `Level ${levelId} knowledge quiz`)}
              score={score}
              total={total}
              answers={answers}
              saved={user ? saved : null}
            >
              <button
                type="button"
                onClick={restart}
                className="rounded-xl bg-brand px-6 py-3 font-bold text-white shadow-sm hover:bg-brand-dark"
              >
                {tx("再測一次", "Try again")}
              </button>
              <Link
                to={quiz.levelPath}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-ink shadow-sm hover:border-brand"
              >
                {tx("返回關卡", "Back to level")}
              </Link>
              {hasNext ? (
                <Link
                  to={`/math/level/${levelNum + 1}`}
                  className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white shadow-md hover:bg-emerald-600"
                >
                  {tx("下一章 →", "Next chapter →")}
                </Link>
              ) : (
                <Link
                  to="/math"
                  className="rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white shadow-md hover:bg-emerald-600"
                >
                  {tx("完成 · 回目錄 →", "Done · back to menu →")}
                </Link>
              )}
            </PracticeReport>
          ) : current ? (
            <>
              <h2 className="mb-6 text-xl font-bold leading-snug text-ink sm:text-2xl">
                {lang === "en" ? current.questionEn || current.question : current.question}
              </h2>
              <div className="space-y-3">
                {(lang === "en" ? current.optionsEn || current.options : current.options).map((option, i) => (
                  <button
                    key={`${current.id}-${i}`}
                    type="button"
                    disabled={locked}
                    onClick={() => choose(i)}
                    className={optionClass(i)}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-ink">
                      {LETTERS[i]}
                    </span>
                    <span className="font-semibold text-ink">{option}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-muted">{tx("題目載入異常，請重新開始測驗。", "Questions did not load. Please start again.")}</p>
              <button
                type="button"
                onClick={restart}
                className="rounded-xl bg-brand px-6 py-3 font-bold text-white shadow-sm hover:bg-brand-dark"
              >
                {tx("重新開始", "Start over")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
