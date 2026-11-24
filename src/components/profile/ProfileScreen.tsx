import React, { useState } from 'react';
import ProfileView from '@/components/profile/ProfileView';
import { useSession } from '@/hooks/use-auth';
import { useHistory, useProfile, useRefreshHistory } from '@/hooks/use-profile';
import { isStaleCursor, profileScreenView } from '@/lib/profile';

type Props = {};

const ProfileScreen = ({}: Props) => {
  const session = useSession();
  const profile = useProfile();
  const history = useHistory();
  const refreshHistory = useRefreshHistory();
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

  function showMore() {
    if (history.isFetchingNextPage) return;
    // Refetch recomputes each cursor from page one
    if (history.isFetchNextPageError && isStaleCursor(history.error)) {
      void history.refetch();
      return;
    }
    void history.fetchNextPage();
  }

  async function refresh() {
    setIsRefreshing(true);
    // Refetch ignores enabled: with no user, only the session reloads
    if (session.data) {
      await Promise.all([profile.refetch(), refreshHistory()]);
    } else {
      await session.refetch();
    }
    setIsRefreshing(false);
  }

  return (
    <ProfileView
      view={view}
      onRetry={retry}
      onShowMore={showMore}
      onRefresh={() => void refresh()}
      isRefreshing={isRefreshing}
    />
  );
};

export default ProfileScreen;
