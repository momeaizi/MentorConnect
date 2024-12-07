'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, token } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    console.log(isAuthenticated, token)
    if (!isAuthenticated) {
      router.push('/');
    }
  }, []);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

