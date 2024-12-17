import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  console.log("isAuthenticated: ", isAuthenticated);

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;