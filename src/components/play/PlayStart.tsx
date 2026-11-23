import React, { type ReactNode, useState } from 'react';
import { View } from 'react-native';
import type { Href } from 'expo-router';
import StartError from '@/components/play/StartError';
import { STEP_ACTIONS } from '@/components/play/styles';
import { Button } from '@/components/ui/button';
import type { ButtonSize } from '@/components/ui/styles';
import { Dialog } from '@/components/ui/dialog';
import { useStartNavigation } from '@/hooks/use-start-navigation';
import type { PlayMode } from '@/types/play';
import type { QuitDialogCopy } from '@/types/quit-dialog';

type Props = {
  mode: PlayMode;
  // Null while the filters load
  href: Href | null;
  // Solo at its daily cap; the server still refuses
  isCapped?: boolean;
  // Under the button, such as the runs-left line
  children?: ReactNode;
  // Replaces the mode's label, as Start practice
  label?: string;
  // Asked at the press: a reason to confirm first
  warningFor?: () => QuitDialogCopy | null;
  // Before and after Start in its row: Back, or Create room
  leading?: ReactNode;
  trailing?: ReactNode;
  // Default when Start shares its row with Create room
  size?: ButtonSize;
};

const START_LABELS: Record<PlayMode, string> = {
  solo: 'Start solo run',
  duel: 'Find an opponent',
};

const PlayStart = ({
  mode,
  href,
  isCapped = false,
  children,
  label,
  warningFor,
  leading,
  trailing,
  size = 'large',
}: Props) => {
  const { go, isBusy, error } = useStartNavigation();
  const [warning, setWarning] = useState<QuitDialogCopy | null>(null);

  // The screen stays under the game, so the dialog closes either way
  async function start() {
    if (!href || isCapped) return;
    await go(href);
    setWarning(null);
  }

  function handlePress() {
    const next = warningFor?.() ?? null;
    if (next) setWarning(next);
    else void start();
  }

  return (
    <View className="gap-3">
      <View className={STEP_ACTIONS}>
        {leading}
        <View className="flex-1">
          <Button
            label={isBusy ? 'Starting…' : (label ?? START_LABELS[mode])}
            size={size}
            isDisabled={!href || isBusy || isCapped}
            onPress={handlePress}
          />
        </View>
        {trailing}
      </View>
      {children}
      <StartError error={error} isBusy={isBusy} />
      {warning ? (
        <Dialog
          isOpen
          title={warning.title}
          message={warning.detail}
          onCancel={() => setWarning(null)}
        >
          <Button
            label={warning.dismissLabel ?? 'Keep playing'}
            onPress={() => setWarning(null)}
          />
          <Button
            label={isBusy ? warning.pendingLabel : warning.confirmLabel}
            variant="secondary"
            isDisabled={isBusy}
            onPress={() => void start()}
          />
        </Dialog>
      ) : null}
    </View>
  );
};

export default PlayStart;
