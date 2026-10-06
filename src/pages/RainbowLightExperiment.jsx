import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../contexts/LangContext";

/**
 * Light lab: glass of water / prism · reflection · refraction · dispersion → rainbow on screen
 */

const C = {
  red: "#e11d48",
  orange: "#ea580c",
  yellow: "#ca8a04",
  green: "#16a34a",
  blue: "#2563eb",
  indigo: "#4f46e5",
  violet: "#7c3aed",
};

const SPECTRUM = [
  { id: "R", name: "紅", nameEn: "Red", color: C.red, nWater: 1.331, nGlass: 1.513 },
  { id: "O", name: "橙", nameEn: "Orange", color: C.orange, nWater: 1.332, nGlass: 1.514 },
  { id: "Y", name: "黃", nameEn: "Yellow", color: C.yellow, nWater: 1.333, nGlass: 1.517 },
  { id: "G", name: "綠", nameEn: "Green", color: C.green, nWater: 1.335, nGlass: 1.519 },
  { id: "B", name: "藍", nameEn: "Blue", color: C.blue, nWater: 1.338, nGlass: 1.522 },
  { id: "I", name: "靛", nameEn: "Indigo", color: C.indigo, nWater: 1.340, nGlass: 1.524 },
  { id: "V", name: "紫", nameEn: "Violet", color: C.violet, nWater: 1.342, nGlass: 1.526 },
];

const MATERIALS = {
  water: { label: "水 (玻璃杯)", labelEn: "Water (glass)", n: 1.333, fill: "rgba(56,189,248,0.45)" },
  glass: { label: "玻璃稜鏡", labelEn: "Glass prism", n: 1.5, fill: "rgba(186,230,253,0.55)" },
};

function deg(r) {
  return (r * 180) / Math.PI;
}
function rad(d) {
  return (d * Math.PI) / 180;
}

/** Snell: n1 sin i = n2 sin r  → r  (angles from the surface NORMAL) */
function refractAngle(n1, n2, iDeg) {
  const s = (n1 / n2) * Math.sin(rad(iDeg));
  if (Math.abs(s) > 1) return null; // TIR
  return deg(Math.asin(s));
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

/**
 * Vertical interface · horizontal normal.
 * θ = 0 → straight along normal (left→right).
 * Ray travels right & slightly down: dir = (cos θ, sin θ).
 */
function pointOnRay(originX, originY, angleDeg, distance) {
  return {
    x: originX + Math.cos(rad(angleDeg)) * distance,
    y: originY + Math.sin(rad(angleDeg)) * distance,
  };
}

/** Where the ray meets the vertical screen; y is clamped onto the screen. */
function projectToScreen(angleDeg, originX, originY, screenX, screenTop, screenBottom) {
  const c = Math.cos(rad(angleDeg));
  if (c < 0.05) return null;
  const rawY = originY + Math.tan(rad(angleDeg)) * (screenX - originX);
  const y = clamp(rawY, screenTop + 8, screenBottom - 8);
  const onScreen = rawY >= screenTop && rawY <= screenBottom;
  return { x: screenX, y, rawY, onScreen };
}

function Control({ label, children }) {
  return (
    <div className="border-b border-slate-200/80 py-3 last:border-0">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-amber-500"
      />
      {children}
    </label>
  );
}

export default function RainbowLightExperiment() {
  const { tx } = useLang();
  const [incidentDeg, setIncidentDeg] = useState(35);
  const [material, setMaterial] = useState("water");
  const [mode, setMode] = useState("white"); // white | laser
  const [laserColor, setLaserColor] = useState("G");
  const [showReflect, setShowReflect] = useState(true);
  const [showRefract, setShowRefract] = useState(true);
  const [showNormal, setShowNormal] = useState(true);
  const [showProtractor, setShowProtractor] = useState(false);
  const [intensity, setIntensity] = useState(90);
  const [waveOn, setWaveOn] = useState(false);

  const mat = MATERIALS[material];
  const nAir = 1.0;
  const n2 = mat.n;

  const reflectedDeg = incidentDeg; // law of reflection
  const mono = SPECTRUM.find((s) => s.id === laserColor) || SPECTRUM[3];

  // Vertical water interface · horizontal normal through (cx, cy)
  const cx = 180;
  const cy = 130;
  const L = 100;
  const CUP_X = 250;
  const SCREEN_X = 348;
  const SCREEN_TOP = 72;
  const SCREEN_BOTTOM = 208;
  const opacity = intensity / 100;

  const rays = useMemo(() => {
    const build = (band) => {
      const n = material === "water" ? band.nWater : band.nGlass;
      return { ...band, refracted: refractAngle(nAir, n, incidentDeg) };
    };
    const list =
      mode === "laser" ? [build(mono)] : SPECTRUM.map((s) => build(s));

    const valid = list.map((r) => r.refracted).filter((v) => v != null);
    const mid =
      valid.length > 0 ? valid[Math.floor(valid.length / 2)] : incidentDeg;

    return list.map((ray, idx) => {
      if (ray.refracted == null) {
        return { ...ray, visualDeg: null, cupPt: null, hit: null };
      }
      // Tiny real Δn, boosted for classroom visibility; θᵢ still drives the beam
      const delta = ray.refracted - mid;
      const boost = mode === "white" ? 14 + incidentDeg * 0.2 : 0;
      const visualDeg = ray.refracted + delta * boost;

      // Path always goes through the cup, then to the screen
      const cupPt = pointOnRay(cx, cy, visualDeg, CUP_X - cx);
      const hit = projectToScreen(
        visualDeg,
        cx,
        cy,
        SCREEN_X,
        SCREEN_TOP,
        SCREEN_BOTTOM,
      );
      // Keep cup on the line toward the (possibly clamped) screen hit
      const cupOnBeam = hit
        ? {
            x: CUP_X,
            y: cy + ((hit.y - cy) * (CUP_X - cx)) / (SCREEN_X - cx),
          }
        : cupPt;

      return {
        ...ray,
        visualDeg,
        cupPt: cupOnBeam,
        hit,
        bandIndex: idx,
      };
    });
  }, [mode, mono, material, incidentDeg]);

  const screenHits = rays.filter((r) => r.hit);
  const rainbowOnScreen =
    mode === "white" && showRefract && screenHits.some((r) => r.hit.onScreen);
  const laserOnScreen =
    mode === "laser" && showRefract && rays[0]?.hit?.onScreen;

  const rainbowSpreadPx = useMemo(() => {
    const ys = screenHits.map((r) => r.hit.y);
    if (ys.length < 2) return 0;
    return Math.max(...ys) - Math.min(...ys);
  }, [screenHits]);

  // Incident from upper-left (air); reflection back into air
  const incidentEnd = {
    x: cx - Math.cos(rad(incidentDeg)) * L,
    y: cy - Math.sin(rad(incidentDeg)) * L,
  };
  const reflectEnd = {
    x: cx - Math.cos(rad(reflectedDeg)) * L,
    y: cy + Math.sin(rad(reflectedDeg)) * L,
  };

  // Cup sits on the middle refracted beam
  const midRay = rays.find((r) => r.cupPt) || rays[Math.floor(rays.length / 2)];
  const cupAnchorY = midRay?.cupPt?.y ?? cy + 20;

  const reset = () => {
    setIncidentDeg(35);
    setMaterial("water");
    setMode("white");
    setLaserColor("G");
    setShowReflect(true);
    setShowRefract(true);
    setShowNormal(true);
    setShowProtractor(false);
    setIntensity(90);
    setWaveOn(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-[#c9e8f5]">
      {/* Toolbar */}
      <header className="flex flex-wrap items-center gap-2 border-b border-slate-400/40 bg-gradient-to-b from-[#f5d76e] to-[#e8b923] px-3 py-2 shadow">
        <Link
          to="/science"
          className="rounded-md bg-white/80 px-2 py-1 text-xs font-bold text-slate-800 hover:bg-white"
        >
          {tx("← 科學", "← Science")}
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-black tracking-tight text-slate-900 sm:text-base">
            {tx("彎曲的光 · 玻璃杯彩虹", "Bent light · Rainbow in a glass")}
          </h1>
          <p className="text-[10px] font-medium text-slate-800/80">
            {tx("反射 · 折射 · 色散", "Reflection · refraction · dispersion")}
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-slate-600/40 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50"
        >
          {tx("重置", "Reset")}
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Play area */}
        <div className="relative min-h-[340px] flex-1 p-2 sm:p-4">
          <div className="relative h-full min-h-[320px] overflow-hidden rounded-lg border-2 border-slate-500/30 bg-[#9fd4ea] shadow-inner">
            <svg
              viewBox="0 0 420 280"
              className="h-full w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* air / medium split */}
              <rect x="0" y="0" width="180" height="280" fill="#b8e0f2" />
              <rect
                x="180"
                y="0"
                width="240"
                height="280"
                fill={material === "water" ? "#7dd3fc" : "#a5f3fc"}
                opacity="0.85"
              />
              <text x="70" y="24" fontSize="12" fontWeight="700" fill="#0c4a6e">
                {tx("空氣", "Air")} n≈1.00
              </text>
              <text x="250" y="24" fontSize="12" fontWeight="700" fill="#0c4a6e">
                {tx(mat.label, mat.labelEn)} n≈{n2.toFixed(3)}
              </text>

              {/* interface */}
              <line
                x1={cx}
                y1="20"
                x2={cx}
                y2="260"
                stroke="#334155"
                strokeWidth="3"
              />

              {/* glass cup / prism — sits on the refracted beam */}
              {material === "water" ? (
                <g transform={`translate(${CUP_X}, ${clamp(cupAnchorY, 95, 175)})`}>
                  <path
                    d="M-24 -40 L-18 42 L18 42 L24 -40 Z"
                    fill={mat.fill}
                    stroke="#475569"
                    strokeWidth="2.5"
                  />
                  <ellipse
                    cx="0"
                    cy="-40"
                    rx="24"
                    ry="8"
                    fill="#e0f2fe"
                    stroke="#475569"
                    strokeWidth="2"
                  />
                  <text
                    x="0"
                    y="62"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#1e293b"
                  >
                    {tx("玻璃杯＋水", "Glass + water")}
                  </text>
                </g>
              ) : (
                <g transform={`translate(${CUP_X}, ${clamp(cupAnchorY, 100, 170)})`}>
                  <polygon
                    points="0,-50 48,40 -48,40"
                    fill={mat.fill}
                    stroke="#475569"
                    strokeWidth="2.5"
                  />
                  <text
                    x="0"
                    y="62"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#1e293b"
                  >
                    {tx("稜鏡", "Prism")}
                  </text>
                </g>
              )}

              {/* screen */}
              <g>
                <rect
                  x={SCREEN_X}
                  y={SCREEN_TOP - 8}
                  width="55"
                  height={SCREEN_BOTTOM - SCREEN_TOP + 16}
                  fill="#f8fafc"
                  stroke="#64748b"
                  strokeWidth="2"
                  rx="2"
                />
                <text
                  x={SCREEN_X + 27}
                  y={SCREEN_BOTTOM + 22}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#475569"
                >
                  {tx("螢幕", "Screen")}
                </text>
                {showRefract &&
                  mode === "white" &&
                  screenHits.map((ray) => {
                    const bandH = Math.max(
                      7,
                      Math.min(16, 5 + rainbowSpreadPx / Math.max(screenHits.length, 1)),
                    );
                    return (
                      <rect
                        key={ray.id}
                        x={SCREEN_X + 6}
                        y={ray.hit.y - bandH / 2}
                        width="43"
                        height={bandH}
                        fill={ray.color}
                        opacity={opacity}
                        rx="1"
                      />
                    );
                  })}
                {laserOnScreen && rays[0]?.hit && (
                  <rect
                    x={SCREEN_X + 6}
                    y={rays[0].hit.y - 12}
                    width="43"
                    height="24"
                    fill={mono.color}
                    opacity={opacity}
                    rx="1"
                  />
                )}
              </g>

              {/* normal = horizontal (⊥ to vertical interface) */}
              {showNormal && (
                <line
                  x1={cx - 95}
                  y1={cy}
                  x2={cx + 95}
                  y2={cy}
                  stroke="#64748b"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                />
              )}

              {/* protractor hint around normal */}
              {showProtractor && (
                <path
                  d={`M ${cx} ${cy} m -70 0 a 70 70 0 0 1 70 -70`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  opacity="0.7"
                />
              )}

              {/* incident ray */}
              <line
                x1={incidentEnd.x}
                y1={incidentEnd.y}
                x2={cx}
                y2={cy}
                stroke={mode === "laser" ? mono.color : "#f8fafc"}
                strokeWidth={mode === "white" ? 5 : 4}
                opacity={opacity}
                strokeLinecap="round"
              />
              {mode === "white" && (
                <line
                  x1={incidentEnd.x}
                  y1={incidentEnd.y}
                  x2={cx}
                  y2={cy}
                  stroke="#fde047"
                  strokeWidth="2"
                  opacity={opacity * 0.8}
                />
              )}

              {/* wave fronts hint */}
              {waveOn && (
                <g opacity="0.45">
                  {[0, 1, 2, 3].map((k) => {
                    const t = 0.2 + k * 0.18;
                    const x = incidentEnd.x + (cx - incidentEnd.x) * t;
                    const y = incidentEnd.y + (cy - incidentEnd.y) * t;
                    return (
                      <line
                        key={k}
                        x1={x - 8}
                        y1={y - 10}
                        x2={x + 8}
                        y2={y + 10}
                        stroke="#fff"
                        strokeWidth="2"
                      />
                    );
                  })}
                </g>
              )}

              {/* reflected */}
              {showReflect && (
                <line
                  x1={cx}
                  y1={cy}
                  x2={reflectEnd.x}
                  y2={reflectEnd.y}
                  stroke={mode === "laser" ? mono.color : "#e2e8f0"}
                  strokeWidth="3.5"
                  opacity={opacity * 0.75}
                  strokeLinecap="round"
                />
              )}

              {/* refracted / dispersed: interface → cup → screen */}
              {showRefract &&
                rays.map((ray) => {
                  if (ray.visualDeg == null || !ray.cupPt || !ray.hit) return null;
                  return (
                    <g key={ray.id}>
                      <polyline
                        points={`${cx},${cy} ${ray.cupPt.x},${ray.cupPt.y} ${ray.hit.x},${ray.hit.y}`}
                        fill="none"
                        stroke={ray.color}
                        strokeWidth={mode === "white" ? 2.8 : 4}
                        opacity={opacity}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  );
                })}

              {/* angle labels */}
              <text x={cx - 78} y={cy - 10} fontSize="11" fontWeight="700" fill="#0f172a">
                θᵢ {incidentDeg.toFixed(0)}°
              </text>
              {showReflect && (
                <text x={cx - 78} y={cy + 28} fontSize="11" fontWeight="700" fill="#0f172a">
                  θᵣ {reflectedDeg.toFixed(0)}°
                </text>
              )}
              {showRefract && mode === "white" && rays[3]?.refracted != null && (
                <text x={cx + 12} y={cy - 12} fontSize="11" fontWeight="700" fill="#0f172a">
                  θ₂≈{rays[3].refracted.toFixed(1)}° · {tx("色散", "spread")}
                </text>
              )}
              {showRefract && mode === "laser" && rays[0]?.refracted != null && (
                <text x={cx + 12} y={cy - 12} fontSize="11" fontWeight="700" fill="#0f172a">
                  θ₂ {rays[0].refracted.toFixed(1)}°
                </text>
              )}
              {showRefract && mode === "white" && screenHits.length > 0 && (
                <text
                  x={SCREEN_X - 6}
                  y={SCREEN_TOP - 14}
                  textAnchor="end"
                  fontSize="10"
                  fontWeight="700"
                  fill="#0f172a"
                >
                  {tx("光譜隨 θᵢ 移動", "Spectrum moves with θᵢ")}
                </text>
              )}
              {showRefract && rays.some((r) => r.refracted == null) && (
                <text x={cx + 20} y={cy + 40} fontSize="12" fontWeight="800" fill="#b91c1c">
                  {tx("全反射！", "Total internal reflection!")}
                </text>
              )}

              {/* laser / sun icon */}
              <g transform={`translate(${incidentEnd.x - 16}, ${incidentEnd.y - 16})`}>
                <circle r="12" fill={mode === "laser" ? mono.color : "#facc15"} />
                <text
                  textAnchor="middle"
                  y="4"
                  fontSize="10"
                  fontWeight="800"
                  fill="#0f172a"
                >
                  {mode === "laser" ? "L" : "☀"}
                </text>
              </g>
            </svg>
          </div>
          <p className="mt-2 text-center text-[11px] font-semibold text-slate-700">
            {tx(
              "光線會穿過玻璃杯再到螢幕；拉動入射角可看到彩虹上下移動與分開",
              "The ray goes through the glass to the screen. Drag the angle to move and spread the rainbow.",
            )}
          </p>
        </div>

        {/* Control panel */}
        <aside className="w-full shrink-0 border-t border-slate-400/30 bg-[#f0f4f7] lg:w-72 lg:border-l lg:border-t-0">
          <div className="border-b border-slate-300 bg-[#dfe6ec] px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-700">
            {tx("控制面板", "Controls")}
          </div>
          <div className="max-h-[50vh] overflow-y-auto px-3 py-1 lg:max-h-none">
            <Control label={tx("光源", "Light source")}>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode("white")}
                  className={`flex-1 rounded-md px-2 py-2 text-xs font-bold ${
                    mode === "white"
                      ? "bg-amber-400 text-slate-900 ring-2 ring-amber-600"
                      : "bg-white text-slate-700 ring-1 ring-slate-300"
                  }`}
                >
                  {tx("白光 ☀", "White ☀")}
                </button>
                <button
                  type="button"
                  onClick={() => setMode("laser")}
                  className={`flex-1 rounded-md px-2 py-2 text-xs font-bold ${
                    mode === "laser"
                      ? "bg-amber-400 text-slate-900 ring-2 ring-amber-600"
                      : "bg-white text-slate-700 ring-1 ring-slate-300"
                  }`}
                >
                  {tx("雷射", "Laser")}
                </button>
              </div>
              {mode === "laser" && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {SPECTRUM.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      title={tx(s.name, s.nameEn)}
                      onClick={() => setLaserColor(s.id)}
                      className={`h-7 w-7 rounded-full ring-2 ${
                        laserColor === s.id ? "ring-slate-800" : "ring-transparent"
                      }`}
                      style={{ background: s.color }}
                    />
                  ))}
                </div>
              )}
            </Control>

            <Control label={tx("入射角 θᵢ（相對法線）", "Incident angle θᵢ (from normal)")}>
              <input
                type="range"
                min="8"
                max="70"
                value={incidentDeg}
                onChange={(e) => setIncidentDeg(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <p className="mt-1 text-center text-sm font-bold text-ink">
                {incidentDeg}°
              </p>
            </Control>

            <Control label={tx("介質（右邊）", "Material (right side)")}>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-2 py-2 text-sm font-semibold"
              >
                <option value="water">{tx("玻璃杯 · 水", "Glass of water")}</option>
                <option value="glass">{tx("玻璃稜鏡", "Glass prism")}</option>
              </select>
            </Control>

            <Control label={tx("強度", "Brightness")}>
              <input
                type="range"
                min="20"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </Control>

            <Control label={tx("顯示", "Show")}>
              <div className="space-y-2">
                <Toggle checked={showReflect} onChange={setShowReflect}>
                  {tx("反射光線（θᵣ = θᵢ）", "Reflected ray (θᵣ = θᵢ)")}
                </Toggle>
                <Toggle checked={showRefract} onChange={setShowRefract}>
                  {tx("折射／色散光線", "Refracted / spread rays")}
                </Toggle>
                <Toggle checked={showNormal} onChange={setShowNormal}>
                  {tx("法線", "Normal")}
                </Toggle>
                <Toggle checked={showProtractor} onChange={setShowProtractor}>
                  {tx("量角器", "Protractor")}
                </Toggle>
                <Toggle checked={waveOn} onChange={setWaveOn}>
                  {tx("波前示意", "Wave fronts")}
                </Toggle>
              </div>
            </Control>

            <Control label={tx("定律小抄", "Quick laws")}>
              <ul className="space-y-1.5 text-xs leading-relaxed text-slate-700">
                <li>
                  <strong>{tx("反射：", "Reflection: ")}</strong>
                  {tx("入射角 = 反射角", "angle in = angle out")}
                </li>
                <li>
                  <strong>{tx("折射：", "Refraction: ")}</strong>
                  n₁ sin θ₁ = n₂ sin θ₂
                </li>
                <li>
                  <strong>{tx("色散：", "Dispersion: ")}</strong>
                  {tx(
                    "白光中各色 n 略不同 → 彩虹；θᵢ 愈大，螢幕上光譜位置與分開程度愈明顯",
                    "colors in white light have slightly different n → rainbow. A bigger θᵢ moves and spreads the spectrum more.",
                  )}
                </li>
              </ul>
            </Control>
          </div>
        </aside>
      </div>
    </div>
  );
}
