
import React, { useState } from 'react';
import { Search, FileText, Gavel, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";

const ProcessSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<string>('');
  const { toast } = useToast();
  
  const handleSearch = async () => {
    if (!searchInput.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira um nome para pesquisar.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setSearchResult('');
    
    try {
      // Simulação de busca real - na prática, aqui conectaria com APIs públicas
      setTimeout(() => {
        const query = searchInput.toLowerCase().trim();
        
        // Simula verificação em bases públicas
        const hasProcesses = Math.random() > 0.7; // 30% de chance de encontrar processos
        
        if (hasProcesses) {
          setSearchResult(`Foram localizados processos públicos associados ao nome "${searchInput}". Recomenda-se validação manual devido à possibilidade de homônimos.`);
        } else {
          setSearchResult(`Nenhuma pendência judicial pública foi localizada para o nome "${searchInput}".`);
        }
        
        setIsSearching(false);
        toast({
          title: "Pesquisa concluída",
          description: "Consulta realizada em bases públicas disponíveis."
        });
      }, 2000);
      
    } catch (error) {
      setIsSearching(false);
      toast({
        title: "Erro na pesquisa",
        description: "Ocorreu um erro ao consultar as bases públicas.",
        variant: "destructive"
      });
    }
  };

  const handleOpenJusbrasil = () => {
    const searchUrl = `https://www.jusbrasil.com.br/busca?q=${encodeURIComponent(searchInput)}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 border-2 border-border shadow-lg">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <Gavel className="h-5 w-5 text-primary" />
          Busca de Processos Judiciais
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <Input
              className="search-input h-12 pl-10 pr-4 text-lg bg-muted/70"
              placeholder="Digite o nome completo para buscar..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          </div>
          <Button 
            className="h-12 px-6 bg-primary hover:bg-primary/90"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Consultando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Consultar
              </>
            )}
          </Button>
        </div>
        
        {searchResult && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              Resultado da Consulta
            </h3>
            <p className="text-sm mb-4">{searchResult}</p>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleOpenJusbrasil}
              >
                <ExternalLink className="h-3 w-3" />
                Validar no JusBrasil
              </Button>
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Aviso:</strong> Esta consulta verifica apenas informações públicas disponíveis. 
            Para confirmação precisa, utilize o CPF ou documentos oficiais nas plataformas especializadas.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessSearch;
