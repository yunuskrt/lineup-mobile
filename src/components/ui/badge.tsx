import React from 'react';
import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { ShadowBox } from '@/components/ui/shadow-box';
import {
  BADGE_LABEL,
  BADGE_TILT,
  BADGE_TONE,
  BADGE_VARIANT,
  type BadgeTilt,
  type BadgeTone,
  type BadgeVariant,
} from '@/components/ui/styles';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { ROLES } from '@/styles/tokens';

type Props = {
  label: string;
  variant?: BadgeVariant;
  tone?: BadgeTone;
  // A sticker leans left unless told otherwise
  tilt?: BadgeTilt;
  icon?: LucideIcon;
};

export const Badge = ({
  label,
  variant = 'tag',
  tone = 'neutral',
  tilt,
  icon: Icon,
}: Props) => {
  const lean = tilt ?? (variant === 'sticker' ? 'left' : 'none');
  const face = cn(
    'flex-row items-center gap-1 border-2 border-line',
    BADGE_VARIANT[variant],
    BADGE_TONE[tone],
  );
  const content = (
    <>
      {Icon ? (
        <Icon size={14} strokeWidth={2.5} color={ROLES['on-accent']} />
      ) : null}
      <Text className={cn(BADGE_LABEL[variant], 'text-on-accent')}>
        {label}
      </Text>
    </>
  );
  return (
    <View className={cn('self-start', BADGE_TILT[lean])}>
      {variant === 'sticker' ? (
        <ShadowBox
          depth="hard-sm"
          radiusClassName="rounded-sm"
          className={face}
        >
          {content}
        </ShadowBox>
      ) : (
        <View className={face}>{content}</View>
      )}
    </View>
  );
};
