
import React, { useState } from 'react';
import { Search, Loader2, Clock, Database } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { platforms, searchByName } from '@/services/searchService';
import type { ProfileInfo, SearchResult } from '@/services/searchService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

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
    // Convert first letter to uppercase and use the rest as is
    const formattedIconName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    // Access the icon from LucideIcons object
    const IconComponent = (LucideIcons as any)[formattedIconName] || LucideIcons.Search;
    return IconComponent;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-2 border-border shadow-lg">
      <CardContent className="p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-primary">Investigação Digital</h2>
          <p className="text-muted-foreground">
            Pesquise informações públicas de pessoas em várias plataformas digitais
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <Input
                className="search-input h-12 pl-10 pr-4 text-lg"
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {platforms.map((platform) => {
              const IconComponent = getIconComponent(platform.icon);
              return (
                <div 
                  key={platform.id}
                  className="flex items-center gap-2 bg-muted/50 p-2 rounded-md text-sm"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <IconComponent size={16} className="platform-icon" />
                  </div>
                  <span>{platform.name}</span>
                </div>
              );
            })}
          </div>

          {user && (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-2">
              <Database className="w-3 h-3" />
              <span>Suas pesquisas são salvas automaticamente</span>
              <Clock className="w-3 h-3 ml-2" />
              <span>Acesse o histórico quando não houver resultados ativos</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchInterface;
