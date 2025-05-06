
import React, { useState } from 'react';
import { Search, Loader2, Clock, Database, Info, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
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
        description: "Por favor, insira um nome para pesquisar.",
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
          description: "Nenhuma informação encontrada para este nome.",
        });
      } else {
        toast({
          title: "Pesquisa concluída",
          description: `Encontrados ${results.profiles.length} perfis em diferentes plataformas.`,
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
    <Card className="w-full max-w-4xl mx-auto border-2 border-border shadow-lg bg-gradient-to-br from-card to-background">
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold cyber-text bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Investigação Digital</h2>
          <p className="text-muted-foreground">
            Pesquise informações públicas de pessoas em mais de 40 plataformas digitais
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <Input
                className="search-input h-12 pl-10 pr-4 text-lg bg-muted/70"
                placeholder="Digite o nome da pessoa..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            </div>
            <Button 
              className="h-12 px-6 bg-primary hover:bg-primary/90"
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Pesquisando...
                </>
              ) : (
                "Pesquisar"
              )}
            </Button>
            <Button 
              className="h-12 px-6 bg-secondary hover:bg-secondary/90"
              onClick={handleNewSearch}
              disabled={isSearching}
            >
              Nova Pesquisa
            </Button>
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
                <Clock className="w-3 h-3" />
                <span>Acesse o histórico quando não houver resultados ativos</span>
              </div>
              <div className="flex items-center gap-1">
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
