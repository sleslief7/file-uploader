import { SearchContext } from '@/contexts/SearchContext';
import { useContext } from 'react';

export const useSearch = () => useContext(SearchContext);
