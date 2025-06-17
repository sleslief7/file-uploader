import axios from 'axios';
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const checkAuth = async () => {
  try {
    const res = await apiClient.get(`/check-auth`);
    return res.data;
  } catch (err) {
    console.error('Error checking auth', err);
    throw err;
  }
};
