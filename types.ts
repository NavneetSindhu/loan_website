import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface LoanCategory {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  minRate: string;
  eligibility: string;
  maxAmount: string;
  image: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}