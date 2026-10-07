import { Link } from "react-router-dom";
import { useLang } from "../contexts/LangContext";

const TRACKS = [
  {
    id: "circuit",
    label: "Circuit Lab",
    key: "circuit",
    to: "/engineering/circuit",
    badge: "wire",
    accent: "from-amber-500 to-orange-400",
  },
  {
    id: "bridge",
    label: "Bridge Lab",
    key: "bridge",
    to: "/engineering/bridge",
    badge: "build",
    accent: "from-sky-600 to-indigo-400",
  },
];

export default function Engineering() {
  const { t } = useLang();
  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-400 font-mono text-2xl font-bold text-white shadow-sm ring-2 ring-teal-300/40"
              aria-hidden="true"
            >
              E
            </span>
            <div>
              <p className="text-sm font-semibold text-teal-700">Engineering</p>
              <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                {t.engineering.title}
              </h1>
              <p className="mt-1 text-sm text-muted">{t.engineering.sub}</p>
            </div>
          </div>
        </header>

        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
          {t.engineering.intro}
        </p>

        <div className="space-y-4">
          {TRACKS.map((track) => (
            <article
              key={track.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${track.accent} font-mono text-sm font-bold text-white`}
                >
                  {track.label.slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                    {track.label}
                  </p>
                  <h2 className="text-xl font-bold text-ink">
                    {t.engineering[track.key].zh}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {t.engineering[track.key].desc}
                  </p>
                </div>
              </div>
              <Link
                to={track.to}
                className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-lab px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-ink sm:w-56"
              >
                <span className="font-mono text-shell-green">{track.badge}</span>
                {t.engineering[track.key].cta}
                <span className="transition group-hover:translate-x-0.5">→</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
