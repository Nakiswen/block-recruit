'use client';

import React from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// 定义支持的钱包类型
export type WalletType = 'metamask' | 'walletconnect' | 'coinbase';

interface WalletOption {
  id: WalletType;
  name: string;
  icon: string;
  isPopular?: boolean;
  isDetected?: boolean;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'https://app.uniswap.org/static/media/metamask-icon.c8b2298e68e585a7f4d9c7b7e6320715.svg',
    isPopular: true,
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: 'https://app.uniswap.org/static/media/walletconnect-icon.bd207ef6f3632304cd1b6e772271cb43.svg',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: 'https://app.uniswap.org/static/media/coinbase-icon.6870e62fb40f1d213198361a1b3d5521.svg',
  },
];

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (wallet: WalletType) => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  onSelectWallet,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  连接钱包
                </Dialog.Title>

                <div className="mt-4 space-y-3">
                  {WALLET_OPTIONS.map((wallet) => (
                    <button
                      key={wallet.id}
                      className="w-full flex items-center p-4 rounded-xl hover:bg-gray-50 border border-gray-200 transition-colors"
                      onClick={() => onSelectWallet(wallet.id)}
                    >
                      <div className="w-10 h-10 relative mr-3">
                        <Image
                          src={wallet.icon}
                          alt={wallet.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center">
                          <span className="font-medium">{wallet.name}</span>
                          {wallet.isPopular && (
                            <span className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">
                              热门
                            </span>
                          )}
                          {wallet.isDetected && (
                            <span className="ml-2 text-sm text-gray-500">
                              已检测
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 text-xs text-gray-500 text-center">
                  通过连接钱包，表明你同意 BlockRecruit 的服务条款及其隐私政策。
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default WalletConnectModal; 