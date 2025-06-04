
// Serviço para validação de telefone usando NumVerify API
const NUMVERIFY_API_KEY = 'd102cc02653841a88ca574b39dde37a3';
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
    
    const url = `${NUMVERIFY_BASE_URL}?access_key=${NUMVERIFY_API_KEY}&number=${cleanNumber}&country_code=BR&format=1`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Resposta NumVerify:', data);
    
    if (!response.ok || data.error) {
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
