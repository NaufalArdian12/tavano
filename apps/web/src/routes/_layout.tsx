// src/routes/_layout.tsx
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { sb } from "../lib/supabase";
import { useSession } from "../store/session";

export default function AppLayout() {
  const { setToken, setReady } = useSession();

  useEffect(() => {
    (async () => {
      const { data } = await sb.auth.getSession();
      setToken(data.session?.access_token ?? localStorage.getItem("token"));
      setReady(true);
    })();
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      setToken(session?.access_token ?? null);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [setToken, setReady]);

  return (
    <div className="min-h-dvh">
      {/* navbar optional */}
      <Outlet />
    </div>
  );
}
