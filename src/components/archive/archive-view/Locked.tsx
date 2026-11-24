import React from 'react';
import { View } from 'react-native';
import { Archive } from 'lucide-react-native';
import ProLock from '@/components/pro/ProLock';
import { ShadowBox } from '@/components/ui/shadow-box';
import { ICON_TILE } from '@/components/ui/styles';
import { cn } from '@/lib/utils';
import { ROLES } from '@/styles/tokens';

type Props = {};

// The server refuses Free the archive: one lock, no rows
const Locked = ({}: Props) => {
  return (
    <View className="w-full items-center gap-4 rounded-md border-2 border-dashed border-line bg-surface p-6">
      <ShadowBox
        depth="hard-sm"
        className={cn(ICON_TILE, 'h-12 w-12 bg-block-lavender')}
      >
        <Archive size={24} strokeWidth={2.25} color={ROLES['on-accent']} />
      </ShadowBox>
      <ProLock
        label="Browse the archive"
        caption="The archive is part of Pro."
        size="large"
        isFullWidth
      />
    </View>
  );
};

export default Locked;
