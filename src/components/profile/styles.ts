import { cn } from '@/lib/utils';
import { TYPE_NUMBER } from '@/styles/classes';

// A ruled section of the column, as the web's BOARD_SECTION
export const PROFILE_SECTION = 'gap-4 border-t-2 border-line pt-6';

// The record and stats section of the column
export const PROFILE_FIGURES = cn(PROFILE_SECTION, 'gap-6');

// The record: the screen's one lavender block
export const RECORD_BLOCK = 'gap-6 border-2 border-line bg-block-lavender p-4';

export const RECORD_HEADER =
  'flex-row items-baseline justify-between gap-4 border-b-2 border-line pb-3';

export const RECORD_NUMERAL = cn(TYPE_NUMBER, 'text-40 leading-10');

export const RECORD_BAR =
  'h-4 flex-row gap-0.5 overflow-hidden rounded-full border-2 border-line';

// W / D / L beside each label, as profile/03-record-b
export const LETTER_TILE =
  'h-5 w-5 items-center justify-center overflow-hidden rounded-sm border-2 border-line';

export const LETTER = 'font-display-black text-12 leading-3 text-on-accent';

// Four stats in a 2 × 2 grid split by ink rules
export const STATS_BLOCK =
  'overflow-hidden rounded-lg border-2 border-line bg-surface-card';

export const STAT_ROW = 'flex-row';

export const STAT_TILE = 'min-w-0 flex-1 justify-center gap-1 p-4';

export const STAT_LABEL = 'font-body-medium text-12 text-fg-muted uppercase';

export const STAT_VALUE = cn(TYPE_NUMBER, 'text-28 leading-7');

// One white list in ink, quiet rules between its rows
export const HISTORY_LIST =
  'overflow-hidden rounded-lg border-2 border-line bg-surface-card';

// Two lines, as the web's phone row
export const HISTORY_ROW = 'min-h-18 justify-center gap-1 px-3 py-3';

export const HISTORY_LINE = 'flex-row items-center gap-3';
