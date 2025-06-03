
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import YouTubeSearch from '@/components/YouTubeSearch';
import Navbar from '@/components/Navbar';

const YouTubeSearchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
        <YouTubeSearch />
      </div>
    </div>
  );
};

export default YouTubeSearchPage;
