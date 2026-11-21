export type QuitDialogCopy = {
  title: string;
  detail: string;
  confirmLabel: string;
  pendingLabel: string;
  // The safe choice; Keep playing when unset
  dismissLabel?: string;
};
