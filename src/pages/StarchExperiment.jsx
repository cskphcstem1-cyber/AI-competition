import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../contexts/LangContext";

/**
 * Virtual lab: iodine test for starch after photosynthesis
 * Classic school experiment — destarch → light → decolourise → iodine
 */

const STEPS = [
  {
    id: "goal",
    title: "實驗目的",
    titleEn: "Goal",
    blurb: "證明：有光、有葉綠素的葉片會製造澱粉。",
    blurbEn: "Show that a leaf with light and chlorophyll makes starch.",
  },
  {
    id: "destarch",
    title: "1. 去澱粉",
    titleEn: "1. Remove starch",
    blurb: "把盆栽放在黑暗處 24–48 小時，耗盡葉內原有澱粉。",
    blurbEn: "Put the plant in the dark for 24–48 hours so old starch is used up.",
  },
  {
    id: "setup",
    title: "2. 處理葉片",
    titleEn: "2. Set up the leaf",
    blurb: "選擇實驗條件：遮光一半，或整片照光。",
    blurbEn: "Choose: cover half the leaf, or give the whole leaf light.",
  },
  {
    id: "light",
    title: "3. 照光",
    titleEn: "3. Give light",
    blurb: "把植物放到陽光（或強光）下數小時，進行光合作用。",
    blurbEn: "Put the plant in sunlight (or a strong lamp) for a few hours so it can photosynthesize.",
  },
  {
    id: "boil",
    title: "4. 熱水殺青",
    titleEn: "4. Boil in water",
    blurb: "摘下葉片，放入沸水約 1 分鐘，破壞細胞膜。",
    blurbEn: "Pick the leaf and boil it about 1 minute to break cell walls.",
  },
  {
    id: "alcohol",
    title: "5. 酒精脫色",
    titleEn: "5. Remove green color",
    blurb: "葉片放入熱酒精，除去綠色葉綠素（注意：酒精易燃，真實驗需用水浴）。",
    blurbEn: "Put the leaf in hot alcohol to remove green chlorophyll (alcohol can burn — a real lab needs a water bath).",
  },
  {
    id: "soften",
    title: "6. 溫水軟化",
    titleEn: "6. Soften in warm water",
    blurb: "用溫水沖一下，讓葉片變軟、展平。",
    blurbEn: "Rinse with warm water so the leaf becomes soft and flat.",
  },
  {
    id: "iodine",
    title: "7. 滴碘液",
    titleEn: "7. Add iodine",
    blurb: "滴上碘液。若出現藍黑色 → 有澱粉！",
    blurbEn: "Add iodine. Blue-black means starch is there!",
  },
  {
    id: "result",
    title: "結果與結論",
    titleEn: "Results and conclusion",
    blurb: "觀察顏色變化，並回答小測驗。",
    blurbEn: "Watch the color change and answer a short quiz.",
  },
];

function LeafVisual({
  stage,
  coverHalf,
  starchLeft,
  starchRight,
  tx,
}) {
  // stage: green | pale | white | iodine
  const base =
    stage === "green"
      ? "#22c55e"
      : stage === "pale"
        ? "#86efac"
        : stage === "white"
          ? "#f8fafc"
          : "#f1f5f9";
  const left =
    stage === "iodine"
      ? starchLeft
        ? "#1e3a5f"
        : "#fde68a"
      : base;
  const right =
    stage === "iodine"
      ? starchRight
        ? "#1e3a5f"
        : "#fde68a"
      : base;

  return (
    <svg viewBox="0 0 220 160" className="mx-auto h-auto w-full max-w-xs">
      {/* stem */}
      <line
        x1="110"
        y1="140"
        x2="110"
        y2="152"
        stroke="#78716c"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* left half */}
      <path
        d="M110 20 C70 28 40 55 38 90 C36 120 70 140 110 140 Z"
        fill={left}
        stroke="#57534e"
        strokeWidth="2"
      />
      {/* right half */}
      <path
        d="M110 20 C150 28 180 55 182 90 C184 120 150 140 110 140 Z"
        fill={right}
        stroke="#57534e"
        strokeWidth="2"
      />
      {/* mid vein */}
      <line
        x1="110"
        y1="28"
        x2="110"
        y2="135"
        stroke="#57534e"
        strokeWidth="1.5"
        opacity="0.5"
      />
      {/* foil cover */}
      {coverHalf && stage !== "iodine" && (
        <g>
          <rect
            x="38"
            y="45"
            width="72"
            height="70"
            rx="4"
            fill="#94a3b8"
            opacity="0.85"
            stroke="#475569"
            strokeWidth="1.5"
          />
          <text
            x="74"
            y="85"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="#1e293b"
          >
            {tx("錫箔遮光", "Foil cover")}
          </text>
        </g>
      )}
      {stage === "iodine" && (
        <>
          <text x="74" y="95" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
            {starchLeft ? tx("藍黑", "Blue-black") : tx("黃褐", "Yellow-brown")}
          </text>
          <text
            x="146"
            y="95"
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill={starchRight ? "#fff" : "#78350f"}
          >
            {starchRight ? tx("藍黑", "Blue-black") : tx("黃褐", "Yellow-brown")}
          </text>
        </>
      )}
    </svg>
  );
}

function Beaker({ label, color, bubbling }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 80 90" className="h-20 w-20">
        <path
          d="M18 10 h44 v8 l8 60 H10 l8-60 z"
          fill={color}
          stroke="#334155"
          strokeWidth="2"
        />
        <rect x="14" y="6" width="52" height="8" rx="2" fill="#cbd5e1" stroke="#334155" strokeWidth="1.5" />
        {bubbling && (
          <>
            <circle cx="32" cy="50" r="3" fill="#fff" opacity="0.6">
              <animate attributeName="cy" values="60;35" dur="1s" repeatCount="indefinite" />
            </circle>
            <circle cx="48" cy="55" r="2.5" fill="#fff" opacity="0.5">
              <animate attributeName="cy" values="65;40" dur="1.2s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </svg>
      <span className="text-[10px] font-bold text-slate-600">{label}</span>
    </div>
  );
}

export default function StarchExperiment() {
  const { tx } = useLang();
  const [step, setStep] = useState(0);
  const [coverHalf, setCoverHalf] = useState(true);
  const [doneLight, setDoneLight] = useState(false);
  const [quiz, setQuiz] = useState(null);

  const stage = useMemo(() => {
    const id = STEPS[step].id;
    if (id === "alcohol") return "pale";
    if (id === "soften") return "white";
    if (id === "iodine" || id === "result") return "iodine";
    return "green";
  }, [step]);

  // Starch forms only where light hit green tissue
  const starchL = coverHalf ? false : doneLight;
  const starchR = doneLight;

  const canNext = () => {
    const id = STEPS[step].id;
    if (id === "light" && !doneLight) return false;
    return true;
  };

  const goNext = () => {
    if (STEPS[step].id === "light") setDoneLight(true);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };

  const reset = () => {
    setStep(0);
    setCoverHalf(true);
    setDoneLight(false);
    setQuiz(null);
  };

  const current = STEPS[step];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-lime-50 via-white to-emerald-50">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <header className="mb-6">
          <Link
            to="/science"
            className="mb-2 inline-block text-xs font-bold text-emerald-700 hover:underline"
          >
            {tx("← 科學總覽", "← Science home")}
          </Link>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-lime-700">
            Biology · Photosynthesis
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {tx("光合作用：葉片澱粉檢驗", "Photosynthesis: starch test")}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            {tx(
              "碘液遇澱粉會變成藍黑色。跟著虛擬實驗步驟，證明光是製造澱粉的關鍵。",
              "Iodine turns blue-black with starch. Follow this virtual lab to show that light is needed to make starch.",
            )}
          </p>
        </header>

        {/* progress */}
        <div className="mb-5 flex gap-1 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => i <= step && setStep(i)}
              className={`h-2 min-w-[2rem] flex-1 rounded-full transition ${
                i < step
                  ? "bg-lime-500"
                  : i === step
                    ? "bg-lime-600"
                    : "bg-slate-200"
              }`}
              title={tx(s.title, s.titleEn)}
            />
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* visual bench */}
          <section className="rounded-2xl border border-lime-100 bg-white p-5 shadow-sm">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-muted">
              {tx("實驗台", "Lab bench")}
            </p>

            {(current.id === "boil" ||
              current.id === "alcohol" ||
              current.id === "soften") && (
              <div className="mb-4 flex justify-center gap-6">
                {current.id === "boil" && (
                  <Beaker label={tx("沸水", "Boiling water")} color="#7dd3fc" bubbling />
                )}
                {current.id === "alcohol" && (
                  <Beaker label={tx("熱酒精（脫色）", "Hot alcohol")} color="#fef08a" bubbling />
                )}
                {current.id === "soften" && (
                  <Beaker label={tx("溫水", "Warm water")} color="#bae6fd" />
                )}
              </div>
            )}

            {current.id === "destarch" && (
              <div className="mb-4 flex justify-center">
                <div className="rounded-xl bg-slate-800 px-6 py-8 text-center text-white shadow-inner">
                  <p className="text-3xl">🌑</p>
                  <p className="mt-2 text-sm font-bold">{tx("黑暗櫃 24–48 小時", "Dark cupboard 24–48 hours")}</p>
                  <p className="text-xs text-slate-300">{tx("葉內澱粉被耗盡", "Starch in the leaf is used up")}</p>
                </div>
              </div>
            )}

            {current.id === "light" && (
              <div className="mb-3 text-center">
                <p className="animate-pulse text-3xl">☀️</p>
                <p className="text-xs font-semibold text-amber-700">{tx("強光照射中…", "Bright light on…")}</p>
              </div>
            )}

            <LeafVisual
              stage={stage}
              coverHalf={coverHalf && current.id !== "destarch" && current.id !== "goal"}
              starchLeft={starchL}
              starchRight={starchR}
              tx={tx}
            />

            {current.id === "iodine" && (
              <p className="mt-3 text-center text-sm font-bold text-indigo-900">
                {tx("🧴 碘液已滴上", "🧴 Iodine added")}
                <span className="mt-1 block text-xs font-semibold text-muted">
                  {tx("藍黑 = 有澱粉 · 黃褐 = 無澱粉", "Blue-black = starch · Yellow-brown = no starch")}
                </span>
              </p>
            )}

            {current.id === "result" && (
              <div className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">
                <p className="font-bold">{tx("觀察結果", "What you see")}</p>
                <ul className="mt-1 list-inside list-disc text-xs leading-relaxed">
                  {coverHalf ? (
                    <>
                      <li>{tx("遮光（左）半邊：黃褐色 → 幾乎無澱粉", "Covered (left) half: yellow-brown → almost no starch")}</li>
                      <li>{tx("照光（右）半邊：藍黑色 → 有澱粉", "Lit (right) half: blue-black → starch")}</li>
                    </>
                  ) : (
                    <li>{tx("整片照光：藍黑色 → 葉片產生澱粉", "Whole leaf in light: blue-black → the leaf made starch")}</li>
                  )}
                </ul>
              </div>
            )}
          </section>

          {/* instructions */}
          <section className="flex flex-col gap-4">
            <article className="rounded-2xl bg-gradient-to-br from-lime-500 to-emerald-600 p-5 text-white shadow-md">
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-lime-100">
                Step {step + 1} / {STEPS.length}
              </p>
              <h2 className="mt-1 text-2xl font-bold">{tx(current.title, current.titleEn)}</h2>
              <p className="mt-2 text-sm leading-relaxed text-lime-50">{tx(current.blurb, current.blurbEn)}</p>
            </article>

            {current.id === "goal" && (
              <article className="rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                <p className="font-bold text-ink">{tx("光合作用簡式", "Photosynthesis in short")}</p>
                <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-ink">
                  {tx("二氧化碳 + 水", "carbon dioxide + water")}{" "}
                  <span className="text-amber-600">{tx("—光／葉綠素→", "—light / chlorophyll→")}</span>{" "}
                  {tx("葡萄糖 + 氧氣", "glucose + oxygen")}
                </p>
                <p className="mt-2 text-muted">
                  {tx("葡萄糖常轉成", "Glucose is often stored as ")}
                  <strong className="text-ink">{tx("澱粉", "starch")}</strong>
                  {tx(
                    "暫存在葉片中。碘液是檢驗澱粉的指示劑。",
                    " in the leaf. Iodine is the test for starch.",
                  )}
                </p>
              </article>
            )}

            {current.id === "setup" && (
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-3 text-sm font-bold text-ink">{tx("選擇葉片條件", "Choose a leaf setup")}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCoverHalf(true);
                      setDoneLight(false);
                    }}
                    className={`rounded-xl px-3 py-3 text-left text-xs font-bold ring-2 transition ${
                      coverHalf
                        ? "bg-lime-50 ring-lime-500 text-lime-900"
                        : "bg-white ring-slate-200 text-ink hover:ring-lime-300"
                    }`}
                  >
                    {tx("半邊錫箔遮光", "Cover half with foil")}
                    <span className="mt-1 block font-normal text-muted">
                      {tx("對照：有光 vs 無光", "Compare: light vs no light")}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCoverHalf(false);
                      setDoneLight(false);
                    }}
                    className={`rounded-xl px-3 py-3 text-left text-xs font-bold ring-2 transition ${
                      !coverHalf
                        ? "bg-lime-50 ring-lime-500 text-lime-900"
                        : "bg-white ring-slate-200 text-ink hover:ring-lime-300"
                    }`}
                  >
                    {tx("整片照光", "Whole leaf in light")}
                    <span className="mt-1 block font-normal text-muted">
                      {tx("預期整片出現澱粉", "Expect starch on the whole leaf")}
                    </span>
                  </button>
                </div>
              </article>
            )}

            {current.id === "light" && (
              <article className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
                <p className="text-sm text-amber-950">
                  {tx(
                    "點下方按鈕模擬照光完成。有光的部分才能進行光合作用製造澱粉。",
                    "Press the button to finish the light step. Only the lit part can make starch.",
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setDoneLight(true)}
                  className={`mt-3 w-full rounded-xl py-3 text-sm font-bold text-white shadow ${
                    doneLight ? "bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"
                  }`}
                >
                  {doneLight ? tx("✓ 照光完成", "✓ Light done") : tx("☀️ 開始照光", "☀️ Start light")}
                </button>
              </article>
            )}

            {current.id === "result" && (
              <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-2 text-sm font-bold text-ink">{tx("小測驗", "Quick quiz")}</p>
                <p className="mb-3 text-sm text-muted">
                  {tx("為什麼要用酒精把葉片煮到幾乎無色？", "Why do we use alcohol until the leaf looks almost white?")}
                </p>
                {[
                  { id: "a", text: tx("讓葉片更好吃", "To make the leaf tasty"), ok: false },
                  { id: "b", text: tx("除去葉綠素，方便看清碘液顏色", "To remove chlorophyll so iodine color is easy to see"), ok: true },
                  { id: "c", text: tx("增加澱粉含量", "To add more starch"), ok: false },
                ].map((opt) => {
                  let cls =
                    "mb-2 w-full rounded-xl px-3 py-2.5 text-left text-xs font-bold ring-1 ring-slate-200 hover:ring-lime-400";
                  if (quiz === opt.id) {
                    cls = opt.ok
                      ? "mb-2 w-full rounded-xl bg-emerald-500 px-3 py-2.5 text-left text-xs font-bold text-white"
                      : "mb-2 w-full rounded-xl bg-rose-500 px-3 py-2.5 text-left text-xs font-bold text-white";
                  } else if (quiz && opt.ok) {
                    cls =
                      "mb-2 w-full rounded-xl bg-emerald-100 px-3 py-2.5 text-left text-xs font-bold text-emerald-800 ring-1 ring-emerald-400";
                  }
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={quiz != null}
                      onClick={() => setQuiz(opt.id)}
                      className={cls}
                    >
                      {opt.text}
                    </button>
                  );
                })}
                {quiz && (
                  <p className="mt-2 text-xs font-semibold text-emerald-800">
                    {tx(
                      "結論：有光的綠色葉肉細胞進行光合作用 → 產生葡萄糖 → 轉成澱粉 → 碘液呈藍黑。",
                      "Conclusion: green cells in light photosynthesize → make glucose → store it as starch → iodine turns blue-black.",
                    )}
                  </p>
                )}
              </article>
            )}

            <div className="mt-auto flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-ink disabled:opacity-40"
              >
                {tx("上一步", "Back")}
              </button>
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canNext()}
                  className="rounded-xl bg-lab px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-ink disabled:opacity-40"
                >
                  {tx("下一步 →", "Next →")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-xl bg-lime-600 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-lime-700"
                >
                  {tx("再做一次", "Try again")}
                </button>
              )}
            </div>
          </section>
        </div>

        <aside className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-4 text-xs leading-relaxed text-muted">
          <p className="font-bold text-ink">{tx("安全提醒（真實實驗室）", "Safety (real lab)")}</p>
          {tx(
            "酒精易燃，必須用水浴加熱，不可直接用明火；碘液勿入口、勿入眼；實驗請在老師指導下進行。此頁為虛擬模擬，不會使用真實藥品。",
            "Alcohol can burn — heat it in a water bath, never with an open flame. Do not taste iodine or get it in your eyes. Work with a teacher. This page is a simulation and uses no real chemicals.",
          )}
        </aside>
      </div>
    </div>
  );
}
