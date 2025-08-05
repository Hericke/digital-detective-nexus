import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Globe, Shield, Server, Search, Eye } from 'lucide-react';
import { censysService, CensysHostData, CensysSearchResult } from '@/services/osint/censysService';
import { useToast } from '@/hooks/use-toast';

export function CensysAnalysisCard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'ip' | 'domain' | 'organization' | 'port'>('domain');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira um termo para pesquisar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      let searchResult;

      switch (searchType) {
        case 'ip':
          searchResult = await censysService.getHostInfo(searchTerm);
          break;
        case 'domain':
          const [hostsResult, attackSurfaceResult, subdomainsResult] = await Promise.all([
            censysService.searchHostsByDomain(searchTerm),
            censysService.analyzeAttackSurface(searchTerm),
            censysService.findSubdomains(searchTerm)
          ]);
          searchResult = {
            success: true,
            data: {
              hosts: hostsResult.data,
              attackSurface: attackSurfaceResult.data,
              subdomains: subdomainsResult.data
            },
            source: 'Censys Domain Analysis'
          };
          break;
        case 'organization':
          searchResult = await censysService.searchHostsByOrganization(searchTerm);
          break;
        case 'port':
          const port = parseInt(searchTerm);
          if (isNaN(port)) {
            toast({
              title: "Erro",
              description: "Por favor, insira um número de porta válido.",
              variant: "destructive"
            });
            return;
          }
          searchResult = await censysService.searchHostsByPort(port);
          break;
        default:
          throw new Error('Tipo de pesquisa não suportado');
      }

      if (searchResult.success) {
        setResults(searchResult.data);
        toast({
          title: "Análise concluída",
          description: `Dados obtidos via ${searchResult.source}`,
        });
      } else {
        toast({
          title: "Erro na pesquisa",
          description: searchResult.error || "Erro desconhecido",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderHostInfo = (hostData: CensysHostData) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Informações Básicas
          </h4>
          <div className="mt-2 space-y-1">
            <p><strong>IP:</strong> {hostData.ip}</p>
            {hostData.location && (
              <>
                <p><strong>País:</strong> {hostData.location.country} ({hostData.location.country_code})</p>
                <p><strong>Cidade:</strong> {hostData.location.city}</p>
                <p><strong>Timezone:</strong> {hostData.location.timezone}</p>
              </>
            )}
          </div>
        </div>

        {hostData.autonomous_system && (
          <div>
            <h4 className="font-semibold flex items-center gap-2">
              <Server className="w-4 h-4" />
              Sistema Autônomo
            </h4>
            <div className="mt-2 space-y-1">
              <p><strong>ASN:</strong> {hostData.autonomous_system.asn}</p>
              <p><strong>Nome:</strong> {hostData.autonomous_system.name}</p>
              <p><strong>Descrição:</strong> {hostData.autonomous_system.description}</p>
              <p><strong>Prefixo BGP:</strong> {hostData.autonomous_system.bgp_prefix}</p>
            </div>
          </div>
        )}
      </div>

      {hostData.services && hostData.services.length > 0 && (
        <div>
          <h4 className="font-semibold flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Serviços Detectados
          </h4>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {hostData.services.map((service, index) => (
              <Badge key={index} variant="outline">
                {service.port}/{service.transport_protocol} - {service.protocol}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {hostData.dns && (
        <div>
          <h4 className="font-semibold flex items-center gap-2">
            <Globe className="w-4 h-4" />
            DNS
          </h4>
          <div className="mt-2">
            {hostData.dns.names && (
              <p><strong>Nomes:</strong> {hostData.dns.names.join(', ')}</p>
            )}
            {hostData.dns.reverse_dns?.names && (
              <p><strong>Reverse DNS:</strong> {hostData.dns.reverse_dns.names.join(', ')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderSearchResults = (searchData: CensysSearchResult) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Resultados da Pesquisa</h4>
        <Badge variant="secondary">{searchData.total} hosts encontrados</Badge>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {searchData.hits?.slice(0, 10).map((host, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{host.ip}</p>
                {host.name && <p className="text-sm text-muted-foreground">{host.name}</p>}
                {host.location && (
                  <p className="text-sm">{host.location.city}, {host.location.country}</p>
                )}
              </div>
              <div className="text-right">
                {host.autonomous_system && (
                  <Badge variant="outline">ASN {host.autonomous_system.asn}</Badge>
                )}
              </div>
            </div>
            {host.services && host.services.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {host.services.slice(0, 5).map((service, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {service.port}
                  </Badge>
                ))}
                {host.services.length > 5 && (
                  <Badge variant="secondary" className="text-xs">
                    +{host.services.length - 5} mais
                  </Badge>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDomainAnalysis = (data: any) => (
    <Tabs defaultValue="hosts" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="hosts">Hosts</TabsTrigger>
        <TabsTrigger value="subdomains">Subdomínios</TabsTrigger>
        <TabsTrigger value="surface">Superfície de Ataque</TabsTrigger>
      </TabsList>

      <TabsContent value="hosts">
        {data.hosts && renderSearchResults(data.hosts)}
      </TabsContent>

      <TabsContent value="subdomains">
        <div className="space-y-4">
          <h4 className="font-semibold">Subdomínios Descobertos</h4>
          {data.subdomains && data.subdomains.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {data.subdomains.map((subdomain: string, index: number) => (
                <Badge key={index} variant="outline" className="justify-start">
                  {subdomain}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Nenhum subdomínio encontrado</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="surface">
        {data.attackSurface && (
          <div className="space-y-4">
            <h4 className="font-semibold">Análise de Superfície de Ataque</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-2xl font-bold">{data.attackSurface.total_hosts || 0}</div>
                <div className="text-sm text-muted-foreground">Hosts Expostos</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold">{data.attackSurface.total_certificates || 0}</div>
                <div className="text-sm text-muted-foreground">Certificados</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold">{data.subdomains?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Subdomínios</div>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold text-red-500">
                  {((data.attackSurface.total_hosts || 0) + (data.subdomains?.length || 0)) > 50 ? 'Alto' : 'Baixo'}
                </div>
                <div className="text-sm text-muted-foreground">Risco</div>
              </Card>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          Análise Censys
        </CardTitle>
        <CardDescription>
          Análise avançada de infraestrutura e superfície de ataque usando dados da Censys
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="search-term">Termo de Pesquisa</Label>
            <Input
              id="search-term"
              placeholder="Digite IP, domínio, organização ou porta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="w-full sm:w-48">
            <Label htmlFor="search-type">Tipo de Pesquisa</Label>
            <select
              id="search-type"
              className="w-full p-2 border rounded-md"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as any)}
            >
              <option value="domain">Domínio</option>
              <option value="ip">IP</option>
              <option value="organization">Organização</option>
              <option value="port">Porta</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? 'Analisando...' : 'Analisar'}
            </Button>
          </div>
        </div>

        {results && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/50">
            {searchType === 'ip' && renderHostInfo(results)}
            {searchType === 'domain' && renderDomainAnalysis(results)}
            {(searchType === 'organization' || searchType === 'port') && renderSearchResults(results)}
          </div>
        )}

        <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900">Sobre a Censys</p>
            <p className="text-blue-700">
              A Censys oferece dados de internet scanning para análise de infraestrutura e descoberta de assets. 
              Ideal para mapeamento de superfície de ataque e pesquisa de segurança.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}