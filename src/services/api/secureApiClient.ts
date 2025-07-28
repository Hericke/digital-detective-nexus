import { supabase } from '@/integrations/supabase/client';

interface APIRequest {
  service: 'rapidapi' | 'hunter' | 'numverify' | 'google' | 'opencage' | 'youtube' | 'facebook';
  endpoint: string;
  data?: any;
  method?: string;
}

class SecureAPIClient {
  private async makeSecureRequest(request: APIRequest) {
    try {
      const { data, error } = await supabase.functions.invoke('secure-osint-api', {
        body: request
      });

      if (error) {
        
        throw new Error(`API request failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      
      throw error;
    }
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