import React, { type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react-native';
import { Empty } from '@/components/ui/empty';

export type StateNoticeTone = 'error' | 'empty' | 'info';

const TILE: Record<StateNoticeTone, string> = {
  error: 'bg-block-coral',
  empty: 'bg-block-butter',
  info: 'bg-block-mint',
};

type Props = {
  tone: StateNoticeTone;
  icon: LucideIcon;
  message: ReactNode;
  title?: string;
  // Inline under a list: smaller box and tile
  isCompact?: boolean;
  children?: ReactNode;
};

// Empty and error states: icon tile, words, action
const StateNotice = ({
  tone,
  icon,
  message,
  title,
  isCompact = false,
  children,
}: Props) => {
  return (
    <Empty
      icon={icon}
      message={message}
      title={title}
      tileClassName={TILE[tone]}
      isCompact={isCompact}
      isAlert={tone === 'error'}
    >
      {children}
    </Empty>
  );
};

export default StateNotice;
