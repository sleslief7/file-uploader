import { createContext } from 'react';

interface SearchContextType {
  searchName?: string;
  setSearchName: React.Dispatch<React.SetStateAction<string>>;
}

export const SearchContext = createContext<SearchContextType>({
  searchName: undefined,
  setSearchName: () => {},
});
