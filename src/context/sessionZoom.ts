// Zoom bounds shared by SessionContext and ZoomControl.

export const ZOOM_MIN = 0.6;
export const ZOOM_MAX = 2.0;

export const clampZoom = (z: number) =>
  Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, +z.toFixed(2)));
