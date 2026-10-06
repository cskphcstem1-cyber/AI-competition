import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UI } from "../i18n/ui";
import { pythonEn } from "../i18n/pythonPageEn";

const LangContext = createContext(null);

function readLang() {
  try {
    const stored =
      localStorage.getItem("codekids-lang") ||
      localStorage.getItem("compare-lang");
    return stored === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(readLang);

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "zh-Hant";
  }, [lang]);

  const value = useMemo(() => {
    const toggleLang = () => {
      setLang((prev) => {
        const next = prev === "zh" ? "en" : "zh";
        try {
          localStorage.setItem("codekids-lang", next);
        } catch {
          /* ignore */
        }
        return next;
      });
    };
    const tx = (zh, en) => {
      if (lang !== "en") return zh;
      if (en != null && en !== "") return en;
      return pythonEn(zh);
    };
    return { lang, toggleLang, t: UI[lang], tx };
  }, [lang]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) {
    throw new Error("useLang must be used inside LangProvider");
  }
  return ctx;
}
