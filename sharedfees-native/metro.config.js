// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);

  // ✅ Completely rebuild asset resolution for images
  config.resolver.assetExts = config.resolver.assetExts.filter(
    (ext) => !['svg', 'png', 'jpg', 'jpeg'].includes(ext)
  );

  config.resolver.assetExts.push('svg', 'png', 'jpg', 'jpeg');

  // ✅ Explicitly set projectRoot so Metro can resolve assets outside app/
  config.projectRoot = __dirname;

  return config;
})();
