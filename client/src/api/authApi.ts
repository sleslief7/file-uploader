import type {
  FolderTree,
  Storage,
  User,
  UserSignupRequest,
} from '@/interfaces/UserInterface';
import apiClient from './apiClient';

export const checkAuth = async () => {
  try {
    const res = await apiClient.get(`/auth`);
    return res.data;
  } catch (err) {
    console.error('Error checking auth', err);
    throw err;
  }
};

export const login = async (
  username: string,
  password: string
): Promise<User> => {
  try {
    const res = await apiClient.post<{ user: User }>(`/login`, {
      username: username,
      password: password,
    });
    return res.data.user;
  } catch (err) {
    console.error('Error logging in', err);
    throw err;
  }
};

export const logout = async () => {
  try {
    await apiClient.post(`/logout`);
  } catch (err) {
    console.error('Error logging out', err);
    throw err;
  }
};

export const signup = async (user: UserSignupRequest) => {
  try {
    await apiClient.post(`/sign-up`, {
      name: user.name,
      username: user.username,
      password: user.password,
    });
  } catch (err) {
    console.error('Error logging out', err);
    throw err;
  }
};

export const userStorage = async (userId: number): Promise<Storage> => {
  try {
    const { data: storage } = await apiClient.get(`/users/${userId}/storage`);
    return storage as Storage;
  } catch (err) {
    console.error('Error logging out', err);
    throw err;
  }
};

export const getFolderTree = async (userId: number): Promise<FolderTree> => {
  try {
    const { data: folderTree } = await apiClient.get(
      `/users/${userId}/folder_tree`
    );
    return folderTree as FolderTree;
  } catch (err) {
    console.error('Error getting folder trees', err);
    throw err;
  }
};
