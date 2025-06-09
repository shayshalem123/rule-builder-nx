import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DestinationContextValue {
  destination: string;
  setDestination: (destination: string) => void;
}

const DestinationContext = createContext<DestinationContextValue | undefined>(
  undefined
);

interface DestinationProviderProps {
  children: ReactNode;
  initialDestination?: string;
}

export const DestinationProvider: React.FC<DestinationProviderProps> = ({
  children,
  initialDestination = '',
}) => {
  const [destination, setDestination] = useState<string>(initialDestination);

  return (
    <DestinationContext.Provider value={{ destination, setDestination }}>
      {children}
    </DestinationContext.Provider>
  );
};

export const useDestination = (): DestinationContextValue => {
  const context = useContext(DestinationContext);
  if (context === undefined) {
    throw new Error('useDestination must be used within a DestinationProvider');
  }
  return context;
};
