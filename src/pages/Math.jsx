import { Link } from "react-router-dom";
import { useLang } from "../contexts/LangContext";

const TOPICS = [
  {
    id: "arithmetic",
    label: "Arithmetic",
    mark: "A",
    key: "arithmetic",
    to: "/math/levels",
    badge: "start",
    accent: "from-indigo-600 to-blue-400",
  },
  {
    id: "compare",
    label: "Compare",
    mark: "<",
    key: "compare",
    to: "/math/compare",
    badge: "check",
    accent: "from-violet-600 to-fuchsia-400",
  },
  {
    id: "binary",
    label: "Binary",
    mark: "B",
    key: "binary",
    to: "/math/binary",
    badge: "bits",
    accent: "from-sky-600 to-cyan-400",
  },
  {
    id: "hex",
    label: "Hexadecimal",
    mark: "H",
    key: "hex",
    to: "/math/hex",
    badge: "hex",
    accent: "from-emerald-600 to-teal-400",
  },
];

export default function Math() {
  const { t } = useLang();
  return (
    <div className="blueprint-bg min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-400 font-mono text-2xl font-bold text-white shadow-sm ring-2 ring-brand/25"
              aria-hidden="true"
            >
              M
            </span>
            <div>
              <p className="text-sm font-semibold text-brand">Mathematics</p>
              <h1 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                {t.math.title}
              </h1>
              <p className="mt-1 text-sm text-muted">
                {t.math.sub}
              </p>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          {TOPICS.map((topic) => (
            <article
              key={topic.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${topic.accent} font-mono text-sm font-bold text-white`}
                >
                  {topic.mark}
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
                    {topic.label}
                  </p>
                  <h2 className="text-xl font-bold text-ink">
                    {t.math[topic.key].zh}
                  </h2>
                  <p className="mt-1 text-sm text-muted">{t.math[topic.key].desc}</p>
                </div>
              </div>
              <div className="flex w-fit shrink-0 flex-col gap-2 sm:items-end">
                <Link
                  to={topic.to}
                  className="group inline-flex w-fit items-center gap-2 rounded-xl bg-lab px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-ink"
                >
                  <span className="font-mono text-shell-green">{topic.badge}</span>
                  {t.math.start}
                  <span className="transition group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
