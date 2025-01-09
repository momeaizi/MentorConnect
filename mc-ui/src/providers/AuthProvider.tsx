import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '../utils/jwtUtils';

interface User {
    id: number;
    username?: string;
    email?: string;
    is_verified?: boolean;
    is_complete?: boolean;
}



interface AuthContextType {
    user: User | null;
    token: string | null;
    payload: CustomJwtPayload | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [payload, setPayload] = useState<any | null>(() => {
        if (!token) return null;
        try {
            const decodedToken = jwtDecode<CustomJwtPayload>(token);
            return decodedToken;
        } catch (err) {
            return null;
        }
    }
    );
    const [user, setUser] = useState<User | null>(() => {
        if (!payload) return null;
        const { id, username, email, is_verified, is_complete } = payload;
        return { id, username, email, is_verified, is_complete };
    });
    const navigate = useNavigate();



    const login = (token: string) => {
        localStorage.setItem('token', token);
        setToken(token);
        setIsAuthenticated(!!token);

        if (!token) {
            setPayload(null);
            setUser(null);
            return ;
        }
        try {
            const decodedToken = jwtDecode<CustomJwtPayload>(token);
            setPayload(decodedToken);
            const { id, username, email, is_verified, is_complete } = decodedToken;
            setUser({ id, username, email, is_verified, is_complete });
        } catch (err) {
            setPayload(null);
            setUser(null);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setPayload(null);
        setUser(null);
        setIsAuthenticated(false);
        navigate('/');
    };


    const contextValue = useMemo(
        () => ({ token, user, payload, login, logout, isAuthenticated }),
        [payload, isAuthenticated]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};