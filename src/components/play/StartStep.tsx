import React, { type ReactNode } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { type Href, router } from 'expo-router';
import CreateRoom from '@/components/play/CreateRoom';
import CreateRoomButton from '@/components/play/CreateRoomButton';
import CreateRoomNotes from '@/components/play/CreateRoomNotes';
import PlayStart from '@/components/play/PlayStart';
import PlaySummary from '@/components/play/PlaySummary';
import StepHeading from '@/components/play/StepHeading';
import { STEP_SECTION } from '@/components/play/styles';
import { Button } from '@/components/ui/button';
import { useCreateRoom } from '@/hooks/use-create-room';
import { ARCHIVE_PATH } from '@/lib/archive';
import type { PlayStep } from '@/lib/play-steps';
import { isShortScreen } from '@/lib/welcome';
import type { FilterOptions } from '@/types/catalog';
import type { Filters } from '@/types/filters';
import type { ModeOption, PlayMode } from '@/types/play';
import type { QuitDialogCopy } from '@/types/quit-dialog';

type Props = {
  option: ModeOption;
  mode: PlayMode;
  filters: Filters | null;
  options: FilterOptions | null;
  filterParams: URLSearchParams | null;
  href: Href | null;
  isCapped: boolean;
  label?: string;
  warningFor: () => QuitDialogCopy | null;
  // The solo runs-left or cap line
  allowance: ReactNode;
  onGo: (step: PlayStep) => void;
  isHeadingFocused: boolean;
};

const StartStep = ({
  option,
  mode,
  filters,
  options,
  filterParams,
  href,
  isCapped,
  label,
  warningFor,
  allowance,
  onGo,
  isHeadingFocused,
}: Props) => {
  const room = useCreateRoom(filterParams);
  const { height } = useWindowDimensions();
  const isDuel = mode === 'duel';
  // iPhone SE: Start and Create room share a row; Back is the chevron
  const isRoomInRow = isDuel && isShortScreen(height);

  return (
    <>
      <View className={STEP_SECTION}>
        <StepHeading
          title="Ready to play"
          isFocusedOnMount={isHeadingFocused}
        />
        <PlaySummary
          option={option}
          filters={filters}
          options={options}
          onEdit={onGo}
        />
      </View>
      <View className={STEP_SECTION}>
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
                onPress={() => onGo('filters')}
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
          {mode === 'solo' && !isCapped ? (
            <View className="items-start">
              <Button
                label="Or pick the exact match from the archive"
                variant="secondary"
                onPress={() => router.push(ARCHIVE_PATH)}
              />
            </View>
          ) : null}
          {isRoomInRow ? <CreateRoomNotes room={room} /> : null}
        </PlayStart>
      </View>
      {isDuel && !isRoomInRow ? <CreateRoom room={room} /> : null}
    </>
  );
};

export default StartStep;
