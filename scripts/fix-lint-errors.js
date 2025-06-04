/**
 * 自动修复 ESLint 错误的脚本
 * 主要处理未使用变量和 React Hook 依赖项问题
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 获取 lint 错误
function getLintErrors() {
  try {
    // 运行 ESLint 检查并获取输出
    const output = execSync('npx eslint --format json "**/*.{ts,tsx}"', { encoding: 'utf8' });
    return JSON.parse(output);
  } catch (error) {
    // ESLint 命令可能会返回非零退出码，但仍然输出 JSON
    try {
      return JSON.parse(error.stdout);
    } catch (e) {
      console.error('无法解析 ESLint 输出:', e);
      return [];
    }
  }
}

// 修复未使用的变量
function fixUnusedVars(filePath, messages) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let lines = content.split('\n');
    
    // 按行号倒序排序，这样从后往前修改不会影响行号
    const unusedVars = messages
      .filter(msg => msg.ruleId === 'no-unused-vars')
      .sort((a, b) => b.line - a.line);
    
    for (const error of unusedVars) {
      const lineIndex = error.line - 1;
      const line = lines[lineIndex];
      const colStart = error.column - 1;
      
      // 提取变量名
      const varName = error.message.match(/'([^']+)'/)?.[1];
      if (!varName) continue;
      
      // 处理导入语句中的未使用变量
      if (line.includes('import') && line.includes(varName)) {
        // 从导入语句中移除未使用的变量
        if (line.includes('{') && line.includes('}')) {
          // 处理命名导入
          const importPattern = new RegExp(`(\\s*|,\\s*)${varName}(\\s*|,\\s*)`, 'g');
          let newLine = line.replace(importPattern, ', ').replace(/,\s*,/g, ',').replace(/{\s*,\s*}/g, '{}').replace(/{\s*}/g, '');
          
          // 如果导入语句为空，则删除整行
          if (newLine.match(/import\s+(\{\s*\}|\s*)\s+from/)) {
            lines.splice(lineIndex, 1);
          } else {
            lines[lineIndex] = newLine;
          }
        }
      } else {
        // 添加前缀 "_" 将变量标记为有意未使用
        // 寻找变量声明的模式
        const varPattern = new RegExp(`(\\b(?:const|let|var|function)\\s+)(${varName})(\\b|\\s*:|\\s*=|,|\\)|\\s+)`, 'g');
        const paramPattern = new RegExp(`(\\(|,\\s*)(${varName})(:|,|\\))`, 'g');
        
        if (varPattern.test(line)) {
          lines[lineIndex] = line.replace(varPattern, `$1_${varName}$3`);
        } else if (paramPattern.test(line)) {
          lines[lineIndex] = line.replace(paramPattern, `$1_${varName}$3`);
        }
      }
    }
    
    // 写回文件
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`已修复 ${filePath} 中的未使用变量`);
  } catch (error) {
    console.error(`修复 ${filePath} 时出错:`, error);
  }
}

// 修复 React Hook 依赖项问题
function fixHookDeps(filePath, messages) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let lines = content.split('\n');
    
    const hookErrors = messages.filter(msg => msg.ruleId === 'react-hooks/exhaustive-deps');
    
    for (const error of hookErrors) {
      const lineIndex = error.line - 1;
      const line = lines[lineIndex];
      
      // 查找缺失的依赖项
      const missingDep = error.message.match(/Either include '([^']+)'/)?.[1];
      if (!missingDep) continue;
      
      // 查找依赖数组位置
      const depsArrayMatch = line.match(/\[(.*)\]/);
      if (!depsArrayMatch) continue;
      
      const depsArray = depsArrayMatch[1];
      const newDepsArray = depsArray ? `${depsArray}, ${missingDep}` : missingDep;
      
      // 替换依赖数组
      lines[lineIndex] = line.replace(/\[(.*)\]/, `[${newDepsArray}]`);
    }
    
    // 写回文件
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`已修复 ${filePath} 中的 React Hook 依赖项`);
  } catch (error) {
    console.error(`修复 ${filePath} 时出错:`, error);
  }
}

// 主函数
function main() {
  const errors = getLintErrors();
  
  for (const result of errors) {
    const filePath = result.filePath;
    const messages = result.messages;
    
    if (messages.length > 0) {
      console.log(`处理文件: ${filePath}`);
      
      // 修复未使用变量
      fixUnusedVars(filePath, messages);
      
      // 修复 React Hook 依赖项
      fixHookDeps(filePath, messages);
    }
  }
  
  console.log('完成修复!');
}

// 确保 scripts 目录存在
const scriptsDir = path.dirname(__filename);
if (!fs.existsSync(scriptsDir)) {
  fs.mkdirSync(scriptsDir, { recursive: true });
}

main(); 