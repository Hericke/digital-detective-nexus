export const RAPIDAPI_CONFIG = {
  key: "59142cbba6msha2cfe04e9f1fe48p1bac65jsna604cea7e65f",
  headers: {
    'X-RapidAPI-Key': "59142cbba6msha2cfe04e9f1fe48p1bac65jsna604cea7e65f",
    'Content-Type': 'application/json'
  }
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

// Função para tratar erros comuns das APIs
export const handleAPIError = (response: Response, source: string) => {
  if (response.status === 403) {
    return {
      success: false,
      error: `API não está disponível ou não possui assinatura. Verifique sua conta RapidAPI para: ${source}`,
      source
    };
  }
  
  if (response.status === 429) {
    return {
      success: false,
      error: `Limite de requisições excedido para: ${source}. Tente novamente mais tarde.`,
      source
    };
  }
  
  if (response.status === 500) {
    return {
      success: false,
      error: `Erro interno no servidor da API: ${source}`,
      source
    };
  }
  
  return {
    success: false,
    error: `Erro ${response.status} na API: ${source}`,
    source
  };
};
