import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/navigation';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use(
  async (config:any) => {
    let accessToken:any = localStorage.getItem('token');
    if (accessToken) {
      const { exp }:any = jwtDecode(accessToken);
      if (Date.now() >= exp * 1000) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const response = await axios.get('http://65.20.105.32:8080/api/auth/refresh',  {
              headers: {
                'Authorization': `Bearer ${refreshToken}`
              }
            });
            accessToken = response.data.access_token;
            localStorage.setItem('token', accessToken);
          } catch (error) {
            console.error('Failed to refresh token', error);
            return Promise.reject(error);
          }
        }
    }
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error:any) => Promise.reject(error)
);

api.interceptors.response.use(
  (response:any) => response,
  async (error:any) => {
    const router = useRouter();
    if (error.response.status === 401) {
      router.push('/');
      
    }
    return Promise.reject(error);
  }
);

export default api;