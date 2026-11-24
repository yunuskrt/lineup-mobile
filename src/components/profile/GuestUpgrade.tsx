import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { UserRound } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { ShadowBox } from '@/components/ui/shadow-box';
import { Text } from '@/components/ui/text';
import { ROLES } from '@/styles/tokens';

const GUEST_UPGRADE_HREF = '/sign-in?mode=sign-up';

type Props = {};

// The design's guest strip: an invitation, never a wall
const GuestUpgrade = ({}: Props) => {
  return (
    <ShadowBox
      depth="hard-sm"
      className="gap-3 border-2 border-line bg-surface-card px-4 py-3"
    >
      <View className="flex-row items-start gap-3">
        <View className="mt-0.5">
          <UserRound size={16} strokeWidth={2.5} color={ROLES['on-accent']} />
        </View>
        <Text className="flex-1 text-14">
          You’re playing as a guest. Create an account to keep your history on
          any device. Nothing you’ve played is lost.
        </Text>
      </View>
      <Button
        label="Create account"
        onPress={() => router.push(GUEST_UPGRADE_HREF)}
      />
    </ShadowBox>
  );
};

export default GuestUpgrade;
