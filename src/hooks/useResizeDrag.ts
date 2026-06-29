import type { MouseEvent as ReactMouseEvent } from "react";

interface ResizeOpts {
  base: number; // window x-coordinate the panel's left edge sits at
  min: number;
  max: number;
  onWidth: (w: number) => void;
}

// Starts a horizontal drag: new width = pointerX - base, clamped to [min, max].
// Captured at mousedown; releases its window listeners on mouseup.
export function beginHorizontalResize(e: ReactMouseEvent, opts: ResizeOpts) {
  e.preventDefault();
  const { base, min, max, onWidth } = opts;
  const move = (ev: globalThis.MouseEvent) => {
    let w = ev.clientX - base;
    if (w < min) w = min;
    if (w > max) w = max;
    onWidth(w);
  };
  const up = () => {
    window.removeEventListener("mousemove", move);
    window.removeEventListener("mouseup", up);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
  };
  document.body.style.userSelect = "none";
  document.body.style.cursor = "col-resize";
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", up);
}
