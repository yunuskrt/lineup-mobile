import { appConfigSchema } from '@/lib/api/schemas/config';
import { apiResultSchema } from '@/lib/api/schemas/result';

// Off only when the server says so; unknown is not off
export function isSwitchOffIn(body: unknown): boolean {
  const parsed = apiResultSchema(appConfigSchema).safeParse(body);
  return parsed.success && parsed.data.success && !parsed.data.data.proEnabled;
}
