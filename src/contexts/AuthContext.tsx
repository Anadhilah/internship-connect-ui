import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export type UserRole = "student" | "recruiter" | "admin";

export interface AppUser {
  id: string;
  email: string | null;
  name: string;
  role: UserRole | null;
  avatar?: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string, role: "student" | "recruiter") => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function fetchProfileAndRole(supaUser: SupabaseUser): Promise<AppUser> {
  const [{ data: profile }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("display_name, avatar_url").eq("id", supaUser.id).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", supaUser.id),
  ]);
  // Prefer admin > recruiter > student if multiple
  const order: UserRole[] = ["admin", "recruiter", "student"];
  const role = (roles || [])
    .map((r) => r.role as UserRole)
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))[0] ?? null;
  return {
    id: supaUser.id,
    email: supaUser.email ?? null,
    name: profile?.display_name || supaUser.user_metadata?.name || supaUser.email || "",
    role,
    avatar: profile?.avatar_url ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Register listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        // Defer DB calls to avoid deadlock in callback
        setTimeout(() => {
          fetchProfileAndRole(newSession.user).then(setUser).catch(() => setUser(null));
        }, 0);
      } else {
        setUser(null);
      }
    });

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      if (existing?.user) {
        fetchProfileAndRole(existing.user).then(setUser).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (name: string, email: string, password: string, role: "student" | "recruiter") => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { display_name: name, name, role },
      },
    });
    if (error) throw error;
  };

  const signInWithGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) throw result.error;
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const refreshRole = async () => {
    if (session?.user) {
      const updated = await fetchProfileAndRole(session.user);
      setUser(updated);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: !!session,
        signInWithPassword,
        signUp,
        signInWithGoogle,
        resetPassword,
        logout,
        refreshRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
