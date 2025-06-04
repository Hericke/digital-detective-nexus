
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Mail, 
  Building, 
  Copy, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { PhoneValidationResult } from '@/services/osint/phoneValidation';
import type { EmailVerificationResult, EmailFinderResult } from '@/services/osint/emailSearch';
import type { CNPJResult } from '@/services/osint/cnpjSearch';

interface OSINTResultCardProps {
  type: 'phone' | 'email' | 'cnpj';
  data: PhoneValidationResult | EmailVerificationResult | EmailFinderResult | CNPJResult;
  source: string;
}

const OSINTResultCard: React.FC<OSINTResultCardProps> = ({ type, data, source }) => {
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

  const renderPhoneCard = (phoneData: PhoneValidationResult) => (
    <Card className="w-full border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <Phone className="h-5 w-5" />
          Validação de Telefone
          <Badge variant={phoneData.valid ? "default" : "destructive"} className="ml-auto">
            {phoneData.valid ? "Válido" : "Inválido"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-background rounded border">
              <span className="text-sm font-medium">Número:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{phoneData.internationalFormat || phoneData.number}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(phoneData.number, 'Número')}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-background rounded border">
              <span className="text-sm font-medium">País:</span>
              <span className="text-sm">{phoneData.countryName} ({phoneData.countryCode})</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-background rounded border">
              <span className="text-sm font-medium">Operadora:</span>
              <span className="text-sm">{phoneData.carrier || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-background rounded border">
              <span className="text-sm font-medium">Tipo:</span>
              <span className="text-sm">{phoneData.lineType || 'N/A'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Fonte: {source}</span>
          {phoneData.valid && <CheckCircle className="h-4 w-4 text-green-500" />}
        </div>
      </CardContent>
    </Card>
  );

  const renderEmailCard = (emailData: EmailVerificationResult | EmailFinderResult) => {
    const isVerification = 'result' in emailData;
    
    return (
      <Card className="w-full border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Mail className="h-5 w-5" />
            {isVerification ? 'Verificação de Email' : 'Email Encontrado'}
            {isVerification && (
              <Badge 
                variant={emailData.result === 'deliverable' ? "default" : 
                        emailData.result === 'undeliverable' ? "destructive" : "secondary"}
                className="ml-auto"
              >
                {emailData.result === 'deliverable' ? 'Válido' : 
                 emailData.result === 'undeliverable' ? 'Inválido' : 'Incerto'}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-2 bg-background rounded border">
            <span className="text-sm font-medium">Email:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{emailData.email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(emailData.email, 'Email')}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`mailto:${emailData.email}`, '_blank')}
                className="h-6 w-6 p-0"
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {isVerification ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Score de Confiança:</span>
                  <span className="font-medium">{emailData.score}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Formato Válido:</span>
                  {emailData.regexp ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Webmail:</span>
                  {emailData.webmail ? <CheckCircle className="h-3 w-3 text-blue-500" /> : <XCircle className="h-3 w-3 text-gray-500" />}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Descartável:</span>
                  {emailData.disposable ? <AlertCircle className="h-3 w-3 text-yellow-500" /> : <CheckCircle className="h-3 w-3 text-green-500" />}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2 bg-background rounded border">
                <span className="text-sm font-medium">Nome:</span>
                <span className="text-sm">{emailData.firstName} {emailData.lastName}</span>
              </div>
              {emailData.position && (
                <div className="flex items-center justify-between p-2 bg-background rounded border">
                  <span className="text-sm font-medium">Cargo:</span>
                  <span className="text-sm">{emailData.position}</span>
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>Fonte: {source}</span>
            {isVerification && emailData.result === 'deliverable' && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCNPJCard = (cnpjData: CNPJResult) => (
    <Card className="w-full border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
          <Building className="h-5 w-5" />
          Dados da Empresa
          <Badge variant={cnpjData.situacao_cadastral === 'ATIVA' ? "default" : "destructive"} className="ml-auto">
            {cnpjData.situacao_cadastral}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-background rounded border">
            <span className="text-sm font-medium">CNPJ:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{cnpjData.cnpj}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(cnpjData.cnpj, 'CNPJ')}
                className="h-6 w-6 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-2 bg-background rounded border">
            <span className="text-sm font-medium">Razão Social:</span>
            <span className="text-sm text-right">{cnpjData.razao_social}</span>
          </div>
          {cnpjData.nome_fantasia && (
            <div className="flex items-center justify-between p-2 bg-background rounded border">
              <span className="text-sm font-medium">Nome Fantasia:</span>
              <span className="text-sm text-right">{cnpjData.nome_fantasia}</span>
            </div>
          )}
        </div>
        
        {(cnpjData.ddd_telefone_1 || cnpjData.logradouro) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {cnpjData.ddd_telefone_1 && (
              <div className="flex items-center justify-between p-2 bg-background rounded border">
                <span className="text-sm font-medium">Telefone:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{cnpjData.ddd_telefone_1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(cnpjData.ddd_telefone_1, 'Telefone')}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            {cnpjData.logradouro && (
              <div className="flex items-center justify-between p-2 bg-background rounded border">
                <span className="text-sm font-medium">Endereço:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-right">
                    {cnpjData.logradouro}, {cnpjData.numero} - {cnpjData.bairro}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(`${cnpjData.logradouro}, ${cnpjData.numero}, ${cnpjData.bairro}, ${cnpjData.municipio}, ${cnpjData.uf}`)}`, '_blank')}
                    className="h-6 w-6 p-0"
                    title="Ver no Google Maps"
                  >
                    <MapPin className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>Fonte: {source}</span>
          {cnpjData.situacao_cadastral === 'ATIVA' && <CheckCircle className="h-4 w-4 text-green-500" />}
        </div>
      </CardContent>
    </Card>
  );

  switch (type) {
    case 'phone':
      return renderPhoneCard(data as PhoneValidationResult);
    case 'email':
      return renderEmailCard(data as EmailVerificationResult | EmailFinderResult);
    case 'cnpj':
      return renderCNPJCard(data as CNPJResult);
    default:
      return null;
  }
};

export default OSINTResultCard;
