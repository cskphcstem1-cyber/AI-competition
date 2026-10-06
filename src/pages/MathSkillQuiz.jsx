import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  getMathSkillQuiz,
  isSkillAnswerCorrect,
} from "../data/mathSkillQuizzes";
import { useAuth } from "../contexts/AuthContext";
import { useShop } from "../contexts/ShopContext";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";
import { dateKey } from "../lib/practiceLog";
import PracticeReport from "../components/PracticeReport";
import { useLang } from "../contexts/LangContext";

const TIME_LIMIT = 20;
const LETTERS = ["A", "B", "C", "D"];

export default function MathSkillQuiz() {
  const { topicId } = useParams();
  const { lang, tx } = useLang();
  const [quiz, setQuiz] = useState(() => getMathSkillQuiz(topicId));
  const { user } = useAuth();
  const { awardTokens } = useShop();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [typed, setTyped] = useState("");
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [saved, setSaved] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const lockedRef = useRef(false);
  const timerRef = useRef(null);
  const answersRef = useRef([]);
  const scoreRef = useRef(0);
  const inputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    setQuiz(getMathSkillQuiz(topicId));
    lockedRef.current = false;
    answersRef.current = [];
    scoreRef.current = 0;
    setIndex(0);
    setScore(0);
    setSelected(null);
    setTyped("");
    setLocked(false);
    setFinished(false);
    setSaved(false);
    setAnswers([]);
    setTimeLeft(TIME_LIMIT);
  }, [topicId]);

  const questions = quiz?.questions ?? [];
  const total = questions.length;
  const current = questions[index];
  const progress = finished ? 100 : Math.min(100, (index / Math.max(total, 1)) * 100);
  const title = quiz
    ? lang === "en"
      ? quiz.titleEn
      : quiz.title
    : "";

  useEffect(() => {
    if (!quiz || finished || locked) return;
    setTimeLeft(TIME_LIMIT);
    const id = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [index, finished, locked, quiz]);

  useEffect(() => {
    if (!quiz || finished || locked || timeLeft > 0) return;
    if (current?.kind === "fill") {
      lockAndAdvance(isSkillAnswerCorrect(typed, current.answer));
    } else {
      lockAndAdvance(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, finished, locked, quiz]);

  useEffect(() => {
    if (!quiz || finished || locked || current?.kind !== "fill") return;
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [index, locked, finished, current?.kind, quiz]);

  if (!quiz) {
    return <Navigate to="/math" replace />;
  }

  const finishQuiz = (nextScore, nextAnswers) => {
    setFinished(true);
    setLocked(false);
    lockedRef.current = false;
    if (user) {
      updateDoc(doc(db, "users", user.uid), {
        [`progress.mathSkill${topicId}`]: nextScore,
        [`progress.mathSkill${topicId}Total`]: total,
        [`practiceLog.${dateKey()}`]: arrayUnion({
          subject: "math",
          label: lang === "en" ? `Math · ${quiz.labelEn}` : `數學 · ${quiz.label}`,
          detail: lang === "en"
            ? `Practice · report ${nextScore}/${total}`
            : `練習 · 報告 ${nextScore}/${total}`,
          score: nextScore,
          total,
          at: Date.now(),
        }),
      })
        .then(() => setSaved(true))
        .catch(() => setSaved(false));
    }
  };

  const goNext = (nextScore, nextAnswers) => {
    const nextIndex = index + 1;
    if (nextIndex >= total) {
      finishQuiz(nextScore, nextAnswers);
      return;
    }
    setIndex(nextIndex);
    setSelected(null);
    setTyped("");
    setLocked(false);
    lockedRef.current = false;
    setTimeLeft(TIME_LIMIT);
  };

  const record = (correct) => {
    const nextScore = scoreRef.current + (correct ? 1 : 0);
    if (correct) setScore(nextScore);
    scoreRef.current = nextScore;
    void awardTokens(correct);
    const nextAnswers = [...answersRef.current, { id: current.id, correct }];
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);
    return { nextScore, nextAnswers };
  };

  const lockAndAdvance = (correct) => {
    if (lockedRef.current || finished || !current) return;
    lockedRef.current = true;
    setLocked(true);
    const { nextScore, nextAnswers } = record(correct);
    if (timerRef.current != null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      goNext(nextScore, nextAnswers);
    }, correct ? 450 : 900);
  };

  const choose = (optionIndex) => {
    if (current?.kind !== "choice") return;
    lockAndAdvance(optionIndex === current.answer);
    setSelected(optionIndex);
  };

  const submitFill = (event) => {
    event.preventDefault();
    if (current?.kind !== "fill" || lockedRef.current) return;
    lockAndAdvance(isSkillAnswerCorrect(typed, current.answer));
  };

  const restart = () => {
    if (timerRef.current != null) window.clearTimeout(timerRef.current);
    lockedRef.current = false;
    answersRef.current = [];
    scoreRef.current = 0;
    setQuiz(getMathSkillQuiz(topicId));
    setIndex(0);
    setScore(0);
    setSelected(null);
    setTyped("");
    setLocked(false);
    setFinished(false);
    setSaved(false);
    setAnswers([]);
    setTimeLeft(TIME_LIMIT);
  };

  const optionClass = (i) => {
    const base =
      "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition";
    if (!locked || selected === null) {
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
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Mathematics · Practice
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>
            <p className="mt-1 text-sm text-muted">
              {tx(
                `共 ${total} 題 · 每題 ${TIME_LIMIT} 秒 · 答題可賺代幣`,
                `${total} questions · ${TIME_LIMIT}s each · answers earn tokens`,
              )}
            </p>
          </div>
          <Link
            to={quiz.chapterPath}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-brand"
          >
            {tx("返回課文", "Back to lesson")}
          </Link>
        </header>

        <div className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-ink">
            <span>
              {finished
                ? tx(`完成 ${total} / ${total} 題`, `Finished ${total} / ${total}`)
                : tx(`第 ${Math.min(index + 1, total)} / ${total} 題`, `Question ${Math.min(index + 1, total)} / ${total}`)}
            </span>
            <span className="flex items-center gap-3">
              {!finished && (
                <span className={`font-mono ${timeLeft <= 5 ? "text-rose-600" : "text-brand"}`}>
                  {timeLeft}s
                </span>
              )}
              <span>{tx("答對：", "Correct: ")}{score}</span>
            </span>
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
              title={title}
              subtitle={tx("練習報告", "Practice report")}
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
                {tx("再練一次", "Try again")}
              </button>
              <Link
                to={quiz.chapterPath}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-ink shadow-sm hover:border-brand"
              >
                {tx("返回課文", "Back to lesson")}
              </Link>
              <Link
                to="/math"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-ink shadow-sm hover:border-brand"
              >
                {tx("數學目錄", "Math menu")}
              </Link>
            </PracticeReport>
          ) : current ? (
            <>
              <p className="mb-2 text-xs font-bold tracking-wider text-muted">
                {lang === "en" ? current.hintEn || current.hint : current.hint}
              </p>
              <h2 className="mb-6 font-mono text-2xl font-bold leading-snug text-ink sm:text-3xl">
                {lang === "en" ? current.promptEn || current.prompt : current.prompt}
              </h2>
              {current.kind === "choice" ? (
                <div className="space-y-3">
                  {(lang === "en" ? current.optionsEn || current.options : current.options).map(
                    (option, i) => (
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
                        <span className="font-mono text-lg font-bold text-ink">{option}</span>
                      </button>
                    ),
                  )}
                </div>
              ) : (
                <form onSubmit={submitFill}>
                  <input
                    ref={inputRef}
                    type="text"
                    autoComplete="off"
                    readOnly={locked}
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    placeholder={tx("輸入答案", "Type the answer")}
                    className={`w-full rounded-2xl border px-4 py-3.5 font-mono text-2xl font-bold text-ink outline-none ${
                      locked
                        ? isSkillAnswerCorrect(typed, current.answer)
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-rose-300 bg-rose-50"
                        : "border-slate-200 bg-white focus:border-brand focus:ring-2 focus:ring-brand/20"
                    }`}
                  />
                  {locked && !isSkillAnswerCorrect(typed, current.answer) && (
                    <p className="mt-2 text-sm font-semibold text-rose-600">
                      {tx("正確答案：", "Correct answer: ")}
                      {current.answer}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={locked}
                    className="mt-5 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark disabled:opacity-60"
                  >
                    {tx("提交", "Submit")}
                  </button>
                </form>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
