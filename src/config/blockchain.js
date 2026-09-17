/**
 * Centralized Blockchain Configuration for TrustDonate
 * Network: Ethereum Sepolia Testnet
 */

export const CONTRACT_ADDRESS = '0x01Ae3DC72363962F0dCDB7Ab0010E07D16d5F102';
export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_CHAIN_ID_HEX = '0xaa36a7';
export const SEPOLIA_RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com';

export const SEPOLIA_RPC_FALLBACKS = [
  'https://ethereum-sepolia-rpc.publicnode.com',
  'https://rpc.sepolia.org',
  'https://1rpc.io/sepolia',
];

export const SEPOLIA_EXPLORER_URL = 'https://sepolia.etherscan.io';

/**
 * Standard testnet ETH value submitted per blockchain donation demo.
 * The donor's selected INR (₹) amount remains the primary campaign contribution.
 */
export const DEMO_DONATION_ETH = '0.001';

/**
 * Helper to build Etherscan URL for a transaction hash
 * @param {string} txHash
 * @returns {string}
 */
export function getExplorerTxUrl(txHash) {
  if (!txHash) return SEPOLIA_EXPLORER_URL;
  return `${SEPOLIA_EXPLORER_URL}/tx/${txHash}`;
}

/**
 * Helper to build Etherscan URL for an address
 * @param {string} address
 * @returns {string}
 */
export function getExplorerAddressUrl(address) {
  if (!address) return SEPOLIA_EXPLORER_URL;
  return `${SEPOLIA_EXPLORER_URL}/address/${address}`;
}

export const BLOCKCHAIN_CONFIG = {
  contractAddress: CONTRACT_ADDRESS,
  chainId: SEPOLIA_CHAIN_ID,
  chainIdHex: SEPOLIA_CHAIN_ID_HEX,
  rpcUrl: SEPOLIA_RPC_URL,
  rpcFallbacks: SEPOLIA_RPC_FALLBACKS,
  explorerUrl: SEPOLIA_EXPLORER_URL,
  demoDonationEth: DEMO_DONATION_ETH,
  networkName: 'Ethereum Sepolia',
};

export default BLOCKCHAIN_CONFIG;
