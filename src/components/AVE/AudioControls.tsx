import { useTheme } from "../../hooks/useTheme";
import { useTavus } from "../../hooks/useTavus";

// Mic toggle + audio settings — the popup footer.
// Mic iconography follows HANDOFF §4.10: the button shows the ACTION, not the
// state. Live → red 🔇 ("click to mute"); muted → teal 🎙 ("click to unmute").
// Phase 2 (TODO): wire to useLocalMicrophone(), enumerateDevices(), AnalyserNode.
export function AudioControls() {
  const { C } = useTheme();
  const { micMuted, setMicMuted, aveAudioOpen, setAveAudioOpen, audioDevice, setAudioDevice, inputVol, setInputVol } = useTavus();
  const devices = ["Default Mic", "MacBook Pro Microphone", "Headset Mic", "USB Audio Device", "AirPods Pro"];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, padding: "10px 14px", borderTop: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ display: "flex", border: `1.5px solid ${micMuted ? C.danger + "80" : C.borderAcc}`, borderRadius: 6, overflow: "hidden", boxShadow: micMuted ? "0 0 10px rgba(224,98,98,0.3)" : `0 0 10px ${C.accentGlow}` }}>
          <div style={{ padding: "5px 12px", background: micMuted ? "rgba(224,98,98,0.12)" : C.accentDim, fontSize: 10, fontWeight: 700, color: micMuted ? C.danger : C.accent, borderRight: `1px solid ${micMuted ? C.danger + "50" : C.borderAcc + "60"}`, display: "flex", alignItems: "center", gap: 5 }}>
            {micMuted ? <><span>🔇</span> Muted</> : <><span>🎙</span> Mic</>}
          </div>
          <button onClick={() => setMicMuted((v) => !v)} title={micMuted ? "Click to unmute" : "Click to mute"} style={{ padding: "5px 11px", border: "none", background: micMuted ? C.accentDim : "rgba(224,98,98,0.10)", color: micMuted ? C.accent : C.danger, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{micMuted ? "🎙" : "🔇"}</button>
        </div>
        <button onClick={() => setAveAudioOpen((v) => !v)} style={{ width: 28, height: 28, borderRadius: 6, border: `1px solid ${aveAudioOpen ? C.borderAcc : C.border}`, background: aveAudioOpen ? C.accentDim : C.bgEl, color: aveAudioOpen ? C.accent : C.textMuted, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>⚙</button>
      </div>
      {aveAudioOpen && (
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${C.border}`, background: C.bgCard }}>
          <select value={audioDevice} onChange={(e) => setAudioDevice(e.target.value)} style={{ width: "100%", marginBottom: 8, padding: "5px 8px", borderRadius: 5, background: C.bgEl, border: `1px solid ${C.border}`, color: C.text, fontSize: 10, fontFamily: "'Outfit',sans-serif", outline: "none", cursor: "pointer" }}>
            {devices.map((d) => (<option key={d} value={d}>{d}</option>))}
          </select>
          <div style={{ display: "flex", gap: 2, marginBottom: 6 }}>
            {Array.from({ length: 20 }, (_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 1, background: i < Math.floor(inputVol / 5) ? C.accent : C.border }} />
            ))}
          </div>
          <input type="range" min={0} max={100} value={inputVol} onChange={(e) => setInputVol(+e.target.value)} style={{ width: "100%", accentColor: C.accent, cursor: "pointer" }} />
        </div>
      )}
    </>
  );
}
