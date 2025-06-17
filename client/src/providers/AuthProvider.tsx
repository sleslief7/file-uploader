import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { User } from '../interfaces/UserInterface';
import { checkAuth } from '../api/queries';

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    setUser(user);
    setIsAuth(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuth(false);
  };

  useEffect(() => {
    const checkAuthCall = async () => await checkAuth();
    checkAuthCall()
      .then((data) => {
        if (data?.isAuth) setIsAuth(data.isAuth);
        if (data?.user) setUser(data.user);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, user, setUser, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
