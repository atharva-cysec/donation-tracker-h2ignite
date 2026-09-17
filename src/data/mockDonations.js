/**
 * mockDonations.js — Frontend mock donation data & local demo persistence.
 *
 * All values are placeholder records for UI development.
 * Stored in localStorage when a user makes a demo donation.
 *
 * currentStep:
 *   1 -> Donation Received
 *   2 -> Milestone Added
 *   3 -> Funds Requested
 *   4 -> Funds Released
 */

export const MOCK_DONATIONS = [
  {
    id: 'donation-001',
    amount: 2000,
    cause: 'Emergency Medical Support',
    ngo: 'Aarogya Aid Foundation',
    status: 'In Progress',
    date: '12 Sep 2026',
    description: 'Surgical support for low-income pediatric patients at district hospitals.',
    currentStep: 2,
  },
  {
    id: 'donation-002',
    amount: 1500,
    cause: 'Digital Literacy & STEM Labs',
    ngo: 'Vidya Vikas Trust',
    status: 'Completed',
    date: '08 Sep 2026',
    description: 'Solar-powered computer labs and digital curriculum for rural schools.',
    currentStep: 4,
  },
  {
    id: 'donation-003',
    amount: 2000,
    cause: 'Nutritious Meal Program',
    ngo: 'Annapoorna Seva Sanstha',
    status: 'In Progress',
    date: '03 Sep 2026',
    description: 'Weekly ration kits and water tanker supplies for drought-hit agrarian families.',
    currentStep: 3,
  },
];

const STORAGE_KEY = 'trustdonate_donations_list';

/**
 * Retrieve current donations (from localStorage if available, or mock default).
 */
export function getStoredDonations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure every item has a currentStep fallback
        return parsed.map((item) => ({
          ...item,
          currentStep: item.currentStep ?? (item.status === 'Completed' ? 4 : 2),
        }));
      }
    }
  } catch (err) {
    console.warn('Could not read stored donations', err);
  }
  return MOCK_DONATIONS;
}

/**
 * Retrieve single donation by ID
 */
export function getDonationById(id) {
  const all = getStoredDonations();
  return all.find((d) => d.id === id) || null;
}

/**
 * Add a simulated demo donation to localStorage.
 */
export function addDemoDonation({ cause, ngo, amount }) {
  const current = getStoredDonations();
  const newRecord = {
    id: `donation-${Date.now().toString().slice(-4)}`,
    amount: Number(amount),
    cause,
    ngo,
    status: 'In Progress',
    date: 'Just now',
    description: `Demo contribution towards verified milestones for ${cause}.`,
    currentStep: 1, // Newly made donation starts at Step 1: Donation Received
  };

  const updated = [newRecord, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Could not persist demo donation', err);
  }
  return newRecord;
}

/**
 * MOCK_STATS — summary numbers for Overview Cards.
 */
export const MOCK_STATS = {
  totalDonated: 5500,
  activeDonations: 2,
  completedDonations: 1,
  causesSupported: 3,
};
