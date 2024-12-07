import { useState, useEffect } from 'react';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('access_token');
    return {
      token,
      isAuthenticated: !!token,
    };
  });


  const logout = () => {
    localStorage.removeItem('access_token');
    setAuthState({ token: null, isAuthenticated: false });
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setAuthState({ token, isAuthenticated: true });
    }
  }, []);

  return {
    ...authState,
    logout,
  };
}

