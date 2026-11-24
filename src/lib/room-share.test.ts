import { describe, expect, it } from 'vitest';
import { roomShareMessage, spokenCode, webUrlOf } from '@/lib/room-share';

describe('roomShareMessage', () => {
  it('carries the code and the web link when there is one', () => {
    expect(roomShareMessage('K7QM2X', 'https://app.lineup.gg')).toBe(
      'Join my Lineup duel with code K7QM2X: https://app.lineup.gg/play/duel?room=K7QM2X',
    );
  });

  it('carries the code only without a web URL', () => {
    expect(roomShareMessage('K7QM2X', null)).toBe(
      'Join my Lineup duel with code K7QM2X.',
    );
  });
});

describe('webUrlOf', () => {
  it('keeps an http or https address, without a trailing slash', () => {
    expect(webUrlOf('https://app.lineup.gg/')).toBe('https://app.lineup.gg');
    expect(webUrlOf(' http://192.168.0.10:3000 ')).toBe(
      'http://192.168.0.10:3000',
    );
  });

  it('is null when unset, empty or not a web address', () => {
    expect(webUrlOf(undefined)).toBeNull();
    expect(webUrlOf('')).toBeNull();
    expect(webUrlOf('app.lineup.gg')).toBeNull();
    expect(webUrlOf('lineup://play')).toBeNull();
  });
});

describe('spokenCode', () => {
  it('spaces the letters so a screen reader spells them', () => {
    expect(spokenCode('K7QM2X')).toBe('K 7 Q M 2 X');
  });
});
