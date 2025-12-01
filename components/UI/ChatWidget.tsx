
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, X, Send, Sparkles, User, ShieldCheck, Loader2, ChevronDown, ArrowRight, MessageCircle, Star, ThumbsUp, AlertCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Button from './Button'; // Assuming Button component exists based on other files

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_INSTRUCTION = `
You are Sterling, the dedicated AI Financial Assistant for "Sterling Loans". 
Your tone is professional, empathetic, warm, and concise.
You help users with: Home Loans, Personal Loans, Business Loans, Refinancing, and calculating payments.
Rules:
1. Never give specific financial advice (e.g., "You should buy this stock"). Instead, provide educational info and estimates.
2. If a user asks to apply, direct them to the Contact page.
3. Keep responses short (under 3 sentences) unless asked for a detailed explanation.
4. Use formatting like bullet points for clarity.
5. If asked about rates, mention that rates vary based on credit score (approx 5.5% - 9.5%).
`;

const QUICK_ACTIONS = [
  "Current Interest Rates",
  "Loan Eligibility",
  "Refinancing Options",
  "How to Apply"
];

const TOOLTIP_PROMPTS = [
  "Need a loan estimate?",
  "Check current interest rates",
  "How much can I borrow?",
  "Refinancing questions?",
  "Chat with Sterling AI"
];

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Controls visibility based on scroll/page
  const [messages, setMessages] = useState<Message[]>([
    { id: 'init', role: 'model', text: "Hello! I'm Sterling. How can I help you finance your dreams today?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  
  // Tooltip Logic
  const [tooltipIndex, setTooltipIndex] = useState(0);
  const [showTooltip, setShowTooltip] = useState(true);
  const tooltipCycleCount = useRef(0);

  // Feedback State
  const [view, setView] = useState<'chat' | 'feedback'>('chat');
  const [rating, setRating] = useState(0);
  const [feedbackCategory, setFeedbackCategory] = useState('General');
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<any>(null);

  const location = useLocation();

  // 1. Initialize Gemini Chat Session
  useEffect(() => {
    if (!chatSessionRef.current && process.env.API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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

  // 2. Visibility Logic (Hide on Home Hero)
  useEffect(() => {
    const handleScroll = () => {
      // If we are NOT on home page, always show (unless open)
      if (location.pathname !== '/') {
        setIsVisible(true);
        return;
      }

      // If on Home page, only show if scrolled past 80% of viewport
      const threshold = window.innerHeight * 0.8;
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsOpen(false); // Auto close if user scrolls back to top
      }
    };

    // Run once on mount/route change
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // 3. Rotating Tooltip Logic
  useEffect(() => {
    if (!showTooltip || isOpen) return;

    const interval = setInterval(() => {
      setTooltipIndex((prev) => {
        const next = (prev + 1) % TOOLTIP_PROMPTS.length;
        if (next === 0) {
          tooltipCycleCount.current += 1;
          // Stop showing after 1 full cycle
          if (tooltipCycleCount.current >= 1) {
            setShowTooltip(false);
          }
        }
        return next;
      });
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [showTooltip, isOpen]);

  // 4. Scroll to bottom on new message
  useEffect(() => {
    if (view === 'chat' && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, view]);

  // 5. Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

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
        // Fallback simulation
        await new Promise(resolve => setTimeout(resolve, 1500));
        responseText = "I'm currently in demo mode. I would normally answer: " + userMsg.text;
      }

      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setMessages(prev => [...prev, aiMsg]);
      
    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, { id: 'err', role: 'model', text: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const submitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingFeedback(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingFeedback(false);
      setFeedbackSubmitted(true);
      // Reset form after delay or close?
      setTimeout(() => {
        setFeedbackSubmitted(false);
        setRating(0);
        setFeedbackText('');
        setView('chat'); // Go back to chat
      }, 2000);
    }, 1500);
  };

  return (
    <div 
      ref={widgetRef} 
      className={`fixed bottom-8 right-8 z-[60] flex flex-col items-end transition-transform duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
    >
      
      {/* --- Chat Window --- */}
      <div 
        className={`
          origin-bottom-right transition-all duration-300 ease-in-out
          bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl
          border border-slate-200 dark:border-slate-700
          shadow-2xl rounded-[2rem] overflow-hidden
          flex flex-col
          /* Height Constraints: Never touch top (max-h-70vh) */
          ${isOpen 
            ? 'w-[90vw] sm:w-[480px] h-[750px] max-h-[70vh] opacity-100 scale-100 mb-6 translate-y-0 pointer-events-auto' 
            : 'w-[60px] h-[60px] opacity-0 scale-90 translate-y-12 mb-0 pointer-events-none'
          }
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-5 flex items-center justify-between shrink-0 relative overflow-hidden h-[88px]">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>

          <div className="flex items-center gap-3 relative z-10">
             <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                <ShieldCheck size={24} className="text-white" />
             </div>
             <div>
                <h3 className="text-white font-serif font-bold text-lg leading-tight tracking-wide">
                    {view === 'chat' ? 'Sterling AI' : 'Your Feedback'}
                </h3>
                <div className="flex items-center gap-1.5 opacity-90">
                   {view === 'chat' ? (
                       <>
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                        <span className="text-blue-50 text-xs font-medium">Always Online</span>
                       </>
                   ) : (
                       <span className="text-blue-50 text-xs font-medium">Help us improve</span>
                   )}
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-1 relative z-10">
            {/* Toggle Feedback/Chat */}
            <button 
                onClick={() => setView(view === 'chat' ? 'feedback' : 'chat')}
                className="text-blue-100 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
                title={view === 'chat' ? "Give Feedback" : "Back to Chat"}
            >
                {view === 'chat' ? <MessageCircle size={20} /> : <MessageSquare size={20} />}
            </button>
            <button 
                onClick={() => setIsOpen(false)}
                className="text-blue-100 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
            >
                <ChevronDown size={20} />
            </button>
          </div>
        </div>

        {/* --- VIEW: CHAT --- */}
        {view === 'chat' && (
            <>
                {/* Messages Area */}
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth bg-slate-50/50 dark:bg-black/20">
                
                {/* Date Divider */}
                <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Today</div>

                {messages.map((msg) => (
                    <div 
                    key={msg.id} 
                    className={`flex items-end gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                    {msg.role === 'model' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shrink-0 shadow-md mt-1">
                            <Sparkles size={14} className="text-white" />
                        </div>
                    )}
                    
                    <div 
                        className={`
                        max-w-[85%] px-5 py-3.5 text-sm leading-relaxed shadow-sm
                        ${msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm' 
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-bl-sm'
                        }
                        `}
                    >
                        {msg.text}
                    </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-md">
                        <Sparkles size={14} className="text-white" />
                        </div>
                        <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm border border-slate-100 dark:border-slate-700 shadow-sm flex gap-1.5 items-center h-[46px]">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.15s]"></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.3s]"></div>
                        </div>
                    </div>
                )}

                    {/* Quick Actions (Show only when just initialized or few messages) */}
                    {messages.length < 3 && !isLoading && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {QUICK_ACTIONS.map((action, i) => (
                            <button 
                            key={i}
                            onClick={() => handleSendMessage(action)}
                            className="text-xs text-left p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
                            >
                            {action}
                            </button>
                        ))}
                    </div>
                    )}

                <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0">
                <form 
                    onSubmit={handleFormSubmit}
                    className="relative flex items-center gap-2"
                >
                    <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Ask specific questions..."
                        className="w-full pl-5 pr-12 py-3.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner text-sm"
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !inputText.trim()}
                        className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-full text-white transition-all shadow-md transform hover:scale-105 active:scale-95"
                    >
                        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={18} />}
                    </button>
                </form>
                </div>
            </>
        )}

        {/* --- VIEW: FEEDBACK --- */}
        {view === 'feedback' && (
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-black/20 relative">
                {feedbackSubmitted ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 animate-fade-in">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-2">
                            <ThumbsUp size={40} />
                        </div>
                        <h4 className="text-2xl font-serif font-bold text-slate-900 dark:text-white">Thank You!</h4>
                        <p className="text-slate-600 dark:text-slate-400 max-w-xs">
                            Your feedback helps us make Sterling Loans better for everyone.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={submitFeedback} className="space-y-6 animate-fade-in">
                        <div className="text-center">
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">How was your experience?</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400">We'd love to hear your thoughts.</p>
                        </div>

                        {/* Star Rating */}
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`transition-all duration-300 transform hover:scale-110 ${rating >= star ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                                >
                                    <Star size={32} />
                                </button>
                            ))}
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Feedback Type</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['General', 'Bug', 'Feature'].map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setFeedbackCategory(cat)}
                                        className={`px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                                            feedbackCategory === cat 
                                            ? 'bg-blue-600 text-white border-blue-600' 
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Text Area */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Details</label>
                            <textarea
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                rows={5}
                                required
                                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm resize-none"
                                placeholder="Tell us what you think..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmittingFeedback || rating === 0}
                            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isSubmittingFeedback ? <Loader2 size={18} className="animate-spin" /> : 'Submit Feedback'}
                        </button>
                        
                        {rating === 0 && (
                             <p className="text-xs text-center text-amber-500 flex items-center justify-center gap-1">
                                <AlertCircle size={12} /> Please select a star rating
                             </p>
                        )}
                    </form>
                )}
            </div>
        )}

      </div>

      {/* --- Trigger Button --- */}
      <button
        onClick={() => {
            setIsOpen(!isOpen);
            setHasUnread(false);
            if (!isOpen) setView('chat'); // Reset to chat when opening
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative group flex items-center justify-center 
          w-16 h-16 rounded-full 
          shadow-[0_8px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_40px_rgba(37,99,235,0.5)]
          transition-all duration-300 transform hover:-translate-y-1 z-50
          ${isOpen 
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rotate-90 scale-90' 
            : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rotate-0'
          }
        `}
      >
        {/* Pulse Effect when closed and unread */}
        {!isOpen && hasUnread && (
            <span className="absolute inset-0 rounded-full animate-ping bg-blue-500 opacity-20"></span>
        )}
        
        {isOpen ? <X size={28} /> : <MessageSquare size={28} fill="currentColor" className="opacity-90" />}

        {/* Dynamic Rotating Tooltip */}
        {!isOpen && (showTooltip || isHovered) && (
           <div 
             className={`
               absolute right-20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white 
               px-4 py-2.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700
               whitespace-nowrap font-medium text-sm flex items-center gap-2
               transition-all duration-500 origin-right
               ${isHovered || (showTooltip && hasUnread) ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 translate-x-4 pointer-events-none'}
             `}
           >
             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
             
             {/* Text Slider */}
             <span className="inline-block min-w-[140px] transition-opacity duration-300 animate-fade-in" key={tooltipIndex}>
                {TOOLTIP_PROMPTS[tooltipIndex]}
             </span>

             {/* Triangle pointer */}
             <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-t border-r border-slate-100 dark:border-slate-700 transform rotate-45"></div>
           </div>
        )}
      </button>

    </div>
  );
};

export default ChatWidget;
