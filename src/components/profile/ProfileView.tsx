import React, { type ReactNode } from 'react';
import { View } from 'react-native';
import DuelRecord from '@/components/profile/DuelRecord';
import GuestUpgrade from '@/components/profile/GuestUpgrade';
import HistoryList from '@/components/profile/HistoryList';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileNotice from '@/components/profile/ProfileNotice';
import ProfileSkeleton from '@/components/profile/ProfileSkeleton';
import ProfileStats from '@/components/profile/ProfileStats';
import SignOut from '@/components/profile/profile-view/SignOut';
import { PROFILE_FIGURES, PROFILE_SECTION } from '@/components/profile/styles';
import Screen from '@/components/shell/Screen';
import type { ProfileScreenView } from '@/types/profile-screen';

type Props = {
  view: ProfileScreenView;
  onRetry: () => void;
  onShowMore: () => void;
  // Previews have no server to refresh from
  onRefresh?: () => void;
  isRefreshing?: boolean;
};

function contentOf(
  view: ProfileScreenView,
  onRetry: () => void,
  onShowMore: () => void,
): ReactNode {
  switch (view.status) {
    case 'loading':
      return <ProfileSkeleton isGuest={view.isGuest} />;
    case 'signedOut':
      return <ProfileNotice kind="signedOut" />;
    case 'error':
      return (
        <ProfileNotice kind="error" message={view.message} onRetry={onRetry} />
      );
    case 'ready': {
      const { user, stats } = view.profile;
      return (
        <>
          <View className="gap-4">
            <ProfileHeader user={user} />
            {user.isGuest ? <GuestUpgrade /> : null}
          </View>
          <View className={PROFILE_FIGURES}>
            <DuelRecord stats={stats} />
            <ProfileStats stats={stats} />
          </View>
          <HistoryList
            history={view.history}
            more={view.more}
            onShowMore={onShowMore}
          />
          {/* A guest can't sign back in; the strip upgrades instead */}
          {user.isGuest ? null : (
            <View className={PROFILE_SECTION}>
              <SignOut />
            </View>
          )}
        </>
      );
    }
  }
}

const ProfileView = ({
  view,
  onRetry,
  onShowMore,
  onRefresh,
  isRefreshing,
}: Props) => {
  const canRefresh = view.status === 'ready' || view.status === 'error';
  return (
    <Screen
      title="Profile"
      hasTabBar
      onRefresh={canRefresh ? onRefresh : undefined}
      isRefreshing={isRefreshing}
    >
      {contentOf(view, onRetry, onShowMore)}
    </Screen>
  );
};

export default ProfileView;
