import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

import {
  SEPOLIA_CHAIN_ID,
  SEPOLIA_CHAIN_ID_HEX,
  SEPOLIA_RPC_URL,
  SEPOLIA_EXPLORER_URL,
} from '../config/blockchain';

// Backwards compatibility re-exports
export const SEPOLIA_CHAIN_ID_DEC = SEPOLIA_CHAIN_ID;
export { SEPOLIA_CHAIN_ID_HEX };

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletError, setWalletError] = useState(null);

  const isConnected = Boolean(account);
  const isSepolia = chainId === SEPOLIA_CHAIN_ID_DEC;

  /**
   * Helper to format error messages friendly to non-technical donors
   */
  const parseErrorMessage = (err) => {
    if (!err) return 'An unexpected wallet error occurred.';
    // User rejected request
    if (err.code === 4001 || err.info?.error?.code === 4001) {
      return 'Connection request was cancelled.';
    }
    // Already processing request
    if (err.code === -32002) {
      return 'A wallet request is already pending. Please check your wallet extension.';
    }
    return err.message || 'Failed to connect wallet.';
  };

  /**
   * Connect to injected Ethereum wallet (MetaMask, etc.) via ethers v6
   */
  const connectWallet = useCallback(async () => {
    setWalletError(null);

    // Check if an injected provider exists
    if (typeof window === 'undefined' || !window.ethereum) {
      const msg = 'An Ethereum wallet is required to connect.';
      setWalletError(msg);
      return { success: false, error: msg };
    }

    try {
      setIsConnecting(true);
      const browserProvider = new ethers.BrowserProvider(window.ethereum);

      // Request accounts using BrowserProvider
      const accounts = await browserProvider.send('eth_requestAccounts', []);

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in wallet.');
      }

      const signer = await browserProvider.getSigner();
      const currentAddress = await signer.getAddress();
      const network = await browserProvider.getNetwork();
      const currentChainId = Number(network.chainId);

      setAccount(currentAddress);
      setChainId(currentChainId);
      setIsConnecting(false);

      return {
        success: true,
        account: currentAddress,
        chainId: currentChainId,
        isSepolia: currentChainId === SEPOLIA_CHAIN_ID_DEC,
      };
    } catch (err) {
      setIsConnecting(false);
      const friendlyMsg = parseErrorMessage(err);
      setWalletError(friendlyMsg);
      return { success: false, error: friendlyMsg };
    }
  }, []);

  /**
   * Switch connected network to Ethereum Sepolia (11155111 / 0xaa36a7)
   */
  const switchToSepolia = useCallback(async () => {
    setWalletError(null);

    if (typeof window === 'undefined' || !window.ethereum) {
      const msg = 'An Ethereum wallet is required to connect.';
      setWalletError(msg);
      return { success: false, error: msg };
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      });

      // Chain ID will also be updated via chainChanged event
      setChainId(SEPOLIA_CHAIN_ID_DEC);
      return { success: true };
    } catch (err) {
      // Error code 4902 indicates that the chain has not been added to MetaMask
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID_HEX,
                chainName: 'Sepolia test network',
                nativeCurrency: {
                  name: 'Sepolia Ether',
                  symbol: 'SEP',
                  decimals: 18,
                },
                rpcUrls: [SEPOLIA_RPC_URL],
                blockExplorerUrls: [SEPOLIA_EXPLORER_URL],
              },
            ],
          });
          setChainId(SEPOLIA_CHAIN_ID_DEC);
          return { success: true };
        } catch (addErr) {
          const addMsg = parseErrorMessage(addErr);
          setWalletError(addMsg);
          return { success: false, error: addMsg };
        }
      }

      const friendlyMsg = parseErrorMessage(err);
      setWalletError(friendlyMsg);
      return { success: false, error: friendlyMsg };
    }
  }, []);

  /**
   * Disconnect local wallet session (does not affect TrustDonate auth session)
   */
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setWalletError(null);
  }, []);

  /**
   * Clear any active wallet error notification
   */
  const clearWalletError = useCallback(() => {
    setWalletError(null);
  }, []);

  const parseChainId = (val) => {
    if (!val && val !== 0) return null;
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      return val.startsWith('0x') ? parseInt(val, 16) : parseInt(val, 10);
    }
    return null;
  };

  /**
   * EIP-1193 Event Listeners:
   * Listen to accountsChanged and chainChanged defensively
   */
  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        return;
      }

      const provider = window.ethereum;

      // Safe silent check if user already connected previously
      if (typeof provider.request === 'function') {
        provider
          .request({ method: 'eth_accounts' })
          .then((accounts) => {
            if (accounts && Array.isArray(accounts) && accounts.length > 0) {
              setAccount(accounts[0]);
              provider
                .request({ method: 'eth_chainId' })
                .then((hex) => {
                  const id = parseChainId(hex);
                  if (id) setChainId(id);
                })
                .catch(() => {});
            }
          })
          .catch((e) => {
            console.warn('Could not check eth_accounts:', e);
          });
      }

      const handleAccountsChanged = (accounts) => {
        try {
          if (accounts && Array.isArray(accounts) && accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            // Disconnected or wallet locked
            setAccount(null);
            setChainId(null);
          }
        } catch (err) {
          console.warn('Error handling accountsChanged:', err);
        }
      };

      const handleChainChanged = (newChainIdVal) => {
        try {
          const id = parseChainId(newChainIdVal);
          if (id) setChainId(id);
        } catch (err) {
          console.warn('Error handling chainChanged:', err);
        }
      };

      if (typeof provider.on === 'function') {
        provider.on('accountsChanged', handleAccountsChanged);
        provider.on('chainChanged', handleChainChanged);
      }

      return () => {
        try {
          if (typeof provider.removeListener === 'function') {
            provider.removeListener('accountsChanged', handleAccountsChanged);
            provider.removeListener('chainChanged', handleChainChanged);
          } else if (typeof provider.off === 'function') {
            provider.off('accountsChanged', handleAccountsChanged);
            provider.off('chainChanged', handleChainChanged);
          }
        } catch (e) {
          // Ignore cleanup errors from third-party extensions
        }
      };
    } catch (err) {
      console.warn('Wallet initialization error handled safely:', err);
    }
  }, []);

  const getProvider = useCallback(() => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        return new ethers.BrowserProvider(window.ethereum);
      }
    } catch (e) {
      console.warn('Could not create BrowserProvider:', e);
    }
    return null;
  }, []);

  const getSigner = useCallback(async () => {
    try {
      const p = getProvider();
      if (!p) return null;
      return await p.getSigner();
    } catch (e) {
      console.warn('Could not getSigner:', e);
      return null;
    }
  }, [getProvider]);

  const value = {
    account,
    isConnected,
    chainId,
    isSepolia,
    isConnecting,
    walletError,
    connectWallet,
    switchToSepolia,
    disconnectWallet,
    clearWalletError,
    getProvider,
    getSigner,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
