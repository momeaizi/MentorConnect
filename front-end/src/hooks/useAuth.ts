import jwt_decode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useEffect } from 'react'

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      router.push('/login');
      return;
    }

    try {
      const decoded: { exp: number } = jwt_decode(access_token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        localStorage.removeItem('access_token');
        router.push('/login');
      }
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('access_token');
      router.push('/login');
    }
  }, [router]);
};

export default useAuth;
