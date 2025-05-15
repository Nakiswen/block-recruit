import { ethers } from 'ethers';

export interface ConnectWalletResult {
  address: string;
  provider?: any;
  chainId?: number;
  error?: string;
}

// 存储签名
let _authSignature: string | null = null;

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

    // 在连接成功后立即获取签名
    try {
      await getWalletSignature(accounts[0], provider);
    } catch (signError) {
      console.warn('无法获取签名，但钱包已连接', signError);
    }

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
 * 获取钱包签名用于身份验证
 * @param address 钱包地址
 * @param provider 以太坊提供者
 * @returns 签名字符串
 */
export async function getWalletSignature(address: string, provider?: any): Promise<string> {
  try {
    // 如果已经有签名且有效，则返回缓存的签名
    if (_authSignature) {
      return _authSignature;
    }

    if (!provider && typeof window !== 'undefined' && window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
    }

    if (!provider) {
      throw new Error('未提供以太坊provider');
    }

    // 获取签名者
    const signer = await provider.getSigner(address);
    
    // 准备消息
    const timestamp = Date.now();
    const message = `BlockRecruit 身份验证\n地址: ${address}\n时间戳: ${timestamp}`;

    // 获取签名
    const signature = await signer.signMessage(message);
    
    // 存储签名
    _authSignature = signature;
    localStorage.setItem('walletAuth', signature);
    localStorage.setItem('walletAuthTimestamp', timestamp.toString());
    localStorage.setItem('walletAuthAddress', address);

    return signature;
  } catch (error) {
    console.error('获取钱包签名失败:', error);
    throw error;
  }
}

/**
 * 获取用于API请求的认证头
 * @returns 包含认证头的对象或空对象（如果未连接）
 */
export function getAuthHeaders(): Record<string, string> {
  // 首先尝试从内存中获取
  let signature = _authSignature;
  
  // 如果内存中没有，尝试从localStorage获取
  if (!signature && typeof window !== 'undefined') {
    signature = localStorage.getItem('walletAuth');
  }
  
  if (!signature) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${signature}`
  };
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
  _authSignature = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('walletAuth');
    localStorage.removeItem('walletAuthTimestamp');
    localStorage.removeItem('walletAuthAddress');
  }
  console.log('钱包已断开连接');
}

// 添加全局类型声明
declare global {
  interface Window {
    ethereum?: any;
  }
} 