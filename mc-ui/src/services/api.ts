import axios from 'axios';
import { CustomJwtPayload, isTokenExpired } from '../utils/jwtUtils';
import { jwtDecode } from 'jwt-decode';

const baseURL = 'http://localhost:7777/api';


export const publicApi = axios.create({
  baseURL,
});


const api = axios.create({
  baseURL,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  let payload = null;

  if (!token) return config;

  try {
    payload = jwtDecode<CustomJwtPayload>(token);
    if (isTokenExpired(payload)) return config;


    config.headers.Authorization = `Bearer ${token}`;
  } catch (err) { }
  return config;
});


api.interceptors.response.use(
  (response: any) => response,
  async (error: any) => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
});

export default api;