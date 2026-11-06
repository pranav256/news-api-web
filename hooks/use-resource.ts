'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Resource<T> {
  url: string;
  data: T | null;
  loading: boolean;
  error: string | null;
  checkedAt: string | null;
}

export function useResource<T>(url: string, parse: (value: unknown) => T, interval: number) {
  const [resource, setResource] = useState<Resource<T>>({
    url,
    data: null,
    loading: true,
    error: null,
    checkedAt: null,
  });
  const refreshRef = useRef<() => void>(() => {});
  useEffect(() => {
    let alive = true;
    let controller: AbortController | null = null;
    let sequence = 0;
    const refresh = async () => {
      const request = ++sequence;
      controller?.abort();
      controller = new AbortController();
      const signal = controller.signal;
      const timeout = window.setTimeout(() => controller?.abort(), 15000);
      setResource((previous) => ({
        url,
        data: previous.url === url ? previous.data : null,
        checkedAt: previous.url === url ? previous.checkedAt : null,
        error: null,
        loading: true,
      }));
      try {
        const response = await fetch(url, { signal, cache: 'no-store' });
        if (!response.ok) throw new Error('Feed unavailable');
        const data = parse(await response.json());
        if (alive && request === sequence)
          setResource({
            url,
            data,
            loading: false,
            error: null,
            checkedAt: new Date().toISOString(),
          });
      } catch {
        if (alive && request === sequence)
          setResource((previous) => ({
            ...previous,
            loading: false,
            error: 'The latest data could not be loaded. Check your connection and try again.',
          }));
      } finally {
        window.clearTimeout(timeout);
      }
    };
    refreshRef.current = () => {
      void refresh();
    };
    void refresh();
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refresh();
    }, interval);
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      alive = false;
      sequence++;
      controller?.abort();
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [url, parse, interval]);
  const refresh = useCallback(() => refreshRef.current(), []);
  return {
    ...(resource.url === url
      ? resource
      : { url, data: null, loading: true, error: null, checkedAt: null }),
    refresh,
  };
}
