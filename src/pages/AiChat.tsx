
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, AlertCircle, RefreshCw, Mail } from "lucide-react";
import Navbar from '@/components/Navbar';
import { supabase } from "@/integrations/supabase/client";

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const AiChat = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    
    try {
      console.log("🚀 Chamando função Supabase: ai-osint-chat");
      console.log("📝 Prompt enviado:", currentInput.substring(0, 100) + "...");
      
      const { data, error } = await supabase.functions.invoke('ai-osint-chat', {
        body: {
          prompt: currentInput
        }
      });
      
      console.log("📡 Resposta recebida:", { data, error });
      
      if (error) {
        console.error("❌ Erro da edge function:", error);
        
        let errorMessage = 'Erro na comunicação com a IA';
        
        if (error.message?.includes('API') || error.message?.includes('DeepSeek')) {
          errorMessage = 'Problema com a API do DeepSeek. Verifique as configurações.';
        } else if (error.message?.includes('401')) {
          errorMessage = 'Chave da API inválida. Verifique a configuração no Supabase.';
        } else if (error.message?.includes('429')) {
          errorMessage = 'Limite de requisições excedido. Tente novamente em alguns minutos.';
        }
        
        toast({
          title: "Erro",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }
      
      if (!data || !data.generatedText) {
        console.error("❌ Formato de resposta inválido:", data);
        toast({
          title: "Erro",
          description: "Resposta da IA em formato inválido. Verifique os logs.",
          variant: "destructive"
        });
        return;
      }
      
      console.log("✅ Resposta processada com sucesso");
      setMessages(prev => [...prev, { role: 'assistant', content: data.generatedText }]);
      
    } catch (error) {
      console.error('💥 Erro detalhado:', error);
      
      let errorMessage = "Erro inesperado. Verifique o console para mais detalhes.";
      
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage = "Erro de conectividade. Verifique sua conexão.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "Timeout na requisição. Tente novamente.";
        }
      }
      
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      const lastUserMessage = messages[messages.length - 1].content;
      setInput(lastUserMessage);
    }
  };

  const addEmailSearchExample = () => {
    setInput('Buscar emails do domínio example.com');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <MessageSquare className="size-6" />
            Assistente OSINT
          </h1>
          <p className="text-muted-foreground">
            Converse com nossa IA especializada em OSINT para obter insights sobre suas investigações digitais.
          </p>
          
          {/* Indicador de status da API */}
          <div className="mt-2 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">DeepSeek API configurada</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-3 h-3 text-blue-500" />
              <span className="text-muted-foreground">Hunter.ai integrado</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col bg-muted/20 rounded-lg p-4 mb-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Envie uma mensagem para começar a conversa com a IA especializada em OSINT.
                  </p>
                  <div className="text-sm text-muted-foreground">
                    <p>Exemplos de perguntas:</p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>"Como investigar um perfil suspeito nas redes sociais?"</li>
                      <li>"Quais fontes públicas posso usar para verificar informações?"</li>
                      <li>"Como fazer busca reversa de imagem?"</li>
                      <li>
                        <button 
                          onClick={addEmailSearchExample}
                          className="text-blue-500 hover:underline"
                        >
                          "Buscar emails do domínio example.com"
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg max-w-[85%] ${
                    message.role === 'user' 
                      ? 'bg-primary/10 border border-primary/20 ml-auto' 
                      : 'bg-muted border border-border mr-auto'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              ))
            )}
            {isLoading && (
              <div className="bg-muted border border-border rounded-lg p-3 max-w-[85%] mr-auto">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse flex space-x-1">
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {input.toLowerCase().includes('email') || input.toLowerCase().includes('buscar') 
                      ? 'Analisando dados e buscando emails...' 
                      : 'Analisando dados...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="flex-1">
              <Textarea 
                placeholder="Digite sua pergunta sobre investigação OSINT... (Ex: 'Buscar emails do domínio example.com')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="resize-none min-h-[80px]"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isLoading || !input.trim()} className="h-10">
                <Send className="size-4 mr-1" />
                Enviar
              </Button>
              {messages.length > 0 && (
                <Button type="button" variant="outline" size="sm" onClick={handleRetry} className="h-8">
                  <RefreshCw className="size-3 mr-1" />
                  Tentar novamente
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
