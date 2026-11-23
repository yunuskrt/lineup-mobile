import { type Href, router } from 'expo-router';
import { useEnsureSession } from '@/hooks/use-auth';

// A guest is made first; go reports false if that failed
export function useStartNavigation() {
  const ensureSession = useEnsureSession();

  async function go(href: Href): Promise<boolean> {
    try {
      await ensureSession.mutateAsync();
      router.push(href);
      return true;
    } catch {
      return false;
    }
  }

  return {
    go,
    isBusy: ensureSession.isPending,
    error: ensureSession.error,
  };
}
