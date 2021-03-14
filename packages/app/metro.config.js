const path = require('path')

const linkedLibs = [
  path.resolve(__dirname, '../..'),
  path.resolve(__dirname)
]

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
