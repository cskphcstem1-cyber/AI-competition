import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const LOCAL_KEY = "bridgeLeaderboard_v2";

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal(entries) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(entries.slice(0, 400)));
  } catch {
    /* ignore */
  }
}

function sortByCostAsc(entries) {
  return [...entries].sort((a, b) => {
    if (a.cost !== b.cost) return a.cost - b.cost;
    return (a.at || 0) - (b.at || 0);
  });
}

function upsertLocal(entry) {
  const all = readLocal();
  const key = `${entry.levelId}__${entry.playerKey}`;
  const idx = all.findIndex(
    (e) => `${e.levelId}__${e.playerKey}` === key,
  );
  if (idx >= 0) {
    if (entry.cost < all[idx].cost) {
      all[idx] = { ...all[idx], ...entry };
    }
  } else {
    all.push(entry);
  }
  writeLocal(all);
  return sortByCostAsc(all.filter((e) => e.levelId === entry.levelId));
}

/**
 * Save a successful clear. Keeps the lowest cost per player per board key.
 * @returns {Promise<Array>} leaderboard for that board (cost low → high)
 */
export async function submitBridgeScore({
  levelId,
  cost,
  name,
  uid,
}) {
  const boardKey = String(levelId);
  const playerKey = uid || `guest:${String(name || "訪客").slice(0, 24)}`;
  const entry = {
    levelId: boardKey,
    cost: Math.max(0, Math.round(Number(cost) || 0)),
    name: String(name || "訪客").slice(0, 32),
    playerKey,
    uid: uid || null,
    at: Date.now(),
  };

  const localBoard = upsertLocal(entry);

  if (uid) {
    try {
      const ref = doc(db, "bridgeLeaderboard", `${boardKey}_${uid}`);
      const snap = await getDoc(ref);
      const prev = snap.exists() ? snap.data() : null;
      if (!prev || entry.cost < Number(prev.cost)) {
        await setDoc(
          ref,
          {
            levelId: boardKey,
            cost: entry.cost,
            name: entry.name,
            uid,
            at: entry.at,
          },
          { merge: true },
        );
      }
    } catch (err) {
      console.warn("bridge leaderboard cloud save failed", err);
    }
  }

  return fetchBridgeLeaderboard(boardKey, localBoard);
}

/** Merge cloud + local, unique by player, sort cost ascending */
export async function fetchBridgeLeaderboard(levelId, localHint) {
  const boardKey = String(levelId);
  const local = (localHint || readLocal()).filter((e) => e.levelId === boardKey);
  let cloud = [];

  try {
    const q = query(
      collection(db, "bridgeLeaderboard"),
      where("levelId", "==", boardKey),
    );
    const snap = await getDocs(q);
    cloud = snap.docs.map((d) => {
      const data = d.data();
      return {
        levelId: String(data.levelId),
        cost: Number(data.cost) || 0,
        name: data.name || "玩家",
        playerKey: data.uid || d.id,
        uid: data.uid || null,
        at: data.at || 0,
      };
    });
  } catch (err) {
    console.warn("bridge leaderboard fetch failed", err);
  }

  const map = new Map();
  [...local, ...cloud].forEach((e) => {
    const key = e.playerKey || e.uid || e.name;
    const prev = map.get(key);
    if (!prev || e.cost < prev.cost) map.set(key, e);
  });

  return sortByCostAsc([...map.values()]).slice(0, 20);
}
