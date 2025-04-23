import { ethers } from 'ethers';

export interface ConnectWalletResult {
  address: string;
  provider?: any;
  chainId?: number;
  error?: string;
}

/**
 * 连接以太坊钱包（MetaMask或其他浏览器钱包）
 * @returns 钱包连接结果，包含地址和provider
 */
export async function connectWallet(): Promise<ConnectWalletResult> {
  try {
    // 检查是否有以太坊提供者
    if (typeof window === 'undefined' || !window.ethereum) {
      return {
        address: '',
        error: '未发现以太坊提供者，请安装MetaMask或其他钱包插件',
      };
    }

    // 请求用户连接钱包
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (accounts.length === 0) {
      return {
        address: '',
        error: '用户拒绝连接钱包',
      };
    }

    // 获取网络信息
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);

    return {
      address: accounts[0],
      provider,
      chainId,
    };
  } catch (error) {
    console.error('钱包连接错误:', error);
    return {
      address: '',
      error: '钱包连接失败：' + (error instanceof Error ? error.message : String(error)),
    };
  }
}

/**
 * 监听钱包账户变化
 * @param callback 账户变化时的回调函数
 */
export function listenAccountChanges(callback: (accounts: string[]) => void): void {
  if (typeof window !== 'undefined' && window.ethereum) {
    window.ethereum.on('accountsChanged', callback);
  }
}

/**
 * 监听链ID变化
 * @param callback 链ID变化时的回调函数
 */
export function listenChainChanges(callback: (chainId: string) => void): void {
  if (typeof window !== 'undefined' && window.ethereum) {
    window.ethereum.on('chainChanged', callback);
  }
}

/**
 * 断开钱包连接（注意：这实际上并不会从MetaMask断开，仅在应用层面断开）
 */
export function disconnectWallet(): void {
  // 清除应用中的钱包状态
  console.log('钱包已断开连接');
}

// 添加全局类型声明
declare global {
  interface Window {
    ethereum?: any;
  }
} 