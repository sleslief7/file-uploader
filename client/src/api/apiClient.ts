import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default apiClient;
