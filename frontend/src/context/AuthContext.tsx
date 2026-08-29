/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { User, UserRole } from '../types';
import { AdminService } from '../services/adminService';
import { storage } from '../services/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, role: UserRole, userObj?: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
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
    if (!localStorage.getItem('access_token')) return null;
    const allUsers = AdminService.getUsers();
    const savedRole = storage.get<UserRole>('grievai_current_role', 'student');
    const defaultUser = allUsers.find((u) => u.role === savedRole) || allUsers[0];
    return storage.get<User | null>('grievai_current_user', defaultUser);
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      return;
    }

    const savedRole = storage.get<UserRole>('grievai_current_role', 'student');
    const allUsers = AdminService.getUsers();
    const defaultUser = allUsers.find((u) => u.role === savedRole) || allUsers[0];

    let savedUser = storage.get<User | null>('grievai_current_user', defaultUser);
    if (savedUser && savedUser.name === 'Anant Sharma') {
      savedUser = { ...savedUser, name: 'AnantRaj', email: 'anantraj@institution.edu' };
      storage.set('grievai_current_user', savedUser);
    }

    setUser(savedUser);
    setUserRole(savedRole);
    setIsAuthenticated(true);
    setIsLoading(false);
  }, []);

  const login = (token: string, role: UserRole, customUser?: User) => {
    const allUsers = AdminService.getUsers();
    const targetUser = customUser || allUsers.find((u) => u.role === role) || allUsers[0];

    localStorage.setItem('access_token', token);
    storage.set('grievai_current_role', role);
    storage.set('grievai_current_user', targetUser);

    setIsAuthenticated(true);
    setUserRole(role);
    setUser(targetUser);
  };

  const switchRole = (role: UserRole) => {
    const allUsers = AdminService.getUsers();
    const targetUser = allUsers.find((u) => u.role === role) || allUsers[0];

    localStorage.setItem('access_token', 'jwt_demo_session_' + Date.now());
    storage.set('grievai_current_role', role);
    storage.set('grievai_current_user', targetUser);

    setUserRole(role);
    setUser(targetUser);
    setIsAuthenticated(true);
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    AdminService.saveUser(updated);
    storage.set('grievai_current_user', updated);
  };

  const logout = () => {
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
