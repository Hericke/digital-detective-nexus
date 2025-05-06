
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/ProfileCard';
import ResultsDisplay from '@/components/ResultsDisplay';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSearchById, type ProfileInfo } from '@/services/searchService';

const SearchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchResults, setSearchResults] = useState<ProfileInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadSearch = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const result = await getSearchById(id);
        
        if (result.error) {
          setError(result.error);
          return;
        }
        
        setSearchResults(result.profiles);
      } catch (error) {
        setError("Erro ao carregar detalhes da pesquisa");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSearch();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <Link to="/">
            <Button 
              variant="ghost" 
              className="mb-6 pl-0 hover:pl-2 transition-all duration-200"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> 
              Voltar para pesquisa
            </Button>
          </Link>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Carregando resultados da pesquisa...</p>
              </div>
            </div>
          ) : error ? (
            <div className="h-64 flex items-center justify-center">
              <div className="bg-destructive/10 p-6 rounded-lg border border-destructive/20 text-center">
                <h3 className="text-xl font-medium mb-2">Erro ao carregar pesquisa</h3>
                <p className="text-muted-foreground">{error}</p>
                <Link to="/">
                  <Button className="mt-4">
                    Voltar para página inicial
                  </Button>
                </Link>
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <div className="bg-muted/50 p-6 rounded-lg border border-border text-center">
                <h3 className="text-xl font-medium mb-2">Nenhum resultado encontrado</h3>
                <p className="text-muted-foreground">Esta pesquisa não possui resultados ou foi excluída.</p>
                <Link to="/">
                  <Button className="mt-4">
                    Nova pesquisa
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-muted/30 border border-primary/20 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-medium mb-1">Detalhes da Pesquisa</h2>
                <p className="text-sm text-muted-foreground">
                  Visualizando resultados para a pessoa: <span className="font-medium text-foreground">{searchResults[0]?.name}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  ID da pesquisa: {id}
                </p>
              </div>
              
              <ProfileCard profiles={searchResults} />
              <ResultsDisplay results={searchResults} />
            </>
          )}
        </div>
      </div>
      
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        <p>Digital Detective Nexus &copy; {new Date().getFullYear()} - Ferramenta de investigação digital</p>
      </footer>
    </div>
  );
};

export default SearchDetails;
