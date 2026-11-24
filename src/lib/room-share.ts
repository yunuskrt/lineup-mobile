import { roomLink } from '@/lib/room-code';

const WEB_SCHEME = /^https?:\/\/\S+$/i;

// The web app's address from the env, or null if unset or malformed
export function webUrlOf(raw: string | undefined): string | null {
  const url = raw?.trim().replace(/\/+$/, '') ?? '';
  return WEB_SCHEME.test(url) ? url : null;
}

// What Share sends: the code, and the web link when there is one
export function roomShareMessage(code: string, webUrl: string | null): string {
  if (!webUrl) return `Join my Lineup duel with code ${code}.`;
  return `Join my Lineup duel with code ${code}: ${roomLink(webUrl, code)}`;
}

// A code read letter by letter: "K 7 Q M 2 X"
export function spokenCode(code: string): string {
  return code.split('').join(' ');
}
