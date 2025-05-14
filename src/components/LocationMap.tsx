
import React, { useState } from 'react';
import { Map, MapPin, Navigation, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { ProfileInfo } from '@/services/searchService';

interface LocationMapProps {
  profiles: ProfileInfo[];
}

interface Location {
  address: string;
  coordinates: string;
  lastSeen: string;
  frequentPlaces: string[];
  notes: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ profiles }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const handleLoadLocations = () => {
    setIsLoading(true);
    
    // Simulação de carregamento - em uma aplicação real, isto seria uma chamada para uma API
    setTimeout(() => {
      // Gerar dados de localização simulados baseados nos perfis
      const generatedLocations = profiles.slice(0, 3).map((profile, index) => {
        const mockLocations: Location[] = [
          {
            address: "Av. Paulista, 1578 - Bela Vista, São Paulo - SP, 01310-200",
            coordinates: "-23.561744, -46.655851",
            lastSeen: "Hoje, 14:30",
            frequentPlaces: ["Shopping Paulista", "Academia SmartFit", "Restaurante Pobre Juan"],
            notes: ""
          },
          {
            address: "R. Oscar Freire, 724 - Jardim Paulista, São Paulo - SP, 01426-001",
            coordinates: "-23.562328, -46.669868",
            lastSeen: "Ontem, 19:15",
            frequentPlaces: ["Restaurante Outback", "Parque Ibirapuera", "Shopping Pátio Higienópolis"],
            notes: ""
          },
          {
            address: "R. Augusta, 1356 - Consolação, São Paulo - SP, 01304-001",
            coordinates: "-23.553632, -46.654890",
            lastSeen: "12/05/2025, 21:40",
            frequentPlaces: ["Bar Veloso", "Teatro Municipal", "Galeria do Rock"],
            notes: ""
          }
        ];
        
        return mockLocations[index % mockLocations.length];
      });

      setLocations(generatedLocations);
      setIsLoading(false);
    }, 2000);
  };

  if (profiles.length === 0) {
    return null;
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 border-2 border-border shadow-lg">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Localização do Alvo
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {locations.length === 0 ? (
          <div className="text-center py-8">
            <Map className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Dados de Localização Não Carregados</h3>
            <p className="text-muted-foreground mb-6">
              Carregue os dados de localização para visualizar informações geográficas relacionadas ao alvo pesquisado.
            </p>
            <Button 
              onClick={handleLoadLocations}
              disabled={isLoading}
              className="mx-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Carregando dados...
                </>
              ) : (
                <>
                  <Navigation className="mr-2 h-4 w-4" />
                  Carregar Dados de Localização
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-lg">
                    {profiles[0].name || "Nome não disponível"}
                  </h3>
                  <p className="text-muted-foreground">
                    {locations[0].address}
                  </p>
                </div>
                <Badge variant="outline" className="bg-primary/10">
                  {locations[0].lastSeen}
                </Badge>
              </div>

              <div className="mt-4 aspect-video bg-muted rounded-md border border-border flex items-center justify-center">
                <div className="text-center p-4">
                  <Map className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Coordenadas: {locations[0].coordinates}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Visualização do mapa disponível apenas para usuários premium
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-medium mb-2">Locais frequentes:</h4>
                <div className="flex flex-wrap gap-2">
                  {locations[0].frequentPlaces.map((place, index) => (
                    <Badge key={index} variant="secondary">
                      {place}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h4 className="font-medium mb-2">Notas:</h4>
                <Textarea
                  placeholder="Adicione notas sobre esta localização..."
                  className="min-h-[100px]"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" variant="outline">
                    Salvar Notas
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-100/50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <div>
                  <h4 className="font-medium">Aviso Legal</h4>
                  <p className="text-sm">
                    Os dados de localização são aproximados e baseados em informações 
                    públicas disponíveis. O uso destas informações deve respeitar a 
                    legislação vigente sobre privacidade e proteção de dados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationMap;
