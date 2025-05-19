
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send } from "lucide-react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call Supabase Edge Function instead of direct API URL
      const { data, error } = await supabase.functions.invoke('ai-osint-chat', {
        body: {
          prompt: input
        }
      });
      
      if (error) {
        throw new Error(error.message || 'Erro na comunicação com a IA');
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: data.generatedText }]);
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro",
        description: "Não foi possível obter uma resposta da IA",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
        </div>
        
        <div className="flex-1 flex flex-col bg-muted/20 rounded-lg p-4 mb-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground text-center">
                  Envie uma mensagem para começar a conversa com a IA especializada em OSINT.
                </p>
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
                    <div className="h-2 w-2 bg-muted-foreground rounded-full"></div>
                    <div className="h-2 w-2 bg-muted-foreground rounded-full"></div>
                    <div className="h-2 w-2 bg-muted-foreground rounded-full"></div>
                  </div>
                  <span className="text-sm text-muted-foreground">Pensando...</span>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="flex-1">
              <Textarea 
                placeholder="Digite sua pergunta sobre investigação OSINT..."
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
            <Button type="submit" disabled={isLoading || !input.trim()} className="h-10">
              <Send className="size-4 mr-1" />
              Enviar
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
