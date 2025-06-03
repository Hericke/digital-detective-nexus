
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, FileImage, MapPin, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as exifr from 'exifr';

interface ImageMetadata {
  GPS?: {
    latitude?: number;
    longitude?: number;
  };
  Camera?: string;
  DateTime?: string;
  Make?: string;
  Model?: string;
  Software?: string;
  [key: string]: any;
}

const ImageAnalysis: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeImage = async (file: File) => {
    try {
      setIsAnalyzing(true);
      const exifData = await exifr.parse(file, {
        gps: true,
        tiff: true,
        exif: true,
        jfif: true,
        icc: true
      });
      
      if (exifData) {
        const processedMetadata: ImageMetadata = {
          Camera: exifData.Model || exifData.Make || 'Não identificada',
          DateTime: exifData.DateTime || exifData.DateTimeOriginal,
          Make: exifData.Make,
          Model: exifData.Model,
          Software: exifData.Software
        };

        // Processar dados GPS se disponíveis
        if (exifData.latitude && exifData.longitude) {
          processedMetadata.GPS = {
            latitude: exifData.latitude,
            longitude: exifData.longitude
          };
        }

        setMetadata(processedMetadata);
        
        toast({
          title: "Análise concluída",
          description: `Metadados extraídos${processedMetadata.GPS ? ' (incluindo localização GPS)' : ''}`
        });
      } else {
        throw new Error('Nenhum metadado encontrado');
      }
    } catch (error) {
      console.error('Erro na análise de metadados:', error);
      toast({
        title: "Erro na análise",
        description: "Não foi possível extrair metadados desta imagem",
        variant: "destructive"
      });
      setMetadata(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      analyzeImage(file);
    }
  };

  const openLocationInMap = () => {
    if (metadata?.GPS?.latitude && metadata?.GPS?.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${metadata.GPS.latitude},${metadata.GPS.longitude}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 border-2 border-border shadow-lg">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-primary" />
          Análise de Metadados de Imagem (EXIF)
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="image-upload" className="block text-sm font-medium mb-2">
              Selecione uma imagem para análise:
            </label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="h-12"
            />
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileImage className="h-4 w-4" />
              <span>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}
        </div>

        {isAnalyzing && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Analisando metadados...</p>
          </div>
        )}

        {metadata && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Metadados Extraídos:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Informações da Câmera:</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Fabricante:</strong> {metadata.Make || 'N/A'}</p>
                  <p><strong>Modelo:</strong> {metadata.Model || 'N/A'}</p>
                  <p><strong>Software:</strong> {metadata.Software || 'N/A'}</p>
                  <p><strong>Data/Hora:</strong> {metadata.DateTime || 'N/A'}</p>
                </div>
              </div>

              {metadata.GPS && (
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Localização GPS:
                  </h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Latitude:</strong> {metadata.GPS.latitude?.toFixed(6)}</p>
                    <p><strong>Longitude:</strong> {metadata.GPS.longitude?.toFixed(6)}</p>
                    <Button 
                      size="sm" 
                      className="mt-2"
                      onClick={openLocationInMap}
                    >
                      Ver no Mapa
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {!metadata.GPS && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    Esta imagem não contém dados de localização GPS ou os dados foram removidos.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>OSINT - Análise de Metadados:</strong> Esta ferramenta extrai informações técnicas 
                de imagens, incluindo dados da câmera, localização GPS e timestamps para investigação digital.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageAnalysis;
