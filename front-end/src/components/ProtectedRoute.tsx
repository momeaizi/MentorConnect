'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      }
      if (router.pathname === '/') {
        router.push('/viewers');
      }
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <Spin
        size="large"
        tip="Authenticating..."
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
