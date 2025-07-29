
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <header className="border-b-2 border-primary/20 bg-card/95 backdrop-blur-md shadow-xl shadow-primary/5 sticky top-0 z-50">
      <div className="container flex h-24 items-center justify-between px-8 max-w-7xl">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/8b79dcd0-43c0-4522-bcb3-fdd451d1a3d5.png" 
            alt="CavernaSPY" 
            className="w-14 h-14 rounded-full border-3 border-primary/40 logo-pulse shadow-lg shadow-primary/20"
          />
          <div className="flex flex-col">
            <span className="font-black text-2xl cyber-text bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">CavernaSPY</span>
            <span className="text-sm font-medium text-muted-foreground">Investigação Digital</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse shadow-lg shadow-primary/50"></div>
          <span className="hidden sm:inline font-semibold text-muted-foreground">Sistema Online</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
