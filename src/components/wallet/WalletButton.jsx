import { useState, useRef, useEffect } from 'react';
import { Wallet, AlertCircle, Check, Copy, LogOut, ChevronDown, ExternalLink, X } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

/**
 * Helper to shorten an Ethereum address to 0x1234...ABCD
 */
export function shortenAddress(address) {
  if (!address || typeof address !== 'string') return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletButton() {
  const {
    account,
    isConnected,
    isSepolia,
    isConnecting,
    walletError,
    connectWallet,
    switchToSepolia,
    disconnectWallet,
    clearWalletError,
  } = useWallet();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleCopyAddress = () => {
    if (!account) return;
    navigator.clipboard.writeText(account).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <div className="relative flex items-center gap-2 shrink-0" ref={dropdownRef}>
        {/* Case 1: NOT Connected */}
        {!isConnected && (
          <button
            type="button"
            onClick={connectWallet}
            disabled={isConnecting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#2F7D5B] bg-[#EAF3EE] hover:bg-[#D7E8DE] border border-[#C8DFD2] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7D5B] disabled:opacity-60 cursor-pointer shadow-2xs"
            aria-label="Connect Ethereum Wallet"
          >
            {isConnecting ? (
              <>
                <svg
                  className="animate-spin -ml-0.5 w-3.5 h-3.5 text-[#2F7D5B]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>Connecting…</span>
              </>
            ) : (
              <>
                <Wallet className="w-3.5 h-3.5 text-[#2F7D5B]" strokeWidth={2} />
                <span>Connect Wallet</span>
              </>
            )}
          </button>
        )}

        {/* Case 2: CONNECTED */}
        {isConnected && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Sepolia Status Badge or Switch Action */}
            {isSepolia ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-[#2F7D5B] bg-[#EAF3EE] px-2.5 py-1 rounded-md border border-[#C8DFD2]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D5B]" />
                Sepolia
              </span>
            ) : (
              <button
                type="button"
                onClick={switchToSepolia}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold text-[#B45309] bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] transition-colors cursor-pointer"
                title="Your wallet is not connected to Sepolia. Click to switch."
              >
                <AlertCircle className="w-3 h-3 text-[#B45309]" />
                <span>Switch to Sepolia</span>
              </button>
            )}

            {/* Address Button with Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setDropdownOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium text-[#1D2925] bg-[#FAFAF7] hover:bg-[#F4F6F4] border border-[#E4E8E5] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2F7D5B] cursor-pointer shadow-2xs"
              aria-expanded={dropdownOpen}
              aria-label="Wallet account details"
            >
              <div className="w-2 h-2 rounded-full bg-[#2F7D5B]" />
              <span>{shortenAddress(account)}</span>
              <ChevronDown
                className={`w-3 h-3 text-[#68746F] transition-transform duration-150 ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white border border-[#E4E8E5] p-3 shadow-lg z-50 text-xs space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="pb-2 border-b border-[#E4E8E5]">
                  <p className="text-[10px] uppercase tracking-wider text-[#68746F] font-semibold mb-0.5">
                    Connected Wallet
                  </p>
                  <p className="font-mono text-xs font-semibold text-[#1D2925] truncate">
                    {account}
                  </p>
                  <p className="text-[11px] text-[#68746F] mt-1 flex items-center gap-1">
                    Network:{' '}
                    <strong className={isSepolia ? 'text-[#2F7D5B]' : 'text-[#B45309]'}>
                      {isSepolia ? 'Ethereum Sepolia' : 'Other Network'}
                    </strong>
                  </p>
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-[#1D2925] hover:bg-[#FAFAF7] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-[#2F7D5B]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#68746F]" />
                      )}
                      <span>{copied ? 'Copied to clipboard' : 'Copy Address'}</span>
                    </span>
                  </button>

                  <a
                    href={`https://sepolia.etherscan.io/address/${account}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-[#1D2925] hover:bg-[#FAFAF7] transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink className="w-3.5 h-3.5 text-[#68746F]" />
                      <span>View on Etherscan</span>
                    </span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      disconnectWallet();
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect Wallet</span>
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Wallet Error Notification Modal ─── */}
      {walletError && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl border border-[#E4E8E5] max-w-sm w-full p-6 shadow-xl text-center animate-in fade-in duration-150">
            <div className="w-10 h-10 rounded-full bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center mx-auto mb-3 text-[#B91C1C]">
              <AlertCircle className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-[#1D2925] mb-1">
              Wallet Connection
            </h3>

            <p className="text-xs text-[#68746F] mb-5 leading-relaxed">
              {walletError}
            </p>

            {walletError.includes('required') && (
              <div className="mb-4 p-3 bg-[#FAFAF7] rounded-xl border border-[#E4E8E5] text-[11px] text-[#68746F] text-left">
                <p className="font-semibold text-[#1D2925] mb-0.5">Need a wallet?</p>
                <p>
                  Install a browser extension like MetaMask to enable Ethereum Sepolia verification.
                </p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#2F7D5B] font-semibold mt-1.5 hover:underline"
                >
                  <span>Install MetaMask</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            <button
              type="button"
              onClick={clearWalletError}
              className="w-full py-2 px-4 rounded-xl bg-[#2F7D5B] text-white text-xs font-bold hover:bg-[#27684C] transition-colors cursor-pointer shadow-xs"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}
