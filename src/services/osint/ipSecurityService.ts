
import { RAPIDAPI_CONFIG, API_ENDPOINTS } from './config';
import { IPData, PhishingData, OSINTAPIResult } from './types';

export const enrichIP = async (ip: string): Promise<OSINTAPIResult<IPData>> => {
  try {
    console.log('Enriquecendo IP:', ip);
    
    const response = await fetch(`${API_ENDPOINTS.IP_ENRICHER}/get_ip_info/`, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_CONFIG.key,
        'X-RapidAPI-Host': 'ip-enricher.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ip })
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro na API: ${response.status}`,
        source: 'IP Enricher'
      };
    }

    const data = await response.json();
    console.log('Resposta da API IP Enricher:', data);

    return {
      success: true,
      data,
      source: 'IP Enricher'
    };

  } catch (error) {
    console.error('Erro ao enriquecer IP:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API de IP',
      source: 'IP Enricher'
    };
  }
};

export const detectPhishing = async (url: string): Promise<OSINTAPIResult<PhishingData>> => {
  try {
    console.log('Detectando phishing para URL:', url);
    
    const response = await fetch(`${API_ENDPOINTS.PHISHING_DETECTION}/check-url/`, {
      method: 'POST',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_CONFIG.key,
        'X-RapidAPI-Host': 'phishing-detection.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro na API: ${response.status}`,
        source: 'Phishing Detection'
      };
    }

    const data = await response.json();
    console.log('Resposta da API Phishing Detection:', data);

    return {
      success: true,
      data,
      source: 'Phishing Detection'
    };

  } catch (error) {
    console.error('Erro ao detectar phishing:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API de detecção',
      source: 'Phishing Detection'
    };
  }
};

export const scanVulnerabilities = async (ip: string): Promise<OSINTAPIResult> => {
  try {
    console.log('Escaneando vulnerabilidades para IP:', ip);
    
    const response = await fetch(`${API_ENDPOINTS.VULNERABILITY_SCANNER}/${ip}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_CONFIG.key,
        'X-RapidAPI-Host': 'vulnerability-scanner2.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro na API: ${response.status}`,
        source: 'Vulnerability Scanner'
      };
    }

    const data = await response.json();
    console.log('Resposta da API Vulnerability Scanner:', data);

    return {
      success: true,
      data,
      source: 'Vulnerability Scanner'
    };

  } catch (error) {
    console.error('Erro ao escanear vulnerabilidades:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API de vulnerabilidades',
      source: 'Vulnerability Scanner'
    };
  }
};
