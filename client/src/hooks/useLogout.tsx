import { logout } from '@/api/authApi';
import { toaster } from '@/components/ui/toaster';
import { queryClient } from '@/tanstack/queryClient';
import { useMutation } from '@tanstack/react-query';

const useLogout = () =>
  useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toaster.create({
        title: 'You have successfully logout!',
        type: 'success',
      });
    },
  });

export default useLogout;
