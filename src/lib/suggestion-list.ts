import { isShortScreen } from '@/lib/welcome';

// A 44pt touch target per row
export const SUGGESTION_ROW_HEIGHT = 44;

// Three rows, two on a short phone, then the list scrolls
export function visibleSuggestionRows(screenHeight: number): number {
  return isShortScreen(screenHeight) ? 2 : 3;
}

export function suggestionListHeight(screenHeight: number): number {
  return visibleSuggestionRows(screenHeight) * SUGGESTION_ROW_HEIGHT;
}
