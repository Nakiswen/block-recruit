'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { WalletIcon } from '@heroicons/react/24/outline';
import { ethers } from 'ethers';
import Button from './Button';
import { connectWallet, disconnectWallet, listenAccountChanges, listenChainChanges, getWalletSignature } from '@/packages/web3-utils/wallet';
import WalletConnectModal, { WalletType } from './WalletConnectModal';
import axios from 'axios';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
  isConnected?: boolean;
  walletAddress?: string;
  apiUrl?: string; // 可选的API URL
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onDisconnect,
  isConnected: propsIsConnected,
  walletAddress: propsWalletAddress,
  apiUrl = '/api', // 默认使用相对路径
}) => {
  // 状态管理
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>(propsWalletAddress || '');
  const [chainId, setChainId] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerifyingSession, setIsVerifyingSession] = useState(false);

  // 验证会话状态
  const verifySession = useCallback(async (token: string): Promise<boolean> => {
    try {
      setIsVerifyingSession(true);
      console.log('验证钱包会话状态...');
      
      // 添加超时控制，避免长时间等待
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时
      
      const response = await axios.get(`${apiUrl}/auth/session`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal
      }).catch(error => {
        // 如果是网络错误或API不可用，静默失败
        console.warn('会话验证请求失败，可能是API未启动或网络问题:', error.message);
        return { data: { isValid: false } };
      });
      
      clearTimeout(timeoutId);
      
      const { isValid, address } = response.data;
      console.log('会话验证结果:', isValid ? '有效' : '无效', address);
      
      if (isValid && address) {
        setWalletAddress(address);
        return true;
      }
      
      return false;
    } catch (error) {
      // 静默处理错误
      console.warn('会话验证过程中出现错误:', error);
      return false;
    } finally {
      setIsVerifyingSession(false);
    }
  }, [apiUrl]);

  // 初始化 - 检查钱包是否已连接
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (typeof window !== 'undefined') {
        // 检查是否有保存的地址和签名
        const savedAddress = localStorage.getItem('walletAuthAddress');
        const savedAuth = localStorage.getItem('walletAuth');
        const token = localStorage.getItem('token');
        
        if (savedAddress && savedAuth && token) {
          // 不立即验证会话，先显示已连接状态
          setWalletAddress(savedAddress);
          if (onConnect) {
            onConnect(savedAddress);
          }
          
          // 延迟验证会话，避免页面加载时立即发送请求
          setTimeout(async () => {
            try {
              // 先尝试验证会话有效性
              const isSessionValid = await verifySession(token);
              
              if (!isSessionValid) {
                console.log('会话已过期，但保持钱包连接状态');
              }
            } catch (err) {
              // 静默处理错误
              console.warn('延迟验证会话时出错:', err);
            }
          }, 3000); // 延迟3秒验证
          
          return;
        }
      }
    };
    
    checkExistingConnection();
  }, [onConnect, verifySession]);
  
  // 当props中的地址变化时更新本地状态
  useEffect(() => {
    if (propsWalletAddress && propsWalletAddress !== walletAddress) {
      setWalletAddress(propsWalletAddress);
    }
  }, [propsWalletAddress, walletAddress]);

  // 格式化钱包地址显示
  const formatAddress = useCallback((address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  // 处理钱包选择
  const handleSelectWallet = useCallback(async (walletType: WalletType) => {
    try {
      setIsConnecting(true);
      setError('');
      setIsModalOpen(false);
      
      const result = await connectWallet();
      
      // 如果用户拒绝连接，静默处理
      if (result.error?.includes('User rejected') || result.error?.includes('user rejected')) {
        return;
      }

      // 处理其他错误
      if (result.error) {
        setError(result.error);
        return;
      }

      setWalletAddress(result.address);
      setChainId(result.chainId);
      
      // 确保获取签名用于身份验证
      if (result.provider && result.address) {
        try {
          await getWalletSignature(result.address, result.provider);
        } catch (signError) {
          console.warn('获取签名失败，这可能会影响需要身份验证的操作', signError);
        }
      }
      
      if (onConnect) {
        onConnect(result.address);
      }
      
      // 触发storage事件，确保其他组件能感知到状态变化
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'walletAuth',
          newValue: localStorage.getItem('walletAuth')
        }));
      }
    } catch (err) {
      // 检查是否是用户拒绝错误
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (!errorMessage.toLowerCase().includes('user rejected')) {
        setError('连接失败：' + errorMessage);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [onConnect]);

  // 处理断开连接
  const handleDisconnect = useCallback(() => {
    disconnectWallet();
    setWalletAddress('');
    setChainId(undefined);
    setError('');
    if (onDisconnect) {
      onDisconnect();
    }
    
    // 触发storage事件，确保其他组件能感知到状态变化
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'walletAuth',
        newValue: null
      }));
    }
  }, [onDisconnect]);

  // 设置钱包事件监听
  React.useEffect(() => {
    // 监听账户变化
    listenAccountChanges((accounts: string[]) => {
      if (accounts.length === 0) {
        handleDisconnect();
      } else {
        setWalletAddress(accounts[0]);
      }
    });

    // 监听链变化
    listenChainChanges((newChainId: string) => {
      setChainId(parseInt(newChainId, 16));
    });
  }, [handleDisconnect]);

  return (
    <>
      {error && !error.toLowerCase().includes('user rejected') && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}
      
      {!walletAddress ? (
        <Button 
          variant="primary" 
          size="sm" 
          onClick={() => setIsModalOpen(true)}
          disabled={isConnecting || isVerifyingSession}
          className="flex items-center"
        >
          <WalletIcon className="h-5 w-5 mr-2" />
          {isConnecting ? '连接中...' : isVerifyingSession ? '验证中...' : '连接钱包'}
        </Button>
      ) : (
        <div className="flex items-center">
          <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
            {chainId ? `Chain ID: ${chainId}` : '已连接'}
          </span>
          <span className="text-sm font-medium text-gray-700 mr-3">
            {formatAddress(walletAddress)}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDisconnect}
          >
            断开
          </Button>
        </div>
      )}

      <WalletConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectWallet={handleSelectWallet}
      />
    </>
  );
};

export default React.memo(WalletConnect); 