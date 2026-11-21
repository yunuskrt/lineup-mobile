import React, { type ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import Animated, {
  type EntryExitAnimationFunction,
  withTiming,
} from 'react-native-reanimated';
import { ShadowBox } from '@/components/ui/shadow-box';
import { Text } from '@/components/ui/text';
import { useMotionPolicy } from '@/hooks/use-motion-policy';
import { TYPE_TITLE_LONG } from '@/styles/classes';

const ENTER_MS = 160;
const FROM_SCALE = 0.96;

function enterFrom(scale: number): EntryExitAnimationFunction {
  return () => {
    'worklet';
    return {
      initialValues: { opacity: 0, transform: [{ scale }] },
      animations: {
        opacity: withTiming(1, { duration: ENTER_MS }),
        transform: [{ scale: withTiming(1, { duration: ENTER_MS }) }],
      },
    };
  };
}

type Props = {
  isOpen: boolean;
  title: string;
  message?: ReactNode;
  // Back and a tap on the scrim both cancel
  onCancel: () => void;
  // The buttons, the safe choice first
  children: ReactNode;
};

// The web's AlertDialog: a centred card over the scrim
export const Dialog = ({
  isOpen,
  title,
  message,
  onCancel,
  children,
}: Props) => {
  const scales = useMotionPolicy()('dialogScale');
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center px-4">
        {/* A sibling, not a parent: a pressable parent hides the buttons */}
        <Pressable
          onPress={onCancel}
          accessibilityLabel="Close"
          className="absolute inset-0 bg-gate-scrim"
        />
        <Animated.View
          entering={enterFrom(scales ? FROM_SCALE : 1)}
          accessibilityViewIsModal
          onAccessibilityEscape={onCancel}
          className="w-full max-w-sm"
        >
          <ShadowBox className="gap-2 border-2 border-line bg-surface-card p-6">
            <Text accessibilityRole="header" className={TYPE_TITLE_LONG}>
              {title}
            </Text>
            {message ? (
              <Text className="text-14 text-fg-muted">{message}</Text>
            ) : null}
            <View className="mt-4 gap-3">{children}</View>
          </ShadowBox>
        </Animated.View>
      </View>
    </Modal>
  );
};
