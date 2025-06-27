import { signup } from '@/api/authApi';
import { toaster } from '@/components/ui/toaster';
import type { UserSignupRequest } from '@/interfaces/UserInterface';
import { useMutation } from '@tanstack/react-query';

const useSignup = () =>
  useMutation({
    mutationFn: (user: UserSignupRequest) => signup(user),
    onSuccess: () => {
      toaster.create({
        title: 'You have signup successfully!',
        type: 'success',
      });
    },
  });

export default useSignup;
