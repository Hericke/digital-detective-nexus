
// Serviço para consulta de CNPJ usando ReceitaWS API
const RECEITA_WS_BASE_URL = 'https://www.receitaws.com.br/v1';

export interface CNPJResult {
  cnpj: string;
  identificador_matriz_filial: number;
  descricao_matriz_filial: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: string;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  motivo_situacao_cadastral: number;
  nome_cidade_exterior: string;
  codigo_natureza_juridica: number;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  descricao_tipo_logradouro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  uf: string;
  codigo_municipio: number;
  municipio: string;
  ddd_telefone_1: string;
  ddd_telefone_2: string;
  ddd_fax: string;
  qualificacao_do_responsavel: number;
  capital_social: number;
  porte: string;
  descricao_porte: string;
  opcao_pelo_simples: boolean;
  data_opcao_pelo_simples: string;
  data_exclusao_do_simples: string;
  opcao_pela_mei: boolean;
  situacao_especial: string;
  data_situacao_especial: string;
  atividades_secundarias: Array<{
    code: number;
    text: string;
  }>;
  qsa: Array<{
    identificador_de_socio: number;
    nome_socio: string;
    cnpj_cpf_do_socio: string;
    codigo_qualificacao_socio: number;
    percentual_capital_social: number;
    data_entrada_sociedade: string;
    cpf_representante_legal: string;
    nome_representante_legal: string;
    codigo_qualificacao_representante_legal: number;
  }>;
}

export const searchCNPJ = async (cnpj: string): Promise<CNPJResult | null> => {
  try {
    console.log('Consultando CNPJ:', cnpj);
    
    // Limpar o CNPJ de caracteres especiais
    const cleanCNPJ = cnpj.replace(/[\.\-\/]/g, '');
    
    const url = `${RECEITA_WS_BASE_URL}/cnpj/${cleanCNPJ}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Resposta ReceitaWS:', data);
    
    if (!response.ok || data.status === 'ERROR') {
      console.error('Erro na API ReceitaWS:', data.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao consultar CNPJ:', error);
    return null;
  }
};

export const formatCNPJ = (cnpj: string): string => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  return cleanCNPJ.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
};

export const validateCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  
  if (cleanCNPJ.length !== 14) return false;
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCNPJ)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  const peso1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  for (let i = 0; i < 12; i++) {
    soma += parseInt(cleanCNPJ[i]) * peso1[i];
  }
  
  let resto = soma % 11;
  const digito1 = resto < 2 ? 0 : 11 - resto;
  
  if (parseInt(cleanCNPJ[12]) !== digito1) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  const peso2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  
  for (let i = 0; i < 13; i++) {
    soma += parseInt(cleanCNPJ[i]) * peso2[i];
  }
  
  resto = soma % 11;
  const digito2 = resto < 2 ? 0 : 11 - resto;
  
  return parseInt(cleanCNPJ[13]) === digito2;
};
