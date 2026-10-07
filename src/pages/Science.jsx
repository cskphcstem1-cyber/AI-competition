import { Link } from "react-router-dom";
import { useLang } from "../contexts/LangContext";

const EXPERIMENTS = [
  {
    id: "water-cycle",
    label: "Earth Science",
    mark: "💧",
    key: "water",
    to: "/science/water-cycle",
    badge: "cycle",
    accent: "from-blue-500 to-cyan-400",
  },
  {
    id: "cloud",
    label: "Weather",
    mark: "☁",
    key: "cloud",
    to: "/science/cloud",
    badge: "cloud",
    accent: "from-sky-500 to-cyan-400",
  },
  {
    id: "starch",
    label: "Biology",
    mark: "🍃",
    key: "starch",
    to: "/science/starch",
    badge: "lab",
    accent: "from-lime-500 to-emerald-400",
  },
  {
    id: "rainbow",
    label: "Physics",
    mark: "🌈",
    key: "rainbow",
    to: "/science/rainbow",
    badge: "light",
    accent: "from-violet-500 to-fuchsia-400",
  },
];

export default function Science() {
  const { t } = useLang();
  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 font-mono text-2xl font-bold text-white shadow-sm ring-2 ring-sky-300/40"
              aria-hidden="true"
            >
              S
            </span>
            <div>
              <p className="text-sm font-semibold text-sky-600">Science</p>
              <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                {t.science.title}
              </h1>
              <p className="mt-1 text-sm text-muted">{t.science.sub}</p>
            </div>
          </div>
        </header>

        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          {t.science.intro}
        </p>

        <div className="space-y-4">
          {EXPERIMENTS.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-xl text-white`}
                >
                  {item.mark}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                    {item.label}
                  </p>
                  <h2 className="text-xl font-bold text-ink">
                    {t.science[item.key].zh}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {t.science[item.key].desc}
                  </p>
                </div>
              </div>
              <Link
                to={item.to}
                className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-lab px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-ink sm:w-56"
              >
                <span className="font-mono text-shell-green">{item.badge}</span>
                {t.science.start}
                <span className="transition group-hover:translate-x-0.5">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
