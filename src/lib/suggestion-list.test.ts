import { describe, expect, it } from 'vitest';
import {
  SUGGESTION_ROW_HEIGHT,
  suggestionListHeight,
  visibleSuggestionRows,
} from '@/lib/suggestion-list';

describe('visibleSuggestionRows', () => {
  it('shows three rows on a regular phone', () => {
    expect(visibleSuggestionRows(844)).toBe(3);
    expect(visibleSuggestionRows(700)).toBe(3);
  });

  it('shows two rows on a short phone', () => {
    expect(visibleSuggestionRows(667)).toBe(2);
    expect(visibleSuggestionRows(699)).toBe(2);
  });
});

describe('suggestionListHeight', () => {
  it('fits the visible rows exactly', () => {
    expect(suggestionListHeight(844)).toBe(3 * SUGGESTION_ROW_HEIGHT);
    expect(suggestionListHeight(667)).toBe(2 * SUGGESTION_ROW_HEIGHT);
  });
});
