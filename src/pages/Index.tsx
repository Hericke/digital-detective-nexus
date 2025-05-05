
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import SearchInterface from '@/components/SearchInterface';
import ResultsDisplay from '@/components/ResultsDisplay';
import ProfileCard from '@/components/ProfileCard';
import type { ProfileInfo } from '@/services/searchService';

const Index = () => {
  const [searchResults, setSearchResults] = useState<ProfileInfo[]>([]);
  
  const handleSearchResults = (results: ProfileInfo[]) => {
    setSearchResults(results);
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <SearchInterface onSearchResults={handleSearchResults} />
        
        {searchResults.length > 0 && (
          <>
            <ProfileCard profiles={searchResults} />
            <ResultsDisplay results={searchResults} />
          </>
        )}
      </div>
      
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        <p>Digital Detective Nexus &copy; {new Date().getFullYear()} - Apenas demonstrativo</p>
      </footer>
    </div>
  );
};

export default Index;
