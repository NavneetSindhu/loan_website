import React, { useEffect, useRef } from 'react';

const Spotlight: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!divRef.current) return;
      
      // Cancel previous frame to prevent stacking
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }

      // Sync with browser repaint for smooth movement
      requestRef.current = requestAnimationFrame(() => {
        if (divRef.current) {
          divRef.current.style.opacity = '1';
          // Use translate3d for best performance on the compositor layer
          divRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        }
      });
    };

    const handleMouseLeave = () => {
      if (divRef.current) {
        divRef.current.style.opacity = '0';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-30">
      <div
        ref={divRef}
        className="absolute top-0 left-0 w-[150px] h-[150px] bg-[var(--spotlight-color)] transition-opacity duration-500 will-change-transform"
        style={{
          opacity: 0, // Start invisible
          // Distorted circle shape using complex border-radius
          borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%',
          filter: 'blur(45px)',
          // Center the spotlight relative to the cursor position (half of width/height)
          // Width is 150px, so half is 75px
          marginTop: '-75px',
          marginLeft: '-75px',
        }}
      />
    </div>
  );
};

export default Spotlight;