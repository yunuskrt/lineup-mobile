import React from 'react';
import { Pressable, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { ShadowBox } from '@/components/ui/shadow-box';
import { Text } from '@/components/ui/text';
import { pressHaptic } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { ROLES } from '@/styles/tokens';

const PILL = 'items-center rounded-full border-2 px-4 py-0.5';

type Props = {
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  onPress: () => void;
};

const TabButton = ({ label, icon: Icon, isActive, onPress }: Props) => {
  const glyph = (
    <Icon
      size={20}
      strokeWidth={2.25}
      color={isActive ? ROLES.fg : ROLES['fg-muted']}
    />
  );
  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressHaptic}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: isActive }}
      className="flex-1 items-center justify-center gap-1"
    >
      {isActive ? (
        <ShadowBox
          depth="hard-sm"
          radiusClassName="rounded-full"
          className={cn(PILL, 'border-line bg-brand')}
        >
          {glyph}
        </ShadowBox>
      ) : (
        <View className={cn(PILL, 'border-transparent')}>{glyph}</View>
      )}
      <Text
        className={cn(
          'font-body-semibold text-12',
          isActive ? 'text-fg' : 'text-fg-muted',
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default TabButton;
