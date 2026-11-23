import { useProAccess } from '@/hooks/use-pro';
import { useStartNavigation } from '@/hooks/use-start-navigation';
import { gameHref } from '@/lib/game-href';
import { CREATE_ROOM, withRoom } from '@/lib/room-code';
import type { CreateRoomState } from '@/types/create-room';

// Hosting is Pro (R10); joining is for anyone
export function useCreateRoom(
  filterParams: URLSearchParams | null,
): CreateRoomState {
  const { go, isBusy, error } = useStartNavigation();
  const hostAccess = useProAccess();

  return {
    hostAccess,
    canCreate: filterParams !== null,
    isBusy,
    error,
    create: () => {
      if (!filterParams) return;
      void go(gameHref('duel', withRoom(filterParams, CREATE_ROOM)));
    },
  };
}
