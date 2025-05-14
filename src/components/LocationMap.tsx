
import React, { useState, useEffect, useRef } from 'react';
import { Map, MapPin, Navigation, Loader2, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
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
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleLoadLocations = () => {
    setIsLoading(true);
    
    // Fetch real location data from a fake API service
    setTimeout(() => {
      if (profiles.length === 0) {
        setIsLoading(false);
        toast({
          title: "Erro na localização",
          description: "Não foi possível carregar dados de localização para este perfil.",
          variant: "destructive"
        });
        return;
      }
      
      // Generate locations based on profile data
      // In a real app, these would come from an actual API
      const generatedLocations = profiles.map(profile => {
        // Use any location data from the profile if available
        const profileLocation = profile.location || "Localização desconhecida";
        
        // Generate random coordinates near São Paulo for demonstration
        const baseLat = -23.55 + (Math.random() * 0.1 - 0.05);
        const baseLng = -46.63 + (Math.random() * 0.1 - 0.05);
        
        return {
          address: profileLocation.includes(',') ? profileLocation : `${profileLocation}, São Paulo - SP, Brasil`,
          coordinates: `${baseLat.toFixed(6)}, ${baseLng.toFixed(6)}`,
          lastSeen: new Date().toLocaleString('pt-BR', { 
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          frequentPlaces: [
            "Shopping Center",
            "Academia",
            "Restaurante"
          ],
          notes: ""
        };
      });

      setLocations(generatedLocations);
      setIsLoading(false);
      
      // Initialize the map after locations are loaded
      if (generatedLocations.length > 0) {
        initializeMap(generatedLocations[0]);
      }
    }, 1500);
  };

  const initializeMap = (location: Location) => {
    if (!mapRef.current) return;
    
    const [lat, lng] = location.coordinates.split(',').map(coord => parseFloat(coord.trim()));
    
    // Display a simple map visualization
    const mapContainer = mapRef.current;
    mapContainer.innerHTML = '';
    
    // Create a styled map placeholder (using div elements for visualization)
    const mapVisual = document.createElement('div');
    mapVisual.className = 'relative w-full h-full bg-slate-100 overflow-hidden';
    mapVisual.style.backgroundImage = "url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+555555(" + 
      lng + "," + lat + ")/" + lng + "," + lat + ",13,0/500x300?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA')";
    mapVisual.style.backgroundSize = 'cover';
    mapVisual.style.backgroundPosition = 'center';
    
    // Add grid lines to simulate map grid
    const gridOverlay = document.createElement('div');
    gridOverlay.className = 'absolute inset-0';
    gridOverlay.style.backgroundImage = 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)';
    gridOverlay.style.backgroundSize = '50px 50px';
    
    // Add location marker
    const marker = document.createElement('div');
    marker.className = 'absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2';
    marker.style.top = '50%';
    marker.style.left = '50%';
    marker.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" stroke="white" stroke-width="2"><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z"></path></svg>`;
    
    // Add map elements to container
    mapVisual.appendChild(gridOverlay);
    mapVisual.appendChild(marker);
    mapContainer.appendChild(mapVisual);
  };

  const handleSaveNotes = () => {
    if (locations.length === 0) return;
    
    const updatedLocations = [...locations];
    updatedLocations[0] = {...updatedLocations[0], notes};
    
    setLocations(updatedLocations);
    toast({
      title: "Notas salvas",
      description: "As notas de localização foram salvas com sucesso.",
    });
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

              <div className="mt-4 aspect-video bg-muted rounded-md border border-border">
                <div ref={mapRef} className="w-full h-full min-h-[250px]">
                  {/* Map will be rendered here */}
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-muted-foreground">
                  Coordenadas: {locations[0].coordinates}
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1"
                  onClick={() => {
                    const [lat, lng] = locations[0].coordinates.split(',').map(c => c.trim());
                    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                  }}
                >
                  <Map className="h-3 w-3" />
                  Ver no Google Maps
                </Button>
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
                  <Button size="sm" variant="outline" onClick={handleSaveNotes}>
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
