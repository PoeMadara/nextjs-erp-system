
"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getEmpleadoByEmail, addEmpleado as addUserToMockData } from '@/lib/mockData'; // Renamed for clarity
import type { Empleado } from '@/types'; // Empleado serves as our User type

interface User { // Simplified User type for context, matching Empleado's relevant fields
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, name?: string, id?: string) => void; // name/id optional if fetched
  logout: () => void;
  register: (name: string, email: string, password?: string) => Promise<{ success: boolean; message?: string }>; // Password not stored in mock
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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

  const login = useCallback(async (email: string, name?: string, id?: string) => {
    // In a real app, you'd verify password against a backend.
    // For mock, we might fetch user details if not provided.
    let userData: User | undefined = user;

    if (!userData || userData.email !== email) {
        const existingUser = await getEmpleadoByEmail(email);
        if (existingUser) {
            userData = { id: existingUser.id, name: existingUser.nombre, email: existingUser.email };
        } else if (name && id) { // If user explicitly passed (e.g. after registration)
             userData = { email, name, id };
        }
    }
    
    // Special case for admin@example.com for easy demo login
    if (email === "admin@example.com" && !userData) {
      const adminUser = await getEmpleadoByEmail("admin@example.com");
      if (adminUser) {
        userData = { id: adminUser.id, name: adminUser.nombre, email: adminUser.email };
      } else {
         // If admin not in mockData, create a temporary one for login
        userData = { email, name: name || "Admin ERP", id: id || "EMP001" };
      }
    }


    if (userData) {
      try {
        localStorage.setItem('erpUser', JSON.stringify(userData));
      } catch (error) {
        console.error("Failed to set user in localStorage", error);
      }
      setUser(userData);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } else {
      // Handle login failure (e.g., user not found, or password mismatch in real app)
      console.error("Login failed: User not found or credentials incorrect.");
      // Optionally, show a toast message for login failure
    }
  }, [router, user]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('erpUser');
    } catch (error) {
      console.error("Failed to remove user from localStorage", error);
    }
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  }, [router]);

  const register = useCallback(async (name: string, email: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    // Password is not used in this mock registration, but included for API consistency
    const existingUser = await getEmpleadoByEmail(email);
    if (existingUser) {
      return { success: false, message: "Email already registered." };
    }
    
    // Create a new user (Empleado)
    // The `addEmpleado` function in mockData will generate an ID
    const newUserBase: Omit<Empleado, 'id'> = { nombre: name, email };
    const newEmpleado = await addUserToMockData(newUserBase);

    if (newEmpleado) {
      // Optionally log the user in directly after registration
      // login(newEmpleado.email, newEmpleado.nombre, newEmpleado.id);
      return { success: true, message: "Registration successful! Please log in." };
    } else {
      return { success: false, message: "Failed to register user." };
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname?.startsWith('/dashboard')) {
      router.replace('/login');
    }
    // Allow access to /register even if authenticated, then redirect from register page itself.
    const authAccessRoutes = ['/login', '/forgot-password', '/register'];
    if (!isLoading && isAuthenticated && authAccessRoutes.includes(pathname || '')) {
       if(pathname !== '/register') { // Specific logic for /register is handled on the page itself
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
