import { supabase } from '@/integrations/supabase/client';
import { createRateLimiter, retryWithBackoff } from '@/utils/apiErrorHandler';

interface APIRequest {
  service: 'rapidapi' | 'hunter' | 'numverify' | 'google' | 'opencage' | 'youtube' | 'facebook';
  endpoint: string;
  data?: any;
  method?: string;
}

class SecureAPIClient {
  private rateLimiter = createRateLimiter(5, 60000); // 5 requests per minute
  
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

  // RapidAPI requests
  async rapidApiRequest(endpoint: string, options: any = {}) {
    return this.makeSecureRequest({
      service: 'rapidapi',
      endpoint,
      data: options,
      method: options.method || 'GET'
    });
  }

  // Hunter.io requests
  async hunterRequest(endpoint: string, params: any = {}) {
    return this.makeSecureRequest({
      service: 'hunter',
      endpoint,
      data: params
    });
  }

  // NumVerify requests
  async numverifyRequest(endpoint: string, params: any = {}) {
    return this.makeSecureRequest({
      service: 'numverify',
      endpoint,
      data: params
    });
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
}

export const secureApiClient = new SecureAPIClient();