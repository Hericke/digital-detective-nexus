
import React, { useState } from 'react';
import { Search, FileText, Gavel, Loader2 } from 'lucide-react';
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

interface Process {
  id: string;
  number: string;
  court: string;
  status: string;
  date: string;
  description: string;
  parties: string;
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
      // Simulação de busca - em uma aplicação real, isso seria uma chamada para uma API
      setTimeout(() => {
        // Dados simulados
        const mockResults: Process[] = [
          {
            id: '1',
            number: '0001234-56.2023.8.26.0100',
            court: 'TJSP - 10ª Vara Cível',
            status: 'Em andamento',
            date: '10/01/2023',
            description: 'Processo Civil - Indenização por Danos Morais',
            parties: 'Autor: ' + searchInput + ' | Réu: Empresa XYZ Ltda.'
          },
          {
            id: '2',
            number: '0007654-32.2022.8.26.0100',
            court: 'TJSP - 5ª Vara Criminal',
            status: 'Arquivado',
            date: '15/06/2022',
            description: 'Processo Criminal - Art. 155 do Código Penal',
            parties: 'Autor: Ministério Público | Réu: ' + searchInput
          },
          {
            id: '3',
            number: '0003456-78.2024.8.26.0100',
            court: 'TJSP - 2ª Vara da Família',
            status: 'Em andamento',
            date: '05/03/2024',
            description: 'Processo Familiar - Ação de Alimentos',
            parties: 'Autor: ' + searchInput + ' | Réu: João da Silva'
          }
        ];
        
        setProcesses(mockResults);
        setIsSearching(false);
        
        toast({
          title: "Pesquisa concluída",
          description: `Encontrados ${mockResults.length} processos relacionados.`
        });
      }, 1500);
      
    } catch (error) {
      setIsSearching(false);
      toast({
        title: "Erro na pesquisa",
        description: "Ocorreu um erro ao processar sua consulta de processos.",
        variant: "destructive"
      });
    }
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
            <h3 className="font-semibold mb-4">Processos Encontrados: {processes.length}</h3>
            
            <Accordion type="single" collapsible className="w-full">
              {processes.map((process) => (
                <AccordionItem key={process.id} value={process.id} className="border-b border-border">
                  <AccordionTrigger className="py-4 hover:no-underline">
                    <div className="flex flex-col items-start text-left">
                      <div className="font-medium text-primary">{process.number}</div>
                      <div className="text-sm text-muted-foreground">{process.court} - {process.status}</div>
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
                          <TableCell>{process.status}</TableCell>
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
                      </TableBody>
                    </Table>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Visualizar Detalhes
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessSearch;
