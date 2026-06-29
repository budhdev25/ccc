import type { CSSProperties, ReactNode } from "react";
import { PANEL } from "../../theme";
import { useSession } from "../../context/SessionContext";
import { useViewport } from "../../hooks/useViewport";
import { ZoomControl } from "./ZoomControl";

// Pulls full-width tab/module content into a compact, centered column with
// massive surrounding whitespace. Use as the scroll container for any panel
// whose content would otherwise span edge-to-edge.
//
// `fill` picks how it claims height: "flex" (default) for direct flex children
// like the module views; "full" (height:100%) for content nested inside an
// already-sized box, like the Insights DDx/Tx area.
//
// `zoomKey` adds a per-panel zoom control (toolbar, top-right) and scales the
// centered column. Omit it for panels that manage zoom themselves.
export function ContentPanel({
  children,
  maxWidth = PANEL.maxWidth,
  fill = "flex",
  zoomKey,
}: {
  children: ReactNode;
  maxWidth?: number;
  fill?: "flex" | "full";
  zoomKey?: string;
}) {
  const { getZoom } = useSession();
  const { isMobile } = useViewport();
  const sizing: CSSProperties =
    fill === "flex" ? { flex: 1, minHeight: 0 } : { height: "100%" };
  const zoom = zoomKey ? getZoom(zoomKey) : 1;
  // Trim the generous desktop whitespace on small screens so content fills the
  // viewport instead of drowning in margins.
  const padY = isMobile ? 20 : PANEL.padY;
  const padX = isMobile ? 14 : PANEL.padX;
  return (
    <div style={{ ...sizing, overflowY: "auto", padding: `${padY}px ${padX}px`, position: "relative" }}>
      {zoomKey && (
        // Toolbar sits clearly above the content — generous gap so it never
        // touches or overlays the viewing area below.
        <div style={{ maxWidth, marginLeft: "auto", marginRight: "auto", marginBottom: 22, display: "flex", justifyContent: "flex-end" }}>
          <ZoomControl zoomKey={zoomKey} />
        </div>
      )}
      <div style={{ maxWidth, margin: "0 auto", zoom }}>{children}</div>
    </div>
  );
}
