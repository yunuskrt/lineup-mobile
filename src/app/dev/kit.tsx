import React, { type ReactNode, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Play, Plus, Search, Swords, Target } from 'lucide-react-native';
import { DevScreen, DevSection } from '@/components/dev/DevSection';
import { SurfaceSections } from '@/components/dev/KitSurfaces';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChoiceTile } from '@/components/ui/choice-tile';
import { FilterChip } from '@/components/ui/filter-chip';
import { IconTile } from '@/components/ui/icon-tile';
import { Input } from '@/components/ui/input';
import { ShadowBox } from '@/components/ui/shadow-box';
import type { BadgeTone } from '@/components/ui/styles';
import { Text } from '@/components/ui/text';
import { useEntrance } from '@/hooks/use-entrance';
import { SECTION_LABEL, TYPE_CARD_TITLE } from '@/styles/classes';

const TAG_TONES: BadgeTone[] = [
  'neutral',
  'green',
  'amber',
  'red',
  'blue',
  'purple',
  'yellow',
  'grey',
];

const STICKER_TONES: BadgeTone[] = [
  'brand',
  'you',
  'opponent',
  'found',
  'warning',
  'mint',
  'butter',
  'coral',
];

const CHIPS = ['Premier League', 'La Liga', 'Champions League', 'Euro'];

type LabelledProps = { label: string; children: ReactNode };

const Labelled = ({ label, children }: LabelledProps) => {
  return (
    <View className="gap-2">
      <Text className={SECTION_LABEL}>{label}</Text>
      {children}
    </View>
  );
};

type ModeTileProps = { title: string; line: string };

const ModeTile = ({ title, line }: ModeTileProps) => {
  return (
    <View className="flex-row items-center gap-3">
      <IconTile icon={Target} className="bg-block-butter" />
      <View className="flex-1">
        <Text className={TYPE_CARD_TITLE}>{title}</Text>
        <Text className="text-14 text-fg-muted">{line}</Text>
      </View>
    </View>
  );
};

type EntranceDemoProps = {};

const EntranceDemo = ({}: EntranceDemoProps) => {
  const entrance = useEntrance();
  const [round, setRound] = useState(0);
  return (
    <View className="gap-3">
      <View key={round} className="gap-3">
        {['Know the XI.', 'Guess the Squad.', 'Beat the clock.'].map(
          (line, index) => (
            <Animated.View key={line} entering={entrance.item(index)}>
              <ShadowBox className="border-2 border-line bg-surface-card p-3">
                <Text className="font-body-medium">{line}</Text>
              </ShadowBox>
            </Animated.View>
          ),
        )}
      </View>
      <Button
        label="Replay"
        variant="secondary"
        onPress={() => setRound((value) => value + 1)}
      />
    </View>
  );
};

type Props = {};

const KitScreen = ({}: Props) => {
  const { section } = useLocalSearchParams<{ section?: string }>();
  const [chips, setChips] = useState<string[]>(['Premier League']);
  const [isChecked, setIsChecked] = useState(true);
  const [isOtherChecked, setIsOtherChecked] = useState(false);
  const [name, setName] = useState('');
  const [picked, setPicked] = useState('solo');

  const toggleChip = (chip: string) =>
    setChips((current) =>
      current.includes(chip)
        ? current.filter((value) => value !== chip)
        : [...current, chip],
    );

  return (
    <DevScreen title="Kit">
      <DevSection id="text" title="Text" only={section}>
        <Text>The kit’s Text: Inter, 16 over 24, in ink.</Text>
        <Text className="text-14 text-fg-muted">
          Overridden: 14, muted. İbrahimović, Şükür, Ğ.
        </Text>
      </DevSection>

      <DevSection id="buttons" title="Buttons" only={section}>
        <Labelled label="Primary · secondary">
          <View className="flex-row flex-wrap gap-4">
            <Button label="Start" />
            <Button label="Change filters" variant="secondary" />
          </View>
        </Labelled>
        <Labelled label="Large">
          <Button label="Play a duel" size="large" icon={Swords} />
        </Labelled>
        <Labelled label="Icon">
          <View className="flex-row gap-4">
            <Button icon={Plus} size="icon" accessibilityLabel="Add" />
            <Button
              icon={Search}
              size="icon"
              variant="secondary"
              accessibilityLabel="Search"
            />
          </View>
        </Labelled>
        <Labelled label="Pressed (preview)">
          <View className="flex-row flex-wrap gap-4">
            <Button label="Start" isPressedPreview />
            <Button
              label="Change filters"
              variant="secondary"
              isPressedPreview
            />
          </View>
        </Labelled>
        <Labelled label="Disabled · busy">
          <View className="flex-row flex-wrap gap-4">
            <Button label="Start" isDisabled />
            <Button label="Back" variant="secondary" isDisabled />
            <Button label="Starting" isBusy />
          </View>
        </Labelled>
      </DevSection>

      <DevSection id="tiles" title="Tiles" only={section}>
        <ChoiceTile
          isSelected={picked === 'solo'}
          onPress={() => setPicked('solo')}
        >
          <ModeTile title="Solo" line="Name the XI alone" />
        </ChoiceTile>
        <ChoiceTile
          isSelected={picked === 'duel'}
          onPress={() => setPicked('duel')}
        >
          <ModeTile title="Duel" line="Take turns against a player" />
        </ChoiceTile>
        <Labelled label="Pressed (preview) · busy">
          <View className="gap-4">
            <ChoiceTile isPressedPreview>
              <ModeTile title="Practice" line="No clock, no lives" />
            </ChoiceTile>
            <ChoiceTile isBusy>
              <ModeTile title="Practice" line="Busy: flat, label kept" />
            </ChoiceTile>
          </View>
        </Labelled>
        <Labelled label="Icon tiles">
          <View className="flex-row gap-4">
            <IconTile icon={Play} />
            <IconTile icon={Target} className="bg-block-butter" />
            <IconTile icon={Swords} size="lg" className="bg-block-mint" />
          </View>
        </Labelled>
      </DevSection>

      <DevSection id="badges" title="Badges" only={section}>
        <Labelled label="Tags">
          <View className="flex-row flex-wrap gap-2">
            {TAG_TONES.map((tone) => (
              <Badge key={tone} label={tone} tone={tone} />
            ))}
          </View>
        </Labelled>
        <Labelled label="Stickers">
          <View className="flex-row flex-wrap gap-4">
            {STICKER_TONES.map((tone) => (
              <Badge key={tone} label={tone} tone={tone} variant="sticker" />
            ))}
          </View>
        </Labelled>
        <Labelled label="Tilt: left · right · none">
          <View className="flex-row gap-4">
            <Badge label="Your turn" tone="you" variant="sticker" />
            <Badge label="Pro" tone="butter" variant="sticker" tilt="right" />
            <Badge label="Found" tone="found" variant="sticker" tilt="none" />
          </View>
        </Labelled>
      </DevSection>

      <DevSection id="chips" title="Filter chips" only={section}>
        <View className="flex-row flex-wrap gap-3">
          {CHIPS.map((chip) => (
            <FilterChip
              key={chip}
              label={chip}
              isOn={chips.includes(chip)}
              onPress={() => toggleChip(chip)}
            />
          ))}
          <FilterChip
            label="Disabled"
            isOn={false}
            onPress={() => {}}
            isDisabled
          />
        </View>
      </DevSection>

      <DevSection id="inputs" title="Inputs" only={section}>
        <Labelled label="Empty (tap to focus)">
          <Input
            placeholder="Your handle"
            value={name}
            onChangeText={setName}
          />
        </Labelled>
        <Labelled label="Invalid">
          <Input value="ab" isInvalid />
        </Labelled>
        <Labelled label="Read-only">
          <Input value="guest@lineup.gg" editable={false} />
        </Labelled>
      </DevSection>

      <DevSection id="checkboxes" title="Checkboxes" only={section}>
        <Checkbox
          label="Premier League"
          isChecked={isChecked}
          onChange={setIsChecked}
        />
        <Checkbox
          label="La Liga"
          isChecked={isOtherChecked}
          onChange={setIsOtherChecked}
        />
        <Checkbox
          label="Disabled"
          isChecked={false}
          onChange={() => {}}
          isDisabled
        />
      </DevSection>

      <DevSection id="shadow" title="Shadow box" only={section}>
        <ShadowBox className="border-2 border-line bg-surface-card p-4">
          <Text className="font-body-semibold text-14">ShadowBox · hard</Text>
        </ShadowBox>
        <ShadowBox
          depth="hard-sm"
          className="border-2 border-line bg-block-butter p-4"
        >
          <Text className="font-body-semibold text-14">
            ShadowBox · hard-sm
          </Text>
        </ShadowBox>
        <ShadowBox
          isPlatePreview
          className="border-2 border-line bg-block-mint p-4"
        >
          <Text className="font-body-semibold text-14">
            Plate fallback (Android 7 and 8)
          </Text>
        </ShadowBox>
      </DevSection>

      <DevSection id="entrance" title="Entrance" only={section}>
        <EntranceDemo />
      </DevSection>

      <SurfaceSections only={section} />
    </DevScreen>
  );
};

export default KitScreen;
