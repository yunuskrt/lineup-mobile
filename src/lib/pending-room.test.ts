import { describe, expect, it } from 'vitest';
import {
  holdRoomCode,
  isGameOpen,
  markGameOpen,
  takeHeldRoomCode,
} from '@/lib/pending-room';

describe('game open', () => {
  it('is open while any game screen is mounted', () => {
    expect(isGameOpen()).toBe(false);
    const closeSolo = markGameOpen();
    const closeDuel = markGameOpen();
    closeSolo();
    expect(isGameOpen()).toBe(true);
    closeDuel();
    expect(isGameOpen()).toBe(false);
  });

  it('counts a repeated close once', () => {
    const closeA = markGameOpen();
    const closeB = markGameOpen();
    closeA();
    closeA();
    expect(isGameOpen()).toBe(true);
    closeB();
    expect(isGameOpen()).toBe(false);
  });
});

describe('held room code', () => {
  it('is taken once', () => {
    holdRoomCode('K7QM2X');
    expect(takeHeldRoomCode()).toBe('K7QM2X');
    expect(takeHeldRoomCode()).toBeNull();
  });

  it('keeps the latest link', () => {
    holdRoomCode('K7QM2X');
    holdRoomCode('AB3CDE');
    expect(takeHeldRoomCode()).toBe('AB3CDE');
  });
});
