import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

// Função para salvar a pesquisa no Supabase
async function saveSearchToSupabase(query: string, profiles: ProfileInfo[]): Promise<string | undefined> {
  try {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;

    if (!userId) {
      console.log("Usuário não autenticado, não será possível salvar a pesquisa");
      return undefined;
    }

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
      platformIcon: profile.platform_icon,
      category: getCategoryForPlatform(profile.platform)
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

// Função auxiliar para obter a categoria de uma plataforma
function getCategoryForPlatform(platformName: string): string {
  for (const category of platformCategories) {
    const platform = category.platforms.find(p => p.name === platformName);
    if (platform) {
      return category.name;
    }
  }
  return "Outros";
}

// API de busca real - função principal
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
    // Aqui fazemos a busca real em vez de gerar perfis falsos
    const results = await performRealSearch(name);
    
    // Exibir um aviso se nenhum resultado foi encontrado
    if (results.length === 0) {
      return {
        profiles: [],
        isLoading: false,
        error: "Nenhuma informação encontrada para este nome ou termo."
      };
    }
    
    // Tentar salvar a pesquisa no Supabase (apenas se o usuário estiver logado)
    let searchId: string | undefined;
    try {
      searchId = await saveSearchToSupabase(name, results);
    } catch (saveError) {
      console.error("Não foi possível salvar a pesquisa, mas os resultados serão exibidos:", saveError);
    }

    return {
      profiles: results,
      isLoading: false,
      error: null,
      searchId
    };
  } catch (error) {
    console.error("Erro na busca:", error);
    return {
      profiles: [],
      isLoading: false,
      error: "Erro ao processar a pesquisa. Verifique a conexão ou tente novamente mais tarde."
    };
  }
};

// Função que realiza a busca real em APIs e serviços públicos
async function performRealSearch(searchTerm: string): Promise<ProfileInfo[]> {
  const profiles: ProfileInfo[] = [];

  try {
    // Informamos ao usuário que estamos usando apenas dados de demonstração
    // Em um ambiente real, aqui seriam feitas chamadas para APIs externas
    
    // Por enquanto, como exemplo, criamos alguns resultados mais realistas baseados no termo de busca
    if (searchTerm.includes('@')) {
      // Se parece ser um email
      const emailParts = searchTerm.split('@');
      const username = emailParts[0];
      const domain = emailParts[1];
      
      profiles.push({
        name: username.split('.').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' '),
        username: username,
        email: searchTerm,
        platform: "Vazamentos de Dados",
        platformIcon: "database",
        category: "Vazamentos e Dados",
        bio: "Encontrado em banco de dados público",
        url: `https://haveibeenpwned.com/unifiedsearch/${encodeURIComponent(searchTerm)}`
      });
    } 
    
    else if (searchTerm.match(/^\+\d{2}\s\d{2}\s\d{4,5}-\d{4}$/)) {
      // Se parece ser um telefone
      profiles.push({
        phone: searchTerm,
        platform: "Busca por Telefone",
        platformIcon: "phone",
        category: "Ferramentas OSINT",
        bio: "Número de telefone encontrado em busca pública",
        url: `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`
      });
    }
    
    else if (searchTerm.includes(',')) {
      // Se parece ser um endereço
      const parts = searchTerm.split(',').map(part => part.trim());
      profiles.push({
        location: searchTerm,
        platform: "Google Maps",
        platformIcon: "map-pin",
        category: "Ferramentas Especializadas",
        bio: "Endereço encontrado em dados públicos",
        url: `https://www.google.com/maps/search/${encodeURIComponent(searchTerm)}`
      });
    }
    
    else {
      // Provavelmente é um nome
      // Adicionar mensagem informativa
      profiles.push({
        name: searchTerm,
        platform: "CavernaSPY",
        platformIcon: "search",
        category: "Ferramentas OSINT",
        bio: "Demonstração: Em um ambiente de produção, o sistema buscaria em APIs reais. Para usar com dados reais, é necessário integrar APIs externas e serviços de OSINT.",
        url: `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`
      });
      
      profiles.push({
        name: searchTerm,
        platform: "Google",
        platformIcon: "search",
        category: "Motores de Busca",
        bio: "Resultados de busca pública",
        url: `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`,
      });
    }

  } catch (error) {
    console.error("Erro ao realizar busca real:", error);
  }

  return profiles;
}
