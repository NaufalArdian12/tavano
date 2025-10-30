import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../../lib/api";
import { useSession } from "../../store/session";

type GradeLabel = "BENAR" | "HAMPIR_BENAR" | "PERLU_REVISI";
type GradeRes = { label: GradeLabel; feedback: string };

type Props = {
  quizId: string;
  quizPrompt?: string; // opsional: kalau kamu sudah fetch prompt di parent
  minStepsChars?: number; // default 30
};

export default function AnswerCardWithSteps({
  quizId,
  quizPrompt,
  minStepsChars = 30,
}: Props) {
  const { token } = useSession();

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

      // gabungkan jadi satu string agar backend bisa membaca langkah + final answer
      const combined = `Langkah: ${steps.trim()} | Jawaban akhir: ${finalAnswer.trim()}`;

      const data = await api<GradeRes>("/api/ai/grade", token, {
        quizId,
        answer: combined,
      });

      setResult(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Gagal menilai jawaban.");
      }
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
      {quizPrompt && (
        <div className="rounded-xl border p-4 bg-white">
          <p className="text-xs text-gray-500 mb-1">Soal</p>
          <p className="text-sm leading-relaxed">{quizPrompt}</p>
        </div>
      )}

      {/* Steps / Explanation */}
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

      {/* Final Answer */}
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

      {/* Confirmation */}
      <label className="flex items-center gap-2 text-sm select-none">
        <input
          type="checkbox"
          checked={agreeExplained}
          onChange={(e) => setAgreeExplained(e.target.checked)}
        />
        Saya sudah menjelaskan langkahnya.
      </label>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={submit}
          disabled={!isValid || loading}
          className={`px-4 py-2 rounded-lg text-white transition ${
            !isValid || loading
              ? "bg-black/40 cursor-not-allowed"
              : "bg-black hover:bg-black/90"
          }`}
        >
          {loading ? "Menilai…" : "Cek Jawaban"}
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
              {result.label.replace("_", " ")}
            </p>
            <p className="text-sm mt-1">{result.feedback}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
