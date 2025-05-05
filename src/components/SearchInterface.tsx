
import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { platforms, searchByName } from '@/services/searchService';
import type { ProfileInfo, SearchResult } from '@/services/searchService';
import { useToast } from '@/components/ui/use-toast';

interface SearchInterfaceProps {
  onSearchResults: (results: ProfileInfo[]) => void;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ onSearchResults }) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

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
        onSearchResults(results.profiles);
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

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold cyber-text">Investigação Digital</h2>
        <p className="text-muted-foreground">
          Pesquise informações públicas de pessoas em várias plataformas digitais
        </p>
      </div>

      <div className="relative cyber-border rounded-lg p-6 bg-card/80">
        <div className="flex flex-col gap-4">
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
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {platforms.map((platform) => (
              <div 
                key={platform.id}
                className="flex items-center gap-2 bg-muted/50 p-2 rounded-md text-sm"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  {React.createElement(
                    // @ts-ignore - Lucide icons will be imported dynamically
                    require(`lucide-react`)[platform.icon.charAt(0).toUpperCase() + platform.icon.slice(1)],
                    { className: "platform-icon", size: 16 }
                  )}
                </div>
                <span>{platform.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;
