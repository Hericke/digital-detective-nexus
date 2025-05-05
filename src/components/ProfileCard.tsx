
import React, { useMemo } from 'react';
import { User, MapPin, Mail, Phone, ExternalLink, Shield } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
    return LucideIcons[formattedIconName as keyof typeof LucideIcons] || LucideIcons.Search;
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
        icon: p.platformIcon
      }))
    };
  }, [profiles]);

  if (!consolidatedProfile) return null;

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      <h3 className="text-2xl font-bold mb-6 cyber-text">Perfil Consolidado</h3>
      
      <Card className="result-card cyber-border">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            {consolidatedProfile.avatar ? (
              <img 
                src={consolidatedProfile.avatar} 
                alt={consolidatedProfile.name || 'Avatar'} 
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div>
              <CardTitle className="text-2xl font-bold">
                {consolidatedProfile.name}
              </CardTitle>
              <div className="flex flex-wrap gap-1 mt-2">
                {consolidatedProfile.platforms.map((platform, index) => (
                  <Badge key={index} variant="secondary" className="mr-1 mb-1">
                    {platform.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consolidatedProfile.locations.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>Localização</span>
                </div>
                <ul className="space-y-1">
                  {consolidatedProfile.locations.map((location, index) => (
                    <li key={index} className="text-sm">{location}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {consolidatedProfile.emails.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>Email</span>
                </div>
                <ul className="space-y-1">
                  {consolidatedProfile.emails.map((email, index) => (
                    <li key={index} className="text-sm">{email}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {consolidatedProfile.phones.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>Telefone</span>
                </div>
                <ul className="space-y-1">
                  {consolidatedProfile.phones.map((phone, index) => (
                    <li key={index} className="text-sm">{phone}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ExternalLink className="w-4 h-4 text-primary" />
              <span>Perfis Encontrados</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {consolidatedProfile.platforms.map((platform, index) => {
                const IconComponent = getIconComponent(platform.icon);
                return (
                  <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <IconComponent className="platform-icon w-4 h-4" />
                      <span className="text-sm">{platform.username || platform.name}</span>
                    </div>
                    {platform.url && (
                      <a 
                        href={platform.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-muted/30 rounded-md flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 flex-shrink-0" />
            <p>
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
