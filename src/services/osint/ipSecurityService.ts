import { API_ENDPOINTS } from './config';
import { secureApiClient } from '../api/secureApiClient';
import { IPData, PhishingData, OSINTAPIResult } from './types';

export const enrichIP = async (ip: string): Promise<OSINTAPIResult<IPData>> => {
  try {
    console.log('Enriquecendo IP:', ip);
    
    const data = await secureApiClient.rapidApiRequest(`${API_ENDPOINTS.IP_ENRICHER}/get_ip_info/`, {
      method: 'POST',
      body: { ip }
    });

    if (data.error) {
      return {
        success: false,
        error: data.error,
        source: 'IP Enricher'
      };
    }

    return {
      success: true,
      data,
      source: 'IP Enricher'
    };

  } catch (error) {
    console.error('Erro ao enriquecer IP:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API de IP. Verifique sua conexão.',
      source: 'IP Enricher'
    };
  }
};

export const detectPhishing = async (url: string): Promise<OSINTAPIResult<PhishingData>> => {
  try {
    console.log('Detectando phishing para URL:', url);
    
    const data = await secureApiClient.rapidApiRequest(`${API_ENDPOINTS.PHISHING_DETECTION}/check-url/`, {
      method: 'POST',
      body: { url }
    });

    if (data.error) {
      return {
        success: false,
        error: data.error,
        source: 'Phishing Detection'
      };
    }

    return {
      success: true,
      data,
      source: 'Phishing Detection'
    };

  } catch (error) {
    console.error('Erro ao detectar phishing:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API de detecção. Verifique sua conexão.',
      source: 'Phishing Detection'
    };
  }
};

export const scanVulnerabilities = async (ip: string): Promise<OSINTAPIResult> => {
  try {
    console.log('Escaneando vulnerabilidades para IP:', ip);
    
    const data = await secureApiClient.rapidApiRequest(`${API_ENDPOINTS.VULNERABILITY_SCANNER}/${ip}`);

    if (data.error) {
      return {
        success: false,
        error: data.error,
        source: 'Vulnerability Scanner'
      };
    }

    return {
      success: true,
      data,
      source: 'Vulnerability Scanner'
    };

  } catch (error) {
    console.error('Erro ao escanear vulnerabilidades:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API de vulnerabilidades. Verifique sua conexão.',
      source: 'Vulnerability Scanner'
    };
  }
};