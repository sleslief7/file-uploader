import { type ReactNode } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import useCheckAuth from '@/hooks/useCheckAuth';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    isLoading,
    data: { isAuth, user },
  } = useCheckAuth();

  return (
    <AuthContext.Provider value={{ isAuth, user }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
