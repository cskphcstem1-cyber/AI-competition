import { Link } from "react-router-dom";
import { useShop } from "../contexts/ShopContext";
import { useLang } from "../contexts/LangContext";
import { isDarkBackground } from "../data/shopItems";

const STEM = [
  {
    letter: "S",
    title: "Science",
    key: "science",
    color: "from-sky-500 to-cyan-400",
    to: "/science",
    ctaTag: "lab",
  },
  {
    letter: "T",
    title: "Technology",
    key: "tech",
    color: "from-blue-600 to-sky-500",
    to: "/technology",
    ctaTag: "run",
  },
  {
    letter: "E",
    title: "Engineering",
    key: "eng",
    color: "from-teal-600 to-emerald-400",
    to: "/engineering",
    ctaTag: "build",
  },
  {
    letter: "M",
    title: "Mathematics",
    key: "math",
    color: "from-indigo-600 to-blue-400",
    to: "/math",
    ctaTag: "Σ",
  },
];

export default function Stem() {
  const { equipped } = useShop();
  const { t } = useLang();
  const isMidnight = isDarkBackground(equipped.background);
  const ink = isMidnight ? "text-white" : "text-ink";
  const muted = isMidnight ? "text-slate-300" : "text-muted";

  return (
    <main className="relative flex h-[calc(100vh-3.5rem)] w-full flex-col items-center justify-center overflow-hidden px-5 sm:px-8">
      <div className="grid w-full max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEM.map((item) => (
          <div
            key={item.letter}
            className={`flex flex-col rounded-2xl border p-7 text-left shadow-sm backdrop-blur ${
              isMidnight
                ? "border-white/15 bg-white/10"
                : "border-white/80 bg-white/90"
            }`}
          >
            <div
              className={`mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} font-mono text-3xl font-bold text-white shadow-sm`}
            >
              {item.letter}
            </div>
            <p
              className={`font-mono text-sm font-bold uppercase tracking-wider ${muted}`}
            >
              {item.title}
            </p>
            <h3 className={`mb-2 text-3xl font-bold ${ink}`}>
              {t.stem[item.key].zh}
            </h3>
            {t.stem[item.key].desc ? (
              <p className={`mb-6 flex-1 text-lg leading-relaxed ${muted}`}>
                {t.stem[item.key].desc}
              </p>
            ) : (
              <div className="mb-6 flex-1" />
            )}
            <Link
              to={item.to}
              className="group mt-auto inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-lab px-4 py-4 text-base font-bold text-white shadow-md shadow-lab/20 transition hover:bg-ink"
            >
              <span className="font-mono text-shell-green">{item.ctaTag}</span>
              <span className={item.key === "eng" ? "text-sm" : undefined}>
                {t.stem[item.key].cta}
              </span>
              <span className="transition group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        ))}
      </div>

      <Link
        to="/"
        className="fixed right-5 bottom-5 z-50 flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-white text-ink shadow-lg transition hover:border-brand hover:text-brand-dark hover:shadow-xl sm:right-6 sm:bottom-6"
        title="Home"
        aria-label={t.stem.homeAria}
      >
        <svg
          viewBox="0 0 24 24"
          className="h-10 w-10"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3.2 3.5 10.5a1 1 0 0 0-.3.7V20a1.5 1.5 0 0 0 1.5 1.5H9.2a.8.8 0 0 0 .8-.8V15a1.5 1.5 0 0 1 1.5-1.5h1a1.5 1.5 0 0 1 1.5 1.5v5.7a.8.8 0 0 0 .8.8h4.5A1.5 1.5 0 0 0 20.8 20v-8.8a1 1 0 0 0-.3-.7L12 3.2Z" />
        </svg>
      </Link>
    </main>
  );
}
