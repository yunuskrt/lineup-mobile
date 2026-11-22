import { describe, expect, it } from 'vitest';
import { routeParamsFor, sameParams, searchParamsOf } from '@/lib/route-params';

describe('searchParamsOf', () => {
  it('keeps a repeated key as repeated entries', () => {
    const params = searchParamsOf({ club: ['barca', 'milan'], mode: 'solo' });
    expect(params.getAll('club')).toEqual(['barca', 'milan']);
    expect(params.get('mode')).toBe('solo');
  });

  it('skips a key setParams cleared', () => {
    const params = searchParamsOf({ step: undefined, mode: 'duel' });
    expect(params.has('step')).toBe(false);
    expect(params.toString()).toBe('mode=duel');
  });

  it('reads no params as an empty set', () => {
    expect(searchParamsOf({}).toString()).toBe('');
  });
});

describe('routeParamsFor', () => {
  it('writes undefined for a key the next set drops', () => {
    const next = new URLSearchParams('mode=solo');
    expect(routeParamsFor(next, { mode: 'solo', step: 'filters' })).toEqual({
      mode: 'solo',
      step: undefined,
    });
  });

  it('clears every key when the next set is empty', () => {
    const current = { mode: 'solo', step: 'start', club: ['a', 'b'] };
    expect(routeParamsFor(new URLSearchParams(), current)).toEqual({
      mode: undefined,
      step: undefined,
      club: undefined,
    });
  });

  it('writes a repeated key as an array, a single one as a string', () => {
    const next = new URLSearchParams('club=barca&club=milan&step=start');
    expect(routeParamsFor(next, {})).toEqual({
      club: ['barca', 'milan'],
      step: 'start',
    });
  });

  it('round-trips through the route and back', () => {
    const start = new URLSearchParams('mode=duel&club=a&club=b&from=2004');
    const written = routeParamsFor(start, { practice: '1' });
    const read = searchParamsOf(written);
    expect(sameParams(read, start)).toBe(true);
  });
});

describe('sameParams', () => {
  it('compares in order, as a URL does', () => {
    const a = new URLSearchParams('mode=solo&step=start');
    expect(sameParams(a, new URLSearchParams('mode=solo&step=start'))).toBe(
      true,
    );
    expect(sameParams(a, new URLSearchParams('mode=duel&step=start'))).toBe(
      false,
    );
  });
});
