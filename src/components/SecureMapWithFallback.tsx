import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { secureApiClient } from '@/services/api/secureApiClient';

interface SecureMapWithFallbackProps {
  profiles: any[];
}

interface LocationData {
  lat: number;
  lng: number;
  address: string;
  confidence?: number;
  source: 'google' | 'opencage';
}

const SecureMapWithFallback: React.FC<SecureMapWithFallbackProps> = ({ profiles }) => {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useOpenCage, setUseOpenCage] = useState(false);
  const { toast } = useToast();

  const mapStyles = [
    {
      featureType: 'all',
      elementType: 'geometry.fill',
      stylers: [{ weight: '2.00' }]
    },
    {
      featureType: 'all',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#9c9c9c' }]
    },
    {
      featureType: 'all',
      elementType: 'labels.text',
      stylers: [{ visibility: 'on' }]
    }
  ];

  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  const center = {
    lat: -14.235004,
    lng: -51.92528
  };

  // Geocoding functions
  const geocodeWithGoogle = async (address: string): Promise<LocationData | null> => {
    try {
      const data = await secureApiClient.googleRequest(
        'https://maps.googleapis.com/maps/api/geocode/json',
        { address }
      );

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng,
          address: result.formatted_address,
          source: 'google'
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const geocodeWithOpenCage = async (address: string): Promise<LocationData | null> => {
    try {
      const data = await secureApiClient.opencageRequest(
        'https://api.opencagedata.com/geocode/v1/json',
        { q: address, limit: 1 }
      );

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          lat: result.geometry.lat,
          lng: result.geometry.lng,
          address: result.formatted,
          confidence: result.confidence,
          source: 'opencage'
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const geocodeAddress = async (address: string): Promise<LocationData | null> => {
    setLoading(true);
    try {
      // Try Google first, then OpenCage as fallback
      let location = await geocodeWithGoogle(address);
      
      if (!location) {
        location = await geocodeWithOpenCage(address);
        if (location) {
          setUseOpenCage(true);
        }
      }

      return location;
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    const location = await geocodeAddress(searchTerm);
    if (location) {
      setLocations([location]);
      toast({
        title: "Localização encontrada",
        description: `Endereço: ${location.address}`,
      });
    } else {
      toast({
        title: "Localização não encontrada",
        description: "Não foi possível encontrar a localização especificada",
        variant: "destructive",
      });
    }
  };

  const extractLocationsFromProfiles = useCallback(async () => {
    if (!profiles || profiles.length === 0) return;

    const locationPromises = profiles
      .flatMap(profile => [
        ...(profile.addresses || []),
        ...(profile.locations || []),
        profile.address,
        profile.location
      ])
      .filter(Boolean)
      .map(async (address) => {
        const location = await geocodeAddress(address);
        return location;
      });

    const results = await Promise.all(locationPromises);
    const validLocations = results.filter(Boolean) as LocationData[];
    setLocations(validLocations);
  }, [profiles]);

  useEffect(() => {
    extractLocationsFromProfiles();
  }, [extractLocationsFromProfiles]);

  const openInGoogleMaps = (location: LocationData) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
    window.open(url, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Mapa de Localizações
          {useOpenCage && (
            <span className="text-sm text-muted-foreground">(OpenCage)</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Section */}
        <div className="flex gap-2">
          <Input
            placeholder="Digite um endereço para buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Map Section */}
        {!useOpenCage ? (
          <LoadScript
            googleMapsApiKey=""
            onLoad={() => setMapLoaded(true)}
            onError={() => {
              setUseOpenCage(true);
              toast({
                title: "Google Maps indisponível",
                description: "Usando OpenCage como alternativa",
                variant: "destructive",
              });
            }}
          >
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={4}
              options={{
                styles: mapStyles,
                disableDefaultUI: false,
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
              }}
            >
              {locations.map((location, index) => (
                <Marker
                  key={index}
                  position={{ lat: location.lat, lng: location.lng }}
                  title={location.address}
                  onClick={() => openInGoogleMaps(location)}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        ) : (
          <div className="bg-muted/30 rounded-lg p-6 min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Mapa Indisponível</h3>
            <p className="text-muted-foreground text-center mb-4">
              O Google Maps não está disponível. As localizações foram processadas usando OpenCage.
            </p>
            
            {locations.length > 0 && (
              <div className="w-full space-y-2">
                <h4 className="font-medium">Localizações encontradas:</h4>
                {locations.map((location, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium">{location.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        {location.confidence && ` (Confiança: ${location.confidence}%)`}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openInGoogleMaps(location)}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Abrir
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results Summary */}
        {locations.length > 0 && !useOpenCage && (
          <Alert>
            <MapPin className="h-4 w-4" />
            <AlertDescription>
              {locations.length} localização(ões) encontrada(s) nos perfis analisados.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default SecureMapWithFallback;