# OpenRouter的Claude 4模型API配置教程

## 简介

OpenRouter是一个AI模型路由平台，允许开发者通过统一的API接口访问多种大型语言模型，包括Anthropic的Claude 4。本教程将指导您如何配置OpenRouter以在项目中使用Claude 4模型。

## 账号注册与设置

1. 访问 [OpenRouter官网](https://openrouter.ai/) 并注册账号
2. 使用邮箱或GitHub账号完成注册流程
3. 登录到OpenRouter控制台

## API密钥获取

1. 在OpenRouter控制台，点击左侧菜单中的"API Keys"
2. 点击"Create New Key"创建一个新的API密钥
3. 为密钥添加描述（例如："BlockRecruit项目"）
4. 设置合适的请求限制和权限
5. 创建完成后，复制并安全保存API密钥

## 环境变量配置

在项目的`.env`文件中，添加以下与OpenRouter和Claude 4相关的环境变量：

```
# OpenRouter API配置
OPENROUTER_API_KEY=your_openrouter_api_key_here
AI_MODEL=anthropic/claude-sonnet-4
AI_API_BASE_URL=https://openrouter.ai/api/v1
```

## 模型选择与参数

OpenRouter提供多种Claude模型版本，您可以根据需求选择：

- **anthropic/claude-sonnet-4** - Claude 4 Sonnet (最新的Claude 4版本)
- **anthropic/claude-3-7-sonnet** - Claude 3.7 Sonnet
- **anthropic/claude-3-5-sonnet** - Claude 3.5 Sonnet

其他关键参数：
- **温度(temperature)**: 控制输出的随机性，默认为0.1（较确定的回答）
- **最大tokens(maxTokens)**: 限制生成回答的最大长度，默认为1000

## 在项目中使用

本项目使用LangChain与OpenRouter集成，以下是设置示例：

```javascript
import { ChatOpenAI } from '@langchain/openai';

// 配置AI服务
const model = new ChatOpenAI({
  modelName: 'anthropic/claude-sonnet-4',  // Claude 4模型名称
  temperature: 0.1,  // 较低的温度以获得一致的回答
  openAIApiKey: process.env.OPENROUTER_API_KEY,  // 使用OpenRouter API密钥
  maxTokens: 1000,  // 输出的最大令牌数
  configuration: {
    baseURL: 'https://openrouter.ai/api/v1',  // OpenRouter API端点
    defaultHeaders: {
      'HTTP-Referer': 'https://blockrecruitmentapp.com',  // 应用来源
      'X-Title': 'BlockRecruit',  // 应用名称
    },
  },
});
```

## 用量与费用

使用OpenRouter的Claude 4模型需要注意：

1. **计费方式**: OpenRouter按实际使用的tokens计费
2. **费率**: 不同模型有不同的输入/输出token费率
3. **预算控制**: 可在OpenRouter控制台设置预算限制
4. **监控**: 定期检查API使用情况以控制成本

## 安全最佳实践

保护您的API密钥和模型访问安全：

1. **环境变量**: 永远不要在代码中硬编码API密钥
2. **后端使用**: 只在服务器端使用API密钥，不要在前端暴露
3. **限制请求**: 设置适当的速率限制和预算上限
4. **密钥轮换**: 定期更换API密钥
5. **审计日志**: 监控API调用以检测异常使用

## 验证配置

可以通过运行以下命令来验证OpenRouter和Claude 4模型配置是否正确：

```bash
# 执行AI服务测试
npm run test:ai
```

## 故障排除

### 常见问题

1. **认证错误**:
   - 检查API密钥是否正确输入
   - 确认API密钥是否有效

2. **模型不可用**:
   - 确认OpenRouter上该模型当前是否可用
   - 尝试其他Claude模型版本

3. **配额超限**:
   - 检查是否达到API调用限制或预算限制
   - 在OpenRouter控制台增加限额

4. **响应超时**:
   - 增加请求超时设置
   - 检查网络连接
   - 可能是模型负载高，稍后重试

## 替代模型方案

如果Claude 4模型不可用或费用过高，可以考虑以下替代方案：

1. **较早版本的Claude**: 如Claude 3.5或3.0，性能略低但费用更低
2. **GPT模型**: 通过OpenRouter使用OpenAI的GPT-4o或GPT-4
3. **开源模型**: 如Llama 3或Mistral，通过OpenRouter访问或自行部署

## 资源链接

- [OpenRouter官方文档](https://openrouter.ai/docs)
- [Anthropic Claude文档](https://docs.anthropic.com/)
- [LangChain与OpenRouter集成指南](https://js.langchain.com/docs/integrations/providers/openrouter) 