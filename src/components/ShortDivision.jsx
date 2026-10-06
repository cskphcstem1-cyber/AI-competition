import { useEffect, useState } from "react";
import { useLang } from "../contexts/LangContext";

function readDigit(remainder) {
  const text = String(remainder);
  for (const mark of ["寫成 ", "write as "]) {
    const at = text.indexOf(mark);
    if (at !== -1) return text.slice(at + mark.length);
  }
  return text;
}

export default function ShortDivision({ divisor, start, steps }) {
  const { tx } = useLang();
  const signature = `${divisor}|${start}|${steps
    .map((step) => `${step.quotient}:${step.remainder}`)
    .join(",")}`;
  const [run, setRun] = useState(0);
  const [shown, setShown] = useState(0);
  const [readCursor, setReadCursor] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(steps.length);
      setReadCursor(steps.length);
      setDone(true);
      return undefined;
    }

    setShown(0);
    setReadCursor(0);
    setDone(false);

    const timers = [];
    const stepMs = 800;
    const readMs = 700;
    steps.forEach((_, index) => {
      timers.push(setTimeout(() => setShown(index + 1), stepMs * (index + 1)));
    });
    const readStart = stepMs * (steps.length + 1);
    steps.forEach((_, index) => {
      timers.push(setTimeout(() => setReadCursor(index + 1), readStart + readMs * index));
    });
    timers.push(
      setTimeout(() => setDone(true), readStart + readMs * steps.length),
    );

    return () => timers.forEach(clearTimeout);
  }, [run, signature]);

  const visibleSteps = steps.slice(0, shown);
  const rows = [
    { mid: start, note: tx("原來的數", "start") },
    ...visibleSteps.map((step) => ({
      mid: step.quotient,
      note: tx(`餘 ${step.remainder}`, `rem ${step.remainder}`),
    })),
  ];
  const readOrder = [...visibleSteps.keys()].reverse();
  const readIndexes = readOrder.slice(0, readCursor);
  const currentIndex = readIndexes.at(-1);
  const digits = readIndexes.map((index) => readDigit(steps[index].remainder));

  return (
    <div className="mt-3">
      <div className="overflow-x-auto">
        <div className="inline-grid grid-cols-[3.5rem_4.5rem_auto] font-mono text-sm font-bold text-ink">
          <div
            className="flex items-start justify-center border-r-2 border-ink pt-1.5"
            style={{ gridRow: `1 / span ${rows.length}` }}
          >
            {divisor}
          </div>
          {rows.map((row, index) => {
            const stepIndex = index - 1;
            const isCurrent = stepIndex === currentIndex;
            const isRead = stepIndex >= 0 && readIndexes.includes(stepIndex);
            return (
              <div key={`${row.mid}-${row.note}`} className="contents">
                <div
                  className={`flex items-center justify-center px-2 py-1.5 [animation:fadeUp_0.35s_ease] ${
                    index === 0 ? "border-b-2 border-ink" : "border-b border-slate-200"
                  } ${isCurrent ? "bg-amber-100" : ""}`}
                >
                  {row.mid}
                </div>
                <div
                  className={`flex items-center px-3 py-1.5 text-xs font-semibold [animation:fadeUp_0.35s_ease] ${
                    isCurrent
                      ? "text-amber-800"
                      : isRead
                        ? "text-brand-dark"
                        : "text-muted"
                  }`}
                >
                  {row.note}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-2 min-h-6 font-mono text-sm font-bold text-ink">
        {digits.length > 0
          ? tx(`由下往上：${digits.join("、")}`, `Bottom to top: ${digits.join(", ")}`)
          : "\u00a0"}
      </p>
      {done ? (
        <button
          type="button"
          onClick={() => setRun((value) => value + 1)}
          className="mt-1 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-sm hover:border-brand"
        >
          {tx("再看一次", "Watch again")}
        </button>
      ) : null}
    </div>
  );
}
