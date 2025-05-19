
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('PERPLEXITY_API_KEY') || 'default-key';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `Você é um assistente inteligente especializado em investigações OSINT (Open Source Intelligence). 
Seu papel é ajudar o investigador a analisar, interpretar e cruzar dados coletados durante uma investigação digital. 
Você pode sugerir ferramentas, técnicas e hipóteses com base em informações como nome completo, CPF, CNPJ, e-mail, 
número de telefone, endereço, perfis em redes sociais, localização, placas de veículos, entre outros.

Responda sempre de forma clara, objetiva e profissional, explicando os possíveis caminhos de investigação e cuidados 
legais que devem ser tomados. Caso necessário, recomende ferramentas ou estratégias como busca reversa de imagem, 
pesquisa em bancos de dados públicos, análise de conexões em redes sociais e uso de dorks avançados no Google.

Nunca invente dados. Se não souber ou não tiver certeza, diga que precisa de mais informações para dar uma resposta precisa. 
Você pode fazer perguntas ao investigador para entender melhor o caso.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online', // Modelo avançado da Perplexity
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    let generatedText = '';
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      generatedText = data.choices[0].message.content;
    } else {
      throw new Error('Resposta inesperada da API');
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
