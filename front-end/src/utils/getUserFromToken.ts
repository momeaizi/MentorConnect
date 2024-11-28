import jwt_decode from 'jwt-decode';

type TokenPayload = {
  id: string;
  username: string;
  email: string;
  exp: number;
  [key: string]: any;
};

export const getUserFromToken = (): TokenPayload | null => {
    if (typeof window === 'undefined') return null;
  
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.warn('No token found');
      return null;
    }
  
    try {
      const decoded: TokenPayload = jwt_decode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        console.warn('Token has expired');
        localStorage.removeItem('jwt');
        return null;
      }
  
      return decoded;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };
  