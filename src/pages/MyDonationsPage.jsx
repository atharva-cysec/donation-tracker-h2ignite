import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, Filter } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { DonationActivityList, formatINR } from '../components/dashboard/DonationCard';
import { getStoredDonations } from '../data/mockDonations';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const STATUS_FILTERS = ['All', 'In Progress', 'Completed'];

export default function MyDonationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const allDonations = useMemo(() => getStoredDonations(user?.id), [user?.id]);

  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Top Compact Summary metrics
  const totalAmount = useMemo(
    () => allDonations.reduce((acc, d) => acc + (Number(d.amount) || 0), 0),
    [allDonations]
  );
  const activeCount = useMemo(
    () => allDonations.filter((d) => d.status === 'In Progress' || d.status === 'in-progress').length,
    [allDonations]
  );
  const completedCount = useMemo(
    () => allDonations.filter((d) => d.status === 'Completed' || d.status === 'completed').length,
    [allDonations]
  );

  // Filtered donation list
  const filteredDonations = useMemo(() => {
    return allDonations.filter((d) => {
      const matchesStatus =
        selectedStatus === 'All' ||
        (selectedStatus === 'In Progress' && (d.status === 'In Progress' || d.status === 'in-progress')) ||
        (selectedStatus === 'Completed' && (d.status === 'Completed' || d.status === 'completed'));

      const matchesSearch =
        d.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.ngo.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [allDonations, selectedStatus, searchQuery]);

  // Navigate to /my-donations/:id
  const handleViewDetails = (donation) => {
    navigate(`/my-donations/${donation.id}`);
  };

  // Navigate to /dashboard and focus on the tracker
  const handleTrackDonation = (donation) => {
    navigate('/dashboard', {
      state: {
        selectedDonationId: donation.id,
        scrollToTracker: true,
      },
    });
  };

  return (
    <MainLayout title="My Donations">
      {/* ─── Header ─── */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#2F7D5B]">
            Your Giving History
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1D2925] mt-1">
            My Donations
          </h2>
          <p className="text-xs sm:text-sm text-[#68746F] mt-0.5 leading-relaxed">
            Follow your contributions and see how each one is progressing.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/causes')}
          className="self-start sm:self-auto shrink-0 shadow-xs"
        >
          <Heart className="w-4 h-4" />
          Explore Causes
        </Button>
      </div>

      {/* ─── Compact Summary Bar ─── */}
      <div className="bg-white rounded-xl border border-[#E4E8E5] p-4 sm:p-5 shadow-xs mb-6">
        <div className="grid grid-cols-3 divide-x divide-[#E4E8E5] text-center">
          <div className="px-2 sm:px-4">
            <p className="text-[11px] font-semibold text-[#68746F] uppercase tracking-wider">
              Total Donated
            </p>
            <p className="text-lg sm:text-2xl font-bold text-[#1D2925] mt-1">
              {formatINR(totalAmount)}
            </p>
          </div>
          <div className="px-2 sm:px-4">
            <p className="text-[11px] font-semibold text-[#68746F] uppercase tracking-wider">
              Active
            </p>
            <p className="text-lg sm:text-2xl font-bold text-[#2F7D5B] mt-1">
              {activeCount}
            </p>
          </div>
          <div className="px-2 sm:px-4">
            <p className="text-[11px] font-semibold text-[#68746F] uppercase tracking-wider">
              Completed
            </p>
            <p className="text-lg sm:text-2xl font-bold text-[#1D2925] mt-1">
              {completedCount}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Filter & Search Bar ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {STATUS_FILTERS.map((status) => {
            const isSelected = selectedStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#2F7D5B] text-white shadow-xs'
                    : 'bg-white text-[#68746F] border border-[#E4E8E5] hover:bg-[#F4F6F4] hover:text-[#1D2925]'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#9BAB9E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cause or NGO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E4E8E5] rounded-xl pl-8 pr-3 py-2 text-xs text-[#1D2925] placeholder-[#9BAB9E] focus:outline-none focus:border-[#2F7D5B] focus:ring-1 focus:ring-[#2F7D5B]"
          />
        </div>
      </div>

      {/* ─── Donation History List with Dual Actions (View Details & Track Donation) ─── */}
      <DonationActivityList
        donations={filteredDonations}
        onCheckStatus={handleTrackDonation}
        onViewDetails={handleViewDetails}
        showDualActions={true}
      />
    </MainLayout>
  );
}
