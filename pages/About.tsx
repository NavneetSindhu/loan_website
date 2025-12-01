import React from 'react';
import { Award, Briefcase, Heart } from 'lucide-react';
import Card from '../components/UI/Card';

const About: React.FC = () => {
  return (
    <div className="pt-24 pb-16 animate-fade-in bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">Meet Your Partner</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
            More than just a lender. A dedicated strategist for your financial success.
          </p>
        </div>

        {/* Changed items-center to items-start to prevent text shift on load */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-24">
          <div className="relative group max-w-md mx-auto lg:max-w-none w-full">
             {/* Decorative background shape */}
             <div className="absolute inset-0 bg-blue-600 rounded-2xl transform translate-x-4 translate-y-4 -z-10 transition-transform group-hover:translate-x-6 group-hover:translate-y-6"></div>
             
             {/* Image container with fixed aspect ratio to prevent layout shift */}
             <div className="aspect-[6/7] w-full rounded-2xl shadow-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
               <img 
                 src="https://picsum.photos/seed/agent/600/700" 
                 alt="James Sterling" 
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 absolute inset-0"
                 loading="eager"
               />
             </div>
          </div>
          <div className="space-y-8 text-center lg:text-left pt-4">
            <div>
               <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Hi, I'm James Sterling.</h2>
               <h3 className="text-xl text-blue-600 dark:text-blue-400 font-medium mt-2">Senior Loan Officer & Financial Strategist</h3>
            </div>
            <div className="prose dark:prose-invert text-slate-600 dark:text-slate-300 space-y-4 mx-auto lg:mx-0">
               <p>
                 With over 15 years in the banking and lending industry, I realized that most people don't need just a loan—they need a strategy. I founded Sterling Loans to provide a human-centered approach to finance, moving away from cold algorithms and toward genuine relationships.
               </p>
               <p>
                 I specialize in complex income scenarios, self-employed borrowers, and first-time homebuyers who need that extra bit of education and patience. My goal is to ensure you understand every paper you sign and feel confident about your financial future.
               </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm justify-center lg:justify-start">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2.5 rounded-lg text-blue-600 dark:text-blue-400"><Award size={24}/></div>
                <span className="font-bold text-slate-800 dark:text-white">Top 1% Originator</span>
              </div>
              <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm justify-center lg:justify-start">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2.5 rounded-lg text-blue-600 dark:text-blue-400"><Briefcase size={24}/></div>
                <span className="font-bold text-slate-800 dark:text-white">15+ Years Experience</span>
              </div>
            </div>
            <div className="pt-6">
               <div className="text-4xl font-serif italic text-slate-400 dark:text-slate-600 opacity-80">James Sterling</div>
            </div>
          </div>
        </div>

        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">My Core Values</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Empathy First", text: "I understand that behind every loan application is a human story, a family, and a dream. I treat your application with the care it deserves." },
              { icon: Award, title: "Radical Transparency", text: "No jargon. No hidden fees. Just clear, honest communication about rates, terms, and what you can realistically afford." },
              { icon: Briefcase, title: "Efficiency", text: "In this market, time is money. I leverage modern technology to close loans faster without cutting corners." }
            ].map((item, i) => (
              <Card key={i} className="text-center group p-8" hoverEffect>
                <div className="mx-auto w-16 h-16 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;