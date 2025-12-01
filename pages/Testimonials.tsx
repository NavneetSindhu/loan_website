import React from 'react';
import { Quote, Star, PlayCircle } from 'lucide-react';
import Card from '../components/UI/Card';
import { TESTIMONIALS } from '../constants';

const Testimonials: React.FC = () => {
  return (
    <div className="pt-24 pb-16 animate-fade-in bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">Client Stories</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Don't just take my word for it. Here's what real families have to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {TESTIMONIALS.map((t) => (
            <Card key={t.id} className="relative pt-12 group !overflow-visible mt-6" hoverEffect>
              <div className="absolute -top-6 left-8">
                 <img 
                   src={t.avatar} 
                   alt={t.name} 
                   className="w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-800 shadow-lg object-cover" 
                 />
              </div>
              <div className="mb-6 pl-2 mt-2">
                 <h3 className="font-bold text-xl text-slate-900 dark:text-white">{t.name}</h3>
                 <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{t.role}</p>
                 <div className="flex gap-1 text-amber-400 mt-2">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                 </div>
              </div>
              <div className="relative">
                 <Quote size={40} className="text-blue-100 dark:text-slate-800 absolute -top-4 right-0" />
                 <p className="text-slate-600 dark:text-slate-300 italic relative z-10 leading-relaxed">"{t.quote}"</p>
              </div>
            </Card>
          ))}
          
          <Card className="relative pt-12 group bg-blue-600 text-white border-none !overflow-visible mt-6" hoverEffect>
              <div className="absolute -top-6 left-8">
                 <img src="https://picsum.photos/100/100?random=5" alt="Robert F." className="w-20 h-20 rounded-2xl border-4 border-blue-500 shadow-lg object-cover" />
              </div>
              <div className="mb-6 pl-2 mt-2">
                 <h3 className="font-bold text-xl text-white">Robert Fox</h3>
                 <p className="text-sm text-blue-200 font-medium">Real Estate Investor</p>
                 <div className="flex gap-1 text-amber-400 mt-2">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                 </div>
              </div>
              <div className="relative">
                 <Quote size={40} className="text-blue-500 absolute -top-4 right-0" />
                 <p className="text-blue-100 italic relative z-10 leading-relaxed">"I've worked with many lenders, but Sterling Loans offers the best communication and fastest closing times."</p>
              </div>
            </Card>
        </div>

        {/* Video Placeholder Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-12 shadow-2xl border border-slate-100 dark:border-slate-800">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div>
                <span className="text-blue-600 font-bold tracking-widest uppercase text-xs">Case Study</span>
                <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6 mt-2">The Anderson Family</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  Watch how we helped the Anderson family avoid foreclosure and refinance into a stable, lower-interest mortgage that saved them $600/month.
                </p>
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border-l-4 border-blue-500">
                  <p className="text-slate-800 dark:text-white font-serif italic text-lg">"We thought we were out of options. James found a way when no one else could."</p>
                </div>
             </div>
             <div className="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden group cursor-pointer shadow-2xl">
                <img src="https://picsum.photos/800/450?grayscale" alt="Video Thumbnail" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 transform group-hover:scale-105" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-white/30">
                      <PlayCircle size={40} className="text-white fill-white/20" />
                   </div>
                </div>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Testimonials;