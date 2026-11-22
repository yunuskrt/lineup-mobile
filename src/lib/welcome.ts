// Below this height (an iPhone SE is 667) the welcome trims its rules
export const SHORT_SCREEN_HEIGHT = 700;

// A first launch, or a signed-out one, meets the welcome; a session plays
export function landsOnWelcome(isTokenStored: boolean): boolean {
  return !isTokenStored;
}

export function isShortScreen(height: number): boolean {
  return height < SHORT_SCREEN_HEIGHT;
}
