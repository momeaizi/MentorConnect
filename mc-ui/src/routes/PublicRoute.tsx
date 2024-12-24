import { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { isTokenExpired } from '../utils/jwtUtils';



const PublicRoute: FC = () => {
  const { isAuthenticated, payload } = useAuth();

  return (!isAuthenticated || isTokenExpired(payload)) ? <Outlet /> : <Navigate to="/home" replace />;
};

export default PublicRoute;