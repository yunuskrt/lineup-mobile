import React from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { DevScreen } from '@/components/dev/DevSection';
import { Text } from '@/components/ui/text';
import { CANVAS_STATES } from '@/lib/dev/canvas-states';
import { TYPE_SECTION } from '@/styles/classes';
import type { CanvasMode } from '@/types/canvas';

const SECTIONS: { mode: CanvasMode; title: string }[] = [
  { mode: 'solo', title: 'Solo' },
  { mode: 'duel', title: 'Duel' },
];

type Props = {};

// Every ?state= the board can render, as the web's /dev/canvas
const CanvasIndexScreen = ({}: Props) => {
  return (
    <DevScreen title="Canvas">
      <Text className="text-14 text-fg-muted">
        Each state opens full screen. One-shot effects play 600ms after it
        opens; open it again to replay. Guesses go nowhere.
      </Text>
      {SECTIONS.map(({ mode, title }) => (
        <View key={mode} className="gap-2">
          <Text accessibilityRole="header" className={TYPE_SECTION}>
            {title}
          </Text>
          <View className="border-t-2 border-line">
            {Object.entries(CANVAS_STATES[mode]).map(([name, state]) => (
              <Pressable
                key={name}
                accessibilityRole="button"
                onPress={() =>
                  router.push({
                    pathname: '/dev/canvas/[mode]',
                    params: { mode, state: name },
                  })
                }
                className="min-h-11 gap-0.5 border-b-2 border-line py-3 active:bg-surface-raised"
              >
                <Text className="font-body-medium text-14">{name}</Text>
                <Text className="text-14 text-fg-muted">
                  {state.description}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}
    </DevScreen>
  );
};

export default CanvasIndexScreen;
