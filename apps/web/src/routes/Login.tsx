// src/routes/Login.tsx
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { loginWithEmail, ensureProfile } from "../lib/auth";
import { useSession } from "../store/session";

export default function Login() {
  const nav = useNavigate();
  const loc = useLocation();
  const { setToken } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const token = await loginWithEmail(email, password);
      if (!token) throw new Error("Session kosong. Cek email verifikasi.");
      setToken(token);
      await ensureProfile(token);
      const to = (loc.state as { from?: string } | null)?.from || "/";
      nav(to, { replace: true });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Masuk" subtitle="Lanjutkan belajar pecahan">
      <div className="space-y-4">
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {err && <div className="text-sm text-red-600">{err}</div>}
        <Button onClick={submit} loading={loading}>
          Masuk
        </Button>
        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link className="underline" to="/register">
            Daftar
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
