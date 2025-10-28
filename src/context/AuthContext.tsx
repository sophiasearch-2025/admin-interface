import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthContextType } from '../types/auth';

// users hardcodeados para el prototipo
const User_Map : Map<string, string> = new Map([
    ['admin', 'admin123'],
    ['test', 'test']
]);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(context === undefined){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps{
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children}) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (username: string, password: string): Boolean =>{
        const userPassword = User_Map.get(username);

        if (userPassword && userPassword === password){
            setUser({
                username,
                role: 'admin'
            });
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    const isAuthenticated = (): Boolean => {
        return user !== null;
    };

    const value: AuthContextType = {
        user,
        login,
        logout,
        isAuthenticated
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
