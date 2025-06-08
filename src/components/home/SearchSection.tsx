
import React from 'react';
import SearchInterface from '@/components/SearchInterface';
import SearchHistory from '@/components/SearchHistory';
import type { ProfileInfo } from '@/services/searchService';

interface SearchSectionProps {
  onSearchResults: (results: ProfileInfo[], searchId?: string) => void;
  onNewSearch: () => void;
  onSelectSearch: (id: string) => Promise<void>;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  onSearchResults,
  onNewSearch,
  onSelectSearch
}) => {
  return (
    <div className="space-y-8">
      <div className="max-w-4xl mx-auto">
        <SearchInterface 
          onSearchResults={onSearchResults} 
          onNewSearch={onNewSearch} 
        />
      </div>
      
      <div className="max-w-6xl mx-auto">
        <SearchHistory onSelectSearch={onSelectSearch} />
      </div>
    </div>
  );
};

export default SearchSection;
