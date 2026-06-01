module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './reports',
      filename: 'report.html',
      expand: true,
      openReport: false
    }]
  ]
};