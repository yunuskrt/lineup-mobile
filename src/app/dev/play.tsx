import React, { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { DevScreen, DevSection } from '@/components/dev/DevSection';
import CreateRoom from '@/components/play/CreateRoom';
import FiltersStep from '@/components/play/FiltersStep';
import ModeChoice from '@/components/play/ModeChoice';
import PlayStart from '@/components/play/PlayStart';
import SoloAllowanceNote from '@/components/play/SoloAllowanceNote';
import ProLockButton from '@/components/pro/ProLockButton';
import ProLockCaption from '@/components/pro/ProLockCaption';
import { Text } from '@/components/ui/text';
import {
  SAMPLE_FILTER_OPTIONS,
  SAMPLE_FILTERS,
  sampleAllowance,
} from '@/lib/dev/samples';
import { allowanceLine, isSoloCapped } from '@/lib/solo-allowance';
import type { Filters } from '@/types/filters';
import type { ModeOption } from '@/types/play';
import type { ProAccess } from '@/types/pro';

const ACCESS_SAMPLES: { access: ProAccess; label: string }[] = [
  { access: 'open', label: 'Open: Pro, or the switch off' },
  { access: 'locked', label: 'Locked: Free with the switch on' },
  { access: 'pending', label: 'Pending: the session loading' },
];

const ALLOWANCE_SAMPLES = [
  { used: 2, label: 'Free, 3 left' },
  { used: 5, label: 'Free, 0 left' },
];

type CaptionProps = { label: string };

const Caption = ({ label }: CaptionProps) => {
  return <Text className="text-12 text-fg-muted">{label}</Text>;
};

type ModeSampleProps = { access: ProAccess };

const ModeSample = ({ access }: ModeSampleProps) => {
  const [option, setOption] = useState<ModeOption | null>(null);
  return (
    <ModeChoice option={option} onChange={setOption} practiceAccess={access} />
  );
};

type AllowanceSampleProps = { used: number };

const AllowanceSample = ({ used }: AllowanceSampleProps) => {
  const [now] = useState(() => Date.now());
  const allowance = sampleAllowance(used, now);
  return (
    <SoloAllowanceNote
      line={allowanceLine(allowance) ?? ''}
      isCapped={isSoloCapped(allowance)}
      onPlayDuel={() => {}}
    />
  );
};

type FiltersSampleProps = { state: 'panel' | 'loading' | 'error' };

// Step 2 on the static catalog, as each of its three states
const FiltersSample = ({ state }: FiltersSampleProps) => {
  const [filters, setFilters] = useState<Filters>(SAMPLE_FILTERS);
  const isPanel = state === 'panel';
  return (
    <FiltersStep
      filters={isPanel ? filters : null}
      options={isPanel ? SAMPLE_FILTER_OPTIONS : null}
      onChange={setFilters}
      error={state === 'error' ? new Error('sample') : null}
      onRetry={() => {}}
      onBack={() => {}}
      onNext={() => {}}
      isHeadingFocused={false}
    />
  );
};

const FILTER_SAMPLES: { state: FiltersSampleProps['state']; title: string }[] =
  [
    { state: 'panel', title: 'Filters' },
    { state: 'loading', title: 'Filters, loading' },
    { state: 'error', title: 'Filters, failed' },
  ];

type StartSampleProps = { used: number };

// Start over the allowance line; at the cap it's disabled
const StartSample = ({ used }: StartSampleProps) => {
  const [now] = useState(() => Date.now());
  const allowance = sampleAllowance(used, now);
  const isCapped = isSoloCapped(allowance);
  return (
    <PlayStart
      mode="solo"
      href={{ pathname: '/play/solo' }}
      isCapped={isCapped}
    >
      <SoloAllowanceNote
        line={allowanceLine(allowance) ?? ''}
        isCapped={isCapped}
        onPlayDuel={() => {}}
      />
    </PlayStart>
  );
};

type Props = {};

// The web's ProPreview pieces for /play; the switch is off locally
const PlayDevScreen = ({}: Props) => {
  const { section } = useLocalSearchParams<{ section?: string }>();

  return (
    <DevScreen title="Play setup">
      <DevSection id="mode" title="Mode cards" only={section}>
        {ACCESS_SAMPLES.map(({ access, label }) => (
          <View key={access} className="gap-2">
            <Caption label={label} />
            <ModeSample access={access} />
          </View>
        ))}
      </DevSection>
      <DevSection id="allowance" title="Solo allowance" only={section}>
        {ALLOWANCE_SAMPLES.map(({ used, label }) => (
          <View key={used} className="gap-2">
            <Caption label={label} />
            <AllowanceSample used={used} />
          </View>
        ))}
      </DevSection>
      {FILTER_SAMPLES.map(({ state, title }) => (
        <DevSection key={state} id={state} title={title} only={section}>
          <FiltersSample state={state} />
        </DevSection>
      ))}
      <DevSection id="start" title="Start" only={section}>
        {ALLOWANCE_SAMPLES.map(({ used, label }) => (
          <View key={used} className="gap-2">
            <Caption label={label} />
            <StartSample used={used} />
          </View>
        ))}
      </DevSection>
      <DevSection id="room" title="Create room" only={section}>
        {ACCESS_SAMPLES.map(({ access, label }) => (
          <View key={access} className="gap-2">
            <Caption label={label} />
            <CreateRoom
              room={{
                hostAccess: access,
                canCreate: true,
                isBusy: false,
                error: null,
                create: () => {},
              }}
            />
          </View>
        ))}
      </DevSection>
      <DevSection id="lock" title="Pro lock" only={section}>
        <View className="gap-2">
          <Caption label="Locked button, default and large" />
          <ProLockButton label="Create room" />
          <ProLockButton label="Create room" size="large" />
        </View>
        <View className="gap-2">
          <Caption label="Caption with See Pro" />
          <ProLockCaption caption="Pro hosts rooms. Anyone can join." />
        </View>
      </DevSection>
    </DevScreen>
  );
};

export default PlayDevScreen;
