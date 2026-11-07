module.exports = ({ config }) => {
  const development = process.env.APP_VARIANT === 'development';
  return {
    ...config,
    plugins: [
      ...config.plugins.filter(plugin => plugin !== 'expo-build-properties'),
      ['expo-build-properties', { android: { usesCleartextTraffic: development } }],
    ],
    ios: {
      ...config.ios,
      infoPlist: {
        ...config.ios?.infoPlist,
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: development,
          NSAllowsLocalNetworking: development,
        },
      },
    },
  };
};
