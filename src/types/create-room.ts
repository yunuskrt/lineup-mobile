import type { ProAccess } from '@/types/pro';

// Shared by Create room's button and its notes, which can sit apart
export type CreateRoomState = {
  hostAccess: ProAccess;
  // False while the filters load
  canCreate: boolean;
  isBusy: boolean;
  error: unknown;
  create: () => void;
};
