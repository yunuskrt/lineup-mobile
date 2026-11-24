import React, { type ReactNode } from 'react';
import { useWindowDimensions, View } from 'react-native';
import type { Href } from 'expo-router';
import CreateRoom from '@/components/play/CreateRoom';
import CreateRoomButton from '@/components/play/CreateRoomButton';
import CreateRoomNotes from '@/components/play/CreateRoomNotes';
import PlayStart from '@/components/play/PlayStart';
import { Button } from '@/components/ui/button';
import { useCreateRoom } from '@/hooks/use-create-room';
import { isShortScreen } from '@/lib/welcome';
import type { PlayMode } from '@/types/play';
import type { QuitDialogCopy } from '@/types/quit-dialog';

type Props = {
  mode: PlayMode;
  filterParams: URLSearchParams | null;
  href: Href | null;
  isCapped: boolean;
  label?: string;
  warningFor: () => QuitDialogCopy | null;
  // The solo runs-left or cap line
  allowance: ReactNode;
  onBack: () => void;
};

// Step 3's footer: Back and Start, the cap line, and a duel's Create room
const StartActions = ({
  mode,
  filterParams,
  href,
  isCapped,
  label,
  warningFor,
  allowance,
  onBack,
}: Props) => {
  const room = useCreateRoom(filterParams);
  const { height } = useWindowDimensions();
  const isDuel = mode === 'duel';
  // iPhone SE: Start and Create room share a row; Back is the chevron
  const isRoomInRow = isDuel && isShortScreen(height);

  return (
    <View className="gap-3">
      <PlayStart
        mode={mode}
        href={href}
        isCapped={isCapped}
        label={label}
        warningFor={warningFor}
        size={isRoomInRow ? 'default' : 'large'}
        leading={
          isRoomInRow ? undefined : (
            <Button
              label="Back"
              variant="secondary"
              size="large"
              onPress={onBack}
            />
          )
        }
        trailing={
          isRoomInRow ? (
            <View className="flex-1">
              <CreateRoomButton room={room} size="default" />
            </View>
          ) : undefined
        }
      >
        {allowance}
        {isRoomInRow ? <CreateRoomNotes room={room} /> : null}
      </PlayStart>
      {isDuel && !isRoomInRow ? <CreateRoom room={room} /> : null}
    </View>
  );
};

export default StartActions;
