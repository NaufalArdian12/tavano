import { Link } from "react-router-dom";
import { useSession } from "../store/session";

export default function Nav() {
  const { token, setToken } = useSession();
  return (
    <nav className="w-full border-b">
      <div className="max-w-5xl mx-auto p-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">Tavano</Link>
        <div className="flex items-center gap-3 text-sm">
          <Link to="/dashboard" className="underline">Dashboard</Link>
          {token ? (
            <button onClick={()=>setToken(null)} className="px-2 py-1 rounded border">Logout</button>
          ) : (
            <Link to="/auth" className="px-2 py-1 rounded bg-black text-white">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
