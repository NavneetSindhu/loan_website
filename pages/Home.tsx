import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Home as HomeIcon, Briefcase, GraduationCap } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Carousel from '../components/UI/Carousel';
import CountUp from '../components/UI/CountUp';
// HeroCustomCursor removed from here and moved to App.tsx
import { LOAN_CATEGORIES, SERVICES } from '../constants';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in overflow-x-hidden">
      {/* Hero Section - Full Viewport Height */}
      {/* Added id="hero-section" and "cursor-none" to hide default mouse */}
      {/* Changed h-screen to h-[100dvh] for better mobile browser support */}
      <section id="hero-section" className="relative h-[100dvh] flex flex-col items-center justify-center text-white cursor-none">
        <Carousel />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col justify-center">
          <div className="max-w-3xl space-y-6 md:space-y-8 animate-fade-up text-center md:text-left mx-auto md:mx-0">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold tracking-wide cursor-none mx-auto md:mx-0">
              <Shield size={14} className="text-amber-400" /> 
              <span>Rated #1 for Customer Satisfaction</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-tight cursor-none">
              Finance Your Dreams <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-white">
                With Confidence
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-200 max-w-xl font-light leading-relaxed cursor-none mx-auto md:mx-0">
              Experience a loan process designed around your life, not your paperwork. Premium service for personal, business, and home financing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <Button size="lg" onClick={() => navigate('/contact')} className="cursor-none w-full sm:w-auto">
                Start Consultation
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20 hover:border-white cursor-none w-full sm:w-auto" onClick={() => navigate('/loans')}>
                Explore Services
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator - Positioned absolutely at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent group cursor-none z-20 pointer-events-auto" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
           <div className="flex flex-col items-center justify-center h-full pb-4 animate-bounce">
             <span className="text-[10px] md:text-xs uppercase tracking-widest text-white/80 font-medium group-hover:text-white transition-colors mb-2">Scroll Down</span>
             <div className="w-6 h-10 md:w-8 md:h-12 border-2 border-white/50 rounded-full flex justify-center group-hover:border-white transition-colors">
               <div className="w-1 h-1 bg-white rounded-full mt-2 animate-ping"></div>
             </div>
           </div>
        </div>
      </section>

      {/* Intro Stats */}
      <section className="relative z-20 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 lg:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x-0 md:divide-x divide-y md:divide-y-0 divide-slate-100 dark:divide-slate-700">
              <div className="space-y-2 pb-6 md:pb-0">
                 <div className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 dark:text-white">
                   <CountUp end={200} prefix="$" suffix="M+" />
                 </div>
                 <div className="text-slate-500 dark:text-slate-400 text-xs md:text-sm uppercase tracking-wider font-medium">Funded Volume</div>
              </div>
              <div className="space-y-2 pb-6 md:pb-0">
                 <div className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 dark:text-white">
                   <CountUp end={15} suffix="+" />
                 </div>
                 <div className="text-slate-500 dark:text-slate-400 text-xs md:text-sm uppercase tracking-wider font-medium">Years Active</div>
              </div>
              <div className="space-y-2 pt-6 md:pt-0">
                 <div className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 dark:text-white">
                   <CountUp end={98} suffix="%" />
                 </div>
                 <div className="text-slate-500 dark:text-slate-400 text-xs md:text-sm uppercase tracking-wider font-medium">Client Approval</div>
              </div>
              <div className="space-y-2 pt-6 md:pt-0">
                 <div className="text-3xl lg:text-4xl font-bold font-serif text-slate-900 dark:text-white">
                   <CountUp end={500} suffix="+" />
                 </div>
                 <div className="text-slate-500 dark:text-slate-400 text-xs md:text-sm uppercase tracking-wider font-medium">5-Star Reviews</div>
              </div>
           </div>
        </div>
      </section>

      {/* Services Section with Floating Elements */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        {/* Animated Background Icons - Hidden on small screens to prevent clutter */}
        <HomeIcon className="hidden md:block absolute top-20 left-10 text-slate-200 dark:text-slate-800 w-64 h-64 opacity-50 animate-float" />
        <Briefcase className="hidden md:block absolute bottom-40 right-10 text-slate-200 dark:text-slate-800 w-48 h-48 opacity-50 animate-float-delayed" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">Holistic Financial Services</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
              We go beyond the transaction to understand the person behind the application.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            {SERVICES.map((service, index) => (
              <Card key={index} className="text-center group h-full flex flex-col justify-between w-full max-w-sm md:max-w-none" hoverEffect>
                <div className="space-y-6">
                   <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-blue-500 to-blue-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 transform group-hover:rotate-6 transition-transform duration-500">
                     <service.icon size={32} />
                   </div>
                   <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">{service.title}</h3>
                   <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{service.description}</p>
                </div>
                <div className="pt-8">
                   <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:underline cursor-pointer">Learn More</span>
                </div>
              </Card>
            ))}
            {/* Center the last item on tablet if 3 items */}
             <div className="hidden md:block lg:hidden"></div>
          </div>
        </div>
      </section>

      {/* Featured Loan Types - Asymmetrical Layout */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-4 text-center md:text-left">
            <div>
              <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">Tailored Solutions</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mt-2">Curated Loan Products</h2>
            </div>
            <Button variant="ghost" onClick={() => navigate('/loans')} className="group">
              View All Options <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LOAN_CATEGORIES.map((loan, idx) => (
              <div 
                key={loan.id} 
                className={`relative group rounded-3xl overflow-hidden cursor-pointer h-80 md:h-96 bg-slate-200 dark:bg-slate-800 ${
                  idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
                onClick={() => navigate('/loans')}
              >
                <div className="w-full h-full bg-slate-200 dark:bg-slate-800">
                   <img 
                    src={loan.image} 
                    alt={loan.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                   />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-8 flex flex-col justify-end">
                   <div className="bg-white/20 backdrop-blur-sm self-start p-2 rounded-lg text-white mb-4">
                     <loan.icon size={24} />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-1">{loan.title}</h3>
                   <p className="text-slate-300 text-sm line-clamp-2 mb-4 opacity-80 group-hover:opacity-100 transition-opacity">
                     {loan.description}
                   </p>
                   <span className="text-white font-medium flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                     View Details <ArrowRight size={16} />
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-900 dark:bg-slate-950">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
           <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500 rounded-full blur-[100px] opacity-20 animate-blob"></div>
           <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-amber-500 rounded-full blur-[100px] opacity-10 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight">
            Ready to rewrite your financial story?
          </h2>
          <p className="text-blue-100 text-lg lg:text-xl mb-10 font-light px-4">
            Skip the generic forms. Let's have a real conversation about your goals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-6 sm:px-0">
            <Button 
              variant="secondary" 
              size="lg" 
              className="font-bold shadow-xl shadow-amber-500/20 w-full sm:w-auto"
              onClick={() => navigate('/contact')}
            >
              Start Your Application
            </Button>
            <Button 
               variant="outline" 
               size="lg"
               className="border-white/30 text-white hover:bg-white/10 hover:border-white w-full sm:w-auto"
               onClick={() => navigate('/calculator')}
            >
              Calculate Payments
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;