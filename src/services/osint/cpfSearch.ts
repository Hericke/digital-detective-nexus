// Serviço para busca de CPF usando RapidAPI
import { secureApiClient } from '../api/secureApiClient';

export interface CPFResult {
  cpf: string;
  nome: string;
  situacao: string;
  data_nascimento?: string;
  sexo?: string;
  mae?: string;
  pai?: string;
  endereco?: {
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
}

export const searchCPF = async (cpf: string): Promise<CPFResult | null> => {
  try {
    console.log('Consultando CPF:', cpf);
    
    // Limpar o CPF de caracteres especiais
    const cleanCPF = cpf.replace(/[\.\-]/g, '');
    
    const data = await secureApiClient.rapidApiRequest(`?cpf=${cleanCPF}`, {
      headers: {
        'x-rapidapi-host': 'api-cpf-gratis.p.rapidapi.com'
      }
    });
    
    console.log('Resposta CPF API:', data);
    
    if (data.error || !data.cpf) {
      console.error('Erro na API CPF:', data.error);
      return null;
    }
    
    return {
      cpf: data.cpf,
      nome: data.nome,
      situacao: data.situacao,
      data_nascimento: data.data_nascimento,
      sexo: data.sexo,
      mae: data.mae,
      pai: data.pai,
      endereco: data.endereco
    };
  } catch (error) {
    console.error('Erro ao consultar CPF:', error);
    return null;
  }
};

export const formatCPF = (cpf: string): string => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
};

export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cleanCPF[i]) * (10 - i);
  }
  
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;
  
  if (parseInt(cleanCPF[9]) !== digito1) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cleanCPF[i]) * (11 - i);
  }
  
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;
  
  return parseInt(cleanCPF[10]) === digito2;
};