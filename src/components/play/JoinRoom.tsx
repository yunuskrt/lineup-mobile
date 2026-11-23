import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import StartError from '@/components/play/StartError';
import { STEP_SECTION } from '@/components/play/styles';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useStartNavigation } from '@/hooks/use-start-navigation';
import { ROOM_CODE_LENGTH } from '@/lib/api/schemas/duel';
import { gameHref } from '@/lib/game-href';
import {
  hasLookAlike,
  isRoomCode,
  ROOM_CODE_HINT,
  roomCodeInput,
  withRoom,
} from '@/lib/room-code';
import { TYPE_ROOM_CODE } from '@/styles/classes';
import { SHADOW_HARD_SM } from '@/styles/shadow';

const CODE_SLOTS = Array.from(
  { length: ROOM_CODE_LENGTH },
  (_, index) => index,
);

type Props = {
  // The params' filters, if any; the creator's apply
  filterParams: URLSearchParams | null;
  initialCode: string;
};

// Six boxes drawn over one hidden field, which takes typing and paste
const JoinRoom = ({ filterParams, initialCode }: Props) => {
  const { go, isBusy, error } = useStartNavigation();
  const [code, setCode] = useState(() => roomCodeInput(initialCode));
  const [isFocused, setIsFocused] = useState(false);
  const isValid = isRoomCode(code);
  const showsHint = hasLookAlike(code);
  const activeSlot = Math.min(code.length, ROOM_CODE_LENGTH - 1);

  function join() {
    if (!isValid || isBusy) return;
    const params = withRoom(filterParams ?? new URLSearchParams(), code);
    void go(gameHref('duel', params));
  }

  return (
    <View className={STEP_SECTION}>
      <Text accessibilityRole="header" className="font-body-semibold text-16">
        Have a room code?
      </Text>
      <View className="flex-row flex-wrap items-center gap-3">
        <View className="flex-row gap-1.5">
          {CODE_SLOTS.map((index) => (
            <View
              key={index}
              // The field reads the code; the boxes only draw it
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              className="h-12 w-10 items-center justify-center rounded-md border-2 border-line bg-surface-card"
              // boxShadow: the box the next letter lands in, while typing
              style={
                isFocused && index === activeSlot ? SHADOW_HARD_SM : undefined
              }
            >
              <Text maxFontSizeMultiplier={1.2} className={TYPE_ROOM_CODE}>
                {code[index] ?? ''}
              </Text>
            </View>
          ))}
          <TextInput
            value={code}
            onChangeText={(next) => setCode(roomCodeInput(next))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={join}
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="off"
            spellCheck={false}
            returnKeyType="go"
            caretHidden
            accessibilityLabel="Room code"
            accessibilityHint={showsHint ? ROOM_CODE_HINT : undefined}
            // Not opacity-0: iOS ignores taps on a view below 0.01 alpha
            className="absolute inset-0 opacity-[0.02]"
          />
        </View>
        <Button
          label={isBusy ? 'Joining…' : 'Join'}
          variant="secondary"
          isDisabled={!isValid || isBusy}
          onPress={join}
        />
      </View>
      {showsHint ? (
        <Text className="text-14 text-fg-muted">{ROOM_CODE_HINT}</Text>
      ) : null}
      <StartError error={error} isBusy={isBusy} />
      <Text className="text-14 text-fg-muted">
        To host, choose your filters and create a room at the last step.
      </Text>
    </View>
  );
};

export default JoinRoom;
