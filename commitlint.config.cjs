module.exports = {
  extends: [],
  plugins: ['commitlint-plugin-function-rules'],
  rules: {
    'function-rules/scope-enum': [
      2, // level: error
      'always',
      (parsed) => {
        return [true];
      },
    ],
  },
};
