import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const GOOGLE_MAPS_API_KEY = "AIzaSyC_v74qHgKG_8YjKxC2ABhTWUKSkGlY-H8";
const OPENCAGE_API_KEY = "8dd7e7fa334e4d5598ac7beb54360de2";

interface MapWithFallbackProps {
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
  lng: -46.6333
};

const MapWithFallback: React.FC<MapWithFallbackProps> = ({ profiles }) => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [addressInput, setAddressInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [useOpenStreetMap, setUseOpenStreetMap] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (profiles.length > 0 && profiles[0].location) {
      setAddressInput(profiles[0].location);
    }
  }, [profiles]);

  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${OPENCAGE_API_KEY}&limit=1`
      );
      const data = await response.json();
      
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
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}&limit=1`
          );
          const data = await response.json();
          
          const address = data.results?.[0]?.formatted || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          
          const locationData = {
            lat: latitude,
            lng: longitude,
            address: address,
            formatted_address: address
          };
          
          setLocation(locationData);
          setAddressInput(address);
          
          toast({
            title: "Localização atual obtida",
            description: `Precisão: ${Math.round(position.coords.accuracy)}m`
          });
        } catch (error) {
          // Falha silenciosa na geocodificação reversa
        }
        
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        toast({
          title: "Erro de geolocalização",
          description: "Não foi possível obter sua localização",
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

  const openInOpenStreetMap = () => {
    if (location) {
      const url = `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}&zoom=15`;
      window.open(url, '_blank');
    }
  };

  const handleMapError = useCallback(() => {
    setMapError("Erro ao carregar Google Maps. Usando mapa alternativo.");
    setUseOpenStreetMap(true);
  }, []);

  const renderMap = () => {
    if (useOpenStreetMap || mapError) {
      const mapUrl = location 
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.01},${location.lat-0.01},${location.lng+0.01},${location.lat+0.01}&layer=mapnik&marker=${location.lat},${location.lng}`
        : `https://www.openstreetmap.org/export/embed.html?bbox=-46.65,-23.56,-46.61,-23.54&layer=mapnik`;
      
      return (
        <div className="w-full h-96 border rounded-lg overflow-hidden">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            title="OpenStreetMap"
          />
        </div>
      );
    }

    return (
      <LoadScript 
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        onError={handleMapError}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={location ? { lat: location.lat, lng: location.lng } : defaultCenter}
          zoom={location ? 15 : 10}
        >
          {location && (
            <Marker 
              position={{ lat: location.lat, lng: location.lng }}
              title={location.address}
            />
          )}
        </GoogleMap>
      </LoadScript>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 border-2 border-border shadow-lg">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Mapa e Geolocalização
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {mapError && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {mapError}
            </AlertDescription>
          </Alert>
        )}

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

        {renderMap()}

        {location && (
          <div className="p-4 bg-muted/30 rounded-lg border space-y-3">
            <div>
              <h3 className="font-medium mb-2">Localização Encontrada:</h3>
              <p className="text-sm mb-2">{location.formatted_address || location.address}</p>
              <p className="text-xs text-muted-foreground">
                Coordenadas: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={openInGoogleMaps}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                Google Maps
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={openInOpenStreetMap}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                OpenStreetMap
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapWithFallback;