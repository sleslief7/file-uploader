import { checkAuth } from '@/api/authApi';
import type { User } from '@/interfaces/UserInterface';
import { useQuery } from '@tanstack/react-query';

type CheckAuthResponse = {
  isAuth: boolean;
  user: User | null;
};

const useCheckAuth = () => {
  const dataFallback = { isAuth: false, user: null };

  const { data = dataFallback, ...queryRest } = useQuery<CheckAuthResponse>({
    queryKey: ['user'],
    queryFn: checkAuth,
  });

  return { data, ...queryRest };
};

export default useCheckAuth;
