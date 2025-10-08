import apiClient from './apiClient';
import type { User } from '@/interfaces/UserInterface';

export interface UpdateProfileRequest {
  name?: string;
  profileImage?: File;
}

export const updateProfile = async (
  userId: number,
  updateData: UpdateProfileRequest
): Promise<User> => {
  try {
    const formData = new FormData();

    if (updateData.name) {
      formData.append('name', updateData.name);
    }

    if (updateData.profileImage) {
      formData.append('profileImage', updateData.profileImage);
    }

    const { data } = await apiClient.put(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.user;
  } catch (err) {
    console.error('Error updating profile', err);
    throw err;
  }
};
