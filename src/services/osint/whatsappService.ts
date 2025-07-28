
import { API_ENDPOINTS } from './config';
import { secureApiClient } from '../api/secureApiClient';
import { WhatsAppData, OSINTAPIResult } from './types';

export const getWhatsAppProfile = async (phone: string): Promise<OSINTAPIResult<WhatsAppData>> => {
  try {
    // Limpar formatação do telefone
    const cleanPhone = phone.replace(/\D/g, '');
    
    
    const data = await secureApiClient.rapidApiRequest(`${API_ENDPOINTS.WHATSAPP_OSINT}/wspic/b64?phone=${cleanPhone}`);

    if (data.error) {
      
      return {
        success: false,
        error: data.error,
        source: 'WhatsApp OSINT'
      };
    }
    

    return {
      success: true,
      data: {
        phone: cleanPhone,
        profile_pic: data.profile_pic || '',
        about: data.about || '',
        last_seen: data.last_seen || ''
      },
      source: 'WhatsApp OSINT'
    };

  } catch (error) {
    
    return {
      success: false,
      error: 'Erro ao conectar com a API do WhatsApp. Verifique sua conexão.',
      source: 'WhatsApp OSINT'
    };
  }
};
