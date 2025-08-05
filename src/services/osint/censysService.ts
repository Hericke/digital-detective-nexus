import { secureApiClient } from '@/services/api/secureApiClient';
import { OSINTAPIResult } from './types';

// Tipos para Censys API
export interface CensysHostData {
  ip: string;
  location?: {
    continent: string;
    country: string;
    country_code: string;
    city: string;
    postal_code: string;
    timezone: string;
    province: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  autonomous_system?: {
    asn: number;
    description: string;
    bgp_prefix: string;
    name: string;
    country_code: string;
  };
  services?: Array<{
    port: number;
    protocol: string;
    transport_protocol: string;
    banner_hash_sha256: string;
    scan_time: string;
  }>;
  dns?: {
    reverse_dns?: {
      names: string[];
    };
    names?: string[];
  };
}

export interface CensysSearchResult {
  hits: Array<{
    ip: string;
    name?: string;
    location?: {
      country: string;
      city: string;
    };
    autonomous_system?: {
      asn: number;
      name: string;
    };
    services?: Array<{
      port: number;
      service_name: string;
    }>;
  }>;
  total: number;
  duration: number;
}

export interface CensysCertificateData {
  parsed: {
    subject: {
      common_name: string[];
      country: string[];
      organization: string[];
    };
    issuer: {
      common_name: string[];
      organization: string[];
    };
    validity: {
      start: string;
      end: string;
    };
    subject_alt_name: {
      dns_names: string[];
    };
  };
  fingerprint_sha256: string;
}

class CensysService {
  private readonly baseUrl = 'https://api.platform.censys.io/v3';
  
  // Busca informações detalhadas de um host específico
  async getHostInfo(ip: string): Promise<OSINTAPIResult<CensysHostData>> {
    try {
      const result = await secureApiClient.censysRequest(
        `${this.baseUrl}/global/asset/host/${ip}`,
        {
          method: 'GET'
        }
      );

      return {
        success: true,
        data: result.result?.resource || result,
        source: 'Censys Host API'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao buscar informações do host',
        source: 'Censys Host API'
      };
    }
  }

  // Busca hosts com filtros específicos
  async searchHosts(query: string, limit: number = 10): Promise<OSINTAPIResult<CensysSearchResult>> {
    try {
      const result = await secureApiClient.censysRequest(
        `${this.baseUrl}/global/search/hosts`,
        {
          method: 'POST',
          body: {
            q: query,
            per_page: limit,
            cursor: ''
          }
        }
      );

      return {
        success: true,
        data: result.result || result,
        source: 'Censys Search API'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao pesquisar hosts',
        source: 'Censys Search API'
      };
    }
  }

  // Busca hosts por domínio
  async searchHostsByDomain(domain: string): Promise<OSINTAPIResult<CensysSearchResult>> {
    const query = `dns.names:"${domain}" or autonomous_system.name:"${domain}"`;
    return this.searchHosts(query);
  }

  // Busca hosts por organização
  async searchHostsByOrganization(org: string): Promise<OSINTAPIResult<CensysSearchResult>> {
    const query = `autonomous_system.name:"${org}" or whois.organization.name:"${org}"`;
    return this.searchHosts(query);
  }

  // Busca hosts por porta específica
  async searchHostsByPort(port: number): Promise<OSINTAPIResult<CensysSearchResult>> {
    const query = `services.port:${port}`;
    return this.searchHosts(query);
  }

  // Busca certificados por domínio
  async searchCertificates(domain: string): Promise<OSINTAPIResult<any>> {
    try {
      const query = `parsed.subject.common_name:"${domain}" or parsed.subject_alt_name.dns_names:"${domain}"`;
      
      const result = await secureApiClient.censysRequest(
        `${this.baseUrl}/global/search/certificates`,
        {
          method: 'POST',
          body: {
            q: query,
            per_page: 20,
            cursor: ''
          }
        }
      );

      return {
        success: true,
        data: result.result || result,
        source: 'Censys Certificates API'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao pesquisar certificados',
        source: 'Censys Certificates API'
      };
    }
  }

  // Análise de superfície de ataque para um domínio
  async analyzeAttackSurface(domain: string): Promise<OSINTAPIResult<any>> {
    try {
      // Busca hosts e certificados relacionados ao domínio
      const [hostsResult, certsResult] = await Promise.all([
        this.searchHostsByDomain(domain),
        this.searchCertificates(domain)
      ]);

      const attackSurface = {
        domain,
        hosts: hostsResult.data?.hits || [],
        certificates: certsResult.data?.hits || [],
        total_hosts: hostsResult.data?.total || 0,
        total_certificates: certsResult.data?.total || 0,
        analysis_date: new Date().toISOString()
      };

      return {
        success: true,
        data: attackSurface,
        source: 'Censys Attack Surface Analysis'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro na análise de superfície de ataque',
        source: 'Censys Attack Surface Analysis'
      };
    }
  }

  // Busca subdomínios através de certificados
  async findSubdomains(domain: string): Promise<OSINTAPIResult<string[]>> {
    try {
      const certsResult = await this.searchCertificates(domain);
      
      if (!certsResult.success || !certsResult.data?.hits) {
        return {
          success: false,
          error: 'Nenhum certificado encontrado',
          source: 'Censys Subdomain Discovery'
        };
      }

      const subdomains = new Set<string>();
      
      certsResult.data.hits.forEach((cert: any) => {
        // Subject Common Name
        if (cert.parsed?.subject?.common_name) {
          cert.parsed.subject.common_name.forEach((name: string) => {
            if (name.includes(domain)) {
              subdomains.add(name);
            }
          });
        }
        
        // Subject Alternative Names
        if (cert.parsed?.subject_alt_name?.dns_names) {
          cert.parsed.subject_alt_name.dns_names.forEach((name: string) => {
            if (name.includes(domain)) {
              subdomains.add(name);
            }
          });
        }
      });

      return {
        success: true,
        data: Array.from(subdomains).sort(),
        source: 'Censys Subdomain Discovery'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao descobrir subdomínios',
        source: 'Censys Subdomain Discovery'
      };
    }
  }
}

export const censysService = new CensysService();