
"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getEmpleadoByEmail, addEmpleado as addUserToMockData, updateEmpleado as updateEmpleadoInMockData } from '@/lib/mockData';
import type { Empleado, EmpleadoRole } from '@/types';
import { useTranslation } from '@/hooks/useTranslation'; 

interface User {
  id: string;
  name: string;
  email: string;
  role: EmpleadoRole;
  lastLogin?: string; 
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  isLoading: boolean;
  updateUserInContext: (updatedUserFields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation(); 


  useEffect(() => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem('erpUser');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('erpUser');
    }
    setIsLoading(false);
  }, []);

  const updateUserInContext = useCallback((updatedUserFields: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedUserFields };
      try {
        localStorage.setItem('erpUser', JSON.stringify(newUser));
      } catch (error) {
        console.error("Failed to update user in localStorage", error);
      }
      return newUser;
    });
  }, []);

  const login = useCallback(async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    
    const targetEmpleado: Empleado | undefined = await getEmpleadoByEmail(email);

    if (targetEmpleado) {
      if (targetEmpleado.password && password !== targetEmpleado.password) {
          setIsLoading(false);
          return { success: false, message: t('loginPage.loginFailed') };
      }
      
      if (targetEmpleado.isBlocked) {
        setIsLoading(false);
        return { success: false, message: t('loginPage.userBlocked') };
      }
      
      const lastLoginTime = new Date().toISOString();
      const userData: User = { 
        id: targetEmpleado.id, 
        name: targetEmpleado.nombre, 
        email: targetEmpleado.email,
        role: targetEmpleado.role,
        lastLogin: lastLoginTime,
      };
      try {
        localStorage.setItem('erpUser', JSON.stringify(userData));
        // Update lastLogin in mockData as well
        await updateEmpleadoInMockData(targetEmpleado.id, { lastLogin: lastLoginTime }, targetEmpleado.id, t, true); // true to skip logging
      } catch (error) {
        console.error("Failed to set user in localStorage or update mockData", error);
        setIsLoading(false);
        return { success: false, message: t('common.error') };
      }
      setUser(userData);
      setIsAuthenticated(true);
      setIsLoading(false);
      router.push('/dashboard'); 
      return { success: true };
    } else {
      setIsLoading(false);
      return { success: false, message: t('loginPage.loginFailed') };
    }
  }, [router, t]);

  const logout = useCallback(() => {
    setIsLoading(true);
    try {
      localStorage.removeItem('erpUser');
    } catch (error) {
      console.error("Failed to remove user from localStorage", error);
    }
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    router.push('/login');
  }, [router]);

  const register = useCallback(async (name: string, email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const existingUser = await getEmpleadoByEmail(email);
    if (existingUser) {
      setIsLoading(false);
      return { success: false, message: t('registerPage.emailExistsError') };
    }
    
    const newEmpleadoData: Partial<Empleado> = { 
        nombre: name, 
        email, 
        password, 
        bio: '', 
        emailNotifications: true,
        lastLogin: new Date().toISOString() 
    };
    
    const newEmpleado = await addUserToMockData(newEmpleadoData as Omit<Empleado, 'id' | 'isBlocked' | 'role' | 'avatarColor'> & {password?: string, role?: EmpleadoRole});

    setIsLoading(false);
    if (newEmpleado) {
      return { success: true, message: t('registerPage.registrationSuccessMessage') };
    } else {
      return { success: false, message: t('registerPage.genericError') };
    }
  }, [t]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname?.startsWith('/dashboard')) {
      router.replace('/login');
    }
    const authAccessRoutes = ['/login', '/forgot-password', '/register'];
    if (!isLoading && isAuthenticated && authAccessRoutes.includes(pathname || '')) {
       if(pathname !== '/register' || (pathname === '/register' && !router.asPath.includes('?fromSuccess=true')) ) { 
         router.replace('/dashboard');
       }
    }
  }, [isAuthenticated, isLoading, pathname, router]);


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, isLoading, updateUserInContext }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
