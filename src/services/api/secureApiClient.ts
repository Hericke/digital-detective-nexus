import { supabase } from '@/integrations/supabase/client';
import { createRateLimiter, retryWithBackoff } from '@/utils/apiErrorHandler';
import { cachedRequest, performanceMonitor } from '@/utils/performanceOptimizer';

interface APIRequest {
  service: 'rapidapi' | 'hunter' | 'numverify' | 'google' | 'opencage' | 'youtube' | 'facebook' | 'virustotal' | 'truecaller' | 'pipl' | 'blockchain' | 'ethereum' | 'coinapi' | 'exifreader' | 'webdetection' | 'osint-everything' | 'censys' | 'apileague';
  endpoint: string;
  data?: any;
  method?: string;
  headers?: Record<string, string>;
}

class SecureAPIClient {
  private rateLimiter = createRateLimiter(8, 60000); // Increased to 8 requests per minute
  
  private async makeSecureRequest(request: APIRequest) {
    const requestId = `${request.service}-${request.endpoint}`;
    
    // Check rate limit
    if (!this.rateLimiter.canMakeRequest(requestId)) {
      const waitTime = this.rateLimiter.getWaitTime(requestId);
      throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds before trying again.`);
    }

    return retryWithBackoff(async () => {
      try {
        const { data, error } = await supabase.functions.invoke('secure-osint-api', {
          body: request
        });

        if (error) {
          throw new Error(`API request failed: ${error.message}`);
        }

        return data;
      } catch (error) {
        // Handle 429 errors specifically
        if (error instanceof Error && error.message.includes('429')) {
          throw new Error('API rate limit exceeded. Please wait before making more requests.');
        }
        throw error;
      }
    }, 3, 3000); // 3 retries with 3 second base delay
  }

  // RapidAPI requests with caching
  async rapidApiRequest(endpoint: string, options: any = {}) {
    const cacheKey = `rapidapi-${endpoint}-${JSON.stringify(options)}`;
    const stopTimer = performanceMonitor.startTimer();
    
    try {
      const result = await cachedRequest(cacheKey, async () => {
        return this.makeSecureRequest({
          service: 'rapidapi',
          endpoint,
          data: options,
          method: options.method || 'GET'
        });
      }, 'normal');
      
      const duration = stopTimer();
      performanceMonitor.logSlowOperation(`RapidAPI: ${endpoint}`, duration);
      
      return result;
    } catch (error) {
      stopTimer();
      throw error;
    }
  }

  // Hunter.io requests with caching
  async hunterRequest(endpoint: string, params: any = {}) {
    const cacheKey = `hunter-${endpoint}-${JSON.stringify(params)}`;
    
    return cachedRequest(cacheKey, async () => {
      return this.makeSecureRequest({
        service: 'hunter',
        endpoint,
        data: params
      });
    }, 'frequent'); // Hunter requests are cached longer as they're more stable
  }

  // NumVerify requests with caching
  async numverifyRequest(endpoint: string, params: any = {}) {
    const cacheKey = `numverify-${endpoint}-${JSON.stringify(params)}`;
    
    return cachedRequest(cacheKey, async () => {
      return this.makeSecureRequest({
        service: 'numverify',
        endpoint,
        data: params
      });
    }, 'frequent'); // Phone validation is cached longer
  }

  // Google APIs (Maps, YouTube)
  async googleRequest(endpoint: string, params: any = {}) {
    return this.makeSecureRequest({
      service: 'google',
      endpoint,
      data: params
    });
  }

  // OpenCage requests
  async opencageRequest(endpoint: string, params: any = {}) {
    return this.makeSecureRequest({
      service: 'opencage',
      endpoint,
      data: params
    });
  }

  // YouTube requests
  async youtubeRequest(endpoint: string, params: any = {}) {
    return this.makeSecureRequest({
      service: 'youtube',
      endpoint,
      data: params
    });
  }

  // Facebook requests
  async facebookRequest(endpoint: string, params: any = {}) {
    return this.makeSecureRequest({
      service: 'facebook',
      endpoint,
      data: params
    });
  }

  // Censys requests
  async censysRequest(endpoint: string, options: any = {}) {
    return this.makeSecureRequest({
      service: 'censys',
      endpoint,
      data: options.body || {},
      method: options.method || 'GET'
    });
  }

  // API League requests
  async apiLeagueRequest(endpoint: string, params: any = {}) {
    return this.makeSecureRequest({
      service: 'apileague',
      endpoint,
      data: params,
      method: 'GET'
    });
  }
}

export const secureApiClient = new SecureAPIClient();