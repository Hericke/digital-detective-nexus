
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import OSINTInterface from '@/components/osint/OSINTInterface';
import { ArrowLeft, Shield, Database, User, MessageCircle, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OSINTTools: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
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
              <h1 className="text-3xl font-bold cyber-text">Ferramentas OSINT Básicas</h1>
              <p className="text-muted-foreground">
                Validação e pesquisa com APIs públicas funcionais
              </p>
            </div>
          </div>

          {/* Cards informativos sobre as categorias disponíveis */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Telefone
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  Validação de números de telefone
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Database className="h-4 w-4 text-green-600" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  Verificação e busca de emails
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-purple-600" />
                  CNPJ
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  Consulta de empresas
                </p>
              </CardContent>
            </Card>

            <Card className="border-pink-200 bg-pink-50/50 dark:bg-pink-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Video className="h-4 w-4 text-pink-600" />
                  TikTok
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  Perfis públicos do TikTok
                </p>
              </CardContent>
            </Card>

            <Card className="border-cyan-200 bg-cyan-50/50 dark:bg-cyan-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <MessageCircle className="h-4 w-4 text-cyan-600" />
                  Twitter
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  Perfis públicos do Twitter/X
                </p>
              </CardContent>
            </Card>
          </div>
          
          <OSINTInterface />
        </div>
      </div>
      
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        <p>CavernaSPY &copy; {new Date().getFullYear()} - Ferramenta de investigação digital com APIs OSINT funcionais</p>
      </footer>
    </div>
  );
};

export default OSINTTools;
