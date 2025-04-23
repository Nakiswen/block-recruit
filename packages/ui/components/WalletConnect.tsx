'use client';

import React, { useCallback } from 'react';
import { WalletIcon } from '@heroicons/react/24/outline';
import Button from './Button';

interface WalletConnectProps {
  onConnect?: () => void;
  isConnected?: boolean;
  walletAddress?: string;
  onDisconnect?: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
  onConnect,
  isConnected = false,
  walletAddress = '',
  onDisconnect,
}) => {
  // 对钱包地址进行格式化显示
  const formatAddress = useCallback((address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  // 使用useCallback包装处理函数
  const handleConnect = useCallback(() => {
    if (onConnect) onConnect();
  }, [onConnect]);

  const handleDisconnect = useCallback(() => {
    if (onDisconnect) onDisconnect();
  }, [onDisconnect]);

  return (
    <div>
      {!isConnected ? (
        <Button 
          variant="primary" 
          size="sm" 
          onClick={handleConnect}
          className="flex items-center"
        >
          <WalletIcon className="h-5 w-5 mr-2" />
          连接钱包
        </Button>
      ) : (
        <div className="flex items-center">
          <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">已连接</span>
          <span className="text-sm font-medium text-gray-700 mr-3">{formatAddress(walletAddress)}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDisconnect}
          >
            断开
          </Button>
        </div>
      )}
    </div>
  );
};

export default React.memo(WalletConnect); 