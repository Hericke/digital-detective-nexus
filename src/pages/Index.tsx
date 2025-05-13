
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import SearchInterface from '@/components/SearchInterface';
import ResultsDisplay from '@/components/ResultsDisplay';
import ProfileCard from '@/components/ProfileCard';
import SearchHistory from '@/components/SearchHistory';
import AuthForm from '@/components/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { getSearchById, type ProfileInfo } from '@/services/searchService';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const [searchResults, setSearchResults] = useState<ProfileInfo[]>([]);
  const [searchId, setSearchId] = useState<string | undefined>(undefined);
  const [showAuthForm, setShowAuthForm] = useState(false);
  
  useEffect(() => {
    // Esconder o formulário de autenticação se o usuário estiver logado
    if (user) {
      setShowAuthForm(false);
    }
  }, [user]);

  const handleSearchResults = (results: ProfileInfo[], newSearchId?: string) => {
    setSearchResults(results);
    if (newSearchId) {
      setSearchId(newSearchId);
    }
    
    // Rolar para os resultados quando disponíveis
    if (results.length > 0) {
      setTimeout(() => {
        window.scrollTo({
          top: 300,
          behavior: 'smooth'
        });
      }, 100);
    }
  };

  const handleNewSearch = () => {
    setSearchResults([]);
    setSearchId(undefined);
  };

  const handleSelectSearch = async (id: string) => {
    try {
      const result = await getSearchById(id);
      if (result.error) {
        console.error(result.error);
        return;
      }
      
      setSearchResults(result.profiles);
      setSearchId(id);
      
      // Rolar para os resultados
      setTimeout(() => {
        window.scrollTo({
          top: 300,
          behavior: 'smooth'
        });
      }, 100);
    } catch (error) {
      console.error("Erro ao carregar pesquisa:", error);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {showAuthForm ? (
          <AuthForm onSuccess={handleAuthSuccess} />
        ) : (
          <>
            <SearchInterface 
              onSearchResults={handleSearchResults} 
              onNewSearch={handleNewSearch} 
            />
            
            {user && !searchResults.length && (
              <SearchHistory onSelectSearch={handleSelectSearch} />
            )}
            
            {searchResults.length > 0 && (
              <>
                <ProfileCard profiles={searchResults} />
                <ResultsDisplay results={searchResults} />
              </>
            )}
          </>
        )}
      </div>
      
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        <p>Digital Detective Nexus &copy; {new Date().getFullYear()} - Ferramenta de investigação digital</p>
      </footer>
    </div>
  );
};

export default Index;
