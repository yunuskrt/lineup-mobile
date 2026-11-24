import type { StoreConfig, StoreLink } from '@/types/store-link';

// The app config's store pages; iOS has none until the listing
export function storeLinkOf(
  os: string,
  config: StoreConfig | null | undefined,
): StoreLink {
  if (os === 'ios') {
    return {
      line: 'Get the latest version from the App Store.',
      url: config?.ios?.appStoreUrl ?? null,
    };
  }
  return {
    line: 'Get the latest version from Google Play.',
    url: config?.android?.playStoreUrl ?? null,
  };
}
