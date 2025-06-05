
// Tipos para resultados do TikTok
export interface TikTokProfile {
  username: string;
  displayName: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  likesCount: number;
  videoCount: number;
  avatarUrl: string;
  profileUrl: string;
  verified: boolean;
  isPrivate: boolean;
}

export interface TikTokSearchResult {
  success: boolean;
  data?: TikTokProfile;
  error?: string;
}

const RAPIDAPI_KEY = "59142cbba6msha2cfe04e9f1fe48p1bac65jsna604cea7e65f";
const RAPIDAPI_HOST = "tiktok-api23.p.rapidapi.com";

export const searchTikTokProfile = async (username: string): Promise<TikTokSearchResult> => {
  try {
    // Remove @ se presente no username
    const cleanUsername = username.replace('@', '');
    
    console.log('Buscando perfil TikTok para:', cleanUsername);
    
    const response = await fetch(`https://${RAPIDAPI_HOST}/api/user/info?username=${cleanUsername}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Erro na resposta da API TikTok:', response.status, response.statusText);
      return {
        success: false,
        error: `Erro na API: ${response.status}`
      };
    }

    const data = await response.json();
    console.log('Resposta da API TikTok:', data);

    if (data.success && data.data) {
      const user = data.data;
      
      const profile: TikTokProfile = {
        username: user.uniqueId || cleanUsername,
        displayName: user.nickname || user.uniqueId || cleanUsername,
        bio: user.signature || '',
        followerCount: user.followerCount || 0,
        followingCount: user.followingCount || 0,
        likesCount: user.heartCount || 0,
        videoCount: user.videoCount || 0,
        avatarUrl: user.avatarMedium || user.avatarThumb || '',
        profileUrl: `https://www.tiktok.com/@${user.uniqueId || cleanUsername}`,
        verified: user.verified || false,
        isPrivate: user.privateAccount || false
      };

      return {
        success: true,
        data: profile
      };
    }

    return {
      success: false,
      error: 'Perfil não encontrado no TikTok'
    };

  } catch (error) {
    console.error('Erro ao buscar perfil TikTok:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API do TikTok'
    };
  }
};

// Função para buscar posts trending (opcional)
export const getTikTokTrending = async (count: number = 16) => {
  try {
    const response = await fetch(`https://${RAPIDAPI_HOST}/api/post/trending?count=${count}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar trending TikTok:', error);
    throw error;
  }
};
