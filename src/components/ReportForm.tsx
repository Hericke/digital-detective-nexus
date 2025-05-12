
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { FileUp, Link, Plus, Download, Copy, Save, Trash, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        description: "O relatório foi salvo e está pronto para download.",
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

  // Improved PDF generation with better styling and formatting
  const generatePDF = async () => {
    if (!reportRef.current) return null;
    
    // Display loading toast
    toast({
      title: "Gerando PDF",
      description: "Por favor aguarde enquanto preparamos seu relatório...",
    });
    
    try {
      // Create a clone of the report element for proper PDF styling
      const reportElement = reportRef.current.cloneNode(true) as HTMLElement;
      
      // Apply print-specific styling to the clone
      const reportStyles = document.createElement('style');
      reportStyles.innerHTML = `
        * {
          font-family: Arial, sans-serif !important;
          color: black !important;
        }
        .report-container {
          padding: 20px;
          background: white;
          color: black;
        }
        .report-header {
          margin-bottom: 20px;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
          text-align: center;
        }
        .report-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .report-date {
          font-size: 14px;
          color: #555;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 10px;
          border-bottom: 1px solid #eee;
          padding-bottom: 5px;
        }
        .field-label {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .field-value {
          margin-bottom: 15px;
        }
        .evidence-item {
          border: 1px solid #ddd;
          margin-bottom: 15px;
          padding: 10px;
        }
        .evidence-image {
          max-width: 100%;
          max-height: 200px;
          margin: 10px 0;
        }
        .evidence-desc {
          font-style: italic;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td, th {
          border: 1px solid #ddd;
          padding: 8px;
        }
        
        img {
          max-width: 100%;
          height: auto;
        }
      `;
      
      // Create a styled container for the report
      const container = document.createElement('div');
      container.className = 'report-container';
      container.innerHTML = `
        <div class="report-header">
          <div class="report-title">${form.getValues().reportTitle}</div>
          <div class="report-date">Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}</div>
        </div>
      `;
      
      // Add target information section
      const targetSection = document.createElement('div');
      targetSection.className = 'section';
      targetSection.innerHTML = `
        <div class="section-title">Dados do Alvo</div>
        <div class="field-label">Nome Completo:</div>
        <div class="field-value">${form.getValues().targetName || 'N/A'}</div>
        
        <div class="field-label">Apelidos/Pseudônimos:</div>
        <div class="field-value">${form.getValues().targetNicknames || 'N/A'}</div>
        
        <table>
          <tr>
            <td width="50%">
              <div class="field-label">Telefone(s):</div>
              <div class="field-value">${form.getValues().targetPhone || 'N/A'}</div>
            </td>
            <td width="50%">
              <div class="field-label">E-mail(s):</div>
              <div class="field-value">${form.getValues().targetEmail || 'N/A'}</div>
            </td>
          </tr>
          <tr>
            <td width="50%">
              <div class="field-label">CPF/CNPJ:</div>
              <div class="field-value">${form.getValues().targetDocument || 'N/A'}</div>
            </td>
            <td width="50%">
              <div class="field-label">Endereço:</div>
              <div class="field-value">${form.getValues().targetAddress || 'N/A'}</div>
            </td>
          </tr>
        </table>
        
        <div class="field-label">Redes Sociais:</div>
        <div class="field-value">${form.getValues().targetSocialMedia || 'N/A'}</div>
      `;
      container.appendChild(targetSection);
      
      // Add investigation summary section
      const summarySection = document.createElement('div');
      summarySection.className = 'section';
      summarySection.innerHTML = `
        <div class="section-title">Resumo da Investigação</div>
        <div class="field-label">Contexto:</div>
        <div class="field-value">${form.getValues().investigationContext || 'N/A'}</div>
        
        <div class="field-label">Objetivo:</div>
        <div class="field-value">${form.getValues().investigationObjective || 'N/A'}</div>
        
        <div class="field-label">Período da Coleta:</div>
        <div class="field-value">${form.getValues().investigationPeriod || 'N/A'}</div>
      `;
      container.appendChild(summarySection);
      
      // Add evidence section
      if (evidences.length > 0) {
        const evidenceSection = document.createElement('div');
        evidenceSection.className = 'section';
        evidenceSection.innerHTML = `<div class="section-title">Evidências Coletadas</div>`;
        
        // Create elements for each evidence
        for (const evidence of evidences) {
          const evidenceElement = document.createElement('div');
          evidenceElement.className = 'evidence-item';
          
          let evidenceContent = '';
          if (evidence.type === 'image' && evidence.content) {
            evidenceContent = `
              <div class="field-label">Imagem:</div>
              <img src="${evidence.content}" class="evidence-image" alt="Evidência" />
            `;
          } else if (evidence.type === 'link' && evidence.content) {
            evidenceContent = `
              <div class="field-label">Link:</div>
              <div class="field-value">${evidence.content}</div>
            `;
          }
          
          evidenceElement.innerHTML = `
            ${evidenceContent}
            <div class="field-label">Descrição:</div>
            <div class="field-value evidence-desc">${evidence.description || 'Sem descrição'}</div>
          `;
          
          evidenceSection.appendChild(evidenceElement);
        }
        
        container.appendChild(evidenceSection);
      }
      
      // Add conclusions and recommendations section
      const conclusionsSection = document.createElement('div');
      conclusionsSection.className = 'section';
      conclusionsSection.innerHTML = `
        <div class="section-title">Análise e Conclusões</div>
        <div class="field-label">Conclusões:</div>
        <div class="field-value">${form.getValues().conclusions || 'N/A'}</div>
        
        <div class="field-label">Recomendações:</div>
        <div class="field-value">${form.getValues().recommendations || 'N/A'}</div>
      `;
      container.appendChild(conclusionsSection);
      
      // Add the footer
      const footer = document.createElement('div');
      footer.style.marginTop = '20px';
      footer.style.borderTop = '1px solid #eee';
      footer.style.paddingTop = '10px';
      footer.style.textAlign = 'center';
      footer.style.fontSize = '12px';
      footer.innerHTML = `CavernaSPY &copy; ${new Date().getFullYear()} - Relatório de Investigação Digital`;
      container.appendChild(footer);
      
      // Append the style and container to a temporary div
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.appendChild(reportStyles);
      tempDiv.appendChild(container);
      document.body.appendChild(tempDiv);
      
      // Convert the styled container to canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Remove the temporary div
      document.body.removeChild(tempDiv);
      
      // Create PDF from canvas
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      // Add canvas as image to PDF with proper sizing
      let heightLeft = imgHeight;
      let position = 0;
      let pageCount = 1;
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new pages if content overflows
      while (heightLeft > 0) {
        pageCount++;
        position = -(pageHeight * pageCount - imgHeight);
        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
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
              <div>
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
