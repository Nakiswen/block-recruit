// 在JavaScript文件中测试utils.ts中的函数
const { extractJsonFromResponse } = require('./utils');

// 测试场景1: 简单有效的JSON
const validJson = '{"name": "John", "age": 30}';
console.log('测试1 - 有效JSON:');
console.log(extractJsonFromResponse(validJson));

// 测试场景2: 包含在Markdown代码块中的JSON
const markdownJson = '```json\n{"name": "Alice", "skills": ["JavaScript", "TypeScript"]}\n```';
console.log('\n测试2 - Markdown中的JSON:');
console.log(extractJsonFromResponse(markdownJson));

// 测试场景3: 需要修复的JSON (有尾随逗号)
const fixableJson = '{"items": ["a", "b", "c",], "count": 3}';
console.log('\n测试3 - 需修复的JSON:');
console.log(extractJsonFromResponse(fixableJson));

// 测试场景4: 从工作流程中提取的真实应用场景
const workflowResponse = `以下是从简历中提取的个人信息:

\`\`\`json
{
  "name": "张三",
  "email": "zhangsan@example.com",
  "phone": "123-456-7890",
  "location": "北京",
  "links": ["https://github.com/zhangsan", "https://linkedin.com/in/zhangsan"]
}
\`\`\`

希望这对您有所帮助！`;

console.log('\n测试4 - 真实工作流示例:');
console.log(extractJsonFromResponse(workflowResponse)); 