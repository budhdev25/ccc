import { useTheme } from "../../context/ThemeContext";
import { useTavus } from "../../context/TavusContext";
import { useViewport } from "../../hooks/useViewport";
import { AVEPopup } from "./AVEPopup";

// Floating avatar control, bottom-right (HANDOFF §4.3: AVE is a FAB, not a panel).
// NOTE (BUILD_PLAN OD-9, open): the FAB shows mute STATE here (🔇 only when muted),
// because clicking it opens/closes the popup — it is not itself a mute toggle, so
// the §4.10 "icon = action" rule applies to the popup's mic button, not this. Kept
// as the preview had it pending owner confirmation of OD-9.
export function AVEFab() {
  const { C } = useTheme();
  const { speaking, micMuted, aveOpen, setAveOpen } = useTavus();
  const { isMobile } = useViewport();
  const waveHeights = [0.4, 0.7, 1, 0.7, 0.4];

  return (
    <>
      {aveOpen && <AVEPopup />}
      {/* On mobile the FAB lifts above the chat composer so it never covers Send. */}
      <button onClick={() => setAveOpen((v) => !v)} title={aveOpen ? "Close AVE" : "Open AVE"} style={{ position: "fixed", bottom: isMobile ? 116 : 24, right: isMobile ? 16 : 24, width: 56, height: 56, borderRadius: "50%", border: `2px solid ${micMuted ? C.danger + "90" : C.borderAcc}`, background: aveOpen ? C.accent : micMuted ? "rgba(224,98,98,0.15)" : C.accentDim, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, boxShadow: `0 4px 20px ${aveOpen ? C.accentGlow : "rgba(0,0,0,0.4)"}`, zIndex: 9999, transition: "all 0.2s", fontFamily: "'Outfit',sans-serif" }}>
        {micMuted ? (
          <span style={{ fontSize: 20 }}>🔇</span>
        ) : (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
            {waveHeights.map((h, i) => (
              <div key={i} style={{ width: 3, borderRadius: 1, background: aveOpen ? "#fff" : C.accent, height: `${h * 18}px`, animation: speaking ? `wave 1.1s ease-in-out ${i * 0.1}s infinite` : "none" }} />
            ))}
          </div>
        )}
        <span style={{ fontSize: 7, color: aveOpen ? "#fff" : C.accent, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>AVE</span>
      </button>
    </>
  );
}
