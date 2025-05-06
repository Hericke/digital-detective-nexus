
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
  category?: string; // Nova propriedade para categorização
}

// Tipo para resultados gerais
export interface SearchResult {
  profiles: ProfileInfo[];
  isLoading: boolean;
  error: string | null;
  searchId?: string;
}

// Plataformas suportadas organizadas por categorias
export const platformCategories = [
  {
    name: "Redes Sociais",
    platforms: [
      { id: 'facebook', name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com' },
      { id: 'instagram', name: 'Instagram', icon: 'instagram', url: 'https://www.instagram.com' },
      { id: 'twitter', name: 'Twitter/X', icon: 'twitter', url: 'https://twitter.com' },
      { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com' },
      { id: 'tiktok', name: 'TikTok', icon: 'video', url: 'https://www.tiktok.com' },
      { id: 'youtube', name: 'YouTube', icon: 'youtube', url: 'https://www.youtube.com' },
      { id: 'reddit', name: 'Reddit', icon: 'reddit', url: 'https://www.reddit.com' },
      { id: 'pinterest', name: 'Pinterest', icon: 'pinterest', url: 'https://www.pinterest.com' },
      { id: 'tumblr', name: 'Tumblr', icon: 'image', url: 'https://www.tumblr.com' },
      { id: 'github', name: 'GitHub', icon: 'github', url: 'https://github.com' },
      { id: 'medium', name: 'Medium', icon: 'file-text', url: 'https://medium.com' },
      { id: 'flickr', name: 'Flickr', icon: 'image', url: 'https://www.flickr.com' },
      { id: 'vimeo', name: 'Vimeo', icon: 'video', url: 'https://vimeo.com' },
      { id: 'quora', name: 'Quora', icon: 'help-circle', url: 'https://www.quora.com' },
      { id: 'soundcloud', name: 'SoundCloud', icon: 'music', url: 'https://soundcloud.com' },
      { id: 'mastodon', name: 'Mastodon', icon: 'globe', url: 'https://mastodon.social' },
      { id: 'vk', name: 'VK', icon: 'message-square', url: 'https://vk.com' },
      { id: 'gab', name: 'Gab', icon: 'message-circle', url: 'https://gab.com' },
      { id: 'gettr', name: 'Gettr', icon: 'message-square', url: 'https://gettr.com' },
      { id: 'truthsocial', name: 'Truth Social', icon: 'message-circle', url: 'https://truthsocial.com' },
      { id: 'clubhouse', name: 'Clubhouse', icon: 'headphones', url: 'https://www.clubhouse.com' }
    ]
  },
  {
    name: "Motores de Busca",
    platforms: [
      { id: 'google', name: 'Google', icon: 'search', url: 'https://www.google.com' },
      { id: 'bing', name: 'Bing', icon: 'search', url: 'https://www.bing.com' },
      { id: 'duckduckgo', name: 'DuckDuckGo', icon: 'search', url: 'https://duckduckgo.com' },
      { id: 'yandex', name: 'Yandex', icon: 'search', url: 'https://yandex.com' },
      { id: 'startpage', name: 'Startpage', icon: 'search', url: 'https://www.startpage.com' }
    ]
  },
  {
    name: "Ferramentas OSINT",
    platforms: [
      { id: 'shodan', name: 'Shodan', icon: 'search', url: 'https://www.shodan.io' },
      { id: 'censys', name: 'Censys', icon: 'search', url: 'https://censys.io' },
      { id: 'hunter', name: 'Hunter.io', icon: 'at-sign', url: 'https://hunter.io' },
      { id: 'haveibeenpwned', name: 'Have I Been Pwned', icon: 'shield-alert', url: 'https://haveibeenpwned.com' },
      { id: 'intelx', name: 'Intelligence X', icon: 'search', url: 'https://intelx.io' },
      { id: 'creepy', name: 'Creepy', icon: 'map-pin', url: 'https://github.com/ilektrojohn/creepy' },
      { id: 'socialsearcher', name: 'Social Searcher', icon: 'users', url: 'https://www.social-searcher.com' },
      { id: 'publicwww', name: 'PublicWWW', icon: 'globe', url: 'https://publicwww.com' },
      { id: 'builtwith', name: 'BuiltWith', icon: 'code', url: 'https://builtwith.com' },
      { id: 'whatcms', name: 'WhatCMS', icon: 'code', url: 'https://whatcms.org' },
      { id: 'zoomeye', name: 'ZoomEye', icon: 'search', url: 'https://www.zoomeye.org' }
    ]
  },
  {
    name: "Vazamentos e Dados",
    platforms: [
      { id: 'leakcheck', name: 'LeakCheck', icon: 'database', url: 'https://leakcheck.io' },
      { id: 'breachdirectory', name: 'BreachDirectory', icon: 'database', url: 'https://breachdirectory.org' },
      { id: 'snusbase', name: 'Snusbase', icon: 'database', url: 'https://snusbase.com' },
      { id: 'emailrep', name: 'EmailRep.io', icon: 'mail', url: 'https://emailrep.io' }
    ]
  },
  {
    name: "Ferramentas Especializadas",
    platforms: [
      { id: 'jusbrasil', name: 'JusBrasil', icon: 'gavel', url: 'https://www.jusbrasil.com.br' },
      { id: 'transparencyreport', name: 'Google Transparency', icon: 'eye', url: 'https://transparencyreport.google.com' },
      { id: 'exiftool', name: 'ExifTool', icon: 'image', url: 'https://exiftool.org' },
      { id: 'fotoforensics', name: 'FotoForensics', icon: 'image', url: 'https://fotoforensics.com' },
      { id: 'urlscan', name: 'URLScan', icon: 'link', url: 'https://urlscan.io' },
      { id: 'virustotal', name: 'VirusTotal', icon: 'shield', url: 'https://www.virustotal.com' },
      { id: 'viewdns', name: 'ViewDNS', icon: 'globe', url: 'https://viewdns.info' }
    ]
  },
  {
    name: "Frameworks OSINT",
    platforms: [
      { id: 'theharvester', name: 'TheHarvester', icon: 'search', url: 'https://github.com/laramies/theHarvester' },
      { id: 'reconng', name: 'Recon-ng', icon: 'search', url: 'https://github.com/lanmaster53/recon-ng' },
      { id: 'maltego', name: 'Maltego', icon: 'git-branch', url: 'https://www.maltego.com' },
      { id: 'spiderfoot', name: 'SpiderFoot', icon: 'search', url: 'https://www.spiderfoot.net' },
      { id: 'foca', name: 'FOCA', icon: 'file-text', url: 'https://www.elevenpaths.com/labstools/foca/index.html' },
      { id: 'osintframework', name: 'OSINT Framework', icon: 'git-branch', url: 'https://osintframework.com' }
    ]
  }
];

// Função auxiliar para obter uma lista simples de todas as plataformas
export const platforms = platformCategories.flatMap(category => category.platforms);

// Função para gerar perfis mais realísticos
const generateRealisticProfiles = (name: string): ProfileInfo[] => {
  const firstName = name.split(' ')[0].toLowerCase();
  const fullNameSlug = name.toLowerCase().replace(/\s+/g, '.');
  const randomNumbers = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  const profiles: ProfileInfo[] = [];
  
  // Redes Sociais - incluir um perfil para cada principal rede social
  profiles.push({
    name: name,
    username: `${fullNameSlug}`,
    email: `${fullNameSlug}@gmail.com`,
    phone: `+55 ${Math.floor(Math.random() * 90) + 10} 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
    location: "São Paulo, Brasil",
    bio: `Profissional de ${Math.random() > 0.5 ? 'Marketing Digital' : 'Tecnologia da Informação'} | ${Math.random() > 0.5 ? 'Empreendedor' : 'Consultor'} | ${Math.random() > 0.5 ? 'Viajante' : 'Fotógrafo amador'}`,
    avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '')}1`,
    url: `https://facebook.com/${fullNameSlug}`,
    platform: "Facebook",
    platformIcon: "facebook",
    category: "Redes Sociais"
  });
  
  profiles.push({
    name: name,
    username: `@${firstName}${randomNumbers.substring(0, 2)}`,
    location: `${Math.random() > 0.5 ? 'Rio de Janeiro' : 'São Paulo'}, Brasil`,
    bio: `${Math.random() > 0.5 ? 'Fotografia' : 'Lifestyle'} | ${Math.random() > 0.5 ? 'Viagens' : 'Gastronomia'} | ${Math.random() > 0.5 ? 'Moda' : 'Arte'}`,
    avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '')}2`,
    url: `https://instagram.com/${firstName}${randomNumbers.substring(0, 2)}`,
    platform: "Instagram",
    platformIcon: "instagram",
    category: "Redes Sociais"
  });
  
  profiles.push({
    name: name,
    username: `@${firstName}_${randomNumbers.substring(2, 4)}`,
    location: "Brasil",
    bio: `${Math.random() > 0.5 ? 'Compartilhando pensamentos' : 'Comentando o cotidiano'} | ${Math.random() > 0.5 ? 'Tecnologia' : 'Política'} | ${Math.random() > 0.5 ? 'Esportes' : 'Música'}`,
    avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '')}3`,
    url: `https://twitter.com/${firstName}_${randomNumbers.substring(2, 4)}`,
    platform: "Twitter/X",
    platformIcon: "twitter",
    category: "Redes Sociais"
  });
  
  profiles.push({
    name: name,
    username: `${fullNameSlug}`,
    email: `${fullNameSlug}@outlook.com`,
    location: `${Math.random() > 0.5 ? 'São Paulo' : 'Curitiba'}, Brasil`,
    bio: `${Math.random() > 0.5 ? 'Profissional de Marketing Digital' : 'Especialista em TI'} | ${Math.random() > 0.5 ? 'MBA' : 'Pós-graduado'} em ${Math.random() > 0.5 ? 'Gestão de Negócios' : 'Ciência de Dados'}`,
    avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '')}4`,
    url: `https://linkedin.com/in/${fullNameSlug}`,
    platform: "LinkedIn",
    platformIcon: "linkedin",
    category: "Redes Sociais"
  });
  
  profiles.push({
    name: name,
    username: `@${firstName}.trends`,
    location: "Brasil",
    bio: `${Math.random() > 0.5 ? 'Criador de conteúdo' : 'Influenciador digital'} | ${Math.random() > 0.5 ? 'Dicas de lifestyle' : 'Entretenimento'} | ${Math.random() > 0.5 ? 'Humor' : 'Tendências'}`,
    avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '')}5`,
    url: `https://tiktok.com/@${firstName}.trends`,
    platform: "TikTok",
    platformIcon: "video",
    category: "Redes Sociais"
  });
  
  // YouTube
  profiles.push({
    name: name,
    username: `${firstName}.tube`,
    location: "Brasil",
    bio: `Canal sobre ${Math.random() > 0.5 ? 'tecnologia e games' : 'lifestyle e viagens'} | ${Math.random() > 0.5 ? 'Reviews' : 'Tutoriais'} | ${Math.random() > 0.5 ? 'Vlogs' : 'Dicas'}`,
    avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '')}6`,
    url: `https://youtube.com/c/${firstName}tube`,
    platform: "YouTube",
    platformIcon: "youtube",
    category: "Redes Sociais"
  });
  
  // GitHub 
  if (Math.random() > 0.5) {
    profiles.push({
      name: name,
      username: `${firstName}${randomNumbers.substring(0, 2)}`,
      location: "Brasil",
      bio: `Desenvolvedor ${Math.random() > 0.5 ? 'Frontend' : 'Backend'} | ${Math.random() > 0.5 ? 'JavaScript' : 'Python'} | Open Source Contributor`,
      avatar: `https://i.pravatar.cc/150?u=${name.replace(/\s+/g, '')}7`,
      url: `https://github.com/${firstName}${randomNumbers.substring(0, 2)}`,
      platform: "GitHub",
      platformIcon: "github",
      category: "Redes Sociais"
    });
  }
  
  // Motores de Busca
  profiles.push({
    name: name,
    bio: "Resultados de pesquisa do Google",
    url: `https://www.google.com/search?q=${encodeURIComponent(name)}`,
    platform: "Google",
    platformIcon: "search",
    category: "Motores de Busca"
  });

  // Ferramentas OSINT e Jurídicas
  profiles.push({
    name: name,
    username: `${firstName}.legal${randomNumbers.substring(0, 2)}`,
    location: "Brasil",
    bio: "Processos, documentos e informações jurídicas",
    url: `https://www.jusbrasil.com.br/busca?q=${encodeURIComponent(name)}`,
    platform: "JusBrasil",
    platformIcon: "gavel",
    category: "Ferramentas Especializadas"
  });
  
  // Vazamento de dados
  if (Math.random() > 0.7) {
    profiles.push({
      name: name,
      email: `${fullNameSlug}@protonmail.com`,
      bio: "Possível vazamento de dados detectado",
      url: `https://haveibeenpwned.com/unifiedsearch/${encodeURIComponent(fullNameSlug)}`,
      platform: "Have I Been Pwned",
      platformIcon: "shield-alert",
      category: "Vazamentos e Dados"
    });
  }

  return profiles;
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
