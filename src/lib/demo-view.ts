// The web plays the demo once half of it is in view
const IN_VIEW_SHARE = 0.5;

export type Box = { top: number; height: number };

// How much of the frame the scroll view shows, as the web's useInView
export function isHalfInView(
  frame: Box,
  scrollY: number,
  viewportHeight: number,
): boolean {
  if (frame.height <= 0 || viewportHeight <= 0) return false;
  const shownTop = Math.max(frame.top, scrollY);
  const shownBottom = Math.min(
    frame.top + frame.height,
    scrollY + viewportHeight,
  );
  const shown = Math.max(0, shownBottom - shownTop);
  return shown >= frame.height * IN_VIEW_SHARE;
}
