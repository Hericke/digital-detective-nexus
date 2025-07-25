import { API_ENDPOINTS } from './config';
import { secureApiClient } from '../api/secureApiClient';
import { SubdomainData, OSINTAPIResult } from './types';

export const findSubdomains = async (domain: string): Promise<OSINTAPIResult<SubdomainData>> => {
  try {
    console.log('Buscando subdomínios para:', domain);
    
    const data = await secureApiClient.rapidApiRequest(`${API_ENDPOINTS.SUBDOMAIN_FINDER}/v1/subdomain-finder/?domain=${domain}`);

    if (data.error) {
      return {
        success: false,
        error: data.error,
        source: 'Subdomain Finder'
      };
    }

    return {
      success: true,
      data: {
        domain,
        subdomains: data.subdomains || [],
        total_found: data.total_found || 0
      },
      source: 'Subdomain Finder'
    };

  } catch (error) {
    console.error('Erro ao buscar subdomínios:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API de subdomínios',
      source: 'Subdomain Finder'
    };
  }
};

export const scanSubdomains = async (domain: string): Promise<OSINTAPIResult> => {
  try {
    console.log('Escaneando subdomínios para:', domain);
    
    const data = await secureApiClient.rapidApiRequest(`${API_ENDPOINTS.SUBDOMAIN_SCAN}/?domain=${domain}`);

    if (data.error) {
      return {
        success: false,
        error: data.error,
        source: 'Subdomain Scanner'
      };
    }

    return {
      success: true,
      data,
      source: 'Subdomain Scanner'
    };

  } catch (error) {
    console.error('Erro ao escanear subdomínios:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API de scanner',
      source: 'Subdomain Scanner'
    };
  }
};

export const checkWhois = async (domain: string): Promise<OSINTAPIResult> => {
  try {
    console.log('Consultando WHOIS para:', domain);
    
    const data = await secureApiClient.rapidApiRequest(`${API_ENDPOINTS.WHOIS}/v1/available-tlds`, {
      method: 'POST',
      body: { domain }
    });

    if (data.error) {
      return {
        success: false,
        error: data.error,
        source: 'WHOIS Lookup'
      };
    }

    return {
      success: true,
      data,
      source: 'WHOIS Lookup'
    };

  } catch (error) {
    console.error('Erro ao consultar WHOIS:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API WHOIS',
      source: 'WHOIS Lookup'
    };
  }
};