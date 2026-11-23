import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import FilterCard from '@/components/duel/lobby-panel/FilterCard';
import LockedIn from '@/components/duel/lobby-panel/LockedIn';
import { STATUS_ROW } from '@/components/duel/lobby-panel/styles';
import SummaryList from '@/components/duel/lobby-panel/SummaryList';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { DuelPlayer } from '@/types/duel';
import type { DuelLobbyView, LobbyAction } from '@/types/duel-lobby';

type Props = {
  lobby: Extract<DuelLobbyView, { step: 'filters' }>;
  opponent: DuelPlayer | null;
  onAction: (action: LobbyAction) => void;
};

const Filters = ({ lobby, opponent, onAction }: Props) => {
  const isYoursLocked = lobby.submission.yours === 'submitted';
  const isTheirsLocked = lobby.submission.theirs === 'submitted';
  const theirName = opponent?.handle ?? 'Opponent';
  const wasYoursLocked = useRef(isYoursLocked);
  const wasTheirsLocked = useRef(isTheirsLocked);

  // Each new lock is read out once, as the web's live region
  useEffect(() => {
    if (isYoursLocked && !wasYoursLocked.current) {
      AccessibilityInfo.announceForAccessibility('Your filters are locked in.');
    }
    wasYoursLocked.current = isYoursLocked;
  }, [isYoursLocked]);

  useEffect(() => {
    if (isTheirsLocked && !wasTheirsLocked.current) {
      AccessibilityInfo.announceForAccessibility(`${theirName} locked in.`);
    }
    wasTheirsLocked.current = isTheirsLocked;
  }, [isTheirsLocked, theirName]);

  return (
    <View className="gap-3">
      <FilterCard
        actor="you"
        title="Your filters"
        footer={
          isYoursLocked ? (
            <LockedIn actor="you" />
          ) : (
            <Button
              label={lobby.isLocking ? 'Locking in…' : 'Lock in filters'}
              isBusy={lobby.isLocking}
              onPress={() => onAction('lock')}
            />
          )
        }
      >
        <SummaryList summary={lobby.yours} />
      </FilterCard>
      <FilterCard
        actor="opponent"
        title={`${theirName}'s filters`}
        footer={
          isTheirsLocked ? (
            <LockedIn actor="opponent" />
          ) : (
            <View className={STATUS_ROW}>
              <Text className="font-body-medium text-14 text-fg-muted">
                Choosing…
              </Text>
            </View>
          )
        }
      >
        <Text className="text-14 text-fg-muted">
          Hidden until the coin flip.
        </Text>
      </FilterCard>
    </View>
  );
};

export default Filters;
