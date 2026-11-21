import React from 'react';
import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { ICON_TILE } from '@/components/ui/styles';
import { cn } from '@/lib/utils';
import { ROLES } from '@/styles/tokens';

const TILE_SIZE = { md: 'h-10 w-10', lg: 'h-12 w-12' } as const;

const ICON_SIZE = { md: 20, lg: 24 } as const;

type Props = {
  icon: LucideIcon;
  size?: keyof typeof TILE_SIZE;
  // The fill, e.g. bg-block-butter; white by default
  className?: string;
};

// An outlined icon tile, as the mode cards
export const IconTile = ({ icon: Icon, size = 'md', className }: Props) => {
  return (
    <View
      className={cn(ICON_TILE, TILE_SIZE[size], 'bg-surface-card', className)}
    >
      <Icon size={ICON_SIZE[size]} strokeWidth={2.25} color={ROLES.fg} />
    </View>
  );
};
