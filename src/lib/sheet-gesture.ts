export const DISMISS_DISTANCE = 120;
export const DISMISS_VELOCITY = 800;

// A drag past 120pt, or a flick down, closes the sheet
export function shouldDismiss(
  translationY: number,
  velocityY: number,
): boolean {
  'worklet';
  return translationY > DISMISS_DISTANCE || velocityY > DISMISS_VELOCITY;
}
