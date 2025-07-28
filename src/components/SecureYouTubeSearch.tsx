import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Youtube, Search, ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { secureApiClient } from '@/services/api/secureApiClient';

interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default: {
        url: string;
      };
      medium: {
        url: string;
      };
      high: {
        url: string;
      };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

interface YouTubeSearchResult {
  items: YouTubeVideo[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

const SecureYouTubeSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Termo vazio",
        description: "Por favor, insira um termo de busca",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const data = await secureApiClient.youtubeRequest(
        'https://www.googleapis.com/youtube/v3/search',
        {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 10,
          order: 'relevance'
        }
      ) as YouTubeSearchResult;

      if (data.items && data.items.length > 0) {
        setVideos(data.items);
        toast({
          title: "Busca realizada",
          description: `${data.items.length} vídeos encontrados`,
        });
      } else {
        setVideos([]);
        toast({
          title: "Nenhum resultado",
          description: "Não foram encontrados vídeos para este termo",
          variant: "destructive",
        });
      }
    } catch (error) {
      setVideos([]);
      toast({
        title: "Erro na busca",
        description: "Não foi possível realizar a busca no YouTube. Verifique sua conexão.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const openVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-600" />
          Busca no YouTube
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Section */}
        <div className="flex gap-2">
          <Input
            placeholder="Digite o termo de busca..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading || !query.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Results Section */}
        {hasSearched && (
          <div className="space-y-4">
            {videos.length > 0 ? (
              <div className="grid gap-4">
                {videos.map((video) => (
                  <div
                    key={video.id.videoId}
                    className="flex gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      <img
                        src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url}
                        alt={video.snippet.title}
                        className="w-32 h-24 object-cover rounded"
                      />
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-sm leading-tight">
                        {truncateText(video.snippet.title, 80)}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground">
                        Canal: {video.snippet.channelTitle}
                      </p>
                      
                      <p className="text-xs text-muted-foreground">
                        Publicado em: {formatDate(video.snippet.publishedAt)}
                      </p>
                      
                      <p className="text-sm text-muted-foreground">
                        {truncateText(video.snippet.description, 120)}
                      </p>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openVideo(video.id.videoId)}
                        className="mt-2"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Assistir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <div className="text-center py-8 text-muted-foreground">
                  <Youtube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum vídeo encontrado para "{query}"</p>
                  <p className="text-sm mt-1">Tente usar termos diferentes</p>
                </div>
              )
            )}
          </div>
        )}

        {!hasSearched && (
          <div className="text-center py-8 text-muted-foreground">
            <Youtube className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Digite um termo para buscar vídeos no YouTube</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecureYouTubeSearch;