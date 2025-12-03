
import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Download, CheckCircle, ChevronRight, ChevronLeft, Loader2, ShieldCheck, User, MapPin, Phone, Calendar } from 'lucide-react';
import { useApplication } from '../../context/ApplicationContext';
import { useToast } from '../../context/ToastContext';
import Button from './Button';
import Input from './Input';

const STEPS = ['Personal', 'Employment', 'Financial', 'Loan Details'];

const STORAGE_KEY = 'sterling_app_draft';

const INITIAL_DATA = {
  // Personal
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  dob: '',
  maritalStatus: 'Single',
  
  // Employment
  employer: '',
  jobTitle: '',
  yearsEmployed: '',
  annualIncome: '',
  employmentStatus: 'Employed',

  // Financial
  totalAssets: '',
  totalLiabilities: '',
  creditScore: 'Excellent (720+)',
  bankruptcy: 'No',

  // Loan
  loanType: 'Conventional Loan',
  loanAmount: '',
  loanPurpose: 'Purchase',
  comments: ''
};

const ApplicationModal: React.FC = () => {
  const { isOpen, closeApplication, prefillLoanType } = useApplication();
  const { addToast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, []);

  // Update loan type if triggered from specific button
  useEffect(() => {
    if (isOpen && prefillLoanType) {
      setFormData(prev => ({ ...prev, loanType: prefillLoanType }));
    }
  }, [isOpen, prefillLoanType]);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (window.confirm("Are you sure you want to clear your application? This cannot be undone.")) {
      const newData = { ...INITIAL_DATA };
      if (prefillLoanType) {
         newData.loanType = prefillLoanType;
      }
      setFormData(newData);
      localStorage.removeItem(STORAGE_KEY);
      setCurrentStep(0);
      addToast("Application cleared.", "info");
    }
  };

  // --- PREMIUM PDF EXPORT ---
  const generatePDF = () => {
    if (typeof window === 'undefined') return;
    const { jsPDF } = (window as any).jspdf;
    if (!jsPDF) {
       addToast("PDF library not loaded.", "error");
       return;
    }

    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const isDarkMode = document.documentElement.classList.contains('dark');

        const colors = isDarkMode ? {
            bg: [15, 23, 42], text: [248, 250, 252], textMuted: [148, 163, 184], 
            accent: [59, 130, 246], border: [51, 65, 85]
        } : {
            bg: [255, 255, 255], text: [15, 23, 42], textMuted: [100, 116, 139], 
            accent: [37, 99, 235], border: [226, 232, 240]
        };

        // Paint Page 1 Background
        doc.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Track painted pages to prevent overwriting content on multi-page docs
        const paintedPages = new Set<number>();
        paintedPages.add(1);

        // Branding
        doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.roundedRect(margin, 15, 12, 12, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("S", margin + 3.5, 23);
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.setFont("times", "bold");
        doc.setFontSize(22);
        doc.text("Sterling Loans", margin + 18, 24);
        
        // Contact
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
        doc.text("Level 45, 101 Collins Street", pageWidth - margin, 18, { align: "right" });
        doc.text("Melbourne, VIC 3000", pageWidth - margin, 23, { align: "right" });
        doc.text("+61 (03) 9654 1234 | hello@sterlingloans.com.au", pageWidth - margin, 28, { align: "right" });
        doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
        doc.line(margin, 35, pageWidth - margin, 35);

        // Title
        doc.setFontSize(16);
        doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
        doc.setFont("helvetica", "bold");
        doc.text("Mortgage Application", margin, 50);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
        doc.text(`Submitted: ${new Date().toLocaleDateString()}`, margin, 56);

        // Tables
        let yPos = 70;
        const tableSections = [
            {
                title: "Personal Details",
                data: [
                    ["Full Name", `${formData.firstName} ${formData.lastName}`],
                    ["Date of Birth", formData.dob || "-"],
                    ["Marital Status", formData.maritalStatus],
                    ["Email", formData.email],
                    ["Phone", formData.phone],
                    ["Address", `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`]
                ]
            },
            {
                title: "Employment Information",
                data: [
                    ["Employer", formData.employer],
                    ["Job Title", formData.jobTitle],
                    ["Years Employed", formData.yearsEmployed ? `${formData.yearsEmployed} Years` : "-"],
                    ["Status", formData.employmentStatus],
                    ["Annual Income", formData.annualIncome ? `$${Number(formData.annualIncome).toLocaleString()}` : "-"]
                ]
            },
            {
                title: "Financial Profile",
                data: [
                    ["Total Assets", formData.totalAssets ? `$${Number(formData.totalAssets).toLocaleString()}` : "-"],
                    ["Total Liabilities", formData.totalLiabilities ? `$${Number(formData.totalLiabilities).toLocaleString()}` : "-"],
                    ["Credit Score", formData.creditScore],
                    ["Bankruptcy", formData.bankruptcy]
                ]
            },
            {
                title: "Loan Request",
                data: [
                    ["Loan Type", formData.loanType],
                    ["Requested Amount", formData.loanAmount ? `$${Number(formData.loanAmount).toLocaleString()}` : "-"],
                    ["Purpose", formData.loanPurpose],
                    ["Comments", formData.comments || "None"]
                ]
            }
        ];

        tableSections.forEach(section => {
            (doc as any).autoTable({
                startY: yPos,
                head: [[section.title, '']],
                body: section.data,
                theme: 'grid',
                margin: { left: margin, right: margin },
                styles: { font: "helvetica", fontSize: 10, cellPadding: 5, textColor: colors.text, fillColor: isDarkMode ? [30, 41, 59] : [255, 255, 255], lineColor: colors.border, lineWidth: 0.1 },
                headStyles: { fillColor: colors.accent, textColor: [255, 255, 255], fontStyle: 'bold', halign: 'left' },
                columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60, textColor: colors.textMuted }, 1: { fontStyle: 'normal' } },
                willDrawPage: function (data: any) {
                    // Check if this page has already been painted to avoid overwriting content
                    if (!paintedPages.has(data.pageNumber)) {
                        doc.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]);
                        doc.rect(0, 0, pageWidth, pageHeight, 'F');
                        paintedPages.add(data.pageNumber);
                    }
                },
            });
            yPos = (doc as any).lastAutoTable.finalY + 10;
        });

        // Add Footer to All Pages
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
            doc.text("Sterling Loans Australia | Confidential Mortgage Application", margin, pageHeight - 15);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 15, { align: 'right' });
        }

        doc.save(`Sterling_Mortgage_App_${formData.lastName || 'Draft'}.pdf`);

    } catch (e) {
        addToast("Failed to generate PDF.", "error");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      localStorage.removeItem(STORAGE_KEY); 
      generatePDF(); 
      addToast("Application received. Reviewing your mortgage request.", "success");
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeApplication}
      ></div>

      <div className="relative w-full max-w-4xl h-[80vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-up border border-slate-200 dark:border-slate-800">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-white">Mortgage Application</h2>
                    <p className="text-xs text-slate-500">Secure 256-bit encrypted session.</p>
                </div>
            </div>
            <button onClick={closeApplication} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10 relative">
            {isSuccess ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-2 animate-bounce">
                        <CheckCircle size={48} />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Success!</h3>
                    <p className="text-slate-600 dark:text-slate-400 max-w-md">
                        Your mortgage application has been securely transmitted. A specialist will be in touch shortly to discuss your pre-approval options.
                    </p>
                    <Button onClick={() => { setIsSuccess(false); closeApplication(); }} className="min-w-[200px]">
                        Return to Home
                    </Button>
                </div>
            ) : (
                <>
                  <div className="mb-8 select-none">
                      <div className="flex justify-between text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                          <span>Step {currentStep + 1} of {STEPS.length}</span>
                          <span>{Math.round(((currentStep + 1) / STEPS.length) * 100)}%</span>
                      </div>
                      <div className="flex gap-2 h-2 mb-4">
                        {STEPS.map((_, idx) => (
                           <button 
                             key={idx}
                             onClick={() => setCurrentStep(idx)}
                             className={`h-full rounded-full transition-all duration-300 ${
                                idx <= currentStep ? 'bg-blue-600 dark:bg-blue-500 flex-1' : 'bg-slate-200 dark:bg-slate-700 w-full hover:bg-slate-300 dark:hover:bg-slate-600'
                             }`}
                           />
                        ))}
                      </div>
                      <div className="hidden sm:flex justify-between px-1">
                          {STEPS.map((step, idx) => (
                              <button 
                                key={idx} 
                                onClick={() => setCurrentStep(idx)}
                                className={`text-xs font-bold uppercase tracking-wider transition-colors hover:text-blue-500 text-left ${idx === currentStep ? 'text-blue-600 dark:text-blue-400 scale-105 origin-left' : idx < currentStep ? 'text-slate-800 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'}`}
                              >
                                  {step}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="space-y-6">
                      {currentStep === 0 && (
                          <div className="space-y-8 animate-fade-in">
                              {/* Personal Details (Same layout as before) */}
                              <div className="space-y-4">
                                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                                     <User size={18} /> <span className="text-sm font-bold uppercase tracking-wider">Identity</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                                    <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                                    <Input label="Date of Birth" icon={<Calendar size={16}/>} name="dob" type="date" value={formData.dob} onChange={handleChange} />
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pl-4">Marital Status</label>
                                        <div className="relative">
                                            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none focus:border-blue-500 appearance-none cursor-pointer">
                                                <option>Single</option>
                                                <option>Married</option>
                                                <option>Divorced</option>
                                                <option>Widowed</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"><ChevronDownIcon /></div>
                                        </div>
                                    </div>
                                  </div>
                              </div>
                              <div className="space-y-4">
                                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                                     <Phone size={18} /> <span className="text-sm font-bold uppercase tracking-wider">Contact</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
                                     <Input label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                                  </div>
                              </div>
                              <div className="space-y-4">
                                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                                     <MapPin size={18} /> <span className="text-sm font-bold uppercase tracking-wider">Current Address</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                                      <div className="md:col-span-6"><Input label="Street Address" name="address" value={formData.address} onChange={handleChange} /></div>
                                      <div className="md:col-span-3"><Input label="City" name="city" value={formData.city} onChange={handleChange} /></div>
                                      <div className="md:col-span-1"><Input label="State" name="state" value={formData.state} onChange={handleChange} placeholder="NY" /></div>
                                      <div className="md:col-span-2"><Input label="Zip Code" name="zip" value={formData.zip} onChange={handleChange} /></div>
                                  </div>
                              </div>
                          </div>
                      )}

                      {currentStep === 1 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                              <Input label="Employer Name" name="employer" value={formData.employer} onChange={handleChange} />
                              <Input label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
                              <Input label="Years Employed" name="yearsEmployed" type="number" value={formData.yearsEmployed} onChange={handleChange} />
                              <Input label="Annual Income ($)" name="annualIncome" type="number" value={formData.annualIncome} onChange={handleChange} />
                              <div className="md:col-span-2 space-y-2">
                                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pl-4">Employment Status</label>
                                  <select name="employmentStatus" value={formData.employmentStatus} onChange={handleChange} className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none focus:border-blue-500">
                                      <option>Employed</option>
                                      <option>Self-Employed</option>
                                      <option>Unemployed</option>
                                      <option>Retired</option>
                                  </select>
                              </div>
                          </div>
                      )}

                      {currentStep === 2 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                              <Input label="Total Assets ($)" name="totalAssets" type="number" placeholder="Savings, 401k, etc." value={formData.totalAssets} onChange={handleChange} />
                              <Input label="Total Liabilities ($)" name="totalLiabilities" type="number" placeholder="Car loans, credit cards, etc." value={formData.totalLiabilities} onChange={handleChange} />
                              <div className="space-y-2">
                                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pl-4">Credit Score Estimate</label>
                                  <select name="creditScore" value={formData.creditScore} onChange={handleChange} className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none focus:border-blue-500">
                                      <option>Excellent (740+)</option>
                                      <option>Good (700-739)</option>
                                      <option>Fair (640-699)</option>
                                      <option>Needs Work (Below 640)</option>
                                  </select>
                              </div>
                              <div className="space-y-2">
                                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pl-4">Bankruptcy / Foreclosure?</label>
                                  <select name="bankruptcy" value={formData.bankruptcy} onChange={handleChange} className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none focus:border-blue-500">
                                      <option>No</option>
                                      <option>Yes (Past 7 Years)</option>
                                  </select>
                              </div>
                          </div>
                      )}

                      {currentStep === 3 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                              <div className="md:col-span-2 space-y-2">
                                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pl-4">Mortgage Type</label>
                                  <select name="loanType" value={formData.loanType} onChange={handleChange} className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none focus:border-blue-500">
                                      <option>Conventional Loan</option>
                                      <option>FHA Loan</option>
                                      <option>VA Loan</option>
                                      <option>Jumbo Loan</option>
                                      <option>Investment Property Loan</option>
                                      <option>Refinance</option>
                                  </select>
                              </div>
                              <Input label="Purchase Price / Est. Value" name="loanAmount" type="number" value={formData.loanAmount} onChange={handleChange} />
                              <div className="space-y-2">
                                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pl-4">Goal</label>
                                  <select name="loanPurpose" value={formData.loanPurpose} onChange={handleChange} className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none focus:border-blue-500">
                                      <option>Purchase</option>
                                      <option>Refinance (Lower Rate)</option>
                                      <option>Refinance (Cash Out)</option>
                                  </select>
                              </div>
                              <div className="md:col-span-2 space-y-2">
                                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pl-4">Additional Comments</label>
                                  <textarea 
                                    name="comments"
                                    rows={4} 
                                    value={formData.comments}
                                    onChange={handleChange}
                                    className="w-full p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none focus:border-blue-500 resize-none"
                                    placeholder="Tell us about the property or your specific needs..."
                                  ></textarea>
                              </div>
                          </div>
                      )}
                  </div>
                </>
            )}
        </div>

        {!isSuccess && (
            <div className="p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md flex justify-between items-center shrink-0">
                <div className="flex gap-2 sm:gap-4">
                    <div className="relative group">
                        <button type="button" onClick={handleReset} className="p-3 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                            <RotateCcw size={20} />
                        </button>
                    </div>
                    <div className="relative group">
                        <button type="button" onClick={generatePDF} className="p-3 text-slate-400 hover:text-blue-500 transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <Download size={20} />
                        </button>
                    </div>
                </div>
                
                <div className="flex gap-2 sm:gap-4">
                    {currentStep > 0 && (
                        <Button variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)} className="px-3 sm:px-6">
                            <ChevronLeft size={20} className="sm:mr-2" /> <span className="hidden sm:inline">Back</span>
                        </Button>
                    )}
                    {currentStep < STEPS.length - 1 ? (
                        <Button onClick={() => setCurrentStep(prev => prev + 1)} className="px-4 sm:px-6">
                            <span className="hidden sm:inline">Next</span> <span className="sm:hidden">Next</span> <ChevronRight size={20} className="ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[120px] sm:min-w-[140px] px-4 sm:px-6">
                            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Submit Application"}
                        </Button>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

export default ApplicationModal;
