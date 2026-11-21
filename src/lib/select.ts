import { searchKey } from '@/lib/filters';
import type { SelectOption } from '@/types/select';

// Short lists fit the sheet; longer ones get a search field
export const SELECT_SEARCH_FROM = 9;

export function needsSearch(options: readonly SelectOption[]): boolean {
  return options.length >= SELECT_SEARCH_FROM;
}

// Accent- and case-blind, as the web's filter search
export function filterOptions(
  options: readonly SelectOption[],
  query: string,
): SelectOption[] {
  const key = searchKey(query);
  if (!key) return [...options];
  return options.filter((option) => searchKey(option.label).includes(key));
}

// The row's value: "Any", the one pick, or how many
export function selectValueLabel(
  selected: readonly string[],
  options: readonly SelectOption[],
  anyLabel = 'Any',
): string {
  const picked = options.filter((option) => selected.includes(option.id));
  if (picked.length === 0) return anyLabel;
  if (picked.length === 1) return picked[0].label;
  return `${picked.length} selected`;
}
