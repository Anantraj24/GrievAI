/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { User, UserRole } from '../types';
import { api } from '../api/api';
import { storage } from '../services/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, role?: UserRole, userObj?: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('access_token');
  });
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    return localStorage.getItem('access_token')
      ? storage.get<UserRole>('grievai_current_role', 'student')
      : null;
  });
  const [user, setUser] = useState<User | null>(() => {
    return storage.get<User | null>('grievai_current_user', null);
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (): Promise<User | null> => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const res = await api.get('/auth/me');
      const data = res.data;
      const mappedRole: UserRole = (data.role?.toLowerCase() as UserRole) || 'student';
      const fetchedUser: User = {
        id: data.id,
        name: data.full_name || 'User',
        email: data.email,
        role: mappedRole,
        department: data.department,
        avatar: data.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${data.email}`,
        status: data.is_active ? 'active' : 'suspended',
        isActive: data.is_active,
        joinedDate: data.created_at ? data.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
      };

      setUser(fetchedUser);
      setUserRole(mappedRole);
      setIsAuthenticated(true);
      storage.set('grievai_current_user', fetchedUser);
      storage.set('grievai_current_role', mappedRole);
      return fetchedUser;
    } catch (err) {
      console.warn('Could not fetch backend profile on init:', err);
      // If 401, remove token
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetchProfile();
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUserRole(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (token: string, explicitRole?: UserRole, customUser?: User) => {
    localStorage.setItem('access_token', token);
    setIsAuthenticated(true);

    if (customUser) {
      setUser(customUser);
      setUserRole(customUser.role);
      storage.set('grievai_current_user', customUser);
      storage.set('grievai_current_role', customUser.role);
    } else {
      const liveUser = await fetchProfile();
      if (!liveUser && explicitRole) {
        setUserRole(explicitRole);
        storage.set('grievai_current_role', explicitRole);
      }
    }
  };

  const switchRole = (role: UserRole) => {
    setUserRole(role);
    storage.set('grievai_current_role', role);
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      storage.set('grievai_current_user', updatedUser);
    }
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    storage.set('grievai_current_user', updated);
  };

  const refreshUser = async () => {
    await fetchProfile();
  };

  const logout = () => {
    api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('access_token');
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
    storage.remove('grievai_current_user');
    storage.remove('grievai_current_role');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        user,
        isLoading,
        login,
        logout,
        switchRole,
        updateCurrentUser,
        refreshUser,
      }}
    >
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
