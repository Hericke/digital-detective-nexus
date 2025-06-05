
import { RAPIDAPI_CONFIG, API_ENDPOINTS } from './config';
import { WhatsAppData, OSINTAPIResult } from './types';

export const getWhatsAppProfile = async (phone: string): Promise<OSINTAPIResult<WhatsAppData>> => {
  try {
    // Limpar formatação do telefone
    const cleanPhone = phone.replace(/\D/g, '');
    console.log('Buscando perfil WhatsApp para:', cleanPhone);
    
    const response = await fetch(`${API_ENDPOINTS.WHATSAPP_OSINT}/wspic/b64?phone=${cleanPhone}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_CONFIG.key,
        'X-RapidAPI-Host': 'whatsapp-osint.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Erro na API: ${response.status}`,
        source: 'WhatsApp OSINT'
      };
    }

    const data = await response.json();
    console.log('Resposta da API WhatsApp:', data);

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
    console.error('Erro ao buscar perfil WhatsApp:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API do WhatsApp',
      source: 'WhatsApp OSINT'
    };
  }
};
