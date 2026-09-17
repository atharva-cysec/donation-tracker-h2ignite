import { ethers } from 'ethers';
import {
  CONTRACT_ADDRESS,
  SEPOLIA_RPC_URL,
  SEPOLIA_RPC_FALLBACKS,
  SEPOLIA_CHAIN_ID,
  DEMO_DONATION_ETH,
} from '../config/blockchain.js';
import DonationTrackerABI from '../contracts/DonationTrackerABI.json' with { type: 'json' };

/**
 * Milestone status mapping matching Solidity enum MilestoneStatus
 * enum MilestoneStatus { Pending, Requested, Released }
 */
export const MILESTONE_STATUS_MAP = {
  0: 'Pending',
  1: 'Requested',
  2: 'Released',
};

// Cached singleton read-only provider to prevent redundant connections
let cachedProvider = null;

/**
 * Returns a read-only ethers provider that works WITHOUT MetaMask.
 * Uses reliable Sepolia JSON-RPC fallback endpoints.
 * Never triggers a wallet popup or requests user signatures.
 */
export function getReadOnlyProvider() {
  if (cachedProvider) {
    return cachedProvider;
  }

  // Primary Sepolia JSON-RPC provider
  try {
    cachedProvider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL, {
      chainId: SEPOLIA_CHAIN_ID,
      name: 'sepolia',
    });
    return cachedProvider;
  } catch (error) {
    console.warn('Failed to initialize primary RPC provider, falling back to secondary:', error);
    const fallbackUrl = SEPOLIA_RPC_FALLBACKS[1] || 'https://rpc.sepolia.org';
    cachedProvider = new ethers.JsonRpcProvider(fallbackUrl, {
      chainId: SEPOLIA_CHAIN_ID,
      name: 'sepolia',
    });
    return cachedProvider;
  }
}

/**
 * Returns an ethers.Contract instance connected to the read-only provider.
 * Guaranteed not to require wallet connection or trigger user signatures.
 */
export function getReadOnlyContract(customProvider = null) {
  const provider = customProvider || getReadOnlyProvider();
  return new ethers.Contract(CONTRACT_ADDRESS, DonationTrackerABI, provider);
}

/**
 * Returns an ethers.Contract instance connected to an active signer for write transactions.
 * @param {ethers.Signer} [customSigner]
 * @returns {Promise<ethers.Contract>}
 */
export async function getWriteContract(customSigner = null) {
  let signer = customSigner;
  if (!signer) {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('An Ethereum wallet extension is required.');
    }
    const browserProvider = new ethers.BrowserProvider(window.ethereum);
    signer = await browserProvider.getSigner();
  }
  return new ethers.Contract(CONTRACT_ADDRESS, DonationTrackerABI, signer);
}

/**
 * Parses contract transaction errors into human-readable messages.
 * Handles user cancellations, insufficient funds, and network errors gracefully.
 * @param {any} error
 * @returns {string}
 */
export function parseContractError(error) {
  if (!error) return 'An unexpected transaction error occurred.';

  // User rejected transaction in MetaMask (EIP-1193 error code 4001)
  if (
    error.code === 4001 ||
    error.info?.error?.code === 4001 ||
    error.message?.toLowerCase().includes('user rejected') ||
    error.message?.toLowerCase().includes('cancelled')
  ) {
    return 'Transaction cancelled. No blockchain donation was submitted.';
  }

  // Insufficient funds for gas or value
  if (
    error.code === 'INSUFFICIENT_FUNDS' ||
    error.message?.toLowerCase().includes('insufficient funds')
  ) {
    return 'Insufficient Sepolia test ETH for this transaction. Please ensure your wallet has at least 0.001 Sepolia ETH plus gas fees.';
  }

  // Pending request already in wallet
  if (error.code === -32002) {
    return 'A wallet request is already pending. Please check your MetaMask extension.';
  }

  return error.reason || error.message || 'Donation transaction failed. Please try again.';
}

/**
 * Submits a real donation transaction to the DonationTracker contract on Sepolia.
 * Calls `donate()` with payable ETH value.
 *
 * @param {Object} options
 * @param {ethers.Signer} [options.signer] - Connected signer
 * @param {string} [options.ethAmount] - ETH amount (defaults to DEMO_DONATION_ETH: "0.001")
 * @param {function} [options.onStatusChange] - Callback with { status, message, transactionHash }
 * @returns {Promise<{ success: boolean, transactionHash: string, blockNumber: number, receipt: any }>}
 */
export async function submitDonation({
  signer = null,
  ethAmount = DEMO_DONATION_ETH,
  onStatusChange = () => {},
} = {}) {
  try {
    onStatusChange('preparing', {
      message: 'Preparing donation...',
    });

    const contract = await getWriteContract(signer);

    onStatusChange('waiting_wallet', {
      message: 'Waiting for wallet confirmation...',
    });

    const value = ethers.parseEther(ethAmount);
    const tx = await contract.donate({ value });

    onStatusChange('submitted', {
      message: 'Transaction submitted...',
      transactionHash: tx.hash,
    });

    onStatusChange('confirming', {
      message: 'Confirming on Sepolia...',
      transactionHash: tx.hash,
    });

    const receipt = await tx.wait(1);

    if (!receipt || receipt.status === 0) {
      throw new Error('Transaction was reverted on the blockchain.');
    }

    onStatusChange('confirmed', {
      message: 'Donation confirmed',
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
    });

    return {
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      receipt,
    };
  } catch (error) {
    const friendlyMsg = parseContractError(error);
    onStatusChange('error', {
      message: friendlyMsg,
      error,
    });
    throw new Error(friendlyMsg);
  }
}

/**
 * Fetch total number of donations recorded on-chain.
 * @returns {Promise<number>}
 */
export async function fetchDonationCount() {
  try {
    const contract = getReadOnlyContract();
    const count = await contract.getDonationCount();
    return Number(count);
  } catch (error) {
    console.error('Error fetching donation count from chain:', error);
    throw error;
  }
}

/**
 * Fetch total number of milestones recorded on-chain.
 * @returns {Promise<number>}
 */
export async function fetchMilestoneCount() {
  try {
    const contract = getReadOnlyContract();
    const count = await contract.milestoneCount();
    return Number(count);
  } catch (error) {
    console.error('Error fetching milestone count from chain:', error);
    throw error;
  }
}

/**
 * Fetch the NGO wallet address that deployed/manages the contract.
 * @returns {Promise<string>}
 */
export async function fetchNgoWallet() {
  try {
    const contract = getReadOnlyContract();
    const address = await contract.ngoWallet();
    return address;
  } catch (error) {
    console.error('Error fetching NGO wallet from chain:', error);
    throw error;
  }
}

/**
 * Fetch a specific donation record by index.
 * @param {number|bigint} index
 * @returns {Promise<{index: number, donor: string, amountWei: string, amountEth: string, timestamp: number, date: string, formattedDate: string}>}
 */
export async function fetchDonation(index) {
  try {
    const contract = getReadOnlyContract();
    const result = await contract.donations(BigInt(index));

    const donor = result[0] || result.donor;
    const rawAmount = result[1] ?? result.amount;
    const rawTimestamp = result[2] ?? result.timestamp;

    const amountWei = rawAmount.toString();
    const amountEth = ethers.formatEther(rawAmount);
    const timestampNum = Number(rawTimestamp);
    const dateObj = new Date(timestampNum * 1000);

    return {
      index: Number(index),
      donor,
      amountWei,
      amountEth,
      timestamp: timestampNum,
      date: dateObj.toISOString(),
      formattedDate: dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  } catch (error) {
    console.error(`Error fetching donation at index ${index}:`, error);
    throw error;
  }
}

/**
 * Fetch a specific milestone record by index.
 * @param {number|bigint} index
 * @returns {Promise<{index: number, description: string, amountWei: string, amountEth: string, statusCode: number, status: string}>}
 */
export async function fetchMilestone(index) {
  try {
    const contract = getReadOnlyContract();
    const result = await contract.milestones(BigInt(index));

    const description = result[0] || result.description;
    const rawAmount = result[1] ?? result.amount;
    const rawStatus = result[2] ?? result.status;

    const statusCode = Number(rawStatus);
    const amountWei = rawAmount.toString();
    const amountEth = ethers.formatEther(rawAmount);

    return {
      index: Number(index),
      description,
      amountWei,
      amountEth,
      statusCode,
      status: MILESTONE_STATUS_MAP[statusCode] || 'Unknown',
    };
  } catch (error) {
    console.error(`Error fetching milestone at index ${index}:`, error);
    throw error;
  }
}

/**
 * Fetch high-level contract overview (donation count, milestone count, NGO wallet) in one call.
 * @returns {Promise<{success: boolean, contractAddress: string, donationCount: number, milestoneCount: number, ngoWallet: string}>}
 */
export async function fetchContractOverview() {
  try {
    const [donationCount, milestoneCount, ngoWallet] = await Promise.all([
      fetchDonationCount(),
      fetchMilestoneCount(),
      fetchNgoWallet(),
    ]);

    return {
      success: true,
      contractAddress: CONTRACT_ADDRESS,
      donationCount,
      milestoneCount,
      ngoWallet,
    };
  } catch (error) {
    console.error('Error fetching contract overview:', error);
    return {
      success: false,
      contractAddress: CONTRACT_ADDRESS,
      donationCount: 0,
      milestoneCount: 0,
      ngoWallet: null,
      error: error.message || 'Failed to query Sepolia contract',
    };
  }
}
