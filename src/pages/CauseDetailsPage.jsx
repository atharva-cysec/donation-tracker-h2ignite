import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShieldCheck,
  Users,
  MapPin,
  Heart,
  CheckCircle2,
  X,
  Sparkles,
  Wallet,
  AlertCircle,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import { MOCK_CAUSES } from '../data/mockCauses';
import { formatINR } from '../components/dashboard/DonationCard';
import { addDemoDonation } from '../data/mockDonations';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../context/WalletContext';
import { submitDonation } from '../services/contractService';
import {
  DEMO_DONATION_ETH,
  SEPOLIA_CHAIN_ID,
  getExplorerTxUrl,
} from '../config/blockchain';

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

export default function CauseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const cause = MOCK_CAUSES.find((c) => c.id === id);

  // Donation state
  const [selectedAmount, setSelectedAmount] = useState(2000);
  const [customAmount, setCustomAmount] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [donationSuccess, setDonationSuccess] = useState(null);

  // Blockchain transaction states
  const [_txStatus, setTxStatus] = useState(null); // 'preparing' | 'waiting_wallet' | 'submitted' | 'confirming' | 'confirmed' | 'error'
  const [txStatusMessage, setTxStatusMessage] = useState('');
  const [txHash, setTxHash] = useState(null);
  const [txError, setTxError] = useState(null);

  const { account, isConnected, isSepolia, connectWallet, switchToSepolia, getSigner } = useWallet();

  if (!cause) {
    return (
      <MainLayout title="Cause Not Found">
        <div className="bg-white rounded-xl border border-[#E4E8E5] p-12 text-center max-w-md mx-auto my-12">
          <p className="text-base font-bold text-[#1D2925] mb-2">Cause not found</p>
          <p className="text-xs text-[#68746F] mb-6">
            The cause you are looking for does not exist or has concluded.
          </p>
          <Button variant="primary" onClick={() => navigate('/causes')}>
            Back to All Causes
          </Button>
        </div>
      </MainLayout>
    );
  }

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;
  const percentage = Math.min(100, Math.round((cause.raisedAmount / cause.targetAmount) * 100));

  const handleSelectPreset = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(val);
    if (val) {
      setSelectedAmount(Number(val));
    }
  };

  const handleOpenConfirm = () => {
    if (effectiveAmount > 0) {
      setTxStatus(null);
      setTxStatusMessage('');
      setTxHash(null);
      setTxError(null);
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmDonation = async () => {
    setTxError(null);

    // 1. If wallet not connected, prompt to connect
    if (!isConnected) {
      const res = await connectWallet();
      if (!res.success) {
        setTxError(res.error || 'Please connect your Ethereum wallet to continue.');
        return;
      }
    }

    // 2. If connected but wrong network, prompt to switch
    if (!isSepolia) {
      const switchRes = await switchToSepolia();
      if (!switchRes.success) {
        setTxError(switchRes.error || 'Please switch your wallet network to Ethereum Sepolia.');
        return;
      }
    }

    setIsSubmitting(true);
    setTxStatus('preparing');
    setTxStatusMessage('Preparing donation...');

    try {
      const signer = await getSigner();
      if (!signer) {
        throw new Error('Unable to access wallet signer. Please unlock MetaMask.');
      }

      const result = await submitDonation({
        signer,
        ethAmount: DEMO_DONATION_ETH,
        onStatusChange: (statusKey, details) => {
          setTxStatus(statusKey);
          if (details?.message) setTxStatusMessage(details.message);
          if (details?.transactionHash) setTxHash(details.transactionHash);
        },
      });

      // Real transaction confirmed on Sepolia!
      const currentAccount = account || (await signer.getAddress());
      const blockchainMetadata = {
        verified: true,
        network: 'Ethereum Sepolia',
        chainId: SEPOLIA_CHAIN_ID,
        transactionHash: result.transactionHash,
        walletAddress: currentAccount,
        testEthAmount: DEMO_DONATION_ETH,
      };

      const record = addDemoDonation({
        cause: cause.title,
        ngo: cause.ngo,
        amount: effectiveAmount,
        userId: user?.id,
        blockchain: blockchainMetadata,
      });

      setIsSubmitting(false);
      setIsConfirmModalOpen(false);
      setDonationSuccess(record);
    } catch (err) {
      console.error('Donation submission error:', err);
      setIsSubmitting(false);
      setTxError(err.message || 'Donation transaction could not be completed.');
      setTxStatus('error');
    }
  };

  return (
    <MainLayout title="Cause Details">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/causes')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#68746F] hover:text-[#2F7D5B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Causes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Left & Center Column: Cause Narrative & Details ─── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-xl border border-[#E4E8E5] p-6 sm:p-8 shadow-xs">
            {/* Top metadata tags */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-[#EAF3EE] text-[#2F7D5B] px-3 py-0.5 rounded-full">
                {cause.category}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-[#F4F6F4] text-[#68746F] px-2.5 py-0.5 rounded-full border border-[#E4E8E5]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2F7D5B]" />
                Verified Non-Profit
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1D2925] leading-snug">
              {cause.title}
            </h1>

            {/* NGO & Location */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#68746F]">
              <p>
                Organized by: <strong className="text-[#1D2925] font-semibold">{cause.ngo}</strong>
              </p>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#9BAB9E]" />
                {cause.location}
              </span>
            </div>

            {/* Visual banner */}
            <div className="mt-6 h-56 rounded-xl bg-gradient-to-br from-[#18332B] via-[#24493D] to-[#2F7D5B] p-6 text-white flex flex-col justify-between relative overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none"
              />
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C5D9CE]">
                  <Heart className="w-4 h-4 text-[#C5D9CE]" />
                  Direct Community Support
                </div>
                <span className="text-xs bg-black/30 backdrop-blur-xs px-3 py-1 rounded-full text-white font-medium border border-white/10">
                  {cause.beneficiaries}
                </span>
              </div>
              <div className="relative z-10">
                <p className="text-xs text-[#8BAA99] uppercase tracking-wider font-semibold">
                  Make an Impact
                </p>
                <p className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  Your contribution helps move this cause closer to its goal
                </p>
              </div>
            </div>
          </div>

          {/* Description & Narrative */}
          <div className="bg-white rounded-xl border border-[#E4E8E5] p-6 sm:p-8 shadow-xs">
            <h2 className="text-base font-bold text-[#1D2925] mb-3">
              About this Cause
            </h2>
            <p className="text-sm text-[#68746F] leading-relaxed mb-4">
              {cause.fullDescription}
            </p>
            <p className="text-sm text-[#68746F] leading-relaxed">
              When you donate, your support directly empowers {cause.ngo} to deliver tangible assistance. As progress unfolds, each milestone update keeps you connected to how funds are utilized.
            </p>
          </div>

          {/* How contributions create impact */}
          <div className="bg-white rounded-xl border border-[#E4E8E5] p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#2F7D5B]" />
              <h2 className="text-base font-bold text-[#1D2925]">
                How Contributions Create Impact
              </h2>
            </div>
            <p className="text-xs text-[#68746F] mb-6 leading-relaxed">
              Follow the milestone journey planned for this campaign from funding to completion.
            </p>

            <div className="space-y-4">
              {cause.milestones.map((m) => {
                const isCompleted = m.status === 'Completed';
                const isInProgress = m.status === 'In Progress';
                return (
                  <div
                    key={m.step}
                    className="flex items-start gap-4 p-4 rounded-xl border border-[#E4E8E5] bg-[#FAFAF7]"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        isCompleted
                          ? 'bg-[#2F7D5B] text-white'
                          : isInProgress
                          ? 'bg-[#EAF3EE] text-[#2F7D5B] border border-[#2F7D5B]'
                          : 'bg-white border border-[#E4E8E5] text-[#9BAB9E]'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : m.step}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-[#1D2925] truncate">
                          {m.title}
                        </p>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                            isCompleted
                              ? 'bg-[#EAF3EE] text-[#2F7D5B]'
                              : isInProgress
                              ? 'bg-[#EAF3EE] text-[#27684C]'
                              : 'bg-[#F4F6F4] text-[#9BAB9E]'
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#68746F] mt-0.5">
                        Allocation target: <strong className="text-[#1D2925]">{m.target}</strong>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Right Column: Donation Action Panel (Sticky) ─── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[#E4E8E5] p-6 shadow-sm sticky top-20 space-y-6">
            {/* Progress stats */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-2xl font-bold text-[#1D2925]">
                  {formatINR(cause.raisedAmount)}
                </span>
                <span className="text-xs text-[#68746F]">
                  Goal: {formatINR(cause.targetAmount)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-[#E4E8E5] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-[#2F7D5B] rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#68746F]">
                <span>{percentage}% of goal reached</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-[#9BAB9E]" />
                  {cause.donorCount} supporters
                </span>
              </div>
            </div>

            <div className="border-t border-[#E4E8E5] pt-5">
              <label className="block text-xs font-bold text-[#1D2925] uppercase tracking-wider mb-2">
                Select Donation Amount
              </label>

              {/* Preset buttons */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                {PRESET_AMOUNTS.map((amt) => {
                  const isSelected = !customAmount && selectedAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleSelectPreset(amt)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#2F7D5B] text-white shadow-xs'
                          : 'bg-white text-[#1D2925] border border-[#E4E8E5] hover:bg-[#F4F6F4]'
                      }`}
                    >
                      {formatINR(amt)}
                    </button>
                  );
                })}
              </div>

              {/* Custom amount */}
              <div className="relative mb-5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[#68746F]">
                  ₹
                </span>
                <input
                  type="text"
                  placeholder="Custom amount"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="w-full bg-white border border-[#E4E8E5] rounded-xl pl-8 pr-4 py-2.5 text-sm font-semibold text-[#1D2925] placeholder-[#9BAB9E] focus:outline-none focus:border-[#2F7D5B] focus:ring-1 focus:ring-[#2F7D5B]"
                />
              </div>

              {/* Primary Donate CTA */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleOpenConfirm}
                disabled={effectiveAmount <= 0}
                className="py-3 text-sm font-bold"
              >
                Donate {effectiveAmount > 0 ? formatINR(effectiveAmount) : ''}
              </Button>

              <p className="text-[11px] text-[#9BAB9E] text-center mt-3 leading-relaxed">
                Testnet demonstration · Submits {DEMO_DONATION_ETH} Sepolia ETH on-chain
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Confirmation Modal ─── */}
      {isConfirmModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-donation-title"
        >
          <div className="bg-white rounded-2xl border border-[#E4E8E5] max-w-md w-full p-6 sm:p-7 shadow-2xl relative">
            <button
              type="button"
              onClick={() => !isSubmitting && setIsConfirmModalOpen(false)}
              disabled={isSubmitting}
              className="absolute top-5 right-5 text-[#9BAB9E] hover:text-[#1D2925] disabled:opacity-40 disabled:cursor-not-allowed p-1 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 id="confirm-donation-title" className="text-lg font-bold text-[#1D2925] mb-1">
              Confirm Your Donation
            </h3>
            <p className="text-xs text-[#68746F] mb-4 leading-relaxed">
              Review your donation details and blockchain transaction before proceeding.
            </p>

            {/* Donation Summary Box */}
            <div className="bg-[#FAFAF7] rounded-xl border border-[#E4E8E5] p-4 space-y-2.5 mb-4 text-xs">
              <div className="flex justify-between">
                <span className="text-[#68746F]">Cause:</span>
                <strong className="text-[#1D2925] text-right max-w-[220px] truncate">
                  {cause.title}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68746F]">Partner Organization:</span>
                <strong className="text-[#1D2925]">{cause.ngo}</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E4E8E5]">
                <span className="text-[#68746F] font-semibold text-sm">Campaign Amount:</span>
                <strong className="text-base font-bold text-[#2F7D5B]">
                  {formatINR(effectiveAmount)}
                </strong>
              </div>
            </div>

            {/* Sepolia Testnet Notice */}
            <div className="bg-[#EAF3EE] rounded-xl border border-[#C8DFD2] p-3 mb-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-[#2F7D5B] mb-1">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Sepolia Blockchain Verification</span>
              </div>
              <p className="text-[#1D2925] leading-relaxed text-[11px]">
                Blockchain demo: this donation will submit {DEMO_DONATION_ETH} Sepolia ETH as a testnet transaction. Your selected {formatINR(effectiveAmount)} amount remains the TrustDonate donation amount.
              </p>
            </div>

            {/* Wallet Status Notice / Connect Prompt */}
            <div className="mb-4">
              {!isConnected ? (
                <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[#92400E]">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-[#D97706]" />
                    <span className="font-medium">Wallet not connected</span>
                  </div>
                  <button
                    type="button"
                    onClick={connectWallet}
                    className="text-xs font-bold text-[#2F7D5B] hover:text-[#27684C] bg-white px-3 py-1.5 rounded-lg border border-[#E4E8E5] shadow-2xs cursor-pointer"
                  >
                    Connect MetaMask
                  </button>
                </div>
              ) : !isSepolia ? (
                <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-3 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[#92400E]">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-[#D97706]" />
                    <span className="font-medium">Wrong network</span>
                  </div>
                  <button
                    type="button"
                    onClick={switchToSepolia}
                    className="text-xs font-bold text-[#2F7D5B] hover:text-[#27684C] bg-white px-3 py-1.5 rounded-lg border border-[#E4E8E5] shadow-2xs cursor-pointer"
                  >
                    Switch to Sepolia
                  </button>
                </div>
              ) : (
                <div className="bg-[#FAFAF7] border border-[#E4E8E5] rounded-xl p-2.5 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#68746F]">
                    <Wallet className="w-3.5 h-3.5 text-[#2F7D5B]" />
                    <span>Wallet:</span>
                    <span className="font-mono text-[#1D2925] font-semibold">
                      {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : ''}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2F7D5B] bg-[#EAF3EE] px-2 py-0.5 rounded-full border border-[#C8DFD2]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D5B]" />
                    Sepolia
                  </span>
                </div>
              )}
            </div>

            {/* In-Flight Transaction State */}
            {isSubmitting && (
              <div className="bg-[#FAFAF7] border border-[#2F7D5B]/30 rounded-xl p-4 mb-4 text-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#2F7D5B] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#1D2925]">
                  {txStatusMessage || 'Processing donation...'}
                </p>
                {txHash && (
                  <p className="text-[11px] text-[#68746F] mt-1 font-mono">
                    Tx: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                  </p>
                )}
                <p className="text-[10px] text-[#9BAB9E] mt-1">
                  Please keep this window open until confirmation completes
                </p>
              </div>
            )}

            {/* Error Message */}
            {txError && (
              <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-xl p-3 mb-4 text-xs text-[#991B1B] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{txError}</p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setIsConfirmModalOpen(false)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleConfirmDonation}
                disabled={isSubmitting}
                loading={isSubmitting}
                className="flex-1"
              >
                {!isConnected
                  ? 'Connect Wallet'
                  : !isSepolia
                  ? 'Switch to Sepolia'
                  : `Confirm Donation (${DEMO_DONATION_ETH} ETH)`}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Success State Modal ─── */}
      {donationSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl border border-[#E4E8E5] max-w-md w-full p-6 sm:p-8 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#EAF3EE] text-[#2F7D5B] flex items-center justify-center mx-auto mb-4 border border-[#C8DFD2]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <span className="inline-block text-[11px] uppercase tracking-wider font-bold text-[#2F7D5B] bg-[#EAF3EE] px-3 py-0.5 rounded-full mb-2 border border-[#C8DFD2]">
              {donationSuccess.blockchain?.verified ? 'Recorded on Blockchain' : 'Contribution Confirmed'}
            </span>

            <h3 className="text-xl font-bold text-[#1D2925] mb-1">
              Thank you for supporting this cause.
            </h3>
            <p className="text-xs text-[#68746F] mb-5 leading-relaxed max-w-xs mx-auto">
              Your contribution doesn't disappear after you donate. Follow its progress and milestone updates directly through your Impact Tracker.
            </p>

            {/* Donation Summary Box */}
            <div className="bg-[#FAFAF7] rounded-xl border border-[#E4E8E5] p-4 text-left space-y-2 mb-4 text-xs">
              <div className="flex justify-between items-baseline">
                <span className="text-[#68746F]">Amount:</span>
                <span className="text-base font-bold text-[#2F7D5B]">
                  {formatINR(donationSuccess.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68746F]">Cause:</span>
                <span className="font-semibold text-[#1D2925] text-right max-w-[200px] truncate">
                  {donationSuccess.cause}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#68746F]">Organization:</span>
                <span className="font-semibold text-[#1D2925]">
                  {donationSuccess.ngo}
                </span>
              </div>
            </div>

            {/* Secondary Blockchain Confirmation */}
            {donationSuccess.blockchain?.verified && (
              <div className="bg-[#FAFAF7] rounded-xl border border-[#C8DFD2] p-3.5 mb-6 text-left text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#E4E8E5]">
                  <span className="font-bold text-[#2F7D5B] flex items-center gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Recorded on Ethereum Sepolia
                  </span>
                  <span className="text-[11px] text-[#68746F] font-semibold">
                    {donationSuccess.blockchain.testEthAmount} Sepolia ETH
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#68746F]">Transaction:</span>
                  <span
                    className="font-mono text-[#1D2925] font-medium"
                    title={donationSuccess.blockchain.transactionHash}
                  >
                    {donationSuccess.blockchain.transactionHash
                      ? `${donationSuccess.blockchain.transactionHash.slice(0, 10)}...${donationSuccess.blockchain.transactionHash.slice(-8)}`
                      : '—'}
                  </span>
                </div>
                <div className="pt-1 text-right">
                  {donationSuccess.blockchain.transactionHash && (
                    <a
                      href={getExplorerTxUrl(donationSuccess.blockchain.transactionHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2F7D5B] hover:text-[#27684C] cursor-pointer"
                    >
                      <span>View on Sepolia Etherscan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() =>
                  navigate('/dashboard', {
                    state: {
                      selectedDonationId: donationSuccess.id,
                      scrollToTracker: true,
                    },
                  })
                }
                fullWidth
              >
                Track Donation
              </Button>
              <Button
                variant="secondary"
                size="md"
                onClick={() => navigate('/my-donations')}
                fullWidth
              >
                View My Donations
              </Button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
