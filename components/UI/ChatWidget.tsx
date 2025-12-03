
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  MessageSquare, X, Send, Sparkles, User, ShieldCheck, 
  Loader2, ChevronDown, ArrowRight, MessageCircle, 
  Star, ThumbsUp, RefreshCw, Bot, ExternalLink 
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  action?: string; // /calculator, /contact, etc.
}

const SYSTEM_INSTRUCTION = `
You are Sterling, the dedicated Senior Mortgage Broker for "Sterling Loans". 
Your tone is professional, empathetic, and knowledgeable about real estate financing.
You help users with: Home Loans, Refinancing, FHA, VA, Jumbo loans, and payment estimations.

Rules:
1. Provide mortgage-specific advice estimates (e.g., closing costs, PMI).
2. Keep responses short and helpful.
3. Mention that rates vary by credit score and market conditions.
4. CRITICAL: If you suggest a tool or page on our website, append a specific action tag at the very end of your response:
   - To estimate payments: [ACTION: /calculator]
   - To apply or contact: [ACTION: /contact]
   - To view loan types: [ACTION: /loans]
   - To see services: [ACTION: /services]
   - To read FAQs: [ACTION: /faq]
   - To learn about us: [ACTION: /about]
`;

const QUICK_ACTIONS = [
  "Current Mortgage Rates",
  "FHA vs Conventional",
  "Refinance Options",
  "First-Time Buyer Help"
];

const TOOLTIP_PROMPTS = [
  "Calculate mortgage payments?",
  "Check today's rates",
  "How much can I borrow?",
  "Refinancing questions?",
  "Chat with Sterling AI"
];

const ChatWidget: React.FC = () => {
  const { isOpen, setIsOpen } = useChat();
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: "Hello! I'm Sterling. How can I help you finance your dream home today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  
  const [tooltipIndex, setTooltipIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(true);
  const tooltipCycleCount = useRef(0);

  const [view, setView] = useState<'chat' | 'feedback'>('chat');
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<any>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Initialize AI
  useEffect(() => {
    if (!chatSessionRef.current && import.meta.env.VITE_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
        chatSessionRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          }
        });
      } catch (error) {
        console.error("Failed to init AI", error);
      }
    }
  }, []);

  // Handle Scroll Visibility (Hide on Home Hero)
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== '/') {
        setIsVisible(true);
        return;
      }
      const threshold = window.innerHeight * 0.8;
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false);
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname, setIsOpen]);

  // Tooltip Cycle
  useEffect(() => {
    if (!showTooltip || isOpen) return;
    const interval = setInterval(() => {
      setTooltipIndex((prev) => {
        const next = (prev + 1) % TOOLTIP_PROMPTS.length;
        if (next === 0) {
          tooltipCycleCount.current += 1;
          if (tooltipCycleCount.current >= 1) {
            setShowTooltip(false);
          }
        }
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [showTooltip, isOpen]);

  // Auto Scroll
  useEffect(() => {
    if (view === 'chat' && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, view, isLoading]);

  // Click Outside to Close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    if (!textToSend.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      let responseText = "";
      if (chatSessionRef.current) {
        const result = await chatSessionRef.current.sendMessage({ message: userMsg.text });
        responseText = result.text;
      } else {
        // DEMO MODE SIMULATION
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const lowerText = userMsg.text.toLowerCase();
        let demoResponse = "I'm in demo mode (no API Key), but I can help you navigate!";
        let demoAction = "";

        if (lowerText.includes('calculate') || lowerText.includes('estimate') || lowerText.includes('payment') || lowerText.includes('cost')) {
            demoResponse = "You can estimate your monthly mortgage payments, including taxes and insurance, using our calculator.";
            demoAction = "[ACTION: /calculator]";
        } else if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('phone') || lowerText.includes('call')) {
            demoResponse = "I'd recommend booking a call with our senior broker, James.";
            demoAction = "[ACTION: /contact]";
        } else if (lowerText.includes('rate') || lowerText.includes('loan') || lowerText.includes('fha') || lowerText.includes('conventional')) {
            demoResponse = "We offer competitive rates for Conventional, FHA, VA, and Jumbo loans. Check out our products.";
            demoAction = "[ACTION: /loans]";
        } else if (lowerText.includes('service') || lowerText.includes('help')) {
            demoResponse = "From first-time purchases to refinancing, we cover it all.";
            demoAction = "[ACTION: /services]";
        } else if (lowerText.includes('faq') || lowerText.includes('question')) {
            demoResponse = "You might find the answer in our Frequently Asked Questions.";
            demoAction = "[ACTION: /faq]";
        } else {
            demoResponse = "I can help you with home loans, refinancing, and payment estimates. Try asking about our calculator!";
        }
        
        responseText = demoResponse + (demoAction ? " " + demoAction : "");
      }

      // Parse for Action Tag
      const actionMatch = responseText.match(/\[ACTION: (.*?)\]/);
      const action = actionMatch ? actionMatch[1] : undefined;
      const cleanText = responseText.replace(/\[ACTION: .*?\]/, '').trim();

      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: cleanText,
        action: action
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { id: 'err', role: 'model', text: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const getActionLabel = (path: string) => {
    switch(path) {
        case '/calculator': return 'Open Mortgage Calculator';
        case '/contact': return 'Contact Us';
        case '/loans': return 'View Loan Options';
        case '/services': return 'Our Services';
        case '/faq': return 'Read FAQs';
        case '/about': return 'Meet the Team';
        default: return 'Learn More';
    }
  };

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setFeedbackSubmitted(true);
      setTimeout(() => {
        setFeedbackSubmitted(false);
        setRating(0);
        setFeedbackText('');
        setView('chat');
      }, 2000);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([{ id: 'init', role: 'model', text: "Hello! I'm Sterling. How can I help you finance your dream home today?" }]);
  };

  return (
    <div 
      ref={widgetRef} 
      className={`fixed bottom-8 right-8 z-[60] flex flex-col items-end transition-transform duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
    >
      <div 
        className={`
          origin-bottom-right transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]
          bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl
          border border-slate-200 dark:border-slate-700
          shadow-2xl rounded-[2rem] overflow-hidden
          flex flex-col
          ${isOpen 
            ? 'w-[90vw] sm:w-[420px] h-[700px] max-h-[70vh] opacity-100 scale-100 mb-6 translate-y-0 pointer-events-auto' 
            : 'w-[60px] h-[60px] opacity-0 scale-90 translate-y-12 mb-0 pointer-events-none'
          }
        `}
      >
        {/* HEADER */}
        <div className="bg-slate-50 dark:bg-slate-950 p-5 flex items-center justify-between shrink-0 relative border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center text-white shadow-lg">
                   <ShieldCheck size={20} />
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-50 dark:border-slate-950"></span>
                </span>
             </div>
             <div>
                <h3 className="text-slate-900 dark:text-white font-serif font-bold text-base leading-none">
                    {view === 'chat' ? 'Sterling AI' : 'Feedback'}
                </h3>
                <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">Online • Mortgage Expert</span>
             </div>
          </div>
          
          <div className="flex items-center gap-1">
            {view === 'chat' && (
              <button onClick={clearChat} className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" title="Clear Chat">
                <RefreshCw size={18} />
              </button>
            )}
            <button 
                onClick={() => setView(view === 'chat' ? 'feedback' : 'chat')}
                className={`p-2 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 ${view === 'feedback' ? 'text-blue-600' : 'text-slate-400 hover:text-blue-600'}`}
                title={view === 'chat' ? 'Give Feedback' : 'Back to Chat'}
            >
                {view === 'chat' ? <MessageSquare size={18} /> : <MessageCircle size={18} />}
            </button>
            <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            >
                <X size={20} />
            </button>
          </div>
        </div>

        {/* CHAT VIEW */}
        {view === 'chat' && (
            <>
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth bg-slate-50/50 dark:bg-black/20">
                    <div className="flex justify-center">
                       <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Today</span>
                    </div>
                    
                    {messages.map((msg) => (
                        <div 
                        key={msg.id} 
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                        <div className={`
                            w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-auto
                            ${msg.role === 'model' ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700' : 'bg-blue-600 text-white'}
                        `}>
                            {msg.role === 'model' ? <Bot size={16} className="text-blue-600 dark:text-blue-400" /> : <User size={16} />}
                        </div>
                        
                        <div className="flex flex-col gap-2 max-w-[80%]">
                            <div 
                                className={`
                                px-4 py-3 text-sm leading-relaxed shadow-sm
                                ${msg.role === 'user' 
                                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-sm' 
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm'
                                }
                                `}
                            >
                                {msg.text}
                            </div>
                            
                            {/* ACTION BUTTON */}
                            {msg.action && (
                                <button 
                                    onClick={() => handleNavigation(msg.action!)}
                                    className="self-start flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:bg-blue-200 dark:hover:bg-blue-900/50 hover:scale-105 active:scale-95 shadow-sm"
                                >
                                    {getActionLabel(msg.action)} <ExternalLink size={12} />
                                </button>
                            )}
                        </div>
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-sm mt-auto">
                                <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    )}

                    {messages.length < 3 && !isLoading && (
                        <div className="grid grid-cols-2 gap-2 mt-2 px-2">
                            {QUICK_ACTIONS.map((action, i) => (
                                <button 
                                key={i}
                                onClick={() => handleSendMessage(action)}
                                className="text-xs text-left px-3 py-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm hover:shadow-md"
                                >
                                {action}
                                </button>
                            ))}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                {/* INPUT AREA */}
                <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <form onSubmit={handleFormSubmit} className="relative">
                        <input 
                            type="text" 
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask about rates, terms..."
                            className="w-full pl-4 pr-12 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !inputText.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 rounded-xl text-white transition-all shadow-md transform hover:scale-105 active:scale-95 flex items-center justify-center"
                        >
                            <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </>
        )}

        {/* FEEDBACK VIEW */}
        {view === 'feedback' && (
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-black/20 relative flex flex-col items-center justify-center">
                {feedbackSubmitted ? (
                    <div className="text-center space-y-4 animate-fade-in">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2 mx-auto">
                            <ThumbsUp size={36} />
                        </div>
                        <h4 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Thank You!</h4>
                        <p className="text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
                            Your feedback helps us improve the Sterling experience.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={submitFeedback} className="w-full space-y-6 animate-fade-in">
                        <div className="text-center">
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Rate your experience</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">How helpful was Sterling AI?</p>
                        </div>
                        <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`transition-all duration-300 transform hover:scale-110 p-1 ${rating >= star ? 'text-amber-400 fill-amber-400 drop-shadow-sm' : 'text-slate-300 dark:text-slate-600'}`}
                                >
                                    <Star size={36} />
                                </button>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Comments</label>
                            <textarea
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                rows={4}
                                required
                                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm resize-none"
                                placeholder="Tell us more..."
                            ></textarea>
                        </div>
                        <button type="submit" disabled={isSubmittingFeedback || rating === 0} className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">
                            {isSubmittingFeedback ? <Loader2 size={18} className="animate-spin" /> : 'Send Feedback'}
                        </button>
                    </form>
                )}
            </div>
        )}
      </div>

      {/* FAB TRIGGER */}
      <button
        onClick={() => {
            setIsOpen(!isOpen);
            setHasUnread(false);
            if (!isOpen) setView('chat');
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative group flex items-center justify-center 
          w-16 h-16 rounded-full 
          shadow-[0_8px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.5)]
          transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) transform z-50
          ${isOpen 
            ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white rotate-90 scale-0 opacity-0' 
            : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rotate-0 scale-100 opacity-100'
          }
        `}
      >
        <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
        {!isOpen && hasUnread && <span className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white dark:border-slate-900 z-10 animate-pulse"></span>}
        <MessageSquare size={28} fill="currentColor" className="opacity-90" />
        
        {/* TOOLTIP */}
        {!isOpen && (showTooltip || isHovered) && (
           <div 
             className={`
               absolute right-20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white 
               px-4 py-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700
               whitespace-nowrap font-medium text-sm flex items-center gap-3
               transition-all duration-500 origin-right
               ${isHovered || (showTooltip && hasUnread) ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 translate-x-4 pointer-events-none'}
             `}
           >
             <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Bot size={16} />
             </div>
             <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Sterling AI</span>
                <span className="inline-block min-w-[140px] transition-opacity duration-300 animate-fade-in leading-none" key={tooltipIndex}>
                    {TOOLTIP_PROMPTS[tooltipIndex]}
                </span>
             </div>
             <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-t border-r border-slate-100 dark:border-slate-700 transform rotate-45"></div>
           </div>
        )}
      </button>

      {/* CLOSE FAB (Visible when Open) */}
      <button
         onClick={() => setIsOpen(false)}
         className={`
            absolute bottom-0 right-0 w-14 h-14 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-white
            shadow-lg flex items-center justify-center
            transition-all duration-500 transform
            ${isOpen ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0 pointer-events-none'}
         `}
      >
         <X size={24} />
      </button>
    </div>
  );
};

export default ChatWidget;
