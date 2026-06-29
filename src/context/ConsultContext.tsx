import { createContext, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { DOCS_S } from "../lib/mockData";
import type { CtrlTab, InsightTab } from "../lib/types";

// Workspace-scoped state shared by ConsultPanel + InsightsPanel (siblings).
// Scoped here — NOT global — so the AVE/Navigator don't see Insights state.
// Phase 4 (TODO): triggerInsights fires on the FIRST real Glass event
//   (conversation.toolcall → useGlassTool), replacing the 2.5s fake timer.

export interface ConsultCtxValue {
  ctrlTab: CtrlTab;
  setCtrlTab: (t: CtrlTab) => void;
  tab: InsightTab;
  setTab: (t: InsightTab) => void;
  chatHidden: boolean;
  setChatHidden: (v: boolean | ((p: boolean) => boolean)) => void;
  patientExpanded: boolean;
  setPatientExpanded: (v: boolean | ((p: boolean) => boolean)) => void;
  docOn: boolean[];
  toggleDoc: (i: number) => void;
  insightsVisible: boolean;
  setInsightsVisible: (v: boolean) => void;
  glassLoading: boolean;
  triggerInsights: () => void;
}

export const ConsultCtx = createContext<ConsultCtxValue | null>(null);

export function ConsultProvider({ children }: { children: ReactNode }) {
  const [ctrlTab, setCtrlTab] = useState<CtrlTab>("chat");
  const [tab, setTab] = useState<InsightTab>("ddx");
  const [chatHidden, setChatHidden] = useState(false);
  const [patientExpanded, setPatientExpanded] = useState(false);
  const [docOn, setDocOn] = useState<boolean[]>(DOCS_S.map((d) => d.on));
  // Default view: Insights expanded (owner override of BUILD_PLAN non-negotiable #5;
  // Glass slide-in still works if the user Hides it and re-triggers).
  const [insightsVisible, setInsightsVisible] = useState(true);
  const [glassLoading, setGlassLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const value = useMemo<ConsultCtxValue>(() => {
    const toggleDoc = (i: number) =>
      setDocOn((prev) => prev.map((v, j) => (j === i ? !v : v)));
    const triggerInsights = () => {
      if (insightsVisible || glassLoading) return;
      setGlassLoading(true);
      timer.current = setTimeout(() => {
        setGlassLoading(false);
        setInsightsVisible(true);
      }, 2500);
    };
    return {
      ctrlTab, setCtrlTab, tab, setTab, chatHidden, setChatHidden,
      patientExpanded, setPatientExpanded, docOn, toggleDoc,
      insightsVisible, setInsightsVisible, glassLoading, triggerInsights,
    };
  }, [ctrlTab, tab, chatHidden, patientExpanded, docOn, insightsVisible, glassLoading]);

  return <ConsultCtx.Provider value={value}>{children}</ConsultCtx.Provider>;
}
