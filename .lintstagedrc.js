module.exports = {
  // 对所有JS和TS文件运行ESLint
  '**/*.{js,jsx,ts,tsx}': ['eslint --fix'],
  
  // 对所有文件运行Prettier
  '**/*.{js,jsx,ts,tsx,json,css,scss,md}': ['prettier --write'],
  
  // 对特定文件类型进行特殊处理
  'package.json': ['sort-package-json'],
}; 