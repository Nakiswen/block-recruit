'use client';

import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import React, { Fragment } from 'react';

// 定义支持的钱包类型
export type WalletType = 'metamask' | 'walletconnect' | 'coinbase';

interface WalletOption {
  id: WalletType;
  name: string;
  icon: string;
  isPopular?: boolean;
  isDetected?: boolean;
}

// 钱包图标组件
const MetaMaskIcon = () => (
  <svg className="rounded-lg" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" fill="#F7F9FB"/>
    <path d="M32.6877 6.6665L22.0555 14.5632L24.0216 9.90427L32.6877 6.6665Z" fill="#E2761B" stroke="#E2761B" strokeWidth="0.106857" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.1433 6.6665L18.6901 14.638L16.8201 9.90427L8.1433 6.6665ZM28.8628 24.9711L26.0311 29.3095L32.0899 30.9764L33.8317 25.0672L28.8628 24.9711ZM7.0213 25.0672L8.75238 30.9764L14.8112 29.3095L11.9795 24.9711L7.0213 25.0672Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.106857" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.4697 17.641L12.7814 20.1949L18.7974 20.462L18.5837 13.9972L14.4697 17.641ZM26.3629 17.641L22.1955 13.9224L22.0565 20.462L28.0619 20.1949L26.3629 17.641ZM14.8117 29.3097L18.4234 27.5466L15.3032 25.1103L14.8117 29.3097ZM22.4092 27.5466L26.0316 29.3097L25.5294 25.1103L22.4092 27.5466Z" fill="#E4761B" stroke="#E4761B" strokeWidth="0.106857" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26.0316 29.3095L22.4091 27.5464L22.6976 29.9079L22.6656 30.9017L26.0316 29.3095ZM14.8116 29.3095L18.1776 30.9017L18.1562 29.9079L18.4233 27.5464L14.8116 29.3095Z" fill="#D7C1B3" stroke="#D7C1B3" strokeWidth="0.106857" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18.2319 23.5497L15.2185 22.6628L17.345 21.6904L18.2319 23.5497ZM22.6023 23.5497L23.4892 21.6904L25.6264 22.6628L22.6023 23.5497Z" fill="#233447" stroke="#233447" strokeWidth="0.106857" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.8106 29.3092L15.3236 24.9708L11.9789 25.067L14.8106 29.3092ZM25.5177 24.9708L26.0306 29.3092L28.8623 25.067L25.5177 24.9708ZM28.0609 20.1943L22.0555 20.4615L22.6112 23.5496L23.4981 21.6903L25.6352 22.6627L28.0609 20.1943ZM15.2167 22.6627L17.3538 21.6903L18.2301 23.5496L18.7964 20.4615L12.7804 20.1943L15.2167 22.6627Z" fill="#CD6116" stroke="#CD6116" strokeWidth="0.106857" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.7814 20.1943L15.3032 25.1097L15.2177 22.6627L12.7814 20.1943ZM25.6362 22.6627L25.5294 25.1097L28.0619 20.1943L25.6362 22.6627ZM18.7974 20.4615L18.2311 23.5496L18.9363 27.1935L19.0966 22.3956L18.7974 20.4615ZM22.0565 20.4615L21.768 22.3849L21.8963 27.1935L22.6122 23.5496L22.0565 20.4615Z" fill="#E4751F" stroke="#E4751F" strokeWidth="0.106857" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22.613 23.5495L21.8971 27.1933L22.41 27.546L25.5302 25.1096L25.637 22.6626L22.613 23.5495ZM15.2185 22.6626L15.304 25.1096L18.4242 27.546L18.9371 27.1933L18.2319 23.5495L15.2185 22.6626Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.106857" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22.6656 30.9022L22.6976 29.9085L22.4305 29.6734H18.402L18.1562 29.9085L18.1776 30.9022L14.8116 29.3101L15.987 30.2718L18.3699 31.9281H22.4625L24.8561 30.2718L26.0316 29.3101L22.6656 30.9022Z" fill="#C0AD9E" stroke="#C0AD9E" strokeWidth="0.106857" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22.409 27.5465L21.8961 27.1938H18.9362L18.4233 27.5465L18.1561 29.908L18.4019 29.6729H22.4304L22.6975 29.908L22.409 27.5465Z" fill="#161616" stroke="#161616" strokeWidth="0.106857" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M33.1371 15.0761L34.0454 10.7164L32.6883 6.6665L22.4087 14.2961L26.3624 17.6407L31.951 19.2756L33.1905 17.833L32.6562 17.4484L33.5111 16.6683L32.8486 16.1554L33.7034 15.5036L33.1371 15.0761ZM6.79688 10.7164L7.70516 15.0761L7.12813 15.5036L7.98299 16.1554L7.33116 16.6683L8.18601 17.4484L7.65173 17.833L8.88058 19.2756L14.4692 17.6407L18.4229 14.2961L8.14327 6.6665L6.79688 10.7164Z" fill="#763D16" stroke="#763D16" strokeWidth="0.106857" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M31.951 19.2761L26.3624 17.6412L28.0614 20.1951L25.5289 25.1105L28.8628 25.0678H33.8317L31.951 19.2761ZM14.4692 17.6412L8.88061 19.2761L7.0213 25.0678H11.9795L15.3027 25.1105L12.7809 20.1951L14.4692 17.6412ZM22.0561 20.4622L22.4087 14.2966L24.0329 9.90479H16.8201L18.4229 14.2966L18.7969 20.4622L18.9252 22.407L18.9358 27.1942H21.8958L21.9171 22.407L22.0561 20.4622Z" fill="#F6851B" stroke="#F6851B" strokeWidth="0.106857" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WalletConnectIcon = () => (
 <svg className="rounded-lg" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><rect width="40" height="40" fill="#3396FF"/><path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" fill="#3396FF"/><path d="M12.2327 14.8836C16.5225 10.7003 23.4779 10.7003 27.7677 14.8836L28.284 15.3871C28.4985 15.5962 28.4985 15.9353 28.284 16.1445L26.5179 17.8668C26.4106 17.9713 26.2368 17.9713 26.1295 17.8668L25.419 17.1739C22.4263 14.2555 17.5741 14.2555 14.5813 17.1739L13.8204 17.9159C13.7132 18.0205 13.5393 18.0205 13.4321 17.9159L11.666 16.1936C11.4514 15.9845 11.4514 15.6453 11.666 15.4362L12.2327 14.8836ZM31.4203 18.4454L32.9922 19.9782C33.2067 20.1874 33.2067 20.5265 32.9922 20.7356L25.9045 27.6473C25.69 27.8565 25.3422 27.8565 25.1277 27.6473L20.0973 22.742C20.0437 22.6896 19.9568 22.6896 19.9031 22.742L14.8728 27.6473C14.6583 27.8565 14.3106 27.8565 14.096 27.6473L7.00816 20.7355C6.79367 20.5264 6.79367 20.1873 7.00816 19.9782L8.58004 18.4453C8.79454 18.2362 9.1423 18.2362 9.35679 18.4453L14.3873 23.3508C14.4409 23.4031 14.5278 23.4031 14.5814 23.3508L19.6117 18.4453C19.8262 18.2361 20.1739 18.2361 20.3885 18.4453L25.4189 23.3508C25.4726 23.4031 25.5595 23.4031 25.6131 23.3508L30.6436 18.4454C30.858 18.2362 31.2058 18.2362 31.4203 18.4454Z" fill="white"/></svg>
);

const CoinbaseIcon = () => (
  <svg className="rounded-lg" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none"><g clipPath="url(#clip0_13571_129878)"><rect width="40" height="40" fill="#0052FF"/><path fillRule="evenodd" clipRule="evenodd" d="M8.3312 0H31.6672C36.2704 0 40 4.0128 40 8.9632V31.0368C40 35.9872 36.2704 40 31.6688 40H8.3312C3.7296 40 0 35.9872 0 31.0368V8.9632C0 4.0128 3.7296 0 8.3312 0Z" fill="#0052FF"/><path fillRule="evenodd" clipRule="evenodd" d="M19.9989 5.79443C27.8453 5.79443 34.2053 12.1544 34.2053 20.0008C34.2053 27.8472 27.8453 34.2072 19.9989 34.2072C12.1525 34.2072 5.79254 27.8472 5.79254 20.0008C5.79254 12.1544 12.1525 5.79443 19.9989 5.79443Z" fill="white"/><path fillRule="evenodd" clipRule="evenodd" d="M16.5005 15.459H23.4973C24.0733 15.459 24.5389 15.9614 24.5389 16.579V23.419C24.5389 24.0382 24.0717 24.539 23.4973 24.539H16.5005C15.9245 24.539 15.4589 24.0366 15.4589 23.419V16.579C15.4589 15.9614 15.9261 15.459 16.5005 15.459Z" fill="#0052FF"/></g><defs><clipPath id="clip0_13571_129878"><rect width="40" height="40" fill="white"/></clipPath></defs></svg>
);

const WALLET_OPTIONS: WalletOption[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'metamask',
    isPopular: true,
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: 'walletconnect',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: 'coinbase',
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
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  连接钱包
                </Dialog.Title>

                <div className="mt-4 space-y-3">
                  {WALLET_OPTIONS.map(wallet => {
                    const renderIcon = () => {
                      switch (wallet.icon) {
                        case 'metamask':
                          return <MetaMaskIcon />;
                        case 'walletconnect':
                          return <WalletConnectIcon />;
                        case 'coinbase':
                          return <CoinbaseIcon />;
                        default:
                          return <div className="w-full h-full bg-gray-200 rounded-lg" />;
                      }
                    };

                    return (
                      <button
                        key={wallet.id}
                        className="w-full flex items-center p-4 rounded-xl hover:bg-gray-50 border border-gray-200 transition-colors"
                        onClick={() => onSelectWallet(wallet.id)}
                      >
                        <div className="w-10 h-10 mr-3 flex-shrink-0">
                          {renderIcon()}
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
                              <span className="ml-2 text-sm text-gray-500">已检测</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
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
