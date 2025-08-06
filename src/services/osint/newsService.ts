import { secureApiClient } from '@/services/api/secureApiClient';

// WorldNews API interfaces
export interface NewsSearchParams {
  text: string;
  language?: string;
  'earliest-publish-date'?: string;
  'latest-publish-date'?: string;
  'min-sentiment'?: number;
  'max-sentiment'?: number;
  'source-countries'?: string;
  authors?: string;
  number?: number;
  offset?: number;
}

export interface NewsArticle {
  id: number;
  title: string;
  text: string;
  summary: string;
  url: string;
  image?: string;
  video?: string;
  publish_date: string;
  authors: string[];
  category: string;
  language: string;
  source_country: string;
  sentiment: number;
}

export interface NewsSearchResponse {
  offset: number;
  number: number;
  available: number;
  news: NewsArticle[];
}

export interface ExtractedNews {
  title: string;
  text: string;
  summary?: string;
  url: string;
  image?: string;
  publish_date: string;
  authors: string[];
  language: string;
  source_country: string;
}

export interface NewsLinks {
  news_links: string[];
}

export class NewsService {
  async searchNews(params: NewsSearchParams): Promise<NewsSearchResponse> {
    try {
      const queryParams = {
        text: params.text,
        language: params.language || 'pt',
        number: params.number || 20,
        offset: params.offset || 0,
        ...(params['earliest-publish-date'] && { 'earliest-publish-date': params['earliest-publish-date'] }),
        ...(params['latest-publish-date'] && { 'latest-publish-date': params['latest-publish-date'] }),
        ...(params['min-sentiment'] && { 'min-sentiment': params['min-sentiment'] }),
        ...(params['max-sentiment'] && { 'max-sentiment': params['max-sentiment'] }),
        ...(params['source-countries'] && { 'source-countries': params['source-countries'] }),
        ...(params.authors && { authors: params.authors })
      };

      const response = await secureApiClient.worldNewsRequest('search-news', queryParams);
      return response as NewsSearchResponse;
    } catch (error) {
      console.error('Erro ao pesquisar notícias:', error);
      throw error;
    }
  }

  async extractNews(url: string): Promise<ExtractedNews> {
    try {
      const response = await secureApiClient.worldNewsRequest('extract-news', { url });
      return response as ExtractedNews;
    } catch (error) {
      console.error('Erro ao extrair notícia:', error);
      throw error;
    }
  }

  async extractNewsLinks(url: string): Promise<NewsLinks> {
    try {
      const response = await secureApiClient.worldNewsRequest('extract-news-links', { url });
      return response as NewsLinks;
    } catch (error) {
      console.error('Erro ao extrair links de notícias:', error);
      throw error;
    }
  }

  async searchBreakingNews(query: string, language: string = 'pt'): Promise<NewsSearchResponse> {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return this.searchNews({
      text: query,
      language,
      'earliest-publish-date': lastWeek.toISOString().split('T')[0],
      number: 10
    });
  }

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