export type RoomLinkRedirect = {
  // Where to go; null stays on the screen in view
  path: string | null;
  // A code to keep for the next visit to Play
  heldCode: string | null;
};
