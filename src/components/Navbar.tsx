
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  onLoginClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const { user, signOut, loading } = useAuth();
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
        
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="animate-pulse w-20 h-9 bg-muted rounded"></div>
          ) : user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm">
                <User className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">{user.email?.split('@')[0]}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onLoginClick}
            >
              <LogIn className="w-4 h-4 mr-1" />
              Entrar
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
