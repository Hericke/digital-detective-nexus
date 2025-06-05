
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import OSINTInterface from '@/components/osint/OSINTInterface';
import { ArrowLeft, Shield, Database, Bug, Eye, Globe } from 'lucide-react';
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
              <h1 className="text-3xl font-bold cyber-text">Ferramentas OSINT Avançadas</h1>
              <p className="text-muted-foreground">
                Validação completa com 23+ APIs especializadas em inteligência de fontes abertas
              </p>
            </div>
          </div>

          {/* Cards informativos sobre as categorias */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Validação Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  Telefone, Email, CNPJ, TikTok e Twitter
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Database className="h-4 w-4 text-red-600" />
                  Vazamentos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  Domínios, Emails, Telefones e PII
                </p>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Bug className="h-4 w-4 text-yellow-600" />
                  Segurança
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  IP, Phishing, Vulnerabilidades e Vírus
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4 text-green-600" />
                  OSINT Avançado
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">
                  Subdomínios, WHOIS, LinkedIn e mais
                </p>
              </CardContent>
            </Card>
          </div>
          
          <OSINTInterface />
        </div>
      </div>
      
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        <p>CavernaSPY &copy; {new Date().getFullYear()} - Ferramenta de investigação digital com 23+ APIs OSINT</p>
      </footer>
    </div>
  );
};

export default OSINTTools;
