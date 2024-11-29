'use client';

import { ReactNode, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    console.log(user)
    if (!user) {
      router.push('/');
    }
    else {
      router.push('/viewers');
    }
  }, [user, router]);

  if (!user || router.pathname !== '/') return null;

  return <>{children}</>;
};

export default ProtectedRoute;
