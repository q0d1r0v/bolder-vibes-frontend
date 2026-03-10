'use client';

import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { getProfile } from '@/lib/api/auth.api';
import { getAccessToken } from '@/lib/auth-tokens';

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    getProfile()
      .then((user) => {
        setUser(user);
        setLoading(false);
      })
      .catch(() => {
        logout();
      });
  }, [setUser, setLoading, logout]);

  return <>{children}</>;
}
