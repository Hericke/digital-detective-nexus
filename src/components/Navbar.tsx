
import React, { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthForm from "./AuthForm";
import { useAuth } from "@/contexts/AuthContext";
import { useMobile } from "@/hooks/use-mobile";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

const Navbar = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMobile();
  const [showAuthForm, setShowAuthForm] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const onLoginClick = () => {
    setShowAuthForm(true);
  };

  return (
    <nav className="bg-slate-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="flex items-center space-x-2">
          <Shield className="h-6 w-6" />
          <span className="font-bold text-lg">Digital Detective</span>
        </a>
        
        {!isMobile ? (
          <div className="flex items-center space-x-6">
            <a href="/" className="hover:text-blue-300 transition-colors">
              Home
            </a>
            {user && (
              <>
                <a href="/search/history" className="hover:text-blue-300 transition-colors">
                  Histórico
                </a>
                {/* Add Admin Panel link */}
                <a href="/admin" className="hover:text-blue-300 transition-colors">
                  Admin
                </a>
              </>
            )}
            {user ? (
              <Button variant="outline" onClick={signOut} className="text-white border-white hover:bg-white hover:text-slate-900">
                Sair
              </Button>
            ) : (
              <AuthForm />
            )}
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-xl z-10">
                <a
                  href="/"
                  className="block px-4 py-2 text-white hover:bg-slate-700 transition-colors"
                >
                  Home
                </a>
                {user && (
                  <>
                    <a
                      href="/search/history"
                      className="block px-4 py-2 text-white hover:bg-slate-700 transition-colors"
                    >
                      Histórico
                    </a>
                     <a
                      href="/admin"
                      className="block px-4 py-2 text-white hover:bg-slate-700 transition-colors"
                    >
                      Admin
                    </a>
                  </>
                )}
                {user ? (
                  <Button variant="outline" onClick={signOut} className="w-full text-left px-4 py-2 text-white border-white hover:bg-white hover:text-slate-900 rounded-none">
                    Sair
                  </Button>
                ) : (
                  <div className="px-4 py-2">
                    <AuthForm />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
