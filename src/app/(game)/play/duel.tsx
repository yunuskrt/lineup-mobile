import React from 'react';
import GamePlaceholder from '@/components/shell/GamePlaceholder';

type Props = {};

// One route for the whole duel: lobby, game and result (M17, M18)
const DuelScreen = ({}: Props) => {
  return <GamePlaceholder title="Duel" builtIn="M17 and M18: the duel" />;
};

export default DuelScreen;
