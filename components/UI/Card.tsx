import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = true, noPadding = false }) => {
  return (
    <div 
      className={`
        bg-white dark:bg-slate-800/50 
        backdrop-blur-sm
        rounded-2xl 
        border border-slate-100 dark:border-slate-700 
        shadow-sm dark:shadow-slate-900/50
        overflow-hidden 
        ${noPadding ? '' : 'p-6'}
        ${hoverEffect ? 'hover:shadow-2xl hover:border-blue-100 dark:hover:border-blue-900/50 hover:-translate-y-1 transition-all duration-500 ease-out' : ''} 
        ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;