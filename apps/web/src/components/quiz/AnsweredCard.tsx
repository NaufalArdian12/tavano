import { useState } from "react";
import { api } from "../../lib/api";
import { motion } from "framer-motion";
import { useSession } from "../../store/session";

type GradeRes = { label: "BENAR"|"HAMPIR_BENAR"|"PERLU_REVISI"; feedback: string };

export default function AnswerCard({ quizId }: { quizId: string }) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<GradeRes | null>(null);
  const { token } = useSession();

  const submit = async () => {
    if (!token) { alert("Login dulu ya"); return; }
    const data = await api<GradeRes>("/api/ai/grade", token, { quizId, answer });
    setResult(data);
  };

  const color = result?.label === "BENAR" ? "bg-green-100"
    : result?.label === "HAMPIR_BENAR" ? "bg-yellow-100"
    : result?.label === "PERLU_REVISI" ? "bg-gray-100" : "bg-transparent";

  return (
    <div className="space-y-3">
      <textarea
        value={answer}
        onChange={(e)=>setAnswer(e.target.value)}
        placeholder="Tulis jawabanmu di sini..."
        className="w-full h-32 p-3 border rounded-xl"
      />
      <button onClick={submit} className="px-4 py-2 rounded-lg bg-black text-white">
        Cek Jawaban
      </button>
      {result && (
        <motion.div
          initial={{opacity:0, y:8}}
          animate={{opacity:1, y:0}}
          className={`p-3 rounded-xl ${color}`}
        >
          <p className="text-sm font-semibold">{result.label.replace("_"," ")}</p>
          <p className="text-sm">{result.feedback}</p>
        </motion.div>
      )}
    </div>
  );
}
