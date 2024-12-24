import axios from 'axios';
import { useAuth } from '../providers/AuthProvider';
import { isTokenExpired } from '../utils/jwtUtils';

const baseURL = 'https://musical-space-acorn-gw9wjjpjjggf96rw-5000.app.github.dev/api';


export const publicApi = axios.create({
  baseURL,
});


const api = axios.create({
  baseURL,
});


api.interceptors.request.use((config) => {
  const { isAuthenticated, payload, token, logout } = useAuth();

  if (!isAuthenticated || !token || isTokenExpired(payload)) {
    logout();
    return config;
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;