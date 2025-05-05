
import { supabase } from "@/integrations/supabase/client";

// Tipo para informações de perfil
export interface ProfileInfo {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  url?: string;
  platform: string;
  platformIcon: string;
}

// Tipo para resultados gerais
export interface SearchResult {
  profiles: ProfileInfo[];
  isLoading: boolean;
  error: string | null;
  searchId?: string;
}

// Plataformas suportadas
export const platforms = [
  { id: 'google', name: 'Google', icon: 'search' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook' },
  { id: 'instagram', name: 'Instagram', icon: 'instagram' },
  { id: 'twitter', name: 'Twitter/X', icon: 'twitter' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin' },
  { id: 'tiktok', name: 'TikTok', icon: 'video' },
  { id: 'jusbrasil', name: 'JusBrasil', icon: 'gavel' },
  { id: 'pinterest', name: 'Pinterest', icon: 'pinterest' },
];

// Função para gerar perfis mais realísticos
const generateRealisticProfiles = (name: string): ProfileInfo[] => {
  const firstName = name.split(' ')[0].toLowerCase();
  const fullNameSlug = name.toLowerCase().replace(/\s+/g, '.');
  const randomNumbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return [
    {
      name: name,
      username: `${fullNameSlug}`,
      email: `${fullNameSlug}@gmail.com`,
      phone: `+55 ${Math.floor(Math.random() * 90) + 10} 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      location: "São Paulo, Brasil",
      bio: `Profissional de ${Math.random() > 0.5 ? 'Marketing Digital' : 'Tecnologia da Informação'} | ${Math.random() > 0.5 ? 'Empreendedor' : 'Consultor'} | ${Math.random() > 0.5 ? 'Viajante' : 'Fotógrafo amador'}`,
      avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '')}1`,
      url: `https://facebook.com/${fullNameSlug}`,
      platform: "Facebook",
      platformIcon: "facebook"
    },
    {
      name: name,
      username: `@${firstName}${randomNumbers.substring(0, 2)}`,
      location: `${Math.random() > 0.5 ? 'Rio de Janeiro' : 'São Paulo'}, Brasil`,
      bio: `${Math.random() > 0.5 ? 'Fotografia' : 'Lifestyle'} | ${Math.random() > 0.5 ? 'Viagens' : 'Gastronomia'} | ${Math.random() > 0.5 ? 'Moda' : 'Arte'}`,
      avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '')}2`,
      url: `https://instagram.com/${firstName}${randomNumbers.substring(0, 2)}`,
      platform: "Instagram",
      platformIcon: "instagram"
    },
    {
      name: name,
      username: `@${firstName}_${randomNumbers.substring(2, 4)}`,
      location: "Brasil",
      bio: `${Math.random() > 0.5 ? 'Compartilhando pensamentos' : 'Comentando o cotidiano'} | ${Math.random() > 0.5 ? 'Tecnologia' : 'Política'} | ${Math.random() > 0.5 ? 'Esportes' : 'Música'}`,
      avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '')}3`,
      url: `https://twitter.com/${firstName}_${randomNumbers.substring(2, 4)}`,
      platform: "Twitter/X",
      platformIcon: "twitter"
    },
    {
      name: name,
      username: `${fullNameSlug}`,
      email: `${fullNameSlug}@outlook.com`,
      location: `${Math.random() > 0.5 ? 'São Paulo' : 'Curitiba'}, Brasil`,
      bio: `${Math.random() > 0.5 ? 'Profissional de Marketing Digital' : 'Especialista em TI'} | ${Math.random() > 0.5 ? 'MBA' : 'Pós-graduado'} em ${Math.random() > 0.5 ? 'Gestão de Negócios' : 'Ciência de Dados'}`,
      avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '')}4`,
      url: `https://linkedin.com/in/${fullNameSlug}`,
      platform: "LinkedIn",
      platformIcon: "linkedin"
    },
    {
      name: name,
      username: `@${firstName}.trends`,
      location: "Brasil",
      bio: `${Math.random() > 0.5 ? 'Criador de conteúdo' : 'Influenciador digital'} | ${Math.random() > 0.5 ? 'Dicas de lifestyle' : 'Entretenimento'} | ${Math.random() > 0.5 ? 'Humor' : 'Tendências'}`,
      avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '')}5`,
      url: `https://tiktok.com/@${firstName}.trends`,
      platform: "TikTok",
      platformIcon: "video"
    },
    {
      name: name,
      bio: "Resultados de pesquisa do Google",
      url: `https://www.google.com/search?q=${encodeURIComponent(name)}`,
      platform: "Google",
      platformIcon: "search"
    },
    {
      name: name,
      username: `${firstName}.legal${randomNumbers.substring(0, 2)}`,
      location: "Brasil",
      bio: "Processos, documentos e informações jurídicas",
      url: `https://www.jusbrasil.com.br/busca?q=${encodeURIComponent(name)}`,
      platform: "JusBrasil",
      platformIcon: "gavel"
    },
    {
      name: name,
      username: `${firstName}.pins`,
      bio: "Coleções e imagens",
      url: `https://pinterest.com/search/pins/?q=${encodeURIComponent(name)}`,
      platform: "Pinterest",
      platformIcon: "pinterest"
    }
  ];
};

// Função para salvar a pesquisa no Supabase
async function saveSearchToSupabase(query: string, profiles: ProfileInfo[]): Promise<string | undefined> {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;

    // Inserir a pesquisa
    const { data: searchData, error: searchError } = await supabase
      .from('searches')
      .insert({ 
        query,
        user_id: userId
      })
      .select('id')
      .single();

    if (searchError) {
      console.error("Erro ao salvar pesquisa:", searchError);
      return undefined;
    }

    const searchId = searchData.id;

    // Inserir os perfis encontrados e relacioná-los à pesquisa
    for (const profile of profiles) {
      // Primeiro, inserir ou obter o perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          name: profile.name || '',
          username: profile.username,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          bio: profile.bio,
          avatar: profile.avatar,
          url: profile.url,
          platform: profile.platform,
          platform_icon: profile.platformIcon
        })
        .select('id')
        .single();

      if (profileError) {
        console.error("Erro ao salvar perfil:", profileError);
        continue;
      }

      // Relacionar o perfil à pesquisa
      const { error: relationError } = await supabase
        .from('search_profiles')
        .insert({
          search_id: searchId,
          profile_id: profileData.id
        });

      if (relationError) {
        console.error("Erro ao relacionar perfil com pesquisa:", relationError);
      }
    }

    return searchId;

  } catch (error) {
    console.error("Erro ao salvar dados no Supabase:", error);
    return undefined;
  }
}

// Função para obter histórico de pesquisas
export const getSearchHistory = async (): Promise<{ id: string, query: string, created_at: string }[]> => {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;

    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('searches')
      .select('id, query, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao obter histórico de pesquisas:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Erro ao obter histórico:", error);
    return [];
  }
};

// Função para obter detalhes de uma pesquisa específica
export const getSearchById = async (searchId: string): Promise<SearchResult> => {
  try {
    // Obter a pesquisa
    const { data: searchData, error: searchError } = await supabase
      .from('searches')
      .select('id, query')
      .eq('id', searchId)
      .single();

    if (searchError) {
      return {
        profiles: [],
        isLoading: false,
        error: "Pesquisa não encontrada"
      };
    }

    // Obter os perfis relacionados à pesquisa
    const { data: relationData, error: relationError } = await supabase
      .from('search_profiles')
      .select('profile_id')
      .eq('search_id', searchId);

    if (relationError || !relationData) {
      return {
        profiles: [],
        isLoading: false,
        error: "Erro ao obter dados da pesquisa"
      };
    }

    const profileIds = relationData.map(rel => rel.profile_id);
    
    if (profileIds.length === 0) {
      return {
        profiles: [],
        isLoading: false,
        error: null,
        searchId
      };
    }

    // Obter os detalhes dos perfis
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .in('id', profileIds);

    if (profilesError) {
      return {
        profiles: [],
        isLoading: false,
        error: "Erro ao obter perfis da pesquisa"
      };
    }

    // Converter para o formato ProfileInfo
    const profiles: ProfileInfo[] = profilesData.map(profile => ({
      id: profile.id,
      name: profile.name,
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
      location: profile.location,
      bio: profile.bio,
      avatar: profile.avatar,
      url: profile.url,
      platform: profile.platform,
      platformIcon: profile.platform_icon
    }));

    return {
      profiles,
      isLoading: false,
      error: null,
      searchId
    };

  } catch (error) {
    return {
      profiles: [],
      isLoading: false,
      error: "Erro ao processar a solicitação"
    };
  }
};

// Função para pesquisar por nome
export const searchByName = async (name: string): Promise<SearchResult> => {
  // Verificando se o nome está vazio
  if (!name.trim()) {
    return {
      profiles: [],
      isLoading: false,
      error: null
    };
  }

  try {
    // Gerando perfis mais realísticos
    const profiles = generateRealisticProfiles(name);
    
    // Salvar a pesquisa no Supabase
    const searchId = await saveSearchToSupabase(name, profiles);

    return {
      profiles,
      isLoading: false,
      error: null,
      searchId
    };
  } catch (error) {
    return {
      profiles: [],
      isLoading: false,
      error: "Erro ao processar a pesquisa. Tente novamente mais tarde."
    };
  }
};
