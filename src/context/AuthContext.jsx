import { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const STORAGE_KEY = 'trustdonate_user';
const ACCOUNTS_KEY = 'trustdonate_accounts';

// ─── DEMO-ONLY authentication — remove before production. ─────────────────────
const DEMO_ACCOUNT = {
  id: 'demo-user-static-id',
  name: 'Demo User',
  email: 'demo@trustdonate.test',
  password: 'Demo@123',
  createdAt: '2026-09-17T00:00:00.000Z',
};

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the application and exposes auth state + methods.
 *
 * Authentication is frontend-only (localStorage) for Phase 1.
 * Real backend / blockchain integration will replace this in later phases.
 */
export function AuthProvider({ children }) {
  // Currently logged-in user session
  const [user, setUser, removeUser] = useLocalStorage(STORAGE_KEY, null);
  // All registered accounts (mock "database")
  const [accounts, setAccounts] = useLocalStorage(ACCOUNTS_KEY, []);

  const isAuthenticated = Boolean(user);

  /**
   * Signup — creates a new account and saves it.
   * Returns { success, error }.
   */
  const signup = useCallback(
    (name, email, password) => {
      const normalizedEmail = email.trim().toLowerCase();

      // Prevent using the reserved demo email
      if (normalizedEmail === DEMO_ACCOUNT.email.toLowerCase()) {
        return {
          success: false,
          error: 'This email is reserved for the platform demo account.',
        };
      }

      // Check if account already exists in registered accounts
      const exists = accounts.some(
        (acc) => acc.email.toLowerCase() === normalizedEmail
      );
      if (exists) {
        return {
          success: false,
          error: 'An account with this email already exists.',
        };
      }

      const newAccount = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        password,
        createdAt: new Date().toISOString(),
      };

      setAccounts((prev) => [...prev, newAccount]);

      // After signup, log the user in immediately
      setUser({
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        createdAt: newAccount.createdAt,
      });

      return { success: true, error: null };
    },
    [accounts, setAccounts, setUser]
  );

  /**
   * Login — validates credentials against demo account and stored accounts.
   * Returns { success, error }.
   */
  const login = useCallback(
    (email, password) => {
      const normalizedEmail = email.trim().toLowerCase();

      // DEMO-ONLY authentication — remove before production.
      // Allows hardcoded evaluation login even if localStorage was cleared.
      if (
        normalizedEmail === DEMO_ACCOUNT.email.toLowerCase() &&
        password === DEMO_ACCOUNT.password
      ) {
        setUser({
          id: DEMO_ACCOUNT.id,
          name: DEMO_ACCOUNT.name,
          email: DEMO_ACCOUNT.email,
          createdAt: DEMO_ACCOUNT.createdAt,
        });
        return { success: true, error: null };
      }

      // Check registered accounts created through Signup
      const account = accounts.find(
        (acc) =>
          acc.email.toLowerCase() === normalizedEmail &&
          acc.password === password
      );

      if (!account) {
        return {
          success: false,
          error: 'Invalid email or password.',
        };
      }

      setUser({
        id: account.id,
        name: account.name,
        email: account.email,
        createdAt: account.createdAt,
      });

      return { success: true, error: null };
    },
    [accounts, setUser]
  );

  /**
   * Logout — clears the session.
   */
  const logout = useCallback(() => {
    removeUser();
  }, [removeUser]);

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth — consume auth context.
 * Must be used inside <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
