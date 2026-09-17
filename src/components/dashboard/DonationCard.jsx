import { Link } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle2, AlertCircle, Eye, ScanLine, Heart } from 'lucide-react';

/**
 * Format amount in INR currency format.
 * e.g. 2000 -> "₹2,000"
 */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  'in-progress': {
    label: 'In Progress',
    className: 'bg-[#EAF3EE] text-[#2F7D5B] border border-[#C8DFD2]',
    dot: 'bg-[#2F7D5B]',
    icon: Clock,
  },
  'In Progress': {
    label: 'In Progress',
    className: 'bg-[#EAF3EE] text-[#2F7D5B] border border-[#C8DFD2]',
    dot: 'bg-[#2F7D5B]',
    icon: Clock,
  },
  'completed': {
    label: 'Completed',
    className: 'bg-[#EAF3EE] text-[#27684C] border border-[#C8DFD2]',
    dot: 'bg-[#27684C]',
    icon: CheckCircle2,
  },
  'Completed': {
    label: 'Completed',
    className: 'bg-[#EAF3EE] text-[#27684C] border border-[#C8DFD2]',
    dot: 'bg-[#27684C]',
    icon: CheckCircle2,
  },
  'pending': {
    label: 'Pending',
    className: 'bg-[#F4F6F4] text-[#68746F] border border-[#E4E8E5]',
    dot: 'bg-[#9BAB9E]',
    icon: AlertCircle,
  },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} aria-hidden="true" />
      {cfg.label}
    </span>
  );
}

/**
 * DonationActivityList — Clean containerized activity history table/list.
 * Supports both Dashboard view (single Check Status) and My Donations view (View Details + Track Donation).
 */
export function DonationActivityList({
  donations,
  onCheckStatus,
  onViewDetails,
  selectedId,
  showDualActions = false,
}) {
  if (!donations || donations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-[#E4E8E5] p-10 sm:p-12 text-center shadow-xs">
        <div className="w-10 h-10 rounded-xl bg-[#EAF3EE] flex items-center justify-center mx-auto mb-3 text-[#2F7D5B]">
          <Heart className="w-5 h-5" />
        </div>
        <p className="text-sm font-bold text-[#1D2925] mb-1">
          No donations yet
        </p>
        <p className="text-xs text-[#68746F] max-w-xs mx-auto mb-5 leading-relaxed">
          Explore a cause to make your first contribution and stay connected to its progress.
        </p>
        <Link
          to="/causes"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2F7D5B] hover:bg-[#27684C] px-4 py-2 rounded-lg transition-colors shadow-xs"
        >
          <span>Explore Causes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E4E8E5] shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" role="table">
          <thead>
            <tr className="border-b border-[#E4E8E5] bg-[#FAFAF7] text-xs font-semibold text-[#68746F] uppercase tracking-wider">
              <th className="py-3 px-5">Cause</th>
              <th className="py-3 px-4 hidden md:table-cell">Partner NGO</th>
              <th className="py-3 px-4 hidden sm:table-cell">Date</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E8E5]">
            {donations.map((d) => {
              const isSelected = selectedId === d.id;
              return (
                <tr
                  key={d.id}
                  className={`transition-colors duration-150 ${
                    isSelected ? 'bg-[#EAF3EE]/60' : 'hover:bg-[#FAFAF7]'
                  }`}
                >
                  <td className="py-4 px-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-[#1D2925] leading-tight">
                        {d.cause}
                      </p>
                      {d.blockchain?.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2F7D5B] bg-[#EAF3EE] px-2 py-0.5 rounded-full border border-[#C8DFD2] shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-[#2F7D5B]" />
                          Verified on blockchain
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#68746F] mt-0.5 md:hidden">
                      {d.ngo} · {d.date}
                    </p>
                  </td>
                  <td className="py-4 px-4 text-[#68746F] hidden md:table-cell text-xs">
                    {d.ngo}
                  </td>
                  <td className="py-4 px-4 text-[#68746F] hidden sm:table-cell text-xs">
                    {d.date}
                  </td>
                  <td className="py-4 px-4 font-bold text-[#1D2925]">
                    {formatINR(d.amount)}
                  </td>
                  <td className="py-4 px-4">
                    <StatusBadge status={d.status} />
                  </td>
                  <td className="py-4 px-5 text-right">
                    {showDualActions ? (
                      <div className="flex items-center justify-end gap-2">
                        {onViewDetails && (
                          <button
                            type="button"
                            onClick={() => onViewDetails(d)}
                            aria-label={`View details of donation to ${d.cause}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#E4E8E5] text-[#1D2925] hover:bg-[#F4F6F4] transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-[#68746F]" />
                            <span>Details</span>
                          </button>
                        )}
                        {onCheckStatus && (
                          <button
                            type="button"
                            onClick={() => onCheckStatus(d)}
                            aria-label={`Track donation to ${d.cause}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#2F7D5B] text-white hover:bg-[#27684C] transition-colors shadow-xs cursor-pointer"
                          >
                            <ScanLine className="w-3 h-3" />
                            <span>Track</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onCheckStatus && onCheckStatus(d)}
                        aria-label={`Check status of donation to ${d.cause}`}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#2F7D5B] text-white shadow-xs'
                            : 'text-[#2F7D5B] hover:bg-[#EAF3EE] hover:text-[#27684C]'
                        }`}
                      >
                        <span>Check Status</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Fallback DonationCard for card-based views
 */
export default function DonationCard({ donation, onCheckStatus, isSelected }) {
  return (
    <article
      className={[
        'bg-white rounded-xl border p-5 flex flex-col gap-4 transition-all duration-150',
        isSelected
          ? 'border-[#2F7D5B] ring-2 ring-[#EAF3EE] shadow-sm'
          : 'border-[#E4E8E5] hover:border-[#9BAB9E] hover:shadow-xs',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xl font-bold text-[#1D2925] leading-none">
            {formatINR(donation.amount)}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <p className="text-sm font-semibold text-[#1D2925]">
              {donation.cause}
            </p>
            {donation.blockchain?.verified && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#2F7D5B] bg-[#EAF3EE] px-2 py-0.5 rounded-full border border-[#C8DFD2] shrink-0">
                <CheckCircle2 className="w-3 h-3" />
                Verified on blockchain
              </span>
            )}
          </div>
        </div>
        <StatusBadge status={donation.status} />
      </div>

      <div className="flex flex-col gap-0.5 text-xs text-[#68746F]">
        <p>NGO: <strong className="text-[#1D2925]">{donation.ngo}</strong></p>
        <p>{donation.date}</p>
      </div>

      <div className="border-t border-[#E4E8E5] pt-3">
        <button
          onClick={() => onCheckStatus(donation)}
          className={`flex items-center gap-1.5 text-xs font-semibold ${
            isSelected ? 'text-[#27684C]' : 'text-[#2F7D5B] hover:text-[#27684C]'
          }`}
        >
          Check Status <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
}
