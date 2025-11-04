export interface User{
    username: string;
    role: 'admin';
}

export interface AuthContextType{
    user: User | null;
    login: (username: string, password: string) => Boolean;
    logout: () => void;
    isAuthenticated: () => Boolean;
}

export interface LoginCredentials{
    username: string;
    password: string;
}