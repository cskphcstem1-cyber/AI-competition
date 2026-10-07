import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useShop } from "../contexts/ShopContext";
import { useLang } from "../contexts/LangContext";
import { isDarkBackground } from "../data/shopItems";
import PracticeCalendar, { CalendarIcon } from "../components/PracticeCalendar";
import { analyzeMonthWithGemini } from "../lib/geminiAnalyze";
import { sendParentMonthlyEmail } from "../lib/parentEmail";
import { fetchStudentReports, testsThisMonth } from "../lib/practiceLog";

export default function Home() {
  const { user, isAdmin, parentEmail } = useAuth();
  const { lang, t } = useLang();
  const {
    equipped,
    tokens,
    claimedToday,
    loginStreak,
    setShowDaily,
  } = useShop();
  const [showCalendar, setShowCalendar] = useState(false);
  const [monthStatus, setMonthStatus] = useState("");

  const sendMonthReport = async () => {
    if (!user || monthStatus === "sending") return;
    if (!parentEmail) {
      setMonthStatus("need-email");
      return;
    }
    setMonthStatus("sending");
    try {
      const { practiceLog, quizAnalyses } = await fetchStudentReports(user.uid);
      const tests = testsThisMonth(practiceLog, quizAnalyses);
      if (tests.length === 0) {
        setMonthStatus("empty");
        return;
      }
      const now = new Date();
      const month =
        lang === "en"
          ? now.toLocaleString("en-US", { month: "long", year: "numeric" })
          : `${now.getFullYear()} 年 ${now.getMonth() + 1} 月`;
      const studentName = user.displayName || user.email?.split("@")[0] || "";
      const analysis = await analyzeMonthWithGemini({
        lang,
        studentName,
        month,
        tests,
      });
      if (!analysis) {
        setMonthStatus("error");
        return;
      }
      await sendParentMonthlyEmail({
        to: parentEmail,
        lang,
        studentName,
        month,
        testCount: tests.length,
        analysis,
      });
      setMonthStatus("sent");
    } catch {
      setMonthStatus("error");
    }
  };
  const isMidnight = isDarkBackground(equipped.background);
  const ink = isMidnight ? "text-white" : "text-ink";
  const muted = isMidnight ? "text-slate-300" : "text-muted";
  const brand = isMidnight ? "text-sky-300" : "text-brand";
  const brandDark = isMidnight ? "text-sky-200" : "text-brand-dark";

  useEffect(() => {
    const html = document.documentElement;
    const { body } = document;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  return (
    <main className="relative h-[calc(100vh-3.5rem)] overflow-hidden">
      {/* Data buttons — top-left of pink area */}
      {user && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2 sm:top-4 sm:left-4">
          {!isAdmin && (
          <button
            type="button"
            onClick={() => setShowDaily(true)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-base font-semibold shadow-sm backdrop-blur transition ${
              claimedToday
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-700"
                : "border-orange-300 bg-orange-50/95 text-orange-800 hover:border-orange-400"
            }`}
            title={t.home.checkin}
            aria-label={t.home.checkin}
          >
            <span className="font-black">{claimedToday ? "✓" : "+"}</span>
            <span className="hidden sm:inline">
              {claimedToday ? t.home.days(loginStreak) : t.home.checkin}
            </span>
          </button>
          )}
          <button
            type="button"
            onClick={() => setShowCalendar(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-base font-semibold text-muted shadow-sm backdrop-blur transition hover:border-brand hover:text-brand-dark"
            title={t.home.calendar}
            aria-label={t.home.calendar}
          >
            <CalendarIcon className="h-5 w-5" />
            <span className="hidden sm:inline">{t.home.calendar}</span>
          </button>
          {!isAdmin && (
            <button
              type="button"
              onClick={sendMonthReport}
              disabled={monthStatus === "sending"}
              className="inline-flex max-w-[14rem] items-center rounded-full border border-violet-300 bg-white/90 px-4 py-2 text-left text-sm font-semibold text-violet-900 shadow-sm backdrop-blur transition hover:border-violet-500 disabled:opacity-60 sm:max-w-none sm:text-base"
              title={t.home.monthReport}
            >
              {monthStatus === "sending" ? t.home.monthSending : t.home.monthReport}
            </button>
          )}
        </div>
      )}
      {user && !isAdmin && monthStatus && monthStatus !== "sending" && (
        <p
          className={`absolute top-16 left-3 z-20 max-w-xs rounded-2xl border px-3 py-2 text-sm font-semibold shadow-sm backdrop-blur sm:top-[4.5rem] sm:left-4 ${
            monthStatus === "sent"
              ? "border-emerald-200 bg-emerald-50/95 text-emerald-800"
              : monthStatus === "error"
                ? "border-rose-200 bg-rose-50/95 text-rose-700"
                : "border-amber-200 bg-amber-50/95 text-amber-900"
          }`}
        >
          {monthStatus === "sent" && t.home.monthSent(parentEmail)}
          {monthStatus === "empty" && t.home.monthEmpty}
          {monthStatus === "need-email" && t.home.monthNeedEmail}
          {monthStatus === "error" && t.home.monthError}
        </p>
      )}

      {/* Shop — top-right of pink area */}
      <Link
        to="/shop"
        className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-base font-semibold text-muted shadow-sm backdrop-blur transition hover:border-amber-400 hover:text-amber-800 sm:top-4 sm:right-4"
        title={t.home.shop}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-[11px] font-black text-white">
          T
        </span>
        <span className="hidden sm:inline">{t.home.shop}</span>
        {user ? (
          <span className="font-bold text-amber-700">{isAdmin ? "∞" : tokens}</span>
        ) : null}
      </Link>

      <section className="relative mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-8 text-center">
        <div className="relative mb-8 animate-[fadeUp_0.6s_ease]">
          <img
            src="/logo.png"
            alt="CSK PHC · Jucunditas Ac Servitium"
            className="mx-auto h-36 w-36 object-contain drop-shadow-xl sm:h-44 sm:w-44"
          />
          <div
            className="pointer-events-none absolute -inset-5 animate-[orbit_18s_linear_infinite] rounded-full border border-dashed border-brand/30"
            aria-hidden="true"
          />
        </div>

        <p
          className={`mb-3 font-mono text-base font-bold uppercase tracking-[0.22em] ${brandDark} ${
            equipped.background === "bg-sakura"
              ? "drop-shadow-[0_1px_8px_rgba(255,255,255,0.95)]"
              : ""
          }`}
        >
          Science · Technology · Engineering · Mathematics
        </p>
        <h1
          className={`mb-4 text-6xl font-bold leading-tight tracking-tight sm:text-7xl md:text-8xl ${ink} ${
            equipped.background === "bg-sakura"
              ? "drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]"
              : ""
          }`}
        >
          Code<span className={brand}>Kids</span>
          <span
            className={`mt-2 block text-3xl font-semibold sm:text-4xl ${muted}`}
          >
            {t.home.tagline}
          </span>
        </h1>
        <div className="mt-8 flex flex-wrap justify-center animate-[fadeUp_0.85s_ease]">
          <Link
            to="/stem"
            className={`rounded-xl border px-12 py-5 text-xl font-bold backdrop-blur transition hover:border-brand ${
              isMidnight
                ? "border-white/20 bg-white/10 text-white hover:text-sky-200"
                : "border-slate-300 bg-white/80 text-ink hover:text-brand-dark"
            }`}
          >
            {t.home.start}
          </Link>
        </div>
      </section>

      {user && (
        <PracticeCalendar
          open={showCalendar}
          onClose={() => setShowCalendar(false)}
          uid={user.uid}
        />
      )}
    </main>
  );
}
