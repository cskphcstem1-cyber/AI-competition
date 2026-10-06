import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../contexts/LangContext";

/**
 * Kid-friendly circuit builder (not an external embed):
 * place battery / bulb / resistor / switch, wire terminals, watch current & light.
 */

const W = 900;
const H = 520;
const GRID = 20;

const TOOLS = [
  {
    id: "battery",
    label: "電池",
    labelEn: "Battery",
    hint: "從左側拉出放到畫布",
    hintEn: "Drag from the left onto the canvas",
    pull: true,
  },
  {
    id: "bulb",
    label: "燈泡",
    labelEn: "Bulb",
    hint: "從左側拉出放到畫布",
    hintEn: "Drag from the left onto the canvas",
    pull: true,
  },
  {
    id: "resistor",
    label: "電阻",
    labelEn: "Resistor",
    hint: "從左側拉出放到畫布",
    hintEn: "Drag from the left onto the canvas",
    pull: true,
  },
  {
    id: "switch",
    label: "開關",
    labelEn: "Switch",
    hint: "拉出後點一下可開／關",
    hintEn: "Drag out, then click to open or close",
    pull: true,
  },
  {
    id: "wire",
    label: "導線",
    labelEn: "Wire",
    hint: "拉出放到畫布，左右兩端可接線，可拖曳移動",
    hintEn: "Drag onto the canvas. Both ends can connect. You can drag to move it.",
    pull: true,
  },
  {
    id: "delete",
    label: "刪除",
    labelEn: "Delete",
    hint: "點元件或導線",
    hintEn: "Click a part or a wire",
    pull: false,
  },
];

let nextId = 1;
function uid(prefix) {
  return `${prefix}${nextId++}`;
}

function snap(v) {
  return Math.round(v / GRID) * GRID;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

/** Terminal positions for a component */
function terminalsOf(c) {
  const y = c.y;
  if (c.type === "battery") {
    return [
      { key: `${c.id}:neg`, x: c.x - 36, y, side: "neg" },
      { key: `${c.id}:pos`, x: c.x + 36, y, side: "pos" },
    ];
  }
  if (c.type === "wire") {
    return [
      { key: `${c.id}:L`, x: c.x1, y: c.y1, side: "L" },
      { key: `${c.id}:R`, x: c.x2, y: c.y2, side: "R" },
    ];
  }
  return [
    { key: `${c.id}:L`, x: c.x - 34, y, side: "L" },
    { key: `${c.id}:R`, x: c.x + 34, y, side: "R" },
  ];
}

function allTerminals(comps) {
  return comps.flatMap(terminalsOf);
}

function findTerminal(comps, key) {
  return allTerminals(comps).find((t) => t.key === key) || null;
}

/**
 * Graph of conducting links outside the battery.
 * Battery + and − must NOT be joined here — that path has to go through the wires.
 */
function buildConductingGraph(comps, wires, skipComponentId = null) {
  const adj = new Map();
  const add = (a, b) => {
    if (!adj.has(a)) adj.set(a, []);
    if (!adj.has(b)) adj.set(b, []);
    adj.get(a).push(b);
    adj.get(b).push(a);
  };

  wires.forEach((w) => add(w.a, w.b));

  comps.forEach((c) => {
    if (c.id === skipComponentId) return;
    if (c.type === "battery") return;
    const ts = terminalsOf(c);
    if (ts.length < 2) return;
    if (c.type === "switch" && c.open) return;
    add(ts[0].key, ts[1].key);
  });

  return adj;
}

function reachable(adj, start) {
  const seen = new Set();
  const stack = [start];
  while (stack.length) {
    const u = stack.pop();
    if (seen.has(u)) continue;
    seen.add(u);
    for (const v of adj.get(u) || []) stack.push(v);
  }
  return seen;
}

/**
 * Circuit is live only if battery + reaches battery − through the external wires.
 * A component carries current if one end is on the + side and the other on the − side.
 */
function analyzeCircuit(comps, wires) {
  const batteries = comps.filter((c) => c.type === "battery");
  const powered = new Set();
  const lit = new Set();
  let live = false;

  batteries.forEach((bat) => {
    const pos = `${bat.id}:pos`;
    const neg = `${bat.id}:neg`;
    const adj = buildConductingGraph(comps, wires);
    const fromPos = reachable(adj, pos);
    if (!fromPos.has(neg)) return;
    live = true;

    comps.forEach((c) => {
      if (c.type === "battery") return;
      if (c.type === "switch" && c.open) return;
      const ts = terminalsOf(c);
      if (ts.length < 2) return;

      // Remove this part; current flows through it only if + and − sit on opposite ends.
      const without = buildConductingGraph(comps, wires, c.id);
      const fromPlus = reachable(without, pos);
      const fromMinus = reachable(without, neg);
      const a = ts[0].key;
      const b = ts[1].key;
      const through =
        (fromPlus.has(a) && fromMinus.has(b)) || (fromPlus.has(b) && fromMinus.has(a));
      if (!through) return;

      powered.add(c.id);
      if (c.type === "bulb") lit.add(c.id);
    });
  });

  return { live, powered, lit };
}

function CompGlyph({ c, lit, selected }) {
  const glow = lit ? 1 : 0;
  if (c.type === "battery") {
    return (
      <g transform={`translate(${c.x}, ${c.y})`}>
        <rect
          x="-30"
          y="-14"
          width="60"
          height="28"
          rx="4"
          fill="#f8fafc"
          stroke={selected ? "#f59e0b" : "#334155"}
          strokeWidth={selected ? 3 : 2}
        />
        <rect x="-28" y="-10" width="18" height="20" rx="2" fill="#64748b" />
        <rect x="-8" y="-10" width="18" height="20" rx="2" fill="#94a3b8" />
        <rect x="12" y="-6" width="10" height="12" rx="1" fill="#e2e8f0" stroke="#334155" />
        <text x="-18" y="5" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">
          −
        </text>
        <text x="28" y="5" textAnchor="middle" fontSize="12" fontWeight="800" fill="#0f172a">
          +
        </text>
      </g>
    );
  }
  if (c.type === "bulb") {
    return (
      <g transform={`translate(${c.x}, ${c.y})`}>
        <line x1="-34" y1="0" x2="-12" y2="0" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
        <line x1="12" y1="0" x2="34" y2="0" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
        <circle
          cx="0"
          cy="0"
          r="16"
          fill={lit ? "#fde68a" : "#f1f5f9"}
          stroke={selected ? "#f59e0b" : lit ? "#f59e0b" : "#64748b"}
          strokeWidth={selected ? 3 : 2}
          style={{
            filter: lit ? "drop-shadow(0 0 10px #fbbf24)" : undefined,
          }}
        />
        <path
          d="M-5 -4 Q0 2 5 -4 M-4 2 Q0 8 4 2"
          fill="none"
          stroke={lit ? "#b45309" : "#94a3b8"}
          strokeWidth="2"
        />
        {glow ? (
          <circle cx="0" cy="0" r="22" fill="#fbbf24" opacity="0.25" />
        ) : null}
      </g>
    );
  }
  if (c.type === "resistor") {
    return (
      <g transform={`translate(${c.x}, ${c.y})`}>
        <line x1="-34" y1="0" x2="-22" y2="0" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
        <line x1="22" y1="0" x2="34" y2="0" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
        <rect
          x="-22"
          y="-10"
          width="44"
          height="20"
          rx="3"
          fill="#d6b28a"
          stroke={selected ? "#f59e0b" : "#92400e"}
          strokeWidth={selected ? 3 : 2}
        />
        <line x1="-12" y1="-10" x2="-12" y2="10" stroke="#b45309" strokeWidth="3" />
        <line x1="-2" y1="-10" x2="-2" y2="10" stroke="#166534" strokeWidth="3" />
        <line x1="8" y1="-10" x2="8" y2="10" stroke="#1d4ed8" strokeWidth="3" />
        <line x1="16" y1="-10" x2="16" y2="10" stroke="#b45309" strokeWidth="2" />
      </g>
    );
  }
  if (c.type === "wire") {
    return (
      <g>
        <line
          x1={c.x1}
          y1={c.y1}
          x2={c.x2}
          y2={c.y2}
          stroke="#b45309"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1={c.x1}
          y1={c.y1}
          x2={c.x2}
          y2={c.y2}
          stroke={selected ? "#f59e0b" : "transparent"}
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.35"
        />
      </g>
    );
  }
  // switch
  return (
    <g transform={`translate(${c.x}, ${c.y})`}>
      <line x1="-34" y1="0" x2="-14" y2="0" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
      <line x1="14" y1="0" x2="34" y2="0" stroke="#b45309" strokeWidth="4" strokeLinecap="round" />
      <circle cx="-12" cy="0" r="5" fill="#1e293b" />
      <circle cx="12" cy="0" r="5" fill="#1e293b" />
      <line
        x1="-12"
        y1="0"
        x2={c.open ? 6 : 12}
        y2={c.open ? -16 : 0}
        stroke={selected ? "#f59e0b" : "#334155"}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <rect
        x="-20"
        y="-22"
        width="40"
        height="44"
        fill="transparent"
        stroke={selected ? "#f59e0b" : "transparent"}
        strokeWidth="2"
        rx="6"
      />
    </g>
  );
}

export default function CircuitLab() {
  const { lang, tx } = useLang();
  const toolName = (id) => {
    const item = TOOLS.find((x) => x.id === id);
    if (!item) return id;
    return lang === "en" ? item.labelEn : item.label;
  };
  const toolHint = (item) => (lang === "en" ? item.hintEn : item.hint);
  const [tool, setTool] = useState("battery");
  const [comps, setComps] = useState([]);
  const [wires, setWires] = useState([]);
  const [wireFrom, setWireFrom] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState(
    tx("從左邊拉出元件或導線放到畫布上。", "Drag a part or a wire from the left onto the canvas."),
  );
  const [showElectrons, setShowElectrons] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [ghost, setGhost] = useState(null); // { type, x, y, fromX?, fromY? } client coords
  const dragRef = useRef(null);
  const pullRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    setMessage(
      tx(
        "從左邊拉出元件或導線放到畫布上。",
        "Drag a part or a wire from the left onto the canvas.",
      ),
    );
  }, [lang, tx]);

  const analysis = useMemo(() => analyzeCircuit(comps, wires), [comps, wires]);
  const terminals = useMemo(() => allTerminals(comps), [comps]);

  const placeComponent = (type, x, y) => {
    const cx = clamp(snap(x), 80, W - 80);
    const cy = clamp(snap(y), 60, H - 60);
    const c =
      type === "wire"
        ? {
            id: uid("C"),
            type: "wire",
            x1: clamp(snap(cx - 50), 40, W - 40),
            y1: cy,
            x2: clamp(snap(cx + 50), 40, W - 40),
            y2: cy,
          }
        : {
            id: uid("C"),
            type,
            x: cx,
            y: cy,
            open: type === "switch" ? true : undefined,
          };
    setComps((prev) => [...prev, c]);
    setSelectedId(c.id);
    setMessage(
      tx(`已放置${toolName(type)}`, `Placed ${toolName(type)}`),
    );
  };

  const onCanvasClick = () => {
    if (dragRef.current?.moved || pullRef.current) return;
  };

  const onPalettePointerDown = (e, t) => {
    setTool(t.id);
    setWireFrom(null);
    setMessage(t.hint);
    if (!t.pull) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    pullRef.current = { type: t.id, pulled: false };
    setGhost({ type: t.id, x: e.clientX, y: e.clientY });
  };

  const onPalettePointerMove = (e) => {
    const p = pullRef.current;
    if (!p) return;
    p.pulled = true;
    setGhost({ type: p.type, x: e.clientX, y: e.clientY });
  };

  const onPalettePointerUp = (e) => {
    const p = pullRef.current;
    pullRef.current = null;
    setGhost(null);
    if (!p?.pulled) return;

    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      setMessage(tx("請拉到藍色畫布上再放開", "Drop it on the blue canvas"));
      return;
    }
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const y = ((e.clientY - rect.top) / rect.height) * H;
    placeComponent(p.type, x, y);
  };

  const tryConnectWire = (fromKey, toKey) => {
    if (!fromKey || !toKey || fromKey === toKey) return false;
    if (fromKey.split(":")[0] === toKey.split(":")[0]) {
      setMessage(tx("請連接到另一個元件的接點", "Connect it to a terminal on another part"));
      return false;
    }
    if (
      wires.some(
        (w) =>
          (w.a === fromKey && w.b === toKey) ||
          (w.a === toKey && w.b === fromKey),
      )
    ) {
      setMessage(tx("這兩點已經接好了", "These two points are already connected"));
      return false;
    }
    setWires((prev) => [...prev, { id: uid("W"), a: fromKey, b: toKey }]);
    setMessage(
      tx(
        "導線已接上！若形成閉合迴路，燈泡會亮。",
        "Wire connected! If the loop is closed, the bulb will light.",
      ),
    );
    return true;
  };

  const onTerminalPointerDown = (e, key) => {
    e.stopPropagation();
    if (tool === "delete") {
      removeComponent(key.split(":")[0]);
      return;
    }
    const cid = key.split(":")[0];
    const side = key.split(":")[1];
    const c = comps.find((x) => x.id === cid);
    // Drag left/right ends of a wire segment to move them
    if (c?.type === "wire" && (side === "L" || side === "R")) {
      const svg = svgRef.current;
      if (svg && e.pointerId != null) {
        try {
          svg.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      }
      dragRef.current = {
        id: cid,
        mode: "endpoint",
        side,
        ox1: c.x1,
        oy1: c.y1,
        ox2: c.x2,
        oy2: c.y2,
        sx: e.clientX,
        sy: e.clientY,
        moved: false,
        pointerId: e.pointerId,
        terminalKey: key,
      };
      setSelectedId(cid);
      return;
    }

    // Otherwise start / finish a connection
    if (!wireFrom) {
      setTool("wire");
      setWireFrom(key);
      setMessage(
        tx("再點另一個接點來接上導線", "Click another terminal to finish the wire"),
      );
      return;
    }
    if (wireFrom === key) {
      setWireFrom(null);
      return;
    }
    tryConnectWire(wireFrom, key);
    setWireFrom(null);
  };

  const removeComponent = (id) => {
    setComps((prev) => prev.filter((c) => c.id !== id));
    setWires((prev) =>
      prev.filter((w) => !w.a.startsWith(`${id}:`) && !w.b.startsWith(`${id}:`)),
    );
    if (selectedId === id) setSelectedId(null);
    setMessage(tx("已刪除元件", "Part deleted"));
  };

  const onWireClick = (e, wid) => {
    e.stopPropagation();
    if (tool === "delete") {
      setWires((prev) => prev.filter((w) => w.id !== wid));
      setMessage(tx("已刪除導線", "Wire deleted"));
    }
  };

  const onCompPointerDown = (e, c) => {
    e.stopPropagation();
    if (tool === "delete") {
      removeComponent(c.id);
      return;
    }
    const svg = svgRef.current;
    if (svg && e.pointerId != null) {
      try {
        svg.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
    if (c.type === "wire") {
      dragRef.current = {
        id: c.id,
        mode: "body",
        ox1: c.x1,
        oy1: c.y1,
        ox2: c.x2,
        oy2: c.y2,
        sx: e.clientX,
        sy: e.clientY,
        moved: false,
        toggleOnUp: false,
        pointerId: e.pointerId,
      };
    } else {
      dragRef.current = {
        id: c.id,
        mode: "body",
        ox: c.x,
        oy: c.y,
        sx: e.clientX,
        sy: e.clientY,
        moved: false,
        toggleOnUp: c.type === "switch",
        pointerId: e.pointerId,
      };
    }
    setSelectedId(c.id);
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.hypot(dx, dy) > 6) d.moved = true;
    if (!d.moved) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    const mdx = dx * scaleX;
    const mdy = dy * scaleY;

    if (d.mode === "endpoint") {
      setComps((prev) =>
        prev.map((c) => {
          if (c.id !== d.id || c.type !== "wire") return c;
          if (d.side === "L") {
            return {
              ...c,
              x1: clamp(snap(d.ox1 + mdx), 20, W - 20),
              y1: clamp(snap(d.oy1 + mdy), 20, H - 20),
            };
          }
          return {
            ...c,
            x2: clamp(snap(d.ox2 + mdx), 20, W - 20),
            y2: clamp(snap(d.oy2 + mdy), 20, H - 20),
          };
        }),
      );
      return;
    }

    if (d.ox1 != null) {
      // move whole wire segment
      setComps((prev) =>
        prev.map((c) =>
          c.id === d.id && c.type === "wire"
            ? {
                ...c,
                x1: clamp(snap(d.ox1 + mdx), 20, W - 20),
                y1: clamp(snap(d.oy1 + mdy), 20, H - 20),
                x2: clamp(snap(d.ox2 + mdx), 20, W - 20),
                y2: clamp(snap(d.oy2 + mdy), 20, H - 20),
              }
            : c,
        ),
      );
      return;
    }

    const nx = clamp(snap(d.ox + mdx), 80, W - 80);
    const ny = clamp(snap(d.oy + mdy), 60, H - 60);
    setComps((prev) =>
      prev.map((c) => (c.id === d.id ? { ...c, x: nx, y: ny } : c)),
    );
  };

  const onPointerUp = () => {
    const d = dragRef.current;
    if (d?.toggleOnUp && !d.moved) {
      setComps((prev) =>
        prev.map((c) =>
          c.id === d.id ? { ...c, open: !c.open } : c,
        ),
      );
      const c = comps.find((x) => x.id === d.id);
      const willOpen = c ? !c.open : true;
      setMessage(
        willOpen
          ? tx("開關已斷開", "Switch opened")
          : tx("開關已閉合", "Switch closed"),
      );
    } else if (d?.moved) {
      setMessage(
        d.mode === "endpoint"
          ? tx("已移動導線端點", "Moved a wire end")
          : tx("已移動元件", "Moved a part"),
      );
    } else if (d?.mode === "endpoint" && d.terminalKey && !d.moved) {
      // tap terminal without drag → connect mode
      if (!wireFrom) {
        setWireFrom(d.terminalKey);
        setMessage(
        tx("再點另一個接點來接上導線", "Click another terminal to finish the wire"),
      );
      } else if (wireFrom === d.terminalKey) {
        setWireFrom(null);
      } else {
        tryConnectWire(wireFrom, d.terminalKey);
        setWireFrom(null);
      }
    }
    const svg = svgRef.current;
    if (svg && d?.pointerId != null) {
      try {
        svg.releasePointerCapture(d.pointerId);
      } catch {
        /* ignore */
      }
    }
    dragRef.current = null;
  };

  const clearAll = () => {
    setComps([]);
    setWires([]);
    setWireFrom(null);
    setSelectedId(null);
    setMessage(tx("畫布已清空", "Canvas cleared"));
  };

  const undoLast = () => {
    if (wires.length) {
      setWires((prev) => prev.slice(0, -1));
      setMessage(tx("已撤销上一條導線", "Undid the last wire"));
      return;
    }
    if (comps.length) {
      const last = comps[comps.length - 1];
      removeComponent(last.id);
    }
  };

  // Electron dots along powered wires
  const electronDots = useMemo(() => {
    if (!showElectrons || !analysis.live) return [];
    const dots = [];
    wires.forEach((w) => {
      const a = findTerminal(comps, w.a);
      const b = findTerminal(comps, w.b);
      if (!a || !b) return;
      // only if both ends reachable in live circuit — approximate: both comps powered or battery
      const ca = w.a.split(":")[0];
      const cb = w.b.split(":")[0];
      const aOk =
        comps.find((c) => c.id === ca)?.type === "battery" ||
        analysis.powered.has(ca);
      const bOk =
        comps.find((c) => c.id === cb)?.type === "battery" ||
        analysis.powered.has(cb);
      if (!aOk && !bOk) return;
      for (let i = 1; i <= 3; i += 1) {
        const t = i / 4;
        dots.push({
          id: `${w.id}-${i}`,
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t,
          delay: i * 0.25,
        });
      }
    });
    return dots;
  }, [wires, comps, analysis, showElectrons]);

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col bg-[#b6dff0]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
            Engineering · Circuit Lab
          </p>
          <h1 className="text-xl font-bold text-ink sm:text-2xl">
            {tx("電路建造", "Circuit builder")}
          </h1>
          <p className="mt-0.5 text-sm text-muted">
            {tx(
              "組裝電路：電池、燈泡、電阻、開關與導線。",
              "Build a circuit: battery, bulb, resistor, switch, and wires.",
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

      <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 lg:flex-row">
        {/* Palette */}
        <aside className="flex shrink-0 gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-100 p-2 lg:w-28 lg:flex-col lg:overflow-y-auto">
          {TOOLS.map((item) => (
            <button
              key={item.id}
              type="button"
              title={toolHint(item)}
              onClick={() => {
                if (item.pull) return; // placement is by pull
                setTool(item.id);
                setWireFrom(null);
                setMessage(toolHint(item));
              }}
              onPointerDown={(e) => onPalettePointerDown(e, item)}
              onPointerMove={onPalettePointerMove}
              onPointerUp={onPalettePointerUp}
              onPointerCancel={() => {
                pullRef.current = null;
                setGhost(null);
              }}
              className={`flex min-w-[4.5rem] cursor-grab flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-xs font-bold transition active:cursor-grabbing lg:min-w-0 ${
                tool === item.id
                  ? "bg-amber-500 text-white shadow"
                  : "border border-transparent bg-white text-ink hover:border-amber-300"
              }`}
            >
              <ToolIcon id={item.id} />
              {toolName(item.id)}
            </button>
          ))}
          <p className="hidden px-1 text-center text-[10px] font-semibold text-muted lg:block">
            {tx("按住拉出元件／導線", "Hold and drag parts / wires")}
          </p>
        </aside>

        {/* Canvas */}
        <div className="relative min-h-[320px] min-w-0 flex-1 overflow-hidden rounded-2xl border border-slate-300 bg-[#9fd4ea] shadow-inner">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="h-full w-full touch-manipulation"
            onClick={onCanvasClick}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            role="img"
            aria-label={tx("電路畫布", "Circuit canvas")}
          >
            {/* subtle grid */}
            {Array.from({ length: Math.floor(W / GRID) }, (_, i) => (
              <line
                key={`vx-${i}`}
                x1={i * GRID}
                y1="0"
                x2={i * GRID}
                y2={H}
                stroke="#0f172a"
                strokeOpacity="0.04"
              />
            ))}
            {Array.from({ length: Math.floor(H / GRID) }, (_, i) => (
              <line
                key={`hy-${i}`}
                x1="0"
                y1={i * GRID}
                x2={W}
                y2={i * GRID}
                stroke="#0f172a"
                strokeOpacity="0.04"
              />
            ))}

            {/* wires */}
            {wires.map((w) => {
              const a = findTerminal(comps, w.a);
              const b = findTerminal(comps, w.b);
              if (!a || !b) return null;
              return (
                <line
                  key={w.id}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#b45309"
                  strokeWidth="5"
                  strokeLinecap="round"
                  className={tool === "delete" ? "cursor-pointer" : undefined}
                  onClick={(e) => onWireClick(e, w.id)}
                />
              );
            })}

            {/* electrons */}
            {electronDots.map((d) => (
              <circle
                key={d.id}
                cx={d.x}
                cy={d.y}
                r="4"
                fill="#2563eb"
                opacity="0.85"
              >
                <animate
                  attributeName="opacity"
                  values="0.3;1;0.3"
                  dur="1.2s"
                  begin={`${d.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}

            {/* components */}
            {comps.map((c) => (
              <g
                key={c.id}
                onPointerDown={(e) => onCompPointerDown(e, c)}
                style={{ cursor: tool === "delete" ? "pointer" : "grab" }}
              >
                <CompGlyph
                  c={c}
                  lit={analysis.lit.has(c.id)}
                  selected={selectedId === c.id}
                />
                {showLabels && (
                  <text
                    x={
                      c.type === "wire"
                        ? (c.x1 + c.x2) / 2
                        : c.x
                    }
                    y={
                      c.type === "wire"
                        ? (c.y1 + c.y2) / 2 + 28
                        : c.y + 32
                    }
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#0f172a"
                    opacity="0.7"
                  >
                    {c.type === "battery"
                      ? tx("電池", "Battery")
                      : c.type === "bulb"
                        ? tx("燈泡", "Bulb")
                        : c.type === "resistor"
                          ? tx("電阻", "Resistor")
                          : c.type === "wire"
                            ? tx("導線", "Wire")
                            : c.open
                              ? tx("開關(開)", "Switch (open)")
                              : tx("開關(關)", "Switch (closed)")}
                  </text>
                )}
              </g>
            ))}

            {/* terminals — left & right points */}
            {terminals.map((t) => {
              const active = wireFrom === t.key;
              return (
                <circle
                  key={t.key}
                  cx={t.x}
                  cy={t.y}
                  r={active ? 10 : 8}
                  fill={active ? "#f59e0b" : "#1e293b"}
                  stroke="#fff"
                  strokeWidth="2.5"
                  className="cursor-grab"
                  onPointerDown={(e) => onTerminalPointerDown(e, t.key)}
                />
              );
            })}
          </svg>

          <div className="pointer-events-none absolute bottom-3 left-3 flex gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold shadow ${
                analysis.live
                  ? "bg-emerald-500 text-white"
                  : "bg-white/90 text-muted"
              }`}
            >
              {analysis.live
                ? tx("電路通路 · 有電流", "Closed circuit · current flowing")
                : tx("尚未形成閉合迴路", "No closed loop yet")}
            </span>
          </div>
        </div>

        {/* Right panels */}
        <aside className="flex w-full shrink-0 flex-col gap-3 lg:w-56">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              {tx("顯示", "Display")}
            </p>
            <label className="mt-2 flex items-center gap-2 text-sm font-semibold text-ink">
              <input
                type="checkbox"
                checked={showElectrons}
                onChange={(e) => setShowElectrons(e.target.checked)}
              />
              {tx("顯示電流（電子）", "Show current (electrons)")}
            </label>
            <label className="mt-2 flex items-center gap-2 text-sm font-semibold text-ink">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={(e) => setShowLabels(e.target.checked)}
              />
              {tx("顯示標籤", "Show labels")}
            </label>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-muted">
              {tx("提示", "Tip")}
            </p>
            <p className="mt-2 text-sm text-ink">{message}</p>
            <ul className="mt-3 space-y-1 text-xs text-muted">
              <li>
                {tx("1. 從左邊拉出電池與燈泡", "1. Drag a battery and a bulb from the left")}
              </li>
              <li>
                {tx(
                  "2. 拉出導線（左右兩端可拖／接線）",
                  "2. Drag a wire (both ends can move / connect)",
                )}
              </li>
              <li>
                {tx("3. 開關要「閉合」才會亮", "3. The switch must be closed for the bulb to light")}
              </li>
              <li>
                {tx("4. 按住元件可拖曳移動", "4. Hold a part to drag it")}
              </li>
            </ul>
          </div>

          <div className="mt-auto flex flex-col gap-2">
            <button
              type="button"
              onClick={undoLast}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-ink hover:border-amber-400"
            >
              {tx("撤销", "Undo")}
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
            >
              {tx("重置畫布", "Reset canvas")}
            </button>
          </div>
        </aside>
      </div>
      {ghost && (
        <div
          className="pointer-events-none fixed z-[70] -translate-x-1/2 -translate-y-1/2"
          style={{ left: ghost.x, top: ghost.y }}
        >
          <svg
            width="140"
            height="70"
            viewBox="0 0 140 70"
            className="drop-shadow-lg"
            aria-hidden="true"
          >
            {ghost.type === "wire" ? (
              <>
                <CompGlyph
                  c={{
                    id: "ghost",
                    type: "wire",
                    x1: 20,
                    y1: 32,
                    x2: 120,
                    y2: 32,
                  }}
                  lit={false}
                  selected
                />
                <circle cx="20" cy="32" r="8" fill="#1e293b" stroke="#fff" strokeWidth="2.5" />
                <circle cx="120" cy="32" r="8" fill="#1e293b" stroke="#fff" strokeWidth="2.5" />
              </>
            ) : (
              <CompGlyph
                c={{
                  id: "ghost",
                  type: ghost.type,
                  x: 70,
                  y: 32,
                  open: ghost.type === "switch" ? true : undefined,
                }}
                lit={false}
                selected
              />
            )}
          </svg>
        </div>
      )}
    </div>
  );
}

function ToolIcon({ id }) {
  if (id === "battery") {
    return (
      <span className="flex h-8 w-10 items-center justify-center rounded bg-slate-500 text-[10px] font-black text-white">
        +−
      </span>
    );
  }
  if (id === "bulb") {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 text-sm">
        💡
      </span>
    );
  }
  if (id === "resistor") {
    return (
      <span className="h-3 w-10 rounded-sm bg-amber-700" />
    );
  }
  if (id === "switch") {
    return (
      <span className="font-mono text-lg leading-none">⏻</span>
    );
  }
  if (id === "wire") {
    return (
      <span className="h-1 w-10 rounded-full bg-amber-700" />
    );
  }
  return <span className="text-base">⌫</span>;
}
