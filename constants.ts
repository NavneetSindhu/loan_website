
import { 
  Home, 
  ShieldCheck, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Award, 
  TrendingUp,
  Key,
  Landmark
} from 'lucide-react';
import { NavItem, ServiceItem, LoanCategory, Testimonial, FAQItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Services', path: '/services' },
  { label: 'Mortgages', path: '/loans' },
  { label: 'Calculator', path: '/calculator' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Contact', path: '/contact' },
];

export const SERVICES: ServiceItem[] = [
  {
    title: 'Home Purchase',
    description: 'Guidance from pre-approval to closing for first-time buyers and seasoned investors.',
    icon: Key,
  },
  {
    title: 'Strategic Refinancing',
    description: 'Optimize your mortgage to lower payments, shorten terms, or access home equity.',
    icon: TrendingUp,
  },
  {
    title: 'Investment Advisory',
    description: 'Specialized financing solutions for rental properties, BRRRR strategy, and portfolios.',
    icon: Briefcase,
  },
];

export const LOAN_CATEGORIES: LoanCategory[] = [
  {
    id: 'conventional',
    title: 'Conventional Loan',
    description: 'The standard for homebuyers. Great rates and flexible terms for borrowers with good credit.',
    features: ['Down payments as low as 3%', 'Fixed & Adjustable Rates', 'Terms from 10-30 years'],
    icon: Home,
    minRate: '6.5%',
    eligibility: 'Credit Score 620+',
    maxAmount: '$766,550',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fha',
    title: 'FHA Loan',
    description: 'Government-backed financing designed for first-time buyers and those with lower credit scores.',
    features: ['3.5% Down Payment', 'More lenient credit requirements', 'Assumable Mortgages'],
    icon: ShieldCheck,
    minRate: '6.0%',
    eligibility: 'Credit Score 580+',
    maxAmount: '$498,257',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'va',
    title: 'VA Loan',
    description: 'Exclusive benefits for Veterans, active military members, and eligible surviving spouses.',
    features: ['0% Down Payment', 'No PMI Required', 'Capped Closing Costs'],
    icon: Award,
    minRate: '5.8%',
    eligibility: 'Certificate of Eligibility',
    maxAmount: '$2,000,000+',
    // Updated Image: American Home with Flag context
    image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'jumbo',
    title: 'Jumbo Loan',
    description: 'Financing for luxury properties that exceed standard conforming loan limits.',
    features: ['Loans up to $5M+', 'Competitive Rates', 'Flexible Income Verification'],
    icon: Landmark,
    minRate: '7.0%',
    eligibility: 'Credit Score 700+',
    maxAmount: '$5,000,000',
    // Updated Image: Modern Luxury Home
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah & Mark',
    role: 'First-Time Homeowners',
    quote: 'James walked us through every step of the FHA process. We thought buying a home was impossible, but now we have the keys!',
    avatar: 'https://picsum.photos/100/100?random=1',
  },
  {
    id: 2,
    name: 'Robert Chen',
    role: 'Real Estate Investor',
    quote: 'The jumbo loan rates Sterling secured for my latest acquisition were unbeatable. Efficient, professional, and strategic.',
    avatar: 'https://picsum.photos/100/100?random=2',
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Refinance Client',
    quote: 'We refinanced to remove PMI and lowered our payment by $400/month. The process was completely seamless.',
    avatar: 'https://picsum.photos/100/100?random=3',
  },
];

export const FAQS: FAQItem[] = [
  // Eligibility
  {
    category: 'Eligibility',
    question: 'What credit score do I need to buy a house?',
    answer: 'It varies by loan type. FHA loans allow scores as low as 580. Conventional loans typically require 620+, while Jumbo loans often require 700 or higher.',
  },
  {
    category: 'Eligibility',
    question: 'How much down payment is really required?',
    answer: 'The 20% myth is just that—a myth. Conventional loans allow 3% down, and FHA loans require just 3.5%. VA and USDA loans offer 0% down options for eligible borrowers.',
  },
  
  // Process
  {
    category: 'Process',
    question: 'How long does it take to close a mortgage?',
    answer: 'On average, 30-45 days. However, we specialize in efficient processing and can often close conventional loans in as little as 21 days if all documentation is provided promptly.',
  },
  {
    category: 'Process',
    question: 'What is a Pre-Approval vs Pre-Qualification?',
    answer: 'Pre-qualification is a rough estimate based on self-reported info. Pre-approval is a verified commitment from a lender based on your actual documents, making your offer much stronger to sellers.',
  },

  // Costs
  {
    category: 'Costs',
    question: 'What are closing costs?',
    answer: 'Closing costs typically range from 2% to 5% of the loan amount. This includes appraisal fees, title insurance, origination fees, and prepaid property taxes.',
  },
  {
    category: 'Costs',
    question: 'What is PMI?',
    answer: 'Private Mortgage Insurance (PMI) protects the lender if you put down less than 20%. It is a monthly fee added to your mortgage payment until you reach 20% equity.',
  },
  
  // Refinancing
  {
    category: 'Refinancing',
    question: 'Can I take cash out of my home?',
    answer: 'Yes, a Cash-Out Refinance allows you to tap into your home equity to pay off debt, fund renovations, or cover other expenses. You replace your current mortgage with a larger one.',
  },
];
