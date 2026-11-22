import React from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { pressHaptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import type { AuthMode } from '@/types/auth';

const MODES: { mode: AuthMode; label: string }[] = [
  { mode: 'sign-in', label: 'Sign in' },
  { mode: 'sign-up', label: 'Create account' },
];

type Props = {
  mode: AuthMode;
};

// The mode lives in the route, so a link can open either form
const ModeSwitch = ({ mode }: Props) => {
  return (
    <View
      accessibilityRole="tablist"
      className="flex-row rounded-full border-2 border-line bg-surface-card p-1"
    >
      {MODES.map((item) => {
        const isActive = item.mode === mode;
        return (
          <Pressable
            key={item.mode}
            onPressIn={pressHaptic}
            onPress={() => router.setParams({ mode: item.mode })}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            className={cn(
              'h-11 flex-1 items-center justify-center rounded-full border-2',
              isActive ? 'border-line bg-brand' : 'border-transparent',
            )}
          >
            <Text
              className={cn(
                'font-body-semibold text-14',
                !isActive && 'text-fg-muted',
              )}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default ModeSwitch;
