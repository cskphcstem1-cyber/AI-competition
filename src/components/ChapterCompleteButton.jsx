import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useLang } from "../contexts/LangContext";
import { db } from "../firebase";
import { setChapterComplete } from "../lib/practiceLog";

function readField(data, fieldPath) {
  return fieldPath.split(".").reduce((value, key) => value?.[key], data);
}

/**
 * Toggle chapter complete. Click once to save, click again to undo.
 */
export default function ChapterCompleteButton({
  progressField,
  practiceLabel,
  subject = "python",
}) {
  const { user } = useAuth();
  const { tx } = useLang();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) {
      setSaved(false);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (cancelled || !snap.exists()) return;
        setSaved(Boolean(readField(snap.data(), progressField)));
      } catch {
        if (!cancelled) setSaved(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, progressField]);

  const toggle = async () => {
    if (!user || busy) return;
    setBusy(true);
    const next = !saved;
    try {
      await setChapterComplete(user.uid, progressField, next, {
        subject,
        label: practiceLabel,
        detail: tx("章節進度", "Chapter progress"),
      });
      setSaved(next);
    } catch {
      /* keep previous state */
    } finally {
      setBusy(false);
    }
  };

  if (!user) {
    return (
      <p className="text-sm text-muted">
        {tx("登入後可記錄學習進度", "Sign in to save your progress")}
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className={`rounded-xl px-6 py-3 font-bold text-white shadow-sm transition disabled:opacity-70 ${
        saved
          ? "bg-emerald-500 hover:bg-emerald-600"
          : "bg-brand hover:bg-brand-dark"
      }`}
    >
      {busy
        ? tx("儲存中…", "Saving…")
        : saved
          ? tx("已標記完成", "Marked complete")
          : tx("完成本章 ✓", "Finish this chapter ✓")}
    </button>
  );
}
