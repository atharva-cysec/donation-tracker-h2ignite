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

export const BLOCKCHAIN_CONFIG = {
  contractAddress: CONTRACT_ADDRESS,
  chainId: SEPOLIA_CHAIN_ID,
  chainIdHex: SEPOLIA_CHAIN_ID_HEX,
  rpcUrl: SEPOLIA_RPC_URL,
  rpcFallbacks: SEPOLIA_RPC_FALLBACKS,
  explorerUrl: SEPOLIA_EXPLORER_URL,
  networkName: 'Ethereum Sepolia',
};

export default BLOCKCHAIN_CONFIG;
