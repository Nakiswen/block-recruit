// lint-staged配置
module.exports = {
  // 对apps/web目录下的JS和TS文件运行ESLint
  'apps/web/**/*.{js,jsx,ts,tsx}': ['eslint --fix'],

  // 对apps/api目录下的JS和TS文件运行ESLint，使用API目录下的配置
  'apps/api/**/*.{js,jsx,ts,tsx}': ['cd apps/api && eslint --fix'],

  // 对所有文件运行Prettier
  '**/*.{js,jsx,ts,tsx,json,css,scss,md}': ['prettier --write'],

  // 对特定文件类型进行特殊处理
  'package.json': ['sort-package-json'],
};
