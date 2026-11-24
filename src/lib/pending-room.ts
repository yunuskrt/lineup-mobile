// Game screens open now; a link arriving meanwhile holds its code
let openGames = 0;
let heldCode: string | null = null;

// Returns the matching close, safe to call more than once
export function markGameOpen(): () => void {
  openGames += 1;
  let isClosed = false;
  return () => {
    if (isClosed) return;
    isClosed = true;
    openGames -= 1;
  };
}

export function isGameOpen(): boolean {
  return openGames > 0;
}

// The latest link wins
export function holdRoomCode(code: string): void {
  heldCode = code;
}

// Read once: Play takes it and it's gone
export function takeHeldRoomCode(): string | null {
  const code = heldCode;
  heldCode = null;
  return code;
}
