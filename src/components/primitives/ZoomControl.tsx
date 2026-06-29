import { useTheme } from "../../hooks/useTheme";
import { useLayout } from "../../hooks/useLayout";
import { ZOOM_MIN, ZOOM_MAX } from "../../context/sessionZoom";

// Compact −/%/+ zoom control bound to a panel key in the session zoom registry.
// Used on every screen/panel; the value persists across reloads.
export function ZoomControl({ zoomKey, label }: { zoomKey: string; label?: string }) {
  const { C } = useTheme();
  const { getZoom, setZoom } = useLayout();
  const z = getZoom(zoomKey);
  const pct = Math.round(z * 100);
  const out = () => setZoom(zoomKey, (v) => v - 0.1);
  const inc = () => setZoom(zoomKey, (v) => v + 0.1);
  const btn = (disabled: boolean) =>
    ({
      width: 19, height: 19, borderRadius: 5, border: `1px solid ${C.borderSubtle}`,
      background: C.bgEl, color: disabled ? C.textDim : C.accent, cursor: disabled ? "default" : "pointer",
      fontSize: 12, fontWeight: 700, lineHeight: 1, display: "flex", alignItems: "center",
      justifyContent: "center", opacity: disabled ? 0.4 : 1, fontFamily: "'Outfit',sans-serif", padding: 0,
    }) as const;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }} title={`Zoom${label ? ` — ${label}` : ""}`}>
      <button onClick={out} disabled={z <= ZOOM_MIN} style={btn(z <= ZOOM_MIN)} aria-label={`Zoom out ${zoomKey}`}>−</button>
      <span style={{ fontSize: 9, fontFamily: C.mono, color: C.textMuted, minWidth: 30, textAlign: "center", fontVariantNumeric: "tabular-nums" }}>{pct}%</span>
      <button onClick={inc} disabled={z >= ZOOM_MAX} style={btn(z >= ZOOM_MAX)} aria-label={`Zoom in ${zoomKey}`}>+</button>
    </div>
  );
}
