
import React from 'react';
import ProfileCard from '@/components/ProfileCard';
import ContactInfo from '@/components/ContactInfo';
import ResultsDisplay from '@/components/ResultsDisplay';
import ProcessSearch from '@/components/ProcessSearch';
import LocationMap from '@/components/LocationMap';
import type { ProfileInfo } from '@/services/searchService';

interface ResultsSectionProps {
  searchResults: ProfileInfo[];
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ searchResults }) => {
  if (searchResults.length === 0) return null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold cyber-text">
          Resultados da Investigação
        </h2>
        <p className="text-muted-foreground">
          {searchResults.length} perfil{searchResults.length > 1 ? 's' : ''} encontrado{searchResults.length > 1 ? 's' : ''}
        </p>
      </div>

      <ProfileCard profiles={searchResults} />
      <ContactInfo profiles={searchResults} />
      <ResultsDisplay results={searchResults} />
      <ProcessSearch />
      <LocationMap profiles={searchResults} />
    </div>
  );
};

export default ResultsSection;
