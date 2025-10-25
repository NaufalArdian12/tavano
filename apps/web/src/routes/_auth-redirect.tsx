import { Navigate, useLocation } from "react-router-dom";
import { useSession } from "../store/session";

type AuthLocationState = {
  from?: string;
};

export default function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { token } = useSession();
  const loc = useLocation();
  const state = loc.state as AuthLocationState | null;
  const to = state?.from || "/";

  if (token) {
    return <Navigate to={to} replace />;
  }
  return <>{children}</>;
}
