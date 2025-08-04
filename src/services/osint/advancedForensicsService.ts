import { secureApiClient } from '@/services/api/secureApiClient';
import type { 
  VirusTotalData, 
  TrueCallerData, 
  PiplData, 
  BlockchainData, 
  EthereumData, 
  ExchangeData,
  ExifData,
  WebDetectionData,
  OSINTSearchEverything,
  OSINTAPIResult 
} from './types';

/**
 * FASE 1: APIs e Fontes de Dados Avançadas
 */

// 1.1 Integração de APIs Premium para OSINT

/**
 * Busca informações de domínio no VirusTotal
 */
export async function analyzeWithVirusTotal(domain: string): Promise<OSINTAPIResult<VirusTotalData>> {
  try {
    const response = await secureApiClient.rapidApiRequest('virustotaldimasv1/getDomainReport', {
      method: 'POST',
      data: { domain },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-rapidapi-host': 'virustotaldimasv1.p.rapidapi.com'
      }
    });

    return {
      success: true,
      data: response,
      source: 'VirusTotal'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao consultar VirusTotal',
      source: 'VirusTotal'
    };
  }
}

/**
 * Busca informações de telefone no TrueCaller
 */
export async function searchWithTrueCaller(phone: string): Promise<OSINTAPIResult<TrueCallerData>> {
  try {
    const response = await secureApiClient.rapidApiRequest(`truecaller-data2/search/${phone}`, {
      headers: {
        'x-rapidapi-host': 'truecaller-data2.p.rapidapi.com'
      }
    });

    return {
      success: true,
      data: response,
      source: 'TrueCaller'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao consultar TrueCaller',
      source: 'TrueCaller'
    };
  }
}

/**
 * Busca informações de pessoa no Pipl
 */
export async function searchWithPipl(name: string): Promise<OSINTAPIResult<PiplData>> {
  try {
    const response = await secureApiClient.rapidApiRequest('community-pipl/name/v4/json/', {
      data: { raw_name: name },
      headers: {
        'x-rapidapi-host': 'community-pipl.p.rapidapi.com'
      }
    });

    return {
      success: true,
      data: response,
      source: 'Pipl'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao consultar Pipl',
      source: 'Pipl'
    };
  }
}

/**
 * Busca OSINT completa por termo
 */
export async function searchOSINTEverything(searchTerm: string): Promise<OSINTAPIResult<OSINTSearchEverything>> {
  try {
    const response = await secureApiClient.rapidApiRequest('osint-phone-email-names-search-everything/search', {
      method: 'POST',
      data: { request: searchTerm, lang: 'en' },
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': 'osint-phone-email-names-search-everything.p.rapidapi.com'
      }
    });

    return {
      success: true,
      data: response,
      source: 'OSINT Everything'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao consultar OSINT Everything',
      source: 'OSINT Everything'
    };
  }
}

// 1.2 Análise de Blockchain e Criptomoedas

/**
 * Analisa endereço Bitcoin
 */
export async function analyzeBitcoinAddress(address: string): Promise<OSINTAPIResult<BlockchainData>> {
  try {
    const response = await secureApiClient.rapidApiRequest(`community-blockchain-info/txtotalbtcinput/${address}`, {
      headers: {
        'x-rapidapi-host': 'community-blockchain-info.p.rapidapi.com'
      }
    });

    return {
      success: true,
      data: response,
      source: 'Blockchain.info'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao analisar endereço Bitcoin',
      source: 'Blockchain.info'
    };
  }
}

/**
 * Analisa endereço Ethereum
 */
export async function analyzeEthereumAddress(address: string): Promise<OSINTAPIResult<EthereumData>> {
  try {
    const response = await secureApiClient.rapidApiRequest(`etherscan-unofficial-api/address_txinternal/${address}`, {
      data: { p: 1, limit: 10 },
      headers: {
        'x-rapidapi-host': 'etherscan-unofficial-api.p.rapidapi.com'
      }
    });

    return {
      success: true,
      data: response,
      source: 'Etherscan'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao analisar endereço Ethereum',
      source: 'Etherscan'
    };
  }
}

/**
 * Busca informações de exchanges
 */
export async function getExchangesData(): Promise<OSINTAPIResult<ExchangeData[]>> {
  try {
    const response = await secureApiClient.rapidApiRequest('coinapi/v1/exchanges', {
      headers: {
        'x-rapidapi-host': 'coinapi.p.rapidapi.com'
      }
    });

    return {
      success: true,
      data: response,
      source: 'CoinAPI'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar dados de exchanges',
      source: 'CoinAPI'
    };
  }
}

/**
 * FASE 2: Recursos de Análise Forense Avançada
 */

// 2.1 Análise de Imagens Forense

/**
 * Extrai dados EXIF de imagem
 */
export async function extractImageExif(imageData: string): Promise<OSINTAPIResult<ExifData>> {
  try {
    const response = await secureApiClient.rapidApiRequest('exifreader/Exif', {
      method: 'POST',
      data: { image: imageData },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-rapidapi-host': 'exifreader.p.rapidapi.com'
      }
    });

    return {
      success: true,
      data: response,
      source: 'ExifReader'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao extrair dados EXIF',
      source: 'ExifReader'
    };
  }
}

/**
 * Busca reversa de imagem com detecção web
 */
export async function analyzeImageForWeb(imageUrl: string): Promise<OSINTAPIResult<WebDetectionData>> {
  try {
    const response = await secureApiClient.rapidApiRequest('web-detection/web-detection', {
      data: { image: imageUrl },
      headers: {
        'x-rapidapi-host': 'web-detection.p.rapidapi.com'
      }
    });

    return {
      success: true,
      data: response,
      source: 'Web Detection'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao analisar imagem para web',
      source: 'Web Detection'
    };
  }
}

// Funções de utilidade

/**
 * Validação de endereço Bitcoin
 */
export function isValidBitcoinAddress(address: string): boolean {
  const bitcoinRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-zA-HJ-NP-Z0-9]{39,59}$/;
  return bitcoinRegex.test(address);
}

/**
 * Validação de endereço Ethereum
 */
export function isValidEthereumAddress(address: string): boolean {
  const ethereumRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethereumRegex.test(address);
}

/**
 * Formatação de telefone para TrueCaller (formato internacional)
 */
export function formatPhoneForTrueCaller(phone: string): string {
  // Remove todos os caracteres não numéricos
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Se não tem código do país, assume Brasil (+55)
  if (cleanPhone.length === 11 && cleanPhone.startsWith('11')) {
    return `55${cleanPhone}`;
  }
  if (cleanPhone.length === 10) {
    return `55${cleanPhone}`;
  }
  
  return cleanPhone;
}