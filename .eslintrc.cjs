module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'import',
    'jsx-a11y',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
    'plugin:@next/next/recommended',
    'next/core-web-vitals',
    'prettier', // 确保这是最后一个扩展，以覆盖其他规则
  ],
  rules: {
    // React规则
    'react/react-in-jsx-scope': 'off', // React 17+不需要导入React
    'react/prop-types': 'off', // 使用TypeScript类型代替PropTypes
    'react/jsx-filename-extension': [1, { extensions: ['.tsx'] }], // 允许.tsx文件中使用JSX
    'react/jsx-props-no-spreading': 'off', // 允许props展开
    'react/require-default-props': 'off', // TypeScript处理默认props
    
    // TypeScript规则
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 不强制要求导出函数和类的公共类方法的显式返回和参数类型
    '@typescript-eslint/no-explicit-any': 'warn', // 警告使用any类型
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // 禁止未使用的变量，忽略下划线开头的参数
    '@typescript-eslint/no-empty-function': 'warn', // 警告空函数
    '@typescript-eslint/ban-ts-comment': 'warn', // 警告使用@ts-ignore等注释
    
    // 导入规则
    'import/prefer-default-export': 'off', // 不要求只有一个导出时使用默认导出
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }], // 允许导入devDependencies
    'import/order': "off",
    
    // 通用规则
    'no-console': ['warn', { allow: ['warn', 'error'] }], // 警告console.log，允许console.warn和console.error
    'no-debugger': 'warn', // 警告使用debugger
    'no-unused-vars': 'off', // 关闭原生的no-unused-vars，使用@typescript-eslint/no-unused-vars代替
    'camelcase': 'off', // 不强制使用驼峰命名
  },
  overrides: [
    // 为特定文件覆盖规则
    {
      files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
      env: {
        jest: true,
      },
    },
  ],
} 