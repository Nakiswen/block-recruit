'use client';

import React, { useCallback, useState } from 'react';
import { WalletIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import { connectWallet, disconnectWallet, listenAccountChanges, listenChainChanges } from '@/packages/web3-utils/wallet';
import WalletConnectModal, { WalletType } from './WalletConnectModal';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  onDisconnect,
}) => {
  // 状态管理
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [chainId, setChainId] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      
      if (onConnect) {
        onConnect(result.address);
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