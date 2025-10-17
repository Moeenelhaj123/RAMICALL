import { useState, useCallback, useRef, useMemo } from 'react';
import { searchClientsByPhone, type PhoneHit } from '@/api/clients';

export function looksLikePhone(s: string): boolean {
  return /\+?[\d\-\s().]{4,}$/.test(s.trim());
}

export function normalizePhone(s: string): string {
  const t = s.trim();
  if (t.startsWith("+")) return "+" + t.replace(/[^\d]/g, "");
  const digits = t.replace(/[^\d]/g, "");
  return digits.length ? digits : "";
}

export function usePhoneSearch() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PhoneHit[]>([]);
  const cache = useRef(new Map<string, PhoneHit[]>());
  const ctrl = useRef<AbortController | null>(null);

  const search = useCallback(async (raw: string) => {
    const query = normalizePhone(raw);
    if (!query) {
      setResults([]);
      return;
    }
    
    if (cache.current.has(query)) {
      setResults(cache.current.get(query)!);
      return;
    }

    ctrl.current?.abort();
    const ac = new AbortController();
    ctrl.current = ac;
    setLoading(true);
    
    try {
      const hits = await searchClientsByPhone(query);
      if (!ac.signal.aborted) {
        cache.current.set(query, hits);
        setResults(hits);
      }
    } catch (err) {
      if (!ac.signal.aborted) {
        console.error('Phone search error:', err);
        setResults([]);
      }
    } finally {
      if (!ac.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  const debouncedSearch = useMemo(() => {
    let timer: ReturnType<typeof setTimeout>;
    return (s: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => search(s), 250);
    };
  }, [search]);

  const clear = useCallback(() => {
    setResults([]);
    setLoading(false);
    ctrl.current?.abort();
  }, []);

  return { loading, results, search: debouncedSearch, clear };
}
