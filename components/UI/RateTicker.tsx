
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RateTickerProps {
  className?: string;
}

const RATES = [
  { name: '30-Year Fixed', rate: '6.48%', change: 'down', val: '0.05' },
  { name: '15-Year Fixed', rate: '5.82%', change: 'down', val: '0.03' },
  { name: 'FHA 30-Year', rate: '5.95%', change: 'up', val: '0.01' },
  { name: 'VA 30-Year', rate: '5.75%', change: 'flat', val: '0.00' },
  { name: 'Jumbo 30-Year', rate: '6.85%', change: 'up', val: '0.08' },
  { name: '5/1 ARM', rate: '6.12%', change: 'down', val: '0.10' },
];

const RateTicker: React.FC<RateTickerProps> = ({ className = '' }) => {
  return (
    <div className={`w-full bg-slate-900 text-white border-y border-slate-800 overflow-hidden relative h-12 flex items-center z-[50] ${className}`}>
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none"></div>
      
      {/* Container for scrolling content */}
      <div className="animate-scroll-x flex whitespace-nowrap items-center hover:[animation-play-state:paused]">
        {/* Duplicate list 3 times to ensure seamless infinite scroll */}
        {[...RATES, ...RATES, ...RATES].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 mx-6 text-xs sm:text-sm font-medium">
            <span className="text-slate-400 uppercase tracking-wide">{item.name}</span>
            <span className="font-bold text-white text-base">{item.rate}</span>
            <div className={`flex items-center text-[10px] ${
              item.change === 'down' ? 'text-emerald-400' : item.change === 'up' ? 'text-red-400' : 'text-slate-500'
            }`}>
              {item.change === 'down' && <TrendingDown size={14} className="mr-0.5" />}
              {item.change === 'up' && <TrendingUp size={14} className="mr-0.5" />}
              {item.change === 'flat' && <Minus size={14} className="mr-0.5" />}
              {item.val !== '0.00' && item.val}
            </div>
            <span className="ml-4 text-slate-700">|</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RateTicker;
