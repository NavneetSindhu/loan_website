import React, { useState, useEffect, useRef } from 'react';
import { 
  DollarSign, 
  Percent, 
  Calendar, 
  Calculator as CalcIcon, 
  TrendingDown, 
  Clock, 
  ChevronDown, 
  BarChart,
  Info,
  Home,
  Layers,
  Zap,
  Download,
  Loader2,
  ArrowDownCircle
} from 'lucide-react';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useNavigate } from 'react-router-dom';

interface YearlyData {
  year: number;
  interest: number;
  principal: number;
  balance: number;
  totalInterest: number;
}

const Calculator: React.FC = () => {
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // --- TABS STATE ---
  const [activeTab, setActiveTab] = useState<'loan' | 'expenses' | 'extra'>('loan');

  // --- LOAN INPUTS ---
  const [loanType, setLoanType] = useState('home');
  const [amount, setAmount] = useState<number>(600000);
  const [rate, setRate] = useState<number>(6.25);
  const [term, setTerm] = useState<number>(30);
  const [frequency, setFrequency] = useState<'monthly' | 'fortnightly' | 'weekly'>('monthly');

  // --- EXPENSES INPUTS (New) ---
  const [taxYearly, setTaxYearly] = useState<number>(0);
  const [insuranceYearly, setInsuranceYearly] = useState<number>(0);

  // --- ACCELERATION INPUTS ---
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [lumpSum, setLumpSum] = useState<number>(0);
  const [lumpSumYear, setLumpSumYear] = useState<number>(5);

  // --- RESULTS STATE ---
  const [periodicRepayment, setPeriodicRepayment] = useState<number>(0);
  const [totalMonthlyCost, setTotalMonthlyCost] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [payoffDate, setPayoffDate] = useState<string>('');
  const [interestSaved, setInterestSaved] = useState<number>(0);
  const [timeSaved, setTimeSaved] = useState<string>('');
  
  // --- DATA ---
  const [schedule, setSchedule] = useState<YearlyData[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Limits
  const MAX_AMOUNT = 5000000; // Reduced slider max for better usability, input can go higher
  const INPUT_MAX_AMOUNT = 20000000;
  const MAX_TERM = 40;

  // Handle Loan Type Presets
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setLoanType(type);
    
    switch(type) {
      case 'home':
        setAmount(600000); setRate(6.25); setTerm(30);
        setTaxYearly(3000); setInsuranceYearly(1200);
        break;
      case 'personal':
        setAmount(30000); setRate(9.50); setTerm(5);
        setTaxYearly(0); setInsuranceYearly(0);
        break;
      case 'business':
        setAmount(100000); setRate(7.50); setTerm(10);
        setTaxYearly(0); setInsuranceYearly(0);
        break;
      default: break;
    }
  };

  // Input Validation / Limits
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (val > INPUT_MAX_AMOUNT) val = INPUT_MAX_AMOUNT;
    if (val < 0) val = 0;
    setAmount(val);
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (val > MAX_TERM) val = MAX_TERM;
    if (val < 1) val = 1;
    setTerm(val);
  };

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    // 0. Setup Frequency Constants
    let periodsPerYear = 12;
    if (frequency === 'fortnightly') periodsPerYear = 26;
    if (frequency === 'weekly') periodsPerYear = 52;

    // 1. Base Calculations
    const P = amount || 0;
    const r = (rate || 0) / 100 / periodsPerYear;
    const n = (term || 0) * periodsPerYear;

    // Standard Repayment Formula
    let standardPeriodic = 0;
    if (r === 0) {
      standardPeriodic = n > 0 ? P / n : 0;
    } else {
      standardPeriodic = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    if (!isFinite(standardPeriodic) || isNaN(standardPeriodic)) standardPeriodic = 0;

    setPeriodicRepayment(standardPeriodic);

    // 2. Real Cost (Adding Taxes/Insurance)
    // Always calculate expenses monthly for display, regardless of repayment frequency
    const monthlyTax = (taxYearly || 0) / 12;
    const monthlyIns = (insuranceYearly || 0) / 12;
    
    // Convert periodic repayment to monthly equivalent for "Total Monthly Cost" display
    let monthlyEquivalentRepayment = standardPeriodic;
    if (frequency === 'fortnightly') monthlyEquivalentRepayment = (standardPeriodic * 26) / 12;
    if (frequency === 'weekly') monthlyEquivalentRepayment = (standardPeriodic * 52) / 12;

    setTotalMonthlyCost(monthlyEquivalentRepayment + monthlyTax + monthlyIns);

    // 3. Advanced Amortization Loop
    let balance = P;
    let accumulatedInterest = 0;
    let actualPeriods = 0;
    const yearlyData: YearlyData[] = [];
    
    let yearPrincipal = 0;
    let yearInterest = 0;
    
    // Loop Limit
    const maxLoop = 60 * periodsPerYear; // Max 60 years calc
    const lumpSumPeriod = (lumpSumYear * periodsPerYear);

    for (let i = 1; i <= maxLoop; i++) {
      if (balance <= 0.01) break;

      const interestForPeriod = balance * r;
      
      // Calculate Repayment for this period
      let repayment = standardPeriodic + (extraPayment || 0);
      
      // Apply Lump Sum
      if (i === lumpSumPeriod) {
        repayment += (lumpSum || 0);
      }

      let principalForPeriod = repayment - interestForPeriod;

      // Check for payoff
      if (principalForPeriod > balance) {
        principalForPeriod = balance;
      }
      
      balance -= principalForPeriod;
      accumulatedInterest += interestForPeriod;
      
      yearPrincipal += principalForPeriod;
      yearInterest += interestForPeriod;
      actualPeriods++;

      // Snapshot at end of each year OR at payoff
      if (i % periodsPerYear === 0 || balance <= 0.01) {
        yearlyData.push({
          year: Math.ceil(i / periodsPerYear),
          interest: yearInterest,
          principal: yearPrincipal,
          balance: balance > 0 ? balance : 0,
          totalInterest: accumulatedInterest
        });
        yearPrincipal = 0;
        yearInterest = 0;
      }
    }

    setSchedule(yearlyData);
    setTotalInterest(accumulatedInterest);
    setTotalCost(accumulatedInterest + P);

    // 4. Payoff Date
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    if (frequency === 'monthly') {
        futureDate.setMonth(currentDate.getMonth() + actualPeriods);
    } else {
        const daysToAdd = Math.ceil(actualPeriods * (365.25 / periodsPerYear));
        futureDate.setDate(currentDate.getDate() + daysToAdd);
    }
    setPayoffDate(futureDate.toLocaleDateString('en-AU', { month: 'short', year: 'numeric' }));

    // 5. Savings Calculation
    const standardTotalRepayment = standardPeriodic * n;
    const standardTotalInterest = standardTotalRepayment - P;
    
    // Determine if any extra payments were made
    if (extraPayment > 0 || lumpSum > 0) {
       const saved = Math.max(0, standardTotalInterest - accumulatedInterest);
       setInterestSaved(saved);

       const periodsSaved = n - actualPeriods;
       const yearsSaved = Math.floor(periodsSaved / periodsPerYear);
       const monthsSaved = Math.round(((periodsSaved / periodsPerYear) - yearsSaved) * 12);
       
       let timeStr = '';
       if (yearsSaved > 0) timeStr += `${yearsSaved}y `;
       if (monthsSaved > 0) timeStr += `${monthsSaved}m`;
       setTimeSaved(timeStr.trim() || '0m');
    } else {
       setInterestSaved(0);
       setTimeSaved('');
    }

  }, [amount, rate, term, frequency, taxYearly, insuranceYearly, extraPayment, lumpSum, lumpSumYear]);

  // Formatters
  const currency = (val: number) => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(val);

  // --- PDF EXPORT FUNCTION ---
  const handleExportPDF = async () => {
    if (typeof window === 'undefined') return;
    const { jsPDF } = (window as any).jspdf;

    if (!jsPDF) {
       alert("PDF generation library not loaded.");
       return;
    }

    setIsExporting(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;

      // DETECT THEME
      const isDarkMode = document.documentElement.classList.contains('dark');

      // Define Palettes based on theme
      const colors = isDarkMode ? {
         bg: [15, 23, 42],        // Slate-950
         text: [248, 250, 252],   // Slate-50
         textMuted: [148, 163, 184], // Slate-400
         accent: [59, 130, 246],  // Blue-500
         accentText: [96, 165, 250], // Blue-400
         cardBg: [30, 41, 59],    // Slate-800
         border: [51, 65, 85]     // Slate-700
      } : {
         bg: [255, 255, 255],     // White
         text: [15, 23, 42],      // Slate-900
         textMuted: [100, 116, 139], // Slate-500
         accent: [37, 99, 235],   // Blue-600
         accentText: [37, 99, 235], // Blue-600
         cardBg: [248, 250, 252], // Slate-50
         border: [226, 232, 240]  // Slate-200
      };

      // Apply Background Color (Page 1)
      doc.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // 1. BRANDING HEADER
      // Logo (Blue Shield approx)
      doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      doc.roundedRect(margin, 15, 12, 12, 2, 2, 'F');
      doc.setTextColor(255, 255, 255); // Always white inside logo
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("S", margin + 3.5, 23);

      // Company Name
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.setFont("times", "bold"); // Approx serif
      doc.setFontSize(22);
      doc.text("Sterling Loans", margin + 18, 24);

      // Contact Details (Right Aligned)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
      doc.text("123 Financial District Blvd", pageWidth - margin, 18, { align: "right" });
      doc.text("New York, NY 10005", pageWidth - margin, 23, { align: "right" });
      doc.text("+1 (555) 123-4567 | hello@sterlingloans.com", pageWidth - margin, 28, { align: "right" });

      // Divider
      doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
      doc.line(margin, 35, pageWidth - margin, 35);

      // 2. REPORT TITLE & DATE
      doc.setFontSize(16);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.setFont("helvetica", "bold");
      doc.text("Loan Estimation Report", margin, 50);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, margin, 56);

      // 3. LOAN DETAILS (Table-like grid)
      let yPos = 75;
      const col1 = margin;
      const col2 = pageWidth / 2 + 10;

      const drawDetailRow = (label: string, value: string, x: number, y: number) => {
         doc.setFont("helvetica", "normal");
         doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
         doc.text(label, x, y);
         
         doc.setFont("helvetica", "bold");
         doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
         doc.text(value, x + 40, y);
      };

      doc.setFontSize(11);
      doc.setTextColor(colors.accentText[0], colors.accentText[1], colors.accentText[2]); // Brand color
      doc.text("Configuration", margin, yPos - 8);

      // Left Col
      drawDetailRow("Loan Type:", loanType.charAt(0).toUpperCase() + loanType.slice(1), col1, yPos);
      drawDetailRow("Amount:", currency(amount), col1, yPos + 10);
      drawDetailRow("Interest Rate:", `${rate}%`, col1, yPos + 20);
      
      // Right Col
      drawDetailRow("Term:", `${term} Years`, col2, yPos);
      drawDetailRow("Frequency:", frequency.charAt(0).toUpperCase() + frequency.slice(1), col2, yPos + 10);
      drawDetailRow("Extra Payment:", currency(extraPayment), col2, yPos + 20);

      yPos += 45;

      // 4. FINANCIAL SUMMARY BOX
      doc.setFillColor(colors.cardBg[0], colors.cardBg[1], colors.cardBg[2]); 
      doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 40, 3, 3, 'F');
      
      doc.setFontSize(11);
      doc.setTextColor(colors.accentText[0], colors.accentText[1], colors.accentText[2]);
      doc.text("Financial Summary", margin + 5, yPos + 10);

      const sumY = yPos + 22;
      
      // Monthly Payment
      doc.setFontSize(9);
      doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
      doc.text(`Repayment (${frequency}):`, margin + 5, sumY);
      doc.setFontSize(14);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.setFont("helvetica", "bold");
      doc.text(currency(periodicRepayment + extraPayment), margin + 5, sumY + 8);

      // Total Interest
      doc.setFontSize(9);
      doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
      doc.setFont("helvetica", "normal");
      doc.text("Total Interest:", margin + 60, sumY);
      doc.setFontSize(14);
      doc.setTextColor(245, 158, 11); // Amber
      doc.setFont("helvetica", "bold");
      doc.text(currency(totalInterest), margin + 60, sumY + 8);

      // Total Cost
      doc.setFontSize(9);
      doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
      doc.setFont("helvetica", "normal");
      doc.text("Total Cost of Loan:", margin + 120, sumY);
      doc.setFontSize(14);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      doc.setFont("helvetica", "bold");
      doc.text(currency(totalCost), margin + 120, sumY + 8);

      yPos += 55;

      // 5. SCHEDULE TABLE (Using AutoTable)
      doc.setFontSize(11);
      doc.setTextColor(colors.accentText[0], colors.accentText[1], colors.accentText[2]);
      doc.text("Amortization Summary (Yearly)", margin, yPos);
      yPos += 5;

      // Prepare data for AutoTable
      const tableBody = schedule.map(row => [
        row.year,
        currency(row.interest),
        currency(row.principal),
        currency(row.balance),
        currency(row.totalInterest)
      ]);

      (doc as any).autoTable({
        startY: yPos,
        head: [['Year', 'Interest Paid', 'Principal Paid', 'Remaining Balance', 'Total Interest']],
        body: tableBody,
        theme: 'plain', // We will custom style it
        // Add bottom margin to avoid running over footer
        margin: { top: margin, bottom: 30, left: margin, right: margin },
        styles: {
          font: "helvetica",
          fontSize: 9,
          cellPadding: 4,
          textColor: colors.text,
          fillColor: isDarkMode ? [30, 41, 59] : [255, 255, 255], // Row bg
          lineColor: colors.border,
          lineWidth: 0.1
        },
        headStyles: {
          fillColor: isDarkMode ? [15, 23, 42] : [241, 245, 249],
          textColor: isDarkMode ? [255, 255, 255] : [15, 23, 42],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
           fillColor: isDarkMode ? [15, 23, 42] : [248, 250, 252]
        },
        columnStyles: {
          0: { fontStyle: 'bold' }, // Year
          1: { textColor: [217, 119, 6] }, // Amber for Interest
          2: { textColor: colors.accentText } // Blue for Principal
        },
        // Hook to draw background on new pages BEFORE content
        willDrawPage: function (data: any) {
           if (data.pageNumber > 1) {
              doc.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]);
              doc.rect(0, 0, pageWidth, pageHeight, 'F');
           }
        },
        // Hook to draw footer after content
        didDrawPage: function (data: any) {
           const footerY = pageHeight - 15;
           doc.setFontSize(8);
           doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
           const disclaimer = "This report is an estimate only and does not constitute a formal loan offer.";
           doc.text(disclaimer + " Page " + data.pageNumber, margin, footerY);
        }
      });

      doc.save(`Sterling_Loans_Report_${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (err) {
      console.error("PDF Export failed", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 animate-fade-in bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 mb-6 shadow-lg shadow-blue-500/20">
             <CalcIcon size={32} />
          </div>
          <h1 className="text-3xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">Mortgage & Loan Calculator</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Advanced estimation including taxes, fees, and accelerated repayment strategies.
          </p>
        </div>

        {/* Layout Container: items-stretch ensures both columns have equal height */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          
          {/* --- CONTROL PANEL (LEFT) --- */}
          {/* Removed order classes so inputs appear first naturally on mobile */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card className="p-0 overflow-hidden border-t-4 border-t-blue-500 h-full">
               {/* Tab Navigation */}
               <div className="flex border-b border-slate-200 dark:border-slate-800">
                  <button 
                    onClick={() => setActiveTab('loan')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'loan' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <Home size={16} /> Loan
                  </button>
                  <button 
                    onClick={() => setActiveTab('expenses')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'expenses' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <Layers size={16} /> Expenses
                  </button>
                  <button 
                    onClick={() => setActiveTab('extra')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'extra' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                  >
                    <Zap size={16} /> Extra
                  </button>
               </div>

               {/* Tab Content */}
               <div className="p-6 md:p-8 space-y-6">
                 
                 {/* LOAN TAB */}
                 {activeTab === 'loan' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="space-y-2 group">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pl-4">Loan Type</label>
                          <div className="relative">
                            <select 
                              value={loanType}
                              onChange={handleTypeChange}
                              className="w-full pl-4 pr-10 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:bg-white dark:focus:bg-slate-900 outline-none appearance-none transition-all cursor-pointer"
                            >
                              <option value="home">Home Loan</option>
                              <option value="personal">Personal Loan</option>
                              <option value="business">Business Loan</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                          </div>
                        </div>

                        <div>
                            <Input 
                              label="Loan Amount" 
                              icon={<DollarSign size={16}/>} 
                              type="number" 
                              value={amount} 
                              onChange={handleAmountChange} 
                              min={0}
                              max={INPUT_MAX_AMOUNT}
                            />
                             {/* Slider for Amount */}
                             <div className="px-1 pt-2">
                                <input 
                                  type="range" 
                                  min="0" 
                                  max={MAX_AMOUNT} 
                                  step="5000" 
                                  value={amount > MAX_AMOUNT ? MAX_AMOUNT : amount}
                                  onChange={(e) => setAmount(Number(e.target.value))}
                                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                             </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Interest Rate" icon={<Percent size={16}/>} type="number" step="0.01" value={rate} onChange={e => setRate(Number(e.target.value))} />
                          <div>
                            <Input 
                                label="Term (Years)" 
                                icon={<Calendar size={16}/>} 
                                type="number" 
                                value={term} 
                                onChange={handleTermChange} 
                                min={1}
                                max={MAX_TERM}
                            />
                             {/* Slider for Term */}
                             <div className="px-1 pt-2">
                                <input 
                                  type="range" 
                                  min="1" 
                                  max={MAX_TERM} 
                                  step="1" 
                                  value={term}
                                  onChange={(e) => setTerm(Number(e.target.value))}
                                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                             </div>
                          </div>
                        </div>

                        <div className="space-y-2 group">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pl-4">Frequency</label>
                          <div className="relative">
                            <select 
                              value={frequency}
                              onChange={(e) => setFrequency(e.target.value as any)}
                              className="w-full pl-4 pr-10 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 outline-none appearance-none cursor-pointer"
                            >
                              <option value="monthly">Monthly</option>
                              <option value="fortnightly">Fortnightly</option>
                              <option value="weekly">Weekly</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                          </div>
                        </div>
                    </div>
                 )}

                 {/* EXPENSES TAB */}
                 {activeTab === 'expenses' && (
                    <div className="space-y-6 animate-fade-in">
                       <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-300 flex gap-3">
                          <Info className="shrink-0" size={18} />
                          <p>Expenses are calculated monthly and added to your total estimated payment, but do not affect loan payoff speed.</p>
                       </div>
                       <Input label="Yearly Property Tax" icon={<DollarSign size={16}/>} type="number" value={taxYearly} onChange={e => setTaxYearly(Number(e.target.value))} />
                       <Input label="Yearly Home Insurance" icon={<DollarSign size={16}/>} type="number" value={insuranceYearly} onChange={e => setInsuranceYearly(Number(e.target.value))} />
                    </div>
                 )}

                 {/* EXTRA TAB */}
                 {activeTab === 'extra' && (
                    <div className="space-y-6 animate-fade-in">
                       <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl text-sm text-green-800 dark:text-green-300 flex gap-3">
                          <TrendingDown className="shrink-0" size={18} />
                          <p>Making extra payments goes directly towards your principal balance, reducing interest and shortening your term.</p>
                       </div>
                       <Input label={`Extra ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Payment`} icon={<DollarSign size={16}/>} type="number" value={extraPayment} onChange={e => setExtraPayment(Number(e.target.value))} />
                       
                       <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Lump Sum Payment</h4>
                          <div className="grid grid-cols-2 gap-4">
                             <Input label="Amount" icon={<DollarSign size={16}/>} type="number" value={lumpSum} onChange={e => setLumpSum(Number(e.target.value))} />
                             <Input label="At Year" icon={<Calendar size={16}/>} type="number" value={lumpSumYear} onChange={e => setLumpSumYear(Number(e.target.value))} />
                          </div>
                       </div>
                    </div>
                 )}

                 {/* Mobile Only: Calculate/Scroll Button */}
                 <div className="lg:hidden pt-4">
                    <Button onClick={scrollToResults} className="w-full flex items-center justify-center gap-2">
                       See Monthly Payments <ArrowDownCircle size={18} />
                    </Button>
                 </div>
               </div>
            </Card>

            <div className="text-center text-xs text-slate-400">
               *Calculations are estimates. Please consult a financial advisor for official advice.
            </div>
          </div>

          {/* --- DASHBOARD (RIGHT) --- */}
          {/* h-full ensures the right column stretches to match the left column */}
          <div ref={resultsRef} className="lg:col-span-7 flex flex-col gap-6 h-full">
             
             {/* 1. MAIN SUMMARY CARD */}
             <Card className="bg-slate-900 text-white border-none relative overflow-hidden p-8 shadow-2xl shrink-0">
                 <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-[80px] opacity-20 -ml-10 -mb-10 pointer-events-none"></div>

                 <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                       <h2 className="text-lg font-medium text-slate-300 mb-1">Total {frequency === 'monthly' ? 'Monthly' : frequency.charAt(0).toUpperCase() + frequency.slice(1)} Payment</h2>
                       <div className="text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-2">
                          {currency(periodicRepayment + extraPayment + (taxYearly/12) + (insuranceYearly/12))}
                       </div>
                       <div className="flex flex-wrap gap-4 text-sm font-medium text-blue-300 mt-4">
                          <span>Principal & Interest: {currency(periodicRepayment)}</span>
                          {(taxYearly > 0 || insuranceYearly > 0) && (
                             <span className="text-slate-400">
                               + Expenses: {currency((taxYearly + insuranceYearly)/12)}
                             </span>
                          )}
                       </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                       <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                          <span className="text-slate-300 text-sm">Target Payoff</span>
                          <span className="font-bold flex items-center gap-2"><Clock size={16}/> {payoffDate}</span>
                       </div>
                       
                       {interestSaved > 0 ? (
                         <div className="space-y-3">
                            <div className="flex justify-between items-center text-emerald-300">
                               <span className="text-sm">Interest Saved</span>
                               <span className="font-bold">{currency(interestSaved)}</span>
                            </div>
                            <div className="flex justify-between items-center text-blue-300">
                               <span className="text-sm">Time Saved</span>
                               <span className="font-bold">{timeSaved}</span>
                            </div>
                         </div>
                       ) : (
                         <div className="flex justify-between items-center text-slate-300">
                            <span className="text-sm">Total Interest</span>
                            <span className="font-bold">{currency(totalInterest)}</span>
                         </div>
                       )}
                    </div>
                 </div>
             </Card>

             {/* 2. BREAKDOWN BARS */}
             {/* flex-1 forces this section to take up remaining height, aligning bottom with Left Column */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                {/* Total Loan Cost - Reordered first */}
                <Card className="p-6 flex flex-col justify-center items-center text-center h-full">
                   <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Loan Cost</h4>
                   <div className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                      {currency(totalCost)}
                   </div>
                   <p className="text-sm text-slate-500">Over {term} years</p>
                   <Button size="sm" variant="outline" className="mt-6 w-full" onClick={() => navigate('/contact')}>
                      Get Official Quote
                   </Button>
                </Card>

                {/* Cost Analysis */}
                <Card className="p-6 h-full flex flex-col justify-center">
                   <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Cost Analysis</h4>
                   
                   <div className="space-y-6">
                      <div>
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{Math.round((amount/totalCost)*100)}%</span>
                            <span className="text-xs text-slate-500">Principal</span>
                         </div>
                         <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden flex">
                            <div className="bg-blue-500 h-full" style={{ width: `${(amount/totalCost)*100}%` }}></div>
                         </div>
                      </div>

                      <div>
                         <div className="flex items-center justify-between mb-2">
                             <span className="text-xs font-bold text-amber-500">{Math.round((totalInterest/totalCost)*100)}%</span>
                             <span className="text-xs text-slate-500">Interest</span>
                         </div>
                         <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden flex">
                            <div className="bg-amber-500 h-full" style={{ width: `${(totalInterest/totalCost)*100}%` }}></div>
                         </div>
                      </div>
                   </div>
                </Card>
             </div>
          </div>
        </div>

        {/* 3. FULL WIDTH SCHEDULE TABLE */}
        <div className="w-full mb-12 animate-fade-up">
           <Card className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                  <div className="text-center md:text-left">
                     <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2">
                       <BarChart size={24} className="text-blue-500"/> Year-by-Year Schedule
                     </h3>
                     <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Detailed breakdown of principal vs interest over time</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    onClick={handleExportPDF} 
                    disabled={isExporting}
                    className="shadow-sm gap-2 w-full md:w-auto"
                  >
                     {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
                     {isExporting ? 'Generating PDF...' : 'Export Report'}
                  </Button>
              </div>

              <div className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-xl">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold sticky top-0 backdrop-blur-sm z-10">
                        <tr>
                          <th className="p-4 whitespace-nowrap">Year</th>
                          <th className="p-4 whitespace-nowrap">Interest Paid</th>
                          <th className="p-4 whitespace-nowrap">Principal Paid</th>
                          <th className="p-4 whitespace-nowrap">Remaining Balance</th>
                          <th className="p-4 whitespace-nowrap">Total Interest</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {schedule.map((row) => (
                          <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="p-4 font-medium text-slate-900 dark:text-white">{row.year}</td>
                            <td className="p-4 text-amber-600 dark:text-amber-400">{currency(row.interest)}</td>
                            <td className="p-4 text-blue-600 dark:text-blue-400">{currency(row.principal)}</td>
                            <td className="p-4 text-slate-500 dark:text-slate-400">{currency(row.balance)}</td>
                            <td className="p-4 text-slate-400 dark:text-slate-500 text-xs">{currency(row.totalInterest)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              </div>
           </Card>
        </div>

      </div>
    </div>
  );
};

export default Calculator;