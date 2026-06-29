import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Theme } from "../../theme";

// Hover-lift card with an accent glow. Ported from the preview `Glow`.
export function Glow({
  C,
  children,
  style = {},
  onClick,
  leftAccent,
}: {
  C: Theme;
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  leftAccent?: string; // colored left edge — drawn as an inset bar to avoid border shorthand conflicts
}) {
  const [h, sH] = useState(false);
  const base = h
    ? `0 0 14px ${C.accentGlow}, ${C.insetHi}, 0 2px 8px rgba(0,0,0,0.18)`
    : typeof style.boxShadow === "string"
      ? style.boxShadow
      : "";
  const bar = leftAccent ? `inset 3px 0 0 ${leftAccent}` : "";
  const boxShadow = [base, bar].filter(Boolean).join(", ") || "none";
  return (
    <div
      onMouseEnter={() => sH(true)}
      onMouseLeave={() => sH(false)}
      onClick={onClick}
      style={{
        ...style,
        border: `1px solid ${h ? C.borderAcc : C.borderSubtle}`,
        borderRadius: 8,
        transition: "all 0.18s ease",
        boxShadow,
        cursor: onClick ? "pointer" : "default",
        transform: h ? "translateY(-1px)" : "translateY(0)",
      }}
    >
      {children}
    </div>
  );
}
