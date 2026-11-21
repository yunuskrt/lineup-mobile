import React, { type ReactNode, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
  usePanGesture,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { shouldDismiss } from '@/lib/sheet-gesture';
import { cn } from '@/lib/utils';
import { TYPE_CARD_TITLE } from '@/styles/classes';

const SLIDE_MS = 240;
const SHEET_GAP = 16;

type Props = {
  isOpen: boolean;
  // Back, a tap on the scrim or a drag down closes it
  onClose: () => void;
  title: string;
  // Long content takes 90% of the screen, short fits itself
  isTall?: boolean;
  children: ReactNode;
};

// A bottom sheet in the sticker look; it rises above the keyboard
export const Sheet = ({
  isOpen,
  onClose,
  title,
  isTall = false,
  children,
}: Props) => {
  const slides = useMotionPolicy()('sheetSlide');
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const offset = useSharedValue(height);
  const shown = useSharedValue(0);

  useEffect(() => {
    if (!isOpen) return;
    offset.set(slides ? height : 0);
    shown.set(0);
    offset.set(withTiming(0, { duration: SLIDE_MS }));
    shown.set(withTiming(1, { duration: SLIDE_MS }));
  }, [isOpen, slides, height, offset, shown]);

  const dismiss = () => {
    offset.set(withTiming(slides ? height : 0, { duration: SLIDE_MS }));
    shown.set(
      withTiming(0, { duration: SLIDE_MS }, (isFinished) => {
        if (isFinished) runOnJS(onClose)();
      }),
    );
  };

  const drag = usePanGesture({
    onUpdate: (event) => {
      'worklet';
      offset.set(Math.max(0, event.translationY));
    },
    onDeactivate: (event) => {
      'worklet';
      const isDismissed = shouldDismiss(event.translationY, event.velocityY);
      if (!isDismissed) {
        offset.set(withTiming(0, { duration: SLIDE_MS }));
        return;
      }
      offset.set(withTiming(height, { duration: SLIDE_MS }));
      shown.set(
        withTiming(0, { duration: SLIDE_MS }, (isFinished) => {
          if (isFinished) runOnJS(onClose)();
        }),
      );
    },
  });

  const scrimStyle = useAnimatedStyle(() => ({ opacity: shown.value }));
  const panelStyle = useAnimatedStyle(() => ({
    opacity: slides ? 1 : shown.value,
    transform: [{ translateY: offset.value }],
  }));

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={dismiss}
    >
      {/* Gestures in a Modal need their own root on Android */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior="padding" className="flex-1 justify-end">
          <Animated.View
            className="absolute inset-0 bg-gate-scrim"
            // A Reanimated style: the scrim fades with the sheet
            style={scrimStyle}
          >
            <Pressable
              onPress={dismiss}
              accessibilityLabel="Close"
              className="flex-1"
            />
          </Animated.View>
          <Animated.View
            accessibilityViewIsModal
            className={cn(
              'max-h-[90%] rounded-t-lg border-x-2 border-t-2 border-line bg-surface px-4',
              isTall && 'h-[90%]',
            )}
            // Reanimated slide, and the bottom inset known at run time
            style={[panelStyle, { paddingBottom: insets.bottom + SHEET_GAP }]}
          >
            <GestureDetector gesture={drag}>
              <View className="gap-3 pb-3 pt-3">
                <View className="h-1 w-10 self-center rounded-full bg-line" />
                <Text accessibilityRole="header" className={TYPE_CARD_TITLE}>
                  {title}
                </Text>
                <View className="border-t-2 border-line" />
              </View>
            </GestureDetector>
            <View className={cn('gap-3', isTall && 'flex-1')}>{children}</View>
          </Animated.View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
};
