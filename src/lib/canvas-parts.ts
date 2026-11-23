import type { CanvasView } from '@/types/canvas';
import type { GateSize, LaterPart } from '@/types/canvas-gate';
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

// The gate's body, while its phase is still ahead: the room's steps
export function laterGatePart(view: CanvasView): LaterPart | null {
  const step = view.mode === 'duel' ? view.lobby?.step : undefined;
  if (step === 'roomWaiting' || step === 'roomExpired') {
    return { phase: 'M17b', name: 'room' };
  }
  return null;
}

// What replaces the rail once a duel is over; the summary is drawn
export function laterRailPart(view: CanvasView): LaterPart | null {
  if (view.mode === 'solo' || view.end === null) return null;
  return { phase: 'M18', name: 'duel result' };
}

export function laterPartLine({ phase, name }: LaterPart): string {
  return `Built in ${phase}: the ${name}.`;
}
