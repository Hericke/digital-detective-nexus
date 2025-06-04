
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import OSINTInterface from '@/components/osint/OSINTInterface';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OSINTTools = () => {
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
              <h1 className="text-3xl font-bold cyber-text">Ferramentas OSINT</h1>
              <p className="text-muted-foreground">
                Validação de telefone, busca de emails e consulta de CNPJ
              </p>
            </div>
          </div>
          
          <OSINTInterface />
        </div>
      </div>
      
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        <p>CavernaSPY &copy; {new Date().getFullYear()} - Ferramenta de investigação digital</p>
      </footer>
    </div>
  );
};

export default OSINTTools;
