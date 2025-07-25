
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Secure API integration
import { secureApiClient } from '@/services/api/secureApiClient';

interface GoogleMapComponentProps {
  profiles: any[];
}

interface LocationData {
  lat: number;
  lng: number;
  address: string;
  formatted_address?: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px'
};

const defaultCenter = {
  lat: -23.5505,
  lng: -46.6333 // São Paulo como padrão
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ profiles }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [addressInput, setAddressInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [map, setMap] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Preencher com endereço do perfil se disponível
    if (profiles.length > 0 && profiles[0].location) {
      setAddressInput(profiles[0].location);
    }
  }, [profiles]);

  const onLoad = useCallback((mapInstance: any) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Geocodificação usando OpenCage (alternativa gratuita ao Google)
  const geocodeAddress = async (address: string) => {
    try {
      const data = await secureApiClient.opencageRequest(
        'https://api.opencagedata.com/geocode/v1/json',
        { q: encodeURIComponent(address), limit: 1 }
      );
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          lat: result.geometry.lat,
          lng: result.geometry.lng,
          address: address,
          formatted_address: result.formatted
        };
      }
      throw new Error('Endereço não encontrado');
    } catch (error) {
      console.error('Erro na geocodificação:', error);
      throw error;
    }
  };

  const handleGeocodeAddress = async () => {
    if (!addressInput.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite um endereço para localizar",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const locationData = await geocodeAddress(addressInput);
      setLocation(locationData);
      
      if (map) {
        map.panTo({ lat: locationData.lat, lng: locationData.lng });
        map.setZoom(15);
      }
      
      toast({
        title: "Localização encontrada",
        description: `${locationData.formatted_address || locationData.address}`
      });
    } catch (error) {
      toast({
        title: "Erro na localização",
        description: "Não foi possível encontrar o endereço",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Geocodificação reversa
          const data = await secureApiClient.opencageRequest(
            'https://api.opencagedata.com/geocode/v1/json',
            { q: `${latitude}+${longitude}`, limit: 1 }
          );
          
          const address = data.results?.[0]?.formatted || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          
          const locationData = {
            lat: latitude,
            lng: longitude,
            address: address,
            formatted_address: address
          };
          
          setLocation(locationData);
          setAddressInput(address);
          
          if (map) {
            map.panTo({ lat: latitude, lng: longitude });
            map.setZoom(15);
          }
          
          toast({
            title: "Localização atual obtida",
            description: `Precisão: ${Math.round(position.coords.accuracy)}m`
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
          description: error.message,
          variant: "destructive"
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const openInGoogleMaps = () => {
    if (location) {
      const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 border-2 border-border shadow-lg">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Mapa e Geolocalização - Google Maps
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <Input
              className="h-12 text-lg"
              placeholder="Digite o endereço completo..."
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGeocodeAddress()}
            />
          </div>
          <Button 
            className="h-12 px-6"
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
          <Button 
            variant="outline" 
            className="h-12 px-4"
            onClick={handleMyLocation}
            disabled={isLoading}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Minha Localização
          </Button>
        </div>

        <LoadScript googleMapsApiKey="SECURE_KEY_PLACEHOLDER">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={location ? { lat: location.lat, lng: location.lng } : defaultCenter}
            zoom={location ? 15 : 10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {location && (
              <Marker 
                position={{ lat: location.lat, lng: location.lng }}
                title={location.address}
              />
            )}
          </GoogleMap>
        </LoadScript>

        {location && (
          <div className="p-4 bg-muted/30 rounded-lg border space-y-3">
            <div>
              <h3 className="font-medium mb-2">Localização Encontrada:</h3>
              <p className="text-sm mb-2">{location.formatted_address || location.address}</p>
              <p className="text-xs text-muted-foreground">
                Coordenadas: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={openInGoogleMaps}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-3 w-3" />
              Abrir no Google Maps
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleMapComponent;
