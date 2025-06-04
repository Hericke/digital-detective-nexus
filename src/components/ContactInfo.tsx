
import React from 'react';
import { Phone, Mail, MapPin, Copy, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { ProfileInfo } from '@/services/searchService';

interface ContactInfoProps {
  profiles: ProfileInfo[];
}

const ContactInfo: React.FC<ContactInfoProps> = ({ profiles }) => {
  const { toast } = useToast();

  console.log('ContactInfo: Profiles recebidos:', profiles);

  // Extrair todas as informações de contato únicas
  const emails = [...new Set(profiles.filter(p => p.email).map(p => p.email))];
  const phones = [...new Set(profiles.filter(p => p.phone).map(p => p.phone))];
  const locations = [...new Set(profiles.filter(p => p.location).map(p => p.location))];

  console.log('ContactInfo: Informações extraídas:', { emails, phones, locations });

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado!",
        description: `${type} copiado para a área de transferência`,
      });
    }).catch(() => {
      toast({
        title: "Erro",
        description: "Não foi possível copiar",
        variant: "destructive"
      });
    });
  };

  const openEmailClient = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const searchPhoneOnWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[\s+()-]/g, '');
    window.open(`https://api.whatsapp.com/send?phone=55${cleanPhone}`, '_blank');
  };

  const searchLocationOnMaps = (location: string) => {
    window.open(`https://www.google.com/maps/search/${encodeURIComponent(location)}`, '_blank');
  };

  // Sempre mostrar o card, mesmo sem informações específicas
  return (
    <Card className="w-full max-w-4xl mx-auto mt-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="bg-primary/10">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Phone className="h-5 w-5" />
          Informações de Contato
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {emails.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-medium">
              <Mail className="h-5 w-5 text-primary" />
              <span>Emails Encontrados</span>
            </div>
            <div className="grid gap-2">
              {emails.map((email, index) => (
                <div key={index} className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{email}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(email!, 'Email')}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEmailClient(email!)}
                      className="h-8 w-8 p-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {phones.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-medium">
              <Phone className="h-5 w-5 text-primary" />
              <span>Telefones Encontrados</span>
            </div>
            <div className="grid gap-2">
              {phones.map((phone, index) => (
                <div key={index} className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">{phone}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(phone!, 'Telefone')}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => searchPhoneOnWhatsApp(phone!)}
                      className="h-8 w-8 p-0"
                      title="Buscar no WhatsApp"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {locations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-medium">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Endereços Encontrados</span>
            </div>
            <div className="grid gap-2">
              {locations.map((location, index) => (
                <div key={index} className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{location}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(location!, 'Endereço')}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => searchLocationOnMaps(location!)}
                      className="h-8 w-8 p-0"
                      title="Ver no Google Maps"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {emails.length === 0 && phones.length === 0 && locations.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-muted/30 rounded-lg p-6 border border-muted">
              <Phone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma informação de contato encontrada</h3>
              <p className="text-muted-foreground text-sm">
                As informações de contato podem não estar disponíveis publicamente ou podem estar em perfis privados.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start gap-2 text-sm text-yellow-800 dark:text-yellow-200">
            <Mail className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Importante:</strong> Estas informações foram coletadas de fontes públicas. 
              Verifique sempre a veracidade antes de usar. Use de forma ética e responsável.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
