import React from 'react';
import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { IconTile } from '@/components/ui/icon-tile';

type Props = { icon: LucideIcon };

const CardIcon = ({ icon }: Props) => {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <IconTile icon={icon} size="lg" className="bg-surface-raised" />
    </View>
  );
};

export default CardIcon;
