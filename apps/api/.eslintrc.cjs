module.exports = {
  extends: ['../../.eslintrc.cjs'],
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
  },
  rules: {
    'import/no-unresolved': 'error',
    // Koa中间件通常会有未使用的next参数
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^(next|_)',
      },
    ],
    // 在开发阶段允许console语句
    'no-console': 'warn',
  },
};
