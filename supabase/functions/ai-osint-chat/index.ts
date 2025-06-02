
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
    if (!openaiApiKey || openaiApiKey === '') {
      console.error('OPENAI_API_KEY is not set');
      return new Response(JSON.stringify({ 
        error: 'OPENAI_API_KEY não está configurada no ambiente Supabase.' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const reqBody = await req.json();
    const prompt = reqBody.prompt;
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt está vazio ou ausente' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Making request to OpenAI API with prompt:', prompt.substring(0, 50) + '...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return new Response(JSON.stringify({ 
        error: `Erro na API da OpenAI: ${response.status}`, 
        details: errorText 
      }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('OpenAI API response:', JSON.stringify(data).substring(0, 100) + '...');
    
    let generatedText = '';
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      generatedText = data.choices[0].message.content;
    } else {
      console.error('Unexpected API response format:', data);
      throw new Error('Resposta inesperada da API da OpenAI');
    }

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI OSINT chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
