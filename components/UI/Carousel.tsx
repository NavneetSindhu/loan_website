import React, { useState, useEffect } from 'react';

const IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    title: "Build Your Legacy",
    subtitle: "Premium home loans tailored to your lifestyle."
  },
  {
    url: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    title: "Empower Your Business",
    subtitle: "Capital solutions for visionary entrepreneurs."
  },
  {
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    title: "Invest in Education",
    subtitle: "Smart refinancing for a brighter future."
  }
];

const Carousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-0 bg-slate-900 transition-colors duration-[1500ms]">
      {IMAGES.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* 
            Theme Transition Wrapper
            - Separates the theme transition from the zoom animation to prevent conflict.
            - Light Mode: brightness-75 (Reduces brightness as requested).
            - Dark Mode: brightness-100 but opacity-60 (Standard dimming for dark mode).
            - Transition: duration-[1500ms] for a very smooth shift between sun/moon toggle.
          */}
          <div className="w-full h-full transition-all duration-[1500ms] ease-in-out brightness-75 dark:brightness-100 dark:opacity-60">
            {/* Ken Burns Effect Image */}
            <div 
               className={`w-full h-full bg-cover bg-center transform transition-transform duration-[6000ms] ease-linear ${
                 index === current ? 'scale-110' : 'scale-100'
               }`}
               style={{ backgroundImage: `url(${img.url})` }}
            />
          </div>
          
          {/* Overlays - Smooth transition for gradients as well */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/20 to-transparent dark:from-slate-900/90 dark:via-slate-900/60 dark:to-transparent transition-all duration-[1500ms]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent dark:from-slate-900 dark:via-transparent transition-all duration-[1500ms]"></div>
        </div>
      ))}
    </div>
  );
};

export default Carousel;