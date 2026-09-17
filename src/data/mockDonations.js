/**
 * mockDonations.js — frontend mock data for Phase 2B / 3.
 *
 * All values are placeholder records for UI development.
 * Replace with real application / blockchain data in Phase 4.
 *
 * status values: 'in-progress' | 'completed' | 'pending'
 */

export const MOCK_DONATIONS = [
  {
    id: 'donation-001',
    amount: 2000,
    cause: 'Medical Assistance',
    ngo: 'ABC Foundation',
    status: 'in-progress',
    date: '12 Sep 2026',
    description: 'Surgical support for low-income patients at district hospitals.',
  },
  {
    id: 'donation-002',
    amount: 1500,
    cause: 'Education Support',
    ngo: 'Vidya Trust',
    status: 'completed',
    date: '08 Sep 2026',
    description: 'School supplies and tuition aid for underprivileged children.',
  },
  {
    id: 'donation-003',
    amount: 2000,
    cause: 'Food Relief',
    ngo: 'Annapoorna NGO',
    status: 'in-progress',
    date: '03 Sep 2026',
    description: 'Nutritious meals for displaced families in flood-affected regions.',
  },
];

/**
 * MOCK_STATS — summary numbers for Overview Cards.
 * Replace with aggregated real data in Phase 4.
 */
export const MOCK_STATS = {
  totalDonated: 5500,
  activeDonations: 2,
  completedDonations: 1,
  causesSupported: 3,
};
