// Performance optimization configurations for CavernaSPY

export const PERFORMANCE_CONFIG = {
  // Debounce timing for search inputs
  SEARCH_DEBOUNCE_MS: 300,
  
  // API request timeouts
  API_TIMEOUT_MS: 10000,
  
  // Cache TTL settings (in milliseconds)
  CACHE_TTL: {
    SHORT: 5 * 60 * 1000,      // 5 minutes
    MEDIUM: 30 * 60 * 1000,    // 30 minutes
    LONG: 2 * 60 * 60 * 1000,  // 2 hours
  },
  
  // Retry configurations
  RETRY_CONFIG: {
    MAX_ATTEMPTS: 3,
    BASE_DELAY: 1000,
    MAX_DELAY: 5000,
  },
  
  // Animation preferences
  ANIMATIONS: {
    REDUCE_MOTION: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    LOADING_TIMEOUT: 30000, // 30 seconds max loading time
  },
  
  // Bundle size optimizations
  LAZY_LOAD: {
    ENABLED: true,
    INTERSECTION_THRESHOLD: 0.1,
  },
  
  // Error handling
  ERROR_RETRY_DELAY: 2000,
  MAX_CONSOLE_LOGS: 50,
} as const;

// Utility function to check if device is low-end
export const isLowEndDevice = () => {
  return (
    // Check for limited memory
    (navigator as any).deviceMemory && (navigator as any).deviceMemory < 4 ||
    // Check for slow connection
    (navigator as any).connection?.effectiveType === 'slow-2g' ||
    (navigator as any).connection?.effectiveType === '2g' ||
    // Check for save-data preference
    (navigator as any).connection?.saveData
  );
};

// Optimize animations based on device capabilities
export const getOptimizedAnimationConfig = () => {
  const isLowEnd = isLowEndDevice();
  const prefersReducedMotion = PERFORMANCE_CONFIG.ANIMATIONS.REDUCE_MOTION;
  
  return {
    enableAnimations: !isLowEnd && !prefersReducedMotion,
    enableHeavyEffects: !isLowEnd,
    enableParticles: !isLowEnd && !prefersReducedMotion,
    reducedAnimations: isLowEnd || prefersReducedMotion,
  };
};

// Logging utilities with performance optimization
export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[CavernaSPY] ${message}`, data);
    }
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[CavernaSPY] ${message}`, data);
  },
  
  error: (message: string, error?: any) => {
    console.error(`[CavernaSPY] ${message}`, error);
    // In production, you might want to send this to an error tracking service
  },
  
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[CavernaSPY] ${message}`, data);
    }
  },
};