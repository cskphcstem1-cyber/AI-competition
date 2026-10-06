import { useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../contexts/LangContext";

const MATERIALS = [
  "乾淨的玻璃罐，配金屬蓋",
  "熱水或接近沸騰的水（約 5 厘米深）",
  "幾塊冰塊",
  "一根火柴（必須有大人陪同）",
];
const MATERIALS_EN = [
  "A clean glass jar with a metal lid",
  "Hot or almost boiling water (about 5 cm deep)",
  "A few ice cubes",
  "A match (an adult must help)",
];

const STEPS = [
  {
    id: "warm",
    title: "1. 溫暖罐子",
    titleEn: "1. Warm the jar",
    blurb:
      "把熱水倒進玻璃罐。輕輕旋轉，讓熱水沿著罐壁走一圈，把玻璃溫熱。",
    blurbEn:
      "Pour hot water into the jar. Gently swirl so the hot water warms the glass walls.",
    tip: "熱水代表地球上的溫暖濕空氣。",
    tipEn: "Hot water stands for warm, wet air on Earth.",
    caption: "熱水正在溫暖罐子…",
    captionEn: "Hot water is warming the jar…",
  },
  {
    id: "ice",
    title: "2. 放上冰塊",
    titleEn: "2. Add ice",
    blurb:
      "把罐蓋反過來，蓋在罐口上。把冰塊放進反過來的蓋子裡。",
    blurbEn:
      "Turn the lid upside down on the jar. Put ice cubes in the upside-down lid.",
    tip: "冰塊讓罐口附近變冷，像高空的冷空氣。",
    tipEn: "Ice cools the top of the jar, like cold air high in the sky.",
    caption: "冰塊讓上方變冷",
    captionEn: "Ice makes the top cold",
  },
  {
    id: "smoke",
    title: "3. 加入煙霧核",
    titleEn: "3. Add smoke seeds",
    blurb:
      "稍微掀起蓋子，點燃火柴，讓它燒幾秒，再把火柴丟進罐裡的水中。",
    blurbEn:
      "Lift the lid a little. Light a match, let it burn a few seconds, then drop it into the water.",
    tip: "煙提供小顆粒，水蒸氣可以附著在上面結成雲滴。",
    tipEn: "Smoke gives tiny bits that water vapor can stick to and form cloud drops.",
    caution: true,
    caption: "煙提供雲滴的「核」",
    captionEn: "Smoke gives “seeds” for cloud drops",
  },
  {
    id: "seal",
    title: "4. 封住空氣",
    titleEn: "4. Seal the air in",
    blurb: "立刻把蓋子和冰塊蓋回罐口，封住開口。",
    blurbEn: "Put the lid and ice back on right away to close the jar.",
    tip: "溫暖濕空氣被關在罐裡，上方繼續被冰塊冷卻。",
    tipEn: "Warm wet air is trapped inside while ice keeps cooling the top.",
    caption: "溫暖濕空氣被關住了",
    captionEn: "Warm wet air is trapped inside",
  },
  {
    id: "watch",
    title: "5. 觀察雲形成",
    titleEn: "5. Watch a cloud form",
    blurb:
      "仔細看罐子上半部。溫暖潮濕的空氣遇到冰塊帶來的低溫，會出現一團打轉的白雲。",
    blurbEn:
      "Watch the top of the jar. Warm wet air meets the cold from the ice, and a swirling white cloud appears.",
    tip: "這就是雲：小水滴懸浮在空氣中。",
    tipEn: "That is a cloud: tiny water drops floating in air.",
    caption: "白雲在罐子裡打轉！",
    captionEn: "A white cloud is swirling in the jar!",
  },
  {
    id: "release",
    title: "6. 放出雲朵",
    titleEn: "6. Let the cloud out",
    blurb: "拿開蓋子，看著雲飄進房間。",
    blurbEn: "Take off the lid and watch the cloud drift into the room.",
    tip: "雲離開罐子後會慢慢散開，和水蒸氣混進空氣裡。",
    tipEn: "After it leaves the jar, the cloud slowly spreads into the air.",
    caption: "雲飄進房間了",
    captionEn: "The cloud drifted into the room",
  },
];

function JarVisual({ stage }) {
  const hasWater = stage !== "empty";
  const hasIce = ["ice", "smoke", "seal", "watch", "release"].includes(stage);
  const hasSmoke = ["smoke", "seal", "watch"].includes(stage);
  const hasCloud = stage === "watch" || stage === "release";
  const lidOn = stage !== "release" && stage !== "smoke";
  const lidLifted = stage === "smoke";

  return (
    <div className="relative mx-auto flex h-72 w-full max-w-xs items-end justify-center">
      <svg viewBox="0 0 200 260" className="h-full w-full drop-shadow-sm">
        {/* table */}
        <ellipse cx="100" cy="248" rx="70" ry="8" fill="#cbd5e1" opacity="0.7" />

        {/* jar body */}
        <path
          d="M55 70 L55 210 Q55 230 100 230 Q145 230 145 210 L145 70 Z"
          fill="rgba(224,242,254,0.55)"
          stroke="#0ea5e9"
          strokeWidth="3"
        />
        {/* jar rim */}
        <rect x="50" y="58" width="100" height="14" rx="3" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />

        {/* hot water */}
        {hasWater && (
          <path
            d="M58 155 L58 208 Q58 224 100 224 Q142 224 142 208 L142 155 Z"
            fill="url(#waterGrad)"
            opacity="0.9"
          />
        )}
        {hasWater && stage === "warm" && (
          <>
            <circle cx="80" cy="180" r="3" fill="#fff" opacity="0.45">
              <animate attributeName="cy" values="190;160;190" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="110" cy="195" r="2.5" fill="#fff" opacity="0.4">
              <animate attributeName="cy" values="200;165;200" dur="2.4s" repeatCount="indefinite" />
            </circle>
          </>
        )}

        {/* steam / cloud */}
        {hasCloud && (
          <g opacity="0.85">
            <ellipse cx="90" cy="105" rx="22" ry="14" fill="#f8fafc">
              <animate attributeName="opacity" values="0.5;0.95;0.5" dur="2.5s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="112" cy="100" rx="20" ry="13" fill="#ffffff">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2.2s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="100" cy="118" rx="26" ry="12" fill="#e2e8f0">
              <animate attributeName="opacity" values="0.4;0.85;0.4" dur="2.8s" repeatCount="indefinite" />
            </ellipse>
          </g>
        )}

        {/* smoke nuclei */}
        {hasSmoke && !hasCloud && (
          <g fill="#94a3b8" opacity="0.55">
            <circle cx="95" cy="130" r="2">
              <animate attributeName="cy" values="150;110;150" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="108" cy="140" r="1.5">
              <animate attributeName="cy" values="160;115;160" dur="2.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="88" cy="145" r="1.8">
              <animate attributeName="cy" values="165;120;165" dur="3.2s" repeatCount="indefinite" />
            </circle>
          </g>
        )}

        {/* released cloud drifting out */}
        {stage === "release" && (
          <g opacity="0.7">
            <ellipse cx="155" cy="55" rx="18" ry="10" fill="#f1f5f9">
              <animate attributeName="cx" values="130;170;130" dur="4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0.3;0.8" dur="4s" repeatCount="indefinite" />
            </ellipse>
          </g>
        )}

        {/* lid */}
        {(lidOn || lidLifted) && (
          <g transform={lidLifted ? "translate(0,-18)" : undefined}>
            <rect
              x="48"
              y="42"
              width="104"
              height="12"
              rx="2"
              fill="#64748b"
              stroke="#334155"
              strokeWidth="1.5"
            />
            {/* upside-down lid dish */}
            <path
              d="M55 42 L55 28 Q55 22 100 22 Q145 22 145 28 L145 42 Z"
              fill="#94a3b8"
              stroke="#475569"
              strokeWidth="1.5"
            />
            {hasIce && (
              <g>
                <rect x="72" y="24" width="16" height="12" rx="2" fill="#e0f2fe" stroke="#38bdf8" />
                <rect x="92" y="22" width="14" height="14" rx="2" fill="#bae6fd" stroke="#0ea5e9" />
                <rect x="110" y="25" width="15" height="11" rx="2" fill="#e0f2fe" stroke="#38bdf8" />
              </g>
            )}
          </g>
        )}

        {/* match in smoke step */}
        {stage === "smoke" && (
          <g transform="translate(150,90) rotate(-35)">
            <rect x="0" y="0" width="4" height="36" rx="1" fill="#a16207" />
            <circle cx="2" cy="-2" r="5" fill="#f97316">
              <animate attributeName="r" values="4;6;4" dur="0.6s" repeatCount="indefinite" />
            </circle>
            <circle cx="2" cy="-6" r="3" fill="#fbbf24" opacity="0.8" />
          </g>
        )}

        <defs>
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function CloudFormationExperiment() {
  const { tx } = useLang();
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const stage = current.id;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-sky-50 via-white to-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
        <header className="mb-6">
          <Link
            to="/science"
            className="mb-2 inline-block text-xs font-bold text-sky-700 hover:underline"
          >
            {tx("← 科學總覽", "← Science home")}
          </Link>
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-sky-600">
            Earth Science · Weather
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {tx("雲是怎樣形成的？", "How do clouds form?")}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            {tx(
              "用熱水、冰塊和一點煙，在罐子裡做出一小團雲，認識溫暖濕空氣遇冷後如何結成雲滴。",
              "Use hot water, ice, and a little smoke to make a tiny cloud in a jar. See how warm wet air turns into cloud drops when it cools.",
            )}
          </p>
        </header>

        <div className="mb-5 flex gap-1 overflow-x-auto pb-1">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => i <= step && setStep(i)}
              className={`h-2 min-w-[2rem] flex-1 rounded-full transition ${
                i < step
                  ? "bg-sky-400"
                  : i === step
                    ? "bg-sky-600"
                    : "bg-slate-200"
              }`}
              title={tx(s.title, s.titleEn)}
            />
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-muted">
              {tx("實驗台", "Lab bench")}
            </p>
            <JarVisual stage={stage} />
            <p className="mt-2 text-center text-sm font-semibold text-sky-800">
              {tx(current.caption, current.captionEn)}
            </p>
          </section>

          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-ink">{tx("需要的材料", "Materials")}</h2>
              <ul className="mt-3 space-y-2">
                {MATERIALS.map((item, i) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                    <span>{tx(item, MATERIALS_EN[i])}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
                {tx(
                  "安全提醒：火柴必須有大人陪同操作。熱水燙手，請小心。",
                  "Safety: an adult must help with the match. Hot water can burn — be careful.",
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-sky-600">
                {tx("步驟", "Step")} {step + 1} / {STEPS.length}
              </p>
              <h2 className="mt-1 text-xl font-bold text-ink">
                {tx(current.title, current.titleEn)}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {tx(current.blurb, current.blurbEn)}
              </p>
              {current.caution && (
                <p className="mt-3 rounded-xl bg-coral/10 px-3 py-2 text-xs font-bold text-coral-dark">
                  {tx(
                    "請大人幫忙點火柴，並立刻把火柴丟進水裡熄滅。",
                    "Ask an adult to light the match, then drop it in the water to put it out.",
                  )}
                </p>
              )}
              <p className="mt-3 rounded-xl bg-sky-50 px-3 py-2 text-sm font-medium text-sky-900">
                {tx(current.tip, current.tipEn)}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={step === 0}
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-ink shadow-sm hover:border-sky-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {tx("上一步", "Back")}
                </button>
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-sky-700"
                  >
                    {tx("下一步 →", "Next →")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-sky-700"
                  >
                    {tx("再做一次", "Try again")}
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-5">
              <h3 className="text-sm font-bold text-ink">
                {tx("為什麼會成雲？", "Why does a cloud form?")}
              </h3>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-muted">
                <li>{tx("熱水蒸發，罐裡充滿水蒸氣。", "Hot water evaporates and fills the jar with vapor.")}</li>
                <li>{tx("冰塊讓上方空氣變冷。", "Ice cools the air at the top.")}</li>
                <li>{tx("煙的小顆粒讓水蒸氣有地方凝結成小水滴。", "Tiny smoke bits give vapor a place to turn into drops.")}</li>
                <li>{tx("很多小水滴聚在一起，看起來就是雲。", "Lots of tiny drops together look like a cloud.")}</li>
              </ol>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
