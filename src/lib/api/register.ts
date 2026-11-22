import { setApiClient } from '@/lib/api/client';
import { apiUrl } from '@/lib/api/config';
import { createHttpApiClient } from '@/lib/api/http/api-client';
import { configureTokenPersistence } from '@/lib/api/http/token-store';
import { SECURE_TOKEN_PERSISTENCE } from '@/lib/api/http/secure-token-persistence';

let isRegistered = false;

// Real only: no mock adapter on mobile. The duel client joins in M16
export function registerApiClient(): void {
  if (isRegistered) return;
  configureTokenPersistence(SECURE_TOKEN_PERSISTENCE);
  setApiClient(createHttpApiClient(apiUrl()));
  isRegistered = true;
}
