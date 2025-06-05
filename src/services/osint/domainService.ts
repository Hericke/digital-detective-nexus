
import { RAPIDAPI_CONFIG, API_ENDPOINTS } from './config';
import { SubdomainData, OSINTAPIResult } from './types';

export const findSubdomains = async (domain: string): Promise<OSINTAPIResult<SubdomainData>> => {
  try {
    console.log('Buscando subdomínios para:', domain);
    
    const response = await fetch(`${API_ENDPOINTS.SUBDOMAIN_FINDER}/v1/subdomain-finder/?domain=${domain}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_CONFIG.key,
        'X-RapidAPI-Host': 'subdomain-finder3.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro na API: ${response.status}`,
        source: 'Subdomain Finder'
      };
    }

    const data = await response.json();
    console.log('Resposta da API Subdomain Finder:', data);

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
    
    const response = await fetch(`${API_ENDPOINTS.SUBDOMAIN_SCAN}/?domain=${domain}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_CONFIG.key,
        'X-RapidAPI-Host': 'subdomain-scan1.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro na API: ${response.status}`,
        source: 'Subdomain Scanner'
      };
    }

    const data = await response.json();
    console.log('Resposta da API Subdomain Scanner:', data);

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
    
    const response = await fetch(`${API_ENDPOINTS.WHOIS}/v1/available-tlds`, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_CONFIG.key,
        'X-RapidAPI-Host': 'whois-api-domain-whois-checker.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ domain })
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro na API: ${response.status}`,
        source: 'WHOIS Lookup'
      };
    }

    const data = await response.json();
    console.log('Resposta da API WHOIS:', data);

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
