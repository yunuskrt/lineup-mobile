type Identified = { id: string };

const NONE: ReadonlySet<string> = new Set();

// Players that arrived since the last render; a snapshot animates none
export function newRevealIds(
  before: readonly Identified[],
  after: readonly Identified[],
  isSnapshot: boolean,
): ReadonlySet<string> {
  if (isSnapshot) return NONE;
  const known = new Set(before.map((player) => player.id));
  return new Set(
    after.filter((player) => !known.has(player.id)).map((player) => player.id),
  );
}
