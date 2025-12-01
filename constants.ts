import { 
  Home, 
  User, 
  Briefcase, 
  DollarSign, 
  MessageSquare, 
  HelpCircle, 
  Phone,
  Building,
  Plane,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';
import { NavItem, ServiceItem, LoanCategory, Testimonial, FAQItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Loan Types', path: '/loans' },
  { label: 'Calculator', path: '/calculator' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
];

export const SERVICES: ServiceItem[] = [
  {
    title: 'Personal Consultation',
    description: 'One-on-one meetings to understand your unique financial situation and goals.',
    icon: User,
  },
  {
    title: 'Fast Pre-Approval',
    description: 'Get pre-approved quickly so you can shop for your dream home or car with confidence.',
    icon: Briefcase,
  },
  {
    title: 'Refinancing Analysis',
    description: 'Review your current loans to see if we can lower your interest rate or monthly payments.',
    icon: DollarSign,
  },
];

export const LOAN_CATEGORIES: LoanCategory[] = [
  {
    id: 'home',
    title: 'Home Loans',
    description: 'Whether buying your first home or investing in property, we find the best mortgage rates.',
    features: ['Fixed & Variable Rates', 'First-time Buyer Programs', 'Investment Property Loans'],
    icon: Building,
    minRate: '5.5%',
    eligibility: 'Credit Score 620+',
    maxAmount: '$2,000,000',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'personal',
    title: 'Personal Loans',
    description: 'Flexible funding for weddings, travel, debt consolidation, or unexpected expenses.',
    features: ['Unsecured Loans', 'Debt Consolidation', 'Quick Disbursement'],
    icon: Plane,
    minRate: '7.2%',
    eligibility: 'Employed 6+ Months',
    maxAmount: '$100,000',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'business',
    title: 'Business Loans',
    description: 'Capital to start, grow, or sustain your business operations with competitive terms.',
    features: ['Equipment Financing', 'Working Capital', 'SBA Loans'],
    icon: Briefcase,
    minRate: '6.8%',
    eligibility: '2+ Years in Business',
    maxAmount: '$5,000,000',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'education',
    title: 'Student Refinancing',
    description: 'Manage your student debt better with lower rates and unified payments.',
    features: ['Rate Reduction', 'Simplified Payments', 'Flexible Terms'],
    icon: GraduationCap,
    minRate: '4.9%',
    eligibility: 'Degree Completed',
    maxAmount: '$250,000',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Small Business Owner',
    quote: 'James helped me secure the capital I needed to expand my bakery. The process was transparent and faster than I expected.',
    avatar: 'https://picsum.photos/100/100?random=1',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'First-time Homebuyer',
    quote: 'As a first-time buyer, I was overwhelmed. The guidance I received was invaluable. I’m now living in my dream home!',
    avatar: 'https://picsum.photos/100/100?random=2',
  },
  {
    id: 3,
    name: 'Emily & David',
    role: 'Newlyweds',
    quote: 'We needed a personal loan for our wedding. The rates were great, and the personal touch made us feel like family.',
    avatar: 'https://picsum.photos/100/100?random=3',
  },
];

export const FAQS: FAQItem[] = [
  // Credit & Eligibility
  {
    category: 'Credit & Eligibility',
    question: 'What credit score do I need to apply?',
    answer: 'While a score of 670+ offers the best rates, we work with a variety of lenders who accept scores as low as 580 for certain loan types like FHA mortgages. We can also provide advice on how to improve your score quickly.',
  },
  {
    category: 'Credit & Eligibility',
    question: 'Can I apply if I am self-employed?',
    answer: 'Absolutely. We specialize in working with self-employed borrowers. Instead of W-2s, we may use bank statements or 1099 forms to verify your income and determine eligibility.',
  },
  
  // Application Process
  {
    category: 'Application Process',
    question: 'How long does the approval process take?',
    answer: 'Pre-approval can happen in as little as 24 hours. Full loan closing times vary: Personal loans take 2-5 days, while home loans typically take 30-45 days depending on the complexity of the property verification.',
  },
  {
    category: 'Application Process',
    question: 'What documents will I need?',
    answer: 'Typically, you will need proof of identity (ID), proof of income (pay stubs, tax returns), and bank statements. For home loans, you may also need asset documentation and information on the property you intend to buy.',
  },

  // Rates & Fees
  {
    category: 'Rates & Fees',
    question: 'Are there any hidden fees?',
    answer: 'Transparency is our core value. All origination fees, appraisal costs, and closing fees will be clearly outlined in your Loan Estimate document before you sign anything. We do not charge "surprise" administration fees.',
  },
  {
    category: 'Rates & Fees',
    question: 'What is the difference between fixed and variable rates?',
    answer: 'A fixed rate stays the same for the entire life of the loan, providing stable monthly payments. A variable (or adjustable) rate may start lower but can change over time based on market conditions, which means your payments could increase or decrease.',
  },
  
  // Home Loans
  {
    category: 'Home Loans',
    question: 'How much down payment do I need?',
    answer: 'It depends on the loan program. FHA loans allow as low as 3.5%, while conventional loans often require 5-20%. VA and USDA loans may offer 0% down options for eligible borrowers.',
  },
  {
    category: 'Home Loans',
    question: 'What is PMI (Private Mortgage Insurance)?',
    answer: 'PMI is usually required if you put down less than 20% on a conventional home loan. It protects the lender if you default. Once you build 20% equity in your home, you can typically request to have PMI removed.',
  },

  // Refinancing
  {
    category: 'Refinancing',
    question: 'When is a good time to refinance?',
    answer: 'Generally, if interest rates drop 0.75% to 1% below your current rate, it might be a good time to refinance. It is also worth considering if you want to switch from an adjustable rate to a fixed rate or shorten your loan term.',
  },
  {
    category: 'Refinancing',
    question: 'Can I pay off my loan early?',
    answer: 'Most of our loan products have no prepayment penalties. You can pay off your balance early to save significantly on interest costs. We always recommend checking the specific terms of your agreement.',
  },
];