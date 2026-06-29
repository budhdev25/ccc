import { useRef, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useConsult } from "../../hooks/useConsult";
import { useChatColumn } from "../../hooks/useChatColumn";
import { useDictation } from "../../hooks/useDictation";
import { useViewport } from "../../hooks/useViewport";
import { CHAT } from "../../theme";
import { MSGS } from "../../lib/mockData";
import { EchoImg } from "../primitives/EchoImg";
import { ChartImg } from "../primitives/ChartImg";

// THE HEADLINE: "Claude chat styled whitespace" (BUILD_PLAN §2).
// AI turns are plain text on the page (no bubble); HCP turns are a soft teal
// pill. Reading column is fluid — min(680px, 100%) measured off the panel — and
// drops to a narrow scale below 560px so it survives the 320px Insights layout.
export function ChatTab() {
  const { C } = useTheme();
  const { chatHidden, triggerInsights } = useConsult();
  const { ref, narrow, gutterX, msgGapY, bodyFont, colWidth } = useChatColumn();
  const { isMobile } = useViewport();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState("");
  // Dictation mic — separate from the AVE avatar; types into the chat box.
  const { listening, supported, toggle } = useDictation((t) =>
    setDraft((d) => (d ? d + " " : "") + t)
  );
  const scrollToBottom = () => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {chatHidden ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 22, opacity: 0.25 }}>🚫</span>
          <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 500 }}>Transcript suppressed</span>
          <span style={{ fontSize: 9.5, color: C.textDim }}>Your conversation is still active</span>
        </div>
      ) : (
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div ref={scrollRef} style={{ height: "100%", overflowY: "auto", padding: `16px ${gutterX}px` }}>
            <div style={{ maxWidth: colWidth, margin: "0 auto" }}>
              {MSGS.map((m, i) => {
                const isDr = m.w === "dr";
                return (
                  <div key={i} style={{ display: "flex", gap: CHAT.avatarGap, marginBottom: msgGapY, flexDirection: isDr ? "row-reverse" : "row" }}>
                    <div style={{ width: CHAT.avatarSize, height: CHAT.avatarSize, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isDr ? `linear-gradient(135deg, ${C.accent} 0%, ${C.accentHi} 100%)` : C.bgEl, border: isDr ? "none" : `1px solid ${C.borderSubtle}`, fontSize: 8.5, fontWeight: 700, color: isDr ? "#fff" : C.textDim, boxShadow: isDr ? `${C.insetHi}, 0 2px 4px ${C.accentGlow}` : "none", letterSpacing: "0.02em" }}>{isDr ? "HCP" : "AI"}</div>
                    <div style={{ maxWidth: isDr ? CHAT.hcpMaxW : "100%", flex: isDr ? undefined : 1, minWidth: 0 }}>
                      {isDr ? (
                        // HCP — soft teal pill, right-aligned
                        <div style={{ padding: `${CHAT.hcpPadY}px ${CHAT.hcpPadX}px`, borderRadius: CHAT.hcpRadius, background: C.accentDim, border: `1px solid ${C.borderAcc}26`, boxShadow: C.shadowSoft }}>
                          <span style={{ fontSize: bodyFont, color: C.text, lineHeight: CHAT.bodyLH, letterSpacing: "-0.005em" }}>{m.t}</span>
                        </div>
                      ) : (
                        // AI — plain text on the page, no bubble (this is what reads as Claude)
                        <div style={{ paddingTop: 3 }}>
                          <span style={{ fontSize: bodyFont, color: C.text, lineHeight: CHAT.bodyLH, letterSpacing: "-0.005em" }}>{m.t}</span>
                        </div>
                      )}
                      {m.img === "echo" && <EchoImg C={C} />}
                      {m.img === "chart" && <ChartImg C={C} />}
                    </div>
                  </div>
                );
              })}
              <div style={{ fontSize: 9.5, color: C.textDim, textAlign: "center", marginTop: CHAT.hintGapY, letterSpacing: "0.01em" }}>💡 Images, charts, and documents render inline</div>
            </div>
          </div>
          {!isMobile && (
            <button onClick={scrollToBottom} title="Scroll to latest" style={{ position: "absolute", bottom: 12, right: 14, width: 30, height: 30, borderRadius: "50%", border: `1px solid ${C.borderSubtle}`, background: C.bgCard, color: C.accent, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px rgba(0,0,0,0.35), ${C.insetHi}`, transition: "all 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderAcc; e.currentTarget.style.boxShadow = `0 4px 12px rgba(0,0,0,0.35), 0 0 10px ${C.accentGlow}, ${C.insetHi}`; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderSubtle; e.currentTarget.style.boxShadow = `0 4px 12px rgba(0,0,0,0.35), ${C.insetHi}`; }}>↓</button>
          )}
        </div>
      )}

      {/* Composer — airier: separated by space, soft border, taller input + dictation mic */}
      <div style={{ padding: `${CHAT.composerOuterY}px ${gutterX}px`, borderTop: `1px solid ${C.borderSubtle}80`, flexShrink: 0, background: C.bgCard }}>
        {listening && (
          <div style={{ maxWidth: colWidth, margin: "0 auto 8px", display: "flex", alignItems: "center", gap: 7, color: C.danger, fontSize: 11, fontWeight: 600 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.danger, animation: "pulse 1s ease-in-out infinite" }} />
            Dictating… speak now
          </div>
        )}
        <div style={{ maxWidth: colWidth, margin: "0 auto", display: "flex", gap: 10, alignItems: "center" }}>
          {/* Dictation mic — distinct from the AVE FAB */}
          <button
            onClick={toggle}
            disabled={!supported}
            title={!supported ? "Dictation not supported in this browser" : listening ? "Stop dictation" : "Dictate into chat"}
            aria-label={listening ? "Stop dictation" : "Start dictation"}
            style={{ flexShrink: 0, width: 42, height: 42, borderRadius: CHAT.composerRadius, border: `1.5px solid ${listening ? C.danger : C.borderSubtle}`, background: listening ? "rgba(224,98,98,0.12)" : C.bg, color: listening ? C.danger : supported ? C.textMuted : C.textDim, cursor: supported ? "pointer" : "not-allowed", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center", opacity: supported ? 1 : 0.5, transition: "all 0.15s", boxShadow: listening ? "0 0 10px rgba(224,98,98,0.3)" : "none" }}
          >🎙</button>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={listening ? "Listening…" : "Type or speak…"} style={{ flex: 1, padding: `${CHAT.composerPadY}px ${CHAT.composerPadX}px`, borderRadius: CHAT.composerRadius, background: C.bg, border: `1px solid ${C.borderSubtle}`, color: C.text, fontSize: narrow ? CHAT.bodyFontNarrow : CHAT.bodyFont, fontFamily: "'Outfit',sans-serif", outline: "none", transition: "border-color 0.15s" }} onFocus={(e) => (e.target.style.borderColor = C.borderAcc)} onBlur={(e) => (e.target.style.borderColor = C.borderSubtle)} />
          <button onClick={() => { triggerInsights(); setDraft(""); }} style={{ flexShrink: 0, padding: "12px 18px", borderRadius: CHAT.composerRadius, border: "none", background: `linear-gradient(135deg, ${C.accentHi} 0%, ${C.accent} 100%)`, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", boxShadow: `0 0 12px ${C.accentGlow}, ${C.insetHi}`, letterSpacing: "0.02em", transition: "transform 0.1s" }} onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")} onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")} onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>Send</button>
        </div>
      </div>
    </div>
  );
}
