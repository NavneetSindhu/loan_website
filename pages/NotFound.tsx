import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, Home } from 'lucide-react';
import Button from '../components/UI/Button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-lg w-full text-center space-y-8 animate-fade-in">
        
        {/* Visual */}
        <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-[80px] opacity-20"></div>
            <div className="relative bg-white dark:bg-slate-900 w-32 h-32 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center rotate-12">
               <Key size={48} className="text-slate-300 dark:text-slate-600" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-blue-600 w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center -rotate-6">
                <span className="text-2xl font-bold text-white">404</span>
            </div>
        </div>

        <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white">
                Page Not Found
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                It seems you've stumbled upon a path that doesn't exist. Don't worry, even the best financial plans have detours.
            </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/')} className="shadow-xl shadow-blue-500/20">
                <Home size={18} className="mr-2" /> Return Home
            </Button>
            <Button variant="ghost" onClick={() => navigate('/contact')}>
                Contact Support
            </Button>
        </div>

      </div>
    </div>
  );
};

export default NotFound;