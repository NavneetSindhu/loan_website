
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
  ArrowDownCircle,
  Briefcase,
  Wallet
} from 'lucide-react';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useNavigate } from 'react-router-dom';
import RateTicker from '../components/UI/RateTicker';

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
  
  // --- MODE STATE ---
  const [mode, setMode] = useState<'repayment' | 'affordability'>('repayment');

  // --- TABS STATE ---
  const [activeTab, setActiveTab] = useState<'loan' | 'expenses' | 'extra'>('loan');

  // --- REPAYMENT INPUTS ---
  const [loanType, setLoanType] = useState('purchase');
  const [amount, setAmount] = useState<number>(600000);
  const [rate, setRate] = useState<number>(6.50);
  const [term, setTerm] = useState<number>(30);
  const [frequency, setFrequency] = useState<'monthly' | 'fortnightly' | 'weekly'>('monthly');

  // --- EXPENSES INPUTS (New) ---
  const [taxYearly, setTaxYearly] = useState<number>(4500);
  const [insuranceYearly, setInsuranceYearly] = useState<number>(1200);

  // --- ACCELERATION INPUTS ---
  const [extraPayment, setExtraPayment] = useState<number>(0);
  const [lumpSum, setLumpSum] = useState<number>(0);
  const [lumpSumYear, setLumpSumYear] = useState<number>(5);

  // --- AFFORDABILITY INPUTS ---
  const [annualIncome, setAnnualIncome] = useState<number>(90000);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(500);
  const [downPayment, setDownPayment] = useState<number>(50000);
  const [affordRate, setAffordRate] = useState<number>(6.50);

  // --- RESULTS STATE ---
  const [periodicRepayment, setPeriodicRepayment] = useState<number>(0);
  const [totalMonthlyCost, setTotalMonthlyCost] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [payoffDate, setPayoffDate] = useState<string>('');
  const [interestSaved, setInterestSaved] = useState<number>(0);
  const [timeSaved, setTimeSaved] = useState<string>('');
  
  // --- AFFORDABILITY RESULTS ---
  const [maxHomePrice, setMaxHomePrice] = useState<number>(0);
  const [maxLoanAmount, setMaxLoanAmount] = useState<number>(0);
  const [maxMonthlyPayment, setMaxMonthlyPayment] = useState<number>(0);
  
  // --- DATA ---
  const [schedule, setSchedule] = useState<YearlyData[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  // Limits
  const MAX_AMOUNT = 5000000;
  const INPUT_MAX_AMOUNT = 20000000;
  const MAX_TERM = 40;

  // Handle Loan Type Presets
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setLoanType(type);
    
    switch(type) {
      case 'purchase':
        setAmount(600000); setRate(6.50); setTerm(30);
        setTaxYearly(4500); setInsuranceYearly(1200);
        break;
      case 'refinance':
        setAmount(450000); setRate(6.25); setTerm(25);
        setTaxYearly(4500); setInsuranceYearly(1200);
        break;
      case 'investment':
        setAmount(800000); setRate(7.25); setTerm(30);
        setTaxYearly(6000); setInsuranceYearly(1500);
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

  // --- EFFECT: REPAYMENT CALCULATION ---
  useEffect(() => {
    if (mode !== 'repayment') return;

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

  }, [amount, rate, term, frequency, taxYearly, insuranceYearly, extraPayment, lumpSum, lumpSumYear, mode]);


  // --- EFFECT: AFFORDABILITY CALCULATION ---
  useEffect(() => {
    if (mode !== 'affordability') return;
    
    // DTI Rule: Conservative 28% front-end ratio for housing
    // Gross Monthly Income
    const grossMonthly = (annualIncome || 0) / 12;
    
    // Max Housing Payment (Principal, Interest, Tax, Ins)
    const maxHousing = grossMonthly * 0.28;
    
    // Adjusted for Debts (Back-end ratio check 36%)
    const maxTotalDebt = grossMonthly * 0.36;
    const availableForHousing = maxTotalDebt - (monthlyDebts || 0);
    
    // Take lower of the two
    const safeMonthlyPayment = Math.min(maxHousing, availableForHousing);
    
    setMaxMonthlyPayment(Math.max(0, safeMonthlyPayment));
    
    // Reverse Amortization to find Loan Amount
    // Est. Taxes/Ins portion (approx $400/mo for avg home)
    const estTaxIns = 400; 
    const paymentForPI = Math.max(0, safeMonthlyPayment - estTaxIns);
    
    const r = (affordRate || 0) / 100 / 12;
    const n = 30 * 12; // Assume 30 year standard
    
    let maxLoan = 0;
    if (r > 0) {
       maxLoan = (paymentForPI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    } else {
       maxLoan = paymentForPI * n;
    }
    
    setMaxLoanAmount(Math.max(0, maxLoan));
    setMaxHomePrice(Math.max(0, maxLoan + (downPayment || 0)));

  }, [annualIncome, monthlyDebts, downPayment, affordRate, mode]);

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

      const colors = isDarkMode ? {
         bg: [15, 23, 42], text: [248, 250, 252], textMuted: [148, 163, 184], 
         accent: [59, 130, 246], accentText: [96, 165, 250], 
         cardBg: [30, 41, 59], border: [51, 65, 85]
      } : {
         bg: [255, 255, 255], text: [15, 23, 42], textMuted: [100, 116, 139], 
         accent: [37, 99, 235], accentText: [37, 99, 235], 
         cardBg: [248, 250, 252], border: [226, 232, 240]
      };

      doc.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]);
      doc.rect(0, 0, pageWidth, pageHeight, 'F');

      // Header Logic (Identical to before but with Mortgage Title)
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
      doc.text("Mortgage Repayment Estimate", margin, 50);

      // ... Table generation
      const tableBody = schedule.map(row => [
        row.year,
        currency(row.interest),
        currency(row.principal),
        currency(row.balance),
        currency(row.totalInterest)
      ]);

      (doc as any).autoTable({
        startY: 90,
        head: [['Year', 'Interest Paid', 'Principal Paid', 'Remaining Balance', 'Total Interest']],
        body: tableBody,
        theme: 'plain',
        margin: { top: margin, bottom: 30, left: margin, right: margin },
        styles: { font: "helvetica", fontSize: 9, cellPadding: 4, textColor: colors.text, fillColor: isDarkMode ? [30, 41, 59] : [255, 255, 255], lineColor: colors.border, lineWidth: 0.1 },
        headStyles: { fillColor: isDarkMode ? [15, 23, 42] : [241, 245, 249], textColor: isDarkMode ? [255, 255, 255] : [15, 23, 42], fontStyle: 'bold' },
        willDrawPage: function (data: any) { if (data.pageNumber > 1) { doc.setFillColor(colors.bg[0], colors.bg[1], colors.bg[2]); doc.rect(0, 0, pageWidth, pageHeight, 'F'); } },
        didDrawPage: function (data: any) {
            // Footer on every page
            doc.setFontSize(8);
            doc.setTextColor(colors.textMuted[0], colors.textMuted[1], colors.textMuted[2]);
            doc.text("Sterling Loans Australia | Mortgage Estimate", margin, pageHeight - 15);
            doc.text(`Page ${data.pageNumber}`, pageWidth - margin, pageHeight - 15, { align: 'right' });
        }
      });

      doc.save(`Sterling_Mortgage_Report_${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (err) {
      alert("Failed to generate PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Ticker Section */}
      <div className="pt-4 lg:pt-8 pb-4 container mx-auto px-4">
         <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
             <RateTicker />
         </div>
      </div>

      <div className="pt-4 pb-16 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10 pt-10">
            <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl text-blue-600 dark:text-blue-400 mb-6 shadow-lg shadow-blue-500/20">
               <CalcIcon size={32} />
            </div>
            <h1 className="text-3xl lg:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">Financial Calculator</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Plan your home purchase with precision. Switch modes to calculate payments or purchasing power.
            </p>
          </div>

          {/* MODE TOGGLE */}
          <div className="flex justify-center mb-10">
             <div className="bg-white dark:bg-slate-800 p-1.5 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex gap-2">
                <button 
                  onClick={() => setMode('repayment')}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${mode === 'repayment' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  Repayment Calculator
                </button>
                <button 
                  onClick={() => setMode('affordability')}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${mode === 'affordability' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  Affordability Calculator
                </button>
             </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 mb-16 items-stretch">
            
            {/* INPUT SECTION */}
            <div className="w-full lg:w-5/12 flex flex-col gap-6">
              <div className="flex flex-col h-full bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm dark:shadow-slate-900/50 overflow-hidden border-t-4 border-t-blue-500">
                 
                 {/* --- REPAYMENT MODE INPUTS --- */}
                 {mode === 'repayment' && (
                   <>
                    <div className="flex border-b border-slate-200 dark:border-slate-800">
                        <button onClick={() => setActiveTab('loan')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'loan' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                          <Home size={16} /> Loan
                        </button>
                        <button onClick={() => setActiveTab('expenses')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'expenses' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                          <Layers size={16} /> Expenses
                        </button>
                        <button onClick={() => setActiveTab('extra')} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'extra' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                          <Zap size={16} /> Extra
                        </button>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                      {activeTab === 'loan' && (
                          <div className="space-y-6 animate-fade-in">
                              <div className="space-y-2 group">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pl-4">Scenario</label>
                                <div className="relative">
                                  <select value={loanType} onChange={handleTypeChange} className="w-full pl-4 pr-10 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:border-blue-500 outline-none appearance-none cursor-pointer">
                                    <option value="purchase">Home Purchase</option>
                                    <option value="refinance">Refinance</option>
                                    <option value="investment">Investment Property</option>
                                  </select>
                                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                </div>
                              </div>

                              <div>
                                  <Input label="Loan Amount" icon={<DollarSign size={16}/>} type="number" value={amount} onChange={handleAmountChange} min={0} max={INPUT_MAX_AMOUNT} />
                                  <div className="px-1 pt-2">
                                      <input type="range" min="0" max={MAX_AMOUNT} step="5000" value={amount > MAX_AMOUNT ? MAX_AMOUNT : amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                  </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <Input label="Interest Rate (%)" icon={<Percent size={16}/>} type="number" step="0.01" value={rate} onChange={e => setRate(Number(e.target.value))} />
                                <div>
                                  <Input label="Term (Years)" icon={<Calendar size={16}/>} type="number" value={term} onChange={handleTermChange} min={1} max={MAX_TERM} />
                                  <div className="px-1 pt-2">
                                      <input type="range" min="1" max={MAX_TERM} step="1" value={term} onChange={(e) => setTerm(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2 group">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 pl-4">Frequency</label>
                                <div className="relative">
                                  <select value={frequency} onChange={(e) => setFrequency(e.target.value as any)} className="w-full pl-4 pr-10 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white outline-none appearance-none cursor-pointer">
                                    <option value="monthly">Monthly</option>
                                    <option value="fortnightly">Fortnightly</option>
                                    <option value="weekly">Weekly</option>
                                  </select>
                                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                </div>
                              </div>
                          </div>
                      )}

                      {activeTab === 'expenses' && (
                          <div className="space-y-6 animate-fade-in">
                            <Input label="Yearly Property Tax" icon={<DollarSign size={16}/>} type="number" value={taxYearly} onChange={e => setTaxYearly(Number(e.target.value))} />
                            <Input label="Yearly Home Insurance" icon={<DollarSign size={16}/>} type="number" value={insuranceYearly} onChange={e => setInsuranceYearly(Number(e.target.value))} />
                          </div>
                      )}

                      {activeTab === 'extra' && (
                          <div className="space-y-6 animate-fade-in">
                            <Input label={`Extra ${frequency} Payment`} icon={<DollarSign size={16}/>} type="number" value={extraPayment} onChange={e => setExtraPayment(Number(e.target.value))} />
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Lump Sum Payment</h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <Input label="Amount" icon={<DollarSign size={16}/>} type="number" value={lumpSum} onChange={e => setLumpSum(Number(e.target.value))} />
                                  <Input label="At Year" icon={<Calendar size={16}/>} type="number" value={lumpSumYear} onChange={e => setLumpSumYear(Number(e.target.value))} />
                                </div>
                            </div>
                          </div>
                      )}
                    </div>
                   </>
                 )}
                 
                 {/* --- AFFORDABILITY MODE INPUTS --- */}
                 {mode === 'affordability' && (
                    <div className="p-6 md:p-8 space-y-6 animate-fade-in">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 mb-2">
                          <p className="text-sm text-blue-700 dark:text-blue-300">
                            We calculate based on a conservative 28% front-end debt-to-income ratio to ensure you aren't house poor.
                          </p>
                        </div>

                        <Input label="Annual Income (Before Tax)" icon={<Briefcase size={16}/>} type="number" value={annualIncome} onChange={e => setAnnualIncome(Number(e.target.value))} />
                        
                        <Input label="Monthly Debts (Car, Cards, Loans)" icon={<Wallet size={16}/>} type="number" value={monthlyDebts} onChange={e => setMonthlyDebts(Number(e.target.value))} />
                        
                        <div className="grid grid-cols-2 gap-4">
                           <Input label="Down Payment" icon={<DollarSign size={16}/>} type="number" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} />
                           <Input label="Est. Interest Rate (%)" icon={<Percent size={16}/>} type="number" value={affordRate} onChange={e => setAffordRate(Number(e.target.value))} />
                        </div>
                    </div>
                 )}

                 <div className="lg:hidden p-6 pt-0">
                    <Button onClick={scrollToResults} className="w-full flex items-center justify-center gap-2">
                        See Results <ArrowDownCircle size={18} />
                    </Button>
                 </div>
              </div>
            </div>

            {/* DASHBOARD */}
            <div ref={resultsRef} className="w-full lg:w-7/12 flex flex-col gap-6 h-full">
               
               {/* --- REPAYMENT DASHBOARD --- */}
               {mode === 'repayment' && (
                 <>
                  {/* SUMMARY CARD - Theme Adaptive */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl relative overflow-hidden p-8 shadow-2xl shrink-0 border border-slate-200 dark:border-slate-800">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[100px] opacity-10 dark:opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
                      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                          <div>
                            <h2 className="text-lg font-medium text-slate-500 dark:text-slate-300 mb-1">Total {frequency.charAt(0).toUpperCase() + frequency.slice(1)} Payment</h2>
                            <div className="text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-2 text-blue-600 dark:text-white">
                                {currency(periodicRepayment + extraPayment + (taxYearly/12) + (insuranceYearly/12))}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600 dark:text-blue-300 mt-4">
                                <span>Principal & Interest: {currency(periodicRepayment)}</span>
                                {(taxYearly > 0 || insuranceYearly > 0) && (
                                  <span className="text-slate-400">
                                    + Taxes/Ins: {currency((taxYearly + insuranceYearly)/12)}
                                  </span>
                                )}
                            </div>
                          </div>
                          <div className="bg-slate-50 dark:bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-slate-100 dark:border-white/10">
                            <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-white/10 pb-4">
                                <span className="text-slate-500 dark:text-slate-300 text-sm">Payoff Date</span>
                                <span className="font-bold flex items-center gap-2 text-slate-900 dark:text-white"><Clock size={16}/> {payoffDate}</span>
                            </div>
                            {interestSaved > 0 ? (
                              <div className="space-y-3">
                                  <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-300">
                                    <span className="text-sm">Interest Saved</span>
                                    <span className="font-bold">{currency(interestSaved)}</span>
                                  </div>
                                  <div className="flex justify-between items-center text-blue-600 dark:text-blue-300">
                                    <span className="text-sm">Time Saved</span>
                                    <span className="font-bold">{timeSaved}</span>
                                  </div>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center text-slate-500 dark:text-slate-300">
                                  <span className="text-sm">Total Interest</span>
                                  <span className="font-bold text-slate-900 dark:text-white">{currency(totalInterest)}</span>
                              </div>
                            )}
                          </div>
                      </div>
                  </div>

                  {/* BREAKDOWN CARDS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                      <Card className="p-6 flex flex-col justify-center items-center text-center h-full">
                        <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Cost</h4>
                        <div className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">
                            {currency(totalCost)}
                        </div>
                        <p className="text-sm text-slate-500">Includes Principal + Interest</p>
                      </Card>

                      <Card className="p-6 h-full flex flex-col justify-center">
                        <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-6">Cost Analysis</h4>
                        <div className="space-y-6">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{totalCost > 0 ? Math.round((amount/totalCost)*100) : 0}%</span>
                                  <span className="text-xs text-slate-500">Principal</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden flex">
                                  <div className="bg-blue-500 h-full" style={{ width: `${totalCost > 0 ? (amount/totalCost)*100 : 0}%` }}></div>
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-amber-500">{totalCost > 0 ? Math.round((totalInterest/totalCost)*100) : 0}%</span>
                                  <span className="text-xs text-slate-500">Interest</span>
                              </div>
                              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden flex">
                                  <div className="bg-amber-500 h-full" style={{ width: `${totalCost > 0 ? (totalInterest/totalCost)*100 : 0}%` }}></div>
                              </div>
                            </div>
                        </div>
                      </Card>
                  </div>
                 </>
               )}

               {/* --- AFFORDABILITY DASHBOARD --- */}
               {mode === 'affordability' && (
                  <div className="h-full flex flex-col gap-6 animate-fade-in">
                     <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl relative overflow-hidden p-8 shadow-2xl flex-1 text-white border border-blue-500">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-[80px] -mr-10 -mt-10"></div>
                        
                        <h2 className="text-blue-100 font-medium text-lg mb-2">Maximum Home Price</h2>
                        <div className="text-5xl lg:text-7xl font-serif font-bold tracking-tight mb-6">
                          {currency(maxHomePrice)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/20 pt-8">
                           <div>
                              <p className="text-blue-200 text-sm mb-1">Max Loan Amount</p>
                              <p className="text-2xl font-bold">{currency(maxLoanAmount)}</p>
                           </div>
                           <div>
                              <p className="text-blue-200 text-sm mb-1">Est. Monthly Budget</p>
                              <p className="text-2xl font-bold">{currency(maxMonthlyPayment)}</p>
                           </div>
                        </div>
                     </div>

                     <Card className="p-8">
                        <div className="flex items-start gap-4">
                           <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                              <Info size={24} />
                           </div>
                           <div>
                              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">Broker Tip</h3>
                              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                 This is an estimate based on your income and debts. Lenders can sometimes go higher or lower depending on your credit score and specific loan program (like FHA vs Conventional). 
                              </p>
                              <div className="mt-4">
                                 <Button size="sm" variant="outline" onClick={() => window.location.hash = '#/contact'}>
                                    Get Official Pre-Approval
                                 </Button>
                              </div>
                           </div>
                        </div>
                     </Card>
                  </div>
               )}
            </div>
          </div>
          
          {/* AMORTIZATION SCHEDULE (Only Repayment Mode) */}
          {mode === 'repayment' && (
            <div className="w-full mb-12 animate-fade-up">
              <Card className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <BarChart size={24} className="text-blue-500"/> Amortization Schedule
                      </h3>
                      <Button size="sm" variant="secondary" onClick={handleExportPDF} disabled={isExporting} className="gap-2">
                        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
                        Export PDF
                      </Button>
                  </div>
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl max-h-[500px] overflow-y-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold sticky top-0 backdrop-blur-sm z-10">
                            <tr>
                              <th className="p-4">Year</th>
                              <th className="p-4">Interest</th>
                              <th className="p-4">Principal</th>
                              <th className="p-4">Balance</th>
                              <th className="p-4">Total Int.</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {schedule.map((row) => (
                              <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
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
              </Card>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Calculator;
