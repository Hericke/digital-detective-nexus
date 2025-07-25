import { API_ENDPOINTS } from './config';
import { secureApiClient } from '../api/secureApiClient';
import { OSINTAPIResult } from './types';

// Serviço unificado de busca OSINT com segurança aprimorada
export const searchOSINTData = async (query: string): Promise<OSINTAPIResult> => {
  try {
    console.log('Iniciando busca OSINT para:', query);
    
    const data = await secureApiClient.rapidApiRequest(`${API_ENDPOINTS.OSINT_SEARCH}/search`, {
      method: 'POST',
      body: { query }
    });

    if (data.error) {
      return {
        success: false,
        error: data.error,
        source: 'OSINT Search'
      };
    }

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
    
    const params: any = {};
    if (email) params.email = email;
    if (phone) params.phone = phone;
    
    const queryString = new URLSearchParams(params).toString();
    const data = await secureApiClient.rapidApiRequest(`${API_ENDPOINTS.OSINT_WORK}/rapidapi/search/?${queryString}`);

    if (data.error) {
      return {
        success: false,
        error: data.error,
        source: 'OSINT Work'
      };
    }

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
    
    const data = await secureApiClient.rapidApiRequest(`${API_ENDPOINTS.PHONE_LEAK}/api/search/origin?phone=${cleanPhone}`);

    if (data.error) {
      return {
        success: false,
        error: data.error,
        source: 'Phone Leak Search'
      };
    }

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
    
    const data = await secureApiClient.rapidApiRequest(`${API_ENDPOINTS.BROKEN_LINK}/brokenlink`, {
      method: 'POST',
      body: { url }
    });

    if (data.error) {
      return {
        success: false,
        error: data.error,
        source: 'Broken Link Checker'
      };
    }

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

// Re-export das outras funções dos serviços seguros
export { searchDomainLeaks, searchEmailBreach } from './leaksService';
export { getWhatsAppProfile } from './whatsappService';
export { enrichIP, detectPhishing, scanVulnerabilities } from './ipSecurityService';
export { findSubdomains, scanSubdomains, checkWhois } from './domainService';