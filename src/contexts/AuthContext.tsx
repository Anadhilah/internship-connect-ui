import React, { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type UserRole = "student" | "recruiter" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: "student" | "recruiter") => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: Record<string, User & { password: string }> = {
  "student@test.com": { id: "1", name: "Alex Johnson", email: "student@test.com", password: "password", role: "student" },
  "recruiter@test.com": { id: "2", name: "Sarah Chen", email: "recruiter@test.com", password: "password", role: "recruiter" },
  "admin@test.com": { id: "3", name: "Admin User", email: "admin@test.com", password: "password", role: "admin" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("ic_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, _password: string) => {
    const found = mockUsers[email];
    if (!found) throw new Error("Invalid credentials");
    const { password: _, ...userData } = found;
    setUser(userData);
    localStorage.setItem("ic_user", JSON.stringify(userData));
  };

  const register = async (name: string, email: string, _password: string, role: "student" | "recruiter") => {
    const newUser: User = { id: Date.now().toString(), name, email, role };
    setUser(newUser);
    localStorage.setItem("ic_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ic_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
