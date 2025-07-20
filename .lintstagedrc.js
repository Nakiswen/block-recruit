// .lintstagedrc.js
module.exports = {
  'apps/api/**/*.{js,jsx,ts,tsx}': [
    'cd apps/api && eslint --fix --max-warnings=0',
  ],
  'apps/web/**/*.{js,jsx,ts,tsx}': [
    'eslint --fix --max-warnings=0',
  ],
  '**/*.{js,jsx,ts,tsx,json,css,scss,md}': [
    'prettier --write',
  ],
  'package.json': [
    'sort-package-json',
  ],
}