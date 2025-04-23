/**
 * 缩短以太坊地址，显示前几位和后几位
 * @param address 完整的以太坊地址
 * @param startChars 前面保留的字符数，默认为6
 * @param endChars 后面保留的字符数，默认为4
 * @returns 缩短后的地址
 */
export function shortenAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address) return '';
  if (address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * 验证以太坊地址格式是否有效
 * @param address 要验证的以太坊地址
 * @returns 地址是否有效
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * 格式化ETH数额，添加千位分隔符
 * @param value ETH数额字符串
 * @param decimals 保留小数位数，默认为4
 * @returns 格式化后的ETH数额
 */
export function formatEthValue(value: string, decimals: number = 4): string {
  if (!value) return '0';
  
  const parsedValue = parseFloat(value);
  if (isNaN(parsedValue)) return '0';
  
  return parsedValue.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
} 