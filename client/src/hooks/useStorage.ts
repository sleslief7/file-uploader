import { userStorage } from '@/api/authApi';
import { useQuery } from '@tanstack/react-query';

const useStorage = (userId: number) => {
  const defaultData = { total: 0, usedStorage: 0 };
  const { data: storage = defaultData, ...queryRest } = useQuery({
    queryKey: ['storage'],
    queryFn: () => userStorage(userId),
  });

  return { storage, ...queryRest };
};

export default useStorage;
