import type { TextStyle } from 'react-native';

// A face stands in for the web's font-stretch: one family per width
export const TYPE_DISPLAY = 'font-display text-34';

export const TYPE_TITLE = 'font-display text-30';

export const TYPE_SECTION = 'font-display text-24';

export const TYPE_CARD_TITLE = 'font-display text-20';

// Titles over ~20 characters
export const TYPE_TITLE_LONG = 'font-display-bold text-20';

// Pair with TABULAR_NUMS; the size is set where it's used
export const TYPE_NUMBER = 'font-display-black';

// The 6-character code; its alphabet has no look-alikes
export const TYPE_ROOM_CODE = 'font-display text-20';

export const TYPE_STICKER = 'font-display text-12 uppercase';

// The rail's label look, as the Lives section
export const SECTION_LABEL = 'font-body-medium text-12 text-fg-muted uppercase';

// NativeWind's tabular-nums is web only; fontVariant reaches tnum
export const TABULAR_NUMS: TextStyle = { fontVariant: ['tabular-nums'] };
