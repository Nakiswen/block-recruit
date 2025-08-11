import { atom } from 'jotai';

// 钱包连接状态接口
export interface WalletState {
  isConnected: boolean;
  address: string;
  chainId?: number;
}

// 钱包弹窗状态接口
export interface WalletModalState {
  isOpen: boolean;
  isConnecting: boolean;
  error: string;
}

// 钱包连接状态原子
export const walletStateAtom = atom<WalletState>({
  isConnected: false,
  address: '',
  chainId: undefined,
});

// 钱包弹窗状态原子
export const walletModalStateAtom = atom<WalletModalState>({
  isOpen: false,
  isConnecting: false,
  error: '',
});

// 打开钱包连接弹窗的派生原子
export const openWalletModalAtom = atom(
  null,
  (get, set) => {
    const currentState = get(walletModalStateAtom);
    set(walletModalStateAtom, {
      ...currentState,
      isOpen: true,
      error: '', // 清除之前的错误
    });
  }
);

// 关闭钱包连接弹窗的派生原子
export const closeWalletModalAtom = atom(
  null,
  (get, set) => {
    const currentState = get(walletModalStateAtom);
    set(walletModalStateAtom, {
      ...currentState,
      isOpen: false,
      isConnecting: false,
    });
  }
);

// 设置钱包连接中状态的派生原子
export const setWalletConnectingAtom = atom(
  null,
  (get, set, isConnecting: boolean) => {
    const currentState = get(walletModalStateAtom);
    set(walletModalStateAtom, {
      ...currentState,
      isConnecting,
    });
  }
);

// 设置钱包错误状态的派生原子
export const setWalletErrorAtom = atom(
  null,
  (get, set, error: string) => {
    const currentState = get(walletModalStateAtom);
    set(walletModalStateAtom, {
      ...currentState,
      error,
    });
  }
);

// 连接钱包成功的派生原子
export const connectWalletSuccessAtom = atom(
  null,
  (get, set, { address, chainId }: { address: string; chainId?: number }) => {
    // 更新钱包状态
    set(walletStateAtom, {
      isConnected: true,
      address,
      chainId,
    });

    // 关闭弹窗
    set(closeWalletModalAtom);
  }
);

// 断开钱包连接的派生原子
export const disconnectWalletAtom = atom(
  null,
  (get, set) => {
    set(walletStateAtom, {
      isConnected: false,
      address: '',
      chainId: undefined,
    });
  }
);

// 持久化钱包状态到 localStorage 的原子
export const persistedWalletStateAtom = atom(
  (get) => get(walletStateAtom),
  (get, set, newValue: WalletState) => {
    set(walletStateAtom, newValue);
    
    // 同步到 localStorage
    if (typeof window !== 'undefined') {
      if (newValue.isConnected && newValue.address) {
        localStorage.setItem('walletAuth', 'true');
        localStorage.setItem('walletAuthAddress', newValue.address);
      } else {
        localStorage.removeItem('walletAuth');
        localStorage.removeItem('walletAuthAddress');
      }
    }
  }
);

// 从 localStorage 恢复钱包状态的原子
export const loadWalletStateAtom = atom(
  null,
  (get, set) => {
    if (typeof window !== 'undefined') {
      const savedAuth = localStorage.getItem('walletAuth');
      const savedAddress = localStorage.getItem('walletAuthAddress');
      const token = localStorage.getItem('token');

      if (savedAuth === 'true' && savedAddress && token) {
        set(walletStateAtom, {
          isConnected: true,
          address: savedAddress,
          chainId: undefined,
        });
      }
    }
  }
);