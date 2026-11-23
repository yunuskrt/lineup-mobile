import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import ProLockButton from '@/components/pro/ProLockButton';
import ProLockCaption from '@/components/pro/ProLockCaption';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  type ResultPrimary,
  type ResultSecondary,
  resultActionsLayout,
} from '@/lib/result-actions';
import { isShortScreen } from '@/lib/welcome';
import type { ProAccess } from '@/types/pro';

export type ResultActionsProps = {
  onPlayAgain: () => void;
  onChangeFilters: () => void;
  // Back to play; Change filters when unset
  onBackToPlay?: () => void;
  // A room game: New room and Back to play
  isPrivate?: boolean;
  // Hosting is Pro (R10); open when unset
  hostAccess?: ProAccess;
  // Solo at its daily cap: Play a duel instead
  capLine?: string;
  onPlayDuel?: () => void;
  // One match from the archive: Play it again
  isPicked?: boolean;
  // Practise again, then play or the archive
  isPractice?: boolean;
};

type Props = ResultActionsProps;

const PRIMARY_LABELS: Record<ResultPrimary, string> = {
  playAgain: 'Play again',
  newRoom: 'New room',
  backToPlay: 'Back to play',
  playDuel: 'Play a duel',
  playItAgain: 'Play it again',
  practiseAgain: 'Practise again',
};

const SECONDARY_LABELS: Record<
  Exclude<ResultSecondary, 'lockedNewRoom'>,
  string
> = {
  changeFilters: 'Change filters',
  backToPlay: 'Back to play',
  backToArchive: 'Back to the archive',
};

const NEW_ROOM_CAPTION = 'Pro hosts rooms.';

// Primary first, side by side as the sketch's pinned row, or stacked
const ResultActions = ({
  onPlayAgain,
  onChangeFilters,
  onBackToPlay = onChangeFilters,
  isPrivate = false,
  hostAccess = 'open',
  capLine,
  onPlayDuel = () => {},
  isPicked = false,
  isPractice = false,
}: Props) => {
  const size = isShortScreen(useWindowDimensions().height)
    ? 'default'
    : 'large';
  const { primary, secondary } = resultActionsLayout({
    isPrivate,
    hostAccess,
    isSoloCapped: capLine !== undefined,
    isPicked,
    isPractice,
  });
  const onPrimary =
    primary === 'backToPlay'
      ? onBackToPlay
      : primary === 'playDuel'
        ? onPlayDuel
        : onPlayAgain;
  const isLocked = secondary === 'lockedNewRoom';
  // "Back to the archive" wraps beside another button at 390pt
  const isStacked = secondary === 'backToArchive';

  return (
    <View className="gap-3">
      {capLine ? (
        <Text className="text-center text-14 text-fg-muted">{capLine}</Text>
      ) : null}
      <View className={isStacked ? 'gap-3' : 'flex-row gap-3'}>
        <View className={isStacked ? undefined : 'flex-1'}>
          <Button
            label={PRIMARY_LABELS[primary]}
            size={size}
            onPress={onPrimary}
          />
        </View>
        <View className={isStacked ? undefined : 'flex-1'}>
          {isLocked ? (
            <ProLockButton
              label="New room"
              size={size}
              caption={hostAccess === 'pending' ? undefined : NEW_ROOM_CAPTION}
              isFullWidth
            />
          ) : (
            <Button
              label={SECONDARY_LABELS[secondary]}
              variant="secondary"
              size={size}
              onPress={
                secondary === 'backToPlay' ? onBackToPlay : onChangeFilters
              }
            />
          )}
        </View>
      </View>
      {/* The lock's caption and See Pro run under the row */}
      {isLocked && hostAccess !== 'pending' ? (
        <ProLockCaption caption={NEW_ROOM_CAPTION} />
      ) : null}
    </View>
  );
};

export default ResultActions;
