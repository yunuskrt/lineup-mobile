import React from 'react';
import { View } from 'react-native';
import ProLoadFailed from '@/components/pro/ProLoadFailed';
import ProView from '@/components/pro/ProView';
import NotFoundView from '@/components/shell/NotFoundView';
import { useSession } from '@/hooks/use-auth';
import { useAppConfig } from '@/hooks/use-pro';
import { authErrorMessageOf } from '@/lib/auth';
import { proPlanOf } from '@/lib/pro-plan';

type Props = {};

const ProScreen = ({}: Props) => {
  const config = useAppConfig();
  const session = useSession();

  if (config.isError && !config.data) {
    return (
      <ProLoadFailed
        message={authErrorMessageOf(config.error)}
        onRetry={() => void config.refetch()}
      />
    );
  }
  // Unknown yet: show nothing rather than guess
  if (!config.data) return <View className="flex-1 bg-surface" />;
  // With the split off, there is no Pro to show
  if (!config.data.proEnabled) return <NotFoundView />;

  const plan = proPlanOf(session.isPending, session.data?.user ?? null);
  return <ProView plan={plan} />;
};

export default ProScreen;
