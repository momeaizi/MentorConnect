import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export const useProtectedRoute = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!loading && !hasRedirected.current) {
      if (!user) {
        hasRedirected.current = true;
        router.push('/');
      } else if (pathname === '/') {
        hasRedirected.current = true;
        router.push('/home');
      }
    }
    console.log(pathname)
  }, [user, loading, pathname, router]);

  return { isLoading: loading };
};

