
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, MapPin, Camera, Youtube, Shield, Zap } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      to: "/report",
      icon: FileText,
      label: "Relatório",
      description: "Gerar relatórios detalhados"
    },
    {
      to: "/google-map",
      icon: MapPin,
      label: "Mapa Google",
      description: "Análise geográfica"
    },
    {
      to: "/image-analysis",
      icon: Camera,
      label: "Análise Imagem",
      description: "Extrair metadados de imagens"
    },
    {
      to: "/youtube-search",
      icon: Youtube,
      label: "YouTube OSINT",
      description: "Investigação em vídeos"
    },
    {
      to: "/osint-tools",
      icon: Shield,
      label: "OSINT Tools",
      description: "Ferramentas especializadas"
    },
    {
      to: "/advanced-search",
      icon: Zap,
      label: "Busca Profunda",
      description: "Dorks automatizadas",
      highlight: true
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-6 text-center">Ferramentas Disponíveis</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Link key={index} to={action.to}>
              <Button 
                variant="outline" 
                className={`cyber-border w-full h-auto py-4 flex flex-col items-center gap-2 hover:bg-muted transition-colors ${
                  action.highlight ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30' : ''
                }`}
              >
                <IconComponent className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.label}</div>
                  <div className="text-xs text-muted-foreground hidden md:block">
                    {action.description}
                  </div>
                </div>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
