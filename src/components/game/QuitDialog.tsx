import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import type { QuitDialogCopy } from '@/types/quit-dialog';

export const SOLO_QUIT_COPY: QuitDialogCopy = {
  title: 'Quit this run?',
  detail:
    'Your run ends here and counts as played. The clock keeps running while you decide.',
  confirmLabel: 'Quit run',
  pendingLabel: 'Quitting…',
};

export const DUEL_FORFEIT_COPY: QuitDialogCopy = {
  title: 'Forfeit this duel?',
  detail:
    'Leaving counts as a loss. Your clock keeps running while you decide.',
  confirmLabel: 'Forfeit',
  pendingLabel: 'Forfeiting…',
};

type Props = {
  isOpen: boolean;
  isQuitting: boolean;
  copy?: QuitDialogCopy;
  onDismiss: () => void;
  onConfirm: () => void;
};

// The safe choice first; Back or a tap on the scrim keeps playing
const QuitDialog = ({
  isOpen,
  isQuitting,
  copy = SOLO_QUIT_COPY,
  onDismiss,
  onConfirm,
}: Props) => {
  return (
    <Dialog
      isOpen={isOpen}
      title={copy.title}
      message={copy.detail}
      onCancel={() => {
        if (!isQuitting) onDismiss();
      }}
    >
      <Button
        label={copy.dismissLabel ?? 'Keep playing'}
        isDisabled={isQuitting}
        onPress={onDismiss}
      />
      <Button
        label={isQuitting ? copy.pendingLabel : copy.confirmLabel}
        variant="secondary"
        isDisabled={isQuitting}
        onPress={onConfirm}
      />
    </Dialog>
  );
};

export default QuitDialog;
