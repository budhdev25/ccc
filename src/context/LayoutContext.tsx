import { createContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { loadPref, savePref } from "../lib/persist";
import { clampZoom } from "./sessionZoom";

export interface LayoutCtxValue {
  sideCol: boolean;
  setSideCol: (v: boolean | ((p: boolean) => boolean)) => void;
  navWidth: number;
  setNavWidth: (w: number) => void;
  consultWidth: number;
  setConsultWidth: (w: number) => void;
  getZoom: (key: string) => number;
  setZoom: (key: string, value: number | ((p: number) => number)) => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  modsOpen: boolean;
  setModsOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  recentsOpen: boolean;
  setRecentsOpen: (v: boolean | ((p: boolean) => boolean)) => void;
}

export const LayoutCtx = createContext<LayoutCtxValue | null>(null);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [sideCol, setSideCol] = useState(false);
  const [navWidth, setNavWidth] = useState(() => loadPref("ccc:navWidth", 210));
  const [consultWidth, setConsultWidth] = useState(() => loadPref("ccc:consultWidth", 440));
  const [zooms, setZooms] = useState<Record<string, number>>(() => loadPref("ccc:zooms", {}));
  useEffect(() => savePref("ccc:navWidth", navWidth), [navWidth]);
  useEffect(() => savePref("ccc:consultWidth", consultWidth), [consultWidth]);
  useEffect(() => savePref("ccc:zooms", zooms), [zooms]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [modsOpen, setModsOpen] = useState(true);
  const [recentsOpen, setRecentsOpen] = useState(true);

  const value = useMemo<LayoutCtxValue>(() => {
    const getZoom = (key: string) => zooms[key] ?? 1;
    const setZoom = (key: string, v: number | ((p: number) => number)) =>
      setZooms((prev) => {
        const cur = prev[key] ?? 1;
        const next = clampZoom(typeof v === "function" ? v(cur) : v);
        return { ...prev, [key]: next };
      });

    return {
      sideCol, setSideCol, navWidth, setNavWidth, consultWidth, setConsultWidth,
      getZoom, setZoom, mobileNavOpen, setMobileNavOpen, modsOpen, setModsOpen,
      recentsOpen, setRecentsOpen,
    };
  }, [sideCol, navWidth, consultWidth, zooms, mobileNavOpen, modsOpen, recentsOpen]);

  return <LayoutCtx.Provider value={value}>{children}</LayoutCtx.Provider>;
}
