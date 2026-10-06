import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useLang } from "../contexts/LangContext";

const STAGES = {
  evaporation: {
    en: "Evaporation",
    zh: "蒸發",
    accent: "amber",
    intro:
      "太陽把河、湖、海的水加熱，水會變成看不見的水蒸氣升上天。這就是蒸發。",
    introEn:
      "The sun heats water in rivers, lakes, and oceans. The water turns into invisible vapor and rises. That is evaporation.",
    materials: [
      "兩個淺盤子或碟子",
      "等量清水（各約 2 湯匙）",
      "溫暖陽光處（或檯燈）",
      "陰涼處",
      "記號筆（在盤子外側標水位）",
    ],
    materialsEn: [
      "Two shallow plates or dishes",
      "The same amount of water (about 2 spoonfuls each)",
      "A warm sunny spot (or a lamp)",
      "A cool shady spot",
      "A marker (mark the water line on the outside)",
    ],
    steps: [
      {
        id: "fill",
        title: "1. 倒進等量的水",
        titleEn: "1. Pour the same amount of water",
        blurb: "兩個盤子各倒一樣多的水，用記號筆在外側標出水面高度。",
        blurbEn: "Pour the same amount into each plate. Mark the water height on the outside.",
        tip: "一開始水量要一樣，才好比較。",
        tipEn: "Start with the same amount so you can compare fairly.",
      },
      {
        id: "place",
        title: "2. 一個暖、一個涼",
        titleEn: "2. One warm, one cool",
        blurb: "一個盤子放在陽光或檯燈下，另一個放在陰涼處。",
        blurbEn: "Put one plate in sun or under a lamp. Put the other in the shade.",
        tip: "暖的地方代表被太陽加熱的河湖海。",
        tipEn: "The warm place is like a river or ocean heated by the sun.",
      },
      {
        id: "wait",
        title: "3. 等一段時間",
        titleEn: "3. Wait a while",
        blurb: "等 30～60 分鐘（或更久），不要搖動盤子。",
        blurbEn: "Wait 30–60 minutes (or longer). Do not shake the plates.",
        tip: "水蒸發很慢，要有耐心。",
        tipEn: "Water evaporates slowly. Be patient.",
      },
      {
        id: "compare",
        title: "4. 比較水位",
        titleEn: "4. Compare the water lines",
        blurb: "看哪個盤子的水位降得比較多。",
        blurbEn: "See which plate lost more water.",
        tip: "暖盤水分較少＝蒸發較快。",
        tipEn: "Less water in the warm plate means faster evaporation.",
      },
    ],
  },
  transpiration: {
    en: "Transpiration",
    zh: "蒸騰",
    accent: "emerald",
    intro:
      "植物的葉子也會放出水蒸氣。把袋子套在葉子上，就能「抓住」這些水。",
    introEn:
      "Plant leaves also give off water vapor. Put a bag over the leaves to catch that water.",
    materials: [
      "一株有綠葉的植物（盆栽或戶外小枝）",
      "透明塑膠袋",
      "綁帶或橡皮筋",
      "陽光或明亮處",
    ],
    materialsEn: [
      "A green leafy plant (a pot or a small outdoor branch)",
      "A clear plastic bag",
      "A twist tie or rubber band",
      "Sunlight or a bright spot",
    ],
    steps: [
      {
        id: "pick",
        title: "1. 選幾片健康的葉子",
        titleEn: "1. Choose a few healthy leaves",
        blurb: "選幾片綠葉，不要摘下來。",
        blurbEn: "Pick a few green leaves. Do not pick them off the plant.",
        tip: "健康的葉子蒸騰比較明顯。",
        tipEn: "Healthy leaves show transpiration more clearly.",
      },
      {
        id: "bag",
        title: "2. 套上塑膠袋",
        titleEn: "2. Put on a plastic bag",
        blurb: "把透明袋輕輕套住葉子，用橡皮筋在葉柄附近綁緊（不要勒傷枝幹）。",
        blurbEn: "Gently bag the leaves. Tie near the stem (do not pinch the branch too hard).",
        tip: "袋子用來收集葉子放出的水蒸氣。",
        tipEn: "The bag collects vapor from the leaves.",
      },
      {
        id: "sun",
        title: "3. 放在光亮處",
        titleEn: "3. Place it in the light",
        blurb: "把植物放在陽光或窗邊約 1～2 小時。",
        blurbEn: "Put the plant in sunlight or by a window for about 1–2 hours.",
        tip: "光和熱會讓蒸騰加快。",
        tipEn: "Light and heat speed up transpiration.",
      },
      {
        id: "drops",
        title: "4. 觀察水珠",
        titleEn: "4. Watch for water drops",
        blurb: "看袋子內壁有沒有小小水珠。",
        blurbEn: "Look for tiny drops on the inside of the bag.",
        tip: "這些水珠來自植物，不是從外面灑進去的。",
        tipEn: "These drops come from the plant, not from water poured in.",
      },
    ],
  },
  condensation: {
    en: "Condensation",
    zh: "凝結",
    accent: "sky",
    intro:
      "水蒸氣遇到冷的東西會變成小水滴。雲就是高空裡很多很多小水滴聚在一起。",
    introEn:
      "Water vapor turns into tiny drops when it hits something cold. A cloud is lots of those drops high in the sky.",
    materials: [
      "透明玻璃杯",
      "冰塊與冷水",
      "紙巾（擦乾杯外壁）",
      "室溫環境",
    ],
    materialsEn: [
      "A clear glass",
      "Ice cubes and cold water",
      "A paper towel (dry the outside of the glass)",
      "A room-temperature place",
    ],
    steps: [
      {
        id: "dry",
        title: "1. 擦乾杯子",
        titleEn: "1. Dry the glass",
        blurb: "先把杯外壁擦乾，確認外面沒有水。",
        blurbEn: "Dry the outside of the glass so there is no water on it.",
        tip: "一開始要乾，才知道水珠是後來出現的。",
        tipEn: "Start dry so you know the drops appear later.",
      },
      {
        id: "ice",
        title: "2. 倒進冰水",
        titleEn: "2. Add ice water",
        blurb: "杯裡放冰塊，再倒入冷水。",
        blurbEn: "Put ice in the glass, then pour in cold water.",
        tip: "杯子會變得很冷。",
        tipEn: "The glass will get very cold.",
      },
      {
        id: "wait",
        title: "3. 等一等",
        titleEn: "3. Wait a bit",
        blurb: "把杯子放在桌上 2～5 分鐘，不要擦外壁。",
        blurbEn: "Leave the glass on the table for 2–5 minutes. Do not wipe the outside.",
        tip: "空氣裡的水蒸氣碰到冷杯壁。",
        tipEn: "Water vapor in the air hits the cold glass wall.",
      },
      {
        id: "beads",
        title: "4. 看水珠出現",
        titleEn: "4. Watch drops appear",
        blurb: "杯外壁會出現一層水珠或水霧。",
        blurbEn: "Tiny drops or fog will form on the outside of the glass.",
        tip: "這就是凝結——和雲形成的原理一樣。",
        tipEn: "That is condensation — the same idea as cloud formation.",
      },
    ],
  },
  precipitation: {
    en: "Precipitation",
    zh: "降水",
    accent: "indigo",
    intro:
      "雲裡的小水滴愈長愈大，重到空氣撐不住時就落下來——那就是雨（或雪）。",
    introEn:
      "Tiny drops in a cloud grow bigger. When they get too heavy, they fall — that is rain (or snow).",
    materials: [
      "透明杯子",
      "清水（約半杯）",
      "刮鬍泡或泡沫膏（當「雲」）",
      "食用色素或有色水（當「雨」）",
    ],
    materialsEn: [
      "A clear cup",
      "Clear water (about half a cup)",
      "Shaving foam (this is the “cloud”)",
      "Food coloring or colored water (this is the “rain”)",
    ],
    steps: [
      {
        id: "water",
        title: "1. 倒半杯清水",
        titleEn: "1. Pour half a cup of water",
        blurb: "杯裡的水代表天空下面的空氣。",
        blurbEn: "The water in the cup stands for the air under the sky.",
        tip: "水先不要加顏色。",
        tipEn: "Do not color the water yet.",
      },
      {
        id: "foam",
        title: "2. 鋪一層泡沫雲",
        titleEn: "2. Add a foam cloud",
        blurb: "在水面輕輕鋪一層刮鬍泡，當作雲。",
        blurbEn: "Gently spread a layer of foam on the water. This is the cloud.",
        tip: "雲是很多小水滴聚在一起。",
        tipEn: "A cloud is many tiny drops together.",
      },
      {
        id: "dye",
        title: "3. 滴上「雨水」",
        titleEn: "3. Drip on “rain”",
        blurb: "慢慢把幾滴食用色素滴在泡沫上。",
        blurbEn: "Slowly drip a few drops of food coloring onto the foam.",
        tip: "色素代表愈來愈大的水滴。",
        tipEn: "The color stands for drops that are getting bigger.",
      },
      {
        id: "rain",
        title: "4. 看雨落下",
        titleEn: "4. Watch the rain fall",
        blurb: "當泡沫「雲」撐不住時，有色水會穿過雲往下掉。",
        blurbEn: "When the foam “cloud” cannot hold it, colored water falls through.",
        tip: "這就像降水：雲太重就下雨。",
        tipEn: "This is like precipitation: a heavy cloud rains.",
      },
    ],
  },
};

const ACCENT = {
  amber: {
    badge: "bg-amber-500",
    ring: "border-amber-200",
    soft: "bg-amber-50 text-amber-900",
    btn: "bg-amber-600 hover:bg-amber-700",
    stepOn: "border-amber-500 bg-amber-50",
  },
  emerald: {
    badge: "bg-emerald-500",
    ring: "border-emerald-200",
    soft: "bg-emerald-50 text-emerald-900",
    btn: "bg-emerald-600 hover:bg-emerald-700",
    stepOn: "border-emerald-500 bg-emerald-50",
  },
  sky: {
    badge: "bg-sky-500",
    ring: "border-sky-200",
    soft: "bg-sky-50 text-sky-900",
    btn: "bg-sky-600 hover:bg-sky-700",
    stepOn: "border-sky-500 bg-sky-50",
  },
  indigo: {
    badge: "bg-indigo-500",
    ring: "border-indigo-200",
    soft: "bg-indigo-50 text-indigo-900",
    btn: "bg-indigo-600 hover:bg-indigo-700",
    stepOn: "border-indigo-500 bg-indigo-50",
  },
};

function EvaporationVisual({ stepId, tx }) {
  const warmLow = stepId === "compare" || stepId === "wait";
  const warmGone = stepId === "compare";
  return (
    <svg viewBox="0 0 280 200" className="mx-auto h-56 w-full max-w-sm">
      <rect width="280" height="200" rx="16" fill="#fff7ed" />
      {/* sun */}
      {(stepId === "place" || stepId === "wait" || stepId === "compare") && (
        <g>
          <circle cx="220" cy="36" r="18" fill="#fbbf24" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a}
              x1={220 + Math.cos((a * Math.PI) / 180) * 24}
              y1={36 + Math.sin((a * Math.PI) / 180) * 24}
              x2={220 + Math.cos((a * Math.PI) / 180) * 32}
              y2={36 + Math.sin((a * Math.PI) / 180) * 32}
              stroke="#f59e0b"
              strokeWidth="2"
            />
          ))}
        </g>
      )}
      {/* warm dish */}
      <ellipse cx="80" cy="150" rx="50" ry="14" fill="#fdba74" />
      <path d="M30 150 Q30 120 80 120 Q130 120 130 150" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
      {(stepId === "fill" || stepId === "place" || stepId === "wait" || stepId === "compare") && (
        <ellipse
          cx="80"
          cy={warmGone ? 142 : warmLow ? 138 : 132}
          rx="42"
          ry="8"
          fill="#38bdf8"
          opacity={warmGone ? 0.35 : 0.85}
        />
      )}
      {(stepId === "wait" || stepId === "compare") &&
        [0, 1, 2].map((i) => (
          <circle key={i} cx={60 + i * 18} cy={100 - i * 8} r="3" fill="#7dd3fc" opacity="0.7">
            <animate attributeName="cy" values={`${110 - i * 5};${70 - i * 10}`} dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0" dur="1.4s" repeatCount="indefinite" />
          </circle>
        ))}
      <text x="80" y="178" textAnchor="middle" fontSize="11" fill="#9a3412" fontWeight="700">
        {tx("溫暖處", "Warm")}
      </text>
      {/* cool dish */}
      <ellipse cx="200" cy="150" rx="50" ry="14" fill="#cbd5e1" />
      <path d="M150 150 Q150 120 200 120 Q250 120 250 150" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
      {(stepId === "fill" || stepId === "place" || stepId === "wait" || stepId === "compare") && (
        <ellipse cx="200" cy={stepId === "compare" ? 134 : 132} rx="42" ry="8" fill="#38bdf8" opacity="0.85" />
      )}
      <text x="200" y="178" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="700">
        {tx("陰涼處", "Cool")}
      </text>
    </svg>
  );
}

function TranspirationVisual({ stepId }) {
  const showBag = stepId === "bag" || stepId === "sun" || stepId === "drops";
  const showDrops = stepId === "drops";
  return (
    <svg viewBox="0 0 240 220" className="mx-auto h-56 w-full max-w-xs">
      <rect width="240" height="220" rx="16" fill="#ecfdf5" />
      {/* pot */}
      <path d="M90 170 L100 200 H140 L150 170 Z" fill="#b45309" />
      <rect x="85" y="162" width="70" height="12" rx="3" fill="#d97706" />
      {/* stem + leaves */}
      <path d="M120 162 L120 90" stroke="#15803d" strokeWidth="4" />
      <ellipse cx="95" cy="110" rx="22" ry="10" fill="#22c55e" transform="rotate(-25 95 110)" />
      <ellipse cx="145" cy="100" rx="22" ry="10" fill="#16a34a" transform="rotate(20 145 100)" />
      <ellipse cx="105" cy="85" rx="18" ry="9" fill="#4ade80" transform="rotate(-10 105 85)" />
      {showBag && (
        <path
          d="M70 70 Q70 40 120 40 Q170 40 170 70 L170 130 Q120 145 70 130 Z"
          fill="rgba(255,255,255,0.45)"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
      )}
      {showDrops &&
        [
          [95, 75],
          [130, 85],
          [110, 100],
          [145, 70],
        ].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y} rx="4" ry="6" fill="#38bdf8" opacity="0.85" />
        ))}
      {(stepId === "sun" || stepId === "drops") && (
        <circle cx="200" cy="40" r="14" fill="#fbbf24" />
      )}
    </svg>
  );
}

function CondensationVisual({ stepId, tx }) {
  const hasIce = stepId === "ice" || stepId === "wait" || stepId === "beads";
  const hasBeads = stepId === "beads" || stepId === "wait";
  return (
    <svg viewBox="0 0 200 220" className="mx-auto h-56 w-full max-w-xs">
      <rect width="200" height="220" rx="16" fill="#f0f9ff" />
      <ellipse cx="100" cy="200" rx="50" ry="8" fill="#cbd5e1" opacity="0.6" />
      <path
        d="M60 50 L55 170 Q55 190 100 190 Q145 190 145 170 L140 50 Z"
        fill="rgba(186,230,253,0.35)"
        stroke="#0284c7"
        strokeWidth="3"
      />
      {hasIce && (
        <>
          <rect x="70" y="100" width="60" height="70" rx="4" fill="#7dd3fc" opacity="0.55" />
          <rect x="78" y="108" width="18" height="14" rx="2" fill="#e0f2fe" />
          <rect x="102" y="118" width="16" height="12" rx="2" fill="#bae6fd" />
          <rect x="88" y="132" width="20" height="14" rx="2" fill="#e0f2fe" />
        </>
      )}
      {hasBeads &&
        [
          [58, 90],
          [56, 110],
          [57, 130],
          [142, 95],
          [144, 120],
          [143, 145],
          [62, 150],
          [138, 80],
        ].map(([x, y], i) => (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx="3"
            ry="5"
            fill="#38bdf8"
            opacity={stepId === "beads" ? 0.9 : 0.35}
          />
        ))}
      {stepId === "dry" && (
        <text x="100" y="120" textAnchor="middle" fontSize="12" fill="#64748b">
          {tx("外壁乾燥", "Outside dry")}
        </text>
      )}
    </svg>
  );
}

function PrecipitationVisual({ stepId }) {
  const hasFoam = stepId === "foam" || stepId === "dye" || stepId === "rain";
  const hasDye = stepId === "dye" || stepId === "rain";
  const raining = stepId === "rain";
  return (
    <svg viewBox="0 0 200 220" className="mx-auto h-56 w-full max-w-xs">
      <rect width="200" height="220" rx="16" fill="#eef2ff" />
      <path
        d="M55 40 L50 180 Q50 200 100 200 Q150 200 150 180 L145 40 Z"
        fill="rgba(199,210,254,0.4)"
        stroke="#4f46e5"
        strokeWidth="3"
      />
      {(stepId === "water" || hasFoam || hasDye) && (
        <rect x="52" y="120" width="96" height="70" rx="2" fill="#38bdf8" opacity="0.45" />
      )}
      {hasFoam && (
        <g>
          <ellipse cx="100" cy="105" rx="42" ry="18" fill="#f8fafc" />
          <ellipse cx="78" cy="100" rx="18" ry="12" fill="#fff" />
          <ellipse cx="120" cy="98" rx="20" ry="13" fill="#fff" />
          <ellipse cx="100" cy="90" rx="22" ry="12" fill="#f1f5f9" />
        </g>
      )}
      {hasDye && !raining && (
        <g>
          <circle cx="90" cy="95" r="4" fill="#e11d48" />
          <circle cx="110" cy="92" r="3" fill="#db2777" />
          <circle cx="100" cy="102" r="3" fill="#f43f5e" />
        </g>
      )}
      {raining &&
        [70, 85, 100, 115, 130].map((x, i) => (
          <g key={x}>
            <line
              x1={x}
              y1="110"
              x2={x}
              y2="160"
              stroke="#e11d48"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.75"
            >
              <animate attributeName="y1" values="105;140" dur={`${0.8 + i * 0.1}s`} repeatCount="indefinite" />
              <animate attributeName="y2" values="125;175" dur={`${0.8 + i * 0.1}s`} repeatCount="indefinite" />
            </line>
          </g>
        ))}
      {raining && <rect x="52" y="150" width="96" height="40" rx="2" fill="#f43f5e" opacity="0.35" />}
    </svg>
  );
}

function StageVisual({ stageId, stepId, tx }) {
  if (stageId === "evaporation") return <EvaporationVisual stepId={stepId} tx={tx} />;
  if (stageId === "transpiration") return <TranspirationVisual stepId={stepId} />;
  if (stageId === "condensation") return <CondensationVisual stepId={stepId} tx={tx} />;
  return <PrecipitationVisual stepId={stepId} />;
}

export default function WaterCycleExperiment() {
  const { tx } = useLang();
  const { stageId } = useParams();
  const stage = STAGES[stageId];
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setStepIndex(0);
    setDone(false);
  }, [stageId]);

  const accent = stage ? ACCENT[stage.accent] : null;
  const step = stage?.steps[stepIndex];
  const isLast = stage ? stepIndex === stage.steps.length - 1 : false;

  const nextLabel = useMemo(() => {
    if (!stage) return "";
    if (done) return tx("再做一次", "Try again");
    if (isLast) return tx("完成實驗", "Finish lab");
    return tx("下一步", "Next");
  }, [stage, done, isLast, tx]);

  if (!stage) {
    return <Navigate to="/science/water-cycle" replace />;
  }

  function goNext() {
    if (done) {
      setStepIndex(0);
      setDone(false);
      return;
    }
    if (isLast) {
      setDone(true);
      return;
    }
    setStepIndex((i) => i + 1);
  }

  function goPrev() {
    if (done) {
      setDone(false);
      return;
    }
    setStepIndex((i) => Math.max(0, i - 1));
  }

  const others = Object.entries(STAGES).filter(([id]) => id !== stageId);

  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-6">
          <Link
            to="/science/water-cycle"
            className="mb-2 inline-block text-xs font-bold text-sky-700 hover:underline"
          >
            {tx("← 水循環", "← Water cycle")}
          </Link>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-600">
            Water Cycle · {stage.en}
          </p>
          <div className="mt-1 flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent.badge} text-sm font-bold text-white`}
            >
              {stage.zh.slice(0, 1)}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-ink">
              {tx(stage.zh, stage.en)}
              <span className="ml-2 text-lg font-semibold text-muted">{stage.en}</span>
            </h1>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {tx(stage.intro, stage.introEn)}
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start">
          <div className="space-y-4">
            <div className={`overflow-hidden rounded-2xl border ${accent.ring} bg-white p-4 shadow-sm`}>
              {done ? (
                <p className={`rounded-xl px-3 py-2 text-sm font-semibold ${accent.soft}`}>
                  {tx(
                    `太棒了！你完成了「${stage.zh}」實驗。試試其他部分，或回到水循環總覽。`,
                    `Great job! You finished the ${stage.en} lab. Try another part, or go back to the water cycle page.`,
                  )}
                </p>
              ) : (
                <div>
                  <p className="text-base font-bold text-ink">
                    {tx(step.title, step.titleEn)}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {tx(step.blurb, step.blurbEn)}
                  </p>
                  <p className={`mt-2 rounded-lg px-3 py-2 text-xs font-medium ${accent.soft}`}>
                    {tx("小提示：", "Tip: ")}
                    {tx(step.tip, step.tipEn)}
                  </p>
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={stepIndex === 0 && !done}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-ink disabled:opacity-40"
                >
                  {tx("上一步", "Back")}
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className={`rounded-xl px-4 py-2 text-sm font-bold text-white ${accent.btn}`}
                >
                  {nextLabel}
                </button>
              </div>
              <div className="mt-4 flex gap-1.5">
                {stage.steps.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setDone(false);
                      setStepIndex(i);
                    }}
                    className={`h-2 flex-1 rounded-full ${
                      i === stepIndex && !done ? accent.badge : i < stepIndex || done ? "bg-slate-400" : "bg-slate-200"
                    }`}
                    aria-label={tx(s.title, s.titleEn)}
                  />
                ))}
              </div>
            </div>

            <section className={`rounded-2xl border ${accent.ring} bg-white p-5 shadow-sm`}>
              <h2 className="text-sm font-bold text-ink">{tx("你需要", "You need")}</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {stage.materials.map((m, i) => (
                  <li key={m}>{tx(m, stage.materialsEn[i])}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-ink">{tx("其餘部分", "Other parts")}</h2>
              <ul className="mt-3 space-y-2">
                {others.map(([id, other]) => (
                  <li key={id}>
                    <Link
                      to={`/science/water-cycle/${id}`}
                      className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-ink hover:border-sky-400"
                    >
                      <span>
                        {tx(other.zh, other.en)}
                        <span className="ml-2 text-xs font-medium text-muted">{other.en}</span>
                      </span>
                      <span className="text-sky-700">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <div className="flex flex-wrap gap-3 text-sm">
              <Link to="/science/water-cycle" className="font-bold text-sky-700 hover:underline">
                {tx("← 全部四個部分", "← All four parts")}
              </Link>
              {stageId === "condensation" && (
                <Link to="/science/cloud" className="font-bold text-sky-700 hover:underline">
                  {tx("進階：罐子裡做雲（原實驗）→", "Next: make a cloud in a jar →")}
                </Link>
              )}
            </div>
          </div>

          <div className={`overflow-hidden rounded-2xl border ${accent.ring} bg-white p-4 shadow-sm`}>
            <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-muted">
              {tx("實驗台", "Lab bench")}
            </p>
            <StageVisual
              stageId={stageId}
              stepId={done ? stage.steps.at(-1).id : step.id}
              tx={tx}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
