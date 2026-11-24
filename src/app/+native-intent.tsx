import { holdRoomCode, isGameOpen } from '@/lib/pending-room';
import { redirectRoomLink } from '@/lib/room-link';

type SystemPath = { path: string; initial: boolean };

// Links the system hands the app; room links open the join row
export function redirectSystemPath({ path }: SystemPath): string | null {
  try {
    const redirect = redirectRoomLink(path, isGameOpen());
    if (redirect.heldCode) holdRoomCode(redirect.heldCode);
    return redirect.path;
  } catch {
    // Never crash on a link: let the router try it as it came
    return path;
  }
}
