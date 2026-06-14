import api from "../api/api";
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
        try {
        const url = "/auth/login";
        const data = { email: email, password: _password };
        const LoginPost = await api.post(url, data);
        if (LoginPost.status != 200) throw new Error("An error occurred: Login failed");
        const postResponse = LoginPost.data;
        const postResponseStatus = postResponse.status;
        if (postResponseStatus == 'success') {
            const accessToken: string = postResponse.data.accessToken;
            const userData: User = postResponse.data.user;
            setUser(userData);
            localStorage.setItem("ic_user", JSON.stringify(userData));
            localStorage.setItem("ic_email", JSON.stringify(userData.email));
            localStorage.setItem("ic_name", JSON.stringify(userData.name));
            localStorage.setItem("ic_role", JSON.stringify(userData.role.toLocaleLowerCase()));
            localStorage.setItem("access_token", accessToken); return;
        }
        throw new Error(`Login failed: ${postResponse.data}`);
        

    } catch (error) {
        console.error("Authentication error:", error);
        throw error;
    }
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
