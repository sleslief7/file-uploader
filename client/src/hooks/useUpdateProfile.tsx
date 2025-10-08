import { updateProfile, type UpdateProfileRequest } from '@/api/userApi';
import { toaster } from '@/components/ui/toaster';
import { useAuth } from '@/hooks/useAuth';
import { queryClient } from '@/tanstack/queryClient';
import { useMutation } from '@tanstack/react-query';

export const useUpdateProfile = () => {
  const { user, isAuth } = useAuth();

  return useMutation({
    mutationFn: (updateData: UpdateProfileRequest) => {
      if (!isAuth) throw new Error('User not authenticated');

      return updateProfile(user!.id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['auth'],
      });

      toaster.create({
        title: 'Profile updated successfully!',
        type: 'success',
      });
    },
    onError: (error) => {
      toaster.create({
        title: 'Failed to update profile',
        description:
          error instanceof Error ? error.message : 'Unknown error occurred',
        type: 'error',
      });
    },
  });
};
