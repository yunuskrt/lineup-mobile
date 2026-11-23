import { describe, expect, it } from 'vitest';
import { gameHref } from '@/lib/game-href';
import { withQuery } from '@/lib/filters';

describe('gameHref', () => {
  it('opens the mode route with the setup params', () => {
    const params = new URLSearchParams('competition=c1&practice=1');
    expect(gameHref('solo', params)).toBe(
      '/play/solo?competition=c1&practice=1',
    );
  });

  it('keeps repeated clubs as repeated keys', () => {
    const params = new URLSearchParams('club=a&club=b&room=create');
    expect(gameHref('duel', params)).toBe(
      '/play/duel?club=a&club=b&room=create',
    );
  });

  it('opens the bare route with no params', () => {
    expect(gameHref('duel', new URLSearchParams())).toBe('/play/duel');
  });

  it('matches the web withQuery', () => {
    const params = new URLSearchParams('competition=c1&club=a&club=b');
    expect(gameHref('solo', params)).toBe(withQuery('/play/solo', params));
  });
});
