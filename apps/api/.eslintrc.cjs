module.exports = {
  extends: ['../../.eslintrc.cjs'],
  parserOptions: {
    project: './tsconfig.json',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
      alias: {
        map: [['@', './src']],
        extensions: ['.ts', '.js', '.jsx', '.tsx'],
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
