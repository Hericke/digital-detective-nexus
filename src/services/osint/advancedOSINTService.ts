
import { searchDomainLeaks, searchEmailBreach } from './leaksService';
import { getWhatsAppProfile } from './whatsappService';
import { enrichIP, detectPhishing, scanVulnerabilities } from './ipSecurityService';
import { findSubdomains, scanSubdomains, checkWhois } from './domainService';
import { OSINTAPIResult } from './types';
import { RAPIDAPI_CONFIG, API_ENDPOINTS } from './config';

// Serviço unificado de busca OSINT
export const searchOSINTData = async (query: string): Promise<OSINTAPIResult> => {
  try {
    console.log('Iniciando busca OSINT para:', query);
    
    const response = await fetch(`${API_ENDPOINTS.OSINT_SEARCH}/search`, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_CONFIG.key,
        'X-RapidAPI-Host': 'osint-phone-email-names-search-everything.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro na API: ${response.status}`,
        source: 'OSINT Search'
      };
    }

    const data = await response.json();
    console.log('Resposta da API OSINT Search:', data);

    return {
      success: true,
      data,
      source: 'OSINT Search'
    };

  } catch (error) {
    console.error('Erro ao buscar dados OSINT:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API OSINT',
      source: 'OSINT Search'
    };
  }
};

// Busca combinada email + telefone
export const searchEmailPhone = async (email?: string, phone?: string): Promise<OSINTAPIResult> => {
  try {
    console.log('Buscando dados combinados:', { email, phone });
    
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (phone) params.append('phone', phone);
    
    const response = await fetch(`${API_ENDPOINTS.OSINT_WORK}/rapidapi/search/?${params.toString()}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_CONFIG.key,
        'X-RapidAPI-Host': 'osintwork1.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro na API: ${response.status}`,
        source: 'OSINT Work'
      };
    }

    const data = await response.json();
    console.log('Resposta da API OSINT Work:', data);

    return {
      success: true,
      data,
      source: 'OSINT Work'
    };

  } catch (error) {
    console.error('Erro ao buscar dados combinados:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API OSINT Work',
      source: 'OSINT Work'
    };
  }
};

// Verificação de vazamento de telefone
export const searchPhoneLeak = async (phone: string): Promise<OSINTAPIResult> => {
  try {
    const cleanPhone = phone.replace(/\D/g, '');
    console.log('Buscando vazamentos de telefone:', cleanPhone);
    
    const response = await fetch(`${API_ENDPOINTS.PHONE_LEAK}/api/search/origin?phone=${cleanPhone}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_CONFIG.key,
        'X-RapidAPI-Host': 'phone-leak-search.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro na API: ${response.status}`,
        source: 'Phone Leak Search'
      };
    }

    const data = await response.json();
    console.log('Resposta da API Phone Leak:', data);

    return {
      success: true,
      data,
      source: 'Phone Leak Search'
    };

  } catch (error) {
    console.error('Erro ao buscar vazamentos de telefone:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API de vazamentos',
      source: 'Phone Leak Search'
    };
  }
};

// Verificador de links quebrados
export const checkBrokenLinks = async (url: string): Promise<OSINTAPIResult> => {
  try {
    console.log('Verificando link quebrado:', url);
    
    const response = await fetch(`${API_ENDPOINTS.BROKEN_LINK}/brokenlink`, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_CONFIG.key,
        'X-RapidAPI-Host': 'broken-link-checker-api.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro na API: ${response.status}`,
        source: 'Broken Link Checker'
      };
    }

    const data = await response.json();
    console.log('Resposta da API Broken Link:', data);

    return {
      success: true,
      data,
      source: 'Broken Link Checker'
    };

  } catch (error) {
    console.error('Erro ao verificar link:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API de links',
      source: 'Broken Link Checker'
    };
  }
};

// Exportar todas as funções disponíveis
export {
  searchDomainLeaks,
  searchEmailBreach,
  getWhatsAppProfile,
  enrichIP,
  detectPhishing,
  scanVulnerabilities,
  findSubdomains,
  scanSubdomains,
  checkWhois
};
