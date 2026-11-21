import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { ShadowBox } from '@/components/ui/shadow-box';
import { ICON_TILE } from '@/components/ui/styles';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { TYPE_CARD_TITLE } from '@/styles/classes';
import { ROLES } from '@/styles/tokens';

type Props = {
  icon: LucideIcon;
  message: ReactNode;
  title?: string;
  // The tile's fill; butter by default
  tileClassName?: string;
  // Inline under a list: smaller box and tile
  isCompact?: boolean;
  // An error: read out at once
  isAlert?: boolean;
  children?: ReactNode;
};

// Empty and error states: icon tile, words, action
export const Empty = ({
  icon: Icon,
  message,
  title,
  tileClassName = 'bg-block-butter',
  isCompact = false,
  isAlert = false,
  children,
}: Props) => {
  return (
    <View
      className={cn(
        'w-full items-center rounded-md border-2 border-dashed border-line bg-surface',
        isCompact ? 'gap-3 p-4' : 'gap-4 p-6',
      )}
    >
      <ShadowBox
        depth="hard-sm"
        className={cn(
          ICON_TILE,
          isCompact ? 'h-10 w-10' : 'h-12 w-12',
          tileClassName,
        )}
      >
        <Icon
          size={isCompact ? 20 : 24}
          strokeWidth={2.25}
          color={ROLES['on-accent']}
        />
      </ShadowBox>
      <View className="items-center gap-2">
        {title ? (
          <Text
            accessibilityRole="header"
            className={cn(TYPE_CARD_TITLE, 'text-center')}
          >
            {title}
          </Text>
        ) : null}
        <Text
          accessibilityRole={isAlert ? 'alert' : undefined}
          className={cn(
            'text-center',
            title ? 'text-14 text-fg-muted' : 'text-16',
          )}
        >
          {message}
        </Text>
      </View>
      {children ? (
        <View className="w-full items-center gap-3">{children}</View>
      ) : null}
    </View>
  );
};
