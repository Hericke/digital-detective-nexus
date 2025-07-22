
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="hero-container text-center space-y-8 mb-12 p-8 rounded-2xl border border-primary/20">
      <div className="flex items-center justify-center mb-8">
        <img 
          src="/lovable-uploads/8b79dcd0-43c0-4522-bcb3-fdd451d1a3d5.png"
          alt="CavernaSPY"
          className="h-24 w-24 mr-6 logo-pulse rounded-full border-2 border-primary/30"
        />
        <div className="text-left">
          <h1 className="text-5xl md:text-6xl font-bold cyber-text mb-2">
            CavernaSPY
          </h1>
          <p className="text-lg text-muted-foreground">
            Investigação Digital Avançada
          </p>
        </div>
      </div>
      
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        Plataforma completa de OSINT (Open Source Intelligence) para análise profissional de dados públicos e investigação digital.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8">
        <Link to="/advanced-search">
          <Button size="lg" className="enhanced-button px-10 py-4 text-lg font-semibold shadow-lg">
            🔍 Iniciar Investigação
          </Button>
        </Link>
        <Link to="/osint-tools">
          <Button size="lg" variant="outline" className="cyber-border px-10 py-4 text-lg hover:bg-primary/10">
            🛠️ Ferramentas OSINT
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
        <div className="text-center p-4 rounded-lg bg-muted/20 border border-primary/10">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="font-semibold mb-2">Busca Precisa</h3>
          <p className="text-sm text-muted-foreground">Encontre informações específicas em múltiplas fontes</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/20 border border-primary/10">
          <div className="text-3xl mb-2">🛡️</div>
          <h3 className="font-semibold mb-2">Dados Seguros</h3>
          <p className="text-sm text-muted-foreground">Informações públicas coletadas de forma ética</p>
        </div>
        <div className="text-center p-4 rounded-lg bg-muted/20 border border-primary/10">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="font-semibold mb-2">Relatórios Detalhados</h3>
          <p className="text-sm text-muted-foreground">Análises completas e exportação profissional</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
