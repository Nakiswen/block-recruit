import { ethers } from 'ethers';

/**
 * 使用以太坊钱包对消息进行签名
 * @param message 要签名的消息
 * @param provider 以太坊提供者
 * @param address 签名者地址
 * @returns 签名结果
 */
export async function signMessage(
  message: string,
  provider: any,
  address: string
): Promise<string | { error: string }> {
  try {
    if (!provider || !address) {
      return { error: '缺少提供者或地址' };
    }

    const signer = await provider.getSigner(address);
    const signature = await signer.signMessage(message);
    return signature;
  } catch (error) {
    console.error('消息签名错误:', error);
    return { 
      error: '签名失败：' + (error instanceof Error ? error.message : String(error))
    };
  }
}

/**
 * 验证签名消息
 * @param message 原始消息
 * @param signature 签名
 * @param expectedAddress 预期的签名者地址
 * @returns 验证结果
 */
export function verifyMessage(
  message: string,
  signature: string,
  expectedAddress?: string
): { isValid: boolean; address: string; error?: string } {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    // 如果提供了预期地址，检查是否匹配
    if (expectedAddress && recoveredAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
      return {
        isValid: false,
        address: recoveredAddress,
        error: '签名地址与预期地址不匹配',
      };
    }
    
    return {
      isValid: true,
      address: recoveredAddress,
    };
  } catch (error) {
    console.error('签名验证错误:', error);
    return {
      isValid: false,
      address: '',
      error: '验证失败：' + (error instanceof Error ? error.message : String(error)),
    };
  }
}

/**
 * 生成标准的认证消息
 * @param address 用户地址
 * @param nonce 随机数，用于防止重放攻击
 * @param appName 应用名称
 * @returns 格式化的认证消息
 */
export function generateAuthMessage(
  address: string,
  nonce: string,
  appName: string = 'BlockRecruit'
): string {
  return `${appName} 身份验证\n\n地址: ${address}\n随机数: ${nonce}\n时间戳: ${Date.now()}`;
} 