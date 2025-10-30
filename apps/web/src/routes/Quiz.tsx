import { useParams } from "react-router-dom";
import AnswerCard from "../components/quiz/AnsweredCard";

export default function Quiz() {
  const { id } = useParams();
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Kuis</h1>
      <p className="text-sm text-gray-600">
        Jawab singkat ya, terus tekan "Cek Jawaban".
      </p>
      {/* id quiz dari params (ganti dgn ID asli dari Supabase) */}
      <AnswerCard quizId={id ?? "QUIZ_ID_TEST"} />
    </main>
  );
}
