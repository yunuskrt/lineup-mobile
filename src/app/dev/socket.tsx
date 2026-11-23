import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { DevScreen, DevSection } from '@/components/dev/DevSection';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useSession } from '@/hooks/use-auth';
import { useFilterOptions } from '@/hooks/use-filter-options';
import { getDuelClient } from '@/lib/api/duel-client';
import { DUEL_EVENTS } from '@/lib/api/socket/messages';
import {
  socketEventSummary,
  socketStatusLabel,
  withEntry,
} from '@/lib/dev/socket-log';
import type { ApiResult } from '@/types/api';
import type { SocketLogEntry, SocketStatus } from '@/types/socket-log';

type Command = () => Promise<ApiResult<void>>;

type Props = {};

// The duel socket before the lobby exists; the token never shows
const SocketScreen = ({}: Props) => {
  const session = useSession();
  const options = useFilterOptions();
  const [status, setStatus] = useState<SocketStatus>({ kind: 'idle' });
  const [log, setLog] = useState<SocketLogEntry[]>([]);
  const nextId = useRef(0);
  const user = session.data?.user;

  function record(label: string, summary: string) {
    nextId.current += 1;
    const entry = { id: nextId.current, label, summary };
    setLog((current) => withEntry(current, entry));
  }

  useEffect(() => {
    const client = getDuelClient();
    const offs = DUEL_EVENTS.map((event) =>
      client.on(event, (payload) => {
        record(event, socketEventSummary(event, payload));
      }),
    );
    offs.push(
      client.onConnection((change) => {
        setStatus({ kind: change });
        record('connection', change);
      }),
      client.onClose((error) => {
        setStatus({ kind: 'closed', code: error.code, message: error.message });
        record('close', error.code);
      }),
    );
    return () => {
      for (const off of offs) off();
      client.disconnect();
    };
  }, []);

  async function connect() {
    setStatus({ kind: 'connecting' });
    const result = await getDuelClient().connect();
    if (result.success) setStatus({ kind: 'connected' });
    else
      setStatus({
        kind: 'closed',
        code: result.error.code,
        message: result.error.message,
      });
    record('connect', result.success ? 'ok' : result.error.code);
  }

  function disconnect() {
    getDuelClient().disconnect();
    setStatus({ kind: 'idle' });
    record('disconnect', 'by you');
  }

  async function send(label: string, command: Command) {
    const result = await command();
    record(label, result.success ? 'ok' : result.error.code);
  }

  return (
    <DevScreen title="Socket">
      <DevSection id="state" title="State">
        <View className="gap-1">
          <Text className="text-14 text-fg-muted">
            {user
              ? `${user.isGuest ? 'Guest' : 'User'} ${user.handle}`
              : 'Signed out: use /dev/session first'}
          </Text>
          <Text className="font-body-semibold text-16">
            {socketStatusLabel(status)}
          </Text>
        </View>
      </DevSection>
      <DevSection id="actions" title="Actions">
        <View className="gap-3">
          <Button label="Connect" onPress={() => void connect()} />
          <Button label="Disconnect" variant="secondary" onPress={disconnect} />
          <Button
            label="Find an opponent"
            variant="secondary"
            onPress={() => void send('queue:enter', getDuelClient().enterQueue)}
          />
          <Button
            label="Submit filters (Any)"
            variant="secondary"
            isDisabled={!options.data}
            onPress={() => {
              if (!options.data) return;
              // Any: every competition and club, the whole era
              const filters = {
                competitionIds: [],
                clubIds: [],
                era: options.data.era,
              };
              void send('filters:submit', () =>
                getDuelClient().submitFilters(filters),
              );
            }}
          />
          <Button
            label="Leave queue"
            variant="secondary"
            onPress={() => void send('queue:leave', getDuelClient().leaveQueue)}
          />
          <Button
            label="Forfeit"
            variant="secondary"
            onPress={() => void send('duel:forfeit', getDuelClient().forfeit)}
          />
        </View>
      </DevSection>
      <DevSection id="log" title="Events, newest first">
        <View>
          {log.length === 0 ? (
            <Text className="text-14 text-fg-muted">Nothing yet.</Text>
          ) : (
            log.map((entry) => (
              <View
                key={entry.id}
                className="flex-row gap-3 border-b-2 border-rule py-2"
              >
                <Text className="w-32 font-body-semibold text-14">
                  {entry.label}
                </Text>
                <Text className="flex-1 text-14 text-fg-muted">
                  {entry.summary}
                </Text>
              </View>
            ))
          )}
        </View>
      </DevSection>
    </DevScreen>
  );
};

export default SocketScreen;
