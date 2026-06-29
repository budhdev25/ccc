# Clinical Command Center (CCC) — Project Handoff

_Last updated: 2026-06-17_

## What this is

**Clinical Command Center (CCC)** — a clinician-facing AI decision-support web app that
combines a conversational AI avatar (**AVE**, eventually powered by Tavus CVI) with
clinical reasoning modules (eventually powered by the Glass Health API). Built for
Divigner Group / Avanew as a polished, demo-ready prototype.

- **Repo:** https://github.com/JaeMcKinney/ccc-app
- **Local path:** `/Users/jaemckinney/Downloads/ccc-app`
- **Stack:** Vite + React + TypeScript SPA
- **Target live URL:** `ccc.apps.divigner.com` (via Cloudflare wildcard → Vercel)

## Current phase

**Phase 0–1 complete:** full visual port of the original 654-line `CCC_Preview.jsx`
visual contract into a real component architecture, with mock/simulated data and **no
real API calls yet**. The app is fully interactive as a demo.

**Phase 2+ (not started):** wire real APIs — Tavus CVI for the live avatar, Glass Health
for DDx/treatment reasoning, real CME/provider catalog queries.

## Architecture

Monolith refactored into React Context providers (replaced ~38 useState hooks):
- **ThemeContext** — `dark`/`light` themes; `theme.ts` holds `THEMES`, `CHAT` spacing
  scale, `PANEL` layout scale. `type Theme = { [K in keyof typeof THEMES.dark]: string }`.
- **SessionContext** — zoom registry (`getZoom`/`setZoom` per panel key), `navWidth`,
  `consultWidth`. All persisted to localStorage via `lib/persist.ts`
  (`loadPref`/`savePref`). `consultWidth` lives here (not ConsultContext) so it survives
  view switches.
- **TavusContext** — `speaking`, `mode` (`ave`|`visual`), `aveOpen`, `aveSize`
  (`popup`|`modal`|`fullscreen`).
- **ConsultContext** — active consult/chat state.

### Key components
- `components/primitives/ContentPanel.tsx` — centered compact column with massive
  whitespace; `zoomKey` prop adds a zoom toolbar 22px above content; `fill` = `flex`|`full`.
- `components/primitives/ZoomControl.tsx` — universal −/%/+ control bound to session zoom registry.
- `components/primitives/Glow.tsx` — glow card primitive; `leftAccent` prop draws an inset
  accent bar via boxShadow (avoids border shorthand/longhand React warning).
- `components/AVE/AveAvatar.tsx` — loads `/ave-avatar.jpg` via `import.meta.env.BASE_URL`;
  teal "AVE" pill fallback if missing.
- `components/AVE/AVEPopup.tsx` — three sizes: popup (bottom-right), modal (centered),
  fullscreen (presentation mode). Fullscreen shows patient context + Chat/DDx/Treatment tabs.
- `components/AVE/FullscreenContext.tsx` — patient context banner + tabs for fullscreen mode.
- `components/Modules/CME.tsx` — 12-program fictitious catalog (real accrediting bodies,
  demo programs) showing provider, URL, description, credits, type, format, due date.
  Shows 5 "recommended" on open; keyword-ranks (tokenize→score→sort) on prompt.
- `components/Modules/Medsights.tsx` — 8-item intel catalog, same keyword-ranking pattern.
- `components/Modules/Schedule.tsx` — Patient/Personal/Both toggle, time-sorted merge in Both.
- `components/Consult/ChatTab.tsx` — dictation mic (`useDictation`), AI plain text vs
  HCP teal pill bubbles.
- `components/Insights/InsightsPanel.tsx` — compact content-width tabs at top, zoom in header.
- `hooks/useDictation.ts` — Web Speech API, continuous + interimResults, graceful fallback.

### Layout behavior
- Default Consult view has the Insights panel already expanded; both panels are
  width-resizable (persisted).
- When Insights opens, Consult collapses to ~320px → `useChatColumn` ResizeObserver
  measures the panel (not the window); `CHAT.narrowBP = 560px` switches to a narrow token
  set (13px body); chat column is fluid `min(680px, 100%)`.

## Bugs fixed along the way
- **animationDelay warning** — folded delay into `animation` shorthand string.
- **Glow borderLeft conflict** — replaced with `leftAccent` inset boxShadow.
- **ContentPanel zoom overlay** — toolbar `marginBottom: 22` for a clear gap.
- **CME empty-on-open** — init `status: "done"` with `CATALOG.slice(0,5)`.
- **Theme literal-type error** — mapped-type `Theme`.
- **consultWidth reset on nav** — lifted to SessionContext.

## Deployment (IN PROGRESS — this is where we are)

**Plan:** Cloudflare wildcard DNS so every future app gets a `*.apps.divigner.com`
hostname without new DNS records.

### Step 1 — Cloudflare DNS record (user is doing this now)
In the Cloudflare "Add record" dialog:
| Field | Value |
|---|---|
| Type | `CNAME` |
| Name | `*.apps` |
| Target | `cname.vercel-dns.com` |
| Proxy status | **DNS only — grey cloud** (NOT proxied/orange) |
| TTL | `Auto` |

⚠️ Must be grey cloud — Vercel SSL provisioning fails if proxied through Cloudflare.

### Step 2 — Vercel
1. Import `JaeMcKinney/ccc-app` at vercel.com (Vite preset auto-detected).
2. Project → Settings → Domains → add `ccc.apps.divigner.com`.
3. Vercel sees it resolves via the wildcard, verifies, issues SSL in a few minutes.

### Per future app
Just add `<appname>.apps.divigner.com` in that app's Vercel project Domains. No new
Cloudflare record needed.

### vite.config.ts
Base is default `/` (subdomain root deploy, no subpath). Do not set a `base` unless
deploying under a path.

## Immediate next steps
1. User saves the Cloudflare wildcard record (grey cloud).
2. Assistant verifies DNS propagation (`dig`) — note: Bash was unavailable in the prior
   session; check tool availability.
3. Import repo in Vercel, add the domain, confirm SSL + live load.
4. Verify the live site renders (preview tools / curl).

## Phase 2 backlog
- Tavus CVI integration for live AVE avatar (replace static still + waveform sim).
- Glass Health API for real DDx / treatment reasoning.
- Real CME/CE provider catalog queries (replace simulated rank()).
- Real Medsights intel feed.
