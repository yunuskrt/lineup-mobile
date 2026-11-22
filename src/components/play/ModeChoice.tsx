import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Check, Dumbbell, Swords, User } from 'lucide-react-native';
import CardIcon from '@/components/play/mode-choice/CardIcon';
import LockedCard from '@/components/play/mode-choice/LockedCard';
import PlayerBars from '@/components/play/mode-choice/PlayerBars';
import type { ModeCard } from '@/components/play/mode-choice/shared';
import { CARD_BODY } from '@/components/play/mode-choice/styles';
import { Badge } from '@/components/ui/badge';
import { ChoiceTile } from '@/components/ui/choice-tile';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { isShortScreen } from '@/lib/welcome';
import { TYPE_CARD_TITLE } from '@/styles/classes';
import type { ModeOption } from '@/types/play';
import type { ProAccess } from '@/types/pro';

type Props = {
  // Null: nothing picked yet
  option: ModeOption | null;
  onChange: (option: ModeOption) => void;
  // Practice is Pro (R14); shown locked, never hidden
  practiceAccess: ProAccess;
};

const MODES: ModeCard[] = [
  {
    option: 'solo',
    title: 'Solo',
    text: 'Just you and the clock. You pick home or away, and the run lasts until your lives are gone.',
    icon: User,
    players: ['you'],
  },
  {
    option: 'duel',
    title: 'Duel',
    text: 'Take turns with a live opponent on the same XI. Your filters and theirs go into a coin flip, and one set is used.',
    icon: Swords,
    players: ['you', 'opponent'],
  },
  {
    option: 'practice',
    title: 'Practice',
    text: "No clock and no lives. Name all eleven, or quit when you like. Practice runs aren't saved.",
    icon: Dumbbell,
    players: ['you'],
  },
];

const ModeChoice = ({ option, onChange, practiceAccess }: Props) => {
  // An iPhone SE drops the descriptions, as design-mobile.md § 6
  const hasText = !isShortScreen(useWindowDimensions().height);

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="Mode"
      className="gap-4"
    >
      {MODES.map((card) => {
        if (card.option === 'practice' && practiceAccess !== 'open') {
          return (
            <LockedCard
              key={card.option}
              card={card}
              isPending={practiceAccess === 'pending'}
            />
          );
        }
        const isSelected = option === card.option;
        return (
          <ChoiceTile
            key={card.option}
            isSelected={isSelected}
            onPress={() => onChange(card.option)}
            accessibilityRole="radio"
            accessibilityLabel={`${card.title}. ${card.text}`}
          >
            <View className={CARD_BODY}>
              <View className="flex-row items-start justify-between gap-3">
                <CardIcon icon={card.icon} />
                {/* The radio's own state says it to readers */}
                {isSelected ? (
                  <View
                    accessibilityElementsHidden
                    importantForAccessibility="no-hide-descendants"
                    className="mt-1"
                  >
                    <Badge
                      label="Selected"
                      variant="sticker"
                      tone="butter"
                      tilt="right"
                      icon={Check}
                    />
                  </View>
                ) : null}
              </View>
              <Text className={TYPE_CARD_TITLE}>{card.title}</Text>
              {hasText ? (
                <Text
                  className={cn(
                    'text-16',
                    isSelected ? 'text-on-accent' : 'text-fg-muted',
                  )}
                >
                  {card.text}
                </Text>
              ) : null}
              <PlayerBars players={card.players} />
            </View>
          </ChoiceTile>
        );
      })}
    </View>
  );
};

export default ModeChoice;
