
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
  const [showAuthForm, setShowAuthForm] = useState(true);
  
  useEffect(() => {
    // Hide auth form if user is logged in
    if (user) {
      console.log("User is authenticated, hiding auth form");
      setShowAuthForm(false);
    } else {
      console.log("User is not authenticated, showing auth form");
      setShowAuthForm(true);
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
    console.log("Authentication successful");
    setShowAuthForm(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar onLoginClick={() => setShowAuthForm(true)} />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {authLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : showAuthForm || !user ? (
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
        <p>CavernaSPY &copy; {new Date().getFullYear()} - Ferramenta de investigação digital</p>
      </footer>
    </div>
  );
};

export default Index;
