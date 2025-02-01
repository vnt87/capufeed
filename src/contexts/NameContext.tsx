import { createContext, useContext, useEffect, useState } from 'react';

interface NameContextType {
  name: string;
  setName: (name: string) => void;
}

const NameContext = createContext<NameContextType | undefined>(undefined);

export function NameProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState<string>(() => {
    const savedName = localStorage.getItem('babyName');
    return savedName || 'Capu';
  });

  useEffect(() => {
    localStorage.setItem('babyName', name);
  }, [name]);

  return (
    <NameContext.Provider value={{ name, setName }}>
      {children}
    </NameContext.Provider>
  );
}

export function useName() {
  const context = useContext(NameContext);
  if (context === undefined) {
    throw new Error('useName must be used within a NameProvider');
  }
  return context;
}
