import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithEmail, registerWithEmail } from "../lib/auth";
import { useSession } from "../store/session";

export default function AuthPage() {
  const nav = useNavigate();
  const { setToken } = useSession();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const token =
        mode === "login"
          ? await loginWithEmail(email, password)
          : await registerWithEmail(email, password);
      if (token) {
        setToken(token);
        nav("/");
      } else {
        nav("/"); // atau tampilkan info "cek email verifikasi"
      }
    } catch (e: unknown) {
      if (e instanceof Error) setErr(e.message);
      else setErr("Gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
        {/* Header */}
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-1">
          {mode === "login" ? "Selamat Datang Kembali" : "Buat Akun Baru"}
        </h1>
        <p className="text-center text-gray-500 mb-8">
          {mode === "login"
            ? "Masuk untuk melanjutkan"
            : "Daftar dalam sekejap"}
        </p>

        {/* Input & Form Area */}
        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-400"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-400"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Error Message */}
          {err && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {err}
            </div>
          )}

          {/* Submit Button */}
          <button
            disabled={loading}
            onClick={submit}
            className={`w-full py-3 rounded-lg font-semibold text-white transition duration-200 ease-in-out 
              ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
              }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : mode === "login" ? (
              "Masuk"
            ) : (
              "Daftar"
            )}
          </button>
        </div>

        {/* Mode Toggle */}
        <p className="text-center mt-6 text-sm text-gray-600">
          {mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}
          <button
            className="ml-1 font-medium text-blue-600 hover:text-blue-700 hover:underline transition duration-150 ease-in-out"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Daftar Sekarang" : "Masuk"}
          </button>
        </p>
      </div>
    </div>
  );
}
