import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useSession } from "../../hooks/useSession";
import { useEHRSearch } from "../../hooks/useEHRSearch";
import { ZoomControl } from "../primitives/ZoomControl";
import { CHAT } from "../../theme";

export function NewSessionScreen() {
  const { C } = useTheme();
  const { startSession, getZoom } = useSession();
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [chatFocused, setChatFocused] = useState(false);
  const results = useEHRSearch(q);

  const startChat = () => {
    if (!msg.trim()) return;
    startSession(null, msg.trim().slice(0, 40) + (msg.length > 40 ? "…" : ""));
  };

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(ellipse at 50% 40%,${C.bgEl} 0%,${C.bg} 70%)`, position: "relative" }}>
      <div style={{ position: "absolute", top: 12, right: 16 }}>
        <ZoomControl zoomKey="newsession" label="New session" />
      </div>
      {/* Claude-airy: free-chat owns the screen — wider column (560, was 480). */}
      <div style={{ width: "100%", maxWidth: 560, padding: "0 24px", zoom: getZoom("newsession") }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 6 }}>New Consult</div>
          <div style={{ fontSize: 13, color: C.textMuted }}>Search for a patient or start a conversation</div>
        </div>

        {/* Patient search */}
        <div style={{ position: "relative", marginBottom: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Search Patient (EHR)</div>
          <input value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} placeholder="Patient name or MRN…" style={{ width: "100%", padding: "11px 14px", borderRadius: 8, background: C.bgEl, border: `2px solid ${searchFocused ? C.borderAcc : C.border}`, color: C.text, fontSize: 13, fontFamily: "'Outfit',sans-serif", outline: "none", transition: "border-color 0.2s", boxShadow: searchFocused ? `0 0 0 3px ${C.accentGlow}` : "none" }} />
          {results.length > 0 && (
            <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: C.bgCard, border: `2px solid ${C.borderAcc}`, borderRadius: 8, overflow: "hidden", boxShadow: `0 8px 24px rgba(0,0,0,0.35),0 0 12px ${C.accentGlow}`, zIndex: 10 }}>
              {results.map((r, i) => (
                <div key={r.mrn} onClick={() => startSession({ ...r.ctx, name: r.name, mrn: r.mrn }, `${r.name} — ${r.dx}`)} style={{ padding: "10px 14px", cursor: "pointer", borderBottom: i < results.length - 1 ? `1px solid ${C.border}` : "none", transition: "background 0.15s" }} onMouseEnter={(e) => (e.currentTarget.style.background = C.bgEl)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{r.name}, {r.age}</span>
                    <span style={{ fontSize: 9, color: C.textDim, fontFamily: "monospace" }}>{r.mrn}</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{r.dx}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* OR divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 11, color: C.textDim, fontWeight: 600 }}>or</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {/* Free chat — Claude-airy composer */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>Just start chatting</div>
          <textarea value={msg} onChange={(e) => setMsg(e.target.value)} onFocus={() => setChatFocused(true)} onBlur={() => setChatFocused(false)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && msg.trim()) { e.preventDefault(); startChat(); } }} placeholder="Ask a clinical question, describe a case, or just say hello…" rows={4} style={{ width: "100%", padding: "16px 18px", borderRadius: CHAT.composerRadius, background: C.bgEl, border: `2px solid ${chatFocused ? C.borderAcc : C.border}`, color: C.text, fontSize: CHAT.bodyFont, fontFamily: "'Outfit',sans-serif", outline: "none", resize: "none", lineHeight: CHAT.bodyLH, transition: "border-color 0.2s", boxShadow: chatFocused ? `0 0 0 3px ${C.accentGlow}` : "none" }} />
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <button onClick={startChat} style={{ padding: "14px 32px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${C.accentHi} 0%, ${C.accent} 100%)`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", boxShadow: `0 0 16px ${C.accentGlow}, ${C.insetHi}`, opacity: msg.trim() ? 1 : 0.45, transition: "opacity 0.2s", whiteSpace: "nowrap", letterSpacing: "0.01em" }}>Start Consult →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
