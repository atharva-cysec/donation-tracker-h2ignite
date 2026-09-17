import { ArrowRight } from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
/**
 * Format number as INR currency.
 * e.g. 2000 → "₹2,000"
 */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Status badge config ─────────────────────────────────────────────────────
const STATUS = {
  'in-progress': {
    label: 'In Progress',
    className: 'bg-blue-50 text-blue-700 border border-blue-200',
    dot: 'bg-blue-500',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-50 text-green-700 border border-green-200',
    dot: 'bg-green-500',
  },
  pending: {
    label: 'Pending',
    className: 'bg-gray-100 text-gray-500 border border-gray-200',
    dot: 'bg-gray-400',
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS[status] ?? STATUS.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

// ─── DonationCard ─────────────────────────────────────────────────────────────
/**
 * DonationCard — displays one donation record in a clean, human-readable way.
 *
 * Information hierarchy:
 *   Amount (large) → Cause (bold) → NGO (muted) → Date (muted) → Status badge
 *
 * Props:
 *   donation     — donation object from mockDonations / real data
 *   onCheckStatus — callback(donation) triggered by the button
 *   isSelected   — true when this card is the active tracker selection
 */
function DonationCard({ donation, onCheckStatus, isSelected }) {
  return (
    <article
      className={[
        'bg-white rounded-xl border p-5 flex flex-col gap-4 transition-all duration-150',
        isSelected
          ? 'border-blue-400 ring-2 ring-blue-100 shadow-sm'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm',
      ].join(' ')}
      aria-label={`Donation of ${formatINR(donation.amount)} to ${donation.cause}`}
    >
      {/* Amount + status row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xl font-bold text-gray-900 leading-none">
            {formatINR(donation.amount)}
          </p>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            {donation.cause}
          </p>
        </div>
        <StatusBadge status={donation.status} />
      </div>

      {/* Metadata */}
      <div className="flex flex-col gap-0.5 text-sm">
        <p className="text-gray-500">
          <span className="text-gray-400 text-xs uppercase tracking-wide font-medium mr-1">NGO</span>
          {donation.ngo}
        </p>
        <p className="text-gray-400 text-xs">{donation.date}</p>
      </div>

      {/* Divider + action */}
      <div className="border-t border-gray-100 pt-3">
        <button
          onClick={() => onCheckStatus(donation)}
          aria-label={`Check status of donation to ${donation.cause}`}
          className={[
            'flex items-center gap-1.5 text-sm font-semibold transition-colors duration-150',
            'focus:outline-none focus-visible:underline',
            isSelected
              ? 'text-blue-700'
              : 'text-blue-600 hover:text-blue-800',
          ].join(' ')}
        >
          Check Status
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
}

export default DonationCard;
export { StatusBadge };
