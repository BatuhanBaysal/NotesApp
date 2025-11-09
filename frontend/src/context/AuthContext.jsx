import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import AuthApiService from '../services/AuthApiService';
import { jwtDecode } from 'jwt-decode'; 

const AuthContext = createContext();

const decodeTokenAndCheckAdmin = (token) => {
    if (!token) return { user: null, isAdmin: false, isAuthenticated: false };
    
    try {
        const decoded = jwtDecode(token);
        
        if (decoded.exp * 1000 < Date.now()) {
            console.warn("Token expired. Clearing token.");
            return { user: null, isAdmin: false, isAuthenticated: false };
        }

        const isAdmin = decoded.authorities 
            ? decoded.authorities.some(auth => auth.authority === 'ROLE_ADMIN')
            : false;
            
        const user = {
            id: decoded.userId, 
            username: decoded.sub, 
            role: isAdmin ? 'ADMIN' : 'USER'
        };
            
        return { user, isAdmin, isAuthenticated: true };

    } catch (e) {
        console.error("Token decoding failed:", e);
        return { user: null, isAdmin: false, isAuthenticated: false };
    }
}

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true); 
    const [token, setToken] = useState(localStorage.getItem('jwtToken'));
    
    const { 
        isAuthenticated: initialAuth, 
        isAdmin: initialAdmin,
        user: initialUser
    } = useMemo(() => decodeTokenAndCheckAdmin(token), [token]);
    
    const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);
    const [isAdmin, setIsAdmin] = useState(initialAdmin); 
    const [user, setUser] = useState(initialUser); 

    useEffect(() => {
        const { isAuthenticated: newAuth, isAdmin: newAdmin, user: newUser } = decodeTokenAndCheckAdmin(token);

        if (!newAuth) {
            localStorage.removeItem('jwtToken');
            setToken(null); 
            setUser(null); 
            setIsAdmin(false); 
        }
        
        setIsAuthenticated(newAuth);
        setIsAdmin(newAdmin); 
        setUser(newUser);
        setIsLoading(false); 

    }, [token]);

    const handleAuthResponse = (newToken) => {
        localStorage.setItem('jwtToken', newToken); 
        setToken(newToken); 
    }

    const login = async (username, password) => {
        try {
            const response = await AuthApiService.login(username, password);
            handleAuthResponse(response.data.token);
            return true; 
        } catch (error) {
            throw error;
        }
    };
    
    const register = async (username, password) => {
        try {
            const response = await AuthApiService.register(username, password);
            handleAuthResponse(response.data.token);
            return true; 
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('jwtToken');
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
    };

    const value = {
        token,
        isAuthenticated,
        isAdmin, 
        user, 
        login,
        register,
        logout,
        setToken,
        isLoading, 
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};