import { useRef, useState } from 'react';
import { IndianRupee, Activity, CheckCircle2, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import OverviewCard from '../components/dashboard/OverviewCard';
import DonationCard from '../components/dashboard/DonationCard';
import ImpactTracker from '../components/dashboard/ImpactTracker';
import Button from '../components/ui/Button';
import { MOCK_DONATIONS, MOCK_STATS } from '../data/mockDonations';
import { formatINR } from '../components/dashboard/DonationCard';

// ─── Greeting helper ─────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Welcome section ──────────────────────────────────────────────────────────
function WelcomeSection({ firstName }) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <p className="text-sm text-gray-400 font-medium mb-0.5">{getGreeting()}</p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
          {firstName}
        </h2>
        <p className="text-gray-500 text-sm mt-1.5 max-w-md leading-relaxed">
          Track where your donations go and see the progress they make.
        </p>
      </div>

      <Button
        variant="primary"
        size="md"
        aria-label="Explore available causes"
        className="shrink-0 self-start sm:self-auto"
      >
        <Heart className="w-4 h-4" />
        Explore Causes
      </Button>
    </div>
  );
}

// ─── Overview stats row ───────────────────────────────────────────────────────
function OverviewRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
      <OverviewCard
        icon={<IndianRupee className="w-4 h-4" strokeWidth={2} />}
        label="Total Donated"
        value={formatINR(MOCK_STATS.totalDonated)}
        sub="All time"
      />
      <OverviewCard
        icon={<Activity className="w-4 h-4" strokeWidth={2} />}
        label="Active Donations"
        value={String(MOCK_STATS.activeDonations)}
        sub="In progress"
      />
      <OverviewCard
        icon={<CheckCircle2 className="w-4 h-4" strokeWidth={2} />}
        label="Completed"
        value={String(MOCK_STATS.completedDonations)}
        sub="Fully delivered"
      />
      <OverviewCard
        icon={<Heart className="w-4 h-4" strokeWidth={2} />}
        label="Causes Supported"
        value={String(MOCK_STATS.causesSupported)}
      />
    </div>
  );
}

// ─── Recent Donations section ─────────────────────────────────────────────────
function RecentDonations({ donations, onCheckStatus, selectedId }) {
  return (
    <section aria-labelledby="recent-donations-heading" className="mb-2">
      <div className="flex items-center justify-between mb-4">
        <h2
          id="recent-donations-heading"
          className="text-base font-bold text-gray-900"
        >
          Recent Donations
        </h2>
        <button
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors focus:outline-none focus-visible:underline"
          aria-label="View all donations"
        >
          View all
        </button>
      </div>

      {donations.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <p className="text-sm text-gray-400">No donations yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {donations.map((donation) => (
            <DonationCard
              key={donation.id}
              donation={donation}
              onCheckStatus={onCheckStatus}
              isSelected={selectedId === donation.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Dashboard page ───────────────────────────────────────────────────────────
function Dashboard() {
  const { user } = useAuth();
  const trackerRef = useRef(null);
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  // Selected donation drives the ImpactTracker display
  const [selectedDonation, setSelectedDonation] = useState(null);

  /**
   * handleCheckStatus
   * 1. Sets the selected donation in state (ImpactTracker reads it).
   * 2. Smooth-scrolls to the tracker section.
   *
   * The actual tracker UI and blockchain integration will be
   * connected in Phase 4. The scroll + selection already work now.
   */
  const handleCheckStatus = (donation) => {
    setSelectedDonation(donation);
    setTimeout(() => {
      trackerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <MainLayout title="Dashboard">
      {/* Welcome */}
      <WelcomeSection firstName={firstName} />

      {/* Donation Overview */}
      <OverviewRow />

      {/* Recent Donations */}
      <RecentDonations
        donations={MOCK_DONATIONS}
        onCheckStatus={handleCheckStatus}
        selectedId={selectedDonation?.id}
      />

      {/* Impact Tracker — Phase 3 placeholder, Phase 4 will wire real data */}
      <div ref={trackerRef}>
        <ImpactTracker selectedDonation={selectedDonation} />
      </div>
    </MainLayout>
  );
}

export default Dashboard;
