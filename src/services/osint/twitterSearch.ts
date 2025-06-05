
// Tipos para resultados do Twitter/X
export interface TwitterProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  tweetCount: number;
  avatarUrl: string;
  bannerUrl?: string;
  profileUrl: string;
  verified: boolean;
  location?: string;
  website?: string;
  createdAt: string;
  isPrivate: boolean;
}

export interface TwitterTweet {
  id: string;
  text: string;
  createdAt: string;
  publicMetrics: {
    retweetCount: number;
    likeCount: number;
    replyCount: number;
    quoteCount: number;
  };
}

export interface TwitterSearchResult {
  success: boolean;
  data?: {
    profile: TwitterProfile;
    recentTweets?: TwitterTweet[];
  };
  error?: string;
}

const TWITTER_BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAM8Y2QEAAAAAac2SnRivA0R9Q1e%2BBtQT9CGFS%2Fs%3DJm5rvNWUPsIWA8oDFdK9kdCGDUXR0orGWJ9VY4aWX5FxhX71Ss";

export const searchTwitterProfile = async (username: string): Promise<TwitterSearchResult> => {
  try {
    // Remove @ se presente no username
    const cleanUsername = username.replace('@', '');
    
    console.log('Buscando perfil Twitter para:', cleanUsername);
    
    // Buscar informações do usuário
    const userResponse = await fetch(
      `https://api.twitter.com/2/users/by/username/${cleanUsername}?user.fields=id,name,username,description,public_metrics,verified,location,url,profile_image_url,created_at,protected`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!userResponse.ok) {
      console.error('Erro na resposta da API Twitter:', userResponse.status, userResponse.statusText);
      
      if (userResponse.status === 401) {
        return {
          success: false,
          error: 'Token de acesso inválido para Twitter'
        };
      }
      
      if (userResponse.status === 404) {
        return {
          success: false,
          error: 'Usuário não encontrado no Twitter'
        };
      }
      
      return {
        success: false,
        error: `Erro na API Twitter: ${userResponse.status}`
      };
    }

    const userData = await userResponse.json();
    console.log('Resposta da API Twitter (usuário):', userData);

    if (!userData.data) {
      return {
        success: false,
        error: 'Usuário não encontrado no Twitter'
      };
    }

    const user = userData.data;
    const profile: TwitterProfile = {
      id: user.id,
      username: user.username,
      displayName: user.name,
      bio: user.description || '',
      followerCount: user.public_metrics?.followers_count || 0,
      followingCount: user.public_metrics?.following_count || 0,
      tweetCount: user.public_metrics?.tweet_count || 0,
      avatarUrl: user.profile_image_url?.replace('_normal', '_400x400') || '',
      profileUrl: `https://twitter.com/${user.username}`,
      verified: user.verified || false,
      location: user.location || undefined,
      website: user.url || undefined,
      createdAt: user.created_at,
      isPrivate: user.protected || false
    };

    // Buscar tweets recentes do usuário (se o perfil não for privado)
    let recentTweets: TwitterTweet[] = [];
    
    if (!profile.isPrivate) {
      try {
        const tweetsResponse = await fetch(
          `https://api.twitter.com/2/users/${user.id}/tweets?max_results=10&tweet.fields=created_at,public_metrics`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (tweetsResponse.ok) {
          const tweetsData = await tweetsResponse.json();
          console.log('Resposta da API Twitter (tweets):', tweetsData);
          
          if (tweetsData.data) {
            recentTweets = tweetsData.data.map((tweet: any) => ({
              id: tweet.id,
              text: tweet.text,
              createdAt: tweet.created_at,
              publicMetrics: {
                retweetCount: tweet.public_metrics?.retweet_count || 0,
                likeCount: tweet.public_metrics?.like_count || 0,
                replyCount: tweet.public_metrics?.reply_count || 0,
                quoteCount: tweet.public_metrics?.quote_count || 0
              }
            }));
          }
        }
      } catch (tweetsError) {
        console.warn('Erro ao buscar tweets, mas perfil foi encontrado:', tweetsError);
      }
    }

    return {
      success: true,
      data: {
        profile,
        recentTweets
      }
    };

  } catch (error) {
    console.error('Erro ao buscar perfil Twitter:', error);
    return {
      success: false,
      error: 'Erro ao conectar com a API do Twitter'
    };
  }
};
