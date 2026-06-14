import { Navigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);

  console.log("ProtectedRoute - User:", user);
  const userRole_ = user?.role.toLocaleLowerCase();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user || !allowedRoles.includes(user.role.toLowerCase() as UserRole)) return <Navigate to="/" replace />;

  return <>{children}</>;
}
