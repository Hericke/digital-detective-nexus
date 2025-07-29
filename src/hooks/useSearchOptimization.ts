import { useState, useCallback, useRef, useEffect } from 'react';
import { 
  cachedRequest, 
  performanceMonitor, 
  preloadManager,
  createSmartDebounce 
} from '@/utils/performanceOptimizer';

interface SearchOptions {
  debounceMs?: number;
  cacheStrategy?: 'aggressive' | 'normal' | 'minimal';
  preloadEnabled?: boolean;
  batchRequests?: boolean;
}

export const useSearchOptimization = <T>(
  searchFunction: (query: string) => Promise<T>,
  options: SearchOptions = {}
) => {
  const {
    debounceMs = 300,
    cacheStrategy = 'normal',
    preloadEnabled = true,
    batchRequests = false
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Performance metrics
  const [metrics, setMetrics] = useState({
    avgResponseTime: 0,
    cacheHitRate: 0,
    totalSearches: 0
  });

  // Cache strategy configuration
  const getCachePriority = useCallback(() => {
    switch (cacheStrategy) {
      case 'aggressive': return 'frequent' as const;
      case 'minimal': return 'rare' as const;
      default: return 'normal' as const;
    }
  }, [cacheStrategy]);

  // Optimized search function
  const optimizedSearch = useCallback(async (query: string) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const stopTimer = performanceMonitor.startTimer();

    setIsLoading(true);
    setError(null);

    try {
      // Check for preloaded data first
      let result: T;
      
      if (preloadEnabled) {
        const preloadedResult = await preloadManager.get(`search-${query}`);
        if (preloadedResult) {
          result = preloadedResult;
        } else {
          result = await cachedRequest(
            `search-${query}`,
            () => searchFunction(query),
            getCachePriority()
          );
        }
      } else {
        result = await cachedRequest(
          `search-${query}`,
          () => searchFunction(query),
          getCachePriority()
        );
      }

      setResults(result);
      
      // Update metrics
      const duration = stopTimer();
      performanceMonitor.logSlowOperation(`Search: ${query}`, duration);
      
      setMetrics(prev => ({
        ...prev,
        totalSearches: prev.totalSearches + 1,
        avgResponseTime: (prev.avgResponseTime + duration) / 2
      }));

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        setError(error.message || 'Erro durante a pesquisa');
      }
      stopTimer();
    } finally {
      setIsLoading(false);
    }
  }, [searchFunction, getCachePriority, preloadEnabled]);

  // Debounced search
  const debouncedSearch = useCallback(
    createSmartDebounce(optimizedSearch, debounceMs),
    [optimizedSearch, debounceMs]
  );

  // Preload function for anticipatory loading
  const preloadSearch = useCallback((query: string) => {
    if (preloadEnabled && query.trim()) {
      preloadManager.preload(`search-${query}`, () => searchFunction(query));
    }
  }, [searchFunction, preloadEnabled]);

  // Search with immediate feedback
  const search = useCallback((query: string, immediate = false) => {
    if (!query.trim()) {
      setResults(null);
      setError(null);
      return;
    }

    if (immediate) {
      optimizedSearch(query);
    } else {
      debouncedSearch(query);
    }
  }, [optimizedSearch, debouncedSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    search,
    preloadSearch,
    isLoading,
    results,
    error,
    metrics,
    clearResults: useCallback(() => {
      setResults(null);
      setError(null);
    }, [])
  };
};

// Hook específico para pesquisas OSINT
export const useOSINTSearch = () => {
  return useSearchOptimization(
    async (query: string) => {
      // Implementação específica para OSINT será adicionada aqui
      return { query, timestamp: Date.now() };
    },
    {
      debounceMs: 500,
      cacheStrategy: 'normal',
      preloadEnabled: true
    }
  );
};