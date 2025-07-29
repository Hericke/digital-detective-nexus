
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
    <div className="w-full max-w-7xl mx-auto px-6 mb-12">
      <h2 className="text-3xl font-bold mb-8 text-center cyber-text">
        Ferramentas Disponíveis
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Link key={index} to={action.to} className="group">
              <Button 
                variant="outline" 
                className={`cyber-border w-full h-full min-h-[140px] flex flex-col items-center justify-center gap-4 p-6 hover:bg-muted/50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl ${
                  action.highlight ? 'bg-gradient-to-br from-primary/15 to-secondary/15 border-primary/50 shadow-xl shadow-primary/25' : 'shadow-lg'
                }`}
              >
                <IconComponent className={`h-10 w-10 ${action.highlight ? 'text-primary' : 'text-muted-foreground'} transition-all group-hover:scale-110 group-hover:text-primary`} />
                <div className="text-center space-y-2">
                  <div className="font-bold text-sm leading-tight">{action.label}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed px-1">
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
