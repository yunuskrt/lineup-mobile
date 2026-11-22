import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { SECTION_LABEL } from '@/styles/classes';

type Props = {
  chip?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

// A section of the rail, not a card of its own; phones drop the hint
const CardFrame = ({ chip, footer, children }: Props) => {
  return (
    <View className="gap-2">
      <View className="min-h-6 flex-row items-center justify-between gap-2">
        <Text accessibilityRole="header" className={SECTION_LABEL}>
          Lives
        </Text>
        {chip}
      </View>
      {children}
      {footer}
    </View>
  );
};

export default CardFrame;
