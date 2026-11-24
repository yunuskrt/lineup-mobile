import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Linking,
  Platform,
  View,
  type ViewInstance,
} from 'react-native';
import Constants from 'expo-constants';
import { RefreshCw, TriangleAlert } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ShadowBox } from '@/components/ui/shadow-box';
import { ICON_TILE } from '@/components/ui/styles';
import { Text } from '@/components/ui/text';
import { storeLinkOf } from '@/lib/store-link';
import { cn } from '@/lib/utils';
import { TYPE_TITLE_LONG } from '@/styles/classes';
import { ROLES } from '@/styles/tokens';

export const UPDATE_REQUIRED_COPY = {
  title: 'Update Lineup to keep playing',
  detail: 'This version is out of date, so the duel server turned it away.',
  update: 'Update',
  back: 'Back to play',
  failed: 'Couldn’t open the store.',
} as const;

// Long enough for the screen to be up first
const FOCUS_DELAY_MS = 100;

type Props = { onBack: () => void };

// A page, not a gate: there is no duel to show
const UpdateRequired = ({ onBack }: Props) => {
  const insets = useSafeAreaInsets();
  const titleRef = useRef<ViewInstance>(null);
  const [hasFailed, setHasFailed] = useState(false);
  const { line, url } = storeLinkOf(Platform.OS, Constants.expoConfig);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (titleRef.current) {
        AccessibilityInfo.sendAccessibilityEvent(titleRef.current, 'focus');
      }
    }, FOCUS_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  async function openStore(storeUrl: string) {
    setHasFailed(false);
    try {
      await Linking.openURL(storeUrl);
    } catch {
      setHasFailed(true);
    }
  }

  return (
    <View
      className="flex-1 justify-center gap-6 bg-surface px-4"
      // The safe areas are known only at run time
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="items-center gap-4">
        <ShadowBox
          depth="hard-sm"
          className={cn(ICON_TILE, 'h-12 w-12 bg-block-butter')}
        >
          <RefreshCw size={24} strokeWidth={2.25} color={ROLES['on-accent']} />
        </ShadowBox>
        <View ref={titleRef} accessible accessibilityRole="header">
          <Text className={cn(TYPE_TITLE_LONG, 'text-center')}>
            {UPDATE_REQUIRED_COPY.title}
          </Text>
        </View>
        <Text className="text-center text-16 text-fg-muted">
          {UPDATE_REQUIRED_COPY.detail} {line}
        </Text>
      </View>
      {hasFailed ? (
        <Alert icon={TriangleAlert}>{UPDATE_REQUIRED_COPY.failed}</Alert>
      ) : null}
      <View className="gap-3">
        {url ? (
          <Button
            label={UPDATE_REQUIRED_COPY.update}
            size="large"
            onPress={() => void openStore(url)}
          />
        ) : null}
        <Button
          label={UPDATE_REQUIRED_COPY.back}
          variant="secondary"
          size="large"
          onPress={onBack}
        />
      </View>
    </View>
  );
};

export default UpdateRequired;
