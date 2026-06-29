import { useEffect, useState } from "react";

// Single source of truth for responsive breakpoints. Below MOBILE_BP the app
// switches from the desktop multi-column layout to a single-column, drawer-nav
// layout (see App/Navigator/ClinicalWorkspace). Updates on resize + rotation.
export const MOBILE_BP = 760;

export function useViewport() {
  const read = () => (typeof window === "undefined" ? 1280 : window.innerWidth);
  const [width, setWidth] = useState<number>(read);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  return { width, isMobile: width < MOBILE_BP };
}
