import { JwtPayload } from 'jwt-decode';


export interface CustomJwtPayload extends JwtPayload {
    id: number;
    username: string;
    email: string;
    is_verified: boolean;
    is_complete?: boolean;
}
  
  export const isTokenExpired = (payload: CustomJwtPayload | null): boolean => {
    if (!payload) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp ? payload.exp < currentTime : true;
  };
  