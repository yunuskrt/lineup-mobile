import React, { useState } from 'react';
import { View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { DevScreen, DevSection } from '@/components/dev/DevSection';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  failureOf,
  useContinueAsGuest,
  useSession,
  useSignOut,
} from '@/hooks/use-auth';
import { useAppConfig, useProAccess } from '@/hooks/use-pro';
import { getApiClient } from '@/lib/api';
import { hasToken, setToken } from '@/lib/api/http/token-store';
import { unwrap } from '@/lib/api/unwrap';

// Never a real token: the server refuses it, which is the point
const REVOKED_TOKEN = 'revoked.dev-session';

type RowProps = { label: string; value: string };

const Row = ({ label, value }: RowProps) => {
  return (
    <View className="flex-row justify-between gap-4 border-b-2 border-rule py-2">
      <Text className="text-14 text-fg-muted">{label}</Text>
      <Text className="flex-shrink text-14 font-body-semibold">{value}</Text>
    </View>
  );
};

type Props = {};

// The session against the real backend; the token itself never shows
const SessionScreen = ({}: Props) => {
  // hasToken() isn't React state; the compiler would cache its first value
  'use no memo';
  const queryClient = useQueryClient();
  const session = useSession();
  const config = useAppConfig();
  const pro = useProAccess();
  const continueAsGuest = useContinueAsGuest();
  const signOut = useSignOut();
  const [note, setNote] = useState('');

  const user = session.data?.user;
  const who = session.isPending
    ? 'Loading'
    : user
      ? `${user.isGuest ? 'Guest' : 'User'} ${user.handle} (${user.tier})`
      : 'Signed out';

  const tryRevokedToken = async () => {
    setToken(REVOKED_TOKEN);
    try {
      unwrap(await getApiClient().profile.getProfile());
      setNote('The profile loaded, which a revoked token should not do');
    } catch (error) {
      setNote(`Refused: ${failureOf(queryClient, error).code}`);
    }
  };

  const refetch = () => {
    setNote('');
    session.refetch();
    config.refetch();
  };

  return (
    <DevScreen title="Session">
      <DevSection id="state" title="State">
        <View>
          <Row label="Session" value={who} />
          <Row label="Token stored" value={hasToken() ? 'Yes' : 'No'} />
          <Row
            label="Pro switch"
            value={
              config.data
                ? config.data.proEnabled
                  ? 'On'
                  : 'Off'
                : config.isError
                  ? 'Unreachable'
                  : 'Loading'
            }
          />
          <Row label="Pro access" value={pro} />
          <Row
            label="Last error"
            value={session.error?.message ?? (note || 'None')}
          />
        </View>
      </DevSection>
      <DevSection id="actions" title="Actions">
        <View className="gap-3">
          <Button
            label="Continue as guest"
            isBusy={continueAsGuest.isPending}
            onPress={() => continueAsGuest.mutate()}
          />
          <Button
            label="Sign out"
            variant="secondary"
            isBusy={signOut.isPending}
            onPress={() => signOut.mutate()}
          />
          <Button label="Refetch" variant="secondary" onPress={refetch} />
          <Button
            label="Use a revoked token"
            variant="secondary"
            onPress={tryRevokedToken}
          />
        </View>
      </DevSection>
    </DevScreen>
  );
};

export default SessionScreen;
