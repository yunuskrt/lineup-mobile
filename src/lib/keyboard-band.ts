// React Native's Android keyboard height leaves out the navigation bar
export function bandLift(
  platform: string,
  keyboardHeight: number,
  bottomInset: number,
): number {
  return platform === 'android' ? keyboardHeight + bottomInset : keyboardHeight;
}
