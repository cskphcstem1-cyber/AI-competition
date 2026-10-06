import { createContext, useContext, useState } from "react";

const ScratchIdeContext = createContext(null);

export function ScratchIdeProvider({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  /** Desktop: IDE covers most of the screen so block area has space */
  const [expanded, setExpanded] = useState(true);

  return (
    <ScratchIdeContext.Provider
      value={{ mobileOpen, setMobileOpen, expanded, setExpanded }}
    >
      {children}
    </ScratchIdeContext.Provider>
  );
}

export function useScratchIde() {
  const ctx = useContext(ScratchIdeContext);
  if (!ctx) {
    throw new Error("useScratchIde must be used within ScratchIdeProvider");
  }
  return ctx;
}
