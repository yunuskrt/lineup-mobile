import { describe, expect, it } from 'vitest';
import { roomShareMessage, spokenCode } from '@/lib/room-share';

describe('roomShareMessage', () => {
  it('carries the code, and no link before M22', () => {
    expect(roomShareMessage('K7QM2X')).toBe(
      'Join my Lineup duel with code K7QM2X.',
    );
  });
});

describe('spokenCode', () => {
  it('spaces the letters so a screen reader spells them', () => {
    expect(spokenCode('K7QM2X')).toBe('K 7 Q M 2 X');
  });
});
