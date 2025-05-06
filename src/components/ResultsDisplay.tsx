
import React, { useState } from 'react';
import { ExternalLink, MapPin, User, Search, Filter, ChevronDown, ChevronUp, AlertTriangle, Info } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import type { ProfileInfo } from '@/services/searchService';

interface ResultsDisplayProps {
  results: ProfileInfo[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  if (results.length === 0) {
    return null;
  }

  // Helper function to get icon component by name
  const getIconComponent = (iconName: string) => {
    // Convert first letter to uppercase and use the rest as is
    const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    // Access the icon from LucideIcons object
    const IconComponent = (LucideIcons as any)[formattedIconName] || LucideIcons.Search;
    return IconComponent;
  };

  // Agrupar resultados por categoria e por plataforma
  const groupedResults = results.reduce<Record<string, Record<string, ProfileInfo[]>>>((acc, profile) => {
    const category = profile.category || 'Outros';
    const platform = profile.platform;
    
    if (!acc[category]) {
      acc[category] = {};
    }
    
    if (!acc[category][platform]) {
      acc[category][platform] = [];
    }
    
    acc[category][platform].push(profile);
    return acc;
  }, {});

  // Obter as categorias em uma ordem específica
  const categories = Object.keys(groupedResults).sort((a, b) => {
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

  const handleOpenGoogleSearch = (name: string) => {
    const searchQuery = encodeURIComponent(name);
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
  };

  const handleOpenProfileUrl = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold cyber-text">Resultados da Pesquisa</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="py-1.5">
            {results.length} resultados
          </Badge>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">Os resultados são gerados a partir de fontes públicas. Use estas informações de forma ética e responsável.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="space-y-6">
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-0"
        >
          {categories.map((category, categoryIndex) => (
            <AccordionItem key={category} value={`item-${categoryIndex}`}>
              <AccordionTrigger className="py-4">
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-semibold">{category}</h4>
                  <Badge variant="secondary" className="ml-2">
                    {Object.values(groupedResults[category])
                      .reduce((sum, profiles) => sum + profiles.length, 0)}{' '}
                    {Object.values(groupedResults[category]).reduce((sum, profiles) => sum + profiles.length, 0) === 1 ? 'resultado' : 'resultados'}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-2 pt-4">
                <div className="space-y-8">
                  {Object.entries(groupedResults[category]).map(([platform, profiles]) => (
                    <div key={platform} className="space-y-4">
                      <div className="flex items-center gap-2 pl-2 border-l-2 border-primary">
                        <h5 className="text-lg font-medium">{platform}</h5>
                        <Badge variant="outline">
                          {profiles.length} {profiles.length === 1 ? 'perfil' : 'perfis'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {profiles.map((profile, index) => {
                          const IconComponent = getIconComponent(profile.platformIcon);
                          return (
                            <Card key={index} className="result-card overflow-hidden border-muted hover:border-primary/50 transition-all duration-300">
                              <CardHeader className="pb-2 bg-muted/30">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-3">
                                    {profile.avatar ? (
                                      <img 
                                        src={profile.avatar} 
                                        alt={profile.name || 'Avatar'} 
                                        className="w-10 h-10 rounded-full object-cover border border-muted"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                        <User className="w-5 h-5 text-muted-foreground" />
                                      </div>
                                    )}
                                    <div>
                                      <CardTitle className="text-base font-medium">
                                        {profile.name}
                                      </CardTitle>
                                      <p className="text-sm text-muted-foreground truncate max-w-[180px]">
                                        {profile.username}
                                      </p>
                                    </div>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => profile.url && window.open(profile.url, '_blank')}
                                    className="h-7 w-7 p-0 rounded-full"
                                  >
                                    <IconComponent className="platform-icon" size={16} />
                                  </Button>
                                </div>
                              </CardHeader>
                              
                              <CardContent className="space-y-2 pt-3">
                                {profile.location && (
                                  <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <span className="truncate">{profile.location}</span>
                                  </div>
                                )}
                                
                                {profile.bio && (
                                  <p className="text-sm line-clamp-2">{profile.bio}</p>
                                )}
                                
                                {profile.email && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    <span className="font-semibold">Email:</span> {profile.email}
                                  </p>
                                )}
                                
                                {profile.phone && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    <span className="font-semibold">Telefone:</span> {profile.phone}
                                  </p>
                                )}
                                
                                <Separator className="my-3" />
                                
                                <div className="flex gap-2">
                                  {profile.url && (
                                    <Button
                                      variant="outline" 
                                      size="sm" 
                                      className="flex-1 font-medium border-primary/30 hover:border-primary/70"
                                      onClick={() => handleOpenProfileUrl(profile.url || '')}
                                    >
                                      Ver Perfil
                                      <ExternalLink className="ml-2 w-3 h-3" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="secondary" 
                                    size="sm" 
                                    className="flex-1 font-medium"
                                    onClick={() => handleOpenGoogleSearch(profile.name || '')}
                                  >
                                    Google
                                    <Search className="ml-2 w-3 h-3" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-8 bg-muted/30 rounded-lg p-4 border border-muted">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1 text-foreground">Aviso de Uso Responsável</p>
            <p>
              Esta ferramenta coleta apenas dados de fontes públicas. Use as informações obtidas de forma ética e de acordo com as leis aplicáveis. 
              O uso indevido destas informações para assédio, perseguição ou qualquer atividade ilícita é estritamente proibido.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
