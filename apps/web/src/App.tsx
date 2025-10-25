import AnswerCard from "./components/quiz/AnsweredCard";
export default function App() {
  // quizId contoh: ganti id real dari DB
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl mb-4">Tavano – Pecahan</h1>
      <AnswerCard quizId="REPLACE_WITH_QUIZ_ID" />
    </main>
  );
}
