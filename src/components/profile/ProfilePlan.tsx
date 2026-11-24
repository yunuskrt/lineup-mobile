import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAppConfig } from '@/hooks/use-pro';
import { PRO_PATH, showsPro } from '@/lib/pro';
import type { Tier } from '@/types/user';

type Props = { tier: Tier };

// Shown only while the Free/Pro split is on
const ProfilePlan = ({ tier }: Props) => {
  const config = useAppConfig();
  if (!showsPro(config.data ?? null)) return null;
  const isPro = tier === 'pro';

  return (
    <>
      <Badge
        label={isPro ? 'Pro' : 'Free'}
        variant="sticker"
        tone={isPro ? 'brand' : 'neutral'}
      />
      <View className="w-full flex-row flex-wrap items-center gap-x-3 gap-y-2">
        <Text className="text-14 text-fg-muted">
          {isPro ? 'You’re on Pro.' : 'You’re on the Free plan.'}
        </Text>
        {isPro ? null : (
          <Button
            label="See Pro"
            variant="secondary"
            onPress={() => router.push(PRO_PATH)}
          />
        )}
      </View>
    </>
  );
};

export default ProfilePlan;
