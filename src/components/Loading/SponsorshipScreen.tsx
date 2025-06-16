import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const SponsorshipScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/spaces');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8 animate-pulse">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Sparkles className="w-16 h-16 text-white animate-spin" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Exploring Spaces
        </h1>
        
        <p className="text-white/80 text-xl mb-8">
          Powered by ENFOR - Educational Innovation Network
        </p>
        
        <div className="w-64 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-white rounded-full animate-pulse"></div>
        </div>
        
        <p className="text-white/60 text-sm mt-4">
          Loading your space exploration journey...
        </p>
      </div>
    </div>
  );
};