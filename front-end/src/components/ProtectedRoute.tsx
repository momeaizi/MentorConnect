'use client';
import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      }
      else if (pathname === '/') {
        router.push('/viewers');
      }
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">Loading...</div>
    );
  }
  else if ((!user && pathname !== '/') || (user && pathname === '/')) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
