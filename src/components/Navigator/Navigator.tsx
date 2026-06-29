import { useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useSession } from "../../hooks/useSession";
import { useViewport } from "../../hooks/useViewport";
import { beginHorizontalResize } from "../../hooks/useResizeDrag";
import { ZoomControl } from "../primitives/ZoomControl";
import { navigationService } from "../../services";

export function Navigator() {
  const { C } = useTheme();
  const {
    view, setView, sessionMode, setSessionMode,
    sideCol, setSideCol, navWidth, setNavWidth, modsOpen, setModsOpen, recentsOpen, setRecentsOpen,
    navSearch, setNavSearch, sessions, activeSessionId,
    openSession, renameSession, deleteSession, getZoom,
    mobileNavOpen, setMobileNavOpen,
  } = useSession();
  const { isMobile } = useViewport();
  // On mobile the sidebar is an off-canvas drawer; collapse mode is desktop-only.
  const closeNav = () => { if (isMobile) setMobileNavOpen(false); };

  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [renameVal, setRenameVal] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [tooltipY, setTooltipY] = useState(0);
  const [navResizeActive, setNavResizeActive] = useState(false);
  const navItems = navigationService.getNavItems();

  const shellStyle: CSSProperties = isMobile
    ? { position: "fixed", top: 0, left: 0, bottom: 0, width: "min(286px, 84vw)", transform: mobileNavOpen ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.25s ease", zIndex: 1001, overflow: "hidden", boxShadow: mobileNavOpen ? "0 0 50px rgba(0,0,0,0.55)" : "none" }
    : { width: sideCol ? 56 : navWidth, transition: navResizeActive ? "none" : "width 0.2s ease", position: "relative", overflow: sideCol ? "visible" : "hidden", zIndex: sideCol ? 20 : undefined };

  // Navigator's left edge sits at window x=0, so width = pointerX.
  const startNavDrag = (e: ReactMouseEvent) => {
    setNavResizeActive(true);
    beginHorizontalResize(e, { base: 0, min: 180, max: 360, onWidth: setNavWidth });
    const up = () => { setNavResizeActive(false); window.removeEventListener("mouseup", up); };
    window.addEventListener("mouseup", up);
  };

  const searchHits = sessions.filter((s) =>
    s.title.toLowerCase().includes(navSearch.toLowerCase())
  );

  return (
    <>
    {isMobile && mobileNavOpen && (
      <div onClick={() => setMobileNavOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(3,5,12,0.5)", zIndex: 1000 }} aria-hidden="true" />
    )}
    <div style={{ ...shellStyle, display: "flex", flexDirection: "column", background: C.sidebarBg, borderRight: `1px solid ${C.border}`, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: sideCol ? "center" : "space-between", padding: sideCol ? "12px 0" : "12px 14px", borderBottom: `1px solid ${C.borderSubtle}`, flexShrink: 0 }}>
        {!sideCol && <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: "0.12em" }}>Navigator</span>}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {!sideCol && <ZoomControl zoomKey="nav" label="Navigator" />}
          <button onClick={() => (isMobile ? setMobileNavOpen(false) : setSideCol((v) => !v))} aria-label={isMobile ? "Close navigation" : sideCol ? "Expand navigator" : "Collapse navigator"} style={{ width: 24, height: 24, borderRadius: 5, border: `1px solid ${C.borderSubtle}`, background: C.bgEl, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.textMuted, fontSize: isMobile ? 13 : 10, flexShrink: 0, transition: "all 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderAcc; e.currentTarget.style.color = C.accent; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.borderSubtle; e.currentTarget.style.color = C.textMuted; }}>{isMobile ? "✕" : sideCol ? "▶" : "◀"}</button>
        </div>
      </div>

      {/* New Session */}
      <div style={{ padding: sideCol ? "10px 8px" : "12px 12px", borderBottom: `1px solid ${C.borderSubtle}`, flexShrink: 0 }}>
        <button onClick={() => { setSessionMode("new"); closeNav(); }} style={{ width: "100%", padding: sideCol ? "8px 0" : "9px 12px", borderRadius: 7, border: `1.5px solid ${C.borderAcc}`, background: `linear-gradient(180deg, ${C.accentDimHi} 0%, ${C.accentDim} 100%)`, color: C.accent, fontSize: sideCol ? 16 : 11.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", justifyContent: sideCol ? "center" : "flex-start", gap: 8, boxShadow: `0 0 12px ${C.accentGlow}, ${C.insetHi}`, letterSpacing: "0.01em", transition: "all 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.background = `linear-gradient(180deg, ${C.accentDimHi} 0%, ${C.accentDimHi} 100%)`; }} onMouseLeave={(e) => { e.currentTarget.style.background = `linear-gradient(180deg, ${C.accentDimHi} 0%, ${C.accentDim} 100%)`; }}>
          <span style={{ fontSize: sideCol ? 16 : 14, lineHeight: 1 }}>+</span>{!sideCol && <span style={{ whiteSpace: "nowrap" }}>New Session</span>}
        </button>
      </div>

      {/* Search bar */}
      {!sideCol && (
        <div style={{ padding: "8px 12px", borderBottom: `1px solid ${C.borderSubtle}`, flexShrink: 0 }}>
          <input value={navSearch} onChange={(e) => setNavSearch(e.target.value)} placeholder="🔍  Search chats…" style={{ width: "100%", padding: "6px 10px", borderRadius: 6, background: C.bg, border: `1px solid ${navSearch ? C.borderAcc : C.borderSubtle}`, color: C.text, fontSize: 10.5, fontFamily: "'Outfit',sans-serif", outline: "none", transition: "border-color 0.2s" }} />
        </div>
      )}

      {!sideCol && (
        <>
          {navSearch ? (
            <div style={{ flex: 1, overflowY: "auto", padding: "6px", zoom: getZoom("nav") }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.07em", padding: "4px 6px 6px" }}>Results ({searchHits.length})</div>
              {searchHits.map((s) => (
                <button key={s.id} onClick={() => { openSession(s); closeNav(); }} style={{ width: "100%", padding: "7px 9px", borderRadius: 6, border: `1px solid ${C.border}`, background: activeSessionId === s.id ? C.accentDim : C.bgEl, cursor: "pointer", textAlign: "left", fontFamily: "'Outfit',sans-serif", marginBottom: 3 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: activeSessionId === s.id ? C.accent : C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</div>
                  <div style={{ fontSize: 9, color: C.textDim, marginTop: 1 }}>{s.timestamp}</div>
                </button>
              ))}
              {searchHits.length === 0 && <div style={{ fontSize: 10, color: C.textDim, padding: "8px 6px" }}>No chats found</div>}
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: "auto", zoom: getZoom("nav") }}>
              {/* Modules — collapsible */}
              <div style={{ flexShrink: 0 }}>
                <button onClick={() => setModsOpen((v) => !v)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px 8px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.12em" }}>Modules</span>
                  <span style={{ fontSize: 9, color: C.textDim, transition: "transform 0.2s", transform: modsOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                </button>
                {modsOpen && (
                  <div style={{ padding: "0 8px 8px" }}>
                    {navItems.map((n) => {
                      const a = view === n.id && sessionMode === "active";
                      return (
                        <button key={n.id} onClick={() => { setView(n.id); setSessionMode("active"); closeNav(); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", borderRadius: 6, border: `1px solid ${a ? C.borderAcc + "50" : "transparent"}`, background: a ? C.accentDim : "transparent", color: a ? C.accent : C.textMuted, fontSize: 11, fontWeight: a ? 600 : 500, cursor: "pointer", fontFamily: "'Outfit',sans-serif", textAlign: "left", marginBottom: 1, boxShadow: a ? C.insetHi : "none", transition: "all 0.15s" }} onMouseEnter={(e) => { if (!a) { e.currentTarget.style.background = C.navHover; e.currentTarget.style.color = C.text; } }} onMouseLeave={(e) => { if (!a) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMuted; } }}>
                          <span style={{ fontSize: 13, flexShrink: 0, opacity: a ? 1 : 0.75 }}>{n.icon}</span>
                          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 11 }}>{n.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Recent sessions */}
              <div style={{ borderTop: `1px solid ${C.borderSubtle}`, marginTop: 4 }}>
                <button onClick={() => setRecentsOpen((v) => !v)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px 8px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: "0.12em" }}>Recent</span>
                  <span style={{ fontSize: 9, color: C.textDim, transition: "transform 0.2s", transform: recentsOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
                </button>
                {recentsOpen && (
                  <div style={{ padding: "0 8px 8px" }}>
                    {sessions.map((s) => {
                      const isActive = activeSessionId === s.id && sessionMode === "active";
                      const isRenaming = renamingId === s.id;
                      const commitRename = () => { renameSession(s.id, renameVal); setRenamingId(null); };
                      return (
                        <div key={s.id} style={{ position: "relative", marginBottom: 2 }}>
                          <button onClick={() => { openSession(s); closeNav(); }} style={{ width: "100%", padding: "8px 32px 8px 10px", borderRadius: 6, border: `1px solid ${isActive ? C.borderAcc + "50" : "transparent"}`, background: isActive ? C.accentDim : "transparent", cursor: "pointer", textAlign: "left", fontFamily: "'Outfit',sans-serif", boxShadow: isActive ? C.insetHi : "none", transition: "all 0.15s", position: "relative" }} onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = C.navHover; }} onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                            {isActive && <div style={{ position: "absolute", left: -8, top: 8, bottom: 8, width: 2, borderRadius: 1, background: C.accent, boxShadow: `0 0 6px ${C.accentGlow}` }} />}
                            {isRenaming ? (
                              <input autoFocus value={renameVal} onChange={(e) => setRenameVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") commitRename(); if (e.key === "Escape") setRenamingId(null); }} onBlur={commitRename} onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "2px 4px", background: C.bgEl, border: `1px solid ${C.borderAcc}`, borderRadius: 4, color: C.text, fontSize: 11, fontFamily: "'Outfit',sans-serif", outline: "none" }} />
                            ) : (
                              <div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: isActive ? C.accent : C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1.3 }}>{s.title}</div>
                                <div style={{ fontSize: 9.5, color: C.textDim, marginTop: 2, fontFamily: C.mono, letterSpacing: "0.01em" }}>{s.timestamp}</div>
                              </div>
                            )}
                          </button>
                          {!isRenaming && confirmDeleteId === s.id ? (
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, padding: "5px 6px" }} onClick={(e) => e.stopPropagation()}>
                              <span style={{ fontSize: 9, color: C.danger, flex: 1, fontWeight: 600 }}>Delete this chat?</span>
                              <button onClick={(e) => { e.stopPropagation(); deleteSession(s.id); setConfirmDeleteId(null); }} style={{ padding: "3px 8px", borderRadius: 4, border: `1px solid ${C.danger}`, background: "rgba(224,98,98,0.12)", color: C.danger, cursor: "pointer", fontSize: 9, fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>Yes</button>
                              <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }} style={{ padding: "3px 8px", borderRadius: 4, border: `1px solid ${C.border}`, background: "transparent", color: C.textMuted, cursor: "pointer", fontSize: 9, fontFamily: "'Outfit',sans-serif" }}>No</button>
                            </div>
                          ) : !isRenaming ? (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(s.id); }} title="Delete" style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, borderRadius: 4, border: "none", background: "transparent", color: C.textDim, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5, transition: "all 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = C.danger; e.currentTarget.style.background = "rgba(224,98,98,0.10)"; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.color = C.textDim; e.currentTarget.style.background = "transparent"; }}>×</button>
                              <button onClick={(e) => { e.stopPropagation(); setRenamingId(s.id); setRenameVal(s.title); }} title="Rename" style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, borderRadius: 4, border: "none", background: "transparent", color: C.textDim, cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5, transition: "all 0.15s" }} onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = C.accent; e.currentTarget.style.background = C.accentDim; }} onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; e.currentTarget.style.color = C.textDim; e.currentTarget.style.background = "transparent"; }}>✏</button>
                            </>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User */}
          <div style={{ padding: "10px 12px", borderTop: `1px solid ${C.borderSubtle}`, flexShrink: 0, display: "flex", alignItems: "center", gap: 10, background: C.bg }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: `linear-gradient(135deg, ${C.accentHi} 0%, ${C.accent} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0, boxShadow: `${C.insetHi}, 0 2px 6px ${C.accentGlow}`, letterSpacing: "-0.01em" }}>MT</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.3 }}>Dr. Maya Thompson</div>
              {/* Persona aligned to clinical content (BUILD_PLAN C-10): cardiology, not dermatology. */}
              <div style={{ fontSize: 9.5, color: C.textDim, letterSpacing: "0.02em" }}>Cardiology</div>
            </div>
          </div>
        </>
      )}

      {/* Collapsed rail */}
      {sideCol && (
        <div style={{ flex: 1, overflowY: "auto", padding: "6px 4px" }}>
          {navItems.map((n) => (
            <div key={n.id} style={{ position: "relative" }}>
              <button onClick={() => { setView(n.id); setSessionMode("active"); }} onMouseEnter={(e) => { setHoveredNav(n.id); const r = e.currentTarget.getBoundingClientRect(); setTooltipY(r.top + r.height / 2); }} onMouseLeave={() => setHoveredNav(null)} style={{ width: "100%", padding: "8px 0", borderRadius: 5, border: `2px solid ${view === n.id ? C.borderAcc : "transparent"}`, background: view === n.id ? C.accentDim : "transparent", cursor: "pointer", fontFamily: "'Outfit',sans-serif", fontSize: 14, textAlign: "center", marginBottom: 1, boxShadow: view === n.id ? `0 0 8px ${C.accentGlow}` : "none", transition: "all 0.15s" }}>{n.icon}</button>
            </div>
          ))}
        </div>
      )}

      {sideCol && hoveredNav && (
        <div style={{ position: "fixed", left: 60, top: tooltipY, transform: "translateY(-50%)", background: C.bgCard, border: `1px solid ${C.borderAcc}`, borderRadius: 6, padding: "5px 11px", fontSize: 11, fontWeight: 600, color: C.text, whiteSpace: "nowrap", zIndex: 9999, boxShadow: "0 4px 14px rgba(0,0,0,0.35)", pointerEvents: "none" }}>
          {navItems.find((n) => n.id === hoveredNav)?.label}
        </div>
      )}

      {/* Right-edge resize handle (only when expanded, desktop only) */}
      {!sideCol && !isMobile && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize navigator"
          onMouseDown={startNavDrag}
          onMouseEnter={(e) => { e.currentTarget.style.background = C.accentDim; }}
          onMouseLeave={(e) => { if (!navResizeActive) e.currentTarget.style.background = "transparent"; }}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 7, cursor: "col-resize", background: navResizeActive ? C.accentDim : "transparent", borderRight: `2px solid ${navResizeActive ? C.borderAcc : "transparent"}`, zIndex: 25, transition: "background 0.15s" }}
        />
      )}
    </div>
    </>
  );
}
