
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SearchDetails from "./pages/SearchDetails";
import NotFound from "./pages/NotFound";
import ReportPage from "./pages/ReportPage";
import AiChat from "./pages/AiChat";
import GoogleMapPage from "./pages/GoogleMapPage";
import ImageAnalysisPage from "./pages/ImageAnalysisPage";
import YouTubeSearchPage from "./pages/YouTubeSearchPage";
import OSINTTools from "./pages/OSINTTools";
import AdvancedSearchPage from "./pages/AdvancedSearchPage";
import { AuthProvider } from "./contexts/AuthContext";

// Criar um cliente de consulta com configurações melhores para UX
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search/:id" element={<SearchDetails />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/report/:id" element={<ReportPage />} />
              <Route path="/ai-chat" element={<AiChat />} />
              <Route path="/google-map" element={<GoogleMapPage />} />
              <Route path="/image-analysis" element={<ImageAnalysisPage />} />
              <Route path="/youtube-search" element={<YouTubeSearchPage />} />
              <Route path="/osint-tools" element={<OSINTTools />} />
              <Route path="/advanced-search" element={<AdvancedSearchPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
