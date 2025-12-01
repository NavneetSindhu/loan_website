import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, icon, error, className = '', ...props }) => {
  return (
    <div className="group space-y-1">
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`peer w-full ${icon ? 'pl-11' : 'pl-4'} pr-4 py-4 rounded-xl border-2 
          ${error ? 'border-red-300 dark:border-red-900/50' : 'border-slate-200 dark:border-slate-700'} 
          bg-slate-50 dark:bg-slate-900/50
          text-slate-900 dark:text-white
          placeholder-transparent
          focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-0 outline-none transition-all ${className}`}
          placeholder={label}
          {...props}
        />
        <label 
          className={`absolute left-4 ${icon ? 'left-11' : 'left-4'} -top-2.5 bg-slate-50 dark:bg-slate-900 px-1 text-xs font-medium text-slate-500 transition-all pointer-events-none
          peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3.5 
          peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-500 dark:peer-focus:text-blue-400`}
        >
          {label}
        </label>
      </div>
      {error && <p className="text-sm text-red-500 mt-1 pl-1">{error}</p>}
    </div>
  );
};

export default Input;