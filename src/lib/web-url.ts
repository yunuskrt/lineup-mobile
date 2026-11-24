import { webUrlOf } from '@/lib/room-share';

// Read whole: Expo inlines EXPO_PUBLIC_ variables only this way
export const WEB_URL = webUrlOf(process.env.EXPO_PUBLIC_WEB_URL);
