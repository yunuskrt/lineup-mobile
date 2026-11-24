import React from 'react';
import ProLoadFailed from '@/components/pro/ProLoadFailed';
import ProView from '@/components/pro/ProView';
import { resolveProState } from '@/lib/dev/pro-states';

type ProStatePreviewProps = {
  state?: string | string[];
};

export const ProStatePreview = ({ state }: ProStatePreviewProps) => {
  const preview = resolveProState(state);
  // A snapshot has no server to retry
  if (preview.status === 'error') {
    return <ProLoadFailed message={preview.message} onRetry={() => {}} />;
  }
  return <ProView plan={preview.plan} />;
};
