module.exports = {
  extends: require.resolve('@umijs/lint/dist/config/eslint'),
  parser: '@typescript-eslint/parser', // 指定解析器
  plugins: ['@typescript-eslint/eslint-plugin'], // 添加 TypeScript 插件
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/jsx-key': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
  },
  settings: {
    'import/resolvers': {
      typescript: {}, // 如果你使用 typescript-eslint 的 import 规则，需要这个设置
    },
  },
};
