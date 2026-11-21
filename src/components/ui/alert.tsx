import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { ShadowBox } from '@/components/ui/shadow-box';
import { ALERT_TONE, type AlertTone } from '@/components/ui/styles';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { ROLES } from '@/styles/tokens';

type Props = {
  children: ReactNode;
  tone?: AlertTone;
  icon?: LucideIcon;
  title?: string;
};

export const Alert = ({
  children,
  tone = 'warning',
  icon: Icon,
  title,
}: Props) => {
  return (
    <View accessibilityRole="alert">
      <ShadowBox
        depth="hard-sm"
        className={cn(
          'flex-row items-start gap-3 border-2 border-line px-4 py-3',
          ALERT_TONE[tone],
        )}
      >
        {Icon ? (
          <View className="mt-0.5">
            <Icon size={16} strokeWidth={2.5} color={ROLES['on-accent']} />
          </View>
        ) : null}
        <View className="flex-1 gap-0.5">
          {title ? (
            <Text className="font-body-semibold text-14">{title}</Text>
          ) : null}
          <Text className="text-14">{children}</Text>
        </View>
      </ShadowBox>
    </View>
  );
};
