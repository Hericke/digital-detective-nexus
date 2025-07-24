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
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
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
    
    set: (key: string, data: any, ttl: number = 5 * 60 * 1000) => {
      cache.set(key, { data, timestamp: Date.now(), ttl });
    },
    
    clear: () => cache.clear()
  };
};