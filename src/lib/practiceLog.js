import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

/** @returns {string} YYYY-MM-DD in local time */
export function dateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Append one practice event to the signed-in user's daily log.
 * @param {string} uid
 * @param {{
 *   subject: "python" | "scratch" | "math" | "science" | "other",
 *   label: string,
 *   detail?: string,
 *   score?: number | null,
 *   total?: number | null,
 * }} entry
 */
export async function logPractice(uid, entry) {
  if (!uid || !entry?.label) return;
  try {
    await updateDoc(doc(db, "users", uid), {
      [`practiceLog.${dateKey()}`]: arrayUnion({
        subject: entry.subject || "other",
        label: entry.label,
        detail: entry.detail || "",
        score: entry.score ?? null,
        total: entry.total ?? null,
        at: Date.now(),
      }),
    });
  } catch (err) {
    console.warn("practice log failed", err);
  }
}

/**
 * Mark a chapter complete and log daily practice in one write.
 * @param {string} uid
 * @param {string} progressField e.g. "progress.pythonChapter1"
 * @param {{ subject: string, label: string, detail?: string }} practice
 */
export async function markCompleteWithPractice(uid, progressField, practice) {
  return setChapterComplete(uid, progressField, true, practice);
}

/**
 * Set chapter complete on/off. Logging only happens when marking complete.
 * @param {string} uid
 * @param {string} progressField e.g. "progress.pythonChapter1"
 * @param {boolean} complete
 * @param {{ subject: string, label: string, detail?: string }} [practice]
 */
export async function setChapterComplete(uid, progressField, complete, practice) {
  if (!uid) return;
  if (complete) {
    await updateDoc(doc(db, "users", uid), {
      [progressField]: true,
      [`practiceLog.${dateKey()}`]: arrayUnion({
        subject: practice?.subject || "other",
        label: practice?.label || (typeof navigator !== "undefined" && (localStorage.getItem("codekids-lang") === "en") ? "Chapter complete" : "完成本章"),
        detail: practice?.detail || "",
        score: null,
        total: null,
        at: Date.now(),
      }),
    });
    return;
  }
  await updateDoc(doc(db, "users", uid), {
    [progressField]: false,
  });
}

/** @returns {Promise<{ practiceLog: Record<string, Array<Record<string, unknown>>>, quizAnalyses: Array<Record<string, unknown>> }>} */
export async function fetchStudentReports(uid) {
  if (!uid) return { practiceLog: {}, quizAnalyses: [] };
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return { practiceLog: {}, quizAnalyses: [] };
  const data = snap.data();
  return {
    practiceLog: data.practiceLog || {},
    quizAnalyses: Array.isArray(data.quizAnalyses) ? data.quizAnalyses : [],
  };
}

/** Save one Gemini quiz analysis on the student account. */
export async function saveQuizAnalysis(uid, entry) {
  if (!uid || !entry?.title) return;
  const text = String(entry.analysis || "").trim().slice(0, 4000);
  if (!text) return;
  await updateDoc(doc(db, "users", uid), {
    quizAnalyses: arrayUnion({
      title: String(entry.title).slice(0, 160),
      subtitle: String(entry.subtitle || "").slice(0, 160),
      subject: entry.subject || "other",
      score: Number(entry.score) || 0,
      total: Number(entry.total) || 0,
      pct: Number(entry.pct) || 0,
      analysis: text,
      at: Number(entry.at) || Date.now(),
    }),
  });
}

function monthPrefix(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function inMonth(at, prefix) {
  if (!at) return false;
  const d = new Date(Number(at));
  if (Number.isNaN(d.getTime())) return false;
  return dateKey(d).startsWith(prefix);
}

/**
 * Tests finished this calendar month.
 * Saved Gemini notes are preferred; practice-log scores fill gaps.
 */
export function testsThisMonth(practiceLog, quizAnalyses, now = new Date()) {
  const prefix = monthPrefix(now);
  const fromAnalyses = (quizAnalyses || [])
    .filter((item) => inMonth(item.at, prefix))
    .map((item) => ({
      date: dateKey(new Date(item.at)),
      title: item.title || "",
      subtitle: item.subtitle || "",
      score: item.score ?? null,
      total: item.total ?? null,
      analysis: item.analysis || "",
    }));

  const seen = new Set(
    fromAnalyses.map((item) => `${item.date}|${item.title}|${item.score}/${item.total}`),
  );

  const fromLog = [];
  for (const [day, entries] of Object.entries(practiceLog || {})) {
    if (!String(day).startsWith(prefix) || !Array.isArray(entries)) continue;
    for (const entry of entries) {
      if (entry?.score == null || entry?.total == null) continue;
      const title = entry.label || entry.detail || "Practice";
      const key = `${day}|${title}|${entry.score}/${entry.total}`;
      if (seen.has(key)) continue;
      seen.add(key);
      fromLog.push({
        date: day,
        title,
        subtitle: entry.detail || "",
        score: entry.score,
        total: entry.total,
        analysis: "",
      });
    }
  }

  return [...fromAnalyses, ...fromLog].sort((a, b) =>
    String(a.date).localeCompare(String(b.date)),
  );
}

/** @returns {Promise<Record<string, Array<Record<string, unknown>>>>} */
export async function fetchPracticeLog(uid) {
  const { practiceLog } = await fetchStudentReports(uid);
  return practiceLog;
}

export const SUBJECT_META = {
  python: {
    label: "Python",
    color: "bg-sky-500",
    soft: "bg-sky-50 text-sky-800 border-sky-200",
  },
  scratch: {
    label: "Scratch",
    color: "bg-orange-500",
    soft: "bg-orange-50 text-orange-800 border-orange-200",
  },
  math: {
    label: "數學",
    labelEn: "Math",
    color: "bg-indigo-500",
    soft: "bg-indigo-50 text-indigo-800 border-indigo-200",
  },
  science: {
    label: "科學",
    labelEn: "Science",
    color: "bg-emerald-500",
    soft: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  other: {
    label: "其他",
    labelEn: "Other",
    color: "bg-slate-400",
    soft: "bg-slate-50 text-slate-700 border-slate-200",
  },
};
