import React, { useState } from 'react';
import ProfileView from '@/components/profile/ProfileView';
import { useSession } from '@/hooks/use-auth';
import { useHistory, useProfile } from '@/hooks/use-profile';
import { profileScreenView } from '@/lib/profile';

type Props = {};

const ProfileScreen = ({}: Props) => {
  const session = useSession();
  const profile = useProfile();
  const history = useHistory();
  // Only a pull shows the spinner, never a refetch on focus
  const [isRefreshing, setIsRefreshing] = useState(false);

  const view = profileScreenView({
    session,
    profile,
    history: { ...history, data: history.data?.pages },
  });

  function retry() {
    if (session.isError) void session.refetch();
    if (profile.isError && !profile.data) void profile.refetch();
    if (history.isError && !history.data) void history.refetch();
  }

  async function refresh() {
    setIsRefreshing(true);
    // Refetch ignores enabled: with no user, only the session reloads
    if (session.data) {
      await Promise.all([profile.refetch(), history.refetch()]);
    } else {
      await session.refetch();
    }
    setIsRefreshing(false);
  }

  return (
    <ProfileView
      view={view}
      onRetry={retry}
      onRefresh={() => void refresh()}
      isRefreshing={isRefreshing}
    />
  );
};

export default ProfileScreen;
