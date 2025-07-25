// Secure API configuration - all keys now handled via edge functions
export const RAPIDAPI_CONFIG = {
  // API keys are now securely managed via Supabase edge functions
  useSecureEndpoint: true
};

// Apenas APIs que estão funcionando e disponíveis
export const API_ENDPOINTS = {
  LEAKS: 'https://leaksapi.p.rapidapi.com',
  EMAIL_BREACH: 'https://email-breach-search.p.rapidapi.com',
  OSINT_SEARCH: 'https://osint-phone-email-names-search-everything.p.rapidapi.com',
  PII_BREACH: 'https://pii-breach-search1.p.rapidapi.com',
  WHATSAPP_OSINT: 'https://whatsapp-osint.p.rapidapi.com',
  OSINT_WORK: 'https://osintwork1.p.rapidapi.com',
  IP_ENRICHER: 'https://ip-enricher.p.rapidapi.com',
  PHISHING_DETECTION: 'https://phishing-detection.p.rapidapi.com',
  SUBDOMAIN_FINDER: 'https://subdomain-finder3.p.rapidapi.com',
  MAIL_CHECKER: 'https://mailchecker1.p.rapidapi.com',
  APK_METADATA: 'https://aka-bmp.p.rapidapi.com',
  SUBDOMAIN_SCAN: 'https://subdomain-scan1.p.rapidapi.com',
  PHONE_LEAK: 'https://phone-leak-search.p.rapidapi.com',
  BROKEN_LINK: 'https://broken-link-checker-api.p.rapidapi.com',
  NET_DETECTIVE: 'https://netdetective.p.rapidapi.com',
  WHOIS: 'https://whois-api-domain-whois-checker.p.rapidapi.com',
  VULNERABILITY_SCANNER: 'https://vulnerability-scanner2.p.rapidapi.com',
  VIRUS_SCAN: 'https://virus-scan-api.p.rapidapi.com',
  IP_NINJA: 'https://ip-ninja.p.rapidapi.com',
  INSTAGRAM_HLS: 'https://instagram120.p.rapidapi.com',
  JSEARCH: 'https://jsearch.p.rapidapi.com',
  LINKEDIN_SCRAPER: 'https://li-data-scraper.p.rapidapi.com',
  ZILLOW: 'https://zillow-com1.p.rapidapi.com'
};

import { handleAPIError as handleError, retryWithBackoff, createRequestCache } from '../../utils/apiErrorHandler';

// Cache global para requisições
export const requestCache = createRequestCache();

// Função para tratar erros comuns das APIs (mantida para compatibilidade)
export const handleAPIError = (response: Response, source: string) => {
  const error = handleError(response, source);
  return {
    success: false,
    error: error.message,
    source: error.source
  };
};

// Função melhorada para fazer requisições com retry e cache
export const makeAPIRequest = async (url: string, options: RequestInit, source: string, cacheKey?: string) => {
  // Verificar cache primeiro
  if (cacheKey) {
    const cachedData = requestCache.get(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }
  
  try {
    const response = await retryWithBackoff(async () => {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw handleError(res, source);
      }
      return res;
    });
    
    const data = await response.json();
    
    // Armazenar no cache se solicitado
    if (cacheKey) {
      requestCache.set(cacheKey, data);
    }
    
    return data;
  } catch (error: any) {
    throw error;
  }
};
