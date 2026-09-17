import { ScanLine, CheckCircle2, Circle } from 'lucide-react';
import { formatINR } from './DonationCard';

/**
 * TRACKER_STEPS — placeholder milestone steps.
 *
 * These are UI scaffolding only.
 * Phase 4 will replace this array with real milestone data
 * from the DonationTracker smart contract events.
 *
 * Do NOT claim these steps reflect actual on-chain events.
 */
const TRACKER_STEPS = [
  { id: 1, label: 'Donation Received',    description: 'Your donation was recorded.' },
  { id: 2, label: 'Milestone Added',       description: 'The NGO created a milestone.' },
  { id: 3, label: 'Milestone Requested',   description: 'Funds have been requested.' },
  { id: 4, label: 'Funds Released',        description: 'Funds transferred to the NGO.' },
];

/**
 * Get how many steps to show as "done" based on mock status.
 * In Phase 4 this will be driven by real contract event data.
 */
function getCompletedSteps(status) {
  if (status === 'completed')    return 4;
  if (status === 'in-progress')  return 2;
  return 0;
}

// ─── Step row ─────────────────────────────────────────────────────────────────
function Step({ step, done, isLast }) {
  return (
    <div className="flex gap-4">
      {/* Indicator column */}
      <div className="flex flex-col items-center">
        <div
          className={[
            'w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors',
            done
              ? 'bg-blue-600 border-blue-600'
              : 'bg-white border-gray-300',
          ].join(' ')}
          aria-hidden="true"
        >
          {done ? (
            <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
          ) : (
            <Circle className="w-3 h-3 text-gray-300" />
          )}
        </div>
        {!isLast && (
          <div
            className={`w-px flex-1 mt-1 mb-1 ${done ? 'bg-blue-300' : 'bg-gray-200'}`}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Content column */}
      <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
        <p
          className={`text-sm font-semibold leading-tight ${
            done ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {step.label}
        </p>
        <p className={`text-xs mt-0.5 ${done ? 'text-gray-500' : 'text-gray-300'}`}>
          {step.description}
        </p>
      </div>
    </div>
  );
}

// ─── ImpactTracker ────────────────────────────────────────────────────────────
/**
 * ImpactTracker — Donation Impact Tracker section.
 *
 * Phase 3: UI scaffolding with placeholder milestone steps.
 * Phase 4: Replace TRACKER_STEPS with real DonationTracker contract events.
 *
 * Props:
 *   selectedDonation — donation object | null
 */
function ImpactTracker({ selectedDonation }) {
  const completedSteps = selectedDonation
    ? getCompletedSteps(selectedDonation.status)
    : 0;

  return (
    <section
      id="donation-tracker"
      aria-label="Donation Impact Tracker"
      className="mt-8 sm:mt-10"
    >
      {/* Section header */}
      <div className="flex items-center gap-2 mb-1">
        <ScanLine className="w-4 h-4 text-blue-600" />
        <h2 className="text-base font-bold text-gray-900">
          Donation Impact Tracker
        </h2>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        See the progress of your selected donation.
      </p>

      {/* Card */}
      <div className="bg-white rounded-xl border border-gray-200">
        {selectedDonation ? (
          <>
            {/* Selected donation header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">
                    Tracking
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatINR(selectedDonation.amount)}
                    <span className="text-gray-500 font-medium text-base ml-2">
                      · {selectedDonation.cause}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {selectedDonation.ngo} · {selectedDonation.date}
                  </p>
                </div>

                {/* Progress fraction */}
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-blue-600">
                    {completedSteps}
                    <span className="text-sm text-gray-400 font-medium">
                      /{TRACKER_STEPS.length}
                  </span>
                  </p>
                  <p className="text-xs text-gray-400">milestones</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${(completedSteps / TRACKER_STEPS.length) * 100}%` }}
                  aria-valuenow={completedSteps}
                  aria-valuemax={TRACKER_STEPS.length}
                  role="progressbar"
                  aria-label="Milestone progress"
                />
              </div>
            </div>

            {/* Steps */}
            <div className="px-6 py-5">
              {TRACKER_STEPS.map((step, i) => (
                <Step
                  key={step.id}
                  step={step}
                  done={i < completedSteps}
                  isLast={i === TRACKER_STEPS.length - 1}
                />
              ))}
            </div>

            {/* Phase 4 notice */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
              <p className="text-xs text-gray-400 leading-relaxed">
                Milestone data shown is a UI placeholder. Real on-chain
                milestone verification will be added in Phase 4.
              </p>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="px-6 py-14 text-center">
            <div
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-4"
              aria-hidden="true"
            >
              <ScanLine className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-600 mb-1">
              No donation selected
            </p>
            <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">
              Click{' '}
              <span className="text-blue-600 font-semibold">Check Status</span>{' '}
              on any donation above to track its progress here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ImpactTracker;
