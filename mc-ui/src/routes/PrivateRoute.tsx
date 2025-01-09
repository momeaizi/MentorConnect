import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { isTokenExpired } from '../utils/jwtUtils';



const PrivateRoute: FC = () => {
  const { isAuthenticated, payload } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || isTokenExpired(payload)) {
    return (
      <Navigate to="/" replace />
    );
  }
  
  if (!payload?.is_complete && location.pathname != '/profile') {
    return (
      <Navigate to="/profile" replace />
    );
  }
  return (
    <Outlet />
  );
};

export default PrivateRoute;