import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, DollarSign, UserCheck } from 'lucide-react';
import Button from '../components/UI/Button';
import { LOAN_CATEGORIES } from '../constants';
import { useApplication } from '../context/ApplicationContext';

const LoanTypes: React.FC = () => {
  const navigate = useNavigate();
  const { openApplication } = useApplication();
  
  // Set default filter to 'home' as requested
  const [filter, setFilter] = useState('home');

  const filteredLoans = filter === 'all' 
    ? LOAN_CATEGORIES 
    : LOAN_CATEGORIES.filter(loan => loan.id === filter);

  const filters = [
    { id: 'all', label: 'All Products' },
    { id: 'home', label: 'Home' },
    { id: 'personal', label: 'Personal' },
    { id: 'business', label: 'Business' },
    { id: 'education', label: 'Education' },
  ];

  const handleApply = (loanTitle: string) => {
    openApplication(loanTitle);
  };

  return (
    <div className="pt-24 pb-16 animate-fade-in bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6">Loan Products</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Explore our diverse range of lending options tailored to your needs.
          </p>
          
          {/* Filter Bar */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {filters.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-full font-medium transition-all duration-300 border ${
                  filter === f.id
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/30'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-24 min-h-[600px]">
          {filteredLoans.map((loan, index) => (
            <div 
              key={loan.id} 
              // Changed layout logic: Stack on tablet/mobile (flex-col), zig-zag only on desktop (lg:flex-row/reverse)
              className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-20 items-center animate-fade-up`}
            >
              {/* Content */}
              <div className="flex-1 space-y-8 w-full text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold tracking-wide">
                  <loan.icon size={16} /> {loan.title.toUpperCase()}
                </div>
                
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white">{loan.title}</h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{loan.description}</p>
                
                <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-left">
                   {/* Key Info Grid */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                          <UserCheck size={16} /> Eligibility
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">{loan.eligibility}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                          <DollarSign size={16} /> Max Amount
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">{loan.maxAmount}</div>
                      </div>
                   </div>

                   <h4 className="font-semibold text-slate-900 dark:text-white mb-6">Key Features:</h4>
                   <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                     {loan.features.map((feature, i) => (
                       <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                         <div className="bg-green-100 dark:bg-green-900/50 p-1 rounded-full flex-shrink-0">
                           <Check size={14} className="text-green-600 dark:text-green-400"/>
                         </div>
                         <span className="text-sm">{feature}</span>
                       </li>
                     ))}
                   </ul>

                   <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-center sm:text-left">
                        <span className="text-sm text-slate-500 dark:text-slate-400">Rates starting at</span>
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{loan.minRate} <span className="text-sm font-normal text-slate-500">APR*</span></div>
                      </div>
                      <Button onClick={() => handleApply(loan.title)} className="w-full sm:w-auto">Apply Now</Button>
                   </div>
                </div>
              </div>

              {/* Visual */}
              <div className="flex-1 w-full relative group">
                {/* Decorative element */}
                <div className={`absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-transparent opacity-20 blur-xl transition-all duration-500 group-hover:opacity-40`}></div>
                
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl h-[300px] sm:h-[400px] lg:h-[500px] bg-slate-200 dark:bg-slate-800">
                   <img 
                    src={loan.image} 
                    alt={loan.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredLoans.length === 0 && (
             <div className="text-center py-20 text-slate-500">
                No loans found for this category.
             </div>
          )}
        </div>

        {/* COMPARISON TABLE */}
        <div className="mt-32 mb-12 animate-fade-up">
           <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">Compare Loan Options</h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">See how our products stack up to find the right fit for you.</p>
           </div>

           <div className="overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="inline-block min-w-full align-middle">
                <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl bg-white dark:bg-slate-900">
                  <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th scope="col" className="p-6 text-left text-sm font-bold text-slate-900 dark:text-white font-serif uppercase tracking-wider min-w-[150px]">
                           Features
                        </th>
                        {LOAN_CATEGORIES.map((loan) => (
                           <th key={loan.id} scope="col" className="p-6 text-left min-w-[200px]">
                              <div className="flex items-center gap-2 font-serif font-bold text-slate-900 dark:text-white text-lg">
                                 <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                                    <loan.icon size={20} />
                                 </div>
                                 {loan.title}
                              </div>
                           </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                       {/* Interest Rate */}
                       <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="p-6 whitespace-nowrap text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50/30 dark:bg-slate-900/30">
                             Interest Rate
                          </td>
                          {LOAN_CATEGORIES.map((loan) => (
                             <td key={loan.id} className="p-6 whitespace-nowrap">
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{loan.minRate}</span>
                                <span className="text-xs text-slate-500 ml-1">APR*</span>
                             </td>
                          ))}
                       </tr>

                       {/* Max Amount */}
                       <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="p-6 whitespace-nowrap text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50/30 dark:bg-slate-900/30">
                             Max Amount
                          </td>
                          {LOAN_CATEGORIES.map((loan) => (
                             <td key={loan.id} className="p-6 whitespace-nowrap text-slate-700 dark:text-slate-300 font-medium">
                                {loan.maxAmount}
                             </td>
                          ))}
                       </tr>

                       {/* Eligibility */}
                       <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="p-6 whitespace-nowrap text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50/30 dark:bg-slate-900/30">
                             Eligibility
                          </td>
                          {LOAN_CATEGORIES.map((loan) => (
                             <td key={loan.id} className="p-6 text-sm text-slate-600 dark:text-slate-400">
                                {loan.eligibility}
                             </td>
                          ))}
                       </tr>

                       {/* Features */}
                       <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="p-6 text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-50/30 dark:bg-slate-900/30 align-top">
                             Key Benefits
                          </td>
                          {LOAN_CATEGORIES.map((loan) => (
                             <td key={loan.id} className="p-6 align-top">
                                <ul className="space-y-3">
                                   {loan.features.map((feature, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                         <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                                         <span>{feature}</span>
                                      </li>
                                   ))}
                                </ul>
                             </td>
                          ))}
                       </tr>

                       {/* CTA */}
                       <tr>
                          <td className="p-6 bg-slate-50/30 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-800"></td>
                          {LOAN_CATEGORIES.map((loan) => (
                             <td key={loan.id} className="p-6 border-t border-slate-200 dark:border-slate-800">
                                <Button className="w-full shadow-lg" size="sm" onClick={() => handleApply(loan.title)}>
                                   Apply Now
                                </Button>
                             </td>
                          ))}
                       </tr>
                    </tbody>
                  </table>
                </div>
              </div>
           </div>
        </div>
        
        <div className="mt-20 p-6 bg-slate-100 dark:bg-slate-900 rounded-xl text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">* Annual Percentage Rate (APR) shown is for qualified borrowers and is subject to change without notice. Your actual rate may vary based on credit history and loan terms.</p>
        </div>

      </div>
    </div>
  );
};

export default LoanTypes;