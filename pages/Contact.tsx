import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, ArrowRight, Clock, Navigation, Linkedin, Facebook, Instagram } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import { useToast } from '../context/ToastContext';

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    // Simple logic to check if business is "Open" (9am - 6pm, Mon-Fri)
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const isOpenNow = day >= 1 && day <= 5 && hour >= 9 && hour < 18;
    setIsOpen(isOpenNow);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      addToast('Message sent successfully! We will contact you soon.', 'success');
    }, 1500);
  };

  // Social Media Data (Matches Footer)
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
    <div className="pt-24 lg:pt-32 pb-16 animate-fade-in bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12 lg:mb-16 space-y-4">
          <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">Get Connected</span>
          <h1 className="text-4xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white">
            Let's Talk Numbers
          </h1>
          <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto px-4">
            Whether you have a specific goal or just questions, I'm here to provide clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Contact Info Side */}
          <div className="lg:col-span-5 space-y-8 order-2 lg:order-1">
            <div className="bg-white dark:bg-slate-800/50 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-10"></div>
              
              <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-8 text-center md:text-left">Contact Info</h2>
              
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 group text-center md:text-left">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Phone</h3>
                      <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">+1 (555) 123-4567</p>
                      <div className="text-sm text-slate-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                         {isOpen ? (
                           <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-xs">
                             <span className="relative flex h-2 w-2">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                             </span>
                             Open Now
                           </span>
                         ) : (
                           <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Closed</span>
                         )}
                         <span>Mon-Fri 9am-6pm EST</span>
                      </div>
                    </div>
                </div>

                {/* Email */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 group text-center md:text-left">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Email</h3>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">james@sterlingloans.com</p>
                      <p className="text-sm text-slate-400 mt-1">Response within 24h</p>
                    </div>
                </div>

                {/* Office */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 group text-center md:text-left">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-slate-700 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Office</h3>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">123 Financial District Blvd</p>
                      <p className="text-sm text-slate-400 mt-1">Suite 400, New York, NY 10005</p>
                    </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-center md:text-left">Connect on Social</h3>
                <div className="flex justify-center md:justify-start gap-3">
                  {socialLinks.map((social, idx) => (
                    <a 
                      key={idx} 
                      href={social.href} 
                      className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden group shadow-sm"
                    >
                      {/* Background Layer for smooth transition */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${social.bgClass}`} />
                      
                      {/* Icon Layer */}
                      <div className={`relative z-10 text-slate-600 dark:text-slate-300 transition-colors duration-300 ${social.iconClass}`}>
                        <social.icon size={18} />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Map */}
             <div className="w-full h-48 md:h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-inner relative group">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00980168459418!3d40.71328497933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a1905307f59%3A0xc6c766b3f7f0e8f!2sFinancial%20District%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus" 
                  width="100%" 
                  height="100%" 
                  style={{border:0}} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  title="Office Map"
                  className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100"
                ></iframe>
                
                {/* Overlay CTA */}
                <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                   <a 
                     href="https://maps.google.com" 
                     target="_blank" 
                     rel="noreferrer"
                     className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg flex items-center gap-2 hover:bg-blue-700"
                   >
                     <Navigation size={14} /> Get Directions
                   </a>
                </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <Card className="p-6 md:p-8 lg:p-10 h-full border-t-4 border-t-blue-500">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4 animate-bounce">
                  <Send size={48} />
                </div>
                <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Message Received</h3>
                <p className="text-slate-600 dark:text-slate-300 max-w-md">
                  Thank you for reaching out. I've received your details and will review your inquiry personally within 24 hours.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-center md:text-left">
                   <h2 className="text-2xl font-serif font-bold text-slate-900 dark:text-white mb-2">Send a Message</h2>
                   <p className="text-slate-500">Fill out the form below and I'll get back to you shortly.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Full Name" type="text" required />
                  <Input label="Phone Number" type="tel" required />
                </div>

                <Input label="Email Address" type="email" required />

                <div className="space-y-2 group">
                  <label className="text-sm font-medium text-slate-500 dark:text-slate-400 pl-4">I'm interested in...</label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option>Home Loan / Mortgage</option>
                      <option>Personal Loan</option>
                      <option>Business Loan</option>
                      <option>Refinancing</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ArrowRight size={16} className="text-slate-400 rotate-90" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 group">
                  <textarea 
                    rows={4}
                    required
                    className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all resize-none placeholder-transparent peer"
                    placeholder="Message"
                    id="message"
                  ></textarea>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-500 pl-4 transition-all peer-placeholder-shown:text-slate-400 pointer-events-none">
                    How can I help you achieve your goals?
                  </label>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-4 text-lg shadow-xl shadow-blue-500/20" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" /> Processing...
                    </span>
                  ) : (
                    "Send Request"
                  )}
                </Button>
              </form>
            )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;