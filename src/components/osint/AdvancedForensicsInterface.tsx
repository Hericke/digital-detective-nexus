import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, 
  Phone, 
  User, 
  Bitcoin, 
  Search, 
  Camera, 
  Upload,
  Coins,
  Database,
  Eye,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import AdvancedOSINTCard from './AdvancedOSINTCard';
import { 
  analyzeWithVirusTotal,
  searchWithTrueCaller,
  searchWithPipl,
  searchOSINTEverything,
  analyzeBitcoinAddress,
  analyzeEthereumAddress,
  getExchangesData,
  extractImageExif,
  analyzeImageForWeb,
  formatPhoneForTrueCaller,
  isValidBitcoinAddress,
  isValidEthereumAddress
} from '@/services/osint/advancedForensicsService';
import type { OSINTAPIResult } from '@/services/osint/types';

const AdvancedForensicsInterface: React.FC = () => {
  // Estados para inputs
  const [domain, setDomain] = useState('');
  const [phone, setPhone] = useState('');
  const [personName, setPersonName] = useState('');
  const [osintQuery, setOsintQuery] = useState('');
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [ethereumAddress, setEthereumAddress] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  // Estados para loading
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Estados para resultados
  const [results, setResults] = useState<Record<string, OSINTAPIResult>>({});

  const setLoading = (key: string, value: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  const setResult = (key: string, result: OSINTAPIResult) => {
    setResults(prev => ({ ...prev, [key]: result }));
  };

  // FASE 1: APIs Premium OSINT

  const handleVirusTotalAnalysis = useCallback(async () => {
    if (!domain.trim()) {
      toast.error('Digite um domínio para análise');
      return;
    }

    setLoading('virustotal', true);
    try {
      const result = await analyzeWithVirusTotal(domain.trim());
      setResult('virustotal', result);
      
      if (result.success) {
        toast.success('Análise VirusTotal concluída');
      } else {
        toast.error(result.error || 'Erro na análise VirusTotal');
      }
    } catch (error) {
      toast.error('Erro ao conectar com VirusTotal');
    } finally {
      setLoading('virustotal', false);
    }
  }, [domain]);

  const handleTrueCallerSearch = useCallback(async () => {
    if (!phone.trim()) {
      toast.error('Digite um número de telefone');
      return;
    }

    const formattedPhone = formatPhoneForTrueCaller(phone);
    
    setLoading('truecaller', true);
    try {
      const result = await searchWithTrueCaller(formattedPhone);
      setResult('truecaller', result);
      
      if (result.success) {
        toast.success('Busca TrueCaller concluída');
      } else {
        toast.error(result.error || 'Erro na busca TrueCaller');
      }
    } catch (error) {
      toast.error('Erro ao conectar com TrueCaller');
    } finally {
      setLoading('truecaller', false);
    }
  }, [phone]);

  const handlePiplSearch = useCallback(async () => {
    if (!personName.trim()) {
      toast.error('Digite um nome para busca');
      return;
    }

    setLoading('pipl', true);
    try {
      const result = await searchWithPipl(personName.trim());
      setResult('pipl', result);
      
      if (result.success) {
        toast.success('Busca Pipl concluída');
      } else {
        toast.error(result.error || 'Erro na busca Pipl');
      }
    } catch (error) {
      toast.error('Erro ao conectar com Pipl');
    } finally {
      setLoading('pipl', false);
    }
  }, [personName]);

  const handleOSINTEverythingSearch = useCallback(async () => {
    if (!osintQuery.trim()) {
      toast.error('Digite um termo para busca OSINT');
      return;
    }

    setLoading('osint-everything', true);
    try {
      const result = await searchOSINTEverything(osintQuery.trim());
      setResult('osint-everything', result);
      
      if (result.success) {
        toast.success('Busca OSINT completa concluída');
      } else {
        toast.error(result.error || 'Erro na busca OSINT');
      }
    } catch (error) {
      toast.error('Erro ao conectar com OSINT Everything');
    } finally {
      setLoading('osint-everything', false);
    }
  }, [osintQuery]);

  // Análise de Blockchain

  const handleBitcoinAnalysis = useCallback(async () => {
    if (!bitcoinAddress.trim()) {
      toast.error('Digite um endereço Bitcoin');
      return;
    }

    if (!isValidBitcoinAddress(bitcoinAddress.trim())) {
      toast.error('Endereço Bitcoin inválido');
      return;
    }

    setLoading('blockchain', true);
    try {
      const result = await analyzeBitcoinAddress(bitcoinAddress.trim());
      setResult('blockchain', result);
      
      if (result.success) {
        toast.success('Análise Bitcoin concluída');
      } else {
        toast.error(result.error || 'Erro na análise Bitcoin');
      }
    } catch (error) {
      toast.error('Erro ao analisar endereço Bitcoin');
    } finally {
      setLoading('blockchain', false);
    }
  }, [bitcoinAddress]);

  const handleEthereumAnalysis = useCallback(async () => {
    if (!ethereumAddress.trim()) {
      toast.error('Digite um endereço Ethereum');
      return;
    }

    if (!isValidEthereumAddress(ethereumAddress.trim())) {
      toast.error('Endereço Ethereum inválido');
      return;
    }

    setLoading('ethereum', true);
    try {
      const result = await analyzeEthereumAddress(ethereumAddress.trim());
      setResult('ethereum', result);
      
      if (result.success) {
        toast.success('Análise Ethereum concluída');
      } else {
        toast.error(result.error || 'Erro na análise Ethereum');
      }
    } catch (error) {
      toast.error('Erro ao analisar endereço Ethereum');
    } finally {
      setLoading('ethereum', false);
    }
  }, [ethereumAddress]);

  const handleExchangesData = useCallback(async () => {
    setLoading('exchanges', true);
    try {
      const result = await getExchangesData();
      setResult('exchanges', result);
      
      if (result.success) {
        toast.success('Dados de exchanges obtidos');
      } else {
        toast.error(result.error || 'Erro ao obter dados de exchanges');
      }
    } catch (error) {
      toast.error('Erro ao conectar com CoinAPI');
    } finally {
      setLoading('exchanges', false);
    }
  }, []);

  // FASE 2: Análise Forense

  const handleImageExifExtraction = useCallback(async () => {
    if (!imageFile) {
      toast.error('Selecione uma imagem para análise');
      return;
    }

    setLoading('exif', true);
    try {
      // Converter arquivo para base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        
        const result = await extractImageExif(base64Data);
        setResult('exif', result);
        
        if (result.success) {
          toast.success('Dados EXIF extraídos');
        } else {
          toast.error(result.error || 'Erro ao extrair dados EXIF');
        }
        setLoading('exif', false);
      };
      
      reader.readAsDataURL(imageFile);
    } catch (error) {
      toast.error('Erro ao processar imagem');
      setLoading('exif', false);
    }
  }, [imageFile]);

  const handleWebDetection = useCallback(async () => {
    if (!imageUrl.trim()) {
      toast.error('Digite uma URL de imagem');
      return;
    }

    setLoading('web-detection', true);
    try {
      const result = await analyzeImageForWeb(imageUrl.trim());
      setResult('web-detection', result);
      
      if (result.success) {
        toast.success('Detecção web concluída');
      } else {
        toast.error(result.error || 'Erro na detecção web');
      }
    } catch (error) {
      toast.error('Erro ao analisar imagem na web');
    } finally {
      setLoading('web-detection', false);
    }
  }, [imageUrl]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <Shield className="h-6 w-6" />
            <span>Ferramentas Avançadas de OSINT e Análise Forense</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="osint-premium" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="osint-premium">OSINT Premium</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              <TabsTrigger value="forensics">Análise Forense</TabsTrigger>
              <TabsTrigger value="results">Resultados</TabsTrigger>
            </TabsList>

            {/* OSINT Premium */}
            <TabsContent value="osint-premium" className="space-y-6">
              {/* VirusTotal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Shield className="h-5 w-5" />
                    <span>VirusTotal - Análise de Domínio</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domínio</Label>
                    <Input
                      id="domain"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="exemplo.com"
                    />
                  </div>
                  <Button 
                    onClick={handleVirusTotalAnalysis}
                    disabled={loadingStates.virustotal}
                    className="w-full"
                  >
                    {loadingStates.virustotal ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Shield className="h-4 w-4 mr-2" />
                    )}
                    Analisar Domínio
                  </Button>
                </CardContent>
              </Card>

              {/* TrueCaller */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Phone className="h-5 w-5" />
                    <span>TrueCaller - Busca de Telefone</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone-truecaller">Telefone</Label>
                    <Input
                      id="phone-truecaller"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+5511999999999"
                    />
                  </div>
                  <Button 
                    onClick={handleTrueCallerSearch}
                    disabled={loadingStates.truecaller}
                    className="w-full"
                  >
                    {loadingStates.truecaller ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Phone className="h-4 w-4 mr-2" />
                    )}
                    Buscar Telefone
                  </Button>
                </CardContent>
              </Card>

              {/* Pipl */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <User className="h-5 w-5" />
                    <span>Pipl - Busca de Pessoa</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="person-name">Nome da Pessoa</Label>
                    <Input
                      id="person-name"
                      value={personName}
                      onChange={(e) => setPersonName(e.target.value)}
                      placeholder="João Silva"
                    />
                  </div>
                  <Button 
                    onClick={handlePiplSearch}
                    disabled={loadingStates.pipl}
                    className="w-full"
                  >
                    {loadingStates.pipl ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <User className="h-4 w-4 mr-2" />
                    )}
                    Buscar Pessoa
                  </Button>
                </CardContent>
              </Card>

              {/* OSINT Everything */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Search className="h-5 w-5" />
                    <span>OSINT Everything - Busca Completa</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="osint-query">Termo de Busca</Label>
                    <Textarea
                      id="osint-query"
                      value={osintQuery}
                      onChange={(e) => setOsintQuery(e.target.value)}
                      placeholder="email@exemplo.com, telefone, nome da empresa..."
                      rows={2}
                    />
                  </div>
                  <Button 
                    onClick={handleOSINTEverythingSearch}
                    disabled={loadingStates['osint-everything']}
                    className="w-full"
                  >
                    {loadingStates['osint-everything'] ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Buscar OSINT Completo
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blockchain */}
            <TabsContent value="blockchain" className="space-y-6">
              {/* Bitcoin */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Bitcoin className="h-5 w-5" />
                    <span>Análise de Endereço Bitcoin</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bitcoin-address">Endereço Bitcoin</Label>
                    <Input
                      id="bitcoin-address"
                      value={bitcoinAddress}
                      onChange={(e) => setBitcoinAddress(e.target.value)}
                      placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                      className="font-mono text-sm"
                    />
                  </div>
                  <Button 
                    onClick={handleBitcoinAnalysis}
                    disabled={loadingStates.blockchain}
                    className="w-full"
                  >
                    {loadingStates.blockchain ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Bitcoin className="h-4 w-4 mr-2" />
                    )}
                    Analisar Bitcoin
                  </Button>
                </CardContent>
              </Card>

              {/* Ethereum */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Coins className="h-5 w-5" />
                    <span>Análise de Endereço Ethereum</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ethereum-address">Endereço Ethereum</Label>
                    <Input
                      id="ethereum-address"
                      value={ethereumAddress}
                      onChange={(e) => setEthereumAddress(e.target.value)}
                      placeholder="0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                      className="font-mono text-sm"
                    />
                  </div>
                  <Button 
                    onClick={handleEthereumAnalysis}
                    disabled={loadingStates.ethereum}
                    className="w-full"
                  >
                    {loadingStates.ethereum ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Coins className="h-4 w-4 mr-2" />
                    )}
                    Analisar Ethereum
                  </Button>
                </CardContent>
              </Card>

              {/* Exchanges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Database className="h-5 w-5" />
                    <span>Dados de Exchanges</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleExchangesData}
                    disabled={loadingStates.exchanges}
                    className="w-full"
                  >
                    {loadingStates.exchanges ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Database className="h-4 w-4 mr-2" />
                    )}
                    Obter Dados de Exchanges
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Análise Forense */}
            <TabsContent value="forensics" className="space-y-6">
              {/* EXIF */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Camera className="h-5 w-5" />
                    <span>Extração de Dados EXIF</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image-upload">Upload de Imagem</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      />
                      <Upload className="h-4 w-4" />
                    </div>
                    {imageFile && (
                      <Badge variant="secondary">
                        {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
                      </Badge>
                    )}
                  </div>
                  <Button 
                    onClick={handleImageExifExtraction}
                    disabled={loadingStates.exif || !imageFile}
                    className="w-full"
                  >
                    {loadingStates.exif ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Camera className="h-4 w-4 mr-2" />
                    )}
                    Extrair Dados EXIF
                  </Button>
                </CardContent>
              </Card>

              {/* Web Detection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Eye className="h-5 w-5" />
                    <span>Detecção Web de Imagem</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image-url">URL da Imagem</Label>
                    <Input
                      id="image-url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                  <Button 
                    onClick={handleWebDetection}
                    disabled={loadingStates['web-detection']}
                    className="w-full"
                  >
                    {loadingStates['web-detection'] ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Eye className="h-4 w-4 mr-2" />
                    )}
                    Analisar Imagem na Web
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Resultados */}
            <TabsContent value="results" className="space-y-6">
              {Object.entries(results).length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum resultado ainda. Execute alguma análise nas outras abas.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {Object.entries(results).map(([type, result]) => (
                    <AdvancedOSINTCard 
                      key={type} 
                      type={type as any} 
                      result={result} 
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Aviso Legal */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-900">
                Aviso Legal - Ferramentas Avançadas de OSINT
              </h4>
              <p className="text-sm text-orange-800">
                Estas ferramentas são destinadas exclusivamente para investigação legal e ética. 
                Use apenas em alvos que você tem autorização para investigar. Respeite a privacidade 
                e as leis locais. O uso inadequado pode resultar em consequências legais.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedForensicsInterface;