import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import { ADMIN_EMAILS, formatTokenDisplay, isAdminEmail } from "../lib/admin";
import { useLang } from "../contexts/LangContext";
import { dateKey } from "../lib/practiceLog";
import PracticeCalendar from "../components/PracticeCalendar";

function parseAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.floor(amount);
}

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const { tx } = useLang();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const [search, setSearch] = useState("");
  const [amounts, setAmounts] = useState({});
  const [rowBusy, setRowBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [logUser, setLogUser] = useState(null);

  const loadUsers = async () => {
    try {
      const snap = await getDocs(
        query(collection(db, "users"), orderBy("createdAt", "desc"))
      );
      return snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
    } catch {
      const snap = await getDocs(collection(db, "users"));
      return snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      setBusy(false);
      return undefined;
    }

    let cancelled = false;
    (async () => {
      setBusy(true);
      setError("");
      try {
        const list = await loadUsers();
        if (!cancelled) setUsers(list);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.code === "permission-denied"
              ? tx(
                  "Firestore 拒絕讀取或修改帳戶。請在 Firebase Console 發佈最新 firestore.rules。",
                  "Firestore blocked reading or changing accounts. Publish the latest firestore.rules in Firebase Console.",
                )
              : err?.message || tx("無法載入帳戶列表", "Could not load the account list")
          );
        }
      } finally {
        if (!cancelled) setBusy(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const visibleUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((item) => {
      const email = String(item.email || "").toLowerCase();
      const name = String(item.displayName || "").toLowerCase();
      return email.includes(q) || name.includes(q);
    });
  }, [users, search]);

  const adjustTokens = async (target, deltaSign) => {
    if (isAdminEmail(target.email)) {
      setNotice(tx("管理員代幣為無限，無需加減。", "Admin tokens are unlimited. No need to add or subtract."));
      return;
    }
    const amount = parseAmount(amounts[target.id] ?? "10");
    if (!amount) {
      setError(tx("請輸入大於 0 的整數代幣數量。", "Enter a whole number of tokens greater than 0."));
      return;
    }
    const delta = amount * deltaSign;
    const addLabel = tx(`管理員增加 ${amount} 代幣`, `Admin added ${amount} tokens`);
    const removeLabel = tx(`管理員扣除 ${amount} 代幣`, `Admin removed ${amount} tokens`);
    const missingAccount = tx("找不到此帳戶", "Account not found");
    setError("");
    setNotice("");
    setRowBusy(target.id);
    try {
      const nextBalance = await runTransaction(db, async (dbTx) => {
        const ref = doc(db, "users", target.id);
        const snap = await dbTx.get(ref);
        if (!snap.exists()) throw new Error(missingAccount);
        const current = Number(snap.data().tokens) || 0;
        const next = Math.max(0, current + delta);
        dbTx.update(ref, {
          tokens: next,
          [`practiceLog.${dateKey()}`]: arrayUnion({
            subject: "other",
            label: delta > 0 ? addLabel : removeLabel,
            detail: user?.email || "",
            score: null,
            total: null,
            at: Date.now(),
          }),
        });
        return next;
      });
      setUsers((prev) =>
        prev.map((item) =>
          item.id === target.id ? { ...item, tokens: nextBalance } : item
        )
      );
      const label = target.displayName || target.email || target.id;
      setNotice(
        delta > 0
          ? tx(`已為 ${label} 增加 ${amount} 代幣（現為 ${nextBalance}）`, `Added ${amount} tokens for ${label} (now ${nextBalance})`)
          : tx(`已從 ${label} 扣除 ${amount} 代幣（現為 ${nextBalance}）`, `Removed ${amount} tokens from ${label} (now ${nextBalance})`)
      );
    } catch (err) {
      setError(
        err?.code === "permission-denied"
          ? tx("無法改代幣：請把 firestore.rules 貼到 Firebase Console 並發佈。", "Cannot change tokens: paste firestore.rules into Firebase Console and publish.")
          : err?.message || tx("無法更新代幣", "Could not update tokens")
      );
    } finally {
      setRowBusy("");
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16 text-center text-muted">
        {tx("載入中…", "Loading…")}
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-ink">{tx("沒有管理員權限", "No admin access")}</h1>
        <p className="mt-3 text-muted">
          {tx(`目前登入的是 ${user.email}。管理員電郵為 `, `Signed in as ${user.email}. Admin emails: `)}
          {ADMIN_EMAILS.join(", ")}.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full bg-lab px-5 py-2 text-sm font-bold text-white"
        >
          {tx("返回首頁", "Back to home")}
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
      <p className="text-xl font-bold uppercase tracking-[0.16em] text-brand">
        Admin
      </p>
      <h1 className="mt-2 text-4xl font-bold text-ink">{tx("管理員後台", "Admin desk")}</h1>
      <p className="mt-3 text-lg text-muted">
        {tx("已以管理員身分登入：", "Signed in as admin: ")}
        <span className="font-semibold text-ink"> {user.email}</span>
        {tx("，代幣為 ", ", tokens: ")}
        <span className="text-xl font-bold text-amber-700">∞</span>
      </p>

      {error && (
        <p className="mt-5 rounded-2xl bg-coral/10 px-4 py-3 text-base font-semibold text-coral-dark">
          {error}
        </p>
      )}
      {notice && (
        <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-base font-semibold text-emerald-800">
          {notice}
        </p>
      )}

      <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-ink">{tx("帳戶代幣", "Account tokens")}</h2>
            <p className="mt-1 text-base text-muted">
              {busy ? tx("讀取中…", "Loading…") : tx(`共 ${visibleUsers.length} 個帳戶`, `${visibleUsers.length} accounts`)}
            </p>
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tx("搜尋電郵或暱稱", "Search email or nickname")}
            className="w-full max-w-sm rounded-full border border-slate-200 px-4 py-2.5 text-base outline-none focus:border-brand"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-base">
            <thead className="bg-slate-50 text-muted">
              <tr>
                <th className="px-6 py-4 text-sm font-bold">{tx("電郵", "Email")}</th>
                <th className="px-6 py-4 text-sm font-bold">{tx("暱稱", "Nickname")}</th>
                <th className="px-6 py-4 text-sm font-bold">{tx("角色", "Role")}</th>
                <th className="px-6 py-4 text-sm font-bold">{tx("代幣", "Tokens")}</th>
                <th className="px-6 py-4 text-sm font-bold">{tx("加減代幣", "Add / remove")}</th>
                <th className="px-6 py-4 text-sm font-bold">{tx("活動", "Activity")}</th>
              </tr>
            </thead>
            <tbody>
              {visibleUsers.map((item) => {
                const adminRow = isAdminEmail(item.email);
                return (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-6 py-4 font-medium text-ink">
                      {item.email || "—"}
                    </td>
                    <td className="px-6 py-4 text-muted">
                      {item.displayName || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-bold ${
                          adminRow
                            ? "bg-brand/15 text-brand-dark"
                            : "bg-slate-100 text-muted"
                        }`}
                      >
                        {adminRow ? tx("管理員", "Admin") : tx("學生", "Student")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xl font-bold text-amber-700">
                      {formatTokenDisplay(item.email, item.tokens)}
                    </td>
                    <td className="px-6 py-4">
                      {adminRow ? (
                        <span className="text-sm text-muted">{tx("無限代幣", "Unlimited tokens")}</span>
                      ) : (
                        <div className="flex flex-wrap items-center gap-2.5">
                          <input
                            type="number"
                            min="1"
                            step="1"
                            value={amounts[item.id] ?? "10"}
                            onChange={(e) =>
                              setAmounts((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                            className="w-24 rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-brand"
                            aria-label={tx(`代幣數量 ${item.email}`, `Token amount ${item.email}`)}
                          />
                          <button
                            type="button"
                            disabled={rowBusy === item.id}
                            onClick={() => adjustTokens(item, 1)}
                            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
                          >
                            {tx("增加", "Add")}
                          </button>
                          <button
                            type="button"
                            disabled={rowBusy === item.id}
                            onClick={() => adjustTokens(item, -1)}
                            className="rounded-full bg-coral px-4 py-2 text-sm font-bold text-white hover:bg-coral-dark disabled:opacity-60"
                          >
                            {tx("扣除", "Remove")}
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setLogUser(item)}
                        className="rounded-full border border-brand/40 bg-brand-soft px-4 py-2 text-sm font-bold text-brand-dark hover:border-brand"
                      >
                        {tx("活動紀錄", "Activity log")}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!busy && visibleUsers.length === 0 && !error && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-base text-muted"
                  >
                    {tx("尚未有註冊帳戶，或規則尚未允許讀取。", "No accounts yet, or the rules do not allow reading.")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <PracticeCalendar
        open={Boolean(logUser)}
        onClose={() => setLogUser(null)}
        uid={logUser?.id}
        subtitle={
          logUser
            ? tx(
                `查看 ${logUser.displayName || logUser.email} 每天完成的練習、測驗與代幣異動`,
                `See practice, quizzes, and token changes for ${logUser.displayName || logUser.email}`,
              )
            : undefined
        }
      />
    </main>
  );
}
