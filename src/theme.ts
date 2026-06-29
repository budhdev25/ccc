// CCC theme tokens — ported verbatim from CCC_Preview.jsx (v8.2) THEMES,
// plus the CHAT spacing scale (BUILD_PLAN.md §2) — pure geometry, theme-agnostic.

export const THEMES = {
  dark: {
    // Surface ramp — layered navy with cool undertone
    page: "#070912", bg: "#10142a", bgCard: "#181d3a", bgEl: "#212747", bgHover: "#2a3158",
    sidebarBg: "#0c0f22",
    // Borders
    border: "#262c54", borderSubtle: "#1c2244", borderAcc: "#1A9A9A",
    // Brand accent
    accent: "#1A9A9A", accentHi: "#2dbdbd",
    accentDim: "rgba(26,154,154,0.10)", accentDimHi: "rgba(26,154,154,0.18)",
    accentGlow: "rgba(26,154,154,0.30)",
    // Type
    text: "#eef1fb", textMuted: "#a8b3d0", textDim: "#6f7ba0",
    // Status
    success: "#34c98a", warning: "#e9b049", danger: "#e06262", blue: "#6699e8", purple: "#a585d8",
    // Depth utilities
    navHover: "rgba(26,154,154,0.06)",
    shadowCard: "0 1px 0 rgba(255,255,255,0.025) inset, 0 4px 14px rgba(0,0,0,0.32)",
    shadowSoft: "0 1px 2px rgba(0,0,0,0.35)",
    insetHi: "inset 0 1px 0 rgba(255,255,255,0.04)",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  light: {
    // Slightly deepened surfaces so cards separate from the white page.
    page: "#e4e9f1", bg: "#ffffff", bgCard: "#eef2f9", bgEl: "#e7edf6", bgHover: "#dde5f0",
    sidebarBg: "#eaeff7",
    // Stronger, cooler borders — clear container definition (was #d3dae6 / #e3e8f0).
    border: "#9aa7c2", borderSubtle: "#bcc6db", borderAcc: "#0D7377",
    accent: "#0D7377", accentHi: "#0e8a8e",
    accentDim: "rgba(13,115,119,0.09)", accentDimHi: "rgba(13,115,119,0.16)",
    accentGlow: "rgba(13,115,119,0.22)",
    text: "#0f1530", textMuted: "#475068", textDim: "#6e7891",
    success: "#0D7377", warning: "#d97706", danger: "#dc2626", blue: "#2563eb", purple: "#7c3aed",
    navHover: "rgba(13,115,119,0.06)",
    shadowCard: "0 1px 0 rgba(255,255,255,0.7) inset, 0 1px 3px rgba(13,30,80,0.10), 0 4px 14px rgba(13,30,80,0.10)",
    shadowSoft: "0 1px 3px rgba(13,30,80,0.10)",
    insetHi: "inset 0 1px 0 rgba(255,255,255,0.7)",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
} as const;

// Structural type with widened string values so `dark ? THEMES.dark : THEMES.light`
// (a union of two distinct literal shapes) is assignable to a single Theme.
export type Theme = { [K in keyof typeof THEMES.dark]: string };

// Conversation-surface spacing scale — "Claude airy" treatment.
// Applies ONLY to the chat transcript/composer + free-chat box.
// Clinical panels keep their own dense, hardcoded values.
export const CHAT = {
  colMax: 680,          // ideal reading-column width (was 480)
  narrowBP: 560,        // below this PANEL width, drop to narrow mode (the 320px Consult case)
  gutterX: 24,          // horizontal padding around the column at full width (was 16)
  gutterXNarrow: 14,    // horizontal padding when panel is narrow
  msgGapY: 24,          // vertical rhythm BETWEEN turns (was 12)
  msgGapYNarrow: 14,    // between-turn rhythm when narrow
  hcpPadX: 16,          // HCP bubble horizontal padding (was 12)
  hcpPadY: 11,          // HCP bubble vertical padding (was 8)
  hcpRadius: 16,        // HCP container corner radius — soft, even
  hcpMaxW: "82%",       // HCP pill max width
  bodyFont: 15,         // message body size (was 12)
  bodyFontNarrow: 13,   // message body when narrow
  bodyLH: 1.65,         // body line-height (was 1.55)
  avatarSize: 28,       // role glyph (was 26)
  avatarGap: 12,        // gap between avatar and message body (was 8)
  composerPadY: 14,     // composer input vertical padding (was 8)
  composerPadX: 16,     // composer input horizontal padding (was 12)
  composerOuterY: 16,   // padding around the composer band (was 10/12)
  composerRadius: 12,   // input corner radius (was 6)
  hintGapY: 20,         // space above the "renders inline" hint (was 6)
} as const;

// Panel layout scale — full-width tab/module content is pulled into a compact,
// centered reading column with massive surrounding whitespace (Claude philosophy
// applied to the panels, not just the chat). Tunable in one place.
export const PANEL = {
  maxWidth: 560,   // compact centered column — content never spans edge-to-edge
  padY: 48,        // generous vertical whitespace above/below the column
  padX: 28,        // min horizontal gutter when the viewport is too narrow to show margins
} as const;
