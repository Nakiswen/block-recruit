import axios from 'axios';
import { ethers } from 'ethers';

export interface ConnectWalletResult {
  address: string;
  provider?: any;
  chainId?: number;
  error?: string;
}

// 存储签名
// let _authSignature: string | null = null;
// 存储JWT令牌
let _authToken: string | null = null;

// API基础URL - 使用相对路径，让浏览器自动处理
const API_BASE_PATH = '/api';

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
    // 首先检查是否有有效的JWT令牌
    let token = localStorage.getItem('token');
    if (token) {
      try {
        // 验证令牌是否有效
        const response = await axios.get(`${API_BASE_PATH}/auth/session`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.isValid) {
          _authToken = token;
          return token; // 返回令牌作为"签名"
        }
      } catch (error) {
        console.warn('验证令牌失败，将重新获取签名', error);
      }
    }

    if (!provider && typeof window !== 'undefined' && window.ethereum) {
      provider = new ethers.BrowserProvider(window.ethereum);
    }

    if (!provider) {
      throw new Error('未提供以太坊provider');
    }

    // 获取签名者
    const signer = await provider.getSigner(address);
    
    // 步骤1: 请求登录挑战
    const challengeResponse = await axios.get(`${API_BASE_PATH}/auth/challenge`, {
      params: { address }
    });
    
    const { message, nonce } = challengeResponse.data;
    
    if (!message || !nonce) {
    }
    
    
    // 步骤2: 请求用户签名
    const signature = await signer.signMessage(message);
    
    // 保存签名数据以便将来静默登录
    localStorage.setItem(`message_${address.toLowerCase()}`, message);
    localStorage.setItem(`signature_${address.toLowerCase()}`, signature);
    localStorage.setItem(`nonce_${address.toLowerCase()}`, nonce);
    
    // 步骤3: 验证签名并登录
    
    const loginResponse = await axios.post(`${API_BASE_PATH}/auth/login`, {
      address,
      signature,
      nonce
    });
    
    const { token: newToken } = loginResponse.data;
    token = newToken;
    
    // 保存token到localStorage
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('walletAuth', 'true');
      localStorage.setItem('walletAuthAddress', address);
      _authToken = token;
      
      return token; // 返回令牌
    } else {
      throw new Error('登录失败，未获取到token');
    }
  } catch (error) {
    console.error('获取钱包签名失败:', error);
    throw error;
  }
}

/**
 * 验证会话是否有效
 * @returns 会话是否有效
 */
export async function verifySession(): Promise<boolean> {
  try {
    // 检查是否有令牌
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
    
    // 验证令牌
    const response = await axios.get(`${API_BASE_PATH}/auth/session`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.isValid === true;
  } catch (error) {
    console.error('验证会话失败:', error);
    return false;
  }
}

/**
 * 获取用于API请求的认证头
 * @returns 包含认证头的对象或空对象（如果未连接）
 */
export function getAuthHeaders(): Record<string, string> {
  // 首先尝试从内存中获取JWT令牌
  let token = _authToken;
  
  // 如果内存中没有，尝试从localStorage获取
  if (!token && typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`
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
  _authToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('walletAuth');
    localStorage.removeItem('walletAuthAddress');
    
    // 清除所有保存的签名数据
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith('signature_') || key.startsWith('message_') || key.startsWith('nonce_')) {
        localStorage.removeItem(key);
      }
    }
  }
  console.log('钱包已断开连接');
}

/**
 * 检查钱包是否已连接（不会触发连接请求）
 * @returns 是否已连接
 */
export async function isWalletConnected(): Promise<boolean> {
  try {
    // 首先检查localStorage
    if (typeof window === 'undefined' || localStorage.getItem('walletAuth') !== 'true') {
      return false;
    }
    
    // 然后验证会话
    const sessionValid = await verifySession();
    if (sessionValid) {
      return true;
    }
    
    // 最后检查钱包连接
    if (!window.ethereum) {
      return false;
    }
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_accounts', []);
    return accounts && accounts.length > 0;
  } catch (error) {
    console.error('检查钱包连接状态失败:', error);
    return false;
  }
}

// 添加全局类型声明
declare global {
  interface Window {
    ethereum?: any;
  }
} 