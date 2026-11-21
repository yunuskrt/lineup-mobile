import type { Config } from 'tailwindcss';
// Tooling at the root: jiti can't resolve @/, so these are relative
import { tailwindTheme } from './src/styles/tailwind-theme';
import * as tokens from './src/styles/tokens';

// The preset ships no types, so it is required
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nativewind = require('nativewind/preset');

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [nativewind],
  theme: tailwindTheme(tokens),
};

export default config;
