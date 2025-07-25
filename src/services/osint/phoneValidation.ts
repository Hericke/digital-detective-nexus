
// Serviço para validação de telefone usando NumVerify API via secure endpoint
import { secureApiClient } from '../api/secureApiClient';
const NUMVERIFY_BASE_URL = 'https://apilayer.net/api/validate';

export interface PhoneValidationResult {
  valid: boolean;
  number: string;
  localFormat: string;
  internationalFormat: string;
  countryPrefix: string;
  countryCode: string;
  countryName: string;
  location: string;
  carrier: string;
  lineType: string;
}

export const validatePhone = async (phoneNumber: string): Promise<PhoneValidationResult | null> => {
  try {
    console.log('Validando telefone:', phoneNumber);
    
    // Limpar o número de telefone
    const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    const data = await secureApiClient.numverifyRequest(NUMVERIFY_BASE_URL, {
      number: cleanNumber,
      country_code: 'BR',
      format: '1'
    });
    
    console.log('Resposta NumVerify:', data);
    
    if (data.error) {
      console.error('Erro na API NumVerify:', data.error);
      return null;
    }
    
    return {
      valid: data.valid,
      number: data.number,
      localFormat: data.local_format,
      internationalFormat: data.international_format,
      countryPrefix: data.country_prefix,
      countryCode: data.country_code,
      countryName: data.country_name,
      location: data.location,
      carrier: data.carrier,
      lineType: data.line_type,
    };
  } catch (error) {
    console.error('Erro ao validar telefone:', error);
    return null;
  }
};
