const path = require('path')

const linkedLibs = [path.resolve(__dirname, '../..')]
console.info('CONFIG', linkedLibs)


/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  watchFolders: linkedLibs
};
