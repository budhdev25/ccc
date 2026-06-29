import { createContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { THEMES } from "../theme";
import type { Theme } from "../theme";

export interface ThemeCtxValue {
  C: Theme;
  dark: boolean;
  toggle: () => void;
}

export const ThemeCtx = createContext<ThemeCtxValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(true);
  const value = useMemo<ThemeCtxValue>(
    () => ({ C: dark ? THEMES.dark : THEMES.light, dark, toggle: () => setDark((d) => !d) }),
    [dark]
  );
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}
