import { createContext, useContext, useState, useCallback } from "react";

const IdeContext = createContext(null);

const DEFAULT_CODE = `print("Hello World!")
`;

export function IdeProvider({ children, initialCode }) {
  const [code, setCode] = useState(initialCode || DEFAULT_CODE);
  const [mobileOpen, setMobileOpen] = useState(false);

  const loadCode = useCallback((nextCode) => {
    setCode(String(nextCode).replace(/^\n/, "").replace(/\n$/, "") + "\n");
    // Only force mobile sheet open on smaller screens
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileOpen(true);
    }
  }, []);

  return (
    <IdeContext.Provider
      value={{ code, setCode, loadCode, mobileOpen, setMobileOpen }}
    >
      {children}
    </IdeContext.Provider>
  );
}

export function useIde() {
  const ctx = useContext(IdeContext);
  if (!ctx) throw new Error("useIde must be used within IdeProvider");
  return ctx;
}
