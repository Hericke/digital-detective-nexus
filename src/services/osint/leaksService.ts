
import { RAPIDAPI_CONFIG, API_ENDPOINTS } from './config';
import { LeakData, OSINTAPIResult } from './types';

export const searchDomainLeaks = async (domain: string): Promise<OSINTAPIResult<LeakData>> => {
  try {
    console.log('Buscando vazamentos para domínio:', domain);
    
    const response = await fetch(`${API_ENDPOINTS.LEAKS}/api/v2/query/${domain}?type=domain`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_CONFIG.key,
        'X-RapidAPI-Host': 'leaksapi.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro na API: ${response.status}`,
        source: 'LeaksAPI'
      };
    }

    const data = await response.json();
    console.log('Resposta da API LeaksAPI:', data);

    return {
      success: true,
      data: {
        domain,
        breaches: data.breaches || []
      },
      source: 'LeaksAPI'
    };

  } catch (error) {
    console.error('Erro ao buscar vazamentos:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API de vazamentos',
      source: 'LeaksAPI'
    };
  }
};

export const searchEmailBreach = async (email: string): Promise<OSINTAPIResult> => {
  try {
    console.log('Buscando violações para email:', email);
    
    const response = await fetch(`${API_ENDPOINTS.EMAIL_BREACH}/rapidapi/search-email/${email}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_CONFIG.key,
        'X-RapidAPI-Host': 'email-breach-search.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro na API: ${response.status}`,
        source: 'Email Breach Search'
      };
    }

    const data = await response.json();
    console.log('Resposta da API Email Breach:', data);

    return {
      success: true,
      data,
      source: 'Email Breach Search'
    };

  } catch (error) {
    console.error('Erro ao buscar violações de email:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API de violações',
      source: 'Email Breach Search'
    };
  }
};
