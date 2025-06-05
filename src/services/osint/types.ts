
// Tipos para Vazamentos de Dados
export interface LeakData {
  domain: string;
  breaches: Array<{
    name: string;
    date: string;
    records: number;
    description: string;
  }>;
}

// Tipos para Violação de Email
export interface EmailBreachData {
  email: string;
  breaches: Array<{
    name: string;
    domain: string;
    breach_date: string;
    added_date: string;
    records: number;
    data_classes: string[];
  }>;
}

// Tipos para OSINT Search
export interface OSINTSearchData {
  query: string;
  results: {
    emails: string[];
    phones: string[];
    social_profiles: string[];
    domains: string[];
  };
}

// Tipos para WhatsApp OSINT
export interface WhatsAppData {
  phone: string;
  profile_pic: string;
  about: string;
  last_seen: string;
}

// Tipos para IP Enricher
export interface IPData {
  ip: string;
  country: string;
  country_code: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  isp: string;
  organization: string;
  asn: string;
  threat_level: string;
}

// Tipos para Phishing Detection
export interface PhishingData {
  url: string;
  is_phishing: boolean;
  confidence: number;
  categories: string[];
  reputation: string;
}

// Tipos para Subdomain Finder
export interface SubdomainData {
  domain: string;
  subdomains: string[];
  total_found: number;
}

// Tipos para LinkedIn Data
export interface LinkedInData {
  profile_url: string;
  name: string;
  headline: string;
  location: string;
  connections: number;
  about: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
  }>;
}

// Tipos para resultado genérico de API
export interface OSINTAPIResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  source: string;
}
