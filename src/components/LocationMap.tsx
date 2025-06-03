
import React, { useState, useEffect, useRef } from 'react';
import { Map, MapPin, Navigation, Loader2, AlertCircle, ExternalLink, Search } from 'lucide-react';
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
  latitude: number;
  longitude: number;
  googleMapsLink: string;
  notes: string;
  accuracy: string;
  source: string;
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

  const geocodeWithNominatim = async (address: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          accuracy: 'Alta (OpenStreetMap)',
          source: 'Nominatim/OpenStreetMap'
        };
      }
      return null;
    } catch (error) {
      console.error('Erro no Nominatim:', error);
      return null;
    }
  };

  const geocodeWithPhoton = async (address: string) => {
    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.features && data.features.length > 0) {
        const result = data.features[0];
        return {
          latitude: result.geometry.coordinates[1],
          longitude: result.geometry.coordinates[0],
          accuracy: 'Alta (Photon)',
          source: 'Photon/Komoot'
        };
      }
      return null;
    } catch (error) {
      console.error('Erro no Photon:', error);
      return null;
    }
  };

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
      const cleanAddress = addressInput.trim();
      let geocodeResult = null;

      // Tentar primeiro com Nominatim
      geocodeResult = await geocodeWithNominatim(cleanAddress);
      
      // Se falhar, tentar com Photon
      if (!geocodeResult) {
        geocodeResult = await geocodeWithPhoton(cleanAddress);
      }

      if (geocodeResult) {
        const { latitude, longitude, accuracy, source } = geocodeResult;
        const coordinates = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
        
        const newLocationData: LocationData = {
          address: cleanAddress,
          coordinates,
          latitude,
          longitude,
          googleMapsLink,
          notes: "",
          accuracy,
          source
        };
        
        setLocationData(newLocationData);
        
        // Renderizar mapa real
        if (mapRef.current) {
          initializeRealMap(latitude, longitude, cleanAddress);
        }
        
        toast({
          title: "Localização encontrada",
          description: `Coordenadas obtidas via ${source}`
        });
      } else {
        throw new Error('Não foi possível geocodificar o endereço');
      }
      
    } catch (error) {
      console.error('Erro na geocodificação:', error);
      setLocationData(null);
      toast({
        title: "Erro na localização",
        description: "Não foi possível encontrar as coordenadas. Verifique se o endereço está correto.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeRealMap = (lat: number, lng: number, address: string) => {
    if (!mapRef.current) return;
    
    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';
    
    // Criar iframe do OpenStreetMap
    const mapFrame = document.createElement('iframe');
    mapFrame.style.width = '100%';
    mapFrame.style.height = '100%';
    mapFrame.style.border = 'none';
    mapFrame.style.borderRadius = '8px';
    
    // URL do OpenStreetMap com marcador
    const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
    mapFrame.src = osmUrl;
    
    // Overlay com informações
    const overlay = document.createElement('div');
    overlay.className = 'absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-md shadow-md text-xs border';
    overlay.innerHTML = `
      <div class="font-medium">${address}</div>
      <div class="text-gray-600">${lat.toFixed(6)}, ${lng.toFixed(6)}</div>
    `;
    
    const container = document.createElement('div');
    container.className = 'relative w-full h-full';
    container.appendChild(mapFrame);
    container.appendChild(overlay);
    
    mapContainer.appendChild(container);
  };

  const handleOpenGoogleMaps = () => {
    if (locationData?.googleMapsLink) {
      window.open(locationData.googleMapsLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenStreetMap = () => {
    if (locationData) {
      const osmUrl = `https://www.openstreetmap.org/?mlat=${locationData.latitude}&mlon=${locationData.longitude}#map=16/${locationData.latitude}/${locationData.longitude}`;
      window.open(osmUrl, '_blank', 'noopener,noreferrer');
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

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;
        
        try {
          // Fazer geocodificação reversa
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          
          const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setAddressInput(address);
          
          const newLocationData: LocationData = {
            address,
            coordinates: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            latitude: lat,
            longitude: lng,
            googleMapsLink: `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`,
            notes: "",
            accuracy: `${Math.round(accuracy)}m (GPS)`,
            source: 'GPS do dispositivo'
          };
          
          setLocationData(newLocationData);
          
          if (mapRef.current) {
            initializeRealMap(lat, lng, address);
          }
          
          toast({
            title: "Localização atual obtida",
            description: `Precisão: ${Math.round(accuracy)}m`
          });
          
        } catch (error) {
          console.error('Erro na geocodificação reversa:', error);
        }
        
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        toast({
          title: "Erro de geolocalização",
          description: "Não foi possível obter sua localização atual.",
          variant: "destructive"
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 border-2 border-border shadow-lg">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Geolocalização e Mapeamento
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <Input
                className="h-12 pl-10 pr-4 text-lg bg-muted/70"
                placeholder="Digite o endereço completo ou coordenadas..."
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGeocodeAddress()}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
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
                  Buscar
                </>
              )}
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            className="h-10 px-4"
            onClick={handleCurrentLocation}
            disabled={isLoading}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Usar Minha Localização Atual
          </Button>
        </div>

        {locationData && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg border">
              <h3 className="font-medium mb-2">Localização Encontrada:</h3>
              <p className="text-sm mb-3">{locationData.address}</p>
              
              <div className="aspect-video bg-muted rounded-md border border-border mb-4">
                <div ref={mapRef} className="w-full h-full min-h-[300px]">
                  {/* Mapa será renderizado aqui */}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Coordenadas:</strong> {locationData.coordinates}</p>
                  <p><strong>Precisão:</strong> {locationData.accuracy}</p>
                </div>
                <div>
                  <p><strong>Fonte:</strong> {locationData.source}</p>
                  <p><strong>Latitude:</strong> {locationData.latitude.toFixed(6)}</p>
                  <p><strong>Longitude:</strong> {locationData.longitude.toFixed(6)}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={handleOpenGoogleMaps}
                >
                  <ExternalLink className="h-3 w-3" />
                  Google Maps
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={handleOpenStreetMap}
                >
                  <ExternalLink className="h-3 w-3" />
                  OpenStreetMap
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Notas de Investigação:</h4>
              <Textarea
                placeholder="Adicione observações sobre esta localização, contexto da investigação, horários relevantes, etc..."
                className="min-h-[100px]"
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
            <h3 className="text-lg font-medium mb-2">Geolocalização Precisa</h3>
            <p className="text-muted-foreground">
              Digite um endereço ou use sua localização atual para obter coordenadas GPS precisas
            </p>
          </div>
        )}

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>OSINT Geolocalização:</strong> Este sistema usa APIs públicas para geocodificação precisa. 
                As coordenadas são obtidas de fontes confiáveis como OpenStreetMap e podem ser usadas para 
                investigação digital profissional.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationMap;
