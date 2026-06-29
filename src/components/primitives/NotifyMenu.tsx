import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { loadPref, savePref } from "../../lib/persist";

export interface NotifyOption {
  key: string;
  label: string;
  desc?: string;
}

// Panel-level notification preferences: a bell button that opens a popover of
// subscribe toggles. Choices persist to localStorage. Demo-only — no real
// notifications are delivered yet (Phase 2+ wires the actual feed/digest).
export function NotifyMenu({
  storeKey,
  title,
  options,
}: {
  storeKey: string;
  title: string;
  options: NotifyOption[];
}) {
  const { C } = useTheme();
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() => loadPref(storeKey, {}));
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => savePref(storeKey, prefs), [prefs, storeKey]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const active = options.filter((o) => prefs[o.key]).length;
  const toggle = (k: string) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Notification settings"
        style={{
          display: "flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 14,
          border: `1.5px solid ${active ? C.borderAcc : C.borderSubtle}`,
          background: active ? C.accentDim : C.bgEl, color: active ? C.accent : C.textMuted,
          fontSize: 10.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif",
          transition: "all 0.15s", whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontSize: 12 }}>{active ? "🔔" : "🔕"}</span>
        Notify
        {active > 0 && (
          <span style={{ fontSize: 9, fontWeight: 800, minWidth: 15, height: 15, padding: "0 4px", borderRadius: 8, background: C.accent, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: C.mono }}>{active}</span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute", right: 0, top: "calc(100% + 8px)", width: 270, zIndex: 200,
            background: C.bgCard, border: `1.5px solid ${C.borderAcc}`, borderRadius: 12,
            boxShadow: `0 12px 36px rgba(0,0,0,0.45), 0 0 16px ${C.accentGlow}`, overflow: "hidden",
            fontFamily: "'Outfit',sans-serif",
          }}
        >
          <div style={{ padding: "11px 14px", borderBottom: `1px solid ${C.borderSubtle}`, background: `linear-gradient(90deg, ${C.accentDim} 0%, transparent 100%)` }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: C.text, letterSpacing: "0.01em" }}>{title}</div>
            <div style={{ fontSize: 9.5, color: C.textDim, marginTop: 2 }}>Choose what to be alerted about</div>
          </div>
          <div style={{ padding: "6px" }}>
            {options.map((o) => {
              const on = !!prefs[o.key];
              return (
                <button
                  key={o.key}
                  onClick={() => toggle(o.key)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", textAlign: "left", fontFamily: "'Outfit',sans-serif", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.navHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 600, color: C.text }}>{o.label}</div>
                    {o.desc && <div style={{ fontSize: 9.5, color: C.textDim, marginTop: 2, lineHeight: 1.4 }}>{o.desc}</div>}
                  </div>
                  <span style={{ width: 30, height: 17, borderRadius: 9, background: on ? C.accent : C.border, position: "relative", flexShrink: 0, transition: "background 0.2s", boxShadow: on ? `0 0 8px ${C.accentGlow}` : "none" }}>
                    <span style={{ position: "absolute", top: 2, left: on ? 15 : 2, width: 13, height: 13, borderRadius: "50%", background: "#fff", transition: "left 0.18s" }} />
                  </span>
                </button>
              );
            })}
          </div>
          <div style={{ padding: "8px 14px", borderTop: `1px solid ${C.borderSubtle}`, fontSize: 9, color: C.textDim, lineHeight: 1.5 }}>
            {active > 0 ? `You'll be notified for ${active} ${active === 1 ? "topic" : "topics"} via email + in-app digest.` : "Notifications are off. Pick a topic above to start."}
          </div>
        </div>
      )}
    </div>
  );
}

// Small per-item bell toggle (e.g. "remind me about this program / follow this
// KOL"). Presentational — caller owns the on/off state.
export function BellToggle({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  const { C } = useTheme();
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={on ? `${label} — on` : label}
      style={{
        display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 4, fontSize: 9, fontWeight: 600,
        border: `1px solid ${on ? C.borderAcc : C.border}`, background: on ? C.accentDim : "transparent",
        color: on ? C.accent : C.textMuted, cursor: "pointer", fontFamily: "'Outfit',sans-serif", transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 10 }}>{on ? "🔔" : "🔕"}</span>
      {on ? "On" : label}
    </button>
  );
}
