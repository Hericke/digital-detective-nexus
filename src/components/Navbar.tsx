
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <header className="border-b border-primary/20 bg-card/90 backdrop-blur-sm shadow-lg">
      <div className="container flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/8b79dcd0-43c0-4522-bcb3-fdd451d1a3d5.png" 
            alt="CavernaSPY" 
            className="w-12 h-12 rounded-full border-2 border-primary/30 logo-pulse"
          />
          <div className="flex flex-col">
            <span className="font-bold text-xl cyber-text">CavernaSPY</span>
            <span className="text-xs text-muted-foreground">Investigação Digital</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="hidden sm:inline">Sistema Online</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
