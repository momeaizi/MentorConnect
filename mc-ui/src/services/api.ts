import axios from 'axios';
import { CustomJwtPayload, isTokenExpired } from '../utils/jwtUtils';
import { jwtDecode } from 'jwt-decode';

const baseURL = 'https://musical-space-acorn-gw9wjjpjjggf96rw-5000.app.github.dev/api';


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
  } catch (err) {
  }
  return config;
});

export default api;