import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
      aria-label="Toggle Dark Mode"
    >
      <div
        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-500 ease-out flex items-center justify-center ${
          theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {theme === 'light' ? (
          <Sun size={12} className="text-amber-500 animate-spin-slow" />
        ) : (
          <Moon size={12} className="text-blue-600" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;