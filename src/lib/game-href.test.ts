import { describe, expect, it } from 'vitest';
import { withQuery } from '@/lib/filters';
import { gameHref, playHref } from '@/lib/game-href';
import { playPath } from '@/lib/play-steps';

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

describe('playHref', () => {
  it('opens a step of /play with the choices', () => {
    const params = new URLSearchParams('mode=solo&competition=c1');
    expect(playHref(params, 'start')).toBe(
      '/play?mode=solo&competition=c1&step=start',
    );
  });

  it('opens step 1 with no step param', () => {
    expect(playHref(new URLSearchParams('step=start'), 'mode')).toBe('/play');
  });

  it('matches the web playPath', () => {
    const params = new URLSearchParams('mode=solo&club=a&club=b');
    expect(playHref(params, 'filters')).toBe(playPath(params, 'filters'));
  });
});
