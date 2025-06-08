
import React from 'react';
import { Database, Clock, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const SearchStatusInfo: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground bg-muted/20 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2">
        <Database className="w-4 h-4 text-primary" />
        <span>Pesquisas salvas automaticamente</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" />
        <span>Histórico sempre disponível</span>
      </div>
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-primary" />
        <span>Apenas informações públicas</span>
      </div>
    </div>
  );
};

export default SearchStatusInfo;
