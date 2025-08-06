import { secureApiClient } from '@/services/api/secureApiClient';

export interface NewsSearchParams {
  text: string;
  language?: string;
  'earliest-publish-date'?: string;
  'latest-publish-date'?: string;
  number?: number;
  offset?: number;
  sort?: string;
  'sort-direction'?: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  text: string;
  summary: string;
  url: string;
  image?: string;
  video?: string;
  authors?: string[];
  publish_date: string;
  category?: string;
  language: string;
  source_country: string;
  sentiment?: number;
}

export interface NewsSearchResponse {
  news: NewsArticle[];
  available: number;
  number: number;
  offset: number;
}

export interface ExtractedNews {
  id: string;
  title: string;
  text: string;
  summary: string;
  url: string;
  image?: string;
  author?: string;
  publish_date: string;
  language: string;
}

export interface NewsLinks {
  news_links: string[];
}

class NewsService {
  private apiClient = secureApiClient;

  // Pesquisar notícias
  async searchNews(params: NewsSearchParams): Promise<NewsSearchResponse> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('text', params.text);
      
      if (params.language) queryParams.append('language', params.language);
      if (params['earliest-publish-date']) queryParams.append('earliest-publish-date', params['earliest-publish-date']);
      if (params['latest-publish-date']) queryParams.append('latest-publish-date', params['latest-publish-date']);
      if (params.number) queryParams.append('number', params.number.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());
      if (params.sort) queryParams.append('sort', params.sort);
      if (params['sort-direction']) queryParams.append('sort-direction', params['sort-direction']);

      const response = await this.apiClient.apiLeagueRequest(`search-news?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Erro ao pesquisar notícias:', error);
      throw error;
    }
  }

  // Extrair conteúdo de uma notícia específica
  async extractNews(url: string): Promise<ExtractedNews> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('url', url);

      const response = await this.apiClient.apiLeagueRequest(`extract-news?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Erro ao extrair notícia:', error);
      throw error;
    }
  }

  // Extrair links de notícias de um site
  async extractNewsLinks(url: string): Promise<NewsLinks> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('url', url);

      const response = await this.apiClient.apiLeagueRequest(`extract-news-links?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('Erro ao extrair links de notícias:', error);
      throw error;
    }
  }

  // Busca inteligente de notícias com filtros predefinidos
  async searchBreakingNews(query: string, language: string = 'pt'): Promise<NewsSearchResponse> {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return this.searchNews({
      text: query,
      language,
      'earliest-publish-date': lastWeek.toISOString().split('T')[0],
      sort: 'publish-time',
      'sort-direction': 'desc',
      number: 10
    });
  }

  // Análise de tendências por palavra-chave
  async analyzeNewsTrends(keywords: string[], timeframe: 'today' | 'week' | 'month' = 'week'): Promise<Record<string, NewsSearchResponse>> {
    const trends: Record<string, NewsSearchResponse> = {};
    
    const timeframes = {
      today: 1,
      week: 7,
      month: 30
    };

    const daysBack = timeframes[timeframe];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    try {
      for (const keyword of keywords) {
        trends[keyword] = await this.searchNews({
          text: keyword,
          'earliest-publish-date': startDate.toISOString().split('T')[0],
          sort: 'publish-time',
          'sort-direction': 'desc',
          number: 5
        });
      }
      
      return trends;
    } catch (error) {
      console.error('Erro ao analisar tendências:', error);
      throw error;
    }
  }
}

export const newsService = new NewsService();