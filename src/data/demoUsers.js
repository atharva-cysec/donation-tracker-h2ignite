/**
 * HACKATHON DEMO ACCOUNTS ONLY
 * These plaintext credentials exist only for the TrustDonate prototype.
 * Do not use this authentication approach in production.
 */

export const demoUsers = [
  {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@trustdonate.test',
    password: 'Demo@123',
    createdAt: '2026-09-17T00:00:00.000Z',
  },
  {
    id: 'demo-aarav',
    name: 'Aarav Sharma',
    email: 'aarav@trustdonate.test',
    password: 'Aarav@123',
    createdAt: '2026-09-17T00:00:00.000Z',
  },
  {
    id: 'demo-riya',
    name: 'Riya Mehta',
    email: 'riya@trustdonate.test',
    password: 'Riya@123',
    createdAt: '2026-09-17T00:00:00.000Z',
  },
  {
    id: 'demo-kabir',
    name: 'Kabir Verma',
    email: 'kabir@trustdonate.test',
    password: 'Kabir@123',
    createdAt: '2026-09-17T00:00:00.000Z',
  },
  {
    id: 'demo-meera',
    name: 'Meera Joshi',
    email: 'meera@trustdonate.test',
    password: 'Meera@123',
    createdAt: '2026-09-17T00:00:00.000Z',
  },
];

/**
 * Check if an email matches any demo account (case-insensitive).
 */
export function isDemoEmail(email) {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return demoUsers.some((u) => u.email.toLowerCase() === normalized);
}

/**
 * Find demo user by matching email and password.
 */
export function findDemoUser(email, password) {
  if (!email || !password) return null;
  const normalized = email.trim().toLowerCase();
  return (
    demoUsers.find(
      (u) => u.email.toLowerCase() === normalized && u.password === password
    ) || null
  );
}
