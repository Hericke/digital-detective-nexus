
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <header className="border-b border-border bg-card">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/8b79dcd0-43c0-4522-bcb3-fdd451d1a3d5.png" 
            alt="CavernaSPY" 
            className="w-8 h-8 rounded-full"
          />
          <span className="font-bold text-lg">CavernaSPY</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
