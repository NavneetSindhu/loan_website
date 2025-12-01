
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import LoanTypes from './pages/LoanTypes';
import Testimonials from './pages/Testimonials';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Calculator from './pages/Calculator';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ApplicationProvider } from './context/ApplicationContext';
import ScrollToTopButton from './components/UI/ScrollToTopButton';
import Spotlight from './components/UI/Spotlight';
import HeroCustomCursor from './components/UI/HeroCustomCursor';
import ChatWidget from './components/UI/ChatWidget';
import ApplicationModal from './components/UI/ApplicationModal';

// Scroll to top wrapper (Instant on navigation)
const ScrollReset = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Layout with Transition Wrapper
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen font-sans bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Spotlight />
      
      {isHome && <HeroCustomCursor />}
      
      <Navbar />
      
      {/* 
         Main content wrapper.
      */}
      <main className="flex-grow w-full relative z-10">
        {/* Animated Page Transitions */}
        <div key={location.pathname} className="animate-fade-in">
           {children}
        </div>
      </main>
      
      <ScrollToTopButton />
      <ChatWidget />
      <ApplicationModal />
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ApplicationProvider>
          <HashRouter>
            <ScrollReset />
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/loans" element={<LoanTypes />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Explicitly redirect /home to / to ensure consistent landing behavior */}
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/index" element={<Navigate to="/" replace />} />
                
                {/* Catch-all route shows 404 Page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </HashRouter>
        </ApplicationProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;