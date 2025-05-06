
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ReportForm from '@/components/ReportForm';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";

const ReportPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <Link to={id ? `/search/${id}` : "/"}>
              <Button 
                variant="ghost" 
                className="pl-0 hover:pl-2 transition-all duration-200"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> 
                Voltar
              </Button>
            </Link>
            
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/8b79dcd0-43c0-4522-bcb3-fdd451d1a3d5.png"
                alt="CavernaSPY"
                className="h-12 w-12 mr-3"
              />
              <h1 className="text-2xl font-bold cyber-text">CavernaSPY</h1>
            </div>
          </div>
          
          <Alert variant="warning" className="mb-6 bg-yellow-500/10 border-yellow-500/30">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription>
              Este é um ambiente de demonstração. Os relatórios criados usarão apenas dados de exemplo e não representam informações reais.
            </AlertDescription>
          </Alert>

          <ReportForm />
        </div>
      </div>
      
      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        <p>CavernaSPY &copy; {new Date().getFullYear()} - Ferramenta de investigação digital</p>
      </footer>
    </div>
  );
};

export default ReportPage;
