'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getProfile } from '@/lib/api/auth.api';
import { getAccessToken } from '@/lib/auth-tokens';

const PROTECTED_PREFIXES = ['/dashboard', '/project', '/admin'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, setLoading, logout, isAuthenticated } = useAuthStore();

  // Listen for auth failure events from axios interceptor
  useEffect(() => {
    const handleAuthLogout = () => {
      logout();
      router.replace('/login');
    };

    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, [logout, router]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setLoading(false);
      // If on a protected page without token, redirect to login
      if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
        router.replace('/login');
      }
      return;
    }

    // Only fetch profile if not already authenticated
    if (isAuthenticated) {
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
        router.replace('/login');
      });
  }, [setUser, setLoading, logout, router, pathname, isAuthenticated]);

  return <>{children}</>;
}
