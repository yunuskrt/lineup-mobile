const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// 16, as on web: NativeWind's default rem is 14
module.exports = withNativeWind(config, {
  input: './src/global.css',
  inlineRem: 16,
});
