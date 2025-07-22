
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2, Database, Info, ExternalLink, FileText, MapPin, Camera, Youtube, Shield, Zap, LogIn } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { platformCategories, searchByName } from '@/services/searchService';
import type { ProfileInfo, SearchResult } from '@/services/searchService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SearchInterfaceProps {
  onSearchResults: (results: ProfileInfo[], searchId?: string) => void;
  onNewSearch: () => void;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ onSearchResults, onNewSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira um nome, email, telefone ou endereço para pesquisar.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const results: SearchResult = await searchByName(searchInput);
      
      if (results.error) {
        toast({
          title: "Erro na pesquisa",
          description: results.error,
          variant: "destructive"
        });
      } else if (results.profiles.length === 0) {
        toast({
          title: "Sem resultados",
          description: "Nenhuma informação encontrada para este termo de busca.",
        });
      } else {
        toast({
          title: "Pesquisa concluída",
          description: `Encontrados ${results.profiles.length} resultados.`,
        });
        onSearchResults(results.profiles, results.searchId);
      }
    } catch (error) {
      toast({
        title: "Erro na pesquisa",
        description: "Ocorreu um erro ao processar sua consulta.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleNewSearch = () => {
    setSearchInput('');
    onNewSearch();
  };

  // Helper function to get icon component by name
  const getIconComponent = (iconName: string) => {
    const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    const IconComponent = (LucideIcons as any)[formattedIconName] || LucideIcons.Search;
    return IconComponent;
  };

  // Function to open platform URL
  const handlePlatformClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="w-full max-w-5xl mx-auto border-2 border-primary/20 shadow-xl bg-gradient-to-br from-card/90 to-background/90 backdrop-blur-sm">
      <CardContent className="p-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/lovable-uploads/8b79dcd0-43c0-4522-bcb3-fdd451d1a3d5.png"
              alt="CavernaSPY"
              className="h-20 w-20 mr-4 logo-pulse rounded-full border-2 border-primary/30"
            />
            <div className="text-left">
              <h2 className="text-4xl font-bold cyber-text mb-1">CavernaSPY</h2>
              <p className="text-lg text-muted-foreground">Centro de Investigação</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pesquise informações públicas em diversas fontes online com tecnologia avançada
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-muted/30 p-6 rounded-xl border border-primary/10">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  className="search-input h-14 pl-12 pr-4 text-lg rounded-xl"
                  placeholder="Digite um nome, email, telefone ou endereço..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-6 h-6" />
              </div>
              <div className="flex gap-3">
                <Button 
                  className="enhanced-button h-14 px-8 text-lg font-semibold rounded-xl"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Pesquisando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Pesquisar
                    </>
                  )}
                </Button>
                <Button 
                  className="h-14 px-8 text-lg rounded-xl"
                  variant="outline"
                  onClick={handleNewSearch}
                  disabled={isSearching}
                >
                  Nova Pesquisa
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl border border-primary/20">
              <h3 className="text-lg font-semibold text-center mb-6 cyber-text">
                🚀 Ferramentas Rápidas
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <Link to="/report" className="block group">
                  <Button variant="outline" className="cyber-border w-full h-20 flex flex-col items-center justify-center gap-2 p-3 hover:bg-primary/10 transition-all group-hover:scale-105">
                    <FileText className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Relatório</span>
                  </Button>
                </Link>
                <Link to="/google-map" className="block group">
                  <Button variant="outline" className="cyber-border w-full h-20 flex flex-col items-center justify-center gap-2 p-3 hover:bg-primary/10 transition-all group-hover:scale-105">
                    <MapPin className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Mapa Google</span>
                  </Button>
                </Link>
                <Link to="/image-analysis" className="block group">
                  <Button variant="outline" className="cyber-border w-full h-20 flex flex-col items-center justify-center gap-2 p-3 hover:bg-primary/10 transition-all group-hover:scale-105">
                    <Camera className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Análise Imagem</span>
                  </Button>
                </Link>
                <Link to="/youtube-search" className="block group">
                  <Button variant="outline" className="cyber-border w-full h-20 flex flex-col items-center justify-center gap-2 p-3 hover:bg-primary/10 transition-all group-hover:scale-105">
                    <Youtube className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">YouTube OSINT</span>
                  </Button>
                </Link>
                <Link to="/osint-tools" className="block group">
                  <Button variant="outline" className="cyber-border w-full h-20 flex flex-col items-center justify-center gap-2 p-3 hover:bg-primary/10 transition-all group-hover:scale-105">
                    <Shield className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">OSINT Tools</span>
                  </Button>
                </Link>
                <Link to="/advanced-search" className="block group">
                  <Button variant="outline" className="cyber-border w-full h-20 flex flex-col items-center justify-center gap-2 p-3 bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/50 hover:bg-primary/30 transition-all group-hover:scale-105">
                    <Zap className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">Busca Profunda</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="item-0"
          >
            {platformCategories.map((category, categoryIndex) => (
              <AccordionItem key={categoryIndex} value={`item-${categoryIndex}`}>
                <AccordionTrigger className="text-primary hover:text-primary/80">
                  {category.name} ({category.platforms.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-2">
                    {category.platforms.map((platform, platformIndex) => {
                      const IconComponent = getIconComponent(platform.icon);
                      return (
                        <Button 
                          key={platformIndex}
                          variant="outline"
                          className="flex items-center justify-start gap-2 h-auto py-2 bg-muted/30 hover:bg-muted text-left"
                          onClick={() => handlePlatformClick(platform.url)}
                        >
                          <IconComponent size={16} className="text-primary flex-shrink-0" />
                          <span className="truncate flex-1">{platform.name}</span>
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {user && (
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-1">
                <Database className="w-3 h-3" />
                <span>Pesquisas salvas automaticamente</span>
              </div>
              <div className="hidden md:flex items-center gap-1">
                <Info className="w-3 h-3" />
                <span>Informações públicas apenas</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchInterface;
