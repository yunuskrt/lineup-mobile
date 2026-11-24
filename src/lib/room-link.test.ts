import { describe, expect, it } from 'vitest';
import { joinRowPath, redirectRoomLink, roomLinkCode } from '@/lib/room-link';

describe('roomLinkCode', () => {
  it('reads the code from a lineup:// room link', () => {
    expect(roomLinkCode('lineup://play/duel?room=K7QM2X')).toBe('K7QM2X');
  });

  it('cleans the code as the join box does', () => {
    expect(roomLinkCode('lineup://play/duel?room=k7qm2x')).toBe('K7QM2X');
    expect(roomLinkCode('lineup://play/duel?room=k7-qm 2x99')).toBe('K7QM2X');
  });

  it('reads the same path from a web link, for universal links', () => {
    expect(
      roomLinkCode('https://app.lineup.gg/play/duel?room=K7QM2X#top'),
    ).toBe('K7QM2X');
    expect(roomLinkCode('/play/duel?room=K7QM2X')).toBe('K7QM2X');
    expect(roomLinkCode('lineup:///play/duel/?room=K7QM2X')).toBe('K7QM2X');
  });

  it('is empty for a room link with nothing to join', () => {
    expect(roomLinkCode('lineup://play/duel')).toBe('');
    expect(roomLinkCode('lineup://play/duel?room=')).toBe('');
    expect(roomLinkCode('lineup://play/duel?room=create')).toBe('');
    expect(roomLinkCode('lineup://play/duel?room=!!!')).toBe('');
  });

  it('is null for every other link', () => {
    expect(roomLinkCode('lineup://play?room=K7QM2X')).toBeNull();
    expect(roomLinkCode('lineup://play/solo')).toBeNull();
    expect(roomLinkCode('lineup://archive')).toBeNull();
    expect(roomLinkCode('https://app.lineup.gg/')).toBeNull();
  });
});

describe('joinRowPath', () => {
  it('opens step 1 with Duel picked and the code in the box', () => {
    expect(joinRowPath('K7QM2X')).toBe('/play?mode=duel&room=K7QM2X');
  });

  it('leaves the box empty without a code', () => {
    expect(joinRowPath('')).toBe('/play?mode=duel');
  });
});

describe('redirectRoomLink', () => {
  const LINK = 'lineup://play/duel?room=K7QM2X';

  it('rewrites a room link to the join row outside a game', () => {
    expect(redirectRoomLink(LINK, false)).toEqual({
      path: '/play?mode=duel&room=K7QM2X',
      heldCode: null,
    });
  });

  it('stays on the board during a game and holds the code', () => {
    expect(redirectRoomLink(LINK, true)).toEqual({
      path: null,
      heldCode: 'K7QM2X',
    });
  });

  it('holds nothing for an empty room link during a game', () => {
    expect(redirectRoomLink('lineup://play/duel', true)).toEqual({
      path: null,
      heldCode: null,
    });
  });

  it('passes every other link through untouched', () => {
    expect(redirectRoomLink('lineup://archive', true)).toEqual({
      path: 'lineup://archive',
      heldCode: null,
    });
  });
});
