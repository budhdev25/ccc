import { useEffect, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useTheme } from "../../context/ThemeContext";

// Thin draggable divider that sits between two panels in a flex row. Highlights
// on hover and while dragging; shows a grip in the center.
export function ResizeHandle({
  onStart,
  ariaLabel = "Resize panel",
}: {
  onStart: (e: ReactMouseEvent) => void;
  ariaLabel?: string;
}) {
  const { C } = useTheme();
  const [hover, setHover] = useState(false);
  const [dragging, setDragging] = useState(false);
  const active = hover || dragging;

  useEffect(() => {
    if (!dragging) return;
    const up = () => setDragging(false);
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, [dragging]);

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={ariaLabel}
      onMouseDown={(e) => { setDragging(true); onStart(e); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 7, flexShrink: 0, cursor: "col-resize",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: active ? C.accentDim : "transparent",
        borderLeft: `1px solid ${active ? C.borderAcc : C.border}`,
        transition: "background 0.15s, border-color 0.15s",
        position: "relative", zIndex: 6,
      }}
    >
      <div style={{ width: 2, height: 28, borderRadius: 2, background: active ? C.accent : C.border, transition: "background 0.15s" }} />
    </div>
  );
}
