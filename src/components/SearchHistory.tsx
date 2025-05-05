
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSearchHistory } from '@/services/searchService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SearchHistoryProps {
  onSelectSearch: (id: string) => void;
}

interface HistoryItem {
  id: string;
  query: string;
  created_at: string;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ onSelectSearch }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await getSearchHistory();
        setHistory(data);
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8 mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Pesquisas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Carregando histórico...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8 mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Pesquisas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Nenhuma pesquisa realizada ainda.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Histórico de Pesquisas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-muted/30 rounded-md p-3">
              <div className="flex items-center gap-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{item.query}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(item.created_at), "PPp", { locale: ptBR })}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onSelectSearch(item.id)}
              >
                Ver resultados
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchHistory;
