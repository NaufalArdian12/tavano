// src/components/auth/RequireAuth.tsx
import React from "react";
import { useSession } from "../../store/session";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token, ready } = useSession();
  const loc = useLocation();

  if (!ready) return <div className="p-6 text-sm text-gray-500">Memuat sesi…</div>;
  if (!token) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
}
