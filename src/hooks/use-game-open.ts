import { useEffect } from 'react';
import { markGameOpen } from '@/lib/pending-room';

// While a game screen is mounted, room links wait instead of navigating
export function useGameOpen(): void {
  useEffect(() => markGameOpen(), []);
}
