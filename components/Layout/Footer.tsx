import React from 'react';
import { ShieldCheck, Facebook, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Social Media Data
  // Using an overlay approach for smooth gradient transitions
  const socialLinks = [
    { 
      icon: Facebook, 
      href: '#', 
      bgClass: 'bg-[#1877F2]',
      iconClass: 'group-hover:text-white'
    },
    { 
      // Custom X Icon (SVG)
      icon: (props: any) => (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ), 
      href: '#', 
      bgClass: 'bg-black dark:bg-white',
      iconClass: 'group-hover:text-white dark:group-hover:text-black' 
    },
    { 
      icon: Linkedin, 
      href: '#', 
      bgClass: 'bg-[#0077b5]',
      iconClass: 'group-hover:text-white'
    },
    { 
      icon: Instagram, 
      href: '#', 
      // Gradient background for IG
      bgClass: 'bg-gradient-to-tr from-[#f09433] via-[#bc1888] to-[#cc2366]',
      iconClass: 'group-hover:text-white'
    }
  ];

  return (
    <footer className="relative bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 mt-24 transition-colors duration-300">
      {/* Curved Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform -translate-y-full">
         <svg className="relative block w-[calc(100%+1.3px)] h-[50px] sm:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
             <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" className="fill-slate-50 dark:fill-slate-900 transition-colors duration-300"></path>
         </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Section (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded text-white"><ShieldCheck size={24} /></div>
              <span className="font-serif font-bold text-2xl text-slate-900 dark:text-white">Sterling<span className="text-blue-500">Loans</span></span>
            </div>
            <p className="text-sm leading-relaxed">
              Modern financing for a changing world. We blend cutting-edge technology with human empathy to deliver the perfect loan experience.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                 <a 
                   key={i} 
                   href={social.href} 
                   className="relative w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center overflow-hidden group"
                   aria-label={`Visit our social page ${i}`}
                 >
                   {/* Background Layer for smooth transition */}
                   <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${social.bgClass}`} />
                   
                   {/* Icon Layer */}
                   <div className={`relative z-10 text-slate-500 dark:text-slate-400 transition-colors duration-300 ${social.iconClass}`}>
                     <social.icon size={18} />
                   </div>
                 </a>
              ))}
            </div>
          </div>

          {/* Contact Section (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-slate-900 dark:text-white font-serif font-semibold text-lg mb-6 relative inline-block">
              Contact
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-blue-500"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <MapPin className="text-blue-500 shrink-0 mt-1" size={18} />
                <span className="text-sm group-hover:text-blue-600 transition-colors">123 Financial District Blvd,<br/>Suite 400, New York, NY 10005</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="text-blue-500 shrink-0" size={18} />
                <span className="text-sm group-hover:text-blue-600 transition-colors">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="text-blue-500 shrink-0" size={18} />
                <span className="text-sm group-hover:text-blue-600 transition-colors">hello@sterlingloans.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Section (5 cols - Wider) */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="text-slate-900 dark:text-white font-serif font-semibold text-lg mb-2">Weekly Insights</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Get the latest market rates, financial tips, and exclusive offers delivered straight to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" 
                />
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-blue-500/30"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col items-center text-xs text-slate-500 dark:text-slate-500">
          <p className="mb-4">&copy; {currentYear} Sterling Loans. All rights reserved. NMLS #123456.</p>
          <div className="flex gap-6">
             <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
             <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;