'use client';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { jwtDecode } from "jwt-decode"; // Ensure you're using jwt-decode correctly
import axios from "axios";

interface AuthContextType {
  user: UserPayload | null;
  loading: boolean;
  setUser: (user: UserPayload | null) => void;
  logout: () => void;
}

interface JwtPayload {
  exp?: number;
  iat?: number;
}

interface UserPayload extends JwtPayload {
  email?: string;
  name?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const initializeAuth = async () => {
      const access_token = localStorage.getItem('access_token');
      if (access_token) {
        try {
          const decoded: UserPayload = jwtDecode(access_token);
          setUser(decoded);
          if (decoded.exp && decoded.exp * 1000 > Date.now()) {
            axios.defaults.headers.common["Authorization"] = "Bearer " + access_token;
          } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem('access_token');
          }
        } catch (error) {
          delete axios.defaults.headers.common["Authorization"];
          console.error('Invalid token:', error);
          localStorage.removeItem('access_token');
        }
      }
      setLoading(false); // Set loading to false after initialization
    };

    initializeAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('access_token');
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
