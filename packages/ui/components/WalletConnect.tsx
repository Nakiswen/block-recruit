'use client';

import {
  connectWallet,
  disconnectWallet as walletDisconnect,
  listenAccountChanges,
  listenChainChanges,
  getWalletSignature,
} from 'web3-utils/wallet';
import { WalletIcon } from '@heroicons/react/24/outline';
import { useAtom } from 'jotai';
import axios from 'axios';
import React, { useCallback, useState, useEffect } from 'react';

import Button from './Button';
import WalletConnectModal from './WalletConnectModal';
import {
  walletStateAtom,
  walletModalStateAtom,
  openWalletModalAtom,
  closeWalletModalAtom,
  setWalletConnectingAtom,
  setWalletErrorAtom,
  connectWalletSuccessAtom,
  disconnectWalletAtom,
  loadWalletStateAtom,
} from '../../../store/walletAtoms';

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
  walletAddress: propsWalletAddress,
}) => {
  // Jotai 状态管理
  const [walletState] = useAtom(walletStateAtom);
  const [modalState] = useAtom(walletModalStateAtom);
  const [, openModal] = useAtom(openWalletModalAtom);
  const [, closeModal] = useAtom(closeWalletModalAtom);
  const [, setConnecting] = useAtom(setWalletConnectingAtom);
  const [, setError] = useAtom(setWalletErrorAtom);
  const [, connectSuccess] = useAtom(connectWalletSuccessAtom);
  const [, disconnectWallet] = useAtom(disconnectWalletAtom);
  const [, loadWalletState] = useAtom(loadWalletStateAtom);

  // 初始化 - 从 localStorage 恢复钱包状态
  useEffect(() => {
    loadWalletState();

    // 如果钱包已连接，通知外部组件
    if (walletState.isConnected && onConnect) {
      onConnect(walletState.address);
    }
  }, [loadWalletState, walletState.isConnected, walletState.address, onConnect]);

  // 当props中的地址变化时同步到Jotai状态（向后兼容性支持）
  useEffect(() => {
    if (propsWalletAddress && propsWalletAddress !== walletState.address) {
      connectSuccess({
        address: propsWalletAddress,
        chainId: walletState.chainId,
      });
    }
  }, [propsWalletAddress, walletState.address, walletState.chainId, connectSuccess]);

  // 格式化钱包地址显示
  const formatAddress = useCallback((address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, []);

  // 处理钱包选择
  const handleSelectWallet = useCallback(
    async (walletType?: string) => {
      try {
        setConnecting(true);
        setError('');
        closeModal();

        const result = await connectWallet(walletType);

        // 如果用户拒绝连接，静默处理
        if (result.error?.includes('User rejected') || result.error?.includes('user rejected')) {
          return;
        }

        // 处理其他错误
        if (result.error) {
          setError(result.error);
          return;
        }

        // 确保获取签名用于身份验证
        if (result.provider && result.address) {
          try {
            await getWalletSignature(result.address, result.provider);
          } catch (signError) {
            console.warn('获取签名失败，这可能会影响需要身份验证的操作', signError);
          }
        }

        // 更新 Jotai 状态
        connectSuccess({
          address: result.address,
          chainId: result.chainId,
        });

        // 通知外部组件
        if (onConnect) {
          onConnect(result.address);
        }

        // 触发storage事件，确保其他组件能感知到状态变化
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new StorageEvent('storage', {
              key: 'walletAuth',
              newValue: localStorage.getItem('walletAuth'),
            })
          );
        }
      } catch (err) {
        // 检查是否是用户拒绝错误
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (!errorMessage.toLowerCase().includes('user rejected')) {
          setError('连接失败：' + errorMessage);
        }
      } finally {
        setConnecting(false);
      }
    },
    [onConnect, setConnecting, setError, closeModal, connectSuccess]
  );

  // 处理断开连接
  const handleDisconnect = useCallback(() => {
    // 调用 web3-utils 钱包断开连接函数
    walletDisconnect();

    // 更新 Jotai 状态
    disconnectWallet();

    // 清理错误状态
    setError('');

    // 通知外部组件
    if (onDisconnect) {
      onDisconnect();
    }

    // 触发storage事件，确保其他组件能感知到状态变化
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'walletAuth',
          newValue: null,
        })
      );
    }
  }, [onDisconnect, disconnectWallet, setError]);

  // 设置钱包事件监听
  React.useEffect(() => {
    // 监听账户变化
    listenAccountChanges((accounts: string[]) => {
      if (accounts.length === 0) {
        handleDisconnect();
      } else {
        // 更新钱包状态
        connectSuccess({
          address: accounts[0],
          chainId: walletState.chainId,
        });
      }
    });

    // 监听链变化
    listenChainChanges((newChainId: string) => {
      const chainId = parseInt(newChainId, 16);
      // 更新链ID
      connectSuccess({
        address: walletState.address,
        chainId,
      });
    });
  }, [handleDisconnect, connectSuccess, walletState.address, walletState.chainId]);

  return (
    <>
      {modalState.error && !modalState.error.toLowerCase().includes('user rejected') && (
        <div className="text-red-500 text-sm mb-2">{modalState.error}</div>
      )}

      {!walletState.isConnected ? (
        <Button
          variant="primary"
          size="sm"
          onClick={openModal}
          disabled={modalState.isConnecting}
          className="flex items-center"
        >
          <WalletIcon className="h-5 w-5 mr-2" />
          {modalState.isConnecting ? '连接中...' : '连接钱包'}
        </Button>
      ) : (
        <div className="flex items-center">
          <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
            {walletState.chainId ? `Chain ID: ${walletState.chainId}` : '已连接'}
          </span>
          <span className="text-sm font-medium text-gray-700 mr-3">
            {formatAddress(walletState.address)}
          </span>
          <Button variant="outline" size="sm" onClick={handleDisconnect}>
            断开
          </Button>
        </div>
      )}

      <WalletConnectModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSelectWallet={handleSelectWallet}
      />
    </>
  );
};

export default React.memo(WalletConnect);
