module.exports = function babelConfig(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', 'module:metro-react-native-babel-preset',],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
        }, 
      ],
      'react-native-reanimated/plugin',
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
