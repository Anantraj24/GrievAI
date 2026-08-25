/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../api/api';

interface User {
  id: string;
  email: string;
  role: string;
  full_name: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // Verify token by fetching user profile
          const res = await api.get('/api/v1/auth/me');
          setUser(res.data);
          setUserRole(res.data.role);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token verification failed", error);
          localStorage.removeItem('access_token');
          setIsAuthenticated(false);
          setUserRole(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token: string, role: string) => {
    localStorage.setItem('access_token', token);
    setIsAuthenticated(true);
    setUserRole(role);
    // Ideally refetch /me here to get full user object, or decode JWT.
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
