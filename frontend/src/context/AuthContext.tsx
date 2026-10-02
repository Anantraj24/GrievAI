/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { User, UserRole } from '../types';
import { api } from '../api/api';
import { storage } from '../services/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, role?: UserRole, userObj?: User) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSession = useCallback(() => {
    localStorage.removeItem('access_token');
    storage.remove('grievai_current_user');
    storage.remove('grievai_current_role');
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
  }, []);

  const fetchProfile = useCallback(async (): Promise<User | null> => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;

    try {
      const res = await api.get('/auth/me');
      const data = res.data;
      const mappedRole: UserRole = (data.role?.toLowerCase() as UserRole) || 'student';

      const fetchedUser: User = {
        id: data.id,
        name: data.full_name || data.email?.split('@')[0] || 'User',
        email: data.email,
        role: mappedRole,
        department: data.department || undefined,
        studentId: data.student_id || undefined,
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
    } catch (err: any) {
      if (err?.response?.status === 401) {
        // Token is invalid/expired — clear the session
        clearSession();
      }
      return null;
    }
  }, [clearSession]);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetchProfile();
      } else {
        clearSession();
      }
      setIsLoading(false);
    };

    initAuth();
  }, [fetchProfile, clearSession]);

  const login = useCallback(async (token: string, explicitRole?: UserRole, customUser?: User): Promise<void> => {
    // Store the new token first (replacing any previous session)
    localStorage.setItem('access_token', token);
    // Clear any cached user from a previous session to avoid stale data
    storage.remove('grievai_current_user');
    storage.remove('grievai_current_role');

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
  }, [fetchProfile]);

  const switchRole = useCallback((role: UserRole) => {
    setUserRole(role);
    storage.set('grievai_current_role', role);
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      storage.set('grievai_current_user', updatedUser);
    }
  }, [user]);

  const updateCurrentUser = useCallback((updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    storage.set('grievai_current_user', updated);
  }, [user]);

  const refreshUser = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  const logout = useCallback(() => {
    api.post('/auth/logout').catch(() => {});
    clearSession();
    window.location.href = '/login';
  }, [clearSession]);

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
