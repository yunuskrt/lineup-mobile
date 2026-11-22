import React, { type ReactNode, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { DevScreen, DevSection } from '@/components/dev/DevSection';
import DuelLivesCard from '@/components/game/DuelLivesCard';
import LifeLostFlash from '@/components/game/LifeLostFlash';
import Lives from '@/components/game/Lives';
import LivesCard from '@/components/game/LivesCard';
import TurnSticker from '@/components/game/TurnSticker';
import { Button } from '@/components/ui/button';
import { FilterChip } from '@/components/ui/filter-chip';
import { Text } from '@/components/ui/text';
import { MAX_LIVES } from '@/lib/api/schemas/game';
import { RECONNECT_WINDOW_MS } from '@/lib/duel-session';
import { serverClock } from '@/lib/server-clock';
import type { ConnectionState, DuelActor, DuelPlayer } from '@/types/duel';
import type { Lives as LivesCount } from '@/types/game';

const OWNERS: DuelActor[] = ['you', 'opponent'];
const COUNTS: LivesCount[] = [3, 2, 1, 0];

const PLAYERS: Record<DuelActor, DuelPlayer> = {
  you: { id: 'preview-you', handle: 'northgate_no9', lives: MAX_LIVES },
  opponent: {
    id: 'preview-opponent',
    handle: 'Ciarán O’Donovan-Addo-Mensah',
    lives: MAX_LIVES,
  },
};

function loseLife(lives: LivesCount): LivesCount {
  return Math.max(lives - 1, 0);
}

type SpecimenProps = { label: string; children: ReactNode };

const Specimen = ({ label, children }: SpecimenProps) => {
  return (
    <View className="items-start gap-2">
      {children}
      <Text className="text-12 text-fg-muted">{label}</Text>
    </View>
  );
};

type Props = {};

// Every lives display and the flash; ?section= shows one
const LivesScreen = ({}: Props) => {
  const { section } = useLocalSearchParams<{ section?: string }>();
  const [flashKey, setFlashKey] = useState(0);
  const [soloLives, setSoloLives] = useState<LivesCount>(MAX_LIVES);
  const [duel, setDuel] = useState(PLAYERS);
  const [turn, setTurn] = useState<DuelActor | null>('you');
  const [isPaired, setIsPaired] = useState(true);
  const [connection, setConnection] = useState<ConnectionState | null>(null);

  function flash() {
    setFlashKey((key) => key + 1);
  }

  function loseSoloLife() {
    setSoloLives(loseLife);
    flash();
  }

  function loseDuelLife(actor: DuelActor) {
    setDuel((players) => ({
      ...players,
      [actor]: { ...players[actor], lives: loseLife(players[actor].lives) },
    }));
    if (actor === 'you') flash();
  }

  function handOver() {
    setTurn((current) => (current === 'you' ? 'opponent' : 'you'));
  }

  // A timeout costs a life and hands over at once
  function timeOut() {
    if (turn === null) return;
    loseDuelLife(turn);
    handOver();
  }

  function toggleReconnect() {
    setConnection((current) =>
      current
        ? null
        : {
            status: 'reconnecting',
            reconnectDeadline: serverClock.now() + RECONNECT_WINDOW_MS,
          },
    );
  }

  // No opponent yet, so no connection to show
  function togglePairing() {
    setIsPaired((current) => !current);
    setTurn((current) => (current === null ? 'you' : null));
    setConnection(null);
  }

  function resetDuel() {
    setDuel(PLAYERS);
    setTurn('you');
    setIsPaired(true);
    setConnection(null);
  }

  return (
    <View className="flex-1">
      <DevScreen title="Lives">
        <DevSection id="solo" title="Solo" only={section}>
          <View className="flex-row flex-wrap gap-3">
            <Button
              label="Lose a life"
              variant="secondary"
              isDisabled={soloLives === 0}
              onPress={loseSoloLife}
            />
            <Button
              label="Reset"
              variant="secondary"
              onPress={() => setSoloLives(MAX_LIVES)}
            />
          </View>
          <LivesCard lives={soloLives} />
        </DevSection>
        <DevSection id="duel" title="Duel" only={section}>
          <View className="flex-row flex-wrap gap-3">
            <Button
              label="Hand over"
              variant="secondary"
              isDisabled={!isPaired}
              onPress={handOver}
            />
            <Button
              label="Clock runs out"
              variant="secondary"
              isDisabled={turn === null || duel[turn].lives === 0}
              onPress={timeOut}
            />
            {OWNERS.map((actor) => (
              <Button
                key={actor}
                label={actor === 'you' ? 'You lose a life' : 'They lose a life'}
                variant="secondary"
                isDisabled={duel[actor].lives === 0 || !isPaired}
                onPress={() => loseDuelLife(actor)}
              />
            ))}
            <Button label="Reset" variant="secondary" onPress={resetDuel} />
          </View>
          <View className="flex-row flex-wrap gap-3">
            <FilterChip
              label="Opponent reconnecting"
              isOn={connection !== null}
              isDisabled={!isPaired}
              onPress={toggleReconnect}
            />
            <FilterChip
              label="Before pairing"
              isOn={!isPaired}
              onPress={togglePairing}
            />
          </View>
          {turn ? <TurnSticker turn={turn} /> : null}
          {/* About the rail's width beside the clock */}
          <View className="w-60">
            <DuelLivesCard
              you={duel.you}
              opponent={isPaired ? duel.opponent : null}
              turn={turn}
              opponentConnection={connection}
            />
          </View>
        </DevSection>
        <DevSection id="static" title="Static" only={section}>
          {OWNERS.map((owner) => (
            <View key={owner} className="flex-row flex-wrap gap-6">
              {COUNTS.map((count) => (
                <Specimen key={count} label={`${owner}, ${count}`}>
                  <Lives lives={count} owner={owner} />
                </Specimen>
              ))}
            </View>
          ))}
        </DevSection>
      </DevScreen>
      <LifeLostFlash flashKey={flashKey} />
    </View>
  );
};

export default LivesScreen;
