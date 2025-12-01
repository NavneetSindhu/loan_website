import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, HelpCircle, Search } from 'lucide-react';
import Button from '../components/UI/Button';
import { FAQS } from '../constants';

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...new Set(FAQS.map(faq => faq.category))];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs = FAQS.filter((faq) => {
      const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
      
      return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-24 pb-16 animate-fade-in min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 mb-6 shadow-lg shadow-blue-500/20">
             <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">Common Questions</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Everything you need to know about the process.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto mb-8 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={20} />
            </div>
            <input 
              type="text" 
              placeholder="Search for answers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4 mb-20">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  openIndex === index 
                    ? 'border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 shadow-xl' 
                    : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900'
                }`}
              >
                <button
                  className="w-full px-8 py-6 flex justify-between items-center text-left focus:outline-none group"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="pr-4">
                     <span className="block text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider mb-1">
                        {faq.category}
                     </span>
                     <span className={`font-bold text-lg group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors ${openIndex === index ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-white'}`}>
                       {faq.question}
                     </span>
                  </div>
                  <span className={`transform transition-transform duration-300 bg-slate-100 dark:bg-slate-800 p-2 rounded-full shrink-0 ${openIndex === index ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}>
                    {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-8 pb-8 text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
               <p className="text-slate-500 dark:text-slate-400 text-lg">No questions found matching your criteria.</p>
               <button onClick={() => { setSearchTerm(''); setActiveCategory('All'); }} className="text-blue-600 dark:text-blue-400 font-medium mt-2 hover:underline">Clear Filters</button>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <h3 className="text-2xl font-serif font-bold mb-4 relative z-10">Still have questions?</h3>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto relative z-10">
            I'm happy to explain any part of the process in plain English. No obligation, just answers.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Button variant="secondary" onClick={() => navigate('/contact')}>
              Contact Me
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" onClick={() => window.location.href = 'tel:+15551234567'}>
              Call Now
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQ;