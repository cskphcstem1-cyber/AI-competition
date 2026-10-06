import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useShop } from "../contexts/ShopContext";
import { useLang } from "../contexts/LangContext";
import { SHOP_EN } from "../i18n/ui";
import HomeCat from "../components/HomeCat";
import {
  SHOP_ITEMS,
  TOKENS_CORRECT_BONUS,
  TOKENS_PER_ANSWER,
  TOKENS_WRONG_PENALTY,
  isDarkBackground,
} from "../data/shopItems";

function TokenBadge({ tokens, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-800">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-white">
        T
      </span>
      {label}
    </span>
  );
}

function shopCopy(item, lang) {
  if (lang === "en" && SHOP_EN[item.id]) return SHOP_EN[item.id];
  return { name: item.name, desc: item.desc };
}

export default function Shop() {
  const { user, isAdmin } = useAuth();
  const { lang, t } = useLang();
  const {
    tokens,
    ready,
    equipped,
    buyItem,
    buyRealForStudent,
    equipBackground,
    toggleDecoration,
    isOwned,
    isEquippedBg,
    isEquippedDec,
    claimedToday,
    loginStreak,
    previewReward,
    setShowDaily,
  } = useShop();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab =
    tabParam === "cat" || tabParam === "real" || tabParam === "background"
      ? tabParam
      : "background";
  const setTab = (next) => {
    setSearchParams(next === "background" ? {} : { tab: next });
  };
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedRealId, setSelectedRealId] = useState("");
  const [studentName, setStudentName] = useState("");
  const isDark = isDarkBackground(equipped.background);
  const ink = isDark ? "text-white" : "text-ink";
  const muted = isDark ? "text-slate-200" : "text-muted";
  const brand = isDark ? "text-sky-300" : "text-brand";

  const items = useMemo(
    () => SHOP_ITEMS.filter((item) => item.kind === tab),
    [tab],
  );

  const act = async (item) => {
    if (item.kind === "real") {
      if (!isAdmin) return;
      setSelectedRealId(item.id);
      setError("");
      setNotice("");
      return;
    }
    if (!user) {
      setError(t.shop.askLogin);
      return;
    }
    setError("");
    setBusyId(item.id);
    try {
      if (!isOwned(item.id)) {
        await buyItem(item.id);
      }
      if (item.kind === "background") {
        await equipBackground(item.id);
      } else if (item.kind === "cat") {
        await toggleDecoration(item.id);
      }
    } catch (err) {
      setError(err?.message || "操作失敗");
    } finally {
      setBusyId(null);
    }
  };

  const redeemReal = async (e) => {
    e.preventDefault();
    if (!selectedRealId) {
      setError(t.shop.pickFirst);
      return;
    }
    setError("");
    setNotice("");
    setBusyId(selectedRealId);
    try {
      const result = await buyRealForStudent(selectedRealId, studentName);
      const label = result.student.displayName || result.student.email;
      const prize = shopCopy(result.item, lang).name;
      setNotice(
        lang === "en"
          ? `Redeemed “${prize}” for ${label}. ${result.remaining} tokens left. Give the prize to the student.`
          : `已為 ${label} 兌換「${result.item.name}」，剩餘 ${result.remaining} 代幣。請把實體物品交給學生。`,
      );
      setStudentName("");
    } catch (err) {
      setError(err?.message || "兌換失敗");
    } finally {
      setBusyId(null);
    }
  };

  const buttonLabel = (item) => {
    if (item.kind === "real") {
      if (!isAdmin) return t.shop.askTeacher;
      return selectedRealId === item.id ? t.shop.selected : t.shop.selectPrize;
    }
    if (!isOwned(item.id)) return t.shop.buy(item.price);
    if (item.kind === "background") {
      return isEquippedBg(item.id) ? t.shop.using : t.shop.applyBg;
    }
    if (item.kind === "cat") {
      return isEquippedDec(item.id) ? t.shop.offDec : t.shop.applyDec;
    }
    return t.shop.buy(item.price);
  };

  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className={`text-xs font-bold uppercase tracking-[0.18em] ${brand}`}>
              Token Shop
            </p>
            <h1 className={`mt-1 text-3xl font-bold tracking-tight sm:text-4xl ${ink}`}>
              {t.shop.title}
            </h1>
            <p className={`mt-2 max-w-xl text-sm sm:text-base ${muted}`}>
              {t.shop.intro(TOKENS_PER_ANSWER, TOKENS_CORRECT_BONUS, TOKENS_WRONG_PENALTY)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TokenBadge
              tokens={ready ? (isAdmin ? "∞" : tokens) : "…"}
              label={t.shop.tokens(ready ? (isAdmin ? "∞" : tokens) : "…")}
            />
            {user && !isAdmin && (
              <button
                type="button"
                onClick={() => setShowDaily(true)}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold shadow-sm ${
                  claimedToday
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-orange-300 bg-orange-50 text-orange-800"
                }`}
              >
                {claimedToday
                  ? t.shop.checked(loginStreak)
                  : t.shop.daily(previewReward)}
              </button>
            )}
            <Link
              to="/"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-ink shadow-sm transition hover:border-brand hover:text-brand-dark"
              title="主頁"
              aria-label="回到主頁"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 3.2 3.5 10.5a1 1 0 0 0-.3.7V20a1.5 1.5 0 0 0 1.5 1.5H9.2a.8.8 0 0 0 .8-.8V15a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v5.7a.8.8 0 0 0 .8.8h4.5A1.5 1.5 0 0 0 20.8 20v-8.8a1 1 0 0 0-.3-.7L12 3.2Z" />
              </svg>
            </Link>
          </div>
        </header>

        {!user && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            {t.shop.loginHint}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {notice}
          </div>
        )}

        <div className={`mb-6 flex w-fit flex-wrap gap-2 rounded-full p-1 ${
          isDark ? "bg-white/15" : "bg-slate-100"
        }`}>
          <button
            type="button"
            onClick={() => setTab("background")}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              tab === "background"
                ? "bg-brand text-white shadow"
                : isDark
                  ? "text-slate-200 hover:text-white"
                  : "text-muted hover:text-ink"
            }`}
          >
            {t.shop.bg}
          </button>
          <button
            type="button"
            onClick={() => setTab("cat")}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              tab === "cat"
                ? "bg-brand text-white shadow"
                : isDark
                  ? "text-slate-200 hover:text-white"
                  : "text-muted hover:text-ink"
            }`}
          >
            {t.shop.cat}
          </button>
          <button
            type="button"
            onClick={() => setTab("real")}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              tab === "real"
                ? "bg-amber-500 text-white shadow"
                : isDark
                  ? "text-slate-200 hover:text-white"
                  : "text-muted hover:text-ink"
            }`}
          >
            {t.shop.real}
          </button>
        </div>

        {tab === "real" && (
          <p className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            {isAdmin ? t.shop.realAdmin : t.shop.realStudent}
          </p>
        )}
        {tab === "real" && isAdmin && (
          <form
            onSubmit={redeemReal}
            className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end"
          >
            <label className="min-w-0 flex-1 text-sm font-semibold text-ink">
              {t.shop.student}
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder={t.shop.studentPh}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium outline-none focus:border-brand"
              />
            </label>
            <p className="text-sm font-semibold text-amber-800 sm:pb-2">
              {selectedRealId
                ? t.shop.picked(
                    shopCopy(
                      SHOP_ITEMS.find((item) => item.id === selectedRealId) ||
                        { name: "", desc: "", id: selectedRealId },
                      lang,
                    ).name,
                  )
                : t.shop.noPick}
            </p>
            <button
              type="submit"
              disabled={!selectedRealId || busyId === selectedRealId}
              className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busyId === selectedRealId ? t.shop.redeeming : t.shop.confirmBuy}
            </button>
          </form>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const owned = item.kind !== "real" && isOwned(item.id);
            const active =
              item.kind === "real"
                ? selectedRealId === item.id
                : item.kind === "cat"
                  ? isEquippedDec(item.id)
                  : isEquippedBg(item.id);
            const realLocked = item.kind === "real" && !isAdmin;
            return (
              <article
                key={item.id}
                className={`flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm ${
                  active ? "border-brand ring-2 ring-brand/20" : "border-slate-200"
                }`}
              >
                <div
                  className={`relative flex h-28 items-center justify-center bg-gradient-to-br ${item.preview}`}
                >
                  {item.kind === "cat" ? (
                    <HomeCat decorations={[item.id]} size="sm" />
                  ) : item.glyph ? (
                    <span className="text-4xl drop-shadow">
                      {item.glyph}
                    </span>
                  ) : (
                    <span className="rounded-lg bg-white/70 px-3 py-1 text-xs font-bold text-ink backdrop-blur">
                      {t.shop.preview}
                    </span>
                  )}
                  {owned && (
                    <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-brand-dark">
                      {t.shop.owned}
                    </span>
                  )}
                  {item.kind === "real" && (
                    <span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      {t.shop.realTag}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h2 className="text-lg font-bold text-ink">
                    {shopCopy(item, lang).name}
                  </h2>
                  <p className="mb-4 text-sm text-muted">
                    {shopCopy(item, lang).desc}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-amber-700">
                      {item.price === 0 ? t.shop.free : t.shop.price(item.price)}
                    </span>
                    <button
                      type="button"
                      disabled={
                        busyId === item.id ||
                        realLocked ||
                        (owned && active && item.kind === "background")
                      }
                      onClick={() => act(item)}
                      className="rounded-xl bg-lab px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busyId === item.id ? t.shop.processing : buttonLabel(item)}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
