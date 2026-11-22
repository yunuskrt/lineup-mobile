import * as SecureStore from 'expo-secure-store';
import type { TokenPersistence } from '@/lib/api/http/token-store';

const TOKEN_KEY = 'lineup.session-token';

// The session token lives in the device keychain and nowhere else
export const SECURE_TOKEN_PERSISTENCE: TokenPersistence = {
  read: () => SecureStore.getItemAsync(TOKEN_KEY),
  write: (token) => SecureStore.setItemAsync(TOKEN_KEY, token),
  remove: () => SecureStore.deleteItemAsync(TOKEN_KEY),
};
