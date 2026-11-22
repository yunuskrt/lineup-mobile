import React, { useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { DevScreen, DevSection } from '@/components/dev/DevSection';
import ModeChoice from '@/components/play/ModeChoice';
import SoloAllowanceNote from '@/components/play/SoloAllowanceNote';
import ProLockButton from '@/components/pro/ProLockButton';
import ProLockCaption from '@/components/pro/ProLockCaption';
import { Text } from '@/components/ui/text';
import { sampleAllowance } from '@/lib/dev/samples';
import { allowanceLine, isSoloCapped } from '@/lib/solo-allowance';
import type { ModeOption } from '@/types/play';
import type { ProAccess } from '@/types/pro';

const ACCESS_SAMPLES: { access: ProAccess; label: string }[] = [
  { access: 'open', label: 'Open: Pro, or the switch off' },
  { access: 'locked', label: 'Locked: Free with the switch on' },
  { access: 'pending', label: 'Pending: the session loading' },
];

const ALLOWANCE_SAMPLES = [
  { used: 2, label: 'Free, 3 left' },
  { used: 5, label: 'Free, 0 left: Start disabled in M13c' },
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
