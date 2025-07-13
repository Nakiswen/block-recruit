const { generate } = require('openapi-typescript-codegen');
const path = require('path');
const fs = require('fs');

// 获取Swagger文件路径
const swaggerPath = path.resolve(__dirname, '../services/swagger.json');

// 生成API客户端代码
async function generateApiClient() {
  try {
    console.log('开始生成API客户端代码...');
    
    // 检查Swagger文件是否存在
    if (!fs.existsSync(swaggerPath)) {
      console.error('Swagger文件不存在:', swaggerPath);
      process.exit(1);
    }
    
    // 读取Swagger文件
    const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
    
    // 生成API客户端代码
    await generate({
      input: swagger,
      output: path.resolve(__dirname, '../services/api-client'),
      name: 'BlockRecruitAPI',
      exportCore: true,
      exportServices: true,
      exportModels: true,
      exportSchemas: false,
      indent: '  ',
      postfix: '',
      useOptions: false,
      useUnionTypes: true,
    });
    
    console.log('API客户端代码生成成功！');
  } catch (error) {
    console.error('生成API客户端代码失败:', error);
    process.exit(1);
  }
}

// 执行生成
generateApiClient(); 