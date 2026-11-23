export type SocketLogEntry = {
  id: number;
  label: string;
  summary: string;
};

export type SocketStatus =
  | { kind: 'idle' }
  | { kind: 'connecting' }
  | { kind: 'connected' }
  | { kind: 'dropped' }
  | { kind: 'restored' }
  | { kind: 'closed'; code: string; message: string };
