import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../contexts/LangContext";
import { useShop } from "../contexts/ShopContext";
import { isDarkBackground } from "../data/shopItems";
import HomeCat from "./HomeCat";

const CAT_HIDDEN_KEY = "codekids-cat-hidden";

function chipClass(isMidnight) {
  return `rounded-2xl border px-2.5 py-1 text-xs font-bold shadow-sm backdrop-blur transition sm:px-3 sm:py-1.5 sm:text-sm ${
    isMidnight
      ? "border-white/20 bg-white/15 text-white hover:bg-white/25"
      : "border-slate-200 bg-white/90 text-ink hover:border-brand hover:text-brand-dark"
  }`;
}

export default function GlobalCat() {
  const { t } = useLang();
  const { equipped } = useShop();
  const isMidnight = isDarkBackground(equipped.background);
  const [hidden, setHidden] = useState(() => {
    try {
      return localStorage.getItem(CAT_HIDDEN_KEY) === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CAT_HIDDEN_KEY, hidden ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [hidden]);

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => setHidden(false)}
        className={`pointer-events-auto fixed bottom-2 right-2 z-30 sm:bottom-4 sm:right-5 ${chipClass(isMidnight)}`}
        title={t.home.showCat}
      >
        <span className="sm:hidden">{t.home.showCatShort}</span>
        <span className="hidden sm:inline">{t.home.showCat}</span>
      </button>
    );
  }

  return (
    <div className="pointer-events-auto fixed bottom-2 right-2 z-30 flex w-28 flex-col items-stretch gap-1 sm:bottom-4 sm:right-5 sm:w-auto sm:items-end">
      <div className="flex flex-col items-stretch gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() => setHidden(true)}
          className={chipClass(isMidnight)}
          title={t.home.hideCat}
        >
          <span className="sm:hidden">{t.home.hideCatShort}</span>
          <span className="hidden sm:inline">{t.home.hideCat}</span>
        </button>
        <Link
          to="/shop?tab=cat"
          className={`group text-center ${chipClass(isMidnight)}`}
          title={t.home.catShop}
        >
          <span className="sm:hidden">{t.home.catShopShort}</span>
          <span className="hidden sm:inline">{t.home.catShop}</span>
        </Link>
      </div>
      <Link to="/shop?tab=cat" title={t.home.catShop}>
        <HomeCat decorations={equipped.decorations} moving />
      </Link>
    </div>
  );
}
