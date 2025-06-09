import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CategoryContextValue {
  category: string;
  setCategory: (category: string) => void;
}

const CategoryContext = createContext<CategoryContextValue | undefined>(
  undefined
);

interface CategoryProviderProps {
  children: ReactNode;
  initialCategory?: string;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({
  children,
  initialCategory = '',
}) => {
  const [category, setCategory] = useState<string>(initialCategory);

  return (
    <CategoryContext.Provider value={{ category, setCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = (): CategoryContextValue => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};
