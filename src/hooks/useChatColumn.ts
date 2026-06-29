import { useEffect, useRef, useState } from "react";
import { CHAT } from "../theme";

// Measures the PANEL (not the window) so the chat reading column breathes at
// every width: full Consult (~900px → caps at 680), the 320px Insights-open
// state, and the full-screen new-session box. See BUILD_PLAN.md §2.4.
export interface ChatColumn {
  ref: React.RefObject<HTMLDivElement | null>;
  narrow: boolean;
  gutterX: number;
  msgGapY: number;
  bodyFont: number;
  colWidth: string; // maxWidth value, e.g. "min(680px, 100%)"
}

export function useChatColumn(): ChatColumn {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(CHAT.colMax);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setWidth(el.clientWidth);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setWidth(e.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const narrow = width < CHAT.narrowBP;
  return {
    ref,
    narrow,
    gutterX: narrow ? CHAT.gutterXNarrow : CHAT.gutterX,
    msgGapY: narrow ? CHAT.msgGapYNarrow : CHAT.msgGapY,
    bodyFont: narrow ? CHAT.bodyFontNarrow : CHAT.bodyFont,
    colWidth: `min(${CHAT.colMax}px, 100%)`,
  };
}
