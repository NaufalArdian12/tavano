import React from "react";
import { useSession } from "../../store/session";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token } = useSession();
  const loc = useLocation();
  if (!token) return <Navigate to="/auth" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
}