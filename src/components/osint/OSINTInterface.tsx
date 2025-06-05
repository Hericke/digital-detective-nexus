import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  Mail, 
  Building, 
  Search, 
  Loader2,
  Shield,
  AlertTriangle,
  Video,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import OSINTResultCard from './OSINTResultCard';
import SocialMediaCard from './SocialMediaCard';
import { validatePhone } from '@/services/osint/phoneValidation';
import { verifyEmail, findEmailByName } from '@/services/osint/emailSearch';
import { searchCNPJ, validateCNPJ } from '@/services/osint/cnpjSearch';
import { searchTikTokProfile } from '@/services/osint/tiktokSearch';
import { searchTwitterProfile } from '@/services/osint/twitterSearch';

const OSINTInterface: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  // Estados para os formulários
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [emailName, setEmailName] = useState('');
  const [emailDomain, setEmailDomain] = useState('');
  const [cnpjNumber, setCnpjNumber] = useState('');
  const [tikTokUsername, setTikTokUsername] = useState('');
  const [twitterUsername, setTwitterUsername] = useState('');

  const handlePhoneValidation = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira um número de telefone",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResults([]);
    
    try {
      console.log('Iniciando validação de telefone:', phoneNumber);
      const result = await validatePhone(phoneNumber);
      
      if (result) {
        setResults([{ type: 'phone', data: result, source: 'NumVerify' }]);
        toast({
          title: "Validação concluída",
          description: result.valid ? "Telefone válido" : "Telefone inválido",
        });
      } else {
        toast({
          title: "Erro na validação",
          description: "Não foi possível validar o telefone. Verifique se o número está correto.",
          variant: "destructive"
        });
        setResults([]);
      }
    } catch (error) {
      console.error('Erro completo:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao validar o telefone. Tente novamente.",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    if (!emailAddress.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira um endereço de email",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResults([]);
    
    try {
      console.log('Iniciando verificação de email:', emailAddress);
      const result = await verifyEmail(emailAddress);
      
      if (result) {
        setResults([{ type: 'email', data: result, source: 'Hunter.io' }]);
        toast({
          title: "Verificação concluída",
          description: `Email ${result.result}`,
        });
      } else {
        toast({
          title: "Erro na verificação",
          description: "Não foi possível verificar o email. Verifique se o endereço está correto.",
          variant: "destructive"
        });
        setResults([]);
      }
    } catch (error) {
      console.error('Erro completo:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao verificar o email. Tente novamente.",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSearch = async () => {
    if (!emailName.trim() || !emailDomain.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, insira o nome completo e o domínio",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResults([]);
    
    try {
      console.log('Iniciando busca de email:', emailName, emailDomain);
      const result = await findEmailByName(emailName, emailDomain);
      
      if (result) {
        setResults([{ type: 'email', data: result, source: 'Hunter.io' }]);
        toast({
          title: "Busca concluída",
          description: "Email encontrado com sucesso",
        });
      } else {
        toast({
          title: "Nenhum resultado",
          description: "Não foi possível encontrar um email para estes dados",
        });
        setResults([]);
      }
    } catch (error) {
      console.error('Erro completo:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar o email. Tente novamente.",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCNPJSearch = async () => {
    if (!cnpjNumber.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira um CNPJ",
        variant: "destructive"
      });
      return;
    }

    if (!validateCNPJ(cnpjNumber)) {
      toast({
        title: "CNPJ inválido",
        description: "Por favor, verifique o número do CNPJ",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResults([]);
    
    try {
      console.log('Iniciando consulta CNPJ:', cnpjNumber);
      const result = await searchCNPJ(cnpjNumber);
      
      if (result) {
        setResults([{ type: 'cnpj', data: result, source: 'ReceitaWS' }]);
        toast({
          title: "Consulta concluída",
          description: "Dados da empresa encontrados",
        });
      } else {
        toast({
          title: "Empresa não encontrada",
          description: "Não foi possível encontrar dados para este CNPJ",
          variant: "destructive"
        });
        setResults([]);
      }
    } catch (error) {
      console.error('Erro completo:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao consultar o CNPJ. Tente novamente.",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTikTokSearch = async () => {
    if (!tikTokUsername.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira um nome de usuário do TikTok",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResults([]);
    
    try {
      console.log('Iniciando busca TikTok:', tikTokUsername);
      const result = await searchTikTokProfile(tikTokUsername);
      
      if (result.success && result.data) {
        setResults([{ type: 'tiktok', data: result.data, source: 'TikTok API' }]);
        toast({
          title: "Busca concluída",
          description: "Perfil TikTok encontrado com sucesso",
        });
      } else {
        toast({
          title: "Perfil não encontrado",
          description: result.error || "Não foi possível encontrar o perfil no TikTok",
          variant: "destructive"
        });
        setResults([]);
      }
    } catch (error) {
      console.error('Erro completo:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar no TikTok. Tente novamente.",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwitterSearch = async () => {
    if (!twitterUsername.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira um nome de usuário do Twitter",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResults([]);
    
    try {
      console.log('Iniciando busca Twitter:', twitterUsername);
      const result = await searchTwitterProfile(twitterUsername);
      
      if (result.success && result.data) {
        setResults([{ 
          type: 'twitter', 
          data: result.data.profile, 
          recentTweets: result.data.recentTweets,
          source: 'Twitter API' 
        }]);
        toast({
          title: "Busca concluída",
          description: "Perfil Twitter encontrado com sucesso",
        });
      } else {
        toast({
          title: "Perfil não encontrado",
          description: result.error || "Não foi possível encontrar o perfil no Twitter",
          variant: "destructive"
        });
        setResults([]);
      }
    } catch (error) {
      console.error('Erro completo:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar no Twitter. Tente novamente.",
        variant: "destructive"
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Ferramentas OSINT Avançadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="phone" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="cnpj" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                CNPJ
              </TabsTrigger>
              <TabsTrigger value="tiktok" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                TikTok
              </TabsTrigger>
              <TabsTrigger value="twitter" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Twitter
              </TabsTrigger>
            </TabsList>

            <TabsContent value="phone" className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="phone">Número de Telefone</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999 ou +5511999999999"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handlePhoneValidation}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Valida números de telefone e exibe informações sobre país, operadora e tipo
                </p>
              </div>
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="email-verify">Verificar Email Existente</Label>
                  <div className="flex gap-2">
                    <Input
                      id="email-verify"
                      type="email"
                      placeholder="usuario@exemplo.com"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleEmailVerification}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Verifica se um email existe e está ativo
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Buscar Email por Nome</Label>
                  <div className="space-y-2">
                    <Input
                      placeholder="João Silva"
                      value={emailName}
                      onChange={(e) => setEmailName(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="empresa.com.br"
                        value={emailDomain}
                        onChange={(e) => setEmailDomain(e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        onClick={handleEmailSearch}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Busca emails com base no nome e domínio da empresa
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="cnpj" className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="cnpj">CNPJ da Empresa</Label>
                <div className="flex gap-2">
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={cnpjNumber}
                    onChange={(e) => setCnpjNumber(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleCNPJSearch}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Consulta dados oficiais da empresa na Receita Federal
                </p>
              </div>
            </TabsContent>

            <TabsContent value="tiktok" className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="tiktok">Username do TikTok</Label>
                <div className="flex gap-2">
                  <Input
                    id="tiktok"
                    placeholder="@usuario ou usuario"
                    value={tikTokUsername}
                    onChange={(e) => setTikTokUsername(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleTikTokSearch}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Busca perfis públicos no TikTok e exibe bio, seguidores e estatísticas
                </p>
              </div>
            </TabsContent>

            <TabsContent value="twitter" className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="twitter">Username do Twitter/X</Label>
                <div className="flex gap-2">
                  <Input
                    id="twitter"
                    placeholder="@usuario ou usuario"
                    value={twitterUsername}
                    onChange={(e) => setTwitterUsername(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleTwitterSearch}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Busca perfis públicos no Twitter/X, exibe bio, tweets recentes e estatísticas
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Resultados */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Resultados da Consulta</h3>
          {results.map((result, index) => (
            result.type === 'tiktok' || result.type === 'twitter' ? (
              <SocialMediaCard
                key={index}
                type={result.type}
                profile={result.data}
                recentTweets={result.recentTweets}
                source={result.source}
              />
            ) : (
              <OSINTResultCard
                key={index}
                type={result.type}
                data={result.data}
                source={result.source}
              />
            )
          ))}
        </div>
      )}

      {/* Aviso Legal */}
      <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20 dark:border-yellow-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Aviso Legal
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                As informações exibidas neste aplicativo são obtidas exclusivamente de fontes públicas e abertas. 
                Nenhum dado privado ou sigiloso é acessado ou armazenado. Use estas informações de forma ética e responsável.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OSINTInterface;
