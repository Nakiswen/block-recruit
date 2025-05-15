'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { WalletIcon } from '@heroicons/react/24/outline';
import { ethers } from 'ethers';
import Button from './Button';
import { connectWallet, disconnectWallet, listenAccountChanges, listenChainChanges, getWalletSignature } from '@/packages/web3-utils/wallet';
import WalletConnectModal, { WalletType } from './WalletConnectModal';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
  isConnected?: boolean;
  walletAddress?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onDisconnect,
  isConnected: propsIsConnected,
  walletAddress: propsWalletAddress,
}) => {
  // 状态管理
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>(propsWalletAddress || '');
  const [chainId, setChainId] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 初始化 - 检查钱包是否已连接
  useEffect(() => {
    const checkExistingConnection = async () => {
      if (typeof window !== 'undefined') {
        // 检查是否有保存的地址和签名
        const savedAddress = localStorage.getItem('walletAuthAddress');
        const savedAuth = localStorage.getItem('walletAuth');
        
        if (savedAddress && savedAuth) {
          setWalletAddress(savedAddress);
          
          // 检查是否可以检测到以太坊提供者
          if (window.ethereum) {
            try {
              // 尝试获取链ID
              const provider = new ethers.BrowserProvider(window.ethereum);
              const network = await provider.getNetwork();
              setChainId(Number(network.chainId));
              
              // 检查当前连接的账户
              const accounts = await provider.listAccounts();
              if (accounts.length > 0 && accounts[0].address.toLowerCase() === savedAddress.toLowerCase()) {
                // 确保有有效的签名
                try {
                  await getWalletSignature(savedAddress, provider);
                  if (onConnect) {
                    onConnect(savedAddress);
                  }
                } catch (err) {
                  console.warn('无法验证现有签名，可能需要重新连接', err);
                }
              }
            } catch (err) {
              console.warn('检查现有钱包连接时出错', err);
            }
          }
        }
      }
    };
    
    checkExistingConnection();
  }, [onConnect]);
  
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
          disabled={isConnecting}
          className="flex items-center"
        >
          <WalletIcon className="h-5 w-5 mr-2" />
          {isConnecting ? '连接中...' : '连接钱包'}
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