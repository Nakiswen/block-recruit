module.exports = {
  extends: ['../../.eslintrc.js', 'next/core-web-vitals'],
  settings: {
    'import/resolver': {
      typescript: {
        // 使用web应用的tsconfig.json
        project: './tsconfig.json',
        // 允许扩展名
        extensions: ['.ts', '.tsx', '.js', '.jsx']
      }
    }
  },
  rules: {
    // 放宽对any类型的限制，但保留警告
    '@typescript-eslint/no-explicit-any': 'warn',
    // 允许导入extraneous依赖，因为monorepo中的依赖关系可能在父级package.json中定义
    'import/no-extraneous-dependencies': 'off',
    // 其他规则
    'no-console': 'warn',
  },
  overrides: [
    {
      // 对于lib/api-config.js这类配置文件关闭类型检查
      files: ['lib/api-config.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
};
