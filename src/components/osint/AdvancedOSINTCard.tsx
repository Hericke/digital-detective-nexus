
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  AlertTriangle, 
  Globe, 
  Phone, 
  Mail, 
  ExternalLink,
  Copy,
  Eye,
  Lock,
  Wifi,
  Search,
  Bug,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { OSINTAPIResult } from '@/services/osint/types';

interface AdvancedOSINTCardProps {
  type: string;
  result: OSINTAPIResult;
}

const AdvancedOSINTCard: React.FC<AdvancedOSINTCardProps> = ({ type, result }) => {
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

  const getCardIcon = (type: string) => {
    switch (type) {
      case 'leaks': return <Shield className="h-5 w-5" />;
      case 'email-breach': return <Mail className="h-5 w-5" />;
      case 'whatsapp': return <Phone className="h-5 w-5" />;
      case 'ip-enricher': return <Globe className="h-5 w-5" />;
      case 'phishing': return <AlertTriangle className="h-5 w-5" />;
      case 'subdomain': return <Wifi className="h-5 w-5" />;
      case 'vulnerability': return <Bug className="h-5 w-5" />;
      case 'osint-search': return <Search className="h-5 w-5" />;
      default: return <Eye className="h-5 w-5" />;
    }
  };

  const getCardColor = (type: string) => {
    switch (type) {
      case 'leaks': return 'border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-800';
      case 'email-breach': return 'border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-800';
      case 'whatsapp': return 'border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800';
      case 'ip-enricher': return 'border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800';
      case 'phishing': return 'border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20 dark:border-yellow-800';
      case 'subdomain': return 'border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-800';
      case 'vulnerability': return 'border-pink-200 bg-pink-50/50 dark:bg-pink-950/20 dark:border-pink-800';
      default: return 'border-gray-200 bg-gray-50/50 dark:bg-gray-950/20 dark:border-gray-800';
    }
  };

  const getTitle = (type: string) => {
    switch (type) {
      case 'leaks': return 'Vazamentos de Dados';
      case 'email-breach': return 'Violação de Email';
      case 'whatsapp': return 'WhatsApp OSINT';
      case 'ip-enricher': return 'Informações de IP';
      case 'phishing': return 'Detecção de Phishing';
      case 'subdomain': return 'Subdomínios';
      case 'vulnerability': return 'Vulnerabilidades';
      case 'osint-search': return 'Busca OSINT';
      case 'phone-leak': return 'Vazamento de Telefone';
      case 'broken-link': return 'Verificação de Links';
      default: return 'Resultado OSINT';
    }
  };

  if (!result.success) {
    return (
      <Card className={`w-full ${getCardColor(type)}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            {getTitle(type)} - Erro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{result.error}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>Fonte: {result.source}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderWhatsAppData = (data: any) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-2 bg-background rounded border">
        <span className="text-sm font-medium">Telefone:</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">{data.phone}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(data.phone, 'Telefone')}
            className="h-6 w-6 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {data.profile_pic && (
        <div className="flex items-center justify-center p-4 bg-background rounded border">
          <img 
            src={`data:image/jpeg;base64,${data.profile_pic}`} 
            alt="Foto do perfil" 
            className="w-20 h-20 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      {data.about && (
        <div className="p-2 bg-background rounded border">
          <span className="text-sm font-medium">Sobre:</span>
          <p className="text-sm mt-1">{data.about}</p>
        </div>
      )}
    </div>
  );

  const renderIPData = (data: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div className="flex items-center justify-between p-2 bg-background rounded border">
        <span className="text-sm font-medium">IP:</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm">{data.ip}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(data.ip, 'IP')}
            className="h-6 w-6 p-0"
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between p-2 bg-background rounded border">
        <span className="text-sm font-medium">País:</span>
        <span className="text-sm">{data.country} ({data.country_code})</span>
      </div>
      <div className="flex items-center justify-between p-2 bg-background rounded border">
        <span className="text-sm font-medium">Cidade:</span>
        <span className="text-sm">{data.city}</span>
      </div>
      <div className="flex items-center justify-between p-2 bg-background rounded border">
        <span className="text-sm font-medium">ISP:</span>
        <span className="text-sm">{data.isp}</span>
      </div>
      {data.threat_level && (
        <div className="flex items-center justify-between p-2 bg-background rounded border">
          <span className="text-sm font-medium">Nível de Ameaça:</span>
          <Badge variant={data.threat_level === 'low' ? 'default' : 'destructive'}>
            {data.threat_level}
          </Badge>
        </div>
      )}
    </div>
  );

  const renderSubdomainData = (data: any) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-2 bg-background rounded border">
        <span className="text-sm font-medium">Domínio:</span>
        <span className="text-sm">{data.domain}</span>
      </div>
      <div className="flex items-center justify-between p-2 bg-background rounded border">
        <span className="text-sm font-medium">Total Encontrados:</span>
        <Badge>{data.total_found || data.subdomains?.length || 0}</Badge>
      </div>
      {data.subdomains && data.subdomains.length > 0 && (
        <div className="p-2 bg-background rounded border">
          <span className="text-sm font-medium">Subdomínios:</span>
          <div className="mt-2 max-h-40 overflow-y-auto">
            {data.subdomains.slice(0, 10).map((subdomain: string, index: number) => (
              <div key={index} className="flex items-center justify-between py-1 border-b last:border-b-0">
                <span className="text-xs font-mono">{subdomain}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://${subdomain}`, '_blank')}
                  className="h-5 w-5 p-0"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {data.subdomains.length > 10 && (
              <p className="text-xs text-muted-foreground mt-2">
                E mais {data.subdomains.length - 10} subdomínios...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderGenericData = (data: any) => (
    <div className="space-y-2">
      {Object.entries(data).map(([key, value], index) => (
        <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
          <span className="text-sm font-medium capitalize">{key.replace('_', ' ')}:</span>
          <span className="text-sm text-right max-w-xs truncate">
            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
          </span>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (!result.data) return null;

    switch (type) {
      case 'whatsapp':
        return renderWhatsAppData(result.data);
      case 'ip-enricher':
        return renderIPData(result.data);
      case 'subdomain':
        return renderSubdomainData(result.data);
      default:
        return renderGenericData(result.data);
    }
  };

  return (
    <Card className={`w-full ${getCardColor(type)}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          {getCardIcon(type)}
          {getTitle(type)}
          <Badge variant="outline" className="ml-auto">
            <CheckCircle className="h-3 w-3 mr-1" />
            Sucesso
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {renderContent()}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Fonte: {result.source}</span>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedOSINTCard;
