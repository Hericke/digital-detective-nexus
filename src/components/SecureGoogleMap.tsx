import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { secureApiClient } from '@/services/api/secureApiClient';

// Component com integração segura do Google Maps
const SecureGoogleMap = () => {
  const [address, setAddress] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: -14.235, lng: -51.9253 }); // Centro do Brasil
  const [zoom, setZoom] = useState(4);
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState<string>('');

  const { toast } = useToast();

  // Load Google Maps API key securely
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        // In a real implementation, this would get the API key from the secure endpoint
        // For now, we'll use a placeholder that gets replaced by the edge function
        setGoogleMapsApiKey('SECURE_GOOGLE_MAPS_KEY');
      } catch (error) {
        console.error('Failed to load Google Maps API key:', error);
        toast({
          title: 'Erro de configuração',
          description: 'Não foi possível carregar as configurações do mapa.',
          variant: 'destructive',
        });
      }
    };

    loadApiKey();
  }, [toast]);

  const geocodeAddress = useCallback(async (address: string) => {
    if (!address.trim()) return;

    setIsLoading(true);
    try {
      const data = await secureApiClient.opencageRequest(
        'https://api.opencagedata.com/geocode/v1/json',
        { q: encodeURIComponent(address), limit: 1 }
      );

      if (!data.results || data.results.length === 0) {
        toast({
          title: 'Endereço não encontrado',
          description: 'Não foi possível localizar o endereço fornecido.',
          variant: 'destructive',
        });
        return;
      }

      const result = data.results[0];
      const { lat, lng } = result.geometry;
      
      setCoordinates({ lat, lng });
      setMapCenter({ lat, lng });
      setZoom(15);
      setSelectedMarker({
        lat,
        lng,
        address: result.formatted
      });

      toast({
        title: 'Localização encontrada',
        description: `Endereço: ${result.formatted}`,
      });
    } catch (error) {
      console.error('Erro na geocodificação:', error);
      toast({
        title: 'Erro na busca',
        description: 'Não foi possível buscar o endereço. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast({
        title: 'Geolocalização não suportada',
        description: 'Seu navegador não suporta geolocalização.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          setMapCenter({ lat: latitude, lng: longitude });
          setZoom(15);

          // Reverse geocoding para obter o endereço
          const data = await secureApiClient.opencageRequest(
            'https://api.opencagedata.com/geocode/v1/json',
            { q: `${latitude}+${longitude}`, limit: 1 }
          );

          if (data.results && data.results.length > 0) {
            const address = data.results[0].formatted;
            setCurrentAddress(address);
            setSelectedMarker({
              lat: latitude,
              lng: longitude,
              address: address
            });
          }

          toast({
            title: 'Localização atual obtida',
            description: 'Sua localização foi encontrada com sucesso.',
          });
        } catch (error) {
          console.error('Erro no reverse geocoding:', error);
          setSelectedMarker({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: 'Localização atual'
          });
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Erro na geolocalização:', error);
        setIsLoading(false);
        toast({
          title: 'Erro na geolocalização',
          description: 'Não foi possível obter sua localização.',
          variant: 'destructive',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, [toast]);

  const copyCoordinates = useCallback((lat: number, lng: number) => {
    const coordText = `${lat}, ${lng}`;
    navigator.clipboard.writeText(coordText);
    toast({
      title: 'Coordenadas copiadas',
      description: `${coordText} foi copiado para a área de transferência.`,
    });
  }, [toast]);

  const openInGoogleMaps = useCallback((lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, '_blank');
  }, []);

  if (!googleMapsApiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando mapa...</CardTitle>
          <CardDescription>Configurando integração segura com Google Maps</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localização Geográfica Segura
          </CardTitle>
          <CardDescription>
            Busque endereços e obtenha coordenadas geográficas de forma segura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="address">Endereço para buscar</Label>
              <Input
                id="address"
                placeholder="Digite o endereço ou local"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && geocodeAddress(address)}
              />
            </div>
            <div className="flex flex-col justify-end gap-2">
              <Button 
                onClick={() => geocodeAddress(address)}
                disabled={isLoading || !address.trim()}
              >
                Buscar
              </Button>
            </div>
          </div>

          <Button 
            onClick={getCurrentLocation}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            <Navigation className="mr-2 h-4 w-4" />
            Obter Minha Localização
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="h-[400px] w-full">
            <LoadScript googleMapsApiKey={googleMapsApiKey}>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={zoom}
                options={{
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: true,
                  fullscreenControl: true,
                }}
              >
                {coordinates && (
                  <Marker
                    position={coordinates}
                    onClick={() => setSelectedMarker({ 
                      lat: coordinates.lat, 
                      lng: coordinates.lng, 
                      address: address || 'Localização pesquisada' 
                    })}
                  />
                )}

                {currentLocation && (
                  <Marker
                    position={currentLocation}
                    icon={{
                      url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMzMzc0RkYiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
                      scaledSize: new window.google.maps.Size(20, 20),
                    }}
                    onClick={() => setSelectedMarker({ 
                      lat: currentLocation.lat, 
                      lng: currentLocation.lng, 
                      address: currentAddress || 'Sua localização atual' 
                    })}
                  />
                )}

                {selectedMarker && (
                  <InfoWindow
                    position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="p-2">
                      <h3 className="font-semibold mb-2">Informações da Localização</h3>
                      <p className="text-sm mb-2">{selectedMarker.address}</p>
                      <p className="text-xs text-gray-600 mb-3">
                        Lat: {selectedMarker.lat.toFixed(6)}<br />
                        Lng: {selectedMarker.lng.toFixed(6)}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyCoordinates(selectedMarker.lat, selectedMarker.lng)}
                        >
                          <Copy className="mr-1 h-3 w-3" />
                          Copiar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openInGoogleMaps(selectedMarker.lat, selectedMarker.lng)}
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Abrir
                        </Button>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecureGoogleMap;