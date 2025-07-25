import { API_ENDPOINTS } from './config';
import { secureApiClient } from '../api/secureApiClient';
import { LeakData, OSINTAPIResult } from './types';

export const searchDomainLeaks = async (domain: string): Promise<OSINTAPIResult<LeakData>> => {
  try {
    console.log('Buscando vazamentos para domínio:', domain);
    
    const data = await secureApiClient.rapidApiRequest(`${API_ENDPOINTS.LEAKS}/api/v2/query/${domain}?type=domain`);

    if (data.error) {
      return {
        success: false,
        error: data.error,
        source: 'LeaksAPI'
      };
    }

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
    
    const data = await secureApiClient.rapidApiRequest(`${API_ENDPOINTS.EMAIL_BREACH}/rapidapi/search-email/${email}`);

    if (data.error) {
      return {
        success: false,
        error: data.error,
        source: 'Email Breach Search'
      };
    }

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