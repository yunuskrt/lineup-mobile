import React, { type ReactNode, useEffect, useRef } from 'react';
import { AccessibilityInfo, View, type ViewInstance } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  ReduceMotion,
} from 'react-native-reanimated';
import { ShadowBox } from '@/components/ui/shadow-box';
import { Text } from '@/components/ui/text';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { cn } from '@/lib/utils';
import { TYPE_TITLE_LONG } from '@/styles/classes';
import { MOTION_DURATION_MS } from '@/styles/motion';
import type { GateSize } from '@/types/canvas-gate';

// Let the panel lay out before the screen reader moves onto it
const FOCUS_DELAY_MS = 100;

const PANEL_WIDTH: Record<GateSize, string> = {
  narrow: 'max-w-64',
  wide: 'max-w-xl',
};

const PANEL_ALIGN: Record<GateSize, string> = {
  narrow: 'items-center',
  wide: 'items-stretch p-6',
};

const TEXT_ALIGN: Record<GateSize, string> = {
  narrow: 'text-center',
  wide: 'text-left',
};

type Props = {
  icon?: ReactNode;
  title: string;
  detail?: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
  size: GateSize;
};

const GatePanel = ({ icon, title, detail, body, action, size }: Props) => {
  const runs = useMotionPolicy();
  const titleRef = useRef<ViewInstance>(null);
  // gateFade is kept under reduced motion, so the fade never skips
  const fadeMs = runs('gateFade') ? MOTION_DURATION_MS.gateFade : 0;

  // Focus lands on the title, which reads it out; again if it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (titleRef.current) {
        AccessibilityInfo.sendAccessibilityEvent(titleRef.current, 'focus');
      }
    }, FOCUS_DELAY_MS);
    return () => clearTimeout(timer);
  }, [title]);

  return (
    <Animated.View
      entering={FadeIn.duration(fadeMs).reduceMotion(ReduceMotion.Never)}
      exiting={FadeOut.duration(fadeMs).reduceMotion(ReduceMotion.Never)}
      className="absolute inset-0 items-center justify-center bg-gate-scrim p-4"
    >
      <View className={cn('w-full', PANEL_WIDTH[size])}>
        <ShadowBox
          radiusClassName="rounded-lg"
          className={cn(
            'gap-2 border-2 border-line bg-surface-raised p-4',
            PANEL_ALIGN[size],
          )}
        >
          {icon}
          <View
            ref={titleRef}
            accessible
            accessibilityRole="header"
            accessibilityLabel={title}
          >
            <Text className={cn(TYPE_TITLE_LONG, TEXT_ALIGN[size])}>
              {title}
            </Text>
          </View>
          {detail ? (
            <Text className={cn('text-14 text-fg-muted', TEXT_ALIGN[size])}>
              {detail}
            </Text>
          ) : null}
          {body ? <View className="mt-2 self-stretch">{body}</View> : null}
          {action ? <View className="mt-2 self-stretch">{action}</View> : null}
        </ShadowBox>
      </View>
    </Animated.View>
  );
};

export default GatePanel;
