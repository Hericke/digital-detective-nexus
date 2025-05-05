
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

  // Criando resultados simulados com dados fictícios
  const profiles: ProfileInfo[] = [
    {
      name: name,
      username: `${name.toLowerCase().replace(/\s+/g, '.')}`,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: "+55 11 98765-4321",
      location: "São Paulo, Brasil",
      bio: "Perfil profissional com interesses em tecnologia e inovação.",
      avatar: "https://i.pravatar.cc/150?u=1",
      url: "https://facebook.com/profile",
      platform: "Facebook",
      platformIcon: "facebook"
    },
    {
      name: name,
      username: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
      location: "Rio de Janeiro, Brasil",
      bio: "Fotografia, viagens e estilo de vida.",
      avatar: "https://i.pravatar.cc/150?u=2",
      url: "https://instagram.com/profile",
      platform: "Instagram",
      platformIcon: "instagram"
    },
    {
      name: name,
      username: `@${name.toLowerCase().replace(/\s+/g, '')}`,
      location: "Brasil",
      bio: "Compartilhando conhecimento e opiniões.",
      avatar: "https://i.pravatar.cc/150?u=3",
      url: "https://twitter.com/profile",
      platform: "Twitter/X",
      platformIcon: "twitter"
    },
    {
      name: name,
      username: `${name.toLowerCase().replace(/\s+/g, '-')}`,
      location: "São Paulo, Brasil",
      bio: "Profissional de Marketing Digital",
      avatar: "https://i.pravatar.cc/150?u=4",
      url: "https://linkedin.com/in/profile",
      platform: "LinkedIn",
      platformIcon: "linkedin"
    },
    {
      name: name,
      username: `@${name.toLowerCase().replace(/\s+/g, '_')}`,
      location: "Brasil",
      bio: "Vídeos curtos e entretenimento.",
      avatar: "https://i.pravatar.cc/150?u=5",
      url: "https://tiktok.com/@profile",
      platform: "TikTok",
      platformIcon: "video"
    }
  ];

  return {
    profiles,
    isLoading: false,
    error: null
  };
};
