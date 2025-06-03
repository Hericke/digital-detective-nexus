
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Youtube, Search, ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const YOUTUBE_API_KEY = "AIzaSyC_v74qHgKG_8YjKxC2ABhTWUKSkGlY-H8";

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

const YouTubeSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const searchYouTube = async (query: string) => {
    try {
      setIsSearching(true);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&maxResults=10&type=video`
      );
      
      if (!response.ok) {
        throw new Error('Erro na API do YouTube');
      }
      
      const data = await response.json();
      setVideos(data.items || []);
      
      toast({
        title: "Busca concluída",
        description: `Encontrados ${data.items?.length || 0} vídeos`
      });
    } catch (error) {
      console.error('Erro na busca do YouTube:', error);
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar vídeos no YouTube",
        variant: "destructive"
      });
      setVideos([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite um termo para buscar",
        variant: "destructive"
      });
      return;
    }
    searchYouTube(searchQuery);
  };

  const openVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 border-2 border-border shadow-lg">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-500" />
          Busca OSINT no YouTube
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1">
            <Input
              className="h-12 text-lg"
              placeholder="Digite nome, empresa, evento ou termo de busca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            className="h-12 px-6"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </>
            )}
          </Button>
        </div>

        {videos.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Resultados encontrados:</h3>
            <div className="grid gap-4">
              {videos.map((video) => (
                <div 
                  key={video.id.videoId} 
                  className="flex gap-4 p-4 border rounded-lg hover:bg-muted/30 cursor-pointer"
                  onClick={() => openVideo(video.id.videoId)}
                >
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="w-32 h-24 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <h4 className="font-medium line-clamp-2">{video.snippet.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {video.snippet.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{video.snippet.channelTitle}</span>
                      <span>{formatDate(video.snippet.publishedAt)}</span>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <Youtube className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm text-red-800">
                <strong>OSINT YouTube:</strong> Busque vídeos relacionados ao alvo da investigação. 
                Útil para encontrar aparições públicas, eventos, entrevistas ou conteúdo relacionado.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubeSearch;
