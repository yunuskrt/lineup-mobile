import React from 'react';
import { Pressable, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { pressHaptic } from '@/lib/haptics';
import {
  isStepFilled,
  isStepReachable,
  PLAY_STEP_NAMES,
  PLAY_STEPS,
  type PlayStep,
  type StepProgress,
} from '@/lib/play-steps';
import { stepLabel } from '@/lib/step-label';
import { cn } from '@/lib/utils';
import { TABULAR_NUMS } from '@/styles/classes';
import { ROLES } from '@/styles/tokens';

type Props = {
  current: PlayStep;
  progress: StepProgress;
  // What each filled step holds
  choices: Partial<Record<PlayStep, string>>;
  onGo: (step: PlayStep) => void;
};

const DISC =
  'h-7 w-7 items-center justify-center rounded-full border-2 border-line';

const PlaySteps = ({ current, progress, choices, onGo }: Props) => {
  return (
    <View accessibilityLabel="Play steps" className="flex-row items-center">
      {PLAY_STEPS.map((step, index) => {
        const isCurrent = step === current;
        const isFilled = isStepFilled(step, progress);
        const isDone = !isCurrent && isFilled;
        const isReachable = isStepReachable(step, progress);
        const choice = isFilled ? choices[step] : undefined;
        return (
          <View
            key={step}
            className={cn(
              'min-w-0 flex-row items-center',
              index < PLAY_STEPS.length - 1 && 'flex-1',
            )}
          >
            <Pressable
              onPress={() => onGo(step)}
              onPressIn={pressHaptic}
              disabled={!isReachable || isCurrent}
              accessibilityRole="button"
              accessibilityLabel={stepLabel({
                index,
                name: PLAY_STEP_NAMES[step],
                choice,
                isCurrent,
                isDone,
              })}
              accessibilityState={{
                selected: isCurrent,
                disabled: !isReachable,
              }}
              className="min-h-11 flex-shrink flex-row items-center gap-1.5"
            >
              <View
                className={cn(DISC, isCurrent ? 'bg-brand' : 'bg-surface-card')}
              >
                {isDone ? (
                  <Check size={16} strokeWidth={3} color={ROLES.fg} />
                ) : (
                  <Text
                    maxFontSizeMultiplier={1.3}
                    className="font-display text-14"
                    // NativeWind can't reach tnum; see TABULAR_NUMS
                    style={TABULAR_NUMS}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>
              <View className="flex-shrink">
                <Text
                  numberOfLines={1}
                  className={cn(
                    'font-body-semibold text-14',
                    !isReachable && 'text-fg-muted',
                  )}
                >
                  {PLAY_STEP_NAMES[step]}
                </Text>
                {choice ? (
                  <Text numberOfLines={1} className="text-12 text-fg-muted">
                    {choice}
                  </Text>
                ) : null}
              </View>
            </Pressable>
            {index < PLAY_STEPS.length - 1 ? (
              <View className="mx-1.5 h-0.5 min-w-3 flex-1 bg-line" />
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

export default PlaySteps;
