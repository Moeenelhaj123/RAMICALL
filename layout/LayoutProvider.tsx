import * as React from "react";
import { LayoutMode, LayoutPrefs } from "@/types/layout";

const STORAGE_KEY = "app.layout.v1";
const COLLAPSE_KEY = "app.sidebar.collapse.v1";

type Ctx = {
  prefs: LayoutPrefs;
  setMode: (m: LayoutMode) => void;
  setSidebarCollapsed: (c: boolean) => void;
};

const LayoutCtx = React.createContext<Ctx | null>(null);

export function useLayout() {
  const ctx = React.useContext(LayoutCtx);
  if (!ctx) throw new Error("useLayout must be inside LayoutProvider");
  return ctx;
}

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = React.useState<LayoutPrefs>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const mode: LayoutMode = (saved as LayoutMode) || "header";
    const collapsed = localStorage.getItem(COLLAPSE_KEY) === "1";
    return { mode, sidebarCollapsed: collapsed };
  });

  const setMode = (mode: LayoutMode) => {
    setPrefs(p => {
      localStorage.setItem(STORAGE_KEY, mode);
      return { ...p, mode };
    });
  };

  const setSidebarCollapsed = (c: boolean) => {
    setPrefs(p => {
      localStorage.setItem(COLLAPSE_KEY, c ? "1" : "0");
      return { ...p, sidebarCollapsed: c };
    });
  };

  return (
    <LayoutCtx.Provider value={{ prefs, setMode, setSidebarCollapsed }}>
      {children}
    </LayoutCtx.Provider>
  );
}
