import React from 'react';
import CoinFlip from '@/components/duel/lobby-panel/CoinFlip';
import Filters from '@/components/duel/lobby-panel/Filters';
import NoOpponent from '@/components/duel/lobby-panel/NoOpponent';
import Paired from '@/components/duel/lobby-panel/Paired';
import Searching from '@/components/duel/lobby-panel/Searching';
import type { DuelPlayer } from '@/types/duel';
import type { DuelLobbyView, LobbyAction } from '@/types/duel-lobby';

type Props = {
  lobby: DuelLobbyView;
  you: DuelPlayer;
  opponent: DuelPlayer | null;
  onAction: (action: LobbyAction) => void;
};

// The gate's body while the duel is being arranged
const LobbyPanel = ({ lobby, you, opponent, onAction }: Props) => {
  switch (lobby.step) {
    case 'searching':
    case 'joining':
      return <Searching onAction={onAction} />;
    case 'paired':
      return <Paired you={you} opponent={lobby.opponent} />;
    case 'filters':
      return <Filters lobby={lobby} opponent={opponent} onAction={onAction} />;
    case 'coinFlip':
      return <CoinFlip lobby={lobby} />;
    case 'noOpponent':
      return <NoOpponent onAction={onAction} />;
    // The canvas names these as M17b's for now
    case 'roomWaiting':
    case 'roomExpired':
      return null;
  }
};

export default LobbyPanel;
