"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getEmpleadoByEmail, addEmpleado as addUserToMockData } from '@/lib/mockData';
import type { Empleado } from '@/types';
import { useTranslation } from '@/hooks/useTranslation'; // Import useTranslation

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  // const { t } = useTranslation(); // Cannot use useTranslation here directly as AuthProvider wraps LanguageProvider

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

  const login = useCallback(async (email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    
    const targetEmpleado: Empleado | undefined = await getEmpleadoByEmail(email);

    if (targetEmpleado) {
      const userData: User = { id: targetEmpleado.id, name: targetEmpleado.nombre, email: targetEmpleado.email };
      try {
        localStorage.setItem('erpUser', JSON.stringify(userData));
      } catch (error) {
        console.error("Failed to set user in localStorage", error);
        setIsLoading(false);
        // Note: Cannot use t() here directly for "A storage error occurred."
        return { success: false, message: "A storage error occurred. Please try again." };
      }
      setUser(userData);
      setIsAuthenticated(true);
      setIsLoading(false);
      router.push('/dashboard'); 
      return { success: true };
    } else {
      setIsLoading(false);
      // Note: Cannot use t() here directly
      return { success: false, message: "Invalid credentials. User not found." };
    }
  }, [router]);

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
      // Note: Cannot use t() here directly
      return { success: false, message: "Email already registered." };
    }
    
    const newUserBase: Omit<Empleado, 'id'> = { nombre: name, email };
    const newEmpleado = await addUserToMockData(newUserBase);

    setIsLoading(false);
    if (newEmpleado) {
      // Note: Cannot use t() here directly
      return { success: true, message: "Registration successful! Please log in." };
    } else {
      // Note: Cannot use t() here directly
      return { success: false, message: "Failed to register user." };
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname?.startsWith('/dashboard')) {
      router.replace('/login');
    }
    const authAccessRoutes = ['/login', '/forgot-password', '/register'];
    if (!isLoading && isAuthenticated && authAccessRoutes.includes(pathname || '')) {
       if(pathname !== '/register') { 
         router.replace('/dashboard');
       }
    }
  }, [isAuthenticated, isLoading, pathname, router]);


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, isLoading }}>
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
