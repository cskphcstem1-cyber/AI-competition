import { Link } from "react-router-dom";
import { useLang } from "../contexts/LangContext";

const STAGES = [
  {
    id: "evaporation",
    en: "Evaporation",
    zh: "蒸發",
    desc: "河、湖、海洋的水變成水蒸氣升上天",
    descEn: "Water from rivers, lakes, and oceans turns into vapor and rises",
    accent: "from-amber-500 to-orange-400",
    mark: "1",
  },
  {
    id: "transpiration",
    en: "Transpiration",
    zh: "蒸騰",
    desc: "植物也會把水蒸氣釋放到空氣中",
    descEn: "Plants also release water vapor into the air",
    accent: "from-emerald-500 to-lime-400",
    mark: "2",
  },
  {
    id: "condensation",
    en: "Condensation",
    zh: "凝結",
    desc: "水蒸氣遇冷變成小水滴，聚成雲",
    descEn: "Water vapor cools into tiny drops that gather as clouds",
    accent: "from-sky-500 to-cyan-400",
    mark: "3",
  },
  {
    id: "precipitation",
    en: "Precipitation",
    zh: "降水",
    desc: "雲裡的水滴變大，落成雨或雪",
    descEn: "Cloud drops grow bigger and fall as rain or snow",
    accent: "from-indigo-500 to-blue-400",
    mark: "4",
  },
];

function CycleDiagram({ tx }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 p-4 shadow-sm sm:p-6">
      <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-sky-700">
        How does the water cycle work?
      </p>
      <svg viewBox="0 0 640 360" className="mx-auto h-auto w-full max-w-3xl">
        {/* sky */}
        <rect width="640" height="220" fill="#bae6fd" />
        {/* mountains */}
        <path d="M0 220 L120 90 L220 220 Z" fill="#60a5fa" />
        <path d="M160 220 L300 60 L440 220 Z" fill="#3b82f6" />
        <path d="M360 220 L500 100 L640 220 Z" fill="#93c5fd" />
        <path d="M260 100 L300 60 L340 100 Z" fill="#e0f2fe" />
        {/* forest */}
        <g fill="#16a34a">
          {[80, 130, 180, 400, 450, 500, 550].map((x) => (
            <path key={x} d={`M${x} 220 L${x + 18} 160 L${x + 36} 220 Z`} />
          ))}
        </g>
        {/* ground */}
        <rect y="220" width="640" height="90" fill="#86efac" />
        <rect y="300" width="640" height="60" fill="#a16207" />
        {/* river */}
        <path
          d="M0 250 Q160 240 280 255 T520 250 T640 260 L640 290 Q480 275 300 285 T0 280 Z"
          fill="#38bdf8"
        />
        {/* cloud left */}
        <ellipse cx="160" cy="70" rx="50" ry="24" fill="#fff" />
        <ellipse cx="130" cy="78" rx="28" ry="16" fill="#fff" />
        <ellipse cx="190" cy="78" rx="30" ry="16" fill="#fff" />
        {/* rain cloud */}
        <ellipse cx="480" cy="80" rx="48" ry="22" fill="#e2e8f0" />
        <ellipse cx="450" cy="88" rx="26" ry="14" fill="#e2e8f0" />
        <ellipse cx="510" cy="88" rx="28" ry="14" fill="#e2e8f0" />
        {[450, 470, 490, 510].map((x, i) => (
          <path
            key={x}
            d={`M${x} 105 q4 12 0 20`}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            opacity={0.8 - i * 0.05}
          />
        ))}

        {/* arrows + labels */}
        <path d="M520 230 Q560 180 520 120" fill="none" stroke="#fff" strokeWidth="4" markerEnd="url(#arrow)" />
        <rect x="470" y="155" width="150" height="36" rx="10" fill="#fff" opacity="0.95" />
        <text x="545" y="170" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">
          Evaporation
        </text>
        <text x="545" y="184" textAnchor="middle" fontSize="9" fill="#475569">
          {tx("蒸發 · 河湖海", "vapor from rivers")}
        </text>

        <path d="M100 165 Q80 120 140 90" fill="none" stroke="#fff" strokeWidth="4" markerEnd="url(#arrow)" />
        <rect x="20" y="110" width="130" height="36" rx="10" fill="#fff" opacity="0.95" />
        <text x="85" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">
          Transpiration
        </text>
        <text x="85" y="139" textAnchor="middle" fontSize="9" fill="#475569">
          {tx("蒸騰 · 植物", "from plants")}
        </text>

        <rect x="115" y="48" width="100" height="28" rx="10" fill="#fff" opacity="0.95" />
        <text x="165" y="66" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">
          {tx("Condensation 凝結", "Condensation")}
        </text>

        <rect x="430" y="30" width="110" height="28" rx="10" fill="#fff" opacity="0.95" />
        <text x="485" y="48" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f172a">
          {tx("Precipitation 降水", "Precipitation")}
        </text>
        <path d="M485 110 L485 200" fill="none" stroke="#fff" strokeWidth="4" markerEnd="url(#arrow)" />

        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#fff" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}

export default function WaterCycle() {
  const { lang, tx } = useLang();
  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-6">
          <Link
            to="/science"
            className="mb-2 inline-block text-xs font-bold text-sky-700 hover:underline"
          >
            {tx("← 科學總覽", "← Science home")}
          </Link>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-600">
            Earth Science · Water Cycle
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {tx("水循環", "Water Cycle")}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {tx(
              "地球上的水會不斷循環：蒸發、蒸騰、凝結、降水。每一個部分都有一個小實驗可以動手學。",
              "Earth's water keeps cycling: evaporation, transpiration, condensation, and precipitation. Each part has a small hands-on experiment.",
            )}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] lg:items-start">
          <div>
            <p className="mb-4 text-sm font-semibold text-muted">
              {tx("為每一個部分做實驗", "Try an experiment for each part")}
            </p>
            <div className="grid gap-4">
              {STAGES.map((stage) => (
                <Link
                  key={stage.id}
                  to={`/science/water-cycle/${stage.id}`}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-sky-400 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${stage.accent} font-mono text-sm font-bold text-white`}
                    >
                      {stage.mark}
                    </span>
                    <div>
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                        {stage.en}
                      </p>
                      <h2 className="text-lg font-bold text-ink">
                        {lang === "en" ? stage.en : stage.zh}
                      </h2>
                      <p className="mt-1 text-sm text-muted">
                        {tx(stage.desc, stage.descEn)}
                      </p>
                      <p className="mt-3 text-sm font-bold text-sky-700">
                        {tx("開始實驗 →", "Start experiment →")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <p className="mt-6 rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
              {tx("想在罐子裡做出雲？那個實驗仍在 ", "Want to make a cloud in a jar? That lab is still in ")}
              <Link to="/science/cloud" className="font-bold underline">
                {tx("雲的形成", "Cloud formation")}
              </Link>
              {tx("，沒有改動。", ".")}
            </p>
          </div>
          <CycleDiagram tx={tx} />
        </div>
      </div>
    </div>
  );
}
