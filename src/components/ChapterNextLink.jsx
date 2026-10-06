import { Link } from "react-router-dom";
import { NEXT_CHAPTER } from "../data/chapters";
import { useLang } from "../contexts/LangContext";

/** Button that jumps to the next chapter / section in the Python course. */
export default function ChapterNextLink({ chapterId }) {
  const { tx } = useLang();
  const next = NEXT_CHAPTER[String(chapterId)];
  if (!next) return null;

  return (
    <Link
      to={next.to}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-bold text-white shadow-md shadow-emerald-500/20 transition hover:bg-emerald-600"
    >
      {tx(next.label, next.labelEn || next.label)}
    </Link>
  );
}
