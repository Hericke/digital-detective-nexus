
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/home/HeroSection';
import QuickActions from '@/components/home/QuickActions';
import SearchStatusInfo from '@/components/home/SearchStatusInfo';
import SearchSection from '@/components/home/SearchSection';
import ResultsSection from '@/components/home/ResultsSection';
import { useAuth } from '@/contexts/AuthContext';
import { getSearchById, type ProfileInfo } from '@/services/searchService';

const Index = () => {
  const { loading: authLoading } = useAuth();
  const [searchResults, setSearchResults] = useState<ProfileInfo[]>([]);
  const [searchId, setSearchId] = useState<string | undefined>(undefined);
  
  console.log('Index: Renderizando página principal', { authLoading, searchResults: searchResults.length });
  
  const handleSearchResults = (results: ProfileInfo[], newSearchId?: string) => {
    console.log('Index: Novos resultados de pesquisa recebidos', { results: results.length, newSearchId });
    setSearchResults(results);
    if (newSearchId) {
      setSearchId(newSearchId);
    }
    
    // Rolar para os resultados quando disponíveis
    if (results.length > 0) {
      setTimeout(() => {
        const resultsElement = document.getElementById('search-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleNewSearch = () => {
    console.log('Index: Nova pesquisa iniciada');
    setSearchResults([]);
    setSearchId(undefined);
  };

  const handleSelectSearch = async (id: string) => {
    try {
      console.log('Index: Selecionando pesquisa', id);
      const result = await getSearchById(id);
      if (result.error) {
        console.error('Index: Erro ao carregar pesquisa:', result.error);
        return;
      }
      
      setSearchResults(result.profiles);
      setSearchId(id);
      
      // Rolar para os resultados
      setTimeout(() => {
        const resultsElement = document.getElementById('search-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error("Index: Erro ao carregar pesquisa:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando aplicação...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 space-y-12">
        <HeroSection />
        <QuickActions />
        <SearchStatusInfo />
        
        <SearchSection
          onSearchResults={handleSearchResults}
          onNewSearch={handleNewSearch}
          onSelectSearch={handleSelectSearch}
        />
        
        <div id="search-results">
          <ResultsSection searchResults={searchResults} />
        </div>
      </main>
      
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground bg-card">
        <div className="container mx-auto px-4">
          <p>CavernaSPY &copy; {new Date().getFullYear()} - Ferramenta de investigação digital</p>
          <p className="text-xs mt-1">Desenvolvido para análise de informações públicas disponíveis na internet</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
