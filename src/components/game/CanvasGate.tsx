import React, { type ReactNode, useEffect } from 'react';
import { Keyboard, View } from 'react-native';
import GatePanel from '@/components/game/canvas-gate/GatePanel';
import type { GateSize } from '@/types/canvas-gate';

type Props = {
  isOpen: boolean;
  // Decorative, above the title
  icon?: ReactNode;
  title: string;
  // May tick; the title is what gets read out
  detail?: ReactNode;
  // Content beyond one action, under the detail
  body?: ReactNode;
  action?: ReactNode;
  size?: GateSize;
  children: ReactNode;
};

// A scrim and a panel over the board, which takes nothing while it's up
const CanvasGate = ({
  isOpen,
  icon,
  title,
  detail,
  body,
  action,
  size = 'narrow',
  children,
}: Props) => {
  useEffect(() => {
    if (isOpen) Keyboard.dismiss();
  }, [isOpen]);

  return (
    <View className="flex-1">
      <View
        pointerEvents={isOpen ? 'none' : 'auto'}
        accessibilityElementsHidden={isOpen}
        importantForAccessibility={isOpen ? 'no-hide-descendants' : 'auto'}
        className="flex-1"
      >
        {children}
      </View>
      {isOpen ? (
        <GatePanel
          icon={icon}
          title={title}
          detail={detail}
          body={body}
          action={action}
          size={size}
        />
      ) : null}
    </View>
  );
};

export default CanvasGate;
