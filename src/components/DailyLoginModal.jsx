import {
  DAILY_LOGIN_BASE,
  DAILY_LOGIN_STREAK_BONUS,
} from "../data/shopItems";
import { useShop } from "../contexts/ShopContext";
import { useLang } from "../contexts/LangContext";

export default function DailyLoginModal() {
  const { t } = useLang();
  const {
    showDaily,
    setShowDaily,
    claimedToday,
    previewStreak,
    previewReward,
    loginStreak,
    claiming,
    claimDailyLogin,
  } = useShop();

  if (!showDaily) return null;

  const onClaim = async () => {
    try {
      await claimDailyLogin();
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      onClick={() => setShowDaily(false)}
      role="presentation"
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="daily-login-title"
      >
        <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 px-6 py-8 text-center text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
            Daily Check-in
          </p>
          <h2 id="daily-login-title" className="mt-2 text-2xl font-bold">
            {t.daily.title}
          </h2>
          <p className="mt-2 text-sm text-white/90">
            {t.daily.sub}
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/20 px-5 py-3 backdrop-blur">
            <span className="text-3xl font-black">{previewStreak}</span>
            <span className="text-left text-sm font-semibold leading-tight">
              {t.daily.streak}
              <br />
              <span className="text-white/85">{t.daily.today(previewReward)}</span>
            </span>
          </div>
        </div>

        <div className="space-y-4 p-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-bold">{t.daily.rules}</p>
            <p className="mt-1">
              {t.daily.ruleBody(DAILY_LOGIN_BASE, DAILY_LOGIN_STREAK_BONUS)}
            </p>
            {claimedToday ? (
              <p className="mt-2 font-semibold text-emerald-700">
                {t.daily.claimed(loginStreak)}
              </p>
            ) : (
              <p className="mt-2 font-semibold">
                {t.daily.tomorrow}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {!claimedToday ? (
              <button
                type="button"
                disabled={claiming}
                onClick={onClaim}
                className="flex-1 rounded-xl bg-amber-500 px-4 py-3 font-bold text-white shadow-md shadow-amber-500/25 transition hover:bg-amber-600 disabled:opacity-60"
              >
                {claiming ? t.daily.claiming : t.daily.claim(previewReward)}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowDaily(false)}
                className="flex-1 rounded-xl bg-lab px-4 py-3 font-bold text-white shadow-sm hover:bg-ink"
              >
                {t.daily.ok}
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowDaily(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-ink hover:border-brand"
            >
              {t.daily.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
