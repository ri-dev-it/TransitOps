import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'transitops-user';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;

function getStoredUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored);

    if (parsed?.expiresAt && parsed.expiresAt <= Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (!user?.expiresAt) {
      return undefined;
    }

    const remaining = user.expiresAt - Date.now();
    if (remaining <= 0) {
      setUser(null);
      setNotice({ type: 'error', message: 'Session expired. Please log in again.' });
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setUser(null);
      setNotice({ type: 'error', message: 'Session expired. Please log in again.' });
    }, remaining);

    return () => window.clearTimeout(timeout);
  }, [user?.expiresAt]);

  const login = async (email, password, rememberMe = false) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    setIsAuthenticating(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!normalizedEmail || !normalizedPassword) {
      setIsAuthenticating(false);
      throw new Error('Enter both your email and password to continue.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setIsAuthenticating(false);
      throw new Error('Please enter a valid email address.');
    }

    if (normalizedPassword.length < 6) {
      setIsAuthenticating(false);
      throw new Error('Password must be at least 6 characters.');
    }

    const roleMap = {
      'ops@transitops.com': 'fleet-manager',
      'driver@transitops.com': 'driver',
      'safety@transitops.com': 'safety-officer',
      'finance@transitops.com': 'financial-analyst',
    };

    const role = roleMap[normalizedEmail] || 'fleet-manager';
    const displayName = {
      'fleet-manager': 'Avery Patel',
      driver: 'Jordan Lee',
      'safety-officer': 'Mina Chen',
      'financial-analyst': 'Asha Singh',
    }[role];

    const nextUser = {
      id: `${role}-${Date.now()}`,
      email: normalizedEmail,
      name: displayName,
      role,
      avatar: displayName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase(),
      lastLoginAt: new Date().toISOString(),
      expiresAt: rememberMe ? Date.now() + 1000 * 60 * 60 * 24 * 7 : Date.now() + SESSION_DURATION_MS,
    };

    setUser(nextUser);
    setIsAuthenticating(false);
    setNotice({ type: 'success', message: `Welcome back, ${nextUser.name}.` });
    return nextUser;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticating(false);
    setNotice({ type: 'success', message: 'You have been logged out successfully.' });
  };

  const value = useMemo(() => ({
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(user),
    loading,
    isAuthenticating,
    notice,
    clearNotice: () => setNotice(null),
    login,
    logout,
  }), [user, loading, isAuthenticating, notice]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
