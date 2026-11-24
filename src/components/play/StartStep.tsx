import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import PlaySummary from '@/components/play/PlaySummary';
import StepHeading from '@/components/play/StepHeading';
import { STEP_SECTION } from '@/components/play/styles';
import { Button } from '@/components/ui/button';
import { ARCHIVE_PATH } from '@/lib/archive';
import type { PlayStep } from '@/lib/play-steps';
import type { FilterOptions } from '@/types/catalog';
import type { Filters } from '@/types/filters';
import type { ModeOption, PlayMode } from '@/types/play';

type Props = {
  option: ModeOption;
  mode: PlayMode;
  filters: Filters | null;
  options: FilterOptions | null;
  isCapped: boolean;
  onGo: (step: PlayStep) => void;
  isHeadingFocused: boolean;
};

// The summary; Start and Create room sit in the screen's footer
const StartStep = ({
  option,
  mode,
  filters,
  options,
  isCapped,
  onGo,
  isHeadingFocused,
}: Props) => {
  return (
    <View className={STEP_SECTION}>
      <StepHeading title="Ready to play" isFocusedOnMount={isHeadingFocused} />
      <PlaySummary
        option={option}
        filters={filters}
        options={options}
        onEdit={onGo}
      />
      {mode === 'solo' && !isCapped ? (
        <View className="items-start">
          <Button
            label="Or pick the exact match from the archive"
            variant="secondary"
            onPress={() => router.push(ARCHIVE_PATH)}
          />
        </View>
      ) : null}
    </View>
  );
};

export default StartStep;
