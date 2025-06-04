module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // 将警告提升为错误
    'no-unused-vars': 'warn', // 未使用的变量作为错误处理
    'react-hooks/exhaustive-deps': 'error', // React Hook 依赖项缺失作为错误处理
    'no-console': 'warn', // 保持控制台语句为警告
  },
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'dist/',
    '**/*.d.ts',
  ],
} 