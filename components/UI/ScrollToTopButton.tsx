
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen: isChatOpen } = useChat();

  const toggleVisibility = () => {
    // Show only after significant scroll
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Hides the button when the chat is open to prevent visual collision
  const shouldShow = isVisible && !isChatOpen;

  return (
    // Stacked positioning: 
    // bottom-28 = 7rem up from bottom (Chat widget is at bottom-8 = 2rem, + 4rem height = 6rem top edge approx)
    // right-8 = aligned horizontally with Chat widget
    // z-[70] ensures it sits ABOVE the ChatWidget (which is z-[60])
    <div className={`fixed bottom-28 right-8 z-[70] transition-all duration-500 transform ${shouldShow ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
      <button
        onClick={scrollToTop}
        className="
          bg-white/80 dark:bg-slate-800/80 backdrop-blur-md
          hover:bg-white dark:hover:bg-slate-800 
          text-slate-600 dark:text-slate-300 
          p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-700
          transition-all hover:-translate-y-1 focus:outline-none
        "
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
};

export default ScrollToTopButton;