import type { ViewStyle } from 'react-native';
import { ROLES, SHADOW_OFFSET } from '@/styles/tokens';

// NativeWind doesn't map shadows to boxShadow, so they're style values
function hardShadow(offset: number): ViewStyle {
  return {
    boxShadow: [
      {
        offsetX: offset,
        offsetY: offset,
        blurRadius: 0,
        spreadDistance: 0,
        color: ROLES.line,
      },
    ],
  };
}

export const SHADOW_HARD = hardShadow(SHADOW_OFFSET.hard);

export const SHADOW_HARD_SM = hardShadow(SHADOW_OFFSET['hard-sm']);
