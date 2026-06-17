import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { ReactNode, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const [orgStatus, setOrgStatus] = useState<"loading" | "none" | "pending" | "approved" | "rejected">("loading");

  const isRecruiter = user?.role === "recruiter";

  useEffect(() => {
    if (!isRecruiter || !user) {
      setOrgStatus("approved");
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("recruiter_orgs")
        .select("status")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (!data) setOrgStatus("none");
      else setOrgStatus((data.status as any) ?? "pending");
    })();
    return () => { cancelled = true; };
  }, [isRecruiter, user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Recruiter gating
  if (isRecruiter) {
    if (orgStatus === "loading") {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }
    const path = location.pathname;
    if (orgStatus === "none" && path !== "/recruiter/onboarding") {
      return <Navigate to="/recruiter/onboarding" replace />;
    }
    if ((orgStatus === "pending" || orgStatus === "rejected") && path !== "/recruiter/pending") {
      return <Navigate to="/recruiter/pending" replace />;
    }
    if (orgStatus === "approved" && (path === "/recruiter/onboarding" || path === "/recruiter/pending")) {
      return <Navigate to="/recruiter" replace />;
    }
  }

  return <>{children}</>;
}
