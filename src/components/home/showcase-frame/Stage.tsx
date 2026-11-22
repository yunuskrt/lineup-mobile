import React, { useEffect } from 'react';
import { useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import FeedbackToast from '@/components/game/FeedbackToast';
import FoundCount from '@/components/game/FoundCount';
import GuessInput from '@/components/game/GuessInput';
import MatchHeader from '@/components/game/MatchHeader';
import SquadGrid from '@/components/pitch/SquadGrid';
import { Badge } from '@/components/ui/badge';
import { ShadowBox } from '@/components/ui/shadow-box';
import { LOADING_FORMATION } from '@/lib/formation';
import type { Suggestion } from '@/lib/suggestions';
import { isShortScreen } from '@/lib/welcome';
import { MOTION_DURATION_MS } from '@/styles/motion';
import type { ToastMessage } from '@/types/feedback';
import type { GuessInputStatus } from '@/types/guess-input';
import type { MatchInPlay } from '@/types/match';
import type { FoundPlayer } from '@/types/player';

const IGNORE = () => {};

const FADE = {
  duration: MOTION_DURATION_MS.demoFade,
  easing: Easing.out(Easing.ease),
};

type Props = {
  match: MatchInPlay | null;
  found: FoundPlayer[];
  value: string;
  status: GuessInputStatus;
  shakeKey: number;
  suggestions: readonly Suggestion[];
  drivenHighlight?: string | null;
  toast: ToastMessage | null;
  isFading: boolean;
};

// Shared by the still frame and the demo; silent and untouchable
const Stage = ({
  match,
  found,
  value,
  status,
  shakeKey,
  suggestions,
  drivenHighlight = null,
  toast,
  isFading,
}: Props) => {
  // A short phone keeps the pitch alone
  const isPitchOnly = isShortScreen(useWindowDimensions().height);
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.set(withTiming(isFading ? 0 : 1, FADE));
  }, [isFading, opacity]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <ShadowBox
        radiusClassName="rounded-lg"
        className="gap-2 border-2 border-line bg-surface-raised p-2"
      >
        <Animated.View
          className="gap-2"
          // A Reanimated style: the loop's fade before it starts again
          style={fadeStyle}
        >
          <View className="overflow-hidden rounded-md">
            <MatchHeader match={match} isCompact />
          </View>
          <View className="h-80 bg-turf">
            {match ? <FoundCount found={found} /> : null}
            <SquadGrid
              formation={match?.formation ?? LOADING_FORMATION}
              revealed={found}
              isLoading={!match}
            />
          </View>
        </Animated.View>
        {/* No clock: the input alone, with room for one suggestion row */}
        {isPitchOnly ? null : (
          <View className="min-h-[120px] justify-end border-t-2 border-line px-2 pb-2 pt-2">
            {/* The toast and the row never show together */}
            <View className="absolute inset-x-0 top-2">
              <FeedbackToast toast={toast} />
            </View>
            <GuessInput
              status={status}
              value={value}
              onValueChange={IGNORE}
              onSubmit={IGNORE}
              shakeKey={shakeKey}
              suggestions={suggestions}
              drivenHighlight={drivenHighlight}
              hasLabel={false}
            />
          </View>
        )}
      </ShadowBox>
      <View className="absolute -top-3 right-4">
        <Badge variant="sticker" tone="butter" tilt="right" label="Demo" />
      </View>
    </View>
  );
};

export default Stage;
