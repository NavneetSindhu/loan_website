import React, { useEffect, useRef, useState } from 'react';
import { Key } from 'lucide-react';

const HeroCustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 1. Move the cursor visual
      if (cursorRef.current) {
        // Use translate3d for hardware acceleration
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      // 2. Logic Check
      const heroSection = document.getElementById('hero-section');
      const target = e.target as HTMLElement;
      
      // Is inside Hero?
      const isInsideHero = heroSection?.contains(target);
      // Is the specific Nav Button?
      const isNavCta = target.closest('#nav-get-started');

      if (isInsideHero || isNavCta) {
        setIsVisible(true);
        // Is hovering interactive element (button, link, or anything with role="button")
        const clickable = target.closest('button, a, [role="button"]');
        setIsHovering(!!(clickable || isNavCta));
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{ marginTop: '-28px', marginLeft: '-28px' }} // Center offset (half of max width approx)
    >
      <div 
        className={`
          relative flex items-center justify-center 
          transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
          rounded-full
          ${isHovering 
            ? 'w-16 h-16 bg-white shadow-[0_0_40px_rgba(59,130,246,0.6)] scale-110' 
            : 'w-12 h-12 bg-white/10 backdrop-blur-md border border-white/40 shadow-xl'
          }
        `}
      >
        {/* Key Icon (Default state) */}
        <div className={`absolute transition-all duration-500 ease-out ${isHovering ? 'opacity-0 scale-50 rotate-180' : 'opacity-100 scale-100 rotate-45'}`}>
           <Key size={20} className="text-white drop-shadow-md" strokeWidth={2.5} />
        </div>
        
        {/* Premium Home Icon (Hover state) */}
        <div className={`absolute transition-all duration-500 ease-out ${isHovering ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`}>
           {/* Custom Premium House SVG */}
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 drop-shadow-sm">
              <path d="M11.213 2.502L2.686 9.324C2.268 9.658 2 10.198 2 10.79V20C2 21.105 2.895 22 4 22H20C21.105 22 22 21.105 22 20V10.79C22 10.198 21.732 9.658 21.314 9.324L12.787 2.502C12.33 2.137 11.67 2.137 11.213 2.502Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 14V17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="15.5" r="1.5" fill="white"/>
           </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroCustomCursor;