
// Serviço para busca de e-mails usando Hunter.io API via secure endpoint
import { secureApiClient } from '../api/secureApiClient';
const HUNTER_BASE_URL = 'https://api.hunter.io/v2';

export interface EmailFinderResult {
  email: string;
  firstName: string;
  lastName: string;
  position: string;
  confidence: number;
  company: string;
  domain: string;
}

export interface EmailVerificationResult {
  result: string;
  score: number;
  email: string;
  regexp: boolean;
  gibberish: boolean;
  disposable: boolean;
  webmail: boolean;
  mxRecords: boolean;
  smtpServer: boolean;
  smtpCheck: boolean;
  acceptAll: boolean;
  block: boolean;
}

export interface DomainSearchResult {
  domain: string;
  disposable: boolean;
  webmail: boolean;
  acceptAll: boolean;
  pattern: string;
  organization: string;
  emails: EmailFinderResult[];
}

export const findEmailByName = async (fullName: string, domain: string): Promise<EmailFinderResult | null> => {
  try {
    console.log('Buscando email para:', fullName, 'no domínio:', domain);
    
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts[nameParts.length - 1];
    
    const data = await secureApiClient.hunterRequest(
      `${HUNTER_BASE_URL}/email-finder`,
      { domain, first_name: firstName, last_name: lastName }
    );
    
    console.log('Resposta Hunter.io email finder:', data);
    
    if (data.errors || data.error) {
      console.error('Erro na API Hunter.io:', data.errors || data.error);
      return null;
    }
    
    if (data.data && data.data.email) {
      return {
        email: data.data.email,
        firstName: data.data.first_name,
        lastName: data.data.last_name,
        position: data.data.position,
        confidence: data.data.confidence,
        company: data.data.company,
        domain: domain,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar email:', error);
    return null;
  }
};

export const verifyEmail = async (email: string): Promise<EmailVerificationResult | null> => {
  try {
    console.log('Verificando email:', email);
    
    const data = await secureApiClient.hunterRequest(
      `${HUNTER_BASE_URL}/email-verifier`,
      { email }
    );
    
    console.log('Resposta Hunter.io email verifier:', data);
    
    if (data.errors || data.error) {
      console.error('Erro na API Hunter.io:', data.errors || data.error);
      return null;
    }
    
    if (data.data) {
      return {
        result: data.data.result,
        score: data.data.score,
        email: data.data.email,
        regexp: data.data.regexp,
        gibberish: data.data.gibberish,
        disposable: data.data.disposable,
        webmail: data.data.webmail,
        mxRecords: data.data.mx_records,
        smtpServer: data.data.smtp_server,
        smtpCheck: data.data.smtp_check,
        acceptAll: data.data.accept_all,
        block: data.data.block,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao verificar email:', error);
    return null;
  }
};

export const searchDomain = async (domain: string): Promise<DomainSearchResult | null> => {
  try {
    console.log('Buscando domínio:', domain);
    
    const data = await secureApiClient.hunterRequest(
      `${HUNTER_BASE_URL}/domain-search`,
      { domain }
    );
    
    console.log('Resposta Hunter.io domain search:', data);
    
    if (data.errors || data.error) {
      console.error('Erro na API Hunter.io:', data.errors || data.error);
      return null;
    }
    
    if (data.data) {
      return {
        domain: data.data.domain,
        disposable: data.data.disposable,
        webmail: data.data.webmail,
        acceptAll: data.data.accept_all,
        pattern: data.data.pattern,
        organization: data.data.organization,
        emails: data.data.emails || [],
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar domínio:', error);
    return null;
  }
};
