// src/routes/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthCard from "../components/auth/AuthCard";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { registerWithEmail, ensureProfile } from "../lib/auth";
import { useSession } from "../store/session";

export default function Register() {
  const nav = useNavigate();
  const { setToken } = useSession();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const token = await registerWithEmail(email, password, displayName);
      if (!token) {
        // jika verifikasi email ON, user harus cek email → arahkan ke login
        nav("/login", { replace: true });
        return;
      }
      setToken(token);
      await ensureProfile(token); // ⬅️ create/upsert profiles di BE pakai display_name dari metadata
      nav("/", { replace: true });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Gagal daftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Daftar" subtitle="Buat akun untuk simpan progres">
      <div className="space-y-4">
        <Input
          placeholder="Nama panggilan (display name)"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
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
          Daftar
        </Button>
        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link className="underline" to="/login">
            Masuk
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}
