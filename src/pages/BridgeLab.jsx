import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLang } from "../contexts/LangContext";
import {
  fetchBridgeLeaderboard,
  submitBridgeScore,
} from "../lib/bridgeLeaderboard";

/**
 * Kid-friendly Poly Bridge–style lab:
 * snap joints on a grid, connect with wood/steel/cable, stay in budget, test the crossing.
 */

const W = 960;
const H = 440;
const GROUND_Y = 340;
const WATER_TOP = 300;

const MATERIALS = {
  wood: {
    id: "wood",
    label: "木樑",
    labelEn: "Wood",
    costPerPx: 0.35,
    strength: 110,
    color: "#b45309",
    dash: null,
  },
  steel: {
    id: "steel",
    label: "鋼樑",
    labelEn: "Steel",
    costPerPx: 0.7,
    strength: 240,
    color: "#334155",
    dash: null,
  },
  cable: {
    id: "cable",
    label: "纜線",
    labelEn: "Cable",
    costPerPx: 0.22,
    strength: 90,
    color: "#0f766e",
    dash: "7 5",
  },
};

/**
 * Budgets sized so a solid clear typically spends ~70% (≈30% left).
 * Higher difficulty → wider gap, heavier car, fewer piers.
 */
const DIFFICULTIES = [
  {
    id: 1,
    name: "入門",
    nameEn: "Intro",
    color: "bg-emerald-500",
    levels: [
      {
        id: 1,
        name: "小溪木橋",
        nameEn: "Creek wood bridge",
        gap: 200,
        pier: true,
        carWeight: 80,
        budget: 360,
        message: "短跨距、有橋墩——用木樑輕輕連起來。",
        messageEn: "Short span with a pier — join the banks with wood.",
      },
      {
        id: 2,
        name: "河谷通車",
        nameEn: "Valley crossing",
        gap: 240,
        pier: true,
        carWeight: 95,
        budget: 450,
        message: "跨距稍大，試著做簡單的三角形支撐。",
        messageEn: "A bit wider. Try a simple triangle support.",
      },
      {
        id: 3,
        name: "雙岸相連",
        nameEn: "Join both banks",
        gap: 280,
        pier: true,
        carWeight: 110,
        budget: 540,
        message: "預算充足：完成後大約還會剩三成左右。",
        messageEn: "Plenty of budget: you should have about 30% left.",
      },
    ],
  },
  {
    id: 2,
    name: "簡單",
    nameEn: "Easy",
    color: "bg-sky-500",
    levels: [
      {
        id: 1,
        name: "河岸練習",
        nameEn: "Riverbank practice",
        gap: 280,
        pier: true,
        carWeight: 115,
        budget: 580,
        message: "跨距拉長了，注意材料選擇。",
        messageEn: "The span is longer. Choose materials carefully.",
      },
      {
        id: 2,
        name: "寬溪挑戰",
        nameEn: "Wide creek",
        gap: 320,
        pier: true,
        carWeight: 130,
        budget: 680,
        message: "車子變重了——木樑不夠就加鋼樑。",
        messageEn: "The car is heavier — add steel if wood is not enough.",
      },
      {
        id: 3,
        name: "穩固通途",
        nameEn: "Steady crossing",
        gap: 360,
        pier: true,
        carWeight: 145,
        budget: 780,
        message: "把結構做得穩，預算仍會剩約 30%。",
        messageEn: "Make it strong and still keep about 30% budget.",
      },
    ],
  },
  {
    id: 3,
    name: "普通",
    nameEn: "Normal",
    color: "bg-amber-500",
    levels: [
      {
        id: 1,
        name: "中河架橋",
        nameEn: "Mid river",
        gap: 340,
        pier: true,
        carWeight: 150,
        budget: 820,
        message: "普通難度起步：橋墩還在，好好利用。",
        messageEn: "Normal start: the pier is still there — use it.",
      },
      {
        id: 2,
        name: "無墩跨越",
        nameEn: "No-pier span",
        gap: 380,
        pier: false,
        carWeight: 165,
        budget: 980,
        message: "沒有中間橋墩了！靠自己搭支撐。",
        messageEn: "No middle pier! Build your own support.",
      },
      {
        id: 3,
        name: "重載通道",
        nameEn: "Heavy load",
        gap: 420,
        pier: false,
        carWeight: 180,
        budget: 1140,
        message: "重車過橋——鋼樑與三角形結構很重要。",
        messageEn: "A heavy car — steel and triangles matter.",
      },
    ],
  },
  {
    id: 4,
    name: "困難",
    nameEn: "Hard",
    color: "bg-orange-500",
    levels: [
      {
        id: 1,
        name: "峽谷起步",
        nameEn: "Canyon start",
        gap: 400,
        pier: false,
        carWeight: 185,
        budget: 1240,
        message: "寬河谷、無橋墩，預算已提高。",
        messageEn: "Wide valley, no pier, but a bigger budget.",
      },
      {
        id: 2,
        name: "長跨挑戰",
        nameEn: "Long span",
        gap: 440,
        pier: false,
        carWeight: 205,
        budget: 1420,
        message: "更長的跨距，小心受力集中。",
        messageEn: "A longer span. Watch for stress in one place.",
      },
      {
        id: 3,
        name: "重卡過峽",
        nameEn: "Truck canyon",
        gap: 480,
        pier: false,
        carWeight: 225,
        budget: 1620,
        message: "重型車 + 長跨距——省錢也能過關。",
        messageEn: "Heavy truck + long span — save money and still pass.",
      },
    ],
  },
  {
    id: 5,
    name: "專家",
    nameEn: "Expert",
    color: "bg-rose-600",
    levels: [
      {
        id: 1,
        name: "大峽起步",
        nameEn: "Big canyon",
        gap: 460,
        pier: false,
        carWeight: 230,
        budget: 1720,
        message: "專家級：超長跨距，預算很充足。",
        messageEn: "Expert: extra-long span with a big budget.",
      },
      {
        id: 2,
        name: "天塹通途",
        nameEn: "Cliff crossing",
        gap: 500,
        pier: false,
        carWeight: 250,
        budget: 1960,
        message: "幾乎滿屏的河面——規劃好每一分預算。",
        messageEn: "The river fills the screen — plan every dollar.",
      },
      {
        id: 3,
        name: "終極造橋",
        nameEn: "Final bridge",
        gap: 540,
        pier: false,
        carWeight: 270,
        budget: 2200,
        message: "最終關：最強結構 × 最省造價。",
        messageEn: "Final level: strongest design, lowest cost.",
      },
    ],
  },
];

function boardKey(diffId, levelId) {
  return `d${diffId}-l${levelId}`;
}

function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function makeLevelNodes({ gap, pier }) {
  const leftX = (W - gap) / 2 - 20;
  const rightX = leftX + gap + 40;

  /** @type {{id:string,x:number,y:number,fixed:boolean,anchor?:'left'|'right'}[]} */
  const fixed = [
    { id: "L0", x: leftX - 30, y: GROUND_Y, fixed: true, anchor: "left" },
    { id: "L1", x: leftX, y: GROUND_Y, fixed: true, anchor: "left" },
    { id: "L2", x: leftX, y: GROUND_Y - 70, fixed: true, anchor: "left" },
    { id: "R0", x: rightX, y: GROUND_Y, fixed: true, anchor: "right" },
    { id: "R1", x: rightX + 30, y: GROUND_Y, fixed: true, anchor: "right" },
    { id: "R2", x: rightX, y: GROUND_Y - 70, fixed: true, anchor: "right" },
  ];

  if (pier) {
    fixed.push({
      id: "P0",
      x: W / 2,
      y: GROUND_Y,
      fixed: true,
    });
  }

  return { fixed, leftX, rightX, gap, pier: !!pier };
}

function snapToGrid(x, y) {
  const gx = Math.round(x / 40) * 40;
  const gy = Math.round(y / 40) * 40;
  return {
    x: Math.max(80, Math.min(W - 80, gx)),
    y: Math.max(80, Math.min(GROUND_Y - 20, gy)),
  };
}

function beamCost(mat, length) {
  return Math.ceil(length * mat.costPerPx);
}

function buildAdj(nodes, beams) {
  const map = new Map(nodes.map((n) => [n.id, []]));
  beams.forEach((b) => {
    if (!map.has(b.a) || !map.has(b.b)) return;
    map.get(b.a).push({ to: b.b, beamId: b.id });
    map.get(b.b).push({ to: b.a, beamId: b.id });
  });
  return map;
}

function shortestPath(nodes, beams, fromIds, toIds) {
  const adj = buildAdj(nodes, beams);
  const goals = new Set(toIds);
  const start = fromIds.find((id) => adj.has(id));
  if (!start) return null;

  const prev = new Map();
  const prevBeam = new Map();
  const distMap = new Map([[start, 0]]);
  const pq = [[0, start]];

  while (pq.length) {
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift();
    if (goals.has(u)) {
      const nodePath = [u];
      const beamPath = [];
      let cur = u;
      while (prev.has(cur)) {
        beamPath.push(prevBeam.get(cur));
        cur = prev.get(cur);
        nodePath.push(cur);
      }
      nodePath.reverse();
      beamPath.reverse();
      return { nodePath, beamPath };
    }
    if (d !== distMap.get(u)) continue;
    const nodeU = nodes.find((n) => n.id === u);
    for (const edge of adj.get(u) || []) {
      const nodeV = nodes.find((n) => n.id === edge.to);
      if (!nodeU || !nodeV) continue;
      const nd = d + dist(nodeU, nodeV);
      if (nd < (distMap.get(edge.to) ?? Infinity)) {
        distMap.set(edge.to, nd);
        prev.set(edge.to, u);
        prevBeam.set(edge.to, edge.beamId);
        pq.push([nd, edge.to]);
      }
    }
  }
  return null;
}

function stressColor(ratio) {
  if (ratio < 0.45) return "#22c55e";
  if (ratio < 0.75) return "#eab308";
  if (ratio < 1) return "#f97316";
  return "#ef4444";
}

export default function BridgeLab() {
  const { user } = useAuth();
  const { lang, tx } = useLang();
  const locName = (obj) => (lang === "en" && obj.nameEn ? obj.nameEn : obj.name);
  const locMsg = (obj) =>
    lang === "en" && obj.messageEn ? obj.messageEn : obj.message;
  const locLabel = (obj) =>
    lang === "en" && obj.labelEn ? obj.labelEn : obj.label;
  const [diffId, setDiffId] = useState(1);
  const [levelId, setLevelId] = useState(1);
  const difficulty = DIFFICULTIES[diffId - 1];
  const level = difficulty.levels[levelId - 1];
  const boardId = boardKey(diffId, levelId);
  const layout = useMemo(
    () => makeLevelNodes({ gap: level.gap, pier: level.pier }),
    [level.gap, level.pier],
  );

  const [nodes, setNodes] = useState(() => [...layout.fixed]);
  const [beams, setBeams] = useState([]);
  const [material, setMaterial] = useState("wood");
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("build"); // build | test | result
  const [message, setMessage] = useState(level.message);
  const [stress, setStress] = useState({});
  const [broken, setBroken] = useState(new Set());
  const [carT, setCarT] = useState(0);
  const [path, setPath] = useState(null);
  const [result, setResult] = useState(null); // win | lose
  const [leaderboard, setLeaderboard] = useState([]);
  const [boardLoading, setBoardLoading] = useState(false);
  const [lastSubmittedCost, setLastSubmittedCost] = useState(null);
  const animRef = useRef(null);
  const beamIdRef = useRef(1);
  const nodeIdRef = useRef(1);
  const spentRef = useRef(0);

  const spent = useMemo(() => {
    return beams.reduce((sum, b) => {
      const a = nodes.find((n) => n.id === b.a);
      const c = nodes.find((n) => n.id === b.b);
      if (!a || !c) return sum;
      return sum + beamCost(MATERIALS[b.material], dist(a, c));
    }, 0);
  }, [beams, nodes]);

  const budgetLeft = level.budget - spent;
  const leftoverPct =
    level.budget > 0 ? Math.round((budgetLeft / level.budget) * 100) : 0;

  useEffect(() => {
    spentRef.current = spent;
  }, [spent]);

  const refreshBoard = async (id = boardId) => {
    setBoardLoading(true);
    try {
      const rows = await fetchBridgeLeaderboard(id);
      setLeaderboard(rows);
    } finally {
      setBoardLoading(false);
    }
  };

  useEffect(() => {
    void refreshBoard(boardId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boardId]);

  const recordWin = async (cost) => {
    const name =
      user?.displayName ||
      user?.email?.split("@")[0] ||
      tx("訪客", "Guest");
    try {
      const rows = await submitBridgeScore({
        levelId: boardId,
        cost,
        name,
        uid: user?.uid || null,
      });
      setLeaderboard(rows);
      setLastSubmittedCost(cost);
      const left = Math.max(0, level.budget - cost);
      const pct = Math.round((left / level.budget) * 100);
      setMessage(
        tx(
          `成功過河！造價 $${cost}（剩餘約 ${pct}%）已記入排行榜`,
          `You crossed! Cost $${cost} (about ${pct}% left) saved on the board`,
        ),
      );
    } catch {
      setMessage(
        tx("成功過河！但排行榜儲存失敗。", "You crossed! But the leaderboard did not save."),
      );
    }
  };

  useEffect(() => {
    // reset when difficulty or level changes
    const next = makeLevelNodes({ gap: level.gap, pier: level.pier });
    setNodes([...next.fixed]);
    setBeams([]);
    setSelected(null);
    setMode("build");
    setMessage(locMsg(level));
    setStress({});
    setBroken(new Set());
    setCarT(0);
    setPath(null);
    setResult(null);
    setLastSubmittedCost(null);
    beamIdRef.current = 1;
    nodeIdRef.current = 1;
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, [diffId, levelId, level.gap, level.pier, level.message, lang]);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const addJointAt = (x, y) => {
    if (mode !== "build") return;
    const p = snapToGrid(x, y);
    // don't place too close to existing
    if (nodes.some((n) => dist(n, p) < 28)) return;
    const id = `J${nodeIdRef.current++}`;
    setNodes((prev) => [...prev, { id, x: p.x, y: p.y, fixed: false }]);
  };

  const onCanvasClick = (e) => {
    if (mode !== "build") return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    // if clicking empty space, add joint
    const hit = nodes.find((n) => Math.hypot(n.x - x, n.y - y) < 18);
    if (hit) {
      onNodeClick(hit.id);
      return;
    }
    addJointAt(x, y);
  };

  const onNodeClick = (id) => {
    if (mode !== "build") return;
    if (!selected) {
      setSelected(id);
      setMessage(tx("再點另一個接點來架設材料", "Click another joint to place the material"));
      return;
    }
    if (selected === id) {
      setSelected(null);
      return;
    }
    const a = nodes.find((n) => n.id === selected);
    const b = nodes.find((n) => n.id === id);
    if (!a || !b) return;
    if (beams.some((beam) => (beam.a === a.id && beam.b === b.id) || (beam.a === b.id && beam.b === a.id))) {
      setMessage(tx("這兩點之間已經有材料了", "There is already material between these points"));
      setSelected(null);
      return;
    }
    const length = dist(a, b);
    if (length < 36) {
      setMessage(tx("距離太近了", "Those points are too close"));
      setSelected(null);
      return;
    }
    const cost = beamCost(MATERIALS[material], length);
    if (cost > budgetLeft) {
      setMessage(tx(`預算不足（需要 $${cost}）`, `Not enough budget (needs $${cost})`));
      setSelected(null);
      return;
    }
    setBeams((prev) => [
      ...prev,
      {
        id: `B${beamIdRef.current++}`,
        a: a.id,
        b: b.id,
        material,
      },
    ]);
    setSelected(null);
    setMessage(
      tx(
        `已架設${locLabel(MATERIALS[material])}（$${cost}）`,
        `Placed ${locLabel(MATERIALS[material])} ($${cost})`,
      ),
    );
  };

  const undoBeam = () => {
    if (mode !== "build" || !beams.length) return;
    setBeams((prev) => prev.slice(0, -1));
    setMessage(tx("已撤销上一條材料", "Undid the last beam"));
  };

  const clearBuild = () => {
    if (mode === "test") return;
    setNodes([...layout.fixed]);
    setBeams([]);
    setSelected(null);
    setStress({});
    setBroken(new Set());
    setPath(null);
    setResult(null);
    setMode("build");
    setMessage(locMsg(level));
  };

  const runTest = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const leftIds = nodes.filter((n) => n.anchor === "left").map((n) => n.id);
    const rightIds = nodes.filter((n) => n.anchor === "right").map((n) => n.id);
    const found = shortestPath(nodes, beams, leftIds, rightIds);
    if (!found) {
      setMode("result");
      setResult("lose");
      setMessage(
        tx("橋還沒連起來！左岸要能走到右岸。", "The bridge is not connected! Left bank must reach the right bank."),
      );
      setPath(null);
      return;
    }

    setPath(found);
    setMode("test");
    setResult(null);
    setBroken(new Set());
    setStress({});
    setCarT(0);
    setMessage(tx("測試中：汽車正在過橋…", "Testing: the car is crossing…"));

    const beamById = new Map(beams.map((b) => [b.id, b]));
    const stressAcc = {};
    found.beamPath.forEach((id) => {
      stressAcc[id] = 0;
    });

    const start = performance.now();
    const duration = 4200;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setCarT(t);

      // load peaks on the beam under the car
      const idx = Math.min(
        found.beamPath.length - 1,
        Math.floor(t * found.beamPath.length),
      );
      const activeId = found.beamPath[idx];
      const mat = MATERIALS[beamById.get(activeId)?.material || "wood"];
      const neighbors = [
        found.beamPath[idx - 1],
        activeId,
        found.beamPath[idx + 1],
      ].filter(Boolean);

      neighbors.forEach((bid) => {
        const share = bid === activeId ? 1 : 0.35;
        stressAcc[bid] = (stressAcc[bid] || 0) + share * level.carWeight * 0.045;
      });

      const ratios = {};
      let failedId = null;
      Object.keys(stressAcc).forEach((bid) => {
        const beam = beamById.get(bid);
        const m = MATERIALS[beam?.material || "wood"];
        const ratio = stressAcc[bid] / m.strength;
        ratios[bid] = ratio;
        if (ratio >= 1 && !failedId) failedId = bid;
      });
      setStress({ ...ratios });

      if (failedId) {
        setBroken(new Set([failedId]));
        setMode("result");
        setResult("lose");
        setMessage(
          tx(
            "橋斷了！受力太大的桿件會變紅——試試加支撐或改用鋼樑。",
            "The bridge broke! Red beams are overstressed — add support or use steel.",
          ),
        );
        return;
      }

      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        const cost = spentRef.current;
        setMode("result");
        setResult("win");
        void recordWin(cost);
      }
    };

    animRef.current = requestAnimationFrame(tick);
  };

  const carPos = useMemo(() => {
    if (!path) return null;
    const pts = path.nodePath
      .map((id) => nodes.find((n) => n.id === id))
      .filter(Boolean);
    if (pts.length < 2) return null;
    const total = pts.reduce(
      (s, p, i) => (i ? s + dist(pts[i - 1], p) : 0),
      0,
    );
    let remain = carT * total;
    for (let i = 1; i < pts.length; i += 1) {
      const seg = dist(pts[i - 1], pts[i]);
      if (remain <= seg) {
        const u = seg ? remain / seg : 0;
        return {
          x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * u,
          y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * u - 14,
        };
      }
      remain -= seg;
    }
    const last = pts[pts.length - 1];
    return { x: last.x, y: last.y - 14 };
  }, [path, nodes, carT]);

  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
              Engineering · Bridge Lab
            </p>
            <h1 className="text-3xl font-bold text-ink">
              {tx("造橋挑戰", "Bridge challenge")}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted">
              {tx(
                "靈感來自 Poly Bridge：點空白處放接點，再點兩個接點架材料。按「測試」看汽車能不能過。",
                "Inspired by Poly Bridge: click empty space to place a joint, then click two joints to add material. Press Test to see if the car can cross.",
              )}
            </p>
          </div>
          <Link
            to="/engineering"
            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-sm hover:border-teal-500"
          >
            {tx("← 工程總覽", "← All engineering")}
          </Link>
        </header>

        <div className="mb-3 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              {tx("難度", "Difficulty")}
            </span>
            {DIFFICULTIES.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDiffId(d.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
                  diffId === d.id
                    ? `${d.color} text-white shadow-sm`
                    : "border border-slate-200 bg-white text-ink hover:border-teal-400"
                }`}
              >
                {locName(d)}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted">
              {tx("關卡", "Level")}
            </span>
            {difficulty.levels.map((lv) => (
              <button
                key={lv.id}
                type="button"
                onClick={() => setLevelId(lv.id)}
                className={`rounded-full px-4 py-1.5 text-sm font-bold ${
                  levelId === lv.id
                    ? "bg-teal-600 text-white"
                    : "border border-slate-200 bg-white text-ink hover:border-teal-400"
                }`}
              >
                {lv.id} · {locName(lv)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#c7e6f5] shadow-sm">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="h-auto w-full touch-manipulation"
              onClick={onCanvasClick}
              role="img"
              aria-label={tx("造橋畫布", "Bridge canvas")}
            >
              {/* sky/water/banks */}
              <rect x="0" y="0" width={W} height={H} fill="#b6dff0" />
              <rect
                x="0"
                y={WATER_TOP}
                width={W}
                height={H - WATER_TOP}
                fill="#38bdf8"
                opacity="0.55"
              />
              <path
                d={`M0 ${GROUND_Y} L${layout.leftX} ${GROUND_Y} L${layout.leftX} ${H} L0 ${H} Z`}
                fill="#78716c"
              />
              <path
                d={`M${layout.rightX} ${GROUND_Y} L${W} ${GROUND_Y} L${W} ${H} L${layout.rightX} ${H} Z`}
                fill="#78716c"
              />
              {layout.pier && (
                <rect
                  x={W / 2 - 18}
                  y={GROUND_Y}
                  width="36"
                  height={H - GROUND_Y}
                  fill="#57534e"
                />
              )}

              {/* grid hints */}
              {mode === "build" &&
                Array.from({ length: 20 }, (_, i) => (
                  <line
                    key={`vg-${i}`}
                    x1={80 + i * 40}
                    y1="70"
                    x2={80 + i * 40}
                    y2={GROUND_Y - 10}
                    stroke="#0f172a"
                    strokeOpacity="0.05"
                  />
                ))}

              {/* beams */}
              {beams.map((b) => {
                const a = nodes.find((n) => n.id === b.a);
                const c = nodes.find((n) => n.id === b.b);
                if (!a || !c) return null;
                const mat = MATERIALS[b.material];
                const ratio = stress[b.id] || 0;
                const isBroken = broken.has(b.id);
                const stroke =
                  mode === "build"
                    ? mat.color
                    : isBroken
                      ? "#ef4444"
                      : stressColor(ratio);
                return (
                  <line
                    key={b.id}
                    x1={a.x}
                    y1={a.y}
                    x2={c.x}
                    y2={c.y}
                    stroke={stroke}
                    strokeWidth={b.material === "cable" ? 3 : 6}
                    strokeDasharray={isBroken ? "4 6" : mat.dash || undefined}
                    strokeLinecap="round"
                    opacity={isBroken ? 0.45 : 1}
                  />
                );
              })}

              {/* nodes */}
              {nodes.map((n) => {
                const active = selected === n.id;
                return (
                  <g key={n.id}>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={n.fixed ? 9 : 8}
                      fill={active ? "#f59e0b" : n.fixed ? "#1e293b" : "#fff"}
                      stroke={active ? "#b45309" : "#0f172a"}
                      strokeWidth="2.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNodeClick(n.id);
                      }}
                      style={{ cursor: mode === "build" ? "pointer" : "default" }}
                    />
                  </g>
                );
              })}

              {/* car */}
              {carPos && (mode === "test" || result === "win") && (
                <g transform={`translate(${carPos.x}, ${carPos.y})`}>
                  <rect
                    x="-16"
                    y="-10"
                    width="32"
                    height="14"
                    rx="3"
                    fill="#f97316"
                    stroke="#9a3412"
                    strokeWidth="1.5"
                  />
                  <circle cx="-9" cy="5" r="4" fill="#0f172a" />
                  <circle cx="9" cy="5" r="4" fill="#0f172a" />
                </g>
              )}

              <text
                x="24"
                y="36"
                fontSize="14"
                fontWeight="700"
                fill="#0f172a"
              >
                {locName(level)}
              </text>
            </svg>
          </div>

          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              {tx("控制台", "Controls")}
            </p>
            <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm">
              <div className="flex justify-between font-bold text-ink">
                <span>{tx("預算", "Budget")}</span>
                <span className={budgetLeft < 0 ? "text-rose-600" : ""}>
                  ${budgetLeft} / ${level.budget}
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-teal-500"
                  style={{
                    width: `${Math.min(100, (spent / level.budget) * 100)}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>
                  {tx("車重：", "Car weight: ")}
                  {level.carWeight}
                </span>
                <span>
                  {tx(`剩餘 ${leftoverPct}%`, `${leftoverPct}% left`)}
                  {mode === "build" &&
                    tx(" · 目標約 30%", " · aim for about 30%")}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted">
                {locName(difficulty)} · {tx("關卡", "Level")} {levelId}/3
                {level.pier
                  ? tx(" · 有橋墩", " · has a pier")
                  : tx(" · 無橋墩", " · no pier")}
              </p>
            </div>

            <p className="mt-4 text-xs font-bold text-muted">
              {tx("材料", "Materials")}
            </p>
            <div className="mt-2 space-y-2">
              {Object.values(MATERIALS).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  disabled={mode !== "build"}
                  onClick={() => setMaterial(m.id)}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold ${
                    material === m.id
                      ? "border-teal-500 bg-teal-50 text-teal-900"
                      : "border-slate-200 bg-white text-ink"
                  } disabled:opacity-50`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="inline-block h-2 w-8 rounded-full"
                      style={{
                        background: m.color,
                        borderBottom: m.dash ? "2px dashed #fff" : undefined,
                      }}
                    />
                    {locLabel(m)}
                  </span>
                  <span className="text-xs text-muted">
                    {tx("強度", "Strength")} {m.strength}
                  </span>
                </button>
              ))}
            </div>

            <p className="mt-4 rounded-xl border border-teal-100 bg-teal-50 px-3 py-2 text-sm text-teal-900">
              {message}
            </p>

            {result && (
              <p
                className={`mt-2 rounded-xl px-3 py-2 text-sm font-bold ${
                  result === "win"
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-rose-50 text-rose-800"
                }`}
              >
                {result === "win"
                  ? tx(
                      `過關！造價 $${lastSubmittedCost ?? spent}`,
                      `Passed! Cost $${lastSubmittedCost ?? spent}`,
                    )
                  : tx("失敗 — 再改一改設計", "Failed — change the design")}
              </p>
            )}

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">
                  {tx("排行榜", "Leaderboard")} · {locName(difficulty)} ·{" "}
                  {tx("關卡", "Level")} {levelId}
                </p>
                <button
                  type="button"
                  onClick={() => void refreshBoard(boardId)}
                  className="text-[11px] font-bold text-teal-700 hover:underline"
                >
                  {tx("重新整理", "Refresh")}
                </button>
              </div>
              <p className="mb-2 text-[11px] text-muted">
                {tx("依造價由低到高（愈省愈強）", "Lowest cost first (cheaper is better)")}
              </p>
              {boardLoading ? (
                <p className="text-xs text-muted">{tx("載入中…", "Loading…")}</p>
              ) : leaderboard.length === 0 ? (
                <p className="text-xs text-muted">
                  {tx("還沒有紀錄，過關後會出現這裡。", "No records yet. Pass the level to appear here.")}
                </p>
              ) : (
                <ol className="max-h-48 space-y-1.5 overflow-y-auto">
                  {leaderboard.map((row, i) => {
                    const mine =
                      (user?.uid && row.uid === user.uid) ||
                      (!user &&
                        lastSubmittedCost != null &&
                        row.cost === lastSubmittedCost &&
                        i ===
                          leaderboard.findIndex(
                            (r) => r.cost === lastSubmittedCost,
                          ));
                    return (
                      <li
                        key={`${row.playerKey}-${row.at}`}
                        className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-sm ${
                          mine
                            ? "bg-teal-100 font-bold text-teal-900"
                            : "bg-white text-ink"
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${
                              i === 0
                                ? "bg-amber-400 text-white"
                                : i === 1
                                  ? "bg-slate-300 text-slate-800"
                                  : i === 2
                                    ? "bg-orange-300 text-orange-950"
                                    : "bg-slate-100 text-muted"
                            }`}
                          >
                            {i + 1}
                          </span>
                          <span className="truncate">{row.name}</span>
                        </span>
                        <span className="shrink-0 font-mono font-bold">
                          ${row.cost}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}
              {!user && (
                <p className="mt-2 text-[10px] text-muted">
                  {tx("登入後成績可同步到雲端排行榜。", "Log in to save scores to the cloud board.")}
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={runTest}
                disabled={mode === "test" || beams.length === 0}
                className="rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {tx("測試過橋", "Test crossing")}
              </button>
              <button
                type="button"
                onClick={undoBeam}
                disabled={mode === "test" || beams.length === 0}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-ink hover:border-teal-400 disabled:opacity-50"
              >
                {tx("撤销上一條", "Undo last")}
              </button>
              <button
                type="button"
                onClick={clearBuild}
                disabled={mode === "test"}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-ink hover:border-teal-400 disabled:opacity-50"
              >
                {tx("清空重建", "Clear and rebuild")}
              </button>
              {result === "win" && levelId < difficulty.levels.length && (
                <button
                  type="button"
                  onClick={() => setLevelId((v) => v + 1)}
                  className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-600"
                >
                  {tx("下一關 →", "Next level →")}
                </button>
              )}
              {result === "win" &&
                levelId >= difficulty.levels.length &&
                diffId < DIFFICULTIES.length && (
                  <button
                    type="button"
                    onClick={() => {
                      setDiffId((d) => d + 1);
                      setLevelId(1);
                    }}
                    className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-600"
                  >
                    {tx("下一難度 →", "Next difficulty →")}
                  </button>
                )}
            </div>

            <ul className="mt-4 space-y-1 text-xs leading-relaxed text-muted">
              <li>
                {tx(
                  "1. 點空白處放置接點（會自動對齊格線）",
                  "1. Click empty space to place a joint (it snaps to the grid)",
                )}
              </li>
              <li>{tx("2. 點兩個接點架設材料", "2. Click two joints to add material")}</li>
              <li>
                {tx("3. 黑色圓點是兩岸固定錨點", "3. Black dots are fixed anchors on each bank")}
              </li>
              <li>
                {tx(
                  "4. 測試時桿件顏色：綠→黃→紅＝受力愈大",
                  "4. During the test, beam color green→yellow→red means more stress",
                )}
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
