
// Tipo para informações de perfil
export interface ProfileInfo {
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
  { id: 'pinterest', name: 'Pinterest', icon: 'image' },
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
    }
  ];
};

// Função para pesquisar por nome
export const searchByName = async (name: string): Promise<SearchResult> => {
  // Simulando um delay para parecer que está fazendo uma pesquisa real
  await new Promise(resolve => setTimeout(resolve, 2000));

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

    return {
      profiles,
      isLoading: false,
      error: null
    };
  } catch (error) {
    return {
      profiles: [],
      isLoading: false,
      error: "Erro ao processar a pesquisa. Tente novamente mais tarde."
    };
  }
};
