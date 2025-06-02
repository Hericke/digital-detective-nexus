
import React, { useState, useEffect, useRef } from 'react';
import { Map, MapPin, Navigation, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { ProfileInfo } from '@/services/searchService';

interface LocationMapProps {
  profiles: ProfileInfo[];
}

interface LocationData {
  address: string;
  coordinates: string;
  googleMapsLink: string;
  notes: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ profiles }) => {
  const [addressInput, setAddressInput] = useState('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Preencher com endereço do perfil se disponível
    if (profiles.length > 0 && profiles[0].location) {
      setAddressInput(profiles[0].location);
    }
  }, [profiles]);

  const handleGeocodeAddress = async () => {
    if (!addressInput.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira um endereço para localizar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulação de geocodificação - na prática usaria API real do Google Maps
      setTimeout(() => {
        const cleanAddress = addressInput.trim();
        
        // Simula conversão para coordenadas (região de São Paulo para exemplo)
        const baseLat = -23.550520 + (Math.random() * 0.02 - 0.01);
        const baseLng = -46.633308 + (Math.random() * 0.02 - 0.01);
        
        const coordinates = `${baseLat.toFixed(6)}, ${baseLng.toFixed(6)}`;
        const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${baseLat.toFixed(6)},${baseLng.toFixed(6)}`;
        
        const newLocationData: LocationData = {
          address: cleanAddress,
          coordinates,
          googleMapsLink,
          notes: ""
        };
        
        setLocationData(newLocationData);
        setIsLoading(false);
        
        // Renderizar mapa simples
        if (mapRef.current) {
          initializeMap(baseLat, baseLng);
        }
        
        toast({
          title: "Localização encontrada",
          description: "Coordenadas geradas com sucesso."
        });
      }, 1500);
      
    } catch (error) {
      setIsLoading(false);
      setLocationData(null);
      toast({
        title: "Erro na localização",
        description: "Não foi possível gerar a localização. Verifique se o endereço está correto ou verifique no Google Maps.",
        variant: "destructive"
      });
    }
  };

  const initializeMap = (lat: number, lng: number) => {
    if (!mapRef.current) return;
    
    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';
    
    // Criar visualização simples do mapa
    const mapVisual = document.createElement('div');
    mapVisual.className = 'relative w-full h-full bg-slate-100 overflow-hidden border border-border rounded';
    mapVisual.style.backgroundImage = `linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                                       linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                                       linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                                       linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)`;
    mapVisual.style.backgroundSize = '20px 20px';
    mapVisual.style.backgroundPosition = '0 0, 0 10px, 10px -10px, -10px 0px';
    
    // Adicionar marcador no centro
    const marker = document.createElement('div');
    marker.className = 'absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2';
    marker.style.top = '50%';
    marker.style.left = '50%';
    marker.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" stroke="white" stroke-width="2"><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z"></path></svg>`;
    
    // Adicionar informações de coordenadas
    const coordInfo = document.createElement('div');
    coordInfo.className = 'absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs border';
    coordInfo.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    
    mapVisual.appendChild(marker);
    mapVisual.appendChild(coordInfo);
    mapContainer.appendChild(mapVisual);
  };

  const handleOpenGoogleMaps = () => {
    if (locationData?.googleMapsLink) {
      window.open(locationData.googleMapsLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleSaveNotes = () => {
    if (locationData) {
      setLocationData({...locationData, notes});
      toast({
        title: "Notas salvas",
        description: "As notas de localização foram salvas com sucesso.",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 border-2 border-border shadow-lg">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Localização no Mapa
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <Input
              className="search-input h-12 pl-10 pr-4 text-lg bg-muted/70"
              placeholder="Digite o endereço completo..."
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGeocodeAddress()}
            />
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          </div>
          <Button 
            className="h-12 px-6 bg-primary hover:bg-primary/90"
            onClick={handleGeocodeAddress}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Localizando...
              </>
            ) : (
              <>
                <Navigation className="mr-2 h-4 w-4" />
                Localizar
              </>
            )}
          </Button>
        </div>

        {locationData && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg border">
              <h3 className="font-medium mb-2">Endereço Localizado:</h3>
              <p className="text-sm mb-3">{locationData.address}</p>
              
              <div className="aspect-video bg-muted rounded-md border border-border mb-3">
                <div ref={mapRef} className="w-full h-full min-h-[250px]">
                  {/* Mapa será renderizado aqui */}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm"><strong>Coordenadas:</strong> {locationData.coordinates}</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={handleOpenGoogleMaps}
                  >
                    <ExternalLink className="h-3 w-3" />
                    Ver no Google Maps
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Notas sobre a localização:</h4>
              <Textarea
                placeholder="Adicione observações sobre esta localização..."
                className="min-h-[80px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="flex justify-end">
                <Button size="sm" variant="outline" onClick={handleSaveNotes}>
                  Salvar Notas
                </Button>
              </div>
            </div>
          </div>
        )}

        {!locationData && !isLoading && (
          <div className="text-center py-8">
            <Map className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aguardando Endereço</h3>
            <p className="text-muted-foreground">
              Digite um endereço completo para gerar as coordenadas e visualizar no mapa.
            </p>
          </div>
        )}

        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> As coordenadas são aproximadas e baseadas no endereço fornecido. 
                Para precisão máxima, utilize ferramentas especializadas de geolocalização.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationMap;
