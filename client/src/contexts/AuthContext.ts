import { createContext } from 'react';
import type { User } from '../interfaces/UserInterface';

interface UserContextType {
  isAuth: boolean;
  user: User | null;
}

export const AuthContext = createContext<UserContextType>({
  isAuth: false,
  user: null,
});
