import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import RuleTile from '@/components/home/home-rules/RuleTile';
import { isShortScreen } from '@/lib/welcome';

// The web's three rules, each in its block colour
const RULES = [
  {
    count: '11',
    label: 'named',
    text: 'Starters to name, from one team in one real match.',
    fill: 'bg-block-lavender',
  },
  {
    count: '15s',
    label: 'a turn',
    text: 'Seconds a turn. Name a new player to end it.',
    fill: 'bg-block-mint',
  },
  {
    count: '3',
    label: 'lives',
    text: 'Lives. Only the clock takes one. A wrong name just costs time.',
    fill: 'bg-block-butter',
  },
] as const;

type Props = {};

const HomeRules = ({}: Props) => {
  const isShort = isShortScreen(useWindowDimensions().height);
  return (
    <View className="gap-3">
      {RULES.map((rule) => (
        <RuleTile key={rule.count} {...rule} isShort={isShort} />
      ))}
    </View>
  );
};

export default HomeRules;
