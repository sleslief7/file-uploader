import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';

const RedirectIfAuth = ({ children }: { children: ReactNode }) => {
  const { isAuth } = useAuth();

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RedirectIfAuth;
