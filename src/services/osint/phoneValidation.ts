
// Serviço para validação de telefone usando RapidAPI
import { secureApiClient } from '../api/secureApiClient';

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
    
    const data = await secureApiClient.rapidApiRequest(`pesquisa-resultado.php?telefone=${cleanNumber}`, {
      headers: {
        'x-rapidapi-host': 'consulta-telefone.p.rapidapi.com'
      }
    });
    
    console.log('Resposta Phone API:', data);
    
    if (data.error || !data.numero) {
      console.error('Erro na API telefone:', data.error);
      return null;
    }
    
    return {
      valid: data.numero ? true : false,
      number: data.numero || cleanNumber,
      localFormat: data.numero || cleanNumber,
      internationalFormat: data.numero_internacional || cleanNumber,
      countryPrefix: '+55',
      countryCode: 'BR',
      countryName: 'Brazil',
      location: data.localizacao || 'Brasil',
      carrier: data.operadora || 'Desconhecida',
      lineType: data.tipo || 'Desconhecido',
    };
  } catch (error) {
    console.error('Erro ao validar telefone:', error);
    return null;
  }
};
