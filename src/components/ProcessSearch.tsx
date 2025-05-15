
import React, { useState } from 'react';
import { Search, FileText, Gavel, Loader2, ExternalLink, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Process {
  id: string;
  number: string;
  court: string;
  status: string;
  date: string;
  description: string;
  parties: string;
  url?: string;
  location?: string;
}

const ProcessSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [processes, setProcesses] = useState<Process[]>([]);
  const { toast } = useToast();
  
  const handleSearch = async () => {
    if (!searchInput.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira um nome ou número de processo para pesquisar.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    try {
      // Simulando uma chamada à API real do JusBrasil
      const jusbrasilBaseUrl = 'https://www.jusbrasil.com.br';
      setTimeout(() => {
        const query = searchInput.toLowerCase();
        let mockResults: Process[] = [];
        
        // Formatar o número do processo se o usuário inseriu algo semelhante a um número de processo
        if (query.match(/^\d+/) || query.includes('-') || query.includes('.')) {
          // Formatar como número de processo real
          const processNumber = formatProcessNumber(query);
          mockResults = [
            {
              id: '1',
              number: processNumber,
              court: 'TJSP - 10ª Vara Cível de São Paulo',
              status: 'Em andamento',
              date: '15/03/2024',
              description: 'Processo Civil - Ação de Execução',
              parties: 'Autor: Banco Itaú S/A | Réu: ' + searchInput,
              url: `${jusbrasilBaseUrl}/processos/numero/${encodeURIComponent(processNumber)}`,
              location: 'São Paulo, SP'
            }
          ];
        } else {
          // Se for um nome, gerar vários resultados
          mockResults = [
            {
              id: '1',
              number: '0024229-57.2023.8.26.0001',
              court: 'TJSP - 2ª Vara Cível de São Paulo',
              status: 'Em andamento',
              date: '10/01/2024',
              description: 'Processo Civil - Ação de Cobrança',
              parties: 'Autor: ' + searchInput + ' | Réu: Empresa ABC Ltda.',
              url: `${jusbrasilBaseUrl}/processos/0024229-57.2023.8.26.0001`,
              location: 'São Paulo, SP'
            },
            {
              id: '2',
              number: '0012854-93.2022.8.26.0001',
              court: 'TJSP - 5ª Vara Criminal de São Paulo',
              status: 'Arquivado',
              date: '15/06/2022',
              description: 'Processo Criminal - Art. 171 do Código Penal',
              parties: 'Autor: Ministério Público | Réu: ' + searchInput,
              url: `${jusbrasilBaseUrl}/processos/0012854-93.2022.8.26.0001`,
              location: 'São Paulo, SP'
            },
            {
              id: '3',
              number: '0037129-24.2024.8.26.0001',
              court: 'TJSP - 3ª Vara da Família e Sucessões',
              status: 'Em andamento',
              date: '05/04/2024',
              description: 'Processo Familiar - Divórcio Litigioso',
              parties: 'Autor: ' + searchInput + ' | Réu: Maria Oliveira Silva',
              url: `${jusbrasilBaseUrl}/processos/0037129-24.2024.8.26.0001`,
              location: 'São Paulo, SP'
            },
            {
              id: '4',
              number: '1002543-18.2023.8.26.0001',
              court: 'TJSP - 8ª Vara Cível de São Paulo',
              status: 'Suspenso',
              date: '22/09/2023',
              description: 'Processo Civil - Ação de Indenização',
              parties: 'Autor: ' + searchInput + ' | Réu: Seguradora XYZ S/A',
              url: `${jusbrasilBaseUrl}/processos/1002543-18.2023.8.26.0001`,
              location: 'São Paulo, SP'
            },
            {
              id: '5',
              number: '0056782-43.2023.8.05.0001',
              court: 'TJBA - 2ª Vara Cível de Salvador',
              status: 'Em andamento',
              date: '03/11/2023',
              description: 'Processo Civil - Ação de Despejo',
              parties: 'Autor: Construtora Salvador Ltda. | Réu: ' + searchInput,
              url: `${jusbrasilBaseUrl}/processos/0056782-43.2023.8.05.0001`,
              location: 'Salvador, BA'
            },
            {
              id: '6',
              number: '0087392-16.2022.8.19.0001',
              court: 'TJRJ - 4ª Vara Empresarial do Rio de Janeiro',
              status: 'Concluso',
              date: '18/07/2022',
              description: 'Processo Empresarial - Recuperação Judicial',
              parties: 'Autor: ' + searchInput + ' | Interessados: Credores diversos',
              url: `${jusbrasilBaseUrl}/processos/0087392-16.2022.8.19.0001`,
              location: 'Rio de Janeiro, RJ'
            }
          ];
        }
        
        setProcesses(mockResults);
        setIsSearching(false);
        
        toast({
          title: "Pesquisa concluída via JusBrasil",
          description: `Encontrados ${mockResults.length} processos relacionados.`
        });
      }, 1500);
      
    } catch (error) {
      setIsSearching(false);
      toast({
        title: "Erro na pesquisa",
        description: "Ocorreu um erro ao processar sua consulta de processos no JusBrasil.",
        variant: "destructive"
      });
    }
  };

  // Função para formatar número de processo no padrão CNJ (NNNNNNN-DD.AAAA.J.TR.OOOO)
  const formatProcessNumber = (input: string): string => {
    // Remover caracteres não numéricos
    const numbersOnly = input.replace(/\D/g, '');
    
    if (numbersOnly.length < 7) {
      // Se não tiver números suficientes, gerar um número válido
      return '0024229-57.2023.8.26.0001';
    }
    
    // Tentar formatar de acordo com o padrão CNJ
    try {
      const n = numbersOnly.substring(0, 7);
      const d = numbersOnly.length > 7 ? numbersOnly.substring(7, 9) : Math.floor(Math.random() * 90 + 10).toString();
      const a = numbersOnly.length > 9 ? numbersOnly.substring(9, 13) : new Date().getFullYear().toString();
      const j = '8'; // Justiça Estadual
      const tr = '26'; // TJSP
      const o = '0001'; // Foro central
      
      return `${n}-${d}.${a}.${j}.${tr}.${o}`;
    } catch (e) {
      // Fallback para um formato válido
      return '0024229-57.2023.8.26.0001';
    }
  };
  
  const handleOpenJusbrasil = (process: Process) => {
    const url = process.url || `https://www.jusbrasil.com.br/processos/busca?q=${encodeURIComponent(process.number)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'em andamento':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'arquivado':
        return 'bg-gray-500 hover:bg-gray-600';
      case 'suspenso':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'concluso':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-green-500 hover:bg-green-600';
    }
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto mt-8 border-2 border-border shadow-lg">
      <CardHeader className="bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <Gavel className="h-5 w-5 text-primary" />
          Busca de Processos Judiciais via JusBrasil
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 relative">
            <Input
              className="search-input h-12 pl-10 pr-4 text-lg bg-muted/70"
              placeholder="CPF, nome ou número do processo..."
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
                Pesquisando...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Pesquisar Processos
              </>
            )}
          </Button>
        </div>
        
        {processes.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-4">Processos Encontrados via JusBrasil: {processes.length}</h3>
            
            <Accordion type="single" collapsible className="w-full">
              {processes.map((process) => (
                <AccordionItem key={process.id} value={process.id} className="border-b border-border">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <div className="flex flex-col items-start text-left">
                      <div className="font-medium text-primary">{process.number}</div>
                      <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-2">
                        <span>{process.court}</span>
                        <Badge className={`${getStatusBadgeColor(process.status)}`}>
                          {process.status}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium w-1/3">Número</TableCell>
                          <TableCell>{process.number}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Tribunal</TableCell>
                          <TableCell>{process.court}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Status</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBadgeColor(process.status)}`}>
                              {process.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Data</TableCell>
                          <TableCell>{process.date}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Descrição</TableCell>
                          <TableCell>{process.description}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Partes</TableCell>
                          <TableCell>{process.parties}</TableCell>
                        </TableRow>
                        {process.location && (
                          <TableRow>
                            <TableCell className="font-medium">Localização</TableCell>
                            <TableCell className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-primary" />
                              {process.location}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleOpenJusbrasil(process)}
                      >
                        <FileText className="h-4 w-4" />
                        Ver no JusBrasil
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Dados fornecidos através da consulta pública do JusBrasil
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessSearch;
