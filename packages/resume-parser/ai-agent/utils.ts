/**
 * 从AI响应中提取JSON对象
 * 多级防御策略:
 * 1. 尝试直接解析整个响应
 * 2. 尝试提取Markdown代码块中的JSON
 * 3. 尝试修复常见JSON格式错误
 * 4. 失败时记录详细错误以协助调试
 * @param response - AI生成的响应文本
 * @returns 解析后的JSON对象,解析失败则返回null
 */
export function extractJsonFromResponse(response: string): any | null {
  if (!response || typeof response !== 'string') {
    console.error('extractJsonFromResponse: 接收到无效响应', response);
    return null;
  }

  // 保存原始响应用于日志
  const originalResponse = response;
  let parsedResult = null;

  try {
    // 第一步：尝试直接解析完整响应
    try {
      parsedResult = JSON.parse(response);
      console.log('成功直接解析为JSON');
      return parsedResult;
    } catch (directError) {
      // 继续尝试下一个方法
    }

    // 第二步：尝试从Markdown代码块中提取JSON
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)```/;
    const match = response.match(jsonRegex);
    
    if (match && match[1]) {
      try {
        parsedResult = JSON.parse(match[1].trim());
        console.log('从Markdown代码块中成功提取JSON');
        return parsedResult;
      } catch (blockError) {
        // 尝试修复提取的内容
        response = match[1].trim();
      }
    }

    // 第三步：修复常见的JSON格式问题
    // 移除尾随逗号
    response = response.replace(/,(\s*[}\]])/g, '$1');
    // 将单引号替换为双引号
    response = response.replace(/'/g, '"');
    // 修复未加引号的键名
    response = response.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

    try {
      parsedResult = JSON.parse(response);
      console.log('在修复后成功解析JSON');
      return parsedResult;
    } catch (fixedError) {
      // 继续尝试更激进的修复方法
    }

    // 第四步：尝试更激进的修复方法
    // 查找第一个{和最后一个}，尝试提取最外层对象
    const firstBrace = response.indexOf('{');
    const lastBrace = response.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
      const potentialJson = response.substring(firstBrace, lastBrace + 1);
      try {
        parsedResult = JSON.parse(potentialJson);
        console.log('成功从部分响应中提取JSON对象');
        return parsedResult;
      } catch (partialError) {
        // 最后一次尝试失败
      }
    }
    
    // 所有尝试都失败，记录详细错误信息
    console.error('JSON解析失败，原始响应:', originalResponse);
    console.error('尝试解析的最终内容:', response);
    return null;
  } catch (e) {
    console.error('extractJsonFromResponse处理时发生异常:', e);
    console.error('原始响应:', originalResponse);
    return null;
  }
} 