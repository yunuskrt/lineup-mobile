import React from 'react';
import { View } from 'react-native';
import ProfilePlan from '@/components/profile/ProfilePlan';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { handleInitial } from '@/lib/profile';
import { TYPE_SECTION } from '@/styles/classes';
import type { User } from '@/types/user';

type Props = { user: User };

const ProfileHeader = ({ user }: Props) => {
  return (
    <View className="flex-row items-start gap-3">
      {/* The handle is read beside it; the letter is decoration */}
      <Avatar
        name={handleInitial(user.handle)}
        size="lg"
        isDecorative
        className="bg-block-mint"
      />
      <View className="min-w-0 flex-1 flex-row flex-wrap items-center gap-x-3 gap-y-2 pt-2">
        <Text accessibilityRole="header" className={TYPE_SECTION}>
          {user.handle}
        </Text>
        {user.isGuest ? (
          <Badge label="Guest" variant="sticker" tone="butter" />
        ) : null}
        <ProfilePlan tier={user.tier} />
      </View>
    </View>
  );
};

export default ProfileHeader;
