import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Search, ExternalLink, Globe, Clock, User, FileText, TrendingUp, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { newsService, NewsSearchResponse, ExtractedNews, NewsLinks } from '@/services/osint/newsService';
import { cn } from '@/lib/utils';

export const NewsSearchInterface: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('search');
  const [isLoading, setIsLoading] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [language, setLanguage] = useState('pt');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [searchResults, setSearchResults] = useState<NewsSearchResponse | null>(null);
  
  // Extract state
  const [extractUrl, setExtractUrl] = useState('');
  const [extractedNews, setExtractedNews] = useState<ExtractedNews | null>(null);
  
  // Links state
  const [linksUrl, setLinksUrl] = useState('');
  const [newsLinks, setNewsLinks] = useState<NewsLinks | null>(null);
  
  // Trends state
  const [trendKeywords, setTrendKeywords] = useState('');
  const [trendsData, setTrendsData] = useState<Record<string, NewsSearchResponse> | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Digite um termo para pesquisar');
      return;
    }

    setIsLoading(true);
    try {
      const params: any = {
        text: searchQuery,
        language,
        number: 20
      };

      if (startDate) {
        params.earliest_publish_date = format(startDate, 'yyyy-MM-dd');
      }
      if (endDate) {
        params.latest_publish_date = format(endDate, 'yyyy-MM-dd');
      }

      const response = await newsService.searchNews(params);
      setSearchResults(response);
      toast.success(`Encontradas ${response.news?.length || 0} notícias`);
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      toast.error('Erro ao pesquisar notícias');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtract = async () => {
    if (!extractUrl.trim()) {
      toast.error('Digite uma URL para extrair');
      return;
    }

    setIsLoading(true);
    try {
      const response = await newsService.extractNews(extractUrl);
      setExtractedNews(response);
      toast.success('Notícia extraída com sucesso');
    } catch (error) {
      console.error('Erro na extração:', error);
      toast.error('Erro ao extrair notícia');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtractLinks = async () => {
    if (!linksUrl.trim()) {
      toast.error('Digite uma URL para extrair links');
      return;
    }

    setIsLoading(true);
    try {
      const response = await newsService.extractNewsLinks(linksUrl);
      setNewsLinks(response);
      toast.success(`Encontrados ${response.news_links.length} links de notícias`);
    } catch (error) {
      console.error('Erro na extração de links:', error);
      toast.error('Erro ao extrair links de notícias');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrendsAnalysis = async () => {
    if (!trendKeywords.trim()) {
      toast.error('Digite palavras-chave para análise');
      return;
    }

    setIsLoading(true);
    try {
      const keywords = trendKeywords.split(',').map(k => k.trim()).filter(k => k);
      const response = await newsService.analyzeNewsTrends(keywords, 'week');
      setTrendsData(response);
      toast.success('Análise de tendências concluída');
    } catch (error) {
      console.error('Erro na análise:', error);
      toast.error('Erro ao analisar tendências');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Globe className="h-5 w-5" />
            Pesquisa de Notícias - API League
          </CardTitle>
          <CardDescription>
            Busque, extraia e analise notícias de fontes globais em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="search" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Pesquisar
              </TabsTrigger>
              <TabsTrigger value="extract" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Extrair
              </TabsTrigger>
              <TabsTrigger value="links" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Links
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Tendências
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Input
                    placeholder="Digite o termo de pesquisa (ex: eleições, copa do mundo, tecnologia)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">Português</SelectItem>
                    <SelectItem value="en">Inglês</SelectItem>
                    <SelectItem value="es">Espanhol</SelectItem>
                    <SelectItem value="fr">Francês</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Data inicial"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Data final"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Button onClick={handleSearch} disabled={isLoading} className="w-full">
                  {isLoading ? <LoadingSpinner /> : <Search className="h-4 w-4 mr-2" />}
                  Pesquisar
                </Button>
              </div>

              {searchResults && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Resultados ({searchResults.news?.length || 0})</h3>
                    <Badge variant="secondary">
                      {searchResults.available} disponíveis
                    </Badge>
                  </div>
                  
                  <div className="grid gap-4 max-h-96 overflow-y-auto">
                    {searchResults.news?.map((article, index) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="font-semibold text-sm line-clamp-2">{article.title}</h4>
                              <Badge variant="outline" className="ml-2 shrink-0">
                                {article.language}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {article.summary || article.text}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(article.publish_date).toLocaleDateString('pt-BR')}
                              </div>
                              {article.authors && article.authors.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {article.authors[0]}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(article.url, '_blank')}
                              className="w-full"
                            >
                              <ExternalLink className="h-3 w-3 mr-2" />
                              Ler Matéria Completa
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="extract" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-3">
                  <Input
                    placeholder="Cole a URL da notícia para extrair o conteúdo completo"
                    value={extractUrl}
                    onChange={(e) => setExtractUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleExtract()}
                  />
                </div>
                <Button onClick={handleExtract} disabled={isLoading} className="w-full">
                  {isLoading ? <LoadingSpinner /> : <FileText className="h-4 w-4 mr-2" />}
                  Extrair
                </Button>
              </div>

              {extractedNews && (
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">{extractedNews.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(extractedNews.publish_date).toLocaleDateString('pt-BR')}
                        </div>
                        {extractedNews.author && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {extractedNews.author}
                          </div>
                        )}
                        <Badge variant="outline">{extractedNews.language}</Badge>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Resumo:</h4>
                          <p className="text-sm text-muted-foreground">{extractedNews.summary}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-2">Conteúdo Completo:</h4>
                          <Textarea
                            value={extractedNews.text}
                            readOnly
                            className="min-h-[200px] text-sm"
                          />
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => window.open(extractedNews.url, '_blank')}
                        className="w-full"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Ver Original
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="links" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-3">
                  <Input
                    placeholder="Digite a URL do site para extrair links de notícias (ex: https://g1.globo.com)"
                    value={linksUrl}
                    onChange={(e) => setLinksUrl(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleExtractLinks()}
                  />
                </div>
                <Button onClick={handleExtractLinks} disabled={isLoading} className="w-full">
                  {isLoading ? <LoadingSpinner /> : <LinkIcon className="h-4 w-4 mr-2" />}
                  Extrair Links
                </Button>
              </div>

              {newsLinks && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Links Encontrados</h3>
                    <Badge variant="secondary">
                      {newsLinks.news_links.length} links
                    </Badge>
                  </div>
                  
                  <div className="grid gap-2 max-h-96 overflow-y-auto">
                    {newsLinks.news_links.map((link, index) => (
                      <Card key={index} className="border-l-4 border-l-purple-500">
                        <CardContent className="pt-3 pb-3">
                          <div className="flex items-center justify-between">
                            <p className="text-sm truncate flex-1 mr-4">{link}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(link, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-3">
                  <Input
                    placeholder="Digite palavras-chave separadas por vírgula (ex: eleições, economia, tecnologia)"
                    value={trendKeywords}
                    onChange={(e) => setTrendKeywords(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTrendsAnalysis()}
                  />
                </div>
                <Button onClick={handleTrendsAnalysis} disabled={isLoading} className="w-full">
                  {isLoading ? <LoadingSpinner /> : <TrendingUp className="h-4 w-4 mr-2" />}
                  Analisar
                </Button>
              </div>

              {trendsData && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Análise de Tendências (última semana)</h3>
                  
                  <div className="grid gap-4">
                    {Object.entries(trendsData).map(([keyword, data]) => (
                      <Card key={keyword} className="border-l-4 border-l-orange-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{keyword}</CardTitle>
                            <Badge variant="secondary">
                              {data.news?.length || 0} artigos
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {data.news?.slice(0, 3).map((article, index) => (
                              <div key={index} className="border-l-2 border-l-muted pl-3">
                                <p className="text-sm font-medium line-clamp-1">{article.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(article.publish_date).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};