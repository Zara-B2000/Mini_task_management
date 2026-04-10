"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { loginApi, registerApi } from "@/lib/auth-api";

export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: UserRole,
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check for existing session
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        sessionStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await loginApi(email, password);
      // res: { token, user: { id, username, email, role } }
      if (res && res.token && res.user) {
        const role = res.user.role.toLowerCase();
        setUser({
          id: res.user.id,
          name: res.user.username,
          email: res.user.email,
          role,
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        });
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            id: res.user.id,
            name: res.user.username,
            email: res.user.email,
            role,
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
          }),
        );
        localStorage.setItem("token", res.token);
        return role;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "user",
  ): Promise<boolean> => {
    try {
      const res = await registerApi(name, email, password, role.toUpperCase());
      // res: { id, username, email, role }
      if (res && res.id && res.username && res.email && res.role) {
        setUser({
          id: res.id,
          name: res.username,
          email: res.email,
          role: res.role.toLowerCase(),
          avatar:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        });
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            id: res.id,
            name: res.username,
            email: res.email,
            role: res.role.toLowerCase(),
            avatar:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
          }),
        );
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
