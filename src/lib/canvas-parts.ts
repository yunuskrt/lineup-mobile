import type { CanvasView } from '@/types/canvas';
import type { GateSize } from '@/types/canvas-gate';
import type { DuelLobbyStep } from '@/types/duel-lobby';

// The web's LOBBY_GATE_SIZE: steps with a card or a form go wide
const LOBBY_GATE_SIZE: Record<DuelLobbyStep, GateSize> = {
  searching: 'narrow',
  roomWaiting: 'wide',
  roomExpired: 'narrow',
  joining: 'narrow',
  paired: 'wide',
  filters: 'wide',
  coinFlip: 'wide',
  noOpponent: 'narrow',
};

export function gateSize(view: CanvasView): GateSize {
  if (view.mode === 'duel' && view.lobby) {
    return LOBBY_GATE_SIZE[view.lobby.step];
  }
  return view.gate?.sidePick ? 'wide' : 'narrow';
}
