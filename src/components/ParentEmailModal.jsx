import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLang } from "../contexts/LangContext";
import { isValidEmail } from "../lib/parentEmail";

export default function ParentEmailModal({ open, onClose }) {
  const { parentEmail, saveParentEmail } = useAuth();
  const { tx } = useLang();
  const [value, setValue] = useState(parentEmail || "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setValue(parentEmail || "");
      setError("");
      setSaved(false);
    }
  }, [open, parentEmail]);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaved(false);
    const next = value.trim();
    if (next && !isValidEmail(next)) {
      setError(tx("電郵格式不正確", "That email does not look right"));
      return;
    }
    setBusy(true);
    try {
      await saveParentEmail(next);
      setSaved(true);
    } catch (err) {
      setError(err?.message || tx("儲存失敗，請再試一次", "Could not save. Please try again."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ink">
            {tx("家長電郵", "Parent email")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-lg text-muted hover:bg-slate-100 hover:text-ink"
            aria-label={tx("關閉", "Close")}
          >
            ×
          </button>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-muted">
          {tx(
            "填寫家長電郵後，你每次完成測驗，系統會把成績寄給家長。第一次寄到新信箱時，家長要先點確認連結。",
            "After you save a parent email, each finished test sends them the score. The first time, the parent must click a confirmation link.",
          )}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-muted">
              {tx("家長電郵", "Parent email")}
            </label>
            <input
              type="email"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="parent@example.com"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-brand"
            />
          </div>
          {error ? (
            <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">
              {error}
            </p>
          ) : null}
          {saved ? (
            <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              {tx("已儲存", "Saved")}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-lab py-3 font-bold text-white shadow-md transition hover:bg-ink disabled:opacity-60"
          >
            {busy ? tx("儲存中…", "Saving…") : tx("儲存", "Save")}
          </button>
        </form>
      </div>
    </div>
  );
}
