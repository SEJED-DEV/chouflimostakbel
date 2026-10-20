"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Who is signed in.
 *
 * One fetch for the whole page, shared through a context, so the navigation
 * and the account pages do not each ask the server the same question.
 */

export interface CurrentProfile {
  id: string;
  handle: string;
  displayName: string;
  email: string | null;
  verified: boolean;
  avatarUrl: string | null;
  bannerUrl: string | null;
  dateOfBirth: string | null;
  /** ISO timestamp. */
  memberSince: string;
  roles: string[];
}

interface AuthState {
  profile: CurrentProfile | null;
  /** True until the first answer arrives. */
  loading: boolean;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<CurrentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      setProfile(data.profile ?? null);
    } catch {
      // A database that is down must not look like a signed-in reader.
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ profile, loading, refresh }),
    [profile, loading, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
