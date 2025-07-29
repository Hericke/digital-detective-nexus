import { toast } from "@/hooks/use-toast";

export interface APIError {
  status: number;
  message: string;
  source: string;
  retryable: boolean;
}

export const createAPIError = (status: number, message: string, source: string): APIError => ({
  status,
  message,
  source,
  retryable: status === 429 || status >= 500
});

export const handleAPIError = (response: Response, source: string): APIError => {
  switch (response.status) {
    case 401:
      return createAPIError(401, "API key inválida ou não autorizada", source);
    case 403:
      return createAPIError(403, "Acesso negado ou recurso indisponível", source);
    case 429:
      return createAPIError(429, "Limite de requisições excedido. Tente novamente em alguns minutos", source);
    case 500:
      return createAPIError(500, "Erro interno do servidor", source);
    case 502:
    case 503:
    case 504:
      return createAPIError(response.status, "Serviço temporariamente indisponível", source);
    default:
      return createAPIError(response.status, `Erro ${response.status} na API`, source);
  }
};

export const showAPIErrorToast = (error: APIError) => {
  toast({
    title: `Erro na API ${error.source}`,
    description: error.message,
    variant: "destructive",
  });
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000 // Reduced from 2000ms to 1000ms for faster retries
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Check if it's a 429 error and increase delay significantly
      if (error instanceof Error && error.message.includes('429')) {
        if (attempt === maxRetries) {
          throw new Error('Limite de requisições excedido. Aguarde alguns minutos antes de tentar novamente.');
        }
        // For 429 errors, use exponential backoff but cap at 30 seconds
        const delay = Math.min(baseDelay * Math.pow(2, attempt + 2), 30000) + Math.random() * 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

export const createRequestCache = () => {
  const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  return {
    get: (key: string) => {
      const item = cache.get(key);
      if (!item) return null;
      
      if (Date.now() - item.timestamp > item.ttl) {
        cache.delete(key);
        return null;
      }
      
      return item.data;
    },
    
    set: (key: string, data: any, ttl: number = 10 * 60 * 1000) => {
      cache.set(key, { data, timestamp: Date.now(), ttl });
    },
    
    clear: () => cache.clear()
  };
};

// Rate limiting utility
export const createRateLimiter = (maxRequests: number = 10, windowMs: number = 60000) => {
  const requests = new Map<string, number[]>();
  
  return {
    canMakeRequest: (identifier: string): boolean => {
      const now = Date.now();
      const userRequests = requests.get(identifier) || [];
      
      // Remove old requests outside the window
      const validRequests = userRequests.filter(time => now - time < windowMs);
      
      if (validRequests.length >= maxRequests) {
        return false;
      }
      
      validRequests.push(now);
      requests.set(identifier, validRequests);
      return true;
    },
    
    getWaitTime: (identifier: string): number => {
      const userRequests = requests.get(identifier) || [];
      if (userRequests.length === 0) return 0;
      
      const oldestRequest = userRequests[0];
      const waitTime = windowMs - (Date.now() - oldestRequest);
      return Math.max(0, waitTime);
    }
  };
};