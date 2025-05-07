
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { FileUp, Link, Plus, Mail, Download, Copy, Save, Trash, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Schema para validação do formulário
const formSchema = z.object({
  reportTitle: z.string().min(3, "Título é obrigatório").max(100),
  targetName: z.string().min(2, "Nome é obrigatório"),
  targetNicknames: z.string().optional(),
  targetPhone: z.string().optional(),
  targetEmail: z.string().email("Email inválido").optional().or(z.string().length(0)),
  targetDocument: z.string().optional(),
  targetAddress: z.string().optional(),
  targetSocialMedia: z.string().optional(),
  investigationContext: z.string().min(10, "Contexto é obrigatório"),
  investigationObjective: z.string().min(10, "Objetivo é obrigatório"),
  investigationPeriod: z.string().min(3, "Período é obrigatório"),
  conclusions: z.string().min(10, "Conclusões são obrigatórias"),
  recommendations: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EvidenceItem {
  id: string;
  type: 'image' | 'link';
  content: string;
  description: string;
}

const ReportForm = () => {
  const [evidences, setEvidences] = useState<EvidenceItem[]>([]);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportTitle: `Relatório de Investigação - ${format(new Date(), 'dd/MM/yyyy')}`,
      targetName: '',
      targetNicknames: '',
      targetPhone: '',
      targetEmail: '',
      targetDocument: '',
      targetAddress: '',
      targetSocialMedia: '',
      investigationContext: '',
      investigationObjective: '',
      investigationPeriod: `${format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'dd/MM/yyyy')} a ${format(new Date(), 'dd/MM/yyyy')}`,
      conclusions: '',
      recommendations: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Salvar os dados do formulário
      console.log("Dados do relatório:", { ...data, evidences });
      
      toast({
        title: "Relatório salvo com sucesso!",
        description: "O relatório foi salvo e está pronto para download ou envio.",
      });

    } catch (error) {
      toast({
        title: "Erro ao salvar relatório",
        description: "Ocorreu um problema ao processar seu relatório.",
        variant: "destructive"
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddEvidence = (type: 'image' | 'link') => {
    const newEvidence: EvidenceItem = {
      id: Date.now().toString(),
      type,
      content: '',
      description: '',
    };
    setEvidences([...evidences, newEvidence]);
  };

  const handleEvidenceChange = (id: string, field: 'content' | 'description', value: string) => {
    setEvidences(
      evidences.map((evidence) =>
        evidence.id === id ? { ...evidence, [field]: value } : evidence
      )
    );
  };

  const handleRemoveEvidence = (id: string) => {
    setEvidences(evidences.filter((evidence) => evidence.id !== id));
  };

  const handleFileUpload = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleEvidenceChange(id, 'content', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generatePDF = async () => {
    if (!reportRef.current) return null;
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const pageHeight = 297; // A4 height in mm
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if content overflows
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      return pdf;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        title: "Erro na geração do PDF",
        description: "Não foi possível gerar o PDF do relatório.",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      const pdf = await generatePDF();
      if (!pdf) {
        throw new Error("Falha ao gerar o PDF");
      }
      
      const formValues = form.getValues();
      const fileName = `${formValues.reportTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      
      pdf.save(fileName);
      
      toast({
        title: "Download concluído",
        description: "Seu relatório foi baixado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao fazer download do relatório:', error);
      toast({
        title: "Erro no download",
        description: "Ocorreu um problema ao fazer o download do relatório.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, forneça um endereço de email válido.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSendingEmail(true);
    
    try {
      const pdf = await generatePDF();
      if (!pdf) {
        throw new Error("Falha ao gerar o PDF");
      }
      
      const formValues = form.getValues();
      const pdfBase64 = pdf.output('datauristring');
      
      // Simulando o envio de email (em uma implementação real, isso seria feito via API)
      console.log("Enviando email para:", recipientEmail);
      console.log("Assunto:", `Relatório de Investigação: ${formValues.reportTitle}`);
      
      // Adicione um pequeno atraso para simular o envio
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Email enviado",
        description: `O relatório foi enviado para ${recipientEmail}.`,
      });
      
      setEmailDialogOpen(false);
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar o relatório por email.",
        variant: "destructive"
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  const copyLinkToClipboard = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copiado",
      description: "Link copiado para a área de transferência.",
    });
  };

  const previewEvidence = (evidence: EvidenceItem) => {
    window.open(evidence.type === 'link' ? evidence.content : evidence.content, "_blank");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="border-primary/20 shadow-lg">
            <CardHeader className="bg-muted/30">
              <CardTitle className="cyber-text text-2xl">Relatório de Investigação - CavernaSPY</CardTitle>
              <CardDescription>
                Preencha os detalhes do relatório de investigação digital. Todos os campos marcados com * são obrigatórios.
              </CardDescription>
            </CardHeader>
            <div ref={reportRef}>
              <CardContent className="pt-6 space-y-6">
                <FormField
                  control={form.control}
                  name="reportTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Relatório *</FormLabel>
                      <FormControl>
                        <Input {...field} className="search-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Seção de Dados do Alvo */}
                <div>
                  <h3 className="section-title">Dados do Alvo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="targetName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo *</FormLabel>
                          <FormControl>
                            <Input {...field} className="search-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetNicknames"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apelidos/Pseudônimos</FormLabel>
                          <FormControl>
                            <Input {...field} className="search-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="targetPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone(s)</FormLabel>
                          <FormControl>
                            <Input {...field} className="search-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail(s)</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" className="search-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="targetDocument"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF/CNPJ</FormLabel>
                          <FormControl>
                            <Input {...field} className="search-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input {...field} className="search-input" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="targetSocialMedia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Redes Sociais (separar por vírgulas)</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="search-input min-h-[80px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Seção de Resumo da Investigação */}
                <div>
                  <h3 className="section-title">Resumo da Investigação</h3>
                  <div className="space-y-4 mt-4">
                    <FormField
                      control={form.control}
                      name="investigationContext"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contexto *</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="search-input min-h-[100px]" />
                          </FormControl>
                          <FormDescription>
                            Descreva o contexto em que a investigação foi realizada
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="investigationObjective"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Objetivo *</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="search-input min-h-[100px]" />
                          </FormControl>
                          <FormDescription>
                            Quais eram os objetivos específicos desta investigação
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="investigationPeriod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Período da Coleta *</FormLabel>
                          <FormControl>
                            <Input {...field} className="search-input" />
                          </FormControl>
                          <FormDescription>
                            Período em que as informações foram coletadas (Ex: 10/05/2024 a 15/05/2024)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Seção de Evidências */}
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="section-title">Evidências Coletadas</h3>
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleAddEvidence('image')}
                      >
                        <FileUp className="mr-1 h-4 w-4" /> Imagem
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleAddEvidence('link')}
                      >
                        <Link className="mr-1 h-4 w-4" /> Link
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    {evidences.length === 0 && (
                      <div className="text-center p-6 border border-dashed rounded-md border-muted-foreground/50">
                        <p className="text-muted-foreground">
                          Adicione imagens ou links como evidências usando os botões acima
                        </p>
                      </div>
                    )}

                    {evidences.map((evidence) => (
                      <Card key={evidence.id} className="overflow-hidden border-muted">
                        <CardHeader className="bg-muted/30 py-3">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-base">
                              Evidência: {evidence.type === 'image' ? 'Imagem' : 'Link'}
                            </CardTitle>
                            <div className="flex space-x-1">
                              <Button type="button" variant="ghost" size="sm" onClick={() => previewEvidence(evidence)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {evidence.type === 'link' && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => copyLinkToClipboard(evidence.content)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                              )}
                              <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveEvidence(evidence.id)}>
                                <Trash className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 py-3">
                          {evidence.type === 'image' ? (
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <Input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => handleFileUpload(evidence.id, e)}
                                  className="search-input"
                                />
                              </div>
                              {evidence.content && (
                                <div className="relative w-full h-40 overflow-hidden rounded-md">
                                  <img 
                                    src={evidence.content} 
                                    alt="Evidência" 
                                    className="object-contain w-full h-full"
                                  />
                                </div>
                              )}
                            </div>
                          ) : (
                            <Input 
                              type="url" 
                              placeholder="https://exemplo.com" 
                              value={evidence.content} 
                              onChange={(e) => handleEvidenceChange(evidence.id, 'content', e.target.value)} 
                              className="search-input"
                            />
                          )}
                          <Textarea 
                            placeholder="Descrição da evidência" 
                            value={evidence.description}
                            onChange={(e) => handleEvidenceChange(evidence.id, 'description', e.target.value)}
                            className="search-input min-h-[80px]"
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Seção de Análise e Conclusões */}
                <div>
                  <h3 className="section-title">Análise e Conclusões</h3>
                  <div className="space-y-4 mt-4">
                    <FormField
                      control={form.control}
                      name="conclusions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conclusões *</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="search-input min-h-[150px]" />
                          </FormControl>
                          <FormDescription>
                            Interpretação dos dados coletados e conclusões da investigação
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recommendations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recomendações</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="search-input min-h-[100px]" />
                          </FormControl>
                          <FormDescription>
                            Sugestões ou recomendações baseadas nas descobertas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </div>
            <CardFooter className="flex justify-between bg-muted/30">
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/80"
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Salvando..." : "Salvar Relatório"}
              </Button>
              <div className="flex space-x-2">
                <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" type="button">
                      <Mail className="mr-2 h-4 w-4" />
                      Enviar por Email
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Enviar Relatório por Email</DialogTitle>
                      <DialogDescription>
                        O relatório será enviado como anexo PDF para o endereço especificado.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <FormItem>
                        <FormLabel>Email do Destinatário</FormLabel>
                        <Input 
                          type="email" 
                          placeholder="cliente@exemplo.com" 
                          value={recipientEmail} 
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          className="search-input"
                        />
                      </FormItem>
                    </div>
                    <DialogFooter>
                      <Button variant="secondary" onClick={() => setEmailDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleSendEmail}
                        disabled={isSendingEmail}
                      >
                        {isSendingEmail ? "Enviando..." : "Enviar"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={handleDownloadReport}
                  disabled={isDownloading}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {isDownloading ? "Gerando..." : "Fazer Download"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default ReportForm;
