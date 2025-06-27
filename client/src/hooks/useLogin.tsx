import { login } from '@/api/authApi';
import { toaster } from '@/components/ui/toaster';
import { queryClient } from '@/tanstack/queryClient';
import { useMutation } from '@tanstack/react-query';

type LoginDataType = {
  username: string;
  password: string;
};

const useLogin = () =>
  useMutation({
    mutationFn: (loginData: LoginDataType) =>
      login(loginData.username, loginData.password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toaster.create({
        title: 'You have successfully logged in!',
        type: 'success',
      });
    },
  });

export default useLogin;
