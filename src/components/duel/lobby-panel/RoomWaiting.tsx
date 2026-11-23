import React from 'react';
import { Share, View } from 'react-native';
import { Check, Copy, Share2 } from 'lucide-react-native';
import ClosesIn from '@/components/duel/lobby-panel/room-waiting/ClosesIn';
import CodeBoxes from '@/components/duel/lobby-panel/room-waiting/CodeBoxes';
import { useCopy } from '@/components/duel/lobby-panel/room-waiting/use-copy';
import SummaryList from '@/components/duel/lobby-panel/SummaryList';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { roomShareMessage } from '@/lib/room-share';
import { SECTION_LABEL } from '@/styles/classes';
import type { DuelLobbyView, LobbyAction } from '@/types/duel-lobby';

type Props = {
  lobby: Extract<DuelLobbyView, { step: 'roomWaiting' }>;
  onAction: (action: LobbyAction) => void;
};

// The code leads; no clock, as nothing is lost while you wait
const RoomWaiting = ({ lobby, onAction }: Props) => {
  const { isCopied, isRefused, copy } = useCopy();
  const { code } = lobby;

  async function share() {
    try {
      await Share.share({ message: roomShareMessage(code) });
    } catch {
      // A closed or failed sheet changes nothing: the code stays shown
    }
  }

  return (
    <View className="gap-4">
      <View className="items-center gap-3 rounded-lg border-2 border-dashed border-line bg-surface-card p-4">
        <Text
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          className={SECTION_LABEL}
        >
          Room code
        </Text>
        <CodeBoxes code={code} />
        <View className="w-full flex-row gap-3">
          <View className="flex-1">
            <Button
              label={isCopied ? 'Copied' : 'Copy code'}
              icon={isCopied ? Check : Copy}
              variant="secondary"
              onPress={() => void copy(code)}
            />
          </View>
          <View className="flex-1">
            <Button
              label="Share"
              icon={Share2}
              variant="secondary"
              onPress={() => void share()}
            />
          </View>
        </View>
      </View>
      {isRefused ? (
        <Text
          accessibilityRole="alert"
          className="text-center text-14 text-fg-muted"
        >
          Copying isn&apos;t allowed here. Read the code out instead.
        </Text>
      ) : null}
      <SummaryList summary={lobby.filters} />
      <View className="flex-row items-center justify-between gap-4">
        <ClosesIn expiresAt={lobby.expiresAt} />
        <Button
          label="Cancel"
          variant="secondary"
          onPress={() => onAction('cancel')}
        />
      </View>
    </View>
  );
};

export default RoomWaiting;
