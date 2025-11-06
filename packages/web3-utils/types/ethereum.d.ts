// 扩展 Window 接口以包含以太坊钱包提供者
interface EthereumProvider {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isWalletConnect?: boolean;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
  request: (request: { method: string; params?: unknown[] }) => Promise<unknown>;
  selectedAddress?: string;
}

interface Window {
  ethereum?: EthereumProvider;
}
