
import React from 'react';
import { ExternalLink, MapPin, User } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
    return LucideIcons[formattedIconName as keyof typeof LucideIcons] || LucideIcons.Search;
  };

  // Agrupar resultados por plataforma
  const groupedResults = results.reduce<Record<string, ProfileInfo[]>>((acc, profile) => {
    const platform = profile.platform;
    if (!acc[platform]) {
      acc[platform] = [];
    }
    acc[platform].push(profile);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <h3 className="text-2xl font-bold mb-6 cyber-text">Resultados da Pesquisa</h3>
      
      <div className="space-y-6">
        {Object.entries(groupedResults).map(([platform, profiles]) => (
          <div key={platform} className="space-y-4">
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-semibold">{platform}</h4>
              <Badge variant="secondary" className="ml-2">
                {profiles.length} {profiles.length === 1 ? 'resultado' : 'resultados'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profiles.map((profile, index) => {
                const IconComponent = getIconComponent(profile.platformIcon);
                return (
                  <Card key={index} className="result-card">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          {profile.avatar ? (
                            <img 
                              src={profile.avatar} 
                              alt={profile.name || 'Avatar'} 
                              className="w-10 h-10 rounded-full object-cover"
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
                            <p className="text-sm text-muted-foreground">
                              {profile.username}
                            </p>
                          </div>
                        </div>
                        <div>
                          <IconComponent className="platform-icon" />
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-2 pt-2">
                      {profile.location && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      
                      {profile.bio && (
                        <p className="text-sm line-clamp-2">{profile.bio}</p>
                      )}
                      
                      {profile.email && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Email:</span> {profile.email}
                        </p>
                      )}
                      
                      {profile.phone && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Telefone:</span> {profile.phone}
                        </p>
                      )}
                      
                      <Separator className="my-2" />
                      
                      {profile.url && (
                        <Button
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.open(profile.url, '_blank')}
                        >
                          Ver Perfil
                          <ExternalLink className="ml-2 w-3 h-3" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsDisplay;
