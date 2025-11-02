import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../../lib/api";
import { useSession } from "../../store/session";

type GradeLabel = "BENAR" | "HAMPIR_BENAR" | "PERLU_REVISI";
type GradeRes = { label: GradeLabel; feedback: string };

type Props = {
  quizId: string;
  quizPrompt?: string; // jika tidak ada, kita fetch otomatis
  minStepsChars?: number;
};

type QuizDTO = {
  id: string;
  prompt: string;
  // field lain kalau perlu…
};

export default function AnswerCardWithSteps({
  quizId,
  quizPrompt,
  minStepsChars = 30,
}: Props) {
  const { token } = useSession();

  // ---- Prompt state (auto-fetch jika props tidak ada) ----
  const [prompt, setPrompt] = useState<string>(quizPrompt ?? "");
  const [promptLoading, setPromptLoading] = useState<boolean>(!quizPrompt);
  const [promptError, setPromptError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;

    async function loadPrompt() {
      if (quizPrompt) {
        setPrompt(quizPrompt);
        setPromptLoading(false);
        setPromptError(null);
        return;
      }
      setPromptLoading(true);
      setPromptError(null);

      try {
        // Coba endpoint RESTful: /api/quizzes/:id
        const res = await fetch(`/api/quizzes/${encodeURIComponent(quizId)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          // fallback: /api/quiz?quizId=...
          const res2 = await fetch(
            `/api/quiz?quizId=${encodeURIComponent(quizId)}`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );
          if (!res2.ok) throw new Error("Gagal memuat soal");
          const data2 = (await res2.json()) as QuizDTO;
          if (!canceled) setPrompt(data2.prompt ?? "");
        } else {
          const data = (await res.json()) as QuizDTO;
          if (!canceled) setPrompt(data.prompt ?? "");
        }
      } catch (e) {
        if (!canceled)
          setPromptError(e instanceof Error ? e.message : "Gagal memuat soal");
      } finally {
        if (!canceled) setPromptLoading(false);
      }
    }

    if (quizId) loadPrompt();
    return () => {
      canceled = true;
    };
  }, [quizId, token, quizPrompt]);

  const [steps, setSteps] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [agreeExplained, setAgreeExplained] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GradeRes | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stepsLeft = Math.max(0, minStepsChars - steps.trim().length);

  const isValid = useMemo(() => {
    return (
      !!quizId &&
      finalAnswer.trim().length > 0 &&
      steps.trim().length >= minStepsChars &&
      agreeExplained
    );
  }, [quizId, finalAnswer, steps, agreeExplained, minStepsChars]);

  const submit = async () => {
    try {
      setError(null);
      if (!token) {
        setError("Login dulu ya.");
        return;
      }
      if (!isValid) return;

      setLoading(true);
      setResult(null);

      // Note: gabungan steps + finalAnswer => numeric fast-path tidak aktif
      const combined = `Langkah: ${steps.trim()} | Jawaban akhir: ${finalAnswer.trim()}`;

      const data = await api<GradeRes>("/api/ai/grade", token, {
        quizId,
        answer: combined,
      });

      setResult(data);
    } catch (e: unknown) {
      if (e instanceof Error) setError(e.message);
      else setError("Gagal menilai jawaban.");
    } finally {
      setLoading(false);
    }
  };

  const color =
    result?.label === "BENAR"
      ? "bg-green-100 border-green-200 text-green-800"
      : result?.label === "HAMPIR_BENAR"
      ? "bg-yellow-100 border-yellow-200 text-yellow-900"
      : result?.label === "PERLU_REVISI"
      ? "bg-gray-100 border-gray-200 text-gray-800"
      : "bg-transparent";

  return (
    <div className="space-y-4">
      {/* Soal */}
      <div className="rounded-xl border p-4 bg-white">
        <p className="text-xs text-gray-500 mb-1">Soal</p>

        {/* Loading state */}
        {promptLoading && (
          <div className="animate-pulse space-y-2">
            <div className="h-3 bg-gray-200 rounded w-5/6" />
            <div className="h-3 bg-gray-200 rounded w-4/6" />
            <div className="h-3 bg-gray-200 rounded w-3/6" />
          </div>
        )}

        {/* Error state */}
        {!promptLoading && promptError && (
          <p className="text-sm text-rose-600">
            {promptError} — pastikan endpoint <code>/api/quizzes/:id</code> tersedia.
          </p>
        )}

        {/* Prompt */}
        {!promptLoading && !promptError && (
          <p className="text-sm leading-relaxed">{prompt || "—"}</p>
        )}
      </div>

      {/* Steps */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Ceritakan langkahmu
        </label>
        <textarea
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          placeholder="Contoh: Samakan penyebut ke 4, jadi 1/2 = 2/4. Lalu 3/4 + 2/4 = 5/4 ..."
          className="w-full h-36 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/30"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <span>Minimal {minStepsChars} karakter</span>
          <span
            className={stepsLeft > 0 ? "text-amber-600" : "text-emerald-600"}
          >
            {stepsLeft > 0 ? `${stepsLeft} lagi` : "cukup"}
          </span>
        </div>
      </div>

      {/* Final answer */}
      <div>
        <label className="block text-sm font-medium mb-1">Jawaban akhir</label>
        <input
          value={finalAnswer}
          onChange={(e) => setFinalAnswer(e.target.value)}
          placeholder="Misal: 1 1/4 atau 5/4"
          className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/30"
        />
        <p className="mt-1 text-xs text-gray-500">
          Boleh 5/4, 1 1/4, atau 1.25
        </p>
      </div>

      {/* Confirm checkbox */}
      <label className="flex items-center gap-2 text-sm select-none">
        <input
          type="checkbox"
          checked={agreeExplained}
          onChange={(e) => setAgreeExplained(e.target.checked)}
        />
        Saya sudah menjelaskan langkahnya.
      </label>

      {/* Action */}
      <div className="flex items-center gap-3">
        <button
          onClick={submit}
          disabled={!isValid || loading || promptLoading}
          className={`px-4 py-2 rounded-lg text-white transition ${
            !isValid || loading || promptLoading
              ? "bg-black/40 cursor-not-allowed"
              : "bg-black hover:bg-black/90"
          }`}
        >
          {loading
            ? "Menilai…"
            : promptLoading
            ? "Memuat Soal…"
            : "Cek Jawaban"}
        </button>
        {error && <span className="text-sm text-rose-600">{error}</span>}
      </div>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={`p-4 border rounded-xl ${color}`}>
            <p className="text-xs uppercase tracking-wide font-semibold">
              {result.label}
            </p>
            <p className="text-sm mt-1">{result.feedback}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
