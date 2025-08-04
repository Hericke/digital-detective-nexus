
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

// Tipos para VirusTotal Data
export interface VirusTotalData {
  domain: string;
  scan_date: string;
  positives: number;
  total: number;
  permalink: string;
  verbose_msg: string;
  response_code: number;
}

// Tipos para TrueCaller Data
export interface TrueCallerData {
  phone: string;
  name: string;
  carrier: string;
  country_code: string;
  region: string;
  spam_score: number;
  phone_type: string;
}

// Tipos para Pipl Search Data
export interface PiplData {
  name: string;
  possible_persons: Array<{
    names: string[];
    phones: string[];
    emails: string[];
    addresses: string[];
    social_profiles: string[];
    age_range: string;
    demographics: string;
  }>;
}

// Tipos para Blockchain Analysis
export interface BlockchainData {
  address: string;
  total_received: number;
  total_sent: number;
  balance: number;
  unconfirmed_balance: number;
  total_transactions: number;
  first_seen: string;
  last_seen: string;
}

// Tipos para Ethereum Analysis
export interface EthereumData {
  address: string;
  balance: string;
  transactions: Array<{
    hash: string;
    from: string;
    to: string;
    value: string;
    timestamp: string;
  }>;
}

// Tipos para Exchange Data
export interface ExchangeData {
  name: string;
  volume_24h: number;
  website: string;
  country: string;
  data_start: string;
  data_end: string;
}

// Tipos para EXIF Data
export interface ExifData {
  file_name: string;
  file_size: string;
  camera_make: string;
  camera_model: string;
  date_time: string;
  gps_latitude: number;
  gps_longitude: number;
  flash: string;
  focal_length: string;
  iso_speed: string;
  resolution: string;
}

// Tipos para Web Detection
export interface WebDetectionData {
  web_entities: Array<{
    entity_id: string;
    description: string;
    score: number;
  }>;
  full_matching_images: Array<{
    url: string;
    score: number;
  }>;
  partial_matching_images: Array<{
    url: string;
    score: number;
  }>;
  pages_with_matching_images: Array<{
    url: string;
    page_title: string;
  }>;
}

// Tipos para OSINT Search Everything
export interface OSINTSearchEverything {
  request: string;
  results: {
    people: Array<{
      name: string;
      age: string;
      location: string;
      emails: string[];
      phones: string[];
      social_profiles: string[];
    }>;
    emails: string[];
    phones: string[];
    addresses: string[];
    social_media: string[];
  };
}

// Tipos para resultado genérico de API
export interface OSINTAPIResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  source: string;
}
