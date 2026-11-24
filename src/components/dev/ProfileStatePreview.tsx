import React, { useState } from 'react';
import ProfileView from '@/components/profile/ProfileView';
import { resolveProfileState } from '@/lib/dev/profile-states';

type ProfileStatePreviewProps = {
  state?: string | string[];
};

export const ProfileStatePreview = ({ state }: ProfileStatePreviewProps) => {
  // Built once, so Today and Yesterday hold while it's open
  const [view] = useState(() => resolveProfileState(state).build(Date.now()));

  // Snapshots have no server to retry or refresh
  return <ProfileView view={view} onRetry={() => {}} />;
};
