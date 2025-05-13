
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, User, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  onLoginClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
  const { user, signOut, loading } = useAuth();

  return (
    <header className="border-b border-border bg-card">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            DD
          </div>
          <span className="font-bold text-lg">Digital Detective</span>
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
