// What Share sends: the code only, until M22 decides room links
export function roomShareMessage(code: string): string {
  return `Join my Lineup duel with code ${code}.`;
}

// A code read letter by letter: "K 7 Q M 2 X"
export function spokenCode(code: string): string {
  return code.split('').join(' ');
}
