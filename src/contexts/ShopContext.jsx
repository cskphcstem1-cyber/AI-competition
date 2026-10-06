import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  runTransaction,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";
import { isAdminEmail } from "../lib/admin";
import { dateKey } from "../lib/practiceLog";
import {
  DEFAULT_EQUIPPED,
  DEFAULT_OWNED,
  getShopItem,
  tokensForAnswer,
  tokensForDailyLogin,
} from "../data/shopItems";
import { SHOP_EN } from "../i18n/ui";

const ShopContext = createContext(null);
const TOKEN_GRANT_ACCOUNT = "cskphc_stem_1";
const TOKEN_GRANT_FLAG = "grantTokens1000_v1";
const TOKEN_GRANT_AMOUNT = 1000;

function shopLangIsEn() {
  try {
    const stored =
      localStorage.getItem("codekids-lang") ||
      localStorage.getItem("compare-lang");
    return stored === "en";
  } catch {
    return false;
  }
}

function shopMsg(zh, en) {
  return shopLangIsEn() ? en : zh;
}

function shopItemName(item) {
  if (shopLangIsEn() && SHOP_EN[item.id]?.name) return SHOP_EN[item.id].name;
  return item.name;
}

function normalizeEquipped(raw) {
  const background =
    raw?.background && typeof raw.background === "string"
      ? raw.background
      : DEFAULT_EQUIPPED.background;
  const decorations = Array.isArray(raw?.decorations)
    ? raw.decorations.filter((id) => typeof id === "string")
    : [];
  return { background, decorations };
}

function yesterdayKey(from = new Date()) {
  const d = new Date(from);
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}

function nextStreak(lastLoginDate, currentStreak) {
  const today = dateKey();
  const yesterday = yesterdayKey();
  if (lastLoginDate === today) {
    return Math.max(1, Number(currentStreak) || 1);
  }
  if (lastLoginDate === yesterday) {
    return Math.max(1, (Number(currentStreak) || 0) + 1);
  }
  return 1;
}

export function ShopProvider({ children }) {
  const { user, isAdmin } = useAuth();
  const [tokens, setTokens] = useState(0);
  const [ownedItems, setOwnedItems] = useState(DEFAULT_OWNED);
  const [equipped, setEquipped] = useState(DEFAULT_EQUIPPED);
  const [loginStreak, setLoginStreak] = useState(0);
  const [lastLoginDate, setLastLoginDate] = useState(null);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDaily, setShowDaily] = useState(false);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (!user) {
      setTokens(0);
      setOwnedItems(DEFAULT_OWNED);
      setEquipped(DEFAULT_EQUIPPED);
      setLoginStreak(0);
      setLastLoginDate(null);
      setShowDaily(false);
      setReady(true);
      return undefined;
    }

    setReady(false);
    const ref = doc(db, "users", user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setTokens(0);
          setOwnedItems(DEFAULT_OWNED);
          setEquipped(DEFAULT_EQUIPPED);
          setLoginStreak(0);
          setLastLoginDate(null);
          setReady(true);
          return;
        }
        const data = snap.data();
        setTokens(Number(data.tokens) || 0);
        const owned = Array.isArray(data.ownedItems)
          ? [...new Set([...DEFAULT_OWNED, ...data.ownedItems])]
          : DEFAULT_OWNED;
        setOwnedItems(owned);
        setEquipped(normalizeEquipped(data.equipped));
        const last = data.lastLoginDate || null;
        const streak = Number(data.loginStreak) || 0;
        setLastLoginDate(last);
        setLoginStreak(streak);
        setReady(true);
      },
      () => setReady(true),
    );
    return unsub;
  }, [user]);

  const claimedToday = Boolean(lastLoginDate && lastLoginDate === dateKey());
  const previewStreak = claimedToday
    ? Math.max(1, loginStreak)
    : nextStreak(lastLoginDate, loginStreak);
  const previewReward = tokensForDailyLogin(previewStreak);

  useEffect(() => {
    if (!ready || !user || isAdmin) return;
    if (!claimedToday) setShowDaily(true);
  }, [ready, user, isAdmin, claimedToday]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(t);
  }, [toast]);

  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  // One-time +1000 token grant for cskphc_stem_1
  useEffect(() => {
    if (!ready || !user) return;
    const name = (user.displayName || "").trim();
    const emailName = (user.email || "").split("@")[0];
    if (name !== TOKEN_GRANT_ACCOUNT && emailName !== TOKEN_GRANT_ACCOUNT) {
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (cancelled || !snap.exists()) return;
        if (snap.data()[TOKEN_GRANT_FLAG]) return;
        await updateDoc(ref, {
          tokens: increment(TOKEN_GRANT_AMOUNT),
          [TOKEN_GRANT_FLAG]: true,
        });
        if (!cancelled) showToast(shopMsg(`+${TOKEN_GRANT_AMOUNT} 代幣已發放`, `+${TOKEN_GRANT_AMOUNT} tokens added`));
      } catch (err) {
        console.warn("token grant failed", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, user, showToast]);

  const awardTokens = useCallback(
    async (correct) => {
      if (!user) return 0;
      const amount = tokensForAnswer(correct);
      try {
        const applied = await runTransaction(db, async (tx) => {
          const ref = doc(db, "users", user.uid);
          const snap = await tx.get(ref);
          if (!snap.exists()) return 0;
          const balance = Number(snap.data()?.tokens) || 0;
          const next = Math.max(0, balance + amount);
          const delta = next - balance;
          if (delta !== 0) {
            tx.update(ref, { tokens: next });
          }
          return delta;
        });
        if (applied > 0) {
          showToast(shopMsg(`+${applied} 代幣`, `+${applied} tokens`));
        } else if (applied < 0) {
          showToast(shopMsg(`${applied} 代幣`, `${applied} tokens`));
        }
        return applied;
      } catch (err) {
        console.warn("award tokens failed", err);
      }
      return amount;
    },
    [user, showToast],
  );

  const claimDailyLogin = useCallback(async () => {
    if (!user) throw new Error(shopMsg("請先登入", "Please sign in first"));
    if (claiming) return null;
    setClaiming(true);
    try {
      const result = await runTransaction(db, async (tx) => {
        const ref = doc(db, "users", user.uid);
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error(shopMsg("帳號資料不存在", "Account data not found"));
        const data = snap.data();
        const today = dateKey();
        if (data.lastLoginDate === today) {
          return {
            already: true,
            streak: Number(data.loginStreak) || 1,
            reward: 0,
          };
        }
        const streak = nextStreak(data.lastLoginDate || null, data.loginStreak || 0);
        const reward = tokensForDailyLogin(streak);
        tx.update(ref, {
          tokens: increment(reward),
          lastLoginDate: today,
          loginStreak: streak,
          bestLoginStreak: Math.max(Number(data.bestLoginStreak) || 0, streak),
        });
        return { already: false, streak, reward };
      });

      if (result.already) {
        showToast(shopMsg("今天已經領過了", "You already claimed today"));
      } else {
        showToast(
          shopMsg(
            `每日登入 +${result.reward} 代幣 · ${result.streak} 天連續`,
            `Daily login +${result.reward} tokens · ${result.streak}-day streak`,
          ),
        );
      }
      setShowDaily(false);
      return result;
    } finally {
      setClaiming(false);
    }
  }, [user, claiming, showToast]);

  const buyItem = useCallback(
    async (itemId) => {
      if (!user) throw new Error(shopMsg("請先登入", "Please sign in first"));
      const item = getShopItem(itemId);
      if (!item) throw new Error(shopMsg("找不到商品", "Item not found"));
      if (item.kind === "real") throw new Error(shopMsg("實體獎品需由老師代為兌換", "A teacher must redeem real prizes"));
      if (item.price <= 0) throw new Error(shopMsg("此商品免費", "This item is free"));

      await runTransaction(db, async (tx) => {
        const ref = doc(db, "users", user.uid);
        const snap = await tx.get(ref);
        if (!snap.exists()) throw new Error(shopMsg("帳號資料不存在", "Account data not found"));
        const data = snap.data();
        const owned = Array.isArray(data.ownedItems) ? data.ownedItems : [];
        if (owned.includes(itemId) || DEFAULT_OWNED.includes(itemId)) {
          throw new Error(shopMsg("已經擁有此商品", "You already own this"));
        }
        if (isAdmin) {
          tx.update(ref, { ownedItems: arrayUnion(itemId) });
          return;
        }
        const balance = Number(data.tokens) || 0;
        if (balance < item.price) throw new Error(shopMsg("代幣不足", "Not enough tokens"));
        tx.update(ref, {
          tokens: balance - item.price,
          ownedItems: arrayUnion(itemId),
        });
      });
      showToast(shopMsg(`已購買：${item.name}`, `Bought: ${shopItemName(item)}`));
    },
    [user, isAdmin, showToast],
  );

  const buyRealForStudent = useCallback(
    async (itemId, username) => {
      if (!user || !isAdmin) throw new Error(shopMsg("只有老師可以代為兌換實體獎品", "Only a teacher can redeem real prizes"));
      const item = getShopItem(itemId);
      if (!item || item.kind !== "real") throw new Error(shopMsg("無效的實體獎品", "Invalid real prize"));
      const queryName = String(username || "").trim().toLowerCase();
      if (!queryName) throw new Error(shopMsg("請輸入學生暱稱或電郵", "Enter the student nickname or email"));

      const snap = await getDocs(collection(db, "users"));
      const people = snap.docs
        .map((entry) => ({ id: entry.id, ...entry.data() }))
        .filter((entry) => !isAdminEmail(entry.email));

      const exact = people.filter((entry) => {
        const email = String(entry.email || "").toLowerCase();
        const name = String(entry.displayName || "").trim().toLowerCase();
        const local = email.split("@")[0];
        return name === queryName || email === queryName || local === queryName;
      });
      const matches =
        exact.length > 0
          ? exact
          : people.filter((entry) => {
              const email = String(entry.email || "").toLowerCase();
              const name = String(entry.displayName || "").trim().toLowerCase();
              const local = email.split("@")[0];
              return (
                name.includes(queryName) ||
                email.includes(queryName) ||
                local.includes(queryName)
              );
            });

      if (matches.length === 0) {
        throw new Error(shopMsg("找不到此學生，請輸入完整暱稱或電郵", "Student not found. Type the full nickname or email"));
      }
      if (matches.length > 1) {
        throw new Error(shopMsg("找到多個帳戶，請輸入完整電郵", "Several accounts match. Type the full email"));
      }

      const target = matches[0];
      const nextBalance = await runTransaction(db, async (tx) => {
        const ref = doc(db, "users", target.id);
        const targetSnap = await tx.get(ref);
        if (!targetSnap.exists()) throw new Error(shopMsg("找不到此帳戶", "Account not found"));
        const data = targetSnap.data();
        const balance = Number(data.tokens) || 0;
        if (balance < item.price) {
          throw new Error(
            shopMsg(
              `${target.displayName || target.email} 代幣不足（現有 ${balance}）`,
              `${target.displayName || target.email} does not have enough tokens (now ${balance})`,
            ),
          );
        }
        const record = {
          itemId: item.id,
          name: item.name,
          price: item.price,
          at: new Date().toISOString(),
          adminEmail: user.email || "",
        };
        tx.update(ref, {
          tokens: balance - item.price,
          realPurchases: arrayUnion(record),
        });
        return balance - item.price;
      });

      const label = target.displayName || target.email || target.id;
      showToast(shopMsg(`已為 ${label} 兌換：${item.name}（剩餘 ${nextBalance}）`, `Redeemed ${shopItemName(item)} for ${label} (${nextBalance} left)`));
      return { student: target, remaining: nextBalance, item };
    },
    [user, isAdmin, showToast],
  );

  const equipBackground = useCallback(
    async (itemId) => {
      if (!user) throw new Error(shopMsg("請先登入", "Please sign in first"));
      const item = getShopItem(itemId);
      if (!item || item.kind !== "background") throw new Error(shopMsg("無效背景", "Invalid background"));
      if (!ownedItems.includes(itemId) && !DEFAULT_OWNED.includes(itemId)) {
        throw new Error(shopMsg("尚未擁有", "You do not own this yet"));
      }
      await updateDoc(doc(db, "users", user.uid), {
        "equipped.background": itemId,
      });
      showToast(shopMsg(`已套用：${item.name}`, `Applied: ${shopItemName(item)}`));
    },
    [user, ownedItems, showToast],
  );

  const toggleDecoration = useCallback(
    async (itemId) => {
      if (!user) throw new Error(shopMsg("請先登入", "Please sign in first"));
      const item = getShopItem(itemId);
      if (!item || item.kind !== "cat") {
        throw new Error(shopMsg("無效裝飾", "Invalid decoration"));
      }
      if (!ownedItems.includes(itemId)) throw new Error(shopMsg("尚未擁有", "You do not own this yet"));

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const current = normalizeEquipped(snap.data()?.equipped);
      const wearing = current.decorations.includes(itemId);
      const withoutSlot = current.decorations.filter((id) => {
        if (id === itemId) return false;
        const other = getShopItem(id);
        return !other || other.slot !== item.slot;
      });
      const active = wearing ? withoutSlot : [...withoutSlot, itemId];

      await updateDoc(ref, {
        "equipped.decorations": active,
      });
      showToast(
        current.decorations.includes(itemId)
          ? shopMsg(`已關閉：${item.name}`, `Turned off: ${shopItemName(item)}`)
          : shopMsg(`已裝飾：${item.name}`, `Decorated: ${shopItemName(item)}`),
      );
    },
    [user, ownedItems, showToast],
  );

  const value = useMemo(
    () => ({
      tokens,
      ownedItems,
      equipped,
      ready,
      toast,
      loginStreak,
      lastLoginDate,
      claimedToday,
      previewStreak,
      previewReward,
      claiming,
      showDaily,
      setShowDaily,
      claimDailyLogin,
      awardTokens,
      buyItem,
      buyRealForStudent,
      equipBackground,
      toggleDecoration,
      isOwned: (id) => ownedItems.includes(id) || DEFAULT_OWNED.includes(id),
      isEquippedBg: (id) => equipped.background === id,
      isEquippedDec: (id) => equipped.decorations.includes(id),
    }),
    [
      tokens,
      ownedItems,
      equipped,
      ready,
      toast,
      loginStreak,
      lastLoginDate,
      claimedToday,
      previewStreak,
      previewReward,
      claiming,
      showDaily,
      claimDailyLogin,
      awardTokens,
      buyItem,
      buyRealForStudent,
      equipBackground,
      toggleDecoration,
    ],
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-lab px-5 py-2.5 text-sm font-bold text-white shadow-lg">
          {toast}
        </div>
      )}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
}
