import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { JwtPayload, jwtDecode } from 'jwt-decode';

interface CustomJwtPayload extends JwtPayload {
    name?: string;
    email?: string;
}
interface AuthContextType {
    user: any;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [user, setUser] = useState<any | null>(() => {
        if (!token) return null;
        try {
            const decodedToken = jwtDecode<CustomJwtPayload>(token);
            return decodedToken;
        } catch (err) {
            setUser(null);
        }
    }
    );
    const navigate = useNavigate();



    const login = (token: string) => {
        localStorage.setItem('token', token);
        setToken(token);
        setIsAuthenticated(!!token);

        if (!token) return setUser(null);
        try {
            const decodedToken = jwtDecode<CustomJwtPayload>(token);
            setUser(decodedToken);
        } catch (err) {
            setUser(null);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/');
    };


    const contextValue = useMemo(
        () => ({ user, login, logout, isAuthenticated }),
        [user, isAuthenticated]
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