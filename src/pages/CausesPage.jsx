import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Users,
  ArrowRight,
  Heart,
  BookOpen,
  Utensils,
  LifeBuoy,
  ShieldCheck,
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { MOCK_CAUSES } from '../data/mockCauses';
import { formatINR } from '../components/dashboard/DonationCard';

const CATEGORIES = ['All', 'Medical', 'Education', 'Food Relief', 'Disaster Relief'];

// ─── Visual Illustration / Artwork Banner for Cause Cards ─────────────────────
function CauseVisualBanner({ category, title }) {
  const config = {
    Medical: {
      bg: 'from-[#18332B] to-[#275344]',
      icon: Heart,
      badge: 'bg-[#2F7D5B] text-white',
      accent: 'Medical Care',
    },
    Education: {
      bg: 'from-[#1E2E28] to-[#2E4A3F]',
      icon: BookOpen,
      badge: 'bg-[#2F7D5B] text-white',
      accent: 'Education & STEM',
    },
    'Food Relief': {
      bg: 'from-[#28382E] to-[#394F42]',
      icon: Utensils,
      badge: 'bg-[#2F7D5B] text-white',
      accent: 'Food & Nutrition',
    },
    'Disaster Relief': {
      bg: 'from-[#1B2C24] to-[#284337]',
      icon: LifeBuoy,
      badge: 'bg-[#2F7D5B] text-white',
      accent: 'Emergency Aid',
    },
  }[category] ?? {
    bg: 'from-[#18332B] to-[#275344]',
    icon: Heart,
    badge: 'bg-[#2F7D5B] text-white',
    accent: 'Community',
  };

  const Icon = config.icon;

  return (
    <div
      className={`relative h-44 w-full bg-gradient-to-br ${config.bg} p-5 flex flex-col justify-between overflow-hidden`}
    >
      {/* Subtle organic pattern */}
      <div
        aria-hidden="true"
        className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-white/5 blur-2xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -left-6 -top-6 w-28 h-28 rounded-full bg-[#2F7D5B]/30 blur-xl pointer-events-none"
      />

      {/* Top category & verification badges */}
      <div className="relative z-10 flex items-center justify-between">
        <span
          className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs ${config.badge}`}
        >
          {category}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-black/30 backdrop-blur-xs text-[#C5D9CE] px-2 py-0.5 rounded-full border border-white/10">
          <ShieldCheck className="w-3 h-3 text-[#2F7D5B]" />
          Verified NGO
        </span>
      </div>

      {/* Center thematic visual */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/15 text-white shadow-xs">
          <Icon className="w-5 h-5" strokeWidth={2} />
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-[#8BAA99] font-semibold">
            {config.accent}
          </p>
          <p className="text-white text-xs font-medium truncate max-w-[220px]">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Cause Card Component ─────────────────────────────────────────────────────
function CauseCard({ cause, onView }) {
  const percentage = Math.min(100, Math.round((cause.raisedAmount / cause.targetAmount) * 100));

  return (
    <article className="bg-white rounded-xl border border-[#E4E8E5] overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col">
      {/* 1. Prominent Cause Image / Artwork Banner */}
      <CauseVisualBanner category={cause.category} title={cause.title} />

      {/* 2. Cause Information */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Title */}
          <h3 className="text-base font-bold text-[#1D2925] leading-snug hover:text-[#2F7D5B] transition-colors line-clamp-2">
            {cause.title}
          </h3>

          {/* NGO */}
          <p className="text-xs text-[#68746F] mt-1.5 flex items-center gap-1.5">
            <span className="font-semibold text-[#1D2925]">{cause.ngo}</span>
          </p>

          {/* Short description */}
          <p className="text-xs text-[#68746F] mt-2 leading-relaxed line-clamp-2">
            {cause.shortDescription}
          </p>
        </div>

        {/* 3. Fundraising Progress */}
        <div className="pt-3 border-t border-[#E4E8E5]">
          <div className="flex items-baseline justify-between text-xs mb-1.5">
            <div>
              <span className="text-sm font-bold text-[#1D2925]">
                {formatINR(cause.raisedAmount)}
              </span>
              <span className="text-[#68746F] text-xs font-normal"> raised</span>
            </div>
            <span className="text-[#68746F] text-xs font-medium">
              Goal: {formatINR(cause.targetAmount)}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-[#E4E8E5] rounded-full overflow-hidden mb-2.5">
            <div
              className="h-full bg-[#2F7D5B] rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
              role="progressbar"
              aria-valuenow={percentage}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>

          {/* Bottom metadata + Action */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#68746F] flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#9BAB9E]" />
              <strong>{cause.donorCount}</strong> donors
            </span>

            <button
              onClick={() => onView(cause.id)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F7D5B] hover:text-[#27684C] transition-colors group cursor-pointer"
            >
              <span>View Cause</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Causes Page ──────────────────────────────────────────────────────────────
export default function CausesPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered causes
  const filteredCauses = useMemo(() => {
    return MOCK_CAUSES.filter((cause) => {
      const matchesCategory =
        selectedCategory === 'All' || cause.category === selectedCategory;
      const matchesSearch =
        cause.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cause.ngo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cause.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <MainLayout title="Causes">
      {/* Header Banner */}
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#2F7D5B]">
          Transparent Giving
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1D2925] mt-1">
          Explore Verified Causes
        </h2>
        <p className="text-sm text-[#68746F] mt-1 max-w-xl leading-relaxed">
          Support transparent, high-impact initiatives. Every rupee is tied to
          real-world milestones that you can track step by step.
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#2F7D5B] text-white shadow-xs'
                    : 'bg-white text-[#68746F] border border-[#E4E8E5] hover:bg-[#F4F6F4] hover:text-[#1D2925]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#9BAB9E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by cause or NGO..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#E4E8E5] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1D2925] placeholder-[#9BAB9E] focus:outline-none focus:border-[#2F7D5B] focus:ring-1 focus:ring-[#2F7D5B]"
          />
        </div>
      </div>

      {/* Causes Grid */}
      {filteredCauses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCauses.map((cause) => (
            <CauseCard
              key={cause.id}
              cause={cause}
              onView={(id) => navigate(`/causes/${id}`)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-xl border border-dashed border-[#E4E8E5] p-12 text-center max-w-md mx-auto my-8">
          <p className="text-sm font-semibold text-[#1D2925] mb-1">
            No causes match your filter
          </p>
          <p className="text-xs text-[#68746F] mb-4">
            Try adjusting your search terms or select another category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-xs font-semibold text-[#2F7D5B] hover:underline"
          >
            Reset all filters
          </button>
        </div>
      )}
    </MainLayout>
  );
}
