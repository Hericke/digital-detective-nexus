
import React, { useState } from 'react';
import { Search, ExternalLink, FileText, Users, Database, Shield, Globe, Zap, ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DorkLink {
  nome: string;
  url: string;
}

interface DorkCategory {
  category: string;
  icon: React.ReactNode;
  color: string;
  links: DorkLink[];
}

const AdvancedSearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<DorkCategory[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Dorks pré-cadastradas organizadas por categoria (expandidas com as novas)
  const getDorkCategories = (termo: string): DorkCategory[] => [
    {
      category: "Perfis e Redes Sociais",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600",
      links: [
        {
          nome: "LinkedIn",
          url: `https://www.google.com/search?q=site:linkedin.com/in+"${termo}"`
        },
        {
          nome: "Facebook", 
          url: `https://www.google.com/search?q=site:facebook.com+"${termo}"`
        },
        {
          nome: "Instagram",
          url: `https://www.google.com/search?q=site:instagram.com+"${termo}"`
        },
        {
          nome: "Twitter/X",
          url: `https://www.google.com/search?q=site:twitter.com+"${termo}"`
        }
      ]
    },
    {
      category: "Documentos Públicos",
      icon: <FileText className="h-5 w-5" />,
      color: "text-green-600",
      links: [
        {
          nome: "PDF com nome",
          url: `https://www.google.com/search?q="${termo}"+filetype:pdf`
        },
        {
          nome: "Currículo Word",
          url: `https://www.google.com/search?q="${termo}"+filetype:doc+OR+filetype:docx`
        },
        {
          nome: "Planilhas Excel",
          url: `https://www.google.com/search?q="${termo}"+filetype:xls+OR+filetype:xlsx`
        },
        {
          nome: "Apresentações PowerPoint",
          url: `https://www.google.com/search?q="${termo}"+filetype:ppt+OR+filetype:pptx`
        }
      ]
    },
    {
      category: "Vazamentos e Códigos",
      icon: <Database className="h-5 w-5" />,
      color: "text-red-600",
      links: [
        {
          nome: "Index de arquivos",
          url: `https://www.google.com/search?q=intitle:"index+of"+"${termo}"`
        },
        {
          nome: "Pastebin",
          url: `https://www.google.com/search?q=site:pastebin.com+"${termo}"`
        },
        {
          nome: "Dados vazados",
          url: `https://www.google.com/search?q="${termo}"+inurl:leak+OR+inurl:dump`
        },
        {
          nome: "Documentos de senhas",
          url: `https://www.google.com/search?q="${termo}"+senha+login+filetype:txt`
        },
        {
          nome: "GitHub",
          url: `https://www.google.com/search?q=site:github.com+"${termo}"`
        }
      ]
    },
    {
      category: "Sites Oficiais e Institucionais",
      icon: <Shield className="h-5 w-5" />,
      color: "text-purple-600",
      links: [
        {
          nome: "Justiça Brasileira",
          url: `https://www.google.com/search?q="${termo}"+site:jusbrasil.com.br`
        },
        {
          nome: "Sites do Governo",
          url: `https://www.google.com/search?q="${termo}"+site:.gov.br`
        },
        {
          nome: "Universidades",
          url: `https://www.google.com/search?q="${termo}"+site:.edu.br`
        },
        {
          nome: "Órgãos Públicos",
          url: `https://www.google.com/search?q="${termo}"+site:.org.br`
        }
      ]
    },
    {
      category: "Busca Avançada Customizada",
      icon: <Zap className="h-5 w-5" />,
      color: "text-orange-600",
      links: [
        {
          nome: "Cadastro com CPF",
          url: `https://www.google.com/search?q="${termo}"+cadastro+CPF`
        },
        {
          nome: "Banco de dados exposto",
          url: `https://www.google.com/search?q="${termo}"+inurl:php?id=`
        },
        {
          nome: "Download de currículo",
          url: `https://www.google.com/search?q="${termo}"+currículo+download`
        },
        {
          nome: "Contatos e telefones",
          url: `https://www.google.com/search?q="${termo}"+telefone+contato`
        },
        {
          nome: "Endereços e localização",
          url: `https://www.google.com/search?q="${termo}"+endereço+CEP`
        }
      ]
    },
    {
      category: "Mídia e Conteúdo",
      icon: <Globe className="h-5 w-5" />,
      color: "text-indigo-600",
      links: [
        {
          nome: "YouTube",
          url: `https://www.google.com/search?q=site:youtube.com+"${termo}"`
        },
        {
          nome: "Vimeo",
          url: `https://www.google.com/search?q=site:vimeo.com+"${termo}"`
        },
        {
          nome: "Notícias",
          url: `https://www.google.com/search?q="${termo}"+site:g1.com.br+OR+site:uol.com.br+OR+site:folha.com.br`
        },
        {
          nome: "Blogs e artigos",
          url: `https://www.google.com/search?q="${termo}"+inurl:blog+OR+inurl:artigo`
        }
      ]
    },
    {
      category: "Senhas em Arquivos de Texto",
      icon: <FileText className="h-5 w-5" />,
      color: "text-red-700",
      links: [
        {
          nome: "Senhas em TXT",
          url: `https://www.google.com/search?q=intext:"senha"+filetype:txt+"${termo}"`
        },
        {
          nome: "Passwords em TXT",
          url: `https://www.google.com/search?q=intext:"password"+filetype:txt+"${termo}"`
        },
        {
          nome: "Senhas e usuários",
          url: `https://www.google.com/search?q="senha+${termo}"+filetype:txt`
        },
        {
          nome: "Login e senha Excel",
          url: `https://www.google.com/search?q="usuario+${termo}+senha"+filetype:xls+OR+filetype:xlsx`
        }
      ]
    },
    {
      category: "Câmeras IP Abertas",
      icon: <Database className="h-5 w-5" />,
      color: "text-cyan-600",
      links: [
        {
          nome: "View.shtml cameras",
          url: `https://www.google.com/search?q=inurl:"/view.shtml"+"${termo}"`
        },
        {
          nome: "AXIS Live View",
          url: `https://www.google.com/search?q=intitle:"Live+View+-+AXIS"+"${termo}"`
        },
        {
          nome: "Axis CGI cameras",
          url: `https://www.google.com/search?q=inurl:/axis-cgi/jpg+image.cgi+"${termo}"`
        },
        {
          nome: "ViewerFrame cameras",
          url: `https://www.google.com/search?q=inurl:ViewerFrame?Mode="+"${termo}"`
        }
      ]
    },
    {
      category: "Documentos Confidenciais",
      icon: <Shield className="h-5 w-5" />,
      color: "text-amber-600",
      links: [
        {
          nome: "PDF Confidencial",
          url: `https://www.google.com/search?q=filetype:pdf+confidential+"${termo}"`
        },
        {
          nome: "Excel Governo",
          url: `https://www.google.com/search?q=filetype:xls+site:gov.br+"${termo}"`
        },
        {
          nome: "Word Governo",
          url: `https://www.google.com/search?q=filetype:doc+site:gov.br+"${termo}"`
        },
        {
          nome: "Diretórios confidenciais",
          url: `https://www.google.com/search?q=intitle:"Index+of"+"parent+directory"+"confidential"+"${termo}"`
        }
      ]
    },
    {
      category: "Emails e Contatos",
      icon: <Users className="h-5 w-5" />,
      color: "text-pink-600",
      links: [
        {
          nome: "Gmail no Pastebin",
          url: `https://www.google.com/search?q="@gmail.com"+site:pastebin.com+"${termo}"`
        },
        {
          nome: "Gmail em planilhas",
          url: `https://www.google.com/search?q="email+${termo}+@gmail.com"+filetype:xls`
        },
        {
          nome: "Outlook em TXT",
          url: `https://www.google.com/search?q=filetype:txt+intext:@outlook.com+"${termo}"`
        },
        {
          nome: "Contatos em CSV",
          url: `https://www.google.com/search?q="contato+${termo}"+filetype:xls+OR+filetype:csv`
        }
      ]
    },
    {
      category: "Bancos de Dados Expostos",
      icon: <Database className="h-5 w-5" />,
      color: "text-red-800",
      links: [
        {
          nome: "Arquivos db.sql",
          url: `https://www.google.com/search?q=intitle:"index+of"+"db.sql"+"${termo}"`
        },
        {
          nome: "Backup SQL",
          url: `https://www.google.com/search?q=intitle:"index+of"+"backup.sql"+"${termo}"`
        },
        {
          nome: "Insert SQL",
          url: `https://www.google.com/search?q=filetype:sql+"insert+into"+"${termo}"`
        },
        {
          nome: "Dump SQL",
          url: `https://www.google.com/search?q="dump.sql"+ext:sql+"${termo}"`
        }
      ]
    },
    {
      category: "Usuários e Senhas Expostos",
      icon: <Shield className="h-5 w-5" />,
      color: "text-rose-600",
      links: [
        {
          nome: "Arquivos .htpasswd",
          url: `https://www.google.com/search?q=intitle:"Index+of"+.htpasswd+"${termo}"`
        },
        {
          nome: "Logs de login",
          url: `https://www.google.com/search?q=filetype:log+intext:login+"${termo}"`
        },
        {
          nome: "Login e password logs",
          url: `https://www.google.com/search?q="login:"++"password:"+filetype:log+"${termo}"`
        },
        {
          nome: "User password TXT",
          url: `https://www.google.com/search?q="user+${termo}+password"+filetype:txt`
        }
      ]
    }
  ];

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, insira um termo para pesquisar.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    // Simular processamento
    setTimeout(() => {
      const dorkCategories = getDorkCategories(searchTerm.trim());
      setResults(dorkCategories);
      setIsSearching(false);
      
      toast({
        title: "Busca concluída",
        description: `Geradas ${dorkCategories.reduce((total, cat) => total + cat.links.length, 0)} buscas especializadas para "${searchTerm}".`,
      });
    }, 1000);
  };

  const handleNewSearch = () => {
    setSearchTerm('');
    setResults([]);
  };

  const handleLinkClick = (url: string, nome: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    console.log(`Abrindo busca: ${nome} - URL: ${url}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Navigation buttons */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            
            {results.length > 0 && (
              <Button
                variant="outline"
                onClick={handleNewSearch}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Nova Pesquisa
              </Button>
            )}
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
              <Search className="size-8" />
              Busca Profunda Automatizada
            </h1>
            <p className="text-muted-foreground text-lg">
              Investigação automática na internet com buscas especializadas pré-configuradas
            </p>
          </div>

          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">Digite o termo para investigar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-2">
                <Input
                  className="h-12 text-lg"
                  placeholder="Ex: João Silva, empresa@email.com, 11999999999, Nome da Empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  className="h-12 px-8 bg-primary hover:bg-primary/90"
                  onClick={handleSearch}
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Search className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p><strong>💡 Dica:</strong> Funciona com nomes completos, emails, telefones, CNPJs, empresas ou qualquer termo de interesse.</p>
              </div>
            </CardContent>
          </Card>

          {results.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                  🔎 Resultados para "{searchTerm}"
                </h2>
                <Badge variant="outline" className="text-lg py-1">
                  {results.reduce((total, cat) => total + cat.links.length, 0)} buscas especializadas geradas
                </Badge>
              </div>

              <Accordion type="multiple" className="w-full" defaultValue={["item-0", "item-1"]}>
                {results.map((category, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3">
                        <div className={category.color}>
                          {category.icon}
                        </div>
                        <span className="text-lg font-semibold">{category.category}</span>
                        <Badge variant="secondary">
                          {category.links.length} buscas
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {category.links.map((link, linkIndex) => (
                          <Button
                            key={linkIndex}
                            variant="outline"
                            className="h-auto py-3 px-4 flex items-center justify-between bg-muted/30 hover:bg-muted"
                            onClick={() => handleLinkClick(link.url, link.nome)}
                          >
                            <span className="text-left flex-1">{link.nome}</span>
                            <ExternalLink className="h-4 w-4 ml-2 text-muted-foreground" />
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-8 bg-muted/30 rounded-lg p-4 border border-muted">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1 text-foreground">Uso Responsável</p>
                    <p>
                      Esta ferramenta gera buscas automatizadas em dados públicos disponíveis na internet. 
                      Use as informações obtidas de forma ética e de acordo com as leis aplicáveis. 
                      O uso indevido para assédio, perseguição ou atividades ilícitas é estritamente proibido.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchPage;
