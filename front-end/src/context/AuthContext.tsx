'use client';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { jwtDecode } from "jwt-decode";


interface AuthContextType {
  user: UserPayload | null;
  setUser: (user: UserPayload | null) => void;
  logout: () => void;
}

interface UserPayload extends JwtPayload {
  email?: string;
  name?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      try {
        const decoded : UserPayload = jwtDecode(access_token);
        console.log(decoded)
        setUser(decoded);
        if (decoded.exp && decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          localStorage.removeItem('access_token');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('access_token');
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
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
