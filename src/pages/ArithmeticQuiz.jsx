import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../contexts/ShopContext";
import PracticeReport from "../components/PracticeReport";
import { useLang } from "../contexts/LangContext";
import {
  formatQuizAnswer,
  generateArithmeticPretest,
  getMathLevelFromResults,
  isCorrectAnswer,
  MATH_LEVEL_KEY,
  TIME_LIMIT_MULTI_SEC,
  TIME_LIMIT_SEC,
} from "../data/arithmeticQuiz";

function blankCountIn(prompt) {
  return (String(prompt ?? "").match(/\?/g) || []).length;
}

function timeLimitFor(question) {
  if (Array.isArray(question?.answer) && question.answer.length > 1) {
    return TIME_LIMIT_MULTI_SEC;
  }
  return blankCountIn(question?.prompt) > 1
    ? TIME_LIMIT_MULTI_SEC
    : TIME_LIMIT_SEC;
}

function formatTimer(seconds) {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
  return `${seconds}s`;
}

function StackedFraction({ num, den, size = "md" }) {
  const scale = size === "lg" ? "text-[0.65em]" : "text-[0.55em]";
  return (
    <span
      className={`mx-0.5 inline-flex flex-col items-center align-middle leading-none ${scale}`}
    >
      <span className="px-1">{num}</span>
      <span className="my-0.5 w-full border-t-2 border-current" />
      <span className="px-1">{den}</span>
    </span>
  );
}

/** Visual 帶分數: whole number + stacked fraction (e.g. 3 ¾). */
function MixedNumber({ whole, num, den, size = "lg" }) {
  return (
    <span className="inline-flex items-center font-mono text-2xl font-bold tracking-tight text-ink sm:text-3xl">
      <span>{whole}</span>
      <StackedFraction num={num} den={den} size={size} />
    </span>
  );
}

/** Dual inputs shaped as 帶分數: [whole] [num]/[den]. */
function MixedNumberBlankInputs({
  den,
  values,
  onChange,
  locked,
  inputClass,
  inputRefs,
  tx,
}) {
  const box = `${inputClass()} !px-1.5 !py-1.5 text-center max-w-[3.75rem]`;
  return (
    <span className="inline-flex items-center gap-1 font-mono text-2xl font-bold text-ink sm:text-3xl">
      <label className="sr-only" htmlFor="fib-answer-0">
        {tx("整數", "Whole number")}
      </label>
      <input
        id="fib-answer-0"
        ref={(el) => {
          inputRefs.current[0] = el;
        }}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        readOnly={locked}
        value={values[0] ?? ""}
        onChange={(e) => onChange(0, e.target.value)}
        placeholder="?"
        className={box}
      />
      <span className="inline-flex flex-col items-center leading-none">
        <label className="sr-only" htmlFor="fib-answer-1">
          {tx("分子", "Numerator")}
        </label>
        <input
          id="fib-answer-1"
          ref={(el) => {
            inputRefs.current[1] = el;
          }}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          readOnly={locked}
          value={values[1] ?? ""}
          onChange={(e) => onChange(1, e.target.value)}
          placeholder="?"
          className={`${box} !text-base w-11`}
        />
        <span className="my-0.5 w-full min-w-[2.5rem] border-t-2 border-current" />
        <span className="px-1 text-base">{den}</span>
      </span>
    </span>
  );
}

function stackFractionsInText(source, keyStart = 0) {
  // Powers first: 2^3 → 2³, then fractions
  const tokenRe = /(-?\d+)\^(\d+)|(-?\d+)\/(-?\d+)/g;
  const nodes = [];
  let last = 0;
  let match;
  let key = keyStart;

  while ((match = tokenRe.exec(source)) !== null) {
    if (match.index > last) {
      nodes.push(
        <span key={`t-${key++}`} className="whitespace-pre">
          {source.slice(last, match.index)}
        </span>,
      );
    }
    if (match[1] != null) {
      nodes.push(
        <span key={`p-${key++}`} className="inline-flex items-start">
          <span>{match[1]}</span>
          <sup className="ml-0.5 text-[0.55em] font-bold leading-none">
            {match[2]}
          </sup>
        </span>,
      );
    } else {
      nodes.push(
        <StackedFraction key={`f-${key++}`} num={match[3]} den={match[4]} />,
      );
    }
    last = match.index + match[0].length;
  }

  if (last < source.length) {
    nodes.push(
      <span key={`t-${key++}`} className="whitespace-pre">
        {source.slice(last)}
      </span>,
    );
  }

  if (nodes.length === 0) {
    nodes.push(
      <span key={`t-${key++}`} className="whitespace-pre">
        {source}
      </span>,
    );
  }

  return nodes;
}

/** Render prompts like 3/4 + 1/4 with stacked fractions.
 *  帶分數 "3 3/4" → whole + stacked fraction. */
function MathExpression({ text, plain = false }) {
  const source = String(text);

  if (plain) {
    return (
      <span className="inline-flex flex-wrap items-center font-mono text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        <span className="whitespace-pre">{source}</span>
      </span>
    );
  }

  const mixedRe = /(-?\d+)\s+(\d+)\/(\d+)/g;
  const nodes = [];
  let last = 0;
  let key = 0;
  let m;

  while ((m = mixedRe.exec(source)) !== null) {
    if (m.index > last) {
      nodes.push(...stackFractionsInText(source.slice(last, m.index), key));
      key += 20;
    }
    nodes.push(
      <MixedNumber
        key={`m-${key++}`}
        whole={m[1]}
        num={m[2]}
        den={m[3]}
      />,
    );
    last = m.index + m[0].length;
  }

  if (last < source.length || last === 0) {
    nodes.push(...stackFractionsInText(source.slice(last), key));
  }

  return (
    <span className="inline-flex flex-wrap items-center font-mono text-2xl font-bold tracking-tight text-ink sm:text-3xl">
      {nodes}
    </span>
  );
}

export default function ArithmeticQuiz() {
  const { awardTokens } = useShop();
  const { lang, tx } = useLang();
  const [questions, setQuestions] = useState(() => generateArithmeticPretest());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState([]);
  const [inputs, setInputs] = useState([""]);
  const [feedback, setFeedback] = useState(null);
  const [locked, setLocked] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SEC);
  const inputRefs = useRef([]);
  const lockedRef = useRef(false);
  const scoreRef = useRef(0);
  const indexRef = useRef(0);
  const resultsRef = useRef([]);
  const recordedRef = useRef(false);

  const total = questions.length;
  const current = questions[index];
  const promptText = String(current?.prompt ?? "");
  const blankParts = promptText.includes("?") ? promptText.split("?") : null;
  const blankCount = blankParts ? blankParts.length - 1 : 0;
  const hasMixedBlank = Boolean(current?.mixedBlank);
  const hasInlineBlank = blankCount > 0 && !hasMixedBlank;
  const isMultiBlank =
    hasMixedBlank ||
    blankCount > 1 ||
    (Array.isArray(current?.answer) && current.answer.length > 1);
  // Linear slash only for marked division (66/5); fractions stay stacked
  const isPlainDivision = Boolean(current?.plainSlash) || /\.\.\./.test(promptText);
  const hasFractionBlank = Boolean(current?.fractionBlank);
  const questionLimit = timeLimitFor(current);
  const expression = hasInlineBlank
    ? ""
    : promptText.replace(/\s*=\s*$/, "");
  const progress = finished ? 100 : (index / total) * 100;
  const level = finished ? getMathLevelFromResults(results) : null;

  useEffect(() => {
    lockedRef.current = locked;
  }, [locked]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    indexRef.current = index;
    recordedRef.current = false;
  }, [index]);

  useEffect(() => {
    resultsRef.current = results;
  }, [results]);

  useEffect(() => {
    const q = questions[index];
    const n = Array.isArray(q?.answer) && q.answer.length > 1
      ? q.answer.length
      : Math.max(blankCountIn(q?.prompt), 1);
    setInputs(Array.from({ length: n }, () => ""));
  }, [index, questions]);

  useEffect(() => {
    if (finished || locked) return;
    const id = window.requestAnimationFrame(() => {
      inputRefs.current[0]?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [index, locked, finished, blankCount]);

  const recordResult = (correct) => {
    if (recordedRef.current) return resultsRef.current;
    recordedRef.current = true;
    const q = questions[indexRef.current];
    const next = [
      ...resultsRef.current,
      {
        skillLevel: q?.skillLevel ?? 1,
        correct: Boolean(correct),
      },
    ];
    resultsRef.current = next;
    setResults(next);
    return next;
  };

  const finishWith = (finalResults, nextScore) => {
    const result = getMathLevelFromResults(finalResults);
    try {
      sessionStorage.setItem(MATH_LEVEL_KEY, String(result.level));
    } catch {
      /* ignore */
    }
    setScore(nextScore);
    setFinished(true);
  };

  const goNext = (nextScore, finalResults) => {
    const nextIndex = indexRef.current + 1;
    if (nextIndex >= total) {
      finishWith(finalResults ?? resultsRef.current, nextScore);
      return;
    }
    setIndex(nextIndex);
    setFeedback(null);
    setLocked(false);
    lockedRef.current = false;
    setTimeLeft(timeLimitFor(questions[nextIndex]));
  };

  const lockAsWrong = () => {
    if (lockedRef.current || finished) return;
    lockedRef.current = true;
    setLocked(true);
    setFeedback("wrong");
    recordResult(false);
    void awardTokens(false);
  };

  useEffect(() => {
    if (finished || locked) return;

    setTimeLeft(questionLimit);
    const tick = window.setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(tick);
  }, [index, finished, locked, questionLimit]);

  useEffect(() => {
    if (finished || locked || timeLeft > 0) return;
    lockAsWrong();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, finished, locked]);

  const submit = (event) => {
    event.preventDefault();
    if (finished) return;

    // After timeout / already recorded: only the button advances
    if (locked) {
      goNext(scoreRef.current, resultsRef.current);
      return;
    }

    const userAnswer = Array.isArray(current.answer) ? inputs : (inputs[0] ?? "");
    const correct = isCorrectAnswer(userAnswer, current.answer);
    const nextScore = scoreRef.current + (correct ? 1 : 0);
    if (correct) setScore(nextScore);
    scoreRef.current = nextScore;
    const finalResults = recordResult(correct);
    void awardTokens(correct);
    goNext(nextScore, finalResults);
  };

  const restart = () => {
    setQuestions(generateArithmeticPretest());
    setIndex(0);
    setScore(0);
    scoreRef.current = 0;
    setResults([]);
    resultsRef.current = [];
    setInputs([""]);
    setFeedback(null);
    setLocked(false);
    lockedRef.current = false;
    setFinished(false);
    setTimeLeft(TIME_LIMIT_SEC);
  };

  const setBlankValue = (blankIndex, value) => {
    setInputs((prev) => {
      const next = [...prev];
      next[blankIndex] = value;
      return next;
    });
  };

  const inputClass = () => {
    const base =
      "w-full rounded-2xl border px-4 py-3.5 font-mono text-2xl font-bold text-ink outline-none transition";
    if (feedback === "correct") {
      return `${base} border-emerald-400 bg-emerald-50`;
    }
    if (feedback === "wrong") {
      return `${base} border-rose-300 bg-rose-50`;
    }
    return `${base} border-slate-200 bg-white focus:border-brand focus:ring-2 focus:ring-brand/20`;
  };

  const timerPct = (timeLeft / questionLimit) * 100;

  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm"
              aria-hidden="true"
            >
              <svg viewBox="0 0 64 64" className="h-full w-full">
                <path
                  d="M10 18h12M16 12v12"
                  fill="none"
                  stroke="#4b5563"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M42 18h12"
                  fill="none"
                  stroke="#4b5563"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M12 44l8 8M20 44l-8 8"
                  fill="none"
                  stroke="#4b5563"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <path
                  d="M42 44h12M42 52h12"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
                Pre-test
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-ink">
                {tx("算術測試", "Arithmetic test")}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {tx(
                  "共 30 題 · 每題 5 秒 · 雙空格題 15 秒（Tab 換格）",
                  "30 questions · 5 seconds each · 15 seconds for two-blank questions (Tab to switch)",
                )}
              </p>
            </div>
          </div>
          <Link
            to="/math"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm hover:border-brand"
          >
            {tx("章節目錄", "Chapter list")}
          </Link>
        </header>

        <div className="mb-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-ink">
            <span>
              {finished
                ? tx(`完成 ${total} / ${total} 題`, `Finished ${total} / ${total}`)
                : tx(`第 ${index + 1} / ${total} 題`, `Question ${index + 1} / ${total}`)}
            </span>
            <span className="flex items-center gap-3">
              {!finished && (
                <span
                  className={`font-mono ${
                    timeLeft <= (isMultiBlank ? 30 : 2)
                      ? "text-rose-600"
                      : "text-brand"
                  }`}
                >
                  {formatTimer(timeLeft)}
                </span>
              )}
              <span>{tx("答對：", "Correct: ")}{score}</span>
            </span>
          </div>
          <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {!finished && (
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                  timeLeft <= 2 ? "bg-rose-500" : "bg-sky-400"
                }`}
                style={{ width: `${timerPct}%` }}
              />
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          {finished && level ? (
            <PracticeReport
              subject="math"
              title={tx("算術前測報告", "Arithmetic pre-test report")}
              subtitle="Arithmetic Pre-test"
              score={score}
              total={total}
              answers={results}
              extra={
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-4 text-center">
                  <div
                    className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${level.color} text-2xl font-bold text-white shadow-md`}
                  >
                    {level.level}
                  </div>
                  <p className="text-sm font-bold text-ink">
                    {tx("建議程度：", "Suggested level: ")}
                    {level.label} · {lang === "en" ? level.titleEn || level.title : level.title}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {lang === "en"
                      ? `Based on the questions you got right, start from “${level.titleEn || level.title}”.`
                      : level.message}
                  </p>
                </div>
              }
            >
              <Link
                to={`/math/level/${level.level}`}
                className="rounded-xl bg-brand px-6 py-3 font-bold text-white shadow-sm hover:bg-brand-dark"
              >
                {tx(`進入 Level ${level.level}`, `Go to Level ${level.level}`)}
              </Link>
              <button
                type="button"
                onClick={restart}
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-ink shadow-sm hover:border-brand"
              >
                {tx("再測一次", "Try again")}
              </button>
              <Link
                to="/math"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-ink shadow-sm hover:border-brand"
              >
                {tx("章節目錄", "Chapter list")}
              </Link>
            </PracticeReport>
          ) : (
            <form onSubmit={submit}>
              <p className="mb-2 text-xs font-bold tracking-wider text-muted">
                Fill in the blank
              </p>
              {hasMixedBlank ? (
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <MathExpression text={current.mixedBlank.left} />
                  <span className="font-mono text-2xl font-bold text-ink sm:text-3xl">
                    =
                  </span>
                  <MixedNumberBlankInputs
                    den={current.mixedBlank.den}
                    values={inputs}
                    onChange={setBlankValue}
                    locked={locked}
                    inputClass={inputClass}
                    inputRefs={inputRefs}
                    tx={tx}
                  />
                </div>
              ) : hasInlineBlank ? (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {blankParts.map((part, i) => (
                    <span key={`blank-seg-${i}`} className="contents">
                      {part ? (
                        <MathExpression
                          text={
                            i === 0
                              ? part.trimEnd()
                              : i === blankParts.length - 1
                                ? part.trimStart()
                                : part
                          }
                          plain={isPlainDivision}
                        />
                      ) : null}
                      {i < blankCount ? (
                        <>
                          <label className="sr-only" htmlFor={`fib-answer-${i}`}>
                            {tx(`答案 ${i + 1}`, `Answer ${i + 1}`)}
                          </label>
                          <input
                            id={`fib-answer-${i}`}
                            ref={(el) => {
                              inputRefs.current[i] = el;
                            }}
                            type="text"
                            inputMode="decimal"
                            autoComplete="off"
                            readOnly={locked}
                            value={inputs[i] ?? ""}
                            onChange={(e) => setBlankValue(i, e.target.value)}
                            placeholder="?"
                            className={`${inputClass()} max-w-[5.5rem]`}
                          />
                        </>
                      ) : null}
                    </span>
                  ))}
                </div>
              ) : (
                <>
                  <p className="mb-3">
                    <MathExpression
                      text={expression}
                      plain={isPlainDivision}
                    />
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 font-mono text-2xl font-bold text-ink sm:text-3xl">
                      =
                    </span>
                    {hasFractionBlank ? (
                      <span className="inline-flex flex-col items-center font-mono font-bold text-ink leading-none">
                        <label className="sr-only" htmlFor="fib-answer-0">
                          {tx("分子", "Numerator")}
                        </label>
                        <input
                          id="fib-answer-0"
                          ref={(el) => {
                            inputRefs.current[0] = el;
                          }}
                          type="text"
                          inputMode="decimal"
                          autoComplete="off"
                          readOnly={locked}
                          value={inputs[0] ?? ""}
                          onChange={(e) => setBlankValue(0, e.target.value)}
                          placeholder="?"
                          className={`${inputClass()} !px-1.5 !py-1 text-center max-w-[3.75rem] !text-base`}
                        />
                        <span className="my-0.5 w-full min-w-[2.5rem] border-t-2 border-current" />
                        <span className="px-1 text-base">
                          {current.fractionBlank.den}
                        </span>
                      </span>
                    ) : (
                      <>
                        <label className="sr-only" htmlFor="fib-answer-0">
                          {tx("答案", "Answer")}
                        </label>
                        <input
                          id="fib-answer-0"
                          ref={(el) => {
                            inputRefs.current[0] = el;
                          }}
                          type="text"
                          inputMode="decimal"
                          autoComplete="off"
                          readOnly={locked}
                          value={inputs[0] ?? ""}
                          onChange={(e) => setBlankValue(0, e.target.value)}
                          placeholder={tx("輸入答案", "Type answer")}
                          className={inputClass()}
                        />
                      </>
                    )}
                  </div>
                </>
              )}
              {feedback === "wrong" && (
                <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-rose-600">
                  <span>{tx("時間到！正確答案：", "Time up! Correct answer: ")}</span>
                  {current.mixedBlank && Array.isArray(current.answer) ? (
                    <MixedNumber
                      whole={current.answer[0]}
                      num={current.answer[1]}
                      den={current.mixedBlank.den}
                    />
                  ) : current.mixedLeft ? (
                    <StackedFraction
                      num={current.answer}
                      den={current.mixedLeft.den}
                      size="lg"
                    />
                  ) : current.fractionBlank ? (
                    <StackedFraction
                      num={current.answer}
                      den={current.fractionBlank.den}
                      size="lg"
                    />
                  ) : (
                    <span>{formatQuizAnswer(current)}</span>
                  )}
                </p>
              )}
              <button
                type="submit"
                className="mt-5 inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-dark"
              >
                {index + 1 >= total ? tx("完成測試", "Finish test") : tx("下一題", "Next")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
