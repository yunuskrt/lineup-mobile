import React, { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { DevScreen } from '@/components/dev/DevSection';
import ShowcaseFrame from '@/components/home/ShowcaseFrame';
import { FilterChip } from '@/components/ui/filter-chip';
import { Text } from '@/components/ui/text';
import {
  DEFAULT_WELCOME_STATE,
  WELCOME_STATES,
} from '@/lib/dev/welcome-states';

type Props = {};

// The Welcome's demo frame in each state, as the web's /?state=
const WelcomeStatesScreen = ({}: Props) => {
  const { state } = useLocalSearchParams<{ state?: string }>();
  const [name, setName] = useState(
    state && Object.hasOwn(WELCOME_STATES, state)
      ? state
      : DEFAULT_WELCOME_STATE,
  );
  const current = WELCOME_STATES[name];

  return (
    <DevScreen title="Welcome">
      <View className="gap-2">
        <View className="flex-row flex-wrap gap-2">
          {Object.keys(WELCOME_STATES).map((option) => (
            <FilterChip
              key={option}
              label={option}
              isOn={option === name}
              onPress={() => setName(option)}
            />
          ))}
        </View>
        <Text className="text-14 text-fg-muted">{current.description}</Text>
      </View>
      {/* Keyed: each state starts its loop from the top */}
      <ShowcaseFrame
        key={name}
        showcase={current.showcase}
        isLoading={current.isLoading}
        playback={current.playback}
      />
    </DevScreen>
  );
};

export default WelcomeStatesScreen;
