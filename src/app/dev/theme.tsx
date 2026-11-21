import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import { DevScreen, DevSection } from '@/components/dev/DevSection';
import {
  SECTION_LABEL,
  TABULAR_NUMS,
  TYPE_CARD_TITLE,
  TYPE_DISPLAY,
  TYPE_NUMBER,
  TYPE_ROOM_CODE,
  TYPE_SECTION,
  TYPE_STICKER,
  TYPE_TITLE,
  TYPE_TITLE_LONG,
} from '@/styles/classes';
import { SHADOW_HARD, SHADOW_HARD_SM } from '@/styles/shadow';
import { FONT_FAMILIES, PALETTE, ROLES, SPACING_UNIT } from '@/styles/tokens';

const TYPE_ROLES = [
  { name: 'TYPE_DISPLAY', className: TYPE_DISPLAY, sample: 'Know the XI.' },
  { name: 'TYPE_TITLE', className: TYPE_TITLE, sample: 'Run ended' },
  { name: 'TYPE_SECTION', className: TYPE_SECTION, sample: 'Named in order' },
  { name: 'TYPE_CARD_TITLE', className: TYPE_CARD_TITLE, sample: 'Play' },
  {
    name: 'TYPE_TITLE_LONG',
    className: TYPE_TITLE_LONG,
    sample: 'Hosting a room needs Pro',
  },
  { name: 'TYPE_ROOM_CODE', className: TYPE_ROOM_CODE, sample: 'K7QM2X' },
  { name: 'TYPE_STICKER', className: TYPE_STICKER, sample: 'Your turn' },
  { name: 'SECTION_LABEL', className: SECTION_LABEL, sample: 'Lives' },
];

// Written out: NativeWind only builds classes it can read in full
const FACE_CLASSES: Record<keyof typeof FONT_FAMILIES, string> = {
  body: 'font-body',
  'body-medium': 'font-body-medium',
  'body-semibold': 'font-body-semibold',
  display: 'font-display',
  'display-black': 'font-display-black',
  'display-bold': 'font-display-bold',
};

const SPACING_STEPS = [1, 2, 3, 4, 6, 8, 12, 16];

const RADIUS_CLASSES = [
  'rounded-sm',
  'rounded-md',
  'rounded-lg',
  'rounded-full',
];

type SwatchProps = { name: string; hex: string };

const Swatch = ({ name, hex }: SwatchProps) => {
  return (
    <View className="flex-row items-center gap-3">
      {/* A value known only at run time: the token being shown */}
      <View
        className="h-10 w-10 rounded-sm border-2 border-line"
        style={{ backgroundColor: hex }}
      />
      <View>
        <Text className="font-body-medium text-14 text-fg">{name}</Text>
        <Text className="font-body text-12 text-fg-muted">{hex}</Text>
      </View>
    </View>
  );
};

type Props = {};

const ThemeScreen = ({}: Props) => {
  const { section } = useLocalSearchParams<{ section?: string }>();
  return (
    <DevScreen title="Theme">
      <DevSection id="primitives" title="Primitives" only={section}>
        {Object.entries(PALETTE).map(([name, hex]) => (
          <Swatch key={name} name={name} hex={hex} />
        ))}
      </DevSection>

      <DevSection id="roles" title="Roles" only={section}>
        {Object.entries(ROLES).map(([name, hex]) => (
          <Swatch key={name} name={name} hex={hex} />
        ))}
      </DevSection>

      <DevSection id="type-roles" title="Type roles" only={section}>
        {TYPE_ROLES.map((role) => (
          <View key={role.name} className="gap-1">
            <Text className={SECTION_LABEL}>{role.name}</Text>
            <Text className={`${role.className} text-fg`}>{role.sample}</Text>
          </View>
        ))}
        <View className="gap-1">
          <Text className={SECTION_LABEL}>TYPE_NUMBER</Text>
          {/* Archivo's tnum through fontVariant, NativeWind can't */}
          <Text
            className={`${TYPE_NUMBER} text-64 text-fg`}
            style={TABULAR_NUMS}
          >
            07 10 15
          </Text>
        </View>
      </DevSection>

      <DevSection id="shadow" title="Outline and shadow" only={section}>
        {/* boxShadow: NativeWind can't express a hard shadow */}
        <View
          className="rounded-md border-2 border-line bg-surface-card p-4"
          style={SHADOW_HARD}
        >
          <Text className="font-body-semibold text-14 text-fg">
            shadow-hard · 4/4
          </Text>
        </View>
        {/* boxShadow: NativeWind can't express a hard shadow */}
        <View
          className="rounded-md border-2 border-line bg-block-butter p-4"
          style={SHADOW_HARD_SM}
        >
          <Text className="font-body-semibold text-14 text-fg">
            shadow-hard-sm · 2/2
          </Text>
        </View>
      </DevSection>

      <DevSection id="type" title="Type" only={section}>
        {Object.entries(FACE_CLASSES).map(([name, className]) => (
          <View key={name} className="gap-1">
            <Text className={SECTION_LABEL}>
              {name} · {FONT_FAMILIES[name as keyof typeof FONT_FAMILIES]}
            </Text>
            <Text className={`${className} text-20 text-fg`}>
              Know the XI 0123456789 İŞĞ
            </Text>
          </View>
        ))}
      </DevSection>

      <DevSection id="spacing" title="Spacing" only={section}>
        {SPACING_STEPS.map((step) => (
          <View key={step} className="flex-row items-center gap-3">
            <Text className="w-16 font-body text-12 text-fg-muted">
              {step} · {step * SPACING_UNIT}pt
            </Text>
            {/* A value known only at run time: the step being shown */}
            <View
              className="h-4 border-2 border-line bg-brand"
              style={{ width: step * SPACING_UNIT }}
            />
          </View>
        ))}
      </DevSection>

      <DevSection id="radius" title="Radius" only={section}>
        <View className="flex-row gap-4">
          {RADIUS_CLASSES.map((className) => (
            <View key={className} className="items-center gap-2">
              <View
                className={`h-14 w-14 border-2 border-line bg-block-mint ${className}`}
              />
              <Text className="font-body text-12 text-fg-muted">
                {className}
              </Text>
            </View>
          ))}
        </View>
      </DevSection>
    </DevScreen>
  );
};

export default ThemeScreen;
