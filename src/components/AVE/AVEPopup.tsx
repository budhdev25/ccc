import type { CSSProperties } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useTavus } from "../../context/TavusContext";
import { useViewport } from "../../hooks/useViewport";
import { AudioControls } from "./AudioControls";
import { AveAvatar } from "./AveAvatar";
import { FullscreenContext } from "./FullscreenContext";
import type { Theme } from "../../theme";
import type { AveMode, AveSize } from "../../lib/types";

const WAVE = [0.35, 0.6, 0.85, 1, 0.75, 0.9, 0.5, 0.7, 0.4, 0.8, 0.55];

// Idle state, shown until the user starts the conversation. `big` scales it for
// the modal / fullscreen stages vs. the compact popup.
function StartConvo({ C, onStart, big }: { C: Theme; onStart: () => void; big: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: big ? 18 : 13 }}>
      <div style={{ width: big ? 92 : 60, height: big ? 92 : 60, borderRadius: "50%", background: C.accentDim, border: `2px solid ${C.borderAcc}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: big ? 38 : 26, color: C.accent, boxShadow: `0 0 22px ${C.accentGlow}, ${C.insetHi}`, animation: "pulse 2.4s ease-in-out infinite" }}>🎙</div>
      <button onClick={onStart} style={{ display: "flex", alignItems: "center", gap: 9, padding: big ? "15px 30px" : "11px 22px", borderRadius: 999, border: "none", background: `linear-gradient(135deg, ${C.accentHi} 0%, ${C.accent} 100%)`, color: "#fff", fontSize: big ? 16 : 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", boxShadow: `0 0 18px ${C.accentGlow}, ${C.insetHi}`, letterSpacing: "0.01em", transition: "transform 0.1s" }} onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")} onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
        <span style={{ fontSize: big ? 15 : 12 }}>▶</span> Start conversation
      </button>
      <span style={{ fontSize: big ? 12.5 : 10, color: C.textDim, fontWeight: 500 }}>Connect to begin your AVE session</span>
    </div>
  );
}

function Stage({ C, mode, speaking, avatar, waveMax, started, onStart }: { C: Theme; mode: AveMode; speaking: boolean; avatar: number; waveMax: number; started: boolean; onStart: () => void }) {
  // The animated audio wave / avatar only appears once the conversation starts.
  if (!started) return <StartConvo C={C} onStart={onStart} big={waveMax >= 100} />;
  if (mode === "visual") return <AveAvatar size={avatar} speaking={speaking} />;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: Math.max(3, waveMax * 0.07) }}>
      {WAVE.map((h, i) => (
        <div key={i} style={{ width: Math.max(3, waveMax * 0.07), borderRadius: 3, background: speaking ? C.accent : C.blue, height: `${h * waveMax}px`, animation: `wave 1.1s ease-in-out ${i * 0.065}s infinite`, transition: "background 0.3s", boxShadow: speaking ? `0 0 6px ${C.accentGlow}` : "none" }} />
      ))}
    </div>
  );
}

function StatusPill({ C, speaking, started }: { C: Theme; speaking: boolean; started: boolean }) {
  const color = !started ? C.textDim : speaking ? C.accent : C.blue;
  const label = !started ? "Ready" : speaking ? "Speaking…" : "Listening…";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: started && speaking ? `0 0 8px ${C.accentGlow}` : "none", transition: "all 0.3s" }} />
      <span style={{ fontSize: 11, fontWeight: 700, color }}>{label}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color: C.textDim, letterSpacing: "0.08em" }}>AVE</span>
    </div>
  );
}

function ModeToggle({ C, mode, setMode }: { C: Theme; mode: AveMode; setMode: (m: AveMode) => void }) {
  return (
    <div style={{ display: "flex", borderRadius: 6, overflow: "hidden", background: C.bgEl, border: `1px solid ${C.border}`, padding: 2 }}>
      {(["ave", "visual"] as AveMode[]).map((m) => (
        <button key={m} onClick={() => setMode(m)} style={{ padding: "3px 10px", fontSize: 9, fontWeight: 700, fontFamily: "'Outfit',sans-serif", cursor: "pointer", border: "none", borderRadius: 4, background: mode === m ? C.accent : "transparent", color: mode === m ? "#fff" : C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", transition: "all 0.15s" }}>{m}</button>
      ))}
    </div>
  );
}

export function AVEPopup() {
  const { C } = useTheme();
  const { speaking, mode, setMode, setAveOpen, aveSize, setAveSize, convoStarted, setConvoStarted } = useTavus();
  const { isMobile } = useViewport();

  const iconBtn: CSSProperties = { width: 24, height: 24, borderRadius: 6, border: `1px solid ${C.border}`, background: C.bgEl, color: C.textMuted, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit',sans-serif" };
  // Closing fully ends the conversation, so the next open prompts to start again.
  const close = () => { setAveOpen(false); setAveSize("popup"); setConvoStarted(false); };
  const startConvo = () => setConvoStarted(true);
  const go = (s: AveSize) => setAveSize(s);

  // Size controls vary by current size.
  const SizeControls = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {aveSize !== "popup" && <button onClick={() => go("popup")} title="Restore" style={iconBtn} aria-label="Restore AVE">⤡</button>}
      {aveSize === "popup" && <button onClick={() => go("modal")} title="Maximize" style={iconBtn} aria-label="Maximize AVE">⤢</button>}
      {aveSize !== "fullscreen" && <button onClick={() => go("fullscreen")} title="Full screen (presentation)" style={iconBtn} aria-label="AVE full screen">⛶</button>}
      {aveSize === "fullscreen" && <button onClick={() => go("modal")} title="Exit full screen" style={iconBtn} aria-label="Exit full screen">⛶</button>}
      <button onClick={close} title="Close AVE" style={{ ...iconBtn, fontSize: 16 }} aria-label="Close AVE">×</button>
    </div>
  );

  // ---- FULLSCREEN (presentation mode + patient/chat context + DDx/Treatment) ----
  if (aveSize === "fullscreen") {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: C.page, display: "flex", flexDirection: "column", fontFamily: "'Outfit',sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderBottom: `1px solid ${C.border}`, background: C.bgCard, flexShrink: 0 }}>
          <StatusPill C={C} speaking={speaking} started={convoStarted} />
          <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>Presentation mode</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><ModeToggle C={C} mode={mode} setMode={setMode} /><SizeControls /></div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: isMobile ? "column" : "row", minHeight: 0 }}>
          {/* Avatar / presentation stage */}
          <div style={{ flex: isMobile ? "0 0 auto" : 1.5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isMobile ? 14 : 22, background: `radial-gradient(ellipse at 50% 38%, ${C.bgEl} 0%, ${C.page} 80%)`, minWidth: 0, padding: isMobile ? 18 : 24 }}>
            <Stage C={C} mode={mode} speaking={speaking} avatar={isMobile ? 180 : 340} waveMax={isMobile ? 90 : 200} started={convoStarted} onStart={startConvo} />
            {convoStarted && <div style={{ fontSize: 12, color: C.textMuted, textAlign: "center" }}>{mode === "visual" ? "AVE — visual replica + slides" : "AVE — audio presenter"}</div>}
            {convoStarted && <AudioControls />}
          </div>
          {/* Patient context · Chat · DDx · Treatment */}
          <FullscreenContext />
        </div>
      </div>
    );
  }

  // ---- MODAL (centered, maximized) ----
  if (aveSize === "modal") {
    return (
      <div onClick={() => go("popup")} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(3,5,12,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div onClick={(e) => e.stopPropagation()} style={{ width: 560, maxWidth: "100%", background: C.bgCard, border: `1.5px solid ${C.borderAcc}`, borderRadius: 18, boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 24px ${C.accentGlow}`, overflow: "hidden", fontFamily: "'Outfit',sans-serif" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: `1px solid ${C.border}` }}>
            <StatusPill C={C} speaking={speaking} started={convoStarted} />
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><ModeToggle C={C} mode={mode} setMode={setMode} /><SizeControls /></div>
          </div>
          <div style={{ padding: "40px 16px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 280, background: `radial-gradient(ellipse at 50% 40%, ${C.bgEl} 0%, ${C.bgCard} 80%)` }}>
            <Stage C={C} mode={mode} speaking={speaking} avatar={240} waveMax={120} started={convoStarted} onStart={startConvo} />
          </div>
          {convoStarted && <AudioControls />}
        </div>
      </div>
    );
  }

  // ---- POPUP (default, bottom-right) ----
  return (
    <div style={{ position: "fixed", bottom: 92, right: 16, width: "min(290px, calc(100vw - 32px))", background: C.bgCard, border: `1.5px solid ${C.borderAcc}`, borderRadius: 14, boxShadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 16px ${C.accentGlow}`, zIndex: 10000, overflow: "hidden", fontFamily: "'Outfit',sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: `1px solid ${C.border}`, gap: 8 }}>
        <StatusPill C={C} speaking={speaking} started={convoStarted} />
        <SizeControls />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderBottom: `1px solid ${C.border}` }}>
        <ModeToggle C={C} mode={mode} setMode={setMode} />
        <span style={{ fontSize: 9, color: C.textDim }}>{mode === "visual" ? "Replica" : "Audio"}</span>
      </div>
      <div style={{ padding: "24px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, background: `radial-gradient(ellipse at 50% 40%,${C.bgEl} 0%,${C.bgCard} 80%)` }}>
        <Stage C={C} mode={mode} speaking={speaking} avatar={150} waveMax={44} started={convoStarted} onStart={startConvo} />
      </div>
      {convoStarted && <AudioControls />}
    </div>
  );
}
