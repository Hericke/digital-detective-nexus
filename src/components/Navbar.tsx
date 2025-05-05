
import React from 'react';
import { Search, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className }) => {
  return (
    <nav className={cn('w-full py-4 px-6 flex items-center justify-between bg-card shadow-md', className)}>
      <div className="flex items-center space-x-2">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-xl font-bold cyber-text">Digital Detective Nexus</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="bg-muted p-2 rounded-full hover:bg-muted/70 transition-colors">
          <Search className="w-5 h-5 text-primary" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
