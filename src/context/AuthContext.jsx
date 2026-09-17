import { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// ─── Storage Key ──────────────────────────────────────────────────────────────
const STORAGE_KEY = 'trustdonate_user';
const ACCOUNTS_KEY = 'trustdonate_accounts';

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

      // Check if account already exists
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
        // In production this would be hashed. Frontend demo only.
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
   * Login — validates credentials against stored accounts.
   * Returns { success, error }.
   */
  const login = useCallback(
    (email, password) => {
      const normalizedEmail = email.trim().toLowerCase();

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
