
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

interface AuthState {
  user: any;
  isAuthenticated: boolean;
  isVerified: boolean;
  isProfileComplete: boolean;
}

function getAuthState() {
  try {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      return {
        user: null,
        isAuthenticated: false,
        isVerified: false,
        isProfileComplete: false,
      };
    }
    const decoded = jwtDecode(access_token);
    return {
      user: decoded,
      isAuthenticated: !!access_token,
      isVerified: true,//decoded.is_verified,
      isProfileComplete: true,//decoded.is_profile_complete,
    };
  }
  catch (err) {
    return {
      user: null,
      isAuthenticated: false,
      isVerified: false,
      isProfileComplete: false,
    };
  }
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(getAuthState());


  const login = (access_token: string) => {
    localStorage.setItem('access_token', access_token);
    setAuthState(getAuthState());
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setAuthState({ user: null, isAuthenticated: false, isVerified: false, isProfileComplete: false });
  };

  return {
    ...authState,
    login,
    logout,
  };
}

