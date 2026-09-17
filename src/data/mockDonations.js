/**
 * mockDonations.js — Frontend mock donation data & per-user demo persistence.
 *
 * All values are placeholder records for UI development.
 * Stored in localStorage keyed by userId when a user makes a demo donation.
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
    userId: 'demo-user',
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
    userId: 'demo-user',
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
    userId: 'demo-user',
    amount: 2000,
    cause: 'Nutritious Meal Program',
    ngo: 'Annapoorna Seva Sanstha',
    status: 'In Progress',
    date: '03 Sep 2026',
    description: 'Weekly ration kits and water tanker supplies for drought-hit agrarian families.',
    currentStep: 3,
  },
];

const LEGACY_STORAGE_KEY = 'trustdonate_donations_list';

function isDemoUser(id) {
  return id === 'demo-user' || id === 'demo-user-static-id';
}

function getActiveUserId(explicitUserId) {
  if (explicitUserId) return explicitUserId;
  try {
    const saved = localStorage.getItem('trustdonate_user');
    if (saved) {
      const user = JSON.parse(saved);
      return user?.id || null;
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Retrieve current donations for a specific user.
 * - For demo-user: returns seeded demo donations or stored custom donations.
 * - For other demo users (Aarav, Riya, Kabir, Meera) or signup accounts:
 *   returns their isolated donation history (or empty array if none yet).
 */
export function getStoredDonations(explicitUserId) {
  const targetUserId = getActiveUserId(explicitUserId);

  // If no user is identified, return empty array
  if (!targetUserId) {
    return [];
  }

  // 1. Check user-specific storage key first
  const userStorageKey = `trustdonate_donations_${targetUserId}`;
  try {
    const userSaved = localStorage.getItem(userStorageKey);
    if (userSaved) {
      const parsed = JSON.parse(userSaved);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({
          ...item,
          currentStep: item.currentStep ?? (item.status === 'Completed' ? 4 : 2),
        }));
      }
    }
  } catch (err) {
    console.warn(`Could not read stored donations for ${targetUserId}`, err);
  }

  // 2. If this is Demo User, check legacy key or return MOCK_DONATIONS
  if (isDemoUser(targetUserId)) {
    try {
      const legacySaved = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacySaved) {
        const parsed = JSON.parse(legacySaved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item) => ({
            ...item,
            currentStep: item.currentStep ?? (item.status === 'Completed' ? 4 : 2),
          }));
        }
      }
    } catch (err) {
      console.warn('Could not read legacy stored donations', err);
    }
    return MOCK_DONATIONS;
  }

  // 3. For any other user (Aarav, Riya, Kabir, Meera, or Signup user),
  // new accounts start with no donations yet.
  return [];
}

/**
 * Retrieve single donation by ID, scoped to user if available.
 */
export function getDonationById(id, explicitUserId) {
  const targetUserId = getActiveUserId(explicitUserId);
  if (targetUserId) {
    const userDonations = getStoredDonations(targetUserId);
    const found = userDonations.find((d) => d.id === id);
    if (found) return found;
  }

  // Fallback check for demo-user seeded donations if viewing direct link
  const demoDonations = getStoredDonations('demo-user');
  return demoDonations.find((d) => d.id === id) || null;
}

/**
 * Add a simulated demo donation to localStorage for the target user.
 */
export function addDemoDonation({ cause, ngo, amount, userId, blockchain = null }) {
  const targetUserId = getActiveUserId(userId) || 'demo-user';
  const current = getStoredDonations(targetUserId);
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  const newRecord = {
    id: `donation-${Date.now().toString().slice(-4)}-${randomSuffix}`,
    userId: targetUserId,
    amount: Number(amount),
    cause,
    ngo,
    status: 'In Progress',
    date: 'Just now',
    description: blockchain?.verified
      ? `Contribution towards verified milestones for ${cause}. Recorded on Ethereum Sepolia.`
      : `Demo contribution towards verified milestones for ${cause}.`,
    currentStep: 1, // Newly made donation starts at Step 1: Donation Received
    blockchain: blockchain || null,
  };

  const updated = [newRecord, ...current];
  try {
    localStorage.setItem(`trustdonate_donations_${targetUserId}`, JSON.stringify(updated));
    if (isDemoUser(targetUserId)) {
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(updated));
    }
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
