import React, { useEffect, useState } from 'react';
import { X, AlertCircle, Info, Key, Home } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

const ToastItem: React.FC<ToastProps> = ({ id, message, type, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [width, setWidth] = useState(100);
  const DURATION = 5000; // 5 seconds

  const handleClose = () => {
    setIsExiting(true);
    // Wait for the exit transition (duration-700 = 700ms)
    setTimeout(() => {
      onClose(id);
    }, 700);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, DURATION);

    const interval = setInterval(() => {
      setWidth((prev) => {
        if (prev <= 0) return 0;
        return prev - (100 / (DURATION / 50));
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // --- SUCCESS VARIANT (STERLING HOME KEY SCENE) ---
  if (type === 'success') {
    return (
      <div 
        className={`
          relative w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl 
          bg-slate-900 border border-slate-800
          transform transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isExiting ? 'translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100 translate-y-0'}
          animate-fade-up
        `}
      >
        {/* Native Brand Blue Accent Line */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-400 to-blue-600"></div>

        <div className="p-5 pl-7 flex items-start gap-5">
             {/* Mini Animation Scene */}
             <div className="shrink-0 relative w-12 h-12 flex items-center justify-center">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                
                <div className="relative w-12 h-12 bg-slate-800 rounded-xl border border-slate-700 shadow-inner flex items-center justify-center overflow-hidden">
                     {/* House Icon (Static -> Pulse) */}
                     <Home size={22} className="text-slate-400 absolute mb-1 animate-house-pulse" strokeWidth={1.5} />
                     
                     {/* Key Icon (Enters & Unlocks) */}
                     <Key size={14} className="text-blue-400 absolute bottom-2 right-2 animate-key-enter" fill="currentColor" />
                </div>
             </div>

             {/* Text Section */}
             <div className="flex-1 pt-0.5">
                <h4 className="text-white font-serif font-bold text-lg leading-tight mb-1 tracking-wide">
                  Welcome Home
                </h4>
                <p className="text-blue-100/80 text-sm font-medium leading-relaxed pr-2">
                  {message}
                </p>
             </div>

             {/* Close Button */}
             <button 
                onClick={handleClose} 
                className="text-slate-500 hover:text-white transition-colors p-1"
             >
                <X size={18} />
             </button>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-slate-800 w-full">
            <div 
                className="h-full bg-blue-500 transition-all duration-100 ease-linear"
                style={{ width: `${width}%` }}
            ></div>
        </div>
      </div>
    );
  }

  // --- STANDARD VARIANTS (Error / Info) ---
  const config = {
    error: {
      icon: <AlertCircle size={20} className="text-red-500" />,
      bg: 'bg-white dark:bg-slate-900',
      border: 'border-l-red-500',
      title: 'Attention',
      bar: 'bg-red-500'
    },
    info: {
      icon: <Info size={20} className="text-blue-500" />,
      bg: 'bg-white dark:bg-slate-900',
      border: 'border-l-blue-500',
      title: 'Note',
      bar: 'bg-blue-500'
    }
  }[type];

  return (
    <div className={`
      relative w-full max-w-sm rounded-xl shadow-xl overflow-hidden
      flex flex-col
      transform transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
      border border-slate-100 dark:border-slate-800 border-l-4
      ${config.border} ${config.bg}
      ${isExiting ? 'translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100'}
      animate-fade-up
    `}>
      <div className="p-5 flex items-start gap-4">
        <div className="shrink-0 mt-0.5">{config.icon}</div>
        <div className="flex-1">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 uppercase tracking-wider opacity-70">
            {config.title}
          </h4>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
            {message}
          </p>
        </div>
        <button 
          onClick={handleClose} 
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 w-full bg-slate-100 dark:bg-slate-800">
         <div 
            className={`h-full transition-all duration-100 ease-linear ${config.bar}`}
            style={{ width: `${width}%` }}
         ></div>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: Omit<ToastProps, 'onClose'>[], removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col gap-4 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem {...toast} onClose={removeToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastItem;