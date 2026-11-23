import { setApiClient } from '@/lib/api/client';
import { apiUrl } from '@/lib/api/config';
import { setDuelClient } from '@/lib/api/duel-client';
import { createHttpApiClient } from '@/lib/api/http/api-client';
import { configureTokenPersistence } from '@/lib/api/http/token-store';
import { SECURE_TOKEN_PERSISTENCE } from '@/lib/api/http/secure-token-persistence';
import { createSocketDuelClient } from '@/lib/api/socket/duel-client';

let isRegistered = false;

// Real only: no mock adapter on mobile, for REST or the duel
export function registerApiClient(): void {
  if (isRegistered) return;
  configureTokenPersistence(SECURE_TOKEN_PERSISTENCE);
  const baseUrl = apiUrl();
  const api = createHttpApiClient(baseUrl);
  setApiClient(api);
  setDuelClient(
    createSocketDuelClient(baseUrl, () => api.auth.getGatewayToken()),
  );
  isRegistered = true;
}
