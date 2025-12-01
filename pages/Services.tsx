import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { SERVICES } from '../constants';
import { useApplication } from '../context/ApplicationContext';

const Services: React.FC = () => {
  const navigate = useNavigate();
  const { openApplication } = useApplication();

  return (
    <div className="pt-24 pb-16 animate-fade-in bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">Our Expertise</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
            Comprehensive financial solutions designed to meet you where you are.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {SERVICES.map((service, index) => (
            <Card key={index} className="flex flex-col h-full hover:bg-white dark:hover:bg-slate-800 transition-colors border-t-4 border-t-blue-500 text-center md:text-left">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20 mx-auto md:mx-0">
                <service.icon size={32} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-4">{service.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow leading-relaxed">{service.description}</p>
              <ul className="space-y-4 mb-8 inline-block md:block text-left">
                {['Free initial assessment', 'Customized strategy', 'Ongoing support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full text-green-600 dark:text-green-400">
                      <Check size={12} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              {/* Updated CTA to open application modal */}
              <Button variant="outline" onClick={() => openApplication()} className="w-full">
                Start Process
              </Button>
            </Card>
          ))}
          {/* Fill the gap for the last item in 2-column layout if needed */}
          <div className="hidden md:block lg:hidden"></div>
        </div>

        {/* Process Section */}
        <div className="bg-slate-900 dark:bg-black rounded-3xl p-8 md:p-16 text-white overflow-hidden relative shadow-2xl">
          {/* Background pattern */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-16 text-center">The Sterling Process</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 relative">
              {/* Connector Line - Hidden on Mobile */}
              <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
              
              {[
                { step: "01", title: "Discovery", desc: "We chat to understand your financial landscape and goals." },
                { step: "02", title: "Strategy", desc: "I present tailored loan options with clear pros and cons." },
                { step: "03", title: "Approval", desc: "We submit documents and get your loan approved efficiently." },
                { step: "04", title: "Closing", desc: "Funds are disbursed and you achieve your financial goal." }
              ].map((item, idx) => (
                <div key={idx} className="relative bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 text-center lg:text-left">
                   <div className="text-6xl font-bold text-slate-800 absolute -top-8 left-1/2 -translate-x-1/2 lg:left-4 lg:translate-x-0 -z-10 select-none opacity-50">{item.step}</div>
                   <h3 className="text-xl font-bold text-blue-400 mb-3 pt-4 lg:pt-0">{item.title}</h3>
                   <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Not sure which service you need?</h3>
            <Button size="lg" onClick={() => navigate('/contact')}>
                Book a Free 15-min Call
            </Button>
        </div>

      </div>
    </div>
  );
};

export default Services;