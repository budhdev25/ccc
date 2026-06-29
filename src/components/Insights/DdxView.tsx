import { useTheme } from "../../hooks/useTheme";
import { Glow } from "../primitives/Glow";
import { ContentPanel } from "../primitives/ContentPanel";
import { insightsService } from "../../services";
import type { DxItem } from "../../lib/types";

// TODO (Phase 3): replace DDX mock with streamed Glass markdown + a real
// CitationRenderer (literature / compound / billing_code). Today the [n] supers
// have no reference data behind them.
export function DdxView() {
  const { C } = useTheme();
  const ddx = insightsService.getDifferentialDiagnosis();
  const cats: { l: string; c: string; items: DxItem[] }[] = [
    { l: "Most Likely", c: C.success, items: ddx.ml },
    { l: "Expanded", c: C.warning, items: ddx.ex },
    { l: "Can't Miss", c: C.danger, items: ddx.cm },
  ];
  return (
    <ContentPanel fill="full" maxWidth={520}>
      {cats.map((cat) => (
        <div key={cat.l} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: cat.c, boxShadow: `0 0 6px ${cat.c}60` }} />
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: cat.c, whiteSpace: "nowrap" }}>{cat.l}</span>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${cat.c}40 0%, transparent 100%)` }} />
          </div>
          {cat.items.map((d, i) => (
            <Glow key={i} C={C} style={{ padding: "10px 13px", marginBottom: 6, background: C.bgEl, boxShadow: C.shadowSoft }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, marginBottom: 4, letterSpacing: "-0.01em" }}>
                {d.dx}
                {d.r.map((n) => (
                  <sup key={n} style={{ fontSize: 9, color: C.accent, marginLeft: 3, fontFamily: C.mono, fontWeight: 600 }}>[{n}]</sup>
                ))}
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.55 }}>{d.ev}</div>
            </Glow>
          ))}
        </div>
      ))}
    </ContentPanel>
  );
}
