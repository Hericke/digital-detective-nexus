
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <div className="text-center space-y-6 mb-12">
      <div className="flex items-center justify-center mb-6">
        <img 
          src="/lovable-uploads/8b79dcd0-43c0-4522-bcb3-fdd451d1a3d5.png"
          alt="CavernaSPY"
          className="h-20 w-20 mr-4"
        />
        <h1 className="text-4xl md:text-5xl font-bold cyber-text bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          CavernaSPY
        </h1>
      </div>
      
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Plataforma avançada de investigação digital (OSINT) para análise de dados públicos
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link to="/ai-chat">
          <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
            <MessageSquare className="mr-2 h-5 w-5" />
            Assistente OSINT
          </Button>
        </Link>
        <Link to="/advanced-search">
          <Button size="lg" variant="outline" className="cyber-border px-8">
            Busca Profunda
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
