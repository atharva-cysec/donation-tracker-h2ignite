import { ScanLine, CheckCircle2, Circle, Clock, Info } from 'lucide-react';
import { formatINR, StatusBadge } from './DonationCard';

/**
 * TRACKER_STAGES — Parcel-tracking style milestone stages.
 * Aligned with smart contract lifecycle:
 * 1. Donation Received
 * 2. Milestone Added
 * 3. Funds Requested
 * 4. Funds Released
 */
const TRACKER_STAGES = [
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
  // Determine effective current step (1 to 4)
  const currentStep = selectedDonation
    ? (selectedDonation.status === 'Completed' || selectedDonation.status === 'completed')
      ? 4
      : (selectedDonation.currentStep || 2)
    : 0;

  const currentStageObj = TRACKER_STAGES.find((s) => s.id === currentStep) || TRACKER_STAGES[0];
  const currentUpdateText = selectedDonation
    ? currentStageObj.updateTemplate(selectedDonation.ngo)
    : '';

  return (
    <section
      id="donation-tracker"
      aria-label="Donation Impact Tracker"
      className="mt-10"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-[#2F7D5B]" />
          <h2 className="text-base font-bold text-[#1D2925]">
            Donation Impact Tracker
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-[#2F7D5B] bg-[#EAF3EE] border border-[#C8DFD2] px-2.5 py-0.5 rounded-full">
          Demo Progress
        </span>
      </div>
      <p className="text-xs text-[#68746F] mb-4">
        Follow your contribution from donation to progress.
      </p>

      {/* Main Container */}
      <div className="bg-white rounded-xl border border-[#E4E8E5] shadow-xs overflow-hidden">
        {selectedDonation ? (
          <div>
            {/* ─── 1. Tracker Header ─── */}
            <div className="p-5 sm:p-6 border-b border-[#E4E8E5] bg-[#FAFAF7]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F7D5B]">
                    Donation Impact
                  </span>
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
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-[#68746F]">
                    <span>Current Status:</span>
                    <StatusBadge status={selectedDonation.status} />
                  </div>
                  <span className="text-xs font-semibold text-[#2F7D5B]">
                    Step {currentStep} of {TRACKER_STAGES.length}
                  </span>
                </div>
              </div>
            </div>

            {/* ─── 2. Parcel-Tracking Style Timeline ─── */}
            <div className="p-5 sm:p-8">
              {/* Desktop Horizontal Timeline (>= md) */}
              <div className="hidden md:block">
                <div className="relative flex items-start justify-between">
                  {TRACKER_STAGES.map((stage, idx) => {
                    const isCompleted = (selectedDonation.status === 'Completed' || selectedDonation.status === 'completed')
                      ? true
                      : stage.id < currentStep;
                    const isCurrent = !isCompleted && stage.id === currentStep;
                    const isUpcoming = stage.id > currentStep;
                    const isLast = idx === TRACKER_STAGES.length - 1;

                    return (
                      <div key={stage.id} className="flex-1 relative">
                        {/* Connecting horizontal line */}
                        {!isLast && (
                          <div
                            className="absolute top-4 left-8 right-0 h-0.5 -z-0"
                            style={{
                              backgroundColor: (selectedDonation.status === 'Completed' || stage.id < currentStep)
                                ? '#2F7D5B'
                                : '#E4E8E5',
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
                {TRACKER_STAGES.map((stage, idx) => {
                  const isCompleted = (selectedDonation.status === 'Completed' || selectedDonation.status === 'completed')
                    ? true
                    : stage.id < currentStep;
                  const isCurrent = !isCompleted && stage.id === currentStep;
                  const isUpcoming = stage.id > currentStep;
                  const isLast = idx === TRACKER_STAGES.length - 1;

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
                              backgroundColor: (selectedDonation.status === 'Completed' || stage.id < currentStep)
                                ? '#2F7D5B'
                                : '#E4E8E5',
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

            {/* ─── 3. Current Status Panel & Disclaimer ─── */}
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
                </div>
              </div>

              <div className="text-[11px] text-[#9BAB9E] flex items-center gap-1.5 sm:text-right shrink-0">
                <Info className="w-3.5 h-3.5 text-[#9BAB9E] shrink-0" />
                <span>Prototype stage. Milestone updates demonstrate post-donation progress.</span>
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
