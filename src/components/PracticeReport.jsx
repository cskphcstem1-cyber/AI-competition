import { useEffect, useRef, useState } from "react";
import {
  tokensFromQuiz,
} from "../data/shopItems";
import { useLang } from "../contexts/LangContext";
import { useAuth } from "../contexts/AuthContext";
import { sendParentResultEmail } from "../lib/parentEmail";

function gradeFor(pct, tx) {
  if (pct >= 90) {
    return {
      label: tx("優秀", "Excellent"),
      tone: "text-emerald-700 bg-emerald-50 border-emerald-200",
      tonePdf: { bg: "#ecfdf5", border: "#a7f3d0", text: "#047857" },
      message: tx(
        "表現非常出色！繼續保持這份專注。",
        "Fantastic work! Keep this focus going.",
      ),
    };
  }
  if (pct >= 70) {
    return {
      label: tx("良好", "Good"),
      tone: "text-sky-700 bg-sky-50 border-sky-200",
      tonePdf: { bg: "#f0f9ff", border: "#bae6fd", text: "#0369a1" },
      message: tx(
        "掌握得不錯，再複習一下錯題會更穩。",
        "You know this well. Review the missed questions to get even stronger.",
      ),
    };
  }
  if (pct >= 50) {
    return {
      label: tx("尚可", "OK"),
      tone: "text-amber-800 bg-amber-50 border-amber-200",
      tonePdf: { bg: "#fffbeb", border: "#fde68a", text: "#92400e" },
      message: tx(
        "有進步空間，建議重看本章重點後再測一次。",
        "You can improve. Read the chapter again, then try the quiz once more.",
      ),
    };
  }
  return {
    label: tx("需加強", "Keep practicing"),
    tone: "text-rose-700 bg-rose-50 border-rose-200",
    tonePdf: { bg: "#fff1f2", border: "#fecdd3", text: "#be123c" },
    message: tx(
      "別氣餒！回到課程複習後再挑戰，一定會更好。",
      "Don't give up! Review the lesson and try again. You will do better.",
    ),
  };
}

const SUBJECT_META = {
  technology: {
    eyebrow: "Technology Practice Report",
    accent: "from-blue-600 to-sky-500",
    headerBg: "#2563eb",
  },
  math: {
    eyebrow: "Math Practice Report",
    accent: "from-indigo-600 to-blue-400",
    headerBg: "#4f46e5",
  },
};

function safeFileName(name) {
  return String(name || "practice-report")
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 60);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Build a hex-only snapshot so html2canvas won't choke on Tailwind oklch(). */
function buildPdfSnapshot({
  meta,
  title,
  subtitle,
  safeScore,
  safeTotal,
  wrong,
  pct,
  grade,
  tokensEarned,
  answerRows,
  saved,
  copy,
}) {
  const dots = (answerRows || [])
    .map((row, i) => {
      const bg = row.correct ? "#10b981" : "#fb7185";
      return `<span style="display:inline-flex;width:28px;height:28px;align-items:center;justify-content:center;border-radius:8px;background:${bg};color:#fff;font-size:12px;font-weight:700;margin:0 4px 4px 0;">${i + 1}</span>`;
    })
    .join("");

  const savedLine =
    saved == null
      ? ""
      : `<p style="text-align:center;color:#64748b;font-size:13px;margin:12px 0 0;">${
          saved ? copy.savedOk : copy.saving
        }</p>`;

  const root = document.createElement("div");
  root.setAttribute("data-pdf-snapshot", "true");
  root.style.cssText = [
    "position:fixed",
    "left:-10000px",
    "top:0",
    "width:720px",
    "padding:24px",
    "background:#ffffff",
    "color:#0f172a",
    "font-family:'Microsoft JhengHei','Noto Sans TC',Arial,sans-serif",
    "box-sizing:border-box",
    "z-index:-1",
  ].join(";");

  root.innerHTML = `
    <div style="background:${meta.headerBg};color:#fff;border-radius:16px;padding:20px 22px;margin-bottom:18px;">
      <div style="font-size:11px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.85;font-weight:700;">${escapeHtml(meta.eyebrow)}</div>
      <div style="font-size:26px;font-weight:800;margin-top:8px;">${escapeHtml(copy.report)}</div>
      <div style="font-size:14px;margin-top:6px;opacity:0.95;">${escapeHtml(title)}</div>
      ${subtitle ? `<div style="font-size:12px;margin-top:4px;opacity:0.8;">${escapeHtml(subtitle)}</div>` : ""}
      <div style="font-size:11px;margin-top:12px;opacity:0.75;">CodeKids STEM Lab · ${escapeHtml(new Date().toLocaleString(copy.locale))}</div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;">
      <div style="border:1px solid #e2e8f0;background:#f8fafc;border-radius:12px;padding:12px;text-align:center;">
        <div style="font-size:10px;color:#64748b;font-weight:700;">${escapeHtml(copy.score)}</div>
        <div style="font-size:22px;font-weight:800;margin-top:4px;">${safeScore}/${safeTotal}</div>
      </div>
      <div style="border:1px solid #e2e8f0;background:#f8fafc;border-radius:12px;padding:12px;text-align:center;">
        <div style="font-size:10px;color:#64748b;font-weight:700;">${escapeHtml(copy.accuracy)}</div>
        <div style="font-size:22px;font-weight:800;margin-top:4px;">${pct}%</div>
      </div>
      <div style="border:1px solid #e2e8f0;background:#f8fafc;border-radius:12px;padding:12px;text-align:center;">
        <div style="font-size:10px;color:#64748b;font-weight:700;">${escapeHtml(copy.rightWrong)}</div>
        <div style="font-size:22px;font-weight:800;margin-top:4px;"><span style="color:#059669;">${safeScore}</span> / <span style="color:#e11d48;">${wrong}</span></div>
      </div>
      <div style="border:1px solid #e2e8f0;background:#f8fafc;border-radius:12px;padding:12px;text-align:center;">
        <div style="font-size:10px;color:#64748b;font-weight:700;">${escapeHtml(copy.tokens)}</div>
        <div style="font-size:22px;font-weight:800;margin-top:4px;color:#b45309;">${tokensEarned > 0 ? "+" : ""}${tokensEarned}</div>
      </div>
    </div>

    <div style="border:1px solid ${grade.tonePdf.border};background:${grade.tonePdf.bg};color:${grade.tonePdf.text};border-radius:12px;padding:14px 16px;margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <strong style="font-size:14px;">${escapeHtml(copy.comment)}：${escapeHtml(grade.label)}</strong>
        <span style="background:rgba(255,255,255,0.7);border-radius:999px;padding:2px 10px;font-size:12px;font-weight:700;">${pct}%</span>
      </div>
      <div style="font-size:13px;margin-top:6px;">${escapeHtml(grade.message)}</div>
    </div>

    ${
      dots
        ? `<div style="margin-bottom:8px;"><div style="font-size:14px;font-weight:700;margin-bottom:8px;">${escapeHtml(copy.perQuestion)}</div><div>${dots}</div></div>`
        : ""
    }
    ${savedLine}
  `;

  document.body.appendChild(root);
  return root;
}

/**
 * End-of-practice summary shown when a Technology or Math quiz finishes.
 */
export default function PracticeReport({
  subject = "technology",
  title,
  subtitle,
  score,
  total,
  answers,
  extra,
  saved,
  children,
}) {
  const { lang, tx } = useLang();
  const { user, parentEmail, saveParentEmail } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [parentDraft, setParentDraft] = useState("");
  const [parentStatus, setParentStatus] = useState("");
  const [parentBusy, setParentBusy] = useState(false);
  const notifiedRef = useRef(false);

  const safeTotal = Math.max(1, Number(total) || 0);
  const safeScore = Math.max(0, Number(score) || 0);
  const wrong = Math.max(0, safeTotal - safeScore);
  const pct = Math.round((safeScore / safeTotal) * 100);
  const grade = gradeFor(pct, tx);
  const meta = SUBJECT_META[subject] || SUBJECT_META.technology;
  const tokensEarned = tokensFromQuiz(safeScore, safeTotal);

  const copy = {
    report: tx("練習報告", "Practice report"),
    score: tx("得分", "Score"),
    accuracy: tx("正確率", "Accuracy"),
    rightWrong: tx("答對 / 答錯", "Right / wrong"),
    tokens: tx("代幣", "Tokens"),
    comment: tx("評語", "Comment"),
    perQuestion: tx("逐題結果", "Question results"),
    savedOk: tx("成績已儲存到你的帳戶", "Score saved to your account"),
    saving: tx("正在儲存成績…", "Saving score…"),
    pdfFail: tx("PDF 下載失敗，請再試一次。", "PDF download failed. Please try again."),
    makingPdf: tx("產生 PDF 中…", "Making PDF…"),
    downloadPdf: tx("下載 PDF 報告", "Download PDF report"),
    locale: lang === "en" ? "en-US" : "zh-HK",
  };
  const answerRows = Array.isArray(answers) ? answers : null;

  useEffect(() => {
    if (!user || !parentEmail || notifiedRef.current) return;
    const key = `ck-parent-mail:${user.uid}:${title}:${safeScore}/${safeTotal}`;
    try {
      if (sessionStorage.getItem(key)) {
        setParentStatus("sent");
        return;
      }
    } catch {
      /* ignore */
    }
    notifiedRef.current = true;
    setParentStatus("sending");
    sendParentResultEmail({
      to: parentEmail,
      lang,
      studentName: user.displayName || user.email?.split("@")[0],
      title,
      subtitle,
      score: safeScore,
      total: safeTotal,
      pct,
    })
      .then(() => {
        try {
          sessionStorage.setItem(key, "1");
        } catch {
          /* ignore */
        }
        setParentStatus("sent");
      })
      .catch(() => {
        notifiedRef.current = false;
        setParentStatus("error");
      });
  }, [user, parentEmail, title, subtitle, safeScore, safeTotal, pct, lang]);

  const saveParentAndSend = async (event) => {
    event.preventDefault();
    if (!user || parentBusy) return;
    setParentBusy(true);
    setParentStatus("");
    try {
      const savedEmail = await saveParentEmail(parentDraft);
      await sendParentResultEmail({
        to: savedEmail,
        lang,
        studentName: user.displayName || user.email?.split("@")[0],
        title,
        subtitle,
        score: safeScore,
        total: safeTotal,
        pct,
      });
      setParentStatus("sent");
    } catch {
      setParentStatus("error");
    } finally {
      setParentBusy(false);
    }
  };

  const downloadPdf = async () => {
    if (downloading) return;
    setDownloading(true);
    let snapshot = null;
    try {
      const [{ default: html2canvas }, jspdfMod] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const JsPDF = jspdfMod.jsPDF || jspdfMod.default;

      snapshot = buildPdfSnapshot({
        meta,
        title,
        subtitle,
        safeScore,
        safeTotal,
        wrong,
        pct,
        grade,
        tokensEarned,
        answerRows,
        saved,
        copy,
      });

      // Wait a frame so layout/fonts settle
      await new Promise((r) => requestAnimationFrame(() => r()));

      const canvas = await html2canvas(snapshot, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        foreignObjectRendering: false,
      });

      if (!canvas.width || !canvas.height) {
        throw new Error("empty canvas");
      }

      const imgData = canvas.toDataURL("image/png");
      const pdf = new JsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const maxW = pageW - margin * 2;
      const maxH = pageH - margin * 2;
      const ratio = Math.min(maxW / canvas.width, maxH / canvas.height);
      const drawW = canvas.width * ratio;
      const drawH = canvas.height * ratio;
      const x = (pageW - drawW) / 2;

      pdf.addImage(imgData, "PNG", x, margin, drawW, drawH);
      const stamp = new Date().toISOString().slice(0, 10);
      pdf.save(`${safeFileName(title)}_report_${stamp}.pdf`);
    } catch (err) {
      console.warn("PDF download failed", err);
      window.alert(copy.pdfFail);
    } finally {
      if (snapshot?.parentNode) snapshot.parentNode.removeChild(snapshot);
      setDownloading(false);
    }
  };

  return (
    <div className="text-left">
      <div className="rounded-2xl bg-white p-1" data-practice-report="true">
        <div
          className={`mb-5 overflow-hidden rounded-2xl bg-gradient-to-br ${meta.accent} p-5 text-white shadow-md`}
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">
            {meta.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold">{copy.report}</h2>
          <p className="mt-1 text-sm text-white/90">{title}</p>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-white/75">{subtitle}</p>
          ) : null}
          <p className="mt-3 text-[11px] text-white/70">
            CodeKids STEM Lab · {new Date().toLocaleString(copy.locale)}
          </p>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
              {copy.score}
            </p>
            <p className="mt-1 text-xl font-bold text-ink">
              {safeScore}/{safeTotal}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
              {copy.accuracy}
            </p>
            <p className="mt-1 text-xl font-bold text-ink">{pct}%</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
              {copy.rightWrong}
            </p>
            <p className="mt-1 text-xl font-bold text-ink">
              <span className="text-emerald-600">{safeScore}</span>
              <span className="text-muted"> / </span>
              <span className="text-rose-500">{wrong}</span>
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
              {copy.tokens}
            </p>
            <p className="mt-1 text-xl font-bold text-amber-700">
              {tokensEarned > 0 ? "+" : ""}
              {tokensEarned}
            </p>
          </div>
        </div>

        <div className={`mb-5 rounded-xl border px-4 py-3 ${grade.tone}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold">{copy.comment}：{grade.label}</p>
            <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-bold">
              {pct}%
            </span>
          </div>
          <p className="mt-1 text-sm">{grade.message}</p>
        </div>

        {extra ? <div className="mb-5">{extra}</div> : null}

        {answerRows && answerRows.length > 0 ? (
          <div className="mb-4">
            <p className="mb-2 text-sm font-bold text-ink">{copy.perQuestion}</p>
            <div className="flex flex-wrap gap-1.5">
              {answerRows.map((row, i) => (
                <span
                  key={row.id ?? i}
                  title={tx(`第 ${i + 1} 題`, `Question ${i + 1}`)}
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white ${
                    row.correct ? "bg-emerald-500" : "bg-rose-400"
                  }`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {saved != null ? (
          <p className="mb-2 text-center text-sm text-muted">
            {saved ? copy.savedOk : copy.saving}
          </p>
        ) : null}

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm font-bold text-ink">
            {tx("通知家長", "Tell a parent")}
          </p>
          {!user ? (
            <p className="mt-1 text-sm text-muted">
              {tx("登入並填寫家長電郵後，完成測驗會自動寄出成績。", "Sign in and save a parent email so scores are sent after each test.")}
            </p>
          ) : parentEmail ? (
            <p className="mt-1 text-sm text-muted">
              {parentStatus === "sending" &&
                tx("正在寄給家長…", "Sending to the parent…")}
              {parentStatus === "sent" &&
                tx(
                  `已寄到 ${parentEmail}。若是第一次，家長請先點信件裡的確認連結。`,
                  `Sent to ${parentEmail}. The first time, the parent must click the confirmation link in the inbox.`,
                )}
              {parentStatus === "error" &&
                tx("寄信失敗，請檢查家長電郵後再試。", "Could not send. Check the parent email and try again.")}
              {!parentStatus &&
                tx(`成績會寄到 ${parentEmail}`, `The score will go to ${parentEmail}`)}
            </p>
          ) : (
            <form onSubmit={saveParentAndSend} className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                required
                value={parentDraft}
                onChange={(e) => setParentDraft(e.target.value)}
                placeholder={tx("家長電郵", "Parent email")}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
              />
              <button
                type="submit"
                disabled={parentBusy}
                className="rounded-xl bg-lab px-4 py-2 text-sm font-bold text-white hover:bg-ink disabled:opacity-60"
              >
                {parentBusy
                  ? tx("寄出中…", "Sending…")
                  : tx("儲存並寄出", "Save and send")}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={downloadPdf}
          disabled={downloading}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-6 py-3 font-bold text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v12" />
            <path d="m7 10 5 5 5-5" />
            <path d="M5 21h14" />
          </svg>
          {downloading ? copy.makingPdf : copy.downloadPdf}
        </button>
        {children}
      </div>
    </div>
  );
}
