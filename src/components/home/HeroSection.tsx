
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="hero-container text-center space-y-12 p-12 rounded-3xl border border-primary/20 bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
        <img 
          src="/lovable-uploads/8b79dcd0-43c0-4522-bcb3-fdd451d1a3d5.png"
          alt="CavernaSPY"
          className="h-32 w-32 logo-pulse rounded-full border-4 border-primary/30 shadow-2xl shadow-primary/20"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-6xl md:text-7xl font-black cyber-text mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            CavernaSPY
          </h1>
          <p className="text-2xl font-medium text-muted-foreground">
            Investigação Digital Avançada
          </p>
        </div>
      </div>
      
      <p className="text-xl font-medium text-muted-foreground max-w-4xl mx-auto leading-relaxed">
        Plataforma completa de OSINT (Open Source Intelligence) para análise profissional de dados públicos e investigação digital.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
        <Link to="/advanced-search">
          <Button size="lg" className="enhanced-button min-w-[200px] text-lg font-bold">
            🔍 Iniciar Investigação
          </Button>
        </Link>
        <Link to="/osint-tools">
          <Button size="lg" variant="outline" className="cyber-border min-w-[200px] text-lg font-semibold">
            🛠️ Ferramentas OSINT
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🎯</div>
          <h3 className="text-xl font-bold mb-3 text-foreground">Busca Precisa</h3>
          <p className="text-base text-muted-foreground leading-relaxed">Encontre informações específicas em múltiplas fontes</p>
        </div>
        <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">🛡️</div>
          <h3 className="text-xl font-bold mb-3 text-foreground">Dados Seguros</h3>
          <p className="text-base text-muted-foreground leading-relaxed">Informações públicas coletadas de forma ética</p>
        </div>
        <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 group">
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
          <h3 className="text-xl font-bold mb-3 text-foreground">Relatórios Detalhados</h3>
          <p className="text-base text-muted-foreground leading-relaxed">Análises completas e exportação profissional</p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
