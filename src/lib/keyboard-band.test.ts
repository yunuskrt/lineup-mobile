import { describe, expect, it } from 'vitest';
import { bandLift } from '@/lib/keyboard-band';

describe('bandLift', () => {
  it('takes the iOS height as is: it already covers the home indicator', () => {
    expect(bandLift('ios', 336, 34)).toBe(336);
  });

  it('adds the navigation bar to the Android height', () => {
    expect(bandLift('android', 270, 24)).toBe(294);
  });

  it('adds nothing on Android with no navigation bar inset', () => {
    expect(bandLift('android', 270, 0)).toBe(270);
  });
});
