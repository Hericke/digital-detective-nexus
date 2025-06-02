
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openaiApiKey = Deno.env.get('OPENAI_API_KEY') || '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Você é um assistente especializado em investigação digital (OSINT) focado na análise de dados públicos.

SUAS FUNÇÕES:
1. Analisar e interpretar dados fornecidos pelo usuário
2. Sugerir hipóteses investigativas baseadas nos dados
3. Recomendar fontes de dados públicos relevantes
4. Orientar sobre técnicas de OSINT

REGRAS ABSOLUTAS:
❌ NUNCA invente dados ou informações
❌ NUNCA crie informações falsas
❌ NUNCA forneça dados que não foram informados pelo usuário
✔️ APENAS analise e interprete os dados fornecidos
✔️ Seja direto, objetivo e profissional
✔️ Informe sempre os limites da investigação digital

COMPORTAMENTO:
- Foque exclusivamente em investigação digital baseada em dados públicos
- Sugira fontes abertas como: Google, redes sociais públicas, registros públicos
- Oriente sobre técnicas como: busca reversa de imagem, análise de metadados, verificação cruzada
- Sempre mencione que as informações devem ser validadas
- Respeite questões legais e éticas da investigação digital

Se não tiver dados suficientes, peça mais informações ao usuário.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== INÍCIO DA FUNÇÃO AI-OSINT-CHAT ===');
    
    // Verificar se a chave API está configurada
    if (!openaiApiKey || openaiApiKey === '') {
      console.error('❌ ERRO: OPENAI_API_KEY não está configurada');
      return new Response(JSON.stringify({ 
        error: 'Chave da API OpenAI não configurada. Verifique as configurações no Supabase.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Log da chave (apenas os primeiros e últimos caracteres por segurança)
    const keyPreview = openaiApiKey.length > 10 
      ? `${openaiApiKey.substring(0, 7)}...${openaiApiKey.substring(openaiApiKey.length - 4)}`
      : 'CHAVE_MUITO_CURTA';
    console.log(`✅ Chave API encontrada: ${keyPreview}`);

    // Verificar se a chave está no formato correto
    if (!openaiApiKey.startsWith('sk-')) {
      console.error('❌ ERRO: Formato da chave API inválido - deve começar com "sk-"');
      return new Response(JSON.stringify({ 
        error: 'Formato da chave API OpenAI inválido. A chave deve começar com "sk-".' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const reqBody = await req.json();
    const prompt = reqBody.prompt;
    
    if (!prompt) {
      console.error('❌ ERRO: Prompt vazio ou ausente');
      return new Response(JSON.stringify({ error: 'Prompt está vazio ou ausente' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`📝 Prompt recebido (${prompt.length} caracteres): ${prompt.substring(0, 100)}...`);

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 1000,
    };

    console.log('🚀 Enviando requisição para OpenAI API...');
    console.log(`📊 Modelo: ${requestBody.model}, Temperature: ${requestBody.temperature}, Max tokens: ${requestBody.max_tokens}`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`📡 Resposta da OpenAI - Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ ERRO DA OPENAI API (${response.status}):`, errorText);
      
      let errorMessage = 'Erro na comunicação com a API da OpenAI';
      
      // Tratamento específico para diferentes tipos de erro
      if (response.status === 401) {
        errorMessage = 'Chave da API OpenAI inválida ou expirada. Verifique sua chave API.';
      } else if (response.status === 429) {
        errorMessage = 'Limite de requisições excedido ou créditos insuficientes na conta OpenAI.';
      } else if (response.status === 400) {
        errorMessage = 'Requisição inválida enviada para a OpenAI. Verifique os parâmetros.';
      } else if (response.status >= 500) {
        errorMessage = 'Erro interno do servidor da OpenAI. Tente novamente em alguns minutos.';
      }
      
      return new Response(JSON.stringify({ 
        error: errorMessage,
        details: `Status ${response.status}: ${errorText}`,
        troubleshooting: {
          status: response.status,
          possibleCauses: [
            response.status === 401 ? 'Chave API inválida ou expirada' : null,
            response.status === 429 ? 'Limite de requisições ou créditos insuficientes' : null,
            response.status === 400 ? 'Parâmetros da requisição inválidos' : null,
            response.status >= 500 ? 'Erro do servidor OpenAI' : null
          ].filter(Boolean)
        }
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('✅ Resposta recebida da OpenAI com sucesso');
    console.log(`📊 Dados recebidos - Choices: ${data.choices?.length || 0}`);
    
    let generatedText = '';
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      generatedText = data.choices[0].message.content;
      console.log(`✅ Texto gerado com sucesso (${generatedText.length} caracteres)`);
    } else {
      console.error('❌ ERRO: Formato de resposta inesperado da OpenAI:', JSON.stringify(data, null, 2));
      throw new Error('Resposta inesperada da API da OpenAI - formato inválido');
    }

    console.log('=== FUNÇÃO CONCLUÍDA COM SUCESSO ===');

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('💥 ERRO CRÍTICO na função AI OSINT chat:', error);
    console.error('Stack trace:', error.stack);
    
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor. Verifique os logs para mais detalhes.',
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
