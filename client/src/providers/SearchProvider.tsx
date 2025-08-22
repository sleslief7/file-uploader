import { SearchContext } from '@/contexts/SearchContext';
import { useState, type ReactNode } from 'react';

const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchName, setSearchName] = useState('');
  return (
    <SearchContext.Provider value={{ searchName, setSearchName }}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
