import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Lock, ExternalLink, Calendar, Heart, CircleHelp } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import ImpactTracker from '../components/dashboard/ImpactTracker';
import { formatINR, StatusBadge } from '../components/dashboard/DonationCard';
import { getDonationById } from '../data/mockDonations';
import Button from '../components/ui/Button';

export default function DonationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const donation = getDonationById(id);

  if (!donation) {
    return (
      <MainLayout title="Donation Details">
        <div className="bg-white rounded-xl border border-[#E4E8E5] p-12 text-center max-w-md mx-auto my-12 shadow-xs">
          <p className="text-base font-bold text-[#1D2925] mb-1">
            Donation Not Found
          </p>
          <p className="text-xs text-[#68746F] mb-6">
            The donation record you requested does not exist or was removed.
          </p>
          <Button variant="primary" onClick={() => navigate('/my-donations')}>
            Back to My Donations
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Donation Details">
      {/* Back button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/my-donations')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#68746F] hover:text-[#2F7D5B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Donations</span>
        </button>

        <button
          onClick={() =>
            navigate('/dashboard', {
              state: {
                selectedDonationId: donation.id,
                scrollToTracker: true,
              },
            })
          }
          className="text-xs font-semibold text-[#2F7D5B] hover:underline cursor-pointer"
        >
          View in Dashboard Tracker →
        </button>
      </div>

      {/* ─── Donation Overview Summary Card ─── */}
      <div className="bg-white rounded-xl border border-[#E4E8E5] p-6 sm:p-7 shadow-xs mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#E4E8E5]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F7D5B] bg-[#EAF3EE] px-2.5 py-0.5 rounded-full">
                Contribution Record
              </span>
              <StatusBadge status={donation.status} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#1D2925] leading-snug">
              {donation.cause}
            </h1>

            <p className="text-xs text-[#68746F] mt-1.5 flex items-center gap-2">
              Partner NGO: <strong className="text-[#1D2925] font-semibold">{donation.ngo}</strong>
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-xs text-[#68746F] font-medium block mb-0.5">
              Contributed Amount
            </span>
            <p className="text-3xl font-bold text-[#1D2925] leading-none">
              {formatINR(donation.amount)}
            </p>
            <p className="text-xs text-[#9BAB9E] mt-1 flex items-center sm:justify-end gap-1">
              <Calendar className="w-3 h-3" />
              {donation.date}
            </p>
          </div>
        </div>

        {donation.description && (
          <div className="pt-4 text-xs text-[#68746F] leading-relaxed">
            <span className="font-semibold text-[#1D2925]">Impact Scope: </span>
            {donation.description}
          </div>
        )}
      </div>

      {/* ─── Donation Progress (Using the Signature ImpactTracker Component) ─── */}
      <div className="mb-8">
        <ImpactTracker selectedDonation={donation} />
      </div>

      {/* ─── Verification Placeholder ─── */}
      <section
        aria-label="Blockchain Verification Status"
        className="bg-white rounded-xl border border-[#E4E8E5] p-5 sm:p-6 shadow-xs"
      >
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#F4F6F4] border border-[#E4E8E5] flex items-center justify-center text-[#68746F] shrink-0 mt-0.5">
            <Lock className="w-4 h-4 text-[#68746F]" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[#1D2925]">
                Verification
              </h3>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#68746F] bg-[#F4F6F4] px-2 py-0.5 rounded border border-[#E4E8E5]">
                Smart Contract Prepared
              </span>
            </div>

            <p className="text-xs text-[#68746F] mt-1 leading-relaxed">
              Blockchain verification will be available when this donation is connected to the TrustDonate smart contract.
            </p>

            <p className="text-[11px] text-[#9BAB9E] mt-2">
              Future on-chain state: Verified on Sepolia Ethereum · Immutable audit trail
            </p>
          </div>
        </div>
      </section>

      {/* ─── Subtle Quick Help Action ─── */}
      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={() =>
            navigate('/support', {
              state: { preselectedDonationId: donation.id },
            })
          }
          className="text-xs text-[#68746F] hover:text-[#2F7D5B] transition-colors inline-flex items-center gap-1.5 cursor-pointer underline-offset-2 hover:underline"
        >
          <CircleHelp className="w-3.5 h-3.5" />
          <span>Need help with this donation?</span>
        </button>
      </div>
    </MainLayout>
  );
}
