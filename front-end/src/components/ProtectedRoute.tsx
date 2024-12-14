

import { ReactNode, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { UnverifiedUser } from '@/components/UnverifiedUser';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isVerified, isProfileComplete } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/') {
      router.push('/');
    } else if (isAuthenticated && pathname === '/') {
      router.push('/home');
    } else if (isAuthenticated && isVerified && !isProfileComplete && pathname !== 'profile') {
      router.push('/profile');
    }
  }, [isAuthenticated, isVerified, isProfileComplete, pathname]);

  if (!isAuthenticated && pathname !== '/') {
    return <div>loading</div>;
  }

  if (isAuthenticated && pathname === '/') {
    return <div>loading</div>;
  }

  if (isAuthenticated && !isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <UnverifiedUser />
      </div>
    )
  }

  if (isAuthenticated && isVerified && !isProfileComplete && pathname !== '/profile') {
    return <div>loading</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

