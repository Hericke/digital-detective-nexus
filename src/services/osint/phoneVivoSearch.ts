// Serviço para consulta de telefone Vivo usando RapidAPI
import { secureApiClient } from '../api/secureApiClient';

export interface PhoneVivoResult {
  telefone: string;
  operadora: string;
  nome?: string;
  endereco?: string;
  cidade?: string;
  uf?: string;
  status: string;
}

export const searchPhoneVivo = async (phone: string): Promise<PhoneVivoResult | null> => {
  try {
    console.log('Consultando telefone Vivo:', phone);
    
    // Limpar o número de telefone
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    const data = await secureApiClient.rapidApiRequest(`apis/telefone_vivo.php?key=teste&telefone=${cleanPhone}`, {
      headers: {
        'x-rapidapi-host': 'api-consulta-telefone-vivo.p.rapidapi.com'
      }
    });
    
    console.log('Resposta Phone Vivo API:', data);
    
    if (data.error || !data.telefone) {
      console.error('Erro na API telefone Vivo:', data.error);
      return null;
    }
    
    return {
      telefone: data.telefone,
      operadora: data.operadora || 'Vivo',
      nome: data.nome,
      endereco: data.endereco,
      cidade: data.cidade,
      uf: data.uf,
      status: data.status || 'Ativo'
    };
  } catch (error) {
    console.error('Erro ao consultar telefone Vivo:', error);
    return null;
  }
};