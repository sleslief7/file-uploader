import { createContext } from 'react';
import type { User } from '../interfaces/UserInterface';

interface UserContextType {
  isAuth: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const AuthContext = createContext<UserContextType | undefined>(
  undefined
);
