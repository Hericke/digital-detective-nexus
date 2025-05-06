
import React, { useMemo } from 'react';
import { User, MapPin, Mail, Phone, ExternalLink, Shield, Search, Info, AlertTriangle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import type { ProfileInfo } from '@/services/searchService';

interface ProfileCardProps {
  profiles: ProfileInfo[];
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profiles }) => {
  // Helper function to get icon component by name
  const getIconComponent = (iconName: string) => {
    // Convert first letter to uppercase and use the rest as is
    const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    // Access the icon from LucideIcons object
    const IconComponent = (LucideIcons as any)[formattedIconName] || LucideIcons.Search;
    return IconComponent;
  };

  const consolidatedProfile = useMemo(() => {
    if (profiles.length === 0) return null;

    // Usar o primeiro perfil como base e consolidar informações de todos
    const mainProfile = profiles[0];
    const allEmails = profiles
      .filter(p => p.email)
      .map(p => p.email)
      .filter((email, index, self) => email && self.indexOf(email) === index);

    const allPhones = profiles
      .filter(p => p.phone)
      .map(p => p.phone)
      .filter((phone, index, self) => phone && self.indexOf(phone) === index);

    const allLocations = profiles
      .filter(p => p.location)
      .map(p => p.location)
      .filter((location, index, self) => location && self.indexOf(location) === index);

    // Agrupar por categoria
    const groupedPlatforms = profiles.reduce((acc: Record<string, any[]>, profile) => {
      const category = profile.category || 'Outros';
      if (!acc[category]) {
        acc[category] = [];
      }
      
      acc[category].push({
        name: profile.platform,
        username: profile.username,
        url: profile.url,
        icon: profile.platformIcon
      });
      
      return acc;
    }, {});

    return {
      name: mainProfile.name,
      avatar: mainProfile.avatar,
      emails: allEmails,
      phones: allPhones,
      locations: allLocations,
      platforms: profiles.map(p => ({
        name: p.platform,
        username: p.username,
        url: p.url,
        icon: p.platformIcon,
        category: p.category || 'Outros'
      })),
      categorizedPlatforms: groupedPlatforms
    };
  }, [profiles]);

  if (!consolidatedProfile) return null;

  const handleOpenGoogleSearch = (name: string) => {
    const searchQuery = encodeURIComponent(name);
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
  };

  const categories = Object.keys(consolidatedProfile.categorizedPlatforms).sort((a, b) => {
    // Ordenar Redes Sociais primeiro, depois Motores de Busca
    const order: Record<string, number> = {
      'Redes Sociais': 1,
      'Motores de Busca': 2,
      'Ferramentas OSINT': 3,
      'Vazamentos e Dados': 4,
      'Ferramentas Especializadas': 5,
      'Frameworks OSINT': 6,
      'Outros': 7
    };
    return (order[a] || 999) - (order[b] || 999);
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      <h3 className="text-2xl font-bold mb-6 cyber-text">Perfil Consolidado</h3>
      
      <Card className="cyber-border overflow-hidden bg-gradient-to-br from-card to-background/90">
        <CardHeader className="pb-2 border-b border-muted">
          <div className="flex items-center gap-4">
            {consolidatedProfile.avatar ? (
              <img 
                src={consolidatedProfile.avatar} 
                alt={consolidatedProfile.name || 'Avatar'} 
                className="w-16 h-16 rounded-full object-cover border-2 border-primary/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center border-2 border-primary/30">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold">
                {consolidatedProfile.name}
              </CardTitle>
              <div className="flex flex-wrap gap-1 mt-2">
                {categories.map((category) => (
                  <Badge key={category} variant="secondary" className="mr-1 mb-1">
                    {category}: {consolidatedProfile.categorizedPlatforms[category].length}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline" 
                      size="sm"
                      className="border-primary/30 hover:border-primary"
                      onClick={() => handleOpenGoogleSearch(consolidatedProfile.name || '')}
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Buscar no Google
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline" 
                      size="sm"
                      className="border-primary/30 hover:border-primary"
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Informações consolidadas de {profiles.length} perfis
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consolidatedProfile.locations.length > 0 && (
              <div className="space-y-2 bg-muted/30 p-3 rounded-md">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Localização</span>
                </div>
                <ul className="space-y-1">
                  {consolidatedProfile.locations.map((location, index) => (
                    <li key={index} className="text-sm flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-primary/70"></span>
                      {location}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {consolidatedProfile.emails.length > 0 && (
              <div className="space-y-2 bg-muted/30 p-3 rounded-md">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>Email</span>
                </div>
                <ul className="space-y-1">
                  {consolidatedProfile.emails.map((email, index) => (
                    <li key={index} className="text-sm flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-primary/70"></span>
                      {email}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {consolidatedProfile.phones.length > 0 && (
              <div className="space-y-2 bg-muted/30 p-3 rounded-md">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>Telefone</span>
                </div>
                <ul className="space-y-1">
                  {consolidatedProfile.phones.map((phone, index) => (
                    <li key={index} className="text-sm flex items-center gap-1">
                      <span className="h-1 w-1 rounded-full bg-primary/70"></span>
                      {phone}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ExternalLink className="w-4 h-4 text-primary" />
                <span>Perfis Encontrados</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {consolidatedProfile.platforms.length} perfis
              </Badge>
            </div>
            
            {categories.map((category) => (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {consolidatedProfile.categorizedPlatforms[category].map((platform, index) => {
                    const IconComponent = getIconComponent(platform.icon);
                    return (
                      <HoverCard key={index}>
                        <HoverCardTrigger asChild>
                          <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md hover:bg-muted/70 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-muted/80 flex items-center justify-center">
                                <IconComponent size={14} className="platform-icon text-primary" />
                              </div>
                              <span className="text-sm">{platform.username || platform.name}</span>
                            </div>
                            {platform.url && (
                              <a 
                                href={platform.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </a>
                            )}
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-64">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <IconComponent size={16} className="text-primary" />
                              <p className="font-medium">{platform.name}</p>
                            </div>
                            {platform.username && <p className="text-sm">{platform.username}</p>}
                            {platform.url && (
                              <a 
                                href={platform.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline truncate block"
                              >
                                {platform.url}
                              </a>
                            )}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-3 bg-muted/30 rounded-md flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-yellow-400" />
            <p className="text-muted-foreground">
              Este aplicativo exibe apenas informações publicamente disponíveis. 
              Use de forma ética e responsável.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCard;
