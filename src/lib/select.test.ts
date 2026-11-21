import { describe, expect, it } from 'vitest';
import {
  filterOptions,
  needsSearch,
  SELECT_SEARCH_FROM,
  selectValueLabel,
} from '@/lib/select';
import type { SelectOption } from '@/types/select';

const CLUBS: SelectOption[] = [
  { id: 'atm', label: 'Atlético Madrid' },
  { id: 'bjk', label: 'Beşiktaş' },
  { id: 'liv', label: 'Liverpool' },
  { id: 'rma', label: 'Real Madrid' },
];

describe('filterOptions', () => {
  it('keeps every option for an empty query', () => {
    expect(filterOptions(CLUBS, '   ')).toEqual(CLUBS);
  });

  it('matches accent- and case-blind', () => {
    expect(filterOptions(CLUBS, 'atletico').map((o) => o.id)).toEqual(['atm']);
    expect(filterOptions(CLUBS, 'BESIKTAS').map((o) => o.id)).toEqual(['bjk']);
  });

  it('matches inside a name, in list order', () => {
    expect(filterOptions(CLUBS, 'madrid').map((o) => o.id)).toEqual([
      'atm',
      'rma',
    ]);
  });

  it('returns nothing when nothing matches', () => {
    expect(filterOptions(CLUBS, 'xyz')).toEqual([]);
  });
});

describe('selectValueLabel', () => {
  it('says Any with nothing picked', () => {
    expect(selectValueLabel([], CLUBS)).toBe('Any');
    expect(selectValueLabel([], CLUBS, 'All clubs')).toBe('All clubs');
  });

  it('names a single pick', () => {
    expect(selectValueLabel(['liv'], CLUBS)).toBe('Liverpool');
  });

  it('counts several picks, ignoring unknown ids', () => {
    expect(selectValueLabel(['liv', 'rma', 'gone'], CLUBS)).toBe('2 selected');
  });
});

describe('needsSearch', () => {
  it('adds a search field to long lists only', () => {
    expect(needsSearch(CLUBS)).toBe(false);
    const long = Array.from({ length: SELECT_SEARCH_FROM }, (_, i) => ({
      id: String(i),
      label: `Club ${i}`,
    }));
    expect(needsSearch(long)).toBe(true);
  });
});
