import { useState, useEffect, useCallback } from 'react';
import {
  ScanLine,
  CheckCircle2,
  Circle,
  Clock,
  Info,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  Layers,
  Coins,
  AlertCircle,
} from 'lucide-react';
import { formatINR, StatusBadge } from './DonationCard';
import { fetchContractMilestoneState } from '../../services/contractService';
import {
  getExplorerTxUrl,
  getExplorerAddressUrl,
  CONTRACT_ADDRESS,
} from '../../config/blockchain';

/**
 * Static Demo Stages (used for standard / prototype demo donations)
 */
const DEMO_STAGES = [
  {
    id: 1,
    title: 'Donation Received',
    description: 'Your donation has been recorded.',
    updateTemplate: (ngo) => 'Donation received and registered for verified milestone allocation.',
  },
  {
    id: 2,
    title: 'Milestone Added',
    description: 'The organization added the next funding milestone.',
    updateTemplate: (ngo) => `Milestone documentation and budget submitted by ${ngo}.`,
  },
  {
    id: 3,
    title: 'Funds Requested',
    description: 'The organization requested funds for this milestone.',
    updateTemplate: (ngo) => `Disbursement requested by ${ngo} backed by verified deliverables.`,
  },
  {
    id: 4,
    title: 'Funds Released',
    description: 'Funds will be released after milestone approval.',
    updateTemplate: (ngo) => `Funds released to ${ngo}. Milestone impact achieved.`,
  },
];

export default function ImpactTracker({ selectedDonation }) {
  const isVerified = Boolean(selectedDonation?.blockchain?.verified);

  // On-chain contract state for verified donations
  const [onChainState, setOnChainState] = useState(null);
  const [isLoadingOnChain, setIsLoadingOnChain] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [onChainError, setOnChainError] = useState(null);

  // Fetch real milestone data from Sepolia when a verified donation is selected
  const loadOnChainMilestones = useCallback(async () => {
    if (!isVerified) return;
    setIsLoadingOnChain(true);
    setOnChainError(null);
    try {
      const state = await fetchContractMilestoneState();
      setOnChainState(state);
      setLastRefreshed(new Date());
    } catch (err) {
      console.warn('Could not fetch Sepolia milestones:', err);
      setOnChainError(err.message || 'Failed to query Sepolia contract');
    } finally {
      setIsLoadingOnChain(false);
    }
  }, [isVerified]);

  useEffect(() => {
    if (isVerified) {
      loadOnChainMilestones();
    } else {
      setOnChainState(null);
    }
  }, [isVerified, selectedDonation?.id, loadOnChainMilestones]);

  // Determine stage progression
  let stages = [];
  let currentStepNumber = 1;
  let currentUpdateText = '';

  if (isVerified) {
    const milestones = onChainState?.milestones || [];
    const milestoneCount = milestones.length;
    const hasRequested = milestones.some((m) => m.statusCode >= 1);
    const hasReleased = milestones.some((m) => m.statusCode === 2);

    if (milestoneCount === 0) {
      currentStepNumber = 2;
    } else if (hasReleased) {
      currentStepNumber = 4;
    } else if (hasRequested) {
      currentStepNumber = 3;
    } else {
      currentStepNumber = 2;
    }

    stages = [
      {
        id: 1,
        title: 'Donation Received',
        description: 'Confirmed & verified on Ethereum Sepolia.',
        isCompleted: true,
        isCurrent: false,
      },
      {
        id: 2,
        title: 'Milestone Added',
        description:
          milestoneCount === 0
            ? 'Awaiting first milestone: No on-chain progress milestone has been recorded by the NGO yet.'
            : `${milestoneCount} campaign milestone${milestoneCount > 1 ? 's' : ''} registered on-chain.`,
        isCompleted: milestoneCount > 0,
        isCurrent: milestoneCount === 0,
      },
      {
        id: 3,
        title: 'Funds Requested',
        description:
          milestoneCount === 0
            ? 'Pending milestone creation.'
            : hasRequested || hasReleased
            ? 'NGO requested disbursement backed by verified milestone deliverables.'
            : 'Awaiting NGO disbursement request.',
        isCompleted: hasRequested || hasReleased,
        isCurrent: milestoneCount > 0 && !hasRequested && !hasReleased,
      },
      {
        id: 4,
        title: 'Funds Released',
        description: hasReleased
          ? 'Funds released from smart contract pool to NGO wallet.'
          : 'Funds held securely in smart contract until milestone completion.',
        isCompleted: hasReleased,
        isCurrent: hasRequested && !hasReleased,
      },
    ];

    currentUpdateText =
      onChainState?.stepStatusText ||
      (milestoneCount === 0
        ? 'Awaiting first milestone: No on-chain progress milestone has been recorded by the NGO yet.'
        : `Active milestone stage: ${stages[currentStepNumber - 1]?.title}`);
  } else {
    // Demo mode
    currentStepNumber = selectedDonation
      ? selectedDonation.status === 'Completed' || selectedDonation.status === 'completed'
        ? 4
        : selectedDonation.currentStep || 2
      : 0;

    stages = DEMO_STAGES.map((s) => ({
      ...s,
      isCompleted:
        selectedDonation?.status === 'Completed' || selectedDonation?.status === 'completed'
          ? true
          : s.id < currentStepNumber,
      isCurrent:
        selectedDonation?.status !== 'Completed' &&
        selectedDonation?.status !== 'completed' &&
        s.id === currentStepNumber,
    }));

    currentUpdateText = selectedDonation
      ? (DEMO_STAGES.find((s) => s.id === currentStepNumber) || DEMO_STAGES[0]).updateTemplate(
          selectedDonation.ngo
        )
      : '';
  }

  return (
    <section
      id="donation-tracker"
      aria-label="Donation Impact Tracker"
      className="mt-10"
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-[#2F7D5B]" />
          <h2 className="text-base font-bold text-[#1D2925]">
            Donation Impact Tracker
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {isVerified ? (
            <>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#2F7D5B] bg-[#EAF3EE] border border-[#C8DFD2] px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D5B] animate-pulse" />
                ✓ Verified On-Chain Progress
              </span>
              <button
                type="button"
                onClick={loadOnChainMilestones}
                disabled={isLoadingOnChain}
                title="Refresh on-chain milestone status from Sepolia"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#68746F] hover:text-[#2F7D5B] bg-white border border-[#E4E8E5] hover:border-[#C8DFD2] px-2.5 py-1 rounded-lg transition-colors cursor-pointer disabled:opacity-50 shadow-2xs"
              >
                <RotateCw
                  className={`w-3 h-3 ${isLoadingOnChain ? 'animate-spin text-[#2F7D5B]' : ''}`}
                />
                <span className="hidden sm:inline">
                  {isLoadingOnChain ? 'Refreshing...' : 'Refresh'}
                </span>
              </button>
            </>
          ) : (
            <span className="text-[11px] font-semibold text-[#2F7D5B] bg-[#EAF3EE] border border-[#C8DFD2] px-2.5 py-0.5 rounded-full">
              Demo Progress
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-[#68746F] mb-4">
        {isVerified
          ? 'Track live on-chain milestones and smart contract fund disbursements on Ethereum Sepolia.'
          : 'Follow your contribution from donation to progress.'}
      </p>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-[#E4E8E5] shadow-xs overflow-hidden">
        {selectedDonation ? (
          <div>
            {/* ─── 1. Tracker Header ─── */}
            <div className="p-5 sm:p-6 border-b border-[#E4E8E5] bg-[#FAFAF7]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F7D5B]">
                      {isVerified ? 'On-Chain Donation Impact' : 'Donation Impact'}
                    </span>
                    {isVerified && (
                      <span className="text-[10px] font-mono text-[#68746F] bg-white border border-[#E4E8E5] px-1.5 py-0.2 rounded">
                        Sepolia Testnet
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-[#1D2925] mt-0.5">
                    {formatINR(selectedDonation.amount)}{' '}
                    <span className="text-base font-medium text-[#68746F]">
                      donated to {selectedDonation.cause}
                    </span>
                  </h3>

                  <p className="text-xs text-[#68746F] mt-1">
                    Partner NGO:{' '}
                    <strong className="text-[#1D2925] font-semibold">
                      {selectedDonation.ngo}
                    </strong>{' '}
                    · Contributed on {selectedDonation.date}
                    {isVerified && selectedDonation.blockchain?.testEthAmount && (
                      <span className="text-[#2F7D5B] font-semibold ml-1.5">
                        ({selectedDonation.blockchain.testEthAmount} Sepolia ETH)
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-[#68746F]">
                    <span>Current Status:</span>
                    <StatusBadge status={selectedDonation.status} />
                  </div>
                  <span className="text-xs font-semibold text-[#2F7D5B]">
                    Step {currentStepNumber} of {stages.length}
                  </span>
                </div>
              </div>
            </div>

            {/* ─── 2. Parcel-Tracking Style Timeline ─── */}
            <div className="p-5 sm:p-8">
              {/* Desktop Horizontal Timeline (>= md) */}
              <div className="hidden md:block">
                <div className="relative flex items-start justify-between">
                  {stages.map((stage, idx) => {
                    const isCompleted = stage.isCompleted;
                    const isCurrent = stage.isCurrent;
                    const isLast = idx === stages.length - 1;

                    return (
                      <div key={stage.id} className="flex-1 relative">
                        {/* Connecting horizontal line */}
                        {!isLast && (
                          <div
                            className="absolute top-4 left-8 right-0 h-0.5 -z-0 transition-colors duration-200"
                            style={{
                              backgroundColor: isCompleted ? '#2F7D5B' : '#E4E8E5',
                            }}
                            aria-hidden="true"
                          />
                        )}

                        <div className="relative z-10 flex flex-col items-start pr-4">
                          {/* Circle Icon Badge */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                              isCompleted
                                ? 'bg-[#2F7D5B] border-[#2F7D5B] text-white shadow-xs'
                                : isCurrent
                                ? 'bg-[#EAF3EE] border-[#2F7D5B] text-[#2F7D5B] ring-4 ring-[#EAF3EE]'
                                : 'bg-white border-[#E4E8E5] text-[#9BAB9E]'
                            }`}
                            aria-label={`Step ${stage.id}: ${stage.title}`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
                            ) : isCurrent ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#2F7D5B]" />
                            ) : (
                              <Circle className="w-2.5 h-2.5 text-[#E4E8E5]" />
                            )}
                          </div>

                          {/* Stage Name */}
                          <p
                            className={`text-xs font-bold mt-3 leading-snug ${
                              isCompleted || isCurrent ? 'text-[#1D2925]' : 'text-[#9BAB9E]'
                            }`}
                          >
                            {stage.title}
                          </p>

                          {/* Short Description */}
                          <p
                            className={`text-[11px] mt-1 leading-relaxed ${
                              isCompleted || isCurrent ? 'text-[#68746F]' : 'text-[#9BAB9E]'
                            }`}
                          >
                            {stage.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Vertical Timeline (< md) */}
              <div className="md:hidden space-y-0">
                {stages.map((stage, idx) => {
                  const isCompleted = stage.isCompleted;
                  const isCurrent = stage.isCurrent;
                  const isLast = idx === stages.length - 1;

                  return (
                    <div key={stage.id} className="flex gap-4">
                      {/* Vertical Indicator Column */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 ${
                            isCompleted
                              ? 'bg-[#2F7D5B] border-[#2F7D5B] text-white'
                              : isCurrent
                              ? 'bg-[#EAF3EE] border-[#2F7D5B] text-[#2F7D5B] ring-2 ring-[#EAF3EE]'
                              : 'bg-white border-[#E4E8E5] text-[#9BAB9E]'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
                          ) : isCurrent ? (
                            <span className="w-2 h-2 rounded-full bg-[#2F7D5B]" />
                          ) : (
                            <Circle className="w-2 h-2 text-[#E4E8E5]" />
                          )}
                        </div>

                        {!isLast && (
                          <div
                            className="w-0.5 flex-1 my-1"
                            style={{
                              backgroundColor: isCompleted ? '#2F7D5B' : '#E4E8E5',
                            }}
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      {/* Content Column */}
                      <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                        <p
                          className={`text-xs font-bold leading-tight ${
                            isCompleted || isCurrent ? 'text-[#1D2925]' : 'text-[#9BAB9E]'
                          }`}
                        >
                          {stage.title}
                        </p>
                        <p
                          className={`text-[11px] mt-1 leading-relaxed ${
                            isCompleted || isCurrent ? 'text-[#68746F]' : 'text-[#9BAB9E]'
                          }`}
                        >
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ─── 3. Verified On-Chain Milestones Breakdown (Only when verified) ─── */}
            {isVerified && (
              <div className="border-t border-[#E4E8E5] bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#2F7D5B]" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D2925]">
                      On-Chain Campaign Milestones
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#68746F]">
                    <span>
                      Smart Contract Balance:{' '}
                      <strong className="text-[#1D2925] font-mono font-semibold">
                        {onChainState?.balanceEth || '0.002'} Sepolia ETH
                      </strong>
                    </span>
                  </div>
                </div>

                {/* State A: 0 Milestones on chain */}
                {!onChainState?.milestones || onChainState.milestones.length === 0 ? (
                  <div className="bg-[#FAFAF7] rounded-xl border border-dashed border-[#C8DFD2] p-5 sm:p-6 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#EAF3EE] flex items-center justify-center mx-auto mb-2 text-[#2F7D5B]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <h5 className="text-sm font-bold text-[#1D2925] mb-1">
                      Awaiting First On-Chain Milestone
                    </h5>
                    <p className="text-xs text-[#68746F] max-w-lg mx-auto leading-relaxed mb-3">
                      Your testnet donation has been confirmed and securely pooled in the smart contract.
                      The partner NGO has not registered an on-chain milestone allocation for this campaign yet.
                    </p>

                    <div className="inline-flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#68746F] bg-white px-3 py-1.5 rounded-lg border border-[#E4E8E5]">
                      <span>NGO Wallet:</span>
                      <span className="font-mono font-semibold text-[#1D2925]">
                        {onChainState?.ngoWallet
                          ? `${onChainState.ngoWallet.slice(0, 8)}...${onChainState.ngoWallet.slice(-6)}`
                          : '0x5392...B627'}
                      </span>
                      <span>·</span>
                      <span>Milestones Recorded: 0</span>
                    </div>

                    <p className="text-[11px] text-[#9BAB9E] mt-3">
                      Once the NGO records a milestone via Remix or their admin wallet, click{' '}
                      <strong className="text-[#2F7D5B]">Refresh</strong> above to see it update live.
                    </p>
                  </div>
                ) : (
                  /* State B: 1 or more Milestones on chain */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-3">
                      {onChainState.milestones.map((ms) => {
                        const isPending = ms.statusCode === 0;
                        const isRequested = ms.statusCode === 1;
                        const isReleased = ms.statusCode === 2;

                        return (
                          <div
                            key={ms.index}
                            className="bg-[#FAFAF7] rounded-xl border border-[#E4E8E5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono ${
                                  isReleased
                                    ? 'bg-[#EAF3EE] text-[#2F7D5B] border border-[#C8DFD2]'
                                    : isRequested
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                #{ms.index}
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-[#1D2925]">
                                  {ms.description || `Milestone #${ms.index}`}
                                </h5>
                                <p className="text-[11px] text-[#68746F] mt-0.5 flex items-center gap-1.5">
                                  <span>Allocated:</span>
                                  <span className="font-mono font-semibold text-[#1D2925]">
                                    {ms.amountEth} Sepolia ETH
                                  </span>
                                  <span>·</span>
                                  <span className="text-[#9BAB9E]">
                                    ({ms.amountWei} wei)
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-center">
                              {isReleased ? (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#2F7D5B] bg-[#EAF3EE] border border-[#C8DFD2] px-2.5 py-1 rounded-full">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Funds Released to NGO
                                </span>
                              ) : isRequested ? (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                                  <AlertCircle className="w-3.5 h-3.5" />
                                  Disbursement Requested
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                                  <Clock className="w-3.5 h-3.5" />
                                  Pending Request
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <p className="text-[11px] text-[#68746F] pt-1">
                      Milestones are global campaign objectives funded from the smart contract balance.
                      Disbursements require verified milestone completion by the NGO.
                    </p>
                  </div>
                )}

                {/* Real Transaction Hash Bar */}
                {selectedDonation.blockchain?.transactionHash && (
                  <div className="mt-4 pt-4 border-t border-[#E4E8E5] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#2F7D5B]" />
                      <span className="text-[#68746F]">Your Donation Tx:</span>
                      <span className="font-mono text-[#1D2925]">
                        {selectedDonation.blockchain.transactionHash.slice(0, 10)}...
                        {selectedDonation.blockchain.transactionHash.slice(-8)}
                      </span>
                    </div>

                    <a
                      href={getExplorerTxUrl(selectedDonation.blockchain.transactionHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2F7D5B] hover:text-[#27684C] cursor-pointer"
                    >
                      <span>Verify on Etherscan</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* ─── 4. Current Status Panel & Disclaimer ─── */}
            <div className="border-t border-[#E4E8E5] bg-[#FAFAF7] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#2F7D5B] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#1D2925]">
                    Current Update
                  </p>
                  <p className="text-xs text-[#68746F] mt-0.5 leading-relaxed">
                    {currentUpdateText}
                  </p>
                  {lastRefreshed && isVerified && (
                    <p className="text-[10px] text-[#9BAB9E] mt-0.5">
                      Last checked from Sepolia: {lastRefreshed.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-[#9BAB9E] flex items-center gap-1.5 sm:text-right shrink-0">
                <Info className="w-3.5 h-3.5 text-[#9BAB9E] shrink-0" />
                <span>
                  {isVerified
                    ? 'Smart contract verification records funds custody & release on Sepolia. Real-world delivery is reported by the NGO.'
                    : 'Prototype stage. Milestone updates demonstrate post-donation progress.'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="p-8 sm:p-14 text-center">
            <div
              className="w-11 h-11 rounded-xl bg-[#EAF3EE] flex items-center justify-center mx-auto mb-3 text-[#2F7D5B]"
              aria-hidden="true"
            >
              <ScanLine className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-[#1D2925] mb-1">
              Select a donation above to track its progress
            </p>
            <p className="text-xs text-[#68746F] max-w-sm mx-auto leading-relaxed">
              Click <strong className="text-[#2F7D5B]">Check Status →</strong> on any contribution in your activity history above to view its live stage and milestone progress.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
