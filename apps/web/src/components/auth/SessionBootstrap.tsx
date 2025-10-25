import { useEffect } from "react";
import { sb } from "../../lib/supabase";
import { useSession } from "../../store/session";

export default function SessionBootstrap({ children }: { children: React.ReactNode }) {
  const { setToken, setReady } = useSession();

  useEffect(() => {
    let unsub: { subscription: { unsubscribe: () => void } } | null = null;

    (async () => {
      try {
        const { data } = await sb.auth.getSession();
        setToken(data.session?.access_token ?? localStorage.getItem("token"));
        const r = sb.auth.onAuthStateChange((_e, session) => {
          setToken(session?.access_token ?? null);
        });
        unsub = r.data;
      } finally {
        setReady(true);
      }
    })();

    return () => {
      unsub?.subscription.unsubscribe();
    };
  }, [setToken, setReady]);

  return <>{children}</>;
}
