
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Shield, Database, User, MessageCircle, Video, Phone, Mail, Building, Search, Eye, Globe, Bitcoin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OSINTInterface from '@/components/osint/OSINTInterface';
import AdvancedForensicsInterface from '@/components/osint/AdvancedForensicsInterface';
import { CensysAnalysisCard } from '@/components/osint/CensysAnalysisCard';
import { NewsSearchInterface } from '@/components/osint/NewsSearchInterface';

const OSINTTools: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/">
              <Button 
                variant="ghost" 
                className="pl-0 hover:pl-2 transition-all duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> 
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Ferramentas OSINT
              </h1>
              <p className="text-muted-foreground text-lg">
                Suite completa de investigação digital e análise forense
              </p>
            </div>
          </div>

          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Ferramentas Básicas
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Análise Avançada
              </TabsTrigger>
              <TabsTrigger value="infrastructure" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Infraestrutura
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Notícias
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-blue-600" />
                      Telefone
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Validação e busca de números
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-green-600" />
                      Email
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Verificação e descoberta
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-purple-600" />
                      CNPJ/CPF
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Consulta de empresas e pessoas
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-pink-200 bg-pink-50/50 dark:bg-pink-950/20 hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Video className="h-4 w-4 text-pink-600" />
                      Redes Sociais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      TikTok, Twitter e perfis
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-cyan-200 bg-cyan-50/50 dark:bg-cyan-950/20 hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-cyan-600" />
                      Domínios
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Análise de domínios e DNS
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <OSINTInterface />
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20 hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-red-600" />
                      Forense Digital
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Análise EXIF, detecção web e metadados
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20 hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Bitcoin className="h-4 w-4 text-yellow-600" />
                      Blockchain
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Bitcoin, Ethereum e análise de carteiras
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-indigo-600" />
                      OSINT Premium
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      VirusTotal, TrueCaller e Pipl
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <AdvancedForensicsInterface />
            </TabsContent>

            <TabsContent value="infrastructure" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Eye className="h-4 w-4 text-emerald-600" />
                      Mapeamento de Rede
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Descoberta de hosts, portas e serviços
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-orange-600" />
                      Superfície de Ataque
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Subdomínios, certificados e análise de exposição
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <CensysAnalysisCard />
            </TabsContent>

            <TabsContent value="news" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-teal-200 bg-teal-50/50 dark:bg-teal-950/20 hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Search className="h-4 w-4 text-teal-600" />
                      Busca Global
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Pesquisa em milhares de fontes
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-amber-600" />
                      Extração
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Conteúdo completo de URLs
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 hover:shadow-md transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-rose-600" />
                      Tendências
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      Análise de padrões e tópicos
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <NewsSearchInterface />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <footer className="border-t border-border py-6 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground">
            CavernaSPY &copy; {new Date().getFullYear()} - Plataforma Avançada de Investigação Digital
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OSINTTools;
