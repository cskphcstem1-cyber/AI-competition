import { useEffect, useMemo, useState } from "react";
import { fetchPracticeLog, SUBJECT_META } from "../lib/practiceLog";
import { useLang } from "../contexts/LangContext";

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function CalendarIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toKey(year, month, day) {
  return `${year}-${pad2(month + 1)}-${pad2(day)}`;
}

function formatDayTitle(key, tx) {
  const [y, m, d] = key.split("-").map(Number);
  return tx(`${y} 年 ${m} 月 ${d} 日`, `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
}

function formatTime(at) {
  if (!at) return "";
  const d = new Date(at);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export default function PracticeCalendar({ open, onClose, uid, subtitle }) {
  const { lang, tx } = useLang();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [log, setLog] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!open || !uid) return;
    let cancelled = false;
    setLoading(true);
    fetchPracticeLog(uid)
      .then((data) => {
        if (!cancelled) {
          setLog(data || {});
          setSelected(null);
        }
      })
      .catch(() => {
        if (!cancelled) setLog({});
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, uid]);

  const cells = useMemo(() => {
    const firstDow = new Date(year, month, 1).getDay();
    const total = daysInMonth(year, month);
    const list = [];
    for (let i = 0; i < firstDow; i += 1) list.push(null);
    for (let d = 1; d <= total; d += 1) list.push(d);
    while (list.length % 7 !== 0) list.push(null);
    return list;
  }, [year, month]);

  const selectedEntries = useMemo(() => {
    if (!selected) return [];
    const entries = Array.isArray(log[selected]) ? [...log[selected]] : [];
    return entries.sort((a, b) => (a.at || 0) - (b.at || 0));
  }, [log, selected]);

  const practicedDays = useMemo(() => {
    let n = 0;
    Object.keys(log).forEach((key) => {
      if (key.startsWith(`${year}-${pad2(month + 1)}`) && log[key]?.length) {
        n += 1;
      }
    });
    return n;
  }, [log, year, month]);

  if (!open) return null;

  const shiftMonth = (delta) => {
    const d = new Date(year, month + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setSelected(null);
  };

  const todayKey = toKey(now.getFullYear(), now.getMonth(), now.getDate());

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="practice-calendar-title"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
              Daily Practice
            </p>
            <h2
              id="practice-calendar-title"
              className="mt-1 flex items-center gap-2 text-xl font-bold text-ink"
            >
              <CalendarIcon className="h-5 w-5 text-brand" />
              {tx("練習日曆", "Practice calendar")}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {subtitle ||
                tx("查看帳號每天完成的練習與測驗", "See the practice and quizzes you finished each day")}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-lg text-muted hover:bg-slate-100 hover:text-ink"
            aria-label={tx("關閉", "Close")}
          >
            ×
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-bold text-ink hover:border-brand"
          >
            ←
          </button>
          <div className="text-center">
            <p className="text-lg font-bold text-ink">
              {tx(`${year} 年 ${month + 1} 月`, `${year} / ${month + 1}`)}
            </p>
            <p className="text-xs font-semibold text-muted">
              {tx(`本月練習 ${practicedDays} 天`, `${practicedDays} practice days this month`)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-bold text-ink hover:border-brand"
          >
            →
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted">
          {(lang === "en" ? ["S", "M", "T", "W", "T", "F", "S"] : WEEKDAYS).map((w, i) => (
            <div key={`${w}-${i}`} className="py-1">
              {w}
            </div>
          ))}
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm font-semibold text-muted">
            {tx("載入練習紀錄…", "Loading practice log…")}
          </p>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day == null) {
                return <div key={`e-${i}`} className="aspect-square" />;
              }
              const key = toKey(year, month, day);
              const entries = Array.isArray(log[key]) ? log[key] : [];
              const hasPractice = entries.length > 0;
              const isToday = key === todayKey;
              const isSelected = selected === key;
              const subjects = [
                ...new Set(entries.map((e) => e.subject || "other")),
              ].slice(0, 3);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelected(key)}
                  className={`flex aspect-square flex-col items-center justify-center rounded-xl border text-sm font-bold transition ${
                    isSelected
                      ? "border-brand bg-brand text-white shadow-sm"
                      : hasPractice
                        ? "border-brand/30 bg-brand-soft text-ink hover:border-brand"
                        : isToday
                          ? "border-slate-300 bg-white text-ink ring-1 ring-brand/40"
                          : "border-transparent text-muted hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span>{day}</span>
                  {hasPractice && (
                    <span className="mt-0.5 flex gap-0.5">
                      {subjects.map((s) => (
                        <span
                          key={s}
                          className={`h-1.5 w-1.5 rounded-full ${
                            isSelected
                              ? "bg-white"
                              : SUBJECT_META[s]?.color || SUBJECT_META.other.color
                          }`}
                        />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          {selected ? (
            <>
              <p className="mb-3 text-sm font-bold text-ink">
                {formatDayTitle(selected, tx)}
                <span className="ml-2 font-semibold text-muted">
                  · {tx(`${selectedEntries.length} 項練習`, `${selectedEntries.length} activities`)}
                </span>
              </p>
              {selectedEntries.length === 0 ? (
                <p className="text-sm text-muted">{tx("這天還沒有練習紀錄。", "No practice on this day yet.")}</p>
              ) : (
                <ul className="space-y-2">
                  {selectedEntries.map((entry, idx) => {
                    const meta =
                      SUBJECT_META[entry.subject] || SUBJECT_META.other;
                    return (
                      <li
                        key={`${entry.at}-${idx}`}
                        className={`rounded-xl border px-3 py-2.5 ${meta.soft}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide opacity-80">
                              {lang === "en" ? meta.labelEn || meta.label : meta.label}
                            </p>
                            <p className="font-bold text-ink">{entry.label}</p>
                            {entry.detail ? (
                              <p className="mt-0.5 text-xs text-muted">
                                {entry.detail}
                              </p>
                            ) : null}
                            {entry.score != null && entry.total != null ? (
                              <p className="mt-0.5 text-xs font-semibold">
                                {tx(`得分 ${entry.score} / ${entry.total}`, `Score ${entry.score} / ${entry.total}`)}
                              </p>
                            ) : null}
                          </div>
                          <span className="shrink-0 text-xs font-semibold text-muted">
                            {formatTime(entry.at)}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          ) : (
            <p className="text-sm text-muted">
              {tx(
                "點選日期查看當天練習內容。完成章節或測驗後會自動記錄。",
                "Tap a date to see that day’s practice. Finishing a chapter or quiz is saved automatically.",
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export { CalendarIcon };
