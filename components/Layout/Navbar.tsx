import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { NAV_ITEMS } from '../../constants';
import Button from '../UI/Button';
import ThemeToggle from '../UI/ThemeToggle';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Dynamic text color based on scroll and page
  const getTextColor = () => {
    if (isOpen) return 'text-slate-900 dark:text-white';
    if (scrolled) return 'text-slate-900 dark:text-white';
    if (isHome && !isOpen) return 'text-white'; // Always white on Home hero before scroll
    return 'text-slate-900 dark:text-white'; // Default for other pages
  };

  const getNavContainerClass = () => {
    if (isOpen) return 'bg-transparent border-transparent'; // Transparent so overlay shows through
    if (scrolled) return 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-slate-200 dark:border-slate-800 shadow-lg py-3';
    return 'bg-transparent border-transparent py-5';
  };

  const getLinkClass = (isActive: boolean) => {
    if (scrolled || !isHome) {
      // Standard styling (scrolled or not home)
      return isActive 
        ? 'text-blue-600 dark:text-blue-400' 
        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400';
    } else {
      // Home page transparent header styling
      return isActive
        ? 'text-white font-bold'
        : 'text-white/80 hover:text-white';
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[120] transition-all duration-300 border-b ${getNavContainerClass()}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group relative z-50">
              <div className="relative">
                 <div className={`absolute inset-0 bg-blue-600 blur opacity-40 rounded-lg group-hover:opacity-60 transition-opacity`}></div>
                 <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg text-white shadow-xl">
                   <ShieldCheck size={24} />
                 </div>
              </div>
              <span className={`font-serif font-bold text-xl tracking-wide transition-colors duration-300 ${getTextColor()}`}>
                Sterling<span className={isHome && !scrolled && !isOpen ? 'text-blue-300' : 'text-blue-600 dark:text-blue-400'}>Loans</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6">
              <div className={`flex items-center px-6 py-2 rounded-full border transition-all duration-300 ${
                scrolled 
                  ? 'bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border-slate-200 dark:border-slate-700 shadow-sm' 
                  : isHome ? 'bg-white/10 backdrop-blur-sm border-white/10' : 'bg-slate-100 dark:bg-slate-800 border-transparent'
              }`}>
                {NAV_ITEMS.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-3 py-1 text-sm font-medium transition-all duration-300 relative group ${getLinkClass(isActive)}`}
                    >
                      {item.label}
                      <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100 ${
                        isHome && !scrolled ? 'bg-white' : 'bg-blue-600'
                      }`}></span>
                    </Link>
                  );
                })}
              </div>
              
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Button 
                  id="nav-get-started"
                  size="sm" 
                  onClick={() => window.location.hash = '#/contact'}
                  className={isHome && !scrolled ? 'shadow-white/20 cursor-none' : ''}
                >
                  Get Started
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button - Styled Premium & Animated */}
            <div className="lg:hidden flex items-center gap-4 relative z-50">
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                  relative w-12 h-12 rounded-xl transition-all duration-300 backdrop-blur-md border flex flex-col justify-center items-center gap-1.5
                  ${isOpen 
                    ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg' 
                    : isHome && !scrolled 
                      ? 'bg-white/10 border-white/20' 
                      : 'bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                  }
                `}
                aria-label="Toggle menu"
              >
                {/* Animated Hamburger Lines */}
                <span className={`w-6 h-0.5 rounded-full transition-all duration-300 ${
                  isOpen ? 'rotate-45 translate-y-2 bg-slate-900 dark:bg-white' : (isHome && !scrolled ? 'bg-white' : 'bg-slate-900 dark:bg-white')
                }`}></span>
                <span className={`w-6 h-0.5 rounded-full transition-all duration-300 ${
                  isOpen ? 'opacity-0' : (isHome && !scrolled ? 'bg-white' : 'bg-slate-900 dark:bg-white')
                }`}></span>
                <span className={`w-6 h-0.5 rounded-full transition-all duration-300 ${
                  isOpen ? '-rotate-45 -translate-y-2 bg-slate-900 dark:bg-white' : (isHome && !scrolled ? 'bg-white' : 'bg-slate-900 dark:bg-white')
                }`}></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Full Screen Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Glass Background */}
        <div className={`absolute inset-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl transition-all duration-500 ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-[100px] opacity-20"></div>

          <div className="h-full flex flex-col justify-center px-6 pt-24 pb-12 overflow-y-auto">
             <div className="space-y-4 flex flex-col items-center">
                {NAV_ITEMS.map((item, index) => {
                   const isActive = location.pathname === item.path;
                   return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      style={{ transitionDelay: `${index * 50}ms` }}
                      className={`
                        group flex items-center gap-3 text-3xl font-serif font-bold transition-all duration-500 transform
                        ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
                        ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}
                      `}
                    >
                      <span>{item.label}</span>
                      {isActive && <ChevronRight size={24} className="animate-pulse" />}
                    </Link>
                   );
                })}
                
                {/* CTA In Menu */}
                <div 
                  className={`pt-8 w-full max-w-xs transition-all duration-500 transform delay-500 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                >
                   <Button className="w-full text-lg py-4 shadow-xl" onClick={() => { setIsOpen(false); window.location.hash = '#/contact'; }}>
                     Start Your Application
                   </Button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;