import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ApplicationContextType {
  isOpen: boolean;
  prefillLoanType: string;
  openApplication: (loanType?: string) => void;
  closeApplication: () => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prefillLoanType, setPrefillLoanType] = useState('Home Loan');

  const openApplication = (loanType: string = 'Home Loan') => {
    setPrefillLoanType(loanType);
    setIsOpen(true);
  };

  const closeApplication = () => {
    setIsOpen(false);
  };

  return (
    <ApplicationContext.Provider value={{ isOpen, prefillLoanType, openApplication, closeApplication }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};