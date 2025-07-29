// Otimizador de performance para pesquisas
import { PERFORMANCE_CONFIG } from './performanceConfig';

// Cache inteligente com TTL otimizado
class SmartCache {
  private cache = new Map<string, { data: any; timestamp: number; hits: number }>();
  private readonly maxSize = 100;
  private readonly ttls = {
    frequent: 60000,     // 1 minuto para dados frequentes
    normal: 300000,      // 5 minutos para dados normais
    rare: 600000,        // 10 minutos para dados raros
  };

  set(key: string, data: any, priority: 'frequent' | 'normal' | 'rare' = 'normal') {
    if (this.cache.size >= this.maxSize) {
      this.evictLeastUsed();
    }
    
    const ttl = this.ttls[priority];
    this.cache.set(key, {
      data,
      timestamp: Date.now() + ttl,
      hits: 0
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.timestamp) {
      this.cache.delete(key);
      return null;
    }
    
    item.hits++;
    return item.data;
  }

  private evictLeastUsed() {
    let leastUsedKey = '';
    let minHits = Infinity;
    
    for (const [key, value] of this.cache.entries()) {
      if (value.hits < minHits) {
        minHits = value.hits;
        leastUsedKey = key;
      }
    }
    
    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  clear() {
    this.cache.clear();
  }
}

// Debounce otimizado para pesquisas
export function createSmartDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number = PERFORMANCE_CONFIG.SEARCH_DEBOUNCE_MS
): T {
  let timeoutId: NodeJS.Timeout;
  let lastArgs: Parameters<T>;
  
  return ((...args: Parameters<T>) => {
    lastArgs = args;
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(null, lastArgs);
    }, delay);
  }) as T;
}

// Pool de conexões para reduzir overhead
class ConnectionPool {
  private activeRequests = new Set<string>();
  private readonly maxConcurrent = 3;
  
  async execute<T>(key: string, request: () => Promise<T>): Promise<T> {
    // Se já existe uma requisição idêntica, aguarda ela
    if (this.activeRequests.has(key)) {
      return new Promise((resolve, reject) => {
        const checkInterval = setInterval(() => {
          if (!this.activeRequests.has(key)) {
            clearInterval(checkInterval);
            resolve(request());
          }
        }, 100);
      });
    }
    
    // Limita requisições concorrentes
    while (this.activeRequests.size >= this.maxConcurrent) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.activeRequests.add(key);
    
    try {
      const result = await request();
      return result;
    } finally {
      this.activeRequests.delete(key);
    }
  }
}

// Instâncias globais
export const smartCache = new SmartCache();
export const connectionPool = new ConnectionPool();

// Interceptor de requisições com cache automático
export async function cachedRequest<T>(
  key: string, 
  requestFn: () => Promise<T>,
  cachePriority: 'frequent' | 'normal' | 'rare' = 'normal'
): Promise<T> {
  // Tenta buscar no cache primeiro
  const cached = smartCache.get(key);
  if (cached) {
    return cached;
  }
  
  // Executa a requisição através do pool
  const result = await connectionPool.execute(key, requestFn);
  
  // Armazena no cache
  smartCache.set(key, result, cachePriority);
  
  return result;
}

// Pré-carregamento inteligente
export class PreloadManager {
  private preloadedData = new Map<string, Promise<any>>();
  
  preload(key: string, requestFn: () => Promise<any>) {
    if (!this.preloadedData.has(key)) {
      this.preloadedData.set(key, requestFn());
    }
  }
  
  async get(key: string): Promise<any> {
    const preloaded = this.preloadedData.get(key);
    if (preloaded) {
      this.preloadedData.delete(key);
      return await preloaded;
    }
    return null;
  }
  
  clear() {
    this.preloadedData.clear();
  }
}

export const preloadManager = new PreloadManager();

// Otimizador de batch requests
export class BatchOptimizer {
  private batches = new Map<string, { requests: Array<() => Promise<any>>; timeout: NodeJS.Timeout }>();
  private readonly batchDelay = 50; // 50ms para agrupar requisições
  
  addToBatch(batchKey: string, request: () => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.batches.has(batchKey)) {
        this.batches.set(batchKey, {
          requests: [],
          timeout: setTimeout(() => this.executeBatch(batchKey), this.batchDelay)
        });
      }
      
      const batch = this.batches.get(batchKey)!;
      batch.requests.push(async () => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
  
  private async executeBatch(batchKey: string) {
    const batch = this.batches.get(batchKey);
    if (!batch) return;
    
    this.batches.delete(batchKey);
    
    // Executa todas as requisições do batch em paralelo
    await Promise.allSettled(batch.requests.map(req => req()));
  }
}

export const batchOptimizer = new BatchOptimizer();

// Monitor de performance
export class PerformanceMonitor {
  private metrics = {
    searchTimes: [] as number[],
    cacheHitRate: 0,
    errorRate: 0,
    avgResponseTime: 0
  };
  
  startTimer(): () => number {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.metrics.searchTimes.push(duration);
      if (this.metrics.searchTimes.length > 50) {
        this.metrics.searchTimes.shift();
      }
      this.updateAvgResponseTime();
      return duration;
    };
  }
  
  private updateAvgResponseTime() {
    if (this.metrics.searchTimes.length > 0) {
      this.metrics.avgResponseTime = this.metrics.searchTimes.reduce((a, b) => a + b, 0) / this.metrics.searchTimes.length;
    }
  }
  
  getMetrics() {
    return { ...this.metrics };
  }
  
  logSlowOperation(operation: string, duration: number) {
    if (duration > 5000) { // Log operations over 5 seconds
      console.warn(`[Performance] Slow operation detected: ${operation} took ${duration}ms`);
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Hook de otimização para React
export const usePerformanceOptimizer = () => {
  return {
    cachedRequest,
    preloadManager,
    batchOptimizer,
    performanceMonitor
  };
};