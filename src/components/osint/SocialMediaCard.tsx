
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Users, 
  Heart, 
  Video, 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  MapPin,
  Globe,
  Calendar,
  MessageCircle,
  Repeat2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { TikTokProfile } from '@/services/osint/tiktokSearch';
import type { TwitterProfile, TwitterTweet } from '@/services/osint/twitterSearch';

interface SocialMediaCardProps {
  type: 'tiktok' | 'twitter';
  profile: TikTokProfile | TwitterProfile;
  recentTweets?: TwitterTweet[];
  source: string;
}

const SocialMediaCard: React.FC<SocialMediaCardProps> = ({ type, profile, recentTweets, source }) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado!",
        description: `${label} copiado para a área de transferência`,
      });
    }).catch(() => {
      toast({
        title: "Erro",
        description: "Não foi possível copiar",
        variant: "destructive"
      });
    });
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const renderTikTokCard = (tikTokProfile: TikTokProfile) => (
    <Card className="w-full border-pink-200 bg-pink-50/50 dark:bg-pink-950/20 dark:border-pink-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-pink-700 dark:text-pink-300">
          <Video className="h-5 w-5" />
          Perfil TikTok
          <div className="flex gap-2 ml-auto">
            {tikTokProfile.verified && (
              <Badge variant="default" className="bg-blue-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verificado
              </Badge>
            )}
            {tikTokProfile.isPrivate && (
              <Badge variant="secondary">Privado</Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações básicas */}
        <div className="flex items-start gap-4">
          {tikTokProfile.avatarUrl && (
            <img
              src={tikTokProfile.avatarUrl}
              alt={tikTokProfile.displayName}
              className="w-16 h-16 rounded-full border-2 border-pink-200"
            />
          )}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{tikTokProfile.displayName}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(tikTokProfile.displayName, 'Nome')}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">@{tikTokProfile.username}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(tikTokProfile.username, 'Username')}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(tikTokProfile.profileUrl, '_blank')}
                className="h-6 w-6 p-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bio */}
        {tikTokProfile.bio && (
          <div className="p-3 bg-background rounded border">
            <p className="text-sm">{tikTokProfile.bio}</p>
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-2 bg-background rounded border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="font-medium">{formatNumber(tikTokProfile.followerCount)}</div>
            <div className="text-xs text-muted-foreground">Seguidores</div>
          </div>
          <div className="text-center p-2 bg-background rounded border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <User className="h-4 w-4 text-green-500" />
            </div>
            <div className="font-medium">{formatNumber(tikTokProfile.followingCount)}</div>
            <div className="text-xs text-muted-foreground">Seguindo</div>
          </div>
          <div className="text-center p-2 bg-background rounded border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Heart className="h-4 w-4 text-red-500" />
            </div>
            <div className="font-medium">{formatNumber(tikTokProfile.likesCount)}</div>
            <div className="text-xs text-muted-foreground">Curtidas</div>
          </div>
          <div className="text-center p-2 bg-background rounded border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Video className="h-4 w-4 text-purple-500" />
            </div>
            <div className="font-medium">{formatNumber(tikTokProfile.videoCount)}</div>
            <div className="text-xs text-muted-foreground">Vídeos</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Fonte: {source}</span>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </div>
      </CardContent>
    </Card>
  );

  const renderTwitterCard = (twitterProfile: TwitterProfile) => (
    <Card className="w-full border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <MessageCircle className="h-5 w-5" />
          Perfil Twitter/X
          <div className="flex gap-2 ml-auto">
            {twitterProfile.verified && (
              <Badge variant="default" className="bg-blue-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verificado
              </Badge>
            )}
            {twitterProfile.isPrivate && (
              <Badge variant="secondary">Privado</Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações básicas */}
        <div className="flex items-start gap-4">
          {twitterProfile.avatarUrl && (
            <img
              src={twitterProfile.avatarUrl}
              alt={twitterProfile.displayName}
              className="w-16 h-16 rounded-full border-2 border-blue-200"
            />
          )}
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{twitterProfile.displayName}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(twitterProfile.displayName, 'Nome')}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">@{twitterProfile.username}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(twitterProfile.username, 'Username')}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(twitterProfile.profileUrl, '_blank')}
                className="h-6 w-6 p-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bio */}
        {twitterProfile.bio && (
          <div className="p-3 bg-background rounded border">
            <p className="text-sm">{twitterProfile.bio}</p>
          </div>
        )}

        {/* Informações adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {twitterProfile.location && (
            <div className="flex items-center gap-2 p-2 bg-background rounded border">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{twitterProfile.location}</span>
            </div>
          )}
          {twitterProfile.website && (
            <div className="flex items-center gap-2 p-2 bg-background rounded border">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a href={twitterProfile.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
                {twitterProfile.website}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2 p-2 bg-background rounded border">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Desde {formatDate(twitterProfile.createdAt)}</span>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 bg-background rounded border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="font-medium">{formatNumber(twitterProfile.followerCount)}</div>
            <div className="text-xs text-muted-foreground">Seguidores</div>
          </div>
          <div className="text-center p-2 bg-background rounded border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <User className="h-4 w-4 text-green-500" />
            </div>
            <div className="font-medium">{formatNumber(twitterProfile.followingCount)}</div>
            <div className="text-xs text-muted-foreground">Seguindo</div>
          </div>
          <div className="text-center p-2 bg-background rounded border">
            <div className="flex items-center justify-center gap-1 mb-1">
              <MessageCircle className="h-4 w-4 text-purple-500" />
            </div>
            <div className="font-medium">{formatNumber(twitterProfile.tweetCount)}</div>
            <div className="text-xs text-muted-foreground">Tweets</div>
          </div>
        </div>

        {/* Tweets recentes */}
        {recentTweets && recentTweets.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Tweets Recentes:</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {recentTweets.slice(0, 3).map((tweet) => (
                <div key={tweet.id} className="p-3 bg-background rounded border">
                  <p className="text-sm mb-2">{tweet.text}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDate(tweet.createdAt)}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {formatNumber(tweet.publicMetrics.likeCount)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Repeat2 className="h-3 w-3" />
                        {formatNumber(tweet.publicMetrics.retweetCount)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Fonte: {source}</span>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </div>
      </CardContent>
    </Card>
  );

  return type === 'tiktok' 
    ? renderTikTokCard(profile as TikTokProfile)
    : renderTwitterCard(profile as TwitterProfile);
};

export default SocialMediaCard;
