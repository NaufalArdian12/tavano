import { useParams } from "react-router-dom";
import AnswerCardWithSteps from "../components/quiz/AnsweredCardWithSteps";

export default function Quiz() {
  const { id } = useParams();
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Kuis</h1>
      <p className="text-sm text-gray-600">Ceritakan langkahmu lalu isi jawaban akhir.</p>
      {id && <AnswerCardWithSteps quizId={id} />}
    </main>
  );
}
