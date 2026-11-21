// 0 at the top, 1 once the large title has scrolled under the bar
export function headerCollapse(scrollY: number, titleHeight: number): number {
  'worklet';
  if (titleHeight <= 0) return scrollY > 0 ? 1 : 0;
  return Math.min(1, Math.max(0, scrollY / titleHeight));
}
