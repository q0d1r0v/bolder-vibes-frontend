'use client';

import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getAccessToken } from '@/lib/auth-tokens';
import { API_BASE_URL, QUERY_KEYS } from '@/lib/constants';

/**
 * Automatically stops the preview Docker container when the user
 * navigates away from the project page or closes the browser tab.
 * Also resets the cached preview status so re-entering the project
 * shows the idle state instead of a stale URL.
 */
export function usePreviewCleanup(
  projectId: string,
  status: string | undefined,
) {
  const queryClient = useQueryClient();
  const statusRef = useRef(status);
  const projectIdRef = useRef(projectId);

  // Keep refs updated with latest values
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    projectIdRef.current = projectId;
  }, [projectId]);

  useEffect(() => {
    const fireStop = () => {
      const s = statusRef.current;
      if (s !== 'building' && s !== 'ready') return;

      const token = getAccessToken();
      const url = `${API_BASE_URL}/projects/${projectIdRef.current}/sandbox/preview/stop`;

      // fetch with keepalive survives page unload (unlike regular fetch/axios)
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        keepalive: true,
      }).catch(() => {
        // Best-effort — container will eventually be cleaned up by backend TTL
      });
    };

    // Stop container when browser tab / window is closed
    const handleBeforeUnload = () => fireStop();
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Stop container when component unmounts (in-app navigation)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      fireStop();
      // Clear cached preview status so re-entering the project starts fresh
      // instead of showing a stale URL that triggers "Unable to connect"
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.SANDBOX_STATUS(projectIdRef.current),
      });
    };
    // Intentionally only depend on queryClient - refs are mutable and always current
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient]);
}
