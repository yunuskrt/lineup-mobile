import { describe, expect, it } from 'vitest';
import { storeLinkOf } from '@/lib/store-link';

const APP_STORE = 'https://apps.apple.com/app/id123';
const PLAY = 'https://play.google.com/store/apps/details?id=gg.lineup.app';

const CONFIG = {
  ios: { appStoreUrl: APP_STORE },
  android: { playStoreUrl: PLAY },
};

describe('storeLinkOf', () => {
  it('names the App Store and links its page on iOS', () => {
    expect(storeLinkOf('ios', CONFIG)).toEqual({
      line: 'Get the latest version from the App Store.',
      url: APP_STORE,
    });
  });

  it('names Google Play and links its page on Android', () => {
    expect(storeLinkOf('android', CONFIG)).toEqual({
      line: 'Get the latest version from Google Play.',
      url: PLAY,
    });
  });

  it('keeps the line but no link while a store page is unset', () => {
    const androidOnly = { android: { playStoreUrl: PLAY } };
    expect(storeLinkOf('ios', androidOnly)).toEqual({
      line: 'Get the latest version from the App Store.',
      url: null,
    });
    expect(storeLinkOf('android', {}).url).toBeNull();
  });

  it('has no link without an app config', () => {
    expect(storeLinkOf('ios', null).url).toBeNull();
    expect(storeLinkOf('android', undefined).url).toBeNull();
  });
});
