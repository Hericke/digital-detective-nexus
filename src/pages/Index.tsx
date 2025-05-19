
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import SearchInterface from '@/components/SearchInterface';
import ResultsDisplay from '@/components/ResultsDisplay';
import ProfileCard from '@/components/ProfileCard';
import SearchHistory from '@/components/SearchHistory';
import ProcessSearch from '@/components/ProcessSearch';
import LocationMap from '@/components/LocationMap';
import { useAuth } from '@/contexts/AuthContext';
import { getSearchById, type ProfileInfo } from '@/services/searchService';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { loading: authLoading } = useAuth();
  const [searchResults, setSearchResults] = useState<ProfileInfo[]>([]);
  const [searchId, setSearchId] = useState<string | undefined>(undefined);
  
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        {authLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold cyber-text">CavernaSPY</h1>
              <Link to="/ai-chat">
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="size-4" />
                  Assistente OSINT
                </Button>
              </Link>
            </div>
            
            <SearchInterface 
              onSearchResults={handleSearchResults} 
              onNewSearch={handleNewSearch} 
            />
            
            <SearchHistory onSelectSearch={handleSelectSearch} />
            
            {searchResults.length > 0 && (
              <>
                <ProfileCard profiles={searchResults} />
                <ResultsDisplay results={searchResults} />
                <ProcessSearch />
                <LocationMap profiles={searchResults} />
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
