import { useRef, useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import { DonationActivityList, formatINR } from '../components/dashboard/DonationCard';
import ImpactTracker from '../components/dashboard/ImpactTracker';
import Button from '../components/ui/Button';
import { getStoredDonations } from '../data/mockDonations';

// ─── Greeting Helper ──────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ─── Welcome Section ──────────────────────────────────────────────────────────
function WelcomeSection({ firstName }) {
  const navigate = useNavigate();

  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#2F7D5B] mb-1">
          Donor Portal
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1D2925] leading-tight">
          {getGreeting()}, {firstName} 👋
        </h2>
        <p className="text-[#68746F] text-sm mt-1 max-w-md leading-relaxed">
          Track where your contributions go and see the verified progress they make.
        </p>
      </div>

      <Button
        variant="primary"
        size="md"
        onClick={() => navigate('/causes')}
        aria-label="Explore verified causes"
        className="shrink-0 self-start sm:self-auto shadow-xs"
      >
        <Heart className="w-4 h-4" />
        Explore Causes
      </Button>
    </div>
  );
}

// ─── Unified Giving Overview ──────────────────────────────────────────────────
function UnifiedGivingOverview({ donations }) {
  const totalAmount = donations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const activeCount = donations.filter((d) => d.status === 'In Progress' || d.status === 'in-progress').length;
  const completedCount = donations.filter((d) => d.status === 'Completed' || d.status === 'completed').length;
  const causesCount = new Set(donations.map((d) => d.cause)).size;

  return (
    <div className="bg-white rounded-xl border border-[#E4E8E5] p-5 sm:p-6 shadow-xs mb-8">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#E4E8E5] mb-5">
        <div>
          <h3 className="text-xs font-bold text-[#1D2925] uppercase tracking-wider">
            Your Giving Overview
          </h3>
          <p className="text-xs text-[#68746F] mt-0.5">Summary of contributions and active milestone progress</p>
        </div>
        <span className="hidden sm:inline-block text-[11px] text-[#2F7D5B] font-semibold bg-[#EAF3EE] px-2.5 py-0.5 rounded-full border border-[#C8DFD2]">
          100% Transparent
        </span>
      </div>

      {/* Grid with subtle dividers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-[#E4E8E5]">
        <div className="pt-2 lg:pt-0 lg:px-4 first:pl-0">
          <p className="text-xs font-medium text-[#68746F]">Total Donated</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#1D2925] mt-1.5 tracking-tight">
            {formatINR(totalAmount)}
          </p>
          <p className="text-[11px] text-[#2F7D5B] font-medium mt-1">
            Across {causesCount} initiatives
          </p>
        </div>

        <div className="pt-4 lg:pt-0 lg:px-4">
          <p className="text-xs font-medium text-[#68746F]">Active Donations</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#1D2925] mt-1.5 tracking-tight">
            {activeCount}
          </p>
          <p className="text-[11px] text-[#68746F] mt-1">
            Milestones in progress
          </p>
        </div>

        <div className="pt-4 lg:pt-0 lg:px-4">
          <p className="text-xs font-medium text-[#68746F]">Completed</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#1D2925] mt-1.5 tracking-tight">
            {completedCount}
          </p>
          <p className="text-[11px] text-[#2F7D5B] mt-1">
            Impact achieved
          </p>
        </div>

        <div className="pt-4 lg:pt-0 lg:px-4 last:pr-0">
          <p className="text-xs font-medium text-[#68746F]">Causes Supported</p>
          <p className="text-2xl sm:text-3xl font-bold text-[#1D2925] mt-1.5 tracking-tight">
            {causesCount}
          </p>
          <p className="text-[11px] text-[#68746F] mt-1">
            Verified NGO partners
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const trackerRef = useRef(null);
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const donations = useMemo(() => getStoredDonations(), []);

  // Active donation selected for the Impact Tracker
  const [selectedDonation, setSelectedDonation] = useState(null);

  // Handle cross-page navigation state from My Donations or Cause Details safely
  useEffect(() => {
    const targetId = location.state?.selectedDonationId;
    if (targetId && selectedDonation?.id !== targetId) {
      const target = donations.find((d) => d.id === targetId);
      if (target) {
        setSelectedDonation(target);
        if (location.state.scrollToTracker) {
          setTimeout(() => {
            trackerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 120);
        }
      }
    }
  }, [location.state?.selectedDonationId, location.state?.scrollToTracker, donations, selectedDonation?.id]);

  const handleCheckStatus = (donation) => {
    setSelectedDonation(donation);
    setTimeout(() => {
      trackerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  return (
    <MainLayout title="Dashboard">
      {/* 1. Welcome section with Explore Causes CTA */}
      <WelcomeSection firstName={firstName} />

      {/* 2. Unified Giving Overview */}
      <UnifiedGivingOverview donations={donations} />

      {/* 3. Recent Donations Activity List */}
      <section aria-labelledby="recent-donations-heading" className="mb-2">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2
              id="recent-donations-heading"
              className="text-base font-bold text-[#1D2925]"
            >
              Recent Donations
            </h2>
            <p className="text-xs text-[#68746F] mt-0.5">
              Live transaction records and transparent milestones
            </p>
          </div>
          <button
            onClick={() => navigate('/my-donations')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2F7D5B] hover:text-[#27684C] transition-colors cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <DonationActivityList
          donations={donations}
          onCheckStatus={handleCheckStatus}
          selectedId={selectedDonation?.id}
        />
      </section>

      {/* 4. Donation Impact Tracker on same Dashboard page */}
      <div ref={trackerRef}>
        <ImpactTracker selectedDonation={selectedDonation} />
      </div>
    </MainLayout>
  );
}

export default Dashboard;
