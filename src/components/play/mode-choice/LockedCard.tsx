import React from 'react';
import { View } from 'react-native';
import CardIcon from '@/components/play/mode-choice/CardIcon';
import PlayerBars from '@/components/play/mode-choice/PlayerBars';
import {
  type ModeCard,
  PRACTICE_CAPTION,
} from '@/components/play/mode-choice/shared';
import { CARD_BODY } from '@/components/play/mode-choice/styles';
import ProLockCaption from '@/components/pro/ProLockCaption';
import { CHOICE_TILE } from '@/components/ui/styles';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { TYPE_CARD_TITLE } from '@/styles/classes';

type Props = { card: ModeCard; isPending: boolean };

// Inert and flat: a disabled radio, with See Pro beside it
const LockedCard = ({ card, isPending }: Props) => {
  return (
    <View className={cn(CHOICE_TILE, CARD_BODY, 'rounded-md bg-surface-card')}>
      <View
        accessible
        accessibilityRole="radio"
        accessibilityLabel={card.title}
        accessibilityHint={isPending ? undefined : PRACTICE_CAPTION}
        accessibilityState={{ checked: false, disabled: true }}
        className={CARD_BODY}
      >
        <CardIcon icon={card.icon} />
        <Text className={cn(TYPE_CARD_TITLE, 'text-fg-muted')}>
          {card.title}
        </Text>
      </View>
      {isPending ? null : <ProLockCaption caption={PRACTICE_CAPTION} />}
      <PlayerBars players={card.players} />
    </View>
  );
};

export default LockedCard;
