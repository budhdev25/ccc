import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { PTS } from "../lib/mockData";
import { loadPref, savePref } from "../lib/persist";
import type { PatientCtx, Session, SessionMode, ViewId } from "../lib/types";

// Wider range (was 0.8–1.4) so content can scale up to 200% on large screens
// and shrink for smaller devices that need to fit more on screen.
export const ZOOM_MIN = 0.6;
export const ZOOM_MAX = 2.0;
const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, +z.toFixed(2)));

interface SessionCtxValue {
  // navigation
  view: ViewId;
  setView: (v: ViewId) => void;
  sessionMode: SessionMode;
  setSessionMode: (m: SessionMode) => void;
  // sidebar
  sideCol: boolean;
  setSideCol: (v: boolean | ((p: boolean) => boolean)) => void;
  navWidth: number;
  setNavWidth: (w: number) => void;
  consultWidth: number;
  setConsultWidth: (w: number) => void;
  // per-panel zoom registry (every screen/panel has a zoom control)
  getZoom: (key: string) => number;
  setZoom: (key: string, value: number | ((p: number) => number)) => void;
  // mobile off-canvas Navigator drawer
  mobileNavOpen: boolean;
  setMobileNavOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  modsOpen: boolean;
  setModsOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  recentsOpen: boolean;
  setRecentsOpen: (v: boolean | ((p: boolean) => boolean)) => void;
  navSearch: string;
  setNavSearch: (v: string) => void;
  // sessions (in-memory; Phase 5 → Supabase)
  sessions: Session[];
  activeSessionId: number;
  loadedCtx: PatientCtx | null;
  setLoadedCtx: (c: PatientCtx | null) => void;
  openSession: (s: Session) => void;
  startSession: (ctx: PatientCtx | null, title: string) => void;
  renameSession: (id: number, title: string) => void;
  deleteSession: (id: number) => void;
}

const SessionCtx = createContext<SessionCtxValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("clinical");
  const [sessionMode, setSessionMode] = useState<SessionMode>("new");
  const [sideCol, setSideCol] = useState(false);
  // Layout prefs persist across full reloads (localStorage).
  const [navWidth, setNavWidth] = useState(() => loadPref("ccc:navWidth", 210));
  const [consultWidth, setConsultWidth] = useState(() => loadPref("ccc:consultWidth", 440));
  const [zooms, setZooms] = useState<Record<string, number>>(() => loadPref("ccc:zooms", {}));
  useEffect(() => savePref("ccc:navWidth", navWidth), [navWidth]);
  useEffect(() => savePref("ccc:consultWidth", consultWidth), [consultWidth]);
  useEffect(() => savePref("ccc:zooms", zooms), [zooms]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [modsOpen, setModsOpen] = useState(true);
  const [recentsOpen, setRecentsOpen] = useState(true);
  const [navSearch, setNavSearch] = useState("");
  const [loadedCtx, setLoadedCtx] = useState<PatientCtx | null>(null);
  const [activeSessionId, setActiveSessionId] = useState(1);
  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, title: "Robert M. — HFrEF Consult", ptIdx: 0, timestamp: "Today" },
    { id: 2, title: "Sandra L. — DM Management", ptIdx: 1, timestamp: "Yesterday" },
    { id: 3, title: "James C. — Acute Chest Pain", ptIdx: 2, timestamp: "May 11" },
    { id: 4, title: "Maria T. — Oncology", ptIdx: 3, timestamp: "May 10" },
  ]);

  const value = useMemo<SessionCtxValue>(() => {
    const getZoom = (key: string) => zooms[key] ?? 1;
    const setZoom = (key: string, v: number | ((p: number) => number)) =>
      setZooms((prev) => {
        const cur = prev[key] ?? 1;
        const next = clampZoom(typeof v === "function" ? v(cur) : v);
        return { ...prev, [key]: next };
      });
    const openSession = (s: Session) => {
      setActiveSessionId(s.id);
      setView("clinical");
      setSessionMode("active");
      if (s.ptIdx >= 0 && PTS[s.ptIdx]) {
        const p = PTS[s.ptIdx];
        setLoadedCtx({ ...p.ctx, name: p.name ?? "", mrn: "" });
      } else {
        setLoadedCtx(null);
      }
      setNavSearch("");
    };
    const startSession = (ctx: PatientCtx | null, title: string) => {
      const newId = Date.now();
      setSessions((prev) => [
        { id: newId, title: title || "New Consult", ptIdx: -1, timestamp: "Just now" },
        ...prev,
      ]);
      setActiveSessionId(newId);
      setLoadedCtx(ctx ?? null);
      setView("clinical");
      setSessionMode("active");
    };
    const renameSession = (id: number, title: string) =>
      setSessions((prev) => prev.map((x) => (x.id === id ? { ...x, title } : x)));
    const deleteSession = (id: number) =>
      setSessions((prev) => prev.filter((x) => x.id !== id));

    return {
      view, setView, sessionMode, setSessionMode,
      sideCol, setSideCol, navWidth, setNavWidth, consultWidth, setConsultWidth, getZoom, setZoom, mobileNavOpen, setMobileNavOpen, modsOpen, setModsOpen, recentsOpen, setRecentsOpen,
      navSearch, setNavSearch,
      sessions, activeSessionId, loadedCtx, setLoadedCtx,
      openSession, startSession, renameSession, deleteSession,
    };
  }, [view, sessionMode, sideCol, navWidth, consultWidth, zooms, mobileNavOpen, modsOpen, recentsOpen, navSearch, sessions, activeSessionId, loadedCtx]);

  return <SessionCtx.Provider value={value}>{children}</SessionCtx.Provider>;
}

export function useSession(): SessionCtxValue {
  const ctx = useContext(SessionCtx);
  if (!ctx) throw new Error("useSession must be used within SessionProvider");
  return ctx;
}
